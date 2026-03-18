export interface PeekingPreviewImageItem {
    id: string;
    src: string;
    alt: string;
}

export type PeekingPreviewCard =
    | { type: "image"; item: PeekingPreviewImageItem }
    | { type: "view-all"; id: string; label: string };

export const buildPeekingPreviewItems = (
    items: PeekingPreviewImageItem[],
    label = "View All"
): PeekingPreviewCard[] => {
    if (items.length === 0) {
        return [];
    }

    return [
        ...items.map((item) => ({ type: "image" as const, item })),
        {
            type: "view-all" as const,
            id: "__peeking-view-all__",
            label,
        },
    ];
};
