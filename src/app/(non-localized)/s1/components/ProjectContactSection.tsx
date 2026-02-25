"use client";

import { useState } from "react";
import type { CountryCode } from "libphonenumber-js";
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
        ? "Geçerli bir telefon numarası girin."
        : undefined;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitError(null);

        if (!formData.acceptedTerms) {
            alert("Lütfen koşulları kabul ettiğinizi onaylayın.");
            return;
        }
        if (!phoneIsValid) {
            alert("Lütfen geçerli bir telefon numarası girin.");
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
        <section className="bg-gray-50 py-16 px-4">
            <div className="mx-auto max-w-4xl">
                <div className="rounded-2xl border border-gray-100 bg-white p-8 shadow-sm sm:p-12">
                    <div className="mb-8 text-center">
                        <h2 className="text-3xl font-bold text-gray-900">
                            Bilgi Alın
                        </h2>
                        <p className="mt-2 text-sm text-gray-500">
                            Proje hakkında detaylı bilgi almak için formu doldurun,
                            uzmanlarımız en kısa sürede sizinle iletişime geçsin.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                            <div className="space-y-6">
                                <Input
                                    label="Adınız"
                                    placeholder="Adınızı girin"
                                    required
                                    value={formData.name}
                                    onChange={(e) =>
                                        setFormData({ ...formData, name: e.target.value })
                                    }
                                />
                                <Input
                                    label="E-posta Adresiniz"
                                    type="email"
                                    placeholder="ornek@email.com"
                                    required
                                    value={formData.email}
                                    onChange={(e) =>
                                        setFormData({ ...formData, email: e.target.value })
                                    }
                                />
                            </div>

                            <div className="space-y-6">
                                <Input
                                    label="Soyadınız"
                                    placeholder="Soyadınızı girin"
                                    required
                                    value={formData.surname}
                                    onChange={(e) =>
                                        setFormData({ ...formData, surname: e.target.value })
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
                                            setFormData({ ...formData, phone: value })
                                        }
                                        placeholder=""
                                        defaultCountry={defaultPhoneCountry}
                                    />
                                    {phoneError && (
                                        <p className="mt-1.5 text-xs text-red-500">{phoneError}</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="border-t border-gray-100 pt-4 flex justify-center">
                            <Checkbox
                                label="Kullanıcı metnini okudum, iletişim kurulmasını kabul ediyorum."
                                checked={formData.acceptedTerms}
                                onChange={(checked) =>
                                    setFormData({ ...formData, acceptedTerms: checked })
                                }
                            />
                        </div>

                        <div className="pt-2 flex justify-center">
                            <Button
                                type="submit"
                                className="w-auto min-w-[200px] sm:w-auto"
                                variant="primary"
                                loading={isSubmitting}
                            >
                                {isSuccess ? "Gönderildi!" : "Gönder"}
                            </Button>
                            {submitError && (
                                <p className="mt-2 text-sm text-red-600">{submitError}</p>
                            )}
                        </div>
                    </form>
                </div>
            </div>
        </section>
    );
};
