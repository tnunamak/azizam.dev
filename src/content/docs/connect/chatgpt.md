---
title: "Connect ChatGPT"
summary: "Set up ChatGPT to connect through your gateway."
---

# Connect ChatGPT

Use these settings to configure ChatGPT as a Client for your gateway.

## MCP setup

**Status:** documented
**Checked:** 2026-10-13

**Authentication:** Sign in.

### Settings

- **Server URL:** `https://<your gateway>/mcp`

### Steps

1. Add a custom MCP server. Current layouts: Plugins, then Add custom MCP server. Older workspace layouts: Settings, Apps, Create (developer mode).
2. Paste the server address and choose OAuth.
3. Leave the OAuth client ID and secret empty.
4. Create it, then sign in and approve when asked.

> Note: ChatGPT takes no API key. Your plan and workspace decide whether custom servers are available.

Source: [ChatGPT's own documentation](<https://developers.openai.com/api/docs/guides/custom-mcp-server>)
