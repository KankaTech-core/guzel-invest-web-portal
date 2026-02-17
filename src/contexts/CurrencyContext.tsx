"use client";

import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useState,
    type ReactNode,
} from "react";

type DisplayCurrency = "EUR" | "TRY";

type CurrencyContextType = {
    displayCurrency: DisplayCurrency;
    eurToTryRate: number | null;
    isLoadingRate: boolean;
    toggleCurrency: () => void;
    convertPrice: (price: number | string, listingCurrency: string) => { amount: number; currency: string };
};

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

const RATE_CACHE_KEY = "eur_try_rate_cache";
const RATE_CACHE_TTL_MS = 60 * 60 * 1000; // 1 saat

function getCachedRate(): { rate: number; timestamp: number } | null {
    if (typeof window === "undefined") return null;
    try {
        const raw = localStorage.getItem(RATE_CACHE_KEY);
        if (!raw) return null;
        const parsed = JSON.parse(raw) as { rate: number; timestamp: number };
        if (Date.now() - parsed.timestamp < RATE_CACHE_TTL_MS) {
            return parsed;
        }
        return null;
    } catch {
        return null;
    }
}

function setCachedRate(rate: number) {
    if (typeof window === "undefined") return;
    try {
        localStorage.setItem(
            RATE_CACHE_KEY,
            JSON.stringify({ rate, timestamp: Date.now() })
        );
    } catch {
        // localStorage hatalarını sessizce geç
    }
}

export function CurrencyProvider({ children }: { children: ReactNode }) {
    const [displayCurrency, setDisplayCurrency] = useState<DisplayCurrency>("EUR");
    const [eurToTryRate, setEurToTryRate] = useState<number | null>(null);
    const [isLoadingRate, setIsLoadingRate] = useState(false);

    const fetchRate = useCallback(async () => {
        // Önce cache'e bak
        const cached = getCachedRate();
        if (cached) {
            setEurToTryRate(cached.rate);
            return;
        }

        setIsLoadingRate(true);
        try {
            const res = await fetch("/api/public/exchange-rate");
            if (!res.ok) throw new Error("Rate fetch failed");
            const data = (await res.json()) as { rate: number };
            setEurToTryRate(data.rate);
            setCachedRate(data.rate);
        } catch {
            // Kur çekilemezse EUR modunda kal
            setEurToTryRate(null);
        } finally {
            setIsLoadingRate(false);
        }
    }, []);

    const toggleCurrency = useCallback(() => {
        setDisplayCurrency((prev) => {
            if (prev === "EUR") {
                // TRY'ye geçiliyorsa kuru çek (yoksa)
                fetchRate();
                return "TRY";
            }
            return "EUR";
        });
    }, [fetchRate]);

    // TRY moduna geçildiğinde kur yüklenmemişse çek
    useEffect(() => {
        if (displayCurrency === "TRY" && eurToTryRate === null && !isLoadingRate) {
            fetchRate();
        }
    }, [displayCurrency, eurToTryRate, isLoadingRate, fetchRate]);

    const convertPrice = useCallback(
        (price: number | string, listingCurrency: string): { amount: number; currency: string } => {
            const numericPrice =
                typeof price === "string" ? parseFloat(price) : price;

            // Sadece EUR ilanları TRY'ye çevir
            if (displayCurrency === "TRY" && listingCurrency === "EUR" && eurToTryRate !== null) {
                return { amount: numericPrice * eurToTryRate, currency: "TRY" };
            }

            return { amount: numericPrice, currency: listingCurrency };
        },
        [displayCurrency, eurToTryRate]
    );

    return (
        <CurrencyContext.Provider
            value={{ displayCurrency, eurToTryRate, isLoadingRate, toggleCurrency, convertPrice }}
        >
            {children}
        </CurrencyContext.Provider>
    );
}

export function useCurrency() {
    const context = useContext(CurrencyContext);
    if (context === undefined) {
        throw new Error("useCurrency must be used within a CurrencyProvider");
    }
    return context;
}
