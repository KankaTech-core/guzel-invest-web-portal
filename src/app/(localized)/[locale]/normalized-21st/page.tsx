import type { Metadata } from "next";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { Badge, Card } from "@/components/ui";
import { LandingAccordion } from "@/components/ui/interactive-image-accordion";
import { AlertTriangle, CheckCircle2, Clock } from "lucide-react";

export const metadata: Metadata = {
    title: "Normalized 21st | Güzel Invest",
    description: "Preview and validate normalized 21st.dev components.",
    robots: { index: false, follow: false },
};

export default function Normalized21stPage() {
    const t = useTranslations("normalized21st");
    const locale = useLocale();

    const sectionLinks = [
        { id: "status", label: t("sections.status") },
        { id: "queue", label: t("sections.queue") },
        { id: "preview", label: t("sections.preview") },
        { id: "guidelines", label: t("sections.guidelines") },
    ];

    const statusCards = [
        {
            icon: CheckCircle2,
            badge: "success" as const,
            title: t("status.normalized"),
            description: t("status.normalizedDesc"),
        },
        {
            icon: Clock,
            badge: "warning" as const,
            title: t("status.pending"),
            description: t("status.pendingDesc"),
        },
        {
            icon: AlertTriangle,
            badge: "secondary" as const,
            title: t("status.blocked"),
            description: t("status.blockedDesc"),
        },
    ];

    return (
        <main className="pt-24 pb-20 bg-white">
            <div className="container-custom space-y-16">
                <header className="space-y-6 border-b border-gray-100 pb-8">
                    <div className="flex items-center gap-3 text-sm text-gray-400">
                        <span className="w-8 h-px bg-gray-300" />
                        <span className="uppercase tracking-widest font-medium">{t("subtitle")}</span>
                    </div>
                    <h1 className="text-5xl md:text-6xl font-bold text-gray-900 tracking-tight">
                        {t("title")}
                    </h1>
                    <p className="text-lg text-gray-500 max-w-2xl leading-relaxed">
                        {t("description")}
                    </p>
                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 max-w-2xl">
                        <p className="text-sm text-amber-800">
                            {t("note")}
                        </p>
                    </div>
                    <nav className="flex flex-wrap gap-2 pt-2">
                        {sectionLinks.map((link) => (
                            <a
                                key={link.id}
                                href={`#${link.id}`}
                                className="px-4 py-2 text-sm font-medium text-gray-500 hover:text-gray-900 border-b-2 border-transparent hover:border-gray-900 transition-all"
                            >
                                {link.label}
                            </a>
                        ))}
                        <Link
                            href={`/${locale}/ux-guide`}
                            className="ml-auto btn btn-outline btn-md"
                        >
                            {t("actions.openUxGuide")}
                        </Link>
                    </nav>
                </header>

                <section id="status" className="space-y-6">
                    <div className="flex items-baseline gap-4">
                        <span className="text-sm font-mono text-gray-300">01</span>
                        <div>
                            <h2 className="text-3xl font-bold text-gray-900">{t("sections.status")}</h2>
                            <p className="text-gray-500 mt-1">{t("status.pendingDesc")}</p>
                        </div>
                    </div>
                    <div className="grid gap-6 lg:grid-cols-3">
                        {statusCards.map((item) => {
                            const Icon = item.icon;
                            return (
                                <Card key={item.title} padding="md" className="border border-gray-100">
                                    <div className="flex items-center gap-3">
                                        <span className="h-10 w-10 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-center">
                                            <Icon className="h-5 w-5 text-gray-700" />
                                        </span>
                                        <div>
                                            <Badge variant={item.badge}>{item.title}</Badge>
                                        </div>
                                    </div>
                                    <p className="text-sm text-gray-500 mt-4">{item.description}</p>
                                </Card>
                            );
                        })}
                    </div>
                </section>

                <section id="queue" className="space-y-6">
                    <div className="flex items-baseline gap-4">
                        <span className="text-sm font-mono text-gray-300">02</span>
                        <h2 className="text-3xl font-bold text-gray-900">{t("sections.queue")}</h2>
                    </div>
                    <Card padding="lg" className="border border-dashed border-gray-200 text-center">
                        <h3 className="text-lg font-semibold text-gray-900">{t("queue.emptyTitle")}</h3>
                        <p className="text-sm text-gray-500 mt-2">{t("queue.emptyDescription")}</p>
                    </Card>
                </section>

                <section id="preview" className="space-y-6">
                    <div className="flex items-baseline gap-4">
                        <span className="text-sm font-mono text-gray-300">03</span>
                        <div>
                            <h2 className="text-3xl font-bold text-gray-900">{t("sections.preview")}</h2>
                            <p className="text-gray-500 mt-1">{t("preview.description")}</p>
                        </div>
                    </div>
                    <Card padding="md" className="border border-gray-100">
                        <div className="gi-21st rounded-lg border border-gray-100 bg-gray-50/50 p-8 text-center mb-8">
                            <h3 className="text-lg font-semibold text-gray-900">{t("preview.title")}</h3>
                            <p className="text-sm text-gray-500 mt-2">{t("preview.description")}</p>
                            <div className="mt-5 inline-flex items-center gap-2">
                                <span className="text-xs font-mono text-gray-400">.gi-21st</span>
                                <Badge variant="info">scoped</Badge>
                            </div>
                        </div>

                        <div className="border border-gray-100 rounded-xl overflow-hidden shadow-sm">
                            <div className="bg-gray-50 px-4 py-2 border-b border-gray-100 flex items-center justify-between">
                                <span className="text-xs font-mono text-gray-400">interactive-image-accordion.tsx</span>
                                <Badge variant="success">Normalized</Badge>
                            </div>
                            <LandingAccordion />
                        </div>
                    </Card>
                </section>

                <section id="guidelines" className="space-y-6">
                    <div className="flex items-baseline gap-4">
                        <span className="text-sm font-mono text-gray-300">04</span>
                        <h2 className="text-3xl font-bold text-gray-900">{t("sections.guidelines")}</h2>
                    </div>
                    <Card padding="md" className="border border-gray-100">
                        <ul className="space-y-3 text-sm text-gray-600">
                            <li className="flex items-start gap-3">
                                <span className="mt-1 h-2 w-2 rounded-full bg-orange-500" />
                                {t("guidelines.item1")}
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="mt-1 h-2 w-2 rounded-full bg-orange-500" />
                                {t("guidelines.item2")}
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="mt-1 h-2 w-2 rounded-full bg-orange-500" />
                                {t("guidelines.item3")}
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="mt-1 h-2 w-2 rounded-full bg-orange-500" />
                                {t("guidelines.item4")}
                            </li>
                        </ul>
                    </Card>
                </section>
            </div>
        </main>
    );
}
