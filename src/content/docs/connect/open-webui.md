---
title: "Connect Open WebUI"
summary: "Set up Open WebUI to connect through your gateway."
---

# Connect Open WebUI

Use these settings to configure Open WebUI as a Client for your gateway.

## Key setup

**Status:** documented
**Checked:** 2026-10-13

### Settings

- **URL:** `https://<your gateway>/openai/v1`
- **API Key:** `<your key>`
- **Model IDs:** `<model name>`

### Steps

1. Open Admin Panel, then Settings, then Connections.
2. Under OpenAI API, choose Add Connection.
3. Fill in these fields, then choose Verify Connection and Save.

> Note: Tested with Open WebUI v0.11.4 using host networking and non-streaming.

Source: [Open WebUI's own documentation](<https://docs.openwebui.com/getting-started/quick-start/connect-a-provider/starting-with-openai-compatible/>)

## MCP setup

**Status:** documented
**Checked:** 2026-10-13

**Authentication:** Sign in or use a Key.

### Settings

- **Server URL:** `https://<your gateway>/mcp`

### Steps

1. An admin adds an MCP (Streamable HTTP) tool server with the server address.
2. Choose OAuth 2.1 (dynamic registration) so each person signs in, or Bearer with a key.
3. Do not choose the OAuth or Session modes: they send Open WebUI's own sign-in, which this server refuses.

Source: [Open WebUI's own documentation](<https://docs.openwebui.com/features/extensibility/mcp/>)
