import React from 'react'
import { HardDrive, ShieldCheck, Lock, CheckCircle2, AlertCircle } from 'lucide-react'

export const HomeDataUsageSection: React.FC = () => {
  return (
    <section className="py-12 sm:py-16 border-b border-white/10 bg-slate-900/40">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <div className="rounded-3xl border border-teal-500/30 bg-gradient-to-br from-teal-950/20 via-slate-900 to-slate-950 p-6 sm:p-10 shadow-2xl">
          <div className="flex items-center gap-2.5 text-teal-400 font-semibold text-xs uppercase tracking-wider mb-3">
            <HardDrive className="h-4 w-4" />
            <span>Transparansi Penggunaan Data Pengguna (Google API Services User Data Policy)</span>
          </div>

          <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            Tujuan & Batasan Penggunaan Data Google Pengguna
          </h3>

          <p className="mt-3 text-xs sm:text-sm text-slate-300 leading-relaxed">
            Sesuai kebijakan Google OAuth 2.0 dan komitmen privasi kami, berikut adalah penjelasan transparan mengenai alasan dan cara LocaCamp berinteraksi dengan akun Google Anda:
          </p>

          <div className="mt-6 grid gap-4 sm:grid-cols-2 text-xs">
            {/* Kartu Scope */}
            <div className="rounded-2xl border border-white/10 bg-slate-950/80 p-4 space-y-2">
              <div className="flex items-center gap-2 text-teal-300 font-semibold">
                <ShieldCheck className="h-4 w-4 text-teal-400" />
                <span>Scope Akses Minimal: <code>drive.file</code></span>
              </div>
              <p className="text-slate-400 leading-relaxed">
                Aplikasi hanya meminta izin <code className="text-teal-300 font-mono break-all">https://www.googleapis.com/auth/drive.file</code>. Izin ini hanya berlaku khusus untuk file yang dibuat atau diunggah oleh aplikasi LocaCamp.
              </p>
            </div>

            {/* Kartu Isolasi Folder */}
            <div className="rounded-2xl border border-white/10 bg-slate-950/80 p-4 space-y-2">
              <div className="flex items-center gap-2 text-teal-300 font-semibold">
                <Lock className="h-4 w-4 text-teal-400" />
                <span>Isolasi Khusus Folder LocaCamp Photos</span>
              </div>
              <p className="text-slate-400 leading-relaxed">
                Seluruh foto survei otomatis disimpan ke dalam satu folder bernama <strong className="text-white">LocaCamp Photos</strong>. Aplikasi tidak memiliki akses ke dokumen pribadi, spreadsheet, atau folder lain di Google Drive Anda.
              </p>
            </div>
          </div>

          {/* Klausul Wajib Google Limited Use */}
          <div className="mt-5 rounded-2xl border border-amber-500/30 bg-amber-950/20 p-4 text-xs text-amber-200">
            <div className="flex items-start gap-2">
              <AlertCircle className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-amber-300">Pernyataan Kepatuhan Penggunaan Terbatas Google (Limited Use Requirements):</strong>
                <p className="mt-1 italic text-amber-200/90 leading-relaxed">
                  &ldquo;Penggunaan dan transfer informasi yang diterima dari Google API oleh LocaCamp ke aplikasi lain mana pun akan mematuhi Kebijakan Data Pengguna Layanan Google API (Google API Services User Data Policy), termasuk persyaratan Penggunaan Terbatas (Limited Use requirements).&rdquo;
                </p>
              </div>
            </div>
          </div>

          {/* Komitmen Perlindungan */}
          <div className="mt-6 pt-5 border-t border-white/10 flex flex-wrap items-center gap-4 text-xs text-slate-300">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
              Tidak Ada Penjualan Data
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
              Koneksi Langsung Tanpa Server Perantara
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
              Token Dapat Dicabut Kapan Saja
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}
