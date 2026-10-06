import React from 'react'
import { MapPin, Calendar, Compass, RefreshCw } from 'lucide-react'
import type { GeoLocationData, GeotagDisplayConfig } from '../../types/camera'
import { formatTimeWithTimezone } from '../../utils/timezone'
import { getMiniMapDataUrl } from '../../utils/miniMapGenerator'

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
  const [mapUrl, setMapUrl] = React.useState<string | null>(null)

  // Muat mini map secara 100% client-side jika opsi aktif dan koordinat tersedia
  React.useEffect(() => {
    if (
      config.showMiniMap === false ||
      location.latitude === null ||
      location.longitude === null
    ) {
      setMapUrl(null)
      return
    }

    let isMounted = true

    getMiniMapDataUrl(location.latitude, location.longitude, 200, 200, 17)
      .then(url => {
        if (isMounted) {
          setMapUrl(url)
        }
      })
      .catch(() => {
        // Fallback ditangani di generator
      })

    return () => {
      isMounted = false
    }
  }, [location.latitude, location.longitude, config.showMiniMap])

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
    'top-left': 'top-3 left-3 origin-top-left',
    'top-right': 'top-3 right-3 origin-top-right',
  }[config.position]

  const portraitSizeStyles = {
    small: {
      container: 'p-2.5 md:p-3',
      headerText: 'text-[11px]',
      addressText: 'text-xs',
      coordText: 'text-[10px]',
      icon: 'w-3 h-3',
      mapBox: 'w-[74px] h-[74px] min-w-[74px]',
    },
    medium: {
      container: 'p-3 md:p-3.5',
      headerText: 'text-xs',
      addressText: 'text-xs md:text-sm',
      coordText: 'text-[11px]',
      icon: 'w-3.5 h-3.5',
      mapBox: 'w-[86px] h-[86px] min-w-[86px]',
    },
    large: {
      container: 'p-3.5 md:p-4',
      headerText: 'text-xs md:text-sm',
      addressText: 'text-sm md:text-base font-semibold',
      coordText: 'text-xs',
      icon: 'w-4 h-4',
      mapBox: 'w-[98px] h-[98px] min-w-[98px]',
    },
    xlarge: {
      container: 'p-4 md:p-5',
      headerText: 'text-sm md:text-base',
      addressText: 'text-base md:text-lg font-bold',
      coordText: 'text-xs md:text-sm',
      icon: 'w-4.5 h-4.5',
      mapBox: 'w-[114px] h-[114px] min-w-[114px]',
    },
  }[config.fontSize || 'medium']

  const landscapeSizeStyles = {
    small: {
      container: 'p-1.5 md:p-2',
      headerText: 'text-[9.5px]',
      addressText: 'text-[10px] md:text-[10.5px]',
      coordText: 'text-[8.5px]',
      icon: 'w-2.5 h-2.5',
      mapBox: 'w-[62px] h-[62px] min-w-[62px]',
    },
    medium: {
      container: 'p-2 md:p-2.5',
      headerText: 'text-[10px] md:text-[11px]',
      addressText: 'text-[11px] md:text-xs',
      coordText: 'text-[9px] md:text-[9.5px]',
      icon: 'w-3 h-3',
      mapBox: 'w-[72px] h-[72px] min-w-[72px]',
    },
    large: {
      container: 'p-2.5 md:p-3',
      headerText: 'text-[11px] md:text-xs',
      addressText: 'text-xs md:text-sm font-semibold',
      coordText: 'text-[9.5px] md:text-[10px]',
      icon: 'w-3.5 h-3.5',
      mapBox: 'w-[82px] h-[82px] min-w-[82px]',
    },
    xlarge: {
      container: 'p-3 md:p-3.5',
      headerText: 'text-xs md:text-sm',
      addressText: 'text-sm md:text-base font-bold',
      coordText: 'text-[10px] md:text-[11px]',
      icon: 'w-3.5 h-3.5',
      mapBox: 'w-[94px] h-[94px] min-w-[94px]',
    },
  }[config.fontSize || 'medium']

  const sizeStyles = isLandscape ? landscapeSizeStyles : portraitSizeStyles
  const hasMiniMap =
    config.showMiniMap !== false &&
    location.latitude !== null &&
    location.longitude !== null

  return (
    <div
      onClick={e => e.stopPropagation()}
      className={`absolute z-20 pointer-events-auto ${
        isLandscape
          ? hasMiniMap
            ? 'max-w-[78%] md:max-w-md'
            : 'max-w-[70%] md:max-w-sm'
          : hasMiniMap
          ? 'max-w-[95%] md:max-w-lg'
          : 'max-w-[90%] md:max-w-md'
      } ${positionClasses} transition-all duration-300 ease-out`}
    >
      <div
        className={`glass-panel rounded-2xl ${sizeStyles.container} shadow-2xl backdrop-blur-xl border border-white/10 text-white animate-in fade-in zoom-in-95 duration-200 flex items-stretch gap-2.5 md:gap-3`}
      >
        {/* Kolom Kiri: Informasi Geotag Lengkap */}
        <div className="flex-1 min-w-0 flex flex-col justify-between space-y-1">
          {/* Date and Time Header */}
          {config.showTimestamp && (
            <div
              className={`flex items-center justify-between gap-2 border-b border-white/10 pb-1.5 ${sizeStyles.headerText} text-zinc-300`}
            >
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
              <MapPin
                className={`${sizeStyles.icon} text-rose-400 shrink-0 mt-0.5`}
              />
              <p
                className={`${sizeStyles.addressText} font-medium leading-snug line-clamp-3 text-zinc-100`}
              >
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
            <div
              className={`flex items-center justify-between ${sizeStyles.coordText} font-mono text-zinc-400 pt-0.5`}
            >
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
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${accuracyColor} animate-pulse`}
                  />
                  <span>
                    {location.accuracy !== null
                      ? `±${location.accuracy}m`
                      : 'No fix'}
                  </span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Kolom Kanan: Kotak Mini Map (Presisi 1:1 Square) */}
        {hasMiniMap && (
          <div
            className={`relative shrink-0 overflow-hidden rounded-xl border border-white/20 bg-zinc-900/70 shadow-md flex items-center justify-center self-center aspect-square ${sizeStyles.mapBox}`}
          >
            {mapUrl ? (
              <img
                src={mapUrl}
                alt="Peta Lokasi"
                className="w-full h-full object-cover rounded-xl select-none pointer-events-none"
              />
            ) : (
              <div className="flex flex-col items-center justify-center p-1 text-center">
                <MapPin className="w-4 h-4 text-rose-500 animate-bounce" />
                <span className="text-[7.5px] text-zinc-400 font-sans mt-0.5">
                  Peta...
                </span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
