Generate a Product Requirements Document (PRD) for a new feature using a research-first, evidence-based approach and structured product thinking.

---

## Usage
/generate-prd [feature idea or @path/to/research-file.md]

If no feature is provided, ask:
"What feature would you like to document? Please describe the problem it solves and who it's for."

---

## Dependency Position

Product Research → [PRD] ← this command produces this

Upstream requirement: Product Research must be `Status: ✅ Up-to-date` before this command can produce a PRD.

---

## Product Principles (MANDATORY)

All outputs MUST follow:

### Research-Driven Development
- Every requirement must trace back to user or business evidence
- Avoid assumptions without validation
- Clearly separate facts vs hypotheses

### Problem-First Thinking
- Define the problem before proposing solutions
- Avoid jumping into features without context

### User-Centric Design
- Focus on user outcomes, not system behavior
- Capture real user workflows and pain points

### Clarity and Testability
- Requirements must be unambiguous
- Every requirement must be testable
- Avoid vague language (e.g., “fast”, “intuitive”) without definition

### Scope Discipline
- Explicitly define what is NOT included
- Prevent scope creep at PRD level

---

## Execution Flow

### Step 0: Governance Check (MANDATORY)

Use the `product-orchestrator` agent to:

1. Locate the research document — check `.claude/thoughts/product/` or `docs/product-research/`
2. Read the document header (first 6 lines)
3. Verify `Status: ✅ Up-to-date`
4. If status is ⚠️ or missing:

```

❌ PRD generation blocked:
Product Research is ⚠️ Needs Update (or missing).
Run the research step first, or provide a research document via @path argument.

```

5. If ✅: proceed and note the research version for PRD header

---

### Step 1: Extract and Validate Context

From the research document, extract:

- Problem definition
- Target users / personas
- Key user pain points
- Evidence (qualitative + quantitative)
- Existing solutions / competitors
- Identified gaps and opportunities

If any of the above are missing or weak:
- Use `product-research` agent to fill gaps
- Do not proceed until research is sufficient and marked ✅

---

### Step 2: Define Product Intent

Clarify internally:

- What exact outcome are we trying to achieve?
- What user behavior should change?
- What business objective does this support?
- What constraints exist (time, tech, org)?

Translate research into:

- Clear problem statement
- Measurable goals
- Explicit hypotheses (if applicable)

---

### Step 3: Derive Requirements (Thinking Phase)

Before writing the PRD, derive:

#### User Flows
- Step-by-step interaction paths
- Entry → action → outcome

#### Core Capabilities
- What must the system enable users to do

#### Edge Cases
- Failure modes
- Boundary conditions

#### Prioritization
- P0: must-have
- P1: important
- P2: nice-to-have

Ensure:
- Each requirement maps to a user need
- No orphan features without justification

---

### Step 4: Draft the PRD

Use the `product-manager` agent to generate the PRD.

---

## PRD Structure (MANDATORY)

### Header
```

Status: ✅ Up-to-date
Version: v1.0.0
Last Updated: YYYY-MM-DD
Depends On: Product Research v<X.Y.Z> — <filename>

```

---

### 1. Overview
- Feature summary
- Context and background
- Business motivation

---

### 2. Problem Statement (WITH EVIDENCE)
- Clear description of the problem
- Who experiences it
- Why it matters
- Supporting evidence from research

---

### 3. Goals and Success Metrics

#### Goals
- Specific, outcome-oriented

#### Success Metrics
- Quantifiable (e.g., % improvement, latency, conversion)
- Include baseline if known

---

### 4. Non-Goals
- Explicitly list at least 2 items
- Clarify boundaries of this feature

---

### 5. Target Users / Personas
- Who the feature is for
- Relevant characteristics
- Context of use

---

### 6. User Stories and Acceptance Criteria

For each story:

Priority: P0 / P1 / P2

```

Given [context]
When [action]
Then [expected outcome]

```

Include:
- Happy path
- Edge cases where relevant

---

### 7. Functional Requirements

- System capabilities required
- Clearly defined behavior
- Mapped to user stories

---

### 8. Non-Functional Requirements

Include where applicable:
- Performance (e.g., latency, throughput)
- Reliability (SLAs, retries)
- Security (auth, data protection)
- Scalability expectations
- Observability (logs, metrics)

---

### 9. User Flow / Journey

- Step-by-step flow
- Can be written or structured
- Must align with user stories

---

### 10. Dependencies

- Upstream systems
- External services
- Internal teams
- Data dependencies

---

### 11. Risks and Assumptions

#### Risks
- What could go wrong
- Impact and likelihood

#### Assumptions
- What is assumed to be true but not yet validated

---

### 12. Open Questions

For each:

- Question
- Owner
- Due date

---

### 13. Out of Scope (Reinforcement)
- Reiterate boundaries if needed
- Prevent misinterpretation

---

## Step 5: Save the PRD

Save to:
`.claude/thoughts/product/YYYY-MM-DD-<feature-slug>-prd.md`

---

## Step 6: Cascade Status

After saving:

- Set TRD header `Status: ⚠️ Needs Update` (if TRD exists)
- Set Plan header `Status: ⚠️ Needs Update` (if Plan exists)
- Do NOT modify TRD or Plan content

---

## Step 7: Output Status Overview

```

## Document Status Overview

| Document         | Version | Status | Last Updated |
| ---------------- | ------- | ------ | ------------ |
| Product Research | vX.X.X  | ✅      | YYYY-MM-DD   |
| PRD              | vX.X.X  | ✅      | YYYY-MM-DD   |
| TRD              | vX.X.X  | ⚠️     | YYYY-MM-DD   |
| Plan             | vX.X.X  | ⚠️     | YYYY-MM-DD   |

```

---

## Step 8: Review

Ask:

Does this PRD:
- Clearly define the problem with evidence?
- Specify measurable success metrics?
- Provide unambiguous, testable requirements?
- Maintain strict scope boundaries?

What should be adjusted before moving to technical design?

---

## Output Requirements

Return a complete PRD document only.

---

## Quality Standards

### Evidence Integrity
- Every problem statement must be backed by research
- Do not invent user needs

### Requirement Quality
- Must be testable and specific
- Avoid ambiguity

### Prioritization Clarity
- Every feature must have a priority (P0/P1/P2)

### Consistency
- Terminology must match research (ubiquitous language)

### Completeness
- No missing sections
- No placeholder content

---

## Prohibited Behavior

- Do not skip research validation
- Do not generate vague or generic PRDs
- Do not mix technical implementation details into PRD
- Do not assume requirements without evidence
- Do not output partial documents
```
