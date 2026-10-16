import React from 'react'
import { X, Briefcase, User, Type, Check } from 'lucide-react'
import type {
  ProfileConfig,
  WatermarkConfig,
  GeotagDisplayConfig,
  ProfileFontWeight,
  ProfilePosition,
  WatermarkPosition,
} from '../../types/camera'
import { FONT_OPTIONS } from './watermark/ProfileSection'

interface LivePreviewDockProps {
  activeInput: string
  onClose: () => void
  profile: ProfileConfig
  onChangeProfile: (cfg: ProfileConfig) => void
  watermark: WatermarkConfig
  onChangeWatermark: (cfg: WatermarkConfig) => void
  geotagConfig: GeotagDisplayConfig
  onChangeGeotagConfig: (cfg: GeotagDisplayConfig) => void
}

const PROFILE_WEIGHTS: { id: ProfileFontWeight; label: string }[] = [
  { id: 'normal', label: 'Normal' },
  { id: 'medium', label: 'Sedang' },
  { id: 'semibold', label: 'Semi Bold' },
  { id: 'bold', label: 'Tebal' },
]

const PROFILE_POS_OPTIONS: { id: ProfilePosition; label: string }[] = [
  { id: 'above-geotag', label: '★ Di Atas Geotag' },
  { id: 'top-left', label: '↖ Atas Kiri' },
  { id: 'top-center', label: '↑ Atas Tengah' },
  { id: 'top-right', label: '↗ Atas Kanan' },
  { id: 'bottom-left', label: '↙ Bawah Kiri' },
  { id: 'bottom-center', label: '↓ Bawah Tengah' },
  { id: 'bottom-right', label: '↘ Bawah Kanan' },
]

const WATERMARK_POS_OPTIONS: { id: WatermarkPosition; label: string }[] = [
  { id: 'top-left', label: '↖ Atas Kiri' },
  { id: 'top-center', label: '↑ Atas Tengah' },
  { id: 'top-right', label: '↗ Atas Kanan' },
  { id: 'center', label: '• Tengah' },
  { id: 'bottom-left', label: '↙ Bawah Kiri' },
  { id: 'bottom-center', label: '↓ Bawah Tengah' },
  { id: 'bottom-right', label: '↘ Bawah Kanan' },
]

const GEOTAG_POS_OPTIONS = [
  { id: 'bottom-left' as const, label: '↙ Kiri Bawah' },
  { id: 'bottom-right' as const, label: '↘ Kanan Bawah' },
  { id: 'top-left' as const, label: '↖ Kiri Atas' },
  { id: 'top-right' as const, label: '↗ Kanan Atas' },
]

const GEOTAG_SIZE_OPTIONS = [
  { id: 'small' as const, label: 'Kecil' },
  { id: 'medium' as const, label: 'Standar' },
  { id: 'large' as const, label: 'Besar' },
  { id: 'xlarge' as const, label: 'Ekstra' },
]

export const LivePreviewDock: React.FC<LivePreviewDockProps> = ({
  activeInput,
  onClose,
  profile,
  onChangeProfile,
  watermark,
  onChangeWatermark,
  geotagConfig,
  onChangeGeotagConfig,
}) => {
  return (
    <aside
      aria-label="Live Preview Controls"
      className="fixed bottom-4 left-3 right-3 sm:left-auto sm:right-6 sm:max-w-xl z-[130] pointer-events-auto"
    >
      <div className="flex items-center gap-2.5 p-2 sm:p-2.5 rounded-2xl bg-zinc-950/85 backdrop-blur-xl border border-white/20 shadow-[0_12px_40px_rgba(0,0,0,0.7)] text-white animate-in slide-in-from-bottom-3 duration-200">
        {/* Kolom Kontrol Input Asli (Kiri) */}
        <div className="flex-1 min-w-0">
          {/* 1. Jabatan Profil */}
          {activeInput === 'profile_job' && (
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 flex items-center justify-center shrink-0">
                <Briefcase className="w-4 h-4" />
              </div>
              <input
                type="text"
                autoFocus
                value={profile.jobTitle}
                onChange={e => onChangeProfile({ ...profile, jobTitle: e.target.value })}
                placeholder="Jabatan / Posisi..."
                className="w-full px-3 py-1.5 rounded-xl bg-zinc-900 border border-zinc-700/80 focus:border-emerald-500 text-xs sm:text-sm text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-all"
              />
            </div>
          )}

          {/* 2. Nama Profil */}
          {activeInput === 'profile_name' && (
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 flex items-center justify-center shrink-0">
                <User className="w-4 h-4" />
              </div>
              <input
                type="text"
                autoFocus
                value={profile.name}
                onChange={e => onChangeProfile({ ...profile, name: e.target.value })}
                placeholder="Nama Lengkap..."
                className="w-full px-3 py-1.5 rounded-xl bg-zinc-900 border border-zinc-700/80 focus:border-emerald-500 text-xs sm:text-sm text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-all"
              />
            </div>
          )}

          {/* 3. Jenis Font Profil */}
          {activeInput === 'profile_font' && (
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 flex items-center justify-center shrink-0">
                <Type className="w-4 h-4" />
              </div>
              <div className="relative flex-1">
                <select
                  value={profile.fontFamily}
                  onChange={e => onChangeProfile({ ...profile, fontFamily: e.target.value })}
                  className="w-full px-3 py-1.5 rounded-xl bg-zinc-900 border border-zinc-700/80 focus:border-emerald-500 text-xs sm:text-sm text-zinc-100 focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-all appearance-none cursor-pointer"
                >
                  {FONT_OPTIONS.map(font => (
                    <option key={font.id} value={font.id} className="bg-zinc-900 text-zinc-100">
                      {font.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {/* 4. Posisi Profil */}
          {activeInput === 'profile_position' && (
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
              {PROFILE_POS_OPTIONS.map(pos => {
                const active = (profile.position || 'above-geotag') === pos.id
                return (
                  <button
                    key={pos.id}
                    type="button"
                    onClick={() => onChangeProfile({ ...profile, position: pos.id })}
                    className={`shrink-0 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1 ${
                      active
                        ? 'bg-emerald-500 text-black font-bold shadow-md'
                        : 'bg-zinc-900/90 text-zinc-300 hover:bg-zinc-800'
                    }`}
                  >
                    <span>{pos.label}</span>
                    {active && <Check className="w-3 h-3 shrink-0" />}
                  </button>
                )
              })}
            </div>
          )}

          {/* 5. Ketebalan Teks Profil */}
          {activeInput === 'profile_weight' && (
            <div className="grid grid-cols-4 gap-1">
              {PROFILE_WEIGHTS.map(fw => {
                const active = (profile.fontWeight || 'medium') === fw.id
                return (
                  <button
                    key={fw.id}
                    type="button"
                    onClick={() => onChangeProfile({ ...profile, fontWeight: fw.id })}
                    className={`py-1.5 px-2 rounded-lg text-xs transition-all text-center ${
                      active
                        ? 'bg-emerald-500 text-black font-bold shadow-md'
                        : 'bg-zinc-900/90 text-zinc-400 hover:text-zinc-200'
                    }`}
                  >
                    {fw.label}
                  </button>
                )
              })}
            </div>
          )}

          {/* 6. Ukuran Teks Profil */}
          {activeInput === 'profile_size' && (
            <div className="px-1 py-0.5">
              <div className="flex justify-between items-center text-xs mb-1">
                <span className="text-zinc-400 font-medium">Ukuran Teks Profil</span>
                <span className="font-mono text-emerald-400 font-bold">{profile.fontSize || 13} px</span>
              </div>
              <input
                type="range"
                min={10}
                max={22}
                step={1}
                value={profile.fontSize || 13}
                onChange={e => onChangeProfile({ ...profile, fontSize: Number(e.target.value) })}
                className="w-full accent-emerald-400 h-1.5 bg-zinc-800 rounded-lg cursor-pointer"
              />
            </div>
          )}

          {/* 7. Posisi Watermark */}
          {activeInput === 'watermark_position' && (
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
              {WATERMARK_POS_OPTIONS.map(pos => {
                const active = watermark.position === pos.id
                return (
                  <button
                    key={pos.id}
                    type="button"
                    onClick={() => onChangeWatermark({ ...watermark, position: pos.id })}
                    className={`shrink-0 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      active
                        ? 'bg-cyan-500 text-black font-bold shadow-md'
                        : 'bg-zinc-900/90 text-zinc-300 hover:bg-zinc-800'
                    }`}
                  >
                    {pos.label}
                  </button>
                )
              })}
            </div>
          )}

          {/* 8. Ukuran Watermark */}
          {activeInput === 'watermark_size' && (
            <div className="px-1 py-0.5">
              <div className="flex justify-between items-center text-xs mb-1">
                <span className="text-zinc-400 font-medium">Ukuran Watermark</span>
                <span className="font-mono text-cyan-400 font-bold">{watermark.sizePercent}%</span>
              </div>
              <input
                type="range"
                min={8}
                max={45}
                value={watermark.sizePercent}
                onChange={e => onChangeWatermark({ ...watermark, sizePercent: Number(e.target.value) })}
                className="w-full accent-cyan-400 h-1.5 bg-zinc-800 rounded-lg cursor-pointer"
              />
            </div>
          )}

          {/* 9. Transparansi Watermark */}
          {activeInput === 'watermark_opacity' && (
            <div className="px-1 py-0.5">
              <div className="flex justify-between items-center text-xs mb-1">
                <span className="text-zinc-400 font-medium">Transparansi Logo</span>
                <span className="font-mono text-cyan-400 font-bold">{Math.round(watermark.opacity * 100)}%</span>
              </div>
              <input
                type="range"
                min={0.15}
                max={1.0}
                step={0.05}
                value={watermark.opacity}
                onChange={e => onChangeWatermark({ ...watermark, opacity: Number(e.target.value) })}
                className="w-full accent-cyan-400 h-1.5 bg-zinc-800 rounded-lg cursor-pointer"
              />
            </div>
          )}

          {/* 10. Posisi Geotag */}
          {activeInput === 'geotag_position' && (
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
              {GEOTAG_POS_OPTIONS.map(pos => {
                const active = geotagConfig.position === pos.id
                return (
                  <button
                    key={pos.id}
                    type="button"
                    onClick={() => onChangeGeotagConfig({ ...geotagConfig, position: pos.id })}
                    className={`shrink-0 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      active
                        ? 'bg-amber-400 text-black font-bold shadow-md'
                        : 'bg-zinc-900/90 text-zinc-300 hover:bg-zinc-800'
                    }`}
                  >
                    {pos.label}
                  </button>
                )
              })}
            </div>
          )}

          {/* 11. Ukuran Tulisan Geotag */}
          {activeInput === 'geotag_size' && (
            <div className="grid grid-cols-4 gap-1">
              {GEOTAG_SIZE_OPTIONS.map(item => {
                const active = (geotagConfig.fontSize || 'medium') === item.id
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => onChangeGeotagConfig({ ...geotagConfig, fontSize: item.id })}
                    className={`py-1.5 px-2 rounded-lg text-xs transition-all text-center ${
                      active
                        ? 'bg-amber-400 text-black font-bold shadow-md'
                        : 'bg-zinc-900/90 text-zinc-400 hover:text-zinc-200'
                    }`}
                  >
                    {item.label}
                  </button>
                )
              })}
            </div>
          )}
        </div>

        {/* Tombol Tutup Preview (Sisi Kanan) */}
        <button
          type="button"
          onClick={onClose}
          className="shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-xl bg-zinc-900/90 hover:bg-zinc-800 text-white border border-white/15 active:scale-95 transition-all text-xs font-semibold cursor-pointer group shadow-sm"
          title="Tutup Mode Preview & Kembali ke Pengaturan"
        >
          <X className="w-4 h-4 text-rose-400 group-hover:rotate-90 transition-transform duration-200" />
          <span>Tutup</span>
        </button>
      </div>
    </aside>
  )
}
