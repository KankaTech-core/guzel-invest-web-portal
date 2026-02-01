import { cn } from "@/lib/utils";

export interface BadgeProps {
    variant?: "primary" | "secondary" | "success" | "warning" | "info" | "villa" | "apartment" | "home" | "land" | "commercial";
    children: React.ReactNode;
    className?: string;
}

export function Badge({ variant = "primary", children, className }: BadgeProps) {
    const variants: Record<string, string> = {
        primary: "badge-primary",
        secondary: "badge-secondary",
        success: "badge-success",
        warning: "badge-warning",
        info: "badge-info",
        villa: "badge-villa",
        apartment: "badge-apartment",
        home: "badge-home",
        land: "badge-land",
        commercial: "badge-commercial",
    };

    return (
        <span className={cn("badge", variants[variant], className)}>
            {children}
        </span>
    );
}

// Helper to get badge variant from property type
export function getPropertyTypeBadge(type: string): BadgeProps["variant"] {
    const map: Record<string, BadgeProps["variant"]> = {
        VILLA: "villa",
        APARTMENT: "apartment",
        HOME: "home",
        LAND: "land",
        COMMERCIAL: "commercial",
    };
    return map[type] || "secondary";
}
