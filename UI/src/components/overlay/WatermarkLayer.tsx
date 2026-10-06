import React from 'react'
import type { WatermarkConfig } from '../../types/camera'

interface WatermarkLayerProps {
  watermark: WatermarkConfig
  isLandscape?: boolean
}

export const WatermarkLayer: React.FC<WatermarkLayerProps> = ({
  watermark,
  isLandscape = false,
}) => {
  if (!watermark.imageUrl) return null

  // Posisi watermark identik dengan hasil jepretan (WYSIWYG)
  const positionClasses = {
    'top-left': 'top-4 left-4 items-start justify-start',
    'top-center': 'top-4 left-1/2 -translate-x-1/2 items-start justify-center',
    'top-right': 'top-4 right-4 items-start justify-end',
    'center': 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 items-center justify-center',
    'bottom-left': isLandscape ? 'bottom-4 left-4 items-end justify-start' : 'bottom-20 left-4 items-end justify-start',
    'bottom-center': isLandscape ? 'bottom-4 left-1/2 -translate-x-1/2 items-end justify-center' : 'bottom-20 left-1/2 -translate-x-1/2 items-end justify-center',
    'bottom-right': isLandscape ? 'bottom-4 right-4 items-end justify-end' : 'bottom-20 right-4 items-end justify-end',
  }[watermark.position]

  // Pada landscape, skala persentase lebar disesuaikan proporsional agar tidak membesar drastis
  const effectiveWidthPercent = isLandscape
    ? Math.min(watermark.sizePercent * 0.58, 14)
    : watermark.sizePercent

  return (
    <div
      className={`absolute z-10 pointer-events-none flex ${positionClasses} transition-all duration-300 ease-out`}
      style={{
        width: `${effectiveWidthPercent}%`,
        opacity: watermark.opacity,
      }}
    >
      <img
        src={watermark.imageUrl}
        alt="Watermark Preview"
        className={`max-w-full ${
          isLandscape
            ? 'max-h-12 md:max-h-14 max-w-[130px] md:max-w-[160px]'
            : 'max-h-24 md:max-h-32'
        } object-contain drop-shadow-md select-none`}
        draggable={false}
      />
    </div>
  )
}
