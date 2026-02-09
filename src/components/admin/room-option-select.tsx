"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ChevronDown, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface RoomOptionSelectProps {
    value?: string | null;
    onChange: (value: string | null) => void;
    options: string[];
    onOptionsChange: (options: string[]) => void;
    className?: string;
}

const normalize = (value: string): string =>
    value
        .trim()
        .toLocaleLowerCase("tr-TR")
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");

export function RoomOptionSelect({
    value,
    onChange,
    options,
    onOptionsChange,
    className,
}: RoomOptionSelectProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [inputValue, setInputValue] = useState(value || "");
    const containerRef = useRef<HTMLDivElement>(null);

    // Update input value when prop changes
    useEffect(() => {
        setInputValue(value || "");
    }, [value]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (!containerRef.current) return;
            if (containerRef.current.contains(event.target as Node)) return;
            setIsOpen(false);
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const commitValue = () => {
        const trimmed = inputValue.trim();
        if (!trimmed) {
            // Only clear if empty input
            if (value) {
                // Keep previous value if user clears input by mistake? 
                // Or clear it? Let's clear it if empty.
                onChange(null);
            }
            return;
        }

        // Add to options if not exists
        const exists = options.some(opt => normalize(opt) === normalize(trimmed));
        if (!exists) {
            onOptionsChange([...options, trimmed]);
        }

        onChange(trimmed);
        setInputValue(trimmed);
    };

    const deleteOption = (optionToDelete: string) => {
        const newOptions = options.filter(opt => opt !== optionToDelete);
        onOptionsChange(newOptions);

        // If currently selected value is deleted, clear selection
        if (value && normalize(value) === normalize(optionToDelete)) {
            onChange(null);
            setInputValue("");
        }
    };

    return (
        <div className={cn("w-full", className)} ref={containerRef}>
            <label className="block text-sm font-medium text-gray-700 mb-2">Oda Sayısı</label>
            <div className="relative group">
                <div className="relative">
                    <input
                        type="text"
                        value={inputValue}
                        onFocus={() => setIsOpen(true)}
                        onChange={(event) => {
                            const next = event.target.value;
                            setInputValue(next);
                            // Optional: live update or wait for commit?
                            // For rooms, maybe wait for commit/blur like Company
                        }}
                        onBlur={() => {
                            commitValue();
                            // Delay hiding to allow click on dropdown items
                            setTimeout(() => setIsOpen(false), 200);
                        }}
                        onKeyDown={(event) => {
                            if (event.key === "Enter") {
                                event.preventDefault();
                                commitValue();
                                setIsOpen(false);
                            }
                        }}
                        placeholder="Örn: 2+1"
                        className="input pr-10"
                    />
                    <button
                        type="button"
                        onMouseDown={(event) => {
                            event.preventDefault();
                            setIsOpen((prev) => !prev);
                        }}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-orange-500 transition-colors"
                    >
                        <ChevronDown
                            className={cn("w-4 h-4 transition-transform", isOpen && "rotate-180")}
                        />
                    </button>
                </div>

                {isOpen && (
                    <div className="absolute z-50 mt-1 w-full rounded-lg border border-gray-100 bg-white shadow-xl max-h-56 overflow-auto py-1">
                        {options.map((option) => (
                            <div
                                key={option}
                                className={cn(
                                    "relative group/item w-full px-4 py-2 text-left text-sm transition-colors cursor-pointer flex items-center justify-between",
                                    normalize(value || "") === normalize(option)
                                        ? "bg-orange-50 text-orange-600 font-medium"
                                        : "text-gray-700 hover:bg-gray-50"
                                )}
                                onMouseDown={(event) => {
                                    if ((event.target as HTMLElement).closest('button')) return;
                                    event.preventDefault();
                                    onChange(option);
                                    setInputValue(option);
                                    setIsOpen(false);
                                }}
                            >
                                <span>{option}</span>
                                <button
                                    type="button"
                                    onMouseDown={(event) => {
                                        event.preventDefault();
                                        event.stopPropagation();
                                        deleteOption(option);
                                    }}
                                    className="p-1 rounded-full text-red-500 hover:bg-red-100 opacity-0 group-hover/item:opacity-100 transition-opacity"
                                    title="Sil"
                                >
                                    <X className="w-3.5 h-3.5" />
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
