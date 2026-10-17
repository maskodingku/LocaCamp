import React from 'react'
import { Upload, Trash2, Sparkles, Eye } from 'lucide-react'
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

const POSITIONS: { id: WatermarkPosition; label: string; col: string; row: string }[] = [
  { id: 'top-left', label: '↖ Atas Kiri', col: 'col-start-1', row: 'row-start-1' },
  { id: 'top-center', label: '↑ Atas Tengah', col: 'col-start-2', row: 'row-start-1' },
  { id: 'top-right', label: '↗ Atas Kanan', col: 'col-start-3', row: 'row-start-1' },
  { id: 'center', label: '• Tengah', col: 'col-start-2', row: 'row-start-2' },
  { id: 'bottom-left', label: '↙ Bawah Kiri', col: 'col-start-1', row: 'row-start-3' },
  { id: 'bottom-center', label: '↓ Bawah Tengah', col: 'col-start-2', row: 'row-start-3' },
  { id: 'bottom-right', label: '↘ Bawah Kanan', col: 'col-start-3', row: 'row-start-3' },
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
      {/* Section Profil Pengguna (Paling Atas) */}
      <ProfileSection
        profile={profile}
        onChangeProfile={onChangeProfile}
        activeSlider={activeSlider}
        setActiveSlider={setActiveSlider}
        onTriggerPreview={onTriggerPreview}
      />

      {/* SECTION 2: WATERMARK LOGO */}
      <div
        className={`relative rounded-2xl transition-all duration-150 ${
          activeSlider === 'watermark_size' || activeSlider === 'watermark_opacity'
            ? 'border-transparent bg-transparent shadow-none p-0 overflow-visible space-y-0'
            : activeSlider
            ? 'hidden'
            : 'border border-zinc-800/80 bg-zinc-900/40 backdrop-blur-md p-4 sm:p-5 overflow-hidden shadow-lg space-y-4'
        }`}
      >
        {/* Garis Aksen Vertikal Glassmorphism di samping kiri border (Menyatu Lengkung Penuh Atas & Bawah) */}
        <div
          className={`absolute -left-1 -top-1 -bottom-1 w-2.5 bg-gradient-to-b from-cyan-400/80 via-sky-300/60 to-cyan-400/80 border-r border-white/25 shadow-[0_0_14px_rgba(34,211,238,0.55),0_0_28px_rgba(6,182,212,0.3)] backdrop-blur-md transition-opacity duration-150 pointer-events-none ${
            activeSlider ? 'opacity-0' : 'opacity-100'
          }`}
        />

        {/* Header Section Watermark Logo */}
        <div
          className={`items-center gap-3 p-3.5 rounded-2xl bg-zinc-900/70 border border-zinc-800 transition-opacity duration-150 ${
            activeSlider ? 'hidden' : 'flex'
          }`}
        >
          <div className="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 flex items-center justify-center shrink-0">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white">Watermark Logo</h3>
            <p className="text-xs text-zinc-400">
              Unggah logo resmi, sesuaikan posisi, ukuran &amp; transparansi
            </p>
          </div>
        </div>

        {/* Upload Custom Logo */}
        <div
          className={`transition-opacity duration-150 ${
            activeSlider ? 'hidden' : 'block'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
              Unggah Logo / Gambar Sendiri
            </label>
            {onTriggerPreview && (
              <button
                type="button"
                onClick={() => onTriggerPreview?.('watermark_position')}
                className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg text-[11px] font-medium text-cyan-400 hover:text-cyan-300 bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/25 transition-all active:scale-95 cursor-pointer shadow-sm"
                title="Lihat Pratinjau Langsung di Kamera"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Preview</span>
              </button>
            )}
          </div>
          <div className="flex items-center gap-3">
            <label className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-dashed border-zinc-700 hover:border-zinc-500 bg-zinc-900 hover:bg-zinc-800/80 cursor-pointer transition-all text-sm font-medium text-zinc-200">
              <Upload className="w-4 h-4 text-zinc-400" />
              <span>Pilih Gambar (PNG/JPG/SVG)</span>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileUpload}
              />
            </label>
            {watermark.imageUrl && (
              <button
                type="button"
                onClick={() => onChangeWatermark({ ...watermark, imageUrl: '' })}
                className="p-3 rounded-xl border border-rose-500/20 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 transition-colors"
                title="Hapus Watermark"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Preview Logo Aktif */}
        <div
          className={`transition-opacity duration-150 ${
            activeSlider ? 'hidden' : 'block'
          }`}
        >
          {watermark.imageUrl ? (
            <div className="p-3.5 rounded-2xl bg-zinc-900/60 border border-zinc-800 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 overflow-hidden">
                <div className="w-14 h-14 rounded-xl bg-black/60 border border-zinc-800 flex items-center justify-center p-1.5 shrink-0">
                  <img
                    src={watermark.imageUrl}
                    alt="Logo Aktif"
                    className="max-w-full max-h-full object-contain"
                  />
                </div>
                <div className="overflow-hidden">
                  <p className="text-xs font-semibold text-white">Logo Aktif</p>
                  <p className="text-[11px] text-zinc-400">Siap dicetak pada hasil foto</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => onChangeWatermark({ ...watermark, imageUrl: '' })}
                className="p-2.5 rounded-xl border border-rose-500/20 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 transition-colors shrink-0"
                title="Hapus Logo"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="p-3.5 rounded-xl border border-dashed border-zinc-800 text-center bg-zinc-900/30">
              <p className="text-xs text-zinc-500 italic">Belum ada logo yang diunggah</p>
            </div>
          )}
        </div>

        {/* Position Selector (9-Grid) */}
        {watermark.imageUrl && (
          <div
            className={`transition-opacity duration-150 ${
              activeSlider ? 'hidden' : 'block'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
                Posisi Watermark di Foto
              </label>
              {onTriggerPreview && (
                <button
                  type="button"
                  onClick={() => onTriggerPreview?.('watermark_position')}
                  className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg text-[11px] font-medium text-cyan-400 hover:text-cyan-300 bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/25 transition-all active:scale-95 cursor-pointer shadow-sm"
                  title="Lihat Pratinjau Langsung di Kamera"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Preview</span>
                </button>
              )}
            </div>
            <div className="grid grid-cols-3 gap-2 p-3 bg-zinc-900/60 rounded-2xl border border-zinc-800">
              {POSITIONS.map(pos => {
                const active = watermark.position === pos.id
                return (
                  <button
                    key={pos.id}
                    type="button"
                    onClick={() =>
                      onChangeWatermark({ ...watermark, position: pos.id })
                    }
                    className={`py-2 px-3 rounded-lg text-xs font-medium transition-all ${
                      active
                        ? 'bg-white text-zinc-950 font-semibold shadow-md'
                        : 'bg-zinc-800/60 text-zinc-300 hover:bg-zinc-700/60'
                    }`}
                  >
                    {pos.label}
                  </button>
                )
              })}
            </div>
          </div>
        )}

        {/* Sliders: Size and Opacity */}
        {watermark.imageUrl && (
          <div className={`space-y-4 pt-1 ${activeSlider ? 'space-y-0 pt-0' : ''}`}>
            <div
              className={`transition-all duration-150 ${
                activeSlider === 'watermark_size'
                  ? 'p-4 rounded-2xl bg-zinc-950/60 backdrop-blur-md border border-white/20 shadow-2xl relative z-50'
                  : activeSlider !== null
                  ? 'hidden'
                  : ''
              }`}
            >
              <div className="flex items-center justify-between text-xs font-semibold text-zinc-400 mb-1.5">
                <div className="flex items-center gap-2">
                  <span className={activeSlider === 'watermark_size' ? 'text-white font-bold' : ''}>Ukuran Watermark</span>
                  <span className="text-zinc-200 font-mono">{watermark.sizePercent}% lebar foto</span>
                </div>
                {onTriggerPreview && activeSlider !== 'watermark_size' && (
                  <button
                    type="button"
                    onClick={() => onTriggerPreview?.('watermark_size')}
                    className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg text-[11px] font-medium text-cyan-400 hover:text-cyan-300 bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/25 transition-all active:scale-95 cursor-pointer shadow-sm"
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
                className="w-full accent-white h-1.5 bg-zinc-800 rounded-lg cursor-pointer"
              />
            </div>

            <div
              className={`transition-all duration-150 ${
                activeSlider === 'watermark_opacity'
                  ? 'p-4 rounded-2xl bg-zinc-950/60 backdrop-blur-md border border-white/20 shadow-2xl relative z-50'
                  : activeSlider !== null
                  ? 'hidden'
                  : ''
              }`}
            >
              <div className="flex items-center justify-between text-xs font-semibold text-zinc-400 mb-1.5">
                <div className="flex items-center gap-2">
                  <span className={activeSlider === 'watermark_opacity' ? 'text-white font-bold' : ''}>Transparansi (Opacity)</span>
                  <span className="text-zinc-200 font-mono">{Math.round(watermark.opacity * 100)}%</span>
                </div>
                {onTriggerPreview && activeSlider !== 'watermark_opacity' && (
                  <button
                    type="button"
                    onClick={() => onTriggerPreview?.('watermark_opacity')}
                    className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg text-[11px] font-medium text-cyan-400 hover:text-cyan-300 bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/25 transition-all active:scale-95 cursor-pointer shadow-sm"
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
                className="w-full accent-white h-1.5 bg-zinc-800 rounded-lg cursor-pointer"
              />
            </div>
          </div>
        )}
      </div>
    </>
  )
}
