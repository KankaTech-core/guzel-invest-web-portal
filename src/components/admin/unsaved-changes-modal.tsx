"use client";

import { AlertTriangle, Save, Send, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface UnsavedChangesModalProps {
    isOpen: boolean;
    isLoading?: boolean;
    loadingAction?: "draft" | "publish" | null;
    onCancel: () => void;
    onDiscard: () => void;
    onSaveDraft: () => void;
    onPublish: () => void;
}

export function UnsavedChangesModal({
    isOpen,
    isLoading = false,
    loadingAction = null,
    onCancel,
    onDiscard,
    onSaveDraft,
    onPublish,
}: UnsavedChangesModalProps) {
    if (!isOpen) return null;

    const isDraftLoading = isLoading && loadingAction === "draft";
    const isPublishLoading = isLoading && loadingAction === "publish";

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                onClick={onCancel}
            />

            <div className="relative w-full max-w-2xl overflow-hidden bg-white rounded-2xl shadow-2xl border border-gray-100">
                <div className="flex items-start justify-between gap-4 px-6 py-4 border-b border-gray-100">
                    <div className="flex items-start gap-3">
                        <div className="p-2 rounded-lg bg-orange-100 text-orange-600">
                            <AlertTriangle className="w-5 h-5" />
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold text-gray-900">
                                Kaydetmeden çıkmak ister misiniz?
                            </h2>
                            <p className="text-sm text-gray-500 mt-1">
                                Değişikliklerinizi kaybetmemek için çıkmadan önce
                                bir seçenek seçin.
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={onCancel}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        aria-label="Kapat"
                        disabled={isLoading}
                    >
                        <X className="w-5 h-5 text-gray-500" />
                    </button>
                </div>

                <div className="px-8 py-6 border-t border-gray-100 bg-gray-50/50 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
                    <button
                        type="button"
                        onClick={onCancel}
                        className="btn btn-ghost btn-md order-last sm:order-first px-6"
                        disabled={isLoading}
                    >
                        İptal
                    </button>

                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                        <button
                            type="button"
                            onClick={onDiscard}
                            className="btn btn-secondary btn-md px-6 min-w-[140px]"
                            disabled={isLoading}
                        >
                            Kaydetmeden Çık
                        </button>
                        <button
                            type="button"
                            onClick={onSaveDraft}
                            className={cn("btn btn-outline btn-md px-6 min-w-[140px]", isDraftLoading && "opacity-80")}
                            disabled={isLoading}
                        >
                            <Save className="w-4 h-4" />
                            {isDraftLoading ? "Kaydediliyor..." : "Taslak Kaydet"}
                        </button>
                        <button
                            type="button"
                            onClick={onPublish}
                            className={cn("btn btn-primary btn-md px-6 min-w-[140px]", isPublishLoading && "opacity-90")}
                            disabled={isLoading}
                        >
                            <Send className="w-4 h-4" />
                            {isPublishLoading ? "Yayınlanıyor..." : "Yayınla"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
