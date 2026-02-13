"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import type { LucideIcon } from "lucide-react";
import { BookOpenText, Building2, EyeOff, FileText, PencilLine, Plus, X } from "lucide-react";

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

interface AdminQuickActionsProps {
    onHideAll?: () => void;
}

const decodePathSegment = (segment: string): string => {
    try {
        return decodeURIComponent(segment);
    } catch {
        return segment;
    }
};

export function AdminQuickActions({ onHideAll }: AdminQuickActionsProps) {
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(false);
    const [listingId, setListingId] = useState<string | null>(null);
    const [isListingLoading, setIsListingLoading] = useState(false);
    const [articleId, setArticleId] = useState<string | null>(null);
    const [isArticleLoading, setIsArticleLoading] = useState(false);

    const pathSegments = useMemo(
        () => pathname.split("/").filter(Boolean),
        [pathname]
    );
    const locale = pathSegments[0] ?? "tr";
    const listingSlug =
        pathSegments[1] === "ilan" && pathSegments[2]
            ? decodePathSegment(pathSegments[2])
            : null;
    const articleSlug =
        pathSegments[1] === "blog" && pathSegments[2]
            ? decodePathSegment(pathSegments[2])
            : null;
    const isListingPage = Boolean(listingSlug);
    const isArticlePage = Boolean(articleSlug);

    const actions = useMemo<QuickAction[]>(() => {
        const nextActions: QuickAction[] = [
            {
                id: "listings",
                label: "İlanlara git",
                href: "/admin/ilanlar",
                icon: FileText,
            },
            {
                id: "articles",
                label: "Makalelere git",
                href: "/admin/makaleler",
                icon: BookOpenText,
            },
            {
                id: "portal",
                label: "Portala git",
                href: "/admin",
                icon: Building2,
            },
        ];

        if (isListingPage) {
            nextActions.unshift({
                id: "listing",
                label: "İlana git",
                href: listingId ? `/admin/ilanlar/${listingId}` : "#",
                icon: PencilLine,
                disabled: !listingId || isListingLoading,
            });
        }

        if (isArticlePage) {
            nextActions.unshift({
                id: "article",
                label: "Makaleye git",
                href: articleId ? `/admin/makaleler/${articleId}` : "#",
                icon: PencilLine,
                disabled: !articleId || isArticleLoading,
            });
        }

        return nextActions;
    }, [articleId, isArticleLoading, isArticlePage, isListingPage, isListingLoading, listingId]);

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
