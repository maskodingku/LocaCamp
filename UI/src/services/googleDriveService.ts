import type { GoogleDriveUploadResult } from '../types/drive'

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
    try {
      const client = window.google!.accounts.oauth2.initTokenClient({
        client_id: clientId,
        scope:
          'https://www.googleapis.com/auth/drive.file https://www.googleapis.com/auth/drive https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email',
        callback: (response) => {
          if (response.error) {
            reject(new Error(response.error_description || response.error || 'Akses Google Drive dibatalkan'))
            return
          }
          resolve({
            accessToken: response.access_token,
            expiresIn: response.expires_in,
          })
        },
      })

      client.requestAccessToken({ prompt: 'consent' })
    } catch (err) {
      reject(err)
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
 * Mengunggah foto hasil jepretan secara multipart ke Google Drive
 */
export async function uploadPhotoToGoogleDrive(
  accessToken: string,
  folderId: string,
  photoDataUrl: string,
  filename: string
): Promise<GoogleDriveUploadResult> {
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

  let uploadRes = await fetch(
    'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id,webViewLink',
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': `multipart/related; boundary=${boundary}`,
      },
      body: body,
    }
  )

  // Jika gagal karena parents (misal folder permission issue), coba upload langsung ke root
  if (!uploadRes.ok && metadata.parents) {
    delete metadata.parents
    const rootMetadataPart =
      delimiter +
      'Content-Type: application/json; charset=UTF-8\r\n\r\n' +
      JSON.stringify(metadata) +
      delimiter +
      'Content-Type: image/jpeg\r\n\r\n'

    const rootBody = new Blob([encoder.encode(rootMetadataPart), photoBlob, closeBuffer])

    uploadRes = await fetch(
      'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id,webViewLink',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': `multipart/related; boundary=${boundary}`,
        },
        body: rootBody,
      }
    )
  }

  const uploadData = await uploadRes.json()

  if (!uploadRes.ok) {
    throw new Error(uploadData.error?.message || 'Gagal mengunggah foto ke Google Drive')
  }

  return {
    fileId: uploadData.id,
    webViewLink: uploadData.webViewLink,
  }
}
