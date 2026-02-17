import { NextResponse } from "next/server";

// Open Exchange Rates - ücretsiz, API key gerektirmez, saatte bir güncellenir
const EXCHANGE_API_URL = "https://open.er-api.com/v6/latest/EUR";

// Server tarafında 1 saatlik cache
let serverCache: { rate: number; fetchedAt: number } | null = null;
const SERVER_CACHE_TTL_MS = 60 * 60 * 1000; // 1 saat

export async function GET() {
    // Server cache kontrolü
    if (serverCache && Date.now() - serverCache.fetchedAt < SERVER_CACHE_TTL_MS) {
        return NextResponse.json(
            { rate: serverCache.rate, cached: true },
            {
                headers: {
                    "Cache-Control": "public, max-age=3600, stale-while-revalidate=600",
                },
            }
        );
    }

    try {
        const res = await fetch(EXCHANGE_API_URL, {
            next: { revalidate: 3600 }, // Next.js fetch cache - 1 saat
        });

        if (!res.ok) {
            throw new Error(`Exchange API responded with ${res.status}`);
        }

        const data = (await res.json()) as {
            result: string;
            rates: Record<string, number>;
        };

        if (data.result !== "success" || !data.rates?.TRY) {
            throw new Error("Invalid response from exchange API");
        }

        const rate = data.rates.TRY;

        // Server cache'i güncelle
        serverCache = { rate, fetchedAt: Date.now() };

        return NextResponse.json(
            { rate },
            {
                headers: {
                    "Cache-Control": "public, max-age=3600, stale-while-revalidate=600",
                },
            }
        );
    } catch (error) {
        console.error("[exchange-rate] Kur çekme hatası:", error);

        // Cache'de eski değer varsa onu döndür
        if (serverCache) {
            return NextResponse.json(
                { rate: serverCache.rate, cached: true, stale: true },
                { status: 200 }
            );
        }

        return NextResponse.json(
            { error: "Döviz kuru alınamadı" },
            { status: 503 }
        );
    }
}
