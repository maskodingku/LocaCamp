import React from 'react'
import { AlertCircle } from 'lucide-react'

interface ConfirmDeleteModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
}

export const ConfirmDeleteModal: React.FC<ConfirmDeleteModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
}) => {
  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-70 bg-black/80 flex items-center justify-center p-4 animate-in fade-in"
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm bg-zinc-900 border border-zinc-800 rounded-2xl p-5 text-center space-y-4 shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        <div className="w-12 h-12 rounded-full bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 mx-auto">
          <AlertCircle className="w-6 h-6" />
        </div>
        <div>
          <h4 className="text-sm font-bold text-white">Hapus Foto Ini?</h4>
          <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
            Foto akan dihapus permanen dari memori browser perangkat Anda.
          </p>
        </div>
        <div className="flex items-center gap-2 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl border border-zinc-700 bg-zinc-800 text-zinc-300 text-xs font-semibold hover:bg-zinc-700 transition-all"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition-all active:scale-95 shadow"
          >
            Ya, Hapus
          </button>
        </div>
      </div>
    </div>
  )
}

interface ConfirmClearAllModalProps {
  isOpen: boolean
  totalPhotos: number
  onClose: () => void
  onConfirm: () => void
}

export const ConfirmClearAllModal: React.FC<ConfirmClearAllModalProps> = ({
  isOpen,
  totalPhotos,
  onClose,
  onConfirm,
}) => {
  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-70 bg-black/80 flex items-center justify-center p-4 animate-in fade-in"
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm bg-zinc-900 border border-zinc-800 rounded-2xl p-5 text-center space-y-4 shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        <div className="w-12 h-12 rounded-full bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 mx-auto">
          <AlertCircle className="w-6 h-6" />
        </div>
        <div>
          <h4 className="text-sm font-bold text-white">Bersihkan Semua Foto?</h4>
          <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
            Seluruh {totalPhotos} foto dokumentasi akan dihapus permanen dari memori browser. Tindakan ini tidak dapat dibatalkan.
          </p>
        </div>
        <div className="flex items-center gap-2 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl border border-zinc-700 bg-zinc-800 text-zinc-300 text-xs font-semibold hover:bg-zinc-700 transition-all"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition-all active:scale-95 shadow"
          >
            Hapus Semua
          </button>
        </div>
      </div>
    </div>
  )
}
