---
title: "Connect Zed"
summary: "Set up Zed to connect through your gateway."
---

# Connect Zed

Use these settings to configure Zed as a Client for your gateway.

## MCP setup

**Status:** unverified
**Checked:** 2026-10-13

**Authentication:** Sign in or use a Key.

### Settings

- **Server URL:** `https://<your gateway>/mcp`

### Steps

1. Add a context server with "url": "https://<your gateway>/mcp" in Zed's settings.
2. Without an Authorization header Zed signs in through the browser; with one it uses your key.

> Note: The documentation does not say which protocol versions Zed sends.

Source: [Zed's own documentation](<https://zed.dev/docs/ai/mcp>)
