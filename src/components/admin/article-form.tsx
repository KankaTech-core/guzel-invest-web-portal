"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import {
    ArrowLeft,
    Check,
    ChevronDown,
    CloudUpload,
    Plus,
    Settings2,
    Tag,
    X,
} from "lucide-react";
import { cn, getMediaUrl, slugify } from "@/lib/utils";
import { UnsavedChangesModal } from "@/components/admin/unsaved-changes-modal";
import { MediaOptimizationModal } from "@/components/admin/media-optimization-modal";

type ArticleStatusValue = "DRAFT" | "PUBLISHED" | "ARCHIVED" | "REMOVED";
type MediaOptimizationState = "hidden" | "optimizing" | "completed";

type LeaveIntent =
    | {
        type: "href";
        href: string;
        external: boolean;
    }
    | {
        type: "back";
    };

interface ArticleFormData {
    id?: string;
    title: string;
    slug: string;
    excerpt: string;
    content: string;
    category: string;
    tags: string[];
    status: ArticleStatusValue;
    coverImageUrl: string | null;
    coverThumbnailUrl: string | null;
}

interface ArticleFormProps {
    article?: Partial<ArticleFormData>;
    isNew?: boolean;
    authorName?: string;
}

interface UploadResponse {
    url: string;
    thumbnailUrl: string;
}

interface PendingCoverMedia {
    file: File;
    previewUrl: string;
}

const DEFAULT_EDITOR_HEADING = "Başlık";

const STATUS_LABELS: Record<ArticleStatusValue, string> = {
    DRAFT: "Taslak",
    PUBLISHED: "Yayında",
    ARCHIVED: "Arşiv",
    REMOVED: "Kaldırıldı",
};

const STATUS_ACTION_META: Record<
    ArticleStatusValue,
    { label: string; title: string; message: string; buttonClassName: string }
> = {
    DRAFT: {
        label: "Taslak",
        title: "Taslağa Al",
        message: "Makaleyi taslak olarak kaydetmek istediğinize emin misiniz?",
        buttonClassName:
            "border-gray-300 bg-white text-gray-700 hover:bg-gray-100",
    },
    PUBLISHED: {
        label: "Yayınla",
        title: "Yayınla",
        message: "Makaleyi yayınlamak istediğinize emin misiniz?",
        buttonClassName:
            "border-orange-500 bg-orange-500 text-white hover:bg-orange-600",
    },
    ARCHIVED: {
        label: "Arşivle",
        title: "Arşivle",
        message: "Makaleyi arşivlemek istediğinize emin misiniz?",
        buttonClassName:
            "border-gray-300 bg-white text-gray-700 hover:bg-gray-100",
    },
    REMOVED: {
        label: "Kaldır",
        title: "Kaldır",
        message: "Makaleyi kaldırmak istediğinize emin misiniz?",
        buttonClassName:
            "border-red-200 bg-red-50 text-red-700 hover:bg-red-100",
    },
};

const DEFAULT_CATEGORY_OPTIONS = [
    "Yatırım Rehberi",
    "Piyasa Analizi",
    "Alım Satım",
    "Mülk Yönetimi",
    "Vergi ve Hukuk",
];

const DEFAULT_TAG_OPTIONS = [
    "Alanya",
    "Yatırım",
    "Kira",
    "Gayrimenkul",
    "Piyasa",
];

const MEDIA_OPTIMIZATION_SUCCESS_DURATION_MS = 1100;
const TARGET_EDITOR_MAX_CHAR_COUNT = 53;
const TARGET_EDITOR_CHARACTER_TO_CH_RATIO = 0.76;
const TARGET_EDITOR_LINE_LENGTH =
    TARGET_EDITOR_MAX_CHAR_COUNT * TARGET_EDITOR_CHARACTER_TO_CH_RATIO;
const BLOCKNOTE_HORIZONTAL_PADDING_REM = 2.7;

const BlockNoteEditor = dynamic(
    () => import("@/components/admin/blocknote-editor").then((module) => module.BlockNoteEditor),
    {
        ssr: false,
    }
);

const wait = (ms: number) =>
    new Promise<void>((resolve) => {
        setTimeout(resolve, ms);
    });

const defaultFormState: ArticleFormData = {
    title: "",
    slug: "",
    excerpt: "",
    content: `<h1>${DEFAULT_EDITOR_HEADING}</h1><p></p>`,
    category: "",
    tags: [],
    status: "DRAFT",
    coverImageUrl: null,
    coverThumbnailUrl: null,
};

const parseApiError = (data: unknown): string | null => {
    if (!data || typeof data !== "object") return null;
    const payload = data as Record<string, unknown>;

    if (typeof payload.error === "string" && payload.error.trim().length > 0) {
        return payload.error;
    }

    const issues = payload.issues as
        | { fieldErrors?: Record<string, string[] | undefined> }
        | undefined;

    const firstFieldIssue = issues?.fieldErrors
        ? Object.values(issues.fieldErrors)
            .flat()
            .find((message): message is string => typeof message === "string" && message.length > 0)
        : null;

    return firstFieldIssue || null;
};

const createInlineFileName = (index: number, mimeType: string): string => {
    const extension = mimeType.split("/")[1] || "png";
    return `article-inline-${Date.now()}-${index}.${extension}`;
};

const normalizeTitleValue = (value: string): string =>
    value.replace(/\s+/g, " ").trim().slice(0, 180);

const normalizeCategoryValue = (value: string): string =>
    value.replace(/\s+/g, " ").trim().slice(0, 60);

const normalizeTagValue = (value: string): string =>
    value.replace(/\s+/g, " ").trim().slice(0, 40);

const getPlainTextLength = (content: string): number =>
    content
        .replace(/<[^>]*>/g, " ")
        .replace(/\s+/g, " ")
        .trim().length;

const decodeHtmlEntities = (value: string): string =>
    value
        .replace(/&nbsp;/gi, " ")
        .replace(/&amp;/gi, "&")
        .replace(/&lt;/gi, "<")
        .replace(/&gt;/gi, ">")
        .replace(/&quot;/gi, "\"")
        .replace(/&#39;|&apos;/gi, "'");

const stripHtml = (value: string): string =>
    decodeHtmlEntities(value.replace(/<[^>]*>/g, " "));

const escapeHtml = (value: string): string =>
    value
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");

const toParagraphHtml = (value: string): string => {
    const normalizedText = decodeHtmlEntities(value).replace(/\s+/g, " ").trim();
    if (!normalizedText) return "";
    return `<p>${escapeHtml(normalizedText)}</p>`;
};

const normalizeBodyContent = (rawBody: string, headingToSkip?: string): string => {
    const normalizedBody = (rawBody || "").trim();
    if (!normalizedBody) return "<p></p>";

    const firstTagIndex = normalizedBody.search(/</);

    if (firstTagIndex === -1) {
        const plain = normalizeTitleValue(normalizedBody);
        if (
            headingToSkip &&
            plain &&
            plain.toLocaleLowerCase("tr-TR") === headingToSkip.toLocaleLowerCase("tr-TR")
        ) {
            return "<p></p>";
        }

        return toParagraphHtml(normalizedBody) || "<p></p>";
    }

    const leadingText = normalizedBody.slice(0, firstTagIndex).trim();
    const trailingHtml = normalizedBody.slice(firstTagIndex).trim();
    const leadingPlain = normalizeTitleValue(leadingText);
    const shouldSkipLeadingText =
        headingToSkip &&
        leadingPlain &&
        leadingPlain.toLocaleLowerCase("tr-TR") === headingToSkip.toLocaleLowerCase("tr-TR");

    const leadingParagraph = shouldSkipLeadingText ? "" : toParagraphHtml(leadingText);
    const safeTrailing = trailingHtml.length > 0 ? trailingHtml : "<p></p>";

    return `${leadingParagraph}${safeTrailing}`.trim() || "<p></p>";
};

const ensureLeadingHeading = (
    rawContent: string,
    requestedTitle?: string
): { content: string; title: string } => {
    const fallbackTitle = normalizeTitleValue(requestedTitle || "") || DEFAULT_EDITOR_HEADING;
    const normalizedSource = (rawContent || "").trim();

    if (!normalizedSource) {
        return {
            content: `<h1>${escapeHtml(fallbackTitle)}</h1><p></p>`,
            title: fallbackTitle,
        };
    }

    const leadingHeadingMatch = normalizedSource.match(/^<h([1-6])\b[^>]*>([\s\S]*?)<\/h\1>/i);

    if (leadingHeadingMatch) {
        const normalizedHeading =
            normalizeTitleValue(stripHtml(leadingHeadingMatch[2])) || fallbackTitle;
        const restContent = normalizedSource.slice(leadingHeadingMatch[0].length).trim();
        const safeRest = normalizeBodyContent(restContent, normalizedHeading);

        return {
            content: `<h1>${escapeHtml(normalizedHeading)}</h1>${safeRest}`,
            title: normalizedHeading,
        };
    }

    const safeBody = normalizeBodyContent(normalizedSource, fallbackTitle);

    return {
        content: `<h1>${escapeHtml(fallbackTitle)}</h1>${safeBody}`,
        title: fallbackTitle,
    };
};

const extractLeadingHeadingTitle = (rawContent: string): string => {
    const headingMatch = (rawContent || "").match(/<h1\b[^>]*>([\s\S]*?)<\/h1>/i);
    return normalizeTitleValue(stripHtml(headingMatch?.[1] || ""));
};

const buildInitialFormState = (article?: Partial<ArticleFormData>): ArticleFormData => {
    const merged: ArticleFormData = {
        ...defaultFormState,
        ...article,
        id: article?.id,
        title: article?.title || "",
        slug: article?.slug || "",
        excerpt: article?.excerpt || "",
        content: article?.content || "",
        category: article?.category || "",
        tags: Array.isArray(article?.tags) ? article.tags.filter(Boolean) : [],
        status: (article?.status as ArticleStatusValue) || "DRAFT",
        coverImageUrl: article?.coverImageUrl || null,
        coverThumbnailUrl: article?.coverThumbnailUrl || null,
    };

    const normalizedEditor = ensureLeadingHeading(
        merged.content,
        merged.title || DEFAULT_EDITOR_HEADING
    );

    return {
        ...merged,
        title: normalizedEditor.title,
        content: normalizedEditor.content,
    };
};

export function ArticleForm({ article, isNew = false, authorName }: ArticleFormProps) {
    const router = useRouter();
    const pathname = usePathname();

    const [form, setForm] = useState<ArticleFormData>(() => buildInitialFormState(article));
    const [isSaving, setIsSaving] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [slugEdited, setSlugEdited] = useState(Boolean(article?.slug));
    const [categoryOptions, setCategoryOptions] = useState<string[]>(DEFAULT_CATEGORY_OPTIONS);
    const [tagOptions, setTagOptions] = useState<string[]>(DEFAULT_TAG_OPTIONS);
    const [pendingCover, setPendingCover] = useState<PendingCoverMedia | null>(null);
    const [mediaOptimizationState, setMediaOptimizationState] =
        useState<MediaOptimizationState>("hidden");
    const [isSidebarDrawerOpen, setIsSidebarDrawerOpen] = useState(false);
    const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
    const [isTagDropdownOpen, setIsTagDropdownOpen] = useState(false);
    const [pendingStatusAction, setPendingStatusAction] = useState<ArticleStatusValue | null>(null);
    const [isCoverDragActive, setIsCoverDragActive] = useState(false);
    const [categoryInput, setCategoryInput] = useState("");
    const [tagInput, setTagInput] = useState("");

    const [isLeavePromptOpen, setIsLeavePromptOpen] = useState(false);
    const [leaveIntent, setLeaveIntent] = useState<LeaveIntent | null>(null);
    const [leaveAction, setLeaveAction] = useState<null | "draft" | "publish">(null);

    const [inlineMediaVersion, setInlineMediaVersion] = useState(0);
    const pendingInlineImagesRef = useRef<Map<string, File>>(new Map());
    const trackedObjectUrlsRef = useRef<Set<string>>(new Set());

    const bypassUnsavedCheckRef = useRef(false);
    const currentUrlRef = useRef<string>("");
    const initialSnapshotRef = useRef<string>("");
    const categoryDropdownRef = useRef<HTMLDivElement | null>(null);
    const tagDropdownRef = useRef<HTMLDivElement | null>(null);
    const coverInputRef = useRef<HTMLInputElement | null>(null);
    const displayedAuthor = authorName?.trim() || "Admin";

    const coverPreview = useMemo(
        () => pendingCover?.previewUrl || getMediaUrl(form.coverImageUrl),
        [pendingCover, form.coverImageUrl]
    );

    const availableTagOptions = useMemo(
        () =>
            tagOptions.filter(
                (option) =>
                    !form.tags.some(
                        (tagValue) =>
                            tagValue.toLocaleLowerCase("tr-TR") ===
                            option.toLocaleLowerCase("tr-TR")
                    )
            ),
        [form.tags, tagOptions]
    );

    const filteredCategoryOptions = useMemo(() => {
        const query = normalizeCategoryValue(categoryInput).toLocaleLowerCase("tr-TR");
        if (!query) return categoryOptions;

        return categoryOptions.filter((option) =>
            option.toLocaleLowerCase("tr-TR").includes(query)
        );
    }, [categoryInput, categoryOptions]);

    const filteredTagOptions = useMemo(() => {
        const query = normalizeTagValue(tagInput).toLocaleLowerCase("tr-TR");
        if (!query) return availableTagOptions;

        return availableTagOptions.filter((option) =>
            option.toLocaleLowerCase("tr-TR").includes(query)
        );
    }, [availableTagOptions, tagInput]);

    const runWithNavigationBypass = useCallback((callback: () => void) => {
        bypassUnsavedCheckRef.current = true;
        callback();
        setTimeout(() => {
            bypassUnsavedCheckRef.current = false;
        }, 0);
    }, []);

    const safePush = useCallback(
        (href: string) => {
            runWithNavigationBypass(() => router.push(href));
        },
        [router, runWithNavigationBypass]
    );

    const safeBack = useCallback(() => {
        runWithNavigationBypass(() => router.back());
    }, [router, runWithNavigationBypass]);

    const revokeObjectUrl = useCallback((url: string) => {
        if (!trackedObjectUrlsRef.current.has(url)) return;
        URL.revokeObjectURL(url);
        trackedObjectUrlsRef.current.delete(url);
    }, []);

    const trackObjectUrl = useCallback((url: string) => {
        trackedObjectUrlsRef.current.add(url);
    }, []);

    const clearPendingInlineImages = useCallback(() => {
        for (const url of pendingInlineImagesRef.current.keys()) {
            revokeObjectUrl(url);
        }
        pendingInlineImagesRef.current.clear();
        setInlineMediaVersion((prev) => prev + 1);
    }, [revokeObjectUrl]);

    const buildUnsavedSnapshot = useCallback(
        (data: ArticleFormData, cover: PendingCoverMedia | null) => ({
            formData: data,
            pendingCover: cover
                ? {
                    name: cover.file.name,
                    size: cover.file.size,
                    type: cover.file.type,
                    lastModified: cover.file.lastModified,
                }
                : null,
            pendingInlineImages: Array.from(pendingInlineImagesRef.current.entries()).map(
                ([url, file]) => ({
                    url,
                    name: file.name,
                    size: file.size,
                    type: file.type,
                    lastModified: file.lastModified,
                })
            ),
        }),
        []
    );

    const currentSnapshot = useMemo(
        () => {
            // Snapshot must be recalculated when inline media map mutates.
            void inlineMediaVersion;
            return JSON.stringify(buildUnsavedSnapshot(form, pendingCover));
        },
        [buildUnsavedSnapshot, form, pendingCover, inlineMediaVersion]
    );

    useEffect(() => {
        if (!initialSnapshotRef.current) {
            initialSnapshotRef.current = currentSnapshot;
        }
    }, [currentSnapshot]);

    const hasUnsavedChanges = useMemo(() => {
        if (!initialSnapshotRef.current) return false;
        return initialSnapshotRef.current !== currentSnapshot;
    }, [currentSnapshot]);

    useEffect(() => {
        if (typeof window !== "undefined") {
            currentUrlRef.current = window.location.href;
        }
    }, [pathname]);

    useEffect(() => {
        const mediaQuery = window.matchMedia("(min-width: 1024px)");
        const syncDrawerState = () => {
            setIsSidebarDrawerOpen(mediaQuery.matches);
        };

        syncDrawerState();
        mediaQuery.addEventListener("change", syncDrawerState);

        return () => {
            mediaQuery.removeEventListener("change", syncDrawerState);
        };
    }, []);

    useEffect(() => {
        if (!isCategoryDropdownOpen && !isTagDropdownOpen) return;

        const handleClickOutsideDropdowns = (event: MouseEvent) => {
            const target = event.target as Node;

            if (
                isCategoryDropdownOpen &&
                categoryDropdownRef.current &&
                !categoryDropdownRef.current.contains(target)
            ) {
                setIsCategoryDropdownOpen(false);
            }

            if (
                isTagDropdownOpen &&
                tagDropdownRef.current &&
                !tagDropdownRef.current.contains(target)
            ) {
                setIsTagDropdownOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutsideDropdowns);
        return () => {
            document.removeEventListener("mousedown", handleClickOutsideDropdowns);
        };
    }, [isCategoryDropdownOpen, isTagDropdownOpen]);

    useEffect(() => {
        const handleEscape = (event: KeyboardEvent) => {
            if (event.key !== "Escape") return;

            if (pendingStatusAction) {
                setPendingStatusAction(null);
            }
            if (isCategoryDropdownOpen) {
                setIsCategoryDropdownOpen(false);
            }
            if (isTagDropdownOpen) {
                setIsTagDropdownOpen(false);
            }
            if (isSidebarDrawerOpen) {
                setIsSidebarDrawerOpen(false);
            }
        };

        window.addEventListener("keydown", handleEscape);
        return () => {
            window.removeEventListener("keydown", handleEscape);
        };
    }, [isCategoryDropdownOpen, isSidebarDrawerOpen, isTagDropdownOpen, pendingStatusAction]);

    useEffect(() => {
        if (isSidebarDrawerOpen) return;
        setIsCategoryDropdownOpen(false);
        setIsTagDropdownOpen(false);
    }, [isSidebarDrawerOpen]);

    useEffect(() => {
        if (!isCategoryDropdownOpen) {
            setCategoryInput("");
        }
    }, [isCategoryDropdownOpen]);

    useEffect(() => {
        if (!isTagDropdownOpen) {
            setTagInput("");
        }
    }, [isTagDropdownOpen]);

    useEffect(() => {
        let isActive = true;

        const loadCategories = async () => {
            try {
                const response = await fetch("/api/admin/articles", { cache: "no-store" });
                if (!response.ok) return;

                const data = (await response.json()) as Array<{
                    category?: string | null;
                    tags?: string[] | null;
                }>;
                if (!isActive || !Array.isArray(data)) return;

                const dynamicOptions = data
                    .map((item) => item?.category?.trim() || "")
                    .filter((value) => value.length > 0);

                const dynamicTags = data
                    .flatMap((item) => (Array.isArray(item?.tags) ? item.tags : []))
                    .map((item) => item.trim())
                    .filter((value) => value.length > 0);

                if (dynamicOptions.length > 0) {
                    setCategoryOptions((prev) =>
                        Array.from(new Set([...prev, ...dynamicOptions])).slice(0, 30)
                    );
                }

                if (dynamicTags.length > 0) {
                    setTagOptions((prev) =>
                        Array.from(new Set([...prev, ...dynamicTags])).slice(0, 60)
                    );
                }
            } catch {
                // Optional preload only.
            }
        };

        void loadCategories();

        return () => {
            isActive = false;
        };
    }, []);

    useEffect(() => {
        const trimmed = form.category.trim();
        if (!trimmed) return;

        setCategoryOptions((prev) => {
            const exists = prev.some(
                (item) => item.toLocaleLowerCase("tr-TR") === trimmed.toLocaleLowerCase("tr-TR")
            );
            if (exists) return prev;
            return [trimmed, ...prev].slice(0, 30);
        });
    }, [form.category]);

    useEffect(() => {
        if (form.tags.length === 0) return;

        setTagOptions((prev) => {
            const merged = [...prev];

            for (const tag of form.tags) {
                const exists = merged.some(
                    (item) => item.toLocaleLowerCase("tr-TR") === tag.toLocaleLowerCase("tr-TR")
                );
                if (!exists) {
                    merged.unshift(tag);
                }
            }

            return merged.slice(0, 60);
        });
    }, [form.tags]);

    useEffect(() => {
        if (!form.content) {
            if (pendingInlineImagesRef.current.size > 0) {
                clearPendingInlineImages();
            }
            return;
        }

        const parser = new DOMParser();
        const documentFragment = parser.parseFromString(form.content, "text/html");
        const usedBlobUrls = new Set(
            Array.from(documentFragment.querySelectorAll("img"))
                .map((img) => img.getAttribute("src") || "")
                .filter((src) => src.startsWith("blob:"))
        );

        let changed = false;
        for (const url of pendingInlineImagesRef.current.keys()) {
            if (!usedBlobUrls.has(url)) {
                pendingInlineImagesRef.current.delete(url);
                revokeObjectUrl(url);
                changed = true;
            }
        }

        if (changed) {
            setInlineMediaVersion((prev) => prev + 1);
        }
    }, [form.content, clearPendingInlineImages, revokeObjectUrl]);

    useEffect(() => {
        const trackedUrls = trackedObjectUrlsRef.current;
        return () => {
            const urls = Array.from(trackedUrls);
            for (const url of urls) {
                URL.revokeObjectURL(url);
            }
            trackedUrls.clear();
        };
    }, []);

    const openLeavePrompt = useCallback(
        (intent: LeaveIntent) => {
            if (isLeavePromptOpen) return;
            setLeaveIntent(intent);
            setIsLeavePromptOpen(true);
        },
        [isLeavePromptOpen]
    );

    const closeLeavePrompt = useCallback(() => {
        setIsLeavePromptOpen(false);
        setLeaveIntent(null);
        setLeaveAction(null);
    }, []);

    useEffect(() => {
        const handleBeforeUnload = (event: BeforeUnloadEvent) => {
            if (!hasUnsavedChanges || bypassUnsavedCheckRef.current) return;
            event.preventDefault();
            event.returnValue = "";
        };

        window.addEventListener("beforeunload", handleBeforeUnload);
        return () => {
            window.removeEventListener("beforeunload", handleBeforeUnload);
        };
    }, [hasUnsavedChanges]);

    useEffect(() => {
        const handleLinkClick = (event: MouseEvent) => {
            if (!hasUnsavedChanges || bypassUnsavedCheckRef.current) return;

            const target = event.target as HTMLElement | null;
            const anchor = target?.closest("a") as HTMLAnchorElement | null;
            if (!anchor) return;

            const href = anchor.getAttribute("href");
            if (!href || href.startsWith("#")) return;
            if (anchor.target && anchor.target !== "_self") return;
            if (anchor.hasAttribute("download")) return;
            if (anchor.getAttribute("data-skip-unsaved") === "true") return;

            const url = new URL(href, window.location.href);
            event.preventDefault();
            event.stopPropagation();
            if ("stopImmediatePropagation" in event) {
                (event as unknown as { stopImmediatePropagation: () => void }).stopImmediatePropagation();
            }

            openLeavePrompt({
                type: "href",
                href: url.href,
                external: url.origin !== window.location.origin,
            });
        };

        document.addEventListener("click", handleLinkClick, true);
        return () => {
            document.removeEventListener("click", handleLinkClick, true);
        };
    }, [hasUnsavedChanges, openLeavePrompt]);

    useEffect(() => {
        const handlePopState = () => {
            if (!hasUnsavedChanges || bypassUnsavedCheckRef.current) {
                currentUrlRef.current = window.location.href;
                return;
            }

            const destination = window.location.href;
            const fallbackUrl = currentUrlRef.current || "/admin/makaleler";

            runWithNavigationBypass(() => router.push(fallbackUrl));
            openLeavePrompt({
                type: "href",
                href: destination,
                external: new URL(destination).origin !== window.location.origin,
            });
        };

        window.addEventListener("popstate", handlePopState);
        return () => {
            window.removeEventListener("popstate", handlePopState);
        };
    }, [hasUnsavedChanges, openLeavePrompt, router, runWithNavigationBypass]);

    const uploadImageFile = async (file: File): Promise<UploadResponse> => {
        const payload = new FormData();
        payload.append("file", file);

        const response = await fetch("/api/admin/articles/media", {
            method: "POST",
            body: payload,
        });

        if (!response.ok) {
            const data = await response.json().catch(() => null);
            throw new Error(parseApiError(data) || "Görsel yüklenemedi");
        }

        return response.json();
    };

    const registerInlineImage = useCallback(
        async (file: File): Promise<string | null> => {
            const localUrl = URL.createObjectURL(file);
            trackObjectUrl(localUrl);
            pendingInlineImagesRef.current.set(localUrl, file);
            setInlineMediaVersion((prev) => prev + 1);
            return localUrl;
        },
        [trackObjectUrl]
    );

    const handleCoverFile = (file: File | null) => {
        if (!file) return;

        const previewUrl = URL.createObjectURL(file);
        trackObjectUrl(previewUrl);

        setPendingCover((previous) => {
            if (previous) {
                revokeObjectUrl(previous.previewUrl);
            }

            return {
                file,
                previewUrl,
            };
        });

        setErrorMessage(null);
    };

    const handleCoverUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0] || null;
        handleCoverFile(file);
        event.target.value = "";
    };

    const handleCoverDrop = (event: React.DragEvent<HTMLButtonElement>) => {
        event.preventDefault();
        setIsCoverDragActive(false);
        const file = event.dataTransfer.files?.[0] || null;
        handleCoverFile(file);
    };

    const handleCoverDragOver = (event: React.DragEvent<HTMLButtonElement>) => {
        event.preventDefault();
        if (!isCoverDragActive) {
            setIsCoverDragActive(true);
        }
    };

    const handleCoverDragLeave = (event: React.DragEvent<HTMLButtonElement>) => {
        event.preventDefault();
        if (event.currentTarget.contains(event.relatedTarget as Node | null)) {
            return;
        }
        setIsCoverDragActive(false);
    };

    const addTag = (rawValue: string) => {
        const normalized = normalizeTagValue(rawValue);
        if (!normalized) return;

        setForm((prev) => {
            const exists = prev.tags.some(
                (item) =>
                    item.toLocaleLowerCase("tr-TR") === normalized.toLocaleLowerCase("tr-TR")
            );
            if (exists) return prev;
            return {
                ...prev,
                tags: [...prev.tags, normalized].slice(0, 20),
            };
        });
    };

    const addCategoryOption = (rawValue: string) => {
        const normalized = normalizeCategoryValue(rawValue);
        if (!normalized) return;

        setCategoryOptions((prev) => {
            const exists = prev.some(
                (item) => item.toLocaleLowerCase("tr-TR") === normalized.toLocaleLowerCase("tr-TR")
            );
            if (exists) return prev;
            return [normalized, ...prev].slice(0, 30);
        });

        setForm((prev) => ({
            ...prev,
            category: normalized,
        }));
        setCategoryInput("");
        setIsCategoryDropdownOpen(false);
    };

    const createTagFromInput = (rawValue: string) => {
        const normalized = normalizeTagValue(rawValue);
        if (!normalized) return;

        setTagOptions((prev) => {
            const exists = prev.some(
                (item) => item.toLocaleLowerCase("tr-TR") === normalized.toLocaleLowerCase("tr-TR")
            );
            if (exists) return prev;
            return [normalized, ...prev].slice(0, 60);
        });

        addTag(normalized);
        setTagInput("");
    };

    const removeTag = (value: string) => {
        setForm((prev) => ({
            ...prev,
            tags: prev.tags.filter(
                (item) => item.toLocaleLowerCase("tr-TR") !== value.toLocaleLowerCase("tr-TR")
            ),
        }));
    };

    const handleContentChange = useCallback(
        (nextContent: string) => {
            setForm((prev) => {
                const nextTitle = extractLeadingHeadingTitle(nextContent) || prev.title;
                return {
                    ...prev,
                    content: nextContent,
                    title: nextTitle,
                    slug: slugEdited ? prev.slug : slugify(nextTitle),
                };
            });
        },
        [slugEdited]
    );

    const dataUrlToFile = async (dataUrl: string, index: number): Promise<File> => {
        const response = await fetch(dataUrl);
        const blob = await response.blob();
        const fileName = createInlineFileName(index, blob.type || "image/png");
        return new File([blob], fileName, {
            type: blob.type || "image/png",
        });
    };

    const processMediaBeforeSubmit = async (content: string) => {
        let nextCoverImageUrl = form.coverImageUrl;
        let nextCoverThumbnailUrl = form.coverThumbnailUrl;
        let nextContent = content;
        let hasUploads = false;

        if (pendingCover) {
            const uploadedCover = await uploadImageFile(pendingCover.file);
            nextCoverImageUrl = uploadedCover.url;
            nextCoverThumbnailUrl = uploadedCover.thumbnailUrl;
            hasUploads = true;
        }

        const parser = new DOMParser();
        const doc = parser.parseFromString(content || "", "text/html");
        const images = Array.from(doc.querySelectorAll("img"));

        for (const [index, image] of images.entries()) {
            const src = image.getAttribute("src")?.trim();
            if (!src) continue;

            let fileToUpload: File | null = null;

            if (src.startsWith("blob:")) {
                fileToUpload = pendingInlineImagesRef.current.get(src) || null;
                if (!fileToUpload) {
                    throw new Error("Yapıştırılan görsel bulunamadı. Lütfen tekrar yapıştırıp kaydedin.");
                }
            } else if (src.startsWith("data:image/")) {
                fileToUpload = await dataUrlToFile(src, index);
            }

            if (!fileToUpload) continue;

            const uploaded = await uploadImageFile(fileToUpload);
            image.setAttribute("src", getMediaUrl(uploaded.url));

            hasUploads = true;

            if (src.startsWith("blob:")) {
                pendingInlineImagesRef.current.delete(src);
                revokeObjectUrl(src);
            }
        }

        nextContent = doc.body.innerHTML;

        return {
            content: nextContent,
            coverImageUrl: nextCoverImageUrl,
            coverThumbnailUrl: nextCoverThumbnailUrl,
            hasUploads,
        };
    };

    const finalizeAfterSuccessfulSave = (
        nextForm: ArticleFormData,
        savedArticle: {
            id: string;
            slug: string;
            status: ArticleStatusValue;
            content?: string;
            tags?: string[];
            coverImageUrl?: string | null;
            coverThumbnailUrl?: string | null;
        }
    ) => {
        if (pendingCover) {
            revokeObjectUrl(pendingCover.previewUrl);
        }

        clearPendingInlineImages();
        setPendingCover(null);

        const normalizedForm: ArticleFormData = {
            ...nextForm,
            id: savedArticle.id,
            slug: savedArticle.slug,
            status: savedArticle.status,
            content: savedArticle.content ?? nextForm.content,
            tags: Array.isArray(savedArticle.tags) ? savedArticle.tags : nextForm.tags,
            coverImageUrl:
                savedArticle.coverImageUrl !== undefined
                    ? savedArticle.coverImageUrl
                    : nextForm.coverImageUrl,
            coverThumbnailUrl:
                savedArticle.coverThumbnailUrl !== undefined
                    ? savedArticle.coverThumbnailUrl
                    : nextForm.coverThumbnailUrl,
        };

        setForm(normalizedForm);
        initialSnapshotRef.current = JSON.stringify(buildUnsavedSnapshot(normalizedForm, null));
    };

    const submit = async (options: {
        statusOverride?: ArticleStatusValue;
        skipRedirect?: boolean;
    } = {}): Promise<boolean> => {
        const statusToSave = options.statusOverride ?? form.status;
        const normalizedEditor = ensureLeadingHeading(form.content, form.title || DEFAULT_EDITOR_HEADING);
        const titleToSave = normalizedEditor.title;
        const contentToSave = normalizedEditor.content;
        const plainTextLength = getPlainTextLength(contentToSave);

        if (!titleToSave) {
            setErrorMessage("Başlık zorunludur");
            return false;
        }

        if (plainTextLength < 20) {
            setErrorMessage("Makale içeriği en az 20 karakter olmalıdır");
            return false;
        }

        setErrorMessage(null);
        setIsSaving(true);
        setMediaOptimizationState("hidden");

        try {
            const needsMediaProcessing =
                Boolean(pendingCover) ||
                contentToSave.includes("blob:") ||
                contentToSave.includes("data:image/");

            if (needsMediaProcessing) {
                setMediaOptimizationState("optimizing");
            }

            const processed = await processMediaBeforeSubmit(contentToSave);

            if (processed.hasUploads) {
                setMediaOptimizationState("completed");
                await wait(MEDIA_OPTIMIZATION_SUCCESS_DURATION_MS);
            }

            setMediaOptimizationState("hidden");

            const payload = {
                title: titleToSave,
                slug: form.slug.trim() || undefined,
                excerpt: form.excerpt.trim() || undefined,
                content: processed.content,
                category: form.category.trim() || undefined,
                tags: form.tags,
                status: statusToSave,
                coverImageUrl: processed.coverImageUrl,
                coverThumbnailUrl: processed.coverThumbnailUrl,
            };

            const endpoint = isNew ? "/api/admin/articles" : `/api/admin/articles/${form.id}`;
            const method = isNew ? "POST" : "PATCH";

            const response = await fetch(endpoint, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                const data = await response.json().catch(() => null);
                throw new Error(parseApiError(data) || "Makale kaydedilemedi");
            }

            const savedArticle = await response.json();

            finalizeAfterSuccessfulSave(
                {
                    ...form,
                    title: titleToSave,
                    content: processed.content,
                    coverImageUrl: processed.coverImageUrl,
                    coverThumbnailUrl: processed.coverThumbnailUrl,
                    status: statusToSave,
                },
                {
                    id: savedArticle.id,
                    slug: savedArticle.slug,
                    status: savedArticle.status,
                    content: savedArticle.content,
                    tags: Array.isArray(savedArticle.tags) ? savedArticle.tags : undefined,
                    coverImageUrl: savedArticle.coverImageUrl,
                    coverThumbnailUrl: savedArticle.coverThumbnailUrl,
                }
            );

            if (!options.skipRedirect) {
                if (isNew) {
                    safePush(`/admin/makaleler/${savedArticle.id}`);
                } else {
                    router.refresh();
                }
            }

            return true;
        } catch (error) {
            setMediaOptimizationState("hidden");
            const message = error instanceof Error ? error.message : "Makale kaydedilemedi";
            setErrorMessage(message);
            return false;
        } finally {
            setIsSaving(false);
        }
    };

    const handleStatusAction = (status: ArticleStatusValue) => {
        setPendingStatusAction(status);
    };

    const handleConfirmStatusAction = async () => {
        if (!pendingStatusAction) return;

        const actionToRun = pendingStatusAction;
        setPendingStatusAction(null);
        await submit({ statusOverride: actionToRun });
    };

    const handleLeaveSave = async (statusOverride: ArticleStatusValue) => {
        if (!leaveIntent) return;
        setLeaveAction(statusOverride === "DRAFT" ? "draft" : "publish");

        const success = await submit({
            statusOverride,
            skipRedirect: true,
        });

        if (!success) {
            setLeaveAction(null);
            return;
        }

        const intent = leaveIntent;
        closeLeavePrompt();

        if (intent.type === "back") {
            safeBack();
            return;
        }

        if (intent.external) {
            bypassUnsavedCheckRef.current = true;
            window.location.assign(intent.href);
            return;
        }

        safePush(intent.href);
    };

    const handleLeaveDiscard = () => {
        if (!leaveIntent) return;

        const intent = leaveIntent;
        closeLeavePrompt();

        if (intent.type === "back") {
            safeBack();
            return;
        }

        if (intent.external) {
            bypassUnsavedCheckRef.current = true;
            window.location.assign(intent.href);
            return;
        }

        safePush(intent.href);
    };

    const pendingActionMeta = pendingStatusAction
        ? STATUS_ACTION_META[pendingStatusAction]
        : null;

    return (
        <div className="mx-auto w-full max-w-[2200px] space-y-6 px-4 sm:px-10 lg:px-16 xl:px-24 2xl:px-32">
            <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                    <button
                        type="button"
                        onClick={() => {
                            if (hasUnsavedChanges) {
                                openLeavePrompt({ type: "back" });
                                return;
                            }
                            safeBack();
                        }}
                        className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 transition hover:text-gray-900"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Makalelere dön
                    </button>
                    <h1 className="mt-2 text-2xl font-bold text-gray-900">
                        {isNew ? "Yeni Makale" : "Makale Düzenle"}
                    </h1>
                    <p className="text-sm text-gray-500">
                        Durum: <span className="font-medium text-gray-700">{STATUS_LABELS[form.status]}</span>
                    </p>
                </div>
                <button
                    type="button"
                    onClick={() => setIsSidebarDrawerOpen((prev) => !prev)}
                    className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
                >
                    <Settings2 className="h-4 w-4" />
                    {isSidebarDrawerOpen ? "Paneli Kapat" : "Paneli Aç"}
                </button>
            </div>

            {errorMessage ? (
                <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    {errorMessage}
                </div>
            ) : null}

            <div className="relative">
                <div
                    className={cn(
                        "transition-[padding-right] duration-300",
                        isSidebarDrawerOpen ? "lg:pr-[420px]" : "lg:pr-0"
                    )}
                >
                    <section className="min-w-0">
                        <div
                            className="mx-auto w-full"
                            style={{
                                maxWidth: `calc(${TARGET_EDITOR_LINE_LENGTH}ch + ${BLOCKNOTE_HORIZONTAL_PADDING_REM}rem)`,
                            }}
                        >
                            <BlockNoteEditor
                                value={form.content}
                                onChange={handleContentChange}
                                onUploadImage={registerInlineImage}
                                defaultHeading={DEFAULT_EDITOR_HEADING}
                                className="min-h-[calc(100vh-11rem)]"
                            />
                        </div>
                    </section>
                </div>

                {isSidebarDrawerOpen ? (
                    <button
                        type="button"
                        aria-label="Ayar panelini kapat"
                        onClick={() => setIsSidebarDrawerOpen(false)}
                        className="fixed inset-0 z-30 bg-black/20 backdrop-blur-[1px]"
                    />
                ) : null}

                <aside
                    className={cn(
                        "fixed right-0 top-0 z-40 h-screen w-[min(92vw,390px)] border-l border-gray-200 bg-white shadow-2xl transition-transform duration-300",
                        isSidebarDrawerOpen ? "translate-x-0" : "translate-x-full"
                    )}
                >
                    <div className="flex h-full flex-col">
                        <div className="flex items-center justify-between border-b border-gray-200 px-4 py-3">
                            <p className="text-sm font-semibold text-gray-900">Makale Ayarları</p>
                            <button
                                type="button"
                                onClick={() => setIsSidebarDrawerOpen(false)}
                                className="inline-flex items-center justify-center rounded-md border border-gray-200 p-1.5 text-gray-600 transition hover:bg-gray-100"
                                aria-label="Paneli kapat"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        </div>

                        <section className="flex-1 space-y-5 overflow-y-auto p-4">
                            <div>
                                <h3 className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                                    Kapak Fotoğrafı
                                </h3>
                                <input
                                    ref={coverInputRef}
                                    type="file"
                                    accept="image/jpeg,image/png,image/webp,image/gif"
                                    className="hidden"
                                    onChange={handleCoverUpload}
                                />
                                <button
                                    type="button"
                                    onClick={() => coverInputRef.current?.click()}
                                    onDrop={handleCoverDrop}
                                    onDragOver={handleCoverDragOver}
                                    onDragLeave={handleCoverDragLeave}
                                    className={cn(
                                        "mt-2 w-full overflow-hidden rounded-xl border bg-white text-left transition",
                                        isCoverDragActive
                                            ? "border-orange-400 ring-2 ring-orange-100"
                                            : "border-dashed border-gray-300 hover:border-orange-300"
                                    )}
                                >
                                    {coverPreview ? (
                                        <div className="relative">
                                            <img
                                                src={coverPreview}
                                                alt="Kapak görseli"
                                                className="h-44 w-full object-cover"
                                            />
                                            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent px-3 py-2 text-xs font-medium text-white">
                                                Değiştirmek için tıklayın veya sürükleyip bırakın
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="flex h-44 flex-col items-center justify-center gap-2 bg-gray-50 px-4 text-center">
                                            <CloudUpload className="h-5 w-5 text-orange-500" />
                                            <p className="text-sm font-semibold text-gray-700">
                                                Kapak fotoğrafı yükleyin
                                            </p>
                                            <p className="text-xs text-gray-500">
                                                Tıklayın veya sürükleyip bırakın (JPG, PNG, WEBP, GIF)
                                            </p>
                                        </div>
                                    )}
                                </button>

                                {form.coverImageUrl || pendingCover ? (
                                    <button
                                        type="button"
                                        onClick={() => {
                                            if (pendingCover) {
                                                revokeObjectUrl(pendingCover.previewUrl);
                                            }
                                            setPendingCover(null);
                                            setForm((prev) => ({
                                                ...prev,
                                                coverImageUrl: null,
                                                coverThumbnailUrl: null,
                                            }));
                                        }}
                                        className="mt-3 inline-flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-2 text-xs font-semibold text-gray-600 transition hover:bg-gray-50"
                                    >
                                        <X className="h-3.5 w-3.5" />
                                        Kaldır
                                    </button>
                                ) : null}
                            </div>

                            <div>
                                <h3 className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                                    Yazar
                                </h3>
                                <p className="mt-2 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-700">
                                    {displayedAuthor}
                                </p>
                            </div>

                            <div>
                                <h3 className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                                    Kısa Özet
                                </h3>
                                <textarea
                                    value={form.excerpt}
                                    onChange={(event) =>
                                        setForm((prev) => ({ ...prev, excerpt: event.target.value }))
                                    }
                                    rows={4}
                                    className="mt-2 w-full resize-y rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-800 outline-none focus:border-orange-300"
                                    placeholder="Liste sayfasında görünecek kısa açıklama..."
                                    maxLength={200}
                                />
                                <p className="mt-1 text-right text-xs text-gray-400">
                                    {form.excerpt.length}/200
                                </p>
                            </div>

                            <div>
                                <h3 className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                                    Slug
                                </h3>
                                <div className="mt-2 flex items-center overflow-hidden rounded-lg border border-gray-200 bg-gray-50">
                                    <span className="px-3 text-sm text-gray-500">/blog/</span>
                                    <input
                                        type="text"
                                        value={form.slug}
                                        onChange={(event) => {
                                            setSlugEdited(true);
                                            setForm((prev) => ({
                                                ...prev,
                                                slug: slugify(event.target.value),
                                            }));
                                        }}
                                        className="h-10 w-full bg-transparent px-2 text-sm text-gray-800 outline-none"
                                        placeholder="makale-slug"
                                        maxLength={220}
                                    />
                                </div>
                            </div>

                            <div>
                                <h3 className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                                    Kategori
                                </h3>
                                <div ref={categoryDropdownRef} className="relative mt-2">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setIsCategoryDropdownOpen((prev) => !prev);
                                            setIsTagDropdownOpen(false);
                                        }}
                                        className={cn(
                                            "flex h-10 w-full items-center justify-between rounded-lg border bg-white px-3 text-left text-sm transition",
                                            isCategoryDropdownOpen
                                                ? "border-orange-300 ring-2 ring-orange-100"
                                                : "border-gray-200 hover:border-gray-300"
                                        )}
                                    >
                                        <span className={form.category ? "text-gray-800" : "text-gray-500"}>
                                            {form.category || "Kategori seçin"}
                                        </span>
                                        <ChevronDown
                                            className={cn(
                                                "h-4 w-4 text-gray-500 transition",
                                                isCategoryDropdownOpen ? "rotate-180" : ""
                                            )}
                                        />
                                    </button>

                                    {isCategoryDropdownOpen ? (
                                        <div className="absolute z-20 mt-2 w-full rounded-xl border border-gray-200 bg-white p-2 shadow-xl">
                                            <div className="mb-2 flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 p-1.5">
                                                <input
                                                    type="text"
                                                    value={categoryInput}
                                                    onChange={(event) => setCategoryInput(event.target.value)}
                                                    onKeyDown={(event) => {
                                                        if (event.key === "Enter") {
                                                            event.preventDefault();
                                                            addCategoryOption(categoryInput);
                                                        }
                                                    }}
                                                    className="h-8 w-full bg-transparent px-2 text-sm text-gray-700 outline-none placeholder:text-gray-400"
                                                    placeholder="Yeni kategori yazın..."
                                                    maxLength={60}
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => addCategoryOption(categoryInput)}
                                                    disabled={!normalizeCategoryValue(categoryInput)}
                                                    className="inline-flex h-8 items-center rounded-md border border-orange-200 bg-white px-2.5 text-xs font-semibold text-orange-700 transition hover:bg-orange-50 disabled:cursor-not-allowed disabled:opacity-50"
                                                >
                                                    Ekle
                                                </button>
                                            </div>

                                            <div className="max-h-56 overflow-y-auto pr-1">
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setForm((prev) => ({ ...prev, category: "" }));
                                                        setCategoryInput("");
                                                        setIsCategoryDropdownOpen(false);
                                                    }}
                                                    className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm text-gray-600 transition hover:bg-gray-100"
                                                >
                                                    Kategori seçin
                                                    {!form.category ? <Check className="h-4 w-4 text-orange-500" /> : null}
                                                </button>

                                                {filteredCategoryOptions.length > 0 ? (
                                                    filteredCategoryOptions.map((option) => {
                                                        const isSelected =
                                                            option.toLocaleLowerCase("tr-TR") ===
                                                            form.category.toLocaleLowerCase("tr-TR");

                                                        return (
                                                            <button
                                                                key={option}
                                                                type="button"
                                                                onClick={() => {
                                                                    setForm((prev) => ({ ...prev, category: option }));
                                                                    setCategoryInput("");
                                                                    setIsCategoryDropdownOpen(false);
                                                                }}
                                                                className={cn(
                                                                    "flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm transition",
                                                                    isSelected
                                                                        ? "bg-orange-50 text-orange-700"
                                                                        : "text-gray-700 hover:bg-gray-100"
                                                                )}
                                                            >
                                                                {option}
                                                                {isSelected ? (
                                                                    <Check className="h-4 w-4 text-orange-500" />
                                                                ) : null}
                                                            </button>
                                                        );
                                                    })
                                                ) : (
                                                    <p className="px-3 py-2 text-xs text-gray-500">
                                                        Aramanıza uygun kategori bulunamadı.
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    ) : null}
                                </div>
                            </div>

                            <div>
                                <h3 className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                                    Etiketler
                                </h3>
                                <div ref={tagDropdownRef} className="relative mt-2">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setIsTagDropdownOpen((prev) => !prev);
                                            setIsCategoryDropdownOpen(false);
                                        }}
                                        className={cn(
                                            "flex h-10 w-full items-center justify-between rounded-lg border bg-white px-3 text-left text-sm transition",
                                            isTagDropdownOpen
                                                ? "border-orange-300 ring-2 ring-orange-100"
                                                : "border-gray-200 hover:border-gray-300"
                                        )}
                                    >
                                        <span className="text-gray-600">Etiket seçin</span>
                                        <ChevronDown
                                            className={cn(
                                                "h-4 w-4 text-gray-500 transition",
                                                isTagDropdownOpen ? "rotate-180" : ""
                                            )}
                                        />
                                    </button>

                                    {isTagDropdownOpen ? (
                                        <div className="absolute z-20 mt-2 w-full rounded-xl border border-gray-200 bg-white p-2 shadow-xl">
                                            <div className="mb-2 flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 p-1.5">
                                                <input
                                                    type="text"
                                                    value={tagInput}
                                                    onChange={(event) => setTagInput(event.target.value)}
                                                    onKeyDown={(event) => {
                                                        if (event.key === "Enter" || event.key === ",") {
                                                            event.preventDefault();
                                                            createTagFromInput(tagInput);
                                                        }
                                                    }}
                                                    className="h-8 w-full bg-transparent px-2 text-sm text-gray-700 outline-none placeholder:text-gray-400"
                                                    placeholder="Yeni etiket yazın..."
                                                    maxLength={40}
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => createTagFromInput(tagInput)}
                                                    disabled={!normalizeTagValue(tagInput)}
                                                    className="inline-flex h-8 items-center rounded-md border border-orange-200 bg-white px-2.5 text-xs font-semibold text-orange-700 transition hover:bg-orange-50 disabled:cursor-not-allowed disabled:opacity-50"
                                                >
                                                    Ekle
                                                </button>
                                            </div>

                                            <div className="max-h-56 overflow-y-auto pr-1">
                                                {filteredTagOptions.length > 0 ? (
                                                    filteredTagOptions.map((option) => (
                                                        <button
                                                            key={option}
                                                            type="button"
                                                            onClick={() => {
                                                                addTag(option);
                                                                setTagInput("");
                                                                setIsTagDropdownOpen(false);
                                                            }}
                                                            className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm text-gray-700 transition hover:bg-orange-50 hover:text-orange-700"
                                                        >
                                                            {option}
                                                            <Plus className="h-4 w-4 text-orange-500" />
                                                        </button>
                                                    ))
                                                ) : (
                                                    <p className="px-3 py-2 text-xs text-gray-500">
                                                        Uygun etiket bulunamadı, yeni etiket ekleyebilirsiniz.
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    ) : null}
                                </div>
                                <div className="mt-2 flex flex-wrap gap-2">
                                    {form.tags.length > 0 ? (
                                        form.tags.map((tagValue) => (
                                            <span
                                                key={tagValue}
                                                className="inline-flex items-center gap-1 rounded-full border border-orange-200 bg-orange-50 px-2.5 py-1 text-xs font-medium text-orange-700"
                                            >
                                                <Tag className="h-3 w-3" />
                                                {tagValue}
                                                <button
                                                    type="button"
                                                    onClick={() => removeTag(tagValue)}
                                                    className="rounded-full p-0.5 transition hover:bg-orange-100"
                                                >
                                                    <X className="h-3 w-3" />
                                                </button>
                                            </span>
                                        ))
                                    ) : (
                                        <span className="text-xs text-gray-500">Etiket yok</span>
                                    )}
                                </div>
                            </div>

                            <div>
                                <h3 className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                                    Yayın Aksiyonları
                                </h3>
                                <div className="mt-2 grid grid-cols-3 gap-2">
                                    <button
                                        type="button"
                                        onClick={() => void handleStatusAction("DRAFT")}
                                        disabled={isSaving}
                                        className="inline-flex items-center justify-center rounded-lg border border-gray-300 bg-white px-2 py-2 text-xs font-semibold text-gray-700 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-60"
                                    >
                                        Taslak
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => void handleStatusAction("PUBLISHED")}
                                        disabled={isSaving}
                                        className="inline-flex items-center justify-center rounded-lg border border-orange-500 bg-orange-500 px-2 py-2 text-xs font-semibold text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-60"
                                    >
                                        Yayınla
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => void handleStatusAction("REMOVED")}
                                        disabled={isSaving}
                                        className="inline-flex items-center justify-center rounded-lg border border-red-200 bg-red-50 px-2 py-2 text-xs font-semibold text-red-700 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-60"
                                    >
                                        Kaldır
                                    </button>
                                </div>
                            </div>
                        </section>
                    </div>
                </aside>
            </div>

            {pendingActionMeta ? (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <button
                        type="button"
                        aria-label="Onay penceresini kapat"
                        onClick={() => setPendingStatusAction(null)}
                        className="absolute inset-0 bg-black/35 backdrop-blur-[1px]"
                    />

                    <div className="relative z-10 w-full max-w-md rounded-2xl border border-gray-200 bg-white p-5 shadow-2xl">
                        <h3 className="text-lg font-semibold text-gray-900">{pendingActionMeta.title}</h3>
                        <p className="mt-2 text-sm text-gray-600">{pendingActionMeta.message}</p>

                        <div className="mt-5 flex items-center justify-end gap-2">
                            <button
                                type="button"
                                onClick={() => setPendingStatusAction(null)}
                                className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-100"
                            >
                                Vazgeç
                            </button>
                            <button
                                type="button"
                                onClick={() => void handleConfirmStatusAction()}
                                disabled={isSaving}
                                className={cn(
                                    "rounded-lg border px-4 py-2 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-60",
                                    pendingActionMeta.buttonClassName
                                )}
                            >
                                {pendingActionMeta.label}
                            </button>
                        </div>
                    </div>
                </div>
            ) : null}

            <UnsavedChangesModal
                isOpen={isLeavePromptOpen}
                isLoading={isSaving}
                loadingAction={leaveAction}
                onCancel={closeLeavePrompt}
                onDiscard={handleLeaveDiscard}
                onSaveDraft={() => void handleLeaveSave("DRAFT")}
                onPublish={() => void handleLeaveSave("PUBLISHED")}
            />

            <MediaOptimizationModal
                isOpen={mediaOptimizationState !== "hidden"}
                stage={
                    mediaOptimizationState === "completed"
                        ? "completed"
                        : "optimizing"
                }
            />
        </div>
    );
}
