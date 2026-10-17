import React from 'react'
import { X, ChevronLeft, ChevronRight, Check } from 'lucide-react'
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
  onChangeActiveInput: (inputId: string) => void
  onClose: () => void
  profile: ProfileConfig
  onChangeProfile: (cfg: ProfileConfig) => void
  watermark: WatermarkConfig
  onChangeWatermark: (cfg: WatermarkConfig) => void
  geotagConfig: GeotagDisplayConfig
  onChangeGeotagConfig: (cfg: GeotagDisplayConfig) => void
}

interface InputMeta {
  id: string
  section: 'profile' | 'watermark' | 'geotag'
  title: string
}

const ALL_INPUTS: InputMeta[] = [
  // Section: Profil Pengguna
  { id: 'profile_job', section: 'profile', title: 'Jabatan / Posisi' },
  { id: 'profile_name', section: 'profile', title: 'Nama Lengkap' },
  { id: 'profile_font', section: 'profile', title: 'Jenis Font Profil' },
  { id: 'profile_position', section: 'profile', title: 'Posisi Profil' },
  { id: 'profile_weight', section: 'profile', title: 'Ketebalan Teks' },
  { id: 'profile_size', section: 'profile', title: 'Ukuran Teks Profil' },

  // Section: Watermark Logo
  { id: 'watermark_position', section: 'watermark', title: 'Posisi Watermark' },
  { id: 'watermark_size', section: 'watermark', title: 'Ukuran Watermark' },
  { id: 'watermark_opacity', section: 'watermark', title: 'Transparansi Logo' },

  // Section: Geotag
  { id: 'geotag_position', section: 'geotag', title: 'Posisi Badge Geotag' },
  { id: 'geotag_size', section: 'geotag', title: 'Ukuran Tulisan Geotag' },
]

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
  onChangeActiveInput,
  onClose,
  profile,
  onChangeProfile,
  watermark,
  onChangeWatermark,
  geotagConfig,
  onChangeGeotagConfig,
}) => {
  const currentMeta = ALL_INPUTS.find(i => i.id === activeInput) || ALL_INPUTS[0]
  const sectionInputs = ALL_INPUTS.filter(i => i.section === currentMeta.section)
  const currentIndex = sectionInputs.findIndex(i => i.id === currentMeta.id)

  const handlePrev = () => {
    const prevIndex = (currentIndex - 1 + sectionInputs.length) % sectionInputs.length
    onChangeActiveInput(sectionInputs[prevIndex].id)
  }

  const handleNext = () => {
    const nextIndex = (currentIndex + 1) % sectionInputs.length
    onChangeActiveInput(sectionInputs[nextIndex].id)
  }

  const sectionDotColor =
    currentMeta.section === 'profile'
      ? 'bg-emerald-400'
      : currentMeta.section === 'watermark'
      ? 'bg-cyan-400'
      : 'bg-amber-400'

  return (
    <aside
      aria-label="Live Preview Controls"
      className="fixed bottom-4 left-3 right-3 sm:left-auto sm:right-6 sm:w-full sm:max-w-lg z-[130] pointer-events-auto"
    >
      <div className="p-2 sm:p-2.5 rounded-2xl bg-zinc-950/90 backdrop-blur-xl border border-white/20 shadow-[0_12px_40px_rgba(0,0,0,0.7)] text-white animate-in slide-in-from-bottom-3 duration-200">
        {/* Header Penanda Input Aktif & Urutan Section */}
        <div className="flex items-center justify-between px-1 pb-1.5">
          <span className="text-[11px] font-semibold text-zinc-300 flex items-center gap-1.5">
            <span className={`w-1.5 h-1.5 rounded-full ${sectionDotColor} shadow-[0_0_6px_currentColor]`} />
            <span>{currentMeta.title}</span>
          </span>
          <span className="text-[10px] text-zinc-400 font-mono">
            {currentIndex + 1} / {sectionInputs.length}
          </span>
        </div>

        {/* Baris Kontrol Input Melekat & Tombol Tutup */}
        <div className="flex items-stretch gap-2">
          {/* Segmented Input Group: [ < Back (Glass) ] [ Input Lebar ] [ Next > (Glass) ] */}
          <div className="flex-1 min-w-0 flex items-stretch">
            {/* Tombol Back Melekat di Sisi Kiri Input (Efek Glassmorphism Transparan) */}
            <button
              type="button"
              onClick={handlePrev}
              className="px-3 sm:px-3.5 bg-white/[0.08] hover:bg-white/[0.18] active:bg-white/[0.25] backdrop-blur-md text-zinc-100 hover:text-white border border-r-0 border-white/20 hover:border-white/35 rounded-l-xl flex items-center justify-center shrink-0 active:scale-95 transition-all cursor-pointer group shadow-[inset_0_1px_0_rgba(255,255,255,0.2)]"
              title="Input Sebelumnya di Section Ini"
            >
              <ChevronLeft className="w-4 h-4 text-zinc-200 group-hover:text-white group-hover:-translate-x-0.5 transition-transform" />
            </button>

            {/* Wadah Input Tengah Melekat Tanpa Gap */}
            <div className="flex-1 min-w-0 bg-zinc-900/80 backdrop-blur-md border-y border-white/20 flex items-center px-2.5 py-1.5 overflow-hidden">
              {/* 1. Jabatan Profil */}
              {activeInput === 'profile_job' && (
                <input
                  type="text"
                  value={profile.jobTitle}
                  onChange={e => onChangeProfile({ ...profile, jobTitle: e.target.value })}
                  placeholder="Ketik Jabatan / Posisi..."
                  className="w-full bg-transparent border-none text-xs sm:text-sm text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:ring-0 py-0.5"
                />
              )}

              {/* 2. Nama Profil */}
              {activeInput === 'profile_name' && (
                <input
                  type="text"
                  value={profile.name}
                  onChange={e => onChangeProfile({ ...profile, name: e.target.value })}
                  placeholder="Ketik Nama Lengkap..."
                  className="w-full bg-transparent border-none text-xs sm:text-sm text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:ring-0 py-0.5"
                />
              )}

              {/* 3. Jenis Font Profil */}
              {activeInput === 'profile_font' && (
                <select
                  value={profile.fontFamily}
                  onChange={e => onChangeProfile({ ...profile, fontFamily: e.target.value })}
                  className="w-full bg-transparent border-none text-xs sm:text-sm text-zinc-100 focus:outline-none focus:ring-0 py-0.5 cursor-pointer appearance-none"
                >
                  {FONT_OPTIONS.map(font => (
                    <option key={font.id} value={font.id} className="bg-zinc-900 text-zinc-100">
                      {font.label}
                    </option>
                  ))}
                </select>
              )}

              {/* 4. Posisi Profil */}
              {activeInput === 'profile_position' && (
                <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5 w-full">
                  {PROFILE_POS_OPTIONS.map(pos => {
                    const active = (profile.position || 'above-geotag') === pos.id
                    return (
                      <button
                        key={pos.id}
                        type="button"
                        onClick={() => onChangeProfile({ ...profile, position: pos.id })}
                        className={`shrink-0 px-2.5 py-1 rounded-lg text-xs font-medium transition-all flex items-center gap-1 ${
                          active
                            ? 'bg-emerald-500 text-black font-bold shadow-md'
                            : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
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
                <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5 w-full">
                  {PROFILE_WEIGHTS.map(fw => {
                    const active = (profile.fontWeight || 'medium') === fw.id
                    return (
                      <button
                        key={fw.id}
                        type="button"
                        onClick={() => onChangeProfile({ ...profile, fontWeight: fw.id })}
                        className={`shrink-0 px-3 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                          active
                            ? 'bg-emerald-500 text-black font-bold shadow-md'
                            : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
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
                <div className="w-full px-1">
                  <div className="flex justify-between items-center text-[11px] mb-0.5">
                    <span className="text-zinc-400">Ukuran Teks</span>
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
                <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5 w-full">
                  {WATERMARK_POS_OPTIONS.map(pos => {
                    const active = watermark.position === pos.id
                    return (
                      <button
                        key={pos.id}
                        type="button"
                        onClick={() => onChangeWatermark({ ...watermark, position: pos.id })}
                        className={`shrink-0 px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                          active
                            ? 'bg-cyan-500 text-black font-bold shadow-md'
                            : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
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
                <div className="w-full px-1">
                  <div className="flex justify-between items-center text-[11px] mb-0.5">
                    <span className="text-zinc-400">Ukuran Watermark</span>
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
                <div className="w-full px-1">
                  <div className="flex justify-between items-center text-[11px] mb-0.5">
                    <span className="text-zinc-400">Transparansi Logo</span>
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
                <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5 w-full">
                  {GEOTAG_POS_OPTIONS.map(pos => {
                    const active = geotagConfig.position === pos.id
                    return (
                      <button
                        key={pos.id}
                        type="button"
                        onClick={() => onChangeGeotagConfig({ ...geotagConfig, position: pos.id })}
                        className={`shrink-0 px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                          active
                            ? 'bg-amber-400 text-black font-bold shadow-md'
                            : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
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
                <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5 w-full">
                  {GEOTAG_SIZE_OPTIONS.map(item => {
                    const active = (geotagConfig.fontSize || 'medium') === item.id
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => onChangeGeotagConfig({ ...geotagConfig, fontSize: item.id })}
                        className={`shrink-0 px-3 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                          active
                            ? 'bg-amber-400 text-black font-bold shadow-md'
                            : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
                        }`}
                      >
                        {item.label}
                      </button>
                    )
                  })}
                </div>
              )}
            </div>

            {/* Tombol Next Melekat di Sisi Kanan Input (Efek Glassmorphism Transparan) */}
            <button
              type="button"
              onClick={handleNext}
              className="px-3 sm:px-3.5 bg-white/[0.08] hover:bg-white/[0.18] active:bg-white/[0.25] backdrop-blur-md text-zinc-100 hover:text-white border border-l-0 border-white/20 hover:border-white/35 rounded-r-xl flex items-center justify-center shrink-0 active:scale-95 transition-all cursor-pointer group shadow-[inset_0_1px_0_rgba(255,255,255,0.2)]"
              title="Input Selanjutnya di Section Ini"
            >
              <ChevronRight className="w-4 h-4 text-zinc-200 group-hover:text-white group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>

          {/* Tombol Tutup Preview di Sisi Kanan Dock */}
          <button
            type="button"
            onClick={onClose}
            className="shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/[0.08] hover:bg-white/[0.16] active:bg-white/[0.22] backdrop-blur-md text-white border border-white/20 shadow-[inset_0_1px_0_rgba(255,255,255,0.15)] active:scale-95 transition-all text-xs font-semibold cursor-pointer group self-stretch"
            title="Tutup Mode Preview & Kembali ke Pengaturan"
          >
            <X className="w-4 h-4 text-rose-400 group-hover:rotate-90 transition-transform duration-200" />
            <span className="hidden sm:inline">Tutup</span>
          </button>
        </div>
      </div>
    </aside>
  )
}
