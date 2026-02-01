import Link from "next/link";
import { useTranslations } from "next-intl";
import {
    Building2,
    Mail,
    Phone,
    MapPin,
    Instagram,
    Facebook,
    Twitter,
    Youtube,
} from "lucide-react";

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
                            <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center">
                                <Building2 className="w-5 h-5 text-white" />
                            </div>
                            <span className="text-xl font-bold tracking-tight text-gray-900">
                                Güzel Invest
                            </span>
                        </Link>
                        <p className="text-gray-500 leading-relaxed mb-6">
                            {t("footer.slogan")}
                        </p>
                        <div className="flex gap-3">
                            <a
                                href="#"
                                className="w-10 h-10 bg-white border border-gray-200 rounded-lg flex items-center justify-center text-gray-500 hover:bg-orange-500 hover:text-white hover:border-orange-500 transition-colors"
                            >
                                <Instagram className="w-5 h-5" />
                            </a>
                            <a
                                href="#"
                                className="w-10 h-10 bg-white border border-gray-200 rounded-lg flex items-center justify-center text-gray-500 hover:bg-orange-500 hover:text-white hover:border-orange-500 transition-colors"
                            >
                                <Facebook className="w-5 h-5" />
                            </a>
                            <a
                                href="#"
                                className="w-10 h-10 bg-white border border-gray-200 rounded-lg flex items-center justify-center text-gray-500 hover:bg-orange-500 hover:text-white hover:border-orange-500 transition-colors"
                            >
                                <Twitter className="w-5 h-5" />
                            </a>
                            <a
                                href="#"
                                className="w-10 h-10 bg-white border border-gray-200 rounded-lg flex items-center justify-center text-gray-500 hover:bg-orange-500 hover:text-white hover:border-orange-500 transition-colors"
                            >
                                <Youtube className="w-5 h-5" />
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-lg font-bold text-gray-900 mb-6">Hızlı Menü</h3>
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
                        <h3 className="text-lg font-bold text-gray-900 mb-6">İlan Kategorileri</h3>
                        <ul className="space-y-3">
                            <li>
                                <Link
                                    href={`/${locale}/portfoy?type=VILLA`}
                                    className="text-gray-500 hover:text-orange-500 transition-colors"
                                >
                                    Villalar
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href={`/${locale}/portfoy?type=APARTMENT`}
                                    className="text-gray-500 hover:text-orange-500 transition-colors"
                                >
                                    Daireler
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href={`/${locale}/portfoy?type=LAND`}
                                    className="text-gray-500 hover:text-orange-500 transition-colors"
                                >
                                    Arsalar
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href={`/${locale}/portfoy?type=COMMERCIAL`}
                                    className="text-gray-500 hover:text-orange-500 transition-colors"
                                >
                                    Ticari Gayrimenkuller
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h3 className="text-lg font-bold text-gray-900 mb-6">İletişim</h3>
                        <ul className="space-y-4">
                            <li className="flex gap-3">
                                <MapPin className="w-5 h-5 text-orange-500 shrink-0 mt-0.5" />
                                <span className="text-gray-500">
                                    Kestel Mah. Sahil Cad. No:123
                                    <br />
                                    Alanya / Antalya
                                </span>
                            </li>
                            <li className="flex gap-3">
                                <Phone className="w-5 h-5 text-orange-500 shrink-0" />
                                <a
                                    href="tel:+902421234567"
                                    className="text-gray-500 hover:text-orange-500 transition-colors"
                                >
                                    +90 242 123 45 67
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
                <div className="container-custom py-6 flex flex-col md:flex-row items-center justify-between gap-4">
                    <p className="text-gray-400 text-sm">{t("footer.copyright")}</p>
                    <div className="flex gap-6 text-sm">
                        <Link
                            href={`/${locale}/gizlilik`}
                            className="text-gray-400 hover:text-orange-500 transition-colors"
                        >
                            Gizlilik Politikası
                        </Link>
                        <Link
                            href={`/${locale}/kullanim-sartlari`}
                            className="text-gray-400 hover:text-orange-500 transition-colors"
                        >
                            Kullanım Şartları
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
