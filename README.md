# Simdikta

A full-stack web application with a Go backend and Next.js frontend.

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js (App Router) + TypeScript |
| Backend | Go (Clean Architecture) |
| Database | PostgreSQL |
| Cache | Redis |
| Containerization | Docker + Docker Compose |

## Project Structure

```
simdikta/
├── .claude/          # Claude Code agent system (AI-assisted development)
│   ├── agents/       # Specialized agents per domain
│   ├── commands/     # Custom slash commands
│   ├── context/      # Project context and tech stack reference
│   ├── templates/    # PRD and architecture document templates
│   └── workflows/    # Development lifecycle workflows
├── backend/          # Go service (coming soon)
└── frontend/         # Next.js application (coming soon)
```

## Getting Started

### Prerequisites
- Go 1.24+
- Node.js 20+
- Docker + Docker Compose

### Development

```bash
# Start all services
docker-compose up

# Backend only
cd backend && go run ./cmd/...

# Frontend only
cd frontend && npm run dev
```

## Claude Code Integration

This project uses a structured `.claude/` system for AI-assisted development. Available commands:

| Command | Description |
|---|---|
| `/analyze-codebase` | Understand existing code with citations |
| `/plan-feature` | Generate a phased implementation plan |
| `/generate-prd` | Write a Product Requirements Document |
| `/design-architecture` | Produce a technical design document |
| `/review-code` | Code review for correctness, security, and patterns |
| `/run-tests` | Run test suites and analyze results |

## License

MIT
