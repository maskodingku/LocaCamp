import type {
  WatermarkConfig,
  GeoLocationData,
  GeotagDisplayConfig,
  JpegQualityTier,
  DenoiseMode,
  CameraEffectConfig,
} from '../types/camera'
import { formatTimeWithTimezone } from './timezone'
import { getCameraFilterString } from './cameraFilters'

export interface CompositeOptions {
  video: HTMLVideoElement
  videoTrack?: MediaStreamTrack | null
  watermark: WatermarkConfig
  location: GeoLocationData
  displayConfig: GeotagDisplayConfig
  mirror?: boolean
  rotationAngle?: 0 | 90 | 180 | 270
  jpegTier?: JpegQualityTier
  denoiseMode?: DenoiseMode
  effectConfig?: CameraEffectConfig | null
}

export async function captureAndComposite({
  video,
  videoTrack,
  watermark,
  location,
  displayConfig,
  mirror = false,
  rotationAngle = 0,
  jpegTier = 'high',
  denoiseMode = 'smooth',
  effectConfig,
}: CompositeOptions): Promise<{ dataUrl: string; width: number; height: number }> {
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d', { alpha: false })
  if (!ctx) throw new Error('Canvas 2D context not available')

  // 1. Dapatkan sumber gambar berkualitas maksimal:
  // Coba gunakan W3C ImageCapture.takePhoto() dengan dimensi maksimal sensor HP
  let imageSource: CanvasImageSource = video
  let rawWidth = video.videoWidth || 1920
  let rawHeight = video.videoHeight || 1080

  if (videoTrack && typeof window !== 'undefined' && 'ImageCapture' in window) {
    try {
      const imageCapture = new (window as unknown as {
        ImageCapture: new (t: MediaStreamTrack) => {
          takePhoto: (settings?: { imageWidth?: number; imageHeight?: number }) => Promise<Blob>
          getPhotoCapabilities?: () => Promise<{
            imageWidth?: { max?: number; min?: number }
            imageHeight?: { max?: number; min?: number }
          }>
        }
      }).ImageCapture(videoTrack)

      let photoSettings: { imageWidth?: number; imageHeight?: number } | undefined
      if (typeof imageCapture.getPhotoCapabilities === 'function') {
        try {
          const caps = await imageCapture.getPhotoCapabilities()
          if (caps.imageWidth?.max && caps.imageHeight?.max) {
            photoSettings = {
              imageWidth: caps.imageWidth.max,
              imageHeight: caps.imageHeight.max,
            }
          }
        } catch {
          // Abaikan jika kemampuan getPhotoCapabilities gagal
        }
      }

      const blob = await imageCapture.takePhoto(photoSettings)
      const bitmap = await createImageBitmap(blob)
      imageSource = bitmap
      rawWidth = bitmap.width
      rawHeight = bitmap.height
    } catch (err) {
      console.debug('ImageCapture takePhoto fallback ke video frame:', err)
      imageSource = video
      rawWidth = video.videoWidth || 1920
      rawHeight = video.videoHeight || 1080
    }
  }

  // Deteksi jika pengambilan foto dalam posisi landscape (90° atau 270°) saat sensor portrait
  const isLandscapeOrientation = rotationAngle === 90 || rotationAngle === 270
  const shouldRotateFrame = isLandscapeOrientation && rawWidth < rawHeight

  // Jika ponsel dimiringkan landscape tapi feed kamera masih portrait, tukar dimensi canvas agar hasil foto landscape sejati
  const width = shouldRotateFrame ? rawHeight : rawWidth
  const height = shouldRotateFrame ? rawWidth : rawHeight

  canvas.width = width
  canvas.height = height

  // Kualitas rendering canvas tingkat tinggi (bicubic interpolation)
  ctx.imageSmoothingEnabled = true
  ctx.imageSmoothingQuality = 'high'

  // Tentukan filter gabungan (Preset Efek Warna + Finetuning + Denoise)
  // Sub-pixel filtering ini secara presisi meratakan bintik pasir mikro tanpa mengaburkan detail objek
  const photoFilter = getCameraFilterString(effectConfig, {
    includeDenoise: true,
    denoiseMode,
  })

  // 2. Draw Camera Frame
  ctx.save()
  if ('filter' in ctx && photoFilter !== 'none') {
    ctx.filter = photoFilter
  }

  if (shouldRotateFrame) {
    ctx.translate(width / 2, height / 2)
    ctx.rotate(((rotationAngle === 90 ? 90 : -90) * Math.PI) / 180)
    if (mirror) {
      ctx.scale(-1, 1)
    }
    ctx.drawImage(imageSource, -rawWidth / 2, -rawHeight / 2, rawWidth, rawHeight)
  } else {
    if (mirror) {
      ctx.translate(width, 0)
      ctx.scale(-1, 1)
    }
    ctx.drawImage(imageSource, 0, 0, width, height)
  }
  ctx.restore()

  // PENTING: Kembalikan filter ke 'none' agar tulisan Geotag dan logo Watermark 100% tajam tanpa blur
  if ('filter' in ctx) {
    ctx.filter = 'none'
  }

  // Tutup bitmap jika digunakan untuk membebaskan memori GPU perangkat
  if (typeof ImageBitmap !== 'undefined' && imageSource instanceof ImageBitmap) {
    imageSource.close?.()
  }

  // 3. Draw Geotag Overlay (dicetak pada dimensi foto yang sudah berorientasi sejati)
  drawGeotagBadge(ctx, width, height, location, displayConfig)

  // 4. Draw Watermark / Logo if available
  if (watermark.imageUrl) {
    await drawWatermark(ctx, width, height, watermark)
  }

  // Pilihan kualitas ekspor JPEG
  const qualityMap: Record<JpegQualityTier, number> = {
    ultra: 0.98,
    high: 0.95,
    medium: 0.85,
  }
  const exportQuality = qualityMap[jpegTier] || 0.95

  return {
    dataUrl: canvas.toDataURL('image/jpeg', exportQuality),
    width,
    height,
  }
}

function drawGeotagBadge(
  ctx: CanvasRenderingContext2D,
  canvasWidth: number,
  canvasHeight: number,
  location: GeoLocationData,
  config: GeotagDisplayConfig
) {
  // Multiplier berdasarkan pilihan ukuran font visitor
  const fontMultipliers: Record<string, number> = {
    small: 0.85,
    medium: 1.1,
    large: 1.45,
    xlarge: 1.85,
  }
  const sizeMultiplier = fontMultipliers[config.fontSize || 'medium'] || 1.1

  // Skala proporsional relatif terhadap ukuran layar mobile (~400px)
  // Pada foto landscape (canvasWidth > canvasHeight), sesuaikan scale agar proporsional dan tidak mendominasi tinggi foto
  const isLandscape = canvasWidth > canvasHeight
  const minDimension = Math.min(canvasWidth, canvasHeight)
  const landscapeAdjustment = isLandscape ? 0.82 : 1.0
  const baseScale = Math.max(1, (minDimension / 400) * landscapeAdjustment)
  const scale = baseScale * sizeMultiplier

  const padding = 16 * baseScale
  const lineSpacing = 6.5 * scale

  // Prepare text lines
  const lines: { text: string; isBold?: boolean; size: number; color: string }[] = []

  // Date & Time
  if (config.showTimestamp) {
    const dateStr = location.timestamp.toLocaleDateString('id-ID', {
      weekday: 'long',
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    })
    const timeStr = formatTimeWithTimezone(location.timestamp, location.longitude)
    lines.push({
      text: `📅 ${dateStr} • ${timeStr}`,
      isBold: true,
      size: 13.5 * scale,
      color: '#ffffff',
    })
  }

  // Address
  if (config.showAddress && location.address) {
    lines.push({
      text: `📍 ${location.address}`,
      isBold: false,
      size: 13 * scale,
      color: '#f4f4f5',
    })
  }

  // Coordinates & Accuracy
  if (config.showCoordinates && location.latitude !== null && location.longitude !== null) {
    let coordText = `🌐 ${location.latitude.toFixed(6)}°, ${location.longitude.toFixed(6)}°`
    if (config.showAccuracy && location.accuracy !== null) {
      coordText += ` (±${location.accuracy}m)`
    }
    lines.push({
      text: coordText,
      isBold: false,
      size: 11.5 * scale,
      color: '#a1a1aa',
    })
  }

  if (lines.length === 0) return

  // Measure badge width & height
  const badgePadX = 16 * scale
  const badgePadY = 12 * scale
  const maxContentWidth = canvasWidth * 0.88

  // Word wrap lines if too long
  const finalLines: { text: string; isBold?: boolean; size: number; color: string }[] = []

  for (const item of lines) {
    ctx.font = `${item.isBold ? '600' : '400'} ${item.size}px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`
    const words = item.text.split(' ')
    let currentLine = words[0] || ''

    for (let i = 1; i < words.length; i++) {
      const testLine = `${currentLine} ${words[i]}`
      if (ctx.measureText(testLine).width > maxContentWidth) {
        finalLines.push({ ...item, text: currentLine })
        currentLine = `   ${words[i]}`
      } else {
        currentLine = testLine
      }
    }
    finalLines.push({ ...item, text: currentLine })
  }

  let totalTextHeight = 0
  let maxLineWidth = 0

  for (const item of finalLines) {
    ctx.font = `${item.isBold ? '600' : '400'} ${item.size}px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`
    const width = ctx.measureText(item.text).width
    if (width > maxLineWidth) maxLineWidth = width
    totalTextHeight += item.size + lineSpacing
  }

  const badgeWidth = maxLineWidth + badgePadX * 2
  const badgeHeight = totalTextHeight + badgePadY * 2 - lineSpacing
  const borderRadius = 12 * scale

  // Position calculation
  let x = padding
  let y = canvasHeight - badgeHeight - padding

  if (config.position === 'bottom-right') {
    x = canvasWidth - badgeWidth - padding
    y = canvasHeight - badgeHeight - padding
  } else if (config.position === 'top-left') {
    x = padding
    y = padding
  } else if (config.position === 'top-right') {
    x = canvasWidth - badgeWidth - padding
    y = padding
  }

  // Draw semi-transparent dark rounded badge
  ctx.save()
  ctx.fillStyle = 'rgba(9, 9, 11, 0.78)'
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.16)'
  ctx.lineWidth = 1.5 * scale

  roundRect(ctx, x, y, badgeWidth, badgeHeight, borderRadius)
  ctx.fill()
  ctx.stroke()

  // Draw text lines inside badge
  let currentY = y + badgePadY

  for (const item of finalLines) {
    ctx.font = `${item.isBold ? '600' : '400'} ${item.size}px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`
    ctx.fillStyle = item.color
    ctx.textBaseline = 'top'
    ctx.fillText(item.text, x + badgePadX, currentY)
    currentY += item.size + lineSpacing
  }
  ctx.restore()
}

async function drawWatermark(
  ctx: CanvasRenderingContext2D,
  canvasWidth: number,
  canvasHeight: number,
  config: WatermarkConfig
): Promise<void> {
  return new Promise(resolve => {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => {
      const isLandscape = canvasWidth > canvasHeight
      const scale = Math.max(1, (isLandscape ? canvasHeight : canvasWidth) / 1080)
      const padding = config.padding * scale

      // Target watermark width: pada foto landscape gunakan proporsi berbasis tinggi agar tidak membesar drastis
      const effectiveBase = isLandscape ? canvasHeight * 1.25 : canvasWidth
      const targetWidth = effectiveBase * (config.sizePercent / 100)
      const aspectRatio = img.naturalWidth / img.naturalHeight
      const targetHeight = targetWidth / aspectRatio

      let x = padding
      let y = padding

      switch (config.position) {
        case 'top-left':
          x = padding
          y = padding
          break
        case 'top-center':
          x = (canvasWidth - targetWidth) / 2
          y = padding
          break
        case 'top-right':
          x = canvasWidth - targetWidth - padding
          y = padding
          break
        case 'center':
          x = (canvasWidth - targetWidth) / 2
          y = (canvasHeight - targetHeight) / 2
          break
        case 'bottom-left':
          x = padding
          y = canvasHeight - targetHeight - padding
          break
        case 'bottom-center':
          x = (canvasWidth - targetWidth) / 2
          y = canvasHeight - targetHeight - padding
          break
        case 'bottom-right':
          x = canvasWidth - targetWidth - padding
          y = canvasHeight - targetHeight - padding
          break
      }

      ctx.save()
      ctx.globalAlpha = Math.max(0.1, Math.min(1.0, config.opacity))
      ctx.drawImage(img, x, y, targetWidth, targetHeight)
      ctx.restore()
      resolve()
    }

    img.onerror = () => {
      resolve() // continue even if watermark image fails to load
    }

    img.src = config.imageUrl
  })
}

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  radius: number
) {
  ctx.beginPath()
  ctx.moveTo(x + radius, y)
  ctx.arcTo(x + w, y, x + w, y + h, radius)
  ctx.arcTo(x + w, y + h, x, y + h, radius)
  ctx.arcTo(x, y + h, x, y, radius)
  ctx.arcTo(x, y, x + w, y, radius)
  ctx.closePath()
}
