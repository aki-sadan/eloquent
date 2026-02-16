"""
API-Routen für den Story-Modus.
"""

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session

from db.database import get_db
from db.models import Spieler
from core.story import (
    KAPITEL, PROLOG, EPILOG,
    kapitel_laden, story_fortschritt, alle_freigeschalteten_woerter
)

router = APIRouter()


@router.get("/prolog")
def prolog():
    return {"text": PROLOG}


@router.get("/kapitel/{nummer}")
def kapitel_holen(nummer: int):
    """Gibt ein Kapitel mit Erzählung, Dialogen und Prüfung zurück."""
    k = kapitel_laden(nummer)
    if not k:
        raise HTTPException(status_code=404, detail=f"Kapitel {nummer} existiert nicht.")

    return {
        "nummer": k.nummer,
        "titel": k.titel,
        "untertitel": k.untertitel,
        "ort": k.ort,
        "kapitelbild": k.kapitelbild,
        "erzaehlung_intro": k.erzaehlung_intro,
        "dialoge": [
            {"sprecher": d.sprecher, "text": d.text, "emotion": d.emotion}
            for d in k.dialoge
        ],
        "erzaehlung_uebergang": k.erzaehlung_uebergang,
        "pruefung": {
            "titel": k.pruefung.titel,
            "kontext": k.pruefung.kontext,
            "beschreibung": k.pruefung.beschreibung,
            "min_punkte": k.pruefung.min_punkte,
            "belohnung_pokale": k.pruefung.belohnung_pokale,
            "tipp": k.pruefung.tipp,
        },
        "erzaehlung_outro": k.erzaehlung_outro,
        "freigeschaltete_woerter": k.freigeschaltete_woerter,
    }


@router.get("/fortschritt/{spieler_id}")
def fortschritt(spieler_id: int, db: Session = Depends(get_db)):
    spieler = db.query(Spieler).filter(Spieler.id == spieler_id).first()
    if not spieler:
        raise HTTPException(status_code=404, detail="Spieler nicht gefunden")
    return story_fortschritt(spieler.story_kapitel)


class KapitelAbschluss(BaseModel):
    spieler_id: int
    kapitel: int
    punkte: float


@router.post("/kapitel-abschliessen")
def kapitel_abschliessen(data: KapitelAbschluss, db: Session = Depends(get_db)):
    """Schließt ein Kapitel ab und vergibt Belohnungen."""
    spieler = db.query(Spieler).filter(Spieler.id == data.spieler_id).first()
    if not spieler:
        raise HTTPException(status_code=404, detail="Spieler nicht gefunden")

    k = kapitel_laden(data.kapitel)
    if not k:
        raise HTTPException(status_code=404, detail="Kapitel nicht gefunden")

    if data.punkte < k.pruefung.min_punkte:
        return {
            "bestanden": False,
            "punkte": data.punkte,
            "min_punkte": k.pruefung.min_punkte,
            "nachricht": f"Du brauchst mindestens {k.pruefung.min_punkte} Punkte. Versuche es erneut!",
        }

    # Kapitel freischalten
    if spieler.story_kapitel < data.kapitel:
        spieler.story_kapitel = data.kapitel
        spieler.pokale += k.pruefung.belohnung_pokale

        if data.kapitel >= 5:
            spieler.story_abgeschlossen = True

        db.commit()

    return {
        "bestanden": True,
        "punkte": data.punkte,
        "pokale_erhalten": k.pruefung.belohnung_pokale,
        "freigeschaltete_woerter": k.freigeschaltete_woerter,
        "naechstes_kapitel": data.kapitel + 1 if data.kapitel < 5 else None,
        "story_abgeschlossen": data.kapitel >= 5,
        "nachricht": k.erzaehlung_outro[:200] + "...",
    }


@router.get("/epilog")
def epilog():
    return {"text": EPILOG}


@router.get("/uebersicht")
def uebersicht():
    """Gibt eine Übersicht aller Kapitel zurück."""
    return [
        {
            "nummer": k.nummer,
            "titel": k.titel,
            "untertitel": k.untertitel,
            "kapitelbild": k.kapitelbild,
            "ort": k.ort,
            "min_punkte": k.pruefung.min_punkte,
            "belohnung_pokale": k.pruefung.belohnung_pokale,
        }
        for k in KAPITEL
    ]
