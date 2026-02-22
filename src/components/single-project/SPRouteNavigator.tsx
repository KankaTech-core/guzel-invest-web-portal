"use client";

import { usePathname, useSearchParams } from "next/navigation";
import Link from "next/link";

const routes = [
    { path: "/s1", label: "s1", title: "Single Project Detail 1" },
    { path: "/s2", label: "s2", title: "Single Project Detail 2" },
    { path: "/s3", label: "s3", title: "Single Project Detail 3" },
    { path: "/s4", label: "s4", title: "Single Project Detail 4" },
    { path: "/s5", label: "s5", title: "Single Project Detail 5" },
];

export default function SPRouteNavigator() {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const queryString = searchParams.toString();

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
                    const href = queryString
                        ? `${route.path}?${queryString}`
                        : route.path;
                    return (
                        <Link
                            key={route.path}
                            href={href}
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
