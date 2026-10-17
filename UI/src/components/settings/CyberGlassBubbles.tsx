import React from 'react'

/**
 * CyberGlassBubbles:
 * Menghadirkan gelembung-gelembung bola kaca cair 3D (Floating 3D Cyber Glass Orbs)
 * dengan pantulan cahaya specular dome, rim light neon cyan, dan refraksi kristal
 * yang mengambang nyata di latar belakang lempengan kaca pengaturan.
 */
export const CyberGlassBubbles: React.FC = () => {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden z-0 select-none">
      {/* 1. Bola Kaca 3D Besar - Kiri Atas */}
      <div
        className="absolute -top-6 -left-6 w-32 h-32 rounded-full border border-cyan-400/40 blur-[0.5px] shadow-[0_0_25px_rgba(6,182,212,0.35),inset_0_3px_6px_rgba(255,255,255,0.8),inset_0_-2px_4px_rgba(0,0,0,0.5)]"
        style={{
          background: 'radial-gradient(circle at 35% 25%, rgba(56,189,248,0.25) 0%, rgba(6,182,212,0.12) 45%, rgba(2,11,24,0.4) 80%, rgba(2,6,15,0.8) 100%)',
        }}
      >
        {/* Specular Dome Sheen (Kubah Cahaya Putih) */}
        <div className="absolute top-2 left-4 right-4 h-8 rounded-full bg-gradient-to-b from-white/80 via-white/25 to-transparent blur-[0.5px]" />
        {/* Secondary Bottom Reflection */}
        <div className="absolute bottom-2 inset-x-8 h-3 rounded-full bg-cyan-300/30 blur-[1px]" />
      </div>

      {/* 2. Bola Kaca 3D Sedang - Kanan Atas */}
      <div
        className="absolute top-12 -right-8 w-28 h-28 rounded-full border border-sky-400/35 blur-[0.5px] shadow-[0_0_22px_rgba(14,165,233,0.3),inset_0_2.5px_5px_rgba(255,255,255,0.75)]"
        style={{
          background: 'radial-gradient(circle at 35% 25%, rgba(34,211,238,0.22) 0%, rgba(14,165,233,0.1) 45%, rgba(2,8,20,0.35) 80%, rgba(1,5,12,0.75) 100%)',
        }}
      >
        <div className="absolute top-1.5 left-3.5 right-3.5 h-6 rounded-full bg-gradient-to-b from-white/75 via-white/20 to-transparent blur-[0.5px]" />
        <div className="absolute bottom-1.5 inset-x-6 h-2 rounded-full bg-sky-300/25 blur-[1px]" />
      </div>

      {/* 3. Gelembung Kaca Kecil Mengambang - Kiri Tengah */}
      <div
        className="absolute top-1/3 -left-3 w-16 h-16 rounded-full border border-cyan-400/40 shadow-[0_0_18px_rgba(6,182,212,0.4),inset_0_2px_4px_rgba(255,255,255,0.7)]"
        style={{
          background: 'radial-gradient(circle at 35% 25%, rgba(56,189,248,0.28) 0%, rgba(6,182,212,0.1) 50%, rgba(2,6,15,0.6) 100%)',
        }}
      >
        <div className="absolute top-1 left-2 right-2 h-4 rounded-full bg-gradient-to-b from-white/70 to-transparent blur-[0.3px]" />
      </div>

      {/* 4. Gelembung Kaca Mengambang - Kanan Tengah */}
      <div
        className="absolute top-1/2 -right-4 w-20 h-20 rounded-full border border-cyan-400/35 shadow-[0_0_20px_rgba(6,182,212,0.3),inset_0_2px_4px_rgba(255,255,255,0.7)]"
        style={{
          background: 'radial-gradient(circle at 35% 25%, rgba(34,211,238,0.25) 0%, rgba(6,182,212,0.08) 50%, rgba(2,6,15,0.6) 100%)',
        }}
      >
        <div className="absolute top-1 left-2.5 right-2.5 h-5 rounded-full bg-gradient-to-b from-white/70 to-transparent blur-[0.4px]" />
      </div>

      {/* 5. Bola Kaca 3D Besar - Kiri Bawah */}
      <div
        className="absolute -bottom-8 -left-8 w-36 h-36 rounded-full border border-cyan-400/35 blur-[0.5px] shadow-[0_0_28px_rgba(6,182,212,0.35),inset_0_3px_6px_rgba(255,255,255,0.75)]"
        style={{
          background: 'radial-gradient(circle at 35% 25%, rgba(56,189,248,0.22) 0%, rgba(6,182,212,0.1) 45%, rgba(2,8,20,0.5) 80%, rgba(1,4,10,0.85) 100%)',
        }}
      >
        <div className="absolute top-2 left-5 right-5 h-8 rounded-full bg-gradient-to-b from-white/75 via-white/20 to-transparent blur-[0.5px]" />
        <div className="absolute bottom-2 inset-x-8 h-3 rounded-full bg-cyan-300/30 blur-[1px]" />
      </div>

      {/* 6. Bola Kaca 3D Sedang - Kanan Bawah */}
      <div
        className="absolute -bottom-6 -right-6 w-32 h-32 rounded-full border border-blue-400/35 blur-[0.5px] shadow-[0_0_25px_rgba(59,130,246,0.35),inset_0_3px_5px_rgba(255,255,255,0.7)]"
        style={{
          background: 'radial-gradient(circle at 35% 25%, rgba(96,165,250,0.25) 0%, rgba(59,130,246,0.12) 45%, rgba(2,8,20,0.5) 80%, rgba(1,4,10,0.85) 100%)',
        }}
      >
        <div className="absolute top-2 left-4 right-4 h-7 rounded-full bg-gradient-to-b from-white/75 via-white/20 to-transparent blur-[0.5px]" />
      </div>

      {/* Sparkles / Optic Lens Glints */}
      <div className="absolute top-24 left-1/4 w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_6px_#fff,0_0_12px_#22d3ee]" />
      <div className="absolute top-2/3 right-1/4 w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_6px_#fff,0_0_12px_#22d3ee]" />
      <div className="absolute bottom-28 left-1/3 w-1 h-1 rounded-full bg-cyan-200 shadow-[0_0_5px_#22d3ee]" />
    </div>
  )
}
