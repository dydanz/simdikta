Analyze the codebase to understand the current state of code relevant to the given area or question.

## Usage
/analyze-codebase [area or question]

If no area is provided, ask: "What area of the codebase would you like to analyze?"

## Execution Flow

### Step 1: Locate relevant code
Use the `codebase-locator` agent to find files related to the area of interest.

### Step 2: Analyze implementation
Use the `codebase-analyzer` agent to deeply understand what the code does, how it works, and how components relate to each other.

### Step 3: Find patterns
Use the `codebase-pattern-finder` agent to identify established patterns in the relevant area.

### Step 4: Synthesize and present

```markdown
## Codebase Analysis: <Area>

### What exists
[Summary of what code exists for this area]

### How it works
[Data flow and key components, with file:line citations]

### Established patterns
[Patterns to follow when extending this area]

### Key files
| File | Purpose |
|---|---|

### Observations
[Anything notable, inconsistent, or worth flagging]
```

## Guidelines
- Always cite file:line for every claim
- Do NOT make recommendations unless explicitly asked
- If the area does not exist yet, say so clearly — that is useful information
- If there are multiple implementations, surface all of them
