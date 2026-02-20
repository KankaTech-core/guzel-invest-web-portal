# Locale Yönlendirme Sorunu Çözümü

## Sorun

`/s1`, `/s2` gibi sayfalara erişmeye çalışıldığında, sistem otomatik olarak kullanıcıyı `/tr/s1`, `/tr/s2` gibi localizasyon eklenmiş URL'lere yönlendiriyordu.

## Neden Oluyordu?

Proje `next-intl` kütüphanesini kullanarak çoklu dil desteği sağlıyor. Middleware katmanında tüm istekler `intlMiddleware` tarafından işleniyor ve varsayılan dil (`tr`) URL'ye ekleniyordu.

### Middleware Yapısı

```typescript
// src/middleware.ts
const intlMiddleware = createMiddleware(routing);

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Belirli route'lar intl'den muaf tutuluyor
    if (
        pathname.startsWith("/admin") ||
        pathname.startsWith("/api") ||
        /^\/(?:p|s)?(?:10|[1-9])(\/|$)/.test(pathname)
    ) {
        return NextResponse.next();
    }

    return intlMiddleware(request);
}
```

### intlMiddleware Nasıl Çalışır?

1. Gelen isteğin pathname'ini kontrol eder
2. Eğer pathname'de locale yoksa (`/s1` gibi), varsayılan locale'i ekler (`/tr/s1`)
3. `localePrefix: "always"` ayarı nedeniyle her zaman locale prefix'i zorunlu kılınır

### Eski Regex Pattern'i

```regex
/^\/(?:p)?(?:10|[1-9])(\/|$)/
```

Bu pattern sadece:
- `/p1` - `/p10`
- `/1` - `/10`

gibi path'leri karşılıyordu. `/s1` bu pattern'e uymadığı için `intlMiddleware` tarafından işleniyor ve yönlendiriliyordu.

## Çözüm

Middleware'deki regex pattern'ini güncelleyerek `s` önekli sayısal sayfaları da intl routing'den muaf tuttuk.

### Yeni Regex Pattern

```regex
/^\/(?:p|s)?(?:10|[1-9])(\/|$)/
```

Bu pattern şimdi şu path'leri karşılıyor:
- `/p1` - `/p10` (p önekli)
- `/s1` - `/s10` (s önekli)
- `/1` - `/10` (öneksiz)

### Değişiklik

```diff
- /^\/(?:p)?(?:10|[1-9])(\/|$)/.test(pathname)
+ /^\/(?:p|s)?(?:10|[1-9])(\/|$)/.test(pathname)
```

## Proje Yapısı

```
src/
├── app/
│   ├── (localized)/          # Dil desteği olan sayfalar
│   │   └── [locale]/
│   │       ├── page.tsx      # /tr, /en, /de, /ru
│   │       ├── portfoy/
│   │       └── ...
│   └── (non-localized)/      # Dil desteği olmayan sayfalar
│       ├── s1/               # /s1 (artık yönlendirilmiyor)
│       ├── p1/               # /p1
│       └── ...
├── i18n/
│   └── routing.ts            # Dil routing konfigürasyonu
└── middleware.ts             # Yönlendirme middleware'i
```

## Test

Değişiklikten sonra:
- ✅ `/s1` → `/s1` (yönlendirme yok)
- ✅ `/s2` → `/s2` (yönlendirme yok)
- ✅ `/p1` → `/p1` (yönlendirme yok)
- ✅ `/hakkimizda` → `/tr/hakkimizda` (hala yönlendirme var)

## Ek Notlar

- Eğer gelecekte başka önekler eklenirse (örn: `d1`, `d2`), regex pattern'i güncellenmeli
- `(non-localized)` route group'u bu sayfaların otomatik olarak locale parametresi almadığını gösterir
- `localePrefix: "always"` ayarı değiştirilirse farklı bir yaklaşım gerekebilir
