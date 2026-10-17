import React, { useState, useEffect, useCallback } from 'react'
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
import { CyberGlassOrb } from './CyberGlassOrb'

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

const TABS = [
  { id: 'watermark', label: 'BASIC', icon: Sparkles },
  { id: 'geotag', label: 'GEOTAG', icon: MapPin },
  { id: 'camera', label: 'KAMERA', icon: Camera },
  { id: 'drive', label: 'DRIVE', icon: Cloud },
  { id: 'about', label: 'ABOUT', icon: Info },
] as const

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

  // Handler terpadu untuk set active slider sekaligus sinkronisasi mode preview seketika
  const handleSetActiveSlider = useCallback((id: string | null) => {
    setActiveSlider(id)
    onPreviewModeChange?.(Boolean(activePreviewInput || id))
  }, [activePreviewInput, onPreviewModeChange])

  // Notifikasi perubahan mode preview ke parent (App.tsx)
  useEffect(() => {
    onPreviewModeChange?.(Boolean(activePreviewInput || activeSlider))
  }, [activePreviewInput, activeSlider, onPreviewModeChange])

  // Reset mode preview jika modal pengaturan ditutup
  useEffect(() => {
    if (!isOpen) {
      setActivePreviewInput(null)
      setActiveSlider(null)
      onPreviewModeChange?.(false)
    }
  }, [isOpen, onPreviewModeChange])

  // Listener tombol Escape keyboard untuk menutup mode preview atau slider mengambang
  useEffect(() => {
    if (!activePreviewInput && !activeSlider) return
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setActivePreviewInput(null)
        setActiveSlider(null)
        onPreviewModeChange?.(false)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [activePreviewInput, activeSlider, onPreviewModeChange])

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

      {/* Backdrop Gelap dengan Blur */}
      <div
        className={`fixed inset-0 flex items-stretch sm:items-center justify-center p-0 sm:p-4 transition-all duration-200 ${
          activePreviewInput
            ? 'bg-transparent pointer-events-none z-0 hidden'
            : activeSlider
              ? 'bg-black/25 backdrop-blur-none pointer-events-auto z-[100]'
              : 'bg-black/80 backdrop-blur-md animate-in fade-in z-50'
        }`}
        onClick={() => {
          if (activeSlider) {
            handleSetActiveSlider(null)
          }
        }}
      >
        {/* Main Modal Cyber Glassmorphism Container */}
        <div
          className={`w-full sm:max-w-xl h-full sm:h-auto sm:max-h-[92vh] rounded-none sm:rounded-[34px] flex flex-col text-white transition-all duration-200 relative overflow-hidden ${
            activeSlider
              ? 'opacity-0 pointer-events-none invisible'
              : 'border-0 sm:border border-white/20 sm:border-cyan-400/40 shadow-none sm:shadow-[0_25px_60px_rgba(0,0,0,0.85),inset_0_2px_3px_rgba(255,255,255,0.85),inset_0_-1px_2px_rgba(0,0,0,0.5)]'
          }`}
          style={
            activeSlider
              ? undefined
              : {
                background:
                  'linear-gradient(180deg, rgba(3, 20, 36, 0.72) 0%, rgba(2, 11, 20, 0.65) 50%, rgba(1, 6, 10, 0.78) 100%)',
                backdropFilter: 'blur(32px)',
                WebkitBackdropFilter: 'blur(32px)',
              }
          }
          onClick={e => e.stopPropagation()}
        >
          {/* Header Bar */}
          <div
            className={`items-center justify-between px-3 sm:px-6 pt-[max(0.75rem,env(safe-area-inset-top))] sm:pt-4 pb-2.5 shrink-0 transition-opacity duration-150 relative z-20 ${
              activeSlider ? 'hidden' : 'flex'
            }`}
          >
            {/* Kiri: Glass Bubble Orb Icon + Divider + Judul Teks Dua Nada dengan Aura Blur Kontekstual */}
            <div className="flex items-center gap-2.5 min-w-0 flex-1 mr-2">
              <CyberGlassOrb icon={Sliders} size="md" variant="cyan" />

              {/* Pembatas Garis Vertikal */}
              <div className="h-4.5 w-[1.5px] bg-cyan-400/40 shrink-0" />

              {/* Teks Judul Dua Nada dengan Aura Warna Kontekstual */}
              <div className="flex items-center gap-1.5 min-w-0">
                <span className="text-slate-100 text-sm sm:text-base font-bold tracking-wide drop-shadow-[0_1px_2px_rgba(0,0,0,0.95)] drop-shadow-[0_0_8px_rgba(255,255,255,0.35)]">
                  Pengaturan
                </span>
                <span className="text-white text-sm sm:text-base font-black tracking-wide truncate drop-shadow-[0_1px_3px_rgba(0,0,0,0.95)] drop-shadow-[0_0_8px_rgba(34,211,238,0.7)]">
                  Foto &amp; Tampilan
                </span>
              </div>
            </div>

            {/* Tombol Tutup Mandiri [ ✕ ] Bulat Merah Glossy Persis LivePreviewDock */}
            <button
              type="button"
              onClick={onClose}
              className="w-8.5 h-8.5 sm:w-9 sm:h-9 rounded-full bg-gradient-to-b from-[#3d0818]/95 to-[#160208]/95 border border-rose-400 shadow-[0_4px_12px_rgba(0,0,0,0.6),inset_0_1.5px_2px_rgba(255,255,255,0.85)] flex items-center justify-center cursor-pointer active:scale-90 transition-all shrink-0 relative overflow-hidden group"
              title="Tutup Pengaturan"
            >
              <div className="absolute top-0.5 inset-x-2 h-2 rounded-full bg-white/50 blur-[0.2px] pointer-events-none" />
              <X className="w-4.5 h-4.5 sm:w-5 sm:h-5 text-rose-100 stroke-[3] group-hover:rotate-90 transition-transform duration-200 drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)] drop-shadow-[0_0_5px_rgba(244,63,94,0.75)]" />
            </button>
          </div>

          {/* Tab Navigation Bar (Cyber Glass Capsules) */}
          <div
            className={`px-2 sm:px-5 shrink-0 transition-opacity duration-150 relative z-20 ${
              activeSlider ? 'hidden' : 'block'
            }`}
          >
            <div className="p-1 sm:p-1.5 rounded-full bg-[#020717]/65 border border-white/20 backdrop-blur-2xl shadow-[0_8px_20px_rgba(0,0,0,0.5),inset_0_1.5px_2px_rgba(255,255,255,0.75)] flex items-center justify-between gap-1 sm:gap-1.5 overflow-x-auto no-scrollbar relative">
              {TABS.map(tab => {
                const active = activeTab === tab.id
                const Icon = tab.icon
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex-1 py-1.5 sm:py-2 px-1.5 sm:px-3 rounded-full text-[10.5px] sm:text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1 sm:gap-1.5 transition-all relative overflow-hidden ${
                      active
                        ? 'bg-gradient-to-r from-cyan-400 via-sky-400 to-blue-500 text-black font-black border border-white/90 shadow-[0_4px_12px_rgba(0,0,0,0.5),inset_0_1.5px_2px_rgba(255,255,255,0.95)]'
                        : 'text-slate-100 font-bold hover:text-white hover:bg-white/10'
                    }`}
                  >
                    {active && (
                      <div className="absolute top-0.5 inset-x-2 h-1 rounded-full bg-white/60 blur-[0.2px] pointer-events-none" />
                    )}
                    <Icon className={`w-3.5 h-3.5 shrink-0 ${active ? 'text-black drop-shadow-[0_1px_1px_rgba(255,255,255,0.6)]' : 'text-cyan-300 drop-shadow-[0_0_5px_rgba(34,211,238,0.6)]'}`} />
                    <span className={`truncate ${active ? 'drop-shadow-[0_1px_1px_rgba(255,255,255,0.6)]' : 'drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)]'}`}>{tab.label}</span>
                  </button>
                )
              })}
            </div>

            {/* Crisp Glass Hairline Separator */}
            <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-cyan-200/35 to-transparent mt-2.5 mb-1" />
          </div>

          {/* Inner Content Viewport Area */}
          <div
            className="relative flex-1 mx-0 sm:mx-4 mb-1 sm:mb-3 overflow-hidden flex flex-col z-10"
          >
            {/* Scrollable Tab Content Container */}
            <div
              className={`relative z-10 flex-1 overflow-y-auto px-1 sm:px-4 py-2.5 sm:py-3 space-y-3.5 sm:space-y-4 no-scrollbar overscroll-contain [transform:translateZ(0)] [contain:content] [-webkit-overflow-scrolling:touch] ${
                activeSlider ? 'p-0 overflow-visible' : ''
              }`}
            >
              {activeTab === 'watermark' ? (
                <WatermarkTab
                  watermark={watermark}
                  onChangeWatermark={onChangeWatermark}
                  profile={profile}
                  onChangeProfile={onChangeProfile}
                  activeSlider={activeSlider}
                  setActiveSlider={handleSetActiveSlider}
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
                  setActiveSlider={handleSetActiveSlider}
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

            {/* Footer Bar */}
            <div
              className={`${
                activeSlider ? 'hidden' : 'flex'
              } p-3 sm:p-3.5 pb-[max(0.75rem,env(safe-area-inset-bottom))] sm:pb-3.5 border-t border-white/15 bg-[#020717]/65 backdrop-blur-2xl items-center justify-between gap-3 shrink-0 relative z-20`}
            >
              {onResetSettings ? (
                <button
                  type="button"
                  onClick={onResetSettings}
                  className="flex items-center gap-2 px-4 py-2 rounded-full border border-white/20 bg-gradient-to-r from-[#03152e]/90 via-[#062854]/80 to-[#03152e]/90 hover:from-[#052247]/95 hover:to-[#052247]/95 text-slate-100 hover:text-white font-bold text-xs shadow-[0_4px_12px_rgba(0,0,0,0.4),inset_0_1px_1.5px_rgba(255,255,255,0.8)] transition-all active:scale-95 cursor-pointer relative overflow-hidden"
                  title="Kembalikan semua setelan ke awal"
                >
                  <div className="absolute top-0 inset-x-2 h-[1px] bg-gradient-to-r from-transparent via-cyan-100/70 to-transparent pointer-events-none" />
                  <RotateCcw className="w-3.5 h-3.5 text-cyan-300 drop-shadow-[0_0_5px_rgba(34,211,238,0.65)]" />
                  <span className="drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)]">Reset Default</span>
                </button>
              ) : (
                <div />
              )}

              <button
                type="button"
                onClick={onClose}
                className="px-7 py-2.5 rounded-full bg-gradient-to-r from-cyan-400 via-sky-300 to-teal-400 text-black font-black text-xs sm:text-sm tracking-wide border border-white/90 shadow-[0_4px_14px_rgba(0,0,0,0.5),inset_0_1.5px_2px_rgba(255,255,255,0.95)] hover:brightness-110 active:scale-95 transition-all cursor-pointer relative overflow-hidden"
              >
                <div className="absolute top-0 inset-x-3 h-[1px] bg-gradient-to-r from-transparent via-white to-transparent pointer-events-none" />
                <span className="drop-shadow-[0_1px_1px_rgba(255,255,255,0.7)]">Selesai</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
