---
title: Community Records
description: Creating and managing records in community repositories
---

Community records are stored in the community's AT Protocol PDS repository. Only members (or admins) can create records.

## Creating Records

```json
POST /api/v1/communities/:did/records
Headers: X-Api-Key: your-api-key
{
  "userDid": "did:plc:member123",
  "collection": "community.opensocial.list",
  "record": {
    "$type": "community.opensocial.list",
    "name": "Book Recommendations",
    "community": "did:plc:community123",
    "createdBy": "did:plc:member123",
    "createdAt": "2025-01-01T00:00:00.000Z"
  }
}
```

Response:
```json
{ "uri": "at://did:plc:community123/community.opensocial.list/abc123", "cid": "bafyrei..." }
```

## Updating Records

```json
PUT /api/v1/communities/:did/records
{
  "userDid": "did:plc:member123",
  "collection": "community.opensocial.list",
  "rkey": "abc123",
  "record": {
    "$type": "community.opensocial.list",
    "name": "Updated Book List"
  }
}
```

## Deleting Records

```http
DELETE /api/v1/communities/:did/records/community.opensocial.list/abc123?userDid=did:plc:member123
```

## Listing Records

```http
GET /api/v1/communities/:did/records/community.opensocial.list?limit=20&cursor=...
```

## Getting a Single Record

```http
GET /api/v1/communities/:did/records/community.opensocial.list/abc123
```

## Admin-Only Collections

Some collections can only be written to by admins:

- `community.opensocial.profile` — community profile
- `community.opensocial.admins` — admin list
- `community.opensocial.listitem.status` — list item statuses

## Admin-Update Collections

These can be created by any member but only updated by admins:

- `community.opensocial.list`
- `community.opensocial.listitem.status`
- `community.opensocial.profile`
- `community.opensocial.admins`

## Webhook Notifications

When records are created, updated, or deleted, registered webhooks receive notifications with events: `record.created`, `record.updated`, `record.deleted`.
