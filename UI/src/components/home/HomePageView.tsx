import React, { useEffect, useRef } from 'react'
import { HomeHeader } from './HomeHeader'
import { HomeHeroSection } from './HomeHeroSection'
import { HomeFeaturesSection } from './HomeFeaturesSection'
import { HomeDataUsageSection } from './HomeDataUsageSection'
import { HomeDeveloperSection } from './HomeDeveloperSection'
import { HomeFooter } from './HomeFooter'

interface HomePageViewProps {
  onNavigate: (path: string) => void
}

export const HomePageView: React.FC<HomePageViewProps> = ({ onNavigate }) => {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    document.title = 'LocaCamp - Beranda Resmi Aplikasi & Pengembang Abdi Syahputra Harahap'
    if (containerRef.current) {
      containerRef.current.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }, [])

  useEffect(() => {
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
      <HomeHeader onNavigate={onNavigate} />
      <HomeHeroSection onNavigate={onNavigate} />
      <HomeFeaturesSection />
      <HomeDataUsageSection />
      <HomeDeveloperSection />
      <HomeFooter onNavigate={onNavigate} />
    </div>
  )
}
