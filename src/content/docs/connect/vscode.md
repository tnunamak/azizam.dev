---
title: "Connect VS Code"
summary: "Set up VS Code to connect through your gateway."
---

# Connect VS Code

Use these settings to configure VS Code as a Client for your gateway.

## MCP setup

**Status:** documented
**Checked:** 2026-10-13

**Authentication:** Sign in or use a Key.

### Settings

- **Server URL:** `https://<your gateway>/mcp`

### Steps

1. Run MCP: Add Server, choose HTTP and paste the server address.
2. VS Code asks you to sign in and approve.
3. Or use a key through a headers entry with an input variable.

Source: [VS Code's own documentation](<https://code.visualstudio.com/docs/agents/reference/mcp-configuration>)
