import React from 'react'
import {
  CheckCircle2,
  Folder,
  LogOut,
  FolderCheck,
  Lock,
} from 'lucide-react'
import type { useGoogleDrive } from '../../../hooks/useGoogleDrive'

interface GoogleDriveConnectedCardProps {
  drive: ReturnType<typeof useGoogleDrive>
}

export const GoogleDriveConnectedCard: React.FC<GoogleDriveConnectedCardProps> = ({
  drive,
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

      {/* 2. Pengaturan Folder Target (Terkunci Permanen) */}
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
        <div className="flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-white select-none">
          <div className="flex items-center gap-2.5 min-w-0">
            <Folder className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="text-xs sm:text-sm font-semibold text-zinc-100 tracking-wide truncate">
              LocaCamp Photos
            </span>
          </div>
          <span className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-zinc-900 border border-zinc-800/90 text-[10px] text-zinc-400 font-medium shrink-0">
            <Lock className="w-2.5 h-2.5 text-zinc-400" />
            <span>Terkunci</span>
          </span>
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

      {/* 4. Pengaturan Batas Antrian Bulk Upload (Queue Concurrency) */}
      <div className="space-y-2 p-3.5 rounded-2xl bg-zinc-900/80 border border-zinc-800">
        <div className="flex items-center justify-between">
          <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400">
            Batas Upload Bersamaan
          </label>
          <span className="text-[10px] text-emerald-400 font-mono">
            {config.concurrency || 2} foto simultan
          </span>
        </div>
        <p className="text-[11px] text-zinc-500">
          Jumlah foto yang diunggah secara paralel saat memproses antrian ke Google Drive.
        </p>

        <div className="grid grid-cols-4 gap-2 pt-1">
          {[
            { value: 1, label: '1 Foto', desc: 'Stabil' },
            { value: 2, label: '2 Foto', desc: 'Disarankan' },
            { value: 3, label: '3 Foto', desc: 'Cepat' },
            { value: 4, label: '4 Foto', desc: 'Maksimal' },
          ].map((opt) => {
            const isSelected = (config.concurrency || 2) === opt.value
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => updateConfig({ concurrency: opt.value })}
                className={`py-2 px-1 rounded-xl text-center transition-all cursor-pointer border ${
                  isSelected
                    ? 'bg-emerald-500/20 border-emerald-500/50 text-white shadow-sm'
                    : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:border-zinc-700'
                }`}
              >
                <div
                  className={`text-xs font-bold ${
                    isSelected ? 'text-emerald-400' : 'text-zinc-300'
                  }`}
                >
                  {opt.label}
                </div>
                <div className="text-[9px] text-zinc-500 mt-0.5">{opt.desc}</div>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
