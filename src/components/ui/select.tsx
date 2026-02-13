"use client";

import { useState, useRef, useEffect, useMemo, useCallback } from "react";
import { ChevronDown, Check, Search } from "lucide-react";
import { cn } from "@/lib/utils";

interface Option {
    value: string | number;
    label: string;
}

interface SelectProps<T extends string | number = string> {
    label?: string;
    value: T | null;
    onChange: (value: T) => void;
    options: Array<Option & { value: T }>;
    placeholder?: string;
    className?: string;
    error?: string;
    searchable?: boolean;
    searchPlaceholder?: string;
    searchMatchMode?: "startsWith" | "includes";
}

export function Select<T extends string | number = string>({
    label,
    value,
    onChange,
    options,
    placeholder = "Seçiniz",
    className,
    error,
    searchable = false,
    searchPlaceholder = "Ara",
    searchMatchMode = "includes",
}: SelectProps<T>) {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const containerRef = useRef<HTMLDivElement>(null);

    const selectedOption = options.find((opt) => opt.value === value);
    const normalizedSearchTerm = searchTerm.trim().toLocaleLowerCase("tr-TR");
    const filteredOptions = useMemo(() => {
        if (!searchable || !normalizedSearchTerm) {
            return options;
        }

        return options.filter((option) => {
            const normalizedLabel = option.label.toLocaleLowerCase("tr-TR");
            return searchMatchMode === "startsWith"
                ? normalizedLabel.startsWith(normalizedSearchTerm)
                : normalizedLabel.includes(normalizedSearchTerm);
        });
    }, [normalizedSearchTerm, options, searchable, searchMatchMode]);

    const closeDropdown = useCallback(() => {
        setIsOpen(false);
        setSearchTerm("");
    }, []);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                closeDropdown();
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [closeDropdown]);

    return (
        <div className={cn("w-full", className)} ref={containerRef}>
            {label && (
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    {label}
                </label>
            )}
            <div className="relative">
                {searchable ? (
                    <>
                        <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                        <input
                            type="text"
                            value={isOpen ? searchTerm : (selectedOption?.label ?? "")}
                            onFocus={() => setIsOpen(true)}
                            onChange={(event) => {
                                if (!isOpen) {
                                    setIsOpen(true);
                                }
                                setSearchTerm(event.target.value);
                            }}
                            onKeyDown={(event) => {
                                if (event.key === "Escape") {
                                    event.preventDefault();
                                    closeDropdown();
                                    return;
                                }
                                if (event.key === "Enter") {
                                    event.preventDefault();
                                    if (searchTerm.trim() && filteredOptions.length > 0) {
                                        onChange(filteredOptions[0].value);
                                    }
                                    closeDropdown();
                                }
                            }}
                            placeholder={searchPlaceholder || placeholder}
                            className={cn(
                                "input !py-2.5 !pl-10 !pr-10",
                                isOpen
                                    ? "border-orange-500 ring-2 ring-orange-100"
                                    : "border-gray-200 hover:border-gray-300",
                                error && "border-red-500 ring-red-100"
                            )}
                        />
                        <button
                            type="button"
                            onClick={() => (isOpen ? closeDropdown() : setIsOpen(true))}
                            aria-label={isOpen ? "Seçimi kapat" : "Seçimi aç"}
                            className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 inline-flex items-center justify-center text-gray-400 hover:text-orange-500 transition-colors"
                        >
                            <ChevronDown
                                className={cn(
                                    "w-4 h-4 transition-transform",
                                    isOpen && "transform rotate-180 text-orange-500"
                                )}
                            />
                        </button>
                    </>
                ) : (
                    <button
                        type="button"
                        onClick={() => (isOpen ? closeDropdown() : setIsOpen(true))}
                        className={cn(
                            "w-full flex items-center justify-between px-4 py-2.5 bg-white border rounded-lg transition-all text-left",
                            isOpen
                                ? "border-orange-500 ring-2 ring-orange-100"
                                : "border-gray-200 hover:border-gray-300",
                            error && "border-red-500 ring-red-100",
                            !selectedOption && "text-gray-400"
                        )}
                    >
                        <span className="block truncate">
                            {selectedOption ? selectedOption.label : placeholder}
                        </span>
                        <ChevronDown
                            className={cn(
                                "w-4 h-4 text-gray-400 transition-transform",
                                isOpen && "transform rotate-180 text-orange-500"
                            )}
                        />
                    </button>
                )}

                {isOpen && (
                    <div className="absolute z-50 w-full mt-1 bg-white border border-gray-100 rounded-lg shadow-xl max-h-60 overflow-auto py-1 animate-in fade-in slide-in-from-top-1 duration-200">
                        {filteredOptions.map((option) => (
                            <button
                                key={option.value}
                                type="button"
                                onClick={() => {
                                    onChange(option.value);
                                    closeDropdown();
                                }}
                                className={cn(
                                    "w-full flex items-center justify-between px-4 py-2 text-sm transition-colors",
                                    option.value === value
                                        ? "bg-orange-50 text-orange-600 font-medium"
                                        : "text-gray-700 hover:bg-gray-50 hover:text-orange-500"
                                )}
                            >
                                {option.label}
                                {option.value === value && <Check className="w-4 h-4" />}
                            </button>
                        ))}
                        {filteredOptions.length === 0 && (
                            <div className="px-4 py-2 text-sm text-gray-400 italic">
                                Seçenek bulunamadı
                            </div>
                        )}
                    </div>
                )}
            </div>
            {error && <p className="mt-1.5 text-xs text-red-500">{error}</p>}
        </div>
    );
}
