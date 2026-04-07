# Admin Banner Logic

This document explains the code path behind the admin-only quick-links module. It is written as a reuse guide for other projects, so it focuses on runtime conditions, route parsing, data lookup, and fallback rules.

## Scope

The current implementation lives in these files:

- `src/app/(localized)/[locale]/layout.tsx`
- `src/components/public/admin-overlay-controls.tsx`
- `src/components/public/admin-quick-actions.tsx`
- `src/lib/admin-quick-actions.ts`
- `src/lib/auth.ts`
- `src/app/api/public/listings/[slug]/route.ts`
- `src/app/api/public/articles/[slug]/route.ts`
- `src/app/api/public/projects/[slug]/route.ts`
- `src/lib/admin-quick-actions.test.ts`

## 1. Render gate

The module is mounted from `src/app/(localized)/[locale]/layout.tsx`.

Execution flow:

1. The layout calls `getSession()`.
2. `getSession()` reads the `auth-token` cookie.
3. The token is verified with `verifyToken()`.
4. The user is loaded again from Prisma by `payload.userId`.
5. The layout checks `session?.role === Role.ADMIN`.
6. `AdminOverlayControls` is rendered only when that check passes.

Two details matter here:

- The gate is server-side, so non-admin requests never receive this module from the layout.
- The role is re-read from the database, so the decision does not rely only on JWT contents.

Because the mount point is the localized public layout, the logic applies only to localized public routes. It is not attached to admin routes or to the non-localized root layout.

## 2. Wrapper state

`AdminOverlayControls` is a small client wrapper with one job: own the shared hidden state.

It keeps:

```ts
const [isHiddenUntilRefresh, setIsHiddenUntilRefresh] = useState(false);
```

Behavior:

- When the flag is `false`, it renders `AdminQuickActions` and `AdminFeedbackLayer`.
- When the flag is `true`, it returns `null`.
- `AdminQuickActions` receives `onHideAll={() => setIsHiddenUntilRefresh(true)}`.

This means one action in `AdminQuickActions` can suppress both overlay modules at once.

Important nuance: this state lives in the mounted localized layout tree. It does not reset on every route change. It usually stays hidden until the layout remounts, such as on a full refresh or another navigation that remounts that layout segment.

## 3. Route parsing

Route parsing is isolated in the pure function `parseAdminQuickActionRoute(pathname)`.

Core logic:

```ts
const pathSegments = pathname.split("/").filter(Boolean);
const locale = pathSegments[0] ?? "tr";
```

The function then maps route segments to page context:

| Public route pattern | Parsed field | Page flag |
| --- | --- | --- |
| `/[locale]/ilan/[slug]` | `listingSlug` | `isListingPage` |
| `/[locale]/blog/[slug]` | `articleSlug` | `isArticlePage` |
| `/[locale]/proje/[slug]` | `projectSlug` | `isProjectPage` |

Rules:

- The first segment is treated as locale.
- The second segment decides which content type the page represents.
- The third segment is treated as the public slug.
- Slugs are passed through `decodeURIComponent()` inside `decodePathSegment()`.
- If decoding fails, the raw segment is kept instead of throwing.

If no known detail route is detected, all three slug fields are `null` and all three page flags are `false`.

## 4. Quick-link definitions

Link generation is isolated in the pure function `buildAdminQuickActionDefinitions(input)`.

It always starts with the same base set:

```ts
[
  { id: "listings", href: "/admin/ilanlar" },
  { id: "projects", href: "/admin/projeler" },
  { id: "articles", href: "/admin/makaleler" },
  { id: "portal", href: "/admin" }
]
```

Then it prepends a detail-specific link when the current route matches a known content type.

### Listing detail rule

If `isListingPage` is `true`:

```ts
{
  id: "listing",
  href: listingId ? `/admin/ilanlar/${listingId}` : "#",
  disabled: !listingId || isListingLoading
}
```

Meaning:

- The detail link needs the internal listing id.
- Until the id is resolved, the link stays disabled.
- If the id never resolves, the link remains disabled.

### Article detail rule

If `isArticlePage` is `true`:

```ts
{
  id: "article",
  href: articleId ? `/admin/makaleler/${articleId}` : "#",
  disabled: !articleId || isArticleLoading
}
```

This follows the same rule as listings: no id, no active detail link.

### Project detail rule

If `isProjectPage` is `true`:

```ts
const slugFallbackHref = projectSlug
  ? `/admin/projeler/slug/${encodeURIComponent(projectSlug)}`
  : "#";

const projectHref = projectId
  ? `/admin/projeler/${projectId}`
  : slugFallbackHref;
```

The resulting definition is:

```ts
{
  id: "project",
  href: projectHref,
  disabled: projectHref === "#" || isProjectLoading
}
```

This is the one content type with a built-in fallback:

- Preferred target: `/admin/projeler/{id}`
- Fallback target: `/admin/projeler/slug/{slug}`

That fallback keeps the project link usable even when the internal id is not available yet.

## 5. Data lookup for detail routes

`AdminQuickActions` resolves internal ids only on detail routes.

It stores these local states:

- `listingId` and `isListingLoading`
- `articleId` and `isArticleLoading`
- `projectId` and `isProjectLoading`

For each content type, there is a separate `useEffect`.

Shared pattern:

1. If the slug is missing, clear the stored id and mark loading `false`.
2. If the slug exists, start a fetch to the matching public detail endpoint.
3. Use `cache: "no-store"` so the lookup is always current.
4. Use `AbortController` and `isActive` so stale requests cannot write state after unmount or route changes.
5. If the response is not OK, store `null`.
6. If the response is OK, read only the internal id from the JSON payload.
7. Clear the loading flag in `finally`.

Current endpoint contracts:

| Content type | Endpoint used by quick-links | Field read by quick-links |
| --- | --- | --- |
| Listing | `/api/public/listings/[slug]?locale={locale}` | `data.listing?.id` |
| Article | `/api/public/articles/[slug]?locale={locale}` | `data.article?.id` |
| Project | `/api/public/projects/[slug]?locale={locale}` | `data.project?.id` |

The component reads only `id`. Everything else in those responses is irrelevant to this module.

## 6. State transitions inside `AdminQuickActions`

The component keeps two kinds of transient state:

- Route-derived state from `parseAdminQuickActionRoute(pathname)`
- Local state for open/closed behavior, loading flags, and resolved ids

Two transitions are important:

- On every `pathname` change, `isOpen` is reset to `false`.
- On every slug change, the matching id lookup restarts and the previous request is aborted.

That gives the module two useful guarantees:

- A previous page cannot leave behind a stale resolved id for the next page.
- A detail link is always rebuilt from the current route context.

## 7. Tests that lock the logic

`src/lib/admin-quick-actions.test.ts` currently covers:

- project detail route detection
- the base action set
- project detail prepending
- project slug fallback

That file is useful because the core rules live in pure functions. If you port this pattern to another project, keep the parser and builder pure and test them separately from the client component.

Recommended minimum test set for a new project:

- parser detects each detail route correctly
- malformed encoded slugs do not crash parsing
- base actions always exist
- detail actions are prepended ahead of base actions
- listing and article actions stay disabled without ids
- project action falls back to the slug-based admin route

## 8. Porting checklist for another project

To reuse this pattern in another codebase, update these parts together:

1. Mount point
   Put the server-side gate in the layout that owns the public routes where admins should get quick links.

2. Auth gate
   Re-check the current user from the database and gate on the final role, not only on token contents.

3. Route parser
   Replace `ilan`, `blog`, and `proje` with the public route segments of the new project.

4. Admin targets
   Replace `/admin/ilanlar`, `/admin/makaleler`, and `/admin/projeler` with the new admin routes.

5. Detail lookup contract
   Ensure the public detail endpoints expose a stable admin key.
   The current code uses `id`, but a slug-based resolver route can work as a fallback.

6. Fallback policy
   Decide explicitly which content types may use a slug fallback.
   In this project, only projects have that behavior.

7. Test surface
   Keep parser and builder logic in pure functions so route rules and fallback rules stay easy to test.

## 9. Current project summary

In this project, the logic can be reduced to this:

- Only authenticated `ADMIN` users receive the module.
- The current public route is parsed into `locale + content type + slug`.
- Detail routes trigger a fetch to a public detail endpoint to recover the internal admin id.
- Base admin links always exist.
- Detail links are prepended when the route represents a known content type.
- Listing and article detail links require the internal id.
- Project detail links prefer the internal id but can fall back to an admin slug resolver route.
- The hide action is shared at the wrapper level, so one state flag suppresses the whole overlay group.

