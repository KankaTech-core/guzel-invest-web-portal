# Listings and Projects Connection Guide

This document explains how `İlanlar` and `Projeler` are connected across frontend code, route handlers, Prisma, and PostgreSQL. It is written as a reuse guide for other projects, so it focuses on data flow, contracts, persistence rules, and runtime behavior.

## Scope

The current implementation is primarily distributed across these files:

- `prisma/schema.prisma`
- `src/lib/prisma.ts`
- `src/lib/public-content-localization.ts`
- `src/lib/public-listings.ts`
- `src/lib/admin-listings.ts`
- `src/lib/projects.ts`
- `src/lib/project-media-assignments.ts`
- `src/lib/project-media-categories.ts`
- `src/lib/project-document-name.ts`
- `src/lib/project-document-selection.ts`
- `src/lib/homepage-project-carousel.ts`
- `src/lib/homepage-hero-listings.ts`
- `src/lib/utils.ts`
- `src/app/api/public/listings/route.ts`
- `src/app/api/public/listings/[slug]/route.ts`
- `src/app/api/public/listings/homepage-hero/route.ts`
- `src/app/api/public/projects/route.ts`
- `src/app/api/public/projects/[slug]/route.ts`
- `src/app/api/public/listing-forms/route.ts`
- `src/app/api/public/project-forms/route.ts`
- `src/app/api/admin/listings/route.ts`
- `src/app/api/admin/listings/[id]/route.ts`
- `src/app/api/admin/listings/[id]/media/route.ts`
- `src/app/api/admin/listings/[id]/status/route.ts`
- `src/app/api/admin/listings/[id]/homepage-hero/route.ts`
- `src/app/api/admin/projects/route.ts`
- `src/app/api/admin/projects/[id]/route.ts`
- `src/app/api/admin/projects/[id]/documents/route.ts`
- `src/app/api/admin/projects/[id]/promo-video/route.ts`
- `src/app/api/admin/projects/[id]/homepage-carousel/route.ts`
- `src/components/admin/listing-form.tsx`
- `src/app/(non-localized)/admin/projeler/yeni/components/NewProjectForm.tsx`
- `src/components/public/portfolio-client.tsx`
- `src/app/(localized)/[locale]/ilan/[slug]/page.tsx`
- `src/app/(localized)/[locale]/proje/[slug]/page.tsx`
- `src/app/(non-localized)/s1/data.ts`

## 1. Core architecture

The most important decision is this:

- Listings and projects share the same root table: `Listing`
- The discriminator is `Listing.isProject`
- `false` means a normal listing
- `true` means a project

That means the system does not have separate root models such as `Listing` and `Project`. Instead, projects reuse the same root record and add extra child records.

## 2. Database model

### 2.1 Shared root record

`prisma/schema.prisma` defines `Listing` as the common persistence model for both domains.

Important fields:

- identity: `id`, `slug`, `sku`
- publication state: `status`, `publishedAt`
- classification: `type`, `saleType`, `isProject`, `projectType`
- location: `city`, `district`, `neighborhood`, `address`, `googleMapsLink`, `latitude`, `longitude`
- numeric facts: `price`, `currency`, `area`
- listing-specific facts: `rooms`, `bedrooms`, `bathrooms`, `wcCount`, `floor`, `totalFloors`, `buildYear`, `heating`
- land / farm / commercial facts: `parcelNo`, `emsal`, `zoningStatus`, `groundFloorArea`, `basementArea`, `hasWaterSource`, `hasFruitTrees`, `existingStructure`
- homepage state: `showOnHomepageHero`, `homepageHeroSlot`, `homepageProjectSlot`
- project state: `deliveryDate`, `hasLastUnitsBanner`

### 2.2 Shared child records

Both listings and projects use:

- `ListingTranslation`
- `Media`
- `ListingTag`
- `SyncLog`

`ListingTranslation` stores locale-specific content:

- `title`
- `description`
- `features`
- `promoVideoTitle`

`Media` is also shared. The same table stores:

- images
- videos
- documents

The `Media.type` enum distinguishes `IMAGE`, `VIDEO`, and `DOCUMENT`. The `Media.category` field is a free string and is used as a convention-based classifier. Current project-related categories include:

- `EXTERIOR`
- `INTERIOR`
- `MAP`
- `DOCUMENT`
- `LOGO`
- `PROMO`

### 2.3 Project-only child records

Projects add structure through child tables that hang off `Listing.id`:

- `ProjectFeature`
- `ProjectFeatureTranslation`
- `CustomGallery`
- `CustomGalleryTranslation`
- `ProjectUnit`
- `ProjectUnitTranslation`
- `FloorPlan`
- `FloorPlanTranslation`
- `ListingFAQ`
- `ListingFAQTranslation`

This means a project is still one `Listing` row, but it can fan out into a richer graph.

### 2.4 Contact capture

Both public listing and project lead flows write into `ContactSubmission`.

Important detail:

- `ContactSubmission` stores `listingId` as a scalar
- it also snapshots `projectSlug` and `projectTitle`
- the schema does not define a Prisma relation from `ContactSubmission` back to `Listing`

That means submissions preserve the referenced slug/title at write time instead of depending on a live relational join later.

### 2.5 Prisma client

`src/lib/prisma.ts` exports one shared Prisma singleton. All route handlers and server components reuse this instance instead of instantiating new clients per request.

## 3. Shared localization pattern

Listings and projects use the same locale fallback helper pair:

- `getLocalizedFallbackLocales(requestedLocale, "tr")`
- `pickLocalizedEntry(entries, requestedLocale, "tr")`

The rule is:

1. prefer the requested locale
2. fall back to Turkish
3. if neither exists, fall back to the first available row

That rule is reused in:

- public listing list reads
- public listing detail reads
- public project list reads
- public project detail reads
- nested project feature / gallery / unit / FAQ translations
- public form submission title resolution

## 4. Read path: listings

### 4.1 Public listing list

The public portfolio list is client-driven.

Code path:

1. `src/app/(localized)/[locale]/portfoy/page.tsx` hands control to `PortfolioClient`
2. `PortfolioClient` builds query strings from URL state and local filter state
3. It fetches `/api/public/listings`
4. `src/app/api/public/listings/route.ts` parses filters and builds a Prisma `where`
5. Prisma queries `listing.findMany`, `listing.count`, and optional aggregate queries
6. JSON is returned to the client

The public listings API is intentionally broad. It serves:

- mixed listing/project portfolio data
- pagination
- type counts
- price histogram values
- room filtering across both normal listings and projects

The mixed room logic lives in `buildListingsRoomScope()`:

- normal listings match against `Listing.rooms`
- projects match against `ProjectUnit.rooms`

That is how one public endpoint can support both `/portfoy` and `/projeler`.

### 4.2 Public projects page is a filtered listing page

`src/app/(localized)/[locale]/projeler/page.tsx` does not render its own data loader.

It redirects to:

```txt
/{locale}/portfoy?onlyProjects=true
```

The actual filter is then applied by `/api/public/listings`, which adds:

```ts
if (onlyProjects) {
  baseWhere.isProject = true;
}
```

So the public projects index is not a separate data architecture. It is a constrained variant of the shared public listings API.

### 4.3 Public listing detail

Listing detail pages do not fetch their own JSON API for the main render.

Code path:

1. `src/app/(localized)/[locale]/ilan/[slug]/page.tsx` is a server component
2. It queries Prisma directly with `prisma.listing.findFirst`
3. It includes `translations` and `media`
4. It applies locale fallback and derives computed values
5. The route logic continues from that server-side data

Visibility rule for detail pages:

- normal listing detail accepts `PUBLISHED` and `REMOVED`

This is different from the list page, which only serves `PUBLISHED`.

### 4.4 Reusable public listing detail API

`src/app/api/public/listings/[slug]/route.ts` exposes the same listing domain as JSON.

It is not the primary source for the main listing detail page, but it is useful for:

- lightweight client fetches
- slug-to-id resolution
- any consumer that needs listing JSON without rendering the page server-side

### 4.5 Public listing lead submission

`src/components/public/listing-contact-panel.tsx` sends JSON to `/api/public/listing-forms`.

Route handler flow:

1. validate request with Zod
2. load the listing by `slug` with `isProject: false`
3. resolve the localized title with locale fallback
4. create `ContactSubmission`
5. send Telegram and GHL notifications

The listing form stores:

- `listingId`
- `projectSlug` as the listing slug
- `projectTitle` as the localized title snapshot
- `source: "listing-form"`

## 5. Read path: projects

### 5.1 Public projects API

`src/app/api/public/projects/route.ts` is the JSON list API for project records only.

Its base filter always starts with:

```ts
{
  isProject: true,
  status: ListingStatus.PUBLISHED
}
```

It supports:

- city and district filters
- room filtering via `projectUnits.some`
- homepage-specific selection mode with `homepage=1`

For homepage mode, the API:

1. loads projects explicitly assigned to homepage slots
2. detects missing slots
3. fills missing slots with fallback projects
4. returns projects ordered by slot

That makes homepage project selection deterministic while still allowing fallback content if some slots are empty.

### 5.2 Public homepage projects

The localized homepage client code fetches:

```txt
/api/public/projects?locale={locale}&homepage=1
```

That means homepage project data is not embedded directly into the page from Prisma. It is loaded through the public API layer.

### 5.3 Public project detail

Project detail pages use a different strategy from the public listing detail page.

Code path:

1. `src/app/(localized)/[locale]/proje/[slug]/page.tsx` calls `getS1ProjectPageData`
2. `src/app/(non-localized)/s1/data.ts` performs the Prisma query directly
3. The query loads the whole project graph:
   `Listing`
   `ListingTranslation`
   `Media`
   `ProjectFeature`
   `CustomGallery`
   `ProjectUnit`
   `FloorPlan`
   `ListingFAQ`
4. The helper maps raw Prisma rows into a page-specific data contract
5. The route logic continues from that transformed object

Important distinction:

- listing detail is a direct page-level Prisma read with light mapping
- project detail is a direct page-level Prisma read with a heavy transformation layer

### 5.4 Reusable public project detail API

`src/app/api/public/projects/[slug]/route.ts` also exposes project detail as JSON.

Like the listing detail API, it is not the primary data source for the main project detail render. The main render uses `getS1ProjectPageData()`. The JSON route is still useful for:

- slug-to-id resolution
- lightweight client consumers
- external consumers that need project JSON without the full page mapper

### 5.5 Public project lead submission

Project lead forms in `HeroContactForm` and `ProjectContactSection` send JSON to `/api/public/project-forms`.

Route handler flow:

1. validate with Zod
2. load the project by `slug` with `isProject: true`
3. resolve a localized title with locale fallback
4. create `ContactSubmission`
5. send Telegram and GHL notifications

The route writes:

- `listingId` = project id
- `projectSlug`
- `projectTitle`
- `source: "project-form"`

## 6. Admin read path

### 6.1 Admin list pages read Prisma directly

The admin list pages do not call their own admin APIs.

They are server components and read Prisma directly:

- `src/app/(non-localized)/admin/ilanlar/page.tsx`
- `src/app/(non-localized)/admin/projeler/page.tsx`

This is an important architectural split:

- admin list pages query Prisma directly in server components
- client-side edit flows and uploads use route handlers

### 6.2 Listing admin edit path

The listing edit page also loads its full record directly from Prisma on the server:

1. `src/app/(non-localized)/admin/ilanlar/[id]/page.tsx`
2. `prisma.listing.findUnique(...)`
3. include `translations`, `media`, `tags`
4. transform Prisma result into the prop shape expected by `ListingForm`

So listing editing starts server-hydrated.

### 6.3 Project admin edit path

Projects work differently.

`src/app/(non-localized)/admin/projeler/[id]/page.tsx` only verifies that the record exists, then renders:

```tsx
<NewProjectForm initialProjectId={id} />
```

The full project graph is then loaded client-side by:

```ts
fetch(`/api/admin/projects/${initialProjectId}`)
```

So project editing starts as:

- server-side auth + existence check
- client-side hydration through the admin project detail API

This difference exists because the project graph is much larger and has more nested collections to normalize on the client.

## 7. Admin write path: listings

### 7.1 Listing create

`src/components/admin/listing-form.tsx` persists through:

- `POST /api/admin/listings` for create
- `PATCH /api/admin/listings/{id}` for update

Create route flow in `src/app/api/admin/listings/route.ts`:

1. authorize with `getSession()`
2. reject `VIEWER`
3. parse JSON
4. normalize / resolve the Google Maps input
5. validate required fields
6. extract Turkish translation title
7. generate slug with `generateListingSlug(title, city, type)`
8. generate SKU using `ListingSerial` and `buildListingSku(city, serial.id)`
9. optionally validate homepage hero slot
10. inside a transaction:
    - create a `ListingSerial` row
    - upsert `ListingCompanyOption`
    - clear any existing listing already occupying the requested homepage hero slot
    - create the `Listing`
    - create `ListingTranslation` rows
    - create `ListingTag` rows

Important listing-create behavior:

- listings get a generated `sku`
- listings get a timestamp-suffixed slug
- the write path stores translations at creation time
- the company option list is enriched during create

### 7.2 Listing update

`src/app/api/admin/listings/[id]/route.ts` handles the main update path.

Update flow:

1. authorize
2. reject `VIEWER`
3. load the existing listing
4. normalize Google Maps input and inferred coordinates
5. validate allowed status transitions
6. enforce homepage-hero constraints
7. update the `Listing` inside a transaction
8. replace tag relations if tags were supplied
9. upsert translations if translations were supplied
10. reconcile `Media` ordering and cover state
11. delete removed media rows
12. remove deleted binary assets from object storage

Important listing-update rules:

- `sku` is treated as immutable
- `publishedAt` is set when a listing transitions into `PUBLISHED`
- removing a homepage-selected listing is blocked when that would leave zero homepage listings
- homepage hero slot ownership is exclusive

### 7.3 Listing media upload

Listings use a separate binary upload endpoint:

```txt
POST /api/admin/listings/{id}/media
```

The route:

1. validates auth
2. validates the target listing exists
3. validates content type, file count, file size, and total request size
4. uploads binaries through `uploadImage(...)`
5. immediately creates `Media` rows

This is immediate persistence. The upload route does not wait for the final listing save to create database media records.

### 7.4 Listing status and homepage selection

Listings also have dedicated narrow mutation routes:

- `PATCH /api/admin/listings/{id}/status`
- `PATCH /api/admin/listings/{id}/homepage-hero`

These routes exist because some actions are narrower than a full record save and carry special guard logic:

- status transitions
- homepage hero minimum-count rules
- exclusive hero slot assignment

## 8. Admin write path: projects

### 8.1 Project payload model

Project payloads are larger and are validated with Zod schemas in:

- `src/app/api/admin/projects/route.ts`
- `src/app/api/admin/projects/[id]/route.ts`

The payload includes:

- root listing fields
- translations
- project features
- custom galleries
- project units
- floor plans
- FAQs
- grouped media id arrays
- document names
- homepage slot selection
- promo video URL

### 8.2 Project create

Create flow:

1. authorize
2. reject `VIEWER`
3. validate payload with `CreateProjectSchema`
4. require Turkish title
5. require city and district
6. enforce at most one `PROMO` project unit
7. build a base slug with `getProjectSlugBase(...)` or a provided slug
8. guarantee uniqueness with `ensureUniqueSlug(...)`
9. normalize status and homepage slot
10. normalize Google Maps input
11. inside one transaction:
    - clear any project occupying the requested homepage slot
    - create the root `Listing` with `isProject: true`
    - optionally create a `Media` row for the promo video
    - create `ListingTranslation` rows
    - replace all child collections
    - assign project media categories
    - apply document names

Important project-create behavior:

- projects do not use `ListingSerial` or generated `sku` creation logic here
- the route returns only `{ id }`, not the full project graph
- the nested graph is created transactionally

### 8.3 Project update

Project update uses the same domain model but follows a replace-style strategy for nested collections.

The update route:

1. authorizes
2. validates payload with `UpdateProjectSchema`
3. loads the existing project
4. normalizes status, coordinates, and homepage slot state
5. enforces homepage minimum-count and maximum-count rules
6. opens one transaction
7. updates the root `Listing`
8. upserts `ListingTranslation`
9. replaces nested collections when those payload sections are present
10. reapplies media category assignments
11. reapplies document names
12. deletes old promo video binaries after the transaction when necessary

The nested replace helpers follow the same pattern:

- delete child translations
- delete child rows
- recreate rows from the incoming payload

This is used for:

- project features
- custom galleries
- project units
- floor plans
- FAQs

That means project updates are not patching child rows individually. They treat each collection as a replaceable slice of the project graph.

### 8.4 Project media strategy

Projects use three different media flows.

#### A. General image uploads

Project images reuse the listing upload route:

```txt
POST /api/admin/listings/{id}/media
```

That route immediately creates generic `Media` rows. At upload time, those rows are not yet classified as exterior, interior, map, logo, or document unless the upload path itself sets that metadata.

The real project categorization happens later during save through `replaceProjectMediaAssignments(...)`.

#### B. Project documents

Documents use a project-specific route:

```txt
POST /api/admin/projects/{id}/documents
```

That route immediately:

- uploads the binary
- creates a `Media` row with `type: DOCUMENT`
- sets `category: "DOCUMENT"`
- stores the display name as an `aiTags` entry via `doc-name:{name}`

So project document uploads persist both the file and the DB record immediately.

#### C. Project promo video

Promo video upload is split into two phases.

Phase 1:

```txt
POST /api/admin/projects/{id}/promo-video
```

This route only uploads the binary and returns a URL.

Phase 2:

- the returned URL is kept in form state
- the next `POST` or `PATCH` to the main project route persists it as a `Media` row with:
  `type: VIDEO`
  `category: PROMO`

This is different from image and document uploads, which create database rows immediately.

### 8.5 Project media categorization

Project media ordering and grouping are finalized by `replaceProjectMediaAssignments(...)`.

This helper:

1. clears existing categories for whichever category groups were supplied
2. builds a map of `mediaId -> category`
3. updates the matching `Media` rows
4. persists per-category ordering through `Media.order`
5. aligns the project cover image to the first exterior image

This is the key idea behind the project connection model:

- raw media rows can exist before final categorization
- the project save payload is the source of truth for category membership and order

### 8.6 Bootstrap draft before uploads

`NewProjectForm` contains an important connection pattern:

- media upload routes need a `listingId`
- a new project does not have an id until the root row exists

So the form uses:

```ts
ensureProjectId()
```

If there is no project id yet, it creates a silent draft first. That bootstrap draft gives the upload routes a stable root record to attach media to.

This is how the project form supports upload-first workflows without requiring the user to complete every field before uploading files.

## 9. Helper differences between listings and projects

### 9.1 Slug and identifier strategy

Listings:

- slug: `generateListingSlug(title, city, type)`
- SKU: generated from `ListingSerial` via `buildListingSku`

Projects:

- slug: `getProjectSlugBase(...)` plus `ensureUniqueSlug(...)`
- no `ListingSerial`-based SKU generation in the project create path

### 9.2 Company option enrichment

Listings:

- create/update upserts `ListingCompanyOption`

Projects:

- create/update stores `company` on the root `Listing`
- the project write path does not upsert `ListingCompanyOption`

The admin project list compensates by merging company names from:

- `listing_company_options`
- distinct `listings.company` values

### 9.3 Status behavior

Listings have explicit narrow status routes and more visible publish/remove guards. Projects handle most status logic in the main project route plus the homepage carousel route.

## 10. Homepage selection logic

Listings and projects both use slot-based homepage selection, but the rules are not identical.

### 10.1 Listings

Homepage listing selection uses:

- `homepageHeroSlot`
- `showOnHomepageHero`

Rules:

- slot must be `1`, `2`, or `3`
- only `PUBLISHED` listings can occupy a slot
- slot ownership is exclusive
- removing a currently selected listing is blocked if it would leave zero selected homepage listings

Public consumers use:

- `/api/public/listings/homepage-hero`

That route fills empty slots with fallback listings ordered by recency.

### 10.2 Projects

Homepage project selection uses:

- `homepageProjectSlot`
- `showOnHomepageHero`

Rules:

- only `PUBLISHED` projects can occupy a slot
- there are at most 3 selected slots
- removing a selected project is blocked if it would leave zero selected homepage projects
- when selecting through the dedicated toggle route, the first available slot is assigned automatically

Public consumers use:

- `/api/public/projects?homepage=1`

That route fills missing slots with fallback projects.

## 11. Why some reads use Prisma directly and others use APIs

This codebase uses two patterns on purpose.

### Direct Prisma reads

Used when:

- the caller is a server component
- the response needs to be prepared as part of the server render
- the read is close to the page boundary

Examples:

- listing detail page
- project detail page mapper
- admin listing index page
- admin project index page
- admin listing edit page preload

### Route handler reads/writes

Used when:

- the caller is a client component
- the caller needs JSON over fetch
- the action is a mutation
- the request carries binary uploads

Examples:

- public portfolio list fetches
- homepage listing/project fetches
- public lead submissions
- admin create/update/delete actions
- media uploads
- project client hydration for edit mode

This split keeps direct server-side reads simple while still exposing stable JSON contracts for client-driven workflows.

## 12. Reuse patterns for another project

If you want to reproduce this architecture in another codebase, the key reusable patterns are:

1. One shared root model with a discriminator
   Use one root table when listings and projects share most persistence fields.

2. Add domain richness with child tables
   Put project-only complexity into child tables instead of creating a second root model too early.

3. Keep localization in child translation tables
   Store repeated locale-aware fields outside the root record.

4. Use direct Prisma reads for server-side detail routes
   Do not force every server-side route through your own JSON APIs.

5. Use route handlers for client-driven fetches and mutations
   Client forms, uploads, and live filters benefit from stable JSON contracts.

6. Separate binary upload from domain save when necessary
   Projects use this for promo video and for draft bootstrap before uploads.

7. Treat nested project collections as replaceable slices
   Delete-and-recreate is simpler than partial mutation when nested editing is flexible and order-sensitive.

8. Centralize locale fallback
   Reuse the same requested-locale -> Turkish -> first-available rule everywhere.

9. Treat media categorization as a second step
   Upload binaries first, then map raw media ids into domain categories during the final save.

## 13. Current project summary

In this project, the connection model can be reduced to this:

- `Listing` is the shared database root for both listings and projects.
- `isProject` is the domain switch.
- listings use a flatter write path and a generated SKU/slug flow.
- projects use the same root row plus a replaceable nested graph.
- server-side route code often reads Prisma directly.
- client-driven modules use route handlers as JSON contracts.
- image uploads create `Media` rows immediately.
- project categorization is finalized during project save.
- project documents persist immediately, but promo video persistence is deferred until the main project save.
- public lead forms for both domains write `ContactSubmission` rows and trigger outbound notifications.
