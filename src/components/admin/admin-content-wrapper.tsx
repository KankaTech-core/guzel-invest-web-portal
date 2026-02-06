"use client";

import { useSidebar } from "@/lib/context/sidebar-context";
import { cn } from "@/lib/utils";

export function AdminContentWrapper({ children }: { children: React.ReactNode }) {
    const { isCollapsed } = useSidebar();

    return (
        <main
            className={cn(
                "flex-1 transition-all duration-300",
                isCollapsed ? "lg:pl-20" : "lg:pl-64"
            )}
        >
            <div className="p-6">{children}</div>
        </main>
    );
}
