# Homepage PageSpeed Optimization Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Improve `https://dev.guzelinvestalanya.com/tr` performance from Mobile `58` / Desktop `64` to Mobile `>= 75` / Desktop `>= 80` without reducing conversion-critical UX.

**Architecture:** Cut initial payload first (media + third-party embed scripts), then reduce main-thread JS cost, then add guardrails so heavy assets do not regress. Keep interactive video experiences, but shift media fetch to user intent and viewport visibility.

**Tech Stack:** Next.js App Router, React Client Components, `next/image`, dynamic imports, Lighthouse/PageSpeed API, MinIO media storage.

---

## Baseline (Reports from 2026-03-06)

- Mobile (`pagespeed-2026-03-06_13-29-02+0300.json`)
- Desktop (`pagespeed-2026-03-06_13-29-40+0300.json`)
- Common bottlenecks:
- Initial transfer is very high: Mobile `10,621 KiB`, Desktop `11,473 KiB`.
- Single largest request is one MP4 (`~8,723 KiB`) from testimonial media.
- Unused JS is high: Mobile `~557 KiB`, Desktop `~601 KiB` (mostly YouTube player scripts + homepage chunks).
- Unused CSS is high: Mobile `~90 KiB`, Desktop `~55 KiB` (mostly YouTube player CSS).
- Main-thread cost is script-heavy: evaluation + parse is `~1.2s` mobile and `~1.5s` desktop.
- LCP discovery insight flags missing high-priority fetch on the current LCP image.
- Server response time is already good (`20–40 ms`), so backend latency is not the limiter.

## Task 1: Stop Eager Loading Testimonial Videos/Embeds

**Files:**
- Modify: `src/app/(localized)/[locale]/page.tsx`
- Modify: `src/components/public/styled-video-player.tsx`
- Create: `src/components/public/lazy-embed-frame.tsx` (or similar reusable lazy media wrapper)
- Test: `src/lib/homepage-video.test.ts` (new helper tests if helper extraction is needed)

**Step 1: Introduce click-to-load media shells in testimonial cards**

- Replace immediate `<iframe>` and `<video src=...>` mounts in `TestimonialMedia` with a poster + play button shell.
- Mount iframe/video only after user click (and optionally when card enters viewport).

**Step 2: Set safer preload defaults**

- Add a `preload` prop to `StyledVideoPlayer` and default it to `"none"` for testimonial cards.
- Keep current playback controls and muted/unmuted UX unchanged.

**Step 3: Verify**

- Run PageSpeed mobile + desktop.
- Confirm MP4 request is no longer in initial critical requests.
- Target: initial transfer reduction by at least `6–8 MB`.

## Task 2: Convert Hero Side Video to Intent-Driven Load

**Files:**
- Modify: `src/app/(localized)/[locale]/page.tsx`
- Modify: `src/lib/homepage-video.ts`

**Step 1: Change hero side tile to poster-first**

- In hero side block, replace always-mounted autoplay iframe/video with:
- static poster image layer
- play CTA
- modal open action

**Step 2: Load actual video only in modal**

- Keep video embed/player only inside modal after user interaction.
- For YouTube mode, use a privacy-enhanced embed URL (`youtube-nocookie`) if compatible.

**Step 3: Verify**

- Confirm YouTube player JS/CSS are absent from initial load when modal remains closed.
- Target: remove most of the `~500–600 KiB` unused JS reported.

## Task 3: Fix LCP Fetch Priority on the Real First-Visible Image

**Files:**
- Modify: `src/app/(localized)/[locale]/page.tsx`

**Step 1: Ensure visible first slide image is explicitly high priority**

- Keep `priority` on first-visible hero image for both mobile and desktop carousels.
- Add explicit `fetchPriority="high"` and `loading="eager"` to the visible LCP candidate.
- Ensure non-visible slides are `loading="lazy"` and lower priority.

**Step 2: Verify**

- Re-run Lighthouse and confirm `lcp-discovery-insight` no longer flags missing priority hint.
- Target: mobile LCP drops materially (goal `< 4.0s`).

## Task 4: Reduce Homepage Main-Thread JS

**Files:**
- Modify: `src/app/(localized)/[locale]/page.tsx`
- Create: `src/components/public/homepage/*.tsx` section components (server/client split)

**Step 1: Split monolithic homepage client component**

- Extract non-interactive sections into server components.
- Keep only high-interaction parts as client components (hero controls, filters, modal).

**Step 2: Lazy-load below-the-fold interactive blocks**

- Defer testimonials carousel logic and other heavy interactive blocks until near viewport.
- Use dynamic imports with loading skeletons.

**Step 3: Verify**

- Run `next build` and compare homepage route chunk sizes.
- Target: lower script evaluation and reduce desktop TBT from `380 ms` toward `< 200 ms`.

## Task 5: Enforce Media Budgets in Admin Upload Paths

**Files:**
- Modify: `src/app/api/admin/homepage/video/route.ts`
- Modify: `src/app/api/admin/testimonials/upload-video/route.ts`
- Modify: `src/components/admin/homepage-settings-manager.tsx`
- Modify: `src/components/admin/testimonial-form.tsx`

**Step 1: Tighten upload limits and guidance**

- Lower maximum upload size from current large threshold to a web-safe budget.
- Add admin UI hints for recommended encode profile (short clip, compressed web MP4/WebM, low bitrate).

**Step 2: Block obviously oversized uploads**

- Reject files outside budget with clear actionable error text.
- Optional follow-up: queue server-side transcode if you want quality automation.

**Step 3: Verify**

- Confirm new uploads cannot exceed performance budget.
- Confirm no regression of playback UX.

## Task 6: Add Performance Regression Guardrail

**Files:**
- Modify: `scripts/pagespeed-runner.mjs`
- Create/Modify: `PageSpeed.md` (automation section)
- Create: `docs/performance-budget.md`

**Step 1: Track both strategies by default**

- Extend runner to run mobile + desktop in one command and emit compact summary.

**Step 2: Define budget thresholds**

- Example thresholds for homepage:
- Mobile performance `>= 75`
- Desktop performance `>= 80`
- Mobile LCP `< 4.0s`
- Initial transfer `< 3.0MB`

**Step 3: Verify**

- Add a CI/manual check command and document pass/fail policy.

## Rollout Order

1. Task 1 (testimonial lazy media)
2. Task 2 (hero intent-based video loading)
3. Task 3 (LCP fetch priority fix)
4. Task 4 (bundle and main-thread reduction)
5. Task 5 (admin media guardrails)
6. Task 6 (regression prevention)

## Expected Outcome After Tasks 1-3

- Largest single request removed from initial path (`~8.7MB` MP4).
- YouTube player payload mostly removed from first render.
- LCP request priority corrected.
- Likely immediate jump to roughly:
- Mobile performance `~70-80`
- Desktop performance `~75-85`

These estimates must be validated by rerunning PageSpeed after each task.
