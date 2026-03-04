import Link from "next/link";
import { redirect } from "next/navigation";
import { Plus } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { TestimonialsListClient } from "@/components/admin/testimonials-list-client";

export default async function AdminTestimonialsPage() {
    const session = await getSession();

    if (!session) {
        redirect("/admin/login");
    }

    const testimonials = await prisma.testimonial.findMany({
        orderBy: { order: "asc" },
    });

    return (
        <div>
            <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-extrabold text-gray-900 mb-1">
                        Referanslar
                    </h1>
                    <p className="text-gray-500">
                        Ana sayfada gösterilecek müşteri referanslarını yönetin.
                    </p>
                </div>
                <Link
                    href="/admin/referanslar/yeni"
                    className="btn btn-primary btn-md"
                >
                    <Plus className="h-4 w-4" />
                    Yeni Referans
                </Link>
            </div>

            <TestimonialsListClient
                initialTestimonials={testimonials.map((t) => ({
                    id: t.id,
                    name: t.name,
                    quote: t.quote,
                    serviceName: t.serviceName,
                    imageUrl: t.imageUrl,
                    videoUrl: t.videoUrl,
                    order: t.order,
                }))}
                isViewer={session.role === "VIEWER"}
            />
        </div>
    );
}
