---
title: "Connect JavaScript"
summary: "Set up JavaScript to connect through your gateway."
---

# Connect JavaScript

Use these settings to configure JavaScript as a Client for your gateway.

## Key setup

**Status:** documented
**Checked:** 2026-10-13

### Settings

- **baseURL:** `https://<your gateway>/openai/v1`
- **GATEWAY_API_KEY:** `<your key>`
- **model:** `<model name>`

### Steps

1. Install the openai package: npm install openai.
2. Set GATEWAY_API_KEY to your key, then run this on a server. Never put the key in a web page.

### Example

```javascript
import OpenAI from "openai";

const client = new OpenAI({
  baseURL: "https://<your gateway>/openai/v1",
  apiKey: process.env.GATEWAY_API_KEY,
});
const response = await client.chat.completions.create({
  model: "<model name>",
  messages: [{ role: "user", content: "Say hello." }],
});
console.log(response.choices[0].message.content);
```

Source: [JavaScript's own documentation](<https://github.com/openai/openai-node#usage>)
