"""
Situationen/Szenarien für das Eloquent-Spiel.
"""

import random


DUELL_SITUATIONEN = {
    "leicht": [
        {
            "titel": "🍽️ Das perfekte Abendessen",
            "beschreibung": "Ihr seid bei einem wichtigen Dinner eingeladen. "
                           "Der Gastgeber fragt euch: Was macht für euch "
                           "das perfekte Abendessen aus?",
            "kontext": "Formelles Dinner bei einem Geschäftspartner",
        },
        {
            "titel": "🌅 Der schönste Moment",
            "beschreibung": "Beschreibt den schönsten Moment, den ihr je "
                           "erlebt habt — so lebendig und eloquent wie möglich!",
            "kontext": "Gemütlicher Abend unter Freunden",
        },
        {
            "titel": "📚 Das eine Buch",
            "beschreibung": "Wenn ihr nur ein einziges Buch für den Rest eures "
                           "Lebens mitnehmen könntet — welches wäre es und warum?",
            "kontext": "Literarischer Salon",
        },
        {
            "titel": "🎵 Die Kraft der Musik",
            "beschreibung": "Erklärt jemandem, der noch nie Musik gehört hat, "
                           "was Musik ist und warum sie so bedeutsam für die "
                           "Menschheit ist.",
            "kontext": "Philosophischer Diskurs",
        },
        {
            "titel": "🌍 Euer Lieblingsort",
            "beschreibung": "Beschreibt euren Lieblingsort auf der Welt so, "
                           "dass jeder sofort dorthin reisen möchte.",
            "kontext": "Reisegesellschaft",
        },
        {
            "titel": "🎁 Das beste Geschenk",
            "beschreibung": "Was war das wertvollste Geschenk, das ihr je "
                           "erhalten habt? Wertvoll muss nicht teuer bedeuten.",
            "kontext": "Familientreffen",
        },
    ],
    "mittel": [
        {
            "titel": "⚖️ Gerechtigkeit",
            "beschreibung": "Ein Freund behauptet, wahre Gerechtigkeit sei "
                           "unmöglich. Überzeugt ihn vom Gegenteil — oder "
                           "stimmt ihm eloquent zu.",
            "kontext": "Politische Debatte",
        },
        {
            "titel": "🤖 Mensch vs. Maschine",
            "beschreibung": "Künstliche Intelligenz wird immer mächtiger. "
                           "Haltet eine kurze Rede darüber, was den Menschen "
                           "einzigartig macht — trotz aller Technik.",
            "kontext": "Technologie-Konferenz",
        },
        {
            "titel": "🎭 Die Maske",
            "beschreibung": "Wir alle tragen Masken im Alltag. Reflektiert "
                           "eloquent darüber, wann es gut ist, eine Maske zu "
                           "tragen — und wann man sie ablegen sollte.",
            "kontext": "Theatergala",
        },
        {
            "titel": "⏳ Die Zeit",
            "beschreibung": "Wenn ihr die Zeit anhalten könntet — würdet ihr "
                           "es tun? Argumentiert eloquent für oder gegen "
                           "diese Möglichkeit.",
            "kontext": "Wissenschaftliches Symposium",
        },
        {
            "titel": "🏛️ Die perfekte Gesellschaft",
            "beschreibung": "Beschreibt eure Vision einer idealen Gesellschaft. "
                           "Was wäre anders? Was würde gleich bleiben?",
            "kontext": "Politischer Diskurs",
        },
        {
            "titel": "🎓 Wissen vs. Weisheit",
            "beschreibung": "Was ist der Unterschied zwischen Wissen und "
                           "Weisheit? Und was ist wertvoller? Überzeugt "
                           "euer Publikum!",
            "kontext": "Universitätsvorlesung",
        },
    ],
    "schwer": [
        {
            "titel": "👑 Die Krönung",
            "beschreibung": "Ihr wurdet gerade zum Herrscher eines Landes "
                           "gekrönt. Haltet eure Antrittsrede vor dem Volk!",
            "kontext": "Feierliche Krönungszeremonie",
        },
        {
            "titel": "🕊️ Friedensverhandlung",
            "beschreibung": "Zwei verfeindete Nationen stehen kurz vor dem "
                           "Krieg. Ihr steht zwischen ihnen. Überzeugt "
                           "beide Seiten vom Frieden.",
            "kontext": "Diplomatischer Gipfel",
        },
        {
            "titel": "⚡ Vor Gericht",
            "beschreibung": "Ihr seid Anwalt und müsst einen scheinbar "
                           "hoffnungslosen Fall verteidigen. Haltet euer "
                           "leidenschaftliches Schlussplädoyer!",
            "kontext": "Gerichtssaal",
        },
        {
            "titel": "🌌 Der Sinn des Lebens",
            "beschreibung": "Auf einer philosophischen Gala werdet ihr "
                           "gefragt: Was ist der Sinn des Lebens? "
                           "Gebt die überzeugendste Antwort!",
            "kontext": "Philosophische Gala",
        },
        {
            "titel": "🔥 Die letzte Rede",
            "beschreibung": "Wenn ihr nur noch eine einzige Rede halten "
                           "könntet, die die ganze Welt hört — was "
                           "würdet ihr sagen?",
            "kontext": "Weltweite Übertragung",
        },
    ],
}


def zufalls_situation(schwierigkeit: str = None) -> dict:
    """Gibt eine zufällige Situation zurück."""
    if schwierigkeit and schwierigkeit in DUELL_SITUATIONEN:
        return random.choice(DUELL_SITUATIONEN[schwierigkeit])

    schwierigkeiten = ["leicht", "leicht", "mittel", "mittel", "mittel", "schwer"]
    s = random.choice(schwierigkeiten)
    return random.choice(DUELL_SITUATIONEN[s])


def situation_fuer_runde(runde: int) -> dict:
    """Gibt eine passende Situation für die Runde zurück."""
    if runde <= 1:
        return zufalls_situation("leicht")
    elif runde <= 2:
        return zufalls_situation("mittel")
    else:
        return zufalls_situation("schwer")
