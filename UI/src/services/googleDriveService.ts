import type { GoogleDriveUploadResult, GoogleDriveFile } from '../types/drive'

declare global {
  interface Window {
    google?: {
      accounts: {
        oauth2: {
          initTokenClient: (config: {
            client_id: string
            scope: string
            callback: (response: {
              access_token: string
              expires_in: number
              error?: string
              error_description?: string
            }) => void
            error_callback?: (error: {
              type: string
              message?: string
            }) => void
          }) => {
            requestAccessToken: (options?: { prompt?: string }) => void
          }
        }
      }
    }
  }
}

/**
 * Memuat Google Identity Services script secara dinamis
 */
export async function loadGsiScript(): Promise<void> {
  if (typeof window === 'undefined') return
  if (window.google?.accounts?.oauth2) return

  return new Promise((resolve, reject) => {
    const existingScript = document.getElementById('gsi-client-script')
    if (existingScript) {
      existingScript.addEventListener('load', () => resolve())
      existingScript.addEventListener('error', () => reject(new Error('Gagal memuat Google Identity Services')))
      return
    }

    const script = document.createElement('script')
    script.id = 'gsi-client-script'
    script.src = 'https://accounts.google.com/gsi/client'
    script.async = true
    script.defer = true
    script.onload = () => resolve()
    script.onerror = () => reject(new Error('Gagal memuat Google Identity Services'))
    document.head.appendChild(script)
  })
}

/**
 * Meminta akses token OAuth2 Google via popup resmi GIS
 * Dilengkapi error_callback, deteksi penutupan jendela (focus), dan timeout otomatis
 */
export async function requestGoogleAccessToken(clientId: string): Promise<{
  accessToken: string
  expiresIn: number
}> {
  await loadGsiScript()

  if (!window.google?.accounts?.oauth2) {
    throw new Error('Google Identity Services SDK tidak tersedia.')
  }

  return new Promise((resolve, reject) => {
    let isSettled = false
    let focusTimer: ReturnType<typeof setTimeout> | null = null
    let maxTimeoutTimer: ReturnType<typeof setTimeout> | null = null

    const cleanup = () => {
      if (focusTimer) clearTimeout(focusTimer)
      if (maxTimeoutTimer) clearTimeout(maxTimeoutTimer)
      window.removeEventListener('focus', handleWindowFocus)
    }

    const handleWindowFocus = () => {
      // Jendela utama kembali aktif setelah popup Google ditutup/dialihkan
      // Beri jeda 1.2 detik untuk memberi kesempatan callback GIS dijalankan jika login sukses
      if (focusTimer) clearTimeout(focusTimer)
      focusTimer = setTimeout(() => {
        if (!isSettled) {
          isSettled = true
          cleanup()
          reject(new Error('Otentikasi Google dibatalkan atau jendela ditutup'))
        }
      }, 1200)
    }

    // Timeout maksimal 60 detik jika tidak ada aktivitas sama sekali
    maxTimeoutTimer = setTimeout(() => {
      if (!isSettled) {
        isSettled = true
        cleanup()
        reject(new Error('Waktu permintaan otentikasi Google habis'))
      }
    }, 60000)

    // Dengarkan saat user kembali ke jendela utama setelah menutup popup
    window.addEventListener('focus', handleWindowFocus)

    try {
      const client = window.google!.accounts.oauth2.initTokenClient({
        client_id: clientId,
        scope:
          'https://www.googleapis.com/auth/drive.file https://www.googleapis.com/auth/drive https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email',
        callback: (response) => {
          if (isSettled) return
          isSettled = true
          cleanup()

          if (response.error) {
            reject(new Error(response.error_description || response.error || 'Akses Google Drive dibatalkan'))
            return
          }
          resolve({
            accessToken: response.access_token,
            expiresIn: response.expires_in,
          })
        },
        error_callback: (nonOAuthError) => {
          if (isSettled) return
          isSettled = true
          cleanup()

          const errorType = nonOAuthError?.type
          if (errorType === 'popup_closed') {
            reject(new Error('Jendela login Google ditutup'))
          } else if (errorType === 'popup_failed_to_open') {
            reject(new Error('Popup diblokir browser. Izinkan popup untuk menghubungkan Google Drive.'))
          } else {
            reject(new Error(nonOAuthError?.message || 'Proses otentikasi Google dibatalkan'))
          }
        },
      })

      client.requestAccessToken({ prompt: 'consent' })
    } catch (err) {
      if (!isSettled) {
        isSettled = true
        cleanup()
        reject(err)
      }
    }
  })
}

/**
 * Mengambil profil dasar pengguna (Nama, Email, Avatar) dari access token
 */
export async function fetchGoogleUserProfile(accessToken: string): Promise<{
  email: string
  name: string
  picture: string
}> {
  const res = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })
  if (!res.ok) {
    throw new Error('Gagal mengambil informasi profil Google')
  }
  const data = await res.json()
  return {
    email: data.email || '',
    name: data.name || '',
    picture: data.picture || '',
  }
}

/**
 * Mencari atau membuat folder khusus proyek di Google Drive
 * Memiliki failover otomatis ke 'root' jika ada pembatasan scope/izin folder
 */
export async function getOrCreateFolder(
  accessToken: string,
  folderName: string
): Promise<string> {
  try {
    const safeName = folderName.replace(/'/g, "\\'")
    const query = encodeURIComponent(
      `name = '${safeName}' and mimeType = 'application/vnd.google-apps.folder' and trashed = false`
    )

    const searchRes = await fetch(
      `https://www.googleapis.com/drive/v3/files?q=${query}&fields=files(id,name)`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    )

    if (searchRes.ok) {
      const data = await searchRes.json()
      if (data.files && data.files.length > 0) {
        return data.files[0].id
      }
    }

    // Jika folder belum ada, coba buat baru
    const createRes = await fetch('https://www.googleapis.com/drive/v3/files', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: folderName,
        mimeType: 'application/vnd.google-apps.folder',
      }),
    })

    if (createRes.ok) {
      const newFolder = await createRes.json()
      return newFolder.id
    }
  } catch (err) {
    console.warn('Gagal mengakses atau membuat folder, failover ke root Drive:', err)
  }

  // Failover aman jika query/create folder dibatasi: simpan di root Drive
  return 'root'
}

/**
 * Helper untuk upload multipart via XMLHttpRequest dengan tracking progress (0-100%)
 */
function uploadMultipartXhr(
  url: string,
  accessToken: string,
  boundary: string,
  body: Blob,
  onProgress?: (percent: number) => void
): Promise<{ id: string; webViewLink?: string }> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest()
    xhr.open('POST', url)
    xhr.setRequestHeader('Authorization', `Bearer ${accessToken}`)
    xhr.setRequestHeader('Content-Type', `multipart/related; boundary=${boundary}`)

    if (xhr.upload && onProgress) {
      xhr.upload.onprogress = (e) => {
        if (e.lengthComputable && e.total > 0) {
          // Range 10% - 95% selama byte diunggah
          const pct = Math.min(95, Math.max(10, Math.round((e.loaded / e.total) * 85) + 10))
          onProgress(pct)
        }
      }
    }

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        onProgress?.(100)
        try {
          const res = JSON.parse(xhr.responseText)
          resolve(res)
        } catch {
          resolve({ id: 'unknown' })
        }
      } else {
        try {
          const errRes = JSON.parse(xhr.responseText)
          reject(new Error(errRes.error?.message || `Upload gagal dengan kode status HTTP ${xhr.status}`))
        } catch {
          reject(new Error(`Upload gagal dengan kode status HTTP ${xhr.status}`))
        }
      }
    }

    xhr.onerror = () => {
      reject(new Error('Koneksi internet terputus saat mengunggah foto ke Google Drive'))
    }

    onProgress?.(10)
    xhr.send(body)
  })
}

/**
 * Mengunggah foto hasil jepretan secara multipart ke Google Drive
 * Dilengkapi tracking persentase progres upload (0% - 100%)
 */
export async function uploadPhotoToGoogleDrive(
  accessToken: string,
  folderId: string,
  photoDataUrl: string,
  filename: string,
  onProgress?: (percent: number) => void
): Promise<GoogleDriveUploadResult> {
  onProgress?.(5)
  const photoRes = await fetch(photoDataUrl)
  const photoBlob = await photoRes.blob()

  const boundary = 'LocaCampMultiPart' + Date.now()

  const metadata: Record<string, unknown> = {
    name: filename,
    mimeType: 'image/jpeg',
  }

  if (folderId && folderId !== 'root') {
    metadata.parents = [folderId]
  }

  const delimiter = `\r\n--${boundary}\r\n`
  const closeDelimiter = `\r\n--${boundary}--`

  const metadataPart =
    delimiter +
    'Content-Type: application/json; charset=UTF-8\r\n\r\n' +
    JSON.stringify(metadata) +
    delimiter +
    'Content-Type: image/jpeg\r\n\r\n'

  const encoder = new TextEncoder()
  const metadataBuffer = encoder.encode(metadataPart)
  const closeBuffer = encoder.encode(closeDelimiter)

  const body = new Blob([metadataBuffer, photoBlob, closeBuffer])
  const uploadUrl = 'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id,webViewLink'

  try {
    const uploadData = await uploadMultipartXhr(uploadUrl, accessToken, boundary, body, onProgress)
    return {
      fileId: uploadData.id,
      webViewLink: uploadData.webViewLink,
    }
  } catch (err) {
    // Jika gagal dan menyertakan parents (misal folder permission issue), coba upload langsung ke root
    if (metadata.parents) {
      delete metadata.parents
      const rootMetadataPart =
        delimiter +
        'Content-Type: application/json; charset=UTF-8\r\n\r\n' +
        JSON.stringify(metadata) +
        delimiter +
        'Content-Type: image/jpeg\r\n\r\n'

      const rootBody = new Blob([encoder.encode(rootMetadataPart), photoBlob, closeBuffer])
      const rootData = await uploadMultipartXhr(uploadUrl, accessToken, boundary, rootBody, onProgress)
      return {
        fileId: rootData.id,
        webViewLink: rootData.webViewLink,
      }
    }
    throw err
  }
}

/**
 * Mengambil daftar file foto di Google Drive
 * Terisolasi ketat hanya di dalam folder khusus LocaCamp Photos
 */
export async function listGoogleDriveFiles(
  accessToken: string,
  folderName = 'LocaCamp Photos'
): Promise<GoogleDriveFile[]> {
  // 1. Selalu pastikan folder LocaCamp Photos ada (buat otomatis jika belum ada)
  const folderId = await getOrCreateFolder(accessToken, folderName)

  // 2. Query HANYA file yang berada di dalam folder tersebut demi menjaga privasi pengguna!
  let q: string
  if (folderId && folderId !== 'root') {
    q = `'${folderId}' in parents and trashed = false`
  } else {
    // Pengaman ketat: jika failover ke root karena pembatasan permission folder,
    // HANYA ambil file yang diawali nama 'LocaCamp_'. JANGAN PERNAH mengambil foto umum pengguna!
    q = `trashed = false and name contains 'LocaCamp_' and mimeType contains 'image/'`
  }

  const queryParam = encodeURIComponent(q)
  const fields = encodeURIComponent(
    'files(id,name,size,mimeType,createdTime,modifiedTime,thumbnailLink,webContentLink,webViewLink)'
  )

  const res = await fetch(
    `https://www.googleapis.com/drive/v3/files?q=${queryParam}&fields=${fields}&pageSize=100&orderBy=createdTime%20desc`,
    {
      headers: { Authorization: `Bearer ${accessToken}` },
    }
  )

  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.error?.message || 'Gagal mengambil daftar file Google Drive')
  }

  const data = await res.json()
  return data.files || []
}

/**
 * Menghapus file di Google Drive
 */
export async function deleteGoogleDriveFile(
  accessToken: string,
  fileId: string
): Promise<void> {
  const res = await fetch(`https://www.googleapis.com/drive/v3/files/${fileId}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${accessToken}` },
  })

  if (!res.ok && res.status !== 204) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.error?.message || 'Gagal menghapus file dari Google Drive')
  }
}

/**
 * Mengunduh file dari Google Drive ke memori dan trigger download di browser
 */
export async function downloadGoogleDriveFile(
  accessToken: string,
  fileId: string,
  filename: string
): Promise<void> {
  const res = await fetch(
    `https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`,
    {
      headers: { Authorization: `Bearer ${accessToken}` },
    }
  )

  if (!res.ok) {
    throw new Error('Gagal mengunduh file dari Google Drive')
  }

  const blob = await res.blob()
  const blobUrl = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = blobUrl
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(blobUrl)
}
