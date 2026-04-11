'use client';

interface SimilarProject {
    id: number;
    title: string;
    similarity: number;
    year?: number;
    semester?: number;
    source?: 'warehouse' | 'student';
    department?: string;
}

interface SimilarityReportProps {
    similarProjects: SimilarProject[];
}

export default function SimilarityReport({ similarProjects }: SimilarityReportProps) {
    if (!similarProjects || similarProjects.length === 0) {
        return (
            <div className="card animate-fade-in">
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center">
                        <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-white">No Similar Projects Found</h3>
                        <p className="text-sm text-zinc-400">Your project appears to be unique!</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="glass-panel p-6 rounded-2xl animate-fade-in border-t border-white/5 relative overflow-hidden">
            {/* Ambient background glow */}
            <div className="absolute -top-20 -right-20 w-40 h-40 bg-amber-500/10 rounded-full blur-[40px] pointer-events-none"></div>

            <div className="flex items-center gap-4 mb-6 relative z-10">
                <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center shadow-[0_0_15px_rgba(245,158,11,0.2)]">
                    <svg className="w-6 h-6 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                </div>
                <div>
                    <h3 className="text-lg font-bold text-white">Similar Projects Found</h3>
                    <p className="text-sm text-zinc-400">Matches detected in the database</p>
                </div>
            </div>

            <div className="space-y-3 relative z-10">
                {similarProjects.map((project, index) => (
                    <div
                        key={project.id}
                        className="group flex flex-col md:flex-row md:items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5 hover:border-amber-500/30 hover:bg-white/10 transition-all duration-300"
                    >
                        <div className="flex items-start gap-4 mb-3 md:mb-0">
                            <span className="w-8 h-8 rounded-lg bg-black/40 flex items-center justify-center text-sm font-bold text-zinc-500 border border-white/5 font-mono">
                                {index + 1}
                            </span>
                            <div>
                                <div className="flex items-center gap-2 mb-1 flex-wrap">
                                    <p className="text-white font-medium group-hover:text-amber-200 transition-colors">{project.title}</p>
                                    {project.source === 'warehouse' ? (
                                        <span className="bg-purple-500/20 text-purple-300 border border-purple-500/30 text-[10px] px-2 py-0.5 rounded uppercase tracking-wider font-bold shadow-[0_0_10px_rgba(168,85,247,0.2)]">
                                            Warehouse
                                        </span>
                                    ) : (
                                        <span className="bg-blue-500/20 text-blue-300 border border-blue-500/30 text-[10px] px-2 py-0.5 rounded uppercase tracking-wider font-bold shadow-[0_0_10px_rgba(59,130,246,0.2)]">
                                            Student
                                        </span>
                                    )}
                                </div>
                                <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-zinc-500">
                                    {project.year && <span className="flex items-center gap-1"><span className="w-1 h-1 bg-zinc-600 rounded-full"></span>Year {project.year}</span>}
                                    {project.department && <span className="flex items-center gap-1"><span className="w-1 h-1 bg-zinc-600 rounded-full"></span>{project.department}</span>}
                                </div>
                            </div>
                        </div>

                        <div className="text-right pl-4 flex items-center gap-4 md:flex-col md:items-end md:gap-0">
                            <div className="flex items-baseline justify-end gap-1">
                                <span
                                    className={`text-2xl font-bold ${project.similarity >= 80 ? 'text-red-400 text-glow' :
                                        project.similarity >= 60 ? 'text-amber-400' :
                                            'text-yellow-400'
                                        }`}
                                >
                                    {project.similarity}%
                                </span>
                            </div>

                            {/* Similarity Bar */}
                            <div className="w-full md:w-24 h-1.5 bg-zinc-800 rounded-full mt-1 overflow-hidden">
                                <div
                                    className={`h-full rounded-full ${project.similarity >= 80 ? 'bg-red-500 shadow-[0_0_10px_#ef4444]' :
                                        project.similarity >= 60 ? 'bg-amber-500 shadow-[0_0_10px_#f59e0b]' :
                                            'bg-yellow-500'
                                        }`}
                                    style={{ width: `${project.similarity}%` }}
                                ></div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
