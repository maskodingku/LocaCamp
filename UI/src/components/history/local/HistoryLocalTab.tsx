import React, { useState, useMemo, useEffect } from 'react'
import {
  Search,
  SlidersHorizontal,
  ArrowUpDown,
  FolderOpen,
  ChevronLeft,
  ChevronRight,
  X,
} from 'lucide-react'
import type { StoredPhoto } from '../../../utils/photoStorage'
import { HistoryPhotoCard } from '../HistoryPhotoCard'

interface HistoryLocalTabProps {
  photos: StoredPhoto[]
  isLoading: boolean
  onDownload: (photo: StoredPhoto) => void
  onDeleteRequest: (id: string) => void
  onSelectPhoto: (photo: StoredPhoto) => void
  downloadSuccessId: string | null
}

type TimeFilter = 'all' | 'today' | 'week' | 'month'
type SortOrder = 'newest' | 'oldest'

const ITEMS_PER_PAGE = 6

export const HistoryLocalTab: React.FC<HistoryLocalTabProps> = ({
  photos,
  isLoading,
  onDownload,
  onDeleteRequest,
  onSelectPhoto,
  downloadSuccessId,
}) => {
  const [searchQuery, setSearchQuery] = useState('')
  const [timeFilter, setTimeFilter] = useState<TimeFilter>('all')
  const [sortOrder, setSortOrder] = useState<SortOrder>('newest')
  const [currentPage, setCurrentPage] = useState(1)

  // Filter & Search Logic
  const filteredPhotos = useMemo(() => {
    let result = [...photos]

    // 1. Search Query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim()
      result = result.filter(
        (p) =>
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

      result = result.filter((p) => {
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

  return (
    <div className="flex-1 flex flex-col min-h-0">
      {/* 1. Toolbar Filter & Sort */}
      <div className="shrink-0 p-2.5 sm:px-6 sm:py-3.5 bg-zinc-900/50 border-b border-zinc-800/80 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 sm:gap-2.5">
        {/* Search Box */}
        <div className="relative w-full sm:flex-1 sm:max-w-md">
          <Search className="w-3.5 h-3.5 sm:w-4 sm:h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
          <input
            type="text"
            placeholder="Cari lokasi, jalan, atau tanggal..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 sm:pl-9 pr-8 py-1.5 sm:py-2 rounded-xl bg-zinc-900 border border-zinc-700/80 text-xs sm:text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500 transition-colors"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white p-0.5 cursor-pointer"
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
            ).map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setTimeFilter(tab.id)}
                className={`px-2 sm:px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
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
            onClick={() => setSortOrder((prev) => (prev === 'newest' ? 'oldest' : 'newest'))}
            className="flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-[11px] sm:text-xs font-medium text-zinc-300 hover:text-white hover:border-zinc-700 transition-all active:scale-95 shrink-0 cursor-pointer"
            title="Urutkan Foto"
          >
            <ArrowUpDown className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-emerald-400" />
            <span>{sortOrder === 'newest' ? 'Terbaru' : 'Terlama'}</span>
          </button>
        </div>
      </div>

      {/* 2. Grid Galeri Foto Lokal */}
      <div className="relative flex-1 min-h-0 w-full bg-zinc-950 overflow-y-auto p-3 sm:p-6 custom-scrollbar">
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
                ? 'Belum Ada Riwayat Foto di Perangkat'
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
                className="px-3.5 py-1.5 rounded-xl border border-zinc-700 bg-zinc-900 text-xs font-semibold text-zinc-300 hover:text-white transition-all cursor-pointer"
              >
                Reset Pencarian
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-4">
            {paginatedPhotos.map((item) => (
              <HistoryPhotoCard
                key={item.id}
                item={item}
                isSuccess={downloadSuccessId === item.id}
                onDownload={onDownload}
                onDelete={onDeleteRequest}
                onSelect={onSelectPhoto}
              />
            ))}
          </div>
        )}
      </div>

      {/* 3. Pagination Footer */}
      {filteredPhotos.length > ITEMS_PER_PAGE && (
        <div className="shrink-0 p-3 sm:px-6 sm:py-3.5 bg-zinc-900/60 border-t border-zinc-800/80 flex items-center justify-between text-xs sm:text-sm text-zinc-400">
          <span className="text-[11px] sm:text-xs">
            Halaman <strong className="text-white">{currentPage}</strong> dari{' '}
            <strong className="text-white">{totalPages}</strong> ({filteredPhotos.length} foto)
          </span>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-2.5 sm:px-3 py-1.5 rounded-xl border border-zinc-800 bg-zinc-900 hover:bg-zinc-800 disabled:opacity-40 disabled:pointer-events-none text-zinc-200 transition-all flex items-center gap-1 active:scale-95 cursor-pointer text-xs"
            >
              <ChevronLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Sebelumnya</span>
            </button>
            <button
              type="button"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-2.5 sm:px-3 py-1.5 rounded-xl border border-zinc-800 bg-zinc-900 hover:bg-zinc-800 disabled:opacity-40 disabled:pointer-events-none text-zinc-200 transition-all flex items-center gap-1 active:scale-95 cursor-pointer text-xs"
            >
              <span className="hidden sm:inline">Selanjutnya</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
