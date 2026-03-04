interface ResolvePortfolioResultsLayoutInput<T> {
    filteredListings: T[];
    fallbackListings: T[];
    hasActiveFilters: boolean;
}

interface ResolvePortfolioResultsLayoutResult<T> {
    visibleListings: T[];
    showNoResultsCard: boolean;
    showDivider: boolean;
    shouldFetchFallbackListings: boolean;
}

export function resolvePortfolioResultsLayout<T>({
    filteredListings,
    fallbackListings,
    hasActiveFilters,
}: ResolvePortfolioResultsLayoutInput<T>): ResolvePortfolioResultsLayoutResult<T> {
    const showNoResultsCard = filteredListings.length === 0;
    const shouldFetchFallbackListings = showNoResultsCard && hasActiveFilters;
    const canShowFallbackListings =
        shouldFetchFallbackListings && fallbackListings.length > 0;

    return {
        visibleListings: showNoResultsCard
            ? canShowFallbackListings
                ? fallbackListings
                : []
            : filteredListings,
        showNoResultsCard,
        showDivider: canShowFallbackListings,
        shouldFetchFallbackListings,
    };
}
