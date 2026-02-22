# Single Project Backend Design (S1 Bazlı)

## Amaç
`/s1` varyasyonunu statik mock datadan çıkarıp admin panelden yönetilen, section-bazlı dinamik bir proje detay yapısına taşımak. Aynı zamanda proje kayıtları portföy/ilan akışında görünmeli ve oda filtresi ile eşleşebilmelidir.

## İnceleme Özeti
- `/Users/canaltuntas/Documents/Work/Guzel Invest Alanya/src/app/(non-localized)/s1` şu an tamamen `mockData.ts` üzerinden çalışıyor.
- `/s1` içinde ikonlar `switch-case` ile elle mapleniyor; admin tarafında dinamik icon seçimi yok.
- Section’lar şu an koşulsuz render ediliyor; “veri yoksa section gösterme” kuralı uygulanmıyor.
- `/Users/canaltuntas/Documents/Work/Guzel Invest Alanya/ COLOSSEUM OBA` içinde klasör yapısı var ama dosya bulunmuyor (yalnızca boş dizinler).
- `/Users/canaltuntas/Documents/Work/Guzel Invest Alanya/src/app/(non-localized)/admin/projeler` ve `/Users/canaltuntas/Documents/Work/Guzel Invest Alanya/src/app/api/admin/projects` klasörleri mevcut ama dosya içerikleri henüz yok.

## Kritik Teknik Durum (DB vs Kod)
- Canlı veritabanında proje odaklı alanlar/tablolar zaten var:
- `listings.isProject`, `listings.projectType`, `listings.deliveryDate`
- `project_features`, `project_feature_translations`
- `custom_galleries`, `custom_gallery_translations`
- `project_units`, `project_unit_translations`
- `floor_plans`, `floor_plan_translations`
- `listing_faqs`, `listing_faq_translations`
- `media.category`, `media.customGalleryId`, `media.projectUnitId`
- Fakat `/Users/canaltuntas/Documents/Work/Guzel Invest Alanya/prisma/schema.prisma` bu alanları/modeli şu an içermiyor.
- Sonuç: Uygulamayı büyütmeden önce Prisma şemasını canlı DB ile hizalamak zorunlu.

## Yaklaşım Seçenekleri
1. `listings` tablosunu kök kayıt olarak kullanıp `isProject=true` ile proje modeli kurmak. (Önerilen)
2. Ayrı `projects` tablosu kurup ilanlarla union endpoint üretmek.
3. Tam blok-bazlı (JSON CMS) model kurmak.

### Önerilen Yaklaşım
1 numara. Çünkü canlı DB zaten bu yöne evrilmiş durumda ve “ilanlar içinde proje gösterme + oda filtresiyle projeyi eşleştirme” ihtiyacı için en az sürtünmeli çözüm bu.

## S1 İçin Hedef Veri Modeli Eşlemesi
| S1 Section | Veri Kaynağı (önerilen) | Gösterim Kuralı |
| --- | --- | --- |
| Hero | `listings` + `listing_translations` + hero görsel (`media`) | Başlık + hero görsel varsa |
| Proje Genel Özellikleri (ikon/text) | `project_features` (`category='GENERAL'`) + translation | En az 1 kayıt varsa |
| Proje Detayları (özet, teslim, etiket) | `listing_translations.description/features` + `listings.deliveryDate` | Özet metni veya teslim tarihi varsa |
| Proje Videosu | `listings` içinde `videoUrl` (veya ayrı project field) | URL varsa |
| Vaziyet planı ve dış görseller | `media` (`category='EXTERIOR'`) | En az 1 görsel varsa |
| Sosyal imkanlar (ikon/text) | `project_features` (`category='SOCIAL'`) + translation | En az 1 kayıt varsa |
| İç görseller | `media` (`category='INTERIOR'`) | En az 1 görsel varsa |
| Kat Planı | `floor_plans` + translations | En az 1 plan varsa |
| Belgeler | `media` (`type='DOCUMENT'`) veya ayrı endpoint | En az 1 belge varsa |
| Harita görselleri + konum | `media` (`category='MAP'`) + listing konum alanları | Görsel veya koordinat varsa |
| SSS | `listing_faqs` + translations | En az 1 soru varsa |
| Özel galeri blokları (1+1 gibi) | `custom_galleries` + gallery media | En az 1 özel galeri varsa |

## Özel Galeri Yerleşimi (Kullanıcı İstediği Konum)
Mevcut `custom_galleries.order` tek başına “nereye eklenecek” bilgisini taşımıyor. Bu yüzden minimal ek alan önerisi:
- `custom_galleries.anchorSection` (`INTERIOR`, `FLOOR_PLAN`, `MAP`, vb.)
- `custom_galleries.anchorOrder` (aynı anchor altındaki sıra)

Bu sayede örnek olarak “İç görsellerden sonra 1+1 galerisi” net şekilde modellenebilir.

## Icon Library Stratejisi
- UI: `lucide-react` tabanlı ikon picker (arama + önizleme).
- DB: `project_features.icon` içinde ikon adı saklanır, gerekirse `customIconUrl` fallback alanı açılır.
- Güvenlik ve stabilite için whitelist:
- `src/lib/project-icon-catalog.ts` benzeri bir dosyada izinli ikon listesi.
- API katmanında whitelist doğrulaması.

## İlanlar Sayfasında Projelerin Görünmesi
Kurallar:
- Filtre yoksa: normal ilanlar + projeler birlikte listelenir.
- Oda filtresi varsa (`2+1` gibi): normal ilanlar `listing.rooms` ile eşleşir, projeler `project_units.rooms` ile eşleşirse listelenir.
- Projelerde üst fiyat gösterimi zorunlu değildir; kartta “Proje Detayı” modu gösterilir.

Pratik sorgu mantığı:
- `OR` bloğu:
- `isProject = false` için mevcut ilan filtreleri
- `isProject = true` için `projectUnits.some({ rooms in selectedRooms })`

## Faz Planı
### Faz 0 (Zorunlu): Şema Hizalama
- `prisma/schema.prisma` canlı DB ile hizalanmalı (reset yok).
- Sonrasında mevcut kod kırılmadan Prisma client yeniden üretilmeli.

### Faz 1: Admin Proje CRUD
- `/admin/projeler` liste + yeni + düzenle.
- `/api/admin/projects` ve `/api/admin/projects/[id]`.
- Section bazlı alt formlar (özellikler, galeriler, unit’ler, FAQ, belgeler).

### Faz 2: Medya ve Doküman Akışları
- Görseller için category bazlı yükleme.
- Belge (PDF vb.) upload akışı.

### Faz 3: Public API + `/s1` Dinamik Render
- `/api/public/projects/[slug]` ile normalize payload.
- `/s1` mockData yerine API/DB datadan beslenecek.
- Veri yoksa section render edilmeyecek.

### Faz 4: Portföy/İlan Entegrasyonu
- `/api/public/listings` response’u proje kartlarını da dönecek.
- Oda filtresi ile project unit eşleşmesi aktif olacak.

## Karar Bekleyen Noktalar
- Proje kartında fiyat tamamen gizli mi kalacak, yoksa “başlangıç fiyatı” (unit price varsa) opsiyonel mi?
- Özel galeriler sadece belirli section’lardan sonra mı eklenebilsin, yoksa tamamen serbest sıra mı?
- Icon seti sadece Lucide mi olsun, yoksa SVG upload da açık mı?
- Belge tipleri: sadece PDF mi, yoksa DOCX/PPTX de desteklenecek mi?

## Öneri
Önce Faz 0’ı bitirip şemayı stabilize edelim. Ardından proje CRUD ve `/s1` dinamik render paralel ilerleyebilir. Bu sıra, “veritabanını resetleme” kuralını bozmadan en güvenli ve en hızlı ilerleme yoludur.
