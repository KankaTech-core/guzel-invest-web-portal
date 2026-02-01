# Güzel Invest — Know-How

## Proje Tanımı
Alanya merkezli emlak firması için AI destekli ilan yönetimi ve portföy sunum platformu.

## Hikaye

### Vizyon & Miras
“Güzel şehre güzel projeler yakışır” anlayışıyla, 2001 yılından bu yana Alanya’nın silüetine modern ve kaliteli dokunuşlar yapıyoruz. Güzel Invest, köklü tecrübesini dijitalin hızıyla birleştirerek, gayrimenkul yatırımını şeffaf, güvenli ve “premium” bir deneyim haline getirmeyi hedeflemektedir.

### Alanya: Akdeniz’in İncisi
Güzel Invest, Alanya ile derin bir bağa sahiptir. Türkiye’nin en popüler turizm ve yatırım bölgelerinden biri olan Alanya, Avrupa’dan gelen yatırımcılar için cazip bir destinasyondur.

Neden Alanya?
- Yıllık 300 Güneşli Gün — Akdeniz iklimi, yıl boyunca yaşanabilir ortam
- Uygun Fiyatlar — Avrupa’ya kıyasla erişilebilir yatırım fırsatları
- Uluslararası Topluluk — Almanya, Rusya, Skandinavya’dan geniş expat kitlesi
- Değer Artışı — Sürekli büyüyen emlak piyasası ve kira getirisi

### Hedef Kitle
- Alman yatırımcılar ve emekliler
- Ortadoğu’dan alıcılar
- Türk diasporası
- İkinci ev arayan Avrupalılar

### Dil Desteği
- Türkçe
- English
- Deutsch
- العربية

### AI Destekli
OpenAI entegrasyonu ile fotoğraflar otomatik etiketlenir, yapılandırılmamış metinler form alanlarına dönüştürülür.

### Dinamik Portföy Kategorileri
Platform, Alanya’nın tüm yatırım dinamiklerine hitap eden geniş bir yelpazeyi yönetmektedir:

- **Konut & Projeler:** Satılık Konutlar, Tüm Projeler
- **Ticari Alanlar:** Satılık Dükkanlar, Kiralık Dükkanlar, Dükkanlar
- **Arazi & Yatırım:** Arsa ve Tarlalar, Yatırımlık Portföyler, Tarlalar, Arsalar
- **Özel Statülü:** İkametgaha ve Vatandaşlığa Uygun Daireler

### Size Özel Hizmet Skalamız
İnşaat tecrübemizden gelen güveni, uçtan uca danışmanlıkla birleştiriyoruz.

- Kişiselleştirilmiş Portföy — İhtiyaçlarınıza en uygun proje ve portföyü, Alanya uzmanlığımızla birlikte belirliyoruz.
- Satış Sonrası Sadakat — Sadece tapu gününde değil, mülk sahibi olduğunuz her gün desteğimizi sürdürüyoruz.
- Finansal Danışmanlık — Krediyle alım yapmak isteyenlere en iyi banka ve finans yönlendirmelerini sağlıyoruz.
- Resmi Süreç Yönetimi — Tapu ve resmi işlemlerde tüm süreçte yanınızda olup bürokrasiyi kolaylaştırıyoruz.
- Yatırım Değerleme — Yatırım amaçlı alınan mülklerin satışında ve değerlendirilmesinde profesyonel destek veriyoruz.

“Güzel şehre güzel projeler yakışır” — Since 2001, Alanya

### Mevcut Problem
- Gayrimenkul Sunumunda Amatörlük: Portföylerin Google Drive klasörlerinde saklanması ve müşterilere profesyonellikten uzak “Drive Linki” üzerinden sunulmak zorunda kalınması.
- Sıfır Online Talep: Firmanın dijital bir merkezinin olmaması nedeniyle potansiyel müşterilerin web üzerinden talep bırakabileceği hiçbir kanalın bulunmaması.
- Veri Dağınıklığı: İlan görsellerinin Drive’da, açıklamaların WhatsApp’ta, teknik detayların ise notlar arasında dağınık ve kontrolsüz kalması.
- Uluslararası Güven Kaybı: Alanya gibi global bir pazarda, web sitesi ve çoklu dil desteği olmayan bir firmanın yabancı yatırımcılar nezdindeki düşük repütasyonu.

### Çözüm
- Premium Portföy Sunumu: Drive linklerinin hantallığını yıkan; her gayrimenkulü interaktif galeriler, harita ve teknik özelliklerle bir sanat eserine dönüştüren web sayfaları.
- Dijital Lead Hunisi: 7/24 çalışan akıllı formlar ve doğrudan WhatsApp entegrasyonu ile markaya has, ölçülebilir bir online müşteri kanalı.
- Merkezi Veri Yönetimi: Drive, WhatsApp ve notlar arasındaki karmaşayı sonlandıran; tüm portföyü tek bir akıllı panelden yönetmeyi sağlayan yeni nesil admin ekosistemi.
- Küresel Marka Algısı: 4 dilde kusursuz sunum ve modern arayüz ile uluslararası yatırımcılara profesyonel ve güvenilir bir marka imajı.

## Modüller

### 🔐 Admin Panel Modülleri
Ekip içi kullanım için tasarlanmış yönetim arayüzü. İlan oluşturma, AI işleme, sync yönetimi ve raporlama özellikleri.

#### İlan Yönetimi
Açıklama: İlan oluşturma, düzenleme, taslak/yayında/arşiv durumları
Özellikler:
- Sürükle-bırak medya yükleme
- AI ile otomatik alan doldurma
- Çoklu dil içerik yönetimi
- Durum geçişleri (Draft → Published → Archived)
- Toplu işlemler (bulk actions)

#### Medya Yönetimi
Açıklama: Fotoğraf yükleme, sıralama, kapak seçimi, AI etiketleme
Özellikler:
- Drag & drop çoklu yükleme
- Otomatik thumbnail oluşturma
- AI görsel etiketleme (salon, yatak odası, havuz...)
- Sıralama ve kapak fotoğrafı seçimi
- Minio (S3) entegrasyonu

#### AI İşleme
Açıklama: Otomatik etiketleme, metin yapılandırma, alan eşleştirme
Özellikler:
- GPT-4 Vision ile görsel analizi
- Yapılandırılmamış metinden field extraction
- Form alanlarına otomatik mapping
- Çeviri önerileri (TR → EN/DE/AR)
- Kalite kontrolü ve düzenleme önerileri

#### Sahibinden Sync
Açıklama: Sahibinden.com API entegrasyonu, durum takibi
Özellikler:
- Tek tıkla ilan gönderimi
- Güncelleme senkronizasyonu
- Sync durumu ve hata logları
- Retry mekanizması
- Eşleşme doğrulama

#### Dışa Aktarım
Açıklama: CSV export, raporlama, filtreli aktarım
Özellikler:
- Tüm ilanları CSV olarak indir
- Filtreli export (sadece yayındakiler vb.)
- Excel uyumlu format
- Export geçmişi ve job durumu
- Özelleştirilebilir alanlar

#### Kullanıcı Yönetimi
Açıklama: Ekip yönetimi, roller, yetkiler
Özellikler:
- Admin / Editor / Viewer rolleri
- Davet sistemi
- Activity log
- Oturum yönetimi
- Şifre sıfırlama

### 🌐 Web Sitesi Modülleri
Müşteri yüzü için tasarlanmış modern portföy sunum platformu. Filtreleme, harita görünümü ve çoklu dil desteği.

- Ana Sayfa — Hero, öne çıkan ilanlar, kategori kartları
- Portföy Listesi — Filtreleme, sıralama, grid/list görünüm
- İlan Detay — Galeri, özellikler, harita, iletişim formu
- Harita Görünümü — Google Maps, pin/cluster, popup kartlar
- Hakkımızda — Firma hikayesi, ekip, değerler
- İletişim — Form, adres, sosyal medya bağlantıları

### Rol Bazlı Erişim Matrisi

| Özellik | Admin | Editor | Viewer |
| --- | --- | --- | --- |
| İlan Görüntüleme | ✓ | ✓ | ✓ |
| İlan Oluşturma/Düzenleme | ✓ | ✓ | ✗ |
| İlan Yayınlama | ✓ | ✓ | ✗ |
| Sahibinden Sync | ✓ | ✓ | ✗ |
| İlan Silme | ✓ | ✗ | ✗ |
| Kullanıcı Yönetimi | ✓ | ✗ | ✗ |
| Çeviri Yönetimi | ✓ | ✓ | ✗ |

## UX Rehberi & Sayfa Haritası
Her sayfa için kullanıcı ihtiyaçları, içerikler, aksiyonlar ve durumlar detaylı olarak tanımlanmıştır.

### Web Sitesi Sayfaları

#### Ana Sayfa
Amaç: İlk izlenim, marka güveni, hızlı keşif
Bileşenler:
- Hero section + slogan
- Öne çıkan ilanlar carousel
- Kategori kartları
- İstatistikler
Aksiyonlar:
- Arama yapma
- Kategori seçimi
- Dil değiştirme
- İlan detaya gitme
Durumlar:
- Yükleniyor (skeleton)
- Standart

#### Portföy Listesi
Amaç: Kriterlere uygun ilanları bulma
Bileşenler:
- Sidebar filtreler (fiyat, m², oda)
- Üst menü (satılık/kiralık)
- Grid/List toggle
- Sıralama dropdown
- Pagination
Aksiyonlar:
- Filtreleme
- Sıralama
- Favoriye ekleme
- Paylaşım
- Haritaya geç
Durumlar:
- Yükleniyor
- Sonuç var
- Sonuç yok (empty state)
- Hata

#### İlan Detay
Amaç: Karar verme için detaylı bilgi
Bileşenler:
- Fotoğraf galerisi
- Özellikler tablosu
- Harita (konum)
- Açıklama metni
- Benzer ilanlar
- İletişim formu
Aksiyonlar:
- Galeri gezme
- Paylaşım
- Favoriye ekleme
- İletişim formu gönder
- WhatsApp butonu
Durumlar:
- Yükleniyor
- İlan mevcut
- İlan bulunamadı (404)
- Form gönderildi

#### Harita Görünümü
Amaç: Konum bazlı görsel keşif
Bileşenler:
- Google Maps tam ekran
- Pin/Cluster gösterimi
- Popup kartlar
- Filtre panel
Aksiyonlar:
- Zoom / Pan
- Pin tıklama
- Filtreleme
- Detay sayfasına git
Durumlar:
- Harita yükleniyor
- Konum izni isteniyor
- Standart

### Admin Panel Ekranları

#### İlan Oluşturma
Akış:
1. Fotoğrafları sürükle-bırak ile yükle
2. Açıklama metnini kopyala-yapıştır
3. “AI ile Yapılandır” butonuna tıkla
4. Otomatik dolan alanları kontrol et
5. Kaydet veya Yayınla

Durumlar:
- Boş form
- Medya yükleniyor
- AI işliyor
- Form validasyon hatası
- Kaydedildi / Yayınlandı

### URL Yapısı (Çoklu Dil)
SEO uyumlu, hreflang destekli URL şeması

| Sayfa | 🇹🇷 Türkçe | 🇬🇧 English | 🇩🇪 Deutsch |
| --- | --- | --- | --- |
| Ana Sayfa | /tr | /en | /de |
| Satılık Villalar | /tr/portfoy/villa/satilik | /en/portfolio/villa/for-sale | /de/portfolio/villa/zu-verkaufen |
| İlan Detay | /tr/ilan/[slug] | /en/listing/[slug] | /de/immobilie/[slug] |
| Harita | /tr/harita | /en/map | /de/karte |

## İş Akışı

### 1) İlan Oluşturma Akışı
1. Editör — Fotoğrafları sürükle-bırak ile yükler. Sistem: Dosyalar Minio’ya yüklenir, thumbnail oluşturulur.
2. Editör — Açıklama metnini kopyala-yapıştır ile ekler. Sistem: Metin geçici olarak saklanır.
3. Editör — “AI ile Yapılandır” butonuna tıklar. Sistem: OpenAI API’ye istek gönderilir.
4. AI — Görselleri etiketler (salon, yatak odası, havuz...). Sistem: GPT-4 Vision analizi yapılır.
5. AI — Metinden alanları çıkarır (fiyat, m², oda sayısı...). Sistem: GPT-4 field extraction yapar.
6. Sistem — Form alanları otomatik doldurulur. Sistem: AI sonuçları forma mapping edilir.
7. Editör — Alanları kontrol eder, gerekirse düzenler. Sistem: Form validasyonu yapılır.
8. Editör — “Kaydet” veya “Yayınla” butonuna tıklar. Sistem: Veritabanına kaydedilir, status güncellenir.

### 2) Sahibinden Sync Akışı
Başarılı Senaryo:
1. Editör “Sahibinden Sync” butonuna tıklar
2. Backend Sahibinden API’ye istek gönderir
3. İlan verisi Sahibinden formatına dönüştürülür
4. Sahibinden başarılı yanıt döner (sync_id)
5. SyncLog tablosuna SUCCESS kaydedilir
6. Kullanıcıya başarılı bildirimi gösterilir

Hata Senaryosu:
1. Sahibinden API hata döner
2. Hata detayları loglanır (responseData)
3. SyncLog tablosuna FAILED kaydedilir
4. Kullanıcıya hata mesajı gösterilir
5. Editör sorunu düzeltir
6. “Tekrar Dene” butonu ile retry yapılır

Sync Durumları:
- ⏳ PENDING — Bekliyor
- 🔄 SYNCING — İşleniyor
- ✓ SUCCESS — Başarılı
- ✗ FAILED — Hata

### 3) Çoklu Dil Görüntüleme Akışı
1. Dil Algılama
- URL prefix kontrolü (/tr, /en, /de, /ar)
- Browser accept-language header
- Cookie’de saklanan tercih

2. İçerik Yükleme
- ListingTranslation tablosundan çekme
- Locale parametresi ile filtreleme
- Fallback: Çeviri yoksa Türkçe

3. SEO Optimizasyonu
- Her dil için ayrı URL
- hreflang meta tagları
- Dil bazlı sitemap.xml

Dil Değiştirme Örneği:
- /tr/ilan/villa-alanya → Kullanıcı “English” seçer → /en/listing/villa-alanya

### 4) CSV Export Akışı
1. Filtre seçimi (opsiyonel)
2. “Export CSV” tıkla
3. Background job başlar
4. Dosya hazırlanır
5. İndir butonu aktif

## Mimari

### Teknoloji Stack’i
Frontend Stack:
- Next.js 16 (App Router)
- TypeScript 5
- TailwindCSS 4
- next-intl (i18n)
- Lucide Icons

Backend & Database:
- Prisma ORM 6.x
- PostgreSQL 16
- Next.js API Routes
- Server Actions
- jose (JWT Auth)

Altyapı & Servisler:
- Coolify (Deployment)
- Minio (S3-compatible Storage)
- OpenAI API (GPT-4 Vision)
- Google Maps API
- Sahibinden.com API

### Sistem Mimarisi Diyagramı (Metin)
Client Layer:
- 🌐 Web Sitesi (Public)
- 🔐 Admin Panel

Application Layer:
- Next.js 16 (App Router + API)
- Auth Layer (JWT + Roles)
- i18n (next-intl)
- Server Actions (form handling)

Data & Integration Layer:
- Database: PostgreSQL (via Prisma)
- Storage: Minio (S3-compatible)
- Cache: Next.js Cache (ISR + revalidate)

External Services:
- 🤖 OpenAI API
- 🗺️ Google Maps
- 🏠 Sahibinden API
- 📊 GA4 / GTM

### Dosya Yapısı
```
guzel-invest/
├── app/
│   ├── [locale]/              # 🌐 Çoklu dil routing
│   │   ├── (public)/          # Web sitesi sayfaları
│   │   │   ├── page.tsx       # Ana sayfa
│   │   │   ├── portfoy/       # İlan listesi
│   │   │   ├── ilan/[slug]/   # İlan detay
│   │   │   ├── harita/        # Harita görünümü
│   │   │   ├── hakkimizda/    # Hakkımızda
│   │   │   └── iletisim/      # İletişim
│   │   └── layout.tsx
│   │
│   ├── admin/                 # 🔐 Admin panel
│   │   ├── layout.tsx
│   │   ├── page.tsx           # Dashboard
│   │   ├── login/
│   │   ├── ilanlar/
│   │   │   ├── page.tsx       # Liste
│   │   │   ├── yeni/          # Oluştur
│   │   │   └── [id]/          # Düzenle
│   │   ├── medya/
│   │   ├── sync/
│   │   ├── export/
│   │   ├── kullanicilar/
│   │   └── ayarlar/
│   │
│   ├── api/                   # API routes
│   │   ├── auth/
│   │   ├── listings/
│   │   ├── media/
│   │   ├── ai/
│   │   ├── sync/
│   │   ├── export/
│   │   └── public/
│   │
│   └── generated/prisma/      # Prisma client
│
├── components/
│   ├── ui/                    # Temel UI
│   ├── admin/                 # Admin bileşenleri
│   └── public/                # Web sitesi bileşenleri
│
├── lib/
│   ├── prisma.ts
│   ├── auth.ts
│   ├── openai.ts
│   ├── minio.ts
│   └── sahibinden.ts
│
├── messages/                  # i18n çevirileri
│   ├── tr.json
│   ├── en.json
│   ├── de.json
│   └── ar.json
│
└── prisma/
    ├── schema.prisma
    └── migrations/
```

### Environment Variables
Güvenlik için `.env` dosyasında saklanacak değişkenler:

```
# Database
DATABASE_URL="postgresql://..."

# Auth
JWT_SECRET="..."
NEXTAUTH_SECRET="..."

# Minio S3
MINIO_ENDPOINT="..."
MINIO_ACCESS_KEY="..."
MINIO_SECRET_KEY="..."
MINIO_BUCKET="guzel-invest"

# OpenAI
OPENAI_API_KEY="sk-..."

# Google Maps
NEXT_PUBLIC_GOOGLE_MAPS_KEY="..."

# Sahibinden
SAHIBINDEN_API_KEY="..."
SAHIBINDEN_API_SECRET="..."

# Analytics
NEXT_PUBLIC_GA_ID="G-..."
NEXT_PUBLIC_GTM_ID="GTM-..."
```

## Veri Modeli & Entegrasyonlar

### Veritabanı Şeması (Prisma)

User
- id: String @id
- email: String @unique
- passwordHash: String
- name: String
- role: Role (ADMIN/EDITOR/VIEWER)

Listing (Ana Model)
- id, slug: String
- status: ListingStatus
- type: PropertyType
- saleType: SaleType
- city, district, neighborhood
- latitude, longitude: Float
- price: Decimal, currency
- area, rooms, bedrooms...
- aiTags: String[]
- → translations[]
- → media[]
- → syncLogs[]

ListingTranslation
- id: String @id
- listingId → Listing
- locale: String (tr/en/de/ar)
- title: String
- description: String @db.Text
- features: String[]

Media
- id: String @id
- listingId → Listing
- url: String
- thumbnailUrl: String?
- type: MediaType
- order: Int
- aiTags: String[]

SyncLog
- id: String @id
- listingId → Listing
- platform: String
- action: String
- status: SyncStatus
- externalId: String?
- errorMessage: String?
- requestData: Json?
- responseData: Json?

ExportJob
- id: String @id
- type: String (csv)
- status: ExportStatus
- filters: Json?
- fileUrl: String?
- createdById: String
- completedAt: DateTime?

### API Endpoint Listesi

Auth & Users

| Method | Endpoint | Açıklama |
| --- | --- | --- |
| POST | /api/auth/login | Email/password ile giriş |
| POST | /api/auth/logout | Oturumu kapat |
| GET | /api/auth/me | Mevcut kullanıcı bilgisi |

Listings

| Method | Endpoint | Açıklama |
| --- | --- | --- |
| GET | /api/listings | İlan listesi (filtreli, paginated) |
| POST | /api/listings | Yeni ilan oluştur |
| PATCH | /api/listings/[id] | İlan güncelle |
| POST | /api/listings/[id]/publish | İlanı yayınla |
| DELETE | /api/listings/[id] | İlan sil (Admin only) |

AI Processing

| Method | Endpoint | Açıklama |
| --- | --- | --- |
| POST | /api/ai/tag-images | Görselleri etiketle (GPT-4 Vision) |
| POST | /api/ai/parse-text | Metni yapılandır (field extraction) |
| POST | /api/ai/process-listing | Tam ilan işleme (image + text) |

### Dış Servis Entegrasyonları

OpenAI API
- Görsel Etiketleme: `gpt-4-vision-preview`
- Metin Yapılandırma: `gpt-4-turbo`
- Çeviri Önerileri: `gpt-4`

Sahibinden.com API
- İlan Oluşturma: `POST /listings`
- İlan Güncelleme: `PUT /listings/:id`
- Durum Sorgulama: `GET /listings/:id`

Minio (S3-compatible)
- Bucket: `guzel-invest`
- Prefix: Orijinal → `/listings/:id/original/`
- Prefix: Thumbnail → `/listings/:id/thumb/`

Google Maps API
- Maps JavaScript API: ✓
- Geocoding API: ✓
- Places Autocomplete: ✓

## Geliştirme Aşamaları

### Özet
- Aşama sayısı: 7
- Toplam saat: 220
- İş günü: 28
- Hafta: 6

### Aşama Özeti
- Aşama 1 — Tasarım & Planlama: 32 saat
- Aşama 2 — Altyapı & Kurulum: 20 saat
- Aşama 3 — Admin Panel - Çekirdek: 40 saat
- Aşama 4 — Medya & AI Entegrasyonu: 36 saat
- Aşama 5 — Sahibinden & Export: 24 saat
- Aşama 6 — Web Sitesi (Public): 48 saat
- Aşama 7 — Test & Deployment: 20 saat

### Aşama 1 — Tasarım & Planlama (32 saat)

| Görev | Saat | Ekip | Örnek / Detay |
| --- | --- | --- | --- |
| Wireframing (14 sayfa × 30dk) | 7 | UX Designer | Dashboard, İlan Listesi, Detay, Harita, Admin ekranları |
| UI Design System | 8 | UI Designer | Renkler, fontlar (Inter/Outfit), butonlar, kartlar, formlar |
| High-fidelity UI (14 sayfa × 60dk) | 14 | UI Designer | Pixel-perfect mockup’lar, responsive varyantlar |
| Proje kickoff & teknik planlama | 3 | PM + Tech Lead | Sprint planı, tech stack onayı, repo setup |

### Aşama 2 — Altyapı & Kurulum (20 saat)

| Görev | Saat | Ekip | Örnek / Detay |
| --- | --- | --- | --- |
| Next.js proje kurulumu | 2 | Frontend | create-next-app, TailwindCSS, next-intl, klasör yapısı |
| Prisma schema & migration | 4 | Backend | User, Listing, Media, SyncLog, Translation modelleri |
| Auth sistemi (JWT) | 4 | Backend | Login, logout, session, role-based middleware |
| Minio S3 entegrasyonu | 3 | Backend | Upload service, presigned URLs, thumbnail generation |
| i18n kurulumu (4 dil) | 4 | Frontend | next-intl routing, messages/*.json, locale switching |
| CI/CD & Coolify deploy | 3 | DevOps | GitHub Actions, Docker, environment variables |

### Aşama 3 — Admin Panel - Çekirdek (40 saat)

| Görev | Saat | Ekip | Örnek / Detay |
| --- | --- | --- | --- |
| Admin layout & navigation | 4 | Frontend | Sidebar, header, breadcrumb, responsive menu |
| Dashboard sayfası | 4 | Frontend | Özet kartlar, son ilanlar, quick actions |
| İlan listesi sayfası | 6 | Frontend | DataTable, filtreleme, sıralama, pagination, bulk actions |
| İlan CRUD API | 6 | Backend | GET/POST/PATCH/DELETE endpoints, validasyon |
| İlan oluşturma formu | 8 | Frontend | Multi-step form, image upload zone, field validations |
| İlan düzenleme sayfası | 6 | Frontend | Pre-filled form, status transitions, çoklu dil tabs |
| Kullanıcı yönetimi | 6 | Full-Stack | Kullanıcı listesi, rol atama, davet, silme (Admin only) |

### Aşama 4 — Medya & AI Entegrasyonu (36 saat)

| Görev | Saat | Ekip | Örnek / Detay |
| --- | --- | --- | --- |
| Drag & drop media upload | 6 | Frontend | Multi-file upload, progress, preview, reorder |
| Media management API | 4 | Backend | Upload, delete, reorder, set cover endpoints |
| OpenAI görsel etiketleme | 6 | Backend | GPT-4 Vision API, prompt engineering, tag parsing |
| OpenAI metin yapılandırma | 6 | Backend | Field extraction, JSON output, mapping logic |
| AI işleme UI | 6 | Frontend | “AI ile Yapılandır” butonu, loading state, öneri kartları |
| Thumbnail generation | 4 | Backend | Sharp ile resize, WebP dönüşüm, Minio’ya kaydet |
| AI sonuçları form mapping | 4 | Frontend | Auto-fill logic, düzenleme modal, onay akışı |

### Aşama 5 — Sahibinden & Export (24 saat)

| Görev | Saat | Ekip | Örnek / Detay |
| --- | --- | --- | --- |
| Sahibinden API araştırma | 2 | Backend | API docs, auth flow, rate limits, field mapping |
| Sahibinden sync servisi | 8 | Backend | Create/update/status endpoints, error handling |
| Sync UI & log görüntüleme | 6 | Frontend | Sync butonu, status badge, log tablosu, retry |
| CSV export background job | 4 | Backend | Queue job, file generation, Minio save |
| Export UI | 4 | Frontend | Filtre seçimi, export butonu, job status, download |

### Aşama 6 — Web Sitesi (Public) (48 saat)

| Görev | Saat | Ekip | Örnek / Detay |
| --- | --- | --- | --- |
| Ana sayfa | 6 | Frontend | Hero, featured carousel, kategori kartları, istatistikler |
| Portföy listesi sayfası | 8 | Frontend | Sidebar filters, grid/list toggle, sıralama, pagination |
| Listing API (public) | 4 | Backend | GET /public/listings with filters, i18n content |
| İlan detay sayfası | 8 | Frontend | Galeri, özellikler tablosu, harita, benzer ilanlar |
| Harita görünümü | 8 | Frontend | Google Maps, markers, clustering, popup cards |
| Hakkımızda sayfası | 4 | Frontend | Firma hikayesi, ekip, değerler, galeri |
| İletişim sayfası | 4 | Frontend | Form, harita, sosyal medya, WhatsApp butonu |
| SEO & meta tags | 4 | Frontend | Dynamic OG, hreflang, sitemap.xml, robots.txt |
| RTL desteği (Arapça) | 2 | Frontend | dir='rtl', mirror layouts, font adjustments |

### Aşama 7 — Test & Deployment (20 saat)

| Görev | Saat | Ekip | Örnek / Detay |
| --- | --- | --- | --- |
| QA testing (tüm akışlar) | 8 | QA | İlan oluşturma, sync, export, multi-lang, responsive |
| Bug fixing | 6 | Full-Stack | QA raporlarından gelen hataların düzeltilmesi |
| Performance optimization | 3 | Frontend | Lighthouse audit, image lazy load, code splitting |
| Production deployment | 2 | DevOps | Final deploy, DNS setup, SSL certificate |
| Dokümantasyon | 1 | Tech Lead | README, env vars guide, admin kullanım kılavuzu |

### Ekip Dağılımı
- UX Designer: 7h
- UI Designer: 22h
- Frontend: 90h
- Backend: 47h
- Full-Stack: 12h
- DevOps: 5h
- PM + Tech Lead: 4h
- QA: 8h

### Önemli Notlar
- Tahminler ideal koşullar için hesaplanmıştır. Beklenmedik teknik zorluklar için +20% buffer eklenebilir.
- Paralel çalışma için Frontend ve Backend ekiplerinin eşzamanlı ilerlemesi önerilir.
- AI entegrasyonu için OpenAI API rate limit’leri ve maliyet hesabı yapılmalıdır.
- Sahibinden.com API erişimi için resmi başvuru süreci takip edilmelidir.
- Çoklu dil çevirileri için profesyonel çeviri servisi veya müşteri içerikleri kullanılacaktır.
