import React from 'react'
import { User } from 'lucide-react'
import type { ProfileConfig } from '../../types/camera'
import { getFontFamilyStyle } from '../settings/watermark/ProfileSection'

interface ProfileBadgeProps {
  profile: ProfileConfig
  isLandscape?: boolean
  className?: string
  standalonePosition?: boolean
  forceShow?: boolean
}

export const ProfileBadge: React.FC<ProfileBadgeProps> = ({
  profile,
  isLandscape = false,
  className = '',
  standalonePosition = false,
  forceShow = false,
}) => {
  if (!profile.enabled && !forceShow) {
    return null
  }

  const displayText =
    [profile.name, profile.jobTitle].filter(Boolean).join(' • ') || 'Nama • Jabatan'
  const fontWeightValue =
    profile.fontWeight === 'bold'
      ? 700
      : profile.fontWeight === 'semibold'
      ? 600
      : profile.fontWeight === 'medium'
      ? 500
      : 400

  const baseFontSize = profile.fontSize || 13
  const effectiveFontSize = isLandscape ? Math.max(10, baseFontSize * 0.9) : baseFontSize

  let positionClass = ''
  if (standalonePosition) {
    const pos = profile.position || 'above-geotag'
    const posMap: Record<string, string> = {
      'top-left': 'top-20 left-3',
      'top-center': 'top-20 left-1/2 -translate-x-1/2',
      'top-right': 'top-20 right-3',
      'bottom-left': 'bottom-3 left-3',
      'bottom-center': 'bottom-3 left-1/2 -translate-x-1/2',
      'bottom-right': 'bottom-3 right-3',
    }
    positionClass = `absolute z-20 pointer-events-auto ${posMap[pos] || 'bottom-24 right-3'}`
  }

  const showBorder = profile.showBorder !== false
  const bgColor = profile.backgroundColor || 'rgba(9, 9, 11, 0.78)'
  const textColor = profile.textColor || '#ffffff'

  return (
    <div
      style={{
        fontFamily: getFontFamilyStyle(profile.fontFamily),
        fontWeight: fontWeightValue,
        fontSize: `${effectiveFontSize}px`,
        backgroundColor: bgColor,
        color: textColor,
      }}
      className={`${bgColor === 'transparent' ? 'bg-transparent' : 'glass-panel'} rounded-xl px-3 py-1.5 shadow-xl backdrop-blur-xl ${
        showBorder ? 'border border-white/15' : 'border-0'
      } inline-flex items-center gap-1.5 animate-in fade-in zoom-in-95 duration-200 select-none ${positionClass} ${className}`}
    >
      <User
        className="w-3.5 h-3.5 shrink-0"
        style={{ color: textColor === '#ffffff' ? '#34d399' : textColor }}
      />
      <span className="truncate">{displayText}</span>
    </div>
  )
}
