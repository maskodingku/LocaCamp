import React from 'react'

/**
 * CyberGlassBubbles:
 * Gelembung bola kaca 3D cair kristal jernih dengan kilatan cahaya silau putih murni
 * (Crisp Pure-White Specular Sheen & Glass Highlights), bebas dari efek blur berpendar yang memencar.
 */
export const CyberGlassBubbles: React.FC = () => {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden z-0 select-none">
      {/* 1. Bola Kaca 3D Utama - Kiri Atas */}
      <div
        className="absolute top-8 left-4 w-28 h-28 rounded-full border border-white/40 shadow-[0_12px_28px_rgba(0,0,0,0.5),inset_0_2.5px_4px_rgba(255,255,255,0.95),inset_0_-1.5px_3px_rgba(0,0,0,0.5)]"
        style={{
          background:
            'radial-gradient(circle at 35% 25%, rgba(255,255,255,0.2) 0%, rgba(56,189,248,0.12) 30%, rgba(6,182,212,0.06) 60%, rgba(1,5,14,0.4) 100%)',
        }}
      >
        {/* Specular Glare Silau Putih Mengkilap */}
        <div className="absolute top-1.5 inset-x-4 h-6 rounded-full bg-gradient-to-b from-white via-white/50 to-transparent blur-[0.2px]" />
        {/* Garis Kilau Bibir Kaca */}
        <div className="absolute top-1 inset-x-5 h-[1px] bg-white/90" />
        {/* Refleksi Bawah Halus */}
        <div className="absolute bottom-2 inset-x-7 h-2 rounded-full bg-white/20" />
      </div>

      {/* 2. Bola Kaca 3D - Kanan Atas */}
      <div
        className="absolute top-28 right-4 w-24 h-24 rounded-full border border-white/35 shadow-[0_10px_24px_rgba(0,0,0,0.45),inset_0_2px_3.5px_rgba(255,255,255,0.9)]"
        style={{
          background:
            'radial-gradient(circle at 35% 25%, rgba(255,255,255,0.18) 0%, rgba(56,189,248,0.1) 35%, rgba(1,4,10,0.35) 100%)',
        }}
      >
        <div className="absolute top-1.5 inset-x-3.5 h-5 rounded-full bg-gradient-to-b from-white via-white/45 to-transparent blur-[0.2px]" />
        <div className="absolute top-1 inset-x-4 h-[1px] bg-white/85" />
      </div>

      {/* 3. Micro Glass Orb - Kiri Atas */}
      <div
        className="absolute top-48 left-12 w-9 h-9 rounded-full border border-white/50 shadow-[0_4px_10px_rgba(0,0,0,0.5),inset_0_1.5px_2.5px_rgba(255,255,255,0.95)]"
        style={{
          background:
            'radial-gradient(circle at 35% 25%, rgba(255,255,255,0.3) 0%, rgba(56,189,248,0.15) 50%, transparent 100%)',
        }}
      >
        <div className="absolute top-0.5 inset-x-1.5 h-2 rounded-full bg-white" />
      </div>

      {/* 4. Bola Kaca 3D Tengah Kiri */}
      <div
        className="absolute top-[40%] left-5 w-20 h-20 rounded-full border border-white/35 shadow-[0_10px_22px_rgba(0,0,0,0.45),inset_0_2px_3.5px_rgba(255,255,255,0.9)]"
        style={{
          background:
            'radial-gradient(circle at 35% 25%, rgba(255,255,255,0.18) 0%, rgba(56,189,248,0.08) 40%, rgba(1,4,10,0.3) 100%)',
        }}
      >
        <div className="absolute top-1.5 inset-x-3 h-4.5 rounded-full bg-gradient-to-b from-white via-white/40 to-transparent blur-[0.2px]" />
        <div className="absolute top-1 inset-x-3.5 h-[1px] bg-white/85" />
      </div>

      {/* 5. Bola Kaca 3D Tengah Kanan */}
      <div
        className="absolute top-[52%] right-5 w-24 h-24 rounded-full border border-white/35 shadow-[0_10px_24px_rgba(0,0,0,0.45),inset_0_2px_3.5px_rgba(255,255,255,0.9)]"
        style={{
          background:
            'radial-gradient(circle at 35% 25%, rgba(255,255,255,0.18) 0%, rgba(56,189,248,0.08) 40%, rgba(1,4,10,0.3) 100%)',
        }}
      >
        <div className="absolute top-1.5 inset-x-3.5 h-5 rounded-full bg-gradient-to-b from-white via-white/45 to-transparent blur-[0.2px]" />
        <div className="absolute top-1 inset-x-4 h-[1px] bg-white/85" />
      </div>

      {/* 6. Micro Glass Orb - Tengah */}
      <div
        className="absolute top-[66%] left-16 w-8 h-8 rounded-full border border-white/50 shadow-[0_4px_10px_rgba(0,0,0,0.5),inset_0_1.5px_2.5px_rgba(255,255,255,0.95)]"
        style={{
          background:
            'radial-gradient(circle at 35% 25%, rgba(255,255,255,0.3) 0%, rgba(56,189,248,0.15) 50%, transparent 100%)',
        }}
      >
        <div className="absolute top-0.5 inset-x-1 h-2 rounded-full bg-white" />
      </div>

      {/* 7. Bola Kaca 3D Bawah Kiri */}
      <div
        className="absolute bottom-20 left-5 w-26 h-26 rounded-full border border-white/35 shadow-[0_12px_26px_rgba(0,0,0,0.5),inset_0_2.5px_4px_rgba(255,255,255,0.95)]"
        style={{
          background:
            'radial-gradient(circle at 35% 25%, rgba(255,255,255,0.2) 0%, rgba(56,189,248,0.1) 40%, rgba(1,4,10,0.35) 100%)',
        }}
      >
        <div className="absolute top-1.5 inset-x-4 h-6 rounded-full bg-gradient-to-b from-white via-white/50 to-transparent blur-[0.2px]" />
        <div className="absolute top-1 inset-x-5 h-[1px] bg-white/90" />
      </div>

      {/* 8. Bola Kaca 3D Bawah Kanan */}
      <div
        className="absolute bottom-10 right-6 w-22 h-22 rounded-full border border-white/35 shadow-[0_10px_22px_rgba(0,0,0,0.45),inset_0_2px_3.5px_rgba(255,255,255,0.9)]"
        style={{
          background:
            'radial-gradient(circle at 35% 25%, rgba(255,255,255,0.18) 0%, rgba(96,165,250,0.1) 40%, rgba(1,4,10,0.35) 100%)',
        }}
      >
        <div className="absolute top-1.5 inset-x-3.5 h-5 rounded-full bg-gradient-to-b from-white via-white/45 to-transparent blur-[0.2px]" />
      </div>

      {/* Specular Optic Light Glints (Titik Silau Kaca Putih Bersih) */}
      <div className="absolute top-16 left-1/3 w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_4px_#fff]" />
      <div className="absolute top-[35%] right-1/4 w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_4px_#fff]" />
      <div className="absolute top-[60%] left-1/4 w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_4px_#fff]" />
      <div className="absolute bottom-32 right-1/3 w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_4px_#fff]" />
    </div>
  )
}
