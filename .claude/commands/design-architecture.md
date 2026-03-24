```markdown
Design the technical architecture for a feature or system change using Domain-Driven Design (DDD) and Clean Architecture principles.

---

## Usage
/design-architecture [feature description or @path/to/prd.md]

---

## Dependency Position

Product Research ✅ → PRD ✅ → [TRD] ← this command produces this

Upstream requirement: PRD must be `Status: ✅ Up-to-date` (and Product Research must also be ✅) before this command can produce a TRD.

---

## Engineering Principles (MANDATORY)

All outputs MUST follow:

### Domain-Driven Design (DDD)
- Explicit domain modeling (Entities, Value Objects, Aggregates)
- Bounded Context identification
- Ubiquitous Language aligned with PRD
- Clear separation of domain vs infrastructure concerns

### Clean Architecture
- Strict layer separation:
  - Domain (core business logic)
  - Application (use cases)
  - Interface (controllers, UI)
  - Infrastructure (DB, external systems)
- Dependency rule: dependencies point inward (toward domain)
- Frameworks and tools are implementation details

### General Best Practices
- Design for change (extensibility over premature optimization)
- Prefer explicitness over magic
- Minimize coupling, maximize cohesion
- Avoid anemic domain models
- Design for observability and failure handling from the start

---

## Execution Flow

### Step 0: Governance Check (MANDATORY)

Use the `product-orchestrator` agent to:

1. Locate the PRD — check `.claude/thoughts/product/` for relevant files
2. Read the PRD document header (first 6 lines)
3. Verify `Status: ✅ Up-to-date`
4. Read the PRD's `Depends On` field → locate and read the research document header
5. Verify research `Status: ✅ Up-to-date`
6. If ANY upstream is ⚠️ or missing:

```

❌ TRD generation blocked:
[Document] is ⚠️ Needs Update.
Resolve the full upstream chain (Research ✅ → PRD ✅) before running /design-architecture.

```

7. If all ✅: proceed. Note PRD version for TRD header.

---

### Step 1: Read and Extract Domain

If a PRD path is provided, read it fully. If not, locate the most recent PRD.

Then extract:

- Core domain concepts (nouns → Entities / Value Objects)
- Business rules (invariants, constraints)
- User actions (→ Use Cases)
- Domain events (if applicable)

Output internally:

- Candidate Entities
- Candidate Value Objects
- Aggregates
- Domain Services
- Ubiquitous Language glossary

---

### Step 2: Define Bounded Contexts

- Identify logical boundaries in the system
- Group related domain concepts into Bounded Contexts
- Define relationships:
  - Upstream / downstream
  - Shared kernel / anti-corruption layer (if needed)

---

### Step 3: Analyze Existing Architecture

Use `codebase-analyzer` to understand:

- Existing domain boundaries (if any)
- Current architectural patterns
- Reusable modules/services
- Violations of clean architecture (if present)

Decide:
- Extend existing context vs introduce new one

---

### Step 3.5: Load project guardrails (MANDATORY)
- Read `context/project/architecture.md`, `backend-principles.md`, `data-safety.md`, `regulation.md`, and `domain-lexicon.md`.
- Enforce multi-tenant rules (school_id first, SQL WHERE school_id = $1), audit-log-before-status-change, NIK/KK masking + encryption, Clean Architecture boundaries, and selection engine risk-first approach.

---

### Step 4: Design Using Clean Architecture Layers

For EACH bounded context, define:

#### Domain Layer
- Entities
- Value Objects
- Aggregates
- Domain Services
- Domain Events

#### Application Layer
- Use Cases (command/query separation preferred)
- Input/Output models (DTOs)
- Interfaces (ports)

#### Interface Layer
- Controllers / handlers
- API contracts
- UI interaction points

#### Infrastructure Layer
- Repository implementations
- External integrations
- Messaging / queues
- Persistence details

---

### Step 5: Engage Specialist Agents

Based on scope:

- `frontend-architect` — UI, state, interaction boundaries
- `go-architect` — domain + application layer design
- `terraform-architect` — infra provisioning
- `kubernetes-architect` — deployment/scaling

Ensure ALL outputs respect:
- DDD boundaries
- Clean Architecture layering

---

### Step 6: Write the TRD

Use the `tech-lead-architect` agent to produce the TRD.
Save to: `.Codex/thoughts/architecture/YYYY-MM-DD-<feature-slug>-design.md`.

---

## TRD Structure (MANDATORY)

### Header
```

Status: ✅ Up-to-date
Version: v1.0.0
Last Updated: YYYY-MM-DD
Depends On: PRD v<X.Y.Z> — <filename>

```

---

### 1. Overview
- Problem summary
- High-level solution
- Key design decisions

---

### 2. Domain Model (DDD)

#### Ubiquitous Language
- Define key terms clearly

#### Entities
- Name, attributes, identity rules

#### Value Objects
- Immutable concepts

#### Aggregates
- Aggregate roots
- Consistency boundaries

#### Domain Services
- Business logic not fitting entities

#### Domain Events (if applicable)
- Event definitions and triggers

---

### 3. Bounded Contexts
- Context definitions
- Responsibilities
- Interaction between contexts

---

### 4. Architecture Overview (Clean Architecture)

- Layered diagram (textual)
- Dependency direction
- Boundaries enforcement

---

### 5. Application Layer Design

- Use Cases (step-by-step flows)
- Command / Query separation
- Validation rules

---

### 6. Data Model

- Tables / collections
- Relationships
- Mapping to aggregates

---

### 7. API Design

For EACH endpoint:

```

POST /example

Request:
{
...
}

Response:
{
...
}

```

- Include validation rules
- Error handling format

---

### 8. Frontend Design

- Components / pages
- State management approach
- Interaction with backend
- Mapping to use cases

---

### 9. Infrastructure Design

- Database
- Messaging systems
- External services
- Deployment considerations

---

### 10. Alternatives & Trade-offs

Provide at least 2–3 options:

For each:
- Description
- Pros
- Cons
- Why rejected

Clearly recommend ONE approach.

---

### 11. Risks & Assumptions

- Identify riskiest assumption
- Define mitigation strategy
- Define validation plan

---

### 12. Implementation Plan

Break into 1–2 week phases:

Phase format:
- Goal
- Scope
- Deliverables
- Risk addressed

Prioritize:
- Highest risk first

---

### 13. Testing Strategy

- Unit tests (domain logic)
- Integration tests
- Contract/API tests
- E2E tests (if needed)

---

### 14. Rollout Plan

- Feature flags (if applicable)
- Migration steps
- Backward compatibility
- Monitoring

---

### Step 7: Save Document

Save to:
`.claude/thoughts/architecture/YYYY-MM-DD-<feature-slug>-design.md`

---

### Step 8: Cascade Status

After saving:

- Set Plan header `Status: ⚠️ Needs Update` (if Plan exists)
- Do NOT modify Plan content

---

### Step 9: Output Status Overview

```

## Document Status Overview

| Document         | Version | Status | Last Updated |
| ---------------- | ------- | ------ | ------------ |
| Product Research | vX.X.X  | ✅      | YYYY-MM-DD   |
| PRD              | vX.X.X  | ✅      | YYYY-MM-DD   |
| TRD              | vX.X.X  | ✅      | YYYY-MM-DD   |
| Plan             | vX.X.X  | ⚠️     | YYYY-MM-DD   |

```

---

### Step 10: Validate

Ask:

Does this design:
- Correctly reflect the domain?
- Respect DDD boundaries?
- Follow clean architecture principles?
- Meet all PRD requirements?

Any concerns before implementation planning begins?
```
