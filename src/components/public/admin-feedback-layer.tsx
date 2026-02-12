"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { usePathname } from "next/navigation";
import {
    CheckCircle2,
    Eye,
    EyeOff,
    Loader2,
    MessageSquare,
    RefreshCcw,
    Send,
    X,
} from "lucide-react";

interface FeedbackAuthor {
    id: string;
    name: string;
    role: "ADMIN" | "EDITOR" | "VIEWER";
}

interface FeedbackMessage {
    id: string;
    content: string;
    createdAt: string;
    author: FeedbackAuthor;
}

interface FeedbackThread {
    id: string;
    pagePath: string;
    anchorX: number;
    anchorY: number;
    hidden: boolean;
    createdAt: string;
    updatedAt: string;
    createdBy: FeedbackAuthor;
    messages: FeedbackMessage[];
}

interface ThreadsResponse {
    threads?: FeedbackThread[];
    error?: string;
}

interface ThreadMutationResponse {
    thread?: FeedbackThread;
    error?: string;
}

interface ViewportState {
    pageWidth: number;
    pageHeight: number;
    scrollX: number;
    scrollY: number;
    viewportWidth: number;
    viewportHeight: number;
}

type PanelView = "list" | "thread";

const THREAD_REFRESH_INTERVAL_MS = 10000;
const MESSAGE_MAX_LENGTH = 1500;

const readViewportState = (): ViewportState => {
    if (typeof window === "undefined") {
        return {
            pageWidth: 1,
            pageHeight: 1,
            scrollX: 0,
            scrollY: 0,
            viewportWidth: 0,
            viewportHeight: 0,
        };
    }

    const doc = document.documentElement;
    const body = document.body;
    const pageWidth = Math.max(
        doc.scrollWidth,
        doc.offsetWidth,
        body?.scrollWidth ?? 0,
        body?.offsetWidth ?? 0,
        1
    );
    const pageHeight = Math.max(
        doc.scrollHeight,
        doc.offsetHeight,
        body?.scrollHeight ?? 0,
        body?.offsetHeight ?? 0,
        1
    );

    return {
        pageWidth,
        pageHeight,
        scrollX: window.scrollX,
        scrollY: window.scrollY,
        viewportWidth: window.innerWidth,
        viewportHeight: window.innerHeight,
    };
};

const toScreenPosition = (
    anchorX: number,
    anchorY: number,
    viewportState: ViewportState
) => {
    const absoluteX = anchorX * viewportState.pageWidth;
    const absoluteY = anchorY * viewportState.pageHeight;
    return {
        left: absoluteX - viewportState.scrollX,
        top: absoluteY - viewportState.scrollY,
    };
};

const formatTimestamp = (value: string) => {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
        return "-";
    }
    return new Intl.DateTimeFormat("tr-TR", {
        day: "2-digit",
        month: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
    }).format(date);
};

const normalizePath = (value: string) => {
    const trimmed = value.trim();
    if (!trimmed.startsWith("/")) {
        return "/";
    }
    const normalized = trimmed.replace(/\/+$/, "") || "/";
    const segments = normalized.split("/").filter(Boolean);

    // Aggregate all listing detail pages under one shared template scope.
    // Example: /tr/ilan/some-slug -> /tr/ilan/[slug]
    if (segments.length >= 3 && segments[1] === "ilan") {
        return `/${segments[0]}/ilan/[slug]`;
    }

    return normalized;
};

const PinGlyph = () => (
    <span className="relative inline-block h-4 w-4">
        <span className="absolute inset-0 rotate-45 rounded-[50%_50%_50%_0] bg-current" />
    </span>
);

export function AdminFeedbackLayer() {
    const pathname = usePathname();
    const normalizedPathname = useMemo(() => normalizePath(pathname), [pathname]);

    const [isPanelOpen, setIsPanelOpen] = useState(false);
    const [panelView, setPanelView] = useState<PanelView>("list");
    const [arePinsVisible, setArePinsVisible] = useState(true);
    const [isCreateMode, setIsCreateMode] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [threads, setThreads] = useState<FeedbackThread[]>([]);
    const [activeThreadId, setActiveThreadId] = useState<string | null>(null);
    const [newThreadMessage, setNewThreadMessage] = useState("");
    const [replyMessage, setReplyMessage] = useState("");
    const [pendingAnchor, setPendingAnchor] = useState<{
        anchorX: number;
        anchorY: number;
    } | null>(null);
    const [viewportState, setViewportState] = useState<ViewportState>(() =>
        readViewportState()
    );

    const activeThread = useMemo(
        () => threads.find((thread) => thread.id === activeThreadId) ?? null,
        [activeThreadId, threads]
    );

    const refreshThreads = useCallback(
        async (options?: { silent?: boolean }) => {
            if (!options?.silent) {
                setIsLoading(true);
            }
            setErrorMessage(null);

            try {
                const response = await fetch(
                    `/api/admin/feedback/threads?path=${encodeURIComponent(normalizedPathname)}`,
                    { cache: "no-store" }
                );
                const data = (await response.json()) as ThreadsResponse;

                if (!response.ok) {
                    throw new Error(data.error || "Mesajlar alınamadı");
                }

                setThreads(Array.isArray(data.threads) ? data.threads : []);
            } catch (error) {
                setErrorMessage(
                    error instanceof Error ? error.message : "Mesajlar alınamadı"
                );
            } finally {
                if (!options?.silent) {
                    setIsLoading(false);
                }
            }
        },
        [normalizedPathname]
    );

    useEffect(() => {
        if (!threads.length) {
            setActiveThreadId(null);
            setPanelView("list");
            return;
        }

        if (!activeThreadId || !threads.some((thread) => thread.id === activeThreadId)) {
            setActiveThreadId(threads[0].id);
        }
    }, [threads, activeThreadId]);

    useEffect(() => {
        setActiveThreadId(null);
        setPendingAnchor(null);
        setNewThreadMessage("");
        setReplyMessage("");
        setIsCreateMode(false);
        setPanelView("list");
        setErrorMessage(null);
        void refreshThreads();
    }, [normalizedPathname, refreshThreads]);

    useEffect(() => {
        void refreshThreads();

        const intervalId = window.setInterval(() => {
            void refreshThreads({ silent: true });
        }, THREAD_REFRESH_INTERVAL_MS);

        return () => window.clearInterval(intervalId);
    }, [refreshThreads]);

    useEffect(() => {
        const update = () => setViewportState(readViewportState());
        let frame = 0;
        const updateOnFrame = () => {
            if (frame) return;
            frame = window.requestAnimationFrame(() => {
                frame = 0;
                update();
            });
        };

        update();
        window.addEventListener("scroll", updateOnFrame, { passive: true });
        window.addEventListener("resize", updateOnFrame);
        const intervalId = window.setInterval(update, 1200);

        return () => {
            if (frame) {
                window.cancelAnimationFrame(frame);
            }
            window.clearInterval(intervalId);
            window.removeEventListener("scroll", updateOnFrame);
            window.removeEventListener("resize", updateOnFrame);
        };
    }, []);

    useEffect(() => {
        if (!isCreateMode) {
            return;
        }

        const previousCursor = document.body.style.cursor;
        document.body.style.cursor = "crosshair";

        const handlePageClick = (event: MouseEvent) => {
            const target = event.target as HTMLElement | null;
            if (target?.closest("[data-feedback-ui='true']")) {
                return;
            }

            event.preventDefault();
            event.stopPropagation();

            const state = readViewportState();
            const anchorX = Math.min(
                1,
                Math.max(0, (event.clientX + state.scrollX) / state.pageWidth)
            );
            const anchorY = Math.min(
                1,
                Math.max(0, (event.clientY + state.scrollY) / state.pageHeight)
            );

            setPendingAnchor({ anchorX, anchorY });
            setIsCreateMode(false);
            setViewportState(state);
            setPanelView("list");
            setIsPanelOpen(true);
        };

        window.addEventListener("click", handlePageClick, true);

        return () => {
            window.removeEventListener("click", handlePageClick, true);
            document.body.style.cursor = previousCursor;
        };
    }, [isCreateMode]);

    useEffect(() => {
        const handleEscape = (event: KeyboardEvent) => {
            if (event.key !== "Escape") {
                return;
            }

            if (isCreateMode) {
                setIsCreateMode(false);
                return;
            }

            if (pendingAnchor) {
                setPendingAnchor(null);
            }
        };

        window.addEventListener("keydown", handleEscape);
        return () => window.removeEventListener("keydown", handleEscape);
    }, [isCreateMode, pendingAnchor]);

    const handleCreateThread = async () => {
        if (!pendingAnchor) {
            return;
        }

        const content = newThreadMessage.trim();
        if (!content) {
            setErrorMessage("Mesaj içeriği boş olamaz.");
            return;
        }

        setIsSubmitting(true);
        setErrorMessage(null);

        try {
            const response = await fetch("/api/admin/feedback/threads", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    pagePath: normalizedPathname,
                    anchorX: pendingAnchor.anchorX,
                    anchorY: pendingAnchor.anchorY,
                    message: content,
                }),
            });

            const data = (await response.json()) as ThreadMutationResponse;
            if (!response.ok || !data.thread) {
                throw new Error(data.error || "Mesaj başlığı oluşturulamadı");
            }

            setThreads((previous) => [
                data.thread!,
                ...previous.filter((thread) => thread.id !== data.thread!.id),
            ]);
            setActiveThreadId(data.thread.id);
            setPendingAnchor(null);
            setNewThreadMessage("");
            setReplyMessage("");
            setArePinsVisible(true);
            setPanelView("thread");
            setIsPanelOpen(true);
        } catch (error) {
            setErrorMessage(
                error instanceof Error ? error.message : "Mesaj başlığı oluşturulamadı"
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleSendReply = async () => {
        if (!activeThread) {
            return;
        }

        const content = replyMessage.trim();
        if (!content) {
            return;
        }

        setIsSubmitting(true);
        setErrorMessage(null);

        try {
            const response = await fetch(
                `/api/admin/feedback/threads/${activeThread.id}/messages`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ content }),
                }
            );
            const data = (await response.json()) as ThreadMutationResponse;

            if (!response.ok || !data.thread) {
                throw new Error(data.error || "Mesaj gönderilemedi");
            }

            setThreads((previous) =>
                [data.thread!, ...previous.filter((thread) => thread.id !== data.thread!.id)]
            );
            setActiveThreadId(data.thread.id);
            setReplyMessage("");
            setPanelView("thread");
            setIsPanelOpen(true);
        } catch (error) {
            setErrorMessage(
                error instanceof Error ? error.message : "Mesaj gönderilemedi"
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCompleteThread = async () => {
        if (!activeThread) {
            return;
        }

        setIsSubmitting(true);
        setErrorMessage(null);

        try {
            const response = await fetch(
                `/api/admin/feedback/threads/${activeThread.id}`,
                {
                    method: "PATCH",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ completed: true }),
                }
            );

            const data = (await response.json()) as ThreadMutationResponse;
            if (!response.ok || !data.thread) {
                throw new Error(data.error || "Geri bildirim tamamlanamadı");
            }

            setThreads((previous) =>
                previous.filter((thread) => thread.id !== data.thread!.id)
            );
            setActiveThreadId(null);
            setReplyMessage("");
            setPanelView("list");
        } catch (error) {
            setErrorMessage(
                error instanceof Error ? error.message : "Geri bildirim tamamlanamadı"
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    const pendingPosition = pendingAnchor
        ? toScreenPosition(pendingAnchor.anchorX, pendingAnchor.anchorY, viewportState)
        : null;

    return (
        <>
            {arePinsVisible
                ? threads.map((thread) => {
                    const position = toScreenPosition(
                        thread.anchorX,
                        thread.anchorY,
                        viewportState
                    );
                    const isVisible =
                        position.left >= -40 &&
                        position.left <= viewportState.viewportWidth + 40 &&
                        position.top >= -40 &&
                        position.top <= viewportState.viewportHeight + 40;

                    if (!isVisible) {
                        return null;
                    }

                    const isActive = activeThreadId === thread.id;

                    return (
                        <button
                            key={thread.id}
                            type="button"
                            data-feedback-ui="true"
                            onClick={() => {
                                setActiveThreadId(thread.id);
                                setPanelView("thread");
                                setIsPanelOpen(true);
                            }}
                            className="fixed z-[88] h-8 w-8 -translate-x-1/2 -translate-y-full"
                            style={{ left: position.left, top: position.top }}
                            title={`${thread.createdBy.name} • ${thread.messages.length} mesaj`}
                        >
                            <span
                                className={`absolute inset-0 rotate-45 rounded-[50%_50%_50%_0] border shadow-md transition ${
                                    isActive
                                        ? "border-orange-600 bg-orange-500"
                                        : "border-slate-700 bg-slate-900 hover:border-orange-600 hover:bg-orange-500"
                                }`}
                            />
                            <span className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-white">
                                {thread.messages.length}
                            </span>
                        </button>
                    );
                })
                : null}

            {arePinsVisible && pendingPosition ? (
                <span
                    className="fixed z-[88] h-8 w-8 -translate-x-1/2 -translate-y-full"
                    style={{ left: pendingPosition.left, top: pendingPosition.top }}
                    data-feedback-ui="true"
                >
                    <span className="absolute inset-0 rotate-45 rounded-[50%_50%_50%_0] border border-sky-600 bg-sky-500 shadow-[0_0_0_6px_rgba(14,165,233,0.2)]" />
                    <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-white">
                        •
                    </span>
                </span>
            ) : null}

            <aside
                data-feedback-ui="true"
                className={`fixed bottom-24 right-24 z-[90] hidden w-[380px] overflow-hidden rounded-2xl border border-slate-200 bg-white/95 shadow-[0_24px_55px_rgba(15,23,42,0.22)] backdrop-blur md:flex md:flex-col transition-all duration-200 ${
                    isPanelOpen
                        ? "pointer-events-auto translate-y-0 opacity-100"
                        : "pointer-events-none translate-y-3 opacity-0"
                }`}
            >
                <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
                            Geri Bildirim
                        </p>
                        <p className="text-sm font-semibold text-slate-900">
                            {normalizedPathname}
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            onClick={() => void refreshThreads()}
                            className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 text-slate-500 hover:text-slate-900"
                        >
                            {isLoading ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                                <RefreshCcw className="h-4 w-4" />
                            )}
                        </button>
                        <button
                            type="button"
                            onClick={() => {
                                setIsPanelOpen(false);
                                setIsCreateMode(false);
                                setPendingAnchor(null);
                            }}
                            className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 text-slate-500 hover:text-slate-900 hover:border-slate-300"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    </div>
                </div>

                <div className="flex items-center gap-2 border-b border-slate-200 px-4 py-2">
                    <button
                        type="button"
                        onClick={() => setPanelView("list")}
                        className={`rounded-full px-3 py-1 text-xs font-semibold transition ${
                            panelView === "list"
                                ? "bg-slate-900 text-white"
                                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                        }`}
                    >
                        Mesajlar
                    </button>
                    <button
                        type="button"
                        disabled={!activeThread}
                        onClick={() => {
                            if (activeThread) {
                                setPanelView("thread");
                            }
                        }}
                        className={`rounded-full px-3 py-1 text-xs font-semibold transition ${
                            panelView === "thread"
                                ? "bg-orange-500 text-white"
                                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                        } disabled:cursor-not-allowed disabled:opacity-50`}
                    >
                        Thread
                    </button>
                </div>

                {errorMessage ? (
                    <div className="border-b border-red-200 bg-red-50 px-4 py-2 text-xs font-medium text-red-600">
                        {errorMessage}
                    </div>
                ) : null}

                {pendingAnchor ? (
                    <div className="border-b border-slate-200 px-4 py-3">
                        <textarea
                            value={newThreadMessage}
                            onChange={(event) =>
                                setNewThreadMessage(event.target.value.slice(0, MESSAGE_MAX_LENGTH))
                            }
                            placeholder="Örn: Bu section'ı kaldıralım."
                            className="min-h-24 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-700 outline-none focus:border-orange-300 focus:ring-2 focus:ring-orange-200"
                        />
                        <div className="mt-2 flex items-center justify-between">
                            <span className="text-[11px] text-slate-400">
                                {newThreadMessage.length}/{MESSAGE_MAX_LENGTH}
                            </span>
                            <div className="flex items-center gap-2">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setPendingAnchor(null);
                                        setNewThreadMessage("");
                                    }}
                                    className="rounded-full border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-500 hover:border-slate-300 hover:text-slate-700"
                                >
                                    Vazgeç
                                </button>
                                <button
                                    type="button"
                                    onClick={() => void handleCreateThread()}
                                    disabled={isSubmitting}
                                    className="inline-flex items-center gap-1 rounded-full bg-orange-500 px-3 py-1 text-xs font-semibold text-white hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                    {isSubmitting ? (
                                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                    ) : null}
                                    Oluştur
                                </button>
                            </div>
                        </div>
                    </div>
                ) : null}

                <div className="min-h-0 flex-1">
                    {panelView === "list" ? (
                        <div className="h-full overflow-y-auto">
                            {threads.length === 0 ? (
                                <div className="px-4 py-6 text-sm text-slate-500">
                                    Bu sayfada aktif geri bildirim yok.
                                </div>
                            ) : (
                                threads.map((thread) => {
                                    const lastMessage = thread.messages[thread.messages.length - 1];
                                    const isActive = thread.id === activeThreadId;

                                    return (
                                        <button
                                            key={thread.id}
                                            type="button"
                                            onClick={() => {
                                                setActiveThreadId(thread.id);
                                                setPanelView("thread");
                                            }}
                                            className={`flex w-full flex-col gap-1 border-b border-slate-100 px-4 py-3 text-left transition ${
                                                isActive
                                                    ? "bg-orange-50"
                                                    : "hover:bg-slate-50"
                                            }`}
                                        >
                                            <div className="flex items-center justify-between">
                                                <span className="text-xs font-semibold text-slate-800">
                                                    {thread.createdBy.name}
                                                </span>
                                                <span className="text-[11px] text-slate-400">
                                                    {formatTimestamp(thread.updatedAt)}
                                                </span>
                                            </div>
                                            <p className="line-clamp-2 text-xs text-slate-600">
                                                {lastMessage?.content || "-"}
                                            </p>
                                            <span className="w-fit rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-600">
                                                {thread.messages.length} mesaj
                                            </span>
                                        </button>
                                    );
                                })
                            )}
                        </div>
                    ) : (
                        <div className="flex h-full flex-col px-4 py-3">
                            {activeThread ? (
                                <>
                                    <div className="mb-2 flex items-center justify-between">
                                        <p className="text-xs font-semibold text-slate-600">
                                            {activeThread.createdBy.name}
                                        </p>
                                        <button
                                            type="button"
                                            onClick={() => void handleCompleteThread()}
                                            disabled={isSubmitting}
                                            className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-700 hover:bg-emerald-100 disabled:cursor-not-allowed disabled:opacity-60"
                                        >
                                            <CheckCircle2 className="h-3.5 w-3.5" />
                                            Tamamlandı
                                        </button>
                                    </div>

                                    <div className="min-h-0 flex-1 space-y-2 overflow-y-auto rounded-xl border border-slate-200 bg-slate-50 p-3">
                                        {activeThread.messages.map((message) => (
                                            <article
                                                key={message.id}
                                                className="rounded-lg border border-slate-200 bg-white px-3 py-2"
                                            >
                                                <div className="mb-1 flex items-center justify-between gap-2">
                                                    <span className="text-xs font-semibold text-slate-700">
                                                        {message.author.name}
                                                    </span>
                                                    <span className="text-[11px] text-slate-400">
                                                        {formatTimestamp(message.createdAt)}
                                                    </span>
                                                </div>
                                                <p className="whitespace-pre-wrap text-sm text-slate-700">
                                                    {message.content}
                                                </p>
                                            </article>
                                        ))}
                                    </div>

                                    <div className="mt-3">
                                        <textarea
                                            value={replyMessage}
                                            onChange={(event) =>
                                                setReplyMessage(
                                                    event.target.value.slice(0, MESSAGE_MAX_LENGTH)
                                                )
                                            }
                                            placeholder="Bu mesaja yanıt ekle..."
                                            className="min-h-20 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-700 outline-none focus:border-orange-300 focus:ring-2 focus:ring-orange-200"
                                        />
                                        <div className="mt-2 flex items-center justify-between">
                                            <span className="text-[11px] text-slate-400">
                                                {replyMessage.length}/{MESSAGE_MAX_LENGTH}
                                            </span>
                                            <button
                                                type="button"
                                                onClick={() => void handleSendReply()}
                                                disabled={isSubmitting || !replyMessage.trim()}
                                                className="inline-flex items-center gap-1 rounded-full bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white hover:bg-black disabled:cursor-not-allowed disabled:opacity-60"
                                            >
                                                {isSubmitting ? (
                                                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                                ) : (
                                                    <Send className="h-3.5 w-3.5" />
                                                )}
                                                Gönder
                                            </button>
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <div className="flex h-full items-center justify-center rounded-xl border border-dashed border-slate-300 bg-slate-50 text-center text-sm text-slate-500">
                                    Önce bir mesaj seçin.
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </aside>

            <div
                data-feedback-ui="true"
                className="fixed bottom-6 right-6 z-[91] hidden flex-col items-end gap-3 md:flex"
            >
                <button
                    type="button"
                    aria-label={arePinsVisible ? "Tüm pinleri gizle" : "Tüm pinleri göster"}
                    onClick={() => {
                        setArePinsVisible((previous) => {
                            const next = !previous;
                            if (!next) {
                                setIsCreateMode(false);
                                setPendingAnchor(null);
                            }
                            return next;
                        });
                    }}
                    className={`flex h-11 w-11 items-center justify-center rounded-full border text-white shadow-md transition ${
                        arePinsVisible
                            ? "border-slate-900 bg-slate-900 hover:border-orange-600 hover:bg-orange-500"
                            : "border-slate-400 bg-slate-500 hover:bg-slate-600"
                    }`}
                >
                    {arePinsVisible ? (
                        <EyeOff className="h-4 w-4" />
                    ) : (
                        <Eye className="h-4 w-4" />
                    )}
                </button>

                <button
                    type="button"
                    aria-label={isCreateMode ? "Pin seçim modunu kapat" : "Yeni pin oluştur"}
                    onClick={() => {
                        setArePinsVisible(true);
                        setIsPanelOpen(true);
                        setPanelView("list");
                        setPendingAnchor(null);
                        setNewThreadMessage("");
                        setIsCreateMode((previous) => !previous);
                    }}
                    className={`flex h-11 w-11 items-center justify-center rounded-full border text-white shadow-md transition ${
                        isCreateMode
                            ? "border-sky-600 bg-sky-500"
                            : "border-slate-900 bg-slate-900 hover:border-orange-600 hover:bg-orange-500"
                    }`}
                >
                    <PinGlyph />
                </button>

                <button
                    type="button"
                    aria-label={isPanelOpen ? "Thread panelini kapat" : "Thread panelini aç"}
                    aria-expanded={isPanelOpen}
                    onClick={() => {
                        setIsPanelOpen((previous) => {
                            const next = !previous;
                            if (next) {
                                setPanelView("list");
                            } else {
                                setIsCreateMode(false);
                                setPendingAnchor(null);
                            }
                            return next;
                        });
                    }}
                    className="flex h-14 w-14 items-center justify-center rounded-full border border-slate-900 bg-slate-900 text-white shadow-[0_22px_40px_rgba(15,23,42,0.38)] transition hover:bg-orange-500 hover:border-orange-600"
                >
                    {isPanelOpen ? <X className="h-6 w-6" /> : <MessageSquare className="h-6 w-6" />}
                </button>
            </div>
        </>
    );
}
