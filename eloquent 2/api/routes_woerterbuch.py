"""
API-Routen für die Wörterbücherei.
"""

from fastapi import APIRouter, HTTPException, Query
from core.woerterbuch import (
    WOERTERBUCH, wort_nachschlagen, woerter_nach_kategorie,
    woerter_nach_schwierigkeit, wort_des_tages,
    zufaellige_empfehlungen, alle_kategorien, statistik
)

router = APIRouter()


@router.get("/")
def woerterbuch_uebersicht():
    """Übersicht über die Wörterbücherei."""
    return statistik()


@router.get("/alle")
def alle_woerter(
    kategorie: str | None = Query(None, description="Filter nach Kategorie"),
    schwierigkeit: int | None = Query(None, ge=1, le=5, description="Filter nach Stufe"),
    wortart: str | None = Query(None, description="Filter nach Wortart"),
):
    """Gibt alle Wörter zurück (optional gefiltert)."""
    ergebnis = WOERTERBUCH

    if kategorie:
        ergebnis = [e for e in ergebnis if e.kategorie.lower() == kategorie.lower()]
    if schwierigkeit:
        ergebnis = [e for e in ergebnis if e.schwierigkeit == schwierigkeit]
    if wortart:
        ergebnis = [e for e in ergebnis if e.wortart.lower() == wortart.lower()]

    return [
        {
            "wort": e.wort,
            "definition": e.definition,
            "beispielsatz": e.beispielsatz,
            "wortart": e.wortart,
            "schwierigkeit": e.schwierigkeit,
            "synonyme": e.synonyme,
            "kategorie": e.kategorie,
        }
        for e in ergebnis
    ]


@router.get("/nachschlagen/{wort}")
def wort_suchen(wort: str):
    """Schlägt ein spezifisches Wort nach."""
    eintrag = wort_nachschlagen(wort)
    if not eintrag:
        raise HTTPException(status_code=404, detail=f"'{wort}' nicht im Wörterbuch.")

    return {
        "wort": eintrag.wort,
        "definition": eintrag.definition,
        "beispielsatz": eintrag.beispielsatz,
        "wortart": eintrag.wortart,
        "schwierigkeit": eintrag.schwierigkeit,
        "synonyme": eintrag.synonyme,
        "kategorie": eintrag.kategorie,
    }


@router.get("/wort-des-tages")
def tages_wort():
    """Gibt das Wort des Tages zurück."""
    eintrag = wort_des_tages()
    return {
        "wort": eintrag.wort,
        "definition": eintrag.definition,
        "beispielsatz": eintrag.beispielsatz,
        "wortart": eintrag.wortart,
        "schwierigkeit": eintrag.schwierigkeit,
        "synonyme": eintrag.synonyme,
        "kategorie": eintrag.kategorie,
    }


@router.get("/empfehlungen")
def wort_empfehlungen(anzahl: int = Query(3, ge=1, le=10)):
    """Gibt zufällige Wort-Empfehlungen zum Lernen."""
    empf = zufaellige_empfehlungen(anzahl)
    return [
        {"wort": e.wort, "bedeutung": e.bedeutung, "beispielsatz": e.beispielsatz}
        for e in empf
    ]


@router.get("/kategorien")
def verfuegbare_kategorien():
    """Gibt alle verfügbaren Kategorien zurück."""
    return alle_kategorien()
