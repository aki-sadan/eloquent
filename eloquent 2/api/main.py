"""
🎯 ELOQUENT — API Backend

FastAPI-Server für das Eloquent-Spiel.
Starten mit: uvicorn api.main:app --reload

Alle Spiellogik läuft über diese API.
Das Frontend (Web, Mobile, Terminal) konsumiert nur Endpoints.
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from db.database import init_db
from api.routes_bewertung import router as bewertung_router
from api.routes_spieler import router as spieler_router
from api.routes_woerterbuch import router as woerterbuch_router
from api.routes_duell import router as duell_router
from api.routes_story import router as story_router

# ══════════════════════════════════════════════════════════════
# App erstellen
# ══════════════════════════════════════════════════════════════

app = FastAPI(
    title="ELOQUENT API",
    description="Das Wortduell — API für Eloquenz-Bewertung, Duelle & mehr",
    version="2.0.0",
    docs_url="/docs",       # Swagger UI
    redoc_url="/redoc",     # ReDoc
)

# CORS für Frontend-Zugriff
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In Produktion einschränken!
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ══════════════════════════════════════════════════════════════
# Startup
# ══════════════════════════════════════════════════════════════

@app.on_event("startup")
def startup():
    """Initialisiert die Datenbank beim Start."""
    init_db()


# ══════════════════════════════════════════════════════════════
# Routes einbinden
# ══════════════════════════════════════════════════════════════

app.include_router(bewertung_router, prefix="/api/v1/bewertung", tags=["Bewertung"])
app.include_router(spieler_router,   prefix="/api/v1/spieler",   tags=["Spieler"])
app.include_router(woerterbuch_router, prefix="/api/v1/woerterbuch", tags=["Wörterbuch"])
app.include_router(duell_router,     prefix="/api/v1/duell",     tags=["Duell"])
app.include_router(story_router,     prefix="/api/v1/story",     tags=["Story"])


# ══════════════════════════════════════════════════════════════
# Root & Health
# ══════════════════════════════════════════════════════════════

@app.get("/")
def root():
    return {
        "name": "ELOQUENT API",
        "version": "2.0.0",
        "beschreibung": "Das Wortduell — Werde zum Meister der Eloquenz",
        "docs": "/docs",
    }


@app.get("/health")
def health():
    return {"status": "ok"}
