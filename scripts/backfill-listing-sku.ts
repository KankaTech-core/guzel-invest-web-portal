import { PrismaClient } from "../src/generated/prisma";
import { buildListingSku } from "../src/lib/utils";

const prisma = new PrismaClient();
const DEFAULT_COMPANY = "Güzel Invest";

async function main() {
    const listings = await prisma.listing.findMany({
        where: {
            sku: null,
        },
        select: {
            id: true,
            city: true,
            company: true,
            createdAt: true,
        },
        orderBy: {
            createdAt: "asc",
        },
    });

    for (const listing of listings) {
        await prisma.$transaction(async (tx) => {
            const serial = await tx.listingSerial.create({
                data: {
                    createdAt: listing.createdAt,
                },
            });

            const sku = buildListingSku(
                listing.city,
                serial.id,
                listing.createdAt.getFullYear()
            );
            const company = listing.company || DEFAULT_COMPANY;

            await tx.listing.update({
                where: { id: listing.id },
                data: {
                    sku,
                    company,
                },
            });

            await tx.listingCompanyOption.upsert({
                where: { name: company },
                update: {},
                create: { name: company },
            });
        });
    }

    console.log(`Backfilled ${listings.length} listing(s)`);
}

main()
    .catch((error) => {
        console.error("Backfill failed:", error);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
