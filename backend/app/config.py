from functools import lru_cache
from pathlib import Path
from typing import Optional

from pydantic import BaseSettings, Field


class Settings(BaseSettings):
    """Application configuration loaded from environment variables."""

    database_url: str = Field(
        default="sqlite:///./data/chatbot.db",
        description="SQLAlchemy database connection string.",
    )
    storage_path: Path = Field(
        default=Path("./storage"),
        description="Base path for tenant knowledge base persistence.",
    )
    llm_provider: str = Field(
        default="local",
        description="LLM backend identifier (e.g. local, openai).",
    )
    openai_api_key: Optional[str] = Field(
        default=None,
        description="API key for OpenAI when llm_provider=openai.",
    )
    top_k: int = Field(
        default=3,
        description="Number of documents to retrieve from knowledge base for each query.",
    )
    conversation_cache_ttl: int = Field(
        default=120,
        description="Seconds to cache conversation level data (future use).",
    )

    class Config:
        env_prefix = "CHATBOT_"
        case_sensitive = False


@lru_cache()
def get_settings() -> Settings:
    """Return application settings instance."""

    settings = Settings()
    settings.storage_path.mkdir(parents=True, exist_ok=True)
    return settings
