"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";

const routes = [
    { path: "/1", label: "1", title: "Heritage Modern Minimal" },
    { path: "/2", label: "2", title: "Mediterranean Coastal" },
    { path: "/3", label: "3", title: "Fintech-Trust Clarity" },
    { path: "/4", label: "4", title: "Scandinavian Calm" },
    { path: "/5", label: "5", title: "Photography-led Bright" },
    { path: "/6", label: "6", title: "Heritage Modern Minimal (Free)" },
    { path: "/7", label: "7", title: "Mediterranean Coastal Premium" },
    { path: "/8", label: "8", title: "Fintech-Trust Clarity (Free)" },
    { path: "/9", label: "9", title: "Scandinavian Calm Premium" },
    { path: "/10", label: "10", title: "Photography-led Bright Premium" },
];

export default function RouteNavigator() {
    const pathname = usePathname();

    return (
        <nav
            className="fixed bottom-6 right-6 z-50 flex flex-col gap-1.5 bg-white/90 backdrop-blur-md p-2 rounded-xl shadow-lg border border-gray-200"
            aria-label="Design variant navigation"
        >
            <span className="text-[10px] uppercase tracking-wider text-gray-400 font-medium px-2 pb-1 border-b border-gray-100">
                Variants
            </span>
            <div className="flex flex-col gap-1">
                {routes.map((route) => {
                    const isActive = pathname === route.path;
                    return (
                        <Link
                            key={route.path}
                            href={route.path}
                            title={route.title}
                            className={`
                relative w-9 h-9 flex items-center justify-center rounded-lg text-sm font-semibold transition-all duration-200
                ${isActive
                                    ? "bg-orange-500 text-white shadow-md"
                                    : "bg-gray-50 text-gray-600 hover:bg-orange-50 hover:text-orange-600"
                                }
              `}
                        >
                            {route.label}
                            {isActive && (
                                <span className="absolute -left-1 top-1/2 -translate-y-1/2 w-0.5 h-4 bg-orange-500 rounded-full" />
                            )}
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
}
