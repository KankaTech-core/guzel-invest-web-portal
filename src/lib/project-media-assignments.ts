import { MediaType, Prisma } from "@/generated/prisma";
import {
    type ProjectMediaAssignmentInput,
    type ProjectMediaCategory,
    buildProjectMediaCategoryMap,
    getNormalizedProjectMediaAssignments,
    getProvidedProjectMediaCategories,
} from "@/lib/project-media-categories";

export async function replaceProjectMediaAssignments(
    tx: Prisma.TransactionClient,
    listingId: string,
    input: ProjectMediaAssignmentInput
) {
    const providedCategories = getProvidedProjectMediaCategories(input);
    if (providedCategories.length === 0) {
        return;
    }

    await tx.media.updateMany({
        where: {
            listingId,
            category: {
                in: providedCategories,
            },
        },
        data: {
            category: null,
        },
    });

    const mediaCategoryMap = buildProjectMediaCategoryMap(input);
    const mediaIdsByCategory = new Map<ProjectMediaCategory, string[]>();

    mediaCategoryMap.forEach((category, mediaId) => {
        const categoryMediaIds = mediaIdsByCategory.get(category) ?? [];
        categoryMediaIds.push(mediaId);
        mediaIdsByCategory.set(category, categoryMediaIds);
    });

    for (const [category, mediaIds] of mediaIdsByCategory.entries()) {
        if (mediaIds.length === 0) continue;

        await tx.media.updateMany({
            where: {
                listingId,
                id: {
                    in: mediaIds,
                },
            },
            data: {
                category,
                ...(category === "DOCUMENT" ? { type: MediaType.DOCUMENT } : {}),
            },
        });
    }

    // Keep a single deterministic cover image aligned with project exterior order.
    if (input.exteriorMediaIds !== undefined) {
        const normalizedAssignments = getNormalizedProjectMediaAssignments(input);
        const coverMediaId = normalizedAssignments.EXTERIOR[0];

        await tx.media.updateMany({
            where: {
                listingId,
                type: MediaType.IMAGE,
                isCover: true,
            },
            data: {
                isCover: false,
            },
        });

        if (coverMediaId) {
            await tx.media.updateMany({
                where: {
                    listingId,
                    id: coverMediaId,
                    type: MediaType.IMAGE,
                },
                data: {
                    isCover: true,
                },
            });
        }
    }
}
