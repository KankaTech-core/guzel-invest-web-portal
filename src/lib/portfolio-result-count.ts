interface ResolvePortfolioResultCountInput {
    totalCount?: number;
    loadedCount: number;
}

export function resolvePortfolioResultCount({
    totalCount,
    loadedCount,
}: ResolvePortfolioResultCountInput) {
    if (typeof totalCount === "number" && Number.isFinite(totalCount) && totalCount >= 0) {
        return totalCount;
    }

    return loadedCount;
}
