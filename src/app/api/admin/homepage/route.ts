import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
    HOMEPAGE_HERO_SLOT_LIMIT,
    HOMEPAGE_HERO_SLOTS,
} from "@/lib/homepage-hero-listings";
import {
    HOMEPAGE_PROJECT_LIMIT,
    HOMEPAGE_PROJECT_SLOTS,
} from "@/lib/homepage-project-carousel";
import { extractYoutubeVideoId, resolveHomepageHeroVideo } from "@/lib/homepage-video";

export const dynamic = "force-dynamic";

const HOMEPAGE_SETTING_ID = "default";
const TITLE_SELECTION = {
    where: { locale: "tr" },
    take: 1,
    select: {
        title: true,
    },
} as const;

const UpdateHomepageSchema = z
    .object({
        videoUrl: z.string().optional(),
        listingIds: z
            .array(z.string().min(1))
            .min(1, "Ana sayfada en az 1 ilan kalmalıdır.")
            .max(HOMEPAGE_HERO_SLOT_LIMIT)
            .optional(),
        projectIds: z
            .array(z.string().min(1))
            .min(1, "Ana sayfada en az 1 proje kalmalıdır.")
            .max(HOMEPAGE_PROJECT_LIMIT)
            .optional(),
    })
    .refine(
        (data) =>
            data.videoUrl !== undefined ||
            data.listingIds !== undefined ||
            data.projectIds !== undefined,
        {
            message: "En az bir alan güncellenmelidir.",
            path: ["videoUrl"],
        }
    );

interface HomepageListItem {
    id: string;
    slug: string;
    sku: string | null;
    title: string;
    imageUrl: string | null;
    slot: number | null;
}

interface VideoNormalizationResult {
    ok: boolean;
    value?: string | null;
    error?: string;
}

const unique = (items: string[]) => Array.from(new Set(items));

const normalizeVideoInput = (
    videoInput: string | undefined
): VideoNormalizationResult => {
    if (videoInput === undefined) {
        return { ok: true, value: undefined };
    }

    const trimmed = videoInput.trim();
    if (!trimmed) {
        return { ok: true, value: null };
    }

    const videoId = extractYoutubeVideoId(trimmed);
    if (!videoId) {
        return {
            ok: false,
            error:
                "Geçerli bir YouTube bağlantısı veya iframe kodu girin.",
        };
    }

    return {
        ok: true,
        value: `https://www.youtube.com/embed/${videoId}`,
    };
};

const mapHomepageItem = (
    item: {
        id: string;
        slug: string;
        sku: string | null;
        translations: Array<{ title: string }>;
        media?: Array<{ url: string; thumbnailUrl: string | null }>;
    },
    slot: number | null
): HomepageListItem => ({
    id: item.id,
    slug: item.slug,
    sku: item.sku,
    title: item.translations[0]?.title?.trim() || item.slug,
    imageUrl: item.media?.[0]?.thumbnailUrl || item.media?.[0]?.url || null,
    slot,
});

const buildHomepagePayload = async () => {
    const [setting, selectedListings, selectedProjects] = await Promise.all([
        prisma.homepageSetting.findUnique({ where: { id: HOMEPAGE_SETTING_ID } }),
        prisma.listing.findMany({
            where: {
                status: "PUBLISHED",
                isProject: false,
                homepageHeroSlot: { in: [...HOMEPAGE_HERO_SLOTS] },
            },
            select: {
                id: true,
                slug: true,
                sku: true,
                homepageHeroSlot: true,
                translations: TITLE_SELECTION,
                media: { take: 1, orderBy: { order: "asc" }, select: { url: true, thumbnailUrl: true } },
            },
            orderBy: { homepageHeroSlot: "asc" },
        }),
        prisma.listing.findMany({
            where: {
                status: "PUBLISHED",
                isProject: true,
                homepageProjectSlot: { in: [...HOMEPAGE_PROJECT_SLOTS] },
            },
            select: {
                id: true,
                slug: true,
                sku: true,
                homepageProjectSlot: true,
                translations: TITLE_SELECTION,
                media: { take: 1, orderBy: { order: "asc" }, select: { url: true, thumbnailUrl: true } },
            },
            orderBy: { homepageProjectSlot: "asc" },
        }),
    ]);

    const selectedListingIds = selectedListings.map((item) => item.id);
    const selectedProjectIds = selectedProjects.map((item) => item.id);

    const [availableListings, availableProjects] = await Promise.all([
        prisma.listing.findMany({
            where: {
                status: "PUBLISHED",
                isProject: false,
                ...(selectedListingIds.length > 0
                    ? { id: { notIn: selectedListingIds } }
                    : {}),
            },
            select: {
                id: true,
                slug: true,
                sku: true,
                translations: TITLE_SELECTION,
                media: { take: 1, orderBy: { order: "asc" }, select: { url: true, thumbnailUrl: true } },
            },
            orderBy: [{ updatedAt: "desc" }, { createdAt: "desc" }],
            take: 40,
        }),
        prisma.listing.findMany({
            where: {
                status: "PUBLISHED",
                isProject: true,
                ...(selectedProjectIds.length > 0
                    ? { id: { notIn: selectedProjectIds } }
                    : {}),
            },
            select: {
                id: true,
                slug: true,
                sku: true,
                translations: TITLE_SELECTION,
                media: { take: 1, orderBy: { order: "asc" }, select: { url: true, thumbnailUrl: true } },
            },
            orderBy: [{ updatedAt: "desc" }, { createdAt: "desc" }],
            take: 40,
        }),
    ]);

    const resolvedVideo = resolveHomepageHeroVideo(setting?.heroVideoUrl);

    return {
        video: {
            rawInput: setting?.heroVideoUrl || resolvedVideo.rawInput,
            watchUrl: resolvedVideo.watchUrl,
            autoplayEmbedUrl: resolvedVideo.autoplayEmbedUrl,
            popupEmbedUrl: resolvedVideo.popupEmbedUrl,
            videoId: resolvedVideo.videoId,
        },
        listings: {
            selected: selectedListings.map((item) =>
                mapHomepageItem(item, item.homepageHeroSlot)
            ),
            available: availableListings.map((item) => mapHomepageItem(item, null)),
            limit: HOMEPAGE_HERO_SLOT_LIMIT,
        },
        projects: {
            selected: selectedProjects.map((item) =>
                mapHomepageItem(item, item.homepageProjectSlot)
            ),
            available: availableProjects.map((item) => mapHomepageItem(item, null)),
            limit: HOMEPAGE_PROJECT_LIMIT,
        },
    };
};

const validateIds = async ({
    ids,
    isProject,
}: {
    ids: string[];
    isProject: boolean;
}): Promise<boolean> => {
    if (ids.length === 0) {
        return false;
    }

    const records = await prisma.listing.findMany({
        where: {
            id: { in: ids },
            isProject,
            status: "PUBLISHED",
        },
        select: { id: true },
    });

    return records.length === ids.length;
};

export async function GET() {
    try {
        const session = await getSession();

        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const payload = await buildHomepagePayload();
        return NextResponse.json(payload);
    } catch (error) {
        console.error("Admin homepage GET error:", error);
        return NextResponse.json(
            { error: "Ana sayfa ayarları yüklenemedi." },
            { status: 500 }
        );
    }
}

export async function PATCH(request: NextRequest) {
    try {
        const session = await getSession();

        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        if (session.role === "VIEWER") {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        const body = await request.json().catch(() => ({}));
        const parsed = UpdateHomepageSchema.safeParse(body);

        if (!parsed.success) {
            return NextResponse.json(
                {
                    error: "Geçersiz ana sayfa güncelleme isteği.",
                    issues: parsed.error.flatten(),
                },
                { status: 400 }
            );
        }

        const listingIds =
            parsed.data.listingIds !== undefined
                ? unique(parsed.data.listingIds)
                : undefined;
        const projectIds =
            parsed.data.projectIds !== undefined
                ? unique(parsed.data.projectIds)
                : undefined;

        if (listingIds && listingIds.length !== parsed.data.listingIds?.length) {
            return NextResponse.json(
                { error: "Aynı ilan birden fazla kez seçilemez." },
                { status: 400 }
            );
        }

        if (projectIds && projectIds.length !== parsed.data.projectIds?.length) {
            return NextResponse.json(
                { error: "Aynı proje birden fazla kez seçilemez." },
                { status: 400 }
            );
        }

        const normalizedVideoInput = normalizeVideoInput(parsed.data.videoUrl);
        if (!normalizedVideoInput.ok) {
            return NextResponse.json(
                { error: normalizedVideoInput.error },
                { status: 400 }
            );
        }

        const [validListings, validProjects] = await Promise.all([
            listingIds
                ? validateIds({ ids: listingIds, isProject: false })
                : Promise.resolve(true),
            projectIds
                ? validateIds({ ids: projectIds, isProject: true })
                : Promise.resolve(true),
        ]);

        if (!validListings) {
            return NextResponse.json(
                {
                    error:
                        "Seçilen ilanlardan en az biri bulunamadı veya yayında değil.",
                },
                { status: 400 }
            );
        }

        if (!validProjects) {
            return NextResponse.json(
                {
                    error:
                        "Seçilen projelerden en az biri bulunamadı veya yayında değil.",
                },
                { status: 400 }
            );
        }

        await prisma.$transaction(async (tx) => {
            if (normalizedVideoInput.value !== undefined) {
                await tx.homepageSetting.upsert({
                    where: { id: HOMEPAGE_SETTING_ID },
                    update: {
                        heroVideoUrl: normalizedVideoInput.value,
                    },
                    create: {
                        id: HOMEPAGE_SETTING_ID,
                        heroVideoUrl: normalizedVideoInput.value,
                    },
                });
            }

            if (listingIds) {
                await tx.listing.updateMany({
                    where: {
                        isProject: false,
                        homepageHeroSlot: { not: null },
                    },
                    data: {
                        homepageHeroSlot: null,
                        showOnHomepageHero: false,
                    },
                });

                for (const [index, listingId] of listingIds.entries()) {
                    await tx.listing.update({
                        where: { id: listingId },
                        data: {
                            homepageHeroSlot: index + 1,
                            showOnHomepageHero: true,
                        },
                    });
                }
            }

            if (projectIds) {
                await tx.listing.updateMany({
                    where: {
                        isProject: true,
                        homepageProjectSlot: { not: null },
                    },
                    data: {
                        homepageProjectSlot: null,
                        showOnHomepageHero: false,
                    },
                });

                for (const [index, projectId] of projectIds.entries()) {
                    await tx.listing.update({
                        where: { id: projectId },
                        data: {
                            homepageProjectSlot: index + 1,
                            showOnHomepageHero: true,
                        },
                    });
                }
            }
        });

        const payload = await buildHomepagePayload();
        return NextResponse.json(payload);
    } catch (error) {
        console.error("Admin homepage PATCH error:", error);
        return NextResponse.json(
            { error: "Ana sayfa ayarları güncellenemedi." },
            { status: 500 }
        );
    }
}
