export interface AdminQuickActionRouteContext {
    locale: string;
    listingSlug: string | null;
    articleSlug: string | null;
    projectSlug: string | null;
    isListingPage: boolean;
    isArticlePage: boolean;
    isProjectPage: boolean;
}

export interface AdminQuickActionDefinition {
    id: string;
    label: string;
    href: string;
    disabled?: boolean;
}

export interface BuildAdminQuickActionDefinitionsInput {
    isListingPage: boolean;
    isArticlePage: boolean;
    isProjectPage: boolean;
    listingId: string | null;
    articleId: string | null;
    projectId: string | null;
    isListingLoading: boolean;
    isArticleLoading: boolean;
    isProjectLoading: boolean;
}

const decodePathSegment = (segment: string): string => {
    try {
        return decodeURIComponent(segment);
    } catch {
        return segment;
    }
};

export const parseAdminQuickActionRoute = (
    pathname: string
): AdminQuickActionRouteContext => {
    const pathSegments = pathname.split("/").filter(Boolean);
    const locale = pathSegments[0] ?? "tr";
    const listingSlug =
        pathSegments[1] === "ilan" && pathSegments[2]
            ? decodePathSegment(pathSegments[2])
            : null;
    const articleSlug =
        pathSegments[1] === "blog" && pathSegments[2]
            ? decodePathSegment(pathSegments[2])
            : null;
    const projectSlug =
        pathSegments[1] === "proje" && pathSegments[2]
            ? decodePathSegment(pathSegments[2])
            : null;

    return {
        locale,
        listingSlug,
        articleSlug,
        projectSlug,
        isListingPage: Boolean(listingSlug),
        isArticlePage: Boolean(articleSlug),
        isProjectPage: Boolean(projectSlug),
    };
};

export const buildAdminQuickActionDefinitions = ({
    isListingPage,
    isArticlePage,
    isProjectPage,
    listingId,
    articleId,
    projectId,
    isListingLoading,
    isArticleLoading,
    isProjectLoading,
}: BuildAdminQuickActionDefinitionsInput): AdminQuickActionDefinition[] => {
    const actions: AdminQuickActionDefinition[] = [
        {
            id: "listings",
            label: "İlanlara git",
            href: "/admin/ilanlar",
        },
        {
            id: "projects",
            label: "Projelere git",
            href: "/admin/projeler",
        },
        {
            id: "articles",
            label: "Makalelere git",
            href: "/admin/makaleler",
        },
        {
            id: "portal",
            label: "Portala git",
            href: "/admin",
        },
    ];

    if (isListingPage) {
        actions.unshift({
            id: "listing",
            label: "İlana git",
            href: listingId ? `/admin/ilanlar/${listingId}` : "#",
            disabled: !listingId || isListingLoading,
        });
    }

    if (isProjectPage) {
        actions.unshift({
            id: "project",
            label: "Projeye git",
            href: projectId ? `/admin/projeler/${projectId}` : "#",
            disabled: !projectId || isProjectLoading,
        });
    }

    if (isArticlePage) {
        actions.unshift({
            id: "article",
            label: "Makaleye git",
            href: articleId ? `/admin/makaleler/${articleId}` : "#",
            disabled: !articleId || isArticleLoading,
        });
    }

    return actions;
};
