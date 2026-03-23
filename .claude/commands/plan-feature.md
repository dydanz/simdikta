Create a detailed, execution-ready development plan for a feature based on Product Research, PRD, and TRD using an evidence-based, code-aware, and engineering best-practice approach.

---

## Usage
/plan-feature [feature description or @path/to/trd.md]

If no description is provided, ask:
"What feature would you like to plan? Please describe what it should do and who it's for."

---

## Dependency Position

Product Research ✅ → PRD ✅ → TRD ✅ → [Plan] ← this command produces this

Upstream requirement: TRD must be Status: ✅ Up-to-date and all upstream documents must also be ✅ before this command can produce a Plan.

---

## Engineering Principles (MANDATORY)

All outputs MUST follow:

### Research-First Execution
- Do not plan from assumptions
- Ground decisions in PRD, TRD, and actual codebase state
- Validate feasibility against existing implementation

### Codebase Alignment
- Follow existing patterns, structure, and conventions
- Avoid introducing new patterns unless justified
- Prefer extending over rewriting

### Incremental Delivery
- Break work into small, testable phases (1–2 weeks max)
- Deliver value early
- De-risk early (tackle hardest problems first)

### Testability
- Every phase must include automated validation
- Define clear success criteria (automated + manual)

### Traceability
- Every task must map back to TRD components and PRD requirements
- No orphan tasks

### Explicitness
- Specify exact files, modules, and responsibilities
- Avoid vague instructions

---

## Execution Flow

### Step 0: Governance Check (MANDATORY)

Use the product-orchestrator agent to:

1. Locate the TRD — check .claude/thoughts/architecture/
2. Read the TRD header (first 6 lines)
3. Verify Status: ✅ Up-to-date
4. Follow dependency chain:
   TRD → PRD → Product Research
5. Verify all documents are Status: ✅ Up-to-date
6. If ANY upstream is ⚠️ or missing:



❌ Plan generation blocked:
[Document] is ⚠️ Needs Update.
Resolve the full dependency chain before running /plan-feature:
Product Research ✅ → PRD ✅ → TRD ✅



7. If all ✅: proceed and record TRD version

---

### Step 1: Understand the Scope

Clarify:

- Feature scope (backend, frontend, full-stack, infra)
- Affected bounded contexts (from TRD)
- Key use cases
- Constraints (performance, scale, deadlines)

If unclear, ask before proceeding.

---

### Step 2: Research the Codebase (MANDATORY)

Use:

- codebase-locator
- codebase-analyzer
- codebase-pattern-finder

Identify:

- Where this feature fits in the codebase
- Existing modules/services to extend
- Established patterns (API, domain, infra, frontend)
- Data models and schemas already in use
- Existing abstractions (repositories, services, handlers)
- Testing patterns
- Deployment/infrastructure patterns

Output internally:

- Relevant files and modules
- Reusable components
- Constraints imposed by current architecture

---

### Step 3: Map TRD to Implementation Units

Translate TRD into:

- Domain components (entities, aggregates)
- Application layer (use cases)
- Interfaces (API, UI)
- Infrastructure (DB, queues, external services)

Define:

- What needs to be created vs modified
- Boundaries of each component
- Dependencies between components

---

### Step 4: Identify Risks and Sequence Work

Before writing the plan:

- Identify the riskiest technical assumptions
- Identify unknowns in integration or scaling
- Prioritize early validation of high-risk areas

Define execution order:

1. Risk reduction
2. Core functionality
3. Extensions
4. Hardening (testing, performance, rollout)

---

### Step 5: Define Technical Approach

Outline:

- Data model changes
- API design integration
- Domain/application layering alignment
- Frontend integration points
- Infrastructure impact

Ensure:
- Alignment with TRD design
- Alignment with existing codebase patterns

---

### Step 6: Write the Implementation Plan

The Plan header MUST include:



Status: ✅ Up-to-date
Version: v1.0.0
Last Updated: YYYY-MM-DD
Depends On: TRD v<X.Y.Z> — <filename>



Save to:
.claude/thoughts/plans/YYYY-MM-DD-<feature-slug>.md

---

## Plan Structure (MANDATORY)

markdown
Status: ✅ Up-to-date
Version: v1.0.0
Last Updated: YYYY-MM-DD
Depends On: TRD v<X.Y.Z> — <filename>

# Plan: [Feature Name]

## References
PRD: [path]
TRD: [path]

## Summary
[2–3 sentences describing what will be built and why]

## Scope
[Clearly define what is included and excluded]

## Technical Approach
[Detailed explanation of how the system will be implemented]
[Reference existing patterns and codebase decisions]

## Architecture Mapping
- Domain Layer: [entities, aggregates]
- Application Layer: [use cases]
- Interface Layer: [APIs, UI]
- Infrastructure Layer: [DB, external systems]

## Implementation Phases

### Phase 1: [Name] — [Effort estimate]
Goal: [What this phase achieves]

Tasks:
- [ ] Task description (path/to/file.ext)
- [ ] Task description (path/to/file.ext)

Success Criteria (Automated):
- [commands that must pass]

Success Criteria (Manual):
- [manual validation steps]

Risks Addressed:
- [which risks are mitigated in this phase]

---

### Phase 2: [Name] — [Effort estimate]
...

---

## Files to Create
- path/to/new/file.ext — [purpose]

## Files to Modify
- path/to/existing/file.ext — [what changes and why]

## Data Changes
- Schema updates
- Migrations
- Backward compatibility considerations

## API Changes
- New endpoints
- Modified endpoints
- Versioning considerations

## Testing Strategy
- Unit tests (what to cover)
- Integration tests
- Contract/API tests
- E2E tests (if applicable)

## Rollout Plan
- Feature flags (if needed)
- Migration steps
- Deployment sequence
- Monitoring and alerting

## Risks and Mitigation
- [Risk]
  - Mitigation

## Open Questions
- [Question]
  - Owner
  - Due date


---

### Step 7: Save Document

Save to:
.claude/thoughts/plans/YYYY-MM-DD-<feature-slug>.md

---

### Step 8: Output Status Overview


## Document Status Overview

| Document         | Version | Status | Last Updated |
|------------------|---------|--------|--------------|
| Product Research | vX.X.X  | ✅      | YYYY-MM-DD  |
| PRD              | vX.X.X  | ✅      | YYYY-MM-DD  |
| TRD              | vX.X.X  | ✅      | YYYY-MM-DD  |
| Plan             | vX.X.X  | ✅      | YYYY-MM-DD  |


---

### Step 9: Review

Ask:

Does this plan:

* Align with the TRD and PRD?
* Follow existing codebase patterns?
* Break work into clear, executable steps?
* Address the highest risks early?

Any adjustments before implementation begins?

---

## Quality Standards

### Execution Readiness

* Plan must be directly actionable by engineers
* No ambiguity in tasks

### Granularity

* Tasks must be small enough to track via checkboxes
* Each task should produce a verifiable outcome

### Consistency

* Must align with TRD architecture decisions
* Must follow existing code patterns

### Completeness

* All layers covered (domain, application, interface, infrastructure)
* All phases include success criteria

---

## Prohibited Behavior

* Do not generate plans without validating upstream documents
* Do not ignore existing codebase patterns
* Do not produce vague or high-level plans
* Do not skip testing or rollout considerations
* Do not start implementation
* Do not omit risks or unknowns



