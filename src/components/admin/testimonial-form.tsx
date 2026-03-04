"use client";

import { useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, CloudUpload, X } from "lucide-react";
import { getMediaUrl } from "@/lib/utils";

interface TestimonialFormProps {
    readonly testimonial?: {
        id: string;
        name: string;
        quote: string;
        serviceName: string;
        imageUrl: string | null;
        videoUrl?: string | null;
    };
}

export function TestimonialForm({ testimonial }: TestimonialFormProps) {
    const router = useRouter();
    const imageFileInputRef = useRef<HTMLInputElement>(null);
    const videoFileInputRef = useRef<HTMLInputElement>(null);
    const isEditing = !!testimonial;

    const [name, setName] = useState(testimonial?.name ?? "");
    const [quote, setQuote] = useState(testimonial?.quote ?? "");
    const [serviceName, setServiceName] = useState(testimonial?.serviceName ?? "");
    const [imageUrl, setImageUrl] = useState<string | null>(testimonial?.imageUrl ?? null);
    const [videoUrl, setVideoUrl] = useState<string>(testimonial?.videoUrl ?? "");
    const [isImageUploading, setIsImageUploading] = useState(false);
    const [isVideoUploading, setIsVideoUploading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [isImageDragging, setIsImageDragging] = useState(false);
    const [isVideoDragging, setIsVideoDragging] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const isUploading = isImageUploading || isVideoUploading;

    const resolveEmbedUrl = (value: string): string | null => {
        const input = value.trim();
        if (!input) return null;

        if (
            input.includes("youtube.com/embed/") ||
            input.includes("player.vimeo.com/video/")
        ) {
            return input;
        }

        const youtubeMatch = input.match(
            /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/
        );
        if (youtubeMatch && youtubeMatch[2].length === 11) {
            return `https://www.youtube.com/embed/${youtubeMatch[2]}`;
        }

        const vimeoMatch = input.match(/vimeo\.com\/(?:.*#|.*\/videos\/)?([0-9]+)/);
        if (vimeoMatch && vimeoMatch[1]) {
            return `https://player.vimeo.com/video/${vimeoMatch[1]}`;
        }

        return null;
    };

    const uploadImageFile = useCallback(async (file: File) => {
        setIsImageUploading(true);
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
            setIsImageUploading(false);
        }
    }, []);

    const uploadVideoFile = useCallback(async (file: File) => {
        setIsVideoUploading(true);
        setError(null);

        try {
            const formData = new FormData();
            formData.append("file", file);

            const res = await fetch("/api/admin/testimonials/upload-video", {
                method: "POST",
                body: formData,
            });

            if (!res.ok) {
                throw new Error("Upload failed");
            }

            const data = (await res.json()) as { url: string };
            setVideoUrl(data.url);
        } catch {
            setError("Video yüklenirken bir hata oluştu.");
        } finally {
            setIsVideoUploading(false);
        }
    }, []);

    const handleImageFileChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            const file = e.target.files?.[0];
            if (file) void uploadImageFile(file);
        },
        [uploadImageFile]
    );

    const handleVideoFileChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            const file = e.target.files?.[0];
            if (file) void uploadVideoFile(file);
        },
        [uploadVideoFile]
    );

    const handleImageDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsImageDragging(true);
    }, []);

    const handleImageDragLeave = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsImageDragging(false);
    }, []);

    const handleImageDrop = useCallback(
        (e: React.DragEvent) => {
            e.preventDefault();
            setIsImageDragging(false);
            const file = e.dataTransfer.files?.[0];
            if (file) void uploadImageFile(file);
        },
        [uploadImageFile]
    );

    const handleVideoDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsVideoDragging(true);
    }, []);

    const handleVideoDragLeave = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsVideoDragging(false);
    }, []);

    const handleVideoDrop = useCallback(
        (e: React.DragEvent) => {
            e.preventDefault();
            setIsVideoDragging(false);
            const file = e.dataTransfer.files?.[0];
            if (file) void uploadVideoFile(file);
        },
        [uploadVideoFile]
    );

    const handleSubmit = useCallback(
        async (e: React.FormEvent) => {
            e.preventDefault();
            setIsSaving(true);
            setError(null);

            try {
                const body = {
                    name,
                    quote,
                    serviceName,
                    imageUrl,
                    videoUrl: videoUrl.trim() || null,
                };

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
        [name, quote, serviceName, imageUrl, videoUrl, isEditing, testimonial, router]
    );

    const trimmedVideoUrl = videoUrl.trim();
    const videoEmbedUrl = trimmedVideoUrl ? resolveEmbedUrl(trimmedVideoUrl) : null;
    const videoPlaybackUrl = trimmedVideoUrl ? getMediaUrl(trimmedVideoUrl) : "";

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
                                                src={getMediaUrl(imageUrl)}
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
                                    className={`relative cursor-pointer border-2 border-dashed rounded-xl bg-gray-50 hover:border-orange-300 transition-all p-12 ${isImageDragging
                                            ? "border-orange-400 bg-orange-50"
                                            : "border-gray-200"
                                        }`}
                                    onDragOver={handleImageDragOver}
                                    onDragLeave={handleImageDragLeave}
                                    onDrop={handleImageDrop}
                                    onClick={() => imageFileInputRef.current?.click()}
                                >
                                    <div className="flex flex-col items-center justify-center text-center">
                                        <div className="w-16 h-16 mb-4 rounded-full bg-orange-50 flex items-center justify-center text-orange-500 group-hover:scale-110 transition-transform">
                                            <CloudUpload className="h-8 w-8" />
                                        </div>
                                        <p className="text-gray-900 font-semibold text-lg">
                                            {isImageUploading
                                                ? "Yükleniyor..."
                                                : "Görsel yüklemek için tıklayın veya sürükleyin"}
                                        </p>
                                        <p className="text-gray-500 mt-1 text-sm">
                                            PNG, JPG veya WEBP (Max. 5MB)
                                        </p>
                                    </div>
                                    <input
                                        ref={imageFileInputRef}
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageFileChange}
                                        className="hidden"
                                    />
                                </div>
                            )}
                        </div>

                        <div className="space-y-3">
                            <label className="flex flex-col gap-2">
                                <span className="text-gray-700 text-sm font-bold uppercase tracking-wider">
                                    Video URL (YouTube veya Dosya)
                                </span>
                                <input
                                    type="text"
                                    value={videoUrl}
                                    onChange={(e) => setVideoUrl(e.target.value)}
                                    className="input h-12"
                                    placeholder="https://youtube.com/watch?v=... veya yüklenen dosya yolu"
                                />
                            </label>

                            <div
                                className={`relative cursor-pointer border-2 border-dashed rounded-xl bg-gray-50 hover:border-orange-300 transition-all p-10 ${isVideoDragging
                                        ? "border-orange-400 bg-orange-50"
                                        : "border-gray-200"
                                    }`}
                                onDragOver={handleVideoDragOver}
                                onDragLeave={handleVideoDragLeave}
                                onDrop={handleVideoDrop}
                                onClick={() => videoFileInputRef.current?.click()}
                            >
                                <div className="flex flex-col items-center justify-center text-center">
                                    <div className="w-14 h-14 mb-3 rounded-full bg-orange-50 flex items-center justify-center text-orange-500">
                                        <CloudUpload className="h-7 w-7" />
                                    </div>
                                    <p className="text-gray-900 font-semibold">
                                        {isVideoUploading
                                            ? "Video yükleniyor..."
                                            : "Video yüklemek için tıklayın veya sürükleyin"}
                                    </p>
                                    <p className="text-gray-500 mt-1 text-sm">
                                        MP4, WEBM, OGG, MOV (Max. 80MB)
                                    </p>
                                </div>
                                <input
                                    ref={videoFileInputRef}
                                    type="file"
                                    accept="video/mp4,video/webm,video/ogg,video/quicktime,video/x-m4v,video/mpeg"
                                    onChange={handleVideoFileChange}
                                    className="hidden"
                                />
                            </div>

                            {trimmedVideoUrl ? (
                                <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 space-y-3">
                                    <div className="flex items-center justify-between gap-3">
                                        <p className="text-sm font-medium text-gray-700">Video önizleme</p>
                                        <button
                                            type="button"
                                            onClick={() => setVideoUrl("")}
                                            className="p-2 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors"
                                        >
                                            <X className="h-5 w-5" />
                                        </button>
                                    </div>
                                    <div className="aspect-video overflow-hidden rounded-lg bg-black">
                                        {videoEmbedUrl ? (
                                            <iframe
                                                src={videoEmbedUrl}
                                                title="Referans videosu"
                                                className="h-full w-full border-0"
                                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                allowFullScreen
                                            />
                                        ) : (
                                            <video
                                                controls
                                                preload="metadata"
                                                className="h-full w-full object-cover"
                                                src={videoPlaybackUrl}
                                            />
                                        )}
                                    </div>
                                </div>
                            ) : null}
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
