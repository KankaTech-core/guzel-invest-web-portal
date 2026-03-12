import {
    ArrowRight,
    Award,
    BarChart3,
    Building2,
    CircleDollarSign,
    Clock3,
    Globe,
    Globe2,
    Handshake,
    Settings,
    ShieldCheck,
    Users2,
} from "lucide-react";
import Image from "next/image";
import { ScrollRevealSection } from "@/components/ui/scroll-reveal-section";

const stats = [
    { icon: Clock3, label: "Deneyim", value: "30+ Yıl" },
    { icon: Award, label: "Başarılı Proje", value: "28" },
    { icon: Building2, label: "Geliştirme ve İnşaat", value: "7 Proje" },
    { icon: Globe2, label: "Yatırım Merkezi", value: "Alanya" },
    { icon: ShieldCheck, label: "İş Ortağı", value: "Güvenilir" },
] as const;

type TeamMember = {
    name: string;
    role: string;
    image: string;
    imagePosition?: string;
};

const teamMembers: readonly TeamMember[] = [
    {
        name: "Deniz Yılmaz",
        role: "Gayrimenkul Danışmanı",
        image: "/images/about-us/deniz-yilmaz-profile.webp",
        imagePosition: "center 40%",
    },
    {
        name: "Hatice Çoban",
        role: "Gayrimenkul Danışmanı",
        image: "/images/about-us/hatice-coban-profile.webp",
        imagePosition: "center 40%",
    },
    {
        name: "Ahmet Bilen",
        role: "Gayrimenkul Danışmanı",
        image: "/images/about-us/ahmet-bilen-profile.webp",
    },
    {
        name: "Gürkan Kara",
        role: "Gayrimenkul Danışmanı",
        image: "/images/about-us/gurkan-kara-profile.webp",
    },
];

const principles = [
    {
        id: "misyonumuz",
        title: "Misyonumuz",
        text: "Yatırımcılarımıza doğru lokasyonlarda, yüksek değer potansiyeline sahip projeler sunarak şeffaf, güvenilir ve profesyonel hizmet anlayışı ile uzun vadeli değer yaratmak.",
        image:
            "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=900&h=650&fit=crop",
        reverse: false,
    },
    {
        id: "vizyonumuz",
        title: "Vizyonumuz",
        text: "Gayrimenkul sektöründe kalite, güven ve sürdürülebilir yatırım anlayışı ile uluslararası yatırımcıların tercih ettiği lider markalardan biri olmak.",
        image:
            "https://images.unsplash.com/photo-1552664730-d307ca884978?w=900&h=650&fit=crop",
        reverse: true,
    },
] as const;

const serviceDetails = [
    {
        icon: Handshake,
        title: "Satılık & Kiralık Gayrimenkul",
        description:
            "Villa, daire, arsa ve ticari mülk portföyümüzü net fiyat analiziyle sunuyoruz. Her portföy kaydı, lokasyon avantajı ve getiri potansiyeli ile birlikte değerlendirilir.",
        bullets: [
            "Güncel ve doğrulanmış portföy listesi",
            "Bölge bazlı fiyat karşılaştırması",
            "İhtiyaca göre kısa listeleme süreci",
        ],
        image:
            "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1400&h=900&fit=crop",
        dark: false,
    },
    {
        icon: BarChart3,
        title: "Yatırım Danışmanlığı",
        description:
            "Yatırım kararlarını yalnızca sezgiyle değil, veriye dayalı modellemeyle şekillendiriyoruz. Bölgesel değer artışı, kira çarpanı ve çıkış senaryolarını birlikte planlıyoruz.",
        bullets: [
            "Lokasyon ve segment bazlı yatırım raporu",
            "Risk-getiri dengesine göre alternatif planlar",
            "Orta ve uzun vadeli portföy stratejisi",
        ],
        image:
            "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1400&h=900&fit=crop",
        dark: true,
    },
    {
        icon: CircleDollarSign,
        title: "Mülk Satın Alma",
        description:
            "Satın alma sürecinde teklif, pazarlık, ekspertiz ve tapu adımlarını tek bir operasyon akışında yönetiyoruz. Zaman kaybını azaltıp süreci kontrollü şekilde tamamlıyoruz.",
        bullets: [
            "Ekspertiz ve değer doğrulama",
            "Müzakere ve sözleşme yönetimi",
            "Tapu sürecinde uçtan uca takip",
        ],
        image:
            "https://images.unsplash.com/photo-1554995207-c18c203602cb?w=1400&h=900&fit=crop",
        dark: false,
    },
    {
        icon: Globe,
        title: "Vatandaşlık Danışmanlığı",
        description:
            "Gayrimenkul yatırımıyla vatandaşlık hedefleyen müşteriler için uygun portföy seçiminden resmi başvuru adımlarına kadar tüm süreci şeffaf şekilde koordine ediyoruz.",
        bullets: [
            "Uygun mülk eşleştirmesi ve dosya hazırlığı",
            "Resmi prosedürlerde koordineli takip",
            "Süreç boyunca düzenli durum raporlaması",
        ],
        image:
            "https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?w=1400&h=900&fit=crop",
        dark: true,
    },
    {
        icon: Settings,
        title: "Mülk Yönetimi",
        description:
            "Satın alma sonrası kiralama, bakım ve kiracı iletişimi dahil tüm operasyonel süreçleri profesyonel ekiplerle yönetiyoruz. Böylece mülkünüz sürekli değer üreten bir varlığa dönüşür.",
        bullets: [
            "Kiralama ve kira tahsilat süreci",
            "Bakım, onarım ve aidat koordinasyonu",
            "Kiracı iletişimi ve raporlama",
        ],
        image:
            "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1400&h=900&fit=crop",
        dark: false,
    },
    {
        icon: ShieldCheck,
        title: "Hukuki & Mali Destek",
        description:
            "Gayrimenkul işlemlerinde hukuki güvence ve mali doğruluk en kritik başlıklardır. Uzman ağımızla sözleşme, vergi ve resmi işlemleri güvenli zeminde ilerletiyoruz.",
        bullets: [
            "Sözleşme ve tapu evrak kontrolü",
            "Vergi, harç ve mali yükümlülük takibi",
            "Satış sonrası hukuki danışmanlık",
        ],
        image:
            "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=1400&h=900&fit=crop",
        dark: true,
    },
] as const;

type PageProps = {
    params: Promise<{ locale: string }>;
};

export default async function AboutPage({ params }: PageProps) {
    const { locale } = await params;

    return (
        <main className="overflow-x-hidden bg-white pt-16 pb-20">
            <ScrollRevealSection as="section" className="relative isolate min-h-[430px] overflow-hidden bg-gray-900 sm:min-h-[520px]" threshold={0.05} rootMargin="0px">
                <Image
                    src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=2000&h=1200&fit=crop"
                    alt="Birlikte çalışan gayrimenkul ekibi"
                    fill
                    priority
                    sizes="100vw"
                    className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-gray-900/25 via-gray-900/70 to-gray-900/80" />

                <div className="container-custom relative z-10 flex min-h-[430px] flex-col items-center justify-center text-center sm:min-h-[520px]">
                    <span className="reveal inline-flex items-center rounded-full border border-orange-300/65 bg-orange-500/20 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.15em] text-orange-100">
                        Güzel Invest • 30 Yıllık Deneyim
                    </span>
                    <h1 className="reveal mt-5 text-5xl font-bold text-white sm:text-6xl">Hakkımızda</h1>
                    <p className="reveal mt-5 max-w-3xl text-base leading-relaxed text-gray-200 sm:text-lg">
                        Güzel Invest, Antalya’nın en önemli yatırım merkezlerinden biri olan
                        Alanya’da faaliyet gösteren, güçlü geçmişi ve uluslararası vizyonu ile
                        gayrimenkul sektöründe güvenilir bir marka olarak konumlanmıştır.
                    </p>
                </div>
            </ScrollRevealSection>

            <ScrollRevealSection className="border-b border-gray-100 bg-white px-4 py-10 sm:px-6">
                <div className="mx-auto max-w-7xl">
                    <h2 className="reveal text-center text-[11px] font-semibold uppercase tracking-[0.15em] text-orange-500">
                        İstatistikler
                    </h2>
                    <div className="reveal-stagger mt-8 grid grid-cols-2 gap-y-8 md:grid-cols-5 md:gap-y-0">
                        {stats.map((stat, index) => (
                            <article
                                key={stat.label}
                                className={`reveal flex flex-col items-center px-3 text-center ${index === stats.length - 1 ? "col-span-2 md:col-span-1" : ""} ${index < stats.length - 1 ? "md:border-r md:border-gray-100" : ""}`}
                            >
                                <div className={`mb-3 flex h-14 w-14 items-center justify-center rounded-2xl ${index % 2 === 0 ? "bg-orange-500 text-white" : "bg-gray-900 text-white"}`}>
                                    <stat.icon className="h-6 w-6" />
                                </div>
                                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                                <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-gray-500">
                                    {stat.label}
                                </p>
                            </article>
                        ))}
                    </div>
                </div>
            </ScrollRevealSection>

            <ScrollRevealSection id="hikayemiz" className="relative isolate scroll-mt-28 overflow-hidden bg-white px-4 py-16 sm:px-6">
                <div className="pointer-events-none absolute -right-28 -top-20 -z-10 h-80 w-80 opacity-[0.08] sm:h-[430px] sm:w-[430px]">
                    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="h-full w-full">
                        <path fill="#FF6B00" d="M42.7,-73.2C55.9,-67.1,67.3,-57.8,76.5,-46.3C85.7,-34.8,92.7,-21.1,91.8,-7.6C90.9,5.9,82.1,19.2,72.4,30.3C62.7,41.4,52.1,50.3,40.7,58.3C29.3,66.3,17.1,73.4,4.2,74.7C-8.7,76,-22.3,71.5,-34.5,64.8C-46.7,58.1,-57.5,49.2,-66.2,38.6C-74.9,28,-81.5,15.7,-82.9,2.8C-84.3,-10.1,-80.5,-23.6,-72.7,-34.8C-64.9,-46,-53.1,-54.9,-40.8,-61.6C-28.5,-68.3,-15.7,-72.8,-0.9,-75.6C13.9,-78.4,29.5,-79.3,42.7,-73.2Z" transform="translate(100 100)" />
                    </svg>
                </div>
                <div className="mx-auto grid max-w-7xl grid-cols-1 items-start gap-8 lg:grid-cols-12">
                    <div className="reveal-scale lg:col-span-5">
                        <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-gray-200 bg-gray-100">
                            <Image
                                src="https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=900&h=700&fit=crop"
                                alt="Güzel Invest ofisi"
                                fill
                                sizes="(max-width: 1024px) 100vw, 42vw"
                                className="object-cover"
                            />
                        </div>
                    </div>

                    <article className="reveal lg:col-span-7">
                        <span className="text-[11px] font-semibold uppercase tracking-[0.15em] text-orange-500">
                            Kurumsal Profil
                        </span>
                        <h2 className="mt-3 text-3xl font-bold text-gray-900">
                            30 Yıllık Deneyim, Güçlü Projeler ve Güvenilir Yatırımlar.
                        </h2>
                        <p className="mt-4 text-sm leading-relaxed text-gray-600 sm:text-base">
                            Güzel Invest, Antalya’nın en önemli yatırım merkezlerinden biri olan
                            Alanya’da faaliyet gösteren, güçlü geçmişi ve uluslararası vizyonu ile
                            gayrimenkul sektöründe güvenilir bir marka olarak konumlanmıştır.
                        </p>
                        <p className="mt-4 text-sm leading-relaxed text-gray-600 sm:text-base">
                            Şirketimiz, kurucumuz Yusuf Güzel’in 30 yılı aşkın sektör tecrübesi ve
                            bilgi birikimi üzerine inşa edilmiştir.
                        </p>
                        <p className="mt-4 text-sm leading-relaxed text-gray-600 sm:text-base">
                            Kurulduğumuz günden bu yana amacımız yalnızca gayrimenkul satışı
                            yapmak değil; yatırımcılarımıza doğru lokasyonlarda, yüksek değer
                            potansiyeline sahip ve sürdürülebilir kazanç sağlayan projeler
                            sunmaktır.
                        </p>
                        <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
                            <div className="rounded-xl border border-gray-100 bg-gray-50 px-4 py-3">
                                <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                                    Tamamlanan Projeler
                                </p>
                                <p className="mt-1 text-sm font-semibold text-gray-900">
                                    28 başarılı proje
                                </p>
                            </div>
                            <div className="rounded-xl border border-gray-100 bg-gray-50 px-4 py-3">
                                <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                                    Geliştirme ve İnşaat Süreci
                                </p>
                                <p className="mt-1 text-sm font-semibold text-gray-900">
                                    7 farklı proje
                                </p>
                            </div>
                        </div>
                    </article>
                </div>
            </ScrollRevealSection>

            <ScrollRevealSection className="bg-gray-50 px-4 py-14 sm:px-6">
                <div className="mx-auto max-w-7xl">
                    <h2 className="reveal text-3xl font-bold text-gray-900">Neden Biz?</h2>
                    <p className="reveal mt-4 max-w-5xl text-sm leading-relaxed text-gray-600 sm:text-base">
                        Güzel Invest aynı zamanda alanında uzman, deneyimli ve profesyonel
                        gayrimenkul danışmanlarından oluşan güçlü bir ekibe sahiptir. Ekibimiz,
                        yatırımcılarımızın ihtiyaçlarını doğru analiz ederek en uygun gayrimenkul
                        seçeneklerini sunmakta ve sürecin her aşamasında profesyonel danışmanlık
                        sağlamaktadır.
                    </p>
                    <div className="reveal-stagger mt-7 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
                        {[
                            { icon: ShieldCheck, label: "Şeffaflık" },
                            { icon: Globe2, label: "Uluslararası vizyon" },
                            { icon: Building2, label: "Geniş portföy" },
                            { icon: Users2, label: "Profesyonel hizmet" },
                        ].map((item) => (
                            <div
                                key={item.label}
                                className="reveal flex items-center gap-3 rounded-xl border border-gray-100 bg-white px-4 py-3"
                            >
                                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-900 text-white">
                                    <item.icon className="h-4 w-4" />
                                </span>
                                <span className="text-sm font-medium text-gray-700">{item.label}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </ScrollRevealSection>

            <ScrollRevealSection id="neler-yapiyoruz" className="relative isolate scroll-mt-28 overflow-hidden bg-white py-16">
                <div className="pointer-events-none absolute -right-24 -top-20 -z-10 h-[340px] w-[340px] opacity-[0.08]">
                    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="h-full w-full">
                        <path fill="#FF6B00" d="M32.4,-53.6C42.1,-50.2,49.8,-41.9,58.4,-32.7C67,-23.5,76.4,-13.4,79.3,-1.5C82.2,10.3,78.7,23.9,70.8,33.5C62.9,43,50.6,48.5,38.6,53.5C26.7,58.6,15.2,63.2,2.3,60.5C-10.6,57.8,-25,47.8,-39.5,39.3C-54,30.8,-68.6,23.8,-74.2,12.5C-79.7,1.1,-76.1,-14.7,-67.2,-26.3C-58.3,-38,-44.1,-45.4,-31,-49C-17.9,-52.7,-5.9,-52.7,4.9,-60.7C15.8,-68.7,31.5,-84.7,32.4,-53.6Z" transform="translate(100 100)" />
                    </svg>
                </div>
                <div className="container-custom relative z-10">
                    <div className="reveal mb-10">
                        <span className="text-[11px] font-semibold uppercase tracking-[0.15em] text-orange-500">
                            Hizmetlerimiz
                        </span>
                        <h2 className="mt-2 text-3xl font-bold text-gray-900">
                            Neden Güzel Invest? Hizmetlerimizi Yakından Tanıyın
                        </h2>
                    </div>
                </div>

                <div className="space-y-0">
                    {serviceDetails.map((service, index) => {
                        const Icon = service.icon;
                        const reversed = index % 2 === 1;
                        return (
                            <article
                                key={service.title}
                                className={`border-y border-gray-100 ${service.dark ? "bg-gray-900" : "bg-white"}`}
                            >
                                <div className="reveal container-custom grid grid-cols-1 items-center gap-8 py-14 lg:grid-cols-12 lg:gap-10">
                                    <div className={`lg:col-span-7 ${reversed ? "lg:order-2" : ""}`}>
                                        <h3 className={`mt-3 text-3xl font-bold ${service.dark ? "text-white" : "text-gray-900"}`}>
                                            {service.title}
                                        </h3>
                                        <p className={`mt-4 text-sm leading-relaxed sm:text-base ${service.dark ? "text-gray-300" : "text-gray-600"}`}>
                                            {service.description}
                                        </p>

                                        <ul className="mt-6 space-y-3">
                                            {service.bullets.map((bullet) => (
                                                <li key={bullet} className="flex items-start gap-3">
                                                    <span className={`mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-md ${service.dark ? "bg-orange-500 text-white" : "bg-gray-900 text-white"}`}>
                                                        <Icon className="h-3.5 w-3.5" />
                                                    </span>
                                                    <span className={`text-sm ${service.dark ? "text-gray-200" : "text-gray-700"}`}>
                                                        {bullet}
                                                    </span>
                                                </li>
                                            ))}
                                        </ul>

                                        <div className="mt-8 flex flex-wrap gap-3">
                                            <a
                                                href={`/${locale}/iletisim`}
                                                className={`inline-flex items-center gap-2 rounded-lg px-5 py-3 text-sm font-semibold transition-colors ${service.dark
                                                    ? "bg-orange-500 text-white hover:bg-orange-400"
                                                    : "bg-gray-900 text-white hover:bg-black"
                                                    }`}
                                            >
                                                Detaylı Bilgi Al
                                                <ArrowRight className="h-4 w-4" />
                                            </a>
                                            <a
                                                href={`/${locale}/portfoy`}
                                                className={`inline-flex items-center gap-2 rounded-lg border px-5 py-3 text-sm font-semibold transition-colors ${service.dark
                                                    ? "border-gray-600 text-gray-100 hover:border-orange-300 hover:text-orange-300"
                                                    : "border-gray-300 text-gray-700 hover:border-orange-300 hover:text-orange-600"
                                                    }`}
                                            >
                                                Portföyü İncele
                                            </a>
                                        </div>
                                    </div>

                                    <div className={`lg:col-span-5 ${reversed ? "lg:order-1" : ""}`}>
                                        <div className={`relative aspect-[4/3] overflow-hidden rounded-2xl border ${service.dark ? "border-gray-700 bg-gray-800" : "border-gray-200 bg-white"}`}>
                                            <Image
                                                src={service.image}
                                                alt={service.title}
                                                fill
                                                sizes="(max-width: 1024px) 100vw, 42vw"
                                                className="object-cover"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </article>
                        );
                    })}
                </div>
            </ScrollRevealSection>

            <ScrollRevealSection id="ekibimiz" className="relative isolate scroll-mt-28 overflow-hidden bg-white px-4 py-16 sm:px-6">
                <div className="pointer-events-none absolute -left-28 top-10 -z-10 h-[320px] w-[320px] opacity-[0.08]">
                    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="h-full w-full">
                        <path fill="#111827" d="M41.3,-68.7C55.9,-62.5,71.7,-57.1,80.4,-46.1C89.2,-35.1,90.8,-18.5,87.7,-3.7C84.6,11.1,76.8,24.2,68.2,36.3C59.7,48.4,50.3,59.5,38.6,68.6C26.9,77.7,13.4,84.8,-0.5,85.6C-14.4,86.4,-28.8,80.9,-42.2,72.4C-55.6,63.8,-68.1,52.2,-75.9,38.2C-83.7,24.2,-86.9,7.8,-84.2,-7.4C-81.6,-22.6,-73,-36.7,-61.8,-46.6C-50.7,-56.5,-37,-62.2,-24,-69.8C-11,-77.5,1.2,-87.1,13.2,-86.1C25.2,-85.2,50.3,-73.8,41.3,-68.7Z" transform="translate(100 100)" />
                    </svg>
                </div>
                <div className="mx-auto max-w-7xl">
                    <div className="reveal mb-8">
                        <h2 className="mt-2 text-3xl font-bold text-gray-900">Ekibimiz</h2>
                        <p className="mt-4 max-w-4xl text-sm leading-relaxed text-gray-600 sm:text-base">
                            Ekibimiz, yatırımcılarımızın ihtiyaçlarını doğru analiz ederek en uygun
                            gayrimenkul seçeneklerini sunmakta ve sürecin her aşamasında
                            profesyonel danışmanlık sağlamaktadır.
                        </p>
                    </div>

                    <div className="reveal-stagger grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-2">
                        {teamMembers.map((member) => (
                            <article
                                key={member.name}
                                className="reveal group overflow-hidden rounded-xl border border-gray-100 bg-white transition-all duration-300 hover:border-orange-200 hover:shadow-xl hover:shadow-orange-500/5"
                            >
                                <div className="overflow-hidden">
                                    <Image
                                        src={member.image}
                                        alt={member.name}
                                        width={640}
                                        height={480}
                                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                        className="aspect-[4/3] h-full w-full object-cover"
                                        style={
                                            member.imagePosition
                                                ? { objectPosition: member.imagePosition }
                                                : undefined
                                        }
                                    />
                                </div>
                                <div className="border-t border-gray-100 bg-gray-50 px-4 py-3">
                                    <p className="text-sm font-semibold text-gray-900">{member.name}</p>
                                    <p className="mt-1 text-xs text-gray-500">{member.role}</p>
                                </div>
                            </article>
                        ))}
                    </div>
                </div>
            </ScrollRevealSection>

            <ScrollRevealSection className="relative isolate overflow-hidden bg-white px-4 py-10 sm:px-6">
                <div className="pointer-events-none absolute -right-28 top-8 -z-10 h-72 w-72 opacity-[0.08] sm:h-[390px] sm:w-[390px]">
                    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="h-full w-full">
                        <path fill="#111827" d="M44.7,-76.4C58.9,-69.2,71.8,-59.1,81.6,-46.6C91.4,-34.1,98.1,-19.2,95.8,-5.4C93.5,8.4,82.2,21.1,71.4,32.1C60.6,43.1,50.3,52.4,39,60.6C27.7,68.8,15.4,75.9,2.4,71.7C-10.5,67.6,-24.1,52.1,-37.2,40.1C-50.3,28.1,-63,19.6,-68.8,7.9C-74.6,-3.8,-73.5,-18.7,-64.2,-29.6C-54.9,-40.5,-37.4,-47.4,-23.5,-54.8C-9.6,-62.2,0.7,-70.1,12.7,-72.3C24.7,-74.5,30.5,-83.6,44.7,-76.4Z" transform="translate(100 100)" />
                    </svg>
                </div>
                <div className="mx-auto max-w-7xl space-y-10">
                    {principles.map((item) => (
                        <div
                            key={item.title}
                            id={item.id}
                            className="grid scroll-mt-28 grid-cols-1 items-center gap-8 lg:grid-cols-12"
                        >
                            <article
                                className={`reveal lg:col-span-7 ${item.reverse ? "lg:order-2" : ""}`}
                            >
                                <h2 className="text-3xl font-bold text-gray-900">{item.title}</h2>
                                <p className="mt-4 text-sm leading-relaxed text-gray-600 sm:text-base">
                                    {item.text}
                                </p>
                            </article>

                            <div className={`reveal-scale lg:col-span-5 ${item.reverse ? "lg:order-1" : ""}`}>
                                <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-gray-200 bg-gray-100">
                                    <Image
                                        src={item.image}
                                        alt={item.title}
                                        fill
                                        sizes="(max-width: 1024px) 100vw, 42vw"
                                        className="object-cover"
                                    />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </ScrollRevealSection>

            <ScrollRevealSection className="px-4 pt-4 pb-16 sm:px-6">
                <div className="reveal mx-auto max-w-7xl overflow-hidden rounded-[28px] bg-gray-900">
                    <div
                        className="relative px-6 py-10 sm:px-10 sm:py-12"
                        style={{
                            backgroundImage:
                                "radial-gradient(circle at 20% 20%, rgba(236,104,3,0.24), transparent 35%), radial-gradient(circle at 85% 80%, rgba(255,255,255,0.08), transparent 35%)",
                        }}
                    >
                        <span className="text-[11px] font-semibold uppercase tracking-[0.15em] text-orange-300">
                            Güzel Invest
                        </span>
                        <h2 className="mt-3 max-w-3xl text-3xl font-bold text-white sm:text-4xl">
                            Şeffaflık, güven ve profesyonel hizmet anlayışımız ile yatırımcılarımız
                            için güvenilir bir iş ortağı olmaya devam ediyoruz.
                        </h2>
                        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-gray-300 sm:text-base">
                            Yatırımcılarımıza doğru lokasyonlarda, yüksek değer potansiyeline sahip
                            projeler sunarak şeffaf, güvenilir ve profesyonel hizmet anlayışı ile
                            uzun vadeli değer yaratmak.
                        </p>

                        <div className="mt-8 flex flex-wrap gap-3">
                            <a
                                href={`/${locale}/iletisim`}
                                className="inline-flex items-center gap-2 rounded-lg bg-orange-500 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-orange-400"
                            >
                                Ücretsiz Ön Görüşme Al
                                <ArrowRight className="h-4 w-4" />
                            </a>
                            <a
                                href={`/${locale}/portfoy`}
                                className="inline-flex items-center gap-2 rounded-lg border border-gray-600 px-6 py-3 text-sm font-semibold text-gray-200 transition-colors hover:border-orange-300 hover:text-orange-300"
                            >
                                Güncel Portföyü İncele
                            </a>
                        </div>
                    </div>
                </div>
            </ScrollRevealSection>
        </main>
    );
}
