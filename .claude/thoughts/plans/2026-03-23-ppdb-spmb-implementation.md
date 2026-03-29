Status: ✅ Up-to-date
Version: v1.0.1
Last Updated: 2026-03-29
Depends On: TRD v1.1.0 — 2026-03-23-ppdb-spmb-design.md

---

# Plan: Modul PPDB/SPMB — Implementasi Lengkap

**Date**: 2026-03-23
**Status**: Draft
**PRD**: `.claude/thoughts/product/2026-03-23-ppdb-spmb-prd.md`
**TDD**: `.claude/thoughts/architecture/2026-03-23-ppdb-spmb-design.md`
**Scope**: Full-stack (Go backend + Next.js frontend + infra)

---

## Summary

Membangun modul PPDB/SPMB end-to-end untuk Simdikta: sistem penerimaan siswa baru yang menggabungkan registrasi online, verifikasi dokumen, seleksi multi-jalur (domisili/afirmasi/prestasi/mutasi), pembayaran, dan ekspor Dapodik — dalam satu platform multi-tenant untuk sekolah negeri dan swasta.

Implementasi dibagi menjadi **8 Phase** dengan total estimasi ~15 minggu. Riskiest assumption (selection engine) di-address di Phase 3 — sebelum UI dibangun.

---

## Approach

- **Modular monolith**: satu Go binary, strict package boundaries (`internal/domain` → `internal/service` → `internal/handler`)
- **Multi-tenant via `school_id`**: setiap query wajib scope ke school_id dari JWT claims
- **Immutable audit log**: `ppdb_audit_logs` INSERT-only, tidak ada UPDATE/DELETE
- **Selection engine dibangun dan dites SEBELUM frontend** — ini adalah differentiator utama
- **Direct-to-S3 presigned upload**: dokumen tidak melewati API server
- **SSE untuk real-time**: status updates applicant + VA payment confirmation

---

## Implementation Phases

---

### Phase 1: Project Scaffold + Database Foundation
**Estimasi**: 1 minggu | **Epics**: G (partial)

**Tujuan**: Setup backend dan frontend scaffold yang bisa di-deploy; semua tabel database terbuat.

#### Backend Tasks

- [ ] Init Go module (`go mod init github.com/dydanz/simdikta/backend`)
  - File: `backend/go.mod`, `backend/go.sum`
- [ ] Setup chi router + middleware skeleton
  - File: `backend/cmd/api/main.go`
  - File: `backend/internal/handler/router.go`
- [ ] Config struct dari environment variables (no global state)
  - File: `backend/internal/config/config.go`
- [ ] JSON response envelope helper
  - File: `backend/internal/pkg/response/json.go`
  - Shape: `{ "data": ..., "error": null, "meta": { "page": 1, "total": 100 } }`
- [ ] Health check endpoint (`GET /healthz`, `GET /readyz`)
  - File: `backend/internal/handler/health.go`
- [ ] Database migrations — SEMUA tabel sekaligus (lihat DDL di TDD §3.2):
  - File: `backend/migrations/000001_create_schools.up.sql`
  - File: `backend/migrations/000002_create_ppdb_periods.up.sql`
  - File: `backend/migrations/000003_create_ppdb_tracks.up.sql`
  - File: `backend/migrations/000004_create_ppdb_document_requirements.up.sql`
  - File: `backend/migrations/000005_create_ppdb_applicants.up.sql`
  - File: `backend/migrations/000006_create_ppdb_documents.up.sql`
  - File: `backend/migrations/000007_create_ppdb_verification_locks.up.sql`
  - File: `backend/migrations/000008_create_ppdb_selection_results.up.sql`
  - File: `backend/migrations/000009_create_ppdb_tka_imports.up.sql`
  - File: `backend/migrations/000010_create_ppdb_announcements.up.sql`
  - File: `backend/migrations/000011_create_ppdb_enrollments.up.sql`
  - File: `backend/migrations/000012_create_ppdb_payment_orders.up.sql`
  - File: `backend/migrations/000013_create_ppdb_audit_logs.up.sql`
  - File: `backend/migrations/000014_create_ppdb_otp_requests.up.sql`
  - File: `backend/migrations/000015_create_ppdb_dapodik_exports.up.sql`
- [ ] AES-256-GCM encrypt/decrypt untuk NIK/KK
  - File: `backend/internal/pkg/crypto/aes.go`
  - Functions: `Encrypt(key []byte, plaintext string) (string, error)`, `Decrypt(...)`
  - Tests: round-trip, tamper detection
- [ ] NIK masking utility
  - File: `backend/internal/pkg/masking/nik.go`
  - Function: `MaskNIK(nik string) string` → `"xxxxxx****0001"`
  - Tests: 16-digit, 15-digit edge case, empty string
- [ ] Makefile dengan target: `dev`, `test`, `test-race`, `lint`, `migrate`, `build`
  - File: `Makefile`
- [ ] Docker Compose untuk local dev
  - File: `docker-compose.yml`
  - Services: `backend`, `frontend`, `postgres`, `redis`, `minio`, `mailhog`
- [ ] `.env.example` dengan semua required variables
  - File: `.env.example`

#### Frontend Tasks

- [ ] Init Next.js 15 App Router dengan TypeScript
  - File: `frontend/package.json`, `frontend/tsconfig.json`
  - Libraries: tanstack-query, zustand, react-hook-form, zod
- [ ] Root layout + providers (QueryClientProvider, etc.)
  - File: `frontend/app/layout.tsx`
- [ ] Typed API client (fetch wrapper dengan auth header + base URL)
  - File: `frontend/lib/api/client.ts`
- [ ] React Query key factory
  - File: `frontend/lib/query/keys.ts`
- [ ] Auth store (Zustand)
  - File: `frontend/lib/stores/authStore.ts`
- [ ] Edge middleware untuk route protection
  - File: `frontend/middleware.ts`
  - Logic: reads `ppdb_token` + `ppdb_role` cookie; redirects unauthenticated requests

**Success Criteria (Automated)**:
```bash
make test          # Go unit tests pass (crypto, masking)
make build         # Go binary builds without error
make migrate       # All 15 migrations apply cleanly
npm run build      # Next.js builds without type errors
docker-compose up  # All services start healthy
```

**Success Criteria (Manual)**:
- `GET http://localhost:8080/healthz` → `{"status":"ok"}`
- `GET http://localhost:3000` → Next.js renders (tidak error)
- `psql` → semua 15 tabel PPDB ada

---

### Phase 2: Auth + PPDB Period Configuration (Epic G)
**Estimasi**: 1.5 minggu

**Tujuan**: Admin sekolah bisa setup periode PPDB (wizard 5-langkah) dan mengaktifkannya.

#### Backend Tasks

- [ ] Domain entities: `Period`, `Track`, `DocumentRequirement`
  - File: `backend/internal/domain/ppdb/entity.go`
- [ ] Repository interfaces
  - File: `backend/internal/domain/ppdb/repository.go`
- [ ] PostgreSQL repository implementations
  - File: `backend/internal/repository/postgres/config_repo.go`
  - Methods: `CreatePeriod`, `UpdatePeriod`, `GetActivePeriod`, `CreateTrack`, `UpdateTrack`, `CreateDocumentRequirement`
- [ ] Config service (wizard validation logic)
  - File: `backend/internal/service/config_service.go`
  - Key logic: `ValidateAndActivate` — cek kuota sum ≤ total_quota, domisili ≥ 30% untuk negeri, jadwal valid
- [ ] Config handler (Epic G API endpoints)
  - File: `backend/internal/handler/ppdb/config.go`
  - Routes: `POST /admin/periods`, `PUT /admin/periods/{id}`, `POST /admin/periods/{id}/tracks`, `POST /admin/periods/{id}/activate`, `POST /admin/periods/{id}/copy`
- [ ] Tenant resolver middleware
  - File: `backend/internal/handler/middleware/tenant.go`
  - Logic: extract `school_slug` dari path → lookup `school_id` → inject ke `context.Context`
- [ ] JWT middleware (validate RS256 token, inject claims)
  - File: `backend/internal/handler/middleware/auth.go`
- [ ] Audit log repository (INSERT-only, no UPDATE/DELETE)
  - File: `backend/internal/repository/postgres/audit_repo.go`
  - Rule: hanya `INSERT`, tidak ada method `Update` atau `Delete`

#### Frontend Tasks

- [ ] School-scoped layout: loads school config, renders `SchoolSlugProvider`
  - File: `frontend/app/ppdb/[schoolSlug]/layout.tsx`
- [ ] `SchoolSlugProvider` context (eliminates prop drilling)
  - File: `frontend/components/ppdb/SchoolSlugProvider.tsx`
- [ ] Operator login page (email + password)
  - File: `frontend/app/ppdb/[schoolSlug]/(operator)/masuk/page.tsx`
- [ ] Setup wizard shell (`'use client'`, 5 steps)
  - File: `frontend/app/ppdb/[schoolSlug]/(operator)/setup/page.tsx`
  - File: `frontend/components/ppdb/operator/SetupWizard.tsx`
- [ ] `setupStore` (Zustand: wizard step + field state)
  - File: `frontend/lib/stores/setupStore.ts`
- [ ] Setup steps:
  - File: `frontend/components/ppdb/operator/setup-steps/StepInfoUmum.tsx`
  - File: `frontend/components/ppdb/operator/setup-steps/StepPeriode.tsx` (date range pickers + overlap guard)
  - File: `frontend/components/ppdb/operator/setup-steps/StepJalurKuota.tsx` (track table + regulation warnings)
  - File: `frontend/components/ppdb/operator/setup-steps/StepDokumen.tsx` (per-track doc checklist builder)
  - File: `frontend/components/ppdb/operator/setup-steps/StepPreviewAktivasi.tsx` (validation gate + activate CTA)
- [ ] Negeri vs Swasta conditional logic di `StepJalurKuota`:
  - Hide "Tambah Jalur Kustom" untuk `negeri`
  - Warning jika domisili < 30% dari total quota (`negeri`)
  - Hide pembayaran dan multi-gelombang untuk `negeri`
- [ ] `Stepper` UI component (reusable, N steps)
  - File: `frontend/components/ui/Stepper.tsx`

**Success Criteria (Automated)**:
```bash
go test ./internal/service/... -run TestConfigService  # ValidateAndActivate edge cases
go test ./internal/repository/... -run TestAuditRepo   # INSERT-only constraint
npm run build
```

**Success Criteria (Manual)**:
- Admin bisa buat periode PPDB baru via API
- `POST /activate` dengan kuota domisili < 30% (negeri) → response 422 dengan error detail
- `POST /activate` dengan config valid → periode status berubah ke `active`
- Frontend: setup wizard 5-langkah bisa diisi dan disimpan
- Warning kuota muncul di UI saat konfigurasi tidak valid

---

### Phase 3: Selection Engine (Core Differentiator)
**Estimasi**: 1.5 minggu | **Epics**: C (partial) — **RISKIEST, DO FIRST**

**Tujuan**: Engine seleksi yang akurat, ter-test exhaustif, dan bisa run simulation sebelum finalisasi.

#### Backend Tasks

- [ ] Selection domain entities
  - File: `backend/internal/domain/selection/entity.go`
  - Structs: `ScoreCard`, `SelectionResult`, `TrackConfig`, `Engine` interface
- [ ] Haversine distance calculator (pure math, zero external dependency)
  - File: `backend/internal/adapter/maps/haversine.go`
  - Function: `Haversine(lat1, lng1, lat2, lng2 float64) float64`
  - Tests: Jakarta → Bogor ≈ 60km, same point = 0, antipodal points
- [ ] Domisili engine implementation
  - File: `backend/internal/adapter/selection/domisili_engine.go`
  - Logic: sort by `distance_km ASC`, tiebreak: older birth date = higher priority (Permendikdasmen No. 3/2025)
  - Tests: table-driven — various distance combinations, exact tie scenarios
- [ ] Afirmasi engine
  - File: `backend/internal/adapter/selection/afirmasi_engine.go`
  - Logic: semua pendaftar terverifikasi dokumen KIP/KKS/DTKS → accepted (up to quota), sisanya waitlist
- [ ] Prestasi engine
  - File: `backend/internal/adapter/selection/prestasi_engine.go`
  - Formula: `(rapor_weight × rapor_avg) + (tka_weight × tka_score) + piagam_points`
  - `rapor_avg` = rata-rata array `grade_semesters`
  - Tests: formula accuracy, tiebreak, empty TKA score handling
- [ ] Mutasi engine
  - File: `backend/internal/adapter/selection/mutasi_engine.go`
  - Logic: FIFO by submission time, up to quota
- [ ] Engine factory/registry
  - File: `backend/internal/adapter/selection/factory.go`
  - Pattern: `NewEngine(trackType TrackType) (Engine, error)`
- [ ] TKA CSV import service
  - File: `backend/internal/service/selection_service.go` (TKA import method)
  - Logic: parse CSV (NISN, nama, nilai), match ke `ppdb_applicants` by NISN, update `tka_score`, collect unmatched NISNs
- [ ] Selection repository
  - File: `backend/internal/repository/postgres/selection_repo.go`
  - Methods: `GetApplicantsForSelection`, `SaveResults`, `GetResults`
- [ ] Selection handler
  - File: `backend/internal/handler/ppdb/selection.go`
  - Routes: `POST /tka-import`, `GET /tka-import/{id}`, `POST /selection/simulate`, `POST /selection/finalize`, `GET /selection/results`
  - Key: `simulate` = `is_simulation=true`, tidak ubah status applicant; `finalize` = irreversible, butuh konfirmasi eksplisit
- [ ] Selection results repository
  - File: `backend/internal/repository/postgres/selection_repo.go`
  - Constraint: `finalize` harus atomic — semua status applicant terupdate dalam satu transaction

**Selection Engine Tests (exhaustif)**:
- File: `backend/internal/adapter/selection/domisili_engine_test.go`
  - Test: 100 applicants, ranking benar
  - Test: tie distance → tiebreak by age benar
  - Test: quota 30, rank 30 → accepted, rank 31 → waitlist
- File: `backend/internal/adapter/selection/prestasi_engine_test.go`
  - Test: formula calculation (rapor 85, tka 80, piagam 5, weight 60/40 → score = 85×0.6 + 80×0.4 = 83)
  - Test: tka_score = 0 (belum ada TKA) → handled gracefully
- File: `backend/internal/adapter/maps/haversine_test.go`
  - Test: SMAN 1 Jakarta ke rumah 2km → < 2.1km
  - Test: Sabang ke Merauke → ~5100km

**Success Criteria (Automated)**:
```bash
go test ./internal/adapter/selection/... -v -count=1   # All engine tests pass
go test ./internal/adapter/maps/... -v                  # Haversine accuracy
go test -race ./internal/service/... -run TestSelection # No race conditions
```

**Success Criteria (Manual)**:
- Upload CSV TKA → status processing → polling status → matched/unmatched count benar
- `POST /simulate` → ranking list muncul tanpa mengubah status pendaftar
- `POST /finalize` → status applicant berubah ke `diterima`/`tidak_diterima`

---

### Phase 4: Registration Flow (Epic A)
**Estimasi**: 2 minggu

**Tujuan**: Orang tua bisa daftar, isi formulir, upload dokumen, dan submit pendaftaran.

#### Backend Tasks

- [ ] OTP domain + Redis-backed storage
  - File: `backend/internal/service/registration_service.go` (OTP methods)
  - Logic: generate 6-digit OTP, store `otp_token` → `bcrypt(code)` di Redis (TTL 5min) + persist ke `ppdb_otp_requests`
  - Rate limit: Redis sliding window counter, 3/menit/phone
- [ ] Redis rate limiter middleware
  - File: `backend/internal/handler/middleware/ratelimit.go`
  - Key: `ratelimit:otp:{phone}`, window 60s, max 3 requests
- [ ] Registration service: full application CRUD
  - File: `backend/internal/service/registration_service.go`
  - Methods: `RequestOTP`, `VerifyOTP`, `CreateApplication`, `UpdateApplication`, `SubmitApplication`, `UploadDocument`
  - Key: `SubmitApplication` → validate all required docs uploaded → calculate distance (domisili) → set `registration_number`
- [ ] Registration number generator
  - Format: `{SCHOOL_CODE}-{YEAR}-{SEQUENCE_5_DIGITS}` e.g., `SCH-2026-00001`
  - Use PostgreSQL sequence per period
- [ ] Applicant repository
  - File: `backend/internal/repository/postgres/applicant_repo.go`
  - Pattern: EVERY query includes `WHERE school_id = $1` — enforced by type system (pass `schoolID uuid.UUID` as first param)
- [ ] Document service + presigned URL generator
  - File: `backend/internal/service/registration_service.go` (document methods)
  - Integration: AWS S3 / MinIO presigned PUT URL, 15-min expiry
  - Validation: max 2MB, allowed MIME: `image/jpeg`, `image/png`, `application/pdf`
- [ ] Registration handler
  - File: `backend/internal/handler/ppdb/registration.go`
  - Routes: semua Epic A endpoints (lihat TDD §5.1)
- [ ] SSE endpoint untuk status updates
  - File: `backend/internal/handler/ppdb/registration.go` (`streamStatus`)
  - Pattern: `text/event-stream`, write on applicant status change (via Redis pub/sub)
- [ ] WhatsApp notification adapter (OTP + status notification)
  - File: `backend/internal/adapter/whatsapp/waba_adapter.go`
  - Interface: `notification.Sender` (dari domain)
  - Fallback: jika WhatsApp gagal → SMS gateway
- [ ] SMS gateway adapter (fallback)
  - File: `backend/internal/adapter/sms/sms_adapter.go`

#### Frontend Tasks

- [ ] Public PPDB landing page (server component)
  - File: `frontend/app/ppdb/[schoolSlug]/(public)/page.tsx`
  - Content: school info, PPDB status banner, `QuotaCounters`, CTA daftar/masuk
- [ ] `QuotaCounters` component (60s auto-refresh)
  - File: `frontend/components/ppdb/public/QuotaCounters.tsx` (`'use client'`)
  - Hook: `usePublicQuota` dengan `refetchInterval: 60_000`
- [ ] Registration page: NIK + KK + OTP flow
  - File: `frontend/app/ppdb/[schoolSlug]/(pendaftar)/daftar/page.tsx`
  - File: `frontend/components/ppdb/pendaftar/RegistrationForm.tsx`
  - File: `frontend/components/ppdb/pendaftar/OtpInput.tsx` (`'use client'`, countdown timer)
- [ ] Application wizard shell
  - File: `frontend/app/ppdb/[schoolSlug]/(pendaftar)/formulir/page.tsx`
  - File: `frontend/components/ppdb/pendaftar/ApplicationWizard.tsx` (`'use client'`)
  - File: `frontend/lib/stores/wizardStore.ts` (Zustand: step + draft data)
- [ ] Wizard steps:
  - File: `frontend/components/ppdb/pendaftar/steps/StepDataSiswa.tsx`
    - Fields: nama, NIK, KK, NISN, tanggal lahir, jenis kelamin, alamat, koordinat GPS
    - NIK/KK: `MaskedText` untuk display
  - File: `frontend/components/ppdb/pendaftar/steps/StepDataOrtu.tsx`
    - Fields: nama wali, telepon, email
  - File: `frontend/components/ppdb/pendaftar/steps/StepPilihJalur.tsx`
    - Dynamic: tampilkan checklist dokumen sesuai jalur yang dipilih
  - File: `frontend/components/ppdb/pendaftar/steps/StepUploadDokumen.tsx`
    - Per-track document slots
    - Direct S3 upload via presigned URL
  - File: `frontend/components/ppdb/pendaftar/steps/StepReview.tsx` (server component)
    - Read-only summary, submit button
- [ ] Draft auto-save: debounced 2s PATCH ke API saat wizard data berubah
- [ ] Status tracker page (real-time SSE)
  - File: `frontend/app/ppdb/[schoolSlug]/(pendaftar)/status/page.tsx`
  - File: `frontend/components/ppdb/pendaftar/StatusTracker.tsx` (`'use client'`)
  - Hook: `useSSE` untuk live status updates
- [ ] `FileUpload` UI component
  - File: `frontend/components/ui/FileUpload.tsx`
  - Features: drag-drop, format/size validation (Zod), presigned S3 upload, progress bar
- [ ] `MaskedText` UI component
  - File: `frontend/components/ui/MaskedText.tsx`
  - Renders `xxxxxx****0001` dari NIK
- [ ] Zod schemas untuk form validation
  - File: `frontend/lib/zod/pendaftaran.schema.ts`
- [ ] `StatusBadge` UI component
  - File: `frontend/components/ui/StatusBadge.tsx`
  - Map `PendaftaranStatus` → warna + label Indonesia

**Success Criteria (Automated)**:
```bash
go test ./... -run TestRegistration -v
go test ./... -run TestOTP -v
go test ./... -run TestRateLimit -v
npm run build
npx playwright test tests/registration.spec.ts  # E2E: register → OTP → form → submit
```

**Success Criteria (Manual)**:
- OTP dikirim ke WhatsApp dalam < 30 detik
- Lebih dari 3 OTP request/menit → 429 Rate Limit
- Upload file > 2MB → error jelas di UI
- Draft tersimpan saat browser di-refresh (data tidak hilang)
- Submit berhasil → `registration_number` muncul di status page

---

### Phase 5: Document Verification (Epic B)
**Estimasi**: 1.5 minggu

**Tujuan**: Operator sekolah bisa memverifikasi dokumen pendaftar dengan efisien; audit trail tersedia.

#### Backend Tasks

- [ ] Verification service
  - File: `backend/internal/service/verification_service.go`
  - Methods: `GetVerificationQueue`, `AcquireLock`, `ReleaseLock`, `SubmitVerdict`, `GetAuditTrail`, `DetectAnomalies`
  - Key: `SubmitVerdict` selalu WRITE ke `ppdb_audit_logs` sebelum UPDATE status applicant (dalam transaction)
  - Key: `DetectAnomalies` → query `COUNT(*) WHERE actor_id = $1 AND created_at > now()-1h > 200` → flag `is_anomaly`
- [ ] Verification lock: optimistic concurrency
  - `AcquireLock`: `INSERT INTO ppdb_verification_locks ... ON CONFLICT DO UPDATE SET expires_at = now()+10m WHERE locked_by = $current_user` — mengembalikan 409 jika dipegang user lain
  - Background job: cleanup expired locks setiap 5 menit
- [ ] Notification queue integration: setelah verdict → enqueue WhatsApp notification
  - File: `backend/internal/adapter/queue/redis_queue.go`
- [ ] Verification handler
  - File: `backend/internal/handler/ppdb/verification.go`
  - Routes: semua Epic B endpoints (lihat TDD §5.2)

#### Frontend Tasks

- [ ] Verification queue list (server component awal + client filter)
  - File: `frontend/app/ppdb/[schoolSlug]/(operator)/verifikasi/page.tsx`
  - File: `frontend/components/ppdb/operator/VerificationQueue.tsx`
  - Features: filter status (belum/perlu perbaikan/selesai), search nama, sort waktu submit
- [ ] `DataTable` UI component (generic, reusable)
  - File: `frontend/components/ui/DataTable.tsx`
  - Features: sort per kolom, filter, pagination, generic column type `Column<T>[]`
- [ ] Side-by-side verification viewer (`'use client'`)
  - File: `frontend/app/ppdb/[schoolSlug]/(operator)/verifikasi/[pendaftaranId]/page.tsx`
  - File: `frontend/components/ppdb/operator/VerificationViewer.tsx`
  - Layout: split panel, kiri = dokumen, kanan = form data + verdict
- [ ] Document panel (PDF/image viewer)
  - File: `frontend/components/ppdb/operator/DocumentPanel.tsx`
  - Features: tab per dokumen, iframe untuk PDF, img untuk foto, signed URL (expires 1h)
- [ ] Applicant form panel (read-only data + verdict controls)
  - File: `frontend/components/ppdb/operator/ApplicantFormPanel.tsx`
  - Features: approve/reject per dokumen, catatan teks bebas, "Simpan & Lanjut" ke pendaftar berikutnya
- [ ] Concurrent edit indicator
  - File: `frontend/components/ppdb/operator/ConcurrentEditIndicator.tsx` (`'use client'`)
  - Polls `GET /verifikasi/{id}/lock` setiap 10s, tampilkan banner jika locked by other operator
- [ ] Audit trail viewer
  - File: `frontend/app/ppdb/[schoolSlug]/(operator)/audit/page.tsx`
  - File: `frontend/components/ppdb/operator/AuditTrailTable.tsx`
  - Features: filter actor, date range, entity type; tampilkan before/after state
- [ ] Operator shell layout (nav sidebar)
  - File: `frontend/app/ppdb/[schoolSlug]/(operator)/layout.tsx`

**Success Criteria (Automated)**:
```bash
go test ./internal/service/... -run TestVerificationLock -v
go test ./internal/service/... -run TestAuditLog -v
go test ./internal/repository/... -run TestAuditRepo  # Verifikasi tidak ada DELETE/UPDATE di audit
npx playwright test tests/verification.spec.ts
```

**Success Criteria (Manual)**:
- Dua operator buka applicant sama → operator kedua lihat banner "Sedang diperiksa oleh X"
- Verdict "Perlu Perbaikan" tanpa catatan → sistem menolak (catatan wajib)
- Setelah verdict → pendaftar terima notifikasi WhatsApp < 5 menit
- Audit trail menampilkan semua perubahan dengan before/after state
- Tidak bisa hapus atau edit entry audit log (test langsung di DB)

---

### Phase 6: Public Dashboard + Announcement (Epic D)
**Estimasi**: 1 minggu

**Tujuan**: Dashboard publik real-time; pengumuman hasil seleksi bisa dijadwalkan dan auto-publish.

#### Backend Tasks

- [ ] Public dashboard endpoint dengan Redis cache (60s)
  - File: `backend/internal/handler/public/dashboard.go`
  - Cache key: `ppdb:public:dashboard:{school_slug}`, TTL 60s
  - Response: quota per jalur, info periode, status pengumuman
- [ ] GeoJSON zona map endpoint
  - File: `backend/internal/handler/public/dashboard.go`
  - Simpan GeoJSON polygon per track di `ppdb_tracks.zone_geojson` (JSONB column)
- [ ] Public results endpoint (post-announcement only)
  - Response: hanya nama + nomor pendaftaran, **TANPA NIK/data sensitif**
- [ ] Announcement service
  - File: `backend/internal/service/announcement_service.go`
  - Methods: `Schedule`, `Cancel` (hanya jika > 30 menit sebelum jadwal), `Publish`
- [ ] Announcement publisher background goroutine
  - File: `backend/internal/service/announcement_service.go` (StartPublisher)
  - Pattern: poll setiap 60s → `SELECT * WHERE status='scheduled' AND scheduled_at <= now()`
  - Pada publish: update status, enqueue bulk notification jobs (batches 100/job)
- [ ] Announcement handler
  - File: `backend/internal/handler/ppdb/announcement.go`

#### Frontend Tasks

- [ ] Zonasi map (interactive, Mapbox GL)
  - File: `frontend/app/ppdb/[schoolSlug]/(public)/peta-zonasi/page.tsx`
  - File: `frontend/components/ppdb/public/ZonasiMap.tsx` (`'use client'`)
  - Features: render GeoJSON polygon, point-in-polygon check (orang tua cek apakah alamatnya masuk zona)
- [ ] Public results page (post-announcement)
  - File: `frontend/app/ppdb/[schoolSlug]/(public)/pengumuman/page.tsx`
  - File: `frontend/components/ppdb/public/AcceptedList.tsx`
- [ ] Announcement scheduler (operator)
  - File: `frontend/app/ppdb/[schoolSlug]/(operator)/pengumuman/page.tsx`
  - File: `frontend/components/ppdb/operator/AnnouncementScheduler.tsx` (`'use client'`)
  - Features: datetime picker (WIB timezone aware), preview, cancel (> 30 menit), notification queue progress
- [ ] Notification queue status component
  - File: `frontend/components/ppdb/operator/NotificationQueueStatus.tsx`
  - Shows: progress bar, estimated completion time, sent/total count (React Query 5s refetch)

**Success Criteria (Automated)**:
```bash
go test ./internal/service/... -run TestAnnouncement -v
# Test: cancel < 30min before → rejected; cancel > 30min → success
# Test: publisher poll → picks up scheduled announcements
npm run build
```

**Success Criteria (Manual)**:
- `GET /public/dashboard` tanpa auth → data quota real-time, cache 60s
- Announcement terjadwal auto-publish pada waktu yang ditentukan (test dengan waktu 2 menit ke depan)
- Zonasi map render di browser; point-in-polygon check berfungsi
- Post-pengumuman: nama siswa muncul tanpa NIK/data sensitif

---

### Phase 7: Re-enrollment + Payment (Epic E)
**Estimasi**: 2 minggu

**Tujuan**: Siswa diterima bisa daftar ulang online; sekolah swasta bisa terima pembayaran via VA/QRIS.

#### Backend Tasks

- [ ] Enrollment service
  - File: `backend/internal/service/enrollment_service.go`
  - Methods: `ConfirmEnrollment`, `AutoExpireDeadline`, `GetEnrollmentStatus`
  - Key: `AutoExpireDeadline` → background job setiap 5 menit, set `tidak_daftar_ulang` jika deadline terlewat → restore quota
- [ ] Payment domain entities + Gateway interface
  - File: `backend/internal/domain/payment/entity.go`
  - File: `backend/internal/domain/payment/gateway.go` — interface `PaymentGateway { CreateVA, CreateQRIS, HandleWebhook }`
- [ ] Midtrans adapter
  - File: `backend/internal/adapter/payment/midtrans_adapter.go`
  - Implements: `PaymentGateway` interface
  - VA banks: BCA, BNI, BRI, Mandiri, BSI
  - QRIS support
- [ ] Xendit adapter (alternatif/fallback)
  - File: `backend/internal/adapter/payment/xendit_adapter.go`
- [ ] Payment service
  - File: `backend/internal/service/payment_service.go`
  - Methods: `CreatePaymentOrder`, `HandleWebhook` (idempotent), `ConfirmManualTransfer`, `GetReport`
  - Key: webhook idempotency via `external_id UNIQUE` constraint — check status sebelum update
- [ ] Payment webhook handler (HMAC validation, no JWT)
  - File: `backend/internal/handler/ppdb/enrollment.go`
  - Validation: `X-Callback-Token` header HMAC-SHA256 signature check
- [ ] Payment report endpoint (CSV/XLSX/PDF export)
  - File: `backend/internal/handler/ppdb/enrollment.go`
  - Libraries: `encoding/csv` untuk CSV, `github.com/xuri/excelize/v2` untuk XLSX
- [ ] WhatsApp reminder untuk H-3, H-1 deadline pembayaran
  - Background job yang enqueue reminder notifications

#### Frontend Tasks

- [ ] Re-enrollment form (pre-filled dari data pendaftaran)
  - File: `frontend/app/ppdb/[schoolSlug]/(pendaftar)/daftar-ulang/page.tsx`
  - File: `frontend/components/ppdb/pendaftar/ReEnrollmentForm.tsx`
  - Features: data pendaftaran di-preload via React Query, user hanya isi data tambahan
- [ ] Re-enrollment completion page (download surat penerimaan PDF)
  - File: `frontend/app/ppdb/[schoolSlug]/(pendaftar)/daftar-ulang/selesai/page.tsx`
- [ ] Payment page dengan multi-channel tabs
  - File: `frontend/app/ppdb/[schoolSlug]/(pendaftar)/pembayaran/page.tsx`
  - File: `frontend/components/ppdb/pendaftar/PaymentPanel.tsx` (`'use client'`)
  - Tabs: Virtual Account (pilih bank), QRIS (tampilkan QR code), Transfer Manual
  - SSE untuk VA confirmation real-time
- [ ] Manual payment proof upload
  - File: `frontend/app/ppdb/[schoolSlug]/(pendaftar)/pembayaran/konfirmasi/page.tsx`
  - Reuse `FileUpload` component
- [ ] Payment reconciliation dashboard (operator)
  - File: `frontend/app/ppdb/[schoolSlug]/(operator)/pembayaran/page.tsx`
  - File: `frontend/components/ppdb/operator/PaymentReconciliation.tsx`
  - Summary cards: total tagihan, terbayar, tunggakan
  - DataTable: per-siswa dengan status + export Excel/PDF
- [ ] Manual transfer confirmation queue (operator)
  - File: `frontend/app/ppdb/[schoolSlug]/(operator)/pembayaran/konfirmasi/page.tsx`
  - Features: tampilkan bukti transfer, tombol konfirmasi/tolak dengan 1 klik

**Success Criteria (Automated)**:
```bash
go test ./internal/service/... -run TestPayment -v
# Test: webhook idempotency (duplicate webhook → status tidak berubah 2x)
# Test: auto-expire enrollment deadline
# Test: manual transfer confirm → status 'paid'
npx playwright test tests/payment.spec.ts
```

**Success Criteria (Manual)**:
- Buat VA BCA → nomor VA muncul
- Simulasi webhook pembayaran → status berubah ke `paid` dalam < 5 menit
- Deadline daftar ulang terlewat → status otomatis `tidak_daftar_ulang`, quota+1
- Laporan pembayaran dapat diexport ke Excel
- WhatsApp reminder terkirim H-3 dan H-1 deadline

---

### Phase 8: Dapodik Export (Epic F)
**Estimasi**: 1 minggu

**Tujuan**: Operator Dapodik bisa export data siswa baru dalam format Excel (.xlsx) yang langsung bisa diimport ke aplikasi Dapodik desktop, dengan field mapping yang dikonfigurasi via YAML — tidak hardcoded.

> **Riset Update (2026-03-29)**: Dapodik import adalah **file-based Excel (.xlsx) only** — tidak ada public API dari Pusdatin. Template tertanam di aplikasi Dapodik desktop. Solusi: `FieldMapping` struct dimuat dari YAML config agar perubahan template tidak memerlukan recompile.

#### Backend Tasks

- [ ] Dapodik field mapping config
  - File: `backend/config/dapodik-fields.yaml`
  - Struktur: mapping dari kolom internal Simdikta → header kolom Excel template Dapodik
  - Placeholder awal (kolom aktual dikonfirmasi dari operator sekolah dengan Dapodik aktif)
  - Contoh:
    ```yaml
    version: "2025"
    sheets:
      siswa_baru:
        columns:
          - internal: "full_name"
            excel_header: "Nama Lengkap"
            required: true
          - internal: "nik"
            excel_header: "NIK"
            required: true
            masked: false  # di export: raw value (untuk Dapodik), bukan masked
          - internal: "nisn"
            excel_header: "NISN"
            required: false  # boleh kosong — muncul di validation warning
    ```
- [ ] FieldMapping adapter
  - File: `backend/internal/adapter/dapodik/mapper.go`
  - Struct: `FieldMapping` dimuat dari YAML saat startup (bukan hardcoded)
  - Method: `MapApplicantToRow(applicant domain.Applicant) ([]interface{}, error)`
  - Loaded via `config.LoadDapodikMapping(path string) (*FieldMapping, error)`
- [ ] Dapodik export service
  - File: `backend/internal/service/dapodik_service.go`
  - Methods: `ValidateReadiness` (cek field yang belum lengkap per mapping config), `GenerateExport` (async), `GetExportStatus`
  - Format: **XLSX** (bukan CSV) — menggunakan library `github.com/xuri/excelize/v2`
  - Async: export besar (> 100 siswa) diproses sebagai background job, simpan file ke S3
  - Inject `FieldMapping` sebagai dependency (bukan global)
- [ ] Dapodik handler
  - File: `backend/internal/handler/ppdb/dapodik.go`
  - Routes: `GET /dapodik/validate`, `POST /dapodik/export`, `GET /dapodik/export/{id}`
- [ ] "Needs re-export" flag logic
  - Saat data siswa berubah setelah export → update `ppdb_dapodik_exports.has_stale_records = true`
  - Tampilkan daftar siswa yang perlu re-export

#### Frontend Tasks

- [ ] Dapodik export panel
  - File: `frontend/app/ppdb/[schoolSlug]/(operator)/dapodik/page.tsx`
  - File: `frontend/components/ppdb/operator/DapodikExportPanel.tsx`
  - Features:
    - Validation summary: N siswa siap export, daftar siswa dengan data incomplete
    - Export button → polling status job (React Query 2s refetch saat processing)
    - Download file .xlsx saat ready (triggered via signed URL)
    - DataTable: siswa dengan flag "Perlu Re-export"

**Success Criteria (Automated)**:
```bash
go test ./internal/adapter/dapodik/... -v
# Test: FieldMapping dimuat dari YAML dengan benar
# Test: MapApplicantToRow menghasilkan baris dengan kolom sesuai config
# Test: field required yang kosong → ValidationError, bukan panic

go test ./internal/service/... -run TestDapodik -v
# Test: export XLSX field mapping benar (kolom sesuai dapodik-fields.yaml)
# Test: incomplete NISN → muncul di validation list, bukan di export
# Test: re-export flag di-set saat data siswa berubah post-export
# Test: ganti dapodik-fields.yaml → output XLSX berubah tanpa recompile
```

**Success Criteria (Manual)**:
- Export 100 siswa → file XLSX dengan kolom sesuai template Dapodik
- Import file ke aplikasi Dapodik test instance → tidak ada validation error
- Siswa dengan NISN kosong muncul di daftar "perlu dilengkapi"
- Update `dapodik-fields.yaml` → restart app → export menggunakan kolom baru (no code change)

**Risks Addressed**:
- Format Dapodik tidak dikonfirmasi hardcoded → YAML config memungkinkan update tanpa recompile

---

### Phase 9: Hardening, Load Test, Monitoring
**Estimasi**: 2 minggu | **Target**: 2026-08-15

**Tujuan**: Sistem siap beban PPDB nyata; monitoring observable; 5 sekolah pilot onboarded.

#### Tasks

- [ ] Prometheus metrics instrumentation
  - File: `backend/internal/handler/middleware/metrics.go`
  - Metrics: request duration histogram (per route), OTP success rate, selection engine duration, notification queue depth
- [ ] OpenTelemetry tracing setup
  - File: `backend/internal/config/telemetry.go`
  - Trace: registration flow, selection engine, payment webhook
- [ ] slog structured logging (sudah ada stdlib, tambah context enrichment)
  - File: `backend/internal/pkg/logging/logger.go`
  - Fields: `school_id`, `applicant_id`, `request_id`, `trace_id`
- [ ] Graceful shutdown (SIGTERM → drain in-flight requests, stop queue workers)
  - File: `backend/cmd/api/main.go`
- [ ] k6 load test script
  - File: `tests/load/ppdb_load_test.js`
  - Scenarios: 500 concurrent users, 1 jam
  - Endpoints: `/public/dashboard` (80% read), `/applications/{id}` (15%), `/verify` (5%)
  - SLO: p95 < 2s, error rate < 0.1%
- [ ] Chaos test: Redis down → fallback graceful
  - File: `tests/chaos/redis_failure_test.go`
  - Verify: jika Redis down → OTP endpoint return 503 (bukan crash), API lain tetap berjalan
- [ ] Chaos test: payment webhook saat DB down → queue + retry
- [ ] Playwright E2E test suite lengkap
  - File: `tests/e2e/full_ppdb_flow.spec.ts`
  - Flow: register → form → upload → submit → verify (operator) → select → announce → re-enroll → pay
- [ ] Kubernetes manifests
  - File: `infra/k8s/backend/deployment.yaml` (3 replicas, HPA, probes)
  - File: `infra/k8s/frontend/deployment.yaml`
  - File: `infra/k8s/cronjob/announcement-publisher.yaml`
- [ ] GitHub Actions CI/CD pipeline
  - File: `.github/workflows/ci.yml` (lint → test → build → push image)
  - File: `.github/workflows/deploy-staging.yml` (auto-deploy ke staging on main push)

**Success Criteria (Automated)**:
```bash
k6 run tests/load/ppdb_load_test.js  # p95 < 2s, error < 0.1%
npx playwright test tests/e2e/       # All E2E green
go test ./... -race -count=1         # No race conditions
```

**Success Criteria (Manual)**:
- Grafana dashboard menampilkan request rate, error rate, p95 latency per endpoint
- 5 sekolah pilot berhasil setup PPDB dan terima pendaftar pertama

---

## Files to Create (Complete List)

### Backend
```
backend/
├── cmd/api/main.go
├── internal/
│   ├── config/config.go
│   ├── domain/ppdb/entity.go, repository.go, service.go, errors.go
│   ├── domain/selection/entity.go, engine.go
│   ├── domain/payment/entity.go, gateway.go, repository.go
│   ├── domain/notification/entity.go, sender.go
│   ├── domain/audit/entity.go, repository.go
│   ├── handler/router.go, health.go
│   ├── handler/ppdb/registration.go, verification.go, selection.go,
│   │             announcement.go, enrollment.go, dapodik.go, config.go
│   ├── handler/middleware/tenant.go, auth.go, ratelimit.go, metrics.go
│   ├── handler/public/dashboard.go
│   ├── service/registration_service.go, verification_service.go,
│   │         selection_service.go, announcement_service.go,
│   │         enrollment_service.go, payment_service.go,
│   │         dapodik_service.go, config_service.go
│   ├── repository/postgres/applicant_repo.go, document_repo.go,
│   │             selection_repo.go, payment_repo.go, audit_repo.go,
│   │             announcement_repo.go, config_repo.go
│   ├── adapter/whatsapp/waba_adapter.go
│   ├── adapter/sms/sms_adapter.go
│   ├── adapter/payment/midtrans_adapter.go, xendit_adapter.go
│   ├── adapter/maps/haversine.go
│   ├── adapter/selection/domisili_engine.go, afirmasi_engine.go,
│   │                     prestasi_engine.go, mutasi_engine.go, factory.go
│   ├── adapter/queue/redis_queue.go, worker.go
│   ├── adapter/dukcapil/dukcapil_adapter.go
│   ├── adapter/dapodik/mapper.go          ← FieldMapping struct, YAML-driven column mapping
│   └── pkg/crypto/aes.go, masking/nik.go, response/json.go, pagination/pagination.go
├── config/dapodik-fields.yaml            ← configurable Dapodik column mapping (no recompile)
├── migrations/ (15 files)
└── Makefile
```

### Frontend
```
frontend/
├── app/ppdb/[schoolSlug]/
│   ├── layout.tsx
│   ├── (public)/page.tsx, peta-zonasi/page.tsx, pengumuman/page.tsx
│   ├── (pendaftar)/layout.tsx, masuk/page.tsx, daftar/page.tsx,
│   │              formulir/page.tsx, formulir/[step]/page.tsx,
│   │              status/page.tsx, daftar-ulang/page.tsx,
│   │              pembayaran/page.tsx, pembayaran/konfirmasi/page.tsx
│   └── (operator)/layout.tsx, masuk/page.tsx, dasbor/page.tsx,
│                  setup/page.tsx, setup/[step]/page.tsx,
│                  verifikasi/page.tsx, verifikasi/[id]/page.tsx,
│                  audit/page.tsx, pengumuman/page.tsx,
│                  pembayaran/page.tsx, notifikasi/page.tsx, dapodik/page.tsx
├── components/ui/ (8 components)
├── components/ppdb/public/ (3 components)
├── components/ppdb/pendaftar/ (8 components)
├── components/ppdb/operator/ (10 components)
├── lib/api/client.ts, ppdb.ts, types.ts
├── lib/query/keys.ts, hooks/ (5 hooks)
├── lib/stores/wizardStore.ts, setupStore.ts, authStore.ts
├── lib/hooks/useSSE.ts, useSchoolSlug.ts
└── middleware.ts
```

### Infrastructure
```
infra/k8s/ (4 manifests)
.github/workflows/ (2 workflows)
docker-compose.yml
.env.example
tests/load/ppdb_load_test.js
tests/e2e/full_ppdb_flow.spec.ts
```

---

## Risks

| Risiko | Mitigasi |
|--------|----------|
| Selection engine bug (ranking salah) | Phase 3 dibangun dan di-test SEBELUM frontend; simulation mode wajib sebelum finalize |
| Kolom spesifik template Dapodik belum dikonfirmasi | ✅ Format confirmed: file-based XLSX. Kolom aktual dikonfirmasi dari operator sekolah aktif; `dapodik-fields.yaml` diisi dengan placeholder — update tanpa recompile |
| Payment gateway sandbox tidak coverage BSI | Test Xendit sebagai alternatif jika Midtrans tidak support BSI |
| Performa SSE saat 500 concurrent connections | Load test early; jika SSE tidak cukup → polling fallback dengan `refetchInterval: 5000` |
| WhatsApp API rate limit saat bulk pengumuman | Queue + batch 100/job + exponential backoff; SMS fallback |

---

## Dependencies yang Harus Dikonfirmasi Sebelum Phase 7

- [ ] Kontrak payment gateway (Midtrans atau Xendit) — due 2026-04-10
- [ ] WhatsApp Business API access (Meta atau BSP) — due 2026-04-10
- [x] ~~Format template Dapodik terbaru dari Pusdatin~~ → ✅ Resolved (2026-03-29): file-based XLSX, configurable via `dapodik-fields.yaml`; kolom aktual dari operator sekolah aktif
- [ ] Mapbox token (atau keputusan: Leaflet + OSM gratis) — due 2026-04-15
- [ ] AWS account + S3 bucket di ap-southeast-3 (Jakarta) — due 2026-04-20
