import React from 'react'
import { MapPin, Stamp, Cloud, Smartphone, Sliders, Database } from 'lucide-react'

export const HomeFeaturesSection: React.FC = () => {
  const features = [
    {
      icon: <MapPin className="h-6 w-6 text-emerald-400" />,
      title: 'Geotagging Satelit Presisi',
      description:
        'Membaca koordinat Lintang (Latitude), Bujur (Longitude), Elevasi (Altitude), Tingkat Akurasi GPS, dan Arah Kompas secara real-time langsung saat tombol jepret ditekan.',
    },
    {
      icon: <Stamp className="h-6 w-6 text-teal-400" />,
      title: 'Komposit Watermark Resmi',
      description:
        'Menyematkan stempel logo instansi, alamat lokasi terbalik, tanggal & waktu presisi, serta minimap satelit ke dalam kanvas foto secara permanen sebagai bukti validitas survei.',
    },
    {
      icon: <Sliders className="h-6 w-6 text-cyan-400" />,
      title: 'Filter & Finetuning Real-Time',
      description:
        'Dilengkapi filter visual kamera profesional (Vivid, Warm, Cold, Mono), pengaturan kecerahan, kontras, saturasi, serta algoritma penghalus derau (denoise) otomatis.',
    },
    {
      icon: <Database className="h-6 w-6 text-emerald-400" />,
      title: 'Penyimpanan Offline IndexedDB',
      description:
        'Seluruh foto hasil jepretan disimpan secara aman di basis data lokal peramban perangkat pengguna sehingga dapat diakses, direview, dan diperiksa tanpa koneksi internet.',
    },
    {
      icon: <Cloud className="h-6 w-6 text-teal-400" />,
      title: 'Pencadangan Google Drive Mandiri',
      description:
        'Mendukung antrian unggah (queue worker) langsung dari browser ke folder pribadi LocaCamp Photos di Google Drive milik pengguna dengan enkripsi OAuth 2.0 resmi.',
    },
    {
      icon: <Smartphone className="h-6 w-6 text-cyan-400" />,
      title: 'Progressive Web App (PWA)',
      description:
        'Dapat dipasang langsung ke layar utama smartphone (Android & iOS) tanpa melalui toko aplikasi pihak ketiga, ringan, hemat baterai, dan responsif di semua ukuran layar.',
    },
  ]

  return (
    <section className="py-12 sm:py-16 border-b border-white/10 bg-slate-950">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-12">
          <h2 className="text-xs font-bold uppercase tracking-wider text-emerald-400 mb-2">
            Fungsionalitas & Kemampuan Teknis
          </h2>
          <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            Fitur Lengkap Aplikasi Kamera LocaCamp
          </h3>
          <p className="mt-3 text-xs sm:text-sm text-slate-400">
            Dirancang khusus untuk kebutuhan survei infrastruktur, inspeksi proyek sipil, pemetaan pertanian, kehutanan, dan dokumentasi lapangan akurat.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feat, idx) => (
            <div
              key={idx}
              className="rounded-2xl border border-white/10 bg-slate-900/60 p-5 hover:border-emerald-500/30 hover:bg-slate-900/90 transition-all group"
            >
              <div className="mb-3.5 inline-flex rounded-xl bg-white/5 p-3 group-hover:scale-105 transition-transform">
                {feat.icon}
              </div>
              <h4 className="text-sm font-semibold text-white mb-1.5">{feat.title}</h4>
              <p className="text-xs text-slate-400 leading-relaxed">{feat.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
