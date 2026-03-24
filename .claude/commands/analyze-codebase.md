````markdown
Analyze the codebase to understand the current state of code relevant to the given area or question, then write the findings as a structured engineering document.

## Usage
/analyze-codebase [area or question]

If no area is provided, ask:
"What area of the codebase would you like to analyze?"

---

## Purpose

Use this command to produce a codebase analysis document grounded in the repository itself. The goal is to first research the code, then synthesize the findings into a clear, evidence-based document that explains:

- what exists
- how it works
- how the pieces relate
- what patterns are already established
- what gaps, inconsistencies, or risks are present

Do not invent architecture or behavior. Base every statement on repository evidence.

---

## Execution Flow

### Step 1: Define the scope

Load project context first (Simdikta guardrails):
- `context/project/architecture.md`
- `context/project/data-safety.md`
- `context/project/domain-lexicon.md`
- `context/project/frontend-principles.md`
- `context/project/backend-principles.md`

Clarify the target area or question if needed.

Examples:
- a feature area
- a module or package
- a specific workflow
- a business capability
- a subsystem
- an integration point
- a cross-cutting concern such as auth, logging, caching, testing, or error handling

If the request is too broad, narrow it to the most relevant slice of the codebase and state that scope explicitly in the final document.

---

### Step 2: Locate relevant code

Use the `codebase-locator` agent to find the most relevant files, directories, tests, configs, and documentation related to the requested area.

Collect:
- implementation files
- tests
- interfaces/contracts
- configuration
- related docs
- feature flags or migrations if applicable

If multiple implementations exist, include all of them.

---

### Step 3: Research the codebase deeply

Use the `codebase-analyzer` agent to understand:

- what the code actually does
- how data flows through the system
- how control flow moves across modules
- where state is stored and transformed
- how errors are handled
- what external services or frameworks are involved
- what assumptions the code makes
- what is synchronous vs asynchronous
- what is domain logic vs infrastructure logic

Use the `codebase-pattern-finder` agent to identify:

- established patterns in the area
- naming conventions
- layering conventions
- dependency direction
- common abstractions
- repeated implementation strategies
- testing style
- error handling style
- validation style
- API or event conventions

Treat this as research, not summary. Verify behavior from code, tests, and adjacent files before writing conclusions.

---

### Step 4: Capture evidence

For every important claim, record supporting evidence with file and line references.

Use citations in the form:
- `path/to/file.ext:line`
- `path/to/file.ext:line-line`

Rules:
- Every nontrivial claim must have evidence.
- Prefer primary implementation files over comments or stale docs.
- Prefer tests where they demonstrate intended behavior.
- If evidence is incomplete or ambiguous, say so plainly.

---

### Step 5: Synthesize the findings

Write the analysis only after the research phase is complete.

Do not:
- propose changes unless explicitly asked
- recommend refactors unless explicitly asked
- speculate beyond the evidence
- hide uncertainty

Do:
- separate facts from interpretation
- call out contradictions
- highlight missing pieces
- identify multiple implementations if they exist
- note when the area does not exist yet

---

## Output Requirements

Produce a document in Markdown with the following structure:

```markdown
# Codebase Analysis: <Area>

## Scope
[State exactly what was analyzed and any boundaries of the analysis.]

## What exists
[Summarize the relevant code that exists for this area.]

## How it works
[Explain the runtime flow, key objects, data flow, and component interactions.]
[Every claim must cite file:line evidence.]

## Established patterns
[Describe patterns already used in this part of the codebase that should be understood when working here.]
[Every claim must cite file:line evidence.]

## Key files
| File | Purpose | Evidence |
|---|---|---|
| ... | ... | ... |

## Observations
[Note inconsistencies, edge cases, missing coverage, duplicate implementations, or unclear behavior.]
[Keep this evidence-based.]

## Gaps or unknowns
[State what could not be verified from the current codebase.]

## Simdikta guardrails checklist (must include)
- Multi-tenant `school_id` scoping present?
- Audit log inserted before any applicant status change?
- NIK/KK masked and encrypted? (no raw values in handlers/services)
- Clean Architecture boundaries respected (no handler→repository, no domain importing internal packages)?
````

---

## Quality Standards

### Evidence discipline

* Cite every important claim.
* Use file:line references for all conclusions.
* If a claim is inferred, label it as an inference.

### Technical accuracy

* Explain behavior in terms of actual code paths.
* Distinguish interface, implementation, and tests.
* Distinguish current behavior from intended behavior when they differ.

### Completeness

* Include all relevant implementations if there are several.
* Include relevant tests if they clarify intended behavior.
* Include configs or generated artifacts only if they materially affect the area.

### Clarity

* Use direct, plain language.
* Keep the document readable for engineers.
* Prefer concrete descriptions over abstract wording.

---

## Special Rules

* If the area does not exist yet, say that clearly.
* If multiple implementations exist, list each one and explain how they differ.
* If the code has partial implementation, say what is missing.
* If the repository contains conflicting patterns, document the conflict instead of resolving it.
* Do not make recommendations unless explicitly asked.
* Do not produce a design proposal in this command.
* Do not mention implementation plans unless explicitly asked.

---

## Final Output Behavior

Return only the completed Markdown analysis document.

If the user asked a question rather than an area name, answer the question through codebase analysis and structure the result in the same document format.

```
```
