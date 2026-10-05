import { useState, useEffect } from 'react'

export type OrientationAngle = 0 | 90 | 180 | 270

export interface OrientationState {
  rotationAngle: OrientationAngle
  isLandscape: boolean
  isAutoRotateLocked: boolean
}

export function useOrientation(): OrientationState {
  const [rotationAngle, setRotationAngle] = useState<OrientationAngle>(0)
  const [isLandscape, setIsLandscape] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false
    return (
      window.innerWidth > window.innerHeight ||
      window.screen?.orientation?.type?.includes('landscape') ||
      false
    )
  })
  const [isAutoRotateLocked, setIsAutoRotateLocked] = useState<boolean>(false)

  useEffect(() => {
    if (typeof window === 'undefined') return

    const updateScreenOrientation = () => {
      // 1. Orientasi Layar Fisik (Murni berdasarkan dimensi viewport browser pengguna)
      const screenIsLand = window.innerWidth > window.innerHeight
      setIsLandscape(screenIsLand)

      // 2. Sudut Rotasi Layar Bawaan Sistem (jika auto-rotate sistem aktif)
      const angle = (window.screen?.orientation?.angle ?? (window as unknown as { orientation?: number }).orientation ?? 0) as OrientationAngle

      if (angle === 90 || angle === 270 || angle === 180 || angle === 0) {
        setRotationAngle(angle)
        if (angle !== 0) {
          setIsAutoRotateLocked(false)
        }
      }
    }

    // 1. Screen Orientation & Resize Listeners
    window.addEventListener('resize', updateScreenOrientation)
    if (window.screen?.orientation) {
      window.screen.orientation.addEventListener('change', updateScreenOrientation)
    } else {
      window.addEventListener('orientationchange', updateScreenOrientation)
    }

    // Inisialisasi awal
    updateScreenOrientation()

    // 2. Accelerometer (DeviceOrientationEvent)
    // HANYA untuk memutar ikon dan mengatur orientasi kanvas hasil foto saat Auto-Rotate HP dikunci.
    // DILARANG mengubah isLandscape di sini agar tata letak tombol tidak meloncat ke samping saat layar fisik tegak!
    const handleDeviceOrientation = (e: DeviceOrientationEvent) => {
      // Jika sistem layar sudah mendeteksi landscape (angle != 0), gunakan orientasi sistem
      const screenAngle = window.screen?.orientation?.angle ?? 0
      if (screenAngle !== 0) {
        setRotationAngle(screenAngle as OrientationAngle)
        setIsAutoRotateLocked(false)
        return
      }

      const gamma = e.gamma ?? 0 // Kemiringan kiri-kanan [-90, 90]
      const beta = e.beta ?? 0   // Kemiringan depan-belakang [-180, 180]

      // Filter: Hanya deteksi jika ponsel dipegang tegak menghadap objek foto
      // Mencegah Gimbal Lock saat ponsel diarahkan ke meja atau menunduk (|beta| < 35 atau |beta| > 145)
      if (Math.abs(beta) > 35 && Math.abs(beta) < 145) {
        if (gamma < -45) {
          // Miring ke kiri (Landscape 90°)
          setRotationAngle(90)
          setIsAutoRotateLocked(true)
        } else if (gamma > 45) {
          // Miring ke kanan (Landscape 270°)
          setRotationAngle(270)
          setIsAutoRotateLocked(true)
        } else if (Math.abs(gamma) < 25) {
          // Posisi Tegak (Portrait 0°)
          setRotationAngle(0)
          setIsAutoRotateLocked(false)
        }
      }
    }

    // Pasang listener DeviceOrientation jika didukung browser
    if (typeof window.DeviceOrientationEvent !== 'undefined') {
      window.addEventListener('deviceorientation', handleDeviceOrientation, true)
    }

    return () => {
      window.removeEventListener('resize', updateScreenOrientation)
      if (window.screen?.orientation) {
        window.screen.orientation.removeEventListener('change', updateScreenOrientation)
      } else {
        window.removeEventListener('orientationchange', updateScreenOrientation)
      }
      if (typeof window.DeviceOrientationEvent !== 'undefined') {
        window.removeEventListener('deviceorientation', handleDeviceOrientation, true)
      }
    }
  }, [])

  return {
    rotationAngle,
    isLandscape,
    isAutoRotateLocked,
  }
}
