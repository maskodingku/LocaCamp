import React, { useRef, useEffect, useState } from 'react'
import { Check, Palette, Sliders } from 'lucide-react'
import { HexColorPicker } from 'react-colorful'
import { FloatingSmartPicker } from './FloatingSmartPicker'
import type { PreviewTargetType } from '../../../hooks/useSmartPopupPosition'

export interface ColorPresetItem {
  id: string
  label: string
  preview: string
}

interface ColorOptionPopupProps {
  isOpen: boolean
  onClose: () => void
  selectedColor: string
  onSelect: (color: string) => void
  title: string
  presets: ColorPresetItem[]
  theme?: 'cyan' | 'emerald' | 'amber'
  targetType?: PreviewTargetType
}

// Helper untuk menormalisasi berbagai format warna (rgba, hex pendek, rgb) menjadi 6-digit hex (#rrggbb)
export const normalizeToHex = (colorStr?: string): string => {
  if (!colorStr) return '#09090b'
  const trimmed = colorStr.trim()
  if (trimmed.startsWith('#')) {
    if (trimmed.length === 4) {
      return `#${trimmed[1]}${trimmed[1]}${trimmed[2]}${trimmed[2]}${trimmed[3]}${trimmed[3]}`
    }
    return trimmed.slice(0, 7)
  }
  if (trimmed.startsWith('rgba') || trimmed.startsWith('rgb')) {
    const match = trimmed.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/)
    if (match) {
      const r = parseInt(match[1], 10).toString(16).padStart(2, '0')
      const g = parseInt(match[2], 10).toString(16).padStart(2, '0')
      const b = parseInt(match[3], 10).toString(16).padStart(2, '0')
      return `#${r}${g}${b}`
    }
  }
  if (trimmed === 'transparent') {
    return '#09090b'
  }
  return '#09090b'
}

// Helper untuk mengonversi string warna ke objek { r, g, b, a } (a: 0 - 1)
export const parseColorToRgba = (colorStr?: string): { r: number; g: number; b: number; a: number } => {
  if (!colorStr) return { r: 9, g: 9, b: 11, a: 0.78 }
  const trimmed = colorStr.trim().toLowerCase()
  if (trimmed === 'transparent') {
    return { r: 0, g: 0, b: 0, a: 0 }
  }
  if (trimmed.startsWith('rgba')) {
    const match = trimmed.match(/rgba\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*,\s*([\d.]+)\s*\)/)
    if (match) {
      return {
        r: Math.min(255, Math.max(0, parseInt(match[1], 10))),
        g: Math.min(255, Math.max(0, parseInt(match[2], 10))),
        b: Math.min(255, Math.max(0, parseInt(match[3], 10))),
        a: Math.min(1, Math.max(0, parseFloat(match[4]))),
      }
    }
  }
  if (trimmed.startsWith('rgb')) {
    const match = trimmed.match(/rgb\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)/)
    if (match) {
      return {
        r: Math.min(255, Math.max(0, parseInt(match[1], 10))),
        g: Math.min(255, Math.max(0, parseInt(match[2], 10))),
        b: Math.min(255, Math.max(0, parseInt(match[3], 10))),
        a: 1,
      }
    }
  }
  if (trimmed.startsWith('#')) {
    if (trimmed.length === 4) {
      return {
        r: parseInt(trimmed[1] + trimmed[1], 16),
        g: parseInt(trimmed[2] + trimmed[2], 16),
        b: parseInt(trimmed[3] + trimmed[3], 16),
        a: 1,
      }
    }
    if (trimmed.length === 7) {
      return {
        r: parseInt(trimmed.slice(1, 3), 16),
        g: parseInt(trimmed.slice(3, 5), 16),
        b: parseInt(trimmed.slice(5, 7), 16),
        a: 1,
      }
    }
    if (trimmed.length === 9) {
      return {
        r: parseInt(trimmed.slice(1, 3), 16),
        g: parseInt(trimmed.slice(3, 5), 16),
        b: parseInt(trimmed.slice(5, 7), 16),
        a: Math.round((parseInt(trimmed.slice(7, 9), 16) / 255) * 100) / 100,
      }
    }
  }
  return { r: 9, g: 9, b: 11, a: 1 }
}

// Helper untuk menggabungkan hex (#rrggbb) dengan alpha (0 - 100)
export const combineHexAndAlpha = (hex: string, alphaPercent: number): string => {
  if (alphaPercent <= 0) return 'transparent'
  const normalizedHex = normalizeToHex(hex)
  if (alphaPercent >= 100) return normalizedHex
  const r = parseInt(normalizedHex.slice(1, 3), 16)
  const g = parseInt(normalizedHex.slice(3, 5), 16)
  const b = parseInt(normalizedHex.slice(5, 7), 16)
  const a = Number((alphaPercent / 100).toFixed(2))
  return `rgba(${r}, ${g}, ${b}, ${a})`
}

export const ColorOptionPopup: React.FC<ColorOptionPopupProps> = ({
  isOpen,
  onClose,
  selectedColor,
  onSelect,
  title,
  presets,
  targetType = 'profile',
}) => {
  const popupRef = useRef<HTMLDivElement>(null)
  const isDraggingRef = useRef(false)
  const [isDragging, setIsDragging] = useState(false)
  const [isSmartPickerOpen, setIsSmartPickerOpen] = useState(false)
  const [smartPickerPart, setSmartPickerPart] = useState<'saturation' | 'hue' | 'alpha' | 'all'>('all')
  const throttleTimerRef = useRef<number | null>(null)
  const lastEmittedColorRef = useRef<string>('')

  // Cek apakah warna saat ini cocok dengan salah satu preset
  const isCurrentPreset = presets.some(p => p.id === selectedColor)

  // State warna kustom lokal (hex)
  const [customHex, setCustomHex] = useState<string>(() => {
    return isCurrentPreset ? '#00e5ff' : normalizeToHex(selectedColor)
  })

  // State transparansi lokal (0 - 100)
  const [alphaPercent, setAlphaPercent] = useState<number>(() => {
    const parsed = parseColorToRgba(selectedColor)
    return Math.round(parsed.a * 100)
  })

  // Sinkronisasi saat selectedColor berubah dari luar jika itu bukan preset
  // KRITIKAL: Jangan pernah timpa nilai lokal saat pengguna sedang aktif dragging (isDraggingRef.current === true)
  useEffect(() => {
    if (isDraggingRef.current) return
    const parsed = parseColorToRgba(selectedColor)
    setAlphaPercent(Math.round(parsed.a * 100))
    if (!isCurrentPreset && selectedColor && selectedColor.toLowerCase() !== 'transparent') {
      const normalized = normalizeToHex(selectedColor)
      setCustomHex(prev => (prev.toLowerCase() === normalized.toLowerCase() ? prev : normalized))
    }
  }, [selectedColor, isCurrentPreset])

  // Listener global pointerup / touchend untuk memastikan status drag selalu ter-reset jika jari kursor terangkat di luar elemen
  useEffect(() => {
    const handleRelease = () => {
      if (isDraggingRef.current) {
        isDraggingRef.current = false
        setIsDragging(false)
      }
    }
    window.addEventListener('pointerup', handleRelease)
    window.addEventListener('pointercancel', handleRelease)
    window.addEventListener('touchend', handleRelease)
    window.addEventListener('mouseup', handleRelease)
    return () => {
      window.removeEventListener('pointerup', handleRelease)
      window.removeEventListener('pointercancel', handleRelease)
      window.removeEventListener('touchend', handleRelease)
      window.removeEventListener('mouseup', handleRelease)
      if (throttleTimerRef.current) clearTimeout(throttleTimerRef.current)
    }
  }, [])

  // Reset status pick cerdas setiap kali modal dropdown utama ditutup
  useEffect(() => {
    if (!isOpen) {
      setIsSmartPickerOpen(false)
    }
  }, [isOpen])

  useEffect(() => {
    if (!isOpen) return

    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (target?.closest?.('[data-dropdown-trigger="true"]')) {
        return
      }
      // PENTING: Jangan tutup popup utama jika interaksi atau klik terjadi di dalam FloatingSmartPicker!
      if (target?.closest?.('[data-smart-picker="true"]')) {
        return
      }
      if (popupRef.current && !popupRef.current.contains(e.target as Node)) {
        onClose()
      }
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (isSmartPickerOpen) {
          setIsSmartPickerOpen(false)
        } else {
          onClose()
        }
      }
    }

    const timer = setTimeout(() => {
      document.addEventListener('mousedown', handleClickOutside)
      document.addEventListener('keydown', handleKeyDown)
    }, 50)

    return () => {
      clearTimeout(timer)
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, onClose, isSmartPickerOpen])

  if (!isOpen) return null

  // Handler saat warna di HexColorPicker digeser / diubah
  const handleCustomColorChange = (newHex: string) => {
    isDraggingRef.current = true
    if (!isDragging) {
      setIsDragging(true)
    }
    setCustomHex(newHex)
    const combined = combineHexAndAlpha(newHex, alphaPercent)

    // Throttling live preview ke parent setiap 80ms:
    // Menghasilkan live update visual di watermark kamera tanpa membebani main thread render cycle
    if (!throttleTimerRef.current) {
      throttleTimerRef.current = window.setTimeout(() => {
        throttleTimerRef.current = null
        lastEmittedColorRef.current = combined
        onSelect(combined)
      }, 80)
    }
  }

  // Handler saat interaksi warna selesai dilepas (touchend / mouseup)
  const handleCustomColorChangeEnd = (finalHex: string) => {
    isDraggingRef.current = false
    setIsDragging(false)
    if (throttleTimerRef.current) {
      clearTimeout(throttleTimerRef.current)
      throttleTimerRef.current = null
    }
    setCustomHex(finalHex)
    const combined = combineHexAndAlpha(finalHex, alphaPercent)
    lastEmittedColorRef.current = combined
    onSelect(combined) // Komit warna akhir secara pasti
  }

  // Handler saat slider transparansi digeser
  const handleAlphaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value)
    setAlphaPercent(val)
    const combined = combineHexAndAlpha(customHex, val)

    if (!throttleTimerRef.current) {
      throttleTimerRef.current = window.setTimeout(() => {
        throttleTimerRef.current = null
        lastEmittedColorRef.current = combined
        onSelect(combined)
      }, 80)
    }
  }

  // Handler saat slider transparansi dilepas
  const handleAlphaChangeEnd = () => {
    isDraggingRef.current = false
    setIsDragging(false)
    if (throttleTimerRef.current) {
      clearTimeout(throttleTimerRef.current)
      throttleTimerRef.current = null
    }
    const combined = combineHexAndAlpha(customHex, alphaPercent)
    lastEmittedColorRef.current = combined
    onSelect(combined)
  }

  // Opsi Kustom sedang aktif jika selectedColor tidak cocok dengan preset manapun, atau sama persis dengan customHex / combined
  const currentCombined = combineHexAndAlpha(customHex, alphaPercent).toLowerCase()
  const isCustomSelected =
    !isCurrentPreset ||
    selectedColor.toLowerCase() === customHex.toLowerCase() ||
    selectedColor.toLowerCase() === currentCombined

  return (
    <>
      {/* Floating Smart Picker: Muncul secara cerdas di luar area target saat pick diaktifkan */}
      <FloatingSmartPicker
        isOpen={isSmartPickerOpen}
        onClose={() => setIsSmartPickerOpen(false)}
        activePart={smartPickerPart}
        customHex={customHex}
        onChangeHex={(newHex) => {
          handleCustomColorChange(newHex)
          handleCustomColorChangeEnd(newHex)
        }}
        alphaPercent={alphaPercent}
        onChangeAlpha={(newAlpha) => {
          setAlphaPercent(newAlpha)
          const combined = combineHexAndAlpha(customHex, newAlpha)
          lastEmittedColorRef.current = combined
          onSelect(combined)
        }}
        targetType={targetType}
      />

      {/* Popup Kontrol Utama: Tetap pada ukuran & posisi aslinya di atas dock tanpa menciut */}
      <div
        ref={popupRef}
        className={`absolute bottom-full mb-3 left-0 right-0 z-[140] select-none flex flex-col p-3 sm:p-3.5 rounded-[28px] bg-[#020717]/95 backdrop-blur-2xl border-2 border-cyan-400 shadow-[0_0_35px_rgba(6,182,212,0.65),0_20px_60px_rgba(0,0,0,0.9),inset_0_1.5px_2.5px_rgba(255,255,255,0.7)] text-white overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-150 ${
          isSmartPickerOpen ? 'hidden pointer-events-none' : ''
        }`}
      >
        {/* ========================================================================= */}
        {/* GLOSSY GLASS BUBBLE ORBS & SPECULAR GLARE                                 */}
        {/* ========================================================================= */}
        <div className="absolute -bottom-8 -right-4 w-36 h-36 rounded-full bg-gradient-to-br from-cyan-400/15 via-blue-500/5 to-transparent border border-cyan-300/35 blur-[0.3px] shadow-[inset_0_4px_10px_rgba(255,255,255,0.5),inset_0_-4px_10px_rgba(0,0,0,0.7),0_0_25px_rgba(6,182,212,0.2)] pointer-events-none">
          <div className="absolute top-2 inset-x-5 h-4 rounded-full bg-white/25 blur-[1px]" />
        </div>
        <div className="absolute top-1/4 -right-6 w-24 h-24 rounded-full bg-gradient-to-br from-sky-400/15 via-cyan-600/5 to-transparent border border-cyan-400/35 blur-[0.3px] shadow-[inset_0_3px_8px_rgba(255,255,255,0.6),inset_0_-3px_8px_rgba(0,0,0,0.7),0_0_20px_rgba(14,165,233,0.25)] pointer-events-none">
          <div className="absolute top-1.5 inset-x-3 h-3 rounded-full bg-white/30 blur-[0.8px]" />
        </div>
        <div className="absolute bottom-10 -left-6 w-28 h-28 rounded-full bg-gradient-to-br from-cyan-500/10 via-transparent to-blue-600/10 border border-cyan-400/25 blur-[0.4px] shadow-[inset_0_3px_8px_rgba(255,255,255,0.45),inset_0_-3px_8px_rgba(0,0,0,0.6),0_0_18px_rgba(6,182,212,0.15)] pointer-events-none">
          <div className="absolute top-2 inset-x-4 h-3.5 rounded-full bg-white/20 blur-[1px]" />
        </div>

        {/* Specular Highlight Glare di Atas Popup */}
        <div className="absolute top-0 inset-x-8 h-[1.5px] bg-gradient-to-r from-transparent via-cyan-100 to-transparent pointer-events-none shadow-[0_0_8px_#22d3ee]" />

        {/* HEADER UTAMA: JUDUL + BADGE TOTAL PILIHAN */}
        <div className="relative flex items-center justify-between pb-2 mb-2 border-b border-cyan-500/25 z-10 shrink-0">
          <span className="text-xs font-bold tracking-wider uppercase text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
            {title}
          </span>
          <div className="px-2.5 py-0.5 rounded-full bg-[#030917]/80 border border-cyan-500/40 shadow-[inset_0_1px_1px_rgba(255,255,255,0.3),0_0_8px_rgba(6,182,212,0.3)] flex items-center gap-1 font-mono text-[10px]">
            <span className="text-cyan-400 font-bold drop-shadow-[0_0_6px_rgba(6,182,212,0.8)]">
              {presets.length + 1}
            </span>
            <span className="text-slate-400">Pilihan</span>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 1. BAGIAN ATAS: AREA SELECT / COLOR PICKER                                */}
        {/* ========================================================================= */}
        <div className="relative p-2.5 rounded-2xl bg-[#030d22]/90 border border-cyan-400/40 shadow-[inset_0_1px_2px_rgba(255,255,255,0.25),0_4px_12px_rgba(0,0,0,0.6)] mb-2.5 shrink-0 z-10">
          <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-cyan-300/90 mb-1.5 flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Palette className="w-3 h-3 text-cyan-400" />
              <span>Select Warna Kustom:</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  setIsSmartPickerOpen(true)
                  setSmartPickerPart('saturation')
                }}
                className="px-2 py-0.5 rounded-full border border-cyan-400/60 bg-cyan-950/70 hover:bg-cyan-800 text-cyan-300 hover:text-white text-[9px] font-mono transition-all flex items-center gap-1 shadow-[0_0_8px_rgba(6,182,212,0.3)] active:scale-95"
                title="Buka Pick Warna di Area Bebas Target"
              >
                <span>Pick Cerdas</span>
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
              </button>
              <div className="flex items-center gap-1.5">
                <div
                  className="w-3.5 h-3.5 rounded-full border border-white/60 shadow-[0_0_6px_rgba(255,255,255,0.5)] shrink-0"
                  style={{ backgroundColor: combineHexAndAlpha(customHex, alphaPercent) }}
                />
                <span className="font-mono text-cyan-200 font-bold">
                  {customHex.toUpperCase()}{alphaPercent < 100 ? ` (${alphaPercent}%)` : ''}
                </span>
              </div>
            </div>
          </div>

          {/* Modul react-colorful dengan class .hud-color-picker */}
          <div
            className="hud-color-picker w-full"
            onPointerDown={(e) => {
              isDraggingRef.current = true
              setIsDragging(true)
              setIsSmartPickerOpen(true)
              const target = e.target as HTMLElement
              if (target?.closest?.('.react-colorful__hue')) {
                setSmartPickerPart('hue')
              } else {
                setSmartPickerPart('saturation')
              }
            }}
            onTouchStart={(e) => {
              isDraggingRef.current = true
              setIsDragging(true)
              setIsSmartPickerOpen(true)
              const target = e.target as HTMLElement
              if (target?.closest?.('.react-colorful__hue')) {
                setSmartPickerPart('hue')
              } else {
                setSmartPickerPart('saturation')
              }
            }}
            onMouseDown={(e) => {
              isDraggingRef.current = true
              setIsDragging(true)
              setIsSmartPickerOpen(true)
              const target = e.target as HTMLElement
              if (target?.closest?.('.react-colorful__hue')) {
                setSmartPickerPart('hue')
              } else {
                setSmartPickerPart('saturation')
              }
            }}
          >
            <HexColorPicker
              color={customHex}
              onChange={handleCustomColorChange}
              onChangeEnd={handleCustomColorChangeEnd}
            />
          </div>

          {/* Baris Input Manual HEX + Preview Cepat */}
          <div className="flex items-center justify-between gap-2 mt-2 pt-2 border-t border-cyan-500/25">
            <div className="flex items-center gap-1.5 min-w-0">
              <span className="text-[10px] font-mono font-bold text-slate-300">HEX:</span>
              <input
                type="text"
                value={customHex.toUpperCase()}
                onChange={(e) => {
                  const val = e.target.value.trim()
                  const formatted = val.startsWith('#') ? val : `#${val}`
                  setCustomHex(formatted)
                  if (/^#[0-9A-Fa-f]{6}$/.test(formatted)) {
                    onSelect(formatted)
                  }
                }}
                className="w-24 bg-[#010714] border border-cyan-500/40 focus:border-cyan-300 px-2 py-0.5 rounded-lg text-xs font-mono font-bold text-white tracking-wider outline-none focus:ring-1 focus:ring-cyan-400"
                placeholder="#00E5FF"
                maxLength={7}
              />
            </div>
            <span className="text-[10px] text-cyan-200/70 font-mono">
              {isCustomSelected ? '● Kustom Aktif' : 'Geser untuk memilih'}
            </span>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 2. BAGIAN BAWAH: DAFTAR PRESET WARNA + ITEM KUSTOM                        */}
        {/* ========================================================================= */}
        <div className="relative z-10 flex-1 min-h-0 flex flex-col">
          <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 mb-1 px-1 flex items-center justify-between shrink-0">
          <span>Daftar Pilihan Preset:</span>
          <span className="text-slate-500 text-[9px]">(Termasuk Kustom)</span>
        </div>

        <div className="max-h-32 sm:max-h-36 overflow-y-auto space-y-1.5 pr-1 custom-scrollbar">
          {/* A. Preset-preset standar */}
          {presets.map((item, index) => {
            const isSelected = !isCustomSelected && item.id === selectedColor
            const itemNumber = index + 1
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  onSelect(item.id)
                  onClose()
                }}
                className={`relative w-full flex items-center justify-between px-3 py-2 rounded-2xl text-left transition-all cursor-pointer active:scale-[0.99] overflow-hidden group ${
                  isSelected
                    ? 'border-2 border-cyan-300 bg-gradient-to-r from-[#009fd9] via-[#007ebb] to-[#01649f] shadow-[0_0_24px_rgba(6,182,212,0.9),inset_0_1.5px_2px_rgba(255,255,255,0.85),inset_0_-2px_4px_rgba(0,0,0,0.5)]'
                    : 'border border-cyan-500/30 hover:border-cyan-400/60 bg-gradient-to-r from-[#06152e]/70 via-[#030d22]/75 to-[#051733]/70 hover:from-[#092244]/80 shadow-[inset_0_1px_1px_rgba(255,255,255,0.2),0_2px_8px_rgba(0,0,0,0.6)] text-slate-300 hover:text-white'
                }`}
              >
                {/* Specular Glare */}
                <div
                  className={`absolute top-0 inset-x-3 h-[1px] pointer-events-none ${
                    isSelected ? 'bg-white/80 shadow-[0_0_4px_#fff]' : 'bg-white/20'
                  }`}
                />

                {/* Sisi Kiri: Checkbox / Swatch / Label */}
                <div className="flex items-center gap-2.5 min-w-0">
                  {isSelected ? (
                    <div className="w-5 h-5 rounded-md bg-white/20 border border-white/50 flex items-center justify-center shrink-0 shadow-[0_0_8px_rgba(255,255,255,0.6)]">
                      <Check className="w-3.5 h-3.5 text-white stroke-[3] drop-shadow-[0_0_4px_rgba(255,255,255,0.8)]" />
                    </div>
                  ) : (
                    <div className="w-5 h-5 rounded-md bg-cyan-950/40 border border-cyan-500/30 flex items-center justify-center shrink-0 group-hover:border-cyan-400/60">
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-500/50 group-hover:bg-cyan-400 transition-colors" />
                    </div>
                  )}

                  {/* Swatch Lingkaran Warna Preset */}
                  <div
                    className="w-4 h-4 rounded-full border border-white/40 shadow-[0_0_6px_rgba(255,255,255,0.4)] shrink-0"
                    style={{
                      backgroundColor: item.preview === 'transparent' ? 'rgba(255,255,255,0.1)' : item.preview,
                      backgroundImage: item.preview === 'transparent' ? 'repeating-conic-gradient(#808080 0% 25%, transparent 0% 50%) 50% / 8px 8px' : undefined,
                    }}
                  />

                  <span
                    className={`text-xs truncate ${
                      isSelected
                        ? 'font-bold text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]'
                        : 'font-medium text-slate-200 group-hover:text-white'
                    }`}
                  >
                    {item.label}
                  </span>
                </div>

                {/* Sisi Kanan: Nomor Urut */}
                <div className="flex items-center shrink-0 ml-2">
                  <span
                    className={`text-xs font-mono font-bold ${
                      isSelected
                        ? 'text-cyan-100 drop-shadow-[0_0_6px_rgba(255,255,255,0.8)]'
                        : 'text-cyan-500/80 group-hover:text-cyan-400'
                    }`}
                  >
                    {itemNumber}
                  </span>
                  {isSelected && (
                    <div className="h-4 w-1 rounded-full bg-cyan-200 shadow-[0_0_8px_#fff,0_0_12px_#22d3ee] ml-2" />
                  )}
                </div>
              </button>
            )
          })}

          {/* B. Opsi Baru: KUSTOM (Pilihan Terakhir di Bagian Bawah) */}
          <button
            type="button"
            onClick={() => {
              const finalColor = combineHexAndAlpha(customHex, alphaPercent)
              onSelect(finalColor)
              onClose()
            }}
            className={`relative w-full flex items-center justify-between px-3 py-2 rounded-2xl text-left transition-all cursor-pointer active:scale-[0.99] overflow-hidden group ${
              isCustomSelected
                ? 'border-2 border-cyan-300 bg-gradient-to-r from-[#009fd9] via-[#007ebb] to-[#01649f] shadow-[0_0_24px_rgba(6,182,212,0.9),inset_0_1.5px_2.5px_rgba(255,255,255,0.85),inset_0_-2px_4px_rgba(0,0,0,0.5)]'
                : 'border border-cyan-500/30 hover:border-cyan-400/60 bg-gradient-to-r from-[#06152e]/70 via-[#030d22]/75 to-[#051733]/70 hover:from-[#092244]/80 shadow-[inset_0_1px_1px_rgba(255,255,255,0.2),0_2px_8px_rgba(0,0,0,0.6)] text-slate-300 hover:text-white'
            }`}
          >
            {/* Specular Glare */}
            <div
              className={`absolute top-0 inset-x-3 h-[1px] pointer-events-none ${
                isCustomSelected ? 'bg-white/80 shadow-[0_0_4px_#fff]' : 'bg-white/20'
              }`}
            />

            {/* Sisi Kiri: Checkbox / Swatch Kustom / Label Kustom */}
            <div className="flex items-center gap-2.5 min-w-0">
              {isCustomSelected ? (
                <div className="w-5 h-5 rounded-md bg-white/20 border border-white/50 flex items-center justify-center shrink-0 shadow-[0_0_8px_rgba(255,255,255,0.6)]">
                  <Check className="w-3.5 h-3.5 text-white stroke-[3] drop-shadow-[0_0_4px_rgba(255,255,255,0.8)]" />
                </div>
              ) : (
                <div className="w-5 h-5 rounded-md bg-cyan-950/40 border border-cyan-500/30 flex items-center justify-center shrink-0 group-hover:border-cyan-400/60">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-500/50 group-hover:bg-cyan-400 transition-colors" />
                </div>
              )}

              {/* Swatch Lingkaran Warna Kustom */}
              <div
                className="w-4 h-4 rounded-full border border-white/60 shadow-[0_0_6px_rgba(255,255,255,0.5)] shrink-0"
                style={{ backgroundColor: combineHexAndAlpha(customHex, alphaPercent) }}
              />

              <div className="flex items-center gap-1.5 min-w-0">
                <span
                  className={`text-xs truncate ${
                    isCustomSelected
                      ? 'font-bold text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]'
                      : 'font-medium text-slate-200 group-hover:text-white'
                  }`}
                >
                  Kustom
                </span>
                <span
                  className={`text-[10px] font-mono truncate ${
                    isCustomSelected ? 'text-cyan-100/90 font-bold' : 'text-cyan-400/70'
                  }`}
                >
                  ({combineHexAndAlpha(customHex, alphaPercent).toUpperCase()})
                </span>
              </div>
            </div>

            {/* Sisi Kanan: Nomor Urut */}
            <div className="flex items-center shrink-0 ml-2">
              <span
                className={`text-xs font-mono font-bold ${
                  isCustomSelected
                    ? 'text-cyan-100 drop-shadow-[0_0_6px_rgba(255,255,255,0.8)]'
                    : 'text-cyan-500/80 group-hover:text-cyan-400'
                }`}
              >
                {presets.length + 1}
              </span>
              {isCustomSelected && (
                <div className="h-4 w-1 rounded-full bg-cyan-200 shadow-[0_0_8px_#fff,0_0_12px_#22d3ee] ml-2" />
              )}
            </div>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3. BAGIAN PALING BAWAH: SLIDER TINGKAT TRANSPARANSI (OPASITAS WARNA)       */}
      {/* ========================================================================= */}
      <div className="relative z-10 pt-2.5 mt-2 border-t border-cyan-500/25 shrink-0">
        <div className="flex items-center justify-between text-[10px] font-mono font-bold uppercase tracking-wider mb-1.5 px-0.5">
          <div className="flex items-center gap-1.5 text-cyan-300">
            <Sliders className="w-3 h-3 text-cyan-400" />
            <span>Tingkat Transparansi:</span>
          </div>
          <div className="px-2 py-0.5 rounded-full bg-[#030917]/90 border border-cyan-500/40 shadow-[0_0_8px_rgba(6,182,212,0.3)] flex items-center gap-1 text-[10px]">
            <span className="text-cyan-300 font-bold">{alphaPercent}%</span>
            <span className="text-slate-400 font-normal">
              {alphaPercent === 0 ? '(Bening)' : alphaPercent === 100 ? '(Pekat)' : ''}
            </span>
          </div>
        </div>

        {/* Slider Bar Transparansi dengan Checkerboard Background */}
        <div className="relative flex items-center w-full h-5">
          {/* Latar Checkerboard Grid Transparan */}
          <div
            className="absolute inset-0 rounded-full border border-white/30 overflow-hidden shadow-[inset_0_1px_3px_rgba(0,0,0,0.6)]"
            style={{
              backgroundImage: 'repeating-conic-gradient(#334155 0% 25%, #0f172a 0% 50%) 50% / 8px 8px',
            }}
          >
            {/* Lapisan Gradien dari Transparan ke Warna Hex Aktif */}
            <div
              className="w-full h-full"
              style={{
                background: `linear-gradient(to right, transparent, ${customHex})`,
              }}
            />
          </div>

          <input
            type="range"
            min={0}
            max={100}
            step={1}
            value={alphaPercent}
            onPointerDown={() => {
              isDraggingRef.current = true
              setIsDragging(true)
              setIsSmartPickerOpen(true)
              setSmartPickerPart('alpha')
            }}
            onTouchStart={() => {
              isDraggingRef.current = true
              setIsDragging(true)
              setIsSmartPickerOpen(true)
              setSmartPickerPart('alpha')
            }}
            onMouseDown={() => {
              isDraggingRef.current = true
              setIsDragging(true)
              setIsSmartPickerOpen(true)
              setSmartPickerPart('alpha')
            }}
            onPointerUp={handleAlphaChangeEnd}
            onTouchEnd={handleAlphaChangeEnd}
            onMouseUp={handleAlphaChangeEnd}
            onChange={handleAlphaChange}
            className="hud-alpha-slider relative z-10 w-full h-5 bg-transparent appearance-none cursor-ew-resize focus:outline-none"
          />
        </div>
      </div>
    </div>
    </>
  )
}
