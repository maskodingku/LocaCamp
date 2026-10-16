import React from 'react'
import { User, Briefcase, Type, MapPin, Check } from 'lucide-react'
import type { ProfileConfig, ProfilePosition, ProfileFontWeight } from '../../../types/camera'

interface ProfileSectionProps {
  profile: ProfileConfig
  onChangeProfile: (cfg: ProfileConfig) => void
  activeSlider: string | null
  setActiveSlider: (slider: string | null) => void
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
}) => {
  return (
    <div
      className={`relative rounded-2xl transition-all duration-150 ${
        activeSlider === 'profile_size'
          ? 'border-transparent bg-transparent shadow-none p-0 overflow-visible space-y-0'
          : activeSlider
          ? 'hidden'
          : 'border border-zinc-800/80 bg-zinc-900/40 backdrop-blur-md p-4 sm:p-5 shadow-lg overflow-hidden space-y-4'
      }`}
    >
      {/* Garis Aksen Vertikal Glassmorphism di samping kiri border */}
      <div
        className={`absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-emerald-400 via-teal-400 to-emerald-600 shadow-[0_0_12px_rgba(16,185,129,0.5)] transition-opacity duration-150 ${
          activeSlider ? 'opacity-0 pointer-events-none' : 'opacity-100'
        }`}
      />

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
              <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1.5 flex items-center gap-1.5">
                <Briefcase className="w-3.5 h-3.5 text-zinc-400" />
                <span>Jabatan / Posisi</span>
              </label>
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
              <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1.5 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-zinc-400" />
                <span>Nama Lengkap</span>
              </label>
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
            <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1.5 flex items-center gap-1.5">
              <Type className="w-3.5 h-3.5 text-zinc-400" />
              <span>Jenis Font Profil</span>
            </label>
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
            <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1.5 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-zinc-400" />
              <span>Posisi Profil di Foto</span>
            </label>
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
            <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1.5">
              Ketebalan Teks
            </label>
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
            <div className="flex justify-between text-xs font-semibold text-zinc-400 mb-1.5">
              <span className={activeSlider === 'profile_size' ? 'text-white font-bold' : ''}>
                Ukuran Teks Profil
              </span>
              <span className="text-zinc-200 font-mono">{profile.fontSize || 13} px</span>
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
                fontFamily: profile.fontFamily,
                fontWeight:
                  profile.fontWeight === 'bold'
                    ? 700
                    : profile.fontWeight === 'semibold'
                    ? 600
                    : profile.fontWeight === 'medium'
                    ? 500
                    : 400,
                fontSize: `${profile.fontSize || 13}px`,
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-900/90 text-white border border-white/10 shadow-sm"
            >
              <User className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
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
