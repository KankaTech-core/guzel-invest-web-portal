"use client";

import { useEffect, useMemo, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import type { CountryCode } from "libphonenumber-js";
import {
    Mail,
    MessageCircleMore,
    PhoneCall,
    Send,
    User,
    X,
} from "lucide-react";
import { PhoneInput } from "@/components/ui/phone-input";
import { Checkbox } from "@/components/ui";

interface ListingContactPanelProps {
    title: string;
    listingSlug: string;
    locale?: string;
    listingCode?: string | null;
    phoneNumber: string;
    phoneLabel: string;
}

interface ContactFormFieldsProps {
    title: string;
    listingSlug: string;
    locale?: string;
    listingCode?: string | null;
}

interface ListingContactFormState {
    name: string;
    surname: string;
    email: string;
    phone: string;
    message: string;
    acceptedTerms: boolean;
}

const DEFAULT_COUNTRY_BY_LOCALE: Partial<Record<string, CountryCode>> = {
    tr: "TR",
    en: "AE",
    de: "DE",
    ru: "RU",
    ar: "AE",
};

const subscribeNoop = () => () => { };

function getDefaultCountryForLocale(locale?: string): CountryCode {
    const baseLocale = locale?.toLowerCase().split("-")[0];
    if (!baseLocale) {
        return "AE";
    }
    return DEFAULT_COUNTRY_BY_LOCALE[baseLocale] ?? "AE";
}

function buildDefaultMessage(title: string, listingCode?: string | null) {
    const codeLabel = listingCode?.trim();
    return codeLabel
        ? `Merhaba, "${title} (${codeLabel})" ilanı hakkında bilgi almak istiyorum.`
        : `Merhaba, "${title}" ilanı hakkında bilgi almak istiyorum.`;
}

function ContactFormFields({
    title,
    listingSlug,
    locale,
    listingCode,
}: ContactFormFieldsProps) {
    const defaultPhoneCountry = getDefaultCountryForLocale(locale);
    const defaultMessage = useMemo(
        () => buildDefaultMessage(title, listingCode),
        [listingCode, title]
    );

    const [formData, setFormData] = useState<ListingContactFormState>({
        name: "",
        surname: "",
        email: "",
        phone: "",
        message: defaultMessage,
        acceptedTerms: false,
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [submitError, setSubmitError] = useState<string | null>(null);
    const hasPhoneValue = formData.phone.trim().length > 0;
    const phoneIsValid = /^\+\d{8,15}$/.test(formData.phone);
    const phoneError = hasPhoneValue && !phoneIsValid
        ? "Geçerli bir telefon numarası girin."
        : undefined;

    useEffect(() => {
        setFormData({
            name: "",
            surname: "",
            email: "",
            phone: "",
            message: defaultMessage,
            acceptedTerms: false,
        });
        setIsSuccess(false);
        setSubmitError(null);
    }, [defaultMessage]);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
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
            const response = await fetch("/api/public/listing-forms", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    listingSlug,
                    locale: locale || "tr",
                    name: formData.name,
                    surname: formData.surname,
                    email: formData.email,
                    phone: formData.phone,
                    message: formData.message,
                }),
            });

            if (!response.ok) {
                const body = (await response.json().catch(() => null)) as {
                    error?: string;
                } | null;
                throw new Error(body?.error || "Form gönderimi sırasında bir hata oluştu.");
            }

            setIsSuccess(true);
            setFormData({
                name: "",
                surname: "",
                email: "",
                phone: "",
                message: defaultMessage,
                acceptedTerms: false,
            });
        } catch (error) {
            setSubmitError(
                error instanceof Error
                    ? error.message
                    : "Form gönderimi sırasında bir hata oluştu."
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form className="listing-contact-form space-y-3" onSubmit={handleSubmit}>
            <div className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white px-3.5 py-3 transition focus-within:border-[#5099ff] focus-within:ring-2 focus-within:ring-[#dcebff]">
                <User className="h-4 w-4 shrink-0 text-gray-400" />
                <input
                    data-contact-field="true"
                    type="text"
                    required
                    placeholder="Adınız *"
                    value={formData.name}
                    onChange={(event) =>
                        setFormData((current) => ({
                            ...current,
                            name: event.target.value,
                        }))
                    }
                    className="w-full border-0 bg-transparent p-0 text-base text-[#111828] placeholder:text-gray-400 focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0"
                />
            </div>
            <div className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white px-3.5 py-3 transition focus-within:border-[#5099ff] focus-within:ring-2 focus-within:ring-[#dcebff]">
                <User className="h-4 w-4 shrink-0 text-gray-400" />
                <input
                    data-contact-field="true"
                    type="text"
                    required
                    placeholder="Soyadınız *"
                    value={formData.surname}
                    onChange={(event) =>
                        setFormData((current) => ({
                            ...current,
                            surname: event.target.value,
                        }))
                    }
                    className="w-full border-0 bg-transparent p-0 text-base text-[#111828] placeholder:text-gray-400 focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0"
                />
            </div>
            <div className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white px-3.5 py-3 transition focus-within:border-[#5099ff] focus-within:ring-2 focus-within:ring-[#dcebff]">
                <Mail className="h-4 w-4 shrink-0 text-gray-400" />
                <input
                    data-contact-field="true"
                    type="email"
                    required
                    placeholder="E-posta Adresiniz *"
                    value={formData.email}
                    onChange={(event) =>
                        setFormData((current) => ({
                            ...current,
                            email: event.target.value,
                        }))
                    }
                    className="w-full border-0 bg-transparent p-0 text-base text-[#111828] placeholder:text-gray-400 focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0"
                />
            </div>
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
                {phoneError && (
                    <p className="mt-1.5 text-xs text-red-500">{phoneError}</p>
                )}
            </div>
            <div className="flex items-start gap-3 rounded-xl border border-gray-200 bg-white px-3.5 py-3 transition focus-within:border-[#5099ff] focus-within:ring-2 focus-within:ring-[#dcebff]">
                <MessageCircleMore className="mt-1 h-4 w-4 shrink-0 text-gray-400" />
                <textarea
                    rows={5}
                    required
                    placeholder="Mesajınız"
                    value={formData.message}
                    onChange={(event) =>
                        setFormData((current) => ({
                            ...current,
                            message: event.target.value,
                        }))
                    }
                    className="w-full resize-none border-0 bg-transparent p-0 text-base leading-relaxed text-[#111828] placeholder:text-gray-400 focus:outline-none"
                />
            </div>
            <div className="flex justify-center py-2 px-1">
                <Checkbox
                    label={<span className="text-xs text-gray-500">Kullanıcı metnini okudum, iletişim kurulmasını kabul ediyorum.</span>}
                    checked={formData.acceptedTerms}
                    onChange={(checked) =>
                        setFormData((current) => ({
                            ...current,
                            acceptedTerms: checked,
                        }))
                    }
                />
            </div>
            <button
                type="submit"
                disabled={!formData.acceptedTerms || isSubmitting}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#5099ff] px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-[#3f86e4] disabled:cursor-not-allowed disabled:opacity-80"
            >
                <Send className="h-4 w-4" />
                {isSubmitting ? "Gönderiliyor..." : isSuccess ? "Gönderildi" : "Gönder"}
            </button>

            {submitError ? (
                <p className="text-sm text-red-600">{submitError}</p>
            ) : null}
        </form>
    );
}

export function ListingContactPanel({
    title,
    listingSlug,
    locale,
    listingCode,
    phoneNumber,
    phoneLabel,
}: ListingContactPanelProps) {
    const [isMobileOpen, setIsMobileOpen] = useState(false);
    const isHydrated = useSyncExternalStore(
        subscribeNoop,
        () => true,
        () => false
    );

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

    return (
        <>
            <aside className="sticky top-28 hidden self-start xl:block">
                <div className="max-h-[calc(100vh-8rem)] overflow-y-auto rounded-[2rem] border border-gray-200 bg-white p-6">
                    <h2 className="text-2xl font-semibold text-[#111828]">İletişime Geçin</h2>
                    <p className="mt-2 text-sm text-gray-500">
                        Uzman danışmanlarımız bu ilan için aynı gün içinde geri dönüş
                        sağlar.
                    </p>
                    <div className="mt-5">
                        <ContactFormFields
                            title={title}
                            listingSlug={listingSlug}
                            locale={locale}
                            listingCode={listingCode}
                        />
                    </div>
                    <a
                        href={`tel:+${phoneNumber}`}
                        className="mt-4 flex items-center justify-center gap-2 rounded-xl bg-[#ff6900] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#e85f00]"
                    >
                        <PhoneCall className="h-4 w-4" />
                        {phoneLabel}
                    </a>
                </div>
            </aside>

            {isHydrated
                ? createPortal(
                    <>
                        <div
                            className={`fixed inset-x-4 z-[10020] transition-opacity xl:hidden ${isMobileOpen ? "pointer-events-none opacity-0" : "opacity-100"}`}
                            style={{ bottom: "max(1rem, env(safe-area-inset-bottom))" }}
                        >
                            <button
                                type="button"
                                onClick={() => setIsMobileOpen(true)}
                                className="flex w-full touch-manipulation items-center justify-center gap-2 rounded-2xl bg-[#111828] px-5 py-3.5 text-sm font-semibold text-white shadow-[0_12px_32px_rgba(17,24,40,0.36)] transition hover:bg-[#1d2740]"
                            >
                                <Send className="h-4 w-4" />
                                Bilgi Talep Formu
                            </button>
                        </div>

                        {isMobileOpen ? (
                            <div
                                className="fixed inset-0 z-[10030] bg-black/55 backdrop-blur-[1px]"
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
                                            <h3 className="text-lg font-semibold text-[#111828]">İletişime Geçin</h3>
                                            <p className="text-sm text-gray-500">
                                                Formu doldurun, sizi aynı gün arayalım.
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
                                        <ContactFormFields
                                            title={title}
                                            listingSlug={listingSlug}
                                            locale={locale}
                                            listingCode={listingCode}
                                        />
                                        <a
                                            href={`tel:+${phoneNumber}`}
                                            className="mt-4 flex items-center justify-center gap-2 rounded-xl bg-[#ff6900] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#e85f00]"
                                        >
                                            <PhoneCall className="h-4 w-4" />
                                            {phoneLabel}
                                        </a>
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
}
