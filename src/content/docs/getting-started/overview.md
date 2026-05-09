---
title: Overview
description: Introduction to Open Social — community management infrastructure for ATProto applications.
---

Open Social is community management infrastructure for applications built on the [AT Protocol](https://atproto.com/) (the protocol behind Bluesky). It provides a REST API that lets your application create and manage communities, each backed by a real ATProto identity.

## What is Open Social?

Open Social gives your ATProto application the ability to:

- **Register your app** and obtain an API key for programmatic access
- **Create communities** that are full ATProto accounts with their own DID, handle, and data repository
- **Manage membership** with support for open, admin-approved, and private community types
- **Store records** in community repositories using ATProto's data model
- **Control access** with admin roles and permission checks

## How It Works

### Architecture

Open Social is an Express.js API server backed by PostgreSQL. It acts as a bridge between your application and the AT Protocol, managing community PDS accounts on your behalf.

```
Your App  ──▶  Open Social API  ──▶  AT Protocol (PDS)
         (REST + API Key or CIMD)    (Community accounts)
```

### Authentication

There are two server-to-server authentication methods, plus OAuth for end-user login:

1. **OAuth Session** — Used for end-user login flows through the web app. Users authenticate with their ATProto handle via OAuth.
2. **API Key** — Pass a pre-shared key in the `X-Api-Key` header. Low setup overhead, suitable for trusted server environments.
3. **CIMD / HTTP Signatures** — Sign each request with an asymmetric key pair. Your private key stays on your server; only a cryptographic signature travels over the wire.

See [Authentication](auth/index) for a full comparison and setup guides for each method.

### Communities as ATProto Accounts

Each community created through Open Social is a real ATProto account. This means:

- Communities have their own **DID** (decentralized identifier)
- Communities have a **handle** (e.g., `my-community.opensocial.community`)
- Community data is stored in a **PDS repository** using standard ATProto records
- Membership, admin roles, and profiles are all ATProto records

## Base URL

The Open Social API is available at:

```
https://api.opensocial.community:8443
```

All API endpoints documented in this site are relative to this base URL.

## Health Check

You can verify the API is running with:

```bash
curl https://api.opensocial.community:8443/health
```

## Next Steps

- [Review authentication options](auth/index) — API Key or CIMD, explained side by side
- [Set up API Key authentication](auth/api-keys) — if you want the fastest path to a working integration
- [Set up CIMD authentication](auth/cimd) — if you need request signing and replay protection
- Browse the [full API endpoint reference](reference/api-endpoints)
