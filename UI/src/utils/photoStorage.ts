import type { CapturedPhoto } from '../types/camera'

export interface StoredPhoto {
  id: string
  dataUrl: string
  timestamp: string // Format ISO 8601 string
  address: string
  latitude: number | null
  longitude: number | null
  accuracy: number | null
  width: number
  height: number
  uploadedToDrive?: boolean
  driveFileId?: string
}

const DB_NAME = 'LocaCampDB'
const DB_VERSION = 1
const STORE_NAME = 'photos'

/**
 * Membuka koneksi ke IndexedDB browser
 */
function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      reject(new Error('IndexedDB tidak didukung pada browser ini.'))
      return
    }

    const request = window.indexedDB.open(DB_NAME, DB_VERSION)

    request.onupgradeneeded = event => {
      const db = (event.target as IDBOpenDBRequest).result
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const store = db.createObjectStore(STORE_NAME, { keyPath: 'id' })
        store.createIndex('timestamp', 'timestamp', { unique: false })
      }
    }

    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error)
  })
}

/**
 * Menyimpan foto hasil jepretan ke IndexedDB lokal browser
 */
export async function savePhotoToStorage(photo: CapturedPhoto): Promise<void> {
  try {
    const db = await openDB()
    const storedItem: StoredPhoto = {
      id: photo.id,
      dataUrl: photo.dataUrl,
      timestamp: photo.timestamp.toISOString(),
      address: photo.location.address || '',
      latitude: photo.location.latitude,
      longitude: photo.location.longitude,
      accuracy: photo.location.accuracy,
      width: photo.width,
      height: photo.height,
      uploadedToDrive: photo.uploadedToDrive,
      driveFileId: photo.driveFileId,
    }

    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite')
      const store = tx.objectStore(STORE_NAME)
      const req = store.put(storedItem)

      req.onsuccess = () => resolve()
      req.onerror = () => reject(req.error)
    })
  } catch (err) {
    console.error('Gagal menyimpan foto ke IndexedDB:', err)
  }
}

/**
 * Menandai status foto lokal sebagai telah berhasil diunggah ke Google Drive
 */
export async function markPhotoAsUploadedToDrive(
  id: string,
  driveFileId?: string
): Promise<void> {
  try {
    const db = await openDB()
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite')
      const store = tx.objectStore(STORE_NAME)
      const getReq = store.get(id)

      getReq.onsuccess = () => {
        const item = getReq.result as StoredPhoto | undefined
        if (item) {
          item.uploadedToDrive = true
          if (driveFileId) item.driveFileId = driveFileId
          const putReq = store.put(item)
          putReq.onsuccess = () => resolve()
          putReq.onerror = () => reject(putReq.error)
        } else {
          resolve()
        }
      }
      getReq.onerror = () => reject(getReq.error)
    })
  } catch (err) {
    console.error('Gagal menandai status Google Drive di IndexedDB:', err)
  }
}

/**
 * Mengambil semua foto dari IndexedDB (diurutkan dari yang terbaru)
 */
export async function getAllPhotosFromStorage(): Promise<StoredPhoto[]> {
  try {
    const db = await openDB()
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readonly')
      const store = tx.objectStore(STORE_NAME)
      const req = store.getAll()

      req.onsuccess = () => {
        const photos = (req.result as StoredPhoto[]) || []
        // Urutkan default: terbaru ke terlama
        photos.sort(
          (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        )
        resolve(photos)
      }
      req.onerror = () => reject(req.error)
    })
  } catch (err) {
    console.error('Gagal membaca foto dari IndexedDB:', err)
    return []
  }
}

/**
 * Menghitung total jumlah foto di IndexedDB
 */
export async function getPhotosCountFromStorage(): Promise<number> {
  try {
    const db = await openDB()
    return new Promise(resolve => {
      const tx = db.transaction(STORE_NAME, 'readonly')
      const store = tx.objectStore(STORE_NAME)
      const req = store.count()

      req.onsuccess = () => resolve(req.result || 0)
      req.onerror = () => resolve(0)
    })
  } catch {
    return 0
  }
}

/**
 * Menghapus satu foto berdasarkan id
 */
export async function deletePhotoFromStorage(id: string): Promise<void> {
  try {
    const db = await openDB()
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite')
      const store = tx.objectStore(STORE_NAME)
      const req = store.delete(id)

      req.onsuccess = () => resolve()
      req.onerror = () => reject(req.error)
    })
  } catch (err) {
    console.error('Gagal menghapus foto dari IndexedDB:', err)
  }
}

/**
 * Menghapus seluruh foto di IndexedDB
 */
export async function clearAllPhotosFromStorage(): Promise<void> {
  try {
    const db = await openDB()
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite')
      const store = tx.objectStore(STORE_NAME)
      const req = store.clear()

      req.onsuccess = () => resolve()
      req.onerror = () => reject(req.error)
    })
  } catch (err) {
    console.error('Gagal membersihkan seluruh foto dari IndexedDB:', err)
  }
}
