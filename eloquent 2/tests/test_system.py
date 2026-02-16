"""
Test: Bewertungssystem + Wörterbuch + Datenbank

Führt einen kompletten Durchlauf durch:
1. Regelbasierte Bewertung (ohne API-Key)
2. Wörterbuch-Funktionen
3. Datenbank-Operationen
"""

import sys
import os
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from core.bewertung_regeln import regelbasiert_bewerten
from core.woerterbuch import (
    wort_nachschlagen, wort_des_tages, zufaellige_empfehlungen,
    statistik, alle_kategorien, GEHOBENE_WOERTER_SET
)
from core.config import PUNKTE_KONFIG, note_ermitteln, TROPHAEEN


def test_bewertung():
    """Testet die regelbasierte Bewertung."""
    print("=" * 60)
    print("🧠 TEST: Bewertungssystem")
    print("=" * 60)

    situation = {
        "titel": "⚖️ Gerechtigkeit",
        "kontext": "Politische Debatte",
        "beschreibung": "Ein Freund behauptet, wahre Gerechtigkeit sei unmöglich. Überzeugt ihn.",
    }

    # Test 1: Gute, eloquente Antwort
    gute_antwort = (
        "Gerechtigkeit mag zweifelsohne ein unerreichbares Ideal sein, "
        "nichtsdestotrotz ist es unser edelster Kompass. Wie ein Leuchtturm "
        "in stürmischer Nacht weist sie uns den Weg, auch wenn wir das "
        "Ufer niemals erreichen. Ist es nicht so, dass gerade das Streben "
        "nach Gerechtigkeit — nicht ihre Vollendung — uns als Gesellschaft "
        "definiert? Darüber hinaus manifestiert sich wahre Gerechtigkeit "
        "nicht in perfekten Urteilen, sondern in der beharrlichen Weigerung, "
        "Ungerechtigkeit als unvermeidlich zu akzeptieren. Freiheit, Gleichheit "
        "und Brüderlichkeit — diese Trias bildet das Fundament jeder "
        "gerechten Gesellschaft. Folglich sollten wir nicht fragen, ob "
        "Gerechtigkeit möglich ist, sondern ob wir bereit sind, den Preis "
        "für ihr Streben zu zahlen."
    )

    ergebnis = regelbasiert_bewerten(situation, gute_antwort)
    print(f"\n📝 Gute Antwort:")
    print(f"   Punkte: {ergebnis.gesamtpunkte}/100")
    print(f"   Note: {ergebnis.note} {ergebnis.note_emoji}")
    print(f"\n   Kategorien:")
    for name, kat in ergebnis.kategorien.items():
        balken = "█" * int(kat.punkte / kat.max_punkte * 20)
        leer = "░" * (20 - len(balken))
        print(f"     {name:<18} {balken}{leer} {kat.punkte}/{kat.max_punkte}")
    print(f"\n   Rhetorische Mittel: {len(ergebnis.erkannte_rhetorische_mittel)}")
    for m in ergebnis.erkannte_rhetorische_mittel:
        print(f"     ✦ {m.name}: '{m.beispiel[:50]}'")
    print(f"\n   Gehobene Wörter: {ergebnis.gehobene_woerter_verwendet}")
    print(f"\n   Feedback: {ergebnis.allgemeines_feedback}")
    assert ergebnis.gesamtpunkte > 30, "Gute Antwort sollte > 30 Punkte haben!"
    print("   ✅ Test bestanden!")

    # Test 2: Kurze/schlechte Antwort
    schlechte_antwort = "Ja stimmt Gerechtigkeit ist schwer."

    ergebnis2 = regelbasiert_bewerten(situation, schlechte_antwort)
    print(f"\n📝 Schlechte Antwort:")
    print(f"   Punkte: {ergebnis2.gesamtpunkte}/100")
    print(f"   Note: {ergebnis2.note} {ergebnis2.note_emoji}")
    # Kurze Antwort sollte weniger Punkte haben
    assert ergebnis2.gesamtpunkte < ergebnis.gesamtpunkte, "Schlechte < Gute Antwort!"
    print("   ✅ Test bestanden!")

    # Test 3: Zu kurze Antwort
    zu_kurz = "Nein."
    ergebnis3 = regelbasiert_bewerten(situation, zu_kurz)
    print(f"\n📝 Zu kurze Antwort:")
    print(f"   Punkte: {ergebnis3.gesamtpunkte}/100")
    assert ergebnis3.gesamtpunkte == 0, "Zu kurze Antwort = 0 Punkte!"
    print("   ✅ Test bestanden!")

    # Test 4: Verbesserungsvorschläge
    print(f"\n📝 Verbesserungsvorschläge für schlechte Antwort:")
    for tipp in ergebnis2.verbesserungsvorschlaege:
        print(f"   💡 {tipp}")
    print("   ✅ Vorschläge generiert!")

    # Test 5: Wort-Empfehlungen
    print(f"\n📝 Wort-Empfehlungen:")
    for w in ergebnis2.wort_empfehlungen:
        print(f"   📖 {w.wort}: {w.bedeutung[:60]}...")
    print("   ✅ Empfehlungen generiert!")


def test_woerterbuch():
    """Testet die Wörterbücherei."""
    print("\n" + "=" * 60)
    print("📚 TEST: Wörterbücherei")
    print("=" * 60)

    # Statistik
    stats = statistik()
    print(f"\n   Einträge gesamt: {stats['gesamt']}")
    print(f"   Mit Synonymen: {stats['mit_synonymen']}")
    print(f"   Kategorien: {stats['kategorien']}")
    print(f"   Nach Wortart: {stats['nach_wortart']}")

    # Nachschlagen
    eintrag = wort_nachschlagen("eloquent")
    assert eintrag is not None, "'eloquent' muss im Wörterbuch sein!"
    print(f"\n   🔍 eloquent: {eintrag.definition[:60]}...")
    print(f"      Synonyme: {eintrag.synonyme}")
    print(f"      Schwierigkeit: {'⭐' * eintrag.schwierigkeit}")
    print("   ✅ Nachschlagen funktioniert!")

    # Wort des Tages
    wdt = wort_des_tages()
    print(f"\n   📅 Wort des Tages: {wdt.wort}")
    print(f"      {wdt.definition[:60]}...")
    print("   ✅ Wort des Tages funktioniert!")

    # Empfehlungen
    empf = zufaellige_empfehlungen(3)
    print(f"\n   💡 Empfehlungen:")
    for e in empf:
        print(f"      {e.wort}: {e.bedeutung[:50]}...")
    print("   ✅ Empfehlungen funktionieren!")

    # Kategorien
    kats = alle_kategorien()
    print(f"\n   📂 Kategorien: {kats}")
    print("   ✅ Kategorien funktionieren!")


def test_config():
    """Testet Konfiguration und Trophäen."""
    print("\n" + "=" * 60)
    print("⚙️  TEST: Konfiguration")
    print("=" * 60)

    # Punktesumme muss 100 sein
    summe = sum(PUNKTE_KONFIG.values())
    print(f"\n   Punkteverteilung: {PUNKTE_KONFIG}")
    print(f"   Summe: {summe}")
    assert summe == 100, f"Summe muss 100 sein, ist aber {summe}!"
    print("   ✅ Punktesumme = 100!")

    # Noten
    note, emoji = note_ermitteln(85)
    print(f"\n   85 Punkte = {note} {emoji}")
    assert note == "Herausragend"
    print("   ✅ Noten funktionieren!")

    # Trophäen (ohne eval!)
    test_profil = {"duelle_gespielt": 5, "duelle_gewonnen": 3}
    erste_worte = TROPHAEEN[0]
    assert erste_worte.ist_erfuellt(test_profil), "Erste Worte sollte erfüllt sein!"
    print(f"\n   🏆 Trophäe '{erste_worte.name}' für Profil mit 5 Duellen: ✅")

    legende = [t for t in TROPHAEEN if t.id == "legende"][0]
    assert not legende.ist_erfuellt(test_profil), "Legende sollte NICHT erfüllt sein!"
    print(f"   🏆 Trophäe '{legende.name}' für Profil mit 3 Siegen: ❌ (korrekt)")
    print("   ✅ Trophäen-System funktioniert (OHNE eval)!")


def test_datenbank():
    """Testet die Datenbank-Modelle."""
    print("\n" + "=" * 60)
    print("🗃️  TEST: Datenbank")
    print("=" * 60)

    # Temporäre In-Memory-Datenbank
    from sqlalchemy import create_engine
    from sqlalchemy.orm import Session
    from db.models import Base, Spieler, Duell, DuellTeilnahme

    engine = create_engine("sqlite:///:memory:")
    Base.metadata.create_all(bind=engine)

    with Session(engine) as db:
        # Spieler erstellen
        s1 = Spieler(name="test_spieler", name_anzeige="Test Spieler")
        s2 = Spieler(name="gegner", name_anzeige="Gegner")
        db.add_all([s1, s2])
        db.commit()

        print(f"\n   Spieler erstellt: {s1.name_anzeige} (ID: {s1.id})")
        print(f"   Spieler erstellt: {s2.name_anzeige} (ID: {s2.id})")

        # Duell erstellen
        duell = Duell(gesamt_runden=3)
        db.add(duell)
        db.flush()

        db.add(DuellTeilnahme(duell_id=duell.id, spieler_id=s1.id))
        db.add(DuellTeilnahme(duell_id=duell.id, spieler_id=s2.id))
        db.commit()

        print(f"   Duell erstellt: ID {duell.id}")
        print(f"   Teilnehmer: {len(duell.teilnahmen)}")

        # Pokale vergeben
        s1.pokale = 150
        s1.duelle_gewonnen = 5
        db.commit()

        from core.config import RAENGE
        rang = RAENGE[0]
        for r in RAENGE:
            if s1.pokale >= r["min_pokale"]:
                rang = r
        print(f"   Rang nach 150 Pokalen: {rang['symbol']} {rang['name']}")
        assert rang["name"] == "Redner", "150 Pokale = Redner!"
        print("   ✅ Datenbank funktioniert!")


if __name__ == "__main__":
    print()
    print("🎯 ELOQUENT v2.0 — System-Tests")
    print("=" * 60)

    try:
        test_config()
        test_woerterbuch()
        test_bewertung()
        test_datenbank()

        print("\n" + "=" * 60)
        print("🎉 ALLE TESTS BESTANDEN!")
        print("=" * 60)
        print()
        print("Nächste Schritte:")
        print("  1. pip install -r requirements.txt")
        print("  2. export ANTHROPIC_API_KEY='sk-ant-...'")
        print("  3. uvicorn api.main:app --reload")
        print("  4. Öffne http://localhost:8000/docs")
        print()

    except AssertionError as e:
        print(f"\n❌ TEST FEHLGESCHLAGEN: {e}")
        sys.exit(1)
    except Exception as e:
        print(f"\n💥 FEHLER: {type(e).__name__}: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)
