import React, { useRef, useEffect } from 'react'
import {
  ArrowUpLeft,
  ArrowUp,
  ArrowUpRight,
  ArrowLeft,
  ArrowRight,
  ArrowDownLeft,
  ArrowDown,
  ArrowDownRight,
  Crosshair,
  Star,
} from 'lucide-react'

export interface PositionGridItem {
  id: string
  shortLabel: string
  fullLabel: string
  icon: React.ReactNode
  col?: number // 1, 2, 3
  row?: number // 1, 2, 3
}

export const WATERMARK_GRID_ITEMS: PositionGridItem[] = [
  { id: 'top-left', shortLabel: 'Kiri', fullLabel: 'Atas Kiri', icon: <ArrowUpLeft className="w-4 h-4" />, col: 1, row: 1 },
  { id: 'top-center', shortLabel: 'Tengah', fullLabel: 'Atas Tengah', icon: <ArrowUp className="w-4 h-4" />, col: 2, row: 1 },
  { id: 'top-right', shortLabel: 'Kanan', fullLabel: 'Atas Kanan', icon: <ArrowUpRight className="w-4 h-4" />, col: 3, row: 1 },
  { id: 'center-left', shortLabel: 'Tengah Kiri', fullLabel: 'Tengah Kiri', icon: <ArrowLeft className="w-4 h-4" />, col: 1, row: 2 },
  { id: 'center', shortLabel: 'Pusat', fullLabel: 'Tengah / Pusat', icon: <Crosshair className="w-4 h-4" />, col: 2, row: 2 },
  { id: 'center-right', shortLabel: 'Tengah Kanan', fullLabel: 'Tengah Kanan', icon: <ArrowRight className="w-4 h-4" />, col: 3, row: 2 },
  { id: 'bottom-left', shortLabel: 'Bawah Kiri', fullLabel: 'Bawah Kiri', icon: <ArrowDownLeft className="w-4 h-4" />, col: 1, row: 3 },
  { id: 'bottom-center', shortLabel: 'Bawah', fullLabel: 'Bawah Tengah', icon: <ArrowDown className="w-4 h-4" />, col: 2, row: 3 },
  { id: 'bottom-right', shortLabel: 'Bawah Kanan', fullLabel: 'Bawah Kanan', icon: <ArrowDownRight className="w-4 h-4" />, col: 3, row: 3 },
]

export const PROFILE_GRID_ITEMS: PositionGridItem[] = [
  { id: 'above-geotag', shortLabel: 'Di Atas Geotag', fullLabel: '★ Di Atas Geotag', icon: <Star className="w-4 h-4" /> },
  { id: 'top-left', shortLabel: 'Kiri', fullLabel: 'Atas Kiri', icon: <ArrowUpLeft className="w-4 h-4" /> },
  { id: 'top-center', shortLabel: 'Tengah', fullLabel: 'Atas Tengah', icon: <ArrowUp className="w-4 h-4" /> },
  { id: 'top-right', shortLabel: 'Kanan', fullLabel: 'Atas Kanan', icon: <ArrowUpRight className="w-4 h-4" /> },
  { id: 'bottom-left', shortLabel: 'Bawah Kiri', fullLabel: 'Bawah Kiri', icon: <ArrowDownLeft className="w-4 h-4" /> },
  { id: 'bottom-center', shortLabel: 'Bawah', fullLabel: 'Bawah Tengah', icon: <ArrowDown className="w-4 h-4" /> },
  { id: 'bottom-right', shortLabel: 'Bawah Kanan', fullLabel: 'Bawah Kanan', icon: <ArrowDownRight className="w-4 h-4" /> },
]

export const GEOTAG_GRID_ITEMS: PositionGridItem[] = [
  { id: 'top-left', shortLabel: 'Kiri Atas', fullLabel: '↖ Kiri Atas', icon: <ArrowUpLeft className="w-4 h-4" />, col: 1, row: 1 },
  { id: 'top-right', shortLabel: 'Kanan Atas', fullLabel: '↗ Kanan Atas', icon: <ArrowUpRight className="w-4 h-4" />, col: 2, row: 1 },
  { id: 'bottom-left', shortLabel: 'Kiri Bawah', fullLabel: '↙ Kiri Bawah', icon: <ArrowDownLeft className="w-4 h-4" />, col: 1, row: 2 },
  { id: 'bottom-right', shortLabel: 'Kanan Bawah', fullLabel: '↘ Kanan Bawah', icon: <ArrowDownRight className="w-4 h-4" />, col: 2, row: 2 },
]

interface PositionGridPopupProps {
  isOpen: boolean
  onClose: () => void
  selectedId: string
  onSelect: (id: string) => void
  theme?: 'cyan' | 'emerald' | 'amber'
  items?: PositionGridItem[]
  showGridSelector?: boolean
}

export const PositionGridPopup: React.FC<PositionGridPopupProps> = ({
  isOpen,
  onClose,
  selectedId,
  onSelect,
  items = WATERMARK_GRID_ITEMS,
  showGridSelector = true,
}) => {
  const popupRef = useRef<HTMLDivElement>(null)

  // Klik di luar popup untuk menutup
  useEffect(() => {
    if (!isOpen) return

    const handleClickOutside = (e: MouseEvent) => {
      // Abaikan jika klik terjadi pada tombol trigger dropdown agar event toggle tombol berjalan normal
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

    // Beri jeda 50ms agar klik tombol trigger tidak langsung memicu penutupan
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

  return (
    <div
      ref={popupRef}
      className="absolute bottom-full mb-3 left-0 right-0 z-[140] p-3.5 sm:p-4 rounded-[28px] bg-[#020717]/92 backdrop-blur-2xl border-2 border-cyan-400 shadow-[0_0_35px_rgba(6,182,212,0.65),0_20px_60px_rgba(0,0,0,0.9),inset_0_1.5px_2.5px_rgba(255,255,255,0.7)] text-white animate-in fade-in slide-in-from-bottom-2 duration-150 overflow-hidden select-none"
    >
      {/* ========================================================================= */}
      {/* GLOSSY GLASS BUBBLE ORBS: BOLA KACA BENING REALISTIS DI LATAR BELAKANG    */}
      {/* ========================================================================= */}
      {/* Orb 1: Bola Kaca Besar di Kanan Bawah */}
      <div className="absolute -bottom-8 -right-4 w-36 h-36 rounded-full bg-gradient-to-br from-cyan-400/15 via-blue-500/5 to-transparent border border-cyan-300/35 blur-[0.3px] shadow-[inset_0_4px_10px_rgba(255,255,255,0.5),inset_0_-4px_10px_rgba(0,0,0,0.7),0_0_25px_rgba(6,182,212,0.2)] pointer-events-none">
        <div className="absolute top-2 inset-x-5 h-4 rounded-full bg-white/25 blur-[1px]" />
      </div>

      {/* Orb 2: Bola Kaca Sedang di Tengah Kanan */}
      <div className="absolute top-1/3 -right-6 w-24 h-24 rounded-full bg-gradient-to-br from-sky-400/15 via-cyan-600/5 to-transparent border border-cyan-400/35 blur-[0.3px] shadow-[inset_0_3px_8px_rgba(255,255,255,0.6),inset_0_-3px_8px_rgba(0,0,0,0.7),0_0_20px_rgba(14,165,233,0.25)] pointer-events-none">
        <div className="absolute top-1.5 inset-x-3 h-3 rounded-full bg-white/30 blur-[0.8px]" />
      </div>

      {/* Orb 3: Bola Kaca di Kiri Tengah Belakang List */}
      <div className="absolute bottom-16 -left-6 w-28 h-28 rounded-full bg-gradient-to-br from-cyan-500/10 via-transparent to-blue-600/10 border border-cyan-400/25 blur-[0.4px] shadow-[inset_0_3px_8px_rgba(255,255,255,0.45),inset_0_-3px_8px_rgba(0,0,0,0.6),0_0_18px_rgba(6,182,212,0.15)] pointer-events-none">
        <div className="absolute top-2 inset-x-4 h-3.5 rounded-full bg-white/20 blur-[1px]" />
      </div>

      {/* Specular Highlight Glare di Atas Popup */}
      <div className="absolute top-0 inset-x-8 h-[1.5px] bg-gradient-to-r from-transparent via-cyan-100 to-transparent pointer-events-none shadow-[0_0_8px_#22d3ee]" />

      {/* 1. Header Visual Grid Selector */}
      {showGridSelector && (
        <>
          <div className="relative flex items-center justify-between pb-2.5 z-10">
            <span className="text-xs font-bold tracking-wider uppercase text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
              Visual Grid Selector
            </span>
            <span className="text-[11px] font-semibold text-cyan-400 drop-shadow-[0_0_8px_rgba(6,182,212,0.8)]">
              Klik titik kotak
            </span>
          </div>

          {/* 2. Grid Visual Kotak 3x3 */}
          <div className="relative grid grid-cols-3 gap-2 pb-3 mb-3 border-b border-cyan-500/25 z-10">
            {items.slice(0, 9).map(item => {
              const isSelected = item.id === selectedId
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    onSelect(item.id)
                    onClose()
                  }}
                  className={`relative flex flex-col items-center justify-center py-2.5 px-1 rounded-2xl text-center transition-all cursor-pointer active:scale-95 overflow-hidden group ${
                    isSelected
                      ? 'border-2 border-cyan-300 bg-gradient-to-b from-[#0e5fa8]/90 via-[#073f73]/90 to-[#022144]/95 shadow-[0_0_20px_rgba(6,182,212,0.85),inset_0_2px_3px_rgba(255,255,255,0.9),inset_0_-2px_4px_rgba(0,0,0,0.7)]'
                      : 'border border-cyan-500/30 hover:border-cyan-400/60 bg-gradient-to-b from-[#06152e]/70 via-[#030d22]/80 to-[#020717]/90 hover:from-[#0b264e]/80 shadow-[inset_0_1px_1.5px_rgba(255,255,255,0.25),0_2px_8px_rgba(0,0,0,0.5)] text-slate-300 hover:text-white'
                  }`}
                  title={item.fullLabel}
                >
                  {/* Specular gloss highlight melengkung di atas tombol */}
                  <div
                    className={`absolute top-0.5 inset-x-2 rounded-full pointer-events-none ${
                      isSelected
                        ? 'h-2 bg-white/40 blur-[0.5px]'
                        : 'h-1.5 bg-white/20 blur-[0.5px]'
                    }`}
                  />

                  {/* Icon */}
                  <div
                    className={`mb-1 transition-transform group-hover:scale-105 [&>svg]:w-4 [&>svg]:h-4 ${
                      isSelected
                        ? 'text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.9)]'
                        : 'text-cyan-300/80 group-hover:text-cyan-200'
                    }`}
                  >
                    {item.icon}
                  </div>

                  {/* Label */}
                  <span
                    className={`text-[11px] leading-tight truncate px-1 ${
                      isSelected
                        ? 'font-bold text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)]'
                        : 'font-medium text-slate-300 group-hover:text-white'
                    }`}
                  >
                    {item.shortLabel}
                  </span>
                </button>
              )
            })}
          </div>
        </>
      )}

      {/* 3. Daftar Pilihan Vertikal Kapsul dengan Nomor Urut */}
      <div className="relative max-h-48 sm:max-h-56 overflow-y-auto space-y-1.5 pr-1 custom-scrollbar z-10">
        {items.map((item, index) => {
          const isSelected = item.id === selectedId
          const itemNumber = index + 1
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => {
                onSelect(item.id)
                onClose()
              }}
              className={`relative w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-left transition-all cursor-pointer active:scale-[0.99] overflow-hidden group ${
                isSelected
                  ? 'border-2 border-cyan-300 bg-gradient-to-r from-[#009fd9] via-[#007ebb] to-[#01649f] shadow-[0_0_24px_rgba(6,182,212,0.9),inset_0_1.5px_2px_rgba(255,255,255,0.85),inset_0_-2px_4px_rgba(0,0,0,0.5)]'
                  : 'border border-cyan-500/30 hover:border-cyan-400/60 bg-gradient-to-r from-[#06152e]/70 via-[#030d22]/75 to-[#051733]/70 hover:from-[#092244]/80 shadow-[inset_0_1px_1px_rgba(255,255,255,0.2),0_2px_8px_rgba(0,0,0,0.6)] text-slate-300 hover:text-white'
              }`}
            >
              {/* Highlight specular melintang horizontal di atas */}
              <div
                className={`absolute top-0 inset-x-3 h-[1px] pointer-events-none ${
                  isSelected ? 'bg-white/80 shadow-[0_0_4px_#fff]' : 'bg-white/20'
                }`}
              />

              {/* Rim light cyan tipis di bawah untuk baris tidak aktif */}
              {!isSelected && (
                <div className="absolute bottom-0 inset-x-4 h-[1px] bg-cyan-400/20 pointer-events-none" />
              )}

              {/* Sisi Kiri: Icon + Label Teks */}
              <div className="flex items-center gap-2.5 min-w-0">
                <span
                  className={`shrink-0 [&>svg]:w-4 [&>svg]:h-4 ${
                    isSelected
                      ? 'text-white drop-shadow-[0_0_6px_rgba(255,255,255,0.9)]'
                      : 'text-cyan-400 drop-shadow-[0_0_4px_rgba(6,182,212,0.6)] group-hover:text-cyan-300'
                  }`}
                >
                  {item.icon}
                </span>
                <span
                  className={`text-xs truncate ${
                    isSelected
                      ? 'font-bold text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]'
                      : 'font-medium text-slate-200 group-hover:text-white'
                  }`}
                >
                  {item.fullLabel}
                </span>
              </div>

              {/* Sisi Kanan: Nomor Urut & Indikator Bar Vertikal Menyala */}
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

                {/* Indikator Bar Vertikal Cyan Menyala Saat Terpilih */}
                {isSelected && (
                  <div className="h-5 w-1 rounded-full bg-cyan-200 shadow-[0_0_8px_#fff,0_0_12px_#22d3ee] ml-2" />
                )}
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
