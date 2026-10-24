import { defineConfig } from "astro/config";
import { unified } from "@astrojs/markdown-remark";
import { readdir, readFile } from "node:fs/promises";
import { join, relative } from "node:path";
import { fileURLToPath } from "node:url";
import tailwindcss from "@tailwindcss/vite";
import docsLinks from "./src/plugins/docs-links.mjs";
import docsHtml from "./src/plugins/docs-html.mjs";

async function htmlFilesIn(directory) {
  const files = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) files.push(...await htmlFilesIn(path));
    else if (entry.isFile() && entry.name.endsWith(".html")) files.push(path);
  }
  return files;
}

const checkDocumentationTokens = {
  name: "check-documentation-template-tokens",
  hooks: {
    "astro:build:done": async ({ dir }) => {
      const output = fileURLToPath(dir);
      const tokenPattern = /(?<!\$)\{[A-Za-z_][A-Za-z0-9_]*\}/g;
      const findings = [];
      for (const path of await htmlFilesIn(output)) {
        const html = await readFile(path, "utf8");
        for (const match of html.matchAll(tokenPattern)) {
          findings.push(`${relative(output, path)}: ${match[0]}`);
        }
      }
      if (findings.length > 0) {
        throw new Error(`Unrendered documentation template tokens:\n${findings.join("\n")}`);
      }
    },
  },
};

export default defineConfig({
  site: "https://azizam.dev",
  output: "static",
  integrations: [checkDocumentationTokens],
  markdown: {
    // The docs plugins are remark and rehype plugins, so they need the unified processor.
    processor: unified({ remarkPlugins: [docsLinks], rehypePlugins: [docsHtml] }),
    shikiConfig: { theme: "github-dark-default" },
  },
  vite: {
    plugins: [tailwindcss()],
  },
});
