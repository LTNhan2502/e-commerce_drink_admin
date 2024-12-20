import type { Metadata } from "next";
import './globals.css';
import AdminSidebar from "@/components/layout/admin.sidebar";
import AdminFooter from "@/components/layout/admin.footer";

export const metadata: Metadata = {
  title: "AnTea",
  description: "Trà sữa AnTea",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className='min-h-screen flex'>
        <aside>
            <AdminSidebar/>
        </aside>

        <div className='flex flex-col flex-1'>
            <main className='flex-1 px-3 py-2 pl-20 bg-[#f5f5f9]'>
                {children}
            </main>
            <AdminFooter/>
        </div>
      </body>
    </html>
  );
}
