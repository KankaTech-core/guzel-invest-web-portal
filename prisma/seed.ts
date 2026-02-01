import { PrismaClient, Role, ListingStatus, PropertyType, SaleType } from "../src/generated/prisma";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
    console.log("🌱 Starting seed...");

    // Create admin user
    const adminPasswordHash = await bcrypt.hash("admin123", 10);
    const admin = await prisma.user.upsert({
        where: { email: "admin@guzelinvest.com" },
        update: {},
        create: {
            email: "admin@guzelinvest.com",
            passwordHash: adminPasswordHash,
            name: "Admin User",
            role: Role.ADMIN,
        },
    });
    console.log("✅ Created admin user:", admin.email);

    // Create editor user
    const editorPasswordHash = await bcrypt.hash("editor123", 10);
    const editor = await prisma.user.upsert({
        where: { email: "editor@guzelinvest.com" },
        update: {},
        create: {
            email: "editor@guzelinvest.com",
            passwordHash: editorPasswordHash,
            name: "Editor User",
            role: Role.EDITOR,
        },
    });
    console.log("✅ Created editor user:", editor.email);

    // Create sample listings
    const sampleListings = [
        {
            slug: "luks-villa-alanya-kestel",
            status: ListingStatus.PUBLISHED,
            type: PropertyType.VILLA,
            saleType: SaleType.SALE,
            city: "Antalya",
            district: "Alanya",
            neighborhood: "Kestel",
            latitude: 36.5535,
            longitude: 32.0138,
            price: 450000,
            currency: "EUR",
            area: 280,
            rooms: 6,
            bedrooms: 4,
            bathrooms: 3,
            floor: 0,
            totalFloors: 3,
            buildYear: 2022,
            heating: "Klima",
            furnished: true,
            balcony: true,
            garden: true,
            pool: true,
            parking: true,
            elevator: false,
            security: true,
            seaView: true,
            publishedAt: new Date(),
            createdById: admin.id,
            translations: {
                create: [
                    {
                        locale: "tr",
                        title: "Lüks Deniz Manzaralı Villa",
                        description:
                            "Kestel'de eşsiz deniz manzarasına sahip, özel havuzlu ve bahçeli lüks villa. 4 yatak odası, 3 banyo, tam mobilyalı. Akıllı ev sistemi mevcut.",
                        features: [
                            "Özel Havuz",
                            "Deniz Manzarası",
                            "Akıllı Ev",
                            "Güvenlik",
                            "Otopark",
                        ],
                    },
                    {
                        locale: "en",
                        title: "Luxury Sea View Villa",
                        description:
                            "Luxury villa with stunning sea views in Kestel, featuring private pool and garden. 4 bedrooms, 3 bathrooms, fully furnished. Smart home system available.",
                        features: [
                            "Private Pool",
                            "Sea View",
                            "Smart Home",
                            "Security",
                            "Parking",
                        ],
                    },
                    {
                        locale: "de",
                        title: "Luxusvilla mit Meerblick",
                        description:
                            "Luxusvilla mit atemberaubendem Meerblick in Kestel, mit privatem Pool und Garten. 4 Schlafzimmer, 3 Badezimmer, komplett möbliert. Smart-Home-System verfügbar.",
                        features: [
                            "Privater Pool",
                            "Meerblick",
                            "Smart Home",
                            "Sicherheit",
                            "Parkplatz",
                        ],
                    },
                    {
                        locale: "ar",
                        title: "فيلا فاخرة مع إطلالة بحرية",
                        description:
                            "فيلا فاخرة بإطلالة بحرية مذهلة في كيستيل، مع مسبح خاص وحديقة. 4 غرف نوم، 3 حمامات، مفروشة بالكامل. نظام المنزل الذكي متوفر.",
                        features: ["مسبح خاص", "إطلالة بحرية", "منزل ذكي", "أمان", "موقف سيارات"],
                    },
                ],
            },
        },
        {
            slug: "modern-daire-alanya-merkez",
            status: ListingStatus.PUBLISHED,
            type: PropertyType.APARTMENT,
            saleType: SaleType.SALE,
            city: "Antalya",
            district: "Alanya",
            neighborhood: "Merkez",
            latitude: 36.5449,
            longitude: 31.9974,
            price: 185000,
            currency: "EUR",
            area: 120,
            rooms: 4,
            bedrooms: 2,
            bathrooms: 2,
            floor: 5,
            totalFloors: 12,
            buildYear: 2023,
            heating: "Merkezi",
            furnished: false,
            balcony: true,
            garden: false,
            pool: true,
            parking: true,
            elevator: true,
            security: true,
            seaView: true,
            publishedAt: new Date(),
            createdById: admin.id,
            translations: {
                create: [
                    {
                        locale: "tr",
                        title: "Modern 2+1 Daire Alanya Merkez",
                        description:
                            "Alanya merkezde yeni bitmiş projede modern 2+1 daire. Deniz manzarası, ortak havuz, 24 saat güvenlik. Plaja 5 dakika yürüme mesafesi.",
                        features: [
                            "Ortak Havuz",
                            "Deniz Manzarası",
                            "24 Saat Güvenlik",
                            "Asansör",
                            "Kapalı Otopark",
                        ],
                    },
                    {
                        locale: "en",
                        title: "Modern 2+1 Apartment Alanya Center",
                        description:
                            "Modern 2+1 apartment in a newly completed project in Alanya center. Sea view, shared pool, 24/7 security. 5 minutes walk to beach.",
                        features: [
                            "Shared Pool",
                            "Sea View",
                            "24/7 Security",
                            "Elevator",
                            "Indoor Parking",
                        ],
                    },
                    {
                        locale: "de",
                        title: "Moderne 2+1 Wohnung Alanya Zentrum",
                        description:
                            "Moderne 2+1 Wohnung in einem neu fertiggestellten Projekt im Zentrum von Alanya. Meerblick, Gemeinschaftspool, 24/7 Sicherheit. 5 Minuten zu Fuß zum Strand.",
                        features: [
                            "Gemeinschaftspool",
                            "Meerblick",
                            "24/7 Sicherheit",
                            "Aufzug",
                            "Tiefgarage",
                        ],
                    },
                    {
                        locale: "ar",
                        title: "شقة حديثة 2+1 في وسط ألانيا",
                        description:
                            "شقة حديثة 2+1 في مشروع مكتمل حديثاً في وسط ألانيا. إطلالة بحرية، مسبح مشترك، أمان على مدار الساعة. 5 دقائق سيراً على الأقدام إلى الشاطئ.",
                        features: [
                            "مسبح مشترك",
                            "إطلالة بحرية",
                            "أمان 24/7",
                            "مصعد",
                            "موقف داخلي",
                        ],
                    },
                ],
            },
        },
        {
            slug: "yatirimlik-arsa-alanya-mahmutlar",
            status: ListingStatus.PUBLISHED,
            type: PropertyType.LAND,
            saleType: SaleType.SALE,
            city: "Antalya",
            district: "Alanya",
            neighborhood: "Mahmutlar",
            latitude: 36.4778,
            longitude: 32.0889,
            price: 350000,
            currency: "EUR",
            area: 1500,
            rooms: null,
            bedrooms: null,
            bathrooms: null,
            floor: null,
            totalFloors: null,
            buildYear: null,
            heating: null,
            furnished: false,
            balcony: false,
            garden: false,
            pool: false,
            parking: false,
            elevator: false,
            security: false,
            seaView: true,
            publishedAt: new Date(),
            createdById: admin.id,
            translations: {
                create: [
                    {
                        locale: "tr",
                        title: "Yatırımlık Deniz Manzaralı Arsa",
                        description:
                            "Mahmutlar'da deniz manzaralı, imarlı arsa. 1500 m², konut imarlı. Merkeze yakın konumda, altyapı hazır.",
                        features: ["Deniz Manzarası", "İmarlı", "Altyapı Hazır", "Merkeze Yakın"],
                    },
                    {
                        locale: "en",
                        title: "Investment Land with Sea View",
                        description:
                            "Sea view land with building permit in Mahmutlar. 1500 m², residential zoning. Close to center, infrastructure ready.",
                        features: [
                            "Sea View",
                            "Building Permit",
                            "Infrastructure Ready",
                            "Near Center",
                        ],
                    },
                    {
                        locale: "de",
                        title: "Investitionsgrundstück mit Meerblick",
                        description:
                            "Grundstück mit Meerblick und Baugenehmigung in Mahmutlar. 1500 m², Wohnbebauung. Zentrumsnah, Infrastruktur vorhanden.",
                        features: [
                            "Meerblick",
                            "Baugenehmigung",
                            "Infrastruktur vorhanden",
                            "Zentrumsnah",
                        ],
                    },
                    {
                        locale: "ar",
                        title: "أرض استثمارية مع إطلالة بحرية",
                        description:
                            "أرض بإطلالة بحرية مع تصريح بناء في محمتلار. 1500 م²، منطقة سكنية. قريبة من المركز، البنية التحتية جاهزة.",
                        features: [
                            "إطلالة بحرية",
                            "تصريح بناء",
                            "بنية تحتية جاهزة",
                            "قريب من المركز",
                        ],
                    },
                ],
            },
        },
    ];

    for (const listing of sampleListings) {
        const created = await prisma.listing.upsert({
            where: { slug: listing.slug },
            update: {},
            create: listing,
        });
        console.log("✅ Created listing:", created.slug);
    }

    console.log("🌱 Seed completed!");
}

main()
    .catch((e) => {
        console.error("❌ Seed error:", e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
