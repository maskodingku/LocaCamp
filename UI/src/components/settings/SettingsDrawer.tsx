import React, { useState, useEffect } from 'react'
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
import { CyberGlassBubbles } from './CyberGlassBubbles'
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

      {/* Backdrop Gelap dengan Blur */}
      <div
        className={`fixed inset-0 flex items-stretch sm:items-center justify-center p-0 sm:p-4 transition-all duration-200 ${
          activePreviewInput
            ? 'bg-transparent pointer-events-none z-0 hidden'
            : activeSlider
              ? 'bg-black/25 backdrop-blur-none pointer-events-auto z-[100]'
              : 'bg-black/80 backdrop-blur-md animate-in fade-in z-50'
        }`}
      >
        {/* Main Modal Cyber Glassmorphism Container */}
        <div
          className={`w-full sm:max-w-xl h-full sm:h-auto sm:max-h-[92vh] rounded-none sm:rounded-[34px] flex flex-col text-white transition-all duration-200 relative overflow-hidden ${
            activeSlider
              ? 'bg-transparent border-transparent shadow-none overflow-visible'
              : 'border-0 sm:border-2 border-cyan-400 shadow-none sm:shadow-[0_0_28px_rgba(6,182,212,0.65),inset_0_0_16px_rgba(6,182,212,0.25)]'
          }`}
          style={
            activeSlider
              ? undefined
              : {
                background: 'radial-gradient(ellipse at 50% 0%, #031424 0%, #020b14 55%, #01060a 100%)',
              }
          }
          onClick={e => e.stopPropagation()}
        >
          {/* Specular Glare Highlight Border Atas Kaca */}
          <div className="pointer-events-none absolute top-0 left-8 right-8 h-[1px] bg-gradient-to-r from-transparent via-cyan-100/90 to-transparent z-20" />

          {/* Optic Lens Flare Glow Spots di Pinggiran Frame */}
          <div className="pointer-events-none absolute top-1.5 left-5 w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_6px_#fff,0_0_14px_#22d3ee] z-20" />
          <div className="pointer-events-none absolute top-1.5 right-5 w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_6px_#fff,0_0_14px_#22d3ee] z-20" />

          {/* Floating 3D Cyber Glass Bubbles (Mengambang nyata di seluruh latar belakang modal) */}
          {!activeSlider && <CyberGlassBubbles />}

          {/* Header Bar */}
          <div
            className={`items-center justify-between px-3 sm:px-6 pt-[max(0.75rem,env(safe-area-inset-top))] sm:pt-4 pb-2.5 shrink-0 transition-opacity duration-150 relative z-20 ${
              activeSlider ? 'hidden' : 'flex'
            }`}
          >
            {/* Kiri: Glass Bubble Orb Icon + Divider + Judul Teks Dua Nada */}
            <div className="flex items-center gap-2.5 min-w-0 flex-1 mr-2">
              <CyberGlassOrb icon={Sliders} size="md" variant="cyan" />

              {/* Pembatas Garis Vertikal */}
              <div className="h-4.5 w-[1.5px] bg-cyan-400/40 shrink-0" />

              {/* Teks Judul Dua Nada Bersih & Tegas */}
              <div className="flex items-center gap-1.5 min-w-0">
                <span className="text-slate-200 text-sm sm:text-base font-medium tracking-wide">
                  Pengaturan
                </span>
                <span className="text-white text-sm sm:text-base font-extrabold tracking-wide truncate drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)]">
                  Foto &amp; Tampilan
                </span>
              </div>
            </div>

            {/* Tombol Tutup Mandiri [ ✕ ] Bulat Merah Glossy Persis LivePreviewDock */}
            <button
              type="button"
              onClick={onClose}
              className="w-8.5 h-8.5 sm:w-9 sm:h-9 rounded-full bg-gradient-to-b from-[#3d0818]/95 to-[#160208]/95 border-2 border-rose-500 shadow-[0_0_18px_rgba(244,63,94,0.85),inset_0_1.5px_2.5px_rgba(255,255,255,0.8),inset_0_-1.5px_3px_rgba(0,0,0,0.8)] flex items-center justify-center cursor-pointer active:scale-90 transition-all shrink-0 relative overflow-hidden group"
              title="Tutup Pengaturan"
            >
              <div className="absolute top-0.5 inset-x-2 h-2 rounded-full bg-white/45 blur-[0.5px] pointer-events-none" />
              <X className="w-4.5 h-4.5 sm:w-5 sm:h-5 text-rose-200 stroke-[3] group-hover:rotate-90 transition-transform duration-200 drop-shadow-[0_0_8px_rgba(244,63,94,1)]" />
            </button>
          </div>

          {/* Tab Navigation Bar (Cyber Glass Capsules) */}
          <div
            className={`px-2 sm:px-5 shrink-0 transition-opacity duration-150 relative z-20 ${
              activeSlider ? 'hidden' : 'block'
            }`}
          >
            <div className="p-1 sm:p-1.5 rounded-full bg-[#020717]/85 border border-cyan-400/50 backdrop-blur-2xl shadow-[0_0_20px_rgba(6,182,212,0.25),inset_0_1.5px_2px_rgba(255,255,255,0.65)] flex items-center justify-between gap-1 sm:gap-1.5 overflow-x-auto no-scrollbar relative">
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
                        ? 'bg-gradient-to-r from-cyan-400 via-sky-400 to-blue-500 text-[#020b18] font-black border border-cyan-200/90 shadow-[0_0_14px_rgba(6,182,212,0.85),inset_0_1.5px_2px_rgba(255,255,255,0.95)]'
                        : 'text-slate-300 hover:text-white hover:bg-cyan-900/30'
                    }`}
                  >
                    {active && (
                      <div className="absolute top-0.5 inset-x-2 h-1 rounded-full bg-white/45 blur-[0.5px] pointer-events-none" />
                    )}
                    <Icon className={`w-3.5 h-3.5 shrink-0 ${active ? 'text-[#020b18]' : 'text-cyan-400'}`} />
                    <span className="truncate">{tab.label}</span>
                  </button>
                )
              })}
            </div>

            {/* Glowing Neon Separator Line */}
            <div className="w-full h-[1.5px] bg-gradient-to-r from-transparent via-cyan-400/80 to-transparent shadow-[0_0_8px_rgba(34,211,238,0.8)] mt-2.5 mb-1" />
          </div>

          {/* Inner Content Viewport Area */}
          <div
            className={`relative flex-1 mx-0 sm:mx-4 mb-1 sm:mb-3 overflow-hidden flex flex-col transition-all duration-150 z-10`}
          >
            {/* Scrollable Tab Content Container */}
            <div
              className={`relative z-10 flex-1 overflow-y-auto px-1 sm:px-4 py-2.5 sm:py-3 space-y-3.5 sm:space-y-4 no-scrollbar transition-all duration-150 ${
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

            {/* Footer Bar */}
            <div
              className={`${
                activeSlider ? 'hidden' : 'flex'
              } p-3 sm:p-3.5 pb-[max(0.75rem,env(safe-area-inset-bottom))] sm:pb-3.5 border-t border-cyan-500/20 bg-[#020717]/90 backdrop-blur-2xl items-center justify-between gap-3 shrink-0 relative z-20`}
            >
              {onResetSettings ? (
                <button
                  type="button"
                  onClick={onResetSettings}
                  className="flex items-center gap-2 px-4 py-2 rounded-full border border-cyan-500/40 bg-gradient-to-r from-[#03152e]/90 via-[#062854]/80 to-[#03152e]/90 hover:from-[#052247]/95 hover:to-[#052247]/95 text-cyan-300 hover:text-white font-semibold text-xs shadow-[inset_0_1px_1px_rgba(255,255,255,0.4),0_0_12px_rgba(6,182,212,0.25)] transition-all active:scale-95 cursor-pointer relative overflow-hidden"
                  title="Kembalikan semua setelan ke awal"
                >
                  <div className="absolute top-0 inset-x-2 h-[1px] bg-white/40 pointer-events-none" />
                  <RotateCcw className="w-3.5 h-3.5 text-cyan-400 drop-shadow-[0_0_4px_rgba(34,211,238,0.8)]" />
                  <span>Reset Default</span>
                </button>
              ) : (
                <div />
              )}

              <button
                type="button"
                onClick={onClose}
                className="px-7 py-2.5 rounded-full bg-gradient-to-r from-cyan-400 via-cyan-300 to-teal-400 text-zinc-950 font-black text-xs sm:text-sm tracking-wide shadow-[0_0_20px_rgba(34,211,238,0.85),inset_0_1.5px_2px_rgba(255,255,255,0.8)] hover:brightness-110 active:scale-95 transition-all cursor-pointer relative overflow-hidden"
              >
                <div className="absolute top-0 inset-x-3 h-[1px] bg-white/90 pointer-events-none" />
                Selesai
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
