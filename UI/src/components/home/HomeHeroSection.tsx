import React from 'react'
import { Camera, ShieldCheck, ArrowRight, CheckCircle2, UserCheck } from 'lucide-react'

interface HomeHeroSectionProps {
  onNavigate: (path: string) => void
}

export const HomeHeroSection: React.FC<HomeHeroSectionProps> = ({ onNavigate }) => {
  return (
    <section className="relative overflow-hidden pt-8 pb-12 sm:pt-14 sm:pb-16 border-b border-white/10 bg-gradient-to-b from-slate-900 via-slate-950 to-slate-950">
      {/* Decorative Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-72 bg-gradient-to-tr from-emerald-500/15 via-teal-500/10 to-transparent blur-3xl pointer-events-none" />

      <div className="relative mx-auto max-w-5xl px-4 sm:px-6 text-center">
        {/* Developer & Ownership Verification Badge */}
        <div className="inline-flex items-center gap-2 rounded-2xl sm:rounded-full border border-emerald-500/30 bg-emerald-950/40 px-3.5 py-1.5 text-[11px] sm:text-xs text-emerald-300 mb-6 shadow-sm max-w-full">
          <UserCheck className="h-4 w-4 text-emerald-400 shrink-0" />
          <span className="leading-snug">
            Aplikasi Resmi Milik: <strong className="text-white font-semibold">Abdi Syahputra Harahap & Anggista Parasela</strong>
          </span>
        </div>

        {/* Hero Title */}
        <h1 className="text-2xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white leading-tight">
          Kamera Cerdas Web PWA <br className="hidden sm:inline" />
          <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">
            Geotagging & Survei Lapangan Presisi
          </span>
        </h1>

        {/* Description */}
        <p className="mt-4 sm:mt-5 text-xs sm:text-sm md:text-base text-slate-300 leading-relaxed max-w-2xl mx-auto px-2">
          LocaCamp adalah aplikasi peramban (Progressive Web Application) untuk dokumentasi survei lapangan, inspeksi teknis, dan pemetaan dengan stempel koordinat satelit GPS otomatis, watermark resmi, dan pencadangan Google Drive.
        </p>

        {/* Action Buttons */}
        <div className="mt-7 sm:mt-8 flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 max-w-sm sm:max-w-none mx-auto">
          <button
            onClick={() => onNavigate('/')}
            className="flex items-center justify-center gap-2.5 rounded-xl sm:rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 px-5 py-3.5 text-xs sm:text-sm font-bold text-slate-950 shadow-xl shadow-emerald-500/25 hover:from-emerald-400 hover:to-teal-400 transition-all active:scale-95"
          >
            <Camera className="h-4 w-4 sm:h-5 sm:w-5 shrink-0" />
            <span>Mulai Jepret (Buka Kamera PWA)</span>
            <ArrowRight className="h-3.5 w-3.5 sm:h-4 sm:w-4 shrink-0" />
          </button>

          <button
            onClick={() => onNavigate('/privacy')}
            className="flex items-center justify-center gap-2 rounded-xl sm:rounded-2xl border border-white/10 bg-white/5 px-4 py-3.5 text-xs sm:text-sm font-semibold text-slate-200 hover:bg-white/10 hover:text-white transition-all active:scale-95"
          >
            <ShieldCheck className="h-4 w-4 text-emerald-400 shrink-0" />
            <span>Kebijakan Privasi</span>
          </button>
        </div>

        {/* Feature Highlights Pills */}
        <div className="mt-8 pt-5 border-t border-white/5 grid grid-cols-2 sm:flex sm:flex-wrap items-center justify-center gap-2.5 sm:gap-4 text-[11px] sm:text-xs text-slate-400">
          <div className="flex items-center gap-1.5 justify-center sm:justify-start">
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
            <span className="truncate">100% Client-Side</span>
          </div>
          <div className="flex items-center gap-1.5 justify-center sm:justify-start">
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
            <span className="truncate">Tanpa Pelacak & Iklan</span>
          </div>
          <div className="flex items-center gap-1.5 justify-center sm:justify-start">
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
            <span className="truncate">Google Drive Sync</span>
          </div>
          <div className="flex items-center gap-1.5 justify-center sm:justify-start">
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
            <span className="truncate">Open Source GitHub</span>
          </div>
        </div>
      </div>
    </section>
  )
}
