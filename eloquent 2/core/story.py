"""
📖 ELOQUENT — Story-Modus: Die Welt von Rhetorika

Eine epische Geschichte in 5 Kapiteln. Der Spieler durchläuft
die Welt von Rhetorika, meistert sprachliche Prüfungen und
lernt dabei die Kunst der Eloquenz.

Jedes Kapitel hat:
- Erzähltext (Atmosphäre & Worldbuilding)
- Dialoge mit NPCs
- Eine Eloquenz-Prüfung (wird von der KI bewertet)
- Freischaltbare Wörter & Trophäen
"""

from dataclasses import dataclass, field


@dataclass
class StoryDialog:
    """Ein Dialog-Eintrag."""
    sprecher: str
    text: str
    emotion: str = ""  # z.B. "nachdenklich", "begeistert", "streng"


@dataclass
class StoryPruefung:
    """Die Eloquenz-Prüfung am Ende eines Kapitels."""
    titel: str
    kontext: str
    beschreibung: str
    min_punkte: int       # Mindestpunkte zum Bestehen
    belohnung_pokale: int
    tipp: str             # Hinweis für den Spieler


@dataclass
class StoryKapitel:
    """Ein Kapitel der Geschichte."""
    nummer: int
    titel: str
    untertitel: str
    ort: str
    erzaehlung_intro: str       # Einführungstext
    dialoge: list               # [StoryDialog]
    erzaehlung_uebergang: str   # Text vor der Prüfung
    pruefung: StoryPruefung
    erzaehlung_outro: str       # Text nach bestandener Prüfung
    freigeschaltete_woerter: list  # Neue Wörter die man lernt
    kapitelbild: str            # Emoji/Symbol


# ══════════════════════════════════════════════════════════════
# Die Geschichte von Rhetorika
# ══════════════════════════════════════════════════════════════

PROLOG = """In einer Welt, in der Worte mächtiger sind als Schwerter, liegt das
sagenumwobene Reich RHETORIKA — ein Land, in dem die Kunst der Sprache
über Aufstieg und Fall entscheidet.

Du bist ein junger Wanderer, der an den Toren von Rhetorika steht.
Man sagt, wer alle fünf Prüfungen der Großen Hallen besteht,
erhält den Titel des ELOQUENZ-MEISTERS — die höchste Ehre,
die einem Sprachkünstler zuteil werden kann.

Doch der Weg dorthin ist lang. Nur wer wahre Eloquenz in sich trägt,
wird die Wächter überzeugen und die Hallen durchschreiten können.

Deine Reise beginnt..."""


KAPITEL = [
    # ══════════════════════════════════════════════════════════
    # KAPITEL 1: Die Halle der Anfänge
    # ══════════════════════════════════════════════════════════
    StoryKapitel(
        nummer=1,
        titel="Die Halle der Anfänge",
        untertitel="Wo jede Reise beginnt",
        ort="Tor von Rhetorika",
        kapitelbild="🏛️",

        erzaehlung_intro="""Die massiven Tore von Rhetorika ragen vor dir auf wie versteinerte
Erzählungen aus einer vergangenen Epoche. Uralte Schriftzeichen
zieren den Bogen — Worte, die seit Jahrhunderten unverändert geblieben
sind, weil niemand jemals schöner auszudrücken vermochte, was sie sagen.

Ein alter Mann in einer silbernen Robe steht am Eingang. Seine Augen
scheinen jedes Wort zu wiegen, das in seiner Nähe gesprochen wird.
Er mustert dich mit einem Blick, der zugleich gütig und prüfend ist.""",

        dialoge=[
            StoryDialog("Wächter Aldric", "Halt, junger Wanderer. Niemand betritt Rhetorika, ohne seine Absicht in Worte zu kleiden.", "streng"),
            StoryDialog("Du", "Ich bin hier, um die Kunst der Eloquenz zu erlernen.", ""),
            StoryDialog("Wächter Aldric", "Eloquenz... Ein großes Wort. Doch weißt du auch, was es bedeutet?", "nachdenklich"),
            StoryDialog("Wächter Aldric", "Eloquenz ist nicht das Anhäufen komplizierter Wörter. Es ist die Fähigkeit, den richtigen Gedanken in die richtigen Worte zu gießen — wie ein Goldschmied, der rohes Metall in ein Kunstwerk verwandelt.", "weise"),
            StoryDialog("Wächter Aldric", "Ich gebe dir eine erste Aufgabe. Bestehe sie, und die Tore öffnen sich.", "ernst"),
        ],

        erzaehlung_uebergang="""Aldric tritt zur Seite und deutet auf eine steinerne Tafel,
in die eine Situation eingemeißelt ist. Die Buchstaben leuchten
in warmem Gold. Du spürst: Dies ist deine erste Prüfung.""",

        pruefung=StoryPruefung(
            titel="🌅 Die erste Beschreibung",
            kontext="Prüfung am Tor von Rhetorika",
            beschreibung="Wächter Aldric bittet dich: Beschreibe den Sonnenuntergang, "
                        "den du auf deiner Reise hierher gesehen hast — so lebendig "
                        "und bildreich, dass ich ihn vor meinen Augen sehen kann.",
            min_punkte=35,
            belohnung_pokale=30,
            tipp="Tipp: Verwende Vergleiche ('wie ein...') und sprich mehrere Sinne an — "
                 "nicht nur Farben, auch Geräusche und Gefühle!",
        ),

        erzaehlung_outro="""Aldric nickt langsam. Ein seltenes Lächeln huscht über sein Gesicht.

'Nicht schlecht für einen Anfänger', sagt er, und zum ersten Mal
klingt Wärme in seiner Stimme mit. 'Du hast etwas in dir.
Etwas, das man nicht lehren kann — nur wecken.'

Die Tore von Rhetorika schwingen auf. Vor dir erstreckt sich
eine Stadt aus Bibliotheken und Amphitheatern, aus Türmen,
die aus gestapelten Büchern zu bestehen scheinen, und Brücken,
deren Geländer mit Zitaten verziert sind.

Deine Reise hat begonnen.""",

        freigeschaltete_woerter=["eloquent", "artikulieren", "nichtsdestotrotz"],
    ),

    # ══════════════════════════════════════════════════════════
    # KAPITEL 2: Der Marktplatz der Argumente
    # ══════════════════════════════════════════════════════════
    StoryKapitel(
        nummer=2,
        titel="Der Marktplatz der Argumente",
        untertitel="Wo Meinungen gehandelt werden",
        ort="Zentraler Marktplatz, Rhetorika",
        kapitelbild="🏪",

        erzaehlung_intro="""Der Marktplatz von Rhetorika ist wie kein anderer Markt, den du
je gesehen hast. Hier werden keine Waren feilgeboten, sondern
Argumente. An jedem Stand debattieren Menschen leidenschaftlich
über Fragen der Philosophie, der Ethik und des Lebens.

Eine junge Frau mit feurigen Augen und einer Toga aus rotem Samt
tritt dir in den Weg. Sie trägt das Abzeichen der Debattiermeister.""",

        dialoge=[
            StoryDialog("Meisterin Lyra", "Du bist neu. Ich rieche es an deiner Wortwahl — noch frisch, noch ungeschliffen.", "amüsiert"),
            StoryDialog("Du", "Ich bin gekommen, um zu lernen.", ""),
            StoryDialog("Meisterin Lyra", "Lernen? Auf dem Marktplatz lernt man nicht aus Büchern. Hier lernt man, indem man streitet!", "begeistert"),
            StoryDialog("Meisterin Lyra", "Die wahre Kunst der Argumentation ist nicht, Recht zu haben. Es ist, den anderen zum Nachdenken zu bringen. Ein Argument, das den Gegner verstummen lässt, ist gut. Eines, das ihn nachdenklich macht, ist brillant.", "lehrend"),
            StoryDialog("Meisterin Lyra", "Ich habe eine Debatte für dich. Zeig mir, dass du nicht nur reden, sondern überzeugen kannst.", "herausfordernd"),
        ],

        erzaehlung_uebergang="""Lyra führt dich zu einem kleinen Amphitheater mitten auf dem
Marktplatz. Ein Dutzend Zuschauer versammeln sich. Alle Augen
richten sich auf dich. Lyra stellt die Frage — und wartet.""",

        pruefung=StoryPruefung(
            titel="⚖️ Die große Debatte",
            kontext="Amphitheater auf dem Marktplatz von Rhetorika",
            beschreibung="Meisterin Lyra stellt dir die Frage: 'Ist es besser, ein "
                        "unbequemer Wahrheitssprecher zu sein — oder ein geschickter "
                        "Diplomat, der seine Worte wählt, um Harmonie zu bewahren?' "
                        "Überzeuge das Publikum von deiner Position!",
            min_punkte=45,
            belohnung_pokale=50,
            tipp="Tipp: Benutze Antithesen ('Nicht nur... sondern auch...') und "
                 "bringe konkrete Beispiele. Rhetorische Fragen fesseln das Publikum!",
        ),

        erzaehlung_outro="""Das Publikum applaudiert. Manche nicken nachdenklich,
andere diskutieren aufgeregt. Lyra verschränkt die Arme
und mustert dich mit neuem Respekt.

'Du hast Talent', sagt sie schließlich. 'Rohes Talent,
aber Talent. Der Marktplatz hat dir etwas geschenkt:
die Fähigkeit, nicht nur zu sprechen, sondern zu überzeugen.'

Sie reicht dir eine kleine Brosche in Form einer Feder.
'Das Zeichen des Debattierers. Trage es mit Stolz.'

Du spürst: Deine Worte haben an Gewicht gewonnen.""",

        freigeschaltete_woerter=["stringent", "Quintessenz", "ambivalent", "gleichwohl"],
    ),

    # ══════════════════════════════════════════════════════════
    # KAPITEL 3: Die Bibliothek der verlorenen Worte
    # ══════════════════════════════════════════════════════════
    StoryKapitel(
        nummer=3,
        titel="Die Bibliothek der verlorenen Worte",
        untertitel="Wo vergessene Sprache weiterlebt",
        ort="Große Bibliothek von Rhetorika",
        kapitelbild="📜",

        erzaehlung_intro="""Die Große Bibliothek von Rhetorika erstreckt sich über sieben
Stockwerke, jedes einem anderen Zeitalter der Sprache gewidmet.
Hier lagern Wörter, die die Menschen vergessen haben —
wunderschöne Ausdrücke, die einst die Herzen bewegten und nun
verstauben in Regalen aus Mahagoni und Marmor.

In der Mitte der Halle sitzt ein blinder Gelehrter. Obwohl er
nicht sehen kann, scheint er jede Bewegung um sich herum
wahrzunehmen — als ob die Worte in der Luft ihm alles verraten.""",

        dialoge=[
            StoryDialog("Gelehrter Erasmus", "Deine Schritte klingen unsicher. Aber deine Worte... die habe ich bereits gehört. Der Marktplatz raunt mir alles zu.", "ruhig"),
            StoryDialog("Du", "Dann wisst Ihr, warum ich hier bin.", ""),
            StoryDialog("Gelehrter Erasmus", "Du suchst Wortschatz. Aber Wortschatz ist keine Münzsammlung, die man in der Tasche trägt. Es ist ein lebendiger Garten, der gepflegt werden will.", "weise"),
            StoryDialog("Gelehrter Erasmus", "In dieser Bibliothek schlummern Wörter, die so mächtig sind, dass ein einziges den Lauf eines Gesprächs verändern kann. 'Ephemer' — flüchtig wie ein Traum. 'Sublim' — so erhaben, dass Worte dafür eigentlich nicht reichen.", "schwärmerisch"),
            StoryDialog("Gelehrter Erasmus", "Deine Prüfung: Zeig mir, dass du nicht nur Wörter sammelst, sondern ihnen Leben einhauchst. Ein Wort ohne Kontext ist wie ein Vogel ohne Flügel.", "ernst"),
        ],

        erzaehlung_uebergang="""Erasmus erhebt sich und führt dich tiefer in die Bibliothek.
Zwischen Regalen, die bis zur Decke reichen, bleibt er stehen
und legt seine Hand auf ein altes, in Leder gebundenes Buch.

'Schreibe', flüstert er. 'Schreibe so, dass die vergessenen
Wörter wieder atmen.'""",

        pruefung=StoryPruefung(
            titel="📜 Die Stimme der vergessenen Worte",
            kontext="Tiefe Halle der Großen Bibliothek",
            beschreibung="Gelehrter Erasmus bittet dich: 'Die Zeit frisst unsere "
                        "schönsten Ausdrücke. Schreibe einen Text über die Macht "
                        "der Sprache — darüber, warum Worte weiterleben, auch wenn "
                        "ihre Sprecher längst verstummt sind. Verwende so viele "
                        "gehobene Ausdrücke wie du kannst, aber natürlich!'",
            min_punkte=55,
            belohnung_pokale=70,
            tipp="Tipp: Jetzt zählt Wortschatz! Verwende gehobene Wörter aus "
                 "der Wörterbücherei — aber sie müssen sinnvoll im Satz stehen. "
                 "Metaphern über Sprache selbst wirken hier besonders stark.",
        ),

        erzaehlung_outro="""Stille füllt die Bibliothek. Dann — ein leises Rascheln.
Die Bücher um dich herum scheinen zu beben, als ob die
vergessenen Wörter in ihnen erwacht wären.

Erasmus lächelt. Eine Träne rinnt über seine Wange.
'Du hast es gespürt', sagt er leise. 'Die Worte haben
dich gewählt, nicht umgekehrt.'

Er öffnet eine verborgene Tür hinter dem letzten Regal.
Dahinter liegt eine Wendeltreppe, die in die Höhe führt.

'Die oberen Hallen warten auf dich. Aber sei gewarnt:
Was kommt, ist schwieriger als alles, was du bisher erlebt hast.'""",

        freigeschaltete_woerter=["sublim", "ephemer", "profund", "evozieren", "Paradigma", "transzendieren"],
    ),

    # ══════════════════════════════════════════════════════════
    # KAPITEL 4: Die Arena der Rhetoren
    # ══════════════════════════════════════════════════════════
    StoryKapitel(
        nummer=4,
        titel="Die Arena der Rhetoren",
        untertitel="Wo Worte zu Waffen werden",
        ort="Die Große Arena, Oberstadt",
        kapitelbild="⚔️",

        erzaehlung_intro="""Die Große Arena von Rhetorika ist ein Kolosseum aus Worten.
Tausende Zuschauer füllen die Ränge. An den Wänden prangen
die Namen vergangener Eloquenz-Meister in goldenen Lettern.

Hier finden die legendären Redeturniere statt — Duelle,
bei denen nicht Stahl, sondern Sprache die Waffe ist.
Und heute stehst du in der Arena.

Dein Gegner: Konsul Tiberius, bekannt als der 'Silberzunge'.
Seit drei Jahren hat niemand ihn in einem Rededuell besiegt.
Er steht dir gegenüber — gelassen, selbstbewusst, mit einem
Lächeln, das sagt: 'Du hast bereits verloren.'""",

        dialoge=[
            StoryDialog("Konsul Tiberius", "Noch ein Herausforderer. Wie... erfrischend.", "herablassend"),
            StoryDialog("Stadion-Sprecher", "Bürger von Rhetorika! Heute erleben wir ein Duell zwischen Konsul Tiberius, dem dreifachen Meister, und einem unbekannten Wanderer!", "feierlich"),
            StoryDialog("Konsul Tiberius", "Lass mich dir einen Rat geben, Wanderer: In dieser Arena zählt nicht, was du weißt. Es zählt, wie du es sagst. Eine mittelmäßige Idee, brillant formuliert, schlägt eine brillante Idee, mittelmäßig vorgetragen.", "lehrend"),
            StoryDialog("Du", "Dann lass uns herausfinden, ob ich beides habe.", "entschlossen"),
            StoryDialog("Konsul Tiberius", "Ha! Mut hat er also. Gut. Mut braucht man hier. Das Thema wird gestellt — und dann sprechen wir.", "amüsiert"),
        ],

        erzaehlung_uebergang="""Die Trommeln verstummen. Stille senkt sich über die Arena
wie ein schwerer Vorhang. Der Stadion-Sprecher entrollt
eine Schriftrolle und verliest das Thema. Tausende Augen
richten sich auf dich.

Dies ist der Moment, für den du trainiert hast.""",

        pruefung=StoryPruefung(
            titel="⚡ Das große Plädoyer",
            kontext="Die Große Arena von Rhetorika, vor tausend Zuschauern",
            beschreibung="Vor dem gesamten Volk von Rhetorika sollst du eine "
                        "leidenschaftliche Rede halten: 'Was macht einen wahren "
                        "Anführer aus — Stärke oder Weisheit? Und warum braucht "
                        "die Welt den einen mehr als den anderen?' "
                        "Nutze ALLE rhetorischen Mittel, die du kennst!",
            min_punkte=65,
            belohnung_pokale=100,
            tipp="Tipp: Hier zählt ALLES — Rhetorik, Wortschatz, Argumentation, "
                 "Kreativität. Nutze Trikolon, Antithesen, Metaphern, rhet. Fragen. "
                 "Baue deine Rede auf: Einleitung → Argumentation → Schluss!",
        ),

        erzaehlung_outro="""Das letzte Wort hallt durch die Arena. Stille.

Dann — ein einzelner Applaus. Dann ein zweiter. Ein dritter.
Plötzlich erhebt sich das gesamte Stadion. Der Jubel ist
ohrenbetäubend.

Tiberius steht reglos. Dann verbeugt er sich — tief und respektvoll.
'Ich habe mich geirrt', sagt er leise, nur für dich hörbar.
'Du bist kein Herausforderer. Du bist ein Nachfolger.'

Der Stadion-Sprecher verkündet: 'Der Wanderer hat bestanden!
Die letzte Halle steht offen — die Halle des Eloquenz-Meisters!'

Die Menge skandiert deinen Namen.""",

        freigeschaltete_woerter=["fulminant", "lakonisch", "Finesse", "formidabel", "mitnichten", "Impetus"],
    ),

    # ══════════════════════════════════════════════════════════
    # KAPITEL 5: Die Halle des Eloquenz-Meisters
    # ══════════════════════════════════════════════════════════
    StoryKapitel(
        nummer=5,
        titel="Die Halle des Eloquenz-Meisters",
        untertitel="Die letzte Prüfung",
        ort="Der Gipfel des Turms der Worte",
        kapitelbild="👑",

        erzaehlung_intro="""Der Turm der Worte ragt über ganz Rhetorika hinaus. Seine Spitze
verschwindet in den Wolken. Jede Stufe der Wendeltreppe trägt
ein Wort — vom einfachsten bis zum erhabensten, und mit jedem
Schritt spürst du, wie die Sprache um dich herum dichter wird,
schwerer, bedeutungsvoller.

Ganz oben, in einer Halle aus purem Licht, erwartet dich
die letzte Prüfung. Kein Gegner. Kein Publikum. Nur du
und ein leerer Thron — der Thron des Eloquenz-Meisters.

Vor dem Thron schwebt eine goldene Feder. Sie wartet auf dich.""",

        dialoge=[
            StoryDialog("Die Stimme des Turms", "Du hast alle Hallen durchschritten. Du hast gelernt zu beschreiben, zu überzeugen, Worte zu beleben und vor Massen zu bestehen.", "feierlich"),
            StoryDialog("Die Stimme des Turms", "Doch die letzte Prüfung ist die schwerste — denn sie hat keine Regeln. Kein Thema wird dir vorgegeben. Keine Struktur erwartet.", "ruhig"),
            StoryDialog("Die Stimme des Turms", "Die letzte Prüfung lautet: Sprich frei. Sprich über das, was dir am Herzen liegt. Über das, was dich bewegt, was dich antreibt, was dich menschlich macht.", "ernst"),
            StoryDialog("Die Stimme des Turms", "Denn wahre Eloquenz ist nicht Technik. Es ist die nackte, unverfälschte Wahrheit — gekleidet in die schönsten Worte, die du finden kannst.", "weise"),
            StoryDialog("Die Stimme des Turms", "Nimm die Feder. Schreibe.", "flüsternd"),
        ],

        erzaehlung_uebergang="""Du nimmst die goldene Feder. Sie ist warm in deiner Hand,
als ob sie lebt. Das Licht in der Halle pulsiert sanft.

Du schließt die Augen. Atmest ein. Und dann schreibst du —
nicht für Punkte, nicht für Pokale, nicht für einen Titel.
Sondern weil du etwas zu sagen hast.""",

        pruefung=StoryPruefung(
            titel="👑 Die letzte Rede",
            kontext="Die Halle des Eloquenz-Meisters, Gipfel des Turms der Worte",
            beschreibung="Die letzte Prüfung hat kein festes Thema. Schreibe über das, "
                        "was dich bewegt — über das Leben, die Menschheit, die Liebe, "
                        "die Sprache selbst, oder etwas völlig anderes. Dies ist dein "
                        "Meisterwerk. Zeige alles, was du gelernt hast.",
            min_punkte=70,
            belohnung_pokale=200,
            tipp="Tipp: Dies ist dein Moment. Keine Einschränkungen. Schreibe von Herzen, "
                 "aber mit all der Kunstfertigkeit, die du gesammelt hast. Jedes Wort "
                 "zählt. Mach es unvergesslich.",
        ),

        erzaehlung_outro="""Die goldene Feder glüht. Die Worte, die du geschrieben hast,
lösen sich vom Papier und schweben in die Luft, tanzen
durch die Halle wie Glühwürmchen in einer Sommernacht.

Die Stimme des Turms spricht ein letztes Mal:

'Du bist nicht nur hierher gekommen, um Eloquenz zu lernen.
Du bist gekommen, um dich selbst zu finden — in den Worten,
die du wählst, in den Gedanken, die du formst, in den
Geschichten, die du erzählst.'

'Von diesem Tag an trägst du den Titel:
MEISTER DER ELOQUENZ.'

Der Thron leuchtet auf. Die Stadt unter dir jubelt.
Dein Name wird in goldenen Lettern an der Wand der Arena
erscheinen — neben den größten Rednern, die Rhetorika
je hervorgebracht hat.

Deine Geschichte in Rhetorika ist zu Ende.
Aber deine Reise mit der Sprache hat gerade erst begonnen.

  ⚡ DU BIST EIN ELOQUENZ-MEISTER ⚡""",

        freigeschaltete_woerter=["sublim", "Dichotomie", "Ambiguität", "kulminieren", "postulieren", "schlechterdings"],
    ),
]


EPILOG = """═══════════════════════════════════════════════
             ⚡ STORY ABGESCHLOSSEN ⚡
═══════════════════════════════════════════════

Du hast alle 5 Kapitel gemeistert und den Titel
des ELOQUENZ-MEISTERS errungen.

Freigeschaltet:
  🏆 Trophäe: Geschichtenerzähler
  📖 25+ neue gehobene Wörter
  👑 Titel: Eloquenz-Meister

Deine Reise geht weiter im Duell-Modus.
Zeige der Welt, was du gelernt hast!
═══════════════════════════════════════════════"""


# ══════════════════════════════════════════════════════════════
# Hilfsfunktionen
# ══════════════════════════════════════════════════════════════

def kapitel_laden(nummer: int) -> StoryKapitel | None:
    """Lädt ein Kapitel nach Nummer (1-5)."""
    for k in KAPITEL:
        if k.nummer == nummer:
            return k
    return None


def alle_freigeschalteten_woerter(bis_kapitel: int) -> list[str]:
    """Gibt alle freigeschalteten Wörter bis zum angegebenen Kapitel zurück."""
    woerter = []
    for k in KAPITEL:
        if k.nummer <= bis_kapitel:
            woerter.extend(k.freigeschaltete_woerter)
    return woerter


def story_fortschritt(kapitel: int) -> dict:
    """Gibt den Story-Fortschritt als Dict zurück."""
    gesamt = len(KAPITEL)
    return {
        "aktuelles_kapitel": kapitel,
        "gesamt_kapitel": gesamt,
        "fortschritt_prozent": round(kapitel / gesamt * 100),
        "abgeschlossen": kapitel >= gesamt,
        "naechstes_kapitel": min(kapitel + 1, gesamt),
        "freigeschaltete_woerter": alle_freigeschalteten_woerter(kapitel),
    }
