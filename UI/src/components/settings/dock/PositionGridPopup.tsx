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
  theme = 'cyan',
  items = WATERMARK_GRID_ITEMS,
  showGridSelector = true,
}) => {
  const popupRef = useRef<HTMLDivElement>(null)

  // Klik di luar popup untuk menutup
  useEffect(() => {
    if (!isOpen) return

    const handleClickOutside = (e: MouseEvent) => {
      if (popupRef.current && !popupRef.current.contains(e.target as Node)) {
        onClose()
      }
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  // Warna aksen tema
  const activeGridClass =
    theme === 'emerald'
      ? 'bg-emerald-950/70 border-emerald-400 text-emerald-200 shadow-[0_0_12px_rgba(52,211,153,0.3)]'
      : theme === 'amber'
      ? 'bg-amber-950/70 border-amber-400 text-amber-200 shadow-[0_0_12px_rgba(251,191,36,0.3)]'
      : 'bg-cyan-950/70 border-cyan-400 text-cyan-200 shadow-[0_0_12px_rgba(34,211,238,0.3)]'

  const activeRowClass =
    theme === 'emerald'
      ? 'bg-emerald-950/60 border border-emerald-500/50 text-emerald-200'
      : theme === 'amber'
      ? 'bg-amber-950/60 border border-amber-500/50 text-amber-200'
      : 'bg-cyan-950/60 border border-cyan-500/50 text-cyan-200'

  const activeNumberClass =
    theme === 'emerald'
      ? 'text-emerald-400 font-bold'
      : theme === 'amber'
      ? 'text-amber-400 font-bold'
      : 'text-cyan-400 font-bold'

  const hintColorClass =
    theme === 'emerald'
      ? 'text-emerald-400'
      : theme === 'amber'
      ? 'text-amber-400'
      : 'text-cyan-400'

  return (
    <div
      ref={popupRef}
      className="absolute bottom-full mb-3 left-0 right-0 z-[140] p-3.5 sm:p-4 rounded-2xl bg-[#090d16]/95 backdrop-blur-2xl border border-slate-700/60 shadow-[0_20px_60px_rgba(0,0,0,0.85)] text-white animate-in fade-in slide-in-from-bottom-2 duration-150"
    >
      {/* 1. Header Visual Grid Selector */}
      {showGridSelector && (
        <>
          <div className="flex items-center justify-between pb-2.5">
            <span className="text-[10px] font-bold tracking-wider uppercase text-slate-400">
              Visual Grid Selector
            </span>
            <span className={`text-[10px] font-medium ${hintColorClass}`}>
              Klik titik kotak
            </span>
          </div>

          {/* 2. Grid Visual Kotak 3x3 */}
          <div className="grid grid-cols-3 gap-2 pb-3 mb-3 border-b border-slate-800/80">
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
                  className={`flex flex-col items-center justify-center py-2.5 px-1 rounded-xl text-center border transition-all cursor-pointer active:scale-95 ${
                    isSelected
                      ? activeGridClass
                      : 'bg-slate-900/60 border-slate-800/80 hover:bg-slate-800/60 hover:border-slate-700 text-slate-300 hover:text-white'
                  }`}
                  title={item.fullLabel}
                >
                  <div className={`mb-1 ${isSelected ? '' : 'text-slate-400'}`}>
                    {item.icon}
                  </div>
                  <span className="text-[11px] font-medium leading-tight">
                    {item.shortLabel}
                  </span>
                </button>
              )
            })}
          </div>
        </>
      )}

      {/* 3. Daftar Pilihan Vertikal dengan Nomor Urut */}
      <div className="max-h-48 sm:max-h-56 overflow-y-auto space-y-1 pr-1 custom-scrollbar">
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
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-left transition-all cursor-pointer active:scale-[0.98] ${
                isSelected
                  ? activeRowClass
                  : 'bg-transparent hover:bg-white/[0.05] border border-transparent text-slate-300 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <span className={`shrink-0 ${isSelected ? '' : 'text-slate-400'}`}>
                  {item.icon}
                </span>
                <span className={`text-xs truncate ${isSelected ? 'font-bold' : 'font-medium'}`}>
                  {item.fullLabel}
                </span>
              </div>
              <span className={`text-xs font-mono shrink-0 ml-2 ${isSelected ? activeNumberClass : 'text-slate-500'}`}>
                {itemNumber}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
