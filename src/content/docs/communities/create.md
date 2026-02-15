---
title: Creating Communities
description: How to create and configure an Open Social community
---

Communities in Open Social are backed by existing AT Protocol accounts. You'll need a DID and app password for the account you want to use as the community identity.

## Creating via Web App (OAuth)

Authenticated users can create communities through the web app by providing an existing AT Protocol account:

```json
POST /users/me/communities
{
  "did": "did:plc:existing123",
  "appPassword": "xxxx-xxxx-xxxx-xxxx",
  "displayName": "My Community",
  "description": "A place for discussion"
}
```

This sets up the community profile, admin list, and your membership using the provided account.

## Creating via API Key

For programmatic community creation:

```json
POST /api/v1/communities
Headers: X-Api-Key: your-api-key
{
  "did": "did:plc:existing123",
  "appPassword": "xxxx-xxxx-xxxx-xxxx",
  "displayName": "New Community",
  "creatorDid": "did:plc:creator123"
}
```

The creator is automatically set as the primary admin.

## Community Profile

After creation, update the profile:

```json
PUT /communities/:did/profile
{
  "displayName": "Updated Name",
  "description": "A new description",
  "type": "open",
  "guidelines": "Be kind and respectful"
}
```

### Avatar Upload

```http
POST /communities/:did/avatar
Content-Type: multipart/form-data
Body: avatar (file, max 1MB, image only)
```

### Banner Upload

Upload a custom banner:

```http
POST /communities/:did/banner
Content-Type: multipart/form-data
Body: banner (file, max 1MB, image only)
```

Or reuse your Bluesky profile banner:

```http
POST /communities/:did/banner
Body: reuseBluesky=true
```

## Community Types

| Type | Behavior |
|------|----------|
| `open` | Anyone can join immediately |
| `admin-approved` | Join requests require admin approval |
| `private` | Invite-only (coming soon) |

Set the type when updating the profile:

```json
PUT /communities/:did/profile
{ "displayName": "My Community", "type": "admin-approved" }
```

## Deleting a Community

Only the sole remaining admin can delete a community:

```json
DELETE /communities/:did
```

Or via API Key:

```json
DELETE /api/v1/communities/:did
{ "adminDid": "did:plc:admin123" }
```

If multiple admins exist, remove others first.
