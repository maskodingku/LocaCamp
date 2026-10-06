import React, { useState } from 'react'
import {
  Check,
  Sliders,
  Sun,
  Contrast,
  Palette,
  RotateCcw,
  ChevronLeft,
} from 'lucide-react'
import type {
  CameraEffectConfig,
  CameraEffectPreset,
} from '../../types/camera'
import type { OrientationAngle } from '../../hooks/useOrientation'

interface LivePresetBarProps {
  cameraEffect: CameraEffectConfig
  onChangeCameraEffect: (cfg: CameraEffectConfig) => void
  onCapture: () => void
  isCapturing: boolean
  isReady: boolean
  onClose: () => void
  isLandscape?: boolean
  rotationAngle?: OrientationAngle
}

const PRESETS: {
  id: CameraEffectPreset
  label: string
  icon: string
  sub: string
}[] = [
  { id: 'vivid', label: 'Vivid', icon: '✨', sub: 'Cerah' },
  { id: 'normal', label: 'Normal', icon: '🌿', sub: 'Alami' },
  { id: 'warm', label: 'Warm', icon: '🌅', sub: 'Hangat' },
  { id: 'cool', label: 'Cool', icon: '❄️', sub: 'Sejuk' },
  { id: 'hdr', label: 'HDR', icon: '🔮', sub: 'Detail' },
  { id: 'monochrome', label: 'B&W', icon: '🖤', sub: 'Monokrom' },
]

export const LivePresetBar: React.FC<LivePresetBarProps> = ({
  cameraEffect,
  onChangeCameraEffect,
  onCapture,
  isCapturing,
  isReady,
  onClose,
  isLandscape = false,
  rotationAngle = 0,
}) => {
  const [activeTab, setActiveTab] = useState<'presets' | 'finetune'>('presets')

  const hasFinetune =
    cameraEffect.finetune.brightness !== 0 ||
    cameraEffect.finetune.contrast !== 0 ||
    cameraEffect.finetune.saturation !== 0

  const iconRotateClass =
    rotationAngle === 90
      ? '-rotate-90'
      : rotationAngle === 270
      ? 'rotate-90'
      : rotationAngle === 180
      ? 'rotate-180'
      : ''

  // =================== LAYOUT LANDSCAPE (Kanan Layar) ===================
  if (isLandscape) {
    return (
      <aside
        className="h-full w-28 md:w-32 bg-zinc-950/95 border-l border-zinc-800/90 py-3 px-2 flex flex-col items-center justify-between z-20 shrink-0 select-none shadow-2xl animate-in slide-in-from-right duration-200"
        aria-label="Panel Live Preset Landscape"
      >
        {/* Tombol Selesai / Tutup di Atas */}
        <button
          type="button"
          onClick={onClose}
          className="w-full py-1.5 px-2 rounded-xl bg-white text-zinc-950 font-bold text-[11px] flex items-center justify-center gap-1 shadow-md active:scale-95 transition-all"
          title="Tutup Bar Preset"
        >
          <Check className="w-3.5 h-3.5" />
          <span>Selesai</span>
        </button>

        {/* Daftar Preset Vertikal (Scrollable jika layar pendek) */}
        <div className="flex-1 w-full my-2 overflow-y-auto space-y-1.5 px-0.5 py-1">
          {PRESETS.map(preset => {
            const isSelected = cameraEffect.preset === preset.id
            return (
              <button
                key={preset.id}
                type="button"
                onClick={() =>
                  onChangeCameraEffect({
                    ...cameraEffect,
                    preset: preset.id,
                  })
                }
                className={`w-full py-2 px-1.5 rounded-xl text-left flex items-center gap-1.5 transition-all ${
                  isSelected
                    ? 'bg-emerald-500 text-black font-bold shadow-md ring-1 ring-emerald-400'
                    : 'bg-zinc-900/80 text-zinc-300 border border-zinc-800 hover:bg-zinc-800'
                }`}
              >
                <span className="text-sm shrink-0">{preset.icon}</span>
                <div className="min-w-0 flex-1 leading-tight">
                  <div className="text-[11px] truncate">{preset.label}</div>
                  <div
                    className={`text-[9px] truncate ${
                      isSelected ? 'text-zinc-900 font-medium' : 'text-zinc-500'
                    }`}
                  >
                    {preset.sub}
                  </div>
                </div>
              </button>
            )
          })}
        </div>

        {/* Shutter Button di Bawah */}
        <div className="flex items-center justify-center pt-1">
          <button
            type="button"
            disabled={!isReady || isCapturing}
            onClick={onCapture}
            className={`relative w-15 h-15 rounded-full flex items-center justify-center transition-all ${
              isReady && !isCapturing
                ? 'cursor-pointer active:scale-90 hover:scale-105'
                : 'opacity-50 cursor-not-allowed'
            }`}
            title="Ambil Foto Langsung"
          >
            <div className="absolute inset-0 rounded-full border-3 border-white/80" />
            <div
              className={`w-11 h-11 rounded-full transition-all duration-200 ${
                isCapturing
                  ? 'bg-rose-500 scale-75'
                  : 'bg-white hover:bg-zinc-100 shadow-xl'
              }`}
            >
              {isCapturing && (
                <div className="w-full h-full flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                </div>
              )}
            </div>
          </button>
        </div>
      </aside>
    )
  }

  // =================== LAYOUT PORTRAIT (Bawah Layar) ===================
  return (
    <div className="w-full bg-gradient-to-t from-black via-zinc-950/98 to-zinc-950/90 border-t border-zinc-800/60 pt-3 pb-6 px-4 flex flex-col items-center justify-center gap-3 z-20 shrink-0 select-none shadow-2xl animate-in slide-in-from-bottom-3 duration-200">
      {/* 1. Baris Atas: Carousel Preset ATAU Slider Finetuning */}
      {activeTab === 'presets' ? (
        <div className="w-full flex items-center gap-2 overflow-x-auto py-1 px-1 scrollbar-none">
          {PRESETS.map(preset => {
            const isSelected = cameraEffect.preset === preset.id
            return (
              <button
                key={preset.id}
                type="button"
                onClick={() =>
                  onChangeCameraEffect({
                    ...cameraEffect,
                    preset: preset.id,
                  })
                }
                className={`px-3 py-2 rounded-2xl shrink-0 flex items-center gap-2 transition-all active:scale-95 ${
                  isSelected
                    ? 'bg-emerald-500 text-black font-bold shadow-lg shadow-emerald-500/25 ring-2 ring-emerald-400/80 scale-105'
                    : 'bg-zinc-900/90 text-zinc-300 border border-zinc-800 hover:bg-zinc-850 hover:border-zinc-700'
                }`}
              >
                <span className="text-base">{preset.icon}</span>
                <div className="text-left leading-tight">
                  <div className="text-xs font-semibold">{preset.label}</div>
                  <div
                    className={`text-[9px] ${
                      isSelected ? 'text-zinc-900 font-medium' : 'text-zinc-500'
                    }`}
                  >
                    {preset.sub}
                  </div>
                </div>
              </button>
            )
          })}
        </div>
      ) : (
        /* Sub-Mode Finetuning Sliders */
        <div className="w-full bg-zinc-900/80 border border-zinc-800 rounded-2xl p-3 space-y-2.5 animate-in fade-in duration-150">
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => setActiveTab('presets')}
              className="text-xs text-zinc-300 hover:text-white flex items-center gap-1 font-semibold"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              <span>Kembali ke Preset</span>
            </button>
            {hasFinetune && (
              <button
                type="button"
                onClick={() =>
                  onChangeCameraEffect({
                    ...cameraEffect,
                    finetune: { brightness: 0, contrast: 0, saturation: 0 },
                  })
                }
                className="text-[10px] text-zinc-400 hover:text-white flex items-center gap-1 px-2 py-0.5 rounded bg-zinc-800 border border-zinc-700 transition-colors"
                title="Reset finetune ke 0%"
              >
                <RotateCcw className="w-2.5 h-2.5" />
                Reset (0%)
              </button>
            )}
          </div>

          {/* Sliders Grid */}
          <div className="grid grid-cols-3 gap-2 pt-0.5">
            {/* Kecerahan */}
            <div className="space-y-1">
              <div className="flex justify-between text-[10px]">
                <span className="text-zinc-400 flex items-center gap-1">
                  <Sun className="w-3 h-3 text-amber-400" /> Kecerahan
                </span>
                <span className="font-mono text-zinc-300">
                  {cameraEffect.finetune.brightness > 0
                    ? `+${cameraEffect.finetune.brightness}%`
                    : `${cameraEffect.finetune.brightness}%`}
                </span>
              </div>
              <input
                type="range"
                min="-20"
                max="20"
                step="1"
                value={cameraEffect.finetune.brightness}
                onChange={e =>
                  onChangeCameraEffect({
                    ...cameraEffect,
                    finetune: {
                      ...cameraEffect.finetune,
                      brightness: Number(e.target.value),
                    },
                  })
                }
                className="w-full accent-emerald-500 h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer"
              />
            </div>

            {/* Kontras */}
            <div className="space-y-1">
              <div className="flex justify-between text-[10px]">
                <span className="text-zinc-400 flex items-center gap-1">
                  <Contrast className="w-3 h-3 text-sky-400" /> Kontras
                </span>
                <span className="font-mono text-zinc-300">
                  {cameraEffect.finetune.contrast > 0
                    ? `+${cameraEffect.finetune.contrast}%`
                    : `${cameraEffect.finetune.contrast}%`}
                </span>
              </div>
              <input
                type="range"
                min="-20"
                max="20"
                step="1"
                value={cameraEffect.finetune.contrast}
                onChange={e =>
                  onChangeCameraEffect({
                    ...cameraEffect,
                    finetune: {
                      ...cameraEffect.finetune,
                      contrast: Number(e.target.value),
                    },
                  })
                }
                className="w-full accent-emerald-500 h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer"
              />
            </div>

            {/* Kejenuhan */}
            <div className="space-y-1">
              <div className="flex justify-between text-[10px]">
                <span className="text-zinc-400 flex items-center gap-1">
                  <Palette className="w-3 h-3 text-rose-400" /> Warna
                </span>
                <span className="font-mono text-zinc-300">
                  {cameraEffect.finetune.saturation > 0
                    ? `+${cameraEffect.finetune.saturation}%`
                    : `${cameraEffect.finetune.saturation}%`}
                </span>
              </div>
              <input
                type="range"
                min="-20"
                max="20"
                step="1"
                value={cameraEffect.finetune.saturation}
                onChange={e =>
                  onChangeCameraEffect({
                    ...cameraEffect,
                    finetune: {
                      ...cameraEffect.finetune,
                      saturation: Number(e.target.value),
                    },
                  })
                }
                className="w-full accent-emerald-500 h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer"
              />
            </div>
          </div>
        </div>
      )}

      {/* 2. Baris Bawah: Tombol Koreksi, Shutter Tengah, dan Tombol Selesai */}
      <div className="w-full flex items-center justify-between px-2 pt-1">
        {/* Sisi Kiri: Toggle Finetuning */}
        <div className="w-20 flex justify-start">
          <button
            type="button"
            onClick={() =>
              setActiveTab(activeTab === 'presets' ? 'finetune' : 'presets')
            }
            className={`h-11 px-3 rounded-2xl flex items-center gap-1.5 text-xs font-semibold transition-all active:scale-95 ${
              activeTab === 'finetune' || hasFinetune
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm'
                : 'glass-pill text-zinc-300 hover:text-white hover:bg-white/10'
            }`}
            title="Koreksi Kecerahan & Kontras Manual"
          >
            <Sliders className={`w-4 h-4 ${iconRotateClass}`} />
            <span className="text-[11px]">Koreksi</span>
          </button>
        </div>

        {/* Tengah: Shutter Button Langsung */}
        <div className="flex items-center justify-center">
          <button
            type="button"
            disabled={!isReady || isCapturing}
            onClick={onCapture}
            className={`relative w-18 h-18 rounded-full flex items-center justify-center transition-all ${
              isReady && !isCapturing
                ? 'cursor-pointer active:scale-90 hover:scale-105 animate-pulse-ring'
                : 'opacity-50 cursor-not-allowed'
            }`}
            title="Ambil Foto dengan Efek Ini"
          >
            <div className="absolute inset-0 rounded-full border-4 border-white/80" />
            <div
              className={`w-14 h-14 rounded-full transition-all duration-200 ${
                isCapturing
                  ? 'bg-rose-500 scale-75'
                  : 'bg-white hover:bg-zinc-100 shadow-2xl'
              }`}
            >
              {isCapturing && (
                <div className="w-full h-full flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                </div>
              )}
            </div>
          </button>
        </div>

        {/* Sisi Kanan: Tombol Selesai */}
        <div className="w-20 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="h-11 px-3.5 rounded-2xl bg-white text-zinc-950 font-bold text-xs flex items-center gap-1 hover:bg-zinc-200 active:scale-95 transition-all shadow-lg"
            title="Selesai & Kembali ke Shutter Normal"
          >
            <Check className="w-4 h-4" />
            <span>Selesai</span>
          </button>
        </div>
      </div>
    </div>
  )
}
