import { useState, useEffect, useRef, useCallback } from 'react'

export interface CameraState {
  isStreaming: boolean
  isLoading: boolean
  error: string | null
  facingMode: 'user' | 'environment'
  hasMultipleCameras: boolean
  isTorchOn: boolean
  supportsTorch: boolean
}

export interface UseCameraOptions {
  enabled?: boolean
}

export function useCamera(options: UseCameraOptions = {}) {
  const { enabled = true } = options
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const sessionCounterRef = useRef(0)

  // Deteksi status tab / layar aktif peramban (Page Visibility API)
  const [isTabVisible, setIsTabVisible] = useState(() =>
    typeof document !== 'undefined' ? document.visibilityState === 'visible' : true
  )

  useEffect(() => {
    const handleVisibilityChange = () => {
      setIsTabVisible(document.visibilityState === 'visible')
    }
    document.addEventListener('visibilitychange', handleVisibilityChange)
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [])

  // Kamera hanya boleh aktif jika enabled bernilai true dan tab sedang dilihat
  const shouldStream = enabled && isTabVisible

  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('environment')
  const [isStreaming, setIsStreaming] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [hasMultipleCameras, setHasMultipleCameras] = useState(false)
  const [supportsTorch, setSupportsTorch] = useState(false)
  const [isTorchOn, setIsTorchOn] = useState(false)

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

  // Start camera stream
  const startCamera = useCallback(async () => {
    const sessionId = ++sessionCounterRef.current
    setIsLoading(true)
    setError(null)
    stopStream()

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setError('Browser Anda tidak mendukung akses kamera (getUserMedia tidak tersedia).')
      setIsLoading(false)
      return
    }

    try {
      const constraints: MediaStreamConstraints = {
        video: {
          facingMode: { ideal: facingMode },
          width: { ideal: 1920 },
          height: { ideal: 1080 },
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

      // Check torch capability
      const videoTrack = stream.getVideoTracks()[0]
      if (videoTrack) {
        const capabilities = videoTrack.getCapabilities?.() as (MediaTrackCapabilities & { torch?: boolean }) | undefined
        setSupportsTorch(Boolean(capabilities?.torch))
      }

      setIsStreaming(true)
      setIsLoading(false)
      await checkDevices()
    } catch (err: unknown) {
      if (sessionId !== sessionCounterRef.current) return

      setIsLoading(false)
      setIsStreaming(false)
      const errorObj = err as Error

      if (errorObj.name === 'NotAllowedError' || errorObj.name === 'PermissionDeniedError') {
        setError('Akses kamera ditolak. Silakan izinkan akses kamera di setelan browser Anda.')
      } else if (errorObj.name === 'NotFoundError' || errorObj.name === 'DevicesNotFoundError') {
        setError('Kamera tidak ditemukan pada perangkat Anda.')
      } else if (errorObj.name === 'NotReadableError' || errorObj.name === 'TrackStartError') {
        setError('Kamera sedang digunakan oleh aplikasi lain.')
      } else {
        setError(`Gagal mengakses kamera: ${errorObj.message || 'Kesalahan tidak diketahui'}`)
      }
    }
  }, [facingMode, stopStream, checkDevices])

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
    isStreaming,
    isLoading,
    error,
    facingMode,
    hasMultipleCameras,
    supportsTorch,
    isTorchOn,
    switchCamera,
    toggleTorch,
    restartCamera: startCamera,
  }
}
