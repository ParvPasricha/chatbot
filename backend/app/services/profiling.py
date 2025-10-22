from __future__ import annotations

import re
from dataclasses import dataclass
from typing import Dict, Iterable, List, Optional

import requests
from bs4 import BeautifulSoup


@dataclass
class BusinessProfile:
    industry: Optional[str]
    services: List[str]
    knowledge_base: str
    tone: str
    primary_cta: Optional[str]
    locations: List[str]


class BusinessProfiler:
    """Derive a lightweight profile for a tenant using website + documents."""

    def scrape_website(self, url: str) -> str:
        response = requests.get(url, timeout=10)
        response.raise_for_status()
        soup = BeautifulSoup(response.text, "html.parser")
        texts = [element.get_text(separator=" ", strip=True) for element in soup.find_all("p")]
        return " \n".join(texts)

    def process_documents(self, documents: Iterable[str]) -> str:
        return " \n".join(documents)

    def classify_industry(self, *corpora: str) -> Optional[str]:
        combined = " ".join(corpora).lower()
        keywords = {
            "hospitality": ["hotel", "booking", "hospitality", "guest"],
            "healthcare": ["clinic", "patient", "medical", "care"],
            "retail": ["store", "retail", "ecommerce", "shop"],
            "professional_services": ["consulting", "agency", "services", "b2b"],
        }
        for industry, terms in keywords.items():
            if any(term in combined for term in terms):
                return industry
        return None

    def extract_services(self, corpus: str) -> List[str]:
        sentences = re.split(r"[\.!?]", corpus)
        candidates = [s.strip() for s in sentences if "service" in s.lower() or "offer" in s.lower()]
        services = []
        for candidate in candidates:
            services.extend(
                [item.strip() for item in re.split(r",|;|\band\b", candidate) if len(item.strip()) > 3]
            )
        return list(dict.fromkeys(service.capitalize() for service in services))

    def detect_tone(self, corpus: str) -> str:
        if "welcome" in corpus.lower() or "glad" in corpus.lower():
            return "friendly"
        if "professional" in corpus.lower():
            return "professional"
        return "neutral"

    def extract_locations(self, corpus: str) -> List[str]:
        pattern = re.compile(r"\b[A-Z][a-z]+,\s?[A-Z]{2}\b")
        return pattern.findall(corpus)

    def analyze_business(self, website_url: Optional[str], documents: Iterable[str]) -> BusinessProfile:
        corpora: List[str] = []
        if website_url:
            try:
                corpora.append(self.scrape_website(website_url))
            except Exception:
                pass
        doc_blob = self.process_documents(documents)
        if doc_blob:
            corpora.append(doc_blob)
        combined = " \n".join(corpora)
        industry = self.classify_industry(*corpora) if corpora else None
        services = self.extract_services(combined) if combined else []
        tone = self.detect_tone(combined)
        locations = self.extract_locations(combined)
        return BusinessProfile(
            industry=industry,
            services=services,
            knowledge_base=combined,
            tone=tone,
            primary_cta=None,
            locations=locations,
        )

    def to_prompt_variables(self, tenant_name: str, profile: BusinessProfile) -> Dict[str, str]:
        return {
            "business_name": tenant_name,
            "industry": profile.industry or "business",
            "services": ", ".join(profile.services) if profile.services else "",
            "tone_style": profile.tone,
            "primary_cta": profile.primary_cta or "contact our team",
        }
