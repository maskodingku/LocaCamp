// LocaCamp Service Worker - Offline-First & Auto-Update Engine
const CACHE_NAME = 'locacamp-cache-v1.2'

// File inti yang wajib di-precache saat instalasi awal PWA
const PRECACHE_URLS = [
  '/',
  '/index.html',
  '/manifest.webmanifest',
  '/manifest.json',
  '/favicon.svg',
  '/logo.jpg',
]

// 1. Install Event: Simpan aset inti ke Cache Storage & aktifkan langsung
self.addEventListener('install', event => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(PRECACHE_URLS).catch(err => {
          console.warn('[SW] Precache aset parsial:', err)
        })
      })
      .then(() => self.skipWaiting())
  )
})

// 2. Activate Event: Bersihkan cache versi lama dan ambil kendali klien seketika
self.addEventListener('activate', event => {
  event.waitUntil(
    caches
      .keys()
      .then(cacheNames => {
        return Promise.all(
          cacheNames
            .filter(name => name.startsWith('locacamp-') && name !== CACHE_NAME)
            .map(name => {
              console.log('[SW] Membersihkan cache versi lama:', name)
              return caches.delete(name)
            })
        )
      })
      .then(() => self.clients.claim())
  )
})

// 3. Fetch Event: Strategi Caching Cerdas
self.addEventListener('fetch', event => {
  const { request } = event

  // Hanya proses request GET
  if (request.method !== 'GET') return

  const url = new URL(request.url)

  // Lewatkan chrome-extension:// atau scheme non-http(s)
  if (!url.protocol.startsWith('http')) return

  // A. Navigasi Halaman Utama (HTML / SPA Document) -> Network-First with Cache Fallback
  // Ini memastikan saat ada internet selalu memuat versi terbaru,
  // dan saat offline di hutan/tanpa sinyal langsung beralih ke cache index.html
  if (request.mode === 'navigate' || request.destination === 'document') {
    event.respondWith(
      fetch(request)
        .then(networkResponse => {
          if (networkResponse && networkResponse.ok) {
            const clone = networkResponse.clone()
            caches.open(CACHE_NAME).then(cache => cache.put(request, clone))
          }
          return networkResponse
        })
        .catch(async () => {
          // Mode offline: cari kecocokan cache atau kembalikan index.html
          const cachedResponse = await caches.match(request)
          if (cachedResponse) return cachedResponse
          const fallback = await caches.match('/index.html')
          if (fallback) return fallback
          return caches.match('/')
        })
    )
    return
  }

  // B. Aset Statis Aplikasi (JS, CSS, Gambar, Ikon, Google Fonts) -> Stale-While-Revalidate
  const isStaticAsset =
    url.origin === self.location.origin ||
    url.hostname.includes('fonts.googleapis.com') ||
    url.hostname.includes('fonts.gstatic.com')

  if (isStaticAsset) {
    event.respondWith(
      caches.match(request).then(cachedResponse => {
        const fetchPromise = fetch(request)
          .then(networkResponse => {
            if (
              networkResponse &&
              (networkResponse.ok || networkResponse.type === 'opaque')
            ) {
              const clone = networkResponse.clone()
              caches.open(CACHE_NAME).then(cache => cache.put(request, clone))
            }
            return networkResponse
          })
          .catch(() => {
            // Mode offline: abaikan error background fetch
          })

        // Jika sudah ada di cache ponsel, sajikan seketika (0ms load).
        // Jika belum ada di cache (pertama kali), tunggu respon jaringan.
        return cachedResponse || fetchPromise
      })
    )
    return
  }

  // C. Permintaan Jaringan Dinamis Eksternal (Nominatim API, Google Drive, dll.)
  event.respondWith(
    fetch(request).catch(() => caches.match(request))
  )
})
