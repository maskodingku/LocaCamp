import React, { useState } from 'react'
import {
  ShieldCheck,
  AlertCircle,
  Loader2,
  Sparkles,
} from 'lucide-react'
import type { useGoogleDrive } from '../../hooks/useGoogleDrive'
import { GoogleDriveIcon } from './gdrive/GoogleDriveIcon'
import { GoogleDriveConnectedCard } from './gdrive/GoogleDriveConnectedCard'
import { GoogleDriveAdvancedSettings } from './gdrive/GoogleDriveAdvancedSettings'
import { CyberGlassOrb } from './CyberGlassOrb'

interface GoogleDriveTabProps {
  drive: ReturnType<typeof useGoogleDrive>
  activeSlider?: string | null
}

export const GoogleDriveTab: React.FC<GoogleDriveTabProps> = ({
  drive,
  activeSlider,
}) => {
  const {
    isConnected,
    isConnecting,
    error,
    effectiveClientId,
    connect,
    cancelConnect,
    updateConfig,
    clearError,
  } = drive

  const [inputClientId, setInputClientId] = useState(effectiveClientId || '')

  // Aksi 1-Klik Murni: Langsung memicu jendela otorisasi Google
  const handleOneClickConnect = async () => {
    const target = inputClientId.trim() || undefined
    await connect(target)
  }

  const handleSaveCustomClientId = () => {
    if (inputClientId.trim()) {
      updateConfig({ clientId: inputClientId.trim() })
    }
  }

  return (
    <div
      className={`space-y-4 transition-opacity duration-150 ${
        activeSlider ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      {/* 1. Header Banner Keamanan & Privasi (Dark Cyber Glass HUD) */}
      <div className="relative rounded-[22px] border border-cyan-400/35 bg-[#03152e]/35 backdrop-blur-xl shadow-[0_10px_35px_rgba(0,0,0,0.5),0_0_20px_rgba(6,182,212,0.15),inset_0_1.5px_2px_rgba(255,255,255,0.5)] text-white p-4 overflow-hidden">
        <div className="pointer-events-none absolute top-0 left-8 right-8 h-[1px] bg-gradient-to-r from-transparent via-cyan-100/90 to-transparent z-20" />
        <div className="flex items-start gap-3">
          <CyberGlassOrb icon={ShieldCheck} size="md" variant="cyan" />
          <div className="text-xs text-slate-300 leading-relaxed">
            <p className="font-bold text-white mb-0.5 text-sm">Keamanan Data &amp; Privasi Terjamin</p>
            <p className="text-slate-400">
              Foto diunggah langsung ke Google Drive pribadi Anda via izin terbatas (<code className="text-cyan-300 font-mono">drive.file</code>).
              Aplikasi tidak dapat mengakses dokumen atau file pribadi lain di Google Drive Anda.
            </p>
          </div>
        </div>
      </div>

      {/* 2. Error Display */}
      {error && (
        <div className="p-3.5 rounded-2xl bg-rose-950/40 border border-rose-500/40 flex items-start justify-between gap-2 text-rose-300 text-xs shadow-lg">
          <div className="flex items-start gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-400 mt-0.5" />
            <span>{error}</span>
          </div>
          <button
            type="button"
            onClick={clearError}
            className="text-slate-400 hover:text-white text-xs font-bold cursor-pointer"
          >
            ✕
          </button>
        </div>
      )}

      {/* 3. Konten Utama: Terhubung VS Belum Terhubung */}
      {isConnected ? (
        <GoogleDriveConnectedCard drive={drive} />
      ) : (
        <div className="space-y-4">
          {/* Hero Card 1-Click Connect Ramah Pengguna Awam */}
          <div className="relative rounded-[22px] border border-cyan-400/35 bg-[#03152e]/35 backdrop-blur-xl shadow-[0_10px_35px_rgba(0,0,0,0.5),0_0_20px_rgba(6,182,212,0.15),inset_0_1.5px_2px_rgba(255,255,255,0.5)] text-white p-5 sm:p-6 text-center space-y-4 overflow-hidden">
            <div className="pointer-events-none absolute top-0 left-8 right-8 h-[1px] bg-gradient-to-r from-transparent via-cyan-100/90 to-transparent z-20" />
            
            <div className="inline-flex p-3 rounded-2xl bg-[#020b18]/50 backdrop-blur-md border border-cyan-400/50 shadow-[0_0_14px_rgba(6,182,212,0.35)]">
              <GoogleDriveIcon className="w-9 h-9" />
            </div>

            <div className="space-y-1">
              <h3 className="text-base font-extrabold text-white flex items-center justify-center gap-1.5 drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)]">
                <span>Google Drive Cloud Backup</span>
                <Sparkles className="w-4 h-4 text-cyan-300 fill-cyan-300" />
              </h3>
              <p className="text-xs text-slate-400 max-w-xs mx-auto leading-relaxed">
                Tautkan akun Google untuk mencadangkan hasil foto geotag dan watermark secara otomatis dan aman ke cloud.
              </p>
            </div>

            {/* Tombol Utama 1-Klik Murni dengan Gaya Cyber Glass Capsule */}
            <div className="space-y-2">
              <button
                type="button"
                onClick={handleOneClickConnect}
                disabled={isConnecting}
                className="w-full py-3.5 px-5 rounded-full bg-gradient-to-r from-cyan-400 via-sky-400 to-blue-500 text-[#020b18] font-black text-xs sm:text-sm flex items-center justify-center gap-3 shadow-[0_0_20px_rgba(34,211,238,0.85),inset_0_1.5px_2px_rgba(255,255,255,0.95)] hover:brightness-110 active:scale-[0.98] transition-all cursor-pointer disabled:opacity-85 relative overflow-hidden"
              >
                <div className="absolute top-0 inset-x-5 h-[1px] bg-white/90 pointer-events-none" />
                {isConnecting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin text-[#020b18]" />
                    <span>Membuka Izin Akses Google...</span>
                  </>
                ) : (
                  <>
                    <GoogleDriveIcon className="w-5 h-5 shrink-0" />
                    <span>Kaitkan Akun Google Drive</span>
                  </>
                )}
              </button>

              {isConnecting && (
                <button
                  type="button"
                  onClick={cancelConnect}
                  className="w-full py-1 text-xs text-slate-400 hover:text-white transition-colors cursor-pointer text-center underline"
                >
                  Batalkan proses
                </button>
              )}
            </div>

            <p className="text-[11px] text-slate-400">
              Cukup 1 kali klik. Jendela resmi Google akan langsung terbuka meminta izin akses penyimpanan foto.
            </p>
          </div>

          {/* Pengaturan Lanjutan */}
          <GoogleDriveAdvancedSettings
            inputClientId={inputClientId}
            setInputClientId={setInputClientId}
            onSaveClientId={handleSaveCustomClientId}
          />
        </div>
      )}
    </div>
  )
}
