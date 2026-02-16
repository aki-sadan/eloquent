"""
Migrations-Script: Überträgt Daten aus der alten spieler.json
in die neue SQLite-Datenbank und seeded Grunddaten.

Nutzung:
    python db/seed.py                    # Nur DB initialisieren
    python db/seed.py --migrate pfad/spieler.json  # + alte Daten importieren
"""

import json
import sys
import os

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from sqlalchemy.orm import Session
from db.database import engine, init_db, SessionLocal
from db.models import Base, Spieler, SpielerTrophae
from core.config import TROPHAEEN


def seed_db():
    """Initialisiert die Datenbank und prüft Trophäen."""
    init_db()
    print("✅ Datenbank initialisiert")
    print(f"   Tabellen: {list(Base.metadata.tables.keys())}")


def migrate_spieler_json(pfad: str):
    """
    Migriert Spieler aus dem alten spieler.json-Format.

    Altes Format (aus spieler.json):
    {
      "spieler_name": {
        "pokale": 13,
        "duelle_gespielt": 1,
        "duelle_gewonnen": 1,
        "duelle_verloren": 0,
        "duelle_unentschieden": 0,
        "hoechste_punktzahl": 73.5,
        "gesamtpunkte": 73.5,
        "story_kapitel": 0,
        "story_abgeschlossen": false,
        "trophaeen": ["erste_worte"],
        "aktuelle_siegesserie": 1,
        ...
      }
    }
    """
    if not os.path.exists(pfad):
        print(f"❌ Datei nicht gefunden: {pfad}")
        return

    with open(pfad, "r", encoding="utf-8") as f:
        daten = json.load(f)

    db = SessionLocal()
    migriert = 0

    try:
        for name, profil in daten.items():
            # Prüfen ob Spieler schon existiert
            existiert = db.query(Spieler).filter(
                Spieler.name == name.lower()
            ).first()

            if existiert:
                print(f"   ⏭️  {name} existiert bereits, überspringe")
                continue

            spieler = Spieler(
                name=name.lower(),
                name_anzeige=name,
                pokale=profil.get("pokale", 0),
                duelle_gespielt=profil.get("duelle_gespielt", 0),
                duelle_gewonnen=profil.get("duelle_gewonnen", 0),
                duelle_verloren=profil.get("duelle_verloren", 0),
                duelle_unentschieden=profil.get("duelle_unentschieden", 0),
                hoechste_punktzahl=profil.get("hoechste_punktzahl", 0),
                gesamtpunkte=profil.get("gesamtpunkte", 0),
                story_kapitel=profil.get("story_kapitel", 0),
                story_abgeschlossen=profil.get("story_abgeschlossen", False),
                aktuelle_siegesserie=profil.get("aktuelle_siegesserie", 0),
                laengste_siegesserie=profil.get("laengste_siegesserie", 0),
                runden_gespielt=profil.get("runden_gespielt", 0),
                perfekte_runden=profil.get("perfekte_runden", 0),
                runden_ueber_80=profil.get("runden_ueber_80", 0),
                gehobene_woerter_verwendet=profil.get("gehobene_woerter_verwendet", 0),
            )
            db.add(spieler)
            db.flush()

            # Trophäen migrieren
            for trophae_id in profil.get("trophaeen", []):
                st = SpielerTrophae(
                    spieler_id=spieler.id,
                    trophae_id=trophae_id,
                )
                db.add(st)

            migriert += 1
            print(f"   ✅ {name} migriert (Pokale: {spieler.pokale}, Siege: {spieler.duelle_gewonnen})")

        db.commit()
        print(f"\n🎉 {migriert} Spieler erfolgreich migriert!")

    except Exception as e:
        db.rollback()
        print(f"❌ Fehler bei Migration: {e}")
        raise
    finally:
        db.close()


def check_trophaeen():
    """Prüft Trophäen für alle Spieler."""
    db = SessionLocal()
    try:
        spieler_liste = db.query(Spieler).all()
        gesamt_neue = 0

        for spieler in spieler_liste:
            bestehende = {t.trophae_id for t in spieler.trophaeen}
            profil = spieler.to_dict()

            for trophae in TROPHAEEN:
                if trophae.id not in bestehende and trophae.ist_erfuellt(profil):
                    db.add(SpielerTrophae(
                        spieler_id=spieler.id,
                        trophae_id=trophae.id,
                    ))
                    gesamt_neue += 1
                    print(f"   🏆 {spieler.name_anzeige}: {trophae.name}")

        if gesamt_neue:
            db.commit()
            print(f"\n{gesamt_neue} neue Trophäen vergeben!")
        else:
            print("Keine neuen Trophäen.")

    finally:
        db.close()


if __name__ == "__main__":
    print("🎯 ELOQUENT — Datenbank-Setup")
    print("=" * 50)

    seed_db()

    if "--migrate" in sys.argv:
        idx = sys.argv.index("--migrate")
        if idx + 1 < len(sys.argv):
            pfad = sys.argv[idx + 1]
            print(f"\n📦 Migriere Spielerdaten aus: {pfad}")
            migrate_spieler_json(pfad)
            print("\n🏆 Prüfe Trophäen...")
            check_trophaeen()
        else:
            print("❌ Bitte Pfad zur spieler.json angeben!")
            print("   python db/seed.py --migrate pfad/spieler.json")
    else:
        print("\nTipp: Mit --migrate alte Spielerdaten importieren:")
        print("  python db/seed.py --migrate pfad/spieler.json")
