import OpenAI from "openai";

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

const VISION_MODEL = process.env.OPENAI_MODEL_VISION || "gpt-4o";
const TEXT_MODEL = process.env.OPENAI_MODEL_TEXT || "gpt-4o";

export interface ImageTag {
    tag: string;
    confidence: number;
}

export interface ExtractedFields {
    price?: number;
    currency?: string;
    area?: number;
    rooms?: number;
    bedrooms?: number;
    bathrooms?: number;
    floor?: number;
    totalFloors?: number;
    buildYear?: number;
    heating?: string;
    furnished?: boolean;
    balcony?: boolean;
    garden?: boolean;
    pool?: boolean;
    parking?: boolean;
    elevator?: boolean;
    security?: boolean;
    seaView?: boolean;
    title?: string;
    description?: string;
    features?: string[];
}

export async function tagImage(imageUrl: string): Promise<ImageTag[]> {
    const response = await openai.chat.completions.create({
        model: VISION_MODEL,
        messages: [
            {
                role: "system",
                content: `You are a real estate image analyzer. Analyze the image and return relevant tags.
Return a JSON array of objects with "tag" and "confidence" (0-1) properties.
Focus on: room type (salon, yatak odası, mutfak, banyo, balkon, teras, havuz, bahçe), 
view (deniz manzarası, dağ manzarası, şehir manzarası),
features (mobilyalı, modern, geniş, aydınlık, lüks),
exterior (dış cephe, giriş, otopark).
Only return the JSON array, no other text.`,
            },
            {
                role: "user",
                content: [
                    {
                        type: "image_url",
                        image_url: { url: imageUrl },
                    },
                ],
            },
        ],
        max_tokens: 500,
    });

    const content = response.choices[0]?.message?.content || "[]";

    try {
        // Clean the response (remove markdown code blocks if present)
        const cleanContent = content.replace(/```json\n?|\n?```/g, "").trim();
        return JSON.parse(cleanContent);
    } catch {
        console.error("Failed to parse image tags:", content);
        return [];
    }
}

export async function extractFieldsFromText(text: string): Promise<ExtractedFields> {
    const response = await openai.chat.completions.create({
        model: TEXT_MODEL,
        messages: [
            {
                role: "system",
                content: `You are a real estate listing parser. Extract structured data from the given text.
Return a JSON object with these fields (only include fields that are clearly mentioned):
- price: number (in the mentioned currency)
- currency: string (EUR, USD, TRY, etc.)
- area: number (in m²)
- rooms: number (total rooms including bedrooms)
- bedrooms: number
- bathrooms: number
- floor: number
- totalFloors: number
- buildYear: number
- heating: string (doğalgaz, merkezi, klima, etc.)
- furnished: boolean
- balcony: boolean
- garden: boolean
- pool: boolean
- parking: boolean
- elevator: boolean
- security: boolean
- seaView: boolean
- title: string (a good title for the listing in Turkish)
- description: string (cleaned up description in Turkish)
- features: array of strings (list of features/amenities)

Only return the JSON object, no other text.`,
            },
            {
                role: "user",
                content: text,
            },
        ],
        max_tokens: 1000,
    });

    const content = response.choices[0]?.message?.content || "{}";

    try {
        const cleanContent = content.replace(/```json\n?|\n?```/g, "").trim();
        return JSON.parse(cleanContent);
    } catch {
        console.error("Failed to parse extracted fields:", content);
        return {};
    }
}

export async function translateText(
    text: string,
    targetLocale: "en" | "de" | "ar"
): Promise<string> {
    const languageNames: Record<string, string> = {
        en: "English",
        de: "German",
        ar: "Arabic",
    };

    const response = await openai.chat.completions.create({
        model: TEXT_MODEL,
        messages: [
            {
                role: "system",
                content: `You are a professional real estate translator. Translate the following Turkish text to ${languageNames[targetLocale]}.
Maintain the professional tone suitable for real estate listings.
${targetLocale === "ar" ? "Use Modern Standard Arabic." : ""}
Only return the translated text, no other explanation.`,
            },
            {
                role: "user",
                content: text,
            },
        ],
        max_tokens: 2000,
    });

    return response.choices[0]?.message?.content || text;
}

export async function processListing(
    imageUrls: string[],
    description: string
): Promise<{
    imageTags: Record<string, ImageTag[]>;
    extractedFields: ExtractedFields;
}> {
    // Process images in parallel (max 5 at a time)
    const imageTagPromises = imageUrls.slice(0, 5).map(async (url) => {
        const tags = await tagImage(url);
        return { url, tags };
    });

    const imageResults = await Promise.all(imageTagPromises);
    const imageTags: Record<string, ImageTag[]> = {};
    imageResults.forEach(({ url, tags }) => {
        imageTags[url] = tags;
    });

    // Extract fields from text
    const extractedFields = await extractFieldsFromText(description);

    return {
        imageTags,
        extractedFields,
    };
}

export { openai };
