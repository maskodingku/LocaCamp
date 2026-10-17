import React, { useRef, useEffect } from 'react'
import { Check } from 'lucide-react'

export interface OptionListItem {
  id: string
  label: string
  sublabel?: string
  stylePreview?: React.CSSProperties
}

interface CustomOptionListPopupProps {
  isOpen: boolean
  onClose: () => void
  selectedId: string
  onSelect: (id: string) => void
  title: string
  items: OptionListItem[]
  theme?: 'cyan' | 'emerald' | 'amber'
}

export const CustomOptionListPopup: React.FC<CustomOptionListPopupProps> = ({
  isOpen,
  onClose,
  selectedId,
  onSelect,
  title,
  items,
  theme = 'cyan',
}) => {
  const popupRef = useRef<HTMLDivElement>(null)

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

  const activeRowClass =
    theme === 'emerald'
      ? 'bg-emerald-950/70 border border-emerald-500/60 text-emerald-200 shadow-[0_0_10px_rgba(52,211,153,0.35)]'
      : theme === 'amber'
      ? 'bg-amber-950/70 border border-amber-500/60 text-amber-200 shadow-[0_0_10px_rgba(251,191,36,0.35)]'
      : 'bg-gradient-to-r from-[#041c38] to-[#082b54] border border-cyan-400/70 text-cyan-100 shadow-[0_0_14px_rgba(6,182,212,0.5),inset_0_1px_2px_rgba(255,255,255,0.5)]'

  const activeNumberClass =
    theme === 'emerald'
      ? 'text-emerald-400 font-bold drop-shadow-[0_0_6px_rgba(52,211,153,0.8)]'
      : theme === 'amber'
      ? 'text-amber-400 font-bold drop-shadow-[0_0_6px_rgba(251,191,36,0.8)]'
      : 'text-cyan-400 font-bold drop-shadow-[0_0_8px_rgba(6,182,212,0.9)]'

  return (
    <div
      ref={popupRef}
      className="absolute bottom-full mb-3 left-0 right-0 z-[140] p-3.5 sm:p-4 rounded-[26px] bg-[#020717]/90 backdrop-blur-2xl border border-cyan-400/50 shadow-[0_0_35px_rgba(6,182,212,0.35),0_20px_60px_rgba(0,0,0,0.9),inset_0_1.5px_2px_rgba(255,255,255,0.7)] text-white animate-in fade-in slide-in-from-bottom-2 duration-150 overflow-hidden"
    >
      {/* Specular Highlight Glare di Atas Popup */}
      <div className="absolute top-0 left-8 right-8 h-[1px] bg-gradient-to-r from-transparent via-cyan-100/90 to-transparent pointer-events-none" />

      <div className="flex items-center justify-between pb-2.5 mb-2 border-b border-cyan-500/20">
        <span className="text-[10px] font-bold tracking-wider uppercase text-slate-300">
          {title}
        </span>
        <span className="text-[10px] text-cyan-400 font-medium font-mono drop-shadow-[0_0_6px_rgba(6,182,212,0.6)]">
          {items.length} Pilihan
        </span>
      </div>

      <div className="max-h-52 overflow-y-auto space-y-1 pr-1 custom-scrollbar">
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
              style={item.stylePreview}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-left transition-all cursor-pointer active:scale-[0.98] ${
                isSelected
                  ? activeRowClass
                  : 'bg-transparent hover:bg-cyan-500/10 border border-transparent hover:border-cyan-500/20 text-slate-300 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2 min-w-0">
                {isSelected && <Check className="w-3.5 h-3.5 shrink-0" />}
                <span className={`text-xs truncate ${isSelected ? 'font-bold' : 'font-medium'}`}>
                  {item.label}
                </span>
                {item.sublabel && (
                  <span className="text-[10px] text-slate-500 truncate">
                    ({item.sublabel})
                  </span>
                )}
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
