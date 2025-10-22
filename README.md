# Enterprise AI Chatbot Platform

## About
This repository delivers the first working slice of the multi-tenant enterprise chatbot platform described in the engineering guide. It includes a FastAPI backend that provisions isolated tenant workspaces, ingests business knowledge, performs lightweight business profiling, and serves contextual chat responses through an extensible LLM interface. The codebase is structured so the engineering team can keep iterating toward the full roadmap while retaining operational discipline from the original execution plan.

## How to Run (Development)
1. **Create a Python environment**
   ```bash
   python -m venv .venv
   source .venv/bin/activate
   ```
2. **Install dependencies**
   ```bash
   pip install -e .[dev]
   ```
3. **Configure environment variables (optional)**
   ```bash
   export CHATBOT_DATABASE_URL="sqlite:///./data/chatbot.db"  # default
   export CHATBOT_STORAGE_PATH="./storage"
   export CHATBOT_LLM_PROVIDER="local"                       # or "openai"
   export CHATBOT_OPENAI_API_KEY="sk-..."                     # required when provider=openai
   ```
4. **Launch the API**
   ```bash
   uvicorn backend.app.main:app --reload
   ```
5. **Run automated tests before committing**
   ```bash
   pytest
   ```

The API will be available at `http://localhost:8000` with automatic docs at `/docs` and `/redoc`.

---

## Architecture Overview
The backend implements the baseline architecture from the execution guide:

| Layer | Responsibilities |
| ----- | ---------------- |
| Tenant Management | Create and profile tenants, persist metadata, and expose onboarding endpoints. |
| Knowledge Ingestion | Accept text, URLs, or PDF uploads per tenant and build a TF-IDF vector store persisted on disk. |
| Business Intelligence | Lightweight profiler that scrapes website copy and uploaded docs to infer industry, services, tone, and locations. |
| Conversation Engine | Intent detection, semantic retrieval, and pluggable LLM interface (local template or OpenAI GPT-4 Turbo). |
| Data Persistence | SQLAlchemy models for tenants and conversation logs with SQLite defaults; per-tenant knowledge stored under `storage/tenants/<id>`. |

The implementation keeps modules isolated (`services/tenant_service.py`, `services/ingestion_service.py`, `services/conversation_service.py`, `services/llm.py`, `services/knowledge_base.py`, `services/profiling.py`) so teams can evolve each responsibility independently or split them into microservices later.

## Key Components
- **`backend/app/config.py`** – Centralized configuration via `CHATBOT_*` environment variables.
- **`backend/app/db.py` & `backend/app/models.py`** – SQLAlchemy setup for tenants and conversation logs.
- **`backend/app/services/knowledge_base.py`** – Per-tenant TF-IDF vector store with persistence and cosine search.
- **`backend/app/services/ingestion_service.py`** – Text, URL, and PDF ingestion with automatic chunking.
- **`backend/app/services/profiling.py`** – Automated business profiling (industry, services, tone, locations).
- **`backend/app/services/conversation_service.py`** – Intent classification, retrieval, LLM orchestration, and logging.
- **`backend/app/services/llm.py`** – Provider abstraction supporting a deterministic local template or OpenAI Chat Completions.
- **`backend/app/main.py`** – FastAPI routes for tenant creation, ingestion, chat, and analytics-ready conversation exports.

## API Surface
| Method & Path | Description |
| ------------- | ----------- |
| `POST /tenants` | Register a new tenant and auto-generate its business profile. |
| `GET /tenants/{tenant_id}/profile` | Retrieve the computed business profile for a tenant. |
| `POST /tenants/{tenant_id}/ingest` | Ingest raw text or remote URLs into the tenant knowledge base. |
| `POST /tenants/{tenant_id}/ingest/upload` | Upload PDF files for ingestion (multipart form data). |
| `POST /tenants/{tenant_id}/chat` | Ask a question and receive an intent-tagged, context-aware response. |
| `GET /tenants/{tenant_id}/conversations` | List recent conversation transcripts for auditing and analytics. |
| `GET /health` | Basic health probe exposing storage and LLM configuration. |

Refer to the interactive Swagger UI at `/docs` for detailed request/response schemas.

## Testing & Quality Gates
- **Unit tests** live under `backend/tests/` and are executed via `pytest`. The suite covers ingestion persistence and conversation retrieval logic.
- **CI/CD Ready** – The project exposes deterministic local LLM responses so tests pass without external API keys, while still supporting OpenAI for staging/production via configuration.
- **Documentation Discipline** – Keep this README and service-specific docs in sync as features evolve. Expand with ADRs, onboarding guides, and security runbooks following the execution guide’s governance model.

## Next Steps
1. **Extend Multi-Tenancy** – Move from SQLite to PostgreSQL schemas and Redis session caching per tenant.
2. **Frontend Dashboard** – Scaffold the React/Next.js admin console for onboarding, analytics, and configuration management.
3. **Workflow Automation** – Implement async pipelines (Celery/RQ/SQS) for heavy ingestion, retraining, and analytics exports.
4. **Security Hardening** – Integrate RBAC, audit trails, and SOC 2/GDPR control automation as outlined in the original plan.
5. **Channel Integrations** – Layer in WhatsApp, Facebook Messenger, and web widget channels with unified conversation routing.

Executing against these milestones—while adhering to the objectives, governance, and feedback loops defined in the engineering guide—will evolve this foundation into the full enterprise-grade chatbot platform.
