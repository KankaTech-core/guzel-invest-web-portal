const fs = require("fs");

const filePath = "src/components/admin/project-form.tsx";
let content = fs.readFileSync(filePath, "utf-8");

// 1. Add ChevronDown
content = content.replace(
    /import {([^}]+)ArrowLeft([^}]+)} from "lucide-react";/,
    (match) => {
        if (!match.includes("ChevronDown")) {
            return match.replace("ArrowLeft,", "ArrowLeft, ChevronDown,");
        }
        return match;
    }
);

// 2. Add promoVideoUrl to type ExistingProjectData
if (!content.includes("promoVideoUrl?: string | null;")) {
    content = content.replace(
        "documents?: ExistingProjectDocument[];",
        "promoVideoUrl?: string | null;\n    documents?: ExistingProjectDocument[];"
    );
}

// 3. Add promoVideoUrl state
if (!content.includes("const [promoVideoUrl, setPromoVideoUrl]")) {
    content = content.replace(
        "const [documentMediaIdsRaw, setDocumentMediaIdsRaw] = useState(",
        "const [promoVideoUrl, setPromoVideoUrl] = useState(\n        project?.promoVideoUrl || \"\"\n    );\n    const [documentMediaIdsRaw, setDocumentMediaIdsRaw] = useState("
    );
}

// 4. Add promoVideoUrl to payload
if (!content.includes("promoVideoUrl: promoVideoUrl.trim()")) {
    content = content.replace(
        "documentMediaIds: parseMediaIds(documentMediaIdsRaw),",
        "documentMediaIds: parseMediaIds(documentMediaIdsRaw),\n            promoVideoUrl: promoVideoUrl.trim() || null,"
    );
}

const getSection = (marker) => {
    // Escape regex
    const escapedMarker = marker.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp('<h2[^>]*>\\s*' + escapedMarker + '\\s*</h2>');
    const match = regex.exec(content);

    if (!match) {
        throw new Error("Could not find marker: " + marker);
    }

    let start = match.index;
    start = content.lastIndexOf("<section", start);
    let end = content.indexOf("</section>", start) + "</section>".length;
    return content.substring(start, end);
};

const secTemel = getSection("Temel Bilgiler");
const secKonum = getSection("Konum ve Metrikler");
const secOzellikler = getSection("Proje Özellikleri (Genel + Sosyal)");
const secOzelGaleriler = getSection("Özel Galeriler");
const secDaireler = getSection("Proje İçi Daireler");
const secKat = getSection("Kat Planları");
const secSSS = getSection("Sıkça Sorulan Sorular");
const secMedya = getSection("Proje Medya Kategorileri");

const createDetails = (title, inner, customHeaderRight = "", open = false) => {
    let openAttr = open ? " open" : "";
    return '<details className="group rounded-xl border border-gray-200 bg-white"' + openAttr + '>' +
        '\n    <summary className="flex cursor-pointer list-none items-center justify-between p-5 marker:hidden">' +
        '\n        <div className="flex w-full flex-1 items-center justify-between pr-4">' +
        '\n            <h2 className="text-base font-semibold text-gray-900">' + title + '</h2>' +
        '\n            ' + customHeaderRight +
        '\n        </div>' +
        '\n        <span className="transition-transform group-open:rotate-180">' +
        '\n            <ChevronDown className="h-5 w-5 text-gray-400" />' +
        '\n        </span>' +
        '\n    </summary>' +
        '\n    <div className="border-t border-gray-100 p-5 pt-0 mt-2">' +
        '\n        ' + inner +
        '\n    </div>' +
        '\n</details>';
};

const extractInnerSection = (secHTML) => {
    let innerContent = "";
    let customHeaderRight = "";

    if (secHTML.includes('<div className="flex items-center justify-between">')) {
        let titleBlockEnd = secHTML.indexOf("</div>", secHTML.indexOf('<div className="flex items-center justify-between">')) + "</div>".length;
        innerContent = secHTML.substring(titleBlockEnd);

        let buttonStart = secHTML.indexOf("<button", secHTML.indexOf("<h2"));
        if (buttonStart !== -1 && buttonStart < titleBlockEnd) {
            let buttonEnd = secHTML.indexOf("</button>", buttonStart) + "</button>".length;
            customHeaderRight = secHTML.substring(buttonStart, buttonEnd);
        }
    } else {
        let titleEnd = secHTML.indexOf("</h2>") + "</h2>".length;
        innerContent = secHTML.substring(titleEnd);
    }

    innerContent = innerContent.replace(/\s*<\/section>\s*$/, "");
    return { innerContent, customHeaderRight };
};

const temellerInner = extractInnerSection(secTemel);
const konumInner = extractInnerSection(secKonum);
const ozellikInner = extractInnerSection(secOzellikler);
const ozelGalerilerInner = extractInnerSection(secOzelGaleriler);
const dairelerInner = extractInnerSection(secDaireler);
const katInner = extractInnerSection(secKat);
const sssInner = extractInnerSection(secSSS);

let fileUploadBlockStart = secMedya.indexOf('<div className="mt-5 rounded-lg border border-gray-200 bg-gray-50 p-4">');
let fileUploadBlock = secMedya.substring(fileUploadBlockStart).replace(/\s*<\/section>\s*$/, "");

const createMediaInput = (desc, stateVar, setterFn) => {
    return '<label className="text-sm">' +
        '\n    <span className="mb-1 block text-gray-600">' + desc + '</span>' +
        '\n    <input className="w-full rounded-lg border border-gray-300 px-3 py-2" placeholder="mediaId1, mediaId2" value={' + stateVar + '} onChange={(event) => ' + setterFn + '(event.target.value)} />' +
        '\n</label>';
};

const disGorsellerInner = createMediaInput('Virgülle ayrılmış Media ID listesi girin:', 'exteriorMediaIdsRaw', 'setExteriorMediaIdsRaw');
const icGorsellerInner = createMediaInput('Virgülle ayrılmış Media ID listesi girin:', 'interiorMediaIdsRaw', 'setInteriorMediaIdsRaw');
const haritaGorselleriInner = createMediaInput('Virgülle ayrılmış Media ID listesi girin:', 'mapMediaIdsRaw', 'setMapMediaIdsRaw');
const belgelerGorselleriInner = '<div className="mb-4">' + createMediaInput("Belge Media ID'leri (Virgülle ayrılmış):", 'documentMediaIdsRaw', 'setDocumentMediaIdsRaw') + '</div>\n' + fileUploadBlock;

const videoInner = '<label className="text-sm">' +
    '\n    <span className="mb-1 block text-gray-600">Youtube Video ID\'si veya Linki</span>' +
    '\n    <input className="w-full rounded-lg border border-gray-300 px-3 py-2" placeholder="Örn: https://www.youtube.com/watch?v=..." value={promoVideoUrl} onChange={(event) => setPromoVideoUrl(event.target.value)} />' +
    '\n</label>';

const newSectionsList = [
    createDetails("Temel Bilgiler", temellerInner.innerContent, "", true),
    createDetails("Konum ve Metrikler", konumInner.innerContent, "", true),
    createDetails("Proje Özellikleri (Genel + Sosyal)", ozellikInner.innerContent, ozellikInner.customHeaderRight, false),
    createDetails("Dış Görseller", disGorsellerInner, "", false),
    createDetails("İç Görseller", icGorsellerInner, "", false),
    createDetails("Kat Planları", katInner.innerContent, katInner.customHeaderRight, false),
    createDetails("Harita Görselleri", haritaGorselleriInner, "", false),
    createDetails("Promosyon Videosu", videoInner, "", false),
    createDetails("Sıkça Sorulan Sorular", sssInner.innerContent, sssInner.customHeaderRight, false),
    createDetails("Proje İçi Daireler", dairelerInner.innerContent, dairelerInner.customHeaderRight, false),
    createDetails("Özel Galeriler", ozelGalerilerInner.innerContent, ozelGalerilerInner.customHeaderRight, false),
    createDetails("Belgeler", belgelerGorselleriInner, "", false)
];

const startOfForm = content.indexOf("<section", content.indexOf("return ("));
const endOfForm = content.lastIndexOf("</section>") + "</section>".length;

if (startOfForm !== -1 && endOfForm !== -1) {
    content = content.substring(0, startOfForm) + newSectionsList.join("\n\n") + content.substring(endOfForm);
}

fs.writeFileSync(filePath, content);
console.log("Transformation completed successfully");
