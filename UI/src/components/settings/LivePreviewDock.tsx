import React, { useState } from 'react'
import { X, ChevronLeft, ChevronRight, ChevronDown, ChevronUp } from 'lucide-react'
import type {
  ProfileConfig,
  WatermarkConfig,
  GeotagDisplayConfig,
  ProfileFontWeight,
  ProfilePosition,
  WatermarkPosition,
} from '../../types/camera'
import { FONT_OPTIONS } from './watermark/ProfileSection'
import {
  PositionGridPopup,
  WATERMARK_GRID_ITEMS,
  PROFILE_GRID_ITEMS,
  GEOTAG_GRID_ITEMS,
} from './dock/PositionGridPopup'
import { CustomOptionListPopup, type OptionListItem } from './dock/CustomOptionListPopup'

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
  type: 'text' | 'dropdown' | 'slider'
}

const ALL_INPUTS: InputMeta[] = [
  // Section: Profil Pengguna
  { id: 'profile_job', section: 'profile', title: 'Jabatan / Posisi', type: 'text' },
  { id: 'profile_name', section: 'profile', title: 'Nama Lengkap', type: 'text' },
  { id: 'profile_font', section: 'profile', title: 'Jenis Font Profil', type: 'dropdown' },
  { id: 'profile_position', section: 'profile', title: 'Posisi Profil', type: 'dropdown' },
  { id: 'profile_weight', section: 'profile', title: 'Ketebalan Teks', type: 'dropdown' },
  { id: 'profile_size', section: 'profile', title: 'Ukuran Teks Profil', type: 'slider' },

  // Section: Watermark Logo
  { id: 'watermark_position', section: 'watermark', title: 'Posisi Watermark', type: 'dropdown' },
  { id: 'watermark_size', section: 'watermark', title: 'Ukuran Watermark', type: 'slider' },
  { id: 'watermark_opacity', section: 'watermark', title: 'Transparansi Logo', type: 'slider' },

  // Section: Geotag
  { id: 'geotag_position', section: 'geotag', title: 'Posisi Badge Geotag', type: 'dropdown' },
  { id: 'geotag_size', section: 'geotag', title: 'Ukuran Tulisan Geotag', type: 'dropdown' },
]

const PROFILE_WEIGHTS_OPTIONS: OptionListItem[] = [
  { id: 'normal', label: 'Normal (400)' },
  { id: 'medium', label: 'Sedang (500)' },
  { id: 'semibold', label: 'Semi Bold (600)' },
  { id: 'bold', label: 'Tebal (700)' },
]

const GEOTAG_SIZE_OPTIONS: OptionListItem[] = [
  { id: 'small', label: 'Kecil' },
  { id: 'medium', label: 'Standar' },
  { id: 'large', label: 'Besar' },
  { id: 'xlarge', label: 'Ekstra Besar' },
]

// Icon Grid 3x3 Mini Titik Kotak (Matrix 9 Dots)
const GridNineDots: React.FC<{ className?: string }> = ({ className = 'w-3.5 h-3.5' }) => (
  <svg className={className} viewBox="0 0 16 16" fill="currentColor">
    <rect x="2" y="2" width="3" height="3" rx="0.6" />
    <rect x="6.5" y="2" width="3" height="3" rx="0.6" />
    <rect x="11" y="2" width="3" height="3" rx="0.6" />
    <rect x="2" y="6.5" width="3" height="3" rx="0.6" />
    <rect x="6.5" y="6.5" width="3" height="3" rx="0.6" />
    <rect x="11" y="6.5" width="3" height="3" rx="0.6" />
    <rect x="2" y="11" width="3" height="3" rx="0.6" />
    <rect x="6.5" y="11" width="3" height="3" rx="0.6" />
    <rect x="11" y="11" width="3" height="3" rx="0.6" />
  </svg>
)

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
  const [isPopupOpen, setIsPopupOpen] = useState(false)

  const currentMeta = ALL_INPUTS.find(i => i.id === activeInput) || ALL_INPUTS[0]
  const sectionInputs = ALL_INPUTS.filter(i => i.section === currentMeta.section)
  const currentInputIndex = sectionInputs.findIndex(i => i.id === currentMeta.id)

  const theme: 'cyan' | 'emerald' | 'amber' =
    currentMeta.section === 'profile'
      ? 'emerald'
      : currentMeta.section === 'watermark'
      ? 'cyan'
      : 'amber'

  const themeDotColor =
    theme === 'emerald'
      ? 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]'
      : theme === 'amber'
      ? 'bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.8)]'
      : 'bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.8)]'

  const themeTextColor =
    theme === 'emerald'
      ? 'text-emerald-400'
      : theme === 'amber'
      ? 'text-amber-400'
      : 'text-cyan-400'

  // Navigasi beralih antar input field dalam section
  const handlePrevInput = () => {
    const prev = (currentInputIndex - 1 + sectionInputs.length) % sectionInputs.length
    setIsPopupOpen(false)
    onChangeActiveInput(sectionInputs[prev].id)
  }

  const handleNextInput = () => {
    const next = (currentInputIndex + 1) % sectionInputs.length
    setIsPopupOpen(false)
    onChangeActiveInput(sectionInputs[next].id)
  }

  // --- Logika Opsi Dropdown untuk Tombol Stepper [<] dan [>] ---
  // 1. Watermark Position
  const watermarkPosIndex = WATERMARK_GRID_ITEMS.findIndex(i => i.id === watermark.position)
  const currentWatermarkItem = WATERMARK_GRID_ITEMS[watermarkPosIndex >= 0 ? watermarkPosIndex : 0]

  // 2. Profile Position
  const profilePosIndex = PROFILE_GRID_ITEMS.findIndex(i => i.id === (profile.position || 'above-geotag'))
  const currentProfilePosItem = PROFILE_GRID_ITEMS[profilePosIndex >= 0 ? profilePosIndex : 0]

  // 3. Geotag Position
  const geotagPosIndex = GEOTAG_GRID_ITEMS.findIndex(i => i.id === geotagConfig.position)
  const currentGeotagPosItem = GEOTAG_GRID_ITEMS[geotagPosIndex >= 0 ? geotagPosIndex : 0]

  // 4. Profile Font
  const fontIndex = FONT_OPTIONS.findIndex(f => f.id === profile.fontFamily)
  const currentFont = FONT_OPTIONS[fontIndex >= 0 ? fontIndex : 0]

  // 5. Profile Weight
  const weightIndex = PROFILE_WEIGHTS_OPTIONS.findIndex(w => w.id === (profile.fontWeight || 'medium'))
  const currentWeight = PROFILE_WEIGHTS_OPTIONS[weightIndex >= 0 ? weightIndex : 1]

  // 6. Geotag Size
  const geotagSizeIndex = GEOTAG_SIZE_OPTIONS.findIndex(s => s.id === (geotagConfig.fontSize || 'medium'))
  const currentGeotagSize = GEOTAG_SIZE_OPTIONS[geotagSizeIndex >= 0 ? geotagSizeIndex : 1]

  // Handler stepper opsi [<] dan [>]
  const handlePrevStep = () => {
    if (activeInput === 'watermark_position') {
      const prev = (watermarkPosIndex - 1 + WATERMARK_GRID_ITEMS.length) % WATERMARK_GRID_ITEMS.length
      onChangeWatermark({ ...watermark, position: WATERMARK_GRID_ITEMS[prev].id as WatermarkPosition })
    } else if (activeInput === 'profile_position') {
      const prev = (profilePosIndex - 1 + PROFILE_GRID_ITEMS.length) % PROFILE_GRID_ITEMS.length
      onChangeProfile({ ...profile, position: PROFILE_GRID_ITEMS[prev].id as ProfilePosition })
    } else if (activeInput === 'geotag_position') {
      const prev = (geotagPosIndex - 1 + GEOTAG_GRID_ITEMS.length) % GEOTAG_GRID_ITEMS.length
      onChangeGeotagConfig({ ...geotagConfig, position: GEOTAG_GRID_ITEMS[prev].id as any })
    } else if (activeInput === 'profile_font') {
      const prev = (fontIndex - 1 + FONT_OPTIONS.length) % FONT_OPTIONS.length
      onChangeProfile({ ...profile, fontFamily: FONT_OPTIONS[prev].id })
    } else if (activeInput === 'profile_weight') {
      const prev = (weightIndex - 1 + PROFILE_WEIGHTS_OPTIONS.length) % PROFILE_WEIGHTS_OPTIONS.length
      onChangeProfile({ ...profile, fontWeight: PROFILE_WEIGHTS_OPTIONS[prev].id as ProfileFontWeight })
    } else if (activeInput === 'geotag_size') {
      const prev = (geotagSizeIndex - 1 + GEOTAG_SIZE_OPTIONS.length) % GEOTAG_SIZE_OPTIONS.length
      onChangeGeotagConfig({ ...geotagConfig, fontSize: GEOTAG_SIZE_OPTIONS[prev].id as any })
    } else if (activeInput === 'watermark_size') {
      onChangeWatermark({ ...watermark, sizePercent: Math.max(8, watermark.sizePercent - 2) })
    } else if (activeInput === 'watermark_opacity') {
      onChangeWatermark({ ...watermark, opacity: Math.max(0.15, Number((watermark.opacity - 0.05).toFixed(2))) })
    } else if (activeInput === 'profile_size') {
      onChangeProfile({ ...profile, fontSize: Math.max(10, (profile.fontSize || 13) - 1) })
    } else {
      handlePrevInput()
    }
  }

  const handleNextStep = () => {
    if (activeInput === 'watermark_position') {
      const next = (watermarkPosIndex + 1) % WATERMARK_GRID_ITEMS.length
      onChangeWatermark({ ...watermark, position: WATERMARK_GRID_ITEMS[next].id as WatermarkPosition })
    } else if (activeInput === 'profile_position') {
      const next = (profilePosIndex + 1) % PROFILE_GRID_ITEMS.length
      onChangeProfile({ ...profile, position: PROFILE_GRID_ITEMS[next].id as ProfilePosition })
    } else if (activeInput === 'geotag_position') {
      const next = (geotagPosIndex + 1) % GEOTAG_GRID_ITEMS.length
      onChangeGeotagConfig({ ...geotagConfig, position: GEOTAG_GRID_ITEMS[next].id as any })
    } else if (activeInput === 'profile_font') {
      const next = (fontIndex + 1) % FONT_OPTIONS.length
      onChangeProfile({ ...profile, fontFamily: FONT_OPTIONS[next].id })
    } else if (activeInput === 'profile_weight') {
      const next = (weightIndex + 1) % PROFILE_WEIGHTS_OPTIONS.length
      onChangeProfile({ ...profile, fontWeight: PROFILE_WEIGHTS_OPTIONS[next].id as ProfileFontWeight })
    } else if (activeInput === 'geotag_size') {
      const next = (geotagSizeIndex + 1) % GEOTAG_SIZE_OPTIONS.length
      onChangeGeotagConfig({ ...geotagConfig, fontSize: GEOTAG_SIZE_OPTIONS[next].id as any })
    } else if (activeInput === 'watermark_size') {
      onChangeWatermark({ ...watermark, sizePercent: Math.min(45, watermark.sizePercent + 2) })
    } else if (activeInput === 'watermark_opacity') {
      onChangeWatermark({ ...watermark, opacity: Math.min(1.0, Number((watermark.opacity + 0.05).toFixed(2))) })
    } else if (activeInput === 'profile_size') {
      onChangeProfile({ ...profile, fontSize: Math.min(22, (profile.fontSize || 13) + 1) })
    } else {
      handleNextInput()
    }
  }

  // Teks nomor urut pill di kanan atas header (misal "3 / 9")
  let badgeLeft = `${currentInputIndex + 1}`
  let badgeRight = `${sectionInputs.length}`

  if (activeInput === 'watermark_position') {
    badgeLeft = `${(watermarkPosIndex >= 0 ? watermarkPosIndex : 0) + 1}`
    badgeRight = `${WATERMARK_GRID_ITEMS.length}`
  } else if (activeInput === 'profile_position') {
    badgeLeft = `${(profilePosIndex >= 0 ? profilePosIndex : 0) + 1}`
    badgeRight = `${PROFILE_GRID_ITEMS.length}`
  } else if (activeInput === 'geotag_position') {
    badgeLeft = `${(geotagPosIndex >= 0 ? geotagPosIndex : 0) + 1}`
    badgeRight = `${GEOTAG_GRID_ITEMS.length}`
  } else if (activeInput === 'profile_font') {
    badgeLeft = `${(fontIndex >= 0 ? fontIndex : 0) + 1}`
    badgeRight = `${FONT_OPTIONS.length}`
  } else if (activeInput === 'profile_weight') {
    badgeLeft = `${(weightIndex >= 0 ? weightIndex : 0) + 1}`
    badgeRight = `${PROFILE_WEIGHTS_OPTIONS.length}`
  } else if (activeInput === 'geotag_size') {
    badgeLeft = `${(geotagSizeIndex >= 0 ? geotagSizeIndex : 0) + 1}`
    badgeRight = `${GEOTAG_SIZE_OPTIONS.length}`
  } else if (activeInput === 'watermark_size') {
    badgeLeft = `${watermark.sizePercent}%`
    badgeRight = 'maks 45%'
  } else if (activeInput === 'watermark_opacity') {
    badgeLeft = `${Math.round(watermark.opacity * 100)}%`
    badgeRight = '100%'
  } else if (activeInput === 'profile_size') {
    badgeLeft = `${profile.fontSize || 13}px`
    badgeRight = '22px'
  }

  return (
    <aside
      aria-label="Live Preview Controls"
      className="fixed bottom-4 left-3 right-3 sm:left-auto sm:right-6 sm:w-full sm:max-w-md z-[130] pointer-events-auto"
    >
      <div className="relative p-2.5 sm:p-3 rounded-2xl bg-[#090d16]/95 backdrop-blur-2xl border border-slate-700/60 shadow-[0_16px_48px_rgba(0,0,0,0.85)] text-white animate-in slide-in-from-bottom-3 duration-200">
        
        {/* ======================================================== */}
        {/* 1. Header: Dot Warna + Judul Input + Badge Nomor Urut */}
        {/* ======================================================== */}
        <div className="flex items-center justify-between px-1 pb-2">
          {/* Sisi Kiri: Dot Warna & Judul Input + Tombol Pindah Field */}
          <div className="flex items-center gap-2 min-w-0">
            <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${themeDotColor}`} />
            <span className="text-xs sm:text-sm font-semibold text-white tracking-wide truncate">
              {currentMeta.title}
            </span>
            {/* Navigasi ganti field input dalam section */}
            {sectionInputs.length > 1 && (
              <div className="flex items-center bg-slate-800/60 rounded-md border border-slate-700/40 ml-1">
                <button
                  type="button"
                  onClick={handlePrevInput}
                  className="p-0.5 hover:bg-slate-700 text-slate-400 hover:text-white rounded-l transition-colors"
                  title="Field input sebelumnya"
                >
                  <ChevronUp className="w-3 h-3" />
                </button>
                <button
                  type="button"
                  onClick={handleNextInput}
                  className="p-0.5 hover:bg-slate-700 text-slate-400 hover:text-white rounded-r transition-colors"
                  title="Field input berikutnya"
                >
                  <ChevronDown className="w-3 h-3" />
                </button>
              </div>
            )}
          </div>

          {/* Sisi Kanan: Pill Badge Urutan "3 / 9" */}
          <div className="shrink-0 px-2.5 py-0.5 rounded-full bg-slate-900/90 border border-slate-700/60 flex items-center gap-1 text-[11px] font-mono shadow-inner">
            <span className={`font-bold ${themeTextColor}`}>{badgeLeft}</span>
            <span className="text-slate-400">/</span>
            <span className="text-slate-400">{badgeRight}</span>
          </div>
        </div>

        {/* ======================================================== */}
        {/* 2. Baris Kontrol Utama: [ < ] [ Selector ] [ > ]  [ ✕ ]  */}
        {/* ======================================================== */}
        <div className="flex items-center gap-2">
          {/* Kapsul Kontrol Terpadu [ < ] [ Isi / Dropdown ] [ > ] */}
          <div className="flex-1 min-w-0 flex items-stretch bg-slate-900/80 border border-slate-800/90 rounded-xl p-1 gap-1 shadow-inner">
            
            {/* Tombol Panah Kiri [<] */}
            <button
              type="button"
              onClick={handlePrevStep}
              className="px-2.5 sm:px-3 py-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/80 active:scale-95 transition-all flex items-center justify-center shrink-0 cursor-pointer"
              title="Pilihan Sebelumnya"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {/* Bagian Tengah: Selector Dropdown atau Input Slider / Teks */}
            <div className="flex-1 min-w-0 flex items-center">
              {/* A. Dropdown Posisi Watermark */}
              {activeInput === 'watermark_position' && (
                <button
                  type="button"
                  onClick={() => setIsPopupOpen(!isPopupOpen)}
                  className="w-full h-full px-3 py-1.5 rounded-lg bg-slate-800/70 hover:bg-slate-800 border border-slate-700/50 hover:border-slate-600 active:scale-[0.99] transition-all flex items-center justify-between gap-2 cursor-pointer text-white"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="text-cyan-400 shrink-0">{currentWatermarkItem.icon}</span>
                    <span className="text-xs sm:text-sm font-semibold truncate">
                      {currentWatermarkItem.fullLabel}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-400 shrink-0">
                    <GridNineDots className="w-3.5 h-3.5" />
                    <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isPopupOpen ? 'rotate-180' : ''}`} />
                  </div>
                </button>
              )}

              {/* B. Dropdown Posisi Profil */}
              {activeInput === 'profile_position' && (
                <button
                  type="button"
                  onClick={() => setIsPopupOpen(!isPopupOpen)}
                  className="w-full h-full px-3 py-1.5 rounded-lg bg-slate-800/70 hover:bg-slate-800 border border-slate-700/50 hover:border-slate-600 active:scale-[0.99] transition-all flex items-center justify-between gap-2 cursor-pointer text-white"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="text-emerald-400 shrink-0">{currentProfilePosItem.icon}</span>
                    <span className="text-xs sm:text-sm font-semibold truncate">
                      {currentProfilePosItem.fullLabel}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-400 shrink-0">
                    <GridNineDots className="w-3.5 h-3.5" />
                    <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isPopupOpen ? 'rotate-180' : ''}`} />
                  </div>
                </button>
              )}

              {/* C. Dropdown Posisi Geotag */}
              {activeInput === 'geotag_position' && (
                <button
                  type="button"
                  onClick={() => setIsPopupOpen(!isPopupOpen)}
                  className="w-full h-full px-3 py-1.5 rounded-lg bg-slate-800/70 hover:bg-slate-800 border border-slate-700/50 hover:border-slate-600 active:scale-[0.99] transition-all flex items-center justify-between gap-2 cursor-pointer text-white"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="text-amber-400 shrink-0">{currentGeotagPosItem.icon}</span>
                    <span className="text-xs sm:text-sm font-semibold truncate">
                      {currentGeotagPosItem.fullLabel}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-400 shrink-0">
                    <GridNineDots className="w-3.5 h-3.5" />
                    <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isPopupOpen ? 'rotate-180' : ''}`} />
                  </div>
                </button>
              )}

              {/* D. Dropdown Font Profil */}
              {activeInput === 'profile_font' && (
                <button
                  type="button"
                  onClick={() => setIsPopupOpen(!isPopupOpen)}
                  className="w-full h-full px-3 py-1.5 rounded-lg bg-slate-800/70 hover:bg-slate-800 border border-slate-700/50 hover:border-slate-600 active:scale-[0.99] transition-all flex items-center justify-between gap-2 cursor-pointer text-white"
                >
                  <span className="text-xs sm:text-sm font-semibold truncate" style={{ fontFamily: currentFont.fontStyle }}>
                    {currentFont.label}
                  </span>
                  <ChevronDown className={`w-3.5 h-3.5 text-slate-400 shrink-0 transition-transform ${isPopupOpen ? 'rotate-180' : ''}`} />
                </button>
              )}

              {/* E. Dropdown Ketebalan Teks Profil */}
              {activeInput === 'profile_weight' && (
                <button
                  type="button"
                  onClick={() => setIsPopupOpen(!isPopupOpen)}
                  className="w-full h-full px-3 py-1.5 rounded-lg bg-slate-800/70 hover:bg-slate-800 border border-slate-700/50 hover:border-slate-600 active:scale-[0.99] transition-all flex items-center justify-between gap-2 cursor-pointer text-white"
                >
                  <span className="text-xs sm:text-sm font-semibold truncate">
                    {currentWeight.label}
                  </span>
                  <ChevronDown className={`w-3.5 h-3.5 text-slate-400 shrink-0 transition-transform ${isPopupOpen ? 'rotate-180' : ''}`} />
                </button>
              )}

              {/* F. Dropdown Ukuran Tulisan Geotag */}
              {activeInput === 'geotag_size' && (
                <button
                  type="button"
                  onClick={() => setIsPopupOpen(!isPopupOpen)}
                  className="w-full h-full px-3 py-1.5 rounded-lg bg-slate-800/70 hover:bg-slate-800 border border-slate-700/50 hover:border-slate-600 active:scale-[0.99] transition-all flex items-center justify-between gap-2 cursor-pointer text-white"
                >
                  <span className="text-xs sm:text-sm font-semibold truncate">
                    {currentGeotagSize.label}
                  </span>
                  <ChevronDown className={`w-3.5 h-3.5 text-slate-400 shrink-0 transition-transform ${isPopupOpen ? 'rotate-180' : ''}`} />
                </button>
              )}

              {/* G. Input Teks: Jabatan Profil */}
              {activeInput === 'profile_job' && (
                <input
                  type="text"
                  value={profile.jobTitle}
                  onChange={e => onChangeProfile({ ...profile, jobTitle: e.target.value })}
                  placeholder="Ketik Jabatan..."
                  className="w-full h-full px-3 py-1.5 bg-slate-800/60 rounded-lg text-xs sm:text-sm text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:ring-1 focus:ring-emerald-400/50 border border-transparent"
                />
              )}

              {/* H. Input Teks: Nama Lengkap Profil */}
              {activeInput === 'profile_name' && (
                <input
                  type="text"
                  value={profile.name}
                  onChange={e => onChangeProfile({ ...profile, name: e.target.value })}
                  placeholder="Ketik Nama Lengkap..."
                  className="w-full h-full px-3 py-1.5 bg-slate-800/60 rounded-lg text-xs sm:text-sm text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:ring-1 focus:ring-emerald-400/50 border border-transparent"
                />
              )}

              {/* I. Slider: Ukuran Watermark */}
              {activeInput === 'watermark_size' && (
                <div className="w-full px-2 py-0.5 flex flex-col justify-center">
                  <div className="flex justify-between items-center text-[10px] mb-0.5">
                    <span className="text-slate-400">Skala</span>
                    <span className="font-mono text-cyan-400 font-bold">{watermark.sizePercent}%</span>
                  </div>
                  <input
                    type="range"
                    min={8}
                    max={45}
                    value={watermark.sizePercent}
                    onChange={e => onChangeWatermark({ ...watermark, sizePercent: Number(e.target.value) })}
                    className="w-full accent-cyan-400 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                  />
                </div>
              )}

              {/* J. Slider: Transparansi Watermark */}
              {activeInput === 'watermark_opacity' && (
                <div className="w-full px-2 py-0.5 flex flex-col justify-center">
                  <div className="flex justify-between items-center text-[10px] mb-0.5">
                    <span className="text-slate-400">Kepekatan</span>
                    <span className="font-mono text-cyan-400 font-bold">{Math.round(watermark.opacity * 100)}%</span>
                  </div>
                  <input
                    type="range"
                    min={0.15}
                    max={1.0}
                    step={0.05}
                    value={watermark.opacity}
                    onChange={e => onChangeWatermark({ ...watermark, opacity: Number(e.target.value) })}
                    className="w-full accent-cyan-400 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                  />
                </div>
              )}

              {/* K. Slider: Ukuran Teks Profil */}
              {activeInput === 'profile_size' && (
                <div className="w-full px-2 py-0.5 flex flex-col justify-center">
                  <div className="flex justify-between items-center text-[10px] mb-0.5">
                    <span className="text-slate-400">Ukuran Font</span>
                    <span className="font-mono text-emerald-400 font-bold">{profile.fontSize || 13} px</span>
                  </div>
                  <input
                    type="range"
                    min={10}
                    max={22}
                    value={profile.fontSize || 13}
                    onChange={e => onChangeProfile({ ...profile, fontSize: Number(e.target.value) })}
                    className="w-full accent-emerald-400 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                  />
                </div>
              )}
            </div>

            {/* Tombol Panah Kanan [>] */}
            <button
              type="button"
              onClick={handleNextStep}
              className="px-2.5 sm:px-3 py-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/80 active:scale-95 transition-all flex items-center justify-center shrink-0 cursor-pointer"
              title="Pilihan Selanjutnya"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Tombol Tutup Mandiri [ ✕ ] */}
          <button
            type="button"
            onClick={onClose}
            className="shrink-0 p-2.5 sm:px-3 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-800/90 active:scale-95 transition-all flex items-center justify-center cursor-pointer text-slate-400 hover:text-rose-400"
            title="Tutup Mode Preview"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* ======================================================== */}
        {/* 3. Pop-up Kustom Dropdown (Visual Grid Selector / List)  */}
        {/* ======================================================== */}
        {/* Popup Watermark Position (3x3 Visual Grid + 9 List Items) */}
        {activeInput === 'watermark_position' && (
          <PositionGridPopup
            isOpen={isPopupOpen}
            onClose={() => setIsPopupOpen(false)}
            selectedId={watermark.position}
            onSelect={id => onChangeWatermark({ ...watermark, position: id as WatermarkPosition })}
            theme="cyan"
            items={WATERMARK_GRID_ITEMS}
            showGridSelector={true}
          />
        )}

        {/* Popup Profile Position (Visual Grid / List Items) */}
        {activeInput === 'profile_position' && (
          <PositionGridPopup
            isOpen={isPopupOpen}
            onClose={() => setIsPopupOpen(false)}
            selectedId={profile.position || 'above-geotag'}
            onSelect={id => onChangeProfile({ ...profile, position: id as ProfilePosition })}
            theme="emerald"
            items={PROFILE_GRID_ITEMS}
            showGridSelector={true}
          />
        )}

        {/* Popup Geotag Position */}
        {activeInput === 'geotag_position' && (
          <PositionGridPopup
            isOpen={isPopupOpen}
            onClose={() => setIsPopupOpen(false)}
            selectedId={geotagConfig.position}
            onSelect={id => onChangeGeotagConfig({ ...geotagConfig, position: id as any })}
            theme="amber"
            items={GEOTAG_GRID_ITEMS}
            showGridSelector={true}
          />
        )}

        {/* Popup Profile Font */}
        {activeInput === 'profile_font' && (
          <CustomOptionListPopup
            isOpen={isPopupOpen}
            onClose={() => setIsPopupOpen(false)}
            selectedId={profile.fontFamily}
            onSelect={id => onChangeProfile({ ...profile, fontFamily: id })}
            title="PILIH JENIS FONT PROFIL"
            theme="emerald"
            items={FONT_OPTIONS.map(f => ({
              id: f.id,
              label: f.label,
              stylePreview: { fontFamily: f.fontStyle },
            }))}
          />
        )}

        {/* Popup Profile Weight */}
        {activeInput === 'profile_weight' && (
          <CustomOptionListPopup
            isOpen={isPopupOpen}
            onClose={() => setIsPopupOpen(false)}
            selectedId={profile.fontWeight || 'medium'}
            onSelect={id => onChangeProfile({ ...profile, fontWeight: id as ProfileFontWeight })}
            title="PILIH KETEBALAN TEKS"
            theme="emerald"
            items={PROFILE_WEIGHTS_OPTIONS}
          />
        )}

        {/* Popup Geotag Size */}
        {activeInput === 'geotag_size' && (
          <CustomOptionListPopup
            isOpen={isPopupOpen}
            onClose={() => setIsPopupOpen(false)}
            selectedId={geotagConfig.fontSize || 'medium'}
            onSelect={id => onChangeGeotagConfig({ ...geotagConfig, fontSize: id as any })}
            title="PILIH UKURAN TEKS GEOTAG"
            theme="amber"
            items={GEOTAG_SIZE_OPTIONS}
          />
        )}
      </div>
    </aside>
  )
}
