import { pickLocaleCopy, type PublicLocale } from "./copy-utils";

export type LegalPageSlug = "privacy" | "terms" | "cookies";

type LegalSection = {
    id: string;
    title: string;
    paragraphs: string[];
};

export const legalPageRoutes: Record<LegalPageSlug, string> = {
    privacy: "gizlilik",
    terms: "kullanim-sartlari",
    cookies: "cerez-politikasi",
};

export const legalPageSlugs: LegalPageSlug[] = ["privacy", "cookies", "terms"];

export type LegalPageCopy = {
    badge: string;
    tabLabel: string;
    title: string;
    description: string;
    sectionCountLabel: string;
    summaryTitle: string;
    summaryBody: string;
    draftNoticeTitle: string;
    draftNoticeBody: string;
    lastUpdatedLabel: string;
    lastUpdatedDate: string;
    contentsTitle: string;
    sections: LegalSection[];
    contactTitle: string;
    contactBody: string;
    contactPrimaryCta: string;
    contactSecondaryCta: string;
};

type LegalLocaleCopy = Record<LegalPageSlug, LegalPageCopy>;

const legalCopy: Record<PublicLocale, LegalLocaleCopy> = {
    tr: {
        privacy: {
            badge: "Yasal",
            tabLabel: "Gizlilik Politikası",
            title: "Gizlilik Politikası",
            description:
                "Bu taslak gizlilik politikası, Güzel Invest web sitesi üzerinden toplanabilecek verilerin hangi amaçlarla ele alınabileceğini genel hatlarıyla açıklar. Hukuki inceleme sonrası güncellenmek üzere hazırlanmıştır.",
            sectionCountLabel: "bölüm",
            summaryTitle: "Politika Özeti",
            summaryBody:
                "Bu sayfa, ziyaretçi ve potansiyel müşteri verilerinin toplanması, kullanılması, saklanması ve paylaşılmasına ilişkin genel çerçeveyi anlatan taslak metindir. Buradaki maddeler nihai hukuki metin yerine geçmez; avukat incelemesi ile birlikte detaylandırılması beklenir.",
            draftNoticeTitle: "Taslak Notu",
            draftNoticeBody:
                "Bu metin 18 Mart 2026 tarihinde operasyonel ihtiyaç için oluşturulmuş taslak bir içeriktir. Güzel Invest'in avukatları tarafından gözden geçirildikten sonra değiştirilebilir, genişletilebilir veya tamamen yeniden yazılabilir.",
            lastUpdatedLabel: "Son güncelleme",
            lastUpdatedDate: "18 Mart 2026",
            contentsTitle: "İçerik Başlıkları",
            sections: [
                {
                    id: "scope",
                    title: "1. Kapsam ve belge amacı",
                    paragraphs: [
                        "Bu politika, Güzel Invest web sitesi, iletişim formları, telefon talepleri ve benzeri dijital temas noktaları üzerinden alınan bilgilerin nasıl ele alınabileceğine dair genel bir çerçeve sunar.",
                        "Metnin amacı, ziyaretçilere hangi veri kategorilerinin işlenebileceği ve bu işlemlerin hangi operasyonel ihtiyaçlara hizmet ettiği konusunda anlaşılır bir başlangıç seviyesi şeffaflık sağlamaktır.",
                    ],
                },
                {
                    id: "data-collected",
                    title: "2. Toplanabilecek veri kategorileri",
                    paragraphs: [
                        "Ad, soyad, telefon numarası, e-posta adresi, talep konusu, mesaj içeriği ve kullanıcının kendi isteğiyle paylaştığı diğer iletişim bilgileri formlar veya doğrudan iletişim kanalları üzerinden alınabilir.",
                        "Ayrıca ziyaret sırasında teknik kayıtlar, cihaz bilgileri, IP adresi, yönlendiren sayfa, tarayıcı bilgileri ve temel kullanım istatistikleri gibi dijital erişim verileri sistem güvenliği ve performans takibi için kaydedilebilir.",
                    ],
                },
                {
                    id: "purposes",
                    title: "3. Verilerin kullanım amaçları",
                    paragraphs: [
                        "Toplanan bilgiler; bilgi talebine geri dönüş sağlamak, portföy veya proje paylaşımı yapmak, satın alma ya da yatırım sürecini yönetmek, müşteri iletişimini sürdürmek ve hizmet kalitesini geliştirmek amaçlarıyla kullanılabilir.",
                        "Gerekli olduğunda operasyonel planlama, dolandırıcılık veya kötüye kullanım risklerinin azaltılması, yasal yükümlülüklerin yerine getirilmesi ve iç raporlama süreçleri için de sınırlı ölçüde değerlendirilebilir.",
                    ],
                },
                {
                    id: "sharing",
                    title: "4. Üçüncü taraflarla paylaşım",
                    paragraphs: [
                        "Güzel Invest, verileri yalnızca iş süreçlerini yürütmek için gerekli olduğu ölçüde; teknoloji sağlayıcıları, barındırma hizmetleri, iletişim araçları, muhasebe veya hukuki danışmanlar gibi destek aldığı taraflarla paylaşabilir.",
                        "Bu paylaşımların kapsamı, ilgili hizmetin sunulması için gerekli minimum veri ile sınırlı tutulmalı ve uygulanabilir mevzuat, sözleşmesel yükümlülükler ve gizlilik beklentileri doğrultusunda yönetilmelidir.",
                    ],
                },
                {
                    id: "storage-security",
                    title: "5. Saklama, güvenlik ve erişim kontrolü",
                    paragraphs: [
                        "Veriler, iş amacı ortadan kalkıncaya kadar veya uygulanabilir saklama yükümlülükleri sona erene kadar makul sürelerle tutulabilir. Gereksiz hale gelen verilerin silinmesi, anonimleştirilmesi veya arşivlenmesi planlı süreçlerle ele alınmalıdır.",
                        "Sistem güvenliği için yetki sınırlaması, parola politikası, günlük kayıtları, barındırma güvenliği ve yedekleme gibi teknik ve idari önlemler kullanılabilir; ancak hiçbir dijital aktarım veya depolama yöntemi mutlak güvenlik garantisi sağlamaz.",
                    ],
                },
                {
                    id: "rights-contact",
                    title: "6. Haklar, talepler ve iletişim",
                    paragraphs: [
                        "İlgili kişiler, uygulanabilir mevzuatın izin verdiği ölçüde kendi verilerine ilişkin bilgi talep etme, düzeltme isteme, güncelleme, silme veya işleme faaliyetlerine itiraz etme gibi haklara sahip olabilir.",
                        "Bu taslak metin kapsamındaki sorular veya veri talepleri için Güzel Invest ile doğrudan iletişime geçilebilir. Nihai süreçler ve yanıt adımları, avukat incelemesi sonrasında yayınlanacak güncel politikada netleştirilecektir.",
                    ],
                },
            ],
            contactTitle: "İletişim ve güncelleme",
            contactBody:
                "Bu sayfa taslak niteliğindedir. Veri koruma süreçleri, saklama periyotları ve yasal dayanaklar avukat incelemesinden sonra nihai hale getirilecektir. Bu süreçte iletişim talepleri için mevcut iletişim kanallarımız kullanılabilir.",
            contactPrimaryCta: "İletişim sayfasına git",
            contactSecondaryCta: "Ana sayfaya dön",
        },
        cookies: {
            badge: "Yasal",
            tabLabel: "Çerez Politikası",
            title: "Çerez Politikası",
            description:
                "Bu çerez politikası, Güzel Invest web sitesinde kullanılan çerez türlerini, amaçlarını ve yönetim seçeneklerini açıklar.",
            sectionCountLabel: "bölüm",
            summaryTitle: "Politika Özeti",
            summaryBody:
                "Bu sayfa, web sitemizde kullanılan çerezlerin türlerini, hangi amaçlarla kullanıldığını ve tercihlerinizi nasıl yönetebileceğinizi açıklayan taslak bir metindir.",
            draftNoticeTitle: "Taslak Notu",
            draftNoticeBody:
                "Bu metin 19 Mart 2026 tarihinde operasyonel ihtiyaç için oluşturulmuş taslak bir içeriktir. Avukat incelemesi sonrasında güncellenebilir.",
            lastUpdatedLabel: "Son güncelleme",
            lastUpdatedDate: "19 Mart 2026",
            contentsTitle: "İçerik Başlıkları",
            sections: [
                {
                    id: "what-are-cookies",
                    title: "1. Çerezler nedir?",
                    paragraphs: [
                        "Çerezler, web sitelerini ziyaret ettiğinizde cihazınıza yerleştirilen küçük metin dosyalarıdır. Siteyi daha iyi çalıştırmak, kullanıcı deneyimini iyileştirmek ve site kullanımına ilişkin bilgi sağlamak amacıyla yaygın biçimde kullanılır.",
                        "Çerezler oturumunuzu tanımak, tercihlerinizi hatırlamak ve siteyi nasıl kullandığınızı anlamamıza yardımcı olmak için kullanılabilir.",
                    ],
                },
                {
                    id: "cookie-types",
                    title: "2. Kullanılan çerez türleri",
                    paragraphs: [
                        "Zorunlu çerezler: Sitenin temel işlevlerinin çalışması için gereklidir. Oturum yönetimi, güvenlik ve dil tercihi gibi işlevleri kapsar. Bu çerezler devre dışı bırakılamaz.",
                        "Analitik çerezler: Ziyaretçilerin siteyi nasıl kullandığını anlamamıza yardımcı olur. Sayfa görüntülenmeleri, trafik kaynakları ve kullanıcı davranışları hakkında anonim istatistikler toplar.",
                        "Pazarlama çerezleri: Hedefli reklam ve tanıtımlar sunmak için kullanılır. Üçüncü taraf reklam ağları tarafından yerleştirilebilir.",
                        "İşlevsel çerezler: Kişiselleştirilmiş özellikler ve tercihler sağlar. Para birimi seçimi, görüntüleme tercihleri gibi ayarlarınızı hatırlar.",
                    ],
                },
                {
                    id: "cookie-management",
                    title: "3. Çerez tercihlerinizi yönetme",
                    paragraphs: [
                        "İlk ziyaretinizde bir çerez bildirimi aracılığıyla tercihlerinizi belirleyebilirsiniz. 'Tümünü Kabul Et', 'Yalnızca Zorunlu', 'Özelleştir' veya 'Tümünü Reddet' seçenekleri sunulmaktadır.",
                        "Tercihlerinizi istediğiniz zaman sayfanın sol alt köşesindeki çerez simgesine tıklayarak değiştirebilirsiniz. Ayrıca tarayıcı ayarlarınızdan çerezleri yönetebilir veya silebilirsiniz.",
                    ],
                },
                {
                    id: "third-party-cookies",
                    title: "4. Üçüncü taraf çerezleri",
                    paragraphs: [
                        "Sitemizde YouTube, Google Maps ve sosyal medya platformları gibi üçüncü taraf hizmetleri yer alabilir. Bu hizmetler kendi çerezlerini ayarlayabilir.",
                        "Bu üçüncü taraf çerezleri üzerinde doğrudan kontrolümüz bulunmamaktadır. İlgili hizmetlerin gizlilik politikalarını incelemenizi öneririz.",
                    ],
                },
                {
                    id: "updates",
                    title: "5. Politika güncellemeleri",
                    paragraphs: [
                        "Bu çerez politikası zaman zaman güncellenebilir. Önemli değişiklikler yapıldığında bu sayfada bilgilendirileceksiniz.",
                        "En son güncelleme tarihini bu sayfanın üst kısmında bulabilirsiniz.",
                    ],
                },
            ],
            contactTitle: "Sorular ve iletişim",
            contactBody:
                "Çerez politikamız hakkında sorularınız varsa bizimle iletişime geçebilirsiniz.",
            contactPrimaryCta: "İletişim sayfasına git",
            contactSecondaryCta: "Ana sayfaya dön",
        },
        terms: {
            badge: "Yasal",
            tabLabel: "Kullanım Şartları",
            title: "Kullanım Şartları",
            description:
                "Bu taslak kullanım şartları, Güzel Invest web sitesinin bilgi amaçlı kullanımına ilişkin temel kuralları ve sorumluluk sınırlarını genel bir dille açıklar. Hukuki ekip tarafından daha sonra revize edilmek üzere hazırlanmıştır.",
            sectionCountLabel: "bölüm",
            summaryTitle: "Metin Özeti",
            summaryBody:
                "Bu sayfa, web sitesinin hangi amaçla sunulduğu, kullanıcıdan ne beklendiği ve sitede yer alan içeriklerin hangi koşullarla kullanılabileceğine dair bir taslak çerçeve sunar. Nihai bağlayıcı metin avukat incelemesi sonrasında güncellenecektir.",
            draftNoticeTitle: "Taslak Notu",
            draftNoticeBody:
                "Bu kullanım şartları taslağı 18 Mart 2026 tarihinde yayın öncesi ihtiyaçlar için hazırlanmıştır. Hukuki denetim tamamlandığında kapsam, terminoloji ve sorumluluk sınırları değiştirilebilir.",
            lastUpdatedLabel: "Son güncelleme",
            lastUpdatedDate: "18 Mart 2026",
            contentsTitle: "İçerik Başlıkları",
            sections: [
                {
                    id: "acceptance",
                    title: "1. Siteye erişim ve kabul",
                    paragraphs: [
                        "Bu web sitesine erişen her kullanıcı, burada yayımlanan içeriklerin bilgi verme amaçlı sunulduğunu ve siteden yararlanırken ilgili kurallara uygun hareket etmesi gerektiğini kabul etmiş sayılabilir.",
                        "Kullanıcı, yürütülmekte olan bir işlem veya resmi sözleşme bulunmadığı sürece site üzerindeki genel bilgiler ile kendisine özel yazılı teklifler arasındaki farkı dikkate almakla sorumludur.",
                    ],
                },
                {
                    id: "information-purpose",
                    title: "2. Bilgilendirme niteliğindeki içerikler",
                    paragraphs: [
                        "Sitede yer alan portföy, proje, fiyat, lokasyon, teslim tarihi, vatandaşlık uygunluğu veya benzeri bilgiler yalnızca genel bilgilendirme amacıyla sunulabilir ve her zaman güncel kalacağı garanti edilmez.",
                        "Herhangi bir alım, satış, kiralama veya yatırım kararı verilmeden önce ilgili bilgi ve belgelerin Güzel Invest ekibiyle doğrulanması ve gerekirse uzman danışmanlık alınması beklenir.",
                    ],
                },
                {
                    id: "user-obligations",
                    title: "3. Kullanıcı yükümlülükleri",
                    paragraphs: [
                        "Kullanıcılar, siteyi hukuka aykırı, zarar verici, aldatıcı veya hizmeti bozucu şekilde kullanmamayı; formlar üzerinden doğru ve kendilerine ait bilgiler paylaşmayı kabul eder.",
                        "Site altyapısını zorlayan otomatik sorgular, yetkisiz erişim girişimleri, içerik kopyalama veya markaya zarar verecek davranışlar tespit edildiğinde erişim sınırlaması ya da yasal süreçler gündeme gelebilir.",
                    ],
                },
                {
                    id: "intellectual-property",
                    title: "4. Fikri mülkiyet ve içerik kullanımı",
                    paragraphs: [
                        "Sitedeki metinler, görseller, marka unsurları, tasarım dili, dokümanlar ve diğer içerikler aksi açıkça belirtilmedikçe Güzel Invest'e veya ilgili hak sahiplerine ait olabilir.",
                        "Bu içeriklerin ticari amaçla kopyalanması, dağıtılması, yeniden yayınlanması veya markayla bağlantı kurulacak şekilde kullanılması yazılı izin gerektirebilir.",
                    ],
                },
                {
                    id: "third-party-links",
                    title: "5. Üçüncü taraf bağlantıları ve hizmetler",
                    paragraphs: [
                        "Web sitesinde harita, sosyal medya, iletişim aracı veya benzeri üçüncü taraf servislerine bağlantılar yer alabilir. Bu servislerin kendi koşulları ve gizlilik uygulamaları, Güzel Invest dışında yönetilir.",
                        "Kullanıcı bu bağlantıları kullandığında ilgili platformların güncel koşullarını ayrıca incelemeli ve paylaşacağı veriler konusunda kendi değerlendirmesini yapmalıdır.",
                    ],
                },
                {
                    id: "availability-liability",
                    title: "6. Hizmet sürekliliği, değişiklik hakkı ve sorumluluk sınırı",
                    paragraphs: [
                        "Güzel Invest, web sitesindeki içerikleri, teknik altyapıyı, formları ve sunulan sayfaları önceden bildirim yapmaksızın güncelleme, durdurma, değiştirme veya kaldırma hakkını saklı tutabilir.",
                        "Uygulanabilir hukukun izin verdiği ölçüde, siteye erişimde yaşanabilecek kesintiler, teknik arızalar, dolaylı zararlar veya kullanıcının yalnızca web sitesi bilgilerine dayanarak aldığı kararlardan doğacak sonuçlar konusunda sorumluluk sınırı avukat incelemesi sonrasında daha ayrıntılı tanımlanacaktır.",
                    ],
                },
            ],
            contactTitle: "Sorular ve resmi metin güncellemesi",
            contactBody:
                "Bu kullanım şartları taslağı, yayına uygun bir başlangıç metni olarak hazırlanmıştır. Resmi hukuki dil, bağlayıcı haller ve istisnalar sonraki avukat güncellemelerinde netleştirilecektir.",
            contactPrimaryCta: "İletişim sayfasına git",
            contactSecondaryCta: "Portföyü incele",
        },
    },
    en: {
        privacy: {
            badge: "Legal",
            tabLabel: "Privacy Policy",
            title: "Privacy Policy",
            description:
                "This draft privacy policy outlines in general terms how data collected through the Guzel Invest website may be handled. It is prepared as a starting point and will be updated after legal review.",
            sectionCountLabel: "sections",
            summaryTitle: "Policy Summary",
            summaryBody:
                "This page is a draft explaining the general framework for collecting, using, storing, and sharing visitor and prospective customer data. It is not intended to replace the final legal text and is expected to be refined after counsel review.",
            draftNoticeTitle: "Draft Notice",
            draftNoticeBody:
                "This text was prepared on March 18, 2026 as an operational draft. It may be revised, expanded, or fully rewritten after review by Guzel Invest's legal counsel.",
            lastUpdatedLabel: "Last updated",
            lastUpdatedDate: "March 18, 2026",
            contentsTitle: "Contents",
            sections: [
                {
                    id: "scope",
                    title: "1. Scope and purpose of this document",
                    paragraphs: [
                        "This policy provides a general framework for how information received through the Guzel Invest website, contact forms, phone inquiries, and similar digital touchpoints may be handled.",
                        "Its purpose is to give visitors a clear starting-level explanation of which categories of data may be processed and which operational needs those activities may serve.",
                    ],
                },
                {
                    id: "data-collected",
                    title: "2. Categories of data that may be collected",
                    paragraphs: [
                        "Name, surname, phone number, email address, inquiry subject, message content, and any other contact details voluntarily shared by the user may be collected through forms or direct communication channels.",
                        "Technical access data such as IP address, browser details, device information, referring page, and basic usage statistics may also be logged for system security, performance monitoring, and service continuity purposes.",
                    ],
                },
                {
                    id: "purposes",
                    title: "3. Purposes for using data",
                    paragraphs: [
                        "Collected information may be used to respond to inquiries, share portfolio or project details, manage purchase or investment processes, maintain customer communication, and improve service quality.",
                        "Where needed, data may also be used in a limited way for operational planning, risk reduction, fraud or misuse prevention, internal reporting, and compliance with applicable obligations.",
                    ],
                },
                {
                    id: "sharing",
                    title: "4. Sharing with third parties",
                    paragraphs: [
                        "Guzel Invest may share data only to the extent necessary to operate its business processes, including with technology providers, hosting services, communication tools, accounting support, or legal advisors.",
                        "Such sharing should remain limited to the minimum data needed for the relevant service and should be managed in line with applicable law, contractual commitments, and reasonable confidentiality expectations.",
                    ],
                },
                {
                    id: "storage-security",
                    title: "5. Retention, security, and access control",
                    paragraphs: [
                        "Data may be retained for reasonable periods while a business purpose exists or while applicable retention obligations continue. Data that is no longer needed should be deleted, anonymized, or archived through planned processes.",
                        "Technical and organizational safeguards such as access controls, password policies, activity logs, secure hosting, and backups may be used, but no digital transmission or storage method can guarantee absolute security.",
                    ],
                },
                {
                    id: "rights-contact",
                    title: "6. Rights, requests, and contact",
                    paragraphs: [
                        "Subject to applicable law, individuals may have rights to request information about their data, ask for correction or update, request deletion, or object to certain processing activities.",
                        "Questions or data-related requests regarding this draft may be directed to Guzel Invest through its current contact channels. Final procedures and response steps will be clarified in the updated policy published after legal review.",
                    ],
                },
            ],
            contactTitle: "Contact and future updates",
            contactBody:
                "This page is a draft. Data protection workflows, retention periods, and legal bases will be finalized after legal review. Until then, current company contact channels may be used for privacy-related requests.",
            contactPrimaryCta: "Go to contact page",
            contactSecondaryCta: "Return to home",
        },
        cookies: {
            badge: "Legal",
            tabLabel: "Cookie Policy",
            title: "Cookie Policy",
            description:
                "This cookie policy explains the types of cookies used on the Guzel Invest website, their purposes, and your management options.",
            sectionCountLabel: "sections",
            summaryTitle: "Policy Summary",
            summaryBody:
                "This page is a draft explaining the types of cookies used on our website, their purposes, and how you can manage your preferences.",
            draftNoticeTitle: "Draft Notice",
            draftNoticeBody:
                "This text was prepared on March 19, 2026 as an operational draft. It may be updated after legal review.",
            lastUpdatedLabel: "Last updated",
            lastUpdatedDate: "March 19, 2026",
            contentsTitle: "Contents",
            sections: [
                {
                    id: "what-are-cookies",
                    title: "1. What are cookies?",
                    paragraphs: [
                        "Cookies are small text files placed on your device when you visit websites. They are widely used to make websites work better, improve user experience, and provide information about site usage.",
                        "Cookies may be used to recognize your session, remember your preferences, and help us understand how you use the site.",
                    ],
                },
                {
                    id: "cookie-types",
                    title: "2. Types of cookies used",
                    paragraphs: [
                        "Essential cookies: Required for the basic functions of the site to work. They cover functions such as session management, security, and language preference. These cookies cannot be disabled.",
                        "Analytics cookies: Help us understand how visitors use the site. They collect anonymous statistics about page views, traffic sources, and user behavior.",
                        "Marketing cookies: Used to deliver targeted advertising and promotions. They may be placed by third-party advertising networks.",
                        "Functional cookies: Provide personalized features and preferences. They remember your settings such as currency selection and display preferences.",
                    ],
                },
                {
                    id: "cookie-management",
                    title: "3. Managing your cookie preferences",
                    paragraphs: [
                        "On your first visit, you can set your preferences through a cookie notice. Options include 'Accept All', 'Essential Only', 'Customize', or 'Reject All'.",
                        "You can change your preferences at any time by clicking the cookie icon in the bottom-left corner of the page. You can also manage or delete cookies through your browser settings.",
                    ],
                },
                {
                    id: "third-party-cookies",
                    title: "4. Third-party cookies",
                    paragraphs: [
                        "Our site may include third-party services such as YouTube, Google Maps, and social media platforms. These services may set their own cookies.",
                        "We do not have direct control over these third-party cookies. We recommend reviewing the privacy policies of the relevant services.",
                    ],
                },
                {
                    id: "updates",
                    title: "5. Policy updates",
                    paragraphs: [
                        "This cookie policy may be updated from time to time. You will be notified on this page when significant changes are made.",
                        "You can find the latest update date at the top of this page.",
                    ],
                },
            ],
            contactTitle: "Questions and contact",
            contactBody:
                "If you have questions about our cookie policy, please contact us.",
            contactPrimaryCta: "Go to contact page",
            contactSecondaryCta: "Return to home",
        },
        terms: {
            badge: "Legal",
            tabLabel: "Terms of Use",
            title: "Terms of Use",
            description:
                "These draft terms of use explain the main rules, expectations, and general responsibility boundaries for using the Guzel Invest website for informational purposes. They are prepared for later review by legal counsel.",
            sectionCountLabel: "sections",
            summaryTitle: "Text Summary",
            summaryBody:
                "This page provides a draft framework describing why the website is offered, what is expected from users, and under which general conditions the site's content may be used. The final binding text will be updated after legal review.",
            draftNoticeTitle: "Draft Notice",
            draftNoticeBody:
                "This draft terms of use text was prepared on March 18, 2026 for launch-readiness needs. Its scope, terminology, and liability language may change after legal review is completed.",
            lastUpdatedLabel: "Last updated",
            lastUpdatedDate: "March 18, 2026",
            contentsTitle: "Contents",
            sections: [
                {
                    id: "acceptance",
                    title: "1. Access to the site and acceptance",
                    paragraphs: [
                        "Any user accessing this website may be deemed to accept that the content is provided for general information purposes and that use of the site should comply with the rules published here.",
                        "Unless there is a separate written process or formal agreement, users remain responsible for distinguishing between general website information and tailored written offers prepared specifically for them.",
                    ],
                },
                {
                    id: "information-purpose",
                    title: "2. Informational nature of content",
                    paragraphs: [
                        "Listings, project details, prices, locations, delivery dates, citizenship eligibility statements, and similar content on the site may be presented for general information only and may not remain current at all times.",
                        "Before making any purchase, sale, rental, or investment decision, users should confirm the relevant information directly with the Guzel Invest team and obtain professional advice where appropriate.",
                    ],
                },
                {
                    id: "user-obligations",
                    title: "3. User responsibilities",
                    paragraphs: [
                        "Users are expected not to use the site in any unlawful, harmful, misleading, or service-disrupting way and to provide accurate information that belongs to them when submitting forms.",
                        "Automated scraping that strains the infrastructure, unauthorized access attempts, large-scale copying of content, or conduct that harms the brand may result in access restrictions or legal action.",
                    ],
                },
                {
                    id: "intellectual-property",
                    title: "4. Intellectual property and content use",
                    paragraphs: [
                        "Unless explicitly stated otherwise, texts, visuals, brand elements, design language, documents, and other content on the site may belong to Guzel Invest or the relevant rights holders.",
                        "Commercial copying, redistribution, republication, or any use implying brand affiliation may require prior written permission.",
                    ],
                },
                {
                    id: "third-party-links",
                    title: "5. Third-party links and services",
                    paragraphs: [
                        "The website may include links to third-party services such as maps, social media platforms, or communication tools. Those services operate under their own terms and privacy practices, outside the control of Guzel Invest.",
                        "When using those links, users should review the current terms of the relevant platforms separately and make their own assessment about any data they choose to share.",
                    ],
                },
                {
                    id: "availability-liability",
                    title: "6. Service availability, change rights, and limitation of responsibility",
                    paragraphs: [
                        "Guzel Invest may reserve the right to update, suspend, modify, or remove website content, technical features, forms, or individual pages without prior notice.",
                        "To the extent permitted by applicable law, more detailed language on downtime, technical errors, indirect losses, or decisions made solely in reliance on website content will be added after legal review.",
                    ],
                },
            ],
            contactTitle: "Questions and formal legal update",
            contactBody:
                "This draft terms page is intended as a launch-ready starting point. Formal legal language, binding cases, and exceptions will be clarified in later updates from legal counsel.",
            contactPrimaryCta: "Go to contact page",
            contactSecondaryCta: "Browse portfolio",
        },
    },
    ru: {
        privacy: {
            badge: "Legal",
            tabLabel: "Конфиденциальность",
            title: "Политика конфиденциальности",
            description:
                "Этот проект политики конфиденциальности в общих чертах описывает, как могут обрабатываться данные, собираемые через сайт Guzel Invest. Текст подготовлен как черновик и будет обновлен после юридической проверки.",
            sectionCountLabel: "разделов",
            summaryTitle: "Краткое описание",
            summaryBody:
                "На этой странице представлен черновой текст с общими принципами сбора, использования, хранения и передачи данных посетителей и потенциальных клиентов. Он не заменяет окончательную юридическую редакцию и должен быть уточнен после проверки юристами.",
            draftNoticeTitle: "Примечание к черновику",
            draftNoticeBody:
                "Этот текст был подготовлен 18 марта 2026 года как рабочий черновик. После проверки юристами Guzel Invest он может быть изменен, дополнен или полностью переписан.",
            lastUpdatedLabel: "Последнее обновление",
            lastUpdatedDate: "18 марта 2026",
            contentsTitle: "Содержание",
            sections: [
                {
                    id: "scope",
                    title: "1. Сфера действия и цель документа",
                    paragraphs: [
                        "Эта политика описывает общий подход к информации, получаемой через сайт Guzel Invest, контактные формы, телефонные обращения и другие цифровые точки взаимодействия.",
                        "Ее цель состоит в том, чтобы на понятном базовом уровне объяснить посетителям, какие категории данных могут обрабатываться и каким операционным задачам это может служить.",
                    ],
                },
                {
                    id: "data-collected",
                    title: "2. Категории данных, которые могут собираться",
                    paragraphs: [
                        "Через формы и прямые каналы связи могут собираться имя, фамилия, номер телефона, адрес электронной почты, тема обращения, содержание сообщения и иные контактные данные, которые пользователь передает добровольно.",
                        "Кроме того, для целей безопасности системы и контроля работы сервиса могут фиксироваться технические данные доступа, включая IP-адрес, сведения о браузере, устройстве, источнике перехода и базовую статистику использования.",
                    ],
                },
                {
                    id: "purposes",
                    title: "3. Цели использования данных",
                    paragraphs: [
                        "Собранная информация может использоваться для ответа на обращения, предоставления информации о портфеле и проектах, сопровождения сделок или инвестиционных процессов, поддержания коммуникации с клиентами и улучшения качества сервиса.",
                        "При необходимости данные также могут использоваться в ограниченном объеме для операционного планирования, снижения рисков, предотвращения злоупотреблений, внутренней отчетности и соблюдения применимых обязанностей.",
                    ],
                },
                {
                    id: "sharing",
                    title: "4. Передача данных третьим лицам",
                    paragraphs: [
                        "Guzel Invest может передавать данные только в той мере, в какой это необходимо для ведения бизнес-процессов, включая технологических подрядчиков, хостинг-провайдеров, коммуникационные сервисы, бухгалтерскую поддержку или юридических консультантов.",
                        "Такая передача должна ограничиваться минимальным объемом данных, необходимым для конкретной услуги, и осуществляться с учетом применимого законодательства, договорных обязательств и разумных ожиданий конфиденциальности.",
                    ],
                },
                {
                    id: "storage-security",
                    title: "5. Хранение, безопасность и контроль доступа",
                    paragraphs: [
                        "Данные могут храниться в течение разумного срока, пока существует деловая цель или сохраняются обязательства по хранению. Когда данные больше не нужны, они должны удаляться, обезличиваться или архивироваться в рамках запланированных процедур.",
                        "Для защиты могут использоваться технические и организационные меры, включая разграничение доступа, политику паролей, журналы действий, защищенный хостинг и резервное копирование, однако ни один цифровой способ передачи или хранения не гарантирует абсолютную безопасность.",
                    ],
                },
                {
                    id: "rights-contact",
                    title: "6. Права, запросы и контакты",
                    paragraphs: [
                        "В рамках применимого законодательства у лиц могут быть права запрашивать сведения о своих данных, требовать исправления или обновления, удаления или возражать против отдельных видов обработки.",
                        "Вопросы и запросы, связанные с этим черновиком, можно направлять в Guzel Invest через действующие каналы связи. Окончательные процедуры и порядок ответов будут уточнены в обновленной политике после юридической проверки.",
                    ],
                },
            ],
            contactTitle: "Контакты и будущие обновления",
            contactBody:
                "Эта страница является черновиком. Процессы защиты данных, сроки хранения и правовые основания будут окончательно определены после юридической проверки. До этого момента для запросов можно использовать действующие каналы связи компании.",
            contactPrimaryCta: "Перейти на страницу контактов",
            contactSecondaryCta: "Вернуться на главную",
        },
        cookies: {
            badge: "Legal",
            tabLabel: "Политика cookie",
            title: "Политика cookie",
            description:
                "Эта политика cookie описывает типы файлов cookie, используемых на сайте Guzel Invest, их цели и ваши возможности управления ими.",
            sectionCountLabel: "разделов",
            summaryTitle: "Краткое описание",
            summaryBody:
                "На этой странице представлен черновой текст, описывающий типы файлов cookie на нашем сайте, их назначение и способы управления настройками.",
            draftNoticeTitle: "Примечание к черновику",
            draftNoticeBody:
                "Этот текст подготовлен 19 марта 2026 года как рабочий черновик. Может быть обновлён после юридической проверки.",
            lastUpdatedLabel: "Последнее обновление",
            lastUpdatedDate: "19 марта 2026",
            contentsTitle: "Содержание",
            sections: [
                {
                    id: "what-are-cookies",
                    title: "1. Что такое файлы cookie?",
                    paragraphs: [
                        "Cookie — это небольшие текстовые файлы, которые сохраняются на вашем устройстве при посещении сайтов. Они широко используются для обеспечения корректной работы сайтов, улучшения пользовательского опыта и получения информации об использовании сайта.",
                        "Cookie могут использоваться для распознавания вашей сессии, сохранения предпочтений и понимания того, как вы взаимодействуете с сайтом.",
                    ],
                },
                {
                    id: "cookie-types",
                    title: "2. Типы используемых файлов cookie",
                    paragraphs: [
                        "Необходимые cookie: требуются для базовых функций сайта — управление сессией, безопасность и выбор языка. Эти cookie нельзя отключить.",
                        "Аналитические cookie: помогают понять, как посетители используют сайт. Собирают анонимную статистику о просмотрах страниц, источниках трафика и поведении пользователей.",
                        "Маркетинговые cookie: используются для показа целевой рекламы. Могут устанавливаться сторонними рекламными сетями.",
                        "Функциональные cookie: обеспечивают персонализацию и сохранение настроек, таких как выбор валюты и предпочтения отображения.",
                    ],
                },
                {
                    id: "cookie-management",
                    title: "3. Управление настройками cookie",
                    paragraphs: [
                        "При первом посещении вы можете настроить предпочтения через уведомление о cookie. Доступны варианты: «Принять все», «Только необходимые», «Настроить» или «Отклонить все».",
                        "Вы можете изменить настройки в любое время, нажав на значок cookie в нижнем левом углу страницы. Также можно управлять cookie через настройки браузера.",
                    ],
                },
                {
                    id: "third-party-cookies",
                    title: "4. Cookie третьих сторон",
                    paragraphs: [
                        "На нашем сайте могут использоваться сторонние сервисы: YouTube, Google Maps и социальные сети. Эти сервисы могут устанавливать собственные cookie.",
                        "Мы не контролируем cookie третьих сторон. Рекомендуем ознакомиться с политиками конфиденциальности соответствующих сервисов.",
                    ],
                },
                {
                    id: "updates",
                    title: "5. Обновление политики",
                    paragraphs: [
                        "Эта политика cookie может обновляться время от времени. При существенных изменениях вы будете уведомлены на этой странице.",
                        "Дату последнего обновления можно найти в верхней части этой страницы.",
                    ],
                },
            ],
            contactTitle: "Вопросы и контакты",
            contactBody:
                "Если у вас есть вопросы о нашей политике cookie, свяжитесь с нами.",
            contactPrimaryCta: "Перейти на страницу контактов",
            contactSecondaryCta: "Вернуться на главную",
        },
        terms: {
            badge: "Legal",
            tabLabel: "Условия использования",
            title: "Условия использования",
            description:
                "Этот проект условий использования в общих чертах описывает основные правила, ожидания и пределы ответственности при информационном использовании сайта Guzel Invest. Текст подготовлен для последующей юридической доработки.",
            sectionCountLabel: "разделов",
            summaryTitle: "Краткое содержание",
            summaryBody:
                "На этой странице представлен черновой документ о том, с какой целью предоставляется сайт, что ожидается от пользователя и на каких общих условиях может использоваться размещенный контент. Окончательная обязательная редакция будет обновлена после проверки юристами.",
            draftNoticeTitle: "Примечание к черновику",
            draftNoticeBody:
                "Этот черновик условий использования был подготовлен 18 марта 2026 года для запуска сайта. После юридической проверки его объем, терминология и формулировки об ответственности могут измениться.",
            lastUpdatedLabel: "Последнее обновление",
            lastUpdatedDate: "18 марта 2026",
            contentsTitle: "Содержание",
            sections: [
                {
                    id: "acceptance",
                    title: "1. Доступ к сайту и принятие условий",
                    paragraphs: [
                        "Любой пользователь, получающий доступ к этому сайту, может считаться согласившимся с тем, что контент предоставляется в общих информационных целях и что использование сайта должно соответствовать опубликованным здесь правилам.",
                        "Если между сторонами нет отдельного письменного процесса или официального соглашения, пользователь самостоятельно отвечает за различие между общей информацией на сайте и индивидуальными письменными предложениями.",
                    ],
                },
                {
                    id: "information-purpose",
                    title: "2. Информационный характер контента",
                    paragraphs: [
                        "Объекты, сведения о проектах, цены, локации, сроки сдачи, упоминания о возможности получения гражданства и иные материалы на сайте могут публиковаться только в информационных целях и не гарантированно остаются актуальными постоянно.",
                        "Перед принятием решения о покупке, продаже, аренде или инвестиции пользователь должен подтвердить релевантную информацию непосредственно с командой Guzel Invest и при необходимости получить профессиональную консультацию.",
                    ],
                },
                {
                    id: "user-obligations",
                    title: "3. Обязанности пользователя",
                    paragraphs: [
                        "Пользователь обязуется не использовать сайт незаконным, вредоносным, вводящим в заблуждение или нарушающим работу способом, а также указывать в формах точную информацию, относящуюся к нему самому.",
                        "Автоматизированный сбор данных, перегружающий инфраструктуру, попытки несанкционированного доступа, массовое копирование контента или действия, наносящие вред бренду, могут привести к ограничению доступа или правовым мерам.",
                    ],
                },
                {
                    id: "intellectual-property",
                    title: "4. Интеллектуальная собственность и использование контента",
                    paragraphs: [
                        "Если прямо не указано иное, тексты, изображения, элементы бренда, дизайн, документы и другие материалы сайта могут принадлежать Guzel Invest или соответствующим правообладателям.",
                        "Коммерческое копирование, распространение, повторная публикация или использование материалов таким образом, который подразумевает связь с брендом, может требовать предварительного письменного разрешения.",
                    ],
                },
                {
                    id: "third-party-links",
                    title: "5. Ссылки и сервисы третьих лиц",
                    paragraphs: [
                        "Сайт может содержать ссылки на сторонние сервисы, например карты, социальные сети или инструменты связи. Такие сервисы работают по собственным правилам и политикам конфиденциальности, вне контроля Guzel Invest.",
                        "При переходе по таким ссылкам пользователь должен отдельно ознакомиться с актуальными условиями соответствующих платформ и самостоятельно оценить данные, которые он намерен передать.",
                    ],
                },
                {
                    id: "availability-liability",
                    title: "6. Доступность сервиса, право на изменения и ограничение ответственности",
                    paragraphs: [
                        "Guzel Invest может сохранять за собой право без предварительного уведомления обновлять, приостанавливать, изменять или удалять контент сайта, технические функции, формы и отдельные страницы.",
                        "В пределах, допускаемых применимым правом, более подробные положения о простоях, технических ошибках, косвенных убытках и решениях, принятых только на основании контента сайта, будут добавлены после юридической проверки.",
                    ],
                },
            ],
            contactTitle: "Вопросы и официальное юридическое обновление",
            contactBody:
                "Этот проект условий использования предназначен как стартовый текст для публикации. Официальные юридические формулировки, обязательные случаи и исключения будут уточнены в последующих обновлениях от юридических консультантов.",
            contactPrimaryCta: "Перейти на страницу контактов",
            contactSecondaryCta: "Открыть портфель",
        },
    },
    de: {
        privacy: {
            badge: "Recht",
            tabLabel: "Datenschutz",
            title: "Datenschutzerklarung",
            description:
                "Dieser Entwurf einer Datenschutzerklarung beschreibt in allgemeinen Zugen, wie uber die Website von Guzel Invest erhobene Daten verarbeitet werden konnen. Er dient als Ausgangspunkt und wird nach juristischer Prufung aktualisiert.",
            sectionCountLabel: "Abschnitte",
            summaryTitle: "Zusammenfassung",
            summaryBody:
                "Diese Seite ist ein Entwurf, der den allgemeinen Rahmen fur die Erhebung, Nutzung, Speicherung und Weitergabe von Daten von Besuchern und Interessenten beschreibt. Sie ersetzt nicht den endgultigen Rechtstext und soll nach anwaltlicher Prufung weiter konkretisiert werden.",
            draftNoticeTitle: "Hinweis zum Entwurf",
            draftNoticeBody:
                "Dieser Text wurde am 18. Marz 2026 als operativer Entwurf erstellt. Nach der Prufung durch die Rechtsberater von Guzel Invest kann er uberarbeitet, erweitert oder vollstandig neu gefasst werden.",
            lastUpdatedLabel: "Zuletzt aktualisiert",
            lastUpdatedDate: "18. Marz 2026",
            contentsTitle: "Inhalt",
            sections: [
                {
                    id: "scope",
                    title: "1. Geltungsbereich und Zweck dieses Dokuments",
                    paragraphs: [
                        "Diese Richtlinie beschreibt den allgemeinen Umgang mit Informationen, die uber die Website von Guzel Invest, Kontaktformulare, telefonische Anfragen und ahnliche digitale Kontaktpunkte eingehen konnen.",
                        "Ihr Zweck besteht darin, Besuchern auf verstandliche Weise einen ersten Uberblick daruber zu geben, welche Datenkategorien verarbeitet werden konnen und welchen operativen Zwecken diese Verarbeitung dienen kann.",
                    ],
                },
                {
                    id: "data-collected",
                    title: "2. Kategorien moglicher erhobener Daten",
                    paragraphs: [
                        "Uber Formulare oder direkte Kommunikationskanale konnen Name, Nachname, Telefonnummer, E-Mail-Adresse, Betreff der Anfrage, Nachrichteninhalt und sonstige vom Nutzer freiwillig mitgeteilte Kontaktdaten erhoben werden.",
                        "Zusatzlich konnen technische Zugriffsdaten wie IP-Adresse, Browserinformationen, Geratedaten, verweisende Seite und grundlegende Nutzungsstatistiken fur Systemsicherheit, Leistungsuberwachung und Servicekontinuitat protokolliert werden.",
                    ],
                },
                {
                    id: "purposes",
                    title: "3. Zwecke der Datennutzung",
                    paragraphs: [
                        "Erhobene Informationen konnen genutzt werden, um auf Anfragen zu antworten, Portfolio- oder Projektdetails zu teilen, Kauf- oder Investitionsprozesse zu begleiten, die Kundenkommunikation fortzufuhren und die Servicequalitat zu verbessern.",
                        "Soweit erforderlich, konnen Daten in begrenztem Umfang auch fur operative Planung, Risikoreduzierung, Missbrauchspravention, internes Reporting und die Erfullung anwendbarer Verpflichtungen verwendet werden.",
                    ],
                },
                {
                    id: "sharing",
                    title: "4. Weitergabe an Dritte",
                    paragraphs: [
                        "Guzel Invest kann Daten nur insoweit weitergeben, wie dies fur die Durchfuhrung seiner Geschaftsprozesse erforderlich ist, etwa an Technologieanbieter, Hosting-Dienste, Kommunikationstools, Buchhaltungsunterstutzung oder Rechtsberater.",
                        "Eine solche Weitergabe sollte auf die fur den jeweiligen Dienst erforderlichen Mindestdaten beschrankt bleiben und im Einklang mit anwendbarem Recht, vertraglichen Verpflichtungen und angemessenen Vertraulichkeitserwartungen erfolgen.",
                    ],
                },
                {
                    id: "storage-security",
                    title: "5. Aufbewahrung, Sicherheit und Zugriffskontrolle",
                    paragraphs: [
                        "Daten konnen fur angemessene Zeitraume gespeichert werden, solange ein geschaflticher Zweck besteht oder gesetzliche Aufbewahrungspflichten fortgelten. Nicht mehr benotigte Daten sollten in geplanten Prozessen geloscht, anonymisiert oder archiviert werden.",
                        "Technische und organisatorische Schutzmassnahmen wie Zugriffsbegrenzungen, Passwortregeln, Aktivitatsprotokolle, sicheres Hosting und Backups konnen eingesetzt werden; dennoch kann keine digitale Ubertragung oder Speicherung absolute Sicherheit garantieren.",
                    ],
                },
                {
                    id: "rights-contact",
                    title: "6. Rechte, Anfragen und Kontakt",
                    paragraphs: [
                        "Soweit nach anwendbarem Recht vorgesehen, konnen betroffene Personen Rechte haben, Auskunft uber ihre Daten zu verlangen, Berichtigungen oder Aktualisierungen anzufordern, Loschung zu beantragen oder bestimmten Verarbeitungen zu widersprechen.",
                        "Fragen oder datenschutzbezogene Anfragen zu diesem Entwurf konnen uber die aktuellen Kontaktkanale an Guzel Invest gerichtet werden. Endgultige Verfahren und Antwortschritte werden in der nach juristischer Prufung veroffentlichten Fassung prazisiert.",
                    ],
                },
            ],
            contactTitle: "Kontakt und spatere Aktualisierungen",
            contactBody:
                "Diese Seite ist ein Entwurf. Datenschutzablaufe, Aufbewahrungsfristen und Rechtsgrundlagen werden nach juristischer Prufung finalisiert. Bis dahin konnen fur entsprechende Anliegen die aktuellen Kontaktkanale des Unternehmens genutzt werden.",
            contactPrimaryCta: "Zur Kontaktseite",
            contactSecondaryCta: "Zur Startseite",
        },
        cookies: {
            badge: "Recht",
            tabLabel: "Cookie-Richtlinie",
            title: "Cookie-Richtlinie",
            description:
                "Diese Cookie-Richtlinie erklart die Arten von Cookies, die auf der Guzel Invest Website verwendet werden, deren Zweck und Ihre Verwaltungsmoglichkeiten.",
            sectionCountLabel: "Abschnitte",
            summaryTitle: "Zusammenfassung",
            summaryBody:
                "Diese Seite ist ein Entwurf, der die auf unserer Website verwendeten Cookie-Typen, ihre Zwecke und die Verwaltung Ihrer Einstellungen beschreibt.",
            draftNoticeTitle: "Hinweis zum Entwurf",
            draftNoticeBody:
                "Dieser Text wurde am 19. Marz 2026 als operativer Entwurf erstellt. Er kann nach juristischer Prufung aktualisiert werden.",
            lastUpdatedLabel: "Zuletzt aktualisiert",
            lastUpdatedDate: "19. Marz 2026",
            contentsTitle: "Inhalt",
            sections: [
                {
                    id: "what-are-cookies",
                    title: "1. Was sind Cookies?",
                    paragraphs: [
                        "Cookies sind kleine Textdateien, die auf Ihrem Gerat gespeichert werden, wenn Sie Websites besuchen. Sie werden haufig verwendet, um Websites besser funktionieren zu lassen, die Benutzererfahrung zu verbessern und Informationen uber die Website-Nutzung bereitzustellen.",
                        "Cookies konnen verwendet werden, um Ihre Sitzung zu erkennen, Ihre Einstellungen zu speichern und uns zu helfen zu verstehen, wie Sie die Website nutzen.",
                    ],
                },
                {
                    id: "cookie-types",
                    title: "2. Verwendete Cookie-Arten",
                    paragraphs: [
                        "Notwendige Cookies: Erforderlich fur die grundlegenden Funktionen der Website — Sitzungsverwaltung, Sicherheit und Sprachauswahl. Diese Cookies konnen nicht deaktiviert werden.",
                        "Analytische Cookies: Helfen uns zu verstehen, wie Besucher die Website nutzen. Sie erfassen anonyme Statistiken uber Seitenaufrufe, Verkehrsquellen und Nutzerverhalten.",
                        "Marketing-Cookies: Werden fur zielgerichtete Werbung verwendet. Sie konnen von Drittanbieter-Werbenetzwerken gesetzt werden.",
                        "Funktionale Cookies: Ermoglichen personalisierte Funktionen und Einstellungen wie Wahrungsauswahl und Anzeigepraferenzen.",
                    ],
                },
                {
                    id: "cookie-management",
                    title: "3. Verwaltung Ihrer Cookie-Einstellungen",
                    paragraphs: [
                        "Bei Ihrem ersten Besuch konnen Sie Ihre Einstellungen uber einen Cookie-Hinweis festlegen. Optionen sind: 'Alle akzeptieren', 'Nur notwendige', 'Anpassen' oder 'Alle ablehnen'.",
                        "Sie konnen Ihre Einstellungen jederzeit andern, indem Sie auf das Cookie-Symbol unten links auf der Seite klicken. Cookies konnen auch uber die Browsereinstellungen verwaltet werden.",
                    ],
                },
                {
                    id: "third-party-cookies",
                    title: "4. Cookies von Drittanbietern",
                    paragraphs: [
                        "Auf unserer Website konnen Drittanbieter-Dienste wie YouTube, Google Maps und soziale Medien eingebunden sein. Diese Dienste konnen eigene Cookies setzen.",
                        "Wir haben keine direkte Kontrolle uber Cookies von Drittanbietern. Wir empfehlen, die Datenschutzrichtlinien der jeweiligen Dienste zu prufen.",
                    ],
                },
                {
                    id: "updates",
                    title: "5. Aktualisierung der Richtlinie",
                    paragraphs: [
                        "Diese Cookie-Richtlinie kann von Zeit zu Zeit aktualisiert werden. Bei wesentlichen Anderungen werden Sie auf dieser Seite benachrichtigt.",
                        "Das Datum der letzten Aktualisierung finden Sie oben auf dieser Seite.",
                    ],
                },
            ],
            contactTitle: "Fragen und Kontakt",
            contactBody:
                "Bei Fragen zu unserer Cookie-Richtlinie kontaktieren Sie uns bitte.",
            contactPrimaryCta: "Zur Kontaktseite",
            contactSecondaryCta: "Zur Startseite",
        },
        terms: {
            badge: "Recht",
            tabLabel: "Nutzungsbedingungen",
            title: "Nutzungsbedingungen",
            description:
                "Dieser Entwurf der Nutzungsbedingungen beschreibt die wesentlichen Regeln, Erwartungen und allgemeinen Haftungsgrenzen fur die informative Nutzung der Guzel Invest Website. Er wurde fur die spatere juristische Uberarbeitung vorbereitet.",
            sectionCountLabel: "Abschnitte",
            summaryTitle: "Zusammenfassung",
            summaryBody:
                "Diese Seite enthalt einen Entwurf dazu, zu welchem Zweck die Website bereitgestellt wird, was von Nutzern erwartet wird und unter welchen allgemeinen Bedingungen die Inhalte verwendet werden konnen. Der endgultig verbindliche Text wird nach juristischer Prufung aktualisiert.",
            draftNoticeTitle: "Hinweis zum Entwurf",
            draftNoticeBody:
                "Dieser Entwurf der Nutzungsbedingungen wurde am 18. Marz 2026 fur den Start vorbereitet. Umfang, Terminologie und Formulierungen zur Verantwortung konnen sich nach juristischer Prufung andern.",
            lastUpdatedLabel: "Zuletzt aktualisiert",
            lastUpdatedDate: "18. Marz 2026",
            contentsTitle: "Inhalt",
            sections: [
                {
                    id: "acceptance",
                    title: "1. Zugang zur Website und Zustimmung",
                    paragraphs: [
                        "Jeder Nutzer, der auf diese Website zugreift, kann als damit einverstanden angesehen werden, dass die Inhalte zu allgemeinen Informationszwecken bereitgestellt werden und die Nutzung der Website den hier veroffentlichten Regeln entsprechen soll.",
                        "Sofern kein gesonderter schriftlicher Prozess oder kein formeller Vertrag besteht, bleibt der Nutzer selbst dafur verantwortlich, zwischen allgemeinen Website-Informationen und individuell fur ihn erstellten schriftlichen Angeboten zu unterscheiden.",
                    ],
                },
                {
                    id: "information-purpose",
                    title: "2. Informationscharakter der Inhalte",
                    paragraphs: [
                        "Objekte, Projektdetails, Preise, Standorte, Fertigstellungstermine, Hinweise zur Eignung fur Staatsburgerschaft und ahnliche Inhalte konnen ausschliesslich zu allgemeinen Informationszwecken dargestellt werden und bleiben moglicherweise nicht jederzeit aktuell.",
                        "Vor jeder Kauf-, Verkaufs-, Miet- oder Investitionsentscheidung sollten Nutzer die relevanten Informationen direkt mit dem Team von Guzel Invest bestatigen und gegebenenfalls fachlichen Rat einholen.",
                    ],
                },
                {
                    id: "user-obligations",
                    title: "3. Pflichten der Nutzer",
                    paragraphs: [
                        "Nutzer sollen die Website nicht rechtswidrig, schadlich, irrefuhrend oder storend verwenden und bei Formularanfragen korrekte sowie ihnen zuzuordnende Angaben machen.",
                        "Automatisiertes Auslesen, das die Infrastruktur belastet, unbefugte Zugriffsversuche, umfangreiches Kopieren von Inhalten oder markenschadigendes Verhalten konnen zu Zugriffsbeschrankungen oder rechtlichen Schritten fuhren.",
                    ],
                },
                {
                    id: "intellectual-property",
                    title: "4. Geistiges Eigentum und Nutzung von Inhalten",
                    paragraphs: [
                        "Sofern nicht ausdrucklich anders angegeben, konnen Texte, Bilder, Markenelemente, Gestaltung, Dokumente und sonstige Inhalte der Website Guzel Invest oder den jeweiligen Rechteinhabern gehoren.",
                        "Kommerzielles Kopieren, Weiterverbreiten, erneutes Veroffentlichen oder eine Nutzung, die eine Markenverbindung suggeriert, kann eine vorherige schriftliche Genehmigung erfordern.",
                    ],
                },
                {
                    id: "third-party-links",
                    title: "5. Links und Dienste Dritter",
                    paragraphs: [
                        "Die Website kann Links zu Drittanbietern wie Karten, sozialen Netzwerken oder Kommunikationstools enthalten. Diese Dienste unterliegen ihren eigenen Bedingungen und Datenschutzpraktiken ausserhalb der Kontrolle von Guzel Invest.",
                        "Bei Nutzung solcher Links sollten Nutzer die jeweils aktuellen Bedingungen der betreffenden Plattformen gesondert prufen und selbst beurteilen, welche Daten sie teilen mochten.",
                    ],
                },
                {
                    id: "availability-liability",
                    title: "6. Verfugbarkeit des Dienstes, Anderungsrechte und Haftungsbegrenzung",
                    paragraphs: [
                        "Guzel Invest kann sich das Recht vorbehalten, Inhalte der Website, technische Funktionen, Formulare oder einzelne Seiten ohne vorherige Ankundigung zu aktualisieren, auszusetzen, zu andern oder zu entfernen.",
                        "Soweit nach anwendbarem Recht zulassig, werden genauere Formulierungen zu Ausfallzeiten, technischen Fehlern, mittelbaren Schaden oder Entscheidungen, die ausschliesslich auf Website-Inhalten beruhen, nach juristischer Prufung erganzt.",
                    ],
                },
            ],
            contactTitle: "Fragen und formelle juristische Aktualisierung",
            contactBody:
                "Dieser Entwurf der Nutzungsbedingungen dient als veroffentlichungsreifer Ausgangstext. Formelle Rechtsformulierungen, verbindliche Falle und Ausnahmen werden in spateren Aktualisierungen durch die Rechtsberatung prazisiert.",
            contactPrimaryCta: "Zur Kontaktseite",
            contactSecondaryCta: "Portfolio ansehen",
        },
    },
};

export function getLegalPageCopy(locale: string | null | undefined, slug: LegalPageSlug) {
    return pickLocaleCopy(legalCopy, locale)[slug];
}
