import { useState, useEffect, useCallback } from 'react'

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[]
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed'
    platform: string
  }>
  prompt(): Promise<void>
}

export function usePWAInstall() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [isInstalled, setIsInstalled] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false
    // Cek apakah dibuka dalam mode standalone (aplikasi terpasang)
    const isStandalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as unknown as { standalone?: boolean }).standalone === true
    const stored = localStorage.getItem('locacamp_app_installed') === 'true'
    return isStandalone || stored
  })

  useEffect(() => {
    // 1. Cek perubahan display-mode jika pengguna berpindah ke mode standalone
    const mediaQuery = window.matchMedia('(display-mode: standalone)')
    const handleMediaChange = (e: MediaQueryListEvent) => {
      if (e.matches) {
        setIsInstalled(true)
        localStorage.setItem('locacamp_app_installed', 'true')
      }
    }
    mediaQuery.addEventListener('change', handleMediaChange)

    // 2. Tangkap event beforeinstallprompt (Chrome, Edge, Android)
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e as BeforeInstallPromptEvent)
    }

    // 3. Tangkap event appinstalled ketika aplikasi sukses diinstall
    const handleAppInstalled = () => {
      setIsInstalled(true)
      setDeferredPrompt(null)
      localStorage.setItem('locacamp_app_installed', 'true')
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
          localStorage.setItem('locacamp_app_installed', 'true')
        }
      } catch (err) {
        console.error('Error saat instalasi PWA:', err)
      } finally {
        setDeferredPrompt(null)
      }
    } else {
      // Deteksi iOS Safari
      const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !('MSStream' in window)
      if (isIOS) {
        alert(
          'Untuk memasang di iPhone/iPad:\n1. Ketuk ikon Bagikan (Share) di browser Safari\n2. Gulir dan pilih "Tambahkan ke Layar Utama" (Add to Home Screen)'
        )
      } else {
        alert(
          'Untuk memasang aplikasi:\nBuka menu browser (ikon titik tiga di kanan atas) lalu pilih "Instal LocaCamp" atau "Tambahkan ke Layar Utama".'
        )
      }
    }
  }, [deferredPrompt])

  return {
    isInstalled,
    installApp,
    isPromptReady: Boolean(deferredPrompt),
  }
}
