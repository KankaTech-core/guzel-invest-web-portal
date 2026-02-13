"use client";

import { useCallback, useEffect, useMemo, useRef } from "react";
import { useCreateBlockNote } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/mantine";
import { cn } from "@/lib/utils";

interface BlockNoteEditorProps {
    value: string;
    onChange: (nextValue: string) => void;
    onUploadImage?: (file: File) => Promise<string | null>;
    defaultHeading?: string;
    className?: string;
}

const DEFAULT_HEADING = "Başlık";
const normalizeHtml = (value: string): string => value.trim();
const createDefaultEditorHtml = (heading: string): string => `<h1>${heading}</h1><p></p>`;

export function BlockNoteEditor({
    value,
    onChange,
    onUploadImage,
    defaultHeading = DEFAULT_HEADING,
    className,
}: BlockNoteEditorProps) {
    const resolvedHeading = useMemo(
        () => defaultHeading.trim() || DEFAULT_HEADING,
        [defaultHeading]
    );
    const fallbackHtml = useMemo(
        () => normalizeHtml(createDefaultEditorHtml(resolvedHeading)),
        [resolvedHeading]
    );
    // Force initial external-value hydration on first mount so persisted content
    // replaces the editor's placeholder document.
    const lastSyncedHtmlRef = useRef<string>("");
    const isApplyingExternalValueRef = useRef(false);

    const editor = useCreateBlockNote(
        {
            initialContent: [
                { type: "heading", props: { level: 1 }, content: resolvedHeading },
                { type: "paragraph", content: "" },
            ],
            uploadFile: onUploadImage
                ? async (file: File) => {
                    const uploadedUrl = await onUploadImage(file);
                    if (!uploadedUrl) {
                        throw new Error("Görsel yüklenemedi");
                    }
                    return uploadedUrl;
                }
                : undefined,
        },
        [onUploadImage]
    );

    useEffect(() => {
        const incomingHtml = normalizeHtml(value || "");
        const resolvedIncomingHtml = incomingHtml || fallbackHtml;

        if (resolvedIncomingHtml === lastSyncedHtmlRef.current) {
            return;
        }

        isApplyingExternalValueRef.current = true;

        const parsedBlocks = editor.tryParseHTMLToBlocks(resolvedIncomingHtml);
        const safeBlocks =
            parsedBlocks.length > 0
                ? parsedBlocks
                : editor.tryParseHTMLToBlocks(fallbackHtml);

        editor.replaceBlocks(editor.document, safeBlocks);

        const serializedHtml = normalizeHtml(editor.blocksToHTMLLossy(editor.document));
        lastSyncedHtmlRef.current = serializedHtml;

        if (serializedHtml !== incomingHtml) {
            onChange(serializedHtml);
        }

        queueMicrotask(() => {
            isApplyingExternalValueRef.current = false;
        });
    }, [editor, fallbackHtml, onChange, value]);

    const handleEditorChange = useCallback(() => {
        if (isApplyingExternalValueRef.current) {
            return;
        }

        const nextHtml = normalizeHtml(editor.blocksToHTMLLossy(editor.document));
        if (nextHtml === lastSyncedHtmlRef.current) {
            return;
        }

        lastSyncedHtmlRef.current = nextHtml;
        onChange(nextHtml);
    }, [editor, onChange]);

    return (
        <div className={cn("blocknote-shell bg-white", className)}>
            <BlockNoteView
                editor={editor}
                onChange={handleEditorChange}
                formattingToolbar
                linkToolbar
                slashMenu
                sideMenu
                filePanel
                tableHandles
                className="blocknote-surface min-h-[560px] bg-white"
            />
        </div>
    );
}
