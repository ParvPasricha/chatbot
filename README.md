# Enterprise AI Chatbot Platform

This repository implements a full multi-tenant AI chatbot SaaS platform composed of modular Node.js/TypeScript microservices, a React dashboard, and shared tooling. The system ingests business knowledge from multiple sources, orchestrates large language model responses, and delivers customer-facing chat experiences while satisfying enterprise-grade compliance and observability requirements.

## Repository Layout

```
app/
  gateway/          # API gateway (Express) exposing chat + tenant APIs
  auth/             # Authentication & JWT issuance service
  tenants/          # Tenant provisioning, plans, billing facade
  ingestion/        # Workers for PDFs, web scraping, embeddings
  orchestrator/     # Conversation engine + LLM orchestration
  tools/            # External integrations (KB search, POS, CRM, handoff)
  dashboard/        # Next.js admin UI
  widget/           # Embeddable chat widget
  shared/           # Shared libs, config, types, utilities
infra/              # Docker, Terraform, Helm deployment assets
tests/              # Unit, integration, and e2e test suites
```

Each service is packaged independently but relies on `app/shared` for logging, configuration, typing, telemetry, and data access helpers. Workspaces in the root `package.json` wire everything together.

## Getting Started

### Prerequisites

- Node.js >= 18
- npm >= 9 (workspace support)
- Docker (for optional local dependencies)
- PostgreSQL, Redis, RabbitMQ, and vector database (Weaviate or Pinecone) running locally or in the cloud

### Installation

```bash
npm install
```

This installs dependencies for every workspace and links local packages.

### Environment Variables

Duplicate `.env.example` to `.env` and adjust values for your environment. Each service also supports additional overrides documented inside their local `README` (see below).

### Development Workflow

Run core microservices for iterative development:

```bash
npm run dev
```

This boots the gateway, which proxies chat requests to the orchestrator. Individual services expose their own `dev` scripts (e.g., `npm run dev --workspace app/orchestrator`).

### Testing

```bash
npm test
```

Unit, integration, and e2e suites leverage Jest and Playwright. Each workspace encapsulates its own targeted coverage and exports reusable fixtures under `app/tests`.

### Building Docker Images

```bash
npm run build
```

Every workspace compiles to `dist/` and Dockerfiles consume those artifacts. Infrastructure manifests inside `infra/` provide orchestrated deployments for ECS, Kubernetes (Helm), and docker-compose.

## Documentation & Operational Guides

- Service-specific READMEs live inside each `app/<service>/README.md`.
- `infra/terraform` contains IaC definitions for AWS (ECS, S3, RDS, IAM).
- `infra/helm` packages Kubernetes manifests with configurable values.
- `app/orchestrator/src/config/prompts/agent.md` defines the system prompt template for LLM orchestration.

## Contributing

1. Fork the repository.
2. Create a feature branch.
3. Commit with conventional messages.
4. Open a PR and ensure CI passes.

## License

Proprietary – All rights reserved.
