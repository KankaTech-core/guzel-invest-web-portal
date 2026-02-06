"use client";

import { AlertTriangle, X } from "lucide-react";
import { cn } from "@/lib/utils";

type ConfirmTone = "warning" | "danger";

interface ConfirmModalProps {
    isOpen: boolean;
    title: string;
    description?: string;
    confirmLabel?: string;
    cancelLabel?: string;
    tone?: ConfirmTone;
    isLoading?: boolean;
    onConfirm: () => void;
    onCancel: () => void;
}

export function ConfirmModal({
    isOpen,
    title,
    description,
    confirmLabel = "Evet",
    cancelLabel = "Hayır",
    tone = "warning",
    isLoading = false,
    onConfirm,
    onCancel,
}: ConfirmModalProps) {
    if (!isOpen) return null;

    const isDanger = tone === "danger";

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                onClick={onCancel}
            />

            <div className="relative w-full max-w-md overflow-hidden bg-white rounded-2xl shadow-2xl">
                <div className="flex items-start justify-between gap-4 px-6 py-4 border-b border-gray-100">
                    <div className="flex items-start gap-3">
                        <div
                            className={cn(
                                "p-2 rounded-lg",
                                isDanger ? "bg-red-100" : "bg-orange-100"
                            )}
                        >
                            <AlertTriangle
                                className={cn(
                                    "w-5 h-5",
                                    isDanger ? "text-red-600" : "text-orange-600"
                                )}
                            />
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
                            {description && (
                                <p className="text-sm text-gray-500 mt-1">{description}</p>
                            )}
                        </div>
                    </div>
                    <button
                        onClick={onCancel}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        aria-label="Kapat"
                    >
                        <X className="w-5 h-5 text-gray-500" />
                    </button>
                </div>

                <div className="px-6 py-4 flex items-center justify-end gap-2">
                    <button
                        type="button"
                        onClick={onCancel}
                        className="btn btn-ghost btn-md"
                        disabled={isLoading}
                    >
                        {cancelLabel}
                    </button>
                    <button
                        type="button"
                        onClick={onConfirm}
                        className={cn(
                            "btn btn-md",
                            isDanger
                                ? "bg-red-600 text-white hover:bg-red-700"
                                : "btn-primary"
                        )}
                        disabled={isLoading}
                    >
                        {isLoading ? "İşleniyor..." : confirmLabel}
                    </button>
                </div>
            </div>
        </div>
    );
}
