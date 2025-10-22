from __future__ import annotations

import json
from dataclasses import asdict, dataclass
from typing import Any, Dict, Iterable, List, Tuple

import joblib
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

from ..config import get_settings


@dataclass
class Document:
    content: str
    metadata: Dict[str, Any]


class KnowledgeBase:
    """Lightweight vector store per tenant using TF-IDF embeddings."""

    def __init__(self, tenant_id: str) -> None:
        settings = get_settings()
        self.base_path = settings.storage_path / "tenants" / tenant_id
        self.base_path.mkdir(parents=True, exist_ok=True)
        self.data_file = self.base_path / "kb.json"
        self.vectorizer_file = self.base_path / "vectorizer.joblib"
        self.matrix_file = self.base_path / "matrix.joblib"
        self.documents: List[Document] = []
        self.vectorizer: TfidfVectorizer | None = None
        self.matrix = None
        self._load()

    # Persistence helpers -------------------------------------------------
    def _load(self) -> None:
        if self.data_file.exists():
            data = json.loads(self.data_file.read_text())
            self.documents = [Document(**doc) for doc in data]
        if self.vectorizer_file.exists() and self.matrix_file.exists():
            self.vectorizer = joblib.load(self.vectorizer_file)
            self.matrix = joblib.load(self.matrix_file)

    def _persist(self) -> None:
        data = [asdict(doc) for doc in self.documents]
        self.data_file.write_text(json.dumps(data, indent=2))
        if self.vectorizer is not None and self.matrix is not None:
            joblib.dump(self.vectorizer, self.vectorizer_file)
            joblib.dump(self.matrix, self.matrix_file)

    # Public API ----------------------------------------------------------
    def add_documents(self, documents: Iterable[Document]) -> int:
        docs = list(documents)
        if not docs:
            return 0
        self.documents.extend(docs)
        texts = [doc.content for doc in self.documents]
        self.vectorizer = TfidfVectorizer(stop_words="english")
        self.matrix = self.vectorizer.fit_transform(texts)
        self._persist()
        return len(docs)

    def similarity_search(self, query: str, k: int = 3) -> List[Tuple[Document, float]]:
        if not self.documents or self.vectorizer is None or self.matrix is None:
            return []
        query_vector = self.vectorizer.transform([query])
        similarities = cosine_similarity(query_vector, self.matrix).flatten()
        if not np.any(similarities):
            return []
        top_indices = np.argsort(similarities)[::-1][:k]
        return [(self.documents[idx], float(similarities[idx])) for idx in top_indices]

    def to_metadata(self) -> Dict[str, int]:
        return {"documents": len(self.documents)}
