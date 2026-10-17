import React, { useRef, useEffect, useState } from 'react'
import { Check, Palette, Pipette } from 'lucide-react'

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

export const ColorOptionPopup: React.FC<ColorOptionPopupProps> = ({
  isOpen,
  onClose,
  selectedColor,
  onSelect,
  title,
  presets,
}) => {
  const popupRef = useRef<HTMLDivElement>(null)
  const colorInputRef = useRef<HTMLInputElement>(null)

  // Cek apakah warna saat ini cocok dengan salah satu preset
  const isCurrentPreset = presets.some(p => p.id === selectedColor)

  // State warna kustom lokal (hex)
  const [customHex, setCustomHex] = useState<string>(() => {
    return isCurrentPreset ? '#00e5ff' : normalizeToHex(selectedColor)
  })

  // Sinkronisasi saat selectedColor berubah dari luar jika itu bukan preset
  useEffect(() => {
    if (!isCurrentPreset && selectedColor) {
      setCustomHex(normalizeToHex(selectedColor))
    }
  }, [selectedColor, isCurrentPreset])

  useEffect(() => {
    if (!isOpen) return

    const handleClickOutside = (e: MouseEvent) => {
      if ((e.target as HTMLElement)?.closest?.('[data-dropdown-trigger="true"]')) {
        return
      }
      if (popupRef.current && !popupRef.current.contains(e.target as Node)) {
        onClose()
      }
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
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
  }, [isOpen, onClose])

  if (!isOpen) return null

  // Handler saat bagian atas diklik / color picker diubah
  const handleCustomColorChange = (newHex: string) => {
    setCustomHex(newHex)
    onSelect(newHex) // Otomatis mengaplikasikan dan memilih kustom
  }

  const handleTopAreaClick = () => {
    // Saat user klik bagian select atas, otomatis terpilih custom dan buka picker native
    onSelect(customHex)
    colorInputRef.current?.click()
  }

  // Opsi Kustom sedang aktif jika selectedColor tidak cocok dengan preset manapun, atau sama persis dengan customHex
  const isCustomSelected = !isCurrentPreset || selectedColor.toLowerCase() === customHex.toLowerCase()

  return (
    <div
      ref={popupRef}
      className="absolute bottom-full mb-3 left-0 right-0 z-[140] p-3 sm:p-3.5 rounded-[28px] bg-[#020717]/94 backdrop-blur-2xl border-2 border-cyan-400 shadow-[0_0_35px_rgba(6,182,212,0.65),0_20px_60px_rgba(0,0,0,0.9),inset_0_1.5px_2.5px_rgba(255,255,255,0.7)] text-white animate-in fade-in slide-in-from-bottom-2 duration-150 overflow-hidden select-none"
    >
      {/* ========================================================================= */}
      {/* GLOSSY GLASS BUBBLE ORBS: AMBIENT BACKGROUND HUD                          */}
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

      {/* ========================================================================= */}
      {/* HEADER UTAMA: JUDUL + BADGE TOTAL PILIHAN                                 */}
      {/* ========================================================================= */}
      <div className="relative flex items-center justify-between pb-2 mb-2 border-b border-cyan-500/25 z-10">
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
      {/* 1. BAGIAN ATAS: AREA SELECT / COLOR PICKER KUSTOM                         */}
      {/* ========================================================================= */}
      <div className="relative z-10 mb-2.5">
        <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-cyan-300/80 mb-1 flex items-center gap-1.5 px-1">
          <Palette className="w-3 h-3 text-cyan-400" />
          <span>Pilih / Select Warna Kustom:</span>
        </div>

        <div
          onClick={handleTopAreaClick}
          className={`relative w-full p-2 rounded-2xl border-2 transition-all cursor-pointer overflow-hidden flex items-center justify-between group active:scale-[0.99] ${
            isCustomSelected
              ? 'border-cyan-300 bg-gradient-to-r from-[#01224a]/90 via-[#033b7a]/80 to-[#01224a]/90 shadow-[0_0_20px_rgba(6,182,212,0.7),inset_0_1.5px_2px_rgba(255,255,255,0.8)]'
              : 'border-cyan-500/40 hover:border-cyan-400/70 bg-[#040e24]/80 hover:bg-[#06173a]/90 shadow-[inset_0_1px_1px_rgba(255,255,255,0.2)]'
          }`}
          title="Klik untuk memilih warna kustom dari palet"
        >
          {/* Highlight Specular */}
          <div className="absolute top-0 inset-x-4 h-[1px] bg-white/70 shadow-[0_0_4px_#fff]" />

          {/* Sisi Kiri: Swatch Kotak Interaktif + Input Color Hidden */}
          <div className="flex items-center gap-2.5 min-w-0">
            <div
              className="w-8 h-8 rounded-xl border-2 border-white/80 shadow-[0_0_12px_rgba(6,182,212,0.8)] flex items-center justify-center shrink-0 relative overflow-hidden group-hover:scale-105 transition-transform"
              style={{ backgroundColor: customHex }}
            >
              <input
                ref={colorInputRef}
                type="color"
                value={customHex}
                onChange={e => handleCustomColorChange(e.target.value)}
                onClick={e => e.stopPropagation()}
                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                title="Pilih warna"
              />
              <Pipette className="w-3.5 h-3.5 text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)] pointer-events-none" />
            </div>

            {/* Display Hex Code & Petunjuk */}
            <div className="min-w-0 flex flex-col">
              <span className="font-mono text-xs font-bold text-white tracking-wider flex items-center gap-1 drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
                {customHex.toUpperCase()}
                {isCustomSelected && (
                  <span className="text-[9px] font-mono px-1.5 py-0.2 rounded-full bg-cyan-400/30 border border-cyan-300 text-cyan-200">
                    Aktif
                  </span>
                )}
              </span>
              <span className="text-[10px] text-cyan-200/70 truncate">
                Klik swatch untuk buka palet warna
              </span>
            </div>
          </div>

          {/* Sisi Kanan: Badge Tombol Trigger */}
          <div className="shrink-0 ml-2">
            <div className="px-2.5 py-1 rounded-xl bg-gradient-to-r from-cyan-500/30 to-blue-600/30 border border-cyan-400/50 shadow-[0_0_8px_rgba(6,182,212,0.4)] text-[10px] font-mono font-bold text-cyan-200 group-hover:text-white group-hover:border-cyan-300 transition-all flex items-center gap-1">
              <span>Palet</span>
              <span className="text-cyan-400">🎨</span>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. BAGIAN BAWAH: DAFTAR PRESET WARNA + ITEM KUSTOM                        */}
      {/* ========================================================================= */}
      <div className="relative z-10">
        <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 mb-1 px-1 flex items-center justify-between">
          <span>Daftar Pilihan Preset:</span>
          <span className="text-slate-500 text-[9px]">(Termasuk Kustom)</span>
        </div>

        <div className="max-h-44 sm:max-h-48 overflow-y-auto space-y-1.5 pr-1 custom-scrollbar">
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
              onSelect(customHex)
              onClose()
            }}
            className={`relative w-full flex items-center justify-between px-3 py-2 rounded-2xl text-left transition-all cursor-pointer active:scale-[0.99] overflow-hidden group ${
              isCustomSelected
                ? 'border-2 border-cyan-300 bg-gradient-to-r from-[#009fd9] via-[#007ebb] to-[#01649f] shadow-[0_0_24px_rgba(6,182,212,0.9),inset_0_1.5px_2px_rgba(255,255,255,0.85),inset_0_-2px_4px_rgba(0,0,0,0.5)]'
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
                style={{ backgroundColor: customHex }}
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
                  ({customHex.toUpperCase()})
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
    </div>
  )
}
