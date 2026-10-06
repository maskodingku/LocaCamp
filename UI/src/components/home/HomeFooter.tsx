import React from 'react'
import locacampLogo from '../../assets/locacamp-logo.jpg'
import { ShieldCheck, FileText, Camera, Code2, ExternalLink } from 'lucide-react'

interface HomeFooterProps {
  onNavigate: (path: string) => void
}

export const HomeFooter: React.FC<HomeFooterProps> = ({ onNavigate }) => {
  return (
    <footer className="border-t border-white/10 bg-slate-950 py-8 sm:py-10 text-xs text-slate-400">
      <div className="mx-auto max-w-5xl px-3 sm:px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-5 sm:gap-6 pb-6 border-b border-white/10">
          {/* Logo & Deskripsi Singkat */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left gap-1">
            <div className="flex items-center gap-2">
              <div className="h-6 w-6 rounded-lg overflow-hidden border border-emerald-500/30 shrink-0">
                <img src={locacampLogo} alt="LocaCamp" className="h-full w-full object-cover" />
              </div>
              <span className="font-bold text-base text-white">LocaCamp</span>
              <span className="rounded bg-emerald-500/20 px-1.5 py-0.5 text-[10px] font-semibold text-emerald-400">
                PWA
              </span>
            </div>
            <p className="text-[11px] text-slate-400 max-w-sm">
              Kamera cerdas geotagging lapangan dan pencadangan Google Drive mandiri.
            </p>
          </div>

          {/* Navigasi Wajib (Sesuai Syarat Google Cloud Homepage) */}
          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-xs">
            <button
              onClick={() => onNavigate('/privacy')}
              className="flex items-center gap-1.5 text-slate-300 hover:text-emerald-400 transition-colors font-medium py-0.5"
            >
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
              <span>Kebijakan Privasi</span>
            </button>

            <span className="text-slate-700 hidden sm:inline">•</span>

            <button
              onClick={() => onNavigate('/terms')}
              className="flex items-center gap-1.5 text-slate-300 hover:text-emerald-400 transition-colors font-medium py-0.5"
            >
              <FileText className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
              <span>Ketentuan Layanan</span>
            </button>

            <span className="text-slate-700 hidden sm:inline">•</span>

            <button
              onClick={() => onNavigate('/')}
              className="flex items-center gap-1.5 text-slate-300 hover:text-emerald-400 transition-colors font-medium py-0.5"
            >
              <Camera className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
              <span>Aplikasi Kamera</span>
            </button>

            <span className="text-slate-700 hidden sm:inline">•</span>

            <a
              href="https://github.com/maskodingku/LocaCamp"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-slate-400 hover:text-white transition-colors py-0.5"
            >
              <Code2 className="h-3.5 w-3.5 shrink-0" />
              <span>GitHub</span>
              <ExternalLink className="h-3 w-3 shrink-0" />
            </a>
          </div>
        </div>

        {/* Copyright & Pernyataan Kepemilikan */}
        <div className="pt-5 sm:pt-6 flex flex-col sm:flex-row items-center justify-between gap-2.5 sm:gap-3 text-center sm:text-left text-[11px] text-slate-500">
          <p>
            © {new Date().getFullYear()} LocaCamp. Hak Cipta & Kepemilikan Resmi oleh <strong>Abdi Syahputra Harahap & Anggista Parasela</strong>.
          </p>
          <p>
            Domain Resmi: <span className="text-slate-400 font-mono">https://locacamp.pages.dev</span>
          </p>
        </div>
      </div>
    </footer>
  )
}
