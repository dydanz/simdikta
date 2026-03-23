# Tech Stack Reference

## Frontend: Next.js + TypeScript

### Core Libraries
| Library | Purpose | Docs |
|---|---|---|
| Next.js 15 | Full-stack React framework | nextjs.org/docs |
| TypeScript | Type safety | typescriptlang.org |
| TanStack Query | Server state, caching, async | tanstack.com/query |
| Zustand | Client UI state | github.com/pmndrs/zustand |
| React Hook Form | Form management | react-hook-form.com |
| Zod | Schema validation | zod.dev |

### Code Conventions
- App Router: use `app/` directory (not `pages/`)
- Server Components by default — add `'use client'` only when needed
- Co-locate: `Component.tsx` + `Component.test.tsx` in same folder
- Barrel exports: `index.ts` per feature folder
- Never `useEffect` for data fetching — use React Query or Server Components

---

## Backend: Go

### Core Libraries
| Library | Purpose |
|---|---|
| net/http (stdlib) | HTTP server |
| github.com/go-chi/chi | HTTP router |
| database/sql + github.com/jackc/pgx | PostgreSQL driver |
| github.com/golang-migrate/migrate | DB migrations |
| github.com/golang-jwt/jwt/v5 | JWT auth |
| log/slog (stdlib, Go 1.21+) | Structured logging |
| github.com/prometheus/client_golang | Prometheus metrics |
| go.opentelemetry.io/otel | Distributed tracing |

### Code Conventions
- Package names: lowercase, single word (`user`, `handler`, `repository`)
- Error wrapping: `fmt.Errorf("context: %w", err)`
- Context always first parameter: `func Do(ctx context.Context, ...)`
- Interfaces at point of use (consumer package, not producer)
- Table-driven tests: `tests := []struct{ name string; ... }{}`
- No global state — constructor injection only

---

## Infrastructure (TBD — update when decided)

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
| PostgreSQL (RDS) | Primary database |
| Redis (ElastiCache) | Cache and sessions |

---

## Environment Variables

### Backend Required
```
PORT=8080
DATABASE_URL=postgres://user:pass@localhost:5432/simdikta
JWT_SECRET=<min-32-char-secret>
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
```
