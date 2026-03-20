# Public Locales And Admin Fallback Design

## Goal

Enable public English, Russian, and German locales alongside Turkish, remove Arabic from the public locale surface, move language selection into the header and mobile hamburger menu, and ensure listing/project detail content uses admin-managed translations with Turkish fallback when a requested translation is missing.

## Scope

- Public locale routing and request config
- Header and mobile language switcher UX
- Homepage popup translation coverage
- Public page copy cleanup for affected listing/project flows and shared chrome
- Admin translation fallback rules for listing and project detail content

## Decisions

### Public locales

Public routing will expose `tr`, `en`, `ru`, and `de`. Arabic will remain absent from public locale config and the language switcher. Existing admin translation forms already target the same four locales, so no admin UX expansion is required.

### Language switcher UX

Desktop will show a compact dropdown in the header with `EN TR RU DE`. Mobile will render the same locales as direct buttons inside the hamburger menu. Route changes must preserve the current pathname, slug, hash, and query string.

### Admin-managed content fallback

Listings and projects will prefer the requested locale translation. If the admin has not provided that locale, the UI will render the Turkish translation instead. This applies to title, description, features, FAQ items, project feature labels, gallery titles, unit titles, and promo video titles. The page locale remains the selected locale; only the missing content falls back to Turkish.

### Translation boundaries

Static UI chrome and page copy must come from `next-intl` messages. Admin-managed content must continue to come from Prisma translations and must not be duplicated in message files.

## Implementation notes

- Centralize locale metadata so routing, request config, and UI switchers use one source of truth.
- Extract or reuse helper logic for translation selection where tests can lock fallback behavior.
- Keep `tr` as the default locale and preserve current redirect behavior from `/` to `/tr`.
- Avoid changing Prisma schema because the needed locale set already exists in data records.

## Risks

- Public pages contain a large amount of hardcoded Turkish copy; only affected shared chrome and detail-related flows should be moved in this pass unless additional pages are directly touched.
- Locale switching can regress query-string based portfolio/project navigation if the switcher rebuilds URLs incorrectly.
- Listing detail currently hardcodes Turkish labels heavily; fallback and UI copy changes need focused regression coverage.
