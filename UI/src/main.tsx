import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

// Registrasi Service Worker untuk PWA Offline-First & Auto-Update
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/sw.js')
      .then(reg => {
        // Cek pembaruan ke server saat perangkat kembali online atau jendela aplikasi aktif
        window.addEventListener('online', () => {
          reg.update().catch(() => {})
        })
        window.addEventListener('focus', () => {
          reg.update().catch(() => {})
        })

        // Deteksi pembaruan baru dari server
        reg.addEventListener('updatefound', () => {
          const newWorker = reg.installing
          if (!newWorker) return
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              console.log('[PWA] Versi baru ditemukan dan siap diaktifkan.')
            }
          })
        })
      })
      .catch(err => {
        console.warn('SW registration failed:', err)
      })
  })

  // Saat Service Worker baru mengambil kendali, reload halaman otomatis agar aset terbaru langsung aktif
  let isRefreshing = false
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    if (!isRefreshing) {
      isRefreshing = true
      window.location.reload()
    }
  })
}


