"""
API-Routen für Spieler-Management.
"""

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, Field
from sqlalchemy.orm import Session

from db.database import get_db
from db.models import Spieler, SpielerTrophae
from core.config import RAENGE, TROPHAEEN

router = APIRouter()


class SpielerCreate(BaseModel):
    name: str = Field(..., min_length=2, max_length=50)


class SpielerResponse(BaseModel):
    id: int
    name: str
    pokale: int
    rang: dict
    duelle_gespielt: int
    duelle_gewonnen: int
    duelle_verloren: int
    hoechste_punktzahl: float
    story_kapitel: int
    trophaeen: list[str]

    class Config:
        from_attributes = True


def _rang_ermitteln(pokale: int) -> dict:
    aktueller = RAENGE[0]
    for rang in RAENGE:
        if pokale >= rang["min_pokale"]:
            aktueller = rang
        else:
            break
    return aktueller


@router.post("/registrieren", response_model=SpielerResponse)
def spieler_registrieren(data: SpielerCreate, db: Session = Depends(get_db)):
    """Registriert einen neuen Spieler oder gibt das bestehende Profil zurück."""
    name_key = data.name.lower().strip()

    spieler = db.query(Spieler).filter(Spieler.name == name_key).first()
    if spieler:
        rang = _rang_ermitteln(spieler.pokale)
        return SpielerResponse(
            id=spieler.id, name=spieler.name_anzeige, pokale=spieler.pokale,
            rang=rang, duelle_gespielt=spieler.duelle_gespielt,
            duelle_gewonnen=spieler.duelle_gewonnen,
            duelle_verloren=spieler.duelle_verloren,
            hoechste_punktzahl=spieler.hoechste_punktzahl,
            story_kapitel=spieler.story_kapitel,
            trophaeen=[t.trophae_id for t in spieler.trophaeen],
        )

    spieler = Spieler(name=name_key, name_anzeige=data.name.strip())
    db.add(spieler)
    db.commit()
    db.refresh(spieler)

    rang = _rang_ermitteln(0)
    return SpielerResponse(
        id=spieler.id, name=spieler.name_anzeige, pokale=0,
        rang=rang, duelle_gespielt=0, duelle_gewonnen=0,
        duelle_verloren=0, hoechste_punktzahl=0,
        story_kapitel=0, trophaeen=[],
    )


@router.get("/{spieler_id}", response_model=SpielerResponse)
def spieler_profil(spieler_id: int, db: Session = Depends(get_db)):
    """Gibt das Profil eines Spielers zurück."""
    spieler = db.query(Spieler).filter(Spieler.id == spieler_id).first()
    if not spieler:
        raise HTTPException(status_code=404, detail="Spieler nicht gefunden")

    rang = _rang_ermitteln(spieler.pokale)
    return SpielerResponse(
        id=spieler.id, name=spieler.name_anzeige, pokale=spieler.pokale,
        rang=rang, duelle_gespielt=spieler.duelle_gespielt,
        duelle_gewonnen=spieler.duelle_gewonnen,
        duelle_verloren=spieler.duelle_verloren,
        hoechste_punktzahl=spieler.hoechste_punktzahl,
        story_kapitel=spieler.story_kapitel,
        trophaeen=[t.trophae_id for t in spieler.trophaeen],
    )


@router.get("/rangliste/top")
def rangliste(limit: int = 20, db: Session = Depends(get_db)):
    """Gibt die Top-Spieler nach Pokalen zurück."""
    spieler = (
        db.query(Spieler)
        .order_by(Spieler.pokale.desc())
        .limit(limit)
        .all()
    )
    return [
        {
            "platz": i + 1,
            "name": s.name_anzeige,
            "pokale": s.pokale,
            "rang": _rang_ermitteln(s.pokale),
            "duelle_gewonnen": s.duelle_gewonnen,
            "duelle_gespielt": s.duelle_gespielt,
            "gewinnrate": round(s.duelle_gewonnen / s.duelle_gespielt * 100, 1)
                          if s.duelle_gespielt > 0 else 0,
        }
        for i, s in enumerate(spieler)
    ]


@router.post("/{spieler_id}/trophaeen-pruefen")
def trophaeen_pruefen(spieler_id: int, db: Session = Depends(get_db)):
    """Prüft und vergibt neue Trophäen."""
    spieler = db.query(Spieler).filter(Spieler.id == spieler_id).first()
    if not spieler:
        raise HTTPException(status_code=404, detail="Spieler nicht gefunden")

    bestehende = {t.trophae_id for t in spieler.trophaeen}
    profil = spieler.to_dict()
    neue = []

    for trophae in TROPHAEEN:
        if trophae.id not in bestehende and trophae.ist_erfuellt(profil):
            st = SpielerTrophae(spieler_id=spieler.id, trophae_id=trophae.id)
            db.add(st)
            neue.append({
                "id": trophae.id,
                "name": trophae.name,
                "beschreibung": trophae.beschreibung,
                "seltenheit": trophae.seltenheit,
            })

    if neue:
        db.commit()

    return {"neue_trophaeen": neue}
