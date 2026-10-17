import React, { useRef, useState, useEffect, useCallback } from 'react'
import { Palette, Sliders, Check } from 'lucide-react'
import { combineHexAndAlpha, normalizeToHex } from './ColorOptionPopup'

export interface FloatingSmartPickerProps {
  isOpen: boolean
  onClose?: () => void
  activePart?: 'saturation' | 'hue' | 'alpha' | 'all' | null
  customHex: string
  onChangeHex: (hex: string) => void
  alphaPercent: number
  onChangeAlpha: (alpha: number) => void
  targetType?: 'profile' | 'geotag' | 'watermark' | 'none'
  title?: string
}

// Konversi Hex (#rrggbb) ke HSV (h: 0-360, s: 0-100, v: 0-100)
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

// Konversi HSV ke Hex (#rrggbb)
function hsvToHex(h: number, s: number, v: number): string {
  const normS = Math.max(0, Math.min(100, s)) / 100
  const normV = Math.max(0, Math.min(100, v)) / 100
  const normH = ((h % 360) + 360) % 360

  const c = normV * normS
  const x = c * (1 - Math.abs(((normH / 60) % 2) - 1))
  const m = normV - c

  let r1 = 0,
    g1 = 0,
    b1 = 0
  if (normH < 60) {
    r1 = c
    g1 = x
  } else if (normH < 120) {
    r1 = x
    g1 = c
  } else if (normH < 180) {
    g1 = c
    b1 = x
  } else if (normH < 240) {
    g1 = x
    b1 = c
  } else if (normH < 300) {
    r1 = x
    b1 = c
  } else {
    r1 = c
    b1 = x
  }

  const r = Math.round((r1 + m) * 255)
    .toString(16)
    .padStart(2, '0')
  const g = Math.round((g1 + m) * 255)
    .toString(16)
    .padStart(2, '0')
  const b = Math.round((b1 + m) * 255)
    .toString(16)
    .padStart(2, '0')

  return `#${r}${g}${b}`
}

export const FloatingSmartPicker: React.FC<FloatingSmartPickerProps> = ({
  isOpen,
  onClose,
  activePart = 'all',
  customHex,
  onChangeHex,
  alphaPercent,
  onChangeAlpha,
  targetType = 'profile',
}) => {
  const saturationBoxRef = useRef<HTMLDivElement>(null)
  const hueSliderRef = useRef<HTMLDivElement>(null)
  const alphaSliderRef = useRef<HTMLDivElement>(null)

  // Status interaksi lokal
  const [isInteracting, setIsInteracting] = useState(false)
  const activeControlRef = useRef<'saturation' | 'hue' | 'alpha' | null>(null)

  // Nilai HSV lokal yang selalu tersinkron
  const currentHsv = hexToHsv(customHex)

  // Deteksi posisi cerdas: cari elemen target di DOM
  const [smartPlacement, setSmartPlacement] = useState<'top' | 'bottom'>('top')

  useEffect(() => {
    if (!isOpen) return
    const updatePosition = () => {
      if (typeof window === 'undefined') return
      const targetEl =
        targetType !== 'none'
          ? (document.querySelector(`[data-preview-target="${targetType}"]`) as HTMLElement | null)
          : null
      if (targetEl) {
        const rect = targetEl.getBoundingClientRect()
        const targetCenterY = rect.top + rect.height / 2
        // Jika target di tengah/bawah layar (> 42%), tempatkan picker di atas layar
        setSmartPlacement(targetCenterY > window.innerHeight * 0.42 ? 'top' : 'bottom')
      } else {
        setSmartPlacement('top')
      }
    }
    updatePosition()
    window.addEventListener('resize', updatePosition)
    return () => window.removeEventListener('resize', updatePosition)
  }, [isOpen, targetType])

  // =========================================================================
  // LOGIKA HIT-DETECTION & INTERAKSI KOTAK SATURASI (SATURATION & BRIGHTNESS)
  // Hanya bekerja jika sentuhan/kursor benar-benar masuk ke dalam kotak pick!
  // =========================================================================
  const handleSaturationPointer = useCallback(
    (e: React.PointerEvent<HTMLDivElement> | PointerEvent) => {
      const box = saturationBoxRef.current
      if (!box) return
      const rect = box.getBoundingClientRect()

      // Hit-detection: hitung posisi relatif kursor terhadap kotak
      const clientX = e.clientX
      const clientY = e.clientY

      const x = Math.max(0, Math.min(rect.width, clientX - rect.left))
      const y = Math.max(0, Math.min(rect.height, clientY - rect.top))

      const newS = Math.round((x / rect.width) * 100)
      const newV = Math.round((1 - y / rect.height) * 100)

      const newHex = hsvToHex(currentHsv.h, newS, newV)
      onChangeHex(newHex)
    },
    [currentHsv.h, onChangeHex]
  )

  const handleSaturationStart = (e: React.PointerEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    // Sentuhan masuk ke dalam kotak pick: tandai kontrol aktif
    activeControlRef.current = 'saturation'
    setIsInteracting(true)
    handleSaturationPointer(e)

    const onPointerMove = (moveEv: PointerEvent) => {
      if (activeControlRef.current === 'saturation') {
        handleSaturationPointer(moveEv)
      }
    }

    const onPointerUp = () => {
      activeControlRef.current = null
      setIsInteracting(false)
      window.removeEventListener('pointermove', onPointerMove)
      window.removeEventListener('pointerup', onPointerUp)
      window.removeEventListener('pointercancel', onPointerUp)
    }

    window.addEventListener('pointermove', onPointerMove)
    window.addEventListener('pointerup', onPointerUp)
    window.addEventListener('pointercancel', onPointerUp)
  }

  // =========================================================================
  // LOGIKA HIT-DETECTION & INTERAKSI SLIDER HUE
  // =========================================================================
  const handleHuePointer = useCallback(
    (e: React.PointerEvent<HTMLDivElement> | PointerEvent) => {
      const slider = hueSliderRef.current
      if (!slider) return
      const rect = slider.getBoundingClientRect()

      const clientX = e.clientX
      const x = Math.max(0, Math.min(rect.width, clientX - rect.left))
      const ratio = x / rect.width
      const newH = Math.round(ratio * 360)

      const newHex = hsvToHex(newH, currentHsv.s, currentHsv.v)
      onChangeHex(newHex)
    },
    [currentHsv.s, currentHsv.v, onChangeHex]
  )

  const handleHueStart = (e: React.PointerEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    activeControlRef.current = 'hue'
    setIsInteracting(true)
    handleHuePointer(e)

    const onPointerMove = (moveEv: PointerEvent) => {
      if (activeControlRef.current === 'hue') {
        handleHuePointer(moveEv)
      }
    }

    const onPointerUp = () => {
      activeControlRef.current = null
      setIsInteracting(false)
      window.removeEventListener('pointermove', onPointerMove)
      window.removeEventListener('pointerup', onPointerUp)
      window.removeEventListener('pointercancel', onPointerUp)
    }

    window.addEventListener('pointermove', onPointerMove)
    window.addEventListener('pointerup', onPointerUp)
    window.addEventListener('pointercancel', onPointerUp)
  }

  // =========================================================================
  // LOGIKA HIT-DETECTION & INTERAKSI SLIDER TRANSPARANSI (ALPHA)
  // =========================================================================
  const handleAlphaPointer = useCallback(
    (e: React.PointerEvent<HTMLDivElement> | PointerEvent) => {
      const slider = alphaSliderRef.current
      if (!slider) return
      const rect = slider.getBoundingClientRect()

      const clientX = e.clientX
      const x = Math.max(0, Math.min(rect.width, clientX - rect.left))
      const ratio = x / rect.width
      const newAlpha = Math.round(ratio * 100)
      onChangeAlpha(newAlpha)
    },
    [onChangeAlpha]
  )

  const handleAlphaStart = (e: React.PointerEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    activeControlRef.current = 'alpha'
    setIsInteracting(true)
    handleAlphaPointer(e)

    const onPointerMove = (moveEv: PointerEvent) => {
      if (activeControlRef.current === 'alpha') {
        handleAlphaPointer(moveEv)
      }
    }

    const onPointerUp = () => {
      activeControlRef.current = null
      setIsInteracting(false)
      window.removeEventListener('pointermove', onPointerMove)
      window.removeEventListener('pointerup', onPointerUp)
      window.removeEventListener('pointercancel', onPointerUp)
    }

    window.addEventListener('pointermove', onPointerMove)
    window.addEventListener('pointerup', onPointerUp)
    window.addEventListener('pointercancel', onPointerUp)
  }

  if (!isOpen) return null

  const combinedColor = combineHexAndAlpha(customHex, alphaPercent)
  const isTop = smartPlacement === 'top'
  const positionClasses = isTop
    ? 'fixed top-3 left-3 right-3 sm:left-auto sm:right-6 sm:w-full sm:max-w-[360px] z-[160]'
    : 'fixed bottom-28 left-3 right-3 sm:left-auto sm:right-6 sm:w-full sm:max-w-[360px] z-[160]'

  return (
    <div
      data-smart-picker="true"
      className={`${positionClasses} select-none p-3.5 rounded-[26px] bg-[#020717]/95 backdrop-blur-2xl border-2 border-cyan-400 shadow-[0_0_35px_rgba(6,182,212,0.8),0_20px_60px_rgba(0,0,0,0.9),inset_0_1.5px_2.5px_rgba(255,255,255,0.7)] text-white animate-in fade-in zoom-in-95 duration-150 overflow-hidden touch-none`}
    >
      {/* Specular Highlight Glare di Atas Box */}
      <div className="absolute top-0 inset-x-8 h-[1.5px] bg-gradient-to-r from-transparent via-cyan-100 to-transparent pointer-events-none shadow-[0_0_8px_#22d3ee]" />

      {/* Header Info Live Cerdas */}
      <div className="flex items-center justify-between pb-2 mb-2 border-b border-cyan-500/25">
        <div className="flex items-center gap-2">
          {activePart === 'alpha' ? (
            <Sliders className="w-3.5 h-3.5 text-cyan-400" />
          ) : (
            <Palette className="w-3.5 h-3.5 text-cyan-400" />
          )}
          <span className="text-xs font-bold tracking-wider uppercase text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
            {activePart === 'saturation'
              ? 'Warna & Kecerahan'
              : activePart === 'hue'
              ? 'Spektrum Warna (Hue)'
              : 'Tingkat Transparansi'}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Live Swatch Badge */}
          <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#030917]/90 border border-cyan-500/40 shadow-[0_0_8px_rgba(6,182,212,0.4)]">
            <div
              className="w-3.5 h-3.5 rounded-full border border-white/60 shadow-[0_0_6px_rgba(255,255,255,0.5)] shrink-0"
              style={{ backgroundColor: combinedColor }}
            />
            <span className="font-mono text-[10px] text-cyan-200 font-bold">
              {customHex.toUpperCase()}{alphaPercent < 100 ? ` (${alphaPercent}%)` : ''}
            </span>
          </div>

          {/* Tombol Tutup / Selesai */}
          {onClose && (
            <button
              type="button"
              onPointerDown={(e) => e.stopPropagation()}
              onMouseDown={(e) => e.stopPropagation()}
              onClick={(e) => {
                e.stopPropagation()
                e.preventDefault()
                onClose()
              }}
              className="w-6 h-6 rounded-full bg-cyan-950/80 hover:bg-cyan-800 border border-cyan-400/60 flex items-center justify-center text-cyan-300 hover:text-white transition-all shadow-[0_0_8px_rgba(6,182,212,0.4)] active:scale-90 cursor-pointer"
              title="Selesai"
            >
              <Check className="w-3.5 h-3.5 stroke-[3]" />
            </button>
          )}
        </div>
      </div>

      {/* 1. HANYA KOTAK SATURASI JIKA YANG DITEKAN ADALAH SATURASI */}
      {activePart === 'saturation' && (
        <div className="space-y-2 mb-1">
          <div
            ref={saturationBoxRef}
            onPointerDown={handleSaturationStart}
            className="relative w-full h-32 rounded-xl border border-cyan-400/60 overflow-hidden shadow-[inset_0_2px_6px_rgba(0,0,0,0.7)] cursor-crosshair active:ring-2 active:ring-cyan-300 transition-shadow"
            style={{ backgroundColor: `hsl(${currentHsv.h}, 100%, 50%)` }}
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
            {/* Pointer Ring Glowing yang Menunjukkan Titik Koordinat Saat Ini */}
            <div
              className="absolute w-5 h-5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white shadow-[0_0_12px_#22d3ee,inset_0_0_4px_#fff] pointer-events-none transition-transform"
              style={{
                left: `${currentHsv.s}%`,
                top: `${100 - currentHsv.v}%`,
                backgroundColor: customHex,
                transform: isInteracting && activeControlRef.current === 'saturation' ? 'translate(-50%, -50%) scale(1.15)' : 'translate(-50%, -50%) scale(1)',
              }}
            />
          </div>
        </div>
      )}

      {/* 2. HANYA SLIDER HUE JIKA YANG DITEKAN ADALAH HUE */}
      {activePart === 'hue' && (
        <div className="space-y-1 mb-1">
          <div
            ref={hueSliderRef}
            onPointerDown={handleHueStart}
            className="relative w-full h-7 rounded-full border border-cyan-400/60 overflow-hidden shadow-[0_0_12px_rgba(6,182,212,0.4)] cursor-ew-resize active:ring-2 active:ring-cyan-300"
            style={{
              background:
                'linear-gradient(to right, #f00 0%, #ff0 17%, #0f0 33%, #0ff 50%, #00f 67%, #f0f 83%, #f00 100%)',
            }}
          >
            {/* Knob Glowing Slider Hue */}
            <div
              className="absolute top-0 bottom-0 w-7 -translate-x-1/2 rounded-full border-2 border-white bg-white/40 shadow-[0_0_12px_#22d3ee] pointer-events-none transition-transform"
              style={{
                left: `${(currentHsv.h / 360) * 100}%`,
                transform: isInteracting && activeControlRef.current === 'hue' ? 'translateX(-50%) scale(1.1)' : 'translateX(-50%) scale(1)',
              }}
            />
          </div>
        </div>
      )}

      {/* 3. HANYA SLIDER TRANSPARANSI JIKA YANG DITEKAN ADALAH ALPHA */}
      {activePart === 'alpha' && (
        <div className="space-y-1 mb-1">
          <div
            ref={alphaSliderRef}
            onPointerDown={handleAlphaStart}
            className="relative w-full h-7 rounded-full border border-cyan-400/60 overflow-hidden shadow-[0_0_12px_rgba(6,182,212,0.4)] cursor-ew-resize active:ring-2 active:ring-cyan-300"
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
            {/* Knob Glowing Slider Alpha */}
            <div
              className="absolute top-0 bottom-0 w-7 -translate-x-1/2 rounded-full border-2 border-white bg-white/40 shadow-[0_0_12px_#22d3ee] pointer-events-none transition-transform"
              style={{
                left: `${alphaPercent}%`,
                transform: isInteracting && activeControlRef.current === 'alpha' ? 'translateX(-50%) scale(1.1)' : 'translateX(-50%) scale(1)',
              }}
            />
          </div>
        </div>
      )}

      {/* Keterangan Interaktif Mandiri */}
      <div className="text-[9px] text-cyan-300/80 font-mono text-center mt-1 flex items-center justify-center gap-1.5">
        <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 inline-block animate-pulse" />
        <span>Sentuh langsung area pick untuk mengatur warna</span>
      </div>
    </div>
  )
}
