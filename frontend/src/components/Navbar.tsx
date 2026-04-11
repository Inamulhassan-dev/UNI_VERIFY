'use client';

import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { getUser, removeToken } from '@/lib/api';

export default function Navbar() {
    const router = useRouter();
    const pathname = usePathname();
    const [user, setUser] = useState<any>(null);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        setUser(getUser());
    }, []);

    const handleLogout = () => {
        removeToken();
        setUser(null);
        router.push('/login');
    };

    if (!mounted) return null;

    const isActive = (path: string) => pathname === path;

    return (
        <nav className="fixed top-4 left-0 right-0 z-50 px-4 md:px-6">
            <div className="max-w-7xl mx-auto glass-panel rounded-2xl px-6 py-4 flex items-center justify-between">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-3 group">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-cyan-500 flex items-center justify-center shadow-[0_0_15px_rgba(99,102,241,0.5)] group-hover:shadow-[0_0_25px_rgba(6,182,212,0.6)] transition-all duration-300">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <div>
                        <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-indigo-200">UNI-VERIFY</span>
                        <p className="text-[10px] text-zinc-400 uppercase tracking-widest">St. Philomena's College</p>
                    </div>
                </Link>

                {/* Navigation */}
                <div className="flex items-center gap-2 md:gap-4">
                    {user ? (
                        <>
                            {user.role === 'admin' ? (
                                <>
                                    <Link
                                        href="/admin"
                                        className={`px-4 py-2 rounded-lg transition-all text-sm font-medium ${isActive('/admin')
                                            ? 'bg-indigo-500/20 text-indigo-400 shadow-[0_0_10px_rgba(99,102,241,0.2)] border border-indigo-500/30'
                                            : 'text-zinc-400 hover:text-white hover:bg-white/5'
                                            }`}
                                    >
                                        Dashboard
                                    </Link>
                                    <Link
                                        href="/admin/warehouse"
                                        className={`px-4 py-2 rounded-lg transition-all text-sm font-medium ${isActive('/admin/warehouse')
                                            ? 'bg-cyan-500/20 text-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.2)] border border-cyan-500/30'
                                            : 'text-zinc-400 hover:text-white hover:bg-white/5'
                                            }`}
                                    >
                                        🗄️ Data Warehouse
                                    </Link>
                                </>
                            ) : (
                                <Link
                                    href="/dashboard"
                                    className={`px-4 py-2 rounded-lg transition-all text-sm font-medium ${isActive('/dashboard')
                                        ? 'bg-indigo-500/20 text-indigo-400 shadow-[0_0_10px_rgba(99,102,241,0.2)] border border-indigo-500/30'
                                        : 'text-zinc-400 hover:text-white hover:bg-white/5'
                                        }`}
                                >
                                    Dashboard
                                </Link>
                            )}

                            <div className="flex items-center gap-3 pl-4 border-l border-white/10">
                                <div className="text-right hidden md:block">
                                    <p className="text-sm font-medium text-white text-glow">{user.name}</p>
                                    <div className="flex justify-end">
                                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-zinc-400 uppercase tracking-wider">
                                            {user.role}
                                        </span>
                                    </div>
                                </div>
                                <button
                                    onClick={handleLogout}
                                    className="p-2 rounded-lg text-zinc-400 hover:text-red-400 hover:bg-red-500/10 transition-all"
                                    title="Logout"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                    </svg>
                                </button>
                            </div>
                        </>
                    ) : (
                        <>
                            <Link
                                href="/login"
                                className={`px-4 py-2 rounded-lg transition-all text-sm font-medium ${isActive('/login')
                                    ? 'text-white bg-white/10'
                                    : 'text-zinc-400 hover:text-white hover:bg-white/5'
                                    }`}
                            >
                                Login
                            </Link>
                            <Link href="/register" className="btn-primary text-sm shadow-[0_0_15px_rgba(124,58,237,0.4)]">
                                Register
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
}
