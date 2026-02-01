import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Building2, Users, FileText, Clock } from "lucide-react";

export default async function AdminDashboard() {
    const session = await getSession();

    if (!session) {
        redirect("/admin/login");
    }

    // Get stats
    const [listingsCount, usersCount, recentListings] = await Promise.all([
        prisma.listing.count(),
        prisma.user.count(),
        prisma.listing.findMany({
            take: 5,
            orderBy: { createdAt: "desc" },
            include: {
                translations: {
                    where: { locale: "tr" },
                },
            },
        }),
    ]);

    return (
        <div>
            <h1 className="text-3xl font-bold text-slate-900 mb-8">Dashboard</h1>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-white rounded-xl shadow-sm p-6">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-amber-100 rounded-lg">
                            <Building2 className="w-6 h-6 text-amber-600" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Toplam İlan</p>
                            <p className="text-2xl font-bold">{listingsCount}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm p-6">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-blue-100 rounded-lg">
                            <Users className="w-6 h-6 text-blue-600" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Kullanıcılar</p>
                            <p className="text-2xl font-bold">{usersCount}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm p-6">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-green-100 rounded-lg">
                            <FileText className="w-6 h-6 text-green-600" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Yayında</p>
                            <p className="text-2xl font-bold">0</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm p-6">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-purple-100 rounded-lg">
                            <Clock className="w-6 h-6 text-purple-600" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Taslak</p>
                            <p className="text-2xl font-bold">0</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Recent Listings */}
            <div className="bg-white rounded-xl shadow-sm">
                <div className="p-6 border-b">
                    <h2 className="text-lg font-semibold">Son İlanlar</h2>
                </div>
                <div className="divide-y">
                    {recentListings.length === 0 ? (
                        <div className="p-6 text-center text-gray-500">
                            Henüz ilan bulunmuyor
                        </div>
                    ) : (
                        recentListings.map((listing) => (
                            <div
                                key={listing.id}
                                className="p-4 flex items-center justify-between hover:bg-slate-50"
                            >
                                <div>
                                    <p className="font-medium">
                                        {listing.translations[0]?.title || listing.slug}
                                    </p>
                                    <p className="text-sm text-gray-500">
                                        {listing.city}, {listing.district}
                                    </p>
                                </div>
                                <span
                                    className={`px-3 py-1 rounded-full text-xs font-medium ${listing.status === "PUBLISHED"
                                            ? "bg-green-100 text-green-700"
                                            : listing.status === "DRAFT"
                                                ? "bg-yellow-100 text-yellow-700"
                                                : "bg-gray-100 text-gray-700"
                                        }`}
                                >
                                    {listing.status}
                                </span>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
