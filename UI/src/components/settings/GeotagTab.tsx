import React from 'react'
import { Eye } from 'lucide-react'
import type { GeotagDisplayConfig } from '../../types/camera'

interface GeotagTabProps {
  geotagConfig: GeotagDisplayConfig
  onChangeGeotagConfig: (cfg: GeotagDisplayConfig) => void
  onTriggerPreview?: () => void
}

const GEOTAG_INFO_ITEMS = [
  {
    key: 'showAddress' as const,
    title: 'Nama Wilayah / Alamat Jalan',
    desc: 'Alamat lengkap dari pencarian geocoding otomatis',
  },
  {
    key: 'showCoordinates' as const,
    title: 'Koordinat GPS (Latitude / Longitude)',
    desc: 'Titik bujur dan lintang presisi tinggi',
  },
  {
    key: 'showTimestamp' as const,
    title: 'Tanggal & Waktu Real-Time',
    desc: 'Waktu pengambilan foto format lokal (WIB/WITA/WIT)',
  },
  {
    key: 'showAccuracy' as const,
    title: 'Indikator Akurasi GPS (Meter)',
    desc: 'Toleransi meteran sinyal satelit GPS saat capture',
  },
  {
    key: 'showMiniMap' as const,
    title: 'Mini Map (Cuplikan Peta Lokasi)',
    desc: 'Tampilkan peta jalan sekitar dan pin merah di samping geotag',
  },
]

const POSITIONS = [
  { id: 'bottom-left' as const, label: '↙ Kiri Bawah' },
  { id: 'bottom-right' as const, label: '↘ Kanan Bawah' },
  { id: 'top-left' as const, label: '↖ Kiri Atas' },
  { id: 'top-right' as const, label: '↗ Kanan Atas' },
]

const FONT_SIZES = [
  { id: 'small' as const, label: 'Kecil', hint: '85%' },
  { id: 'medium' as const, label: 'Standar', hint: '100%' },
  { id: 'large' as const, label: 'Besar', hint: '135%' },
  { id: 'xlarge' as const, label: 'Ekstra', hint: '175%' },
]

export const GeotagTab: React.FC<GeotagTabProps> = ({
  geotagConfig,
  onChangeGeotagConfig,
  onTriggerPreview,
}) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-2">
        <label className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
          Informasi yang Ditampilkan pada Foto
        </label>
        {onTriggerPreview && (
          <button
            type="button"
            onClick={onTriggerPreview}
            className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg text-[11px] font-medium text-amber-400 hover:text-amber-300 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/25 transition-all active:scale-95 cursor-pointer shadow-sm"
            title="Lihat Pratinjau Langsung di Kamera"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Preview</span>
          </button>
        )}
      </div>

      <div className="space-y-2">
        {GEOTAG_INFO_ITEMS.map(item => {
          const isChecked =
            item.key === 'showMiniMap'
              ? geotagConfig.showMiniMap !== false
              : geotagConfig[item.key]
          return (
            <label
              key={item.key}
              className="flex items-center justify-between p-3.5 rounded-xl border border-zinc-800 bg-zinc-900/60 hover:bg-zinc-800/40 cursor-pointer transition-colors"
            >
              <div>
                <p className="text-sm font-medium text-white">{item.title}</p>
                <p className="text-xs text-zinc-400">{item.desc}</p>
              </div>
              <input
                type="checkbox"
                checked={isChecked}
                onChange={e =>
                  onChangeGeotagConfig({
                    ...geotagConfig,
                    [item.key]: e.target.checked,
                  })
                }
                className="w-5 h-5 rounded accent-white cursor-pointer"
              />
            </label>
          )
        })}
      </div>

      {/* Geotag Position */}
      <div className="pt-2">
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
            Posisi Badge Geotag
          </label>
          {onTriggerPreview && (
            <button
              type="button"
              onClick={onTriggerPreview}
              className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg text-[11px] font-medium text-amber-400 hover:text-amber-300 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/25 transition-all active:scale-95 cursor-pointer shadow-sm"
              title="Lihat Pratinjau Langsung di Kamera"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Preview</span>
            </button>
          )}
        </div>
        <div className="grid grid-cols-2 gap-2">
          {POSITIONS.map(pos => (
            <button
              key={pos.id}
              type="button"
              onClick={() =>
                onChangeGeotagConfig({ ...geotagConfig, position: pos.id })
              }
              className={`p-3 rounded-xl text-xs font-medium border transition-all ${
                geotagConfig.position === pos.id
                  ? 'border-white bg-zinc-800 text-white font-semibold'
                  : 'border-zinc-800 bg-zinc-900/60 text-zinc-400 hover:text-white'
              }`}
            >
              {pos.label}
            </button>
          ))}
        </div>
      </div>

      {/* Ukuran Tulisan Geotag */}
      <div className="pt-2">
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
            Ukuran Tulisan Lokasi pada Foto
          </label>
          {onTriggerPreview && (
            <button
              type="button"
              onClick={onTriggerPreview}
              className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg text-[11px] font-medium text-amber-400 hover:text-amber-300 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/25 transition-all active:scale-95 cursor-pointer shadow-sm"
              title="Lihat Pratinjau Langsung di Kamera"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Preview</span>
            </button>
          )}
        </div>
        <div className="grid grid-cols-4 gap-2">
          {FONT_SIZES.map(item => {
            const active = (geotagConfig.fontSize || 'medium') === item.id
            return (
              <button
                key={item.id}
                type="button"
                onClick={() =>
                  onChangeGeotagConfig({ ...geotagConfig, fontSize: item.id })
                }
                className={`p-2.5 rounded-xl border flex flex-col items-center justify-center transition-all ${
                  active
                    ? 'border-white bg-zinc-800 text-white font-semibold shadow-md'
                    : 'border-zinc-800 bg-zinc-900/60 text-zinc-400 hover:text-white hover:border-zinc-700'
                }`}
              >
                <span className="text-xs">{item.label}</span>
                <span className="text-[10px] text-zinc-500">{item.hint}</span>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
