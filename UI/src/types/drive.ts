export interface GoogleDriveConfig {
  clientId: string
  folderName: string
  folderId?: string
  autoUpload: boolean
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
