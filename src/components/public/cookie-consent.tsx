"use client";

import { useState, useEffect, useCallback } from "react";
import { useTranslations } from "next-intl";
import { Cookie, X, ChevronDown, Settings2 } from "lucide-react";

type CookiePreferences = {
    essential: boolean;
    analytics: boolean;
    marketing: boolean;
    functional: boolean;
};

const STORAGE_KEY = "cookie-consent";

function getStoredConsent(): CookiePreferences | null {
    if (typeof window === "undefined") return null;
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        return stored ? JSON.parse(stored) : null;
    } catch {
        return null;
    }
}

function storeConsent(prefs: CookiePreferences) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
}

export function CookieConsent() {
    const t = useTranslations("cookies");
    const [mounted, setMounted] = useState(false);
    const [showBanner, setShowBanner] = useState(false);
    const [showCustomize, setShowCustomize] = useState(false);
    const [minimized, setMinimized] = useState(false);
    const [preferences, setPreferences] = useState<CookiePreferences>({
        essential: true,
        analytics: false,
        marketing: false,
        functional: false,
    });

    useEffect(() => {
        setMounted(true);
        const stored = getStoredConsent();
        if (!stored) {
            setShowBanner(true);
        } else {
            setPreferences(stored);
            setMinimized(true);
        }
    }, []);

    const handleAcceptAll = useCallback(() => {
        const all: CookiePreferences = {
            essential: true,
            analytics: true,
            marketing: true,
            functional: true,
        };
        storeConsent(all);
        setPreferences(all);
        setShowBanner(false);
        setShowCustomize(false);
        setMinimized(true);
    }, []);

    const handleAcceptEssential = useCallback(() => {
        const essential: CookiePreferences = {
            essential: true,
            analytics: false,
            marketing: false,
            functional: false,
        };
        storeConsent(essential);
        setPreferences(essential);
        setShowBanner(false);
        setShowCustomize(false);
        setMinimized(true);
    }, []);

    const handleReject = useCallback(() => {
        const rejected: CookiePreferences = {
            essential: false,
            analytics: false,
            marketing: false,
            functional: false,
        };
        storeConsent(rejected);
        setPreferences(rejected);
        setShowBanner(false);
        setShowCustomize(false);
        setMinimized(true);
    }, []);

    const handleSaveCustom = useCallback(() => {
        storeConsent(preferences);
        setShowBanner(false);
        setShowCustomize(false);
        setMinimized(true);
    }, [preferences]);

    const togglePreference = (key: keyof Omit<CookiePreferences, "essential">) => {
        setPreferences((prev) => ({ ...prev, [key]: !prev[key] }));
    };

    if (!mounted) return null;

    // Minimized cookie button (bottom-left)
    if (minimized && !showBanner && !showCustomize) {
        return (
            <button
                onClick={() => {
                    setShowBanner(true);
                    setMinimized(false);
                }}
                aria-label={t("manage")}
                className="fixed bottom-6 left-6 z-50 flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-lg border border-gray-200 text-gray-600 transition-all hover:scale-105 hover:shadow-xl"
            >
                <Cookie className="h-4.5 w-4.5" />
            </button>
        );
    }

    // Customize modal
    if (showCustomize) {
        return (
            <>
                <div
                    className="fixed inset-0 z-[60] bg-black/30 backdrop-blur-sm"
                    onClick={() => setShowCustomize(false)}
                />
                <div className="fixed left-4 right-4 bottom-4 z-[61] max-w-md rounded-xl bg-white p-5 shadow-2xl sm:left-6 sm:right-auto sm:bottom-6 overflow-hidden">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-semibold text-gray-900">{t("customizeTitle")}</h3>
                        <button
                            onClick={() => setShowCustomize(false)}
                            aria-label={t("close")}
                            className="text-gray-400 hover:text-gray-600 transition-colors"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    </div>

                    <div className="space-y-3 mb-5">
                        {/* Essential - always on */}
                        <div className="flex items-center justify-between py-2 border-b border-gray-100">
                            <div>
                                <p className="text-sm font-medium text-gray-900">{t("essential")}</p>
                                <p className="text-xs text-gray-500">{t("essentialDesc")}</p>
                            </div>
                            <div className="relative h-5 w-9 rounded-full bg-primary-500 opacity-60 cursor-not-allowed">
                                <div className="absolute right-0.5 top-0.5 h-4 w-4 rounded-full bg-white shadow-sm" />
                            </div>
                        </div>

                        {/* Analytics */}
                        <ToggleRow
                            label={t("analytics")}
                            description={t("analyticsDesc")}
                            checked={preferences.analytics}
                            onChange={() => togglePreference("analytics")}
                        />

                        {/* Marketing */}
                        <ToggleRow
                            label={t("marketing")}
                            description={t("marketingDesc")}
                            checked={preferences.marketing}
                            onChange={() => togglePreference("marketing")}
                        />

                        {/* Functional */}
                        <ToggleRow
                            label={t("functional")}
                            description={t("functionalDesc")}
                            checked={preferences.functional}
                            onChange={() => togglePreference("functional")}
                        />
                    </div>

                    <div className="flex gap-2">
                        <button
                            onClick={handleReject}
                            className="flex-1 rounded-lg border border-gray-200 px-3 py-2 text-xs font-medium text-gray-700 transition-colors hover:bg-gray-50"
                        >
                            {t("rejectAll")}
                        </button>
                        <button
                            onClick={handleSaveCustom}
                            className="flex-1 rounded-lg bg-primary-500 px-3 py-2 text-xs font-medium text-white transition-colors hover:bg-primary-600"
                        >
                            {t("savePreferences")}
                        </button>
                    </div>
                </div>
            </>
        );
    }

    // Main banner
    if (!showBanner) return null;

    return (
        <div className="fixed left-4 right-4 bottom-4 z-50 max-w-sm rounded-xl bg-white p-4 shadow-2xl border border-gray-100 sm:left-6 sm:right-auto sm:bottom-6 animate-slide-up overflow-hidden">
            <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                    <Cookie className="h-4 w-4 text-primary-500 shrink-0" />
                    <h3 className="text-sm font-semibold text-gray-900">{t("title")}</h3>
                </div>
                <button
                    onClick={() => {
                        setShowBanner(false);
                        setMinimized(true);
                    }}
                    aria-label={t("close")}
                    className="text-gray-400 hover:text-gray-600 transition-colors -mt-0.5"
                >
                    <ChevronDown className="h-4 w-4" />
                </button>
            </div>

            <p className="text-xs text-gray-500 leading-relaxed mb-3">{t("description")}</p>

            <div className="grid grid-cols-2 gap-2">
                <button
                    onClick={handleAcceptAll}
                    className="rounded-lg bg-primary-500 px-3 py-2 text-xs font-medium text-white transition-colors hover:bg-primary-600"
                >
                    {t("acceptAll")}
                </button>
                <button
                    onClick={handleAcceptEssential}
                    className="rounded-lg border border-gray-200 px-3 py-2 text-xs font-medium text-gray-700 transition-colors hover:bg-gray-50"
                >
                    {t("essentialOnly")}
                </button>
                <button
                    onClick={() => setShowCustomize(true)}
                    className="flex items-center justify-center gap-1 rounded-lg border border-gray-200 px-3 py-2 text-xs font-medium text-gray-700 transition-colors hover:bg-gray-50"
                >
                    <Settings2 className="h-3 w-3" />
                    {t("customize")}
                </button>
                <button
                    onClick={handleReject}
                    className="rounded-lg border border-gray-200 px-3 py-2 text-xs font-medium text-gray-500 transition-colors hover:text-gray-700 hover:bg-gray-50"
                >
                    {t("rejectAll")}
                </button>
            </div>
        </div>
    );
}

function ToggleRow({
    label,
    description,
    checked,
    onChange,
}: {
    label: string;
    description: string;
    checked: boolean;
    onChange: () => void;
}) {
    return (
        <div className="flex items-center justify-between py-2 border-b border-gray-100">
            <div className="pr-4">
                <p className="text-sm font-medium text-gray-900">{label}</p>
                <p className="text-xs text-gray-500">{description}</p>
            </div>
            <button
                type="button"
                role="switch"
                aria-checked={checked}
                onClick={onChange}
                className={`relative h-5 w-9 shrink-0 rounded-full transition-colors ${
                    checked ? "bg-primary-500" : "bg-gray-300"
                }`}
            >
                <div
                    className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow-sm transition-transform ${
                        checked ? "translate-x-4" : "translate-x-0.5"
                    }`}
                />
            </button>
        </div>
    );
}
