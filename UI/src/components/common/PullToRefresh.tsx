import React, { useState, useEffect, useRef, useCallback } from 'react'
import { RotateCw } from 'lucide-react'

interface PullToRefreshProps {
  children: React.ReactNode
  onRefresh?: () => void
  threshold?: number
  disabled?: boolean
  className?: string
}

const DEFAULT_THRESHOLD = 65

export const PullToRefresh: React.FC<PullToRefreshProps> = ({
  children,
  onRefresh,
  threshold = DEFAULT_THRESHOLD,
  disabled = false,
  className = '',
}) => {
  const [pullDistance, setPullDistance] = useState(0)
  const [isPulling, setIsPulling] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [hasTriggeredHaptic, setHasTriggeredHaptic] = useState(false)

  const containerRef = useRef<HTMLDivElement>(null)
  const startYRef = useRef(0)
  const startXRef = useRef(0)
  const activeTouchRef = useRef(false)
  const isEligibleRef = useRef(false)

  const handleRefresh = useCallback(() => {
    setIsRefreshing(true)
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      try {
        navigator.vibrate([25, 40, 25])
      } catch {
        // Ignore vibration errors
      }
    }

    setTimeout(() => {
      if (onRefresh) {
        onRefresh()
      } else {
        sessionStorage.setItem('locacamp_open_history', 'true')
        window.location.reload()
      }
    }, 650)
  }, [onRefresh])

  // Helper untuk mengecek apakah elemen target atau scrollable ancestor sedang tidak di posisi puncak
  const isScrolledDown = (target: HTMLElement | null): boolean => {
    let el: HTMLElement | null = target
    while (el && el !== containerRef.current && el !== document.body) {
      if (el.scrollTop > 5) return true
      el = el.parentElement
    }
    return false
  }

  // Helper untuk mengecek apakah elemen target tidak boleh memicu pull-to-refresh
  const isIgnoredElement = (target: HTMLElement | null): boolean => {
    if (!target) return false
    const tag = target.tagName.toLowerCase()
    if (tag === 'input' || tag === 'textarea' || tag === 'select' || tag === 'canvas' || tag === 'button') return true
    if (target.closest('[data-no-pull-refresh]')) return true
    if (target.closest('.react-transform-component')) return true
    return false
  }

  useEffect(() => {
    const el = containerRef.current
    if (!el || disabled || isRefreshing) return

    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length !== 1) return
      const target = e.target as HTMLElement | null
      if (isIgnoredElement(target)) {
        isEligibleRef.current = false
        return
      }

      if (isScrolledDown(target)) {
        isEligibleRef.current = false
        return
      }

      startYRef.current = e.touches[0].clientY
      startXRef.current = e.touches[0].clientX
      activeTouchRef.current = true
      isEligibleRef.current = true
      setHasTriggeredHaptic(false)
    }

    const handleTouchMove = (e: TouchEvent) => {
      if (!activeTouchRef.current || !isEligibleRef.current) return
      const currentY = e.touches[0].clientY
      const currentX = e.touches[0].clientX
      const deltaY = currentY - startYRef.current
      const deltaX = currentX - startXRef.current

      // Jika pergerakan lebih dominan horizontal daripada vertikal, abaikan
      if (Math.abs(deltaX) > Math.abs(deltaY) && !isPulling) {
        activeTouchRef.current = false
        return
      }

      // Hanya aktif jika geser ke arah bawah (pull down)
      if (deltaY > 0) {
        // Cek kembali posisi scroll target
        const target = e.target as HTMLElement | null
        if (isScrolledDown(target)) {
          return
        }

        // Rumus elastisitas peredam fisik mobile
        const damped = Math.min(105, Math.pow(deltaY, 0.85) * 1.5)
        setPullDistance(damped)
        setIsPulling(true)

        // Haptic feedback saat pertama kali menyentuh batas threshold
        if (damped >= threshold && !hasTriggeredHaptic) {
          setHasTriggeredHaptic(true)
          if (typeof navigator !== 'undefined' && navigator.vibrate) {
            try {
              navigator.vibrate(15)
            } catch {
              // Ignore
            }
          }
        } else if (damped < threshold && hasTriggeredHaptic) {
          setHasTriggeredHaptic(false)
        }

        // Cegah default scroll browser jika gestur tarik aktif
        if (damped > 15 && e.cancelable) {
          e.preventDefault()
        }
      } else {
        setPullDistance(0)
        setIsPulling(false)
      }
    }

    const handleTouchEnd = () => {
      if (!activeTouchRef.current) return
      activeTouchRef.current = false
      isEligibleRef.current = false

      if (pullDistance >= threshold) {
        handleRefresh()
      } else {
        setPullDistance(0)
        setIsPulling(false)
      }
    }

    const handleTouchCancel = () => {
      activeTouchRef.current = false
      isEligibleRef.current = false
      setPullDistance(0)
      setIsPulling(false)
    }

    el.addEventListener('touchstart', handleTouchStart, { passive: true })
    el.addEventListener('touchmove', handleTouchMove, { passive: false })
    el.addEventListener('touchend', handleTouchEnd, { passive: true })
    el.addEventListener('touchcancel', handleTouchCancel, { passive: true })

    return () => {
      el.removeEventListener('touchstart', handleTouchStart)
      el.removeEventListener('touchmove', handleTouchMove)
      el.removeEventListener('touchend', handleTouchEnd)
      el.removeEventListener('touchcancel', handleTouchCancel)
    }
  }, [disabled, isRefreshing, pullDistance, threshold, hasTriggeredHaptic, handleRefresh, isPulling])

  const progress = Math.min(1, pullDistance / threshold)
  const isThresholdReached = pullDistance >= threshold
  const rotationDeg = isRefreshing ? 0 : progress * 360

  return (
    <div ref={containerRef} className={`flex-1 flex flex-col min-h-0 w-full overflow-hidden relative ${className}`}>
      {/* Floating Pull-to-Refresh HUD Indicator (Android Cyber Glass Style) */}
      <div
        className={`absolute top-2 inset-x-0 z-[70] flex justify-center pointer-events-none transition-transform ${
          isRefreshing
            ? 'duration-300'
            : isPulling
            ? 'duration-75'
            : 'duration-300 ease-out'
        }`}
        style={{
          transform: isRefreshing
            ? 'translateY(12px)'
            : isPulling
            ? `translateY(${Math.max(-50, pullDistance - 45)}px)`
            : 'translateY(-65px)',
          opacity: isRefreshing || isPulling ? 1 : 0,
        }}
      >
        <div
          className={`flex items-center gap-2 px-4 py-2 rounded-full border shadow-2xl backdrop-blur-xl transition-all ${
            isRefreshing
              ? 'bg-zinc-950/95 border-cyan-400/60 shadow-[0_8px_25px_rgba(34,211,238,0.35)]'
              : isThresholdReached
              ? 'bg-zinc-950/95 border-emerald-400/60 shadow-[0_8px_25px_rgba(52,211,153,0.35)] scale-105'
              : 'bg-zinc-950/90 border-zinc-700/60 shadow-[0_4px_16px_rgba(0,0,0,0.6)]'
          }`}
        >
          {/* Spinner / Rotating Icon */}
          <div className="relative flex items-center justify-center w-5 h-5">
            <RotateCw
              className={`w-4 h-4 transition-colors ${
                isRefreshing
                  ? 'animate-spin text-cyan-300 drop-shadow-[0_0_6px_rgba(34,211,238,0.8)]'
                  : isThresholdReached
                  ? 'text-emerald-400 drop-shadow-[0_0_6px_rgba(52,211,153,0.8)]'
                  : 'text-zinc-400'
              }`}
              style={
                !isRefreshing
                  ? {
                      transform: `rotate(${rotationDeg}deg)`,
                      transition: 'transform 0.1s ease-out',
                    }
                  : undefined
              }
            />
          </div>

          {/* Feedback Text */}
          <span
            className={`text-xs font-bold tracking-wide transition-colors ${
              isRefreshing
                ? 'text-cyan-200'
                : isThresholdReached
                ? 'text-emerald-300'
                : 'text-zinc-300'
            }`}
          >
            {isRefreshing
              ? 'Memuat ulang...'
              : isThresholdReached
              ? 'Lepas untuk refresh'
              : 'Tarik ke bawah'}
          </span>
        </div>
      </div>

      {children}
    </div>
  )
}
