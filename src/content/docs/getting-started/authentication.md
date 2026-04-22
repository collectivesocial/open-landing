---
title: Authentication
description: How to authenticate with the Open Social API
---

Open Social supports two authentication methods:

## OAuth (Web App Users)

The web app uses AT Protocol OAuth for user authentication:

1. User clicks "Login" and enters their Bluesky handle
2. Redirected to their PDS for authorization
3. PDS shows the specific permissions Open Social is requesting
4. Callback completes the session (stored in `sid` cookie)
5. Session agent is used for all authenticated requests

### OAuth Scopes & Permissions

Open Social requests **granular permissions** following the [AT Protocol permission spec](https://atproto.com/specs/permission), rather than full account access:

| Scope | Purpose |
|-------|---------|
| `atproto` | Required base scope for all AT Proto OAuth flows |
| `repo:community.opensocial.membership` | Write membership records to the user's own repo (join/leave communities) |

Open Social **only** writes `community.opensocial.membership` records to your personal repository. All other data (profiles, admin lists, membership proofs, community records) is managed by the community's own AT Protocol account — not your personal account.

### Permission Set

Third-party apps integrating with Open Social can request the bundled permission set instead of enumerating individual scopes:

```
include:community.opensocial.authBasic
```

This grants the same `repo:community.opensocial.membership` write permission in a single scope declaration. See the [lexicon reference](/reference/lexicons) for the full permission set definition.

### OAuth Endpoints

| Endpoint | Description |
|----------|-------------|
| `POST /login` | Start OAuth flow (body: `input=handle`) |
| `POST /logout` | End session |
| `GET /users/me` | Get authenticated user |
| `GET /oauth-client-metadata.json` | OAuth client metadata |
| `GET /.well-known/jwks.json` | Public key set |

## API Key (Programmatic Access)

For server-to-server or app integrations:

1. Register an app (requires OAuth session first):
   ```json
   POST /api/v1/apps/register
   { "name": "My App", "domain": "myapp.example.com" }
   ```
2. Store the returned `apiKey` securely
3. Include it in all API requests:
   ```http
   X-Api-Key: osc_abc123...
   ```

### API Key Endpoints

| Action | Endpoint |
|--------|----------|
| Register app | `POST /api/v1/apps/register` (OAuth) |
| List apps | `GET /api/v1/apps` (OAuth) |
| Rotate key | `POST /api/v1/apps/:appId/rotate-key` (OAuth) |
| Verify key | `POST /api/v1/apps/verify` (API Key) |
| Deactivate | `DELETE /api/v1/apps/:appId` (OAuth) |

### Key Format

API keys follow the format: `osc_` followed by 64 hex characters. Keys are stored as SHA-256 hashes — the plaintext is only returned once at creation.

## Rate Limiting

API Key routes are rate limited to **100 requests per minute** per app by default. Auth endpoints have stricter limits (20 per 15 minutes). Custom limits can be configured per app.

## CSRF Protection

State-changing requests from browser sessions require CSRF tokens. API Key requests are exempt (no CSRF risk for server-to-server calls).

The token flow:
1. Read the `csrf-token` cookie value
2. Include it as the `x-csrf-token` header on POST/PUT/DELETE requests
