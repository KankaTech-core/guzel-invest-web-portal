import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import { notFound } from "next/navigation";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { getMessages } from "next-intl/server";
import { locales, isRtl, type Locale } from "@/i18n/request";
import "@/app/globals.css";

const outfit = Outfit({
    subsets: ["latin"],
    variable: "--font-outfit",
});

export const metadata: Metadata = {
    title: "Güzel Invest | Alanya Gayrimenkul",
    description:
        "Alanya'da satılık villa, daire ve arsa. 2001'den beri güvenilir gayrimenkul danışmanlığı.",
};

type Props = {
    children: React.ReactNode;
    params: Promise<{ locale: string }>;
};

import { Navbar } from "@/components/public/navbar";
import { Footer } from "@/components/public/footer";

export default async function LocaleLayout({ children, params }: Props) {
    const { locale } = await params;

    if (!hasLocale(locales, locale)) {
        notFound();
    }

    const messages = await getMessages();
    const dir = isRtl(locale as Locale) ? "rtl" : "ltr";

    return (
        <html lang={locale} dir={dir}>
            <body className={`${outfit.variable} font-sans antialiased bg-white`}>
                <NextIntlClientProvider messages={messages}>
                    <div className="flex flex-col min-h-screen">
                        <Navbar locale={locale} />
                        <main className="flex-1">
                            {children}
                        </main>
                        <Footer locale={locale} />
                    </div>
                </NextIntlClientProvider>
            </body>
        </html>
    );
}
