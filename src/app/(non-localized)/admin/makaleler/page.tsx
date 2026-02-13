import Link from "next/link";
import { Eye, Plus } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { cn, getMediaUrl } from "@/lib/utils";
import { ArticleStatus } from "@/generated/prisma";
import { ArticleRowActions } from "@/components/admin/article-row-actions";
import { getSession } from "@/lib/auth";

interface AdminArticlesPageProps {
    searchParams?: Promise<{
        status?: string;
    }>;
}

const STATUS_LABELS: Record<ArticleStatus, string> = {
    DRAFT: "Taslak",
    PUBLISHED: "Yayında",
    ARCHIVED: "Arşiv",
    REMOVED: "Kaldırıldı",
};

const STATUS_CLASSES: Record<ArticleStatus, string> = {
    PUBLISHED: "bg-green-100 text-green-700",
    DRAFT: "bg-yellow-100 text-yellow-700",
    REMOVED: "bg-red-100 text-red-700",
    ARCHIVED: "bg-gray-100 text-gray-600",
};

export default async function AdminArticlesPage({ searchParams }: AdminArticlesPageProps) {
    const session = await getSession();
    const canManage = session?.role !== "VIEWER";
    const resolvedSearchParams = await searchParams;
    const statusParam = resolvedSearchParams?.status;

    const validStatuses: ArticleStatus[] = ["DRAFT", "PUBLISHED", "ARCHIVED", "REMOVED"];
    const statusFilter = validStatuses.includes(statusParam as ArticleStatus)
        ? (statusParam as ArticleStatus)
        : undefined;

    const baseParams = new URLSearchParams();
    if (statusFilter) baseParams.set("status", statusFilter);

    const buildUrl = (updates: Record<string, string | undefined>) => {
        const params = new URLSearchParams(baseParams.toString());
        Object.entries(updates).forEach(([key, value]) => {
            if (!value) {
                params.delete(key);
            } else {
                params.set(key, value);
            }
        });
        const query = params.toString();
        return query ? `/admin/makaleler?${query}` : "/admin/makaleler";
    };

    const where = statusFilter
        ? { status: statusFilter }
        : { status: { not: "ARCHIVED" as ArticleStatus } };

    const articles = await prisma.article.findMany({
        where,
        include: {
            createdBy: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                },
            },
        },
        orderBy: {
            createdAt: "desc",
        },
    });

    return (
        <div className="mx-auto max-w-[1240px]">
            <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Makaleler</h1>
                    <p className="mt-1 text-gray-500">Makaleleri oluşturun, düzenleyin ve yayınlayın</p>
                </div>

                {canManage ? (
                    <Link href="/admin/makaleler/yeni" className="btn btn-primary btn-md">
                        <Plus className="h-4 w-4" />
                        Yeni Makale
                    </Link>
                ) : null}
            </div>

            <div className="mb-6 flex items-center gap-2">
                <Link
                    href={buildUrl({ status: undefined })}
                    className={cn(
                        "rounded-full border px-4 py-2 text-sm font-medium transition-colors",
                        !statusFilter
                            ? "border-orange-500 bg-orange-500 text-white"
                            : "border-gray-200 text-gray-600 hover:bg-gray-50"
                    )}
                >
                    Tümü
                </Link>
                <Link
                    href={buildUrl({ status: "ARCHIVED" })}
                    className={cn(
                        "rounded-full border px-4 py-2 text-sm font-medium transition-colors",
                        statusFilter === "ARCHIVED"
                            ? "border-orange-500 bg-orange-500 text-white"
                            : "border-gray-200 text-gray-600 hover:bg-gray-50"
                    )}
                >
                    Arşiv
                </Link>
            </div>

            <div className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
                <table className="w-full">
                    <thead className="border-b border-gray-100 bg-gray-50">
                        <tr>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Makale</th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Kategori</th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Yazar</th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Durum</th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Tarih</th>
                            <th className="px-6 py-4 text-right text-sm font-semibold text-gray-600">İşlemler</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {articles.map((article) => (
                            <tr key={article.id} className="group cursor-pointer transition-colors hover:bg-gray-50">
                                <td className="p-0">
                                    <Link href={`/admin/makaleler/${article.id}`} className="block px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="h-12 w-12 overflow-hidden rounded-lg bg-gray-100">
                                                {article.coverThumbnailUrl || article.coverImageUrl ? (
                                                    <img
                                                        src={getMediaUrl(article.coverThumbnailUrl || article.coverImageUrl)}
                                                        alt=""
                                                        className="h-full w-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="flex h-full w-full items-center justify-center text-gray-300">
                                                        📝
                                                    </div>
                                                )}
                                            </div>
                                            <div className="max-w-[460px]">
                                                <p className="font-medium text-gray-900 transition-colors group-hover:text-orange-600">
                                                    {article.title}
                                                </p>
                                                <p className="line-clamp-1 text-sm text-gray-500">
                                                    {article.excerpt || "Özet yok"}
                                                </p>
                                            </div>
                                        </div>
                                    </Link>
                                </td>
                                <td className="p-0">
                                    <Link href={`/admin/makaleler/${article.id}`} className="block px-6 py-4 text-sm text-gray-600">
                                        {article.category || "-"}
                                    </Link>
                                </td>
                                <td className="p-0">
                                    <Link
                                        href={`/admin/makaleler/${article.id}`}
                                        className="block px-6 py-4 text-sm text-gray-600"
                                    >
                                        {article.createdBy?.name || article.createdBy?.email || "-"}
                                    </Link>
                                </td>
                                <td className="p-0">
                                    <Link href={`/admin/makaleler/${article.id}`} className="block px-6 py-4">
                                        <span
                                            className={cn(
                                                "rounded px-2 py-1 text-xs font-medium",
                                                STATUS_CLASSES[article.status]
                                            )}
                                        >
                                            {STATUS_LABELS[article.status]}
                                        </span>
                                    </Link>
                                </td>
                                <td className="p-0">
                                    <Link
                                        href={`/admin/makaleler/${article.id}`}
                                        className="block px-6 py-4 text-sm text-gray-500"
                                    >
                                        {new Date(article.createdAt).toLocaleDateString("tr-TR")}
                                    </Link>
                                </td>
                                <td className="px-6 py-4">
                                    {canManage ? (
                                        <ArticleRowActions
                                            id={article.id}
                                            slug={article.slug}
                                            status={article.status}
                                        />
                                    ) : (
                                        <div className="flex justify-end">
                                            <Link
                                                href={`/tr/blog/${article.slug}`}
                                                target="_blank"
                                                className="rounded-lg p-2 transition-colors hover:bg-gray-100"
                                            >
                                                <Eye className="h-4 w-4 text-gray-400" />
                                            </Link>
                                        </div>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {articles.length === 0 ? (
                    <div className="py-12 text-center text-gray-400">Henüz makale bulunmuyor.</div>
                ) : null}
            </div>
        </div>
    );
}
