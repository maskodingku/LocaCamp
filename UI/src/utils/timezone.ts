/**
 * Menentukan singkatan zona waktu (WIB, WITA, WIT) berdasarkan koordinat bujur (longitude)
 * dengan fallback cerdas ke zona waktu perangkat pengguna.
 */
export function getTimezoneAbbreviation(
  longitude: number | null | undefined,
  date: Date = new Date()
): string {
  // 1. Jika koordinat longitude tersedia, gunakan pembagian geografis resmi Indonesia
  if (longitude !== null && longitude !== undefined) {
    if (longitude < 115.0) {
      return 'WIB'
    } else if (longitude < 125.0) {
      return 'WITA'
    } else {
      return 'WIT'
    }
  }

  // 2. Fallback: Cek nama timezone IANA perangkat
  try {
    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone
    if (timeZone === 'Asia/Jakarta' || timeZone === 'Asia/Pontianak') {
      return 'WIB'
    }
    if (timeZone === 'Asia/Makassar' || timeZone === 'Asia/Ujung_Pandang') {
      return 'WITA'
    }
    if (timeZone === 'Asia/Jayapura') {
      return 'WIT'
    }
  } catch {
    // Abaikan error resolusi timezone
  }

  // 3. Fallback: Cek offset menit UTC perangkat
  const offsetHours = -date.getTimezoneOffset() / 60
  if (offsetHours === 7) return 'WIB'
  if (offsetHours === 8) return 'WITA'
  if (offsetHours === 9) return 'WIT'

  // Jika berada di luar Indonesia, tampilkan UTC/GMT offset
  const sign = offsetHours >= 0 ? '+' : '-'
  const absHours = Math.abs(offsetHours)
  return `UTC${sign}${absHours}`
}

/**
 * Format waktu dengan jam, menit, detik dan zona waktu otomatis
 * Contoh hasil: "17:25:08 WIB"
 */
export function formatTimeWithTimezone(
  date: Date,
  longitude: number | null | undefined
): string {
  const timeStr = date.toLocaleTimeString('id-ID', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  })
  const tz = getTimezoneAbbreviation(longitude, date)
  return `${timeStr} ${tz}`
}
