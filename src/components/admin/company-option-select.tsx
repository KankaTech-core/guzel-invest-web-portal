"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ChevronDown, Loader2, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface CompanyOption {
    id: string;
    name: string;
}

interface CompanyOptionSelectProps {
    value: string;
    onChange: (value: string) => void;
    className?: string;
}

const DEFAULT_COMPANY = "Güzel Invest";

const normalize = (value: string): string =>
    value
        .trim()
        .toLocaleLowerCase("tr-TR")
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");

export function CompanyOptionSelect({
    value,
    onChange,
    className,
}: CompanyOptionSelectProps) {
    const [options, setOptions] = useState<CompanyOption[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [inputValue, setInputValue] = useState(value || "");
    const containerRef = useRef<HTMLDivElement>(null);

    const selectedOption = useMemo(
        () => options.find((option) => normalize(option.name) === normalize(value || "")),
        [options, value]
    );

    const filteredOptions = useMemo(() => {
        // Always return all options, dont filter by input
        return options;
    }, [options]);

    const fetchOptions = async (shouldEnsureSelection = false) => {
        setIsLoading(true);
        try {
            const res = await fetch("/api/admin/company-options");
            if (!res.ok) return;
            const data = await res.json();
            const nextOptions: CompanyOption[] = data.options || [];
            setOptions(nextOptions);

            if (shouldEnsureSelection) {
                const current = value?.trim();
                if (current) return;

                const defaultOption =
                    nextOptions.find((option) => option.name === DEFAULT_COMPANY) ||
                    nextOptions[0];
                if (defaultOption) {
                    onChange(defaultOption.name);
                    setInputValue(defaultOption.name);
                }
            }
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchOptions(true);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

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

    const commitValue = async () => {
        const trimmed = inputValue.trim();
        if (!trimmed) return;

        const existing = options.find(
            (option) => normalize(option.name) === normalize(trimmed)
        );
        if (existing) {
            onChange(existing.name);
            setInputValue(existing.name);
            return;
        }

        try {
            const res = await fetch("/api/admin/company-options", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name: trimmed }),
            });
            if (!res.ok) return;

            const data = await res.json();
            const option = data.option as CompanyOption | undefined;
            if (!option) return;

            setOptions((prev) => {
                if (prev.some((item) => item.id === option.id)) return prev;
                return [...prev, option].sort((a, b) =>
                    a.name.localeCompare(b.name, "tr-TR", { sensitivity: "base" })
                );
            });
            onChange(option.name);
            setInputValue(option.name);
        } catch {
            // keep typed value when network request fails
        }
    };

    const deleteOption = async (option: CompanyOption) => {
        try {
            const res = await fetch(`/api/admin/company-options/${option.id}`, {
                method: "DELETE",
            });
            if (!res.ok) return;

            const currentValue = value;
            await fetchOptions(false);

            if (normalize(currentValue || "") === normalize(option.name)) {
                const fallback =
                    options.find((item) => item.name === DEFAULT_COMPANY && item.id !== option.id)
                    || options.find((item) => item.id !== option.id);
                const next = fallback?.name || DEFAULT_COMPANY;
                onChange(next);
                setInputValue(next);
            }
        } catch {
            // no-op
        }
    };

    return (
        <div className={cn("w-full", className)} ref={containerRef}>
            <label className="block text-sm font-medium text-gray-700 mb-2">Firma</label>
            <div className="relative group">
                <div className="relative">
                    <input
                        type="text"
                        value={inputValue}
                        onFocus={() => setIsOpen(true)}
                        onChange={(event) => {
                            const next = event.target.value;
                            setInputValue(next);
                            onChange(next);
                        }}
                        onBlur={() => {
                            void commitValue();
                        }}
                        onKeyDown={(event) => {
                            if (event.key === "Enter") {
                                event.preventDefault();
                                void commitValue();
                                setIsOpen(false);
                            }
                        }}
                        placeholder="Firma seçin veya yazın"
                        className="input pr-20"
                    />
                    <button
                        type="button"
                        onMouseDown={(event) => {
                            event.preventDefault();
                            setIsOpen((prev) => !prev);
                        }}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-orange-500 transition-colors"
                    >
                        {isLoading ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                            <ChevronDown
                                className={cn("w-4 h-4 transition-transform", isOpen && "rotate-180")}
                            />
                        )}
                    </button>


                </div>

                {isOpen && (
                    <div className="absolute z-50 mt-1 w-full rounded-lg border border-gray-100 bg-white shadow-xl max-h-56 overflow-auto py-1">
                        {filteredOptions.map((option) => (
                            <div
                                key={option.id}
                                className={cn(
                                    "relative group/item w-full px-4 py-2 text-left text-sm transition-colors cursor-pointer flex items-center justify-between",
                                    normalize(value || "") === normalize(option.name)
                                        ? "bg-orange-50 text-orange-600 font-medium"
                                        : "text-gray-700 hover:bg-gray-50"
                                )}
                                onMouseDown={(event) => {
                                    // Prevent triggering if clicking the delete button
                                    if ((event.target as HTMLElement).closest('button')) return;
                                    event.preventDefault();
                                    onChange(option.name);
                                    setInputValue(option.name);
                                    setIsOpen(false);
                                }}
                            >
                                <span>{option.name}</span>
                                <button
                                    type="button"
                                    onMouseDown={(event) => {
                                        event.preventDefault();
                                        event.stopPropagation();
                                        void deleteOption(option);
                                    }}
                                    className="p-1 rounded-full text-red-500 hover:bg-red-100 opacity-0 group-hover/item:opacity-100 transition-opacity"
                                    title="Firmayı Sil"
                                >
                                    <X className="w-3.5 h-3.5" />
                                </button>
                            </div>
                        ))}
                        {filteredOptions.length === 0 && (
                            <div className="px-4 py-2 text-sm text-gray-400 italic">
                                Sonuç bulunamadı. Enter ile ekleyebilirsiniz.
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
