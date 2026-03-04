import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { TestimonialForm } from "@/components/admin/testimonial-form";

export default async function NewTestimonialPage() {
    const session = await getSession();

    if (!session) {
        redirect("/admin/login");
    }

    if (session.role === "VIEWER") {
        redirect("/admin/referanslar");
    }

    return <TestimonialForm />;
}
