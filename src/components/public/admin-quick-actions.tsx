"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import type { LucideIcon } from "lucide-react";
import { BookOpenText, Building2, EyeOff, FileText, PencilLine, Plus, X } from "lucide-react";
import {
    buildAdminQuickActionDefinitions,
    parseAdminQuickActionRoute,
} from "@/lib/admin-quick-actions";

interface QuickAction {
    id: string;
    label: string;
    href: string;
    icon: LucideIcon;
    disabled?: boolean;
}

interface PublicListingDetailResponse {
    listing?: {
        id?: string;
    };
}

interface PublicArticleDetailResponse {
    article?: {
        id?: string;
    };
}

interface PublicProjectDetailResponse {
    project?: {
        id?: string;
    };
}

interface AdminQuickActionsProps {
    onHideAll?: () => void;
}

const ACTION_ICON_MAP: Record<string, LucideIcon> = {
    listing: PencilLine,
    listings: FileText,
    project: PencilLine,
    projects: Building2,
    article: PencilLine,
    articles: BookOpenText,
    portal: Building2,
};

export function AdminQuickActions({ onHideAll }: AdminQuickActionsProps) {
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(false);
    const [listingId, setListingId] = useState<string | null>(null);
    const [isListingLoading, setIsListingLoading] = useState(false);
    const [articleId, setArticleId] = useState<string | null>(null);
    const [isArticleLoading, setIsArticleLoading] = useState(false);
    const [projectId, setProjectId] = useState<string | null>(null);
    const [isProjectLoading, setIsProjectLoading] = useState(false);

    const {
        locale,
        listingSlug,
        articleSlug,
        projectSlug,
        isListingPage,
        isArticlePage,
        isProjectPage,
    } = useMemo(() => parseAdminQuickActionRoute(pathname), [pathname]);

    const actions = useMemo<QuickAction[]>(() => {
        return buildAdminQuickActionDefinitions({
            isListingPage,
            isArticlePage,
            isProjectPage,
            projectSlug,
            listingId,
            articleId,
            projectId,
            isListingLoading,
            isArticleLoading,
            isProjectLoading,
        }).map((action) => ({
            ...action,
            icon: ACTION_ICON_MAP[action.id] ?? Building2,
        }));
    }, [
        articleId,
        isArticleLoading,
        isArticlePage,
        isListingPage,
        isListingLoading,
        isProjectLoading,
        isProjectPage,
        projectSlug,
        listingId,
        projectId,
    ]);

    useEffect(() => {
        setIsOpen(false);
    }, [pathname]);

    useEffect(() => {
        if (!isOpen) {
            return;
        }

        const handleEscape = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                setIsOpen(false);
            }
        };

        window.addEventListener("keydown", handleEscape);
        return () => window.removeEventListener("keydown", handleEscape);
    }, [isOpen]);

    useEffect(() => {
        if (!listingSlug) {
            setListingId(null);
            setIsListingLoading(false);
            return;
        }

        const controller = new AbortController();
        let isActive = true;

        const loadListingId = async () => {
            setIsListingLoading(true);
            try {
                const response = await fetch(
                    `/api/public/listings/${encodeURIComponent(listingSlug)}?locale=${encodeURIComponent(locale)}`,
                    {
                        cache: "no-store",
                        signal: controller.signal,
                    }
                );

                if (!response.ok) {
                    if (isActive) {
                        setListingId(null);
                    }
                    return;
                }

                const data = (await response.json()) as PublicListingDetailResponse;
                if (isActive) {
                    setListingId(typeof data.listing?.id === "string" ? data.listing.id : null);
                }
            } catch {
                if (isActive && !controller.signal.aborted) {
                    setListingId(null);
                }
            } finally {
                if (isActive) {
                    setIsListingLoading(false);
                }
            }
        };

        void loadListingId();

        return () => {
            isActive = false;
            controller.abort();
        };
    }, [listingSlug, locale]);

    useEffect(() => {
        if (!articleSlug) {
            setArticleId(null);
            setIsArticleLoading(false);
            return;
        }

        const controller = new AbortController();
        let isActive = true;

        const loadArticleId = async () => {
            setIsArticleLoading(true);
            try {
                const response = await fetch(
                    `/api/public/articles/${encodeURIComponent(articleSlug)}?locale=${encodeURIComponent(locale)}`,
                    {
                        cache: "no-store",
                        signal: controller.signal,
                    }
                );

                if (!response.ok) {
                    if (isActive) {
                        setArticleId(null);
                    }
                    return;
                }

                const data = (await response.json()) as PublicArticleDetailResponse;
                if (isActive) {
                    setArticleId(typeof data.article?.id === "string" ? data.article.id : null);
                }
            } catch {
                if (isActive && !controller.signal.aborted) {
                    setArticleId(null);
                }
            } finally {
                if (isActive) {
                    setIsArticleLoading(false);
                }
            }
        };

        void loadArticleId();

        return () => {
            isActive = false;
            controller.abort();
        };
    }, [articleSlug, locale]);

    useEffect(() => {
        if (!projectSlug) {
            setProjectId(null);
            setIsProjectLoading(false);
            return;
        }

        const controller = new AbortController();
        let isActive = true;

        const loadProjectId = async () => {
            setIsProjectLoading(true);
            try {
                const response = await fetch(
                    `/api/public/projects/${encodeURIComponent(projectSlug)}?locale=${encodeURIComponent(locale)}`,
                    {
                        cache: "no-store",
                        signal: controller.signal,
                    }
                );

                if (!response.ok) {
                    if (isActive) {
                        setProjectId(null);
                    }
                    return;
                }

                const data = (await response.json()) as PublicProjectDetailResponse;
                if (isActive) {
                    setProjectId(typeof data.project?.id === "string" ? data.project.id : null);
                }
            } catch {
                if (isActive && !controller.signal.aborted) {
                    setProjectId(null);
                }
            } finally {
                if (isActive) {
                    setIsProjectLoading(false);
                }
            }
        };

        void loadProjectId();

        return () => {
            isActive = false;
            controller.abort();
        };
    }, [projectSlug, locale]);

    return (
        <div className="fixed bottom-6 left-6 z-[70] hidden md:flex flex-col items-start gap-3">
            <div
                className={`flex flex-col gap-2 transition-all duration-200 ${
                    isOpen
                        ? "pointer-events-auto translate-y-0 opacity-100"
                        : "pointer-events-none translate-y-2 opacity-0"
                }`}
                aria-hidden={!isOpen}
            >
                {actions.map((action, index) => {
                    const Icon = action.icon;
                    const transitionStyle = {
                        transitionDelay: `${index * 45}ms`,
                    };

                    if (action.disabled) {
                        return (
                            <span
                                key={action.id}
                                style={transitionStyle}
                                className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white/95 px-4 py-2 text-sm font-semibold text-gray-400 shadow-lg backdrop-blur cursor-not-allowed"
                            >
                                <Icon className="h-4 w-4" />
                                <span>{action.label}</span>
                            </span>
                        );
                    }

                    return (
                        <Link
                            key={action.id}
                            href={action.href}
                            style={transitionStyle}
                            className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white/95 px-4 py-2 text-sm font-semibold text-gray-700 shadow-lg backdrop-blur transition hover:-translate-y-0.5 hover:border-orange-200 hover:text-orange-600"
                        >
                            <Icon className="h-4 w-4" />
                            <span>{action.label}</span>
                        </Link>
                    );
                })}
                {onHideAll ? (
                    <button
                        type="button"
                        onClick={() => {
                            setIsOpen(false);
                            onHideAll();
                        }}
                        className="inline-flex items-center gap-2 rounded-full border border-red-200 bg-white/95 px-4 py-2 text-sm font-semibold text-red-600 shadow-lg backdrop-blur transition hover:-translate-y-0.5 hover:border-red-300 hover:bg-red-50"
                    >
                        <EyeOff className="h-4 w-4" />
                        <span>Paneli Gizle</span>
                    </button>
                ) : null}
            </div>

            <button
                type="button"
                aria-label={isOpen ? "Admin kısayollarını kapat" : "Admin kısayollarını aç"}
                aria-expanded={isOpen}
                onClick={() => setIsOpen((previous) => !previous)}
                className="flex h-14 w-14 items-center justify-center rounded-full border border-orange-600 bg-orange-500 text-white shadow-[0_20px_34px_rgba(236,104,3,0.35)] transition hover:bg-orange-600"
            >
                {isOpen ? <X className="h-6 w-6" /> : <Plus className="h-6 w-6" />}
            </button>
        </div>
    );
}
