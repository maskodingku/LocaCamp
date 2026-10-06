import { useState, useCallback } from 'react'
import type {
  GoogleDriveConfig,
  GoogleDriveSession,
  GoogleDriveUploadResult,
} from '../types/drive'
import {
  requestGoogleAccessToken,
  fetchGoogleUserProfile,
  getOrCreateFolder,
  uploadPhotoToGoogleDrive,
} from '../services/googleDriveService'

const STORAGE_KEY_CONFIG = 'locacamp_gdrive_config'
const STORAGE_KEY_SESSION = 'locacamp_gdrive_session'

export const ENV_CLIENT_ID = ((import.meta.env.VITE_GOOGLE_CLIENT_ID as string) || '').trim()
export const DEFAULT_APP_CLIENT_ID =
  ENV_CLIENT_ID || '468845772138-jcavfnvf03tp5o4ev6ft4d01kj475h3c.apps.googleusercontent.com'

const DEFAULT_CONFIG: GoogleDriveConfig = {
  clientId: DEFAULT_APP_CLIENT_ID,
  folderName: 'LocaCamp Photos',
  autoUpload: false,
}

const DEFAULT_SESSION: GoogleDriveSession = {
  accessToken: null,
  expiresAt: null,
}

export function useGoogleDrive() {
  const [config, setConfig] = useState<GoogleDriveConfig>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_CONFIG)
      if (saved) {
        const parsed = JSON.parse(saved)
        const isLegacyOrDummy =
          !parsed.clientId ||
          parsed.clientId.includes('locacamp-survey') ||
          parsed.clientId.includes('202264815644') ||
          parsed.clientId.includes('locacamp.apps')
        return {
          ...DEFAULT_CONFIG,
          ...parsed,
          clientId: isLegacyOrDummy ? DEFAULT_APP_CLIENT_ID : parsed.clientId,
        }
      }
      return DEFAULT_CONFIG
    } catch {
      return DEFAULT_CONFIG
    }
  })

  const [session, setSession] = useState<GoogleDriveSession>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_SESSION)
      return saved ? { ...DEFAULT_SESSION, ...JSON.parse(saved) } : DEFAULT_SESSION
    } catch {
      return DEFAULT_SESSION
    }
  })

  const [isConnecting, setIsConnecting] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [lastUploadResult, setLastUploadResult] = useState<GoogleDriveUploadResult | null>(null)

  // Status koneksi valid (token belum kedaluwarsa)
  const isConnected = Boolean(
    session.accessToken &&
      session.expiresAt &&
      session.expiresAt > Date.now() + 60 * 1000
  )

  const updateConfig = useCallback((newPartial: Partial<GoogleDriveConfig>) => {
    setConfig(prev => {
      const updated = { ...prev, ...newPartial }
      try {
        localStorage.setItem(STORAGE_KEY_CONFIG, JSON.stringify(updated))
      } catch {
        // Abaikan jika storage penuh
      }
      return updated
    })
  }, [])

  const disconnect = useCallback(() => {
    setSession(DEFAULT_SESSION)
    try {
      localStorage.removeItem(STORAGE_KEY_SESSION)
    } catch {
      // Abaikan
    }
    setError(null)
  }, [])

  const connect = useCallback(async (customClientId?: string) => {
    const targetClientId = (
      customClientId ||
      config.clientId ||
      DEFAULT_APP_CLIENT_ID
    ).trim()

    setIsConnecting(true)
    setError(null)

    try {
      const { accessToken, expiresIn } = await requestGoogleAccessToken(targetClientId)
      const profile = await fetchGoogleUserProfile(accessToken)

      const newSession: GoogleDriveSession = {
        accessToken,
        expiresAt: Date.now() + expiresIn * 1000,
        userEmail: profile.email,
        userName: profile.name,
        userAvatar: profile.picture,
      }

      setSession(newSession)
      try {
        localStorage.setItem(STORAGE_KEY_SESSION, JSON.stringify(newSession))
      } catch {
        // Abaikan
      }

      if (customClientId && customClientId !== config.clientId) {
        updateConfig({ clientId: targetClientId })
      }
    } catch (err: unknown) {
      const msg =
        err instanceof Error
          ? err.message
          : 'Izin akses Google Drive dibatalkan atau belum disetujui'
      setError(msg)
    } finally {
      setIsConnecting(false)
    }
  }, [config.clientId, updateConfig])

  const cancelConnect = useCallback(() => {
    setIsConnecting(false)
  }, [])

  const uploadPhoto = useCallback(
    async (
      photoDataUrl: string,
      customFilename?: string
    ): Promise<GoogleDriveUploadResult> => {
      if (!session.accessToken) {
        throw new Error('Akun Google Drive belum terhubung. Silakan hubungkan di Pengaturan.')
      }

      if (session.expiresAt && session.expiresAt <= Date.now() + 30 * 1000) {
        throw new Error('Sesi Google Drive telah kedaluwarsa. Silakan hubungkan kembali akun Anda.')
      }

      setIsUploading(true)
      setError(null)

      try {
        const folderName = config.folderName.trim() || 'LocaCamp Photos'
        const folderId = await getOrCreateFolder(session.accessToken, folderName)

        const filename =
          customFilename ||
          `LocaCamp_${new Date().toISOString().replace(/[-:T]/g, '').slice(0, 14)}.jpg`

        const result = await uploadPhotoToGoogleDrive(
          session.accessToken,
          folderId,
          photoDataUrl,
          filename
        )

        setLastUploadResult(result)
        return result
      } catch (err: unknown) {
        let msg = err instanceof Error ? err.message : 'Gagal mengunggah foto ke Google Drive'
        if (msg.includes('insufficient authentication scopes') || msg.includes('insufficient')) {
          msg = 'Izin Google Drive belum lengkap. Silakan klik "Putuskan" lalu klik "Kaitkan" ulang untuk menyetujui izin akses file foto.'
        }
        setError(msg)
        throw err
      } finally {
        setIsUploading(false)
      }
    },
    [session, config.folderName]
  )

  const effectiveClientId = (config.clientId || ENV_CLIENT_ID || '').trim()
  const hasClientId = Boolean(effectiveClientId)

  return {
    config,
    session,
    isConnected,
    isConnecting,
    isUploading,
    error,
    lastUploadResult,
    hasClientId,
    effectiveClientId,
    connect,
    cancelConnect,
    disconnect,
    updateConfig,
    uploadPhoto,
    clearError: () => setError(null),
  }
}
