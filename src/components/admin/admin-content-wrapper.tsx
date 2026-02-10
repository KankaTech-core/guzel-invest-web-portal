"use client";

import { usePathname } from "next/navigation";
import { useSidebar } from "@/lib/context/sidebar-context";
import { cn } from "@/lib/utils";

export function AdminContentWrapper({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const { isCollapsed } = useSidebar();
    const isLoginPage = pathname === "/admin/login" || pathname.startsWith("/admin/login/");

    if (isLoginPage) {
        return <main className="flex-1">{children}</main>;
    }

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
