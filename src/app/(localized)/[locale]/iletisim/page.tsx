"use client";

import { useState } from "react";
import { Clock3, Instagram, Mail, MapPin, MessageCircle, Phone, Send } from "lucide-react";
import { useParams } from "next/navigation";
import type { CountryCode } from "libphonenumber-js";
import { Button, Checkbox, Input } from "@/components/ui";
import { PhoneInput } from "@/components/ui/phone-input";

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

type ContactCard = {
    title: string;
    value: string;
    href?: string;
    icon: React.ComponentType<{ className?: string }>;
    dark: boolean;
};

const contactCards = [
    {
        title: "Adres",
        value: "Kestel Mah. Sahil Cad. No:123\nAlanya / Antalya",
        icon: MapPin,
        dark: false,
    },
    {
        title: "Telefon",
        value: "+90 242 123 45 67",
        href: "tel:+902421234567",
        icon: Phone,
        dark: true,
    },
    {
        title: "E-posta",
        value: "info@guzelinvest.com",
        href: "mailto:info@guzelinvest.com",
        icon: Mail,
        dark: false,
    },
    {
        title: "Çalışma Saatleri",
        value: "Pazartesi - Cumartesi\n09:00 - 18:00",
        icon: Clock3,
        dark: true,
    },
] satisfies ReadonlyArray<ContactCard>;

export default function ContactPage() {
    const { locale } = useParams();
    const localeStr = Array.isArray(locale) ? locale[0] : locale;
    const defaultPhoneCountry = getDefaultCountryForLocale(localeStr);

    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [phone, setPhone] = useState("");
    const [acceptedTerms, setAcceptedTerms] = useState(false);

    const hasPhoneValue = phone.trim().length > 0;
    const phoneIsValid = /^\+\d{8,15}$/.test(phone);
    const phoneError = hasPhoneValue && !phoneIsValid
        ? "Geçerli bir telefon numarası girin."
        : undefined;

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formElement = event.currentTarget;

        if (!acceptedTerms) {
            setError("Lütfen koşulları kabul ettiğinizi onaylayın.");
            return;
        }

        if (hasPhoneValue && !phoneIsValid) {
            setError("Lütfen geçerli bir telefon numarası girin.");
            return;
        }

        setLoading(true);
        setSubmitted(false);
        setError(null);

        try {
            const formData = new FormData(formElement);
            const data = {
                name: formData.get("name"),
                surname: formData.get("surname"),
                email: formData.get("email"),
                phone: phone, // Changed from formData.get("phone")
                subject: formData.get("subject"),
                message: formData.get("message"),
                locale: localeStr || "tr",
            };

            const response = await fetch("/api/public/contact", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                throw new Error("Failed to submit form");
            }

            setSubmitted(true);
            setAcceptedTerms(false);
            setPhone("");
            formElement.reset();
        } catch (error) {
            console.error("Error submitting form:", error);
            setError("Mesajınız gönderilirken bir hata oluştu. Lütfen tekrar deneyin.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="overflow-x-hidden bg-white pb-20">
            <section className="relative isolate min-h-[340px] overflow-hidden bg-gray-900 pt-24 sm:min-h-[410px]">
                <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{
                        backgroundImage:
                            "url('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=2000&h=1200&fit=crop')",
                    }}
                />
                <div className="absolute inset-0 bg-gradient-to-b from-gray-900/60 via-gray-900/82 to-gray-900/88" />

                <div className="container-custom relative z-10 flex min-h-[340px] flex-col justify-center sm:min-h-[410px]">
                    <span className="inline-flex w-fit items-center rounded-full border border-orange-300/60 bg-orange-500/15 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.15em] text-orange-200">
                        İletişim • Güzel Invest
                    </span>
                    <h1 className="mt-4 max-w-3xl text-4xl font-bold text-white sm:text-5xl">
                        İletişime Geçin
                    </h1>
                    <p className="mt-4 max-w-2xl text-base leading-relaxed text-gray-200 sm:text-lg">
                        Sorularınız, portföy talepleriniz ve yatırım hedefleriniz için bizimle
                        doğrudan iletişime geçin. Ekibimiz size kısa sürede net bir geri dönüş sağlar.
                    </p>
                    <div className="mt-7 flex flex-wrap gap-3">
                        <a
                            href="tel:+902421234567"
                            className="inline-flex items-center gap-2 rounded-lg bg-orange-500 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-orange-400"
                        >
                            <Phone className="h-4 w-4" />
                            Hemen Ara
                        </a>
                        <a
                            href="mailto:info@guzelinvest.com"
                            className="inline-flex items-center gap-2 rounded-lg border border-gray-600 px-5 py-3 text-sm font-semibold text-gray-200 transition-colors hover:border-orange-300 hover:text-orange-300"
                        >
                            <Mail className="h-4 w-4" />
                            E-posta Gönder
                        </a>
                    </div>
                </div>
            </section>

            <section className="bg-white px-4 py-16 sm:px-6">
                <div className="container-custom grid grid-cols-1 gap-10 lg:grid-cols-12">
                    <div className="lg:col-span-5">
                        <h2 className="text-[11px] font-semibold uppercase tracking-[0.15em] text-orange-500">
                            İletişim Bilgileri
                        </h2>
                        <p className="mt-4 max-w-md text-sm leading-relaxed text-gray-600 sm:text-base">
                            Farklı iletişim kanallarından bize ulaşabilir, ihtiyaçlarınıza uygun
                            danışmanlık sürecini hemen başlatabilirsiniz.
                        </p>

                        <div className="mt-4 rounded-2xl border border-gray-200 bg-gray-50 p-3">
                            <div className="grid grid-cols-2 gap-3">
                                {contactCards.map((card) => {
                                    const Icon = card.icon;
                                    return (
                                        <article
                                            key={card.title}
                                            className="rounded-xl border border-gray-100 bg-white p-3 transition-all duration-300 hover:-translate-y-0.5 hover:border-orange-200 hover:shadow-lg hover:shadow-orange-500/5"
                                        >
                                            <span
                                                className={`mb-3 inline-flex h-9 w-9 items-center justify-center rounded-lg ${card.dark ? "bg-gray-900 text-white" : "bg-orange-500 text-white"}`}
                                            >
                                                <Icon className="h-4 w-4" />
                                            </span>
                                            <h3 className="text-[11px] font-semibold uppercase tracking-wide text-gray-400">
                                                {card.title}
                                            </h3>
                                            {card.href ? (
                                                <a
                                                    href={card.href}
                                                    className="mt-1 block whitespace-pre-line text-sm font-semibold text-gray-900 transition-colors hover:text-orange-500"
                                                >
                                                    {card.value}
                                                </a>
                                            ) : (
                                                <p className="mt-1 whitespace-pre-line text-sm font-semibold text-gray-900">
                                                    {card.value}
                                                </p>
                                            )}
                                        </article>
                                    );
                                })}
                            </div>
                        </div>

                        <div className="mt-4 overflow-hidden rounded-2xl border border-gray-200 bg-gray-50">
                            <iframe
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d585.909184440398!2d31.993719477737574!3d36.548971536174825!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14dc91820fd978db%3A0xde9e989f4fdcb3c7!2sG%C3%BCzel%20Invest!5e0!3m2!1sen!2str!4v1770997678937!5m2!1sen!2str"
                                className="h-[220px] w-full sm:h-[260px] lg:h-[250px]"
                                style={{ border: 0 }}
                                allowFullScreen
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                            />
                        </div>
                    </div>

                    <div className="lg:col-span-7">
                        <div className="mb-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                            <a
                                href="https://wa.me/902421234567"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[#25D366] px-5 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90"
                            >
                                <MessageCircle className="h-4 w-4" />
                                WhatsApp&apos;tan Yaz
                            </a>
                            <a
                                href="https://ig.me/m/guzelinvest"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-gray-900 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-black"
                            >
                                <Instagram className="h-4 w-4" />
                                Instagram DM
                            </a>
                        </div>

                        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
                            <div className="border-b border-gray-100 bg-gray-50 px-6 py-5 sm:px-8">
                                <h2 className="text-2xl font-bold text-gray-900">Bize Mesaj Gönderin</h2>
                                <p className="mt-2 text-sm text-gray-500">
                                    Formu doldurun, uzman ekibimiz size en kısa sürede dönüş yapsın.
                                </p>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-6 px-6 py-6 sm:px-8 sm:py-8">
                                <div className="grid gap-6 md:grid-cols-2">
                                    <Input
                                        label="Adınız"
                                        name="name"
                                        placeholder="Adınızı girin"
                                        required
                                    />
                                    <Input
                                        label="Soyadınız"
                                        name="surname"
                                        placeholder="Soyadınızı girin"
                                        required
                                    />
                                </div>
                                <div className="grid gap-6 md:grid-cols-1">
                                    <Input
                                        label="E-posta Adresiniz"
                                        name="email"
                                        type="email"
                                        placeholder="ornek@email.com"
                                        required
                                    />
                                </div>

                                <div className="grid gap-6 md:grid-cols-2">
                                    <div>
                                        <label className="mb-2 block text-sm font-medium text-gray-700">
                                            Telefon Numaranız
                                        </label>
                                        <PhoneInput
                                            key={`phone-${defaultPhoneCountry}`}
                                            value={phone}
                                            onChange={setPhone}
                                            placeholder=""
                                            defaultCountry={defaultPhoneCountry}
                                        />
                                        {phoneError && (
                                            <p className="mt-1.5 text-xs text-red-500">{phoneError}</p>
                                        )}
                                    </div>
                                    <Input
                                        label="Konu"
                                        name="subject"
                                        placeholder="Mesaj konusu"
                                    />
                                </div>

                                <div>
                                    <label className="mb-2 block text-sm font-medium text-gray-700">Mesajınız</label>
                                    <textarea
                                        name="message"
                                        rows={5}
                                        className="input resize-none"
                                        placeholder="Mesajınızı buraya yazın..."
                                        required
                                    />
                                </div>

                                <div className="border-t border-gray-100 pt-4 flex justify-start pl-1">
                                    <Checkbox
                                        label={<span className="text-xs text-gray-500">Kullanıcı metnini okudum, iletişim kurulmasını kabul ediyorum.</span>}
                                        checked={acceptedTerms}
                                        onChange={setAcceptedTerms}
                                    />
                                </div>

                                <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                                    <Button
                                        type="submit"
                                        variant="primary"
                                        size="lg"
                                        disabled={!acceptedTerms || loading}
                                        loading={loading}
                                        icon={<Send className="h-4 w-4" />}
                                    >
                                        Mesaj Gönder
                                    </Button>
                                </div>

                                {submitted ? (
                                    <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm font-medium text-green-700">
                                        Mesajınız alındı. Ekibimiz en kısa sürede sizinle iletişime geçecektir.
                                    </div>
                                ) : null}

                                {error ? (
                                    <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                                        {error}
                                    </div>
                                ) : null}
                            </form>
                        </div>
                    </div>
                </div>
            </section>

        </main>
    );
}
