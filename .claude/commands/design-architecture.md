Design the technical architecture for a feature or system change.

## Usage
/design-architecture [feature description or PRD path]

## Execution Flow

### Step 1: Read the spec
If a PRD path is provided, read it fully. If not, ask for the feature description or clarify requirements.

### Step 2: Analyze the existing architecture
Use `codebase-analyzer` to understand:
- How similar features are currently structured
- What patterns are established in the codebase
- What shared infrastructure already exists

### Step 3: Engage specialist agents
Based on the scope of the feature:
- `frontend-architect` — for UI, routing, component, and state decisions
- `go-architect` — for backend service and domain design
- `terraform-architect` — for any new infrastructure needs
- `kubernetes-architect` — for deployment and scaling design

### Step 4: Write the Technical Design Document
Use the `tech-lead-architect` agent to produce a complete TDD.

Save to: `.claude/thoughts/architecture/YYYY-MM-DD-<feature-slug>-design.md`

### Step 5: Present alternatives
Present 2-3 alternative approaches with trade-offs. Recommend one with clear rationale.

### Step 6: Validate
Ask: "Does this design meet the requirements? Any concerns before implementation planning begins?"

## Output
A complete Technical Design Document with:
- Architecture overview
- Data model changes
- API design with examples
- Frontend changes
- Implementation phases (1-2 week slices)
- Risk assessment
- Testing and rollout plan

## Guidelines
- Always document at least 2 alternatives and why they were rejected
- The riskiest assumption must be identified and addressed first in the implementation plan
- Get explicit approval before implementation begins
- Every API endpoint needs a request/response example
