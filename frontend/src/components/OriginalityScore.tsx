'use client';

interface OriginalityScoreProps {
    score: number;
    status: 'original' | 'review' | 'duplicate';
    message?: string;
}

export default function OriginalityScore({ score, status, message }: OriginalityScoreProps) {
    // Calculate stroke dash for circular progress
    const circumference = 2 * Math.PI * 45; // radius = 45
    const strokeDashoffset = circumference - (score / 100) * circumference;

    // Color based on score
    const getColor = () => {
        if (score >= 70) return { stroke: '#10b981', bg: 'rgba(16, 185, 129, 0.2)', text: '#10b981' };
        if (score >= 40) return { stroke: '#f59e0b', bg: 'rgba(245, 158, 11, 0.2)', text: '#f59e0b' };
        return { stroke: '#ef4444', bg: 'rgba(239, 68, 68, 0.2)', text: '#ef4444' };
    };

    const colors = getColor();

    const getStatusLabel = () => {
        switch (status) {
            case 'original': return 'ORIGINAL';
            case 'review': return 'NEEDS REVIEW';
            case 'duplicate': return 'DUPLICATE FOUND';
        }
    };

    return (
        <div className="glass-panel p-6 rounded-2xl animate-fade-in relative overflow-hidden group">
            <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${score >= 70 ? 'from-green-500 to-emerald-500' :
                    score >= 40 ? 'from-amber-500 to-orange-500' :
                        'from-red-500 to-rose-500'
                }`}></div>

            <h3 className="text-lg font-bold text-white mb-6 flex items-center justify-center gap-2">
                <span className="text-xl">📊</span> Originality Score
            </h3>

            {/* Circular Progress */}
            <div className="relative w-48 h-48 mx-auto mb-8 cursor-default">
                {/* Glow behind circle */}
                <div className="absolute inset-0 rounded-full blur-[20px] opacity-20" style={{ backgroundColor: colors.stroke }}></div>

                <svg className="w-full h-full transform -rotate-90 drop-shadow-lg">
                    {/* Background circle */}
                    <circle
                        cx="96"
                        cy="96"
                        r="80"
                        stroke="rgba(255,255,255,0.05)"
                        strokeWidth="12"
                        fill="none"
                    />
                    {/* Progress circle */}
                    <circle
                        cx="96"
                        cy="96"
                        r="80"
                        stroke={colors.stroke}
                        strokeWidth="12"
                        fill="none"
                        strokeLinecap="round"
                        strokeDasharray={2 * Math.PI * 80}
                        strokeDashoffset={2 * Math.PI * 80 - (score / 100) * (2 * Math.PI * 80)}
                        style={{
                            transition: 'stroke-dashoffset 1.5s ease-out',
                            filter: `drop-shadow(0 0 8px ${colors.stroke})`
                        }}
                    />
                </svg>

                {/* Score text in center */}
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-5xl font-black tracking-tighter text-glow" style={{ color: colors.text }}>
                        {score}%
                    </span>
                    <span className="text-xs text-zinc-500 font-medium uppercase tracking-widest mt-1">Unique</span>
                </div>
            </div>

            {/* Status badge */}
            <div className="flex justify-center mb-6">
                <div
                    className="px-6 py-2 rounded-full font-bold text-sm tracking-wide shadow-lg border border-opacity-20 backdrop-blur-md"
                    style={{
                        backgroundColor: colors.bg,
                        color: colors.text,
                        borderColor: colors.stroke,
                        boxShadow: `0 0 15px ${colors.bg}`
                    }}
                >
                    {getStatusLabel()}
                </div>
            </div>

            {/* Message */}
            {message && (
                <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                    <p className="text-zinc-300 text-sm leading-relaxed">{message}</p>
                </div>
            )}
        </div>
    );
}
