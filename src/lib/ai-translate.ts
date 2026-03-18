import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const LOCALE_NAMES: Record<string, string> = {
    en: "English",
    ru: "Russian",
    de: "German",
    ar: "Arabic",
};

/**
 * In-memory cache for translated text. Keyed by `${locale}:${text}`.
 * Entries are kept for the lifetime of the server process (cleared on restart).
 */
const translationCache = new Map<string, string>();

function cacheKey(text: string, locale: string): string {
    return `${locale}:${text}`;
}

/**
 * Translates a single piece of text from Turkish to the target locale using OpenAI.
 * Returns the original text if the locale is Turkish or if the API call fails.
 * Results are cached in memory to avoid duplicate API calls.
 * When `html` is true, the AI preserves all HTML tags and structure.
 */
export async function translateText(
    text: string,
    targetLocale: string,
    { html = false }: { html?: boolean } = {}
): Promise<string> {
    if (!text?.trim()) return text;

    const locale = targetLocale.toLowerCase().split("-")[0];
    if (locale === "tr") return text;
    if (!process.env.OPENAI_API_KEY) return text;

    const key = cacheKey(text, locale);
    const cached = translationCache.get(key);
    if (cached) return cached;

    const langName = LOCALE_NAMES[locale];
    if (!langName) return text;

    const systemPrompt = html
        ? `You are a professional real estate translator. Translate the Turkish HTML content to ${langName}. Preserve ALL HTML tags, attributes, and structure exactly as they are. Only translate the visible text content between the tags. Return ONLY the translated HTML, no quotes, no commentary.`
        : `You are a professional real estate translator. Translate the Turkish text to ${langName}. Return ONLY the translated text, no quotes, no commentary.`;

    try {
        const completion = await openai.chat.completions.create({
            model: process.env.OPENAI_MODEL_TEXT || "gpt-4o",
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: text },
            ],
            temperature: 0.3,
            max_tokens: html ? 8000 : 1000,
        });

        const result = completion.choices[0]?.message?.content?.trim();
        if (result) {
            translationCache.set(key, result);
            return result;
        }
    } catch (error) {
        console.error(`AI translation failed for locale ${locale}:`, error);
    }

    return text;
}

/**
 * Batch-translates multiple text items in a single API call.
 * More efficient than calling translateText individually for related content.
 */
export async function translateBatch(
    items: { key: string; text: string }[],
    targetLocale: string
): Promise<Record<string, string>> {
    const locale = targetLocale.toLowerCase().split("-")[0];
    const result: Record<string, string> = {};

    if (locale === "tr" || !process.env.OPENAI_API_KEY) {
        for (const item of items) {
            result[item.key] = item.text;
        }
        return result;
    }

    // Check cache first, collect uncached items
    const uncached: { key: string; text: string }[] = [];
    for (const item of items) {
        if (!item.text?.trim()) {
            result[item.key] = item.text;
            continue;
        }
        const cached = translationCache.get(cacheKey(item.text, locale));
        if (cached) {
            result[item.key] = cached;
        } else {
            uncached.push(item);
        }
    }

    if (uncached.length === 0) return result;

    const langName = LOCALE_NAMES[locale];
    if (!langName) {
        for (const item of uncached) {
            result[item.key] = item.text;
        }
        return result;
    }

    try {
        const inputJson = Object.fromEntries(
            uncached.map((item) => [item.key, item.text])
        );

        const completion = await openai.chat.completions.create({
            model: process.env.OPENAI_MODEL_TEXT || "gpt-4o",
            messages: [
                {
                    role: "system",
                    content: `You are a professional real estate translator. Translate all values in the provided JSON from Turkish to ${langName}. Keep the keys exactly the same. Return only a JSON object with the same keys and translated values.`,
                },
                { role: "user", content: JSON.stringify(inputJson) },
            ],
            response_format: { type: "json_object" },
            temperature: 0.3,
            max_tokens: 4000,
        });

        const responseText = completion.choices[0]?.message?.content;
        if (responseText) {
            const parsed = JSON.parse(responseText);
            for (const item of uncached) {
                const translated =
                    typeof parsed[item.key] === "string"
                        ? parsed[item.key].trim()
                        : item.text;
                translationCache.set(cacheKey(item.text, locale), translated);
                result[item.key] = translated;
            }
        }
    } catch (error) {
        console.error(`AI batch translation failed for locale ${locale}:`, error);
        for (const item of uncached) {
            result[item.key] = item.text;
        }
    }

    return result;
}
