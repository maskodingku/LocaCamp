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
import { CyberGlassOrb } from './CyberGlassOrb'

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
  },
  {
    id: 'normal' as CameraEffectPreset,
    name: 'Normal (Alami)',
    badge: 'Netral',
    desc: 'Warna murni sensor',
  },
  {
    id: 'warm' as CameraEffectPreset,
    name: 'Hangat (Warm)',
    badge: 'Sunset Tone',
    desc: 'Nuansa golden hour lembut',
  },
  {
    id: 'cool' as CameraEffectPreset,
    name: 'Sejuk (Cool)',
    badge: 'Fresh Blue',
    desc: 'Nuansa segar kebiruan',
  },
  {
    id: 'hdr' as CameraEffectPreset,
    name: 'HDR Boost',
    badge: 'High Detail',
    desc: 'Detail bayangan kaya & terang',
  },
  {
    id: 'mono' as CameraEffectPreset,
    name: 'Monokrom (B&W)',
    badge: 'Artistik',
    desc: 'Hitam putih klasik elegan',
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
    <div className="space-y-4 animate-in fade-in duration-200">
      {/* 1. Sensor Hardware Detection Card */}
      <div
        className={`relative rounded-[22px] border border-white/20 bg-[#03152e]/55 backdrop-blur-xl shadow-[0_12px_32px_rgba(0,0,0,0.6),inset_0_1.5px_2px_rgba(255,255,255,0.85)] text-white p-4 sm:p-5 overflow-hidden transition-opacity duration-150 ${
          activeSlider ? 'opacity-0 pointer-events-none' : 'opacity-100'
        }`}
      >
        <div className="pointer-events-none absolute top-0 left-8 right-8 h-[1.5px] bg-gradient-to-r from-transparent via-white/95 to-transparent z-20" />
        <div className="flex items-start gap-3">
          <CyberGlassOrb icon={Cpu} size="md" variant="cyan" />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-cyan-300">
                Sensor Kamera Aktif
              </span>
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#020e1f] text-cyan-300 border border-white/30 shadow-[0_2px_6px_rgba(0,0,0,0.5)]">
                LIVE
              </span>
            </div>
            <div className="text-sm font-black text-white mt-0.5 truncate drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)]">
              {sensorInfo?.label || 'Kamera Perangkat HP'}
            </div>
            <div className="flex items-center gap-3 mt-2 text-xs text-slate-100 font-medium">
              <div>
                Maksimal:{' '}
                <span className="font-bold text-cyan-300">
                  {sensorInfo?.maxMegapixels
                    ? `${sensorInfo.maxMegapixels} MP`
                    : 'Otomatis'}
                </span>
                {sensorInfo?.maxWidth && sensorInfo?.maxHeight ? (
                  <span className="text-[11px] text-slate-200 ml-1 font-mono font-bold">
                    ({sensorInfo.maxWidth} × {sensorInfo.maxHeight})
                  </span>
                ) : null}
              </div>
            </div>
            <div className="mt-2 flex items-center gap-1.5 text-[11px] text-slate-200 font-medium">
              <Zap className="w-3.5 h-3.5 text-amber-300 shrink-0" />
              <span>
                {sensorInfo?.supportsImageCapture
                  ? 'Mendukung ImageCapture (shutter sensor native jernih)'
                  : 'Fallback frame video resolusi tinggi'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Efek Visual & Filter Warna */}
      <div
        className={`relative rounded-[22px] border border-white/20 bg-[#03152e]/55 backdrop-blur-xl shadow-[0_12px_32px_rgba(0,0,0,0.6),inset_0_1.5px_2px_rgba(255,255,255,0.85)] text-white p-4 sm:p-5 overflow-hidden transition-opacity duration-150 ${
          activeSlider ? 'opacity-0 pointer-events-none' : 'opacity-100'
        }`}
      >
        <div className="pointer-events-none absolute top-0 left-8 right-8 h-[1.5px] bg-gradient-to-r from-transparent via-white/95 to-transparent z-20" />
        <div className="flex items-center justify-between mb-1">
          <label className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-2">
            <CyberGlassOrb icon={Palette} size="xs" variant="cyan" />
            <span>Preset Efek &amp; Nuansa Warna</span>
          </label>
          <span className="text-[10px] text-cyan-300 font-mono font-bold px-2 py-0.5 rounded-full bg-[#020e1f] border border-white/30 shadow-[0_2px_6px_rgba(0,0,0,0.5)]">
            WYSIWYG
          </span>
        </div>
        <p className="text-[11px] text-slate-200 mb-3 font-medium">
          Warna foto otomatis disesuaikan secara real-time di layar dan canvas hasil jepretan.
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {COLOR_PRESETS.map(presetItem => {
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
                className={`p-3 rounded-2xl border text-left transition-all flex flex-col justify-between relative overflow-hidden ${
                  isSelected
                    ? 'bg-gradient-to-r from-cyan-400 via-sky-400 to-blue-500 text-black font-black border border-white/90 shadow-[0_2px_8px_rgba(0,0,0,0.6),inset_0_1.5px_2px_rgba(255,255,255,0.95)]'
                    : 'bg-[#020717]/60 text-slate-200 hover:text-white border-white/10 hover:border-white/30 font-bold'
                }`}
              >
                <div className="flex items-center justify-between gap-1 mb-1">
                  <span className={`text-xs font-bold truncate ${isSelected ? 'text-black' : 'text-white'}`}>
                    {presetItem.name}
                  </span>
                </div>
                <p className={`text-[10.5px] leading-tight ${isSelected ? 'text-black/80 font-bold' : 'text-slate-300 font-medium'}`}>
                  {presetItem.desc}
                </p>
              </button>
            )
          })}
        </div>
      </div>

      {/* 3. Finetuning Kamera Sliders */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <label className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-2">
            <CyberGlassOrb icon={Sliders} size="xs" variant="cyan" />
            <span>Finetuning Sensor Gambar</span>
          </label>
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
              className="text-[10px] text-white font-bold flex items-center gap-1 transition-colors px-2.5 py-0.5 rounded-full bg-[#020e1f] border border-white/35 shadow-[0_2px_6px_rgba(0,0,0,0.5),inset_0_1px_1px_rgba(255,255,255,0.5)]"
              title="Kembalikan finetuning ke 0%"
            >
              <RotateCcw className="w-2.5 h-2.5 text-cyan-300" />
              Reset (0%)
            </button>
          )}
        </div>

        {/* Slider Kecerahan */}
        <div
          className={`space-y-1 transition-all duration-150 ${
            activeSlider === 'camera_brightness'
              ? 'p-4 rounded-2xl bg-[#020717]/95 backdrop-blur-2xl border border-white/50 shadow-[0_12px_32px_rgba(0,0,0,0.8),inset_0_2px_3px_rgba(255,255,255,0.7)] relative z-50'
              : activeSlider !== null
              ? 'opacity-0 pointer-events-none'
              : ''
          }`}
        >
          <div className="flex justify-between items-center text-xs mb-1 px-1">
            <span className={`flex items-center gap-1.5 text-[11px] ${activeSlider === 'camera_brightness' ? 'text-white font-black' : 'text-white font-bold'}`}>
              <Sun className="w-3.5 h-3.5 text-amber-300" />
              Kecerahan
            </span>
            <span className="font-mono text-cyan-300 text-xs font-black drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
              {cameraEffect.finetune.brightness > 0
                ? `+${cameraEffect.finetune.brightness}%`
                : `${cameraEffect.finetune.brightness}%`}
            </span>
          </div>
          <div className="relative w-full h-10 rounded-full bg-gradient-to-r from-[#020e1f]/95 via-[#051c36]/90 to-[#020e1f]/95 border border-white/35 shadow-[0_4px_12px_rgba(0,0,0,0.5),inset_0_1.5px_2px_rgba(255,255,255,0.85),inset_0_-1px_2px_rgba(0,0,0,0.8)] px-4 flex items-center overflow-hidden">
            <div className="absolute top-0 inset-x-5 h-[1.5px] bg-gradient-to-r from-transparent via-white/95 to-transparent pointer-events-none" />
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
              className="hud-slider cursor-pointer w-full"
            />
          </div>
        </div>

        {/* Slider Kontras */}
        <div
          className={`space-y-1 transition-all duration-150 ${
            activeSlider === 'camera_contrast'
              ? 'p-4 rounded-2xl bg-[#020717]/95 backdrop-blur-2xl border border-white/50 shadow-[0_12px_32px_rgba(0,0,0,0.8),inset_0_2px_3px_rgba(255,255,255,0.7)] relative z-50'
              : activeSlider !== null
              ? 'opacity-0 pointer-events-none'
              : ''
          }`}
        >
          <div className="flex justify-between items-center text-xs mb-1 px-1">
            <span className={`flex items-center gap-1.5 text-[11px] ${activeSlider === 'camera_contrast' ? 'text-white font-black' : 'text-white font-bold'}`}>
              <Contrast className="w-3.5 h-3.5 text-sky-300" />
              Kontras
            </span>
            <span className="font-mono text-cyan-300 text-xs font-black drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
              {cameraEffect.finetune.contrast > 0
                ? `+${cameraEffect.finetune.contrast}%`
                : `${cameraEffect.finetune.contrast}%`}
            </span>
          </div>
          <div className="relative w-full h-10 rounded-full bg-gradient-to-r from-[#020e1f]/95 via-[#051c36]/90 to-[#020e1f]/95 border border-white/35 shadow-[0_4px_12px_rgba(0,0,0,0.5),inset_0_1.5px_2px_rgba(255,255,255,0.85),inset_0_-1px_2px_rgba(0,0,0,0.8)] px-4 flex items-center overflow-hidden">
            <div className="absolute top-0 inset-x-5 h-[1.5px] bg-gradient-to-r from-transparent via-white/95 to-transparent pointer-events-none" />
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
              className="hud-slider cursor-pointer w-full"
            />
          </div>
        </div>

        {/* Slider Saturasi */}
        <div
          className={`space-y-1 transition-all duration-150 ${
            activeSlider === 'camera_saturation'
              ? 'p-4 rounded-2xl bg-[#020717]/95 backdrop-blur-2xl border border-white/50 shadow-[0_12px_32px_rgba(0,0,0,0.8),inset_0_2px_3px_rgba(255,255,255,0.7)] relative z-50'
              : activeSlider !== null
              ? 'opacity-0 pointer-events-none'
              : ''
          }`}
        >
          <div className="flex justify-between items-center text-xs mb-1 px-1">
            <span className={`flex items-center gap-1.5 text-[11px] ${activeSlider === 'camera_saturation' ? 'text-white font-black' : 'text-white font-bold'}`}>
              <Palette className="w-3.5 h-3.5 text-rose-300" />
              Saturasi
            </span>
            <span className="font-mono text-cyan-300 text-xs font-black drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
              {cameraEffect.finetune.saturation > 0
                ? `+${cameraEffect.finetune.saturation}%`
                : `${cameraEffect.finetune.saturation}%`}
            </span>
          </div>
          <div className="relative w-full h-10 rounded-full bg-gradient-to-r from-[#020e1f]/95 via-[#051c36]/90 to-[#020e1f]/95 border border-white/35 shadow-[0_4px_12px_rgba(0,0,0,0.5),inset_0_1.5px_2px_rgba(255,255,255,0.85),inset_0_-1px_2px_rgba(0,0,0,0.8)] px-4 flex items-center overflow-hidden">
            <div className="absolute top-0 inset-x-5 h-[1.5px] bg-gradient-to-r from-transparent via-white/95 to-transparent pointer-events-none" />
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
              className="hud-slider cursor-pointer w-full"
            />
          </div>
        </div>
      </div>

      {/* 4. Target Resolusi Sensor */}
      <div
        className={`relative rounded-[22px] border border-white/20 bg-[#03152e]/55 backdrop-blur-xl shadow-[0_12px_32px_rgba(0,0,0,0.6),inset_0_1.5px_2px_rgba(255,255,255,0.85)] text-white p-4 sm:p-5 overflow-hidden transition-opacity duration-150 ${
          activeSlider ? 'opacity-0 pointer-events-none' : 'opacity-100'
        }`}
      >
        <div className="pointer-events-none absolute top-0 left-8 right-8 h-[1.5px] bg-gradient-to-r from-transparent via-white/95 to-transparent z-20" />
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-2">
            <CyberGlassOrb icon={Maximize2} size="xs" variant="cyan" />
            <span>Target Resolusi Sensor</span>
          </label>
          <span className="text-[10px] text-cyan-300 font-mono font-bold px-2 py-0.5 rounded-full bg-[#020e1f] border border-white/30 shadow-[0_2px_6px_rgba(0,0,0,0.5)]">
            AUTO
          </span>
        </div>
        <div className="space-y-2">
          {RESOLUTION_PRESETS.map(presetItem => {
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
                className={`w-full text-left p-3.5 rounded-2xl border transition-all flex items-start gap-3 relative overflow-hidden ${
                  isSelected
                    ? 'bg-gradient-to-r from-[#020e1f]/95 via-[#051c36]/90 to-[#020e1f]/95 border border-white/50 text-white shadow-[0_4px_16px_rgba(0,0,0,0.7),inset_0_1.5px_2px_rgba(255,255,255,0.8)]'
                    : 'bg-[#020717]/60 text-slate-200 hover:text-white border-white/10 hover:border-white/30'
                } ${!presetItem.supported ? 'opacity-50' : ''}`}
              >
                <div
                  className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 mt-0.5 ${
                    isSelected
                      ? 'border-white bg-cyan-400 text-black shadow-[0_2px_6px_rgba(0,0,0,0.5)]'
                      : 'border-white/20 bg-[#020717]'
                  }`}
                >
                  {isSelected && <div className="w-2 h-2 rounded-full bg-[#020b18]" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-bold text-white">
                      {presetItem.title}
                    </span>
                    <span
                      className={`text-[9.5px] px-2 py-0.5 rounded-full font-mono font-bold shrink-0 ${
                        isSelected
                          ? 'bg-[#020e1f] text-cyan-300 border border-white/30'
                          : 'bg-[#020717] text-slate-300 border border-white/10'
                      }`}
                    >
                      {presetItem.tag}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-200 mt-0.5 leading-relaxed font-medium">
                    {presetItem.desc}
                  </p>
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* 5. Kompresi JPEG & Denoise */}
      <div
        className={`relative rounded-[22px] border border-white/20 bg-[#03152e]/55 backdrop-blur-xl shadow-[0_12px_32px_rgba(0,0,0,0.6),inset_0_1.5px_2px_rgba(255,255,255,0.85)] text-white p-4 sm:p-5 overflow-hidden transition-opacity duration-150 space-y-4 ${
          activeSlider ? 'opacity-0 pointer-events-none' : 'opacity-100'
        }`}
      >
        <div className="pointer-events-none absolute top-0 left-8 right-8 h-[1.5px] bg-gradient-to-r from-transparent via-white/95 to-transparent z-20" />
        
        {/* Kompresi */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-bold uppercase tracking-wider text-white">
              Kualitas Kompresi JPEG
            </label>
            <span className="text-[10px] text-cyan-300 font-mono font-bold">
              Canvas Export
            </span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: 'ultra' as const, label: 'Ultra (100%)', sub: 'Maksimal' },
              { id: 'high' as const, label: 'Tinggi (96%)', sub: 'Optimal' },
              { id: 'medium' as const, label: 'Sedang (88%)', sub: 'Hemat' },
            ].map(tier => {
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
                      ? 'bg-gradient-to-r from-cyan-400 via-sky-400 to-blue-500 text-black font-black border border-white/90 shadow-[0_2px_8px_rgba(0,0,0,0.6),inset_0_1.5px_2px_rgba(255,255,255,0.95)]'
                      : 'bg-[#020717]/60 text-slate-200 hover:text-white border-white/10 hover:border-white/30 font-bold'
                  }`}
                >
                  <span className="text-xs font-bold">{tier.label}</span>
                  <span className={`text-[10px] mt-0.5 ${isSelected ? 'text-black/80 font-bold' : 'text-slate-300 font-medium'}`}>
                    {tier.sub}
                  </span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Denoise */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-xs font-bold uppercase tracking-wider text-white">
              Penghalus Derau (Denoise)
            </label>
            <span className="text-[10px] text-cyan-300 font-bold">
              Anti Pasir Halus
            </span>
          </div>
          <p className="text-[11px] text-slate-200 mb-2.5 font-medium">
            Menghilangkan butiran pasir semut TV (sensor grain) agar foto terlihat mulus dan jernih.
          </p>
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: 'smooth' as const, label: 'Halus', sub: 'Rekomendasi' },
              { id: 'extra' as const, label: 'Maksimal', sub: 'Minim Cahaya' },
              { id: 'natural' as const, label: 'Alami (Off)', sub: 'Raw Sensor' },
            ].map(mode => {
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
                      ? 'bg-gradient-to-r from-cyan-400 via-sky-400 to-blue-500 text-black font-black border border-white/90 shadow-[0_2px_8px_rgba(0,0,0,0.6),inset_0_1.5px_2px_rgba(255,255,255,0.95)]'
                      : 'bg-[#020717]/60 text-slate-200 hover:text-white border-white/10 hover:border-white/30 font-bold'
                  }`}
                >
                  <span className="text-xs font-bold">{mode.label}</span>
                  <span className={`text-[10px] mt-0.5 ${isSelected ? 'text-black/80 font-bold' : 'text-slate-300 font-medium'}`}>
                    {mode.sub}
                  </span>
                </button>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
