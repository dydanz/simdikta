Status: ✅ Up-to-date
Version: v1.1.0
Last Updated: 2026-03-29
Depends On: Product Research v1.0.0 — ppdb-terintegrasi.md

---

# PRD: Modul PPDB/SPMB — Sistem Akademi Pendidikan Simdikta

**Author**: Product Team
**Engineering Lead**: TBD
**Dibuat**: 2026-03-23
**Terakhir Diperbarui**: 2026-03-29
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

> Hal-hal yang secara eksplisit **tidak** menjadi scope v1 ini:

- **Bukan platform dinas pendidikan (B2G)** — white-label untuk pemda ditunda ke v2; fokus saat ini adalah per-sekolah (B2B). "Regulatory-heavy design" bukan berarti B2G — sekolah wajib comply regulasi, bukan berarti kita menjual ke pemerintah.
- **Bukan modul akademik pasca-PPDB** — pengelolaan kelas, jadwal, rapor, absensi adalah produk terpisah; modul ini berakhir saat siswa masuk Dapodik
- **Tidak ada multi-school cross-school orchestration** di v1 — sistem pilihan 1/2/3 lintas sekolah (koordinasi dinas) adalah v2. v1 mendukung multi-jalur priority *dalam satu sekolah*.
- **Tidak membangun integrasi API Dukcapil langsung** di v1 — validasi dokumen manual + fallback; API Dukcapil real-time ditarget di v2
- **Tidak membangun tes online sendiri** (CBT internal) — sekolah yang butuh tes masuk gunakan link tes eksternal di v1
- **Tidak ada fitur CRM/marketing** untuk promosi sekolah di v1
- **Tidak ada fraud detection lanjutan** (device fingerprint, KK-sharing clustering, fake address heatmap) — v2. v1 mendukung flag anomali GPS sederhana.
- **Tidak ada API TKA otomatis** di v1 — admin upload CSV manual dari portal Kemendikdasmen
- **Tidak ada dashboard dinas / analytics cross-school** di v1

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

#### Story C-4: Multi-jalur priority selection (pilihan 1/2/3) — P1

> Sebagai **pendaftar di sekolah negeri**, saya ingin **memilih lebih dari satu jalur seleksi dengan urutan prioritas** sehingga **jika jalur utama saya tidak lolos (kuota penuh), sistem otomatis mempertimbangkan saya di jalur prioritas berikutnya**.

**Acceptance Criteria:**
- [ ] Given sekolah negeri mengaktifkan fitur multi-jalur, when pendaftar memilih jalur, then pendaftar dapat menentukan jalur pilihan 1 (utama) dan opsional jalur pilihan 2 — dengan ketentuan bahwa persyaratan dokumen masing-masing jalur tetap harus dipenuhi
- [ ] Given pendaftar tidak lolos jalur pilihan 1 (di luar kuota atau tidak memenuhi syarat), when proses seleksi berjalan, then sistem otomatis mengevaluasi pendaftar di jalur pilihan 2 menggunakan aturan seleksi jalur tersebut
- [ ] Given pendaftar memiliki pilihan jalur aktif, when status berubah di salah satu jalur, then notifikasi menyebutkan jalur yang bersangkutan secara spesifik
- [ ] Given pendaftar sudah diterima di jalur pilihan 1, when seleksi jalur pilihan 2 berjalan, then pendaftar tersebut dikeluarkan dari pool jalur pilihan 2 secara otomatis
- [ ] Given sekolah swasta (tidak wajib multi-jalur), when admin setup PPDB, then fitur multi-jalur priority bersifat opsional dan tidak ditampilkan by default

> **Catatan Scope**: Multi-school cross-school coordination (pilihan sekolah 1/2/3 lintas sekolah yang dikelola dinas) adalah v2, bukan v1. v1 hanya mendukung multi-jalur priority *dalam satu sekolah*.

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

**Catatan Riset (2026-03-26):** Berdasarkan riset ke `data.kemendikdasmen.go.id`, import Dapodik bersifat **file-based** (Excel .xlsx) — tidak ada public API import dari Pusdatin. Template kolom tertanam di dalam aplikasi Dapodik desktop (bukan di portal publik). Format dapat berubah setiap tahun ajaran tanpa notifikasi publik. Oleh karena itu, field mapping harus dapat dikonfigurasi tanpa perlu recompile kode.

**Acceptance Criteria:**
- [ ] Given semua siswa baru sudah menyelesaikan daftar ulang, when operator mengklik "Export Dapodik", then sistem menghasilkan file **Excel (.xlsx)** sesuai template Pusdatin yang aktif — format kolom dikonfigurasi via file konfigurasi, bukan hardcode
- [ ] Given export selesai, when operator mengimport file ke aplikasi Dapodik desktop, then data siswa berhasil masuk tanpa error validasi format
- [ ] Given ada siswa yang data-nya tidak lengkap (misal: NISN belum terverifikasi), when operator mencoba export, then sistem menampilkan daftar siswa yang datanya belum siap export beserta field yang perlu dilengkapi
- [ ] Given export sudah dilakukan, when ada perubahan data siswa setelah export, then sistem menandai siswa tersebut sebagai "Perlu Re-export" di dashboard operator
- [ ] Given Pusdatin mengubah format template Dapodik, when tim engineering memperbarui file konfigurasi field mapping, then export otomatis menggunakan format baru **tanpa perlu mengubah kode aplikasi**

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
- [ ] **Spesifikasi format Dapodik (Pusdatin Kemendikdasmen)** — template import resmi untuk export data siswa — Status: ⚠️ Riset parsial selesai (2026-03-26): import adalah file-based Excel, tidak ada public API. Template kolom tertanam di aplikasi Dapodik desktop — perlu diperoleh langsung dari operator sekolah aktif atau dengan menjalankan aplikasi Dapodik. Implementasi menggunakan configurable field mapping (tidak hardcode). Kolom spesifik masih perlu konfirmasi dari operator.
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

- [x] **Format resmi export Dapodik** — ✅ Terjawab (2026-03-26): Import Dapodik adalah **file Excel (.xlsx), tidak ada public API**. Template tertanam di aplikasi Dapodik desktop. Field mapping akan diimplementasi sebagai konfigurasi (YAML/JSON), bukan hardcode. Kolom spesifik masih perlu dikonfirmasi dari operator sekolah aktif — Owner: Engineering Lead — Due: 2026-04-10 → **Ditutup, diganti dengan task operasional: dapatkan template dari operator**
- [ ] **Akses API Dukcapil** — apakah Simdikta bisa mendaftar sebagai mitra Kemendagri untuk akses API validasi NIK? Berapa lama prosesnya? — Owner: Product/Legal — Due: 2026-04-15
- [ ] **Pilihan payment gateway** — Midtrans vs Xendit vs Doku vs kombinasi? Pertimbangan: coverage bank lokal (BSI, BJB), fee transaksi — Owner: Finance + Engineering — Due: 2026-04-10
- [ ] **Strategi WhatsApp API** — gunakan WhatsApp Business API langsung (Meta) atau via BSP (Wati, Twilio, dll.)? Implikasi biaya dan delivery rate? — Owner: Engineering — Due: 2026-04-10
- [ ] **Hosting/infrastruktur** — self-hosted cloud (AWS/GCP) atau managed? Pertimbangan: data residency Indonesia (UU PDP) — Owner: Engineering Lead — Due: 2026-04-20
- [ ] **Skema pricing produk** — per sekolah/bulan? Per siswa? Bundle dengan modul akademik? Perlu keputusan sebelum go-to-market — Owner: Product + Business — Due: 2026-04-30

---

## 12. Role & Permission Matrix

> Single source of truth untuk authorization. Setiap role di bawah ini adalah RBAC — izin bersifat additive, bukan override.

| Role | Scope | Dapat Melakukan | Tidak Dapat Melakukan |
|------|-------|----------------|----------------------|
| **Pendaftar** (Orang Tua / Siswa) | Data milik sendiri | Buat akun, isi formulir, upload dokumen, pilih jalur, cek status, daftar ulang, bayar | Lihat data pendaftar lain, akses dashboard operator |
| **Operator Verifikasi** | Semua pendaftar sekolah tersebut | Verifikasi/tolak dokumen, tambah catatan perbaikan, kunci slot verifikasi | Ubah data isian pendaftar, jalankan seleksi, publish pengumuman |
| **Admin Sekolah** | Seluruh fitur sekolah tersebut | Setup PPDB, jalankan seleksi, simulasi, publish pengumuman, export Dapodik, manage user operator | Akses data sekolah lain, ubah log audit |
| **Kepala Sekolah** | Read-only + approval sensitif | Lihat audit trail, approve konfigurasi jalur/kuota sebelum aktivasi, lihat semua laporan | Ubah data pendaftar, publish langsung tanpa approval flow |
| **Super Admin** (internal Simdikta) | Cross-school (ops support) | Reset password, lihat log error, assist onboarding | Ubah data akademik, akses dokumen pendaftar, bypass audit log |

**Tidak ada role Dinas** — ini adalah v2. Cross-school monitoring adalah scope terpisah.

**Permission boundary kritis:**
- Audit log: **hanya INSERT**, tidak ada akun yang boleh UPDATE/DELETE — ini dikunci di DB level, bukan aplikasi
- Data NIK/KK: tidak pernah ditampilkan raw di UI, selalu masked `xxxxxx****0001`
- Kepala Sekolah tidak bisa langsung mengaktifkan PPDB jika kuota melanggar regulasi (sistem block)

---

## 13. Applicant Lifecycle — State Machine

> State machine formal untuk `ppdb_applicants.status`. Backend dan frontend harus mengikuti transisi ini — tidak ada state yang bisa di-skip atau di-bypass.

### 13.1 Primary State Machine (Registration)

```
[*] → Draft
Draft → Submitted                     : pendaftar submit formulir lengkap
Submitted → Under_Verification        : masuk antrian verifikasi operator
Under_Verification → Need_Correction  : operator temukan masalah dokumen/data
Need_Correction → Draft               : pendaftar edit & resubmit
Under_Verification → Verified         : semua dokumen valid

Verified → In_Selection               : periode seleksi dibuka
In_Selection → Ranked                 : engine seleksi jalan, skor dihitung
Ranked → Accepted                     : rank dalam kuota
Ranked → Waitlisted                   : eligible tapi kuota penuh
Ranked → Rejected                     : tidak eligible / tidak lolos syarat jalur

Accepted → ReRegistration_Pending     : pengumuman dipublikasikan
Waitlisted → Accepted                 : ada kuota terbuka (yang diterima tidak daftar ulang)
ReRegistration_Pending → ReRegistered : orang tua konfirmasi + lengkapi persyaratan daftar ulang
ReRegistered → Enrolled               : semua persyaratan final terpenuhi (dokumen + payment jika ada)

Rejected → [*]                        : terminal
Enrolled → [*]                        : terminal
```

**Aturan transisi:**
- Setiap transisi status WAJIB menulis audit log sebelum update status (dalam satu transaksi DB)
- `Need_Correction → Draft` hanya bisa diinisiasi oleh Operator Verifikasi, bukan sistem otomatis
- `Ranked → Accepted/Waitlisted/Rejected` dilakukan oleh selection engine (tidak bisa manual override tanpa audit log)
- `ReRegistration_Pending → deadline lewat` → sistem otomatis set `Not_Re_Enrolled` dan bebaskan kuota

### 13.2 Document State Machine

```
[*] → Uploaded → Under_Check → Accepted → [*]
                              ↘ Rejected → Replaced → Under_Check
```

### 13.3 Payment State Machine (Swasta)

```
[*] → Unbilled → Invoiced → Paid → [*]
                          ↘ Partially_Paid → Paid
                          ↘ Expired → Cancelled → [*]
```

### 13.4 Dapodik Sync State Machine

```
[*] → Ready_To_Export → Exported → Import_Verified → [*]
                                 ↘ Failed → Re_Export_Required → Ready_To_Export
```

---

## 14. Edge Cases & Handling

> Skenario non-happy-path yang harus memiliki perilaku terdefinisi. Setiap item di bawah harus memiliki acceptance criteria di test case masing-masing.

| Skenario | Perilaku yang Diharapkan |
|----------|--------------------------|
| **Duplicate NISN** — dua pendaftar input NISN yang sama | Sistem flag keduanya sebagai `nisn_conflict`, notifikasi Admin. Tidak auto-reject — operator yang resolve setelah cek manual |
| **Orang tua tanpa HP aktif** | Fallback ke email OTP. Jika tidak ada email: operator sekolah bisa buat akun walk-in dengan PIN sementara via dashboard admin |
| **Sekolah tanpa koordinat GPS valid** | Saat admin setup, sistem block aktivasi jalur domisili dan tampilkan error "Koordinat sekolah belum diset" sampai koordinat valid di-input |
| **Siswa pindah jalur setelah submit** | Diizinkan HANYA saat status = `Draft` atau `Need_Correction`. Setelah `Submitted` tidak bisa pindah jalur — harus batalkan dan daftar ulang (jika periode masih buka) |
| **Verifikasi melewati SLA (1×24 jam)** | Sistem kirim reminder ke Admin Sekolah. Setelah 48 jam tanpa verifikasi → notifikasi Kepala Sekolah. SLA configurable per sekolah. |
| **Kuota habis di semua jalur** | Pendaftar tetap bisa mendaftar, masuk `waitlist_only` mode. Sistem menampilkan estimasi posisi waiting list secara publik. |
| **Nilai rapor tidak ada (TK/PAUD)** | Jalur prestasi akademik dinonaktifkan otomatis untuk jenjang TK/PAUD. Engine tidak pernah require `grade_semesters` untuk jenjang ini. |
| **Usia di bawah minimum (SD: < 6 tahun)** | Sistem block submit dan tampilkan penjelasan aturan usia minimum. Configurable per jenjang di setup PPDB. |
| **File export Dapodik gagal tengah jalan** | Job dimark `failed`, file partial dihapus. Admin dapat retry. Error detail di-log lengkap. Tidak boleh partial file terdapat di storage. |
| **API WhatsApp/SMS down** | Notifikasi masuk antrian retry (exponential backoff, maks. 3× dalam 30 menit). Jika semua retry gagal → log error + admin notifikasi via dashboard, bukan silent fail. |

---

## Appendix

### Compliance Mapping — Audit-Ready

| Regulasi | Implikasi ke Sistem | Requirement Wajib | Evidence/Audit |
|----------|-------------------|-------------------|---------------|
| UU 20/2003 (Sisdiknas) | Sistem harus inklusif, transparan, tidak diskriminatif | Form registrasi tidak boleh block berdasarkan kondisi sosial; dashboard publik terbuka | Log pendaftaran, histori kuota per jalur |
| PP 57/2021 jo. PP 4/2022 (SNP) | Standar pengelolaan pendidikan sebagai acuan evaluasi | Konfigurasi jenjang, jalur, kuota sesuai SNP; laporan hasil seleksi | Selection rule config, export report, quota snapshot |
| PP 17/2010 (Tata Kelola) | Persetujuan otoritas sekolah dalam penerimaan siswa | Kepala Sekolah approve konfigurasi sebelum PPDB aktif; role-based access | Audit trail approval, role assignment log |
| Permendikbud 79/2015 (Dapodik) | Data pokok pendidikan wajib masuk Dapodik | Export configurable XLSX; validasi field wajib; readiness status per siswa | Export batch, mapping version, import result |
| Permendikdasmen 3/2025 (SPMB) | SPMB mencakup TK–SMA/SMK; 4 jalur; kuota per jalur wajib | Engine jalur per jenjang; kuota validator; tiebreaker sesuai regulasi; public announcement | Rule version, quota snapshot, ranking snapshot |
| Permendikdasmen 1/2026 (Standar Proses) | Standar proses berbeda per jenjang (PAUD–menengah) | Engine must be parameterized by level; TK/PAUD tidak pakai skema ranking rapor | Per-level config, admission policy log |
| UU PDP 27/2022 (Data Privasi) | NIK/KK tidak boleh tampil raw di antarmuka manapun | AES-256-GCM encryption at rest; NIK selalu masked `xxxxxx****0001`; data residency Jakarta | Masking audit, encryption log, S3 region ap-southeast-3 |

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
