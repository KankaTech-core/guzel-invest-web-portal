"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
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
    MapPin,
} from "lucide-react";
import { useCallback, useEffect, useState, useRef } from "react";
import {
    getNavbarProjectMenuColumnCount,
    mapPublicProjectsToMenuItems,
    type NavbarProjectMenuItem,
    type PublicProjectMenuSource,
} from "@/lib/navbar-project-menu";
import { SOCIAL_LINK_ITEMS, type SocialLinkKey } from "@/lib/social-links";
import { cn, getMediaUrl } from "@/lib/utils";
import { CurrencyToggle } from "@/components/public/currency-toggle";
import { ProjectIcon } from "@/components/single-project/ProjectIcon";

type NavigationItem = {
    href: string;
    name?: string;
    label?: string;
};

const socialIconMap: Record<SocialLinkKey, typeof Instagram> = {
    instagram: Instagram,
    youtube: Youtube,
    facebook: Facebook,
};

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
    const searchParams = useSearchParams();
    const router = useRouter();
    const [isOpen, setIsOpen] = useState(false);
    const [projectMenuItems, setProjectMenuItems] = useState<NavbarProjectMenuItem[]>([]);
    const [isProjectsMenuLoading, setIsProjectsMenuLoading] = useState(true);
    const [isProjectsMenuOpen, setIsProjectsMenuOpen] = useState(false);
    const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
        return () => {
            if (closeTimerRef.current) {
                clearTimeout(closeTimerRef.current);
            }
        };
    }, []);

    useEffect(() => {
        setIsProjectsMenuOpen(false);
    }, [pathname, searchParams]);

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

    useEffect(() => {
        window.dispatchEvent(
            new CustomEvent("mobile-nav-state-change", {
                detail: { isOpen },
            })
        );
        document.body.classList.toggle("mobile-menu-open", isOpen);

        return () => {
            document.body.classList.remove("mobile-menu-open");
        };
    }, [isOpen]);

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
                        const baseHref = `/${locale}${item.href === "/" ? "" : item.href}`;
                        const isActive = pathname === baseHref;

                        if (item.href === "/hakkimizda") {
                            return (
                                <div key={item.href} className="relative group">
                                    <Link
                                        href={baseHref}
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
                                                    href={`${baseHref}#${section.id}`}
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
                            const projectsFilterHref = `/${locale}/portfoy?onlyProjects=true`;
                            const isProjectsFilterActive =
                                pathname === `/${locale}/portfoy` &&
                                searchParams.get("onlyProjects") === "true";
                            const isMenuVisible = isProjectsMenuOpen;
                            const menuColumnCount = getNavbarProjectMenuColumnCount(
                                isProjectsMenuLoading ? 1 : projectMenuItems.length
                            );
                            const menuWidthClass =
                                menuColumnCount === 1
                                    ? "max-w-[560px]"
                                    : menuColumnCount === 2
                                      ? "max-w-[1120px]"
                                      : "max-w-[1120px] 2xl:max-w-[1700px]";
                            const menuGridClass =
                                menuColumnCount === 1
                                    ? "lg:grid-cols-1"
                                    : menuColumnCount === 2
                                      ? "lg:grid-cols-2"
                                      : "lg:grid-cols-2 2xl:grid-cols-3";

                            return (
                                <div
                                    key={item.href}
                                    className="relative"
                                    onMouseEnter={() => {
                                        if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
                                        setIsProjectsMenuOpen(true);
                                    }}
                                    onMouseLeave={() => {
                                        closeTimerRef.current = setTimeout(
                                            () => setIsProjectsMenuOpen(false),
                                            150
                                        );
                                    }}
                                >
                                    <Link
                                        href={projectsFilterHref}
                                        onClick={() => {
                                            setIsProjectsMenuOpen(false);
                                            setIsOpen(false);
                                        }}
                                        className={cn(
                                            "inline-flex items-center gap-1.5 px-5 py-2 rounded-full text-sm font-medium transition-all",
                                            (isProjectsFilterActive || isMenuVisible)
                                                ? "bg-white text-gray-900 shadow-sm"
                                                : "text-gray-600 hover:text-gray-900"
                                        )}
                                    >
                                        {item.label ?? t(item.name!)}
                                        <ChevronDown className={cn("h-4 w-4 opacity-70 transition-transform duration-200", isMenuVisible && "rotate-180")} />
                                    </Link>

                                    <div
                                        className={cn(
                                            "fixed top-[64px] left-1/2 z-50 mt-2 w-[calc(100vw-1rem)] -translate-x-1/2 transition-all duration-200",
                                            menuWidthClass,
                                            isMenuVisible
                                                ? "pointer-events-auto visible opacity-100"
                                                : "pointer-events-none invisible opacity-0"
                                        )}
                                        onMouseEnter={() => {
                                            if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
                                        }}
                                        onMouseLeave={() => {
                                            closeTimerRef.current = setTimeout(
                                                () => setIsProjectsMenuOpen(false),
                                                150
                                            );
                                        }}
                                    >
                                        <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-2xl shadow-gray-200/60 sm:p-5">
                                            <div className="max-h-[min(70vh,720px)] overflow-y-auto pr-1">
                                                <div className={cn("grid grid-cols-1 gap-4", menuGridClass)}>
                                                {isProjectsMenuLoading ? (
                                                        <div className="col-span-full flex items-center justify-center gap-2 rounded-lg py-12 text-sm text-gray-500">
                                                        <Loader2 className="h-5 w-5 animate-spin" />
                                                        Projeler yükleniyor...
                                                    </div>
                                                ) : projectMenuItems.length > 0 ? (
                                                    projectMenuItems.map((project) => {
                                                        const visibleFeatures = (project.features || []).slice(0, 2);

                                                        return (
                                                        <Link
                                                            key={project.href}
                                                            href={`/${locale}${project.href}`}
                                                            onClick={() => setIsProjectsMenuOpen(false)}
                                                            className="group/item flex h-full flex-row gap-5 rounded-2xl border border-transparent p-4 transition-all hover:border-orange-100/60 hover:bg-orange-50/40"
                                                        >
                                                            {/* Image */}
                                                            <div className="relative aspect-[16/10] w-48 shrink-0 overflow-hidden rounded-xl border border-gray-100 bg-gray-100 shadow-sm">
                                                                <Image
                                                                    src={appendVersionParam(
                                                                        getMediaUrl(project.image),
                                                                        project.imageVersion
                                                                    )}
                                                                    alt={project.title}
                                                                    fill
                                                                    sizes="192px"
                                                                    unoptimized
                                                                    className="object-cover transition-transform duration-700 group-hover/item:scale-105"
                                                                />
                                                            </div>

                                                            {/* Info */}
                                                            <div className="flex min-w-0 flex-1 flex-col py-1">
                                                                {project.projectCategory && (
                                                                    <span className="mb-2 inline-flex w-fit items-center rounded bg-orange-500 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-white">
                                                                        {project.projectCategory}
                                                                    </span>
                                                                )}
                                                                <h4 className="truncate text-lg font-bold text-gray-900 group-hover/item:text-orange-600 transition-colors">
                                                                    {project.title}
                                                                </h4>
                                                                {project.location && (
                                                                    <div className="flex items-center gap-1.5 mt-1 text-[0.78rem] text-gray-500 font-medium">
                                                                        <MapPin className="h-3.5 w-3.5 shrink-0 text-orange-500/70" />
                                                                        <span className="truncate">{project.location}</span>
                                                                    </div>
                                                                )}
                                                                {project.description && (
                                                                    <p className="mt-2 line-clamp-2 text-sm text-gray-500 leading-relaxed">
                                                                        {project.description}
                                                                    </p>
                                                                )}
                                                                {visibleFeatures.length > 0 && (
                                                                    <div className="mt-3 flex items-center gap-3">
                                                                        {visibleFeatures.map((feature, idx) => (
                                                                            <div key={idx} className="flex min-w-0 items-center gap-1.5 text-xs text-gray-500">
                                                                                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-orange-50 text-orange-600">
                                                                                    <ProjectIcon name={feature.icon} className="h-3.5 w-3.5" />
                                                                                </div>
                                                                                <span className="truncate text-xs font-medium text-gray-600">{feature.label}</span>
                                                                            </div>
                                                                        ))}
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </Link>
                                                        );
                                                    })
                                                ) : (
                                                        <div className="col-span-full rounded-lg px-3 py-6 text-center text-sm text-gray-500">
                                                        Yayınlanmış proje bulunamadı.
                                                    </div>
                                                )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        }

                        return (
                            <Link
                                key={item.href}
                                href={baseHref}
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
                        {SOCIAL_LINK_ITEMS.map((item) => {
                            const Icon = socialIconMap[item.key];
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
                        const isProjeler = item.href === "/projeler";
                        const baseHref = `/${locale}${item.href === "/" ? "" : item.href}`;
                        const href = isProjeler
                            ? `/${locale}/portfoy?onlyProjects=true`
                            : baseHref;
                        const isActive = isProjeler
                            ? pathname === `/${locale}/portfoy` &&
                            searchParams.get("onlyProjects") === "true"
                            : pathname === baseHref;

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
                            {SOCIAL_LINK_ITEMS.map((item) => {
                                const Icon = socialIconMap[item.key];
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
