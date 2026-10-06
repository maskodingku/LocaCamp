import React, { useState, useEffect, useMemo, useCallback } from 'react'
import {
  Search,
  RefreshCw,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  X,
  HardDrive,
  AlertCircle,
  FolderSync,
} from 'lucide-react'
import type { useGoogleDrive } from '../../../hooks/useGoogleDrive'
import type { GoogleDriveFile } from '../../../types/drive'
import {
  listGoogleDriveFiles,
  deleteGoogleDriveFile,
  downloadGoogleDriveFile,
} from '../../../services/googleDriveService'
import { DrivePhotoCard } from './DrivePhotoCard'
import { DriveDeleteConfirmModal } from './DriveDeleteConfirmModal'
import { GoogleDriveIcon } from '../../settings/gdrive/GoogleDriveIcon'

interface HistoryDriveTabProps {
  drive: ReturnType<typeof useGoogleDrive>
}

type DriveSort = 'newest' | 'oldest' | 'name-asc' | 'size-desc'

const ITEMS_PER_PAGE = 6

export const HistoryDriveTab: React.FC<HistoryDriveTabProps> = ({ drive }) => {
  const { isConnected, isConnecting, session, config, connect } = drive

  const [files, setFiles] = useState<GoogleDriveFile[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [sortOrder, setSortOrder] = useState<DriveSort>('newest')
  const [currentPage, setCurrentPage] = useState(1)

  // State Hapus File
  const [deletingFile, setDeletingFile] = useState<GoogleDriveFile | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  // Fungsi Fetch File dari Drive
  const fetchFiles = useCallback(async () => {
    if (!session.accessToken) return
    setIsLoading(true)
    setError(null)
    try {
      const folderName = config.folderName || 'LocaCamp Photos'
      const res = await listGoogleDriveFiles(session.accessToken, folderName)
      setFiles(res)
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Gagal memuat file dari Google Drive'
      setError(msg)
    } finally {
      setIsLoading(false)
    }
  }, [session.accessToken, config.folderName])

  useEffect(() => {
    if (isConnected && session.accessToken) {
      fetchFiles()
    }
  }, [isConnected, session.accessToken, fetchFiles])

  // Handler Hapus File
  const handleConfirmDelete = async () => {
    if (!deletingFile || !session.accessToken) return
    setIsDeleting(true)
    try {
      await deleteGoogleDriveFile(session.accessToken, deletingFile.id)
      setFiles((prev) => prev.filter((f) => f.id !== deletingFile.id))
      setDeletingFile(null)
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Gagal menghapus file dari Google Drive'
      alert(msg)
    } finally {
      setIsDeleting(false)
    }
  }

  // Handler Unduh File
  const handleDownload = async (file: GoogleDriveFile) => {
    if (!session.accessToken) return
    await downloadGoogleDriveFile(session.accessToken, file.id, file.name)
  }

  // Filter & Search
  const filteredFiles = useMemo(() => {
    let result = [...files]

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim()
      result = result.filter((f) => f.name.toLowerCase().includes(q))
    }

    result.sort((a, b) => {
      if (sortOrder === 'newest') {
        const timeA = new Date(a.createdTime || a.modifiedTime || 0).getTime()
        const timeB = new Date(b.createdTime || b.modifiedTime || 0).getTime()
        return timeB - timeA
      }
      if (sortOrder === 'oldest') {
        const timeA = new Date(a.createdTime || a.modifiedTime || 0).getTime()
        const timeB = new Date(b.createdTime || b.modifiedTime || 0).getTime()
        return timeA - timeB
      }
      if (sortOrder === 'name-asc') {
        return a.name.localeCompare(b.name)
      }
      if (sortOrder === 'size-desc') {
        const sizeA = Number(a.size || 0)
        const sizeB = Number(b.size || 0)
        return sizeB - sizeA
      }
      return 0
    })

    return result
  }, [files, searchQuery, sortOrder])

  // Pagination
  const totalPages = Math.max(1, Math.ceil(filteredFiles.length / ITEMS_PER_PAGE))
  const paginatedFiles = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE
    return filteredFiles.slice(start, start + ITEMS_PER_PAGE)
  }, [filteredFiles, currentPage])

  // Reset page saat filter berubah
  useEffect(() => {
    setCurrentPage(1)
  }, [searchQuery, sortOrder])

  // JIKA GOOGLE DRIVE BELUM TERHUBUNG:
  if (!isConnected) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-4">
        <div className="p-4 rounded-3xl bg-zinc-900 border border-zinc-800 shadow-xl">
          <GoogleDriveIcon className="w-12 h-12" />
        </div>
        <div className="space-y-1.5 max-w-sm">
          <h3 className="text-base font-bold text-white">Google Drive Belum Terhubung</h3>
          <p className="text-xs text-zinc-400 leading-relaxed">
            Kaitkan akun Google Drive Anda untuk melihat, mengunduh, dan mengelola hasil foto survei langsung dari cloud.
          </p>
        </div>
        <button
          type="button"
          onClick={() => connect()}
          disabled={isConnecting}
          className="py-3 px-5 rounded-2xl bg-white hover:bg-zinc-100 text-zinc-950 font-bold text-xs flex items-center gap-2.5 shadow-lg active:scale-95 transition-all cursor-pointer"
        >
          <GoogleDriveIcon className="w-4 h-4" />
          <span>{isConnecting ? 'Membuka Google...' : 'Kaitkan Akun Google Drive'}</span>
        </button>
      </div>
    )
  }

  return (
    <div className="flex-1 flex flex-col min-h-0">
      {/* 1. Toolbar Kontrol: Search, Sort, Refresh */}
      <div className="shrink-0 p-3 sm:px-6 sm:py-3.5 bg-zinc-950/80 border-b border-zinc-800/80 flex flex-col gap-2.5">
        {/* Baris Atas: Search Bar & Tombol Refresh */}
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 sm:w-4 sm:h-4 text-zinc-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari file foto di Google Drive..."
              className="w-full pl-8 sm:pl-9 pr-8 py-2 rounded-xl bg-zinc-900/90 border border-zinc-800 text-xs sm:text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500/80 focus:ring-1 focus:ring-emerald-500/20 transition-all"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white p-0.5 rounded-full hover:bg-zinc-800 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Tombol Refresh */}
          <button
            type="button"
            onClick={fetchFiles}
            disabled={isLoading}
            className="flex items-center justify-center p-2 rounded-xl bg-zinc-900/90 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-800 transition-all active:scale-95 cursor-pointer shrink-0"
            title="Muat ulang daftar file Google Drive"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-emerald-400' : ''}`} />
          </button>
        </div>

        {/* Baris Bawah: Sort Selector & Counter File */}
        <div className="flex items-center justify-between gap-2">
          {/* Custom Sleek Sort Selector */}
          <div className="relative flex items-center">
            <SlidersHorizontal className="w-3.5 h-3.5 text-zinc-400 absolute left-2.5 pointer-events-none" />
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value as DriveSort)}
              className="pl-8 pr-7 py-1 rounded-xl bg-zinc-900/90 border border-zinc-800 text-zinc-200 text-[11px] sm:text-xs font-medium focus:outline-none focus:border-emerald-500 transition-all cursor-pointer appearance-none"
            >
              <option value="newest">Terbaru</option>
              <option value="oldest">Terlama</option>
              <option value="name-asc">Nama A-Z</option>
              <option value="size-desc">Ukuran Terbesar</option>
            </select>
            <ChevronDown className="w-3 h-3 text-zinc-400 absolute right-2 pointer-events-none" />
          </div>

          {/* Counter File */}
          <div className="text-[11px] text-zinc-400 font-mono shrink-0 pl-1">
            <span className="px-2 py-0.5 rounded-lg bg-zinc-900/80 border border-zinc-800/80 text-zinc-300">
              {filteredFiles.length} file
            </span>
          </div>
        </div>
      </div>

      {/* 2. Error Display */}
      {error && (
        <div className="m-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* 3. Grid Daftar File */}
      <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
        {isLoading && files.length === 0 ? (
          <div className="h-64 flex flex-col items-center justify-center gap-3 text-zinc-500">
            <FolderSync className="w-8 h-8 animate-spin text-emerald-500" />
            <span className="text-xs">Memuat file dari Google Drive...</span>
          </div>
        ) : filteredFiles.length === 0 ? (
          <div className="h-64 flex flex-col items-center justify-center gap-2 text-zinc-500">
            <HardDrive className="w-10 h-10 stroke-1" />
            <p className="text-xs font-semibold text-zinc-400">
              {searchQuery ? 'Tidak ada file yang cocok dengan pencarian' : 'Belum ada foto di Google Drive'}
            </p>
            <p className="text-[11px] text-zinc-600">
              Foto yang Anda jepret akan muncul di sini saat sinkronisasi Google Drive aktif.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5">
            {paginatedFiles.map((file) => (
              <DrivePhotoCard
                key={file.id}
                file={file}
                onDownload={handleDownload}
                onDeleteRequest={(f) => setDeletingFile(f)}
              />
            ))}
          </div>
        )}
      </div>

      {/* 4. Pagination Footer */}
      {filteredFiles.length > ITEMS_PER_PAGE && (
        <div className="p-3 border-t border-zinc-800/80 bg-zinc-950 flex items-center justify-between text-xs text-zinc-400">
          <span>
            Menampilkan {Math.min(filteredFiles.length, (currentPage - 1) * ITEMS_PER_PAGE + 1)} -{' '}
            {Math.min(filteredFiles.length, currentPage * ITEMS_PER_PAGE)} dari {filteredFiles.length} file
          </span>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-1.5 rounded-lg border border-zinc-800 bg-zinc-900 hover:bg-zinc-800 disabled:opacity-40 disabled:pointer-events-none transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="px-2 font-bold text-white">
              {currentPage} / {totalPages}
            </span>
            <button
              type="button"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-1.5 rounded-lg border border-zinc-800 bg-zinc-900 hover:bg-zinc-800 disabled:opacity-40 disabled:pointer-events-none transition-colors cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* 5. Modal Konfirmasi Hapus */}
      <DriveDeleteConfirmModal
        isOpen={Boolean(deletingFile)}
        file={deletingFile}
        isDeleting={isDeleting}
        onClose={() => setDeletingFile(null)}
        onConfirm={handleConfirmDelete}
      />
    </div>
  )
}
