import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import {
    getAllProvinces,
    getDistrictsByProvinceApiId,
    getNeighborhoodsByDistrictApiId,
} from "turkey-location-data";

type LocationIndex = {
    generatedAt: string;
    source: "turkey-location-data";
    cities: Array<{
        name: string;
        apiId: number;
        districts: Array<{
            name: string;
            apiId: number;
            neighborhoods: string[];
        }>;
    }>;
};

const compareTR = (a: string, b: string) =>
    a.localeCompare(b, "tr-TR", { sensitivity: "base" });

const buildLocationIndex = (): LocationIndex => {
    const provinces = getAllProvinces().sort((a, b) => compareTR(a.name, b.name));

    const cities = provinces.map((province) => {
        const districts = getDistrictsByProvinceApiId(province.apiId)
            .sort((a, b) => compareTR(a.name, b.name))
            .map((district) => ({
                name: district.name,
                apiId: district.apiId,
                neighborhoods: getNeighborhoodsByDistrictApiId(district.apiId)
                    .slice()
                    .sort(compareTR),
            }));

        return {
            name: province.name,
            apiId: province.apiId,
            districts,
        };
    });

    return {
        generatedAt: new Date().toISOString(),
        source: "turkey-location-data",
        cities,
    };
};

function main() {
    const outputPath = resolve(process.cwd(), "src/data/tr-location-index.json");
    const payload = buildLocationIndex();

    mkdirSync(dirname(outputPath), { recursive: true });
    writeFileSync(outputPath, JSON.stringify(payload), "utf-8");

    console.log(
        `Generated ${outputPath} (${payload.cities.length} cities)`
    );
}

main();
