import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import { notFound } from "next/navigation";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { getMessages } from "next-intl/server";
import { Agentation } from "agentation";
import { locales, isRtl, type Locale } from "@/i18n/request";
import "@/app/globals.css";
import { Footer } from "@/components/public/footer";
import { NavbarHydrated } from "@/components/public/navbar-hydrated";
import { AdminOverlayControls } from "@/components/public/admin-overlay-controls";
import { VersionProvider } from "@/contexts/VersionContext";
import { CurrencyProvider } from "@/contexts/CurrencyContext";
import { getSession } from "@/lib/auth";
import { Role } from "@/generated/prisma";

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

export default async function LocaleLayout({ children, params }: Props) {
    const { locale } = await params;

    if (!hasLocale(locales, locale)) {
        notFound();
    }

    const messages = await getMessages();
    const dir = isRtl(locale as Locale) ? "rtl" : "ltr";
    const session = await getSession();
    const isAdminUser = session?.role === Role.ADMIN;

    return (
        <html lang={locale} dir={dir}>
            <body className={`${outfit.variable} font-sans antialiased bg-white`}>
                <NextIntlClientProvider messages={messages}>
                    <VersionProvider>
                        <CurrencyProvider>
                            <div className="flex flex-col min-h-screen">
                                <NavbarHydrated locale={locale} />
                                <main className="flex-1">{children}</main>
                                <Footer locale={locale} />
                                {isAdminUser ? <AdminOverlayControls /> : null}
                            </div>
                        </CurrencyProvider>
                    </VersionProvider>
                </NextIntlClientProvider>
                {process.env.NODE_ENV === "development" && <Agentation />}
            </body>
        </html>
    );
}
