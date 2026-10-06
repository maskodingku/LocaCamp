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
    <header className="sticky top-0 z-30 border-b border-white/10 bg-slate-950/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3 sm:px-6">
        {/* Brand & Back Button */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate('/')}
            className="flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-2.5 py-1.5 text-xs font-medium text-slate-300 transition-all hover:bg-white/10 hover:text-white active:scale-95 sm:text-sm"
            title="Kembali ke Kamera"
          >
            <ArrowLeft className="h-4 w-4 text-emerald-400" />
            <span className="hidden sm:inline">Kamera</span>
          </button>

          <div
            onClick={() => onNavigate('/')}
            className="flex cursor-pointer items-center gap-2 select-none"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-tr from-emerald-600 to-teal-500 shadow-md shadow-emerald-900/30">
              <Camera className="h-4 w-4 text-white" />
            </div>
            <div>
              <span className="text-base font-bold tracking-tight text-white">LocaCamp</span>
              <span className="ml-1.5 hidden rounded bg-emerald-500/20 px-1.5 py-0.5 text-[10px] font-semibold text-emerald-400 sm:inline">
                Legal
              </span>
            </div>
          </div>
        </div>

        {/* Dynamic Navigation Switcher (No <a> tags, dynamic relative paths) */}
        <nav className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 p-1 text-xs">
          <button
            onClick={() => onNavigate('/privacy')}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 font-medium transition-all ${
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
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 font-medium transition-all ${
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
    </header>
  )
}
