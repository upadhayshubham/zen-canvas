# zen-canvas

Mandala Online Shop — monorepo.

## Structure

- `apps/api` — Spring Boot REST API (Java)
- `apps/web` — Next.js storefront (coming in Phase 1)

## Quick Start

### Prerequisites
- Java 21+
- Docker & Docker Compose
- Node.js 20+ (for web, Phase 1)

### Run locally

```bash
# Start PostgreSQL
docker compose up -d

# Start API
cd apps/api
./mvnw spring-boot:run
```

API runs on http://localhost:8080
Health check: http://localhost:8080/api/health
