---
title: "Connect Goose"
summary: "Set up Goose to connect through your gateway."
---

# Connect Goose

Use these settings to configure Goose as a Client for your gateway.

## MCP setup

**Status:** documented
**Checked:** 2026-10-13

**Authentication:** Sign in or use a Key.

### Settings

- **Server URL:** `https://<your gateway>/mcp`

### Steps

1. Run goose configure, then Add Extension, then Remote Extension (Streamable HTTP).
2. Paste the server address. Goose opens a browser to sign in.
3. Or add the header Authorization: Bearer <your key>.

Source: [Goose's own documentation](<https://goose-docs.ai/docs/getting-started/using-extensions/>)
