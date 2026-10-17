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
      <div className="absolute top-1/4 -right-6 w-24 h-24 rounded-full bg-gradient-to-br from-sky-400/15 via-cyan-600/5 to-transparent border border-cyan-400/35 blur-[0.3px] shadow-[inset_0_3px_8px_rgba(255,255,255,0.6),inset_0_-3px_8px_rgba(0,0,0,0.7),0_0_20px_rgba(14,165,233,0.25)] pointer-events-none">
        <div className="absolute top-1.5 inset-x-3 h-3 rounded-full bg-white/30 blur-[0.8px]" />
      </div>

      {/* Orb 3: Bola Kaca di Kiri Tengah */}
      <div className="absolute bottom-10 -left-6 w-28 h-28 rounded-full bg-gradient-to-br from-cyan-500/10 via-transparent to-blue-600/10 border border-cyan-400/25 blur-[0.4px] shadow-[inset_0_3px_8px_rgba(255,255,255,0.45),inset_0_-3px_8px_rgba(0,0,0,0.6),0_0_18px_rgba(6,182,212,0.15)] pointer-events-none">
        <div className="absolute top-2 inset-x-4 h-3.5 rounded-full bg-white/20 blur-[1px]" />
      </div>

      {/* Specular Highlight Glare di Atas Popup */}
      <div className="absolute top-0 inset-x-8 h-[1.5px] bg-gradient-to-r from-transparent via-cyan-100 to-transparent pointer-events-none shadow-[0_0_8px_#22d3ee]" />

      {/* Header HUD: Judul Uppercase + Badge Jumlah Pilihan Neon Cyan */}
      <div className="relative flex items-center justify-between pb-2.5 mb-2.5 border-b border-cyan-500/25 z-10">
        <span className="text-xs font-bold tracking-wider uppercase text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
          {title}
        </span>
        <div className="px-2.5 py-0.5 rounded-full bg-[#030917]/80 border border-cyan-500/40 shadow-[inset_0_1px_1px_rgba(255,255,255,0.3),0_0_8px_rgba(6,182,212,0.3)] flex items-center gap-1 font-mono text-[10px]">
          <span className="text-cyan-400 font-bold drop-shadow-[0_0_6px_rgba(6,182,212,0.8)]">
            {items.length}
          </span>
          <span className="text-slate-400">Pilihan</span>
        </div>
      </div>

      {/* Daftar Pilihan Vertikal Kapsul */}
      <div className="relative max-h-52 overflow-y-auto space-y-1.5 pr-1 custom-scrollbar z-10">
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

              {/* Sisi Kiri: Check Icon / Preview + Label Teks */}
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
                <span
                  className={`text-xs truncate ${
                    isSelected
                      ? 'font-bold text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]'
                      : 'font-medium text-slate-200 group-hover:text-white'
                  }`}
                >
                  {item.label}
                </span>
                {item.sublabel && (
                  <span
                    className={`text-[10px] truncate ${
                      isSelected ? 'text-cyan-100/90' : 'text-slate-400'
                    }`}
                  >
                    ({item.sublabel})
                  </span>
                )}
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
