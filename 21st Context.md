# 21st.dev Import Context — Güzel Invest

Use this when copying 21st.dev components into our codebase.

## Stack & Paths
- Next.js 15 (App Router), TypeScript (strict), Tailwind CSS v4
- Components live in `src/components/ui`
- Re-export UI components from `src/components/ui/index.ts`
- Use `cn()` from `src/lib/utils.ts`

## Design System (Non‑Negotiables)
- Light theme only. Remove `dark:` classes and dark backgrounds in content sections.
- Brand color: Tailwind `orange-*` (use `orange-500` primary, `orange-600` hover).
- Typography: Outfit, modern + professional.
- Prefer `rounded-lg` or `rounded-xl` and subtle shadows.
- Avoid emojis in UI. Use `lucide-react` icons.

## Normalization Rules
- Replace shadcn-only tokens (e.g., `text-foreground`) with standard Tailwind classes.
- Replace blues/purples with the orange palette.
- No CSS variables in JSX (e.g., `bg-[rgb(var(--color-id))]`).
- Avoid heavy animation libs unless required.

## CSS Safety
- Do not introduce global CSS leaks.
- If custom CSS is required, scope it in `src/app/globals.css` under `@layer components` with a wrapper class like `.gi-21st`.

## Preview First
- Add normalized components to `/normalized-21st` (localized route: `/{locale}/normalized-21st`) for review.
- Do not place on production pages until approved.

## Conflicts & Approvals
If you detect any conflicts (global selectors, new dependencies, dark theme, heavy libs), stop and ask for approval before implementing.

## Assets & Dependencies
- Prefer existing assets in `public/`.
- Ask before hotlinking external images.
- Avoid new dependencies; if needed, ask first.

