# Project Overview — Simdikta

Last updated: 2026-03-23

## What is Simdikta?
- Multi-tenant SaaS for Indonesian school management.
- First module: PPDB/SPMB (new student enrollment) aligned with Permendikdasmen No. 3/2025.
- Primary users: school admins, verification operators, principals, parents, and applicants.
- Data residency: ap-southeast-3 (Jakarta) for all citizen data.

## Core Architecture (see `architecture.md` for details)
- Modular monolith with strict Clean Architecture boundaries (domain → application → interface → infrastructure).
- Bounded contexts: registration, verification, selection, payment, notification.
- Multi-tenant safety: every repository call scopes by `school_id` (first parameter) — no cross-tenant queries.

## Tech Stack (high level)
- Backend: Go 1.24+, chi, pgx/PostgreSQL 16, Redis 7.
- Frontend: Next.js 15 App Router, TypeScript, TanStack Query, Zustand, React Hook Form + Zod.
- Storage: S3-compatible, uploads via presigned URL.
- Notifications: WhatsApp Business API primary; SMS fallback.
- Payments: Midtrans or Xendit (VA, QRIS, manual transfer).

## Non-negotiable guardrails
- Clean Architecture dependency rule; no business logic in handlers.
- NIK/KK encrypted at rest (AES-256-GCM) and masked in any response.
- `ppdb_audit_logs` is append-only; every status change logs first, then updates status.
- All multi-tenant queries must include `WHERE school_id = $1` (explicit parameter in repositories).

## Quick links
- `architecture.md` — boundaries and layer rules
- `domain-lexicon.md` — ubiquitous language
- `data-safety.md` — encryption, masking, audit rules
- `frontend-principles.md` — App Router conventions
- `backend-principles.md` — Go conventions and dependencies
- `regulation.md` — regulatory references

## Getting started (local)
- Go 1.24+, Node.js 20+, Docker + Docker Compose.
- Common make targets: `make dev`, `make test`, `make test-race`, `make lint`, `make migrate`.
