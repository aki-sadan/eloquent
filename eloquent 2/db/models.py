"""
Datenbank-Modelle für Eloquent.
SQLAlchemy ORM — skaliert von SQLite bis PostgreSQL.
"""

from datetime import datetime, timezone
from sqlalchemy import (
    Column, Integer, String, Float, Boolean, DateTime,
    ForeignKey, Text, JSON, create_engine
)
from sqlalchemy.orm import declarative_base, relationship, Session

Base = declarative_base()


class Spieler(Base):
    """Spieler-Profil."""
    __tablename__ = "spieler"

    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String(50), unique=True, nullable=False, index=True)
    name_anzeige = Column(String(50), nullable=False)  # Original-Schreibweise
    erstellt = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    letzte_aktivitaet = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    # Pokale & Rang
    pokale = Column(Integer, default=0)

    # Duell-Statistik
    duelle_gespielt = Column(Integer, default=0)
    duelle_gewonnen = Column(Integer, default=0)
    duelle_verloren = Column(Integer, default=0)
    duelle_unentschieden = Column(Integer, default=0)

    # Punkte
    hoechste_punktzahl = Column(Float, default=0)
    gesamtpunkte = Column(Float, default=0)
    perfekte_runden = Column(Integer, default=0)
    runden_ueber_80 = Column(Integer, default=0)

    # Story
    story_kapitel = Column(Integer, default=0)
    story_abgeschlossen = Column(Boolean, default=False)

    # Wortschatz
    gehobene_woerter_verwendet = Column(Integer, default=0)
    gehobene_woerter_set = Column(JSON, default=list)

    # Serien
    aktuelle_siegesserie = Column(Integer, default=0)
    laengste_siegesserie = Column(Integer, default=0)
    runden_gespielt = Column(Integer, default=0)

    # Beziehungen
    trophaeen = relationship("SpielerTrophae", back_populates="spieler")
    duell_teilnahmen = relationship("DuellTeilnahme", back_populates="spieler")
    antworten = relationship("Antwort", back_populates="spieler")

    def to_dict(self) -> dict:
        return {
            "id": self.id,
            "name": self.name_anzeige,
            "pokale": self.pokale,
            "duelle_gespielt": self.duelle_gespielt,
            "duelle_gewonnen": self.duelle_gewonnen,
            "duelle_verloren": self.duelle_verloren,
            "duelle_unentschieden": self.duelle_unentschieden,
            "hoechste_punktzahl": self.hoechste_punktzahl,
            "story_kapitel": self.story_kapitel,
            "story_abgeschlossen": self.story_abgeschlossen,
            "gehobene_woerter_verwendet": self.gehobene_woerter_verwendet,
            "aktuelle_siegesserie": self.aktuelle_siegesserie,
            "laengste_siegesserie": self.laengste_siegesserie,
            "runden_gespielt": self.runden_gespielt,
            "trophaeen": [t.trophae_id for t in (self.trophaeen or [])],
        }


class Duell(Base):
    """Ein Duell zwischen zwei Spielern."""
    __tablename__ = "duelle"

    id = Column(Integer, primary_key=True, autoincrement=True)
    erstellt = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    status = Column(String(20), default="laufend")  # laufend, beendet, abgebrochen
    aktuelle_runde = Column(Integer, default=1)
    gesamt_runden = Column(Integer, default=3)

    # Ergebnis
    gewinner_id = Column(Integer, ForeignKey("spieler.id"), nullable=True)
    unentschieden = Column(Boolean, default=False)
    pokale_gewinner = Column(Integer, default=0)
    pokale_verlierer = Column(Integer, default=0)

    # Beziehungen
    teilnahmen = relationship("DuellTeilnahme", back_populates="duell")
    runden = relationship("DuellRunde", back_populates="duell")


class DuellTeilnahme(Base):
    """Verknüpfung Spieler <-> Duell."""
    __tablename__ = "duell_teilnahmen"

    id = Column(Integer, primary_key=True, autoincrement=True)
    duell_id = Column(Integer, ForeignKey("duelle.id"), nullable=False)
    spieler_id = Column(Integer, ForeignKey("spieler.id"), nullable=False)
    gesamtpunkte = Column(Float, default=0)
    runden_gewonnen = Column(Integer, default=0)

    duell = relationship("Duell", back_populates="teilnahmen")
    spieler = relationship("Spieler", back_populates="duell_teilnahmen")


class DuellRunde(Base):
    """Eine einzelne Runde innerhalb eines Duells."""
    __tablename__ = "duell_runden"

    id = Column(Integer, primary_key=True, autoincrement=True)
    duell_id = Column(Integer, ForeignKey("duelle.id"), nullable=False)
    runden_nummer = Column(Integer, nullable=False)
    situation_id = Column(String(100))  # Referenz zur Situation
    situation_titel = Column(String(200))
    situation_beschreibung = Column(Text)
    schwierigkeit = Column(String(20))

    duell = relationship("Duell", back_populates="runden")
    antworten = relationship("Antwort", back_populates="runde")


class Antwort(Base):
    """Eine Spieler-Antwort mit Bewertung."""
    __tablename__ = "antworten"

    id = Column(Integer, primary_key=True, autoincrement=True)
    runde_id = Column(Integer, ForeignKey("duell_runden.id"), nullable=False)
    spieler_id = Column(Integer, ForeignKey("spieler.id"), nullable=False)
    text = Column(Text, nullable=False)
    erstellt = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    # Bewertung
    gesamtpunkte = Column(Float, default=0)
    note = Column(String(30))
    bewertung_json = Column(JSON)  # Vollständiges BewertungsErgebnis
    bewertet_mit = Column(String(20), default="ki")  # "ki" oder "regeln"

    # Erkannte Elemente
    gehobene_woerter = Column(JSON, default=list)
    rhetorische_mittel_anzahl = Column(Integer, default=0)

    runde = relationship("DuellRunde", back_populates="antworten")
    spieler = relationship("Spieler", back_populates="antworten")


class SpielerTrophae(Base):
    """Freigeschaltete Trophäen eines Spielers."""
    __tablename__ = "spieler_trophaeen"

    id = Column(Integer, primary_key=True, autoincrement=True)
    spieler_id = Column(Integer, ForeignKey("spieler.id"), nullable=False)
    trophae_id = Column(String(50), nullable=False)
    freigeschaltet_am = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    spieler = relationship("Spieler", back_populates="trophaeen")


class WortDesTages(Base):
    """Wort des Tages — Archiv."""
    __tablename__ = "wort_des_tages"

    id = Column(Integer, primary_key=True, autoincrement=True)
    datum = Column(DateTime, unique=True, nullable=False)
    wort = Column(String(100), nullable=False)
    definition = Column(Text)
    beispielsatz = Column(Text)
