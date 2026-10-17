import React from 'react'
import { Upload, Trash2, Sparkles, Eye, RefreshCw } from 'lucide-react'
import type { WatermarkConfig, WatermarkPosition, ProfileConfig } from '../../types/camera'
import { optimizeWatermarkImage } from '../../utils/storage'
import { ProfileSection } from './watermark/ProfileSection'
import { CyberGlassOrb } from './CyberGlassOrb'

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
        className={`relative rounded-[22px] border border-cyan-400/35 transition-all duration-150 overflow-hidden mt-3.5 sm:mt-4 ${
          activeSlider === 'watermark_size' || activeSlider === 'watermark_opacity'
            ? 'border-transparent bg-transparent shadow-none p-0 overflow-visible space-y-0'
            : activeSlider
            ? 'hidden'
            : 'bg-[#03152e]/35 backdrop-blur-xl shadow-[0_10px_35px_rgba(0,0,0,0.5),0_0_20px_rgba(6,182,212,0.15),inset_0_1.5px_2px_rgba(255,255,255,0.5)] text-white'
        }`}
      >
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

        {/* Header Section Watermark Logo */}
        <div
          className={`w-full items-center justify-between px-3.5 sm:px-4 py-2.5 sm:py-3 border-b border-cyan-500/20 bg-[#020b18]/40 backdrop-blur-md rounded-t-[21px] transition-opacity duration-150 relative z-10 ${
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
              <span className="text-slate-200 text-[13.5px] sm:text-sm font-medium tracking-wide">
                Watermark
              </span>
              <span className="text-white text-[13.5px] sm:text-sm font-extrabold tracking-wide truncate drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)]">
                Logo
              </span>
            </div>
          </div>

          {watermark.imageUrl && (
            <span className="px-2.5 py-0.5 rounded-full bg-[#030917]/90 border border-cyan-400/60 shadow-[inset_0_1px_1px_rgba(255,255,255,0.3),0_0_10px_rgba(6,182,212,0.4)] text-[10.5px] font-mono font-bold text-cyan-300 drop-shadow-[0_0_6px_rgba(6,182,212,0.8)] shrink-0">
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
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                <CyberGlassOrb icon={Upload} size="xs" variant="cyan" />
                <span>Logo Watermark</span>
              </label>
              {onTriggerPreview && (
                <button
                  type="button"
                  onClick={() => onTriggerPreview?.('watermark_position')}
                  className="flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold text-cyan-200 hover:text-white bg-gradient-to-r from-[#020e1f]/90 via-[#051c36]/85 to-[#020e1f]/90 border border-cyan-400/60 shadow-[0_0_10px_rgba(6,182,212,0.3),inset_0_1px_1.5px_rgba(255,255,255,0.6)] transition-all active:scale-95 cursor-pointer relative overflow-hidden group"
                  title="Lihat Pratinjau Langsung di Kamera"
                >
                  <div className="absolute top-0 inset-x-2 h-[1px] bg-white/70 pointer-events-none" />
                  <Eye className="w-3.5 h-3.5 text-cyan-400 drop-shadow-[0_0_4px_rgba(34,211,238,0.8)]" />
                  <span>Preview</span>
                </button>
              )}
            </div>

            {watermark.imageUrl ? (
              /* Card Saat Logo Sudah Terpasang */
              <div className="p-3 sm:p-3.5 rounded-2xl bg-[#020b18]/45 backdrop-blur-md border border-cyan-500/25 flex items-center justify-between gap-3 shadow-inner">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-12 h-12 rounded-xl bg-[#020717]/50 border border-cyan-400/40 flex items-center justify-center p-1.5 shrink-0 overflow-hidden shadow-[0_0_10px_rgba(6,182,212,0.25)]">
                    <img
                      src={watermark.imageUrl}
                      alt="Logo Aktif"
                      className="max-w-full max-h-full object-contain"
                    />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-white truncate">Logo Terpasang</p>
                    <p className="text-[11px] text-slate-400 truncate">Siap dicetak pada hasil foto</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <label className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-cyan-400/60 bg-gradient-to-r from-[#020e1f]/95 via-[#051c36]/90 to-[#020e1f]/95 text-xs font-bold text-cyan-200 hover:text-white cursor-pointer transition-all active:scale-95 shadow-[0_0_10px_rgba(6,182,212,0.3),inset_0_1px_1px_rgba(255,255,255,0.6)] relative overflow-hidden">
                    <div className="absolute top-0 inset-x-2 h-[1px] bg-white/60 pointer-events-none" />
                    <RefreshCw className="w-3.5 h-3.5 text-cyan-400 drop-shadow-[0_0_4px_rgba(34,211,238,0.8)]" />
                    <span>Ganti</span>
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
                    className="w-8.5 h-8.5 rounded-full bg-gradient-to-b from-[#3d0818]/95 to-[#160208]/95 border-2 border-rose-500 shadow-[0_0_14px_rgba(244,63,94,0.7),inset_0_1px_1.5px_rgba(255,255,255,0.7)] flex items-center justify-center cursor-pointer active:scale-90 transition-all text-rose-300 hover:text-white relative overflow-hidden"
                    title="Hapus Logo"
                  >
                    <div className="absolute top-0.5 inset-x-1.5 h-1.5 rounded-full bg-white/40 blur-[0.5px] pointer-events-none" />
                    <Trash2 className="w-4 h-4 drop-shadow-[0_0_6px_rgba(244,63,94,0.9)]" />
                  </button>
                </div>
              </div>
            ) : (
              /* Dropzone Saat Belum Ada Logo */
              <label className="flex flex-col items-center justify-center gap-2 p-5 rounded-2xl border-2 border-dashed border-cyan-400/40 hover:border-cyan-300 bg-[#020b18]/40 hover:bg-[#03152e]/50 backdrop-blur-md cursor-pointer transition-all group shadow-inner">
                <div className="w-10 h-10 rounded-full bg-gradient-to-b from-[#092244]/90 to-[#020914]/95 border border-cyan-400/80 shadow-[0_0_14px_rgba(6,182,212,0.65),inset_0_1.5px_3px_rgba(255,255,255,0.8)] flex items-center justify-center text-cyan-400 group-hover:scale-105 transition-transform">
                  <Upload className="w-5 h-5 drop-shadow-[0_0_6px_rgba(6,182,212,0.8)]" />
                </div>
                <div className="text-center">
                  <span className="text-xs font-bold text-slate-200 block group-hover:text-cyan-300 transition-colors">
                    Pilih Logo (PNG / JPG / SVG)
                  </span>
                  <span className="text-[11px] text-slate-400 mt-0.5 block">
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
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                  <CyberGlassOrb icon={Sparkles} size="xs" variant="cyan" />
                  <span>Posisi Watermark di Foto</span>
                </label>
                {onTriggerPreview && (
                  <button
                    type="button"
                    onClick={() => onTriggerPreview?.('watermark_position')}
                    className="flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold text-cyan-200 hover:text-white bg-gradient-to-r from-[#020e1f]/90 via-[#051c36]/85 to-[#020e1f]/90 border border-cyan-400/60 shadow-[0_0_10px_rgba(6,182,212,0.3),inset_0_1px_1.5px_rgba(255,255,255,0.6)] transition-all active:scale-95 cursor-pointer relative overflow-hidden group"
                    title="Lihat Pratinjau Langsung di Kamera"
                  >
                    <div className="absolute top-0 inset-x-2 h-[1px] bg-white/70 pointer-events-none" />
                    <Eye className="w-3.5 h-3.5 text-cyan-400 drop-shadow-[0_0_4px_rgba(34,211,238,0.8)]" />
                    <span>Preview</span>
                  </button>
                )}
              </div>
              <div className="grid grid-cols-3 gap-1.5 p-3 bg-[#020b18]/45 backdrop-blur-md rounded-2xl border border-cyan-500/25">
                {WATERMARK_GRID_POSITIONS.map(pos => {
                  const active = watermark.position === pos.id
                  return (
                    <button
                      key={pos.id}
                      type="button"
                      onClick={() =>
                        onChangeWatermark({ ...watermark, position: pos.id })
                      }
                      className={`py-2 px-1 rounded-xl text-[11px] sm:text-xs font-medium transition-all flex items-center justify-center gap-1 truncate relative overflow-hidden border ${
                        active
                          ? 'bg-gradient-to-r from-cyan-400 via-sky-400 to-blue-500 text-[#020b18] font-black border-cyan-200 shadow-[0_0_12px_rgba(6,182,212,0.8),inset_0_1px_1.5px_rgba(255,255,255,0.9)]'
                          : 'bg-[#020717]/40 text-slate-300 hover:text-white border-cyan-900/60 hover:border-cyan-500/50'
                      }`}
                    >
                      <span className={`font-bold shrink-0 ${active ? 'text-[#020b18]' : 'text-cyan-400'}`}>
                        {pos.icon}
                      </span>
                      <span className="truncate">{pos.label}</span>
                    </button>
                  )
                })}
              </div>
            </div>
          )}

          {/* Sliders: Size and Opacity */}
          {watermark.imageUrl && (
            <div className={`space-y-3.5 pt-1 ${activeSlider ? 'space-y-0 pt-0' : ''}`}>
              {/* Ukuran Watermark Slider (Clean Capsule Slider) */}
              <div
                className={`transition-all duration-150 ${
                  activeSlider === 'watermark_size'
                    ? 'p-4 rounded-2xl bg-[#020717]/95 backdrop-blur-2xl border border-cyan-400 shadow-[0_0_25px_rgba(6,182,212,0.6)] relative z-50'
                    : activeSlider !== null
                    ? 'hidden'
                    : ''
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <span
                      className={`text-xs font-semibold uppercase tracking-wider ${
                        activeSlider === 'watermark_size' ? 'text-white font-bold' : 'text-slate-300'
                      }`}
                    >
                      Ukuran Watermark
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[11px] font-mono font-bold bg-[#030917]/90 text-cyan-300 border border-cyan-400/50 shadow-[0_0_8px_rgba(6,182,212,0.4)] shrink-0">
                      {watermark.sizePercent}% lebar
                    </span>
                  </div>
                  {onTriggerPreview && activeSlider !== 'watermark_size' && (
                    <button
                      type="button"
                      onClick={() => onTriggerPreview?.('watermark_size')}
                      className="flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold text-cyan-200 hover:text-white bg-gradient-to-r from-[#020e1f]/90 via-[#051c36]/85 to-[#020e1f]/90 border border-cyan-400/60 shadow-[0_0_10px_rgba(6,182,212,0.3),inset_0_1px_1.5px_rgba(255,255,255,0.6)] transition-all active:scale-95 cursor-pointer relative overflow-hidden group shrink-0"
                      title="Lihat Pratinjau Langsung di Kamera"
                    >
                      <div className="absolute top-0 inset-x-2 h-[1px] bg-white/70 pointer-events-none" />
                      <Eye className="w-3.5 h-3.5 text-cyan-400 drop-shadow-[0_0_4px_rgba(34,211,238,0.8)]" />
                      <span>Preview</span>
                    </button>
                  )}
                </div>

                {/* Slider Capsule Track */}
                <div className="relative w-full h-10 rounded-full bg-gradient-to-r from-[#020e1f]/90 via-[#051c36]/85 to-[#020e1f]/90 border border-cyan-400/60 shadow-[0_0_12px_rgba(6,182,212,0.35),inset_0_1px_2px_rgba(255,255,255,0.7),inset_0_-1px_2px_rgba(0,0,0,0.8)] px-4 flex items-center gap-3 overflow-hidden">
                  <div className="absolute top-0 inset-x-5 h-[1px] bg-white/70 shadow-[0_0_4px_#fff] pointer-events-none" />
                  <div className="flex-1 min-w-0 flex items-center">
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
                      className="hud-slider cursor-pointer w-full"
                    />
                  </div>
                  <span className="font-mono text-cyan-300 font-bold text-xs shrink-0 drop-shadow-[0_0_6px_rgba(6,182,212,0.9)]">
                    {watermark.sizePercent}%
                  </span>
                </div>
              </div>

              {/* Opacity Slider (Clean Capsule Slider) */}
              <div
                className={`transition-all duration-150 ${
                  activeSlider === 'watermark_opacity'
                    ? 'p-4 rounded-2xl bg-[#020717]/95 backdrop-blur-2xl border border-cyan-400 shadow-[0_0_25px_rgba(6,182,212,0.6)] relative z-50'
                    : activeSlider !== null
                    ? 'hidden'
                    : ''
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <span
                      className={`text-xs font-semibold uppercase tracking-wider ${
                        activeSlider === 'watermark_opacity' ? 'text-white font-bold' : 'text-slate-300'
                      }`}
                    >
                      Transparansi (Opacity)
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[11px] font-mono font-bold bg-[#030917]/90 text-cyan-300 border border-cyan-400/50 shadow-[0_0_8px_rgba(6,182,212,0.4)] shrink-0">
                      {Math.round(watermark.opacity * 100)}%
                    </span>
                  </div>
                  {onTriggerPreview && activeSlider !== 'watermark_opacity' && (
                    <button
                      type="button"
                      onClick={() => onTriggerPreview?.('watermark_opacity')}
                      className="flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold text-cyan-200 hover:text-white bg-gradient-to-r from-[#020e1f]/90 via-[#051c36]/85 to-[#020e1f]/90 border border-cyan-400/60 shadow-[0_0_10px_rgba(6,182,212,0.3),inset_0_1px_1.5px_rgba(255,255,255,0.6)] transition-all active:scale-95 cursor-pointer relative overflow-hidden group shrink-0"
                      title="Lihat Pratinjau Langsung di Kamera"
                    >
                      <div className="absolute top-0 inset-x-2 h-[1px] bg-white/70 pointer-events-none" />
                      <Eye className="w-3.5 h-3.5 text-cyan-400 drop-shadow-[0_0_4px_rgba(34,211,238,0.8)]" />
                      <span>Preview</span>
                    </button>
                  )}
                </div>

                {/* Slider Capsule Track */}
                <div className="relative w-full h-10 rounded-full bg-gradient-to-r from-[#020e1f]/90 via-[#051c36]/85 to-[#020e1f]/90 border border-cyan-400/60 shadow-[0_0_12px_rgba(6,182,212,0.35),inset_0_1px_2px_rgba(255,255,255,0.7),inset_0_-1px_2px_rgba(0,0,0,0.8)] px-4 flex items-center gap-3 overflow-hidden">
                  <div className="absolute top-0 inset-x-5 h-[1px] bg-white/70 shadow-[0_0_4px_#fff] pointer-events-none" />
                  <div className="flex-1 min-w-0 flex items-center">
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
                      className="hud-slider cursor-pointer w-full"
                    />
                  </div>
                  <span className="font-mono text-cyan-300 font-bold text-xs shrink-0 drop-shadow-[0_0_6px_rgba(6,182,212,0.9)]">
                    {Math.round(watermark.opacity * 100)}%
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
