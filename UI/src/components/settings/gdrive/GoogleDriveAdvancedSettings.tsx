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
    <div className="rounded-[22px] border border-cyan-400/30 bg-[#020d1c]/70 overflow-hidden shadow-sm">
      {/* Header Accordion */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="w-full p-3.5 flex items-center justify-between text-left text-xs font-semibold text-slate-300 hover:text-white hover:bg-cyan-950/30 transition-colors cursor-pointer"
      >
        <span className="flex items-center gap-2">
          <Code2 className="w-4 h-4 text-cyan-400" />
          <span>Pengaturan Lanjutan (Pengembang / Custom Client ID)</span>
        </span>
        {isOpen ? (
          <ChevronUp className="w-4 h-4 text-cyan-400" />
        ) : (
          <ChevronDown className="w-4 h-4 text-cyan-400" />
        )}
      </button>

      {/* Konten Terbuka */}
      {isOpen && (
        <div className="p-4 pt-1 border-t border-cyan-500/20 space-y-3.5 animate-in fade-in duration-200">
          <p className="text-[11px] text-slate-400 leading-relaxed">
            Secara default, LocaCamp menggunakan OAuth Client ID bawaan. Anda dapat menentukan Client ID Google Cloud pribadi Anda sendiri di bawah ini jika diinginkan:
          </p>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-[11px] font-semibold text-slate-300 uppercase tracking-wider">
                Custom Google OAuth Client ID
              </label>
              <button
                type="button"
                onClick={() => setShowTutorial((prev) => !prev)}
                className="text-[11px] text-cyan-400 hover:text-cyan-300 flex items-center gap-1 cursor-pointer font-medium"
              >
                <HelpCircle className="w-3 h-3" />
                <span>Panduan</span>
              </button>
            </div>

            <div className="relative">
              <Key className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-cyan-400/70" />
              <input
                type="text"
                value={inputClientId}
                onChange={(e) => setInputClientId(e.target.value)}
                onBlur={onSaveClientId}
                placeholder="xxxx-xxxx.apps.googleusercontent.com"
                className="w-full pl-10 pr-4 py-2.5 rounded-full bg-[#020717]/80 border border-cyan-400/50 text-white text-xs placeholder:text-cyan-200/40 focus:outline-none focus:border-cyan-300 transition-colors font-mono"
              />
            </div>
          </div>

          {showTutorial && (
            <div className="p-3.5 rounded-2xl bg-[#020717]/90 border border-cyan-500/30 text-[11px] text-slate-300 space-y-1.5 shadow-inner">
              <p className="font-bold text-white">Langkah Pengaturan Google Cloud Console:</p>
              <ol className="list-decimal pl-4 space-y-1 text-slate-400">
                <li>
                  Buka{' '}
                  <a
                    href="https://console.cloud.google.com"
                    target="_blank"
                    rel="noreferrer"
                    className="text-cyan-400 underline inline-flex items-center gap-0.5"
                  >
                    console.cloud.google.com <ExternalLink className="w-2.5 h-2.5" />
                  </a>{' '}
                  dan buat project baru.
                </li>
                <li>Aktifkan <strong>Google Drive API</strong> di menu <em>APIs &amp; Services</em>.</li>
                <li>
                  Buka <em>Credentials</em> → <em>Create Credentials</em> →{' '}
                  <strong>OAuth client ID</strong> (Web Application).
                </li>
                <li>
                  Tambahkan domain Anda (misal{' '}
                  <code className="text-cyan-300 font-mono">http://localhost:3000</code>) ke{' '}
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
