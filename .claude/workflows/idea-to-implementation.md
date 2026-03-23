# Workflow: Idea → Implementation

This workflow guides a feature from initial concept through shipped code. Follow it in order — skipping stages leads to rework.

## Pipeline

```
Idea → Research → PRD → Technical Design → Implementation Plan → Build → Test → Review → Ship
```

---

## Stage 1: Research
**Command**: `/generate-prd` (triggers research step automatically)
**Agent**: `product-research`
**Output**: Research brief saved to `.claude/thoughts/product/research-<slug>.md`

**Done when**: Problem is validated with evidence, competitors understood, key risks identified.

---

## Stage 2: PRD
**Command**: `/generate-prd`
**Agent**: `product-manager`
**Output**: PRD at `.claude/thoughts/product/YYYY-MM-DD-<slug>-prd.md`

**Done when**: Goals, non-goals, P0 user stories with acceptance criteria, and success metrics are approved by stakeholders.

---

## Stage 3: Technical Design
**Command**: `/design-architecture [prd-path]`
**Agents**: `tech-lead-architect`, `go-architect`, `frontend-architect` (as needed)
**Output**: Technical design at `.claude/thoughts/architecture/YYYY-MM-DD-<slug>-design.md`

**Done when**: Architecture approved. All P0 open questions resolved. Alternatives documented.

---

## Stage 4: Implementation Plan
**Command**: `/plan-feature [feature description or design-path]`
**Agents**: `codebase-analyzer`, `codebase-pattern-finder`
**Output**: Plan at `.claude/thoughts/plans/YYYY-MM-DD-<slug>.md`

**Done when**: Plan reviewed and approved. Each task has a file:line reference. Automated success criteria are defined.

---

## Stage 5: Build
Execute the implementation plan phase by phase.

**For each phase**:
1. Implement the tasks
2. Run automated success criteria (as defined in the plan)
3. Check off completed tasks `[x]` in the plan file
4. Review the phase before moving forward

---

## Stage 6: Test
**Command**: `/run-tests`
**Done when**: All automated tests pass, coverage meets threshold, E2E covers the primary user journey.

---

## Stage 7: Review
**Command**: `/review-code`
**Done when**: No blocking findings. Security review complete.

---

## Stage 8: Ship
1. Merge to main (CI must pass)
2. Staging deploy (automatic via CI/CD)
3. Validate on staging (PM or QA sign-off)
4. Production deploy (manual approval gate)
5. Monitor dashboards for 30 minutes post-deploy
6. Mark success metrics baseline

---

## Artifacts Produced

| Stage | Location |
|---|---|
| Research brief | `.claude/thoughts/product/research-*.md` |
| PRD | `.claude/thoughts/product/*-prd.md` |
| Technical design | `.claude/thoughts/architecture/*-design.md` |
| Implementation plan | `.claude/thoughts/plans/*.md` |
