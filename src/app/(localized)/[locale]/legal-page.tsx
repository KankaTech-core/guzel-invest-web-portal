import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Clock3, FileText, ShieldCheck } from "lucide-react";
import { ScrollRevealSection } from "@/components/ui/scroll-reveal-section";
import {
    getLegalPageCopy,
    legalPageSlugs,
    legalPageRoutes,
    type LegalPageSlug,
} from "./legal-copy";

export function buildLegalPageMetadata({
    locale,
    slug,
}: {
    locale: string;
    slug: LegalPageSlug;
}): Metadata {
    const copy = getLegalPageCopy(locale, slug);

    return {
        title: `${copy.title} | Guzel Invest`,
        description: copy.description,
    };
}

export function renderLegalPage({
    locale,
    slug,
}: {
    locale: string;
    slug: LegalPageSlug;
}) {
    const copy = getLegalPageCopy(locale, slug);

    return (
        <main className="overflow-x-hidden bg-white pb-20">
            <ScrollRevealSection
                as="section"
                className="relative isolate overflow-hidden bg-gray-900 pt-24 pb-16 sm:pt-28 sm:pb-20"
            >
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(249,115,22,0.22),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(255,255,255,0.08),transparent_32%)]" />
                <div className="container-custom relative z-10">
                    <span className="reveal inline-flex items-center rounded-full border border-orange-300/60 bg-orange-500/15 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.15em] text-orange-200">
                        {copy.badge}
                    </span>
                    <h1 className="reveal mt-5 max-w-4xl text-4xl font-bold text-white sm:text-5xl">
                        {copy.title}
                    </h1>
                    <p className="reveal mt-5 max-w-3xl text-base leading-relaxed text-gray-200 sm:text-lg">
                        {copy.description}
                    </p>

                    <div className="reveal mt-8 flex flex-wrap gap-3 text-sm text-gray-200">
                        <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2">
                            <Clock3 className="h-4 w-4 text-orange-300" />
                            {copy.lastUpdatedLabel}: {copy.lastUpdatedDate}
                        </span>
                        <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2">
                            <FileText className="h-4 w-4 text-orange-300" />
                            {copy.sections.length} {copy.sectionCountLabel}
                        </span>
                    </div>
                </div>
            </ScrollRevealSection>

            {/* Tab navigation */}
            <div className="border-b border-gray-200 bg-white">
                <div className="container-custom">
                    <nav className="-mb-px flex gap-1 overflow-x-auto py-1 scrollbar-hide">
                        {legalPageSlugs.map((tabSlug) => {
                            const tabCopy = getLegalPageCopy(locale, tabSlug);
                            const isActive = tabSlug === slug;
                            return (
                                <Link
                                    key={tabSlug}
                                    href={`/${locale}/${legalPageRoutes[tabSlug]}`}
                                    className={`shrink-0 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors ${
                                        isActive
                                            ? "bg-orange-50 text-orange-600"
                                            : "text-gray-500 hover:bg-gray-50 hover:text-gray-700"
                                    }`}
                                >
                                    {tabCopy.tabLabel}
                                </Link>
                            );
                        })}
                    </nav>
                </div>
            </div>

            <ScrollRevealSection className="px-4 py-12 sm:px-6 sm:py-16">
                <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 lg:grid-cols-12">
                    <article className="reveal rounded-[28px] border border-gray-200 bg-white p-6 shadow-[0_20px_60px_-40px_rgba(17,24,39,0.3)] sm:p-8 lg:col-span-7">
                        <span className="text-[11px] font-semibold uppercase tracking-[0.15em] text-orange-500">
                            {copy.summaryTitle}
                        </span>
                        <p className="mt-4 text-sm leading-relaxed text-gray-600 sm:text-base">
                            {copy.summaryBody}
                        </p>
                    </article>

                    <aside className="reveal rounded-[28px] border border-orange-100 bg-orange-50/60 p-6 sm:p-8 lg:col-span-5">
                        <div className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-orange-500 text-white">
                            <ShieldCheck className="h-5 w-5" />
                        </div>
                        <h2 className="mt-4 text-xl font-bold text-gray-900">
                            {copy.draftNoticeTitle}
                        </h2>
                        <p className="mt-3 text-sm leading-relaxed text-gray-600 sm:text-base">
                            {copy.draftNoticeBody}
                        </p>
                    </aside>
                </div>
            </ScrollRevealSection>

            <ScrollRevealSection className="bg-gray-50 px-4 py-12 sm:px-6 sm:py-16">
                <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 lg:grid-cols-[minmax(0,0.72fr)_minmax(280px,0.28fr)]">
                    <div className="reveal space-y-4">
                        {copy.sections.map((section) => (
                            <article
                                key={section.id}
                                id={section.id}
                                className="scroll-mt-28 rounded-[24px] border border-gray-200 bg-white p-6 sm:p-8"
                            >
                                <h2 className="text-2xl font-bold text-gray-900">
                                    {section.title}
                                </h2>
                                <div className="mt-4 space-y-4">
                                    {section.paragraphs.map((paragraph) => (
                                        <p
                                            key={paragraph}
                                            className="text-sm leading-relaxed text-gray-600 sm:text-base"
                                        >
                                            {paragraph}
                                        </p>
                                    ))}
                                </div>
                            </article>
                        ))}
                    </div>

                    <div className="reveal lg:sticky lg:top-28 lg:self-start">
                        <div className="rounded-[24px] border border-gray-200 bg-white p-6">
                            <h2 className="text-sm font-semibold uppercase tracking-[0.15em] text-gray-400">
                                {copy.contentsTitle}
                            </h2>
                            <nav className="mt-5 space-y-2">
                                {copy.sections.map((section) => (
                                    <a
                                        key={section.id}
                                        href={`#${section.id}`}
                                        className="block rounded-2xl border border-transparent bg-gray-50 px-4 py-3 text-sm font-medium text-gray-700 transition-colors hover:border-orange-200 hover:bg-orange-50 hover:text-orange-600"
                                    >
                                        {section.title}
                                    </a>
                                ))}
                            </nav>
                        </div>
                    </div>
                </div>
            </ScrollRevealSection>

            <ScrollRevealSection className="px-4 pt-10 sm:px-6">
                <div className="reveal mx-auto max-w-7xl overflow-hidden rounded-[32px] bg-gray-900">
                    <div className="px-6 py-10 sm:px-10 sm:py-12">
                        <span className="text-[11px] font-semibold uppercase tracking-[0.15em] text-orange-300">
                            {copy.contactTitle}
                        </span>
                        <p className="mt-4 max-w-3xl text-sm leading-relaxed text-gray-300 sm:text-base">
                            {copy.contactBody}
                        </p>

                        <div className="mt-8 flex flex-wrap gap-3">
                            <Link
                                href={`/${locale}/iletisim`}
                                className="inline-flex items-center gap-2 rounded-lg bg-orange-500 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-orange-400"
                            >
                                {copy.contactPrimaryCta}
                                <ArrowRight className="h-4 w-4" />
                            </Link>
                            <Link
                                href={slug === "terms" ? `/${locale}/portfoy` : `/${locale}`}
                                className="inline-flex items-center gap-2 rounded-lg border border-gray-600 px-5 py-3 text-sm font-semibold text-gray-100 transition-colors hover:border-orange-300 hover:text-orange-300"
                            >
                                {copy.contactSecondaryCta}
                            </Link>
                        </div>
                    </div>
                </div>
            </ScrollRevealSection>
        </main>
    );
}
