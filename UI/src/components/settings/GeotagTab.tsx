import React from 'react'
import { Eye } from 'lucide-react'
import type { GeotagDisplayConfig } from '../../types/camera'

interface GeotagTabProps {
  geotagConfig: GeotagDisplayConfig
  onChangeGeotagConfig: (cfg: GeotagDisplayConfig) => void
  onTriggerPreview?: (inputId: string) => void
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
      <div className="rounded-[22px] sm:rounded-[26px] border border-cyan-400/60 bg-[#031d28]/75 backdrop-blur-md p-4 sm:p-5 shadow-[0_0_20px_rgba(6,182,212,0.3),inset_0_0_16px_rgba(6,182,212,0.15)] space-y-4 relative overflow-hidden">
        {/* Specular Glint Top-Left */}
        <div className="pointer-events-none absolute top-1 left-1 w-2.5 h-2.5 bg-cyan-300 rounded-full blur-[1px] opacity-80" />
        <div className="pointer-events-none absolute top-1.5 left-1.5 w-1 h-1 bg-white rounded-full shadow-[0_0_6px_#fff]" />

        <div className="flex items-center justify-between mb-2">
        <label className="text-xs font-semibold uppercase tracking-wider text-zinc-300">
          Informasi yang Ditampilkan pada Foto
        </label>
        {onTriggerPreview && (
          <button
            type="button"
            onClick={() => onTriggerPreview?.('geotag_position')}
            className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg text-[11px] font-medium text-cyan-400 hover:text-cyan-300 bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 transition-all active:scale-95 cursor-pointer shadow-sm"
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
              className="flex items-center justify-between p-3.5 rounded-xl border border-cyan-500/20 bg-black/25 hover:bg-black/40 cursor-pointer transition-colors backdrop-blur-sm"
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
                className="w-5 h-5 rounded accent-cyan-400 cursor-pointer"
              />
            </label>
          )
        })}
      </div>

      {/* Geotag Position */}
      <div className="pt-2">
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs font-semibold uppercase tracking-wider text-zinc-300">
            Posisi Badge Geotag
          </label>
          {onTriggerPreview && (
            <button
              type="button"
              onClick={() => onTriggerPreview?.('geotag_position')}
              className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg text-[11px] font-medium text-cyan-400 hover:text-cyan-300 bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 transition-all active:scale-95 cursor-pointer shadow-sm"
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
                  ? 'border-cyan-400 bg-cyan-400 text-black font-black shadow-[0_0_12px_rgba(34,211,238,0.7)]'
                  : 'border-cyan-950/40 bg-black/30 text-zinc-300 hover:bg-black/50 hover:text-white'
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
          <label className="text-xs font-semibold uppercase tracking-wider text-zinc-300">
            Ukuran Tulisan Lokasi pada Foto
          </label>
          {onTriggerPreview && (
            <button
              type="button"
              onClick={() => onTriggerPreview?.('geotag_size')}
              className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg text-[11px] font-medium text-cyan-400 hover:text-cyan-300 bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 transition-all active:scale-95 cursor-pointer shadow-sm"
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
                    ? 'border-cyan-400 bg-cyan-400 text-black font-black shadow-[0_0_12px_rgba(34,211,238,0.7)]'
                    : 'border-cyan-950/40 bg-black/30 text-zinc-300 hover:bg-black/50 hover:text-white'
                }`}
              >
                <span className="text-xs">{item.label}</span>
                <span className="text-[10px] text-zinc-400">{item.hint}</span>
              </button>
            )
          })}
        </div>
      </div>
    </div>
    </div>
  )
}
