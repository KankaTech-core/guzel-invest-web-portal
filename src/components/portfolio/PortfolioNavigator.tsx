"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";

const routes = [
    { path: "/p1", label: "P1", title: "Heritage Modern Minimal" },
    { path: "/p2", label: "P2", title: "Mediterranean Coastal" },
    { path: "/p3", label: "P3", title: "Fintech-Trust Clarity" },
    { path: "/p4", label: "P4", title: "Scandinavian Calm" },
    { path: "/p5", label: "P5", title: "Photography-led Bright" },
    { path: "/p6", label: "P6", title: "Heritage Modern (Free)" },
    { path: "/p7", label: "P7", title: "Mediterranean (Free)" },
    { path: "/p8", label: "P8", title: "Fintech-Trust (Free)" },
    { path: "/p9", label: "P9", title: "Scandinavian (Free)" },
    { path: "/p10", label: "P10", title: "Photography-led (Free)" },
];

export default function PortfolioNavigator() {
    const pathname = usePathname();

    return (
        <nav
            className="fixed bottom-6 right-6 z-50 flex flex-col gap-1 bg-white/95 backdrop-blur-md p-2.5 rounded-2xl shadow-xl border border-gray-100"
            aria-label="Portfolio variant navigation"
        >
            <span className="text-[9px] uppercase tracking-widest text-gray-400 font-semibold px-2 pb-1.5 border-b border-gray-100">
                Portfolio
            </span>
            <div className="grid grid-cols-2 gap-1 pt-1">
                {routes.map((route) => {
                    const isActive = pathname === route.path;
                    return (
                        <Link
                            key={route.path}
                            href={route.path}
                            title={route.title}
                            className={`
                                relative px-2.5 py-1.5 flex items-center justify-center rounded-lg text-xs font-medium transition-all duration-200
                                ${isActive
                                    ? "bg-orange-500 text-white shadow-md"
                                    : "bg-gray-50 text-gray-500 hover:bg-orange-50 hover:text-orange-600"
                                }
                            `}
                        >
                            {route.label}
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
}
