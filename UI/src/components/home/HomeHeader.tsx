import React from 'react'
import locacampLogo from '../../assets/locacamp-logo.jpg'
import { Camera, ShieldCheck, FileText } from 'lucide-react'

interface HomeHeaderProps {
  onNavigate: (path: string) => void
}

export const HomeHeader: React.FC<HomeHeaderProps> = ({ onNavigate }) => {
  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-slate-950/90 backdrop-blur-md">
      <div className="mx-auto max-w-5xl px-3 sm:px-6 py-2.5 sm:py-3.5 flex items-center justify-between gap-2">
        {/* Brand Identity & Official Badge */}
        <div
          onClick={() => onNavigate('/home')}
          className="flex items-center gap-2 sm:gap-2.5 min-w-0 cursor-pointer select-none"
        >
          <div className="flex h-8 w-8 sm:h-9 sm:w-9 shrink-0 items-center justify-center rounded-xl bg-slate-900 overflow-hidden border border-emerald-500/40 shadow-sm shadow-emerald-950/50">
            <img src={locacampLogo} alt="LocaCamp Logo" className="h-full w-full object-cover" />
          </div>
          <div className="flex items-center gap-1.5 min-w-0">
            <span className="text-base sm:text-lg font-bold tracking-tight text-white shrink-0">
              LocaCamp
            </span>
            <span className="shrink-0 whitespace-nowrap rounded-full bg-emerald-500/15 border border-emerald-500/30 px-2 py-0.5 text-[9px] sm:text-[10px] font-semibold text-emerald-400">
              Official
            </span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          <button
            onClick={() => onNavigate('/privacy')}
            className="hidden sm:inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium text-slate-300 hover:text-white hover:bg-white/5 transition-all shrink-0"
            title="Kebijakan Privasi"
          >
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
            <span>Privasi</span>
          </button>

          <button
            onClick={() => onNavigate('/terms')}
            className="hidden sm:inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium text-slate-300 hover:text-white hover:bg-white/5 transition-all shrink-0"
            title="Ketentuan Layanan"
          >
            <FileText className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
            <span>Ketentuan</span>
          </button>

          <button
            onClick={() => onNavigate('/')}
            className="flex items-center justify-center gap-1.5 shrink-0 whitespace-nowrap rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 px-3 py-1.5 sm:px-3.5 sm:py-2 text-xs font-bold transition-all shadow-md shadow-emerald-500/20 active:scale-95"
            title="Buka Aplikasi Kamera"
          >
            <Camera className="h-3.5 w-3.5 sm:h-4 sm:w-4 shrink-0 text-slate-950" />
            <span className="whitespace-nowrap">Buka Kamera</span>
          </button>
        </div>
      </div>
    </header>
  )
}
