import React from 'react'
import { HardDrive, ShieldCheck, Lock, CheckCircle2, AlertCircle } from 'lucide-react'

export const HomeDataUsageSection: React.FC = () => {
  return (
    <section className="py-10 sm:py-16 border-b border-white/10 bg-slate-900/40">
      <div className="mx-auto max-w-5xl px-3 sm:px-6">
        <div className="rounded-2xl sm:rounded-3xl border border-teal-500/30 bg-gradient-to-br from-teal-950/20 via-slate-900 to-slate-950 p-4 sm:p-7 md:p-10 shadow-2xl">
          <div className="flex items-center gap-2 text-teal-400 font-semibold text-[10px] sm:text-xs uppercase tracking-wider mb-2 sm:mb-3">
            <HardDrive className="h-3.5 w-3.5 sm:h-4 sm:w-4 shrink-0" />
            <span className="truncate">Transparansi Data (Google API User Data Policy)</span>
          </div>

          <h3 className="text-lg sm:text-2xl font-bold text-white tracking-tight">
            Tujuan & Batasan Penggunaan Data Akun Google
          </h3>

          <p className="mt-2 text-xs sm:text-sm text-slate-300 leading-relaxed">
            Sesuai kebijakan Google OAuth 2.0 dan komitmen privasi kami, berikut adalah penjelasan transparan mengenai alasan dan cara LocaCamp berinteraksi dengan akun Google Anda:
          </p>

          <div className="mt-5 sm:mt-6 grid gap-3 sm:gap-4 sm:grid-cols-2 text-xs">
            {/* Kartu Scope */}
            <div className="rounded-xl sm:rounded-2xl border border-white/10 bg-slate-950/80 p-3.5 sm:p-4 space-y-1.5 sm:space-y-2">
              <div className="flex items-center gap-2 text-teal-300 font-semibold">
                <ShieldCheck className="h-4 w-4 text-teal-400 shrink-0" />
                <span>Scope Akses Minimal: <code>drive.file</code></span>
              </div>
              <p className="text-slate-400 leading-relaxed text-[11px] sm:text-xs">
                Aplikasi hanya meminta izin <code className="text-teal-300 font-mono break-all">https://www.googleapis.com/auth/drive.file</code>. Izin ini hanya berlaku khusus untuk file yang dibuat atau diunggah oleh aplikasi LocaCamp.
              </p>
            </div>

            {/* Kartu Isolasi Folder */}
            <div className="rounded-xl sm:rounded-2xl border border-white/10 bg-slate-950/80 p-3.5 sm:p-4 space-y-1.5 sm:space-y-2">
              <div className="flex items-center gap-2 text-teal-300 font-semibold">
                <Lock className="h-4 w-4 text-teal-400 shrink-0" />
                <span>Isolasi Folder LocaCamp Photos</span>
              </div>
              <p className="text-slate-400 leading-relaxed text-[11px] sm:text-xs">
                Seluruh foto survei otomatis disimpan ke dalam satu folder bernama <strong className="text-white">LocaCamp Photos</strong>. Aplikasi tidak memiliki akses ke dokumen pribadi, spreadsheet, atau folder lain di Google Drive Anda.
              </p>
            </div>
          </div>

          {/* Klausul Wajib Google Limited Use */}
          <div className="mt-4 sm:mt-5 rounded-xl sm:rounded-2xl border border-amber-500/30 bg-amber-950/20 p-3.5 sm:p-4 text-xs text-amber-200">
            <div className="flex items-start gap-2.5">
              <AlertCircle className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-amber-300 text-[11px] sm:text-xs block">Pernyataan Kepatuhan Penggunaan Terbatas Google (Limited Use Requirements):</strong>
                <p className="mt-1 italic text-amber-200/90 leading-relaxed text-[11px] sm:text-xs">
                  &ldquo;Penggunaan dan transfer informasi yang diterima dari Google API oleh LocaCamp ke aplikasi lain mana pun akan mematuhi Kebijakan Data Pengguna Layanan Google API (Google API Services User Data Policy), termasuk persyaratan Penggunaan Terbatas (Limited Use requirements).&rdquo;
                </p>
              </div>
            </div>
          </div>

          {/* Komitmen Perlindungan */}
          <div className="mt-5 pt-4 border-t border-white/10 grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs text-slate-300">
            <span className="flex items-center gap-1.5 text-[11px] sm:text-xs">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
              <span>Tidak Ada Penjualan Data</span>
            </span>
            <span className="flex items-center gap-1.5 text-[11px] sm:text-xs">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
              <span>Peer-to-Cloud Langsung</span>
            </span>
            <span className="flex items-center gap-1.5 text-[11px] sm:text-xs">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
              <span>Token Dapat Dicabut Kapan Saja</span>
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}
