"use client";

import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

import React from "react";

interface CheckboxProps {
    checked: boolean;
    onChange: (checked: boolean) => void;
    label: React.ReactNode;
    id?: string;
    disabled?: boolean;
}

export function Checkbox({ checked, onChange, label, id, disabled = false }: CheckboxProps) {
    const handleClick = () => {
        if (!disabled) {
            onChange(!checked);
        }
    };

    return (
        <div
            className={cn(
                "checkbox-wrapper",
                disabled && "opacity-50 cursor-not-allowed"
            )}
            onClick={handleClick}
        >
            <div
                className={cn(
                    "checkbox",
                    checked && "checked"
                )}
                role="checkbox"
                aria-checked={checked}
                tabIndex={0}
                id={id}
                onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        handleClick();
                    }
                }}
            >
                {checked && <Check size={12} strokeWidth={3.5} className="text-white" style={{ color: 'white' }} />}
            </div>
            <span className="checkbox-label">{label}</span>
        </div>
    );
}
