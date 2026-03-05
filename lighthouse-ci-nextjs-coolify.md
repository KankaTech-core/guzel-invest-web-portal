# Lighthouse CI for a Next.js (React) project (Coolify-friendly)

This guide sets up **Lighthouse CI (LHCI)** so you can:
- run Lighthouse audits locally, and
- run them automatically in **GitHub Actions** (recommended when deploying with Coolify).

It will audit **multiple routes** (not just `/`) using a **production build**.

---

## 0) Prerequisites

- Node.js 18+ (recommended)
- A Next.js app with scripts like `build` and `start` in `package.json`
- Your routes can be accessed without authentication (LHCI can’t easily log in).

Reference docs:
- LHCI Getting Started  
  https://github.com/GoogleChrome/lighthouse-ci/blob/main/docs/getting-started.md
- Next.js Lighthouse guide  
  https://nextjs.org/learn/seo/lighthouse

---

## 1) Install Lighthouse CI (as a dev dependency)

From your project root:

```bash
npm i -D @lhci/cli
```

(Dev dependency is best for CI reproducibility.)

---

## 2) Add routes to audit

Decide what routes you want to test, for example:
- `/`
- `/about`
- `/projects`
- `/projects/123` (pick a stable example for dynamic routes)

If you have dynamic routes, choose **one or a few stable instances** that exist in production.

---

## 3) Create `lighthouserc.js` in the project root

Create a file named `lighthouserc.js`:

```js
/** @type {import('@lhci/cli').LHCIConfig} */
module.exports = {
  ci: {
    collect: {
      // IMPORTANT: use production build for accurate results
      startServerCommand: "npm run start",
      startServerReadyPattern: "ready", // Next.js logs contain "ready" when server is up
      url: [
        "http://localhost:3000/",
        // Add your routes here:
        "http://localhost:3000/projects",
        "http://localhost:3000/projects/123",
      ],
      numberOfRuns: 3,
      settings: {
        // optional: emulate as mobile/desktop by preset
        preset: "mobile",
      },
    },
    assert: {
      // Start with "warn" so it doesn't fail your pipeline at first.
      // Later you can move to "error" and set minimum scores.
      assertions: {
        "categories:performance": ["warn", { minScore: 0.0 }],
        "categories:accessibility": ["warn", { minScore: 0.0 }],
        "categories:best-practices": ["warn", { minScore: 0.0 }],
        "categories:seo": ["warn", { minScore: 0.0 }],
      },
    },
    upload: {
      // Easiest first: upload results to temporary public storage
      target: "temporary-public-storage",
    },
  },
};
```

### Notes on `startServerReadyPattern`
- Next.js commonly prints something like “ready” when started (`next start`).
- If your logs differ, adjust the pattern (e.g. `"ready on"`).

---

## 4) Add scripts to `package.json`

Add these scripts (adjust if you already have them):

```json
{
  "scripts": {
    "build": "next build",
    "start": "next start -p 3000",
    "lhci": "lhci autorun"
  }
}
```

---

## 5) Run Lighthouse CI locally

Run:

```bash
npm run build
npm run lhci
```

You should see LHCI start your server, audit the URLs, and print a **public link** to the uploaded report (temporary storage).

---

## 6) GitHub Actions workflow (recommended with Coolify)

Create `.github/workflows/lighthouse-ci.yml`:

```yml
name: Lighthouse CI

on:
  pull_request:
  push:
    branches: [ main ]

jobs:
  lhci:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Use Node.js
        uses: actions/setup-node@v4
        with:
          node-version: "20"
          cache: "npm"

      - name: Install dependencies
        run: npm ci

      - name: Build Next.js (production)
        run: npm run build

      - name: Run Lighthouse CI
        run: npx lhci autorun
```

### Why this works well with Coolify
- Coolify can deploy from `main` after checks pass.
- You get a consistent, repeatable Lighthouse check on every PR/push.

Coolify GitHub Actions docs:
https://coolify.io/docs/applications/ci-cd/github/actions

---

## 7) (Optional) Audit both mobile and desktop

Option A: change `preset` in `lighthouserc.js` and run twice (two jobs), e.g.
- `preset: "mobile"`
- `preset: "desktop"`

Simplest approach is to create two jobs with different configs.

---

## 8) (Optional) Turn warnings into real gating later

Once you’ve seen baseline results, update `assert` to enforce minimum scores, e.g.:

```js
assert: {
  assertions: {
    "categories:performance": ["error", { minScore: 0.75 }],
    "categories:seo": ["error", { minScore: 0.85 }],
  },
},
```

Start conservative. Performance varies depending on environment.

---

## Troubleshooting

### 1) “Chrome not found”
GitHub hosted runners usually include Chrome. On a custom runner, you may need to install Chromium/Chrome.

### 2) Dynamic routes fail (404)
Use stable examples (e.g. `/projects/123`) that always exist, or seed data for tests.

### 3) App needs auth
LHCI is best for public pages. For auth pages you usually need a custom setup (cookies, headers, scripted login).

---

## Next steps (if you want)
- auto-detect changed routes in PRs and only audit those
- store results in your own LHCI server instead of temporary public storage
- add budgets for JS bundle size (complementary to Lighthouse)
