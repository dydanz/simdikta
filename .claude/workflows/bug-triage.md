# Workflow: Bug Triage & Fix

Systematic approach to diagnosing and fixing bugs without guessing.

## The Golden Rule
Fix the root cause, not the symptom. A symptom fix that masks the root cause will resurface — usually at a worse time.

---

## Step 1: Reproduce
Before writing a single line of fix code, reproduce the bug reliably.
- What are the exact steps?
- What environment? (local, staging, production)
- What is the actual behavior vs expected behavior?
- Is it consistent or intermittent?

**Write a failing test that captures the bug.** This test becomes your fix verification and regression guard.

---

## Step 2: Locate
```
/analyze-codebase [area where the bug occurs]
```

Trace the execution:
1. Where does the request/action enter the system?
2. Follow the data flow step by step
3. Where does actual behavior diverge from expected?

Use `codebase-locator` to find the relevant files. Use `codebase-analyzer` to trace the flow with file:line references.

---

## Step 3: Root Cause
Distinguish clearly:
- **Symptom**: What the user sees (`500 error on checkout`)
- **Root cause**: The actual bug (`nil pointer when cart has 0 items`)

Do not fix the symptom. Fix the root cause.

Document before fixing:
```markdown
**Symptom**: [What the user experiences]
**Root Cause**: `path/to/file.go:42` — [explanation of what is wrong]
**Why it fails**: [the incorrect assumption or logic]
**Fix**: [what needs to change]
```

---

## Step 4: Fix
Write the minimal change that fixes the root cause:
- Do NOT refactor surrounding code unless it is part of the bug
- Do NOT add unrelated improvements in the same commit
- One fix, one commit — makes it easy to revert if needed

---

## Step 5: Verify
```
/run-tests
```

Confirm:
- The failing test from Step 1 now passes
- No other tests regressed
- Test manually in the exact scenario that triggered the bug

---

## Step 6: Document
If the bug reveals a systemic issue:
- Add a comment explaining the invariant that was violated
- Add tests that guard against similar bugs in related code paths
- If it could happen elsewhere, search and fix proactively

---

## Bug Severity Classification

| Severity | Criteria | Response Time |
|---|---|---|
| P0 — Critical | Data loss, security breach, all users blocked | Fix immediately, bypass PR process if needed |
| P1 — High | Significant user impact, core feature broken | Fix within 24 hours |
| P2 — Medium | Non-critical feature broken, workaround exists | Fix within 1 sprint |
| P3 — Low | Cosmetic, minor inconvenience | Backlog |

## Bug Report Format

```markdown
**Bug**: [One-line summary]
**Severity**: P0 | P1 | P2 | P3
**Environment**: local | staging | production

**Steps to Reproduce**:
1. ...
2. ...
3. ...

**Expected**: [What should happen]
**Actual**: [What actually happens]

**Root Cause**: `path/to/file.go:line` — [explanation]
**Fix**: [Description of the change]
**Test Added**: `TestFoo_Bar` in `path/to/file_test.go`
```
