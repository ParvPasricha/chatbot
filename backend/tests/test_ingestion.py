from __future__ import annotations

from backend.app.schemas import IngestRequest, TenantCreate
from backend.app.services.ingestion_service import IngestionService
from backend.app.services.tenant_service import TenantService


def test_text_ingestion_persists_documents(db_session):
    tenant_service = TenantService(db_session)
    tenant = tenant_service.create_tenant(TenantCreate(name="Test Tenant"))
    db_session.commit()
    db_session.refresh(tenant)

    ingestion = IngestionService(db_session, tenant.id)
    payload = IngestRequest(
        source_type="text",
        content="We provide premium spa services and relaxing treatments.",
        metadata={"source": "unit-test"},
    )
    added = ingestion.ingest(payload)
    metadata = ingestion.knowledge_base_metadata()

    assert added == metadata["documents"]
    assert added > 0
