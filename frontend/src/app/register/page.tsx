'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import { authAPI, setToken, setUser } from '@/lib/api';

export default function RegisterPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        roll_number: '',
        department: '',
        year: '',
        semester: '',
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const departments = [
        'Computer Science',
        'Information Science',
        'Electronics',
        'Mechanical',
        'Civil',
        'BCA',
        'MCA',
        'Other'
    ];

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError('');
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        if (formData.password.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const response = await authAPI.register({
                name: formData.name,
                email: formData.email,
                password: formData.password,
                roll_number: formData.roll_number || undefined,
                department: formData.department || undefined,
                year: formData.year ? parseInt(formData.year) : undefined,
                semester: formData.semester ? parseInt(formData.semester) : undefined,
            });

            setToken(response.access_token);
            setUser(response.user);
            router.push('/dashboard');
        } catch (err: any) {
            setError(err.message || 'Registration failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen">
            <Navbar />

            <main className="page-container flex items-center justify-center min-h-[calc(100vh-80px)]">
                <div className="w-full max-w-2xl animate-fade-in relative">
                    <div className="absolute top-0 right-1/2 translate-x-1/2 w-96 h-96 bg-cyan-500/10 rounded-full blur-[100px] -z-10"></div>

                    {/* Header */}
                    <div className="text-center mb-8">
                        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-cyan-500/20 border border-white/10 flex items-center justify-center mx-auto mb-6 shadow-[0_0_30px_rgba(6,182,212,0.3)] animate-float">
                            <svg className="w-10 h-10 text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                            </svg>
                        </div>
                        <h1 className="text-4xl font-bold text-white mb-2 tracking-tight">Create Account</h1>
                        <p className="text-zinc-400">Join <span className="text-cyan-400 font-semibold">UNI-VERIFY</span> to start validating projects</p>
                    </div>

                    {/* Form */}
                    <div className="glass-panel p-8 rounded-2xl border-t border-white/10">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {error && (
                                <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-center gap-3 animate-shake">
                                    <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    {error}
                                </div>
                            )}

                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <label htmlFor="name" className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2 block ml-1">Full Name *</label>
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        className="input-field"
                                        placeholder="John Doe"
                                        required
                                    />
                                </div>

                                <div>
                                    <label htmlFor="roll_number" className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2 block ml-1">Roll Number</label>
                                    <input
                                        type="text"
                                        id="roll_number"
                                        name="roll_number"
                                        value={formData.roll_number}
                                        onChange={handleChange}
                                        className="input-field"
                                        placeholder="21CS001"
                                    />
                                </div>
                            </div>

                            <div>
                                <label htmlFor="email" className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2 block ml-1">Email Address *</label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="input-field"
                                    placeholder="your.email@example.com"
                                    required
                                />
                            </div>

                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <label htmlFor="department" className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2 block ml-1">Department</label>
                                    <select
                                        id="department"
                                        name="department"
                                        value={formData.department}
                                        onChange={handleChange}
                                        className="input-field appearance-none"
                                    >
                                        <option value="" className="bg-zinc-900">Select Department</option>
                                        {departments.map(dept => (
                                            <option key={dept} value={dept} className="bg-zinc-900">{dept}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label htmlFor="year" className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2 block ml-1">Year</label>
                                        <select
                                            id="year"
                                            name="year"
                                            value={formData.year}
                                            onChange={handleChange}
                                            className="input-field appearance-none"
                                        >
                                            <option value="" className="bg-zinc-900">Year</option>
                                            <option value="1" className="bg-zinc-900">1st</option>
                                            <option value="2" className="bg-zinc-900">2nd</option>
                                            <option value="3" className="bg-zinc-900">3rd</option>
                                            <option value="4" className="bg-zinc-900">4th</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label htmlFor="semester" className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2 block ml-1">Semester</label>
                                        <select
                                            id="semester"
                                            name="semester"
                                            value={formData.semester}
                                            onChange={handleChange}
                                            className="input-field appearance-none"
                                        >
                                            <option value="" className="bg-zinc-900">Sem</option>
                                            {[1, 2, 3, 4, 5, 6, 7, 8].map(s => (
                                                <option key={s} value={s} className="bg-zinc-900">{s}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <label htmlFor="password" className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2 block ml-1">Password *</label>
                                    <input
                                        type="password"
                                        id="password"
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        className="input-field"
                                        placeholder="••••••••"
                                        required
                                    />
                                </div>

                                <div>
                                    <label htmlFor="confirmPassword" className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2 block ml-1">Confirm Password *</label>
                                    <input
                                        type="password"
                                        id="confirmPassword"
                                        name="confirmPassword"
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                        className="input-field"
                                        placeholder="••••••••"
                                        required
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="btn-primary w-full flex items-center justify-center gap-2 mt-4 group"
                            >
                                {loading ? (
                                    <>
                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                        Creating account...
                                    </>
                                ) : (
                                    <>
                                        Create Account
                                        <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                        </svg>
                                    </>
                                )}
                            </button>
                        </form>

                        <div className="mt-8 text-center pt-6 border-t border-white/5">
                            <p className="text-zinc-500 text-sm">
                                Already have an account?{' '}
                                <Link href="/login" className="text-cyan-400 hover:text-cyan-300 font-semibold hover:underline underline-offset-4 transition-all">
                                    Login
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
