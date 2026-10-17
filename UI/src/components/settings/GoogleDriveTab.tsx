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
      <div className="relative rounded-[22px] border border-white/20 bg-[#03152e]/90 shadow-[0_12px_32px_rgba(0,0,0,0.6),inset_0_1.5px_2px_rgba(255,255,255,0.85)] text-white p-4 overflow-hidden">
        <div className="pointer-events-none absolute top-0 left-8 right-8 h-[1.5px] bg-gradient-to-r from-transparent via-cyan-100/80 to-transparent z-20" />
        <div className="flex items-start gap-3">
          <CyberGlassOrb icon={ShieldCheck} size="md" variant="cyan" />
          <div className="text-xs text-slate-200 leading-relaxed font-medium">
            <p className="font-black text-white mb-0.5 text-sm drop-shadow-[0_1px_2px_rgba(0,0,0,0.95)] drop-shadow-[0_0_6px_rgba(255,255,255,0.35)]">Keamanan Data &amp; Privasi Terjamin</p>
            <p className="text-slate-200 drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)]">
              Foto diunggah langsung ke Google Drive pribadi Anda via izin terbatas (<code className="text-cyan-300 font-mono font-bold drop-shadow-[0_0_5px_rgba(34,211,238,0.75)]">drive.file</code>).
              Aplikasi tidak dapat mengakses dokumen atau file pribadi lain di Google Drive Anda.
            </p>
          </div>
        </div>
      </div>

      {/* 2. Error Display */}
      {error && (
        <div className="p-3.5 rounded-2xl bg-rose-950/60 border border-rose-500/50 flex items-start justify-between gap-2 text-rose-200 text-xs shadow-[0_4px_12px_rgba(0,0,0,0.6)] font-medium">
          <div className="flex items-start gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-300 mt-0.5 drop-shadow-[0_0_5px_rgba(244,63,94,0.75)]" />
            <span className="drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)]">{error}</span>
          </div>
          <button
            type="button"
            onClick={clearError}
            className="text-slate-300 hover:text-white text-xs font-bold cursor-pointer"
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
          <div className="relative rounded-[22px] border border-white/20 bg-[#03152e]/90 shadow-[0_12px_32px_rgba(0,0,0,0.6),inset_0_1.5px_2px_rgba(255,255,255,0.85)] text-white p-5 sm:p-6 text-center space-y-4 overflow-hidden">
            <div className="pointer-events-none absolute top-0 left-8 right-8 h-[1.5px] bg-gradient-to-r from-transparent via-cyan-100/80 to-transparent z-20" />
            
            <div className="inline-flex p-3 rounded-2xl bg-[#020b18]/85 border border-white/30 shadow-[0_4px_12px_rgba(0,0,0,0.5)]">
              <GoogleDriveIcon className="w-9 h-9" />
            </div>

            <div className="space-y-1">
              <h3 className="text-base font-black text-white flex items-center justify-center gap-1.5 drop-shadow-[0_1px_3px_rgba(0,0,0,0.95)] drop-shadow-[0_0_8px_rgba(34,211,238,0.7)]">
                <span>Google Drive Cloud Backup</span>
                <Sparkles className="w-4 h-4 text-cyan-300 fill-cyan-300 drop-shadow-[0_0_6px_rgba(34,211,238,0.8)]" />
              </h3>
              <p className="text-xs text-slate-200 max-w-xs mx-auto leading-relaxed font-medium drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)]">
                Tautkan akun Google untuk mencadangkan hasil foto geotag dan watermark secara otomatis dan aman ke cloud.
              </p>
            </div>

            {/* Tombol Utama 1-Klik Murni dengan Gaya Cyber Glass Capsule */}
            <div className="space-y-2">
              <button
                type="button"
                onClick={handleOneClickConnect}
                disabled={isConnecting}
                className="w-full py-3.5 px-5 rounded-full bg-gradient-to-r from-cyan-400 via-sky-400 to-blue-500 text-black font-black text-xs sm:text-sm flex items-center justify-center gap-3 border border-white/90 shadow-[0_4px_16px_rgba(0,0,0,0.6),inset_0_2px_3px_rgba(255,255,255,0.95)] hover:brightness-110 active:scale-[0.98] transition-all cursor-pointer disabled:opacity-85 relative overflow-hidden"
              >
                <div className="absolute top-0 inset-x-5 h-[1.5px] bg-gradient-to-r from-transparent via-cyan-100/80 to-transparent pointer-events-none" />
                {isConnecting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin text-black" />
                    <span className="drop-shadow-[0_1px_1px_rgba(255,255,255,0.6)]">Membuka Izin Akses Google...</span>
                  </>
                ) : (
                  <>
                    <GoogleDriveIcon className="w-5 h-5 shrink-0" />
                    <span className="drop-shadow-[0_1px_1px_rgba(255,255,255,0.6)]">Kaitkan Akun Google Drive</span>
                  </>
                )}
              </button>

              {isConnecting && (
                <button
                  type="button"
                  onClick={cancelConnect}
                  className="w-full py-1 text-xs text-slate-300 hover:text-white transition-colors cursor-pointer text-center underline font-bold drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)]"
                >
                  Batalkan proses
                </button>
              )}
            </div>

            <p className="text-[11px] text-slate-200 font-medium drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)]">
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
