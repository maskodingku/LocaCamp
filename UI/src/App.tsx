import { useState, useCallback, useEffect } from 'react'
import { CameraViewport } from './components/camera/CameraViewport'
import { ShutterControls } from './components/camera/ShutterControls'
import { SettingsDrawer } from './components/settings/SettingsDrawer'
import { CaptureModal } from './components/preview/CaptureModal'
import { PhotoHistoryModal } from './components/history/PhotoHistoryModal'
import { useCamera } from './hooks/useCamera'
import { useGeolocation } from './hooks/useGeolocation'
import { useOrientation } from './hooks/useOrientation'
import { useModalHistory } from './hooks/useModalHistory'
import { captureAndComposite } from './utils/canvasComposite'
import { savePhotoToStorage, getPhotosCountFromStorage } from './utils/photoStorage'
import {
  loadStoredWatermark,
  saveStoredWatermark,
  loadStoredGeotag,
  saveStoredGeotag,
  clearStoredSettings,
  DEFAULT_WATERMARK_CONFIG,
  DEFAULT_GEOTAG_CONFIG,
} from './utils/storage'
import type {
  WatermarkConfig,
  GeotagDisplayConfig,
  CapturedPhoto,
} from './types/camera'

export default function App() {
  // UI Flow States (Modal, Drawer, Review, History)
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const [isHistoryOpen, setIsHistoryOpen] = useState(false)
  const [historyCount, setHistoryCount] = useState(0)
  const [isCapturing, setIsCapturing] = useState(false)
  const [currentPhoto, setCurrentPhoto] = useState<CapturedPhoto | null>(null)

  // Kamera & sensor optik hanya aktif saat berada di halaman foto (mati saat buka riwayat, review foto, atau settings)
  const isCameraActive = !isHistoryOpen && !currentPhoto && !isSettingsOpen

  // Hardware & Sensor Hooks
  const camera = useCamera({ enabled: isCameraActive })
  const location = useGeolocation()
  const orientation = useOrientation()

  // Integrasi tombol Back fisik/gesture ponsel agar menutup modal secara bertingkat
  useModalHistory('drawer-settings', isSettingsOpen, () => setIsSettingsOpen(false))
  useModalHistory('modal-capture', Boolean(currentPhoto), () => setCurrentPhoto(null))
  useModalHistory('modal-history', isHistoryOpen, () => setIsHistoryOpen(false))

  // Watermark Configuration State (dimuat dari localStorage saat start)
  const [watermark, setWatermark] = useState<WatermarkConfig>(() => loadStoredWatermark())

  // Geotag Overlay Configuration State (dimuat dari localStorage saat start)
  const [geotagConfig, setGeotagConfig] = useState<GeotagDisplayConfig>(() => loadStoredGeotag())

  // Simpan otomatis ke localStorage setiap kali ada perubahan konfigurasi
  useEffect(() => {
    saveStoredWatermark(watermark)
  }, [watermark])

  useEffect(() => {
    saveStoredGeotag(geotagConfig)
  }, [geotagConfig])

  // Muat jumlah riwayat foto di IndexedDB
  const refreshHistoryCount = useCallback(async () => {
    const count = await getPhotosCountFromStorage()
    setHistoryCount(count)
  }, [])

  useEffect(() => {
    refreshHistoryCount()
  }, [refreshHistoryCount])

  // Reset semua pengaturan ke setelan awal pabrikan
  const handleResetSettings = useCallback(() => {
    clearStoredSettings()
    setWatermark(DEFAULT_WATERMARK_CONFIG)
    setGeotagConfig(DEFAULT_GEOTAG_CONFIG)
  }, [])

  // Capture Trigger: Jepret foto, komposit canvas, dan simpan otomatis ke IndexedDB visitor
  const handleCapture = useCallback(async () => {
    if (!camera.videoRef.current || !camera.isStreaming || isCapturing) return

    setIsCapturing(true)
    try {
      const dataUrl = await captureAndComposite({
        video: camera.videoRef.current,
        watermark,
        location,
        displayConfig: geotagConfig,
        mirror: camera.facingMode === 'user',
        rotationAngle: orientation.rotationAngle,
      })

      const newPhoto: CapturedPhoto = {
        id: `photo_${Date.now()}`,
        dataUrl,
        timestamp: new Date(),
        location,
        width: camera.videoRef.current.videoWidth || 1920,
        height: camera.videoRef.current.videoHeight || 1080,
      }

      // Simpan permanen ke IndexedDB lokal perangkat pengguna
      await savePhotoToStorage(newPhoto)
      refreshHistoryCount()

      setCurrentPhoto(newPhoto)
    } catch (err) {
      console.error('Gagal mengambil foto komposit:', err)
    } finally {
      setIsCapturing(false)
    }
  }, [camera, watermark, location, geotagConfig, isCapturing, orientation.rotationAngle, refreshHistoryCount])

  return (
    <main className="relative w-full h-[100dvh] bg-black text-white flex flex-col items-center justify-between overflow-hidden">
      {/* Viewport Container (Adaptive desktop/mobile frame) */}
      <div
        className={`relative w-full h-full ${
          orientation.isLandscape
            ? 'flex flex-row md:max-w-5xl md:max-h-[88dvh]'
            : 'flex flex-col md:max-w-2xl md:max-h-[92dvh]'
        } md:my-auto md:rounded-3xl md:border md:border-zinc-800 md:shadow-2xl overflow-hidden bg-black transition-all`}
      >
        {/* Live Camera Viewport */}
        <div className="relative flex-1 w-full h-full overflow-hidden">
          <CameraViewport
            videoRef={camera.videoRef}
            isStreaming={camera.isStreaming}
            isLoading={camera.isLoading}
            error={camera.error}
            facingMode={camera.facingMode}
            hasMultipleCameras={camera.hasMultipleCameras}
            supportsTorch={camera.supportsTorch}
            isTorchOn={camera.isTorchOn}
            onSwitchCamera={camera.switchCamera}
            onToggleTorch={camera.toggleTorch}
            onRestartCamera={camera.restartCamera}
            onOpenSettings={() => setIsSettingsOpen(true)}
            onRefreshLocation={location.refreshLocation}
            location={location}
            geotagConfig={geotagConfig}
            watermark={watermark}
            isLandscape={orientation.isLandscape}
          />
        </div>

        {/* Shutter and Quick Controls: Di KANAN saat Landscape, di BAWAH saat Portrait */}
        <div className={orientation.isLandscape ? 'h-full shrink-0' : 'w-full shrink-0'}>
          <ShutterControls
            onCapture={handleCapture}
            isCapturing={isCapturing}
            isReady={camera.isStreaming}
            onOpenSettings={() => setIsSettingsOpen(true)}
            onOpenHistory={() => setIsHistoryOpen(true)}
            historyCount={historyCount}
            isLandscape={orientation.isLandscape}
            rotationAngle={orientation.rotationAngle}
          />
        </div>
      </div>

      {/* Settings Drawer dengan fitur Auto-Save & Reset */}
      <SettingsDrawer
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        watermark={watermark}
        onChangeWatermark={setWatermark}
        geotagConfig={geotagConfig}
        onChangeGeotagConfig={setGeotagConfig}
        onResetSettings={handleResetSettings}
      />

      {/* Capture Review & Download Modal */}
      <CaptureModal
        photo={currentPhoto}
        onClose={() => setCurrentPhoto(null)}
        onRetake={() => setCurrentPhoto(null)}
        isLandscape={orientation.isLandscape}
      />

      {/* Photo History Gallery Modal (Client-side IndexedDB) */}
      <PhotoHistoryModal
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        onPhotosUpdated={refreshHistoryCount}
      />
    </main>
  )
}
