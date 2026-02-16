# 🎯 ELOQUENT — Das Wortduell

> Werde zum Meister der Eloquenz! Ein Sprachspiel, in dem du in verschiedenen Situationen möglichst eloquent formulieren musst — bewertet durch KI.

---

## 🚀 Spiel starten

### 1. Backend starten (API-Server)

```bash
# Im Ordner "eloquent 2/"
cd "eloquent 2"

# Python-Abhängigkeiten installieren (einmalig)
pip install -r requirements.txt

# Server starten
uvicorn api.main:app --reload
```

Der API-Server läuft dann auf **http://localhost:8000**.  
Swagger-Dokumentation: **http://localhost:8000/docs**

### 2. Frontend starten (React-App)

```bash
# Im Hauptordner "eloquent claude/"
npm install        # Abhängigkeiten installieren (einmalig)
npm run dev        # Vite Dev-Server starten
```

Das Frontend läuft dann auf **http://localhost:5173** (oder dem von Vite angezeigten Port).

### 3. Spielen!

Öffne **http://localhost:5173** im Browser und los geht's.

---

## 📁 Architektur v2.0

```
eloquent claude/
├── index.html               # HTML Entry Point (Vite)
├── main.jsx                 # React Entry Point
├── eloquent-app.jsx         # 🎮 Frontend — komplette Spiel-UI
├── package.json             # Node.js Dependencies
├── vite.config.js           # Vite Build-Config
├── test_engine.mjs          # Test-Script für Bewertungs-Engine
│
└── eloquent 2/              # 🐍 Python Backend
    ├── api/                 # FastAPI Backend
    │   ├── main.py          # API Entry Point
    │   ├── routes_bewertung.py  # Bewertungs-Endpoints
    │   ├── routes_duell.py      # Duell-Endpoints
    │   ├── routes_spieler.py    # Spieler-Endpoints
    │   ├── routes_story.py      # Story-Endpoints
    │   └── routes_woerterbuch.py# Wörterbuch-Endpoints
    │
    ├── core/                # Business Logic (kein UI!)
    │   ├── bewertung_ki.py  # 🧠 KI-Bewertung (LLM-basiert)
    │   ├── bewertung_regeln.py  # Regelbasierter Fallback
    │   ├── config.py        # Konfiguration
    │   ├── situationen.py   # Situationen-Datenbank
    │   ├── story.py         # Story-Modus Logik
    │   └── woerterbuch.py   # Gehobene Wörter
    │
    ├── db/                  # Datenbank
    │   ├── database.py      # DB-Verbindung (SQLite)
    │   ├── models.py        # SQLAlchemy Models
    │   └── seed.py          # Initiale Daten
    │
    ├── tests/               # Tests
    │   └── test_system.py
    │
    ├── requirements.txt
    └── README.md
```

## Prinzipien
- **Separation of Concerns**: Core-Logik hat KEINE UI-Abhängigkeit
- **API-First**: Alles läuft über REST-API → beliebiges Frontend möglich
- **KI-Bewertung**: LLM bewertet Eloquenz kontextbezogen
- **Regelbasierter Fallback**: Funktioniert auch ohne API-Key
- **SQLite → PostgreSQL**: Skalierbar von lokal bis Cloud
