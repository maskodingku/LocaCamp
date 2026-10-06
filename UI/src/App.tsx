import { useState, useCallback, useEffect } from 'react'
import { CameraViewport } from './components/camera/CameraViewport'
import { ShutterControls } from './components/camera/ShutterControls'
import { LivePresetBar } from './components/camera/LivePresetBar'
import { SettingsDrawer } from './components/settings/SettingsDrawer'
import { CaptureModal } from './components/preview/CaptureModal'
import { PhotoHistoryModal } from './components/history/PhotoHistoryModal'
import { useCamera } from './hooks/useCamera'
import { useGeolocation } from './hooks/useGeolocation'
import { useOrientation } from './hooks/useOrientation'
import { useModalHistory } from './hooks/useModalHistory'
import { useGoogleDrive } from './hooks/useGoogleDrive'
import { captureAndComposite } from './utils/canvasComposite'
import { savePhotoToStorage, getPhotosCountFromStorage } from './utils/photoStorage'
import {
  loadStoredWatermark,
  saveStoredWatermark,
  loadStoredGeotag,
  saveStoredGeotag,
  loadStoredCameraQuality,
  saveStoredCameraQuality,
  loadStoredCameraEffect,
  saveStoredCameraEffect,
  clearStoredSettings,
  DEFAULT_WATERMARK_CONFIG,
  DEFAULT_GEOTAG_CONFIG,
  DEFAULT_CAMERA_QUALITY_CONFIG,
  DEFAULT_CAMERA_EFFECT_CONFIG,
} from './utils/storage'
import type {
  WatermarkConfig,
  GeotagDisplayConfig,
  CameraQualityConfig,
  CameraEffectConfig,
  CapturedPhoto,
} from './types/camera'

export default function App() {
  // Google Drive Cloud Storage Hook
  const drive = useGoogleDrive()

  // UI Flow States (Modal, Drawer, Review, History, Quick Presets)
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const [isHistoryOpen, setIsHistoryOpen] = useState(false)
  const [isPresetBarOpen, setIsPresetBarOpen] = useState(false)
  const [historyCount, setHistoryCount] = useState(0)
  const [isCapturing, setIsCapturing] = useState(false)
  const [currentPhoto, setCurrentPhoto] = useState<CapturedPhoto | null>(null)

  // Kamera & sensor optik tetap aktif saat pengaturan terbuka (agar slider live preview WYSIWYG bekerja langsung)
  // Hanya mati saat membuka galeri riwayat foto atau saat mereview hasil jepretan
  const isCameraActive = !isHistoryOpen && !currentPhoto

  // Watermark Configuration State (dimuat dari localStorage saat start)
  const [watermark, setWatermark] = useState<WatermarkConfig>(() => loadStoredWatermark())

  // Geotag Overlay Configuration State (dimuat dari localStorage saat start)
  const [geotagConfig, setGeotagConfig] = useState<GeotagDisplayConfig>(() => loadStoredGeotag())

  // Camera Quality Configuration State (dimuat dari localStorage saat start, default 'auto')
  const [cameraQualityConfig, setCameraQualityConfig] = useState<CameraQualityConfig>(() => loadStoredCameraQuality())

  // Camera Visual Effect & Finetune State (dimuat dari localStorage saat start, default 'vivid')
  const [cameraEffect, setCameraEffect] = useState<CameraEffectConfig>(() => loadStoredCameraEffect())

  // Simpan otomatis ke localStorage setiap kali ada perubahan konfigurasi
  useEffect(() => {
    saveStoredWatermark(watermark)
  }, [watermark])

  useEffect(() => {
    saveStoredGeotag(geotagConfig)
  }, [geotagConfig])

  useEffect(() => {
    saveStoredCameraQuality(cameraQualityConfig)
  }, [cameraQualityConfig])

  useEffect(() => {
    saveStoredCameraEffect(cameraEffect)
  }, [cameraEffect])

  // Hardware & Sensor Hooks (menerima konfigurasi resolusi/kualitas target)
  const camera = useCamera({
    enabled: isCameraActive,
    qualityConfig: cameraQualityConfig,
  })
  const location = useGeolocation()
  const orientation = useOrientation()

  // Integrasi tombol Back fisik/gesture ponsel agar menutup modal secara bertingkat
  useModalHistory('drawer-settings', isSettingsOpen, () => setIsSettingsOpen(false))
  useModalHistory('modal-capture', Boolean(currentPhoto), () => setCurrentPhoto(null))
  useModalHistory('modal-history', isHistoryOpen, () => setIsHistoryOpen(false))
  useModalHistory('bar-presets', isPresetBarOpen, () => setIsPresetBarOpen(false))

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
    setCameraQualityConfig(DEFAULT_CAMERA_QUALITY_CONFIG)
    setCameraEffect(DEFAULT_CAMERA_EFFECT_CONFIG)
  }, [])

  // Capture Trigger: Jepret foto, komposit canvas, dan simpan otomatis ke IndexedDB visitor
  const handleCapture = useCallback(async () => {
    if (!camera.videoRef.current || !camera.isStreaming || isCapturing) return

    setIsCapturing(true)
    try {
      const { dataUrl, width: photoWidth, height: photoHeight } = await captureAndComposite({
        video: camera.videoRef.current,
        videoTrack: camera.videoTrack,
        watermark,
        location,
        displayConfig: geotagConfig,
        mirror: camera.facingMode === 'user',
        rotationAngle: orientation.rotationAngle,
        jpegTier: cameraQualityConfig.jpegTier,
        denoiseMode: cameraQualityConfig.denoiseMode,
        effectConfig: cameraEffect,
      })

      const newPhoto: CapturedPhoto = {
        id: `photo_${Date.now()}`,
        dataUrl,
        timestamp: new Date(),
        location,
        width: photoWidth,
        height: photoHeight,
      }

      // Simpan permanen ke IndexedDB lokal perangkat pengguna
      await savePhotoToStorage(newPhoto)
      refreshHistoryCount()

      setCurrentPhoto(newPhoto)

      // Auto-upload Google Drive jika diaktifkan dan terhubung
      if (drive.config.autoUpload && drive.isConnected) {
        drive.uploadPhoto(dataUrl, `LocaCamp_${newPhoto.id}.jpg`).catch((err) => {
          console.debug('Auto-upload ke Google Drive gagal:', err)
        })
      }
    } catch (err) {
      console.error('Gagal mengambil foto komposit:', err)
    } finally {
      setIsCapturing(false)
    }
  }, [camera, watermark, location, geotagConfig, cameraQualityConfig.jpegTier, cameraQualityConfig.denoiseMode, cameraEffect, isCapturing, orientation.rotationAngle, refreshHistoryCount, drive])

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
            cameraEffect={cameraEffect}
            isLandscape={orientation.isLandscape}
            isPresetBarOpen={isPresetBarOpen}
            onTogglePresetBar={() => setIsPresetBarOpen(prev => !prev)}
            onClosePresetBar={() => setIsPresetBarOpen(false)}
          />
        </div>

        {/* Shutter and Quick Controls: Di KANAN saat Landscape, di BAWAH saat Portrait */}
        <div className={`${orientation.isLandscape ? 'h-full shrink-0' : 'w-full shrink-0'} ${isSettingsOpen ? 'invisible pointer-events-none' : ''}`}>
          {isPresetBarOpen ? (
            <LivePresetBar
              cameraEffect={cameraEffect}
              onChangeCameraEffect={setCameraEffect}
              onCapture={handleCapture}
              isCapturing={isCapturing}
              isReady={camera.isStreaming}
              onClose={() => setIsPresetBarOpen(false)}
              isLandscape={orientation.isLandscape}
              rotationAngle={orientation.rotationAngle}
            />
          ) : (
            <ShutterControls
              onCapture={handleCapture}
              isCapturing={isCapturing}
              isReady={camera.isStreaming}
              onOpenSettings={() => {
                setIsPresetBarOpen(false)
                setIsSettingsOpen(true)
              }}
              onOpenHistory={() => {
                setIsPresetBarOpen(false)
                setIsHistoryOpen(true)
              }}
              historyCount={historyCount}
              isLandscape={orientation.isLandscape}
              rotationAngle={orientation.rotationAngle}
            />
          )}
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
        cameraQualityConfig={cameraQualityConfig}
        onChangeCameraQualityConfig={setCameraQualityConfig}
        cameraEffect={cameraEffect}
        onChangeCameraEffect={setCameraEffect}
        sensorInfo={camera.sensorInfo}
        onResetSettings={handleResetSettings}
        drive={drive}
      />

      {/* Capture Review & Download Modal */}
      <CaptureModal
        photo={currentPhoto}
        onClose={() => setCurrentPhoto(null)}
        onRetake={() => setCurrentPhoto(null)}
        isLandscape={orientation.isLandscape}
        onUploadToDrive={(dataUrl) => drive.uploadPhoto(dataUrl)}
        isDriveConnected={drive.isConnected}
        onOpenSettings={() => setIsSettingsOpen(true)}
        lastDriveResult={drive.lastUploadResult}
        isAutoUploadingDrive={drive.isUploading}
      />

      {/* Photo History Gallery Modal (Client-side IndexedDB) */}
      <PhotoHistoryModal
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        onPhotosUpdated={refreshHistoryCount}
        onUploadToDrive={(p) => drive.uploadPhoto(p.dataUrl, `LocaCamp_${p.id}.jpg`)}
        isDriveConnected={drive.isConnected}
        onOpenSettings={() => setIsSettingsOpen(true)}
      />
    </main>
  )
}
