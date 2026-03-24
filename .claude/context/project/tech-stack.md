# Tech Stack — Simdikta

Last updated: 2026-03-23

## Frontend: Next.js + TypeScript

### Core Libraries
| Library | Purpose | Docs |
|---|---|---|
| Next.js 15 (App Router) | Full-stack React framework | nextjs.org/docs |
| TypeScript (strict) | Type safety | typescriptlang.org |
| TanStack Query | Server state, caching, async | tanstack.com/query |
| Zustand | Client UI state | github.com/pmndrs/zustand |
| React Hook Form | Form management | react-hook-form.com |
| Zod | Schema validation | zod.dev |
| Playwright | E2E critical flows | playwright.dev

### Code Conventions
- App Router: `app/` directory; Server Components default; push `'use client'` to the leaf.
- React Query keys: single source in `lib/query/keys.ts`; never inline arrays.
- Forms: RHF + Zod schema; no uncontrolled inputs or manual onChange wiring.
- Co-locate tests: `Component.tsx` + `Component.test.tsx`.
- Data fetching: Server Components or TanStack Query; never `useEffect` for fetch.

---

## Backend: Go

### Core Libraries
| Library | Purpose |
|---|---|
| net/http (stdlib) | HTTP server |
| github.com/go-chi/chi | HTTP router |
| database/sql + github.com/jackc/pgx/v5 | PostgreSQL driver |
| github.com/golang-migrate/migrate | DB migrations |
| github.com/golang-jwt/jwt/v5 | JWT auth |
| log/slog (stdlib, Go 1.21+) | Structured logging |
| github.com/prometheus/client_golang | Prometheus metrics |
| go.opentelemetry.io/otel | Distributed tracing |

### Code Conventions (see `backend-principles.md` for full list)
- Clean Architecture layers; dependency rule enforced.
- Package names: lowercase, single word (e.g., `ppdb`, `selection`).
- Context first: `func Do(ctx context.Context, ...)`.
- Error wrapping mandatory: `fmt.Errorf(\"context: %w\", err)`.
- Interfaces defined at point of use; constructor injection only.
- Table-driven tests; no globals, no `init` for setup; no `panic` outside `main`.

---

## Infrastructure

### Local Development
| Tool | Purpose |
|---|---|
| Docker Compose | Orchestrate local services |
| Makefile | Common dev commands |

### Production (recommended)
| Tool | Purpose |
|---|---|
| Terraform | Infrastructure as code |
| Kubernetes | Container orchestration |
| GitHub Actions | CI/CD pipeline |
| PostgreSQL 16 (RDS) | Primary database |
| Redis 7 (ElastiCache) | Cache, OTP, rate limit, queue |
| S3-compatible storage (ap-southeast-3) | Documents/uploads |

---

## Environment Variables

### Backend Required
```
PORT=8080
DATABASE_URL=postgres://user:pass@localhost:5432/simdikta?sslmode=disable
REDIS_URL=redis://localhost:6379
JWT_PRIVATE_KEY_PATH=./keys/jwt_rsa
JWT_PUBLIC_KEY_PATH=./keys/jwt_rsa.pub
LOG_LEVEL=info
```

### Frontend Required
```
NEXT_PUBLIC_API_URL=http://localhost:8080
```

---

## Common Make Commands
```bash
make dev         # Start all services with docker-compose
make test        # Run all tests
make test-race   # Run tests with race detector
make lint        # Run golangci-lint and eslint
make build       # Build backend binary
make migrate     # Run database migrations
make seed        # Seed local dev data (if available)
```
