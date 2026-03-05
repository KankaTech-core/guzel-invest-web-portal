const DOCUMENT_NAME_TAG_PREFIX = "doc-name:";

const isDocumentNameTag = (tag: string) => tag.startsWith(DOCUMENT_NAME_TAG_PREFIX);

const decodeDocumentFileName = (url: string): string | null => {
    const lastSegment = url
        .split(/[?#]/)[0]
        .split("/")
        .pop();

    if (!lastSegment) return null;

    try {
        return decodeURIComponent(lastSegment);
    } catch {
        return lastSegment;
    }
};

export const getDocumentNameTag = (aiTags?: readonly string[] | null): string | null => {
    if (!Array.isArray(aiTags) || aiTags.length === 0) {
        return null;
    }

    for (let index = aiTags.length - 1; index >= 0; index -= 1) {
        const tag = aiTags[index];
        if (!isDocumentNameTag(tag)) continue;

        const value = tag.slice(DOCUMENT_NAME_TAG_PREFIX.length).trim();
        if (value.length > 0) {
            return value;
        }
    }

    return null;
};

export const upsertDocumentNameTag = (
    aiTags: readonly string[] | null | undefined,
    name: string
): string[] => {
    const baseTags = (aiTags || []).filter((tag) => !isDocumentNameTag(tag));
    const normalizedName = name.trim();

    if (normalizedName.length === 0) {
        return baseTags;
    }

    return [...baseTags, `${DOCUMENT_NAME_TAG_PREFIX}${normalizedName}`];
};

export const getDocumentNameFromMedia = ({
    url,
    aiTags,
    fallback = "Belge",
}: {
    url: string;
    aiTags?: readonly string[] | null;
    fallback?: string;
}): string => {
    const customName = getDocumentNameTag(aiTags);
    if (customName) {
        return customName;
    }

    const fileName = decodeDocumentFileName(url);
    if (fileName && fileName.trim().length > 0) {
        return fileName;
    }

    return fallback;
};
