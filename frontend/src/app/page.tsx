import Link from 'next/link';
import Navbar from '@/components/Navbar';

export default function Home() {
  return (
    <div className="min-h-screen relative overflow-hidden">
      <Navbar />

      <main className="pt-30 pb-16 px-6 relative">
        <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-[760px] h-[420px] bg-teal-500/10 rounded-full blur-[120px] -z-10"></div>
        <div className="absolute bottom-0 left-0 w-[360px] h-[360px] bg-amber-400/10 rounded-full blur-[100px] -z-10"></div>

        <div className="max-w-5xl mx-auto">
          <section className="rounded-2xl border border-slate-200/20 bg-white/95 text-slate-900 shadow-[0_20px_80px_rgba(0,0,0,0.35)]">
            <div className="p-8 sm:p-12 md:p-16">
              <div className="text-center border-b border-slate-300 pb-8">
                <p className="text-xs sm:text-sm uppercase tracking-[0.3em] text-slate-500">Title</p>
                <h1 className="mt-4 text-3xl sm:text-4xl md:text-5xl font-black tracking-tight leading-tight">
                  UNI-VERIFY PROJECT ORIGINALITY
                </h1>
                <h2 className="mt-2 text-2xl sm:text-3xl md:text-4xl font-bold tracking-[0.12em]">
                  VALIDATOR
                </h2>
              </div>

              <div className="mt-10 sm:mt-12 grid gap-5 text-lg sm:text-xl">
                <p><span className="font-semibold">Name:</span> Mohammed Maheen Shariff</p>
                <p><span className="font-semibold">Reg No:</span> SB230243</p>
                <p><span className="font-semibold">Teacher Incharge:</span> Ayesha</p>
                <p><span className="font-semibold">Academic Year:</span> 2025 - 2026</p>
              </div>

              <div className="mt-12 pt-8 border-t border-slate-300 flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-center">
                <Link href="/login" className="inline-flex justify-center rounded-lg bg-slate-900 text-white px-6 py-3 font-semibold hover:bg-slate-700 transition-colors">
                  Open Portal Login
                </Link>
                <Link href="/register" className="inline-flex justify-center rounded-lg border border-slate-500 text-slate-800 px-6 py-3 font-semibold hover:bg-slate-100 transition-colors">
                  Create Account
                </Link>
              </div>
            </div>
          </section>

          <p className="text-center text-zinc-400 text-sm mt-6">
            St. Philomena&apos;s College, Mysore
          </p>
        </div>
      </main>
    </div>
  );
}
