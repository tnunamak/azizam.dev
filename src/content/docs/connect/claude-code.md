---
title: "Connect Claude Code"
summary: "Set up Claude Code to connect through your gateway."
---

# Connect Claude Code

Use these settings to configure Claude Code as a Client for your gateway.

## Key setup

**Status:** documented
**Checked:** 2026-10-13

### Settings

- **ANTHROPIC_BASE_URL:** `https://<your gateway>/anthropic`
- **ANTHROPIC_AUTH_TOKEN:** `<your key>`
- **ANTHROPIC_MODEL:** `<model name>`

### Steps

1. In the shell that starts Claude Code, set GATEWAY_API_KEY to your key.
2. Run these commands, then check /status in Claude Code to confirm the address.

### Example

```shell
export ANTHROPIC_BASE_URL='https://<your gateway>/anthropic'
export ANTHROPIC_AUTH_TOKEN="$GATEWAY_API_KEY"
export ANTHROPIC_MODEL='<model name>'
export ANTHROPIC_DEFAULT_HAIKU_MODEL='<model name>'
claude
```

Source: [Claude Code's own documentation](<https://code.claude.com/docs/en/llm-gateway-connect>)

## MCP setup

**Status:** documented
**Checked:** 2026-10-13

**Authentication:** Sign in or use a Key.

### Settings

- **Server URL:** `https://<your gateway>/mcp`

### Steps

1. Run: claude mcp add --transport http azizam https://<your gateway>/mcp
2. Run /mcp in Claude Code and choose Authenticate to sign in.
3. Or use a key: add --header "Authorization: Bearer <your key>".

Source: [Claude Code's own documentation](<https://code.claude.com/docs/en/mcp>)
