import { Sidebar } from "@/components/admin/sidebar";
import { SidebarProvider } from "@/lib/context/sidebar-context";
import { AdminContentWrapper } from "@/components/admin/admin-content-wrapper";
import "@/app/globals.css";

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <SidebarProvider>
            <div className="min-h-screen bg-slate-50 flex">
                <Sidebar />
                <AdminContentWrapper>
                    {children}
                </AdminContentWrapper>
            </div>
        </SidebarProvider>
    );
}
