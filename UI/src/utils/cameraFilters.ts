import type { CameraEffectConfig, DenoiseMode } from '../types/camera'

/**
 * Menghasilkan string CSS/Canvas filter berdasarkan preset dan finetuning yang dipilih.
 * Dapat digunakan secara seragam di <video style={{ filter }} /> (live preview 60fps)
 * maupun di ctx.filter canvas saat capture foto (WYSIWYG 100%).
 */
export function getCameraFilterString(
  effectConfig?: CameraEffectConfig | null,
  options?: {
    includeDenoise?: boolean
    denoiseMode?: DenoiseMode
  }
): string {
  if (!effectConfig) return 'none'

  const preset = effectConfig.preset || 'normal'
  const finetune = effectConfig.finetune || { brightness: 0, contrast: 0, saturation: 0 }

  // 1. Base values dari masing-masing Preset
  let baseBrightness = 1.0
  let baseContrast = 1.0
  let baseSaturate = 1.0
  let baseSepia = 0
  let baseGrayscale = 0
  let baseHueRotate = 0

  switch (preset) {
    case 'vivid':
      // Cerah & Hidup: Warna lebih kaya, kontras tajam segar
      baseBrightness = 1.04
      baseContrast = 1.10
      baseSaturate = 1.28
      break

    case 'warm':
      // Hangat Keemasan: Rona sore hari outdoor
      baseBrightness = 1.05
      baseContrast = 1.06
      baseSaturate = 1.12
      baseSepia = 0.16
      break

    case 'cool':
      // Sejuk Bersih: Tone dingin modern gedung/industri
      baseBrightness = 1.02
      baseContrast = 1.10
      baseSaturate = 1.15
      baseHueRotate = 6
      break

    case 'monochrome':
    case 'mono':
      // Monokrom: Hitam-putih berbobot untuk arsip resmi
      baseGrayscale = 1.0
      baseContrast = 1.22
      baseBrightness = 1.02
      break;

    case 'hdr':
      // HDR Boost: Angkat detail bayangan & kontras dramatis
      baseBrightness = 1.08
      baseContrast = 1.20
      baseSaturate = 1.22
      break

    case 'normal':
    default:
      baseBrightness = 1.0
      baseContrast = 1.0
      baseSaturate = 1.0
      break
  }

  // 2. Terapkan Finetuning (-20% s/d +20%)
  const finetuneBrightnessMult = 1 + (finetune.brightness || 0) / 100
  const finetuneContrastMult = 1 + (finetune.contrast || 0) / 100
  const finetuneSaturateMult = 1 + (finetune.saturation || 0) / 100

  const finalBrightness = Number(Math.max(0.6, Math.min(1.5, baseBrightness * finetuneBrightnessMult)).toFixed(3))
  const finalContrast = Number(Math.max(0.6, Math.min(1.6, baseContrast * finetuneContrastMult)).toFixed(3))
  const finalSaturate = Number(Math.max(0, Math.min(2.0, baseSaturate * finetuneSaturateMult)).toFixed(3))

  const parts: string[] = []

  // Tambahkan denoise blur jika diaktifkan (untuk canvas photo frame)
  if (options?.includeDenoise) {
    if (options.denoiseMode === 'smooth') {
      parts.push('blur(0.45px)')
    } else if (options.denoiseMode === 'extra') {
      parts.push('blur(0.85px)')
    }
  }

  if (finalBrightness !== 1.0) {
    parts.push(`brightness(${finalBrightness})`)
  }
  if (finalContrast !== 1.0) {
    parts.push(`contrast(${finalContrast})`)
  }
  if (baseGrayscale > 0) {
    parts.push(`grayscale(${baseGrayscale})`)
  } else if (finalSaturate !== 1.0) {
    parts.push(`saturate(${finalSaturate})`)
  }
  if (baseSepia > 0) {
    parts.push(`sepia(${baseSepia})`)
  }
  if (baseHueRotate !== 0) {
    parts.push(`hue-rotate(${baseHueRotate}deg)`)
  }

  return parts.length > 0 ? parts.join(' ') : 'none'
}
