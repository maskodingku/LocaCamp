import type { RefObject } from 'react'
import appLogo from '../../assets/locacamp-logo.jpg'
import {
  RotateCcw,
  Zap,
  ZapOff,
  Settings,
  AlertTriangle,
  RefreshCw,
  Download,
  Sparkles,
  Palette,
} from 'lucide-react'
import { usePWAInstall } from '../../hooks/usePWAInstall'
import { GeotagBadge } from '../overlay/GeotagBadge'
import { WatermarkLayer } from '../overlay/WatermarkLayer'
import type {
  GeoLocationData,
  GeotagDisplayConfig,
  WatermarkConfig,
  CameraEffectConfig,
} from '../../types/camera'
import { getCameraFilterString } from '../../utils/cameraFilters'

interface CameraViewportProps {
  videoRef: RefObject<HTMLVideoElement | null>
  isStreaming: boolean
  isLoading: boolean
  error: string | null
  facingMode: 'user' | 'environment'
  hasMultipleCameras: boolean
  supportsTorch: boolean
  isTorchOn: boolean
  onSwitchCamera: () => void
  onToggleTorch: () => void
  onRestartCamera: () => void
  onOpenSettings: () => void
  onRefreshLocation?: () => void
  location: GeoLocationData
  geotagConfig: GeotagDisplayConfig
  watermark: WatermarkConfig
  cameraEffect?: CameraEffectConfig | null
  isLandscape?: boolean
  isPresetBarOpen?: boolean
  onTogglePresetBar?: () => void
  onClosePresetBar?: () => void
}

export const CameraViewport: React.FC<CameraViewportProps> = ({
  videoRef,
  isStreaming,
  isLoading,
  error,
  facingMode,
  hasMultipleCameras,
  supportsTorch,
  isTorchOn,
  onSwitchCamera,
  onToggleTorch,
  onRestartCamera,
  onOpenSettings,
  onRefreshLocation,
  location,
  geotagConfig,
  watermark,
  cameraEffect,
  isLandscape = false,
  isPresetBarOpen = false,
  onTogglePresetBar,
  onClosePresetBar,
}) => {
  const { canInstall, installApp } = usePWAInstall()

  // Filter visual real-time pada video stream (WYSIWYG 60fps)
  const liveFilter = getCameraFilterString(cameraEffect, { includeDenoise: false })

  const isEffectActive = Boolean(
    cameraEffect &&
      (cameraEffect.preset !== 'normal' ||
        cameraEffect.finetune.brightness !== 0 ||
        cameraEffect.finetune.contrast !== 0 ||
        cameraEffect.finetune.saturation !== 0)
  )

  const effectLabel = cameraEffect?.preset === 'vivid'
    ? 'Vivid'
    : cameraEffect?.preset === 'warm'
    ? 'Warm'
    : cameraEffect?.preset === 'cool'
    ? 'Cool'
    : cameraEffect?.preset === 'monochrome'
    ? 'B&W'
    : cameraEffect?.preset === 'hdr'
    ? 'HDR'
    : 'Efek Aktif'

  return (
    <div
      onClick={() => {
        if (isPresetBarOpen && onClosePresetBar) {
          onClosePresetBar()
        }
      }}
      className="relative w-full h-full bg-black overflow-hidden flex items-center justify-center select-none"
    >
      {/* 1. Camera Video Element */}
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        style={{
          filter: liveFilter !== 'none' ? liveFilter : undefined,
        }}
        className={`w-full h-full object-cover transition-opacity duration-500 ${
          isStreaming ? 'opacity-100' : 'opacity-0'
        } ${facingMode === 'user' ? '-scale-x-100' : ''}`}
      />

      {/* 2. Loading State */}
      {isLoading && !error && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-zinc-950/90 z-30 text-white gap-3 animate-in fade-in">
          <div className="w-10 h-10 border-2 border-zinc-700 border-t-white rounded-full animate-spin" />
          <p className="text-sm font-medium text-zinc-300">Menghubungkan ke kamera...</p>
        </div>
      )}

      {/* 3. Error / Permission Denied State */}
      {error && (
        <div className="absolute inset-0 flex flex-col items-center justify-center p-6 bg-zinc-950/95 z-30 text-center">
          <div className="w-14 h-14 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center mb-4">
            <AlertTriangle className="w-7 h-7 text-rose-400" />
          </div>
          <h3 className="text-lg font-semibold text-white mb-2">Akses Kamera Diperlukan</h3>
          <p className="text-sm text-zinc-400 max-w-sm mb-6 leading-relaxed">{error}</p>
          <button
            type="button"
            onClick={onRestartCamera}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-zinc-950 font-semibold text-sm hover:bg-zinc-200 active:scale-95 transition-all shadow-lg"
          >
            <RefreshCw className="w-4 h-4" />
            Coba Lagi
          </button>
        </div>
      )}

      {/* 4. Top Minimal Bar (Controls & Status) */}
      <div
        onClick={e => e.stopPropagation()}
        className="absolute top-0 inset-x-0 p-4 pt-6 md:p-5 flex items-center justify-between z-20 bg-transparent pointer-events-auto"
      >
        {/* Sisi Kiri: Tombol Install App dan/atau Badge Efek Visual Aktif */}
        <div className="flex items-center gap-2">
          {canInstall && (
            <button
              type="button"
              onClick={installApp}
              className="flex items-center gap-2 pl-1.5 pr-3 py-1 rounded-full glass-pill border border-emerald-500/40 hover:border-emerald-400/70 bg-emerald-950/70 hover:bg-emerald-900/80 shadow-lg backdrop-blur-md transition-all active:scale-95 group cursor-pointer"
              title="Install LocaCamp ke Perangkat"
            >
              <img
                src={appLogo}
                alt="LocaCamp"
                className="w-5 h-5 rounded-full object-cover border border-emerald-500/40"
              />
              <span className="text-xs font-semibold tracking-wide text-emerald-300 group-hover:text-emerald-200">
                Install App
              </span>
              <Download className="w-3.5 h-3.5 text-emerald-400 group-hover:translate-y-0.5 transition-transform" />
            </button>
          )}

          {isEffectActive && (
            <button
              type="button"
              onClick={onTogglePresetBar || onOpenSettings}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-full glass-pill border transition-all active:scale-95 cursor-pointer shadow-lg backdrop-blur-md text-xs font-semibold ${
                isPresetBarOpen
                  ? 'border-emerald-400 bg-emerald-950/80 text-emerald-300 ring-2 ring-emerald-500/40'
                  : 'border-amber-500/40 bg-amber-950/50 hover:bg-amber-900/60 text-amber-300'
              }`}
              title="Filter Efek Visual Aktif (Klik untuk ubah preset langsung)"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>{effectLabel}</span>
            </button>
          )}
        </div>

        {/* Top Actions */}
        <div className="flex items-center gap-2">
          {/* Torch Toggle (if supported) */}
          {supportsTorch && (
            <button
              type="button"
              onClick={onToggleTorch}
              className={`p-2.5 rounded-full transition-all active:scale-90 shadow-md backdrop-blur-md ${
                isTorchOn
                  ? 'bg-amber-400 text-black shadow-lg shadow-amber-400/20'
                  : 'glass-pill text-white hover:bg-white/10'
              }`}
              title={isTorchOn ? 'Matikan Lampu' : 'Nyalakan Lampu'}
            >
              {isTorchOn ? <Zap className="w-4 h-4 fill-black" /> : <ZapOff className="w-4 h-4" />}
            </button>
          )}

          {/* Switch Camera */}
          {hasMultipleCameras && (
            <button
              type="button"
              onClick={onSwitchCamera}
              className="p-2.5 rounded-full glass-pill text-white hover:bg-white/10 shadow-md backdrop-blur-md transition-all active:scale-90"
              title="Ganti Kamera Depan/Belakang"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          )}

          {/* Preset Filter Shortcut Button */}
          {onTogglePresetBar && (
            <button
              type="button"
              onClick={onTogglePresetBar}
              className={`p-2.5 rounded-full shadow-md backdrop-blur-md transition-all active:scale-90 ${
                isPresetBarOpen
                  ? 'bg-emerald-500 text-black shadow-lg shadow-emerald-500/30 ring-2 ring-emerald-400'
                  : isEffectActive
                  ? 'glass-pill text-amber-300 border border-amber-500/40 hover:bg-amber-950/40'
                  : 'glass-pill text-white hover:bg-white/10'
              }`}
              title="Pilih Efek Visual & Filter Kamera"
            >
              <Palette className="w-4 h-4" />
            </button>
          )}

          {/* Settings Trigger */}
          <button
            type="button"
            onClick={onOpenSettings}
            className="p-2.5 rounded-full glass-pill text-white hover:bg-white/10 shadow-md backdrop-blur-md transition-all active:scale-90"
            title="Buka Pengaturan Watermark & Geotag"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 5. Live Overlays (Watermark + Geotag HUD) */}
      {isStreaming && (
        <>
          <WatermarkLayer
            watermark={watermark}
            isLandscape={isLandscape}
          />
          <GeotagBadge
            location={location}
            config={geotagConfig}
            onRefresh={onRefreshLocation}
            isLandscape={isLandscape}
          />
        </>
      )}

      {/* Grid viewfinder aesthetic markers */}
      {isStreaming && (
        <div className="absolute inset-0 pointer-events-none opacity-15">
          <div className="w-full h-full border border-white/40" />
          <div className="absolute inset-x-0 top-1/3 border-b border-white/30" />
          <div className="absolute inset-x-0 top-2/3 border-b border-white/30" />
          <div className="absolute inset-y-0 left-1/3 border-r border-white/30" />
          <div className="absolute inset-y-0 left-2/3 border-r border-white/30" />
        </div>
      )}
    </div>
  )
}
