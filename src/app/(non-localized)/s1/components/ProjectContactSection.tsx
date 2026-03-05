"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import type { CountryCode } from "libphonenumber-js";
import { Send, X } from "lucide-react";
import { Input, Checkbox, Button } from "@/components/ui";
import { PhoneInput } from "@/components/ui/phone-input";

interface ProjectContactSectionProps {
    locale?: string;
    projectSlug: string;
}

const DEFAULT_COUNTRY_BY_LOCALE: Partial<Record<string, CountryCode>> = {
    tr: "TR",
    en: "AE",
    de: "DE",
    ru: "RU",
    ar: "AE",
};

const subscribeNoop = () => () => { };
const DESKTOP_BREAKPOINT_QUERY = "(min-width: 1024px)";

function getDefaultCountryForLocale(locale?: string): CountryCode {
    const baseLocale = locale?.toLowerCase().split("-")[0];
    if (!baseLocale) {
        return "AE";
    }
    return DEFAULT_COUNTRY_BY_LOCALE[baseLocale] ?? "AE";
}

export const ProjectContactSection = ({
    locale,
    projectSlug,
}: ProjectContactSectionProps) => {
    const defaultPhoneCountry = getDefaultCountryForLocale(locale);
    const [isMobileOpen, setIsMobileOpen] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        surname: "",
        email: "",
        phone: "",
        acceptedTerms: false,
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [submitError, setSubmitError] = useState<string | null>(null);
    const isHydrated = useSyncExternalStore(
        subscribeNoop,
        () => true,
        () => false
    );

    const hasPhoneValue = formData.phone.trim().length > 0;
    const phoneIsValid = /^\+\d{8,15}$/.test(formData.phone);
    const phoneError = hasPhoneValue && !phoneIsValid
        ? "Geçerli bir telefon numarası girin."
        : undefined;

    useEffect(() => {
        if (!isMobileOpen) {
            return;
        }

        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";

        const onEscape = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                setIsMobileOpen(false);
            }
        };

        window.addEventListener("keydown", onEscape);
        return () => {
            document.body.style.overflow = previousOverflow;
            window.removeEventListener("keydown", onEscape);
        };
    }, [isMobileOpen]);

    useEffect(() => {
        if (!isMobileOpen) {
            return;
        }

        const mediaQuery = window.matchMedia(DESKTOP_BREAKPOINT_QUERY);
        if (mediaQuery.matches) {
            setIsMobileOpen(false);
            return;
        }

        const handleChange = (event: MediaQueryListEvent) => {
            if (event.matches) {
                setIsMobileOpen(false);
            }
        };

        mediaQuery.addEventListener("change", handleChange);
        return () => {
            mediaQuery.removeEventListener("change", handleChange);
        };
    }, [isMobileOpen]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitError(null);
        setIsSuccess(false);

        if (!formData.acceptedTerms) {
            setSubmitError("Lütfen koşulları kabul ettiğinizi onaylayın.");
            return;
        }
        if (!phoneIsValid) {
            setSubmitError("Lütfen geçerli bir telefon numarası girin.");
            return;
        }

        setIsSubmitting(true);
        try {
            const response = await fetch("/api/public/project-forms", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    projectSlug,
                    locale: locale || "tr",
                    name: formData.name,
                    surname: formData.surname,
                    email: formData.email,
                    phone: formData.phone,
                }),
            });

            if (!response.ok) {
                const body = (await response.json().catch(() => null)) as {
                    error?: string;
                } | null;
                throw new Error(
                    body?.error || "Form gönderimi sırasında bir hata oluştu."
                );
            }

            setIsSuccess(true);
            setFormData({
                name: "",
                surname: "",
                email: "",
                phone: "",
                acceptedTerms: false,
            });
            setTimeout(() => setIsSuccess(false), 5000);
        } catch (error) {
            const message =
                error instanceof Error
                    ? error.message
                    : "Form gönderimi sırasında bir hata oluştu.";
            setSubmitError(message);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <>
            {isHydrated
                ? createPortal(
                    <>
                        <div
                            className={`fixed inset-x-4 z-[9990] transition-opacity lg:hidden ${isMobileOpen ? "pointer-events-none opacity-0" : "opacity-100"}`}
                            style={{ bottom: "max(1rem, env(safe-area-inset-bottom))" }}
                        >
                            <button
                                type="button"
                                onClick={() => {
                                    setSubmitError(null);
                                    setIsSuccess(false);
                                    setIsMobileOpen(true);
                                }}
                                className="flex w-full touch-manipulation items-center justify-center gap-2 rounded-2xl bg-[#111828] px-5 py-3.5 text-sm font-semibold text-white shadow-[0_12px_32px_rgba(17,24,40,0.36)] transition hover:bg-[#1d2740]"
                            >
                                <Send className="h-4 w-4" />
                                Bilgi Talep Formu
                            </button>
                        </div>

                        {isMobileOpen ? (
                            <div
                                className="fixed inset-0 z-[10030] bg-black/55 backdrop-blur-[1px] lg:hidden"
                                onClick={() => setIsMobileOpen(false)}
                            >
                                <button
                                    type="button"
                                    onClick={() => setIsMobileOpen(false)}
                                    className="sr-only"
                                    aria-label="Formu kapat"
                                >
                                    Kapat
                                </button>

                                <div
                                    className="absolute inset-x-0 bottom-0 max-h-[88vh] overflow-hidden rounded-t-[2rem] border-t border-gray-200 bg-white shadow-2xl"
                                    onClick={(event) => event.stopPropagation()}
                                >
                                    <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4">
                                        <div>
                                            <h3 className="text-lg font-semibold text-[#111828]">Bilgi Alın</h3>
                                            <p className="text-sm text-gray-500">
                                                Formu doldurun, uzmanlarımız sizi arasın.
                                            </p>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => setIsMobileOpen(false)}
                                            className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 text-gray-600 transition hover:bg-gray-50"
                                            aria-label="Formu kapat"
                                        >
                                            <X className="h-4 w-4" />
                                        </button>
                                    </div>

                                    <div className="overflow-y-auto px-4 pb-[calc(env(safe-area-inset-bottom)+1.1rem)] pt-4">
                                        <form onSubmit={handleSubmit} className="space-y-4">
                                            <Input
                                                label="Adınız"
                                                placeholder="Adınızı girin"
                                                required
                                                value={formData.name}
                                                onChange={(event) =>
                                                    setFormData((current) => ({
                                                        ...current,
                                                        name: event.target.value,
                                                    }))
                                                }
                                            />
                                            <Input
                                                label="Soyadınız"
                                                placeholder="Soyadınızı girin"
                                                required
                                                value={formData.surname}
                                                onChange={(event) =>
                                                    setFormData((current) => ({
                                                        ...current,
                                                        surname: event.target.value,
                                                    }))
                                                }
                                            />
                                            <Input
                                                label="E-posta Adresiniz"
                                                type="email"
                                                placeholder="ornek@email.com"
                                                required
                                                value={formData.email}
                                                onChange={(event) =>
                                                    setFormData((current) => ({
                                                        ...current,
                                                        email: event.target.value,
                                                    }))
                                                }
                                            />

                                            <div>
                                                <label className="mb-2 block text-sm font-medium text-gray-700">
                                                    Telefon Numaranız
                                                </label>
                                                <PhoneInput
                                                    key={`phone-${defaultPhoneCountry}`}
                                                    value={formData.phone}
                                                    onChange={(value) =>
                                                        setFormData((current) => ({
                                                            ...current,
                                                            phone: value,
                                                        }))
                                                    }
                                                    placeholder=""
                                                    defaultCountry={defaultPhoneCountry}
                                                />
                                                {phoneError ? (
                                                    <p className="mt-1.5 text-xs text-red-500">{phoneError}</p>
                                                ) : null}
                                            </div>

                                            <div className="flex justify-center border-t border-gray-100 px-1 py-2">
                                                <Checkbox
                                                    label={
                                                        <span className="text-xs text-gray-500">
                                                            Kullanıcı metnini okudum, iletişim kurulmasını kabul ediyorum.
                                                        </span>
                                                    }
                                                    checked={formData.acceptedTerms}
                                                    onChange={(checked) =>
                                                        setFormData((current) => ({
                                                            ...current,
                                                            acceptedTerms: checked,
                                                        }))
                                                    }
                                                />
                                            </div>

                                            <Button
                                                type="submit"
                                                className="w-full"
                                                variant="primary"
                                                disabled={!formData.acceptedTerms || isSubmitting}
                                                loading={isSubmitting}
                                            >
                                                {isSuccess ? "Gönderildi!" : "Gönder"}
                                            </Button>

                                            {submitError ? (
                                                <p className="text-sm text-red-600">{submitError}</p>
                                            ) : null}
                                        </form>
                                    </div>
                                </div>
                            </div>
                        ) : null}
                    </>,
                    document.body
                )
                : null}
        </>
    );
};
