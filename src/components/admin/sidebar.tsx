"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    Building2,
    LayoutDashboard,
    FileText,
    Image,
    RefreshCw,
    Download,
    Users,
    Settings,
    LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navigation = [
    { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { name: "İlanlar", href: "/admin/ilanlar", icon: FileText },
    { name: "Export", href: "/admin/export", icon: Download },
    { name: "Kullanıcılar", href: "/admin/kullanicilar", icon: Users },
];

export function Sidebar() {
    const pathname = usePathname();

    // Don't show sidebar on login page
    if (pathname === "/admin/login") {
        return null;
    }

    return (
        <aside className="fixed inset-y-0 left-0 w-64 bg-slate-900 text-white z-50 hidden lg:block">
            <div className="flex flex-col h-full">
                {/* Logo */}
                <div className="p-6 border-b border-slate-700">
                    <Link href="/admin" className="flex items-center gap-3">
                        <div className="p-2 bg-amber-500 rounded-lg">
                            <Building2 className="w-6 h-6 text-black" />
                        </div>
                        <div>
                            <h1 className="font-bold text-lg">Güzel Invest</h1>
                            <p className="text-xs text-slate-400">Admin Panel</p>
                        </div>
                    </Link>
                </div>

                {/* Navigation */}
                <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                    {navigation.map((item) => {
                        const isActive =
                            pathname === item.href ||
                            (item.href !== "/admin" && pathname.startsWith(item.href));

                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={cn(
                                    "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors",
                                    isActive
                                        ? "bg-amber-500 text-black"
                                        : "text-slate-300 hover:bg-slate-800 hover:text-white"
                                )}
                            >
                                <item.icon className="w-5 h-5" />
                                {item.name}
                            </Link>
                        );
                    })}
                </nav>

                {/* Logout */}
                <div className="p-4 border-t border-slate-700">
                    <form action="/api/auth/logout" method="POST">
                        <button
                            type="submit"
                            className="flex items-center gap-3 w-full px-4 py-3 rounded-lg text-sm font-medium text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
                        >
                            <LogOut className="w-5 h-5" />
                            Çıkış Yap
                        </button>
                    </form>
                </div>
            </div>
        </aside>
    );
}
