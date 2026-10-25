---
title: "Connect Claude.ai and Claude Desktop"
summary: "Set up Claude.ai and Claude Desktop to connect through your gateway."
---

# Connect Claude.ai and Claude Desktop

Use these settings to configure Claude.ai and Claude Desktop as a Client for your gateway.

## MCP setup

**Status:** documented
**Checked:** 2026-10-13

**Authentication:** Sign in.

### Settings

- **Server URL:** `https://<your gateway>/mcp`

### Steps

1. Open Customize, then Connectors, then Add custom connector. On Team and Enterprise plans an owner adds it under Organization settings, Connectors first.
2. Paste the server address. Leave the advanced OAuth client ID and secret empty and add no request headers.
3. Select Connect, sign in and approve.

> Note: Each person connects with their own sign-in, so each gets their own plan.

Source: [Claude.ai and Claude Desktop's own documentation](<https://claude.com/docs/connectors/custom/add-unlisted>)
