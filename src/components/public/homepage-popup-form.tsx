"use client";

import { useState, useEffect } from "react";
import type { CountryCode } from "libphonenumber-js";
import { Input, Checkbox, Button } from "@/components/ui";
import { PhoneInput } from "@/components/ui/phone-input";
import { useTranslations } from "next-intl";
import { X } from "lucide-react";
import Image from "next/image";
import { usePathname } from "next/navigation";

interface HomepagePopupFormProps {
    locale?: string;
}

const DEFAULT_COUNTRY_BY_LOCALE: Partial<Record<string, CountryCode>> = {
    tr: "TR",
    en: "AE",
    de: "DE",
    ru: "RU",
    ar: "AE",
};

function getDefaultCountryForLocale(locale?: string): CountryCode {
    const baseLocale = locale?.toLowerCase().split("-")[0];
    if (!baseLocale) {
        return "TR";
    }
    return DEFAULT_COUNTRY_BY_LOCALE[baseLocale] ?? "TR";
}

export const HomepagePopupForm = ({ locale }: HomepagePopupFormProps) => {
    const t = useTranslations("homepagePopup");
    const pathname = usePathname();
    const defaultPhoneCountry = getDefaultCountryForLocale(locale);

    const [isOpen, setIsOpen] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        surname: "",
        email: "",
        phone: "",
        message: "",
        acceptedTerms: false,
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [submitError, setSubmitError] = useState<string | null>(null);

    const hasPhoneValue = formData.phone.trim().length > 0;
    const phoneIsValid = /^\+\d{8,15}$/.test(formData.phone);
    const phoneError = hasPhoneValue && !phoneIsValid
        ? t("invalidPhone")
        : undefined;

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsOpen(true);
        }, 5000);

        const handleOpenEvent = () => setIsOpen(true);
        window.addEventListener("open-homepage-popup", handleOpenEvent);

        return () => {
            clearTimeout(timer);
            window.removeEventListener("open-homepage-popup", handleOpenEvent);
        };
    }, []);

    const handleClose = () => {
        setIsOpen(false);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitError(null);

        if (!formData.acceptedTerms) {
            alert(t("acceptTermsRequired"));
            return;
        }
        if (!phoneIsValid) {
            alert(t("invalidPhone"));
            return;
        }

        setIsSubmitting(true);
        try {
            const response = await fetch("/api/public/general-forms", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    locale: locale || "tr",
                    name: formData.name,
                    surname: formData.surname,
                    email: formData.email,
                    phone: formData.phone,
                    message: formData.message,
                    source: "homepage-popup",
                    url: pathname,
                }),
            });

            if (!response.ok) {
                const body = (await response.json().catch(() => null)) as {
                    error?: string;
                } | null;
                throw new Error(
                    body?.error || t("generalError")
                );
            }

            setIsSuccess(true);
            setFormData({
                name: "",
                surname: "",
                email: "",
                phone: "",
                message: "",
                acceptedTerms: false,
            });
            setTimeout(() => {
                setIsSuccess(false);
                handleClose();
            }, 3000);
        } catch (error) {
            const message =
                error instanceof Error
                    ? error.message
                    : t("generalError");
            setSubmitError(message);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-gray-900/60 p-4 transition-opacity duration-300"
            onClick={(e) => {
                if (e.target === e.currentTarget) {
                    handleClose();
                }
            }}
        >
            <div
                className="relative w-full max-w-2xl transform overflow-hidden rounded-2xl bg-white shadow-2xl transition-all"
                role="dialog"
                aria-modal="true"
            >
                {/* Close Button */}
                <button
                    onClick={handleClose}
                    className="absolute right-4 top-4 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-gray-500 transition-colors hover:bg-gray-200 hover:text-gray-900"
                    aria-label="Close"
                >
                    <X className="h-5 w-5" />
                </button>

                <div className="flex flex-col md:flex-row h-full">
                    {/* Visual / Branding Side - Hidden on small screens to save space or made smaller */}
                    <div className="hidden md:flex w-1/3 flex-col justify-between bg-[#1E2839] p-8 text-white">
                        <div>
                            <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-xl bg-white/10 backdrop-blur-md p-2">
                                <Image
                                    src="/images/testimonials/logo-square.svg"
                                    alt="Güzel Invest Logo"
                                    width={48}
                                    height={48}
                                    className="h-full w-full object-contain"
                                />
                            </div>
                            <h3 className="text-2xl font-bold leading-tight">
                                {t("title")}
                            </h3>
                            <p className="mt-4 text-sm text-gray-300 leading-relaxed">
                                {t("subtitle")}
                            </p>
                        </div>
                    </div>

                    {/* Form Side */}
                    <div className="flex-1 p-6 sm:p-8 overflow-y-auto max-h-[90vh]">
                        {/* Mobile Header (visible only on small screens) */}
                        <div className="mb-6 md:hidden text-center">
                            <h3 className="text-2xl font-bold text-gray-900">
                                {t("title")}
                            </h3>
                            <p className="mt-2 text-sm text-gray-500">
                                {t("subtitle")}
                            </p>
                        </div>

                        {isSuccess ? (
                            <div className="flex h-full min-h-[300px] flex-col items-center justify-center text-center">
                                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                                    <svg className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                                <h4 className="text-xl font-bold text-gray-900 mb-2">
                                    {t("successTitle")}
                                </h4>
                                <p className="text-gray-500">
                                    {t("successMessage")}
                                </p>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <Input
                                        label={t("name")}
                                        placeholder={t("namePlaceholder")}
                                        required
                                        value={formData.name}
                                        onChange={(e) =>
                                            setFormData({ ...formData, name: e.target.value })
                                        }
                                    />
                                    <Input
                                        label={t("surname")}
                                        placeholder={t("surnamePlaceholder")}
                                        required
                                        value={formData.surname}
                                        onChange={(e) =>
                                            setFormData({ ...formData, surname: e.target.value })
                                        }
                                    />
                                </div>

                                <div className="grid grid-cols-1 gap-4">
                                    <Input
                                        label={t("email")}
                                        type="email"
                                        placeholder="ornek@email.com"
                                        required
                                        value={formData.email}
                                        onChange={(e) =>
                                            setFormData({ ...formData, email: e.target.value })
                                        }
                                    />

                                    <div>
                                        <label className="mb-1.5 block text-sm font-medium text-gray-700">
                                            {t("phone")}
                                        </label>
                                        <div className="[&_.PhoneInputCountryIcon]:!border-[#FF6900]">
                                            <PhoneInput
                                                key={`phone-${defaultPhoneCountry}`}
                                                value={formData.phone}
                                                onChange={(value) =>
                                                    setFormData({ ...formData, phone: value })
                                                }
                                                placeholder=""
                                                defaultCountry={defaultPhoneCountry}
                                            />
                                        </div>
                                        {phoneError && (
                                            <p className="mt-1 text-xs text-red-500">{phoneError}</p>
                                        )}
                                    </div>
                                </div>

                                <div>
                                    <label className="mb-1.5 block text-sm font-medium text-gray-700">
                                        {t("message")}
                                    </label>
                                    <textarea
                                        required
                                        className="flex min-h-[80px] w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 outline-none transition-colors placeholder:text-gray-400 focus:border-[#FF6900] focus:ring-2 focus:ring-[#FF6900]/20 disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500 resize-none"
                                        placeholder={t("messagePlaceholder")}
                                        value={formData.message}
                                        onChange={(e) =>
                                            setFormData({ ...formData, message: e.target.value })
                                        }
                                    />
                                </div>

                                <div className="pt-2 flex pl-1">
                                    <Checkbox
                                        label={<span className="text-xs text-gray-500">{t("termsCheckbox")}</span>}
                                        checked={formData.acceptedTerms}
                                        onChange={(checked) =>
                                            setFormData({ ...formData, acceptedTerms: checked })
                                        }
                                    />
                                </div>

                                <div className="pt-2">
                                    <Button
                                        type="submit"
                                        className="w-full !bg-[#FF6900] !border-[#FF6900] hover:!bg-[#e55e00] hover:!border-[#e55e00] text-white"
                                        variant="primary"
                                        disabled={!formData.acceptedTerms || isSubmitting}
                                        loading={isSubmitting}
                                    >
                                        {t("submit")}
                                    </Button>
                                    {submitError && (
                                        <p className="mt-2 text-center text-sm text-red-600">{submitError}</p>
                                    )}
                                </div>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
