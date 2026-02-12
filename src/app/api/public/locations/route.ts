import { NextRequest, NextResponse } from "next/server";
import locationIndex from "@/data/tr-location-index.json";

type District = {
    name: string;
    neighborhoods: string[];
};

type City = {
    name: string;
    districts: District[];
};

const cities = (locationIndex.cities as City[]) || [];

const normalizeTR = (value: string): string =>
    value
        .trim()
        .toLocaleLowerCase("tr-TR")
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");

const findCity = (name: string): City | undefined => {
    const key = normalizeTR(name);
    return cities.find((city) => normalizeTR(city.name) === key);
};

const findDistrict = (districts: District[], name: string): District | undefined => {
    const key = normalizeTR(name);
    return districts.find((district) => normalizeTR(district.name) === key);
};

// GET /api/public/locations?city=...&district=...
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const cityQuery = searchParams.get("city");
        const districtQuery = searchParams.get("district");

        if (!cityQuery) {
            return NextResponse.json({
                cities: cities.map((city) => city.name),
                defaultCity: "Antalya",
                defaultDistrict: "Alanya",
            });
        }

        const city = findCity(cityQuery);
        if (!city) {
            return NextResponse.json(
                { error: "City not found" },
                { status: 404 }
            );
        }

        if (!districtQuery) {
            return NextResponse.json({
                city: city.name,
                districts: city.districts.map((district) => district.name),
            });
        }

        const district = findDistrict(city.districts, districtQuery);
        if (!district) {
            return NextResponse.json(
                { error: "District not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({
            city: city.name,
            district: district.name,
            neighborhoods: district.neighborhoods,
        });
    } catch (error) {
        console.error("Error fetching public locations:", error);
        return NextResponse.json(
            { error: "Failed to fetch locations" },
            { status: 500 }
        );
    }
}
