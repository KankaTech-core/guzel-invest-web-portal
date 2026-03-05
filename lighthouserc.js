/** @type {import('@lhci/cli').LHCIConfig} */
const locale = process.env.LHCI_LOCALE || "tr";
const listingSlug =
  process.env.LHCI_LISTING_SLUG || "apartment-river-panorama-21-alanya-ml4r3xur";
const projectSlug =
  process.env.LHCI_PROJECT_SLUG || "yeni-proje-taslak-antalya-proje";

module.exports = {
  ci: {
    collect: {
      startServerCommand: "npm run start -- --port 3000",
      startServerReadyPattern: "Ready in",
      url: [
        `http://localhost:3000/${locale}`,
        `http://localhost:3000/${locale}/hakkimizda`,
        `http://localhost:3000/${locale}/projeler`,
        `http://localhost:3000/${locale}/portfoy`,
        `http://localhost:3000/${locale}/ilan/${listingSlug}`,
        `http://localhost:3000/${locale}/proje/${projectSlug}`,
        `http://localhost:3000/${locale}/iletisim`,
      ],
      numberOfRuns: 3,
      settings: {
        chromeFlags: "--no-sandbox --disable-dev-shm-usage",
      },
    },
    assert: {
      assertions: {
        "categories:performance": ["warn", { minScore: 0 }],
        "categories:accessibility": ["warn", { minScore: 0 }],
        "categories:best-practices": ["warn", { minScore: 0 }],
        "categories:seo": ["warn", { minScore: 0 }],
      },
    },
    upload: {
      target: "temporary-public-storage",
    },
  },
};
