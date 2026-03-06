const DEFAULT_LOCALE = "tr";

export const buildProjectsPortfolioHref = (locale?: string) => {
    const normalizedLocale = locale?.trim() || DEFAULT_LOCALE;
    const params = new URLSearchParams({
        onlyProjects: "true",
    });

    return `/${normalizedLocale}/portfoy?${params.toString()}`;
};
