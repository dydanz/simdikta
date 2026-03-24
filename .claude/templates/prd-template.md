# PRD: [Feature Name]

Status: ✅ Up-to-date  
Version: v1.0.0  
Last Updated: YYYY-MM-DD  
Depends On: Product Research v<X.Y.Z> — <filename>

Author: [Name]  
Engineering Lead: [Name]

---

## 1. Problem Statement

[Who has this problem? How often? What do they do today? Why is the current approach inadequate?]

**Who**: [User segment]
**Pain**: [Specific friction or gap]
**Current workaround**: [What they do today to cope]
**Why now**: [Why this is the right time to solve it]

---

## 2. Goals

**Primary Goal**: [One measurable outcome this feature must achieve]

**Secondary Goals**:
- [Additional benefit]
- [Additional benefit]

---

## 3. Non-Goals

> Being explicit about what is NOT in scope prevents scope creep.

- [Explicitly excluded feature or use case] (require at least 2)
- [Another exclusion]

---

## 4. Regulatory & Guardrails (Simdikta)
- Permendikdasmen No. 3/2025 constraints (PPDB/SPMB tracks, quotas).
- UU PDP No. 27/2022: encryption + masking of NIK/KK, data residency ap-southeast-3.
- Multi-tenant safety: `school_id` scoping; no cross-tenant aggregation.
- Audit log invariants: status changes logged before update; `ppdb_audit_logs` append-only.
- Selection engine correctness is highest risk — call out required validation.

---

## 5. User Stories

### Story 1: [User type] can [action] so that [benefit]
**Priority**: P0 — must-have for launch

**Acceptance Criteria**:
- [ ] Given [precondition], when [action], then [outcome]
- [ ] Given [precondition], when [action], then [outcome]
- [ ] Given [precondition], when [error condition], then [error outcome]

---

### Story 2: [User type] can [action] so that [benefit]
**Priority**: P1 — should-have

**Acceptance Criteria**:
- [ ] Given [precondition], when [action], then [outcome]

---

### Story 3: [User type] can [action] so that [benefit]
**Priority**: P2 — nice-to-have, future consideration

**Acceptance Criteria**:
- [ ] Given [precondition], when [action], then [outcome]

---

## 6. Technical Requirements

> Non-functional requirements engineering must meet.

- **Performance**: [e.g., API P99 < 500ms, page load < 2s on 4G]
- **Scale**: [e.g., support 10,000 concurrent users]
- **Security**: [e.g., PII encrypted at rest, auth required]
- **Availability**: [e.g., 99.9% uptime]

---

## 7. Success Metrics

| Metric | Baseline | Target | Timeframe |
|---|---|---|---|
| [Primary metric] | [Current] | [Goal] | 30 days post-launch |
| [Secondary metric] | [Current] | [Goal] | 90 days post-launch |

---

## 8. Dependencies

- [ ] [External team or system dependency] — Status: Pending | Confirmed
- [ ] [Infrastructure requirement] — Status: Pending | Confirmed

---

## 9. Risks & Mitigations

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| [Risk description] | High / Med / Low | High / Med / Low | [How we address it] |

---

## 10. Timeline

| Milestone | Target Date | Owner |
|---|---|---|
| PRD Approved | YYYY-MM-DD | [PM] |
| Technical Design Complete | YYYY-MM-DD | [Tech Lead] |
| Phase 1 Complete | YYYY-MM-DD | [Engineering] |
| Launch | YYYY-MM-DD | [PM + Eng] |

---

## 11. Open Questions

- [ ] [Question needing resolution before engineering starts] — Owner: [Name] — Due: YYYY-MM-DD
- [ ] [Another question] — Owner: [Name] — Due: YYYY-MM-DD

---

## Appendix

[Supporting research briefs, mockups, competitor analysis, or reference links]
