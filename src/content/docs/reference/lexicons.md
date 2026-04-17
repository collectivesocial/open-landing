---
title: Lexicon Reference
description: AT Protocol lexicon schemas used by Open Social
---

Open Social uses AT Protocol lexicons to define the data structures stored in community PDS repositories.

## community.opensocial.profile

The community's public profile, stored at rkey `self`.

```json
{
  "$type": "community.opensocial.profile",
  "displayName": "My Community",
  "description": "A place for discussion",
  "type": "open",
  "guidelines": "Be kind and respectful",
  "avatar": { "$type": "blob", "ref": { "$link": "..." }, "mimeType": "image/jpeg" },
  "banner": { "$type": "blob", "ref": { "$link": "..." }, "mimeType": "image/jpeg" },
  "createdAt": "2025-01-01T00:00:00.000Z"
}
```

| Field | Type | Description |
|-------|------|-------------|
| displayName | string | Community name (max 64 chars) |
| description | string | Short description (max 512 chars) |
| type | string | `open`, `admin-approved`, or `private` |
| guidelines | string | Community rules (max 3000 chars) |
| avatar | blob | Community avatar image |
| banner | blob | Community banner image |
| createdAt | datetime | When created |

## community.opensocial.admins

Admin list, stored at rkey `self`. The first entry is the primary (original) admin.

```json
{
  "$type": "community.opensocial.admins",
  "admins": [
    { "did": "did:plc:creator123", "addedAt": "2025-01-01T00:00:00.000Z" },
    { "did": "did:plc:admin456", "addedAt": "2025-01-15T00:00:00.000Z" }
  ]
}
```

| Field | Type | Description |
|-------|------|-------------|
| admins | array | List of admin objects |
| admins[].did | string | Admin's DID |
| admins[].addedAt | datetime | When added as admin |

## community.opensocial.membership

Stored in the **user's** PDS repo. Indicates intent to join a community.

```json
{
  "$type": "community.opensocial.membership",
  "community": "did:plc:community123",
  "joinedAt": "2025-01-01T00:00:00.000Z"
}
```

| Field | Type | Description |
|-------|------|-------------|
| community | string | Community DID |
| joinedAt | datetime | When the user joined |

## community.opensocial.membershipProof

Stored in the **community's** PDS repo. Confirms a user is a verified member.

```json
{
  "$type": "community.opensocial.membershipProof",
  "memberDid": "did:plc:user123",
  "cid": "bafyrei...",
  "confirmedAt": "2025-01-01T00:00:00.000Z"
}
```

| Field | Type | Description |
|-------|------|-------------|
| memberDid | string | Member's DID |
| cid | string | CID of the user's membership record |
| confirmedAt | datetime | When membership was confirmed |

### Dual-Record Model

A complete membership requires **both** records:

- `membership` in user's repo → user wants to be a member
- `membershipProof` in community's repo → community confirms membership

| membership | membershipProof | Status |
|------------|----------------|--------|
| ✅ | ✅ | Active member |
| ✅ | ❌ | Removed or not yet approved |
| ❌ | ✅ | User has left |

## community.opensocial.list

A named list within a community.

```json
{
  "$type": "community.opensocial.list",
  "name": "Book Recommendations",
  "community": "did:plc:community123",
  "createdBy": "did:plc:user123",
  "createdAt": "2025-01-01T00:00:00.000Z",
  "description": "Great books to read"
}
```

## community.opensocial.listitem

An item in a community list.

```json
{
  "$type": "community.opensocial.listitem",
  "list": { "uri": "at://did:plc:community/community.opensocial.list/abc", "cid": "bafyrei..." },
  "item": { "uri": "at://did:plc:user/app.bsky.feed.post/xyz", "cid": "bafyrei..." },
  "addedBy": "did:plc:user123",
  "addedAt": "2025-01-01T00:00:00.000Z"
}
```

## community.opensocial.sharedContent

Stored in the **community's** PDS repo. A wrapper record that references external content (e.g. a standard.site document) shared by a member. Deleting this record removes the content from the community.

```json
{
  "$type": "community.opensocial.sharedContent",
  "type": "document",
  "documentUri": "at://did:plc:user123/site.standard.document/3mjpdo4ylyy23",
  "documentCid": "bafyrei...",
  "sharedBy": "did:plc:user123",
  "title": "My Blog Post Title",
  "path": "/a/3mjpdo4ylyy23-my-blog-post",
  "sharedAt": "2026-04-17T00:00:00.000Z"
}
```

| Field | Type | Description |
|-------|------|-------------|
| type | string | Content type: `document`, `event` (open enum — extensible) |
| documentUri | string (at-uri) | AT-URI of the source record |
| documentCid | string | CID of the source record at time of sharing |
| sharedBy | string (did) | DID of the member who shared the content |
| title | string | Cached title (max 512 graphemes) |
| path | string | Cached URL path (max 1024 graphemes, optional) |
| sharedAt | datetime | When the content was shared |

### Content Sharing Model

Content sharing uses a single-record model in the community repo:

- A **member** shares content → `sharedContent` record is created in the community's repo
- A **community admin** can remove shared content by deleting the record
- Permissions are managed via the **system app** (`app_system`) and can be customized per community
