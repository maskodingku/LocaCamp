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

  return (
    <div
      ref={popupRef}
      className="absolute bottom-full mb-3 left-0 right-0 z-[140] p-3.5 sm:p-4 rounded-2xl bg-[#090d16]/95 backdrop-blur-2xl border border-slate-700/60 shadow-[0_20px_60px_rgba(0,0,0,0.85)] text-white animate-in fade-in slide-in-from-bottom-2 duration-150"
    >
      <div className="flex items-center justify-between pb-2.5 mb-2 border-b border-slate-800/80">
        <span className="text-[10px] font-bold tracking-wider uppercase text-slate-400">
          {title}
        </span>
        <span className="text-[10px] text-slate-500">
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
                  : 'bg-transparent hover:bg-white/[0.05] border border-transparent text-slate-300 hover:text-white'
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
