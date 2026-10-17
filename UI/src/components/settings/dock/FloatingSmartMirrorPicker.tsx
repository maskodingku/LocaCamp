import React from 'react'
import { Palette, Sliders } from 'lucide-react'
import { combineHexAndAlpha, normalizeToHex } from './ColorOptionPopup'

export interface FloatingSmartMirrorPickerProps {
  isOpen: boolean
  activeDragPart: 'saturation' | 'hue' | 'alpha' | null
  customHex: string
  alphaPercent: number
  targetType?: 'profile' | 'geotag' | 'watermark' | 'none'
}

// Helper untuk konversi Hex ke HSV (Hue 0-360, Saturation 0-100, Value 0-100)
function hexToHsv(hex: string): { h: number; s: number; v: number } {
  const normalized = normalizeToHex(hex).slice(1)
  const r = parseInt(normalized.slice(0, 2), 16) / 255
  const g = parseInt(normalized.slice(2, 4), 16) / 255
  const b = parseInt(normalized.slice(4, 6), 16) / 255

  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  const d = max - min
  let h = 0
  const s = max === 0 ? 0 : d / max
  const v = max

  if (max !== min) {
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0)
        break
      case g:
        h = (b - r) / d + 2
        break
      case b:
        h = (r - g) / d + 4
        break
    }
    h /= 6
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    v: Math.round(v * 100),
  }
}

export const FloatingSmartMirrorPicker: React.FC<FloatingSmartMirrorPickerProps> = ({
  isOpen,
  activeDragPart,
  customHex,
  alphaPercent,
  targetType = 'profile',
}) => {
  if (!isOpen || !activeDragPart) return null

  // Deteksi posisi elemen target secara cerdas
  let isTargetNearBottomOrCenter = true
  if (typeof window !== 'undefined') {
    const targetEl =
      targetType !== 'none'
        ? (document.querySelector(`[data-preview-target="${targetType}"]`) as HTMLElement | null)
        : null
    if (targetEl) {
      const rect = targetEl.getBoundingClientRect()
      const targetCenterY = rect.top + rect.height / 2
      // Jika pusat target berada di area tengah atau bawah (> 42% tinggi layar)
      isTargetNearBottomOrCenter = targetCenterY > window.innerHeight * 0.42
    }
  }

  const { h, s, v } = hexToHsv(customHex)
  const combinedColor = combineHexAndAlpha(customHex, alphaPercent)

  // Jika target di tengah/bawah: posisikan cerminan di bagian ATAS layar
  // Jika target di atas: posisikan cerminan di bagian BAWAH layar
  const positionClasses = isTargetNearBottomOrCenter
    ? 'fixed top-3 left-3 right-3 sm:left-auto sm:right-6 sm:w-full sm:max-w-[380px] z-[160]'
    : 'fixed bottom-28 left-3 right-3 sm:left-auto sm:right-6 sm:w-full sm:max-w-[380px] z-[160]'

  return (
    <div
      className={`${positionClasses} pointer-events-none select-none p-3.5 rounded-[26px] bg-[#020717]/95 backdrop-blur-2xl border-2 border-cyan-400 shadow-[0_0_35px_rgba(6,182,212,0.8),0_20px_60px_rgba(0,0,0,0.9),inset_0_1.5px_2.5px_rgba(255,255,255,0.7)] text-white animate-in fade-in zoom-in-95 duration-150 overflow-hidden`}
    >
      {/* Specular Highlight Glare di Atas Box Cerminan */}
      <div className="absolute top-0 inset-x-8 h-[1.5px] bg-gradient-to-r from-transparent via-cyan-100 to-transparent pointer-events-none shadow-[0_0_8px_#22d3ee]" />

      {/* Header Info Live Cerminan */}
      <div className="flex items-center justify-between pb-2 mb-2 border-b border-cyan-500/25">
        <div className="flex items-center gap-2">
          {activeDragPart === 'alpha' ? (
            <Sliders className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
          ) : (
            <Palette className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
          )}
          <span className="text-xs font-bold tracking-wider uppercase text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
            {activeDragPart === 'saturation'
              ? 'Warna & Kecerahan'
              : activeDragPart === 'hue'
              ? 'Spektrum Warna (Hue)'
              : 'Tingkat Transparansi'}
          </span>
        </div>

        {/* Live Swatch Badge */}
        <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-[#030917]/90 border border-cyan-500/40 shadow-[0_0_8px_rgba(6,182,212,0.4)]">
          <div
            className="w-3.5 h-3.5 rounded-full border border-white/60 shadow-[0_0_6px_rgba(255,255,255,0.5)] shrink-0"
            style={{ backgroundColor: combinedColor }}
          />
          <span className="font-mono text-[10px] text-cyan-200 font-bold">
            {customHex.toUpperCase()} • {alphaPercent}%
          </span>
        </div>
      </div>

      {/* Visual Area Pick yang Sedang Aktif */}
      {activeDragPart === 'saturation' && (
        <div className="space-y-1.5">
          <div
            className="relative w-full h-32 rounded-xl border border-cyan-400/50 overflow-hidden shadow-[inset_0_2px_6px_rgba(0,0,0,0.6)]"
            style={{ backgroundColor: `hsl(${h}, 100%, 50%)` }}
          >
            {/* Gradien Saturasi Horizontal (Putih ke Transparan) */}
            <div
              className="absolute inset-0"
              style={{ background: 'linear-gradient(to right, #fff, transparent)' }}
            />
            {/* Gradien Value Vertikal (Hitam ke Transparan) */}
            <div
              className="absolute inset-0"
              style={{ background: 'linear-gradient(to top, #000, transparent)' }}
            />
            {/* Pointer Cermin Glowing yang Menunjukkan Titik Koordinat Saat Ini */}
            <div
              className="absolute w-5 h-5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white shadow-[0_0_12px_#22d3ee,inset_0_0_4px_#fff] transition-all duration-75"
              style={{
                left: `${s}%`,
                top: `${100 - v}%`,
                backgroundColor: customHex,
              }}
            />
          </div>
        </div>
      )}

      {activeDragPart === 'hue' && (
        <div className="space-y-1.5">
          <div
            className="relative w-full h-6 rounded-full border border-cyan-400/60 overflow-hidden shadow-[0_0_12px_rgba(6,182,212,0.4)]"
            style={{
              background:
                'linear-gradient(to right, #f00 0%, #ff0 17%, #0f0 33%, #0ff 50%, #00f 67%, #f0f 83%, #f00 100%)',
            }}
          >
            {/* Knob Cermin Glowing yang Mengikuti Slider Hue */}
            <div
              className="absolute top-0 bottom-0 w-6 -translate-x-1/2 rounded-full border-2 border-white bg-white/40 shadow-[0_0_12px_#22d3ee] transition-all duration-75"
              style={{ left: `${(h / 360) * 100}%` }}
            />
          </div>
        </div>
      )}

      {activeDragPart === 'alpha' && (
        <div className="space-y-1.5">
          <div
            className="relative w-full h-6 rounded-full border border-cyan-400/60 overflow-hidden shadow-[0_0_12px_rgba(6,182,212,0.4)]"
            style={{
              backgroundImage:
                'repeating-conic-gradient(#334155 0% 25%, #0f172a 0% 50%) 50% / 8px 8px',
            }}
          >
            <div
              className="w-full h-full"
              style={{
                background: `linear-gradient(to right, transparent, ${customHex})`,
              }}
            />
            {/* Knob Cermin Glowing yang Mengikuti Slider Transparansi */}
            <div
              className="absolute top-0 bottom-0 w-6 -translate-x-1/2 rounded-full border-2 border-white bg-white/40 shadow-[0_0_12px_#22d3ee] transition-all duration-75"
              style={{ left: `${alphaPercent}%` }}
            />
          </div>
        </div>
      )}

      {/* Keterangan Cerminan */}
      <div className="text-[9px] text-cyan-300/80 font-mono text-center mt-1.5 flex items-center justify-center gap-1">
        <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping inline-block" />
        <span>Cerminan Live Aktif • Geser di area dock</span>
      </div>
    </div>
  )
}
