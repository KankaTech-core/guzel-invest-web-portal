# Güzel Invest — Technical Development Plan

> AI-powered real estate listing management and portfolio presentation platform for Alanya-based real estate firm.

---

## 1. Project Overview

### Business Context
Güzel Invest is a real estate company operating in Alanya since 2001. The platform aims to solve:
- **Zero digital presence** — No website, no online lead generation
- **Data fragmentation** — Listings scattered across Drive, WhatsApp, notes
- **Amateur presentation** — Sharing Drive links instead of professional portfolios
- **Trust issues** — Missing multi-language support for international investors

### Solution Scope
| Component | Purpose |
|-----------|---------|
| **Admin Panel** | Listing management, AI processing, Sahibinden sync, export |
| **Public Website** | Portfolio showcase, map view, contact forms, 4-language support |
| **AI Processing** | Automatic image tagging, text-to-fields extraction, translations |
| **External Integrations** | Sahibinden.com sync, Minio storage, Google Maps |

---

## 2. Technology Stack

### Frontend
| Technology | Version | Purpose |
|------------|---------|---------|
| Next.js | 16 | App Router, SSR, API routes |
| TypeScript | 5 | Type safety |
| TailwindCSS | 4 | Styling |
| next-intl | latest | i18n (TR, EN, DE, AR) |
| Lucide Icons | latest | Icon library |

### Backend & Database
| Technology | Version | Purpose |
|------------|---------|---------|
| Prisma ORM | 6.x | Database ORM |
| PostgreSQL | 16 | Primary database |
| jose | latest | JWT authentication |
| Next.js API Routes | — | REST endpoints |
| Server Actions | — | Form handling |

### Infrastructure
| Service | Purpose |
|---------|---------|
| Coolify | Deployment & orchestration |
| Minio | S3-compatible object storage |
| OpenAI API | GPT-4 Vision, text processing |
| Google Maps API | Maps, geocoding, autocomplete |
| Sahibinden.com API | Listing sync |

---

## 3. Database Schema

### Core Models

```prisma
model User {
  id           String   @id @default(cuid())
  email        String   @unique
  passwordHash String
  name         String
  role         Role     @default(VIEWER)
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt
  
  listings     Listing[]
  exportJobs   ExportJob[]
}

enum Role {
  ADMIN
  EDITOR
  VIEWER
}

model Listing {
  id           String        @id @default(cuid())
  slug         String        @unique
  status       ListingStatus @default(DRAFT)
  type         PropertyType
  saleType     SaleType
  
  // Location
  city         String
  district     String
  neighborhood String?
  latitude     Float?
  longitude    Float?
  
  // Property details
  price        Decimal
  currency     String        @default("EUR")
  area         Int           // m²
  rooms        Int?
  bedrooms     Int?
  bathrooms    Int?
  floor        Int?
  totalFloors  Int?
  buildYear    Int?
  
  // AI-generated
  aiTags       String[]
  
  // Timestamps
  createdAt    DateTime      @default(now())
  updatedAt    DateTime      @updatedAt
  publishedAt  DateTime?
  
  // Relations
  createdBy    User          @relation(fields: [createdById], references: [id])
  createdById  String
  translations ListingTranslation[]
  media        Media[]
  syncLogs     SyncLog[]
}

enum ListingStatus {
  DRAFT
  PUBLISHED
  ARCHIVED
}

enum PropertyType {
  APARTMENT
  VILLA
  PENTHOUSE
  LAND
  COMMERCIAL
  OFFICE
}

enum SaleType {
  SALE
  RENT
}

model ListingTranslation {
  id          String   @id @default(cuid())
  listingId   String
  listing     Listing  @relation(fields: [listingId], references: [id], onDelete: Cascade)
  locale      String   // tr, en, de, ar
  title       String
  description String   @db.Text
  features    String[]
  
  @@unique([listingId, locale])
}

model Media {
  id           String    @id @default(cuid())
  listingId    String
  listing      Listing   @relation(fields: [listingId], references: [id], onDelete: Cascade)
  url          String
  thumbnailUrl String?
  type         MediaType @default(IMAGE)
  order        Int       @default(0)
  isCover      Boolean   @default(false)
  aiTags       String[]
  createdAt    DateTime  @default(now())
}

enum MediaType {
  IMAGE
  VIDEO
}

model SyncLog {
  id           String     @id @default(cuid())
  listingId    String
  listing      Listing    @relation(fields: [listingId], references: [id], onDelete: Cascade)
  platform     String     @default("sahibinden")
  action       String     // create, update, delete
  status       SyncStatus
  externalId   String?
  errorMessage String?
  requestData  Json?
  responseData Json?
  createdAt    DateTime   @default(now())
}

enum SyncStatus {
  PENDING
  SYNCING
  SUCCESS
  FAILED
}

model ExportJob {
  id          String       @id @default(cuid())
  type        String       @default("csv")
  status      ExportStatus @default(PENDING)
  filters     Json?
  fileUrl     String?
  createdBy   User         @relation(fields: [createdById], references: [id])
  createdById String
  createdAt   DateTime     @default(now())
  completedAt DateTime?
}

enum ExportStatus {
  PENDING
  PROCESSING
  COMPLETED
  FAILED
}
```

---

## 4. API Architecture

### Authentication Endpoints
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `POST` | `/api/auth/login` | Email/password login | Public |
| `POST` | `/api/auth/logout` | End session | Required |
| `GET` | `/api/auth/me` | Current user info | Required |

### Listing Endpoints
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `GET` | `/api/listings` | List with filters, pagination | Editor+ |
| `POST` | `/api/listings` | Create new listing | Editor+ |
| `GET` | `/api/listings/[id]` | Get single listing | Editor+ |
| `PATCH` | `/api/listings/[id]` | Update listing | Editor+ |
| `POST` | `/api/listings/[id]/publish` | Publish listing | Editor+ |
| `DELETE` | `/api/listings/[id]` | Delete listing | Admin |

### AI Processing Endpoints
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `POST` | `/api/ai/tag-images` | Tag images with GPT-4 Vision | Editor+ |
| `POST` | `/api/ai/parse-text` | Extract fields from text | Editor+ |
| `POST` | `/api/ai/process-listing` | Full AI processing | Editor+ |

### Media Endpoints
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `POST` | `/api/media/upload` | Upload images to Minio | Editor+ |
| `DELETE` | `/api/media/[id]` | Delete media | Editor+ |
| `PATCH` | `/api/media/reorder` | Reorder media | Editor+ |

### Sync & Export Endpoints
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `POST` | `/api/sync/sahibinden` | Sync to Sahibinden | Editor+ |
| `GET` | `/api/sync/logs` | Sync logs | Editor+ |
| `POST` | `/api/export/csv` | Start CSV export | Editor+ |
| `GET` | `/api/export/[id]` | Check export status | Editor+ |

### Public Endpoints (No Auth)
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/public/listings` | Public listing list |
| `GET` | `/api/public/listings/[slug]` | Public listing detail |
| `POST` | `/api/public/contact` | Contact form submission |

---

## 5. Application Structure

```
guzel-invest/
├── app/
│   ├── [locale]/                    # i18n routing (tr, en, de, ar)
│   │   ├── (public)/                # Public website
│   │   │   ├── page.tsx             # Homepage
│   │   │   ├── portfoy/             # Portfolio list
│   │   │   │   └── [category]/[type]/page.tsx
│   │   │   ├── ilan/[slug]/         # Listing detail
│   │   │   ├── harita/              # Map view
│   │   │   ├── hakkimizda/          # About us
│   │   │   └── iletisim/            # Contact
│   │   └── layout.tsx
│   │
│   ├── admin/                       # Admin panel (no i18n)
│   │   ├── layout.tsx
│   │   ├── page.tsx                 # Dashboard
│   │   ├── login/page.tsx
│   │   ├── ilanlar/
│   │   │   ├── page.tsx             # Listing list
│   │   │   ├── yeni/page.tsx        # Create listing
│   │   │   └── [id]/page.tsx        # Edit listing
│   │   ├── medya/page.tsx           # Media management
│   │   ├── sync/page.tsx            # Sahibinden sync
│   │   ├── export/page.tsx          # CSV export
│   │   ├── kullanicilar/page.tsx    # User management
│   │   └── ayarlar/page.tsx         # Settings
│   │
│   ├── api/                         # API routes
│   │   ├── auth/
│   │   ├── listings/
│   │   ├── media/
│   │   ├── ai/
│   │   ├── sync/
│   │   ├── export/
│   │   └── public/
│   │
│   └── generated/prisma/            # Prisma client
│
├── components/
│   ├── ui/                          # Base UI components
│   │   ├── button.tsx
│   │   ├── input.tsx
│   │   ├── select.tsx
│   │   ├── modal.tsx
│   │   ├── data-table.tsx
│   │   └── ...
│   ├── admin/                       # Admin-specific components
│   │   ├── sidebar.tsx
│   │   ├── listing-form.tsx
│   │   ├── media-uploader.tsx
│   │   ├── ai-processor.tsx
│   │   └── ...
│   └── public/                      # Public website components
│       ├── header.tsx
│       ├── footer.tsx
│       ├── listing-card.tsx
│       ├── listing-gallery.tsx
│       ├── map-view.tsx
│       ├── contact-form.tsx
│       └── ...
│
├── lib/
│   ├── prisma.ts                    # Prisma client singleton
│   ├── auth.ts                      # JWT utilities
│   ├── openai.ts                    # OpenAI client
│   ├── minio.ts                     # Minio S3 client
│   ├── sahibinden.ts                # Sahibinden API client
│   └── utils.ts                     # Utilities
│
├── messages/                        # i18n translations
│   ├── tr.json
│   ├── en.json
│   ├── de.json
│   └── ar.json
│
├── prisma/
│   ├── schema.prisma
│   └── migrations/
│
├── public/
│   ├── images/
│   └── fonts/
│
└── config files (package.json, tsconfig.json, etc.)
```

---

## 6. Key Feature Implementations

### 6.1 AI Processing Flow

```mermaid
sequenceDiagram
    participant E as Editor
    participant F as Frontend
    participant B as Backend
    participant AI as OpenAI API
    participant M as Minio

    E->>F: Upload images + paste description
    F->>M: Upload images
    M-->>F: Image URLs
    E->>F: Click "AI ile Yapılandır"
    F->>B: POST /api/ai/process-listing
    B->>AI: GPT-4 Vision (image tagging)
    AI-->>B: Tags (salon, yatak odası, havuz...)
    B->>AI: GPT-4 (field extraction)
    AI-->>B: Structured fields (price, m², rooms...)
    B-->>F: AI results
    F->>F: Auto-fill form fields
    E->>F: Review & edit
    E->>F: Save / Publish
    F->>B: POST /api/listings
```

### 6.2 Sahibinden Sync Flow

```mermaid
sequenceDiagram
    participant E as Editor
    participant B as Backend
    participant S as Sahibinden API
    participant DB as Database

    E->>B: Click "Sahibinden Sync"
    B->>DB: Create SyncLog (PENDING)
    B->>B: Transform to Sahibinden format
    B->>S: POST /listings
    alt Success
        S-->>B: 200 OK (sync_id)
        B->>DB: Update SyncLog (SUCCESS)
        B-->>E: Success notification
    else Failure
        S-->>B: Error response
        B->>DB: Update SyncLog (FAILED)
        B-->>E: Error message + retry button
    end
```

### 6.3 Multi-language URL Structure

| Page | 🇹🇷 Türkçe | 🇬🇧 English | 🇩🇪 Deutsch | 🇸🇦 العربية |
|------|-----------|-------------|-------------|-------------|
| Home | `/tr` | `/en` | `/de` | `/ar` |
| Villas for Sale | `/tr/portfoy/villa/satilik` | `/en/portfolio/villa/for-sale` | `/de/portfolio/villa/zu-verkaufen` | `/ar/portfolio/villa/for-sale` |
| Listing Detail | `/tr/ilan/[slug]` | `/en/listing/[slug]` | `/de/immobilie/[slug]` | `/ar/listing/[slug]` |
| Map | `/tr/harita` | `/en/map` | `/de/karte` | `/ar/map` |

---

## 7. Development Phases

### Phase 1: Design & Planning (32h)
- [ ] Wireframes for 14 pages
- [ ] UI Design System (colors, fonts, components)
- [ ] High-fidelity mockups
- [ ] Project kickoff & tech planning

### Phase 2: Infrastructure & Setup (20h)
- [ ] Next.js project setup with TailwindCSS
- [ ] Prisma schema & initial migrations
- [ ] JWT authentication system
- [ ] Minio S3 integration
- [ ] i18n setup (4 languages)
- [ ] CI/CD with Coolify

### Phase 3: Admin Panel Core (40h)
- [ ] Admin layout & navigation
- [ ] Dashboard with stats
- [ ] Listing list with DataTable
- [ ] Listing CRUD API
- [ ] Listing create/edit forms
- [ ] User management

### Phase 4: Media & AI Integration (36h)
- [ ] Drag & drop media upload
- [ ] Media management API
- [ ] OpenAI image tagging (GPT-4 Vision)
- [ ] OpenAI text extraction
- [ ] AI processing UI
- [ ] Thumbnail generation

### Phase 5: Sahibinden & Export (24h)
- [ ] Sahibinden API research & integration
- [ ] Sync service implementation
- [ ] Sync UI & log viewing
- [ ] CSV export background job
- [ ] Export UI

### Phase 6: Public Website (48h)
- [ ] Homepage (hero, featured, categories)
- [ ] Portfolio list with filters
- [ ] Listing detail page
- [ ] Map view with Google Maps
- [ ] About us page
- [ ] Contact page
- [ ] SEO & meta tags
- [ ] RTL support (Arabic)

### Phase 7: Testing & Deployment (20h)
- [ ] QA testing all flows
- [ ] Bug fixing
- [ ] Performance optimization
- [ ] Production deployment
- [ ] Documentation

---

## 8. Environment Variables

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/guzel_invest"

# Authentication
JWT_SECRET="your-jwt-secret-min-32-chars"
JWT_EXPIRES_IN="7d"

# Minio S3
MINIO_ENDPOINT="minio.yourdomain.com"
MINIO_PORT="9000"
MINIO_ACCESS_KEY="your-access-key"
MINIO_SECRET_KEY="your-secret-key"
MINIO_BUCKET="guzel-invest"
MINIO_USE_SSL="true"

# OpenAI
OPENAI_API_KEY="sk-..."
OPENAI_MODEL_VISION="gpt-4-vision-preview"
OPENAI_MODEL_TEXT="gpt-4-turbo"

# Google Maps
NEXT_PUBLIC_GOOGLE_MAPS_KEY="AIza..."

# Sahibinden
SAHIBINDEN_API_KEY="your-api-key"
SAHIBINDEN_API_SECRET="your-api-secret"
SAHIBINDEN_API_URL="https://api.sahibinden.com"

# Analytics
NEXT_PUBLIC_GA_ID="G-..."
NEXT_PUBLIC_GTM_ID="GTM-..."

# App
NEXT_PUBLIC_APP_URL="https://guzelinvest.com"
NEXT_PUBLIC_WHATSAPP_NUMBER="+905..."
```

---

## 9. Role-Based Access Control

| Feature | Admin | Editor | Viewer |
|---------|:-----:|:------:|:------:|
| View listings | ✅ | ✅ | ✅ |
| Create/Edit listings | ✅ | ✅ | ❌ |
| Publish listings | ✅ | ✅ | ❌ |
| Delete listings | ✅ | ❌ | ❌ |
| Sahibinden sync | ✅ | ✅ | ❌ |
| User management | ✅ | ❌ | ❌ |
| Translation management | ✅ | ✅ | ❌ |
| Export data | ✅ | ✅ | ❌ |

---

## 10. Estimated Timeline

| Phase | Duration | Team |
|-------|----------|------|
| Phase 1: Design & Planning | 1 week | UX/UI Designer, PM |
| Phase 2: Infrastructure | 3 days | Backend, DevOps |
| Phase 3: Admin Core | 1 week | Frontend, Backend |
| Phase 4: Media & AI | 1 week | Frontend, Backend |
| Phase 5: Sync & Export | 3 days | Backend, Frontend |
| Phase 6: Public Website | 1.5 weeks | Frontend |
| Phase 7: Testing & Deploy | 3 days | QA, DevOps |
| **Total** | **~6 weeks** | **220 hours** |

---

## 11. Risk Considerations

> [!WARNING]
> **Sahibinden.com API Access**
> 
> Official API access requires formal application process. Alternative approaches (scraping, manual sync) may be needed if official access is denied or delayed.

> [!IMPORTANT]
> **OpenAI Costs & Rate Limits**
> 
> GPT-4 Vision API calls can be expensive. Implement:
> - Request caching
> - Rate limiting per user
> - Cost monitoring dashboard

> [!NOTE]
> **Multi-language Content**
> 
> AI can suggest translations, but professional translation services should be used for final content to ensure quality for international investors.

---

## 12. Success Metrics

| Metric | Target |
|--------|--------|
| Page load time | < 2 seconds |
| Lighthouse Performance | > 90 |
| Lighthouse SEO | > 95 |
| Time to create listing | < 5 minutes (with AI) |
| Sahibinden sync success rate | > 95% |
| Multi-language coverage | 4 languages |
