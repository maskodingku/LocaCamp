import React from 'react'
import { Upload, Trash2, Sparkles, Eye, RefreshCw } from 'lucide-react'
import type { WatermarkConfig, WatermarkPosition, ProfileConfig } from '../../types/camera'
import { optimizeWatermarkImage } from '../../utils/storage'
import { ProfileSection } from './watermark/ProfileSection'
import { CyberGlassOrb } from './CyberGlassOrb'
import { SmartFloatingSlider } from './dock/SmartFloatingSlider'

interface WatermarkTabProps {
  watermark: WatermarkConfig
  onChangeWatermark: (cfg: WatermarkConfig) => void
  profile: ProfileConfig
  onChangeProfile: (cfg: ProfileConfig) => void
  activeSlider: string | null
  setActiveSlider: (slider: string | null) => void
  onTriggerPreview?: (inputId: string) => void
}

const WATERMARK_GRID_POSITIONS: { id: WatermarkPosition; label: string; icon: string }[] = [
  { id: 'top-left', label: 'Atas Kiri', icon: '↖' },
  { id: 'top-center', label: 'Atas Tengah', icon: '↑' },
  { id: 'top-right', label: 'Atas Kanan', icon: '↗' },
  { id: 'center-left', label: 'Tengah Kiri', icon: '←' },
  { id: 'center', label: 'Tengah', icon: '•' },
  { id: 'center-right', label: 'Tengah Kanan', icon: '→' },
  { id: 'bottom-left', label: 'Bawah Kiri', icon: '↙' },
  { id: 'bottom-center', label: 'Bawah Tengah', icon: '↓' },
  { id: 'bottom-right', label: 'Bawah Kanan', icon: '↘' },
]

export const WatermarkTab: React.FC<WatermarkTabProps> = ({
  watermark,
  onChangeWatermark,
  profile,
  onChangeProfile,
  activeSlider,
  setActiveSlider,
  onTriggerPreview,
}) => {
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

  return (
    <>
      {/* SECTION 1: PROFIL PENGGUNA (PALING ATAS) */}
      <ProfileSection
        profile={profile}
        onChangeProfile={onChangeProfile}
        activeSlider={activeSlider}
        setActiveSlider={setActiveSlider}
        onTriggerPreview={onTriggerPreview}
      />

      {/* SECTION 2: WATERMARK LOGO */}
      <div
        className={`relative rounded-[22px] transition-all duration-150 overflow-hidden mt-3.5 sm:mt-4 ${
          activeSlider
            ? 'hidden'
            : 'border border-white/20 bg-[#03152e]/90 shadow-[0_12px_32px_rgba(0,0,0,0.6),inset_0_1.5px_2px_rgba(255,255,255,0.85)] text-white'
        }`}
      >
        {/* Header Section Watermark Logo */}
        <div
          className={`w-full items-center justify-between px-3.5 sm:px-4 py-2.5 sm:py-3 border-b border-white/15 bg-[#020b18]/90 rounded-t-[21px] transition-opacity duration-150 relative z-10 ${
            activeSlider ? 'hidden' : 'flex'
          }`}
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <CyberGlassOrb
              icon={Sparkles}
              size="md"
              variant="cyan"
            />
            <div className="h-4.5 w-[1.5px] bg-cyan-400/40 shrink-0" />
            <div className="flex items-center gap-1.5 min-w-0">
              <span className="text-slate-100 text-[13.5px] sm:text-sm font-bold tracking-wide drop-shadow-[0_1px_2px_rgba(0,0,0,0.95)] drop-shadow-[0_0_8px_rgba(255,255,255,0.35)]">
                Watermark
              </span>
              <span className="text-white text-[13.5px] sm:text-sm font-black tracking-wide truncate drop-shadow-[0_1px_3px_rgba(0,0,0,0.95)] drop-shadow-[0_0_8px_rgba(34,211,238,0.7)]">
                Logo
              </span>
            </div>
          </div>

          {watermark.imageUrl && (
            <span className="px-2.5 py-0.5 rounded-full bg-[#020e1f] border border-white/30 shadow-[0_2px_6px_rgba(0,0,0,0.5),inset_0_1px_1.5px_rgba(255,255,255,0.5)] text-[10.5px] font-mono font-black text-cyan-300 drop-shadow-[0_0_6px_rgba(34,211,238,0.75)] shrink-0">
              TERPASANG
            </span>
          )}
        </div>

        {/* Body Konten Watermark */}
        <div className={`p-3.5 sm:p-4 pt-3 sm:pt-3.5 space-y-3.5 ${activeSlider ? 'space-y-0 p-0' : ''}`}>
          {/* Upload & Preview Logo Aktif */}
          <div
            className={`transition-opacity duration-150 ${
              activeSlider ? 'hidden' : 'block'
            }`}
          >
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-2 drop-shadow-[0_1px_2px_rgba(0,0,0,0.95)] drop-shadow-[0_0_6px_rgba(255,255,255,0.35)]">
                <CyberGlassOrb icon={Upload} size="xs" variant="cyan" />
                <span>Logo Watermark</span>
              </label>
              {onTriggerPreview && (
                <button
                  type="button"
                  onClick={() => onTriggerPreview?.('watermark_position')}
                  className="flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold text-white bg-gradient-to-r from-[#020e1f]/95 via-[#051c36]/90 to-[#020e1f]/95 border border-white/35 shadow-[0_4px_10px_rgba(0,0,0,0.5),inset_0_1.5px_2px_rgba(255,255,255,0.85)] hover:border-white/60 transition-all active:scale-95 cursor-pointer relative overflow-hidden group"
                  title="Lihat Pratinjau Langsung di Kamera"
                >
                  <div className="absolute top-0 inset-x-2 h-[1px] bg-gradient-to-r from-transparent via-cyan-100/80 to-transparent pointer-events-none" />
                  <Eye className="w-3.5 h-3.5 text-cyan-300 drop-shadow-[0_0_5px_rgba(34,211,238,0.75)]" />
                  <span className="drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)]">Preview</span>
                </button>
              )}
            </div>

            {watermark.imageUrl ? (
              /* Card Saat Logo Sudah Terpasang */
              <div className="p-3 sm:p-3.5 rounded-2xl bg-[#020b18]/85 border border-white/20 flex items-center justify-between gap-3 shadow-[0_4px_14px_rgba(0,0,0,0.5)]">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-12 h-12 rounded-xl bg-[#020717]/80 border border-white/30 flex items-center justify-center p-1.5 shrink-0 overflow-hidden shadow-[0_2px_8px_rgba(0,0,0,0.5)]">
                    <img
                      src={watermark.imageUrl}
                      alt="Logo Aktif"
                      className="max-w-full max-h-full object-contain"
                    />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-white truncate drop-shadow-[0_1px_2px_rgba(0,0,0,0.95)] drop-shadow-[0_0_6px_rgba(255,255,255,0.3)]">Logo Terpasang</p>
                    <p className="text-[11px] text-slate-200 font-medium truncate drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)]">Siap dicetak pada hasil foto</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <label className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-white/35 bg-gradient-to-r from-[#020e1f]/95 via-[#051c36]/90 to-[#020e1f]/95 text-xs font-bold text-white hover:border-white/60 cursor-pointer transition-all active:scale-95 shadow-[0_4px_10px_rgba(0,0,0,0.5),inset_0_1.5px_2px_rgba(255,255,255,0.85)] relative overflow-hidden">
                    <div className="absolute top-0 inset-x-2 h-[1px] bg-gradient-to-r from-transparent via-cyan-100/80 to-transparent pointer-events-none" />
                    <RefreshCw className="w-3.5 h-3.5 text-cyan-300 drop-shadow-[0_0_5px_rgba(34,211,238,0.75)]" />
                    <span className="drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)]">Ganti</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleFileUpload}
                    />
                  </label>
                  <button
                    type="button"
                    onClick={() => onChangeWatermark({ ...watermark, imageUrl: '' })}
                    className="w-8.5 h-8.5 rounded-full bg-gradient-to-b from-[#3d0818]/95 to-[#160208]/95 border-2 border-rose-500 shadow-[0_4px_12px_rgba(0,0,0,0.6),inset_0_1.5px_2px_rgba(255,255,255,0.85)] flex items-center justify-center cursor-pointer active:scale-90 transition-all text-white relative overflow-hidden"
                    title="Hapus Logo"
                  >
                    <div className="absolute top-0.5 inset-x-1.5 h-1.5 rounded-full bg-white/40 blur-[0.5px] pointer-events-none" />
                    <Trash2 className="w-4 h-4 drop-shadow-[0_0_6px_rgba(244,63,94,0.85)]" />
                  </button>
                </div>
              </div>
            ) : (
              /* Dropzone Saat Belum Ada Logo */
              <label className="flex flex-col items-center justify-center gap-2 p-5 rounded-2xl border-2 border-dashed border-white/30 hover:border-white/60 bg-[#020b18]/75 hover:bg-[#03152e]/85 cursor-pointer transition-all group shadow-[0_4px_14px_rgba(0,0,0,0.5)]">
                <div className="w-10 h-10 rounded-full bg-gradient-to-b from-[#092244]/90 to-[#020914]/95 border border-white/50 shadow-[0_4px_12px_rgba(0,0,0,0.5),inset_0_1.5px_2px_rgba(255,255,255,0.85)] flex items-center justify-center text-cyan-300 group-hover:scale-105 transition-transform">
                  <Upload className="w-5 h-5 drop-shadow-[0_0_6px_rgba(34,211,238,0.75)]" />
                </div>
                <div className="text-center">
                  <span className="text-xs font-bold text-white block group-hover:text-cyan-200 transition-colors drop-shadow-[0_1px_2px_rgba(0,0,0,0.95)] drop-shadow-[0_0_6px_rgba(255,255,255,0.35)]">
                    Pilih Logo (PNG / JPG / SVG)
                  </span>
                  <span className="text-[11px] text-slate-200 font-medium mt-0.5 block drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)]">
                    Disarankan format PNG transparan agar rapi pada foto
                  </span>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileUpload}
                />
              </label>
            )}
          </div>

          {/* Position Selector (9-Grid) */}
          {watermark.imageUrl && (
            <div
              className={`transition-opacity duration-150 ${
                activeSlider ? 'hidden' : 'block'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-2 drop-shadow-[0_1px_2px_rgba(0,0,0,0.95)] drop-shadow-[0_0_6px_rgba(255,255,255,0.35)]">
                  <CyberGlassOrb icon={Sparkles} size="xs" variant="cyan" />
                  <span>Posisi Watermark di Foto</span>
                </label>
                {onTriggerPreview && (
                  <button
                    type="button"
                    onClick={() => onTriggerPreview?.('watermark_position')}
                    className="flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold text-white bg-gradient-to-r from-[#020e1f]/95 via-[#051c36]/90 to-[#020e1f]/95 border border-white/35 shadow-[0_4px_10px_rgba(0,0,0,0.5),inset_0_1.5px_2px_rgba(255,255,255,0.85)] hover:border-white/60 transition-all active:scale-95 cursor-pointer relative overflow-hidden group"
                    title="Lihat Pratinjau Langsung di Kamera"
                  >
                    <div className="absolute top-0 inset-x-2 h-[1px] bg-gradient-to-r from-transparent via-cyan-100/80 to-transparent pointer-events-none" />
                    <Eye className="w-3.5 h-3.5 text-cyan-300 drop-shadow-[0_0_5px_rgba(34,211,238,0.75)]" />
                    <span className="drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)]">Preview</span>
                  </button>
                )}
              </div>
              <div className="grid grid-cols-3 gap-1.5 p-3 bg-[#020b18]/85 rounded-2xl border border-white/20 shadow-[0_4px_14px_rgba(0,0,0,0.5)]">
                {WATERMARK_GRID_POSITIONS.map(pos => {
                  const active = watermark.position === pos.id
                  return (
                    <button
                      key={pos.id}
                      type="button"
                      onClick={() =>
                        onChangeWatermark({ ...watermark, position: pos.id })
                      }
                      className={`py-2 px-1 rounded-xl text-[11px] sm:text-xs font-bold transition-all flex items-center justify-center gap-1 truncate relative overflow-hidden border ${
                        active
                          ? 'bg-gradient-to-r from-cyan-400 via-sky-400 to-blue-500 text-black font-black border border-white/90 shadow-[0_2px_8px_rgba(0,0,0,0.6),inset_0_1.5px_2px_rgba(255,255,255,0.95)]'
                          : 'bg-[#020717]/60 text-slate-200 hover:text-white border-white/10 hover:border-white/30'
                      }`}
                    >
                      <span className={`font-black shrink-0 ${active ? 'text-black drop-shadow-[0_1px_1px_rgba(255,255,255,0.6)]' : 'text-cyan-300 drop-shadow-[0_0_5px_rgba(34,211,238,0.65)]'}`}>
                        {pos.icon}
                      </span>
                      <span className={`truncate ${active ? 'drop-shadow-[0_1px_1px_rgba(255,255,255,0.6)]' : 'drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)]'}`}>{pos.label}</span>
                    </button>
                  )
                })}
              </div>
            </div>
          )}

          {/* Sliders Cerdas: Size and Opacity (Otomatis Menghindari Watermark di Kamera) */}
          {watermark.imageUrl && (
            <div className={`space-y-3 pt-1 ${activeSlider ? 'space-y-0 pt-0' : ''}`}>
              <SmartFloatingSlider
                id="watermark_size"
                label="Ukuran Watermark"
                icon={Sparkles}
                iconColorClass="text-cyan-300"
                value={watermark.sizePercent}
                valueDisplay={`${watermark.sizePercent}% lebar`}
                min={8}
                max={45}
                step={1}
                onChange={val => onChangeWatermark({ ...watermark, sizePercent: val })}
                activeSlider={activeSlider}
                setActiveSlider={setActiveSlider}
                targetType="watermark"
                onTriggerPreview={onTriggerPreview}
              />

              <SmartFloatingSlider
                id="watermark_opacity"
                label="Transparansi (Opacity)"
                icon={Sparkles}
                iconColorClass="text-cyan-300"
                value={watermark.opacity}
                valueDisplay={`${Math.round(watermark.opacity * 100)}%`}
                min={0.15}
                max={1.0}
                step={0.05}
                onChange={val => onChangeWatermark({ ...watermark, opacity: val })}
                activeSlider={activeSlider}
                setActiveSlider={setActiveSlider}
                targetType="watermark"
                onTriggerPreview={onTriggerPreview}
              />
            </div>
          )}
        </div>
      </div>
    </>
  )
}
