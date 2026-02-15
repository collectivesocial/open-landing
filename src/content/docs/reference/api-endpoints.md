---
title: API Endpoints Reference
description: Complete reference for all Open Social API endpoints
---

Open Social uses two authentication methods:

- **OAuth Session** — for web app users (browser cookies)
- **API Key** — for programmatic access (`X-Api-Key` header)

All API Key routes use **camelCase** field names. Pagination defaults to **20 items** per page (max 100). Pass `cursor` from the previous response to get the next page.

---

## Authentication (OAuth)

| Method | Path | Description |
|--------|------|-------------|
| GET | `/oauth-client-metadata.json` | OAuth client metadata |
| GET | `/.well-known/jwks.json` | Public JSON Web Key Set |
| GET | `/oauth/callback` | OAuth callback handler |
| POST | `/login` | Initiate OAuth login flow |
| POST | `/logout` | Destroy session |

## User Routes (OAuth Session)

| Method | Path | Description |
|--------|------|-------------|
| GET | `/users/me` | Get current user profile |
| GET | `/users/me/memberships` | List user's community memberships |
| POST | `/users/me/communities` | Create a new community |

## Community Management (OAuth Session)

| Method | Path | Description |
|--------|------|-------------|
| GET | `/communities/:did` | Get community details |
| POST | `/communities/:did/avatar` | Upload community avatar |
| POST | `/communities/:did/banner` | Upload banner or reuse Bluesky banner |
| PUT | `/communities/:did/profile` | Update community profile |
| DELETE | `/communities/:did` | Delete a community |
| GET | `/communities/:did/members` | List community members |
| POST | `/communities/:did/members/:memberDid/admin` | Promote member to admin |
| DELETE | `/communities/:did/members/:memberDid/admin` | Demote admin |
| DELETE | `/communities/:did/members/:memberDid` | Remove member |

## App Management (OAuth Session)

| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/v1/apps/register` | Register a new app |
| GET | `/api/v1/apps` | List your apps |
| GET | `/api/v1/apps/:appId` | Get app details |
| PUT | `/api/v1/apps/:appId` | Update app |
| DELETE | `/api/v1/apps/:appId` | Deactivate app |
| POST | `/api/v1/apps/:appId/rotate-key` | Rotate API key |
| POST | `/api/v1/apps/verify` | Verify API key |

## Communities API (API Key)

| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/v1/communities` | Create community |
| GET | `/api/v1/communities` | List/search communities |
| GET | `/api/v1/communities/:did` | Get community details |
| DELETE | `/api/v1/communities/:did` | Delete community |

### Search Communities

```http
GET /api/v1/communities?query=gaming&userDid=did:plc:abc&limit=20&cursor=...
```

Returns `memberCount`, `isAdmin`, and community `type` for each result.

## Members API (API Key)

| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/v1/communities/:did/members/join` | Join community |
| POST | `/api/v1/communities/:did/members/leave` | Leave community |
| GET | `/api/v1/communities/:did/members` | List members (paginated) |
| GET | `/api/v1/communities/:did/members/pending` | List pending requests |
| POST | `/api/v1/communities/:did/members/approve` | Approve join request |
| POST | `/api/v1/communities/:did/members/reject` | Reject join request |
| DELETE | `/api/v1/communities/:did/members/:memberDid` | Remove member |
| POST | `/api/v1/communities/:did/admins/promote` | Promote to admin |
| POST | `/api/v1/communities/:did/admins/demote` | Demote admin |
| POST | `/api/v1/communities/:did/admins/transfer` | Transfer primary admin |
| POST | `/api/v1/communities/:did/membership/check` | Check membership status |
| GET | `/api/v1/communities/:did/audit-log` | View audit log |

### Join Community

```json
POST /api/v1/communities/:did/members/join
{ "userDid": "did:plc:abc123" }
```

- **Open communities** → 201, immediately joined
- **Admin-approved communities** → 202, request pending

### List Members

```http
GET /api/v1/communities/:did/members?public=true&search=did:plc&limit=20&cursor=...
```

Returns `handle`, `avatar`, `isAdmin`, `confirmedAt` for each member.

### Membership Check

```json
POST /api/v1/communities/:did/membership/check
{ "userDid": "did:plc:abc123" }
→ { "isMember": true, "isAdmin": false, "isPending": false }
```

## Records API (API Key)

| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/v1/communities/:did/records` | Create record |
| PUT | `/api/v1/communities/:did/records` | Update record |
| DELETE | `/api/v1/communities/:did/records/:collection/:rkey` | Delete record |
| GET | `/api/v1/communities/:did/records/:collection` | List records |
| GET | `/api/v1/communities/:did/records/:collection/:rkey` | Get record |

### Create Record

```json
POST /api/v1/communities/:did/records
{
  "userDid": "did:plc:abc123",
  "collection": "community.opensocial.list",
  "record": {
    "$type": "community.opensocial.list",
    "name": "My Reading List"
  }
}
```

## Webhooks API (API Key)

| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/v1/webhooks` | Register webhook |
| GET | `/api/v1/webhooks` | List webhooks |
| PUT | `/api/v1/webhooks/:webhookId` | Update webhook |
| DELETE | `/api/v1/webhooks/:webhookId` | Delete webhook |

### Webhook Events

- `member.joined`, `member.left`, `member.approved`, `member.rejected`, `member.removed`
- `record.created`, `record.updated`, `record.deleted`

### Create Webhook

```json
POST /api/v1/webhooks
{
  "url": "https://example.com/webhook",
  "events": ["member.joined", "member.left"],
  "communityDid": "did:plc:community123"
}
```

Webhook payloads include an `X-Webhook-Signature` header (HMAC-SHA256).
