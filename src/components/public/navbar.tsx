"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { Building2, Menu, X, Globe, Search } from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

const navigation = [
    { name: "nav.home", href: "/" },
    { name: "nav.portfolio", href: "/portfoy" },
    { name: "nav.map", href: "/harita" },
    { name: "nav.about", href: "/hakkimizda" },
    { name: "nav.contact", href: "/iletisim" },
];

export function Navbar({ locale }: { locale: string }) {
    const t = useTranslations();
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    const isHomepage = pathname === `/${locale}` || pathname === `/${locale}/`;

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    useEffect(() => {
        if (isOpen) setIsOpen(false);
    }, [pathname, isOpen]);

    return (
        <nav className="fixed top-0 w-full z-50 transition-all duration-300 bg-white shadow-sm border-b border-gray-100 py-3">
            <div className="container-custom flex items-center justify-between">
                {/* Logo */}
                <Link href={`/${locale}`} className="flex items-center gap-2.5 group">
                    <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center group-hover:bg-orange-600 transition-colors">
                        <Building2 className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-xl font-bold tracking-tight text-gray-900">
                        Güzel Invest
                    </span>
                </Link>

                {/* Desktop Navigation */}
                <div className="hidden lg:flex items-center gap-1 bg-gray-100 rounded-full px-1.5 py-1.5">
                    {navigation.map((item) => {
                        const href = `/${locale}${item.href === "/" ? "" : item.href}`;
                        const isActive = pathname === href;

                        return (
                            <Link
                                key={item.href}
                                href={href}
                                className={cn(
                                    "px-5 py-2 rounded-full text-sm font-medium transition-all",
                                    isActive
                                        ? "bg-white text-gray-900 shadow-sm"
                                        : "text-gray-600 hover:text-gray-900"
                                )}
                            >
                                {t(item.name)}
                            </Link>
                        );
                    })}
                </div>

                {/* Right Side: Search + Language */}
                <div className="hidden lg:flex items-center gap-3">
                    {/* Search */}
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Ara..."
                            className="w-44 pl-9 pr-4 py-2 rounded-full text-sm border bg-gray-50 border-gray-200 text-gray-900 placeholder:text-gray-400 focus:border-orange-500 focus:outline-none transition-colors"
                        />
                    </div>

                    {/* Language Selector */}
                    <div className="flex items-center gap-1">
                        <Globe className="w-4 h-4 text-gray-400" />
                        <select
                            className="bg-transparent text-sm font-medium text-gray-600 focus:outline-none cursor-pointer border-none appearance-none pr-4"
                            defaultValue={locale}
                            onChange={(e) => {
                                const newLocale = e.target.value;
                                const newPath = pathname.replace(`/${locale}`, `/${newLocale}`);
                                window.location.href = newPath;
                            }}
                        >
                            <option value="tr">TR</option>
                            <option value="en">EN</option>
                            <option value="de">DE</option>
                            <option value="ru">RU</option>
                        </select>
                    </div>
                </div>

                {/* Mobile Menu Toggle */}
                <button
                    className="lg:hidden w-10 h-10 flex items-center justify-center"
                    onClick={() => setIsOpen(!isOpen)}
                >
                    {isOpen ? (
                        <X className="w-6 h-6 text-gray-900" />
                    ) : (
                        <Menu className="w-6 h-6 text-gray-900" />
                    )}
                </button>
            </div>

            {/* Mobile Menu */}
            <div
                className={cn(
                    "fixed inset-0 top-[64px] bg-white z-40 lg:hidden transition-transform duration-300",
                    isOpen ? "translate-x-0" : "translate-x-full"
                )}
            >
                <div className="p-6 flex flex-col gap-2">
                    {navigation.map((item) => {
                        const href = `/${locale}${item.href === "/" ? "" : item.href}`;
                        const isActive = pathname === href;

                        return (
                            <Link
                                key={item.href}
                                href={href}
                                className={cn(
                                    "px-4 py-3 rounded-xl text-lg font-medium transition-colors",
                                    isActive
                                        ? "bg-orange-50 text-orange-600"
                                        : "text-gray-700 hover:bg-gray-50"
                                )}
                            >
                                {t(item.name)}
                            </Link>
                        );
                    })}

                    <div className="mt-6 pt-6 border-t border-gray-100">
                        <p className="text-sm text-gray-400 mb-3">Dil Seçimi</p>
                        <div className="flex gap-2">
                            {["tr", "en", "de", "ru"].map((lang) => (
                                <button
                                    key={lang}
                                    className={cn(
                                        "px-4 py-2 rounded-lg text-sm font-bold uppercase transition-colors",
                                        locale === lang
                                            ? "bg-orange-500 text-white"
                                            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                    )}
                                    onClick={() => {
                                        const newPath = pathname.replace(`/${locale}`, `/${lang}`);
                                        window.location.href = newPath;
                                    }}
                                >
                                    {lang}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
}
