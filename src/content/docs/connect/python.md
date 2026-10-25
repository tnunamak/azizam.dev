---
title: "Connect Python"
summary: "Set up Python to connect through your gateway."
---

# Connect Python

Use these settings to configure Python as a Client for your gateway.

## Key setup

**Status:** documented
**Checked:** 2026-10-13

### Settings

- **base_url:** `https://<your gateway>/openai/v1`
- **GATEWAY_API_KEY:** `<your key>`
- **model:** `<model name>`

### Steps

1. Install the openai package: pip install openai.
2. Set GATEWAY_API_KEY to your key, then run this.

### Example

```python
import os
from openai import OpenAI

client = OpenAI(
    base_url="https://<your gateway>/openai/v1",
    api_key=os.environ["GATEWAY_API_KEY"],
)
response = client.chat.completions.create(
    model="<model name>",
    messages=[{"role": "user", "content": "Say hello."}],
)
print(response.choices[0].message.content)
```

Source: [Python's own documentation](<https://github.com/openai/openai-python#usage>)
