import type { Metadata } from "next";
import { useTranslations } from "next-intl";
import { Badge, Button, Card, CardContent, CardFooter, CardHeader } from "@/components/ui";
import { LandingAccordion } from "@/components/ui/interactive-image-accordion";
import UxGuideInteractive from "./ux-guide-interactive";
import {
    Building2, MapPin, BedDouble, Bath, Square, Star, Bookmark, Search, Menu,
    ChevronRight, Heart, Phone, Mail, X, Plus, Check, Eye, ArrowRight, Home,
    Layers, Box, Component, Layout
} from "lucide-react";

export const metadata: Metadata = {
    title: "UX Guide | Güzel Invest",
    description: "Fintech-Trust Clarity odaklı gayrimenkul UX rehberi.",
    robots: { index: false, follow: false },
};

const p3ListingVariants = [
    {
        id: "sale",
        label: "SATILIK VARYANT (GÖRSEL YOK SENARYOSU)",
        badge: "VILLA",
        badgeClass: "bg-blue-500 text-white",
        title: "Tapu Hazır 4+1 Deniz Manzaralı Villa",
        location: "Mahmutlar, Alanya",
        price: "€495.000",
        priceSuffix: "",
        mode: "SATILIK",
        details: ["4 Oda", "3 Banyo", "280 m²"],
    },
    {
        id: "rent",
        label: "KİRALIK VARYANT",
        badge: "DAİRE",
        badgeClass: "bg-purple-500 text-white",
        title: "Kiralık 2+1 Site İçi Daire",
        location: "Kestel, Alanya",
        price: "€1.500",
        priceSuffix: "/ay",
        mode: "KİRALIK",
        details: ["2 Oda", "1 Banyo", "95 m²"],
    },
];

export default function UxGuidePage() {
    const t = useTranslations();

    const colorGroups = [
        {
            title: "Marka ve Güven",
            items: [
                { name: "trust-50", className: "bg-orange-50", hex: "#FFF7ED" },
                { name: "trust-100", className: "bg-orange-100", hex: "#FFEDD5" },
                { name: "trust-500", className: "bg-orange-500", hex: "#F97316" },
                { name: "trust-700", className: "bg-orange-700", hex: "#C2410C" },
                { name: "clarity-900", className: "bg-gray-900", hex: "#111827" },
            ],
        },
        {
            title: "Nötr Altyapı",
            items: [
                { name: "canvas", className: "bg-gray-50", hex: "#F9FAFB" },
                { name: "surface", className: "bg-white", hex: "#FFFFFF" },
                { name: "line", className: "bg-gray-200", hex: "#E5E7EB" },
                { name: "muted", className: "bg-gray-500", hex: "#6B7280" },
                { name: "heading", className: "bg-gray-800", hex: "#1F2937" },
            ],
        },
        {
            title: "Operasyon Durumları",
            items: [
                { name: "tapu-ready", className: "bg-green-500", hex: "#22C55E" },
                { name: "construction", className: "bg-blue-500", hex: "#3B82F6" },
                { name: "tax-action", className: "bg-amber-500", hex: "#F59E0B" },
                { name: "legal-alert", className: "bg-red-500", hex: "#EF4444" },
                { name: "citizenship", className: "bg-teal-500", hex: "#14B8A6" },
            ],
        },
    ];

    const sectionLinks = [
        { id: "designDNA", label: "Fintech-Trust Clarity DNA" },
        { id: "serviceBlueprint", label: "Hizmet Mimarisi" },
        { id: "fontFamily", label: t("uxGuide.sections.fontFamily") },
        { id: "typographyScale", label: t("uxGuide.sections.typographyScale") },
        { id: "colors", label: t("uxGuide.sections.colors") },
        { id: "tokens", label: t("uxGuide.sections.tokens") },
        { id: "components", label: t("uxGuide.sections.components") },
        { id: "listingCard", label: t("uxGuide.sections.listingCard") },
        { id: "atomicDesign", label: t("uxGuide.sections.atomicDesign") },
        { id: "layout", label: t("uxGuide.sections.layout") },
        { id: "trustSignals", label: "Güven Sinyalleri" },
        { id: "icons", label: t("uxGuide.sections.icons") },
        { id: "animations", label: t("uxGuide.sections.animations") },
        { id: "forms", label: t("uxGuide.sections.forms") },
        { id: "accordion", label: "Portföy Hikâye Akordeonu" },
    ];

    const typographyScaleSizes = [
        { class: "text-xs", size: "13px", example: "Tapu no, yayın tarihi, portföy kodu" },
        { class: "text-sm", size: "15px", example: "Form etiketleri ve yardımcı notlar" },
        { class: "text-base", size: "17px", example: "İlan özeti ve danışmanlık açıklaması" },
        { class: "text-lg", size: "18px", example: "Liste kartı alt metinleri" },
        { class: "text-xl", size: "20px", example: "Bölüm başlıkları" },
        { class: "text-2xl", size: "24px", example: "Fırsat kartı başlıkları" },
        { class: "text-3xl", size: "30px", example: "Sayfa giriş başlıkları" },
        { class: "text-4xl", size: "36px", example: "Ana mesaj ve değer önerisi" },
        { class: "text-5xl", size: "48px", example: "Kampanya veya rapor vurgusu" },
    ];

    const fontWeights = [
        { weight: "400", name: "Regular", usage: t("uxGuide.fontFamily.weights.regularUsage"), className: "font-normal" },
        { weight: "500", name: "Medium", usage: t("uxGuide.fontFamily.weights.mediumUsage"), className: "font-medium" },
        { weight: "600", name: "SemiBold", usage: t("uxGuide.fontFamily.weights.semiboldUsage"), className: "font-semibold" },
        { weight: "700", name: "Bold", usage: t("uxGuide.fontFamily.weights.boldUsage"), className: "font-bold" },
    ];

    const commonIcons = [
        { name: "Building2", icon: Building2 },
        { name: "MapPin", icon: MapPin },
        { name: "BedDouble", icon: BedDouble },
        { name: "Bath", icon: Bath },
        { name: "Square", icon: Square },
        { name: "Star", icon: Star },
        { name: "Bookmark", icon: Bookmark },
        { name: "Search", icon: Search },
        { name: "Menu", icon: Menu },
        { name: "Heart", icon: Heart },
        { name: "Phone", icon: Phone },
        { name: "Mail", icon: Mail },
        { name: "X", icon: X },
        { name: "Plus", icon: Plus },
        { name: "Check", icon: Check },
        { name: "Eye", icon: Eye },
        { name: "ArrowRight", icon: ArrowRight },
        { name: "Home", icon: Home },
        { name: "ChevronRight", icon: ChevronRight },
    ];

    const atomicLevels = [
        {
            level: "01",
            title: t("uxGuide.atomicDesign.atoms.title"),
            description: t("uxGuide.atomicDesign.atoms.description"),
            icon: Box,
            components: ["Button", "StatusBadge", "Input", "TrustTag"],
        },
        {
            level: "02",
            title: t("uxGuide.atomicDesign.molecules.title"),
            description: t("uxGuide.atomicDesign.molecules.description"),
            icon: Component,
            components: ["MetricCard", "RangeSlider", "FilterRow"],
        },
        {
            level: "03",
            title: t("uxGuide.atomicDesign.organisms.title"),
            description: t("uxGuide.atomicDesign.organisms.description"),
            icon: Layers,
            components: ["ListingCard", "ServiceRail", "TrustPanel", "Navbar"],
        },
        {
            level: "04",
            title: t("uxGuide.atomicDesign.templates.title"),
            description: t("uxGuide.atomicDesign.templates.description"),
            icon: Layout,
            components: ["HomePage", "PortfolioPage", "ListingDetail", "ServicePage"],
        },
    ];

    const designPillars = [
        {
            title: "Platform netliği, emlak mantığı",
            description: "Fintech tarzı net grid ve veri kartları korunur; ancak odak borsa değil mülk karar sürecidir.",
            icon: Layers,
        },
        {
            title: "Güven kanıtı hep görünür",
            description: "Tapu hazırlık, ruhsat durumu, vatandaşlık uygunluğu ve resmi süreç adımları her sayfada izlenebilir olmalıdır.",
            icon: Check,
        },
        {
            title: "Sadece satın alma değil yaşam döngüsü",
            description: "Satış, inşaat, vergi ve satış sonrası destek aynı deneyimde birbirine bağlanır.",
            icon: Home,
        },
        {
            title: "Yüksek okunabilirlik + hızlı aksiyon",
            description: "Her blok kullanıcıyı bir sonraki karar adımına götürür: randevu, teklif, karşılaştırma veya danışmanlık.",
            icon: ArrowRight,
        },
    ];

    const serviceBlueprint = [
        {
            title: "Al-Sat ve Portföy Danışmanlığı",
            points: ["Mülk seçim matrisi", "Getiri/risk dengesi", "Saha uzmanıyla hızlı eşleştirme"],
            icon: Building2,
        },
        {
            title: "İnşaat ve Proje Yönetimi",
            points: ["Proje aşama takibi", "Teslim tarih görünürlüğü", "Kalite ve ilerleme raporları"],
            icon: Layers,
        },
        {
            title: "Vergi ve Resmi Süreçler",
            points: ["Vergi avantaj rehberi", "Tapu-işlem checklist", "Vatandaşlık süreç koordinasyonu"],
            icon: MapPin,
        },
    ];

    const trustSignals = [
        { label: "Tapu Hazırlık Skoru", value: "92/100", hint: "Evrak ve uygunluk tamamlama seviyesi" },
        { label: "Ortalama Proje Teslim Disiplini", value: "%96", hint: "Planlanan takvime uyum oranı" },
        { label: "Vergi Planlama Kapsamı", value: "4 Ülke", hint: "TR, DE, RU, Orta Doğu yatırımcı senaryoları" },
        { label: "Satış Sonrası Memnuniyet", value: "4.8/5", hint: "Mülk yönetimi ve destek kalitesi" },
    ];

    return (
        <main className="pt-24 pb-20 bg-white">
            <div className="container-custom space-y-20">
                {/* Header */}
                <header className="space-y-6 border-b border-gray-100 pb-10">
                    <div className="flex items-center gap-3 text-sm text-gray-400">
                        <span className="w-8 h-px bg-gray-300" />
                        <span className="uppercase tracking-widest font-medium">{t("uxGuide.subtitle")}</span>
                    </div>
                    <h1 className="text-5xl md:text-6xl font-bold text-gray-900 tracking-tight">
                        {t("uxGuide.title")}
                    </h1>
                    <p className="text-lg text-gray-500 max-w-2xl leading-relaxed">
                        /3, /8 ve /p3 varyantlarında beğenilen Fintech-Trust Clarity dilini; bankacılık estetiklerinden ayrıştırıp
                        Güzel Invest&apos;in gayrimenkul, inşaat ve vergi danışmanlığı operasyonuna uyarlayan tasarım rehberi.
                    </p>
                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 max-w-2xl">
                        <p className="text-sm text-amber-800">
                            <strong>Canlı doküman:</strong> Buradaki bileşenler sitede kullanılan gerçek bileşenlerdir.
                            Bileşende yapılan değişiklik tüm sayfalara yansır.
                        </p>
                    </div>
                    <nav className="flex flex-wrap gap-2 pt-4">
                        {sectionLinks.map((link) => (
                            <a
                                key={link.id}
                                href={`#${link.id}`}
                                className="px-4 py-2 text-sm font-medium text-gray-500 hover:text-gray-900 border-b-2 border-transparent hover:border-gray-900 transition-all"
                            >
                                {link.label}
                            </a>
                        ))}
                    </nav>
                </header>

                {/* Design DNA Section */}
                <section id="designDNA" className="space-y-8">
                    <div className="flex items-baseline gap-4">
                        <span className="text-sm font-mono text-gray-300">01</span>
                        <div>
                            <h2 className="text-3xl font-bold text-gray-900">Fintech-Trust Clarity DNA</h2>
                            <p className="text-gray-500 mt-1">
                                Estetik dili koru; ancak karar modelini gayrimenkul yolculuğuna ve saha gerçeğine bağla.
                            </p>
                        </div>
                    </div>
                    <div className="grid gap-4 md:grid-cols-2">
                        {designPillars.map((pillar) => (
                            <Card key={pillar.title} padding="md" className="border border-gray-200">
                                <div className="flex items-start gap-4">
                                    <span className="w-10 h-10 rounded-lg bg-orange-50 border border-orange-200 flex items-center justify-center text-orange-600">
                                        <pillar.icon className="w-5 h-5" />
                                    </span>
                                    <div>
                                        <h3 className="text-base font-semibold text-gray-900">{pillar.title}</h3>
                                        <p className="text-sm text-gray-500 mt-2 leading-relaxed">{pillar.description}</p>
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>
                </section>

                {/* Service Blueprint Section */}
                <section id="serviceBlueprint" className="space-y-8">
                    <div className="flex items-baseline gap-4">
                        <span className="text-sm font-mono text-gray-300">02</span>
                        <div>
                            <h2 className="text-3xl font-bold text-gray-900">Hizmet Mimarisi</h2>
                            <p className="text-gray-500 mt-1">
                                Ana yapıda 3 çekirdek servis aynı tasarım diliyle ama farklı operasyon mantıklarıyla sunulur.
                            </p>
                        </div>
                    </div>
                    <div className="grid gap-6 lg:grid-cols-3">
                        {serviceBlueprint.map((service) => (
                            <Card key={service.title} padding="md" className="border border-gray-200">
                                <div className="w-10 h-10 rounded-lg bg-gray-100 border border-gray-200 flex items-center justify-center text-gray-700 mb-4">
                                    <service.icon className="w-5 h-5" />
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-3">{service.title}</h3>
                                <div className="space-y-2">
                                    {service.points.map((point) => (
                                        <div key={point} className="flex items-start gap-2 text-sm text-gray-600">
                                            <Check className="w-4 h-4 text-orange-500 mt-0.5 shrink-0" />
                                            <span>{point}</span>
                                        </div>
                                    ))}
                                </div>
                            </Card>
                        ))}
                    </div>
                </section>

                {/* Font Family Section */}
                <section id="fontFamily" className="space-y-8">
                    <div className="flex items-baseline gap-4">
                        <span className="text-sm font-mono text-gray-300">03</span>
                        <div>
                            <h2 className="text-3xl font-bold text-gray-900">
                                {t("uxGuide.sections.fontFamily")}
                            </h2>
                            <p className="text-gray-500 mt-1">
                                Fintech netliği için modern sans serif kullanılır; fakat mikro metinler yatırımcıya teknik değil operasyonel güven verir.
                            </p>
                        </div>
                    </div>
                    <div className="border border-gray-100 rounded-lg overflow-hidden">
                        <div className="border-b border-gray-100 p-8 bg-gray-50/50">
                            <h3 className="text-6xl font-bold text-gray-900 tracking-tight">
                                Sora / IBM Plex Sans
                            </h3>
                            <p className="text-sm text-gray-400 mt-3 font-mono">
                                Referans: /3, /8 ve /p3 varyantlarındaki okunabilirlik testleri
                            </p>
                        </div>
                        <div className="p-8 border-b border-gray-100">
                            <p className="text-2xl tracking-widest text-gray-400 font-light">
                                {t("uxGuide.fontFamily.specimen")}
                            </p>
                            <p className="text-2xl tracking-widest text-gray-300 font-light mt-2">
                                {t("uxGuide.fontFamily.numbers")}
                            </p>
                        </div>
                        <div className="grid grid-cols-4 divide-x divide-gray-100">
                            {fontWeights.map((fw) => (
                                <div key={fw.weight} className="p-6 text-center hover:bg-gray-50/50 transition-colors">
                                    <p className={`text-4xl text-gray-900 ${fw.className}`}>Ag</p>
                                    <p className="text-sm font-medium text-gray-900 mt-3">{fw.name}</p>
                                    <p className="text-xs text-gray-400 mt-1 font-mono">{fw.weight}</p>
                                    <p className="text-xs text-gray-500 mt-2">{fw.usage}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Typography Scale Section */}
                <section id="typographyScale" className="space-y-8">
                    <div className="flex items-baseline gap-4">
                        <span className="text-sm font-mono text-gray-300">04</span>
                        <div>
                            <h2 className="text-3xl font-bold text-gray-900">
                                {t("uxGuide.sections.typographyScale")}
                            </h2>
                            <p className="text-gray-500 mt-1">
                                Başlıklar hızlı tarama için net, gövde metinleri ise karar destekleyici ve hukuki/operasyonel açıklığa odaklı olmalı.
                            </p>
                        </div>
                    </div>
                    <div className="border border-gray-100 rounded-lg overflow-hidden">
                        {typographyScaleSizes.map((item, index) => (
                            <div
                                key={item.class}
                                className={`flex items-center justify-between p-6 hover:bg-gray-50/50 transition-colors ${index !== typographyScaleSizes.length - 1 ? 'border-b border-gray-100' : ''
                                    }`}
                            >
                                <div className="flex items-center gap-8">
                                    <code className="text-xs font-mono text-gray-400 w-20">{item.class}</code>
                                    <span className="text-xs font-mono text-gray-300 w-12">{item.size}</span>
                                </div>
                                <span className={`${item.class} text-gray-900 font-medium`}>{item.example}</span>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Colors Section */}
                <section id="colors" className="space-y-8">
                    <div className="flex items-baseline gap-4">
                        <span className="text-sm font-mono text-gray-300">05</span>
                        <div>
                            <h2 className="text-3xl font-bold text-gray-900">{t("uxGuide.sections.colors")}</h2>
                            <p className="text-gray-500 mt-1">Turuncu karar tetikler, nötrler bilgi yoğunluğunu dengeler, durum renkleri süreç şeffaflığını gösteren güven sinyalleridir.</p>
                        </div>
                    </div>
                    <div className="grid gap-8 lg:grid-cols-3">
                        {colorGroups.map((group) => (
                            <div key={group.title} className="space-y-4">
                                <h3 className="text-sm font-medium text-gray-900 uppercase tracking-wider">{group.title}</h3>
                                <div className="space-y-2">
                                    {group.items.map((swatch) => (
                                        <div key={swatch.name} className="flex items-center gap-4 p-3 rounded-lg border border-gray-100 hover:border-gray-200 transition-colors">
                                            <span className={`h-10 w-10 rounded-md ${swatch.className}`} aria-hidden />
                                            <div className="flex-1">
                                                <p className="text-sm font-medium text-gray-900">{swatch.name}</p>
                                                <p className="text-xs font-mono text-gray-400">{swatch.hex}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Design Tokens Section */}
                <section id="tokens" className="space-y-8">
                    <div className="flex items-baseline gap-4">
                        <span className="text-sm font-mono text-gray-300">06</span>
                        <div>
                            <h2 className="text-3xl font-bold text-gray-900">{t("uxGuide.sections.tokens")}</h2>
                            <p className="text-gray-500 mt-1">Token seti, hem vitrindeki premium algıyı hem de paneldeki operasyon netliğini birlikte taşımalıdır.</p>
                        </div>
                    </div>
                    <div className="grid gap-6 lg:grid-cols-3">
                        <div className="border border-gray-100 rounded-lg p-6">
                            <h3 className="text-sm font-medium text-gray-900 uppercase tracking-wider mb-6">{t("uxGuide.tokens.radius")}</h3>
                            <div className="flex items-end justify-between gap-4">
                                {[
                                    { label: "lg", value: "0.5rem", className: "rounded-lg" },
                                    { label: "xl", value: "0.75rem", className: "rounded-xl" },
                                    { label: "2xl", value: "1rem", className: "rounded-2xl" },
                                ].map((item) => (
                                    <div key={item.label} className="text-center flex-1">
                                        <div className={`h-16 border-2 border-gray-200 bg-gray-50 ${item.className}`} aria-hidden />
                                        <p className="text-xs font-mono text-gray-400 mt-2">{item.label}</p>
                                        <p className="text-xs text-gray-300">{item.value}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="border border-gray-100 rounded-lg p-6">
                            <h3 className="text-sm font-medium text-gray-900 uppercase tracking-wider mb-6">{t("uxGuide.tokens.shadows")}</h3>
                            <div className="flex items-end justify-between gap-4">
                                {[
                                    { label: "sm", className: "shadow-sm" },
                                    { label: "md", className: "shadow-md" },
                                    { label: "lg", className: "shadow-lg" },
                                ].map((item) => (
                                    <div key={item.label} className="text-center flex-1">
                                        <div className={`h-16 rounded-lg bg-white ${item.className}`} aria-hidden />
                                        <p className="text-xs font-mono text-gray-400 mt-2">{item.label}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="border border-gray-100 rounded-lg p-6">
                            <h3 className="text-sm font-medium text-gray-900 uppercase tracking-wider mb-6">{t("uxGuide.tokens.spacing")}</h3>
                            <div className="space-y-4">
                                {[
                                    { label: "4", value: "1rem", width: "w-4" },
                                    { label: "6", value: "1.5rem", width: "w-6" },
                                    { label: "8", value: "2rem", width: "w-8" },
                                    { label: "12", value: "3rem", width: "w-12" },
                                ].map((item) => (
                                    <div key={item.label} className="flex items-center gap-4">
                                        <div className={`h-2 bg-gray-900 ${item.width}`} />
                                        <span className="text-xs font-mono text-gray-400">{item.label}</span>
                                        <span className="text-xs text-gray-300">{item.value}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                {/* Components Section - Using ACTUAL Components */}
                <section id="components" className="space-y-8">
                    <div className="flex items-baseline gap-4">
                        <span className="text-sm font-mono text-gray-300">07</span>
                        <div>
                            <h2 className="text-3xl font-bold text-gray-900">{t("uxGuide.sections.components")}</h2>
                            <p className="text-gray-500 mt-1">Bileşenler sadece estetik değil; her biri bir sonraki operasyon adımını tetikleyen aksiyon noktası olmalıdır.</p>
                        </div>
                    </div>
                    <div className="grid gap-6 lg:grid-cols-3">
                        {/* Buttons - Actual Button Component */}
                        <Card padding="md" className="border border-gray-100">
                            <h3 className="text-sm font-medium text-gray-900 uppercase tracking-wider mb-4">{t("uxGuide.components.buttons")}</h3>
                            <div className="flex flex-wrap gap-2">
                                <Button>Portföyü İncele</Button>
                                <Button variant="secondary">Uzmanla Görüş</Button>
                                <Button variant="outline">Tapu Sürecini Öğren</Button>
                                <Button variant="ghost">Vergi Sorusu Sor</Button>
                            </div>
                            <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-gray-100">
                                <Button size="sm">Sm</Button>
                                <Button size="md">Md</Button>
                                <Button size="lg">Lg</Button>
                                <Button disabled>{t("uxGuide.labels.disabled")}</Button>
                            </div>
                        </Card>

                        {/* Badges - Actual Badge Component */}
                        <Card padding="md" className="border border-gray-100">
                            <h3 className="text-sm font-medium text-gray-900 uppercase tracking-wider mb-4">{t("uxGuide.components.badges")}</h3>
                            <div className="flex flex-wrap gap-2">
                                <Badge variant="primary">{t("uxGuide.examples.badgeFeatured")}</Badge>
                                <Badge variant="secondary">{t("uxGuide.examples.badgeNew")}</Badge>
                                <Badge variant="success">Tapu Hazır</Badge>
                                <Badge variant="warning">İnşaatta</Badge>
                                <Badge variant="info">Vatandaşlığa Uygun</Badge>
                            </div>
                            <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-gray-100">
                                <Badge variant="villa">Villa</Badge>
                                <Badge variant="apartment">Daire</Badge>
                                <Badge variant="land">Arsa</Badge>
                                <Badge variant="commercial">Ticari</Badge>
                            </div>
                        </Card>

                        {/* Cards - Actual Card Component */}
                        <Card className="border border-gray-100" padding="none">
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-xs uppercase tracking-wider text-gray-400">{t("uxGuide.components.cards")}</p>
                                        <h3 className="text-lg font-semibold text-gray-900">Vergi Planlama Paketi</h3>
                                    </div>
                                    <Badge variant="primary">Premium</Badge>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <p className="text-gray-600">Mülk alımında ülke bazlı vergi etkilerini tek ekranda gösteren danışmanlık kartı.</p>
                            </CardContent>
                            <CardFooter className="flex items-center justify-between">
                                <span className="text-sm font-mono text-gray-400">SLA: 48 saat</span>
                                <Button variant="outline" size="sm">Brif Oluştur</Button>
                            </CardFooter>
                        </Card>
                    </div>
                </section>

                {/* Listing Card Section - P3 Style Variants */}
                <section id="listingCard" className="space-y-8">
                    <div className="flex items-baseline gap-4">
                        <span className="text-sm font-mono text-gray-300">08</span>
                        <div>
                            <h2 className="text-3xl font-bold text-gray-900">{t("uxGuide.sections.listingCard")}</h2>
                            <p className="text-gray-500 mt-1">Varyant önizlemeleri artık /p3&apos;teki yatay kart kurgusuna göre gösterilir.</p>
                        </div>
                    </div>

                    <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                        <p className="text-sm text-green-800">
                            <strong>✓ P3 stil önizleme:</strong> Bu iki varyant, /p3&apos;teki liste kartı düzenini birebir referans alır.
                        </p>
                    </div>

                    <div className="space-y-4">
                        {p3ListingVariants.map((variant) => (
                            <div key={variant.id} className="space-y-2">
                                <p className="text-xs uppercase tracking-wider text-gray-400 font-medium">{variant.label}</p>
                                <article className="group bg-white rounded-xl border border-gray-200 overflow-hidden hover:border-orange-200 hover:shadow-lg transition-all">
                                    <div className="grid grid-cols-1 md:grid-cols-[280px_1fr_190px] gap-0">
                                        <div className="relative bg-gray-100 min-h-[190px]">
                                            <span className={`absolute top-3 left-3 px-3 py-1 rounded-lg text-sm font-semibold ${variant.badgeClass}`}>
                                                {variant.badge}
                                            </span>
                                            <button
                                                type="button"
                                                className="absolute top-3 right-3 w-10 h-10 rounded-xl bg-white text-gray-500 border border-gray-200 flex items-center justify-center shadow-sm"
                                                aria-label="Kaydet"
                                            >
                                                <Bookmark className="w-4 h-4" />
                                            </button>
                                            <div className="absolute inset-0 flex items-center justify-center text-gray-300">
                                                <Square className="w-12 h-12" />
                                            </div>
                                            <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-gray-900/40 to-transparent" />
                                        </div>

                                        <div className="p-5 border-r border-gray-100 flex flex-col justify-between">
                                            <div>
                                                <h3 className="text-2xl font-semibold text-gray-900">{variant.title}</h3>
                                                <p className="text-sm text-gray-500 mt-2 flex items-center gap-1.5">
                                                    <MapPin className="w-4 h-4" />
                                                    {variant.location}
                                                </p>
                                            </div>
                                            <div className="grid grid-cols-3 gap-3 mt-5 pt-4 border-t border-gray-100">
                                                <div className="text-center">
                                                    <BedDouble className="w-4 h-4 mx-auto text-gray-500 mb-1" />
                                                    <span className="text-sm text-gray-700">{variant.details[0]}</span>
                                                </div>
                                                <div className="text-center">
                                                    <Bath className="w-4 h-4 mx-auto text-gray-500 mb-1" />
                                                    <span className="text-sm text-gray-700">{variant.details[1]}</span>
                                                </div>
                                                <div className="text-center">
                                                    <Square className="w-4 h-4 mx-auto text-gray-500 mb-1" />
                                                    <span className="text-sm text-gray-700">{variant.details[2]}</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="p-5 bg-gray-50 flex flex-col items-end justify-between">
                                            <div className="text-right">
                                                <p className="text-3xl font-bold text-orange-500">
                                                    {variant.price}
                                                    {variant.priceSuffix && <span className="text-gray-400 text-xl ml-1">{variant.priceSuffix}</span>}
                                                </p>
                                                <p className="text-xs text-gray-400 mt-2">{variant.mode}</p>
                                            </div>
                                            <Button size="sm" className="w-full md:w-auto gap-2">
                                                <Eye className="w-4 h-4" />
                                                İncele
                                            </Button>
                                        </div>
                                    </div>
                                </article>
                            </div>
                        ))}
                    </div>

                    <div className="space-y-3">
                        <p className="text-xs uppercase tracking-wider text-gray-400 font-medium">KART MANTIĞI</p>
                        <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-3">
                            {Object.entries({
                                "Yerleşim": "/p3 ile uyumlu yatay kart: medya + içerik + fiyat/aksiyon kolonu",
                                "Başlık ve Konum": "İlk bakışta mülk vaadi ve lokasyon netliği",
                                "Detay Satırı": "m², oda ve banyo bilgisi kompakt veri satırıyla verilir",
                                "Fiyat Bloğu": "Fiyatın yanında satış modu ve kira eki açıkça gösterilir",
                                "Aksiyon": "Tek CTA: İncele. Karar akışı sade tutulur",
                                "Güven Katmanı": "Rozet, kaydet ve süreç işaretleri kartın üst katmanında konumlanır",
                            }).map(([key, value], index) => (
                                <div key={key} className="flex items-start gap-3 p-3 border border-gray-100 rounded-lg hover:border-gray-200 transition-colors">
                                    <span className="text-xs font-mono text-gray-300">0{index + 1}</span>
                                    <div className="flex-1">
                                        <p className="text-sm font-medium text-gray-900">{key}</p>
                                        <p className="text-xs text-gray-500">{value}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Atomic Design Section */}
                <section id="atomicDesign" className="space-y-8">
                    <div className="flex items-baseline gap-4">
                        <span className="text-sm font-mono text-gray-300">09</span>
                        <div>
                            <h2 className="text-3xl font-bold text-gray-900">{t("uxGuide.sections.atomicDesign")}</h2>
                            <p className="text-gray-500 mt-1">
                                Hiyerarşi sade ama sektöre özel: atomdan template&apos;e her katmanda emlak operasyonunu hızlandıran karar noktası bulunur.
                            </p>
                        </div>
                    </div>
                    <div className="grid gap-px bg-gray-100 rounded-lg overflow-hidden md:grid-cols-2 lg:grid-cols-4">
                        {atomicLevels.map((level) => (
                            <div key={level.level} className="bg-white p-6 hover:bg-gray-50/50 transition-colors">
                                <div className="flex items-center justify-between mb-4">
                                    <span className="text-3xl font-bold text-gray-200">{level.level}</span>
                                    <level.icon className="w-5 h-5 text-gray-400" />
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">{level.title}</h3>
                                <p className="text-sm text-gray-500 mb-4 leading-relaxed">{level.description}</p>
                                <div className="space-y-1.5">
                                    {level.components.map((comp) => (
                                        <div key={comp} className="text-xs font-mono px-2 py-1.5 bg-gray-900 text-gray-300 rounded">{comp}</div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Layout Section */}
                <section id="layout" className="space-y-8">
                    <div className="flex items-baseline gap-4">
                        <span className="text-sm font-mono text-gray-300">10</span>
                        <div>
                            <h2 className="text-3xl font-bold text-gray-900">{t("uxGuide.sections.layout")}</h2>
                            <p className="text-gray-500 mt-1">Ana taslak /3 ve /8&apos;deki dashboard netliğini, /p3&apos;teki filtre + liste derinliğini birlikte kullanır.</p>
                        </div>
                    </div>
                    <div className="space-y-6">
                        <div className="border border-gray-100 rounded-lg p-6">
                            <p className="text-xs uppercase tracking-wider text-gray-400 font-medium mb-4">Responsive Grid</p>
                            <p className="text-sm text-gray-500 mb-6">
                                Landing ve portföyde farklı yoğunluklar kullanılır: hero ve trust kartları geniş, filtre ve tablo kartları modüler.
                            </p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                                {[1, 2, 3, 4].map((i) => (
                                    <div key={i} className="bg-gray-900 rounded-lg p-8 text-center">
                                        <span className="text-sm font-mono text-gray-400">{i}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="grid gap-4 lg:grid-cols-3">
                            {[
                                { title: "Home", desc: "Güven metrikleri + kategori geçişi + hizmet girişleri" },
                                { title: "Portföy", desc: "Sidebar filtre + yatay kartlar + hızlı karşılaştırma aksiyonları" },
                                { title: "İlan Detay", desc: "Karar için teknik detay, harita, süreç ve danışmanlık CTA'sı" },
                            ].map((item) => (
                                <Card key={item.title} padding="md" className="border border-gray-200">
                                    <h3 className="text-base font-semibold text-gray-900">{item.title}</h3>
                                    <p className="text-sm text-gray-500 mt-2">{item.desc}</p>
                                </Card>
                            ))}
                        </div>
                        <div className="border border-gray-100 rounded-lg overflow-hidden">
                            <div className="grid grid-cols-4 divide-x divide-gray-100">
                                {Object.entries({ sm: "640px", md: "768px", lg: "1024px", xl: "1280px" }).map(([key, value]) => (
                                    <div key={key} className="p-6 text-center hover:bg-gray-50/50 transition-colors">
                                        <code className="text-2xl font-bold text-gray-900">{key}</code>
                                        <p className="text-sm font-mono text-gray-400 mt-2">{value}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                {/* Trust Signals Section */}
                <section id="trustSignals" className="space-y-8">
                    <div className="flex items-baseline gap-4">
                        <span className="text-sm font-mono text-gray-300">11</span>
                        <div>
                            <h2 className="text-3xl font-bold text-gray-900">Güven Sinyalleri</h2>
                            <p className="text-gray-500 mt-1">
                                Fintech dili burada rakam gösterisi değil karar güvencesi için kullanılır.
                            </p>
                        </div>
                    </div>
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                        {trustSignals.map((signal) => (
                            <div key={signal.label} className="border border-gray-200 rounded-xl p-5 bg-white">
                                <p className="text-xs uppercase tracking-wider text-gray-400 mb-2">{signal.label}</p>
                                <p className="text-2xl font-bold text-gray-900">{signal.value}</p>
                                <p className="text-xs text-gray-500 mt-2 leading-relaxed">{signal.hint}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Icons Section */}
                <section id="icons" className="space-y-8">
                    <div className="flex items-baseline gap-4">
                        <span className="text-sm font-mono text-gray-300">12</span>
                        <div>
                            <h2 className="text-3xl font-bold text-gray-900">{t("uxGuide.sections.icons")}</h2>
                            <p className="text-gray-500 mt-1">İkonlar mimariyi sade tutar: mülk türü, lokasyon, süreç ve iletişim aksiyonları tek bakışta ayrışır.</p>
                        </div>
                    </div>
                    <div className="border border-gray-100 rounded-lg p-6">
                        <div className="grid grid-cols-5 sm:grid-cols-7 md:grid-cols-9 lg:grid-cols-10 gap-1">
                            {commonIcons.map(({ name, icon: Icon }) => (
                                <div key={name} className="aspect-square flex flex-col items-center justify-center p-3 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer group" title={name}>
                                    <Icon className="w-5 h-5 text-gray-600 group-hover:text-gray-900 transition-colors" />
                                </div>
                            ))}
                        </div>
                        <div className="mt-6 pt-6 border-t border-gray-100">
                            <code className="text-xs font-mono text-gray-500 bg-gray-900 text-gray-300 px-3 py-2 rounded block">
                                import {"{"} IconName {"}"} from &quot;lucide-react&quot;
                            </code>
                        </div>
                    </div>
                </section>

                {/* Animations Section */}
                <section id="animations" className="space-y-8">
                    <div className="flex items-baseline gap-4">
                        <span className="text-sm font-mono text-gray-300">13</span>
                        <div>
                            <h2 className="text-3xl font-bold text-gray-900">{t("uxGuide.sections.animations")}</h2>
                            <p className="text-gray-500 mt-1">Animasyonlar dekor değil yönlendirme aracıdır; dikkat, yeni ilanlar ve kritik süreç adımlarına çekilir.</p>
                        </div>
                    </div>
                    <div className="grid gap-px bg-gray-100 rounded-lg overflow-hidden md:grid-cols-2 lg:grid-cols-4">
                        {[
                            { name: "Portföy Giriş", class: "animate-fade-in" },
                            { name: "Filtre Açılış", class: "animate-slide-up" },
                            { name: "Canlı Durum Noktası", class: "animate-pulse" },
                            { name: "Kart İncele", class: "transition-all duration-300 hover:scale-110 hover:shadow-lg cursor-pointer" },
                        ].map((anim) => (
                            <div key={anim.name} className="bg-white p-6">
                                <p className="text-xs uppercase tracking-wider text-gray-400 font-medium mb-4">{anim.name}</p>
                                <div className="h-24 flex items-center justify-center bg-gray-50 rounded-lg">
                                    <div className={`w-12 h-12 bg-gray-900 rounded-lg ${anim.class}`} />
                                </div>
                                <code className="block text-xs font-mono text-gray-400 mt-4">{anim.class.split(' ')[0]}</code>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Forms Section - Using Actual Components */}
                <section id="forms" className="space-y-8">
                    <div className="flex items-baseline gap-4">
                        <span className="text-sm font-mono text-gray-300">14</span>
                        <div>
                            <h2 className="text-3xl font-bold text-gray-900">{t("uxGuide.sections.forms")}</h2>
                            <p className="text-gray-500 mt-1">Formlar tek mesaj kutusu değil; satın alma, inşaat ve vergi ihtiyacını aynı brifte toplar.</p>
                        </div>
                    </div>
                    <UxGuideInteractive />
                </section>

                {/* Interactive Image Accordion Section */}
                <section id="accordion" className="space-y-8">
                    <div className="flex items-baseline gap-4">
                        <span className="text-sm font-mono text-gray-300">15</span>
                        <div>
                            <h2 className="text-3xl font-bold text-gray-900">Portföy Hikâye Akordeonu</h2>
                            <p className="text-gray-500 mt-1">Bölgesel hikâye, proje sahnesi ve yaşam kalitesi verisini aynı blokta anlatan görsel akış yapısı.</p>
                        </div>
                    </div>

                    <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                        <p className="text-sm text-green-800">
                            <strong>✓ Gerçek bileşen:</strong> Bu bölüm doğrudan <code className="bg-green-100 px-1 rounded">LandingAccordion</code> bileşenini kullanır.
                        </p>
                    </div>

                    <div className="border border-gray-100 rounded-lg overflow-hidden">
                        <LandingAccordion />
                    </div>
                </section>
            </div>
        </main>
    );
}
