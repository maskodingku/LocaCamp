import React, { useState } from 'react'
import {
  Download,
  Trash2,
  ExternalLink,
  Calendar,
  HardDrive,
  Loader2,
  Check,
} from 'lucide-react'
import type { GoogleDriveFile } from '../../../types/drive'

interface DrivePhotoCardProps {
  file: GoogleDriveFile
  onDownload: (file: GoogleDriveFile) => Promise<void>
  onDeleteRequest: (file: GoogleDriveFile) => void
}

function formatBytes(bytes?: number | string): string {
  if (!bytes) return ''
  const b = typeof bytes === 'string' ? parseInt(bytes, 10) : bytes
  if (isNaN(b) || b <= 0) return ''
  if (b < 1024) return `${b} B`
  if (b < 1024 * 1024) return `${(b / 1024).toFixed(1)} KB`
  return `${(b / (1024 * 1024)).toFixed(1)} MB`
}

function formatDate(isoString?: string): string {
  if (!isoString) return ''
  try {
    const d = new Date(isoString)
    return d.toLocaleDateString('id-ID', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  } catch {
    return ''
  }
}

export const DrivePhotoCard: React.FC<DrivePhotoCardProps> = ({
  file,
  onDownload,
  onDeleteRequest,
}) => {
  const [isDownloading, setIsDownloading] = useState(false)
  const [downloadSuccess, setDownloadSuccess] = useState(false)

  const handleDownload = async () => {
    setIsDownloading(true)
    try {
      await onDownload(file)
      setDownloadSuccess(true)
      setTimeout(() => setDownloadSuccess(false), 2500)
    } finally {
      setIsDownloading(false)
    }
  }

  // Gunakan thumbnailLink dengan resolusi lebih baik jika tersedia
  const thumbnailSrc = file.thumbnailLink
    ? file.thumbnailLink.replace(/=s\d+/, '=s400')
    : ''

  return (
    <div className="flex flex-col bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden shadow-lg hover:border-zinc-700 transition-all group">
      {/* Thumbnail Container */}
      <div className="relative aspect-video bg-black overflow-hidden flex items-center justify-center">
        {thumbnailSrc ? (
          <img
            src={thumbnailSrc}
            alt={file.name}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex flex-col items-center justify-center text-zinc-600 gap-1 p-4">
            <HardDrive className="w-8 h-8 stroke-1" />
            <span className="text-[10px]">Google Drive</span>
          </div>
        )}

        {/* Badge Google Drive */}
        <div className="absolute top-2 left-2 bg-black/75 backdrop-blur-md px-2 py-0.5 rounded-full border border-emerald-500/30 text-[10px] font-semibold text-emerald-400 flex items-center gap-1 shadow-md">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span>Drive</span>
        </div>

        {/* Link Buka di Google Drive Web */}
        {file.webViewLink && (
          <a
            href={file.webViewLink}
            target="_blank"
            rel="noreferrer"
            className="absolute top-2 right-2 p-1.5 rounded-xl bg-black/70 hover:bg-black/90 text-zinc-300 hover:text-white border border-zinc-700/60 backdrop-blur-md transition-colors"
            title="Buka di web Google Drive"
          >
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        )}
      </div>

      {/* Info File */}
      <div className="p-3.5 flex-1 flex flex-col justify-between space-y-3">
        <div className="space-y-1">
          <p className="text-xs font-bold text-white truncate" title={file.name}>
            {file.name}
          </p>
          <div className="flex items-center justify-between text-[11px] text-zinc-400">
            <span className="flex items-center gap-1">
              <Calendar className="w-3 h-3 text-zinc-500" />
              <span>{formatDate(file.createdTime || file.modifiedTime)}</span>
            </span>
            {file.size && <span>{formatBytes(file.size)}</span>}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 pt-2 border-t border-zinc-800/80">
          <button
            type="button"
            onClick={handleDownload}
            disabled={isDownloading}
            className={`h-9.5 flex-1 flex items-center justify-center gap-1.5 px-3 rounded-xl font-black text-xs transition-all active:scale-95 cursor-pointer relative overflow-hidden group shadow-[0_2px_10px_rgba(34,211,238,0.25)] ${
              downloadSuccess
                ? 'bg-gradient-to-r from-emerald-400 to-teal-500 text-black'
                : 'bg-gradient-to-r from-cyan-400 via-sky-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-black'
            }`}
            title="Unduh File dari Google Drive"
          >
            {/* Highlight Glare */}
            <div className="absolute top-0 inset-x-2 h-[1px] bg-gradient-to-r from-transparent via-white/80 to-transparent pointer-events-none" />
            {isDownloading ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin text-black" />
            ) : downloadSuccess ? (
              <>
                <Check className="w-3.5 h-3.5 stroke-[3] shrink-0" />
                <span>Tersimpan!</span>
              </>
            ) : (
              <>
                <Download className="w-3.5 h-3.5 stroke-[2.5] shrink-0" />
                <span>Unduh</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={() => onDeleteRequest(file)}
            className="w-9.5 h-9.5 rounded-xl border border-rose-500/30 bg-gradient-to-b from-[#3a0b12]/90 via-[#25080e]/95 to-[#160408]/95 hover:border-rose-400/60 text-rose-300 hover:text-white shadow-[0_2px_8px_rgba(0,0,0,0.5),inset_0_1px_1px_rgba(255,255,255,0.2)] flex items-center justify-center shrink-0 active:scale-95 transition-all cursor-pointer"
            title="Hapus dari Google Drive"
          >
            <Trash2 className="w-4 h-4 text-rose-400 drop-shadow-[0_0_3px_rgba(244,63,94,0.7)]" />
          </button>
        </div>
      </div>
    </div>
  )
}
