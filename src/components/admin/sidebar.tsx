"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import {
    LayoutDashboard,
    FileText,
    Download,
    Newspaper,
    Users,
    LogOut,
    ChevronLeft,
    ChevronRight,
    ExternalLink,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useSidebar } from "@/lib/context/sidebar-context";

type CurrentUser = {
    name: string | null;
    email: string;
    role: string;
};

const roleLabels: Record<string, string> = {
    ADMIN: "Yönetici",
    EDITOR: "Editör",
    VIEWER: "Görüntüleyici",
};

const navigation = [
    { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { name: "İlanlar", href: "/admin/ilanlar", icon: FileText },
    { name: "Projeler", href: "/admin/projeler", icon: FileText },
    { name: "Export", href: "/admin/export", icon: Download },
    { name: "Makaleler", href: "/admin/makaleler", icon: Newspaper },
    { name: "Kullanıcılar", href: "/admin/kullanicilar", icon: Users },
    { name: "Ana Site", href: "/", icon: ExternalLink, external: true },
];

export function Sidebar() {
    const pathname = usePathname();
    const { isCollapsed, toggleSidebar } = useSidebar();
    const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
    const [isUserLoading, setIsUserLoading] = useState(true);

    useEffect(() => {
        let isMounted = true;

        const fetchCurrentUser = async () => {
            try {
                const response = await fetch("/api/auth/me", { cache: "no-store" });
                if (!response.ok) {
                    return;
                }

                const data = (await response.json()) as { user?: CurrentUser };
                if (isMounted) {
                    setCurrentUser(data.user ?? null);
                }
            } catch {
                // Swallow errors and keep sidebar stable even if auth endpoint fails.
            } finally {
                if (isMounted) {
                    setIsUserLoading(false);
                }
            }
        };

        void fetchCurrentUser();

        return () => {
            isMounted = false;
        };
    }, []);

    const userDisplayName =
        currentUser?.name?.trim() ||
        currentUser?.email ||
        (isUserLoading ? "Kullanıcı yükleniyor" : "Kullanıcı bulunamadı");
    const userEmail = currentUser?.email || (isUserLoading ? "..." : "Oturum bilgisi yok");
    const userRole = currentUser?.role ? roleLabels[currentUser.role] ?? currentUser.role : null;
    const userInitial = userDisplayName.charAt(0).toLocaleUpperCase("tr-TR");

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
                        <Image
                            src="/images/testimonials/logo-square.svg"
                            alt="Güzel Invest logosu"
                            width={44}
                            height={44}
                            className="h-11 w-11 flex-shrink-0 object-contain"
                            priority
                        />
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
                            !item.external &&
                            (pathname === item.href ||
                                (item.href !== "/admin" && pathname.startsWith(item.href)));

                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                target={item.external ? "_blank" : undefined}
                                rel={item.external ? "noopener noreferrer" : undefined}
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
                <div className="p-4 border-t border-slate-800 space-y-3">
                    <div
                        className={cn(
                            "rounded-lg border border-slate-700 bg-slate-800/70",
                            isCollapsed ? "flex justify-center p-2" : "p-3"
                        )}
                        title={
                            isCollapsed
                                ? `${userDisplayName}${userRole ? ` - ${userRole}` : ""}`
                                : undefined
                        }
                    >
                        {isCollapsed ? (
                            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-500/20 text-xs font-semibold text-amber-300">
                                {userInitial}
                            </span>
                        ) : (
                            <div className="flex items-start gap-3">
                                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-amber-500/20 text-sm font-semibold text-amber-300">
                                    {userInitial}
                                </span>
                                <div className="min-w-0">
                                    <p className="truncate text-sm font-semibold text-slate-100">
                                        {userDisplayName}
                                    </p>
                                    <p className="truncate text-xs text-slate-400">{userEmail}</p>
                                    {userRole && <p className="mt-1 text-[11px] text-amber-300">{userRole}</p>}
                                </div>
                            </div>
                        )}
                    </div>

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
