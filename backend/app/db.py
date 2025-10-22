from __future__ import annotations

from contextlib import contextmanager
from typing import Generator

from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker

from .config import get_settings

Base = declarative_base()
_engine = None
_SessionLocal = None


def _create_engine():
    settings = get_settings()
    connect_args = {}
    if settings.database_url.startswith("sqlite"):
        connect_args["check_same_thread"] = False
    return create_engine(settings.database_url, connect_args=connect_args, future=True)


def _create_session_factory(engine):
    return sessionmaker(autocommit=False, autoflush=False, bind=engine, future=True)


def _ensure_session_factory():
    global _engine, _SessionLocal
    if _engine is None:
        _engine = _create_engine()
    if _SessionLocal is None:
        _SessionLocal = _create_session_factory(_engine)


def get_engine():
    _ensure_session_factory()
    return _engine


def get_session_factory():
    _ensure_session_factory()
    return _SessionLocal


def reset_engine():
    global _engine, _SessionLocal
    _engine = _create_engine()
    _SessionLocal = _create_session_factory(_engine)


@contextmanager
def session_scope() -> Generator:
    factory = get_session_factory()
    session = factory()
    try:
        yield session
        session.commit()
    except Exception:
        session.rollback()
        raise
    finally:
        session.close()


def init_db() -> None:
    engine = get_engine()
    Base.metadata.create_all(bind=engine)
