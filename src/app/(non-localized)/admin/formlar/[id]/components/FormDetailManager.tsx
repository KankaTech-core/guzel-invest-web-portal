"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { TagInput } from "@/components/admin/tag-input";
import { Select } from "@/components/ui/select";

interface TagData {
    id: string;
    name: string;
    color: string;
}

interface FormDetailManagerProps {
    id: string;
    initialStatus: string;
    initialNotes: string;
    initialTags: TagData[];
}

export function FormDetailManager({
    id,
    initialStatus,
    initialNotes,
    initialTags,
}: FormDetailManagerProps) {
    const router = useRouter();
    const [status, setStatus] = useState(initialStatus);
    const [notes, setNotes] = useState(initialNotes);
    const [tags, setTags] = useState<TagData[]>(initialTags);
    const [isSaving, setIsSaving] = useState(false);
    const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

    const handleSave = async () => {
        setIsSaving(true);
        setMessage(null);
        try {
            const res = await fetch(`/api/admin/forms/${id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    status,
                    notes,
                    tags: tags.map((t) => t.name),
                }),
            });

            if (!res.ok) throw new Error("Failed to save updates");

            setMessage({ type: "success", text: "Değişiklikler kaydedildi." });
            router.refresh();
        } catch (error) {
            console.error(error);
            setMessage({ type: "error", text: "Kaydedilirken bir hata oluştu." });
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="space-y-6 mt-6 pt-6 border-t border-gray-200">
            <h2 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-2">Yönetim Paneli</h2>

            <div className="grid gap-6 sm:grid-cols-2">
                <div>
                    <Select
                        label="Durum"
                        value={status}
                        onChange={setStatus}
                        options={[
                            { value: "NEW", label: "Bekliyor (Yeni Gönderi)" },
                            { value: "IN_PROGRESS", label: "İşlemde (İlgileniliyor)" },
                            { value: "CLOSED", label: "Kapandı (Sonuçlandı)" },
                        ]}
                    />
                </div>

                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Etiketler</label>
                    <TagInput selectedTags={tags} onTagsChange={setTags} />
                </div>
            </div>

            <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Yönetici Notları</label>
                <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={4}
                    placeholder="Bu form/kişi ile ilgili notlarınızı buraya yazabilirsiniz..."
                    className="w-full rounded-md border border-gray-300 py-3 px-3 text-sm focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500 resize-y"
                />
            </div>

            <div className="flex items-center gap-4">
                <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="inline-flex items-center rounded-lg bg-orange-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-orange-700 disabled:opacity-50 shadow-sm"
                >
                    {isSaving ? "Kaydediliyor..." : "Değişiklikleri Kaydet"}
                </button>
                {message && (
                    <span className={`text-sm font-medium ${message.type === "success" ? "text-green-600" : "text-red-600"}`}>
                        {message.text}
                    </span>
                )}
            </div>
        </div>
    );
}
