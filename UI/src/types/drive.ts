export interface GoogleDriveConfig {
  clientId: string
  folderName: string
  folderId?: string
  autoUpload: boolean
  concurrency?: number // 1 s/d 4 (default: 2)
}

export interface DriveQueueItem {
  id: string // ID foto
  dataUrl: string
  filename: string
  status: 'pending' | 'uploading' | 'completed' | 'error'
  progress: number // 0 - 100
  error?: string
}

export interface DriveQueueState {
  isQueueRunning: boolean
  totalItems: number
  completedCount: number
  failedCount: number
  items: DriveQueueItem[]
}

export interface GoogleDriveSession {
  accessToken: string | null
  expiresAt: number | null
  userEmail?: string
  userName?: string
  userAvatar?: string
}

export interface GoogleDriveUploadResult {
  fileId: string
  webViewLink?: string
}

export interface GoogleDriveFile {
  id: string
  name: string
  size?: number | string
  mimeType: string
  createdTime?: string
  modifiedTime?: string
  thumbnailLink?: string
  webContentLink?: string
  webViewLink?: string
}
