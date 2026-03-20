import type { PublicLocale } from "../copy-utils";

export type ProjectListItem = {
    id: string;
    title: string;
    description: string;
    features: [string, string];
    image: string;
    reverse: boolean;
};

export type ProjectFaqItem = {
    question: string;
    answer: string;
};

export type ProjectPageCopy = {
    heroTitle: string;
    heroText: string;
    stats: Array<{ label: string; value: string }>;
    whyUsEyebrowLeft: string;
    whyUsEyebrowRight: string;
    whyUsTitle: string;
    whyUsIntro: string;
    locationTitle: string;
    locationIntro: string;
    ctaTitle: string;
    ctaText: string;
    ctaButton: string;
    faqTitle: string;
    faqIntro: string;
    detailButton: string;
    listTitle: string;
};

const copy: Record<PublicLocale, ProjectPageCopy> = {
    tr: {
        heroTitle: "Projelerimiz",
        heroText:
            "Güzel İnşaat ile hayalinizdeki yaşama ve güvenli yatırıma bir adım daha yaklaşın. Alanya'nın en seçkin noktalarında modern mimariyi keşfedin.",
        stats: [
            { label: "Yıllık Tecrübe", value: "25+" },
            { label: "Tamamlanan Konut", value: "500+" },
            { label: "Mutlu Aile", value: "1000+" },
            { label: "Aktif Proje", value: "15+" },
        ],
        whyUsEyebrowLeft: "Güven ve Kalite",
        whyUsEyebrowRight: "Lokasyon Avantajı",
        whyUsTitle: "Neden Güzel İnşaat?",
        whyUsIntro:
            "Yüksek inşaat kalitesi, modern mimari ve zamanında teslimat prensibiyle güven inşa ediyoruz. Her projemizde deprem yönetmeliğine uygun, sürdürülebilir ve estetik çözümler sunarak yaşam alanlarınızı değerli kılıyoruz.",
        locationTitle: "Neden Alanya?",
        locationIntro:
            "Akdeniz'in incisi Alanya, hem yaşam kalitesi hem de yüksek yatırım potansiyeli ile eşsiz bir lokasyon sunar. Yılın 300 günü güneşli havası, eşsiz plajları ve gelişmiş altyapısıyla küresel bir çekim merkezidir.",
        ctaTitle: "Hayalinizdeki Eve Bir Adım Uzaktasınız",
        ctaText: "Size en uygun projeyi bulmak ve özel tekliflerimizden yararlanmak için ekibimizle hemen iletişime geçin.",
        ctaButton: "Hemen Randevu Alın",
        faqTitle: "Sıkça Sorulan Sorular",
        faqIntro: "Alanya'daki projelerimiz ve yatırım süreçleri hakkında merak ettikleriniz.",
        detailButton: "Detayları İncele",
        listTitle: "Projelerimiz",
    },
    en: {
        heroTitle: "Our Projects",
        heroText:
            "Take one step closer to the life you dream of and a secure investment with Güzel İnşaat. Discover modern architecture in Alanya's most exclusive locations.",
        stats: [
            { label: "Years of Experience", value: "25+" },
            { label: "Completed Homes", value: "500+" },
            { label: "Happy Families", value: "1000+" },
            { label: "Active Projects", value: "15+" },
        ],
        whyUsEyebrowLeft: "Trust and Quality",
        whyUsEyebrowRight: "Location Advantage",
        whyUsTitle: "Why Güzel İnşaat?",
        whyUsIntro:
            "We build trust with high construction quality, modern architecture, and on-time delivery. In every project, we provide sustainable and aesthetic solutions that add value to your living spaces.",
        locationTitle: "Why Alanya?",
        locationIntro:
            "Alanya, the pearl of the Mediterranean, offers a unique location with both high quality of life and strong investment potential. With 300 sunny days a year, beautiful beaches, and developed infrastructure, it is a global attraction point.",
        ctaTitle: "You Are One Step Away From Your Dream Home",
        ctaText: "Contact our team right now to find the project that fits you best and benefit from our special offers.",
        ctaButton: "Book an Appointment",
        faqTitle: "Frequently Asked Questions",
        faqIntro: "What you want to know about our projects and investment processes in Alanya.",
        detailButton: "View Details",
        listTitle: "Our Projects",
    },
    ru: {
        heroTitle: "Наши проекты",
        heroText:
            "С Güzel İnşaat вы на шаг ближе к жизни своей мечты и безопасным инвестициям. Откройте для себя современную архитектуру в самых престижных районах Аланьи.",
        stats: [
            { label: "Лет опыта", value: "25+" },
            { label: "Завершённых домов", value: "500+" },
            { label: "Счастливых семей", value: "1000+" },
            { label: "Активных проектов", value: "15+" },
        ],
        whyUsEyebrowLeft: "Доверие и качество",
        whyUsEyebrowRight: "Преимущество локации",
        whyUsTitle: "Почему Güzel İnşaat?",
        whyUsIntro:
            "Мы строим доверие за счёт высокого качества строительства, современной архитектуры и своевременной сдачи. В каждом проекте мы предлагаем устойчивые и эстетичные решения, повышающие ценность вашего пространства.",
        locationTitle: "Почему Аланья?",
        locationIntro:
            "Аланья, жемчужина Средиземноморья, предлагает уникальную локацию с высоким качеством жизни и сильным инвестиционным потенциалом. 300 солнечных дней в году, прекрасные пляжи и развитая инфраструктура делают её точкой притяжения.",
        ctaTitle: "До дома мечты остался один шаг",
        ctaText: "Свяжитесь с нашей командой прямо сейчас, чтобы найти подходящий вам проект и воспользоваться специальными предложениями.",
        ctaButton: "Записаться на встречу",
        faqTitle: "Часто задаваемые вопросы",
        faqIntro: "Что вы хотите знать о наших проектах и инвестиционных процессах в Аланье.",
        detailButton: "Посмотреть детали",
        listTitle: "Наши проекты",
    },
    de: {
        heroTitle: "Unsere Projekte",
        heroText:
            "Mit Güzel İnşaat sind Sie Ihrer Traumlebensweise und einer sicheren Investition einen Schritt näher. Entdecken Sie moderne Architektur an den exklusivsten Orten in Alanya.",
        stats: [
            { label: "Jahre Erfahrung", value: "25+" },
            { label: "Fertiggestellte Wohnungen", value: "500+" },
            { label: "Glückliche Familien", value: "1000+" },
            { label: "Aktive Projekte", value: "15+" },
        ],
        whyUsEyebrowLeft: "Vertrauen und Qualität",
        whyUsEyebrowRight: "Lagevorteil",
        whyUsTitle: "Warum Güzel İnşaat?",
        whyUsIntro:
            "Wir schaffen Vertrauen mit hoher Bauqualität, moderner Architektur und pünktlicher Übergabe. In jedem Projekt bieten wir nachhaltige und ästhetische Lösungen, die Ihren Wohnraum aufwerten.",
        locationTitle: "Warum Alanya?",
        locationIntro:
            "Alanya, die Perle des Mittelmeers, bietet eine einzigartige Lage mit hoher Lebensqualität und starkem Investitionspotenzial. Mit 300 Sonnentagen im Jahr, schönen Stränden und ausgebauter Infrastruktur ist es ein globaler Anziehungspunkt.",
        ctaTitle: "Ihr Traumhaus ist nur noch einen Schritt entfernt",
        ctaText: "Kontaktieren Sie unser Team jetzt, um das passende Projekt zu finden und von unseren Sonderangeboten zu profitieren.",
        ctaButton: "Termin buchen",
        faqTitle: "Häufig gestellte Fragen",
        faqIntro: "Was Sie über unsere Projekte und Investitionsprozesse in Alanya wissen möchten.",
        detailButton: "Details ansehen",
        listTitle: "Unsere Projekte",
    },
};

const projectItems: Record<PublicLocale, ProjectListItem[]> = {
    tr: [
        {
            id: "guzel-deluxe",
            title: "Güzel Deluxe",
            description:
                "Alanya'nın merkezinde, lüks ve konforun buluştuğu Güzel Deluxe, panoramik deniz manzarası ve 5 yıldızlı otel konforundaki sosyal alanlarıyla sizi bekliyor. Modern iç mimarisi ve geniş balkonları ile ferah bir yaşam alanı sunuyor.",
            features: ["Akıllı Ev Sistemleri", "Yüzme Havuzu ve Fitness"],
            image:
                "https://lh3.googleusercontent.com/aida-public/AB6AXuDCM9hnL_jnrZ-NfRX4vCtIqJR6jGmN_DQaHHVcXU7zP6Zp4-EUMQqUbDkWgu1x-6SfRLIMGqtaGZHweGbKOGHBv7J55X87pC9ENNFxM_KRTGikRGRc9RmLVe8snGfkbG6tM0JlX3zN506P7RC3bFUGDo0zE3-mD8n4D7jncFYdTv2QGdIUaLD_vH_Mh_M7zVcFhaWsoI6Q1Pef3FgSqJUHLGo_YKfvTe3kdoCXUgfQgh2o1ye44cKmEOL6-FMDub8bTPADbO7c1po",
            reverse: false,
        },
        {
            id: "alanya-marina-homes",
            title: "Alanya Marina Homes",
            description:
                "Marina'ya sadece yürüme mesafesinde olan bu proje, deniz severler için tasarlandı. Özel yat iskelesi erişimi ve butik yaşam konseptiyle Alanya Marina Homes, prestijli bir yaşamın kapılarını aralıyor.",
            features: ["Özel Marina Erişimi", "Butik Site Konsepti"],
            image:
                "https://lh3.googleusercontent.com/aida-public/AB6AXuDYJ63KNo_W4205Mh716B_qTSg94iEQq9iad2PNCEaAxmKnOPfaw4qBY-fsBHLshX8e8V-YBgFSr5X41pxls3H1j4zPKVy9OWYCtVESpnCCfizKH9yBCfbnKcWxF4fy1IP3NG4z_OTkjRrls9H7dLO4fi9laLkADDU2YnjP2vpGQtJlgJveSjWohwUTuZslQCT8RtlkjvxjifegMe9fC0YO2uyqwAzMAIPwy21drnMadpSZ5XEejz2mhs5QsHqhWE5v7Bymcz8V0_c",
            reverse: true,
        },
        {
            id: "sunset-residences",
            title: "Sunset Residences",
            description:
                "Toros Dağları'nın yamacında, şehrin gürültüsünden uzak ama merkeze çok yakın. Sunset Residences, doğa ile iç içe, sürdürülebilir enerji çözümleriyle donatılmış modern bir yerleşim yeri.",
            features: ["Doğa Dostu Mimari", "Panoramik Dağ Manzarası"],
            image:
                "https://lh3.googleusercontent.com/aida-public/AB6AXuBwJ4MmoYwKWXLrWOaCqozqxCiqNFDad_FVdXznSsPgrB2hMtsnG5wLTypijX8DbKjm9eTZG2aiDjg6Lvc1AOOdB7ggEn4g1cPeVoPnvffisMXSYFKKiMHTRvxrHWRY-3IcxNEC7J1dZbmfxwmwNn4Y5IQtxlhhtCaZK_p5M8WZubXE3-IxMStq56WiFYEMy6musB4q9__kmIYuBGpqmWzvt-8ROqIa1x08Vt5rov7nrd7L2kShEtQEpDZIdr_FvSBigZ6eZTE7e5Q",
            reverse: false,
        },
    ],
    en: [
        {
            id: "guzel-deluxe",
            title: "Güzel Deluxe",
            description:
                "Located in the heart of Alanya, Güzel Deluxe combines luxury and comfort with panoramic sea views and social areas that feel like a five-star hotel. Its modern interior design and wide balconies create a spacious living environment.",
            features: ["Smart Home Systems", "Pool and Fitness"],
            image:
                "https://lh3.googleusercontent.com/aida-public/AB6AXuDCM9hnL_jnrZ-NfRX4vCtIqJR6jGmN_DQaHHVcXU7zP6Zp4-EUMQqUbDkWgu1x-6SfRLIMGqtaGZHweGbKOGHBv7J55X87pC9ENNFxM_KRTGikRGRc9RmLVe8snGfkbG6tM0JlX3zN506P7RC3bFUGDo0zE3-mD8n4D7jncFYdTv2QGdIUaLD_vH_Mh_M7zVcFhaWsoI6Q1Pef3FgSqJUHLGo_YKfvTe3kdoCXUgfQgh2o1ye44cKmEOL6-FMDub8bTPADbO7c1po",
            reverse: false,
        },
        {
            id: "alanya-marina-homes",
            title: "Alanya Marina Homes",
            description:
                "Just a short walk from the marina, this project is designed for sea lovers. With private dock access and a boutique living concept, Alanya Marina Homes opens the door to a prestigious lifestyle.",
            features: ["Private Marina Access", "Boutique Site Concept"],
            image:
                "https://lh3.googleusercontent.com/aida-public/AB6AXuDYJ63KNo_W4205Mh716B_qTSg94iEQq9iad2PNCEaAxmKnOPfaw4qBY-fsBHLshX8e8V-YBgFSr5X41pxls3H1j4zPKVy9OWYCtVESpnCCfizKH9yBCfbnKcWxF4fy1IP3NG4z_OTkjRrls9H7dLO4fi9laLkADDU2YnjP2vpGQtJlgJveSjWohwUTuZslQCT8RtlkjvxjifegMe9fC0YO2uyqwAzMAIPwy21drnMadpSZ5XEejz2mhs5QsHqhWE5v7Bymcz8V0_c",
            reverse: true,
        },
        {
            id: "sunset-residences",
            title: "Sunset Residences",
            description:
                "On the slopes of the Taurus Mountains, far from city noise yet very close to the center. Sunset Residences is a modern community surrounded by nature and equipped with sustainable energy solutions.",
            features: ["Eco-Friendly Architecture", "Panoramic Mountain View"],
            image:
                "https://lh3.googleusercontent.com/aida-public/AB6AXuBwJ4MmoYwKWXLrWOaCqozqxCiqNFDad_FVdXznSsPgrB2hMtsnG5wLTypijX8DbKjm9eTZG2aiDjg6Lvc1AOOdB7ggEn4g1cPeVoPnvffisMXSYFKKiMHTRvxrHWRY-3IcxNEC7J1dZbmfxwmwNn4Y5IQtxlhhtCaZK_p5M8WZubXE3-IxMStq56WiFYEMy6musB4q9__kmIYuBGpqmWzvt-8ROqIa1x08Vt5rov7nrd7L2kShEtQEpDZIdr_FvSBigZ6eZTE7e5Q",
            reverse: false,
        },
    ],
    ru: [
        {
            id: "guzel-deluxe",
            title: "Güzel Deluxe",
            description:
                "В самом центре Аланьи Güzel Deluxe сочетает роскошь и комфорт, предлагая панорамный вид на море и общественные зоны уровня пятизвездочного отеля. Современный интерьер и широкие балконы создают просторное жилое пространство.",
            features: ["Система умного дома", "Бассейн и фитнес"],
            image:
                "https://lh3.googleusercontent.com/aida-public/AB6AXuDCM9hnL_jnrZ-NfRX4vCtIqJR6jGmN_DQaHHVcXU7zP6Zp4-EUMQqUbDkWgu1x-6SfRLIMGqtaGZHweGbKOGHBv7J55X87pC9ENNFxM_KRTGikRGRc9RmLVe8snGfkbG6tM0JlX3zN506P7RC3bFUGDo0zE3-mD8n4D7jncFYdTv2QGdIUaLD_vH_Mh_M7zVcFhaWsoI6Q1Pef3FgSqJUHLGo_YKfvTe3kdoCXUgfQgh2o1ye44cKmEOL6-FMDub8bTPADbO7c1po",
            reverse: false,
        },
        {
            id: "alanya-marina-homes",
            title: "Alanya Marina Homes",
            description:
                "Этот проект расположен всего в нескольких минутах ходьбы от марины и создан для любителей моря. Благодаря приватному доступу к причалу и концепции бутикового проживания, Alanya Marina Homes открывает двери к престижному образу жизни.",
            features: ["Приватный доступ к марине", "Бутик-концепция комплекса"],
            image:
                "https://lh3.googleusercontent.com/aida-public/AB6AXuDYJ63KNo_W4205Mh716B_qTSg94iEQq9iad2PNCEaAxmKnOPfaw4qBY-fsBHLshX8e8V-YBgFSr5X41pxls3H1j4zPKVy9OWYCtVESpnCCfizKH9yBCfbnKcWxF4fy1IP3NG4z_OTkjRrls9H7dLO4fi9laLkADDU2YnjP2vpGQtJlgJveSjWohwUTuZslQCT8RtlkjvxjifegMe9fC0YO2uyqwAzMAIPwy21drnMadpSZ5XEejz2mhs5QsHqhWE5v7Bymcz8V0_c",
            reverse: true,
        },
        {
            id: "sunset-residences",
            title: "Sunset Residences",
            description:
                "На склонах Таврских гор, вдали от городского шума, но очень близко к центру. Sunset Residences - это современный жилой комплекс среди природы, оснащённый устойчивыми энергетическими решениями.",
            features: ["Экологичная архитектура", "Панорамный вид на горы"],
            image:
                "https://lh3.googleusercontent.com/aida-public/AB6AXuBwJ4MmoYwKWXLrWOaCqozqxCiqNFDad_FVdXznSsPgrB2hMtsnG5wLTypijX8DbKjm9eTZG2aiDjg6Lvc1AOOdB7ggEn4g1cPeVoPnvffisMXSYFKKiMHTRvxrHWRY-3IcxNEC7J1dZbmfxwmwNn4Y5IQtxlhhtCaZK_p5M8WZubXE3-IxMStq56WiFYEMy6musB4q9__kmIYuBGpqmWzvt-8ROqIa1x08Vt5rov7nrd7L2kShEtQEpDZIdr_FvSBigZ6eZTE7e5Q",
            reverse: false,
        },
    ],
    de: [
        {
            id: "guzel-deluxe",
            title: "Güzel Deluxe",
            description:
                "Im Zentrum von Alanya verbindet Güzel Deluxe Luxus und Komfort mit Panoramablick auf das Meer und Gemeinschaftsbereichen auf Fünf-Sterne-Niveau. Das moderne Innendesign und die großen Balkone schaffen ein großzügiges Wohngefühl.",
            features: ["Smart-Home-Systeme", "Pool und Fitness"],
            image:
                "https://lh3.googleusercontent.com/aida-public/AB6AXuDCM9hnL_jnrZ-NfRX4vCtIqJR6jGmN_DQaHHVcXU7zP6Zp4-EUMQqUbDkWgu1x-6SfRLIMGqtaGZHweGbKOGHBv7J55X87pC9ENNFxM_KRTGikRGRc9RmLVe8snGfkbG6tM0JlX3zN506P7RC3bFUGDo0zE3-mD8n4D7jncFYdTv2QGdIUaLD_vH_Mh_M7zVcFhaWsoI6Q1Pef3FgSqJUHLGo_YKfvTe3kdoCXUgfQgh2o1ye44cKmEOL6-FMDub8bTPADbO7c1po",
            reverse: false,
        },
        {
            id: "alanya-marina-homes",
            title: "Alanya Marina Homes",
            description:
                "Nur wenige Gehminuten von der Marina entfernt wurde dieses Projekt für Meeresliebhaber entworfen. Mit privatem Zugang zum Steg und einem Boutique-Wohnkonzept öffnet Alanya Marina Homes die Tür zu einem prestigeträchtigen Lebensstil.",
            features: ["Privater Marina-Zugang", "Boutique-Anlage"],
            image:
                "https://lh3.googleusercontent.com/aida-public/AB6AXuDYJ63KNo_W4205Mh716B_qTSg94iEQq9iad2PNCEaAxmKnOPfaw4qBY-fsBHLshX8e8V-YBgFSr5X41pxls3H1j4zPKVy9OWYCtVESpnCCfizKH9yBCfbnKcWxF4fy1IP3NG4z_OTkjRrls9H7dLO4fi9laLkADDU2YnjP2vpGQtJlgJveSjWohwUTuZslQCT8RtlkjvxjifegMe9fC0YO2uyqwAzMAIPwy21drnMadpSZ5XEejz2mhs5QsHqhWE5v7Bymcz8V0_c",
            reverse: true,
        },
        {
            id: "sunset-residences",
            title: "Sunset Residences",
            description:
                "An den Hängen des Taurusgebirges, fern vom Stadtlärm und dennoch sehr nah am Zentrum. Sunset Residences ist eine moderne Wohnanlage inmitten der Natur mit nachhaltigen Energielösungen.",
            features: ["Umweltfreundliche Architektur", "Panoramablick auf die Berge"],
            image:
                "https://lh3.googleusercontent.com/aida-public/AB6AXuBwJ4MmoYwKWXLrWOaCqozqxCiqNFDad_FVdXznSsPgrB2hMtsnG5wLTypijX8DbKjm9eTZG2aiDjg6Lvc1AOOdB7ggEn4g1cPeVoPnvffisMXSYFKKiMHTRvxrHWRY-3IcxNEC7J1dZbmfxwmwNn4Y5IQtxlhhtCaZK_p5M8WZubXE3-IxMStq56WiFYEMy6musB4q9__kmIYuBGpqmWzvt-8ROqIa1x08Vt5rov7nrd7L2kShEtQEpDZIdr_FvSBigZ6eZTE7e5Q",
            reverse: false,
        },
    ],
};

const faqs: Record<PublicLocale, ProjectFaqItem[]> = {
    tr: [
        {
            question: "Yabancılar Alanya'da nasıl mülk edinebilir?",
            answer:
                "Yabancı uyruklu kişiler, Türkiye'de karşılıklı anlaşmalar çerçevesinde mülk edinebilirler. Güzel İnşaat olarak, tapu işlemlerinden ikamet iznine kadar tüm süreçlerde danışmanlık sağlıyoruz.",
        },
        {
            question: "İnşaat garantileriniz nelerdir?",
            answer:
                "Tüm projelerimiz yapı denetim firmaları tarafından kontrol edilmektedir. Ayrıca Güzel İnşaat olarak yapısal unsurlarda 5 yıl, ince işçilikte 2 yıl firma garantisi sunuyoruz.",
        },
        {
            question: "Ödeme planları nasıl yapılıyor?",
            answer:
                "İnşaatı devam eden projelerimizde %30-%50 peşinat ve kalanı için vade farksız taksit imkanları sunuyoruz. Nakit alımlarda ise özel indirimlerimiz mevcuttur.",
        },
        {
            question: "Vatandaşlık süreci nasıl işliyor?",
            answer:
                "400.000 USD ve üzeri gayrimenkul yatırımı yapan yabancı yatırımcılar, Türk vatandaşlığına başvuru hakkı kazanmaktadır. Hukuk departmanımız bu süreçte yanınızdadır.",
        },
    ],
    en: [
        {
            question: "How can foreigners acquire property in Alanya?",
            answer:
                "Foreign nationals can acquire property in Turkey within the framework of reciprocal agreements. As Güzel İnşaat, we provide consultancy throughout the entire process, from title deed procedures to residence permits.",
        },
        {
            question: "What construction guarantees do you offer?",
            answer:
                "All of our projects are checked by building inspection firms. In addition, Güzel İnşaat offers a 5-year company guarantee for structural elements and a 2-year guarantee for fine workmanship.",
        },
        {
            question: "How are payment plans arranged?",
            answer:
                "For our ongoing projects, we offer 30% to 50% down payment options and interest-free installments for the remainder. Special discounts are available for cash purchases.",
        },
        {
            question: "How does the citizenship process work?",
            answer:
                "Foreign investors who make a real estate investment of 400,000 USD or more are eligible to apply for Turkish citizenship. Our legal department supports you throughout the process.",
        },
    ],
    ru: [
        {
            question: "Как иностранцы могут приобрести недвижимость в Аланье?",
            answer:
                "Иностранные граждане могут приобретать недвижимость в Турции в рамках взаимных соглашений. Güzel İnşaat сопровождает весь процесс, от оформления титула до получения вида на жительство.",
        },
        {
            question: "Какие гарантии вы предоставляете по строительству?",
            answer:
                "Все наши проекты проверяются компаниями строительного контроля. Кроме того, Güzel İnşaat предоставляет 5-летнюю гарантию на конструктивные элементы и 2-летнюю гарантию на отделочные работы.",
        },
        {
            question: "Как оформляются планы оплаты?",
            answer:
                "Для проектов на стадии строительства мы предлагаем аванс 30%-50% и беспроцентную рассрочку на оставшуюся сумму. Для оплаты наличными действуют специальные скидки.",
        },
        {
            question: "Как работает процесс получения гражданства?",
            answer:
                "Иностранные инвесторы, вложившие в недвижимость 400 000 USD и более, могут подать заявление на гражданство Турции. Наш юридический отдел сопровождает вас на всех этапах.",
        },
    ],
    de: [
        {
            question: "Wie können Ausländer in Alanya Immobilien erwerben?",
            answer:
                "Ausländische Staatsangehörige können in der Türkei im Rahmen gegenseitiger Abkommen Immobilien erwerben. Als Güzel İnşaat beraten wir Sie während des gesamten Prozesses, von Grundbuchangelegenheiten bis zur Aufenthaltserlaubnis.",
        },
        {
            question: "Welche Baugarantien bieten Sie an?",
            answer:
                "Alle unsere Projekte werden von Bauprüfungsfirmen kontrolliert. Darüber hinaus bietet Güzel İnşaat eine 5-jährige Garantie auf konstruktive Elemente und 2 Jahre auf Feinarbeiten.",
        },
        {
            question: "Wie werden Zahlungspläne gestaltet?",
            answer:
                "Bei unseren laufenden Projekten bieten wir 30% bis 50% Anzahlung und zinsfreie Raten für den Restbetrag an. Für Barzahlungen gibt es Sonderrabatte.",
        },
        {
            question: "Wie funktioniert der Staatsbürgerschaftsprozess?",
            answer:
                "Ausländische Investoren, die Immobilien im Wert von 400.000 USD oder mehr erwerben, können die türkische Staatsbürgerschaft beantragen. Unsere Rechtsabteilung begleitet Sie dabei.",
        },
    ],
};

export function getProjectsPageCopy(locale: string) {
    return copy[locale as PublicLocale] ?? copy.tr;
}

export function getProjectsPageItems(locale: string) {
    return projectItems[locale as PublicLocale] ?? projectItems.tr;
}

export function getProjectsFaqs(locale: string) {
    return faqs[locale as PublicLocale] ?? faqs.tr;
}
