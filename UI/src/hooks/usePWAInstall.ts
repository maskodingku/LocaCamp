import { useState, useEffect, useCallback } from 'react'

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[]
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed'
    platform: string
  }>
  prompt(): Promise<void>
}

// Cek apakah aplikasi sedang berjalan dalam mode aplikasi terpasang (standalone PWA)
function checkIsStandalone(): boolean {
  if (typeof window === 'undefined') return false
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    (window.navigator as unknown as { standalone?: boolean }).standalone === true
  )
}

function checkIsIOS(): boolean {
  if (typeof window === 'undefined') return false
  return (
    /iPad|iPhone|iPod/.test(navigator.userAgent) ||
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)
  )
}

export function usePWAInstall() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)

  // Status terpasang murni ditentukan oleh mode standalone atau deteksi OS
  const [isInstalled, setIsInstalled] = useState<boolean>(() => {
    // Bersihkan flag legacy dari localStorage jika ada
    if (typeof window !== 'undefined') {
      try {
        localStorage.removeItem('locacamp_app_installed')
      } catch {
        // Abaikan jika localStorage tidak dapat diakses
      }
    }
    return checkIsStandalone()
  })

  useEffect(() => {
    // 1. Cek perubahan display-mode jika pengguna membuka atau berpindah ke mode standalone
    const mediaQuery = window.matchMedia('(display-mode: standalone)')
    const handleMediaChange = (e: MediaQueryListEvent) => {
      setIsInstalled(e.matches)
    }
    mediaQuery.addEventListener('change', handleMediaChange)

    // 2. Deteksi status aplikasi terpasang langsung dari sistem operasi via getInstalledRelatedApps (Chrome Android / PC)
    if (typeof navigator !== 'undefined' && 'getInstalledRelatedApps' in navigator) {
      ;(navigator as unknown as { getInstalledRelatedApps: () => Promise<Array<{ platform: string; id?: string; url?: string }>> })
        .getInstalledRelatedApps()
        .then((relatedApps) => {
          if (Array.isArray(relatedApps) && relatedApps.length > 0) {
            setIsInstalled(true)
          }
        })
        .catch((err) => {
          console.debug('getInstalledRelatedApps check:', err)
        })
    }

    // 3. Tangkap event beforeinstallprompt (Chrome, Edge, Android)
    // Jika event ini ditembakkan oleh browser, artinya aplikasi BELUM terpasang di perangkat
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e as BeforeInstallPromptEvent)
      // Pastikan status install adalah false jika browser siap menginstal
      setIsInstalled(false)
    }

    // 4. Tangkap event appinstalled ketika aplikasi sukses diinstall oleh pengguna
    const handleAppInstalled = () => {
      setIsInstalled(true)
      setDeferredPrompt(null)
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    window.addEventListener('appinstalled', handleAppInstalled)

    return () => {
      mediaQuery.removeEventListener('change', handleMediaChange)
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
      window.removeEventListener('appinstalled', handleAppInstalled)
    }
  }, [])

  const installApp = useCallback(async () => {
    if (deferredPrompt) {
      try {
        await deferredPrompt.prompt()
        const choice = await deferredPrompt.userChoice
        if (choice.outcome === 'accepted') {
          setIsInstalled(true)
        }
      } catch (err) {
        console.error('Error saat instalasi PWA:', err)
      } finally {
        setDeferredPrompt(null)
      }
    } else {
      // Deteksi iOS Safari
      const isIOS = checkIsIOS()
      if (isIOS) {
        alert(
          'Untuk memasang di iPhone/iPad:\n1. Ketuk ikon Bagikan (Share) di browser Safari\n2. Gulir dan pilih "Tambahkan ke Layar Utama" (Add to Home Screen)'
        )
      } else {
        alert(
          'Untuk memasang aplikasi:\nBuka menu browser (ikon titik tiga di kanan atas) lalu pilih "Instal aplikasi" atau "Tambahkan ke Layar Utama".'
        )
      }
    }
  }, [deferredPrompt])

  const isIOS = typeof window !== 'undefined' ? checkIsIOS() : false
  // Tombol hanya dapat ditampilkan jika aplikasi belum terpasang dan siap diinstal:
  // - Pada browser Chromium: jika event beforeinstallprompt aktif (menandakan aplikasi belum terpasang di HP)
  // - Pada iOS Safari: jika belum dalam mode standalone
  const canInstall = !isInstalled && (deferredPrompt !== null || isIOS)

  return {
    isInstalled,
    canInstall,
    installApp,
    isPromptReady: Boolean(deferredPrompt),
  }
}
