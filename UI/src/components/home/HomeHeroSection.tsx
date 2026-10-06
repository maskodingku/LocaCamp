import locacampLogo from '../../assets/locacamp-logo.jpg'
import { Camera, ShieldCheck, FileText, ArrowRight, CheckCircle2, UserCheck } from 'lucide-react'

interface HomeHeroSectionProps {
  onNavigate: (path: string) => void
}

export const HomeHeroSection: React.FC<HomeHeroSectionProps> = ({ onNavigate }) => {
  return (
    <section className="relative overflow-hidden pt-6 pb-12 sm:pt-10 sm:pb-16 border-b border-white/10 bg-gradient-to-b from-slate-900 via-slate-950 to-slate-950">
      {/* Decorative Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-72 bg-gradient-to-tr from-emerald-500/15 via-teal-500/10 to-transparent blur-3xl pointer-events-none" />

      <div className="relative mx-auto max-w-5xl px-4 sm:px-6">
        {/* Top Navbar */}
        <div className="flex items-center justify-between pb-8 sm:pb-12 border-b border-white/5">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-900 overflow-hidden border border-emerald-500/40 shadow-lg shadow-emerald-900/30">
              <img src={locacampLogo} alt="LocaCamp Logo" className="h-full w-full object-cover" />
            </div>
            <div>
              <span className="text-lg font-bold tracking-tight text-white">LocaCamp</span>
              <span className="ml-2 rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px] font-semibold text-emerald-400">
                Official Homepage
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onNavigate('/privacy')}
              className="hidden sm:inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white hover:bg-white/5 transition-all"
            >
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
              <span>Privasi</span>
            </button>

            <button
              onClick={() => onNavigate('/terms')}
              className="hidden sm:inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white hover:bg-white/5 transition-all"
            >
              <FileText className="h-3.5 w-3.5 text-emerald-400" />
              <span>Ketentuan</span>
            </button>

            <button
              onClick={() => onNavigate('/')}
              className="flex items-center gap-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 px-3.5 py-1.5 text-xs font-bold transition-all shadow-md shadow-emerald-500/20 active:scale-95"
            >
              <Camera className="h-4 w-4" />
              <span>Buka Kamera</span>
            </button>
          </div>
        </div>

        {/* Hero Content */}
        <div className="mt-8 sm:mt-12 text-center max-w-3xl mx-auto">
          {/* Developer Verification Badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-950/40 px-3.5 py-1 text-xs text-emerald-300 mb-6 shadow-sm">
            <UserCheck className="h-4 w-4 text-emerald-400" />
            <span>Aplikasi Resmi Milik Pengembang: <strong>Abdi Syahputra Harahap</strong></span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
            Kamera Cerdas Web PWA <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">
              Geotagging & Survei Lapangan Presisi
            </span>
          </h1>

          <p className="mt-5 text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl mx-auto">
            LocaCamp adalah aplikasi berbasis peramban (Progressive Web Application) untuk dokumentasi survei lapangan, inspeksi teknis, dan pemetaan dengan stempel koordinat satelit GPS otomatis, watermark resmi, dan pencadangan awan Google Drive.
          </p>

          {/* Action Buttons */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => onNavigate('/')}
              className="w-full sm:w-auto flex items-center justify-center gap-2.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 px-6 py-3.5 text-sm font-bold text-slate-950 shadow-xl shadow-emerald-500/25 hover:from-emerald-400 hover:to-teal-400 transition-all active:scale-95"
            >
              <Camera className="h-5 w-5" />
              <span>Mulai Ambil Foto (Buka Kamera PWA)</span>
              <ArrowRight className="h-4 w-4" />
            </button>

            <button
              onClick={() => onNavigate('/privacy')}
              className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-5 py-3.5 text-sm font-semibold text-slate-200 hover:bg-white/10 hover:text-white transition-all active:scale-95"
            >
              <ShieldCheck className="h-4 w-4 text-emerald-400" />
              <span>Kebijakan Privasi</span>
            </button>
          </div>

          {/* Feature Highlights Pills */}
          <div className="mt-10 pt-6 border-t border-white/5 flex flex-wrap items-center justify-center gap-4 text-xs text-slate-400">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
              100% Client-Side On-Device
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
              Tanpa Pelacak & Tanpa Iklan
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
              Google Drive Cloud Sync
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
              Open Source di GitHub
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}
