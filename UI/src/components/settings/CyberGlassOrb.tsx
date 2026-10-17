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
  // Ukuran dimensi container dan ikon
  const sizeMap = {
    xs: {
      container: 'w-5 h-5',
      icon: 'w-2.5 h-2.5',
      specular: 'top-0.5 left-1 right-1 h-[35%]',
      border: 'border',
    },
    sm: {
      container: 'w-6 h-6',
      icon: 'w-3.5 h-3.5',
      specular: 'top-0.5 left-1 right-1 h-[38%]',
      border: 'border',
    },
    md: {
      container: 'w-10 h-10',
      icon: 'w-5 h-5',
      specular: 'top-1 left-1.5 right-1.5 h-[40%]',
      border: 'border-[1.5px]',
    },
    lg: {
      container: 'w-12 h-12',
      icon: 'w-6 h-6',
      specular: 'top-1.5 left-2 right-2 h-[42%]',
      border: 'border-2',
    },
  }[size]

  // Skema warna neon cyberpunk
  const colorMap = {
    cyan: {
      border: 'border-cyan-400',
      shadow: 'shadow-[0_0_14px_rgba(34,211,238,0.65),inset_0_0_8px_rgba(34,211,238,0.35)]',
      gradient: 'radial-gradient(circle at 45% 25%, #0e435c 0%, #04212e 52%, #010c12 100%)',
      iconColor: 'text-cyan-400 drop-shadow-[0_0_6px_rgba(34,211,238,0.9)]',
      halo: 'bg-cyan-400/20',
    },
    emerald: {
      border: 'border-emerald-400',
      shadow: 'shadow-[0_0_14px_rgba(52,211,153,0.65),inset_0_0_8px_rgba(52,211,153,0.35)]',
      gradient: 'radial-gradient(circle at 45% 25%, #064e3b 0%, #022c22 52%, #01120c 100%)',
      iconColor: 'text-emerald-400 drop-shadow-[0_0_6px_rgba(52,211,153,0.9)]',
      halo: 'bg-emerald-400/20',
    },
    amber: {
      border: 'border-amber-400',
      shadow: 'shadow-[0_0_14px_rgba(251,191,36,0.65),inset_0_0_8px_rgba(251,191,36,0.35)]',
      gradient: 'radial-gradient(circle at 45% 25%, #78350f 0%, #451a03 52%, #1a0801 100%)',
      iconColor: 'text-amber-400 drop-shadow-[0_0_6px_rgba(251,191,36,0.9)]',
      halo: 'bg-amber-400/20',
    },
    rose: {
      border: 'border-rose-400',
      shadow: 'shadow-[0_0_14px_rgba(251,113,133,0.65),inset_0_0_8px_rgba(251,113,133,0.35)]',
      gradient: 'radial-gradient(circle at 45% 25%, #881337 0%, #4c0519 52%, #1a0208 100%)',
      iconColor: 'text-rose-400 drop-shadow-[0_0_6px_rgba(251,113,133,0.9)]',
      halo: 'bg-rose-400/20',
    },
  }[variant]

  return (
    <div
      className={`relative rounded-full flex items-center justify-center shrink-0 overflow-hidden ${sizeMap.container} ${sizeMap.border} ${colorMap.border} ${colorMap.shadow} transition-transform duration-200 select-none ${className}`}
      style={{
        background: colorMap.gradient,
      }}
    >
      {/* 3D Glass Specular Dome (Pantulan Cahaya Kubah Kaca Atas) */}
      <div
        className={`pointer-events-none absolute ${sizeMap.specular} rounded-t-full rounded-b-[45%] bg-gradient-to-b from-white/45 via-white/12 to-transparent blur-[0.3px] z-10`}
      />

      {/* Subtle Rim Flare di Sudut Kiri-Atas */}
      <div className="pointer-events-none absolute top-0 left-0 w-2/3 h-2/3 rounded-full bg-gradient-to-br from-white/20 to-transparent blur-[1px] z-10" />

      {/* Ikon Neon Tengah */}
      {Icon && (
        <Icon
          className={`relative z-20 ${sizeMap.icon} ${colorMap.iconColor} stroke-[2.2] ${iconClassName}`}
        />
      )}

      {children && <div className="relative z-20 flex items-center justify-center">{children}</div>}
    </div>
  )
}
