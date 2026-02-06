"use client";

import { useState } from "react";
import { Sparkles, X, Loader2, Check, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ParsedData {
    title?: string;
    type?: string;
    saleType?: string;
    price?: number;
    currency?: string;
    area?: number;
    rooms?: string | number;
    bedrooms?: number;
    bathrooms?: number;
    floor?: number;
    totalFloors?: number;
    buildYear?: number;
    heating?: string;
    city?: string;
    district?: string;
    neighborhood?: string;
    latitude?: number;
    longitude?: number;
    googleMapsLink?: string;
    furnished?: boolean;
    balcony?: boolean;
    garden?: boolean;
    pool?: boolean;
    parking?: boolean;
    elevator?: boolean;
    security?: boolean;
    seaView?: boolean;
    parcelNo?: string;
    emsal?: number;
    zoningStatus?: string;
    groundFloorArea?: number;
    basementArea?: number;
    hasWaterSource?: boolean;
    hasFruitTrees?: boolean;
    existingStructure?: string;
    citizenshipEligible?: boolean;
    residenceEligible?: boolean;
    description?: string;
    features?: string[];
}

interface AiFillModalProps {
    isOpen: boolean;
    onClose: () => void;
    onApply: (data: ParsedData) => void;
    currentType?: string;
}

const FIELD_LABELS: Record<string, string> = {
    title: "Başlık",
    type: "Mülk Tipi",
    saleType: "Satış Tipi",
    price: "Fiyat",
    currency: "Para Birimi",
    area: "Alan (m²)",
    rooms: "Oda Sayısı",
    bedrooms: "Yatak Odası",
    bathrooms: "Banyo",
    floor: "Kat",
    totalFloors: "Toplam Kat",
    buildYear: "Yapım Yılı",
    heating: "Isıtma",
    city: "Şehir",
    district: "İlçe",
    neighborhood: "Mahalle",
    latitude: "Enlem",
    longitude: "Boylam",
    googleMapsLink: "Google Maps Linki",
    furnished: "Eşyalı",
    balcony: "Balkon",
    garden: "Bahçe",
    pool: "Havuz",
    parking: "Otopark",
    elevator: "Asansör",
    security: "Güvenlik",
    seaView: "Deniz Manzarası",
    parcelNo: "Ada/Parsel",
    emsal: "Emsal (KAKS)",
    zoningStatus: "İmar Durumu",
    groundFloorArea: "Zemin Kat m²",
    basementArea: "Bodrum m²",
    hasWaterSource: "Su Kaynağı",
    hasFruitTrees: "Meyve Ağacı",
    existingStructure: "Mevcut Yapı",
    citizenshipEligible: "Vatandaşlığa Uygun",
    residenceEligible: "İkametgaha Uygun",
    description: "Açıklama",
    features: "Özellikler",
};

export function AiFillModal({ isOpen, onClose, onApply, currentType }: AiFillModalProps) {
    const [inputText, setInputText] = useState("");
    const [parsedData, setParsedData] = useState<ParsedData | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [step, setStep] = useState<"input" | "review">("input");

    const handleParse = async () => {
        if (!inputText.trim()) return;

        setIsLoading(true);
        setError(null);

        try {
            const res = await fetch("/api/admin/ai/parse-listing", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    text: inputText,
                    propertyType: currentType,
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || "AI işlemi başarısız");
            }

            setParsedData(data.data);
            setStep("review");
        } catch (err) {
            setError(err instanceof Error ? err.message : "Bir hata oluştu");
        } finally {
            setIsLoading(false);
        }
    };

    const handleApply = () => {
        if (parsedData) {
            onApply(parsedData);
            handleClose();
        }
    };

    const handleClose = () => {
        setInputText("");
        setParsedData(null);
        setError(null);
        setStep("input");
        onClose();
    };

    const renderValue = (key: string, value: unknown): string => {
        if (typeof value === "boolean") {
            return value ? "Evet" : "Hayır";
        }
        if (Array.isArray(value)) {
            return value.join(", ");
        }
        if (value === null || value === undefined) {
            return "-";
        }
        return String(value);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                onClick={handleClose}
            />

            {/* Modal */}
            <div className="relative w-full max-w-2xl max-h-[90vh] overflow-hidden bg-white rounded-2xl shadow-2xl">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-orange-100 rounded-lg">
                            <Sparkles className="w-5 h-5 text-orange-600" />
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold text-gray-900">
                                AI ile Doldur
                            </h2>
                            <p className="text-sm text-gray-500">
                                {step === "input"
                                    ? "İlan metnini yapıştırın"
                                    : "Çıkarılan bilgileri kontrol edin"}
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={handleClose}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <X className="w-5 h-5 text-gray-500" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 overflow-y-auto max-h-[calc(90vh-180px)]">
                    {step === "input" ? (
                        <div className="space-y-4">
                            <textarea
                                value={inputText}
                                onChange={(e) => setInputText(e.target.value)}
                                placeholder="İlan metnini buraya yapıştırın...

Örnek:
PROJECT/APARTMENT NAME: RIVER PANORAMA 2+1
● 2+1
● Amerikan Mutfak
● 90m2
● 5 Katlı
● 3.Kat
● Asansör
PASS FİYAT: 205.000€"
                                className="w-full h-64 p-4 text-sm border border-gray-200 rounded-lg resize-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                                autoFocus
                            />

                            {error && (
                                <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-100 rounded-lg text-red-600">
                                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                                    <p className="text-sm">{error}</p>
                                </div>
                            )}

                            <p className="text-xs text-gray-400">
                                AI, metindeki bilgileri analiz edip form alanlarını otomatik dolduracaktır.
                                Sonuçları uyglamadan önce kontrol edebilirsiniz.
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {parsedData && (
                                <div className="grid grid-cols-2 gap-3">
                                    {Object.entries(parsedData).map(([key, value]) => {
                                        if (value === null || value === undefined || value === "") {
                                            return null;
                                        }
                                        return (
                                            <div
                                                key={key}
                                                className={cn(
                                                    "p-3 bg-gray-50 rounded-lg",
                                                    key === "description" && "col-span-2",
                                                    key === "features" && "col-span-2"
                                                )}
                                            >
                                                <p className="text-xs font-medium text-gray-500 mb-1">
                                                    {FIELD_LABELS[key] || key}
                                                </p>
                                                <p className="text-sm text-gray-900 break-words">
                                                    {renderValue(key, value)}
                                                </p>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100 bg-gray-50">
                    {step === "input" ? (
                        <>
                            <button
                                onClick={handleClose}
                                className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800"
                            >
                                İptal
                            </button>
                            <button
                                onClick={handleParse}
                                disabled={!inputText.trim() || isLoading}
                                className="flex items-center gap-2 px-5 py-2.5 bg-orange-500 text-white text-sm font-medium rounded-lg hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        Analiz Ediliyor...
                                    </>
                                ) : (
                                    <>
                                        <Sparkles className="w-4 h-4" />
                                        Analiz Et
                                    </>
                                )}
                            </button>
                        </>
                    ) : (
                        <>
                            <button
                                onClick={() => setStep("input")}
                                className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800"
                            >
                                ← Geri Dön
                            </button>
                            <button
                                onClick={handleApply}
                                className="flex items-center gap-2 px-5 py-2.5 bg-green-500 text-white text-sm font-medium rounded-lg hover:bg-green-600 transition-colors"
                            >
                                <Check className="w-4 h-4" />
                                Uygula
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
