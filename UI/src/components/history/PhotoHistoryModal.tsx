import React, { useState, useMemo, useEffect } from 'react'
import {
  X,
  Search,
  Trash2,
  ChevronLeft,
  ChevronRight,
  SlidersHorizontal,
  ArrowUpDown,
  FolderOpen,
} from 'lucide-react'
import {
  type StoredPhoto,
  getAllPhotosFromStorage,
  deletePhotoFromStorage,
  clearAllPhotosFromStorage,
} from '../../utils/photoStorage'
import { useModalHistory } from '../../hooks/useModalHistory'
import { HistoryPhotoCard } from './HistoryPhotoCard'
import { HistoryPhotoDetailModal } from './HistoryPhotoDetailModal'
import { ConfirmDeleteModal, ConfirmClearAllModal } from './HistoryConfirmModals'

interface PhotoHistoryModalProps {
  isOpen: boolean
  onClose: () => void
  onPhotosUpdated?: () => void
}

type TimeFilter = 'all' | 'today' | 'week' | 'month'
type SortOrder = 'newest' | 'oldest'

const ITEMS_PER_PAGE = 6

export const PhotoHistoryModal: React.FC<PhotoHistoryModalProps> = ({
  isOpen,
  onClose,
  onPhotosUpdated,
}) => {
  const [photos, setPhotos] = useState<StoredPhoto[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [timeFilter, setTimeFilter] = useState<TimeFilter>('all')
  const [sortOrder, setSortOrder] = useState<SortOrder>('newest')
  const [currentPage, setCurrentPage] = useState(1)

  // State untuk pratinjau foto terpilih (fullscreen inspect)
  const [selectedPhoto, setSelectedPhoto] = useState<StoredPhoto | null>(null)

  // State konfirmasi hapus
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null)
  const [isClearingAll, setIsClearingAll] = useState(false)
  const [downloadSuccessId, setDownloadSuccessId] = useState<string | null>(null)

  // Integrasi tombol Back fisik/gesture ponsel agar menutup overlay bertingkat di dalam Riwayat
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
      setCurrentPage(1)
      setSelectedPhoto(null)
    }
  }, [isOpen])

  // Download Handler
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

  // Delete Single Photo
  const handleDeletePhoto = async (id: string) => {
    await deletePhotoFromStorage(id)
    setPhotos(prev => prev.filter(p => p.id !== id))
    setDeleteConfirmId(null)
    if (selectedPhoto?.id === id) {
      setSelectedPhoto(null)
    }
    onPhotosUpdated?.()
  }

  // Clear All Photos
  const handleClearAll = async () => {
    await clearAllPhotosFromStorage()
    setPhotos([])
    setIsClearingAll(false)
    setSelectedPhoto(null)
    onPhotosUpdated?.()
  }

  // Filter & Search Logic
  const filteredPhotos = useMemo(() => {
    let result = [...photos]

    // 1. Search Query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim()
      result = result.filter(
        p =>
          p.address.toLowerCase().includes(q) ||
          p.timestamp.toLowerCase().includes(q) ||
          (p.latitude && p.latitude.toString().includes(q)) ||
          (p.longitude && p.longitude.toString().includes(q))
      )
    }

    // 2. Time Filter
    if (timeFilter !== 'all') {
      const now = new Date()
      const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime()
      const weekAgo = now.getTime() - 7 * 24 * 60 * 60 * 1000
      const monthAgo = now.getTime() - 30 * 24 * 60 * 60 * 1000

      result = result.filter(p => {
        const photoTime = new Date(p.timestamp).getTime()
        if (timeFilter === 'today') return photoTime >= todayStart
        if (timeFilter === 'week') return photoTime >= weekAgo
        if (timeFilter === 'month') return photoTime >= monthAgo
        return true
      })
    }

    // 3. Sort Order
    result.sort((a, b) => {
      const tA = new Date(a.timestamp).getTime()
      const tB = new Date(b.timestamp).getTime()
      return sortOrder === 'newest' ? tB - tA : tA - tB
    })

    return result
  }, [photos, searchQuery, timeFilter, sortOrder])

  // Pagination Logic
  const totalPages = Math.max(1, Math.ceil(filteredPhotos.length / ITEMS_PER_PAGE))
  const paginatedPhotos = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
    return filteredPhotos.slice(startIndex, startIndex + ITEMS_PER_PAGE)
  }, [filteredPhotos, currentPage])

  // Reset ke halaman 1 saat filter atau pencarian berubah
  useEffect(() => {
    setCurrentPage(1)
  }, [searchQuery, timeFilter, sortOrder])

  // Navigasi Foto di Pratinjau Fullscreen
  const currentIndex = useMemo(() => {
    if (!selectedPhoto) return -1
    return filteredPhotos.findIndex(p => p.id === selectedPhoto.id)
  }, [selectedPhoto, filteredPhotos])

  const hasPrev = currentIndex > 0
  const hasNext = currentIndex !== -1 && currentIndex < filteredPhotos.length - 1

  const handlePrevPhoto = () => {
    if (currentIndex > 0) {
      setSelectedPhoto(filteredPhotos[currentIndex - 1])
    }
  }

  const handleNextPhoto = () => {
    if (currentIndex !== -1 && currentIndex < filteredPhotos.length - 1) {
      setSelectedPhoto(filteredPhotos[currentIndex + 1])
    }
  }

  // Sinkronisasi halaman galeri saat pengguna berpindah foto di fullscreen
  useEffect(() => {
    if (currentIndex !== -1) {
      const targetPage = Math.floor(currentIndex / ITEMS_PER_PAGE) + 1
      if (targetPage !== currentPage) {
        setCurrentPage(targetPage)
      }
    }
  }, [currentIndex, currentPage])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto overscroll-contain flex items-center justify-center p-2 sm:p-4 md:p-6 bg-black/85 backdrop-blur-xl animate-in fade-in select-none">
      {/* Modal Container */}
      <div
        className="w-full max-w-4xl max-h-[96dvh] sm:max-h-[90vh] bg-zinc-950 border border-zinc-800 rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col text-white my-auto animate-in zoom-in-95 duration-200"
        onClick={e => e.stopPropagation()}
      >
        {/* ================= MODAL HEADER ================= */}
        <div className="shrink-0 p-3 sm:px-6 sm:py-4 border-b border-zinc-800 bg-zinc-950/90 flex items-center justify-between gap-2">
          {/* Sisi Kiri: Judul dan Badge Total */}
          <div className="flex items-center gap-2 min-w-0">
            <h3 className="text-sm sm:text-base font-bold text-white tracking-wide truncate">
              Riwayat Galeri Foto
            </h3>
            <span className="px-2 py-0.5 rounded-full text-[11px] font-mono font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shrink-0">
              {photos.length} Foto
            </span>
          </div>

          {/* Sisi Kanan: Aksi Bersihkan Semua & Tombol Tutup */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {photos.length > 0 && (
              <button
                type="button"
                onClick={() => setIsClearingAll(true)}
                className="px-2.5 py-1.5 rounded-lg sm:rounded-xl border border-rose-500/30 bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 text-[11px] sm:text-xs font-semibold flex items-center gap-1 sm:gap-1.5 transition-all active:scale-95"
                title="Hapus Semua Riwayat Foto"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span className="hidden xs:inline">Hapus Semua</span>
              </button>
            )}

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg sm:rounded-full hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors"
              title="Tutup Riwayat"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* ================= TOOLBAR: SEARCH, FILTER, SORT ================= */}
        <div className="shrink-0 p-2.5 sm:px-6 sm:py-3.5 bg-zinc-900/50 border-b border-zinc-800/80 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 sm:gap-2.5">
          {/* Search Box */}
          <div className="relative w-full sm:flex-1 sm:max-w-md">
            <Search className="w-3.5 h-3.5 sm:w-4 sm:h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
            <input
              type="text"
              placeholder="Cari lokasi, jalan, atau tanggal..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-8 sm:pl-9 pr-8 py-1.5 sm:py-2 rounded-xl bg-zinc-900 border border-zinc-700/80 text-xs sm:text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500 transition-colors"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white p-0.5"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Filter & Sort Controls */}
          <div className="flex items-center justify-between sm:justify-end gap-1.5 sm:gap-2 overflow-x-auto no-scrollbar py-0.5">
            {/* Filter Waktu Tabs */}
            <div className="flex items-center gap-0.5 sm:gap-1 bg-zinc-900 border border-zinc-800 rounded-xl p-0.5 text-[11px] sm:text-xs text-zinc-300 shrink-0">
              <SlidersHorizontal className="w-3.5 h-3.5 text-zinc-400 ml-1.5 mr-0.5 hidden sm:block" />
              {(
                [
                  { id: 'all', label: 'Semua' },
                  { id: 'today', label: 'Hari Ini' },
                  { id: 'week', label: '7 Hari' },
                  { id: 'month', label: 'Bulan Ini' },
                ] as const
              ).map(tab => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setTimeFilter(tab.id)}
                  className={`px-2 sm:px-2.5 py-1 rounded-lg transition-all ${
                    timeFilter === tab.id
                      ? 'bg-zinc-800 text-white font-semibold shadow'
                      : 'hover:text-white text-zinc-400'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Sort Toggle */}
            <button
              type="button"
              onClick={() => setSortOrder(prev => (prev === 'newest' ? 'oldest' : 'newest'))}
              className="flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-[11px] sm:text-xs font-medium text-zinc-300 hover:text-white hover:border-zinc-700 transition-all active:scale-95 shrink-0"
              title="Urutkan Foto"
            >
              <ArrowUpDown className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-emerald-400" />
              <span>{sortOrder === 'newest' ? 'Terbaru' : 'Terlama'}</span>
            </button>
          </div>
        </div>

        {/* ================= GALLERY CONTENT (GRID VIEW) ================= */}
        <div className="relative flex-1 min-h-0 w-full bg-zinc-950 overflow-y-auto p-3 sm:p-6">
          {isLoading ? (
            <div className="h-full flex flex-col items-center justify-center gap-2 text-zinc-400">
              <div className="w-8 h-8 border-2 border-zinc-700 border-t-emerald-400 rounded-full animate-spin" />
              <p className="text-xs">Memuat galeri foto...</p>
            </div>
          ) : filteredPhotos.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 gap-3">
              <div className="w-16 h-16 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-600 mb-1">
                <FolderOpen className="w-8 h-8" />
              </div>
              <h4 className="text-sm sm:text-base font-bold text-zinc-200">
                {photos.length === 0
                  ? 'Belum Ada Riwayat Foto'
                  : 'Tidak Ditemukan Foto yang Cocok'}
              </h4>
              <p className="text-xs text-zinc-500 max-w-sm leading-relaxed">
                {photos.length === 0
                  ? 'Ambil foto dokumentasi dengan tombol kamera, hasil jepretan Anda akan otomatis tersimpan rapi di sini.'
                  : `Tidak ada foto yang sesuai dengan kata kunci "${searchQuery}" atau filter waktu yang dipilih.`}
              </p>
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="px-3.5 py-1.5 rounded-xl border border-zinc-700 bg-zinc-900 text-xs font-semibold text-zinc-300 hover:text-white transition-all"
                >
                  Reset Pencarian
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-4">
              {paginatedPhotos.map(item => (
                <HistoryPhotoCard
                  key={item.id}
                  item={item}
                  isSuccess={downloadSuccessId === item.id}
                  onSelect={setSelectedPhoto}
                  onDownload={handleDownload}
                  onDelete={setDeleteConfirmId}
                />
              ))}
            </div>
          )}
        </div>

        {/* ================= PAGINATION BAR ================= */}
        {filteredPhotos.length > ITEMS_PER_PAGE && (
          <div className="shrink-0 px-4 sm:px-6 py-3 bg-zinc-900/80 border-t border-zinc-800 flex items-center justify-between text-xs text-zinc-300">
            <span className="text-zinc-400">
              Menampilkan <span className="font-semibold text-white">{(currentPage - 1) * ITEMS_PER_PAGE + 1}</span>-
              <span className="font-semibold text-white">
                {Math.min(currentPage * ITEMS_PER_PAGE, filteredPhotos.length)}
              </span>{' '}
              dari <span className="font-semibold text-white">{filteredPhotos.length}</span> foto
            </span>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                className="p-1.5 rounded-lg border border-zinc-800 bg-zinc-900 text-zinc-300 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                title="Halaman Sebelumnya"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <span className="px-2 font-mono font-medium text-white">
                {currentPage} / {totalPages}
              </span>

              <button
                type="button"
                disabled={currentPage >= totalPages}
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                className="p-1.5 rounded-lg border border-zinc-800 bg-zinc-900 text-zinc-300 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                title="Halaman Selanjutnya"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ================= FULLSCREEN DETAIL PREVIEW MODAL ================= */}
      <HistoryPhotoDetailModal
        photo={selectedPhoto}
        currentIndex={currentIndex}
        totalCount={filteredPhotos.length}
        hasPrev={hasPrev}
        hasNext={hasNext}
        onPrev={handlePrevPhoto}
        onNext={handleNextPhoto}
        onClose={() => setSelectedPhoto(null)}
        onDownload={handleDownload}
        onDelete={setDeleteConfirmId}
      />

      {/* ================= CONFIRMATION MODALS ================= */}
      {/* 1. Confirm Delete Single */}
      <ConfirmDeleteModal
        isOpen={Boolean(deleteConfirmId)}
        onClose={() => setDeleteConfirmId(null)}
        onConfirm={() => {
          if (deleteConfirmId) handleDeletePhoto(deleteConfirmId)
        }}
      />

      {/* 2. Confirm Clear All */}
      <ConfirmClearAllModal
        isOpen={isClearingAll}
        totalPhotos={photos.length}
        onClose={() => setIsClearingAll(false)}
        onConfirm={handleClearAll}
      />
    </div>
  )
}
