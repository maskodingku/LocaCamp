import React from 'react'
import { User, Briefcase, Type, MapPin, Check, Eye, Square, Palette, Paintbrush } from 'lucide-react'
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
  { id: 'rgba(9, 9, 11, 0.78)', label: 'Hitam Kaca (Default)', preview: 'rgba(9, 9, 11, 0.78)' },
  { id: 'transparent', label: 'Transparan', preview: 'transparent' },
  { id: '#09090b', label: 'Hitam Pekat', preview: '#09090b' },
  { id: 'rgba(15, 23, 42, 0.85)', label: 'Biru Navy', preview: 'rgba(15, 23, 42, 0.85)' },
  { id: 'rgba(8, 47, 73, 0.85)', label: 'Cyber Cyan', preview: 'rgba(8, 47, 73, 0.85)' },
  { id: 'rgba(6, 78, 59, 0.85)', label: 'Emerald Hijau', preview: 'rgba(6, 78, 59, 0.85)' },
  { id: 'rgba(120, 53, 15, 0.85)', label: 'Amber Emas', preview: 'rgba(120, 53, 15, 0.85)' },
  { id: 'rgba(255, 255, 255, 0.2)', label: 'Putih Kaca', preview: 'rgba(255, 255, 255, 0.2)' },
  { id: '#ffffff', label: 'Putih Pekat', preview: '#ffffff' },
]

export const PROFILE_TEXT_PRESETS = [
  { id: '#ffffff', label: 'Putih (Default)', preview: '#ffffff' },
  { id: '#22d3ee', label: 'Cyan Neon', preview: '#22d3ee' },
  { id: '#34d399', label: 'Emerald Hijau', preview: '#34d399' },
  { id: '#fbbf24', label: 'Amber Emas', preview: '#fbbf24' },
  { id: '#38bdf8', label: 'Biru Langit', preview: '#38bdf8' },
  { id: '#f43f5e', label: 'Rose Merah', preview: '#f43f5e' },
  { id: '#facc15', label: 'Kuning', preview: '#facc15' },
  { id: '#09090b', label: 'Hitam Gelap', preview: '#09090b' },
]

const FONT_WEIGHTS: { id: ProfileFontWeight; label: string; weight: number }[] = [
  { id: 'normal', label: 'Normal', weight: 400 },
  { id: 'medium', label: 'Sedang', weight: 500 },
  { id: 'semibold', label: 'Semi Bold', weight: 600 },
  { id: 'bold', label: 'Tebal', weight: 700 },
]

const PROFILE_POSITIONS: { id: ProfilePosition; label: string }[] = [
  { id: 'above-geotag', label: '★ Di Atas Geotag' },
  { id: 'top-left', label: '↖ Atas Kiri' },
  { id: 'top-center', label: '↑ Atas Tengah' },
  { id: 'top-right', label: '↗ Atas Kanan' },
  { id: 'bottom-left', label: '↙ Bawah Kiri' },
  { id: 'bottom-center', label: '↓ Bawah Tengah' },
  { id: 'bottom-right', label: '↘ Bawah Kanan' },
]

export const ProfileSection: React.FC<ProfileSectionProps> = ({
  profile,
  onChangeProfile,
  activeSlider,
  setActiveSlider,
  onTriggerPreview,
}) => {
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
        <div className="flex items-center gap-3">
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
              profile.enabled
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                : 'bg-zinc-800 text-zinc-400 border border-zinc-700/50'
            }`}
          >
            <User className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-semibold text-white">Profil Pengguna</h3>
              {profile.enabled && (
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  Aktif
                </span>
              )}
            </div>
            <p className="text-xs text-zinc-400">
              Cantumkan nama &amp; jabatan survei pada foto
            </p>
          </div>
        </div>

        {/* Toggle Switch */}
        <label className="relative inline-flex items-center cursor-pointer">
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
                className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-700/80 focus:border-emerald-500 text-sm text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-all"
              />
            </div>

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
                className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-700/80 focus:border-emerald-500 text-sm text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-all"
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
                className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-700/80 focus:border-emerald-500 text-sm text-zinc-100 focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-all appearance-none cursor-pointer"
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
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 p-2 bg-zinc-900/60 rounded-2xl border border-zinc-800">
              {PROFILE_POSITIONS.map(pos => {
                const active = (profile.position || 'above-geotag') === pos.id
                return (
                  <button
                    key={pos.id}
                    type="button"
                    onClick={() =>
                      onChangeProfile({
                        ...profile,
                        position: pos.id,
                      })
                    }
                    className={`py-2 px-2.5 rounded-lg text-xs font-medium transition-all text-left flex items-center justify-between ${
                      active
                        ? 'bg-white text-zinc-950 font-semibold shadow-md'
                        : 'bg-zinc-800/60 text-zinc-300 hover:bg-zinc-700/60'
                    }`}
                  >
                    <span className="truncate">{pos.label}</span>
                    {active && <Check className="w-3.5 h-3.5 shrink-0" />}
                  </button>
                )
              })}
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
                    className={`py-1.5 px-2 rounded-lg text-xs transition-all text-center ${
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
            className={`p-3.5 rounded-2xl bg-zinc-900/60 border border-zinc-800 flex items-center justify-between transition-opacity duration-150 ${
              activeSlider ? 'hidden' : 'flex'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Square className="w-4 h-4 text-zinc-400" />
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold uppercase tracking-wider text-zinc-300">
                    Garis Tepi (Border)
                  </span>
                  {onTriggerPreview && (
                    <button
                      type="button"
                      onClick={() => onTriggerPreview?.('profile_border')}
                      className="flex items-center gap-1.5 px-2 py-0.5 rounded-lg text-[10px] font-medium text-emerald-400 hover:text-emerald-300 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/25 transition-all active:scale-95 cursor-pointer shadow-sm"
                      title="Lihat Pratinjau Langsung di Kamera"
                    >
                      <Eye className="w-3 h-3" />
                      <span>Preview</span>
                    </button>
                  )}
                </div>
                <p className="text-[11px] text-zinc-400">
                  {profile.showBorder !== false ? 'Garis tepi aktif' : 'Garis tepi dihilangkan (borderless)'}
                </p>
              </div>
            </div>

            <label className="relative inline-flex items-center cursor-pointer">
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
            <div className="p-2.5 bg-zinc-900/60 rounded-2xl border border-zinc-800 space-y-2">
              <div className="flex flex-wrap items-center gap-1.5">
                {PROFILE_BG_PRESETS.map(preset => {
                  const active = (profile.backgroundColor || 'rgba(9, 9, 11, 0.78)') === preset.id
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
                      className={`h-7 px-2.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 border ${
                        active
                          ? 'border-emerald-400 bg-emerald-500/20 text-emerald-300 ring-1 ring-emerald-400/50'
                          : 'border-zinc-700/80 bg-zinc-800/80 text-zinc-300 hover:border-zinc-500'
                      }`}
                      title={preset.label}
                    >
                      <span
                        className="w-3.5 h-3.5 rounded-full border border-white/20 shrink-0"
                        style={{
                          backgroundColor: preset.preview === 'transparent' ? 'transparent' : preset.preview,
                          backgroundImage: preset.preview === 'transparent' ? 'linear-gradient(45deg, #555 25%, transparent 25%, transparent 75%, #555 75%, #555), linear-gradient(45deg, #555 25%, transparent 25%, transparent 75%, #555 75%, #555)' : undefined,
                          backgroundSize: '4px 4px',
                          backgroundPosition: '0 0, 2px 2px',
                        }}
                      />
                      <span>{preset.label.split(' ')[0]}</span>
                    </button>
                  )
                })}
              </div>

              {/* Custom Color Input */}
              <div className="flex items-center gap-2 pt-1.5 border-t border-zinc-800/60">
                <span className="text-[11px] text-zinc-400">Warna Bebas:</span>
                <input
                  type="color"
                  value={
                    profile.backgroundColor?.startsWith('#')
                      ? profile.backgroundColor
                      : '#09090b'
                  }
                  onChange={e =>
                    onChangeProfile({
                      ...profile,
                      backgroundColor: e.target.value,
                    })
                  }
                  className="w-7 h-7 rounded-lg bg-transparent border border-zinc-700 cursor-pointer p-0.5"
                />
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
            <div className="p-2.5 bg-zinc-900/60 rounded-2xl border border-zinc-800 space-y-2">
              <div className="flex flex-wrap items-center gap-1.5">
                {PROFILE_TEXT_PRESETS.map(preset => {
                  const active = (profile.textColor || '#ffffff') === preset.id
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
                      className={`h-7 px-2.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 border ${
                        active
                          ? 'border-emerald-400 bg-emerald-500/20 text-emerald-300 ring-1 ring-emerald-400/50'
                          : 'border-zinc-700/80 bg-zinc-800/80 text-zinc-300 hover:border-zinc-500'
                      }`}
                      title={preset.label}
                    >
                      <span
                        className="w-3.5 h-3.5 rounded-full border border-white/20 shrink-0"
                        style={{ backgroundColor: preset.preview }}
                      />
                      <span>{preset.label.split(' ')[0]}</span>
                    </button>
                  )
                })}
              </div>

              {/* Custom Color Input */}
              <div className="flex items-center gap-2 pt-1.5 border-t border-zinc-800/60">
                <span className="text-[11px] text-zinc-400">Warna Bebas:</span>
                <input
                  type="color"
                  value={
                    profile.textColor?.startsWith('#')
                      ? profile.textColor
                      : '#ffffff'
                  }
                  onChange={e =>
                    onChangeProfile({
                      ...profile,
                      textColor: e.target.value,
                    })
                  }
                  className="w-7 h-7 rounded-lg bg-transparent border border-zinc-700 cursor-pointer p-0.5"
                />
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
            <div className="flex items-center justify-between text-xs font-semibold text-zinc-400 mb-1.5">
              <div className="flex items-center gap-2">
                <span className={activeSlider === 'profile_size' ? 'text-white font-bold' : ''}>
                  Ukuran Teks Profil
                </span>
                <span className="text-zinc-200 font-mono">{profile.fontSize || 13} px</span>
              </div>
              {onTriggerPreview && activeSlider !== 'profile_size' && (
                <button
                  type="button"
                  onClick={() => onTriggerPreview?.('profile_size')}
                  className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg text-[11px] font-medium text-emerald-400 hover:text-emerald-300 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/25 transition-all active:scale-95 cursor-pointer shadow-sm"
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
              className="w-full accent-emerald-400 h-1.5 bg-zinc-800 rounded-lg cursor-pointer"
            />
          </div>

          {/* Mini Preview Profil */}
          <div
            className={`p-3 rounded-xl bg-zinc-950/80 border border-zinc-800 transition-opacity duration-150 ${
              activeSlider ? 'hidden' : 'block'
            }`}
          >
            <p className="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider mb-1.5">
              Pratinjau Tampilan Teks
            </p>
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
                backgroundColor: profile.backgroundColor || 'rgba(9, 9, 11, 0.78)',
                color: profile.textColor || '#ffffff',
              }}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl shadow-md transition-all ${
                profile.showBorder !== false ? 'border border-white/20' : 'border-0'
              }`}
            >
              <User
                className="w-3.5 h-3.5 shrink-0"
                style={{
                  color: (profile.textColor || '#ffffff') === '#ffffff' ? '#34d399' : profile.textColor,
                }}
              />
              <span>
                {profile.name || profile.jobTitle
                  ? [profile.name, profile.jobTitle].filter(Boolean).join(' • ')
                  : 'Nama • Jabatan'}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
