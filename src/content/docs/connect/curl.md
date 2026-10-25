---
title: "Connect curl"
summary: "Set up curl to connect through your gateway."
---

# Connect curl

Use these settings to configure curl as a Client for your gateway.

## Key setup

**Status:** documented
**Checked:** 2026-10-13

### Settings

- **URL:** `https://<your gateway>/openai/v1/chat/completions`
- **GATEWAY_API_KEY:** `<your key>`
- **model:** `<model name>`

### Steps

1. Set GATEWAY_API_KEY to your key, then run this. It sends one chat request.

### Example

```shell
curl 'https://<your gateway>/openai/v1/chat/completions' \
  -H "Authorization: Bearer $GATEWAY_API_KEY" \
  -H "Content-Type: application/json" \
  --data '{"model":"<model name>","messages":[{"role":"user","content":"Say hello."}]}'
```

Source: [curl's own documentation](<https://platform.openai.com/docs/api-reference/chat/create>)
