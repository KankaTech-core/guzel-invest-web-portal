import type { PublicLocale } from "../copy-utils";

export type AboutCopy = {
    heroBadge: string;
    heroTitle: string;
    heroText: string;
    statsTitle: string;
    stats: Array<{ label: string; value: string }>;
    storyEyebrow: string;
    storyTitle: string;
    storyParagraphs: [string, string, string];
    storyCounters: Array<{ label: string; value: string }>;
    whyUsTitle: string;
    whyUsText: string;
    whyUsPoints: string[];
    servicesEyebrow: string;
    servicesTitle: string;
    servicePrimaryCta: string;
    serviceSecondaryCta: string;
    services: Array<{
        title: string;
        description: string;
        bullets: string[];
        image: string;
        dark: boolean;
    }>;
    teamTitle: string;
    teamText: string;
    teamMembers: Array<{ name: string; role: string; image: string; imagePosition?: string }>;
    missionTitle: string;
    missionText: string;
    visionTitle: string;
    visionText: string;
    ctaBadge: string;
    ctaTitle: string;
    ctaText: string;
    ctaPrimary: string;
    ctaSecondary: string;
};

const aboutCopy: Record<PublicLocale, AboutCopy> = {
    tr: {
        heroBadge: "Güzel Invest • 30 Yıllık Deneyim",
        heroTitle: "Hakkımızda",
        heroText:
            "Güzel Invest, Antalya'nın en önemli yatırım merkezlerinden biri olan Alanya'da faaliyet gösteren, güçlü geçmişi ve uluslararası vizyonu ile gayrimenkul sektöründe güvenilir bir marka olarak konumlanmıştır.",
        statsTitle: "İstatistikler",
        stats: [
            { label: "Deneyim", value: "30+ Yıl" },
            { label: "Başarılı Proje", value: "28" },
            { label: "Geliştirme ve İnşaat", value: "7 Proje" },
            { label: "Yatırım Merkezi", value: "Alanya" },
            { label: "İş Ortağı", value: "Güvenilir" },
        ],
        storyEyebrow: "Kurumsal Profil",
        storyTitle: "30 Yıllık Deneyim, Güçlü Projeler ve Güvenilir Yatırımlar.",
        storyParagraphs: [
            "Güzel Invest, Antalya'nın en önemli yatırım merkezlerinden biri olan Alanya'da faaliyet gösteren, güçlü geçmişi ve uluslararası vizyonu ile gayrimenkul sektöründe güvenilir bir marka olarak konumlanmıştır.",
            "Şirketimiz, kurucumuz Yusuf Güzel'in 30 yılı aşkın sektör tecrübesi ve bilgi birikimi üzerine inşa edilmiştir.",
            "Kurulduğumuz günden bu yana amacımız yalnızca gayrimenkul satışı yapmak değil; yatırımcılarımıza doğru lokasyonlarda, yüksek değer potansiyeline sahip ve sürdürülebilir kazanç sağlayan projeler sunmaktır.",
        ],
        storyCounters: [
            { label: "Tamamlanan Projeler", value: "28 başarılı proje" },
            { label: "Geliştirme ve İnşaat Süreci", value: "7 farklı proje" },
        ],
        whyUsTitle: "Neden Biz?",
        whyUsText:
            "Güzel Invest aynı zamanda alanında uzman, deneyimli ve profesyonel gayrimenkul danışmanlarından oluşan güçlü bir ekibe sahiptir. Ekibimiz, yatırımcılarımızın ihtiyaçlarını doğru analiz ederek en uygun gayrimenkul seçeneklerini sunmakta ve sürecin her aşamasında profesyonel danışmanlık sağlamaktadır.",
        whyUsPoints: ["Şeffaflık", "Uluslararası vizyon", "Geniş portföy", "Profesyonel hizmet"],
        servicesEyebrow: "Hizmetlerimiz",
        servicesTitle: "Neden Güzel Invest? Hizmetlerimizi Yakından Tanıyın",
        servicePrimaryCta: "Detaylı Bilgi Al",
        serviceSecondaryCta: "Portföyü İncele",
        services: [
            {
                title: "Satılık & Kiralık Gayrimenkul",
                description:
                    "Villa, daire, arsa ve ticari mülk portföyümüzü net fiyat analiziyle sunuyoruz. Her portföy kaydı, lokasyon avantajı ve getiri potansiyeli ile birlikte değerlendirilir.",
                bullets: ["Güncel ve doğrulanmış portföy listesi", "Bölge bazlı fiyat karşılaştırması", "İhtiyaca göre kısa listeleme süreci"],
                image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1400&h=900&fit=crop",
                dark: false,
            },
            {
                title: "Yatırım Danışmanlığı",
                description:
                    "Yatırım kararlarını yalnızca sezgiyle değil, veriye dayalı modellemeyle şekillendiriyoruz. Bölgesel değer artışı, kira çarpanı ve çıkış senaryolarını birlikte planlıyoruz.",
                bullets: ["Lokasyon ve segment bazlı yatırım raporu", "Risk-getiri dengesine göre alternatif planlar", "Orta ve uzun vadeli portföy stratejisi"],
                image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1400&h=900&fit=crop",
                dark: true,
            },
            {
                title: "Mülk Satın Alma",
                description:
                    "Satın alma sürecinde teklif, pazarlık, ekspertiz ve tapu adımlarını tek bir operasyon akışında yönetiyoruz. Zaman kaybını azaltıp süreci kontrollü şekilde tamamlıyoruz.",
                bullets: ["Ekspertiz ve değer doğrulama", "Müzakere ve sözleşme yönetimi", "Tapu sürecinde uçtan uca takip"],
                image: "https://images.unsplash.com/photo-1554995207-c18c203602cb?w=1400&h=900&fit=crop",
                dark: false,
            },
            {
                title: "Vatandaşlık Danışmanlığı",
                description:
                    "Gayrimenkul yatırımıyla vatandaşlık hedefleyen müşteriler için uygun portföy seçiminden resmi başvuru adımlarına kadar tüm süreci şeffaf şekilde koordine ediyoruz.",
                bullets: ["Uygun mülk eşleştirmesi ve dosya hazırlığı", "Resmi prosedürlerde koordineli takip", "Süreç boyunca düzenli durum raporlaması"],
                image: "https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?w=1400&h=900&fit=crop",
                dark: true,
            },
            {
                title: "Mülk Yönetimi",
                description:
                    "Satın alma sonrası kiralama, bakım ve kiracı iletişimi dahil tüm operasyonel süreçleri profesyonel ekiplerle yönetiyoruz. Böylece mülkünüz sürekli değer üreten bir varlığa dönüşür.",
                bullets: ["Kiralama ve kira tahsilat süreci", "Bakım, onarım ve aidat koordinasyonu", "Kiracı iletişimi ve raporlama"],
                image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1400&h=900&fit=crop",
                dark: false,
            },
            {
                title: "Hukuki & Mali Destek",
                description:
                    "Gayrimenkul işlemlerinde hukuki güvence ve mali doğruluk en kritik başlıklardır. Uzman ağımızla sözleşme, vergi ve resmi işlemleri güvenli zeminde ilerletiyoruz.",
                bullets: ["Sözleşme ve tapu evrak kontrolü", "Vergi, harç ve mali yükümlülük takibi", "Satış sonrası hukuki danışmanlık"],
                image: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=1400&h=900&fit=crop",
                dark: true,
            },
        ],
        teamTitle: "Ekibimiz",
        teamText:
            "Ekibimiz, yatırımcılarımızın ihtiyaçlarını doğru analiz ederek en uygun gayrimenkul seçeneklerini sunmakta ve sürecin her aşamasında profesyonel danışmanlık sağlamaktadır.",
        teamMembers: [
            { name: "Deniz Yılmaz", role: "Gayrimenkul Danışmanı", image: "/images/about-us/deniz-yilmaz-profile.webp", imagePosition: "center 40%" },
            { name: "Hatice Çoban", role: "Gayrimenkul Danışmanı", image: "/images/about-us/hatice-coban-profile.webp", imagePosition: "center 40%" },
            { name: "Ahmet Bilen", role: "Gayrimenkul Danışmanı", image: "/images/about-us/ahmet-bilen-profile.webp" },
            { name: "Gürkan Kara", role: "Gayrimenkul Danışmanı", image: "/images/about-us/gurkan-kara-profile.webp" },
        ],
        missionTitle: "Misyonumuz",
        missionText:
            "Yatırımcılarımıza doğru lokasyonlarda, yüksek değer potansiyeline sahip projeler sunarak şeffaf, güvenilir ve profesyonel hizmet anlayışı ile uzun vadeli değer yaratmak.",
        visionTitle: "Vizyonumuz",
        visionText:
            "Gayrimenkul sektöründe kalite, güven ve sürdürülebilir yatırım anlayışı ile uluslararası yatırımcıların tercih ettiği lider markalardan biri olmak.",
        ctaBadge: "Güzel Invest",
        ctaTitle: "Şeffaflık, güven ve profesyonel hizmet anlayışımız ile yatırımcılarımız için güvenilir bir iş ortağı olmaya devam ediyoruz.",
        ctaText:
            "Yatırımcılarımıza doğru lokasyonlarda, yüksek değer potansiyeline sahip projeler sunarak şeffaf, güvenilir ve profesyonel hizmet anlayışı ile uzun vadeli değer yaratmak.",
        ctaPrimary: "Ücretsiz Ön Görüşme Al",
        ctaSecondary: "Güncel Portföyü İncele",
    },
    en: {
        heroBadge: "Güzel Invest • 30 Years of Experience",
        heroTitle: "About Us",
        heroText:
            "Güzel Invest operates in Alanya, one of Antalya's most important investment hubs, and is positioned as a trusted real estate brand with a strong history and an international vision.",
        statsTitle: "Statistics",
        stats: [
            { label: "Experience", value: "30+ Years" },
            { label: "Successful Projects", value: "28" },
            { label: "Development and Construction", value: "7 Projects" },
            { label: "Investment Hub", value: "Alanya" },
            { label: "Partner", value: "Trusted" },
        ],
        storyEyebrow: "Corporate Profile",
        storyTitle: "30 Years of Experience, Strong Projects, and Reliable Investments.",
        storyParagraphs: [
            "Güzel Invest operates in Alanya, one of Antalya's most important investment hubs, and is positioned as a trusted real estate brand with a strong history and an international vision.",
            "Our company was built on the more than 30 years of industry experience and knowledge of our founder, Yusuf Güzel.",
            "Since day one, our goal has been more than selling real estate. We aim to deliver projects in the right locations with high value potential and sustainable returns for investors.",
        ],
        storyCounters: [
            { label: "Completed Projects", value: "28 successful projects" },
            { label: "Development and Construction Process", value: "7 different projects" },
        ],
        whyUsTitle: "Why Us?",
        whyUsText:
            "Güzel Invest also has a strong team of expert, experienced, and professional real estate consultants. Our team accurately analyzes investor needs, presents the most suitable property options, and provides professional guidance at every stage.",
        whyUsPoints: ["Transparency", "International vision", "Wide portfolio", "Professional service"],
        servicesEyebrow: "Our Services",
        servicesTitle: "Why Güzel Invest? Get to Know Our Services Up Close",
        servicePrimaryCta: "Get More Details",
        serviceSecondaryCta: "Browse Portfolio",
        services: [
            {
                title: "Sales & Rental Properties",
                description:
                    "We present our portfolio of villas, apartments, land, and commercial properties with clear price analysis. Each listing is evaluated together with location advantages and return potential.",
                bullets: ["Up-to-date and verified portfolio list", "Area-based price comparison", "Shortlisting based on needs"],
                image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1400&h=900&fit=crop",
                dark: false,
            },
            {
                title: "Investment Consultancy",
                description:
                    "We shape investment decisions not only by intuition but with data-driven modeling. Regional value growth, rental multiples, and exit scenarios are planned together.",
                bullets: ["Location and segment-based investment report", "Alternative plans based on risk-return balance", "Mid- and long-term portfolio strategy"],
                image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1400&h=900&fit=crop",
                dark: true,
            },
            {
                title: "Property Acquisition",
                description:
                    "During the purchase process, we manage offers, negotiation, appraisal, and title deed steps in one operational flow. We reduce delays and complete the process in a controlled way.",
                bullets: ["Appraisal and value verification", "Negotiation and contract management", "End-to-end title deed tracking"],
                image: "https://images.unsplash.com/photo-1554995207-c18c203602cb?w=1400&h=900&fit=crop",
                dark: false,
            },
            {
                title: "Citizenship Consultancy",
                description:
                    "For clients seeking citizenship through real estate investment, we coordinate the full process transparently, from suitable portfolio selection to the official application steps.",
                bullets: ["Matching the right property and preparing the file", "Coordinated tracking of official procedures", "Regular progress updates"],
                image: "https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?w=1400&h=900&fit=crop",
                dark: true,
            },
            {
                title: "Property Management",
                description:
                    "We manage all operational processes after purchase, including rental, maintenance, and tenant communication, with professional teams. This turns your property into a continuously value-producing asset.",
                bullets: ["Rental and rent collection flow", "Maintenance, repair, and dues coordination", "Tenant communication and reporting"],
                image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1400&h=900&fit=crop",
                dark: false,
            },
            {
                title: "Legal & Financial Support",
                description:
                    "In real estate transactions, legal security and financial accuracy are the most critical topics. Our expert network keeps contracts, taxes, and official procedures on a safe track.",
                bullets: ["Contract and title deed document review", "Tax, fee, and financial obligation tracking", "Post-sale legal consultancy"],
                image: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=1400&h=900&fit=crop",
                dark: true,
            },
        ],
        teamTitle: "Our Team",
        teamText:
            "Our team accurately analyzes investor needs, presents the most suitable property options, and provides professional guidance at every stage.",
        teamMembers: [
            { name: "Deniz Yılmaz", role: "Real Estate Consultant", image: "/images/about-us/deniz-yilmaz-profile.webp", imagePosition: "center 40%" },
            { name: "Hatice Çoban", role: "Real Estate Consultant", image: "/images/about-us/hatice-coban-profile.webp", imagePosition: "center 40%" },
            { name: "Ahmet Bilen", role: "Real Estate Consultant", image: "/images/about-us/ahmet-bilen-profile.webp" },
            { name: "Gürkan Kara", role: "Real Estate Consultant", image: "/images/about-us/gurkan-kara-profile.webp" },
        ],
        missionTitle: "Our Mission",
        missionText:
            "To create long-term value by offering our investors projects in the right locations with high value potential, through a transparent, reliable, and professional service mindset.",
        visionTitle: "Our Vision",
        visionText:
            "To become one of the leading brands preferred by international investors with a real estate approach built on quality, trust, and sustainable investment.",
        ctaBadge: "Güzel Invest",
        ctaTitle: "With our transparent, trustworthy, and professional service mindset, we remain a reliable partner for our investors.",
        ctaText:
            "To create long-term value by offering our investors projects in the right locations with high value potential, through a transparent, reliable, and professional service mindset.",
        ctaPrimary: "Book a Free Intro Call",
        ctaSecondary: "Browse the Current Portfolio",
    },
    ru: {
        heroBadge: "Güzel Invest • 30 лет опыта",
        heroTitle: "О нас",
        heroText:
            "Güzel Invest работает в Аланье, одном из самых важных инвестиционных центров Антальи, и занимает позицию надежного бренда в сфере недвижимости с сильной историей и международным видением.",
        statsTitle: "Статистика",
        stats: [
            { label: "Опыт", value: "30+ лет" },
            { label: "Успешных проектов", value: "28" },
            { label: "Разработка и строительство", value: "7 проектов" },
            { label: "Инвестиционный центр", value: "Аланья" },
            { label: "Партнер", value: "Надежный" },
        ],
        storyEyebrow: "Корпоративный профиль",
        storyTitle: "30 лет опыта, сильные проекты и надежные инвестиции.",
        storyParagraphs: [
            "Güzel Invest работает в Аланье, одном из самых важных инвестиционных центров Антальи, и занимает позицию надежного бренда в сфере недвижимости с сильной историей и международным видением.",
            "Наша компания построена на более чем 30-летнем опыте и знаниях нашего основателя Юсуфа Гюзеля.",
            "С первого дня наша цель - не просто продавать недвижимость. Мы стремимся предлагать инвесторам проекты в правильных локациях с высоким потенциалом роста и устойчивой доходностью.",
        ],
        storyCounters: [
            { label: "Завершенные проекты", value: "28 успешных проектов" },
            { label: "Процесс разработки и строительства", value: "7 разных проектов" },
        ],
        whyUsTitle: "Почему мы?",
        whyUsText:
            "У Güzel Invest также есть сильная команда опытных и профессиональных консультантов по недвижимости. Наша команда точно анализирует потребности инвесторов, предлагает наиболее подходящие варианты и сопровождает каждый этап процесса.",
        whyUsPoints: ["Прозрачность", "Международное видение", "Широкий портфель", "Профессиональный сервис"],
        servicesEyebrow: "Наши услуги",
        servicesTitle: "Почему Güzel Invest? Узнайте наши услуги ближе",
        servicePrimaryCta: "Узнать подробнее",
        serviceSecondaryCta: "Посмотреть портфель",
        services: [
            { title: "Продажа и аренда недвижимости", description: "Мы представляем портфель вилл, квартир, участков и коммерческой недвижимости с понятным анализом цены.", bullets: ["Актуальный и проверенный список", "Сравнение цен по районам", "Короткий список по потребности"], image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1400&h=900&fit=crop", dark: false },
            { title: "Инвестиционные консультации", description: "Мы формируем инвестиционные решения не только интуитивно, но и на основе данных. Вместе планируем рост стоимости, арендный мультипликатор и сценарии выхода.", bullets: ["Отчет по локации и сегменту", "Альтернативные планы по риску/доходности", "Средне- и долгосрочная стратегия"], image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1400&h=900&fit=crop", dark: true },
            { title: "Покупка недвижимости", description: "В процессе покупки мы управляем предложением, переговорами, оценкой и титулом в одном потоке.", bullets: ["Проверка оценки и стоимости", "Переговоры и договор", "Полное сопровождение титула"], image: "https://images.unsplash.com/photo-1554995207-c18c203602cb?w=1400&h=900&fit=crop", dark: false },
            { title: "Консультации по гражданству", description: "Мы прозрачно координируем весь процесс - от подбора объекта до официальной заявки.", bullets: ["Подбор объекта и подготовка файла", "Координация официальных процедур", "Регулярные отчеты о статусе"], image: "https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?w=1400&h=900&fit=crop", dark: true },
            { title: "Управление недвижимостью", description: "Мы управляем всеми операционными процессами после покупки: аренда, обслуживание и общение с арендаторами.", bullets: ["Аренда и сбор платежей", "Обслуживание и координация взносов", "Коммуникация и отчётность"], image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1400&h=900&fit=crop", dark: false },
            { title: "Юридическая и финансовая поддержка", description: "Юридическая защита и финансовая точность - ключевые темы. Мы ведем договоры, налоги и официальные процедуры безопасно.", bullets: ["Проверка договора и титула", "Налоги, сборы и обязательства", "Юридическая поддержка после продажи"], image: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=1400&h=900&fit=crop", dark: true },
        ],
        teamTitle: "Наша команда",
        teamText:
            "Наша команда точно анализирует потребности инвесторов, предлагает наиболее подходящие варианты и сопровождает каждый этап процесса.",
        teamMembers: [
            { name: "Deniz Yılmaz", role: "Консультант по недвижимости", image: "/images/about-us/deniz-yilmaz-profile.webp", imagePosition: "center 40%" },
            { name: "Hatice Çoban", role: "Консультант по недвижимости", image: "/images/about-us/hatice-coban-profile.webp", imagePosition: "center 40%" },
            { name: "Ahmet Bilen", role: "Консультант по недвижимости", image: "/images/about-us/ahmet-bilen-profile.webp" },
            { name: "Gürkan Kara", role: "Консультант по недвижимости", image: "/images/about-us/gurkan-kara-profile.webp" },
        ],
        missionTitle: "Наша миссия",
        missionText:
            "Создавать долгосрочную ценность, предлагая инвесторам проекты в правильных локациях с высоким потенциалом, при прозрачном, надежном и профессиональном подходе.",
        visionTitle: "Наше видение",
        visionText:
            "Стать одним из ведущих брендов, которым доверяют международные инвесторы, на основе качества, доверия и устойчивых инвестиций.",
        ctaBadge: "Güzel Invest",
        ctaTitle: "С прозрачным, надежным и профессиональным подходом мы остаемся надежным партнером для наших инвесторов.",
        ctaText:
            "Создавать долгосрочную ценность, предлагая инвесторам проекты в правильных локациях с высоким потенциалом, при прозрачном, надежном и профессиональном подходе.",
        ctaPrimary: "Бесплатный предварительный звонок",
        ctaSecondary: "Посмотреть текущий портфель",
    },
    de: {
        heroBadge: "Güzel Invest • 30 Jahre Erfahrung",
        heroTitle: "Über uns",
        heroText:
            "Güzel Invest ist in Alanya, einem der wichtigsten Investitionszentren von Antalya, tätig und positioniert sich als vertrauenswürdige Immobilienmarke mit starker Geschichte und internationaler Vision.",
        statsTitle: "Statistiken",
        stats: [
            { label: "Erfahrung", value: "30+ Jahre" },
            { label: "Erfolgreiche Projekte", value: "28" },
            { label: "Entwicklung und Bau", value: "7 Projekte" },
            { label: "Investitionszentrum", value: "Alanya" },
            { label: "Partner", value: "Verlässlich" },
        ],
        storyEyebrow: "Unternehmensprofil",
        storyTitle: "30 Jahre Erfahrung, starke Projekte und zuverlässige Investitionen.",
        storyParagraphs: [
            "Güzel Invest ist in Alanya, einem der wichtigsten Investitionszentren von Antalya, tätig und positioniert sich als vertrauenswürdige Immobilienmarke mit starker Geschichte und internationaler Vision.",
            "Unser Unternehmen basiert auf mehr als 30 Jahren Branchenerfahrung und dem Wissen unseres Gründers Yusuf Güzel.",
            "Seit dem ersten Tag ist unser Ziel mehr als nur Immobilien zu verkaufen. Wir möchten Projekte in den richtigen Lagen mit hohem Wertpotenzial und nachhaltiger Rendite anbieten.",
        ],
        storyCounters: [
            { label: "Abgeschlossene Projekte", value: "28 erfolgreiche Projekte" },
            { label: "Entwicklungs- und Bauphase", value: "7 verschiedene Projekte" },
        ],
        whyUsTitle: "Warum wir?",
        whyUsText:
            "Güzel Invest verfügt über ein starkes Team aus erfahrenen und professionellen Immobilienberatern. Unser Team analysiert die Bedürfnisse der Investoren präzise, bietet passende Immobilienoptionen und begleitet den Prozess in jeder Phase professionell.",
        whyUsPoints: ["Transparenz", "Internationale Vision", "Breites Portfolio", "Professioneller Service"],
        servicesEyebrow: "Unsere Leistungen",
        servicesTitle: "Warum Güzel Invest? Lernen Sie unsere Leistungen aus der Nähe kennen",
        servicePrimaryCta: "Mehr erfahren",
        serviceSecondaryCta: "Portfolio ansehen",
        services: [
            { title: "Kauf- und Mietimmobilien", description: "Wir präsentieren unser Portfolio aus Villen, Wohnungen, Grundstücken und Gewerbeimmobilien mit klarer Preisanalyse.", bullets: ["Aktuelle und geprüfte Liste", "Preisvergleich nach Region", "Shortlisting nach Bedarf"], image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1400&h=900&fit=crop", dark: false },
            { title: "Investitionsberatung", description: "Wir gestalten Investitionsentscheidungen nicht nur intuitiv, sondern datenbasiert. Wertentwicklung, Mietmultiplikator und Exit-Szenarien planen wir gemeinsam.", bullets: ["Bericht nach Lage und Segment", "Alternative Pläne nach Risiko/Rendite", "Mittel- und langfristige Strategie"], image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1400&h=900&fit=crop", dark: true },
            { title: "Immobilienkauf", description: "Im Kaufprozess steuern wir Angebot, Verhandlung, Bewertung und Grundbuch in einem Ablauf.", bullets: ["Bewertung und Wertprüfung", "Verhandlung und Vertrag", "End-to-End-Grundbuchbegleitung"], image: "https://images.unsplash.com/photo-1554995207-c18c203602cb?w=1400&h=900&fit=crop", dark: false },
            { title: "Staatsbürgerschaftsberatung", description: "Wir koordinieren den gesamten Prozess transparent - von der Objektauswahl bis zum offiziellen Antrag.", bullets: ["Objektmatching und Dossier", "Koordinierte Verfahren", "Regelmäßige Statusberichte"], image: "https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?w=1400&h=900&fit=crop", dark: true },
            { title: "Immobilienverwaltung", description: "Wir managen alle operativen Prozesse nach dem Kauf: Vermietung, Wartung und Mieterkommunikation.", bullets: ["Vermietung und Zahlungsmanagement", "Wartung und Abgabenkoordination", "Kommunikation und Reporting"], image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1400&h=900&fit=crop", dark: false },
            { title: "Rechtliche & finanzielle Unterstützung", description: "Rechtliche Sicherheit und finanzielle Genauigkeit sind zentral. Wir begleiten Verträge, Steuern und offizielle Schritte sicher.", bullets: ["Vertrags- und Grundbuchprüfung", "Steuern, Gebühren und Verpflichtungen", "Rechtsberatung nach dem Verkauf"], image: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=1400&h=900&fit=crop", dark: true },
        ],
        teamTitle: "Unser Team",
        teamText:
            "Unser Team analysiert die Bedürfnisse der Investoren präzise, bietet passende Immobilienoptionen und begleitet den Prozess in jeder Phase professionell.",
        teamMembers: [
            { name: "Deniz Yılmaz", role: "Immobilienberaterin", image: "/images/about-us/deniz-yilmaz-profile.webp", imagePosition: "center 40%" },
            { name: "Hatice Çoban", role: "Immobilienberaterin", image: "/images/about-us/hatice-coban-profile.webp", imagePosition: "center 40%" },
            { name: "Ahmet Bilen", role: "Immobilienberater", image: "/images/about-us/ahmet-bilen-profile.webp" },
            { name: "Gürkan Kara", role: "Immobilienberater", image: "/images/about-us/gurkan-kara-profile.webp" },
        ],
        missionTitle: "Unsere Mission",
        missionText:
            "Langfristigen Wert zu schaffen, indem wir Investoren Projekte an den richtigen Standorten mit hohem Potenzial und einem transparenten, verlässlichen, professionellen Ansatz anbieten.",
        visionTitle: "Unsere Vision",
        visionText:
            "Eine der führenden Marken zu werden, der internationale Investoren vertrauen, mit einem Ansatz aus Qualität, Vertrauen und nachhaltigen Investitionen.",
        ctaBadge: "Güzel Invest",
        ctaTitle: "Mit unserem transparenten, vertrauenswürdigen und professionellen Service bleiben wir ein zuverlässiger Partner für unsere Investoren.",
        ctaText:
            "Langfristigen Wert zu schaffen, indem wir Investoren Projekte an den richtigen Standorten mit hohem Potenzial und einem transparenten, verlässlichen, professionellen Ansatz anbieten.",
        ctaPrimary: "Kostenloses Erstgespräch buchen",
        ctaSecondary: "Aktuelles Portfolio ansehen",
    },
};

export function getAboutCopy(locale: string) {
    return aboutCopy[locale as PublicLocale] ?? aboutCopy.tr;
}
