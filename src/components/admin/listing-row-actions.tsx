"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Archive, CircleOff, Edit, Eye } from "lucide-react";
import { cn } from "@/lib/utils";
import { ConfirmModal } from "./confirm-modal";

type ListingStatusValue = "DRAFT" | "PUBLISHED" | "ARCHIVED" | "REMOVED";

interface ListingRowActionsProps {
    id: string;
    slug: string;
    status: ListingStatusValue;
    homepageHeroSlot: number | null;
}

export function ListingRowActions({
    id,
    slug,
    status,
    homepageHeroSlot,
}: ListingRowActionsProps) {
    const router = useRouter();
    const [confirmAction, setConfirmAction] = useState<
        null | "archive" | "remove" | "homepageHeroGuard"
    >(null);
    const [isLoading, setIsLoading] = useState(false);

    const canArchive = status !== "ARCHIVED" && status !== "REMOVED";
    const canRemove = status === "PUBLISHED";

    const handleConfirm = async () => {
        if (!confirmAction) return;

        if (confirmAction === "homepageHeroGuard") {
            setConfirmAction(null);
            router.push("/admin/ilanlar");
            return;
        }

        setIsLoading(true);
        try {
            const nextStatus = confirmAction === "archive" ? "ARCHIVED" : "REMOVED";
            const response = await fetch(`/api/admin/listings/${id}/status`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status: nextStatus }),
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || "İşlem başarısız");
            }

            router.refresh();
        } catch (err) {
            console.error("Listing action error:", err);
        } finally {
            setIsLoading(false);
            setConfirmAction(null);
        }
    };

    const confirmConfig =
        confirmAction === "archive"
            ? {
                title: "İlan arşivlensin mi?",
                description: "Arşivlenen ilan sitede görünmez.",
                confirmLabel: "Arşivle",
                cancelLabel: "Vazgeç",
                tone: "warning" as const,
            }
            : confirmAction === "homepageHeroGuard"
                ? {
                    title: "Bu ilan ana sayfada gösteriliyor",
                    description:
                        `Bu ilan Ana Sayfa ${homepageHeroSlot} alanında gösteriliyor. Yayından kaldırmadan önce bu slot için başka bir ilan seçmelisiniz.`,
                    confirmLabel: "İlanlara Git",
                    cancelLabel: "Vazgeç",
                    tone: "warning" as const,
                }
            : {
                title: "İlan yayından kaldırılsın mı?",
                description: "Bu işlem ilanın durumunu Kaldırıldı yapar.",
                confirmLabel: "Kaldır",
                cancelLabel: "Vazgeç",
                tone: "danger" as const,
            };

    return (
        <>
            <div className="flex items-center justify-end gap-2">
                <Link
                    href={`/tr/ilan/${slug}`}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    target="_blank"
                >
                    <Eye className="w-4 h-4 text-gray-400" />
                </Link>
                <Link
                    href={`/admin/ilanlar/${id}`}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                    <Edit className="w-4 h-4 text-gray-400" />
                </Link>
                <button
                    type="button"
                    onClick={() => canArchive && setConfirmAction("archive")}
                    className={cn(
                        "p-2 rounded-lg transition-colors",
                        canArchive ? "hover:bg-gray-100" : "opacity-50 cursor-not-allowed"
                    )}
                    title="Arşivle"
                    disabled={!canArchive}
                >
                    <Archive className="w-4 h-4 text-gray-400" />
                </button>
                <button
                    type="button"
                    onClick={() => {
                        if (!canRemove) return;
                        if (homepageHeroSlot !== null) {
                            setConfirmAction("homepageHeroGuard");
                            return;
                        }
                        setConfirmAction("remove");
                    }}
                    className={cn(
                        "p-2 rounded-lg transition-colors",
                        canRemove ? "hover:bg-red-50" : "opacity-50 cursor-not-allowed"
                    )}
                    title={
                        canRemove
                            ? "Yayından Kaldır"
                            : "Sadece yayındaki ilanlar yayından kaldırılabilir"
                    }
                    disabled={!canRemove}
                >
                    <CircleOff className="w-4 h-4 text-red-400" />
                </button>
            </div>

            <ConfirmModal
                isOpen={Boolean(confirmAction)}
                title={confirmConfig.title}
                description={confirmConfig.description}
                confirmLabel={confirmConfig.confirmLabel}
                cancelLabel={confirmConfig.cancelLabel}
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
