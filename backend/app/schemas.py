from __future__ import annotations

from datetime import datetime
from typing import Any, Dict, List, Literal, Optional
from uuid import UUID

from pydantic import BaseModel, Field, HttpUrl, validator


class TenantCreate(BaseModel):
    name: str
    industry: Optional[str] = None
    website: Optional[HttpUrl] = None
    description: Optional[str] = None


class TenantRead(BaseModel):
    id: UUID
    name: str
    industry: Optional[str] = None
    website: Optional[HttpUrl] = None
    description: Optional[str] = None
    profile: Dict[str, Any] = Field(default_factory=dict)
    created_at: datetime
    updated_at: datetime

    class Config:
        orm_mode = True


class IngestRequest(BaseModel):
    source_type: Literal["text", "url"]
    content: Optional[str] = None
    url: Optional[HttpUrl] = None
    metadata: Dict[str, Any] = Field(default_factory=dict)

    @validator("content", always=True)
    def validate_content(cls, v, values):  # type: ignore[override]
        source_type = values.get("source_type")
        if source_type == "text" and not v:
            raise ValueError("content is required when source_type is 'text'")
        if source_type == "url" and not values.get("url"):
            raise ValueError("url is required when source_type is 'url'")
        return v


class IngestResponse(BaseModel):
    tenant_id: UUID
    documents_added: int


class ChatRequest(BaseModel):
    message: str
    context: Dict[str, Any] = Field(default_factory=dict)


class SourceSnippet(BaseModel):
    content: str
    score: float
    context: Dict[str, Any]


class ChatResponse(BaseModel):
    tenant_id: UUID
    intent: str
    response: str
    sources: List[SourceSnippet]


class ConversationLogRead(BaseModel):
    id: UUID
    tenant_id: UUID
    user_message: str
    bot_response: str
    intent: Optional[str]
    context: Dict[str, Any]
    created_at: datetime


class BusinessProfile(BaseModel):
    industry: Optional[str]
    services: List[str]
    knowledge_summary: str
    tone: str
    primary_cta: Optional[str]
    locations: List[str] = Field(default_factory=list)


class TenantProfileResponse(BaseModel):
    tenant_id: UUID
    profile: BusinessProfile
