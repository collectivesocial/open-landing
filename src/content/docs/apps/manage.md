---
title: Managing Apps
description: How to manage, update, and rotate keys for your registered apps
---

## List Your Apps

```http
GET /api/v1/apps
```

Returns all apps registered by the authenticated user.

## Update an App

```json
PUT /api/v1/apps/:appId
{ "name": "Updated Name", "domain": "new.example.com" }
```

At least one field (name or domain) must be provided.

## Rotate API Key

Generate a new key and invalidate the old one:

```json
POST /api/v1/apps/:appId/rotate-key
→ { "apiKey": "osc_newkey...", "message": "Store the new api_key securely." }
```

## Deactivate an App

```json
DELETE /api/v1/apps/:appId
→ { "success": true, "message": "App deactivated" }
```

Deactivation is soft — the app record remains but the API key no longer works.

## Webhooks

Register webhooks to receive real-time notifications:

```json
POST /api/v1/webhooks
Headers: X-Api-Key: your-key
{
  "url": "https://example.com/webhook",
  "events": ["member.joined", "record.created"],
  "communityDid": "did:plc:community123"
}
```

### Webhook Events

| Event | Trigger |
|-------|---------|
| `member.joined` | User joins a community |
| `member.left` | User leaves a community |
| `member.approved` | Admin approves a join request |
| `member.rejected` | Admin rejects a join request |
| `member.removed` | Admin removes a member |
| `record.created` | Record created in community repo |
| `record.updated` | Record updated |
| `record.deleted` | Record deleted |

### Webhook Security

Each webhook has a secret. Payloads include an `X-Webhook-Signature` header containing an HMAC-SHA256 signature:

```
X-Webhook-Signature: sha256=<hex-encoded-hmac>
```

Verify by computing HMAC-SHA256 of the request body using the webhook secret.

### Managing Webhooks

```http
GET /api/v1/webhooks              # List webhooks
PUT /api/v1/webhooks/:id          # Update URL, events, or active status
DELETE /api/v1/webhooks/:id       # Remove webhook
```
