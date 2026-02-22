import { notFound, redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import NewProjectForm from "../yeni/components/NewProjectForm";

interface EditProjectPageProps {
    params: Promise<{ id: string }>;
}

export default async function EditProjectPage({ params }: EditProjectPageProps) {
    const session = await getSession();
    const { id } = await params;

    if (!session) {
        redirect("/admin/login");
    }

    if (session.role === "VIEWER") {
        redirect("/admin/projeler");
    }

    const existingProject = await prisma.listing.findFirst({
        where: {
            id,
            isProject: true,
        },
        select: { id: true },
    });

    if (!existingProject) {
        notFound();
    }

    return <NewProjectForm initialProjectId={id} />;
}
