---
title: "Connect Cursor"
summary: "Set up Cursor to connect through your gateway."
---

# Connect Cursor

Use these settings to configure Cursor as a Client for your gateway.

## Key setup

**Status:** unverified
**Checked:** 2026-10-13

### Settings

- **OpenAI API Key:** `<your key>`
- **Override OpenAI Base URL:** `https://<your gateway>/openai/v1`
- **Add Custom Model:** `<model name>`

### Steps

1. Open Cursor Settings, then Models.
2. Under API Keys, turn on OpenAI API Key and paste your key.
3. Turn on Override OpenAI Base URL and paste the address.
4. Choose Add Custom Model and type the model name exactly.

> Note: Cursor's servers call this address, so it must be reachable from the internet; a home-network address does not work. Your key passes through Cursor's servers. Custom models need a paid Cursor plan, and Tab still uses Cursor's own models. Cursor's documentation does not describe the address override, so these steps come from third-party guides.

Source: [Cursor's own documentation](<https://cursor.com/help/models-and-usage/api-keys>)

## MCP setup

**Status:** documented
**Checked:** 2026-10-13

**Authentication:** Sign in or use a Key.

### Settings

- **Server URL:** `https://<your gateway>/mcp`

### Steps

1. Add the server to mcp.json: {"mcpServers": {"azizam": {"url": "https://<your gateway>/mcp"}}}
2. Cursor asks you to sign in the first time it connects.
3. Or use a key: add "headers": {"Authorization": "Bearer <your key>"}.

Source: [Cursor's own documentation](<https://cursor.com/docs/mcp>)
