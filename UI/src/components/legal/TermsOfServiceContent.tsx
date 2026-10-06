import React from 'react'
import { FileText, CheckCircle2, AlertTriangle, ShieldCheck, Scale, Mail } from 'lucide-react'

export const TermsOfServiceContent: React.FC = () => {
  return (
    <div className="space-y-8 text-slate-300 leading-relaxed">
      {/* Header Banner */}
      <div className="rounded-2xl border border-emerald-500/20 bg-gradient-to-br from-emerald-950/40 via-slate-900 to-slate-950 p-6 sm:p-8 shadow-xl">
        <div className="flex items-center gap-3 text-emerald-400 mb-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 border border-emerald-500/30">
            <FileText className="h-5 w-5 text-emerald-400" />
          </div>
          <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400">
            Ketentuan Penggunaan Resmi
          </span>
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
          Ketentuan Layanan LocaCamp
        </h1>
        <p className="mt-2 text-sm text-slate-400">
          Terakhir Diperbarui: 6 Oktober 2026 • Syarat & Ketentuan Penggunaan Aplikasi Web PWA
        </p>
      </div>

      {/* 1. Penerimaan Ketentuan */}
      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-white flex items-center gap-2">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500/20 text-xs font-bold text-emerald-400">
            1
          </span>
          Penerimaan Ketentuan
        </h2>
        <p className="text-sm text-slate-300">
          Dengan mengakses, memasang (install PWA), atau menggunakan aplikasi <strong className="text-white">LocaCamp</strong>, Anda menyatakan bahwa Anda telah membaca, memahami, dan menyetujui untuk terikat secara hukum oleh Ketentuan Layanan ini. Jika Anda tidak menyetujui bagian mana pun dari ketentuan ini, Anda disarankan untuk tidak menggunakan aplikasi ini.
        </p>
      </section>

      {/* 2. Deskripsi Layanan */}
      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-white flex items-center gap-2">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500/20 text-xs font-bold text-emerald-400">
            2
          </span>
          Deskripsi Layanan LocaCamp
        </h2>
        <p className="text-sm text-slate-300">
          LocaCamp adalah aplikasi kamera cerdas berbasis web (Progressive Web Application) yang dirancang untuk kebutuhan dokumentasi teknis, survei lapangan, pemetaan, inspeksi proyek, dan kegiatan outdoor dengan fitur:
        </p>
        <ul className="grid gap-2 sm:grid-cols-2 text-xs text-slate-300">
          <li className="flex items-start gap-2 rounded-lg border border-white/5 bg-slate-900/40 p-3">
            <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
            <span>Geotagging presisi tinggi (koordinat GPS satelit, elevasi, akurasi, dan kompas).</span>
          </li>
          <li className="flex items-start gap-2 rounded-lg border border-white/5 bg-slate-900/40 p-3">
            <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
            <span>Penyematan stempel watermark logo resmi, alamat terbalik, dan minimap satelit.</span>
          </li>
          <li className="flex items-start gap-2 rounded-lg border border-white/5 bg-slate-900/40 p-3">
            <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
            <span>Filter visual kamera real-time dan pengaturan resolusi sensor mandiri.</span>
          </li>
          <li className="flex items-start gap-2 rounded-lg border border-white/5 bg-slate-900/40 p-3">
            <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
            <span>Penyimpanan lokal IndexedDB dan pencadangan awan otomatis ke Google Drive pribadi.</span>
          </li>
        </ul>
      </section>

      {/* 3. Kewajiban & Perilaku Pengguna */}
      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-white flex items-center gap-2">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500/20 text-xs font-bold text-emerald-400">
            3
          </span>
          Kewajiban & Tanggung Jawab Pengguna
        </h2>
        <p className="text-sm text-slate-300">
          Dalam menggunakan LocaCamp, Anda setuju untuk:
        </p>
        <ul className="list-disc pl-5 space-y-1.5 text-xs text-slate-300">
          <li>Menggunakan aplikasi hanya untuk tujuan yang sah, legal, dan mematuhi peraturan perundang-undangan yang berlaku di wilayah Anda.</li>
          <li>Menghormati hak privasi pihak lain saat mengambil foto di fasilitas publik, instalasi militer, atau properti privat yang memiliki batasan fotografi.</li>
          <li>Memastikan bahwa logo resmi, cap instansi, atau watermark kustom yang Anda unggah ke aplikasi adalah logo yang Anda miliki izin atau hak resminya untuk digunakan.</li>
          <li>Tidak menggunakan atau merekayasa aplikasi untuk merusak, membebani secara berlebihan, atau mengganggu stabilitas infrastruktur API pihak ketiga.</li>
        </ul>
      </section>

      {/* 4. Kepemilikan Hak Cipta & Konten Foto */}
      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-white flex items-center gap-2">
          <ShieldCheck className="h-5 w-5 text-emerald-400" />
          <span>Kepemilikan Konten & Hak Cipta Foto</span>
        </h2>
        <p className="text-sm text-slate-300">
          <strong className="text-white">Anda adalah pemilik mutlak 100%</strong> dari seluruh foto, rekaman koordinat, dan data survei yang Anda hasilkan melalui LocaCamp. Kami tidak mengklaim kepemilikan intelektual apa pun atas materi atau berkas foto yang Anda ciptakan.
        </p>
      </section>

      {/* 5. Layanan Pihak Ketiga & Google Drive */}
      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-white flex items-center gap-2">
          <Scale className="h-5 w-5 text-emerald-400" />
          <span>Integrasi Layanan Pihak Ketiga (Google Drive API)</span>
        </h2>
        <p className="text-sm text-slate-300">
          Fitur pencadangan awan LocaCamp terhubung langsung dengan Google Drive API milik Google LLC. Penggunaan Anda atas layanan Google Drive tunduk pada Persyaratan Layanan Google. LocaCamp mematuhi sepenuhnya kebijakan pembatasan izin (<code className="text-emerald-300 font-mono">drive.file</code>) dan tidak memiliki hak akses di luar folder khusus yang dibuat oleh aplikasi.
        </p>
      </section>

      {/* 6. Penafian Jaminan (Disclaimer) */}
      <section className="space-y-3 rounded-2xl border border-amber-500/20 bg-amber-950/20 p-5">
        <h2 className="text-base font-semibold text-amber-300 flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-amber-400" />
          <span>Penafian Jaminan & Akurasi Sensor</span>
        </h2>
        <p className="text-xs text-amber-200/90 leading-relaxed">
          Aplikasi LocaCamp disediakan atas dasar <strong>&ldquo;SEBAGAIMANA ADANYA&rdquo; (&ldquo;AS IS&rdquo;)</strong> dan <strong>&ldquo;SEBAGAIMANA TERSEDIA&rdquo;</strong>. Akurasi data posisi geografis (lintang, bujur, ketinggian, kompas) bergantung sepenuhnya pada kemampuan perangkat keras (GPS chip), penerimaan sinyal satelit, kondisi cuaca, dan layanan geolokasi sistem operasi Anda. Kami tidak memberikan jaminan mutlak bahwa pembacaan sensor selalu bebas dari deviasi sinyal satelit atau gangguan elektromagnetik lokal.
        </p>
      </section>

      {/* 7. Batasan Tanggung Jawab */}
      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-white flex items-center gap-2">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500/20 text-xs font-bold text-emerald-400">
            7
          </span>
          Batasan Tanggung Jawab
        </h2>
        <p className="text-sm text-slate-300">
          Sejauh diizinkan oleh hukum yang berlaku, pengembang LocaCamp tidak bertanggung jawab atas kerugian langsung, tidak langsung, insidental, atau konsekuensial yang timbul dari:
        </p>
        <ul className="list-disc pl-5 space-y-1 text-xs text-slate-300">
          <li>Kehilangan data foto akibat pembersihan cache / penyimpanan peramban oleh pengguna atau sistem operasi.</li>
          <li>Kegagalan koneksi internet atau kuota saat proses pengunggahan ke Google Drive di lapangan.</li>
          <li>Kerusakan fisik perangkat saat melakukan aktivitas survei di medan lapangan berat.</li>
        </ul>
      </section>

      {/* 8. Kontak & Hukum yang Berlaku */}
      <section className="rounded-xl border border-white/10 bg-slate-900/60 p-5">
        <h2 className="text-base font-semibold text-white flex items-center gap-2 mb-2">
          <Mail className="h-4 w-4 text-emerald-400" />
          <span>Hukum yang Berlaku & Kontak Pengembang</span>
        </h2>
        <p className="text-xs text-slate-400 leading-relaxed">
          Ketentuan Layanan ini diatur dan ditafsirkan sesuai dengan hukum Negara Kesatuan Republik Indonesia. Untuk pertanyaan hukum atau lisensi penggunaan perusahaan, hubungi kami di:
        </p>
        <div className="mt-3 text-xs text-slate-300 space-y-1">
          <p><strong className="text-white">Pengembang:</strong> Abdi Syahputra Harahap</p>
          <p><strong className="text-white">Email Resmi:</strong> <span className="text-emerald-400 font-mono">maskoding12@gmail.com</span></p>
        </div>
      </section>
    </div>
  )
}
