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
    <div className="rounded-[22px] border border-white/20 bg-[#020b18]/70 backdrop-blur-md overflow-hidden shadow-[0_4px_12px_rgba(0,0,0,0.4)]">
      {/* Header Accordion */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="w-full p-3.5 flex items-center justify-between text-left text-xs font-bold text-white hover:bg-white/10 transition-colors cursor-pointer"
      >
        <span className="flex items-center gap-2">
          <Code2 className="w-4 h-4 text-cyan-300 drop-shadow-[0_0_5px_rgba(34,211,238,0.75)]" />
          <span className="drop-shadow-[0_1px_2px_rgba(0,0,0,0.95)] drop-shadow-[0_0_6px_rgba(255,255,255,0.3)]">Pengaturan Lanjutan (Pengembang / Custom Client ID)</span>
        </span>
        {isOpen ? (
          <ChevronUp className="w-4 h-4 text-cyan-300 drop-shadow-[0_0_5px_rgba(34,211,238,0.75)]" />
        ) : (
          <ChevronDown className="w-4 h-4 text-cyan-300 drop-shadow-[0_0_5px_rgba(34,211,238,0.75)]" />
        )}
      </button>

      {/* Konten Terbuka */}
      {isOpen && (
        <div className="p-4 pt-1 border-t border-white/15 space-y-3.5 animate-in fade-in duration-200">
          <p className="text-[11px] text-slate-200 leading-relaxed font-medium drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)]">
            Secara default, LocaCamp menggunakan OAuth Client ID bawaan. Anda dapat menentukan Client ID Google Cloud pribadi Anda sendiri di bawah ini jika diinginkan:
          </p>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-[11px] font-bold text-white uppercase tracking-wider drop-shadow-[0_1px_2px_rgba(0,0,0,0.95)] drop-shadow-[0_0_6px_rgba(255,255,255,0.35)]">
                Custom Google OAuth Client ID
              </label>
              <button
                type="button"
                onClick={() => setShowTutorial((prev) => !prev)}
                className="text-[11px] text-cyan-300 hover:text-white flex items-center gap-1 cursor-pointer font-bold drop-shadow-[0_0_5px_rgba(34,211,238,0.75)]"
              >
                <HelpCircle className="w-3.5 h-3.5" />
                <span>Panduan</span>
              </button>
            </div>

            <div className="relative">
              <Key className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-cyan-300 drop-shadow-[0_0_5px_rgba(34,211,238,0.75)]" />
              <input
                type="text"
                value={inputClientId}
                onChange={(e) => setInputClientId(e.target.value)}
                onBlur={onSaveClientId}
                placeholder="xxxx-xxxx.apps.googleusercontent.com"
                className="w-full pl-10 pr-4 py-2.5 rounded-full bg-[#020717]/80 backdrop-blur-md border border-white/30 text-white text-xs placeholder:text-slate-400 focus:outline-none focus:border-white/70 shadow-inner transition-colors font-mono font-bold drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)]"
              />
            </div>
          </div>

          {showTutorial && (
            <div className="p-3.5 rounded-2xl bg-[#020717]/70 backdrop-blur-md border border-white/20 text-[11px] text-slate-200 space-y-1.5 shadow-inner">
              <p className="font-bold text-white">Langkah Pengaturan Google Cloud Console:</p>
              <ol className="list-decimal pl-4 space-y-1 text-slate-200 font-medium">
                <li>
                  Buka{' '}
                  <a
                    href="https://console.cloud.google.com"
                    target="_blank"
                    rel="noreferrer"
                    className="text-cyan-300 underline inline-flex items-center gap-0.5 font-bold"
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
                  <code className="text-cyan-300 font-mono font-bold">http://localhost:3000</code>) ke{' '}
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
