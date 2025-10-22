from __future__ import annotations

import os
from typing import Generator

import pytest

from backend.app import config as app_config
from backend.app.db import get_session_factory, init_db, reset_engine


@pytest.fixture(scope="session", autouse=True)
def configure_test_environment(tmp_path_factory: pytest.TempPathFactory) -> Generator[None, None, None]:
    tmp_dir = tmp_path_factory.mktemp("chatbot-data")
    db_path = tmp_dir / "test.db"
    storage_path = tmp_dir / "storage"
    os.environ["CHATBOT_DATABASE_URL"] = f"sqlite:///{db_path}"
    os.environ["CHATBOT_STORAGE_PATH"] = str(storage_path)
    app_config.get_settings.cache_clear()
    app_config.get_settings()
    reset_engine()
    init_db()
    yield
    app_config.get_settings.cache_clear()


@pytest.fixture()
def db_session() -> Generator:
    SessionLocal = get_session_factory()
    session = SessionLocal()
    try:
        yield session
    finally:
        session.close()
