import React from 'react'
import { Upload, Trash2 } from 'lucide-react'
import type { WatermarkConfig, WatermarkPosition } from '../../types/camera'
import { optimizeWatermarkImage } from '../../utils/storage'

interface WatermarkTabProps {
  watermark: WatermarkConfig
  onChangeWatermark: (cfg: WatermarkConfig) => void
  activeSlider: string | null
  setActiveSlider: (slider: string | null) => void
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
  activeSlider,
  setActiveSlider,
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
      {/* Upload Custom Logo */}
      <div
        className={`transition-opacity duration-150 ${
          activeSlider ? 'opacity-0 pointer-events-none' : 'opacity-100'
        }`}
      >
        <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-2">
          Unggah Logo / Gambar Sendiri
        </label>
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
          activeSlider ? 'opacity-0 pointer-events-none' : 'opacity-100'
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
            activeSlider ? 'opacity-0 pointer-events-none' : 'opacity-100'
          }`}
        >
          <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-2">
            Posisi Watermark di Foto
          </label>
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
        <div className="space-y-4 pt-1">
          <div
            className={`transition-all duration-150 ${
              activeSlider === 'watermark_size'
                ? 'p-4 rounded-2xl bg-zinc-950/90 backdrop-blur-xl border border-white/50 shadow-2xl ring-2 ring-white/30 relative z-50'
                : activeSlider !== null
                ? 'opacity-0 pointer-events-none'
                : ''
            }`}
          >
            <div className="flex justify-between text-xs font-semibold text-zinc-400 mb-1.5">
              <span className={activeSlider === 'watermark_size' ? 'text-white font-bold' : ''}>Ukuran Watermark</span>
              <span className="text-zinc-200 font-mono">{watermark.sizePercent}% lebar foto</span>
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
                ? 'p-4 rounded-2xl bg-zinc-950/90 backdrop-blur-xl border border-white/50 shadow-2xl ring-2 ring-white/30 relative z-50'
                : activeSlider !== null
                ? 'opacity-0 pointer-events-none'
                : ''
            }`}
          >
            <div className="flex justify-between text-xs font-semibold text-zinc-400 mb-1.5">
              <span className={activeSlider === 'watermark_opacity' ? 'text-white font-bold' : ''}>Transparansi (Opacity)</span>
              <span className="text-zinc-200 font-mono">{Math.round(watermark.opacity * 100)}%</span>
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
    </>
  )
}
