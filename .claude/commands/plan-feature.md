Create a detailed technical implementation plan for a feature.

## Usage
/plan-feature [feature description]

If no description is provided, ask: "What feature would you like to plan? Please describe what it should do and who it's for."

## Execution Flow

### Step 1: Understand the request
Clarify if needed:
- What is the feature?
- Is there an existing PRD or technical design? If so, read it.
- What is the scope: backend only, frontend only, or full-stack?

### Step 2: Research the codebase
Use `codebase-locator` and `codebase-analyzer` to understand where this feature fits:
- What existing code is related?
- What patterns should the new code follow?
- What dependencies are already in place?

Use `codebase-pattern-finder` to find the canonical patterns to follow.

### Step 3: Design the technical approach
Based on research, outline:
- Data model changes (if any)
- API changes (if any)
- Frontend changes (if any)
- Testing approach

Present the high-level approach and ask for feedback before writing the detailed plan.

### Step 4: Write the implementation plan
Save to: `.claude/thoughts/plans/YYYY-MM-DD-<feature-slug>.md`

```markdown
# Plan: [Feature Name]
**Date**: YYYY-MM-DD
**Status**: Draft

## Summary
[2-3 sentences describing what will be built]

## Approach
[Technical approach with rationale for key decisions]

## Implementation Phases

### Phase 1: [Name] — [Effort estimate]
**Tasks**:
- [ ] Task 1 (`path/to/file.go`)
- [ ] Task 2 (`path/to/component.tsx`)

**Success Criteria (Automated)**:
- `go test ./...` passes
- `npm run build` passes

**Success Criteria (Manual)**:
- [What to verify manually]

### Phase 2: [Name]
...

## Files to Create
- `path/to/new/file.go` — [purpose]

## Files to Modify
- `path/to/existing/file.go` — [what changes and why]

## Risks
- [Risk and mitigation]
```

### Step 5: Review with user
Present the plan. Ask: "Does this plan look correct? Any adjustments before implementation?"

## Guidelines
- Do NOT start implementing until the plan is approved
- Tasks must be granular enough to track progress via checkboxes
- Every phase must have automated success criteria (runnable commands)
- Plans reference the PRD or technical design doc if one exists
