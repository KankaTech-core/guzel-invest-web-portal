import type { PublicLocale } from "../copy-utils";

export type ServiceCopy = {
    back: string;
    detailEyebrow: string;
    contactCta: string;
    descriptionTitle: string;
    highlightsTitle: string;
    pageTitle: string;
    services: Record<
        string,
        {
            title: string;
            summary: string;
            description: string;
            highlights: [string, string, string];
        }
    >;
};

const serviceCopy: Record<PublicLocale, ServiceCopy> = {
    tr: {
        back: "Ana Sayfaya Dön",
        detailEyebrow: "Hizmet Detayı",
        contactCta: "Bu Hizmet İçin İletişime Geç",
        descriptionTitle: "Hizmet Açıklaması",
        highlightsTitle: "Kapsamdaki Başlıklar",
        pageTitle: "Hizmet Detayı",
        services: {
            "satilik-kiralik-portfoy-danismanligi": {
                title: "Satılık / Kiralık Portföy Danışmanlığı",
                summary: "Bütçenize, yaşam planınıza ve yatırım hedefinize uygun portföy eşleştirmesi.",
                description:
                    "Alanya odağında satılık ve kiralık seçenekleri tek bir süreçte değerlendiriyoruz. Sadece ilan göstermek yerine ihtiyaç analizinden nihai seçime kadar adım adım yönlendiriyoruz.",
                highlights: ["İhtiyaç analizi", "Bölge karşılaştırması", "Sahada birebir gösterim"],
            },
            "arsa-ve-proje-danismanligi": {
                title: "Arsa ve Proje Danışmanlığı",
                summary: "İmar, konum ve gelişim potansiyeli üzerinden arsa/proje analizi.",
                description:
                    "Arsa ve proje yatırımlarında mevzuat, imar planı ve bölgesel büyüme verilerini birlikte ele alıyoruz. Doğru parselin veya doğru projenin seçimi için teknik ve ticari değerlendirme sunuyoruz.",
                highlights: ["İmar uygunluk kontrolü", "Parsel potansiyel analizi", "Geliştirici/proje incelemesi"],
            },
            "proje-satin-alma-operasyonlari": {
                title: "Proje Satın Alma Operasyonları",
                summary: "Yeni veya devam eden projelerde satın alma sürecinin uçtan uca yönetimi.",
                description:
                    "Proje satın alımında sözleşme koşulları, teslim takvimi ve ödeme planı birlikte değerlendirilir. Riskleri önceden görünür kılarak daha güvenli bir satın alma süreci sağlıyoruz.",
                highlights: ["Sözleşme değerlendirmesi", "Ödeme planı optimizasyonu", "Teslim süreci takibi"],
            },
            "dogrudan-satin-alim-programi": {
                title: "Doğrudan Satın Alım Programı",
                summary: "Firma, uygun daire/arsa/projeleri doğrudan satın alabilen bir yapıya sahiptir.",
                description:
                    "Sadece satışa aracılık etmiyoruz, uygun bulunan mülkler için doğrudan satın alım da yapıyoruz. Bu model mülk sahiplerine hızlı ve net karar süreçleri sunar.",
                highlights: ["Hızlı ön değerlendirme", "Şeffaf teklif modeli", "Kısa sürede sonuçlandırma"],
            },
            "resmi-surec-ve-tapu-yonetimi": {
                title: "Resmi Süreç ve Tapu Yönetimi",
                summary: "Tapu, noter, resmi başvuru ve belge adımlarının koordinasyonu.",
                description:
                    "Satın alma ya da satış sonrası resmi işlemlerde süreç yönetimini tek merkezden yürütüyoruz. Evrak takibi, randevu planlaması ve işlem adımları düzenli bir takvimde ilerler.",
                highlights: ["Evrak listesi ve takip", "Tapu/noter koordinasyonu", "Süreç durum bilgilendirmesi"],
            },
            "satis-sonrasi-mulk-yonetimi": {
                title: "Satış Sonrası Mülk Yönetimi",
                summary: "Teslim sonrası kiralama, bakım ve operasyon süreçlerinde devam eden destek.",
                description:
                    "Satış veya satın alma sonrası ilişkiyi kesmiyoruz. Mülkün kullanım, kiralama ve bakım süreçlerinde operasyonel destekle yatırımın sürdürülebilirliğini koruyoruz.",
                highlights: ["Kiralama desteği", "Bakım/işletme koordinasyonu", "Uzun vadeli müşteri takibi"],
            },
            "finansman-ve-yatirim-planlama": {
                title: "Finansman ve Yatırım Planlama",
                summary: "Ödeme planı, finansman seçenekleri ve bütçe yapısına uygun danışmanlık.",
                description:
                    "Yatırım kararını yalnızca mülk seçimiyle sınırlamıyor, finansman yapısını da birlikte tasarlıyoruz. Böylece nakit akışı ve ödeme dengesine uygun bir plan oluşturuyoruz.",
                highlights: ["Bütçe senaryoları", "Finansman alternatifleri", "Uzun vadeli planlama"],
            },
        },
    },
    en: {
        back: "Back to Home",
        detailEyebrow: "Service Detail",
        contactCta: "Contact Us About This Service",
        descriptionTitle: "Service Description",
        highlightsTitle: "Included Topics",
        pageTitle: "Service Detail",
        services: {
            "satilik-kiralik-portfoy-danismanligi": {
                title: "Sale / Rental Portfolio Consultancy",
                summary: "Portfolio matching aligned with your budget, lifestyle plan, and investment goals.",
                description:
                    "We evaluate sale and rental options in Alanya within a single process. Instead of simply showing listings, we guide you step by step from needs analysis to the final choice.",
                highlights: ["Needs analysis", "Area comparison", "Hands-on site viewing"],
            },
            "arsa-ve-proje-danismanligi": {
                title: "Land and Project Consultancy",
                summary: "Land and project analysis based on zoning, location, and development potential.",
                description:
                    "For land and project investments, we evaluate regulations, zoning plans, and regional growth data together. We provide technical and commercial assessment to help select the right plot or project.",
                highlights: ["Zoning compliance check", "Plot potential analysis", "Developer/project review"],
            },
            "proje-satin-alma-operasyonlari": {
                title: "Project Purchase Operations",
                summary: "End-to-end management of the purchase process for new or ongoing projects.",
                description:
                    "In project purchases, contract terms, delivery schedule, and payment plan are evaluated together. We make risks visible early to provide a safer purchasing process.",
                highlights: ["Contract review", "Payment plan optimization", "Delivery tracking"],
            },
            "dogrudan-satin-alim-programi": {
                title: "Direct Purchase Program",
                summary: "A structure capable of buying suitable apartments, land, and projects directly.",
                description:
                    "We do not only broker sales; we also make direct purchases for properties we find suitable. This model gives property owners a fast and clear decision process.",
                highlights: ["Fast pre-evaluation", "Transparent offer model", "Short closing time"],
            },
            "resmi-surec-ve-tapu-yonetimi": {
                title: "Official Process and Title Deed Management",
                summary: "Coordination of title deed, notary, official application, and document steps.",
                description:
                    "We manage official procedures after purchase or sale from a single center. Document tracking, appointment planning, and process steps move on a structured schedule.",
                highlights: ["Document checklist and tracking", "Title deed/notary coordination", "Status updates"],
            },
            "satis-sonrasi-mulk-yonetimi": {
                title: "Post-Sale Property Management",
                summary: "Ongoing support for rental, maintenance, and operations after delivery.",
                description:
                    "We do not end the relationship after a sale or purchase. We preserve investment continuity with operational support for use, rental, and maintenance.",
                highlights: ["Rental support", "Maintenance/operation coordination", "Long-term client follow-up"],
            },
            "finansman-ve-yatirim-planlama": {
                title: "Financing and Investment Planning",
                summary: "Advice aligned with payment plans, financing options, and budget structure.",
                description:
                    "We do not limit investment decisions to property selection. We design the financing structure together so that cash flow and payment balance fit the plan.",
                highlights: ["Budget scenarios", "Financing alternatives", "Long-term planning"],
            },
        },
    },
    ru: {
        back: "Назад на главную",
        detailEyebrow: "Детали услуги",
        contactCta: "Связаться по этой услуге",
        descriptionTitle: "Описание услуги",
        highlightsTitle: "Темы в рамках услуги",
        pageTitle: "Детали услуги",
        services: {
            "satilik-kiralik-portfoy-danismanligi": {
                title: "Консультация по продаже и аренде объектов",
                summary: "Подбор объектов в соответствии с бюджетом, стилем жизни и инвестиционными целями.",
                description:
                    "Мы рассматриваем варианты продажи и аренды в Аланье в рамках одного процесса. Вместо простого показа объявлений мы сопровождаем клиента от анализа потребностей до финального выбора.",
                highlights: ["Анализ потребностей", "Сравнение районов", "Личный показ на месте"],
            },
            "arsa-ve-proje-danismanligi": {
                title: "Консультация по участкам и проектам",
                summary: "Анализ участка или проекта по зонированию, локации и потенциалу развития.",
                description:
                    "В инвестициях в землю и проекты мы вместе оцениваем нормативы, планы зонирования и данные о региональном росте. Даём техническую и коммерческую оценку для выбора правильного участка или проекта.",
                highlights: ["Проверка соответствия зонированию", "Анализ потенциала участка", "Оценка девелопера/проекта"],
            },
            "proje-satin-alma-operasyonlari": {
                title: "Операции по покупке проекта",
                summary: "Полное управление процессом покупки для новых или строящихся проектов.",
                description:
                    "При покупке проекта мы совместно оцениваем условия договора, график передачи и план платежей. Риски становятся видимыми заранее, и процесс покупки становится безопаснее.",
                highlights: ["Проверка договора", "Оптимизация платежного плана", "Отслеживание сроков передачи"],
            },
            "dogrudan-satin-alim-programi": {
                title: "Программа прямой покупки",
                summary: "Структура, способная напрямую выкупать подходящие квартиры, участки и проекты.",
                description:
                    "Мы не только сопровождаем продажи, но и напрямую выкупаем подходящие объекты. Эта модель даёт владельцам быстрый и прозрачный процесс принятия решений.",
                highlights: ["Быстрая предварительная оценка", "Прозрачное предложение", "Короткий срок закрытия"],
            },
            "resmi-surec-ve-tapu-yonetimi": {
                title: "Управление официальными процедурами и титулом",
                summary: "Координация шагов по титулу, нотариусу, заявкам и документам.",
                description:
                    "Мы централизованно ведём официальные процедуры после покупки или продажи. Отслеживание документов, планирование встреч и этапы процесса идут по чёткому графику.",
                highlights: ["Чек-лист и отслеживание документов", "Координация титула и нотариуса", "Обновления статуса"],
            },
            "satis-sonrasi-mulk-yonetimi": {
                title: "Управление объектом после продажи",
                summary: "Поддержка по аренде, обслуживанию и операциям после передачи.",
                description:
                    "Мы не прекращаем работу после сделки. Сохраняем устойчивость инвестиций за счёт поддержки в использовании, аренде и обслуживании объекта.",
                highlights: ["Поддержка аренды", "Координация обслуживания", "Долгосрочное сопровождение клиента"],
            },
            "finansman-ve-yatirim-planlama": {
                title: "Финансирование и инвестиционное планирование",
                summary: "Консультации, соответствующие плану платежей, финансированию и бюджету.",
                description:
                    "Мы не ограничиваем инвестиционное решение только выбором объекта. Мы вместе проектируем структуру финансирования так, чтобы денежный поток и баланс платежей соответствовали плану.",
                highlights: ["Сценарии бюджета", "Альтернативы финансирования", "Долгосрочное планирование"],
            },
        },
    },
    de: {
        back: "Zur Startseite",
        detailEyebrow: "Servicedetails",
        contactCta: "Zu dieser Dienstleistung Kontakt aufnehmen",
        descriptionTitle: "Dienstleistungsbeschreibung",
        highlightsTitle: "Enthaltene Themen",
        pageTitle: "Servicedetails",
        services: {
            "satilik-kiralik-portfoy-danismanligi": {
                title: "Beratung für Kauf- und Mietportfolios",
                summary: "Portfolio-Abgleich passend zu Budget, Lebensplan und Anlagezielen.",
                description:
                    "Wir bewerten Kauf- und Mietoptionen in Alanya in einem einzigen Prozess. Statt nur Objekte zu zeigen, begleiten wir Schritt für Schritt von der Bedarfsanalyse bis zur endgültigen Auswahl.",
                highlights: ["Bedarfsanalyse", "Gebietsvergleich", "Vor-Ort-Besichtigung"],
            },
            "arsa-ve-proje-danismanligi": {
                title: "Beratung für Grundstücke und Projekte",
                summary: "Analyse von Grundstücken und Projekten anhand von Bebauung, Lage und Entwicklungspotenzial.",
                description:
                    "Bei Grundstücks- und Projektinvestitionen betrachten wir gemeinsam Vorschriften, Bebauungspläne und regionale Wachstumsdaten. Wir liefern eine technische und kommerzielle Bewertung zur Auswahl des richtigen Grundstücks oder Projekts.",
                highlights: ["Prüfung der Bebauung", "Potenzialanalyse des Grundstücks", "Bewertung von Entwickler/Projekt"],
            },
            "proje-satin-alma-operasyonlari": {
                title: "Projektkauf-Operationen",
                summary: "End-to-End-Management des Kaufprozesses für neue oder laufende Projekte.",
                description:
                    "Beim Projektkauf bewerten wir Vertragsbedingungen, Lieferzeitplan und Zahlungsplan gemeinsam. Risiken werden früh sichtbar gemacht, um den Kaufprozess sicherer zu gestalten.",
                highlights: ["Vertragsprüfung", "Optimierung des Zahlungsplans", "Lieferverfolgung"],
            },
            "dogrudan-satin-alim-programi": {
                title: "Direktkauf-Programm",
                summary: "Struktur, die geeignete Wohnungen, Grundstücke und Projekte direkt kaufen kann.",
                description:
                    "Wir vermitteln nicht nur Verkäufe, sondern kaufen auch geeignete Objekte direkt an. Dieses Modell gibt Eigentümern schnelle und klare Entscheidungen.",
                highlights: ["Schnelle Vorprüfung", "Transparente Angebotsstruktur", "Kurze Abschlusszeit"],
            },
            "resmi-surec-ve-tapu-yonetimi": {
                title: "Behördliche Abläufe und Grundbuchverwaltung",
                summary: "Koordination von Grundbuch, Notar, Anträgen und Dokumenten.",
                description:
                    "Wir steuern behördliche Prozesse nach Kauf oder Verkauf zentral. Dokumentenverfolgung, Terminplanung und Verfahrensschritte laufen nach einem klaren Zeitplan.",
                highlights: ["Dokumenten-Checkliste", "Grundbuch- und Notarkoordination", "Status-Updates"],
            },
            "satis-sonrasi-mulk-yonetimi": {
                title: "Immobilienverwaltung nach dem Verkauf",
                summary: "Laufende Unterstützung für Vermietung, Wartung und Betrieb nach der Übergabe.",
                description:
                    "Wir beenden die Beziehung nicht mit dem Verkauf. Wir sichern die Nachhaltigkeit der Investition mit operativer Unterstützung für Nutzung, Vermietung und Wartung.",
                highlights: ["Vermietungsunterstützung", "Koordination von Wartung/Betrieb", "Langfristige Kundenbetreuung"],
            },
            "finansman-ve-yatirim-planlama": {
                title: "Finanzierung und Investitionsplanung",
                summary: "Beratung passend zu Zahlungsplan, Finanzierungsoptionen und Budgetstruktur.",
                description:
                    "Wir beschränken die Investitionsentscheidung nicht auf die Objektauswahl. Gemeinsam gestalten wir die Finanzierungsstruktur so, dass Cashflow und Zahlungsbalance zum Plan passen.",
                highlights: ["Budget-Szenarien", "Finanzierungsalternativen", "Langfristige Planung"],
            },
        },
    },
};

export function getServiceCopy(locale: string) {
    return serviceCopy[locale as PublicLocale] ?? serviceCopy.tr;
}
