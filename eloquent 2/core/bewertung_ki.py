"""
🧠 ELOQUENT — KI-Bewertungssystem

Das Herzstück des Spiels. Bewertet Antworten kontextbezogen mit einem LLM.

Vorteile gegenüber dem alten Regex-System:
- Versteht Kontext (passt Antwort zur Situation?)
- Erkennt echte Metaphern, nicht nur "wie ein..."
- Bewertet Argumentationsqualität
- Erkennt Gaming/Unsinn
- Gibt konstruktives, personalisiertes Feedback

Fallback: Regelbasiertes System wenn kein API-Key vorhanden.
"""

import json
import os
import httpx
from dataclasses import dataclass, field, asdict
from typing import Optional

from .config import PUNKTE_KONFIG, ANTHROPIC_MODEL, BEWERTUNG_TEMPERATUR, note_ermitteln


# ══════════════════════════════════════════════════════════════
# Datenklassen für typsichere Ergebnisse
# ══════════════════════════════════════════════════════════════

@dataclass
class KategorieBewertung:
    """Bewertung einer einzelnen Kategorie."""
    punkte: float
    max_punkte: float
    feedback: str
    details: dict = field(default_factory=dict)


@dataclass
class RhetorischesMittel:
    """Ein erkanntes rhetorisches Mittel."""
    name: str          # z.B. "Metapher"
    beispiel: str      # Das konkrete Beispiel aus dem Text
    erklaerung: str    # Warum es effektiv ist


@dataclass
class WortEmpfehlung:
    """Ein empfohlenes gehobenes Wort."""
    wort: str
    bedeutung: str
    beispielsatz: str


@dataclass
class BewertungsErgebnis:
    """Vollständiges Bewertungsergebnis."""
    gesamtpunkte: float
    note: str
    note_emoji: str
    kategorien: dict  # name -> KategorieBewertung
    erkannte_rhetorische_mittel: list  # [RhetorischesMittel]
    gehobene_woerter_verwendet: list   # [str]
    verbesserungsvorschlaege: list      # [str]
    wort_empfehlungen: list            # [WortEmpfehlung]
    allgemeines_feedback: str
    anti_gaming_flag: bool = False     # True wenn Unsinn erkannt

    def to_dict(self) -> dict:
        """Konvertiert zu einem JSON-serialisierbaren Dict."""
        return {
            "gesamtpunkte": self.gesamtpunkte,
            "note": self.note,
            "note_emoji": self.note_emoji,
            "kategorien": {
                name: asdict(kat) for name, kat in self.kategorien.items()
            },
            "erkannte_rhetorische_mittel": [
                asdict(m) for m in self.erkannte_rhetorische_mittel
            ],
            "gehobene_woerter_verwendet": self.gehobene_woerter_verwendet,
            "verbesserungsvorschlaege": self.verbesserungsvorschlaege,
            "wort_empfehlungen": [
                asdict(w) for w in self.wort_empfehlungen
            ],
            "allgemeines_feedback": self.allgemeines_feedback,
            "anti_gaming_flag": self.anti_gaming_flag,
        }


# ══════════════════════════════════════════════════════════════
# Der Bewertungs-Prompt (das Geheimrezept)
# ══════════════════════════════════════════════════════════════

BEWERTUNGS_PROMPT = """Du bist der Bewertungsalgorithmus des Spiels "ELOQUENT — Das Wortduell".
Deine Aufgabe: Bewerte die ELOQUENZ einer deutschsprachigen Antwort auf eine gegebene Situation.

## Bewertungskategorien (Summe = 100 Punkte)

1. **Situationsbezug** (max {situationsbezug} Pkt)
   - Geht die Antwort auf die Situation ein?
   - Ist der Tonfall passend zum Kontext?
   - Wird das Thema sinnvoll behandelt?

2. **Wortvielfalt** (max {wortvielfalt} Pkt)
   - Werden verschiedene Wörter verwendet statt Wiederholungen?
   - Ist der Ausdruck abwechslungsreich?

3. **Rhetorik** (max {rhetorik} Pkt)
   - Rhetorische Mittel: Metaphern, Vergleiche, rhetorische Fragen, Alliterationen, Anaphern, Antithesen, Trikolon, Klimax, Parallelismus
   - Werden sie natürlich und effektiv eingesetzt?
   - ACHTUNG: Erzwungene oder sinnlose rhetorische Mittel zählen NICHT!

4. **Wortschatz** (max {wortschatz} Pkt)
   - Gehobene, präzise Ausdrucksweise
   - Verwendung von Fremdwörtern und gehobenem Deutsch
   - ACHTUNG: Sinnloses Aneinanderreihen gehobener Wörter = 0 Punkte!

5. **Argumentation** (max {argumentation} Pkt)
   - Logischer Aufbau
   - Überzeugende Begründungen
   - Schlüssige Gedankenführung

6. **Kreativität** (max {kreativitaet} Pkt)
   - Originelle Gedanken und Formulierungen
   - Unerwartete Perspektiven
   - Elegante Wendungen

7. **Textstruktur** (max {textstruktur} Pkt)
   - Kohärenter Aufbau (Einleitung, Hauptteil, Schluss)
   - Sinnvolle Übergänge und Bindewörter

## Anti-Gaming-Regeln
- Sinnloses Aneinanderreihen gehobener Wörter → 0 Punkte gesamt
- Antwort hat NICHTS mit der Situation zu tun → max 5 Punkte gesamt
- Copy-Paste von bekannten Texten → 0 Punkte gesamt
- Nur Stichwörter ohne Sätze → max 10 Punkte gesamt

## Antwortformat
Antworte AUSSCHLIESSLICH mit validem JSON (kein Markdown, kein Text drumherum):

{{
  "kategorien": {{
    "situationsbezug": {{"punkte": <float>, "feedback": "<1 Satz>"}},
    "wortvielfalt": {{"punkte": <float>, "feedback": "<1 Satz>"}},
    "rhetorik": {{"punkte": <float>, "feedback": "<1 Satz>"}},
    "wortschatz": {{"punkte": <float>, "feedback": "<1 Satz>"}},
    "argumentation": {{"punkte": <float>, "feedback": "<1 Satz>"}},
    "kreativitaet": {{"punkte": <float>, "feedback": "<1 Satz>"}},
    "textstruktur": {{"punkte": <float>, "feedback": "<1 Satz>"}}
  }},
  "erkannte_rhetorische_mittel": [
    {{"name": "<Name>", "beispiel": "<Zitat aus dem Text>", "erklaerung": "<Warum effektiv>"}}
  ],
  "gehobene_woerter": ["<wort1>", "<wort2>"],
  "verbesserungsvorschlaege": ["<Tipp 1>", "<Tipp 2>", "<Tipp 3>"],
  "wort_empfehlungen": [
    {{"wort": "<Wort>", "bedeutung": "<Definition>", "beispielsatz": "<Beispiel>"}}
  ],
  "allgemeines_feedback": "<2-3 Sätze konstruktives Feedback>",
  "anti_gaming": false
}}"""


# ══════════════════════════════════════════════════════════════
# Hauptklasse: KI-Bewerter
# ══════════════════════════════════════════════════════════════

class KIBewerter:
    """
    Bewertet Eloquenz mit einem LLM.

    Usage:
        bewerter = KIBewerter(api_key="sk-ant-...")
        ergebnis = await bewerter.bewerten(situation, antwort)
    """

    def __init__(self, api_key: Optional[str] = None):
        self.api_key = api_key or os.environ.get("ANTHROPIC_API_KEY")
        if not self.api_key:
            raise ValueError(
                "Kein API-Key gefunden! Setze ANTHROPIC_API_KEY als "
                "Umgebungsvariable oder übergib ihn direkt."
            )

    def _build_system_prompt(self) -> str:
        """Baut den System-Prompt mit aktuellen Punktekonfigurationen."""
        return BEWERTUNGS_PROMPT.format(**PUNKTE_KONFIG)

    def _build_user_prompt(self, situation: dict, antwort: str) -> str:
        """Baut den User-Prompt mit Situation und Antwort."""
        return f"""## Situation
**Titel:** {situation.get('titel', 'Unbekannt')}
**Kontext:** {situation.get('kontext', 'Allgemein')}
**Beschreibung:** {situation.get('beschreibung', '')}

## Antwort des Spielers
{antwort}

Bewerte diese Antwort jetzt nach den oben genannten Kriterien."""

    async def bewerten(
        self,
        situation: dict,
        antwort: str
    ) -> BewertungsErgebnis:
        """
        Bewertet eine Antwort mit dem LLM.

        Args:
            situation: Dict mit 'titel', 'kontext', 'beschreibung'
            antwort: Die zu bewertende Antwort des Spielers

        Returns:
            BewertungsErgebnis mit allen Details
        """
        # Vorab-Checks
        woerter = antwort.split()
        if len(woerter) < 5:
            return self._ungueltige_antwort(
                f"Mindestens 10 Wörter erforderlich (du hast {len(woerter)} geschrieben)."
            )

        # LLM-Anfrage
        try:
            raw_result = await self._llm_anfrage(situation, antwort)
            return self._ergebnis_parsen(raw_result)
        except Exception as e:
            # Fallback auf regelbasierte Bewertung
            print(f"[KI-Bewerter] LLM-Fehler: {e} — Nutze Fallback")
            from .bewertung_regeln import regelbasiert_bewerten
            return regelbasiert_bewerten(situation, antwort)

    async def _llm_anfrage(self, situation: dict, antwort: str) -> dict:
        """Sendet die Anfrage an die Anthropic API."""
        async with httpx.AsyncClient(timeout=30.0) as client:
            response = await client.post(
                "https://api.anthropic.com/v1/messages",
                headers={
                    "x-api-key": self.api_key,
                    "anthropic-version": "2023-06-01",
                    "content-type": "application/json",
                },
                json={
                    "model": ANTHROPIC_MODEL,
                    "max_tokens": 2000,
                    "temperature": BEWERTUNG_TEMPERATUR,
                    "system": self._build_system_prompt(),
                    "messages": [
                        {
                            "role": "user",
                            "content": self._build_user_prompt(situation, antwort),
                        }
                    ],
                },
            )
            response.raise_for_status()
            data = response.json()

            # Text aus Response extrahieren
            text = ""
            for block in data.get("content", []):
                if block.get("type") == "text":
                    text += block.get("text", "")

            # JSON parsen
            text = text.strip()
            if text.startswith("```"):
                text = text.split("\n", 1)[1].rsplit("```", 1)[0]

            return json.loads(text)

    def _ergebnis_parsen(self, raw: dict) -> BewertungsErgebnis:
        """Parst das rohe LLM-Ergebnis in ein typsicheres BewertungsErgebnis."""

        # Kategorien parsen
        kategorien = {}
        gesamt = 0.0

        for kat_name, max_punkte in PUNKTE_KONFIG.items():
            raw_kat = raw.get("kategorien", {}).get(kat_name, {})
            punkte = min(float(raw_kat.get("punkte", 0)), max_punkte)
            punkte = max(punkte, 0)  # Keine negativen Punkte
            gesamt += punkte

            kategorien[kat_name] = KategorieBewertung(
                punkte=round(punkte, 1),
                max_punkte=max_punkte,
                feedback=raw_kat.get("feedback", ""),
            )

        gesamt = round(min(gesamt, 100), 1)

        # Anti-Gaming Check
        anti_gaming = raw.get("anti_gaming", False)
        if anti_gaming:
            gesamt = min(gesamt, 5.0)
            for kat in kategorien.values():
                kat.punkte = min(kat.punkte, 1.0)

        # Note ermitteln
        note, note_emoji = note_ermitteln(gesamt)

        # Rhetorische Mittel
        rhetorische_mittel = [
            RhetorischesMittel(
                name=m.get("name", ""),
                beispiel=m.get("beispiel", ""),
                erklaerung=m.get("erklaerung", ""),
            )
            for m in raw.get("erkannte_rhetorische_mittel", [])
        ]

        # Wort-Empfehlungen
        wort_empfehlungen = [
            WortEmpfehlung(
                wort=w.get("wort", ""),
                bedeutung=w.get("bedeutung", ""),
                beispielsatz=w.get("beispielsatz", ""),
            )
            for w in raw.get("wort_empfehlungen", [])
        ]

        return BewertungsErgebnis(
            gesamtpunkte=gesamt,
            note=note,
            note_emoji=note_emoji,
            kategorien=kategorien,
            erkannte_rhetorische_mittel=rhetorische_mittel,
            gehobene_woerter_verwendet=raw.get("gehobene_woerter", []),
            verbesserungsvorschlaege=raw.get("verbesserungsvorschlaege", []),
            wort_empfehlungen=wort_empfehlungen,
            allgemeines_feedback=raw.get("allgemeines_feedback", ""),
            anti_gaming_flag=anti_gaming,
        )

    def _ungueltige_antwort(self, grund: str) -> BewertungsErgebnis:
        """Erstellt ein Ergebnis für ungültige Antworten."""
        note, emoji = note_ermitteln(0)
        return BewertungsErgebnis(
            gesamtpunkte=0,
            note="Ungültig",
            note_emoji="⚠️",
            kategorien={
                name: KategorieBewertung(0, max_p, grund)
                for name, max_p in PUNKTE_KONFIG.items()
            },
            erkannte_rhetorische_mittel=[],
            gehobene_woerter_verwendet=[],
            verbesserungsvorschlaege=[],
            wort_empfehlungen=[],
            allgemeines_feedback=grund,
            anti_gaming_flag=False,
        )


# ══════════════════════════════════════════════════════════════
# Synchroner Wrapper (für einfache Nutzung)
# ══════════════════════════════════════════════════════════════

def bewerten_sync(
    situation: dict,
    antwort: str,
    api_key: Optional[str] = None,
) -> BewertungsErgebnis:
    """
    Synchroner Wrapper für die KI-Bewertung.

    Usage:
        ergebnis = bewerten_sync(
            situation={"titel": "...", "kontext": "...", "beschreibung": "..."},
            antwort="Meine eloquente Antwort...",
        )
        print(f"Punkte: {ergebnis.gesamtpunkte}/100")
    """
    import asyncio
    bewerter = KIBewerter(api_key=api_key)
    return asyncio.run(bewerter.bewerten(situation, antwort))
