from __future__ import annotations

from typing import Dict, List, Optional

from sqlalchemy.orm import Session

from ..config import get_settings
from ..models import ConversationLog, Tenant
from ..schemas import ChatResponse, SourceSnippet
from .knowledge_base import KnowledgeBase
from .llm import LLMClient, get_llm_client


INTENT_KEYWORDS = {
    "product_inquiry": ["product", "price", "cost", "feature"],
    "booking": ["book", "appointment", "schedule", "reserve"],
    "support": ["problem", "issue", "help", "support"],
    "hours": ["hours", "open", "close", "time"],
}

SYSTEM_PROMPT_TEMPLATE = (
    "You are a helpful AI assistant for {business_name}, a {industry} organization.\n"
    "Always respond in a {tone_style} manner.\n"
    "If appropriate, encourage the user to {primary_cta}."
)


class ConversationManager:
    def __init__(self, session: Session, tenant: Tenant, llm_client: Optional[LLMClient] = None) -> None:
        self.session = session
        self.tenant = tenant
        self.settings = get_settings()
        self.llm = llm_client or get_llm_client()
        self.kb = KnowledgeBase(str(tenant.id))

    def process_message(self, message: str, context: Optional[Dict[str, str]] = None) -> ChatResponse:
        intent = self._classify_intent(message)
        snippets = self._retrieve_context(message)
        response_text = self._generate_response(message, snippets)
        log = ConversationLog(
            tenant_id=self.tenant.id,
            user_message=message,
            bot_response=response_text,
            intent=intent,
            context={"conversation": context or {}, "sources": [s.context for s in snippets]},
        )
        self.session.add(log)
        self.session.flush()
        return ChatResponse(
            tenant_id=self.tenant.id,
            intent=intent,
            response=response_text,
            sources=snippets,
        )

    def _classify_intent(self, message: str) -> str:
        lowered = message.lower()
        for intent, keywords in INTENT_KEYWORDS.items():
            if any(keyword in lowered for keyword in keywords):
                return intent
        return "general"

    def _retrieve_context(self, message: str) -> List[SourceSnippet]:
        results = self.kb.similarity_search(message, k=self.settings.top_k)
        return [
            SourceSnippet(content=doc.content, score=score, context=doc.metadata)
            for doc, score in results
        ]

    def _generate_response(self, message: str, sources: List[SourceSnippet]) -> str:
        profile = self.tenant.profile_json or {}
        prompt_vars = {
            "business_name": self.tenant.name,
            "industry": profile.get("industry", "business"),
            "tone_style": profile.get("tone", "friendly"),
            "primary_cta": profile.get("primary_cta", "contact our team"),
        }
        context_snippets = [snippet.content for snippet in sources]
        return self.llm.generate(SYSTEM_PROMPT_TEMPLATE, message, context_snippets, prompt_vars)
