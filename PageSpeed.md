# PageSpeed Automation (Next.js + Coolify) — Agent Playbook

This document defines a simple workflow where an AI agent can:

1) Read a **PageSpeed Insights API key** from `.env.local`  
2) Run PageSpeed tests for one or more **specific URLs** you provide  
3) Save the raw API response as a **timestamped JSON file**  
4) Optionally, use PageSpeed recommendations to **optimize the Next.js app**, if you ask it to

> Scope: Next.js / React projects deployed on Coolify (self-host).  
> Output: JSON reports saved under `./pagespeed-reports/`.

---

## 1) Requirements

- Node.js 18+ (or 20+ recommended)
- A Google Cloud **API key** with **PageSpeed Insights API** enabled
- Your target URLs must be **publicly accessible** (no login / no IP allowlist blocking Google)

PageSpeed endpoint (for reference):  
`https://www.googleapis.com/pagespeedonline/v5/runPagespeed`

---

## 2) Environment variable setup

Add this to your `.env.local` (do **not** commit secrets):

```env
PAGESPEED_API_KEY=YOUR_API_KEY_HERE
```

Recommended: also include default config:

```env
PAGESPEED_STRATEGY=mobile
PAGESPEED_CATEGORIES=performance,seo,accessibility,best-practices
PAGESPEED_LOCALE=en
```

### Git hygiene
Add the following to `.gitignore` (if not already):

```gitignore
.env.local
pagespeed-reports/
```

---

## 3) File output convention

The agent must save results to:

- Folder: `./pagespeed-reports/`
- Filename format:

```
pagespeed-YYYY-MM-DD_HH-mm-ss+0300.json
```

Use **Europe/Istanbul** local time (+03:00).

Example:
- `pagespeed-2026-03-06_14-25-09+0300.json`

---

## 4) Minimal command-line workflow (curl)

To run a single test:

```bash
curl -sG "https://www.googleapis.com/pagespeedonline/v5/runPagespeed" \
  --data-urlencode "url=https://dev.guzelinvestalanya.com/tr/portfoy" \
  --data-urlencode "strategy=mobile" \
  --data-urlencode "category=performance" \
  --data-urlencode "category=seo" \
  --data-urlencode "key=$PAGESPEED_API_KEY"
```

> Note: PageSpeed tests **one URL per request**.  
If you want multiple pages, you call the API multiple times.

---

## 5) Recommended Node.js script (agent-friendly)

Create `scripts/pagespeed-runner.mjs`:

```js
import fs from "node:fs";
import path from "node:path";

function getEnv(name, fallback = undefined) {
  const v = process.env[name];
  if (v === undefined || v === "") return fallback;
  return v;
}

function formatIstanbulTimestamp(d = new Date()) {
  // Istanbul is UTC+03:00 (no DST currently); we format +0300 explicitly.
  const pad = (n) => String(n).padStart(2, "0");
  // Convert to UTC+3 without depending on system timezone:
  const ms = d.getTime() + 3 * 60 * 60 * 1000;
  const t = new Date(ms);

  const yyyy = t.getUTCFullYear();
  const mm = pad(t.getUTCMonth() + 1);
  const dd = pad(t.getUTCDate());
  const HH = pad(t.getUTCHours());
  const MM = pad(t.getUTCMinutes());
  const SS = pad(t.getUTCSeconds());
  return `${yyyy}-${mm}-${dd}_${HH}-${MM}-${SS}+0300`;
}

async function runPageSpeed({ url, strategy, categories, locale, apiKey }) {
  const endpoint = new URL("https://www.googleapis.com/pagespeedonline/v5/runPagespeed");
  endpoint.searchParams.set("url", url);
  endpoint.searchParams.set("strategy", strategy);
  endpoint.searchParams.set("locale", locale);
  for (const c of categories) endpoint.searchParams.append("category", c);
  endpoint.searchParams.set("key", apiKey);

  const res = await fetch(endpoint.toString());
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`PageSpeed API failed (${res.status}): ${text.slice(0, 500)}`);
  }
  return res.json();
}

function summarize(result) {
  const lr = result?.lighthouseResult;
  const cats = lr?.categories || {};
  const audits = lr?.audits || {};

  const score = (x) => (typeof x === "number" ? Math.round(x * 100) : null);

  const summary = {
    requestedUrl: result?.id || null,
    finalUrl: lr?.finalUrl || null,
    categories: {
      performance: score(cats.performance?.score),
      accessibility: score(cats.accessibility?.score),
      bestPractices: score(cats["best-practices"]?.score),
      seo: score(cats.seo?.score),
      pwa: score(cats.pwa?.score),
    },
    coreWebVitals: {
      LCP: audits["largest-contentful-paint"]?.displayValue || null,
      CLS: audits["cumulative-layout-shift"]?.displayValue || null,
      INP_or_TBT: audits["interaction-to-next-paint"]?.displayValue
        || audits["total-blocking-time"]?.displayValue
        || null,
    },
    topOpportunities: Object.values(audits)
      .filter((a) => a && a.details && (a.details.type === "opportunity"))
      .sort((a, b) => (b?.score ?? 0) - (a?.score ?? 0))
      .slice(0, 8)
      .map((a) => ({
        id: a.id,
        title: a.title,
        score: a.score,
        displayValue: a.displayValue || null,
      })),
  };

  return summary;
}

async function main() {
  const apiKey = getEnv("PAGESPEED_API_KEY");
  if (!apiKey) {
    console.error("Missing PAGESPEED_API_KEY. Add it to .env.local or your environment.");
    process.exit(1);
  }

  // URLs can be passed via CLI:
  // node scripts/pagespeed-runner.mjs https://site/a https://site/b
  const urls = process.argv.slice(2);
  if (urls.length === 0) {
    console.error("Provide one or more URLs as arguments.");
    console.error("Example: node scripts/pagespeed-runner.mjs https://example.com/ https://example.com/about");
    process.exit(1);
  }

  const strategy = getEnv("PAGESPEED_STRATEGY", "mobile");
  const categories = (getEnv("PAGESPEED_CATEGORIES", "performance,seo") || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  const locale = getEnv("PAGESPEED_LOCALE", "en");

  const outDir = path.join(process.cwd(), "pagespeed-reports");
  fs.mkdirSync(outDir, { recursive: true });

  const timestamp = formatIstanbulTimestamp();

  const all = [];
  for (const url of urls) {
    const result = await runPageSpeed({ url, strategy, categories, locale, apiKey });
    all.push({
      url,
      fetchedAt: timestamp,
      strategy,
      categories,
      locale,
      summary: summarize(result),
      raw: result,
    });
    console.log(`OK: ${url}`);
  }

  const outFile = path.join(outDir, `pagespeed-${timestamp}.json`);
  fs.writeFileSync(outFile, JSON.stringify({ generatedAt: timestamp, reports: all }, null, 2), "utf-8");
  console.log(`Saved: ${outFile}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
```

### Install dependencies
This script uses built-in `fetch` (Node 18+). No extra dependencies required.

### Run
```bash
# Ensure env is loaded (locally)
export $(cat .env.local | xargs) 2>/dev/null || true

node scripts/pagespeed-runner.mjs \
  "https://dev.guzelinvestalanya.com/tr/portfoy" \
  "https://dev.guzelinvestalanya.com/tr/proje/the-colosseum-antalya-proje"
```

---

## 6) Agent behavior rules (important)

### A) When the user says: “Run PageSpeed for X / these pages”
The agent must:
1. Ensure `PAGESPEED_API_KEY` exists in environment (do not print it)
2. Run the script for each URL
3. Save **one JSON** file using the timestamp convention
4. Return:
   - the filename
   - the key summary (scores + CWV display values)
   - the top opportunities list (titles + ids)

### B) When the user says: “Optimize based on the report”
The agent must:
1. Read the latest `pagespeed-*.json` report
2. Identify the **highest impact opportunities** (e.g., render-blocking, unused JS, image optimization, caching)
3. Propose an optimization plan and—if authorized—apply changes to the Next.js project.

---

## 7) Optimization mapping (Next.js examples)

Below are common PageSpeed recommendations and what they usually mean in Next.js:

### Images (serve / resize / modern formats)
- Use `next/image`
- Ensure `sizes` is set for responsive images
- Prefer AVIF/WebP
- Add `priority` only for above-the-fold hero images
- Avoid huge images in sliders

### Reduce unused JS / CSS
- Prefer dynamic imports for heavy components
- Audit dependencies; remove unused libraries
- Use route-level code splitting (Next already does this, but large shared chunks can happen)

### Render-blocking resources
- Defer non-critical scripts using `next/script` with `strategy="lazyOnload"` or `afterInteractive`
- Avoid loading multiple icon/font libraries at once

### Fonts
- Use `next/font` to self-host and reduce layout shift
- Preload only what you need

### Caching / server response time
- Ensure static assets have long cache headers
- Use ISR/SSG where possible
- Profile server cold starts (Coolify containers)

---

## 8) Notes & limitations

- PSI is a **lab test**; results can fluctuate between runs.
- For dynamic pages, test a few **representative** URLs.
- If your dev site is blocked from public internet, PSI may not reach it.

---

## 9) Optional: Add a Coolify cron job

If you want daily checks, run:

```bash
node scripts/pagespeed-runner.mjs "https://yourdomain.com/" "https://yourdomain.com/some-page"
```

and store `pagespeed-reports/` as persistent storage (or upload elsewhere).

---

## 10) Quick checklist

- [ ] Enabled PageSpeed Insights API in Google Cloud
- [ ] API key stored in `.env.local` as `PAGESPEED_API_KEY`
- [ ] `scripts/pagespeed-runner.mjs` created
- [ ] Run with URLs and confirm JSON output under `pagespeed-reports/`
- [ ] (Optional) Optimize based on the saved report
