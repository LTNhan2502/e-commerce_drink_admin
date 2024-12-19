'use client';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import {
    AiOutlineDashboard,
    AiOutlineMenuFold,
    AiOutlineMenuUnfold,
    AiOutlineMore,
    AiOutlineProduct, AiOutlineShoppingCart
} from 'react-icons/ai';
import { useState } from 'react';
import Link from 'next/link';

const links = [
    { href: '/', label: 'Dashboard', icon: AiOutlineDashboard },
    { href: '/menu', label: 'Menu', icon: AiOutlineProduct },
    { href: '/orders', label: 'Order', icon: AiOutlineShoppingCart }
];

const AdminSidebar = () => {
    const [expanded, setExpanded] = useState<boolean>(false);
    const pathname = usePathname(); // Lấy đường dẫn hiện tại

    return (
        <aside className="h-screen fixed z-50">
            <nav className="h-full flex flex-col bg-white border-r shadow-sm">
                {/* Logo và Toggle */}
                <div className="p-4 pb-2 flex justify-between items-center">
                    <Image
                        src={'https://img.logoipsum.com/243.svg'}
                        alt={'logo'}
                        width={150}
                        height={150}
                        className={`overflow-hidden transition-all ${expanded ? 'w-52' : 'w-0'}`}
                    />
                    <button
                        className="text-2xl p-1.5 rounded-lg bg-gray-50 hover:bg-gray-100"
                        onClick={() => setExpanded(!expanded)}
                    >
                        {expanded ? <AiOutlineMenuFold /> : <AiOutlineMenuUnfold />}
                    </button>
                </div>

                {/* Menu Items */}
                <ul className="flex-1 px-3">
                    {links.map(({ href, label, icon: Icon }) => {
                        // Kiểm tra đường dẫn hiện tại
                        const isActive = pathname === href;
                        return (
                            <Link
                                key={href}
                                href={href}
                                className={`relative flex items-center py-2 px-3 my-1 font-medium rounded-md cursor-pointer transition-colors group ${
                                    isActive
                                        ? 'bg-gradient-to-tr from-indigo-200 to-indigo-100 text-indigo-800'
                                        : 'hover:bg-indigo-50 text-gray-600'
                                }`}
                            >
                                <Icon className="text-2xl" />
                                <span
                                    className={`overflow-hidden transition-all ${
                                        expanded ? 'w-52 ml-3' : 'w-0'
                                    }`}
                                >
                                    {label}
                                </span>
                                {!expanded && (
                                    <div
                                        className="absolute left-full rounded-md px-2 py-1 ml-6 bg-indigo-100 text-indigo-800 text-sm
                                        invisible opacity-20 -translate-x-3 transition-all
                                        group-hover:visible group-hover:opacity-100 group-hover:translate-x-0"
                                    >
                                        {label}
                                    </div>
                                )}
                            </Link>
                        );
                    })}
                </ul>

                {/* Footer */}
                <div className="border-t flex p-3">
                    <Image
                        src={'https://ui-avatars.com/api/?backgound=c7d2fe&color=3730a3&bold=true'}
                        alt={'avatar'}
                        width={150}
                        height={150}
                        className="w-10 h-10 rounded-md"
                    />
                    <div
                        className={`flex justify-between items-center overflow-hidden transition-all ${
                            expanded ? 'w-52 ml-3' : 'w-0'
                        }`}
                    >
                        <div className="leading-4">
                            <h4 className="font-semibold">Admin</h4>
                            <span className="text-xs text-gray-600">admin@gmail.com</span>
                        </div>
                        <AiOutlineMore size={20} />
                    </div>
                </div>
            </nav>
        </aside>
    );
};

export default AdminSidebar;
