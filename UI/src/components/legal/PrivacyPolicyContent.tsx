import React from 'react'
import { ShieldCheck, Camera, MapPin, HardDrive, Lock, Mail, Code2 } from 'lucide-react'

export const PrivacyPolicyContent: React.FC = () => {
  return (
    <div className="space-y-8 text-slate-300 leading-relaxed max-w-full break-words">
      {/* Header Banner */}
      <div className="rounded-2xl border border-emerald-500/20 bg-gradient-to-br from-emerald-950/40 via-slate-900 to-slate-950 p-6 sm:p-8 shadow-xl">
        <div className="flex items-center gap-3 text-emerald-400 mb-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 border border-emerald-500/30">
            <ShieldCheck className="h-5 w-5 text-emerald-400" />
          </div>
          <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400">
            Transparansi Privasi & Keamanan Data
          </span>
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
          Kebijakan Privasi LocaCamp
        </h1>
        <p className="mt-2 text-sm text-slate-400">
          Terakhir Diperbarui: 6 Oktober 2026 • 100% On-Device & Open Source
        </p>
      </div>

      {/* Jaminan Inti: 100% On-Device & Open Source */}
      <div className="rounded-2xl border border-emerald-500/30 bg-emerald-950/25 p-5 text-xs text-slate-200">
        <div className="flex items-center gap-2 font-bold text-emerald-300 text-sm mb-2">
          <Lock className="h-4 w-4 text-emerald-400 shrink-0" />
          <span>Jaminan Privasi: Data Sepenuhnya Berada di Perangkat Anda Sendiri</span>
        </div>
        <p className="leading-relaxed text-slate-300">
          LocaCamp dibangun dengan prinsip <strong className="text-white">Client-First & Privacy by Design</strong>. Seluruh proses pengolahan foto, komposit watermark, dan geotagging satelit dijalankan secara langsung di peramban (browser) perangkat Anda. Kami <strong className="text-white">tidak mengoperasikan server penyimpanan atau database eksternal</strong> untuk mengumpulkan foto, rekaman video, atau data lokasi Anda.
        </p>
        <div className="mt-3 flex items-center gap-2 pt-2 border-t border-emerald-500/20 text-emerald-300">
          <Code2 className="h-4 w-4 shrink-0 text-slate-300" />
          <span>
            Kode sumber aplikasi terbuka transparan dan dapat diaudit secara bebas di{' '}
            <a
              href="https://github.com/maskodingku/LocaCamp"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white underline hover:text-emerald-300 font-semibold inline-flex items-center gap-1"
            >
              GitHub (maskodingku/LocaCamp)
            </a>
          </span>
        </div>
      </div>

      {/* 1. Pendahuluan */}
      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-white flex items-center gap-2">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500/20 text-xs font-bold text-emerald-400">
            1
          </span>
          Pendahuluan & Komitmen Bebas Pelacak
        </h2>
        <p className="text-sm text-slate-300">
          Selamat datang di <strong className="text-white">LocaCamp</strong> (aplikasi kamera web Progressive Web App untuk dokumentasi teknis dan survei lapangan). Dokumen ini menguraikan bagaimana peramban perangkat Anda memproses izin perangkat secara aman dan mandiri saat Anda menggunakan fitur-fitur kamera LocaCamp.
        </p>
        <p className="text-sm text-slate-300">
          Aplikasi ini <strong className="text-white">bebas dari pelacak pihak ketiga (no trackers)</strong>, bebas iklan, dan tidak menyisipkan skrip analitik invasif apa pun. Tidak ada data pribadi Anda yang dikomersialkan, ditransfer, atau dipantau oleh siapa pun.
        </p>
      </section>

      {/* 2. Penggunaan Izin Perangkat di Sisi Klien */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-white flex items-center gap-2">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500/20 text-xs font-bold text-emerald-400">
            2
          </span>
          Penggunaan Izin di Perangkat Anda (100% On-Device di Browser)
        </h2>
        
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-xl border border-white/10 bg-slate-900/60 p-4">
            <div className="flex items-center gap-2.5 text-emerald-400 mb-2 font-medium text-sm">
              <Camera className="h-4 w-4" />
              <span>Kamera Perangkat (Video Stream)</span>
            </div>
            <p className="text-xs text-slate-400 leading-normal">
              Digunakan oleh mesin peramban Anda untuk menampilkan live viewfinder jendela bidik dan menangkap foto survei. Pemrosesan piksel dan rendering filter visual terjadi 100% secara lokal pada memori GPU/Canvas perangkat Anda. Aliran kamera tidak pernah dikirim ke jaringan mana pun.
            </p>
          </div>

          <div className="rounded-xl border border-white/10 bg-slate-900/60 p-4">
            <div className="flex items-center gap-2.5 text-emerald-400 mb-2 font-medium text-sm">
              <MapPin className="h-4 w-4" />
              <span>Sensor GPS & Kompas Digital</span>
            </div>
            <p className="text-xs text-slate-400 leading-normal">
              Digunakan untuk membaca koordinat (Lintang, Bujur), akurasi sinyal, elevasi, dan arah kompas pada saat Anda menekan tombol jepret, guna dicetak langsung sebagai stempel watermark survei Anda. Aplikasi tidak pernah melacak posisi Anda secara pasif atau saat aplikasi ditutup.
            </p>
          </div>
        </div>
      </section>

      {/* 3. Integrasi Google Drive & Kepatuhan Google API */}
      <section className="space-y-4 rounded-2xl border border-teal-500/30 bg-teal-950/20 p-5 sm:p-6">
        <div className="flex items-center gap-2 text-teal-300 font-semibold text-base">
          <HardDrive className="h-5 w-5 text-teal-400" />
          <span>3. Integrasi Opsional Google Drive & Perlindungan Data Pengguna Google</span>
        </div>

        <p className="text-sm text-slate-300">
          Jika Anda memilih untuk mengaktifkan fitur pencadangan awan (cloud backup), aplikasi akan menghubungkan peramban Anda langsung ke akun Google Drive pribadi Anda melalui protokol OAuth 2.0 resmi Google.
        </p>

        <div className="space-y-3 rounded-xl border border-white/10 bg-slate-950/70 p-4 text-xs">
          <p className="font-semibold text-white">
            Isolasi Akses Folder Tertutup (Drive Scope: <code>drive.file</code>):
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-slate-300">
            <li>
              Aplikasi meminta scope izin minimal <code className="text-teal-300 font-mono break-all">https://www.googleapis.com/auth/drive.file</code>. Izin ini dibatasi khusus hanya pada file yang diunggah oleh aplikasi LocaCamp.
            </li>
            <li>
              Semua foto survei dicadangkan ke dalam folder khusus bernama <strong className="text-white">LocaCamp Photos</strong> di Google Drive Anda.
            </li>
            <li>
              <strong className="text-emerald-400">Privasi Berkas Lain Terjamin:</strong> LocaCamp <strong className="text-white">TIDAK BISA dan TIDAK AKAN PERNAH</strong> membaca, melihat, mengedit, atau menghapus berkas, dokumen, spreadsheet, atau foto lain yang ada di Google Drive pribadi Anda.
            </li>
            <li>
              <strong className="text-emerald-400">Koneksi Langsung Tanpa Server Perantara:</strong> Unggahan dikirimkan secara langsung (*direct peer-to-cloud*) dari peramban Anda ke server Google Cloud tanpa singgah di server pihak ketiga atau server pengembang.
            </li>
          </ul>
        </div>

        {/* Klausul Wajib Google API Limited Use */}
        <div className="rounded-xl border border-amber-500/30 bg-amber-950/20 p-4 text-xs text-amber-200">
          <p className="font-semibold mb-1 text-amber-300">
            Pernyataan Kepatuhan Kebijakan Penggunaan Terbatas Google (Google Limited Use Disclosure):
          </p>
          <p className="italic leading-relaxed">
            &ldquo;Penggunaan dan transfer informasi yang diterima dari Google API oleh LocaCamp ke aplikasi lain mana pun akan mematuhi Kebijakan Data Pengguna Layanan Google API (Google API Services User Data Policy), termasuk persyaratan Penggunaan Terbatas (Limited Use requirements).&rdquo;
          </p>
        </div>

        <p className="text-xs text-slate-400">
          Kami <strong className="text-white">tidak pernah menjual, menyewakan, atau memperjualbelikan</strong> data Google Drive pengguna, alamat email, atau foto Anda kepada pihak mana pun.
        </p>
      </section>

      {/* 4. Penyimpanan Lokal di Perangkat */}
      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-white flex items-center gap-2">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500/20 text-xs font-bold text-emerald-400">
            4
          </span>
          Penyimpanan Lokal (IndexedDB & LocalStorage)
        </h2>
        <p className="text-sm text-slate-300">
          Foto survei yang Anda jepret disimpan langsung di memori peramban perangkat Anda menggunakan teknologi <code className="text-emerald-300 font-mono">IndexedDB</code>, sedangkan preferensi watermark dan setelan kualitas disimpan di <code className="text-emerald-300 font-mono">localStorage</code>. Seluruh data ini tersimpan secara fisik di perangkat Anda dan dapat dihapus kapan saja melalui pengaturan peramban atau galeri riwayat.
        </p>
      </section>

      {/* 5. Kontrol & Hak Pengguna */}
      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-white flex items-center gap-2">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500/20 text-xs font-bold text-emerald-400">
            5
          </span>
          Kendali Penuh di Tangan Pengguna
        </h2>
        <div className="space-y-2 text-sm text-slate-300">
          <p>Anda memegang hak dan kontrol mutlak setiap saat:</p>
          <ul className="list-disc pl-5 space-y-1.5 text-xs text-slate-300">
            <li>
              <strong>Memutuskan Akun Google:</strong> Anda dapat mengklik tombol <em>&ldquo;Putuskan Akun&rdquo;</em> di pengaturan aplikasi kapan saja untuk mencabut sesi token secara instan.
            </li>
            <li>
              <strong>Menghapus Riwayat Foto:</strong> Anda dapat menghapus satu foto atau seluruh foto di memori peramban kapan pun melalui Galeri Riwayat.
            </li>
            <li>
              <strong>Audit Kode Sumber:</strong> Anda dapat meninjau setiap baris logika aplikasi di repositori open source kami.
            </li>
          </ul>
        </div>
      </section>

      {/* 6. Keamanan & Enkripsi */}
      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-white flex items-center gap-2">
          <Lock className="h-5 w-5 text-emerald-400" />
          <span>Keamanan Transmisi & Enkripsi Standar Industri</span>
        </h2>
        <p className="text-sm text-slate-300">
          Seluruh komunikasi antara peramban Anda dan Google API dilindungi oleh enkripsi TLS 1.3 / HTTPS standar tinggi guna mencegah penyadapan data di jaringan publik.
        </p>
      </section>

      {/* 7. Kontak & Keterbukaan Pengembang */}
      <section className="rounded-xl border border-white/10 bg-slate-900/60 p-5">
        <h2 className="text-base font-semibold text-white flex items-center gap-2 mb-2">
          <Mail className="h-4 w-4 text-emerald-400" />
          <span>Pengembang & Kontak Keterbukaan</span>
        </h2>
        <p className="text-xs text-slate-400 leading-relaxed">
          LocaCamp dikembangkan secara independen dan transparan untuk komunitas survei, pemetaan, dan dokumentasi lapangan presisi.
        </p>
        <div className="mt-3 text-xs text-slate-300 space-y-1.5">
          <p><strong className="text-white">Pengembang:</strong> Abdi Syahputra Harahap</p>
          <p><strong className="text-white">Proyek:</strong> LocaCamp (Smart Geotag Camera Web PWA)</p>
          <p><strong className="text-white">Email Resmi:</strong> <span className="text-emerald-400 font-mono">maskoding12@gmail.com</span></p>
          <p>
            <strong className="text-white">Repositori Open Source:</strong>{' '}
            <a
              href="https://github.com/maskodingku/LocaCamp"
              target="_blank"
              rel="noopener noreferrer"
              className="text-emerald-400 font-mono break-all underline hover:text-emerald-300"
            >
              https://github.com/maskodingku/LocaCamp
            </a>
          </p>
        </div>
      </section>
    </div>
  )
}
