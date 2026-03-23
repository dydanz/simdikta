Run the test suite and analyze results.

## Usage
/run-tests [scope: all | backend | frontend | integration | e2e]

Default scope: all

## Execution Flow

### Step 1: Determine scope

**all** — Run everything sequentially
**backend** — Go unit tests only
**frontend** — Next.js tests only
**integration** — Go integration tests (requires Docker)
**e2e** — Playwright end-to-end tests

### Step 2: Run the appropriate commands

**Backend (Go unit tests)**:
```bash
go test ./... -race -coverprofile=coverage.out -timeout 60s
go tool cover -func coverage.out | grep total
```

**Frontend (Next.js)**:
```bash
npm run test -- --coverage --watchAll=false
```

**Integration tests**:
```bash
go test ./... -tags integration -race -timeout 120s
```

**E2E (Playwright)**:
```bash
npx playwright test
```

### Step 3: Analyze results

If all tests pass:
- Report coverage percentages
- Flag any packages below 70% coverage

If tests fail:
1. Read the failure message and stack trace carefully
2. Use `codebase-locator` to find the failing test file
3. Use `codebase-analyzer` to understand what the test is asserting
4. Determine: is this a test bug (wrong expectation) or an implementation bug (code is wrong)?
5. Do NOT immediately fix — present the analysis first

### Step 4: Report

```markdown
## Test Results — [Scope] — [Date]

### Summary
| Suite | Total | Passed | Failed | Skipped | Coverage |
|---|---|---|---|---|---|
| Backend | X | X | X | X | X% |
| Frontend | X | X | X | X | X% |

### Failing Tests
| Test Name | File | Error |
|---|---|---|
| TestFoo_Bar | path/to/file_test.go:42 | [error message] |

### Root Cause Analysis
[For each failure: what is actually wrong and recommended fix]

### Coverage Report
[Coverage by package; highlight anything below 70%]

### Recommendations
[Any flaky tests to quarantine, coverage gaps to address]
```

## Guidelines
- Always run with `-race` flag for Go tests — data races are bugs
- Coverage below 70% on new code must be flagged
- Identify flaky tests (pass/fail inconsistently) — quarantine, don't ignore
- After analysis, confirm with user before auto-fixing failures
