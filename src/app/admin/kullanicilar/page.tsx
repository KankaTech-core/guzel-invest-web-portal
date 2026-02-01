import { prisma } from "@/lib/prisma";
import { Plus, Edit, Trash2, Shield, User } from "lucide-react";

export default async function AdminUsersPage() {
    const users = await prisma.user.findMany({
        orderBy: { createdAt: "desc" },
    });

    return (
        <div>
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Kullanıcılar</h1>
                    <p className="text-gray-500 mt-1">Sistem kullanıcılarını yönetin</p>
                </div>
                <button className="btn btn-primary btn-md">
                    <Plus className="w-4 h-4" />
                    Yeni Kullanıcı
                </button>
            </div>

            {/* User Cards */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {users.map((user) => (
                    <div
                        key={user.id}
                        className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
                    >
                        <div className="flex items-start justify-between mb-4">
                            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                                <User className="w-6 h-6 text-gray-400" />
                            </div>
                            <span
                                className={`px-2 py-1 rounded text-xs font-medium ${user.role === "ADMIN"
                                        ? "bg-purple-100 text-purple-700"
                                        : "bg-blue-100 text-blue-700"
                                    }`}
                            >
                                {user.role === "ADMIN" ? "Admin" : "Editör"}
                            </span>
                        </div>

                        <h3 className="font-bold text-gray-900 mb-1">{user.name}</h3>
                        <p className="text-sm text-gray-500 mb-4">{user.email}</p>

                        <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                            <span className="text-xs text-gray-400">
                                {new Date(user.createdAt).toLocaleDateString("tr-TR")}
                            </span>
                            <div className="flex gap-2">
                                <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                                    <Edit className="w-4 h-4 text-gray-400" />
                                </button>
                                <button className="p-2 hover:bg-red-50 rounded-lg transition-colors">
                                    <Trash2 className="w-4 h-4 text-red-400" />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {users.length === 0 && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center text-gray-400">
                    Henüz kullanıcı bulunmuyor.
                </div>
            )}
        </div>
    );
}
