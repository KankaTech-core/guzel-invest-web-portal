import { notFound, redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

interface EditProjectFromSlugPageProps {
    params: Promise<{ slug: string }>;
}

export default async function EditProjectFromSlugPage({ params }: EditProjectFromSlugPageProps) {
    const session = await getSession();
    const { slug } = await params;

    if (!session) {
        redirect("/admin/login");
    }

    if (session.role === "VIEWER") {
        redirect("/admin/projeler");
    }

    const project = await prisma.listing.findFirst({
        where: {
            slug,
            isProject: true,
        },
        select: { id: true },
    });

    if (!project) {
        notFound();
    }

    redirect(`/admin/projeler/${project.id}`);
}
