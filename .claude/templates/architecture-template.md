# Technical Requirements Design (TRD): [Feature Name]

Status: ✅ Up-to-date  
Version: v1.0.0  
Last Updated: YYYY-MM-DD  
Depends On: PRD v<X.Y.Z> — <filename>

Author: [Tech Lead]  
PRD Reference: [path]

---

## 1. Overview
- What is being built and why (link to PRD goals).
- Primary risks; call out if selection engine is involved (treat as highest risk).

## 2. Domain Model (DDD)
- **Ubiquitous Language**: key terms from `context/project/domain-lexicon.md`.
- **Entities**: [name, identity rule, key fields].
- **Value Objects**: [name, invariants].
- **Aggregates**: roots and boundaries; invariants enforced.
- **Domain Services**: e.g., SelectionEngine rules.

## 3. Bounded Contexts
- Contexts involved (registration, verification, selection, payment, notification). State upstream/downstream relationships and integration seams.

## 4. Architecture (Clean Architecture)
- Layer mapping: Domain, Service/Application, Handler/Interface, Repository/Adapter, pkg.
- Dependency rule confirmation (imports point inward); note any anti-corruption layers.
- Multi-tenant contract: repository signatures include `schoolID`; SQL begins with `WHERE school_id = $1`.
- Audit rule: status change requires audit insert before update in same transaction.
- Data safety: NIK/KK encrypted (AES-256-GCM) and masked in responses.

## 5. Application Layer (Use Cases)
List each use case with input/output DTOs and involved domain objects.

## 6. Data Model (DDL)
- New/changed tables with full DDL (id UUID default gen_random_uuid(), created_at now()).
- Indexes and foreign keys; note partitioning if any.
- Migration plan (new file only; never edit existing migrations).

## 7. API Design
For every endpoint: method + path, auth, request body example, response body example, error schema. Follow `/api/v1/{school_slug}/...` where applicable.

## 8. Frontend Design
- Routes/pages affected (App Router). Server vs Client components; data fetching approach. React Query keys from `lib/query/keys.ts`. Form schemas via Zod + RHF.

## 9. Infrastructure
- Services touched (PostgreSQL, Redis roles, S3 uploads, queues). Observability: logs/metrics/traces to add.
- Deployment/rollout considerations (feature flags, migrations order, backward compatibility).

## 10. Alternatives (>=2)
- Option A — pros/cons
- Option B — pros/cons
- Decision rationale.

## 11. Risks
- Ranked list with mitigation; include selection engine correctness if relevant.

## 12. Implementation Phases (<=2-week slices)
For each phase:
- Scope/tasks with file paths
- Automated success criteria (commands) + manual checks

## 13. Testing Strategy
- Unit: domain/service rules (table-driven).
- Integration: repository with real Postgres; handlers end-to-end.
- E2E: Playwright for registration, verification, selection, payment.
- Non-functional: performance goals, rate limits.

## 14. Open Questions
- [ ] Question — Owner — Due date
