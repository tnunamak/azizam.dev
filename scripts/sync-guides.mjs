import { mkdir, readFile, readdir, writeFile } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const sourcePath = process.argv[2];
if (!sourcePath || process.argv.length !== 3) {
  console.error('Usage: node scripts/sync-guides.mjs <path-to-app-guides.json>');
  process.exit(2);
}

const source = JSON.parse(await readFile(resolve(sourcePath), 'utf8'));
if (!source || typeof source.checked !== 'string' || !Array.isArray(source.apps)) {
  throw new Error('The source must contain a checked date and an apps array.');
}
if (!/^\d{4}-\d{2}-\d{2}$/.test(source.checked) || Number.isNaN(Date.parse(source.checked))) {
  throw new Error('The source checked date must be YYYY-MM-DD.');
}

const siteRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const docsDir = join(siteRoot, 'src/content/docs/connect');
const safeValues = {
  openai_url: 'https://<your gateway>/openai/v1',
  anthropic_url: 'https://<your gateway>/anthropic',
  mcp_url: 'https://<your gateway>/mcp',
  key: '<your key>',
  token: '<your key>',
  chat_model: '<model name>',
  transcription_model: '<model name>',
};
const templateToken = /(?<!\$)\{([a-z][a-z0-9_-]*)\}/gi;
const unresolvedToken = /(?<!\$)\{[a-z][a-z0-9_-]*\}/i;
const credentialLike = /\b(?:opk|oak)_[A-Za-z0-9_-]{12,}\b|\bsk-[A-Za-z0-9]{24,}\b|\bBearer\s+[A-Za-z0-9._~+/-]{16,}/i;
const privateAddress = /\b(?:localhost|127\.\d{1,3}\.\d{1,3}\.\d{1,3}|10\.\d{1,3}\.\d{1,3}\.\d{1,3}|192\.168\.\d{1,3}\.\d{1,3}|172\.(?:1[6-9]|2\d|3[01])\.\d{1,3}\.\d{1,3})\b/i;
const backtick = String.fromCharCode(96);

function replaceTokens(value) {
  return value.replace(templateToken, (token, name) => {
    const replacement = safeValues[name.toLowerCase()];
    if (!replacement) throw new Error('Unsupported guide placeholder ' + token + '.');
    return replacement;
  });
}

function validateGuide(client, kind, guide) {
  if (!guide || typeof guide !== 'object') throw new Error(client.id + ': ' + kind + ' guide must be an object.');
  if (!['documented', 'unverified'].includes(guide.status)) {
    throw new Error(client.id + ': ' + kind + ' status must be documented or unverified.');
  }
  if (!Array.isArray(guide.steps) || guide.steps.length === 0 || guide.steps.some((step) => typeof step !== 'string')) {
    throw new Error(client.id + ': ' + kind + ' guide must contain text steps.');
  }
  if (guide.fields !== undefined && (!Array.isArray(guide.fields) || guide.fields.some((field) =>
    !field || typeof field.label !== 'string' || typeof field.value !== 'string'))) {
    throw new Error(client.id + ': ' + kind + ' fields must contain string labels and values.');
  }
  if (guide.note !== undefined && typeof guide.note !== 'string') {
    throw new Error(client.id + ': ' + kind + ' note must be text.');
  }
  if (guide.snippet !== undefined && (!guide.snippet || typeof guide.snippet.language !== 'string' ||
    typeof guide.snippet.code !== 'string' || !/^[a-z0-9+-]+$/i.test(guide.snippet.language))) {
    throw new Error(client.id + ': ' + kind + ' snippet must contain a language and code.');
  }
  if (guide.auth !== undefined && !['sign-in', 'sign-in-or-key'].includes(guide.auth)) {
    throw new Error(client.id + ': ' + kind + ' has an unsupported authentication label.');
  }
  if (guide.docs !== undefined) {
    const docs = Array.isArray(guide.docs) ? guide.docs : [guide.docs];
    if (docs.some((url) => {
      if (typeof url !== 'string') return true;
      try {
        const parsed = new URL(url);
        return parsed.protocol !== 'https:' || Boolean(parsed.username || parsed.password);
      } catch {
        return true;
      }
    })) {
      throw new Error(client.id + ': ' + kind + ' documentation links must be HTTPS URLs.');
    }
  }
}

function assertSafePage(clientId, content) {
  if (credentialLike.test(content)) throw new Error(clientId + ': generated content contains a credential-like value.');
  if (privateAddress.test(content)) throw new Error(clientId + ': generated content contains a private address.');
  if (unresolvedToken.test(content)) throw new Error(clientId + ': generated content contains an unresolved template token.');
  if (/\bapp\s+key\b/i.test(content)) throw new Error(clientId + ': use App and Key as separate terms.');
}

function markdownInline(value) {
  return backtick + value.replaceAll(backtick, '\\' + backtick) + backtick;
}

function markdownLinkText(value) {
  return value.replace(/([\\[\]])/g, '\\$1');
}

function renderSources(clientName, docs) {
  if (!docs) return [];
  const links = Array.isArray(docs) ? docs : [docs];
  return links.map((url) =>
    'Source: [' + markdownLinkText(clientName + "'s own documentation") + '](<' + url + '>)',
  );
}

function renderSection(client, kind, guide, checked) {
  const fields = [...(guide.fields ?? [])];
  if (kind === 'mcp' && !fields.some((field) => field.value.includes('{mcp_url}'))) {
    fields.unshift({ label: 'Server URL', value: '{mcp_url}' });
  }
  const lines = [
    '## ' + (kind === 'key' ? 'Key setup' : 'MCP setup'),
    '',
    '**Status:** ' + guide.status,
    '**Checked:** ' + (guide.checked ?? checked),
    '',
  ];

  if (guide.auth) {
    const auth = guide.auth === 'sign-in'
      ? 'Sign in.'
      : 'Sign in or use a Key.';
    lines.push('**Authentication:** ' + auth, '');
  }

  if (fields.length) {
    lines.push('### Settings', '');
    for (const field of fields) {
      lines.push('- **' + markdownLinkText(replaceTokens(field.label)) + ':** ' +
        markdownInline(replaceTokens(field.value)));
    }
    lines.push('');
  }

  lines.push('### Steps', '');
  guide.steps.forEach((step, index) => {
    lines.push((index + 1) + '. ' + replaceTokens(step));
  });
  lines.push('');

  if (guide.snippet) {
    const code = replaceTokens(guide.snippet.code);
    const fence = backtick.repeat(3);
    if (code.includes(fence)) throw new Error(client.id + ': snippet contains a Markdown fence.');
    lines.push('### Example', '', fence + guide.snippet.language.toLowerCase(), code, fence, '');
  }

  if (guide.note) lines.push('> Note: ' + replaceTokens(guide.note), '');
  if (guide.tested) lines.push('> Tested: ' + replaceTokens(String(guide.tested)), '');
  lines.push(...renderSources(client.name, guide.docs), '');
  return lines;
}

function renderClient(client, checked) {
  const lines = [
    '---',
    'title: ' + JSON.stringify('Connect ' + client.name),
    'summary: ' + JSON.stringify('Set up ' + client.name + ' to connect through your gateway.'),
    '---',
    '',
    '# Connect ' + client.name,
    '',
    'Use these settings to configure ' + client.name + ' as a Client for your gateway.',
    '',
  ];
  if (client.key) lines.push(...renderSection(client, 'key', client.key, checked));
  if (client.mcp) lines.push(...renderSection(client, 'mcp', client.mcp, checked));
  return lines.join('\n').trimEnd() + '\n';
}

function renderIndex(clients, checked) {
  const url = markdownInline('https://<your gateway>/openai/v1');
  const key = markdownInline('<your key>');
  const model = markdownInline('<model name>');
  const lines = [
    '---',
    'title: "Connect clients"',
    'summary: "Set up a Client to connect through an App on your gateway."',
    '---',
    '',
    '# Connect clients',
    '',
    'Connecting means configuring a Client, the program you set up, such as Open WebUI. An App is the thing that connects to your gateway. A Key is the secret an app uses.',
    '',
    'The examples use ' + url + ', ' + key + ', and ' + model + '. Replace them with values for your gateway and App.',
    '',
    '**Guide data checked:** ' + checked,
    '',
    '## Client guides',
    '',
  ];
  for (const client of clients) lines.push('- [' + markdownLinkText(client.name) + '](./' + client.id + '.md)');
  return lines.join('\n') + '\n';
}

const ids = new Set();
for (const client of source.apps) {
  if (!client || typeof client.id !== 'string' || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(client.id) || ids.has(client.id)) {
    throw new Error('Guide IDs must be unique lowercase URL segments.');
  }
  ids.add(client.id);
  if (typeof client.name !== 'string' || !client.name.trim() || (!client.key && !client.mcp)) {
    throw new Error(client.id + ': each client needs a name and at least one guide.');
  }
  if (client.key) validateGuide(client, 'key', client.key);
  if (client.mcp) validateGuide(client, 'mcp', client.mcp);
}

const expectedFiles = new Set(['index.md', ...[...ids].map((id) => id + '.md')]);
let existingFiles = [];
try {
  existingFiles = await readdir(docsDir);
} catch (error) {
  if (error.code !== 'ENOENT') throw error;
}
const unexpectedFiles = existingFiles.filter((name) => name.endsWith('.md') && !expectedFiles.has(name));
if (unexpectedFiles.length) {
  throw new Error('Unexpected existing Connect Markdown pages: ' + unexpectedFiles.join(', '));
}

await mkdir(docsDir, { recursive: true });
for (const client of source.apps) {
  const content = renderClient(client, source.checked);
  assertSafePage(client.id, content);
  await writeFile(join(docsDir, client.id + '.md'), content);
}
const index = renderIndex(source.apps, source.checked);
assertSafePage('index', index);
await writeFile(join(docsDir, 'index.md'), index);

const writtenFiles = (await readdir(docsDir)).filter((name) => name.endsWith('.md'));
const expected = [...expectedFiles].sort();
const written = writtenFiles.sort();
if (JSON.stringify(written) !== JSON.stringify(expected)) {
  throw new Error('Generated Connect page set does not match the source IDs.');
}

console.log('Synced ' + ids.size + ' client guides and the Connect index (checked ' + source.checked + ').');
