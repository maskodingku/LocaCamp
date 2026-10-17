import React from 'react'
import { User, Briefcase, Type, MapPin, Check, Eye, Frame, Palette, Paintbrush, ChevronDown } from 'lucide-react'
import type { ProfileConfig, ProfilePosition, ProfileFontWeight } from '../../../types/camera'
import { CyberGlassOrb } from '../CyberGlassOrb'

interface ProfileSectionProps {
  profile: ProfileConfig
  onChangeProfile: (cfg: ProfileConfig) => void
  activeSlider: string | null
  setActiveSlider: (slider: string | null) => void
  onTriggerPreview?: (inputId: string) => void
}

export const FONT_OPTIONS = [
  { id: 'Inter', label: 'Inter (Default Modern)', fontStyle: 'Inter, sans-serif' },
  { id: 'Roboto', label: 'Roboto', fontStyle: 'Roboto, sans-serif' },
  { id: 'Montserrat', label: 'Montserrat', fontStyle: 'Montserrat, sans-serif' },
  { id: 'Poppins', label: 'Poppins', fontStyle: 'Poppins, sans-serif' },
  { id: 'Outfit', label: 'Outfit', fontStyle: 'Outfit, sans-serif' },
  { id: 'Arial', label: 'Arial (Clean)', fontStyle: 'Arial, sans-serif' },
  { id: 'Courier New', label: 'Courier New (Monospace)', fontStyle: '"Courier New", Courier, monospace' },
  { id: 'Georgia', label: 'Georgia (Serif)', fontStyle: 'Georgia, serif' },
]

export const getFontFamilyStyle = (fontId?: string): string => {
  const found = FONT_OPTIONS.find(f => f.id === fontId)
  if (found) return found.fontStyle
  if (fontId) return `"${fontId}", sans-serif`
  return 'Inter, sans-serif'
}

export const PROFILE_BG_PRESETS = [
  { id: 'rgba(9, 9, 11, 0.78)', label: 'Hitam Kaca (Default)', shortLabel: 'Kaca', preview: 'rgba(9, 9, 11, 0.78)' },
  { id: 'transparent', label: 'Transparan', shortLabel: 'Bening', preview: 'transparent' },
  { id: '#09090b', label: 'Hitam Pekat', shortLabel: 'Hitam', preview: '#09090b' },
  { id: 'rgba(15, 23, 42, 0.85)', label: 'Biru Navy', shortLabel: 'Navy', preview: 'rgba(15, 23, 42, 0.85)' },
  { id: 'rgba(8, 47, 73, 0.85)', label: 'Cyber Cyan', shortLabel: 'Cyan', preview: 'rgba(8, 47, 73, 0.85)' },
  { id: 'rgba(6, 78, 59, 0.85)', label: 'Emerald Hijau', shortLabel: 'Emerald', preview: 'rgba(6, 78, 59, 0.85)' },
  { id: 'rgba(120, 53, 15, 0.85)', label: 'Amber Emas', shortLabel: 'Amber', preview: 'rgba(120, 53, 15, 0.85)' },
  { id: 'rgba(255, 255, 255, 0.2)', label: 'Putih Kaca', shortLabel: 'P-Kaca', preview: 'rgba(255, 255, 255, 0.2)' },
  { id: '#ffffff', label: 'Putih Pekat', shortLabel: 'Putih', preview: '#ffffff' },
]

export const PROFILE_TEXT_PRESETS = [
  { id: '#ffffff', label: 'Putih (Default)', shortLabel: 'Putih', preview: '#ffffff' },
  { id: '#22d3ee', label: 'Cyan Neon', shortLabel: 'Cyan', preview: '#22d3ee' },
  { id: '#34d399', label: 'Emerald Hijau', shortLabel: 'Emerald', preview: '#34d399' },
  { id: '#fbbf24', label: 'Amber Emas', shortLabel: 'Amber', preview: '#fbbf24' },
  { id: '#38bdf8', label: 'Biru Langit', shortLabel: 'Biru', preview: '#38bdf8' },
  { id: '#f43f5e', label: 'Rose Merah', shortLabel: 'Rose', preview: '#f43f5e' },
  { id: '#facc15', label: 'Kuning', shortLabel: 'Kuning', preview: '#facc15' },
  { id: '#94a3b8', label: 'Abu-Abu', shortLabel: 'Abu', preview: '#94a3b8' },
  { id: '#09090b', label: 'Hitam Gelap', shortLabel: 'Hitam', preview: '#09090b' },
]

const FONT_WEIGHTS: { id: ProfileFontWeight; label: string; weight: number }[] = [
  { id: 'normal', label: 'Normal', weight: 400 },
  { id: 'medium', label: 'Sedang', weight: 500 },
  { id: 'semibold', label: 'Semibold', weight: 600 },
  { id: 'bold', label: 'Tebal', weight: 700 },
]

const CAMERA_GRID_POSITIONS: { id: ProfilePosition; label: string; icon: string }[] = [
  { id: 'top-left', label: 'Atas Kiri', icon: '↖' },
  { id: 'top-center', label: 'Atas Tengah', icon: '↑' },
  { id: 'top-right', label: 'Atas Kanan', icon: '↗' },
  { id: 'center-left', label: 'Tengah Kiri', icon: '←' },
  { id: 'center', label: 'Tengah', icon: '•' },
  { id: 'center-right', label: 'Tengah Kanan', icon: '→' },
  { id: 'bottom-left', label: 'Bawah Kiri', icon: '↙' },
  { id: 'bottom-center', label: 'Bawah Tengah', icon: '↓' },
  { id: 'bottom-right', label: 'Bawah Kanan', icon: '↘' },
]

export const ProfileSection: React.FC<ProfileSectionProps> = ({
  profile,
  onChangeProfile,
  activeSlider,
  setActiveSlider,
  onTriggerPreview,
}) => {
  const currentBg = profile.backgroundColor || 'rgba(9, 9, 11, 0.78)'
  const isCustomBg = !PROFILE_BG_PRESETS.some(p => p.id === currentBg)

  const currentText = profile.textColor || '#ffffff'
  const isCustomText = !PROFILE_TEXT_PRESETS.some(p => p.id === currentText)

  const isAboveGeotag = (profile.position || 'above-geotag') === 'above-geotag'
  const isBorderOn = profile.showBorder !== false

  return (
    <div
      className={`relative rounded-[22px] border border-cyan-400/40 transition-all duration-150 overflow-hidden ${
        activeSlider === 'profile_size'
          ? 'border-transparent bg-transparent shadow-none p-0 overflow-visible space-y-0'
          : activeSlider
          ? 'hidden'
          : 'bg-[#020717]/80 backdrop-blur-2xl shadow-[0_10px_35px_rgba(0,0,0,0.7),0_0_20px_rgba(6,182,212,0.18),inset_0_1.5px_2px_rgba(255,255,255,0.6)] text-white'
      }`}
    >
      {/* 3D Glass Ambient Bubbles di Sudut Card */}
      <div
        className="absolute -top-3 -right-3 w-20 h-20 rounded-full border border-cyan-400/30 blur-[0.5px] shadow-[inset_0_2px_4px_rgba(255,255,255,0.7),0_0_15px_rgba(6,182,212,0.25)] pointer-events-none"
        style={{
          background: 'radial-gradient(circle at 35% 25%, rgba(56,189,248,0.22) 0%, rgba(6,182,212,0.08) 50%, transparent 100%)',
        }}
      />
      <div
        className="absolute -bottom-5 -left-5 w-24 h-24 rounded-full border border-sky-400/25 blur-[0.5px] shadow-[inset_0_2px_4px_rgba(255,255,255,0.65),0_0_15px_rgba(14,165,233,0.2)] pointer-events-none"
        style={{
          background: 'radial-gradient(circle at 35% 25%, rgba(34,211,238,0.18) 0%, transparent 100%)',
        }}
      />

      {/* Specular Glare Highlight Border Atas Kaca */}
      <div className="pointer-events-none absolute top-0 left-8 right-8 h-[1px] bg-gradient-to-r from-transparent via-cyan-100/90 to-transparent z-20" />

      {/* Optic Lens Flare Glow Spots di Pinggiran Frame */}
      <div className="pointer-events-none absolute top-1.5 left-5 w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_6px_#fff,0_0_14px_#22d3ee] z-20" />
      <div className="pointer-events-none absolute top-1.5 right-5 w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_6px_#fff,0_0_14px_#22d3ee] z-20" />

      {/* Header Section dengan Switch On/Off */}
      <div
        className={`w-full items-center justify-between px-3.5 sm:px-4 py-2.5 sm:py-3 border-b border-cyan-500/20 bg-[#020b18]/60 backdrop-blur-md rounded-t-[21px] transition-opacity duration-150 relative z-10 ${
          activeSlider ? 'hidden' : 'flex'
        }`}
      >
        <div className="flex items-center gap-2.5 min-w-0">
          <CyberGlassOrb
            icon={User}
            size="md"
            variant="cyan"
          />
          <div className="h-4.5 w-[1.5px] bg-cyan-400/40 shrink-0" />
          <div className="flex items-center gap-1.5 min-w-0">
            <span className="text-slate-200 text-[13.5px] sm:text-sm font-medium tracking-wide">
              Profil
            </span>
            <span className="text-white text-[13.5px] sm:text-sm font-extrabold tracking-wide truncate drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)]">
              Pengguna
            </span>
          </div>
          {profile.enabled && (
            <span className="px-2.5 py-0.5 rounded-full bg-[#030917]/90 border border-cyan-400/60 shadow-[inset_0_1px_1px_rgba(255,255,255,0.3),0_0_10px_rgba(6,182,212,0.4)] text-[10.5px] font-mono font-bold text-cyan-300 drop-shadow-[0_0_6px_rgba(6,182,212,0.8)] shrink-0">
              AKTIF
            </span>
          )}
        </div>

        {/* Toggle Switch Cyber Capsule */}
        <label className="relative inline-flex items-center cursor-pointer shrink-0 ml-2">
          <input
            type="checkbox"
            checked={profile.enabled}
            onChange={e =>
              onChangeProfile({
                ...profile,
                enabled: e.target.checked,
              })
            }
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-gradient-to-r from-[#03152e] to-[#0a2042] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:shadow-[0_0_8px_#fff] after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-cyan-400 peer-checked:via-sky-400 peer-checked:to-blue-500 border border-cyan-500/50 peer-checked:border-cyan-200 shadow-[0_0_12px_rgba(6,182,212,0.4),inset_0_1px_1px_rgba(255,255,255,0.4)]" />
        </label>
      </div>

      {/* Konten Saat Profil On */}
      {profile.enabled && (
        <div className={`p-3.5 sm:p-4 pt-3 sm:pt-3.5 space-y-3.5 ${activeSlider ? 'space-y-0 p-0' : ''}`}>
          {/* Input Jabatan & Nama */}
          <div
            className={`space-y-3 transition-opacity duration-150 ${activeSlider ? 'hidden' : 'block'}`}
          >
            {/* Input Jabatan */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                  <CyberGlassOrb icon={Briefcase} size="xs" variant="cyan" />
                  <span>Jabatan / Posisi</span>
                </label>
                {onTriggerPreview && (
                  <button
                    type="button"
                    onClick={() => onTriggerPreview?.('profile_job')}
                    className="flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold text-cyan-200 hover:text-white bg-gradient-to-r from-[#020e1f]/90 via-[#051c36]/85 to-[#020e1f]/90 border border-cyan-400/60 shadow-[0_0_10px_rgba(6,182,212,0.3),inset_0_1px_1.5px_rgba(255,255,255,0.6)] transition-all active:scale-95 cursor-pointer relative overflow-hidden group"
                    title="Lihat Pratinjau Langsung di Kamera"
                  >
                    <div className="absolute top-0 inset-x-2 h-[1px] bg-white/70 pointer-events-none" />
                    <Eye className="w-3.5 h-3.5 text-cyan-400 drop-shadow-[0_0_4px_rgba(34,211,238,0.8)]" />
                    <span>Preview</span>
                  </button>
                )}
              </div>
              {/* Clean Electric Blue Capsule Input */}
              <div className="relative w-full h-10 rounded-full bg-gradient-to-r from-[#020e1f]/90 via-[#051c36]/85 to-[#020e1f]/90 border border-cyan-400/60 shadow-[0_0_12px_rgba(6,182,212,0.35),inset_0_1px_2px_rgba(255,255,255,0.7),inset_0_-1px_2px_rgba(0,0,0,0.8)] px-4 flex items-center overflow-hidden">
                <div className="absolute top-0 inset-x-5 h-[1px] bg-white/70 shadow-[0_0_4px_#fff] pointer-events-none" />
                <div className="absolute -top-1 left-4 w-1.5 h-1.5 rounded-full bg-cyan-300 shadow-[0_0_6px_#22d3ee] pointer-events-none" />
                <div className="absolute -bottom-1 right-8 w-1.5 h-1.5 rounded-full bg-cyan-300 shadow-[0_0_6px_#22d3ee] pointer-events-none" />
                <input
                  type="text"
                  value={profile.jobTitle}
                  onChange={e =>
                    onChangeProfile({
                      ...profile,
                      jobTitle: e.target.value,
                    })
                  }
                  placeholder="Contoh: Surveyor Lapangan / Pengawas"
                  className="w-full min-w-0 bg-transparent border-none text-white font-medium text-xs sm:text-sm placeholder:text-cyan-200/40 focus:outline-none focus:ring-0 drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]"
                />
              </div>
            </div>

            {/* Input Nama Lengkap */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                  <CyberGlassOrb icon={User} size="xs" variant="cyan" />
                  <span>Nama Lengkap</span>
                </label>
                {onTriggerPreview && (
                  <button
                    type="button"
                    onClick={() => onTriggerPreview?.('profile_name')}
                    className="flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold text-cyan-200 hover:text-white bg-gradient-to-r from-[#020e1f]/90 via-[#051c36]/85 to-[#020e1f]/90 border border-cyan-400/60 shadow-[0_0_10px_rgba(6,182,212,0.3),inset_0_1px_1.5px_rgba(255,255,255,0.6)] transition-all active:scale-95 cursor-pointer relative overflow-hidden group"
                    title="Lihat Pratinjau Langsung di Kamera"
                  >
                    <div className="absolute top-0 inset-x-2 h-[1px] bg-white/70 pointer-events-none" />
                    <Eye className="w-3.5 h-3.5 text-cyan-400 drop-shadow-[0_0_4px_rgba(34,211,238,0.8)]" />
                    <span>Preview</span>
                  </button>
                )}
              </div>
              {/* Clean Electric Blue Capsule Input */}
              <div className="relative w-full h-10 rounded-full bg-gradient-to-r from-[#020e1f]/90 via-[#051c36]/85 to-[#020e1f]/90 border border-cyan-400/60 shadow-[0_0_12px_rgba(6,182,212,0.35),inset_0_1px_2px_rgba(255,255,255,0.7),inset_0_-1px_2px_rgba(0,0,0,0.8)] px-4 flex items-center overflow-hidden">
                <div className="absolute top-0 inset-x-5 h-[1px] bg-white/70 shadow-[0_0_4px_#fff] pointer-events-none" />
                <div className="absolute -top-1 left-4 w-1.5 h-1.5 rounded-full bg-cyan-300 shadow-[0_0_6px_#22d3ee] pointer-events-none" />
                <div className="absolute -bottom-1 right-8 w-1.5 h-1.5 rounded-full bg-cyan-300 shadow-[0_0_6px_#22d3ee] pointer-events-none" />
                <input
                  type="text"
                  value={profile.name}
                  onChange={e =>
                    onChangeProfile({
                      ...profile,
                      name: e.target.value,
                    })
                  }
                  placeholder="Contoh: Ahmad Fauzi, S.T."
                  className="w-full min-w-0 bg-transparent border-none text-white font-medium text-xs sm:text-sm placeholder:text-cyan-200/40 focus:outline-none focus:ring-0 drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]"
                />
              </div>
            </div>
          </div>

          {/* Pemilihan Font Dropdown */}
          <div
            className={`transition-opacity duration-150 ${activeSlider ? 'hidden' : 'block'}`}
          >
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                <CyberGlassOrb icon={Type} size="xs" variant="cyan" />
                <span>Jenis Font Profil</span>
              </label>
              {onTriggerPreview && (
                <button
                  type="button"
                  onClick={() => onTriggerPreview?.('profile_font')}
                  className="flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold text-cyan-200 hover:text-white bg-gradient-to-r from-[#020e1f]/90 via-[#051c36]/85 to-[#020e1f]/90 border border-cyan-400/60 shadow-[0_0_10px_rgba(6,182,212,0.3),inset_0_1px_1.5px_rgba(255,255,255,0.6)] transition-all active:scale-95 cursor-pointer relative overflow-hidden group"
                  title="Lihat Pratinjau Langsung di Kamera"
                >
                  <div className="absolute top-0 inset-x-2 h-[1px] bg-white/70 pointer-events-none" />
                  <Eye className="w-3.5 h-3.5 text-cyan-400 drop-shadow-[0_0_4px_rgba(34,211,238,0.8)]" />
                  <span>Preview</span>
                </button>
              )}
            </div>
            {/* Clean Capsule Select */}
            <div className="relative w-full h-10 rounded-full bg-gradient-to-r from-[#020e1f]/90 via-[#051c36]/85 to-[#020e1f]/90 border border-cyan-400/60 shadow-[0_0_12px_rgba(6,182,212,0.35),inset_0_1px_2px_rgba(255,255,255,0.7),inset_0_-1px_2px_rgba(0,0,0,0.8)] px-4 flex items-center overflow-hidden">
              <div className="absolute top-0 inset-x-5 h-[1px] bg-white/70 shadow-[0_0_4px_#fff] pointer-events-none" />
              <select
                value={profile.fontFamily}
                onChange={e =>
                  onChangeProfile({
                    ...profile,
                    fontFamily: e.target.value,
                  })
                }
                className="w-full bg-transparent border-none text-white font-semibold text-xs sm:text-sm appearance-none cursor-pointer focus:outline-none focus:ring-0 pr-8 drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]"
              >
                {FONT_OPTIONS.map(font => (
                  <option
                    key={font.id}
                    value={font.id}
                    className="bg-[#020717] text-white py-1"
                  >
                    {font.label}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-3.5 flex items-center text-cyan-400">
                <ChevronDown className="w-4 h-4 stroke-[3] drop-shadow-[0_0_5px_rgba(6,182,212,0.8)]" />
              </div>
            </div>
          </div>

          {/* Pengaturan Posisi Profil */}
          <div
            className={`transition-opacity duration-150 ${activeSlider ? 'hidden' : 'block'}`}
          >
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                <CyberGlassOrb icon={MapPin} size="xs" variant="cyan" />
                <span>Posisi Profil di Foto</span>
              </label>
              {onTriggerPreview && (
                <button
                  type="button"
                  onClick={() => onTriggerPreview?.('profile_position')}
                  className="flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold text-cyan-200 hover:text-white bg-gradient-to-r from-[#020e1f]/90 via-[#051c36]/85 to-[#020e1f]/90 border border-cyan-400/60 shadow-[0_0_10px_rgba(6,182,212,0.3),inset_0_1px_1.5px_rgba(255,255,255,0.6)] transition-all active:scale-95 cursor-pointer relative overflow-hidden group"
                  title="Lihat Pratinjau Langsung di Kamera"
                >
                  <div className="absolute top-0 inset-x-2 h-[1px] bg-white/70 pointer-events-none" />
                  <Eye className="w-3.5 h-3.5 text-cyan-400 drop-shadow-[0_0_4px_rgba(34,211,238,0.8)]" />
                  <span>Preview</span>
                </button>
              )}
            </div>

            <div className="space-y-2 p-3 bg-[#020d1c]/70 rounded-2xl border border-cyan-500/25">
              {/* Opsi Utama: Di Atas Geotag */}
              <button
                type="button"
                onClick={() => onChangeProfile({ ...profile, position: 'above-geotag' })}
                className={`w-full py-2.5 px-3.5 rounded-full text-xs font-bold transition-all flex items-center justify-between border relative overflow-hidden ${
                  isAboveGeotag
                    ? 'bg-gradient-to-r from-[#020e1f]/95 via-[#051c36]/90 to-[#020e1f]/95 border border-cyan-400 text-white shadow-[0_0_14px_rgba(6,182,212,0.5),inset_0_1px_2px_rgba(255,255,255,0.7)]'
                    : 'bg-[#020717]/60 border border-cyan-500/30 text-slate-300 hover:text-white hover:border-cyan-400/60'
                }`}
              >
                {isAboveGeotag && (
                  <div className="absolute top-0 inset-x-5 h-[1px] bg-white/80 shadow-[0_0_6px_#fff] pointer-events-none" />
                )}
                <div className="flex items-center gap-2 min-w-0">
                  <span className="text-amber-400 text-sm drop-shadow-[0_0_6px_rgba(251,191,36,0.8)]">★</span>
                  <span className="truncate">Di Atas Geotag</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shrink-0">
                    Rekomendasi
                  </span>
                </div>
                {isAboveGeotag && (
                  <Check className="w-4 h-4 text-cyan-300 drop-shadow-[0_0_6px_rgba(6,182,212,0.9)] shrink-0 ml-1" />
                )}
              </button>

              <div className="flex items-center gap-2 pt-1 pb-0.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-300/70">
                  Atau 9 Posisi Sudut Kamera:
                </span>
                <div className="flex-1 h-px bg-cyan-500/30" />
              </div>

              {/* 9-Grid Posisi Sudut Kamera */}
              <div className="grid grid-cols-3 gap-1.5">
                {CAMERA_GRID_POSITIONS.map(pos => {
                  const active = profile.position === pos.id
                  return (
                    <button
                      key={pos.id}
                      type="button"
                      onClick={() => onChangeProfile({ ...profile, position: pos.id })}
                      className={`py-2 px-1 rounded-xl text-[11px] sm:text-xs font-medium transition-all flex items-center justify-center gap-1 truncate relative overflow-hidden border ${
                        active
                          ? 'bg-gradient-to-r from-cyan-400 via-sky-400 to-blue-500 text-[#020b18] font-black border-cyan-200 shadow-[0_0_12px_rgba(6,182,212,0.8),inset_0_1px_1.5px_rgba(255,255,255,0.9)]'
                          : 'bg-[#020717]/60 text-slate-300 hover:text-white border-cyan-900/60 hover:border-cyan-500/50'
                      }`}
                    >
                      <span className={`font-bold shrink-0 ${active ? 'text-[#020b18]' : 'text-cyan-400'}`}>
                        {pos.icon}
                      </span>
                      <span className="truncate">{pos.label}</span>
                    </button>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Pengaturan Ketebalan Teks (Font Weight) */}
          <div
            className={`transition-opacity duration-150 ${activeSlider ? 'hidden' : 'block'}`}
          >
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                Ketebalan Teks
              </label>
              {onTriggerPreview && (
                <button
                  type="button"
                  onClick={() => onTriggerPreview?.('profile_weight')}
                  className="flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold text-cyan-200 hover:text-white bg-gradient-to-r from-[#020e1f]/90 via-[#051c36]/85 to-[#020e1f]/90 border border-cyan-400/60 shadow-[0_0_10px_rgba(6,182,212,0.3),inset_0_1px_1.5px_rgba(255,255,255,0.6)] transition-all active:scale-95 cursor-pointer relative overflow-hidden group"
                  title="Lihat Pratinjau Langsung di Kamera"
                >
                  <div className="absolute top-0 inset-x-2 h-[1px] bg-white/70 pointer-events-none" />
                  <Eye className="w-3.5 h-3.5 text-cyan-400 drop-shadow-[0_0_4px_rgba(34,211,238,0.8)]" />
                  <span>Preview</span>
                </button>
              )}
            </div>
            <div className="grid grid-cols-4 gap-1.5 p-1 bg-[#020d1c]/80 rounded-full border border-cyan-500/25">
              {FONT_WEIGHTS.map(fw => {
                const active = (profile.fontWeight || 'medium') === fw.id
                return (
                  <button
                    key={fw.id}
                    type="button"
                    onClick={() =>
                      onChangeProfile({
                        ...profile,
                        fontWeight: fw.id,
                      })
                    }
                    className={`py-1.5 px-1 rounded-full text-[11px] sm:text-xs font-bold transition-all text-center whitespace-nowrap relative overflow-hidden border ${
                      active
                        ? 'bg-gradient-to-r from-cyan-400 via-sky-400 to-blue-500 text-[#020b18] font-black border-cyan-200 shadow-[0_0_10px_rgba(6,182,212,0.7),inset_0_1px_1.5px_rgba(255,255,255,0.9)]'
                        : 'border-transparent text-slate-300 hover:text-white'
                    }`}
                  >
                    {fw.label}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Pengaturan Garis Tepi (Border Profil) */}
          <div
            className={`p-3 sm:p-3.5 rounded-2xl bg-[#020d1c]/70 border border-cyan-500/25 flex items-center justify-between gap-3 transition-opacity duration-150 ${
              activeSlider ? 'hidden' : 'flex'
            }`}
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <CyberGlassOrb icon={Frame} size="sm" variant="cyan" />
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold uppercase tracking-wider text-slate-200">
                    Garis Tepi (Border)
                  </span>
                  {onTriggerPreview && (
                    <button
                      type="button"
                      onClick={() => onTriggerPreview?.('profile_border')}
                      className="flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold text-cyan-200 hover:text-white bg-[#020e1f] border border-cyan-400/50 shadow-[0_0_8px_rgba(6,182,212,0.25)] transition-all active:scale-95 cursor-pointer shrink-0"
                      title="Lihat Pratinjau Langsung di Kamera"
                    >
                      <Eye className="w-3 h-3 text-cyan-400" />
                      <span>Preview</span>
                    </button>
                  )}
                </div>
                <p className="text-[11px] text-slate-400 truncate">
                  {isBorderOn
                    ? 'Garis tepi aktif melingkari badge'
                    : 'Mode tanpa garis tepi (borderless)'}
                </p>
              </div>
            </div>

            {/* Slider Switch On/Off Gaya LivePreviewDock */}
            <button
              type="button"
              onClick={() => onChangeProfile({ ...profile, showBorder: !isBorderOn, enabled: true })}
              className={`w-20 h-8 rounded-full border transition-all duration-300 p-0.5 flex items-center cursor-pointer active:scale-95 relative overflow-hidden group select-none shrink-0 ${
                isBorderOn
                  ? 'bg-gradient-to-r from-[#020e1f]/95 via-[#051c36]/90 to-[#020e1f]/95 border-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.4),inset_0_1px_2px_rgba(255,255,255,0.7)]'
                  : 'bg-gradient-to-r from-[#0a121e]/95 via-[#121b2b]/90 to-[#0a121e]/95 border-slate-600/80 shadow-[inset_0_1px_1.5px_rgba(255,255,255,0.2)]'
              }`}
              title={isBorderOn ? 'Klik untuk mematikan border (OFF)' : 'Klik untuk mengaktifkan border (ON)'}
            >
              <div className="absolute top-0 inset-x-2 h-[1px] bg-white/70 shadow-[0_0_4px_#fff] pointer-events-none" />
              <div className="relative w-full h-full flex items-center">
                <div
                  className={`w-1/2 h-full rounded-full flex items-center justify-center font-mono text-[10px] font-black tracking-wider transition-all duration-300 ease-in-out relative overflow-hidden ${
                    isBorderOn
                      ? 'translate-x-full bg-gradient-to-r from-cyan-400 via-sky-400 to-blue-500 text-[#020b18] border border-cyan-200 shadow-[0_0_8px_rgba(6,182,212,0.8),inset_0_1px_1.5px_rgba(255,255,255,0.95)]'
                      : 'translate-x-0 bg-slate-700 text-slate-300 border border-slate-500/70'
                  }`}
                >
                  <span className="relative z-10 drop-shadow-[0_1px_1px_rgba(0,0,0,0.4)]">
                    {isBorderOn ? 'ON' : 'OFF'}
                  </span>
                </div>
              </div>
            </button>
          </div>

          {/* Pengaturan Warna Background */}
          <div
            className={`transition-opacity duration-150 ${activeSlider ? 'hidden' : 'block'}`}
          >
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                <CyberGlassOrb icon={Paintbrush} size="xs" variant="cyan" />
                <span>Warna Background</span>
              </label>
              {onTriggerPreview && (
                <button
                  type="button"
                  onClick={() => onTriggerPreview?.('profile_bg_color')}
                  className="flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold text-cyan-200 hover:text-white bg-gradient-to-r from-[#020e1f]/90 via-[#051c36]/85 to-[#020e1f]/90 border border-cyan-400/60 shadow-[0_0_10px_rgba(6,182,212,0.3),inset_0_1px_1.5px_rgba(255,255,255,0.6)] transition-all active:scale-95 cursor-pointer relative overflow-hidden group"
                  title="Lihat Pratinjau Langsung di Kamera"
                >
                  <div className="absolute top-0 inset-x-2 h-[1px] bg-white/70 pointer-events-none" />
                  <Eye className="w-3.5 h-3.5 text-cyan-400 drop-shadow-[0_0_4px_rgba(34,211,238,0.8)]" />
                  <span>Preview</span>
                </button>
              )}
            </div>
            <div className="p-2 sm:p-2.5 bg-[#020d1c]/70 rounded-2xl border border-cyan-500/25">
              <div className="grid grid-cols-5 gap-1.5">
                {PROFILE_BG_PRESETS.map(preset => {
                  const active = currentBg === preset.id
                  return (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() =>
                        onChangeProfile({
                          ...profile,
                          backgroundColor: preset.id,
                        })
                      }
                      className={`h-11 sm:h-12 flex flex-col items-center justify-center p-1 rounded-xl transition-all border ${
                        active
                          ? 'border-cyan-400 bg-cyan-500/25 text-cyan-200 ring-1 ring-cyan-400/50 shadow-[0_0_10px_rgba(34,211,238,0.4)]'
                          : 'border-cyan-950/40 bg-[#020717]/60 text-slate-400 hover:border-cyan-800 hover:text-slate-200'
                      }`}
                      title={preset.label}
                    >
                      <span
                        className="w-4 h-4 rounded-full border border-white/20 shrink-0 flex items-center justify-center relative shadow-sm"
                        style={{
                          backgroundColor:
                            preset.preview === 'transparent' ? 'transparent' : preset.preview,
                          backgroundImage:
                            preset.preview === 'transparent'
                              ? 'linear-gradient(45deg, #555 25%, transparent 25%, transparent 75%, #555 75%, #555), linear-gradient(45deg, #555 25%, transparent 25%, transparent 75%, #555 75%, #555)'
                              : undefined,
                          backgroundSize: '4px 4px',
                          backgroundPosition: '0 0, 2px 2px',
                        }}
                      >
                        {active && <Check className="w-2.5 h-2.5 text-white drop-shadow" />}
                      </span>
                      <span className="text-[9.5px] font-medium leading-none mt-1 truncate max-w-full">
                        {preset.shortLabel}
                      </span>
                    </button>
                  )
                })}

                {/* Swatch 10: Custom Color */}
                <label
                  className={`h-11 sm:h-12 flex flex-col items-center justify-center p-1 rounded-xl transition-all border cursor-pointer relative ${
                    isCustomBg
                      ? 'border-cyan-400 bg-cyan-500/25 text-cyan-200 ring-1 ring-cyan-400/50 shadow-[0_0_10px_rgba(34,211,238,0.4)]'
                      : 'border-cyan-950/40 bg-[#020717]/60 text-slate-400 hover:border-cyan-800 hover:text-slate-200'
                  }`}
                  title="Pilih Warna Bebas Kustom"
                >
                  <span
                    className="w-4 h-4 rounded-full border border-white/20 shrink-0 flex items-center justify-center relative shadow-sm overflow-hidden"
                    style={{
                      background: isCustomBg
                        ? currentBg
                        : 'conic-gradient(from 180deg at 50% 50%, #f43f5e 0deg, #facc15 60deg, #34d399 120deg, #22d3ee 180deg, #38bdf8 240deg, #a855f7 300deg, #f43f5e 360deg)',
                    }}
                  >
                    {isCustomBg && <Check className="w-2.5 h-2.5 text-white drop-shadow" />}
                  </span>
                  <span className="text-[9.5px] font-medium leading-none mt-1 truncate max-w-full">
                    Bebas
                  </span>
                  <input
                    type="color"
                    value={currentBg.startsWith('#') ? currentBg : '#09090b'}
                    onChange={e =>
                      onChangeProfile({
                        ...profile,
                        backgroundColor: e.target.value,
                      })
                    }
                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                  />
                </label>
              </div>
            </div>
          </div>

          {/* Pengaturan Warna Teks */}
          <div
            className={`transition-opacity duration-150 ${activeSlider ? 'hidden' : 'block'}`}
          >
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                <CyberGlassOrb icon={Palette} size="xs" variant="cyan" />
                <span>Warna Teks</span>
              </label>
              {onTriggerPreview && (
                <button
                  type="button"
                  onClick={() => onTriggerPreview?.('profile_text_color')}
                  className="flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold text-cyan-200 hover:text-white bg-gradient-to-r from-[#020e1f]/90 via-[#051c36]/85 to-[#020e1f]/90 border border-cyan-400/60 shadow-[0_0_10px_rgba(6,182,212,0.3),inset_0_1px_1.5px_rgba(255,255,255,0.6)] transition-all active:scale-95 cursor-pointer relative overflow-hidden group"
                  title="Lihat Pratinjau Langsung di Kamera"
                >
                  <div className="absolute top-0 inset-x-2 h-[1px] bg-white/70 pointer-events-none" />
                  <Eye className="w-3.5 h-3.5 text-cyan-400 drop-shadow-[0_0_4px_rgba(34,211,238,0.8)]" />
                  <span>Preview</span>
                </button>
              )}
            </div>
            <div className="p-2 sm:p-2.5 bg-[#020d1c]/70 rounded-2xl border border-cyan-500/25">
              <div className="grid grid-cols-5 gap-1.5">
                {PROFILE_TEXT_PRESETS.map(preset => {
                  const active = currentText === preset.id
                  return (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() =>
                        onChangeProfile({
                          ...profile,
                          textColor: preset.id,
                        })
                      }
                      className={`h-11 sm:h-12 flex flex-col items-center justify-center p-1 rounded-xl transition-all border ${
                        active
                          ? 'border-cyan-400 bg-cyan-500/25 text-cyan-200 ring-1 ring-cyan-400/50 shadow-[0_0_10px_rgba(34,211,238,0.4)]'
                          : 'border-cyan-950/40 bg-[#020717]/60 text-slate-400 hover:border-cyan-800 hover:text-slate-200'
                      }`}
                      title={preset.label}
                    >
                      <span
                        className="w-4 h-4 rounded-full border border-white/20 shrink-0 flex items-center justify-center relative shadow-sm"
                        style={{ backgroundColor: preset.preview }}
                      >
                        {active && (
                          <Check
                            className={`w-2.5 h-2.5 ${
                              preset.id === '#ffffff' ? 'text-black' : 'text-white'
                            } drop-shadow`}
                          />
                        )}
                      </span>
                      <span className="text-[9.5px] font-medium leading-none mt-1 truncate max-w-full">
                        {preset.shortLabel}
                      </span>
                    </button>
                  )
                })}

                {/* Swatch 10: Custom Color */}
                <label
                  className={`h-11 sm:h-12 flex flex-col items-center justify-center p-1 rounded-xl transition-all border cursor-pointer relative ${
                    isCustomText
                      ? 'border-cyan-400 bg-cyan-500/25 text-cyan-200 ring-1 ring-cyan-400/50 shadow-[0_0_10px_rgba(34,211,238,0.4)]'
                      : 'border-cyan-950/40 bg-[#020717]/60 text-slate-400 hover:border-cyan-800 hover:text-slate-200'
                  }`}
                  title="Pilih Warna Teks Bebas Kustom"
                >
                  <span
                    className="w-4 h-4 rounded-full border border-white/20 shrink-0 flex items-center justify-center relative shadow-sm overflow-hidden"
                    style={{
                      background: isCustomText
                        ? currentText
                        : 'conic-gradient(from 180deg at 50% 50%, #f43f5e 0deg, #facc15 60deg, #34d399 120deg, #22d3ee 180deg, #38bdf8 240deg, #a855f7 300deg, #f43f5e 360deg)',
                    }}
                  >
                    {isCustomText && <Check className="w-2.5 h-2.5 text-white drop-shadow" />}
                  </span>
                  <span className="text-[9.5px] font-medium leading-none mt-1 truncate max-w-full">
                    Bebas
                  </span>
                  <input
                    type="color"
                    value={currentText.startsWith('#') ? currentText : '#ffffff'}
                    onChange={e =>
                      onChangeProfile({
                        ...profile,
                        textColor: e.target.value,
                      })
                    }
                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                  />
                </label>
              </div>
            </div>
          </div>

          {/* Slider Ukuran Teks (Clean Electric Blue Capsule Slider) */}
          <div
            className={`transition-all duration-150 ${
              activeSlider === 'profile_size'
                ? 'p-4 rounded-2xl bg-[#020717]/95 backdrop-blur-2xl border border-cyan-400 shadow-[0_0_25px_rgba(6,182,212,0.6)] relative z-50'
                : activeSlider !== null
                ? 'hidden'
                : ''
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2 min-w-0">
                <span
                  className={`text-xs font-semibold uppercase tracking-wider ${
                    activeSlider === 'profile_size' ? 'text-white font-bold' : 'text-slate-300'
                  }`}
                >
                  Ukuran Teks Profil
                </span>
                <span className="px-2 py-0.5 rounded-full text-[11px] font-mono font-bold bg-[#030917]/90 text-cyan-300 border border-cyan-400/50 shadow-[0_0_8px_rgba(6,182,212,0.4)] shrink-0">
                  {profile.fontSize || 13} px
                </span>
              </div>
              {onTriggerPreview && activeSlider !== 'profile_size' && (
                <button
                  type="button"
                  onClick={() => onTriggerPreview?.('profile_size')}
                  className="flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold text-cyan-200 hover:text-white bg-gradient-to-r from-[#020e1f]/90 via-[#051c36]/85 to-[#020e1f]/90 border border-cyan-400/60 shadow-[0_0_10px_rgba(6,182,212,0.3),inset_0_1px_1.5px_rgba(255,255,255,0.6)] transition-all active:scale-95 cursor-pointer relative overflow-hidden group shrink-0"
                  title="Lihat Pratinjau Langsung di Kamera"
                >
                  <div className="absolute top-0 inset-x-2 h-[1px] bg-white/70 pointer-events-none" />
                  <Eye className="w-3.5 h-3.5 text-cyan-400 drop-shadow-[0_0_4px_rgba(34,211,238,0.8)]" />
                  <span>Preview</span>
                </button>
              )}
            </div>

            {/* Slider Capsule Track Persis LivePreviewDock */}
            <div className="relative w-full h-10 rounded-full bg-gradient-to-r from-[#020e1f]/90 via-[#051c36]/85 to-[#020e1f]/90 border border-cyan-400/60 shadow-[0_0_12px_rgba(6,182,212,0.35),inset_0_1px_2px_rgba(255,255,255,0.7),inset_0_-1px_2px_rgba(0,0,0,0.8)] px-4 flex items-center gap-3 overflow-hidden">
              <div className="absolute top-0 inset-x-5 h-[1px] bg-white/70 shadow-[0_0_4px_#fff] pointer-events-none" />
              <div className="flex-1 min-w-0 flex items-center">
                <input
                  type="range"
                  min={10}
                  max={22}
                  step={1}
                  value={profile.fontSize || 13}
                  onPointerDown={() => setActiveSlider('profile_size')}
                  onTouchStart={() => setActiveSlider('profile_size')}
                  onMouseDown={() => setActiveSlider('profile_size')}
                  onPointerUp={() => setActiveSlider(null)}
                  onTouchEnd={() => setActiveSlider(null)}
                  onMouseUp={() => setActiveSlider(null)}
                  onChange={e =>
                    onChangeProfile({
                      ...profile,
                      fontSize: Number(e.target.value),
                    })
                  }
                  className="hud-slider cursor-pointer w-full"
                />
              </div>
              <span className="font-mono text-cyan-300 font-bold text-xs shrink-0 drop-shadow-[0_0_6px_rgba(6,182,212,0.9)]">
                {profile.fontSize || 13}px
              </span>
            </div>
          </div>

          {/* Mini Preview Profil (Clean HUD Glass Box) */}
          <div
            className={`p-3 rounded-2xl bg-[#020d1c]/70 border border-cyan-500/25 transition-opacity duration-150 space-y-2 ${
              activeSlider ? 'hidden' : 'block'
            }`}
          >
            <div className="flex items-center justify-between">
              <p className="text-[10px] font-bold text-cyan-300 uppercase tracking-wider drop-shadow-[0_0_4px_rgba(6,182,212,0.5)]">
                Pratinjau Tampilan Teks
              </p>
              <span className="text-[10px] text-slate-300 font-mono">
                {profile.fontSize || 13}px • {profile.fontWeight || 'medium'}
              </span>
            </div>
            <div className="p-3 rounded-xl bg-[#020717]/80 border border-cyan-900/60 flex items-center justify-center overflow-x-auto min-h-[52px] shadow-inner relative">
              <div
                style={{
                  fontFamily: getFontFamilyStyle(profile.fontFamily),
                  fontWeight:
                    profile.fontWeight === 'bold'
                      ? 700
                      : profile.fontWeight === 'semibold'
                      ? 600
                      : profile.fontWeight === 'medium'
                      ? 500
                      : 400,
                  fontSize: `${profile.fontSize || 13}px`,
                  backgroundColor: currentBg,
                  color: currentText,
                }}
                className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full shadow-lg transition-all shrink-0 max-w-full ${
                  profile.showBorder !== false ? 'border border-white/20' : 'border-0'
                }`}
              >
                <User
                  className="w-3.5 h-3.5 shrink-0"
                  style={{
                    color: currentText === '#ffffff' ? '#34d399' : currentText,
                  }}
                />
                <span className="truncate">
                  {profile.name || profile.jobTitle
                    ? [profile.name, profile.jobTitle].filter(Boolean).join(' • ')
                    : 'Nama • Jabatan'}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
