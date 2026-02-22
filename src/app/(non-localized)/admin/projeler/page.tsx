import Link from "next/link";
import { redirect } from "next/navigation";
import { Plus } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export default async function AdminProjectsPage() {
    const session = await getSession();

    if (!session) {
        redirect("/admin/login");
    }

    const projects = await prisma.listing.findMany({
        where: { isProject: true },
        include: {
            translations: {
                where: { locale: "tr" },
                take: 1,
            },
        },
        orderBy: [{ updatedAt: "desc" }],
    });

    return (
        <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Projeler</h1>
                    <p className="text-sm text-gray-500">
                        Single proje sayfasında kullanılacak proje kayıtlarını yönetin.
                    </p>
                </div>
                <Link
                    href="/admin/projeler/yeni"
                    className="inline-flex items-center gap-2 rounded-lg bg-orange-500 px-4 py-2 text-sm font-semibold text-white hover:bg-orange-600"
                >
                    <Plus className="h-4 w-4" />
                    Yeni Proje
                </Link>
            </div>

            <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
                <table className="min-w-full divide-y divide-gray-200 text-sm">
                    <thead className="bg-gray-50 text-left text-xs uppercase tracking-wide text-gray-500">
                        <tr>
                            <th className="px-4 py-3">Başlık</th>
                            <th className="px-4 py-3">Kategori</th>
                            <th className="px-4 py-3">Konum</th>
                            <th className="px-4 py-3">Durum</th>
                            <th className="px-4 py-3">Güncelleme</th>
                            <th className="px-4 py-3 text-right">İşlem</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {projects.map((project) => {
                            const title =
                                project.translations[0]?.title || "Başlıksız Proje";
                            const location = [project.district, project.city]
                                .filter(Boolean)
                                .join(", ");
                            return (
                                <tr key={project.id} className="hover:bg-gray-50">
                                    <td className="px-4 py-3 font-medium text-gray-900">
                                        {title}
                                    </td>
                                    <td className="px-4 py-3 text-gray-600">
                                        {project.projectType || "-"}
                                    </td>
                                    <td className="px-4 py-3 text-gray-600">
                                        {location || "-"}
                                    </td>
                                    <td className="px-4 py-3 text-gray-600">{project.status}</td>
                                    <td className="px-4 py-3 text-gray-500">
                                        {new Date(project.updatedAt).toLocaleDateString("tr-TR")}
                                    </td>
                                    <td className="px-4 py-3 text-right">
                                        <Link
                                            href={`/admin/projeler/${project.id}`}
                                            className="inline-flex rounded-md border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-100"
                                        >
                                            Düzenle
                                        </Link>
                                    </td>
                                </tr>
                            );
                        })}
                        {projects.length === 0 && (
                            <tr>
                                <td
                                    colSpan={6}
                                    className="px-4 py-10 text-center text-sm text-gray-500"
                                >
                                    Henüz proje oluşturulmadı.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
