import React, { useEffect, useRef } from 'react'
import { LegalHeader } from './LegalHeader'
import { LegalFooter } from './LegalFooter'
import { PrivacyPolicyContent } from './PrivacyPolicyContent'
import { TermsOfServiceContent } from './TermsOfServiceContent'

interface LegalPageViewProps {
  currentPath: string
  onNavigate: (path: string) => void
}

export const LegalPageView: React.FC<LegalPageViewProps> = ({ currentPath, onNavigate }) => {
  const isPrivacy = currentPath === '/privacy' || currentPath === '/privacy-policy'
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Set dynamic document title and scroll to top on path change
    if (isPrivacy) {
      document.title = 'Kebijakan Privasi (Privacy Policy) - LocaCamp'
    } else {
      document.title = 'Ketentuan Layanan (Terms of Service) - LocaCamp'
    }
    // Scroll container to top
    if (containerRef.current) {
      containerRef.current.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }, [currentPath, isPrivacy])

  useEffect(() => {
    // Izinkan scrolling dan text selection di root container
    const rootEl = document.getElementById('root')
    if (rootEl) {
      rootEl.classList.remove('overflow-hidden', 'select-none')
    }
    document.body.classList.remove('overflow-hidden', 'select-none')

    return () => {
      if (rootEl) {
        rootEl.classList.add('overflow-hidden', 'select-none')
      }
      document.body.classList.add('overflow-hidden', 'select-none')
      document.title = 'LocaCamp - Live Geotag & Watermark Camera'
    }
  }, [])

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-50 h-[100dvh] w-full max-w-full overflow-x-hidden overflow-y-auto overscroll-contain bg-slate-950 text-slate-100 flex flex-col selection:bg-emerald-500 selection:text-slate-950 touch-pan-y"
    >
      {/* Top Navigation Bar with Dynamic Path Switches */}
      <LegalHeader currentPath={currentPath} onNavigate={onNavigate} />

      {/* Main Content Area */}
      <main className="flex-1 mx-auto w-full max-w-4xl px-4 py-6 sm:px-6 sm:py-10">
        {isPrivacy ? <PrivacyPolicyContent /> : <TermsOfServiceContent />}
      </main>

      {/* Footer */}
      <LegalFooter currentPath={currentPath} onNavigate={onNavigate} />
    </div>
  )
}
