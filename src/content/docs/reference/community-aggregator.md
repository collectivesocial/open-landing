---
title: Community Aggregator Package
description: Aggregate community content from the AT Protocol ecosystem at build time.
---

The `@opensocial/community` package fetches and merges community content — events, shared posts, and blog posts — from ATProto accounts at build time. It's designed for static site generation and uses only unauthenticated, public XRPC endpoints.

## Installation

```bash
npm install @opensocial/community
```

## Core Concepts

**Community hierarchy:** A root community (e.g. `atmosphere.community`) has sub-communities. Content is aggregated from all accounts, with each piece tagged by its source community.

**Identity resolution:** Handles are resolved to DIDs via `com.atproto.identity.resolveHandle`, then to PDS endpoints via the PLC directory. Records are fetched from the resolved PDS.

**Build-time only:** All fetching is unauthenticated and designed to run during `astro build` or similar static generation steps.

## Usage

### Quick Start with the Aggregator Factory

```ts
import { createAggregator, preflight } from '@opensocial/community';

await preflight([
  { name: 'Bluesky API', url: 'https://public.api.bsky.app/xrpc/_health' },
]);

const agg = createAggregator({
  root: 'atmosphere.community',
  subCommunities: ['pdx.atproto.camp', 'atproto.to'],
});

const events = await agg.fetchEvents();
const sharedPosts = await agg.fetchSharedContent();
```

### Individual Functions

```ts
import { fetchEvents, fetchSharedContent, fetchBlogPosts } from '@opensocial/community';

const events = await fetchEvents(['atmosphere.community', 'pdx.atproto.camp']);
const posts = await fetchSharedContent(['atmosphere.community']);
const blog = await fetchBlogPosts({
  account: 'blogger.bsky.social',
  baseUrl: 'https://blog.example.com',
  limit: 10,
});
```

## API Reference

### `fetchEvents(accounts)`

Fetches `community.lexicon.calendar.event` records from all accounts in parallel.

- **Input:** Array of handles or DIDs
- **Output:** Upcoming events, sorted ascending by date, deduplicated
- Handles location types (address, geo, H3)
- Selects best event URL (OpenMeet → non-image URI → Smoke Signal fallback)

### `fetchSharedContent(accounts, options?)`

Fetches `community.opensocial.sharedContent` records and resolves each `site.standard.document`.

- **Input:** Array of handles or DIDs
- **Options:** `{ batchSize?: number }` (default 10)
- Resolves author profiles via public Bluesky API
- Deduplicates by `documentUri`

### `fetchBlogPosts(config)`

Fetches `site.standard.document` records from a single account.

- **Config:** `{ account: string, baseUrl?: string, limit?: number }`
- Tolerant of ISO date variants
- Generates excerpts via markdown stripping

### `getProfile(handleOrDid)`

Resolves a Bluesky profile. Cached in memory for the build.

### `preflight(checks)`

Verifies ATProto services are reachable before fetching. Throws on failure to prevent deploying with missing content.

## Error Handling

| Scenario | Behavior |
|----------|----------|
| Preflight fails | Build aborts |
| Account unreachable | Skipped; others still fetched |
| Document/profile fetch fails | Item skipped; other content kept |

## Astro Integration

In any `.astro` page or API route, the package can be called directly at build time:

```astro
---
import { fetchEvents, preflight } from '@opensocial/community';

await preflight([
  { name: 'Bluesky', url: 'https://public.api.bsky.app/xrpc/_health' },
]);

const events = await fetchEvents(['atmosphere.community']);
---

<h2>Upcoming Events</h2>
<ul>
  {events.map((event) => (
    <li>
      <a href={event.uri}>{event.name}</a> —
      {event.startsAt.toLocaleDateString()}
      {event.location && ` · ${event.location}`}
    </li>
  ))}
</ul>
```

## Record Types Consumed

| Collection | Source |
|-----------|--------|
| `community.lexicon.calendar.event` | Smoke Signal, OpenMeet |
| `community.opensocial.sharedContent` | OpenSocial communities |
| `site.standard.document` | Leaflet, WhiteWind, Offprint |
| `site.standard.publication` | Publication metadata (optional) |
