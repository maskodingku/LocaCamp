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
        <div className="flex items-center gap-1.5 pt-1 border-t border-zinc-800/80">
          <button
            type="button"
            onClick={handleDownload}
            disabled={isDownloading}
            className={`flex-1 py-2 px-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              downloadSuccess
                ? 'bg-emerald-500 text-black'
                : 'bg-zinc-800 hover:bg-zinc-700 text-white'
            }`}
          >
            {isDownloading ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin text-emerald-400" />
            ) : downloadSuccess ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Tersimpan</span>
              </>
            ) : (
              <>
                <Download className="w-3.5 h-3.5" />
                <span>Unduh</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={() => onDeleteRequest(file)}
            className="p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 transition-colors cursor-pointer"
            title="Hapus dari Google Drive"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  )
}
