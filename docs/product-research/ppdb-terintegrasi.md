# Riset Produk: Sistem PPDB/SPMB Terintegrasi

> **Dokumen ini merupakan hasil riset produk komprehensif tentang Penerimaan Peserta Didik Baru (PPDB) / Sistem Penerimaan Murid Baru (SPMB) di Indonesia, mencakup jenjang TK hingga SMA/SMK, baik sekolah negeri maupun swasta. Digunakan sebagai input PRD dan referensi stakeholder.**
>
> Tanggal Riset: Maret 2026 | Versi: 1.0

---

## Daftar Isi

1. [Executive Summary](#1-executive-summary)
2. [PPDB/SPMB End-to-End Flow](#2-ppdbspmb-end-to-end-flow)
3. [Regulatory Compliance Mapping](#3-regulatory-compliance-mapping)
4. [Competitor Analysis](#4-competitor-analysis)
5. [Key Insights & Pain Points](#5-key-insights--pain-points)
6. [Product Requirements High-Level](#6-product-requirements-high-level)
7. [Opportunity & Recommendation](#7-opportunity--recommendation)

---

## 1. Executive Summary

### Konteks & Urgensi

Penerimaan Peserta Didik Baru (PPDB) adalah proses tahunan yang berdampak langsung pada jutaan keluarga Indonesia. Mulai tahun ajaran 2025/2026, sistem ini secara resmi berganti nama menjadi **Sistem Penerimaan Murid Baru (SPMB)** melalui Permendikdasmen Nomor 3 Tahun 2025, bukan sekadar perubahan nama tetapi juga pembaruan kebijakan substantif — termasuk perubahan kuota jalur, integrasi Tes Kemampuan Akademik (TKA) nasional, dan kewajiban sistem digital bagi pemerintah daerah.

Pada tahun ajaran 2026/2027, Kemendikdasmen menerbitkan Surat Edaran yang mewajibkan hasil TKA digunakan sebagai komponen seleksi jalur prestasi akademik untuk jenjang SMP dan SMA, memperkuat standardisasi nasional.

### Temuan Kunci

- **Fragmentasi sistem** adalah masalah terbesar: setiap daerah mengembangkan sistemnya sendiri, menghasilkan puluhan platform berbeda yang tidak saling terkoneksi dengan Dapodik.
- **Sekolah swasta** (±60% dari total sekolah Indonesia) sebagian besar masih menggunakan proses manual atau alat sederhana, tanpa sistem PPDB terintegrasi yang setara dengan sekolah negeri.
- **Kecurangan struktural** (manipulasi KK untuk zona, titipan oknum, jual beli kursi) terjadi setiap tahun karena minimnya audit trail digital yang andal.
- **Pasar kompetitor** masih terfragmentasi: tidak ada satu pun pemain yang memiliki solusi PPDB end-to-end yang benar-benar terintegrasi dengan Dapodik + Dukcapil + payment gateway untuk segmen sekolah swasta skala menengah.
- **Regulasi SPMB 2025** membuka peluang besar: kewajiban sistem online daerah + integrasi TKA menciptakan kebutuhan platform yang belum terpenuhi.

### Peluang Pasar

| Segmen | Estimasi Jumlah Sekolah | Status Digitalisasi PPDB |
|---|---|---|
| SD/MI Negeri | ~148.000 | Sebagian besar via SIAP PPDB/sistem daerah |
| SMP/MTs Negeri | ~40.000 | Campuran (daerah maju sudah digital) |
| SMA/SMK Negeri | ~27.000 | Lebih terdigitalisasi |
| SD/SMP/SMA Swasta | ~180.000+ | **Mayoritas masih manual atau ad-hoc** |

---

## 2. PPDB/SPMB End-to-End Flow

### Gambaran Umum Alur

```
PERSIAPAN DINAS/SEKOLAH
        ↓
REGISTRASI & AKUN (Siswa/Ortu)
        ↓
PENGISIAN FORMULIR & UPLOAD DOKUMEN
        ↓
VERIFIKASI (Sekolah / Dinas)
        ↓
SELEKSI & RANKING
        ↓
PENGUMUMAN HASIL
        ↓
DAFTAR ULANG & PEMBAYARAN
        ↓
INTEGRASI DATA (Dapodik)
```

---

### 2.1 Tahap Persiapan (Pra-Pendaftaran)

**Pelaku:** Dinas Pendidikan, Kepala Sekolah, Operator Sekolah

**Aktivitas:**
- Dinas Pendidikan menetapkan jadwal, kuota per jalur, wilayah zonasi, dan juknis teknis daerah
- Sekolah menetapkan daya tampung per rombongan belajar (rombel) dan meng-input ke sistem
- Operator sekolah memverifikasi data Dapodik sekolah (kapasitas, koordinat GPS titik sekolah)
- Sosialisasi jadwal PPDB ke masyarakat (papan pengumuman, media sosial, situs resmi)
- Konfigurasi sistem PPDB online (platform daerah atau platform mandiri sekolah)

**Dokumen/Data yang Disiapkan Sekolah:**
- SK penentuan daya tampung
- Peta wilayah zonasi (koordinat polygon)
- Kriteria jalur prestasi (jenis lomba yang diakui, nilai minimum)
- Ketentuan jalur afirmasi (daftar program bantuan yang diterima: KIP, KKS, DTKS)

---

### 2.2 Tahap Registrasi & Pembuatan Akun

**Pelaku:** Siswa/Orang Tua

**Aktivitas:**
1. Mengakses portal PPDB daerah atau platform sekolah (online/offline)
2. **Pengajuan akun**: mengisi data kependudukan sesuai KK asli
   - NIK (Nomor Induk Kependudukan) calon siswa
   - NISN (Nomor Induk Siswa Nasional) — untuk siswa yang sudah pernah sekolah
   - NIK Kepala Keluarga / Orang Tua
   - Nomor KK
   - Nomor HP aktif (untuk OTP / verifikasi)
   - Alamat email aktif (untuk notifikasi dan pengumuman)
3. Sistem melakukan **validasi data ke Dukcapil** secara real-time: NIK + data KK dicocokkan dengan database kependudukan nasional
4. Jika data valid → sistem mengirimkan **OTP** ke nomor HP terdaftar
5. Setelah OTP berhasil → akun dibuat, calon pendaftar mendapatkan **token/PIN login**

**Integrasi Teknis:**
- Dukcapil (Dirjen Kependudukan dan Catatan Sipil Kemendagri) → validasi NIK + data KK
- Dapodik (Kemendikdasmen) → validasi NISN dan riwayat pendidikan
- SMS Gateway / WhatsApp Gateway → pengiriman OTP dan notifikasi

**Pain Point:**
- NIK tidak ditemukan di database Dukcapil (data belum diperbarui/KK baru)
- NISN tidak match karena kesalahan input data di sekolah asal
- Sistem down saat hari pertama pendaftaran karena lonjakan traffic

**Sumber:** [Kumparan - Cara Mengatasi NIK Tidak Ditemukan](https://kumparan.com/berita-hari-ini/cara-mengatasi-nik-tidak-ditemukan-saat-pendaftaran-ppdb-online-2024-22jpOBZVK3J), [BPMP Kaltara - Integrasi NISN-NIK](https://bpmpkaltara.kemendikdasmen.go.id/2019/01/24/integrasi-data-nisn-diganti-dengan-nomor-induk-kependudukan/)

---

### 2.3 Tahap Pengisian Formulir & Upload Dokumen

**Pelaku:** Siswa/Orang Tua

**Formulir yang Diisi:**
- Data pribadi calon siswa (nama, tempat/tanggal lahir, jenis kelamin, agama, anak ke-)
- Data alamat domisili lengkap + titik koordinat GPS (untuk jalur zonasi)
- Data orang tua/wali (nama, pekerjaan, penghasilan, NIK)
- Pilihan sekolah tujuan (biasanya 1-3 pilihan)
- Pilihan jalur: Domisili/Zonasi, Afirmasi, Prestasi, atau Mutasi

**Dokumen yang Diunggah (format PDF/JPG, maks. 1 MB per file):**

| Dokumen | Jalur | Keterangan |
|---|---|---|
| Kartu Keluarga (KK) | Semua jalur | Harus diterbitkan min. 1 tahun sebelum pendaftaran (jalur domisili) |
| Akta Kelahiran | Semua jalur | Verifikasi usia dan nama |
| Rapor 5 semester terakhir | Jalur Prestasi | Nilai rata-rata sebagai dasar seleksi |
| Piagam/Sertifikat Prestasi | Jalur Prestasi Non-akademik | Harus dari lomba yang diakui |
| Kartu KIP / KKS | Jalur Afirmasi | Atau terdaftar di DTKS/BPJS (tergantung ketentuan daerah) |
| Surat Tugas Orang Tua | Jalur Mutasi | Dari instansi resmi |
| Surat Keterangan Disabilitas | Jalur Afirmasi (ABK) | Dari dokter/RS/lembaga resmi |
| Pas foto terbaru | Semua jalur | Format tertentu |
| Hasil TKA (SPMB 2026) | Jalur Prestasi Akademik | SMP dan SMA wajib mulai 2026/2027 |

**Catatan Penting SPMB 2025/2026 (Permendikdasmen No. 3/2025):**
- KK yang terbit kurang dari 1 tahun tetap sah jika perubahan disebabkan penambahan anggota, perpindahan resmi, atau kehilangan dokumen
- Jalur Afirmasi mensyaratkan kartu peserta program bantuan pemerintah (KIP/DTKS); surat keterangan tidak mampu (SKTM) dan BPJS **tidak cukup**

**Sumber:** [Kompas - Dokumen Verifikasi KK PPDB Jakarta 2024](https://www.kompas.com/edu/read/2024/05/21/094534171/dokumen-dan-cara-verifikasi-kk-di-ppdb-jakarta-2024), [Permendikdasmen No. 3/2025](https://peraturan.bpk.go.id/Details/315671/permendikdasmen-no-3-tahun-2025)

---

### 2.4 Tahap Verifikasi

**Pelaku:** Operator Sekolah, Petugas Dinas Pendidikan

**Sub-tahap Verifikasi:**

#### a. Verifikasi Akun (Cepat, ~1-2 hari kerja)
- Sistem memvalidasi kesesuaian data yang diisi dengan data Dukcapil
- Operator memeriksa apakah data NIK sudah tervalidasi sistem

#### b. Verifikasi Dokumen (1-5 hari kerja)
- Operator sekolah (atau dinas) membuka dashboard verifikasi
- Memeriksa keaslian dan kesesuaian dokumen yang diunggah dengan data formulir:
  - Nama di KK vs Akta Kelahiran
  - Alamat di KK vs domisili yang diklaim
  - Tanggal lahir (validasi usia)
  - Keaslian piagam prestasi
- Status: **Disetujui / Ditolak (dengan keterangan) / Perbaikan Diperlukan**
- Pendaftar yang dokumennya bermasalah diberi notifikasi untuk upload ulang

#### c. Verifikasi Zonasi / Domisili (Khusus jalur domisili)
- Sistem mengkalkulasi jarak rumah ke sekolah berdasarkan koordinat GPS KK vs koordinat sekolah
- Metode: **jarak garis lurus (Euclidean)**, bukan jarak tempuh
- Ketentuan jarak maksimal (variatif per daerah): SD ≤3 km, SMP ≤5-7 km, SMA ≤9-10 km
- Validasi apakah alamat KK berada dalam wilayah zonasi yang ditetapkan

**Mekanisme Verifikasi (Sekolah Negeri):**
- Verifikasi dokumen bisa dilakukan secara online ATAU calon pendaftar datang ke sekolah terdekat dari rumah (bukan sekolah tujuan) untuk verifikasi fisik dokumen

**Sumber:** [Fokus.co.id - Berapa Lama Verifikasi PPDB](https://fokus.co.id/edu/berapa-lama-proses-verifikasi-ppdb-online), [Tirto - Alur Verifikasi SPMB](https://tirto.id/alur-verifikasi-dan-jenis-piagam-untuk-daftar-spmb-ppdb-smp-2025-hcBN)

---

### 2.5 Tahap Seleksi & Ranking

**Pelaku:** Sistem (otomatis) + Panitia PPDB

#### Seleksi per Jalur

**A. Jalur Domisili/Zonasi**
- **Kriteria utama:** Jarak rumah ke sekolah (semakin dekat = prioritas lebih tinggi)
- **Kriteria sekunder (jika jarak sama):** Usia calon siswa (lebih tua didahulukan)
- Ranking bersifat **real-time dan dinamis**: posisi siswa bisa bergeser saat ada pendaftar baru dengan jarak lebih dekat
- Siswa dapat memantau posisi ranking secara langsung di menu "Seleksi" portal

**B. Jalur Afirmasi**
- Verifikasi kepesertaan di DTKS (Data Terpadu Kesejahteraan Sosial) / KIP / program bantuan pemerintah
- Seleksi: prioritas pada tingkat keekonomian atau kondisi disabilitas
- Kuota SPMB 2025: min. 15% dari daya tampung per sekolah

**C. Jalur Prestasi**
- *Akademik:* Nilai rata-rata rapor 5 semester + (mulai 2026) nilai TKA nasional
- *Non-akademik:* Poin dari piagam/sertifikat lomba yang diakui (level internasional > nasional > provinsi > kab/kota)
- *Kepemimpinan:* Ketua OSIS, Pramuka, dll. (poin tambahan)
- Tidak ada batasan zonasi untuk jalur ini

**D. Jalur Mutasi**
- Verifikasi surat tugas orang tua dari instansi berwenang
- Kuota maksimal 5% dari daya tampung

**Kuota Per Jalur (Permendikdasmen No. 3/2025 SPMB):**

| Jenjang | Domisili (min.) | Afirmasi (min.) | Prestasi | Mutasi (maks.) |
|---|---|---|---|---|
| SD | 70% | 15% | - | 5% |
| SMP | 40% | 15% | Sisa kuota | 5% |
| SMA | 30% | 15% | Sisa kuota | 5% |

**Sumber:** [Indonesia.go.id - Sistem PPDB 2025](https://indonesia.go.id/kategori/sosial-budaya/8964/sistem-ppdb-2025-diperbarui-empat-jalur-penerimaan-siswa-baru-diterapkan?lang=1), [SMP PGII 1 Bandung - Permendikdasmen No. 3/2025](https://smppgii1.sch.id/peraturan-menteri-pendidikan-dasar-dan-menengah-nomor-3-tahun-2025-tentang-sistem-penerimaan-murid-baru-spmb/)

---

### 2.6 Tahap Pengumuman Hasil

**Pelaku:** Sistem, Panitia PPDB, Dinas Pendidikan

**Aktivitas:**
- Sistem mengunci daftar peserta yang diterima sesuai kuota dan ranking
- Pengumuman dipublikasikan secara **online** di portal resmi pada waktu yang ditetapkan
- Notifikasi otomatis dikirim ke email/HP calon siswa (diterima / tidak diterima)
- Daftar peserta yang diterima bersifat publik dan dapat diakses siapapun (transparansi)
- Peserta yang tidak diterima di jalur pertama dapat memantau jalur lain (jika sistem memungkinkan)

---

### 2.7 Tahap Daftar Ulang & Pembayaran

**Pelaku:** Siswa/Orang Tua, Operator Sekolah (TU/Bendahara)

**Aktivitas Daftar Ulang:**
1. Peserta diterima **wajib** daftar ulang sesuai jadwal (jika lewat waktu = dianggap mengundurkan diri)
2. Melengkapi dokumen fisik asli untuk verifikasi final:
   - KK asli
   - Akta kelahiran asli
   - Ijazah/STTB/SKL jenjang sebelumnya
   - Rapor asli
   - Pas foto (sesuai ketentuan)
3. Pengisian formulir data siswa lengkap untuk keperluan administrasi akademik
4. Sekolah meng-input data siswa baru ke **Dapodik**

**Komponen Pembayaran (variatif, khususnya sekolah swasta):**

| Komponen | Sekolah Negeri | Sekolah Swasta |
|---|---|---|
| Uang Pangkal/Sumbangan Gedung | Dilarang (UU) | Bervariasi, bisa sangat besar |
| SPP Bulanan | Gratis/subsidi | Bervariasi |
| Seragam | Tidak boleh dipungut saat PPDB | Ada biaya (seragam khas sekolah) |
| Buku | Tidak wajib beli di sekolah | Umumnya ada paket buku |
| Biaya Kegiatan | Sangat terbatas | Bervariasi |
| Uang Pembangunan | **Dilarang oleh Disdikbud** | Ada di beberapa sekolah |

**Catatan:** Disdikbud secara tegas melarang pungutan biaya seragam saat daftar ulang PPDB untuk sekolah negeri. ([Kompas - Larangan Pungutan Seragam PPDB Jateng 2024](https://regional.kompas.com/read/2024/07/03/120500678/disdikbud-tegaskan-larangan-pungutan-uang-seragam-saat-daftar-ulang-ppdb-jateng-2024))

**Mekanisme Pembayaran Sekolah Swasta:**
- Transfer bank langsung ke rekening sekolah
- Virtual Account (VA) per siswa
- QRIS
- Pembayaran di kasir sekolah (cash)
- Platform pembayaran digital (Midtrans, Xendit, dll.)

---

### 2.8 Tahap Pasca-PPDB: Integrasi Data

**Pelaku:** Operator Sekolah, Sistem Dapodik

- Operator sekolah meng-input data siswa baru yang telah daftar ulang ke aplikasi **Dapodik**
- NISN diterbitkan otomatis oleh sistem Pusdatin (untuk siswa baru yang belum punya NISN) setelah data Dapodik match dengan data Dukcapil
- Data siswa tersinkronisasi ke berbagai sistem: BOS (Bantuan Operasional Sekolah), PIP, Rapor Digital

**Sumber:** [BPMP Kaltara - Integrasi Data NISN](https://bpmpkaltara.kemendikdasmen.go.id/2019/01/24/integrasi-data-nisn-diganti-dengan-nomor-induk-kependudukan/), [SMAN 14 Surabaya - Verval Dapodik-Dukcapil](https://www.sma14sby.sch.id/pengintegrasian-dapodik-dengan-data-kependudukan-nasional.html)

---

### 2.9 Alur Khusus Sekolah Swasta

Sekolah swasta **tidak wajib** mengikuti sistem PPDB pemerintah (kecuali yang bermitra dengan dinas), sehingga memiliki fleksibilitas lebih tinggi:

```
PEMBUKAAN PENDAFTARAN (Gelombang 1, 2, dst.)
        ↓
PENDAFTARAN ONLINE/OFFLINE
        ↓
TES MASUK (opsional, sesuai kebijakan sekolah)
  - Tes akademik (matematika, bahasa, IPA)
  - Psikotes
  - Wawancara calon siswa + orang tua
  - Tes kemampuan baca Al-Qur'an (sekolah Islam)
  - FGD (sekolah tertentu)
        ↓
PENGUMUMAN HASIL TES
        ↓
PEMBAYARAN UANG PANGKAL & ADMINISTRASI
        ↓
DAFTAR ULANG & KELENGKAPAN DOKUMEN
        ↓
INPUT DATA KE DAPODIK
```

**Karakteristik PPDB Swasta:**
- **Multi-gelombang:** Pendaftaran dibuka beberapa gelombang dengan besaran biaya/diskon berbeda
- **Tes masuk bervariasi:** Dari sekadar seleksi administrasi hingga tes akademik kompetitif
- **Fleksibel kuota:** Tidak ada batasan kuota pemerintah, kecuali daya tampung fisik
- **Strategi marketing:** Sekolah swasta aktif promosi via media sosial, open house, virtual tour
- **Sistem mandiri:** Mayoritas menggunakan spreadsheet, Google Form, atau platform sekolah pihak ketiga

**Sumber:** [Solutiva - Psikotes PPDB Swasta](https://www.solutiva.co.id/psikotes-untuk-ppdb-sekolah-swasta-sekolah-negeri-dan-pesantren/), [Kompasiana - Strategi PPDB Swasta](https://www.kompasiana.com/elizabethtika/6673b7f7ed6415329d08db23/strategi-penerimaan-peserta-didik-baru-ppdb-untuk-meningkatkan-daya-saing-sekolah-swasta)

---

## 3. Regulatory Compliance Mapping

### 3.1 Peta Regulasi Utama

| No. | Regulasi | Tahun | Lingkup | Requirement Kunci | Dampak Sistem |
|---|---|---|---|---|---|
| 1 | **UU No. 20 Tahun 2003** (Sisdiknas) | 2003 | Fundamental pendidikan nasional | Pasal 11: Pemerintah wajib menjamin layanan pendidikan berkualitas tanpa diskriminasi | Sistem PPDB harus inklusif, tidak boleh diskriminatif |
| 2 | **PP No. 17 Tahun 2010** | 2010 | Pengelolaan & penyelenggaraan pendidikan | Mengatur mekanisme penerimaan peserta didik, termasuk syarat usia, daya tampung | Dasar hukum batas usia dan kapasitas sekolah di sistem |
| 3 | **PP No. 57 Tahun 2021** | 2021 | Standar Nasional Pendidikan (SNP) | Menggantikan PP 19/2005; standar proses & pengelolaan pendidikan | Standar minimal yang harus dipenuhi dalam pengelolaan penerimaan siswa |
| 4 | **Permendikbud No. 79 Tahun 2015** | 2015 | Data Pokok Pendidikan (Dapodik) | Dapodik sebagai single database pendidikan; integrasi Dapodik-Dukcapil | Wajib sync data siswa ke Dapodik pasca-PPDB; NISN via Dapodik |
| 5 | **Permendikbud No. 1 Tahun 2021** | 2021 | PPDB TK, SD, SMP, SMA, SMK | 4 jalur: zonasi, afirmasi, mutasi, prestasi; kuota per jalur | Basis aturan jalur seleksi yang harus diimplementasikan sistem |
| 6 | **Permendikdasmen No. 3 Tahun 2025** | 2025 | SPMB (pengganti PPDB) | Nama berubah ke SPMB; kuota jalur direvisi; wajib sistem online daerah; KK 1 tahun | **Regulasi aktif saat ini** — sistem wajib menyesuaikan kuota dan jalur baru |
| 7 | **SE SPMB 2026/2027** (Dirjen PAUD Dikdasmen) | 2026 | SPMB TA 2026/2027 | Nilai TKA wajib digunakan sebagai komponen jalur prestasi akademik SMP & SMA | Sistem wajib mendukung import/integrasi nilai TKA dari portal resmi |
| 8 | **Permendikdasmen No. 1 Tahun 2026** | 2026 | Standar Proses Pembelajaran | Mengatur standar proses belajar-mengajar; *bukan* tentang PPDB/SPMB | Tidak berdampak langsung pada sistem PPDB |

### 3.2 Requirement Regulasi yang Wajib Diimplementasikan Sistem

| Requirement | Sumber Regulasi | Implementasi Teknis |
|---|---|---|
| Validasi NIK/KK via Dukcapil | Permendikbud 1/2021, Permendikdasmen 3/2025 | API integrasi dengan sistem Dukcapil Kemendagri |
| Validasi NISN via Dapodik | Permendikbud 79/2015 | API integrasi Dapodik/Pusdatin |
| 4 jalur seleksi (domisili, afirmasi, prestasi, mutasi) | Permendikdasmen 3/2025 | Modul seleksi multi-jalur dengan kuota configurable |
| Kuota per jalur sesuai regulasi | Permendikdasmen 3/2025 | Konfigurasi kuota per jenjang, alerting jika kuota tidak sesuai |
| Perhitungan jarak GPS untuk jalur domisili | Permendikbud 1/2021 | Integrasi Google Maps API / Haversine formula |
| Verifikasi kepesertaan DTKS/KIP untuk afirmasi | Permendikdasmen 3/2025 | Integrasi API SIKS-NG (Kemensos) atau verifikasi manual dengan upload dokumen |
| Sistem online wajib tersedia (pemda) | Permendikdasmen 3/2025 | Platform berbasis web yang dapat di-white-label untuk pemda |
| Input nilai TKA untuk jalur prestasi | SE SPMB 2026 | Import CSV/API hasil TKA dari portal Kemendikdasmen |
| Pelaporan hasil SPMB ke kementerian | Permendikdasmen 3/2025 | Modul laporan terstandar untuk upload ke sistem Kemendikdasmen |
| Sync data siswa baru ke Dapodik | Permendikbud 79/2015 | Ekspor data sesuai format Dapodik atau API integrasi |
| Transparansi publik (daya tampung, ranking) | UU 20/2003, Permendikdasmen 3/2025 | Dashboard publik real-time, tidak memerlukan login |

**Sumber Regulasi:**
- [PP No. 57 Tahun 2021 - BPK RI](https://peraturan.bpk.go.id/Details/165024/pp-no-57-tahun-2021)
- [Permendikdasmen No. 3 Tahun 2025 - BPK RI](https://peraturan.bpk.go.id/Details/315671/permendikdasmen-no-3-tahun-2025)
- [BBPMP Jabar - Penguatan Regulasi SPMB 2026](https://bbpmpjabar.kemendikdasmen.go.id/penguatan-regulasi-spmb-2026-hasil-tka-dimanfaatkan-pada-jalur-prestasi/)
- [Kemendikbud - Permendikbud 79/2015 Dapodik](https://luk.staff.ugm.ac.id/atur/Permendikbud79-2015DataPokokPendidikan.pdf)

---

## 4. Competitor Analysis

### 4.1 Peta Kompetitor

| Kompetitor | Tipe | Target Pasar | PPDB/SPMB? | Pricing Model | Skala |
|---|---|---|---|---|---|
| **SIAP PPDB (Telkom)** | Platform PPDB khusus (gov) | Dinas pendidikan kab/kota | Ya, inti produk | B2G (per pemda) | Nasional (banyak daerah) |
| **AdminSekolah.net** | SIM Sekolah all-in-one | Semua jenjang, negeri & swasta | Ya, add-on | Rp150-500rb/bln/unit | Ratusan sekolah |
| **SkoolaCloud** | SIM Sekolah boarding & non-boarding | SD-SMA, boarding school | Ya, modul inti | Rp15.000/siswa/bln | 400+ sekolah, 26 provinsi |
| **PPDBSekolah.com** | Aplikasi PPDB khusus | Semua jenjang, swasta | Ya, produk utama | Tidak publik | Kecil-menengah |
| **MySCH.id** | SIM Sekolah + website | Semua jenjang | Ya, fitur | Per modul/tahunan | 60.000+ klien |
| **EQUIP** | ERP Pendidikan enterprise | Sekolah besar, yayasan | Ya, modul | Enterprise pricing | Menengah-besar |
| **JIBAS** | SIM Sekolah open-source | Sekolah yang hemat biaya | Ya, terbatas | Gratis (self-host) | Komunitas |

---

### 4.2 Analisis Per Kompetitor

#### A. SIAP PPDB Online (Telkom SIAP Online)

**Deskripsi:** Platform PPDB yang dikembangkan Telkom Indonesia, digunakan oleh dinas pendidikan daerah. Merupakan pemain dominan di segmen pemerintah daerah.

**Fitur Utama:**
- Multi-model sistem PPDB (adaptif per aturan daerah)
- Real-time processing seleksi
- Dashboard publik untuk transparansi
- Akses mobile (Android + web responsif)
- Notifikasi SMS

**Kekuatan:**
- Kepercayaan pemerintah daerah (brand Telkom)
- Sudah digunakan banyak kabupaten/kota di Indonesia
- Dapat dikustomisasi per aturan daerah
- Infrastruktur skala nasional

**Kelemahan:**
- Fokus B2G, tidak melayani sekolah swasta secara mandiri
- UI/UX cenderung kuno
- Tidak terintegrasi dengan sistem keuangan/manajemen sekolah
- Ketergantungan pada kontrak pemda (tidak bisa diakses sekolah mandiri)
- Biaya tidak transparan (negosiasi per pemda)

**Target Market:** Dinas pendidikan provinsi/kab/kota (sekolah negeri)

**Sumber:** [SIAP PPDB Online](https://siap-ppdb.com/), [Fitur SIAP PPDB](http://siap-online.com/fitur-siap-ppdb-online/)

---

#### B. AdminSekolah.net

**Deskripsi:** Software administrasi sekolah berbasis web dari ekosistem Indoweb. Posisi sebagai "satu aplikasi untuk semua kebutuhan sekolah."

**Fitur PPDB:**
- PPDB Online (sebagai add-on/modul terpisah)
- Formulir pendaftaran online
- Upload dokumen
- Pengumuman hasil
- Integrasi dengan WhatsApp/Telegram notification

**Fitur Non-PPDB (komprehensif):**
- Manajemen akademik (absensi, nilai, raport)
- Keuangan & akuntansi lengkap (BRI, BNI, Mandiri, BSI, QRIS, dll.)
- Manajemen SDM (guru, staf, payroll)
- Website sekolah otomatis
- eOffice, eAset
- Absensi GPS + selfie

**Pricing:**
- Paket Dasar: Rp 150.000/bulan/unit
- Paket Menengah: Rp 300.000/bulan/unit
- Paket Atas (Premium): Rp 500.000/bulan/unit
- PPDB Online: **add-on terpisah** (tidak termasuk paket standar)

**Kekuatan:**
- Pricing terjangkau dan transparan
- Ekosistem fitur lengkap (tidak perlu aplikasi lain)
- Integrasi payment gateway luas
- Multi-platform (mobile + web)

**Kelemahan:**
- PPDB bukan fitur inti (add-on) — kurang mendalam untuk kebutuhan PPDB kompleks
- Tidak ada integrasi Dukcapil/Dapodik yang disebutkan
- Tidak ada fitur seleksi otomatis multi-jalur (zonasi, afirmasi, prestasi)
- Kurang cocok untuk dinas pendidikan (fokus per-sekolah)
- Belum ada fitur TKA integration (SPMB 2026)

**Target Market:** Sekolah swasta skala menengah, semua jenjang

**Sumber:** [AdminSekolah.net](https://adminsekolah.net/), [Harga AdminSekolah](https://adminsekolah.net/harga/)

---

#### C. SkoolaCloud (Skoola System)

**Deskripsi:** SIM Sekolah berbasis cloud, dikembangkan dengan fokus pada sekolah boarding dan non-boarding. Infrastruktur AWS/Google Cloud.

**Fitur PPDB:**
- Manajemen penerimaan siswa baru terintegrasi
- Workflow enrollment dari pendaftaran hingga pengumuman
- Integrasi data siswa langsung ke modul manajemen

**Fitur Non-PPDB:**
- Keuangan & billing otomatis
- Akademik & penjadwalan
- Manajemen data siswa/guru/alumni
- Absensi digital (QR code, RFID)
- Cashless payment (Skoola ID)
- Portal komunikasi orang tua-guru
- Inventaris
- Dashboard real-time
- E-learning & online test

**Pricing:** Rp 15.000/siswa/bulan (varies by volume dan fitur)

**Skala:** 400+ institusi pendidikan, 150.000+ siswa, 26 provinsi

**Kekuatan:**
- Model pricing per-siswa lebih fleksibel untuk sekolah kecil
- Khusus kuat untuk sekolah boarding
- Infrastruktur cloud enterprise (AWS/Google Cloud)
- Fitur cashless payment terintegrasi (Skoola ID) — inovatif
- Cakupan nasional luas (26 provinsi)

**Kelemahan:**
- Fitur PPDB tidak dijelaskan secara detail (tidak ada multi-jalur, tidak ada integrasi Dukcapil)
- Kurang cocok untuk sekolah yang butuh kepatuhan SPMB/PPDB pemerintah
- Pricing per-siswa bisa mahal untuk sekolah besar
- Tidak ada fitur untuk dinas pendidikan

**Target Market:** SD-SMA swasta, khususnya boarding school, yayasan multi-sekolah

**Sumber:** [SkoolaCloud](https://skoolacloud.id/), [Skoola PPDB](https://skoolacloud.id/aplikasi-web-ppdb-online/)

---

#### D. PPDBSekolah.com

**Deskripsi:** Aplikasi PPDB spesialis (bukan SIM Sekolah), fokus hanya pada proses penerimaan siswa baru. Produk dari ekosistem AdminSekolah.

**Fitur Utama:**
- Pendaftaran 100% online
- Dashboard real-time (jumlah pendaftar, status pembayaran)
- Notifikasi WhatsApp otomatis (dari pendaftaran hingga pengumuman)
- Multi-payment: transfer bank, QRIS, minimarket
- Seleksi otomatis + cetak laporan
- Tidak perlu install — SaaS
- Training gratis + live chat support

**Kekuatan:**
- Produk spesialis PPDB → lebih fokus dan dalam
- Onboarding mudah (no install, tanpa konfigurasi rumit)
- Dukungan pelanggan inklusif (training + live chat)
- Multi-payment komprehensif

**Kelemahan:**
- Tidak ada modul pasca-PPDB (tidak bisa lanjut ke SIM Sekolah dalam satu platform)
- Tidak ada integrasi Dukcapil/Dapodik yang disebutkan
- Tidak ada seleksi multi-jalur resmi (zonasi, afirmasi, prestasi sesuai Permendikdasmen)
- Pricing tidak transparan di homepage
- Tidak cocok untuk sekolah negeri (tidak ada fitur pemda/dinas)

**Target Market:** Sekolah swasta semua jenjang yang ingin digitalisasi PPDB cepat

**Sumber:** [PPDBSekolah.com](https://ppdbsekolah.com/)

---

### 4.3 Gap Analysis — Peluang Differensiasi

| Fitur/Kapabilitas | SIAP PPDB | AdminSekolah | SkoolaCloud | PPDBSekolah.com | **Peluang Simdikta** |
|---|---|---|---|---|---|
| Multi-jalur SPMB (domisili, afirmasi, prestasi, mutasi) | Ya | Tidak | Tidak | Tidak | **Wajib ada** |
| Integrasi Dukcapil (validasi NIK/KK) | Sebagian | Tidak | Tidak | Tidak | **Differensiator kuat** |
| Integrasi Dapodik (NISN + sync pasca-PPDB) | Tidak disebutkan | Tidak | Tidak | Tidak | **Differensiator kuat** |
| Integrasi TKA (jalur prestasi 2026) | Tidak | Tidak | Tidak | Tidak | **First mover opportunity** |
| Kalkulasi jarak GPS otomatis | Ya | Tidak | Tidak | Tidak | **Wajib ada** |
| Verifikasi DTKS/KIP (jalur afirmasi) | Sebagian | Tidak | Tidak | Tidak | **Penting** |
| Dashboard publik real-time | Ya | Tidak jelas | Tidak | Tidak | **Wajib ada** |
| Seleksi otomatis multi-gelombang (swasta) | Tidak | Tidak | Tidak | Sebagian | **Peluang swasta** |
| Modul daftar ulang + pembayaran | Tidak | Sebagian | Ya | Sebagian | **Harus ada** |
| Sync ke Dapodik pasca-PPDB | Tidak | Tidak | Tidak | Tidak | **Differensiator kuat** |
| White-label untuk pemda | Ya | Tidak | Tidak | Tidak | **Peluang B2G** |
| Pelayanan negeri + swasta dalam satu platform | Tidak | Sebagian | Tidak | Tidak | **Unik** |

---

## 5. Key Insights & Pain Points

### 5.1 Persona: Siswa & Orang Tua

**Profil:** Orang tua dengan anak usia sekolah, melek digital rendah-menengah, tinggal di pinggiran kota atau kabupaten.

**Pain Points:**
- **Registrasi teknis yang membingungkan:** NIK tidak ditemukan di Dukcapil, NISN tidak aktif di Dapodik. Orang tua harus bolak-balik ke Disdukcapil dan sekolah asal sebelum bisa mendaftar.
- **Ketidakpastian zonasi:** Tidak tahu apakah rumah mereka masuk zona sekolah tertentu sebelum mencoba mendaftar. Tidak ada tools preview zona yang mudah diakses.
- **Server down hari pertama:** Sistem nasional/daerah sering crash pada hari pembukaan pendaftaran, memaksa orang tua mengulang proses berkali-kali atau mengantri offline.
- **Informasi tidak merata:** Jadwal, syarat, dan prosedur PPDB sering berubah dan tidak tersosialisasi dengan baik — orang tua di pedesaan terlambat mendapat informasi.
- **Kecemasan ranking real-time:** Posisi anak di ranking bergerak dinamis; orang tua mengalami stres tinggi memantau posisi, terutama yang berada di "zona merah" (batas ambang).
- **Ketidakadilan yang dirasakan:** Menyaksikan praktik manipulasi KK atau "titipan" — merasa sistem tidak adil meski patuh prosedur.
- **Proses daftar ulang berulang:** Harus mencetak, melengkapi, dan menyerahkan dokumen yang sama berkali-kali untuk setiap tahap.

**Kutipan representatif:** *"Anak saya tidak masuk PPDB zonasi padahal rumah kami dekat, tapi orang yang rumahnya lebih jauh bisa masuk karena 'kenal' orang dalam."* — Keluhan umum orang tua 2024 ([NU Online](https://www.nu.or.id/nasional/orang-tua-keluhkan-sistem-ppdb-zonasi-minta-pemerintah-evaluasi-xaON2))

---

### 5.2 Persona: Admin Sekolah (Operator TU / Panitia PPDB)

**Profil:** Staff tata usaha sekolah, 30-50 tahun, melek digital menengah, bertugas mengelola seluruh proses PPDB dari sisi sekolah.

**Pain Points:**
- **Input manual berulang:** Data pendaftar dari formulir fisik harus diketik ulang ke spreadsheet, kemudian ke Dapodik — rentan human error, memakan waktu berhari-hari.
- **Verifikasi dokumen yang melelahkan:** Memeriksa ratusan dokumen satu per satu (KK, akta, rapor) tanpa tools untuk validasi otomatis.
- **Tidak ada audit trail:** Sulit melacak siapa yang mengubah status pendaftar, kapan, dan mengapa — rawan manipulasi internal.
- **Multi-sistem tidak terintegrasi:** Sistem PPDB daerah, Dapodik, dan sistem keuangan sekolah terpisah — data harus di-input ke 3 tempat berbeda.
- **Komunikasi manual ke pendaftar:** Informasi hasil, dokumen kurang, atau perbaikan harus dihubungi satu per satu via telepon/WA.
- **Beban puncak musiman:** Hanya sibuk 2-3 bulan/tahun tetapi intensitasnya sangat tinggi, tanpa sistem yang memadai untuk menghandle lonjakan volume.
- **Laporan ke dinas membutuhkan format khusus:** Harus membuat laporan rekapitulasi manual sesuai format yang diminta dinas (berbeda antar daerah).

**Sumber:** [PPDB Sekolah - Digitalisasi](https://ppdbsekolah.com/aplikasi-ppdb-sekolah-online-untuk-digitalisasi-sekolah-anda/), [Seven Media Tech - Aplikasi PPDB Online](https://sevenmediatech.co.id/2025/03/11/aplikasi-ppdb-online-berbasis-web/)

---

### 5.3 Persona: Kepala Sekolah / Manajemen Sekolah Swasta

**Profil:** Kepala sekolah atau direktur yayasan, bertanggung jawab atas pemenuhan kuota siswa baru dan keberlangsungan finansial sekolah.

**Pain Points:**
- **Kompetisi dengan sekolah negeri:** Siswa yang harusnya ke sekolah swasta "tersedot" ke sekolah negeri via jalur zonasi.
- **Tidak ada visibilitas real-time:** Tidak tahu berapa pendaftar aktif, berapa yang sudah bayar, berapa yang mundur — keputusan strategis lambat.
- **Manajemen gelombang pendaftaran manual:** Membuka gelombang 1, 2, 3 dengan ketentuan berbeda (biaya, diskon) dikelola via spreadsheet.
- **Konversi pendaftar ke siswa rendah:** Banyak yang mendaftar tapi tidak datang daftar ulang — tidak ada sistem follow-up otomatis.
- **Risiko gagal bayar:** Setelah siswa diterima, proses pembayaran uang pangkal/SPP pertama tidak terkelola dengan baik.
- **Kesulitan data historis:** Tidak ada rekap data pendaftar tahun lalu sebagai benchmark untuk proyeksi tahun berikutnya.

---

### 5.4 Persona: Dinas Pendidikan

**Profil:** Pejabat/staf Dinas Pendidikan Kabupaten/Kota/Provinsi, bertanggung jawab mengawasi dan mengoordinasikan PPDB di wilayahnya.

**Pain Points:**
- **Fragmentasi sistem antar sekolah:** Setiap sekolah swasta menggunakan sistem berbeda (bahkan manual) — dinas tidak punya visibilitas terpusat.
- **Kecurangan sulit dideteksi:** Manipulasi KK untuk zonasi, titipan oknum — sulit dibuktikan tanpa audit trail digital yang andal.
- **Server down publik:** Saat banyak orang akses bersamaan, sistem PPDB daerah crash — merusak kepercayaan publik.
- **Kurangnya data agregat:** Tidak ada dashboard terpusat yang menunjukkan berapa total pendaftar, berapa yang diterima, berapa yang tidak tertampung — sulit membuat kebijakan berbasis data.
- **Koordinasi dengan kementerian:** Pelaporan ke Kemendikdasmen memerlukan format data tertentu yang sering berbeda dari format sistem yang digunakan daerah.
- **Tekanan publik:** Media dan masyarakat sangat kritis terhadap setiap masalah PPDB — setiap kecurangan menjadi berita nasional.

**Statistik Kecurangan PPDB 2024:**
- Dinas Pendidikan Jawa Barat mencoret **200+ calon siswa** karena manipulasi domisili KK
- Praktik "titipan" lewat oknum guru/komite sekolah dengan biaya jutaan rupiah
- Pemerasan oleh oknum yang menjanjikan kursi dengan memungut biaya dari orang tua

**Sumber:** [Detik - Masalah PPDB 2024](https://www.detik.com/edu/sekolah/d-7402085/masalah-ppdb-2024-kecurangan-jalur-prestasi-hingga-cpdb-tak-masuk-dtks), [Pikiran Rakyat - Server PPDB Jabar Error](https://jabar.pikiran-rakyat.com/jawa-barat/pr-3658171177/mohon-maaf-link-ppdb-jabar-2024-error-gegara-gangguan-server-pendaftaran-offline-ke-sekolah)

---

### 5.5 Insight Lintas Persona

| Insight | Implikasi Produk |
|---|---|
| Data kependudukan (NIK/KK) sering tidak match dengan data pendidikan (NISN/Dapodik) | Sistem harus handle edge case validasi, bukan hanya tolak/terima mentah |
| Kecurangan terjadi karena celah sistem, bukan hanya moral | Audit trail immutable, real-time monitoring anomali sangat kritis |
| Orang tua butuh transparansi, bukan hanya kepatuhan | Dashboard publik yang informatif (peta zona, ranking real-time) meningkatkan kepercayaan |
| Admin sekolah kewalahan dengan multi-sistem tidak terintegrasi | Nilai utama: single platform dari PPDB hingga input Dapodik |
| Sekolah swasta tidak punya benchmark & data historis | Fitur analytics & reporting historis menjadi pembeda |
| Komunikasi ke pendaftar masih manual | WhatsApp/email automation wajib, bukan opsional |

---

## 6. Product Requirements High-Level

### 6.1 Functional Requirements

#### Modul 1: Manajemen Pendaftaran
- [ ] **Formulir Pendaftaran Online** — responsif (mobile-first), mendukung semua jenjang TK-SMA
- [ ] **Upload Dokumen** — mendukung PDF/JPG/PNG, validasi ukuran & format, preview dokumen
- [ ] **Validasi NIK Real-time** — integrasi API Dukcapil (atau fallback manual)
- [ ] **Validasi NISN** — integrasi Dapodik/Pusdatin
- [ ] **OTP Verifikasi** — via SMS atau WhatsApp
- [ ] **Nomor Pendaftaran Unik** — autogenerate, untuk tracking
- [ ] **Multi-gelombang Pendaftaran** — konfigurasi periode, kuota, biaya per gelombang (untuk swasta)
- [ ] **Pratinjau Status Pendaftaran** — real-time oleh orang tua tanpa login ulang

#### Modul 2: Verifikasi Dokumen
- [ ] **Dashboard Verifikasi Admin** — list pendaftar dengan status, filter, sort
- [ ] **Review Dokumen Side-by-side** — tampilkan formulir + dokumen dalam satu layar
- [ ] **Status Verifikasi** — Diterima / Ditolak / Perbaikan (dengan catatan)
- [ ] **Notifikasi Otomatis** — WhatsApp/email ke pendaftar saat status berubah
- [ ] **Audit Trail** — log setiap aksi (siapa, kapan, apa yang diubah)
- [ ] **Checklist Dokumen per Jalur** — panduan verifikasi sesuai jenis jalur yang dipilih

#### Modul 3: Seleksi Multi-Jalur
- [ ] **Jalur Domisili (Zonasi):**
  - Kalkulasi jarak GPS otomatis (Haversine/Google Maps API)
  - Import peta zona dari GeoJSON/shapefile
  - Ranking real-time berdasarkan jarak terdekat
  - Tiebreaker otomatis (usia jika jarak sama)
- [ ] **Jalur Afirmasi:**
  - Verifikasi kepesertaan DTKS/KIP (upload dokumen + opsional API SIKS-NG)
  - Kuota afirmasi terpisah dan termonitor
- [ ] **Jalur Prestasi:**
  - Poin sistem untuk piagam (level internasional, nasional, provinsi, kab/kota)
  - Import nilai TKA dari file CSV/Excel (untuk SPMB 2026)
  - Kalkulasi nilai rapor 5 semester otomatis
  - Ranking gabungan prestasi akademik + non-akademik
- [ ] **Jalur Mutasi:**
  - Upload surat tugas orang tua
  - Verifikasi manual oleh operator
- [ ] **Konfigurasi Kuota per Jalur** — sesuai regulasi SPMB, dengan peringatan jika tidak sesuai
- [ ] **Simulasi Seleksi** — admin bisa preview hasil seleksi sebelum difinalisasi

#### Modul 4: Pengumuman & Transparansi
- [ ] **Dashboard Publik Real-time** — ranking, jumlah pendaftar per jalur, kuota tersisa (tanpa login)
- [ ] **Pengumuman Terjadwal** — auto-publish hasil pada waktu yang ditetapkan
- [ ] **Notifikasi Massal** — WhatsApp/email blast ke seluruh pendaftar sekaligus
- [ ] **Cetak Bukti Penerimaan** — PDF auto-generated untuk siswa yang diterima

#### Modul 5: Daftar Ulang & Pembayaran
- [ ] **Portal Daftar Ulang** — siswa diterima mengisi kelengkapan data & upload dokumen tambahan
- [ ] **Manajemen Pembayaran:**
  - Virtual Account per siswa (multi-bank)
  - QRIS
  - Transfer manual + verifikasi
  - Pembayaran di minimarket
- [ ] **Tagihan Otomatis** — uang pangkal, SPP pertama, seragam (sesuai konfigurasi sekolah)
- [ ] **Status Pembayaran Real-time** — dashboard admin + notifikasi orang tua
- [ ] **Reminder Pembayaran** — otomatis via WhatsApp/email menjelang deadline
- [ ] **Batas Waktu Daftar Ulang** — sistem otomatis membatalkan jika melewati batas

#### Modul 6: Integrasi & Sinkronisasi Data
- [ ] **Export ke Format Dapodik** — data siswa baru dalam format yang kompatibel dengan import Dapodik
- [ ] **API Dapodik** (opsional advanced) — sinkronisasi langsung
- [ ] **Laporan ke Dinas** — generate laporan rekapitulasi sesuai format standar
- [ ] **Import Data Siswa** — dari file Excel untuk migrasi/backup

#### Modul 7: Analytics & Reporting
- [ ] **Dashboard Admin Sekolah:**
  - Total pendaftar real-time per jalur
  - Conversion funnel (daftar → verifikasi → seleksi → daftar ulang → bayar)
  - Distribusi asal sekolah/wilayah pendaftar
  - Perbandingan dengan tahun sebelumnya
- [ ] **Dashboard Dinas Pendidikan** (jika B2G):
  - Agregat data seluruh sekolah di wilayah
  - Peta penyebaran siswa diterima
  - Monitoring anomali (calon yang manipulasi data)
- [ ] **Laporan PDF/Excel** — berbagai format untuk berbagai keperluan pelaporan

#### Modul 8: Manajemen Pengguna & Keamanan
- [ ] **Role-based Access Control:** Super Admin, Admin Sekolah, Operator Verifikasi, Bendahara, Panitia Seleksi, Kepala Sekolah (view only), Publik
- [ ] **2FA** — untuk akun admin sekolah dan dinas
- [ ] **Log Aktivitas** — immutable audit trail semua transaksi
- [ ] **Pembatasan IP** — opsional untuk akses admin
- [ ] **Enkripsi Data** — data sensitif (NIK, KK) dienkripsi at rest

---

### 6.2 Non-Functional Requirements

| Kategori | Requirement | Target |
|---|---|---|
| **Performa** | Response time halaman | < 2 detik (p95) |
| **Performa** | Kapasitas concurrent user | Min. 1.000 user per sekolah (10.000 untuk platform dinas) |
| **Ketersediaan** | Uptime | 99.9% (terutama saat peak PPDB) |
| **Skalabilitas** | Auto-scaling | Dapat scale up/down otomatis saat lonjakan traffic |
| **Keamanan** | Enkripsi data transmisi | HTTPS/TLS 1.3 |
| **Keamanan** | Enkripsi data tersimpan | AES-256 untuk data sensitif |
| **Keamanan** | Proteksi OWASP Top 10 | Wajib (SQL injection, XSS, CSRF, dll.) |
| **Kepatuhan** | Privasi data | Sesuai UU PDP (Perlindungan Data Pribadi) No. 27/2022 |
| **Aksesibilitas** | Mobile responsif | Mobile-first design |
| **Aksesibilitas** | Browser compatibility | Chrome, Firefox, Safari, Edge (2 versi terakhir) |
| **Aksesibilitas** | Koneksi lambat | Berfungsi dengan baik di koneksi 3G |
| **Integrasi** | API Dukcapil | Fallback mekanisme jika API down |
| **Backup** | Data backup | Daily automated backup, 30-day retention |
| **Recovery** | RTO | < 4 jam |
| **Recovery** | RPO | < 1 jam |
| **Audit** | Audit log | Immutable, tidak bisa dihapus oleh siapapun |

---

### 6.3 Perbedaan Negeri vs Swasta

| Dimensi | Sekolah Negeri | Sekolah Swasta |
|---|---|---|
| **Regulasi PPDB** | Wajib ikut Permendikdasmen No. 3/2025 (SPMB) | Tidak wajib ikut SPMB (kecuali bermitra dinas) |
| **Jalur Seleksi** | 4 jalur wajib: domisili, afirmasi, prestasi, mutasi | Bebas menentukan jalur (tes akademik, psikotes, dll.) |
| **Kuota per Jalur** | Wajib sesuai regulasi (zonasi min. 30-70%) | Bebas menentukan kuota |
| **Biaya** | Gratis (dilarang pungutan) | Boleh memungut biaya (uang pangkal, SPP, dll.) |
| **Jadwal** | Ditetapkan dinas, serentak | Fleksibel, multi-gelombang, bisa sepanjang tahun |
| **Integrasi Dapodik** | Wajib | Wajib (tapi sering tidak real-time) |
| **Transparansi Publik** | Wajib (ranking, kuota, daya tampung) | Opsional |
| **Verifikasi Dokumen** | Via sekolah terdekat atau online | Via sekolah itu sendiri |
| **Zonasi GPS** | Wajib (jalur domisili) | Tidak relevan |
| **Strategi Pemasaran** | Tidak perlu (demand driven) | Perlu aktif promosi |
| **Pembayaran** | Tidak ada (atau sangat terbatas) | Kompleks (uang pangkal, SPP, seragam, buku) |

**Implikasi Produk:**
- Sistem harus mendukung **dua mode operasi**: mode SPMB (negeri/mitra dinas) dan mode mandiri (swasta)
- Konfigurasi jalur, kuota, dan payment harus **fully configurable** per sekolah
- Fitur payment gateway yang lengkap menjadi **kritis untuk swasta**
- Fitur zonasi GPS hanya wajib untuk mode negeri

---

## 7. Opportunity & Recommendation

### 7.1 Opportunity Landscape

#### Opportunity 1: Sekolah Swasta yang Terabaikan (Market Primary)
**Ukuran:** >180.000 sekolah swasta di Indonesia, mayoritas tanpa sistem PPDB digital.
**Masalah:** Tidak ada solusi yang benar-benar dirancang untuk kebutuhan swasta (multi-gelombang, tes masuk, manajemen pembayaran kompleks).
**Peluang:** Platform PPDB yang memahami workflow swasta → SaaS per-sekolah, low friction onboarding.

#### Opportunity 2: Compliance Tool untuk SPMB 2026 (Regulatory Driven)
**Driver:** Permendikdasmen No. 3/2025 mewajibkan sistem online; SE SPMB 2026 memperkenalkan TKA sebagai komponen wajib.
**Masalah:** Banyak sekolah dan dinas belum siap implementasi teknis.
**Peluang:** Platform yang sudah comply dengan regulasi terbaru = competitive advantage vs kompetitor yang lambat update.

#### Opportunity 3: Integrasi Dapodik yang Tidak Dimiliki Kompetitor
**Gap:** TIDAK ADA satu pun kompetitor yang menawarkan sinkronisasi langsung ke Dapodik pasca-PPDB.
**Dampak:** Admin sekolah harus input data 2x (di sistem PPDB + di Dapodik).
**Peluang:** Fitur export/sync Dapodik sebagai killer feature differentiator.

#### Opportunity 4: Platform Dinas (B2G) sebagai Growth Lever
**Model:** SIAP PPDB Telkom dominan tapi tua, mahal, dan tidak fleksibel.
**Peluang:** White-label platform modern untuk dinas pendidikan kab/kota → satu kontrak mengunci ratusan sekolah negeri sekaligus.

---

### 7.2 Rekomendasi Strategis

#### Rekomendasi 1: Mulai dari Sekolah Swasta, Expand ke Negeri
**Rationale:** Sekolah swasta tidak memerlukan integrasi pemerintah yang kompleks → time-to-market lebih cepat. Setelah product-market fit, barulah masuk ke segmen negeri via pemda.

**Go-to-market:** Yayasan dengan 3-10 sekolah sebagai target awal — satu deal mengunci banyak sekolah sekaligus, efisiensi sales.

#### Rekomendasi 2: Buat Fitur Integrasi Dapodik sebagai Killer Feature
**Rationale:** Tidak ada kompetitor yang punya ini. Menyelesaikan pain point terbesar admin sekolah (input ganda).
**Implementasi:** Export CSV sesuai format Dapodik sebagai langkah pertama; API direct sebagai roadmap.

#### Rekomendasi 3: Compliance-First Positioning
**Rationale:** Sekolah takut melanggar regulasi. Platform yang sudah "SPMB-ready" dan "TKA-ready" menjual dirinya sendiri.
**Implementasi:** Template konfigurasi per jenjang (SD/SMP/SMA) yang sudah preset sesuai Permendikdasmen No. 3/2025; panduan compliance in-app.

#### Rekomendasi 4: WhatsApp sebagai Core Communication Channel
**Rationale:** Penetrasi WhatsApp di Indonesia >90%. Orang tua lebih responsif terhadap WA daripada email. Notifikasi WA meningkatkan konversi daftar ulang.
**Implementasi:** Integrasi WhatsApp Business API sebagai default notification channel; template pesan terstandar.

#### Rekomendasi 5: Dashboard Publik sebagai Trust Builder
**Rationale:** Kecurangan PPDB merusak kepercayaan publik terhadap sekolah. Sekolah yang punya dashboard publik transparan (ranking real-time, kuota tersisa) membangun brand yang kuat.
**Implementasi:** URL publik per sekolah tanpa login; peta visual zona; timeline pengumuman yang jelas.

#### Rekomendasi 6: Pricing Model yang Tepat
**Untuk swasta:** Per-sekolah/bulan (Rp 200.000-500.000) atau per-siswa-mendaftar (Rp 5.000-10.000/pendaftar) selama periode PPDB — lebih sesuai dengan musiman PPDB.
**Untuk dinas:** Annual contract dengan harga per-sekolah yang menjadi tanggung jawab dinas.

---

### 7.3 Risiko & Mitigasi

| Risiko | Probabilitas | Dampak | Mitigasi |
|---|---|---|---|
| API Dukcapil tidak stabil/berubah | Tinggi | Tinggi | Fallback verifikasi manual; cache data valid; monitor API status |
| Regulasi SPMB berubah lagi | Tinggi | Sedang | Arsitektur configurable; update cepat saat regulasi berubah |
| Server down saat peak PPDB | Sedang | Sangat Tinggi | Auto-scaling cloud; load testing sebelum musim; CDN |
| Kompetitor besar (Telkom) masuk segmen swasta | Sedang | Tinggi | Bangun switching cost: integrasi ekosistem, data historis |
| Adopsi rendah (sekolah tetap manual) | Sedang | Sedang | Onboarding gratis, training, user champion program |
| Kecurangan melalui platform | Rendah | Sangat Tinggi | Audit trail immutable, anomaly detection, verifikasi berlapis |
| Kebocoran data pribadi (NIK, KK) | Rendah | Sangat Tinggi | Enkripsi penuh, penetration testing, comply UU PDP |

---

### 7.4 Roadmap High-Level (Suggested)

```
PHASE 1 (MVP, 3-4 bulan)
├── Registrasi & akun (NIK/email/OTP)
├── Upload dokumen (tanpa integrasi Dukcapil dulu)
├── Verifikasi manual oleh admin
├── Pengumuman hasil (manual trigger)
├── Notifikasi WhatsApp dasar
└── Target: Sekolah swasta, mode mandiri

PHASE 2 (4-6 bulan setelah MVP)
├── Integrasi Dukcapil (validasi NIK real-time)
├── Kalkulasi jarak GPS (jalur domisili)
├── Seleksi multi-jalur otomatis (SPMB compliant)
├── Dashboard publik real-time
├── Payment gateway (VA, QRIS, minimarket)
└── Target: Sekolah negeri + sekolah swasta mitra dinas

PHASE 3 (6-12 bulan)
├── Integrasi Dapodik (export format + API)
├── Import nilai TKA (SPMB 2026)
├── Dashboard dinas pendidikan
├── White-label untuk pemda
├── Analytics & benchmarking
└── Target: B2G (dinas pendidikan kab/kota)
```

---

## Referensi & Sumber

### Regulasi
- [Permendikdasmen No. 3 Tahun 2025 tentang SPMB - BPK RI](https://peraturan.bpk.go.id/Details/315671/permendikdasmen-no-3-tahun-2025)
- [PP No. 57 Tahun 2021 Standar Nasional Pendidikan - BPK RI](https://peraturan.bpk.go.id/Details/165024/pp-no-57-tahun-2021)
- [BBPMP Jabar - Penguatan Regulasi SPMB 2026 (TKA)](https://bbpmpjabar.kemendikdasmen.go.id/penguatan-regulasi-spmb-2026-hasil-tka-dimanfaatkan-pada-jalur-prestasi/)
- [Kemendikdasmen - SE SPMB 2026/2027](https://kemendikdasmen.go.id)
- [Permendikbud 79/2015 - Dapodik (UGM)](https://luk.staff.ugm.ac.id/atur/Permendikbud79-2015DataPokokPendidikan.pdf)
- [FAQ SPMB 2026 Kemendikdasmen](https://pauddikdasmen.kemendikdasmen.go.id/faq-spmb-2026)

### PPDB Flow & Teknis
- [Dinas Pendidikan Purwakarta - Alur PPDB 2024/2025](https://disdik.purwakartakab.go.id/berita/detail/alur-pendaftaran-ppdb-online-tahun-20242025)
- [Fokus.co.id - Lama Proses Verifikasi PPDB](https://fokus.co.id/edu/berapa-lama-proses-verifikasi-ppdb-online)
- [Tirto - Alur Verifikasi SPMB/PPDB SMP 2025](https://tirto.id/alur-verifikasi-dan-jenis-piagam-untuk-daftar-spmb-ppdb-smp-2025-hcBN)
- [ANTARA - Tata Cara SPMB Jakarta 2025](https://www.antaranews.com/berita/4844761/tata-cara-dan-alur-pendaftaran-spmb-jakarta-2025)
- [Sekolapedia - Panduan SMP Negeri 2025](https://daftarsekolah.spmb.teknokrat.ac.id/2026/02/panduan-lengkap-langkah-langkah-pendaftaran-smp-negeri-2025-melalui-ppdb-online-terbaru/)
- [KakakIky - Cara Hitung Jarak Zonasi](https://www.kakakiky.id/2026/01/cara-hitung-jarak-rumah-ke-sekolah-jalur-zonasi-ppdb.html)
- [Indonesia.go.id - Sistem PPDB 2025 Empat Jalur](https://indonesia.go.id/kategori/sosial-budaya/8964/sistem-ppdb-2025-diperbarui-empat-jalur-penerimaan-siswa-baru-diterapkan?lang=1)

### Kompetitor
- [AdminSekolah.net](https://adminsekolah.net/)
- [SkoolaCloud](https://skoolacloud.id/)
- [PPDBSekolah.com](https://ppdbsekolah.com/)
- [SIAP PPDB Online](https://siap-ppdb.com/)
- [MySCH.id](https://www.mysch.id/ppdb)
- [12 Aplikasi Sekolah Terbaik 2026 - HashmMicro](https://www.hashmicro.com/id/blog/5-aplikasi-sekolah-terbaik-di-indonesia/)

### Pain Points & Masalah
- [Detik - Masalah PPDB 2024](https://www.detik.com/edu/sekolah/d-7402085/masalah-ppdb-2024-kecurangan-jalur-prestasi-hingga-cpdb-tak-masuk-dtks)
- [NU Online - Keluhan Orang Tua Zonasi](https://www.nu.or.id/nasional/orang-tua-keluhkan-sistem-ppdb-zonasi-minta-pemerintah-evaluasi-xaON2)
- [Pikiran Rakyat - Server PPDB Jabar Error](https://jabar.pikiran-rakyat.com/jawa-barat/pr-3658171177/mohon-maaf-link-ppdb-jabar-2024-error-gegara-gangguan-server-pendaftaran-offline-ke-sekolah)
- [Kumparan - NIK Tidak Ditemukan PPDB](https://kumparan.com/berita-hari-ini/cara-mengatasi-nik-tidak-ditemukan-saat-pendaftaran-ppdb-online-2024-22jpOBZVK3J)
- [Kompasiana - Masalah PPDB Online 2024](https://www.kompasiana.com/owenjuve/665fc72534777c0c5558d452/sekelumit-masalah-ppdb-online-tahun-2024)

### Best Practice & Inovasi
- [Espos.id - Inovasi Disdik Semarang (Swasta Gratis PPDB)](https://regional.espos.id/inovasi-disdik-kota-semarang-sekolah-swasta-gratis-masuk-ppdb-2025-2044435)
- [BBPMP Jateng - Inovasi PPDB](https://bbpmpjateng.kemendikdasmen.go.id/mewujudkan-pendidikan-yang-merata-dan-berkualitas-tantangan-dan-inovasi-dalam-ppdb/)
- [MySCH - Strategi PPDB Sekolah Swasta](https://mysch.id/blog/detail/67/strategi-ppdb-sekolah-swasta-kepala-sekolah-berperan-penting)

---

*Dokumen ini disiapkan berdasarkan riset publik per Maret 2026. Peraturan pendidikan Indonesia dapat berubah — selalu verifikasi ke sumber resmi Kemendikdasmen sebelum implementasi.*
