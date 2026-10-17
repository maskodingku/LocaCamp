import { useState, useEffect, useCallback, RefObject } from 'react'

export type PreviewTargetType = 'profile' | 'geotag' | 'watermark' | 'none'
export type PopupPlacement = 'bottom' | 'top'

interface SmartPositionOptions {
  targetType?: PreviewTargetType
  isOpen: boolean
  dockRef?: RefObject<HTMLElement | null>
  popupRef?: RefObject<HTMLElement | null>
  defaultPlacement?: PopupPlacement
}

export interface SmartPositionResult {
  placement: PopupPlacement
  containerClasses: string
  containerStyle: React.CSSProperties
  isFlipped: boolean
}

/**
 * useSmartPopupPosition
 * Algoritma cerdas penghindaran tabrakan (Collision Avoidance & Adaptive Placement):
 * - Mengukur posisi elemen target (Profile / Geotag / Watermark) secara real-time.
 * - Memilih area bebas (free space) terbaik agar popup tidak menutupi elemen yang sedang diamati perubahannya.
 * - Mengamankan batas layar (Boundary Clamping) agar popup tidak pernah keluar dari area layar HP.
 */
export function useSmartPopupPosition({
  targetType = 'profile',
  isOpen,
  dockRef,
  popupRef,
  defaultPlacement = 'bottom',
}: SmartPositionOptions): SmartPositionResult {
  const [placement, setPlacement] = useState<PopupPlacement>(defaultPlacement)
  const [maxHeight, setMaxHeight] = useState<number | undefined>(undefined)

  const computePosition = useCallback(() => {
    if (!isOpen) return

    const vw = window.innerWidth
    const vh = window.innerHeight
    const safeTop = 16
    const buffer = 14

    // 1. Dapatkan posisi dock di layar
    const dockEl =
      dockRef?.current ||
      (document.querySelector('[aria-label="Live Preview Controls"]') as HTMLElement | null)
    const dockRect = dockEl
      ? dockEl.getBoundingClientRect()
      : { top: vh - 90, bottom: vh - 10, left: 12, right: vw - 12, width: vw - 24, height: 80 }

    // 2. Dapatkan elemen target yang sedang diamati perubahannya
    const targetEl =
      targetType !== 'none'
        ? (document.querySelector(`[data-preview-target="${targetType}"]`) as HTMLElement | null)
        : null

    const targetRect = targetEl ? targetEl.getBoundingClientRect() : null

    // Perkiraan tinggi popup jika belum terukur di DOM
    const estimatedPopupHeight = popupRef?.current ? popupRef.current.offsetHeight : 380

    // Jika target tidak ditemukan di DOM, default ke bottom (di atas dock)
    if (!targetRect) {
      setPlacement('bottom')
      setMaxHeight(Math.max(260, dockRect.top - safeTop - buffer))
      return
    }

    // 3. Evaluasi Zona Kandidat:
    // Kandidat A: Bottom (Di atas dock)
    const bottomCandidateTop = dockRect.top - buffer - estimatedPopupHeight
    const bottomCandidateBottom = dockRect.top - buffer

    // Cek apakah kandidat Bottom menabrak targetRect
    const overlapsBottom =
      targetRect.bottom + buffer > bottomCandidateTop &&
      targetRect.top - buffer < bottomCandidateBottom

    // Kandidat B: Top (Di bagian atas layar)
    const topCandidateTop = safeTop
    const topCandidateBottom = safeTop + estimatedPopupHeight

    // Cek apakah kandidat Top menabrak targetRect
    const overlapsTop =
      targetRect.bottom + buffer > topCandidateTop &&
      targetRect.top - buffer < topCandidateBottom

    // 4. Keputusan Algoritma Cerdas (Collision Avoidance):
    if (overlapsBottom && !overlapsTop) {
      // Bottom menabrak target, sedangkan Top bebas -> Pindahkan ke ATAS!
      setPlacement('top')
      const availableTopHeight = Math.max(240, targetRect.top - safeTop - buffer)
      setMaxHeight(availableTopHeight)
    } else if (overlapsTop && !overlapsBottom) {
      // Top menabrak target, sedangkan Bottom bebas -> Pindahkan ke BAWAH!
      setPlacement('bottom')
      const availableBottomHeight = Math.max(240, dockRect.top - (targetRect.bottom + buffer))
      setMaxHeight(availableBottomHeight)
    } else if (overlapsBottom && overlapsTop) {
      // Keduanya beririsan (layar sempit) -> Pilih zona dengan ruang paling luas
      const spaceAbove = targetRect.top - safeTop
      const spaceBelow = dockRect.top - targetRect.bottom

      if (spaceAbove >= spaceBelow) {
        setPlacement('top')
        setMaxHeight(Math.max(220, spaceAbove - buffer))
      } else {
        setPlacement('bottom')
        setMaxHeight(Math.max(220, spaceBelow - buffer))
      }
    } else {
      // Tidak ada tabrakan langsung:
      // Tentukan berdasarkan posisi relatif pusat target terhadap layar
      const targetCenterY = targetRect.top + targetRect.height / 2
      if (targetCenterY > vh * 0.44) {
        // Target berada di tengah atau bawah layar -> Tempatkan di ATAS agar target bebas dipandang
        setPlacement('top')
        setMaxHeight(Math.max(240, targetRect.top - safeTop - buffer))
      } else {
        // Target berada di atas layar -> Tempatkan di BAWAH (di atas dock)
        setPlacement('bottom')
        setMaxHeight(Math.max(240, dockRect.top - safeTop - buffer))
      }
    }
  }, [isOpen, targetType, dockRef, popupRef])

  useEffect(() => {
    if (!isOpen) return

    // Hitung posisi saat dibuka
    computePosition()

    window.addEventListener('resize', computePosition)
    window.addEventListener('orientationchange', computePosition)

    // Polling ringan untuk menyinkronkan posisi jika target bergeser secara dinamis
    const interval = setInterval(computePosition, 100)

    return () => {
      window.removeEventListener('resize', computePosition)
      window.removeEventListener('orientationchange', computePosition)
      clearInterval(interval)
    }
  }, [isOpen, computePosition])

  const isFlipped = placement === 'top'

  // Class posisi:
  // - Jika top: fixed di atas layar dengan margin aman 12px (left-3 right-3)
  // - Jika bottom: absolute di atas dock
  const containerClasses = isFlipped
    ? 'fixed top-3 left-3 right-3 sm:left-auto sm:right-6 sm:w-full sm:max-w-[390px] z-[140]'
    : 'absolute bottom-full mb-3 left-0 right-0 z-[140]'

  const containerStyle: React.CSSProperties = {
    maxHeight: maxHeight ? `${maxHeight}px` : undefined,
  }

  return {
    placement,
    containerClasses,
    containerStyle,
    isFlipped,
  }
}
