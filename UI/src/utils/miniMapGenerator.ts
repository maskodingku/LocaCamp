/**
 * Generator Cuplikan Peta Mini (Mini Map) 100% Sisi Visitor (Client-Side)
 * Menggunakan proyeksi Web Mercator Slippy Map dan tile publik CartoDB Voyager (CORS anonymous).
 * Tanpa ketergantungan server atau API berbayar.
 */

// Cache in-memory untuk menyimpan hasil render peta berdasarkan koordinat & ukuran
const mapCache = new Map<string, { canvas: HTMLCanvasElement; dataUrl: string; timestamp: number }>()
const MAX_CACHE_SIZE = 25

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
 * Menggambar pin marker merah presisi di titik tengah peta
 */
function drawPinMarker(ctx: CanvasRenderingContext2D, centerX: number, centerY: number, scale: number) {
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
 * Fallback jika offline / jaringan tidak dapat memuat tile
 */
function drawOfflineFallback(canvas: HTMLCanvasElement, lat: number, lon: number) {
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  const w = canvas.width
  const h = canvas.height

  ctx.fillStyle = '#1e293b'
  ctx.fillRect(0, 0, w, h)

  // Grid jalanan sintetis
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)'
  ctx.lineWidth = 2
  for (let i = 0; i < w; i += 30) {
    ctx.beginPath()
    ctx.moveTo(i, 0)
    ctx.lineTo(i, h)
    ctx.stroke()
  }
  for (let j = 0; j < h; j += 30) {
    ctx.beginPath()
    ctx.moveTo(0, j)
    ctx.lineTo(w, j)
    ctx.stroke()
  }

  // Pin tengah
  drawPinMarker(ctx, w / 2, h / 2, Math.max(1, w / 180))

  // Label koordinat mini
  ctx.fillStyle = 'rgba(255, 255, 255, 0.7)'
  ctx.font = '9px monospace'
  ctx.textAlign = 'center'
  ctx.fillText(`${lat.toFixed(4)}°, ${lon.toFixed(4)}°`, w / 2, h - 8)
}

/**
 * Menghasilkan HTMLCanvasElement berisi potongan peta jalan sekitar dan pin di tengahnya
 */
export async function generateMiniMapCanvas(
  lat: number,
  lon: number,
  width: number = 200,
  height: number = 200,
  zoom: number = 16
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

    const subdomains = ['a', 'b', 'c', 'd']
    const tilePromises: {
      dx: number
      dy: number
      promise: Promise<HTMLImageElement>
    }[] = []

    for (let dx = startDx; dx <= endDx; dx++) {
      for (let dy = startDy; dy <= endDy; dy++) {
        const curX = tileX + dx
        const curY = tileY + dy
        const sub = subdomains[Math.abs((curX + curY) % subdomains.length)]
        const tileUrl = `https://${sub}.basemaps.cartocdn.com/rastertiles/voyager/${zoom}/${curX}/${curY}.png`

        tilePromises.push({
          dx,
          dy,
          promise: loadTileImage(tileUrl).catch(() => {
            // Fallback ke OpenStreetMap
            return loadTileImage(
              `https://tile.openstreetmap.org/${zoom}/${curX}/${curY}.png`
            )
          }),
        })
      }
    }

    // Tunggu semua tile selesai diunduh
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
      // Gambar Pin Merah di Titik Tengah (Wajib di tengah canvas)
      const pinScale = Math.max(1, width / 180)
      drawPinMarker(ctx, width / 2, height / 2, pinScale)

      // Label peta kecil di sudut kiri bawah
      ctx.fillStyle = 'rgba(0, 0, 0, 0.45)'
      ctx.fillRect(4, height - 14, 38, 10)
      ctx.fillStyle = '#ffffff'
      ctx.font = '7.5px sans-serif'
      ctx.fillText('© OSM', 7, height - 6)
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
 * Menghasilkan Data URL gambar mini map (PNG)
 */
export async function getMiniMapDataUrl(
  lat: number,
  lon: number,
  width: number = 200,
  height: number = 200,
  zoom: number = 16
): Promise<string> {
  const cacheKey = `${lat.toFixed(5)}_${lon.toFixed(5)}_${width}_${height}_${zoom}`
  const cached = mapCache.get(cacheKey)
  if (cached && Date.now() - cached.timestamp < 300000) {
    return cached.dataUrl
  }

  const canvas = await generateMiniMapCanvas(lat, lon, width, height, zoom)
  return canvas.toDataURL('image/png')
}
