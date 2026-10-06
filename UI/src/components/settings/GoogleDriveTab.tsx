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
import { GoogleDriveQuickPromptModal } from './gdrive/GoogleDriveQuickPromptModal'

interface GoogleDriveTabProps {
  drive: ReturnType<typeof useGoogleDrive>
  activeSlider?: string | null
}

export const GoogleDriveTab: React.FC<GoogleDriveTabProps> = ({
  drive,
  activeSlider,
}) => {
  const {
    config,
    isConnected,
    isConnecting,
    error,
    hasClientId,
    effectiveClientId,
    connect,
    updateConfig,
    clearError,
  } = drive

  const [inputClientId, setInputClientId] = useState(effectiveClientId || '')
  const [inputFolderName, setInputFolderName] = useState(config.folderName || 'LocaCamp Photos')
  const [showPromptModal, setShowPromptModal] = useState(false)

  // 1-Click Connect Action
  const handleOneClickConnect = async () => {
    if (!hasClientId && !inputClientId.trim()) {
      setShowPromptModal(true)
      return
    }
    const target = inputClientId.trim() || effectiveClientId
    await connect(target)
  }

  const handlePromptConfirm = async (clientId: string) => {
    setInputClientId(clientId)
    updateConfig({ clientId })
    setShowPromptModal(false)
    await connect(clientId)
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
      {/* 1. Header Banner Keamanan & Privasi */}
      <div className="p-3.5 rounded-2xl bg-zinc-900/80 border border-zinc-800 flex items-start gap-3">
        <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 shrink-0">
          <ShieldCheck className="w-5 h-5" />
        </div>
        <div className="text-xs text-zinc-300 leading-relaxed">
          <p className="font-semibold text-white mb-0.5">Keamanan Data & Privasi Terjamin</p>
          <p className="text-zinc-400">
            Foto diunggah langsung ke Google Drive pribadi Anda via scope terisolasi (<code className="text-emerald-400 font-mono">drive.file</code>).
            Aplikasi tidak dapat mengakses dokumen atau file pribadi lain di Google Drive Anda.
          </p>
        </div>
      </div>

      {/* 2. Error Display */}
      {error && (
        <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-start justify-between gap-2 text-rose-300 text-xs">
          <div className="flex items-start gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-400 mt-0.5" />
            <span>{error}</span>
          </div>
          <button
            type="button"
            onClick={clearError}
            className="text-zinc-400 hover:text-white text-xs font-bold cursor-pointer"
          >
            ✕
          </button>
        </div>
      )}

      {/* 3. Konten Utama: Terhubung VS Belum Terhubung */}
      {isConnected ? (
        <GoogleDriveConnectedCard
          drive={drive}
          inputFolderName={inputFolderName}
          setInputFolderName={setInputFolderName}
        />
      ) : (
        <div className="space-y-4">
          {/* Hero Card 1-Click Connect Ramah Pengguna Awam */}
          <div className="p-5 rounded-3xl bg-gradient-to-b from-zinc-900 via-zinc-900/90 to-zinc-950 border border-zinc-800 text-center space-y-4 shadow-xl">
            <div className="inline-flex p-3 rounded-2xl bg-zinc-800/80 border border-zinc-700/60 shadow-inner">
              <GoogleDriveIcon className="w-9 h-9" />
            </div>

            <div className="space-y-1">
              <h3 className="text-base font-bold text-white flex items-center justify-center gap-1.5">
                <span>Google Drive Cloud Backup</span>
                <Sparkles className="w-4 h-4 text-amber-400 fill-amber-400" />
              </h3>
              <p className="text-xs text-zinc-400 max-w-xs mx-auto leading-relaxed">
                Tautkan akun Google untuk mencadangkan hasil foto geotag dan watermark secara otomatis dan aman ke cloud.
              </p>
            </div>

            {/* Tombol Utama 1-Klik dengan Logo Resmi Google Drive */}
            <button
              type="button"
              onClick={handleOneClickConnect}
              disabled={isConnecting}
              className="w-full py-3.5 px-4 rounded-2xl bg-white hover:bg-zinc-100 active:scale-[0.98] text-zinc-950 font-bold text-xs sm:text-sm flex items-center justify-center gap-3 shadow-lg shadow-white/5 transition-all cursor-pointer"
            >
              {isConnecting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin text-zinc-900" />
                  <span>Membuka Akses Google...</span>
                </>
              ) : (
                <>
                  <GoogleDriveIcon className="w-5 h-5 shrink-0" />
                  <span>Kaitkan Akun Google Drive</span>
                </>
              )}
            </button>

            <p className="text-[11px] text-zinc-500">
              Cukup 1 klik. Jendela resmi Google akan terbuka untuk meminta izin akses penyimpanan foto.
            </p>
          </div>

          {/* Pengaturan Lanjutan (Collapsible untuk Pengembang / Custom Client ID) */}
          <GoogleDriveAdvancedSettings
            inputClientId={inputClientId}
            setInputClientId={setInputClientId}
            onSaveClientId={handleSaveCustomClientId}
          />
        </div>
      )}

      {/* Modal Cepat jika Client ID Belum Ada Sama Sekali */}
      <GoogleDriveQuickPromptModal
        isOpen={showPromptModal}
        onClose={() => setShowPromptModal(false)}
        onConfirm={handlePromptConfirm}
        initialClientId={inputClientId}
      />
    </div>
  )
}
