import { IBM_Plex_Mono, IBM_Plex_Sans } from "next/font/google";
import dynamic from "next/dynamic";
import { Suspense } from "react";

const PortfolioClient = dynamic(() =>
    import("@/components/public/portfolio-client").then(
        (module) => module.PortfolioClient
    )
);

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

export default async function PortfolioPage({
    params,
}: {
    params: Promise<{ locale: string }>;
}) {
    const { locale } = await params;

    return (
        <main
            className={`min-h-screen bg-gray-50 pt-24 pb-20 ${ibmPlexSans.variable} ${ibmPlexMono.variable}`}
        >
            <Suspense fallback={null}>
                <PortfolioClient locale={locale} />
            </Suspense>
        </main>
    );
}
