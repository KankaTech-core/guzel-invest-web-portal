"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import {
    Building2,
    Menu,
    X,
    Globe,
    ToggleLeft,
    ToggleRight,
    Instagram,
    Youtube,
    Facebook,
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { useVersion } from "@/contexts/VersionContext";

type NavigationItem = {
    href: string;
    name?: string;
    label?: string;
};

const socialLinks = [
    { label: "Instagram", href: "https://www.instagram.com", icon: Instagram },
    { label: "YouTube", href: "https://www.youtube.com", icon: Youtube },
    { label: "Facebook", href: "https://www.facebook.com", icon: Facebook },
] as const;

const navigation = [
    { name: "nav.home", href: "/" },
    { name: "nav.portfolio", href: "/portfoy" },
    { label: "Makaleler", href: "/blog" },
    { name: "nav.about", href: "/hakkimizda" },
    { name: "nav.contact", href: "/iletisim" },
] satisfies NavigationItem[];

export function Navbar({ locale }: { locale: string }) {
    const t = useTranslations();
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(false);
    const { version, toggleVersion } = useVersion();

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
                                {item.label ?? t(item.name!)}
                            </Link>
                        );
                    })}
                </div>

                {/* Right Side: Social + Language */}
                <div className="hidden lg:flex items-center gap-3">
                    {/* Social Icons */}
                    <div className="flex items-center gap-1 rounded-full bg-gray-100 p-1">
                        {socialLinks.map((item) => {
                            const Icon = item.icon;
                            return (
                                <a
                                    key={item.label}
                                    href={item.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label={item.label}
                                    className="w-8 h-8 rounded-full bg-white border border-gray-200 text-gray-500 flex items-center justify-center shadow-sm transition-all hover:bg-orange-500 hover:border-orange-500 hover:text-white"
                                >
                                    <Icon className="w-4 h-4" strokeWidth={2.3} />
                                </a>
                            );
                        })}
                    </div>

                    {/* Language: TR only */}
                    <div className="flex items-center gap-1.5 rounded-full border border-gray-200 bg-gray-50 px-3 py-1.5">
                        <Globe className="w-4 h-4 text-gray-400" />
                        <span className="text-sm font-medium text-gray-600">TR</span>
                    </div>

                    {/* Version Toggle (Global) */}
                    <button
                        onClick={toggleVersion}
                        className="flex items-center gap-1.5 rounded-full border border-gray-200 bg-gray-50 px-3 py-1.5 text-xs font-semibold text-gray-600 transition-colors hover:bg-gray-100 hover:text-orange-600 ml-2"
                        title="Toggle Setup Version"
                    >
                        <span>{version === "v1" ? "V1" : "V2"}</span>
                        {version === "v1" ? (
                            <ToggleLeft className="w-4 h-4 text-gray-400" />
                        ) : (
                            <ToggleRight className="w-4 h-4 text-orange-500" />
                        )}
                    </button>
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
                                onClick={() => setIsOpen(false)}
                                className={cn(
                                    "px-4 py-3 rounded-xl text-lg font-medium transition-colors",
                                    isActive
                                        ? "bg-orange-50 text-orange-600"
                                        : "text-gray-700 hover:bg-gray-50"
                                )}
                            >
                                {item.label ?? t(item.name!)}
                            </Link>
                        );
                    })}

                    <div className="mt-6 pt-6 border-t border-gray-100">
                        <p className="text-sm text-gray-400 mb-3">Sosyal Medya</p>
                        <div className="flex items-center gap-3">
                            {socialLinks.map((item) => {
                                const Icon = item.icon;
                                return (
                                    <a
                                        key={item.label}
                                        href={item.href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        aria-label={item.label}
                                        className="w-10 h-10 rounded-xl border border-gray-200 bg-gray-50 text-gray-600 flex items-center justify-center transition-all hover:bg-orange-500 hover:border-orange-500 hover:text-white"
                                        onClick={() => setIsOpen(false)}
                                    >
                                        <Icon className="w-5 h-5" strokeWidth={2.3} />
                                    </a>
                                );
                            })}
                        </div>
                    </div>

                    <div className="mt-6 pt-6 border-t border-gray-100">
                        <p className="text-sm text-gray-400 mb-3">Dil Seçimi</p>
                        <div className="flex gap-2">
                            {["tr"].map((lang) => (
                                <button
                                    key={lang}
                                    className={cn(
                                        "px-4 py-2 rounded-lg text-sm font-bold uppercase transition-colors",
                                        locale === lang
                                            ? "bg-orange-500 text-white"
                                            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                    )}
                                    onClick={() => {
                                        setIsOpen(false);
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
