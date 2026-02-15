---
title: Community Types
description: Understanding open, admin-approved, and private communities
---

## Open Communities

The default type. Anyone with an AT Protocol account can join immediately.

```json
POST /api/v1/communities/:did/members/join
{ "userDid": "did:plc:abc123" }
→ 201 { "status": "joined", ... }
```

## Admin-Approved Communities

Join requests go to a pending queue. Admins review and approve or reject them.

```json
POST /api/v1/communities/:did/members/join
{ "userDid": "did:plc:abc123" }
→ 202 { "status": "pending", ... }
```

### Managing Pending Requests

```http
GET /api/v1/communities/:did/members/pending?adminDid=did:plc:admin
```

```json
{
  "pendingMembers": [
    { "userDid": "did:plc:abc", "handle": "alice.bsky.social", "avatar": "...", "requestedAt": "..." }
  ]
}
```

Approve:
```json
POST /api/v1/communities/:did/members/approve
{ "adminDid": "did:plc:admin", "memberDid": "did:plc:abc" }
```

Reject:
```json
POST /api/v1/communities/:did/members/reject
{ "adminDid": "did:plc:admin", "memberDid": "did:plc:abc", "reason": "Not a fit" }
```

## Private Communities (Coming Soon)

Private communities will support invite-only membership where admins send direct invitations.

## Setting Community Type

```json
PUT /communities/:did/profile
{ "displayName": "My Community", "type": "admin-approved" }
```

Valid types: `open`, `admin-approved`, `private`.
