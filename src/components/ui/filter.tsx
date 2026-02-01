"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { ChevronDown, X } from "lucide-react";

interface FilterSectionProps {
    title: string;
    icon?: React.ReactNode;
    defaultOpen?: boolean;
    onClear?: () => void;
    showClear?: boolean;
    children: React.ReactNode;
}

export function FilterSection({
    title,
    icon,
    defaultOpen = true,
    onClear,
    showClear = false,
    children,
}: FilterSectionProps) {
    const [isOpen, setIsOpen] = useState(defaultOpen);

    return (
        <div className="filter-section">
            <div className="filter-header" onClick={() => setIsOpen(!isOpen)}>
                <div className="filter-title">
                    {icon}
                    <span>{title}</span>
                </div>
                <div className="flex items-center gap-2">
                    {showClear && onClear && (
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                onClear();
                            }}
                            className="text-xs text-gray-400 hover:text-orange-500 transition-colors"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    )}
                    <ChevronDown
                        className={cn(
                            "w-5 h-5 text-gray-400 transition-transform",
                            isOpen && "rotate-180"
                        )}
                    />
                </div>
            </div>
            <div
                className={cn(
                    "overflow-hidden transition-all duration-200",
                    isOpen ? "max-h-96 opacity-100 mt-3" : "max-h-0 opacity-0"
                )}
            >
                {children}
            </div>
        </div>
    );
}

interface FilterPanelProps {
    children: React.ReactNode;
    title?: string;
    onClearAll?: () => void;
}

export function FilterPanel({ children, title = "Filtreler", onClearAll }: FilterPanelProps) {
    return (
        <aside className="w-full lg:w-72 bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-100">
                <h2 className="text-lg font-bold text-gray-900">{title}</h2>
                {onClearAll && (
                    <button
                        onClick={onClearAll}
                        className="text-sm text-orange-500 hover:text-orange-600 hover:underline font-medium"
                    >
                        Temizle
                    </button>
                )}
            </div>
            {children}
        </aside>
    );
}
