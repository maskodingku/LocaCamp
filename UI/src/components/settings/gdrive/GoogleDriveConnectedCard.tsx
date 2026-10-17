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
      <div className="relative rounded-[22px] border border-cyan-400/40 bg-[#020717]/80 backdrop-blur-2xl shadow-[0_10px_35px_rgba(0,0,0,0.7),0_0_20px_rgba(6,182,212,0.18),inset_0_1.5px_2px_rgba(255,255,255,0.6)] text-white p-4 overflow-hidden">
        <div className="pointer-events-none absolute top-0 left-8 right-8 h-[1px] bg-gradient-to-r from-transparent via-cyan-100/90 to-transparent z-20" />
        <div className="flex items-center justify-between mb-3.5">
          <span className="text-[11px] font-bold tracking-wider text-cyan-300 uppercase flex items-center gap-1.5 font-mono">
            <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
            Akun Google Terhubung
          </span>
          <button
            type="button"
            onClick={disconnect}
            className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/15 hover:bg-rose-500/25 text-rose-300 border border-rose-500/30 text-xs transition-colors cursor-pointer shadow-sm"
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
              className="w-12 h-12 rounded-full object-cover border-2 border-cyan-400/60 shadow-[0_0_12px_rgba(6,182,212,0.4)]"
            />
          ) : (
            <div className="w-12 h-12 rounded-full bg-cyan-950/60 border border-cyan-400/60 flex items-center justify-center font-bold text-white text-base shadow-inner">
              {(session.userName || session.userEmail || 'G')[0].toUpperCase()}
            </div>
          )}
          <div className="min-w-0">
            <p className="text-sm font-bold text-white truncate">
              {session.userName || 'Pengguna Google'}
            </p>
            <p className="text-xs text-slate-400 truncate">
              {session.userEmail || 'Akun Aktif'}
            </p>
          </div>
        </div>
      </div>

      {/* 2. Pengaturan Folder Target (Terkunci Permanen) */}
      <div className="space-y-2 p-4 rounded-[22px] bg-[#020d1c]/70 border border-cyan-500/25">
        <div className="flex items-center justify-between">
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
            Nama Folder Penyimpanan
          </label>
          <span className="text-[10px] text-cyan-300 flex items-center gap-1 font-mono font-bold">
            <FolderCheck className="w-3 h-3 text-cyan-400" />
            Otomatis Dibuat
          </span>
        </div>
        <div className="flex items-center justify-between px-4 py-2.5 rounded-full bg-[#020717]/90 border border-cyan-400/50 text-white select-none">
          <div className="flex items-center gap-2.5 min-w-0">
            <Folder className="w-4 h-4 text-cyan-400 shrink-0" />
            <span className="text-xs sm:text-sm font-bold text-white tracking-wide truncate">
              LocaCamp Photos
            </span>
          </div>
          <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#020d1c] border border-cyan-500/30 text-[10px] text-cyan-300 font-medium shrink-0 font-mono">
            <Lock className="w-2.5 h-2.5 text-cyan-400" />
            <span>Terkunci</span>
          </span>
        </div>
        <p className="text-[11px] text-slate-400">
          Semua foto survei &amp; geotag akan disimpan ke folder ini di Google Drive Anda.
        </p>
      </div>

      {/* 3. Toggle Auto-Upload */}
      <div className="p-4 rounded-[22px] bg-[#020d1c]/70 border border-cyan-500/25 flex items-center justify-between">
        <div>
          <p className="text-xs font-bold text-white">Upload Otomatis Saat Jepret</p>
          <p className="text-[11px] text-slate-400 mt-0.5">
            Foto langsung disalin ke cloud Drive di latar belakang setiap kali memotret.
          </p>
        </div>
        <div className="relative inline-flex items-center shrink-0 ml-3">
          <input
            type="checkbox"
            checked={Boolean(config.autoUpload)}
            onChange={() => updateConfig({ autoUpload: !config.autoUpload })}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-gradient-to-r from-[#03152e] to-[#0a2042] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:shadow-[0_0_8px_#fff] after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-cyan-400 peer-checked:via-sky-400 peer-checked:to-blue-500 border border-cyan-500/50 peer-checked:border-cyan-200 shadow-[0_0_12px_rgba(6,182,212,0.4)]" />
        </div>
      </div>

      {/* 4. Pengaturan Batas Antrian Bulk Upload */}
      <div className="space-y-2 p-4 rounded-[22px] bg-[#020d1c]/70 border border-cyan-500/25">
        <div className="flex items-center justify-between">
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
            Batas Upload Bersamaan
          </label>
          <span className="text-[10px] text-cyan-300 font-mono font-bold">
            {config.concurrency || 2} foto simultan
          </span>
        </div>
        <p className="text-[11px] text-slate-400">
          Jumlah foto yang diunggah secara paralel saat memproses antrian ke Google Drive.
        </p>

        <div className="grid grid-cols-4 gap-1.5 pt-1">
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
                    ? 'bg-gradient-to-r from-cyan-400 via-sky-400 to-blue-500 text-[#020b18] font-black border-cyan-200 shadow-[0_0_12px_rgba(6,182,212,0.8)]'
                    : 'bg-[#020717]/60 border-cyan-900/60 text-slate-300 hover:text-white hover:border-cyan-500/50'
                }`}
              >
                <div className={`text-xs font-bold ${isSelected ? 'text-[#020b18]' : 'text-white'}`}>
                  {opt.label}
                </div>
                <div className={`text-[9.5px] mt-0.5 ${isSelected ? 'text-[#020b18]/80' : 'text-slate-400'}`}>
                  {opt.desc}
                </div>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
