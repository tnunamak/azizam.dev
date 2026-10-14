import { defineConfig } from "astro/config";
import { unified } from "@astrojs/markdown-remark";
import tailwindcss from "@tailwindcss/vite";
import docsLinks from "./src/plugins/docs-links.mjs";
import docsHtml from "./src/plugins/docs-html.mjs";

export default defineConfig({
  site: "https://azizam.dev",
  output: "static",
  markdown: {
    // The docs plugins are remark and rehype plugins, so they need the unified processor.
    processor: unified({ remarkPlugins: [docsLinks], rehypePlugins: [docsHtml] }),
    shikiConfig: { theme: "github-dark-default" },
  },
  vite: {
    plugins: [tailwindcss()],
  },
});
