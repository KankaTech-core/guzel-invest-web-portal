import type { PublicLocale } from "../copy-utils";

export type ContactCopy = {
    cards: Array<{
        title: string;
        value: string;
    }>;
    introTitle: string;
    introText: string;
    heroBadge: string;
    heroTitle: string;
    heroText: string;
    heroCallPhone: string;
    heroSendEmail: string;
    whatsapp: string;
    instagram: string;
    formTitle: string;
    formSubtitle: string;
    nameLabel: string;
    namePlaceholder: string;
    surnameLabel: string;
    surnamePlaceholder: string;
    emailLabel: string;
    emailPlaceholder: string;
    phoneLabel: string;
    subjectLabel: string;
    subjectPlaceholder: string;
    messageLabel: string;
    messagePlaceholder: string;
    terms: string;
    submit: string;
    submitted: string;
    phoneError: string;
    acceptTermsError: string;
    submitError: string;
};

const contactCopy: Record<PublicLocale, ContactCopy> = {
    tr: {
        cards: [
            { title: "Adres", value: "Saray, Sugözü Cd. Akdoğan Tokuş Apt No: 15/B,\n07400 Alanya/Antalya" },
            { title: "Telefon", value: "+90 538 475 11 11" },
            { title: "E-posta", value: "info@guzelinvest.com" },
            { title: "Çalışma Saatleri", value: "Pazar günleri kapalı\nDiğer günler 09:00 - 19:00" },
        ],
        introTitle: "İletişim Bilgileri",
        introText:
            "Farklı iletişim kanallarından bize ulaşabilir, ihtiyaçlarınıza uygun danışmanlık sürecini hemen başlatabilirsiniz.",
        heroBadge: "İletişim • Güzel Invest",
        heroTitle: "İletişime Geçin",
        heroText:
            "Sorularınız, portföy talepleriniz ve yatırım hedefleriniz için bizimle doğrudan iletişime geçin. Ekibimiz size kısa sürede net bir geri dönüş sağlar.",
        heroCallPhone: "Hemen Ara",
        heroSendEmail: "E-posta Gönder",
        whatsapp: "WhatsApp'tan Yaz",
        instagram: "Instagram DM",
        formTitle: "Bize Mesaj Gönderin",
        formSubtitle: "Formu doldurun, uzman ekibimiz size en kısa sürede dönüş yapsın.",
        nameLabel: "Adınız",
        namePlaceholder: "Adınızı girin",
        surnameLabel: "Soyadınız",
        surnamePlaceholder: "Soyadınızı girin",
        emailLabel: "E-posta Adresiniz",
        emailPlaceholder: "ornek@email.com",
        phoneLabel: "Telefon Numaranız",
        subjectLabel: "Konu",
        subjectPlaceholder: "Mesaj konusu",
        messageLabel: "Mesajınız",
        messagePlaceholder: "Mesajınızı buraya yazın...",
        terms: "Kullanıcı metnini okudum, iletişim kurulmasını kabul ediyorum.",
        submit: "Mesaj Gönder",
        submitted: "Mesajınız alındı. Ekibimiz en kısa sürede sizinle iletişime geçecektir.",
        phoneError: "Geçerli bir telefon numarası girin.",
        acceptTermsError: "Lütfen koşulları kabul ettiğinizi onaylayın.",
        submitError: "Mesajınız gönderilirken bir hata oluştu. Lütfen tekrar deneyin.",
    },
    en: {
        cards: [
            { title: "Address", value: "Saray, Sugözü Cd. Akdoğan Tokuş Apt No: 15/B,\n07400 Alanya/Antalya" },
            { title: "Phone", value: "+90 538 475 11 11" },
            { title: "Email", value: "info@guzelinvest.com" },
            { title: "Working Hours", value: "Closed on Sundays\nOther days 09:00 - 19:00" },
        ],
        introTitle: "Contact Information",
        introText:
            "You can reach us through different communication channels and start the advisory process that fits your needs right away.",
        heroBadge: "Contact • Güzel Invest",
        heroTitle: "Get in Touch",
        heroText:
            "Contact us directly for your questions, portfolio requests, and investment goals. Our team will get back to you quickly with a clear response.",
        heroCallPhone: "Call Now",
        heroSendEmail: "Send Email",
        whatsapp: "Write on WhatsApp",
        instagram: "Instagram DM",
        formTitle: "Send Us a Message",
        formSubtitle: "Fill out the form and our expert team will get back to you as soon as possible.",
        nameLabel: "Your Name",
        namePlaceholder: "Enter your name",
        surnameLabel: "Your Surname",
        surnamePlaceholder: "Enter your surname",
        emailLabel: "Email Address",
        emailPlaceholder: "name@example.com",
        phoneLabel: "Phone Number",
        subjectLabel: "Subject",
        subjectPlaceholder: "Message subject",
        messageLabel: "Your Message",
        messagePlaceholder: "Write your message here...",
        terms: "I have read the user text and agree to be contacted.",
        submit: "Send Message",
        submitted: "Your message has been received. Our team will contact you shortly.",
        phoneError: "Please enter a valid phone number.",
        acceptTermsError: "Please confirm that you accept the terms.",
        submitError: "An error occurred while sending your message. Please try again.",
    },
    ru: {
        cards: [
            { title: "Адрес", value: "Saray, Sugözü Cd. Akdoğan Tokuş Apt No: 15/B,\n07400 Alanya/Antalya" },
            { title: "Телефон", value: "+90 538 475 11 11" },
            { title: "Эл. почта", value: "info@guzelinvest.com" },
            { title: "Часы работы", value: "Воскресенье выходной\nОстальные дни 09:00 - 19:00" },
        ],
        introTitle: "Контактная информация",
        introText:
            "Связаться с нами можно через разные каналы, и вы можете сразу начать консультацию, подходящую под ваши задачи.",
        heroBadge: "Контакты • Güzel Invest",
        heroTitle: "Свяжитесь с нами",
        heroText:
            "Пишите нам по вопросам, запросам на подбор объектов и инвестиционным целям. Наша команда быстро даст вам понятный ответ.",
        heroCallPhone: "Позвонить",
        heroSendEmail: "Отправить письмо",
        whatsapp: "Написать в WhatsApp",
        instagram: "Instagram DM",
        formTitle: "Отправьте нам сообщение",
        formSubtitle: "Заполните форму, и наша команда скоро свяжется с вами.",
        nameLabel: "Ваше имя",
        namePlaceholder: "Введите имя",
        surnameLabel: "Ваша фамилия",
        surnamePlaceholder: "Введите фамилию",
        emailLabel: "Электронная почта",
        emailPlaceholder: "name@example.com",
        phoneLabel: "Номер телефона",
        subjectLabel: "Тема",
        subjectPlaceholder: "Тема сообщения",
        messageLabel: "Ваше сообщение",
        messagePlaceholder: "Введите сообщение здесь...",
        terms: "Я прочитал текст и согласен на связь со мной.",
        submit: "Отправить сообщение",
        submitted: "Ваше сообщение получено. Наша команда скоро с вами свяжется.",
        phoneError: "Введите действительный номер телефона.",
        acceptTermsError: "Подтвердите согласие с условиями.",
        submitError: "Во время отправки сообщения произошла ошибка. Попробуйте снова.",
    },
    de: {
        cards: [
            { title: "Adresse", value: "Saray, Sugözü Cd. Akdoğan Tokuş Apt No: 15/B,\n07400 Alanya/Antalya" },
            { title: "Telefon", value: "+90 538 475 11 11" },
            { title: "E-Mail", value: "info@guzelinvest.com" },
            { title: "Öffnungszeiten", value: "Sonntags geschlossen\nAn den anderen Tagen 09:00 - 19:00" },
        ],
        introTitle: "Kontaktinformationen",
        introText:
            "Sie erreichen uns über verschiedene Kanäle und können den passenden Beratungsprozess sofort starten.",
        heroBadge: "Kontakt • Güzel Invest",
        heroTitle: "Kontakt aufnehmen",
        heroText:
            "Kontaktieren Sie uns direkt bei Fragen, Portfoliowünschen und Investitionszielen. Unser Team antwortet Ihnen schnell und klar.",
        heroCallPhone: "Jetzt anrufen",
        heroSendEmail: "E-Mail senden",
        whatsapp: "Über WhatsApp schreiben",
        instagram: "Instagram DM",
        formTitle: "Senden Sie uns eine Nachricht",
        formSubtitle: "Füllen Sie das Formular aus, und unser Expertenteam meldet sich so schnell wie möglich zurück.",
        nameLabel: "Ihr Name",
        namePlaceholder: "Name eingeben",
        surnameLabel: "Ihr Nachname",
        surnamePlaceholder: "Nachname eingeben",
        emailLabel: "E-Mail-Adresse",
        emailPlaceholder: "name@example.com",
        phoneLabel: "Telefonnummer",
        subjectLabel: "Betreff",
        subjectPlaceholder: "Nachrichtenthema",
        messageLabel: "Ihre Nachricht",
        messagePlaceholder: "Schreiben Sie Ihre Nachricht hier...",
        terms: "Ich habe den Text gelesen und stimme einer Kontaktaufnahme zu.",
        submit: "Nachricht senden",
        submitted: "Ihre Nachricht wurde empfangen. Unser Team wird sich in Kürze bei Ihnen melden.",
        phoneError: "Bitte geben Sie eine gültige Telefonnummer ein.",
        acceptTermsError: "Bitte bestätigen Sie, dass Sie den Bedingungen zustimmen.",
        submitError: "Beim Senden Ihrer Nachricht ist ein Fehler aufgetreten. Bitte versuchen Sie es erneut.",
    },
};

export function getContactCopy(locale: string) {
    return contactCopy[locale as PublicLocale] ?? contactCopy.tr;
}
