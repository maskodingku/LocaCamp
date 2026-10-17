import { useState, useEffect } from 'react'
import {
  X,
  Sparkles,
  Sliders,
  MapPin,
  Camera,
  Cloud,
  Info,
  RotateCcw,
} from 'lucide-react'
import type {
  WatermarkConfig,
  GeotagDisplayConfig,
  CameraQualityConfig,
  SensorCapabilitiesInfo,
  CameraEffectConfig,
  ProfileConfig,
} from '../../types/camera'
import type { useGoogleDrive } from '../../hooks/useGoogleDrive'
import { WatermarkTab } from './WatermarkTab'
import { GeotagTab } from './GeotagTab'
import { CameraTab } from './CameraTab'
import { GoogleDriveTab } from './GoogleDriveTab'
import { AboutTab } from './AboutTab'
import { LivePreviewDock } from './LivePreviewDock'

interface SettingsDrawerProps {
  isOpen: boolean
  onClose: () => void
  watermark: WatermarkConfig
  onChangeWatermark: (cfg: WatermarkConfig) => void
  profile: ProfileConfig
  onChangeProfile: (cfg: ProfileConfig) => void
  geotagConfig: GeotagDisplayConfig
  onChangeGeotagConfig: (cfg: GeotagDisplayConfig) => void
  cameraQualityConfig: CameraQualityConfig
  onChangeCameraQualityConfig: (cfg: CameraQualityConfig) => void
  cameraEffect: CameraEffectConfig
  onChangeCameraEffect: (cfg: CameraEffectConfig) => void
  sensorInfo?: SensorCapabilitiesInfo | null
  onResetSettings?: () => void
  drive: ReturnType<typeof useGoogleDrive>
  onPreviewModeChange?: (isActive: boolean) => void
}

export const SettingsDrawer: React.FC<SettingsDrawerProps> = ({
  isOpen,
  onClose,
  watermark,
  onChangeWatermark,
  profile,
  onChangeProfile,
  geotagConfig,
  onChangeGeotagConfig,
  cameraQualityConfig,
  onChangeCameraQualityConfig,
  cameraEffect,
  onChangeCameraEffect,
  sensorInfo,
  onResetSettings,
  drive,
  onPreviewModeChange,
}) => {
  const [activeTab, setActiveTab] = useState<'watermark' | 'geotag' | 'camera' | 'drive' | 'about'>('watermark')
  const [activeSlider, setActiveSlider] = useState<string | null>(null)
  const [activePreviewInput, setActivePreviewInput] = useState<string | null>(null)

  // Notifikasi perubahan mode preview ke parent (App.tsx)
  useEffect(() => {
    onPreviewModeChange?.(Boolean(activePreviewInput))
  }, [activePreviewInput, onPreviewModeChange])

  // Reset mode preview jika modal pengaturan ditutup
  useEffect(() => {
    if (!isOpen) {
      setActivePreviewInput(null)
      onPreviewModeChange?.(false)
    }
  }, [isOpen, onPreviewModeChange])

  // Listener tombol Escape keyboard untuk menutup mode preview
  useEffect(() => {
    if (!activePreviewInput) return
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setActivePreviewInput(null)
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [activePreviewInput])

  // Global listener untuk deteksi saat slider dilepas di mana saja
  useEffect(() => {
    if (!activeSlider) return
    const handleRelease = () => setActiveSlider(null)
    window.addEventListener('pointerup', handleRelease)
    window.addEventListener('pointercancel', handleRelease)
    window.addEventListener('touchend', handleRelease)
    window.addEventListener('mouseup', handleRelease)
    return () => {
      window.removeEventListener('pointerup', handleRelease)
      window.removeEventListener('pointercancel', handleRelease)
      window.removeEventListener('touchend', handleRelease)
      window.removeEventListener('mouseup', handleRelease)
    }
  }, [activeSlider])

  if (!isOpen) return null

  return (
    <>
      {/* Floating Dock Input Interaktif di samping tombol tutup saat Mode Preview Aktif */}
      {activePreviewInput && (
        <LivePreviewDock
          activeInput={activePreviewInput}
          onChangeActiveInput={setActivePreviewInput}
          onClose={() => setActivePreviewInput(null)}
          profile={profile}
          onChangeProfile={onChangeProfile}
          watermark={watermark}
          onChangeWatermark={onChangeWatermark}
          geotagConfig={geotagConfig}
          onChangeGeotagConfig={onChangeGeotagConfig}
        />
      )}

      <div
        className={`fixed inset-0 flex items-stretch md:items-center justify-center transition-all duration-200 ${
          activePreviewInput
            ? 'bg-transparent pointer-events-none z-0 hidden'
            : activeSlider
            ? 'bg-black/25 backdrop-blur-none pointer-events-auto z-[100]'
            : 'bg-black/70 backdrop-blur-md animate-in fade-in z-50'
        }`}
      >
        <div
          className={`w-full md:max-w-xl h-full md:h-auto md:max-h-[88vh] rounded-none md:rounded-3xl flex flex-col text-white transition-all duration-200 ${
            activeSlider
              ? 'bg-transparent border-transparent shadow-none overflow-visible'
              : 'bg-zinc-950 border-0 md:border md:border-zinc-800 shadow-2xl overflow-hidden animate-in fade-in md:slide-in-from-bottom-6 duration-200'
          }`}
          onClick={e => e.stopPropagation()}
        >
        {/* Header */}
        <div
          className={`items-center justify-between px-5 md:px-6 py-3.5 md:py-4 pt-[max(0.875rem,env(safe-area-inset-top))] border-b border-zinc-800 shrink-0 transition-opacity duration-150 ${
            activeSlider ? 'hidden' : 'flex'
          }`}
        >
          <div className="flex items-center gap-2">
            <Sliders className="w-5 h-5 text-zinc-400" />
            <h2 className="text-base font-semibold text-white">Pengaturan Foto &amp; Tampilan</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Buttons */}
        <div
          className={`grid-cols-5 border-b border-zinc-800 px-1 md:px-6 bg-zinc-900/50 shrink-0 transition-opacity duration-150 ${
            activeSlider ? 'hidden' : 'grid'
          }`}
        >
          <button
            type="button"
            onClick={() => setActiveTab('watermark')}
            className={`py-3 px-1 md:px-2 text-[10px] sm:text-[11px] md:text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-1 sm:gap-1.5 border-b-2 transition-all ${
              activeTab === 'watermark'
                ? 'border-white text-white'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">Basic</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('geotag')}
            className={`py-3 px-1 md:px-2 text-[10px] sm:text-[11px] md:text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-1 sm:gap-1.5 border-b-2 transition-all ${
              activeTab === 'geotag'
                ? 'border-white text-white'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <MapPin className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">Geotag</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('camera')}
            className={`py-3 px-1 md:px-2 text-[10px] sm:text-[11px] md:text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-1 sm:gap-1.5 border-b-2 transition-all ${
              activeTab === 'camera'
                ? 'border-white text-white'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Camera className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">Kamera</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('drive')}
            className={`py-3 px-1 md:px-2 text-[10px] sm:text-[11px] md:text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-1 sm:gap-1.5 border-b-2 transition-all ${
              activeTab === 'drive'
                ? 'border-white text-white'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Cloud className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">Drive</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('about')}
            className={`py-3 px-1 md:px-2 text-[10px] sm:text-[11px] md:text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-1 sm:gap-1.5 border-b-2 transition-all ${
              activeTab === 'about'
                ? 'border-white text-white'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Info className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">About</span>
          </button>
        </div>

        {/* Tab Content */}
        <div
          className={`transition-all duration-150 ${
            activeSlider
              ? 'p-4 sm:p-6 overflow-visible'
              : 'flex-1 overflow-y-auto p-6 space-y-6'
          }`}
        >
          {activeTab === 'watermark' ? (
            <WatermarkTab
              watermark={watermark}
              onChangeWatermark={onChangeWatermark}
              profile={profile}
              onChangeProfile={onChangeProfile}
              activeSlider={activeSlider}
              setActiveSlider={setActiveSlider}
              onTriggerPreview={id => setActivePreviewInput(id)}
            />
          ) : activeTab === 'geotag' ? (
            <GeotagTab
              geotagConfig={geotagConfig}
              onChangeGeotagConfig={onChangeGeotagConfig}
              onTriggerPreview={id => setActivePreviewInput(id)}
            />
          ) : activeTab === 'camera' ? (
            <CameraTab
              sensorInfo={sensorInfo}
              cameraEffect={cameraEffect}
              onChangeCameraEffect={onChangeCameraEffect}
              cameraQualityConfig={cameraQualityConfig}
              onChangeCameraQualityConfig={onChangeCameraQualityConfig}
              activeSlider={activeSlider}
              setActiveSlider={setActiveSlider}
            />
          ) : activeTab === 'drive' ? (
            <GoogleDriveTab
              drive={drive}
              activeSlider={activeSlider}
            />
          ) : (
            <AboutTab />
          )}
        </div>

        {/* Footer */}
        <div
          className={`${
            activeSlider ? 'hidden' : 'flex'
          } p-4 pb-[max(1rem,env(safe-area-inset-bottom))] border-t border-zinc-800 bg-zinc-950 items-center justify-between gap-3 shrink-0 transition-opacity duration-150`}
        >
          {onResetSettings ? (
            <button
              type="button"
              onClick={onResetSettings}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-zinc-800 bg-zinc-900/60 hover:bg-zinc-800 text-zinc-400 hover:text-white font-medium text-xs transition-colors active:scale-95"
              title="Kembalikan semua setelan ke awal"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Default</span>
            </button>
          ) : <div />}

          <button
            type="button"
            onClick={onClose}
            className="w-full md:w-auto px-6 py-2.5 rounded-xl bg-white text-zinc-950 font-semibold text-sm hover:bg-zinc-200 transition-colors shadow-lg active:scale-95"
          >
            Selesai
          </button>
        </div>
      </div>
    </div>
  </>
)
}
