import React from 'react'

interface GoogleDriveIconProps {
  className?: string
}

/**
 * Logo Resmi Google Drive SVG (Multi-color Brand Assets)
 */
export const GoogleDriveIcon: React.FC<GoogleDriveIconProps> = ({ className = 'w-6 h-6' }) => {
  return (
    <svg viewBox="0 0 87.3 78" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Sisi Biru Kiri Bawah */}
      <path
        d="m6.6 66.85 3.85 6.65c.8 1.4 1.9 2.5 3.2 3.3l16.3-28.25-6.45-11.2-16.9 29.5z"
        fill="#0066DA"
      />
      {/* Sisi Hijau Kiri Atas */}
      <path
        d="m43.65 25-16.3-28.25c-1.3.8-2.4 1.9-3.2 3.3l-20.75 36 6.45 11.2 33.8-22.25z"
        fill="#00AC47"
      />
      {/* Sisi Merah Kanan Bawah */}
      <path
        d="m73.55 76.8c1.3-.8 2.4-1.9 3.2-3.3l3.85-6.65c.8-1.4 1.2-2.9 1.2-4.45h-47.5l6.45 11.2 32.75 3.2z"
        fill="#EA4335"
      />
      {/* Sisi Hijau Tua Atas */}
      <path
        d="m43.65 25 16.3-28.25c-1.3-.8-2.4-1.2-3.95-1.2h-24.7c-1.55 0-3.05.4-4.35 1.2l16.7 28.25z"
        fill="#00832D"
      />
      {/* Sisi Biru Muda Tengah */}
      <path
        d="m59.95 25h-32.6l16.3 28.25 16.3-28.25z"
        fill="#2684FC"
      />
      {/* Sisi Kuning / Oranye Kanan */}
      <path
        d="m73.55 76.8-16.3-28.25-13.6 23.55 3.85 6.65c.8 1.4 1.9 2.5 3.2 3.3 1.3.8 2.8 1.2 4.3 1.2h15.25c1.5 0 2.9-.4 4.2-1.2z"
        fill="#FFBA00"
      />
    </svg>
  )
}
