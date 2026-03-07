# Unsplash Compliance Notes

Checked on 2026-03-07.

## Official position

- Unsplash License: <https://unsplash.com/license>
- Unsplash API Guidelines: <https://help.unsplash.com/en/articles/2511245-unsplash-api-guidelines>
- Attribution FAQ: <https://help.unsplash.com/en/articles/2534409-do-i-have-to-give-credit-to-a-contributor-when-i-use-their-image>

## What applies to this repo

- The repo currently uses direct `images.unsplash.com` image URLs in source files.
- No Unsplash access key, secret, or API client integration was found in the codebase.
- Because of that, the standard Unsplash License is the relevant rule set for these stock visuals.
- Under that license, commercial use is allowed and attribution is appreciated but not mandatory.
- If the team later integrates the Unsplash API, the API guideline requirements must be reviewed separately.

## Operational rule

1. Keep Unsplash images only if they come from `unsplash.com` / `images.unsplash.com`.
2. Record each new Unsplash photo ID in `docs/compliance/unsplash-usage.json`.
3. Run `npx tsx --test src/lib/unsplash-usage-audit.test.ts`.
4. If a non-Unsplash stock source is added, do not publish it before its license is documented.
