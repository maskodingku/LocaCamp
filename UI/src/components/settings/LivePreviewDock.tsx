import React, { useState } from 'react'
import { X, ChevronLeft, ChevronRight, ChevronDown } from 'lucide-react'
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
  { id: 'profile_job', section: 'profile', title: 'Jabatan Profil', type: 'text' },
  { id: 'profile_name', section: 'profile', title: 'Nama Lengkap', type: 'text' },
  { id: 'profile_font', section: 'profile', title: 'Font Profil', type: 'dropdown' },
  { id: 'profile_position', section: 'profile', title: 'Posisi Profil', type: 'dropdown' },
  { id: 'profile_weight', section: 'profile', title: 'Tebal Teks', type: 'dropdown' },
  { id: 'profile_size', section: 'profile', title: 'Ukuran Teks', type: 'slider' },

  // Section: Watermark Logo
  { id: 'watermark_position', section: 'watermark', title: 'Posisi Watermark', type: 'dropdown' },
  { id: 'watermark_size', section: 'watermark', title: 'Ukuran Watermark', type: 'slider' },
  { id: 'watermark_opacity', section: 'watermark', title: 'Transparansi Logo', type: 'slider' },

  // Section: Geotag
  { id: 'geotag_position', section: 'geotag', title: 'Posisi Geotag', type: 'dropdown' },
  { id: 'geotag_size', section: 'geotag', title: 'Ukuran Geotag', type: 'dropdown' },
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

// =========================================================================
// GLOSSY 3D GLASS ICONS
// =========================================================================

// Tetesan Air Glossy Watermark 3D
const GlossyDropletIcon: React.FC<{ className?: string }> = ({ className = 'w-5 h-5' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none">
    <defs>
      <linearGradient id="dropletGradient" x1="12" y1="2" x2="12" y2="22" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#38bdf8" />
        <stop offset="55%" stopColor="#06b6d4" />
        <stop offset="100%" stopColor="#0284c7" />
      </linearGradient>
      <linearGradient id="dropletSpecular" x1="8" y1="7" x2="11" y2="15" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#ffffff" stopOpacity="0.9" />
        <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
      </linearGradient>
    </defs>
    <path
      d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"
      fill="url(#dropletGradient)"
      filter="drop-shadow(0 0 6px rgba(6,182,212,0.8))"
    />
    <ellipse cx="9.5" cy="11.5" rx="2" ry="4.5" transform="rotate(-28 9.5 11.5)" fill="url(#dropletSpecular)" />
  </svg>
)

// Avatar Profil Glossy 3D
const GlossyUserIcon: React.FC<{ className?: string }> = ({ className = 'w-5 h-5' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none">
    <path
      d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"
      stroke="#38bdf8"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      filter="drop-shadow(0 0 5px rgba(56,189,248,0.8))"
    />
    <circle
      cx="12"
      cy="7"
      r="4"
      stroke="#38bdf8"
      strokeWidth="2.5"
      filter="drop-shadow(0 0 5px rgba(56,189,248,0.8))"
    />
  </svg>
)

// MapPin Geotag Glossy 3D
const GlossyMapPinIcon: React.FC<{ className?: string }> = ({ className = 'w-5 h-5' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none">
    <path
      d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"
      stroke="#38bdf8"
      strokeWidth="2.5"
      filter="drop-shadow(0 0 5px rgba(56,189,248,0.8))"
    />
    <circle
      cx="12"
      cy="10"
      r="3"
      fill="#38bdf8"
      filter="drop-shadow(0 0 5px rgba(56,189,248,0.8))"
    />
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

  // Tombol panah [<] dan [>] untuk berpindah ke input sebelum/selanjutnya di dalam section
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

  // --- Opsi Pilihan Dropdown Saat Ini ---
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

  // Membagi judul menjadi dua kata untuk tipografi dual-tone (misal: "Posisi" dan "Watermark")
  const titleParts = currentMeta.title.split(' ')
  const titleFirst = titleParts[0]
  const titleRest = titleParts.slice(1).join(' ')

  return (
    <aside
      aria-label="Live Preview Controls"
      className="fixed bottom-3 left-3 right-3 sm:left-auto sm:right-6 sm:w-full sm:max-w-[390px] z-[130] pointer-events-auto select-none"
    >
      <div className="relative w-full">
        {/* ========================================================================= */}
        {/* POPUP CUSTOM: DI LUAR CONTAINER OVERFLOW-HIDDEN AGAR MENGAMBANG SEMPURNA  */}
        {/* ========================================================================= */}
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

        {activeInput === 'profile_position' && (
          <PositionGridPopup
            isOpen={isPopupOpen}
            onClose={() => setIsPopupOpen(false)}
            selectedId={profile.position || 'above-geotag'}
            onSelect={id => onChangeProfile({ ...profile, position: id as ProfilePosition })}
            theme="cyan"
            items={PROFILE_GRID_ITEMS}
            showGridSelector={true}
          />
        )}

        {activeInput === 'geotag_position' && (
          <PositionGridPopup
            isOpen={isPopupOpen}
            onClose={() => setIsPopupOpen(false)}
            selectedId={geotagConfig.position}
            onSelect={id => onChangeGeotagConfig({ ...geotagConfig, position: id as any })}
            theme="cyan"
            items={GEOTAG_GRID_ITEMS}
            showGridSelector={true}
          />
        )}

        {activeInput === 'profile_font' && (
          <CustomOptionListPopup
            isOpen={isPopupOpen}
            onClose={() => setIsPopupOpen(false)}
            selectedId={profile.fontFamily}
            onSelect={id => onChangeProfile({ ...profile, fontFamily: id })}
            title="PILIH JENIS FONT PROFIL"
            theme="cyan"
            items={FONT_OPTIONS.map(f => ({
              id: f.id,
              label: f.label,
              stylePreview: { fontFamily: f.fontStyle },
            }))}
          />
        )}

        {activeInput === 'profile_weight' && (
          <CustomOptionListPopup
            isOpen={isPopupOpen}
            onClose={() => setIsPopupOpen(false)}
            selectedId={profile.fontWeight || 'medium'}
            onSelect={id => onChangeProfile({ ...profile, fontWeight: id as ProfileFontWeight })}
            title="PILIH KETEBALAN TEKS"
            theme="cyan"
            items={PROFILE_WEIGHTS_OPTIONS}
          />
        )}

        {activeInput === 'geotag_size' && (
          <CustomOptionListPopup
            isOpen={isPopupOpen}
            onClose={() => setIsPopupOpen(false)}
            selectedId={geotagConfig.fontSize || 'medium'}
            onSelect={id => onChangeGeotagConfig({ ...geotagConfig, fontSize: id as any })}
            title="PILIH UKURAN TEKS GEOTAG"
            theme="cyan"
            items={GEOTAG_SIZE_OPTIONS}
          />
        )}

        {/* ========================================================================= */}
        {/* AMBIENT GLOSSY GLASS BUBBLE ORBS (LATAR BELAKANG BOLA KACA SINEMATIK MINI)*/}
        {/* ========================================================================= */}
        <div className="absolute -top-5 -left-5 w-14 h-14 rounded-full bg-gradient-to-br from-cyan-400/25 via-blue-500/10 to-transparent border border-cyan-400/30 blur-[0.5px] shadow-[inset_0_2px_4px_rgba(255,255,255,0.7),0_0_20px_rgba(6,182,212,0.35)] pointer-events-none" />
        <div className="absolute -top-8 -right-6 w-20 h-20 rounded-full bg-gradient-to-br from-sky-400/20 via-blue-600/10 to-transparent border border-cyan-400/25 blur-[0.5px] shadow-[inset_0_2px_5px_rgba(255,255,255,0.65),0_0_25px_rgba(14,165,233,0.3)] pointer-events-none" />
        <div className="absolute -bottom-5 -left-4 w-12 h-12 rounded-full bg-gradient-to-br from-cyan-500/20 to-transparent border border-cyan-400/25 blur-[0.5px] shadow-[inset_0_2px_3px_rgba(255,255,255,0.6),0_0_15px_rgba(6,182,212,0.25)] pointer-events-none" />
        <div className="absolute -bottom-6 -right-5 w-16 h-16 rounded-full bg-gradient-to-br from-blue-500/25 to-transparent border border-cyan-400/30 blur-[0.5px] shadow-[inset_0_2px_4px_rgba(255,255,255,0.7),0_0_22px_rgba(59,130,246,0.35)] pointer-events-none" />

        {/* ========================================================================= */}
        {/* LEMPENGAN UTAMA: BLACK GLASS HUD MINI WITH NEON CYAN RIM LIGHTING */}
        {/* ========================================================================= */}
        <div className="relative rounded-[22px] p-2 sm:p-2.5 bg-[#020717]/85 backdrop-blur-2xl border border-cyan-400/50 shadow-[0_0_30px_rgba(6,182,212,0.35),0_15px_40px_rgba(0,0,0,0.85),inset_0_1.5px_2px_rgba(255,255,255,0.7)] text-white animate-in slide-in-from-bottom-2 duration-200 overflow-hidden">
          
          {/* Specular Glare Highlight Border Atas Kaca */}
          <div className="absolute top-0 left-8 right-8 h-[1px] bg-gradient-to-r from-transparent via-cyan-100/90 to-transparent pointer-events-none" />
          
          {/* Optic Lens Flare Glow Spots di Pinggiran Frame */}
          <div className="absolute top-1.5 left-5 w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_6px_#fff,0_0_14px_#22d3ee] pointer-events-none" />
          <div className="absolute top-1.5 right-5 w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_6px_#fff,0_0_14px_#22d3ee] pointer-events-none" />
          
          {/* ========================================================================= */}
          {/* 1. HEADER: GLOSSY GLASS BUBBLE ORB MINI + JUDUL SELARAS + PILL BADGE     */}
          {/* ========================================================================= */}
          <div className="flex items-center justify-between px-1 pb-1.5">
            {/* Kiri: Glass Bubble Orb Icon Mini + Divider + Judul Teks */}
            <div className="flex items-center gap-2 min-w-0">
              {/* Glossy Glass Bubble Orb Mini (Selaras dengan Judul) */}
              <div className="w-7 h-7 sm:w-7.5 sm:h-7.5 rounded-full bg-gradient-to-b from-[#092244]/90 to-[#020914]/95 border border-cyan-400/80 shadow-[0_0_12px_rgba(6,182,212,0.6),inset_0_1.5px_3px_rgba(255,255,255,0.8),inset_0_-1.5px_3px_rgba(0,0,0,0.8)] flex items-center justify-center shrink-0 relative overflow-hidden">
                {/* Highlight lengkung atas orb */}
                <div className="absolute top-0.5 inset-x-1.5 h-1.5 rounded-full bg-white/40 blur-[0.5px]" />
                {currentMeta.section === 'watermark' && <GlossyDropletIcon className="w-4 h-4 drop-shadow-[0_0_6px_rgba(6,182,212,0.8)]" />}
                {currentMeta.section === 'profile' && <GlossyUserIcon className="w-4 h-4 drop-shadow-[0_0_6px_rgba(56,189,248,0.8)]" />}
                {currentMeta.section === 'geotag' && <GlossyMapPinIcon className="w-4 h-4 drop-shadow-[0_0_6px_rgba(56,189,248,0.8)]" />}
              </div>

              {/* Pembatas Garis Vertikal Tipis */}
              <div className="h-3.5 w-[1px] bg-cyan-400/30 shrink-0" />

              {/* Teks Judul Dua Nada Selaras */}
              <div className="flex items-center gap-1 min-w-0">
                <span className="text-slate-300 text-xs font-normal tracking-wide">
                  {titleFirst}
                </span>
                <span className="text-white text-xs font-bold tracking-wide truncate drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
                  {titleRest}
                </span>
              </div>
            </div>

            {/* Kanan: Pill Badge Urutan Input Mini (contoh "1 / 3") */}
            <div className="shrink-0 px-2.5 py-0.5 rounded-full bg-[#030917]/80 border border-cyan-500/40 shadow-[inset_0_1px_1px_rgba(255,255,255,0.3),0_0_8px_rgba(6,182,212,0.2)] flex items-center gap-1 font-mono text-[10px]">
              <span className="text-cyan-400 font-bold drop-shadow-[0_0_6px_rgba(6,182,212,0.8)]">
                {currentInputIndex + 1}
              </span>
              <span className="text-slate-400">/</span>
              <span className="text-slate-300">{sectionInputs.length}</span>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* 2. BARIS KONTROL MINI: [ < ] [ SELECTOR (ELECTRIC BLUE) ] [ > ] [ ✕ ]   */}
          {/* ========================================================================= */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            
            {/* Tombol Back [<] Mini */}
            <button
              type="button"
              onClick={handlePrevInput}
              className="w-9 h-9 sm:w-9.5 sm:h-9.5 rounded-full sm:rounded-xl bg-gradient-to-b from-[#0b1b36]/80 to-[#030814]/95 border border-cyan-500/50 hover:border-cyan-400 shadow-[inset_0_1px_1.5px_rgba(255,255,255,0.5),0_0_10px_rgba(6,182,212,0.25)] flex items-center justify-center cursor-pointer active:scale-95 transition-all text-cyan-200 hover:text-white shrink-0 relative overflow-hidden group"
              title="Input Sebelumnya"
            >
              <div className="absolute top-0 inset-x-1.5 h-1.5 rounded-full bg-white/30 blur-[0.5px]" />
              <ChevronLeft className="w-4 h-4 stroke-[2.5] group-hover:-translate-x-0.5 transition-transform drop-shadow-[0_0_4px_rgba(34,211,238,0.6)]" />
            </button>

            {/* Tombol Tengah Mini: Dropdown Selector / Range Slider / Input Teks */}
            <div className="flex-1 min-w-0">
              {/* A. Dropdown Posisi Watermark Mini */}
              {activeInput === 'watermark_position' && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    setIsPopupOpen(prev => !prev)
                  }}
                  className="w-full h-9 sm:h-9.5 rounded-full bg-gradient-to-r from-[#03152e]/95 via-[#062854]/90 to-[#03152e]/95 border-2 border-cyan-400 shadow-[0_0_18px_rgba(6,182,212,0.6),inset_0_1px_2px_rgba(255,255,255,0.8),inset_0_-1.5px_3px_rgba(0,0,0,0.8)] px-2.5 flex items-center justify-between cursor-pointer active:scale-[0.99] transition-all relative overflow-hidden group"
                >
                  <div className="absolute top-0 inset-x-5 h-[1px] bg-white/80 shadow-[0_0_6px_#fff]" />
                  <div className="absolute -top-1 left-4 w-1.5 h-1.5 rounded-full bg-cyan-300 shadow-[0_0_8px_#22d3ee,0_0_3px_#fff] pointer-events-none" />
                  <div className="absolute -bottom-1 right-8 w-1.5 h-1.5 rounded-full bg-cyan-300 shadow-[0_0_8px_#22d3ee,0_0_3px_#fff] pointer-events-none" />

                  {/* Sisi Kiri: Kotak Rounded Icon + Divider + Label */}
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="w-6 h-6 rounded-md bg-gradient-to-br from-cyan-400 via-sky-500 to-blue-600 p-[1px] shadow-[0_0_8px_rgba(6,182,212,0.6)] flex items-center justify-center shrink-0">
                      <span className="text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)] [&>svg]:w-3.5 [&>svg]:h-3.5">
                        {currentWatermarkItem.icon}
                      </span>
                    </div>
                    <div className="h-3.5 w-[1px] bg-cyan-400/35 shrink-0" />
                    <span className="text-white font-semibold text-xs tracking-wide truncate drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
                      {currentWatermarkItem.fullLabel}
                    </span>
                  </div>

                  {/* Sisi Kanan: Chevron Down */}
                  <ChevronDown className={`w-4 h-4 text-cyan-400 stroke-[3] shrink-0 transition-transform drop-shadow-[0_0_5px_rgba(6,182,212,0.8)] ${isPopupOpen ? 'rotate-180' : ''}`} />
                </button>
              )}

              {/* B. Dropdown Posisi Profil Mini */}
              {activeInput === 'profile_position' && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    setIsPopupOpen(prev => !prev)
                  }}
                  className="w-full h-9 sm:h-9.5 rounded-full bg-gradient-to-r from-[#03152e]/95 via-[#062854]/90 to-[#03152e]/95 border-2 border-cyan-400 shadow-[0_0_18px_rgba(6,182,212,0.6),inset_0_1px_2px_rgba(255,255,255,0.8),inset_0_-1.5px_3px_rgba(0,0,0,0.8)] px-2.5 flex items-center justify-between cursor-pointer active:scale-[0.99] transition-all relative overflow-hidden group"
                >
                  <div className="absolute top-0 inset-x-5 h-[1px] bg-white/80 shadow-[0_0_6px_#fff]" />
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="w-6 h-6 rounded-md bg-gradient-to-br from-cyan-400 via-sky-500 to-blue-600 p-[1px] shadow-[0_0_8px_rgba(6,182,212,0.6)] flex items-center justify-center shrink-0">
                      <span className="text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)] [&>svg]:w-3.5 [&>svg]:h-3.5">
                        {currentProfilePosItem.icon}
                      </span>
                    </div>
                    <div className="h-3.5 w-[1px] bg-cyan-400/35 shrink-0" />
                    <span className="text-white font-semibold text-xs tracking-wide truncate drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
                      {currentProfilePosItem.fullLabel}
                    </span>
                  </div>
                  <ChevronDown className={`w-4 h-4 text-cyan-400 stroke-[3] shrink-0 transition-transform drop-shadow-[0_0_5px_rgba(6,182,212,0.8)] ${isPopupOpen ? 'rotate-180' : ''}`} />
                </button>
              )}

              {/* C. Dropdown Posisi Geotag Mini */}
              {activeInput === 'geotag_position' && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    setIsPopupOpen(prev => !prev)
                  }}
                  className="w-full h-9 sm:h-9.5 rounded-full bg-gradient-to-r from-[#03152e]/95 via-[#062854]/90 to-[#03152e]/95 border-2 border-cyan-400 shadow-[0_0_18px_rgba(6,182,212,0.6),inset_0_1px_2px_rgba(255,255,255,0.8),inset_0_-1.5px_3px_rgba(0,0,0,0.8)] px-2.5 flex items-center justify-between cursor-pointer active:scale-[0.99] transition-all relative overflow-hidden group"
                >
                  <div className="absolute top-0 inset-x-5 h-[1px] bg-white/80 shadow-[0_0_6px_#fff]" />
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="w-6 h-6 rounded-md bg-gradient-to-br from-cyan-400 via-sky-500 to-blue-600 p-[1px] shadow-[0_0_8px_rgba(6,182,212,0.6)] flex items-center justify-center shrink-0">
                      <span className="text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)] [&>svg]:w-3.5 [&>svg]:h-3.5">
                        {currentGeotagPosItem.icon}
                      </span>
                    </div>
                    <div className="h-3.5 w-[1px] bg-cyan-400/35 shrink-0" />
                    <span className="text-white font-semibold text-xs tracking-wide truncate drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
                      {currentGeotagPosItem.fullLabel}
                    </span>
                  </div>
                  <ChevronDown className={`w-4 h-4 text-cyan-400 stroke-[3] shrink-0 transition-transform drop-shadow-[0_0_5px_rgba(6,182,212,0.8)] ${isPopupOpen ? 'rotate-180' : ''}`} />
                </button>
              )}

              {/* D. Dropdown Font Profil Mini */}
              {activeInput === 'profile_font' && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    setIsPopupOpen(prev => !prev)
                  }}
                  className="w-full h-9 sm:h-9.5 rounded-full bg-gradient-to-r from-[#03152e]/95 via-[#062854]/90 to-[#03152e]/95 border-2 border-cyan-400 shadow-[0_0_18px_rgba(6,182,212,0.6),inset_0_1px_2px_rgba(255,255,255,0.8),inset_0_-1.5px_3px_rgba(0,0,0,0.8)] px-3.5 flex items-center justify-between cursor-pointer active:scale-[0.99] transition-all relative overflow-hidden group"
                >
                  <div className="absolute top-0 inset-x-5 h-[1px] bg-white/80 shadow-[0_0_6px_#fff]" />
                  <span className="text-white font-semibold text-xs tracking-wide truncate drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]" style={{ fontFamily: currentFont.fontStyle }}>
                    {currentFont.label}
                  </span>
                  <ChevronDown className={`w-4 h-4 text-cyan-400 stroke-[3] shrink-0 transition-transform drop-shadow-[0_0_5px_rgba(6,182,212,0.8)] ${isPopupOpen ? 'rotate-180' : ''}`} />
                </button>
              )}

              {/* E. Dropdown Ketebalan Teks Profil Mini */}
              {activeInput === 'profile_weight' && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    setIsPopupOpen(prev => !prev)
                  }}
                  className="w-full h-9 sm:h-9.5 rounded-full bg-gradient-to-r from-[#03152e]/95 via-[#062854]/90 to-[#03152e]/95 border-2 border-cyan-400 shadow-[0_0_18px_rgba(6,182,212,0.6),inset_0_1px_2px_rgba(255,255,255,0.8),inset_0_-1.5px_3px_rgba(0,0,0,0.8)] px-3.5 flex items-center justify-between cursor-pointer active:scale-[0.99] transition-all relative overflow-hidden group"
                >
                  <div className="absolute top-0 inset-x-5 h-[1px] bg-white/80 shadow-[0_0_6px_#fff]" />
                  <span className="text-white font-semibold text-xs tracking-wide truncate drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
                    {currentWeight.label}
                  </span>
                  <ChevronDown className={`w-4 h-4 text-cyan-400 stroke-[3] shrink-0 transition-transform drop-shadow-[0_0_5px_rgba(6,182,212,0.8)] ${isPopupOpen ? 'rotate-180' : ''}`} />
                </button>
              )}

              {/* F. Dropdown Ukuran Tulisan Geotag Mini */}
              {activeInput === 'geotag_size' && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    setIsPopupOpen(prev => !prev)
                  }}
                  className="w-full h-9 sm:h-9.5 rounded-full bg-gradient-to-r from-[#03152e]/95 via-[#062854]/90 to-[#03152e]/95 border-2 border-cyan-400 shadow-[0_0_18px_rgba(6,182,212,0.6),inset_0_1px_2px_rgba(255,255,255,0.8),inset_0_-1.5px_3px_rgba(0,0,0,0.8)] px-3.5 flex items-center justify-between cursor-pointer active:scale-[0.99] transition-all relative overflow-hidden group"
                >
                  <div className="absolute top-0 inset-x-5 h-[1px] bg-white/80 shadow-[0_0_6px_#fff]" />
                  <span className="text-white font-semibold text-xs tracking-wide truncate drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
                    {currentGeotagSize.label}
                  </span>
                  <ChevronDown className={`w-4 h-4 text-cyan-400 stroke-[3] shrink-0 transition-transform drop-shadow-[0_0_5px_rgba(6,182,212,0.8)] ${isPopupOpen ? 'rotate-180' : ''}`} />
                </button>
              )}

              {/* G. Slider: Ukuran Watermark Mini */}
              {activeInput === 'watermark_size' && (
                <div className="relative w-full h-9 sm:h-9.5 rounded-full bg-gradient-to-r from-[#03152e]/95 via-[#062854]/90 to-[#03152e]/95 border-2 border-cyan-400 shadow-[0_0_18px_rgba(6,182,212,0.6),inset_0_1px_2px_rgba(255,255,255,0.8),inset_0_-1.5px_3px_rgba(0,0,0,0.8)] px-3.5 flex items-center gap-2.5 overflow-hidden">
                  <div className="absolute top-0 inset-x-5 h-[1px] bg-white/80 shadow-[0_0_6px_#fff] pointer-events-none" />
                  <div className="flex-1 min-w-0 flex items-center">
                    <input
                      type="range"
                      min={8}
                      max={45}
                      value={watermark.sizePercent}
                      onChange={e => onChangeWatermark({ ...watermark, sizePercent: Number(e.target.value) })}
                      className="hud-slider cursor-pointer"
                    />
                  </div>
                  <span className="font-mono text-cyan-300 font-bold text-xs shrink-0 drop-shadow-[0_0_6px_rgba(6,182,212,0.9)]">
                    {watermark.sizePercent}%
                  </span>
                </div>
              )}

              {/* H. Slider: Transparansi Watermark Mini */}
              {activeInput === 'watermark_opacity' && (
                <div className="relative w-full h-9 sm:h-9.5 rounded-full bg-gradient-to-r from-[#03152e]/95 via-[#062854]/90 to-[#03152e]/95 border-2 border-cyan-400 shadow-[0_0_18px_rgba(6,182,212,0.6),inset_0_1px_2px_rgba(255,255,255,0.8),inset_0_-1.5px_3px_rgba(0,0,0,0.8)] px-3.5 flex items-center gap-2.5 overflow-hidden">
                  <div className="absolute top-0 inset-x-5 h-[1px] bg-white/80 shadow-[0_0_6px_#fff] pointer-events-none" />
                  <div className="flex-1 min-w-0 flex items-center">
                    <input
                      type="range"
                      min={0.15}
                      max={1.0}
                      step={0.05}
                      value={watermark.opacity}
                      onChange={e => onChangeWatermark({ ...watermark, opacity: Number(e.target.value) })}
                      className="hud-slider cursor-pointer"
                    />
                  </div>
                  <span className="font-mono text-cyan-300 font-bold text-xs shrink-0 drop-shadow-[0_0_6px_rgba(6,182,212,0.9)]">
                    {Math.round(watermark.opacity * 100)}%
                  </span>
                </div>
              )}

              {/* I. Slider: Ukuran Teks Profil Mini */}
              {activeInput === 'profile_size' && (
                <div className="relative w-full h-9 sm:h-9.5 rounded-full bg-gradient-to-r from-[#03152e]/95 via-[#062854]/90 to-[#03152e]/95 border-2 border-cyan-400 shadow-[0_0_18px_rgba(6,182,212,0.6),inset_0_1px_2px_rgba(255,255,255,0.8),inset_0_-1.5px_3px_rgba(0,0,0,0.8)] px-3.5 flex items-center gap-2.5 overflow-hidden">
                  <div className="absolute top-0 inset-x-5 h-[1px] bg-white/80 shadow-[0_0_6px_#fff] pointer-events-none" />
                  <div className="flex-1 min-w-0 flex items-center">
                    <input
                      type="range"
                      min={10}
                      max={22}
                      value={profile.fontSize || 13}
                      onChange={e => onChangeProfile({ ...profile, fontSize: Number(e.target.value) })}
                      className="hud-slider cursor-pointer"
                    />
                  </div>
                  <span className="font-mono text-cyan-300 font-bold text-xs shrink-0 drop-shadow-[0_0_6px_rgba(6,182,212,0.9)]">
                    {profile.fontSize || 13}px
                  </span>
                </div>
              )}

              {/* J. Input Teks: Jabatan Profil Mini */}
              {activeInput === 'profile_job' && (
                <div className="relative w-full h-9 sm:h-9.5 rounded-full bg-gradient-to-r from-[#03152e]/95 via-[#062854]/90 to-[#03152e]/95 border-2 border-cyan-400 shadow-[0_0_18px_rgba(6,182,212,0.6),inset_0_1px_2px_rgba(255,255,255,0.8),inset_0_-1.5px_3px_rgba(0,0,0,0.8)] px-3.5 flex items-center overflow-hidden">
                  <div className="absolute top-0 inset-x-5 h-[1px] bg-white/80 shadow-[0_0_6px_#fff] pointer-events-none" />
                  <input
                    type="text"
                    value={profile.jobTitle}
                    onChange={e => onChangeProfile({ ...profile, jobTitle: e.target.value })}
                    placeholder="Ketik Jabatan..."
                    className="w-full min-w-0 bg-transparent border-none text-white font-medium text-xs placeholder:text-cyan-200/50 focus:outline-none focus:ring-0"
                  />
                </div>
              )}

              {/* K. Input Teks: Nama Lengkap Profil Mini */}
              {activeInput === 'profile_name' && (
                <div className="relative w-full h-9 sm:h-9.5 rounded-full bg-gradient-to-r from-[#03152e]/95 via-[#062854]/90 to-[#03152e]/95 border-2 border-cyan-400 shadow-[0_0_18px_rgba(6,182,212,0.6),inset_0_1px_2px_rgba(255,255,255,0.8),inset_0_-1.5px_3px_rgba(0,0,0,0.8)] px-3.5 flex items-center overflow-hidden">
                  <div className="absolute top-0 inset-x-5 h-[1px] bg-white/80 shadow-[0_0_6px_#fff] pointer-events-none" />
                  <input
                    type="text"
                    value={profile.name}
                    onChange={e => onChangeProfile({ ...profile, name: e.target.value })}
                    placeholder="Ketik Nama Lengkap..."
                    className="w-full min-w-0 bg-transparent border-none text-white font-medium text-xs placeholder:text-cyan-200/50 focus:outline-none focus:ring-0"
                  />
                </div>
              )}
            </div>

            {/* Tombol Next [>] Mini */}
            <button
              type="button"
              onClick={handleNextInput}
              className="w-9 h-9 sm:w-9.5 sm:h-9.5 rounded-full sm:rounded-xl bg-gradient-to-b from-[#0b1b36]/80 to-[#030814]/95 border border-cyan-500/50 hover:border-cyan-400 shadow-[inset_0_1px_1.5px_rgba(255,255,255,0.5),0_0_10px_rgba(6,182,212,0.25)] flex items-center justify-center cursor-pointer active:scale-95 transition-all text-cyan-200 hover:text-white shrink-0 relative overflow-hidden group"
              title="Input Selanjutnya"
            >
              <div className="absolute top-0 inset-x-1.5 h-1.5 rounded-full bg-white/30 blur-[0.5px]" />
              <ChevronRight className="w-4 h-4 stroke-[2.5] group-hover:translate-x-0.5 transition-transform drop-shadow-[0_0_4px_rgba(34,211,238,0.6)]" />
            </button>

            {/* Tombol Tutup Mandiri [ ✕ ] Mini */}
            <button
              type="button"
              onClick={onClose}
              className="w-9 h-9 sm:w-9.5 sm:h-9.5 rounded-xl bg-gradient-to-b from-[#2e0915]/90 to-[#120207]/95 border-2 border-rose-500/80 shadow-[0_0_16px_rgba(244,63,94,0.65),inset_0_1px_1.5px_rgba(255,255,255,0.7),inset_0_-1.5px_3px_rgba(0,0,0,0.8)] flex items-center justify-center cursor-pointer active:scale-95 transition-all shrink-0 relative overflow-hidden group"
              title="Tutup Mode Preview"
            >
              <div className="absolute top-0 inset-x-1.5 h-1.5 rounded-full bg-white/30 blur-[0.5px]" />
              <X className="w-4 h-4 text-rose-400 group-hover:text-rose-300 stroke-[2.5] group-hover:rotate-90 transition-transform duration-200 drop-shadow-[0_0_6px_rgba(244,63,94,0.85)]" />
            </button>
          </div>
        </div>
      </div>
    </aside>
  )
}
