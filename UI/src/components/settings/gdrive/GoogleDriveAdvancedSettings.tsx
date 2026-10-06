import React, { useState } from 'react'
import {
  ChevronDown,
  ChevronUp,
  Key,
  ExternalLink,
  HelpCircle,
  Code2,
} from 'lucide-react'

interface GoogleDriveAdvancedSettingsProps {
  inputClientId: string
  setInputClientId: (val: string) => void
  onSaveClientId: () => void
}

export const GoogleDriveAdvancedSettings: React.FC<GoogleDriveAdvancedSettingsProps> = ({
  inputClientId,
  setInputClientId,
  onSaveClientId,
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const [showTutorial, setShowTutorial] = useState(false)

  return (
    <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/40 overflow-hidden">
      {/* Header Accordion */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="w-full p-3.5 flex items-center justify-between text-left text-xs font-medium text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/40 transition-colors cursor-pointer"
      >
        <span className="flex items-center gap-2">
          <Code2 className="w-4 h-4 text-zinc-500" />
          <span>Pengaturan Lanjutan (Pengembang / Custom Client ID)</span>
        </span>
        {isOpen ? (
          <ChevronUp className="w-4 h-4 text-zinc-500" />
        ) : (
          <ChevronDown className="w-4 h-4 text-zinc-500" />
        )}
      </button>

      {/* Konten Terbuka */}
      {isOpen && (
        <div className="p-4 pt-1 border-t border-zinc-800/60 space-y-3.5 animate-in fade-in duration-200">
          <p className="text-[11px] text-zinc-500 leading-relaxed">
            Secara default, LocaCamp menggunakan OAuth Client ID bawaan. Anda dapat menentukan Client ID Google Cloud pribadi Anda sendiri di bawah ini jika diinginkan:
          </p>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-[11px] font-semibold text-zinc-300 uppercase tracking-wider">
                Custom Google OAuth Client ID
              </label>
              <button
                type="button"
                onClick={() => setShowTutorial((prev) => !prev)}
                className="text-[11px] text-emerald-400 hover:text-emerald-300 flex items-center gap-1 cursor-pointer"
              >
                <HelpCircle className="w-3 h-3" />
                <span>Panduan</span>
              </button>
            </div>

            <div className="relative">
              <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
              <input
                type="text"
                value={inputClientId}
                onChange={(e) => setInputClientId(e.target.value)}
                onBlur={onSaveClientId}
                placeholder="xxxx-xxxx.apps.googleusercontent.com"
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-white text-xs placeholder:text-zinc-600 focus:outline-none focus:border-emerald-500 transition-colors font-mono"
              />
            </div>
          </div>

          {showTutorial && (
            <div className="p-3.5 rounded-xl bg-zinc-950/80 border border-zinc-800 text-[11px] text-zinc-300 space-y-1.5">
              <p className="font-semibold text-white">Langkah Pengaturan Google Cloud Console:</p>
              <ol className="list-decimal pl-4 space-y-1 text-zinc-400">
                <li>
                  Buka{' '}
                  <a
                    href="https://console.cloud.google.com"
                    target="_blank"
                    rel="noreferrer"
                    className="text-emerald-400 underline inline-flex items-center gap-0.5"
                  >
                    console.cloud.google.com <ExternalLink className="w-2.5 h-2.5" />
                  </a>{' '}
                  dan buat project baru.
                </li>
                <li>Aktifkan <strong>Google Drive API</strong> di menu <em>APIs & Services</em>.</li>
                <li>
                  Buka <em>Credentials</em> → <em>Create Credentials</em> →{' '}
                  <strong>OAuth client ID</strong> (Web Application).
                </li>
                <li>
                  Tambahkan domain Anda (misal{' '}
                  <code className="text-zinc-300">http://localhost:3000</code>) ke{' '}
                  <em>Authorized JavaScript origins</em>.
                </li>
                <li>Salin <strong>Client ID</strong> dan tempel di atas.</li>
              </ol>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
