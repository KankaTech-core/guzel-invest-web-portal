# Admin Overlay Widget — Quick Actions & Feedback Layer Guide

How this project implements a floating admin overlay on the public-facing site that is only visible to authenticated admin users. It provides quick navigation shortcuts and a page-level feedback/annotation system. Functional reference for replicating in new projects.

---

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Session Gating (Server-Side)](#session-gating-server-side)
3. [Component Hierarchy](#component-hierarchy)
4. [AdminOverlayControls (Wrapper)](#adminoverlaycontrols-wrapper)
5. [AdminQuickActions (Bottom-Left FAB)](#adminquickactions-bottom-left-fab)
6. [Quick Action Route Parser & Definitions](#quick-action-route-parser--definitions)
7. [AdminFeedbackLayer (Top-Right Controls & Panel)](#adminfeedbacklayer-top-right-controls--panel)
8. [Feedback API Routes](#feedback-api-routes)
9. [Prisma Schema (Feedback Models)](#prisma-schema-feedback-models)
10. [Z-Index & Positioning Map](#z-index--positioning-map)
11. [Files Reference](#files-reference)
12. [Replication Checklist (New Project)](#replication-checklist-new-project)

---

## Architecture Overview

| Concern                | Implementation                                                  |
| ---------------------- | --------------------------------------------------------------- |
| Visibility gate        | Server-side `getSession()` in public layout — admin-only render |
| Quick actions (left)   | Floating FAB with context-aware links to admin pages            |
| Feedback system (right)| Page-anchored annotation pins + threaded message panel          |
| Auth dependency        | Reuses JWT auth from admin panel (`src/lib/auth.ts`)            |
| Database               | `SiteFeedbackThread` + `SiteFeedbackMessage` (Prisma)           |
| Responsive             | Hidden on mobile (`hidden md:flex`) — desktop only              |

---

## Session Gating (Server-Side)

**File:** `src/app/(localized)/[locale]/layout.tsx`

The widget is conditionally rendered in the public site's root layout. The session check happens server-side, so unauthenticated users never receive the widget markup:

```typescript
import { getSession } from "@/lib/auth";
import { Role } from "@/generated/prisma";
import { AdminOverlayControls } from "@/components/public/admin-overlay-controls";

export default async function LocaleLayout({ children, params }: Props) {
    const { locale } = await params;
    const messages = await getMessages();

    const session = await getSession();
    const isAdminUser = session?.role === Role.ADMIN;

    return (
        <html lang={locale}>
            <body>
                <NextIntlClientProvider messages={messages}>
                    <div className="flex flex-col min-h-screen">
                        <NavbarHydrated locale={locale} />
                        <main className="flex-1">{children}</main>
                        <Footer locale={locale} />
                        <FloatingSocialButtons />
                        <CookieConsent />
                        {isAdminUser ? <AdminOverlayControls /> : null}
                    </div>
                </NextIntlClientProvider>
            </body>
        </html>
    );
}
```

**Key points:**
- `getSession()` reads the `auth-token` JWT cookie and verifies it against the database
- Only `Role.ADMIN` users see the overlay — `EDITOR` and `VIEWER` do not
- The widget renders inside the main content flow, after all other page elements
- Since this is a server component check, the HTML for the widget is never sent to non-admin browsers

---

## Component Hierarchy

```
LocaleLayout (server component)
  └── getSession() check → isAdminUser
        └── AdminOverlayControls ("use client")
              ├── AdminQuickActions       ← bottom-left FAB + expandable menu
              └── AdminFeedbackLayer      ← top-right controls + annotation pins + panel
```

---

## AdminOverlayControls (Wrapper)

**File:** `src/components/public/admin-overlay-controls.tsx`

A thin client wrapper that manages a "hide until refresh" toggle. When the admin dismisses the panel, both sub-widgets disappear for the current page session (state resets on navigation/refresh):

```typescript
"use client";

import { useState } from "react";
import { AdminQuickActions } from "@/components/public/admin-quick-actions";
import { AdminFeedbackLayer } from "@/components/public/admin-feedback-layer";

export function AdminOverlayControls() {
    const [isHiddenUntilRefresh, setIsHiddenUntilRefresh] = useState(false);

    if (isHiddenUntilRefresh) {
        return null;
    }

    return (
        <>
            <AdminQuickActions onHideAll={() => setIsHiddenUntilRefresh(true)} />
            <AdminFeedbackLayer />
        </>
    );
}
```

- `isHiddenUntilRefresh` is React state — resets on full page reload or navigation
- The "Paneli Gizle" (Hide Panel) button in `AdminQuickActions` triggers `onHideAll`

---

## AdminQuickActions (Bottom-Left FAB)

**File:** `src/components/public/admin-quick-actions.tsx`

An orange floating action button (FAB) in the bottom-left corner. Clicking it expands a vertical menu of context-aware admin links.

### Visual Design

- **FAB:** 56px orange circle with `+` icon (toggles to `X` when open)
- **Menu items:** Pill-shaped links that expand upward with staggered animation
- **Hide button:** Red pill with `EyeOff` icon — dismisses all admin UI
- **Shadow:** `box-shadow: 0 20px 34px rgba(236,104,3,0.35)` for depth

### Positioning

```css
position: fixed;
bottom: 1.5rem;    /* bottom-6 */
left: 1.5rem;      /* left-6 */
z-index: 70;
display: none;      /* hidden on mobile */
```

Visible only on `md:` breakpoint and above (`hidden md:flex`).

### Context-Aware Links

The menu dynamically adds edit shortcuts based on the current page:

| Current Page               | Extra Action Added      | Link Target                    |
| -------------------------- | ----------------------- | ------------------------------ |
| Listing detail (`/ilan/*`) | "Go to Listing" edit    | `/admin/ilanlar/{id}`          |
| Article detail (`/blog/*`) | "Go to Article" edit    | `/admin/makaleler/{id}`        |
| Project detail (`/proje/*`)| "Go to Project" edit    | `/admin/projeler/{id}`         |
| Any page                   | Portal, Listings, etc.  | Always shown                   |

### Resource ID Resolution

When on a detail page, the component fetches the database ID from the slug via public API endpoints:

```typescript
// Example: resolve listing slug → ID
useEffect(() => {
    if (!listingSlug) {
        setListingId(null);
        return;
    }

    const controller = new AbortController();
    let isActive = true;

    const loadListingId = async () => {
        setIsListingLoading(true);
        try {
            const response = await fetch(
                `/api/public/listings/${encodeURIComponent(listingSlug)}?locale=${encodeURIComponent(locale)}`,
                { cache: "no-store", signal: controller.signal }
            );
            if (!response.ok) {
                if (isActive) setListingId(null);
                return;
            }
            const data = await response.json();
            if (isActive) {
                setListingId(typeof data.listing?.id === "string" ? data.listing.id : null);
            }
        } catch {
            if (isActive && !controller.signal.aborted) setListingId(null);
        } finally {
            if (isActive) setIsListingLoading(false);
        }
    };

    void loadListingId();
    return () => { isActive = false; controller.abort(); };
}, [listingSlug, locale]);
```

**Patterns used:**
- `AbortController` for cleanup on unmount/re-render
- `isActive` flag to prevent state updates after unmount
- Loading state shown as disabled pill while resolving

### Default Actions (Always Shown)

```typescript
const actions = [
    { id: "listings", label: "Go to Listings",  href: "/admin/ilanlar" },
    { id: "projects", label: "Go to Projects",  href: "/admin/projeler" },
    { id: "articles", label: "Go to Articles",  href: "/admin/makaleler" },
    { id: "portal",   label: "Go to Portal",    href: "/admin" },
];
```

### Keyboard Support

- **Escape** closes the expanded menu
- Menu auto-closes on route change (`pathname` dependency)

### Staggered Animation

Each menu item has an incremental `transition-delay` for a cascading reveal:

```typescript
const transitionStyle = { transitionDelay: `${index * 45}ms` };
```

Combined with opacity and translate-y transitions for smooth expand/collapse.

---

## Quick Action Route Parser & Definitions

**File:** `src/lib/admin-quick-actions.ts`

Pure logic extracted from the UI component for testability.

### `parseAdminQuickActionRoute(pathname)`

Parses the current URL to detect which resource type the user is viewing:

```typescript
interface AdminQuickActionRouteContext {
    locale: string;
    listingSlug: string | null;
    articleSlug: string | null;
    projectSlug: string | null;
    isListingPage: boolean;
    isArticlePage: boolean;
    isProjectPage: boolean;
}

const parseAdminQuickActionRoute = (pathname: string): AdminQuickActionRouteContext => {
    const pathSegments = pathname.split("/").filter(Boolean);
    const locale = pathSegments[0] ?? "tr";

    // Pattern: /{locale}/ilan/{slug}
    const listingSlug = pathSegments[1] === "ilan" && pathSegments[2]
        ? decodeURIComponent(pathSegments[2]) : null;

    // Pattern: /{locale}/blog/{slug}
    const articleSlug = pathSegments[1] === "blog" && pathSegments[2]
        ? decodeURIComponent(pathSegments[2]) : null;

    // Pattern: /{locale}/proje/{slug}
    const projectSlug = pathSegments[1] === "proje" && pathSegments[2]
        ? decodeURIComponent(pathSegments[2]) : null;

    return {
        locale, listingSlug, articleSlug, projectSlug,
        isListingPage: Boolean(listingSlug),
        isArticlePage: Boolean(articleSlug),
        isProjectPage: Boolean(projectSlug),
    };
};
```

### `buildAdminQuickActionDefinitions(input)`

Returns the ordered list of admin shortcuts based on the current page context. Detail-page shortcuts are `unshift`ed to the front:

```typescript
const buildAdminQuickActionDefinitions = (input): AdminQuickActionDefinition[] => {
    const actions = [
        { id: "listings", label: "Go to Listings", href: "/admin/ilanlar" },
        { id: "projects", label: "Go to Projects", href: "/admin/projeler" },
        { id: "articles", label: "Go to Articles", href: "/admin/makaleler" },
        { id: "portal",   label: "Go to Portal",   href: "/admin" },
    ];

    if (input.isListingPage) {
        actions.unshift({
            id: "listing",
            label: "Go to Listing",
            href: input.listingId ? `/admin/ilanlar/${input.listingId}` : "#",
            disabled: !input.listingId || input.isListingLoading,
        });
    }

    // Similar for articles and projects...
    return actions;
};
```

**To adapt for a new project:** Update the route patterns in `parseAdminQuickActionRoute` (the `pathSegments[1]` checks) and the admin href paths in `buildAdminQuickActionDefinitions`.

---

## AdminFeedbackLayer (Top-Right Controls & Panel)

**File:** `src/components/public/admin-feedback-layer.tsx`

A page-level annotation system that lets admins pin feedback to specific locations on any public page.

### Components

| Element            | Position           | Z-Index | Purpose                              |
| ------------------ | ------------------ | ------- | ------------------------------------ |
| Control buttons    | Top-right          | 91      | Toggle pins, create mode, open panel |
| Annotation pins    | Anchored on page   | 88      | Visual markers at feedback locations |
| Feedback panel     | Bottom-right       | 90      | Thread list + message composer       |

### Top-Right Controls (3 Buttons)

```
[Eye/EyeOff]  [Pin]  [MessageSquare/X]
```

1. **Eye toggle** — Show/hide all annotation pins on the page
2. **Pin button** — Enter "create mode" (cursor becomes crosshair, click anywhere to place a pin)
3. **Message button** — Open/close the feedback panel

### How Pin Placement Works

1. Admin clicks the Pin button → `isCreateMode = true`
2. Cursor changes to crosshair via `document.body.style.cursor = "crosshair"`
3. Admin clicks anywhere on the page
4. Click coordinates are converted to normalized anchors (0–1 range relative to page dimensions):

```typescript
const anchorX = Math.min(1, Math.max(0, (event.clientX + state.scrollX) / state.pageWidth));
const anchorY = Math.min(1, Math.max(0, (event.clientY + state.scrollY) / state.pageHeight));
```

5. A pending anchor is stored and the panel opens with a text input
6. Admin writes a message and clicks "Create" → API call creates the thread

### Viewport Tracking

Pins are stored as normalized coordinates (0–1) relative to the full page dimensions. The component continuously tracks viewport state to position pins correctly:

```typescript
const readViewportState = (): ViewportState => ({
    pageWidth: Math.max(doc.scrollWidth, doc.offsetWidth, body.scrollWidth, body.offsetWidth, 1),
    pageHeight: Math.max(doc.scrollHeight, doc.offsetHeight, body.scrollHeight, body.offsetHeight, 1),
    scrollX: window.scrollX,
    scrollY: window.scrollY,
    viewportWidth: window.innerWidth,
    viewportHeight: window.innerHeight,
});

const toScreenPosition = (anchorX, anchorY, viewportState) => ({
    left: anchorX * viewportState.pageWidth - viewportState.scrollX,
    top: anchorY * viewportState.pageHeight - viewportState.scrollY,
});
```

Updates on: scroll, resize, and a 1.2s interval fallback (for dynamic content changes).

### Path Normalization

Feedback threads are scoped to a normalized page path. Detail pages with different slugs are aggregated under a template path:

```typescript
const normalizePath = (value: string) => {
    const segments = normalized.split("/").filter(Boolean);
    // Example: /tr/ilan/some-slug → /tr/ilan/[slug]
    if (segments.length >= 3 && segments[1] === "ilan") {
        return `/${segments[0]}/ilan/[slug]`;
    }
    return normalized;
};
```

This means feedback for all listing detail pages is shared, rather than per-listing.

### Feedback Panel Features

- **List view:** Shows all active threads for the current page, ordered by last update
- **Thread view:** Shows all messages in a thread + reply input
- **"Completed" button:** Marks a thread as hidden (soft-delete via `hidden: true`)
- **Auto-refresh:** Polls every 10 seconds for new messages (`THREAD_REFRESH_INTERVAL_MS`)
- **Character limit:** 1500 characters per message (`MESSAGE_MAX_LENGTH`)

### Pin Visual Design

Pins use a rotated rounded square to create a map-pin shape:

```typescript
const PinGlyph = () => (
    <span className="relative inline-block h-3 w-3">
        <span className="absolute inset-0 rotate-45 rounded-[50%_50%_50%_0] bg-current" />
    </span>
);
```

Thread pins display the message count and highlight orange when selected.

### Keyboard Support

- **Escape** exits create mode or cancels pending anchor placement

---

## Feedback API Routes

All feedback endpoints require `ADMIN` role.

### `GET /api/admin/feedback/threads?path={pagePath}`

Returns all non-hidden threads for a given page path.

```typescript
const threads = await prisma.siteFeedbackThread.findMany({
    where: { pagePath, hidden: false },
    include: {
        createdBy: { select: { id: true, name: true, role: true } },
        messages: {
            orderBy: { createdAt: "asc" },
            include: { author: { select: { id: true, name: true, role: true } } },
        },
    },
    orderBy: { updatedAt: "desc" },
});
```

### `POST /api/admin/feedback/threads`

Creates a new feedback thread with an initial message.

```typescript
// Body:
{
    pagePath: string,    // normalized path, must start with "/"
    anchorX: number,     // 0–1 horizontal position
    anchorY: number,     // 0–1 vertical position
    message: string      // 1–1500 chars
}
```

Validated with Zod. Creates the thread and first message in a single Prisma create with nested write.

### `POST /api/admin/feedback/threads/{id}/messages`

Adds a reply to an existing thread.

```typescript
// Body:
{ content: string }    // 1–1500 chars
```

Uses a Prisma `$transaction` to create the message and bump `updatedAt` on the thread atomically.

### `PATCH /api/admin/feedback/threads/{id}`

Marks a thread as completed (soft-hidden).

```typescript
// Body:
{ completed: boolean }

// Effect:
{ hidden: completed, hiddenAt: completed ? new Date() : null }
```

### Auth Pattern (All Routes)

```typescript
const ensureAdminSession = async () => {
    const session = await getSession();
    if (!session) return { session: null, error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) };
    if (session.role !== Role.ADMIN) return { session: null, error: NextResponse.json({ error: "Forbidden" }, { status: 403 }) };
    return { session, error: null };
};
```

---

## Prisma Schema (Feedback Models)

Add these models to your `schema.prisma` (requires the `User` model from the admin panel):

```prisma
model SiteFeedbackThread {
  id          String                @id @default(cuid())
  pagePath    String
  anchorX     Float
  anchorY     Float
  hidden      Boolean               @default(false)
  hiddenAt    DateTime?
  createdById String
  createdAt   DateTime              @default(now())
  updatedAt   DateTime              @updatedAt
  messages    SiteFeedbackMessage[]
  createdBy   User                  @relation("SiteFeedbackThreadCreatedBy", fields: [createdById], references: [id], onDelete: Cascade)

  @@index([pagePath, hidden])
  @@index([updatedAt])
  @@map("site_feedback_threads")
}

model SiteFeedbackMessage {
  id        String             @id @default(cuid())
  threadId  String
  authorId  String
  content   String
  createdAt DateTime           @default(now())
  updatedAt DateTime           @updatedAt
  author    User               @relation("SiteFeedbackMessageAuthor", fields: [authorId], references: [id], onDelete: Cascade)
  thread    SiteFeedbackThread @relation(fields: [threadId], references: [id], onDelete: Cascade)

  @@index([threadId, createdAt])
  @@map("site_feedback_messages")
}
```

Add the reverse relations to your `User` model:

```prisma
model User {
  // ... existing fields ...
  feedbackMessages SiteFeedbackMessage[] @relation("SiteFeedbackMessageAuthor")
  feedbackThreads  SiteFeedbackThread[]  @relation("SiteFeedbackThreadCreatedBy")
}
```

---

## Z-Index & Positioning Map

```
┌─────────────────────────────────────────────────┐
│                                    z:91         │
│                            [Eye] [Pin] [Msg]    │  ← top-right controls
│                                                 │
│         z:88                                    │
│         📌 pin                  z:88            │
│                                 📌 pin          │  ← annotation pins (scattered)
│                                                 │
│                        ┌────────────────────┐   │
│                        │  Feedback Panel    │   │
│                        │  z:90              │   │  ← bottom-right panel
│                        │  Thread list       │   │
│                        │  Messages          │   │
│                        │  Reply input       │   │
│                        └────────────────────┘   │
│  z:70                                           │
│  ┌──────────────┐                               │
│  │ Edit Listing │                               │
│  │ Listings     │                               │  ← bottom-left menu (expanded)
│  │ Projects     │                               │
│  │ Articles     │                               │
│  │ Portal       │                               │
│  │ Hide Panel   │                               │
│  └──────────────┘                               │
│  (●) FAB  z:70                                  │  ← bottom-left FAB
└─────────────────────────────────────────────────┘
```

---

## Files Reference

### Components

| File | Purpose |
| ---- | ------- |
| `src/components/public/admin-overlay-controls.tsx` | Wrapper — composes quick actions + feedback, manages hide toggle |
| `src/components/public/admin-quick-actions.tsx` | Bottom-left FAB with context-aware admin links |
| `src/components/public/admin-feedback-layer.tsx` | Annotation pins, feedback panel, create mode |

### Logic

| File | Purpose |
| ---- | ------- |
| `src/lib/admin-quick-actions.ts` | Route parsing + action definitions (pure functions) |

### API Routes

| File | Purpose |
| ---- | ------- |
| `src/app/api/admin/feedback/threads/route.ts` | `GET` (list), `POST` (create thread) — admin only |
| `src/app/api/admin/feedback/threads/[id]/route.ts` | `PATCH` (complete/hide thread) — admin only |
| `src/app/api/admin/feedback/threads/[id]/messages/route.ts` | `POST` (reply to thread) — admin only |

### Integration

| File | Purpose |
| ---- | ------- |
| `src/app/(localized)/[locale]/layout.tsx` | Session check + conditional render in public layout |

---

## Replication Checklist (New Project)

### Prerequisites

- JWT auth system with `getSession()` and `Role` enum (see `ADMIN_PANEL_GUIDE.md`)
- Prisma + PostgreSQL setup (see `DATABASE_SETUP_GUIDE.md`)
- `zod` for API validation

### 1. Add Prisma Models

Add `SiteFeedbackThread` and `SiteFeedbackMessage` to your `schema.prisma` (see [Prisma Schema section](#prisma-schema-feedback-models)). Add the reverse relations to your `User` model. Run migration:

```bash
npx prisma migrate dev --name add_feedback_models
```

### 2. Copy Files

```
src/components/public/admin-overlay-controls.tsx   → copy as-is
src/components/public/admin-quick-actions.tsx       → update route patterns and action labels
src/components/public/admin-feedback-layer.tsx      → copy as-is (update UI text if needed)
src/lib/admin-quick-actions.ts                     → update parseAdminQuickActionRoute patterns
                                                      and buildAdminQuickActionDefinitions hrefs
src/app/api/admin/feedback/threads/route.ts         → copy as-is
src/app/api/admin/feedback/threads/[id]/route.ts    → copy as-is
src/app/api/admin/feedback/threads/[id]/messages/route.ts → copy as-is
```

### 3. Install Icon Dependencies

The widget uses icons from `lucide-react`:

```bash
npm install lucide-react
```

Icons used: `Plus`, `X`, `EyeOff`, `PencilLine`, `FileText`, `Building2`, `BookOpenText`, `ExternalLink`, `MessageSquare`, `Eye`, `Send`, `Loader2`, `RefreshCcw`, `CheckCircle2`

### 4. Integrate in Public Layout

In your public-facing root layout (server component):

```typescript
import { getSession } from "@/lib/auth";
import { Role } from "@/generated/prisma";
import { AdminOverlayControls } from "@/components/public/admin-overlay-controls";

export default async function RootLayout({ children }) {
    const session = await getSession();
    const isAdminUser = session?.role === Role.ADMIN;

    return (
        <html>
            <body>
                {/* ... your page content ... */}
                {isAdminUser ? <AdminOverlayControls /> : null}
            </body>
        </html>
    );
}
```

### 5. Adapt Quick Actions

In `src/lib/admin-quick-actions.ts`, update:

1. **Route patterns** — change `"ilan"`, `"blog"`, `"proje"` to match your public URL slugs
2. **Admin hrefs** — change `/admin/ilanlar`, `/admin/makaleler`, `/admin/projeler` to your admin routes
3. **Action labels** — translate or update the labels to match your project

In `src/components/public/admin-quick-actions.tsx`, update:

1. **API endpoints** — change `/api/public/listings/`, `/api/public/articles/`, `/api/public/projects/` to your public detail API routes
2. **Icon map** — update `ACTION_ICON_MAP` if you change action IDs

### 6. Adapt Feedback Path Normalization

In `admin-feedback-layer.tsx`, update `normalizePath()` to aggregate your detail page patterns:

```typescript
// Change this to match your URL structure:
if (segments.length >= 3 && segments[1] === "ilan") {
    return `/${segments[0]}/ilan/[slug]`;
}
// Add similar rules for other detail page types
```

### 7. Skip Feedback Layer (Optional)

If you only need the quick actions FAB without the feedback system, simplify `AdminOverlayControls`:

```typescript
export function AdminOverlayControls() {
    const [isHiddenUntilRefresh, setIsHiddenUntilRefresh] = useState(false);

    if (isHiddenUntilRefresh) return null;

    return <AdminQuickActions onHideAll={() => setIsHiddenUntilRefresh(true)} />;
}
```

No database models or API routes needed in this case.

### 8. Verify

1. Log in as an admin user on the public site
2. Verify the orange FAB appears in the bottom-left corner
3. Click it — context-aware links should appear
4. Navigate to a detail page — an extra "edit this resource" link should appear
5. Test the feedback pin system (if included)
6. Open an incognito window — verify the widget is not visible to anonymous users
