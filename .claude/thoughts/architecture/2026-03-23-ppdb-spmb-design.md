Status: ✅ Up-to-date
Version: v1.0.0
Last Updated: 2026-03-23
Depends On: PRD v1.0.0 — 2026-03-23-ppdb-spmb-prd.md

---

# Technical Design Document: Modul PPDB/SPMB — Simdikta

**Status**: Draft
**Author**: Tech Lead
**PRD Reference**: `.claude/thoughts/product/2026-03-23-ppdb-spmb-prd.md`
**Dibuat**: 2026-03-23
**Terakhir Diperbarui**: 2026-03-23

---

## 1. Architecture Overview

### 1.1 System Context

```
                ┌─────────────────────────────────────────────────────────┐
                │                     INTERNET                            │
                └───────────────┬───────────────────────┬─────────────────┘
                                │                       │
               ┌────────────────▼───────┐    ┌──────────▼───────────────┐
               │   Next.js 15 Frontend  │    │  External Services       │
               │   (App Router, SSR)    │    │  - WhatsApp Business API │
               │   Vercel / EKS         │    │  - SMS Gateway           │
               └────────────────┬───────┘    │  - Midtrans / Xendit     │
                                │ REST API   │  - Mapbox                │
               ┌────────────────▼───────┐    │  - Dukcapil (v2)         │
               │   Go API Server        │────┘  - Object Storage (S3)   │
               │   chi router           │    └──────────────────────────┘
               │   Clean Architecture   │
               └────┬──────────┬────────┘
                    │          │
         ┌──────────▼──┐  ┌───▼───────┐
         │ PostgreSQL  │  │  Redis    │
         │ (primary DB)│  │ (OTP,     │
         │             │  │  cache,   │
         │             │  │  queue)   │
         └─────────────┘  └───────────┘
```

### 1.2 Architecture Decision: Modular Monolith (Recommended)

**Decision**: Modular monolith — single Go binary with strict package boundaries, deployed as one service.

**Rationale**:
- V1 scope (50 sekolah, ~10K siswa/tahun) tidak memerlukan horizontal scale per domain
- Satu deployment → debugging lebih cepat, latency antar modul nol
- Batas paket (`internal/domain/`) memberikan isolasi yang cukup untuk ekstraksi microservice di masa depan

---

## 2. Alternative Approaches Considered

### Option A: Modular Monolith ✅ RECOMMENDED
- Single Go binary, strict package boundaries
- PostgreSQL + Redis
- Pros: Simple ops, fast iteration, no distributed system complexity
- Cons: Scaling harus horizontal (scale-out semua module sekaligus)

### Option B: Microservices dari Awal
- Separate services: `auth-svc`, `ppdb-core-svc`, `payment-svc`, `notification-svc`
- Pros: Independent scaling, fault isolation
- Cons: **Premature** — 4-6x complexity increase, distributed tracing mandatory, need service mesh. Wrong tradeoff at this scale
- **REJECTED**: Kematangan tim dan volume pengguna belum membutuhkan ini

### Option C: Next.js Full-Stack + Supabase
- Serverless functions + Supabase (PostgreSQL + Auth + Realtime)
- Pros: Fastest time-to-market
- Cons: Kehilangan investasi Go, vendor lock-in Supabase, row-level security tidak cukup untuk multi-tenant kompleks, real-time selection engine sulit
- **REJECTED**: Tidak cocok dengan Go investment dan kebutuhan selection engine custom

**Riskiest assumption addressed first**: Selection engine dengan Haversine + formula TKA harus diimplementasi dan ditest sebelum UI. Ini adalah feature differentiator utama yang paling tidak pernah dibangun sebelumnya di tim.

---

## 3. Data Model

### 3.1 Multi-Tenancy Design

Setiap tabel PPDB menggunakan `school_id` (foreign key ke tabel `schools`) untuk isolasi data per sekolah. Repository layer **always** memfilter `WHERE school_id = $1` — tidak ada query cross-tenant.

```
schools (existing)
  └── ppdb_periods (1 sekolah → banyak period/tahun ajaran)
       ├── ppdb_tracks (1 period → banyak jalur)
       │    └── ppdb_document_requirements (persyaratan dokumen per jalur)
       ├── ppdb_applicants (pendaftar per period per sekolah)
       │    ├── ppdb_documents (dokumen yang diupload)
       │    ├── ppdb_selection_results (hasil seleksi)
       │    └── ppdb_enrollments (daftar ulang)
       │         └── ppdb_payment_orders (pembayaran)
       └── ppdb_announcements (pengumuman terjadwal)
```

### 3.2 Key Tables (DDL Simplified)

```sql
-- Konfigurasi periode PPDB per sekolah
CREATE TABLE ppdb_periods (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    school_id       UUID NOT NULL REFERENCES schools(id),
    academic_year   VARCHAR(10) NOT NULL,           -- '2026/2027'
    name            VARCHAR(100) NOT NULL,
    mode            VARCHAR(20) NOT NULL,            -- 'negeri' | 'swasta'
    level           VARCHAR(10) NOT NULL,            -- 'SD','SMP','SMA','SMK'
    total_quota     INTEGER NOT NULL,
    reg_open_at     TIMESTAMPTZ NOT NULL,
    reg_close_at    TIMESTAMPTZ NOT NULL,
    announcement_at TIMESTAMPTZ,
    re_enroll_deadline TIMESTAMPTZ,
    status          VARCHAR(20) NOT NULL DEFAULT 'draft',
    is_public_dashboard BOOLEAN DEFAULT FALSE,
    created_at      TIMESTAMPTZ DEFAULT now(),
    updated_at      TIMESTAMPTZ DEFAULT now(),
    UNIQUE(school_id, academic_year)
);

-- Jalur seleksi (domisili, afirmasi, prestasi, mutasi, kustom)
CREATE TABLE ppdb_tracks (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    period_id       UUID NOT NULL REFERENCES ppdb_periods(id),
    school_id       UUID NOT NULL,                  -- denormalized for query perf
    track_type      VARCHAR(20) NOT NULL,            -- 'domisili'|'afirmasi'|'prestasi'|'mutasi'|'kustom'
    name            VARCHAR(100) NOT NULL,
    quota           INTEGER NOT NULL,
    -- Domisili: jarak GPS
    max_distance_km DECIMAL(8,3),
    -- Prestasi: bobot formula
    rapor_weight    DECIMAL(5,2) DEFAULT 0.60,
    tka_weight      DECIMAL(5,2) DEFAULT 0.40,
    piagam_points   DECIMAL(5,2) DEFAULT 0,
    -- Kustom
    custom_criteria JSONB,
    display_order   INTEGER DEFAULT 0
);

-- Pendaftar (terenkripsi: nik, kk_number)
CREATE TABLE ppdb_applicants (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    school_id           UUID NOT NULL,
    period_id           UUID NOT NULL REFERENCES ppdb_periods(id),
    track_id            UUID NOT NULL REFERENCES ppdb_tracks(id),
    account_id          UUID NOT NULL,              -- link ke user account
    registration_number VARCHAR(30) UNIQUE,         -- 'SCH-2026-00001'
    -- Data Siswa (NIK+KK disimpan AES-256-GCM, tersimpan sebagai base64)
    full_name           VARCHAR(200) NOT NULL,
    nik_encrypted       TEXT NOT NULL,
    kk_number_encrypted TEXT NOT NULL,
    nisn                VARCHAR(20),
    birth_date          DATE NOT NULL,
    birth_place         VARCHAR(100),
    gender              CHAR(1) NOT NULL,
    address             TEXT,
    city                VARCHAR(100),
    province            VARCHAR(100),
    home_lat            DECIMAL(10,7),
    home_lng            DECIMAL(10,7),
    distance_km         DECIMAL(8,3),               -- dihitung saat submit, jalur domisili
    -- Data Orang Tua/Wali
    guardian_name       VARCHAR(200),
    guardian_phone      VARCHAR(20),
    guardian_email      VARCHAR(200),
    -- Nilai (untuk jalur prestasi)
    prev_school_name    VARCHAR(200),
    prev_school_npsn    VARCHAR(20),
    grade_semesters     DECIMAL(5,2)[],             -- nilai rapor 5 semester
    tka_score           DECIMAL(6,2),               -- diisi dari import TKA
    -- Status
    status              VARCHAR(30) NOT NULL DEFAULT 'draft',
    submitted_at        TIMESTAMPTZ,
    rejection_notes     TEXT,
    created_at          TIMESTAMPTZ DEFAULT now(),
    updated_at          TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX idx_ppdb_applicants_school_status ON ppdb_applicants(school_id, status);
CREATE INDEX idx_ppdb_applicants_period_track ON ppdb_applicants(period_id, track_id);

-- Dokumen yang diupload
CREATE TABLE ppdb_documents (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    school_id       UUID NOT NULL,
    applicant_id    UUID NOT NULL REFERENCES ppdb_applicants(id),
    requirement_id  UUID REFERENCES ppdb_document_requirements(id),
    doc_type        VARCHAR(50) NOT NULL,            -- 'kk', 'akte', 'raport', 'kip'
    file_name       VARCHAR(255),
    storage_path    TEXT NOT NULL,                  -- path di object storage
    file_size_bytes INTEGER,
    mime_type       VARCHAR(50),
    status          VARCHAR(20) DEFAULT 'pending',  -- 'pending'|'approved'|'rejected'
    rejection_note  TEXT,
    uploaded_at     TIMESTAMPTZ DEFAULT now(),
    reviewed_at     TIMESTAMPTZ,
    reviewed_by     UUID                            -- operator user_id
);

-- Lock verifikasi (optimistic, TTL 10 menit)
CREATE TABLE ppdb_verification_locks (
    applicant_id    UUID PRIMARY KEY REFERENCES ppdb_applicants(id),
    locked_by       UUID NOT NULL,
    locked_by_name  VARCHAR(200),
    expires_at      TIMESTAMPTZ NOT NULL
);

-- Hasil seleksi
CREATE TABLE ppdb_selection_results (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    school_id       UUID NOT NULL,
    period_id       UUID NOT NULL,
    track_id        UUID NOT NULL,
    applicant_id    UUID NOT NULL REFERENCES ppdb_applicants(id),
    rank            INTEGER,
    total_score     DECIMAL(8,4),
    score_breakdown JSONB,                          -- { rapor: 87.2, tka: 85.0, piagam: 5.0, distance_km: 1.23 }
    is_accepted     BOOLEAN,
    is_waitlisted   BOOLEAN DEFAULT FALSE,
    is_simulation   BOOLEAN DEFAULT FALSE,
    run_id          UUID NOT NULL,
    created_at      TIMESTAMPTZ DEFAULT now()
);

-- Import nilai TKA (CSV dari Kemendikdasmen)
CREATE TABLE ppdb_tka_imports (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    school_id       UUID NOT NULL,
    period_id       UUID NOT NULL,
    filename        VARCHAR(255),
    status          VARCHAR(20) DEFAULT 'processing',
    total_rows      INTEGER,
    matched_count   INTEGER,
    unmatched_nisn  TEXT[],                         -- NISN yang tidak cocok
    imported_by     UUID NOT NULL,
    imported_at     TIMESTAMPTZ DEFAULT now()
);

-- Pengumuman (terjadwal)
CREATE TABLE ppdb_announcements (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    school_id       UUID NOT NULL,
    period_id       UUID NOT NULL,
    type            VARCHAR(30) NOT NULL,            -- 'result', 'reminder', 'info'
    title           VARCHAR(255) NOT NULL,
    content         TEXT,
    scheduled_at    TIMESTAMPTZ NOT NULL,
    published_at    TIMESTAMPTZ,
    cancelled_at    TIMESTAMPTZ,
    status          VARCHAR(20) DEFAULT 'scheduled',
    notification_queue_size INTEGER,
    notification_sent_count INTEGER DEFAULT 0
);

-- Daftar ulang
CREATE TABLE ppdb_enrollments (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    school_id       UUID NOT NULL,
    applicant_id    UUID UNIQUE NOT NULL REFERENCES ppdb_applicants(id),
    status          VARCHAR(20) DEFAULT 'pending',  -- 'pending'|'confirmed'|'not_re_enrolled'|'officially_enrolled'
    confirmed_at    TIMESTAMPTZ,
    deadline        TIMESTAMPTZ NOT NULL,
    additional_data JSONB
);

-- Pembayaran
CREATE TABLE ppdb_payment_orders (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    school_id       UUID NOT NULL,
    enrollment_id   UUID NOT NULL REFERENCES ppdb_enrollments(id),
    external_id     VARCHAR(100) UNIQUE,            -- gateway transaction ID
    amount          BIGINT NOT NULL,                -- in IDR cents
    components      JSONB,                          -- [{ label, amount }]
    method          VARCHAR(30),                    -- 'va_bca'|'qris'|'manual'
    status          VARCHAR(20) DEFAULT 'unpaid',
    va_number       VARCHAR(30),
    va_bank         VARCHAR(20),
    qr_code_url     TEXT,
    proof_url       TEXT,                           -- manual transfer proof
    paid_at         TIMESTAMPTZ,
    expired_at      TIMESTAMPTZ,
    gateway_response JSONB,
    created_at      TIMESTAMPTZ DEFAULT now()
);

-- Audit log IMMUTABLE (no UPDATE, no DELETE ever)
CREATE TABLE ppdb_audit_logs (
    id              BIGSERIAL PRIMARY KEY,
    school_id       UUID NOT NULL,
    actor_id        UUID,
    actor_name      VARCHAR(200),
    actor_role      VARCHAR(50),
    action          VARCHAR(100) NOT NULL,
    entity_type     VARCHAR(50) NOT NULL,
    entity_id       UUID,
    before_state    JSONB,
    after_state     JSONB,
    ip_address      INET,
    user_agent      TEXT,
    is_anomaly      BOOLEAN DEFAULT FALSE,
    created_at      TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX idx_ppdb_audit_school_actor ON ppdb_audit_logs(school_id, actor_id);
CREATE INDEX idx_ppdb_audit_school_entity ON ppdb_audit_logs(school_id, entity_type, entity_id);

-- OTP requests (juga di Redis, tapi di-persist untuk abuse tracking)
CREATE TABLE ppdb_otp_requests (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    school_id   UUID NOT NULL,
    phone       VARCHAR(20) NOT NULL,
    otp_token   VARCHAR(64) UNIQUE NOT NULL,
    code_hash   TEXT NOT NULL,                      -- bcrypt hash of OTP code
    expires_at  TIMESTAMPTZ NOT NULL,
    verified_at TIMESTAMPTZ,
    created_at  TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX idx_ppdb_otp_phone_created ON ppdb_otp_requests(phone, created_at);
```

---

## 4. Backend Design

### 4.1 Package Structure

```
backend/
├── cmd/api/main.go                  # Wire + start server
├── internal/
│   ├── domain/                      # Pure domain — zero external imports
│   │   ├── ppdb/
│   │   │   ├── entity.go            # Core structs
│   │   │   ├── repository.go        # Repository interfaces
│   │   │   ├── service.go           # Service interfaces
│   │   │   └── errors.go            # Domain errors
│   │   ├── selection/
│   │   │   ├── entity.go            # SelectionResult, ScoreCard
│   │   │   └── engine.go            # SelectionEngine interface
│   │   ├── payment/
│   │   │   ├── entity.go            # PaymentOrder, Gateway interface
│   │   │   └── repository.go
│   │   ├── notification/
│   │   │   └── entity.go            # NotificationJob, Sender interface
│   │   └── audit/
│   │       └── entity.go            # AuditLog (write-only repo)
│   ├── handler/
│   │   ├── ppdb/
│   │   │   ├── registration.go      # Epic A
│   │   │   ├── verification.go      # Epic B
│   │   │   ├── selection.go         # Epic C
│   │   │   ├── announcement.go      # Epic D
│   │   │   ├── enrollment.go        # Epic E
│   │   │   ├── dapodik.go           # Epic F
│   │   │   └── config.go            # Epic G
│   │   ├── middleware/
│   │   │   ├── tenant.go            # school_id dari path → ctx
│   │   │   ├── auth.go              # JWT → claims → ctx
│   │   │   ├── ratelimit.go         # Redis sliding window OTP
│   │   │   └── metrics.go           # Prometheus histogram
│   │   └── public/
│   │       └── dashboard.go         # No-auth public endpoints
│   ├── service/
│   │   ├── registration_service.go  # OTP, akun, form submit
│   │   ├── verification_service.go  # Review dokumen, lock, audit
│   │   ├── selection_service.go     # Engine orchestration, TKA import
│   │   ├── announcement_service.go  # Jadwal, cancel, publish
│   │   ├── enrollment_service.go    # Daftar ulang, auto-expire
│   │   ├── payment_service.go       # VA, QRIS, webhook
│   │   ├── dapodik_service.go       # Export generator
│   │   └── config_service.go        # Setup wizard, validasi
│   ├── repository/postgres/         # Implementasi pgx
│   ├── adapter/
│   │   ├── whatsapp/                # WhatsApp Business API
│   │   ├── sms/                     # SMS gateway fallback
│   │   ├── payment/                 # Midtrans + Xendit adapter
│   │   ├── maps/haversine.go        # Pure math, no external API
│   │   ├── dukcapil/                # Graceful fallback jika down
│   │   └── queue/                   # Redis List (RPUSH/BLPOP)
│   ├── config/config.go             # Env-based, no global state
│   └── pkg/
│       ├── crypto/aes.go            # AES-256-GCM encrypt/decrypt
│       ├── masking/nik.go           # NIK display masking
│       ├── pagination/              # Cursor-based pagination
│       └── response/json.go         # Standard JSON envelope
├── migrations/                      # golang-migrate SQL files
└── pkg/jwtutil/                     # JWT claim shapes (exported)
```

**Dependency rule** (strict):
- `domain` → imports nothing internal
- `repository` → imports `domain` entities
- `service` → imports `domain` interfaces only (not concrete `repository`)
- `handler` → imports `domain` interfaces only (not concrete `service`)
- `adapter` → implements `domain` interfaces

### 4.2 Key Domain Types (Go)

```go
// internal/domain/ppdb/entity.go

type ApplicantStatus string
const (
    StatusDraft             ApplicantStatus = "draft"
    StatusSubmitted         ApplicantStatus = "submitted"
    StatusMenungguVerifikasi ApplicantStatus = "menunggu_verifikasi"
    StatusPerluPerbaikan    ApplicantStatus = "perlu_perbaikan"
    StatusTerverifikasi     ApplicantStatus = "terverifikasi"
    StatusDalamSeleksi      ApplicantStatus = "dalam_seleksi"
    StatusDiterima          ApplicantStatus = "diterima"
    StatusTidakDiterima     ApplicantStatus = "tidak_diterima"
    StatusDaftarUlang       ApplicantStatus = "daftar_ulang"
    StatusTerdaftarResmi    ApplicantStatus = "terdaftar_resmi"
)

type TrackType string
const (
    TrackDomisili  TrackType = "domisili"
    TrackAfirmasi  TrackType = "afirmasi"
    TrackPrestasi  TrackType = "prestasi"
    TrackMutasi    TrackType = "mutasi"
    TrackKustom    TrackType = "kustom"
)

type Applicant struct {
    ID                 uuid.UUID
    SchoolID           uuid.UUID
    PeriodID           uuid.UUID
    TrackID            uuid.UUID
    RegistrationNumber string
    FullName           string
    NIK                string      // decrypted in memory only
    KKNumber           string      // decrypted in memory only
    NISN               string
    BirthDate          time.Time
    Gender             string
    HomeLat, HomeLng   float64
    DistanceKM         float64     // calculated at submit
    GradeSemesters     []float64
    TKAScore           float64
    Status             ApplicantStatus
    Documents          []Document
    CreatedAt          time.Time
    UpdatedAt          time.Time
}

// internal/domain/selection/engine.go
type Engine interface {
    Calculate(ctx context.Context, track TrackConfig, applicants []Applicant) ([]SelectionResult, error)
}

type ScoreCard struct {
    ApplicantID uuid.UUID
    DistanceKM  float64
    RaporAvg    float64
    TKAScore    float64
    PiagamPts   float64
    TotalScore  float64
    Rank        int
}
```

### 4.3 Selection Engine Logic

```go
// internal/service/selection_service.go (simplified)

// Jalur Domisili: sort by distance ASC, tiebreak by age DESC
func (e *DomisiEngine) Calculate(ctx context.Context, cfg TrackConfig, applicants []Applicant) ([]SelectionResult, error) {
    sort.SliceStable(applicants, func(i, j int) bool {
        if math.Abs(applicants[i].DistanceKM-applicants[j].DistanceKM) < 0.001 {
            // tiebreak: lebih tua = prioritas lebih tinggi (Permendikdasmen No. 3/2025)
            return applicants[i].BirthDate.Before(applicants[j].BirthDate)
        }
        return applicants[i].DistanceKM < applicants[j].DistanceKM
    })
    // assign rank, is_accepted (rank <= quota), is_waitlisted (rank <= quota*1.2)
}

// Jalur Prestasi: weighted score formula
func (e *PrestasiEngine) Calculate(ctx context.Context, cfg TrackConfig, applicants []Applicant) ([]SelectionResult, error) {
    for _, a := range applicants {
        raporAvg := average(a.GradeSemesters)
        score := (cfg.RaporWeight * raporAvg) +
                 (cfg.TKAWeight * a.TKAScore) +
                 cfg.PiagamPoints
        // ...
    }
    sort.SliceStable(results, func(i, j int) bool {
        return results[i].TotalScore > results[j].TotalScore
    })
}

// Haversine distance (pure math, no external API)
// internal/adapter/maps/haversine.go
func Haversine(lat1, lng1, lat2, lng2 float64) float64 {
    const R = 6371.0 // km
    dLat := (lat2 - lat1) * math.Pi / 180
    dLng := (lng2 - lng1) * math.Pi / 180
    a := math.Sin(dLat/2)*math.Sin(dLat/2) +
         math.Cos(lat1*math.Pi/180)*math.Cos(lat2*math.Pi/180)*
         math.Sin(dLng/2)*math.Sin(dLng/2)
    return R * 2 * math.Atan2(math.Sqrt(a), math.Sqrt(1-a))
}
```

### 4.4 Queue Design

```
Redis List "queue:notifications"
RPUSH → job JSON → BLPOP (blocking pop, 5s timeout)
                          ↓
                  Worker Pool (N goroutines)
                          ↓
              WhatsApp API / SMS Gateway
```

```go
// internal/adapter/queue/worker.go
type Worker struct {
    redis    *redis.Client
    sender   notification.Sender
    poolSize int
}

func (w *Worker) Start(ctx context.Context) {
    for i := 0; i < w.poolSize; i++ {
        go w.run(ctx, "queue:notifications")
    }
}

func (w *Worker) run(ctx context.Context, queue string) {
    for {
        select {
        case <-ctx.Done():
            return
        default:
            result, _ := w.redis.BLPop(ctx, 5*time.Second, queue).Result()
            if len(result) < 2 { continue }
            var job notification.Job
            json.Unmarshal([]byte(result[1]), &job)
            w.sender.Send(ctx, job)  // WhatsApp or SMS with fallback
        }
    }
}
```

### 4.5 AES-256 Encryption (NIK/KK)

```go
// internal/pkg/crypto/aes.go
// Encrypt: returns base64(nonce || ciphertext)
func Encrypt(key []byte, plaintext string) (string, error)
// Decrypt: base64 decode → split nonce → GCM Open
func Decrypt(key []byte, ciphertext string) (string, error)

// NIK masking per UU PDP No. 27/2022
// internal/pkg/masking/nik.go
func MaskNIK(nik string) string {
    // "3201234567890001" → "xxxxxx****0001"
    if len(nik) < 16 { return nik }
    return "xxxxxx****" + nik[12:]
}
```

### 4.6 Verification Lock (Optimistic Concurrency)

```
GET /operator/applications/{id}
  → INSERT ppdb_verification_locks ON CONFLICT UPDATE SET expires_at = now()+10m
  → IF locked by different operator: return 409 with lock_held_by

POST /operator/applications/{id}/verify
  → Check lock still held by current operator
  → INSERT audit_log (IMMUTABLE)
  → UPDATE applicant status
  → DELETE lock (or let it expire)
  → RPUSH notification job to queue
```

### 4.7 Scheduled Announcement (Cron + Queue)

```
ppdb_announcements.scheduled_at
         ↓
 Background goroutine polls every 60s
 SELECT * WHERE status='scheduled' AND scheduled_at <= now()
         ↓
  1. Publish results to public dashboard
  2. SELECT all accepted applicants for this period
  3. RPUSH bulk notification jobs (batched 100/job)
  4. UPDATE announcement SET status='published', published_at=now()
  5. Worker pool delivers notifications
```

---

## 5. REST API Reference

All routes prefixed `/api/v1`. Auth via `Authorization: Bearer <jwt>`.

### 5.1 Epic A — Registration (Pendaftar)

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| `POST` | `/ppdb/{slug}/auth/request-otp` | None | OTP ke HP. Rate-limit: 3/min/phone |
| `POST` | `/ppdb/{slug}/auth/verify-otp` | None | Verifikasi OTP → JWT |
| `GET` | `/ppdb/{slug}/periods/active` | None | Info periode PPDB aktif + jalur |
| `POST` | `/ppdb/{slug}/applications` | Applicant | Buat draft pendaftaran |
| `GET` | `/ppdb/{slug}/applications/{id}` | Applicant (own) | Detail pendaftaran + status |
| `PUT` | `/ppdb/{slug}/applications/{id}` | Applicant | Update draft (pre-submit only) |
| `POST` | `/ppdb/{slug}/applications/{id}/submit` | Applicant | Submit → hitung jarak GPS |
| `POST` | `/ppdb/{slug}/applications/{id}/documents` | Applicant | Upload dokumen |
| `DELETE` | `/ppdb/{slug}/applications/{id}/documents/{docId}` | Applicant | Hapus dokumen (draft only) |
| `GET` | `/ppdb/{slug}/applications/{id}/stream` | Applicant | SSE: status updates realtime |

**POST /ppdb/{slug}/applications — Request:**
```json
{
  "period_id": "uuid",
  "track_id": "uuid",
  "full_name": "Budi Santoso",
  "birth_date": "2012-04-15",
  "birth_place": "Jakarta",
  "gender": "L",
  "nisn": "0012345678",
  "nik": "3201234567890001",
  "kk_number": "3201234567890001",
  "address": "Jl. Merdeka No. 1",
  "city": "Jakarta Barat",
  "province": "DKI Jakarta",
  "home_lat": -6.2088,
  "home_lng": 106.8456,
  "guardian_name": "Siti Santoso",
  "guardian_phone": "08123456789",
  "guardian_email": "siti@email.com",
  "prev_school_name": "SDN 01 Jakarta",
  "prev_school_npsn": "20101234",
  "grade_semesters": [85.5, 87.0, 86.5, 88.0, 89.5]
}
```

**Response:**
```json
{
  "data": {
    "id": "uuid",
    "registration_number": null,
    "status": "draft",
    "track": { "id": "uuid", "name": "Jalur Domisili", "type": "domisili" }
  }
}
```

### 5.2 Epic B — Verifikasi (Operator)

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| `GET` | `/ppdb/{slug}/operator/applications` | Operator | Queue verifikasi dengan filter status |
| `GET` | `/ppdb/{slug}/operator/applications/{id}` | Operator | Detail + acquire lock |
| `POST` | `/ppdb/{slug}/operator/applications/{id}/verify` | Operator | Submit verdict + catatan |
| `POST` | `/ppdb/{slug}/operator/applications/{id}/release-lock` | Operator | Release lock eksplisit |
| `GET` | `/ppdb/{slug}/operator/audit-logs` | Operator/Admin | Immutable audit trail |
| `GET` | `/ppdb/{slug}/operator/audit-logs/anomalies` | Admin | Deteksi verifikasi anomali |

**POST /verify — Request:**
```json
{
  "action": "approve",
  "note": "Semua dokumen lengkap dan valid",
  "document_verdicts": [
    { "doc_id": "uuid", "status": "approved", "note": "" },
    { "doc_id": "uuid", "status": "rejected", "note": "KK tidak terbaca" }
  ]
}
```

### 5.3 Epic C — Seleksi (Admin)

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| `POST` | `/ppdb/{slug}/admin/periods/{pid}/tka-import` | Admin | Upload CSV TKA (async) |
| `GET` | `/ppdb/{slug}/admin/periods/{pid}/tka-import/{importId}` | Admin | Status import + unmatched |
| `POST` | `/ppdb/{slug}/admin/periods/{pid}/selection/simulate` | Admin | Simulasi tanpa publish |
| `POST` | `/ppdb/{slug}/admin/periods/{pid}/selection/finalize` | Admin | Finalisasi (irreversible) |
| `GET` | `/ppdb/{slug}/admin/periods/{pid}/selection/results` | Admin | Hasil seleksi per jalur |

### 5.4 Epic D — Pengumuman & Dashboard Publik

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| `POST` | `/ppdb/{slug}/admin/announcements` | Admin | Jadwalkan pengumuman |
| `DELETE` | `/ppdb/{slug}/admin/announcements/{id}` | Admin | Cancel (>30 min sebelum jadwal) |
| `GET` | `/ppdb/{slug}/public/dashboard` | None | Quota real-time (cache 60s) |
| `GET` | `/ppdb/{slug}/public/results` | None | Daftar diterima (post-announcement) |
| `GET` | `/ppdb/{slug}/public/zone-map` | None | GeoJSON peta zonasi |

**GET /public/dashboard — Response:**
```json
{
  "data": {
    "school_name": "SMAN 1 Jakarta",
    "period": { "name": "PPDB 2026/2027", "reg_close_at": "2026-06-30T23:59:59Z" },
    "tracks": [
      { "name": "Domisili", "quota": 108, "registered": 143, "remaining": 0 },
      { "name": "Afirmasi", "quota": 54, "registered": 38, "remaining": 16 },
      { "name": "Prestasi", "quota": 36, "registered": 52, "remaining": 0 },
      { "name": "Mutasi", "quota": 18, "registered": 5, "remaining": 13 }
    ],
    "announcement": null
  }
}
```

### 5.5 Epic E — Daftar Ulang & Pembayaran

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| `POST` | `/ppdb/{slug}/enrollment/{applicantId}/confirm` | Applicant | Konfirmasi daftar ulang |
| `GET` | `/ppdb/{slug}/enrollment/{applicantId}/payment` | Applicant | Info tagihan + opsi bayar |
| `POST` | `/ppdb/{slug}/enrollment/{applicantId}/payment` | Applicant | Buat payment order (VA/QRIS/manual) |
| `POST` | `/ppdb/{slug}/webhooks/payment` | HMAC sig | Gateway webhook (idempotent) |
| `POST` | `/ppdb/{slug}/enrollment/{applicantId}/payment/upload-proof` | Applicant | Upload bukti transfer manual |
| `POST` | `/ppdb/{slug}/operator/payments/{paymentId}/confirm` | Operator | Konfirmasi manual transfer |
| `GET` | `/ppdb/{slug}/admin/payments/report` | Admin | Laporan rekonsiliasi (json/xlsx/pdf) |

**POST /payment — Request:**
```json
{ "method": "va_bca" }
```

**Response:**
```json
{
  "data": {
    "id": "uuid",
    "method": "va_bca",
    "amount": 5000000,
    "va_number": "70012345678901",
    "va_bank": "BCA",
    "expired_at": "2026-07-20T23:59:59Z"
  }
}
```

### 5.6 Epic F — Dapodik Export

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| `GET` | `/ppdb/{slug}/admin/periods/{pid}/dapodik/validate` | Admin | Cek data yang belum siap |
| `POST` | `/ppdb/{slug}/admin/periods/{pid}/dapodik/export` | Admin | Generate export (async) |
| `GET` | `/ppdb/{slug}/admin/periods/{pid}/dapodik/export/{exportId}` | Admin | Status + download URL |

### 5.7 Epic G — Konfigurasi

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| `POST` | `/ppdb/{slug}/admin/periods` | Admin | Buat periode PPDB baru |
| `PUT` | `/ppdb/{slug}/admin/periods/{pid}` | Admin | Update konfigurasi (pra-aktif) |
| `POST` | `/ppdb/{slug}/admin/periods/{pid}/tracks` | Admin | Tambah jalur seleksi |
| `PUT` | `/ppdb/{slug}/admin/periods/{pid}/tracks/{trackId}` | Admin | Update kuota/bobot jalur |
| `POST` | `/ppdb/{slug}/admin/periods/{pid}/activate` | Admin | Aktivasi dengan validasi penuh |
| `POST` | `/ppdb/{slug}/admin/periods/{pid}/copy` | Admin | Salin dari periode sebelumnya |

---

## 6. Frontend Design

### 6.1 App Router Directory Structure

```
frontend/
├── app/
│   ├── layout.tsx                          # Root: fonts, global providers
│   └── ppdb/
│       └── [schoolSlug]/
│           ├── layout.tsx                  # School branding + SchoolSlugProvider
│           ├── (public)/                   # No auth required
│           │   ├── page.tsx                # Landing: info PPDB + QuotaCounters
│           │   ├── peta-zonasi/page.tsx    # Interactive zonasi map (Mapbox)
│           │   └── pengumuman/page.tsx     # Daftar siswa diterima (post-announcement)
│           ├── (pendaftar)/                # Auth: role=pendaftar
│           │   ├── layout.tsx              # Pendaftar shell + auth guard
│           │   ├── daftar/page.tsx         # Registration: NIK + KK + OTP
│           │   ├── masuk/page.tsx          # Pendaftar login
│           │   ├── formulir/
│           │   │   ├── page.tsx            # Wizard entry
│           │   │   └── [step]/page.tsx     # data-siswa, data-ortu, jalur, dokumen, review
│           │   ├── status/page.tsx         # Real-time status tracker (SSE)
│           │   ├── daftar-ulang/
│           │   │   ├── page.tsx            # Re-enrollment form (pre-filled)
│           │   │   └── selesai/page.tsx    # Download surat penerimaan
│           │   └── pembayaran/
│           │       ├── page.tsx            # Payment page (VA/QRIS/manual tabs)
│           │       └── konfirmasi/page.tsx # Upload bukti transfer
│           └── (operator)/                 # Auth: role=operator|kepala_sekolah
│               ├── layout.tsx              # Operator shell + auth guard
│               ├── masuk/page.tsx          # Operator login (email+password)
│               ├── dasbor/page.tsx         # Stats dashboard (kepala_sekolah)
│               ├── setup/
│               │   ├── page.tsx            # Setup wizard entry
│               │   └── [step]/page.tsx     # info-umum, periode, jalur-kuota, dokumen, preview
│               ├── verifikasi/
│               │   ├── page.tsx            # Queue list
│               │   └── [pendaftaranId]/page.tsx  # Side-by-side viewer
│               ├── audit/page.tsx          # Immutable audit trail
│               ├── pengumuman/
│               │   ├── page.tsx            # Scheduled announcements list
│               │   └── buat/page.tsx       # Create/schedule
│               ├── pembayaran/
│               │   ├── page.tsx            # Rekonsiliasi dashboard
│               │   └── konfirmasi/page.tsx # Manual transfer approval queue
│               ├── notifikasi/page.tsx     # Bulk notification queue status
│               └── dapodik/page.tsx        # Export + re-export flags
├── components/
│   ├── ui/                                 # Primitive components
│   │   ├── Stepper.tsx                     # N-step indicator (reused by both wizards)
│   │   ├── StatusBadge.tsx                 # PendaftaranStatus → color + label
│   │   ├── DataTable.tsx                   # Generic sortable/filterable table
│   │   ├── FileUpload.tsx                  # Drag-drop + S3 presigned upload
│   │   └── MaskedText.tsx                  # NIK/KK masking per UU PDP
│   └── ppdb/
│       ├── public/
│       │   ├── QuotaCounters.tsx           # 'use client' — 60s refetch
│       │   ├── ZonasiMap.tsx               # 'use client' — Mapbox polygon + point check
│       │   └── AcceptedList.tsx            # Post-announcement names table
│       ├── pendaftar/
│       │   ├── RegistrationForm.tsx        # NIK + KK + OTP flow
│       │   ├── OtpInput.tsx                # 'use client' — 6-digit + countdown
│       │   ├── ApplicationWizard.tsx       # 'use client' — wizard shell (wizardStore)
│       │   ├── steps/                      # StepDataSiswa, StepDataOrtu, StepPilihJalur,
│       │   │                               #   StepUploadDokumen, StepReview
│       │   ├── StatusTracker.tsx           # 'use client' — SSE status timeline
│       │   ├── ReEnrollmentForm.tsx        # Pre-filled from accepted data
│       │   └── PaymentPanel.tsx            # 'use client' — VA/QRIS/manual tabs
│       └── operator/
│           ├── SetupWizard.tsx             # 'use client' — setup wizard (setupStore)
│           ├── VerificationViewer.tsx      # 'use client' — split panel
│           ├── DocumentPanel.tsx           # Left: PDF/image viewer (signed URL)
│           ├── ApplicantFormPanel.tsx      # Right: data + verdict controls
│           ├── ConcurrentEditIndicator.tsx # "Sedang diperiksa oleh X" banner
│           ├── AuditTrailTable.tsx         # Immutable log table
│           ├── AnnouncementScheduler.tsx   # Datetime picker + schedule CTA
│           ├── PaymentReconciliation.tsx   # Summary cards + transaction table
│           └── DapodikExportPanel.tsx      # Export button + re-export flags
├── lib/
│   ├── api/
│   │   ├── client.ts                       # Typed fetch (auth header + base URL)
│   │   ├── ppdb.ts                         # All PPDB API functions
│   │   └── types.ts                        # API response envelope types
│   ├── query/
│   │   ├── keys.ts                         # React Query key factory
│   │   └── hooks/                          # usePendaftaran, useVerifikasi, usePublicQuota, usePayment
│   ├── stores/
│   │   ├── wizardStore.ts                  # Zustand: application wizard step + draft
│   │   ├── setupStore.ts                   # Zustand: PPDB setup wizard state
│   │   └── authStore.ts                    # Zustand: token + role (hydrated from cookie)
│   ├── hooks/
│   │   ├── useSSE.ts                       # Generic Server-Sent Events subscriber
│   │   └── useSchoolSlug.ts                # Reads [schoolSlug] from params
│   └── utils/
│       ├── maskSensitive.ts                # NIK/KK display masking
│       └── formatters.ts                   # Currency IDR, date WIB, file size
└── middleware.ts                           # Edge: role-based routing guard
```

### 6.2 State Management Allocation

```
┌──────────────────────────────────────────────────────────────┐
│  Data                          Where            Why           │
├──────────────────────────────────────────────────────────────┤
│  School branding/config        Server Component  Cached/static│
│  Public quota numbers          React Query 60s   No auth      │
│  Applicant pendaftaran         React Query       Invalidate   │
│  Verification queue            React Query       Stale+refetch│
│  Audit trail                   React Query       Paginated    │
│  Payment status                React Query+SSE   VA push      │
├──────────────────────────────────────────────────────────────┤
│  Wizard step + draft data      Zustand           Pure UI      │
│  Setup wizard step + fields    Zustand           Multi-step   │
│  Auth token + role             Zustand           Cookie-seeded│
│  Concurrent edit lock UI       Zustand+polling   Optimistic   │
├──────────────────────────────────────────────────────────────┤
│  Application status changes    SSE               Server push  │
│  VA payment confirmation       SSE               Webhook push │
│  Concurrent lock check         React Query 10s   Advisory     │
│  Bulk notification progress    React Query 5s    Queue count  │
└──────────────────────────────────────────────────────────────┘
```

### 6.3 Key TypeScript Types

```typescript
// lib/api/types.ts

export type PendaftaranStatus =
  | 'draft' | 'submitted' | 'menunggu_verifikasi' | 'perlu_perbaikan'
  | 'terverifikasi' | 'dalam_seleksi' | 'diterima' | 'tidak_diterima'
  | 'daftar_ulang' | 'terdaftar_resmi'

export interface Pendaftaran {
  id: string
  registrationNumber: string | null
  status: PendaftaranStatus
  trackId: string
  trackName: string
  trackType: 'domisili' | 'afirmasi' | 'prestasi' | 'mutasi' | 'kustom'
  ranking: number | null
  totalInTrack: number | null
  dataSiswa: DataSiswa  // NIK masked on wire
  dataOrtu: DataOrtu
  documents: UploadedDocument[]
  statusHistory: StatusHistoryEntry[]
  rejectionNotes: string | null
  submittedAt: string | null
}

export interface DataSiswa {
  namaLengkap: string
  nik: string           // "xxxxxx****0001" — masked by API
  nomorKK: string       // masked
  nisn: string
  tanggalLahir: string  // YYYY-MM-DD
  gender: 'L' | 'P'
  alamat: string
  koordinat: { lat: number; lng: number } | null
}

export interface TrackPublicSummary {
  id: string
  name: string
  quota: number
  registered: number
  remaining: number
}

export interface PpdbConfig {
  id: string
  schoolSlug: string
  tahunAjaran: string
  schoolType: 'negeri' | 'swasta'
  periodeRegistrasi: { start: string; end: string }
  pengumumanAt: string | null
  tracks: TrackConfig[]
  requiredDocuments: DocumentRequirement[]
  isActive: boolean
  isDashboardPublic: boolean
}

// lib/stores/wizardStore.ts
type WizardStep = 'data-siswa' | 'data-ortu' | 'jalur' | 'dokumen' | 'review'
interface WizardStore {
  pendaftaranId: string | null
  currentStep: WizardStep
  stepData: Record<WizardStep, Record<string, unknown>>
  isDirty: boolean
  setStep: (step: WizardStep) => void
  updateStepData: (step: WizardStep, data: Record<string, unknown>) => void
  hydrate: (draft: Pendaftaran) => void
  reset: () => void
}
```

### 6.4 Auth Flow

```
Pendaftar Registration:
  /ppdb/{slug} → click "Daftar"
  → /daftar: isi NIK + KK + phone
  → POST /auth/request-otp → OTP via WhatsApp
  → OtpInput (5-min countdown, 3-resend limit)
  → POST /auth/verify-otp → httpOnly cookie (ppdb_token, ppdb_role=pendaftar)
  → redirect /formulir

Operator Login:
  /masuk?type=operator: email + password
  → POST /auth/login → cookie (role=operator|kepala_sekolah)
  → kepala_sekolah → /dasbor
  → operator → /verifikasi

middleware.ts (Edge):
  Reads ppdb_token cookie → verifyToken() → check role
  /setup|/verifikasi|/audit|... → require operator|kepala_sekolah
  /formulir|/status|/daftar-ulang → require pendaftar
```

---

## 7. Infrastructure Design

### 7.1 Local Development

```yaml
# docker-compose.yml
services:
  backend:   # Go binary (hot reload via air)
  frontend:  # Next.js dev server
  postgres:  # PostgreSQL 16
  redis:     # Redis 7
  minio:     # S3-compatible object storage
  mailhog:   # Email SMTP trap
```

### 7.2 Production (Recommended)

```
AWS EKS (Kubernetes)
├── Namespace: ppdb
│   ├── Deployment: backend (Go API)
│   │   ├── Replicas: 3 (HPA: CPU > 60%)
│   │   ├── Resources: request 256Mi/100m, limit 512Mi/500m
│   │   ├── Probes: /healthz liveness, /readyz readiness
│   │   └── Env: from Secret (DB, JWT, API keys)
│   ├── Deployment: frontend (Next.js)
│   │   ├── Replicas: 2
│   │   └── CDN: CloudFront for static assets
│   └── CronJob: announcement-publisher (every 60s)
├── RDS PostgreSQL 16 (Multi-AZ)
├── ElastiCache Redis 7 (cluster mode)
└── S3 (document storage, presigned URLs, data residency: ap-southeast-3 Jakarta)
```

**Data Residency**: Semua data disimpan di region `ap-southeast-3` (Jakarta) sesuai UU PDP No. 27/2022.

---

## 8. Security Design

| Layer | Implementation |
|-------|----------------|
| Transport | HTTPS/TLS 1.3 (ELB + ACM cert) |
| Auth (API) | JWT RS256, 1h access token, 7d refresh via httpOnly cookie |
| Auth (Webhook) | HMAC-SHA256 signature validation (payment gateway) |
| Data at rest | AES-256-GCM untuk NIK/KK, S3 server-side encryption |
| Data in transit | PostgreSQL SSL, Redis TLS |
| PII masking | NIK masked `xxxxxx****xx` di semua API responses |
| OTP rate limit | Redis sliding window: 3 req/menit per nomor HP |
| OWASP Top 10 | Parameterized queries (pgx), Zod validation frontend, CSP header, CORS whitelist |
| Audit | `ppdb_audit_logs` — INSERT only, no DELETE/UPDATE even for superadmin |
| GPS fraud | Flag jika koordinat `home_lat/lng` berbeda > 50km dari koordinat verifikasi Dukcapil (v2) |

---

## 9. Implementation Phases

### Phase 1 — Core Registration + Verification (Target: 2026-05-31)
**Epics: A (full), B (full), G (full)**

Priority order:
1. Database migrations (all tables)
2. Selection Engine domain + unit tests ← **address riskiest assumption first**
3. OTP flow + JWT auth
4. Application form + document upload
5. Verification dashboard + lock system
6. Audit log

**Deliverable**: Operator dapat menerima, memverifikasi, dan mencatat pendaftaran siswa end-to-end.

### Phase 2 — Selection + Announcement (Target: 2026-06-30)
**Epics: C (full), D (full)**

1. TKA CSV import
2. Domisili + Prestasi engine finalization
3. Simulation mode
4. Scheduled announcement + bulk notification queue
5. Public dashboard (real-time quota)
6. Zonasi map

**Deliverable**: Proses seleksi otomatis berjalan, pengumuman terjadwal, dashboard publik live.

### Phase 3 — Re-enrollment + Payment + Dapodik (Target: 2026-07-31)
**Epics: E (full), F (full)**

1. Payment gateway integration (Midtrans VA + QRIS)
2. Re-enrollment portal
3. Auto-expire deadline
4. Payment reconciliation dashboard
5. Dapodik export (CSV per Pusdatin template)
6. WhatsApp reminder untuk deadline

**Deliverable**: Siswa diterima bisa daftar ulang + bayar online; operator Dapodik bisa export langsung.

### Phase 4 — Beta + Hardening (Target: 2026-08-15)
1. Load testing (k6: 500 concurrent users)
2. Chaos engineering (kill Redis → verify fallback)
3. Onboarding 5 sekolah pilot
4. NPS survey setup

---

## 10. Risk Assessment

| Risiko | Mitigasi Teknis |
|--------|-----------------|
| Selection engine bug (ranking salah) | Unit test exhaustif + simulation mode wajib sebelum finalize |
| Server overload saat puncak PPDB | Load test sebelum Juni; HPA di K8s; public dashboard di-cache Redis 60s |
| API Dukcapil unavailable | Graceful fallback: validasi dokumen manual di v1; async queue untuk retry di v2 |
| Payment webhook duplikat | Idempotency key (`external_id UNIQUE`); status check sebelum update |
| Format Dapodik berubah | Abstraksi format export ke konfigurasi YAML; update template < 48 jam |
| GPS manipulation (koordinat palsu) | Flag anomali jika distance antara submit dan Dukcapil > 50km; audit trail |
| WhatsApp API rate limit | Queue + exponential backoff; SMS fallback jika WA delivery rate < 90% |
| Data breach NIK/KK | AES-256 at rest; masking di API; S3 encryption; audit log akses |

---

## 11. Testing Plan

### Unit Tests
- Selection engine: Haversine calc, Prestasi formula, tiebreaker logic
- AES encrypt/decrypt round-trip
- NIK masking edge cases
- Config validation (quota rules per Permendikdasmen No. 3/2025)

### Integration Tests
- OTP flow end-to-end (request → verify → JWT)
- Document upload flow (presigned URL → S3 → DB update)
- Payment webhook idempotency
- Dapodik export field mapping

### E2E Tests (Playwright)
- Pendaftar: register → fill form → upload docs → submit
- Operator: verify doc → approve → announce
- Payment: VA creation → webhook → status update

### Load Testing (k6)
- Target: 500 concurrent users selama 1 jam
- Scenario: `/public/dashboard` + `/applications/{id}` (mixed read/write)
- SLO: p95 < 2s, error rate < 0.1%

---

## 12. Open Questions (Technical)

- [ ] **Dapodik format**: Apakah Pusdatin menyediakan API import atau hanya file CSV/Excel? Format kolom terbaru untuk TA 2026/2027? — Owner: Engineering — Due: 2026-04-10
- [ ] **Payment gateway**: Midtrans vs Xendit — coverage BSI/BJB, fee, sandbox availability? — Owner: Engineering + Finance — Due: 2026-04-10
- [ ] **WhatsApp BSP**: Direct Meta API vs BSP (Wati/Twilio)? Implikasi delivery rate dan SLA? — Owner: Engineering — Due: 2026-04-10
- [ ] **Object storage**: S3 (AWS) vs GCS vs self-hosted MinIO di produksi? Data residency Jakarta (ap-southeast-3)? — Owner: Engineering Lead — Due: 2026-04-20
- [ ] **Mapbox vs Google Maps**: Pricing di skala 50 sekolah × 1000 zone check/PPDB? Apakah self-hosted Leaflet + OpenStreetMap viable? — Owner: Engineering — Due: 2026-04-15
- [ ] **Encryption key management**: AWS KMS vs HashiCorp Vault untuk rotasi kunci AES-256? — Owner: Engineering Lead — Due: 2026-04-20

---

## Appendix

### A. Environment Variables Required

```bash
# Backend
DATABASE_URL=postgres://user:pass@host:5432/simdikta
REDIS_URL=redis://host:6379
JWT_PRIVATE_KEY=<RS256 PEM>
JWT_PUBLIC_KEY=<RS256 PEM public>
AES_ENCRYPTION_KEY=<32-byte hex>
OBJECT_STORAGE_BUCKET=simdikta-documents
OBJECT_STORAGE_ENDPOINT=https://s3.ap-southeast-3.amazonaws.com
WHATSAPP_API_URL=...
WHATSAPP_API_TOKEN=...
SMS_GATEWAY_URL=...
SMS_GATEWAY_KEY=...
MIDTRANS_SERVER_KEY=...
MIDTRANS_CLIENT_KEY=...
MIDTRANS_WEBHOOK_KEY=...
GOOGLE_MAPS_API_KEY=...
DUKCAPIL_API_URL=...     # empty in v1 = manual fallback
DUKCAPIL_API_KEY=...

# Frontend
NEXT_PUBLIC_API_URL=https://api.simdikta.id
NEXT_PUBLIC_MAPBOX_TOKEN=...
```

### B. ADR Log

| Date | Decision | Rationale |
|------|----------|-----------|
| 2026-03-23 | Modular monolith (vs microservices) | Volume tidak membutuhkan independent scaling; tim lebih efisien dengan satu codebase |
| 2026-03-23 | Haversine calc in-process (vs Google Maps Distance API) | Zero cost, no external dependency, sufficient accuracy for ~km-scale zonasi |
| 2026-03-23 | Redis List queue (vs Kafka/RabbitMQ) | Skala notifikasi (~10K/PPDB season) tidak membutuhkan message broker dedicated |
| 2026-03-23 | SSE (vs WebSocket) untuk real-time status | SSE works through proxies/load balancers; no WS upgrade infra needed |
| 2026-03-23 | AES-256-GCM (vs transparent DB encryption) | Field-level control; NIK/KK isolated; key rotation possible without re-encrypting entire DB |
| 2026-03-23 | Direct-to-S3 presigned upload (vs through API) | Avoids API bandwidth bottleneck; 2MB docs × 10K pendaftar = 20GB tidak perlu lewat API |
