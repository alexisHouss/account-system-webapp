// components/Sidebar.tsx
import Link from 'next/link';
import { useRouter } from 'next/router';
import Cookies from 'js-cookie';
import React from 'react';

const Sidebar: React.FC = () => {
    const router = useRouter();

    const handleLogout = () => {
        console.log('Logging out');
        // Remove tokens from cookies
        Cookies.remove('access_token');
        Cookies.remove('refresh_token');
        // Optionally: clear any local state or context here

        // Redirect to home page
        router.push('/login');
    };

    return (
        <aside className="w-64 h-screen bg-gray-800 text-white p-4">
            <div className="mb-8">
                <h2 className="text-2xl font-bold">My App</h2>
            </div>
            <nav className="space-y-4">
                <Link href="/search">
                    <p className="block px-4 py-2 rounded hover:bg-gray-700">Search</p>
                </Link>
                <Link href="/profile">
                    <p className="block px-4 py-2 rounded hover:bg-gray-700">My Profile</p>
                </Link>
                <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 rounded hover:bg-gray-700"
                >
                    Logout
                </button>
            </nav>
        </aside>
    );
};

export default Sidebar;
