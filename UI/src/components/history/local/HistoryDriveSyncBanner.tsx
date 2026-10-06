import React from 'react'
import {
  UploadCloud,
  Loader2,
  X,
  Layers,
} from 'lucide-react'
import { GoogleDriveIcon } from '../../settings/gdrive/GoogleDriveIcon'
import type { DriveQueueStats } from '../../../hooks/useGoogleDriveQueue'

interface HistoryDriveSyncBannerProps {
  isDriveConnected: boolean
  unuploadedCount: number
  queueStats: DriveQueueStats
  concurrency: number
  onStartUploadAll: () => void
  onCancelQueue: () => void
}

export const HistoryDriveSyncBanner: React.FC<HistoryDriveSyncBannerProps> = ({
  isDriveConnected,
  unuploadedCount,
  queueStats,
  concurrency,
  onStartUploadAll,
  onCancelQueue,
}) => {
  // Hanya tampil jika Google Drive terhubung dan ada foto yang belum diupload ATAU antrian sedang berjalan
  if (!isDriveConnected) return null
  if (unuploadedCount === 0 && !queueStats.isProcessing && queueStats.total === 0) return null

  const isUploading = queueStats.isProcessing

  return (
    <div className="shrink-0 p-3 sm:px-6 bg-gradient-to-r from-emerald-950/70 via-zinc-900/90 to-zinc-900 border-b border-emerald-500/30 text-white animate-in slide-in-from-top-2 duration-200">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Sisi Kiri: Ikon & Keterangan Status */}
        <div className="flex items-center gap-3 min-w-0">
          <div className="p-2 rounded-xl bg-zinc-950/80 border border-emerald-500/40 shadow-inner shrink-0 relative">
            <GoogleDriveIcon className="w-5 h-5 shrink-0" />
            {isUploading && (
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full animate-ping" />
            )}
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-white truncate">
                {isUploading ? 'Sinkronisasi Antrian Cloud...' : 'Pencadangan Google Drive'}
              </span>
              <span className="px-1.5 py-0.5 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-[10px] font-mono text-emerald-400 shrink-0 flex items-center gap-1">
                <Layers className="w-2.5 h-2.5" />
                <span>{concurrency}x bulk</span>
              </span>
            </div>

            <p className="text-[11px] text-zinc-300 truncate mt-0.5">
              {isUploading
                ? `Mengunggah ${queueStats.completed} dari ${queueStats.total} foto (${queueStats.percent}%)`
                : `${unuploadedCount} foto di memori ini belum dicadangkan ke Google Drive`}
            </p>
          </div>
        </div>

        {/* Sisi Kanan: Aksi & Tombol Kontrol */}
        <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
          {isUploading ? (
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-950 border border-zinc-800 text-xs font-mono text-emerald-400 font-bold">
                <Loader2 className="w-3.5 h-3.5 animate-spin text-emerald-400" />
                <span>{queueStats.percent}%</span>
              </div>
              <button
                type="button"
                onClick={onCancelQueue}
                className="px-2.5 py-1.5 rounded-xl border border-zinc-700 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white text-xs font-medium transition-all active:scale-95 cursor-pointer flex items-center gap-1"
                title="Hentikan sisa antrian"
              >
                <X className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Hentikan</span>
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={onStartUploadAll}
              className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-zinc-950 font-bold text-xs flex items-center gap-1.5 shadow-md shadow-emerald-500/20 transition-all active:scale-95 cursor-pointer"
            >
              <UploadCloud className="w-3.5 h-3.5 shrink-0 stroke-[2.5]" />
              <span>Upload {unuploadedCount} Foto</span>
            </button>
          )}
        </div>
      </div>

      {/* Progress Bar (Hanya tampil saat proses upload aktif) */}
      {isUploading && (
        <div className="mt-2.5 w-full bg-zinc-950/80 rounded-full h-1.5 overflow-hidden border border-zinc-800/80">
          <div
            className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full rounded-full transition-all duration-300 ease-out shadow-sm shadow-emerald-400/50"
            style={{ width: `${Math.max(5, queueStats.percent)}%` }}
          />
        </div>
      )}
    </div>
  )
}
