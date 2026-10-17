import React from 'react'
import type { LucideIcon } from 'lucide-react'

interface CyberGlassOrbProps {
  icon?: LucideIcon
  children?: React.ReactNode
  size?: 'xs' | 'sm' | 'md' | 'lg'
  variant?: 'cyan' | 'emerald' | 'amber' | 'rose'
  className?: string
  iconClassName?: string
}

export const CyberGlassOrb: React.FC<CyberGlassOrbProps> = ({
  icon: Icon,
  children,
  size = 'md',
  variant = 'cyan',
  className = '',
  iconClassName = '',
}) => {
  // Ukuran dimensi container dan specular sheen
  const sizeMap = {
    xs: {
      container: 'w-5 h-5',
      icon: 'w-2.5 h-2.5',
      specular: 'top-0.5 inset-x-1 h-[40%]',
      border: 'border',
    },
    sm: {
      container: 'w-6 h-6',
      icon: 'w-3.5 h-3.5',
      specular: 'top-0.5 inset-x-1 h-[42%]',
      border: 'border',
    },
    md: {
      container: 'w-10 h-10',
      icon: 'w-5 h-5',
      specular: 'top-0.5 inset-x-1.5 h-[45%]',
      border: 'border-[1.5px]',
    },
    lg: {
      container: 'w-12 h-12',
      icon: 'w-6 h-6',
      specular: 'top-1 inset-x-2 h-[45%]',
      border: 'border-2',
    },
  }[size]

  // Skema kaca kristal optik dengan aura warna kontekstual
  const colorMap = {
    cyan: {
      border: 'border-cyan-300/80',
      shadow: 'shadow-[0_4px_12px_rgba(0,0,0,0.6),inset_0_1.5px_2px_rgba(255,255,255,0.85),inset_0_-1px_2px_rgba(0,0,0,0.5)]',
      gradient: 'radial-gradient(circle at 45% 25%, #0d3d54 0%, #031b26 55%, #010a10 100%)',
      iconColor: 'text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.95)] drop-shadow-[0_0_6px_rgba(34,211,238,0.75)]',
      specularGrad: 'from-white/90 via-cyan-100/35 to-transparent',
    },
    emerald: {
      border: 'border-emerald-300/80',
      shadow: 'shadow-[0_4px_12px_rgba(0,0,0,0.6),inset_0_1.5px_2px_rgba(255,255,255,0.85),inset_0_-1px_2px_rgba(0,0,0,0.5)]',
      gradient: 'radial-gradient(circle at 45% 25%, #064e3b 0%, #022c22 55%, #01120c 100%)',
      iconColor: 'text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.95)] drop-shadow-[0_0_6px_rgba(52,211,153,0.75)]',
      specularGrad: 'from-white/90 via-emerald-100/35 to-transparent',
    },
    amber: {
      border: 'border-amber-300/80',
      shadow: 'shadow-[0_4px_12px_rgba(0,0,0,0.6),inset_0_1.5px_2px_rgba(255,255,255,0.85),inset_0_-1px_2px_rgba(0,0,0,0.5)]',
      gradient: 'radial-gradient(circle at 45% 25%, #78350f 0%, #451a03 55%, #1a0801 100%)',
      iconColor: 'text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.95)] drop-shadow-[0_0_6px_rgba(251,191,36,0.75)]',
      specularGrad: 'from-white/90 via-amber-100/35 to-transparent',
    },
    rose: {
      border: 'border-rose-300/80',
      shadow: 'shadow-[0_4px_12px_rgba(0,0,0,0.6),inset_0_1.5px_2px_rgba(255,255,255,0.85),inset_0_-1px_2px_rgba(0,0,0,0.5)]',
      gradient: 'radial-gradient(circle at 45% 25%, #881337 0%, #4c0519 55%, #1a0208 100%)',
      iconColor: 'text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.95)] drop-shadow-[0_0_6px_rgba(244,63,94,0.75)]',
      specularGrad: 'from-white/90 via-rose-100/35 to-transparent',
    },
  }[variant]

  return (
    <div
      className={`relative rounded-full flex items-center justify-center shrink-0 overflow-hidden ${sizeMap.container} ${sizeMap.border} ${colorMap.border} ${colorMap.shadow} transition-transform duration-200 select-none ${className}`}
      style={{
        background: colorMap.gradient,
      }}
    >
      {/* 3D Glass Soft Specular Dome (Kilau Kaca Silau Halus Bergradasi) */}
      <div
        className={`pointer-events-none absolute ${sizeMap.specular} rounded-full bg-gradient-to-b ${colorMap.specularGrad} blur-[0.3px] z-10`}
      />

      {/* Top Hairline Glare (Garis Silau Kaca Atas Lembut) */}
      <div className="pointer-events-none absolute top-0.5 inset-x-2 h-[1px] bg-gradient-to-r from-transparent via-white/85 to-transparent z-10" />

      {/* Ikon Tajam dengan Aura Blur Warna Kontekstual */}
      {Icon && (
        <Icon
          className={`relative z-20 ${sizeMap.icon} ${colorMap.iconColor} stroke-[2.3] ${iconClassName}`}
        />
      )}

      {children && <div className="relative z-20 flex items-center justify-center">{children}</div>}
    </div>
  )
}
