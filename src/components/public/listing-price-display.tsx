"use client";

import { useCurrency } from "@/contexts/CurrencyContext";
import { formatPrice } from "@/lib/utils";

interface ListingPriceDisplayProps {
    price: number | string;
    currency: string;
    className?: string;
}

export function ListingPriceDisplay({
    price,
    currency,
    className,
}: ListingPriceDisplayProps) {
    const { convertPrice } = useCurrency();
    const { amount, currency: displayCurrency } = convertPrice(price, currency);
    return <span className={className}>{formatPrice(amount, displayCurrency)}</span>;
}
