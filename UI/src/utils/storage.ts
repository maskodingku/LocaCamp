import defaultWatermarkUrl from '../assets/default-watermark.jpg'
import type {
  WatermarkConfig,
  GeotagDisplayConfig,
  CameraQualityConfig,
  CameraEffectConfig,
} from '../types/camera'

export const DEFAULT_WATERMARK_URL = defaultWatermarkUrl

export const DEFAULT_WATERMARK_CONFIG: WatermarkConfig = {
  imageUrl: DEFAULT_WATERMARK_URL,
  position: 'top-right',
  sizePercent: 22,
  opacity: 0.9,
  padding: 24,
}

export const DEFAULT_GEOTAG_CONFIG: GeotagDisplayConfig = {
  showAddress: true,
  showCoordinates: true,
  showTimestamp: true,
  showAccuracy: true,
  position: 'bottom-right',
  fontSize: 'small',
}

export const DEFAULT_CAMERA_QUALITY_CONFIG: CameraQualityConfig = {
  preset: 'auto',
  jpegTier: 'high',
  denoiseMode: 'smooth',
}

export const DEFAULT_CAMERA_EFFECT_CONFIG: CameraEffectConfig = {
  preset: 'normal',
  finetune: {
    brightness: 0,
    contrast: 0,
    saturation: 0,
  },
}

const STORAGE_KEY_WATERMARK = 'locacamp_settings_watermark'
const STORAGE_KEY_GEOTAG = 'locacamp_settings_geotag'
const STORAGE_KEY_CAMERA_QUALITY = 'locacamp_settings_camera_quality'
const STORAGE_KEY_CAMERA_EFFECT = 'locacamp_settings_camera_effect'
const STORAGE_KEY_MIGRATED = 'locacamp_settings_migrated_v3'

const OLD_DEFAULT_WATERMARK_KEYWORD = 'LOCACAMP'

/**
 * Membaca konfigurasi watermark dari localStorage dengan fallback ke default
 */
export function loadStoredWatermark(): WatermarkConfig {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_WATERMARK)
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<WatermarkConfig>
      // Migrasi jika masih menggunakan default SVG lama
      let imageUrl = parsed.imageUrl
      if (
        imageUrl &&
        (imageUrl.includes(OLD_DEFAULT_WATERMARK_KEYWORD) ||
          imageUrl.startsWith('data:image/svg+xml'))
      ) {
        imageUrl = DEFAULT_WATERMARK_URL
      }

      return {
        ...DEFAULT_WATERMARK_CONFIG,
        ...parsed,
        imageUrl: imageUrl ?? DEFAULT_WATERMARK_URL,
      }
    }
  } catch {
    // Jika ada error atau storage diblokir
  }
  return DEFAULT_WATERMARK_CONFIG
}

/**
 * Menyimpan konfigurasi watermark ke localStorage secara aman
 */
export function saveStoredWatermark(config: WatermarkConfig): void {
  try {
    localStorage.setItem(STORAGE_KEY_WATERMARK, JSON.stringify(config))
  } catch {
    // Abaikan jika kuota storage penuh
  }
}

/**
 * Membaca konfigurasi tampilan geotag dari localStorage
 */
export function loadStoredGeotag(): GeotagDisplayConfig {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_GEOTAG)
    const isMigrated = localStorage.getItem(STORAGE_KEY_MIGRATED) === 'true'

    if (raw) {
      const parsed = JSON.parse(raw) as Partial<GeotagDisplayConfig>

      // Jika belum dimigrasi ke v3, migrasikan posisi dan default fontSize baru
      if (!isMigrated) {
        if (parsed.position === 'bottom-left') {
          parsed.position = 'bottom-right'
        }
        if (parsed.fontSize === 'medium') {
          parsed.fontSize = 'small'
        }
        localStorage.setItem(STORAGE_KEY_MIGRATED, 'true')
        localStorage.setItem(
          STORAGE_KEY_GEOTAG,
          JSON.stringify({ ...DEFAULT_GEOTAG_CONFIG, ...parsed })
        )
      }

      return {
        ...DEFAULT_GEOTAG_CONFIG,
        ...parsed,
      }
    } else {
      localStorage.setItem(STORAGE_KEY_MIGRATED, 'true')
    }
  } catch {
    // Abaikan
  }
  return DEFAULT_GEOTAG_CONFIG
}

/**
 * Menyimpan konfigurasi tampilan geotag ke localStorage
 */
export function saveStoredGeotag(config: GeotagDisplayConfig): void {
  try {
    localStorage.setItem(STORAGE_KEY_GEOTAG, JSON.stringify(config))
  } catch {
    // Abaikan
  }
}

/**
 * Membaca konfigurasi kualitas kamera dari localStorage
 */
export function loadStoredCameraQuality(): CameraQualityConfig {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_CAMERA_QUALITY)
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<CameraQualityConfig>
      return {
        ...DEFAULT_CAMERA_QUALITY_CONFIG,
        ...parsed,
        denoiseMode: parsed.denoiseMode || DEFAULT_CAMERA_QUALITY_CONFIG.denoiseMode,
      }
    }
  } catch {
    // Abaikan
  }
  return DEFAULT_CAMERA_QUALITY_CONFIG
}

/**
 * Menyimpan konfigurasi kualitas kamera ke localStorage
 */
export function saveStoredCameraQuality(config: CameraQualityConfig): void {
  try {
    localStorage.setItem(STORAGE_KEY_CAMERA_QUALITY, JSON.stringify(config))
  } catch {
    // Abaikan
  }
}

/**
 * Membaca konfigurasi efek kamera dari localStorage
 */
export function loadStoredCameraEffect(): CameraEffectConfig {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_CAMERA_EFFECT)
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<CameraEffectConfig>
      return {
        preset: parsed.preset || DEFAULT_CAMERA_EFFECT_CONFIG.preset,
        finetune: {
          ...DEFAULT_CAMERA_EFFECT_CONFIG.finetune,
          ...(parsed.finetune || {}),
        },
      }
    }
  } catch {
    // Abaikan
  }
  return DEFAULT_CAMERA_EFFECT_CONFIG
}

/**
 * Menyimpan konfigurasi efek kamera ke localStorage
 */
export function saveStoredCameraEffect(config: CameraEffectConfig): void {
  try {
    localStorage.setItem(STORAGE_KEY_CAMERA_EFFECT, JSON.stringify(config))
  } catch {
    // Abaikan
  }
}

/**
 * Menghapus setting tersimpan dan mengembalikan ke setelan awal
 */
export function clearStoredSettings(): void {
  try {
    localStorage.removeItem(STORAGE_KEY_WATERMARK)
    localStorage.removeItem(STORAGE_KEY_GEOTAG)
    localStorage.removeItem(STORAGE_KEY_CAMERA_QUALITY)
    localStorage.removeItem(STORAGE_KEY_CAMERA_EFFECT)
  } catch {
    // Abaikan
  }
}

/**
 * Mengompresi gambar custom yang diunggah agar muat di localStorage tanpa error kuota
 */
export async function optimizeWatermarkImage(dataUrl: string): Promise<string> {
  // Jika SVG atau string pendek, tidak perlu dikompresi
  if (dataUrl.startsWith('data:image/svg') || dataUrl.length < 50000) {
    return dataUrl
  }

  return new Promise(resolve => {
    const img = new Image()
    img.onload = () => {
      const canvas = document.createElement('canvas')
      const maxDimension = 600

      let { width, height } = img
      if (width > height && width > maxDimension) {
        height = Math.round((height * maxDimension) / width)
        width = maxDimension
      } else if (height > maxDimension) {
        width = Math.round((width * maxDimension) / height)
        height = maxDimension
      }

      canvas.width = width
      canvas.height = height
      const ctx = canvas.getContext('2d')
      if (!ctx) {
        resolve(dataUrl)
        return
      }

      ctx.drawImage(img, 0, 0, width, height)
      resolve(canvas.toDataURL('image/png'))
    }

    img.onerror = () => {
      resolve(dataUrl)
    }

    img.src = dataUrl
  })
}
