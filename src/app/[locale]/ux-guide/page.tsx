import type { Metadata } from "next";
import { useTranslations } from "next-intl";
import { Badge, Button, Card, CardContent, CardFooter, CardHeader } from "@/components/ui";
import { ListingCard } from "@/components/public/listing-card";
import { LandingAccordion } from "@/components/ui/interactive-image-accordion";
import UxGuideInteractive from "./ux-guide-interactive";
import {
    Building2, MapPin, BedDouble, Bath, Square, Star, Bookmark, Search, Menu,
    ChevronRight, Heart, Phone, Mail, X, Plus, Check, Eye, ArrowRight, Home,
    Layers, Box, Component, Layout
} from "lucide-react";

export const metadata: Metadata = {
    title: "UX Guide | Güzel Invest",
    description: "Design system overview for Güzel Invest.",
    robots: { index: false, follow: false },
};

// Sample listing data for the ListingCard demo
const sampleListing = {
    id: "demo-1",
    slug: "demo-luxury-villa",
    type: "VILLA" as const,
    saleType: "SALE" as const,
    price: 495000,
    currency: "EUR",
    bedrooms: 4,
    bathrooms: 3,
    area: 280,
    city: "Alanya",
    district: "Mahmutlar",
    translations: [
        {
            locale: "tr",
            title: "Lüks Deniz Manzaralı Villa",
        },
    ],
    media: [], // Empty to show placeholder state
};

const sampleListingWithImage = {
    ...sampleListing,
    id: "demo-2",
    slug: "demo-apartment",
    type: "APARTMENT" as const,
    saleType: "RENT" as const,
    price: 1500,
    bedrooms: 2,
    bathrooms: 1,
    area: 95,
    district: "Kestel",
    translations: [
        {
            locale: "tr",
            title: "Modern Kiralık Daire",
        },
    ],
};

export default function UxGuidePage() {
    const t = useTranslations();

    const colorGroups = [
        {
            title: t("uxGuide.colors.primary"),
            items: [
                { name: "orange-50", className: "bg-orange-50", hex: "#FFF7ED" },
                { name: "orange-100", className: "bg-orange-100", hex: "#FFEDD5" },
                { name: "orange-200", className: "bg-orange-200", hex: "#FED7AA" },
                { name: "orange-500", className: "bg-orange-500", hex: "#EC6803" },
                { name: "orange-700", className: "bg-orange-700", hex: "#C2410C" },
            ],
        },
        {
            title: t("uxGuide.colors.neutral"),
            items: [
                { name: "gray-50", className: "bg-gray-50", hex: "#F9FAFB" },
                { name: "gray-100", className: "bg-gray-100", hex: "#F3F4F6" },
                { name: "gray-200", className: "bg-gray-200", hex: "#E5E7EB" },
                { name: "gray-500", className: "bg-gray-500", hex: "#6B7280" },
                { name: "gray-900", className: "bg-gray-900", hex: "#111827" },
            ],
        },
        {
            title: t("uxGuide.colors.status"),
            items: [
                { name: "green-500", className: "bg-green-500", hex: "#22C55E" },
                { name: "blue-500", className: "bg-blue-500", hex: "#3B82F6" },
                { name: "amber-500", className: "bg-amber-500", hex: "#F59E0B" },
                { name: "red-500", className: "bg-red-500", hex: "#EF4444" },
                { name: "teal-500", className: "bg-teal-500", hex: "#14B8A6" },
            ],
        },
    ];

    const sectionLinks = [
        { id: "fontFamily", label: t("uxGuide.sections.fontFamily") },
        { id: "typographyScale", label: t("uxGuide.sections.typographyScale") },
        { id: "colors", label: t("uxGuide.sections.colors") },
        { id: "tokens", label: t("uxGuide.sections.tokens") },
        { id: "components", label: t("uxGuide.sections.components") },
        { id: "listingCard", label: t("uxGuide.sections.listingCard") },
        { id: "atomicDesign", label: t("uxGuide.sections.atomicDesign") },
        { id: "layout", label: t("uxGuide.sections.layout") },
        { id: "icons", label: t("uxGuide.sections.icons") },
        { id: "animations", label: t("uxGuide.sections.animations") },
        { id: "forms", label: t("uxGuide.sections.forms") },
        { id: "accordion", label: "Image Accordion" },
    ];

    const typographyScaleSizes = [
        { class: "text-xs", size: "13px", example: "Captions & metadata" },
        { class: "text-sm", size: "15px", example: "Helper text & labels" },
        { class: "text-base", size: "17px", example: "Body text default" },
        { class: "text-lg", size: "18px", example: "Large body text" },
        { class: "text-xl", size: "20px", example: "Section titles" },
        { class: "text-2xl", size: "24px", example: "Card headings" },
        { class: "text-3xl", size: "30px", example: "Page headings" },
        { class: "text-4xl", size: "36px", example: "Hero titles" },
        { class: "text-5xl", size: "48px", example: "Display text" },
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
            components: ["Button", "Badge", "Input", "Checkbox"],
        },
        {
            level: "02",
            title: t("uxGuide.atomicDesign.molecules.title"),
            description: t("uxGuide.atomicDesign.molecules.description"),
            icon: Component,
            components: ["Card", "RangeSlider", "FilterSection"],
        },
        {
            level: "03",
            title: t("uxGuide.atomicDesign.organisms.title"),
            description: t("uxGuide.atomicDesign.organisms.description"),
            icon: Layers,
            components: ["ListingCard", "FilterPanel", "Navbar", "Footer"],
        },
        {
            level: "04",
            title: t("uxGuide.atomicDesign.templates.title"),
            description: t("uxGuide.atomicDesign.templates.description"),
            icon: Layout,
            components: ["PortfolioPage", "ListingDetail", "ContactPage"],
        },
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
                        {t("uxGuide.description")}
                    </p>
                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 max-w-2xl">
                        <p className="text-sm text-amber-800">
                            <strong>Living Documentation:</strong> Components shown here are the actual components used across the site. Updating a component updates it everywhere.
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

                {/* Font Family Section */}
                <section id="fontFamily" className="space-y-8">
                    <div className="flex items-baseline gap-4">
                        <span className="text-sm font-mono text-gray-300">01</span>
                        <div>
                            <h2 className="text-3xl font-bold text-gray-900">
                                {t("uxGuide.sections.fontFamily")}
                            </h2>
                            <p className="text-gray-500 mt-1">
                                {t("uxGuide.fontFamily.description")}
                            </p>
                        </div>
                    </div>
                    <div className="border border-gray-100 rounded-lg overflow-hidden">
                        <div className="border-b border-gray-100 p-8 bg-gray-50/50">
                            <h3 className="text-6xl font-bold text-gray-900 tracking-tight">
                                {t("uxGuide.fontFamily.title")}
                            </h3>
                            <p className="text-sm text-gray-400 mt-3 font-mono">
                                {t("uxGuide.fontFamily.source")}
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
                        <span className="text-sm font-mono text-gray-300">02</span>
                        <div>
                            <h2 className="text-3xl font-bold text-gray-900">
                                {t("uxGuide.sections.typographyScale")}
                            </h2>
                            <p className="text-gray-500 mt-1">
                                {t("uxGuide.typographyScale.description")}
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
                        <span className="text-sm font-mono text-gray-300">03</span>
                        <div>
                            <h2 className="text-3xl font-bold text-gray-900">{t("uxGuide.sections.colors")}</h2>
                            <p className="text-gray-500 mt-1">{t("uxGuide.colorsHint")}</p>
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
                        <span className="text-sm font-mono text-gray-300">04</span>
                        <h2 className="text-3xl font-bold text-gray-900">{t("uxGuide.sections.tokens")}</h2>
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
                        <span className="text-sm font-mono text-gray-300">05</span>
                        <h2 className="text-3xl font-bold text-gray-900">{t("uxGuide.sections.components")}</h2>
                    </div>
                    <div className="grid gap-6 lg:grid-cols-3">
                        {/* Buttons - Actual Button Component */}
                        <Card padding="md" className="border border-gray-100">
                            <h3 className="text-sm font-medium text-gray-900 uppercase tracking-wider mb-4">{t("uxGuide.components.buttons")}</h3>
                            <div className="flex flex-wrap gap-2">
                                <Button>{t("uxGuide.labels.primary")}</Button>
                                <Button variant="secondary">{t("uxGuide.labels.secondary")}</Button>
                                <Button variant="outline">{t("uxGuide.labels.outline")}</Button>
                                <Button variant="ghost">{t("uxGuide.labels.ghost")}</Button>
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
                                <Badge variant="success">Success</Badge>
                                <Badge variant="warning">Warning</Badge>
                                <Badge variant="info">Info</Badge>
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
                                        <h3 className="text-lg font-semibold text-gray-900">{t("uxGuide.examples.cardTitle")}</h3>
                                    </div>
                                    <Badge variant="primary">{t("uxGuide.examples.badgeFeatured")}</Badge>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <p className="text-gray-600">{t("uxGuide.examples.cardText")}</p>
                            </CardContent>
                            <CardFooter className="flex items-center justify-between">
                                <span className="text-sm font-mono text-gray-400">€245,000</span>
                                <Button variant="outline" size="sm">{t("uxGuide.examples.cardCta")}</Button>
                            </CardFooter>
                        </Card>
                    </div>
                </section>

                {/* Listing Card Section - ACTUAL ListingCard Component */}
                <section id="listingCard" className="space-y-8">
                    <div className="flex items-baseline gap-4">
                        <span className="text-sm font-mono text-gray-300">06</span>
                        <div>
                            <h2 className="text-3xl font-bold text-gray-900">{t("uxGuide.sections.listingCard")}</h2>
                            <p className="text-gray-500 mt-1">{t("uxGuide.listingCard.description")}</p>
                        </div>
                    </div>

                    <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                        <p className="text-sm text-green-800">
                            <strong>✓ Real Component:</strong> This is the actual <code className="bg-green-100 px-1 rounded">ListingCard</code> component from <code className="bg-green-100 px-1 rounded">@/components/public/listing-card.tsx</code>. Changes to that file will be reflected here.
                        </p>
                    </div>

                    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                        {/* Actual ListingCard - Sale Variant */}
                        <div className="space-y-3">
                            <p className="text-xs uppercase tracking-wider text-gray-400 font-medium">Sale Variant (No Image)</p>
                            <ListingCard listing={sampleListing} locale="tr" />
                        </div>

                        {/* Actual ListingCard - Rent Variant */}
                        <div className="space-y-3">
                            <p className="text-xs uppercase tracking-wider text-gray-400 font-medium">Rent Variant</p>
                            <ListingCard listing={sampleListingWithImage} locale="tr" />
                        </div>

                        {/* Structure Breakdown */}
                        <div className="space-y-3">
                            <p className="text-xs uppercase tracking-wider text-gray-400 font-medium">Component Structure</p>
                            <div className="space-y-2">
                                {Object.entries({
                                    "Image": t("uxGuide.listingCard.structure.image"),
                                    "Badge": t("uxGuide.listingCard.structure.badge"),
                                    "Bookmark": t("uxGuide.listingCard.structure.bookmark"),
                                    "Title": t("uxGuide.listingCard.structure.title"),
                                    "Price": t("uxGuide.listingCard.structure.price"),
                                    "Rating": t("uxGuide.listingCard.structure.rating"),
                                    "Details": t("uxGuide.listingCard.structure.details"),
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
                    </div>
                </section>

                {/* Atomic Design Section */}
                <section id="atomicDesign" className="space-y-8">
                    <div className="flex items-baseline gap-4">
                        <span className="text-sm font-mono text-gray-300">07</span>
                        <div>
                            <h2 className="text-3xl font-bold text-gray-900">{t("uxGuide.sections.atomicDesign")}</h2>
                            <p className="text-gray-500 mt-1">{t("uxGuide.atomicDesign.description")}</p>
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
                        <span className="text-sm font-mono text-gray-300">08</span>
                        <div>
                            <h2 className="text-3xl font-bold text-gray-900">{t("uxGuide.sections.layout")}</h2>
                            <p className="text-gray-500 mt-1">{t("uxGuide.layout.container")}</p>
                        </div>
                    </div>
                    <div className="space-y-6">
                        <div className="border border-gray-100 rounded-lg p-6">
                            <p className="text-xs uppercase tracking-wider text-gray-400 font-medium mb-4">Responsive Grid</p>
                            <p className="text-sm text-gray-500 mb-6">{t("uxGuide.layout.grid")}</p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                                {[1, 2, 3, 4].map((i) => (
                                    <div key={i} className="bg-gray-900 rounded-lg p-8 text-center">
                                        <span className="text-sm font-mono text-gray-400">{i}</span>
                                    </div>
                                ))}
                            </div>
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

                {/* Icons Section */}
                <section id="icons" className="space-y-8">
                    <div className="flex items-baseline gap-4">
                        <span className="text-sm font-mono text-gray-300">09</span>
                        <div>
                            <h2 className="text-3xl font-bold text-gray-900">{t("uxGuide.sections.icons")}</h2>
                            <p className="text-gray-500 mt-1">{t("uxGuide.icons.description")}</p>
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
                        <span className="text-sm font-mono text-gray-300">10</span>
                        <div>
                            <h2 className="text-3xl font-bold text-gray-900">{t("uxGuide.sections.animations")}</h2>
                            <p className="text-gray-500 mt-1">{t("uxGuide.animations.description")}</p>
                        </div>
                    </div>
                    <div className="grid gap-px bg-gray-100 rounded-lg overflow-hidden md:grid-cols-2 lg:grid-cols-4">
                        {[
                            { name: "Fade In", class: "animate-fade-in" },
                            { name: "Slide Up", class: "animate-slide-up" },
                            { name: "Pulse", class: "animate-pulse" },
                            { name: "Hover", class: "transition-all duration-300 hover:scale-110 hover:shadow-lg cursor-pointer" },
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
                        <span className="text-sm font-mono text-gray-300">11</span>
                        <h2 className="text-3xl font-bold text-gray-900">{t("uxGuide.sections.forms")}</h2>
                    </div>
                    <UxGuideInteractive />
                </section>

                {/* Interactive Image Accordion Section */}
                <section id="accordion" className="space-y-8">
                    <div className="flex items-baseline gap-4">
                        <span className="text-sm font-mono text-gray-300">12</span>
                        <div>
                            <h2 className="text-3xl font-bold text-gray-900">Interactive Image Accordion</h2>
                            <p className="text-gray-500 mt-1">A dynamic, responsive image accordion for showcasing portfolio highlights or local attractions.</p>
                        </div>
                    </div>

                    <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                        <p className="text-sm text-green-800">
                            <strong>✓ Real Component:</strong> This is the actual <code className="bg-green-100 px-1 rounded">LandingAccordion</code> component.
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
