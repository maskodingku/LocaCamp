import React from 'react'
import { User, Briefcase, Type, MapPin, Check, Eye, Frame, Palette, Paintbrush } from 'lucide-react'
import type { ProfileConfig, ProfilePosition, ProfileFontWeight } from '../../../types/camera'

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

  return (
    <div
      className={`relative rounded-2xl transition-all duration-150 ${
        activeSlider === 'profile_size'
          ? 'border-transparent bg-transparent shadow-none p-0 overflow-visible space-y-0'
          : activeSlider
          ? 'hidden'
          : 'border border-zinc-800/80 border-l-[3px] border-l-emerald-400 bg-zinc-900/40 backdrop-blur-md p-4 sm:p-5 shadow-lg space-y-4'
      }`}
      style={
        activeSlider
          ? undefined
          : {
              boxShadow:
                'inset 6px 0 16px -4px rgba(16, 185, 129, 0.25), 0 0 16px rgba(52, 211, 153, 0.15), 0 10px 25px -5px rgba(0, 0, 0, 0.5)',
            }
      }
    >
      {/* Header Section dengan Switch On/Off */}
      <div
        className={`items-center justify-between p-3.5 rounded-2xl bg-zinc-900/70 border border-zinc-800 transition-opacity duration-150 ${
          activeSlider ? 'hidden' : 'flex'
        }`}
      >
        <div className="flex items-center gap-3 min-w-0">
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
              profile.enabled
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                : 'bg-zinc-800 text-zinc-400 border border-zinc-700/50'
            }`}
          >
            <User className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-semibold text-white truncate">Profil Pengguna</h3>
              {profile.enabled && (
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shrink-0">
                  Aktif
                </span>
              )}
            </div>
            <p className="text-xs text-zinc-400 truncate">
              Cantumkan nama &amp; jabatan survei pada foto
            </p>
          </div>
        </div>

        {/* Toggle Switch */}
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
          <div className="w-11 h-6 bg-zinc-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500 border border-zinc-700 peer-checked:border-emerald-400 shadow-inner"></div>
        </label>
      </div>

      {/* Konten Saat Profil On */}
      {profile.enabled && (
        <div className={`space-y-4 ${activeSlider ? 'space-y-0' : ''}`}>
          {/* Input Jabatan & Nama */}
          <div
            className={`space-y-3 transition-opacity duration-150 ${
              activeSlider ? 'hidden' : 'block'
            }`}
          >
            {/* Input Jabatan */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
                  <Briefcase className="w-3.5 h-3.5 text-zinc-400" />
                  <span>Jabatan / Posisi</span>
                </label>
                {onTriggerPreview && (
                  <button
                    type="button"
                    onClick={() => onTriggerPreview?.('profile_job')}
                    className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg text-[11px] font-medium text-emerald-400 hover:text-emerald-300 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/25 transition-all active:scale-95 cursor-pointer shadow-sm"
                    title="Lihat Pratinjau Langsung di Kamera"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Preview</span>
                  </button>
                )}
              </div>
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
                className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-700/80 focus:border-emerald-500 text-sm text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-all shadow-inner"
              />
            </div>

            {/* Input Nama Lengkap */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-zinc-400" />
                  <span>Nama Lengkap</span>
                </label>
                {onTriggerPreview && (
                  <button
                    type="button"
                    onClick={() => onTriggerPreview?.('profile_name')}
                    className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg text-[11px] font-medium text-emerald-400 hover:text-emerald-300 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/25 transition-all active:scale-95 cursor-pointer shadow-sm"
                    title="Lihat Pratinjau Langsung di Kamera"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Preview</span>
                  </button>
                )}
              </div>
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
                className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-700/80 focus:border-emerald-500 text-sm text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-all shadow-inner"
              />
            </div>
          </div>

          {/* Pemilihan Font Dropdown */}
          <div
            className={`transition-opacity duration-150 ${
              activeSlider ? 'hidden' : 'block'
            }`}
          >
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
                <Type className="w-3.5 h-3.5 text-zinc-400" />
                <span>Jenis Font Profil</span>
              </label>
              {onTriggerPreview && (
                <button
                  type="button"
                  onClick={() => onTriggerPreview?.('profile_font')}
                  className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg text-[11px] font-medium text-emerald-400 hover:text-emerald-300 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/25 transition-all active:scale-95 cursor-pointer shadow-sm"
                  title="Lihat Pratinjau Langsung di Kamera"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Preview</span>
                </button>
              )}
            </div>
            <div className="relative">
              <select
                value={profile.fontFamily}
                onChange={e =>
                  onChangeProfile({
                    ...profile,
                    fontFamily: e.target.value,
                  })
                }
                className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-700/80 focus:border-emerald-500 text-sm text-zinc-100 focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-all appearance-none cursor-pointer pr-10 shadow-inner"
              >
                {FONT_OPTIONS.map(font => (
                  <option
                    key={font.id}
                    value={font.id}
                    className="bg-zinc-900 text-zinc-100 py-1"
                  >
                    {font.label}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3.5 text-zinc-400">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                  <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Pengaturan Posisi Profil */}
          <div
            className={`transition-opacity duration-150 ${
              activeSlider ? 'hidden' : 'block'
            }`}
          >
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-zinc-400" />
                <span>Posisi Profil di Foto</span>
              </label>
              {onTriggerPreview && (
                <button
                  type="button"
                  onClick={() => onTriggerPreview?.('profile_position')}
                  className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg text-[11px] font-medium text-emerald-400 hover:text-emerald-300 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/25 transition-all active:scale-95 cursor-pointer shadow-sm"
                  title="Lihat Pratinjau Langsung di Kamera"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Preview</span>
                </button>
              )}
            </div>

            <div className="space-y-2 p-2.5 bg-zinc-900/60 rounded-2xl border border-zinc-800">
              {/* Opsi Utama: Di Atas Geotag */}
              <button
                type="button"
                onClick={() => onChangeProfile({ ...profile, position: 'above-geotag' })}
                className={`w-full py-2.5 px-3 rounded-xl text-xs font-semibold transition-all flex items-center justify-between border ${
                  isAboveGeotag
                    ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300 shadow-md ring-1 ring-emerald-400/40'
                    : 'bg-zinc-800/60 border-zinc-700/60 text-zinc-300 hover:bg-zinc-700/60 hover:border-zinc-600'
                }`}
              >
                <div className="flex items-center gap-2 min-w-0">
                  <span className="text-amber-400 text-sm">★</span>
                  <span className="truncate">Di Atas Geotag</span>
                  <span className="text-[10px] font-normal px-1.5 py-0.5 rounded bg-emerald-500/15 text-emerald-400 border border-emerald-500/25 shrink-0">
                    Rekomendasi
                  </span>
                </div>
                {isAboveGeotag && <Check className="w-4 h-4 text-emerald-400 shrink-0 ml-1" />}
              </button>

              <div className="flex items-center gap-2 pt-1 pb-0.5">
                <span className="text-[10px] font-medium uppercase tracking-wider text-zinc-500">
                  Atau 9 Posisi Sudut Kamera:
                </span>
                <div className="flex-1 h-px bg-zinc-800" />
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
                      className={`py-2 px-1 rounded-lg text-[11px] sm:text-xs font-medium transition-all flex items-center justify-center gap-1 truncate ${
                        active
                          ? 'bg-white text-zinc-950 font-bold shadow-md'
                          : 'bg-zinc-800/50 text-zinc-300 hover:bg-zinc-700/60 hover:text-white'
                      }`}
                    >
                      <span className="text-zinc-400 font-bold shrink-0">{pos.icon}</span>
                      <span className="truncate">{pos.label}</span>
                    </button>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Pengaturan Ketebalan Teks (Font Weight) */}
          <div
            className={`transition-opacity duration-150 ${
              activeSlider ? 'hidden' : 'block'
            }`}
          >
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
                Ketebalan Teks
              </label>
              {onTriggerPreview && (
                <button
                  type="button"
                  onClick={() => onTriggerPreview?.('profile_weight')}
                  className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg text-[11px] font-medium text-emerald-400 hover:text-emerald-300 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/25 transition-all active:scale-95 cursor-pointer shadow-sm"
                  title="Lihat Pratinjau Langsung di Kamera"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Preview</span>
                </button>
              )}
            </div>
            <div className="grid grid-cols-4 gap-1.5 p-1.5 bg-zinc-900/60 rounded-xl border border-zinc-800">
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
                    className={`py-2 px-1 rounded-lg text-[11px] sm:text-xs font-medium transition-all text-center whitespace-nowrap ${
                      active
                        ? 'bg-emerald-500 text-black font-bold shadow-md'
                        : 'text-zinc-400 hover:text-zinc-200'
                    }`}
                  >
                    {fw.label}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Pengaturan Garis Tepi (Border) */}
          <div
            className={`p-3 sm:p-3.5 rounded-2xl bg-zinc-900/60 border border-zinc-800 flex items-center justify-between gap-3 transition-opacity duration-150 ${
              activeSlider ? 'hidden' : 'flex'
            }`}
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-lg bg-zinc-800/80 flex items-center justify-center shrink-0 text-emerald-400 border border-zinc-700/60">
                <Frame className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold uppercase tracking-wider text-zinc-200">
                    Garis Tepi (Border)
                  </span>
                  {onTriggerPreview && (
                    <button
                      type="button"
                      onClick={() => onTriggerPreview?.('profile_border')}
                      className="flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-medium text-emerald-400 hover:text-emerald-300 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/25 transition-all active:scale-95 cursor-pointer shadow-sm shrink-0"
                      title="Lihat Pratinjau Langsung di Kamera"
                    >
                      <Eye className="w-3 h-3" />
                      <span>Preview</span>
                    </button>
                  )}
                </div>
                <p className="text-[11px] text-zinc-400 truncate">
                  {profile.showBorder !== false
                    ? 'Garis tepi aktif melingkari badge'
                    : 'Mode tanpa garis tepi (borderless)'}
                </p>
              </div>
            </div>

            <label className="relative inline-flex items-center cursor-pointer shrink-0">
              <input
                type="checkbox"
                checked={profile.showBorder !== false}
                onChange={e =>
                  onChangeProfile({
                    ...profile,
                    showBorder: e.target.checked,
                  })
                }
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-zinc-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500 border border-zinc-700 peer-checked:border-emerald-400 shadow-inner"></div>
            </label>
          </div>

          {/* Pengaturan Warna Background */}
          <div
            className={`transition-opacity duration-150 ${
              activeSlider ? 'hidden' : 'block'
            }`}
          >
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
                <Paintbrush className="w-3.5 h-3.5 text-zinc-400" />
                <span>Warna Background</span>
              </label>
              {onTriggerPreview && (
                <button
                  type="button"
                  onClick={() => onTriggerPreview?.('profile_bg_color')}
                  className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg text-[11px] font-medium text-emerald-400 hover:text-emerald-300 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/25 transition-all active:scale-95 cursor-pointer shadow-sm"
                  title="Lihat Pratinjau Langsung di Kamera"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Preview</span>
                </button>
              )}
            </div>
            <div className="p-2 sm:p-2.5 bg-zinc-900/60 rounded-2xl border border-zinc-800">
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
                          ? 'border-emerald-400 bg-emerald-500/15 text-emerald-300 ring-1 ring-emerald-400/40 shadow-sm'
                          : 'border-zinc-800/80 bg-zinc-900/80 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200'
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
                      ? 'border-emerald-400 bg-emerald-500/15 text-emerald-300 ring-1 ring-emerald-400/40 shadow-sm'
                      : 'border-zinc-800/80 bg-zinc-900/80 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200'
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
            className={`transition-opacity duration-150 ${
              activeSlider ? 'hidden' : 'block'
            }`}
          >
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
                <Palette className="w-3.5 h-3.5 text-zinc-400" />
                <span>Warna Teks</span>
              </label>
              {onTriggerPreview && (
                <button
                  type="button"
                  onClick={() => onTriggerPreview?.('profile_text_color')}
                  className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg text-[11px] font-medium text-emerald-400 hover:text-emerald-300 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/25 transition-all active:scale-95 cursor-pointer shadow-sm"
                  title="Lihat Pratinjau Langsung di Kamera"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Preview</span>
                </button>
              )}
            </div>
            <div className="p-2 sm:p-2.5 bg-zinc-900/60 rounded-2xl border border-zinc-800">
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
                          ? 'border-emerald-400 bg-emerald-500/15 text-emerald-300 ring-1 ring-emerald-400/40 shadow-sm'
                          : 'border-zinc-800/80 bg-zinc-900/80 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200'
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
                      ? 'border-emerald-400 bg-emerald-500/15 text-emerald-300 ring-1 ring-emerald-400/40 shadow-sm'
                      : 'border-zinc-800/80 bg-zinc-900/80 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200'
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

          {/* Slider Ukuran Teks */}
          <div
            className={`transition-all duration-150 ${
              activeSlider === 'profile_size'
                ? 'p-4 rounded-2xl bg-zinc-950/60 backdrop-blur-md border border-white/20 shadow-2xl relative z-50'
                : activeSlider !== null
                ? 'hidden'
                : ''
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2 min-w-0">
                <span
                  className={`text-xs font-semibold uppercase tracking-wider ${
                    activeSlider === 'profile_size' ? 'text-white font-bold' : 'text-zinc-300'
                  }`}
                >
                  Ukuran Teks Profil
                </span>
                <span className="px-2 py-0.5 rounded-md text-[11px] font-mono font-bold bg-zinc-800 text-emerald-400 border border-zinc-700/80 shrink-0">
                  {profile.fontSize || 13} px
                </span>
              </div>
              {onTriggerPreview && activeSlider !== 'profile_size' && (
                <button
                  type="button"
                  onClick={() => onTriggerPreview?.('profile_size')}
                  className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg text-[11px] font-medium text-emerald-400 hover:text-emerald-300 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/25 transition-all active:scale-95 cursor-pointer shadow-sm shrink-0"
                  title="Lihat Pratinjau Langsung di Kamera"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Preview</span>
                </button>
              )}
            </div>
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
              className="w-full accent-emerald-400 h-2 bg-zinc-800/80 rounded-lg cursor-pointer"
            />
          </div>

          {/* Mini Preview Profil */}
          <div
            className={`p-3 rounded-2xl bg-zinc-950/80 border border-zinc-800 transition-opacity duration-150 space-y-2 ${
              activeSlider ? 'hidden' : 'block'
            }`}
          >
            <div className="flex items-center justify-between">
              <p className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider">
                Pratinjau Tampilan Teks
              </p>
              <span className="text-[10px] text-zinc-500 font-mono">
                {profile.fontSize || 13}px • {profile.fontWeight || 'medium'}
              </span>
            </div>
            <div className="p-3 rounded-xl bg-zinc-900/60 border border-zinc-800/60 flex items-center justify-center overflow-x-auto min-h-[52px]">
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
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl shadow-md transition-all shrink-0 max-w-full ${
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
