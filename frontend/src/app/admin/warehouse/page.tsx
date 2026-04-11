'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import { adminAPI, getUser, getToken } from '@/lib/api';

interface WarehouseProject {
    id: number;
    title: string;
    department?: string;
    year?: number;
    file_format?: string;
    word_count?: number;
    abstract?: string;
    created_at?: string;
}

interface WarehouseStats {
    total_files: number;
    total_size_bytes: number;
    total_size_mb: number;
}

export default function WarehousePage() {
    const router = useRouter();
    const [user, setUser] = useState<any>(null);
    const [projects, setProjects] = useState<WarehouseProject[]>([]);
    const [stats, setStats] = useState<WarehouseStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [dragActive, setDragActive] = useState(false);
    const [uploadProgress, setUploadProgress] = useState<string>('');
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');

    const filteredProjects = projects.filter(p =>
        p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (p.department && p.department.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (p.year && p.year.toString().includes(searchTerm))
    );
    const [success, setSuccess] = useState('');

    // Upload form state
    const [title, setTitle] = useState('');
    const [department, setDepartment] = useState('');
    const [year, setYear] = useState('');
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

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
        loadProjects();
    }, [router]);

    const loadProjects = async () => {
        try {
            const res = await adminAPI.getWarehouseProjects();
            setProjects(res.projects || []);
            setStats(res.stats || null);
        } catch (err: any) {
            console.error('Failed to load warehouse data:', err);
            setError(err.message || 'Failed to load warehouse data');
        } finally {
            setLoading(false);
        }
    };

    const handleUpload = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!selectedFile) {
            setError('Please select a file');
            return;
        }
        if (!title.trim()) {
            setError('Please enter a project title');
            return;
        }

        setUploading(true);
        setError('');
        setSuccess('');
        setUploadProgress('Uploading and processing document...');

        try {
            const res = await adminAPI.uploadToWarehouse(
                selectedFile,
                title,
                department || undefined,
                year ? parseInt(year) : undefined
            );

            if (res.duplicate) {
                // Duplicate detected — show warning
                setError(res.message);
                setUploadProgress('');
            } else {
                // Success
                setSuccess(`✅ "${res.project.title}" added to warehouse! (${res.project.word_count} words)`);
                setTitle('');
                setDepartment('');
                setYear('');
                setSelectedFile(null);
                setUploadProgress('');
                loadProjects();
            }
        } catch (err: any) {
            setError(err.message || 'Upload failed');
            setUploadProgress('');
        } finally {
            setUploading(false);
        }
    };

    const handleDelete = async (id: number, projectTitle: string) => {
        if (!confirm(`Are you sure you want to delete "${projectTitle}" from the warehouse?`)) return;

        try {
            await adminAPI.deleteWarehouseProject(id);
            setSuccess(`Deleted "${projectTitle}" from warehouse`);
            loadProjects();
        } catch (err: any) {
            setError(err.message || 'Delete failed');
        }
    };

    // Drag and drop handlers
    const handleDrag = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === 'dragenter' || e.type === 'dragover') {
            setDragActive(true);
        } else if (e.type === 'dragleave') {
            setDragActive(false);
        }
    }, []);

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            const file = e.dataTransfer.files[0];
            const validExts = ['.pdf', '.docx', '.doc', '.txt', '.pptx'];
            const ext = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();
            if (validExts.includes(ext)) {
                setSelectedFile(file);
                setError('');
                // Auto-fill title from filename if empty
                if (!title) {
                    setTitle(file.name.replace(/\.[^/.]+$/, '').replace(/[_-]/g, ' '));
                }
            } else {
                setError('Unsupported file format. Use PDF, DOCX, TXT, or PPTX.');
            }
        }
    }, [title]);

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setSelectedFile(e.target.files[0]);
            setError('');
            if (!title) {
                setTitle(e.target.files[0].name.replace(/\.[^/.]+$/, '').replace(/[_-]/g, ' '));
            }
        }
    };

    const getFormatBadge = (format: string) => {
        const colors: Record<string, string> = {
            pdf: 'bg-red-500/20 text-red-400',
            docx: 'bg-blue-500/20 text-blue-400',
            doc: 'bg-blue-500/20 text-blue-400',
            txt: 'bg-green-500/20 text-green-400',
            pptx: 'bg-orange-500/20 text-orange-400',
        };
        return (
            <span className={`px-2 py-1 rounded-md text-xs font-medium uppercase ${colors[format] || 'bg-zinc-500/20 text-zinc-400'}`}>
                {format}
            </span>
        );
    };

    if (!user || loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="w-16 h-16 border-4 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen">
            <Navbar />

            <main className="page-container relative z-10">
                <div className="max-w-7xl mx-auto">
                    {/* Header */}
                    <div className="mb-8 animate-fade-in">
                        <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
                            <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-indigo-400 text-glow">
                                Data Warehouse
                            </span>
                            <span className="text-3xl">🗄️</span>
                        </h1>
                        <p className="text-zinc-400 text-lg max-w-2xl">
                            Manage the knowledge base used for originality checks. Upload past projects, research papers, and reference documents.
                        </p>

                        {/* Stats */}
                        {stats && (
                            <div className="flex gap-6 mt-6">
                                <div className="glass-panel px-4 py-2 rounded-lg flex items-center gap-3 border border-cyan-500/20 shadow-[0_0_15px_rgba(6,182,212,0.1)]">
                                    <div className="w-2 h-2 rounded-full bg-cyan-400 box-shadow-neon-cyan"></div>
                                    <span className="text-sm text-zinc-400">
                                        <span className="text-white font-bold text-lg mr-1">{projects.length}</span> projects stored
                                    </span>
                                </div>
                                <div className="glass-panel px-4 py-2 rounded-lg flex items-center gap-3 border border-green-500/20 shadow-[0_0_15px_rgba(34,197,94,0.1)]">
                                    <div className="w-2 h-2 rounded-full bg-green-400 box-shadow-neon-green"></div>
                                    <span className="text-sm text-zinc-400">
                                        <span className="text-white font-bold text-lg mr-1">{stats.total_size_mb} MB</span> total storage
                                    </span>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="grid lg:grid-cols-3 gap-8">
                        {/* Upload Section */}
                        <div className="lg:col-span-1 animate-slide-right" style={{ animationDelay: '0.1s' }}>
                            <form onSubmit={handleUpload} className="glass-panel p-6 rounded-2xl sticky top-28 border-t border-white/5">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 rounded-full blur-[50px] -z-10 pointer-events-none"></div>

                                <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                                    <span className="w-1.5 h-6 bg-cyan-500 rounded-full box-shadow-neon-cyan"></span>
                                    Upload Project
                                </h2>

                                {/* Drag and Drop Zone */}
                                <div
                                    onDragEnter={handleDrag}
                                    onDragLeave={handleDrag}
                                    onDragOver={handleDrag}
                                    onDrop={handleDrop}
                                    className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 cursor-pointer mb-6 group overflow-hidden ${dragActive
                                        ? 'border-cyan-500 bg-cyan-500/10 shadow-[0_0_20px_rgba(6,182,212,0.2)]'
                                        : selectedFile
                                            ? 'border-green-500/50 bg-green-500/5'
                                            : 'border-white/10 hover:border-cyan-500/50 hover:bg-white/5'
                                        }`}
                                    onClick={() => document.getElementById('warehouse-file-input')?.click()}
                                >
                                    <input
                                        id="warehouse-file-input"
                                        type="file"
                                        accept=".pdf,.docx,.doc,.txt,.pptx"
                                        onChange={handleFileSelect}
                                        className="hidden"
                                    />

                                    {selectedFile ? (
                                        <div className="relative z-10">
                                            <div className="w-16 h-16 mx-auto mb-3 rounded-xl bg-green-500/20 flex items-center justify-center">
                                                <svg className="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                            </div>
                                            <p className="text-white font-semibold text-sm truncate max-w-full px-2">{selectedFile.name}</p>
                                            <p className="text-xs text-zinc-500 mt-1 font-mono">
                                                {(selectedFile.size / 1024).toFixed(1)} KB
                                            </p>
                                            <p className="text-xs text-green-400 mt-2 font-medium">Click to change file</p>
                                        </div>
                                    ) : (
                                        <div className="relative z-10">
                                            <div className="w-16 h-16 mx-auto mb-4 rounded-xl bg-zinc-800/50 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 group-hover:bg-cyan-500/20">
                                                <svg className="w-8 h-8 text-zinc-400 group-hover:text-cyan-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                                </svg>
                                            </div>
                                            <p className="text-sm text-zinc-300 font-medium mb-1">
                                                Drag & drop or <span className="text-cyan-400 group-hover:text-cyan-300 underline underline-offset-2">browse</span>
                                            </p>
                                            <p className="text-xs text-zinc-500">
                                                PDF, DOCX, TXT, PPTX
                                            </p>
                                        </div>
                                    )}
                                </div>

                                {/* Form Fields */}
                                <div className="space-y-4">
                                    <div>
                                        <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-1.5 block ml-1">Project Title *</label>
                                        <input
                                            type="text"
                                            value={title}
                                            onChange={(e) => setTitle(e.target.value)}
                                            placeholder="e.g., Spam Detection Using ML"
                                            className="input-field"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-1.5 block ml-1">Department</label>
                                        <select
                                            value={department}
                                            onChange={(e) => setDepartment(e.target.value)}
                                            className="input-field appearance-none"
                                        >
                                            <option value="" className="bg-zinc-900">Select Department</option>
                                            <option value="Computer Science" className="bg-zinc-900">Computer Science</option>
                                            <option value="Information Technology" className="bg-zinc-900">Information Technology</option>
                                            <option value="Electronics" className="bg-zinc-900">Electronics</option>
                                            <option value="Mechanical" className="bg-zinc-900">Mechanical</option>
                                            <option value="Civil" className="bg-zinc-900">Civil</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-1.5 block ml-1">Year</label>
                                        <input
                                            type="number"
                                            value={year}
                                            onChange={(e) => setYear(e.target.value)}
                                            placeholder="e.g., 2024"
                                            className="input-field"
                                            min="2000"
                                            max="2030"
                                        />
                                    </div>
                                </div>

                                {/* Messages */}
                                {error && (
                                    <div className="mt-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-start gap-2 animate-shake">
                                        <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        {error}
                                    </div>
                                )}
                                {success && (
                                    <div className="mt-4 p-3 rounded-xl bg-green-500/10 border border-green-500/20 text-green-400 text-sm flex items-start gap-2 animate-fade-in">
                                        <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                        {success}
                                    </div>
                                )}
                                {uploadProgress && (
                                    <div className="mt-4 p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-sm flex items-center gap-3">
                                        <div className="w-4 h-4 border-2 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin"></div>
                                        {uploadProgress}
                                    </div>
                                )}

                                {/* Submit */}
                                <button
                                    type="submit"
                                    disabled={uploading || !selectedFile}
                                    className="btn-primary w-full mt-6 flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {uploading ? (
                                        'Processing...'
                                    ) : (
                                        <>
                                            <svg className="w-5 h-5 group-hover:-translate-y-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                                            </svg>
                                            Add to Warehouse
                                        </>
                                    )}
                                </button>
                            </form>
                        </div>

                        {/* Projects List */}
                        <div className="lg:col-span-2 animate-slide-up" style={{ animationDelay: '0.2s' }}>
                            <div className="flex items-center justify-between mb-6 glass-panel p-4 rounded-xl">
                                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                                    📋 Warehouse Projects
                                    <span className="bg-zinc-800 text-zinc-400 text-xs px-2 py-1 rounded-full">{filteredProjects.length}</span>
                                </h2>
                                <div className="relative group">
                                    <input
                                        type="text"
                                        placeholder="Search projects..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="pl-10 pr-4 py-2 bg-zinc-900/50 border border-zinc-700/50 rounded-lg text-sm text-white focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/50 w-64 transition-all"
                                    />
                                    <svg className="w-4 h-4 text-zinc-500 absolute left-3 top-2.5 group-focus-within:text-cyan-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                </div>
                            </div>

                            {projects.length === 0 ? (
                                <div className="glass-panel p-16 rounded-2xl text-center border-dashed border-2 border-zinc-800">
                                    <div className="w-24 h-24 rounded-full bg-zinc-800/50 flex items-center justify-center mx-auto mb-6">
                                        <span className="text-4xl">🗄️</span>
                                    </div>
                                    <h3 className="text-xl font-bold text-white mb-2">No projects in warehouse</h3>
                                    <p className="text-zinc-500 max-w-sm mx-auto">
                                        Upload project documents to start building the knowledge base for originality validation.
                                    </p>
                                </div>
                            ) : filteredProjects.length === 0 ? (
                                <div className="glass-panel p-12 rounded-2xl text-center">
                                    <div className="w-16 h-16 rounded-full bg-zinc-800/50 flex items-center justify-center mx-auto mb-4">
                                        <svg className="w-8 h-8 text-zinc-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                        </svg>
                                    </div>
                                    <p className="text-lg text-white font-medium">No results found</p>
                                    <p className="text-zinc-500 text-sm mt-1">Try adjusting your search terms</p>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {filteredProjects.map((project, idx) => (
                                        <div
                                            key={project.id}
                                            className="glass-panel p-5 rounded-xl group hover:border-cyan-500/30 hover:bg-white/5 transition-all duration-300 relative overflow-hidden"
                                            style={{ animationDelay: `${idx * 0.05}s` }}
                                        >
                                            <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/5 rounded-full blur-[60px] -translate-y-1/2 translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>

                                            <div className="flex items-start justify-between gap-4 relative z-10">
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center gap-3 mb-2">
                                                        <h3 className="text-white font-bold text-lg truncate group-hover:text-cyan-300 transition-colors">
                                                            {project.title}
                                                        </h3>
                                                        {project.file_format && getFormatBadge(project.file_format)}
                                                    </div>

                                                    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-zinc-500 font-medium">
                                                        {project.department && (
                                                            <span className="flex items-center gap-1.5 bg-zinc-800/50 px-2 py-1 rounded-md">
                                                                <span>📚</span> {project.department}
                                                            </span>
                                                        )}
                                                        {project.year && (
                                                            <span className="flex items-center gap-1.5 bg-zinc-800/50 px-2 py-1 rounded-md">
                                                                <span>📅</span> {project.year}
                                                            </span>
                                                        )}
                                                        {project.word_count && (
                                                            <span className="flex items-center gap-1.5 bg-zinc-800/50 px-2 py-1 rounded-md">
                                                                <span>📝</span> {project.word_count.toLocaleString()} words
                                                            </span>
                                                        )}
                                                    </div>

                                                    {project.abstract && (
                                                        <p className="text-sm text-zinc-400 mt-3 line-clamp-2 leading-relaxed pl-3 border-l-2 border-zinc-700">
                                                            {project.abstract}
                                                        </p>
                                                    )}

                                                    <div className="mt-3 text-xs text-zinc-600 flex items-center gap-2">
                                                        <span className="w-1 h-1 rounded-full bg-zinc-600"></span>
                                                        Added {new Date(project.created_at || '').toLocaleDateString()}
                                                    </div>
                                                </div>

                                                <button
                                                    onClick={() => handleDelete(project.id, project.title)}
                                                    className="p-2.5 rounded-lg text-zinc-500 hover:text-red-400 hover:bg-red-500/10 transition-all opacity-0 group-hover:opacity-100 flex-shrink-0"
                                                    title="Delete from warehouse"
                                                >
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                    </svg>
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
