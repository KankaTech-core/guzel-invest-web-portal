# Image Optimization Guide

This document explains how image optimization works in this codebase. It covers the shared optimizer, upload entrypoints, object-storage paths, database touch points, migration scripts, cache headers, and cleanup behavior. It is written as a reuse guide for other projects, so it focuses on code paths and runtime rules.

## Scope

The current implementation is primarily distributed across these files:

- `src/lib/minio.ts`
- `src/lib/utils.ts`
- `src/app/api/admin/listings/[id]/media/route.ts`
- `src/app/api/admin/articles/media/route.ts`
- `src/app/api/admin/testimonials/upload/route.ts`
- `src/app/api/admin/listings/[id]/route.ts`
- `src/app/api/admin/articles/route.ts`
- `src/app/api/admin/articles/[id]/route.ts`
- `src/app/api/admin/testimonials/route.ts`
- `src/app/api/admin/testimonials/[id]/route.ts`
- `src/components/admin/listing-form.tsx`
- `src/components/admin/article-form.tsx`
- `src/components/admin/testimonial-form.tsx`
- `scripts/optimize-existing-images.ts`
- `scripts/deploy-optimize-images.ts`
- `scripts/backfill-image-cache-headers.ts`
- `package.json`
- `prisma/schema.prisma`

## 1. Core architecture

The optimizer has one shared runtime implementation:

- `uploadImage(...)` in `src/lib/minio.ts`

All image upload entrypoints call that function instead of implementing their own Sharp pipeline.

That means the optimization rules are centralized:

- resize cap
- output format
- compression settings
- thumbnail generation
- cache headers
- storage path layout
- max optimized size guard

## 2. Storage backend

The optimizer writes to MinIO through the client created in `src/lib/minio.ts`.

Configuration comes from environment variables:

- `MINIO_ENDPOINT`
- `MINIO_PORT`
- `MINIO_USE_SSL`
- `MINIO_ACCESS_KEY`
- `MINIO_SECRET_KEY`
- `MINIO_BUCKET`
- `MINIO_MAX_OPTIMIZED_IMAGE_MB`

The bucket is created on demand by `ensureBucketExists()`. If it does not exist, the code:

1. creates the bucket
2. applies a public-read policy for `public/*`

That makes the image pipeline self-bootstrapping as long as the MinIO credentials are valid.

## 3. Shared optimization rules

The shared optimizer lives in `uploadImage(file, entityId, originalFilename, options)`.

Current hard-coded defaults in `src/lib/minio.ts`:

- output format: `webp`
- quality: `60`
- effort: `4`
- max dimensions: `1920x1080`
- thumbnail dimensions: `400x300`
- cache header: `public, max-age=31536000, immutable`
- default optimized size ceiling: `8MB`

The size ceiling is configurable through:

```txt
MINIO_MAX_OPTIMIZED_IMAGE_MB
```

If that env var is absent or invalid, the fallback is `8`.

## 4. Exact transformation pipeline

`uploadImage(...)` applies this sequence:

1. read the incoming binary into Sharp
2. read original metadata
3. resize with:
   `fit: "inside"`
   `withoutEnlargement: true`
4. encode the main image as WebP
5. read optimized metadata from the new buffer
6. reject the upload if the optimized buffer still exceeds the configured max optimized size
7. generate a thumbnail from the original buffer with:
   `resize(400, 300, { fit: "cover" })`
8. encode the thumbnail as WebP
9. upload both objects to MinIO with immutable cache headers

Important consequences:

- every accepted image is re-encoded to WebP
- every accepted image gets a generated thumbnail
- the original uploaded format is not preserved
- smaller source images are not enlarged
- the thumbnail is cropped to fill `400x300`

## 5. Object path layout

The optimizer writes two objects per image:

- original path:
  `public/{collection}/{entityId}/original/{uuid}.webp`
- thumbnail path:
  `public/{collection}/{entityId}/thumb/{uuid}.webp`

The collection comes from `options.collection` and currently supports:

- `listings`
- `articles`
- `testimonials`

The returned object from `uploadImage(...)` is:

```ts
{
  url,
  thumbnailUrl,
  width,
  height,
  size
}
```

These are storage-relative paths, not absolute public URLs.

## 6. URL resolution

Public delivery URLs are built later by `getMediaUrl(path)` in `src/lib/utils.ts`.

It converts a storage-relative path such as:

```txt
public/listings/abc/original/file.webp
```

into:

```txt
{NEXT_PUBLIC_MINIO_URL}/{bucket}/public/listings/abc/original/file.webp
```

If the stored value already starts with `http`, `getMediaUrl()` returns it unchanged.

This creates a clean split:

- database and route handlers store relative object paths
- consumers convert them to absolute URLs only when needed

## 7. Database touch points

### 7.1 Listings

Listings persist optimized image metadata in the `Media` table.

Relevant fields in `prisma/schema.prisma`:

- `url`
- `thumbnailUrl`
- `width`
- `height`
- `size`
- `type`
- `order`
- `isCover`

The listing media upload route creates `Media` rows immediately after `uploadImage(...)` succeeds.

### 7.2 Articles

Articles do not use the `Media` table for cover images.

They persist:

- `Article.coverImageUrl`
- `Article.coverThumbnailUrl`

The article media upload route only returns optimized paths. The main article save route stores those paths in the `Article` row.

### 7.3 Testimonials

Testimonials store only:

- `Testimonial.imageUrl`

The testimonial image upload route returns both `url` and `thumbnailUrl`, but the main testimonial save routes persist only `imageUrl`.

That means thumbnails are generated for testimonial uploads, but the current testimonial schema does not store a thumbnail reference.

## 8. Upload entrypoints

### 8.1 Listings

Route:

```txt
POST /api/admin/listings/{id}/media
```

Implementation:

- validates auth
- validates listing existence
- accepts multiple files
- validates per-file and total request size
- validates MIME type
- calls `uploadImage(...)`
- creates `Media` rows immediately

Current listing route limits:

- allowed types:
  `jpeg`, `png`, `webp`, `gif`, `avif`
- max per file: `30MB`
- max files per request: `15`
- max total request size: `35MB`

This route is the most complete image ingestion path because upload and database persistence happen together.

### 8.2 Articles

Route:

```txt
POST /api/admin/articles/media
```

Implementation:

- validates auth
- accepts a single file
- validates file size and type
- calls `uploadImage(...)` with `collection: "articles"`
- returns optimized paths and dimensions

Current article route limits:

- allowed types:
  `jpeg`, `png`, `webp`, `gif`
- max file size: `30MB`

The article route does not create a `Media` row. It only returns the optimized result.

### 8.3 Testimonials

Route:

```txt
POST /api/admin/testimonials/upload
```

Implementation:

- validates auth
- accepts a single file
- validates file size and type
- calls `uploadImage(...)` with:
  `entityId: "avatars"`
  `collection: "testimonials"`
- returns optimized paths and dimensions

Current testimonial route limits:

- allowed types:
  `jpeg`, `png`, `webp`, `gif`, `avif`
- max file size: `10MB`

All testimonial images currently land under the same logical entity id:

```txt
public/testimonials/avatars/...
```

## 9. Client-side callers

### 9.1 Listing form

`src/components/admin/listing-form.tsx` uploads images through:

```ts
fetch(`/api/admin/listings/${listingId}/media`, ...)
```

Behavior:

- files are uploaded in chunks
- upload success appends new `Media` rows into form state
- preview rendering prefers `thumbnailUrl || url`
- final listing save later persists ordering and cover flags

The optimization work itself does not happen in the form. The form only sends binaries to the upload route and consumes the optimized response.

### 9.2 Article form

`src/components/admin/article-form.tsx` uploads through:

```ts
fetch("/api/admin/articles/media", ...)
```

The form uses the route in two places:

- cover image upload
- inline image upload inside article content

`processMediaBeforeSubmit(...)` is important here:

1. upload pending cover image if present
2. scan article HTML for inline `img` tags
3. upload `blob:` or `data:image/...` sources
4. replace inline `src` with `getMediaUrl(uploaded.url)`
5. persist `coverImageUrl` and `coverThumbnailUrl` in the article payload

This means article image optimization is part of the article save pipeline, not only the raw upload pipeline.

### 9.3 Testimonial form

`src/components/admin/testimonial-form.tsx` uploads through:

```ts
fetch("/api/admin/testimonials/upload", ...)
```

The returned `url` is then stored in local form state and later persisted to the `Testimonial` row via:

- `POST /api/admin/testimonials`
- `PUT /api/admin/testimonials/{id}`

## 10. Error model

`uploadImage(...)` can throw a typed error created by `createMinioUploadError(...)`.

The important current code is:

```txt
MEDIA_OPTIMIZED_TOO_LARGE
```

That error is raised when the optimized buffer is still larger than the configured limit.

The listing, article, and testimonial upload routes all detect this code and return a structured `413` response.

The listing upload route adds more request-level guards:

- missing file
- too many files
- invalid type
- file too large
- total request too large
- aborted connection

## 11. Cleanup behavior

### 11.1 Listing cleanup

Listings have the strongest cleanup path.

When listing media is removed during `PATCH /api/admin/listings/{id}`:

1. removed `Media` rows are detected
2. those rows are deleted from the database
3. their object paths are collected
4. `deleteImage(url)` is called

`deleteImage(...)` removes:

- the original object
- the matching thumbnail object by replacing `/original/` with `/thumb/`

### 11.2 Article cleanup

The current article routes do not delete old image objects from MinIO when:

- the cover image is replaced
- an inline image is removed from article content
- an article is deleted

The route logic updates database fields only.

### 11.3 Testimonial cleanup

The current testimonial routes also do not delete image objects from MinIO when:

- the image is replaced
- the testimonial is deleted

The route logic updates or deletes database rows only.

This means the current storage cleanup guarantees are strongest for listing media and weaker for article/testimonial images.

## 12. Re-optimizing existing images

There are two scripts for older images already in storage.

### 12.1 Manual migration script

File:

- `scripts/optimize-existing-images.ts`

Behavior:

1. list existing original images in MinIO
2. download each image
3. optionally skip already-small files
4. re-encode with the same optimization profile
5. regenerate the thumbnail
6. back up the original under `/backup/`
7. overwrite the original and thumbnail at the same paths

Important property:

- database references do not change

Current script scope:

- prefixes scanned:
  `public/listings/`
  `public/articles/`
- object filter:
  paths containing `/original/` and ending in `.webp`

So this script currently does not process testimonial images.

Supported modes:

- `DRY_RUN=true`
- `SKIP_SMALL=true`

### 12.2 Deployment-safe migration script

File:

- `scripts/deploy-optimize-images.ts`

This is the deployment version of the same idea.

Additional behavior:

- writes a MinIO marker object:
  `.migrations/image-optimize-v1.done`
- skips execution if the marker already exists
- supports `FORCE=true`
- does not fail the build if the script crashes

The build pipeline in `package.json` runs:

1. `next build`
2. `scripts/deploy-optimize-images.ts`
3. `scripts/backfill-image-cache-headers.ts`

Because the build command wraps the optimization scripts with `|| true`, deployment continues even if MinIO is unreachable.

## 13. Cache headers

Newly optimized images written through `uploadImage(...)` get:

```txt
Cache-Control: public, max-age=31536000, immutable
Content-Type: image/webp
```

The backfill script exists to normalize older objects that do not have the current cache policy.

File:

- `scripts/backfill-image-cache-headers.ts`

Behavior:

1. list image objects under:
   `public/listings/`
   `public/articles/`
   `public/testimonials/`
2. detect image paths by extension
3. inspect current object metadata
4. if the cache header does not match the target policy, rewrite metadata in place using `copyObject(...)`
5. write a MinIO marker on success:
   `.migrations/image-cache-header-v1.done`

Supported image extensions for the backfill:

- `.avif`
- `.gif`
- `.jpeg`
- `.jpg`
- `.png`
- `.svg`
- `.webp`

This script is broader than the re-optimization scripts because it includes testimonials and legacy image extensions.

## 14. Current route-by-route differences

The current image optimization system is shared, but persistence differs by domain.

### Listings

- shared optimizer: yes
- thumbnail generated: yes
- thumbnail persisted: yes
- database row created at upload time: yes
- storage cleanup on deletion: yes

### Articles

- shared optimizer: yes
- thumbnail generated: yes
- thumbnail persisted: yes
- database row created at upload time: no
- storage cleanup on deletion: no

### Testimonials

- shared optimizer: yes
- thumbnail generated: yes
- thumbnail persisted: no
- database row created at upload time: no dedicated media row
- storage cleanup on deletion: no

## 15. Reuse patterns for another project

If you want to reuse this design in another codebase, the main patterns are:

1. Centralize image optimization in one storage helper
   Keep Sharp rules in one function so every upload path behaves the same.

2. Store relative object paths, not full URLs
   Build absolute delivery URLs later with one helper.

3. Generate thumbnails eagerly
   Do not make thumbnail creation a separate asynchronous concern unless scale forces it.

4. Separate binary upload from domain persistence when needed
   Articles and testimonials use this pattern.

5. Use route-specific validation even when optimization is shared
   Different domains can keep different file-size and MIME policies.

6. Reprocess old files in place
   Overwriting object contents while keeping the same paths preserves database references.

7. Back up before bulk rewrites
   The migration scripts protect against irreversible loss by writing `/backup/` copies first.

8. Treat cache headers as part of the optimization pipeline
   Compression without delivery metadata leaves performance on the table.

## 16. Current project summary

In this project, the image optimization logic can be reduced to this:

- all main image upload routes call `uploadImage(...)`
- every accepted image is resized within `1920x1080`, encoded as WebP, and given a `400x300` thumbnail
- MinIO stores both original and thumbnail under predictable `public/...` paths
- listings persist optimized images as `Media` rows immediately
- articles persist optimized paths into `Article.coverImageUrl` and `Article.coverThumbnailUrl`
- testimonials persist only the original optimized image path
- listing media deletion also deletes the related MinIO objects
- article and testimonial image cleanup is not automatic today
- deployment runs one-time MinIO re-optimization and cache-header backfill scripts after build

