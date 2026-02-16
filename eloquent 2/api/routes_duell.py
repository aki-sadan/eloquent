"""
API-Routen für den Duell-Modus.
Grundstruktur für lokale und später Online-Duelle.
"""

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, Field
from sqlalchemy.orm import Session
import random

from db.database import get_db
from db.models import Spieler, Duell, DuellTeilnahme, DuellRunde
from core.situationen import situation_fuer_runde, DUELL_SITUATIONEN

router = APIRouter()


class DuellStartRequest(BaseModel):
    spieler1_id: int
    spieler2_id: int
    runden: int = Field(default=3, ge=1, le=5)


class DuellStartResponse(BaseModel):
    duell_id: int
    runde: int
    situation: dict


@router.post("/starten", response_model=DuellStartResponse)
def duell_starten(data: DuellStartRequest, db: Session = Depends(get_db)):
    """Startet ein neues Duell zwischen zwei Spielern."""
    s1 = db.query(Spieler).filter(Spieler.id == data.spieler1_id).first()
    s2 = db.query(Spieler).filter(Spieler.id == data.spieler2_id).first()

    if not s1 or not s2:
        raise HTTPException(status_code=404, detail="Spieler nicht gefunden")
    if s1.id == s2.id:
        raise HTTPException(status_code=400, detail="Spieler können nicht gegen sich selbst spielen")

    # Duell erstellen
    duell = Duell(gesamt_runden=data.runden)
    db.add(duell)
    db.flush()

    # Teilnahmen
    db.add(DuellTeilnahme(duell_id=duell.id, spieler_id=s1.id))
    db.add(DuellTeilnahme(duell_id=duell.id, spieler_id=s2.id))

    # Erste Runde
    situation = situation_fuer_runde(1)
    runde = DuellRunde(
        duell_id=duell.id,
        runden_nummer=1,
        situation_titel=situation["titel"],
        situation_beschreibung=situation["beschreibung"],
        schwierigkeit="leicht",
    )
    db.add(runde)
    db.commit()
    db.refresh(duell)

    return DuellStartResponse(
        duell_id=duell.id,
        runde=1,
        situation=situation,
    )


@router.get("/{duell_id}")
def duell_status(duell_id: int, db: Session = Depends(get_db)):
    """Gibt den aktuellen Status eines Duells zurück."""
    duell = db.query(Duell).filter(Duell.id == duell_id).first()
    if not duell:
        raise HTTPException(status_code=404, detail="Duell nicht gefunden")

    teilnahmen = [
        {
            "spieler_id": t.spieler_id,
            "spieler_name": t.spieler.name_anzeige,
            "gesamtpunkte": t.gesamtpunkte,
            "runden_gewonnen": t.runden_gewonnen,
        }
        for t in duell.teilnahmen
    ]

    return {
        "duell_id": duell.id,
        "status": duell.status,
        "aktuelle_runde": duell.aktuelle_runde,
        "gesamt_runden": duell.gesamt_runden,
        "teilnehmer": teilnahmen,
        "gewinner_id": duell.gewinner_id,
        "unentschieden": duell.unentschieden,
    }


@router.get("/{duell_id}/naechste-runde")
def naechste_runde(duell_id: int, db: Session = Depends(get_db)):
    """Gibt die Situation für die nächste Runde zurück."""
    duell = db.query(Duell).filter(Duell.id == duell_id).first()
    if not duell:
        raise HTTPException(status_code=404, detail="Duell nicht gefunden")

    if duell.status == "beendet":
        raise HTTPException(status_code=400, detail="Duell ist bereits beendet")

    runde_nr = duell.aktuelle_runde
    situation = situation_fuer_runde(runde_nr)

    return {
        "runde": runde_nr,
        "von": duell.gesamt_runden,
        "situation": situation,
    }


@router.get("/situationen/zufaellig")
def zufaellige_situation(schwierigkeit: str | None = None):
    """Gibt eine zufällige Situation zurück (für Übungsmodus)."""
    from core.situationen import zufalls_situation
    return zufalls_situation(schwierigkeit)


@router.get("/situationen/alle")
def alle_situationen():
    """Gibt alle verfügbaren Situationen zurück."""
    return {
        schwierigkeit: [
            {"titel": s["titel"], "kontext": s["kontext"], "beschreibung": s["beschreibung"]}
            for s in situationen
        ]
        for schwierigkeit, situationen in DUELL_SITUATIONEN.items()
    }
