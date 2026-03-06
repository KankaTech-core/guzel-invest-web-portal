import { PROPERTY_TYPE_OPTIONS } from "./listing-type-rules";

interface PortfolioTypeCountRow {
    type: string;
    _count?: {
        _all?: number | null;
    } | null;
}

export function buildPortfolioTypeCounts(
    rows: readonly PortfolioTypeCountRow[]
): Record<string, number> {
    const counts: Record<string, number> = {};

    PROPERTY_TYPE_OPTIONS.forEach((option) => {
        counts[option.value] = 0;
    });

    rows.forEach((row) => {
        const rawCount = row?._count?._all;
        if (
            typeof rawCount !== "number" ||
            !Number.isFinite(rawCount) ||
            rawCount < 0
        ) {
            return;
        }

        counts[row.type] = (counts[row.type] ?? 0) + Math.trunc(rawCount);
    });

    return counts;
}
