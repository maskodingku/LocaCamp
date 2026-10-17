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
import { CyberGlassBackground } from './CyberGlassBackground'

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
        className={`fixed inset-0 flex items-center justify-center p-2 sm:p-4 transition-all duration-200 ${
          activePreviewInput
            ? 'bg-transparent pointer-events-none z-0 hidden'
            : activeSlider
            ? 'bg-black/25 backdrop-blur-none pointer-events-auto z-[100]'
            : 'bg-black/80 backdrop-blur-md animate-in fade-in z-50'
        }`}
      >
        {/* Main Modal Cyber Glassmorphism Container */}
        <div
          className={`w-full max-w-xl max-h-[96vh] sm:max-h-[92vh] rounded-[28px] sm:rounded-[34px] flex flex-col text-white transition-all duration-200 relative overflow-hidden ${
            activeSlider
              ? 'bg-transparent border-transparent shadow-none overflow-visible'
              : 'border-2 border-cyan-400 shadow-[0_0_28px_rgba(6,182,212,0.65),inset_0_0_16px_rgba(6,182,212,0.25)]'
          }`}
          style={
            activeSlider
              ? undefined
              : {
                  background: 'radial-gradient(ellipse at 50% 0%, #073549 0%, #031c26 45%, #010d14 100%)',
                }
          }
          onClick={e => e.stopPropagation()}
        >
          {/* Ambient Lighting Orbs di Bagian Atas */}
          <div className="pointer-events-none absolute -top-12 -left-12 w-36 h-36 bg-cyan-500/20 rounded-full blur-3xl z-0" />
          <div className="pointer-events-none absolute -top-12 -right-12 w-36 h-36 bg-rose-500/15 rounded-full blur-3xl z-0" />

          {/* Header Bar */}
          <div
            className={`items-center justify-between px-4 sm:px-6 pt-3.5 sm:pt-4 pb-2.5 shrink-0 transition-opacity duration-150 relative z-20 ${
              activeSlider ? 'hidden' : 'flex'
            }`}
          >
            {/* Equalizer/Sliders Neon Icon + Judul */}
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 flex items-center justify-center text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.9)] shrink-0">
                <Sliders className="w-6 h-6 stroke-[2.2]" />
              </div>
              <h2 className="text-base sm:text-lg font-bold text-white tracking-wide drop-shadow-sm truncate">
                Pengaturan Foto &amp; Tampilan
              </h2>
            </div>

            {/* Glowing Red/Rose Circular Close Orb */}
            <button
              type="button"
              onClick={onClose}
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center border-2 border-rose-500/80 text-rose-100 hover:text-white transition-all duration-150 hover:scale-105 active:scale-95 cursor-pointer shadow-[0_0_16px_rgba(244,63,94,0.75),inset_0_0_10px_rgba(244,63,94,0.45)] shrink-0 ml-2"
              style={{
                background: 'radial-gradient(circle at 35% 35%, #881337 0%, #4c0519 65%, #1f0208 100%)',
              }}
              title="Tutup Pengaturan"
            >
              <X className="w-5 h-5 font-extrabold stroke-[2.5]" />
            </button>
          </div>

          {/* Tab Navigation Bar (Pill Capsules) */}
          <div
            className={`px-3 sm:px-5 shrink-0 transition-opacity duration-150 relative z-20 ${
              activeSlider ? 'hidden' : 'block'
            }`}
          >
            <div className="p-1 sm:p-1.5 rounded-2xl bg-black/45 border border-cyan-950/80 backdrop-blur-md flex items-center justify-between gap-1 sm:gap-1.5 overflow-x-auto no-scrollbar">
              {TABS.map(tab => {
                const active = activeTab === tab.id
                const Icon = tab.icon
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex-1 py-1.5 sm:py-2 px-1.5 sm:px-3 rounded-xl text-[10px] sm:text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1 sm:gap-1.5 transition-all relative ${
                      active
                        ? 'bg-gradient-to-r from-cyan-400 via-cyan-300 to-cyan-400 text-zinc-950 font-black shadow-[0_0_16px_rgba(34,211,238,0.85)] border border-cyan-100/80'
                        : 'bg-[#052230]/60 hover:bg-[#083344]/80 text-cyan-200/80 hover:text-cyan-100 border border-cyan-800/40 hover:border-cyan-500/50'
                    }`}
                  >
                    <Icon className={`w-3.5 h-3.5 shrink-0 ${active ? 'text-zinc-950' : 'text-cyan-400'}`} />
                    <span className="truncate">{tab.label}</span>
                  </button>
                )
              })}
            </div>

            {/* Glowing Neon Separator Line */}
            <div className="w-full h-[2px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_8px_rgba(34,211,238,0.9)] mt-2.5 mb-2" />
          </div>

          {/* Inner Content Viewport Area */}
          <div
            className={`relative flex-1 mx-2 sm:mx-4 mb-2 sm:mb-3 overflow-hidden flex flex-col transition-all duration-150`}
          >
            {/* Cyber Liquid Glass Background with 3D Bubbles */}
            {!activeSlider && <CyberGlassBackground />}

            {/* Scrollable Tab Content Container */}
            <div
              className={`relative z-10 flex-1 overflow-y-auto p-3 sm:p-5 space-y-4 scrollbar-thin scrollbar-thumb-cyan-500/40 scrollbar-track-transparent transition-all duration-150 ${
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
              } p-3 sm:p-3.5 border-t border-cyan-900/50 bg-[#020e17]/85 backdrop-blur-md items-center justify-between gap-3 shrink-0 relative z-20`}
            >
              {onResetSettings ? (
                <button
                  type="button"
                  onClick={onResetSettings}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-cyan-900/60 bg-cyan-950/40 hover:bg-cyan-900/60 text-cyan-300 hover:text-cyan-100 font-medium text-xs transition-colors active:scale-95 cursor-pointer shadow-sm"
                  title="Kembalikan semua setelan ke awal"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Reset Default</span>
                </button>
              ) : (
                <div />
              )}

              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2 rounded-xl bg-gradient-to-r from-cyan-400 via-cyan-300 to-teal-400 text-zinc-950 font-black text-xs sm:text-sm tracking-wide hover:brightness-110 transition-all shadow-[0_0_16px_rgba(34,211,238,0.7)] active:scale-95 cursor-pointer"
              >
                Selesai
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
