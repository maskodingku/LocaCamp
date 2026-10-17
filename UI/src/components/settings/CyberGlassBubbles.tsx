import React from 'react'

/**
 * CyberGlassBubbles:
 * Menghadirkan gelembung-gelembung bola kaca cair 3D (Floating 3D Cyber Glass Orbs)
 * dengan pantulan cahaya specular dome sheen, rim light neon cyan, dan refraksi kristal
 * yang mengambang nyata dan jelas terlihat di area pandang pengaturan.
 */
export const CyberGlassBubbles: React.FC = () => {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden z-0 select-none">
      {/* 1. Bola Kaca 3D Utama - Kiri Atas */}
      <div
        className="absolute top-8 left-4 w-28 h-28 rounded-full border border-cyan-300/60 shadow-[0_0_30px_rgba(6,182,212,0.5),inset_0_3px_6px_rgba(255,255,255,0.9),inset_0_-2px_4px_rgba(0,0,0,0.5)]"
        style={{
          background:
            'radial-gradient(circle at 35% 25%, rgba(56,189,248,0.45) 0%, rgba(6,182,212,0.2) 40%, rgba(2,11,24,0.15) 75%, rgba(1,5,14,0.6) 100%)',
        }}
      >
        {/* Specular Dome Sheen (Kubah Cahaya Putih Lengkung) */}
        <div className="absolute top-2 inset-x-4 h-7 rounded-full bg-gradient-to-b from-white/95 via-white/40 to-transparent blur-[0.5px]" />
        {/* Refleksi Bawah Sekunder */}
        <div className="absolute bottom-2 inset-x-6 h-2.5 rounded-full bg-cyan-300/40 blur-[1px]" />
      </div>

      {/* 2. Bola Kaca 3D - Kanan Atas */}
      <div
        className="absolute top-28 right-4 w-24 h-24 rounded-full border border-sky-300/55 shadow-[0_0_25px_rgba(14,165,233,0.45),inset_0_2.5px_5px_rgba(255,255,255,0.85)]"
        style={{
          background:
            'radial-gradient(circle at 35% 25%, rgba(34,211,238,0.4) 0%, rgba(14,165,233,0.18) 45%, rgba(2,8,20,0.15) 75%, rgba(1,4,10,0.6) 100%)',
        }}
      >
        <div className="absolute top-1.5 inset-x-3.5 h-6 rounded-full bg-gradient-to-b from-white/90 via-white/35 to-transparent blur-[0.5px]" />
        <div className="absolute bottom-1.5 inset-x-5 h-2 rounded-full bg-sky-300/35 blur-[1px]" />
      </div>

      {/* 3. Micro Glass Orb - Kiri Atas (Dekat Tab Bar) */}
      <div
        className="absolute top-48 left-12 w-9 h-9 rounded-full border border-cyan-300/60 shadow-[0_0_15px_rgba(6,182,212,0.5),inset_0_1.5px_3px_rgba(255,255,255,0.85)]"
        style={{
          background:
            'radial-gradient(circle at 35% 25%, rgba(56,189,248,0.5) 0%, rgba(6,182,212,0.2) 60%, transparent 100%)',
        }}
      >
        <div className="absolute top-1 inset-x-2 h-2.5 rounded-full bg-white/90 blur-[0.3px]" />
      </div>

      {/* 4. Bola Kaca 3D Tengah Kiri */}
      <div
        className="absolute top-[40%] left-5 w-20 h-20 rounded-full border border-cyan-300/55 shadow-[0_0_22px_rgba(6,182,212,0.45),inset_0_2.5px_5px_rgba(255,255,255,0.85)]"
        style={{
          background:
            'radial-gradient(circle at 35% 25%, rgba(56,189,248,0.42) 0%, rgba(6,182,212,0.18) 50%, rgba(2,6,15,0.3) 100%)',
        }}
      >
        <div className="absolute top-1.5 inset-x-3 h-5 rounded-full bg-gradient-to-b from-white/90 to-transparent blur-[0.4px]" />
        <div className="absolute bottom-1.5 inset-x-4 h-2 rounded-full bg-cyan-300/35 blur-[1px]" />
      </div>

      {/* 5. Bola Kaca 3D Tengah Kanan */}
      <div
        className="absolute top-[52%] right-5 w-24 h-24 rounded-full border border-cyan-300/55 shadow-[0_0_26px_rgba(6,182,212,0.5),inset_0_2.5px_5px_rgba(255,255,255,0.85)]"
        style={{
          background:
            'radial-gradient(circle at 35% 25%, rgba(34,211,238,0.42) 0%, rgba(6,182,212,0.18) 50%, rgba(2,6,15,0.3) 100%)',
        }}
      >
        <div className="absolute top-1.5 inset-x-3.5 h-6 rounded-full bg-gradient-to-b from-white/90 to-transparent blur-[0.4px]" />
        <div className="absolute bottom-1.5 inset-x-5 h-2 rounded-full bg-cyan-300/35 blur-[1px]" />
      </div>

      {/* 6. Micro Glass Orb - Tengah */}
      <div
        className="absolute top-[66%] left-16 w-8 h-8 rounded-full border border-cyan-300/60 shadow-[0_0_14px_rgba(6,182,212,0.5),inset_0_1.5px_3px_rgba(255,255,255,0.85)]"
        style={{
          background:
            'radial-gradient(circle at 35% 25%, rgba(56,189,248,0.5) 0%, rgba(6,182,212,0.2) 60%, transparent 100%)',
        }}
      >
        <div className="absolute top-1 inset-x-1.5 h-2 rounded-full bg-white/90 blur-[0.3px]" />
      </div>

      {/* 7. Bola Kaca 3D Bawah Kiri */}
      <div
        className="absolute bottom-20 left-5 w-26 h-26 rounded-full border border-cyan-300/55 shadow-[0_0_28px_rgba(6,182,212,0.5),inset_0_3px_6px_rgba(255,255,255,0.85)]"
        style={{
          background:
            'radial-gradient(circle at 35% 25%, rgba(56,189,248,0.4) 0%, rgba(6,182,212,0.18) 45%, rgba(2,8,20,0.2) 80%, rgba(1,4,10,0.6) 100%)',
        }}
      >
        <div className="absolute top-2 inset-x-4 h-7 rounded-full bg-gradient-to-b from-white/90 via-white/30 to-transparent blur-[0.5px]" />
        <div className="absolute bottom-2 inset-x-6 h-2.5 rounded-full bg-cyan-300/35 blur-[1px]" />
      </div>

      {/* 8. Bola Kaca 3D Bawah Kanan */}
      <div
        className="absolute bottom-10 right-6 w-22 h-22 rounded-full border border-blue-300/55 shadow-[0_0_25px_rgba(59,130,246,0.5),inset_0_2.5px_5px_rgba(255,255,255,0.85)]"
        style={{
          background:
            'radial-gradient(circle at 35% 25%, rgba(96,165,250,0.4) 0%, rgba(59,130,246,0.18) 45%, rgba(2,8,20,0.2) 80%, rgba(1,4,10,0.6) 100%)',
        }}
      >
        <div className="absolute top-2 inset-x-3.5 h-6 rounded-full bg-gradient-to-b from-white/90 via-white/30 to-transparent blur-[0.5px]" />
      </div>

      {/* Optic Lens Flare Glints (Titik Kilauan Kaca) */}
      <div className="absolute top-16 left-1/3 w-2 h-2 rounded-full bg-white shadow-[0_0_8px_#fff,0_0_16px_#22d3ee]" />
      <div className="absolute top-[35%] right-1/4 w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_6px_#fff,0_0_14px_#22d3ee]" />
      <div className="absolute top-[60%] left-1/4 w-2 h-2 rounded-full bg-white shadow-[0_0_8px_#fff,0_0_16px_#22d3ee]" />
      <div className="absolute bottom-32 right-1/3 w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_6px_#fff,0_0_14px_#22d3ee]" />
    </div>
  )
}
