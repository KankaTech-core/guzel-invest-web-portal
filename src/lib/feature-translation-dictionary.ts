/**
 * Dictionary-based auto-translation for common real estate feature terms.
 * Used as a fallback when DB translations are missing for non-Turkish locales.
 */

type FeatureTranslations = Record<string, Record<string, string>>;

/**
 * Keys are lowercase-normalized Turkish terms.
 * Values map locale codes to translated strings.
 */
const DICTIONARY: FeatureTranslations = {
    // --- Parking ---
    "kapalı otopark": { en: "Indoor Parking", ru: "Крытая парковка", de: "Tiefgarage" },
    "açık otopark": { en: "Open Parking", ru: "Открытая парковка", de: "Freiparkplatz" },
    otopark: { en: "Parking", ru: "Парковка", de: "Parkplatz" },
    garaj: { en: "Garage", ru: "Гараж", de: "Garage" },

    // --- Views & Nature ---
    deniz: { en: "Sea", ru: "Море", de: "Meer" },
    "deniz manzarası": { en: "Sea View", ru: "Вид на море", de: "Meerblick" },
    "doğa manzarası": { en: "Nature View", ru: "Вид на природу", de: "Naturblick" },
    "dağ manzarası": { en: "Mountain View", ru: "Вид на горы", de: "Bergblick" },
    "şehir manzarası": { en: "City View", ru: "Вид на город", de: "Stadtblick" },
    "göl manzarası": { en: "Lake View", ru: "Вид на озеро", de: "Seeblick" },
    "havuz manzarası": { en: "Pool View", ru: "Вид на бассейн", de: "Poolblick" },

    // --- Pool & Water ---
    havuz: { en: "Pool", ru: "Бассейн", de: "Pool" },
    "yüzme havuzu": { en: "Swimming Pool", ru: "Бассейн", de: "Schwimmbad" },
    "açık havuz": { en: "Outdoor Pool", ru: "Открытый бассейн", de: "Außenpool" },
    "açık yüzme havuzu": { en: "Outdoor Swimming Pool", ru: "Открытый бассейн", de: "Außenschwimmbad" },
    "kapalı yüzme havuzu": { en: "Indoor Swimming Pool", ru: "Крытый бассейн", de: "Hallenschwimmbad" },
    "açık ısıtmalı havuz": { en: "Heated Outdoor Pool", ru: "Открытый подогреваемый бассейн", de: "Beheizter Außenpool" },
    "kapalı ısıtmalı havuz": { en: "Heated Indoor Pool", ru: "Крытый подогреваемый бассейн", de: "Beheiztes Hallenbad" },
    "ısıtmalı havuz": { en: "Heated Pool", ru: "Подогреваемый бассейн", de: "Beheizter Pool" },
    "kapalı havuz": { en: "Indoor Pool", ru: "Крытый бассейн", de: "Hallenbad" },
    "çocuk havuzu": { en: "Kids Pool", ru: "Детский бассейн", de: "Kinderpool" },
    "infinity havuz": { en: "Infinity Pool", ru: "Бассейн инфинити", de: "Infinity-Pool" },
    "sonsuzluk havuzu": { en: "Infinity Pool", ru: "Бассейн инфинити", de: "Infinity-Pool" },
    "aquapark": { en: "Aquapark", ru: "Аквапарк", de: "Aquapark" },
    jakuzi: { en: "Jacuzzi", ru: "Джакузи", de: "Whirlpool" },

    // --- Sports & Fitness ---
    fitness: { en: "Fitness Center", ru: "Фитнес-центр", de: "Fitnesscenter" },
    "fitness salonu": { en: "Gym", ru: "Тренажёрный зал", de: "Fitnessstudio" },
    "spor salonu": { en: "Gym", ru: "Спортзал", de: "Sporthalle" },
    gym: { en: "Gym", ru: "Тренажёрный зал", de: "Fitnessstudio" },
    "spor alanı": { en: "Sports Area", ru: "Спортивная зона", de: "Sportbereich" },
    "pilates salonu": { en: "Pilates Studio", ru: "Зал пилатеса", de: "Pilates-Studio" },
    "yoga alanı": { en: "Yoga Area", ru: "Зона йоги", de: "Yoga-Bereich" },
    "tenis kortu": { en: "Tennis Court", ru: "Теннисный корт", de: "Tennisplatz" },
    "basketbol sahası": { en: "Basketball Court", ru: "Баскетбольная площадка", de: "Basketballplatz" },
    "voleybol sahası": { en: "Volleyball Court", ru: "Волейбольная площадка", de: "Volleyballplatz" },
    "futbol sahası": { en: "Football Field", ru: "Футбольное поле", de: "Fußballplatz" },
    "bisiklet yolu": { en: "Bicycle Path", ru: "Велодорожка", de: "Radweg" },
    "yürüyüş yolu": { en: "Walking Path", ru: "Пешеходная дорожка", de: "Wanderweg" },
    "koşu yolu": { en: "Jogging Track", ru: "Беговая дорожка", de: "Joggingpfad" },

    // --- Spa & Wellness ---
    sauna: { en: "Sauna", ru: "Сауна", de: "Sauna" },
    spa: { en: "Spa", ru: "Спа", de: "Spa" },
    hamam: { en: "Turkish Bath", ru: "Хамам", de: "Hamam" },
    "türk hamamı": { en: "Turkish Bath", ru: "Турецкая баня", de: "Türkisches Bad" },
    "buhar odası": { en: "Steam Room", ru: "Паровая комната", de: "Dampfbad" },
    masaj: { en: "Massage", ru: "Массаж", de: "Massage" },
    "masaj odası": { en: "Massage Room", ru: "Массажный кабинет", de: "Massageraum" },

    // --- Security & Building ---
    güvenlik: { en: "Security", ru: "Охрана", de: "Sicherheit" },
    "7/24 güvenlik": { en: "24/7 Security", ru: "Охрана 24/7", de: "24/7 Sicherheit" },
    "24/7 güvenlik": { en: "24/7 Security", ru: "Охрана 24/7", de: "24/7 Sicherheit" },
    "24 saat güvenlik": { en: "24/7 Security", ru: "Охрана 24/7", de: "24/7 Sicherheit" },
    "güvenlik kamerası": { en: "Security Camera", ru: "Камера наблюдения", de: "Überwachungskamera" },
    "kamera sistemi": { en: "Camera System", ru: "Система камер", de: "Kamerasystem" },
    asansör: { en: "Elevator", ru: "Лифт", de: "Aufzug" },
    jeneratör: { en: "Generator", ru: "Генератор", de: "Generator" },
    "elektrik jeneratörü": { en: "Electric Generator", ru: "Электрогенератор", de: "Stromgenerator" },
    "yangın merdiveni": { en: "Fire Escape", ru: "Пожарная лестница", de: "Feuertreppe" },
    "depreme dayanıklı": { en: "Earthquake Resistant", ru: "Сейсмостойкий", de: "Erdbebensicher" },

    // --- Outdoor & Garden ---
    balkon: { en: "Balcony", ru: "Балкон", de: "Balkon" },
    teras: { en: "Terrace", ru: "Терраса", de: "Terrasse" },
    "çatı terası": { en: "Rooftop Terrace", ru: "Терраса на крыше", de: "Dachterrasse" },
    bahçe: { en: "Garden", ru: "Сад", de: "Garten" },
    "özel bahçe": { en: "Private Garden", ru: "Частный сад", de: "Privatgarten" },
    veranda: { en: "Veranda", ru: "Веранда", de: "Veranda" },
    "barbekü alanı": { en: "BBQ Area", ru: "Зона барбекю", de: "Grillbereich" },
    "piknik alanı": { en: "Picnic Area", ru: "Зона для пикника", de: "Picknickbereich" },

    // --- Indoor Amenities ---
    klima: { en: "Air Conditioning", ru: "Кондиционер", de: "Klimaanlage" },
    "merkezi ısıtma": { en: "Central Heating", ru: "Центральное отопление", de: "Zentralheizung" },
    "yerden ısıtma": { en: "Underfloor Heating", ru: "Тёплый пол", de: "Fußbodenheizung" },
    "doğalgaz": { en: "Natural Gas", ru: "Природный газ", de: "Erdgas" },
    şömine: { en: "Fireplace", ru: "Камин", de: "Kamin" },
    "akıllı ev": { en: "Smart Home", ru: "Умный дом", de: "Smart Home" },
    "akıllı ev sistemi": { en: "Smart Home System", ru: "Система умного дома", de: "Smart-Home-System" },
    "ankastre mutfak": { en: "Built-in Kitchen", ru: "Встроенная кухня", de: "Einbauküche" },
    "giyinme odası": { en: "Walk-in Closet", ru: "Гардеробная", de: "Ankleidezimmer" },
    "çamaşır odası": { en: "Laundry Room", ru: "Прачечная", de: "Waschküche" },

    // --- Social Areas ---
    "çocuk oyun alanı": { en: "Children's Playground", ru: "Детская площадка", de: "Kinderspielplatz" },
    "çocuk parkı": { en: "Children's Park", ru: "Детский парк", de: "Kinderpark" },
    "oyun odası": { en: "Game Room", ru: "Игровая комната", de: "Spielzimmer" },
    "sinema odası": { en: "Cinema Room", ru: "Кинозал", de: "Kinoraum" },
    "sinema salonu": { en: "Cinema Hall", ru: "Кинотеатр", de: "Kinosaal" },
    "toplantı odası": { en: "Meeting Room", ru: "Конференц-зал", de: "Konferenzraum" },
    "sosyal tesis": { en: "Social Facility", ru: "Социальное учреждение", de: "Gemeinschaftseinrichtung" },
    "ortak alan": { en: "Common Area", ru: "Общая зона", de: "Gemeinschaftsbereich" },
    "lobi": { en: "Lobby", ru: "Лобби", de: "Lobby" },
    resepsiyon: { en: "Reception", ru: "Ресепшн", de: "Rezeption" },
    restoran: { en: "Restaurant", ru: "Ресторан", de: "Restaurant" },
    kafe: { en: "Cafe", ru: "Кафе", de: "Café" },
    "kafeterya": { en: "Cafeteria", ru: "Кафетерий", de: "Cafeteria" },
    bar: { en: "Bar", ru: "Бар", de: "Bar" },
    "havuz bar": { en: "Pool Bar", ru: "Бар у бассейна", de: "Poolbar" },
    "vitamin bar": { en: "Vitamin Bar", ru: "Витамин-бар", de: "Vitaminbar" },
    "market": { en: "Market", ru: "Маркет", de: "Markt" },
    "mini market": { en: "Mini Market", ru: "Мини-маркет", de: "Minimarkt" },
    "kuaför": { en: "Hair Salon", ru: "Парикмахерская", de: "Friseursalon" },

    // --- Proximity ---
    "hastaneye yakın": { en: "Close to Hospital", ru: "Рядом с больницей", de: "Nahe zum Krankenhaus" },
    "okula yakın": { en: "Close to School", ru: "Рядом со школой", de: "Nahe zur Schule" },
    "üniversiteye yakın": { en: "Close to University", ru: "Рядом с университетом", de: "Nahe zur Universität" },
    "markete yakın": { en: "Close to Market", ru: "Рядом с магазином", de: "Nahe zum Markt" },
    "plaja yakın": { en: "Close to Beach", ru: "Рядом с пляжем", de: "Nahe zum Strand" },
    "denize yakın": { en: "Close to Sea", ru: "Рядом с морем", de: "Nahe zum Meer" },
    "toplu taşımaya yakın": { en: "Close to Public Transport", ru: "Рядом с транспортом", de: "Nahe zum ÖPNV" },
    "şehir merkezine yakın": { en: "Close to City Center", ru: "Рядом с центром города", de: "Nahe zum Stadtzentrum" },
    "alışveriş merkezine yakın": { en: "Close to Shopping Mall", ru: "Рядом с ТЦ", de: "Nahe zum Einkaufszentrum" },
    "havaalanına yakın": { en: "Close to Airport", ru: "Рядом с аэропортом", de: "Nahe zum Flughafen" },
    "merkezi konum": { en: "Central Location", ru: "Центральное расположение", de: "Zentrale Lage" },

    // --- Floor Plan Terms ---
    "kat planı": { en: "Floor Plan", ru: "Планировка", de: "Grundriss" },
    "zemin kat": { en: "Ground Floor", ru: "Первый этаж", de: "Erdgeschoss" },
    "normal kat": { en: "Standard Floor", ru: "Типовой этаж", de: "Regelgeschoss" },
    "çatı katı": { en: "Penthouse Floor", ru: "Мансарда", de: "Dachgeschoss" },
    penthouse: { en: "Penthouse", ru: "Пентхаус", de: "Penthouse" },
    dubleks: { en: "Duplex", ru: "Дуплекс", de: "Duplex" },
    "bahçe katı": { en: "Garden Floor", ru: "Этаж с садом", de: "Gartengeschoss" },
    "giriş kat": { en: "Entrance Floor", ru: "Входной этаж", de: "Eingangsgeschoss" },

    // --- Property Features ---
    "site içi": { en: "Gated Community", ru: "Закрытый комплекс", de: "Wohnanlage" },
    "müstakil": { en: "Detached", ru: "Отдельно стоящий", de: "Freistehend" },
    "denize sıfır": { en: "Beachfront", ru: "На берегу моря", de: "Direkt am Meer" },
    "eşyalı": { en: "Furnished", ru: "С мебелью", de: "Möbliert" },
    "beyaz eşyalı": { en: "White Goods Included", ru: "С бытовой техникой", de: "Mit Haushaltsgeräten" },
    "tapu hazır": { en: "Title Deed Ready", ru: "Право собственности готово", de: "Grundbuch bereit" },
    "iskan": { en: "Occupancy Permit", ru: "Разрешение на проживание", de: "Nutzungsgenehmigung" },
    "kredi uygun": { en: "Eligible for Mortgage", ru: "Подходит для ипотеки", de: "Kreditfähig" },
    "taksitli": { en: "Installment Available", ru: "Рассрочка", de: "Ratenzahlung möglich" },
    "yatırıma uygun": { en: "Investment Suitable", ru: "Подходит для инвестиций", de: "Investitionsgeeignet" },
    "vatandaşlığa uygun": { en: "Citizenship Eligible", ru: "Подходит для гражданства", de: "Für Staatsbürgerschaft geeignet" },
    "oturma izni": { en: "Residence Permit", ru: "Вид на жительство", de: "Aufenthaltserlaubnis" },

    // --- Additional Amenities ---
    "özel plaj": { en: "Private Beach", ru: "Частный пляж", de: "Privatstrand" },
    "plaj": { en: "Beach", ru: "Пляж", de: "Strand" },
    "güneşlenme alanı": { en: "Sunbathing Area", ru: "Зона для загара", de: "Sonnenterrasse" },
    "su kaydırağı": { en: "Water Slide", ru: "Водная горка", de: "Wasserrutsche" },
    "tenis": { en: "Tennis", ru: "Теннис", de: "Tennis" },
    "masa tenisi": { en: "Table Tennis", ru: "Настольный теннис", de: "Tischtennis" },
    "bilardo": { en: "Billiards", ru: "Бильярд", de: "Billard" },
    "bowling": { en: "Bowling", ru: "Боулинг", de: "Bowling" },
    "kütüphane": { en: "Library", ru: "Библиотека", de: "Bibliothek" },
    "iş merkezi": { en: "Business Center", ru: "Бизнес-центр", de: "Geschäftszentrum" },
    "eczane": { en: "Pharmacy", ru: "Аптека", de: "Apotheke" },
    "kreş": { en: "Nursery", ru: "Детский сад", de: "Kindergarten" },
    "çocuk kulübü": { en: "Kids Club", ru: "Детский клуб", de: "Kinderclub" },
    "mescit": { en: "Prayer Room", ru: "Молельная комната", de: "Gebetsraum" },
    "cami": { en: "Mosque", ru: "Мечеть", de: "Moschee" },
    "camiye yakın": { en: "Close to Mosque", ru: "Рядом с мечетью", de: "Nahe zur Moschee" },

    // --- Transport ---
    otobüs: { en: "Bus", ru: "Автобус", de: "Bus" },
    "otobüs durağı": { en: "Bus Stop", ru: "Автобусная остановка", de: "Bushaltestelle" },
    "otobüse yakın": { en: "Close to Bus Stop", ru: "Рядом с автобусом", de: "Nahe zur Bushaltestelle" },
    metro: { en: "Metro", ru: "Метро", de: "U-Bahn" },
    "metroya yakın": { en: "Close to Metro", ru: "Рядом с метро", de: "Nahe zur U-Bahn" },
    "havaalanı": { en: "Airport", ru: "Аэропорт", de: "Flughafen" },
    "dolmuş": { en: "Minibus", ru: "Долмуш", de: "Dolmuş" },

    // --- Energy ---
    "güneş enerjisi": { en: "Solar Energy", ru: "Солнечная энергия", de: "Solarenergie" },
    "güneş paneli": { en: "Solar Panel", ru: "Солнечная панель", de: "Solarpanel" },
    "ısı yalıtımı": { en: "Thermal Insulation", ru: "Теплоизоляция", de: "Wärmedämmung" },
    "ses yalıtımı": { en: "Sound Insulation", ru: "Звукоизоляция", de: "Schalldämmung" },
    "su deposu": { en: "Water Tank", ru: "Водяной бак", de: "Wassertank" },
    "hidrofor": { en: "Hydrophore", ru: "Гидрофор", de: "Hydrophor" },

    // --- Miscellaneous ---
    "peyzaj": { en: "Landscaping", ru: "Ландшафтный дизайн", de: "Landschaftsgestaltung" },
    "otomasyon": { en: "Automation", ru: "Автоматизация", de: "Automatisierung" },
    "kapıcı": { en: "Doorman", ru: "Консьерж", de: "Hausmeister" },
    "konsiyerj": { en: "Concierge", ru: "Консьерж", de: "Concierge" },
    "uydu": { en: "Satellite", ru: "Спутник", de: "Satellit" },
    "internet": { en: "Internet", ru: "Интернет", de: "Internet" },
    "fiber internet": { en: "Fiber Internet", ru: "Оптоволоконный интернет", de: "Glasfaser-Internet" },
    "kablosuz internet": { en: "Wi-Fi", ru: "Wi-Fi", de: "WLAN" },
    "çelik kapı": { en: "Steel Door", ru: "Стальная дверь", de: "Stahltür" },
    "panjur": { en: "Shutters", ru: "Ставни", de: "Rollläden" },
    "duşakabin": { en: "Shower Cabin", ru: "Душевая кабина", de: "Duschkabine" },
    "küvet": { en: "Bathtub", ru: "Ванна", de: "Badewanne" },
    "hilton banyo": { en: "Luxury Bathroom", ru: "Ванная люкс", de: "Luxusbad" },
    "manzara": { en: "View", ru: "Вид", de: "Aussicht" },
    "panoramik manzara": { en: "Panoramic View", ru: "Панорамный вид", de: "Panoramablick" },
    "geniş balkon": { en: "Spacious Balcony", ru: "Просторный балкон", de: "Geräumiger Balkon" },
    "süit banyo": { en: "En-suite Bathroom", ru: "Ванная в номере", de: "Eigenes Bad" },
    "ebeveyn banyosu": { en: "Master Bathroom", ru: "Ванная в спальне", de: "Elternbad" },
    "açık mutfak": { en: "Open Kitchen", ru: "Открытая кухня", de: "Offene Küche" },
    "kapalı mutfak": { en: "Closed Kitchen", ru: "Закрытая кухня", de: "Geschlossene Küche" },
    "depo": { en: "Storage", ru: "Кладовая", de: "Lagerraum" },
    "kiler": { en: "Pantry", ru: "Кладовая", de: "Speisekammer" },
};

/**
 * Normalizes text for dictionary lookup (lowercase + trim + NFC unicode).
 */
function normalizeKey(text: string): string {
    return text.normalize("NFC").toLocaleLowerCase("tr").trim();
}

/**
 * Translates a feature/term using the built-in dictionary.
 * Returns the translated text if found, otherwise returns the original.
 *
 * @param turkishText - The Turkish text to translate
 * @param targetLocale - The target locale (en, ru, de). Returns original for "tr".
 */
export function translateFeature(turkishText: string, targetLocale: string): string {
    if (!turkishText?.trim()) return turkishText;

    const locale = targetLocale.toLowerCase().split("-")[0];
    if (locale === "tr") return turkishText;

    const key = normalizeKey(turkishText);
    const translations = DICTIONARY[key];
    return translations?.[locale] ?? turkishText;
}

/**
 * Checks if a term exists in the dictionary for the given locale.
 */
export function isInDictionary(text: string, targetLocale: string): boolean {
    const locale = targetLocale.toLowerCase().split("-")[0];
    if (locale === "tr") return true;
    const key = normalizeKey(text);
    return key in DICTIONARY && locale in (DICTIONARY[key] || {});
}

/**
 * Translates an array of feature strings.
 */
export function translateFeatures(features: string[], targetLocale: string): string[] {
    return features.map((feature) => translateFeature(feature, targetLocale));
}
