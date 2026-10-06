import React, { useState, useEffect } from 'react'
import {
  Download,
  RotateCcw,
  Share2,
  Check,
  Calendar,
  MapPin,
  X,
  Cloud,
  Loader2,
  ExternalLink,
} from 'lucide-react'
import type { CapturedPhoto } from '../../types/camera'
import { formatTimeWithTimezone } from '../../utils/timezone'

interface CaptureModalProps {
  photo: CapturedPhoto | null
  onClose: () => void
  onRetake: () => void
  isLandscape?: boolean
  onUploadToDrive?: (dataUrl: string) => Promise<{ fileId: string; webViewLink?: string }>
  isDriveConnected?: boolean
  onOpenSettings?: () => void
  lastDriveResult?: { fileId: string; webViewLink?: string } | null
  isAutoUploadingDrive?: boolean
}

export const CaptureModal: React.FC<CaptureModalProps> = ({
  photo,
  onClose,
  onRetake,
  isLandscape = false,
  onUploadToDrive,
  isDriveConnected = false,
  onOpenSettings,
  lastDriveResult = null,
  isAutoUploadingDrive = false,
}) => {
  const [downloaded, setDownloaded] = useState(false)
  const [shared, setShared] = useState(false)
  const [isUploadingDrive, setIsUploadingDrive] = useState(false)
  const [driveResult, setDriveResult] = useState<{ fileId: string; webViewLink?: string } | null>(
    lastDriveResult || null
  )
  const [driveError, setDriveError] = useState<string | null>(null)

  useEffect(() => {
    if (lastDriveResult) {
      setDriveResult(lastDriveResult)
    }
  }, [lastDriveResult])

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
        const res = await onUploadToDrive(photo.dataUrl)
        setDriveResult(res)
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Gagal mengunggah ke Google Drive'
      setDriveError(msg)
    } finally {
      setIsUploadingDrive(false)
    }
  }

  if (!photo) return null

  const handleDownload = () => {
    const timestampStr = new Date()
      .toISOString()
      .replace(/[-:T]/g, '')
      .slice(0, 14)
    const filename = `LocaCamp_${timestampStr}.jpg`

    const link = document.createElement('a')
    link.href = photo.dataUrl
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    setDownloaded(true)
    setTimeout(() => setDownloaded(false), 3000)
  }

  const handleShare = async () => {
    try {
      if (navigator.share) {
        const res = await fetch(photo.dataUrl)
        const blob = await res.blob()
        const file = new File([blob], 'LocaCamp_photo.jpg', { type: 'image/jpeg' })

        if (navigator.canShare && navigator.canShare({ files: [file] })) {
          await navigator.share({
            title: 'Foto Geotag LocaCamp',
            text: `Diambil di: ${photo.location.address || 'Lokasi'} (${photo.location.latitude?.toFixed(5)}, ${photo.location.longitude?.toFixed(5)})`,
            files: [file],
          })
          setShared(true)
          setTimeout(() => setShared(false), 3000)
          return
        }
      }
      handleDownload()
    } catch {
      // User cancelled share or error
    }
  }

  const dateFormatted = photo.timestamp.toLocaleDateString('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
  const timeFormatted = formatTimeWithTimezone(photo.timestamp, photo.location.longitude)

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto overscroll-contain flex items-center justify-center p-2 sm:p-4 md:p-6 bg-black/85 backdrop-blur-xl animate-in fade-in select-none">
      {isLandscape ? (
        /* ================= MODE LANDSCAPE (SIDE PANEL LAYOUT - FOTO MAKSIMAL) ================= */
        <div
          className="relative w-[96vw] max-w-5xl h-[94dvh] my-auto bg-zinc-950 border border-zinc-800 rounded-2xl sm:rounded-3xl shadow-2xl flex flex-row overflow-hidden text-white animate-in zoom-in-95 duration-200"
          onClick={e => e.stopPropagation()}
        >
          {/* Kolom Kiri: Foto Utama Mengisi 100% Tinggi Layar */}
          <div className="relative flex-1 h-full min-w-0 bg-black/95 overflow-hidden">
            <div className="absolute inset-0 flex items-center justify-center p-2 sm:p-4">
              <img
                src={photo.dataUrl}
                alt="Captured Geotag"
                className="max-w-full max-h-full w-auto h-auto object-contain rounded-xl shadow-2xl select-none"
              />
            </div>
          </div>

          {/* Kolom Kanan: Side Control Panel & Info Geotag */}
          <div className="w-64 sm:w-72 md:w-80 shrink-0 h-full bg-zinc-950 border-l border-zinc-800 flex flex-col justify-between p-3.5 sm:p-4 overflow-y-auto">
            {/* Header Samping */}
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800/80">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                <h3 className="text-xs sm:text-sm font-semibold text-white">Hasil Foto Geotag</h3>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="p-1 rounded-full hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors"
                title="Tutup"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Kartu Informasi Geotag */}
            <div className="my-auto py-2.5 space-y-2">
              <div className="p-3 rounded-xl bg-zinc-900/90 border border-zinc-800/80 space-y-2 text-xs text-zinc-300 shadow-inner">
                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                  <p className="line-clamp-3 leading-snug font-medium text-zinc-200">
                    {photo.location.address || `${photo.location.latitude?.toFixed(4)}, ${photo.location.longitude?.toFixed(4)}`}
                  </p>
                </div>
                <div className="flex items-center gap-1.5 text-zinc-400 text-[11px] pt-1.5 border-t border-zinc-800">
                  <Calendar className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                  <span>{dateFormatted} • {timeFormatted}</span>
                </div>
              </div>
            </div>

            {/* Tombol Aksi: Unduh HD, Ambil Ulang, Share */}
            <div className="space-y-2 pt-2 border-t border-zinc-800/80">
              <button
                type="button"
                onClick={handleDownload}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-white text-zinc-950 font-bold text-xs sm:text-sm hover:bg-zinc-200 transition-all shadow-xl active:scale-95"
              >
                {downloaded ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-600 stroke-[3] shrink-0" />
                    <span className="text-emerald-700">Tersimpan!</span>
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4 shrink-0" />
                    <span>Unduh Foto (HD)</span>
                  </>
                )}
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={onRetake}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl border border-zinc-700 bg-zinc-900 hover:bg-zinc-800 text-zinc-200 font-semibold text-xs transition-all active:scale-95"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                  <span>Ambil Ulang</span>
                </button>

                {driveResult?.webViewLink ? (
                  <a
                    href={driveResult.webViewLink}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2.5 rounded-xl border border-emerald-500/40 bg-emerald-950/40 hover:bg-emerald-900/50 text-emerald-300 transition-all active:scale-95 shrink-0 flex items-center gap-1"
                    title="Buka Foto di Google Drive"
                  >
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <ExternalLink className="w-3 h-3 text-emerald-400" />
                  </a>
                ) : (
                  <button
                    type="button"
                    onClick={handleDriveUpload}
                    disabled={isUploadingDrive}
                    className="p-2.5 rounded-xl border border-zinc-700 bg-zinc-900 hover:bg-zinc-800 text-zinc-200 transition-all active:scale-95 shrink-0"
                    title={isDriveConnected ? 'Upload ke Google Drive' : 'Kaitkan Akun Google Drive'}
                  >
                    {isUploadingDrive ? (
                      <Loader2 className="w-4 h-4 animate-spin text-emerald-400" />
                    ) : (
                      <Cloud className={`w-4 h-4 ${isDriveConnected ? 'text-emerald-400' : 'text-zinc-400'}`} />
                    )}
                  </button>
                )}

                <button
                  type="button"
                  onClick={handleShare}
                  className="p-2.5 rounded-xl border border-zinc-700 bg-zinc-900 hover:bg-zinc-800 text-zinc-200 transition-all active:scale-95 shrink-0"
                  title="Bagikan Foto"
                >
                  {shared ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
                </button>
              </div>
              {driveError && (
                <p className="text-[10px] text-rose-400 mt-1">{driveError}</p>
              )}
            </div>
          </div>
        </div>
      ) : (
        /* ================= MODE PORTRAIT (STACKED VERTICAL LAYOUT) ================= */
        <div
          className="relative w-full max-w-2xl my-auto bg-zinc-950 border border-zinc-800 rounded-2xl sm:rounded-3xl shadow-2xl flex flex-col max-h-[96dvh] overflow-hidden text-white animate-in zoom-in-95 duration-200"
          onClick={e => e.stopPropagation()}
        >
          {/* Top Header */}
          <div className="shrink-0 flex items-center justify-between px-4 py-2.5 sm:px-5 sm:py-3.5 border-b border-zinc-800 bg-zinc-900/80">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
              <h3 className="text-xs sm:text-sm font-semibold text-white">Hasil Foto Geotag</h3>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-1 rounded-full hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors"
              title="Tutup"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Photo Container */}
          <div className="relative flex-1 min-h-[240px] md:min-h-[320px] w-full bg-black/95 overflow-hidden">
            <div className="absolute inset-0 flex items-center justify-center p-2 sm:p-3">
              <img
                src={photo.dataUrl}
                alt="Captured Geotag"
                className="max-w-full max-h-full w-auto h-auto object-contain rounded-lg sm:rounded-xl shadow-2xl select-none"
              />
            </div>
          </div>

          {/* Photo Details Banner */}
          <div className="shrink-0 px-4 py-2 sm:px-5 sm:py-2.5 bg-zinc-900/80 border-t border-zinc-800/80 flex flex-wrap items-center justify-between gap-1.5 text-[11px] sm:text-xs text-zinc-300">
            <div className="flex items-center gap-1.5 min-w-0">
              <MapPin className="w-3.5 h-3.5 text-rose-400 shrink-0" />
              <span className="truncate max-w-[220px] sm:max-w-xs md:max-w-md">
                {photo.location.address || `${photo.location.latitude?.toFixed(4)}, ${photo.location.longitude?.toFixed(4)}`}
              </span>
            </div>
            <div className="flex items-center gap-1 text-zinc-400 shrink-0">
              <Calendar className="w-3.5 h-3.5" />
              <span>{dateFormatted} {timeFormatted}</span>
            </div>
          </div>

          {driveError && (
            <div className="px-4 py-1.5 bg-rose-500/10 text-rose-300 text-xs border-t border-rose-500/20 text-center">
              {driveError}
            </div>
          )}

          {/* Action Buttons */}
          <div className="shrink-0 p-3 sm:p-4 md:p-5 bg-zinc-950 border-t border-zinc-800 flex items-center gap-2 sm:gap-3">
            <button
              type="button"
              onClick={onRetake}
              className="flex-1 flex items-center justify-center gap-1.5 sm:gap-2 py-2.5 sm:py-3 px-3 sm:px-4 rounded-xl border border-zinc-700 bg-zinc-900 hover:bg-zinc-800 text-zinc-200 font-semibold text-xs sm:text-sm transition-all active:scale-95"
            >
              <RotateCcw className="w-4 h-4 text-zinc-400 shrink-0" />
              <span>Ambil Ulang</span>
            </button>

            {driveResult?.webViewLink ? (
              <a
                href={driveResult.webViewLink}
                target="_blank"
                rel="noreferrer"
                className="p-2.5 sm:p-3 rounded-xl border border-emerald-500/40 bg-emerald-950/40 hover:bg-emerald-900/50 text-emerald-300 transition-all active:scale-95 shrink-0 flex items-center gap-1.5"
                title="Buka Foto di Google Drive"
              >
                <Check className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-400" />
                <ExternalLink className="w-3.5 h-3.5 text-emerald-400" />
              </a>
            ) : (
              <button
                type="button"
                onClick={handleDriveUpload}
                disabled={isUploadingDrive || isAutoUploadingDrive}
                className="p-2.5 sm:p-3 rounded-xl border border-zinc-700 bg-zinc-900 hover:bg-zinc-800 text-zinc-200 transition-all active:scale-95 shrink-0"
                title={isDriveConnected ? 'Upload ke Google Drive' : 'Kaitkan Akun Google Drive'}
              >
                {isUploadingDrive || isAutoUploadingDrive ? (
                  <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin text-emerald-400" />
                ) : (
                  <Cloud className={`w-4 h-4 sm:w-5 sm:h-5 ${isDriveConnected ? 'text-emerald-400' : 'text-zinc-400'}`} />
                )}
              </button>
            )}

            <button
              type="button"
              onClick={handleShare}
              className="p-2.5 sm:p-3 rounded-xl border border-zinc-700 bg-zinc-900 hover:bg-zinc-800 text-zinc-200 transition-all active:scale-95 shrink-0"
              title="Bagikan Foto"
            >
              {shared ? <Check className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-400" /> : <Share2 className="w-4 h-4 sm:w-5 sm:h-5" />}
            </button>

            <button
              type="button"
              onClick={handleDownload}
              className="flex-1 flex items-center justify-center gap-1.5 sm:gap-2 py-2.5 sm:py-3 px-4 sm:px-5 rounded-xl bg-white text-zinc-950 font-bold text-xs sm:text-sm hover:bg-zinc-200 transition-all shadow-xl active:scale-95"
            >
              {downloaded ? (
                <>
                  <Check className="w-4 h-4 text-emerald-600 stroke-[3] shrink-0" />
                  <span className="text-emerald-700">Tersimpan!</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4 shrink-0" />
                  <span>Unduh Foto (HD)</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
