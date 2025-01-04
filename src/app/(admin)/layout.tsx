import AdminSidebar from "@/components/layout/admin.sidebar";
import AdminFooter from "@/components/layout/admin.footer";

export default function AdminLayout({children,}: Readonly<{ children: React.ReactNode; }>) {
    return (
        <div className="flex min-h-screen">
            <aside>
                <AdminSidebar />
            </aside>

            <div className="flex flex-col flex-1">
                <main className="flex-1 px-3 py-2 pl-20 bg-[#f5f5f9]">
                    {children}
                </main>
                <AdminFooter />
            </div>
        </div>
    );
}