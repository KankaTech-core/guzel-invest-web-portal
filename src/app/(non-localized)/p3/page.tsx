import { IBM_Plex_Mono, IBM_Plex_Sans } from "next/font/google";
import { Suspense } from "react";
import PortfolioNavigator from "@/components/portfolio/PortfolioNavigator";
import { PortfolioClient } from "@/components/public/portfolio-client";
import { CurrencyProvider } from "@/contexts/CurrencyContext";

const ibmPlexSans = IBM_Plex_Sans({
    subsets: ["latin"],
    variable: "--font-ibm-plex-sans",
    weight: ["400", "500", "600", "700"],
});

const ibmPlexMono = IBM_Plex_Mono({
    subsets: ["latin"],
    variable: "--font-ibm-plex-mono",
    weight: ["400", "500", "600"],
});

export default function PortfolioFintechTrustClarityPage() {
    return (
        <main
            className={`min-h-screen bg-gray-50 py-8 ${ibmPlexSans.variable} ${ibmPlexMono.variable}`}
        >
            <CurrencyProvider>
                <Suspense fallback={null}>
                    <PortfolioClient locale="tr" />
                </Suspense>
            </CurrencyProvider>
            <PortfolioNavigator />
        </main>
    );
}
