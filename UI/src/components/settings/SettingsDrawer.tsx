import { useState, useEffect } from 'react'
import {
  X,
  Upload,
  Sparkles,
  Sliders,
  MapPin,
  Camera,
  Trash2,
  RotateCcw,
  Info,
  Building2,
  Heart,
  ShieldCheck,
  CheckCircle2,
  Terminal,
  ExternalLink,
  Cpu,
  Zap,
  Maximize2,
  Sun,
  Contrast,
  Palette,
} from 'lucide-react'
import appLogo from '../../assets/locacamp-logo.jpg'
import developerPhoto from '../../assets/foto-profil-abdi-syahputra-harahap.jpg'
import type {
  WatermarkConfig,
  WatermarkPosition,
  GeotagDisplayConfig,
  CameraQualityConfig,
  SensorCapabilitiesInfo,
  CameraEffectConfig,
  CameraEffectPreset,
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
  cameraQualityConfig: CameraQualityConfig
  onChangeCameraQualityConfig: (cfg: CameraQualityConfig) => void
  cameraEffect: CameraEffectConfig
  onChangeCameraEffect: (cfg: CameraEffectConfig) => void
  sensorInfo?: SensorCapabilitiesInfo | null
  onResetSettings?: () => void
}

export const SettingsDrawer: React.FC<SettingsDrawerProps> = ({
  isOpen,
  onClose,
  watermark,
  onChangeWatermark,
  geotagConfig,
  onChangeGeotagConfig,
  cameraQualityConfig,
  onChangeCameraQualityConfig,
  cameraEffect,
  onChangeCameraEffect,
  sensorInfo,
  onResetSettings,
}) => {
  const [activeTab, setActiveTab] = useState<'watermark' | 'geotag' | 'camera' | 'about'>('watermark')
  const [activeSlider, setActiveSlider] = useState<string | null>(null)

  // Global listener untuk deteksi saat slider dilepas di mana saja
  useEffect(() => {
    if (!activeSlider) return
    const handleRelease = () => setActiveSlider(null)
    window.addEventListener('pointerup', handleRelease)
    window.addEventListener('pointercancel', handleRelease)
    window.addEventListener('touchend', handleRelease)
    window.addEventListener('mouseup', handleRelease)
    return () => {
      window.removeEventListener('pointerup', handleRelease)
      window.removeEventListener('pointercancel', handleRelease)
      window.removeEventListener('touchend', handleRelease)
      window.removeEventListener('mouseup', handleRelease)
    }
  }, [activeSlider])

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
    <div
      className={`fixed inset-0 flex items-end md:items-center justify-center transition-all duration-200 ${
        activeSlider
          ? 'bg-transparent backdrop-blur-none pointer-events-auto z-[100]'
          : 'bg-black/70 backdrop-blur-md animate-in fade-in z-50'
      }`}
    >
      <div
        className={`w-full md:max-w-xl max-h-[88vh] md:max-h-[85vh] rounded-t-3xl md:rounded-3xl flex flex-col text-white transition-all duration-200 ${
          activeSlider
            ? 'bg-transparent border-transparent shadow-none overflow-visible'
            : 'bg-zinc-950 border border-zinc-800 shadow-2xl overflow-hidden animate-in slide-in-from-bottom-6 duration-200'
        }`}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div
          className={`flex items-center justify-between px-6 py-4 border-b border-zinc-800 transition-opacity duration-150 ${
            activeSlider ? 'opacity-0 pointer-events-none' : 'opacity-100'
          }`}
        >
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
        <div
          className={`grid grid-cols-4 border-b border-zinc-800 px-1 md:px-6 bg-zinc-900/50 transition-opacity duration-150 ${
            activeSlider ? 'opacity-0 pointer-events-none' : 'opacity-100'
          }`}
        >
          <button
            type="button"
            onClick={() => setActiveTab('watermark')}
            className={`py-3 px-1 md:px-2 text-[10px] sm:text-[11px] md:text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-1 sm:gap-1.5 border-b-2 transition-all ${
              activeTab === 'watermark'
                ? 'border-white text-white'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">Logo</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('geotag')}
            className={`py-3 px-1 md:px-2 text-[10px] sm:text-[11px] md:text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-1 sm:gap-1.5 border-b-2 transition-all ${
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
            onClick={() => setActiveTab('camera')}
            className={`py-3 px-1 md:px-2 text-[10px] sm:text-[11px] md:text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-1 sm:gap-1.5 border-b-2 transition-all ${
              activeTab === 'camera'
                ? 'border-white text-white'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Camera className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">Kamera</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('about')}
            className={`py-3 px-1 md:px-2 text-[10px] sm:text-[11px] md:text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-1 sm:gap-1.5 border-b-2 transition-all ${
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
        <div className={`flex-1 overflow-y-auto p-6 space-y-6 ${activeSlider ? 'pb-36 sm:pb-28' : ''}`}>
          {activeTab === 'watermark' ? (
            <>
              {/* Upload Custom Logo */}
              <div
                className={`transition-opacity duration-150 ${
                  activeSlider ? 'opacity-0 pointer-events-none' : 'opacity-100'
                }`}
              >
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
              <div
                className={`transition-opacity duration-150 ${
                  activeSlider ? 'opacity-0 pointer-events-none' : 'opacity-100'
                }`}
              >
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
              </div>

              {/* Position Selector (9-Grid) */}
              {watermark.imageUrl && (
                <div
                  className={`transition-opacity duration-150 ${
                    activeSlider ? 'opacity-0 pointer-events-none' : 'opacity-100'
                  }`}
                >
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
                  <div
                    className={`transition-all duration-150 ${
                      activeSlider === 'watermark_size'
                        ? 'p-4 rounded-2xl bg-zinc-950/90 backdrop-blur-xl border border-white/50 shadow-2xl ring-2 ring-white/30 relative z-50'
                        : activeSlider !== null
                        ? 'opacity-0 pointer-events-none'
                        : ''
                    }`}
                  >
                    <div className="flex justify-between text-xs font-semibold text-zinc-400 mb-1.5">
                      <span className={activeSlider === 'watermark_size' ? 'text-white font-bold' : ''}>Ukuran Watermark</span>
                      <span className="text-zinc-200 font-mono">{watermark.sizePercent}% lebar foto</span>
                    </div>
                    <input
                      type="range"
                      min={8}
                      max={45}
                      value={watermark.sizePercent}
                      onPointerDown={() => setActiveSlider('watermark_size')}
                      onTouchStart={() => setActiveSlider('watermark_size')}
                      onMouseDown={() => setActiveSlider('watermark_size')}
                      onPointerUp={() => setActiveSlider(null)}
                      onTouchEnd={() => setActiveSlider(null)}
                      onMouseUp={() => setActiveSlider(null)}
                      onChange={e =>
                        onChangeWatermark({
                          ...watermark,
                          sizePercent: Number(e.target.value),
                        })
                      }
                      className="w-full accent-white h-1.5 bg-zinc-800 rounded-lg cursor-pointer"
                    />
                  </div>

                  <div
                    className={`transition-all duration-150 ${
                      activeSlider === 'watermark_opacity'
                        ? 'p-4 rounded-2xl bg-zinc-950/90 backdrop-blur-xl border border-white/50 shadow-2xl ring-2 ring-white/30 relative z-50'
                        : activeSlider !== null
                        ? 'opacity-0 pointer-events-none'
                        : ''
                    }`}
                  >
                    <div className="flex justify-between text-xs font-semibold text-zinc-400 mb-1.5">
                      <span className={activeSlider === 'watermark_opacity' ? 'text-white font-bold' : ''}>Transparansi (Opacity)</span>
                      <span className="text-zinc-200 font-mono">{Math.round(watermark.opacity * 100)}%</span>
                    </div>
                    <input
                      type="range"
                      min={0.15}
                      max={1.0}
                      step={0.05}
                      value={watermark.opacity}
                      onPointerDown={() => setActiveSlider('watermark_opacity')}
                      onTouchStart={() => setActiveSlider('watermark_opacity')}
                      onMouseDown={() => setActiveSlider('watermark_opacity')}
                      onPointerUp={() => setActiveSlider(null)}
                      onTouchEnd={() => setActiveSlider(null)}
                      onMouseUp={() => setActiveSlider(null)}
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
                  {
                    key: 'showMiniMap' as const,
                    title: 'Mini Map (Cuplikan Peta Lokasi)',
                    desc: 'Tampilkan peta jalan sekitar dan pin merah di samping geotag',
                  },
                ].map(item => {
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
          ) : activeTab === 'camera' ? (
            /* Camera Quality Tab */
            <div className="space-y-6 animate-in fade-in duration-200">
              {/* Sensor Hardware Detection Card */}
              <div
                className={`p-4 rounded-2xl bg-gradient-to-br from-emerald-950/30 via-zinc-900 to-zinc-950 border border-emerald-500/30 relative overflow-hidden transition-opacity duration-150 ${
                  activeSlider ? 'opacity-0 pointer-events-none' : 'opacity-100'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center shrink-0 text-emerald-400">
                    <Cpu className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                        Sensor Kamera Aktif
                      </span>
                      <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                        Live
                      </span>
                    </div>
                    <div className="text-sm font-semibold text-white mt-0.5 truncate">
                      {sensorInfo?.label || 'Kamera Perangkat HP'}
                    </div>
                    <div className="flex items-center gap-3 mt-2 text-xs text-zinc-300">
                      <div>
                        Maksimal:{' '}
                        <span className="font-semibold text-emerald-300">
                          {sensorInfo?.maxMegapixels
                            ? `${sensorInfo.maxMegapixels} MP`
                            : 'Otomatis'}
                        </span>
                        {sensorInfo?.maxWidth && sensorInfo?.maxHeight ? (
                          <span className="text-[11px] text-zinc-400 ml-1">
                            ({sensorInfo.maxWidth} × {sensorInfo.maxHeight})
                          </span>
                        ) : null}
                      </div>
                    </div>
                    <div className="mt-2 flex items-center gap-1.5 text-[11px] text-zinc-400">
                      <Zap className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      <span>
                        {sensorInfo?.supportsImageCapture
                          ? 'Mendukung ImageCapture (shutter sensor native jernih)'
                          : 'Fallback frame video resolusi tinggi'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Efek Visual & Filter Warna */}
              <div
                className={`pt-2 border-t border-zinc-800/80 transition-opacity duration-150 ${
                  activeSlider ? 'opacity-0 pointer-events-none' : 'opacity-100'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400">
                    Preset Efek & Nuansa Warna
                  </label>
                  <span className="text-[10px] text-emerald-400 font-medium">
                    Live WYSIWYG
                  </span>
                </div>
                <p className="text-[11px] text-zinc-400 mb-3">
                  Warna foto otomatis disesuaikan secara real-time di layar dan canvas hasil jepretan.
                </p>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {[
                    {
                      id: 'vivid' as CameraEffectPreset,
                      name: 'Cerah (Vivid)',
                      badge: 'Rekomendasi',
                      desc: 'Pop cerah, jernih & tajam',
                      ringColor: 'border-emerald-500 bg-emerald-950/20 shadow-emerald-500/10',
                      badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
                    },
                    {
                      id: 'normal' as CameraEffectPreset,
                      name: 'Normal (Alami)',
                      badge: 'Netral',
                      desc: 'Warna murni sensor',
                      ringColor: 'border-zinc-500 bg-zinc-800/50',
                      badgeColor: 'bg-zinc-800 text-zinc-400 border-zinc-700',
                    },
                    {
                      id: 'warm' as CameraEffectPreset,
                      name: 'Hangat (Warm)',
                      badge: 'Sunset Tone',
                      desc: 'Nuansa golden hour lembut',
                      ringColor: 'border-amber-500 bg-amber-950/20 shadow-amber-500/10',
                      badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
                    },
                    {
                      id: 'cool' as CameraEffectPreset,
                      name: 'Sejuk (Cool)',
                      badge: 'Fresh Blue',
                      desc: 'Nuansa segar kebiruan',
                      ringColor: 'border-sky-500 bg-sky-950/20 shadow-sky-500/10',
                      badgeColor: 'bg-sky-500/20 text-sky-300 border-sky-500/40',
                    },
                    {
                      id: 'hdr' as CameraEffectPreset,
                      name: 'HDR Boost',
                      badge: 'High Detail',
                      desc: 'Detail bayangan kaya & terang',
                      ringColor: 'border-purple-500 bg-purple-950/20 shadow-purple-500/10',
                      badgeColor: 'bg-purple-500/20 text-purple-300 border-purple-500/40',
                    },
                    {
                      id: 'mono' as CameraEffectPreset,
                      name: 'Monokrom (B&W)',
                      badge: 'Artistik',
                      desc: 'Hitam putih klasik elegan',
                      ringColor: 'border-zinc-400 bg-zinc-800/40',
                      badgeColor: 'bg-zinc-700/50 text-zinc-300 border-zinc-600',
                    },
                  ].map((presetItem) => {
                    const isSelected = cameraEffect.preset === presetItem.id
                    return (
                      <button
                        key={presetItem.id}
                        type="button"
                        onClick={() =>
                          onChangeCameraEffect({
                            ...cameraEffect,
                            preset: presetItem.id,
                          })
                        }
                        className={`p-2.5 rounded-xl border text-left transition-all flex flex-col justify-between ${
                          isSelected
                            ? `${presetItem.ringColor} ring-1 ring-emerald-500/50 shadow-md`
                            : 'border-zinc-800 bg-zinc-900/60 hover:bg-zinc-900 hover:border-zinc-700'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-1 mb-1">
                          <span className={`text-xs font-semibold ${isSelected ? 'text-white' : 'text-zinc-300'}`}>
                            {presetItem.name}
                          </span>
                          {presetItem.badge && (
                            <span className={`text-[9px] px-1.5 py-0.5 rounded-full border shrink-0 ${presetItem.badgeColor}`}>
                              {presetItem.badge}
                            </span>
                          )}
                        </div>
                        <p className="text-[10px] text-zinc-400 leading-tight">
                          {presetItem.desc}
                        </p>
                      </button>
                    )
                  })}
                </div>

                {/* Finetuning Sliders */}
                <div
                  className={`space-y-3 transition-all duration-150 ${
                    activeSlider
                      ? 'bg-transparent border-transparent p-0 mt-0'
                      : 'mt-4 p-3.5 rounded-2xl bg-zinc-900/80 border border-zinc-800/80'
                  }`}
                >
                  <div
                    className={`flex items-center justify-between transition-opacity duration-150 ${
                      activeSlider ? 'opacity-0 pointer-events-none' : 'opacity-100'
                    }`}
                  >
                    <div className="flex items-center gap-1.5">
                      <Sliders className="w-3.5 h-3.5 text-zinc-400" />
                      <span className="text-xs font-semibold text-zinc-300">
                        Koreksi Manual (Finetuning)
                      </span>
                    </div>
                    {(cameraEffect.finetune.brightness !== 0 ||
                      cameraEffect.finetune.contrast !== 0 ||
                      cameraEffect.finetune.saturation !== 0) && (
                      <button
                        type="button"
                        onClick={() =>
                          onChangeCameraEffect({
                            ...cameraEffect,
                            finetune: { brightness: 0, contrast: 0, saturation: 0 },
                          })
                        }
                        className="text-[10px] text-zinc-400 hover:text-white flex items-center gap-1 transition-colors px-2 py-0.5 rounded bg-zinc-800 border border-zinc-700"
                        title="Kembalikan finetuning ke 0%"
                      >
                        <RotateCcw className="w-2.5 h-2.5" />
                        Reset (0%)
                      </button>
                    )}
                  </div>

                  {/* Slider Kecerahan */}
                  <div
                    className={`space-y-1 transition-all duration-150 ${
                      activeSlider === 'camera_brightness'
                        ? 'p-4 rounded-2xl bg-zinc-950/90 backdrop-blur-xl border border-emerald-500/60 shadow-2xl ring-2 ring-emerald-400/50 relative z-50'
                        : activeSlider !== null
                        ? 'opacity-0 pointer-events-none'
                        : ''
                    }`}
                  >
                    <div className="flex justify-between items-center text-xs">
                      <span className={`flex items-center gap-1.5 text-[11px] ${activeSlider === 'camera_brightness' ? 'text-white font-bold' : 'text-zinc-400'}`}>
                        <Sun className="w-3.5 h-3.5 text-amber-400" />
                        Kecerahan
                      </span>
                      <span className="font-mono text-zinc-200 text-[11px]">
                        {cameraEffect.finetune.brightness > 0
                          ? `+${cameraEffect.finetune.brightness}%`
                          : `${cameraEffect.finetune.brightness}%`}
                      </span>
                    </div>
                    <input
                      type="range"
                      min="-20"
                      max="20"
                      step="1"
                      value={cameraEffect.finetune.brightness}
                      onPointerDown={() => setActiveSlider('camera_brightness')}
                      onTouchStart={() => setActiveSlider('camera_brightness')}
                      onMouseDown={() => setActiveSlider('camera_brightness')}
                      onPointerUp={() => setActiveSlider(null)}
                      onTouchEnd={() => setActiveSlider(null)}
                      onMouseUp={() => setActiveSlider(null)}
                      onChange={e =>
                        onChangeCameraEffect({
                          ...cameraEffect,
                          finetune: {
                            ...cameraEffect.finetune,
                            brightness: Number(e.target.value),
                          },
                        })
                      }
                      className="w-full accent-emerald-500 h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>

                  {/* Slider Kontras */}
                  <div
                    className={`space-y-1 transition-all duration-150 ${
                      activeSlider === 'camera_contrast'
                        ? 'p-4 rounded-2xl bg-zinc-950/90 backdrop-blur-xl border border-emerald-500/60 shadow-2xl ring-2 ring-emerald-400/50 relative z-50'
                        : activeSlider !== null
                        ? 'opacity-0 pointer-events-none'
                        : ''
                    }`}
                  >
                    <div className="flex justify-between items-center text-xs">
                      <span className={`flex items-center gap-1.5 text-[11px] ${activeSlider === 'camera_contrast' ? 'text-white font-bold' : 'text-zinc-400'}`}>
                        <Contrast className="w-3.5 h-3.5 text-sky-400" />
                        Kontras
                      </span>
                      <span className="font-mono text-zinc-200 text-[11px]">
                        {cameraEffect.finetune.contrast > 0
                          ? `+${cameraEffect.finetune.contrast}%`
                          : `${cameraEffect.finetune.contrast}%`}
                      </span>
                    </div>
                    <input
                      type="range"
                      min="-20"
                      max="20"
                      step="1"
                      value={cameraEffect.finetune.contrast}
                      onPointerDown={() => setActiveSlider('camera_contrast')}
                      onTouchStart={() => setActiveSlider('camera_contrast')}
                      onMouseDown={() => setActiveSlider('camera_contrast')}
                      onPointerUp={() => setActiveSlider(null)}
                      onTouchEnd={() => setActiveSlider(null)}
                      onMouseUp={() => setActiveSlider(null)}
                      onChange={e =>
                        onChangeCameraEffect({
                          ...cameraEffect,
                          finetune: {
                            ...cameraEffect.finetune,
                            contrast: Number(e.target.value),
                          },
                        })
                      }
                      className="w-full accent-emerald-500 h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>

                  {/* Slider Kejenuhan Warna */}
                  <div
                    className={`space-y-1 transition-all duration-150 ${
                      activeSlider === 'camera_saturation'
                        ? 'p-4 rounded-2xl bg-zinc-950/90 backdrop-blur-xl border border-emerald-500/60 shadow-2xl ring-2 ring-emerald-400/50 relative z-50'
                        : activeSlider !== null
                        ? 'opacity-0 pointer-events-none'
                        : ''
                    }`}
                  >
                    <div className="flex justify-between items-center text-xs">
                      <span className={`flex items-center gap-1.5 text-[11px] ${activeSlider === 'camera_saturation' ? 'text-white font-bold' : 'text-zinc-400'}`}>
                        <Palette className="w-3.5 h-3.5 text-rose-400" />
                        Kejenuhan Warna
                      </span>
                      <span className="font-mono text-zinc-200 text-[11px]">
                        {cameraEffect.finetune.saturation > 0
                          ? `+${cameraEffect.finetune.saturation}%`
                          : `${cameraEffect.finetune.saturation}%`}
                      </span>
                    </div>
                    <input
                      type="range"
                      min="-20"
                      max="20"
                      step="1"
                      value={cameraEffect.finetune.saturation}
                      onPointerDown={() => setActiveSlider('camera_saturation')}
                      onTouchStart={() => setActiveSlider('camera_saturation')}
                      onMouseDown={() => setActiveSlider('camera_saturation')}
                      onPointerUp={() => setActiveSlider(null)}
                      onTouchEnd={() => setActiveSlider(null)}
                      onMouseUp={() => setActiveSlider(null)}
                      onChange={e =>
                        onChangeCameraEffect({
                          ...cameraEffect,
                          finetune: {
                            ...cameraEffect.finetune,
                            saturation: Number(e.target.value),
                          },
                        })
                      }
                      className="w-full accent-emerald-500 h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>
                </div>
              </div>

              {/* Target Resolusi Sensor */}
              <div
                className={`transition-opacity duration-150 ${
                  activeSlider ? 'opacity-0 pointer-events-none' : 'opacity-100'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400">
                    Target Resolusi Sensor
                  </label>
                  <span className="text-[10px] text-emerald-400 font-medium">
                    Default: Auto
                  </span>
                </div>
                <div className="space-y-2">
                  {[
                    {
                      id: 'auto' as const,
                      title: 'Auto (Kualitas Tertinggi HP)',
                      badge: 'Default & Rekomendasi',
                      desc: 'Otomatis mendeteksi dan mengambil resolusi maksimal sensor tanpa kompromi.',
                      tag: sensorInfo?.maxMegapixels ? `Hingga ${sensorInfo.maxMegapixels} MP` : 'Maksimal',
                      supported: true,
                    },
                    {
                      id: '12mp' as const,
                      title: '12 MP / 4K Ultra HD',
                      badge: 'Kualitas Ultra',
                      desc: '~4000 × 3000 px • Sangat tajam untuk cetak dan zoom detail.',
                      tag: '12 MP',
                      supported: sensorInfo ? sensorInfo.supports12MP : true,
                    },
                    {
                      id: '8mp' as const,
                      title: '8 MP / Quad HD',
                      badge: 'Kualitas Tinggi',
                      desc: '~3264 × 2448 px • Seimbang antara ketajaman prima dan kecepatan.',
                      tag: '8 MP',
                      supported: true,
                    },
                    {
                      id: '2mp' as const,
                      title: '2 MP / Full HD 1080p',
                      badge: 'Standar Cepat',
                      desc: '1920 × 1080 px • Cepat diproses dan hemat kuota pengiriman.',
                      tag: '2 MP',
                      supported: true,
                    },
                    {
                      id: '1mp' as const,
                      title: '1 MP / HD 720p',
                      badge: 'Hemat Memori',
                      desc: '1280 × 720 px • Sangat ringan dan hemat penyimpanan memori HP.',
                      tag: '1 MP',
                      supported: true,
                    },
                  ].map((presetItem) => {
                    const isSelected = cameraQualityConfig.preset === presetItem.id
                    return (
                      <button
                        key={presetItem.id}
                        type="button"
                        onClick={() =>
                          onChangeCameraQualityConfig({
                            ...cameraQualityConfig,
                            preset: presetItem.id,
                          })
                        }
                        className={`w-full text-left p-3 rounded-xl border transition-all flex items-start gap-3 ${
                          isSelected
                            ? 'border-emerald-500 bg-emerald-950/20 shadow-md ring-1 ring-emerald-500/50'
                            : 'border-zinc-800 bg-zinc-900/60 hover:bg-zinc-900 hover:border-zinc-700'
                        } ${!presetItem.supported ? 'opacity-50' : ''}`}
                      >
                        <div
                          className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 mt-0.5 ${
                            isSelected
                              ? 'border-emerald-400 bg-emerald-500 text-black'
                              : 'border-zinc-600 bg-zinc-800'
                          }`}
                        >
                          {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-xs font-semibold text-white">
                              {presetItem.title}
                            </span>
                            <span
                              className={`text-[10px] px-2 py-0.5 rounded-full font-medium shrink-0 ${
                                isSelected
                                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                                  : 'bg-zinc-800 text-zinc-400'
                              }`}
                            >
                              {presetItem.tag}
                            </span>
                          </div>
                          <p className="text-[11px] text-zinc-400 mt-0.5">
                            {presetItem.desc}
                          </p>
                          {presetItem.id === 'auto' && (
                            <span className="inline-block mt-1 text-[10px] font-semibold text-emerald-400">
                              ★ {presetItem.badge}
                            </span>
                          )}
                          {!presetItem.supported && (
                            <span className="inline-block mt-1 text-[10px] text-amber-400">
                              ⚠️ Resolusi ini mungkin melebihi kemampuan sensor saat ini
                            </span>
                          )}
                        </div>
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Kompresi JPEG */}
              <div
                className={`pt-2 border-t border-zinc-800/80 transition-opacity duration-150 ${
                  activeSlider ? 'opacity-0 pointer-events-none' : 'opacity-100'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400">
                    Kualitas Kompresi JPEG
                  </label>
                  <span className="text-[10px] text-zinc-500">
                    Canvas Export
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'ultra' as const, label: 'Ultra (98%)', sub: 'Kualitas Terbaik' },
                    { id: 'high' as const, label: 'Tinggi (95%)', sub: 'Standar Optimal' },
                    { id: 'medium' as const, label: 'Sedang (85%)', sub: 'Hemat Ukuran' },
                  ].map((tier) => {
                    const isSelected = cameraQualityConfig.jpegTier === tier.id
                    return (
                      <button
                        key={tier.id}
                        type="button"
                        onClick={() =>
                          onChangeCameraQualityConfig({
                            ...cameraQualityConfig,
                            jpegTier: tier.id,
                          })
                        }
                        className={`p-2.5 rounded-xl border flex flex-col items-center justify-center transition-all ${
                          isSelected
                            ? 'border-emerald-500 bg-emerald-950/20 text-white font-semibold ring-1 ring-emerald-500/40'
                            : 'border-zinc-800 bg-zinc-900/60 text-zinc-400 hover:text-white hover:border-zinc-700'
                        }`}
                      >
                        <span className="text-xs">{tier.label}</span>
                        <span className="text-[10px] text-zinc-500 mt-0.5">{tier.sub}</span>
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Mode Penghalus Derau (Denoise / Anti Pasir Halus) */}
              <div
                className={`pt-2 border-t border-zinc-800/80 transition-opacity duration-150 ${
                  activeSlider ? 'opacity-0 pointer-events-none' : 'opacity-100'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400">
                    Penghalus Pasir Derau (Denoise)
                  </label>
                  <span className="text-[10px] text-emerald-400 font-medium">
                    Anti Pasir Halus
                  </span>
                </div>
                <p className="text-[11px] text-zinc-400 mb-2.5">
                  Menghilangkan butiran pasir semut TV (sensor grain) agar foto terlihat mulus dan bersih saat di-zoom.
                </p>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    {
                      id: 'smooth' as const,
                      label: 'Halus',
                      sub: 'Rekomendasi',
                      desc: 'Mulus alami',
                    },
                    {
                      id: 'extra' as const,
                      label: 'Maksimal',
                      sub: 'Minim Cahaya',
                      desc: 'Extra de-noise',
                    },
                    {
                      id: 'natural' as const,
                      label: 'Alami (Off)',
                      sub: 'Raw Sensor',
                      desc: 'Tanpa filter',
                    },
                  ].map((mode) => {
                    const isSelected = (cameraQualityConfig.denoiseMode || 'smooth') === mode.id
                    return (
                      <button
                        key={mode.id}
                        type="button"
                        onClick={() =>
                          onChangeCameraQualityConfig({
                            ...cameraQualityConfig,
                            denoiseMode: mode.id,
                          })
                        }
                        className={`p-2.5 rounded-xl border flex flex-col items-center justify-center transition-all ${
                          isSelected
                            ? 'border-emerald-500 bg-emerald-950/20 text-white font-semibold ring-1 ring-emerald-500/40'
                            : 'border-zinc-800 bg-zinc-900/60 text-zinc-400 hover:text-white hover:border-zinc-700'
                        }`}
                      >
                        <span className="text-xs">{mode.label}</span>
                        <span className="text-[10px] text-emerald-400/90 font-medium mt-0.5">
                          {mode.sub}
                        </span>
                        <span className="text-[9px] text-zinc-500 mt-0.5">
                          {mode.desc}
                        </span>
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Penjelasan Ketajaman */}
              <div
                className={`p-3 rounded-xl bg-zinc-900/80 border border-zinc-800 text-[11px] text-zinc-400 space-y-1 transition-opacity duration-150 ${
                  activeSlider ? 'opacity-0 pointer-events-none' : 'opacity-100'
                }`}
              >
                <div className="font-semibold text-zinc-300 flex items-center gap-1.5">
                  <Maximize2 className="w-3.5 h-3.5 text-emerald-400" />
                  Mengapa foto di aplikasi ini kini sejernih kamera bawaan?
                </div>
                <p>
                  Aplikasi kini memanfaatkan <strong>ImageCapture hardware shutter</strong> untuk mengambil frame langsung dari sensor kamera dalam resolusi penuh, tanpa kompresi visual interpolasi video.
                </p>
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
        <div
          className={`${
            activeSlider ? 'hidden' : 'flex'
          } p-4 border-t border-zinc-800 bg-zinc-950 items-center justify-between gap-3 transition-opacity duration-150`}
        >
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
