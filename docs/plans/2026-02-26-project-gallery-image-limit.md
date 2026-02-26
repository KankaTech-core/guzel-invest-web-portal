# Proje Sayfası Görsel Sınırlama Implementasyon Planı

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Tek proje sayfasında dış ve iç görseller carousel'lerinde en fazla 4 görsel gösterilsin, diğer görsellere "Galeriyi gör" butonu ile erişilebilsin.

**Architecture:** Visuals.tsx bileşeninde PeekingVisualSection için görsel sınırlaması ve galeri butonu eklenecek. Mevcut dispatchOpenConnectedProjectGallery fonksiyonu kullanılarak galeri açılacak.

**Tech Stack:** React, TypeScript, Next.js

---

### Task 1: PeekingVisualSection Bileşenini Güncelle

**Files:**
- Modify: `src/app/(non-localized)/s1/components/Visuals.tsx:114-239`

**Step 1: Props'a totalCount ekle**

PeekingVisualSection fonksiyonunun props'larına `totalCount: number` ekle:

```typescript
interface PeekingVisualSectionProps {
    title: string;
    items: ListingGalleryItem[];
    totalCount: number;
    bgClass: string;
    onImageClick: () => void;
    onViewAllClick: () => void;
    reverse?: boolean;
}
```

**Step 2: Galeri butonunu ekle**

160-164 satırları arasındaki navButtons'a galeri butonu ekle:

```typescript
const showViewAll = totalCount > 4;

const viewAllButton = showViewAll ? (
    <button
        type="button"
        onClick={onViewAllClick}
        className="flex items-center gap-2 rounded-lg bg-gray-900 px-4 py-2 text-sm font-bold text-white transition hover:bg-gray-800"
    >
        Galeriyi Gör (+{totalCount - 4} görsel)
    </button>
) : null;

const navButtons = canNavigate ? (
    <div className="flex items-center gap-3">
        {/* mevcut butonlar */}
        {viewAllButton}
    </div>
) : null;
```

**Step 3: Mobile için de galeri butonu ekle**

214-236 satırları arasındaki mobile navigasyona da butonu ekle:

```typescript
{canNavigate ? (
    <div className="mx-auto mt-4 flex max-w-7xl items-center gap-3 px-4 md:hidden">
        {/* mevcut butonlar */}
        {showViewAll && (
            <button
                type="button"
                onClick={onViewAllClick}
                className="ml-auto flex items-center gap-2 rounded-lg bg-gray-900 px-3 py-2 text-xs font-bold text-white transition hover:bg-gray-800"
            >
                Galeriyi Gör (+{totalCount - 4})
            </button>
        )}
    </div>
) : null}
```

**Step 4: Test için Visuals bileşenini güncelle**

Dosyayı kaydet ve test et.

---

### Task 2: Visuals Bileşenini Güncelle

**Files:**
- Modify: `src/app/(non-localized)/s1/components/Visuals.tsx:357-378`

**Step 1: exteriorGalleryItems için slice ve totalCount hesapla**

261-269 satırları arasını güncelle:

```typescript
const exteriorGalleryItems = useMemo(
    () =>
        buildGalleryItems(
            exteriorVisuals?.images || [],
            "Dış Görseller",
            "project-exterior"
        ),
    [exteriorVisuals?.images]
);

const exteriorDisplayItems = useMemo(
    () => exteriorGalleryItems.slice(0, 4),
    [exteriorGalleryItems]
);

const exteriorTotalCount = exteriorGalleryItems.length;
```

**Step 2: interiorGalleryItems için slice ve totalCount hesapla**

282-290 satırları arasını güncelle:

```typescript
const interiorGalleryItems = useMemo(
    () =>
        buildGalleryItems(
            interiorVisuals?.images || [],
            "İç Görseller",
            "project-interior"
        ),
    [interiorVisuals?.images]
);

const interiorDisplayItems = useMemo(
    () => interiorGalleryItems.slice(0, 4),
    [interiorGalleryItems]
);

const interiorTotalCount = interiorGalleryItems.length;
```

**Step 3: PeekingVisualSection çağrılarını güncelle**

357-366 ve 368-378 satırları arasını güncelle:

```typescript
{visibility.exteriorVisuals && exteriorVisuals && exteriorGalleryItems.length > 0 ? (
    <PeekingVisualSection
        title="Dış Görseller"
        items={exteriorDisplayItems}
        totalCount={exteriorTotalCount}
        bgClass="bg-white"
        onImageClick={() =>
            dispatchOpenConnectedProjectGallery({ key: "exterior" })
        }
        onViewAllClick={() =>
            dispatchOpenConnectedProjectGallery({ key: "exterior" })
        }
    />
) : null}

{visibility.interiorVisuals && interiorVisuals && interiorGalleryItems.length > 0 ? (
    <PeekingVisualSection
        title="İç Görseller"
        items={interiorDisplayItems}
        totalCount={interiorTotalCount}
        bgClass="bg-gray-50"
        reverse
        onImageClick={() =>
            dispatchOpenConnectedProjectGallery({ key: "interior" })
        }
        onViewAllClick={() =>
            dispatchOpenConnectedProjectGallery({ key: "interior" })
        }
    />
) : null}
```

---

### Task 3: Test ve Doğrulama

**Step 1: Uygulamayı çalıştır**

```bash
npm run dev
```

**Step 2: Tarayıcıda test et**

- Bir proje sayfasına git
- Dış görseller bölümünde en fazla 4 görsel olduğunu kontrol et
- 4'ten fazla görsel varsa "Galeriyi Gör" butonunun göründüğünü kontrol et
- Butona basınca galerinin açıldığını ve Dış sekmesinin aktif olduğunu doğrula
- Aynı kontrolü İç görseller için de yap

---

### Task 4: Commit

```bash
git add src/app/(non-localized)/s1/components/Visuals.tsx
git commit -m "feat: limit carousel images to 4, add view all gallery button"
```
