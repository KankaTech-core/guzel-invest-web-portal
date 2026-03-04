"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { GripVertical, Pencil, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface Testimonial {
    id: string;
    name: string;
    quote: string;
    serviceName: string;
    imageUrl: string | null;
    videoUrl?: string | null;
    order: number;
}

interface TestimonialsListClientProps {
    readonly initialTestimonials: Testimonial[];
    readonly isViewer: boolean;
}

export function TestimonialsListClient({
    initialTestimonials,
    isViewer,
}: TestimonialsListClientProps) {
    const router = useRouter();
    const [testimonials, setTestimonials] = useState(initialTestimonials);
    const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
    const [isSaving, setIsSaving] = useState(false);
    const [deletingId, setDeletingId] = useState<string | null>(null);

    const handleDragStart = useCallback((index: number) => {
        setDraggedIndex(index);
    }, []);

    const handleDragOver = useCallback(
        (e: React.DragEvent, index: number) => {
            e.preventDefault();
            if (draggedIndex === null || draggedIndex === index) return;

            const newTestimonials = [...testimonials];
            const [dragged] = newTestimonials.splice(draggedIndex, 1);
            newTestimonials.splice(index, 0, dragged);
            setTestimonials(newTestimonials);
            setDraggedIndex(index);
        },
        [draggedIndex, testimonials]
    );

    const handleDragEnd = useCallback(async () => {
        setDraggedIndex(null);
        setIsSaving(true);

        try {
            const orderedIds = testimonials.map((t) => t.id);
            await fetch("/api/admin/testimonials/reorder", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ orderedIds }),
            });
        } catch (error) {
            console.error("Failed to save order:", error);
        } finally {
            setIsSaving(false);
        }
    }, [testimonials]);

    const handleDelete = useCallback(
        async (id: string) => {
            if (!confirm("Bu referansı silmek istediğinize emin misiniz?")) return;

            setDeletingId(id);
            try {
                const res = await fetch(`/api/admin/testimonials/${id}`, {
                    method: "DELETE",
                });
                if (res.ok) {
                    setTestimonials((prev) => prev.filter((t) => t.id !== id));
                    router.refresh();
                }
            } catch (error) {
                console.error("Failed to delete:", error);
            } finally {
                setDeletingId(null);
            }
        },
        [router]
    );

    const minioBaseUrl = process.env.NEXT_PUBLIC_MINIO_URL;

    return (
        <div className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-50">
                            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider w-20">
                                Sıra
                            </th>
                            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider w-24">
                                Görsel
                            </th>
                            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">
                                İsim
                            </th>
                            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">
                                Hizmet
                            </th>
                            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider w-40 text-right">
                                İşlem
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {testimonials.map((testimonial, index) => (
                            <tr
                                key={testimonial.id}
                                draggable={!isViewer}
                                onDragStart={() => handleDragStart(index)}
                                onDragOver={(e) => handleDragOver(e, index)}
                                onDragEnd={handleDragEnd}
                                className={cn(
                                    "group transition-colors hover:bg-gray-50/50",
                                    draggedIndex === index && "opacity-50 bg-orange-50"
                                )}
                            >
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        {!isViewer && (
                                            <GripVertical className="h-4 w-4 text-gray-400 cursor-grab active:cursor-grabbing" />
                                        )}
                                        <span className="text-sm font-semibold text-gray-700">
                                            {index + 1}
                                        </span>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    {testimonial.imageUrl ? (
                                        <div className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-gray-100">
                                            <Image
                                                src={`${minioBaseUrl}/guzel-invest/${testimonial.imageUrl}`}
                                                alt={testimonial.name}
                                                fill
                                                className="object-cover"
                                            />
                                        </div>
                                    ) : (
                                        <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center">
                                            <span className="text-sm font-semibold text-orange-600">
                                                {testimonial.name.charAt(0).toUpperCase()}
                                            </span>
                                        </div>
                                    )}
                                </td>
                                <td className="px-6 py-4">
                                    <span className="text-sm font-bold text-gray-900">
                                        {testimonial.name}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-50 text-orange-600 border border-orange-200">
                                        {testimonial.serviceName}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex items-center justify-end gap-2">
                                        <Link
                                            href={`/admin/referanslar/${testimonial.id}`}
                                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-gray-200 hover:bg-gray-100 text-xs font-bold text-gray-600 transition-colors"
                                        >
                                            <Pencil className="h-3.5 w-3.5" />
                                            Düzenle
                                        </Link>
                                        {!isViewer && (
                                            <button
                                                onClick={() => handleDelete(testimonial.id)}
                                                disabled={deletingId === testimonial.id}
                                                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-red-200 hover:bg-red-50 text-xs font-bold text-red-600 transition-colors disabled:opacity-50"
                                            >
                                                <Trash2 className="h-3.5 w-3.5" />
                                                {deletingId === testimonial.id ? "..." : "Sil"}
                                            </button>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}

                        {testimonials.length === 0 && (
                            <tr>
                                <td
                                    colSpan={5}
                                    className="px-4 py-10 text-center text-sm text-gray-500"
                                >
                                    Henüz referans eklenmedi.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 bg-gray-50/50 border-t border-gray-100 flex items-center justify-between">
                <span className="text-xs text-gray-500">
                    Toplam {testimonials.length} referans gösteriliyor
                </span>
                {isSaving && (
                    <span className="text-xs text-orange-500 font-medium">
                        Sıralama kaydediliyor...
                    </span>
                )}
            </div>
        </div>
    );
}
