import { redirect } from "next/navigation";
import { getCurrentUser, getSession } from "@/lib/auth";
import { ArticleForm } from "@/components/admin/article-form";

export default async function NewArticlePage() {
    const session = await getSession();
    const user = await getCurrentUser();

    if (!session) {
        redirect("/admin/login");
    }

    if (session.role === "VIEWER") {
        redirect("/admin/makaleler");
    }

    return <ArticleForm isNew authorName={user?.name || session.email} />;
}
