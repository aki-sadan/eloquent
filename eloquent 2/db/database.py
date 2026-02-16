"""
Datenbank-Verbindung für Eloquent.
SQLite für Entwicklung, PostgreSQL für Produktion.
"""

import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, Session
from contextlib import contextmanager

from .models import Base

# Datenbank-URL (SQLite default, PostgreSQL über Umgebungsvariable)
DATABASE_URL = os.environ.get(
    "DATABASE_URL",
    "sqlite:///eloquent.db"
)

# Engine erstellen
engine = create_engine(
    DATABASE_URL,
    echo=os.environ.get("SQL_DEBUG", "").lower() == "true",
    # SQLite braucht check_same_thread=False für FastAPI
    connect_args={"check_same_thread": False} if "sqlite" in DATABASE_URL else {},
)

# Session Factory
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def init_db():
    """Erstellt alle Tabellen."""
    Base.metadata.create_all(bind=engine)


def get_db():
    """FastAPI Dependency: Gibt eine DB-Session zurück."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@contextmanager
def db_session():
    """Context Manager für DB-Sessions (für Nicht-FastAPI-Nutzung)."""
    db = SessionLocal()
    try:
        yield db
        db.commit()
    except Exception:
        db.rollback()
        raise
    finally:
        db.close()
