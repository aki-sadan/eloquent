"""
API-Routen für die Eloquenz-Bewertung.
Der wichtigste Endpoint des gesamten Spiels.
"""

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field
import os

router = APIRouter()


# ══════════════════════════════════════════════════════════════
# Request/Response Modelle
# ══════════════════════════════════════════════════════════════

class SituationInput(BaseModel):
    """Eine Situation/Szenario."""
    titel: str = Field(..., example="⚖️ Gerechtigkeit")
    kontext: str = Field(..., example="Politische Debatte")
    beschreibung: str = Field(
        ...,
        example="Ein Freund behauptet, wahre Gerechtigkeit sei unmöglich. "
                "Überzeugt ihn vom Gegenteil."
    )


class BewertungsRequest(BaseModel):
    """Request für eine Bewertung."""
    situation: SituationInput
    antwort: str = Field(
        ...,
        min_length=10,
        example="Gerechtigkeit mag ein unerreichbares Ideal sein, "
                "nichtsdestotrotz ist es unser edelster Kompass..."
    )
    modus: str = Field(
        default="auto",
        description="'ki' = nur KI, 'regeln' = nur Regeln, 'hybrid' = spaCy+Embeddings, 'auto' = KI mit Fallback"
    )


class KategorieResponse(BaseModel):
    punkte: float
    max_punkte: float
    feedback: str


class RhetorischesMittelResponse(BaseModel):
    name: str
    beispiel: str
    erklaerung: str


class WortEmpfehlungResponse(BaseModel):
    wort: str
    bedeutung: str
    beispielsatz: str


class BewertungsResponse(BaseModel):
    """Vollständige Bewertungsantwort."""
    gesamtpunkte: float
    note: str
    note_emoji: str
    kategorien: dict[str, KategorieResponse]
    erkannte_rhetorische_mittel: list[RhetorischesMittelResponse]
    gehobene_woerter_verwendet: list[str]
    verbesserungsvorschlaege: list[str]
    wort_empfehlungen: list[WortEmpfehlungResponse]
    allgemeines_feedback: str
    anti_gaming_flag: bool
    bewertungsmethode: str  # "ki" oder "regeln"


# ══════════════════════════════════════════════════════════════
# Endpoints
# ══════════════════════════════════════════════════════════════

@router.post("/", response_model=BewertungsResponse)
async def antwort_bewerten(request: BewertungsRequest):
    """
    🧠 Bewertet eine Antwort auf ihre Eloquenz.

    Das Herzstück von ELOQUENT. Nimmt eine Situation und eine Antwort
    und gibt eine detaillierte Bewertung mit Punkten, Feedback und
    Verbesserungsvorschlägen zurück.

    **Modi:**
    - `auto` — Versucht KI-Bewertung, fällt auf Regeln zurück
    - `ki` — Nur KI-Bewertung (braucht ANTHROPIC_API_KEY)
    - `regeln` — Nur regelbasierte Bewertung (offline)
    """
    situation = {
        "titel": request.situation.titel,
        "kontext": request.situation.kontext,
        "beschreibung": request.situation.beschreibung,
    }

    methode = "regeln"

    # Hybrid mode: spaCy + sentence-transformers
    if request.modus == "hybrid":
        try:
            from core.bewertung_hybrid import HybridBewerter
            bewerter = HybridBewerter()
            if not bewerter.available:
                raise HTTPException(
                    status_code=503,
                    detail="Hybrid-Bewertung nicht verfügbar. Installiere: pip install spacy sentence-transformers && python -m spacy download de_core_news_md"
                )
            hybrid_result = bewerter.bewerten(situation, request.antwort)
            return BewertungsResponse(
                gesamtpunkte=hybrid_result.gesamtpunkte,
                note=hybrid_result.note,
                note_emoji=hybrid_result.note_emoji,
                kategorien={
                    name: KategorieResponse(
                        punkte=kat["punkte"],
                        max_punkte=kat["max_punkte"],
                        feedback=kat["feedback"],
                    )
                    for name, kat in hybrid_result.kategorien.items()
                },
                erkannte_rhetorische_mittel=[
                    RhetorischesMittelResponse(
                        name=m["name"], beispiel=m["beispiel"], erklaerung=m["erklaerung"]
                    )
                    for m in hybrid_result.erkannte_rhetorische_mittel
                ],
                gehobene_woerter_verwendet=hybrid_result.gehobene_woerter_verwendet,
                verbesserungsvorschlaege=hybrid_result.verbesserungsvorschlaege,
                wort_empfehlungen=[],
                allgemeines_feedback=hybrid_result.allgemeines_feedback,
                anti_gaming_flag=hybrid_result.anti_gaming_flag,
                bewertungsmethode="hybrid",
            )
        except ImportError as e:
            raise HTTPException(
                status_code=503,
                detail=f"Hybrid-Abhängigkeiten fehlen: {str(e)}"
            )

    if request.modus in ("ki", "auto"):
        api_key = os.environ.get("ANTHROPIC_API_KEY")
        if api_key:
            try:
                from core.bewertung_ki import KIBewerter
                bewerter = KIBewerter(api_key=api_key)
                ergebnis = await bewerter.bewerten(situation, request.antwort)
                methode = "ki"
            except Exception as e:
                if request.modus == "ki":
                    raise HTTPException(
                        status_code=503,
                        detail=f"KI-Bewertung fehlgeschlagen: {str(e)}"
                    )
                # Auto-Modus: Fallback auf Regeln
                from core.bewertung_regeln import regelbasiert_bewerten
                ergebnis = regelbasiert_bewerten(situation, request.antwort)
        else:
            if request.modus == "ki":
                raise HTTPException(
                    status_code=400,
                    detail="ANTHROPIC_API_KEY nicht gesetzt. "
                           "Setze die Umgebungsvariable oder nutze modus='regeln'."
                )
            from core.bewertung_regeln import regelbasiert_bewerten
            ergebnis = regelbasiert_bewerten(situation, request.antwort)
    else:
        from core.bewertung_regeln import regelbasiert_bewerten
        ergebnis = regelbasiert_bewerten(situation, request.antwort)

    # BewertungsErgebnis → Response
    return BewertungsResponse(
        gesamtpunkte=ergebnis.gesamtpunkte,
        note=ergebnis.note,
        note_emoji=ergebnis.note_emoji,
        kategorien={
            name: KategorieResponse(
                punkte=kat.punkte,
                max_punkte=kat.max_punkte,
                feedback=kat.feedback,
            )
            for name, kat in ergebnis.kategorien.items()
        },
        erkannte_rhetorische_mittel=[
            RhetorischesMittelResponse(
                name=m.name, beispiel=m.beispiel, erklaerung=m.erklaerung
            )
            for m in ergebnis.erkannte_rhetorische_mittel
        ],
        gehobene_woerter_verwendet=ergebnis.gehobene_woerter_verwendet,
        verbesserungsvorschlaege=ergebnis.verbesserungsvorschlaege,
        wort_empfehlungen=[
            WortEmpfehlungResponse(
                wort=w.wort, bedeutung=w.bedeutung, beispielsatz=w.beispielsatz
            )
            for w in ergebnis.wort_empfehlungen
        ],
        allgemeines_feedback=ergebnis.allgemeines_feedback,
        anti_gaming_flag=ergebnis.anti_gaming_flag,
        bewertungsmethode=methode,
    )


@router.get("/punkte-info")
def punkte_info():
    """Gibt die Punkteverteilung und Bewertungskriterien zurück."""
    from core.config import PUNKTE_KONFIG, NOTEN
    return {
        "kategorien": PUNKTE_KONFIG,
        "summe": sum(PUNKTE_KONFIG.values()),
        "noten": [
            {"ab_punkte": grenze, "note": name, "emoji": emoji}
            for grenze, name, emoji in NOTEN
        ],
    }
