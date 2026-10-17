import defaultWatermarkUrl from '../assets/default-watermark.jpg'
import type {
  WatermarkConfig,
  GeotagDisplayConfig,
  CameraQualityConfig,
  CameraEffectConfig,
  ProfileConfig,
} from '../types/camera'

export const DEFAULT_WATERMARK_URL = defaultWatermarkUrl

export const DEFAULT_WATERMARK_CONFIG: WatermarkConfig = {
  imageUrl: DEFAULT_WATERMARK_URL,
  position: 'top-right',
  sizePercent: 22,
  opacity: 0.9,
  padding: 24,
}

export const DEFAULT_PROFILE_CONFIG: ProfileConfig = {
  enabled: false,
  jobTitle: '',
  name: '',
  fontFamily: 'Inter',
  position: 'above-geotag',
  fontWeight: 'medium',
  fontSize: 13,
  showBorder: true,
  backgroundColor: 'rgba(9, 9, 11, 0.78)',
  textColor: '#ffffff',
}

export const DEFAULT_GEOTAG_CONFIG: GeotagDisplayConfig = {
  showAddress: true,
  showCoordinates: true,
  showTimestamp: true,
  showAccuracy: true,
  position: 'bottom-right',
  fontSize: 'small',
  showMiniMap: true,
}

export const DEFAULT_CAMERA_QUALITY_CONFIG: CameraQualityConfig = {
  preset: 'auto',
  jpegTier: 'ultra',
  denoiseMode: 'natural',
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
const STORAGE_KEY_PROFILE = 'locacamp_settings_profile'
const STORAGE_KEY_GEOTAG = 'locacamp_settings_geotag'
const STORAGE_KEY_CAMERA_QUALITY = 'locacamp_settings_camera_quality'
const STORAGE_KEY_CAMERA_EFFECT = 'locacamp_settings_camera_effect'
const STORAGE_KEY_MIGRATED = 'locacamp_settings_migrated_v3'
const STORAGE_KEY_DEFAULT_LOGO_CACHE = 'locacamp_cached_default_logo'

const OLD_DEFAULT_WATERMARK_KEYWORD = 'LOCACAMP'

/**
 * Mengambil URL Logo Amerta default aktif, memprioritaskan Data URL base64 yang
 * tersimpan di localStorage agar tetap tampil seketika saat perangkat offline / tanpa jaringan.
 */
export function getCachedDefaultLogoUrl(): string {
  try {
    const cached = localStorage.getItem(STORAGE_KEY_DEFAULT_LOGO_CACHE)
    if (cached && cached.startsWith('data:image/')) {
      return cached
    }
  } catch {
    // Abaikan
  }
  return DEFAULT_WATERMARK_URL
}

/**
 * Menyimpan gambar logo Amerta default ke localStorage browser sebagai Data URL base64.
 * Fungsi ini otomatis dipanggil saat aplikasi dimuat pertama kali.
 */
export async function ensureDefaultLogoCached(): Promise<string> {
  try {
    const cached = localStorage.getItem(STORAGE_KEY_DEFAULT_LOGO_CACHE)
    if (cached && cached.startsWith('data:image/')) {
      return cached
    }

    const response = await fetch(DEFAULT_WATERMARK_URL)
    const blob = await response.blob()

    return new Promise(resolve => {
      const reader = new FileReader()
      reader.onloadend = () => {
        const base64data = reader.result as string
        if (base64data && base64data.startsWith('data:image/')) {
          try {
            localStorage.setItem(STORAGE_KEY_DEFAULT_LOGO_CACHE, base64data)
          } catch {
            // Kuota storage penuh
          }
          resolve(base64data)
        } else {
          resolve(DEFAULT_WATERMARK_URL)
        }
      }
      reader.onerror = () => resolve(DEFAULT_WATERMARK_URL)
      reader.readAsDataURL(blob)
    })
  } catch {
    // Fallback jika fetch terhalang, load lewat Image element
    return new Promise(resolve => {
      const img = new Image()
      img.crossOrigin = 'anonymous'
      img.onload = () => {
        try {
          const canvas = document.createElement('canvas')
          canvas.width = img.naturalWidth || img.width
          canvas.height = img.naturalHeight || img.height
          const ctx = canvas.getContext('2d')
          if (ctx) {
            ctx.drawImage(img, 0, 0)
            const dataUrl = canvas.toDataURL('image/jpeg', 0.95)
            try {
              localStorage.setItem(STORAGE_KEY_DEFAULT_LOGO_CACHE, dataUrl)
            } catch {
              // Abaikan
            }
            resolve(dataUrl)
            return
          }
        } catch {
          // Abaikan
        }
        resolve(DEFAULT_WATERMARK_URL)
      }
      img.onerror = () => resolve(DEFAULT_WATERMARK_URL)
      img.src = DEFAULT_WATERMARK_URL
    })
  }
}

/**
 * Membaca konfigurasi watermark dari localStorage dengan fallback ke default
 */
export function loadStoredWatermark(): WatermarkConfig {
  const defaultLogo = getCachedDefaultLogoUrl()
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
        imageUrl = defaultLogo
      } else if (!imageUrl || imageUrl === DEFAULT_WATERMARK_URL) {
        imageUrl = defaultLogo
      }

      return {
        ...DEFAULT_WATERMARK_CONFIG,
        ...parsed,
        imageUrl: imageUrl ?? defaultLogo,
      }
    }
  } catch {
    // Jika ada error atau storage diblokir
  }
  return {
    ...DEFAULT_WATERMARK_CONFIG,
    imageUrl: defaultLogo,
  }
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
 * Membaca konfigurasi profil pengguna dari localStorage
 */
export function loadStoredProfile(): ProfileConfig {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_PROFILE)
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<ProfileConfig>
      return {
        ...DEFAULT_PROFILE_CONFIG,
        ...parsed,
      }
    }
  } catch {
    // Abaikan
  }
  return DEFAULT_PROFILE_CONFIG
}

/**
 * Menyimpan konfigurasi profil pengguna ke localStorage
 */
export function saveStoredProfile(config: ProfileConfig): void {
  try {
    localStorage.setItem(STORAGE_KEY_PROFILE, JSON.stringify(config))
  } catch {
    // Abaikan
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
    localStorage.removeItem(STORAGE_KEY_PROFILE)
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
