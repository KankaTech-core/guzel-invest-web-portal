import { notFound, redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ArticleForm } from "@/components/admin/article-form";

interface EditArticlePageProps {
    params: Promise<{ id: string }>;
}

export default async function EditArticlePage({ params }: EditArticlePageProps) {
    const session = await getSession();
    const { id } = await params;

    if (!session) {
        redirect("/admin/login");
    }

    if (session.role === "VIEWER") {
        redirect("/admin/makaleler");
    }

    const article = await prisma.article.findUnique({
        where: { id },
        include: {
            createdBy: {
                select: {
                    name: true,
                    email: true,
                },
            },
        },
    });

    if (!article) {
        notFound();
    }

    return (
        <ArticleForm
            authorName={article.createdBy?.name || article.createdBy?.email || session.email}
            article={{
                id: article.id,
                title: article.title,
                slug: article.slug,
                excerpt: article.excerpt || "",
                content: article.content,
                category: article.category || "",
                tags: article.tags,
                status: article.status,
                coverImageUrl: article.coverImageUrl,
                coverThumbnailUrl: article.coverThumbnailUrl,
            }}
        />
    );
}
