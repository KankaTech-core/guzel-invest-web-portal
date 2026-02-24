import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { HomepageSettingsManager } from "@/components/admin/homepage-settings-manager";

export default async function AdminHomepageSettingsPage() {
    const session = await getSession();

    if (!session) {
        redirect("/admin/login");
    }

    return (
        <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
            <div className="mb-8 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                <h1 className="text-2xl font-bold text-gray-900">Ana Sayfa Yönetimi</h1>
                <p className="mt-1 text-gray-500">
                    Hero video, ana sayfadaki proje kartları ve ilan kartlarını yönet.
                </p>
            </div>

            <HomepageSettingsManager />
        </div>
    );
}
