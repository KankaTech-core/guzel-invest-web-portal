---
trigger: 21st-import
---

# 21st.dev Component Import Rule (Normalization)

Use this rule whenever a prompt includes 21st.dev, “copy/paste component”, or a shadcn-style import task.

## Goals
- Integrate 21st components without breaking Güzel Invest design system or performance.
- Normalize styles to the existing light theme, orange brand palette, and Outfit typography.
- Provide a safe preview before components are used in production pages.

## Non‑negotiables (Project Rules)
- **Light theme only**; remove `dark:` classes and dark backgrounds for content sections.
- **Brand color** is Tailwind `orange-*` (`orange-500` primary, `orange-600` hover).
- **No global CSS leaks**; any custom CSS must be scoped and placed under `@layer components`.
- **Use existing paths**: `src/components/ui` (not `/components/ui`).
- **Export from** `src/components/ui/index.ts` for all UI components.
- **Use `cn()`** from `src/lib/utils.ts` for class merging.

## Required Process
1. **Parse the prompt** and list:
   - Component filename(s)
   - Dependencies (npm packages, icons, assets)
   - Demo/preview requirements
2. **Normalize the component**:
   - Replace shadcn-only classes (e.g., `text-foreground`) with Tailwind classes used here.
   - Replace blue/purple accents with orange palette.
   - Remove dark mode styles or replace with light equivalents.
   - Ensure `rounded-lg` or `rounded-xl` (avoid `rounded-2xl` by default).
3. **Conflict scan** (must be explicit):
   - Global selectors (`*`, `body`, `.btn`, `.card`, `.input`, `@layer base`)
   - Custom fonts or external CSS imports
   - New libraries or heavy animations
4. **Ask for approval before implementing** if any conflicts are found. Provide:
   - What conflicts with existing rules
   - Proposed safe alternative(s)
   - Impact on performance/consistency
5. **Preview page**:
   - Add or update `src/app/[locale]/normalized-21st/page.tsx`.
   - Show the **real component** with sample data.
   - Include a short “status” note (e.g., “Normalized ✅ / Pending approval ⚠️”).
   - Keep it noindex (match `/ux-guide` metadata style).
6. **Do not change production pages** until the normalized preview is verified.

## Scoping CSS Safely
If custom CSS is required:
- Add to `src/app/globals.css` under `@layer components`.
- Prefix with a wrapper class (e.g., `.gi-21st`).

Example:
```css
@layer components {
  :where(.gi-21st) .fancy-card {
    border-radius: var(--radius-lg);
    box-shadow: var(--shadow-card);
  }
}
```

## Dependencies
- Prefer zero new dependencies.
- If needed, **ask approval** before adding packages (e.g., `class-variance-authority`).
- Use `lucide-react` for icons.

## Assets
- Prefer existing assets in `public/`.
- If external images are required, **ask approval** before hotlinking.

## Output Checklist (must mention in response)
- Component file created in `src/components/ui`
- Export added to `src/components/ui/index.ts`
- Preview added to `/normalized-21st`
- Conflicts checked and either resolved or approval requested

