# Contact Intro Reposition Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Show the `İletişim Bilgileri` heading and intro text above the WhatsApp and Instagram buttons on mobile without changing the desktop layout.

**Architecture:** Extract the shared intro content into one reusable fragment and render it in two responsive slots: mobile above the action buttons and desktop above the contact cards. Keep the existing mobile ordering for actions, form, cards, and map.

**Tech Stack:** Next.js App Router, React, TypeScript, Tailwind CSS, Node test runner

---

### Task 1: Update the contact page regression test

**Files:**
- Modify: `src/app/(localized)/[locale]/iletisim/page.test.ts`

**Step 1: Write the failing test**

Assert that the page source contains:
- a mobile-only intro block before the CTA buttons
- a desktop-only intro block in the contact-details column

**Step 2: Run test to verify it fails**

Run: `npx tsx src/app/'(localized)'/'[locale]'/iletisim/page.test.ts`
Expected: FAIL because the responsive intro blocks do not exist yet.

**Step 3: Write minimal implementation**

Add the responsive intro slots using shared JSX.

**Step 4: Run test to verify it passes**

Run: `npx tsx src/app/'(localized)'/'[locale]'/iletisim/page.test.ts`
Expected: PASS.

### Task 2: Verify lint

**Files:**
- Modify: `src/app/(localized)/[locale]/iletisim/page.tsx`

**Step 1: Run targeted lint**

Run: `npx eslint src/app/'(localized)'/'[locale]'/iletisim/page.tsx src/app/'(localized)'/'[locale]'/iletisim/page.test.ts`
Expected: PASS.
