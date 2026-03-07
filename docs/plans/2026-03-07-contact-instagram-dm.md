# Contact Instagram DM Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Route the `/[locale]/iletisim` Instagram DM button to the canonical direct-message URL for the official Guzel Invest Instagram account.

**Architecture:** Keep social destinations centralized in `src/lib/social-links.ts`, but separate profile and DM URLs so each consumer can choose the correct behavior. Update the contact page CTA to use the canonical DM link instead of a hardcoded value and lock the behavior with a focused unit test.

**Tech Stack:** Next.js App Router, React, TypeScript, Node test runner

---

### Task 1: Add canonical Instagram DM link

**Files:**
- Modify: `src/lib/social-links.ts`
- Test: `src/lib/social-links.test.ts`

**Step 1: Write the failing test**

Add an assertion that `SOCIAL_LINKS.instagramDm` equals `https://ig.me/m/guzelinvest`.

**Step 2: Run test to verify it fails**

Run: `node --test src/lib/social-links.test.ts`
Expected: FAIL because `instagramDm` does not exist yet.

**Step 3: Write minimal implementation**

Add `instagramDm` to `SOCIAL_LINKS` without changing the existing profile URL.

**Step 4: Run test to verify it passes**

Run: `node --test src/lib/social-links.test.ts`
Expected: PASS.

### Task 2: Use canonical DM link on the contact page

**Files:**
- Modify: `src/app/(localized)/[locale]/iletisim/page.tsx`

**Step 1: Replace hardcoded href**

Import `SOCIAL_LINKS` and use `SOCIAL_LINKS.instagramDm` for the Instagram DM CTA.

**Step 2: Verify page compiles logically**

Run: `node --test src/lib/social-links.test.ts`
Expected: PASS with the contact page referencing the centralized DM URL.
