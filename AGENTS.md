# Codex Instructions for This Repository

---

## 1. Project Overview

**Simdikta** is a multi-tenant SaaS platform for Indonesian school management. The first module is **PPDB/SPMB** — the new student enrollment system mandated by Permendikdasmen No. 3/2025 — targeting both private (swasta) and public (negeri) schools.

**Domain**: EdTech / Education SaaS (Indonesia)
**Users**: School administrators, verification operators, principals, parents, applicants
**Regulation**: Permendikdasmen No. 3/2025 (SPMB), UU PDP No. 27/2022 (data privacy), Dapodik (Pusdatin Kemendikdasmen)

### Tech Stack

| Layer | Technology |
|---|---|
| Backend | Go 1.24+, chi router, pgx (PostgreSQL), Redis |
| Frontend | Next.js 15 (App Router), TypeScript, TanStack Query, Zustand, React Hook Form + Zod |
| Database | PostgreSQL 16 (primary), Redis 7 (cache, OTP, queue) |
| Storage | S3-compatible (documents, exports) — data residency: ap-southeast-3 Jakarta |
| Infra | Docker Compose (local), Kubernetes/EKS (production), Terraform, GitHub Actions |
| Auth | JWT RS256 — access token 1h, refresh via httpOnly cookie |
| Notifications | WhatsApp Business API (primary), SMS gateway (fallback) |
| Payments | Midtrans or Xendit (VA multi-bank, QRIS, manual transfer) |

### Architecture Summary

**Modular monolith** with strict package boundaries. Go backend follows Clean Architecture (domain → application → interface → infrastructure). Frontend follows Next.js App Router conventions with Server Components as default.

---

## 2. Engineering Principles

### Architecture

- **Clean Architecture**: dependency rule is strict and inward — domain depends on nothing; infrastructure depends on domain interfaces
- **Domain-Driven Design**: model the business domain explicitly with Entities, Value Objects, Aggregates, Domain Services, and Domain Events
- **Ubiquitous Language**: use the same terminology as the PRD and domain experts (e.g., `Pendaftar`, `JalurSeleksi`, `PeriodePPDB`, not generic names like `User`, `Category`, `Period`)
- **Bounded contexts**: each major domain concern (registration, verification, selection, payment, notification) has its own package boundary
- **Multi-tenant safety**: every repository method takes `schoolID uuid.UUID` as an explicit parameter; no query is ever cross-tenant

### Domain Modeling

- Entities have identity and lifecycle (e.g., `Applicant`, `PaymentOrder`)
- Value Objects are immutable and defined by their attributes (e.g., `RegistrationNumber`, `TrackType`, `ApplicantStatus`)
- Aggregates enforce consistency boundaries — only the root is accessed from outside
- Domain logic lives in the domain layer, NOT in handlers or repositories
- Avoid anemic domain models — business rules belong on entities, not in services

### Code Quality

- Every function has a single responsibility
- Error wrapping is always contextual: `fmt.Errorf("submitting application: %w", err)`
- No `panic` outside of `main.go` startup validation
- No `init()` for dependency setup
- No global state — constructor injection only
- Code must be readable without comments; add comments only when logic is non-obvious

### Data & State

- NIK and KK number are encrypted at rest using AES-256-GCM; never stored as plaintext
- NIK is always masked in API responses: `xxxxxx****0001` (per UU PDP No. 27/2022)
- Audit logs (`ppdb_audit_logs`) are INSERT-only — no UPDATE, no DELETE, ever, including by superadmin
- Every status change on `ppdb_applicants` triggers an audit log entry before the status update
- Redis is used for OTP storage (TTL 5min), rate limiting (sliding window), job queue (BLPOP), and public dashboard cache (TTL 60s)

### API Design

- REST; all routes prefixed `/api/v1`
- Multi-tenant routing: school resolved from `{school_slug}` path segment via `TenantResolver` middleware
- Consistent JSON envelope: `{ "data": ..., "error": null, "meta": { "page": 1, "total": 100 } }`
- Error format: `{ "data": null, "error": { "code": "VALIDATION_FAILED", "message": "...", "details": [...] } }`
- HTTP status codes must be semantically correct: 422 for business rule violations, 409 for conflicts, 429 for rate limits
- Every endpoint that performs a write must produce an audit log entry

### Testing

- Unit tests for all domain logic (selection engine, formula calculations, NIK masking, AES encrypt/decrypt)
- Integration tests for repository methods against a real PostgreSQL test database — never mock the database
- Contract tests for external integrations (payment webhook, WhatsApp notification)
- E2E tests (Playwright) for the critical user flows: registration, verification, selection, payment
- Table-driven tests in Go: `tests := []struct{ name string; input ...; expected ... }{}`
- Test files co-located: `entity_test.go` beside `entity.go`, `Component.test.tsx` beside `Component.tsx`
- Race detector on CI: `go test -race ./...`

---

## 3. Architecture Guidelines

### Go Backend — Layer Definitions

```
cmd/api/main.go              # Wire dependencies; start server; graceful shutdown
internal/
├── domain/                  # ZERO external imports; pure business logic
│   ├── ppdb/entity.go       # Entities, Value Objects, domain errors
│   ├── ppdb/repository.go   # Repository interfaces (consumed by service)
│   ├── ppdb/service.go      # Service interfaces
│   └── selection/engine.go  # Domain service interface (SelectionEngine)
├── handler/                 # HTTP: decode → call service → encode; NO business logic
│   ├── ppdb/                # One file per epic
│   └── middleware/          # tenant, auth, ratelimit, metrics
├── service/                 # Orchestrates domain + repo interfaces; owns transactions
├── repository/postgres/     # Implements domain repository interfaces; SQL only
├── adapter/                 # Implements domain interfaces for external systems
│   ├── selection/           # Engine implementations (domisili, prestasi, afirmasi, mutasi)
│   ├── payment/             # Midtrans / Xendit adapters
│   ├── whatsapp/            # WhatsApp Business API adapter
│   ├── maps/haversine.go    # Pure math; zero external API dependency
│   └── queue/               # Redis List-based job queue
└── pkg/                     # Internal shared utilities (crypto, masking, response, pagination)
```

**Dependency rule — enforced by import restrictions:**
- `domain` → imports nothing internal
- `service` → imports `domain` interfaces only (never `repository` or `adapter` directly)
- `handler` → imports `domain` interfaces only (never `service` concrete types directly)
- `repository` → imports `domain` entity types
- `adapter` → implements `domain` interfaces
- Violation of this rule is a blocking review comment

### Frontend — Layer Definitions

```
app/ppdb/[schoolSlug]/
├── layout.tsx               # Server Component: loads school config, sets SchoolSlugProvider
├── (public)/                # No auth: landing, zonasi map, results
├── (pendaftar)/             # Auth role=pendaftar: wizard, status, re-enrollment, payment
└── (operator)/              # Auth role=operator|kepala_sekolah: setup, verify, audit, dapodik

components/
├── ui/                      # Primitive, reusable, domain-agnostic
└── ppdb/
    ├── public/              # Public-facing components
    ├── pendaftar/           # Applicant-facing components
    └── operator/            # School operator components

lib/
├── api/                     # Typed API client + all API call functions + shared types
├── query/keys.ts            # SINGLE source of truth for all React Query keys
├── stores/                  # Zustand stores (wizard, setup, auth)
└── hooks/                   # Shared hooks (useSSE, useSchoolSlug)
```

### Boundaries

- Server Components are the default; add `'use client'` only when interactivity or browser APIs are required
- Push `'use client'` boundary as deep as possible — wrap only the interactive leaf, not the whole page
- Never use `useEffect` for data fetching — use Server Components or TanStack Query
- `SchoolSlugProvider` is the single source of school context; do not prop-drill school data

---

## 4. Coding Standards

### Go

- **Package names**: lowercase, single word (`ppdb`, `selection`, `payment`) — no underscores, no plurals
- **Error wrapping**: `fmt.Errorf("context: %w", err)` always; never discard errors with `_`
- **Context**: always first parameter — `func Do(ctx context.Context, ...)`
- **Interfaces**: defined at point of use (consumer package), not at declaration (producer package); named by behavior (`Sender`, `Storer`, `Verifier`)
- **Constructor pattern**: `func New<Type>(...deps) *Type { return &Type{...} }` — no zero-value initialization
- **Struct tags**: use `json:"snake_case"` consistently; use `db:"snake_case"` for pgx scanning
- **Constants over magic strings**: `ApplicantStatus`, `TrackType`, `PaymentMethod` are typed string constants
- **No naked returns**; no single-letter variable names except loop counters and `ctx`

### TypeScript / React

- **Strict TypeScript**: `strict: true` in tsconfig; no `any`, no `@ts-ignore` without explanation
- **Named exports only**: no default exports except for Next.js page/layout files
- **Zod schemas** define the contract for all form data and API responses; never write manual type assertions
- **React Query key factory** (`lib/query/keys.ts`) is the single source of truth for cache keys — no inline key arrays
- **Form state**: React Hook Form + Zod; no uncontrolled inputs; no manual `onChange` handlers for form fields
- **No prop drilling beyond 2 levels**: use context or Zustand store
- **Component file naming**: PascalCase (`VerificationViewer.tsx`); hooks: camelCase with `use` prefix

### SQL / Database

- **Always include `school_id = $1`** as the first filter in every multi-tenant query — this is enforced by passing `schoolID` as the first parameter to all repository methods
- Use `pgx/v5` named parameters where queries get complex (> 4 parameters)
- Migrations are sequential and irreversible — never edit an existing migration file after it's committed; add a new one
- Every new table needs: `id UUID DEFAULT gen_random_uuid()`, `created_at TIMESTAMPTZ DEFAULT now()`, appropriate indexes on foreign keys and common query patterns

---

## 5. AI Behavior Rules

### What Codex MUST always do

- **Read before writing**: read the relevant existing code before proposing changes; never suggest code that contradicts established patterns
- **Follow the dependency rule**: never place business logic in handlers; never call repositories from handlers; never import concrete adapters in services
- **Use domain terminology**: use the Ubiquitous Language from the PRD — `Pendaftar` not `User`, `JalurSeleksi` not `Track`, `PeriodePPDB` not `Period`
- **Reference existing patterns**: before writing a new repository method, check how existing ones are structured; follow exactly
- **Write production-ready code**: no `// TODO: add error handling`, no placeholder implementations, no pseudo-code
- **Mask sensitive data**: any code that returns NIK or KK number to a client MUST apply `masking.MaskNIK()` — never return raw values
- **Scope every query**: every SQL query against a multi-tenant table MUST include `WHERE school_id = $1`
- **Audit writes**: every service method that changes `ppdb_applicants.status` MUST write to `ppdb_audit_logs` within the same transaction, BEFORE the status update
- **Validate upstream documents**: follow the product-orchestrator governance chain before executing `/generate-prd`, `/design-architecture`, or `/plan-feature`

### What Codex MUST never do

- Introduce new libraries or frameworks without explicit user approval and documented rationale
- Bypass the Clean Architecture layer boundaries (e.g., calling `repository` directly from `handler`)
- Use `interface{}` or `any` without a documented reason
- Write untestable code (functions with hidden dependencies, global state, or no interface seam)
- Generate migrations that modify existing migration files
- Return unmasked NIK or KK data in any API response
- Write `DELETE` or `UPDATE` queries against `ppdb_audit_logs` — this table is immutable
- Skip the governance check when executing product commands (`/generate-prd`, `/design-architecture`, `/plan-feature`)
- Generate vague, generic, or template-filler implementations — every output must be specific to the actual feature being built

---

## 6. Documentation Standards

### Product Research

- Saved to: `docs/product-research/YYYY-MM-DD-<topic>.md`
- Must start with governance header: `Status`, `Version`, `Last Updated`, `Depends On`
- Every claim must cite a source; distinguish facts from hypotheses
- Includes: problem validation, competitor landscape, market context, key risks

### PRD (Product Requirements Document)

- Saved to: `.Codex/thoughts/product/YYYY-MM-DD-<feature-slug>-prd.md`
- Must start with governance header
- Requires upstream Product Research `Status: ✅` before creation
- Structure: Overview → Problem Statement (with evidence) → Goals → Non-Goals → User Stories (Given/When/Then, P0/P1/P2) → Technical Requirements → Success Metrics → Dependencies → Risks → Open Questions
- Success metrics must be quantifiable; "improve experience" is not a metric
- Non-Goals section is mandatory — minimum 2 explicit exclusions

### TRD (Technical Requirements Document)

- Saved to: `.Codex/thoughts/architecture/YYYY-MM-DD-<feature-slug>-design.md`
- Must start with governance header
- Requires upstream PRD `Status: ✅` before creation
- Structure: Overview → Domain Model (DDD) → Bounded Contexts → Architecture (Clean Architecture layers) → Application Layer (use cases) → Data Model (DDL) → API Design (with request/response examples) → Frontend Design → Infrastructure → Alternatives (minimum 2) → Risks → Implementation Phases → Testing Strategy
- Every API endpoint requires a request body and response body example
- Riskiest assumption must be identified and addressed FIRST in implementation phases
- Implementation phases: maximum 2-week slices

### Plan

- Saved to: `.Codex/thoughts/plans/YYYY-MM-DD-<feature-slug>.md`
- Must start with governance header
- Requires upstream TRD `Status: ✅` before creation
- Structure: Summary → Scope → Technical Approach → Architecture Mapping → Implementation Phases (with automated + manual success criteria) → Files to Create → Files to Modify → Data Changes → API Changes → Testing Strategy → Rollout Plan → Risks
- Tasks must reference exact file paths
- Every phase has automated success criteria (runnable commands) and manual verification steps

---

## 7. Development Workflow

### Feature Development Flow (NON-NEGOTIABLE ORDER)

```
Product Research  →  PRD  →  TRD  →  Plan  →  Implementation
    (/generate-prd)     (/design-architecture)  (/plan-feature)
```

Each stage gates the next. The `product-orchestrator` agent enforces this via document header status (`✅` / `⚠️`). No stage can be started if the upstream document is `⚠️ Needs Update`.

### Starting a Feature

1. `/generate-prd` — validate existing research or run `product-research` agent; produce PRD
2. `/design-architecture` — produce TRD from approved PRD; engage specialist agents for frontend/backend/infra
3. `/plan-feature` — produce granular implementation plan from approved TRD
4. Get explicit user approval on the plan before writing any code

### Implementation Sequence

Address the riskiest assumption first. For PPDB module, this is always the **selection engine** (Haversine + formula calculation) — build and test it before any UI.

### Commits

- Style: Conventional Commits — `feat(ppdb): add domisili selection engine`
- Scope must match the bounded context being changed
- Never commit `.env` files; `.env.example` is tracked

### Code Review

Use `/review-code` before merging. Reviewers check:
- Clean Architecture boundaries respected
- Multi-tenant `school_id` scoping present on all queries
- Audit log writes present on all status changes
- Sensitive data masked in API responses
- Test coverage for domain logic

---

## 8. Guardrails (Anti-Patterns)

### Architecture Violations

- ❌ Business logic in HTTP handlers (`handler/*.go`)
- ❌ Direct database calls from handlers (bypassing service and repository layers)
- ❌ Importing concrete `repository` types in `service` (use interfaces)
- ❌ Importing concrete `adapter` types in `service` (use interfaces)
- ❌ `domain` package importing anything from `handler`, `service`, `repository`, or `adapter`
- ❌ Frontend Server Components making calls that require `'use client'` without the directive

### Data Safety Violations

- ❌ Raw NIK or KK returned in any HTTP response
- ❌ NIK or KK stored unencrypted in the database
- ❌ SQL query against multi-tenant table without `WHERE school_id = $1`
- ❌ `UPDATE` or `DELETE` on `ppdb_audit_logs`
- ❌ Status change on `ppdb_applicants` without prior audit log insert in the same transaction

### Code Quality Violations

- ❌ `interface{}` or `any` without documented justification
- ❌ `panic` outside `main.go` startup validation
- ❌ Global variables (use constructor injection)
- ❌ `useEffect` for data fetching in React (use Server Components or TanStack Query)
- ❌ Inline React Query key arrays (use `lib/query/keys.ts` factory)
- ❌ Untyped API calls (all calls go through typed `lib/api/ppdb.ts` functions)

### Process Violations

- ❌ Creating a PRD without `Status: ✅` Product Research upstream
- ❌ Creating a TRD without `Status: ✅` PRD upstream
- ❌ Creating a Plan without `Status: ✅` TRD upstream
- ❌ Starting implementation before the Plan is explicitly approved by the user
- ❌ Editing committed migration files — add a new migration instead

---

## 9. Assumptions

The following decisions were made during initial architecture and are in effect until explicitly overridden:

| Decision | Rationale |
|---|---|
| Modular monolith (not microservices) | Volume (50 schools, ~10K students/year) does not justify distributed system complexity |
| Haversine in-process (not Google Maps Distance API) | Zero cost, no external dependency, sufficient accuracy for km-scale zonasi |
| Redis List queue (not Kafka/RabbitMQ) | ~10K notifications/PPDB season does not require a dedicated message broker |
| SSE for real-time (not WebSocket) | Works through proxies and load balancers without infrastructure changes |
| AES-256-GCM field-level encryption (not transparent DB encryption) | Enables key rotation per field without re-encrypting the entire database |
| Direct-to-S3 presigned upload (not proxied through API) | Prevents API server from becoming a bottleneck for 2MB × 10K document uploads |
| Data residency: ap-southeast-3 Jakarta | Required by UU PDP No. 27/2022 for Indonesian citizen data |
