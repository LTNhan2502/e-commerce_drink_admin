import type { Metadata } from "next";
import './globals.css';
import 'react-toastify/dist/ReactToastify.css';

export const metadata: Metadata = {
    title: "AnTea",
    description: "Trà sữa AnTea",
};

export default function RootLayout({children,}: Readonly<{ children: React.ReactNode; }>) {
    return (
        <html lang="en">
            <body className="min-h-screen">
                {children}
            </body>
        </html>
    );
}