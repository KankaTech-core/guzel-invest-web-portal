import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

const formatDateTime = (date: Date) =>
    new Intl.DateTimeFormat("tr-TR", {
        dateStyle: "medium",
        timeStyle: "short",
    }).format(date);

export default async function AdminFormsPage() {
    const session = await getSession();

    if (!session) {
        redirect("/admin/login");
    }

    const forms = await prisma.contactSubmission.findMany({
        where: {
            source: "project-form",
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
            locale: true,
            projectSlug: true,
            projectTitle: true,
            createdAt: true,
        },
        take: 500,
    });

    return (
        <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
            <div className="mb-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                <h1 className="text-2xl font-bold text-gray-900">Formlar</h1>
                <p className="mt-1 text-gray-500">
                    Proje sayfası iletişim formlarından gelen kayıtlar.
                </p>
            </div>

            <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 text-sm">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-4 py-3 text-left font-semibold text-gray-600">Tarih</th>
                                <th className="px-4 py-3 text-left font-semibold text-gray-600">Proje</th>
                                <th className="px-4 py-3 text-left font-semibold text-gray-600">Ad Soyad</th>
                                <th className="px-4 py-3 text-left font-semibold text-gray-600">E-posta</th>
                                <th className="px-4 py-3 text-left font-semibold text-gray-600">Telefon</th>
                                <th className="px-4 py-3 text-left font-semibold text-gray-600">Dil</th>
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
                                            {formatDateTime(form.createdAt)}
                                        </td>
                                        <td className="px-4 py-3 text-gray-800">
                                            <div className="font-medium text-gray-900">
                                                {form.projectTitle || form.projectSlug || "-"}
                                            </div>
                                            {form.projectSlug && (
                                                <div className="text-xs text-gray-500">{form.projectSlug}</div>
                                            )}
                                        </td>
                                        <td className="px-4 py-3 text-gray-700">
                                            {[form.name, form.surname]
                                                .map((value) => value?.trim())
                                                .filter(Boolean)
                                                .join(" ") || "-"}
                                        </td>
                                        <td className="px-4 py-3 text-gray-700">{form.email}</td>
                                        <td className="px-4 py-3 text-gray-700">{form.phone || "-"}</td>
                                        <td className="px-4 py-3 text-gray-700 uppercase">{form.locale}</td>
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
