const fs = require("fs");

const filePath = "src/app/(non-localized)/admin/projeler/yeni/components/NewProjectForm.tsx";
let content = fs.readFileSync(filePath, "utf-8");

// 1. Add ChevronDown icon
if (!content.includes("ChevronDown")) {
    content = content.replace(
        /import {([^}]*?)ArrowLeft([^}]*?)} from "lucide-react";/s,
        (match) => {
            return match.replace("ArrowLeft,", "ArrowLeft, ChevronDown,");
        }
    );
}

// 2. Extract sections safely
const extractElement = (contentStr, startIdx, tagName) => {
    let depth = 0;
    let i = startIdx;
    let endIdx = -1;
    const openTag = `<${tagName}`;
    const closeTag = `</${tagName}>`;

    while (i < contentStr.length) {
        // match <tag ...> or <tag> but NOT <tag.
        if (contentStr.substring(i, i + openTag.length) === openTag &&
            !contentStr.substring(i, i + openTag.length + 1).startsWith(`${openTag}.`)) {
            depth++;
            i += openTag.length;
        } else if (contentStr.substring(i, i + closeTag.length) === closeTag) {
            depth--;
            if (depth === 0) {
                endIdx = i + closeTag.length;
                break;
            }
            i += closeTag.length;
        } else {
            i++;
        }
    }

    if (endIdx === -1) {
        throw new Error(`Failed to find end of ${tagName} starting at ${startIdx}`);
    }

    return {
        html: contentStr.substring(startIdx, endIdx),
        startIdx,
        endIdx
    };
};

const extractSectionById = (id) => {
    const startIdx = content.indexOf(`<section id="${id}"`);
    if (startIdx === -1) throw new Error("Could not find section " + id);
    return extractElement(content, startIdx, "section");
};

const secDetails = extractSectionById("section-details");
const secFeatures = extractSectionById("section-features");
const secLocation = extractSectionById("section-location");
const secMedia = extractSectionById("section-media");
const secUnits = extractSectionById("section-units");
const secFaq = extractSectionById("section-faq");

// Extract the 'Video' chunk out of 'section-details'
const videoStart = secDetails.html.indexOf('<div className="space-y-4">\n                                            <h3 className="text-sm font-bold flex items-center gap-2 text-slate-900">\n                                                <PlayCircle');
let videoElement = extractElement(secDetails.html, videoStart, "div");
let remainingDetailsHtml = secDetails.html.substring(0, videoElement.startIdx) + secDetails.html.substring(videoElement.endIdx);

// Wrap a general chunk in details
const wrapDetails = (titleHtml, innerHtml, id, open = false) => {
    titleHtml = titleHtml.replace(/border-b border-slate-100 pb-4|border-t border-slate-100 pt-8 border-b pb-4/, "").trim();
    if (titleHtml.startsWith("<div")) {
        // Just extract the h2 or h3 inside
        const match = titleHtml.match(/<h[23][^>]*>[\s\S]*?<\/h[23]>/);
        if (match) titleHtml = match[0];
    }
    return `<details id="${id}" className="group rounded-xl border border-slate-200 bg-white scroll-mt-28"${open ? " open" : ""}>
    <summary className="flex cursor-pointer list-none items-center justify-between p-6 marker:hidden">
        <div className="flex w-full flex-1 items-center justify-between pr-4">
            ${titleHtml}
        </div>
        <span className="transition-transform group-open:rotate-180 shrink-0 ml-4">
            <ChevronDown className="h-5 w-5 text-slate-400" />
        </span>
    </summary>
    <div className="border-t border-slate-100 p-6 pt-2">
        ${innerHtml}
    </div>
</details>`;
};

// Process Section Details
let detailsTitle = remainingDetailsHtml.match(/<div className="border-b border-slate-100 pb-4">[\s\S]*?<\/h2>\s*<\/div>/)[0];
let detailsInner = remainingDetailsHtml.replace(detailsTitle, "").replace(/<section id="section-details"[^>]*>/, "").replace(/<\/section>$/, "").trim();
const compiledDetails = wrapDetails(detailsTitle, detailsInner, "section-details", true);

// Process Section Features
let featuresTitleHtml = `<h2 className="text-lg font-semibold text-slate-900 flex items-center gap-2"><Sparkles className="w-5 h-5 text-orange-500" />Proje Özellikleri</h2>`;
let featuresInner = secFeatures.html.replace(/<section id="section-features"[^>]*>/, "").replace(/<\/section>$/, "").trim();
const compiledFeatures = wrapDetails(featuresTitleHtml, featuresInner, "section-features", false);

// Process Section Location
let locationTitleHtml = secLocation.html.match(/<div className="border-t border-slate-100 pt-8 border-b pb-4">[\s\S]*?<\/h2>\s*<\/div>/)[0];
let locationInner = secLocation.html.replace(locationTitleHtml, "").replace(/<section id="section-location"[^>]*>/, "").replace(/<\/section>$/, "").trim();
const compiledLocation = wrapDetails(locationTitleHtml, locationInner, "section-location", false);

// Process Section Media (split it)
let mediaInner = secMedia.html.replace(/<section id="section-media"[^>]*>/, "").replace(/<\/section>$/, "").trim();

// The sub-sections inside mediaInner are wrapped in div.space-y-6 or section.space-y-6
// 1. Exterior
let extStartIdx = mediaInner.indexOf('<div className="space-y-6">');
let exteriorElement = extractElement(mediaInner, extStartIdx, "div");
let extTitleMatch = exteriorElement.html.match(/<div className="border-t border-slate-100 pt-8 border-b pb-4">[\s\S]*?<\/h2>[\s\S]*?<\/div>/);
let extInner = exteriorElement.html.replace(extTitleMatch[0], "").replace(/<div className="space-y-6">/, "").replace(/<\/div>$/, "").trim();
const compiledExterior = wrapDetails(extTitleMatch[0], extInner, "section-media-exterior", false);

// 2. Social
let socStartIdx = mediaInner.indexOf('<div className="space-y-6">', exteriorElement.endIdx);
let socialElement = extractElement(mediaInner, socStartIdx, "div");
let socTitleMatch = socialElement.html.match(/<div className="border-t border-slate-100 pt-8 border-b pb-4">[\s\S]*?<\/h2>[\s\S]*?<\/div>/);
let socInner = socialElement.html.replace(socTitleMatch[0], "").replace(/<div className="space-y-6">/, "").replace(/<\/div>$/, "").trim();
const compiledSocial = wrapDetails(socTitleMatch[0], socInner, "section-media-social", false);

// 3. Interior
let intStartIdx = mediaInner.indexOf('<div className="space-y-6">', socialElement.endIdx);
let interiorElement = extractElement(mediaInner, intStartIdx, "div");
let intTitleMatch = interiorElement.html.match(/<div className="border-t border-slate-100 pt-8 border-b pb-4">[\s\S]*?<\/h2>[\s\S]*?<\/div>/);
let intInner = interiorElement.html.replace(intTitleMatch[0], "").replace(/<div className="space-y-6">/, "").replace(/<\/div>$/, "").trim();
const compiledInterior = wrapDetails(intTitleMatch[0], intInner, "section-media-interior", false);

// 4. Documents
let docStartIdx = mediaInner.indexOf('<section className="space-y-6">', interiorElement.endIdx);
let docElement = extractElement(mediaInner, docStartIdx, "section");
let docTitleMatch = docElement.html.match(/<div className="border-t border-slate-100 pt-8 border-b pb-4">[\s\S]*?<\/h2>\s*<\/div>/);
let docInner = docElement.html.replace(docTitleMatch[0], "").replace(/<section className="space-y-6">/, "").replace(/<\/section>$/, "").trim();
const compiledDoc = wrapDetails(docTitleMatch[0], docInner, "section-media-doc", false);

// Process Section Units
let unitsTitleMatch = secUnits.html.match(/<div className="border-t border-slate-100 pt-8 border-b pb-4">[\s\S]*?<\/h2>\s*<\/div>/);
let unitsInner = secUnits.html.replace(unitsTitleMatch[0], "").replace(/<section id="section-units"[^>]*>/, "").replace(/<\/section>$/, "").trim();
const compiledUnits = wrapDetails(unitsTitleMatch[0], unitsInner, "section-units", false);

// Process Section Faq
let faqTitleMatch = secFaq.html.match(/<div className="border-t border-slate-100 pt-8 border-b pb-4 flex items-center justify-between">[\s\S]*?<\/button>\s*<\/div>/);
let faqInner = secFaq.html.replace(faqTitleMatch[0], "").replace(/<section id="section-faq"[^>]*>/, "").replace(/<\/section>$/, "").trim();
// Extract the button from faqTitleMatch and move it to header
let faqBtnMatch = faqTitleMatch[0].match(/<button[\s\S]*?<\/button>/);
let faqH2Match = faqTitleMatch[0].match(/<h2[\s\S]*?<\/h2>/);
let faqHeaderHtml = faqH2Match[0];
if (faqBtnMatch) {
    faqHeaderHtml = faqH2Match[0] + " " + faqBtnMatch[0];
}
const compiledFaq = wrapDetails(faqHeaderHtml, faqInner, "section-faq", false);

// Assemble Video Section
let videoSectionTitleHtml = '<h2 className="text-lg font-semibold text-slate-900 flex items-center gap-2"><PlayCircle className="w-5 h-5 text-orange-500" />Promosyon Videosu</h2>';
let videoInner = videoElement.html.replace(/<div className="space-y-4">/, "").replace(/<\/div>$/, "").replace(/<h3[\s\S]*?<\/h3>/, "").trim();
const compiledVideo = wrapDetails(videoSectionTitleHtml, videoInner, "section-promo-video", false);

const newSectionsLayout = [
    compiledDetails,
    compiledFeatures,
    compiledSocial,
    compiledExterior,
    compiledInterior,
    compiledUnits,
    compiledLocation,
    compiledVideo,
    compiledDoc,
    compiledFaq
].join("\n\n");

const completeReplacement = content.substring(0, secDetails.startIdx) + newSectionsLayout + "\n" + content.substring(secFaq.endIdx);
fs.writeFileSync(filePath, completeReplacement);
console.log("Success");
