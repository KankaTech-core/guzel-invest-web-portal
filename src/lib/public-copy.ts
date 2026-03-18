import { normalizeLocaleTag } from "@/i18n/public-locales";

export type PublicLocale = "tr" | "en" | "ru" | "de";

type HomepagePropertyType = {
    value: "RESIDENTIAL" | "LAND" | "COMMERCIAL_CLUSTER" | "VILLA";
    label: string;
};

type HomepageCategory = {
    type: "APARTMENT" | "LAND" | "COMMERCIAL" | "VILLA";
    label: string;
    image: string;
};

type HomepageService = {
    icon: string;
    title: string;
    description: string;
};

type HomepageTestimonial = {
    name: string;
    type: string;
    quote: string;
    image: string;
    video: string | null;
};

type HomepageFaq = {
    question: string;
    answer: string;
};

type HomepageCopy = {
    propertyTypes: HomepagePropertyType[];
    hero: {
        badge: string;
        title: string;
        titleHighlight: string;
        titleEnd: string;
        subtitle: string;
        stats: Array<{ value: string; label: string }>;
        portfolioCta: string;
        sellCta: string;
        portfolioSlideLabel: string;
        projectSlideLabel: string;
        newProjectLabel: string;
        featuredListingAlt: string;
        featuredProjectAlt: string;
        projectDeliveryPrefix: string;
    };
    categories: {
        label: string;
        title: string;
        all: string;
        items: HomepageCategory[];
    };
    services: {
        label: string;
        title: string;
        items: HomepageService[];
    };
    highlights: {
        label: string;
        title: string;
        description: string;
        stats: Array<{ value: string; label: string }>;
        cta: string;
        imageAlt: string;
        roiLabel: string;
    };
    testimonials: {
        label: string;
        title: string;
        items: HomepageTestimonial[];
    };
    cta: {
        label: string;
        title: string;
        titleHighlight: string;
        description: string;
        portfolio: string;
        contact: string;
        sell: string;
    };
    faq: {
        label: string;
        title: string;
        moreQuestions: string;
        items: HomepageFaq[];
    };
    projectFallback: {
        title: string;
        district: string;
        projectType: string;
    };
};

type ArticlesCopy = {
    label: string;
    title: string;
    allArticles: string;
    readMore: string;
    excerptFallback: string;
};

type PortfolioCopy = {
    saleTypes: {
        sale: string;
        rent: string;
    };
    sortOptions: Record<"newest" | "priceAsc" | "priceDesc" | "areaDesc", string>;
    filters: {
        clear: string;
        categories: string;
        allCategories: string;
        selectedCategories: (count: number) => string;
        allCities: string;
        allDistricts: string;
        allNeighborhoods: string;
        cityPlaceholder: string;
        districtPlaceholder: string;
        neighborhoodPlaceholder: string;
        saleType: string;
        location: string;
        priceRange: string;
        areaRange: string;
        zoningStatus: string;
        zoningAll: string;
        zoningPlaceholder: string;
        parcelNoPlaceholder: string;
        emsal: string;
        commercial: string;
        landDetails: string;
        farmDetails: string;
        roomCount: string;
        waterSource: string;
        fruitTrees: string;
        min: string;
        max: string;
        allListings: string;
    };
    labels: {
        citizenship: string;
        residence: string;
        project: string;
        noLocation: string;
        missingTitle: string;
        missingDescription: string;
        noImage: string;
        viewAll: string;
        inspect: string;
        inspectProject: string;
        continueReading: string;
        loading: string;
        totalResults: string;
        loadingListings: string;
        noResults: string;
        otherListings: string;
        map: string;
        filter: string;
        sort: string;
        backToPortfolio: string;
        mapNoCoordinates: string;
        mapOpen: string;
        mapClose: string;
        listCardClose: string;
        drawerClose: string;
        cardClose: string;
    };
    errors: {
        loadListings: string;
        refreshListings: string;
        loadListingsNetwork: string;
        refreshListingsNetwork: string;
    };
    statuses: Record<"DRAFT" | "PUBLISHED" | "REMOVED" | "ARCHIVED", string>;
    sections: {
        listingType: string;
        propertyType: string;
        price: string;
        location: string;
        landDetails: string;
        commercialDetails: string;
        farmDetails: string;
        rooms: string;
        emsal: string;
        floor: string;
        bathrooms: string;
        area: string;
        projectFeatures: string;
    };
    aria: {
        previousImage: string;
        nextImage: string;
        closeDrawer: string;
        closeListingCard: string;
    };
};

const homepageCopyMap: Record<PublicLocale, HomepageCopy> = {
    tr: {
        propertyTypes: [
            { value: "RESIDENTIAL", label: "Konut" },
            { value: "LAND", label: "Arsa" },
            { value: "COMMERCIAL_CLUSTER", label: "Ticari" },
            { value: "VILLA", label: "Villa" },
        ],
        hero: {
            badge: "Alanya Satış & Yatırım Merkezi",
            title: "Güzel Şehre",
            titleHighlight: "Güzel",
            titleEnd: "Projeler",
            subtitle:
                "2001'den bu yana Alanya'da güvenilir gayrimenkul platformu. Satılık, kiralık mülkler ve profesyonel danışmanlık hizmetleriyle yanınızdayız.",
            stats: [
                { value: "300+", label: "Mutlu Müşteri" },
                { value: "20+", label: "Yıllık Tecrübe" },
                { value: "150+", label: "Aktif İlan" },
            ],
            portfolioCta: "Portföyü Gör",
            sellCta: "Satış Yap",
            portfolioSlideLabel: "Portföy",
            projectSlideLabel: "Proje",
            newProjectLabel: "Yeni Proje",
            featuredListingAlt: "Öne çıkan ilan",
            featuredProjectAlt: "Öne çıkan proje",
            projectDeliveryPrefix: "Teslim",
        },
        categories: {
            label: "Kategoriler",
            title: "Gayrimenkul Türleri",
            all: "Tümünü Gör",
            items: [
                { type: "APARTMENT", label: "Konut", image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400&h=280&fit=crop" },
                { type: "LAND", label: "Arsa", image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=400&h=280&fit=crop" },
                { type: "COMMERCIAL", label: "Ticari", image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400&h=280&fit=crop" },
                { type: "VILLA", label: "Villa", image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400&h=280&fit=crop" },
            ],
        },
        services: {
            label: "Hizmetlerimiz",
            title: "Neden Güzel Invest?",
            items: [
                {
                    icon: "Handshake",
                    title: "Satılık & Kiralık Gayrimenkul",
                    description: "Villa, daire, arsa ve ticari mülk portföyümüzle hayalinizdeki gayrimenkule ulaşın.",
                },
                {
                    icon: "BarChart3",
                    title: "Yatırım Danışmanlığı",
                    description: "Lokasyon analizi, pazar verileri ve kişiye özel yatırım stratejileri ile doğru kararlar verin.",
                },
                {
                    icon: "CircleDollarSign",
                    title: "Mülk Satın Alma",
                    description: "Daire, arsa ve proje bazlı gayrimenkul satın alma hizmetiyle ihtiyaçlarınıza çözüm sunuyoruz.",
                },
                {
                    icon: "Globe",
                    title: "Vatandaşlık Danışmanlığı",
                    description: "Gayrimenkul yatırımı ile Türk vatandaşlığı başvuru sürecinizi uçtan uca yönetiyoruz.",
                },
                {
                    icon: "Settings",
                    title: "Mülk Yönetimi",
                    description: "Kiralama, bakım, aidat takibi ve kiracı yönetimiyle mülkünüzü profesyonelce yönetiyoruz.",
                },
                {
                    icon: "ShieldCheck",
                    title: "Hukuki & Mali Destek",
                    description: "Tapu işlemleri, vergi danışmanlığı ve hukuki süreçlerde uzman rehberlik sağlıyoruz.",
                },
            ],
        },
        highlights: {
            label: "Lokasyon Analizi",
            title: "Neden Alanya?",
            description:
                "Alanya, güçlü turizm ekonomisi, yıl boyu yaşam imkanı ve uluslararası talep dengesiyle gayrimenkul yatırımında istikrarlı bir değer artışı sunar. Hem oturum hem de yatırım hedefleri için yüksek potansiyele sahip bir bölgedir.",
            stats: [
                { value: "300+", label: "Güneşli gün/yıl" },
                { value: "25°C", label: "Ortalama sıcaklık" },
                { value: "8M+", label: "Üzerinde turist" },
                { value: "110+", label: "Ülkeden yatırımcı" },
            ],
            cta: "Daha Fazla Bilgi",
            imageAlt: "Alanya Panorama",
            roiLabel: "Yatırım Getirisi",
        },
        testimonials: {
            label: "Müşteri Deneyimleri",
            title: "Sizden Gelenler",
            items: [
                {
                    name: "Ahmet & Elif Yılmaz",
                    type: "Villa · Kargıcak",
                    quote: "Güzel Invest ile hayalimizi gerçeğe dönüştürdük, sürecin her adımında yanımızdaydılar.",
                    image: "/images/testimonials/testimonial-1.png",
                    video: null,
                },
                {
                    name: "Mehmet Karaca",
                    type: "Yatırım · Mahmutlar",
                    quote: "Profesyonel yaklaşımları ve pazar bilgileri sayesinde doğru yatırım kararını verdim.",
                    image: "/images/testimonials/testimonial-2.png",
                    video: null,
                },
                {
                    name: "Demir Ailesi",
                    type: "Konut · Oba",
                    quote: "Aile olarak huzurla yaşayacağımız yuvamızı bulduk, tüm ekibe teşekkürler.",
                    image: "/images/testimonials/testimonial-3.png",
                    video: null,
                },
                {
                    name: "Canan & Emre Aksoy",
                    type: "Daire · Tosmur",
                    quote: "İlk evimizi alırken bizi adım adım yönlendirdiler, hiçbir sorumuzu cevapsız bırakmadılar.",
                    image: "/images/testimonials/testimonial-4.png",
                    video: null,
                },
                {
                    name: "Klaus Müller",
                    type: "Vatandaşlık · Kestel",
                    quote: "Türk vatandaşlığı sürecimi sorunsuz tamamladık, mülk yatırımımdan çok memnunum.",
                    image: "/images/testimonials/testimonial-5.png",
                    video: null,
                },
            ],
        },
        cta: {
            label: "Harekete Geçin",
            title: "Yatırıma",
            titleHighlight: "Hemen Başlayın",
            description: "Alanya'daki fırsatları keşfedin, uzman ekibimizle tanışın.",
            portfolio: "Portföyü Keşfet",
            contact: "İletişime Geç",
            sell: "Satış Yap",
        },
        faq: {
            label: "SSS",
            title: "Sıkça Sorulan Sorular",
            moreQuestions: "Daha Fazla Soru?",
            items: [
                {
                    question: "Yabancı uyruklu kişiler Türkiye'de mülk satın alabilir mi?",
                    answer: "Evet, birçok ülke vatandaşı Türkiye'de gayrimenkul satın alabilir. Askeri bölgeler dışında kalan alanlarda mülk edinme hakkına sahipsiniz. Ekibimiz tüm süreçte size rehberlik eder.",
                },
                {
                    question: "Satın alma süreci ne kadar sürer?",
                    answer: "Tapu işlemleri genellikle 3-7 iş günü içinde tamamlanır. Tüm belgelerin hazırlanması ve onaylanması dahil süreç ortalama 2-4 hafta sürmektedir.",
                },
                {
                    question: "Gayrimenkul yatırımıyla Türk vatandaşlığı alınabilir mi?",
                    answer: "Evet, 400.000 USD ve üzeri değerinde gayrimenkul yatırımı yaparak Türk vatandaşlığına başvurabilirsiniz. Mülkü 3 yıl boyunca satmama taahhüdü gerekmektedir.",
                },
                {
                    question: "Mülk yönetimi hizmeti sunuyor musunuz?",
                    answer: "Evet, satın aldığınız mülkün kiralanması, bakımı ve aidat takibi gibi tüm yönetim süreçlerini sizin adınıza profesyonelce yürütüyoruz.",
                },
                {
                    question: "Hangi ödeme yöntemlerini kabul ediyorsunuz?",
                    answer: "Banka havalesi, EFT ve uluslararası transfer kabul ediyoruz. Taksitli ödeme seçenekleri sunan projelerimiz de mevcuttur.",
                },
                {
                    question: "Alanya'da en çok tercih edilen bölgeler hangileri?",
                    answer: "Mahmutlar, Kargıcak, Kestel, Oba ve Tosmur en popüler bölgeler arasındadır. Her bölge farklı avantajlar sunar; ekibimiz ihtiyaçlarınıza en uygun lokasyonu belirlemenize yardımcı olur.",
                },
            ],
        },
        projectFallback: {
            title: "Alanya Yeni Yaşam Projesi",
            district: "Alanya",
            projectType: "Konut Projesi",
        },
    },
    en: {
        propertyTypes: [
            { value: "RESIDENTIAL", label: "Home" },
            { value: "LAND", label: "Land" },
            { value: "COMMERCIAL_CLUSTER", label: "Commercial" },
            { value: "VILLA", label: "Villa" },
        ],
        hero: {
            badge: "Alanya Sales & Investment Center",
            title: "Beautiful Projects",
            titleHighlight: "for a Beautiful",
            titleEnd: "City",
            subtitle:
                "A trusted real estate platform in Alanya since 2001. We are by your side with properties for sale, rent, and professional consultancy services.",
            stats: [
                { value: "300+", label: "Happy Clients" },
                { value: "20+", label: "Years of Experience" },
                { value: "150+", label: "Active Listings" },
            ],
            portfolioCta: "View Portfolio",
            sellCta: "Sell Your Property",
            portfolioSlideLabel: "Portfolio",
            projectSlideLabel: "Project",
            newProjectLabel: "New Project",
            featuredListingAlt: "Featured listing",
            featuredProjectAlt: "Featured project",
            projectDeliveryPrefix: "Delivery",
        },
        categories: {
            label: "Categories",
            title: "Property Types",
            all: "See All",
            items: [
                { type: "APARTMENT", label: "Home", image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400&h=280&fit=crop" },
                { type: "LAND", label: "Land", image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=400&h=280&fit=crop" },
                { type: "COMMERCIAL", label: "Commercial", image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400&h=280&fit=crop" },
                { type: "VILLA", label: "Villa", image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400&h=280&fit=crop" },
            ],
        },
        services: {
            label: "Our Services",
            title: "Why Güzel Invest?",
            items: [
                {
                    icon: "Handshake",
                    title: "Sale & Rental Properties",
                    description: "Reach your dream property with our portfolio of villas, apartments, land, and commercial properties.",
                },
                {
                    icon: "BarChart3",
                    title: "Investment Consultancy",
                    description: "Make the right decisions with location analysis, market data, and personalized investment strategies.",
                },
                {
                    icon: "CircleDollarSign",
                    title: "Property Acquisition",
                    description: "We offer solutions to your needs with apartments, land, and project-based property acquisition services.",
                },
                {
                    icon: "Globe",
                    title: "Citizenship Consultancy",
                    description: "We manage your Turkish citizenship application process end-to-end through real estate investment.",
                },
                {
                    icon: "Settings",
                    title: "Property Management",
                    description: "We professionally manage your property with rental, maintenance, dues tracking, and tenant management.",
                },
                {
                    icon: "ShieldCheck",
                    title: "Legal & Financial Support",
                    description: "We provide expert guidance in title deed procedures, tax consultancy, and legal processes.",
                },
            ],
        },
        highlights: {
            label: "Location Analysis",
            title: "Why Alanya?",
            description:
                "Alanya offers steady real estate value growth thanks to its strong tourism economy, year-round livability, and balanced international demand. It is a high-potential region for both residence and investment goals.",
            stats: [
                { value: "300+", label: "Sunny days/year" },
                { value: "25°C", label: "Average temperature" },
                { value: "8M+", label: "Tourists over" },
                { value: "110+", label: "Investor countries" },
            ],
            cta: "Learn More",
            imageAlt: "Alanya Panorama",
            roiLabel: "Investment Return",
        },
        testimonials: {
            label: "Client Stories",
            title: "What Clients Say",
            items: [
                {
                    name: "Ahmet & Elif Yılmaz",
                    type: "Villa · Kargicak",
                    quote: "We turned our dream into reality with Güzel Invest, and they were with us at every step.",
                    image: "/images/testimonials/testimonial-1.png",
                    video: null,
                },
                {
                    name: "Mehmet Karaca",
                    type: "Investment · Mahmutlar",
                    quote: "Their professional approach and market knowledge helped me make the right investment decision.",
                    image: "/images/testimonials/testimonial-2.png",
                    video: null,
                },
                {
                    name: "Demir Family",
                    type: "Home · Oba",
                    quote: "We found the home where our family can live in peace. Thank you to the whole team.",
                    image: "/images/testimonials/testimonial-3.png",
                    video: null,
                },
                {
                    name: "Canan & Emre Aksoy",
                    type: "Apartment · Tosmur",
                    quote: "They guided us step by step when buying our first home and never left any question unanswered.",
                    image: "/images/testimonials/testimonial-4.png",
                    video: null,
                },
                {
                    name: "Klaus Müller",
                    type: "Citizenship · Kestel",
                    quote: "We completed my Turkish citizenship process smoothly, and I am very happy with the property investment.",
                    image: "/images/testimonials/testimonial-5.png",
                    video: null,
                },
            ],
        },
        cta: {
            label: "Take Action",
            title: "Start Investing",
            titleHighlight: "Today",
            description: "Explore opportunities in Alanya and meet our expert team.",
            portfolio: "Explore Portfolio",
            contact: "Contact Us",
            sell: "Sell Your Property",
        },
        faq: {
            label: "FAQ",
            title: "Frequently Asked Questions",
            moreQuestions: "More Questions?",
            items: [
                {
                    question: "Can foreigners buy property in Turkey?",
                    answer: "Yes, citizens of many countries can purchase real estate in Turkey. You can acquire property outside military zones, and our team guides you through the entire process.",
                },
                {
                    question: "How long does the purchase process take?",
                    answer: "Title deed procedures are usually completed in 3-7 business days. Including document preparation and approvals, the process takes around 2-4 weeks.",
                },
                {
                    question: "Can I obtain Turkish citizenship through real estate investment?",
                    answer: "Yes, you can apply for Turkish citizenship by investing in real estate valued at 400,000 USD or more. The property must not be sold for 3 years.",
                },
                {
                    question: "Do you offer property management services?",
                    answer: "Yes, we professionally handle rental, maintenance, and dues tracking for the property you purchase.",
                },
                {
                    question: "Which payment methods do you accept?",
                    answer: "We accept bank transfer, EFT, and international transfers. We also have projects with installment plans.",
                },
                {
                    question: "Which areas are most popular in Alanya?",
                    answer: "Mahmutlar, Kargicak, Kestel, Oba, and Tosmur are among the most popular areas. Each district offers different advantages, and our team helps you choose the best fit.",
                },
            ],
        },
        projectFallback: {
            title: "New Life Project in Alanya",
            district: "Alanya",
            projectType: "Residential Project",
        },
    },
    ru: {
        propertyTypes: [
            { value: "RESIDENTIAL", label: "Жилье" },
            { value: "LAND", label: "Земля" },
            { value: "COMMERCIAL_CLUSTER", label: "Коммерческая" },
            { value: "VILLA", label: "Вилла" },
        ],
        hero: {
            badge: "Центр продаж и инвестиций в Аланье",
            title: "Красивые проекты для",
            titleHighlight: "красивого",
            titleEnd: "города",
            subtitle:
                "Надежная платформа недвижимости в Аланье с 2001 года. Мы рядом с вами с объектами на продажу, в аренду и профессиональными консультациями.",
            stats: [
                { value: "300+", label: "Довольных клиентов" },
                { value: "20+", label: "Лет опыта" },
                { value: "150+", label: "Активных объявлений" },
            ],
            portfolioCta: "Посмотреть портфель",
            sellCta: "Продать объект",
            portfolioSlideLabel: "Портфель",
            projectSlideLabel: "Проект",
            newProjectLabel: "Новый проект",
            featuredListingAlt: "Рекомендуемое объявление",
            featuredProjectAlt: "Рекомендуемый проект",
            projectDeliveryPrefix: "Сдача",
        },
        categories: {
            label: "Категории",
            title: "Типы недвижимости",
            all: "Смотреть все",
            items: [
                { type: "APARTMENT", label: "Жилье", image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400&h=280&fit=crop" },
                { type: "LAND", label: "Земля", image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=400&h=280&fit=crop" },
                { type: "COMMERCIAL", label: "Коммерческая", image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400&h=280&fit=crop" },
                { type: "VILLA", label: "Вилла", image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400&h=280&fit=crop" },
            ],
        },
        services: {
            label: "Наши услуги",
            title: "Почему Güzel Invest?",
            items: [
                {
                    icon: "Handshake",
                    title: "Продажа и аренда недвижимости",
                    description: "Найдите недвижимость мечты среди вилл, квартир, земельных и коммерческих объектов.",
                },
                {
                    icon: "BarChart3",
                    title: "Инвестиционные консультации",
                    description: "Принимайте правильные решения с анализом локаций, рыночными данными и персональными стратегиями.",
                },
                {
                    icon: "CircleDollarSign",
                    title: "Покупка недвижимости",
                    description: "Мы предлагаем решения под ваши задачи с квартирами, землей и проектной недвижимостью.",
                },
                {
                    icon: "Globe",
                    title: "Консультации по гражданству",
                    description: "Мы сопровождаем процесс подачи на турецкое гражданство через инвестиции в недвижимость от начала до конца.",
                },
                {
                    icon: "Settings",
                    title: "Управление недвижимостью",
                    description: "Профессионально управляем арендой, обслуживанием, взносами и отношениями с арендаторами.",
                },
                {
                    icon: "ShieldCheck",
                    title: "Юридическая и финансовая поддержка",
                    description: "Оказываем экспертную помощь по процедурам с титулом, налогам и правовым вопросам.",
                },
            ],
        },
        highlights: {
            label: "Анализ локации",
            title: "Почему Аланья?",
            description:
                "Аланья обеспечивает устойчивый рост стоимости недвижимости благодаря сильной туристической экономике, круглогодичному проживанию и международному спросу. Это регион с высоким потенциалом и для жизни, и для инвестиций.",
            stats: [
                { value: "300+", label: "Солнечных дней/год" },
                { value: "25°C", label: "Средняя температура" },
                { value: "8M+", label: "Туристов" },
                { value: "110+", label: "Стран инвесторов" },
            ],
            cta: "Узнать больше",
            imageAlt: "Панорама Аланьи",
            roiLabel: "Доходность инвестиций",
        },
        testimonials: {
            label: "Отзывы клиентов",
            title: "Что говорят клиенты",
            items: [
                {
                    name: "Ахмет и Элиф Йылмаз",
                    type: "Вилла · Карджык",
                    quote: "С Güzel Invest мы воплотили мечту в реальность, и они были с нами на каждом шаге.",
                    image: "/images/testimonials/testimonial-1.png",
                    video: null,
                },
                {
                    name: "Мехмет Караджа",
                    type: "Инвестиции · Махмутлар",
                    quote: "Их профессиональный подход и знание рынка помогли мне принять правильное инвестиционное решение.",
                    image: "/images/testimonials/testimonial-2.png",
                    video: null,
                },
                {
                    name: "Семья Демир",
                    type: "Жилье · Оба",
                    quote: "Мы нашли дом, в котором наша семья будет жить спокойно. Спасибо всей команде.",
                    image: "/images/testimonials/testimonial-3.png",
                    video: null,
                },
                {
                    name: "Канан и Эмре Аксуй",
                    type: "Квартира · Тосмур",
                    quote: "Они пошагово сопровождали нас при покупке первого дома и не оставили ни один вопрос без ответа.",
                    image: "/images/testimonials/testimonial-4.png",
                    video: null,
                },
                {
                    name: "Клаус Мюллер",
                    type: "Гражданство · Кестель",
                    quote: "Мы без проблем завершили процесс получения турецкого гражданства, и я очень доволен инвестициями в недвижимость.",
                    image: "/images/testimonials/testimonial-5.png",
                    video: null,
                },
            ],
        },
        cta: {
            label: "Действуйте",
            title: "Начните инвестировать",
            titleHighlight: "сегодня",
            description: "Откройте для себя возможности в Аланье и познакомьтесь с нашей экспертной командой.",
            portfolio: "Изучить портфель",
            contact: "Связаться",
            sell: "Продать объект",
        },
        faq: {
            label: "FAQ",
            title: "Часто задаваемые вопросы",
            moreQuestions: "Еще вопросы?",
            items: [
                {
                    question: "Могут ли иностранцы покупать недвижимость в Турции?",
                    answer: "Да, граждане многих стран могут покупать недвижимость в Турции. Вы можете приобретать объекты вне военных зон, а наша команда сопровождает весь процесс.",
                },
                {
                    question: "Сколько длится процесс покупки?",
                    answer: "Процедуры по титулу обычно завершаются за 3-7 рабочих дней. С учетом подготовки документов и согласований процесс занимает около 2-4 недель.",
                },
                {
                    question: "Можно ли получить турецкое гражданство через инвестиции в недвижимость?",
                    answer: "Да, вы можете подать на турецкое гражданство, инвестировав в недвижимость на сумму 400,000 USD или больше. Объект нельзя продавать 3 года.",
                },
                {
                    question: "Вы предлагаете управление недвижимостью?",
                    answer: "Да, мы профессионально управляем арендой, обслуживанием и взносами объекта, который вы покупаете.",
                },
                {
                    question: "Какие способы оплаты вы принимаете?",
                    answer: "Мы принимаем банковский перевод, EFT и международные переводы. Также есть проекты с рассрочкой.",
                },
                {
                    question: "Какие районы в Аланье наиболее популярны?",
                    answer: "Махмутлар, Карджык, Кестель, Оба и Тосмур входят в число самых популярных районов. У каждого района свои преимущества, и наша команда помогает выбрать лучший вариант.",
                },
            ],
        },
        projectFallback: {
            title: "Новый жилой проект в Аланье",
            district: "Аланья",
            projectType: "Жилой проект",
        },
    },
    de: {
        propertyTypes: [
            { value: "RESIDENTIAL", label: "Wohnen" },
            { value: "LAND", label: "Grundstück" },
            { value: "COMMERCIAL_CLUSTER", label: "Gewerbe" },
            { value: "VILLA", label: "Villa" },
        ],
        hero: {
            badge: "Verkaufs- & Investitionszentrum Alanya",
            title: "Schöne Projekte",
            titleHighlight: "für eine schöne",
            titleEnd: "Stadt",
            subtitle:
                "Eine vertrauenswürdige Immobilienplattform in Alanya seit 2001. Wir begleiten Sie mit Kauf-, Miet- und professionellen Beratungsleistungen.",
            stats: [
                { value: "300+", label: "Zufriedene Kunden" },
                { value: "20+", label: "Jahre Erfahrung" },
                { value: "150+", label: "Aktive Inserate" },
            ],
            portfolioCta: "Portfolio ansehen",
            sellCta: "Objekt verkaufen",
            portfolioSlideLabel: "Portfolio",
            projectSlideLabel: "Projekt",
            newProjectLabel: "Neues Projekt",
            featuredListingAlt: "Empfohlenes Inserat",
            featuredProjectAlt: "Empfohlenes Projekt",
            projectDeliveryPrefix: "Übergabe",
        },
        categories: {
            label: "Kategorien",
            title: "Immobilientypen",
            all: "Alle anzeigen",
            items: [
                { type: "APARTMENT", label: "Wohnen", image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400&h=280&fit=crop" },
                { type: "LAND", label: "Grundstück", image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=400&h=280&fit=crop" },
                { type: "COMMERCIAL", label: "Gewerbe", image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400&h=280&fit=crop" },
                { type: "VILLA", label: "Villa", image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400&h=280&fit=crop" },
            ],
        },
        services: {
            label: "Unsere Leistungen",
            title: "Warum Güzel Invest?",
            items: [
                {
                    icon: "Handshake",
                    title: "Verkauf & Vermietung",
                    description: "Finden Sie Ihre Traumimmobilie aus unserem Portfolio mit Villen, Wohnungen, Grundstücken und Gewerbeobjekten.",
                },
                {
                    icon: "BarChart3",
                    title: "Investitionsberatung",
                    description: "Treffen Sie die richtigen Entscheidungen mit Standortanalyse, Marktdaten und individuellen Strategien.",
                },
                {
                    icon: "CircleDollarSign",
                    title: "Immobilienerwerb",
                    description: "Wir bieten Lösungen für Wohnungen, Grundstücke und projektbezogene Immobilienkäufe.",
                },
                {
                    icon: "Globe",
                    title: "Staatsbürgerschaftsberatung",
                    description: "Wir begleiten Ihren Antrag auf türkische Staatsbürgerschaft durch Immobilieninvestitionen von Anfang bis Ende.",
                },
                {
                    icon: "Settings",
                    title: "Immobilienverwaltung",
                    description: "Wir verwalten Ihre Immobilie professionell mit Vermietung, Wartung, Nebenkosten und Mietermanagement.",
                },
                {
                    icon: "ShieldCheck",
                    title: "Rechtliche & finanzielle Unterstützung",
                    description: "Wir bieten fachkundige Beratung bei Grundbuchverfahren, Steuern und rechtlichen Abläufen.",
                },
            ],
        },
        highlights: {
            label: "Standortanalyse",
            title: "Warum Alanya?",
            description:
                "Alanya bietet dank starker Tourismuswirtschaft, ganzjähriger Lebensqualität und ausgewogener internationaler Nachfrage ein stabiles Wertwachstum im Immobilienmarkt. Die Region hat hohes Potenzial für Wohnen und Investition.",
            stats: [
                { value: "300+", label: "Sonnige Tage/Jahr" },
                { value: "25°C", label: "Durchschnittstemperatur" },
                { value: "8M+", label: "Touristen" },
                { value: "110+", label: "Investor-Länder" },
            ],
            cta: "Mehr erfahren",
            imageAlt: "Panorama von Alanya",
            roiLabel: "Investitionsrendite",
        },
        testimonials: {
            label: "Kundenerfahrungen",
            title: "Was Kunden sagen",
            items: [
                {
                    name: "Ahmet & Elif Yılmaz",
                    type: "Villa · Kargicak",
                    quote: "Mit Güzel Invest haben wir unseren Traum Wirklichkeit werden lassen, und sie waren bei jedem Schritt an unserer Seite.",
                    image: "/images/testimonials/testimonial-1.png",
                    video: null,
                },
                {
                    name: "Mehmet Karaca",
                    type: "Investment · Mahmutlar",
                    quote: "Ihre professionelle Herangehensweise und Marktkenntnis halfen mir, die richtige Investitionsentscheidung zu treffen.",
                    image: "/images/testimonials/testimonial-2.png",
                    video: null,
                },
                {
                    name: "Familie Demir",
                    type: "Wohnen · Oba",
                    quote: "Wir haben das Zuhause gefunden, in dem unsere Familie in Ruhe leben kann. Danke an das ganze Team.",
                    image: "/images/testimonials/testimonial-3.png",
                    video: null,
                },
                {
                    name: "Canan & Emre Aksoy",
                    type: "Wohnung · Tosmur",
                    quote: "Sie haben uns beim Kauf unseres ersten Hauses Schritt für Schritt begleitet und keine Frage offen gelassen.",
                    image: "/images/testimonials/testimonial-4.png",
                    video: null,
                },
                {
                    name: "Klaus Müller",
                    type: "Staatsbürgerschaft · Kestel",
                    quote: "Wir haben meinen türkischen Staatsbürgerschaftsprozess reibungslos abgeschlossen und ich bin mit der Immobilieninvestition sehr zufrieden.",
                    image: "/images/testimonials/testimonial-5.png",
                    video: null,
                },
            ],
        },
        cta: {
            label: "Jetzt aktiv werden",
            title: "Beginnen Sie",
            titleHighlight: "heute",
            description: "Entdecken Sie die Chancen in Alanya und lernen Sie unser Expertenteam kennen.",
            portfolio: "Portfolio entdecken",
            contact: "Kontakt aufnehmen",
            sell: "Objekt verkaufen",
        },
        faq: {
            label: "FAQ",
            title: "Häufig gestellte Fragen",
            moreQuestions: "Weitere Fragen?",
            items: [
                {
                    question: "Können Ausländer in der Türkei Immobilien kaufen?",
                    answer: "Ja, Staatsbürger vieler Länder können in der Türkei Immobilien erwerben. Außerhalb militärischer Zonen ist der Erwerb möglich, und unser Team begleitet Sie durch den gesamten Prozess.",
                },
                {
                    question: "Wie lange dauert der Kaufprozess?",
                    answer: "Grundbuchverfahren werden in der Regel innerhalb von 3-7 Werktagen abgeschlossen. Mit Dokumentenvorbereitung und Genehmigungen dauert es etwa 2-4 Wochen.",
                },
                {
                    question: "Kann ich über Immobilieninvestitionen die türkische Staatsbürgerschaft erhalten?",
                    answer: "Ja, Sie können die türkische Staatsbürgerschaft beantragen, wenn Sie in Immobilien im Wert von 400.000 USD oder mehr investieren. Die Immobilie darf 3 Jahre lang nicht verkauft werden.",
                },
                {
                    question: "Bieten Sie Immobilienverwaltung an?",
                    answer: "Ja, wir übernehmen professionell Vermietung, Wartung und Nebenkostenverwaltung für Ihre Immobilie.",
                },
                {
                    question: "Welche Zahlungsmethoden akzeptieren Sie?",
                    answer: "Wir akzeptieren Banküberweisung, EFT und internationale Überweisungen. Es gibt auch Projekte mit Ratenzahlung.",
                },
                {
                    question: "Welche Gegenden in Alanya sind am beliebtesten?",
                    answer: "Mahmutlar, Kargicak, Kestel, Oba und Tosmur gehören zu den beliebtesten Gegenden. Jede Region hat eigene Vorteile, und unser Team hilft Ihnen bei der Auswahl.",
                },
            ],
        },
        projectFallback: {
            title: "Neues Wohnprojekt in Alanya",
            district: "Alanya",
            projectType: "Wohnprojekt",
        },
    },
};

const articlesCopyMap: Record<PublicLocale, ArticlesCopy> = {
    tr: {
        label: "Blog",
        title: "Son Makaleler",
        allArticles: "Tüm Makaleleri Gör",
        readMore: "Devamını Oku",
        excerptFallback: "Makale özeti yakında eklenecek.",
    },
    en: {
        label: "Blog",
        title: "Latest Articles",
        allArticles: "View All Articles",
        readMore: "Read More",
        excerptFallback: "Article summary coming soon.",
    },
    ru: {
        label: "Блог",
        title: "Последние статьи",
        allArticles: "Смотреть все статьи",
        readMore: "Читать далее",
        excerptFallback: "Краткое описание статьи скоро будет добавлено.",
    },
    de: {
        label: "Blog",
        title: "Neueste Artikel",
        allArticles: "Alle Artikel ansehen",
        readMore: "Weiterlesen",
        excerptFallback: "Die Zusammenfassung des Artikels folgt in Kürze.",
    },
};

const portfolioCopyMap: Record<PublicLocale, PortfolioCopy> = {
    tr: {
        saleTypes: { sale: "Satılık", rent: "Kiralık" },
        sortOptions: {
            newest: "En Yeni",
            priceAsc: "Fiyat (Artan)",
            priceDesc: "Fiyat (Azalan)",
            areaDesc: "m² (Büyükten Küçüğe)",
        },
        filters: {
            clear: "Temizle",
            categories: "Kategori",
            allCategories: "Tüm kategoriler",
            selectedCategories: (count) => `${count} seçim aktif`,
            allCities: "Tüm İller",
            allDistricts: "Tüm İlçeler",
            allNeighborhoods: "Tüm Mahalleler",
            cityPlaceholder: "İl seçin",
            districtPlaceholder: "İlçe seçin",
            neighborhoodPlaceholder: "Mahalle seçin",
            saleType: "Satış Tipi",
            location: "Konum",
            priceRange: "Fiyat Aralığı",
            areaRange: "m² Aralığı",
            zoningStatus: "İmar Durumu",
            zoningAll: "İmar Durumu (Tümü)",
            zoningPlaceholder: "İmar durumu seçin",
            parcelNoPlaceholder: "Ada / Parsel",
            emsal: "Emsal",
            commercial: "Ticari Detaylar",
            landDetails: "Arsa Detayları",
            farmDetails: "Çiftlik Detayları",
            roomCount: "Oda Sayısı",
            waterSource: "Su Kaynağı Olanlar",
            fruitTrees: "Meyve Ağacı Olanlar",
            min: "Min",
            max: "Max",
            allListings: "Tüm İlanlar",
        },
        labels: {
            citizenship: "Vatandaşlık",
            residence: "İkamet",
            project: "Proje",
            noLocation: "Konum belirtilmedi",
            missingTitle: "Başlık belirtilmedi",
            missingDescription: "Açıklama bulunamadı.",
            noImage: "Görsel yok",
            viewAll: "Hepsini Gör",
            inspect: "İncele",
            inspectProject: "Projeyi İncele",
            continueReading: "Devamını oku",
            loading: "Yükleniyor...",
            totalResults: "Toplam sonuç",
            loadingListings: "İlanlar yükleniyor...",
            noResults: "Aradığınız kriterlere uygun ilan bulunamadı.",
            otherListings: "Diğer İlanlar",
            map: "Harita",
            filter: "Filtre",
            sort: "Sırala",
            backToPortfolio: "Portföye Dön",
            mapNoCoordinates: "Haritada gösterilecek koordinatlı ilan bulunamadı.",
            mapOpen: "Harita",
            mapClose: "Kapat",
            listCardClose: "İlan kartını kapat",
            drawerClose: "Çekmeceyi kapat",
            cardClose: "Kapat",
        },
        errors: {
            loadListings: "İlanlar alınamadı.",
            refreshListings: "İlanlar yenilenirken bir hata oluştu.",
            loadListingsNetwork: "İlanlar yüklenirken bağlantı kesildi (Load failed). İnternet/proxy bağlantınızı kontrol edip tekrar deneyin.",
            refreshListingsNetwork: "İlanlar yenilenirken bağlantı kesildi (Load failed). İnternet/proxy bağlantınızı kontrol edip tekrar deneyin.",
        },
        statuses: {
            DRAFT: "Taslak",
            PUBLISHED: "Yayında",
            REMOVED: "Kaldırıldı",
            ARCHIVED: "Arşiv",
        },
        sections: {
            listingType: "Satış Tipi",
            propertyType: "Mülk Tipi",
            price: "Fiyat Aralığı",
            location: "Konum",
            landDetails: "Arsa Detayları",
            commercialDetails: "Ticari Detaylar",
            farmDetails: "Çiftlik Detayları",
            rooms: "Oda Sayısı",
            emsal: "Emsal",
            floor: "Kat",
            bathrooms: "Banyo",
            area: "m²",
            projectFeatures: "Proje Özellikleri",
        },
        aria: {
            previousImage: "Önceki görsel",
            nextImage: "Sonraki görsel",
            closeDrawer: "Çekmeceyi kapat",
            closeListingCard: "İlan kartını kapat",
        },
    },
    en: {
        saleTypes: { sale: "For Sale", rent: "For Rent" },
        sortOptions: {
            newest: "Newest",
            priceAsc: "Price (Low to High)",
            priceDesc: "Price (High to Low)",
            areaDesc: "m² (Largest to Smallest)",
        },
        filters: {
            clear: "Clear",
            categories: "Category",
            allCategories: "All categories",
            selectedCategories: (count) => `${count} selected`,
            allCities: "All Cities",
            allDistricts: "All Districts",
            allNeighborhoods: "All Neighborhoods",
            cityPlaceholder: "Choose city",
            districtPlaceholder: "Choose district",
            neighborhoodPlaceholder: "Choose neighborhood",
            saleType: "Sale Type",
            location: "Location",
            priceRange: "Price Range",
            areaRange: "m² Range",
            zoningStatus: "Zoning Status",
            zoningAll: "Zoning Status (All)",
            zoningPlaceholder: "Choose zoning status",
            parcelNoPlaceholder: "Block / Parcel",
            emsal: "Emsal",
            commercial: "Commercial Details",
            landDetails: "Land Details",
            farmDetails: "Farm Details",
            roomCount: "Room Count",
            waterSource: "Properties with Water Source",
            fruitTrees: "Properties with Fruit Trees",
            min: "Min",
            max: "Max",
            allListings: "All Listings",
        },
        labels: {
            citizenship: "Citizenship",
            residence: "Residence",
            project: "Project",
            noLocation: "Location not specified",
            missingTitle: "Title not specified",
            missingDescription: "Description not available.",
            noImage: "No image",
            viewAll: "View All",
            inspect: "Inspect",
            inspectProject: "Inspect Project",
            continueReading: "Continue reading",
            loading: "Loading...",
            totalResults: "Total results",
            loadingListings: "Loading listings...",
            noResults: "No listings matched your criteria.",
            otherListings: "Other Listings",
            map: "Map",
            filter: "Filter",
            sort: "Sort",
            backToPortfolio: "Back to Portfolio",
            mapNoCoordinates: "No listings with coordinates found for the map.",
            mapOpen: "Map",
            mapClose: "Close",
            listCardClose: "Close listing card",
            drawerClose: "Close drawer",
            cardClose: "Close",
        },
        errors: {
            loadListings: "Listings could not be loaded.",
            refreshListings: "An error occurred while refreshing listings.",
            loadListingsNetwork: "Listings could not be loaded because the connection was interrupted (Load failed). Check your internet/proxy connection and try again.",
            refreshListingsNetwork: "Listings could not be refreshed because the connection was interrupted (Load failed). Check your internet/proxy connection and try again.",
        },
        statuses: {
            DRAFT: "Draft",
            PUBLISHED: "Published",
            REMOVED: "Removed",
            ARCHIVED: "Archived",
        },
        sections: {
            listingType: "Sale Type",
            propertyType: "Property Type",
            price: "Price Range",
            location: "Location",
            landDetails: "Land Details",
            commercialDetails: "Commercial Details",
            farmDetails: "Farm Details",
            rooms: "Room Count",
            emsal: "Emsal",
            floor: "Floor",
            bathrooms: "Bathroom",
            area: "m²",
            projectFeatures: "Project Features",
        },
        aria: {
            previousImage: "Previous image",
            nextImage: "Next image",
            closeDrawer: "Close drawer",
            closeListingCard: "Close listing card",
        },
    },
    ru: {
        saleTypes: { sale: "Продажа", rent: "Аренда" },
        sortOptions: {
            newest: "Сначала новые",
            priceAsc: "Цена (по возрастанию)",
            priceDesc: "Цена (по убыванию)",
            areaDesc: "m² (от большего к меньшему)",
        },
        filters: {
            clear: "Сбросить",
            categories: "Категория",
            allCategories: "Все категории",
            selectedCategories: (count) => `${count} выбрано`,
            allCities: "Все города",
            allDistricts: "Все районы",
            allNeighborhoods: "Все кварталы",
            cityPlaceholder: "Выберите город",
            districtPlaceholder: "Выберите район",
            neighborhoodPlaceholder: "Выберите квартал",
            saleType: "Тип сделки",
            location: "Расположение",
            priceRange: "Диапазон цен",
            areaRange: "Диапазон m²",
            zoningStatus: "Зонирование",
            zoningAll: "Зонирование (все)",
            zoningPlaceholder: "Выберите зонирование",
            parcelNoPlaceholder: "Квартал / участок",
            emsal: "Эмсал",
            commercial: "Коммерческие детали",
            landDetails: "Детали участка",
            farmDetails: "Детали фермы",
            roomCount: "Количество комнат",
            waterSource: "Есть источник воды",
            fruitTrees: "Есть плодовые деревья",
            min: "Мин",
            max: "Макс",
            allListings: "Все объявления",
        },
        labels: {
            citizenship: "Гражданство",
            residence: "Вид на жительство",
            project: "Проект",
            noLocation: "Местоположение не указано",
            missingTitle: "Название не указано",
            missingDescription: "Описание недоступно.",
            noImage: "Нет изображения",
            viewAll: "Показать все",
            inspect: "Смотреть",
            inspectProject: "Смотреть проект",
            continueReading: "Читать далее",
            loading: "Загрузка...",
            totalResults: "Всего результатов",
            loadingListings: "Загрузка объявлений...",
            noResults: "По вашему запросу ничего не найдено.",
            otherListings: "Другие объявления",
            map: "Карта",
            filter: "Фильтр",
            sort: "Сортировка",
            backToPortfolio: "Вернуться к портфолио",
            mapNoCoordinates: "Для карты не найдено объектов с координатами.",
            mapOpen: "Карта",
            mapClose: "Закрыть",
            listCardClose: "Закрыть карточку",
            drawerClose: "Закрыть панель",
            cardClose: "Закрыть",
        },
        errors: {
            loadListings: "Не удалось загрузить объявления.",
            refreshListings: "Произошла ошибка при обновлении объявлений.",
            loadListingsNetwork: "Не удалось загрузить объявления из-за разрыва соединения (Load failed). Проверьте интернет/прокси и попробуйте снова.",
            refreshListingsNetwork: "Не удалось обновить объявления из-за разрыва соединения (Load failed). Проверьте интернет/прокси и попробуйте снова.",
        },
        statuses: {
            DRAFT: "Черновик",
            PUBLISHED: "Опубликовано",
            REMOVED: "Удалено",
            ARCHIVED: "Архив",
        },
        sections: {
            listingType: "Тип сделки",
            propertyType: "Тип недвижимости",
            price: "Диапазон цен",
            location: "Расположение",
            landDetails: "Детали участка",
            commercialDetails: "Коммерческие детали",
            farmDetails: "Детали фермы",
            rooms: "Количество комнат",
            emsal: "Эмсал",
            floor: "Этаж",
            bathrooms: "Ванная",
            area: "m²",
            projectFeatures: "Особенности проекта",
        },
        aria: {
            previousImage: "Предыдущее изображение",
            nextImage: "Следующее изображение",
            closeDrawer: "Закрыть панель",
            closeListingCard: "Закрыть карточку объявления",
        },
    },
    de: {
        saleTypes: { sale: "Verkauf", rent: "Miete" },
        sortOptions: {
            newest: "Neueste",
            priceAsc: "Preis (aufsteigend)",
            priceDesc: "Preis (absteigend)",
            areaDesc: "m² (größte zuerst)",
        },
        filters: {
            clear: "Zurücksetzen",
            categories: "Kategorie",
            allCategories: "Alle Kategorien",
            selectedCategories: (count) => `${count} ausgewählt`,
            allCities: "Alle Städte",
            allDistricts: "Alle Bezirke",
            allNeighborhoods: "Alle Stadtteile",
            cityPlaceholder: "Stadt wählen",
            districtPlaceholder: "Bezirk wählen",
            neighborhoodPlaceholder: "Stadtteil wählen",
            saleType: "Verkaufsart",
            location: "Ort",
            priceRange: "Preisbereich",
            areaRange: "m²-Bereich",
            zoningStatus: "Bauzonenstatus",
            zoningAll: "Bauzonenstatus (Alle)",
            zoningPlaceholder: "Bauzonenstatus wählen",
            parcelNoPlaceholder: "Block / Parzelle",
            emsal: "Emsal",
            commercial: "Gewerbedetails",
            landDetails: "Grundstücksdetails",
            farmDetails: "Farmdetails",
            roomCount: "Zimmeranzahl",
            waterSource: "Mit Wasserquelle",
            fruitTrees: "Mit Obstbäumen",
            min: "Min",
            max: "Max",
            allListings: "Alle Anzeigen",
        },
        labels: {
            citizenship: "Staatsbürgerschaft",
            residence: "Aufenthalt",
            project: "Projekt",
            noLocation: "Ort nicht angegeben",
            missingTitle: "Titel nicht angegeben",
            missingDescription: "Beschreibung nicht verfügbar.",
            noImage: "Kein Bild",
            viewAll: "Alle anzeigen",
            inspect: "Ansehen",
            inspectProject: "Projekt ansehen",
            continueReading: "Weiterlesen",
            loading: "Wird geladen...",
            totalResults: "Gesamtergebnisse",
            loadingListings: "Anzeigen werden geladen...",
            noResults: "Keine Anzeigen entsprechen Ihren Kriterien.",
            otherListings: "Weitere Anzeigen",
            map: "Karte",
            filter: "Filter",
            sort: "Sortieren",
            backToPortfolio: "Zurück zum Portfolio",
            mapNoCoordinates: "Keine Anzeigen mit Koordinaten für die Karte gefunden.",
            mapOpen: "Karte",
            mapClose: "Schließen",
            listCardClose: "Kartenansicht schließen",
            drawerClose: "Seitenleiste schließen",
            cardClose: "Schließen",
        },
        errors: {
            loadListings: "Anzeigen konnten nicht geladen werden.",
            refreshListings: "Beim Aktualisieren der Anzeigen ist ein Fehler aufgetreten.",
            loadListingsNetwork: "Anzeigen konnten wegen einer unterbrochenen Verbindung nicht geladen werden (Load failed). Bitte Internet/Proxy prüfen und erneut versuchen.",
            refreshListingsNetwork: "Anzeigen konnten wegen einer unterbrochenen Verbindung nicht aktualisiert werden (Load failed). Bitte Internet/Proxy prüfen und erneut versuchen.",
        },
        statuses: {
            DRAFT: "Entwurf",
            PUBLISHED: "Veröffentlicht",
            REMOVED: "Entfernt",
            ARCHIVED: "Archiv",
        },
        sections: {
            listingType: "Verkaufsart",
            propertyType: "Immobilientyp",
            price: "Preisbereich",
            location: "Ort",
            landDetails: "Grundstücksdetails",
            commercialDetails: "Gewerbedetails",
            farmDetails: "Farmdetails",
            rooms: "Zimmeranzahl",
            emsal: "Emsal",
            floor: "Etage",
            bathrooms: "Bad",
            area: "m²",
            projectFeatures: "Projektmerkmale",
        },
        aria: {
            previousImage: "Vorheriges Bild",
            nextImage: "Nächstes Bild",
            closeDrawer: "Seitenleiste schließen",
            closeListingCard: "Anzeigenkarte schließen",
        },
    },
};

export function resolvePublicLocale(locale: string): PublicLocale {
    const normalized = normalizeLocaleTag(locale);
    if (normalized === "en" || normalized === "ru" || normalized === "de") {
        return normalized;
    }
    return "tr";
}

export function getHomepageCopy(locale: string): HomepageCopy {
    return homepageCopyMap[resolvePublicLocale(locale)];
}

export function getArticlesCopy(locale: string): ArticlesCopy {
    return articlesCopyMap[resolvePublicLocale(locale)];
}

export function getPortfolioCopy(locale: string): PortfolioCopy {
    return portfolioCopyMap[resolvePublicLocale(locale)];
}
