import developerPhoto from '../../assets/foto-profil-abdi-syahputra-harahap.jpg'
import { UserCheck, Mail, Globe, Code2, ExternalLink, ShieldCheck, HeartHandshake } from 'lucide-react'

export const HomeDeveloperSection: React.FC = () => {
  return (
    <section className="py-10 sm:py-16 border-b border-white/10 bg-slate-950">
      <div className="mx-auto max-w-5xl px-3 sm:px-6">
        <div className="rounded-2xl sm:rounded-3xl border border-emerald-500/30 bg-gradient-to-br from-slate-900 via-slate-950 to-slate-950 p-4 sm:p-7 md:p-10 shadow-2xl shadow-emerald-950/20">
          <div className="flex items-center gap-2 text-emerald-400 font-semibold text-[11px] sm:text-xs uppercase tracking-wider mb-2">
            <UserCheck className="h-4 w-4 shrink-0" />
            <span>Verifikasi Kepemilikan Pengembang & Merek (Developer & Brand Ownership)</span>
          </div>

          <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-white tracking-tight">
            Identitas Resmi Pengembang & Dukungan LocaCamp
          </h3>
          <p className="mt-1.5 text-xs sm:text-sm text-slate-400">
            Halaman ini merupakan identifikasi kepemilikan sah aplikasi dan domain situs web untuk keperluan verifikasi merek Google Cloud Platform Console & Google Search Console.
          </p>

          <div className="mt-6 sm:mt-8 flex flex-col md:flex-row items-center gap-5 sm:gap-8 rounded-2xl border border-white/10 bg-slate-900/60 p-4 sm:p-6 md:p-7">
            {/* Foto Profil Pengembang */}
            <div className="relative shrink-0">
              <div className="h-20 w-20 sm:h-28 sm:w-28 rounded-2xl overflow-hidden border-2 border-emerald-500/50 shadow-xl shadow-emerald-950/40 bg-slate-800">
                <img
                  src={developerPhoto}
                  alt="Abdi Syahputra Harahap"
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="absolute -bottom-1.5 -right-1.5 sm:-bottom-2 sm:-right-2 rounded-full bg-emerald-500 p-1 sm:p-1.5 text-slate-950 shadow-md">
                <ShieldCheck className="h-3.5 w-3.5 sm:h-4 sm:w-4 stroke-[2.5]" />
              </div>
            </div>

            {/* Informasi Pengembang & Bukti Kepemilikan */}
            <div className="flex-1 text-center md:text-left space-y-3 w-full min-w-0">
              <div>
                <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-0.5 text-[10px] sm:text-[11px] font-semibold text-emerald-300 mb-1">
                  <span>Pemilik & Pengembang Terdaftar</span>
                </div>
                <h4 className="text-lg sm:text-2xl font-bold text-white">
                  Abdi Syahputra Harahap & Anggista Parasela
                </h4>
                <p className="text-xs text-slate-400">
                  Lead Developer & Project Owner • LocaCamp PWA
                </p>
              </div>

              {/* Rincian Kontak Sesuai Google Console Branding Summary */}
              <div className="grid gap-2 sm:grid-cols-3 text-xs text-slate-300 pt-1 w-full">
                {/* Support Email */}
                <div className="flex items-center gap-2.5 rounded-xl bg-white/5 p-2.5 sm:p-3 min-w-0 text-left border border-teal-500/20">
                  <HeartHandshake className="h-4 w-4 text-teal-400 shrink-0" />
                  <div className="min-w-0 flex-1 truncate">
                    <span className="text-[10px] text-slate-400 block font-medium">Support Email (GSC):</span>
                    <a href="mailto:anggistaparasela@gmail.com" className="font-mono text-teal-300 hover:underline truncate block">
                      anggistaparasela@gmail.com
                    </a>
                  </div>
                </div>

                {/* Developer Email */}
                <div className="flex items-center gap-2.5 rounded-xl bg-white/5 p-2.5 sm:p-3 min-w-0 text-left border border-emerald-500/20">
                  <Mail className="h-4 w-4 text-emerald-400 shrink-0" />
                  <div className="min-w-0 flex-1 truncate">
                    <span className="text-[10px] text-slate-400 block font-medium">Developer Email:</span>
                    <a href="mailto:maskoding12@gmail.com" className="font-mono text-emerald-300 hover:underline truncate block">
                      maskoding12@gmail.com
                    </a>
                  </div>
                </div>

                {/* Domain */}
                <div className="flex items-center gap-2.5 rounded-xl bg-white/5 p-2.5 sm:p-3 min-w-0 text-left border border-cyan-500/20">
                  <Globe className="h-4 w-4 text-cyan-400 shrink-0" />
                  <div className="min-w-0 flex-1 truncate">
                    <span className="text-[10px] text-slate-400 block font-medium">Authorized Domain:</span>
                    <span className="font-mono text-cyan-300 truncate block">locacamp.pages.dev</span>
                  </div>
                </div>
              </div>

              {/* Pernyataan Hukum Kepemilikan Sah */}
              <div className="rounded-xl border border-white/5 bg-slate-950/70 p-3 text-[11px] text-slate-400 leading-relaxed text-left">
                <strong className="text-slate-200">Pernyataan Hukum Hak Milik:</strong> Aplikasi web <em>LocaCamp</em> dan domain <strong className="text-emerald-300">locacamp.pages.dev</strong> sepenuhnya terdaftar, dimiliki, dan dikembangkan secara sah oleh <strong>Abdi Syahputra Harahap</strong> (Pengembang Utama) bersama <strong>Anggista Parasela</strong> (Pemilik Akun Google & Dukungan Resmi terverifikasi di Google Search Console).
              </div>

              {/* Tautan Audit Repositori GitHub */}
              <div className="pt-1 flex flex-wrap items-center justify-center md:justify-start gap-3 text-xs">
                <a
                  href="https://github.com/maskodingku/LocaCamp"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-emerald-400 hover:text-emerald-300 transition-colors font-medium text-[11px] sm:text-xs"
                >
                  <Code2 className="h-4 w-4 shrink-0" />
                  <span className="truncate">Kode Sumber di GitHub (maskodingku/LocaCamp)</span>
                  <ExternalLink className="h-3.5 w-3.5 shrink-0" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
