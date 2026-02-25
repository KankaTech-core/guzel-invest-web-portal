"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import {
    Menu,
    X,
    Globe,
    ChevronDown,
    Instagram,
    Youtube,
    Facebook,
    Loader2,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { mapPublicProjectsToMenuItems, type NavbarProjectMenuItem, type PublicProjectMenuSource } from "@/lib/navbar-project-menu";
import { cn, getMediaUrl } from "@/lib/utils";
import { CurrencyToggle } from "@/components/public/currency-toggle";

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
    { label: "Projeler", href: "/projeler" },
    { name: "nav.portfolio", href: "/portfoy" },
    { label: "Makaleler", href: "/blog" },
    { name: "nav.about", href: "/hakkimizda" },
    { name: "nav.contact", href: "/iletisim" },
] satisfies NavigationItem[];

const aboutSectionLinks = [
    { id: "hikayemiz", label: "Hikayemiz" },
    { id: "neler-yapiyoruz", label: "Neler Yapıyoruz?" },
    { id: "ekibimiz", label: "Ekibimiz" },
    { id: "misyonumuz", label: "Misyonumuz" },
    { id: "vizyonumuz", label: "Vizyonumuz" },
] as const;

const appendVersionParam = (url: string, version: string) => {
    if (!url) return url;
    const separator = url.includes("?") ? "&" : "?";
    return `${url}${separator}v=${encodeURIComponent(version)}`;
};

export function Navbar({ locale }: { locale: string }) {
    const t = useTranslations();
    const pathname = usePathname();
    const router = useRouter();
    const [isOpen, setIsOpen] = useState(false);
    const [projectMenuItems, setProjectMenuItems] = useState<NavbarProjectMenuItem[]>([]);
    const [isProjectsMenuLoading, setIsProjectsMenuLoading] = useState(true);
    const aboutPath = `/${locale}/hakkimizda`;

    // Döviz butonu sadece portföy, tek ilan ve harita sayfalarında görünür
    const currencyActiveRoutes = [
        `/${locale}/portfoy`,
        `/${locale}/harita`,
        `/${locale}/ilan`,
    ];
    const showCurrencyToggle = currencyActiveRoutes.some((route) =>
        pathname.startsWith(route)
    );

    const smoothScrollToSection = useCallback((sectionId: string) => {
        let attempt = 0;
        const maxAttempts = 20;

        const tryScroll = () => {
            const target = document.getElementById(sectionId);
            if (target) {
                target.scrollIntoView({ behavior: "smooth", block: "start" });
                return;
            }

            if (attempt < maxAttempts) {
                attempt += 1;
                window.setTimeout(tryScroll, 50);
            }
        };

        tryScroll();
    }, []);

    const handleAboutSectionClick = (
        event: React.MouseEvent<HTMLAnchorElement>,
        sectionId: string
    ) => {
        event.preventDefault();
        setIsOpen(false);

        if (pathname === aboutPath) {
            window.history.replaceState(null, "", `${aboutPath}#${sectionId}`);
            smoothScrollToSection(sectionId);
            return;
        }

        window.sessionStorage.setItem("about-scroll-target", sectionId);
        router.push(`${aboutPath}#${sectionId}`);
    };

    useEffect(() => {
        if (pathname !== aboutPath) {
            return;
        }

        const pendingTarget = window.sessionStorage.getItem("about-scroll-target");
        const hashTarget = window.location.hash.replace("#", "");
        const target = pendingTarget || hashTarget;

        if (!target) {
            return;
        }

        window.sessionStorage.removeItem("about-scroll-target");
        window.setTimeout(() => smoothScrollToSection(target), 80);
    }, [aboutPath, pathname, smoothScrollToSection]);

    useEffect(() => {
        let isMounted = true;
        const controller = new AbortController();

        const loadProjectMenuItems = async () => {
            try {
                const response = await fetch(
                    `/api/public/projects?locale=${encodeURIComponent(locale)}`,
                    {
                        signal: controller.signal,
                        cache: "no-store",
                    }
                );
                if (!response.ok) {
                    if (isMounted) setProjectMenuItems([]);
                    return;
                }

                const data = (await response.json()) as {
                    projects?: PublicProjectMenuSource[];
                };

                if (!isMounted) return;
                const projects = Array.isArray(data?.projects) ? data.projects : [];
                setProjectMenuItems(mapPublicProjectsToMenuItems(projects, locale));
            } catch {
                if (isMounted) {
                    setProjectMenuItems([]);
                }
            } finally {
                if (isMounted) {
                    setIsProjectsMenuLoading(false);
                }
            }
        };

        setIsProjectsMenuLoading(true);
        loadProjectMenuItems();

        return () => {
            isMounted = false;
            controller.abort();
        };
    }, [locale]);

    return (
        <nav className="fixed top-0 w-full z-50 transition-all duration-300 bg-white shadow-sm border-b border-gray-100 py-3">
            <div className="container-custom flex items-center justify-between">
                {/* Logo */}
                <Link href={`/${locale}`} className="flex items-center gap-2.5 group">
                    <Image
                        src="/images/testimonials/logo-square.svg"
                        alt="Güzel Invest logosu"
                        width={40}
                        height={40}
                        className="h-10 w-10 object-contain"
                        priority
                    />
                    <span className="text-xl font-bold tracking-tight text-gray-900">
                        Güzel Invest
                    </span>
                </Link>

                {/* Desktop Navigation */}
                <div className="hidden lg:flex items-center gap-1 bg-gray-100 rounded-full px-1.5 py-1.5">
                    {navigation.map((item) => {
                        const href = `/${locale}${item.href === "/" ? "" : item.href}`;
                        const isActive = pathname === href;

                        if (item.href === "/hakkimizda") {
                            return (
                                <div key={item.href} className="relative group">
                                    <Link
                                        href={href}
                                        className={cn(
                                            "inline-flex items-center gap-1.5 px-5 py-2 rounded-full text-sm font-medium transition-all",
                                            isActive
                                                ? "bg-white text-gray-900 shadow-sm"
                                                : "text-gray-600 hover:text-gray-900"
                                        )}
                                    >
                                        {item.label ?? t(item.name!)}
                                        <ChevronDown className="h-4 w-4 opacity-70" />
                                    </Link>

                                    <div className="pointer-events-none invisible absolute left-1/2 top-full z-50 w-56 -translate-x-1/2 pt-2 opacity-0 transition-all duration-200 group-hover:pointer-events-auto group-hover:visible group-hover:opacity-100 group-focus-within:pointer-events-auto group-focus-within:visible group-focus-within:opacity-100">
                                        <div className="rounded-xl border border-gray-200 bg-white p-1.5 shadow-xl shadow-gray-200/60">
                                            {aboutSectionLinks.map((section) => (
                                                <a
                                                    key={section.id}
                                                    href={`${href}#${section.id}`}
                                                    onClick={(event) =>
                                                        handleAboutSectionClick(event, section.id)
                                                    }
                                                    className="block rounded-lg px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-orange-50 hover:text-orange-600"
                                                >
                                                    {section.label}
                                                </a>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            );
                        }

                        if (item.href === "/projeler") {
                            return (
                                <div key={item.href} className="relative group">
                                    <Link
                                        href={href}
                                        className={cn(
                                            "inline-flex items-center gap-1.5 px-5 py-2 rounded-full text-sm font-medium transition-all",
                                            isActive
                                                ? "bg-white text-gray-900 shadow-sm"
                                                : "text-gray-600 hover:text-gray-900"
                                        )}
                                    >
                                        {item.label ?? t(item.name!)}
                                        <ChevronDown className="h-4 w-4 opacity-70" />
                                    </Link>

                                    <div className="pointer-events-none invisible absolute left-1/2 top-full z-50 w-[32rem] -translate-x-1/2 pt-2 opacity-0 transition-all duration-200 group-hover:pointer-events-auto group-hover:visible group-hover:opacity-100 group-focus-within:pointer-events-auto group-focus-within:visible group-focus-within:opacity-100">
                                        <div className="rounded-xl border border-gray-200 bg-white p-2 shadow-xl shadow-gray-200/60">
                                            <div className="grid grid-cols-2 gap-2">
                                                {isProjectsMenuLoading ? (
                                                    <div className="col-span-2 flex items-center justify-center gap-2 rounded-lg px-3 py-6 text-sm text-gray-500">
                                                        <Loader2 className="h-4 w-4 animate-spin" />
                                                        Projeler yükleniyor...
                                                    </div>
                                                ) : projectMenuItems.length > 0 ? (
                                                    projectMenuItems.map((project) => (
                                                        <Link
                                                            key={project.href}
                                                            href={`/${locale}${project.href}`}
                                                            className="flex items-center gap-2 rounded-lg p-2 transition-colors hover:bg-orange-50"
                                                        >
                                                            <div className="h-12 w-16 shrink-0 overflow-hidden rounded-md bg-gray-100">
                                                                <Image
                                                                    src={appendVersionParam(
                                                                        getMediaUrl(project.image),
                                                                        project.imageVersion
                                                                    )}
                                                                    alt={project.title}
                                                                    width={64}
                                                                    height={48}
                                                                    unoptimized
                                                                    className="h-full w-full object-cover"
                                                                />
                                                            </div>
                                                            <span className="line-clamp-2 text-sm font-medium leading-snug text-gray-700">
                                                                {project.title}
                                                            </span>
                                                        </Link>
                                                    ))
                                                ) : (
                                                    <div className="col-span-2 rounded-lg px-3 py-6 text-center text-sm text-gray-500">
                                                        Yayınlanmış proje bulunamadı.
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        }

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
                                {item.label ?? (item.name ? t(item.name) : "")}
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

                    {/* Para Birimi Toggle - sadece portföy/ilan/harita sayfalarında */}
                    {showCurrencyToggle && (
                        <div className="ml-2">
                            <CurrencyToggle />
                        </div>
                    )}
                </div>

                {/* Mobile: Currency Toggle + Menu Toggle */}
                <div className="flex items-center gap-2 lg:hidden">
                    {/* Para Birimi Toggle - sadece portföy/ilan/harita sayfalarında (mobile) */}
                    {showCurrencyToggle && (
                        <CurrencyToggle className="mr-1" />
                    )}
                    <button
                        className="w-10 h-10 flex items-center justify-center"
                        onClick={() => setIsOpen(!isOpen)}
                    >
                        {isOpen ? (
                            <X className="w-6 h-6 text-gray-900" />
                        ) : (
                            <Menu className="w-6 h-6 text-gray-900" />
                        )}
                    </button>
                </div>
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
                                {item.label ?? (item.name ? t(item.name) : "")}
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
