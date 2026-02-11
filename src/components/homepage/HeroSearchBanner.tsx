"use client";

import { FormEvent, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRightLeft, Building2, MapPin, Search } from "lucide-react";

type HeroSearchBannerProps = {
    locale: string;
};

const propertyTypeOptions = [
    { value: "", label: "Tüm Mülk Tipleri" },
    { value: "APARTMENT", label: "Daire" },
    { value: "VILLA", label: "Villa" },
    { value: "LAND", label: "Arsa" },
    { value: "COMMERCIAL", label: "Ticari" },
    { value: "OFFICE", label: "Ofis" },
    { value: "SHOP", label: "Dükkan" },
];

const districtMap: Record<string, string[]> = {
    Alanya: ["Mahmutlar", "Kestel", "Oba", "Cikcilli", "Kargicak", "Avsallar", "Konakli", "Demirtas", "Merkez"],
    Antalya: ["Muratpasa", "Konyaalti", "Kepez", "Dosemealti", "Aksu"],
    Gazipasa: ["Pazarcı", "Cumhuriyet", "Yeni Mahalle", "Beyrebucak"],
    Mersin: ["Yenisehir", "Mezitli", "Erdemli", "Silifke"],
};

const cityOptions = Object.keys(districtMap);

export function HeroSearchBanner({ locale }: HeroSearchBannerProps) {
    const router = useRouter();
    const [saleType, setSaleType] = useState<"SALE" | "RENT">("SALE");
    const [propertyType, setPropertyType] = useState<string>("");
    const [city, setCity] = useState<string>("Alanya");
    const [district, setDistrict] = useState<string>("");

    const districtOptions = useMemo(() => districtMap[city] ?? [], [city]);

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const params = new URLSearchParams();
        params.set("saleType", saleType);

        if (propertyType) {
            params.set("type", propertyType);
        }

        if (city) {
            params.set("city", city);
        }

        if (district) {
            params.set("district", district);
        }

        router.push(`/${locale}/portfoy?${params.toString()}`);
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="rounded-2xl border border-gray-200 bg-white p-4 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.35)] md:p-5"
        >
            <div className="grid gap-3 border-b border-gray-100 pb-3 sm:grid-cols-2">
                <label className="group cursor-pointer rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 transition-all hover:border-orange-300">
                    <input
                        type="radio"
                        name="saleType"
                        value="SALE"
                        className="sr-only"
                        checked={saleType === "SALE"}
                        onChange={() => setSaleType("SALE")}
                    />
                    <span className="inline-flex items-center gap-2 text-sm font-medium text-gray-600">
                        <ArrowRightLeft className="h-4 w-4 text-orange-500" />
                        Satılık
                    </span>
                    <span className="mt-1 block text-xs text-gray-400">
                        Uzun vadeli alım ve yatırım fırsatları
                    </span>
                    {saleType === "SALE" ? (
                        <span className="mt-2 inline-block rounded-full bg-orange-500 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white">
                            Seçili
                        </span>
                    ) : null}
                </label>

                <label className="group cursor-pointer rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 transition-all hover:border-orange-300">
                    <input
                        type="radio"
                        name="saleType"
                        value="RENT"
                        className="sr-only"
                        checked={saleType === "RENT"}
                        onChange={() => setSaleType("RENT")}
                    />
                    <span className="inline-flex items-center gap-2 text-sm font-medium text-gray-600">
                        <ArrowRightLeft className="h-4 w-4 text-orange-500" />
                        Kiralık
                    </span>
                    <span className="mt-1 block text-xs text-gray-400">
                        Kısa ve orta vadeli yaşam çözümleri
                    </span>
                    {saleType === "RENT" ? (
                        <span className="mt-2 inline-block rounded-full bg-orange-500 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white">
                            Seçili
                        </span>
                    ) : null}
                </label>
            </div>

            <div className="mt-4 grid gap-3 lg:grid-cols-[1fr_1fr_1fr_auto]">
                <label className="rounded-xl border border-gray-200 bg-white px-3 py-2.5">
                    <span className="mb-1.5 inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-gray-400">
                        <Building2 className="h-3.5 w-3.5" />
                        Mülk Tipi
                    </span>
                    <select
                        className="w-full bg-transparent text-sm font-medium text-gray-800 outline-none"
                        value={propertyType}
                        onChange={(event) => setPropertyType(event.target.value)}
                    >
                        {propertyTypeOptions.map((option) => (
                            <option key={option.label} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                </label>

                <label className="rounded-xl border border-gray-200 bg-white px-3 py-2.5">
                    <span className="mb-1.5 inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-gray-400">
                        <MapPin className="h-3.5 w-3.5" />
                        İl
                    </span>
                    <select
                        className="w-full bg-transparent text-sm font-medium text-gray-800 outline-none"
                        value={city}
                        onChange={(event) => {
                            const selectedCity = event.target.value;
                            setCity(selectedCity);
                            if (!(districtMap[selectedCity] || []).includes(district)) {
                                setDistrict("");
                            }
                        }}
                    >
                        {cityOptions.map((cityOption) => (
                            <option key={cityOption} value={cityOption}>
                                {cityOption}
                            </option>
                        ))}
                    </select>
                </label>

                <label className="rounded-xl border border-gray-200 bg-white px-3 py-2.5">
                    <span className="mb-1.5 inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-gray-400">
                        <MapPin className="h-3.5 w-3.5" />
                        İlçe
                    </span>
                    <select
                        className="w-full bg-transparent text-sm font-medium text-gray-800 outline-none"
                        value={district}
                        onChange={(event) => setDistrict(event.target.value)}
                    >
                        <option value="">Tüm İlçeler</option>
                        {districtOptions.map((districtOption) => (
                            <option key={districtOption} value={districtOption}>
                                {districtOption}
                            </option>
                        ))}
                    </select>
                </label>

                <button
                    type="submit"
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-gray-900 px-5 py-3 text-sm font-semibold text-white transition-all hover:bg-black"
                >
                    <Search className="h-4 w-4" />
                    Ara
                </button>
            </div>
        </form>
    );
}
