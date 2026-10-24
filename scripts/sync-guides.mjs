import { copyFile, mkdir, readFile, writeFile } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const sourcePath = process.argv[2];
if (!sourcePath) {
  console.error('Usage: node scripts/sync-guides.mjs <gateway>/web/src/lib/app-guides.json');
  process.exit(2);
}

const guidesPath = resolve(sourcePath);
const gatewayRoot = resolve(dirname(guidesPath), '../../..');
const mcpServerPath = join(gatewayRoot, 'gateway/mcp_server.py');
const sttSamplesPath = join(gatewayRoot, 'gateway/stt_samples.py');
const pythonPath = join(gatewayRoot, 'venv/bin/python');
const siteRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const dataDir = join(siteRoot, 'src/data');
const guideDestination = join(dataDir, 'app-guides.json');
const toolsDestination = join(dataDir, 'mcp-tools.json');

const source = await readFile(guidesPath, 'utf8');
const guides = JSON.parse(source);
if (typeof guides.checked !== 'string' || !Array.isArray(guides.apps)) {
  throw new Error('The source must contain a checked date and an apps array.');
}

const ids = new Set();
const credentialLike = /\b(?:opk|oak)_[A-Za-z0-9_-]{12,}\b|\bsk-[A-Za-z0-9]{24,}\b/i;
const addressLike = /\b(?:localhost|127\.0\.0\.1|10(?:\.\d{1,3}){3}|192\.168(?:\.\d{1,3}){2}|172\.(?:1[6-9]|2\d|3[01])(?:\.\d{1,3}){2})\b/i;
const sourceText = JSON.stringify(guides);
if (credentialLike.test(sourceText)) {
  throw new Error('A credential-like value is present in the guide data; sync stopped.');
}

for (const app of guides.apps) {
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(app.id) || ids.has(app.id)) {
    throw new Error('Guide IDs must be unique lowercase URL segments.');
  }
  ids.add(app.id);
  if (typeof app.name !== 'string' || typeof app.kind !== 'string') {
    throw new Error('Each guide must have a name and kind.');
  }
  for (const kind of ['key', 'mcp']) {
    const guide = app[kind];
    if (!guide) continue;
    if (!['documented', 'unverified'].includes(guide.status) || !Array.isArray(guide.steps)) {
      throw new Error('Each key or MCP guide must have a supported status and steps.');
    }
    if (guide.fields && !Array.isArray(guide.fields)) {
      throw new Error('Guide fields must be an array.');
    }
    for (const field of guide.fields ?? []) {
      if (typeof field.label !== 'string' || typeof field.value !== 'string') {
        throw new Error('Each guide field must have a label and value.');
      }
      if (credentialLike.test(field.value) || addressLike.test(field.value) || /https?:\/\//i.test(field.value)) {
        throw new Error('A guide field contains a credential or address; sync stopped.');
      }
    }
    for (const step of [...guide.steps, ...(guide.note ? [guide.note] : [])]) {
      if (credentialLike.test(step) || addressLike.test(step)) {
        throw new Error('A guide step contains a credential or address; sync stopped.');
      }
    }
  }
}

const extractor = [
  'import ast',
  'import json',
  'import sys',
  'from pathlib import Path',
  '',
  'server_path, samples_path = sys.argv[1:3]',
  '',
  'def assigned_name(target, name):',
  '    if isinstance(target, ast.Name):',
  '        return target.id == name',
  '    if isinstance(target, (ast.Tuple, ast.List)):',
  '        return any(assigned_name(item, name) for item in target.elts)',
  '    return False',
  '',
  'def text_value(node, constants):',
  '    if isinstance(node, ast.Constant) and isinstance(node.value, str):',
  '        return node.value',
  '    if isinstance(node, ast.Name) and node.id in constants:',
  '        return constants[node.id]',
  '    if isinstance(node, ast.BinOp) and isinstance(node.op, ast.Add):',
  '        return text_value(node.left, constants) + text_value(node.right, constants)',
  '    raise ValueError("unsupported string expression")',
  '',
  'sample_tree = ast.parse(Path(samples_path).read_text())',
  'constants = {}',
  'for statement in sample_tree.body:',
  '    if isinstance(statement, ast.Assign):',
  '        if any(assigned_name(target, "RIGHTS_CAVEAT") for target in statement.targets):',
  '            constants["RIGHTS_CAVEAT"] = text_value(statement.value, constants)',
  '    elif isinstance(statement, ast.AnnAssign) and assigned_name(statement.target, "RIGHTS_CAVEAT"):',
  '        constants["RIGHTS_CAVEAT"] = text_value(statement.value, constants)',
  '',
  'def tool_fields(node):',
  '    if not isinstance(node, ast.Dict):',
  '        return None',
  '    values = {}',
  '    for key, value in zip(node.keys, node.values):',
  '        if isinstance(key, ast.Constant) and key.value in ("name", "title", "description"):',
  '            values[key.value] = text_value(value, constants)',
  '    if not all(name in values for name in ("name", "title", "description")):',
  '        return None',
  '    return values',
  '',
  'tree = ast.parse(Path(server_path).read_text())',
  'tools = []',
  'for statement in tree.body:',
  '    if isinstance(statement, ast.AnnAssign) and assigned_name(statement.target, "TOOLS") and isinstance(statement.value, ast.List):',
  '        tools.extend(item for item in (tool_fields(node) for node in statement.value.elts) if item)',
  '    elif isinstance(statement, ast.Expr) and isinstance(statement.value, ast.Call):',
  '        call = statement.value',
  '        if (isinstance(call.func, ast.Attribute) and isinstance(call.func.value, ast.Name)',
  '                and call.func.value.id == "TOOLS" and call.func.attr == "append" and call.args):',
  '            item = tool_fields(call.args[0])',
  '            if item:',
  '                tools.append(item)',
  '',
  'if not tools:',
  '    raise SystemExit("No MCP tool definitions were found.")',
  'print(json.dumps(tools, ensure_ascii=False, indent=2))',
].join('\n');

await mkdir(dataDir, { recursive: true });
const toolsJson = execFileSync(
  pythonPath,
  ['-c', extractor, mcpServerPath, sttSamplesPath],
  { encoding: 'utf8' },
);
const tools = JSON.parse(toolsJson);
await copyFile(guidesPath, guideDestination);
await writeFile(toolsDestination, JSON.stringify(tools, null, 2) + '\n');
console.log('Synced ' + guides.apps.length + ' client guides and ' + tools.length + ' MCP tools (checked ' + guides.checked + ').');
