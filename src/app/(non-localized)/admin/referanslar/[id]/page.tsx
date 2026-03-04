import { redirect, notFound } from "next/navigation";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { TestimonialForm } from "@/components/admin/testimonial-form";

interface EditTestimonialPageProps {
    params: Promise<{ id: string }>;
}

export default async function EditTestimonialPage({ params }: EditTestimonialPageProps) {
    const session = await getSession();

    if (!session) {
        redirect("/admin/login");
    }

    const { id } = await params;

    const testimonial = await prisma.testimonial.findUnique({
        where: { id },
    });

    if (!testimonial) {
        notFound();
    }

    return (
        <TestimonialForm
            testimonial={{
                id: testimonial.id,
                name: testimonial.name,
                quote: testimonial.quote,
                serviceName: testimonial.serviceName,
                imageUrl: testimonial.imageUrl,
            }}
        />
    );
}
