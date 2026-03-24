# Workflow: Feature Development Lifecycle

Day-to-day workflow for implementing a feature once a plan is approved.

## Pre-conditions
- Implementation plan exists in `.claude/thoughts/plans/`
- Technical design is approved
- Governance chain satisfied: Product Research ✅ → PRD ✅ → TRD ✅ → Plan ✅
- Feature branch created from main: `git checkout -b codex/<slug>`

---

## Development Loop

### 1. Start a phase
Read the current phase from the implementation plan. Understand all tasks and their success criteria before touching code.

### 2. Research before coding
```
/analyze-codebase [what I'm about to build]
```
Always check the existing patterns before writing new code. Use `codebase-pattern-finder` to find the canonical example to follow.
Read project context (architecture, data-safety, frontend-principles, backend-principles, domain-lexicon) to enforce:
- Multi-tenant `school_id` scoping in repositories/SQL
- Audit-log-before-status-change in the same transaction
- NIK/KK encryption + masking; never log PII
- Clean Architecture boundaries (no handler → repo, no domain internal imports)
- Selection engine is the riskiest area — tackle its tests first when relevant

### 3. Implement
- Write code following established patterns (from `codebase-pattern-finder`)
- Keep commits small and focused — one logical change per commit
- Commit message format: `type(scope): description` (conventional commits)
  - Types: `feat`, `fix`, `refactor`, `test`, `docs`, `chore`
  - Example: `feat(auth): add JWT refresh token endpoint`

### 4. Test as you go
```bash
# After each significant change:
go test ./... -race           # Backend — always with race detector
npm run test -- --watchAll=false  # Frontend
```

### 5. Check off tasks
Update the implementation plan file: mark completed tasks `[x]`.

### 6. Phase review
When all tasks in a phase are complete:
- Run the full automated success criteria for that phase
- `/review-code` for a self-review before moving on
- Commit and push

### 7. Repeat for the next phase

---

## Definition of Done

A feature is complete when:
- [ ] All implementation plan tasks are checked off
- [ ] `go test ./... -race` passes (backend)
- [ ] `npm run test` passes (frontend)
- [ ] Coverage meets threshold (> 80% for new code)
- [ ] `/review-code` shows no blocking findings
- [ ] E2E test covers the primary happy path
- [ ] PR description references the PRD and technical design doc

---

## Adding a New API Endpoint (Go)

1. Define the domain entity in `internal/domain/[entity]/entity.go`
2. Define the repository interface in `internal/domain/[entity]/repository.go`
3. Implement business logic in `internal/service/[entity]_service.go`
4. Implement the repository in `internal/repository/postgres/[entity].go`
5. Write the HTTP handler in `internal/handler/[entity].go`
6. Register the route in the router
7. Write unit tests for the service, integration tests for the handler
8. Verify with `/run-tests`

## Adding a New Page (Next.js)

1. Create route: `app/(dashboard)/[feature]/page.tsx` (Server Component)
2. Add `loading.tsx` and `error.tsx` for the route
3. Fetch data in the Server Component (or React Query for client-side)
4. Extract interactive parts as Client Components (`'use client'`)
5. Write component tests with React Testing Library
6. Add to E2E suite if it's a critical user path
