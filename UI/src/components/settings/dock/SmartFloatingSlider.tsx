import React, { useState, useEffect, useCallback } from 'react'
import { createPortal } from 'react-dom'
import type { LucideIcon } from 'lucide-react'
import { Eye, Check, Sparkles } from 'lucide-react'

export interface SmartFloatingSliderProps {
  id: string
  label: string
  icon?: LucideIcon
  iconColorClass?: string
  value: number
  valueDisplay: string
  min: number
  max: number
  step?: number
  onChange: (val: number) => void
  activeSlider: string | null
  setActiveSlider: (id: string | null) => void
  targetType?: 'watermark' | 'profile' | 'geotag' | 'none'
  onTriggerPreview?: (id: string) => void
}

/**
 * SmartFloatingSlider
 * Slider cerdas untuk menu Pengaturan (SettingsDrawer):
 * 1. Tampilan in-place normal saat diam.
 * 2. Saat disentuh/digeser:
 *    - Otomatis melompat (floating) keluar dari modal ke posisi cerdas di atas atau di bawah layar.
 *    - Mendeteksi posisi elemen target (watermark / profil / geotag) agar TIDAK MENABRAK target.
 *    - Seluruh modal latar belakang meredup transparan sehingga kamera terlihat 100% jelas.
 *    - Saat jari dilepas, posisi kembali ke dalam menu normal secara instan.
 */
export const SmartFloatingSlider: React.FC<SmartFloatingSliderProps> = ({
  id,
  label,
  icon: Icon,
  iconColorClass = 'text-cyan-300',
  value,
  valueDisplay,
  min,
  max,
  step = 1,
  onChange,
  activeSlider,
  setActiveSlider,
  targetType = 'none',
  onTriggerPreview,
}) => {
  const isCurrentActive = activeSlider === id
  const isOtherActive = activeSlider !== null && !isCurrentActive


  // Deteksi posisi cerdas: Atas atau Bawah.
  // Untuk profil dan geotag yang secara default di bawah layar, inisialisasi awal ke 'top'
  // agar langsung berada di atas dan tidak pernah menabrak target saat render awal
  const [smartPlacement, setSmartPlacement] = useState<'top' | 'bottom'>(() => {
    if (targetType === 'profile' || targetType === 'geotag') return 'top'
    return 'bottom'
  })

  const updatePosition = useCallback(() => {
    if (typeof window === 'undefined') return false
    if (targetType === 'none') {
      setSmartPlacement('bottom')
      return true
    }

    const targetEl = document.querySelector(`[data-preview-target="${targetType}"]`) as HTMLElement | null
    if (targetEl) {
      const rect = targetEl.getBoundingClientRect()
      if (rect.width > 0 && rect.height > 0) {
        const targetCenterY = rect.top + rect.height / 2
        // Jika target berada di area tengah hingga bawah layar (> 42%), posisikan slider mengambang di ATAS
        // Jika target berada di area atas layar (<= 42%), posisikan slider mengambang di BAWAH
        const newPlacement = targetCenterY > window.innerHeight * 0.42 ? 'top' : 'bottom'
        setSmartPlacement(newPlacement)
        return true
      }
    }
    return false
  }, [targetType])

  useEffect(() => {
    if (!isCurrentActive) {
      return
    }

    // 1. Eksekusi deteksi segera
    updatePosition()

    // 2. Siklus sinkronisasi multi-frame rAF & timer untuk menunggu render parent React & layouting
    const rafId1 = requestAnimationFrame(() => {
      updatePosition()
      requestAnimationFrame(() => {
        updatePosition()
      })
    })

    const t1 = setTimeout(() => updatePosition(), 60)
    const t2 = setTimeout(() => updatePosition(), 150)
    const t3 = setTimeout(() => updatePosition(), 300)
    const t4 = setTimeout(() => updatePosition(), 600)

    // 3. MutationObserver untuk mendeteksi saat node target baru disisipkan ke DOM
    let observer: MutationObserver | null = null
    if (typeof MutationObserver !== 'undefined') {
      observer = new MutationObserver(() => {
        const success = updatePosition()
        if (success && observer) {
          observer.disconnect()
        }
      })
      observer.observe(document.body, { childList: true, subtree: true })
    }

    window.addEventListener('resize', updatePosition)
    window.addEventListener('scroll', updatePosition, true)

    return () => {
      cancelAnimationFrame(rafId1)
      clearTimeout(t1)
      clearTimeout(t2)
      clearTimeout(t3)
      clearTimeout(t4)
      if (observer) observer.disconnect()
      window.removeEventListener('resize', updatePosition)
      window.removeEventListener('scroll', updatePosition, true)
    }
  }, [isCurrentActive, updatePosition])

  const handlePointerDown = () => {
    setActiveSlider(id)
  }

  // Jika slider lain sedang aktif, sembunyikan slider ini
  if (isOtherActive) {
    return null
  }

  return (
    <>
      {/* 1. Tampilan In-Place Normal di Dalam Menu Kartu (Saat Tidak Sedang Aktif Melayang) */}
      {!isCurrentActive && (
        <div className="space-y-1.5 select-none">
          <div className="flex items-center justify-between mb-1.5 px-0.5">
            <div className="flex items-center gap-2 min-w-0">
              <span className="text-xs font-bold uppercase tracking-wider text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.95)]">
                {label}
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-black bg-[#020e1f] text-cyan-300 border border-white/30 shadow-[0_2px_6px_rgba(0,0,0,0.5),inset_0_1px_1.5px_rgba(255,255,255,0.5)] shrink-0 drop-shadow-[0_0_6px_rgba(34,211,238,0.75)]">
                {valueDisplay}
              </span>
            </div>
            {onTriggerPreview && (
              <button
                type="button"
                onClick={() => onTriggerPreview(id)}
                className="flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold text-white bg-gradient-to-r from-[#020e1f]/95 via-[#051c36]/90 to-[#020e1f]/95 border border-white/35 shadow-[0_4px_10px_rgba(0,0,0,0.5),inset_0_1.5px_2px_rgba(255,255,255,0.85)] hover:border-white/60 transition-all active:scale-95 cursor-pointer relative overflow-hidden group shrink-0"
                title="Lihat Pratinjau Langsung di Kamera"
              >
                <div className="absolute top-0 inset-x-2 h-[1px] bg-gradient-to-r from-transparent via-cyan-100/80 to-transparent pointer-events-none" />
                <Eye className="w-3.5 h-3.5 text-cyan-300 drop-shadow-[0_0_5px_rgba(34,211,238,0.75)]" />
                <span className="drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)]">Preview</span>
              </button>
            )}
          </div>

          {/* Slider Capsule Track In-Place */}
          <div className="relative w-full h-10 rounded-full bg-gradient-to-r from-[#020e1f]/95 via-[#051c36]/90 to-[#020e1f]/95 border border-white/35 shadow-[0_4px_12px_rgba(0,0,0,0.5),inset_0_1.5px_2px_rgba(255,255,255,0.85),inset_0_-1px_2px_rgba(0,0,0,0.8)] px-4 flex items-center gap-3 overflow-hidden">
            <div className="absolute top-0 inset-x-5 h-[1.5px] bg-gradient-to-r from-transparent via-cyan-100/80 to-transparent pointer-events-none" />
            <div className="flex-1 min-w-0 flex items-center">
              <input
                type="range"
                min={min}
                max={max}
                step={step}
                value={value}
                onPointerDown={handlePointerDown}
                onTouchStart={handlePointerDown}
                onMouseDown={handlePointerDown}
                onChange={e => onChange(Number(e.target.value))}
                className="hud-slider cursor-pointer w-full"
              />
            </div>
            <span className="font-mono text-cyan-300 font-black text-xs shrink-0 drop-shadow-[0_0_6px_rgba(34,211,238,0.8)]">
              {valueDisplay}
            </span>
          </div>
        </div>
      )}

      {/* 2. Tampilan Mengambang Cerdas (Smart Floating Portal) Saat Sedang Ditekan/Digeser */}
      {isCurrentActive &&
        typeof document !== 'undefined' &&
        createPortal(
          <div
            className={`fixed inset-x-3 max-w-[310px] sm:max-w-[340px] mx-auto z-[250] pointer-events-auto transition-all duration-300 select-none ${
              smartPlacement === 'top'
                ? 'top-[max(0.75rem,env(safe-area-inset-top))] animate-in slide-in-from-top-4'
                : 'bottom-[max(1.25rem,env(safe-area-inset-bottom))] animate-in slide-in-from-bottom-4'
            }`}
            onClick={e => e.stopPropagation()}
          >
            {/* Kapsul Mini Cyber HUD Mengambang Cerdas */}
            <div className="p-2.5 sm:p-3 rounded-2xl bg-[#020717]/95 border border-cyan-400/80 shadow-[0_12px_36px_rgba(0,0,0,0.9),inset_0_1px_1.5px_rgba(255,255,255,0.7),0_0_16px_rgba(34,211,238,0.25)] text-white relative overflow-hidden backdrop-blur-xl">
              {/* Specular Glare Highlight */}
              <div className="pointer-events-none absolute top-0 left-4 right-4 h-[1px] bg-gradient-to-r from-transparent via-cyan-100/90 to-transparent z-10" />

              {/* Baris Atas: Ikon Mini + Judul (flex-1 truncate) + Badge Nilai + Tombol Selesai */}
              <div className="flex items-center justify-between gap-1.5 mb-2">
                <div className="flex items-center gap-1.5 min-w-0 flex-1 mr-1">
                  <div className="w-5 h-5 rounded-md bg-cyan-950/80 border border-cyan-500/40 flex items-center justify-center shrink-0 shadow-[0_0_6px_rgba(34,211,238,0.3)]">
                    {Icon ? (
                      <Icon className={`w-3 h-3 ${iconColorClass} drop-shadow-[0_0_4px_rgba(34,211,238,0.8)]`} />
                    ) : (
                      <Sparkles className="w-3 h-3 text-cyan-300 drop-shadow-[0_0_4px_rgba(34,211,238,0.8)]" />
                    )}
                  </div>
                  <span className="text-[11.5px] sm:text-xs font-black uppercase tracking-wider text-white truncate drop-shadow-[0_1px_2px_rgba(0,0,0,0.95)]">
                    {label}
                  </span>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <span className="px-2 py-0.5 rounded-full text-[10.5px] font-mono font-black bg-[#020e1f] text-cyan-300 border border-cyan-500/40 shadow-[0_2px_6px_rgba(0,0,0,0.5),inset_0_1px_1.5px_rgba(255,255,255,0.5)] shrink-0 drop-shadow-[0_0_6px_rgba(34,211,238,0.75)]">
                    {valueDisplay}
                  </span>
                  <button
                    type="button"
                    onClick={() => setActiveSlider(null)}
                    className="px-2.5 py-0.5 rounded-full bg-cyan-400 hover:bg-cyan-300 active:scale-90 text-black font-black text-[11px] flex items-center gap-1 cursor-pointer shadow-[0_0_10px_rgba(34,211,238,0.5)] transition-all shrink-0"
                    title="Simpan & Selesai Mengatur"
                  >
                    <Check className="w-3 h-3 stroke-[3]" />
                    <span>Selesai</span>
                  </button>
                </div>
              </div>

              {/* Track Slider Mini Cerdas Presisi */}
              <div className="relative w-full h-8 rounded-full bg-gradient-to-r from-[#020e1f]/95 via-[#051c36]/90 to-[#020e1f]/95 border border-white/35 shadow-[0_3px_10px_rgba(0,0,0,0.5),inset_0_1px_1.5px_rgba(255,255,255,0.7)] px-3 flex items-center overflow-hidden">
                <div className="absolute top-0 inset-x-4 h-[1px] bg-gradient-to-r from-transparent via-cyan-100/80 to-transparent pointer-events-none" />
                <input
                  type="range"
                  min={min}
                  max={max}
                  step={step}
                  value={value}
                  onChange={e => onChange(Number(e.target.value))}
                  className="hud-slider cursor-pointer w-full"
                  autoFocus
                />
              </div>
            </div>
          </div>,
          document.body
        )}
    </>
  )
}
