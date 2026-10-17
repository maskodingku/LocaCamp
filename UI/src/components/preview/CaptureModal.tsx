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
import { ZoomablePhotoViewer } from './ZoomablePhotoViewer'

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

  // Menghitung ukuran file dari dataUrl base64 (wajib di atas sebelum conditional return sesuai Rules of Hooks)
  const fileSizeFormatted = useMemo(() => {
    if (!photo?.dataUrl) return ''
    const base64Data = photo.dataUrl.split(',')[1] || ''
    const padding = base64Data.endsWith('==') ? 2 : base64Data.endsWith('=') ? 1 : 0
    const bytes = Math.round((base64Data.length * 3) / 4 - padding)
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`
  }, [photo?.dataUrl])

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
    <div
      className={`fixed inset-0 z-50 overflow-hidden overscroll-contain flex items-center justify-center select-none ${
        isLandscape ? 'p-0 bg-black' : 'p-0 sm:p-4 md:p-6 bg-black/85 backdrop-blur-xl'
      } animate-in fade-in`}
    >
      {isLandscape ? (
        /* ================= MODE LANDSCAPE (FULLSCREEN EDGE-TO-EDGE FOTO MAKSIMAL) ================= */
        <div
          className="relative w-full h-[100dvh] bg-black border-0 rounded-none flex flex-row overflow-hidden text-white animate-in fade-in duration-150 pl-[env(safe-area-inset-left)] pr-[env(safe-area-inset-right)]"
          onClick={e => e.stopPropagation()}
        >
          {/* Kolom Kiri: Foto Utama Mengisi Penuh 100% Layar Kiri, Atas, dan Bawah */}
          <div className="relative flex-1 h-full min-w-0 bg-black overflow-hidden">
            <ZoomablePhotoViewer src={photo.dataUrl} alt="Captured Geotag" />
          </div>

          {/* Kolom Kanan: Side Control Panel & Info Geotag (Ramping & Docked Cyber Panel) */}
          <div className="w-48 sm:w-52 md:w-56 shrink-0 h-full bg-gradient-to-b from-[#03152e]/95 via-[#041935]/95 to-[#020c1a]/98 border-l border-cyan-500/25 flex flex-col justify-between overflow-hidden shadow-2xl">
            {/* Header Samping Ringkas */}
            <div className="shrink-0 flex items-center justify-between px-2.5 py-2 pt-[max(0.5rem,env(safe-area-inset-top))] border-b border-cyan-500/20 bg-black/40 backdrop-blur-md">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <h3 className="text-[11px] sm:text-xs font-semibold text-white tracking-tight">Hasil Foto Geotag</h3>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="p-1 rounded-lg hover:bg-white/10 text-zinc-400 hover:text-white transition-colors"
                title="Tutup"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Area Tengah: Info Geotag HUD & Banner Drive (Mengisi Ruang Proporsional Tanpa Celah Menganga) */}
            <div className="flex-1 min-h-0 p-2 sm:p-2.5 overflow-y-auto space-y-2 flex flex-col justify-start">
              {/* Kartu Informasi Geotag HUD */}
              <div className="p-2 sm:p-2.5 rounded-xl bg-black/40 border border-cyan-500/25 space-y-2 text-[11px] text-zinc-300 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)]">
                {/* Baris 1: Alamat Lokasi & Koordinat */}
                <div className="space-y-1">
                  <div className="flex items-start gap-1.5">
                    <div className="w-4 h-4 rounded-md bg-rose-500/15 border border-rose-500/30 flex items-center justify-center shrink-0 shadow-[0_0_6px_rgba(244,63,94,0.3)] mt-0.5">
                      <MapPin className="w-2.5 h-2.5 text-rose-400 drop-shadow-[0_0_2px_rgba(244,63,94,0.8)]" />
                    </div>
                    <p className="line-clamp-2 leading-tight font-medium text-slate-100 text-[11px]">
                      {photo.location.address || `${photo.location.latitude?.toFixed(4)}, ${photo.location.longitude?.toFixed(4)}`}
                    </p>
                  </div>
                  {photo.location.latitude && photo.location.longitude && (
                    <div className="pl-5 text-[9px] font-mono text-cyan-300/80 truncate">
                      {photo.location.latitude.toFixed(5)}, {photo.location.longitude.toFixed(5)}
                    </div>
                  )}
                </div>

                {/* Baris 2: Waktu Jepret */}
                <div className="flex items-center gap-1.5 text-cyan-200/90 font-mono text-[10px] pt-1.5 border-t border-cyan-500/15">
                  <div className="w-3.5 h-3.5 rounded-md bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center shrink-0 shadow-[0_0_4px_rgba(34,211,238,0.3)]">
                    <Calendar className="w-2 h-2 text-cyan-300 drop-shadow-[0_0_2px_rgba(34,211,238,0.8)]" />
                  </div>
                  <span className="truncate">{dateFormatted} • {timeFormatted}</span>
                </div>

                {/* Baris 3: Ukuran File & Resolusi */}
                <div className="flex items-center justify-between gap-1 font-mono text-[10px] pt-1.5 border-t border-cyan-500/15">
                  <div className="flex items-center gap-1 text-emerald-200/90">
                    <div className="w-3.5 h-3.5 rounded-md bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center shrink-0 shadow-[0_0_4px_rgba(52,211,153,0.3)]">
                      <FileImage className="w-2 h-2 text-emerald-400 drop-shadow-[0_0_2px_rgba(52,211,153,0.8)]" />
                    </div>
                    <span>{fileSizeFormatted}</span>
                  </div>
                  <div className="flex items-center gap-1 text-cyan-300/90">
                    <div className="w-3.5 h-3.5 rounded-md bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center shrink-0 shadow-[0_0_4px_rgba(34,211,238,0.3)]">
                      <Maximize2 className="w-2 h-2 text-cyan-300 drop-shadow-[0_0_2px_rgba(34,211,238,0.8)]" />
                    </div>
                    <span>{photo.width}×{photo.height}</span>
                  </div>
                </div>
              </div>

              {/* Status Badge Live Geotag */}
              <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-cyan-950/40 border border-cyan-500/20 text-cyan-300/80 font-mono text-[9px] tracking-wider uppercase select-none">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping shrink-0" />
                <span className="truncate">Geotag Presisi Satelit</span>
              </div>

              {/* Banner Progres Upload Google Drive (Kondisional) */}
              {(isUploadingDrive || isAutoUploadingDrive || Boolean(driveResult?.webViewLink) || Boolean(driveError)) && (
                <div>
                  <DriveUploadProgressBanner
                    isUploading={isUploadingDrive || isAutoUploadingDrive}
                    progress={uploadProgress}
                    driveResult={driveResult}
                    driveError={driveError}
                    onRetry={handleDriveUpload}
                  />
                </div>
              )}
            </div>

            {/* Bottom Action Dock: Tombol Aksi Menempel Rapi di Dasar Panel */}
            <div className="shrink-0 p-2 sm:p-2.5 pb-[max(0.5rem,env(safe-area-inset-bottom))] border-t border-cyan-500/25 bg-black/60 backdrop-blur-md space-y-1.5">
              {/* Tombol Unduh HD Utama */}
              <button
                type="button"
                onClick={handleDownload}
                className="w-full h-9.5 flex items-center justify-center gap-1.5 px-3 rounded-xl bg-gradient-to-r from-cyan-400 via-sky-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-black font-black text-xs shadow-[0_3px_12px_rgba(34,211,238,0.4),inset_0_1px_1.5px_rgba(255,255,255,0.95)] active:scale-95 transition-all whitespace-nowrap cursor-pointer relative overflow-hidden group"
              >
                <div className="absolute top-0 inset-x-2 h-[1px] bg-gradient-to-r from-transparent via-white/80 to-transparent pointer-events-none" />
                {downloaded ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-black stroke-[3] shrink-0" />
                    <span>Tersimpan!</span>
                  </>
                ) : (
                  <>
                    <Download className="w-3.5 h-3.5 text-black stroke-[2.5] shrink-0" />
                    <span>Unduh HD</span>
                  </>
                )}
              </button>

              {/* Baris Tombol Aksi Pendukung */}
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={onRetake}
                  className="flex-1 h-8.5 flex items-center justify-center gap-1 px-2 rounded-xl bg-gradient-to-b from-[#092244]/90 via-[#04152d]/95 to-[#020a16]/95 border border-white/20 hover:border-cyan-400/50 text-slate-100 hover:text-white font-bold text-[11px] shadow-[0_2px_8px_rgba(0,0,0,0.5),inset_0_1px_1px_rgba(255,255,255,0.4)] active:scale-95 transition-all whitespace-nowrap cursor-pointer"
                >
                  <RotateCcw className="w-3 h-3 text-cyan-300 drop-shadow-[0_0_3px_rgba(34,211,238,0.7)] shrink-0" />
                  <span>Ambil Ulang</span>
                </button>

                {Boolean(driveResult || photo.uploadedToDrive) ? (
                  <div
                    className="w-8.5 h-8.5 rounded-xl border border-emerald-500/40 bg-gradient-to-b from-emerald-950/60 to-[#020e1a]/95 text-emerald-300 transition-all shrink-0 flex items-center justify-center cursor-default select-none shadow-[0_2px_8px_rgba(0,0,0,0.5)]"
                    title="Foto ini sudah tersimpan di Google Drive"
                  >
                    <div className="relative flex items-center justify-center">
                      <GoogleDriveIcon className="w-3.5 h-3.5 shrink-0" />
                      <div className="absolute -bottom-1 -right-1 w-3 h-3 rounded-full bg-emerald-500 text-black flex items-center justify-center shadow-sm">
                        <Check className="w-2 h-2 stroke-[3]" />
                      </div>
                    </div>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={handleDriveUpload}
                    disabled={isUploadingDrive || isAutoUploadingDrive}
                    className="w-8.5 h-8.5 rounded-xl bg-gradient-to-b from-[#092244]/90 via-[#04152d]/95 to-[#020a16]/95 border border-white/20 hover:border-cyan-400/50 text-slate-200 hover:text-white shadow-[0_2px_8px_rgba(0,0,0,0.5),inset_0_1px_1px_rgba(255,255,255,0.4)] flex items-center justify-center shrink-0 active:scale-95 transition-all cursor-pointer disabled:opacity-50"
                    title={isDriveConnected ? 'Upload ke Google Drive' : 'Kaitkan Akun Google Drive'}
                  >
                    {isUploadingDrive || isAutoUploadingDrive ? (
                      <div className="flex flex-col items-center justify-center font-mono text-emerald-400 font-bold text-[8px]">
                        <Loader2 className="w-3 h-3 animate-spin text-emerald-400" />
                      </div>
                    ) : (
                      <GoogleDriveIcon className="w-3.5 h-3.5 shrink-0" />
                    )}
                  </button>
                )}

                <button
                  type="button"
                  onClick={handleShare}
                  className="w-8.5 h-8.5 rounded-xl bg-gradient-to-b from-[#092244]/90 via-[#04152d]/95 to-[#020a16]/95 border border-white/20 hover:border-cyan-400/50 text-slate-200 hover:text-white shadow-[0_2px_8px_rgba(0,0,0,0.5),inset_0_1px_1px_rgba(255,255,255,0.4)] flex items-center justify-center shrink-0 active:scale-95 transition-all cursor-pointer"
                  title="Bagikan Foto"
                >
                  {shared ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
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

          {/* Photo Container dengan Zoom & Pan */}
          <div className="relative flex-1 min-h-0 w-full bg-black/95 overflow-hidden">
            <ZoomablePhotoViewer src={photo.dataUrl} alt="Captured Geotag" />
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
