import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { FormDetailManager } from "./components/FormDetailManager";

const formatDateTime = (date: Date) =>
    new Intl.DateTimeFormat("tr-TR", {
        dateStyle: "medium",
        timeStyle: "short",
    }).format(date);

const getSourceLabel = (source: string) => {
    if (source === "project-form") return "Proje Formu";
    if (source === "listing-form") return "İlan Formu";
    if (source === "website") return "İletişim Formu";
    if (source === "homepage-popup") return "Daireni Sat Formu";
    return source;
};

interface AdminFormDetailPageProps {
    params: Promise<{ id: string }>;
}

export default async function AdminFormDetailPage({ params }: AdminFormDetailPageProps) {
    const session = await getSession();

    if (!session) {
        redirect("/admin/login");
    }

    const { id } = await params;

    const form = await prisma.contactSubmission.findUnique({
        where: { id },
        select: {
            id: true,
            name: true,
            surname: true,
            email: true,
            phone: true,
            message: true,
            locale: true,
            source: true,
            projectSlug: true,
            projectTitle: true,
            status: true,
            notes: true,
            createdAt: true,
            read: true,
            readAt: true,
            tags: {
                select: {
                    tag: {
                        select: {
                            id: true,
                            name: true,
                            color: true,
                        }
                    }
                }
            },
        },
    });

    if (!form) {
        notFound();
    }

    if (!form.read) {
        await prisma.contactSubmission.update({
            where: { id: form.id },
            data: {
                read: true,
                readAt: new Date(),
            },
        });
    }

    return (
        <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
            <div className="mb-6 flex items-center justify-between gap-3">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Form Detayı</h1>
                    <p className="mt-1 text-sm text-gray-500">{formatDateTime(form.createdAt)}</p>
                </div>
                <Link
                    href="/admin/formlar"
                    className="inline-flex items-center rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
                >
                    Forma Dön
                </Link>
            </div>

            <div className="space-y-4 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Tip</p>
                        <p className="mt-1 text-sm text-gray-900">{getSourceLabel(form.source)}</p>
                    </div>
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Dil</p>
                        <p className="mt-1 text-sm uppercase text-gray-900">{form.locale}</p>
                    </div>
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">İlan / Proje</p>
                        <p className="mt-1 text-sm font-medium text-gray-900">
                            {form.projectTitle || form.projectSlug || "-"}
                        </p>
                        {form.projectSlug ? (
                            <p className="text-xs text-gray-500">{form.projectSlug}</p>
                        ) : null}
                    </div>
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Ad Soyad</p>
                        <p className="mt-1 text-sm text-gray-900">
                            {[form.name, form.surname]
                                .map((value) => value?.trim())
                                .filter(Boolean)
                                .join(" ") || "-"}
                        </p>
                    </div>
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">E-posta</p>
                        <p className="mt-1 text-sm text-gray-900">{form.email}</p>
                    </div>
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Telefon</p>
                        <p className="mt-1 text-sm text-gray-900">{form.phone || "-"}</p>
                    </div>
                </div>

                <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                    <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Mesaj</p>
                    <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-gray-900">
                        {form.message}
                    </p>
                </div>

                <FormDetailManager
                    id={form.id}
                    initialStatus={form.status}
                    initialNotes={form.notes || ""}
                    initialTags={form.tags.map(t => t.tag)}
                />
            </div>
        </div>
    );
}
