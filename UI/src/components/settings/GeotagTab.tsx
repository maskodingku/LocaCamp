import React from 'react'
import { Eye, MapPin, Sliders, Check } from 'lucide-react'
import type { GeotagDisplayConfig } from '../../types/camera'
import { CyberGlassOrb } from './CyberGlassOrb'

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
      {/* CARD HUD CYBER GLASS GEOTAG */}
      <div className="relative rounded-[22px] border border-cyan-400/40 bg-[#020717]/80 backdrop-blur-2xl shadow-[0_10px_35px_rgba(0,0,0,0.7),0_0_20px_rgba(6,182,212,0.18),inset_0_1.5px_2px_rgba(255,255,255,0.6)] text-white overflow-hidden">
        
        {/* 3D Glass Ambient Bubbles di Sudut Card */}
        <div
          className="absolute -top-3 -right-3 w-20 h-20 rounded-full border border-cyan-400/30 blur-[0.5px] shadow-[inset_0_2px_4px_rgba(255,255,255,0.7),0_0_15px_rgba(6,182,212,0.25)] pointer-events-none"
          style={{
            background: 'radial-gradient(circle at 35% 25%, rgba(56,189,248,0.22) 0%, rgba(6,182,212,0.08) 50%, transparent 100%)',
          }}
        />
        <div
          className="absolute -bottom-5 -left-5 w-24 h-24 rounded-full border border-sky-400/25 blur-[0.5px] shadow-[inset_0_2px_4px_rgba(255,255,255,0.65),0_0_15px_rgba(14,165,233,0.2)] pointer-events-none"
          style={{
            background: 'radial-gradient(circle at 35% 25%, rgba(34,211,238,0.18) 0%, transparent 100%)',
          }}
        />

        {/* Specular Glare Highlight Border Atas Kaca */}
        <div className="pointer-events-none absolute top-0 left-8 right-8 h-[1px] bg-gradient-to-r from-transparent via-cyan-100/90 to-transparent z-20" />

        {/* Optic Lens Flare Glow Spots di Pinggiran Frame */}
        <div className="pointer-events-none absolute top-1.5 left-5 w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_6px_#fff,0_0_14px_#22d3ee] z-20" />
        <div className="pointer-events-none absolute top-1.5 right-5 w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_6px_#fff,0_0_14px_#22d3ee] z-20" />

        {/* Header Section Geotag */}
        <div className="w-full flex items-center justify-between px-3.5 sm:px-4 py-2.5 sm:py-3 border-b border-cyan-500/20 bg-[#020b18]/60 backdrop-blur-md rounded-t-[21px] relative z-10">
          <div className="flex items-center gap-2.5 min-w-0">
            <CyberGlassOrb
              icon={MapPin}
              size="md"
              variant="cyan"
            />
            <div className="h-4.5 w-[1.5px] bg-cyan-400/40 shrink-0" />
            <div className="flex items-center gap-1.5 min-w-0">
              <span className="text-slate-200 text-[13.5px] sm:text-sm font-medium tracking-wide">
                Badge
              </span>
              <span className="text-white text-[13.5px] sm:text-sm font-extrabold tracking-wide truncate drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)]">
                Geotag Satelit
              </span>
            </div>
          </div>

          <span className="px-2.5 py-0.5 rounded-full bg-[#030917]/90 border border-cyan-400/60 shadow-[inset_0_1px_1px_rgba(255,255,255,0.3),0_0_10px_rgba(6,182,212,0.4)] text-[10.5px] font-mono font-bold text-cyan-300 drop-shadow-[0_0_6px_rgba(6,182,212,0.8)] shrink-0">
            LIVE GPS
          </span>
        </div>

        {/* Body Konten Geotag */}
        <div className="p-3.5 sm:p-4 pt-3 sm:pt-3.5 space-y-4">
          
          {/* Sub-Section 1: Item Informasi Geotag */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                <CyberGlassOrb icon={MapPin} size="xs" variant="cyan" />
                <span>Informasi yang Ditampilkan pada Foto</span>
              </label>
              {onTriggerPreview && (
                <button
                  type="button"
                  onClick={() => onTriggerPreview?.('geotag_position')}
                  className="flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold text-cyan-200 hover:text-white bg-gradient-to-r from-[#020e1f]/90 via-[#051c36]/85 to-[#020e1f]/90 border border-cyan-400/60 shadow-[0_0_10px_rgba(6,182,212,0.3),inset_0_1px_1.5px_rgba(255,255,255,0.6)] transition-all active:scale-95 cursor-pointer relative overflow-hidden group"
                  title="Lihat Pratinjau Langsung di Kamera"
                >
                  <div className="absolute top-0 inset-x-2 h-[1px] bg-white/70 pointer-events-none" />
                  <Eye className="w-3.5 h-3.5 text-cyan-400 drop-shadow-[0_0_4px_rgba(34,211,238,0.8)]" />
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
                    className="flex items-center justify-between p-3 rounded-2xl border border-cyan-500/25 bg-[#020d1c]/70 hover:bg-[#03152e]/80 cursor-pointer transition-all shadow-inner group"
                  >
                    <div className="min-w-0 pr-3">
                      <p className="text-xs sm:text-sm font-semibold text-white group-hover:text-cyan-200 transition-colors">
                        {item.title}
                      </p>
                      <p className="text-[11px] text-slate-400 truncate mt-0.5">
                        {item.desc}
                      </p>
                    </div>

                    {/* Cyber Toggle Switch */}
                    <div className="relative inline-flex items-center shrink-0">
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={e =>
                          onChangeGeotagConfig({
                            ...geotagConfig,
                            [item.key]: e.target.checked,
                          })
                        }
                        className="sr-only peer"
                      />
                      <div className="w-10 h-5.5 bg-gradient-to-r from-[#03152e] to-[#0a2042] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4.5 after:w-4.5 after:shadow-[0_0_6px_#fff] after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-cyan-400 peer-checked:via-sky-400 peer-checked:to-blue-500 border border-cyan-500/50 peer-checked:border-cyan-200 shadow-[0_0_10px_rgba(6,182,212,0.4)]" />
                    </div>
                  </label>
                )
              })}
            </div>
          </div>

          {/* Sub-Section 2: Posisi Geotag */}
          <div className="pt-1">
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                <CyberGlassOrb icon={MapPin} size="xs" variant="cyan" />
                <span>Posisi Badge Geotag</span>
              </label>
              {onTriggerPreview && (
                <button
                  type="button"
                  onClick={() => onTriggerPreview?.('geotag_position')}
                  className="flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold text-cyan-200 hover:text-white bg-gradient-to-r from-[#020e1f]/90 via-[#051c36]/85 to-[#020e1f]/90 border border-cyan-400/60 shadow-[0_0_10px_rgba(6,182,212,0.3),inset_0_1px_1.5px_rgba(255,255,255,0.6)] transition-all active:scale-95 cursor-pointer relative overflow-hidden group"
                  title="Lihat Pratinjau Langsung di Kamera"
                >
                  <div className="absolute top-0 inset-x-2 h-[1px] bg-white/70 pointer-events-none" />
                  <Eye className="w-3.5 h-3.5 text-cyan-400 drop-shadow-[0_0_4px_rgba(34,211,238,0.8)]" />
                  <span>Preview</span>
                </button>
              )}
            </div>

            <div className="grid grid-cols-2 gap-2 p-2.5 bg-[#020d1c]/70 rounded-2xl border border-cyan-500/25">
              {POSITIONS.map(pos => {
                const active = geotagConfig.position === pos.id
                return (
                  <button
                    key={pos.id}
                    type="button"
                    onClick={() =>
                      onChangeGeotagConfig({ ...geotagConfig, position: pos.id })
                    }
                    className={`py-2.5 px-3 rounded-xl text-xs font-semibold transition-all flex items-center justify-between border relative overflow-hidden ${
                      active
                        ? 'bg-gradient-to-r from-cyan-400 via-sky-400 to-blue-500 text-[#020b18] font-black border-cyan-200 shadow-[0_0_12px_rgba(6,182,212,0.8),inset_0_1px_1.5px_rgba(255,255,255,0.9)]'
                        : 'bg-[#020717]/60 text-slate-300 hover:text-white border-cyan-900/60 hover:border-cyan-500/50'
                    }`}
                  >
                    <span className="truncate">{pos.label}</span>
                    {active && <Check className="w-4 h-4 text-[#020b18] stroke-[3] shrink-0 ml-1" />}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Sub-Section 3: Ukuran Tulisan Geotag */}
          <div className="pt-1">
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                <CyberGlassOrb icon={Sliders} size="xs" variant="cyan" />
                <span>Ukuran Tulisan Lokasi pada Foto</span>
              </label>
              {onTriggerPreview && (
                <button
                  type="button"
                  onClick={() => onTriggerPreview?.('geotag_size')}
                  className="flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold text-cyan-200 hover:text-white bg-gradient-to-r from-[#020e1f]/90 via-[#051c36]/85 to-[#020e1f]/90 border border-cyan-400/60 shadow-[0_0_10px_rgba(6,182,212,0.3),inset_0_1px_1.5px_rgba(255,255,255,0.6)] transition-all active:scale-95 cursor-pointer relative overflow-hidden group"
                  title="Lihat Pratinjau Langsung di Kamera"
                >
                  <div className="absolute top-0 inset-x-2 h-[1px] bg-white/70 pointer-events-none" />
                  <Eye className="w-3.5 h-3.5 text-cyan-400 drop-shadow-[0_0_4px_rgba(34,211,238,0.8)]" />
                  <span>Preview</span>
                </button>
              )}
            </div>

            <div className="grid grid-cols-4 gap-1.5 p-1 bg-[#020d1c]/80 rounded-full border border-cyan-500/25">
              {FONT_SIZES.map(item => {
                const active = (geotagConfig.fontSize || 'medium') === item.id
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() =>
                      onChangeGeotagConfig({ ...geotagConfig, fontSize: item.id })
                    }
                    className={`py-1.5 px-1 rounded-full text-[11px] sm:text-xs font-bold transition-all text-center whitespace-nowrap relative overflow-hidden border ${
                      active
                        ? 'bg-gradient-to-r from-cyan-400 via-sky-400 to-blue-500 text-[#020b18] font-black border-cyan-200 shadow-[0_0_10px_rgba(6,182,212,0.7),inset_0_1px_1.5px_rgba(255,255,255,0.9)]'
                        : 'border-transparent text-slate-300 hover:text-white'
                    }`}
                  >
                    <span>{item.label}</span>
                    <span className={`text-[9.5px] ml-1 opacity-70 ${active ? 'text-[#020b18]' : 'text-slate-400'}`}>
                      {item.hint}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
