# Public Locales And Admin Fallback Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Expose `tr/en/ru/de` on the public site, remove Arabic from the public locale surface, add header/mobile language switching, and make listing/project detail content fall back to Turkish when admin translations are missing.

**Architecture:** Locale metadata will be centralized in the i18n layer and consumed by routing, request config, and language switcher UI. Static page chrome will use `next-intl` messages while admin-managed content will continue to come from Prisma translations, selected by `requested locale -> tr -> first available`.

**Tech Stack:** Next.js App Router, `next-intl`, Prisma, React 19, Node test runner

---

### Task 1: Lock locale configuration behavior with tests

**Files:**
- Modify: `src/i18n/routing.test.ts`
- Create: `src/lib/public-content-localization.test.ts`
- Create: `src/lib/public-content-localization.ts`

**Step 1: Write the failing tests**

- Add a routing test asserting public locales are `["tr", "en", "ru", "de"]`.
- Add fallback tests asserting requested locale is preferred, Turkish is used when missing, and first available is last resort.

**Step 2: Run tests to verify they fail**

Run: `node --test src/i18n/routing.test.ts src/lib/public-content-localization.test.ts`

Expected: failures because locale config and helper do not yet match the new behavior.

**Step 3: Write minimal implementation**

- Centralize locale metadata and a reusable translation picker helper.

**Step 4: Run tests to verify they pass**

Run: `node --test src/i18n/routing.test.ts src/lib/public-content-localization.test.ts`

Expected: PASS

### Task 2: Enable public locales and language switcher UI

**Files:**
- Modify: `src/i18n/routing.ts`
- Modify: `src/i18n/request.ts`
- Modify: `src/components/public/navbar.tsx`
- Modify: `src/components/public/footer.tsx`
- Modify: `messages/tr.json`
- Modify: `messages/en.json`
- Modify: `messages/ru.json`
- Modify: `messages/de.json`

**Step 1: Write the failing tests**

- Extend routing tests if needed for redirect behavior.
- Add UI-safe helper tests for locale labels/order if helper extraction is used.

**Step 2: Run tests to verify they fail**

Run: `node --test src/i18n/routing.test.ts`

Expected: failure until locale config is updated.

**Step 3: Write minimal implementation**

- Expose locale metadata to the public app.
- Add desktop dropdown and mobile hamburger language buttons in `EN TR RU DE` order.
- Move shared navbar/footer labels to messages where needed.

**Step 4: Run tests to verify they pass**

Run: `node --test src/i18n/routing.test.ts`

Expected: PASS

### Task 3: Fix listing/project admin translation fallback

**Files:**
- Modify: `src/app/(localized)/[locale]/ilan/[slug]/page.tsx`
- Modify: `src/app/(non-localized)/s1/data.ts`
- Modify: `src/app/api/public/listings/[slug]/route.ts`
- Test: `src/lib/public-content-localization.test.ts`

**Step 1: Write the failing tests**

- Add cases for listing translations and project nested translations selecting the requested locale before Turkish fallback.

**Step 2: Run tests to verify they fail**

Run: `node --test src/lib/public-content-localization.test.ts`

Expected: FAIL until fallback helper is wired in.

**Step 3: Write minimal implementation**

- Replace Turkish-first selection in listing detail.
- Reuse the picker helper in project data assembly and public APIs where appropriate.

**Step 4: Run tests to verify they pass**

Run: `node --test src/lib/public-content-localization.test.ts`

Expected: PASS

### Task 4: Translate popup and affected shared public copy

**Files:**
- Modify: `src/components/public/homepage-popup-form.tsx`
- Modify: `src/components/public/listing-detail-gallery.tsx`
- Modify: `src/components/public/listing-contact-panel.tsx`
- Modify: `src/app/(localized)/[locale]/ilan/[slug]/page.tsx`
- Modify: `src/app/(non-localized)/s1/components/HeroContactForm.tsx`
- Modify: `src/app/(non-localized)/s1/components/ProjectContactSection.tsx`
- Modify: `src/app/(non-localized)/s1/components/MapAndCTA.tsx`
- Modify: `src/app/(non-localized)/s1/components/ProjectGalleryHub.tsx`
- Modify: `src/app/(non-localized)/s1/components/Visuals.tsx`
- Modify: `messages/tr.json`
- Modify: `messages/en.json`
- Modify: `messages/ru.json`
- Modify: `messages/de.json`

**Step 1: Write the failing tests**

- Add targeted tests only where behavior can be isolated cheaply.

**Step 2: Run tests to verify they fail**

Run: `node --test src/lib/public-content-localization.test.ts`

Expected: failures only for helper-backed logic; UI copy is primarily verified manually and via lint/build.

**Step 3: Write minimal implementation**

- Replace hardcoded strings in the popup and detail-related shared components with `next-intl` messages.
- Keep admin-managed listing/project fields data-driven.

**Step 4: Run tests to verify they pass**

Run: `npm run lint -- --file src/components/public/homepage-popup-form.tsx --file src/app/(localized)/[locale]/ilan/[slug]/page.tsx`

Expected: exit 0

### Task 5: Verify the integrated flow

**Files:**
- Modify: any touched files from previous tasks

**Step 1: Run focused verification**

Run: `node --test src/i18n/routing.test.ts src/lib/public-content-localization.test.ts`

Run: `npm run lint`

**Step 2: Review locale-switching paths manually**

- `/tr`, `/en`, `/ru`, `/de`
- listing detail with and without non-TR translations
- project detail with and without non-TR translations
- homepage popup copy in each locale

**Step 3: Record any remaining gaps**

- Note untouched public pages that still carry hardcoded Turkish copy if they remain outside this change set.
