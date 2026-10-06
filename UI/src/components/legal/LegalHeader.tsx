import React from 'react'
import { ShieldCheck, FileText, Camera, ArrowLeft } from 'lucide-react'

interface LegalHeaderProps {
  currentPath: string
  onNavigate: (path: string) => void
}

export const LegalHeader: React.FC<LegalHeaderProps> = ({ currentPath, onNavigate }) => {
  const isPrivacy = currentPath === '/privacy' || currentPath === '/privacy-policy'
  const isTerms = currentPath === '/terms' || currentPath === '/terms-of-service'

  return (
    <header className="sticky top-0 z-30 border-b border-white/10 bg-slate-950/90 backdrop-blur-md">
      <div className="mx-auto max-w-5xl px-3 py-2.5 sm:px-6 sm:py-3.5">
        {/* Desktop & Mobile Top Bar */}
        <div className="flex items-center justify-between gap-3">
          {/* Brand & Back Button */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={() => onNavigate('/')}
              className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-2.5 py-1.5 text-xs font-medium text-slate-200 transition-all hover:bg-white/10 hover:text-white active:scale-95"
              title="Kembali ke Kamera"
            >
              <ArrowLeft className="h-4 w-4 text-emerald-400" />
              <span>Kamera</span>
            </button>

            <div
              onClick={() => onNavigate('/')}
              className="flex cursor-pointer items-center gap-2 select-none"
            >
              <div className="flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 shadow-md shadow-emerald-900/30">
                <Camera className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-white" />
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-sm sm:text-base font-bold tracking-tight text-white">LocaCamp</span>
                <span className="rounded bg-emerald-500/20 px-1.5 py-0.5 text-[10px] font-semibold text-emerald-400">
                  Legal
                </span>
              </div>
            </div>
          </div>

          {/* Desktop Navigation Switcher (Hidden on small mobile screens, shown on sm:) */}
          <nav className="hidden sm:flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 p-1 text-xs">
            <button
              onClick={() => onNavigate('/privacy')}
              className={`flex items-center gap-1.5 rounded-lg px-3.5 py-1.5 font-medium transition-all ${
                isPrivacy
                  ? 'bg-emerald-500 text-slate-950 shadow-sm font-semibold'
                  : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`}
            >
              <ShieldCheck className="h-3.5 w-3.5" />
              <span>Kebijakan Privasi</span>
            </button>

            <button
              onClick={() => onNavigate('/terms')}
              className={`flex items-center gap-1.5 rounded-lg px-3.5 py-1.5 font-medium transition-all ${
                isTerms
                  ? 'bg-emerald-500 text-slate-950 shadow-sm font-semibold'
                  : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`}
            >
              <FileText className="h-3.5 w-3.5" />
              <span>Ketentuan Layanan</span>
            </button>
          </nav>
        </div>

        {/* Mobile Equal-Width Segmented Tab Bar (Grid 2-kolom persis 50% / 50%) */}
        <nav className="mt-2 grid grid-cols-2 sm:hidden w-full gap-1 rounded-xl border border-white/10 bg-slate-900/90 p-1 text-xs">
          <button
            onClick={() => onNavigate('/privacy')}
            className={`w-full flex items-center justify-center gap-1.5 rounded-lg py-2 px-1 text-[11px] font-medium tracking-tight transition-all ${
              isPrivacy
                ? 'bg-emerald-500 text-slate-950 shadow-sm font-semibold'
                : 'text-slate-300 hover:text-white hover:bg-white/5'
            }`}
          >
            <ShieldCheck className="h-3.5 w-3.5 shrink-0" />
            <span className="whitespace-nowrap">Kebijakan Privasi</span>
          </button>

          <button
            onClick={() => onNavigate('/terms')}
            className={`w-full flex items-center justify-center gap-1.5 rounded-lg py-2 px-1 text-[11px] font-medium tracking-tight transition-all ${
              isTerms
                ? 'bg-emerald-500 text-slate-950 shadow-sm font-semibold'
                : 'text-slate-300 hover:text-white hover:bg-white/5'
            }`}
          >
            <FileText className="h-3.5 w-3.5 shrink-0" />
            <span className="whitespace-nowrap">Ketentuan Layanan</span>
          </button>
        </nav>
      </div>
    </header>
  )
}
