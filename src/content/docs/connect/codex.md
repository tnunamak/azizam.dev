---
title: "Connect Codex"
summary: "Set up Codex to connect through your gateway."
---

# Connect Codex

Use these settings to configure Codex as a Client for your gateway.

## Key setup

**Status:** documented
**Checked:** 2026-10-13

### Settings

- **base_url:** `https://<your gateway>/openai/v1`
- **GATEWAY_API_KEY:** `<your key>`
- **model:** `<model name>`

### Steps

1. Add this to ~/.codex/config.toml.
2. In the shell that starts Codex, set GATEWAY_API_KEY to your key.

### Example

```toml
model = "<model name>"
model_provider = "azizam"

[model_providers.azizam]
name = "Azizam"
base_url = "https://<your gateway>/openai/v1"
env_key = "GATEWAY_API_KEY"
wire_api = "responses"
```

Source: [Codex's own documentation](<https://learn.chatgpt.com/docs/config-file/config-advanced#custom-model-providers>)
