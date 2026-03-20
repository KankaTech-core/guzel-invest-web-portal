"use client";

import { useState } from "react";
import type { CountryCode } from "libphonenumber-js";
import { useTranslations } from "next-intl";
import { Input, Checkbox, Button } from "@/components/ui";
import { PhoneInput } from "@/components/ui/phone-input";

interface HeroContactFormProps {
    locale?: string;
    projectSlug: string;
}

const DEFAULT_COUNTRY_BY_LOCALE: Partial<Record<string, CountryCode>> = {
    tr: "TR",
    en: "AE",
    de: "DE",
    ru: "RU",
};

function getDefaultCountryForLocale(locale?: string): CountryCode {
    const baseLocale = locale?.toLowerCase().split("-")[0];
    if (!baseLocale) {
        return "AE";
    }
    return DEFAULT_COUNTRY_BY_LOCALE[baseLocale] ?? "AE";
}

export const HeroContactForm = ({
    locale,
    projectSlug,
}: HeroContactFormProps) => {
    const t = useTranslations("leadForm");
    const tp = useTranslations("projectDetail");
    const defaultPhoneCountry = getDefaultCountryForLocale(locale);
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

    const hasPhoneValue = formData.phone.trim().length > 0;
    const phoneIsValid = /^\+\d{8,15}$/.test(formData.phone);
    const phoneError = hasPhoneValue && !phoneIsValid
        ? t("invalidPhone")
        : undefined;

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
                    body?.error || t("submitError")
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
                    : t("submitError");
            setSubmitError(message);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="w-full [&_label]:!text-white/90 [&_.checkbox-label]:!text-white/90 [&_input:not(.phone-input-search)]:!bg-white/10 [&_input:not(.phone-input-search)]:!border-white/20 [&_input:not(.phone-input-search)]:!text-white focus:[&_input:not(.phone-input-search)]:!border-white/50 [&_input:not(.phone-input-search)::placeholder]:!text-white/50 [&_.PhoneInputCountrySelectArrow]:!text-white/80">
            <h3 className="mb-6 text-2xl font-bold text-white text-center">
                {tp("heroFormTitle")}
            </h3>

            <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
                <Input
                    label={t("nameLabel")}
                    placeholder={t("namePlaceholder")}
                    required
                    value={formData.name}
                    onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                    }
                />

                <Input
                    label={t("surnameLabel")}
                    placeholder={t("surnamePlaceholder")}
                    required
                    value={formData.surname}
                    onChange={(e) =>
                        setFormData({ ...formData, surname: e.target.value })
                    }
                />

                <Input
                    label={t("emailLabel")}
                    type="email"
                    placeholder={t("emailPlaceholder")}
                    required
                    value={formData.email}
                    onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                    }
                />

                <div>
                    <label className="mb-1.5 block text-sm font-medium text-white/90">
                        {t("phoneLabel")}
                    </label>
                    <div className="[&_.phone-input-wrapper]:!rounded-lg [&_.phone-input-wrapper]:!border-white/20 [&_.phone-input-wrapper]:!bg-white/10 [&_.phone-input-wrapper]:!px-3 [&_.phone-input-wrapper:focus-within]:!border-white/50 [&_.phone-input-country-btn]:!text-white [&_.phone-input-chevron]:!text-white/80 [&_.phone-input-code]:!text-white [&_.phone-input-divider]:!bg-white/20 [&_.phone-input-field]:!border-none [&_.phone-input-field]:!bg-transparent [&_.phone-input-field]:!px-2 [&_.phone-input-field]:!text-white [&_.phone-input-field]:!focus:ring-0 [&_.phone-input-field::placeholder]:!text-white/50">
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
                        <p className="mt-1 text-xs text-red-300">{phoneError}</p>
                    )}
                </div>

                <div className="pt-2">
                    <Checkbox
                        label={t("termsCheckbox")}
                        checked={formData.acceptedTerms}
                        onChange={(checked) =>
                            setFormData({ ...formData, acceptedTerms: checked })
                        }
                    />
                </div>

                <div className="pt-2">
                    <Button
                        type="submit"
                        className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold"
                        variant="primary"
                        disabled={!formData.acceptedTerms || isSubmitting}
                        loading={isSubmitting}
                    >
                        {isSuccess ? t("submittedWithBang") : t("submit")}
                    </Button>
                    {submitError && (
                        <p className="mt-2 text-sm text-center text-red-400">{submitError}</p>
                    )}
                </div>
            </form>
        </div>
    );
};
