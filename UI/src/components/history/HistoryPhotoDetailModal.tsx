import React, { useState, useEffect, useCallback, useRef } from 'react'
import {
  X,
  Download,
  Trash2,
  MapPin,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  Cloud,
  Loader2,
  ExternalLink,
  Check,
} from 'lucide-react'
import type { StoredPhoto } from '../../utils/photoStorage'
import { useModalHistory } from '../../hooks/useModalHistory'

interface HistoryPhotoDetailModalProps {
  photo: StoredPhoto | null
  currentIndex: number
  totalCount: number
  hasPrev: boolean
  hasNext: boolean
  onPrev: () => void
  onNext: () => void
  onClose: () => void
  onDownload: (photo: StoredPhoto) => void
  onDelete: (id: string) => void
  onUploadToDrive?: (photo: StoredPhoto) => Promise<{ fileId: string; webViewLink?: string }>
  isDriveConnected?: boolean
  onOpenSettings?: () => void
}

export const HistoryPhotoDetailModal: React.FC<HistoryPhotoDetailModalProps> = ({
  photo,
  currentIndex,
  totalCount,
  hasPrev,
  hasNext,
  onPrev,
  onNext,
  onClose,
  onDownload,
  onDelete,
  onUploadToDrive,
  isDriveConnected = false,
  onOpenSettings,
}) => {
  const [isPureFullscreen, setIsPureFullscreen] = useState(false)
  const [zoomScale, setZoomScale] = useState<number>(1)
  const [isUploadingDrive, setIsUploadingDrive] = useState(false)
  const [driveResult, setDriveResult] = useState<{ fileId: string; webViewLink?: string } | null>(null)
  const [driveError, setDriveError] = useState<string | null>(null)

  // Reset drive status saat ganti foto
  useEffect(() => {
    setDriveResult(null)
    setDriveError(null)
  }, [photo?.id])

  const handleDriveUpload = async () => {
    if (!photo) return
    if (!isDriveConnected) {
      if (onOpenSettings) {
        onClose()
        onOpenSettings()
      } else {
        alert('Silakan hubungkan akun Google Drive terlebih dahulu di Pengaturan.')
      }
      return
    }

    setIsUploadingDrive(true)
    setDriveError(null)
    try {
      if (onUploadToDrive) {
        const res = await onUploadToDrive(photo)
        setDriveResult(res)
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Gagal mengunggah ke Google Drive'
      setDriveError(msg)
    } finally {
      setIsUploadingDrive(false)
    }
  }
  const [panOffset, setPanOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 })

  const initialPinchDistRef = useRef<number | null>(null)
  const initialZoomScaleRef = useRef<number>(1)
  const initialPanRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 })
  const isPinchingRef = useRef<boolean>(false)
  const lastTapTimeRef = useRef<number>(0)
  const tapTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const touchStartX = useRef<number | null>(null)
  const touchStartY = useRef<number | null>(null)
  const isDraggingRef = useRef<boolean>(false)
  const [swipeOffset, setSwipeOffset] = useState<number>(0)
  const [isSwiping, setIsSwiping] = useState<boolean>(false)

  const resetZoom = useCallback(() => {
    setZoomScale(1)
    setPanOffset({ x: 0, y: 0 })
    if (tapTimeoutRef.current) {
      clearTimeout(tapTimeoutRef.current)
      tapTimeoutRef.current = null
    }
  }, [])

  // Integrasi tombol Back fisik/gesture ponsel
  useModalHistory(
    'history-photo-detail',
    Boolean(photo),
    () => {
      onClose()
      setIsPureFullscreen(false)
      resetZoom()
    }
  )

  useModalHistory(
    'history-pure-fullscreen',
    Boolean(photo) && isPureFullscreen,
    () => {
      if (zoomScale > 1.05) {
        resetZoom()
      } else {
        setIsPureFullscreen(false)
      }
    }
  )

  // Reset zoom & pan saat foto berganti
  useEffect(() => {
    resetZoom()
  }, [photo?.id, resetZoom])

  // Navigasi Keyboard Panah Kiri / Kanan & Esc
  useEffect(() => {
    if (!photo) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        e.preventDefault()
        onPrev()
      } else if (e.key === 'ArrowRight') {
        e.preventDefault()
        onNext()
      } else if (e.key === 'Escape') {
        e.preventDefault()
        if (zoomScale > 1.05) {
          resetZoom()
        } else if (isPureFullscreen) {
          setIsPureFullscreen(false)
        } else {
          onClose()
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [photo, onPrev, onNext, isPureFullscreen, zoomScale, resetZoom, onClose])

  if (!photo) return null

  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      // Dua Jari: Gestur Pinch to Zoom
      const x1 = e.touches[0].clientX
      const y1 = e.touches[0].clientY
      const x2 = e.touches[1].clientX
      const y2 = e.touches[1].clientY
      const dist = Math.hypot(x2 - x1, y2 - y1)

      initialPinchDistRef.current = dist
      initialZoomScaleRef.current = zoomScale
      isPinchingRef.current = true
      isDraggingRef.current = true
      setIsSwiping(false)
      setSwipeOffset(0)
    } else if (e.touches.length === 1) {
      // Satu Jari: Pan (jika zoom > 1) atau Swipe Foto (jika normal 1x)
      touchStartX.current = e.touches[0].clientX
      touchStartY.current = e.touches[0].clientY
      initialPanRef.current = { ...panOffset }
      isDraggingRef.current = false
      isPinchingRef.current = false

      if (zoomScale <= 1.05) {
        setIsSwiping(true)
      }
    }
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length === 2 && isPinchingRef.current && initialPinchDistRef.current) {
      const x1 = e.touches[0].clientX
      const y1 = e.touches[0].clientY
      const x2 = e.touches[1].clientX
      const y2 = e.touches[1].clientY
      const currentDist = Math.hypot(x2 - x1, y2 - y1)
      const ratio = currentDist / initialPinchDistRef.current
      const newScale = Math.min(Math.max(1, initialZoomScaleRef.current * ratio), 4.5)

      setZoomScale(newScale)
      if (newScale <= 1.02) {
        setPanOffset({ x: 0, y: 0 })
      }
      isDraggingRef.current = true
      return
    }

    if (e.touches.length === 1 && touchStartX.current !== null && touchStartY.current !== null) {
      const currentX = e.touches[0].clientX
      const currentY = e.touches[0].clientY
      const diffX = currentX - touchStartX.current
      const diffY = currentY - touchStartY.current

      if (Math.abs(diffX) > 6 || Math.abs(diffY) > 6) {
        isDraggingRef.current = true
      }

      if (zoomScale > 1.05) {
        // Mode Zoom: Pan/Drag gambar ke segala arah
        const maxPanX = (window.innerWidth * (zoomScale - 1)) / 1.5
        const maxPanY = (window.innerHeight * (zoomScale - 1)) / 1.5
        const targetX = initialPanRef.current.x + diffX
        const targetY = initialPanRef.current.y + diffY

        setPanOffset({
          x: Math.min(Math.max(-maxPanX, targetX), maxPanX),
          y: Math.min(Math.max(-maxPanY, targetY), maxPanY),
        })
      } else {
        // Mode Normal 1x: Swipe horizontal foto
        if (Math.abs(diffX) > Math.abs(diffY)) {
          if ((diffX > 0 && !hasPrev) || (diffX < 0 && !hasNext)) {
            setSwipeOffset(diffX * 0.25)
          } else {
            setSwipeOffset(diffX * 0.75)
          }
        }
      }
    }
  }

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (isPinchingRef.current) {
      initialPinchDistRef.current = null
      isPinchingRef.current = false
      if (zoomScale < 1.05) {
        resetZoom()
      }
      setTimeout(() => {
        isDraggingRef.current = false
      }, 150)
      return
    }

    if (zoomScale <= 1.05 && touchStartX.current !== null && touchStartY.current !== null) {
      const diffX = e.changedTouches[0].clientX - touchStartX.current
      const diffY = e.changedTouches[0].clientY - touchStartY.current
      const minSwipeDistance = 45

      if (Math.abs(diffX) > minSwipeDistance && Math.abs(diffX) > Math.abs(diffY)) {
        if (diffX > 0 && hasPrev) {
          onPrev()
        } else if (diffX < 0 && hasNext) {
          onNext()
        }
      }
    }

    touchStartX.current = null
    touchStartY.current = null
    setSwipeOffset(0)
    setIsSwiping(false)
    setTimeout(() => {
      isDraggingRef.current = false
    }, 120)
  }

  const handlePhotoClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (isDraggingRef.current) return

    const now = Date.now()
    const DOUBLE_TAP_DELAY = 280

    if (now - lastTapTimeRef.current < DOUBLE_TAP_DELAY) {
      // Double Tap Terdeteksi: Toggle Zoom 1x <-> 2.5x
      if (tapTimeoutRef.current) {
        clearTimeout(tapTimeoutRef.current)
        tapTimeoutRef.current = null
      }
      lastTapTimeRef.current = 0

      if (zoomScale > 1.1) {
        resetZoom()
      } else {
        setZoomScale(2.5)
        setPanOffset({ x: 0, y: 0 })
      }
      return
    }

    lastTapTimeRef.current = now

    // Single Tap: Toggle pure fullscreen jika tidak sedang di-zoom
    tapTimeoutRef.current = setTimeout(() => {
      if (zoomScale > 1.1) {
        resetZoom()
      } else {
        setIsPureFullscreen(prev => !prev)
      }
      tapTimeoutRef.current = null
    }, DOUBLE_TAP_DELAY)
  }

  const handleWheel = (e: React.WheelEvent) => {
    const zoomFactor = e.deltaY < 0 ? 1.2 : 0.83
    setZoomScale(prev => {
      const next = Math.min(Math.max(1, prev * zoomFactor), 4.5)
      if (next <= 1.05) {
        setPanOffset({ x: 0, y: 0 })
      }
      return next
    })
  }

  return (
    <div
      className={`fixed inset-0 z-60 bg-black flex flex-col items-center justify-between transition-all duration-300 animate-in fade-in select-none ${
        isPureFullscreen ? 'p-0 cursor-zoom-out' : 'p-3 sm:p-6 bg-black/95'
      }`}
      onClick={() => {
        if (isPureFullscreen) {
          setIsPureFullscreen(false)
        } else {
          onClose()
        }
      }}
    >
      {/* Header (Disembunyikan total saat mode layar penuh bersih) */}
      {!isPureFullscreen && (
        <div
          className="w-full max-w-4xl flex items-center justify-between gap-2 z-10 animate-in fade-in duration-200"
          onClick={e => e.stopPropagation()}
        >
          <div className="flex items-center gap-2 min-w-0">
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 sm:px-2.5 sm:py-1.5 rounded-xl bg-zinc-800/80 hover:bg-zinc-700 text-zinc-300 hover:text-white transition-colors flex items-center gap-1 shrink-0 border border-zinc-700/60"
              title="Kembali ke Galeri Riwayat"
            >
              <ChevronLeft className="w-4 h-4" />
              <span className="text-xs font-medium hidden sm:inline">Kembali</span>
            </button>

            {/* Counter Badge */}
            {currentIndex !== -1 && (
              <span className="px-2 py-0.5 rounded-md bg-zinc-800 border border-zinc-700 text-[11px] font-mono font-medium text-emerald-400 shrink-0">
                {currentIndex + 1} / {totalCount}
              </span>
            )}

            <div className="text-xs text-zinc-300 flex items-center gap-1.5 min-w-0">
              <MapPin className="w-3.5 h-3.5 text-rose-400 shrink-0" />
              <span className="font-medium truncate">
                {photo.address || 'Dokumentasi Lokasi'}
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-full glass-panel hover:bg-white/20 text-white transition-colors shrink-0"
            title="Tutup Pratinjau Foto"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* Large Image View with Left/Right Buttons & Swipe Gestures & Pinch-to-Zoom */}
      <div
        className={`relative flex items-center justify-center overflow-hidden transition-all duration-300 ${
          isPureFullscreen
            ? 'w-full h-full p-0'
            : 'flex-1 w-full max-w-4xl p-2'
        } ${
          zoomScale > 1.05
            ? 'cursor-grab active:cursor-grabbing'
            : isPureFullscreen
            ? 'cursor-zoom-out'
            : 'cursor-zoom-in'
        }`}
        onClick={handlePhotoClick}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onWheel={handleWheel}
        title={
          zoomScale > 1.05
            ? 'Seret gambar untuk melihat detail • Ketuk 2x untuk reset zoom'
            : isPureFullscreen
            ? 'Ketuk layar untuk kembali • Cubit 2 jari / ketuk 2x untuk zoom'
            : 'Cubit 2 jari untuk zoom • Ketuk foto untuk layar penuh'
        }
      >
        {/* Tombol Panah Kiri (Sebelumnya) */}
        {!isPureFullscreen && hasPrev && zoomScale <= 1.05 && (
          <button
            type="button"
            onClick={e => {
              e.stopPropagation()
              onPrev()
            }}
            className="absolute left-2 sm:left-4 z-20 p-2.5 sm:p-3 rounded-full bg-zinc-950/75 hover:bg-zinc-900 border border-white/15 text-white backdrop-blur-md shadow-2xl transition-all hover:scale-110 active:scale-95 group cursor-pointer"
            title="Foto Sebelumnya (Panah Kiri / Geser Kanan)"
          >
            <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 text-zinc-300 group-hover:text-white group-hover:-translate-x-0.5 transition-transform" />
          </button>
        )}

        {/* Container Gambar dengan Efek Transisi / Swipe Translation / Zoom & Pan */}
        <div
          key={photo.id}
          className="w-full h-full flex items-center justify-center animate-in fade-in zoom-in-95 duration-200 select-none"
          style={{
            transform:
              zoomScale > 1.02
                ? `translate3d(${panOffset.x}px, ${panOffset.y}px, 0px) scale(${zoomScale})`
                : `translate3d(${swipeOffset}px, 0px, 0px) scale(1)`,
            transition:
              isSwiping || isDraggingRef.current
                ? 'none'
                : 'transform 0.25s cubic-bezier(0.2, 0.8, 0.2, 1)',
            willChange: 'transform',
          }}
        >
          <img
            src={photo.dataUrl}
            alt="Preview Penuh"
            draggable={false}
            style={{ imageRendering: 'auto' }}
            className={`object-contain pointer-events-none transition-all duration-300 ${
              isPureFullscreen
                ? 'w-full h-full max-w-none max-h-none rounded-none'
                : 'max-w-full max-h-full w-auto h-auto rounded-2xl shadow-2xl'
            }`}
          />
        </div>

        {/* Tombol Panah Kanan (Selanjutnya) */}
        {!isPureFullscreen && hasNext && zoomScale <= 1.05 && (
          <button
            type="button"
            onClick={e => {
              e.stopPropagation()
              onNext()
            }}
            className="absolute right-2 sm:right-4 z-20 p-2.5 sm:p-3 rounded-full bg-zinc-950/75 hover:bg-zinc-900 border border-white/15 text-white backdrop-blur-md shadow-2xl transition-all hover:scale-110 active:scale-95 group cursor-pointer"
            title="Foto Selanjutnya (Panah Kanan / Geser Kiri)"
          >
            <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 text-zinc-300 group-hover:text-white group-hover:translate-x-0.5 transition-transform" />
          </button>
        )}

        {/* Indikator Floating Zoom saat foto sedang di-zoom */}
        {zoomScale > 1.05 && (
          <div className="absolute bottom-5 inset-x-0 flex items-center justify-center z-30 pointer-events-auto animate-in fade-in zoom-in-90">
            <button
              type="button"
              onClick={e => {
                e.stopPropagation()
                resetZoom()
              }}
              className="px-3.5 py-1.5 rounded-full bg-zinc-950/90 hover:bg-zinc-900 border border-emerald-500/50 text-white backdrop-blur-md shadow-2xl flex items-center gap-2 text-xs font-medium active:scale-95 transition-all group cursor-pointer"
              title="Klik untuk kembalikan zoom ke 1x"
            >
              <span className="font-mono text-emerald-400 font-bold">
                {zoomScale.toFixed(1)}x
              </span>
              <span className="text-zinc-300 text-[11px] group-hover:text-white">
                Reset Zoom
              </span>
              <RotateCcw className="w-3.5 h-3.5 text-emerald-400 group-hover:-rotate-90 transition-transform" />
            </button>
          </div>
        )}
      </div>

      {/* Footer Action (Disembunyikan total saat mode layar penuh bersih) */}
      {!isPureFullscreen && (
        <div
          className="w-full max-w-4xl flex items-center justify-between gap-3 pt-3 border-t border-zinc-800/80 z-10 animate-in fade-in duration-200"
          onClick={e => e.stopPropagation()}
        >
          <div className="flex flex-col gap-0.5">
            <div className="text-xs text-zinc-400 font-mono">
              {new Date(photo.timestamp).toLocaleString('id-ID')}
            </div>
            {driveError ? (
              <div className="text-[10px] text-rose-400 font-medium">
                {driveError}
              </div>
            ) : (
              <div className="text-[10px] text-zinc-500 hidden sm:block">
                Tips: Cubit 2 jari untuk zoom • Ketuk 2x untuk zoom cepat • Geser 1 jari untuk ganti foto
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onDelete(photo.id)}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-rose-500/30 bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 text-xs font-semibold transition-all active:scale-95"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Hapus</span>
            </button>

            {driveResult?.webViewLink ? (
              <a
                href={driveResult.webViewLink}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl border border-emerald-500/40 bg-emerald-950/40 hover:bg-emerald-900/50 text-emerald-300 text-xs font-semibold transition-all active:scale-95 shadow-md"
                title="Buka Foto di Google Drive"
              >
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span>Di Drive</span>
                <ExternalLink className="w-3 h-3 text-emerald-400" />
              </a>
            ) : (
              <button
                type="button"
                onClick={handleDriveUpload}
                disabled={isUploadingDrive}
                className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl border border-zinc-700 bg-zinc-900 hover:bg-zinc-800 text-zinc-200 text-xs font-semibold transition-all active:scale-95 shadow-md"
                title={isDriveConnected ? 'Upload ke Google Drive' : 'Kaitkan Akun Google Drive'}
              >
                {isUploadingDrive ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-emerald-400" />
                    <span>Upload...</span>
                  </>
                ) : (
                  <>
                    <Cloud className={`w-3.5 h-3.5 ${isDriveConnected ? 'text-emerald-400' : 'text-zinc-400'}`} />
                    <span>Drive</span>
                  </>
                )}
              </button>
            )}

            <button
              type="button"
              onClick={() => onDownload(photo)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-zinc-950 font-bold text-xs sm:text-sm hover:bg-zinc-200 transition-all shadow-xl active:scale-95"
            >
              <Download className="w-4 h-4" />
              <span>Unduh Foto (HD)</span>
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
