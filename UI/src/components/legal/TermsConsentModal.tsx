import React, { useState } from 'react'
import { ShieldCheck, FileText, ExternalLink, Check, X, Camera, MapPin, HardDrive, AlertOctagon, RotateCcw, Lock, Code2 } from 'lucide-react'

interface TermsConsentModalProps {
  isOpen: boolean
  onAccept: () => void
}

export const TermsConsentModal: React.FC<TermsConsentModalProps> = ({ isOpen, onAccept }) => {
  const [isDeclined, setIsDeclined] = useState(false)

  if (!isOpen) return null

  const handleDecline = () => {
    setIsDeclined(true)
    try {
      window.close()
    } catch {
      // Browser memblokir window.close jika tab tidak dibuka oleh script
    }
  }

  // Tampilan jika pengguna menolak syarat & ketentuan (Akses Ditolak / Layar Keluar)
  if (isDeclined) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-4 backdrop-blur-xl animate-fadeIn">
        <div className="w-full max-w-md rounded-3xl border border-rose-500/30 bg-slate-950/95 p-6 sm:p-8 text-center shadow-2xl shadow-rose-950/40">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-400">
            <AlertOctagon className="h-7 w-7" />
          </div>

          <h2 className="text-xl font-bold text-white mb-2">Akses Dibatalkan</h2>
          <p className="text-xs sm:text-sm text-slate-300 mb-6 leading-relaxed">
            Anda memilih untuk tidak menyetujui ketentuan penggunaan LocaCamp. Fitur kamera dan geotagging lokal di perangkat Anda tidak akan dijalankan.
          </p>

          <p className="text-[11px] text-slate-500 mb-6">
            Silakan tutup tab atau jendela peramban Anda untuk keluar. Jika Anda ingin mencoba kembali, Anda dapat memuat ulang halaman.
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
              <span>Tutup Peramban</span>
            </button>

            <button
              onClick={() => {
                setIsDeclined(false)
                window.location.reload()
              }}
              className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-emerald-500 py-2.5 px-4 text-xs font-semibold text-slate-950 hover:bg-emerald-400 transition-all active:scale-95 shadow-md shadow-emerald-500/20"
            >
              <RotateCcw className="h-4 w-4" />
              <span>Muat Ulang Halaman</span>
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Tampilan Dialog Persetujuan Utama dengan Jaminan Keamanan & Open Source
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-3.5 sm:p-6 backdrop-blur-md animate-fadeIn overflow-y-auto">
      <div className="relative my-auto w-full max-w-lg rounded-3xl border border-white/15 bg-slate-950/95 p-5 sm:p-7 shadow-2xl shadow-emerald-950/30">
        {/* Header Icon & Title */}
        <div className="flex items-start gap-3 sm:gap-4 mb-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white shadow-lg shadow-emerald-900/30">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400">
                Pemberitahuan Transparansi
              </span>
              <span className="rounded bg-emerald-500/20 px-1.5 py-0.5 text-[10px] font-semibold text-emerald-300">
                100% On-Device
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

        {/* Jaminan Privasi & Kepercayaan Pengguna */}
        <div className="mb-4 rounded-2xl border border-emerald-500/30 bg-emerald-950/30 p-3.5 text-xs text-slate-200">
          <div className="flex items-center gap-2 font-semibold text-emerald-300 mb-1">
            <Lock className="h-4 w-4 text-emerald-400 shrink-0" />
            <span>Data Anda 100% Berada di Perangkat Anda Sendiri</span>
          </div>
          <p className="text-[11px] leading-relaxed text-slate-300">
            LocaCamp bekerja secara mandiri di sisi peramban (<em>client-side browser</em>). Kami <strong className="text-white">TIDAK memiliki server database</strong> untuk memata-matai, mengumpulkan, atau menyimpan foto maupun koordinat lokasi Anda. Seluruh kode aplikasi bersifat terbuka (<strong className="text-emerald-300">Open Source</strong>) dan dapat diaudit oleh siapa saja di GitHub.
          </p>
        </div>

        {/* Izin Perangkat Lokal yang Digunakan oleh Browser Anda */}
        <div className="mb-4 space-y-2.5 rounded-2xl border border-white/10 bg-slate-900/60 p-3.5 text-xs">
          <p className="text-[11px] font-semibold text-slate-200 uppercase tracking-wide">
            Penggunaan Izin di Perangkat Anda:
          </p>

          <div className="space-y-2 text-slate-300 pt-0.5">
            <div className="flex items-start gap-2.5">
              <Camera className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>
                <strong className="text-white">Kamera:</strong> Berjalan langsung di kartu grafis perangkat Anda untuk live preview dan menjepret foto survei. Tidak ada rekaman yang disalurkan keluar.
              </span>
            </div>

            <div className="flex items-start gap-2.5">
              <MapPin className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>
                <strong className="text-white">Sensor GPS & Kompas:</strong> Dibaca oleh browser untuk mencetak stempel koordinat dan minimap satelit langsung di foto Anda. Tidak ada pelacakan di latar belakang.
              </span>
            </div>

            <div className="flex items-start gap-2.5">
              <HardDrive className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>
                <strong className="text-white">Google Drive (Opsional):</strong> Unggahan langsung dari peramban Anda ke folder pribadi <em>LocaCamp Photos</em> di akun Google Anda tanpa melalui server pihak ketiga mana pun.
              </span>
            </div>
          </div>
        </div>

        {/* Dynamic New-Tab Links ke Privacy Policy & Terms of Service */}
        <div className="mb-5 rounded-2xl border border-white/10 bg-slate-900/40 p-3 text-xs">
          <p className="text-slate-300 mb-2 font-medium text-[11px]">
            Dokumen keterbukaan & audit kode sumber resmi:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <a
              href="/privacy"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between rounded-xl border border-white/10 bg-slate-900/90 px-3 py-2 text-emerald-400 hover:text-emerald-300 hover:bg-slate-800 transition-colors group"
            >
              <span className="flex items-center gap-1.5 font-medium text-[11px]">
                <ShieldCheck className="h-3.5 w-3.5 shrink-0" />
                <span>Kebijakan Privasi</span>
              </span>
              <ExternalLink className="h-3.5 w-3.5 text-slate-500 group-hover:text-emerald-300 transition-colors shrink-0" />
            </a>

            <a
              href="/terms"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between rounded-xl border border-white/10 bg-slate-900/90 px-3 py-2 text-emerald-400 hover:text-emerald-300 hover:bg-slate-800 transition-colors group"
            >
              <span className="flex items-center gap-1.5 font-medium text-[11px]">
                <FileText className="h-3.5 w-3.5 shrink-0" />
                <span>Ketentuan Layanan</span>
              </span>
              <ExternalLink className="h-3.5 w-3.5 text-slate-500 group-hover:text-emerald-300 transition-colors shrink-0" />
            </a>
          </div>

          <div className="mt-2.5 pt-2 border-t border-white/5 flex items-center justify-between text-[11px] text-slate-400">
            <a
              href="https://github.com/maskodingku/LocaCamp"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-slate-400 hover:text-white transition-colors"
            >
              <Code2 className="h-3.5 w-3.5 text-slate-300" />
              <span>Audit Kode Sumber di GitHub (Open Source)</span>
              <ExternalLink className="h-3 w-3" />
            </a>
          </div>
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
