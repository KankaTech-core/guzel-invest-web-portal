import { cn } from "@/lib/utils";

interface LastUnitsCornerRibbonProps {
    label?: string;
    className?: string;
}

export function LastUnitsCornerRibbon({
    label = "Son Daireler",
    className,
}: LastUnitsCornerRibbonProps) {
    return (
        <div
            className={cn(
                "pointer-events-none absolute right-0 top-0 z-20 h-24 w-24 overflow-hidden",
                className
            )}
            aria-hidden="true"
        >
            <div className="absolute -right-7 top-4.5 inline-flex h-6 rotate-45 items-center justify-center whitespace-nowrap bg-gradient-to-r from-orange-500 to-orange-600 px-6 text-center text-[9px] font-semibold uppercase leading-none tracking-[0.1em] text-white shadow-md">
                {label}
            </div>
        </div>
    );
}
