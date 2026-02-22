import { MediaType, Prisma } from "@/generated/prisma";
import {
    type ProjectMediaAssignmentInput,
    type ProjectMediaCategory,
    buildProjectMediaCategoryMap,
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
}
