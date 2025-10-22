from __future__ import annotations

from typing import Any, Dict, Generator
from uuid import UUID

from fastapi import Depends, FastAPI, File, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

from .config import get_settings
from .db import get_session_factory, init_db
from .models import ConversationLog, Tenant
from .schemas import (
    ChatRequest,
    ChatResponse,
    IngestRequest,
    IngestResponse,
    TenantCreate,
    TenantProfileResponse,
    TenantRead,
)
from .services.conversation_service import ConversationManager
from .services.ingestion_service import IngestionService
from .services.tenant_service import TenantService

app = FastAPI(title="Enterprise Chatbot Platform", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
def on_startup() -> None:
    init_db()


def get_db() -> Generator[Session, None, None]:
    SessionLocal = get_session_factory()
    db = SessionLocal()
    try:
        yield db
        db.commit()
    except Exception:
        db.rollback()
        raise
    finally:
        db.close()


def _tenant_or_404(db: Session, tenant_id: UUID) -> Tenant:
    service = TenantService(db)
    tenant = service.get(tenant_id)
    if not tenant:
        raise HTTPException(status_code=404, detail="Tenant not found")
    return tenant


@app.post("/tenants", response_model=TenantRead)
def create_tenant(payload: TenantCreate, db: Session = Depends(get_db)) -> TenantRead:
    service = TenantService(db)
    tenant = service.create_tenant(payload)
    db.refresh(tenant)
    profile = tenant.profile_json or {}
    return TenantRead(
        id=tenant.id,
        name=tenant.name,
        industry=tenant.industry,
        website=tenant.website,
        description=tenant.description,
        profile=profile,
        created_at=tenant.created_at,
        updated_at=tenant.updated_at,
    )


@app.get("/tenants/{tenant_id}/profile", response_model=TenantProfileResponse)
def get_tenant_profile(tenant_id: UUID, db: Session = Depends(get_db)) -> TenantProfileResponse:
    tenant = _tenant_or_404(db, tenant_id)
    service = TenantService(db)
    profile_schema = service.to_schema(tenant)
    return TenantProfileResponse(tenant_id=tenant.id, profile=profile_schema)


@app.post("/tenants/{tenant_id}/ingest", response_model=IngestResponse)
def ingest(tenant_id: UUID, payload: IngestRequest, db: Session = Depends(get_db)) -> IngestResponse:
    _tenant_or_404(db, tenant_id)
    ingestion = IngestionService(db, tenant_id)
    count = ingestion.ingest(payload)
    return IngestResponse(tenant_id=tenant_id, documents_added=count)


@app.post("/tenants/{tenant_id}/ingest/upload", response_model=IngestResponse)
def ingest_upload(
    tenant_id: UUID,
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
) -> IngestResponse:
    _tenant_or_404(db, tenant_id)
    ingestion = IngestionService(db, tenant_id)
    content = file.file.read()
    count = ingestion.ingest_file(content, file.filename)
    return IngestResponse(tenant_id=tenant_id, documents_added=count)


@app.post("/tenants/{tenant_id}/chat", response_model=ChatResponse)
def chat(tenant_id: UUID, payload: ChatRequest, db: Session = Depends(get_db)) -> ChatResponse:
    tenant = _tenant_or_404(db, tenant_id)
    manager = ConversationManager(db, tenant)
    return manager.process_message(payload.message, payload.context)


@app.get("/tenants/{tenant_id}/conversations")
def list_conversations(tenant_id: UUID, db: Session = Depends(get_db)) -> Dict[str, Any]:
    _tenant_or_404(db, tenant_id)
    logs = (
        db.query(ConversationLog)
        .filter(ConversationLog.tenant_id == tenant_id)
        .order_by(ConversationLog.created_at.desc())
        .limit(100)
        .all()
    )
    return {"items": [log.to_dict() for log in logs]}


@app.get("/health")
def healthcheck() -> Dict[str, Any]:
    settings = get_settings()
    return {
        "status": "ok",
        "storage_path": str(settings.storage_path),
        "llm_provider": settings.llm_provider,
    }
