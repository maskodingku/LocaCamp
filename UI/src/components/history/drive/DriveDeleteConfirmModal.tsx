import React from 'react'
import { AlertTriangle, Trash2, X } from 'lucide-react'
import type { GoogleDriveFile } from '../../../types/drive'

interface DriveDeleteConfirmModalProps {
  isOpen: boolean
  file: GoogleDriveFile | null
  isDeleting: boolean
  onClose: () => void
  onConfirm: () => void
}

export const DriveDeleteConfirmModal: React.FC<DriveDeleteConfirmModalProps> = ({
  isOpen,
  file,
  isDeleting,
  onClose,
  onConfirm,
}) => {
  if (!isOpen || !file) return null

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-150">
      <div className="w-full max-w-sm rounded-3xl bg-zinc-900 border border-zinc-800 shadow-2xl p-5 space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="p-2.5 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={isDeleting}
            className="p-1.5 rounded-xl hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Info */}
        <div className="space-y-1">
          <h3 className="text-sm font-bold text-white">Hapus File dari Google Drive?</h3>
          <p className="text-xs text-zinc-400 leading-relaxed">
            File <span className="font-semibold text-zinc-200">"{file.name}"</span> akan dihapus secara permanen dari akun Google Drive Anda. Tindakan ini tidak dapat dibatalkan.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 pt-2">
          <button
            type="button"
            onClick={onClose}
            disabled={isDeleting}
            className="flex-1 py-2.5 px-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-semibold text-xs transition-colors cursor-pointer"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isDeleting}
            className="flex-1 py-2.5 px-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-lg shadow-rose-600/20 transition-all cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>{isDeleting ? 'Menghapus...' : 'Ya, Hapus'}</span>
          </button>
        </div>
      </div>
    </div>
  )
}
