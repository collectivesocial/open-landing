---
title: Managing Members
description: How to manage community members, join flows, and admin roles
---

## Joining a Community

Use the join endpoint to add a member to a community:

```json
POST /api/v1/communities/:did/members/join
Headers: X-Api-Key: your-api-key
Body: { "userDid": "did:plc:abc123" }
```

### Open Communities

Open communities accept members immediately. The response is `201 Created`:

```json
{
  "status": "joined",
  "membership": {
    "communityDid": "did:plc:community123",
    "memberDid": "did:plc:abc123",
    "joinedAt": "2025-01-01T00:00:00.000Z"
  }
}
```

### Admin-Approved Communities

For communities with type `admin-approved`, join requests go to a pending queue. The response is `202 Accepted`:

```json
{
  "status": "pending",
  "message": "Join request submitted. An admin must approve your request."
}
```

Admins can view pending requests:

```http
GET /api/v1/communities/:did/members/pending?adminDid=did:plc:admin123
```

Then approve or reject:

```json
POST /api/v1/communities/:did/members/approve
{ "adminDid": "did:plc:admin123", "memberDid": "did:plc:user456", "reason": "Welcome!" }

POST /api/v1/communities/:did/members/reject
{ "adminDid": "did:plc:admin123", "memberDid": "did:plc:user456", "reason": "Not a fit" }
```

## Leaving a Community

Members can leave voluntarily:

```json
POST /api/v1/communities/:did/members/leave
{ "userDid": "did:plc:abc123" }
```

The primary admin cannot leave — they must transfer admin role first.

## Listing Members

```http
GET /api/v1/communities/:did/members?public=true&limit=20&cursor=...
```

Returns paginated members with Bluesky profile data:

```json
{
  "members": [
    {
      "did": "did:plc:abc123",
      "handle": "alice.bsky.social",
      "avatar": "https://cdn.bsky.app/...",
      "confirmedAt": "2025-01-01T00:00:00.000Z",
      "isAdmin": false
    }
  ],
  "total": 42,
  "cursor": "eyJvZmZzZXQiOjIwfQ=="
}
```

Use `search` to filter by DID: `?search=did:plc:abc`.

## Removing Members

Admins can remove members:

```json
DELETE /api/v1/communities/:did/members/:memberDid
Headers: X-Api-Key: your-api-key
Body: { "adminDid": "did:plc:admin123", "reason": "Violated guidelines" }
```

The primary admin cannot be removed. Removing an admin also strips their admin role.

## Checking Membership

Check if a user is a member, admin, or has a pending request:

```json
POST /api/v1/communities/:did/membership/check
{ "userDid": "did:plc:abc123" }
→ { "isMember": true, "isAdmin": false, "isPending": false }
```

## Admin Management

### Promote to Admin

```json
POST /api/v1/communities/:did/admins/promote
{ "adminDid": "did:plc:admin123", "memberDid": "did:plc:user456" }
```

### Demote Admin

```json
POST /api/v1/communities/:did/admins/demote
{ "adminDid": "did:plc:admin123", "memberDid": "did:plc:user456" }
```

The primary admin cannot be demoted — use transfer instead.

### Transfer Primary Admin

Only the primary admin can transfer ownership:

```json
POST /api/v1/communities/:did/admins/transfer
{ "currentOwnerDid": "did:plc:admin123", "newOwnerDid": "did:plc:user456" }
```

The new owner must already be an admin. After transfer, the original admin remains as a regular admin.

## Audit Log

All admin actions are recorded. Admins can view the audit log:

```http
GET /api/v1/communities/:did/audit-log?adminDid=did:plc:admin123&limit=20
```

Logged actions: `member.approved`, `member.rejected`, `member.removed`, `admin.promoted`, `admin.demoted`, `admin.transferred`, `community.created`, `community.deleted`, `community.updated`, `banner.uploaded`, `avatar.uploaded`.

## How Membership Works (ATProto)

Membership uses a dual-record model:

1. **membership** record — in the user's PDS repo (`community.opensocial.membership`)
2. **membershipProof** record — in the community's PDS repo (`community.opensocial.membershipProof`)

A member record **without** a corresponding membershipProof means the user has been removed or not yet approved. A membershipProof **without** a corresponding member record indicates the user has left the community.
