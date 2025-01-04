export const metadata = {
    title: 'Login - AnTea',
    description: 'Login page',
}

export default function AuthLayout({children,}: { children: React.ReactNode; }) {
    return (
        <div className="min-h-screen flex items-center justify-center">
            {children}
        </div>
    );
}