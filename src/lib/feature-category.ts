export type FeatureCategory = "GENERAL" | "SOCIAL";

const normalizeText = (value: string): string =>
    value
        .toLocaleLowerCase("tr-TR")
        .normalize("NFD")
        .replace(/\p{Diacritic}/gu, "")
        .replace(/[^a-z0-9\s]/g, " ")
        .replace(/\s+/g, " ")
        .trim();

const GENERAL_KEYWORDS = [
    "otopark",
    "asansor",
    "guvenlik",
    "jenerator",
    "kamera",
    "kapi gorevlisi",
    "site gorevlisi",
    "yangin",
    "interkom",
    "su deposu",
    "isi yalitim",
    "ses yalitim",
    "merkezi isitma",
    "dogalgaz",
    "altyapi",
    "depo",
    "cift asansor",
];

const SOCIAL_KEYWORDS = [
    "havuz",
    "aqua",
    "bilardo",
    "fitness",
    "spor salonu",
    "sauna",
    "hamam",
    "spa",
    "cocuk oyun",
    "oyun alani",
    "basketbol",
    "voleybol",
    "tenis",
    "futbol",
    "yuruyus",
    "sinema",
    "kafeterya",
    "barbeku",
    "hobi",
    "pilates",
];

const scoreByKeywords = (text: string, keywords: string[]): number =>
    keywords.reduce((score, keyword) => score + (text.includes(keyword) ? 1 : 0), 0);

export const categorizeFeature = (feature: string): FeatureCategory => {
    const normalized = normalizeText(feature);
    if (!normalized) return "SOCIAL";

    const generalScore = scoreByKeywords(normalized, GENERAL_KEYWORDS);
    const socialScore = scoreByKeywords(normalized, SOCIAL_KEYWORDS);

    if (generalScore > socialScore) return "GENERAL";
    return "SOCIAL";
};

export const splitFeaturesByCategory = (features: string[]) =>
    features.reduce<{ GENERAL: string[]; SOCIAL: string[] }>(
        (acc, feature) => {
            const category = categorizeFeature(feature);
            acc[category].push(feature);
            return acc;
        },
        { GENERAL: [], SOCIAL: [] }
    );
