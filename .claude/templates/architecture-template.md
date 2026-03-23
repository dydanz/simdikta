# Technical Design: [Feature Name]

**PRD Reference**: [Path to PRD or link]
**Author**: [Tech Lead Name]
**Status**: Draft | Review | Approved
**Created**: YYYY-MM-DD
**Last Updated**: YYYY-MM-DD

---

## 1. Overview

[2-3 sentences. What is being built technically and what is the high-level approach? A reader who hasn't seen the PRD should understand the scope.]

---

## 2. Background

[Technical context required to understand this design. Reference existing patterns, prior decisions, or architectural constraints.]

---

## 3. Goals

- [Technical goal derived from PRD goal 1]
- [Technical goal derived from PRD goal 2]

## 4. Non-Goals

- [Technical non-goal — explicitly excluded from this design]

---

## 5. Proposed Design

### 5.1 Architecture

[ASCII diagram or written description of components and their interactions]

```
Client (Next.js) → /api/[resource] → Handler → Service → Repository → PostgreSQL
                                              ↘ Cache (Redis)
```

**Components**:
| Component | Responsibility | Package/Location |
|---|---|---|
| [Component] | [What it does] | `internal/[package]` |

---

### 5.2 Data Model

[New tables, columns, or schema changes needed]

```sql
CREATE TABLE [table_name] (
    id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id    UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    [field]    TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_[table]_user_id ON [table_name](user_id);
```

---

### 5.3 API Design

**Endpoint**: `POST /api/v1/[resource]`
**Auth**: Required (Bearer JWT)

Request body:
```json
{
  "field": "value"
}
```

Response `201 Created`:
```json
{
  "id": "uuid",
  "field": "value",
  "created_at": "2024-01-01T00:00:00Z"
}
```

Error responses:
| Status | Condition |
|---|---|
| 400 | Invalid or missing required fields |
| 401 | Missing or invalid auth token |
| 403 | Insufficient permissions |
| 409 | Conflict (e.g., duplicate) |

---

### 5.4 Frontend Changes

**New Routes**:
- `app/(dashboard)/[feature]/page.tsx` — [purpose]

**New Components**:
- `components/[feature]/[ComponentName].tsx` — [purpose]

**State Changes**:
- React Query key: `['[resource]', id]`
- Zustand: [any global state changes]

---

## 6. Alternatives Considered

| Alternative | Why Rejected |
|---|---|
| [Option A] | [Specific reason] |
| [Option B] | [Specific reason] |

---

## 7. Technical Risks

| Risk | Likelihood | Mitigation |
|---|---|---|
| [Technical risk] | High / Med / Low | [How we address it] |

---

## 8. Implementation Plan

### Phase 1: [Name] — [Estimate: X days]
- [ ] Task 1 (file:line or new file path)
- [ ] Task 2

**Success criteria**:
- `go test ./... -race` passes
- `npm run build` passes

### Phase 2: [Name] — [Estimate: X days]
- [ ] Task 1

**Success criteria**:
- [What automated checks must pass]

---

## 9. Testing Plan

| Layer | What is Tested | Tool |
|---|---|---|
| Unit | [Service layer business logic] | Go test + gomock |
| Integration | [Handler → DB round trip] | Go test + Docker Postgres |
| E2E | [Critical user journey] | Playwright |

---

## 10. Rollout Plan

- [ ] Feature flag `enable_[feature]` — default off
- [ ] Enable for internal team (validate)
- [ ] Enable for beta users (X%)
- [ ] Full rollout
- [ ] Remove feature flag

**Rollback**: Disable feature flag `enable_[feature]` → no redeploy needed.

---

## 11. Open Questions

- [ ] [Technical question needing resolution] — Owner: [Name] — Due: YYYY-MM-DD
