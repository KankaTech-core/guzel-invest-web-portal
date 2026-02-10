"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    Building2,
    LayoutDashboard,
    FileText,
    Download,
    Users,
    LogOut,
    ChevronLeft,
    ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useSidebar } from "@/lib/context/sidebar-context";

const navigation = [
    { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { name: "İlanlar", href: "/admin/ilanlar", icon: FileText },
    { name: "Export", href: "/admin/export", icon: Download },
    { name: "Kullanıcılar", href: "/admin/kullanicilar", icon: Users },
];

export function Sidebar() {
    const pathname = usePathname();
    const { isCollapsed, toggleSidebar } = useSidebar();

    // Don't show sidebar on login page
    if (pathname === "/admin/login" || pathname.startsWith("/admin/login/")) {
        return null;
    }

    return (
        <aside
            className={cn(
                "fixed inset-y-0 left-0 bg-slate-900 text-white z-50 hidden lg:block transition-all duration-300 border-r border-slate-800",
                isCollapsed ? "w-20" : "w-64"
            )}
        >
            <div className="flex flex-col h-full relative">
                {/* Toggle Button */}
                <button
                    onClick={toggleSidebar}
                    className="absolute -right-3 top-20 w-6 h-6 bg-slate-800 border border-slate-700 rounded-full flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-700 transition-colors z-50 shadow-lg"
                >
                    {isCollapsed ? (
                        <ChevronRight className="w-4 h-4" />
                    ) : (
                        <ChevronLeft className="w-4 h-4" />
                    )}
                </button>

                {/* Logo */}
                <div className={cn(
                    "p-6 border-b border-slate-800 h-[89px] flex items-center",
                    isCollapsed ? "justify-center px-0" : "px-6"
                )}>
                    <Link href="/admin" className="flex items-center gap-3 overflow-hidden">
                        <div className="flex-shrink-0 p-2 bg-amber-500 rounded-lg">
                            <Building2 className="w-6 h-6 text-black" />
                        </div>
                        {!isCollapsed && (
                            <div className="whitespace-nowrap transition-opacity duration-300">
                                <h1 className="font-bold text-lg">Güzel Invest</h1>
                                <p className="text-xs text-slate-400">Admin Panel</p>
                            </div>
                        )}
                    </Link>
                </div>

                {/* Navigation */}
                <nav className="flex-1 p-4 space-y-1 overflow-y-auto overflow-x-hidden scrollbar-hide">
                    {navigation.map((item) => {
                        const isActive =
                            pathname === item.href ||
                            (item.href !== "/admin" && pathname.startsWith(item.href));

                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                title={isCollapsed ? item.name : undefined}
                                className={cn(
                                    "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 group relative",
                                    isActive
                                        ? "bg-amber-500 text-black shadow-lg shadow-amber-500/20"
                                        : "text-slate-400 hover:bg-slate-800 hover:text-white",
                                    isCollapsed && "justify-center px-0"
                                )}
                            >
                                <item.icon className={cn(
                                    "w-5 h-5 flex-shrink-0",
                                    !isActive && "group-hover:scale-110 transition-transform"
                                )} />
                                {!isCollapsed && (
                                    <span className="whitespace-nowrap transition-opacity duration-300">
                                        {item.name}
                                    </span>
                                )}
                            </Link>
                        );
                    })}
                </nav>

                {/* Logout */}
                <div className="p-4 border-t border-slate-800">
                    <form action="/api/auth/logout" method="POST">
                        <button
                            type="submit"
                            title={isCollapsed ? "Çıkış Yap" : undefined}
                            className={cn(
                                "flex items-center gap-3 w-full px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 group relative",
                                "text-slate-400 hover:bg-red-500/10 hover:text-red-500",
                                isCollapsed && "justify-center px-0"
                            )}
                        >
                            <LogOut className="w-5 h-5 flex-shrink-0" />
                            {!isCollapsed && (
                                <span className="whitespace-nowrap transition-opacity duration-300">
                                    Çıkış Yap
                                </span>
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </aside>
    );
}
