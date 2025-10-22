from __future__ import annotations

from abc import ABC, abstractmethod
from typing import Dict, List, Optional

try:
    import openai
except Exception:  # pragma: no cover - optional dependency
    openai = None

from ..config import get_settings


class LLMClient(ABC):
    """Abstract interface for language model providers."""

    @abstractmethod
    def generate(
        self,
        prompt: str,
        message: str,
        context_snippets: List[str],
        business_profile: Dict[str, str],
    ) -> str:
        raise NotImplementedError


class OpenAIClient(LLMClient):
    def __init__(self, api_key: str) -> None:
        if openai is None:
            raise RuntimeError("openai package is required for OpenAI integration")
        openai.api_key = api_key

    def generate(
        self,
        prompt: str,
        message: str,
        context_snippets: List[str],
        business_profile: Dict[str, str],
    ) -> str:
        system_prompt = prompt.format(**business_profile)
        messages = [
            {"role": "system", "content": system_prompt},
            {
                "role": "user",
                "content": (
                    "Context:\n" + "\n\n".join(context_snippets) + f"\n\nCustomer: {message}"
                ),
            },
        ]
        response = openai.ChatCompletion.create(model="gpt-4-turbo", messages=messages)
        return response["choices"][0]["message"]["content"].strip()


class LocalTemplateLLM(LLMClient):
    """Deterministic LLM for development and testing."""

    def generate(
        self,
        prompt: str,
        message: str,
        context_snippets: List[str],
        business_profile: Dict[str, str],
    ) -> str:
        tone = business_profile.get("tone_style", "friendly")
        company = business_profile.get("business_name", "your business")
        services = business_profile.get("services", "")
        context_text = "\n\n".join(context_snippets) if context_snippets else ""
        response_parts = [
            f"[{tone.title()} tone] Hello! You're chatting with the virtual assistant for {company}.",
        ]
        if context_text:
            response_parts.append("Here's what I found that may help:\n" + context_text)
        if services:
            response_parts.append(f"We currently offer: {services}.")
        response_parts.append(f"Regarding your question '{message}', we're here to help!")
        response_parts.append(
            "If you need a human representative at any point, just let me know and I'll arrange a handoff."
        )
        return "\n\n".join(response_parts)


def get_llm_client(provider: Optional[str] = None) -> LLMClient:
    settings = get_settings()
    provider = provider or settings.llm_provider
    if provider == "openai":
        if not settings.openai_api_key:
            raise ValueError("OPENAI_API_KEY not configured for OpenAI provider")
        return OpenAIClient(settings.openai_api_key)
    return LocalTemplateLLM()
