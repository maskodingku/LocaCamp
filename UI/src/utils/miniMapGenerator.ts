/**
 * Generator Cuplikan Peta Mini (Google Maps) 100% Sisi Visitor (Client-Side)
 * Menggunakan server ubin resmi Google Maps (mt0, mt1, mt2, mt3) dengan failover otomatis.
 * Dilengkapi header CORS publik (Access-Control-Allow-Origin: *), tanpa perlu API key backend.
 */

// Cache in-memory untuk menyimpan hasil render peta berdasarkan koordinat & ukuran
const mapCache = new Map<string, { canvas: HTMLCanvasElement; dataUrl: string; timestamp: number }>()
const MAX_CACHE_SIZE = 25

const GOOGLE_SUBDOMAINS = ['mt0', 'mt1', 'mt2', 'mt3']

/**
 * Menghitung koordinat ubin (tile) Web Mercator
 */
function getTileCoordinates(lat: number, lon: number, zoom: number) {
  const n = Math.pow(2, zoom)
  const xExact = ((lon + 180) / 360) * n
  const latRad = (lat * Math.PI) / 180
  const yExact =
    ((1 - Math.log(Math.tan(latRad) + 1 / Math.cos(latRad)) / Math.PI) / 2) * n

  return {
    tileX: Math.floor(xExact),
    tileY: Math.floor(yExact),
    subX: (xExact - Math.floor(xExact)) * 256,
    subY: (yExact - Math.floor(yExact)) * 256,
  }
}

/**
 * Memuat gambar tile secara async dengan CORS anonymous
 */
function loadTileImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => resolve(img)
    img.onerror = () => reject(new Error(`Gagal memuat tile: ${url}`))
    img.src = url
  })
}

/**
 * Memuat ubin Google Maps dengan rotasi dan failover berantai mt0 -> mt1 -> mt2 -> mt3
 */
async function loadGoogleTileWithFailover(
  tileX: number,
  tileY: number,
  zoom: number
): Promise<HTMLImageElement> {
  const startIndex = Math.abs((tileX + tileY) % GOOGLE_SUBDOMAINS.length)
  const subOrder = GOOGLE_SUBDOMAINS.map(
    (_, i) => GOOGLE_SUBDOMAINS[(startIndex + i) % GOOGLE_SUBDOMAINS.length]
  )

  // 1. Coba sub-domain Google (mt0, mt1, mt2, mt3) secara berurutan jika ada yang error
  for (const sub of subOrder) {
    const url = `https://${sub}.google.com/vt/lyrs=m&hl=id&x=${tileX}&y=${tileY}&z=${zoom}`
    try {
      return await loadTileImage(url)
    } catch {
      // Beralih ke sub-domain berikutnya jika gagal
      continue
    }
  }

  // 2. Fallback darurat jika seluruh sub-domain Google gagal diakses
  try {
    return await loadTileImage(
      `https://a.basemaps.cartocdn.com/rastertiles/voyager/${zoom}/${tileX}/${tileY}.png`
    )
  } catch {
    return await loadTileImage(
      `https://tile.openstreetmap.org/${zoom}/${tileX}/${tileY}.png`
    )
  }
}

/**
 * Menggambar pin marker merah presisi khas Google Maps di titik tengah peta
 */
function drawPinMarker(
  ctx: CanvasRenderingContext2D,
  centerX: number,
  centerY: number,
  scale: number
) {
  const pinW = 20 * scale
  const pinH = 28 * scale
  const tipX = centerX
  const tipY = centerY

  ctx.save()

  // 1. Bayangan Pin di Tanah
  ctx.beginPath()
  ctx.ellipse(tipX, tipY + 1 * scale, 5 * scale, 2.5 * scale, 0, 0, Math.PI * 2)
  ctx.fillStyle = 'rgba(0, 0, 0, 0.4)'
  ctx.fill()

  // 2. Badan Pin Merah (Gaya Google Maps)
  ctx.beginPath()
  ctx.moveTo(tipX, tipY)
  // Lengkungan kiri ke kepala pin
  ctx.bezierCurveTo(
    tipX - pinW * 0.55,
    tipY - pinH * 0.5,
    tipX - pinW * 0.5,
    tipY - pinH * 0.9,
    tipX,
    tipY - pinH
  )
  // Lengkungan kanan kembali ke ujung pin
  ctx.bezierCurveTo(
    tipX + pinW * 0.5,
    tipY - pinH * 0.9,
    tipX + pinW * 0.55,
    tipY - pinH * 0.5,
    tipX,
    tipY
  )
  ctx.fillStyle = '#ea4335'
  ctx.fill()
  ctx.strokeStyle = '#b91c1c'
  ctx.lineWidth = 1 * scale
  ctx.stroke()

  // 3. Titik Lingkaran Dalam Kepala Pin
  ctx.beginPath()
  ctx.arc(tipX, tipY - pinH * 0.65, 3.8 * scale, 0, Math.PI * 2)
  ctx.fillStyle = '#7f1d1d'
  ctx.fill()

  ctx.restore()
}

/**
 * Menggambar logo resmi Google multi-warna di sudut kiri bawah peta
 */
function drawGoogleLogo(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  scale: number
) {
  ctx.save()
  const fontSize = Math.max(9, Math.round(10.5 * scale))
  ctx.font = `bold ${fontSize}px -apple-system, BlinkMacSystemFont, "Product Sans", Roboto, sans-serif`
  ctx.textBaseline = 'bottom'

  const letters = [
    { char: 'G', color: '#4285F4' },
    { char: 'o', color: '#EA4335' },
    { char: 'o', color: '#FBBC05' },
    { char: 'g', color: '#4285F4' },
    { char: 'l', color: '#34A853' },
    { char: 'e', color: '#EA4335' },
  ]

  let totalW = 0
  for (const item of letters) {
    totalW += ctx.measureText(item.char).width
  }

  // Latar belakang kapsul halus transparan di belakang teks Google
  const padX = 3 * scale
  const padY = 2 * scale
  ctx.fillStyle = 'rgba(255, 255, 255, 0.76)'
  const bgX = x - padX
  const bgY = y - fontSize - padY
  const bgW = totalW + padX * 2
  const bgH = fontSize + padY * 2
  const r = 3 * scale

  ctx.beginPath()
  if (typeof (ctx as unknown as { roundRect?: unknown }).roundRect === 'function') {
    ctx.roundRect(bgX, bgY, bgW, bgH, r)
  } else {
    ctx.rect(bgX, bgY, bgW, bgH)
  }
  ctx.fill()

  let curX = x
  for (const item of letters) {
    ctx.fillStyle = item.color
    ctx.fillText(item.char, curX, y)
    curX += ctx.measureText(item.char).width
  }

  ctx.restore()
}

/**
 * Fallback jika offline / jaringan tidak dapat memuat tile
 */
function drawOfflineFallback(canvas: HTMLCanvasElement, _lat: number, _lon: number) {
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  const w = canvas.width
  const h = canvas.height

  ctx.fillStyle = '#f1f5f9'
  ctx.fillRect(0, 0, w, h)

  // Grid jalanan sintetis abu-abu muda
  ctx.strokeStyle = 'rgba(100, 116, 139, 0.25)'
  ctx.lineWidth = 1.5
  for (let i = 0; i < w; i += 28) {
    ctx.beginPath()
    ctx.moveTo(i, 0)
    ctx.lineTo(i, h)
    ctx.stroke()
  }
  for (let j = 0; j < h; j += 28) {
    ctx.beginPath()
    ctx.moveTo(0, j)
    ctx.lineTo(w, j)
    ctx.stroke()
  }

  // Pin tengah
  drawPinMarker(ctx, w / 2, h / 2, Math.max(1, w / 180))

  // Logo Google di kiri bawah
  drawGoogleLogo(ctx, 6, h - 5, Math.max(0.9, w / 200))
}

/**
 * Menghasilkan HTMLCanvasElement berisi potongan Google Maps dan pin di tengahnya
 */
export async function generateMiniMapCanvas(
  lat: number,
  lon: number,
  width: number = 200,
  height: number = 200,
  zoom: number = 17
): Promise<HTMLCanvasElement> {
  const cacheKey = `${lat.toFixed(5)}_${lon.toFixed(5)}_${width}_${height}_${zoom}`
  const cached = mapCache.get(cacheKey)
  if (cached && Date.now() - cached.timestamp < 300000) {
    // Cache valid 5 menit
    return cached.canvas
  }

  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d')

  if (!ctx) return canvas

  try {
    const { tileX, tileY, subX, subY } = getTileCoordinates(lat, lon, zoom)

    // Posisi gambar tile tengah di dalam canvas output
    const centerTileDrawX = width / 2 - subX
    const centerTileDrawY = height / 2 - subY

    // Tentukan rentang tile yang perlu diunduh untuk memenuhi canvas
    const startDx = Math.floor(-centerTileDrawX / 256)
    const endDx = Math.ceil((width - centerTileDrawX) / 256)
    const startDy = Math.floor(-centerTileDrawY / 256)
    const endDy = Math.ceil((height - centerTileDrawY) / 256)

    const tilePromises: {
      dx: number
      dy: number
      promise: Promise<HTMLImageElement>
    }[] = []

    for (let dx = startDx; dx <= endDx; dx++) {
      for (let dy = startDy; dy <= endDy; dy++) {
        const curX = tileX + dx
        const curY = tileY + dy

        tilePromises.push({
          dx,
          dy,
          promise: loadGoogleTileWithFailover(curX, curY, zoom),
        })
      }
    }

    // Tunggu semua tile selesai diunduh dengan failover
    const loadedTiles = await Promise.allSettled(
      tilePromises.map(async item => {
        const img = await item.promise
        return { dx: item.dx, dy: item.dy, img }
      })
    )

    // Render tile ke canvas
    let hasLoadedAnyTile = false
    for (const res of loadedTiles) {
      if (res.status === 'fulfilled') {
        const { dx, dy, img } = res.value
        const x = centerTileDrawX + dx * 256
        const y = centerTileDrawY + dy * 256
        ctx.drawImage(img, x, y, 256, 256)
        hasLoadedAnyTile = true
      }
    }

    if (!hasLoadedAnyTile) {
      drawOfflineFallback(canvas, lat, lon)
    } else {
      // 1. Gambar Pin Merah di Titik Tengah (Wajib di titik koordinat persis)
      const pinScale = Math.max(1, width / 180)
      drawPinMarker(ctx, width / 2, height / 2, pinScale)

      // 2. Gambar Logo Google Resmi di Sudut Kiri Bawah (Persis Foto Referensi)
      drawGoogleLogo(ctx, 6, height - 5, Math.max(0.85, width / 220))
    }

    // Simpan ke cache
    if (mapCache.size >= MAX_CACHE_SIZE) {
      const oldestKey = mapCache.keys().next().value
      if (oldestKey) mapCache.delete(oldestKey)
    }
    mapCache.set(cacheKey, {
      canvas,
      dataUrl: canvas.toDataURL('image/png'),
      timestamp: Date.now(),
    })

    return canvas
  } catch {
    drawOfflineFallback(canvas, lat, lon)
    return canvas
  }
}

/**
 * Menghasilkan Data URL gambar mini map Google Maps (PNG)
 */
export async function getMiniMapDataUrl(
  lat: number,
  lon: number,
  width: number = 200,
  height: number = 200,
  zoom: number = 17
): Promise<string> {
  const cacheKey = `${lat.toFixed(5)}_${lon.toFixed(5)}_${width}_${height}_${zoom}`
  const cached = mapCache.get(cacheKey)
  if (cached && Date.now() - cached.timestamp < 300000) {
    return cached.dataUrl
  }

  const canvas = await generateMiniMapCanvas(lat, lon, width, height, zoom)
  return canvas.toDataURL('image/png')
}
