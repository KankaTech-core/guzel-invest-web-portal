# Admin Panel — Authentication, Layout & Sidebar Guide

How this project implements JWT-based login, route protection, sidebar navigation, role-based access, and user management. Functional reference for replicating in new projects.

---

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Authentication (JWT + Cookies)](#authentication-jwt--cookies)
3. [Login Flow](#login-flow)
4. [Session Verification & Route Protection](#session-verification--route-protection)
5. [Logout Flow](#logout-flow)
6. [Admin Layout Structure](#admin-layout-structure)
7. [Sidebar — Navigation & Collapse](#sidebar--navigation--collapse)
8. [Sidebar Context (State Management)](#sidebar-context-state-management)
9. [Content Wrapper (Main Area)](#content-wrapper-main-area)
10. [Role-Based Access Control](#role-based-access-control)
11. [User Management](#user-management)
12. [Admin User Creation Script](#admin-user-creation-script)
13. [Files Reference](#files-reference)
14. [Replication Checklist (New Project)](#replication-checklist-new-project)

---

## Architecture Overview

| Concern             | Implementation                                      |
| ------------------- | --------------------------------------------------- |
| Auth tokens         | JWT (HS256) via `jose` library                      |
| Token storage       | HTTP-only cookie (`auth-token`)                     |
| Password hashing    | `bcryptjs`, 10 salt rounds                          |
| Route protection    | Per-page server-side `getSession()` + `redirect()`  |
| Middleware           | None — protection is at the component/API level     |
| Roles               | `ADMIN`, `EDITOR`, `VIEWER` (Prisma enum)           |
| Sidebar state       | React Context + `localStorage`                      |
| User fetching       | Client-side `fetch("/api/auth/me")` in sidebar      |

---

## Authentication (JWT + Cookies)

**File:** `src/lib/auth.ts`

### Environment Variables

```env
JWT_SECRET=your-super-secret-jwt-key-change-in-production-min-32-chars
JWT_EXPIRES_IN=7d
```

### JWT Payload

```typescript
interface JWTPayload {
    userId: string;
    email: string;
    role: Role;   // ADMIN | EDITOR | VIEWER
    exp?: number;
    iat?: number;
}
```

### Core Functions

**`createToken(payload)`** — Signs a JWT with HS256 using `jose`:

```typescript
import { SignJWT, jwtVerify } from "jose";

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || "default-secret-change-in-production");
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";

async function createToken(payload: Omit<JWTPayload, "exp" | "iat">): Promise<string> {
    return new SignJWT(payload as unknown as Record<string, unknown>)
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt()
        .setExpirationTime(JWT_EXPIRES_IN)
        .sign(JWT_SECRET);
}
```

**`verifyToken(token)`** — Decodes and verifies. Returns `null` on any failure:

```typescript
async function verifyToken(token: string): Promise<JWTPayload | null> {
    try {
        const { payload } = await jwtVerify(token, JWT_SECRET);
        return payload as unknown as JWTPayload;
    } catch {
        return null;
    }
}
```

**`getSession()`** — Reads the cookie, verifies the token, and cross-checks the user still exists in the database:

```typescript
async function getSession(): Promise<JWTPayload | null> {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth-token")?.value;
    if (!token) return null;

    const payload = await verifyToken(token);
    if (!payload?.userId) return null;

    // Cross-check: ensures deleted users can't use old tokens
    const user = await prisma.user.findUnique({
        where: { id: payload.userId },
        select: { id: true, email: true, role: true },
    });
    if (!user) return null;

    return { ...payload, userId: user.id, email: user.email, role: user.role };
}
```

**`getCurrentUser()`** — Wrapper that returns user info including `name` (used by sidebar):

```typescript
async function getCurrentUser() {
    const session = await getSession();
    if (!session) return null;

    return prisma.user.findUnique({
        where: { id: session.userId },
        select: { id: true, email: true, name: true, role: true },
    });
}
```

### Cookie Configuration

**`setAuthCookie(token)`** and **`removeAuthCookie()`**:

```typescript
async function setAuthCookie(token: string) {
    const cookieStore = await cookies();
    cookieStore.set("auth-token", token, {
        httpOnly: true,                                    // not accessible via JS
        secure: process.env.NODE_ENV === "production",     // HTTPS only in prod
        sameSite: "lax",                                   // CSRF protection
        maxAge: 60 * 60 * 24 * 7,                         // 7 days
        path: "/",
    });
}

async function removeAuthCookie() {
    const cookieStore = await cookies();
    cookieStore.delete("auth-token");
}
```

### Role Hierarchy

```typescript
function hasPermission(userRole: Role, requiredRole: Role): boolean {
    const roleHierarchy: Record<Role, number> = {
        VIEWER: 1,
        EDITOR: 2,
        ADMIN: 3,
    };
    return roleHierarchy[userRole] >= roleHierarchy[requiredRole];
}
```

---

## Login Flow

### Login Page (`src/app/(non-localized)/admin/login/page.tsx`)

Client component. On form submit:

```typescript
const res = await fetch("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
});

if (!res.ok) {
    // Show error from response
}

router.push("/admin");
router.refresh();  // Forces server components to re-evaluate (picks up new cookie)
```

Manages three states: `email`, `password`, `error`, `loading`.

### Login API Route (`src/app/api/auth/login/route.ts`)

```
POST /api/auth/login
Body: { email, password }
```

Steps:
1. Validate email and password are present
2. Normalize email to lowercase
3. Find user by email in database
4. Compare password against stored bcrypt hash (`bcrypt.compare()`)
5. On success: create JWT token, set HTTP-only cookie, return user object
6. On failure: return 401 with generic message (doesn't reveal if email exists)

```typescript
// Generic error — intentionally doesn't say which field is wrong
{ error: "E-posta veya şifre hatalı" }  // "Email or password is incorrect"
```

---

## Session Verification & Route Protection

**There is no `middleware.ts`.** Route protection happens per-page in server components:

```typescript
// At the top of any protected admin page:
const session = await getSession();
if (!session) {
    redirect("/admin/login");
}
```

**For admin-only pages** (e.g., user management):

```typescript
const session = await getSession();
if (!session) redirect("/admin/login");
if (session.role !== Role.ADMIN) redirect("/admin");
```

**For API routes**, a helper pattern:

```typescript
async function ensureAdminSession() {
    const session = await getSession();
    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (session.role !== Role.ADMIN) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    return null;  // null = authorized, proceed
}

// Usage in route handler:
export async function GET() {
    const authError = await ensureAdminSession();
    if (authError) return authError;
    // ... handle request
}
```

### Why No Middleware?

- Simpler to reason about per-route
- Easier to debug
- All admin pages are server components, so `getSession()` + `redirect()` works seamlessly
- No need for matcher patterns or complex middleware logic

---

## Logout Flow

### Logout API Route (`src/app/api/auth/logout/route.ts`)

Supports both `POST` and `GET`:

```typescript
export async function POST(request: Request) {
    await removeAuthCookie();
    return NextResponse.redirect(buildLoginRedirectUrl(request));
}

export async function GET(request: Request) {
    await removeAuthCookie();
    return NextResponse.redirect(buildLoginRedirectUrl(request));
}
```

**Redirect URL resolution** — handles proxied environments (Vercel, reverse proxy):
1. Checks `x-forwarded-host` + `x-forwarded-proto` headers
2. Falls back to `APP_URL` or `NEXT_PUBLIC_APP_URL` env var
3. Falls back to request URL origin
4. In production, filters out localhost origins
5. Default: `http://localhost:3000`

### Sidebar Logout Button

Logout is triggered via a native HTML form (no JS required for the action):

```html
<form action="/api/auth/logout" method="POST">
    <button type="submit">Logout</button>
</form>
```

---

## Admin Layout Structure

**File:** `src/app/(non-localized)/admin/layout.tsx`

```
SidebarProvider              ← React Context for collapse state
  └── div (flex)
        ├── Sidebar          ← Fixed left navigation
        └── AdminContentWrapper
              └── {children}  ← Page content
```

```typescript
export default async function AdminLayout({ children }: { children: React.ReactNode }) {
    return (
        <SidebarProvider>
            <div className="min-h-screen flex">
                <Sidebar />
                <AdminContentWrapper>
                    {children}
                </AdminContentWrapper>
            </div>
        </SidebarProvider>
    );
}
```

---

## Sidebar — Navigation & Collapse

**File:** `src/components/admin/sidebar.tsx`

### Navigation Items

Defined as a static array. Each item has: `name`, `href`, `icon` (Lucide component), and optional `external` flag:

```typescript
const navigation = [
    { name: "Dashboard",    href: "/admin",             icon: LayoutDashboard },
    { name: "Ana Sayfa",    href: "/admin/ana-sayfa",   icon: House },
    { name: "İlanlar",      href: "/admin/ilanlar",     icon: FileText },
    { name: "Projeler",     href: "/admin/projeler",    icon: Building2 },
    { name: "Formlar",      href: "/admin/formlar",     icon: MessagesSquare },
    { name: "Referanslar",  href: "/admin/referanslar", icon: Quote },
    { name: "Export",       href: "/admin/export",      icon: Download },
    { name: "Makaleler",    href: "/admin/makaleler",   icon: Newspaper },
    { name: "Kullanıcılar", href: "/admin/kullanicilar",icon: Users },
    { name: "Ana Site",     href: "/",                  icon: ExternalLink, external: true },
];
```

### Active State Detection

```typescript
const isActive =
    !item.external &&
    (pathname === item.href ||                                    // exact match (dashboard)
        (item.href !== "/admin" && pathname.startsWith(item.href))); // prefix match (nested routes)
```

- Dashboard (`/admin`) requires exact match to avoid false positives
- Other items match any nested path (e.g., `/admin/ilanlar/123` matches "İlanlar")
- External links are never marked active

### Collapse Toggle

- Button positioned at the edge of the sidebar (`ChevronLeft` / `ChevronRight`)
- Toggles between collapsed (80px) and expanded (256px) widths
- State persisted in `localStorage` (key: `admin-sidebar-collapsed`)
- When collapsed: only icons shown, nav item names hidden, user shows as avatar initial

### User Info Section (Bottom)

Fetches current user on mount via `/api/auth/me`:

```typescript
useEffect(() => {
    const fetchCurrentUser = async () => {
        const response = await fetch("/api/auth/me", { cache: "no-store" });
        if (response.ok) {
            const data = await response.json();
            setCurrentUser(data.user ?? null);
        }
    };
    fetchCurrentUser();
}, []);
```

Displays:
- Avatar (first letter of name, uppercased)
- Full name
- Email
- Role label (localized: `ADMIN` → "Yönetici", `EDITOR` → "Editör", `VIEWER` → "Görüntüleyici")

### Hidden on Login Page

```typescript
if (pathname === "/admin/login" || pathname.startsWith("/admin/login/")) {
    return null;
}
```

### Responsive Behavior

- Sidebar: `hidden lg:block` — only visible on large screens (1024px+)
- Mobile: sidebar not shown, content takes full width

---

## Sidebar Context (State Management)

**File:** `src/lib/context/sidebar-context.tsx`

```typescript
interface SidebarContextType {
    isCollapsed: boolean;
    toggleSidebar: () => void;
}
```

**Provider:**

```typescript
function SidebarProvider({ children }: { children: React.ReactNode }) {
    const [isCollapsed, setIsCollapsed] = useState(() => {
        if (typeof window === "undefined") return false;
        const saved = localStorage.getItem("admin-sidebar-collapsed");
        return saved === "true";
    });

    const toggleSidebar = () => {
        setIsCollapsed((prev) => {
            const newState = !prev;
            localStorage.setItem("admin-sidebar-collapsed", String(newState));
            return newState;
        });
    };

    return (
        <SidebarContext.Provider value={{ isCollapsed, toggleSidebar }}>
            {children}
        </SidebarContext.Provider>
    );
}
```

**Hook:**

```typescript
function useSidebar() {
    const context = useContext(SidebarContext);
    if (context === undefined) {
        throw new Error("useSidebar must be used within a SidebarProvider");
    }
    return context;
}
```

- Initializes from `localStorage` on mount (SSR-safe: defaults to `false` on server)
- `toggleSidebar()` updates both React state and `localStorage` atomically

---

## Content Wrapper (Main Area)

**File:** `src/components/admin/admin-content-wrapper.tsx`

Adjusts left padding to match sidebar width:

```typescript
function AdminContentWrapper({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const { isCollapsed } = useSidebar();
    const isLoginPage = pathname === "/admin/login" || pathname.startsWith("/admin/login/");

    if (isLoginPage) {
        return <main className="flex-1">{children}</main>;  // No sidebar offset
    }

    return (
        <main className={cn(
            "flex-1 transition-all duration-300",
            isCollapsed ? "lg:pl-20" : "lg:pl-64"    // Match sidebar width
        )}>
            <div className="p-6">{children}</div>
        </main>
    );
}
```

- Login page: no padding (sidebar is hidden)
- Other pages: padding matches sidebar width (80px collapsed, 256px expanded)
- Transitions smoothly when sidebar toggles

---

## Role-Based Access Control

### Prisma Schema

```prisma
enum Role {
  ADMIN
  EDITOR
  VIEWER
}

model User {
  id           String   @id @default(cuid())
  email        String   @unique
  passwordHash String
  name         String
  role         Role     @default(VIEWER)
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt
}
```

### Enforcement Patterns

**Page-level (server component):**

```typescript
// Admin-only page
const session = await getSession();
if (!session) redirect("/admin/login");
if (session.role !== Role.ADMIN) redirect("/admin");
```

**API-level:**

```typescript
const ensureAdminSession = async () => {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    if (session.role !== Role.ADMIN) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    return null;
};
```

### Current Role Usage

- All authenticated users can access most admin pages
- **Admin-only:** User management (`/admin/kullanicilar` page and `/api/admin/users` endpoints)
- Sidebar does **not** conditionally render items based on role — all items shown to all roles

---

## User Management

### API Routes

**`GET /api/admin/users`** — List all users (admin only)
- Returns: `{ users: [{ id, name, email, role, createdAt }] }`
- Ordered by `createdAt` descending

**`POST /api/admin/users`** — Create user (admin only)
- Body: `{ name, email, password, role }`
- Validation: name required, valid email format, password >= 8 chars, valid role
- Email uniqueness check
- Password hashed with bcrypt (10 rounds)
- Returns: `{ user, message }` with 201 status

**`PATCH /api/admin/users/[id]`** — Update user (admin only)
- Can update: name, email, role, password (optional)
- Safeguards: prevents self-demotion, prevents demoting last admin

**`DELETE /api/admin/users/[id]`** — Delete user (admin only)
- Safeguards: prevents self-deletion, prevents deleting last admin

### `/api/auth/me` — Current User

```typescript
export async function GET() {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    return NextResponse.json({ user });
}
```

Used by the sidebar to fetch and display the logged-in user's info.

---

## Admin User Creation Script

**File:** `scripts/create-admin.ts`

```bash
# Via CLI arguments:
npx tsx scripts/create-admin.ts admin@example.com mypassword123

# Via environment variables:
INITIAL_ADMIN_EMAIL=admin@example.com INITIAL_ADMIN_PASSWORD=mypassword123 npx tsx scripts/create-admin.ts
```

Uses `prisma.user.upsert()` — creates if new, updates password if exists. Always sets role to `ADMIN`.

---

## Files Reference

### Auth

| File | Purpose |
| ---- | ------- |
| `src/lib/auth.ts` | JWT create/verify, session, cookie management, role hierarchy |
| `src/app/api/auth/login/route.ts` | `POST` — authenticate user, set cookie |
| `src/app/api/auth/logout/route.ts` | `POST`/`GET` — delete cookie, redirect to login |
| `src/app/api/auth/me/route.ts` | `GET` — return current user info |
| `scripts/create-admin.ts` | CLI script to create/reset admin user |

### Layout & Sidebar

| File | Purpose |
| ---- | ------- |
| `src/app/(non-localized)/admin/layout.tsx` | Admin root layout (wraps sidebar + content) |
| `src/components/admin/sidebar.tsx` | Navigation sidebar (nav items, user info, logout) |
| `src/components/admin/admin-content-wrapper.tsx` | Main content area with sidebar-aware padding |
| `src/lib/context/sidebar-context.tsx` | Sidebar collapse state context + localStorage sync |

### User Management

| File | Purpose |
| ---- | ------- |
| `src/app/api/admin/users/route.ts` | `GET` (list), `POST` (create) — admin only |
| `src/app/api/admin/users/[id]/route.ts` | `PATCH` (update), `DELETE` — admin only |
| `src/components/admin/users-management.tsx` | User CRUD UI component |
| `src/app/(non-localized)/admin/kullanicilar/page.tsx` | Users page (admin-only access) |

### Pages

| File | Purpose |
| ---- | ------- |
| `src/app/(non-localized)/admin/login/page.tsx` | Login form |
| `src/app/(non-localized)/admin/page.tsx` | Dashboard |

---

## Replication Checklist (New Project)

### 1. Install Dependencies

```bash
npm install jose bcryptjs
npm install -D @types/bcryptjs
```

(`@prisma/client` and `prisma` assumed from database setup.)

### 2. Prisma Schema — Add User Model

```prisma
enum Role {
  ADMIN
  EDITOR
  VIEWER
}

model User {
  id           String   @id @default(cuid())
  email        String   @unique
  passwordHash String
  name         String
  role         Role     @default(VIEWER)
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt
}
```

### 3. Copy & Adapt Files

```
src/lib/auth.ts                          → copy as-is
src/lib/context/sidebar-context.tsx      → copy as-is
src/components/admin/sidebar.tsx         → update navigation array to your routes
src/components/admin/admin-content-wrapper.tsx → copy, adjust special-case routes if needed
src/app/(non-localized)/admin/layout.tsx → copy as-is
src/app/(non-localized)/admin/login/page.tsx  → copy, update branding
src/app/api/auth/login/route.ts          → copy as-is
src/app/api/auth/logout/route.ts         → copy as-is
src/app/api/auth/me/route.ts             → copy as-is
src/app/api/admin/users/route.ts         → copy as-is
scripts/create-admin.ts                  → copy, update import path for generated prisma
```

### 4. Environment Variables

```env
JWT_SECRET=change-this-to-a-long-random-string
JWT_EXPIRES_IN=7d
```

### 5. Create First Admin User

```bash
npx tsx scripts/create-admin.ts admin@yourproject.com yourpassword
```

### 6. Add Protected Pages

For each new admin page:

```typescript
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function MyAdminPage() {
    const session = await getSession();
    if (!session) redirect("/admin/login");

    return <div>Protected content</div>;
}
```

### 7. Update Sidebar Navigation

In `sidebar.tsx`, replace the `navigation` array with your own routes:

```typescript
const navigation = [
    { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { name: "Your Page", href: "/admin/your-page", icon: SomeIcon },
    // ...
    { name: "Main Site", href: "/", icon: ExternalLink, external: true },
];
```

### 8. No Token Refresh

Current implementation has no refresh mechanism. Users re-login after 7 days. If you need longer sessions, increase `JWT_EXPIRES_IN` or implement a refresh token flow.
