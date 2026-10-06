import React, { useState } from 'react'
import { Key, X, ArrowRight, ExternalLink } from 'lucide-react'
import { GoogleDriveIcon } from './GoogleDriveIcon'

interface GoogleDriveQuickPromptModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: (clientId: string) => void
  initialClientId?: string
}

export const GoogleDriveQuickPromptModal: React.FC<GoogleDriveQuickPromptModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  initialClientId = '',
}) => {
  const [val, setVal] = useState(initialClientId)

  if (!isOpen) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (val.trim()) {
      onConfirm(val.trim())
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-150">
      <div className="w-full max-w-sm rounded-3xl bg-zinc-900 border border-zinc-800 shadow-2xl p-5 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-2xl bg-zinc-800/80 border border-zinc-700/60 shadow-sm">
              <GoogleDriveIcon className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Hubungkan Google Drive</h3>
              <p className="text-[11px] text-zinc-400">Konfigurasi Pengaitan Pertama</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Info */}
        <p className="text-xs text-zinc-300 leading-relaxed">
          Tempelkan <strong>Google OAuth Client ID</strong> aplikasi Anda sekali saja. Setelah tersimpan, Anda cukup 1-klik untuk masuk kapan saja.
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="relative">
            <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
            <input
              type="text"
              value={val}
              onChange={(e) => setVal(e.target.value)}
              placeholder="xxxx.apps.googleusercontent.com"
              className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-white text-xs placeholder:text-zinc-600 focus:outline-none focus:border-emerald-500 transition-colors font-mono"
              autoFocus
            />
          </div>

          <div className="flex items-center justify-between text-[11px] text-zinc-400 px-1">
            <span>Gratis dari Google Cloud Console</span>
            <a
              href="https://console.cloud.google.com"
              target="_blank"
              rel="noreferrer"
              className="text-emerald-400 hover:text-emerald-300 underline inline-flex items-center gap-0.5"
            >
              Buka Console <ExternalLink className="w-2.5 h-2.5" />
            </a>
          </div>

          <div className="flex items-center gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 px-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-semibold text-xs transition-colors cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={!val.trim()}
              className={`flex-1 py-2.5 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                val.trim()
                  ? 'bg-emerald-500 hover:bg-emerald-400 text-black shadow-lg shadow-emerald-500/20'
                  : 'bg-zinc-800 text-zinc-600 cursor-not-allowed'
              }`}
            >
              <span>Lanjutkan</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
