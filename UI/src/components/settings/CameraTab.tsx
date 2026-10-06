import React from 'react'
import {
  Cpu,
  Zap,
  Sliders,
  RotateCcw,
  Sun,
  Contrast,
  Palette,
  Maximize2,
} from 'lucide-react'
import type {
  SensorCapabilitiesInfo,
  CameraEffectConfig,
  CameraQualityConfig,
  CameraEffectPreset,
} from '../../types/camera'

interface CameraTabProps {
  sensorInfo?: SensorCapabilitiesInfo | null
  cameraEffect: CameraEffectConfig
  onChangeCameraEffect: (cfg: CameraEffectConfig) => void
  cameraQualityConfig: CameraQualityConfig
  onChangeCameraQualityConfig: (cfg: CameraQualityConfig) => void
  activeSlider: string | null
  setActiveSlider: (slider: string | null) => void
}

const COLOR_PRESETS = [
  {
    id: 'vivid' as CameraEffectPreset,
    name: 'Cerah (Vivid)',
    badge: 'Rekomendasi',
    desc: 'Pop cerah, jernih & tajam',
    ringColor: 'border-emerald-500 bg-emerald-950/20 shadow-emerald-500/10',
    badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
  },
  {
    id: 'normal' as CameraEffectPreset,
    name: 'Normal (Alami)',
    badge: 'Netral',
    desc: 'Warna murni sensor',
    ringColor: 'border-zinc-500 bg-zinc-800/50',
    badgeColor: 'bg-zinc-800 text-zinc-400 border-zinc-700',
  },
  {
    id: 'warm' as CameraEffectPreset,
    name: 'Hangat (Warm)',
    badge: 'Sunset Tone',
    desc: 'Nuansa golden hour lembut',
    ringColor: 'border-amber-500 bg-amber-950/20 shadow-amber-500/10',
    badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
  },
  {
    id: 'cool' as CameraEffectPreset,
    name: 'Sejuk (Cool)',
    badge: 'Fresh Blue',
    desc: 'Nuansa segar kebiruan',
    ringColor: 'border-sky-500 bg-sky-950/20 shadow-sky-500/10',
    badgeColor: 'bg-sky-500/20 text-sky-300 border-sky-500/40',
  },
  {
    id: 'hdr' as CameraEffectPreset,
    name: 'HDR Boost',
    badge: 'High Detail',
    desc: 'Detail bayangan kaya & terang',
    ringColor: 'border-purple-500 bg-purple-950/20 shadow-purple-500/10',
    badgeColor: 'bg-purple-500/20 text-purple-300 border-purple-500/40',
  },
  {
    id: 'mono' as CameraEffectPreset,
    name: 'Monokrom (B&W)',
    badge: 'Artistik',
    desc: 'Hitam putih klasik elegan',
    ringColor: 'border-zinc-400 bg-zinc-800/40',
    badgeColor: 'bg-zinc-700/50 text-zinc-300 border-zinc-600',
  },
]

export const CameraTab: React.FC<CameraTabProps> = ({
  sensorInfo,
  cameraEffect,
  onChangeCameraEffect,
  cameraQualityConfig,
  onChangeCameraQualityConfig,
  activeSlider,
  setActiveSlider,
}) => {
  const RESOLUTION_PRESETS = [
    {
      id: 'auto' as const,
      title: 'Auto (Kualitas Tertinggi HP)',
      badge: 'Default & Rekomendasi',
      desc: 'Otomatis mendeteksi dan mengambil resolusi maksimal sensor tanpa kompromi.',
      tag: sensorInfo?.maxMegapixels ? `Hingga ${sensorInfo.maxMegapixels} MP` : 'Maksimal',
      supported: true,
    },
    {
      id: '12mp' as const,
      title: '12 MP / 4K Ultra HD',
      badge: 'Kualitas Ultra',
      desc: '~4000 × 3000 px • Sangat tajam untuk cetak dan zoom detail.',
      tag: '12 MP',
      supported: sensorInfo ? sensorInfo.supports12MP : true,
    },
    {
      id: '8mp' as const,
      title: '8 MP / Quad HD',
      badge: 'Kualitas Tinggi',
      desc: '~3264 × 2448 px • Seimbang antara ketajaman prima dan kecepatan.',
      tag: '8 MP',
      supported: true,
    },
    {
      id: '2mp' as const,
      title: '2 MP / Full HD 1080p',
      badge: 'Standar Cepat',
      desc: '1920 × 1080 px • Cepat diproses dan hemat kuota pengiriman.',
      tag: '2 MP',
      supported: true,
    },
    {
      id: '1mp' as const,
      title: '1 MP / HD 720p',
      badge: 'Hemat Memori',
      desc: '1280 × 720 px • Sangat ringan dan hemat penyimpanan memori HP.',
      tag: '1 MP',
      supported: true,
    },
  ]

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Sensor Hardware Detection Card */}
      <div
        className={`p-4 rounded-2xl bg-gradient-to-br from-emerald-950/30 via-zinc-900 to-zinc-950 border border-emerald-500/30 relative overflow-hidden transition-opacity duration-150 ${
          activeSlider ? 'opacity-0 pointer-events-none' : 'opacity-100'
        }`}
      >
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center shrink-0 text-emerald-400">
            <Cpu className="w-5 h-5" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                Sensor Kamera Aktif
              </span>
              <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                Live
              </span>
            </div>
            <div className="text-sm font-semibold text-white mt-0.5 truncate">
              {sensorInfo?.label || 'Kamera Perangkat HP'}
            </div>
            <div className="flex items-center gap-3 mt-2 text-xs text-zinc-300">
              <div>
                Maksimal:{' '}
                <span className="font-semibold text-emerald-300">
                  {sensorInfo?.maxMegapixels
                    ? `${sensorInfo.maxMegapixels} MP`
                    : 'Otomatis'}
                </span>
                {sensorInfo?.maxWidth && sensorInfo?.maxHeight ? (
                  <span className="text-[11px] text-zinc-400 ml-1">
                    ({sensorInfo.maxWidth} × {sensorInfo.maxHeight})
                  </span>
                ) : null}
              </div>
            </div>
            <div className="mt-2 flex items-center gap-1.5 text-[11px] text-zinc-400">
              <Zap className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span>
                {sensorInfo?.supportsImageCapture
                  ? 'Mendukung ImageCapture (shutter sensor native jernih)'
                  : 'Fallback frame video resolusi tinggi'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Efek Visual & Filter Warna */}
      <div
        className={`pt-2 border-t border-zinc-800/80 transition-opacity duration-150 ${
          activeSlider ? 'opacity-0 pointer-events-none' : 'opacity-100'
        }`}
      >
        <div className="flex items-center justify-between mb-1">
          <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400">
            Preset Efek & Nuansa Warna
          </label>
          <span className="text-[10px] text-emerald-400 font-medium">
            Live WYSIWYG
          </span>
        </div>
        <p className="text-[11px] text-zinc-400 mb-3">
          Warna foto otomatis disesuaikan secara real-time di layar dan canvas hasil jepretan.
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {COLOR_PRESETS.map((presetItem) => {
            const isSelected = cameraEffect.preset === presetItem.id
            return (
              <button
                key={presetItem.id}
                type="button"
                onClick={() =>
                  onChangeCameraEffect({
                    ...cameraEffect,
                    preset: presetItem.id,
                  })
                }
                className={`p-2.5 rounded-xl border text-left transition-all flex flex-col justify-between ${
                  isSelected
                    ? `${presetItem.ringColor} ring-1 ring-emerald-500/50 shadow-md`
                    : 'border-zinc-800 bg-zinc-900/60 hover:bg-zinc-900 hover:border-zinc-700'
                }`}
              >
                <div className="flex items-center justify-between gap-1 mb-1">
                  <span className={`text-xs font-semibold ${isSelected ? 'text-white' : 'text-zinc-300'}`}>
                    {presetItem.name}
                  </span>
                  {presetItem.badge && (
                    <span className={`text-[9px] px-1.5 py-0.5 rounded-full border shrink-0 ${presetItem.badgeColor}`}>
                      {presetItem.badge}
                    </span>
                  )}
                </div>
                <p className="text-[10px] text-zinc-400 leading-tight">
                  {presetItem.desc}
                </p>
              </button>
            )
          })}
        </div>
      </div>

      {/* Finetuning Sliders */}
      <div
        className={`space-y-3 transition-all duration-150 ${
          activeSlider
            ? 'bg-transparent border-transparent p-0 mt-0'
            : 'mt-4 p-3.5 rounded-2xl bg-zinc-900/80 border border-zinc-800/80'
        }`}
      >
          <div
            className={`flex items-center justify-between transition-opacity duration-150 ${
              activeSlider ? 'opacity-0 pointer-events-none' : 'opacity-100'
            }`}
          >
            <div className="flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5 text-zinc-400" />
              <span className="text-xs font-semibold text-zinc-300">
                Koreksi Manual (Finetuning)
              </span>
            </div>
            {(cameraEffect.finetune.brightness !== 0 ||
              cameraEffect.finetune.contrast !== 0 ||
              cameraEffect.finetune.saturation !== 0) && (
              <button
                type="button"
                onClick={() =>
                  onChangeCameraEffect({
                    ...cameraEffect,
                    finetune: { brightness: 0, contrast: 0, saturation: 0 },
                  })
                }
                className="text-[10px] text-zinc-400 hover:text-white flex items-center gap-1 transition-colors px-2 py-0.5 rounded bg-zinc-800 border border-zinc-700"
                title="Kembalikan finetuning ke 0%"
              >
                <RotateCcw className="w-2.5 h-2.5" />
                Reset (0%)
              </button>
            )}
          </div>

          {/* Slider Kecerahan */}
          <div
            className={`space-y-1 transition-all duration-150 ${
              activeSlider === 'camera_brightness'
                ? 'p-4 rounded-2xl bg-zinc-950/90 backdrop-blur-xl border border-emerald-500/60 shadow-2xl ring-2 ring-emerald-400/50 relative z-50'
                : activeSlider !== null
                ? 'opacity-0 pointer-events-none'
                : ''
            }`}
          >
            <div className="flex justify-between items-center text-xs">
              <span className={`flex items-center gap-1.5 text-[11px] ${activeSlider === 'camera_brightness' ? 'text-white font-bold' : 'text-zinc-400'}`}>
                <Sun className="w-3.5 h-3.5 text-amber-400" />
                Kecerahan
              </span>
              <span className="font-mono text-zinc-200 text-[11px]">
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
              onPointerDown={() => setActiveSlider('camera_brightness')}
              onTouchStart={() => setActiveSlider('camera_brightness')}
              onMouseDown={() => setActiveSlider('camera_brightness')}
              onPointerUp={() => setActiveSlider(null)}
              onTouchEnd={() => setActiveSlider(null)}
              onMouseUp={() => setActiveSlider(null)}
              onChange={e =>
                onChangeCameraEffect({
                  ...cameraEffect,
                  finetune: {
                    ...cameraEffect.finetune,
                    brightness: Number(e.target.value),
                  },
                })
              }
              className="w-full accent-emerald-500 h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer"
            />
          </div>

          {/* Slider Kontras */}
          <div
            className={`space-y-1 transition-all duration-150 ${
              activeSlider === 'camera_contrast'
                ? 'p-4 rounded-2xl bg-zinc-950/90 backdrop-blur-xl border border-emerald-500/60 shadow-2xl ring-2 ring-emerald-400/50 relative z-50'
                : activeSlider !== null
                ? 'opacity-0 pointer-events-none'
                : ''
            }`}
          >
            <div className="flex justify-between items-center text-xs">
              <span className={`flex items-center gap-1.5 text-[11px] ${activeSlider === 'camera_contrast' ? 'text-white font-bold' : 'text-zinc-400'}`}>
                <Contrast className="w-3.5 h-3.5 text-sky-400" />
                Kontras
              </span>
              <span className="font-mono text-zinc-200 text-[11px]">
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
              onPointerDown={() => setActiveSlider('camera_contrast')}
              onTouchStart={() => setActiveSlider('camera_contrast')}
              onMouseDown={() => setActiveSlider('camera_contrast')}
              onPointerUp={() => setActiveSlider(null)}
              onTouchEnd={() => setActiveSlider(null)}
              onMouseUp={() => setActiveSlider(null)}
              onChange={e =>
                onChangeCameraEffect({
                  ...cameraEffect,
                  finetune: {
                    ...cameraEffect.finetune,
                    contrast: Number(e.target.value),
                  },
                })
              }
              className="w-full accent-emerald-500 h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer"
            />
          </div>

          {/* Slider Kejenuhan Warna */}
          <div
            className={`space-y-1 transition-all duration-150 ${
              activeSlider === 'camera_saturation'
                ? 'p-4 rounded-2xl bg-zinc-950/90 backdrop-blur-xl border border-emerald-500/60 shadow-2xl ring-2 ring-emerald-400/50 relative z-50'
                : activeSlider !== null
                ? 'opacity-0 pointer-events-none'
                : ''
            }`}
          >
            <div className="flex justify-between items-center text-xs">
              <span className={`flex items-center gap-1.5 text-[11px] ${activeSlider === 'camera_saturation' ? 'text-white font-bold' : 'text-zinc-400'}`}>
                <Palette className="w-3.5 h-3.5 text-rose-400" />
                Kejenuhan Warna
              </span>
              <span className="font-mono text-zinc-200 text-[11px]">
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
              onPointerDown={() => setActiveSlider('camera_saturation')}
              onTouchStart={() => setActiveSlider('camera_saturation')}
              onMouseDown={() => setActiveSlider('camera_saturation')}
              onPointerUp={() => setActiveSlider(null)}
              onTouchEnd={() => setActiveSlider(null)}
              onMouseUp={() => setActiveSlider(null)}
              onChange={e =>
                onChangeCameraEffect({
                  ...cameraEffect,
                  finetune: {
                    ...cameraEffect.finetune,
                    saturation: Number(e.target.value),
                  },
                })
              }
              className="w-full accent-emerald-500 h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer"
            />
          </div>
        </div>

      {/* Target Resolusi Sensor */}
      <div
        className={`transition-opacity duration-150 ${
          activeSlider ? 'opacity-0 pointer-events-none' : 'opacity-100'
        }`}
      >
        <div className="flex items-center justify-between mb-2">
          <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400">
            Target Resolusi Sensor
          </label>
          <span className="text-[10px] text-emerald-400 font-medium">
            Default: Auto
          </span>
        </div>
        <div className="space-y-2">
          {RESOLUTION_PRESETS.map((presetItem) => {
            const isSelected = cameraQualityConfig.preset === presetItem.id
            return (
              <button
                key={presetItem.id}
                type="button"
                onClick={() =>
                  onChangeCameraQualityConfig({
                    ...cameraQualityConfig,
                    preset: presetItem.id,
                  })
                }
                className={`w-full text-left p-3 rounded-xl border transition-all flex items-start gap-3 ${
                  isSelected
                    ? 'border-emerald-500 bg-emerald-950/20 shadow-md ring-1 ring-emerald-500/50'
                    : 'border-zinc-800 bg-zinc-900/60 hover:bg-zinc-900 hover:border-zinc-700'
                } ${!presetItem.supported ? 'opacity-50' : ''}`}
              >
                <div
                  className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 mt-0.5 ${
                    isSelected
                      ? 'border-emerald-400 bg-emerald-500 text-black'
                      : 'border-zinc-600 bg-zinc-800'
                  }`}
                >
                  {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-bold text-white">
                      {presetItem.title}
                    </span>
                    <span
                      className={`text-[9px] px-2 py-0.5 rounded-full font-medium shrink-0 ${
                        isSelected
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                          : 'bg-zinc-800 text-zinc-400 border border-zinc-700'
                      }`}
                    >
                      {presetItem.tag}
                    </span>
                  </div>
                  <p className="text-[11px] text-zinc-400 mt-0.5 leading-relaxed">
                    {presetItem.desc}
                  </p>
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* Kompresi JPEG */}
      <div
        className={`pt-2 border-t border-zinc-800/80 transition-opacity duration-150 ${
          activeSlider ? 'opacity-0 pointer-events-none' : 'opacity-100'
        }`}
      >
        <div className="flex items-center justify-between mb-2">
          <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400">
            Kualitas Kompresi JPEG
          </label>
          <span className="text-[10px] text-zinc-500">
            Canvas Export
          </span>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {[
            { id: 'ultra' as const, label: 'Ultra (100%)', sub: 'Maksimal / Pro' },
            { id: 'high' as const, label: 'Tinggi (96%)', sub: 'Standar Optimal' },
            { id: 'medium' as const, label: 'Sedang (88%)', sub: 'Hemat Ukuran' },
          ].map((tier) => {
            const isSelected = cameraQualityConfig.jpegTier === tier.id
            return (
              <button
                key={tier.id}
                type="button"
                onClick={() =>
                  onChangeCameraQualityConfig({
                    ...cameraQualityConfig,
                    jpegTier: tier.id,
                  })
                }
                className={`p-2.5 rounded-xl border flex flex-col items-center justify-center transition-all ${
                  isSelected
                    ? 'border-emerald-500 bg-emerald-950/20 text-white font-semibold ring-1 ring-emerald-500/40'
                    : 'border-zinc-800 bg-zinc-900/60 text-zinc-400 hover:text-white hover:border-zinc-700'
                }`}
              >
                <span className="text-xs">{tier.label}</span>
                <span className="text-[10px] text-zinc-500 mt-0.5">{tier.sub}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Mode Penghalus Derau (Denoise / Anti Pasir Halus) */}
      <div
        className={`pt-2 border-t border-zinc-800/80 transition-opacity duration-150 ${
          activeSlider ? 'opacity-0 pointer-events-none' : 'opacity-100'
        }`}
      >
        <div className="flex items-center justify-between mb-1">
          <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400">
            Penghalus Pasir Derau (Denoise)
          </label>
          <span className="text-[10px] text-emerald-400 font-medium">
            Anti Pasir Halus
          </span>
        </div>
        <p className="text-[11px] text-zinc-400 mb-2.5">
          Menghilangkan butiran pasir semut TV (sensor grain) agar foto terlihat mulus dan bersih saat di-zoom.
        </p>
        <div className="grid grid-cols-3 gap-2">
          {[
            {
              id: 'smooth' as const,
              label: 'Halus',
              sub: 'Rekomendasi',
              desc: 'Mulus alami',
            },
            {
              id: 'extra' as const,
              label: 'Maksimal',
              sub: 'Minim Cahaya',
              desc: 'Extra de-noise',
            },
            {
              id: 'natural' as const,
              label: 'Alami (Off)',
              sub: 'Raw Sensor',
              desc: 'Tanpa filter',
            },
          ].map((mode) => {
            const isSelected = (cameraQualityConfig.denoiseMode || 'smooth') === mode.id
            return (
              <button
                key={mode.id}
                type="button"
                onClick={() =>
                  onChangeCameraQualityConfig({
                    ...cameraQualityConfig,
                    denoiseMode: mode.id,
                  })
                }
                className={`p-2.5 rounded-xl border flex flex-col items-center justify-center transition-all ${
                  isSelected
                    ? 'border-emerald-500 bg-emerald-950/20 text-white font-semibold ring-1 ring-emerald-500/40'
                    : 'border-zinc-800 bg-zinc-900/60 text-zinc-400 hover:text-white hover:border-zinc-700'
                }`}
              >
                <span className="text-xs">{mode.label}</span>
                <span className="text-[10px] text-emerald-400/90 font-medium mt-0.5">
                  {mode.sub}
                </span>
                <span className="text-[9px] text-zinc-500 mt-0.5">
                  {mode.desc}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Penjelasan Ketajaman */}
      <div
        className={`p-3 rounded-xl bg-zinc-900/80 border border-zinc-800 text-[11px] text-zinc-400 space-y-1 transition-opacity duration-150 ${
          activeSlider ? 'opacity-0 pointer-events-none' : 'opacity-100'
        }`}
      >
        <div className="font-semibold text-zinc-300 flex items-center gap-1.5">
          <Maximize2 className="w-3.5 h-3.5 text-emerald-400" />
          Mengapa foto di aplikasi ini kini sejernih kamera bawaan?
        </div>
        <p>
          Aplikasi kini memanfaatkan <strong>ImageCapture hardware shutter</strong> untuk mengambil frame langsung dari sensor kamera dalam resolusi penuh, tanpa kompresi visual interpolasi video.
        </p>
      </div>
    </div>
  )
}
