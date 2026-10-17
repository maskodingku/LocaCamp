import React, { useState, useEffect } from 'react'
import {
  TransformWrapper,
  TransformComponent,
  useControls,
  type ReactZoomPanPinchContentRef,
} from 'react-zoom-pan-pinch'
import {
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Hand,
} from 'lucide-react'

interface ZoomablePhotoViewerProps {
  src: string
  alt?: string
  className?: string
}

/**
 * Icon Center Crosshair presisi (lingkaran tengah dengan 4 sumbu target)
 */
const CenterCrosshairIcon: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <circle cx="12" cy="12" r="3" />
    <line x1="12" y1="2" x2="12" y2="7" />
    <line x1="12" y1="17" x2="12" y2="22" />
    <line x1="2" y1="12" x2="7" y2="12" />
    <line x1="17" y1="12" x2="22" y2="12" />
  </svg>
)

/**
 * Sub-komponen Cyber Glass HUD Controls di dalam TransformWrapper
 */
const CyberGlassControls: React.FC<{
  currentScale: number
  onTogglePreset: () => void
}> = ({ currentScale, onTogglePreset }) => {
  const { zoomIn, zoomOut, resetTransform, centerView } = useControls()
  const isZoomed = currentScale > 1.05

  return (
    <div
      className="absolute bottom-3 right-3 z-30 flex items-center gap-1.5 p-1.5 rounded-2xl bg-gradient-to-b from-[#03152e]/90 via-[#062042]/90 to-[#020d1c]/95 border border-cyan-500/30 shadow-[0_8px_24px_rgba(0,0,0,0.6),inset_0_1px_1.5px_rgba(255,255,255,0.2)] backdrop-blur-md select-none transition-all duration-300"
      onClick={e => e.stopPropagation()}
    >
      {/* Live Scale Badge Multiplier (Klik untuk toggle 1x / 2.5x) */}
      <button
        type="button"
        onClick={onTogglePreset}
        title="Klik untuk ubah zoom cepat"
        className={`px-2 py-1 rounded-xl font-mono text-[11px] font-bold tracking-tight transition-all cursor-pointer ${
          isZoomed
            ? 'bg-cyan-500/25 border border-cyan-400/50 text-cyan-200 shadow-[0_0_10px_rgba(34,211,238,0.35)]'
            : 'bg-white/5 border border-white/10 text-slate-300 hover:text-white hover:bg-white/10'
        }`}
      >
        {currentScale.toFixed(1)}x
      </button>

      {/* Tombol Zoom In */}
      <button
        type="button"
        onClick={() => zoomIn(0.5)}
        title="Perbesar (Zoom In)"
        className="w-8 h-8 rounded-xl bg-white/5 hover:bg-cyan-500/20 active:scale-95 border border-white/10 hover:border-cyan-400/40 text-slate-200 hover:text-cyan-200 flex items-center justify-center transition-all cursor-pointer"
      >
        <ZoomIn className="w-4 h-4" />
      </button>

      {/* Tombol Zoom Out */}
      <button
        type="button"
        onClick={() => zoomOut(0.5)}
        disabled={currentScale <= 0.85}
        title="Perkecil (Zoom Out)"
        className="w-8 h-8 rounded-xl bg-white/5 hover:bg-cyan-500/20 active:scale-95 border border-white/10 hover:border-cyan-400/40 text-slate-200 hover:text-cyan-200 disabled:opacity-40 disabled:pointer-events-none flex items-center justify-center transition-all cursor-pointer"
      >
        <ZoomOut className="w-4 h-4" />
      </button>

      {/* Divider Vertikal Halus Antara Grup Zoom dan Posisi */}
      <div className="w-[1px] h-4 bg-white/20 mx-0.5" />

      {/* Tombol Reset Transform (Ukuran 1.0x) */}
      <button
        type="button"
        onClick={() => resetTransform()}
        disabled={!isZoomed}
        title="Reset Ukuran Normal (1.0x)"
        className="w-8 h-8 rounded-xl bg-white/5 hover:bg-rose-500/20 active:scale-95 border border-white/10 hover:border-rose-400/40 text-slate-200 hover:text-rose-200 disabled:opacity-30 disabled:pointer-events-none flex items-center justify-center transition-all cursor-pointer"
      >
        <RotateCcw className="w-3.5 h-3.5" />
      </button>

      {/* Tombol Center View (Icon Crosshair Target Sesuai Referensi) */}
      <button
        type="button"
        onClick={() => centerView()}
        title="Posisikan ke Tengah (Center Focus)"
        className="w-8 h-8 rounded-xl bg-white/5 hover:bg-cyan-500/20 active:scale-95 border border-white/10 hover:border-cyan-400/40 text-slate-200 hover:text-cyan-200 flex items-center justify-center transition-all cursor-pointer"
      >
        <CenterCrosshairIcon className="w-4 h-4" />
      </button>
    </div>
  )
}

/**
 * Komponen ZoomablePhotoViewer
 * Menggunakan react-zoom-pan-pinch untuk pinch, pan, mouse wheel, double tap, dan floating HUD.
 */
export const ZoomablePhotoViewer: React.FC<ZoomablePhotoViewerProps> = ({
  src,
  alt = 'Captured Geotag',
  className = '',
}) => {
  const [scale, setScale] = useState<number>(1)
  const [showHint, setShowHint] = useState<boolean>(true)
  const transformRef = React.useRef<ReactZoomPanPinchContentRef | null>(null)

  // Otomatis pudarkan hint gesture setelah 3.5 detik
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowHint(false)
    }, 3500)
    return () => clearTimeout(timer)
  }, [])

  // Jika pengguna melakukan zoom manual, hilangkan hint seketika
  const handleTransform = (_ref: any, state: { scale: number }) => {
    setScale(state.scale)
    if (state.scale > 1.05 && showHint) {
      setShowHint(false)
    }
  }

  // Toggle cepat antara 1x dan 2.5x saat badge diklik
  const handleTogglePreset = () => {
    if (!transformRef.current) return
    if (scale > 1.2) {
      transformRef.current.resetTransform()
    } else {
      transformRef.current.zoomIn(1.5)
    }
  }

  return (
    <div className={`relative w-full h-full overflow-hidden select-none touch-none ${className}`}>
      {/* Floating Gesture Guide Hint (Otomatis memudar) */}
      {showHint && (
        <div className="absolute top-3 left-1/2 -translate-x-1/2 z-30 pointer-events-none flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/75 border border-cyan-500/30 text-cyan-200 text-[11px] font-medium backdrop-blur-md shadow-lg animate-in fade-in slide-in-from-top-2 duration-300">
          <Hand className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
          <span>Cubit atau ketuk 2x untuk zoom</span>
        </div>
      )}

      {/* Transform Wrapper & Content */}
      <TransformWrapper
        ref={transformRef}
        initialScale={1}
        minScale={0.8}
        maxScale={8}
        centerOnInit={true}
        centerZoomedOut={true}
        limitToBounds={true}
        smooth={true}
        wheel={{ step: 0.15 }}
        pinch={{ step: 5 }}
        panning={{ velocityDisabled: false }}
        doubleClick={{ mode: 'toggle', step: 2 }}
        onTransform={handleTransform}
      >
        <TransformComponent
          wrapperClass="!w-full !h-full flex items-center justify-center cursor-grab active:cursor-grabbing"
          contentClass="!w-full !h-full flex items-center justify-center p-2 sm:p-3"
        >
          <img
            src={src}
            alt={alt}
            className="max-w-full max-h-full w-auto h-auto object-contain rounded-lg sm:rounded-xl shadow-2xl select-none pointer-events-auto"
            draggable={false}
          />
        </TransformComponent>

        {/* Floating Cyber Glass HUD Controls */}
        <CyberGlassControls currentScale={scale} onTogglePreset={handleTogglePreset} />
      </TransformWrapper>
    </div>
  )
}

export default ZoomablePhotoViewer
