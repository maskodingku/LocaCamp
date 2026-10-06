import { useState, useEffect, useRef, useCallback } from 'react'
import type { CameraQualityConfig, CameraQualityPreset, SensorCapabilitiesInfo } from '../types/camera'

export interface CameraState {
  isStreaming: boolean
  isLoading: boolean
  error: string | null
  facingMode: 'user' | 'environment'
  hasMultipleCameras: boolean
  isTorchOn: boolean
  supportsTorch: boolean
  sensorInfo: SensorCapabilitiesInfo | null
}

export interface UseCameraOptions {
  enabled?: boolean
  qualityConfig?: CameraQualityConfig
}

function getResolutionConstraints(preset: CameraQualityPreset = 'auto'): {
  width: ConstrainULong
  height: ConstrainULong
  frameRate: ConstrainDouble
} {
  switch (preset) {
    case '12mp':
      return {
        width: { ideal: 4000, max: 4096 },
        height: { ideal: 3000, max: 3072 },
        frameRate: { ideal: 60, min: 30 },
      }
    case '8mp':
      return {
        width: { ideal: 3264, max: 3840 },
        height: { ideal: 2448, max: 2560 },
        frameRate: { ideal: 60, min: 30 },
      }
    case '2mp':
      return {
        width: { ideal: 1920, max: 1920 },
        height: { ideal: 1080, max: 1080 },
        frameRate: { ideal: 60, min: 30 },
      }
    case '1mp':
      return {
        width: { ideal: 1280, max: 1280 },
        height: { ideal: 720, max: 720 },
        frameRate: { ideal: 60, min: 30 },
      }
    case 'auto':
    default:
      // Mode 'auto' memprioritaskan frame rate 60 FPS super smooth di resolusi optimal 1080p.
      // Ini mencegah lag & GPU thermal throttling di HP, sementara ImageCapture.takePhoto()
      // tetap mengambil foto resolusi penuh sensor fisik (12MP - 48MP+) saat shutter ditekan.
      return {
        width: { ideal: 1920, max: 3840 },
        height: { ideal: 1080, max: 2160 },
        frameRate: { ideal: 60, min: 30 },
      }
  }
}

export function useCamera(options: UseCameraOptions = {}) {
  const { enabled = true, qualityConfig } = options
  const currentPreset = qualityConfig?.preset || 'auto'

  const videoRef = useRef<HTMLVideoElement | null>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const sessionCounterRef = useRef(0)
  const tabIdRef = useRef<string>(Math.random().toString(36).substring(2, 9))
  const broadcastChannelRef = useRef<BroadcastChannel | null>(null)

  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('environment')
  const [isStreaming, setIsStreaming] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [hasMultipleCameras, setHasMultipleCameras] = useState(false)
  const [supportsTorch, setSupportsTorch] = useState(false)
  const [isTorchOn, setIsTorchOn] = useState(false)
  const [sensorInfo, setSensorInfo] = useState<SensorCapabilitiesInfo | null>(null)

  // Check available video devices
  const checkDevices = useCallback(async () => {
    try {
      if (!navigator.mediaDevices?.enumerateDevices) return
      const devices = await navigator.mediaDevices.enumerateDevices()
      const videoInputs = devices.filter(d => d.kind === 'videoinput')
      setHasMultipleCameras(videoInputs.length > 1)
    } catch {
      // Ignore enumeration errors
    }
  }, [])

  // Stop current active stream
  const stopStream = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => {
        track.stop()
      })
      streamRef.current = null
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null
    }
    setIsStreaming(false)
    setIsTorchOn(false)
    setSupportsTorch(false)
  }, [])

  // Koordinasi antar-tab: Lepaskan kamera jika ada tab LocaCamp lain yang meminta akses
  useEffect(() => {
    if (typeof BroadcastChannel !== 'undefined') {
      const channel = new BroadcastChannel('locacamp_camera_sync')
      broadcastChannelRef.current = channel

      channel.onmessage = (event) => {
        if (event.data?.type === 'CLAIM_CAMERA' && event.data.tabId !== tabIdRef.current) {
          // Tab lain meminta kamera, lepaskan stream secara sopan
          sessionCounterRef.current++
          stopStream()
          setIsLoading(false)
        }
      }

      return () => {
        channel.close()
        broadcastChannelRef.current = null
      }
    }
  }, [stopStream])

  // Start camera stream dengan dukungan multi-tab handover & auto-retry
  const startCamera = useCallback(async (retryCount = 0): Promise<void> => {
    const sessionId = ++sessionCounterRef.current
    setIsLoading(true)
    setError(null)
    stopStream()

    // 1. Kirim sinyal ke tab lain di browser untuk melepaskan kamera jika sedang dipegang
    if (broadcastChannelRef.current) {
      try {
        broadcastChannelRef.current.postMessage({
          type: 'CLAIM_CAMERA',
          tabId: tabIdRef.current,
        })
      } catch {
        // Abaikan
      }
    }

    // Beri jeda 120ms agar driver webcam OS/tab lain selesai melepaskan perangkat
    await new Promise(r => setTimeout(r, 120))
    if (sessionId !== sessionCounterRef.current) return

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setError('Browser Anda tidak mendukung akses kamera (getUserMedia tidak tersedia).')
      setIsLoading(false)
      return
    }

    try {
      const resolution = getResolutionConstraints(currentPreset)
      const constraints: MediaStreamConstraints = {
        video: {
          facingMode: { ideal: facingMode },
          width: resolution.width,
          height: resolution.height,
          frameRate: resolution.frameRate,
        },
        audio: false,
      }

      const stream = await navigator.mediaDevices.getUserMedia(constraints)

      // Batalkan jika sesi telah kedaluwarsa atau pengguna meninggalkan halaman kamera saat stream didapat
      if (sessionId !== sessionCounterRef.current) {
        stream.getTracks().forEach(track => track.stop())
        return
      }

      streamRef.current = stream

      if (videoRef.current) {
        videoRef.current.srcObject = stream
        videoRef.current.setAttribute('playsinline', 'true')
        await videoRef.current.play()
      }

      // Check track capability & sensor info
      const videoTrack = stream.getVideoTracks()[0]
      if (videoTrack) {
        const capabilities = videoTrack.getCapabilities?.() as (MediaTrackCapabilities & { torch?: boolean }) | undefined
        setSupportsTorch(Boolean(capabilities?.torch))

        if (capabilities?.width && capabilities?.height) {
          const rawW = typeof capabilities.width === 'object' && capabilities.width.max ? capabilities.width.max : 1920
          const rawH = typeof capabilities.height === 'object' && capabilities.height.max ? capabilities.height.max : 1080
          const maxDim = Math.max(rawW, rawH)
          const minDim = Math.min(rawW, rawH)
          const totalMP = Number(((maxDim * minDim) / 1000000).toFixed(1))

          setSensorInfo({
            label: videoTrack.label || 'Kamera HP',
            maxWidth: maxDim,
            maxHeight: minDim,
            maxMegapixels: Math.max(2, totalMP),
            supports4K: maxDim >= 3840 || minDim >= 2160,
            supports12MP: totalMP >= 10 || maxDim >= 4000,
            supports8MP: totalMP >= 7 || maxDim >= 3000,
            supportsImageCapture: typeof window !== 'undefined' && 'ImageCapture' in window,
          })
        }

        // Terapkan continuous auto-exposure & white-balance agar preview tidak redup/terkunci di eksposur rendah
        try {
          const caps = (videoTrack.getCapabilities?.() || {}) as Record<string, unknown>
          const adv: Record<string, unknown> = {}
          if (Array.isArray(caps.exposureMode) && caps.exposureMode.includes('continuous')) {
            adv.exposureMode = 'continuous'
          }
          if (Array.isArray(caps.whiteBalanceMode) && caps.whiteBalanceMode.includes('continuous')) {
            adv.whiteBalanceMode = 'continuous'
          }
          if (Array.isArray(caps.focusMode) && caps.focusMode.includes('continuous')) {
            adv.focusMode = 'continuous'
          }
          if (Object.keys(adv).length > 0) {
            await videoTrack.applyConstraints({ advanced: [adv] })
          }
        } catch {
          // Abaikan jika browser tidak mengizinkan advanced constraints
        }
      }

      setIsStreaming(true)
      setIsLoading(false)
      await checkDevices()
    } catch (err: unknown) {
      if (sessionId !== sessionCounterRef.current) return

      const errorObj = err as Error

      // Auto-retry jika kamera masih dalam proses pelepasan oleh tab sebelumnya (NotReadableError / TrackStartError)
      if (
        (errorObj.name === 'NotReadableError' || errorObj.name === 'TrackStartError') &&
        retryCount < 2
      ) {
        await new Promise(r => setTimeout(r, 350))
        if (sessionId === sessionCounterRef.current) {
          return startCamera(retryCount + 1)
        }
        return
      }

      setIsLoading(false)
      setIsStreaming(false)

      if (errorObj.name === 'NotAllowedError' || errorObj.name === 'PermissionDeniedError') {
        setError('Akses kamera ditolak. Silakan izinkan akses kamera di setelan browser Anda.')
      } else if (errorObj.name === 'NotFoundError' || errorObj.name === 'DevicesNotFoundError') {
        setError('Kamera tidak ditemukan pada perangkat Anda.')
      } else if (errorObj.name === 'NotReadableError' || errorObj.name === 'TrackStartError') {
        setError('Kamera sedang digunakan oleh tab atau aplikasi lain.')
      } else {
        setError(`Gagal mengakses kamera: ${errorObj.message || 'Kesalahan tidak diketahui'}`)
      }
    }
  }, [facingMode, currentPreset, stopStream, checkDevices])

  // Deteksi status tab / layar aktif peramban (Page Visibility API & Window Focus)
  const [isTabVisible, setIsTabVisible] = useState(() =>
    typeof document !== 'undefined' ? document.visibilityState === 'visible' : true
  )

  useEffect(() => {
    const handleVisibilityChange = () => {
      setIsTabVisible(document.visibilityState === 'visible')
    }

    const handleFocus = () => {
      // Saat pengguna mengklik atau berpindah ke tab ini, pastikan kamera otomatis aktif
      if (enabled && document.visibilityState === 'visible' && !streamRef.current) {
        startCamera()
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    window.addEventListener('focus', handleFocus)
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      window.removeEventListener('focus', handleFocus)
    }
  }, [enabled, startCamera])

  // Kamera hanya boleh aktif jika enabled bernilai true dan tab sedang dilihat
  const shouldStream = enabled && isTabVisible

  // Switch between front and back camera
  const switchCamera = useCallback(() => {
    setFacingMode(prev => (prev === 'environment' ? 'user' : 'environment'))
  }, [])

  // Toggle torch / flash
  const toggleTorch = useCallback(async () => {
    if (!streamRef.current || !supportsTorch) return
    const track = streamRef.current.getVideoTracks()[0]
    if (!track) return

    try {
      const newTorchState = !isTorchOn
      await (track as MediaStreamTrack & { applyConstraints: (c: unknown) => Promise<void> }).applyConstraints({
        advanced: [{ torch: newTorchState }],
      })
      setIsTorchOn(newTorchState)
    } catch {
      // Torch failed or unsupported
    }
  }, [isTorchOn, supportsTorch])

  // Effect untuk menyalakan/mematikan kamera secara otomatis sesuai visibilitas dan status halaman
  useEffect(() => {
    if (shouldStream) {
      startCamera()
    } else {
      // Inkrementasi sesi agar request getUserMedia yang sedang berjalan dibatalkan dan dimatikan
      sessionCounterRef.current++
      stopStream()
      setIsLoading(false)
    }

    return () => {
      sessionCounterRef.current++
      stopStream()
    }
  }, [shouldStream, startCamera, stopStream])

  return {
    videoRef,
    videoTrack: streamRef.current?.getVideoTracks()[0] ?? null,
    isStreaming,
    isLoading,
    error,
    facingMode,
    hasMultipleCameras,
    supportsTorch,
    isTorchOn,
    sensorInfo,
    switchCamera,
    toggleTorch,
    restartCamera: startCamera,
  }
}
