"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Archive, CircleOff, Edit, Eye } from "lucide-react";
import { cn } from "@/lib/utils";
import { ConfirmModal } from "@/components/admin/confirm-modal";

type ArticleStatusValue = "DRAFT" | "PUBLISHED" | "ARCHIVED" | "REMOVED";

interface ArticleRowActionsProps {
    id: string;
    slug: string;
    status: ArticleStatusValue;
}

export function ArticleRowActions({ id, slug, status }: ArticleRowActionsProps) {
    const router = useRouter();
    const [confirmAction, setConfirmAction] = useState<null | "archive" | "remove">(null);
    const [isLoading, setIsLoading] = useState(false);

    const canArchive = status !== "ARCHIVED" && status !== "REMOVED";
    const canRemove = status !== "REMOVED";

    const handleConfirm = async () => {
        if (!confirmAction) return;

        setIsLoading(true);
        try {
            const nextStatus = confirmAction === "archive" ? "ARCHIVED" : "REMOVED";
            const response = await fetch(`/api/admin/articles/${id}/status`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status: nextStatus }),
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || "İşlem başarısız");
            }

            router.refresh();
        } catch (error) {
            console.error("Article action error:", error);
        } finally {
            setIsLoading(false);
            setConfirmAction(null);
        }
    };

    const confirmConfig =
        confirmAction === "archive"
            ? {
                title: "Makale arşivlensin mi?",
                description: "Arşivlenen makale blog sayfasında görünmez.",
                confirmLabel: "Arşivle",
                tone: "warning" as const,
            }
            : {
                title: "Makale yayından kaldırılsın mı?",
                description: "Bu işlem makalenin durumunu Kaldırıldı yapar.",
                confirmLabel: "Kaldır",
                tone: "danger" as const,
            };

    return (
        <>
            <div className="flex items-center justify-end gap-2">
                <Link
                    href={`/tr/blog/${slug}`}
                    className="rounded-lg p-2 transition-colors hover:bg-gray-100"
                    target="_blank"
                >
                    <Eye className="h-4 w-4 text-gray-400" />
                </Link>
                <Link
                    href={`/admin/makaleler/${id}`}
                    className="rounded-lg p-2 transition-colors hover:bg-gray-100"
                >
                    <Edit className="h-4 w-4 text-gray-400" />
                </Link>
                <button
                    type="button"
                    onClick={() => canArchive && setConfirmAction("archive")}
                    className={cn(
                        "rounded-lg p-2 transition-colors",
                        canArchive ? "hover:bg-gray-100" : "cursor-not-allowed opacity-50"
                    )}
                    title="Arşivle"
                    disabled={!canArchive}
                >
                    <Archive className="h-4 w-4 text-gray-400" />
                </button>
                <button
                    type="button"
                    onClick={() => canRemove && setConfirmAction("remove")}
                    className={cn(
                        "rounded-lg p-2 transition-colors",
                        canRemove ? "hover:bg-red-50" : "cursor-not-allowed opacity-50"
                    )}
                    title="Yayından Kaldır"
                    disabled={!canRemove}
                >
                    <CircleOff className="h-4 w-4 text-red-400" />
                </button>
            </div>

            <ConfirmModal
                isOpen={Boolean(confirmAction)}
                title={confirmConfig.title}
                description={confirmConfig.description}
                confirmLabel={confirmConfig.confirmLabel}
                tone={confirmConfig.tone}
                isLoading={isLoading}
                onCancel={() => {
                    if (!isLoading) setConfirmAction(null);
                }}
                onConfirm={handleConfirm}
            />
        </>
    );
}
