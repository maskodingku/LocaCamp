import React from 'react'
import {
  Download,
  Trash2,
  Calendar,
  MapPin,
  Eye,
  Check,
} from 'lucide-react'
import type { StoredPhoto } from '../../utils/photoStorage'

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
  const dateStr = new Date(item.timestamp).toLocaleDateString('id-ID', {
    weekday: 'short',
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
  const timeStr = new Date(item.timestamp).toLocaleTimeString('id-ID', {
    hour: '2-digit',
    minute: '2-digit',
  })

  return (
    <div className="group relative rounded-2xl bg-zinc-900/70 border border-zinc-800/80 hover:border-zinc-700 overflow-hidden flex flex-col shadow-lg transition-all hover:shadow-2xl hover:-translate-y-0.5">
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

        {/* Date Badge on Image */}
        <div className="absolute top-2 left-2 px-2 py-0.5 rounded-lg bg-black/70 backdrop-blur-md border border-white/10 text-[10px] font-mono text-zinc-200">
          {timeStr} WIB
        </div>
      </div>

      {/* Metadata Details Card */}
      <div className="p-3 sm:p-3.5 flex-1 flex flex-col justify-between gap-2.5">
        <div className="space-y-1">
          {/* Address */}
          <div className="flex items-start gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-rose-400 shrink-0 mt-0.5" />
            <p className="text-xs font-semibold text-zinc-200 line-clamp-2 leading-snug">
              {item.address || 'Alamat tidak tercatat'}
            </p>
          </div>

          {/* Coordinates & Date */}
          <div className="flex items-center justify-between text-[10px] font-mono text-zinc-400 pt-1 border-t border-zinc-800/60">
            <div className="flex items-center gap-1">
              <Calendar className="w-3 h-3 text-zinc-500" />
              <span>{dateStr}</span>
            </div>
            {item.latitude && item.longitude && (
              <span className="text-zinc-500">
                {item.latitude.toFixed(4)}°, {item.longitude.toFixed(4)}°
              </span>
            )}
          </div>
        </div>

        {/* Card Action Buttons */}
        <div className="flex items-center gap-2 pt-1 border-t border-zinc-800/80">
          {/* Download HD Button */}
          <button
            type="button"
            onClick={() => onDownload(item)}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl font-bold text-xs transition-all active:scale-95 shadow ${
              isSuccess
                ? 'bg-emerald-500 text-white'
                : 'bg-white hover:bg-zinc-200 text-zinc-950'
            }`}
            title="Unduh Ulang Foto HD"
          >
            {isSuccess ? (
              <>
                <Check className="w-3.5 h-3.5 stroke-[3]" />
                <span>Tersimpan!</span>
              </>
            ) : (
              <>
                <Download className="w-3.5 h-3.5" />
                <span>Unduh HD</span>
              </>
            )}
          </button>

          {/* Delete Single Button */}
          <button
            type="button"
            onClick={() => onDelete(item.id)}
            className="p-2 rounded-xl border border-zinc-800 bg-zinc-900/80 hover:bg-rose-500/10 hover:border-rose-500/40 text-zinc-400 hover:text-rose-400 transition-all active:scale-95"
            title="Hapus Foto dari Riwayat"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  )
}
