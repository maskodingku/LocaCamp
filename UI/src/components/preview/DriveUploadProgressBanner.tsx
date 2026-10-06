import React from 'react'
import {
  ArrowUp,
  CheckCircle2,
  ExternalLink,
  AlertCircle,
  RotateCw,
} from 'lucide-react'
import { GoogleDriveIcon } from '../settings/gdrive/GoogleDriveIcon'

interface DriveUploadProgressBannerProps {
  isUploading: boolean
  progress: number
  driveResult?: { fileId: string; webViewLink?: string } | null
  driveError?: string | null
  onRetry?: () => void
}

/**
 * Banner Interaktif Glassmorphic untuk Visualisasi Progres Upload Google Drive (0% - 100%)
 */
export const DriveUploadProgressBanner: React.FC<DriveUploadProgressBannerProps> = ({
  isUploading,
  progress,
  driveResult,
  driveError,
  onRetry,
}) => {
  // Hanya tampil jika sedang upload, sukses upload, atau ada error upload
  if (!isUploading && !driveResult?.webViewLink && !driveError) {
    return null
  }

  return (
    <div className="w-full transition-all duration-300 animate-in fade-in slide-in-from-top-2">
      {/* 1. Status Sedang Upload dengan Loading Persen Real-Time */}
      {isUploading && (
        <div className="rounded-2xl bg-zinc-950/90 backdrop-blur-xl border border-emerald-500/30 p-3 shadow-2xl shadow-emerald-950/20 space-y-2">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="relative w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0">
                <GoogleDriveIcon className="w-4 h-4 opacity-40 absolute" />
                <ArrowUp className="w-4 h-4 text-emerald-400 animate-bounce relative z-10" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold text-white truncate">
                  Mengunggah ke Google Drive...
                </p>
                <p className="text-[10px] text-zinc-400 truncate">
                  Menyimpan ke folder LocaCamp Photos
                </p>
              </div>
            </div>

            {/* Persentase Numerik */}
            <div className="flex items-center gap-1 shrink-0 font-mono">
              <span className="text-sm font-bold text-emerald-400">
                {progress}%
              </span>
            </div>
          </div>

          {/* Glowing Animated Progress Bar */}
          <div className="w-full h-1.5 bg-zinc-900 rounded-full overflow-hidden border border-zinc-800/80">
            <div
              className="h-full bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-300 rounded-full shadow-[0_0_10px_rgba(52,211,153,0.8)] transition-all duration-300 ease-out"
              style={{ width: `${Math.max(5, progress)}%` }}
            />
          </div>
        </div>
      )}

      {/* 2. Status Berhasil Upload (100%) */}
      {!isUploading && driveResult?.webViewLink && (
        <div className="rounded-2xl bg-emerald-950/40 backdrop-blur-xl border border-emerald-500/40 p-2.5 sm:p-3 shadow-xl flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center shrink-0 text-emerald-400">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-emerald-200 truncate">
                Tersimpan di Google Drive!
              </p>
              <p className="text-[10px] text-emerald-400/80 truncate">
                Folder: LocaCamp Photos
              </p>
            </div>
          </div>

          <a
            href={driveResult.webViewLink}
            target="_blank"
            rel="noreferrer"
            className="px-2.5 py-1.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-emerald-200 text-[11px] font-semibold flex items-center gap-1.5 transition-all active:scale-95 shrink-0"
            title="Buka file foto di Google Drive"
          >
            <span>Buka di Drive</span>
            <ExternalLink className="w-3 h-3 text-emerald-300" />
          </a>
        </div>
      )}

      {/* 3. Status Error Upload */}
      {!isUploading && driveError && (
        <div className="rounded-2xl bg-rose-950/40 backdrop-blur-xl border border-rose-500/30 p-2.5 sm:p-3 shadow-xl flex items-center justify-between gap-2.5">
          <div className="flex items-center gap-2 min-w-0">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <p className="text-xs text-rose-300 truncate">{driveError}</p>
          </div>

          {onRetry && (
            <button
              type="button"
              onClick={onRetry}
              className="px-2.5 py-1 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-200 text-[11px] font-semibold flex items-center gap-1 transition-all active:scale-95 shrink-0 cursor-pointer"
            >
              <RotateCw className="w-3 h-3" />
              <span>Coba Lagi</span>
            </button>
          )}
        </div>
      )}
    </div>
  )
}
