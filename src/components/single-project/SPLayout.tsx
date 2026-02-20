import React from "react";
import { NextIntlClientProvider } from "next-intl";
import { VersionProvider } from "@/contexts/VersionContext";
import { CurrencyProvider } from "@/contexts/CurrencyContext";
import { Navbar } from "@/components/public/navbar";
import { Footer } from "@/components/public/footer";
import trMessages from "../../../messages/tr.json";

export default function SPLayout({ children }: { children: React.ReactNode }) {
    return (
        <NextIntlClientProvider locale="tr" messages={trMessages}>
            <VersionProvider>
                <CurrencyProvider>
                    <div className="flex flex-col min-h-screen">
                        <Navbar locale="tr" />
                        <div className="flex-1 relative">
                            {children}
                        </div>
                        <Footer locale="tr" />
                    </div>
                </CurrencyProvider>
            </VersionProvider>
        </NextIntlClientProvider>
    );
}
