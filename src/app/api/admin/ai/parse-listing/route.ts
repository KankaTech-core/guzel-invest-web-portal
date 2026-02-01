import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { getSession } from "@/lib/auth";

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
  "floor": 3,
  "totalFloors": 5,
  "buildYear": 2024,
  "heating": "central | individual | floor | ac | none",
  "city": "Alanya",
  "district": "Mahmutlar",
  "neighborhood": "Kestel",
  "latitude": 36.5531,
  "longitude": 32.0584,
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
6. Google Maps linklerinden koordinatları çıkar
7. Site özellikleri (havuz, fitness, hamam vs.) features dizisine ekle
8. Mülk tipini içerikten çıkar:
   - "daire", "apartment" -> APARTMENT
   - "villa" -> VILLA
   - "arsa" -> LAND
   - "dükkan" -> SHOP
   - "tarla", "çiftlik" -> FARM
   - "ofis" -> OFFICE
   - "ticari" -> COMMERCIAL
9. Location bilgilerini çıkar (Alanya, Kestel, Mahmutlar, Kargıcak vb.)
10. Sadece JSON döndür, başka metin ekleme.`;

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
