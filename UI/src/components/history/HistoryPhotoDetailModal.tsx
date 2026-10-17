import React, { useState, useEffect } from 'react'
import {
  X,
  Download,
  Trash2,
  MapPin,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Check,
} from 'lucide-react'
import type { StoredPhoto } from '../../utils/photoStorage'
import { useModalHistory } from '../../hooks/useModalHistory'
import { GoogleDriveIcon } from '../settings/gdrive/GoogleDriveIcon'
import { ZoomablePhotoViewer } from '../preview/ZoomablePhotoViewer'

interface HistoryPhotoDetailModalProps {
  photo: StoredPhoto | null
  currentIndex: number
  totalCount: number
  hasPrev: boolean
  hasNext: boolean
  onPrev: () => void
  onNext: () => void
  onClose: () => void
  onDownload: (photo: StoredPhoto) => void
  onDelete: (id: string) => void
  onUploadToDrive?: (photo: StoredPhoto) => Promise<{ fileId: string; webViewLink?: string }>
  isDriveConnected?: boolean
  onOpenSettings?: () => void
}

export const HistoryPhotoDetailModal: React.FC<HistoryPhotoDetailModalProps> = ({
  photo,
  currentIndex,
  totalCount,
  hasPrev,
  hasNext,
  onPrev,
  onNext,
  onClose,
  onDownload,
  onDelete,
  onUploadToDrive,
  isDriveConnected = false,
  onOpenSettings,
}) => {
  const [isPureFullscreen, setIsPureFullscreen] = useState(false)
  const [isUploadingDrive, setIsUploadingDrive] = useState(false)
  const [driveResult, setDriveResult] = useState<{ fileId: string; webViewLink?: string } | null>(null)
  const [driveError, setDriveError] = useState<string | null>(null)

  // Reset drive status saat ganti foto
  useEffect(() => {
    setDriveResult(null)
    setDriveError(null)
  }, [photo?.id])

  const handleDriveUpload = async () => {
    if (!photo) return
    if (!isDriveConnected) {
      if (onOpenSettings) {
        onClose()
        onOpenSettings()
      } else {
        alert('Silakan hubungkan akun Google Drive terlebih dahulu di Pengaturan.')
      }
      return
    }

    setIsUploadingDrive(true)
    setDriveError(null)
    try {
      if (onUploadToDrive) {
        const res = await onUploadToDrive(photo)
        setDriveResult(res)
        photo.uploadedToDrive = true
        if (res.fileId) photo.driveFileId = res.fileId
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Gagal mengunggah ke Google Drive'
      setDriveError(msg)
    } finally {
      setIsUploadingDrive(false)
    }
  }

  // Integrasi tombol Back fisik/gesture ponsel
  useModalHistory(
    'history-photo-detail',
    Boolean(photo),
    () => {
      onClose()
      setIsPureFullscreen(false)
    }
  )

  useModalHistory(
    'history-pure-fullscreen',
    Boolean(photo) && isPureFullscreen,
    () => {
      setIsPureFullscreen(false)
    }
  )

  // Navigasi Keyboard Panah Kiri / Kanan & Esc
  useEffect(() => {
    if (!photo) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        e.preventDefault()
        onPrev()
      } else if (e.key === 'ArrowRight') {
        e.preventDefault()
        onNext()
      } else if (e.key === 'Escape') {
        e.preventDefault()
        if (isPureFullscreen) {
          setIsPureFullscreen(false)
        } else {
          onClose()
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [photo, onPrev, onNext, isPureFullscreen, onClose])

  if (!photo) return null

  return (
    <div
      className={`fixed inset-0 z-60 bg-black flex flex-col items-center justify-between transition-all duration-300 animate-in fade-in select-none ${
        isPureFullscreen ? 'p-0' : 'p-3 sm:p-6 bg-black/95'
      }`}
      onClick={() => {
        if (isPureFullscreen) {
          setIsPureFullscreen(false)
        } else {
          onClose()
        }
      }}
    >
      {/* Header (Disembunyikan total saat mode layar penuh bersih) */}
      {!isPureFullscreen && (
        <div
          className="w-full max-w-4xl flex items-center justify-between gap-2 z-10 animate-in fade-in duration-200"
          onClick={e => e.stopPropagation()}
        >
          <div className="flex items-center gap-2 min-w-0">
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 sm:px-2.5 sm:py-1.5 rounded-xl bg-zinc-800/80 hover:bg-zinc-700 text-zinc-300 hover:text-white transition-colors flex items-center gap-1 shrink-0 border border-zinc-700/60"
              title="Kembali ke Galeri Riwayat"
            >
              <ChevronLeft className="w-4 h-4" />
              <span className="text-xs font-medium hidden sm:inline">Kembali</span>
            </button>

            {/* Counter Badge */}
            {currentIndex !== -1 && (
              <span className="px-2 py-0.5 rounded-md bg-zinc-800 border border-zinc-700 text-[11px] font-mono font-medium text-emerald-400 shrink-0">
                {currentIndex + 1} / {totalCount}
              </span>
            )}

            <div className="text-xs text-zinc-300 flex items-center gap-1.5 min-w-0">
              <MapPin className="w-3.5 h-3.5 text-rose-400 shrink-0" />
              <span className="font-medium truncate">
                {photo.address || 'Dokumentasi Lokasi'}
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-full glass-panel hover:bg-white/20 text-white transition-colors shrink-0"
            title="Tutup Pratinjau Foto"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* Large Image View with Left/Right Buttons & ZoomablePhotoViewer */}
      <div
        className={`relative flex items-center justify-center overflow-hidden transition-all duration-300 ${
          isPureFullscreen
            ? 'w-full h-full p-0'
            : 'flex-1 w-full max-w-4xl p-2'
        }`}
        onClick={e => e.stopPropagation()}
      >
        {/* Tombol Panah Kiri (Sebelumnya) */}
        {!isPureFullscreen && hasPrev && (
          <button
            type="button"
            onClick={e => {
              e.stopPropagation()
              onPrev()
            }}
            className="absolute left-2 sm:left-4 z-20 p-2.5 sm:p-3 rounded-full bg-zinc-950/75 hover:bg-zinc-900 border border-white/15 text-white backdrop-blur-md shadow-2xl transition-all hover:scale-110 active:scale-95 group cursor-pointer"
            title="Foto Sebelumnya (Panah Kiri)"
          >
            <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 text-zinc-300 group-hover:text-white group-hover:-translate-x-0.5 transition-transform" />
          </button>
        )}

        {/* Container Gambar dengan ZoomablePhotoViewer (Otomatis Reset Zoom saat ganti foto via key) */}
        <div
          key={photo.id}
          className="w-full h-full flex items-center justify-center animate-in fade-in duration-200 overflow-hidden"
        >
          <ZoomablePhotoViewer
            src={photo.dataUrl}
            alt={photo.address || 'Dokumentasi Lokasi'}
            className="w-full h-full"
          />
        </div>

        {/* Tombol Panah Kanan (Selanjutnya) */}
        {!isPureFullscreen && hasNext && (
          <button
            type="button"
            onClick={e => {
              e.stopPropagation()
              onNext()
            }}
            className="absolute right-2 sm:right-4 z-20 p-2.5 sm:p-3 rounded-full bg-zinc-950/75 hover:bg-zinc-900 border border-white/15 text-white backdrop-blur-md shadow-2xl transition-all hover:scale-110 active:scale-95 group cursor-pointer"
            title="Foto Selanjutnya (Panah Kanan)"
          >
            <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 text-zinc-300 group-hover:text-white group-hover:translate-x-0.5 transition-transform" />
          </button>
        )}
      </div>

      {/* Footer Action (Disembunyikan total saat mode layar penuh bersih) */}
      {!isPureFullscreen && (
        <div
          className="w-full max-w-4xl flex items-center justify-between gap-3 pt-3 border-t border-zinc-800/80 z-10 animate-in fade-in duration-200"
          onClick={e => e.stopPropagation()}
        >
          <div className="flex flex-col gap-0.5">
            <div className="text-xs text-zinc-400 font-mono">
              {new Date(photo.timestamp).toLocaleString('id-ID')}
            </div>
            {driveError ? (
              <div className="text-[10px] text-rose-400 font-medium">
                {driveError}
              </div>
            ) : (
              <div className="text-[10px] text-zinc-500 hidden sm:block">
                Tips: Cubit 2 jari untuk zoom • Ketuk 2x untuk zoom cepat • Geser 1 jari untuk ganti foto
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onDelete(photo.id)}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-rose-500/30 bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 text-xs font-semibold transition-all active:scale-95"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Hapus</span>
            </button>

            {Boolean(photo.uploadedToDrive || driveResult) ? (
              <div
                className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl border border-emerald-500/40 bg-emerald-950/40 text-emerald-300 text-xs font-semibold cursor-default select-none shadow-md"
                title="Foto ini sudah pernah di-upload ke Google Drive"
              >
                <GoogleDriveIcon className="w-3.5 h-3.5 shrink-0" />
                <span>Drive</span>
                <Check className="w-3.5 h-3.5 text-emerald-400 stroke-[3]" />
              </div>
            ) : (
              <button
                type="button"
                onClick={handleDriveUpload}
                disabled={isUploadingDrive}
                className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl border border-zinc-700 bg-zinc-900 hover:bg-zinc-800 text-zinc-200 text-xs font-semibold transition-all active:scale-95 shadow-md cursor-pointer disabled:opacity-50"
                title={isDriveConnected ? 'Upload ke Google Drive' : 'Kaitkan Akun Google Drive'}
              >
                {isUploadingDrive ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-emerald-400" />
                    <span>Upload...</span>
                  </>
                ) : (
                  <>
                    <GoogleDriveIcon className="w-3.5 h-3.5 shrink-0" />
                    <span>Drive</span>
                  </>
                )}
              </button>
            )}

            <button
              type="button"
              onClick={() => onDownload(photo)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-zinc-950 font-bold text-xs sm:text-sm hover:bg-zinc-200 transition-all shadow-xl active:scale-95"
            >
              <Download className="w-4 h-4" />
              <span>Unduh Foto (HD)</span>
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
