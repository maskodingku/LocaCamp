import React from 'react'
import { ShieldCheck, FileText, Camera } from 'lucide-react'

interface LegalFooterProps {
  currentPath: string
  onNavigate: (path: string) => void
}

export const LegalFooter: React.FC<LegalFooterProps> = ({ currentPath, onNavigate }) => {
  return (
    <footer className="mt-16 border-t border-white/10 bg-slate-950/60 py-8 text-xs text-slate-400">
      <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-4 px-4 sm:flex-row sm:px-6">
        {/* Left: Branding & Copyright */}
        <div className="flex flex-col items-center gap-1 sm:items-start">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-200">LocaCamp Web PWA</span>
            <span className="text-slate-600">•</span>
            <span>Kamera Geotagging Presisi</span>
          </div>
          <p className="text-[11px] text-slate-500">
            © {new Date().getFullYear()} LocaCamp. Dikembangkan oleh Abdi Syahputra Harahap.
          </p>
        </div>

        {/* Right: Dynamic Navigation without hardcoded domain links */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => onNavigate('/privacy')}
            className={`flex items-center gap-1 hover:text-emerald-400 transition-colors ${
              currentPath === '/privacy' || currentPath === '/privacy-policy'
                ? 'text-emerald-400 font-medium'
                : 'text-slate-400'
            }`}
          >
            <ShieldCheck className="h-3.5 w-3.5" />
            <span>Privasi</span>
          </button>

          <span className="text-slate-700">•</span>

          <button
            onClick={() => onNavigate('/terms')}
            className={`flex items-center gap-1 hover:text-emerald-400 transition-colors ${
              currentPath === '/terms' || currentPath === '/terms-of-service'
                ? 'text-emerald-400 font-medium'
                : 'text-slate-400'
            }`}
          >
            <FileText className="h-3.5 w-3.5" />
            <span>Ketentuan</span>
          </button>

          <span className="text-slate-700">•</span>

          <button
            onClick={() => onNavigate('/home')}
            className={`flex items-center gap-1 hover:text-emerald-400 transition-colors ${
              currentPath === '/home' ? 'text-emerald-400 font-medium' : 'text-slate-400'
            }`}
          >
            <span>Beranda</span>
          </button>

          <span className="text-slate-700">•</span>

          <button
            onClick={() => onNavigate('/')}
            className="flex items-center gap-1 text-slate-400 hover:text-emerald-400 transition-colors"
          >
            <Camera className="h-3.5 w-3.5" />
            <span>Kamera</span>
          </button>
        </div>
      </div>
    </footer>
  )
}
