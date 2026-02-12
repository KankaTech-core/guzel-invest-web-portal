import { PortfolioMapView } from "@/components/public/portfolio-map-view";
import { Suspense } from "react";

export default async function MapPage({
    params,
}: {
    params: Promise<{ locale: string }>;
}) {
    const { locale } = await params;
    return (
        <Suspense fallback={null}>
            <PortfolioMapView locale={locale} />
        </Suspense>
    );
}
