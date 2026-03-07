# Contact Mobile Layout Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Fix the overflowing email text on mobile and reorder the `/[locale]/iletisim` content so the primary contact actions and form appear before secondary contact details on small screens.

**Architecture:** Keep the existing desktop two-column layout intact and use responsive Tailwind utility classes to change the visual order only on mobile. Add a focused regression test that checks the contact page source for the required responsive ordering and email wrapping classes.

**Tech Stack:** Next.js App Router, React, TypeScript, Tailwind CSS, Node test runner

---

### Task 1: Lock the mobile layout requirements with a failing test

**Files:**
- Create: `src/app/(localized)/[locale]/iletisim/page.test.ts`
- Test: `src/app/(localized)/[locale]/iletisim/page.test.ts`

**Step 1: Write the failing test**

Assert that the contact page source includes:
- a wrapping class for the email link text
- responsive order classes that place the form/actions before the contact cards on mobile

**Step 2: Run test to verify it fails**

Run: `npx tsx --test src/app/'(localized)'/'[locale]'/iletisim/page.test.ts`
Expected: FAIL because those classes are not present yet.

**Step 3: Write minimal implementation**

Add the needed Tailwind classes in the page component.

**Step 4: Run test to verify it passes**

Run: `npx tsx --test src/app/'(localized)'/'[locale]'/iletisim/page.test.ts`
Expected: PASS.

### Task 2: Verify the page remains clean

**Files:**
- Modify: `src/app/(localized)/[locale]/iletisim/page.tsx`

**Step 1: Run targeted lint**

Run: `npx eslint src/app/'(localized)'/'[locale]'/iletisim/page.tsx src/app/'(localized)'/'[locale]'/iletisim/page.test.ts`
Expected: PASS.
