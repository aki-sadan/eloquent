"""
Eloquent — Konfiguration und Konstanten.
Rein logisch, KEINE UI-Abhängigkeiten.
"""

from enum import Enum
from dataclasses import dataclass

# ══════════════════════════════════════════════════════════════
# Spielkonfiguration
# ══════════════════════════════════════════════════════════════

SPIEL_NAME = "ELOQUENT"
VERSION = "2.0.0"
RUNDEN_PRO_DUELL = 3
MIN_WOERTER = 10
MAX_WOERTER = 300

# ══════════════════════════════════════════════════════════════
# Bewertungs-Konfiguration
# ══════════════════════════════════════════════════════════════

# Maximalpunkte pro Kategorie (Summe = 100)
PUNKTE_KONFIG = {
    "situationsbezug":  15,   # NEU: Passt die Antwort zur Situation?
    "wortvielfalt":     15,   # Verschiedene Wörter
    "rhetorik":         25,   # Rhetorische Mittel & Stilfiguren
    "wortschatz":       15,   # Gehobener Wortschatz
    "argumentation":    15,   # NEU: Logische Struktur & Überzeugungskraft
    "kreativitaet":     10,   # NEU: Originalität & Kreativität
    "textstruktur":      5,   # Kohärenz & Aufbau
}

# Anthropic API Konfiguration
ANTHROPIC_MODEL = "claude-sonnet-4-20250514"
BEWERTUNG_TEMPERATUR = 0.3  # Niedrig für konsistente Bewertungen


# ══════════════════════════════════════════════════════════════
# Schwierigkeitsgrade
# ══════════════════════════════════════════════════════════════

class Schwierigkeit(str, Enum):
    LEICHT = "leicht"
    MITTEL = "mittel"
    SCHWER = "schwer"


# ══════════════════════════════════════════════════════════════
# Noten-System
# ══════════════════════════════════════════════════════════════

NOTEN = [
    (95, "Meisterhaft",    "⚡"),
    (85, "Herausragend",   "🌟"),
    (75, "Ausgezeichnet",  "🏅"),
    (65, "Sehr gut",       "✨"),
    (55, "Gut",            "👍"),
    (45, "Ordentlich",     "📝"),
    (35, "Ausbaufähig",    "🔧"),
    (25, "Schwach",        "📉"),
    ( 0, "Mangelhaft",     "❌"),
]


def note_ermitteln(punkte: float) -> tuple[str, str]:
    """Gibt (Note, Emoji) für eine Punktzahl zurück."""
    for grenze, name, emoji in NOTEN:
        if punkte >= grenze:
            return name, emoji
    return "Mangelhaft", "❌"


# ══════════════════════════════════════════════════════════════
# Ränge
# ══════════════════════════════════════════════════════════════

RAENGE = [
    {"name": "Anfänger",      "symbol": "🌱", "min_pokale": 0},
    {"name": "Lehrling",      "symbol": "📝", "min_pokale": 50},
    {"name": "Redner",        "symbol": "🎤", "min_pokale": 150},
    {"name": "Dichter",       "symbol": "✒️",  "min_pokale": 300},
    {"name": "Rhetoriker",    "symbol": "📜", "min_pokale": 500},
    {"name": "Wortkünstler",  "symbol": "🎨", "min_pokale": 800},
    {"name": "Meister",       "symbol": "👑", "min_pokale": 1200},
    {"name": "Großmeister",   "symbol": "🏆", "min_pokale": 2000},
    {"name": "Legende",       "symbol": "🌟", "min_pokale": 3500},
    {"name": "Eloquenz-Gott", "symbol": "⚡", "min_pokale": 5000},
]


# ══════════════════════════════════════════════════════════════
# Trophäen (ohne eval()!)
# ══════════════════════════════════════════════════════════════

@dataclass
class Trophae:
    id: str
    name: str
    beschreibung: str
    seltenheit: str  # Bronze, Silber, Gold, Platin, Legendär
    feld: str        # Welches Profil-Feld prüfen
    operator: str    # ">=", "==", ">"
    wert: any        # Vergleichswert

    def ist_erfuellt(self, profil: dict) -> bool:
        """Prüft sicher ob die Bedingung erfüllt ist — OHNE eval()."""
        aktuell = profil.get(self.feld, 0)
        if self.operator == ">=":
            return aktuell >= self.wert
        elif self.operator == "==":
            return aktuell == self.wert
        elif self.operator == ">":
            return aktuell > self.wert
        return False


TROPHAEEN = [
    Trophae("erste_worte", "🎤 Erste Worte",
            "Spiele dein erstes Duell", "Bronze",
            "duelle_gespielt", ">=", 1),
    Trophae("wortakrobat", "🎪 Wortakrobat",
            "Gewinne 3 Duelle", "Silber",
            "duelle_gewonnen", ">=", 3),
    Trophae("eloquenz_meister", "👑 Eloquenz-Meister",
            "Gewinne 10 Duelle", "Gold",
            "duelle_gewonnen", ">=", 10),
    Trophae("rhetoriker", "📜 Rhetoriker",
            "Erreiche 90+ Punkte in einer Runde", "Gold",
            "hoechste_punktzahl", ">=", 90),
    Trophae("perfektionist", "💎 Perfektionist",
            "Erreiche 95+ Punkte", "Platin",
            "hoechste_punktzahl", ">=", 95),
    Trophae("geschichtenerzaehler", "📖 Geschichtenerzähler",
            "Schließe den Story-Modus ab", "Gold",
            "story_abgeschlossen", "==", True),
    Trophae("marathonlaeufer", "🏃 Marathonläufer",
            "Spiele 25 Duelle", "Silber",
            "duelle_gespielt", ">=", 25),
    Trophae("legende", "🌟 Legende",
            "Gewinne 50 Duelle", "Legendär",
            "duelle_gewonnen", ">=", 50),
    Trophae("wortschatz_sammler", "📚 Wortschatz-Sammler",
            "Verwende 50 verschiedene gehobene Wörter", "Silber",
            "gehobene_woerter_verwendet", ">=", 50),
    Trophae("polyglott", "🗣️ Sprachvirtuose",
            "Erreiche 80+ Punkte in 10 verschiedenen Runden", "Platin",
            "runden_ueber_80", ">=", 10),
]
