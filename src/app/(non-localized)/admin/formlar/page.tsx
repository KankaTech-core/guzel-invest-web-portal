import Link from "next/link";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

const formatDateTime = (date: Date) =>
    new Intl.DateTimeFormat("tr-TR", {
        dateStyle: "medium",
        timeStyle: "short",
    }).format(date);

const getSourceLabel = (source: string) => {
    if (source === "project-form") return "Proje Formu";
    if (source === "listing-form") return "İlan Formu";
    return source;
};

const getMessagePreview = (message: string, maxLength = 88) => {
    const normalized = message.trim().replace(/\s+/g, " ");
    if (normalized.length <= maxLength) {
        return normalized;
    }
    return `${normalized.slice(0, maxLength - 1)}…`;
};

export default async function AdminFormsPage() {
    const session = await getSession();

    if (!session) {
        redirect("/admin/login");
    }

    const forms = await prisma.contactSubmission.findMany({
        where: {
            source: {
                in: ["project-form", "listing-form"],
            },
        },
        orderBy: {
            createdAt: "desc",
        },
        select: {
            id: true,
            name: true,
            surname: true,
            email: true,
            phone: true,
            message: true,
            locale: true,
            projectSlug: true,
            projectTitle: true,
            source: true,
            createdAt: true,
            read: true,
        },
        take: 500,
    });

    return (
        <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
            <div className="mb-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                <h1 className="text-2xl font-bold text-gray-900">Formlar</h1>
                <p className="mt-1 text-gray-500">
                    Proje ve ilan sayfalarından gelen iletişim kayıtları.
                </p>
            </div>

            <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 text-sm">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-4 py-3 text-left font-semibold text-gray-600">Tarih</th>
                                <th className="px-4 py-3 text-left font-semibold text-gray-600">Tip</th>
                                <th className="px-4 py-3 text-left font-semibold text-gray-600">İlan / Proje</th>
                                <th className="px-4 py-3 text-left font-semibold text-gray-600">Ad Soyad</th>
                                <th className="px-4 py-3 text-left font-semibold text-gray-600">Mesaj</th>
                                <th className="px-4 py-3 text-left font-semibold text-gray-600">Durum</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {forms.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan={6}
                                        className="px-4 py-8 text-center text-sm text-gray-500"
                                    >
                                        Henüz form kaydı yok.
                                    </td>
                                </tr>
                            ) : (
                                forms.map((form) => (
                                    <tr key={form.id} className="hover:bg-gray-50/60">
                                        <td className="px-4 py-3 text-gray-700">
                                            <Link href={`/admin/formlar/${form.id}`} className="block">
                                                {formatDateTime(form.createdAt)}
                                            </Link>
                                        </td>
                                        <td className="px-4 py-3 text-gray-700">
                                            <Link href={`/admin/formlar/${form.id}`} className="block">
                                                {getSourceLabel(form.source)}
                                            </Link>
                                        </td>
                                        <td className="px-4 py-3 text-gray-800">
                                            <Link href={`/admin/formlar/${form.id}`} className="block">
                                                <div className="font-medium text-gray-900">
                                                    {form.projectTitle || form.projectSlug || "-"}
                                                </div>
                                                {form.projectSlug && (
                                                    <div className="text-xs text-gray-500">{form.projectSlug}</div>
                                                )}
                                            </Link>
                                        </td>
                                        <td className="px-4 py-3 text-gray-700">
                                            <Link href={`/admin/formlar/${form.id}`} className="block">
                                                {[form.name, form.surname]
                                                    .map((value) => value?.trim())
                                                    .filter(Boolean)
                                                    .join(" ") || "-"}
                                            </Link>
                                        </td>
                                        <td className="px-4 py-3 text-gray-700">
                                            <Link href={`/admin/formlar/${form.id}`} className="block max-w-[24rem] truncate">
                                                {getMessagePreview(form.message)}
                                            </Link>
                                        </td>
                                        <td className="px-4 py-3 text-gray-700">
                                            <Link href={`/admin/formlar/${form.id}`} className="block">
                                                <span
                                                    className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${form.read
                                                        ? "bg-gray-100 text-gray-700"
                                                        : "bg-blue-100 text-blue-700"
                                                        }`}
                                                >
                                                    {form.read ? "Okundu" : "Yeni"}
                                                </span>
                                            </Link>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
