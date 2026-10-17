import React from 'react'
import {
  ShieldCheck,
  CheckCircle2,
  Terminal,
  Building2,
  Heart,
  ExternalLink,
} from 'lucide-react'
import appLogo from '../../assets/locacamp-logo.jpg'
import developerPhoto from '../../assets/foto-profil-abdi-syahputra-harahap.jpg'
import { CyberGlassOrb } from './CyberGlassOrb'

// Ikon Resmi GitHub
const GithubIcon: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    aria-hidden="true"
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
    />
  </svg>
)

export const AboutTab: React.FC = () => {
  return (
    <div className="space-y-4 animate-in fade-in duration-200">
      {/* 1. App Overview Header Card (Dark Cyber Glass HUD) */}
      <div className="relative rounded-[22px] border border-white/20 bg-[#03152e]/55 backdrop-blur-xl shadow-[0_12px_32px_rgba(0,0,0,0.6),inset_0_1.5px_2px_rgba(255,255,255,0.85)] text-white p-4 sm:p-5 overflow-hidden">
        <div className="pointer-events-none absolute top-0 left-8 right-8 h-[1.5px] bg-gradient-to-r from-transparent via-white/95 to-transparent z-20" />
        <div className="flex items-start gap-4">
          <img
            src={appLogo}
            alt="LocaCamp"
            className="w-14 h-14 rounded-2xl object-cover border border-white/40 shadow-[0_4px_12px_rgba(0,0,0,0.5)] shrink-0"
          />
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-base font-black text-white tracking-wide">
                LocaCamp <span className="text-cyan-300 drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)]">Enterprise</span>
              </h3>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#020e1f] text-cyan-300 border border-white/30 shadow-[0_2px_6px_rgba(0,0,0,0.5)]">
                v1.0.0 PWA
              </span>
            </div>
            <p className="text-xs text-slate-100 mt-1 leading-relaxed font-medium">
              Sistem kamera web cerdas dengan penandaan lokasi GPS real-time, sinkronisasi zona waktu otomatis, dan watermark instansi terverifikasi untuk dokumentasi teknis lapangan.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 mt-4 pt-4 border-t border-white/15 text-xs">
          <div className="flex items-center gap-2 text-slate-200 font-bold">
            <ShieldCheck className="w-4 h-4 text-cyan-300 shrink-0" />
            <span>100% Client-Side Privacy</span>
          </div>
          <div className="flex items-center gap-2 text-slate-200 font-bold">
            <CheckCircle2 className="w-4 h-4 text-cyan-300 shrink-0" />
            <span>PWA Offline Capable</span>
          </div>
        </div>
      </div>

      {/* 2. Developer Profile Card */}
      <div className="relative rounded-[22px] border border-white/20 bg-[#03152e]/55 backdrop-blur-xl shadow-[0_12px_32px_rgba(0,0,0,0.6),inset_0_1.5px_2px_rgba(255,255,255,0.85)] text-white p-4 sm:p-5 overflow-hidden space-y-3.5">
        <div className="pointer-events-none absolute top-0 left-8 right-8 h-[1.5px] bg-gradient-to-r from-transparent via-white/95 to-transparent z-20" />
        <label className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-2">
          <CyberGlassOrb icon={Terminal} size="xs" variant="cyan" />
          <span>Profil Pengembang Sistem</span>
        </label>
        
        <div className="flex items-center gap-3.5 pt-1">
          <img
            src={developerPhoto}
            alt="Abdi Syahputra Harahap"
            className="w-14 h-14 sm:w-16 sm:h-16 rounded-full object-cover border-2 border-white/80 shadow-[0_4px_14px_rgba(0,0,0,0.6)] shrink-0"
          />
          <div className="overflow-hidden">
            <h4 className="text-sm sm:text-base font-black text-white tracking-wide drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)]">
              Abdi Syahputra Harahap
            </h4>
            <p className="text-xs font-bold text-cyan-300 flex items-center gap-1.5 mt-0.5">
              <Terminal className="w-3.5 h-3.5 shrink-0 text-cyan-300" />
              <span>Node.js Fullstack Developer &amp; Rust Developer</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 pt-1 flex-wrap">
          <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-[#020e1f] text-cyan-200 border border-white/30 shadow-[0_2px_6px_rgba(0,0,0,0.4)] backdrop-blur-md">
            ⚡ Node.js &amp; TypeScript
          </span>
          <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-[#020e1f] text-cyan-200 border border-white/30 shadow-[0_2px_6px_rgba(0,0,0,0.4)] backdrop-blur-md">
            🦀 Rust Systems Engineering
          </span>
          <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-[#020e1f] text-cyan-200 border border-white/30 shadow-[0_2px_6px_rgba(0,0,0,0.4)] backdrop-blur-md">
            ⚛️ React &amp; Canvas Engine
          </span>
        </div>

        {/* Company Affiliation */}
        <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-[#020b18]/70 backdrop-blur-md border border-white/20 shadow-[0_4px_12px_rgba(0,0,0,0.4)] text-xs text-slate-200 font-medium">
          <Building2 className="w-4 h-4 text-cyan-300 shrink-0" />
          <div>
            <span className="text-slate-300">Institusi / Perusahaan:</span>{' '}
            <span className="font-black text-white">PT Wahana Mitra Amerta</span>
          </div>
        </div>
      </div>

      {/* 3. Dedication & Corporate Appreciation Card */}
      <div className="relative rounded-[22px] border border-white/20 bg-[#03152e]/55 backdrop-blur-xl shadow-[0_12px_32px_rgba(0,0,0,0.6),inset_0_1.5px_2px_rgba(255,255,255,0.85)] text-white p-4 sm:p-5 overflow-hidden space-y-3">
        <div className="pointer-events-none absolute top-0 left-8 right-8 h-[1.5px] bg-gradient-to-r from-transparent via-white/95 to-transparent z-20" />
        <div className="flex items-center gap-2 text-xs font-bold text-cyan-300">
          <Heart className="w-4 h-4 fill-rose-500 text-rose-500 drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]" />
          <span className="uppercase tracking-wider">Pernyataan Resmi Dedikasi</span>
        </div>

        <blockquote className="text-xs text-slate-100 leading-relaxed italic border-l-2 border-white/60 pl-3 py-0.5 space-y-2 font-medium">
          <p>
            &ldquo;Aplikasi ini saya kembangkan dan dedikasikan secara khusus sebagai bentuk rasa terima kasih yang mendalam serta loyalitas penuh kepada jajaran Manajemen dan Keluarga Besar <strong className="text-white font-bold not-italic">PT Wahana Mitra Amerta</strong> atas amanah dan kepercayaan yang telah diberikan dalam mengangkat saya sebagai bagian dari perusahaan.&rdquo;
          </p>
          <p>
            &ldquo;Semoga inovasi sistem dokumentasi geotagging ini memberikan kontribusi nyata dalam memperkuat akurasi, efisiensi operasional pengawasan, dan keunggulan teknologi digital PT Wahana Mitra Amerta ke depan.&rdquo;
          </p>
        </blockquote>

        <div className="pt-2 flex items-center justify-between text-[11px] text-slate-300 border-t border-white/15 font-medium">
          <span>Hormat Saya,</span>
          <span className="font-black text-white">Abdi Syahputra Harahap</span>
        </div>
      </div>

      {/* 4. Official GitHub Repository Card */}
      <div className="relative rounded-[22px] border border-white/20 bg-[#03152e]/55 backdrop-blur-xl shadow-[0_12px_32px_rgba(0,0,0,0.6),inset_0_1.5px_2px_rgba(255,255,255,0.85)] text-white p-4 sm:p-5 overflow-hidden space-y-3">
        <div className="pointer-events-none absolute top-0 left-8 right-8 h-[1.5px] bg-gradient-to-r from-transparent via-white/95 to-transparent z-20" />
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#020e1f] border border-white/30 flex items-center justify-center text-white shrink-0 shadow-[0_2px_6px_rgba(0,0,0,0.5)]">
            <GithubIcon className="w-5 h-5 text-cyan-300" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs sm:text-sm font-bold text-white tracking-wide">
                maskodingku/LocaCamp
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#020e1f] text-cyan-300 border border-white/30 shadow-[0_2px_6px_rgba(0,0,0,0.5)]">
                Public
              </span>
            </div>
            <p className="text-[11px] text-slate-200 mt-0.5 font-medium">
              Open Source Geotagging Camera PWA
            </p>
          </div>
        </div>

        <p className="text-xs text-slate-100 leading-relaxed font-medium">
          Kode sumber, arsitektur sistem, dokumentasi panduan, dan pembaruan aplikasi dapat diakses secara publik melalui repositori GitHub resmi.
        </p>

        <a
          href="https://github.com/maskodingku/LocaCamp"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 w-full py-3 px-5 rounded-full bg-gradient-to-r from-[#020e1f]/95 via-[#051c36]/90 to-[#020e1f]/95 text-white text-xs font-bold border border-white/35 shadow-[0_4px_12px_rgba(0,0,0,0.5),inset_0_1.5px_2px_rgba(255,255,255,0.85)] hover:border-white/60 active:scale-[0.98] transition-all relative overflow-hidden group"
        >
          <div className="absolute top-0 inset-x-5 h-[1.5px] bg-gradient-to-r from-transparent via-white/95 to-transparent pointer-events-none" />
          <GithubIcon className="w-4 h-4 text-cyan-300 group-hover:text-white" />
          <span>Kunjungi Repositori GitHub</span>
          <ExternalLink className="w-3.5 h-3.5 text-cyan-300 group-hover:text-white ml-0.5" />
        </a>
      </div>
    </div>
  )
}

