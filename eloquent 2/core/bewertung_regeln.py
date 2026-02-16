"""
Regelbasierte Fallback-Bewertung.
Funktioniert offline ohne API-Key — weniger genau als KI, aber zuverlässig.
"""

import re
import math
from collections import Counter
from .config import PUNKTE_KONFIG, note_ermitteln
from .bewertung_ki import (
    BewertungsErgebnis, KategorieBewertung,
    RhetorischesMittel, WortEmpfehlung
)
from .woerterbuch import GEHOBENE_WOERTER_SET, zufaellige_empfehlungen


# ══════════════════════════════════════════════════════════════
# Hilfsfunktionen
# ══════════════════════════════════════════════════════════════

def woerter_extrahieren(text: str) -> list[str]:
    """Extrahiert Wörter aus Text (lowercase)."""
    return re.findall(r'\b[a-zäöüßé]+\b', text.lower())


def saetze_extrahieren(text: str) -> list[str]:
    """Extrahiert Sätze aus Text."""
    saetze = re.split(r'[.!?]+', text)
    return [s.strip() for s in saetze if len(s.strip()) > 3]


# ══════════════════════════════════════════════════════════════
# Einzelbewertungen
# ══════════════════════════════════════════════════════════════

def _wortvielfalt(woerter: list[str]) -> tuple[float, str]:
    """Type-Token-Ratio mit logarithmischer Korrektur."""
    if not woerter:
        return 0, "Keine Wörter erkannt."
    
    einzigartig = len(set(woerter))
    gesamt = len(woerter)
    ratio = einzigartig / gesamt
    
    # Logarithmische Korrektur für längere Texte
    if gesamt > 30:
        korrigiert = ratio * math.log(gesamt, 8)
    else:
        korrigiert = ratio
    
    max_p = PUNKTE_KONFIG["wortvielfalt"]
    punkte = min(korrigiert * max_p, max_p)
    
    if ratio >= 0.7:
        fb = "Hervorragende Wortvielfalt!"
    elif ratio >= 0.5:
        fb = "Gute Abwechslung, einige Wiederholungen."
    else:
        fb = "Viele Wortwiederholungen — verwende Synonyme."
    
    return round(punkte, 1), fb


def _rhetorik(text: str, saetze: list[str]) -> tuple[float, str, list[RhetorischesMittel]]:
    """Erkennt rhetorische Mittel (regelbasiert)."""
    mittel = []
    punkte = 0
    max_p = PUNKTE_KONFIG["rhetorik"]
    
    text_lower = text.lower()
    woerter = text_lower.split()
    
    # Vergleiche / Metaphern
    vergleich_muster = [
        r'wie\s+(?:ein|eine|der|die|das)\s+\w+',
        r'als\s+(?:ob|würde|hätte|sei)\b',
        r'gleich\s+(?:einem|einer)\b',
    ]
    for muster in vergleich_muster:
        treffer = re.findall(muster, text_lower)
        for t in treffer:
            mittel.append(RhetorischesMittel(
                "Vergleich/Metapher", t.strip(),
                "Bildliche Sprache macht den Text lebendig."
            ))
            punkte += 4
    
    # Rhetorische Fragen
    fragen = re.findall(r'[^.!?]*\?', text)
    rhet_signale = [
        "ist es nicht", "wer kennt nicht", "was wäre",
        "sollen wir", "können wir", "ist das nicht",
        "wer möchte nicht", "denken sie nicht",
    ]
    for frage in fragen:
        if any(s in frage.lower() for s in rhet_signale):
            mittel.append(RhetorischesMittel(
                "Rhetorische Frage", frage.strip(),
                "Regt zum Nachdenken an."
            ))
            punkte += 4
    
    # Alliteration (3+ aufeinanderfolgende Wörter mit gleichem Anfang)
    for i in range(len(woerter) - 2):
        w1, w2, w3 = woerter[i], woerter[i+1], woerter[i+2]
        if (len(w1) > 2 and len(w2) > 2 and len(w3) > 2
                and w1[0] == w2[0] == w3[0] and w1[0].isalpha()):
            mittel.append(RhetorischesMittel(
                "Alliteration", f"{w1} {w2} {w3}",
                "Klangliche Wirkung durch gleiche Anfangsbuchstaben."
            ))
            punkte += 3
    
    # Anapher (gleiche Satzanfänge)
    if len(saetze) >= 2:
        anfaenge = [s.split()[0].lower() for s in saetze if s.split()]
        for i in range(len(anfaenge) - 1):
            if anfaenge[i] == anfaenge[i+1] and len(anfaenge[i]) > 2:
                mittel.append(RhetorischesMittel(
                    "Anapher", f"'{anfaenge[i]}...' (wiederholt)",
                    "Wiederholung am Satzanfang für Emphase."
                ))
                punkte += 4
    
    # Antithese
    antithesen_muster = [
        r'nicht\s+nur[\s\S]*?sondern\s+auch',
        r'einerseits[\s\S]*?andererseits',
        r'zwar[\s\S]*?aber',
        r'weder[\s\S]*?noch',
    ]
    for muster in antithesen_muster:
        if re.search(muster, text_lower):
            mittel.append(RhetorischesMittel(
                "Antithese", re.search(muster, text_lower).group()[:60],
                "Gegenüberstellung betont den Kontrast."
            ))
            punkte += 5
    
    # Trikolon (Dreierfigur) — Komma-getrennte Dreiergruppen
    trikolon = re.findall(r'(\w+),\s*(\w+)\s+und\s+(\w+)', text_lower)
    for t in trikolon:
        mittel.append(RhetorischesMittel(
            "Trikolon", f"{t[0]}, {t[1]} und {t[2]}",
            "Dreierfigur für Rhythmus und Vollständigkeit."
        ))
        punkte += 4
    
    punkte = min(punkte, max_p)
    
    if punkte >= max_p * 0.7:
        fb = "Starker Einsatz rhetorischer Mittel!"
    elif punkte >= max_p * 0.3:
        fb = "Einige rhetorische Mittel erkannt."
    else:
        fb = "Mehr rhetorische Mittel würden den Text aufwerten."
    
    return round(punkte, 1), fb, mittel


def _wortschatz(woerter: list[str]) -> tuple[float, str, list[str]]:
    """Bewertet den gehobenen Wortschatz."""
    max_p = PUNKTE_KONFIG["wortschatz"]
    gefunden = [w for w in woerter if w in GEHOBENE_WOERTER_SET]
    einzigartig = list(set(gefunden))
    anzahl = len(einzigartig)
    
    if not woerter:
        return 0, "Keine Wörter erkannt.", []
    
    anteil = len(gefunden) / len(woerter)
    
    if 0.05 <= anteil <= 0.15:
        score = 1.0
    elif 0.02 <= anteil <= 0.20:
        score = 0.7
    elif anteil > 0:
        score = 0.4
    else:
        score = 0
    
    bonus = min(anzahl * 0.05, 0.3)
    punkte = min((score + bonus) * max_p, max_p)
    
    if anzahl >= 5:
        fb = "Exzellenter gehobener Wortschatz!"
    elif anzahl >= 2:
        fb = "Gute Verwendung gehobener Ausdrücke."
    else:
        fb = "Mehr gehobene Ausdrücke würden den Text veredeln."
    
    return round(punkte, 1), fb, einzigartig


def _textstruktur(text: str, saetze: list[str]) -> tuple[float, str]:
    """Bewertet Kohärenz und Struktur."""
    max_p = PUNKTE_KONFIG["textstruktur"]
    score = 0
    
    if len(saetze) >= 3:
        score += 2
    elif len(saetze) >= 2:
        score += 1
    
    if "\n" in text:
        score += 1
    
    bindwoerter = [
        "daher", "deshalb", "jedoch", "allerdings", "trotzdem",
        "folglich", "zudem", "außerdem", "darüber hinaus", "ferner",
        "dennoch", "gleichwohl", "schließlich", "zusammenfassend",
        "zunächst", "erstens", "abschließend",
    ]
    text_lower = text.lower()
    gefunden = [bw for bw in bindwoerter if bw in text_lower]
    score += min(len(gefunden) * 0.8, 2)
    
    punkte = min(score, max_p)
    fb = "Gute Struktur." if punkte >= max_p * 0.6 else "Bindewörter und Absätze verbessern die Struktur."
    
    return round(punkte, 1), fb


def _argumentation(saetze: list[str], woerter: list[str]) -> tuple[float, str]:
    """Einfache Bewertung der Argumentationsqualität."""
    max_p = PUNKTE_KONFIG["argumentation"]
    score = 0
    
    # Mehr Sätze = tendenziell bessere Argumentation
    score += min(len(saetze) * 1.5, 5)
    
    # Kausalwörter deuten auf Argumentation hin
    kausal = ["weil", "denn", "daher", "deshalb", "folglich", "somit", "darum"]
    text = " ".join(woerter)
    score += min(sum(1 for k in kausal if k in text) * 2, 5)
    
    # Textlänge als Proxy
    if len(woerter) >= 50:
        score += 3
    elif len(woerter) >= 30:
        score += 2
    elif len(woerter) >= 15:
        score += 1
    
    punkte = min(score, max_p)
    fb = "Überzeugende Argumentation." if punkte >= max_p * 0.6 else "Begründungen stärken die Argumentation."
    
    return round(punkte, 1), fb


# ══════════════════════════════════════════════════════════════
# Hauptfunktion
# ══════════════════════════════════════════════════════════════

def regelbasiert_bewerten(situation: dict, antwort: str) -> BewertungsErgebnis:
    """
    Regelbasierte Bewertung als Fallback (kein LLM nötig).
    Weniger präzise, aber funktioniert offline.
    """
    woerter = woerter_extrahieren(antwort)
    saetze = saetze_extrahieren(antwort)
    
    if len(woerter) < 5:
        note, emoji = note_ermitteln(0)
        return BewertungsErgebnis(
            gesamtpunkte=0, note="Ungültig", note_emoji="⚠️",
            kategorien={n: KategorieBewertung(0, m, "Zu kurz.") for n, m in PUNKTE_KONFIG.items()},
            erkannte_rhetorische_mittel=[], gehobene_woerter_verwendet=[],
            verbesserungsvorschlaege=["Schreibe mindestens 10 Wörter."],
            wort_empfehlungen=[], allgemeines_feedback="Antwort zu kurz.",
        )
    
    # Einzelbewertungen
    vielfalt_p, vielfalt_fb = _wortvielfalt(woerter)
    rhetorik_p, rhetorik_fb, rhet_mittel = _rhetorik(antwort, saetze)
    wortschatz_p, wortschatz_fb, gehobene = _wortschatz(woerter)
    struktur_p, struktur_fb = _textstruktur(antwort, saetze)
    argument_p, argument_fb = _argumentation(saetze, woerter)
    
    # Situationsbezug kann regelbasiert nicht geprüft werden → Durchschnitt
    situationsbezug_p = round(PUNKTE_KONFIG["situationsbezug"] * 0.6, 1)
    situationsbezug_fb = "Situationsbezug nur mit KI-Bewertung prüfbar."
    
    # Kreativität → einfacher Proxy
    kreativ_p = round(min(len(set(woerter)) / 30, 1.0) * PUNKTE_KONFIG["kreativitaet"], 1)
    kreativ_fb = "Kreativität nur mit KI-Bewertung voll bewertbar."
    
    gesamt = round(min(
        vielfalt_p + rhetorik_p + wortschatz_p + struktur_p +
        argument_p + situationsbezug_p + kreativ_p, 100
    ), 1)
    
    note, emoji = note_ermitteln(gesamt)
    
    # Verbesserungsvorschläge
    tipps = []
    if vielfalt_p < PUNKTE_KONFIG["wortvielfalt"] * 0.5:
        tipps.append("Verwende mehr Synonyme statt Wortwiederholungen.")
    if rhetorik_p < PUNKTE_KONFIG["rhetorik"] * 0.3:
        tipps.append("Rhetorische Mittel wie Vergleiche oder rhetorische Fragen aufwerten den Text.")
    if wortschatz_p < PUNKTE_KONFIG["wortschatz"] * 0.3:
        tipps.append("Gehobene Ausdrücke wie 'nichtsdestotrotz' oder 'eloquent' bringen Punkte.")
    if struktur_p < PUNKTE_KONFIG["textstruktur"] * 0.5:
        tipps.append("Bindewörter wie 'darüber hinaus' und 'folglich' verbessern die Struktur.")
    
    # Wort-Empfehlungen
    empfehlungen = zufaellige_empfehlungen(3, bereits_verwendet=gehobene)
    
    return BewertungsErgebnis(
        gesamtpunkte=gesamt,
        note=note,
        note_emoji=emoji,
        kategorien={
            "situationsbezug": KategorieBewertung(situationsbezug_p, PUNKTE_KONFIG["situationsbezug"], situationsbezug_fb),
            "wortvielfalt": KategorieBewertung(vielfalt_p, PUNKTE_KONFIG["wortvielfalt"], vielfalt_fb),
            "rhetorik": KategorieBewertung(rhetorik_p, PUNKTE_KONFIG["rhetorik"], rhetorik_fb),
            "wortschatz": KategorieBewertung(wortschatz_p, PUNKTE_KONFIG["wortschatz"], wortschatz_fb),
            "argumentation": KategorieBewertung(argument_p, PUNKTE_KONFIG["argumentation"], argument_fb),
            "kreativitaet": KategorieBewertung(kreativ_p, PUNKTE_KONFIG["kreativitaet"], kreativ_fb),
            "textstruktur": KategorieBewertung(struktur_p, PUNKTE_KONFIG["textstruktur"], struktur_fb),
        },
        erkannte_rhetorische_mittel=rhet_mittel,
        gehobene_woerter_verwendet=gehobene,
        verbesserungsvorschlaege=tipps,
        wort_empfehlungen=empfehlungen,
        allgemeines_feedback=f"Regelbasierte Bewertung (Fallback). Note: {note}",
    )
