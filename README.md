# Simdikta Monorepo

Sistem Akademi Pendidikan Terintegrasi untuk Negeri

A full-stack application with Spring Boot backend and Next.js frontend.

## Structure

```
simdikta/
├── backend/           # Spring Boot 3.5.5 application
├── frontend/          # Next.js application with TypeScript
├── docs/              # Documentation
├── scripts/           # Build and deployment scripts
├── docker-compose.yml # Docker configuration
└── package.json       # Root package.json with scripts
```

## Tech Stack

### Backend
- Spring Boot 3.5.5
- Java 21
- PostgreSQL
- Redis
- Apache Kafka
- Gradle

### Frontend
- Next.js 15
- TypeScript
- Tailwind CSS
- React 18

## Quick Start

### Prerequisites
- Java 21
- Node.js 18+
- Docker & Docker Compose

### Development

1. **Start infrastructure services:**
   ```bash
   npm run dev:services
   ```

2. **Start backend:**
   ```bash
   npm run dev:backend
   ```

3. **Start frontend:**
   ```bash
   npm run dev:frontend
   ```

### Docker Development

Start everything with Docker:
```bash
npm run dev
```

## Available Scripts

- `npm run install:all` - Install all dependencies
- `npm run build` - Build both backend and frontend
- `npm run test` - Run all tests
- `npm run dev` - Start all services with Docker
- `npm run docker:up` - Start Docker services in background
- `npm run docker:down` - Stop Docker services
- `npm run docker:logs` - View Docker logs

## Services

- **Frontend:** http://localhost:3000
- **Backend:** http://localhost:8080
- **PostgreSQL:** localhost:5432
- **Redis:** localhost:6379
- **Kafka:** localhost:9092

## Environment Variables

Backend supports these environment variables:
- `DATABASE_USERNAME` (default: simdikta)
- `DATABASE_PASSWORD` (default: password)
- `REDIS_HOST` (default: localhost)
- `REDIS_PORT` (default: 6379)
- `KAFKA_BOOTSTRAP_SERVERS` (default: localhost:9092)
