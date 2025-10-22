from __future__ import annotations

from backend.app.schemas import IngestRequest, TenantCreate
from backend.app.services.conversation_service import ConversationManager
from backend.app.services.ingestion_service import IngestionService
from backend.app.services.tenant_service import TenantService


def test_conversation_returns_contextual_answer(db_session):
    tenant_service = TenantService(db_session)
    tenant = tenant_service.create_tenant(
        TenantCreate(name="Serenity Spa", description="Luxury wellness spa")
    )
    db_session.commit()
    db_session.refresh(tenant)

    ingestion = IngestionService(db_session, tenant.id)
    ingestion.ingest(
        IngestRequest(
            source_type="text",
            content="Our spa offers Swedish massages, facials, and aromatherapy sessions.",
            metadata={"source": "knowledge-base"},
        )
    )

    manager = ConversationManager(db_session, tenant)
    response = manager.process_message("Do you provide aromatherapy?", {})

    assert response.sources, "Expected knowledge base sources"
    assert "aromatherapy" in response.response.lower()
    assert response.intent in {"product_inquiry", "general"}
