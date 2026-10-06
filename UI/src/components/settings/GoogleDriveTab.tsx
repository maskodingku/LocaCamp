import React, { useState } from 'react'
import {
  Cloud,
  CheckCircle2,
  Folder,
  Key,
  LogOut,
  ShieldCheck,
  AlertCircle,
  Loader2,
  ExternalLink,
  HelpCircle,
} from 'lucide-react'
import type { useGoogleDrive } from '../../hooks/useGoogleDrive'

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
    session,
    isConnected,
    isConnecting,
    error,
    connect,
    disconnect,
    updateConfig,
    clearError,
  } = drive

  const [inputClientId, setInputClientId] = useState(config.clientId || '')
  const [inputFolderName, setInputFolderName] = useState(config.folderName || 'LocaCamp Photos')
  const [showHelp, setShowHelp] = useState(false)

  const handleSaveConfig = () => {
    updateConfig({
      clientId: inputClientId.trim(),
      folderName: inputFolderName.trim() || 'LocaCamp Photos',
    })
  }

  const handleConnectClick = async () => {
    handleSaveConfig()
    await connect(inputClientId.trim())
  }

  return (
    <div
      className={`space-y-5 transition-opacity duration-150 ${
        activeSlider ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      {/* 1. Header Banner Keamanan Privasi */}
      <div className="p-3.5 rounded-2xl bg-zinc-900/80 border border-zinc-800 flex items-start gap-3">
        <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 shrink-0">
          <ShieldCheck className="w-5 h-5" />
        </div>
        <div className="text-xs text-zinc-300 leading-relaxed">
          <p className="font-semibold text-white mb-0.5">Keamanan Data & Privasi Terjamin</p>
          <p className="text-zinc-400">
            Foto diunggah langsung ke Google Drive pribadi Anda via scope terisolasi (<code className="text-emerald-400 font-mono">drive.file</code>).
            LocaCamp tidak dapat membaca dokumen atau foto pribadi lain di akun Anda.
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
            className="text-zinc-400 hover:text-white text-xs font-bold"
          >
            ✕
          </button>
        </div>
      )}

      {/* 3. Panel Akun Terhubung */}
      {isConnected ? (
        <div className="space-y-4">
          {/* Kartu Profil Terhubung */}
          <div className="p-4 rounded-2xl bg-emerald-950/20 border border-emerald-500/30">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-semibold tracking-wider text-emerald-400 uppercase flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Akun Google Terhubung
              </span>
              <button
                type="button"
                onClick={disconnect}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 text-xs transition-colors"
                title="Putuskan akun"
              >
                <LogOut className="w-3 h-3" />
                <span>Putuskan</span>
              </button>
            </div>

            <div className="flex items-center gap-3">
              {session.userAvatar ? (
                <img
                  src={session.userAvatar}
                  alt={session.userName || 'Google User'}
                  className="w-11 h-11 rounded-full object-cover border-2 border-emerald-500/40 shadow-sm"
                />
              ) : (
                <div className="w-11 h-11 rounded-full bg-emerald-800/40 border border-emerald-500/40 flex items-center justify-center font-bold text-white text-sm">
                  {(session.userName || session.userEmail || 'G')[0].toUpperCase()}
                </div>
              )}
              <div className="min-w-0">
                <p className="text-sm font-bold text-white truncate">
                  {session.userName || 'Pengguna Google'}
                </p>
                <p className="text-xs text-zinc-400 truncate">
                  {session.userEmail || 'Akun Aktif'}
                </p>
              </div>
            </div>
          </div>

          {/* Pengaturan Folder Penyimpanan */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400">
              Nama Folder di Google Drive
            </label>
            <div className="relative">
              <Folder className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
              <input
                type="text"
                value={inputFolderName}
                onChange={(e) => {
                  setInputFolderName(e.target.value)
                  updateConfig({ folderName: e.target.value })
                }}
                placeholder="Contoh: LocaCamp Photos / Proyek Tol"
                className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-white text-xs placeholder:text-zinc-600 focus:outline-none focus:border-emerald-500 transition-colors"
              />
            </div>
            <p className="text-[11px] text-zinc-500">
              Folder akan otomatis dibuat jika belum ada di Google Drive Anda.
            </p>
          </div>

          {/* Toggle Auto-Upload Saat Foto Dijepret */}
          <div className="pt-2 border-t border-zinc-800/80 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-white">Upload Otomatis Saat Jepret</p>
              <p className="text-[11px] text-zinc-400">
                Simpan salinan foto langsung ke Drive di latar belakang setiap kali memotret.
              </p>
            </div>
            <button
              type="button"
              onClick={() => updateConfig({ autoUpload: !config.autoUpload })}
              className={`w-11 h-6 rounded-full transition-colors relative p-0.5 cursor-pointer shrink-0 ml-3 ${
                config.autoUpload ? 'bg-emerald-500' : 'bg-zinc-800'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white shadow-md transition-transform ${
                  config.autoUpload ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>
      ) : (
        /* 4. Panel Belum Terhubung: Form Client ID & Tombol Connect */
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400">
                Google OAuth Client ID
              </label>
              <button
                type="button"
                onClick={() => setShowHelp(prev => !prev)}
                className="text-[11px] text-emerald-400 hover:text-emerald-300 flex items-center gap-1 cursor-pointer"
              >
                <HelpCircle className="w-3 h-3" />
                <span>Cara dapatkan</span>
              </button>
            </div>

            <div className="relative">
              <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
              <input
                type="text"
                value={inputClientId}
                onChange={(e) => {
                  setInputClientId(e.target.value)
                  updateConfig({ clientId: e.target.value.trim() })
                }}
                placeholder="xxxx-xxxx.apps.googleusercontent.com"
                className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-white text-xs placeholder:text-zinc-600 focus:outline-none focus:border-emerald-500 transition-colors font-mono"
              />
            </div>

            {/* Petunjuk Cara Dapatkan Client ID */}
            {showHelp && (
              <div className="p-3.5 rounded-xl bg-zinc-900 border border-zinc-800 text-[11px] text-zinc-300 space-y-1.5 animate-in fade-in">
                <p className="font-semibold text-white">Langkah 2 Menit di Google Cloud Console (Gratis):</p>
                <ol className="list-decimal pl-4 space-y-1 text-zinc-400">
                  <li>Buka <a href="https://console.cloud.google.com" target="_blank" rel="noreferrer" className="text-emerald-400 underline inline-flex items-center gap-0.5">console.cloud.google.com <ExternalLink className="w-2.5 h-2.5" /></a> dan buat project baru.</li>
                  <li>Aktifkan <strong>Google Drive API</strong> di menu <em>APIs & Services</em>.</li>
                  <li>Buka <em>Credentials</em> → <em>Create Credentials</em> → <strong>OAuth client ID</strong> (Web Application).</li>
                  <li>Tambahkan domain Anda (atau <code className="text-zinc-300">http://localhost:3000</code>) ke <em>Authorized JavaScript origins</em>.</li>
                  <li>Salin <strong>Client ID</strong> dan tempel di atas.</li>
                </ol>
              </div>
            )}
          </div>

          {/* Folder Target */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400">
              Folder Target Google Drive
            </label>
            <div className="relative">
              <Folder className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
              <input
                type="text"
                value={inputFolderName}
                onChange={(e) => {
                  setInputFolderName(e.target.value)
                  updateConfig({ folderName: e.target.value })
                }}
                placeholder="LocaCamp Photos"
                className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-white text-xs placeholder:text-zinc-600 focus:outline-none focus:border-emerald-500 transition-colors"
              />
            </div>
          </div>

          {/* Tombol Kaitkan Akun Google Drive */}
          <button
            type="button"
            onClick={handleConnectClick}
            disabled={isConnecting || !inputClientId.trim()}
            className={`w-full py-3 px-4 rounded-xl font-semibold text-xs flex items-center justify-center gap-2 transition-all shadow-lg active:scale-98 cursor-pointer ${
              !inputClientId.trim()
                ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
                : 'bg-emerald-500 hover:bg-emerald-400 text-black shadow-emerald-500/20 font-bold'
            }`}
          >
            {isConnecting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Menghubungkan ke Google...</span>
              </>
            ) : (
              <>
                <Cloud className="w-4 h-4" />
                <span>Kaitkan Akun Google Drive</span>
              </>
            )}
          </button>
        </div>
      )}
    </div>
  )
}
