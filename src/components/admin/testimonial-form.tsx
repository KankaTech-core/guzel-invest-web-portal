"use client";

import { useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, CloudUpload, X } from "lucide-react";

interface TestimonialFormProps {
    readonly testimonial?: {
        id: string;
        name: string;
        quote: string;
        serviceName: string;
        imageUrl: string | null;
    };
}

export function TestimonialForm({ testimonial }: TestimonialFormProps) {
    const router = useRouter();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const isEditing = !!testimonial;

    const [name, setName] = useState(testimonial?.name ?? "");
    const [quote, setQuote] = useState(testimonial?.quote ?? "");
    const [serviceName, setServiceName] = useState(testimonial?.serviceName ?? "");
    const [imageUrl, setImageUrl] = useState<string | null>(testimonial?.imageUrl ?? null);
    const [isUploading, setIsUploading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const minioBaseUrl = process.env.NEXT_PUBLIC_MINIO_URL;

    const uploadFile = useCallback(async (file: File) => {
        setIsUploading(true);
        setError(null);

        try {
            const formData = new FormData();
            formData.append("file", file);

            const res = await fetch("/api/admin/testimonials/upload", {
                method: "POST",
                body: formData,
            });

            if (!res.ok) {
                throw new Error("Upload failed");
            }

            const data = (await res.json()) as { url: string };
            setImageUrl(data.url);
        } catch {
            setError("Görsel yüklenirken bir hata oluştu.");
        } finally {
            setIsUploading(false);
        }
    }, []);

    const handleFileChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            const file = e.target.files?.[0];
            if (file) void uploadFile(file);
        },
        [uploadFile]
    );

    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    }, []);

    const handleDragLeave = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    }, []);

    const handleDrop = useCallback(
        (e: React.DragEvent) => {
            e.preventDefault();
            setIsDragging(false);
            const file = e.dataTransfer.files?.[0];
            if (file) void uploadFile(file);
        },
        [uploadFile]
    );

    const handleSubmit = useCallback(
        async (e: React.FormEvent) => {
            e.preventDefault();
            setIsSaving(true);
            setError(null);

            try {
                const body = { name, quote, serviceName, imageUrl };

                if (isEditing) {
                    const res = await fetch(`/api/admin/testimonials/${testimonial.id}`, {
                        method: "PUT",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify(body),
                    });
                    if (!res.ok) throw new Error("Failed to update");
                } else {
                    const res = await fetch("/api/admin/testimonials", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify(body),
                    });
                    if (!res.ok) throw new Error("Failed to create");
                }

                router.push("/admin/referanslar");
                router.refresh();
            } catch {
                setError("Kaydedilirken bir hata oluştu.");
            } finally {
                setIsSaving(false);
            }
        },
        [name, quote, serviceName, imageUrl, isEditing, testimonial, router]
    );

    return (
        <div className="max-w-[840px] mx-auto">
            <div className="bg-white rounded-xl shadow-[0_16px_40px_rgba(15,23,42,0.08)] border border-gray-100 overflow-hidden">
                {/* Header Section */}
                <div className="px-8 pt-10 pb-6 border-b border-gray-50">
                    <div className="flex items-center gap-3 mb-2">
                        <Link
                            href="/admin/referanslar"
                            className="text-gray-400 hover:text-orange-500 flex items-center gap-1 text-sm transition-colors"
                        >
                            <ArrowLeft className="h-4 w-4" />
                            Referans Listesine Dön
                        </Link>
                    </div>
                    <h1 className="text-gray-900 text-3xl font-extrabold tracking-tight">
                        {isEditing ? "Referansı Düzenle" : "Yeni Referans Ekle"}
                    </h1>
                    <p className="text-gray-500 mt-2">
                        Müşterilerinizin değerli yorumlarını ve görsellerini sisteme kaydedin.
                    </p>
                </div>

                {/* Form Section */}
                <form onSubmit={handleSubmit}>
                    <div className="p-8 space-y-8">
                        {/* Two Column Row */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <label className="flex flex-col gap-2">
                                <span className="text-gray-700 text-sm font-bold uppercase tracking-wider">
                                    İsim
                                </span>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="input h-12"
                                    placeholder="Müşteri adı ve soyadı"
                                    required
                                />
                            </label>
                            <label className="flex flex-col gap-2">
                                <span className="text-gray-700 text-sm font-bold uppercase tracking-wider">
                                    Alınan Hizmet
                                </span>
                                <input
                                    type="text"
                                    value={serviceName}
                                    onChange={(e) => setServiceName(e.target.value)}
                                    className="input h-12"
                                    placeholder="Örn: Konut Satışı, Kiralama"
                                    required
                                />
                            </label>
                        </div>

                        {/* Textarea Row */}
                        <label className="flex flex-col gap-2">
                            <span className="text-gray-700 text-sm font-bold uppercase tracking-wider">
                                Alıntı (Müşteri Yorumu)
                            </span>
                            <textarea
                                value={quote}
                                onChange={(e) => setQuote(e.target.value)}
                                className="input resize-none p-4"
                                placeholder="Müşterinizin deneyimini buraya aktarın..."
                                rows={5}
                                required
                            />
                        </label>

                        {/* Upload Row */}
                        <div className="flex flex-col gap-2">
                            <span className="text-gray-700 text-sm font-bold uppercase tracking-wider">
                                Görsel
                            </span>

                            {imageUrl ? (
                                <div className="relative rounded-xl border border-gray-200 bg-gray-50 p-6">
                                    <div className="flex items-center gap-6">
                                        <div className="relative w-24 h-24 rounded-full overflow-hidden border-2 border-gray-100 shrink-0">
                                            <Image
                                                src={`${minioBaseUrl}/guzel-invest/${imageUrl}`}
                                                alt="Referans görseli"
                                                fill
                                                className="object-cover"
                                            />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-sm text-gray-600 font-medium">
                                                Görsel yüklendi
                                            </p>
                                            <p className="text-xs text-gray-400 mt-1 break-all">
                                                {imageUrl}
                                            </p>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => setImageUrl(null)}
                                            className="p-2 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors"
                                        >
                                            <X className="h-5 w-5" />
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div
                                    className={`relative cursor-pointer border-2 border-dashed rounded-xl bg-gray-50 hover:border-orange-300 transition-all p-12 ${isDragging
                                            ? "border-orange-400 bg-orange-50"
                                            : "border-gray-200"
                                        }`}
                                    onDragOver={handleDragOver}
                                    onDragLeave={handleDragLeave}
                                    onDrop={handleDrop}
                                    onClick={() => fileInputRef.current?.click()}
                                >
                                    <div className="flex flex-col items-center justify-center text-center">
                                        <div className="w-16 h-16 mb-4 rounded-full bg-orange-50 flex items-center justify-center text-orange-500 group-hover:scale-110 transition-transform">
                                            <CloudUpload className="h-8 w-8" />
                                        </div>
                                        <p className="text-gray-900 font-semibold text-lg">
                                            {isUploading
                                                ? "Yükleniyor..."
                                                : "Görsel yüklemek için tıklayın veya sürükleyin"}
                                        </p>
                                        <p className="text-gray-500 mt-1 text-sm">
                                            PNG, JPG veya WEBP (Max. 5MB)
                                        </p>
                                    </div>
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        accept="image/*"
                                        onChange={handleFileChange}
                                        className="hidden"
                                    />
                                </div>
                            )}
                        </div>

                        {error && (
                            <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600">
                                {error}
                            </div>
                        )}
                    </div>

                    {/* Actions Footer */}
                    <div className="px-8 py-6 bg-gray-50 flex justify-end gap-4">
                        <Link
                            href="/admin/referanslar"
                            className="px-6 py-3 rounded-lg border border-gray-300 text-gray-600 font-bold hover:bg-gray-100 transition-colors text-sm"
                        >
                            İptal
                        </Link>
                        <button
                            type="submit"
                            disabled={isSaving || isUploading}
                            className="btn btn-primary px-10 py-3 disabled:opacity-50"
                        >
                            {isSaving ? "Kaydediliyor..." : "Kaydet"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
