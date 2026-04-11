import Link from 'next/link';
import Navbar from '@/components/Navbar';

export default function Home() {
  return (
    <div className="min-h-screen">
      <Navbar />

      {/* Hero Section */}
      <main className="pt-32 pb-16 px-6 relative overflow-hidden">
        {/* Background Glows */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-indigo-600/20 rounded-full blur-[120px] -z-10 animate-pulse-glow"></div>
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-cyan-600/10 rounded-full blur-[100px] -z-10 animate-float"></div>

        <div className="max-w-6xl mx-auto">
          {/* Hero content */}
          <div className="text-center py-20 animate-fade-in relative z-10">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-panel border-indigo-500/30 mb-8 animate-float">
              <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse hover:shadow-[0_0_10px_#818cf8]"></span>
              <span className="text-sm text-indigo-300 tracking-wide font-medium">St. Philomena's College, Mysore</span>
            </div>

            {/* Title */}
            <h1 className="text-6xl md:text-8xl font-bold mb-6 tracking-tight">
              <span className="bg-clip-text text-transparent bg-gradient-to-b from-white via-indigo-100 to-indigo-300 text-glow">UNI-VERIFY</span>
            </h1>
            <div className="scanline-effect inline-block mb-8">
              <h2 className="text-2xl md:text-3xl text-cyan-200 font-light tracking-widest uppercase opacity-80">
                Project Originality Validation Portal
              </h2>
            </div>

            <p className="text-lg text-zinc-400 max-w-2xl mx-auto mb-12 leading-relaxed">
              Ensure your project is unique. Our <span className="text-indigo-400 font-medium">AI-powered system</span> analyzes your synopsis
              and compares it with existing projects to validate originality with precision.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <Link href="/register" className="btn-primary text-lg px-8 py-4 group">
                <span className="relative z-10 flex items-center gap-2">
                  Get Started
                  <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </span>
              </Link>
              <Link href="/login" className="btn-secondary text-lg px-8 py-4 backdrop-blur-md">
                Login to Portal
              </Link>
            </div>
          </div>

          {/* Features */}
          <div className="grid md:grid-cols-3 gap-6 mt-24">
            {/* Feature 1 */}
            <div className="glass-panel rounded-2xl p-8 hover:translate-y-[-5px] transition-transform duration-300 border-indigo-500/10">
              <div className="w-14 h-14 rounded-2xl bg-indigo-500/20 flex items-center justify-center mb-6 shadow-[0_0_20px_rgba(99,102,241,0.2)]">
                <svg className="w-7 h-7 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Upload Synopsis</h3>
              <p className="text-zinc-400 leading-relaxed">
                Simply upload your project synopsis in <span className="text-indigo-300">PDF, DOCX, or TXT</span> format. Our system automatically processes and parses the content.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="glass-panel rounded-2xl p-8 hover:translate-y-[-5px] transition-transform duration-300 border-cyan-500/10">
              <div className="w-14 h-14 rounded-2xl bg-cyan-500/20 flex items-center justify-center mb-6 shadow-[0_0_20px_rgba(6,182,212,0.2)]">
                <svg className="w-7 h-7 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-3">AI Analysis Engine</h3>
              <p className="text-zinc-400 leading-relaxed">
                Our advanced ML model goes beyond keyword matching, using <span className="text-cyan-300">semantic understanding</span> to detect deep similarities and rephrased content.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="glass-panel rounded-2xl p-8 hover:translate-y-[-5px] transition-transform duration-300 border-green-500/10">
              <div className="w-14 h-14 rounded-2xl bg-green-500/20 flex items-center justify-center mb-6 shadow-[0_0_20px_rgba(16,185,129,0.2)]">
                <svg className="w-7 h-7 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Instant Validation</h3>
              <p className="text-zinc-400 leading-relaxed">
                Get your <span className="text-green-300">originality score</span> instantly with detailed reports on where your project matches existing warehouse data.
              </p>
            </div>
          </div>

          {/* How it works */}
          <div className="mt-32 text-center pb-20">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">How It Works</h2>
            <div className="flex flex-col md:flex-row items-center justify-center gap-12 relative">
              {/* Connecting Line (Desktop) */}
              <div className="absolute top-8 left-20 right-20 h-0.5 bg-gradient-to-r from-transparent via-zinc-700 to-transparent hidden md:block -z-10"></div>

              <div className="flex flex-col items-center group">
                <div className="w-20 h-20 rounded-2xl bg-[#0a0a0a] border border-indigo-500/50 flex items-center justify-center text-3xl font-bold text-indigo-400 mb-6 shadow-[0_0_30px_rgba(99,102,241,0.15)] group-hover:scale-110 transition-transform duration-300 relative z-10">
                  1
                </div>
                <p className="text-white font-bold text-lg mb-1">Register</p>
                <p className="text-sm text-zinc-500">Create your student account</p>
              </div>

              <div className="flex flex-col items-center group">
                <div className="w-20 h-20 rounded-2xl bg-[#0a0a0a] border border-cyan-500/50 flex items-center justify-center text-3xl font-bold text-cyan-400 mb-6 shadow-[0_0_30px_rgba(6,182,212,0.15)] group-hover:scale-110 transition-transform duration-300 relative z-10">
                  2
                </div>
                <p className="text-white font-bold text-lg mb-1">Upload</p>
                <p className="text-sm text-zinc-500">Submit PDF/DOCX synopsis</p>
              </div>

              <div className="flex flex-col items-center group">
                <div className="w-20 h-20 rounded-2xl bg-[#0a0a0a] border border-green-500/50 flex items-center justify-center text-3xl font-bold text-green-400 mb-6 shadow-[0_0_30px_rgba(16,185,129,0.15)] group-hover:scale-110 transition-transform duration-300 relative z-10">
                  3
                </div>
                <p className="text-white font-bold text-lg mb-1">Verify</p>
                <p className="text-sm text-zinc-500">Get uniqueness score</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/5 bg-black/20 backdrop-blur-sm py-8 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-zinc-500 text-sm">
            © 2024 UNI-VERIFY • <span className="text-zinc-400">St. Philomena's College, Mysore</span>
          </p>
        </div>
      </footer>
    </div>
  );
}
