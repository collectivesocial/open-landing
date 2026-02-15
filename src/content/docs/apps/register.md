---
title: Registering an App
description: How to register your application with Open Social
---

## Prerequisites

You need an AT Protocol account (e.g., Bluesky) to register an app. Log in to the Open Social web app first.

## Register Your App

Once authenticated via OAuth, register your app:

```json
POST /api/v1/apps/register
{
  "name": "My Community Bot",
  "domain": "bot.example.com"
}
```

Response:

```json
{
  "app": {
    "appId": "app_a1b2c3d4e5f6g7h8",
    "name": "My Community Bot",
    "domain": "bot.example.com",
    "apiKey": "osc_abc123...",
    "createdAt": "2025-01-01T00:00:00.000Z"
  },
  "message": "Store the api_key securely — treat it like a password."
}
```

:::caution
The API key is only shown once. Store it securely immediately.
:::

## Using Your API Key

Include the key in the `X-Api-Key` header:

```http
GET /api/v1/communities
X-Api-Key: osc_abc123...
```

## Validation Rules

- **name**: 3-100 characters, alphanumeric with spaces, hyphens, and underscores
- **domain**: Valid domain format (e.g., `myapp.example.com`)
- Duplicate active domains are not allowed

## Verify Your Key

Test your API key:

```json
POST /api/v1/apps/verify
Headers: X-Api-Key: osc_abc123...
→ { "valid": true, "app": { "appId": "...", "name": "...", "domain": "..." } }
```
