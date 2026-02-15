import { redirect, notFound } from "next/navigation";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ListingForm } from "@/components/admin/listing-form";

interface EditListingPageProps {
    params: Promise<{ id: string }>;
}

export default async function EditListingPage({ params }: EditListingPageProps) {
    const session = await getSession();
    const { id } = await params;

    if (!session) {
        redirect("/admin/login");
    }

    const listing = await prisma.listing.findUnique({
        where: { id },
        include: {
            translations: true,
            media: {
                orderBy: { order: "asc" },
            },
            tags: {
                include: {
                    tag: true,
                },
            },
        },
    });

    if (!listing) {
        notFound();
    }

    // Transform Prisma data to match form interface
    const formData = {
        id: listing.id,
        slug: listing.slug,
        sku: listing.sku,
        status: listing.status,
        type: listing.type,
        saleType: listing.saleType,
        company: listing.company,
        city: listing.city,
        district: listing.district,
        neighborhood: listing.neighborhood,
        address: listing.address,
        googleMapsLink: listing.googleMapsLink,
        latitude: listing.latitude,
        longitude: listing.longitude,
        price: Number(listing.price),
        currency: listing.currency,
        area: listing.area,
        rooms: listing.rooms,
        bedrooms: listing.bedrooms,
        bathrooms: listing.bathrooms,
        wcCount: listing.wcCount,
        floor: listing.floor,
        totalFloors: listing.totalFloors,
        buildYear: listing.buildYear,
        heating: listing.heating,
        furnished: listing.furnished,
        balcony: listing.balcony,
        garden: listing.garden,
        pool: listing.pool,
        parking: listing.parking,
        elevator: listing.elevator,
        security: listing.security,
        seaView: listing.seaView,
        // Land-specific fields
        parcelNo: listing.parcelNo,
        emsal: listing.emsal,
        zoningStatus: listing.zoningStatus,
        // Commercial-specific fields
        groundFloorArea: listing.groundFloorArea,
        basementArea: listing.basementArea,
        // Farm-specific fields
        hasWaterSource: listing.hasWaterSource,
        hasFruitTrees: listing.hasFruitTrees,
        existingStructure: listing.existingStructure,
        // Eligibility fields
        citizenshipEligible: listing.citizenshipEligible,
        residenceEligible: listing.residenceEligible,
        publishToHepsiemlak: listing.publishToHepsiemlak,
        publishToSahibinden: listing.publishToSahibinden,
        homepageHeroSlot: listing.homepageHeroSlot as 1 | 2 | 3 | null,
        translations: listing.translations.map((t) => ({
            id: t.id,
            locale: t.locale,
            title: t.title,
            description: t.description,
            features: t.features,
        })),
        media: listing.media.map((m) => ({
            id: m.id,
            url: m.url,
            thumbnailUrl: m.thumbnailUrl,
            order: m.order,
            isCover: m.isCover,
        })),
        tags: listing.tags.map((lt) => ({
            id: lt.tag.id,
            name: lt.tag.name,
            color: lt.tag.color,
        })),
    };

    return <ListingForm listing={formData} />;
}
