Generate a Product Requirements Document for a new feature.

## Usage
/generate-prd [feature idea]

If no feature is provided, ask: "What feature would you like to document? Please describe the problem it solves and who it's for."

## Execution Flow

### Step 1: Gather context
Clarify:
- What is the feature or product?
- Who is the target user?
- What problem does it solve?
- Is there prior research or context to incorporate?
- What is the business priority?

### Step 2: Research (if needed)
If the feature is new or needs market validation, use the `product-research` agent to:
- Validate the problem
- Understand competitor approaches
- Gather user signal

### Step 3: Draft the PRD
Use the `product-manager` agent to generate a complete PRD.

### Step 4: Save the PRD
Save to: `.claude/thoughts/product/YYYY-MM-DD-<feature-slug>-prd.md`

### Step 5: Review
Present the PRD and ask: "Does this accurately capture the requirements? What should be adjusted?"

## Output
A complete PRD with:
- Problem statement with evidence
- Goals and non-goals
- User stories with Given/When/Then acceptance criteria (P0/P1/P2)
- Measurable success metrics
- Risks and dependencies
- Open questions with owners

## Guidelines
- Success metrics must be specific and measurable
- Non-goals must be explicit — at least 2 items
- User stories use Given/When/Then format
- Every open question needs an owner and a due date
