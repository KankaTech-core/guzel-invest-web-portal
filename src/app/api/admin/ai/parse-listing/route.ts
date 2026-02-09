import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { getSession } from "@/lib/auth";
import locationIndex from "@/data/tr-location-index.json";

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

interface ParsedListingData {
    // Basic info
    title?: string;
    type?: string;
    saleType?: string;
    price?: number;
    currency?: string;
    area?: number;

    // Residential fields
    rooms?: string; // e.g., "2+1"
    bedrooms?: number;
    bathrooms?: number;
    wcCount?: number;
    floor?: number;
    totalFloors?: number;
    buildYear?: number;
    heating?: string;

    // Location
    city?: string;
    district?: string;
    neighborhood?: string;
    latitude?: number;
    longitude?: number;
    googleMapsLink?: string;

    // Features
    furnished?: boolean;
    balcony?: boolean;
    garden?: boolean;
    pool?: boolean;
    parking?: boolean;
    elevator?: boolean;
    security?: boolean;
    seaView?: boolean;

    // Land-specific
    parcelNo?: string;
    emsal?: number;
    zoningStatus?: string;

    // Commercial-specific
    groundFloorArea?: number;
    basementArea?: number;

    // Farm-specific
    hasWaterSource?: boolean;
    hasFruitTrees?: boolean;
    existingStructure?: string;

    // Special eligibility
    citizenshipEligible?: boolean;
    residenceEligible?: boolean;

    // Description and features list
    description?: string;
    features?: string[];
}

type LocationDistrict = {
    name: string;
    neighborhoods?: string[];
};

type LocationCity = {
    name: string;
    districts: LocationDistrict[];
};

type DistrictRecord = {
    cityName: string;
    cityKey: string;
    districtName: string;
    districtKey: string;
    neighborhoodByKey: Map<string, string>;
};

const locationCities = (locationIndex.cities as LocationCity[]) || [];

const normalizeTR = (value: string): string =>
    value
        .trim()
        .toLocaleLowerCase("tr-TR")
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");

const pushRecord = (
    map: Map<string, DistrictRecord[]>,
    key: string,
    record: DistrictRecord
) => {
    if (!key) return;
    const existing = map.get(key);
    if (existing) {
        existing.push(record);
        return;
    }
    map.set(key, [record]);
};

const cityByKey = new Map<string, string>();
const districtRecordsByCityKey = new Map<string, DistrictRecord[]>();
const districtRecordsByDistrictKey = new Map<string, DistrictRecord[]>();
const districtRecordsByNeighborhoodKey = new Map<string, DistrictRecord[]>();

for (const city of locationCities) {
    const cityKey = normalizeTR(city.name);
    cityByKey.set(cityKey, city.name);

    for (const district of city.districts || []) {
        const districtKey = normalizeTR(district.name);
        const neighborhoodByKey = new Map<string, string>();
        for (const neighborhood of district.neighborhoods || []) {
            const neighborhoodKey = normalizeTR(neighborhood);
            if (!neighborhoodByKey.has(neighborhoodKey)) {
                neighborhoodByKey.set(neighborhoodKey, neighborhood);
            }
        }

        const record: DistrictRecord = {
            cityName: city.name,
            cityKey,
            districtName: district.name,
            districtKey,
            neighborhoodByKey,
        };

        pushRecord(districtRecordsByCityKey, cityKey, record);
        pushRecord(districtRecordsByDistrictKey, districtKey, record);
        for (const neighborhoodKey of neighborhoodByKey.keys()) {
            pushRecord(districtRecordsByNeighborhoodKey, neighborhoodKey, record);
        }
    }
}

const trimText = (value: unknown): string | null => {
    if (typeof value !== "string") return null;
    const trimmed = value.trim();
    return trimmed.length > 0 ? trimmed : null;
};

const toKey = (value: string | null): string | null =>
    value ? normalizeTR(value) : null;

const getDistrictRecordByCityAndDistrict = (
    cityKey: string,
    districtKey: string
): DistrictRecord | null => {
    const records = districtRecordsByCityKey.get(cityKey) || [];
    return records.find((record) => record.districtKey === districtKey) || null;
};

const getMatchingNeighborhood = (
    record: DistrictRecord,
    key: string | null
): string | null => {
    if (!key) return null;
    return record.neighborhoodByKey.get(key) || null;
};

type LocationKeys = {
    cityKey: string | null;
    districtKey: string | null;
    neighborhoodKey: string | null;
};

const scoreDistrictCandidate = (
    record: DistrictRecord,
    keys: LocationKeys
): number => {
    let score = 0;

    if (keys.cityKey) {
        if (keys.cityKey === record.cityKey) score += 40;
        if (keys.cityKey === record.districtKey) score += 55;
        if (record.neighborhoodByKey.has(keys.cityKey)) score += 30;
    }

    if (keys.districtKey) {
        if (keys.districtKey === record.districtKey) score += 50;
        if (keys.districtKey === record.cityKey) score += 10;
        if (record.neighborhoodByKey.has(keys.districtKey)) score += 35;
    }

    if (keys.neighborhoodKey) {
        if (record.neighborhoodByKey.has(keys.neighborhoodKey)) score += 60;
        if (keys.neighborhoodKey === record.districtKey) score += 28;
        if (keys.neighborhoodKey === record.cityKey) score += 6;
    }

    return score;
};

const chooseDistrictRecord = (
    candidates: DistrictRecord[],
    keys: LocationKeys,
    requiredCityKey?: string
): DistrictRecord | null => {
    const filtered = requiredCityKey
        ? candidates.filter((candidate) => candidate.cityKey === requiredCityKey)
        : candidates;
    if (filtered.length === 0) return null;

    const deduped = new Map<string, DistrictRecord>();
    for (const candidate of filtered) {
        deduped.set(`${candidate.cityKey}::${candidate.districtKey}`, candidate);
    }

    const ranked = Array.from(deduped.values())
        .map((candidate) => ({
            candidate,
            score: scoreDistrictCandidate(candidate, keys),
        }))
        .sort((a, b) => b.score - a.score);

    const top = ranked[0];
    if (!top || top.score <= 0) return null;

    const isAmbiguous =
        ranked.length > 1 && ranked[1] && ranked[1].score === top.score;
    if (isAmbiguous && top.score < 80) {
        return null;
    }

    return top.candidate;
};

const resolveParsedLocation = (data: ParsedListingData): void => {
    const rawCity = trimText(data.city);
    const rawDistrict = trimText(data.district);
    const rawNeighborhood = trimText(data.neighborhood);

    if (!rawCity && !rawDistrict && !rawNeighborhood) return;

    const keys: LocationKeys = {
        cityKey: toKey(rawCity),
        districtKey: toKey(rawDistrict),
        neighborhoodKey: toKey(rawNeighborhood),
    };

    let resolvedCity: string | null = null;
    let resolvedDistrict: string | null = null;
    let resolvedNeighborhood: string | null = rawNeighborhood;

    // 1) City doğru seviyedeyse direkt kullan.
    if (keys.cityKey) {
        resolvedCity = cityByKey.get(keys.cityKey) || null;
    }

    // 2) City alanına ilçe/mahalle düşmüşse yukarı taşı.
    if (!resolvedCity && keys.cityKey) {
        const cityAsDistrict = chooseDistrictRecord(
            districtRecordsByDistrictKey.get(keys.cityKey) || [],
            keys
        );
        if (cityAsDistrict) {
            resolvedCity = cityAsDistrict.cityName;
            resolvedDistrict = cityAsDistrict.districtName;
        } else {
            const cityAsNeighborhood = chooseDistrictRecord(
                districtRecordsByNeighborhoodKey.get(keys.cityKey) || [],
                keys
            );
            if (cityAsNeighborhood) {
                resolvedCity = cityAsNeighborhood.cityName;
                resolvedDistrict = cityAsNeighborhood.districtName;
                if (!resolvedNeighborhood) {
                    resolvedNeighborhood =
                        getMatchingNeighborhood(cityAsNeighborhood, keys.cityKey) ||
                        null;
                }
            }
        }
    }

    // 3) Hala şehir yoksa district/neighborhood alanlarından çıkar.
    if (!resolvedCity && keys.districtKey) {
        const districtAsDistrict = chooseDistrictRecord(
            districtRecordsByDistrictKey.get(keys.districtKey) || [],
            keys
        );
        if (districtAsDistrict) {
            resolvedCity = districtAsDistrict.cityName;
            resolvedDistrict = districtAsDistrict.districtName;
        } else {
            const districtAsNeighborhood = chooseDistrictRecord(
                districtRecordsByNeighborhoodKey.get(keys.districtKey) || [],
                keys
            );
            if (districtAsNeighborhood) {
                resolvedCity = districtAsNeighborhood.cityName;
                resolvedDistrict = districtAsNeighborhood.districtName;
                if (!resolvedNeighborhood) {
                    resolvedNeighborhood =
                        getMatchingNeighborhood(districtAsNeighborhood, keys.districtKey) ||
                        null;
                }
            }
        }
    }

    if (!resolvedCity && keys.neighborhoodKey) {
        const neighborhoodAsNeighborhood = chooseDistrictRecord(
            districtRecordsByNeighborhoodKey.get(keys.neighborhoodKey) || [],
            keys
        );
        if (neighborhoodAsNeighborhood) {
            resolvedCity = neighborhoodAsNeighborhood.cityName;
            resolvedDistrict = neighborhoodAsNeighborhood.districtName;
        } else {
            const neighborhoodAsDistrict = chooseDistrictRecord(
                districtRecordsByDistrictKey.get(keys.neighborhoodKey) || [],
                keys
            );
            if (neighborhoodAsDistrict) {
                resolvedCity = neighborhoodAsDistrict.cityName;
                resolvedDistrict = neighborhoodAsDistrict.districtName;
            }
        }
    }

    // 4) Şehir belli olduktan sonra district'i netleştir.
    if (resolvedCity) {
        const resolvedCityKey = normalizeTR(resolvedCity);

        if (keys.districtKey) {
            const directDistrict = getDistrictRecordByCityAndDistrict(
                resolvedCityKey,
                keys.districtKey
            );
            if (directDistrict) {
                resolvedDistrict = directDistrict.districtName;
            }
        }

        if (!resolvedDistrict && keys.cityKey) {
            const cityAsDistrictInResolvedCity = getDistrictRecordByCityAndDistrict(
                resolvedCityKey,
                keys.cityKey
            );
            if (cityAsDistrictInResolvedCity) {
                resolvedDistrict = cityAsDistrictInResolvedCity.districtName;
            }
        }

        if (!resolvedDistrict && keys.districtKey) {
            const districtAsNeighborhoodInResolvedCity = chooseDistrictRecord(
                districtRecordsByNeighborhoodKey.get(keys.districtKey) || [],
                keys,
                resolvedCityKey
            );
            if (districtAsNeighborhoodInResolvedCity) {
                resolvedDistrict = districtAsNeighborhoodInResolvedCity.districtName;
                const mappedNeighborhood = getMatchingNeighborhood(
                    districtAsNeighborhoodInResolvedCity,
                    keys.districtKey
                );
                if (mappedNeighborhood) {
                    const currentNeighborhoodKey = toKey(resolvedNeighborhood);
                    if (
                        !currentNeighborhoodKey ||
                        !districtAsNeighborhoodInResolvedCity.neighborhoodByKey.has(
                            currentNeighborhoodKey
                        )
                    ) {
                        resolvedNeighborhood = mappedNeighborhood;
                    }
                }
            }
        }

        if (!resolvedDistrict && keys.neighborhoodKey) {
            const districtFromNeighborhoodInResolvedCity = chooseDistrictRecord(
                districtRecordsByNeighborhoodKey.get(keys.neighborhoodKey) || [],
                keys,
                resolvedCityKey
            );
            if (districtFromNeighborhoodInResolvedCity) {
                resolvedDistrict = districtFromNeighborhoodInResolvedCity.districtName;
            }
        }
    }

    // 5) Neighborhood'i doğru district içinden seç.
    if (resolvedCity && resolvedDistrict) {
        const districtRecord = getDistrictRecordByCityAndDistrict(
            normalizeTR(resolvedCity),
            normalizeTR(resolvedDistrict)
        );

        if (districtRecord) {
            const neighborhoodCandidates = [
                keys.neighborhoodKey,
                keys.districtKey,
                keys.cityKey,
            ];
            for (const candidateKey of neighborhoodCandidates) {
                const matched = getMatchingNeighborhood(districtRecord, candidateKey);
                if (matched) {
                    resolvedNeighborhood = matched;
                    break;
                }
            }
        }
    }

    if (resolvedCity) data.city = resolvedCity;
    else if (rawCity) data.city = rawCity;

    if (resolvedDistrict) data.district = resolvedDistrict;
    else if (rawDistrict) data.district = rawDistrict;

    if (resolvedNeighborhood) data.neighborhood = resolvedNeighborhood;
    else if (rawNeighborhood) data.neighborhood = rawNeighborhood;
};

const SYSTEM_PROMPT = `Sen bir gayrimenkul ilan analiz asistanısın. Sana verilen Türkçe ilan metnini analiz edip yapılandırılmış JSON formatında çıktı üreteceksin.

Çıktı formatı:
{
  "title": "İlan başlığı",
  "type": "APARTMENT | VILLA | PENTHOUSE | LAND | COMMERCIAL | OFFICE | SHOP | FARM",
  "saleType": "SALE | RENT",
  "price": 123456,
  "currency": "EUR | USD | TRY | GBP",
  "area": 120,
  "rooms": "2+1",
  "bedrooms": 2,
  "bathrooms": 1,
  "wcCount": 1,
  "floor": 3,
  "totalFloors": 5,
  "buildYear": 2024,
  "heating": "central | individual | floor | ac | none",
  "city": "Antalya",
  "district": "Alanya",
  "neighborhood": "Mahmutlar",
  "latitude": 36.5531,
  "longitude": 32.0584,
  "googleMapsLink": "https://www.google.com/maps?q=36.5531,32.0584",
  "furnished": true/false,
  "balcony": true/false,
  "garden": true/false,
  "pool": true/false,
  "parking": true/false,
  "elevator": true/false,
  "security": true/false,
  "seaView": true/false,
  "parcelNo": "308 Ada 7 Parsel",
  "emsal": 0.40,
  "zoningStatus": "İmarlı",
  "groundFloorArea": 220,
  "basementArea": 230,
  "hasWaterSource": true/false,
  "hasFruitTrees": true/false,
  "existingStructure": "2 katlı ev, havuz",
  "citizenshipEligible": true/false,
  "residenceEligible": true/false,
  "description": "İlan açıklaması...",
  "features": ["Özellik 1", "Özellik 2", ...]
}

Kurallar:
1. Fiyatı sayısal değer olarak çıkar (77.500EURO -> price: 77500, currency: "EUR")
2. TL/TRY, €/EUR, $/USD dönüşümlerini yap
3. "Vatandaşlığa uygun" -> citizenshipEligible: true
4. "İkametgaha uygun" -> residenceEligible: true
5. "2+1", "3+1" gibi oda sayılarını rooms olarak kaydet
6. WC sayısı geçiyorsa wcCount alanına yaz
7. Google Maps linklerinden koordinatları çıkar
8. Site özellikleri (havuz, fitness, hamam vs.) features dizisine ekle
9. Mülk tipini içerikten çıkar:
   - "daire", "apartment" -> APARTMENT
   - "villa" -> VILLA
   - "arsa" -> LAND
   - "dükkan" -> SHOP
   - "tarla", "çiftlik" -> FARM
   - "ofis" -> OFFICE
   - "ticari" -> COMMERCIAL
10. Location hiyerarşisi: city=il (örn Antalya), district=ilçe (örn Alanya), neighborhood=mahalle (örn Mahmutlar, Kestel)
11. Eğer metinde Google Maps linki varsa googleMapsLink alanına ekle
12. Sadece JSON döndür, başka metin ekleme.`;

const GOOGLE_MAPS_HOSTS = ["maps.app.goo.gl", "goo.gl"];

const isLikelyGoogleMapsUrl = (url: URL): boolean => {
    const host = url.hostname.toLowerCase();
    if (GOOGLE_MAPS_HOSTS.some((shortHost) => host === shortHost || host.endsWith(`.${shortHost}`))) {
        return true;
    }
    if (!host.includes("google.")) return false;
    return host.startsWith("maps.") || url.pathname.startsWith("/maps");
};

const trimTrailingPunctuation = (value: string): string =>
    value.replace(/[\]\)\},.;]+$/g, "");

const normalizeGoogleMapsLink = (value: unknown): string | null => {
    if (typeof value !== "string") return null;
    const trimmed = value.trim();
    if (!trimmed) return null;
    const cleaned = trimTrailingPunctuation(trimmed);
    try {
        const url = new URL(cleaned);
        return isLikelyGoogleMapsUrl(url) ? cleaned : null;
    } catch {
        return null;
    }
};

const extractGoogleMapsLink = (text: string): string | null => {
    const matches = text.match(/https?:\/\/\S+/gi);
    if (!matches) return null;

    for (const raw of matches) {
        const cleaned = trimTrailingPunctuation(raw);
        try {
            const url = new URL(cleaned);
            if (isLikelyGoogleMapsUrl(url)) {
                return cleaned;
            }
        } catch {
            continue;
        }
    }

    return null;
};

const parseLatLngFromText = (value: string | null | undefined):
    | { latitude: number; longitude: number }
    | null => {
    if (!value) return null;
    const match = value.match(/(-?\d{1,2}(?:\.\d+)?)[,\s]+(-?\d{1,3}(?:\.\d+)?)/);
    if (!match) return null;
    const latitude = Number(match[1]);
    const longitude = Number(match[2]);
    if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) return null;
    if (Math.abs(latitude) > 90 || Math.abs(longitude) > 180) return null;
    return { latitude, longitude };
};

const extractCoordinatesFromUrl = (value: string):
    | { latitude: number; longitude: number }
    | null => {
    try {
        const url = new URL(value);
        const candidates = [
            url.searchParams.get("q"),
            url.searchParams.get("query"),
            url.searchParams.get("ll"),
            url.searchParams.get("center"),
        ];
        for (const candidate of candidates) {
            const parsed = parseLatLngFromText(candidate);
            if (parsed) return parsed;
        }

        const atMatch = url.pathname.match(/@(-?\d{1,2}(?:\.\d+)?),(-?\d{1,3}(?:\.\d+)?)/);
        if (atMatch) {
            const parsed = parseLatLngFromText(`${atMatch[1]},${atMatch[2]}`);
            if (parsed) return parsed;
        }

        const bangMatch = url.pathname.match(/!3d(-?\d{1,2}(?:\.\d+)?)!4d(-?\d{1,3}(?:\.\d+)?)/);
        if (bangMatch) {
            const parsed = parseLatLngFromText(`${bangMatch[1]},${bangMatch[2]}`);
            if (parsed) return parsed;
        }

        const reverseBangMatch = url.pathname.match(/!4d(-?\d{1,3}(?:\.\d+)?)!3d(-?\d{1,2}(?:\.\d+)?)/);
        if (reverseBangMatch) {
            const parsed = parseLatLngFromText(`${reverseBangMatch[2]},${reverseBangMatch[1]}`);
            if (parsed) return parsed;
        }
    } catch {
        return null;
    }

    return null;
};

const expandGoogleMapsShortLink = async (value: string): Promise<string> => {
    try {
        const url = new URL(value);
        const host = url.hostname.toLowerCase();
        const isShort = GOOGLE_MAPS_HOSTS.some(
            (shortHost) => host === shortHost || host.endsWith(`.${shortHost}`)
        );
        if (!isShort) return value;

        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 3000);
        try {
            const response = await fetch(value, {
                redirect: "follow",
                signal: controller.signal,
            });
            if (response?.url) return response.url;
        } finally {
            clearTimeout(timeout);
        }
    } catch {
        return value;
    }

    return value;
};

export async function POST(req: NextRequest) {
    try {
        const session = await getSession();
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { text, propertyType } = await req.json();

        if (!text || typeof text !== "string" || text.trim().length === 0) {
            return NextResponse.json(
                { error: "Text content is required" },
                { status: 400 }
            );
        }

        const userPrompt = propertyType
            ? `Mülk tipi: ${propertyType}\n\nİlan metni:\n${text}`
            : `İlan metni:\n${text}`;

        const completion = await openai.chat.completions.create({
            model: process.env.OPENAI_MODEL_TEXT || "gpt-4o",
            messages: [
                { role: "system", content: SYSTEM_PROMPT },
                { role: "user", content: userPrompt },
            ],
            response_format: { type: "json_object" },
            temperature: 0.3,
        });

        const responseText = completion.choices[0]?.message?.content;

        if (!responseText) {
            return NextResponse.json(
                { error: "AI response was empty" },
                { status: 500 }
            );
        }

        let parsedData: ParsedListingData;
        try {
            parsedData = JSON.parse(responseText);
        } catch {
            console.error("Failed to parse AI response:", responseText);
            return NextResponse.json(
                { error: "Failed to parse AI response" },
                { status: 500 }
            );
        }

        const aiMapsLink = normalizeGoogleMapsLink(parsedData.googleMapsLink);
        const extractedMapsLink = extractGoogleMapsLink(text);
        let resolvedMapsLink = aiMapsLink || extractedMapsLink;

        if (resolvedMapsLink) {
            resolvedMapsLink = await expandGoogleMapsShortLink(resolvedMapsLink);
            parsedData.googleMapsLink = resolvedMapsLink;

            const needsLatitude = parsedData.latitude === undefined || parsedData.latitude === null;
            const needsLongitude =
                parsedData.longitude === undefined || parsedData.longitude === null;
            if (needsLatitude || needsLongitude) {
                const coordsFromUrl = extractCoordinatesFromUrl(resolvedMapsLink);
                if (coordsFromUrl) {
                    if (needsLatitude) parsedData.latitude = coordsFromUrl.latitude;
                    if (needsLongitude) parsedData.longitude = coordsFromUrl.longitude;
                }
            }
        }

        resolveParsedLocation(parsedData);

        return NextResponse.json({
            success: true,
            data: parsedData,
            tokensUsed: completion.usage?.total_tokens || 0,
        });
    } catch (error) {
        console.error("Error parsing listing with AI:", error);
        return NextResponse.json(
            { error: "Failed to process listing with AI" },
            { status: 500 }
        );
    }
}
