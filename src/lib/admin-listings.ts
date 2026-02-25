import { ListingStatus, PropertyType, SaleType, type Prisma } from "@/generated/prisma";

export type AdminPlatformFilter = "HEPSIEMLAK" | "SAHIBINDEN";

interface BuildAdminListingsWhereInput {
    status?: ListingStatus;
    query?: string;
    type?: PropertyType;
    saleType?: SaleType;
    company?: string;
    platform?: AdminPlatformFilter;
}

export function buildAdminListingsWhere({
    status,
    query,
    type,
    saleType,
    company,
    platform,
}: BuildAdminListingsWhereInput): Prisma.ListingWhereInput {
    return {
        isProject: false,
        ...(status
            ? { status }
            : { status: { not: "ARCHIVED" as ListingStatus } }),
        ...(query
            ? {
                OR: [
                    {
                        sku: {
                            contains: query,
                            mode: "insensitive" as const,
                        },
                    },
                    {
                        translations: {
                            some: {
                                locale: "tr",
                                title: {
                                    contains: query,
                                    mode: "insensitive" as const,
                                },
                            },
                        },
                    },
                    {
                        city: {
                            contains: query,
                            mode: "insensitive" as const,
                        },
                    },
                    {
                        district: {
                            contains: query,
                            mode: "insensitive" as const,
                        },
                    },
                    {
                        neighborhood: {
                            contains: query,
                            mode: "insensitive" as const,
                        },
                    },
                ],
            }
            : {}),
        ...(type ? { type } : {}),
        ...(saleType ? { saleType } : {}),
        ...(company ? { company } : {}),
        ...(platform === "HEPSIEMLAK" ? { publishToHepsiemlak: true } : {}),
        ...(platform === "SAHIBINDEN" ? { publishToSahibinden: true } : {}),
    };
}
