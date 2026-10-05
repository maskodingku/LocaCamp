import { useState } from 'react'
import {
  X,
  Upload,
  Sparkles,
  Sliders,
  MapPin,
  Trash2,
  RotateCcw,
  Info,
  Building2,
  Heart,
  ShieldCheck,
  CheckCircle2,
  Terminal,
  ExternalLink,
} from 'lucide-react'
import appLogo from '../../assets/locacamp-logo.jpg'
import developerPhoto from '../../assets/foto-profil-abdi-syahputra-harahap.jpg'
import type {
  WatermarkConfig,
  WatermarkPosition,
  GeotagDisplayConfig,
} from '../../types/camera'
import { optimizeWatermarkImage } from '../../utils/storage'

// Ikon Resmi GitHub
const GithubIcon: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    aria-hidden="true"
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
    />
  </svg>
)

interface SettingsDrawerProps {
  isOpen: boolean
  onClose: () => void
  watermark: WatermarkConfig
  onChangeWatermark: (cfg: WatermarkConfig) => void
  geotagConfig: GeotagDisplayConfig
  onChangeGeotagConfig: (cfg: GeotagDisplayConfig) => void
  onResetSettings?: () => void
}

export const SettingsDrawer: React.FC<SettingsDrawerProps> = ({
  isOpen,
  onClose,
  watermark,
  onChangeWatermark,
  geotagConfig,
  onChangeGeotagConfig,
  onResetSettings,
}) => {
  const [activeTab, setActiveTab] = useState<'watermark' | 'geotag' | 'about'>('watermark')

  if (!isOpen) return null

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = async event => {
      const result = event.target?.result as string
      if (result) {
        const optimized = await optimizeWatermarkImage(result)
        onChangeWatermark({
          ...watermark,
          imageUrl: optimized,
        })
      }
    }
    reader.readAsDataURL(file)
  }

  const positions: { id: WatermarkPosition; label: string; col: string; row: string }[] = [
    { id: 'top-left', label: '↖ Atas Kiri', col: 'col-start-1', row: 'row-start-1' },
    { id: 'top-center', label: '↑ Atas Tengah', col: 'col-start-2', row: 'row-start-1' },
    { id: 'top-right', label: '↗ Atas Kanan', col: 'col-start-3', row: 'row-start-1' },
    { id: 'center', label: '• Tengah', col: 'col-start-2', row: 'row-start-2' },
    { id: 'bottom-left', label: '↙ Bawah Kiri', col: 'col-start-1', row: 'row-start-3' },
    { id: 'bottom-center', label: '↓ Bawah Tengah', col: 'col-start-2', row: 'row-start-3' },
    { id: 'bottom-right', label: '↘ Bawah Kanan', col: 'col-start-3', row: 'row-start-3' },
  ]

  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-black/70 backdrop-blur-md animate-in fade-in">
      <div
        className="w-full md:max-w-xl max-h-[88vh] md:max-h-[85vh] bg-zinc-950 border border-zinc-800 rounded-t-3xl md:rounded-3xl shadow-2xl flex flex-col overflow-hidden text-white animate-in slide-in-from-bottom-6 duration-200"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800">
          <div className="flex items-center gap-2">
            <Sliders className="w-5 h-5 text-zinc-400" />
            <h2 className="text-base font-semibold text-white">Pengaturan Foto & Tampilan</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Buttons */}
        <div className="grid grid-cols-3 border-b border-zinc-800 px-2 md:px-6 bg-zinc-900/50">
          <button
            type="button"
            onClick={() => setActiveTab('watermark')}
            className={`py-3 px-1 md:px-2 text-[11px] md:text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-1.5 border-b-2 transition-all ${
              activeTab === 'watermark'
                ? 'border-white text-white'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">Watermark</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('geotag')}
            className={`py-3 px-1 md:px-2 text-[11px] md:text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-1.5 border-b-2 transition-all ${
              activeTab === 'geotag'
                ? 'border-white text-white'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <MapPin className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">Geotag</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('about')}
            className={`py-3 px-1 md:px-2 text-[11px] md:text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-1.5 border-b-2 transition-all ${
              activeTab === 'about'
                ? 'border-white text-white'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Info className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">About</span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {activeTab === 'watermark' ? (
            <>
              {/* Upload Custom Logo */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-2">
                  Unggah Logo / Gambar Sendiri
                </label>
                <div className="flex items-center gap-3">
                  <label className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-dashed border-zinc-700 hover:border-zinc-500 bg-zinc-900 hover:bg-zinc-800/80 cursor-pointer transition-all text-sm font-medium text-zinc-200">
                    <Upload className="w-4 h-4 text-zinc-400" />
                    <span>Pilih Gambar (PNG/JPG/SVG)</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleFileUpload}
                    />
                  </label>
                  {watermark.imageUrl && (
                    <button
                      type="button"
                      onClick={() => onChangeWatermark({ ...watermark, imageUrl: '' })}
                      className="p-3 rounded-xl border border-rose-500/20 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 transition-colors"
                      title="Hapus Watermark"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              {/* Preview Logo Aktif */}
              {watermark.imageUrl ? (
                <div className="p-3.5 rounded-2xl bg-zinc-900/60 border border-zinc-800 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3 overflow-hidden">
                    <div className="w-14 h-14 rounded-xl bg-black/60 border border-zinc-800 flex items-center justify-center p-1.5 shrink-0">
                      <img
                        src={watermark.imageUrl}
                        alt="Logo Aktif"
                        className="max-w-full max-h-full object-contain"
                      />
                    </div>
                    <div className="overflow-hidden">
                      <p className="text-xs font-semibold text-white">Logo Aktif</p>
                      <p className="text-[11px] text-zinc-400">Siap dicetak pada hasil foto</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => onChangeWatermark({ ...watermark, imageUrl: '' })}
                    className="p-2.5 rounded-xl border border-rose-500/20 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 transition-colors shrink-0"
                    title="Hapus Logo"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="p-3.5 rounded-xl border border-dashed border-zinc-800 text-center bg-zinc-900/30">
                  <p className="text-xs text-zinc-500 italic">Belum ada logo yang diunggah</p>
                </div>
              )}

              {/* Position Selector (9-Grid) */}
              {watermark.imageUrl && (
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-2">
                    Posisi Watermark di Foto
                  </label>
                  <div className="grid grid-cols-3 gap-2 p-3 bg-zinc-900/60 rounded-2xl border border-zinc-800">
                    {positions.map(pos => {
                      const active = watermark.position === pos.id
                      return (
                        <button
                          key={pos.id}
                          type="button"
                          onClick={() =>
                            onChangeWatermark({ ...watermark, position: pos.id })
                          }
                          className={`py-2 px-3 rounded-lg text-xs font-medium transition-all ${
                            active
                              ? 'bg-white text-zinc-950 font-semibold shadow-md'
                              : 'bg-zinc-800/60 text-zinc-300 hover:bg-zinc-700/60'
                          }`}
                        >
                          {pos.label}
                        </button>
                      )
                    })}
                  </div>
                </div>
              )}

              {/* Sliders: Size and Opacity */}
              {watermark.imageUrl && (
                <div className="space-y-4 pt-1">
                  <div>
                    <div className="flex justify-between text-xs font-semibold text-zinc-400 mb-1.5">
                      <span>Ukuran Watermark</span>
                      <span className="text-zinc-200">{watermark.sizePercent}% lebar foto</span>
                    </div>
                    <input
                      type="range"
                      min={8}
                      max={45}
                      value={watermark.sizePercent}
                      onChange={e =>
                        onChangeWatermark({
                          ...watermark,
                          sizePercent: Number(e.target.value),
                        })
                      }
                      className="w-full accent-white h-1.5 bg-zinc-800 rounded-lg cursor-pointer"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-semibold text-zinc-400 mb-1.5">
                      <span>Transparansi (Opacity)</span>
                      <span className="text-zinc-200">{Math.round(watermark.opacity * 100)}%</span>
                    </div>
                    <input
                      type="range"
                      min={0.15}
                      max={1.0}
                      step={0.05}
                      value={watermark.opacity}
                      onChange={e =>
                        onChangeWatermark({
                          ...watermark,
                          opacity: Number(e.target.value),
                        })
                      }
                      className="w-full accent-white h-1.5 bg-zinc-800 rounded-lg cursor-pointer"
                    />
                  </div>
                </div>
              )}
            </>
          ) : activeTab === 'geotag' ? (
            /* Geotag Settings Tab */
            <div className="space-y-4">
              <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-2">
                Informasi yang Ditampilkan pada Foto
              </label>

              <div className="space-y-2">
                {[
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
                ].map(item => {
                  const isChecked = geotagConfig[item.key]
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
                <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-2">
                  Posisi Badge Geotag
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'bottom-left' as const, label: '↙ Kiri Bawah' },
                    { id: 'bottom-right' as const, label: '↘ Kanan Bawah' },
                    { id: 'top-left' as const, label: '↖ Kiri Atas' },
                    { id: 'top-right' as const, label: '↗ Kanan Atas' },
                  ].map(pos => (
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
                <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-2">
                  Ukuran Tulisan Lokasi pada Foto
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { id: 'small' as const, label: 'Kecil', hint: '85%' },
                    { id: 'medium' as const, label: 'Standar', hint: '100%' },
                    { id: 'large' as const, label: 'Besar', hint: '135%' },
                    { id: 'xlarge' as const, label: 'Ekstra', hint: '175%' },
                  ].map(item => {
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
          ) : (
            /* About Tab */
            <div className="space-y-6 animate-in fade-in duration-200">
              {/* App Overview Header Card */}
              <div className="p-4 rounded-2xl bg-gradient-to-br from-zinc-900 via-zinc-900/80 to-zinc-950 border border-zinc-800 relative overflow-hidden">
                <div className="flex items-start gap-4">
                  <img
                    src={appLogo}
                    alt="LocaCamp"
                    className="w-14 h-14 rounded-2xl object-cover border border-emerald-500/40 shadow-lg shadow-emerald-500/10 shrink-0"
                  />
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-base font-bold text-white tracking-wide">
                        LocaCamp <span className="text-emerald-400">Enterprise</span>
                      </h3>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        v1.0.0 PWA
                      </span>
                    </div>
                    <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                      Sistem kamera web cerdas dengan penandaan lokasi GPS real-time, sinkronisasi zona waktu otomatis, dan watermark instansi terverifikasi untuk dokumentasi teknis lapangan.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 mt-4 pt-4 border-t border-zinc-800/80 text-xs">
                  <div className="flex items-center gap-2 text-zinc-300">
                    <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>100% Client-Side Privacy</span>
                  </div>
                  <div className="flex items-center gap-2 text-zinc-300">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>PWA Offline Capable</span>
                  </div>
                </div>
              </div>

              {/* Developer Profile Card */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-2">
                  Profil Pengembang Sistem
                </label>
                <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-3.5">
                  <div className="flex items-center gap-3.5">
                    <img
                      src={developerPhoto}
                      alt="Abdi Syahputra Harahap"
                      className="w-14 h-14 sm:w-16 sm:h-16 rounded-full object-cover border-2 border-emerald-500/60 shadow-lg shadow-emerald-500/20 shrink-0 ring-2 ring-emerald-500/20"
                    />
                    <div className="overflow-hidden">
                      <h4 className="text-sm sm:text-base font-bold text-white tracking-wide">
                        Abdi Syahputra Harahap
                      </h4>
                      <p className="text-xs font-medium text-emerald-400 flex items-center gap-1.5 mt-0.5">
                        <Terminal className="w-3.5 h-3.5 shrink-0" />
                        <span>Node.js Fullstack Developer &amp; Rust Developer</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-1 flex-wrap">
                    <span className="px-2.5 py-1 rounded-lg text-[11px] font-medium bg-zinc-800/80 text-zinc-300 border border-zinc-700/60">
                      ⚡ Node.js &amp; TypeScript
                    </span>
                    <span className="px-2.5 py-1 rounded-lg text-[11px] font-medium bg-zinc-800/80 text-zinc-300 border border-zinc-700/60">
                      🦀 Rust Systems Engineering
                    </span>
                    <span className="px-2.5 py-1 rounded-lg text-[11px] font-medium bg-zinc-800/80 text-zinc-300 border border-zinc-700/60">
                      ⚛️ React &amp; Canvas Engine
                    </span>
                  </div>

                  {/* Company Affiliation */}
                  <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-black/40 border border-zinc-800 text-xs text-zinc-300">
                    <Building2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <div>
                      <span className="text-zinc-400">Institusi / Perusahaan:</span>{' '}
                      <span className="font-semibold text-white">PT Wahana Mitra Amerta</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Dedication & Corporate Appreciation Card */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-2">
                  Dedikasi &amp; Rasa Terima Kasih
                </label>
                <div className="p-4 rounded-2xl bg-gradient-to-br from-zinc-900/90 via-zinc-950 to-zinc-900 border border-emerald-500/20 shadow-lg relative overflow-hidden space-y-3">
                  <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400">
                    <Heart className="w-4 h-4 fill-emerald-400/20 text-emerald-400" />
                    <span>Pernyataan Resmi Dedikasi</span>
                  </div>

                  <blockquote className="text-xs text-zinc-300 leading-relaxed italic border-l-2 border-emerald-500 pl-3 py-0.5 space-y-2">
                    <p>
                      &ldquo;Aplikasi ini saya kembangkan dan dedikasikan secara khusus sebagai bentuk rasa terima kasih yang mendalam serta loyalitas penuh kepada jajaran Manajemen dan Keluarga Besar <strong className="text-white font-semibold not-italic">PT Wahana Mitra Amerta</strong> atas amanah dan kepercayaan yang telah diberikan dalam mengangkat saya sebagai bagian dari perusahaan.&rdquo;
                    </p>
                    <p>
                      &ldquo;Semoga inovasi sistem dokumentasi geotagging ini memberikan kontribusi nyata dalam memperkuat akurasi, efisiensi operasional pengawasan, dan keunggulan teknologi digital PT Wahana Mitra Amerta ke depan.&rdquo;
                    </p>
                  </blockquote>

                  <div className="pt-2 flex items-center justify-between text-[11px] text-zinc-400 border-t border-zinc-800/80">
                    <span>Hormat Saya,</span>
                    <span className="font-semibold text-zinc-200">Abdi Syahputra Harahap</span>
                  </div>
                </div>
              </div>

              {/* Official GitHub Repository Card */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-2">
                  Repositori Kode Sumber Resmi
                </label>
                <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-xl bg-zinc-800 border border-zinc-700/80 flex items-center justify-center text-white shrink-0 shadow">
                        <GithubIcon className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs sm:text-sm font-bold text-white tracking-wide">
                            maskodingku/LocaCamp
                          </span>
                          <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                            Public
                          </span>
                        </div>
                        <p className="text-[11px] text-zinc-400 mt-0.5">
                          Open Source Geotagging Camera PWA
                        </p>
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-zinc-300 leading-relaxed">
                    Kode sumber, arsitektur sistem, dokumentasi panduan, dan pembaruan aplikasi dapat diakses secara publik melalui repositori GitHub resmi.
                  </p>

                  <a
                    href="https://github.com/maskodingku/LocaCamp"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-semibold transition-all border border-zinc-700/60 hover:border-zinc-500 shadow active:scale-98 group"
                  >
                    <GithubIcon className="w-4 h-4 text-zinc-300 group-hover:text-white" />
                    <span>Kunjungi Repositori GitHub</span>
                    <ExternalLink className="w-3.5 h-3.5 text-zinc-400 group-hover:text-white ml-0.5" />
                  </a>
                </div>
              </div>

              {/* Purpose & Features Detail Card */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-2">
                  Tujuan &amp; Fungsi Aplikasi
                </label>
                <div className="p-4 rounded-2xl bg-zinc-900/40 border border-zinc-800 space-y-2.5 text-xs text-zinc-300">
                  <p className="leading-relaxed">
                    <strong className="text-white">LocaCamp</strong> dirancang spesifik untuk menjawab tantangan dokumentasi lapangan yang valid dan akurat:
                  </p>
                  <ul className="space-y-2 pl-1">
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                      <span>
                        <strong className="text-white">Geotagging Live Satelit:</strong> Menempelkan koordinat garis lintang/bujur presisi tinggi serta toleransi akurasi GPS secara real-time.
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                      <span>
                        <strong className="text-white">Reverse Geocoding Terintegrasi:</strong> Menerjemahkan titik koordinat menjadi alamat jalan dan wilayah administratif secara otomatis.
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                      <span>
                        <strong className="text-white">Watermark Logo Resmi:</strong> Membubuhi identitas PT Wahana Mitra Amerta pada setiap jepretan foto hasil survei secara instan.
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                      <span>
                        <strong className="text-white">Zona Waktu Otomatis:</strong> Mendeteksi otomatis pembagian waktu lokal (WIB, WITA, WIT) berdasarkan posisi bujur lokasi pengambilan foto.
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-zinc-800 bg-zinc-950 flex items-center justify-between gap-3">
          {onResetSettings ? (
            <button
              type="button"
              onClick={onResetSettings}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-zinc-800 bg-zinc-900/60 hover:bg-zinc-800 text-zinc-400 hover:text-white font-medium text-xs transition-colors active:scale-95"
              title="Kembalikan semua setelan ke awal"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Default</span>
            </button>
          ) : <div />}

          <button
            type="button"
            onClick={onClose}
            className="w-full md:w-auto px-6 py-2.5 rounded-xl bg-white text-zinc-950 font-semibold text-sm hover:bg-zinc-200 transition-colors shadow-lg active:scale-95"
          >
            Selesai
          </button>
        </div>
      </div>
    </div>
  )
}
