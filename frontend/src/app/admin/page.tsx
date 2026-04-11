'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import { adminAPI, getUser, getToken } from '@/lib/api';

interface Project {
    id: number;
    title: string;
    abstract?: string;
    originality_score: number;
    status: string;
    year?: number;
    semester?: number;
    created_at: string;
    student: {
        id: number;
        name: string;
        roll_number?: string;
        department?: string;
    };
}

interface Stats {
    total_students: number;
    total_projects: number;
    pending_projects: number;
    approved_projects: number;
    rejected_projects: number;
    average_originality_score: number;
}

export default function AdminPage() {
    const router = useRouter();
    const [user, setUser] = useState<any>(null);
    const [projects, setProjects] = useState<Project[]>([]);
    const [stats, setStats] = useState<Stats | null>(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'dashboard' | 'projects' | 'users'>('dashboard');
    const [users, setUsers] = useState<any[]>([]);

    useEffect(() => {
        const token = getToken();
        const userData = getUser();

        if (!token || !userData) {
            router.push('/login');
            return;
        }

        if (userData.role !== 'admin') {
            router.push('/dashboard');
            return;
        }

        setUser(userData);
        loadData();
    }, [router]);

    const loadData = async () => {
        setLoading(true);
        try {
            const [projectsRes, statsRes, usersRes] = await Promise.all([
                adminAPI.getAllProjects(),
                adminAPI.getStats(),
                adminAPI.getAllUsers()
            ]);
            setProjects(projectsRes.projects);
            setStats(statsRes);
            setUsers(usersRes.users);
        } catch (err) {
            console.error('Failed to load admin data:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusChange = async (projectId: number, newStatus: string) => {
        try {
            await adminAPI.updateProjectStatus(projectId, newStatus);
            loadData();
        } catch (err) {
            console.error('Failed to update status:', err);
        }
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'approved':
                return <span className="badge badge-success">Approved</span>;
            case 'rejected':
                return <span className="badge badge-danger">Rejected</span>;
            default:
                return <span className="badge badge-pending">Pending</span>;
        }
    };

    if (!user || loading) {
        return (
            <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
                <div className="spinner"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0a0a0a]">
            <Navbar />

            <main className="pt-24 pb-16 px-6">
                <div className="max-w-7xl mx-auto">
                    {/* Header */}
                    <div className="mb-8 animate-fade-in">
                        <h1 className="text-3xl font-bold text-white mb-2">
                            Admin Dashboard 🛡️
                        </h1>
                        <p className="text-zinc-400">
                            Manage projects and students
                        </p>
                    </div>

                    {/* Tabs */}
                    <div className="flex gap-2 mb-6">
                        <button
                            onClick={() => setActiveTab('dashboard')}
                            className={`px-6 py-3 rounded-lg font-medium transition-all ${activeTab === 'dashboard'
                                    ? 'bg-indigo-500 text-white'
                                    : 'bg-zinc-800 text-zinc-400 hover:text-white'
                                }`}
                        >
                            📊 Overview
                        </button>
                        <button
                            onClick={() => setActiveTab('projects')}
                            className={`px-6 py-3 rounded-lg font-medium transition-all ${activeTab === 'projects'
                                    ? 'bg-indigo-500 text-white'
                                    : 'bg-zinc-800 text-zinc-400 hover:text-white'
                                }`}
                        >
                            📁 Projects ({projects.length})
                        </button>
                        <button
                            onClick={() => setActiveTab('users')}
                            className={`px-6 py-3 rounded-lg font-medium transition-all ${activeTab === 'users'
                                    ? 'bg-indigo-500 text-white'
                                    : 'bg-zinc-800 text-zinc-400 hover:text-white'
                                }`}
                        >
                            👥 Students ({users.filter(u => u.role === 'student').length})
                        </button>
                    </div>

                    {activeTab === 'dashboard' && stats && (
                        <div className="animate-fade-in">
                            {/* Stats Grid */}
                            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                                <div className="card">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-xl bg-indigo-500/20 flex items-center justify-center">
                                            <svg className="w-6 h-6 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                                            </svg>
                                        </div>
                                        <div>
                                            <p className="text-sm text-zinc-400">Total Students</p>
                                            <p className="text-2xl font-bold text-white">{stats.total_students}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="card">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-xl bg-cyan-500/20 flex items-center justify-center">
                                            <svg className="w-6 h-6 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                            </svg>
                                        </div>
                                        <div>
                                            <p className="text-sm text-zinc-400">Total Projects</p>
                                            <p className="text-2xl font-bold text-white">{stats.total_projects}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="card">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-xl bg-amber-500/20 flex items-center justify-center">
                                            <svg className="w-6 h-6 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                        </div>
                                        <div>
                                            <p className="text-sm text-zinc-400">Pending Review</p>
                                            <p className="text-2xl font-bold text-white">{stats.pending_projects}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="card">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center">
                                            <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                            </svg>
                                        </div>
                                        <div>
                                            <p className="text-sm text-zinc-400">Avg. Originality</p>
                                            <p className="text-2xl font-bold text-white">{stats.average_originality_score}%</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Status breakdown */}
                            <div className="grid md:grid-cols-3 gap-6">
                                <div className="card text-center">
                                    <div className="text-4xl font-bold text-green-400 mb-2">{stats.approved_projects}</div>
                                    <p className="text-zinc-400">Approved Projects</p>
                                </div>
                                <div className="card text-center">
                                    <div className="text-4xl font-bold text-amber-400 mb-2">{stats.pending_projects}</div>
                                    <p className="text-zinc-400">Pending Projects</p>
                                </div>
                                <div className="card text-center">
                                    <div className="text-4xl font-bold text-red-400 mb-2">{stats.rejected_projects}</div>
                                    <p className="text-zinc-400">Rejected Projects</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'projects' && (
                        <div className="animate-fade-in">
                            {projects.length === 0 ? (
                                <div className="card text-center py-16">
                                    <p className="text-zinc-400">No projects submitted yet</p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {projects.map((project) => (
                                        <div key={project.id} className="card">
                                            <div className="flex items-start justify-between gap-6">
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-3 mb-2">
                                                        <h3 className="text-lg font-semibold text-white">{project.title}</h3>
                                                        {getStatusBadge(project.status)}
                                                    </div>

                                                    <p className="text-sm text-zinc-500 mb-3">
                                                        By {project.student.name}
                                                        {project.student.roll_number && ` (${project.student.roll_number})`}
                                                        {project.student.department && ` • ${project.student.department}`}
                                                    </p>

                                                    {project.abstract && (
                                                        <p className="text-sm text-zinc-400 line-clamp-2 mb-3">
                                                            {project.abstract}
                                                        </p>
                                                    )}

                                                    <p className="text-xs text-zinc-600">
                                                        Submitted: {new Date(project.created_at).toLocaleString()}
                                                        {project.year && ` • Year ${project.year}`}
                                                        {project.semester && ` • Sem ${project.semester}`}
                                                    </p>
                                                </div>

                                                <div className="flex items-center gap-4">
                                                    <div className="text-center">
                                                        <span className={`text-3xl font-bold ${project.originality_score >= 70 ? 'text-green-400' :
                                                                project.originality_score >= 40 ? 'text-amber-400' :
                                                                    'text-red-400'
                                                            }`}>
                                                            {project.originality_score}%
                                                        </span>
                                                        <p className="text-xs text-zinc-500">Originality</p>
                                                    </div>

                                                    <div className="flex flex-col gap-2">
                                                        <button
                                                            onClick={() => handleStatusChange(project.id, 'approved')}
                                                            disabled={project.status === 'approved'}
                                                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${project.status === 'approved'
                                                                    ? 'bg-green-500/20 text-green-400 cursor-not-allowed'
                                                                    : 'bg-green-500/10 text-green-400 hover:bg-green-500/20'
                                                                }`}
                                                        >
                                                            ✓ Approve
                                                        </button>
                                                        <button
                                                            onClick={() => handleStatusChange(project.id, 'rejected')}
                                                            disabled={project.status === 'rejected'}
                                                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${project.status === 'rejected'
                                                                    ? 'bg-red-500/20 text-red-400 cursor-not-allowed'
                                                                    : 'bg-red-500/10 text-red-400 hover:bg-red-500/20'
                                                                }`}
                                                        >
                                                            ✗ Reject
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === 'users' && (
                        <div className="animate-fade-in">
                            {users.filter(u => u.role === 'student').length === 0 ? (
                                <div className="card text-center py-16">
                                    <p className="text-zinc-400">No students registered yet</p>
                                </div>
                            ) : (
                                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {users.filter(u => u.role === 'student').map((student) => (
                                        <div key={student.id} className="card">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-cyan-500 flex items-center justify-center text-white font-bold text-lg">
                                                    {student.name.charAt(0).toUpperCase()}
                                                </div>
                                                <div>
                                                    <h3 className="text-white font-medium">{student.name}</h3>
                                                    <p className="text-sm text-zinc-500">{student.email}</p>
                                                    {student.roll_number && (
                                                        <p className="text-xs text-zinc-600">{student.roll_number}</p>
                                                    )}
                                                </div>
                                            </div>
                                            {student.department && (
                                                <div className="mt-3 pt-3 border-t border-zinc-800">
                                                    <p className="text-xs text-zinc-500">{student.department}</p>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
