import React from 'react'

/**
 * CyberGlassBackground:
 * Menghadirkan visualisasi Liquid Cyber Glassmorphism dengan gelembung kaca cair 3D,
 * pantulan specular highlight (flare bintang), dan rim light neon cyan persis seperti Gambar 2.
 */
export const CyberGlassBackground: React.FC = () => {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-[20px] sm:rounded-[24px] z-0">
      {/* Background Gradient Teal-Cyan Gelap Berdimensi */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse at 50% 15%, rgba(8, 60, 80, 0.5) 0%, rgba(4, 30, 42, 0.75) 40%, rgba(2, 16, 25, 0.95) 80%, rgba(1, 10, 16, 0.98) 100%)',
        }}
      />

      {/* SVG Liquid 3D Glass Bubbles & Lens Flares */}
      <svg
        className="absolute inset-0 w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
        viewBox="0 0 1000 1600"
      >
        <defs>
          {/* Filter Glow Halus */}
          <filter id="softGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="6" />
          </filter>
          <filter id="flareGlow" x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="10" />
          </filter>

          {/* Gradien Bola Kaca 3D (Liquid Spherical Gradient) */}
          <radialGradient id="bubbleGrad" cx="35%" cy="30%" r="70%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.25" />
            <stop offset="25%" stopColor="#22d3ee" stopOpacity="0.12" />
            <stop offset="65%" stopColor="#0891b2" stopOpacity="0.04" />
            <stop offset="88%" stopColor="#06b6d4" stopOpacity="0.28" />
            <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.65" />
          </radialGradient>

          {/* Gradien Rim Light Tepian Gelembung */}
          <linearGradient id="bubbleRim" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.8" />
            <stop offset="40%" stopColor="#22d3ee" stopOpacity="0.5" />
            <stop offset="70%" stopColor="#0891b2" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#a5f3fc" stopOpacity="0.75" />
          </linearGradient>

          {/* Gradien Highlight Sudut (Top Crescent) */}
          <linearGradient id="crescentGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0.0" />
          </linearGradient>

          {/* Lens Flare Bintang 4 Titik */}
          <g id="starGlint">
            <ellipse cx="0" cy="0" rx="28" ry="4" fill="#ffffff" filter="url(#flareGlow)" opacity="0.9" />
            <ellipse cx="0" cy="0" rx="4" ry="28" fill="#ffffff" filter="url(#flareGlow)" opacity="0.9" />
            <ellipse cx="0" cy="0" rx="18" ry="2.5" fill="#a5f3fc" opacity="0.95" />
            <ellipse cx="0" cy="0" rx="2.5" ry="18" fill="#a5f3fc" opacity="0.95" />
            <circle cx="0" cy="0" r="4.5" fill="#ffffff" opacity="1" />
          </g>
        </defs>

        {/* 1. Gelembung Kiri Atas (Besar) */}
        <g>
          <circle cx="170" cy="270" r="150" fill="url(#bubbleGrad)" stroke="url(#bubbleRim)" strokeWidth="3" />
          <path
            d="M 60 210 A 130 130 0 0 1 260 170"
            fill="none"
            stroke="url(#crescentGrad)"
            strokeWidth="5"
            strokeLinecap="round"
            opacity="0.75"
          />
          {/* Glint Bintang di atas gelembung kiri atas */}
          <use href="#starGlint" x="170" y="160" transform="scale(1.2)" />
        </g>

        {/* 2. Gelembung Kanan Atas (Besar) */}
        <g>
          <circle cx="860" cy="240" r="140" fill="url(#bubbleGrad)" stroke="url(#bubbleRim)" strokeWidth="3" />
          <path
            d="M 760 170 A 120 120 0 0 1 950 160"
            fill="none"
            stroke="url(#crescentGrad)"
            strokeWidth="5"
            strokeLinecap="round"
            opacity="0.8"
          />
          {/* Glint Bintang di puncak gelembung kanan atas */}
          <use href="#starGlint" x="870" y="130" transform="scale(1.1)" />
        </g>

        {/* 3. Gelembung Kanan Atas Sedang */}
        <circle cx="685" cy="235" r="32" fill="url(#bubbleGrad)" stroke="url(#bubbleRim)" strokeWidth="2" />
        <ellipse cx="678" cy="220" rx="10" ry="4" fill="#ffffff" opacity="0.4" transform="rotate(-30 678 220)" />

        {/* 4. Gelembung Kiri Tengah Kecil */}
        <circle cx="300" cy="380" r="22" fill="url(#bubbleGrad)" stroke="url(#bubbleRim)" strokeWidth="1.5" />
        <circle cx="320" cy="450" r="14" fill="url(#bubbleGrad)" stroke="url(#bubbleRim)" strokeWidth="1" />

        {/* 5. Gelembung Kanan Tengah Sedang */}
        <circle cx="798" cy="390" r="45" fill="url(#bubbleGrad)" stroke="url(#bubbleRim)" strokeWidth="2.5" />
        <ellipse cx="788" cy="370" rx="14" ry="5" fill="#ffffff" opacity="0.45" transform="rotate(-25 788 370)" />
        <circle cx="864" cy="435" r="18" fill="url(#bubbleGrad)" stroke="url(#bubbleRim)" strokeWidth="1.5" />

        {/* 6. Gelembung Kiri Tengah Menengah */}
        <circle cx="150" cy="780" r="20" fill="url(#bubbleGrad)" stroke="url(#bubbleRim)" strokeWidth="1.5" />
        <circle cx="215" cy="870" r="55" fill="url(#bubbleGrad)" stroke="url(#bubbleRim)" strokeWidth="2.5" />
        <ellipse cx="200" cy="845" rx="16" ry="6" fill="#ffffff" opacity="0.4" transform="rotate(-30 200 845)" />

        {/* 7. Gelembung Kiri Bawah (Sangat Besar) */}
        <g>
          <circle cx="160" cy="1430" r="175" fill="url(#bubbleGrad)" stroke="url(#bubbleRim)" strokeWidth="3" />
          <path
            d="M 40 1350 A 150 150 0 0 1 260 1310"
            fill="none"
            stroke="url(#crescentGrad)"
            strokeWidth="6"
            strokeLinecap="round"
            opacity="0.85"
          />
          {/* Glint Bintang Menyilaukan di Bawah Kiri */}
          <use href="#starGlint" x="120" y="1290" transform="scale(1.4)" />
        </g>

        {/* 8. Gelembung Kanan Bawah (Besar) */}
        <g>
          <circle cx="860" cy="1450" r="160" fill="url(#bubbleGrad)" stroke="url(#bubbleRim)" strokeWidth="3" />
          <path
            d="M 750 1370 A 140 140 0 0 1 950 1350"
            fill="none"
            stroke="url(#crescentGrad)"
            strokeWidth="5"
            strokeLinecap="round"
            opacity="0.75"
          />
        </g>

        {/* 9. Gelembung Kanan Bawah Kecil */}
        <circle cx="756" cy="1320" r="35" fill="url(#bubbleGrad)" stroke="url(#bubbleRim)" strokeWidth="2" />
        <circle cx="800" cy="1270" r="16" fill="url(#bubbleGrad)" stroke="url(#bubbleRim)" strokeWidth="1.5" />
      </svg>

      {/* Pantulan Glint Cahaya di Sudut-Sudut Inner Viewport Border */}
      {/* Sudut Kiri Atas Viewport */}
      <div className="absolute top-1 left-1 w-3 h-3 bg-cyan-300 rounded-full blur-[2px] opacity-80" />
      <div className="absolute top-1.5 left-1.5 w-1.5 h-1.5 bg-white rounded-full shadow-[0_0_8px_#fff]" />

      {/* Sudut Kanan Atas Viewport */}
      <div className="absolute top-1 right-1 w-3 h-3 bg-cyan-300 rounded-full blur-[2px] opacity-80" />
      <div className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-white rounded-full shadow-[0_0_8px_#fff]" />

      {/* Sudut Kiri Bawah Viewport */}
      <div className="absolute bottom-1 left-1 w-3 h-3 bg-cyan-300 rounded-full blur-[2px] opacity-80" />
      <div className="absolute bottom-1.5 left-1.5 w-1.5 h-1.5 bg-white rounded-full shadow-[0_0_8px_#fff]" />
    </div>
  )
}
