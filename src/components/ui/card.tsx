import { cn } from "@/lib/utils";

interface CardProps {
    children: React.ReactNode;
    className?: string;
    interactive?: boolean;
    padding?: "none" | "sm" | "md" | "lg";
}

export function Card({ children, className, interactive = false, padding = "none" }: CardProps) {
    const paddingClasses = {
        none: "",
        sm: "p-4",
        md: "p-6",
        lg: "p-8",
    };

    return (
        <div
            className={cn(
                "card",
                interactive && "card-interactive cursor-pointer",
                paddingClasses[padding],
                className
            )}
        >
            {children}
        </div>
    );
}

export function CardHeader({ children, className }: { children: React.ReactNode; className?: string }) {
    return (
        <div className={cn("px-6 pt-6 pb-2", className)}>
            {children}
        </div>
    );
}

export function CardContent({ children, className }: { children: React.ReactNode; className?: string }) {
    return (
        <div className={cn("px-6 pb-6", className)}>
            {children}
        </div>
    );
}

export function CardFooter({ children, className }: { children: React.ReactNode; className?: string }) {
    return (
        <div className={cn("px-6 pb-6 pt-2 border-t border-gray-100", className)}>
            {children}
        </div>
    );
}
