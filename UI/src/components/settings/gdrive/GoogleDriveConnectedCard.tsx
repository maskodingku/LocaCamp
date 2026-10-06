import React from 'react'
import {
  CheckCircle2,
  Folder,
  LogOut,
  FolderCheck,
} from 'lucide-react'
import type { useGoogleDrive } from '../../../hooks/useGoogleDrive'

interface GoogleDriveConnectedCardProps {
  drive: ReturnType<typeof useGoogleDrive>
  inputFolderName: string
  setInputFolderName: (name: string) => void
}

export const GoogleDriveConnectedCard: React.FC<GoogleDriveConnectedCardProps> = ({
  drive,
  inputFolderName,
  setInputFolderName,
}) => {
  const { config, session, disconnect, updateConfig } = drive

  return (
    <div className="space-y-4">
      {/* 1. Kartu Profil Google Terhubung */}
      <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-950/40 via-zinc-900/90 to-zinc-900 border border-emerald-500/30 shadow-lg shadow-emerald-950/20">
        <div className="flex items-center justify-between mb-3.5">
          <span className="text-[11px] font-semibold tracking-wider text-emerald-400 uppercase flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Akun Google Terhubung
          </span>
          <button
            type="button"
            onClick={disconnect}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 text-xs transition-colors cursor-pointer"
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
              className="w-12 h-12 rounded-full object-cover border-2 border-emerald-500/50 shadow-md"
            />
          ) : (
            <div className="w-12 h-12 rounded-full bg-emerald-800/40 border border-emerald-500/40 flex items-center justify-center font-bold text-white text-base shadow-inner">
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

      {/* 2. Pengaturan Folder Target */}
      <div className="space-y-2 p-3.5 rounded-2xl bg-zinc-900/80 border border-zinc-800">
        <div className="flex items-center justify-between">
          <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400">
            Nama Folder Penyimpanan
          </label>
          <span className="text-[10px] text-emerald-400 flex items-center gap-1">
            <FolderCheck className="w-3 h-3" />
            Otomatis Dibuat
          </span>
        </div>
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
            className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-white text-xs placeholder:text-zinc-600 focus:outline-none focus:border-emerald-500 transition-colors"
          />
        </div>
        <p className="text-[11px] text-zinc-500">
          Semua foto survei & geotag akan disimpan ke folder ini di Google Drive Anda.
        </p>
      </div>

      {/* 3. Toggle Auto-Upload */}
      <div className="p-3.5 rounded-2xl bg-zinc-900/80 border border-zinc-800 flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold text-white">Upload Otomatis Saat Jepret</p>
          <p className="text-[11px] text-zinc-400">
            Foto langsung disalin ke cloud Drive di latar belakang setiap kali memotret.
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
  )
}
