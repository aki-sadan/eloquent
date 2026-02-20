// ============================================================================
// ELOQUENT — Das Wortduell: Situationen (Kategorie-basiert)
// 12 Kategorien × 3 Schwierigkeiten × 3 Situationen = 108 Situationen
// ============================================================================

export const SITUATION_KATEGORIEN = [
  { id: "bewerbung", label: "Bewerbungsgespräch", emoji: "💼" },
  { id: "geschaeft", label: "Geschäftstreffen", emoji: "🏢" },
  { id: "diplomatie", label: "Diplomatischer Empfang", emoji: "🕊️" },
  { id: "gericht", label: "Gerichtsverhandlung", emoji: "⚖️" },
  { id: "akademie", label: "Akademische Debatte", emoji: "🎓" },
  { id: "salon", label: "Literarischer Salon", emoji: "📚" },
  { id: "politik", label: "Politische Rede", emoji: "🏛️" },
  { id: "philosophie", label: "Philosophisches Gespräch", emoji: "🤔" },
  { id: "alltag", label: "Alltag & Gesellschaft", emoji: "☕" },
  { id: "geschichte", label: "Historische Momente", emoji: "📜" },
  { id: "medizin", label: "Medizin & Arztgespräch", emoji: "🏥" },
  { id: "medien", label: "Medien & Journalismus", emoji: "🎙️" },
];

// =============================================================================
// Situationen nach Kategorie und Schwierigkeit
// 12 Kategorien × 3 Schwierigkeiten × 3 Situationen = 108 Situationen
// =============================================================================
export const SITUATIONEN_NACH_KATEGORIE = {
  // ==========================================================================
  // BEWERBUNGSGESPRÄCH
  // ==========================================================================
  bewerbung: {
    leicht: [
      {
        titel: "💼 Die Vorstellungsrunde",
        beschreibung: "Ihr steht beim Bewerbungsgespräch vor dem Personalchef. Stellt euch eloquent vor und erklärt, warum ihr die beste Wahl seid.",
        kontext: "Erstes Bewerbungsgespräch",
        schluesselwoerter: ["qualifikation", "kompetenz", "erfahrung", "stärke", "team", "motivation", "beitrag", "fähigkeit", "engagement", "potential"],
      },
      {
        titel: "🤝 Der lockere Smalltalk",
        beschreibung: "Vor dem eigentlichen Gespräch trefft ihr den Teamleiter am Empfang. Macht einen guten ersten Eindruck mit charmantem Smalltalk.",
        kontext: "Empfangsbereich der Firma",
        schluesselwoerter: ["eindruck", "sympathie", "interesse", "begeisterung", "atmosphäre", "unternehmen", "freude", "neugier", "kultur", "willkommen"],
      },
      {
        titel: "📝 Der Lebenslauf erzählt",
        beschreibung: "Erzählt eure berufliche Geschichte so lebendig, dass euer Lebenslauf wie ein spannender Roman klingt.",
        kontext: "Vorstellungsgespräch",
        schluesselwoerter: ["werdegang", "entwicklung", "station", "erfahrung", "wachstum", "leidenschaft", "herausforderung", "meilenstein", "wandel", "perspektive"],
      },
    ],
    mittel: [
      {
        titel: "🔍 Die Lücke im Lebenslauf",
        beschreibung: "Der Personaler fragt nach einer zweijährigen Lücke in eurem Lebenslauf. Erklärt sie so überzeugend, dass sie zur Stärke wird.",
        kontext: "Kritisches HR-Interview",
        schluesselwoerter: ["reflexion", "neuorientierung", "persönlichkeit", "reife", "selbstfindung", "auszeit", "weiterbildung", "erkenntnis", "mut", "ehrlichkeit"],
      },
      {
        titel: "💶 Die Gehaltsverhandlung",
        beschreibung: "Euer Traumjob — aber das Gehalt stimmt nicht. Verhandelt so geschickt, dass beide Seiten zufrieden sind.",
        kontext: "Gehaltsverhandlung",
        schluesselwoerter: ["wertschätzung", "leistung", "verantwortung", "marktüblich", "verhandlung", "kompromiss", "investition", "fairness", "mehrwert", "zukunft"],
      },
      {
        titel: "🏢 Warum dieses Unternehmen?",
        beschreibung: "Die gefürchtete Frage: Warum genau diese Firma? Überzeugt mit einer Antwort, die mehr ist als Floskeln.",
        kontext: "Bewerbungsgespräch zweite Runde",
        schluesselwoerter: ["vision", "werte", "innovation", "identifikation", "mission", "kultur", "ambition", "synergie", "überzeugung", "begeisterung"],
      },
    ],
    schwer: [
      {
        titel: "👔 Das CEO-Finale",
        beschreibung: "Letzte Runde: Nur noch ihr und der CEO. In fünf Minuten müsst ihr beweisen, warum ihr aus 200 Bewerbern herausragt.",
        kontext: "Finales Gespräch mit dem CEO",
        schluesselwoerter: ["exzellenz", "führung", "vision", "durchsetzung", "charisma", "strategie", "einzigartigkeit", "souveränität", "ambition", "überlegenheit", "ausstrahlung"],
      },
      {
        titel: "🔄 Der radikale Karrierewechsel",
        beschreibung: "Von der Philosophie zur Softwareentwicklung — verteidigt euren ungewöhnlichen Karrierewechsel vor einem skeptischen Panel.",
        kontext: "Panel-Interview",
        schluesselwoerter: ["wandel", "querdenken", "transfer", "vielseitigkeit", "anpassung", "innovation", "perspektivwechsel", "lernfähigkeit", "brücke", "bereicherung", "risiko"],
      },
      {
        titel: "🧊 Das Stressinterview",
        beschreibung: "Der Interviewer provoziert absichtlich: 'Ihr wirkt nicht besonders beeindruckend.' Behaltet die Fassung und überzeugt mit Klasse.",
        kontext: "Stresstest-Interview",
        schluesselwoerter: ["souveränität", "gelassenheit", "schlagfertigkeit", "selbstbewusstsein", "resilienz", "haltung", "eloquenz", "charisma", "überlegenheit", "stärke", "kontrolle"],
      },
    ],
  },

  // ==========================================================================
  // GESCHÄFTSTREFFEN
  // ==========================================================================
  geschaeft: {
    leicht: [
      {
        titel: "🍽️ Das Geschäftsessen",
        beschreibung: "Beim Geschäftsessen mit einem neuen Kunden sollt ihr eine angenehme Atmosphäre schaffen. Führt charmanten Smalltalk.",
        kontext: "Geschäftsessen im Restaurant",
        schluesselwoerter: ["beziehung", "vertrauen", "netzwerk", "atmosphäre", "gespräch", "interesse", "partnerschaft", "sympathie", "höflichkeit", "kennenlernen"],
      },
      {
        titel: "👥 Das Team-Meeting",
        beschreibung: "Stellt eurem Team das neue Quartalsziel vor. Motiviert alle so, dass sie mit Begeisterung in die Arbeit starten.",
        kontext: "Wöchentliches Team-Meeting",
        schluesselwoerter: ["teamgeist", "motivation", "ziel", "zusammenarbeit", "fortschritt", "energie", "gemeinsam", "leistung", "optimismus", "strategie"],
      },
      {
        titel: "🎉 Die Willkommensrede",
        beschreibung: "Ein neues Teammitglied beginnt heute. Haltet eine kurze, herzliche Begrüßungsrede, die sofort ein Zugehörigkeitsgefühl schafft.",
        kontext: "Onboarding im Büro",
        schluesselwoerter: ["willkommen", "team", "freude", "zusammenhalt", "kultur", "gemeinschaft", "unterstützung", "integration", "wertschätzung", "anfang"],
      },
    ],
    mittel: [
      {
        titel: "📊 Die Präsentation vor dem Vorstand",
        beschreibung: "Eure Abteilung hat die Zahlen nicht erreicht. Präsentiert die Ergebnisse so, dass der Vorstand trotzdem Vertrauen behält.",
        kontext: "Vorstandssitzung",
        schluesselwoerter: ["transparenz", "analyse", "maßnahme", "strategie", "vertrauen", "optimierung", "potential", "wendepunkt", "verantwortung", "perspektive", "lösung"],
      },
      {
        titel: "💡 Der Pitch",
        beschreibung: "Ihr habt eine revolutionäre Geschäftsidee. Überzeugt den Vorstand in drei Minuten, euch das Budget zu geben.",
        kontext: "Geschäftsideen-Pitch",
        schluesselwoerter: ["innovation", "markt", "potential", "rendite", "disruption", "wachstum", "investition", "einzigartigkeit", "skalierung", "durchbruch"],
      },
      {
        titel: "🔧 Das Krisengespräch",
        beschreibung: "Ein wichtiges Projekt ist gescheitert. Erklärt dem Management, was schiefgelaufen ist und wie ihr es retten könnt.",
        kontext: "Notfall-Besprechung",
        schluesselwoerter: ["verantwortung", "analyse", "lösung", "transparenz", "verbesserung", "lehre", "sofortmaßnahme", "wiederaufbau", "vertrauen", "plan"],
      },
    ],
    schwer: [
      {
        titel: "🦈 Der Milliardär",
        beschreibung: "Ein Milliardär gibt euch genau 90 Sekunden. Überzeugt ihn, in eure Vision zu investieren — jedes Wort zählt.",
        kontext: "Elevator Pitch beim Investor",
        schluesselwoerter: ["vision", "disruption", "rendite", "exklusivität", "marktführer", "skalierung", "überzeugung", "genialität", "dringlichkeit", "einmaligkeit", "durchbruch"],
      },
      {
        titel: "🛡️ Die feindliche Übernahme",
        beschreibung: "Euer Unternehmen wird feindlich übernommen. Überzeugt die Aktionäre, dass eure Strategie die bessere Zukunft bietet.",
        kontext: "Außerordentliche Hauptversammlung",
        schluesselwoerter: ["unabhängigkeit", "strategie", "wert", "zukunft", "identität", "widerstand", "überlegenheit", "vertrauen", "souveränität", "vision", "loyalität", "stärke"],
      },
      {
        titel: "🌐 Der Weltmarkt wartet",
        beschreibung: "Euer Startup expandiert international. Haltet die Rede, die Partner auf drei Kontinenten gleichzeitig überzeugt.",
        kontext: "Globale Partnerkonferenz",
        schluesselwoerter: ["expansion", "global", "partnerschaft", "kulturverständnis", "wachstum", "ambition", "vertrauen", "brücke", "zukunft", "zusammenarbeit", "innovation"],
      },
    ],
  },

  // ==========================================================================
  // DIPLOMATISCHER EMPFANG
  // ==========================================================================
  diplomatie: {
    leicht: [
      {
        titel: "🥂 Der Empfangstoast",
        beschreibung: "Beim diplomatischen Dinner sollt ihr einen Toast auf die Freundschaft zwischen zwei Nationen aussprechen.",
        kontext: "Diplomatisches Abendessen",
        schluesselwoerter: ["freundschaft", "verbundenheit", "kultur", "respekt", "tradition", "brücke", "zusammenarbeit", "gastfreundschaft", "wertschätzung", "harmonie"],
      },
      {
        titel: "🌍 Der Kulturabend",
        beschreibung: "Beim internationalen Kulturaustausch stellt ihr die Besonderheiten eurer Heimat auf charmante Weise vor.",
        kontext: "Kultureller Empfang",
        schluesselwoerter: ["heimat", "tradition", "vielfalt", "identität", "stolz", "kultur", "austausch", "bereicherung", "einzigartigkeit", "gastfreundschaft"],
      },
      {
        titel: "🤝 Der erste Handschlag",
        beschreibung: "Ihr trefft einen ausländischen Botschafter zum ersten Mal. Brecht das Eis mit Eleganz und Feingefühl.",
        kontext: "Botschaftsempfang",
        schluesselwoerter: ["respekt", "kennenlernen", "diplomatie", "höflichkeit", "interesse", "offenheit", "brücke", "verständigung", "eleganz", "dialog"],
      },
    ],
    mittel: [
      {
        titel: "⚖️ Die Handelsverhandlung",
        beschreibung: "Zwei Nationen verhandeln ein Handelsabkommen. Findet eine Lösung, die beide Seiten als Gewinn empfinden.",
        kontext: "Internationale Handelskonferenz",
        schluesselwoerter: ["abkommen", "kompromiss", "fairness", "wirtschaft", "kooperation", "verhandlung", "vorteil", "gleichgewicht", "zugeständnis", "partnerschaft", "wohlstand"],
      },
      {
        titel: "🕊️ Die Friedensmediation",
        beschreibung: "Als Mediator versucht ihr, zwei zerstrittene Parteien an den Verhandlungstisch zurückzubringen.",
        kontext: "Friedensverhandlung",
        schluesselwoerter: ["vermittlung", "dialog", "verständnis", "kompromiss", "deeskalation", "vertrauen", "geduld", "empathie", "brücke", "lösung", "frieden"],
      },
      {
        titel: "🌐 Das Klimaabkommen",
        beschreibung: "Auf dem Klimagipfel müsst ihr als Vertreter eures Landes einen ambitionierten Kompromiss aushandeln, der alle zufriedenstellt.",
        kontext: "Internationaler Klimagipfel",
        schluesselwoerter: ["klima", "verantwortung", "kompromiss", "zukunft", "nachhaltigkeit", "kooperation", "verpflichtung", "generation", "handeln", "balance", "solidarität"],
      },
    ],
    schwer: [
      {
        titel: "🏛️ Die Rede vor der UN",
        beschreibung: "Die Generalversammlung der Vereinten Nationen hört zu. Haltet eine Rede, die die Weltgemeinschaft zum Handeln bewegt.",
        kontext: "UN-Generalversammlung",
        schluesselwoerter: ["menschheit", "verantwortung", "solidarität", "gerechtigkeit", "zukunft", "handeln", "einheit", "würde", "dringlichkeit", "hoffnung", "vermächtnis", "wandel"],
      },
      {
        titel: "⚔️ Am Rande des Krieges",
        beschreibung: "Zwei Nationen stehen kurz vor dem Krieg. Mit einer einzigen Rede müsst ihr das Undenkbare verhindern.",
        kontext: "Krisenverhandlung",
        schluesselwoerter: ["frieden", "vernunft", "menschlichkeit", "deeskalation", "opfer", "verantwortung", "zukunft", "dialog", "weisheit", "mut", "besonnenheit", "überleben"],
      },
      {
        titel: "📜 Der historische Friedensvertrag",
        beschreibung: "Nach Jahrzehnten des Konflikts unterzeichnen zwei Nationen Frieden. Haltet die Rede, die diesen Moment für die Ewigkeit besiegelt.",
        kontext: "Historische Friedenszeremonie",
        schluesselwoerter: ["versöhnung", "heilung", "hoffnung", "neuanfang", "geschichte", "vermächtnis", "würde", "generation", "frieden", "transformation", "vergebung"],
      },
    ],
  },

  // ==========================================================================
  // GERICHTSVERHANDLUNG
  // ==========================================================================
  gericht: {
    leicht: [
      {
        titel: "👁️ Die Zeugenaussage",
        beschreibung: "Als Zeuge vor Gericht müsst ihr klar, ruhig und überzeugend erzählen, was ihr gesehen habt.",
        kontext: "Zeugenbefragung",
        schluesselwoerter: ["wahrheit", "beobachtung", "klarheit", "glaubwürdigkeit", "detail", "erinnerung", "genauigkeit", "sachlichkeit", "schilderung", "pflicht"],
      },
      {
        titel: "🏘️ Der Nachbarschaftsstreit",
        beschreibung: "Ein harmloser Streit um einen Gartenzaun ist vor Gericht gelandet. Verteidigt eure Position mit ruhiger Eloquenz.",
        kontext: "Amtsgericht",
        schluesselwoerter: ["nachbarschaft", "grenze", "recht", "kompromiss", "respekt", "ordnung", "friedlich", "einigung", "vernunft", "zusammenleben"],
      },
      {
        titel: "🚗 Der Verkehrsunfall",
        beschreibung: "Ein Auffahrunfall, zwei Meinungen. Schildert dem Richter eure Version der Ereignisse so sachlich und überzeugend wie möglich.",
        kontext: "Verkehrsgerichtstag",
        schluesselwoerter: ["sachverhalt", "schilderung", "perspektive", "aufmerksamkeit", "verantwortung", "wahrheit", "rekonstruktion", "klarheit", "fakten", "ablauf"],
      },
    ],
    mittel: [
      {
        titel: "⚖️ Das Schlussplädoyer",
        beschreibung: "Die Verhandlung nähert sich dem Ende. Haltet ein Schlussplädoyer, das die Geschworenen überzeugt.",
        kontext: "Gerichtssaal",
        schluesselwoerter: ["beweis", "gerechtigkeit", "zweifel", "unschuld", "wahrheit", "logik", "überzeugung", "plädoyer", "verantwortung", "urteil", "gewissen"],
      },
      {
        titel: "🛡️ Die Verteidigung",
        beschreibung: "Euer Mandant wird eines schweren Vergehens beschuldigt. Baut eine Verteidigungsstrategie auf, die zum Nachdenken zwingt.",
        kontext: "Strafverhandlung",
        schluesselwoerter: ["verteidigung", "zweifel", "beweis", "unschuldsvermutung", "menschlichkeit", "kontext", "umstand", "gerechtigkeit", "wahrheit", "fairness", "perspektive"],
      },
      {
        titel: "📋 Die Anklage",
        beschreibung: "Als Staatsanwalt tragt ihr die Anklage vor. Legt die Fakten so dar, dass kein Raum für Zweifel bleibt.",
        kontext: "Schwurgericht",
        schluesselwoerter: ["anklage", "beweis", "fakten", "verantwortung", "gerechtigkeit", "ordnung", "schuld", "tatbestand", "konsequenz", "überführung", "wahrheit"],
      },
    ],
    schwer: [
      {
        titel: "🏛️ Vor dem Verfassungsgericht",
        beschreibung: "Ein Grundrecht steht auf dem Spiel. Vor dem höchsten Gericht müsst ihr seine Bedeutung für die Demokratie verteidigen.",
        kontext: "Verfassungsgericht",
        schluesselwoerter: ["grundrecht", "verfassung", "demokratie", "freiheit", "würde", "schutz", "prinzip", "fundament", "gesellschaft", "unantastbar", "rechtsstaatlichkeit", "menschenrecht"],
      },
      {
        titel: "⚡ Der unmögliche Fall",
        beschreibung: "Alle Beweise sprechen gegen euren Mandanten. Findet trotzdem die Worte, die Zweifel säen und Herzen bewegen.",
        kontext: "Aufsehenerregender Prozess",
        schluesselwoerter: ["unmöglich", "zweifel", "hoffnung", "menschlichkeit", "wahrheit", "empathie", "gerechtigkeit", "leidenschaft", "überraschung", "wendung", "glaube", "würde"],
      },
      {
        titel: "📜 Der Präzedenzfall",
        beschreibung: "Euer Fall wird Rechtsgeschichte schreiben. Jedes Wort eures Plädoyers wird künftige Generationen beeinflussen.",
        kontext: "Historischer Prozess",
        schluesselwoerter: ["präzedenz", "geschichte", "vermächtnis", "wandel", "fortschritt", "gerechtigkeit", "zukunft", "verantwortung", "meilenstein", "bedeutung", "generation", "recht"],
      },
    ],
  },

  // ==========================================================================
  // AKADEMISCHE DEBATTE
  // ==========================================================================
  akademie: {
    leicht: [
      {
        titel: "📖 Die Seminardiskussion",
        beschreibung: "Im Uni-Seminar wird eine kontroverse These diskutiert. Bringt eure Perspektive klar und fundiert ein.",
        kontext: "Universitätsseminar",
        schluesselwoerter: ["these", "argument", "diskussion", "perspektive", "analyse", "quelle", "beitrag", "reflexion", "standpunkt", "debatte"],
      },
      {
        titel: "📚 Die Buchrezension",
        beschreibung: "Stellt ein Buch vor, das euch beeindruckt hat. Analysiert es so, dass alle es sofort lesen wollen.",
        kontext: "Lesekreis an der Universität",
        schluesselwoerter: ["analyse", "interpretation", "autor", "werk", "thema", "stil", "bedeutung", "empfehlung", "eindruck", "tiefe"],
      },
      {
        titel: "🔬 Das Forschungsprojekt",
        beschreibung: "Stellt eure Forschungsidee eurem Professor vor. Erklärt sie so spannend, dass er sie sofort betreuen will.",
        kontext: "Sprechstunde beim Professor",
        schluesselwoerter: ["forschung", "hypothese", "methode", "relevanz", "fragestellung", "neuheit", "beitrag", "wissenschaft", "erkenntnis", "potential"],
      },
    ],
    mittel: [
      {
        titel: "🎓 Die Verteidigung der Doktorarbeit",
        beschreibung: "Jahre der Forschung münden in diesen Moment. Verteidigt eure Dissertation gegen ein kritisches Prüfungskomitee.",
        kontext: "Promotionsverteidigung",
        schluesselwoerter: ["dissertation", "forschung", "methodik", "ergebnis", "beitrag", "verteidigung", "signifikanz", "evidenz", "innovation", "fundament", "originalität"],
      },
      {
        titel: "🎤 Das akademische Panel",
        beschreibung: "Auf einer Fachkonferenz diskutiert ihr mit drei Experten. Behauptet euch mit brillanten Argumenten.",
        kontext: "Wissenschaftliche Konferenz",
        schluesselwoerter: ["expertise", "diskurs", "argument", "evidenz", "position", "debatte", "fachkenntnis", "gegenargumentation", "konsens", "erkenntnis", "synthese"],
      },
      {
        titel: "🧪 Forschung vs. Ethik",
        beschreibung: "Eure Forschung könnte Millionen helfen, aber die Methode ist ethisch umstritten. Verteidigt euren Ansatz vor dem Ethikrat.",
        kontext: "Ethikkommission der Universität",
        schluesselwoerter: ["ethik", "forschung", "fortschritt", "verantwortung", "abwägung", "nutzen", "risiko", "prinzip", "grenze", "wissenschaft", "gewissen"],
      },
    ],
    schwer: [
      {
        titel: "🏅 Die Nobelvorlesung",
        beschreibung: "Ihr habt den Nobelpreis gewonnen. Haltet eine Vorlesung, die eure Forschung so erklärt, dass sie die Welt inspiriert.",
        kontext: "Nobelpreisverleihung in Stockholm",
        schluesselwoerter: ["durchbruch", "menschheit", "forschung", "erkenntnis", "verantwortung", "inspiration", "vermächtnis", "fortschritt", "entdeckung", "dankbarkeit", "zukunft", "wissen"],
      },
      {
        titel: "💥 Das neue Paradigma",
        beschreibung: "Eure Theorie widerspricht allem, was bisher galt. Überzeugt die gesamte Fachwelt, dass ihr Recht habt.",
        kontext: "Revolutionärer Fachvortrag",
        schluesselwoerter: ["paradigma", "revolution", "beweis", "umdenken", "wahrheit", "erkenntnis", "widerstand", "durchbruch", "überzeugung", "fundament", "transformation", "kühnheit"],
      },
      {
        titel: "🌐 Wissen für alle",
        beschreibung: "Haltet die Eröffnungsrede eines globalen Bildungsgipfels. Überzeugt die Welt, dass Wissen das wichtigste Menschenrecht ist.",
        kontext: "Globaler Bildungsgipfel",
        schluesselwoerter: ["bildung", "menschenrecht", "zugang", "gleichheit", "zukunft", "transformation", "gerechtigkeit", "wissen", "chance", "verantwortung", "gesellschaft", "freiheit"],
      },
    ],
  },

  // ==========================================================================
  // LITERARISCHER SALON
  // ==========================================================================
  salon: {
    leicht: [
      {
        titel: "🌹 Das Lieblingsgedicht",
        beschreibung: "Beschreibt euer Lieblingsgedicht so leidenschaftlich, dass alle es sofort lesen wollen.",
        kontext: "Literarischer Abend",
        schluesselwoerter: ["poesie", "vers", "gefühl", "sprache", "schönheit", "rhythmus", "bild", "emotion", "berührung", "klang"],
      },
      {
        titel: "📖 Die Buchempfehlung",
        beschreibung: "Empfehlt einem Lesemuffel ein Buch so eloquent, dass er es noch heute Abend beginnen möchte.",
        kontext: "Buchhandlung",
        schluesselwoerter: ["empfehlung", "faszination", "geschichte", "spannung", "charakter", "tiefe", "entdeckung", "leidenschaft", "abenteuer", "seite"],
      },
      {
        titel: "✨ Die schönste Zeile",
        beschreibung: "Welcher Satz aus einem Buch hat euer Leben verändert? Erzählt die Geschichte hinter diesem einen Satz.",
        kontext: "Leseabend im Salon",
        schluesselwoerter: ["zitat", "wirkung", "erinnerung", "bedeutung", "moment", "veränderung", "resonanz", "sprache", "erfahrung", "tiefe"],
      },
    ],
    mittel: [
      {
        titel: "🎭 Die literarische Kritik",
        beschreibung: "Ein umstrittenes Werk spaltet den Salon. Verteidigt oder kritisiert es mit Tiefgang und sprachlicher Finesse.",
        kontext: "Literaturkritik-Abend",
        schluesselwoerter: ["kritik", "analyse", "interpretation", "stil", "substanz", "provokation", "handwerk", "aussage", "urteil", "diskurs", "kunstfertigkeit"],
      },
      {
        titel: "✍️ Die Poesie-Interpretation",
        beschreibung: "Interpretiert ein rätselhaftes Gedicht vor dem Salon und enthüllt Bedeutungsschichten, die andere übersehen haben.",
        kontext: "Poesie-Salon",
        schluesselwoerter: ["interpretation", "symbol", "metapher", "bedeutung", "schicht", "tiefe", "sprache", "intention", "perspektive", "enthüllung", "lesart"],
      },
      {
        titel: "📝 Der eigene Text",
        beschreibung: "Tragt euren eigenen kurzen Text vor dem Salon vor. Überzeugt die Kritiker, dass in euch ein Autor steckt.",
        kontext: "Offene Bühne im Literatursalon",
        schluesselwoerter: ["kreativität", "stimme", "originalität", "ausdruck", "erzählung", "stil", "emotion", "handwerk", "mut", "talent", "sprache"],
      },
    ],
    schwer: [
      {
        titel: "🕯️ Der Nachruf auf einen Dichter",
        beschreibung: "Ein großer Autor ist verstorben. Haltet die Gedenkrede, die seinem Lebenswerk gerecht wird.",
        kontext: "Literarische Gedenkfeier",
        schluesselwoerter: ["vermächtnis", "unsterblichkeit", "werk", "meisterschaft", "verlust", "erinnerung", "einfluss", "ewigkeit", "dankbarkeit", "inspiration", "abschied", "würdigung"],
      },
      {
        titel: "📜 Das Manifest der Literatur",
        beschreibung: "In Zeiten, in denen niemand mehr liest: Verfasst ein leidenschaftliches Manifest, warum Literatur unverzichtbar ist.",
        kontext: "Eröffnung der Buchmesse",
        schluesselwoerter: ["literatur", "unverzichtbar", "menschheit", "empathie", "imagination", "widerstand", "freiheit", "identität", "wahrheit", "stimme", "vermächtnis", "kultur"],
      },
      {
        titel: "🎭 Fiktion und Wahrheit",
        beschreibung: "Ist Fiktion manchmal wahrer als die Realität? Haltet eine Rede, die die Grenzen zwischen Dichtung und Wahrheit auflöst.",
        kontext: "Philosophisch-literarische Gala",
        schluesselwoerter: ["fiktion", "wahrheit", "realität", "illusion", "erkenntnis", "dichtung", "tiefgang", "grenze", "imagination", "authentizität", "paradox", "offenbarung"],
      },
    ],
  },

  // ==========================================================================
  // POLITISCHE REDE
  // ==========================================================================
  politik: {
    leicht: [
      {
        titel: "🏘️ Die Gemeindeversammlung",
        beschreibung: "In eurer Gemeinde soll ein Spielplatz gebaut werden. Überzeugt den Gemeinderat mit einer sympathischen Rede.",
        kontext: "Gemeindeversammlung",
        schluesselwoerter: ["gemeinschaft", "kinder", "lebensqualität", "investition", "zukunft", "nachbarschaft", "zusammenhalt", "freude", "sicherheit", "engagement"],
      },
      {
        titel: "🏫 Die Schulrat-Rede",
        beschreibung: "Als Elternvertreter haltet ihr eine Rede vor dem Schulrat, um bessere Ausstattung für die Schulbibliothek zu fordern.",
        kontext: "Schulratssitzung",
        schluesselwoerter: ["bildung", "zukunft", "kinder", "förderung", "investition", "lesen", "chance", "verantwortung", "gemeinschaft", "priorität"],
      },
      {
        titel: "🗳️ Die Bürgerinitiative",
        beschreibung: "Eure Nachbarschaft möchte den alten Park vor dem Abriss retten. Haltet eine überzeugende Rede beim Bürgerentscheid.",
        kontext: "Bürgerversammlung",
        schluesselwoerter: ["park", "erhalt", "natur", "gemeinschaft", "erinnerung", "lebensraum", "initiative", "stimme", "engagement", "heimat"],
      },
    ],
    mittel: [
      {
        titel: "🏛️ Die Parlamentsdebatte",
        beschreibung: "Im Parlament wird über ein umstrittenes Gesetz debattiert. Haltet eine Rede, die die Skeptiker umstimmt.",
        kontext: "Parlamentsdebatte",
        schluesselwoerter: ["gesetz", "argument", "reform", "gerechtigkeit", "gesellschaft", "fortschritt", "debatte", "überzeugung", "verantwortung", "wandel", "kompromiss"],
      },
      {
        titel: "📣 Die Wahlkampfrede",
        beschreibung: "Wahlkampf — und euer Gegenkandidat liegt vorne. Haltet die Rede, die das Blatt wendet.",
        kontext: "Wahlkampfveranstaltung",
        schluesselwoerter: ["vision", "wandel", "vertrauen", "zukunft", "bürger", "versprechen", "stärke", "hoffnung", "führung", "aufbruch", "gemeinschaft"],
      },
      {
        titel: "🤝 Die Koalitionsverhandlung",
        beschreibung: "Zwei Parteien mit unterschiedlichen Zielen müssen zusammenarbeiten. Findet eloquente Worte für den Kompromiss.",
        kontext: "Koalitionsgespräch",
        schluesselwoerter: ["kompromiss", "zusammenarbeit", "verantwortung", "dialog", "gemeinsamkeit", "respekt", "lösung", "pragmatismus", "stabilität", "zugeständnis"],
      },
    ],
    schwer: [
      {
        titel: "👑 Die Antrittsrede",
        beschreibung: "Ihr wurdet gerade zum Staatsoberhaupt gewählt. Haltet eine Antrittsrede, die ein ganzes Land vereint.",
        kontext: "Feierliche Amtseinführung",
        schluesselwoerter: ["einheit", "hoffnung", "verantwortung", "zukunft", "nation", "wandel", "gemeinsam", "vertrauen", "aufbruch", "vermächtnis", "geschichte", "dienst"],
      },
      {
        titel: "🛡️ Verteidigung der Demokratie",
        beschreibung: "Die Demokratie wird angegriffen. Haltet eine flammende Rede zu ihrer Verteidigung vor dem Parlament.",
        kontext: "Parlamentssitzung in der Krise",
        schluesselwoerter: ["demokratie", "freiheit", "widerstand", "grundrecht", "verfassung", "wachsamkeit", "verteidigung", "werte", "bürgerpflicht", "standhaftigkeit", "mut", "erbe"],
      },
      {
        titel: "🌍 Die Rede an die Welt",
        beschreibung: "Eine globale Krise verlangt globales Handeln. Haltet die Rede, die alle Nationen zum gemeinsamen Handeln bewegt.",
        kontext: "Globaler Krisengipfel",
        schluesselwoerter: ["menschheit", "solidarität", "handeln", "verantwortung", "überleben", "einheit", "zukunft", "dringlichkeit", "gemeinsam", "rettung", "hoffnung", "entschlossenheit"],
      },
    ],
  },

  // ==========================================================================
  // PHILOSOPHISCHES GESPRÄCH
  // ==========================================================================
  philosophie: {
    leicht: [
      {
        titel: "😊 Was ist Glück?",
        beschreibung: "Ein Freund fragt euch: Was ist Glück? Gebt eine Antwort, die tiefer geht als Klischees.",
        kontext: "Gespräch unter Freunden",
        schluesselwoerter: ["glück", "zufriedenheit", "sinn", "moment", "dankbarkeit", "erfüllung", "einfachheit", "bewusstsein", "freude", "gelassenheit"],
      },
      {
        titel: "💛 Der Wert der Freundschaft",
        beschreibung: "Was macht wahre Freundschaft aus? Philosophiert über das Band, das Menschen zusammenhält.",
        kontext: "Philosophischer Abend",
        schluesselwoerter: ["freundschaft", "vertrauen", "loyalität", "verbundenheit", "ehrlichkeit", "tiefe", "gegenseitigkeit", "zeit", "nähe", "bedingungslos"],
      },
      {
        titel: "⏰ Der Wert der Zeit",
        beschreibung: "Ist Zeit unser wertvollstes Gut? Reflektiert über den Umgang mit dem, was uns allen gegeben ist.",
        kontext: "Nachdenkliches Gespräch",
        schluesselwoerter: ["zeit", "endlichkeit", "priorität", "kostbar", "vergänglich", "gegenwart", "bewusstsein", "wahl", "leben", "augenblick"],
      },
    ],
    mittel: [
      {
        titel: "🔓 Freiheit des Willens",
        beschreibung: "Ist der freie Wille real oder nur eine Illusion? Debattiert mit einem Philosophen, der das Gegenteil behauptet.",
        kontext: "Philosophische Debatte",
        schluesselwoerter: ["willensfreiheit", "determinismus", "entscheidung", "verantwortung", "illusion", "bewusstsein", "autonomie", "kausalität", "freiheit", "selbstbestimmung", "wahl"],
      },
      {
        titel: "🪞 Die Natur der Wahrheit",
        beschreibung: "Was ist Wahrheit — objektive Realität oder subjektive Konstruktion? Verteidigt euren Standpunkt eloquent.",
        kontext: "Erkenntnistheoretische Diskussion",
        schluesselwoerter: ["wahrheit", "objektivität", "subjektivität", "erkenntnis", "realität", "perspektive", "konstruktion", "gewissheit", "zweifel", "relativismus", "absolut"],
      },
      {
        titel: "🤖 Mensch und Maschine",
        beschreibung: "Kann eine Maschine jemals ein Bewusstsein haben? Diskutiert die Grenzen zwischen Mensch und künstlicher Intelligenz.",
        kontext: "Technikphilosophisches Forum",
        schluesselwoerter: ["bewusstsein", "intelligenz", "maschine", "menschlichkeit", "grenze", "seele", "denken", "empfindung", "simulation", "identität", "ethik"],
      },
    ],
    schwer: [
      {
        titel: "🌌 Der Sinn des Lebens",
        beschreibung: "Auf einer philosophischen Gala wird gefragt: Was ist der Sinn des Lebens? Gebt die Antwort, die alle verstummen lässt.",
        kontext: "Philosophische Gala",
        schluesselwoerter: ["sinn", "existenz", "bedeutung", "suche", "absurdität", "schöpfung", "erkenntnis", "menschlichkeit", "ewigkeit", "nichts", "alles", "transzendenz"],
      },
      {
        titel: "✨ Existiert Gott?",
        beschreibung: "In einem respektvollen philosophischen Gespräch: Verteidigt eloquent eure Position zur Frage aller Fragen.",
        kontext: "Interreligiöser Dialog",
        schluesselwoerter: ["gott", "glaube", "vernunft", "existenz", "transzendenz", "beweis", "hoffnung", "geheimnis", "unendlichkeit", "schöpfung", "zweifel", "demut"],
      },
      {
        titel: "♾️ Das Paradox verteidigen",
        beschreibung: "Verteidigt eine scheinbar absurde These: 'Stille ist lauter als jeder Donner.' Macht sie philosophisch unerschütterlich.",
        kontext: "Rhetorisch-philosophischer Wettkampf",
        schluesselwoerter: ["paradox", "wahrheit", "absurdität", "tiefe", "gegensatz", "erkenntnis", "logik", "überraschung", "weisheit", "perspektive", "umdeutung", "brillanz"],
      },
    ],
  },

  // ==========================================================================
  // ALLTAG & GESELLSCHAFT
  // ==========================================================================
  alltag: {
    leicht: [
      {
        titel: "☕ Der erste Kaffee",
        beschreibung: "Beschreibt das Gefühl des ersten Kaffees am Morgen so poetisch und bildhaft wie möglich.",
        kontext: "Kulturkolumne",
        schluesselwoerter: ["morgen", "ritual", "aroma", "wärme", "genuss", "stille", "erwachen", "moment", "duft", "geborgenheit"],
      },
      {
        titel: "🍂 Die Lieblingsjahreszeit",
        beschreibung: "Welche Jahreszeit ist die schönste? Beschreibt eure Lieblingsjahreszeit so lebendig, dass man sie spüren kann.",
        kontext: "Gespräch im Park",
        schluesselwoerter: ["jahreszeit", "natur", "gefühl", "wandel", "farben", "stimmung", "schönheit", "erinnerung", "sinne", "zauber"],
      },
      {
        titel: "🍳 Omas Geheimrezept",
        beschreibung: "Jeder hat ein Lieblingsrezept aus der Kindheit. Beschreibt eures so lebendig, dass man es schmecken kann.",
        kontext: "Küchenplauderei",
        schluesselwoerter: ["erinnerung", "geschmack", "kindheit", "tradition", "liebe", "duft", "geborgenheit", "geheimnis", "familie", "nostalgie"],
      },
    ],
    mittel: [
      {
        titel: "📱 Digitale Einsamkeit",
        beschreibung: "Wir sind vernetzter denn je — und doch einsamer. Analysiert dieses Paradoxon der modernen Zeit.",
        kontext: "Gesellschaftsdiskussion",
        schluesselwoerter: ["einsamkeit", "vernetzung", "paradox", "nähe", "distanz", "bildschirm", "authentizität", "verbindung", "oberflächlich", "sehnsucht", "realität"],
      },
      {
        titel: "🏔️ Raus aus der Komfortzone",
        beschreibung: "Sollte man seine Komfortzone verlassen — oder ist sie ein sicherer Hafen? Verteidigt eure Sicht eloquent.",
        kontext: "Freundeskreis-Debatte",
        schluesselwoerter: ["komfortzone", "wachstum", "angst", "mut", "veränderung", "sicherheit", "risiko", "entwicklung", "überwindung", "potential", "grenze"],
      },
      {
        titel: "🏠 Heimat in der Fremde",
        beschreibung: "Was bedeutet Heimat für jemanden, der weit weg von zu Hause lebt? Beschreibt das Gefühl zwischen zwei Welten.",
        kontext: "Interkultureller Abend",
        schluesselwoerter: ["heimat", "fremde", "identität", "zugehörigkeit", "sehnsucht", "wurzeln", "anpassung", "erinnerung", "brücke", "doppelleben", "kultur"],
      },
    ],
    schwer: [
      {
        titel: "🔄 Das Leben umkrempeln",
        beschreibung: "Euer bester Freund steckt in einem Leben fest, das ihn unglücklich macht. Überzeugt ihn mit einer einzigen Rede, alles zu ändern.",
        kontext: "Entscheidendes Gespräch",
        schluesselwoerter: ["veränderung", "mut", "leben", "entscheidung", "freiheit", "risiko", "chance", "reue", "aufbruch", "selbstbestimmung", "jetzt", "transformation"],
      },
      {
        titel: "🥂 Der perfekte Toast",
        beschreibung: "Bei der Hochzeit eures besten Freundes sollt ihr den Toast halten. Findet die Worte, die alle zum Lachen und Weinen bringen.",
        kontext: "Hochzeitsfeier",
        schluesselwoerter: ["liebe", "freundschaft", "toast", "humor", "emotion", "erinnerung", "zukunft", "versprechen", "herz", "moment", "ewigkeit", "glück"],
      },
      {
        titel: "🌹 Das Plädoyer der Liebe",
        beschreibung: "Überzeugt ein zynisches Publikum davon, dass die Liebe die stärkste Kraft im Universum ist.",
        kontext: "Literarische Gala",
        schluesselwoerter: ["liebe", "kraft", "überzeugung", "zynismus", "hoffnung", "menschlichkeit", "verbindung", "ewigkeit", "beweis", "leidenschaft", "wahrheit", "unbesiegbar"],
      },
    ],
  },

  // ==========================================================================
  // HISTORISCHE MOMENTE
  // ==========================================================================
  geschichte: {
    leicht: [
      {
        titel: "🏛️ Mein historisches Vorbild",
        beschreibung: "Stellt eine historische Persönlichkeit vor, die euch inspiriert. Erklärt, warum ihr Vermächtnis heute noch zählt.",
        kontext: "Geschichtsabend",
        schluesselwoerter: ["vorbild", "inspiration", "vermächtnis", "charakter", "leistung", "mut", "einfluss", "bewunderung", "geschichte", "bedeutung"],
      },
      {
        titel: "📮 Der Brief aus der Vergangenheit",
        beschreibung: "Schreibt einen Brief aus der Sicht einer Person im Jahr 1900 an jemanden im Jahr 2025. Was würdet ihr erzählen?",
        kontext: "Kreatives Geschichtserzählen",
        schluesselwoerter: ["vergangenheit", "zukunft", "wandel", "staunen", "alltag", "hoffnung", "fortschritt", "erinnerung", "perspektive", "brücke"],
      },
      {
        titel: "🗺️ Die Postkarte der Geschichte",
        beschreibung: "Ihr seid Zeitreisende und dürft eine einzige Postkarte aus der Vergangenheit schicken. Welchen Moment wählt ihr und was schreibt ihr?",
        kontext: "Kreatives Geschichtsspiel",
        schluesselwoerter: ["zeitreise", "moment", "geschichte", "botschaft", "zeuge", "eindruck", "atmosphäre", "faszination", "augenblick", "bericht"],
      },
    ],
    mittel: [
      {
        titel: "📜 Der historische Wendepunkt",
        beschreibung: "Wählt einen Wendepunkt der Geschichte und haltet die Rede, die in diesem Moment hätte gehalten werden sollen.",
        kontext: "Historisches Rollenspiel",
        schluesselwoerter: ["wendepunkt", "entscheidung", "schicksal", "verantwortung", "geschichte", "mut", "wandel", "konsequenz", "bedeutung", "zukunft", "epoche"],
      },
      {
        titel: "🔀 Was wäre wenn?",
        beschreibung: "Was wäre, wenn ein großes historisches Ereignis anders verlaufen wäre? Skizziert eine alternative Geschichte eloquent.",
        kontext: "Kontrafaktische Geschichtsdebatte",
        schluesselwoerter: ["alternative", "möglichkeit", "kausalität", "wendepunkt", "spekulation", "konsequenz", "schicksal", "verlauf", "parallel", "imagination", "faszination"],
      },
      {
        titel: "🖋️ Worte, die die Welt veränderten",
        beschreibung: "Welche Rede oder welcher Text hat die Welt am meisten verändert? Argumentiert für eure Wahl.",
        kontext: "Historisches Symposium",
        schluesselwoerter: ["rede", "einfluss", "wandel", "macht", "worte", "wirkung", "geschichte", "revolution", "inspiration", "vermächtnis", "bedeutung"],
      },
    ],
    schwer: [
      {
        titel: "👑 Die Krönungsrede",
        beschreibung: "Ihr wurdet gerade zum Herrscher gekrönt. Haltet eure Antrittsrede vor dem Volk — majestätisch und weise.",
        kontext: "Feierliche Krönungszeremonie",
        schluesselwoerter: ["krönung", "volk", "pflicht", "gerechtigkeit", "herrschaft", "weisheit", "demut", "dienst", "einheit", "vermächtnis", "ewigkeit", "größe"],
      },
      {
        titel: "🔔 Die Revolutionsrede",
        beschreibung: "Ihr steht auf den Barrikaden. Das Volk blickt zu euch auf. Haltet die Rede, die eine Revolution entfacht.",
        kontext: "Historischer Aufstand",
        schluesselwoerter: ["revolution", "freiheit", "aufstand", "gerechtigkeit", "unterdrückung", "volk", "wandel", "mut", "opfer", "aufbruch", "hoffnung", "unerschütterlich"],
      },
      {
        titel: "🏺 Brief an die Zukunft",
        beschreibung: "Schreibt einen Brief an die Menschen in 500 Jahren. Was sollen sie über unsere Zeit wissen?",
        kontext: "Zeitkapsel-Zeremonie",
        schluesselwoerter: ["zukunft", "vermächtnis", "hoffnung", "warnung", "menschheit", "erfahrung", "weisheit", "botschaft", "überdauern", "erinnerung", "generation", "verantwortung"],
      },
    ],
  },

  // ==========================================================================
  // MEDIZIN & ARZTGESPRÄCH
  // ==========================================================================
  medizin: {
    leicht: [
      {
        titel: "🩺 Die einfache Erklärung",
        beschreibung: "Erklärt einem Patienten eine Diagnose so verständlich, dass er sich informiert statt verängstigt fühlt.",
        kontext: "Hausarztpraxis",
        schluesselwoerter: ["diagnose", "verständnis", "erklärung", "beruhigung", "klarheit", "patient", "therapie", "einfühlsam", "vertrauen", "sachlich"],
      },
      {
        titel: "💊 Die Therapieempfehlung",
        beschreibung: "Ein Patient ist unsicher über die vorgeschlagene Therapie. Erklärt Nutzen und Risiken mit Einfühlsamkeit.",
        kontext: "Beratungsgespräch",
        schluesselwoerter: ["therapie", "nutzen", "risiko", "entscheidung", "vertrauen", "aufklärung", "begleitung", "abwägung", "sicherheit", "partnerschaft"],
      },
      {
        titel: "🏃 Der Gesundheitsratschlag",
        beschreibung: "Euer bester Freund lebt ungesund und ignoriert alle Warnungen. Überzeugt ihn charmant, etwas zu ändern — ohne zu belehren.",
        kontext: "Freundesgespräch",
        schluesselwoerter: ["gesundheit", "vorsorge", "motivation", "veränderung", "wohlbefinden", "fürsorge", "lebensstil", "balance", "empathie", "ermutigung"],
      },
    ],
    mittel: [
      {
        titel: "🔬 Die medizinische Konferenz",
        beschreibung: "Auf einer Fachkonferenz präsentiert ihr eine neue Behandlungsmethode. Überzeugt skeptische Kollegen.",
        kontext: "Medizinische Fachkonferenz",
        schluesselwoerter: ["forschung", "evidenz", "innovation", "studie", "methode", "ergebnis", "durchbruch", "signifikanz", "fortschritt", "paradigma", "behandlung"],
      },
      {
        titel: "⚖️ Das Ethikkomitee",
        beschreibung: "Vor dem Ethikkomitee müsst ihr eine umstrittene Behandlung verteidigen. Argumentiert mit Verstand und Mitgefühl.",
        kontext: "Klinisches Ethikkomitee",
        schluesselwoerter: ["ethik", "patient", "würde", "abwägung", "verantwortung", "prinzip", "mitgefühl", "dilemma", "gerechtigkeit", "autonomie", "fürsorge"],
      },
      {
        titel: "👩‍⚕️ Die Teamkonferenz",
        beschreibung: "In der interdisziplinären Konferenz müsst ihr das Team überzeugen, einen riskanten aber vielversprechenden Eingriff durchzuführen.",
        kontext: "Klinische Teamkonferenz",
        schluesselwoerter: ["risiko", "chance", "abwägung", "zusammenarbeit", "expertise", "entscheidung", "verantwortung", "protokoll", "patient", "hoffnung", "mut"],
      },
    ],
    schwer: [
      {
        titel: "💔 Die schwerste Nachricht",
        beschreibung: "Als Arzt müsst ihr einem Patienten eine verheerende Diagnose mitteilen. Findet Worte, die Wahrheit und Würde vereinen.",
        kontext: "Schwieriges Klinikgespräch",
        schluesselwoerter: ["mitgefühl", "wahrheit", "würde", "empathie", "stärke", "ehrlichkeit", "begleitung", "hoffnung", "menschlichkeit", "respekt", "trost", "kraft"],
      },
      {
        titel: "🦠 Die Pandemie-Rede",
        beschreibung: "Eine Pandemie bedroht das Land. Als oberster Gesundheitsbeauftragter müsst ihr die Nation beruhigen und mobilisieren.",
        kontext: "Nationale Krisenkommunikation",
        schluesselwoerter: ["pandemie", "verantwortung", "solidarität", "schutz", "maßnahme", "vertrauen", "wissenschaft", "zusammenhalt", "disziplin", "hoffnung", "durchhaltevermögen", "gemeinschaft"],
      },
      {
        titel: "🏥 Die Eröffnungsrede des Klinikums",
        beschreibung: "Ein neues Klinikum wird eröffnet. Haltet die Rede, die Medizin als Dienst am Menschen feiert.",
        kontext: "Feierliche Klinikeröffnung",
        schluesselwoerter: ["medizin", "menschlichkeit", "fortschritt", "heilung", "dienst", "hoffnung", "fürsorge", "zukunft", "forschung", "mitgefühl", "gemeinschaft", "würde"],
      },
    ],
  },

  // ==========================================================================
  // MEDIEN & JOURNALISMUS
  // ==========================================================================
  medien: {
    leicht: [
      {
        titel: "🎙️ Das Podcast-Interview",
        beschreibung: "Ihr seid zu Gast in einem beliebten Podcast. Erzählt eure Geschichte so fesselnd, dass die Zuhörer nicht abschalten.",
        kontext: "Podcast-Studio",
        schluesselwoerter: ["erzählung", "authentizität", "spannung", "persönlichkeit", "erfahrung", "stimme", "interesse", "zuhörer", "charme", "anekdote"],
      },
      {
        titel: "📺 Der Lokalnachrichtenbericht",
        beschreibung: "Als Lokalreporter berichtet ihr über ein Stadtteilfest. Macht es so lebendig, dass ganz Deutschland neidisch wird.",
        kontext: "Lokalnachrichten",
        schluesselwoerter: ["bericht", "gemeinschaft", "atmosphäre", "leben", "menschen", "farbe", "ereignis", "charme", "herzlichkeit", "vielfalt"],
      },
      {
        titel: "📰 Die Kolumne",
        beschreibung: "Schreibt den Anfang einer Kolumne über ein Alltagsphänomen — so witzig und klug, dass man sie teilen möchte.",
        kontext: "Zeitungsredaktion",
        schluesselwoerter: ["kolumne", "beobachtung", "humor", "klugheit", "alltag", "perspektive", "stil", "schärfe", "unterhaltung", "stimme"],
      },
    ],
    mittel: [
      {
        titel: "🎤 Die Live-Debatte",
        beschreibung: "Ihr moderiert eine Live-Debatte zwischen zwei Politikern. Stellt die Frage, die alles verändert.",
        kontext: "TV-Studio",
        schluesselwoerter: ["moderation", "frage", "schärfe", "neutralität", "nachhaken", "fairness", "spannung", "klarheit", "konfrontation", "enthüllung", "wahrheit"],
      },
      {
        titel: "🔍 Die Investigativ-Recherche",
        beschreibung: "Eure Recherche hat einen Skandal aufgedeckt. Präsentiert die Ergebnisse so, dass die Öffentlichkeit aufhorcht.",
        kontext: "Investigativer Journalismus",
        schluesselwoerter: ["enthüllung", "beweis", "skandal", "wahrheit", "recherche", "fakten", "verantwortung", "transparenz", "öffentlichkeit", "aufklärung", "mut"],
      },
      {
        titel: "📻 Das Kriseninterview",
        beschreibung: "Ein Firmenchef steht nach einem Skandal vor euch. Führt ein hartnäckiges aber faires Interview, das die Wahrheit ans Licht bringt.",
        kontext: "Nachrichtenstudio",
        schluesselwoerter: ["interview", "nachhaken", "wahrheit", "verantwortung", "transparenz", "konfrontation", "fairness", "fakten", "glaubwürdigkeit", "öffentlichkeit", "journalismus"],
      },
    ],
    schwer: [
      {
        titel: "⚠️ Die Krisen-Pressekonferenz",
        beschreibung: "Nach einem Skandal müsst ihr vor der versammelten Presse bestehen. Jedes Wort wird seziert.",
        kontext: "Internationaler Pressesaal",
        schluesselwoerter: ["transparenz", "verantwortung", "vertrauen", "krise", "kommunikation", "souveränität", "ehrlichkeit", "strategie", "glaubwürdigkeit", "besonnenheit", "kontrolle", "haltung"],
      },
      {
        titel: "🌍 Der Kriegsbericht",
        beschreibung: "Als Kriegskorrespondent berichtet ihr aus einem Krisengebiet. Findet Worte, die der Welt die Augen öffnen.",
        kontext: "Bericht aus dem Krisengebiet",
        schluesselwoerter: ["krieg", "wahrheit", "menschlichkeit", "leid", "mut", "zeugnis", "verantwortung", "bericht", "empathie", "aufklärung", "stimme", "hoffnung"],
      },
      {
        titel: "📡 Die historische Sendung",
        beschreibung: "Ein Moment von welthistorischer Bedeutung — und ihr seid live auf Sendung. Findet die Worte, die in die Geschichte eingehen.",
        kontext: "Historische Live-Übertragung",
        schluesselwoerter: ["geschichte", "moment", "zeugnis", "bedeutung", "welt", "emotion", "klarheit", "vermächtnis", "ergriffenheit", "verantwortung", "sendung", "ewigkeit"],
      },
    ],
  },
};

// =============================================================================
// Rückwärtskompatible flache Struktur
// Kombiniert alle Kategorien zu SITUATIONEN.leicht / .mittel / .schwer
// =============================================================================
function _buildFlat() {
  const flat = { leicht: [], mittel: [], schwer: [] };
  for (const [kat, levels] of Object.entries(SITUATIONEN_NACH_KATEGORIE)) {
    for (const diff of ["leicht", "mittel", "schwer"]) {
      if (levels[diff]) {
        flat[diff].push(...levels[diff].map(s => ({ ...s, kategorie: kat })));
      }
    }
  }
  return flat;
}

export const SITUATIONEN = _buildFlat();

// =============================================================================
// Hilfsfunktion: Alle Situationen einer Schwierigkeit (oder alle)
// =============================================================================
export function alleSituationen(schwierigkeit) {
  if (schwierigkeit) return SITUATIONEN[schwierigkeit];
  return [...SITUATIONEN.leicht, ...SITUATIONEN.mittel, ...SITUATIONEN.schwer];
}
