export type ServiceDefinition = {
    slug: string;
    title: string;
    summary: string;
    description: string;
    highlights: string[];
};

export const serviceDefinitions: ServiceDefinition[] = [
    {
        slug: "satilik-kiralik-portfoy-danismanligi",
        title: "Satılık / Kiralık Portföy Danışmanlığı",
        summary: "Bütçenize, yaşam planınıza ve yatırım hedefinize uygun portföy eşleştirmesi.",
        description:
            "Alanya odağında satılık ve kiralık seçenekleri tek bir süreçte değerlendiriyoruz. Sadece ilan göstermek yerine ihtiyaç analizinden nihai seçime kadar adım adım yönlendiriyoruz.",
        highlights: ["İhtiyaç analizi", "Bölge karşılaştırması", "Sahada birebir gösterim"],
    },
    {
        slug: "arsa-ve-proje-danismanligi",
        title: "Arsa ve Proje Danışmanlığı",
        summary: "İmar, konum ve gelişim potansiyeli üzerinden arsa/proje analizi.",
        description:
            "Arsa ve proje yatırımlarında mevzuat, imar planı ve bölgesel büyüme verilerini birlikte ele alıyoruz. Doğru parselin veya doğru projenin seçimi için teknik ve ticari değerlendirme sunuyoruz.",
        highlights: ["İmar uygunluk kontrolü", "Parsel potansiyel analizi", "Geliştirici/proje incelemesi"],
    },
    {
        slug: "proje-satin-alma-operasyonlari",
        title: "Proje Satın Alma Operasyonları",
        summary: "Yeni veya devam eden projelerde satın alma sürecinin uçtan uca yönetimi.",
        description:
            "Proje satın alımında sözleşme koşulları, teslim takvimi ve ödeme planı birlikte değerlendirilir. Riskleri önceden görünür kılarak daha güvenli bir satın alma süreci sağlıyoruz.",
        highlights: ["Sözleşme değerlendirmesi", "Ödeme planı optimizasyonu", "Teslim süreci takibi"],
    },
    {
        slug: "dogrudan-satin-alim-programi",
        title: "Doğrudan Satın Alım Programı",
        summary: "Firma, uygun daire/arsa/projeleri doğrudan satın alabilen bir yapıya sahiptir.",
        description:
            "Sadece satışa aracılık etmiyoruz, uygun bulunan mülkler için doğrudan satın alım da yapıyoruz. Bu model mülk sahiplerine hızlı ve net karar süreçleri sunar.",
        highlights: ["Hızlı ön değerlendirme", "Şeffaf teklif modeli", "Kısa sürede sonuçlandırma"],
    },
    {
        slug: "resmi-surec-ve-tapu-yonetimi",
        title: "Resmi Süreç ve Tapu Yönetimi",
        summary: "Tapu, noter, resmi başvuru ve belge adımlarının koordinasyonu.",
        description:
            "Satın alma ya da satış sonrası resmi işlemlerde süreç yönetimini tek merkezden yürütüyoruz. Evrak takibi, randevu planlaması ve işlem adımları düzenli bir takvimde ilerler.",
        highlights: ["Evrak listesi ve takip", "Tapu/noter koordinasyonu", "Süreç durum bilgilendirmesi"],
    },
    {
        slug: "satis-sonrasi-mulk-yonetimi",
        title: "Satış Sonrası Mülk Yönetimi",
        summary: "Teslim sonrası kiralama, bakım ve operasyon süreçlerinde devam eden destek.",
        description:
            "Satış veya satın alma sonrası ilişkiyi kesmiyoruz. Mülkün kullanım, kiralama ve bakım süreçlerinde operasyonel destekle yatırımın sürdürülebilirliğini koruyoruz.",
        highlights: ["Kiralama desteği", "Bakım/işletme koordinasyonu", "Uzun vadeli müşteri takibi"],
    },
    {
        slug: "finansman-ve-yatirim-planlama",
        title: "Finansman ve Yatırım Planlama",
        summary: "Ödeme planı, finansman seçenekleri ve bütçe yapısına uygun danışmanlık.",
        description:
            "Yatırım kararını yalnızca mülk seçimiyle sınırlamıyor, finansman yapısını da birlikte tasarlıyoruz. Böylece nakit akışı ve ödeme dengesine uygun bir plan oluşturuyoruz.",
        highlights: ["Bütçe senaryoları", "Finansman alternatifleri", "Uzun vadeli planlama"],
    },
];

