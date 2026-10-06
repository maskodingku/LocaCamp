import React from 'react'
import { MapPin, Calendar, Compass, RefreshCw } from 'lucide-react'
import type { GeoLocationData, GeotagDisplayConfig } from '../../types/camera'
import { formatTimeWithTimezone } from '../../utils/timezone'

interface GeotagBadgeProps {
  location: GeoLocationData
  config: GeotagDisplayConfig
  onRefresh?: () => void
  isLandscape?: boolean
}

export const GeotagBadge: React.FC<GeotagBadgeProps> = ({
  location,
  config,
  onRefresh,
  isLandscape = false,
}) => {
  const dateFormatted = location.timestamp.toLocaleDateString('id-ID', {
    weekday: 'short',
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
  const timeFormatted = formatTimeWithTimezone(location.timestamp, location.longitude)

  // Determine accuracy indicator color
  const accuracyColor =
    location.accuracy === null
      ? 'bg-zinc-500'
      : location.accuracy <= 15
      ? 'bg-emerald-400'
      : location.accuracy <= 40
      ? 'bg-amber-400'
      : 'bg-rose-400'

  const positionClasses = {
    'bottom-left': 'bottom-3 left-3 origin-bottom-left',
    'bottom-right': 'bottom-3 right-3 origin-bottom-right',
    'top-left': isLandscape ? 'top-16 left-3 origin-top-left' : 'top-3 left-3 origin-top-left',
    'top-right': isLandscape ? 'top-16 right-3 origin-top-right' : 'top-3 right-3 origin-top-right',
  }[config.position]

  const portraitSizeStyles = {
    small: {
      container: 'p-2.5 md:p-3 space-y-1',
      headerText: 'text-[11px]',
      addressText: 'text-xs',
      coordText: 'text-[10px]',
      icon: 'w-3 h-3',
    },
    medium: {
      container: 'p-3 md:p-3.5 space-y-1.5',
      headerText: 'text-xs',
      addressText: 'text-xs md:text-sm',
      coordText: 'text-[11px]',
      icon: 'w-3.5 h-3.5',
    },
    large: {
      container: 'p-3.5 md:p-4 space-y-2',
      headerText: 'text-xs md:text-sm',
      addressText: 'text-sm md:text-base font-semibold',
      coordText: 'text-xs',
      icon: 'w-4 h-4',
    },
    xlarge: {
      container: 'p-4 md:p-5 space-y-2.5',
      headerText: 'text-sm md:text-base',
      addressText: 'text-base md:text-lg font-bold',
      coordText: 'text-xs md:text-sm',
      icon: 'w-4.5 h-4.5',
    },
  }[config.fontSize || 'medium']

  const landscapeSizeStyles = {
    small: {
      container: 'p-1.5 md:p-2 space-y-0.5',
      headerText: 'text-[9.5px]',
      addressText: 'text-[10px] md:text-[10.5px]',
      coordText: 'text-[8.5px]',
      icon: 'w-2.5 h-2.5',
    },
    medium: {
      container: 'p-2 md:p-2.5 space-y-1',
      headerText: 'text-[10px] md:text-[11px]',
      addressText: 'text-[11px] md:text-xs',
      coordText: 'text-[9px] md:text-[9.5px]',
      icon: 'w-3 h-3',
    },
    large: {
      container: 'p-2.5 md:p-3 space-y-1',
      headerText: 'text-[11px] md:text-xs',
      addressText: 'text-xs md:text-sm font-semibold',
      coordText: 'text-[9.5px] md:text-[10px]',
      icon: 'w-3.5 h-3.5',
    },
    xlarge: {
      container: 'p-3 md:p-3.5 space-y-1.5',
      headerText: 'text-xs md:text-sm',
      addressText: 'text-sm md:text-base font-bold',
      coordText: 'text-[10px] md:text-[11px]',
      icon: 'w-3.5 h-3.5',
    },
  }[config.fontSize || 'medium']

  const sizeStyles = isLandscape ? landscapeSizeStyles : portraitSizeStyles

  return (
    <div
      onClick={e => e.stopPropagation()}
      className={`absolute z-20 pointer-events-auto ${
        isLandscape ? 'max-w-[70%] md:max-w-sm' : 'max-w-[90%] md:max-w-md'
      } ${positionClasses} transition-all duration-300 ease-out`}
    >
      <div className={`glass-panel rounded-2xl ${sizeStyles.container} shadow-2xl backdrop-blur-xl border border-white/10 text-white animate-in fade-in zoom-in-95 duration-200`}>
        {/* Date and Time Header */}
        {config.showTimestamp && (
          <div className={`flex items-center justify-between gap-2 border-b border-white/10 pb-1.5 ${sizeStyles.headerText} text-zinc-300`}>
            <div className="flex items-center gap-1.5 font-medium tracking-wide">
              <Calendar className={`${sizeStyles.icon} text-zinc-400`} />
              <span>{dateFormatted}</span>
              <span className="text-zinc-500">•</span>
              <span className="font-mono text-zinc-200">{timeFormatted}</span>
            </div>
            {onRefresh && (
              <button
                type="button"
                onClick={onRefresh}
                className="hover:rotate-180 transition-transform duration-500 text-zinc-400 hover:text-white p-0.5"
                title="Perbarui GPS"
              >
                <RefreshCw className="w-3 h-3" />
              </button>
            )}
          </div>
        )}

        {/* Live Address */}
        {config.showAddress && (
          <div className="flex items-start gap-1.5 pt-0.5">
            <MapPin className={`${sizeStyles.icon} text-rose-400 shrink-0 mt-0.5`} />
            <p className={`${sizeStyles.addressText} font-medium leading-snug line-clamp-3 text-zinc-100`}>
              {location.loading ? (
                <span className="text-zinc-400 italic">Mencari alamat...</span>
              ) : (
                location.address || 'Alamat tidak diketahui'
              )}
            </p>
          </div>
        )}

        {/* GPS Coordinates & Accuracy Status */}
        {config.showCoordinates && (
          <div className={`flex items-center justify-between ${sizeStyles.coordText} font-mono text-zinc-400 pt-0.5`}>
            <div className="flex items-center gap-1">
              <Compass className={`${sizeStyles.icon} text-cyan-400`} />
              {location.latitude !== null && location.longitude !== null ? (
                <span>
                  {location.latitude.toFixed(5)}°, {location.longitude.toFixed(5)}°
                </span>
              ) : (
                <span className="text-zinc-500 italic">GPS offline</span>
              )}
            </div>

            {config.showAccuracy && (
              <div className="flex items-center gap-1.5 text-[10px]">
                <span className={`w-1.5 h-1.5 rounded-full ${accuracyColor} animate-pulse`} />
                <span>
                  {location.accuracy !== null ? `±${location.accuracy}m` : 'No fix'}
                </span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
