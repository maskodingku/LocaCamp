import React, { useMemo } from 'react'
import {
  Download,
  Trash2,
  Calendar,
  MapPin,
  Eye,
  Check,
  FileImage,
} from 'lucide-react'
import type { StoredPhoto } from '../../utils/photoStorage'
import { GoogleDriveIcon } from '../settings/gdrive/GoogleDriveIcon'

interface HistoryPhotoCardProps {
  item: StoredPhoto
  isSuccess: boolean
  onSelect: (photo: StoredPhoto) => void
  onDownload: (photo: StoredPhoto) => void
  onDelete: (id: string) => void
}

export const HistoryPhotoCard: React.FC<HistoryPhotoCardProps> = ({
  item,
  isSuccess,
  onSelect,
  onDownload,
  onDelete,
}) => {
  const dateStr = useMemo(() => {
    return new Date(item.timestamp).toLocaleDateString('id-ID', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    })
  }, [item.timestamp])

  const timeStr = useMemo(() => {
    return new Date(item.timestamp).toLocaleTimeString('id-ID', {
      hour: '2-digit',
      minute: '2-digit',
    })
  }, [item.timestamp])

  const geoStr = useMemo(() => {
    if (item.latitude !== null && item.longitude !== null && item.latitude !== undefined && item.longitude !== undefined) {
      return `${item.latitude.toFixed(4)}°, ${item.longitude.toFixed(4)}°`
    }
    return '-'
  }, [item.latitude, item.longitude])

  // Menghitung ukuran file dari dataUrl base64
  const fileSizeFormatted = useMemo(() => {
    if (!item?.dataUrl) return '-'
    const base64Data = item.dataUrl.split(',')[1] || ''
    const padding = base64Data.endsWith('==') ? 2 : base64Data.endsWith('=') ? 1 : 0
    const bytes = Math.round((base64Data.length * 3) / 4 - padding)
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`
  }, [item?.dataUrl])

  return (
    <div className="group relative rounded-2xl bg-zinc-900/80 border border-zinc-800/90 hover:border-cyan-500/40 overflow-hidden flex flex-col shadow-lg transition-all hover:shadow-2xl hover:-translate-y-0.5">
      {/* Thumbnail Image Container */}
      <div
        className="relative w-full aspect-video bg-black overflow-hidden cursor-pointer"
        onClick={() => onSelect(item)}
        title="Klik untuk melihat pratinjau penuh"
      >
        <img
          src={item.dataUrl}
          alt="Dokumentasi Foto"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />

        {/* Hover Overlay Button */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
          <span className="px-3 py-1.5 rounded-full glass-panel text-xs font-semibold text-white flex items-center gap-1.5 backdrop-blur-md shadow-lg">
            <Eye className="w-3.5 h-3.5" />
            Lihat Penuh
          </span>
        </div>

        {/* Time Badge on Image */}
        <div className="absolute top-2 left-2 px-2 py-0.5 rounded-lg bg-black/75 backdrop-blur-md border border-white/10 text-[10px] font-mono text-zinc-200">
          {timeStr} WIB
        </div>

        {/* Cap Google Drive pada Foto Terunggah */}
        {item.uploadedToDrive && (
          <div
            className="absolute top-2 right-2 px-2 py-0.5 rounded-lg bg-black/80 backdrop-blur-md border border-emerald-500/50 text-[10px] text-zinc-200 flex items-center gap-1.5 shadow-md z-10"
            title="Foto ini sudah tersimpan di Google Drive"
          >
            <GoogleDriveIcon className="w-3.5 h-3.5 shrink-0" />
            <span className="font-semibold text-emerald-300">Drive</span>
            <Check className="w-3 h-3 text-emerald-400 stroke-[3]" />
          </div>
        )}
      </div>

      {/* Metadata Details Card (Bagian Tengah 2 Bagian: 70% Kiri, 30% Kanan) */}
      <div className="p-3 sm:p-3.5 flex-1 flex flex-col justify-between gap-2.5">
        <div className="flex items-center justify-between gap-2">
          {/* Bagian Kiri (Lebar 70%): Berisi Jalan dan Geo Number Jalan */}
          <div className="w-[70%] min-w-0 pr-1 space-y-1">
            {/* Baris 1: Jalan / Alamat */}
            <div className="flex items-center gap-1.5 min-w-0">
              <MapPin className="w-3.5 h-3.5 text-rose-400 shrink-0 drop-shadow-[0_0_3px_rgba(244,63,94,0.6)]" />
              <p
                className="text-xs font-semibold text-zinc-100 truncate leading-tight tracking-wide"
                title={item.address || 'Alamat tidak tercatat'}
              >
                {item.address || 'Alamat tidak tercatat'}
              </p>
            </div>

            {/* Baris 2: Geo Number Jalan (Koordinat) */}
            <div className="pl-5 min-w-0">
              <p className="font-mono text-[10px] font-semibold text-cyan-300/80 truncate leading-tight">
                {geoStr}
              </p>
            </div>
          </div>

          {/* Pembatas Vertikal Halus */}
          <div className="w-[1px] self-stretch bg-gradient-to-b from-transparent via-cyan-400/30 to-transparent shrink-0" />

          {/* Bagian Kanan (Lebar 30%): Berisi Tanggal Foto dan Size Foto */}
          <div className="w-[30%] min-w-0 pl-1 space-y-1 flex flex-col justify-center shrink-0">
            {/* Baris 1: Tanggal Foto */}
            <div className="flex items-center gap-1 min-w-0 justify-start">
              <Calendar className="w-3 h-3 text-cyan-300 shrink-0" />
              <span className="font-mono text-[10px] sm:text-[10.5px] font-bold text-cyan-200/90 truncate">
                {dateStr}
              </span>
            </div>

            {/* Baris 2: Size Foto */}
            <div className="flex items-center gap-1 min-w-0 justify-start">
              <FileImage className="w-3 h-3 text-emerald-400 shrink-0" />
              <span className="font-mono text-[10px] sm:text-[10.5px] font-bold text-emerald-200/90 truncate">
                {fileSizeFormatted}
              </span>
            </div>
          </div>
        </div>

        {/* Card Action Buttons Toolbar (Bagian Bawah Rapih) */}
        <div className="flex items-center gap-2 pt-2 border-t border-zinc-800/80">
          {/* Tombol Hero: Unduh HD */}
          <button
            type="button"
            onClick={() => onDownload(item)}
            className={`h-9.5 flex-1 flex items-center justify-center gap-1.5 px-3 rounded-xl font-black text-xs transition-all active:scale-95 cursor-pointer relative overflow-hidden group shadow-[0_2px_10px_rgba(34,211,238,0.25)] ${
              isSuccess
                ? 'bg-gradient-to-r from-emerald-400 to-teal-500 text-black'
                : 'bg-gradient-to-r from-cyan-400 via-sky-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-black'
            }`}
            title="Unduh Foto HD"
          >
            {/* Highlight Glare */}
            <div className="absolute top-0 inset-x-2 h-[1px] bg-gradient-to-r from-transparent via-white/80 to-transparent pointer-events-none" />
            {isSuccess ? (
              <>
                <Check className="w-3.5 h-3.5 stroke-[3] shrink-0" />
                <span>Tersimpan!</span>
              </>
            ) : (
              <>
                <Download className="w-3.5 h-3.5 stroke-[2.5] shrink-0" />
                <span>Unduh HD</span>
              </>
            )}
          </button>

          {/* Tombol Hapus: Cyber Rose Button */}
          <button
            type="button"
            onClick={() => onDelete(item.id)}
            className="w-9.5 h-9.5 rounded-xl border border-rose-500/30 bg-gradient-to-b from-[#3a0b12]/90 via-[#25080e]/95 to-[#160408]/95 hover:border-rose-400/60 text-rose-300 hover:text-white shadow-[0_2px_8px_rgba(0,0,0,0.5),inset_0_1px_1px_rgba(255,255,255,0.2)] flex items-center justify-center shrink-0 active:scale-95 transition-all cursor-pointer"
            title="Hapus Foto dari Riwayat"
          >
            <Trash2 className="w-4 h-4 text-rose-400 drop-shadow-[0_0_3px_rgba(244,63,94,0.7)]" />
          </button>
        </div>
      </div>
    </div>
  )
}
