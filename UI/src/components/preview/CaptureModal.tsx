import React, { useState, useEffect, useMemo } from 'react'
import {
  Download,
  RotateCcw,
  Share2,
  Check,
  Calendar,
  MapPin,
  X,
  Loader2,
  FileImage,
  Maximize2,
} from 'lucide-react'
import type { CapturedPhoto } from '../../types/camera'
import { formatTimeWithTimezone } from '../../utils/timezone'
import { DriveUploadProgressBanner } from './DriveUploadProgressBanner'
import { GoogleDriveIcon } from '../settings/gdrive/GoogleDriveIcon'

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
  uploadProgress?: number
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
  uploadProgress = 0,
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

  // Menghitung ukuran file dari dataUrl base64
  const fileSizeFormatted = useMemo(() => {
    if (!photo.dataUrl) return ''
    const base64Data = photo.dataUrl.split(',')[1] || ''
    const padding = base64Data.endsWith('==') ? 2 : base64Data.endsWith('=') ? 1 : 0
    const bytes = Math.round((base64Data.length * 3) / 4 - padding)
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`
  }, [photo.dataUrl])

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto overscroll-contain flex items-center justify-center p-0 sm:p-4 md:p-6 bg-black/85 backdrop-blur-xl animate-in fade-in select-none">
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

            {/* Kartu Informasi Geotag - Cyber Glass HUD */}
            <div className="my-auto py-2.5 space-y-2">
              <div className="p-3 rounded-2xl bg-gradient-to-r from-[#03152e]/95 via-[#062042]/90 to-[#020d1c]/95 border border-cyan-500/20 space-y-2 text-xs text-zinc-300 shadow-[inset_0_1px_1.5px_rgba(255,255,255,0.15)]">
                <div className="flex items-start gap-2">
                  <div className="w-5 h-5 rounded-md bg-rose-500/15 border border-rose-500/30 flex items-center justify-center shrink-0 shadow-[0_0_8px_rgba(244,63,94,0.3)] mt-0.5">
                    <MapPin className="w-3 h-3 text-rose-400 drop-shadow-[0_0_3px_rgba(244,63,94,0.8)]" />
                  </div>
                  <p className="line-clamp-3 leading-snug font-medium text-slate-100">
                    {photo.location.address || `${photo.location.latitude?.toFixed(4)}, ${photo.location.longitude?.toFixed(4)}`}
                  </p>
                </div>
                <div className="flex items-center gap-2 text-cyan-200/90 font-mono text-[11px] pt-1.5 border-t border-cyan-500/20">
                  <div className="w-4 h-4 rounded-md bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center shrink-0 shadow-[0_0_6px_rgba(34,211,238,0.3)]">
                    <Calendar className="w-2.5 h-2.5 text-cyan-300 drop-shadow-[0_0_3px_rgba(34,211,238,0.8)]" />
                  </div>
                  <span>{dateFormatted} • {timeFormatted}</span>
                </div>
                <div className="flex items-center justify-between gap-2 text-emerald-200/90 font-mono text-[11px] pt-1.5 border-t border-cyan-500/20">
                  <div className="flex items-center gap-1.5">
                    <div className="w-4 h-4 rounded-md bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center shrink-0 shadow-[0_0_6px_rgba(52,211,153,0.3)]">
                      <FileImage className="w-2.5 h-2.5 text-emerald-400 drop-shadow-[0_0_3px_rgba(52,211,153,0.8)]" />
                    </div>
                    <span>{fileSizeFormatted}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-cyan-300/90">
                    <div className="w-4 h-4 rounded-md bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center shrink-0 shadow-[0_0_6px_rgba(34,211,238,0.3)]">
                      <Maximize2 className="w-2.5 h-2.5 text-cyan-300 drop-shadow-[0_0_3px_rgba(34,211,238,0.8)]" />
                    </div>
                    <span>{photo.width}×{photo.height}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Banner Progres Upload Google Drive (Keren dengan persentase & animasi) */}
            {(isUploadingDrive || isAutoUploadingDrive || Boolean(driveResult?.webViewLink) || Boolean(driveError)) && (
              <div className="py-1">
                <DriveUploadProgressBanner
                  isUploading={isUploadingDrive || isAutoUploadingDrive}
                  progress={uploadProgress}
                  driveResult={driveResult}
                  driveError={driveError}
                  onRetry={handleDriveUpload}
                />
              </div>
            )}

            {/* Tombol Aksi: Unduh HD, Ambil Ulang, Drive, Share */}
            <div className="space-y-2 pt-2 border-t border-cyan-500/20">
              <button
                type="button"
                onClick={handleDownload}
                className="w-full h-11 sm:h-12 flex items-center justify-center gap-2 px-4 rounded-2xl bg-gradient-to-r from-cyan-400 via-sky-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-black font-black text-xs sm:text-sm shadow-[0_4px_16px_rgba(34,211,238,0.45),inset_0_1.5px_2px_rgba(255,255,255,0.95)] active:scale-95 transition-all whitespace-nowrap cursor-pointer relative overflow-hidden group"
              >
                <div className="absolute top-0 inset-x-2 h-[1px] bg-gradient-to-r from-transparent via-white/80 to-transparent pointer-events-none" />
                {downloaded ? (
                  <>
                    <Check className="w-4 h-4 text-black stroke-[3] shrink-0" />
                    <span>Tersimpan!</span>
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4 text-black stroke-[2.5] shrink-0" />
                    <span>Unduh HD</span>
                  </>
                )}
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={onRetake}
                  className="flex-1 h-11 flex items-center justify-center gap-1.5 px-3 rounded-2xl bg-gradient-to-b from-[#092244]/90 via-[#04152d]/95 to-[#020a16]/95 border border-white/20 hover:border-cyan-400/50 text-slate-100 hover:text-white font-bold text-xs shadow-[0_4px_12px_rgba(0,0,0,0.5),inset_0_1px_1.5px_rgba(255,255,255,0.4)] active:scale-95 transition-all whitespace-nowrap cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-cyan-300 drop-shadow-[0_0_4px_rgba(34,211,238,0.7)] shrink-0" />
                  <span>Ambil Ulang</span>
                </button>

                {Boolean(driveResult || photo.uploadedToDrive) ? (
                  <div
                    className="w-11 h-11 rounded-2xl border border-emerald-500/40 bg-gradient-to-b from-emerald-950/60 to-[#020e1a]/95 text-emerald-300 transition-all shrink-0 flex items-center justify-center cursor-default select-none shadow-[0_4px_12px_rgba(0,0,0,0.5)]"
                    title="Foto ini sudah tersimpan di Google Drive"
                  >
                    <div className="relative flex items-center justify-center">
                      <GoogleDriveIcon className="w-4 h-4 shrink-0" />
                      <div className="absolute -bottom-1 -right-1.5 w-3.5 h-3.5 rounded-full bg-emerald-500 text-black flex items-center justify-center shadow-sm">
                        <Check className="w-2.5 h-2.5 stroke-[3]" />
                      </div>
                    </div>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={handleDriveUpload}
                    disabled={isUploadingDrive || isAutoUploadingDrive}
                    className="w-11 h-11 rounded-2xl bg-gradient-to-b from-[#092244]/90 via-[#04152d]/95 to-[#020a16]/95 border border-white/20 hover:border-cyan-400/50 text-slate-200 hover:text-white shadow-[0_4px_12px_rgba(0,0,0,0.5),inset_0_1px_1.5px_rgba(255,255,255,0.4)] flex items-center justify-center shrink-0 active:scale-95 transition-all cursor-pointer disabled:opacity-50"
                    title={isDriveConnected ? 'Upload ke Google Drive' : 'Kaitkan Akun Google Drive'}
                  >
                    {isUploadingDrive || isAutoUploadingDrive ? (
                      <div className="flex flex-col items-center justify-center font-mono text-emerald-400 font-bold text-[9px]">
                        <Loader2 className="w-3.5 h-3.5 animate-spin text-emerald-400" />
                        <span>{uploadProgress}%</span>
                      </div>
                    ) : (
                      <GoogleDriveIcon className="w-4 h-4 shrink-0" />
                    )}
                  </button>
                )}

                <button
                  type="button"
                  onClick={handleShare}
                  className="w-11 h-11 rounded-2xl bg-gradient-to-b from-[#092244]/90 via-[#04152d]/95 to-[#020a16]/95 border border-white/20 hover:border-cyan-400/50 text-slate-200 hover:text-white shadow-[0_4px_12px_rgba(0,0,0,0.5),inset_0_1px_1.5px_rgba(255,255,255,0.4)] flex items-center justify-center shrink-0 active:scale-95 transition-all cursor-pointer"
                  title="Bagikan Foto"
                >
                  {shared ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* ================= MODE PORTRAIT (STACKED VERTICAL LAYOUT) ================= */
        <div
          className="relative w-full sm:max-w-2xl h-[100dvh] sm:h-auto sm:max-h-[96dvh] sm:my-auto bg-zinc-950 border-0 sm:border border-zinc-800 rounded-none sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden text-white animate-in zoom-in-95 duration-200"
          onClick={e => e.stopPropagation()}
        >
          {/* Top Header */}
          <div className="shrink-0 flex items-center justify-between px-4 pt-[max(0.75rem,env(safe-area-inset-top))] pb-2.5 sm:px-5 sm:py-3.5 border-b border-zinc-800 bg-zinc-900/80">
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
          <div className="relative flex-1 min-h-0 w-full bg-black/95 overflow-hidden">
            <div className="absolute inset-0 flex items-center justify-center p-2 sm:p-3">
              <img
                src={photo.dataUrl}
                alt="Captured Geotag"
                className="max-w-full max-h-full w-auto h-auto object-contain rounded-lg sm:rounded-xl shadow-2xl select-none"
              />
            </div>
          </div>

          {/* Photo Details Banner - Cyber Glassmorphism HUD Strip (70% Kiri, 30% Kanan) */}
          <div className="shrink-0 px-3.5 py-2.5 sm:px-5 sm:py-3 bg-gradient-to-r from-[#03152e]/95 via-[#062042]/90 to-[#020d1c]/95 border-t border-cyan-500/20 text-xs relative overflow-hidden backdrop-blur-xl">
            {/* Top Specular Line */}
            <div className="absolute top-0 inset-x-6 h-[1px] bg-gradient-to-r from-transparent via-cyan-300/35 to-transparent pointer-events-none" />

            <div className="flex items-center justify-between gap-2">
              {/* Kolom Kiri: Lokasi & Waktu Jepret (70% Lebar) */}
              <div className="w-[70%] min-w-0 pr-1 space-y-1.5">
                {/* Baris 1: Alamat Lokasi */}
                <div className="flex items-center gap-1.5 min-w-0">
                  <div className="w-4.5 h-4.5 rounded-md bg-rose-500/15 border border-rose-500/30 flex items-center justify-center shrink-0 shadow-[0_0_6px_rgba(244,63,94,0.3)]">
                    <MapPin className="w-2.5 h-2.5 text-rose-400 drop-shadow-[0_0_2px_rgba(244,63,94,0.8)]" />
                  </div>
                  <span className="truncate text-[11px] sm:text-xs font-semibold text-slate-100 tracking-wide drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
                    {photo.location.address || `${photo.location.latitude?.toFixed(4)}, ${photo.location.longitude?.toFixed(4)}`}
                  </span>
                </div>

                {/* Baris 2: Waktu Jepret */}
                <div className="flex items-center gap-1.5 min-w-0">
                  <div className="w-4.5 h-4.5 rounded-md bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center shrink-0 shadow-[0_0_6px_rgba(34,211,238,0.3)]">
                    <Calendar className="w-2.5 h-2.5 text-cyan-300 drop-shadow-[0_0_2px_rgba(34,211,238,0.8)]" />
                  </div>
                  <span className="font-mono text-[10.5px] sm:text-[11px] font-bold text-cyan-200/90 tracking-wide truncate drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
                    {dateFormatted} {timeFormatted}
                  </span>
                </div>
              </div>

              {/* Pembatas Vertikal Cyber Line */}
              <div className="w-[1px] self-stretch bg-gradient-to-b from-transparent via-cyan-400/40 to-transparent shrink-0" />

              {/* Kolom Kanan: Ukuran Size File & Resolusi Gambar (30% Lebar) */}
              <div className="w-[30%] min-w-0 pl-1 space-y-1.5 flex flex-col justify-center shrink-0">
                {/* Baris 1: Ukuran Size File */}
                <div className="flex items-center gap-1.5 justify-start min-w-0">
                  <div className="w-4.5 h-4.5 rounded-md bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center shrink-0 shadow-[0_0_6px_rgba(52,211,153,0.3)]">
                    <FileImage className="w-2.5 h-2.5 text-emerald-400 drop-shadow-[0_0_2px_rgba(52,211,153,0.8)]" />
                  </div>
                  <span className="font-mono text-[10.5px] sm:text-[11px] font-bold text-emerald-200/90 tracking-wide truncate drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
                    {fileSizeFormatted}
                  </span>
                </div>

                {/* Baris 2: Resolusi Gambar */}
                <div className="flex items-center gap-1.5 justify-start min-w-0">
                  <div className="w-4.5 h-4.5 rounded-md bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center shrink-0 shadow-[0_0_6px_rgba(34,211,238,0.3)]">
                    <Maximize2 className="w-2.5 h-2.5 text-cyan-300 drop-shadow-[0_0_2px_rgba(34,211,238,0.8)]" />
                  </div>
                  <span className="font-mono text-[10.5px] sm:text-[11px] font-bold text-cyan-200/90 tracking-wide truncate drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
                    {photo.width}×{photo.height}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Banner Progres Upload Google Drive (Keren dengan persentase & animasi) */}
          {(isUploadingDrive || isAutoUploadingDrive || Boolean(driveResult?.webViewLink) || Boolean(driveError)) && (
            <div className="shrink-0 px-3.5 sm:px-5 py-2 bg-[#020b18]/95 border-t border-cyan-500/15">
              <DriveUploadProgressBanner
                isUploading={isUploadingDrive || isAutoUploadingDrive}
                progress={uploadProgress}
                driveResult={driveResult}
                driveError={driveError}
                onRetry={handleDriveUpload}
              />
            </div>
          )}

          {/* Action Buttons - Unified Cyber Glassmorphism Toolbar (Dempet Langsung dengan Garis Tunggal) */}
          <div className="shrink-0 p-3 pb-[max(1rem,env(safe-area-inset-bottom))] sm:p-4 bg-gradient-to-b from-[#020d1c]/95 to-[#01060f]/98 border-t border-cyan-500/20 flex items-center gap-2 sm:gap-2.5">
            {/* Tombol Ambil Ulang */}
            <button
              type="button"
              onClick={onRetake}
              className="h-11 sm:h-12 flex-1 flex items-center justify-center gap-1.5 px-3 rounded-2xl bg-gradient-to-b from-[#092244]/90 via-[#04152d]/95 to-[#020a16]/95 border border-white/20 hover:border-cyan-400/50 text-slate-100 hover:text-white font-bold text-xs sm:text-sm shadow-[0_4px_12px_rgba(0,0,0,0.5),inset_0_1px_1.5px_rgba(255,255,255,0.4)] active:scale-95 transition-all whitespace-nowrap cursor-pointer"
            >
              <RotateCcw className="w-4 h-4 text-cyan-300 drop-shadow-[0_0_4px_rgba(34,211,238,0.7)] shrink-0" />
              <span>Ambil Ulang</span>
            </button>

            {/* Tombol Google Drive */}
            {Boolean(driveResult || photo.uploadedToDrive) ? (
              <div
                className="w-11 sm:w-12 h-11 sm:h-12 rounded-2xl border border-emerald-500/40 bg-gradient-to-b from-emerald-950/60 to-[#020e1a]/95 text-emerald-300 transition-all shrink-0 flex items-center justify-center cursor-default select-none shadow-[0_4px_12px_rgba(0,0,0,0.5),0_0_10px_rgba(52,211,153,0.2)]"
                title="Foto ini sudah tersimpan di Google Drive"
              >
                <div className="relative flex items-center justify-center">
                  <GoogleDriveIcon className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
                  <div className="absolute -bottom-1 -right-1.5 w-3.5 h-3.5 rounded-full bg-emerald-500 text-black flex items-center justify-center shadow-sm">
                    <Check className="w-2.5 h-2.5 stroke-[3]" />
                  </div>
                </div>
              </div>
            ) : (
              <button
                type="button"
                onClick={handleDriveUpload}
                disabled={isUploadingDrive || isAutoUploadingDrive}
                className="w-11 sm:w-12 h-11 sm:h-12 rounded-2xl bg-gradient-to-b from-[#092244]/90 via-[#04152d]/95 to-[#020a16]/95 border border-white/20 hover:border-cyan-400/50 text-slate-200 hover:text-white shadow-[0_4px_12px_rgba(0,0,0,0.5),inset_0_1px_1.5px_rgba(255,255,255,0.4)] flex items-center justify-center shrink-0 active:scale-95 transition-all cursor-pointer disabled:opacity-50"
                title={isDriveConnected ? 'Upload ke Google Drive' : 'Kaitkan Akun Google Drive'}
              >
                {isUploadingDrive || isAutoUploadingDrive ? (
                  <div className="flex flex-col items-center justify-center font-mono text-emerald-400 font-black text-[9.5px]">
                    <Loader2 className="w-4 h-4 animate-spin text-emerald-400" />
                    <span>{uploadProgress}%</span>
                  </div>
                ) : (
                  <GoogleDriveIcon className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
                )}
              </button>
            )}

            {/* Tombol Bagikan */}
            <button
              type="button"
              onClick={handleShare}
              className="w-11 sm:w-12 h-11 sm:h-12 rounded-2xl bg-gradient-to-b from-[#092244]/90 via-[#04152d]/95 to-[#020a16]/95 border border-white/20 hover:border-cyan-400/50 text-slate-200 hover:text-white shadow-[0_4px_12px_rgba(0,0,0,0.5),inset_0_1px_1.5px_rgba(255,255,255,0.4)] flex items-center justify-center shrink-0 active:scale-95 transition-all cursor-pointer"
              title="Bagikan Foto"
            >
              {shared ? (
                <Check className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-400" />
              ) : (
                <Share2 className="w-4 h-4 sm:w-5 sm:h-5" />
              )}
            </button>

            {/* Tombol Hero: Unduh Foto HD */}
            <button
              type="button"
              onClick={handleDownload}
              className="h-11 sm:h-12 flex-[1.15] flex items-center justify-center gap-1.5 px-3.5 rounded-2xl bg-gradient-to-r from-cyan-400 via-sky-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-black font-black text-xs sm:text-sm shadow-[0_4px_16px_rgba(34,211,238,0.45),inset_0_1.5px_2px_rgba(255,255,255,0.95)] active:scale-95 transition-all whitespace-nowrap cursor-pointer relative overflow-hidden group"
            >
              {/* Highlight Glare */}
              <div className="absolute top-0 inset-x-2 h-[1px] bg-gradient-to-r from-transparent via-white/80 to-transparent pointer-events-none" />
              {downloaded ? (
                <>
                  <Check className="w-4 h-4 text-black stroke-[3] shrink-0" />
                  <span>Tersimpan!</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4 text-black stroke-[2.5] shrink-0" />
                  <span>Unduh HD</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
