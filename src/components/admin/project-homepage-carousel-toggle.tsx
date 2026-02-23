"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { HOMEPAGE_PROJECT_LIMIT } from "@/lib/homepage-project-carousel";

interface ProjectHomepageCarouselToggleProps {
    projectId: string;
    isSelected: boolean;
    isPublished: boolean;
    selectedCount: number;
}

export function ProjectHomepageCarouselToggle({
    projectId,
    isSelected,
    isPublished,
    selectedCount,
}: ProjectHomepageCarouselToggleProps) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const shouldBlockSelection = !isSelected && selectedCount >= HOMEPAGE_PROJECT_LIMIT;

    const handleToggle = async () => {
        if (isLoading) return;

        setIsLoading(true);
        try {
            const response = await fetch(
                `/api/admin/projects/${projectId}/homepage-carousel`,
                {
                    method: "PATCH",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ show: !isSelected }),
                }
            );

            if (!response.ok) {
                const data = await response.json().catch(() => ({}));
                throw new Error(data.error || "Ana sayfa carousel işlemi başarısız.");
            }

            router.refresh();
        } catch (error) {
            const message =
                error instanceof Error
                    ? error.message
                    : "Ana sayfa carousel işlemi başarısız.";
            window.alert(message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <button
            type="button"
            onClick={handleToggle}
            aria-pressed={isSelected}
            disabled={isLoading || !isPublished || shouldBlockSelection}
            className={cn(
                "inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-medium transition-colors",
                isSelected
                    ? "border-orange-200 bg-orange-50 text-orange-700"
                    : "border-gray-200 bg-white text-gray-500 hover:border-orange-200 hover:text-orange-600",
                (!isPublished || shouldBlockSelection || isLoading) &&
                    "cursor-not-allowed opacity-60"
            )}
            title={
                !isPublished
                    ? "Sadece yayındaki projeler ana sayfa carousel'ine eklenebilir"
                    : shouldBlockSelection
                      ? "En fazla 3 proje seçebilirsiniz"
                      : isSelected
                        ? "Carousel'den çıkar"
                        : "Carousel'e ekle"
            }
        >
            <Star className={cn("h-3.5 w-3.5", isSelected && "fill-current")} />
            <span>{isSelected ? "Seçili" : "Carousel"}</span>
        </button>
    );
}
