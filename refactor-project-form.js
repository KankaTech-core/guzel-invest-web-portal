const fs = require('fs');
const filepath = 'src/components/admin/project-form.tsx';
let content = fs.readFileSync(filepath, 'utf8');

// 1. Add ChevronDown
if (!content.includes('ChevronDown')) {
    content = content.replace('ArrowLeft, Loader2, Plus, Trash2', 'ArrowLeft, ChevronDown, Loader2, Plus, Trash2');
}

// 2. Add promoVideoUrl to type
if (!content.includes('promoVideoUrl?: string | null')) {
    content = content.replace('documents?: ExistingProjectDocument[];', 'documents?: ExistingProjectDocument[];\n    promoVideoUrl?: string | null;');
}

// 3. Add state
if (!content.includes('promoVideoUrl, setPromoVideoUrl')) {
    content = content.replace(
        'const [documents, setDocuments] = useState<ExistingProjectDocument[]>(',
        'const [promoVideoUrl, setPromoVideoUrl] = useState(project?.promoVideoUrl || "");\n    const [documents, setDocuments] = useState<ExistingProjectDocument[]>('
    );
}

// 4. Add to payload
if (!content.includes('promoVideoUrl: promoVideoUrl.trim()')) {
    content = content.replace(
        'documentMediaIds: parseMediaIds(documentMediaIdsRaw),',
        'documentMediaIds: parseMediaIds(documentMediaIdsRaw),\n            promoVideoUrl: promoVideoUrl.trim() || null,'
    );
}

// 5. Section replacements
function makeSectionCollapsible(sectionRegex, titleRegex, isOpen = false) {
    // Find the section block
    console.log("Replacing section...");
}

// Better to just manually stitch the return body by extracting the inner parts.
// Let's extract each section's inner HTML.

const sections = [
    { id: 'temel', needle: 'Temel Bilgiler', open: true },
    { id: 'konum', needle: 'Konum ve Metrikler', open: true },
    { id: 'ozellikler', needle: 'Proje Özellikleri (Genel + Sosyal)', open: true },
    { id: 'disGorseller', needle: 'Dış Görseller (EXTERIOR)', isMediaField: true, fieldState: 'exteriorMediaIdsRaw', fieldSetter: 'setExteriorMediaIdsRaw' },
    { id: 'icGorseller', needle: 'İç Görseller (INTERIOR)', isMediaField: true, fieldState: 'interiorMediaIdsRaw', fieldSetter: 'setInteriorMediaIdsRaw' },
    { id: 'katPlanlari', needle: 'Kat Planları', open: false },
    { id: 'harita', needle: 'Harita Görselleri (MAP)', isMediaField: true, fieldState: 'mapMediaIdsRaw', fieldSetter: 'setMapMediaIdsRaw' },
    { id: 'video', isNew: true },
    { id: 'sss', needle: 'Sıkça Sorulan Sorular', open: false },
    { id: 'projeler', needle: 'Proje İçi Daireler', open: false },
    { id: 'ozelGaleriler', needle: 'Özel Galeriler', open: false },
    { id: 'belgeler', needle: 'Belge Yükleme', open: false }
];

// Or actually it might be easier to use replace_file_content if I do it chunks by chunks, but the file size is ~60k bytes.
// Multi-replace is perfect.

