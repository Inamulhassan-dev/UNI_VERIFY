'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import FileUpload from '@/components/FileUpload';
import OriginalityScore from '@/components/OriginalityScore';
import SimilarityReport from '@/components/SimilarityReport';
import ProjectAnalysis from '@/components/ProjectAnalysis';
import { projectsAPI, getUser, getToken } from '@/lib/api';

interface Project {
    id: number;
    title: string;
    abstract?: string;
    originality_score: number;
    status: string;
    year?: number;
    semester?: number;
    created_at: string;
}

interface AnalysisResult {
    project: {
        id: number;
        title: string;
        abstract: string;
        originality_score: number;
        status: 'original' | 'review' | 'duplicate';
        message: string;
    };
    similar_projects: Array<{
        id: number;
        title: string;
        similarity: number;
        year?: number;
        semester?: number;
        source?: 'warehouse' | 'student';
        department?: string;
    }>;
    project_details?: {
        summary: string;
        technologies: string[];
        domain: string;
        word_count: number;
    };
    suggestions?: Array<{
        type: 'success' | 'warning' | 'danger' | 'tip' | 'info';
        title: string;
        message: string;
    }>;
}

export default function DashboardPage() {
    const router = useRouter();
    const [user, setUser] = useState<any>(null);
    const [projects, setProjects] = useState<Project[]>([]);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [projectTitle, setProjectTitle] = useState('');
    const [year, setYear] = useState('');
    const [semester, setSemester] = useState('');
    const [loading, setLoading] = useState(false);
    const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
    const [error, setError] = useState('');
    const [activeTab, setActiveTab] = useState<'upload' | 'history'>('upload');

    useEffect(() => {
        const token = getToken();
        const userData = getUser();

        if (!token || !userData) {
            router.push('/login');
            return;
        }

        if (userData.role === 'admin') {
            router.push('/admin');
            return;
        }

        setUser(userData);
        loadProjects();
    }, [router]);

    const loadProjects = async () => {
        try {
            const response = await projectsAPI.getMyProjects();
            setProjects(response.projects);
        } catch (err: any) {
            console.error('Failed to load projects:', err);
            // If session is invalid, redirect to login
            if (err.message?.includes('Session expired') || err.message?.includes('credentials')) {
                router.push('/login');
            }
        }
    };

    const handleUpload = async () => {
        if (!selectedFile || !projectTitle.trim()) {
            setError('Please select a file and enter a project title');
            return;
        }

        setLoading(true);
        setError('');
        setAnalysisResult(null);

        try {
            const response = await projectsAPI.upload(
                selectedFile,
                projectTitle.trim(),
                year ? parseInt(year) : undefined,
                semester ? parseInt(semester) : undefined
            );

            setAnalysisResult(response);
            loadProjects();
        } catch (err: any) {
            setError(err.message || 'Failed to analyze project');
        } finally {
            setLoading(false);
        }
    };

    const resetForm = () => {
        setSelectedFile(null);
        setProjectTitle('');
        setYear('');
        setSemester('');
        setAnalysisResult(null);
        setError('');
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

    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="w-16 h-16 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen">
            <Navbar />

            <main className="page-container relative z-10">
                <div className="max-w-6xl mx-auto">
                    {/* Header */}
                    <div className="mb-8 animate-fade-in">
                        <h1 className="text-4xl font-bold mb-2">
                            <span className="text-white">Welcome, </span>
                            <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-cyan-400 text-glow">
                                {user.name}! 👋
                            </span>
                        </h1>
                        <p className="text-zinc-400 text-lg">
                            Upload your project synopsis to check for originality
                        </p>
                    </div>

                    {/* Tabs */}
                    <div className="flex gap-4 mb-8 glass-panel inline-flex p-1 rounded-xl">
                        <button
                            onClick={() => setActiveTab('upload')}
                            className={`px-6 py-2.5 rounded-lg font-medium transition-all duration-300 flex items-center gap-2 ${activeTab === 'upload'
                                ? 'bg-indigo-600 text-white shadow-[0_0_15px_rgba(79,70,229,0.4)]'
                                : 'text-zinc-400 hover:text-white hover:bg-white/5'
                                }`}
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                            </svg>
                            Upload Project
                        </button>
                        <button
                            onClick={() => setActiveTab('history')}
                            className={`px-6 py-2.5 rounded-lg font-medium transition-all duration-300 flex items-center gap-2 ${activeTab === 'history'
                                ? 'bg-indigo-600 text-white shadow-[0_0_15px_rgba(79,70,229,0.4)]'
                                : 'text-zinc-400 hover:text-white hover:bg-white/5'
                                }`}
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                            </svg>
                            My Projects ({projects.length})
                        </button>
                    </div>

                    {activeTab === 'upload' ? (
                        <div className="grid lg:grid-cols-2 gap-8">
                            {/* Upload Section */}
                            <div className="space-y-6 animate-slide-up" style={{ animationDelay: '0.1s' }}>
                                <div className="glass-panel p-8 rounded-2xl border-t border-white/10 relative overflow-hidden group">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-600/10 rounded-full blur-[50px] -z-10 group-hover:bg-indigo-600/20 transition-all duration-500"></div>

                                    <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                                        <span className="w-2 h-6 bg-indigo-500 rounded-full"></span>
                                        Upload Project Synopsis
                                    </h2>

                                    {error && (
                                        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm mb-6 flex items-center gap-3">
                                            <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            {error}
                                        </div>
                                    )}

                                    <div className="space-y-6">
                                        <div>
                                            <label className="text-zinc-400 text-sm font-medium mb-2 block">Project Title *</label>
                                            <input
                                                type="text"
                                                value={projectTitle}
                                                onChange={(e) => setProjectTitle(e.target.value)}
                                                className="input-field"
                                                placeholder="e.g., AI-Powered Chat Application"
                                                disabled={loading}
                                            />
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="text-zinc-400 text-sm font-medium mb-2 block">Year</label>
                                                <select
                                                    value={year}
                                                    onChange={(e) => setYear(e.target.value)}
                                                    className="input-field appearance-none"
                                                    disabled={loading}
                                                >
                                                    <option value="" className="bg-zinc-900 text-zinc-400">Select Year</option>
                                                    <option value="1" className="bg-zinc-900">1st Year</option>
                                                    <option value="2" className="bg-zinc-900">2nd Year</option>
                                                    <option value="3" className="bg-zinc-900">3rd Year</option>
                                                    <option value="4" className="bg-zinc-900">4th Year</option>
                                                </select>
                                            </div>

                                            <div>
                                                <label className="text-zinc-400 text-sm font-medium mb-2 block">Semester</label>
                                                <select
                                                    value={semester}
                                                    onChange={(e) => setSemester(e.target.value)}
                                                    className="input-field appearance-none"
                                                    disabled={loading}
                                                >
                                                    <option value="" className="bg-zinc-900">Select Semester</option>
                                                    {[1, 2, 3, 4, 5, 6, 7, 8].map(s => (
                                                        <option key={s} value={s} className="bg-zinc-900">Semester {s}</option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>

                                        <div>
                                            <label className="text-zinc-400 text-sm font-medium mb-2 block">Synopsis (PDF, DOCX, TXT) *</label>
                                            <FileUpload
                                                onFileSelect={setSelectedFile}
                                                isLoading={loading}
                                            />
                                        </div>

                                        <div className="flex gap-4 pt-2">
                                            <button
                                                onClick={handleUpload}
                                                disabled={loading || !selectedFile || !projectTitle.trim()}
                                                className="btn-primary flex-1 flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                {loading ? (
                                                    <>
                                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                                        <span className="animate-pulse">Analyzing...</span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                        </svg>
                                                        Check Originality
                                                    </>
                                                )}
                                            </button>

                                            {analysisResult && (
                                                <button
                                                    onClick={resetForm}
                                                    className="btn-secondary"
                                                >
                                                    New Upload
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Results Section */}
                            <div className="space-y-6 animate-slide-up" style={{ animationDelay: '0.2s' }}>
                                {analysisResult ? (
                                    <>
                                        <OriginalityScore
                                            score={analysisResult.project.originality_score}
                                            status={analysisResult.project.status}
                                            message={analysisResult.project.message}
                                        />

                                        {/* Project Analysis & Suggestions */}
                                        {analysisResult.project_details && analysisResult.suggestions && (
                                            <ProjectAnalysis
                                                projectDetails={analysisResult.project_details}
                                                suggestions={analysisResult.suggestions}
                                            />
                                        )}

                                        <SimilarityReport
                                            similarProjects={analysisResult.similar_projects}
                                        />
                                    </>
                                ) : (
                                    <div className="glass-panel p-12 rounded-2xl text-center border-dashed border-2 border-zinc-800 h-full flex flex-col items-center justify-center">
                                        <div className="w-24 h-24 rounded-full bg-zinc-800/50 flex items-center justify-center mb-6 animate-float">
                                            <svg className="w-12 h-12 text-zinc-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                            </svg>
                                        </div>
                                        <h3 className="text-xl font-semibold text-white mb-2">
                                            Results Will Appear Here
                                        </h3>
                                        <p className="text-zinc-500 max-w-sm">
                                            Upload your synopsis to generate a detailed originality report and AI analysis.
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    ) : (
                        /* History Tab */
                        <div className="animate-fade-in space-y-4">
                            {projects.length === 0 ? (
                                <div className="glass-panel p-16 rounded-2xl text-center">
                                    <div className="w-20 h-20 rounded-full bg-zinc-800/50 flex items-center justify-center mx-auto mb-6">
                                        <svg className="w-10 h-10 text-zinc-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                        </svg>
                                    </div>
                                    <h3 className="text-xl font-bold text-white mb-2">No Projects Yet</h3>
                                    <p className="text-zinc-500 mb-6">Upload your first project to get started</p>
                                    <button
                                        onClick={() => setActiveTab('upload')}
                                        className="btn-primary"
                                    >
                                        Upload Project
                                    </button>
                                </div>
                            ) : (
                                <div className="grid gap-4">
                                    {projects.map((project, idx) => (
                                        <div
                                            key={project.id}
                                            className="glass-panel p-5 rounded-xl flex items-center justify-between hover:border-indigo-500/30 transition-all group animate-slide-up"
                                            style={{ animationDelay: `${idx * 0.05}s` }}
                                        >
                                            <div className="flex items-center gap-5">
                                                <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                                                    <svg className="w-6 h-6 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                    </svg>
                                                </div>
                                                <div>
                                                    <h3 className="text-white font-semibold text-lg group-hover:text-indigo-300 transition-colors">{project.title}</h3>
                                                    <div className="flex items-center gap-3 text-sm text-zinc-500 mt-1">
                                                        <span>{new Date(project.created_at).toLocaleDateString()}</span>
                                                        {project.year && <span className="w-1 h-1 bg-zinc-700 rounded-full"></span>}
                                                        {project.year && <span>Year {project.year}</span>}
                                                        {project.semester && <span className="w-1 h-1 bg-zinc-700 rounded-full"></span>}
                                                        {project.semester && <span>Sem {project.semester}</span>}
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-6">
                                                <div className="text-right">
                                                    <div className="flex items-baseline justify-end gap-1">
                                                        <span className={`text-2xl font-bold ${project.originality_score >= 70 ? 'text-green-400 text-glow' :
                                                                project.originality_score >= 40 ? 'text-amber-400' :
                                                                    'text-red-400'
                                                            }`}>
                                                            {project.originality_score}%
                                                        </span>
                                                    </div>
                                                    <p className="text-[10px] text-zinc-500 uppercase tracking-widest">Originality</p>
                                                </div>
                                                {getStatusBadge(project.status)}
                                            </div>
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
