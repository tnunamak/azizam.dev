---
title: "Connect LibreChat"
summary: "Set up LibreChat to connect through your gateway."
---

# Connect LibreChat

Use these settings to configure LibreChat as a Client for your gateway.

## Key setup

**Status:** documented
**Checked:** 2026-10-13

### Settings

- **baseURL:** `https://<your gateway>/openai/v1`
- **GATEWAY_API_KEY:** `<your key>`
- **models.default:** `<model name>`

### Steps

1. Add this endpoint to librechat.yaml.
2. In LibreChat's .env file, set GATEWAY_API_KEY to your key.
3. Restart LibreChat.

### Example

```yaml
endpoints:
  custom:
    - name: "Azizam"
      apiKey: "${GATEWAY_API_KEY}"
      baseURL: "https://<your gateway>/openai/v1"
      models:
        default: ["<model name>"]
        fetch: true
      modelDisplayLabel: "Azizam"
```

Source: [LibreChat's own documentation](<https://www.librechat.ai/docs/configuration/librechat_yaml/object_structure/custom_endpoint>)

## MCP setup

**Status:** documented
**Checked:** 2026-10-13

**Authentication:** Sign in or use a Key.

### Settings

- **Server URL:** `https://<your gateway>/mcp`

### Steps

1. In librechat.yaml under mcpServers add: type: streamable-http and url: https://<your gateway>/mcp. Set the type: without it LibreChat uses the old SSE transport.
2. Each person signs in from LibreChat when first using the server.
3. Or set headers with Authorization: Bearer and requiresOAuth: false.

Source: [LibreChat's own documentation](<https://www.librechat.ai/docs/configuration/librechat_yaml/object_structure/mcp_servers>)
