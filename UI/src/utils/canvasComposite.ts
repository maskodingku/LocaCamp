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
import { generateMiniMapCanvas } from './miniMapGenerator'

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
  // Inisialisasi Canvas 2D dengan dukungan Wide-Gamut Display-P3 (Warna asli sensor kamera HP 100%)
  let ctx: CanvasRenderingContext2D | null = null
  try {
    ctx = canvas.getContext('2d', {
      alpha: false,
      colorSpace: 'display-p3',
      desynchronized: true,
    }) as CanvasRenderingContext2D | null
  } catch {
    ctx = null
  }
  if (!ctx) {
    ctx = canvas.getContext('2d', { alpha: false })
  }
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
      let bitmap: ImageBitmap
      try {
        // Bit-exact decoding: Tanpa konversi color space browser & tanpa premultiplied alpha
        bitmap = await createImageBitmap(blob, {
          imageOrientation: 'none',
          premultiplyAlpha: 'none',
          colorSpaceConversion: 'none',
        })
      } catch {
        bitmap = await createImageBitmap(blob)
      }
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
  // Gunakan Math.round agar dimensi kanvas tepat 1:1 pixel-perfect (mencegah bilinear resampling blur)
  const width = Math.round(shouldRotateFrame ? rawHeight : rawWidth)
  const height = Math.round(shouldRotateFrame ? rawWidth : rawHeight)

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

  // 2. Draw Camera Frame (Zero-Filter Direct Blit jika preset normal untuk menjaga 100% piksel asli)
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
  await drawGeotagBadge(ctx, width, height, location, displayConfig)

  // 4. Draw Watermark / Logo if available
  if (watermark.imageUrl) {
    await drawWatermark(ctx, width, height, watermark)
  }

  // Pilihan kualitas ekspor JPEG: Ultra disetel 1.0 untuk mencegah kompresi ulang & distorsi chroma subsampling
  const qualityMap: Record<JpegQualityTier, number> = {
    ultra: 1.0,
    high: 0.96,
    medium: 0.88,
  }
  const exportQuality = qualityMap[jpegTier] || 1.0

  return {
    dataUrl: canvas.toDataURL('image/jpeg', exportQuality),
    width,
    height,
  }
}

async function drawGeotagBadge(
  ctx: CanvasRenderingContext2D,
  canvasWidth: number,
  canvasHeight: number,
  location: GeoLocationData,
  config: GeotagDisplayConfig
): Promise<void> {
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

  const hasMiniMap =
    config.showMiniMap !== false &&
    location.latitude !== null &&
    location.longitude !== null

  // Sediakan ruang untuk mini map di sebelah kanan teks jika aktif
  const estimatedMapSize = hasMiniMap ? 78 * scale : 0
  const mapGap = hasMiniMap ? 12 * scale : 0
  const maxContentWidth = Math.max(
    120 * scale,
    canvasWidth * 0.88 - (hasMiniMap ? estimatedMapSize + mapGap + badgePadX : 0)
  )

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

  // Buat mini map canvas jika aktif
  let mapCanvas: HTMLCanvasElement | null = null
  let mapSize = 0

  if (hasMiniMap && location.latitude !== null && location.longitude !== null) {
    mapSize = Math.max(68 * scale, totalTextHeight)
    try {
      mapCanvas = await generateMiniMapCanvas(
        location.latitude,
        location.longitude,
        Math.round(mapSize * 1.5),
        Math.round(mapSize * 1.5),
        17
      )
    } catch {
      mapCanvas = null
    }
  }

  const badgeWidth = maxLineWidth + badgePadX * 2 + (mapCanvas ? mapGap + mapSize : 0)
  const badgeHeight = Math.max(
    totalTextHeight + badgePadY * 2 - lineSpacing,
    mapCanvas ? mapSize + badgePadY * 2 : 0
  )
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

  // Draw mini map on the right side if available
  if (mapCanvas) {
    const mapX = x + maxLineWidth + badgePadX + mapGap
    const mapY = y + (badgeHeight - mapSize) / 2
    const mapRadius = 10 * scale

    ctx.save()
    roundRect(ctx, mapX, mapY, mapSize, mapSize, mapRadius)
    ctx.clip()
    ctx.drawImage(mapCanvas, mapX, mapY, mapSize, mapSize)
    ctx.restore()

    // Border halus di sekeliling mini map
    ctx.save()
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.25)'
    ctx.lineWidth = 1.2 * scale
    roundRect(ctx, mapX, mapY, mapSize, mapSize, mapRadius)
    ctx.stroke()
    ctx.restore()
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
