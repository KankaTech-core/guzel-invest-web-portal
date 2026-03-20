import Image from "next/image";
import Link from "next/link";
import { useTranslations } from "next-intl";
import {
    Mail,
    Phone,
    MapPin,
    Instagram,
    Facebook,
    Youtube,
} from "lucide-react";
import { SOCIAL_LINK_ITEMS, type SocialLinkKey } from "@/lib/social-links";

const socialIconMap: Record<SocialLinkKey, typeof Instagram> = {
    instagram: Instagram,
    youtube: Youtube,
    facebook: Facebook,
};

export function Footer({ locale }: { locale: string }) {
    const t = useTranslations();

    return (
        <footer className="bg-gray-50 border-t border-gray-200">
            {/* Main Footer */}
            <div className="container-custom py-16">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
                    {/* Brand */}
                    <div>
                        <Link href={`/${locale}`} className="flex items-center gap-2.5 mb-6">
                            <Image
                                src="/images/testimonials/logo-square.svg"
                                alt="Güzel Invest logosu"
                                width={40}
                                height={40}
                                className="h-10 w-10 object-contain"
                                priority
                            />
                            <span className="text-xl font-bold tracking-tight text-gray-900">
                                Güzel Invest
                            </span>
                        </Link>
                        <p className="text-gray-500 leading-relaxed mb-6">
                            {t("footer.slogan")}
                        </p>
                        <div className="flex gap-3">
                            {SOCIAL_LINK_ITEMS.map((item) => {
                                const Icon = socialIconMap[item.key];
                                return (
                                    <a
                                        key={item.key}
                                        href={item.href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        aria-label={item.label}
                                        className="w-10 h-10 bg-white border border-gray-200 rounded-lg flex items-center justify-center text-gray-500 hover:bg-orange-500 hover:text-white hover:border-orange-500 transition-colors"
                                    >
                                        <Icon className="w-5 h-5" />
                                    </a>
                                );
                            })}
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-lg font-bold text-gray-900 mb-6">
                            {t("footer.quickLinks")}
                        </h3>
                        <ul className="space-y-3">
                            <li>
                                <Link
                                    href={`/${locale}`}
                                    className="text-gray-500 hover:text-orange-500 transition-colors"
                                >
                                    {t("nav.home")}
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href={`/${locale}/portfoy`}
                                    className="text-gray-500 hover:text-orange-500 transition-colors"
                                >
                                    {t("nav.portfolio")}
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href={`/${locale}/harita`}
                                    className="text-gray-500 hover:text-orange-500 transition-colors"
                                >
                                    {t("nav.map")}
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href={`/${locale}/hakkimizda`}
                                    className="text-gray-500 hover:text-orange-500 transition-colors"
                                >
                                    {t("nav.about")}
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Categories */}
                    <div>
                        <h3 className="text-lg font-bold text-gray-900 mb-6">
                            {t("footer.categories")}
                        </h3>
                        <ul className="space-y-3">
                            <li>
                                <Link
                                    href={`/${locale}/portfoy?type=VILLA`}
                                    className="text-gray-500 hover:text-orange-500 transition-colors"
                                >
                                    {t("footer.villas")}
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href={`/${locale}/portfoy?type=APARTMENT`}
                                    className="text-gray-500 hover:text-orange-500 transition-colors"
                                >
                                    {t("footer.apartments")}
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href={`/${locale}/portfoy?type=LAND`}
                                    className="text-gray-500 hover:text-orange-500 transition-colors"
                                >
                                    {t("footer.lands")}
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href={`/${locale}/portfoy?type=COMMERCIAL`}
                                    className="text-gray-500 hover:text-orange-500 transition-colors"
                                >
                                    {t("footer.commercialProperties")}
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h3 className="text-lg font-bold text-gray-900 mb-6">
                            {t("footer.contact")}
                        </h3>
                        <ul className="space-y-4">
                            <li className="flex gap-3">
                                <MapPin className="w-5 h-5 text-orange-500 shrink-0 mt-0.5" />
                                <span className="text-gray-500">
                                    Saray, Sugözü Cd. Akdoğan Tokuş Apt No: 15/B,
                                    <br />
                                    07400 Alanya/Antalya
                                </span>
                            </li>
                            <li className="flex gap-3">
                                <Phone className="w-5 h-5 text-orange-500 shrink-0" />
                                <a
                                    href="tel:+905384751111"
                                    className="text-gray-500 hover:text-orange-500 transition-colors"
                                >
                                    +90 538 475 11 11
                                </a>
                            </li>
                            <li className="flex gap-3">
                                <Mail className="w-5 h-5 text-orange-500 shrink-0" />
                                <a
                                    href="mailto:info@guzelinvest.com"
                                    className="text-gray-500 hover:text-orange-500 transition-colors"
                                >
                                    info@guzelinvest.com
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="border-t border-gray-200 bg-white">
                <div className="container-custom grid grid-cols-1 md:grid-cols-3 items-center gap-4 py-6">
                    <p className="text-gray-400 text-sm text-center md:text-left">
                        {t("footer.copyright")}
                    </p>
                    <p className="text-gray-400 text-sm text-center">
                        {t("footer.developedBy")}{" "}
                        <a
                            href="https://kankatech.com/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-black hover:text-black"
                        >
                            KankaTech
                        </a>
                    </p>
                    <div className="flex gap-6 text-sm justify-center md:justify-end">
                        <Link
                            href={`/${locale}/gizlilik`}
                            className="text-gray-400 hover:text-orange-500 transition-colors"
                        >
                            {t("footer.privacyPolicy")}
                        </Link>
                        <Link
                            href={`/${locale}/cerez-politikasi`}
                            className="text-gray-400 hover:text-orange-500 transition-colors"
                        >
                            {t("footer.cookiePolicy")}
                        </Link>
                        <Link
                            href={`/${locale}/kullanim-sartlari`}
                            className="text-gray-400 hover:text-orange-500 transition-colors"
                        >
                            {t("footer.termsOfUse")}
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
