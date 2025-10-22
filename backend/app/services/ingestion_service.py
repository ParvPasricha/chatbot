from __future__ import annotations

import io
from typing import List
from uuid import UUID

import requests
from pdfminer.high_level import extract_text
from sqlalchemy.orm import Session

from ..schemas import IngestRequest
from .knowledge_base import Document, KnowledgeBase


class IngestionService:
    def __init__(self, session: Session, tenant_id: UUID) -> None:
        self.session = session
        self.tenant_id = str(tenant_id)
        self.kb = KnowledgeBase(self.tenant_id)

    def ingest(self, payload: IngestRequest) -> int:
        documents: List[Document] = []
        if payload.source_type == "text" and payload.content:
            documents.extend(self._chunk_text(payload.content, payload.metadata))
        elif payload.source_type == "url" and payload.url:
            documents.extend(self._ingest_url(payload.url, payload.metadata))
        return self.kb.add_documents(documents)

    def ingest_file(self, file_bytes: bytes, filename: str, metadata: dict | None = None) -> int:
        metadata = metadata or {}
        text = extract_text(io.BytesIO(file_bytes))
        documents = self._chunk_text(text, {**metadata, "filename": filename})
        return self.kb.add_documents(documents)

    def _chunk_text(self, text: str, metadata: dict | None = None, chunk_size: int = 600) -> List[Document]:
        metadata = metadata or {}
        chunks = [text[i : i + chunk_size] for i in range(0, len(text), chunk_size)]
        return [
            Document(content=chunk, metadata={**metadata, "chunk": str(idx)})
            for idx, chunk in enumerate(chunks, start=1)
            if chunk.strip()
        ]

    def _ingest_url(self, url: str, metadata: dict | None = None) -> List[Document]:
        response = requests.get(url, timeout=10)
        response.raise_for_status()
        content_type = response.headers.get("content-type", "")
        metadata = {**(metadata or {}), "url": url}
        if "application/pdf" in content_type:
            return self._chunk_text(extract_text(io.BytesIO(response.content)), metadata)
        return self._chunk_text(response.text, metadata)

    def knowledge_base_metadata(self) -> dict:
        return self.kb.to_metadata()
