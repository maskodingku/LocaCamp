import React, { useState } from 'react'
import { ShieldCheck, FileText, ExternalLink, Check, X, Camera, MapPin, HardDrive, AlertOctagon, RotateCcw } from 'lucide-react'

interface TermsConsentModalProps {
  isOpen: boolean
  onAccept: () => void
}

export const TermsConsentModal: React.FC<TermsConsentModalProps> = ({ isOpen, onAccept }) => {
  const [isDeclined, setIsDeclined] = useState(false)

  if (!isOpen) return null

  const handleDecline = () => {
    setIsDeclined(true)
    // Coba tutup tab jika browser mengizinkan
    try {
      window.close()
    } catch {
      // Browser memblokir window.close jika tab tidak dibuka oleh script
    }
  }

  // Tampilan jika pengguna menolak syarat & ketentuan (Akses Diblokir / Keluar)
  if (isDeclined) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-4 backdrop-blur-xl animate-fadeIn">
        <div className="w-full max-w-md rounded-3xl border border-rose-500/30 bg-slate-950/90 p-6 sm:p-8 text-center shadow-2xl shadow-rose-950/40">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-400">
            <AlertOctagon className="h-7 w-7" />
          </div>

          <h2 className="text-xl font-bold text-white mb-2">Akses Ditolak</h2>
          <p className="text-xs sm:text-sm text-slate-300 mb-6 leading-relaxed">
            Anda telah menolak Syarat & Ketentuan serta Kebijakan Privasi LocaCamp. Aplikasi kamera dan fitur geotagging tidak dapat dijalankan tanpa persetujuan Anda.
          </p>

          <p className="text-[11px] text-slate-500 mb-6">
            Silakan tutup tab atau jendela peramban Anda untuk keluar. Jika berubah pikiran, Anda dapat memuat ulang halaman.
          </p>

          <div className="flex flex-col sm:flex-row gap-2.5">
            <button
              onClick={() => {
                try {
                  window.close()
                } catch {
                  window.location.replace('about:blank')
                }
              }}
              className="flex-1 flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 py-2.5 px-4 text-xs font-semibold text-slate-300 hover:bg-white/10 hover:text-white transition-all active:scale-95"
            >
              <X className="h-4 w-4" />
              <span>Keluar Sekarang</span>
            </button>

            <button
              onClick={() => {
                setIsDeclined(false)
                window.location.reload()
              }}
              className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-emerald-500 py-2.5 px-4 text-xs font-semibold text-slate-950 hover:bg-emerald-400 transition-all active:scale-95 shadow-md shadow-emerald-500/20"
            >
              <RotateCcw className="h-4 w-4" />
              <span>Muat Ulang & Tinjau</span>
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Tampilan Dialog Persetujuan Utama
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 sm:p-6 backdrop-blur-md animate-fadeIn overflow-y-auto">
      <div className="relative my-auto w-full max-w-lg rounded-3xl border border-white/15 bg-slate-950/95 p-5 sm:p-7 shadow-2xl shadow-emerald-950/20">
        {/* Header Icon & Title */}
        <div className="flex items-start gap-3 sm:gap-4 mb-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white shadow-lg shadow-emerald-900/30">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400">
                Persetujuan Pengguna
              </span>
              <span className="rounded bg-emerald-500/20 px-1.5 py-0.5 text-[10px] font-medium text-emerald-300">
                Wajib
              </span>
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight mt-0.5">
              Selamat Datang di LocaCamp
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Kamera Cerdas Web PWA Geotagging & Survei Lapangan
            </p>
          </div>
        </div>

        {/* Ringkasan Izin & Fitur Utama */}
        <div className="mb-5 space-y-2 rounded-2xl border border-white/10 bg-slate-900/60 p-3.5 text-xs">
          <p className="text-[11px] font-medium text-slate-300">
            Sebelum mulai mengambil foto dokumentasi survei, harap setujui ketentuan kami:
          </p>

          <div className="space-y-2 text-slate-400 pt-1">
            <div className="flex items-start gap-2.5">
              <Camera className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>
                <strong className="text-slate-200">Kamera:</strong> Digunakan secara lokal untuk live preview dan membidik foto survei.
              </span>
            </div>

            <div className="flex items-start gap-2.5">
              <MapPin className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>
                <strong className="text-slate-200">Sensor GPS & Lokasi:</strong> Digunakan untuk mencetak stempel koordinat dan minimap satelit.
              </span>
            </div>

            <div className="flex items-start gap-2.5">
              <HardDrive className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>
                <strong className="text-slate-200">Google Drive:</strong> Pencadangan awan opsional yang terisolasi khusus di folder <em>LocaCamp Photos</em>.
              </span>
            </div>
          </div>
        </div>

        {/* Dynamic New-Tab Links ke Privacy Policy & Terms of Service */}
        <div className="mb-6 rounded-2xl border border-emerald-500/20 bg-emerald-950/20 p-3 text-xs">
          <p className="text-slate-300 mb-2 font-medium text-[11px]">
            Pelajari rincian lengkap kebijakan dan ketentuan kami:
          </p>
          <div className="flex flex-col sm:flex-row gap-2">
            <a
              href="/privacy"
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 flex items-center justify-between rounded-xl border border-white/10 bg-slate-900/80 px-3 py-2 text-emerald-400 hover:text-emerald-300 hover:bg-slate-900 transition-colors group"
            >
              <span className="flex items-center gap-1.5 font-medium">
                <ShieldCheck className="h-3.5 w-3.5" />
                <span>Kebijakan Privasi</span>
              </span>
              <ExternalLink className="h-3.5 w-3.5 text-slate-400 group-hover:text-emerald-300 transition-colors" />
            </a>

            <a
              href="/terms"
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 flex items-center justify-between rounded-xl border border-white/10 bg-slate-900/80 px-3 py-2 text-emerald-400 hover:text-emerald-300 hover:bg-slate-900 transition-colors group"
            >
              <span className="flex items-center gap-1.5 font-medium">
                <FileText className="h-3.5 w-3.5" />
                <span>Ketentuan Layanan</span>
              </span>
              <ExternalLink className="h-3.5 w-3.5 text-slate-400 group-hover:text-emerald-300 transition-colors" />
            </a>
          </div>
          <p className="text-[10px] text-slate-400 mt-2 italic">
            * Tautan di atas akan terbuka di tab baru peramban tanpa menutup halaman ini.
          </p>
        </div>

        {/* Action Buttons: Tolak vs Setujui */}
        <div className="flex flex-col sm:flex-row gap-2.5">
          <button
            onClick={handleDecline}
            className="flex-1 flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 py-3 px-4 text-xs font-semibold text-slate-300 hover:bg-rose-500/10 hover:border-rose-500/30 hover:text-rose-400 transition-all active:scale-95"
          >
            <X className="h-4 w-4" />
            <span>Tolak & Keluar</span>
          </button>

          <button
            onClick={onAccept}
            className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 py-3 px-4 text-xs font-semibold text-slate-950 hover:from-emerald-400 hover:to-teal-400 transition-all active:scale-95 shadow-lg shadow-emerald-500/25"
          >
            <Check className="h-4 w-4 stroke-[2.5]" />
            <span>Saya Menyetujui & Lanjutkan</span>
          </button>
        </div>
      </div>
    </div>
  )
}
