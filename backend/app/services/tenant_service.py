from __future__ import annotations

from typing import Iterable, Optional
from uuid import UUID

from sqlalchemy import select
from sqlalchemy.orm import Session

from ..models import Tenant
from ..schemas import BusinessProfile as BusinessProfileSchema
from ..schemas import TenantCreate
from .profiling import BusinessProfiler


class TenantService:
    def __init__(self, session: Session) -> None:
        self.session = session
        self.profiler = BusinessProfiler()

    def create_tenant(
        self,
        payload: TenantCreate,
        documents: Optional[Iterable[str]] = None,
    ) -> Tenant:
        tenant = Tenant(
            name=payload.name,
            industry=payload.industry,
            website=str(payload.website) if payload.website else None,
            description=payload.description,
        )
        self.session.add(tenant)
        self.session.flush()
        profile = self.profiler.analyze_business(
            tenant.website, documents or []
        )
        tenant.profile_json = {
            "industry": profile.industry,
            "services": profile.services,
            "tone": profile.tone,
            "primary_cta": profile.primary_cta,
            "locations": profile.locations,
            "knowledge_summary": profile.knowledge_base[:1000],
        }
        return tenant

    def get(self, tenant_id: UUID) -> Optional[Tenant]:
        stmt = select(Tenant).where(Tenant.id == tenant_id)
        return self.session.execute(stmt).scalar_one_or_none()

    def to_schema(self, tenant: Tenant) -> BusinessProfileSchema:
        profile = tenant.profile_json or {}
        return BusinessProfileSchema(
            industry=profile.get("industry"),
            services=profile.get("services", []),
            knowledge_summary=profile.get("knowledge_summary", ""),
            tone=profile.get("tone", "neutral"),
            primary_cta=profile.get("primary_cta"),
            locations=profile.get("locations", []),
        )
