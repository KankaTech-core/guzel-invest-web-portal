"use client";

import { useCurrency } from "@/contexts/CurrencyContext";
import { Switch } from "@/components/ui";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

export function CurrencyToggle({ className }: { className?: string }) {
    const { displayCurrency, isLoadingRate, toggleCurrency } = useCurrency();

    // Switch state:
    // Checked (true) = TRY
    // Unchecked (false) = EUR
    const isTry = displayCurrency === "TRY";

    return (
        <div className={cn("flex items-center gap-2", className)}>
            <span
                className={cn(
                    "text-sm font-bold transition-colors",
                    !isTry ? "text-orange-500" : "text-gray-400"
                )}
            >
                €
            </span>

            <div className="relative flex items-center">
                {isLoadingRate && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                        <Loader2 className="h-3 w-3 animate-spin text-orange-500" />
                    </div>
                )}
                <Switch
                    checked={isTry}
                    onCheckedChange={() => toggleCurrency()}
                    disabled={isLoadingRate}
                    className="[&_div]:!bg-[#F3F4F7] [&_div]:peer-checked:after:!bg-orange-500 [&_div]:peer-checked:after:!border-orange-500"
                />
            </div>

            <span
                className={cn(
                    "text-sm font-bold transition-colors",
                    isTry ? "text-orange-500" : "text-gray-400"
                )}
            >
                ₺
            </span>
        </div>
    );
}
