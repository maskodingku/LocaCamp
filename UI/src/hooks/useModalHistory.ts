import { useEffect, useRef } from 'react'

interface ModalRecord {
  id: string
  onClose: () => void
}

// Global modal stack to track active overlays
const modalStack: ModalRecord[] = []
let isHandlingPopstate = false
let ignoreNextPopCount = 0
let resetIgnoreTimer: ReturnType<typeof setTimeout> | null = null

function scheduleResetIgnore() {
  if (resetIgnoreTimer) clearTimeout(resetIgnoreTimer)
  resetIgnoreTimer = setTimeout(() => {
    ignoreNextPopCount = 0
  }, 1000)
}

// Inisialisasi listener popstate satu kali untuk seluruh aplikasi
if (typeof window !== 'undefined') {
  // Bersihkan history state sisa jika halaman di-reload saat modal masih terbuka
  if (window.history.state?.locacampModal) {
    window.history.replaceState(null, '')
  }

  window.addEventListener('popstate', () => {
    // 1. Jika popstate ini adalah akibat dari window.history.back() yang dipanggil dari UI (tombol 'X', batal, dll)
    if (ignoreNextPopCount > 0) {
      ignoreNextPopCount--
      if (ignoreNextPopCount === 0 && resetIgnoreTimer) {
        clearTimeout(resetIgnoreTimer)
        resetIgnoreTimer = null
      }
      return
    }

    // 2. Jika popstate berasal dari tombol Back fisik ponsel / browser
    if (modalStack.length > 0) {
      const top = modalStack.pop()
      if (top) {
        isHandlingPopstate = true
        try {
          top.onClose()
        } finally {
          // Berikan jeda agar dispatch state React dan unmount cleanup selesai dalam kondisi isHandlingPopstate = true
          setTimeout(() => {
            isHandlingPopstate = false
          }, 80)
        }
      }
    }
  })
}

/**
 * Daftarkan modal ke stack dan tambahkan entry ke browser history
 */
export function registerModal(id: string, onClose: () => void) {
  const existingIndex = modalStack.findIndex(m => m.id === id)
  if (existingIndex !== -1) {
    modalStack[existingIndex].onClose = onClose
    return
  }

  // Masukkan state ke browser history
  window.history.pushState(
    {
      locacampModal: true,
      modalId: id,
      depth: modalStack.length + 1,
    },
    ''
  )

  modalStack.push({ id, onClose })
}

/**
 * Lepas modal dari stack dan sinkronkan browser history jika ditutup via UI
 */
export function unregisterModal(id: string) {
  const index = modalStack.findIndex(m => m.id === id)
  if (index === -1) return

  // Jika penutupan modal ini dipicu oleh event popstate (tombol back ponsel),
  // modalStack sudah di-pop dan browser sudah melakukan history.back() sendiri
  if (isHandlingPopstate) {
    return
  }

  // Jika ditutup secara terprogram via tombol UI (tombol 'X', tombol 'Kembali', backdrop, dll)
  modalStack.splice(index, 1)
  ignoreNextPopCount++
  scheduleResetIgnore()
  window.history.back()
}

/**
 * React Hook untuk menyinkronkan pembukaan & penutupan modal dengan riwayat browser (tombol back HP)
 * @param id Identifier unik untuk modal/overlay
 * @param isOpen Kondisi aktif/terbuka modal
 * @param onClose Callback fungsi saat modal diminta ditutup (baik via back HP maupun UI)
 */
export function useModalHistory(
  id: string,
  isOpen: boolean,
  onClose: () => void
) {
  const onCloseRef = useRef(onClose)
  onCloseRef.current = onClose

  useEffect(() => {
    if (!isOpen) return

    registerModal(id, () => {
      onCloseRef.current()
    })

    return () => {
      unregisterModal(id)
    }
  }, [isOpen, id])
}
