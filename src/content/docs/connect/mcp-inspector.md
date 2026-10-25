---
title: "Connect MCP Inspector"
summary: "Set up MCP Inspector to connect through your gateway."
---

# Connect MCP Inspector

Use these settings to configure MCP Inspector as a Client for your gateway.

## MCP setup

**Status:** documented
**Checked:** 2026-10-13

**Authentication:** Sign in or use a Key.

### Settings

- **Server URL:** `https://<your gateway>/mcp`

### Steps

1. Run: npx @modelcontextprotocol/inspector
2. Choose Streamable HTTP, paste the server address and connect. Use the OAuth flow to sign in, or add an Authorization header.

Source: [MCP Inspector's own documentation](<https://modelcontextprotocol.io/docs/tools/inspector>)
