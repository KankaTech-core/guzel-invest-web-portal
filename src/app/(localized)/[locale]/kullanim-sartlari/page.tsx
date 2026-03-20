import type { Metadata } from "next";
import {
    buildLegalPageMetadata,
    renderLegalPage,
} from "../legal-page";

type PageProps = {
    params: Promise<{ locale: string }>;
};

export async function generateMetadata({
    params,
}: PageProps): Promise<Metadata> {
    const { locale } = await params;

    return buildLegalPageMetadata({ locale, slug: "terms" });
}

export default async function TermsPage({ params }: PageProps) {
    const { locale } = await params;

    return renderLegalPage({ locale, slug: "terms" });
}
