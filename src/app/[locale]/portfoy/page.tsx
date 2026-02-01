import { PortfolioClient } from "@/components/public/portfolio-client";

export default async function PortfolioPage({
    params,
}: {
    params: Promise<{ locale: string }>;
}) {
    const { locale } = await params;

    return (
        <main className="pt-24 pb-20 min-h-screen bg-gray-50">
            <div className="container-custom">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                        Gayrimenkul Portföyümüz
                    </h1>
                    <p className="text-gray-500">
                        Alanya&apos;nın en özel bölgelerinde, her bütçeye uygun seçenekler.
                    </p>
                </div>

                {/* Content */}
                <PortfolioClient locale={locale} />
            </div>
        </main>
    );
}
