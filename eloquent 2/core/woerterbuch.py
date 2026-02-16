"""
📚 ELOQUENT — Wörterbücherei

Gehobene deutsche Wörter mit:
- Definitionen
- Beispielsätzen
- Wortart
- Schwierigkeitsgrad
- Synonymen

Das ist die Basis — wird über die Datenbank erweitert.
"""

import random
from dataclasses import dataclass
from .bewertung_ki import WortEmpfehlung


@dataclass
class WoerterbuchEintrag:
    wort: str
    definition: str
    beispielsatz: str
    wortart: str          # Adjektiv, Substantiv, Verb, Adverb
    schwierigkeit: int    # 1-5 (1=häufig, 5=sehr selten)
    synonyme: list
    kategorie: str        # Rhetorik, Philosophie, Alltag, Wissenschaft, Emotion


# ══════════════════════════════════════════════════════════════
# Die Wörterbücherei
# ══════════════════════════════════════════════════════════════

WOERTERBUCH: list[WoerterbuchEintrag] = [
    # ── Adjektive ─────────────────────────────────────────────
    WoerterbuchEintrag(
        "eloquent", "Redegewandt; sich sprachlich geschickt und überzeugend ausdrückend.",
        "Ihre eloquente Verteidigung überzeugte selbst die schärfsten Kritiker.",
        "Adjektiv", 2, ["redegewandt", "wortgewandt", "beredt"], "Rhetorik"
    ),
    WoerterbuchEintrag(
        "formidabel", "Außerordentlich beeindruckend; großartig in seiner Qualität.",
        "Der Pianist bot eine formidable Darbietung, die das Publikum in Staunen versetzte.",
        "Adjektiv", 3, ["herausragend", "beeindruckend", "großartig"], "Alltag"
    ),
    WoerterbuchEintrag(
        "exquisit", "Von besonderer, ausgesuchter Qualität; erlesen und vorzüglich.",
        "Das Restaurant servierte exquisite Speisen aus regionalen Zutaten.",
        "Adjektiv", 2, ["erlesen", "vorzüglich", "ausgesucht"], "Alltag"
    ),
    WoerterbuchEintrag(
        "sublim", "Erhaben und von höchster geistiger oder ästhetischer Qualität.",
        "Die sublime Schönheit der Berglandschaft verschlug uns die Sprache.",
        "Adjektiv", 4, ["erhaben", "hehr", "transzendent"], "Philosophie"
    ),
    WoerterbuchEintrag(
        "profund", "Tiefgehend; von großer gedanklicher Tiefe und Gründlichkeit.",
        "Seine profunde Kenntnis der Materie beeindruckte die Prüfungskommission.",
        "Adjektiv", 3, ["tiefgründig", "fundiert", "gründlich"], "Wissenschaft"
    ),
    WoerterbuchEintrag(
        "fulminant", "Überwältigend und mitreißend in seiner Wirkung.",
        "Nach einem fulminanten Auftakt steigerte sich die Aufführung zu einem unvergesslichen Erlebnis.",
        "Adjektiv", 3, ["überwältigend", "mitreißend", "grandios"], "Emotion"
    ),
    WoerterbuchEintrag(
        "akribisch", "Mit äußerster Genauigkeit und Sorgfalt vorgehend.",
        "Die akribische Recherche brachte Zusammenhänge ans Licht, die niemand vermutet hätte.",
        "Adjektiv", 2, ["peinlich genau", "minutiös", "gewissenhaft"], "Wissenschaft"
    ),
    WoerterbuchEintrag(
        "paradigmatisch", "Als Musterbeispiel dienend; vorbildhaft für eine Gattung.",
        "Goethes Faust gilt als paradigmatisches Werk der deutschen Literatur.",
        "Adjektiv", 4, ["vorbildlich", "musterhaft", "exemplarisch"], "Wissenschaft"
    ),
    WoerterbuchEintrag(
        "stringent", "Streng logisch aufgebaut; in sich schlüssig und konsequent.",
        "Die stringente Argumentation ließ keinen Raum für Widerspruch.",
        "Adjektiv", 3, ["schlüssig", "konsequent", "zwingend"], "Rhetorik"
    ),
    WoerterbuchEintrag(
        "ephemer", "Nur kurze Zeit dauernd; flüchtig und vergänglich.",
        "Der ephemere Glanz des Regenbogens erinnerte uns an die Vergänglichkeit des Schönen.",
        "Adjektiv", 5, ["flüchtig", "vergänglich", "kurzlebig"], "Philosophie"
    ),
    WoerterbuchEintrag(
        "immanent", "Innewohnend; von Natur aus in einer Sache enthalten.",
        "Die dem System immanenten Widersprüche wurden schließlich offenkundig.",
        "Adjektiv", 4, ["innewohnend", "inhärent", "wesenseigen"], "Philosophie"
    ),
    WoerterbuchEintrag(
        "ambivalent", "Zwiespältig; von widerstreitenden Gefühlen oder Haltungen geprägt.",
        "Angesichts des Angebots war sie ambivalent — begeistert und zugleich skeptisch.",
        "Adjektiv", 2, ["zwiespältig", "zwiegespalten", "widersprüchlich"], "Emotion"
    ),
    WoerterbuchEintrag(
        "lakonisch", "Kurz und knapp, aber treffend formuliert; wortkarg.",
        "Auf die Frage nach seinem Befinden antwortete er lakonisch: 'Es geht.'",
        "Adjektiv", 3, ["wortkarg", "knapp", "einsilbig"], "Rhetorik"
    ),
    WoerterbuchEintrag(
        "prätentiös", "Einen höheren Anspruch vorgebend als vorhanden; anmaßend-vornehm.",
        "Das prätentiöse Gehabe des Kritikers konnte nicht über seine mangelnde Sachkenntnis hinwegtäuschen.",
        "Adjektiv", 4, ["anmaßend", "aufgeblasen", "hochgestochen"], "Alltag"
    ),

    # ── Substantive ───────────────────────────────────────────
    WoerterbuchEintrag(
        "Eloquenz", "Die Kunst der Redegewandtheit; meisterhaftes sprachliches Ausdrucksvermögen.",
        "Seine Eloquenz verlieh selbst den alltäglichsten Themen eine fesselnde Tiefe.",
        "Substantiv", 2, ["Redegewandtheit", "Wortgewandtheit", "Beredsamkeit"], "Rhetorik"
    ),
    WoerterbuchEintrag(
        "Paradigma", "Ein grundlegendes Denk- oder Erklärungsmuster; ein Leitbild.",
        "Die Entdeckung löste einen Paradigmenwechsel in der gesamten Wissenschaft aus.",
        "Substantiv", 3, ["Denkmodell", "Leitbild", "Muster"], "Wissenschaft"
    ),
    WoerterbuchEintrag(
        "Quintessenz", "Das Wesentlichste; der Kern und Inbegriff einer Sache.",
        "Die Quintessenz seiner Rede ließ sich in einem einzigen Satz zusammenfassen.",
        "Substantiv", 3, ["Kernaussage", "Essenz", "Inbegriff"], "Philosophie"
    ),
    WoerterbuchEintrag(
        "Dichotomie", "Eine Zweiteilung; die Aufspaltung in zwei gegensätzliche Bereiche.",
        "Die Dichotomie zwischen Theorie und Praxis beschäftigt Philosophen seit Jahrhunderten.",
        "Substantiv", 4, ["Zweiteilung", "Gegensatz", "Polarität"], "Philosophie"
    ),
    WoerterbuchEintrag(
        "Ambiguität", "Mehrdeutigkeit; die Eigenschaft, mehrere Interpretationen zuzulassen.",
        "Die Ambiguität des Gedichts macht es zu einem zeitlosen Werk.",
        "Substantiv", 4, ["Mehrdeutigkeit", "Doppeldeutigkeit", "Vieldeutigkeit"], "Rhetorik"
    ),
    WoerterbuchEintrag(
        "Resilienz", "Psychische Widerstandskraft; die Fähigkeit, Krisen zu bewältigen.",
        "Ihre bemerkenswerte Resilienz half ihr, auch die schwersten Zeiten zu überstehen.",
        "Substantiv", 2, ["Widerstandskraft", "Belastbarkeit", "Stärke"], "Emotion"
    ),
    WoerterbuchEintrag(
        "Finesse", "Geschicklichkeit und Feingefühl in der Ausführung.",
        "Mit diplomatischer Finesse gelang es ihm, beide Parteien zufriedenzustellen.",
        "Substantiv", 3, ["Feingefühl", "Geschick", "Raffinesse"], "Alltag"
    ),
    WoerterbuchEintrag(
        "Konnotation", "Die Nebenbedeutung eines Wortes; das, was über die reine Definition hinausschwingt.",
        "Das Wort 'Heimat' trägt für jeden Menschen eine andere emotionale Konnotation.",
        "Substantiv", 3, ["Nebenbedeutung", "Beiklang", "Mitbedeutung"], "Rhetorik"
    ),
    WoerterbuchEintrag(
        "Impetus", "Anstoß oder Antrieb; die treibende Kraft hinter einer Handlung.",
        "Der Impetus für die Reform kam aus der Bevölkerung selbst.",
        "Substantiv", 4, ["Anstoß", "Antrieb", "Triebkraft"], "Philosophie"
    ),
    WoerterbuchEintrag(
        "Habitus", "Das Gesamtbild des äußeren Erscheinens und Verhaltens einer Person.",
        "Sein akademischer Habitus verriet jahrzehntelange Erfahrung im Hörsaal.",
        "Substantiv", 4, ["Erscheinungsbild", "Auftreten", "Wesen"], "Alltag"
    ),

    # ── Verben ────────────────────────────────────────────────
    WoerterbuchEintrag(
        "artikulieren", "Gedanken klar und deutlich in Worte fassen; zum Ausdruck bringen.",
        "Sie verstand es meisterhaft, komplexe Sachverhalte verständlich zu artikulieren.",
        "Verb", 2, ["ausdrücken", "formulieren", "darlegen"], "Rhetorik"
    ),
    WoerterbuchEintrag(
        "konstatieren", "Etwas als Tatsache feststellen; sachlich und bestimmt erklären.",
        "Man musste konstatieren, dass die bisherigen Maßnahmen unzureichend waren.",
        "Verb", 3, ["feststellen", "festhalten", "bemerken"], "Wissenschaft"
    ),
    WoerterbuchEintrag(
        "elaborieren", "Etwas sorgfältig und detailliert ausarbeiten.",
        "Im Laufe des Semesters elaborierte sie ihre Theorie zu einem überzeugenden Werk.",
        "Verb", 4, ["ausarbeiten", "verfeinern", "vertiefen"], "Wissenschaft"
    ),
    WoerterbuchEintrag(
        "evozieren", "Hervorrufen; eine Vorstellung, Erinnerung oder Emotion wachrufen.",
        "Die Musik evozierte Erinnerungen an längst vergangene Sommertage.",
        "Verb", 4, ["hervorrufen", "wachrufen", "auslösen"], "Emotion"
    ),
    WoerterbuchEintrag(
        "manifestieren", "Sichtbar oder deutlich werden lassen; zum Ausdruck bringen.",
        "Sein Engagement für Gerechtigkeit manifestierte sich in unzähligen Taten.",
        "Verb", 3, ["zeigen", "offenbaren", "deutlich machen"], "Philosophie"
    ),
    WoerterbuchEintrag(
        "transzendieren", "Über die Grenzen des Gewöhnlichen hinausgehen; überschreiten.",
        "Große Kunst transzendiert die Grenzen von Zeit und Kultur.",
        "Verb", 5, ["übersteigen", "überschreiten", "hinausgehen über"], "Philosophie"
    ),
    WoerterbuchEintrag(
        "postulieren", "Etwas als grundlegend fordern oder als gegeben annehmen.",
        "Die Verfassung postuliert die Gleichheit aller Menschen vor dem Gesetz.",
        "Verb", 3, ["fordern", "verlangen", "als Grundsatz aufstellen"], "Wissenschaft"
    ),
    WoerterbuchEintrag(
        "erörtern", "Etwas von verschiedenen Seiten eingehend besprechen und durchdenken.",
        "Wir müssen diese Frage erörtern, bevor wir eine Entscheidung treffen.",
        "Verb", 2, ["besprechen", "diskutieren", "durchleuchten"], "Rhetorik"
    ),
    WoerterbuchEintrag(
        "kulminieren", "Seinen Höhepunkt erreichen; in etwas gipfeln.",
        "Die Spannungen kulminierten in einer hitzigen Debatte vor dem Parlament.",
        "Verb", 4, ["gipfeln", "den Höhepunkt erreichen", "sich zuspitzen"], "Emotion"
    ),

    # ── Adverbien / Konjunktionen ─────────────────────────────
    WoerterbuchEintrag(
        "nichtsdestotrotz", "Trotz alledem; dennoch; ungeachtet der genannten Umstände.",
        "Die Lage war ernst — nichtsdestotrotz bewahrte sie einen kühlen Kopf.",
        "Adverb", 2, ["dennoch", "trotzdem", "gleichwohl"], "Rhetorik"
    ),
    WoerterbuchEintrag(
        "gleichwohl", "Trotzdem; nichtsdestoweniger; obgleich dem so ist.",
        "Das Vorhaben schien aussichtslos. Gleichwohl gab er nicht auf.",
        "Adverb", 3, ["trotzdem", "dennoch", "nichtsdestotrotz"], "Rhetorik"
    ),
    WoerterbuchEintrag(
        "infolgedessen", "Als Folge davon; demzufolge; als Konsequenz.",
        "Die Straße war gesperrt; infolgedessen mussten wir einen Umweg nehmen.",
        "Adverb", 3, ["demzufolge", "daher", "folglich"], "Rhetorik"
    ),
    WoerterbuchEintrag(
        "vornehmlich", "In erster Linie; hauptsächlich; vor allem.",
        "Das Museum richtet sich vornehmlich an ein kunstinteressiertes Publikum.",
        "Adverb", 3, ["hauptsächlich", "vor allem", "insbesondere"], "Alltag"
    ),
    WoerterbuchEintrag(
        "zweifelsohne", "Ohne jeden Zweifel; ganz sicher; unbestreitbar.",
        "Sie ist zweifelsohne eine der begabtesten Rednerinnen unserer Generation.",
        "Adverb", 3, ["zweifellos", "unbestritten", "fraglos"], "Rhetorik"
    ),
    WoerterbuchEintrag(
        "mitnichten", "Keineswegs; auf gar keinen Fall; durchaus nicht.",
        "Man könnte meinen, die Sache sei erledigt — mitnichten!",
        "Adverb", 4, ["keineswegs", "auf keinen Fall", "durchaus nicht"], "Rhetorik"
    ),
    WoerterbuchEintrag(
        "schlechterdings", "Schlichtweg; ganz und gar; ohne jede Einschränkung.",
        "Ein solches Verhalten ist schlechterdings inakzeptabel.",
        "Adverb", 5, ["schlichtweg", "ganz und gar", "geradezu"], "Rhetorik"
    ),
]


# ══════════════════════════════════════════════════════════════
# Schnellzugriff: Set aller Wörter (lowercase) für Bewertung
# ══════════════════════════════════════════════════════════════

GEHOBENE_WOERTER_SET: set[str] = set()
for eintrag in WOERTERBUCH:
    GEHOBENE_WOERTER_SET.add(eintrag.wort.lower())
    for syn in eintrag.synonyme:
        GEHOBENE_WOERTER_SET.add(syn.lower())

# Erweitert mit häufigen gehobenen Wörtern ohne vollen Eintrag
_EXTRA_WOERTER = {
    "brillant", "sophisticated", "grandios", "phänomenal",
    "bemerkenswert", "erstaunlich", "fabelhaft", "prächtig",
    "glorreich", "majestätisch", "erhaben", "eindrucksvoll",
    "anmutig", "beredt", "überzeugend", "mitreißend",
    "tiefgründig", "scharfsinnig", "geistvoll", "geistreich",
    "elementar", "fundamental", "essentiell", "unerlässlich",
    "dezidiert", "makellos", "tadellos", "vortrefflich",
    "meisterhaft", "virtuos", "exemplarisch", "mustergültig",
    "kohärent", "nuance", "subtilität", "allegorie",
    "hyperbel", "litotes", "euphemismus", "paradoxon",
    "integrität", "kompetenz", "empathie", "harmonie",
    "reflektieren", "proklamieren", "argumentieren",
    "implizieren", "illustrieren", "demonstrieren",
    "veranschaulichen", "rekapitulieren", "resümieren",
    "differenzieren", "analysieren", "evaluieren",
    "überdies", "insbesondere", "unweigerlich", "zweifelsfrei",
    "indessen", "dementsprechend", "desgleichen",
    "nichtsdestoweniger", "unzweifelhaft",
}
GEHOBENE_WOERTER_SET.update(_EXTRA_WOERTER)


# ══════════════════════════════════════════════════════════════
# Hilfsfunktionen
# ══════════════════════════════════════════════════════════════

def wort_nachschlagen(wort: str) -> WoerterbuchEintrag | None:
    """Schlägt ein Wort im Wörterbuch nach."""
    wort_lower = wort.lower()
    for eintrag in WOERTERBUCH:
        if eintrag.wort.lower() == wort_lower:
            return eintrag
    return None


def woerter_nach_kategorie(kategorie: str) -> list[WoerterbuchEintrag]:
    """Gibt alle Wörter einer Kategorie zurück."""
    return [e for e in WOERTERBUCH if e.kategorie == kategorie]


def woerter_nach_schwierigkeit(stufe: int) -> list[WoerterbuchEintrag]:
    """Gibt alle Wörter einer Schwierigkeitsstufe zurück."""
    return [e for e in WOERTERBUCH if e.schwierigkeit == stufe]


def wort_des_tages() -> WoerterbuchEintrag:
    """Gibt ein 'Wort des Tages' zurück (deterministisch pro Tag)."""
    from datetime import date
    tag_index = date.today().toordinal() % len(WOERTERBUCH)
    return WOERTERBUCH[tag_index]


def zufaellige_empfehlungen(
    anzahl: int = 3,
    bereits_verwendet: list[str] | None = None,
) -> list[WortEmpfehlung]:
    """Gibt zufällige Wort-Empfehlungen zurück."""
    bereits = set(w.lower() for w in (bereits_verwendet or []))
    verfuegbar = [e for e in WOERTERBUCH if e.wort.lower() not in bereits]
    
    if not verfuegbar:
        verfuegbar = WOERTERBUCH
    
    auswahl = random.sample(verfuegbar, min(anzahl, len(verfuegbar)))
    return [
        WortEmpfehlung(
            wort=e.wort,
            bedeutung=e.definition,
            beispielsatz=e.beispielsatz,
        )
        for e in auswahl
    ]


def alle_kategorien() -> list[str]:
    """Gibt alle verfügbaren Kategorien zurück."""
    return sorted(set(e.kategorie for e in WOERTERBUCH))


def statistik() -> dict:
    """Gibt Statistiken über die Wörterbücherei zurück."""
    return {
        "gesamt": len(WOERTERBUCH),
        "mit_synonymen": len(GEHOBENE_WOERTER_SET),
        "kategorien": {
            kat: len(woerter_nach_kategorie(kat))
            for kat in alle_kategorien()
        },
        "nach_wortart": {
            wortart: len([e for e in WOERTERBUCH if e.wortart == wortart])
            for wortart in sorted(set(e.wortart for e in WOERTERBUCH))
        },
    }
