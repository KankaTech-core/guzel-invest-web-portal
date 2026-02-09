"use client";

import { CheckCircle2, Loader2, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

export type MediaOptimizationStage = "optimizing" | "completed";

interface MediaOptimizationModalProps {
    isOpen: boolean;
    stage: MediaOptimizationStage;
}

export function MediaOptimizationModal({
    isOpen,
    stage,
}: MediaOptimizationModalProps) {
    if (!isOpen) return null;

    const isCompleted = stage === "completed";

    return (
        <div className="fixed inset-0 z-[70] flex items-center justify-center px-4">
            <div className="absolute inset-0 bg-black/45 backdrop-blur-sm" />
            <div className="relative w-full max-w-md overflow-hidden rounded-2xl border border-white/60 bg-white shadow-2xl">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(236,104,3,0.12),transparent_62%)]" />
                <div className="relative px-6 py-7">
                    <div className="flex items-center gap-3">
                        <div
                            className={cn(
                                "flex h-11 w-11 items-center justify-center rounded-xl",
                                isCompleted
                                    ? "bg-emerald-100 text-emerald-600"
                                    : "bg-orange-100 text-orange-600"
                            )}
                        >
                            {isCompleted ? (
                                <CheckCircle2 className="h-6 w-6" />
                            ) : (
                                <Sparkles className="h-6 w-6 animate-pulse" />
                            )}
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold text-gray-900">
                                {isCompleted ? "İşlem tamamlandı" : "Fotoğraflar optimize ediliyor"}
                            </h2>
                            <p className="mt-1 text-sm text-gray-600">
                                {isCompleted
                                    ? "Görseller başarıyla işlendi."
                                    : "Görseller site performansı için optimize ediliyor. Lütfen bekleyin."}
                            </p>
                        </div>
                    </div>
                    {!isCompleted && (
                        <div className="mt-5 flex items-center gap-3 rounded-xl border border-orange-100 bg-orange-50/60 px-3 py-2">
                            <Loader2 className="h-4 w-4 animate-spin text-orange-600" />
                            <span className="text-sm font-medium text-orange-700">
                                Optimizasyon sürüyor...
                            </span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
