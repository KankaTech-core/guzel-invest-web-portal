# AI Agent Development Guide - Güzel Invest

This document provides guidelines and rules for AI agents working on the Güzel Invest real estate platform. Follow these conventions to maintain consistency and quality across the codebase.

---

## 🎯 Project Overview

**Güzel Invest** is an AI-powered real estate listing management and portfolio presentation platform for the Alanya region of Turkey.

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript (strict mode)
- **Styling**: TailwindCSS v4
- **Database**: PostgreSQL with Prisma ORM
- **Storage**: MinIO for media files
- **i18n**: next-intl (TR, EN, DE, AR)

---

## 🎨 Design System

### Brand Color
```
Primary: #EC6803 (Vibrant Orange)
```

Use **Tailwind's orange palette** for consistency:
- `orange-50` to `orange-900` for shades
- `orange-500` as the primary brand color
- `orange-600` for hover states

### Theme
**LIGHT THEME ONLY** - Do not use dark backgrounds for content sections.

| Element | Background | Text |
|---------|------------|------|
| Page | `bg-white` or `bg-gray-50` | `text-gray-900` |
| Cards | `bg-white` | `text-gray-700` |
| Footer | `bg-gray-50` | `text-gray-500` |
| Inputs | `bg-white` | `text-gray-900` |

### Typography
- Font: `Outfit` (sans-serif)
- Headings: `font-bold text-gray-900`
- Body: `text-gray-600` or `text-gray-700`
- Muted: `text-gray-400` or `text-gray-500`

### Spacing & Borders
- Border radius: `rounded-lg` (default), `rounded-xl` (cards)
- Shadows: `shadow-sm` (subtle), `shadow-md` (elevated)
- Border color: `border-gray-200` (default), `border-gray-100` (subtle)

---

## 📁 File Structure

```
src/
├── app/
│   ├── [locale]/           # Localized public routes
│   │   ├── page.tsx        # Homepage
│   │   ├── portfoy/        # Portfolio listing
│   │   ├── ilan/[slug]/    # Listing detail
│   │   ├── hakkimizda/     # About page
│   │   ├── iletisim/       # Contact page
│   │   └── harita/         # Map view
│   ├── admin/              # Admin panel (no locale)
│   └── api/                # API routes
├── components/
│   ├── ui/                 # Reusable UI components
│   └── public/             # Public-facing components
├── lib/                    # Utilities and configurations
└── messages/               # i18n translation files
```

---

## 🧩 Component Conventions

### UI Components (`src/components/ui/`)
- Keep components small and focused
- Use TypeScript interfaces for props
- Export from `index.ts` for easy imports
- Use `cn()` utility for conditional classes

```tsx
// ✅ Good
import { Button, Card, Badge } from "@/components/ui";

// ❌ Bad
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
```

### Public Components (`src/components/public/`)
- Accept `locale` prop when needed
- Use `useTranslations()` for text
- Follow naming: `ComponentName.tsx` (PascalCase)

---

## 🎨 Styling Rules

### DO ✅
```tsx
// Use standard Tailwind color classes
<div className="bg-orange-500 text-white" />
<p className="text-gray-600" />
<button className="hover:bg-orange-600" />

// Use utility classes from globals.css
<button className="btn btn-primary btn-md" />
<div className="card" />
<input className="input" />
```

### DON'T ❌
```tsx
// Don't use CSS variables directly in JSX
<div className="bg-[ _rgb(var(--color-primary))_ ]" />

// Don't use custom color names that don't exist
<div className="bg-primary" />  // Not configured in Tailwind

// Don't use dark backgrounds for content
<section className="bg-gray-900 text-white" />
```

---

## 🌐 Internationalization

### Translation Keys
```tsx
// Use namespaced keys
const t = useTranslations();
t("nav.home");      // Navigation
t("footer.copyright"); // Footer
t("listing.bedrooms"); // Listing details
```

### Supported Locales
- `tr` - Turkish (primary)
- `en` - English
- `de` - German
- `ar` - Arabic (RTL support)

### URL Structure
```
/tr/portfoy         # Turkish
/en/portfolio       # English
/de/portfolio       # German
/ar/محفظة           # Arabic
```

---

## 🗄️ Database (Prisma)

### Querying
```tsx
// Always include translations for public queries
const listing = await prisma.listing.findUnique({
  where: { slug },
  include: {
    translations: {
      where: { locale },
    },
    media: {
      orderBy: { order: "asc" },
    },
  },
});
```

### Enums
```prisma
enum PropertyType {
  VILLA
  APARTMENT
  HOME
  LAND
  COMMERCIAL
}

enum SaleType {
  SALE
  RENT
}

enum ListingStatus {
  DRAFT
  PUBLISHED
  ARCHIVED
}
```

---

## 🖼️ Media Handling

### Image URLs
```tsx
const imageUrl = `${process.env.NEXT_PUBLIC_MINIO_URL}/guzel-invest/${media.url}`;
```

### Image Component
```tsx
import Image from "next/image";

<Image
  src={imageUrl}
  alt={translation.title}
  fill
  className="object-cover"
/>
```

---

## 📋 API Routes

### Public API (`/api/public/`)
- No authentication required
- Use for fetching published listings
- Support `locale` query parameter

### Admin API (`/api/admin/`)
- Requires authentication
- CRUD operations for listings, media, users
- Return proper error responses

### Response Format
```tsx
// Success
return NextResponse.json({ listings, total });

// Error
return NextResponse.json(
  { error: "Not found" },
  { status: 404 }
);
```

---

## ✅ Checklist Before Committing

- [ ] All text visible (no invisible text on white backgrounds)
- [ ] Using `orange-500` for brand color, not `primary`
- [ ] No dark section backgrounds (light theme only)
- [ ] TypeScript has no errors
- [ ] Translations exist for user-facing text
- [ ] Images have proper alt text
- [ ] Mobile responsive design tested
- [ ] Loading states implemented
- [ ] Error states handled

---

## 🚫 Common Mistakes to Avoid

1. **Using CSS variables with Tailwind v4**
   - Don't use `rgb(var(--color-primary))` in class names
   - Use `orange-500` directly instead

2. **Dark mode styling**
   - This is a light-only theme
   - Never use `bg-gray-900` for content sections

3. **Missing translations**
   - Always check if translation key exists
   - Add fallback text if needed

4. **Hardcoded URLs**
   - Use environment variables for external URLs
   - Use `/${locale}/path` for internal links

5. **Ignoring TypeScript errors**
   - Fix all type errors before committing
   - Use proper interfaces for data

---

## 📞 Contact

For questions about this guide, contact the project maintainer or refer to:
- `project.md` - Project overview
- `technical_development_plan.md` - Technical specifications
- `.agent/workflows/` - Automated workflows
