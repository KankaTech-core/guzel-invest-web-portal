import { S1DocumentItem } from "../types";

export type DocumentCta =
    | {
          type: "single";
          title: string;
          href: string;
      }
    | {
          type: "multiple";
          title: "Belgelere Gözat";
      }
    | null;

const MULTI_DOCUMENT_TITLE = "Belgelere Gözat" as const;

export const getDocumentCta = (documents: S1DocumentItem[]): DocumentCta => {
    if (documents.length === 0) {
        return null;
    }

    if (documents.length > 1) {
        return {
            type: "multiple",
            title: MULTI_DOCUMENT_TITLE,
        };
    }

    const [singleDocument] = documents;
    const documentName = singleDocument.name.trim();
    const title = documentName ? `${documentName} İndir` : "Belgeyi İndir";

    return {
        type: "single",
        title,
        href: singleDocument.url,
    };
};
