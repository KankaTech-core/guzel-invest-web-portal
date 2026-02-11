import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, CheckCircle2 } from "lucide-react";
import { serviceDefinitions } from "@/data/services";

type ServiceDetailPageProps = {
    params: Promise<{ locale: string; slug: string }>;
};

export default async function ServiceDetailPage({ params }: ServiceDetailPageProps) {
    const { locale, slug } = await params;
    const service = serviceDefinitions.find((item) => item.slug === slug);

    if (!service) {
        notFound();
    }

    return (
        <main className="min-h-screen bg-gray-50 pb-20 pt-28">
            <div className="container-custom">
                <Link
                    href={`/${locale}`}
                    className="inline-flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-orange-600"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Ana Sayfaya Dön
                </Link>

                <section className="mt-6 overflow-hidden rounded-3xl border border-gray-200 bg-white">
                    <div className="grid gap-0 lg:grid-cols-12">
                        <div className="bg-gray-900 p-8 text-white lg:col-span-4">
                            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-400">
                                Hizmet Detayı
                            </p>
                            <h1 className="mt-3 text-3xl font-bold leading-tight">{service.title}</h1>
                            <p className="mt-4 text-sm leading-relaxed text-gray-300">{service.summary}</p>
                            <Link
                                href={`/${locale}/iletisim`}
                                className="mt-7 inline-flex items-center gap-2 rounded-xl bg-orange-500 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-orange-400"
                            >
                                Bu Hizmet İçin İletişime Geç
                                <ArrowRight className="h-4 w-4" />
                            </Link>
                        </div>
                        <div className="p-8 lg:col-span-8">
                            <h2 className="text-xl font-semibold text-gray-900">Hizmet Açıklaması</h2>
                            <p className="mt-3 text-sm leading-relaxed text-gray-600">
                                {service.description}
                            </p>

                            <h3 className="mt-8 text-sm font-semibold uppercase tracking-[0.18em] text-gray-400">
                                Kapsamdaki Başlıklar
                            </h3>
                            <ul className="mt-4 grid gap-3 md:grid-cols-2">
                                {service.highlights.map((highlight) => (
                                    <li
                                        key={highlight}
                                        className="flex items-start gap-3 rounded-xl border border-gray-200 bg-gray-50 p-4 text-sm text-gray-700"
                                    >
                                        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-orange-500" />
                                        <span>{highlight}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </section>
            </div>
        </main>
    );
}

