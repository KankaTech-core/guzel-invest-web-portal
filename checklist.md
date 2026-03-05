# Site Optimizasyon Checklist (Sayfa Bazlı)

Bu listeyi her sayfa için ayrı uygulayarak hem hataları azaltabilir hem de performansı ölçülebilir şekilde iyileştirebilirsin.

## 1) Başlamadan Önce (Bir Kez)

- [ ] Projeyi temiz durumda çalıştır: `npm run dev`
- [ ] Statik analiz çalıştır: `npm run lint`
- [ ] Üretim derlemesini doğrula: `npm run build`
- [ ] Hedef sayfaları önceliklendir (trafik + iş değeri): ana sayfa, proje detay, portföy, ilan detay, admin kritik sayfalar

## 2) Her Sayfa İçin Uygulama Akışı

- [ ] Sayfa rotasını ve dosyasını yaz (ör: `/tr/proje/[slug]` -> `src/app/(localized)/[locale]/proje/[slug]/page.tsx`)
- [ ] Değişiklik öncesi metrikleri kaydet (LCP, INP, CLS, TTFB, JS payload)
- [ ] Aşağıdaki teknik checklist’i sayfa özelinde uygula
- [ ] Değişiklik sonrası aynı metrikleri tekrar ölç
- [ ] Sonucu not et: ne değişti, neden değişti, yan etki var mı

## 3) Teknik Checklist (Vercel/Next/React Odaklı)

### A) Waterfall ve Veri Erişimi

- [ ] Bağımsız istekleri paralelleştir (`Promise.all`)
- [ ] Gereksiz erken `await` kullanımını kaldır (await’i ihtiyaç anına taşı)
- [ ] Server component içinde veriyi parent-child zincirinde bekletme
- [ ] API route içinde “start early, await late” uygula
- [ ] Uygunsa `Suspense` ile parçalı render/streaming kullan

### B) Bundle Boyutu

- [ ] Barrel import yerine doğrudan import kullan
- [ ] Ağır bileşenleri `dynamic import` ile parçala
- [ ] Yalnızca gerekli client component’lerde `"use client"` tut
- [ ] Kullanılmayan kütüphane/ikon/import temizliği yap
- [ ] Üçüncü parti scriptleri kritik olmayan aşamaya ertele

### C) Server-Side Performans

- [ ] Tekrar eden server hesaplamalarında cache stratejisi uygula
- [ ] Client’a taşınan prop veri boyutunu azalt
- [ ] Aynı verinin tekrar serialize edilmesini önle
- [ ] Route handler’larda doğrulama + erken dönüş ile gereksiz işlem kes

### D) Client Re-render Kontrolü

- [ ] Sık güncellenen ama render gerektirmeyen değerleri `useRef` ile tut
- [ ] Ağır alt ağaçları memoize et (`memo`, gerekirse `useMemo`)
- [ ] Effect bağımlılıklarını primitive ve minimal tut
- [ ] Etkileşim mantığını mümkünse event handler’a taşı (gereksiz effect azalt)
- [ ] Non-urgent state güncellemelerinde `startTransition` değerlendir

### E) Render ve Hydration

- [ ] Büyük listelerde `content-visibility` gibi teknikleri değerlendir
- [ ] Statik JSX parçalarını component dışına taşı
- [ ] Beklenen hydration farklarında kontrollü yaklaşım kullan
- [ ] Koşullu render’larda belirsiz desenlerden kaçın (okunur, deterministik ifade kullan)

### F) Görsel, Font, Medya

- [ ] Tüm büyük görseller optimize formatta mı (WebP/AVIF)?
- [ ] Görsellerde boyut bilgisi net mi (`width`/`height` veya eşdeğer)?
- [ ] LCP görseli için öncelik stratejisi doğru mu?
- [ ] Kritik olmayan medya lazy yükleniyor mu?
- [ ] Font sayısı/ağırlığı gereğinden fazla mı?

### G) Hata Azaltma ve Dayanıklılık

- [ ] Ağ hataları için tutarlı hata yönetimi var mı?
- [ ] Boş veri/null durumları UI’da güvenli karşılanıyor mu?
- [ ] API dönüşleri şema/doğrulama kontrolünden geçiyor mu?
- [ ] Admin aksiyonlarında yetki ve input doğrulama net mi?

## 4) Doğrulama (Her Sayfa Sonu)

- [ ] `npm run lint` hatasız
- [ ] `npm run build` hatasız
- [ ] Sayfa manuel smoke test: yükleme, etkileşim, form, locale geçişi
- [ ] Performans metriği önce/sonra karşılaştırması arşivlendi
- [ ] Görsel veya davranış regresyonu yok

## 5) Kabul Kriteri

- [ ] Sayfada en az bir kritik darboğaz giderildi (waterfall/bundle/render)
- [ ] Kullanıcı akışı bozulmadı
- [ ] Ölçümde net iyileşme görüldü veya teknik olarak gerekçelendirildi
- [ ] Yapılan değişiklik kısa not ile dokümante edildi

## 6) Kopyalanabilir Sayfa Şablonu

```md
## Sayfa: <route>

- Dosya: <path>
- Sorumlu: <isim>
- Tarih: <YYYY-MM-DD>

### Önce (Baseline)
- LCP:
- INP:
- CLS:
- TTFB:
- JS payload:

### Yapılan İyileştirmeler
- [ ] Waterfall
- [ ] Bundle
- [ ] Server cache/serialization
- [ ] Re-render
- [ ] Hydration/render
- [ ] Görsel/font
- [ ] Hata yönetimi

### Sonra (After)
- LCP:
- INP:
- CLS:
- TTFB:
- JS payload:

### Not
- Risk:
- Geri alma planı:
- Sonuç:
```

## 7) Uygulanan Sayfa Optimizasyonları (2026-03-05)

### Sayfa: `/{locale}` (Ana Sayfa)
- Dosya: `src/app/(localized)/[locale]/page.tsx`
- Yapılanlar:
  - [x] Bundle: `HomepagePopupForm` ve `StyledVideoPlayer` dynamic import ile ayrıldı.
  - [x] Görsel/font: Hero, kategori, servis, highlight, blog ve testimonial görselleri `next/image` ile optimize edildi.
  - [x] Görsel/font: Testimonial embed iframe’lerine `loading="lazy"` eklendi.
- Not: Baseline/after metrik ölçümü bekliyor.

### Sayfa: `/{locale}/proje/[slug]` (Proje Detay)
- Dosya: `src/app/(localized)/[locale]/proje/[slug]/page.tsx`
- Yapılanlar:
  - [x] Bundle: `Visuals`, `MapAndCTA`, `ProjectGalleryHub` dynamic import ile ayrıldı.
  - [x] Waterfall/Render: Bu bloklar `Suspense` sınırları içinde parçalandı.
- Not: Baseline/after metrik ölçümü bekliyor.

### Sayfa: `/{locale}/portfoy` (Portföy)
- Dosya: `src/app/(localized)/[locale]/portfoy/page.tsx`
- Yapılanlar:
  - [x] Bundle: `PortfolioClient` dynamic import ile route-level yük ayrıştırması yapıldı.
- Not: Baseline/after metrik ölçümü bekliyor.

### Sayfa: `/{locale}/ilan/[slug]` (İlan Detay)
- Dosya: `src/app/(localized)/[locale]/ilan/[slug]/page.tsx`
- Yapılanlar:
  - [x] Server cache/serialization: Benzer ilan sorgusunda `include` yerine dar `select` kullanıldı.
  - [x] Server cache/serialization: Görsel seçiminde yalnızca `IMAGE` + `take: 1` alındı.
  - [x] Waterfall/Query cost: Benzer aday sorgusu `take: 36` -> `take: 24` düşürüldü.
- Not: Baseline/after metrik ölçümü bekliyor.

### Sayfa: `/admin` (Dashboard)
- Dosya: `src/app/(non-localized)/admin/page.tsx`
- Yapılanlar:
  - [x] Server cache/serialization: Son ilanlar sorgusu dar `select` ile optimize edildi (`title` dışında translation alanları kaldırıldı).
- Not: Baseline/after metrik ölçümü bekliyor.

### Sayfa: `/admin/ilanlar` (İlan Yönetimi)
- Dosya: `src/app/(non-localized)/admin/ilanlar/page.tsx`
- Yapılanlar:
  - [x] Server cache/serialization: Liste sorgusu dar `select` + `media` için `IMAGE`/`take: 1`.
  - [x] Render/Hydration: Harita payload’u yalnızca `view=map` iken oluşturuluyor.
  - [x] Render/Hydration: `ListingsMapView` yalnızca map açıkken render ediliyor.
- Not: Baseline/after metrik ölçümü bekliyor.

### Sayfa: `/admin/projeler` (Proje Yönetimi)
- Dosya: `src/app/(non-localized)/admin/projeler/page.tsx`
- Yapılanlar:
  - [x] Server cache/serialization: Proje listesi sorgusu dar `select` ile optimize edildi.
- Not: Baseline/after metrik ölçümü bekliyor.

## 8) İkinci Tur (Yeni Skill Uygulaması) - 2026-03-05

### Kullanılan Skill Seti
- [x] `vercel-react-best-practices`
- [x] `next-best-practices`
- [x] `vercel-composition-patterns`

### Uygulanan Ek İyileştirmeler

#### A) Next.js Dosya Konvansiyonu (next-best-practices)
- [x] `middleware.ts` -> `proxy.ts` migration yapıldı.
- [x] Exportlar Next.js 16 formatına taşındı: `middleware`/`config` -> `proxy`/`proxyConfig`.
- Etki: Build sırasında gelen middleware deprecation uyarısı giderildi.

#### B) Composition Refactor (vercel-composition-patterns)
- [x] `ListingsMapView` bileşenindeki `open` boolean prop kaldırıldı.
- [x] Map açık/kapalı kontrolü parent route seviyesine taşındı (`/admin/ilanlar`).
- [x] Böylece tek bir “map overlay” varyantı kaldı; boolean mode dallanmaları azaltıldı.
- Etki: Bileşen API’si sadeleşti, koşullu render sorumluluğu netleşti.

#### C) Ek Görsel İyileştirmesi (next-best-practices + vercel-react-best-practices)
- [x] `ListingsMapView` aktif kart görseli `<img>` yerine `next/image` olarak güncellendi.
- Etki: no-img lint uyarısı azaltıldı, responsive image yükleme iyileştirildi.
