Review code for correctness, security, performance, and adherence to project patterns.

## Usage
/review-code [file path, diff, or PR description]

If no target is provided, ask: "What code would you like reviewed? Provide a file path or describe the change."

## Execution Flow

### Step 1: Locate and read the code
Read the specified file(s) fully. For a PR or diff, use `git diff` to see all changes.

### Step 2: Understand the context
Use `codebase-analyzer` to understand what the code is supposed to do and how it fits into the larger system.

### Step 3: Check patterns
Use `codebase-pattern-finder` to verify the code follows established project conventions.

### Step 4: Evaluate each dimension

**Correctness**
- Does the code do what it's supposed to do?
- Are edge cases handled (empty input, nil, zero values)?
- Are errors propagated correctly (no silent swallowing)?

**Security**
- Input validation at system boundaries
- No SQL injection, XSS, or command injection
- Secrets not hardcoded or logged
- Auth/authz checks in place for all endpoints

**Performance**
- N+1 queries?
- Unbounded memory growth?
- Missing database indexes for query patterns?
- Blocking operations in hot paths?

**Observability**
- Appropriate logging (not too verbose, not silent on important events)
- Errors produce actionable log lines with context
- New metrics added if adding a new operation

**Patterns**
- Follows established codebase conventions (use `codebase-pattern-finder` to verify)
- No re-inventing utilities that already exist
- Tests included and meaningful (not just happy path)

### Step 5: Write the review

```markdown
## Code Review: [File/Feature]

### Summary
[2-3 sentences. What does the code do and what is the overall assessment?]

### What's Good
- [Specific things done well, with citations]

### Must Fix (Blockers)
- **[Issue title]** (`file.go:line`) — [explanation and specific suggested fix]

### Should Fix (Important)
- **[Issue title]** (`file.go:line`) — [explanation and suggested fix]

### Consider (Minor)
- **[Suggestion]** — [explanation]

### Test Coverage
[Assessment: are the tests meaningful? What cases are missing?]
```

## Guidelines
- Every finding must cite a specific file:line reference
- Suggested fixes must be specific and actionable, not generic
- Always acknowledge what is done well — not just problems
- Security findings are always Blockers regardless of severity perception
- Do NOT suggest style changes that are purely preferential if the code follows existing conventions
