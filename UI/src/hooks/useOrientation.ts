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

  useEffect(() => {
    if (typeof window === 'undefined') return

    const updateScreenOrientation = () => {
      // 1. Orientasi Layar Fisik (Murni berdasarkan dimensi viewport browser pengguna)
      const screenIsLand = window.innerWidth > window.innerHeight
      setIsLandscape(screenIsLand)

      // 2. Sudut Rotasi Kanvas Foto:
      // - Jika layar tegak (Portrait: tinggi >= lebar), sudut rotasi SELALU 0 derajat.
      //   Tidak menggunakan accelerometer mentah agar foto 100% konsisten tegak tanpa glitch / gimbal lock.
      // - Jika layar mendatar (Landscape: lebar > tinggi), gunakan sudut sistem 90 atau 270 derajat.
      if (!screenIsLand) {
        setRotationAngle(0)
      } else {
        const systemAngle = (window.screen?.orientation?.angle ?? (window as unknown as { orientation?: number }).orientation ?? 90) as OrientationAngle
        if (systemAngle === 90 || systemAngle === 270) {
          setRotationAngle(systemAngle)
        } else {
          setRotationAngle(90)
        }
      }
    }

    // 1. Pasang listener resize & orientasi layar
    window.addEventListener('resize', updateScreenOrientation)
    if (window.screen?.orientation) {
      window.screen.orientation.addEventListener('change', updateScreenOrientation)
    } else {
      window.addEventListener('orientationchange', updateScreenOrientation)
    }

    // Inisialisasi awal saat pertama kali dimuat
    updateScreenOrientation()

    return () => {
      window.removeEventListener('resize', updateScreenOrientation)
      if (window.screen?.orientation) {
        window.screen.orientation.removeEventListener('change', updateScreenOrientation)
      } else {
        window.removeEventListener('orientationchange', updateScreenOrientation)
      }
    }
  }, [])

  return {
    rotationAngle,
    isLandscape,
    isAutoRotateLocked: false,
  }
}
