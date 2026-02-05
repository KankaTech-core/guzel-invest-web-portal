export interface MockListing {
    id: string;
    title: string;
    location: string;
    description: string;
    price: number;
    priceLabel: string;
    currency: string;
    sqm: number;
    rooms: string;
    bedrooms: number;
    bathrooms: number;
    propertyType: "VILLA" | "APARTMENT" | "LAND" | "COMMERCIAL";
    saleType: "SALE" | "RENT";
    images: string[];
    badges: string[];
    featured: boolean;
}

export const mockListings: MockListing[] = [
    {
        id: "1",
        title: "Deniz Manzaralı Lüks Villa",
        location: "Kargıcak, Alanya",
        description:
            "Akdeniz'in eşsiz manzarasına sahip, özel havuzlu modern villa. Geniş teraslar ve premium iç mekan tasarımı ile yaşamın keyfini çıkarın.",
        price: 850000,
        priceLabel: "850.000",
        currency: "€",
        sqm: 320,
        rooms: "5+1",
        bedrooms: 5,
        bathrooms: 4,
        propertyType: "VILLA",
        saleType: "SALE",
        images: [
            "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=600&fit=crop",
            "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&h=600&fit=crop",
            "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800&h=600&fit=crop",
        ],
        badges: ["Vatandaşlık", "Deniz Manzarası"],
        featured: true,
    },
    {
        id: "2",
        title: "Merkezi Konumda Residence Daire",
        location: "Mahmutlar, Alanya",
        description:
            "Plaja yürüme mesafesinde, tam donanımlı residence dairesi. Havuz, fitness ve 24 saat güvenlik imkanları.",
        price: 195000,
        priceLabel: "195.000",
        currency: "€",
        sqm: 110,
        rooms: "2+1",
        bedrooms: 2,
        bathrooms: 1,
        propertyType: "APARTMENT",
        saleType: "SALE",
        images: [
            "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&h=600&fit=crop",
            "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=600&fit=crop",
        ],
        badges: ["Oturma İzni"],
        featured: false,
    },
    {
        id: "3",
        title: "Panoramik Villa - Tepe Konumu",
        location: "Bektaş, Alanya",
        description:
            "360 derece panoramik manzaraya sahip, doğayla iç içe lüks villa. Infinity havuz ve geniş bahçe.",
        price: 1250000,
        priceLabel: "1.250.000",
        currency: "€",
        sqm: 450,
        rooms: "6+2",
        bedrooms: 6,
        bathrooms: 5,
        propertyType: "VILLA",
        saleType: "SALE",
        images: [
            "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&h=600&fit=crop",
            "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&h=600&fit=crop",
        ],
        badges: ["Vatandaşlık", "Panoramik"],
        featured: true,
    },
    {
        id: "4",
        title: "Sahil Yolu Üzeri Daire",
        location: "Oba, Alanya",
        description:
            "Denize sıfır konumda, yeni teslim edilmiş modern daire. Yüksek kalite malzeme ve işçilik.",
        price: 285000,
        priceLabel: "285.000",
        currency: "€",
        sqm: 140,
        rooms: "3+1",
        bedrooms: 3,
        bathrooms: 2,
        propertyType: "APARTMENT",
        saleType: "SALE",
        images: [
            "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop",
            "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800&h=600&fit=crop",
        ],
        badges: ["Vatandaşlık"],
        featured: false,
    },
    {
        id: "5",
        title: "Yatırımlık Arsa - İmarlı",
        location: "Kestel, Alanya",
        description:
            "Konut imarlı, altyapısı hazır yatırım fırsatı. Deniz manzaralı, merkeze yakın lokasyon.",
        price: 320000,
        priceLabel: "320.000",
        currency: "€",
        sqm: 850,
        rooms: "-",
        bedrooms: 0,
        bathrooms: 0,
        propertyType: "LAND",
        saleType: "SALE",
        images: [
            "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&h=600&fit=crop",
        ],
        badges: ["Yatırımlık"],
        featured: false,
    },
    {
        id: "6",
        title: "Butik Otel - Tam Faal",
        location: "Alanya Merkez",
        description:
            "12 odalı butik otel, tam faal işletme. Denize 50 metre, yüksek doluluk oranı.",
        price: 2800000,
        priceLabel: "2.800.000",
        currency: "€",
        sqm: 680,
        rooms: "12 Oda",
        bedrooms: 12,
        bathrooms: 14,
        propertyType: "COMMERCIAL",
        saleType: "SALE",
        images: [
            "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=600&fit=crop",
            "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800&h=600&fit=crop",
        ],
        badges: ["Ticari", "İşletme"],
        featured: true,
    },
    {
        id: "7",
        title: "Modern Dubleks Villa",
        location: "Tosmur, Alanya",
        description:
            "Çift katlı modern villa, özel bahçe ve havuz. Şehir merkezine 5 dakika mesafede.",
        price: 420000,
        priceLabel: "420.000",
        currency: "€",
        sqm: 220,
        rooms: "4+1",
        bedrooms: 4,
        bathrooms: 3,
        propertyType: "VILLA",
        saleType: "SALE",
        images: [
            "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=800&h=600&fit=crop",
            "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=800&h=600&fit=crop",
        ],
        badges: ["Vatandaşlık"],
        featured: false,
    },
    {
        id: "8",
        title: "Kiralık Lüks Penthouse",
        location: "Cleopatra, Alanya",
        description:
            "Kleopatra plajına yürüme mesafesinde, tam eşyalı penthouse. Teras ve jakuzi mevcut.",
        price: 2500,
        priceLabel: "2.500",
        currency: "€/ay",
        sqm: 180,
        rooms: "3+1",
        bedrooms: 3,
        bathrooms: 2,
        propertyType: "APARTMENT",
        saleType: "RENT",
        images: [
            "https://images.unsplash.com/photo-1600607687644-aac4c3eac7f4?w=800&h=600&fit=crop",
            "https://images.unsplash.com/photo-1600573472550-8090b5e0745e?w=800&h=600&fit=crop",
        ],
        badges: ["Kiralık", "Eşyalı"],
        featured: false,
    },
];

export const propertyTypes = [
    { value: "VILLA", label: "Villa" },
    { value: "APARTMENT", label: "Daire" },
    { value: "LAND", label: "Arsa" },
    { value: "COMMERCIAL", label: "Ticari" },
];

export const locations = [
    "Tümü",
    "Alanya Merkez",
    "Mahmutlar",
    "Kargıcak",
    "Bektaş",
    "Oba",
    "Kestel",
    "Tosmur",
    "Cleopatra",
];

export const roomOptions = ["1+0", "1+1", "2+1", "3+1", "4+1", "5+1", "6+"];
