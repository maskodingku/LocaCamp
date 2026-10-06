import developerPhoto from '../../assets/foto-profil-abdi-syahputra-harahap.jpg'
import { UserCheck, Mail, Globe, Code2, ExternalLink, ShieldCheck } from 'lucide-react'

export const HomeDeveloperSection: React.FC = () => {
  return (
    <section className="py-12 sm:py-16 border-b border-white/10 bg-slate-950">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <div className="rounded-3xl border border-emerald-500/30 bg-gradient-to-br from-slate-900 via-slate-950 to-slate-950 p-6 sm:p-10 shadow-2xl shadow-emerald-950/20">
          <div className="flex items-center gap-2 text-emerald-400 font-semibold text-xs uppercase tracking-wider mb-2">
            <UserCheck className="h-4 w-4" />
            <span>Verifikasi Kepemilikan Pengembang & Merek (Developer & Brand Ownership)</span>
          </div>

          <h3 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Identitas Resmi Pengembang LocaCamp
          </h3>
          <p className="mt-2 text-xs sm:text-sm text-slate-400">
            Halaman ini merupakan identifikasi kepemilikan sah aplikasi dan domain situs web untuk keperluan verifikasi merek Google Cloud Platform Console.
          </p>

          <div className="mt-8 flex flex-col md:flex-row items-center gap-6 md:gap-8 rounded-2xl border border-white/10 bg-slate-900/60 p-5 sm:p-7">
            {/* Foto Profil Pengembang */}
            <div className="relative shrink-0">
              <div className="h-24 w-24 sm:h-28 sm:w-28 rounded-2xl overflow-hidden border-2 border-emerald-500/50 shadow-xl shadow-emerald-950/40 bg-slate-800">
                <img
                  src={developerPhoto}
                  alt="Abdi Syahputra Harahap"
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="absolute -bottom-2 -right-2 rounded-full bg-emerald-500 p-1.5 text-slate-950 shadow-md">
                <ShieldCheck className="h-4 w-4 stroke-[2.5]" />
              </div>
            </div>

            {/* Informasi Pengembang & Bukti Kepemilikan */}
            <div className="flex-1 text-center md:text-left space-y-3">
              <div>
                <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-300 mb-1">
                  <span>Pemilik & Pengembang Terdaftar</span>
                </div>
                <h4 className="text-xl sm:text-2xl font-bold text-white">
                  Abdi Syahputra Harahap
                </h4>
                <p className="text-xs text-slate-400">
                  Software Developer & Creator of LocaCamp PWA
                </p>
              </div>

              {/* Rincian Kontak & Tautan Resmi */}
              <div className="grid gap-2 sm:grid-cols-2 text-xs text-slate-300 pt-1">
                <div className="flex items-center gap-2 rounded-xl bg-white/5 p-2.5">
                  <Mail className="h-4 w-4 text-emerald-400 shrink-0" />
                  <div className="truncate">
                    <span className="text-[10px] text-slate-500 block">Email Pengembang:</span>
                    <a href="mailto:maskoding12@gmail.com" className="font-mono text-emerald-300 hover:underline">
                      maskoding12@gmail.com
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-2 rounded-xl bg-white/5 p-2.5">
                  <Globe className="h-4 w-4 text-teal-400 shrink-0" />
                  <div className="truncate">
                    <span className="text-[10px] text-slate-500 block">Domain Resmi:</span>
                    <span className="font-mono text-teal-300">locacamp.pages.dev</span>
                  </div>
                </div>
              </div>

              {/* Pernyataan Hukum Kepemilikan Sah */}
              <div className="rounded-xl border border-white/5 bg-slate-950/70 p-3 text-[11px] text-slate-400 leading-relaxed text-left">
                <strong className="text-slate-200">Pernyataan Hukum Hak Milik:</strong> Aplikasi web <em>LocaCamp</em> dan domain <strong className="text-emerald-300">locacamp.pages.dev</strong> sepenuhnya terdaftar, dimiliki, dikembangkan, dan dipelihara secara sah oleh <strong>Abdi Syahputra Harahap</strong>.
              </div>

              {/* Tautan Audit Repositori GitHub */}
              <div className="pt-1 flex flex-wrap items-center justify-center md:justify-start gap-3 text-xs">
                <a
                  href="https://github.com/maskodingku/LocaCamp"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-emerald-400 hover:text-emerald-300 transition-colors font-medium"
                >
                  <Code2 className="h-4 w-4" />
                  <span>Lihat Kode Sumber di GitHub (maskodingku/LocaCamp)</span>
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
