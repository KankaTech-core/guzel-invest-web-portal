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
        },
    });

    if (!listing) {
        notFound();
    }

    // Transform Prisma data to match form interface
    const formData = {
        id: listing.id,
        slug: listing.slug,
        status: listing.status,
        type: listing.type,
        saleType: listing.saleType,
        city: listing.city,
        district: listing.district,
        neighborhood: listing.neighborhood,
        address: listing.address,
        latitude: listing.latitude,
        longitude: listing.longitude,
        price: Number(listing.price),
        currency: listing.currency,
        area: listing.area,
        rooms: listing.rooms,
        bedrooms: listing.bedrooms,
        bathrooms: listing.bathrooms,
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
    };

    return <ListingForm listing={formData} />;
}
