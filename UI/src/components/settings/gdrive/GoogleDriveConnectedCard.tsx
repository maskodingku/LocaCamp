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
      <div className="relative rounded-[22px] border border-white/20 bg-[#03152e]/55 backdrop-blur-xl shadow-[0_12px_32px_rgba(0,0,0,0.6),inset_0_1.5px_2px_rgba(255,255,255,0.85)] text-white p-4 overflow-hidden">
        <div className="pointer-events-none absolute top-0 left-8 right-8 h-[1.5px] bg-gradient-to-r from-transparent via-white/95 to-transparent z-20" />
        <div className="flex items-center justify-between mb-3.5">
          <span className="text-[11px] font-black tracking-wider text-white uppercase flex items-center gap-1.5 font-mono">
            <CheckCircle2 className="w-3.5 h-3.5 text-cyan-300" />
            Akun Google Terhubung
          </span>
          <button
            type="button"
            onClick={disconnect}
            className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/20 hover:bg-rose-500/35 text-white border border-rose-500/40 text-xs font-bold transition-colors cursor-pointer shadow-[0_2px_6px_rgba(0,0,0,0.4)]"
            title="Putuskan akun"
          >
            <LogOut className="w-3 h-3 text-rose-300" />
            <span>Putuskan</span>
          </button>
        </div>

        <div className="flex items-center gap-3">
          {session.userAvatar ? (
            <img
              src={session.userAvatar}
              alt={session.userName || 'Google User'}
              className="w-12 h-12 rounded-full object-cover border-2 border-white/80 shadow-[0_2px_8px_rgba(0,0,0,0.5)]"
            />
          ) : (
            <div className="w-12 h-12 rounded-full bg-[#020e1f] border border-white/40 flex items-center justify-center font-black text-white text-base shadow-[0_2px_8px_rgba(0,0,0,0.5)]">
              {(session.userName || session.userEmail || 'G')[0].toUpperCase()}
            </div>
          )}
          <div className="min-w-0">
            <p className="text-sm font-black text-white truncate drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)]">
              {session.userName || 'Pengguna Google'}
            </p>
            <p className="text-xs text-slate-200 truncate font-medium">
              {session.userEmail || 'Akun Aktif'}
            </p>
          </div>
        </div>
      </div>

      {/* 2. Pengaturan Folder Target (Terkunci Permanen) */}
      <div className="space-y-2 p-4 rounded-[22px] bg-[#020b18]/70 backdrop-blur-md border border-white/20 shadow-[0_4px_12px_rgba(0,0,0,0.4)]">
        <div className="flex items-center justify-between">
          <label className="block text-xs font-bold uppercase tracking-wider text-white">
            Nama Folder Penyimpanan
          </label>
          <span className="text-[10px] text-cyan-300 flex items-center gap-1 font-mono font-black">
            <FolderCheck className="w-3 h-3 text-cyan-300" />
            Otomatis Dibuat
          </span>
        </div>
        <div className="flex items-center justify-between px-4 py-2.5 rounded-full bg-[#020717]/80 backdrop-blur-md border border-white/30 text-white select-none shadow-inner">
          <div className="flex items-center gap-2.5 min-w-0">
            <Folder className="w-4 h-4 text-cyan-300 shrink-0" />
            <span className="text-xs sm:text-sm font-black text-white tracking-wide truncate">
              LocaCamp Photos
            </span>
          </div>
          <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#020d1c] border border-white/25 text-[10px] text-cyan-300 font-black shrink-0 font-mono">
            <Lock className="w-2.5 h-2.5 text-cyan-300" />
            <span>Terkunci</span>
          </span>
        </div>
        <p className="text-[11px] text-slate-200 font-medium">
          Semua foto survei &amp; geotag akan disimpan ke folder ini di Google Drive Anda.
        </p>
      </div>

      {/* 3. Toggle Auto-Upload */}
      <div className="p-4 rounded-[22px] bg-[#020b18]/70 backdrop-blur-md border border-white/20 shadow-[0_4px_12px_rgba(0,0,0,0.4)] flex items-center justify-between">
        <div>
          <p className="text-xs font-bold text-white">Upload Otomatis Saat Jepret</p>
          <p className="text-[11px] text-slate-200 mt-0.5 font-medium">
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
          <div className="w-11 h-6 bg-[#051122] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:shadow-[0_2px_4px_rgba(0,0,0,0.5)] after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-cyan-400 peer-checked:via-sky-400 peer-checked:to-blue-500 border border-white/30 peer-checked:border-white/80 shadow-[0_2px_6px_rgba(0,0,0,0.4),inset_0_1px_1.5px_rgba(255,255,255,0.3)]" />
        </div>
      </div>

      {/* 4. Pengaturan Batas Antrian Bulk Upload */}
      <div className="space-y-2 p-4 rounded-[22px] bg-[#020b18]/70 backdrop-blur-md border border-white/20 shadow-[0_4px_12px_rgba(0,0,0,0.4)]">
        <div className="flex items-center justify-between">
          <label className="block text-xs font-bold uppercase tracking-wider text-white">
            Batas Upload Bersamaan
          </label>
          <span className="text-[10px] text-cyan-300 font-mono font-black">
            {config.concurrency || 2} foto simultan
          </span>
        </div>
        <p className="text-[11px] text-slate-200 font-medium">
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
                    ? 'bg-gradient-to-r from-cyan-400 via-sky-400 to-blue-500 text-black font-black border border-white/90 shadow-[0_2px_8px_rgba(0,0,0,0.6),inset_0_1.5px_2px_rgba(255,255,255,0.95)]'
                    : 'bg-[#020717]/60 border-white/10 text-slate-200 hover:text-white hover:border-white/30 font-bold'
                }`}
              >
                <div className={`text-xs font-bold ${isSelected ? 'text-black' : 'text-white'}`}>
                  {opt.label}
                </div>
                <div className={`text-[9.5px] mt-0.5 ${isSelected ? 'text-black/80 font-bold' : 'text-slate-300 font-medium'}`}>
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
