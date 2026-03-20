import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import { notFound } from "next/navigation";
import Script from "next/script";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { getMessages } from "next-intl/server";
import { Agentation } from "agentation";
import { locales, isRtl, type Locale } from "@/i18n/request";
import "@/app/globals.css";
import { Footer } from "@/components/public/footer";
import { FloatingSocialButtons } from "@/components/public/floating-social-buttons";
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

const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID;

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
            {GTM_ID ? (
                <Script id="google-tag-manager" strategy="beforeInteractive">
                    {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${GTM_ID}');`}
                </Script>
            ) : null}
            <body suppressHydrationWarning className={`${outfit.variable} font-sans antialiased bg-white`}>
                {GTM_ID ? (
                    <noscript>
                        <iframe
                            src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
                            height="0"
                            width="0"
                            style={{ display: "none", visibility: "hidden" }}
                        />
                    </noscript>
                ) : null}
                <NextIntlClientProvider messages={messages}>
                    <VersionProvider>
                        <CurrencyProvider>
                            <div className="flex flex-col min-h-screen">
                                <NavbarHydrated locale={locale} />
                                <main className="flex-1">{children}</main>
                                <Footer locale={locale} />
                                <FloatingSocialButtons />
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
