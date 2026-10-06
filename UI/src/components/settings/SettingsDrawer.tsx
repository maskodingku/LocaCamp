import { useState, useEffect } from 'react'
import {
  X,
  Sparkles,
  Sliders,
  MapPin,
  Camera,
  Info,
  RotateCcw,
} from 'lucide-react'
import type {
  WatermarkConfig,
  GeotagDisplayConfig,
  CameraQualityConfig,
  SensorCapabilitiesInfo,
  CameraEffectConfig,
} from '../../types/camera'
import { WatermarkTab } from './WatermarkTab'
import { GeotagTab } from './GeotagTab'
import { CameraTab } from './CameraTab'
import { AboutTab } from './AboutTab'

interface SettingsDrawerProps {
  isOpen: boolean
  onClose: () => void
  watermark: WatermarkConfig
  onChangeWatermark: (cfg: WatermarkConfig) => void
  geotagConfig: GeotagDisplayConfig
  onChangeGeotagConfig: (cfg: GeotagDisplayConfig) => void
  cameraQualityConfig: CameraQualityConfig
  onChangeCameraQualityConfig: (cfg: CameraQualityConfig) => void
  cameraEffect: CameraEffectConfig
  onChangeCameraEffect: (cfg: CameraEffectConfig) => void
  sensorInfo?: SensorCapabilitiesInfo | null
  onResetSettings?: () => void
}

export const SettingsDrawer: React.FC<SettingsDrawerProps> = ({
  isOpen,
  onClose,
  watermark,
  onChangeWatermark,
  geotagConfig,
  onChangeGeotagConfig,
  cameraQualityConfig,
  onChangeCameraQualityConfig,
  cameraEffect,
  onChangeCameraEffect,
  sensorInfo,
  onResetSettings,
}) => {
  const [activeTab, setActiveTab] = useState<'watermark' | 'geotag' | 'camera' | 'about'>('watermark')
  const [activeSlider, setActiveSlider] = useState<string | null>(null)

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
    <div
      className={`fixed inset-0 flex items-end md:items-center justify-center transition-all duration-200 ${
        activeSlider
          ? 'bg-transparent backdrop-blur-none pointer-events-auto z-[100]'
          : 'bg-black/70 backdrop-blur-md animate-in fade-in z-50'
      }`}
    >
      <div
        className={`w-full md:max-w-xl max-h-[88vh] md:max-h-[85vh] rounded-t-3xl md:rounded-3xl flex flex-col text-white transition-all duration-200 ${
          activeSlider
            ? 'bg-transparent border-transparent shadow-none overflow-visible'
            : 'bg-zinc-950 border border-zinc-800 shadow-2xl overflow-hidden animate-in slide-in-from-bottom-6 duration-200'
        }`}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div
          className={`flex items-center justify-between px-6 py-4 border-b border-zinc-800 transition-opacity duration-150 ${
            activeSlider ? 'opacity-0 pointer-events-none' : 'opacity-100'
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
          className={`grid grid-cols-4 border-b border-zinc-800 px-1 md:px-6 bg-zinc-900/50 transition-opacity duration-150 ${
            activeSlider ? 'opacity-0 pointer-events-none' : 'opacity-100'
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
            <span className="truncate">Logo</span>
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
        <div className={`flex-1 overflow-y-auto p-6 space-y-6 ${activeSlider ? 'pb-36 sm:pb-28' : ''}`}>
          {activeTab === 'watermark' ? (
            <WatermarkTab
              watermark={watermark}
              onChangeWatermark={onChangeWatermark}
              activeSlider={activeSlider}
              setActiveSlider={setActiveSlider}
            />
          ) : activeTab === 'geotag' ? (
            <GeotagTab
              geotagConfig={geotagConfig}
              onChangeGeotagConfig={onChangeGeotagConfig}
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
          ) : (
            <AboutTab />
          )}
        </div>

        {/* Footer */}
        <div
          className={`${
            activeSlider ? 'hidden' : 'flex'
          } p-4 border-t border-zinc-800 bg-zinc-950 items-center justify-between gap-3 transition-opacity duration-150`}
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
  )
}
