# PRD: Modul PPDB/SPMB — Sistem Akademi Pendidikan Simdikta

**Status**: Draft
**Author**: Product Team
**Engineering Lead**: TBD
**Dibuat**: 2026-03-23
**Terakhir Diperbarui**: 2026-03-23
**Riset Sumber**: `docs/product-research/ppdb-terintegrasi.md`

---

## 1. Problem Statement

**Siapa yang mengalami masalah ini?**
Dua kelompok besar:
1. **Sekolah swasta (>180.000 sekolah)** — mayoritas masih mengelola penerimaan siswa baru secara manual (spreadsheet, Google Form, WhatsApp), tanpa sistem terintegrasi yang menghubungkan pendaftaran → seleksi → pembayaran → data akademik.
2. **Sekolah negeri & dinas pendidikan** — menggunakan platform lama (dominasi SIAP PPDB Telkom yang sudah tua, tidak fleksibel) yang tidak terintegrasi dengan Dapodik secara real-time dan belum siap regulasi SPMB 2025/2026.

**Frekuensi & dampak:**
PPDB/SPMB adalah proses tahunan yang berdampak pada jutaan keluarga Indonesia setiap musim ajaran baru (Mei–Juli). Setiap tahun, ribuan sekolah menghadapi kekacauan operasional selama 6–8 minggu karena tidak ada sistem yang memadai.

**Apa yang dilakukan sekarang dan mengapa tidak cukup?**
- Sekolah swasta: Google Form + Excel + WhatsApp manual → tidak ada seleksi otomatis, tidak ada payment terintegrasi, tidak ada audit trail
- Sekolah negeri: SIAP PPDB Telkom → UI/UX usang, tidak integrasi Dapodik, tidak support regulasi SPMB terbaru (Permendikdasmen No. 3/2025)
- Tidak satu pun kompetitor menyediakan: Dapodik sync pasca-PPDB + Dukcapil real-time + multi-jalur SPMB compliant dalam satu platform

**Mengapa sekarang?**
- **Permendikdasmen No. 3/2025** mengubah PPDB menjadi SPMB dengan kuota jalur baru dan kewajiban sistem online untuk semua daerah
- **SE SPMB 2026/2027** mewajibkan nilai TKA nasional sebagai komponen seleksi jalur prestasi — tidak ada kompetitor yang siap
- Window of opportunity: kompetitor lama belum bergerak, regulasi baru menciptakan kebutuhan migrasi

---

## 2. Goals

**Primary Goal:**
Meluncurkan modul PPDB/SPMB yang menjadi sistem penerimaan siswa baru end-to-end pertama di Indonesia yang mengintegrasikan pendaftaran online, seleksi multi-jalur sesuai SPMB 2025, manajemen pembayaran (untuk swasta), dan sinkronisasi Dapodik — dalam satu platform untuk sekolah swasta dan negeri.

**Secondary Goals:**
- Menjadikan integrasi Dapodik dan Dukcapil sebagai differensiator kompetitif yang tidak dimiliki kompetitor manapun
- Membangun fondasi data siswa yang terhubung langsung ke modul akademik Simdikta setelah siswa diterima
- Mencapai product-market fit di segmen sekolah swasta sebagai pintu masuk ke segmen negeri/dinas

---

## 3. Non-Goals

> Hal-hal yang secara eksplisit **tidak** menjadi scope versi ini:

- **Bukan platform dinas pendidikan (B2G)** — white-label untuk pemda ditunda ke fase 2; fokus saat ini adalah per-sekolah (B2B)
- **Bukan modul akademik pasca-PPDB** — pengelolaan kelas, jadwal, rapor, absensi adalah produk terpisah; modul ini berakhir saat siswa masuk Dapodik
- **Tidak membangun integrasi API Dukcapil langsung** di v1 — gunakan validasi dokumen manual + fallback; API integrasi ditarget di v2
- **Tidak membangun tes online sendiri** (CBT) — sekolah swasta yang membutuhkan tes masuk menggunakan link tes eksternal di v1
- **Tidak ada fitur CRM/marketing** untuk promosi sekolah swasta di v1

---

## 4. User Stories

### Epic A: Registrasi & Pendaftaran (Orang Tua / Calon Siswa)

---

#### Story A-1: Registrasi akun pendaftar — P0

> Sebagai **orang tua / calon siswa**, saya ingin **membuat akun dengan data kependudukan** sehingga **saya bisa memulai proses pendaftaran secara online tanpa harus datang ke sekolah**.

**Acceptance Criteria:**
- [ ] Given saya membuka portal PPDB sekolah, when saya mengisi NIK + nomor KK + nomor HP, then sistem memvalidasi format data dan mengirimkan OTP ke nomor HP
- [ ] Given OTP sudah diterima, when saya memasukkan kode OTP yang benar dalam 5 menit, then akun berhasil dibuat dan saya diarahkan ke formulir pendaftaran
- [ ] Given OTP sudah expired, when saya mencoba memasukkan kode tersebut, then sistem menampilkan pesan error dan menawarkan kirim ulang OTP
- [ ] Given NIK yang saya input tidak ditemukan di sistem, when validasi gagal, then sistem menampilkan panduan langkah penyelesaian (cek KK, hubungi Disdukcapil) — **tidak sekadar error mentah**
- [ ] Given saya sudah punya akun dengan nomor HP yang sama, when saya mencoba daftar ulang, then sistem mengarahkan ke halaman login, bukan membuat akun baru

---

#### Story A-2: Pengisian formulir & upload dokumen — P0

> Sebagai **orang tua**, saya ingin **mengisi formulir pendaftaran dan mengunggah dokumen yang diperlukan secara online** sehingga **saya tidak perlu fotokopi dan antre di sekolah**.

**Acceptance Criteria:**
- [ ] Given saya sudah login, when saya mengisi formulir data siswa, then semua field wajib ditandai dengan jelas dan sistem menampilkan validasi inline (bukan hanya saat submit)
- [ ] Given saya mengunggah dokumen KK, when ukuran file melebihi 2MB atau format bukan PDF/JPG/PNG, then sistem menolak upload dan menampilkan panduan teknis yang jelas
- [ ] Given sekolah memiliki jalur afirmasi, when saya memilih jalur tersebut, then sistem secara otomatis menampilkan checklist dokumen tambahan (KIP/KKS/DTKS) yang berbeda dari jalur lain
- [ ] Given saya menyimpan formulir sebagai draft, when saya login kembali esok hari, then semua data yang sudah diisi tersimpan dan bisa dilanjutkan
- [ ] Given saya sudah submit formulir, when saya mencoba mengubah data setelah batas waktu submit, then sistem tidak mengizinkan perubahan dan menampilkan kontak operator sekolah

---

#### Story A-3: Pemantauan status pendaftaran — P0

> Sebagai **orang tua**, saya ingin **memantau status pendaftaran anak saya secara real-time** sehingga **saya tidak perlu telepon ke sekolah berulang kali untuk mengetahui perkembangan**.

**Acceptance Criteria:**
- [ ] Given saya sudah submit pendaftaran, when saya membuka dashboard, then saya melihat status terkini (Menunggu Verifikasi / Dokumen Perlu Diperbaiki / Terverifikasi / Dalam Seleksi / Diterima / Tidak Diterima)
- [ ] Given status pendaftaran saya berubah, when perubahan terjadi, then saya menerima notifikasi WhatsApp **dan** email dalam waktu < 5 menit
- [ ] Given dokumen saya ditolak oleh verifikator, when saya menerima notifikasi, then notifikasi menyertakan catatan spesifik dokumen mana yang bermasalah dan alasannya
- [ ] Given saya berada di jalur domisili, when proses seleksi berjalan, then saya dapat melihat posisi ranking saya saat ini beserta total pendaftar di jalur tersebut

---

### Epic B: Verifikasi Dokumen (Operator Sekolah / Panitia PPDB)

---

#### Story B-1: Dashboard verifikasi dokumen — P0

> Sebagai **operator verifikasi**, saya ingin **memeriksa dokumen pendaftar satu per satu dengan antarmuka yang efisien** sehingga **proses verifikasi ratusan pendaftar dapat diselesaikan dalam waktu yang wajar tanpa kehilangan detail**.

**Acceptance Criteria:**
- [ ] Given ada 100+ pendaftar masuk, when saya membuka dashboard verifikasi, then saya melihat daftar terurut berdasarkan waktu submit, dengan filter status (Belum Diverifikasi / Perlu Perbaikan / Selesai)
- [ ] Given saya mengklik satu pendaftar, when halaman verifikasi terbuka, then formulir data dan semua dokumen yang diunggah tampil berdampingan (side-by-side) dalam satu layar tanpa scroll berlebihan
- [ ] Given saya menemukan dokumen tidak sesuai, when saya memilih "Perlu Perbaikan", then sistem meminta saya mengisi catatan spesifik (teks bebas) sebelum menyimpan status
- [ ] Given saya sudah memverifikasi satu pendaftar, when saya mengklik "Simpan & Lanjut", then sistem otomatis membuka pendaftar berikutnya yang belum diverifikasi
- [ ] Given ada dua operator sekolah yang bekerja bersamaan, when keduanya membuka pendaftar yang sama, then sistem menampilkan indikator "Sedang diperiksa oleh [nama]" untuk mencegah konflik

---

#### Story B-2: Audit trail verifikasi — P1

> Sebagai **kepala sekolah**, saya ingin **melihat log lengkap siapa yang memverifikasi dokumen dan kapan** sehingga **saya dapat mendeteksi dan menginvestigasi jika ada manipulasi data**.

**Acceptance Criteria:**
- [ ] Given operator mengubah status pendaftar, when perubahan disimpan, then sistem mencatat: waktu (timestamp), nama operator, status sebelum, status sesudah, dan catatan
- [ ] Given saya membuka halaman audit trail, when saya memfilter berdasarkan nama operator dan rentang tanggal, then hasil menampilkan semua aksi yang dilakukan operator tersebut
- [ ] Given audit trail sudah tersimpan, when siapapun (termasuk super admin) mencoba menghapus atau mengubah log tersebut, then sistem menolak operasi tersebut — log bersifat immutable
- [ ] Given ada aksi verifikasi yang tidak wajar (1 operator memverifikasi 200 dokumen dalam 1 jam), when pola anomali terdeteksi, then sistem memflag kejadian tersebut untuk ditinjau kepala sekolah

---

### Epic C: Seleksi Multi-Jalur (Sistem Otomatis)

---

#### Story C-1: Seleksi jalur domisili/zonasi — P0

> Sebagai **panitia PPDB**, saya ingin **sistem melakukan kalkulasi dan ranking jalur domisili secara otomatis berdasarkan jarak GPS** sehingga **proses seleksi transparan, tidak bisa dimanipulasi, dan selesai tanpa perhitungan manual**.

**Acceptance Criteria:**
- [ ] Given pendaftar telah terverifikasi pada jalur domisili, when sistem menjalankan seleksi, then ranking dihitung menggunakan formula jarak Haversine antara koordinat GPS alamat KK pendaftar dan koordinat sekolah
- [ ] Given dua pendaftar memiliki jarak yang persis sama ke sekolah, when sistem mengurutkan ranking, then tiebreaker menggunakan usia (lebih tua = prioritas lebih tinggi), sesuai Permendikdasmen No. 3/2025
- [ ] Given admin mengubah konfigurasi peta zona, when seleksi dijalankan ulang, then sistem merecalculate ranking semua pendaftar di jalur domisili secara otomatis
- [ ] Given kuota jalur domisili sudah terisi penuh, when ada pendaftar baru yang mendaftar di jalur domisili, then sistem menampilkan peringatan bahwa kuota sudah penuh kepada pendaftar (namun tetap mengizinkan pendaftaran untuk posisi waiting list)

---

#### Story C-2: Seleksi jalur prestasi dengan TKA — P0

> Sebagai **panitia PPDB**, saya ingin **mengintegrasikan nilai TKA nasional ke dalam seleksi jalur prestasi** sehingga **sekolah kami comply dengan SE SPMB 2026/2027 tanpa proses manual**.

**Acceptance Criteria:**
- [ ] Given admin mengunggah file CSV hasil TKA dari portal Kemendikdasmen, when file diproses, then sistem mencocokkan data berdasarkan NISN dan memasukkan nilai TKA ke profil setiap pendaftar yang NISN-nya ditemukan
- [ ] Given ada NISN di file TKA yang tidak ada dalam daftar pendaftar, when import selesai, then sistem menampilkan daftar NISN yang tidak cocok untuk ditinjau admin
- [ ] Given sekolah menggunakan komponen nilai rapor, when sistem menghitung skor jalur prestasi, then formula kalkulasi = (bobot nilai rapor × rata-rata 5 semester) + (bobot TKA × nilai TKA) + poin piagam, dengan bobot yang dapat dikonfigurasi admin
- [ ] Given admin ingin melihat hasil seleksi sebelum diumumkan, when admin menggunakan fitur "Simulasi Seleksi", then sistem menampilkan daftar ranking lengkap tanpa mempublikasikan ke pendaftar

---

#### Story C-3: Konfigurasi kuota per jalur — P0

> Sebagai **admin sekolah**, saya ingin **mengatur kuota per jalur seleksi sesuai regulasi SPMB dan kapasitas sekolah saya** sehingga **sistem seleksi berjalan dalam parameter yang sudah saya tentukan**.

**Acceptance Criteria:**
- [ ] Given saya membuka konfigurasi PPDB, when saya mengatur kuota jalur untuk jenjang SMA (negeri), then sistem menampilkan peringatan jika kuota jalur domisili < 30% dari daya tampung (tidak sesuai Permendikdasmen No. 3/2025)
- [ ] Given total kuota semua jalur melebihi daya tampung, when saya mencoba menyimpan konfigurasi, then sistem menolak dan menampilkan notifikasi ketidaksesuaian beserta detail perhitungan
- [ ] Given saya adalah sekolah swasta, when saya mengatur jalur seleksi, then sistem menyediakan opsi jalur kustom (Tes Akademik, Psikotes, Wawancara, dll.) di luar 4 jalur standar SPMB
- [ ] Given periode PPDB sudah aktif dan ada pendaftar masuk, when admin mencoba mengubah kuota jalur yang sudah ada pendaftarnya, then sistem meminta konfirmasi eksplisit dengan menampilkan dampak perubahan terhadap ranking existing

---

### Epic D: Pengumuman & Dashboard Publik

---

#### Story D-1: Pengumuman hasil seleksi terjadwal — P0

> Sebagai **panitia PPDB**, saya ingin **mengatur jadwal pengumuman hasil seleksi yang auto-publish** sehingga **hasil diumumkan tepat waktu tanpa perlu ada operator yang online pada saat pengumuman**.

**Acceptance Criteria:**
- [ ] Given admin menetapkan waktu pengumuman (misal: 14 Juli 2026 pukul 10.00 WIB), when waktu tersebut tiba, then sistem otomatis mempublikasikan hasil dan mengirim notifikasi massal ke seluruh pendaftar
- [ ] Given pengumuman sudah dipublikasikan, when pendaftar yang diterima mengakses portal, then mereka dapat mengunduh surat penerimaan (PDF dengan logo sekolah) secara mandiri
- [ ] Given notifikasi massal dikirim, when lebih dari 1000 penerima, then sistem menggunakan antrian (queue) untuk pengiriman sehingga tidak overload; estimasi waktu penyelesaian ditampilkan ke admin
- [ ] Given admin ingin membatalkan pengumuman yang sudah terjadwal (misal: ada kesalahan), when pembatalan dilakukan minimal 30 menit sebelum jadwal, then sistem membatalkan pengumuman otomatis dan meminta konfirmasi jadwal baru

---

#### Story D-2: Dashboard publik real-time — P0

> Sebagai **masyarakat / orang tua yang belum mendaftar**, saya ingin **melihat informasi PPDB sekolah secara publik** sehingga **saya bisa membuat keputusan pendaftaran berdasarkan data terkini tanpa perlu login**.

**Acceptance Criteria:**
- [ ] Given siapapun mengakses URL publik sekolah, when halaman terbuka, then ditampilkan: daya tampung per jalur, jumlah pendaftar per jalur, kuota tersisa per jalur — diperbarui setiap 60 detik
- [ ] Given sekolah menggunakan jalur domisili, when halaman publik dimuat, then peta wilayah zonasi sekolah ditampilkan secara interaktif (orang tua bisa cek apakah alamatnya masuk zona)
- [ ] Given pengumuman belum dilakukan, when orang tua mengakses halaman ranking, then informasi ranking hanya menampilkan posisi pendaftar sendiri (setelah login) — bukan daftar lengkap semua nama pendaftar
- [ ] Given pengumuman sudah dipublikasikan, when publik mengakses halaman hasil, then daftar siswa yang diterima ditampilkan dengan nama dan nomor pendaftaran (tanpa NIK atau data sensitif lainnya)

---

### Epic E: Daftar Ulang & Pembayaran (Prioritas Swasta)

---

#### Story E-1: Portal daftar ulang siswa diterima — P0

> Sebagai **siswa yang diterima**, saya ingin **menyelesaikan proses daftar ulang secara online** sehingga **saya tidak perlu datang ke sekolah hanya untuk mengisi formulir ulang yang datanya sudah ada**.

**Acceptance Criteria:**
- [ ] Given saya dinyatakan diterima, when saya login ke portal daftar ulang, then data yang sudah saya isi saat pendaftaran terisi otomatis — saya hanya melengkapi data yang belum ada
- [ ] Given deadline daftar ulang ditetapkan (misal: 3 hari setelah pengumuman), when batas waktu terlewat tanpa konfirmasi daftar ulang, then sistem otomatis mengubah status siswa menjadi "Tidak Daftar Ulang" dan membebaskan kursi (daya tampung bertambah kembali)
- [ ] Given sekolah memiliki pembayaran yang diperlukan saat daftar ulang, when siswa mengakses portal, then tagihan ditampilkan dengan rincian komponen biaya dan tombol bayar langsung dari halaman yang sama
- [ ] Given siswa menyelesaikan daftar ulang, when semua persyaratan terpenuhi (dokumen + pembayaran jika ada), then status berubah menjadi "Terdaftar Resmi" dan siswa mendapat konfirmasi resmi

---

#### Story E-2: Manajemen pembayaran multi-channel — P1

> Sebagai **bendahara sekolah swasta**, saya ingin **mengelola pembayaran uang pangkal dan biaya awal dari satu dashboard** sehingga **saya tidak perlu mengecek mutasi bank manual dan rekonsiliasi pembayaran bisa dilakukan dalam hitungan menit**.

**Acceptance Criteria:**
- [ ] Given sekolah mengaktifkan pembayaran online, when siswa memilih metode bayar, then tersedia opsi: Virtual Account (multi-bank: BCA, BNI, BRI, Mandiri, BSI), QRIS, dan transfer manual dengan konfirmasi
- [ ] Given siswa membayar via Virtual Account, when pembayaran terdeteksi di bank, then status pembayaran di dashboard admin berubah otomatis dalam waktu < 5 menit tanpa input manual
- [ ] Given siswa membayar via transfer manual, when siswa mengupload bukti transfer, then admin mendapat notifikasi dan dapat mengonfirmasi/menolak pembayaran dengan satu klik
- [ ] Given admin membuka laporan pembayaran, when periode ditetapkan, then laporan menampilkan: total tagihan, total terbayar, tunggakan, daftar siswa per status pembayaran — dapat diekspor ke Excel/PDF
- [ ] Given deadline pembayaran mendekati (H-3, H-1), when belum ada pembayaran dari siswa terdaftar, then sistem otomatis mengirim reminder ke orang tua via WhatsApp

---

### Epic F: Integrasi Dapodik — P1

---

#### Story F-1: Export data siswa baru ke format Dapodik — P1

> Sebagai **operator Dapodik sekolah**, saya ingin **mengekspor data seluruh siswa baru yang sudah daftar ulang dalam format yang langsung bisa diimport ke aplikasi Dapodik** sehingga **saya tidak perlu mengetik ulang data ratusan siswa**.

**Acceptance Criteria:**
- [ ] Given semua siswa baru sudah menyelesaikan daftar ulang, when operator mengklik "Export Dapodik", then sistem menghasilkan file dalam format yang sesuai spesifikasi import Dapodik (CSV atau Excel sesuai template Pusdatin)
- [ ] Given export selesai, when operator mengimport file ke aplikasi Dapodik, then data siswa berhasil masuk tanpa error validasi format
- [ ] Given ada siswa yang data-nya tidak lengkap (misal: NISN belum terverifikasi), when operator mencoba export, then sistem menampilkan daftar siswa yang datanya belum siap export beserta field yang perlu dilengkapi
- [ ] Given export sudah dilakukan, when ada perubahan data siswa setelah export, then sistem menandai siswa tersebut sebagai "Perlu Re-export" di dashboard operator

---

### Epic G: Konfigurasi & Administrasi Sistem — P0

---

#### Story G-1: Setup PPDB oleh admin sekolah — P0

> Sebagai **admin sekolah**, saya ingin **mengkonfigurasi seluruh parameter PPDB (jadwal, jalur, kuota, dokumen wajib) sebelum pendaftaran dibuka** sehingga **sistem berjalan otomatis sesuai ketentuan sekolah tanpa perlu intervensi teknis**.

**Acceptance Criteria:**
- [ ] Given admin membuka wizard setup PPDB, when wizard dimulai, then ada panduan langkah demi langkah: (1) Informasi umum → (2) Periode pendaftaran → (3) Konfigurasi jalur & kuota → (4) Dokumen persyaratan → (5) Preview & Aktivasi
- [ ] Given admin selesai setup, when admin mengklik "Aktifkan PPDB", then sistem melakukan validasi keseluruhan: kuota valid, dokumen wajib ada, jadwal tidak overlap — dan hanya mengizinkan aktivasi jika semua validasi lulus
- [ ] Given PPDB sudah aktif dan ada pendaftar masuk, when admin mencoba mengubah konfigurasi jalur/kuota, then perubahan memerlukan konfirmasi eksplisit dengan menampilkan dampak terhadap pendaftar yang sudah masuk
- [ ] Given sekolah memiliki PPDB tahun sebelumnya di sistem, when admin setup PPDB baru, then admin dapat memilih "Salin dari tahun lalu" sebagai titik awal konfigurasi

---

## 5. Technical Requirements

> Persyaratan non-fungsional yang harus dipenuhi engineering.

- **Performa**: Response time < 2 detik (p95) untuk semua operasi. Halaman publik ranking < 1 detik.
- **Skalabilitas**: Mendukung minimal 500 concurrent users per sekolah. Untuk platform dinas (fase 2): 10.000 concurrent users.
- **Ketersediaan**: Uptime 99.9% (termasuk periode puncak PPDB Mei–Juli). Maintenance window hanya di luar jam 06.00–22.00 WIB.
- **Keamanan**:
  - HTTPS/TLS 1.3 untuk semua komunikasi
  - AES-256 enkripsi untuk data sensitif (NIK, data KK) at rest
  - Proteksi OWASP Top 10 (SQL injection, XSS, CSRF)
  - Rate limiting pada endpoint OTP (maks. 3 request/menit per nomor HP)
- **Kepatuhan privasi**: Sesuai UU PDP No. 27/2022 — data NIK/KK tidak boleh ditampilkan lengkap di antarmuka (masking: xxxxxx****xx)
- **Aksesibilitas**: Mobile-first responsive. Berfungsi di koneksi 3G (minimal). Browser: Chrome, Firefox, Safari, Edge (2 versi terakhir).
- **Integrasi**: Mekanisme fallback manual jika API Dukcapil atau Dapodik down (sistem tidak boleh crash karena dependency eksternal)
- **Audit**: Log aktivitas immutable — tidak dapat dihapus oleh siapapun, termasuk super admin
- **Backup**: Daily automated backup, retensi 90 hari. RTO < 4 jam, RPO < 1 jam.

---

## 6. Success Metrics

| Metrik | Baseline | Target | Timeframe |
|---|---|---|---|
| Jumlah sekolah onboarded | 0 | 50 sekolah aktif | 6 bulan setelah launch |
| Jumlah siswa diproses via platform | 0 | 10.000 siswa/tahun ajaran | Tahun ajaran pertama |
| Waktu setup PPDB oleh admin (end-to-end) | N/A (manual, 1-2 hari) | < 2 jam via wizard | Per sekolah onboarding |
| Waktu verifikasi dokumen per pendaftar | 5–15 menit (manual) | < 3 menit via dashboard | Selama periode PPDB aktif |
| Error rate integrasi Dapodik export | N/A | < 2% field error saat import | Per batch export |
| Uptime selama periode puncak PPDB | N/A | ≥ 99.5% (Mei–Juli) | Per tahun ajaran |
| NPS operator sekolah (admin TU) | N/A | ≥ 40 | Survei 30 hari post-PPDB |
| Retention sekolah (renew tahun berikutnya) | N/A | ≥ 80% | Tahun kedua |

---

## 7. Dependencies

- [ ] **Payment Gateway (Midtrans/Xendit)** — kontrak dan integrasi API untuk Virtual Account, QRIS, dan transfer konfirmasi — Status: Belum dimulai
- [ ] **WhatsApp Business API / provider** — untuk OTP, notifikasi status, dan reminder pembayaran — Status: Belum dimulai
- [ ] **SMS Gateway** — fallback OTP jika WhatsApp tidak tersedia — Status: Belum dimulai
- [ ] **Google Maps API atau Mapbox** — untuk kalkulasi jarak GPS dan peta zonasi interaktif — Status: Belum dimulai
- [ ] **Spesifikasi format Dapodik (Pusdatin Kemendikdasmen)** — template import resmi untuk export data siswa — Status: Perlu riset teknis
- [ ] **API Dukcapil (Kemendagri)** — validasi NIK real-time (v2); v1 menggunakan validasi manual — Status: Belum ada akses, perlu pengajuan

---

## 8. Risks & Mitigations

| Risiko | Likelihood | Impact | Mitigasi |
|---|---|---|---|
| API Dukcapil tidak tersedia / lambat di v1 | Tinggi | Sedang | Fallback ke validasi dokumen manual; antrian async untuk validasi API |
| Server down saat puncak PPDB (lonjakan traffic tiba-tiba) | Sedang | Tinggi | Load testing sebelum musim PPDB; auto-scaling; queue system untuk operasi berat |
| Format import Dapodik berubah tanpa notice | Sedang | Sedang | Abstraksi format export ke konfigurasi; update template dalam < 48 jam saat ada perubahan |
| Regulasi SPMB berubah di tengah pengembangan | Sedang | Tinggi | Konfigurasi kuota/jalur berbasis rule engine, bukan hardcode; tim monitor regulasi aktif |
| Rendahnya adopsi oleh sekolah swasta yang tidak melek digital | Sedang | Sedang | Wizard onboarding step-by-step; customer success support aktif selama setup pertama |
| Resistensi sekolah negeri (sudah terikat kontrak SIAP PPDB Telkom) | Tinggi | Sedang | Fokus sekolah swasta di v1; masuk ke negeri via yayasan yang punya sekolah swasta & negeri |
| Kecurangan data pendaftar (manipulasi koordinat GPS) | Sedang | Tinggi | Validasi koordinat GPS vs data KK Dukcapil; flag anomali jika koordinat tidak konsisten; audit trail |

---

## 9. Perbedaan Mode Operasi: Negeri vs Swasta

| Fitur | Mode SPMB (Sekolah Negeri) | Mode Mandiri (Sekolah Swasta) |
|---|---|---|
| Jalur seleksi tersedia | 4 jalur wajib (domisili, afirmasi, prestasi, mutasi) | Kustom (tes akademik, psikotes, dll. bisa ditambah) |
| Konfigurasi kuota | Dibatasi: harus sesuai Permendikdasmen No. 3/2025 | Bebas dikonfigurasi |
| Zonasi GPS | Wajib aktif | Tidak tersedia |
| Validasi DTKS/KIP | Wajib (jalur afirmasi) | Opsional |
| Integrasi TKA | Wajib aktif (mulai 2026) | Opsional |
| Dashboard publik | Wajib aktif | Opsional |
| Modul pembayaran | Tidak tersedia (sekolah negeri dilarang pungut) | Wajib tersedia, konfigurasi penuh |
| Multi-gelombang | Tidak tersedia | Tersedia (gelombang 1, 2, 3+) |
| Jadwal PPDB | Mengikuti jadwal dinas | Fleksibel, bisa sepanjang tahun |

> Mode dipilih saat setup awal dan berdampak pada fitur yang ditampilkan di antarmuka admin.

---

## 10. Timeline

| Milestone | Target Tanggal | Owner |
|---|---|---|
| PRD Approved oleh stakeholder | 2026-04-05 | Product Team |
| Technical Design selesai | 2026-04-20 | Tech Lead |
| Fase 1: Core registrasi + verifikasi | 2026-05-31 | Engineering |
| Fase 2: Seleksi multi-jalur + pengumuman | 2026-06-30 | Engineering |
| Fase 3: Daftar ulang + pembayaran + Dapodik export | 2026-07-31 | Engineering |
| Beta testing dengan 5 sekolah pilot | 2026-08-15 | Product + CS |
| General Availability (GA) — siap musim PPDB 2027 | 2026-10-01 | Semua Tim |

---

## 11. Open Questions

- [ ] **Format resmi export Dapodik** — apakah tersedia API import Dapodik atau hanya file CSV/Excel? — Owner: Engineering Lead — Due: 2026-04-10
- [ ] **Akses API Dukcapil** — apakah Simdikta bisa mendaftar sebagai mitra Kemendagri untuk akses API validasi NIK? Berapa lama prosesnya? — Owner: Product/Legal — Due: 2026-04-15
- [ ] **Pilihan payment gateway** — Midtrans vs Xendit vs Doku vs kombinasi? Pertimbangan: coverage bank lokal (BSI, BJB), fee transaksi — Owner: Finance + Engineering — Due: 2026-04-10
- [ ] **Strategi WhatsApp API** — gunakan WhatsApp Business API langsung (Meta) atau via BSP (Wati, Twilio, dll.)? Implikasi biaya dan delivery rate? — Owner: Engineering — Due: 2026-04-10
- [ ] **Hosting/infrastruktur** — self-hosted cloud (AWS/GCP) atau managed? Pertimbangan: data residency Indonesia (UU PDP) — Owner: Engineering Lead — Due: 2026-04-20
- [ ] **Skema pricing produk** — per sekolah/bulan? Per siswa? Bundle dengan modul akademik? Perlu keputusan sebelum go-to-market — Owner: Product + Business — Due: 2026-04-30

---

## Appendix

### Sumber Riset
- Dokumen riset lengkap: `docs/product-research/ppdb-terintegrasi.md`
- Permendikdasmen No. 3/2025: https://peraturan.bpk.go.id/Details/315671/permendikdasmen-no-3-tahun-2025
- SE SPMB 2026: https://bbpmpjabar.kemendikdasmen.go.id/penguatan-regulasi-spmb-2026-hasil-tka-dimanfaatkan-pada-jalur-prestasi/
- Permendikbud 79/2015 (Dapodik): https://luk.staff.ugm.ac.id/atur/Permendikbud79-2015DataPokokPendidikan.pdf

### Kompetitor yang Dianalisis
| Kompetitor | Posisi | Gap yang Kita Isi |
|---|---|---|
| SIAP PPDB Telkom | Market leader negeri (B2G), tua | Swasta tidak terlayani, tidak ada Dapodik sync |
| AdminSekolah.net | All-in-one, PPDB sebagai add-on | PPDB tidak mendalam, tidak multi-jalur |
| SkoolaCloud | Boarding school, 26 provinsi | Tidak ada multi-jalur SPMB, tidak ada payment gateway lengkap |
| PPDBSekolah.com | PPDB specialist swasta | Tidak ada pasca-PPDB, tidak ada Dapodik sync |

### Definisi Istilah
- **SPMB**: Sistem Penerimaan Murid Baru — nama resmi pengganti PPDB sejak Permendikdasmen No. 3/2025
- **TKA**: Tes Kemampuan Akademik — tes nasional standar yang mulai diwajibkan di jalur prestasi SPMB 2026
- **Dapodik**: Data Pokok Pendidikan — database tunggal pendidikan nasional Kemendikdasmen
- **Dukcapil**: Direktorat Jenderal Kependudukan dan Catatan Sipil (Kemendagri) — pemilik database NIK/KK nasional
- **DTKS**: Data Terpadu Kesejahteraan Sosial — database penerima bantuan sosial (Kemensos)
- **KIP**: Kartu Indonesia Pintar — program bantuan pendidikan pemerintah
