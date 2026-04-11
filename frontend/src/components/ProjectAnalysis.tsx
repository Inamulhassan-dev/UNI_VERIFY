'use client';

interface ProjectAnalysisProps {
    projectDetails: {
        summary: string;
        technologies: string[];
        domain: string;
        word_count: number;
    };
    suggestions: Array<{
        type: 'success' | 'warning' | 'danger' | 'tip' | 'info';
        title: string;
        message: string;
    }>;
}

export default function ProjectAnalysis({ projectDetails, suggestions }: ProjectAnalysisProps) {
    const getSuggestionStyle = (type: string) => {
        switch (type) {
            case 'success':
                return 'bg-green-500/10 border-green-500/30 text-green-400';
            case 'warning':
                return 'bg-amber-500/10 border-amber-500/30 text-amber-400';
            case 'danger':
                return 'bg-red-500/10 border-red-500/30 text-red-400';
            case 'tip':
                return 'bg-indigo-500/10 border-indigo-500/30 text-indigo-400';
            case 'info':
            default:
                return 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400';
        }
    };

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Project Details Card */}
            <div className="glass-panel p-6 rounded-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-40 h-40 bg-indigo-500/10 rounded-full blur-[50px] -z-10 group-hover:bg-indigo-500/20 transition-all duration-500"></div>

                <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-indigo-500/20 flex items-center justify-center border border-indigo-500/30">
                        <svg className="w-4 h-4 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                    </div>
                    Project Analysis
                </h3>

                {/* Domain & Word Count */}
                <div className="flex flex-wrap gap-3 mb-6">
                    <span className="px-3 py-1.5 bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 rounded-lg text-sm font-medium flex items-center gap-2 shadow-[0_0_10px_rgba(99,102,241,0.1)]">
                        <span>🎯</span> {projectDetails.domain}
                    </span>
                    <span className="px-3 py-1.5 bg-zinc-800/50 border border-zinc-700 text-zinc-300 rounded-lg text-sm flex items-center gap-2">
                        <span>📝</span> {projectDetails.word_count.toLocaleString()} words
                    </span>
                </div>

                {/* Technologies */}
                <div className="mb-6">
                    <p className="text-xs text-zinc-500 uppercase tracking-widest font-semibold mb-3 ml-1">Detected Tech Stack</p>
                    <div className="flex flex-wrap gap-2">
                        {projectDetails.technologies.map((tech, index) => (
                            <span
                                key={index}
                                className="px-2.5 py-1 bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 rounded-md text-xs font-mono group-hover:border-cyan-500/40 transition-colors"
                            >
                                {tech}
                            </span>
                        ))}
                    </div>
                </div>

                {/* Summary */}
                <div className="bg-black/20 rounded-xl p-4 border border-white/5">
                    <p className="text-xs text-zinc-500 uppercase tracking-widest font-semibold mb-2">Executive Summary</p>
                    <p className="text-sm text-zinc-300 leading-relaxed">
                        {projectDetails.summary}
                    </p>
                </div>
            </div>

            {/* AI Suggestions */}
            {suggestions && suggestions.length > 0 && (
                <div className="glass-panel p-6 rounded-2xl border-t border-amber-500/20 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-32 h-32 bg-amber-500/10 rounded-full blur-[40px] -z-10"></div>

                    <h3 className="text-lg font-bold text-white mb-5 flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-amber-500/20 flex items-center justify-center border border-amber-500/30 shadow-[0_0_10px_rgba(245,158,11,0.2)] animate-pulse-glow">
                            <svg className="w-4 h-4 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                            </svg>
                        </div>
                        AI Recommendations
                    </h3>

                    <div className="space-y-4">
                        {suggestions.map((suggestion, index) => (
                            <div
                                key={index}
                                className={`p-4 rounded-xl border backdrop-blur-sm transition-all duration-300 hover:translate-x-1 ${getSuggestionStyle(suggestion.type)}`}
                                style={{ animationDelay: `${index * 0.1}s` }}
                            >
                                <p className="font-bold text-sm mb-1.5 flex items-center gap-2">
                                    {suggestion.type === 'success' && '✅'}
                                    {suggestion.type === 'warning' && '⚠️'}
                                    {suggestion.type === 'danger' && '🚨'}
                                    {suggestion.type === 'tip' && '💡'}
                                    {suggestion.title}
                                </p>
                                <p className="text-sm opacity-90 leading-relaxed pl-6">{suggestion.message}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
