"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown, Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface Option {
    value: string | number;
    label: string;
}

interface SelectProps {
    label?: string;
    value: string | number | null;
    onChange: (value: any) => void;
    options: Option[];
    placeholder?: string;
    className?: string;
    error?: string;
}

export function Select({
    label,
    value,
    onChange,
    options,
    placeholder = "Seçiniz",
    className,
    error,
}: SelectProps) {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    const selectedOption = options.find((opt) => opt.value === value);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className={cn("w-full", className)} ref={containerRef}>
            {label && (
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    {label}
                </label>
            )}
            <div className="relative">
                <button
                    type="button"
                    onClick={() => setIsOpen(!isOpen)}
                    className={cn(
                        "w-full flex items-center justify-between px-4 py-2.5 bg-white border rounded-lg transition-all text-left",
                        isOpen ? "border-orange-500 ring-2 ring-orange-100" : "border-gray-200 hover:border-gray-300",
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

                {isOpen && (
                    <div className="absolute z-50 w-full mt-1 bg-white border border-gray-100 rounded-lg shadow-xl max-h-60 overflow-auto py-1 animate-in fade-in slide-in-from-top-1 duration-200">
                        {options.map((option) => (
                            <button
                                key={option.value}
                                type="button"
                                onClick={() => {
                                    onChange(option.value);
                                    setIsOpen(false);
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
                        {options.length === 0 && (
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
