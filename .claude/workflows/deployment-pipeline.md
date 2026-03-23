# Workflow: Deployment Pipeline

From merged code to running in production.

---

## Trigger: Merge to main

### Automatic steps (CI/CD):
1. GitHub Actions runs the CI pipeline
2. Tests: `go test ./... -race`, `npm test`, lint checks
3. Security scan: Trivy, Gitleaks, CodeQL
4. Docker images built and tagged:
   - `registry/app:sha-{commit}` (immutable, used for deployment)
   - `registry/app:latest` (convenience, points to last build)
5. Images pushed to container registry
6. Automatic deployment to **staging**

### Staging validation:
- Smoke tests run automatically against staging
- If smoke tests fail → pipeline halts, alert sent, staging is NOT updated to broken state
- If smoke tests pass → staging is ready for validation

---

## Deploy to Production

### Pre-conditions
- [ ] Staging deployment successful and smoke tests pass
- [ ] Feature validated on staging by PM or QA
- [ ] No P0 alerts currently firing in production
- [ ] Runbook exists for any new operational concerns

### Steps
1. Trigger production deploy in GitHub Actions (requires manual approval)
2. Rolling deployment begins (`maxUnavailable: 0` — zero downtime)
3. Monitor error rate and latency during rollout
4. Rollout completes when all pods are updated and healthy

### Automatic Rollback Triggers
If within 10 minutes of production deploy:
- Error rate increases > 2% above pre-deploy baseline
- P99 latency increases > 50% above pre-deploy baseline
- Health check failures on any pod

### Manual Rollback (Kubernetes)
```bash
# Roll back to previous deployment
kubectl rollout undo deployment/api -n app
kubectl rollout undo deployment/frontend -n app

# Verify rollback
kubectl rollout status deployment/api -n app
kubectl rollout status deployment/frontend -n app
```

---

## Post-Deployment Checklist
- [ ] Monitor error rate dashboard for 30 minutes
- [ ] Monitor P99 latency dashboard for 30 minutes
- [ ] Verify primary user flows work in production
- [ ] Update deployment log: date, version tag, what changed, who deployed
- [ ] Close related issues and tickets
- [ ] Enable feature flag (if using gradual rollout)

---

## Emergency Hotfix Process (P0 Bug in Production)

1. **Assess impact**: Users affected? Data corrupted? Security breach?
2. **Communicate**: Alert on-call and stakeholders before fixing
3. **Branch**: `git checkout -b hotfix/<issue-slug> main`
4. **Minimal fix**: Fix only the bug — no other changes in the same commit
5. **Fast-track CI**: Full test suite still runs — never skip
6. **Deploy**: Staging validate (abbreviated) → production
7. **Post-mortem**: Written within 48 hours — what happened, why, how we prevent recurrence

---

## Deployment Log Format

```markdown
## Deploy — YYYY-MM-DD HH:MM UTC

**Version**: `sha-abc1234`
**Environment**: Production
**Deployed by**: [Name]
**PR**: [Link]

### Changes
- [Summary of what changed]

### Outcome
- Deployment: Success | Rolled back
- Error rate: [before] → [after]
- P99 latency: [before] → [after]

### Notes
[Anything unusual observed]
```
