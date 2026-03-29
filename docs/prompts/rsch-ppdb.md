# @docs/product-research/ppdb-terintegrasi.md

## Prompt: Product Research Sistem Akademi Pendidikan Terintegrasi (Indonesia)

Sebagai seorang **Product Researcher**, saya ingin Anda melakukan riset mendalam mengenai:

> **"Sistem Akademi Pendidikan Terintegrasi untuk sekolah negeri dan swasta mulai dari TK sampai SMA"**

dengan fokus utama pada modul:
> **Penerimaan Peserta Didik Baru (PPDB)**

---

## 🎯 Tujuan Riset
Mengumpulkan insight komprehensif untuk merancang sistem PPDB yang:
- End-to-end (dari registrasi hingga diterima)
- Digunakan oleh sekolah negeri dan swasta
- Sesuai regulasi pendidikan Indonesia
- Kompetitif dengan produk yang sudah ada di pasar

---

## 🔍 Scope Riset

Lakukan pencarian berbasis Google dan sumber terpercaya lainnya untuk memahami:

### 1. Alur Lengkap PPDB (End-to-End Flow)
Telusuri dan jelaskan secara detail:

#### a. Registrasi
- Cara pendaftaran (online/offline/hybrid)
- Data yang dikumpulkan (NISN, NIK, dll)
- Mekanisme verifikasi (OTP, Dukcapil, dll)

#### b. Pengisian Formulir & Upload Dokumen
- Dokumen wajib:
  - Kartu Keluarga
  - Akta Kelahiran
  - Raport / Nilai
  - KIP/KKS (jika ada)
- Validasi dokumen (manual vs otomatis)

#### c. Onboarding / Verifikasi
- Proses verifikasi oleh sekolah/dinas
- Status (pending, verified, rejected)
- Mekanisme revisi data

#### d. Seleksi & Ujian
- Sistem seleksi:
  - Zonasi
  - Prestasi
  - Tes masuk (khusus swasta)
- Metode ujian:
  - Online test
  - Offline test
- Sistem penilaian & ranking

#### e. Pengumuman
- Cara pengumuman hasil
- Transparansi ranking (terutama negeri)
- Notifikasi (SMS/email/dashboard)

#### f. Daftar Ulang (Final Acceptance)
- Proses konfirmasi siswa diterima
- Pembayaran (khusus swasta)
- Integrasi ke sistem akademik

---

### 2. Regulasi Pemerintah (WAJIB)
Analisis dan ringkas bagaimana sistem harus comply terhadap:

- Undang-undang Nomor 20 Tahun 2003 (Sisdiknas)
- Peraturan Pemerintah Nomor 57 Tahun 2021 (SNP)
- Peraturan Pemerintah Nomor 17 Tahun 2010
- Permendikdasmen Nomor 79 Tahun 2015 (Dapodik)
- Permendikdasmen Nomor 1 Tahun 2026 (SNP terbaru)

Output:
- Ringkasan tiap regulasi
- Dampaknya terhadap sistem PPDB
- Requirement wajib yang harus ada di sistem

---

### 3. Benchmark Produk (Competitor Analysis)

Analisis produk berikut:
- https://adminsekolah.net/
- https://skoolacloud.id/

Tambahkan juga jika menemukan produk serupa lainnya.

Untuk setiap produk:
- Fitur utama PPDB
- Kelebihan
- Kekurangan
- Unique selling points
- Target market (negeri/swasta)

---

### 4. Best Practices & Insight
Identifikasi:
- Best practice sistem PPDB modern
- Pain points:
  - Siswa/orang tua
  - Admin sekolah
  - Dinas pendidikan
- Tren digitalisasi pendidikan di Indonesia

---

### 5. Requirement Sistem (Output Insight)
Turunkan hasil riset menjadi:

#### a. Functional Requirements
- Modul utama PPDB
- Role & permission
- Workflow sistem

#### b. Non-Functional Requirements
- Security
- Scalability
- Compliance

#### c. Perbedaan Negeri vs Swasta
- Jalur seleksi
- Fleksibilitas sistem
- Kebijakan pembayaran

---

## 📊 Format Output

Susun hasil dalam format markdown terstruktur:

### 1. Executive Summary  
### 2. PPDB End-to-End Flow  
### 3. Regulatory Compliance Mapping  
### 4. Competitor Analysis  
### 5. Key Insights & Pain Points  
### 6. Product Requirements (High-Level)  
### 7. Opportunity & Recommendation  

Gunakan:
- Bullet points
- Table perbandingan
- Diagram flow (jika memungkinkan dalam teks)

---

## ⚠️ Catatan Penting

- Fokus pada konteks **Indonesia**
- Gunakan sumber yang kredibel
- Jangan hanya deskriptif — berikan **analisis**
- Prioritaskan insight yang bisa digunakan untuk **product design**

---

## ✅ Expected Outcome

Dokumen ini akan digunakan sebagai:
- Dasar pembuatan PRD
- Input desain sistem
- Referensi stakeholder (product, tech, bisnis)

---

## 📋 Research Addendum — 2026-03-29

> Temuan tambahan dari peer review PRD v1.0.1. Area-area di bawah ini perlu diperdalam dan dimasukkan ke PRD dan TRD.

---

### A. Alur Multi-Jalur & Prioritas Pilihan (Negeri)

Riset awal belum mengklarifikasi apakah pendaftar di sekolah negeri dapat mendaftar ke **lebih dari satu jalur** dengan urutan prioritas (pilihan 1/2/3). Ini adalah perilaku CORE di PPDB negeri:

- **Dalam satu sekolah**: Pendaftar dapat memilih jalur utama (prioritas 1) dan jalur cadangan (prioritas 2) — jika tidak lolos jalur utama, sistem memproses jalur cadangan otomatis
- **Lintas sekolah (dinas-level)**: Pendaftar mendaftar ke beberapa sekolah dengan ranking pilihan; sistem dinas mengorkestrasi penempatan — ini adalah v2 (bukan v1 per-school SaaS)
- **Yang perlu diteliti**: Apakah Permendikdasmen 3/2025 mewajibkan sistem pilihan multi-jalur dalam satu sekolah, atau hanya satu jalur per pendaftaran?

**Implikasi sistem v1**: `ppdb_applicant_choices` tabel — satu pendaftar bisa punya 1-3 track preference dengan urutan prioritas di satu sekolah.

---

### B. Aturan Spesifik per Jenjang (TK / SD / SMP / SMA)

Permendikdasmen 3/2025 mencakup TK s.d. SMA/SMK, tetapi mekanisme seleksi **berbeda per jenjang**. Perlu diriset:

| Jenjang | Gap yang belum diriset |
|---------|----------------------|
| TK / PAUD | Tidak ada NISN, tidak ada nilai rapor — berbasis observasi/wawancara + usia |
| SD | Usia minimum 6–7 tahun menjadi primary filter; kuota zonasi berbeda (70% domisili) |
| SMP | Sudah teragenda dengan baik di PRD awal |
| SMA/SMK | Sudah teragenda; perlu klarifikasi SMK (ada jalur tes bakat/minat) |

**Engine harus parameterized by level** — tidak satu flow untuk semua jenjang.

---

### C. Role & Permission Matrix

Definisi lengkap siapa bisa melakukan apa belum ada di riset awal. Perlu didefinisikan:

| Role | Scope Akses | Aksi Kritis |
|------|------------|-------------|
| Pendaftar (Orang Tua/Siswa) | Portal pendaftar milik sendiri | Submit formulir, upload dokumen, cek status, daftar ulang |
| Operator Verifikasi | Semua pendaftar sekolah tersebut | Verifikasi/tolak dokumen, beri catatan |
| Admin Sekolah | Seluruh konfigurasi sekolah | Setup PPDB, jalankan seleksi, publish pengumuman |
| Kepala Sekolah | Read-only + approval | Approve konfigurasi jalur, lihat audit trail, tidak bisa ubah data |
| Super Admin (Simdikta) | Cross-school (internal ops) | Support access, tidak bisa ubah data akademik |

**Tidak termasuk Dinas/B2G** — ini adalah v2 dan secara eksplisit bukan scope v1.

---

### D. State Machine Formal Pendaftar

Status pendaftar perlu diforma lisasikan. Dari riset dan Permendikdasmen 3/2025:

```
Draft → Submitted → Under_Verification → Need_Correction → [kembali ke Draft]
                                       ↘ Verified → In_Selection → Ranked
                                                                  ↘ Accepted → ReRegistration_Pending → ReRegistered → Enrolled
                                                                  ↘ Waitlisted → [Accepted jika kuota terbuka]
                                                                  ↘ Rejected → [terminal]
```

Tiga state machine pendukung:
- **Dokumen**: Uploaded → Under_Check → Accepted / Rejected → Replaced
- **Pembayaran** (swasta): Unbilled → Invoiced → Paid / Expired → Cancelled
- **Dapodik sync**: Ready_To_Export → Exported → Import_Verified / Failed → Re_Export_Required

---

### E. Compliance Mapping Audit-Ready

Riset awal menyebut regulasi tetapi belum memetakannya ke requirement sistem secara audit-friendly. Tabel ini perlu ada di PRD:

| Regulasi | Dampak Sistem | Evidence/Audit |
|----------|--------------|---------------|
| UU 20/2003 (Sisdiknas) | Form registrasi inklusif, tidak diskriminatif | Log pendaftaran, histori kuota |
| PP 57/2021 jo. PP 4/2022 | Konfigurasi jenjang, jalur, evaluasi berbasis SNP | Selection rule config, export report |
| Permendikbud 79/2015 (Dapodik) | Export mapping configurable, validasi field | Export batch, mapping version |
| Permendikdasmen 3/2025 | Engine jalur per jenjang, kuota per jalur, tiebreaker | Rule version, quota snapshot, ranking snapshot |
| Permendikdasmen 1/2026 | Workflow proses berbeda per jenjang (PAUD-menengah) | Per-level config, admission policy log |
| UU PDP 27/2022 | NIK/KK masked di semua response, encrypted at rest | Masking audit, encryption key rotation log |

---

### F. Edge Cases yang Harus Di-cover

Dari review, skenario berikut belum ada acceptance criteria-nya:

1. **Siswa pindah jalur** — Apakah diizinkan setelah submit? Sebelum/sesudah verifikasi?
2. **Duplicate NISN** — Dua pendaftar dengan NISN sama; sistem harus flag, bukan crash
3. **Orang tua tanpa HP aktif** — Fallback ke SMS, atau verifikasi di sekolah (walk-in mode)
4. **Sekolah tanpa koordinat GPS valid** — Jalur domisili tidak bisa diaktifkan; sistem warning saat setup
5. **Pending verification melewati SLA** — Setelah X jam tidak diverifikasi → escalate ke admin / auto-notify
6. **Kuota habis di semua jalur** — Pendaftar tetap bisa daftar tapi masuk waiting list

---

### G. Split v1 (MVP realistis) vs v2

Batasan eksplisit yang harus ada di PRD:

**v1 (dalam scope):**
- Setup PPDB per sekolah (wizard)
- Registrasi + upload dokumen
- Verifikasi manual oleh operator
- 4 jalur SPMB (domisili, afirmasi, prestasi, mutasi) + custom untuk swasta
- Multi-jalur priority pilihan (dalam satu sekolah)
- Seleksi otomatis + ranking
- Pengumuman + daftar ulang
- Payment (swasta)
- Export Dapodik (configurable XLSX)
- Audit trail + notifikasi WhatsApp/SMS dasar

**v2 (bukan scope v1):**
- API Dukcapil real-time
- CBT/tes online internal
- TKA auto-integration (v1: manual CSV upload)
- Dashboard dinas / white-label B2G
- Multi-school cross-school orchestration (lintas sekolah dinas)
- Fraud detection lanjutan (device fingerprint, clustering)
- Advanced analytics & reporting
- Workflow SLA escalation otomatis
