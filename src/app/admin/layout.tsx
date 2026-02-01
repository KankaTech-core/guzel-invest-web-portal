import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { Sidebar } from "@/components/admin/sidebar";
import "@/app/globals.css";

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await getSession();

    // Redirect to login if not authenticated (except for login page)
    if (!session) {
        // This check will be handled by individual pages
    }

    return (
        <div className="min-h-screen bg-slate-50">
            <Sidebar />
            <main className="lg:pl-64">
                <div className="p-6">{children}</div>
            </main>
        </div>
    );
}
