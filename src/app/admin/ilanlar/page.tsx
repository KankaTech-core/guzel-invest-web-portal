import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Plus, Edit, Trash2, Eye, MoreVertical } from "lucide-react";

export default async function AdminListingsPage() {
    const listings = await prisma.listing.findMany({
        include: {
            translations: {
                where: { locale: "tr" },
            },
            media: {
                take: 1,
                orderBy: { order: "asc" },
            },
        },
        orderBy: { createdAt: "desc" },
    });

    return (
        <div>
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">İlanlar</h1>
                    <p className="text-gray-500 mt-1">Tüm ilanları yönetin</p>
                </div>
                <Link
                    href="/admin/ilanlar/yeni"
                    className="btn btn-primary btn-md"
                >
                    <Plus className="w-4 h-4" />
                    Yeni İlan
                </Link>
            </div>

            {/* Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-100">
                        <tr>
                            <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                                İlan
                            </th>
                            <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                                Tür
                            </th>
                            <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                                Fiyat
                            </th>
                            <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                                Durum
                            </th>
                            <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                                Tarih
                            </th>
                            <th className="text-right px-6 py-4 text-sm font-semibold text-gray-600">
                                İşlemler
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {listings.map((listing) => (
                            <tr key={listing.id} className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden">
                                            {listing.media[0] ? (
                                                <img
                                                    src={`http://localhost:9000/guzel-invest/${listing.media[0].url}`}
                                                    alt=""
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-gray-300">
                                                    📷
                                                </div>
                                            )}
                                        </div>
                                        <div>
                                            <p className="font-medium text-gray-900">
                                                {listing.translations[0]?.title || "İsimsiz İlan"}
                                            </p>
                                            <p className="text-sm text-gray-500">
                                                {listing.district}, {listing.city}
                                            </p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className="px-2 py-1 bg-gray-100 rounded text-xs font-medium text-gray-600">
                                        {listing.type}
                                    </span>
                                </td>
                                <td className="px-6 py-4 font-semibold text-gray-900">
                                    €{listing.price.toLocaleString()}
                                </td>
                                <td className="px-6 py-4">
                                    <span
                                        className={`px-2 py-1 rounded text-xs font-medium ${listing.status === "PUBLISHED"
                                                ? "bg-green-100 text-green-700"
                                                : listing.status === "DRAFT"
                                                    ? "bg-yellow-100 text-yellow-700"
                                                    : "bg-gray-100 text-gray-600"
                                            }`}
                                    >
                                        {listing.status === "PUBLISHED"
                                            ? "Yayında"
                                            : listing.status === "DRAFT"
                                                ? "Taslak"
                                                : "Arşiv"}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-500">
                                    {new Date(listing.createdAt).toLocaleDateString("tr-TR")}
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center justify-end gap-2">
                                        <Link
                                            href={`/tr/ilan/${listing.slug}`}
                                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                            target="_blank"
                                        >
                                            <Eye className="w-4 h-4 text-gray-400" />
                                        </Link>
                                        <Link
                                            href={`/admin/ilanlar/${listing.id}`}
                                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                        >
                                            <Edit className="w-4 h-4 text-gray-400" />
                                        </Link>
                                        <button className="p-2 hover:bg-red-50 rounded-lg transition-colors">
                                            <Trash2 className="w-4 h-4 text-red-400" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {listings.length === 0 && (
                    <div className="py-12 text-center text-gray-400">
                        Henüz ilan bulunmuyor.
                    </div>
                )}
            </div>
        </div>
    );
}
