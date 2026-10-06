import React from 'react'
import { ShieldCheck, Camera, MapPin, HardDrive, Lock, RefreshCw, Mail } from 'lucide-react'

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
            Kebijakan Privasi Resmi
          </span>
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
          Kebijakan Privasi LocaCamp
        </h1>
        <p className="mt-2 text-sm text-slate-400">
          Terakhir Diperbarui: 6 Oktober 2026 • Berlaku Efektif untuk Pengguna LocaCamp PWA
        </p>
      </div>

      {/* 1. Pendahuluan */}
      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-white flex items-center gap-2">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500/20 text-xs font-bold text-emerald-400">
            1
          </span>
          Pendahuluan & Komitmen Privasi
        </h2>
        <p className="text-sm text-slate-300">
          Selamat datang di <strong className="text-white">LocaCamp</strong> (aplikasi kamera cerdas web berbasis Progressive Web App untuk survei lapangan presisi). Privasi Anda adalah prioritas utama kami. Kebijakan Privasi ini menjelaskan bagaimana LocaCamp mengumpulkan, menggunakan, dan melindungi informasi Anda saat menggunakan aplikasi kamera kami.
        </p>
        <p className="text-sm text-slate-300">
          LocaCamp beroperasi dengan prinsip <em>Client-First & Privacy by Design</em>: sebagian besar proses pemrosesan data (seperti komposit watermark, stempel koordinat geotagging satelit, dan filter visual kamera) dilakukan secara langsung di peramban (browser) perangkat Anda tanpa dikirimkan ke server pihak ketiga mana pun kecuali atas persetujuan sadar Anda saat mencadangkan ke Google Drive pribadi.
        </p>
      </section>

      {/* 2. Izin Perangkat yang Digunakan */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-white flex items-center gap-2">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500/20 text-xs font-bold text-emerald-400">
            2
          </span>
          Izin Perangkat yang Kami Akses
        </h2>
        
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-xl border border-white/10 bg-slate-900/60 p-4">
            <div className="flex items-center gap-2.5 text-emerald-400 mb-2 font-medium text-sm">
              <Camera className="h-4 w-4" />
              <span>Akses Kamera (Video Stream)</span>
            </div>
            <p className="text-xs text-slate-400 leading-normal">
              Digunakan semata-mata untuk menampilkan live preview jendela bidik (viewfinder) dan menjepret foto survei. Aliran video diproses langsung secara lokal di kartu grafis / kanvas peramban perangkat Anda. Kami tidak merekam atau mentransmisikan video tanpa sepengetahuan Anda.
            </p>
          </div>

          <div className="rounded-xl border border-white/10 bg-slate-900/60 p-4">
            <div className="flex items-center gap-2.5 text-emerald-400 mb-2 font-medium text-sm">
              <MapPin className="h-4 w-4" />
              <span>Sensor Lokasi GPS & Kompas</span>
            </div>
            <p className="text-xs text-slate-400 leading-normal">
              Digunakan untuk membaca koordinat (Lintang, Bujur), akurasi sinyal, elevasi, dan arah mata angin kompas saat tombol rana ditekan, guna dicetak pada watermark resmi dan minimap foto survei. Lokasi tidak pernah dilacak secara pasif di latar belakang saat aplikasi ditutup.
            </p>
          </div>
        </div>
      </section>

      {/* 3. Integrasi Google Drive & Kepatuhan Google API */}
      <section className="space-y-4 rounded-2xl border border-teal-500/30 bg-teal-950/20 p-5 sm:p-6">
        <div className="flex items-center gap-2 text-teal-300 font-semibold text-base">
          <HardDrive className="h-5 w-5 text-teal-400" />
          <span>3. Integrasi Google Drive & Kepatuhan Kebijakan Pengguna Google</span>
        </div>

        <p className="text-sm text-slate-300">
          LocaCamp menyediakan fitur opsional pencadangan awan (cloud backup) langsung ke akun Google Drive pribadi pengguna melalui protokol OAuth 2.0 resmi Google.
        </p>

        <div className="space-y-3 rounded-xl border border-white/10 bg-slate-950/70 p-4 text-xs">
          <p className="font-semibold text-white">
            Batasan Akses & Isolasi Folder (Drive Scope: <code>drive.file</code>):
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-slate-300">
            <li>
              Aplikasi hanya meminta izin scope <code className="text-teal-300 font-mono break-all">https://www.googleapis.com/auth/drive.file</code>. Izin ini dibatasi khusus hanya pada file yang diunggah atau dibuat langsung oleh aplikasi LocaCamp.
            </li>
            <li>
              Seluruh foto survei yang Anda pilih untuk dicadangkan otomatis disimpan ke dalam folder khusus bernama <strong className="text-white">LocaCamp Photos</strong> di Google Drive Anda.
            </li>
            <li>
              <strong className="text-emerald-400">Isolasi Privasi Total:</strong> LocaCamp <strong className="text-white">TIDAK BISA dan TIDAK AKAN PERNAH</strong> membaca, melihat, mengedit, mengunduh, atau menghapus berkas, folder, dokumen, spreadsheet, atau foto pribadi lainnya yang sudah ada di Google Drive Anda.
            </li>
            <li>
              <strong className="text-emerald-400">Tidak Ada Server Perantara:</strong> Unggahan foto dilakukan secara langsung (*direct peer-to-cloud*) dari peramban Anda ke server Google Cloud tanpa melalui server perantara pihak ketiga.
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
          Kami <strong className="text-white">tidak pernah menjual, menyewakan, atau memperjualbelikan</strong> data Google Drive pengguna, alamat email, atau foto Anda kepada pengiklan, pialang data (data broker), atau pihak ketiga mana pun.
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
          LocaCamp menggunakan teknologi basis data lokal peramban (<code className="text-emerald-300 font-mono">IndexedDB</code>) untuk menyimpan foto-foto hasil jepretan Anda secara offline di perangkat, serta <code className="text-emerald-300 font-mono">localStorage</code> untuk mengingat preferensi watermark, filter kamera, dan pengaturan antrian upload. Data ini sepenuhnya berada di bawah kendali fisik perangkat Anda.
        </p>
      </section>

      {/* 5. Kontrol & Penghapusan Data */}
      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-white flex items-center gap-2">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500/20 text-xs font-bold text-emerald-400">
            5
          </span>
          Kontrol & Hak Penghapusan Data oleh Pengguna
        </h2>
        <div className="space-y-2 text-sm text-slate-300">
          <p>Anda memegang kendali penuh atas data Anda setiap saat:</p>
          <ul className="list-disc pl-5 space-y-1.5 text-xs text-slate-300">
            <li>
              <strong>Memutuskan Akun Google:</strong> Anda dapat mengklik tombol <em>&ldquo;Putuskan Akun&rdquo;</em> di menu Pengaturan Google Drive aplikasi kapan saja untuk mencabut token sesi seketika, atau melalui portal <a href="https://myaccount.google.com/permissions" target="_blank" rel="noopener noreferrer" className="text-emerald-400 underline">Izin Akun Google</a>.
            </li>
            <li>
              <strong>Menghapus Riwayat Foto:</strong> Anda dapat menghapus satu per satu atau mengosongkan seluruh foto yang tersimpan di memori browser melalui tombol hapus pada Galeri Riwayat.
            </li>
            <li>
              <strong>Reset Pengaturan:</strong> Pengaturan watermark dan preferensi kamera dapat dikembalikan ke konfigurasi awal pabrik kapan saja.
            </li>
          </ul>
        </div>
      </section>

      {/* 6. Keamanan Data */}
      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-white flex items-center gap-2">
          <Lock className="h-5 w-5 text-emerald-400" />
          <span>Keamanan Data</span>
        </h2>
        <p className="text-sm text-slate-300">
          Semua transmisi data antara aplikasi dan layanan Google Drive dienkripsi menggunakan protokol aman HTTPS / TLS 1.3 standar industri perbankan dan cloud terpercaya.
        </p>
      </section>

      {/* 7. Perubahan Kebijakan */}
      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-white flex items-center gap-2">
          <RefreshCw className="h-5 w-5 text-emerald-400" />
          <span>Pembaruan Kebijakan Privasi</span>
        </h2>
        <p className="text-sm text-slate-300">
          Kami dapat memperbarui Kebijakan Privasi ini dari waktu ke waktu untuk menyesuaikan dengan fitur baru atau regulasi hukum yang berlaku. Tanggal pembaruan terkini akan selalu ditampilkan di bagian atas dokumen ini.
        </p>
      </section>

      {/* 8. Hubungi Kami */}
      <section className="rounded-xl border border-white/10 bg-slate-900/60 p-5">
        <h2 className="text-base font-semibold text-white flex items-center gap-2 mb-2">
          <Mail className="h-4 w-4 text-emerald-400" />
          <span>Kontak & Pengembang Resmi</span>
        </h2>
        <p className="text-xs text-slate-400 leading-relaxed">
          Jika Anda memiliki pertanyaan, saran, atau permintaan terkait privasi dan pengelolaan data aplikasi LocaCamp, silakan hubungi tim pengembang kami:
        </p>
        <div className="mt-3 text-xs text-slate-300 space-y-1">
          <p><strong className="text-white">Pengembang:</strong> Abdi Syahputra Harahap</p>
          <p><strong className="text-white">Proyek:</strong> LocaCamp (Smart Geotag Camera PWA)</p>
          <p><strong className="text-white">Email Dukungan:</strong> <span className="text-emerald-400 font-mono">maskoding12@gmail.com</span></p>
          <p><strong className="text-white">Repositori:</strong> <span className="text-slate-400 font-mono break-all">https://github.com/maskodingku/LocaCamp</span></p>
        </div>
      </section>
    </div>
  )
}
