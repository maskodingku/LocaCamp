import React from 'react'
import { Images, Sliders } from 'lucide-react'
import type { OrientationAngle } from '../../hooks/useOrientation'

interface ShutterControlsProps {
  onCapture: () => void
  isCapturing: boolean
  isReady: boolean
  onOpenSettings: () => void
  onOpenHistory: () => void
  historyCount?: number
  isLandscape?: boolean
  rotationAngle?: OrientationAngle
}

export const ShutterControls: React.FC<ShutterControlsProps> = ({
  onCapture,
  isCapturing,
  isReady,
  onOpenSettings,
  onOpenHistory,
  historyCount = 0,
  isLandscape = false,
  rotationAngle = 0,
}) => {
  // Rotasi ikon tombol jika orientasi miring
  const iconRotateClass =
    rotationAngle === 90
      ? '-rotate-90'
      : rotationAngle === 270
      ? 'rotate-90'
      : rotationAngle === 180
      ? 'rotate-180'
      : ''

  // 1. Layout Khusus Landscape: Berada di sisi KANAN layar terpisah dari area foto
  if (isLandscape) {
    return (
      <aside
        className="h-full w-24 md:w-28 bg-black border-l border-zinc-900/90 py-5 px-2 flex flex-col items-center justify-between z-20 shrink-0 select-none shadow-2xl transition-all"
        aria-label="Panel Kontrol Kamera Landscape"
      >
        {/* Top Slot: Photo History Gallery Button */}
        <div className="w-12 h-12 flex items-center justify-center">
          <button
            type="button"
            onClick={onOpenHistory}
            className="relative w-11 h-11 rounded-full glass-pill flex items-center justify-center text-zinc-300 hover:text-white hover:bg-white/15 active:scale-90 transition-all group"
            title="Riwayat Foto (Galeri)"
          >
            <Images className={`w-5 h-5 transition-transform group-hover:scale-110 ${iconRotateClass}`} />
            {historyCount > 0 && (
              <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-emerald-500 text-[10px] font-bold text-white flex items-center justify-center shadow-lg border border-black animate-in zoom-in-75">
                {historyCount > 99 ? '99+' : historyCount}
              </span>
            )}
          </button>
        </div>

        {/* Center Slot: Large Shutter Button (Presisi di tengah jangkauan ibu jari kanan) */}
        <div className="flex items-center justify-center my-auto">
          <button
            type="button"
            disabled={!isReady || isCapturing}
            onClick={onCapture}
            className={`relative w-18 h-18 md:w-20 md:h-20 rounded-full flex items-center justify-center transition-all ${
              isReady && !isCapturing
                ? 'cursor-pointer active:scale-90 hover:scale-105 animate-pulse-ring'
                : 'opacity-50 cursor-not-allowed'
            }`}
            title="Ambil Foto"
          >
            {/* Outer ring */}
            <div className="absolute inset-0 rounded-full border-4 border-white/80" />

            {/* Inner solid button */}
            <div
              className={`w-14 h-14 md:w-16 md:h-16 rounded-full transition-all duration-200 ${
                isCapturing
                  ? 'bg-rose-500 scale-75'
                  : 'bg-white hover:bg-zinc-100 shadow-2xl'
              }`}
            >
              {isCapturing && (
                <div className="w-full h-full flex items-center justify-center">
                  <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                </div>
              )}
            </div>
          </button>
        </div>

        {/* Bottom Slot: Settings Button */}
        <div className="w-12 h-12 flex items-center justify-center">
          <button
            type="button"
            onClick={onOpenSettings}
            className="w-11 h-11 rounded-full glass-pill flex items-center justify-center text-zinc-300 hover:text-white hover:bg-white/10 active:scale-90 transition-all"
            title="Pengaturan Watermark & Geotag"
          >
            <Sliders className={`w-5 h-5 transition-transform ${iconRotateClass}`} />
          </button>
        </div>
      </aside>
    )
  }

  // 2. Layout Portrait (Default di bagian bawah)
  return (
    <div className="w-full bg-gradient-to-t from-black via-black/90 to-transparent pt-4 pb-8 px-6 flex items-center justify-between z-20 shrink-0 select-none">
      {/* Left Slot: Always Settings Button */}
      <div className="w-14 h-14 flex items-center justify-center">
        <button
          type="button"
          onClick={onOpenSettings}
          className="w-11 h-11 rounded-full glass-pill flex items-center justify-center text-zinc-300 hover:text-white hover:bg-white/10 active:scale-90 transition-all"
          title="Pengaturan Watermark & Geotag"
        >
          <Sliders className={`w-5 h-5 transition-transform ${iconRotateClass}`} />
        </button>
      </div>

      {/* Center Slot: Large Shutter Button */}
      <div className="flex items-center justify-center">
        <button
          type="button"
          disabled={!isReady || isCapturing}
          onClick={onCapture}
          className={`relative w-20 h-20 rounded-full flex items-center justify-center transition-all ${
            isReady && !isCapturing
              ? 'cursor-pointer active:scale-90 hover:scale-105 animate-pulse-ring'
              : 'opacity-50 cursor-not-allowed'
          }`}
          title="Ambil Foto"
        >
          {/* Outer ring */}
          <div className="absolute inset-0 rounded-full border-4 border-white/80" />

          {/* Inner solid button */}
          <div
            className={`w-16 h-16 rounded-full transition-all duration-200 ${
              isCapturing
                ? 'bg-rose-500 scale-75'
                : 'bg-white hover:bg-zinc-100 shadow-2xl'
            }`}
          >
            {isCapturing && (
              <div className="w-full h-full flex items-center justify-center">
                <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
              </div>
            )}
          </div>
        </button>
      </div>

      {/* Right Slot: Photo History Gallery Button */}
      <div className="w-14 h-14 flex items-center justify-center">
        <button
          type="button"
          onClick={onOpenHistory}
          className="relative w-11 h-11 rounded-full glass-pill flex items-center justify-center text-zinc-300 hover:text-white hover:bg-white/15 active:scale-90 transition-all group"
          title="Riwayat Foto (Galeri)"
        >
          <Images className={`w-5 h-5 transition-transform group-hover:scale-110 ${iconRotateClass}`} />
          {historyCount > 0 && (
            <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-emerald-500 text-[10px] font-bold text-white flex items-center justify-center shadow-lg border border-black animate-in zoom-in-75">
              {historyCount > 99 ? '99+' : historyCount}
            </span>
          )}
        </button>
      </div>
    </div>
  )
}
