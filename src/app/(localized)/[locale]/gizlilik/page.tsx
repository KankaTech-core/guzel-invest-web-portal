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

    return buildLegalPageMetadata({ locale, slug: "privacy" });
}

export default async function PrivacyPage({ params }: PageProps) {
    const { locale } = await params;

    return renderLegalPage({ locale, slug: "privacy" });
}
