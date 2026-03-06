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
  // Convert to UTC+3 without depending on system timezone.
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

function inferReferer(url, explicitReferer) {
  if (explicitReferer) return explicitReferer;
  try {
    return `${new URL(url).origin}/`;
  } catch {
    return undefined;
  }
}

async function runPageSpeed({ url, strategy, categories, locale, apiKey, referer }) {
  const endpoint = new URL("https://www.googleapis.com/pagespeedonline/v5/runPagespeed");
  endpoint.searchParams.set("url", url);
  endpoint.searchParams.set("strategy", strategy);
  endpoint.searchParams.set("locale", locale);
  for (const c of categories) endpoint.searchParams.append("category", c);
  endpoint.searchParams.set("key", apiKey);

  const headers = {};
  const resolvedReferer = inferReferer(url, referer);
  if (resolvedReferer) headers.Referer = resolvedReferer;

  const res = await fetch(endpoint.toString(), {
    headers,
  });
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

  return {
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
      INP_or_TBT:
        audits["interaction-to-next-paint"]?.displayValue ||
        audits["total-blocking-time"]?.displayValue ||
        null,
    },
    topOpportunities: Object.values(audits)
      .filter((a) => a && a.details && a.details.type === "opportunity")
      .sort((a, b) => (b?.score ?? 0) - (a?.score ?? 0))
      .slice(0, 8)
      .map((a) => ({
        id: a.id,
        title: a.title,
        score: a.score,
        displayValue: a.displayValue || null,
      })),
  };
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
  const referer = getEnv("PAGESPEED_REFERER");

  const outDir = path.join(process.cwd(), "pagespeed-reports");
  fs.mkdirSync(outDir, { recursive: true });

  const timestamp = formatIstanbulTimestamp();
  const all = [];

  for (const url of urls) {
    const result = await runPageSpeed({ url, strategy, categories, locale, apiKey, referer });
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
