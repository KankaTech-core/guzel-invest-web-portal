export const SAMPLE_ARTICLE_SLUG = "alanya-da-2026-gayrimenkul-yatirim-oyun-plani";

const sampleArticleDate = new Date("2026-01-18T09:00:00.000Z");

export const SAMPLE_ARTICLE = {
    id: "sample-article-alanya-2026",
    slug: SAMPLE_ARTICLE_SLUG,
    title: "Alanya'da 2026 Gayrimenkul Yatırım Oyun Planı",
    excerpt:
        "Alanya'da yatırım yaparken bölge seçimi, kira çarpanı, nakit akışı ve çıkış stratejisini aynı çerçevede nasıl okumak gerekir? Bu rehber, sahadan verilerle karar sürecini sadeleştirir.",
    category: "Yatırım Rehberi",
    tags: ["Alanya", "Yatırım", "Kira Getirisi", "Gayrimenkul Analizi"],
    coverImageUrl:
        "https://images.unsplash.com/photo-1460317442991-0ec209397118?w=2000&h=1200&fit=crop",
    coverThumbnailUrl:
        "https://images.unsplash.com/photo-1460317442991-0ec209397118?w=900&h=580&fit=crop",
    content: `
<p>2026 yılına girerken Alanya piyasasında en kritik fark, <strong>fiyat artışı</strong> değil; <strong>doğru segmentte kalıcı talep yakalayabilmek</strong>. Yatırımcı için asıl soru “nerede daha ucuz?” değil, “nerede daha sürdürülebilir nakit akışı var?” olmalı.</p>

<h2>1) Bölgeyi fiyata göre değil, talep ritmine göre seçin</h2>
<p>Merkez, Oba, Mahmutlar, Kestel ve Avsallar gibi bölgeler aynı şehir içinde farklı kullanıcı profillerine hitap ediyor. Kısa dönem talebin yoğun olduğu bölgeler ile uzun dönem oturum tercih edilen bölgeler arasında kira davranışı ciddi şekilde ayrışıyor.</p>
<ul>
  <li><strong>Merkez ve Oba:</strong> Yüksek likidite, daha hızlı kiralama döngüsü.</li>
  <li><strong>Kestel ve Mahmutlar:</strong> Yabancı talebin güçlü olduğu, metrekare kalitesinin belirleyici olduğu alanlar.</li>
  <li><strong>Avsallar ve çevresi:</strong> Daha uzun vadeli değer artışı odaklı alım stratejilerine uygun segmentler.</li>
</ul>

<h2>2) Kira çarpanını tek başına kullanmayın</h2>
<p>Kira çarpanı hızlı bir filtre için iyi bir metriktir; ancak tek başına yanıltıcı olabilir. Aidat seviyesi, bina yaşı, bakım giderleri ve yıllık boş kalma oranı hesaba katılmadan yapılan karşılaştırmalar gerçek tabloyu vermez.</p>
<blockquote>Doğru yaklaşım: Brüt kira verimini değil, net kira verimini ve işletme maliyetlerini birlikte okumaktır.</blockquote>

<h2>3) Nakit akışı planını 12 aylık değil, 36 aylık kurun</h2>
<p>Profesyonel yatırımcılar mülkü alırken ilk yıl değil, üçüncü yıl görünümüne bakar. Özellikle satın alma maliyeti sonrası tadilat, mobilya ve ilk kiralama döngüsü giderleri toplam getiri üzerinde doğrudan etkili olur.</p>
<p>Yatırım planı hazırlanırken aşağıdaki kalemlerin ilk günden yazılması gerekir:</p>
<ol>
  <li>Satın alma sonrası tek seferlik iyileştirme maliyetleri</li>
  <li>12 aylık aidat, bakım, vergi ve yönetim giderleri</li>
  <li>Kiralama boşluk riski ve alternatif fiyat senaryoları</li>
</ol>

<h2>4) Çıkış stratejisi olmayan alım, eksik yatırımdır</h2>
<p>Mülkü alırken 3. ve 5. yıl çıkış opsiyonlarını tanımlamak, hem pazarlık gücünü hem de varlık yönetimini iyileştirir. Hedef; yalnızca “değerlenmesini beklemek” değil, gerektiğinde hızlı devredebilecek bir varlık inşa etmektir.</p>

<h3>Pratik kontrol listesi</h3>
<ul>
  <li>Tapu ve iskan evrakı tam mı?</li>
  <li>Bina yönetimi ve aidat disiplini sürdürülebilir mi?</li>
  <li>Benzer mülklerde son 6 ayda kapanan kiralama süreleri ne kadar?</li>
  <li>Bölgeye yeni gelen arz, kira seviyelerini baskılar mı?</li>
</ul>

<h2>Sonuç</h2>
<p>Alanya'da doğru yatırım, sadece iyi konum değil; iyi <strong>operasyon modeli</strong> demektir. Bölge verisi, finansal plan ve çıkış senaryosu tek çerçevede birleştiğinde karar kalitesi belirgin şekilde artar.</p>
<p>Portföyünüz için özelleştirilmiş bir analiz istiyorsanız, her mülk için aynı formatta hazırladığımız karşılaştırmalı değerlendirme raporuyla ilerlemek en sağlıklı başlangıçtır.</p>
`,
    publishedAt: sampleArticleDate,
    createdAt: sampleArticleDate,
} as const;

export const SAMPLE_ARTICLE_PREVIEW = {
    id: SAMPLE_ARTICLE.id,
    slug: SAMPLE_ARTICLE.slug,
    title: SAMPLE_ARTICLE.title,
    excerpt: SAMPLE_ARTICLE.excerpt,
    category: SAMPLE_ARTICLE.category,
    tags: SAMPLE_ARTICLE.tags,
    coverImageUrl: SAMPLE_ARTICLE.coverImageUrl,
    coverThumbnailUrl: SAMPLE_ARTICLE.coverThumbnailUrl,
    publishedAt: SAMPLE_ARTICLE.publishedAt,
    createdAt: SAMPLE_ARTICLE.createdAt,
} as const;
