import type { PublicLocale } from "../copy-utils";

export type BlogListCopy = {
    badge: string;
    title: string;
    titleHighlight: string;
    titleEnd: string;
    subtitle: string;
    contactCta: string;
    readLatest: string;
    totalContent: string;
    focusLabel: string;
    focusValue: string;
    latestUpdate: string;
    comingSoon: string;
    publishedPosts: string;
    postsTitle: string;
    contentCount: string;
    newestBadge: string;
    readArticle: string;
    emptyExcerpt: string;
    noPosts: string;
};

export type BlogDetailCopy = {
    back: string;
    quickInfo: string;
    wordCount: string;
    readingTime: string;
    publishDate: string;
    analysisPrompt: string;
    talkToExpert: string;
    nextReading: string;
    relatedArticles: string;
    emptyExcerpt: string;
    noRelated: string;
};

const blogListCopy: Record<PublicLocale, BlogListCopy> = {
    tr: {
        badge: "Yeni • Makale Merkezi",
        title: "Alanya piyasasında",
        titleHighlight: "akıllı platform",
        titleEnd: "içgörüsüyle daha net karar verin.",
        subtitle:
            "Bölge dinamikleri, yatırım disiplini ve operasyonel içgörüyü tek sayfada birleştiren net içerikler. Her makale doğrudan uygulamaya dönük hazırlanır.",
        contactCta: "Uzman Ekiple Görüş",
        readLatest: "Yeni Makaleyi Oku",
        totalContent: "Toplam İçerik",
        focusLabel: "Yayın Odağı",
        focusValue: "Yatırım stratejileri, bölge analizi ve karar rehberleri",
        latestUpdate: "Son Güncelleme",
        comingSoon: "Yakında",
        publishedPosts: "Yayındaki Yazılar",
        postsTitle: "Makaleler",
        contentCount: "içerik",
        newestBadge: "Yeni",
        readArticle: "Makaleyi Oku",
        emptyExcerpt: "Makale özeti yakında eklenecek.",
        noPosts: "Henüz yayınlanmış makale yok.",
    },
    en: {
        badge: "New • Article Hub",
        title: "Make sharper decisions with",
        titleHighlight: "smart platform",
        titleEnd: "insights in the Alanya market.",
        subtitle:
            "Clear content that combines market dynamics, investment discipline, and operational insight on one page. Every article is written for practical use.",
        contactCta: "Talk to the Team",
        readLatest: "Read the Latest Article",
        totalContent: "Total Content",
        focusLabel: "Publishing Focus",
        focusValue: "Investment strategies, area analysis, and decision guides",
        latestUpdate: "Latest Update",
        comingSoon: "Soon",
        publishedPosts: "Published Posts",
        postsTitle: "Articles",
        contentCount: "items",
        newestBadge: "New",
        readArticle: "Read Article",
        emptyExcerpt: "Article summary will be added soon.",
        noPosts: "No published articles yet.",
    },
    ru: {
        badge: "Новое • Центр статей",
        title: "Принимайте более точные решения с",
        titleHighlight: "умной платформой",
        titleEnd: "для рынка Аланьи.",
        subtitle:
            "Понятные материалы, объединяющие динамику рынка, инвестиционную дисциплину и операционные инсайты на одной странице. Каждая статья ориентирована на практику.",
        contactCta: "Связаться с экспертом",
        readLatest: "Читать последнюю статью",
        totalContent: "Всего материалов",
        focusLabel: "Фокус публикаций",
        focusValue: "Инвестиционные стратегии, анализ районов и руководства по решениям",
        latestUpdate: "Последнее обновление",
        comingSoon: "Скоро",
        publishedPosts: "Опубликованные статьи",
        postsTitle: "Статьи",
        contentCount: "материалов",
        newestBadge: "Новое",
        readArticle: "Читать статью",
        emptyExcerpt: "Краткое описание статьи скоро появится.",
        noPosts: "Пока нет опубликованных статей.",
    },
    de: {
        badge: "Neu • Artikelzentrum",
        title: "Treffen Sie klarere Entscheidungen mit",
        titleHighlight: "smarter Plattform",
        titleEnd: "für den Markt in Alanya.",
        subtitle:
            "Klare Inhalte, die Marktdynamik, Anlagedisziplin und operative Einblicke auf einer Seite bündeln. Jeder Artikel ist praxisorientiert geschrieben.",
        contactCta: "Mit dem Team sprechen",
        readLatest: "Neuesten Artikel lesen",
        totalContent: "Gesamtinhalt",
        focusLabel: "Publikationsfokus",
        focusValue: "Anlagestrategien, Gebietsanalyse und Entscheidungsleitfäden",
        latestUpdate: "Letztes Update",
        comingSoon: "Bald",
        publishedPosts: "Veröffentlichte Beiträge",
        postsTitle: "Artikel",
        contentCount: "Inhalte",
        newestBadge: "Neu",
        readArticle: "Artikel lesen",
        emptyExcerpt: "Artikelzusammenfassung folgt in Kürze.",
        noPosts: "Noch keine veröffentlichten Artikel.",
    },
};

const blogDetailCopy: Record<PublicLocale, BlogDetailCopy> = {
    tr: {
        back: "Makalelere dön",
        quickInfo: "Hızlı Bilgi",
        wordCount: "Kelime Sayısı",
        readingTime: "Tahmini Okuma",
        publishDate: "Yayın Tarihi",
        analysisPrompt: "Bu analiz için size özel karşılaştırmalı rapor ister misiniz?",
        talkToExpert: "Uzmanla Görüş",
        nextReading: "Sonraki Okuma",
        relatedArticles: "İlgili Makaleler",
        emptyExcerpt: "Makale özeti yakında eklenecek.",
        noRelated: "Henüz ilgili başka makale bulunmuyor.",
    },
    en: {
        back: "Back to articles",
        quickInfo: "Quick Info",
        wordCount: "Word Count",
        readingTime: "Estimated Reading",
        publishDate: "Publish Date",
        analysisPrompt: "Would you like a custom comparative report for this analysis?",
        talkToExpert: "Talk to an Expert",
        nextReading: "Next Reading",
        relatedArticles: "Related Articles",
        emptyExcerpt: "Article summary will be added soon.",
        noRelated: "No related articles yet.",
    },
    ru: {
        back: "Назад к статьям",
        quickInfo: "Быстрая информация",
        wordCount: "Количество слов",
        readingTime: "Примерное время чтения",
        publishDate: "Дата публикации",
        analysisPrompt: "Хотите персональный сравнительный отчет по этому анализу?",
        talkToExpert: "Поговорить с экспертом",
        nextReading: "Дальше по теме",
        relatedArticles: "Похожие статьи",
        emptyExcerpt: "Краткое описание статьи скоро появится.",
        noRelated: "Пока нет связанных статей.",
    },
    de: {
        back: "Zurück zu den Artikeln",
        quickInfo: "Schnellinfo",
        wordCount: "Wortanzahl",
        readingTime: "Geschätzte Lesedauer",
        publishDate: "Veröffentlichungsdatum",
        analysisPrompt: "Möchten Sie einen individuellen Vergleichsbericht zu dieser Analyse?",
        talkToExpert: "Mit Experten sprechen",
        nextReading: "Weiterlesen",
        relatedArticles: "Verwandte Artikel",
        emptyExcerpt: "Artikelzusammenfassung folgt in Kürze.",
        noRelated: "Noch keine verwandten Artikel vorhanden.",
    },
};

export function getBlogListCopy(locale: string) {
    return blogListCopy[locale as PublicLocale] ?? blogListCopy.tr;
}

export function getBlogDetailCopy(locale: string) {
    return blogDetailCopy[locale as PublicLocale] ?? blogDetailCopy.tr;
}
