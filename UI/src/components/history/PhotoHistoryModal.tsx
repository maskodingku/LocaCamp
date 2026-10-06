import React, { useState, useEffect } from 'react'
import {
  X,
  Trash2,
  HardDrive,
} from 'lucide-react'
import {
  type StoredPhoto,
  getAllPhotosFromStorage,
  deletePhotoFromStorage,
  clearAllPhotosFromStorage,
} from '../../utils/photoStorage'
import { useModalHistory } from '../../hooks/useModalHistory'
import type { useGoogleDrive } from '../../hooks/useGoogleDrive'
import { HistoryPhotoDetailModal } from './HistoryPhotoDetailModal'
import { ConfirmDeleteModal, ConfirmClearAllModal } from './HistoryConfirmModals'
import { HistoryLocalTab } from './local/HistoryLocalTab'
import { HistoryDriveTab } from './drive/HistoryDriveTab'
import { GoogleDriveIcon } from '../settings/gdrive/GoogleDriveIcon'

interface PhotoHistoryModalProps {
  isOpen: boolean
  onClose: () => void
  onPhotosUpdated?: () => void
  onUploadToDrive?: (photo: StoredPhoto) => Promise<{ fileId: string; webViewLink?: string }>
  isDriveConnected?: boolean
  onOpenSettings?: () => void
  drive: ReturnType<typeof useGoogleDrive>
}

type TabType = 'local' | 'drive'

export const PhotoHistoryModal: React.FC<PhotoHistoryModalProps> = ({
  isOpen,
  onClose,
  onPhotosUpdated,
  onUploadToDrive,
  isDriveConnected = false,
  onOpenSettings,
  drive,
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('local')
  const [photos, setPhotos] = useState<StoredPhoto[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // State untuk pratinjau foto terpilih (fullscreen inspect)
  const [selectedPhoto, setSelectedPhoto] = useState<StoredPhoto | null>(null)

  // State konfirmasi hapus lokal
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null)
  const [isClearingAll, setIsClearingAll] = useState(false)
  const [downloadSuccessId, setDownloadSuccessId] = useState<string | null>(null)

  // Integrasi tombol Back fisik/gesture ponsel agar menutup overlay bertingkat
  useModalHistory(
    'history-clear-all',
    isOpen && isClearingAll,
    () => setIsClearingAll(false)
  )
  useModalHistory(
    'history-delete-confirm',
    isOpen && Boolean(deleteConfirmId),
    () => setDeleteConfirmId(null)
  )

  // Muat foto dari IndexedDB saat modal dibuka
  const loadPhotos = async () => {
    setIsLoading(true)
    const data = await getAllPhotosFromStorage()
    setPhotos(data)
    setIsLoading(false)
  }

  useEffect(() => {
    if (isOpen) {
      loadPhotos()
      setSelectedPhoto(null)
    }
  }, [isOpen])

  // Download Handler Foto Lokal
  const handleDownload = (photo: StoredPhoto) => {
    const timestampStr = new Date(photo.timestamp)
      .toISOString()
      .replace(/[-:T]/g, '')
      .slice(0, 14)
    const filename = `LocaCamp_${timestampStr}.jpg`

    const link = document.createElement('a')
    link.href = photo.dataUrl
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    setDownloadSuccessId(photo.id)
    setTimeout(() => setDownloadSuccessId(null), 2500)
  }

  // Delete Single Photo Lokal
  const handleDeletePhoto = async (id: string) => {
    await deletePhotoFromStorage(id)
    setPhotos((prev) => prev.filter((p) => p.id !== id))
    setDeleteConfirmId(null)
    if (selectedPhoto?.id === id) {
      setSelectedPhoto(null)
    }
    onPhotosUpdated?.()
  }

  // Clear All Photos Lokal
  const handleClearAll = async () => {
    await clearAllPhotosFromStorage()
    setPhotos([])
    setIsClearingAll(false)
    setSelectedPhoto(null)
    onPhotosUpdated?.()
  }

  // Navigasi Foto di Pratinjau Fullscreen
  const selectedIndex = selectedPhoto
    ? photos.findIndex((p) => p.id === selectedPhoto.id)
    : -1
  const hasPrev = selectedIndex > 0
  const hasNext = selectedIndex !== -1 && selectedIndex < photos.length - 1

  const handlePrevPhoto = () => {
    if (selectedIndex > 0) {
      setSelectedPhoto(photos[selectedIndex - 1])
    }
  }

  const handleNextPhoto = () => {
    if (selectedIndex !== -1 && selectedIndex < photos.length - 1) {
      setSelectedPhoto(photos[selectedIndex + 1])
    }
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto overscroll-contain flex items-center justify-center p-2 sm:p-4 md:p-6 bg-black/85 backdrop-blur-xl animate-in fade-in select-none">
      {/* Modal Container */}
      <div
        className="w-full max-w-4xl h-[94dvh] sm:h-[88vh] bg-zinc-950 border border-zinc-800 rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col text-white my-auto animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ================= MODAL HEADER ================= */}
        <div className="shrink-0 p-3 sm:px-6 sm:py-3.5 border-b border-zinc-800 bg-zinc-950/90 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* Sisi Kiri: Tab Switcher (Lokal VS Google Drive) */}
          <div className="flex items-center gap-1.5 p-1 bg-zinc-900 border border-zinc-800 rounded-2xl self-start">
            <button
              type="button"
              onClick={() => setActiveTab('local')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
                activeTab === 'local'
                  ? 'bg-zinc-800 text-white shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <HardDrive className="w-3.5 h-3.5 text-emerald-400" />
              <span>Memori Browser</span>
              <span className="text-[10px] px-1.5 py-0.2 bg-zinc-950/80 rounded-full font-mono text-zinc-300">
                {photos.length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('drive')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
                activeTab === 'drive'
                  ? 'bg-zinc-800 text-white shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <GoogleDriveIcon className="w-3.5 h-3.5" />
              <span>Google Drive</span>
              {isDriveConnected && (
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-sm shadow-emerald-400" />
              )}
            </button>
          </div>

          {/* Sisi Kanan: Aksi Bersihkan Semua (Tab Lokal) & Tombol Tutup */}
          <div className="flex items-center justify-end gap-1.5 sm:gap-2">
            {activeTab === 'local' && photos.length > 0 && (
              <button
                type="button"
                onClick={() => setIsClearingAll(true)}
                className="px-2.5 py-1.5 rounded-xl border border-rose-500/30 bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 text-xs font-semibold flex items-center gap-1.5 transition-all active:scale-95 cursor-pointer"
                title="Hapus Semua Riwayat Foto Lokal"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Bersihkan</span>
              </button>
            )}

            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-full hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors cursor-pointer"
              title="Tutup Riwayat"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* ================= TAB CONTENT ================= */}
        {activeTab === 'local' ? (
          <HistoryLocalTab
            photos={photos}
            isLoading={isLoading}
            onDownload={handleDownload}
            onDeleteRequest={(id) => setDeleteConfirmId(id)}
            onSelectPhoto={(p) => setSelectedPhoto(p)}
            downloadSuccessId={downloadSuccessId}
          />
        ) : (
          <HistoryDriveTab drive={drive} />
        )}
      </div>

      {/* ================= MODAL OVERLAYS (DETAIL & CONFIRM) ================= */}
      {selectedPhoto && (
        <HistoryPhotoDetailModal
          photo={selectedPhoto}
          currentIndex={selectedIndex}
          totalCount={photos.length}
          hasPrev={hasPrev}
          hasNext={hasNext}
          onPrev={handlePrevPhoto}
          onNext={handleNextPhoto}
          onClose={() => setSelectedPhoto(null)}
          onDownload={handleDownload}
          onDelete={(id: string) => setDeleteConfirmId(id)}
          onUploadToDrive={onUploadToDrive}
          isDriveConnected={isDriveConnected}
          onOpenSettings={onOpenSettings}
        />
      )}

      <ConfirmDeleteModal
        isOpen={Boolean(deleteConfirmId)}
        onClose={() => setDeleteConfirmId(null)}
        onConfirm={() => {
          if (deleteConfirmId) handleDeletePhoto(deleteConfirmId)
        }}
      />

      <ConfirmClearAllModal
        isOpen={isClearingAll}
        totalPhotos={photos.length}
        onClose={() => setIsClearingAll(false)}
        onConfirm={handleClearAll}
      />
    </div>
  )
}
