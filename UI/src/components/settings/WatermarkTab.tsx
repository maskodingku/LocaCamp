import React from 'react'
import { Upload, Trash2, Sparkles, Eye, RefreshCw } from 'lucide-react'
import type { WatermarkConfig, WatermarkPosition, ProfileConfig } from '../../types/camera'
import { optimizeWatermarkImage } from '../../utils/storage'
import { ProfileSection } from './watermark/ProfileSection'

interface WatermarkTabProps {
  watermark: WatermarkConfig
  onChangeWatermark: (cfg: WatermarkConfig) => void
  profile: ProfileConfig
  onChangeProfile: (cfg: ProfileConfig) => void
  activeSlider: string | null
  setActiveSlider: (slider: string | null) => void
  onTriggerPreview?: (inputId: string) => void
}

const WATERMARK_GRID_POSITIONS: { id: WatermarkPosition; label: string; icon: string }[] = [
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

export const WatermarkTab: React.FC<WatermarkTabProps> = ({
  watermark,
  onChangeWatermark,
  profile,
  onChangeProfile,
  activeSlider,
  setActiveSlider,
  onTriggerPreview,
}) => {
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = async event => {
      const result = event.target?.result as string
      if (result) {
        const optimized = await optimizeWatermarkImage(result)
        onChangeWatermark({
          ...watermark,
          imageUrl: optimized,
        })
      }
    }
    reader.readAsDataURL(file)
  }

  return (
    <>
      {/* Section 1: Profil Pengguna (Paling Atas) */}
      <ProfileSection
        profile={profile}
        onChangeProfile={onChangeProfile}
        activeSlider={activeSlider}
        setActiveSlider={setActiveSlider}
        onTriggerPreview={onTriggerPreview}
      />

      {/* SECTION 2: WATERMARK LOGO */}
      <div
        className={`relative rounded-[22px] sm:rounded-[26px] border border-cyan-400/60 transition-all duration-150 overflow-hidden mt-4 sm:mt-5 ${
          activeSlider === 'watermark_size' || activeSlider === 'watermark_opacity'
            ? 'border-transparent bg-transparent shadow-none p-0 overflow-visible space-y-0'
            : activeSlider
            ? 'hidden'
            : 'bg-[#031d28]/75 backdrop-blur-md p-4 sm:p-5 shadow-[0_0_20px_rgba(6,182,212,0.3),inset_0_0_16px_rgba(6,182,212,0.15)] space-y-4'
        }`}
      >
        {/* Specular Glint Top-Left */}
        <div className="pointer-events-none absolute top-1 left-1 w-2.5 h-2.5 bg-cyan-300 rounded-full blur-[1px] opacity-80" />
        <div className="pointer-events-none absolute top-1.5 left-1.5 w-1 h-1 bg-white rounded-full shadow-[0_0_6px_#fff]" />
        {/* Header Section Watermark Logo */}
        <div
          className={`items-center gap-3 p-3 rounded-2xl bg-black/25 backdrop-blur-sm border border-cyan-500/20 transition-opacity duration-150 ${
            activeSlider ? 'hidden' : 'flex'
          }`}
        >
          <div className="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 flex items-center justify-center shrink-0 shadow-[0_0_12px_rgba(6,182,212,0.3)]">
            <Sparkles className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <h3 className="text-sm font-semibold text-white truncate">Watermark Logo</h3>
            <p className="text-xs text-zinc-400 truncate">
              Unggah logo resmi, sesuaikan posisi, ukuran &amp; transparansi
            </p>
          </div>
        </div>

        {/* Upload & Preview Logo Aktif */}
        <div
          className={`transition-opacity duration-150 ${
            activeSlider ? 'hidden' : 'block'
          }`}
        >
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-zinc-300">
              Logo Watermark
            </label>
            {onTriggerPreview && (
              <button
                type="button"
                onClick={() => onTriggerPreview?.('watermark_position')}
                className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg text-[11px] font-medium text-cyan-400 hover:text-cyan-300 bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 transition-all active:scale-95 cursor-pointer shadow-sm"
                title="Lihat Pratinjau Langsung di Kamera"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Preview</span>
              </button>
            )}
          </div>

          {watermark.imageUrl ? (
            /* Card Saat Logo Sudah Terpasang */
            <div className="p-3 sm:p-3.5 rounded-2xl bg-black/25 border border-cyan-500/20 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-12 h-12 rounded-xl bg-black/50 border border-cyan-800/40 flex items-center justify-center p-1.5 shrink-0 overflow-hidden shadow-inner">
                  <img
                    src={watermark.imageUrl}
                    alt="Logo Aktif"
                    className="max-w-full max-h-full object-contain"
                  />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-white truncate">Logo Terpasang</p>
                  <p className="text-[11px] text-zinc-400 truncate">Siap dicetak pada hasil foto</p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <label className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-cyan-800/60 bg-black/40 hover:bg-black/60 text-xs font-medium text-zinc-200 cursor-pointer transition-all active:scale-95 shadow-sm">
                  <RefreshCw className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Ganti</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileUpload}
                  />
                </label>
                <button
                  type="button"
                  onClick={() => onChangeWatermark({ ...watermark, imageUrl: '' })}
                  className="p-2 rounded-xl border border-rose-500/25 bg-rose-500/15 hover:bg-rose-500/25 text-rose-300 transition-all active:scale-95 shadow-sm"
                  title="Hapus Logo"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            /* Dropzone Saat Belum Ada Logo */
            <label className="flex flex-col items-center justify-center gap-2 p-5 rounded-2xl border-2 border-dashed border-cyan-500/35 hover:border-cyan-400 bg-black/20 hover:bg-black/35 cursor-pointer transition-all group">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400 group-hover:scale-105 transition-transform shadow-sm">
                <Upload className="w-5 h-5" />
              </div>
              <div className="text-center">
                <span className="text-xs font-semibold text-zinc-200 block group-hover:text-cyan-300 transition-colors">
                  Pilih Logo (PNG / JPG / SVG)
                </span>
                <span className="text-[11px] text-zinc-400 mt-0.5 block">
                  Disarankan format PNG transparan agar rapi pada foto
                </span>
              </div>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileUpload}
              />
            </label>
          )}
        </div>

        {/* Position Selector (9-Grid) */}
        {watermark.imageUrl && (
          <div
            className={`transition-opacity duration-150 ${
              activeSlider ? 'hidden' : 'block'
            }`}
          >
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-zinc-300">
                Posisi Watermark di Foto
              </label>
              {onTriggerPreview && (
                <button
                  type="button"
                  onClick={() => onTriggerPreview?.('watermark_position')}
                  className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg text-[11px] font-medium text-cyan-400 hover:text-cyan-300 bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 transition-all active:scale-95 cursor-pointer shadow-sm"
                  title="Lihat Pratinjau Langsung di Kamera"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Preview</span>
                </button>
              )}
            </div>
            <div className="grid grid-cols-3 gap-1.5 p-2 bg-black/25 rounded-2xl border border-cyan-500/20">
              {WATERMARK_GRID_POSITIONS.map(pos => {
                const active = watermark.position === pos.id
                return (
                  <button
                    key={pos.id}
                    type="button"
                    onClick={() =>
                      onChangeWatermark({ ...watermark, position: pos.id })
                    }
                    className={`py-2 px-1 rounded-lg text-[11px] sm:text-xs font-medium transition-all flex items-center justify-center gap-1 truncate ${
                      active
                        ? 'bg-cyan-400 text-black font-black shadow-[0_0_12px_rgba(34,211,238,0.7)]'
                        : 'bg-black/30 text-zinc-300 hover:bg-black/50 hover:text-white border border-cyan-950/40'
                    }`}
                  >
                    <span className="text-cyan-400 font-bold shrink-0">{pos.icon}</span>
                    <span className="truncate">{pos.label}</span>
                  </button>
                )
              })}
            </div>
          </div>
        )}

        {/* Sliders: Size and Opacity */}
        {watermark.imageUrl && (
          <div className={`space-y-4 pt-1 ${activeSlider ? 'space-y-0 pt-0' : ''}`}>
            {/* Ukuran Watermark Slider */}
            <div
              className={`transition-all duration-150 ${
                activeSlider === 'watermark_size'
                  ? 'p-4 rounded-2xl bg-zinc-950/80 backdrop-blur-md border border-cyan-400/60 shadow-[0_0_25px_rgba(6,182,212,0.5)] relative z-50'
                  : activeSlider !== null
                  ? 'hidden'
                  : ''
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2 min-w-0">
                  <span
                    className={`text-xs font-semibold uppercase tracking-wider ${
                      activeSlider === 'watermark_size' ? 'text-white font-bold' : 'text-zinc-300'
                    }`}
                  >
                    Ukuran Watermark
                  </span>
                  <span className="px-2 py-0.5 rounded-md text-[11px] font-mono font-bold bg-cyan-950/60 text-cyan-300 border border-cyan-800/60 shrink-0">
                    {watermark.sizePercent}% lebar
                  </span>
                </div>
                {onTriggerPreview && activeSlider !== 'watermark_size' && (
                  <button
                    type="button"
                    onClick={() => onTriggerPreview?.('watermark_size')}
                    className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg text-[11px] font-medium text-cyan-400 hover:text-cyan-300 bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 transition-all active:scale-95 cursor-pointer shadow-sm shrink-0"
                    title="Lihat Pratinjau Langsung di Kamera"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Preview</span>
                  </button>
                )}
              </div>
              <input
                type="range"
                min={8}
                max={45}
                value={watermark.sizePercent}
                onPointerDown={() => setActiveSlider('watermark_size')}
                onTouchStart={() => setActiveSlider('watermark_size')}
                onMouseDown={() => setActiveSlider('watermark_size')}
                onPointerUp={() => setActiveSlider(null)}
                onTouchEnd={() => setActiveSlider(null)}
                onMouseUp={() => setActiveSlider(null)}
                onChange={e =>
                  onChangeWatermark({
                    ...watermark,
                    sizePercent: Number(e.target.value),
                  })
                }
                className="w-full accent-cyan-400 h-2 bg-black/40 rounded-lg cursor-pointer"
              />
            </div>

            {/* Opacity Slider */}
            <div
              className={`transition-all duration-150 ${
                activeSlider === 'watermark_opacity'
                  ? 'p-4 rounded-2xl bg-zinc-950/80 backdrop-blur-md border border-cyan-400/60 shadow-[0_0_25px_rgba(6,182,212,0.5)] relative z-50'
                  : activeSlider !== null
                  ? 'hidden'
                  : ''
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2 min-w-0">
                  <span
                    className={`text-xs font-semibold uppercase tracking-wider ${
                      activeSlider === 'watermark_opacity' ? 'text-white font-bold' : 'text-zinc-300'
                    }`}
                  >
                    Transparansi (Opacity)
                  </span>
                  <span className="px-2 py-0.5 rounded-md text-[11px] font-mono font-bold bg-cyan-950/60 text-cyan-300 border border-cyan-800/60 shrink-0">
                    {Math.round(watermark.opacity * 100)}%
                  </span>
                </div>
                {onTriggerPreview && activeSlider !== 'watermark_opacity' && (
                  <button
                    type="button"
                    onClick={() => onTriggerPreview?.('watermark_opacity')}
                    className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg text-[11px] font-medium text-cyan-400 hover:text-cyan-300 bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 transition-all active:scale-95 cursor-pointer shadow-sm shrink-0"
                    title="Lihat Pratinjau Langsung di Kamera"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Preview</span>
                  </button>
                )}
              </div>
              <input
                type="range"
                min={0.15}
                max={1.0}
                step={0.05}
                value={watermark.opacity}
                onPointerDown={() => setActiveSlider('watermark_opacity')}
                onTouchStart={() => setActiveSlider('watermark_opacity')}
                onMouseDown={() => setActiveSlider('watermark_opacity')}
                onPointerUp={() => setActiveSlider(null)}
                onTouchEnd={() => setActiveSlider(null)}
                onMouseUp={() => setActiveSlider(null)}
                onChange={e =>
                  onChangeWatermark({
                    ...watermark,
                    opacity: Number(e.target.value),
                  })
                }
                className="w-full accent-cyan-400 h-2 bg-black/40 rounded-lg cursor-pointer"
              />
            </div>
          </div>
        )}
      </div>
    </>
  )
}
