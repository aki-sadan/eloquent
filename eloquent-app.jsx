import { useState, useEffect, useRef, useCallback } from "react";

// ═══════════════════════════════════════════════════════════
// ELOQUENT — Das Wortduell
// Full Interactive Prototype with AI Scoring
// ═══════════════════════════════════════════════════════════

const SITUATIONEN = {
  leicht: [
    { titel: "🍽️ Das perfekte Abendessen", beschreibung: "Ihr seid bei einem wichtigen Dinner eingeladen. Der Gastgeber fragt: Was macht für euch das perfekte Abendessen aus?", kontext: "Formelles Dinner" },
    { titel: "🌅 Der schönste Moment", beschreibung: "Beschreibt den schönsten Moment, den ihr je erlebt habt — so lebendig und eloquent wie möglich!", kontext: "Abend unter Freunden" },
    { titel: "📚 Das eine Buch", beschreibung: "Wenn ihr nur ein einziges Buch für den Rest eures Lebens mitnehmen könntet — welches und warum?", kontext: "Literarischer Salon" },
    { titel: "🎵 Die Kraft der Musik", beschreibung: "Erklärt jemandem, der noch nie Musik gehört hat, was Musik ist und warum sie bedeutsam ist.", kontext: "Philosophischer Diskurs" },
  ],
  mittel: [
    { titel: "⚖️ Gerechtigkeit", beschreibung: "Ein Freund behauptet, wahre Gerechtigkeit sei unmöglich. Überzeugt ihn vom Gegenteil — oder stimmt eloquent zu.", kontext: "Politische Debatte" },
    { titel: "🤖 Mensch vs. Maschine", beschreibung: "KI wird immer mächtiger. Haltet eine Rede darüber, was den Menschen einzigartig macht — trotz aller Technik.", kontext: "Technologie-Konferenz" },
    { titel: "🎭 Die Maske", beschreibung: "Wir alle tragen Masken im Alltag. Reflektiert, wann es gut ist eine Maske zu tragen — und wann man sie ablegen sollte.", kontext: "Theatergala" },
    { titel: "⏳ Die Zeit", beschreibung: "Wenn ihr die Zeit anhalten könntet — würdet ihr es tun? Argumentiert eloquent für oder gegen diese Möglichkeit.", kontext: "Wissenschaftliches Symposium" },
  ],
  schwer: [
    { titel: "👑 Die Krönung", beschreibung: "Ihr wurdet gerade zum Herrscher eines Landes gekrönt. Haltet eure Antrittsrede vor dem Volk!", kontext: "Feierliche Krönungszeremonie" },
    { titel: "🕊️ Friedensverhandlung", beschreibung: "Zwei verfeindete Nationen stehen kurz vor dem Krieg. Überzeugt beide Seiten vom Frieden.", kontext: "Diplomatischer Gipfel" },
    { titel: "⚡ Vor Gericht", beschreibung: "Ihr seid Anwalt und müsst einen hoffnungslosen Fall verteidigen. Haltet euer leidenschaftliches Schlussplädoyer!", kontext: "Gerichtssaal" },
    { titel: "🌌 Der Sinn des Lebens", beschreibung: "Auf einer philosophischen Gala: Was ist der Sinn des Lebens? Gebt die überzeugendste Antwort!", kontext: "Philosophische Gala" },
  ],
};

const WOERTERBUCH = [
  { wort: "eloquent", definition: "Redegewandt; sich sprachlich geschickt und überzeugend ausdrückend.", beispiel: "Ihre eloquente Verteidigung überzeugte selbst die schärfsten Kritiker.", wortart: "Adjektiv", schwierigkeit: 2, synonyme: ["redegewandt", "wortgewandt", "beredt"], kategorie: "Rhetorik" },
  { wort: "formidabel", definition: "Außerordentlich beeindruckend; großartig in seiner Qualität.", beispiel: "Der Pianist bot eine formidable Darbietung.", wortart: "Adjektiv", schwierigkeit: 3, synonyme: ["herausragend", "beeindruckend"], kategorie: "Alltag" },
  { wort: "sublim", definition: "Erhaben und von höchster geistiger oder ästhetischer Qualität.", beispiel: "Die sublime Schönheit der Berglandschaft verschlug uns die Sprache.", wortart: "Adjektiv", schwierigkeit: 4, synonyme: ["erhaben", "hehr", "transzendent"], kategorie: "Philosophie" },
  { wort: "profund", definition: "Tiefgehend; von großer gedanklicher Tiefe und Gründlichkeit.", beispiel: "Seine profunde Kenntnis der Materie beeindruckte die Kommission.", wortart: "Adjektiv", schwierigkeit: 3, synonyme: ["tiefgründig", "fundiert"], kategorie: "Wissenschaft" },
  { wort: "fulminant", definition: "Überwältigend und mitreißend in seiner Wirkung.", beispiel: "Nach einem fulminanten Auftakt steigerte sich die Aufführung.", wortart: "Adjektiv", schwierigkeit: 3, synonyme: ["überwältigend", "mitreißend"], kategorie: "Emotion" },
  { wort: "ephemer", definition: "Nur kurze Zeit dauernd; flüchtig und vergänglich.", beispiel: "Der ephemere Glanz des Regenbogens erinnerte an die Vergänglichkeit.", wortart: "Adjektiv", schwierigkeit: 5, synonyme: ["flüchtig", "vergänglich"], kategorie: "Philosophie" },
  { wort: "lakonisch", definition: "Kurz und knapp, aber treffend formuliert; wortkarg.", beispiel: "Auf die Frage antwortete er lakonisch: 'Es geht.'", wortart: "Adjektiv", schwierigkeit: 3, synonyme: ["wortkarg", "knapp"], kategorie: "Rhetorik" },
  { wort: "Eloquenz", definition: "Die Kunst der Redegewandtheit; meisterhaftes sprachliches Ausdrucksvermögen.", beispiel: "Seine Eloquenz verlieh selbst alltäglichen Themen eine fesselnde Tiefe.", wortart: "Substantiv", schwierigkeit: 2, synonyme: ["Redegewandtheit", "Beredsamkeit"], kategorie: "Rhetorik" },
  { wort: "Quintessenz", definition: "Das Wesentlichste; der Kern und Inbegriff einer Sache.", beispiel: "Die Quintessenz seiner Rede ließ sich in einem Satz zusammenfassen.", wortart: "Substantiv", schwierigkeit: 3, synonyme: ["Kernaussage", "Essenz"], kategorie: "Philosophie" },
  { wort: "Resilienz", definition: "Psychische Widerstandskraft; die Fähigkeit, Krisen zu bewältigen.", beispiel: "Ihre Resilienz half ihr, auch die schwersten Zeiten zu überstehen.", wortart: "Substantiv", schwierigkeit: 2, synonyme: ["Widerstandskraft", "Belastbarkeit"], kategorie: "Emotion" },
  { wort: "Finesse", definition: "Geschicklichkeit und Feingefühl in der Ausführung.", beispiel: "Mit diplomatischer Finesse gelang es, beide Parteien zufriedenzustellen.", wortart: "Substantiv", schwierigkeit: 3, synonyme: ["Feingefühl", "Raffinesse"], kategorie: "Alltag" },
  { wort: "artikulieren", definition: "Gedanken klar und deutlich in Worte fassen.", beispiel: "Sie verstand es, komplexe Sachverhalte verständlich zu artikulieren.", wortart: "Verb", schwierigkeit: 2, synonyme: ["ausdrücken", "formulieren"], kategorie: "Rhetorik" },
  { wort: "evozieren", definition: "Hervorrufen; eine Vorstellung oder Emotion wachrufen.", beispiel: "Die Musik evozierte Erinnerungen an längst vergangene Sommertage.", wortart: "Verb", schwierigkeit: 4, synonyme: ["hervorrufen", "wachrufen"], kategorie: "Emotion" },
  { wort: "transzendieren", definition: "Über die Grenzen des Gewöhnlichen hinausgehen.", beispiel: "Große Kunst transzendiert die Grenzen von Zeit und Kultur.", wortart: "Verb", schwierigkeit: 5, synonyme: ["übersteigen", "hinausgehen über"], kategorie: "Philosophie" },
  { wort: "nichtsdestotrotz", definition: "Trotz alledem; dennoch; ungeachtet der Umstände.", beispiel: "Die Lage war ernst — nichtsdestotrotz bewahrte sie einen kühlen Kopf.", wortart: "Adverb", schwierigkeit: 2, synonyme: ["dennoch", "trotzdem", "gleichwohl"], kategorie: "Rhetorik" },
  { wort: "gleichwohl", definition: "Trotzdem; nichtsdestoweniger.", beispiel: "Das Vorhaben schien aussichtslos. Gleichwohl gab er nicht auf.", wortart: "Adverb", schwierigkeit: 3, synonyme: ["trotzdem", "dennoch"], kategorie: "Rhetorik" },
  { wort: "Paradigma", definition: "Ein grundlegendes Denk- oder Erklärungsmuster; ein Leitbild.", beispiel: "Die Entdeckung löste einen Paradigmenwechsel in der Wissenschaft aus.", wortart: "Substantiv", schwierigkeit: 3, synonyme: ["Denkmodell", "Leitbild"], kategorie: "Wissenschaft" },
  { wort: "ambivalent", definition: "Zwiespältig; von widerstreitenden Gefühlen geprägt.", beispiel: "Sie war ambivalent — begeistert und zugleich skeptisch.", wortart: "Adjektiv", schwierigkeit: 2, synonyme: ["zwiespältig", "widersprüchlich"], kategorie: "Emotion" },
  { wort: "mitnichten", definition: "Keineswegs; auf gar keinen Fall; durchaus nicht.", beispiel: "Man könnte meinen, die Sache sei erledigt — mitnichten!", wortart: "Adverb", schwierigkeit: 4, synonyme: ["keineswegs", "durchaus nicht"], kategorie: "Rhetorik" },
  { wort: "Impetus", definition: "Anstoß oder Antrieb; die treibende Kraft hinter einer Handlung.", beispiel: "Der Impetus für die Reform kam aus der Bevölkerung.", wortart: "Substantiv", schwierigkeit: 4, synonyme: ["Anstoß", "Antrieb"], kategorie: "Philosophie" },
];

const RAENGE = [
  { name: "Anfänger", symbol: "🌱", min: 0 },
  { name: "Lehrling", symbol: "📝", min: 50 },
  { name: "Redner", symbol: "🎤", min: 150 },
  { name: "Dichter", symbol: "✒️", min: 300 },
  { name: "Rhetoriker", symbol: "📜", min: 500 },
  { name: "Wortkünstler", symbol: "🎨", min: 800 },
  { name: "Meister", symbol: "👑", min: 1200 },
  { name: "Großmeister", symbol: "🏆", min: 2000 },
  { name: "Legende", symbol: "🌟", min: 3500 },
  { name: "Eloquenz-Gott", symbol: "⚡", min: 5000 },
];

const getRang = (pokale) => {
  let r = RAENGE[0];
  for (const rang of RAENGE) {
    if (pokale >= rang.min) r = rang;
    else break;
  }
  return r;
};

const getNote = (p) => {
  if (p >= 95) return { note: "Meisterhaft", emoji: "⚡" };
  if (p >= 85) return { note: "Herausragend", emoji: "🌟" };
  if (p >= 75) return { note: "Ausgezeichnet", emoji: "🏅" };
  if (p >= 65) return { note: "Sehr gut", emoji: "✨" };
  if (p >= 55) return { note: "Gut", emoji: "👍" };
  if (p >= 45) return { note: "Ordentlich", emoji: "📝" };
  if (p >= 35) return { note: "Ausbaufähig", emoji: "🔧" };
  return { note: "Schwach", emoji: "📉" };
};

// ═══════════════════════════════════════════════════════════════════
// ELOQUENT KI v3.0 — Professionelle Bewertungs-Engine
// ─────────────────────────────────────────────────────────────────
// Semantische Analyse · Satz-Sinn-Prüfung · N-Gram-Kohärenz
// Diskursstruktur · Tiefes Anti-Gaming · Deutsche NLP-Pipeline
// Kein API-Key · Läuft komplett lokal im Browser
// ═══════════════════════════════════════════════════════════════════

// ──────────────────────────────────────────────────────
// 1. LEXIKON: Gehobene Wörter mit Metadaten
// ──────────────────────────────────────────────────────

const GEHOBENE_WOERTER = new Map([
  // Adjektive
  ["eloquent", "redegewandt"], ["formidabel", "beeindruckend"], ["sublim", "erhaben"],
  ["profund", "tiefgründig"], ["fulminant", "überwältigend"], ["ephemer", "vergänglich"],
  ["lakonisch", "wortkarg"], ["ambivalent", "zwiespältig"], ["exquisit", "erlesen"],
  ["akribisch", "sorgfältig"], ["prägnant", "treffend"], ["eminent", "herausragend"],
  ["kongenial", "ebenbürtig"], ["inhärent", "innewohnend"], ["intrinsisch", "innerlich"],
  ["adäquat", "angemessen"], ["dezidiert", "entschieden"], ["vehement", "nachdrücklich"],
  ["opulent", "üppig"], ["monumental", "gewaltig"], ["virtuos", "meisterhaft"],
  ["kapriziös", "launenhaft"], ["echauffiert", "aufgebracht"], ["illustriert", "veranschaulicht"],
  ["stringent", "folgerichtig"], ["penibel", "übergenau"], ["frugal", "bescheiden"],
  ["prätentiös", "anmaßend"], ["impertinent", "unverschämt"], ["pittoresk", "malerisch"],
  ["grandios", "großartig"], ["magnifizent", "prächtig"], ["delikat", "fein"],
  ["nuanciert", "fein abgestuft"], ["imponderabel", "unwägbar"],
  ["affirmativ", "bejahend"], ["peremptorisch", "endgültig"], ["drakonisch", "unnachgiebig"],
  ["lukrativ", "einträglich"], ["rudimentär", "grundlegend"], ["transparent", "durchsichtig"],
  // Substantive
  ["eloquenz", "redegewandtheit"], ["quintessenz", "das wesentlichste"], ["resilienz", "widerstandskraft"],
  ["finesse", "feingefühl"], ["paradigma", "denkmodell"], ["impetus", "antrieb"],
  ["epiphanie", "erleuchtung"], ["philanthropie", "menschenliebe"], ["dichotomie", "zweiteilung"],
  ["mäzen", "förderer"], ["antipathie", "abneigung"], ["kongruenz", "übereinstimmung"],
  ["synergie", "zusammenwirken"], ["symbiose", "zusammenleben"], ["affinität", "verwandtschaft"],
  ["koryphäe", "kapazität"], ["prämisse", "voraussetzung"], ["reminiszenz", "erinnerung"],
  ["gravitas", "ernst"], ["plädoyer", "verteidigungsrede"], ["kausalität", "ursächlichkeit"],
  ["integrität", "unbestechlichkeit"], ["souveränität", "selbstbestimmung"], ["charisma", "ausstrahlung"],
  ["nonchalance", "lässigkeit"], ["habitus", "erscheinungsbild"], ["ethos", "grundhaltung"],
  ["pathos", "leidenschaft"], ["logos", "vernunft"], ["emphase", "nachdruck"],
  ["dilemma", "zwickmühle"], ["paradoxon", "widerspruch"], ["autonomie", "selbstständigkeit"],
  ["melancholie", "schwermut"], ["euphorie", "begeisterung"], ["apathie", "teilnahmslosigkeit"],
  // Verben
  ["artikulieren", "ausdrücken"], ["evozieren", "hervorrufen"], ["transzendieren", "übersteigen"],
  ["manifestieren", "zeigen"], ["reflektieren", "nachdenken"], ["konstatieren", "feststellen"],
  ["postulieren", "fordern"], ["implizieren", "einschließen"], ["antizipieren", "vorwegnehmen"],
  ["perpetuieren", "fortdauern"], ["kulminieren", "gipfeln"], ["oszillieren", "schwanken"],
  ["konvergieren", "zusammenlaufen"], ["divergieren", "auseinandergehen"], ["fluktuieren", "schwanken"],
  ["insinuieren", "andeuten"], ["suggerieren", "nahelegen"], ["kontemporieren", "betrachten"],
  ["proklamieren", "verkünden"], ["rekapitulieren", "zusammenfassen"], ["skizzieren", "umreißen"],
  ["illustrieren", "veranschaulichen"], ["elaborieren", "ausarbeiten"], ["deduzieren", "herleiten"],
  ["inaugurieren", "einführen"], ["revitalisieren", "beleben"], ["harmonieren", "zusammenpassen"],
  // Adverbien & Konjunktionen
  ["nichtsdestotrotz", "dennoch"], ["gleichwohl", "trotzdem"], ["mitnichten", "keineswegs"],
  ["indes", "währenddessen"], ["fürwahr", "wahrlich"], ["allemal", "auf jeden fall"],
  ["zuweilen", "manchmal"], ["vornehmlich", "hauptsächlich"], ["gemeinhin", "üblicherweise"],
  ["überdies", "außerdem"], ["indessen", "währenddessen"], ["hernach", "danach"],
  ["obgleich", "obwohl"], ["wenngleich", "obwohl"], ["alldieweil", "während"],
  ["nichtsdestoweniger", "trotzdem"], ["ungeachtet", "trotz"], ["derweil", "während"],
]);

// ──────────────────────────────────────────────────────
// 2. SEMANTISCHE FELDER — Wörter in Bedeutungsgruppen
//    Statt simpler Keywords prüfen wir ob der Text
//    semantisch kohärent zum Thema ist
// ──────────────────────────────────────────────────────

const SEMANTISCHE_FELDER = {
  essen_gastmahl: ["essen", "speise", "gericht", "mahl", "tafel", "dinner", "abendessen", "gast", "gastgeber", "küche", "kochen", "genuss", "kulinarisch", "aroma", "gaumen", "geschmack", "wein", "getränk", "servieren", "kredenzen", "zubereiten", "würze", "delikat", "exquisit", "zelebrieren", "tischgesellschaft", "menü", "gang", "appetit", "köstlich", "schmecken", "mundend", "verfeinert", "rezept", "ingredienz", "zutat", "atmosphäre", "gesellig", "gemeinsam", "bewirtung", "gastfreundschaft", "tafeln", "schlemmen", "genießen", "verwöhnen", "gaumenschmaus"],
  erinnerung_moment: ["moment", "augenblick", "erinnerung", "erlebnis", "gefühl", "glück", "schönheit", "herz", "seele", "freude", "zeit", "unvergesslich", "berühren", "lebendig", "atmen", "empfinden", "erleben", "staunen", "innehalten", "wertschätzen", "vergänglich", "kostbar", "einzigartig", "beeindrucken", "überwältigen", "dankbar", "tiefgreifend", "bezaubern", "ergreifen", "bewegen", "nachhaltig", "intensiv", "wertvoll", "prägen"],
  literatur_buch: ["buch", "lesen", "seite", "geschichte", "autor", "roman", "wort", "literatur", "werk", "kapitel", "erzählen", "schreiben", "bibliothek", "lektüre", "text", "protagonist", "handlung", "leser", "schriftsteller", "poesie", "lyrik", "prosa", "epos", "drama", "vers", "zeile", "novelle", "essay", "lehrreich", "fesselnd", "mitreißend", "spannend", "berühren", "identifizieren", "weltliteratur", "interpretation"],
  musik_klang: ["musik", "klang", "ton", "melodie", "rhythmus", "harmonie", "lied", "instrument", "hören", "singen", "note", "orchester", "komponieren", "takt", "schwingung", "resonanz", "akustisch", "stimme", "frequenz", "konsonanz", "dissonanz", "crescendo", "forte", "piano", "symphonie", "sonate", "musizieren", "spielen", "klingen", "ertönen", "berühren", "universell", "emotion", "ausdrücken", "seele", "vibrieren", "empfinden"],
  gerechtigkeit_recht: ["gerecht", "recht", "gesetz", "gleichheit", "fairness", "unrecht", "moral", "ethik", "gesellschaft", "system", "strafe", "schuld", "wahrheit", "balance", "ordnung", "pflicht", "verantwortung", "freiheit", "demokratie", "menschenrecht", "würde", "richter", "urteil", "gericht", "prinzip", "norm", "wert", "tugend", "integrität", "transparenz", "rechenschaft", "gleichberechtigung"],
  technologie_mensch: ["mensch", "maschine", "künstlich", "intelligenz", "technik", "technologie", "roboter", "computer", "digital", "automatisierung", "algorithmus", "gefühl", "kreativität", "bewusstsein", "seele", "empathie", "einzigartig", "fortschritt", "innovation", "programmieren", "lernen", "denken", "handeln", "entscheiden", "ethik", "verantwortung", "ersetzen", "ergänzen", "koexistenz", "zukunft", "evolution"],
  identitaet_maske: ["maske", "gesicht", "rolle", "verstecken", "zeigen", "authentisch", "echt", "fassade", "schein", "wahrheit", "verbergen", "offenbaren", "schutz", "verletzlich", "mutig", "identität", "selbst", "persona", "enthüllen", "vortäuschen", "spielen", "anpassen", "konform", "gesellschaft", "erwartung", "druck", "befreien", "entblößen", "wahrhaftig", "aufrichtig", "charakter", "innere", "äußere"],
  zeit_vergaenglichkeit: ["zeit", "moment", "ewigkeit", "vergänglich", "uhr", "stunde", "vergangenheit", "zukunft", "gegenwart", "anhalten", "stillstehen", "flüchtig", "dauer", "sekunde", "wandel", "veränderung", "konstant", "endlich", "unendlich", "chronologie", "epoche", "ära", "generation", "jahrhundert", "zeitlos", "unvergänglich", "momentaufnahme", "temporär", "permanent", "unwiederbringlich"],
  herrschaft_krone: ["volk", "reich", "regieren", "herrscher", "könig", "krone", "pflicht", "verantwortung", "ehre", "versprechen", "nation", "bürger", "land", "führung", "dienen", "wohlstand", "einheit", "frieden", "gerechtigkeit", "weisheit", "demut", "throne", "macht", "autorität", "legitimität", "souverän", "regent", "monarch", "herrschaft", "untertanen", "schwur", "eid", "antritt"],
  frieden_diplomatie: ["frieden", "krieg", "verhandlung", "diplomatie", "nation", "konflikt", "versöhnung", "einigung", "waffe", "gewalt", "freiheit", "zusammenarbeit", "lösung", "kompromiss", "gemeinsam", "brücke", "dialog", "vermittlung", "abrüstung", "koexistenz", "toleranz", "respekt", "verständigung", "feindschaft", "allianz", "bündnis", "harmonie", "stabilität", "sicherheit"],
  justiz_gericht: ["gericht", "schuld", "unschuld", "anwalt", "richter", "verteidigung", "kläger", "beweis", "urteil", "gesetz", "recht", "wahrheit", "plädoyer", "geschworene", "angeklagter", "gerechtigkeit", "mandant", "zeuge", "verhandlung", "freispruch", "berufung", "überführen", "beweislast", "paragraph", "strafmaß", "jury", "verteidiger", "staatsanwalt", "prozess"],
  existenz_philosophie: ["sinn", "leben", "existenz", "zweck", "bedeutung", "philosophie", "frage", "antwort", "mensch", "dasein", "warum", "glück", "liebe", "erkenntnis", "wahrheit", "streben", "ziel", "wert", "bestimmung", "essenz", "absurdität", "freiheit", "verantwortung", "moral", "ethik", "tugend", "vergänglichkeit", "unendlichkeit", "bewusstsein", "reflexion", "weisheit", "erfahrung"],
};

// ──────────────────────────────────────────────────────
// 3. DEUTSCHE SPRACHSTRUKTUR
// ──────────────────────────────────────────────────────

const DEUTSCHE_VERBEN_STEMS = [
  "sein", "ist", "sind", "war", "bin", "bist", "wäre", "sei", "gewesen",
  "haben", "hat", "habe", "hatte", "hätte", "gehabt",
  "werden", "wird", "wurde", "würde", "werde", "wirst", "geworden",
  "können", "kann", "konnte", "könnte", "konnten",
  "müssen", "muss", "musste", "müsste", "sollen", "soll", "sollte",
  "wollen", "will", "wollte", "dürfen", "darf", "durfte", "dürfte",
  "mögen", "mag", "mochte", "möchte",
  "geben", "gibt", "gab", "gegeben", "machen", "macht", "machte", "gemacht",
  "gehen", "geht", "ging", "gegangen", "kommen", "kommt", "kam", "gekommen",
  "stehen", "steht", "stand", "gestanden", "lassen", "lässt", "ließ", "gelassen",
  "sagen", "sagt", "sagte", "gesagt", "sprechen", "spricht", "sprach", "gesprochen",
  "denken", "denkt", "dachte", "gedacht", "finden", "findet", "fand", "gefunden",
  "nehmen", "nimmt", "nahm", "genommen", "sehen", "sieht", "sah", "gesehen",
  "zeigen", "zeigt", "zeigte", "gezeigt", "führen", "führt", "führte", "geführt",
  "bringen", "bringt", "brachte", "gebracht", "leben", "lebt", "lebte", "gelebt",
  "liegen", "liegt", "lag", "gelegen", "bleiben", "bleibt", "blieb", "geblieben",
  "heißen", "heißt", "hieß", "tragen", "trägt", "trug", "getragen",
  "spielen", "spielt", "spielte", "gespielt", "lesen", "liest", "las", "gelesen",
  "schreiben", "schreibt", "schrieb", "geschrieben", "bedeuten", "bedeutet",
  "schaffen", "schafft", "schuf", "geschaffen", "kennen", "kennt", "kannte",
  "erkennen", "erkennt", "erkannte", "verstehen", "versteht", "verstand",
  "beginnen", "beginnt", "begann", "begonnen", "halten", "hält", "hielt",
  "tun", "tut", "tat", "getan", "brauchen", "braucht", "folgen", "folgt",
  "glauben", "glaubt", "helfen", "hilft", "half", "geholfen",
  "wissen", "weiß", "wusste", "ziehen", "zieht", "zog", "gezogen",
  "scheinen", "scheint", "schien", "fallen", "fällt", "fiel", "gefallen",
  "gehören", "gehört", "entstehen", "entsteht", "entstand",
  "erinnern", "erinnert", "fühlen", "fühlt", "bieten", "bietet", "bot",
  "überzeugen", "überzeugt", "bewegen", "bewegt", "offenbaren", "offenbart",
  "ermöglichen", "ermöglicht", "entfalten", "entfaltet", "prägen", "prägt",
  "bilden", "bildet", "lehren", "lehrt", "verkörpern", "verkörpert",
  "widerspiegeln", "widerspiegelt", "herrschen", "herrscht",
].map(v => v.toLowerCase());

const FUNKTIONS_WOERTER = new Set([
  "der", "die", "das", "den", "dem", "des", "ein", "eine", "einen", "einem", "einer", "eines",
  "ich", "du", "er", "sie", "es", "wir", "ihr", "mich", "mir", "dich", "dir", "ihm", "ihn",
  "sich", "uns", "euch", "ihnen", "man", "sein", "seine", "seinem", "seinen", "seiner",
  "und", "oder", "aber", "doch", "sondern", "denn", "weil", "dass", "wenn", "ob", "als",
  "wie", "so", "auch", "noch", "schon", "nur", "nicht", "kein", "keine", "keinem", "keinen",
  "in", "an", "auf", "für", "mit", "von", "zu", "bei", "nach", "vor", "über", "unter",
  "durch", "aus", "um", "bis", "ohne", "gegen", "zwischen", "während", "wegen", "trotz",
  "ist", "sind", "war", "hat", "haben", "wird", "werden", "kann", "muss", "soll", "will",
  "wurde", "hatte", "konnte", "sollte", "wollte", "darf", "durfte", "mag",
  "sehr", "mehr", "hier", "dort", "dann", "da", "nun", "immer", "nie", "oft",
  "jeder", "jede", "jedem", "jeden", "jedes", "alle", "aller", "allem", "allen",
  "dieser", "diese", "diesem", "diesen", "dieses", "jener", "jene", "jenem", "jenen",
  "welcher", "welche", "welchem", "welchen", "welches",
  "am", "im", "zum", "zur", "vom", "beim", "ins", "ans", "aufs",
]);

const NATUERLICHE_BIGRAMME = new Set([
  "in der", "in die", "in den", "in dem", "in einer", "in einem",
  "auf der", "auf die", "auf den", "auf dem", "an der", "an die",
  "von der", "von den", "von dem", "von einem", "von einer",
  "mit der", "mit dem", "mit den", "mit einem", "mit einer",
  "für die", "für den", "für das", "für ein", "für eine",
  "ist ein", "ist eine", "ist der", "ist die", "ist das", "ist es",
  "es ist", "es gibt", "es war", "es wird", "es kann", "es sei",
  "das ist", "zu sein", "zu haben", "zu werden", "zu können", "zu lassen",
  "ich bin", "ich habe", "ich war", "ich denke", "ich glaube", "ich meine",
  "wir sind", "wir haben", "wir können", "wir müssen", "wir sollten",
  "nicht nur", "sondern auch", "so wie", "als auch", "und doch",
  "wenn wir", "wenn man", "wenn es", "dass wir", "dass die", "dass der",
  "um zu", "um die", "um den", "um das",
  "durch die", "über die", "über den", "über das", "unter den", "zwischen den",
  "nach dem", "nach der", "vor dem", "vor der", "vor allem",
  "aus der", "aus dem", "aus den",
]);

// ──────────────────────────────────────────────────────
// 4. SATZ-SINN-PRÜFUNG (Kern der Anti-Trick-Engine)
// ──────────────────────────────────────────────────────

function tokenize(text) {
  return text.toLowerCase().replace(/[„""»«]/g, '"').replace(/[—–\-]/g, ' ')
    .split(/\s+/).map(w => w.replace(/^[^a-zäöüß]+|[^a-zäöüß]+$/gi, '')).filter(w => w.length > 0);
}

function hatVerb(satzInput) {
  const woerter = typeof satzInput === 'string' ? tokenize(satzInput) : satzInput;
  // Substantiv-Endungen ausschließen
  const nichtVerb = /(schaft|heit|keit|ung|nis|tät|mus|ion|enz|anz|tum|ling|chen|lein)$/;
  for (const w of woerter) {
    if (DEUTSCHE_VERBEN_STEMS.includes(w)) return true;
    if (nichtVerb.test(w)) continue; // Substantive überspringen
    if (/^ge.+[t]$/.test(w) && w.length > 4) return true;
    if (/iert$/.test(w) && w.length > 5) return true;
    if (/ieren$/.test(w) && w.length > 6) return true;
    if (/[^s]te$/.test(w) && w.length > 4) return true;
    if (/[^s]ten$/.test(w) && w.length > 5) return true;
    // -en Endung: nur wenn nicht Substantiv-typisch
    if (w.endsWith("en") && w.length > 5 && !FUNKTIONS_WOERTER.has(w)) return true;
  }
  return false;
}

function satzSinnScore(satz) {
  const woerter = tokenize(satz);
  if (woerter.length < 2) return 0;
  if (woerter.length > 80) return 0.7; // Lange Sätze können gut sein
  let score = 0;
  const n = woerter.length;

  // Verb vorhanden? (Fundamental für jeden deutschen Satz)
  if (!hatVerb(woerter)) return 0.15;
  score += 0.35; // Verb = starkes Signal für sinnvollen Satz

  // Funktionswort-Ratio (natürlich: 20-65%)
  const fwRatio = woerter.filter(w => FUNKTIONS_WOERTER.has(w)).length / n;
  if (fwRatio >= 0.15 && fwRatio <= 0.7) score += 0.25;
  else if (fwRatio >= 0.08 && fwRatio <= 0.8) score += 0.12;
  else score -= 0.1; // Sehr unnatürliche Ratio

  // N-Gram Natürlichkeit (Bonus, nicht entscheidend)
  let bigramHits = 0;
  for (let i = 0; i < woerter.length - 1; i++) {
    if (NATUERLICHE_BIGRAMME.has(woerter[i] + " " + woerter[i + 1])) bigramHits++;
  }
  if (n > 2) score += Math.min(bigramHits / (n - 1) * 2, 0.15);
  // Null-Bigramm-Strafe: bei langen Texten ohne jegliche natürliche Wortpaare
  if (n >= 10 && bigramHits === 0) score -= 0.15;

  // Wortlängen-Verteilung (natürliche Texte: avg 3-9)
  const avgLen = woerter.reduce((s, w) => s + w.length, 0) / n;
  if (avgLen >= 3 && avgLen <= 9) score += 0.1;

  // Verschiedene Wortlängen (mehr Vielfalt = natürlicher)
  const lenVielfalt = new Set(woerter.map(w => w.length)).size;
  if (lenVielfalt >= Math.min(n * 0.3, 4)) score += 0.05;

  // Inhaltswort-Ratio (sinnvolle Sätze haben 30-80% Inhaltswörter)
  const inhalt = woerter.filter(w => !FUNKTIONS_WOERTER.has(w));
  const inhaltRatio = inhalt.length / n;
  if (inhaltRatio >= 0.25 && inhaltRatio <= 0.85) score += 0.05;

  // Wort-Vielfalt im Satz
  if (inhalt.length > 0) {
    const uRatio = new Set(inhalt).size / inhalt.length;
    if (uRatio >= 0.7) score += 0.05;
    else if (uRatio < 0.25) score -= 0.15;
  }

  // Wortsalat-Erkennung: Zu viele aufeinanderfolgende Inhaltswörter = unnatürlich
  // In natürlichen Sätzen stehen max 2-3 Inhaltswörter hintereinander
  let maxRun = 0, currentRun = 0;
  for (const w of woerter) {
    if (!FUNKTIONS_WOERTER.has(w) && !DEUTSCHE_VERBEN_STEMS.includes(w)) {
      currentRun++;
      if (currentRun > maxRun) maxRun = currentRun;
    } else {
      currentRun = 0;
    }
  }
  if (maxRun >= 5) score -= 0.25;      // Starker Wortsalat
  else if (maxRun >= 4) score -= 0.15;  // Leichter Wortsalat

  // Phrase-Struktur-Check: hat der Satz mindestens eine typische deutsche Phrase?
  let hatPhrase = false;
  const artikel = new Set(["der", "die", "das", "den", "dem", "des", "ein", "eine", "einen", "einem", "einer"]);
  const praep = new Set(["in", "an", "auf", "für", "mit", "von", "zu", "bei", "nach", "aus", "um", "über", "vor", "durch", "gegen", "unter", "zwischen"]);
  const kontraktionen = new Set(["im", "am", "zum", "zur", "vom", "beim", "ins", "ans", "aufs"]);
  for (let i = 0; i < woerter.length - 1; i++) {
    const w1 = woerter[i], w2 = woerter[i + 1];
    // Artikel + Inhaltswort
    if (artikel.has(w1) && !FUNKTIONS_WOERTER.has(w2)) { hatPhrase = true; break; }
    // Präposition + Artikel
    if (praep.has(w1) && artikel.has(w2)) { hatPhrase = true; break; }
    // Kontraktion (im/am/zum...) + Inhaltswort
    if (kontraktionen.has(w1) && !FUNKTIONS_WOERTER.has(w2)) { hatPhrase = true; break; }
    // "zu" + Verb (Infinitivkonstruktion)
    if (w1 === "zu" && hatVerb([w2])) { hatPhrase = true; break; }
    // Subjektpronomen + Verb
    if (["ich", "du", "er", "sie", "es", "wir", "ihr", "man", "wer"].includes(w1) && (DEUTSCHE_VERBEN_STEMS.includes(w2) || hatVerb([w2]))) { hatPhrase = true; break; }
  }
  if (n >= 8 && !hatPhrase) score -= 0.15; // Kein einziges Phrasenmuster = verdächtig

  return Math.max(0.1, Math.min(score, 1));
}

function textKohaerenz(saetze) {
  if (saetze.length < 2) return 0.7; // Einzelner Satz = neutral-positiv
  let total = 0, count = 0;

  // Globale Themen-Wörter sammeln (über ganzen Text)
  const alleInhalt = new Set();
  for (const s of saetze) {
    for (const w of tokenize(s)) {
      if (!FUNKTIONS_WOERTER.has(w) && w.length > 2) alleInhalt.add(w);
    }
  }

  const konnektoren = new Set(["daher", "deshalb", "folglich", "denn", "weil", "somit", "also",
    "dennoch", "allerdings", "jedoch", "dabei", "zudem", "ferner", "zugleich",
    "darüber", "außerdem", "überdies", "indes", "hierbei", "demnach",
    "einerseits", "andererseits", "nichtsdestotrotz", "gleichwohl",
    "schließlich", "letztlich", "doch", "trotzdem", "hingegen",
    "denn", "dafür", "dagegen", "vielmehr", "insofern", "nämlich",
    "nicht", "nur", "sondern", "auch", "zwar", "obwohl", "während"]);

  for (let i = 1; i < saetze.length; i++) {
    const prev = new Set(tokenize(saetze[i - 1]).filter(w => !FUNKTIONS_WOERTER.has(w) && w.length > 2));
    const curr = tokenize(saetze[i]).filter(w => !FUNKTIONS_WOERTER.has(w) && w.length > 2);
    const currSet = new Set(curr);
    let pairScore = 0;

    // 1. Direkte Wort-Überlappung
    let directOverlap = 0;
    for (const w of currSet) if (prev.has(w)) directOverlap++;
    pairScore += Math.min(directOverlap * 0.25, 0.4);

    // 2. Stamm-Überlappung (toleranter: 55% des Worts)
    let stemOverlap = 0;
    for (const w1 of currSet) {
      for (const w2 of prev) {
        if (w1.length > 3 && w2.length > 3) {
          const minLen = Math.min(w1.length, w2.length);
          const compareLen = Math.max(3, Math.floor(minLen * 0.55));
          if (w1.slice(0, compareLen) === w2.slice(0, compareLen) && w1 !== w2) { stemOverlap++; break; }
        }
      }
    }
    pairScore += Math.min(stemOverlap * 0.15, 0.25);

    // 3. Konnektor am Satzanfang (starkes Kohärenzsignal)
    const ersteW = tokenize(saetze[i]).slice(0, 3);
    if (ersteW.some(w => konnektoren.has(w))) pairScore += 0.25;

    // 4. Thematische Nähe (teilen Wörter mit Gesamttext-Thema)
    const themaHits = curr.filter(w => alleInhalt.has(w)).length;
    pairScore += Math.min(themaHits / Math.max(curr.length, 1) * 0.3, 0.15);

    total += Math.min(pairScore, 1);
    count++;
  }

  // Bonus: Alle Sätze teilen mindestens ein Themen-Wort
  let themaConsistency = 0;
  for (const s of saetze) {
    const sw = new Set(tokenize(s).filter(w => !FUNKTIONS_WOERTER.has(w) && w.length > 3));
    let hatThema = false;
    for (const other of saetze) {
      if (other === s) continue;
      const ow = tokenize(other).filter(w => !FUNKTIONS_WOERTER.has(w) && w.length > 3);
      // Direkter Wort-Match ODER Stamm-Match
      if (ow.some(w => {
        if (sw.has(w)) return true;
        for (const s2 of sw) {
          if (w.length > 3 && s2.length > 3) {
            const minL = Math.min(w.length, s2.length);
            if (w.slice(0, Math.max(3, Math.floor(minL * 0.55))) === s2.slice(0, Math.max(3, Math.floor(minL * 0.55)))) return true;
          }
        }
        return false;
      })) { hatThema = true; break; }
    }
    if (hatThema) themaConsistency++;
  }
  const consistencyBonus = themaConsistency / saetze.length * 0.3;

  // Pronomen/Demonstrativa-Referenz ("es", "dies", "das" am Satzanfang = Bezug zum Vorherigen)
  const referenzWoerter = new Set(["es", "dies", "diese", "dieser", "dieses", "das", "jene", "solch", "solche", "dabei", "daraus", "darin", "dazu", "daher", "deshalb"]);
  let referenzCount = 0;
  for (let i = 1; i < saetze.length; i++) {
    const ersteW = tokenize(saetze[i]).slice(0, 3);
    if (ersteW.some(w => referenzWoerter.has(w))) referenzCount++;
  }
  const referenzBonus = saetze.length > 1 ? referenzCount / (saetze.length - 1) * 0.15 : 0;

  // Semantisches Feld: wenn mehrere Sätze Wörter aus dem gleichen sem. Feld teilen
  let feldBonus = 0;
  for (const [feld, woerter] of Object.entries(SEMANTISCHE_FELDER)) {
    let saetzeMitFeld = 0;
    for (const s of saetze) {
      const sw = tokenize(s);
      if (woerter.some(w => sw.some(t => t.includes(w) || w.includes(t)))) saetzeMitFeld++;
    }
    if (saetzeMitFeld >= 2) {
      feldBonus = Math.max(feldBonus, saetzeMitFeld / saetze.length * 0.2);
    }
  }

  const rawScore = count > 0 ? total / count : 0.5;
  return Math.min(rawScore + consistencyBonus + referenzBonus + feldBonus, 1);
}

// ──────────────────────────────────────────────────────
// 5. TIEFES ANTI-GAMING (nicht austricksbar)
// ──────────────────────────────────────────────────────

function tiefesAntiGaming(text) {
  const woerter = tokenize(text);
  const n = woerter.length;
  const saetze = text.split(/[.!?]+/).map(s => s.trim()).filter(s => s.length > 3);
  const flags = [];
  let gs = 0;

  if (n < 8) { flags.push("text_zu_kurz"); gs += 0.6; }
  if (saetze.length === 0 && n > 5) { flags.push("keine_saetze"); gs += 0.4; }

  const uniqueRatio = n > 0 ? new Set(woerter).size / n : 0;
  if (uniqueRatio < 0.3 && n > 8) { flags.push("wort_spam"); gs += 0.5; }

  if (saetze.length > 0) {
    const avgSinn = saetze.map(s => satzSinnScore(s)).reduce((a, b) => a + b, 0) / saetze.length;
    if (avgSinn < 0.2) { flags.push("kein_sinn"); gs += 0.5; }
    else if (avgSinn < 0.35) { flags.push("wenig_sinn"); gs += 0.25; }
  }

  const gehobeneCount = woerter.filter(w => GEHOBENE_WOERTER.has(w)).length;
  if (n > 5 && gehobeneCount / n > 0.5) { flags.push("keyword_stuffing"); gs += 0.4; }

  const fwRatio = woerter.filter(w => FUNKTIONS_WOERTER.has(w)).length / Math.max(n, 1);
  if (fwRatio < 0.1 && n > 10) { flags.push("keine_funktionswoerter"); gs += 0.3; }
  if (fwRatio > 0.8) { flags.push("nur_funktionswoerter"); gs += 0.3; }

  if (/(.)\1{4,}/i.test(text)) { flags.push("zeichenwiederholung"); gs += 0.3; }

  if (saetze.length >= 2) {
    const norm = saetze.map(s => s.toLowerCase().trim());
    if (new Set(norm).size < norm.length * 0.6) { flags.push("satz_kopien"); gs += 0.4; }
  }

  const komma = text.split(",").map(s => s.trim());
  if (komma.length > 6 && saetze.length <= 1) {
    if (komma.filter(s => s.split(/\s+/).length <= 2).length > komma.length * 0.7) {
      flags.push("reine_aufzaehlung"); gs += 0.3;
    }
  }

  const buchst = text.toLowerCase().replace(/[^a-zäöüß]/g, "");
  if (buchst.length > 10) {
    const freq = {};
    for (const c of buchst) freq[c] = (freq[c] || 0) + 1;
    const entropy = Object.values(freq).reduce((s, f) => { const p = f / buchst.length; return s - p * Math.log2(p); }, 0);
    if (entropy < 2.5) { flags.push("gibberish"); gs += 0.3; }
  }

  return { isGaming: gs >= 0.5, gamingScore: Math.min(gs, 1), flags, penalty: Math.max(0, 1 - gs) };
}

// ──────────────────────────────────────────────────────
// 6. SEMANTISCHER SITUATIONS-MATCH
// ──────────────────────────────────────────────────────

function semantischerSituationsmatch(situation, text) {
  const inhalt = new Set(tokenize(text).filter(w => !FUNKTIONS_WOERTER.has(w) && w.length > 3));
  let best = { feld: null, score: 0, hits: [] };

  for (const [name, woerter] of Object.entries(SEMANTISCHE_FELDER)) {
    const hits = [];
    for (const fw of woerter) {
      for (const iw of inhalt) {
        if (iw.includes(fw) || fw.includes(iw)) { hits.push(fw); break; }
      }
    }
    const sc = hits.length / Math.max(woerter.length * 0.3, 1);
    if (sc > best.score) best = { feld: name, score: sc, hits };
  }

  const titelT = tokenize(situation.titel).filter(w => w.length > 3 && !FUNKTIONS_WOERTER.has(w));
  const beschT = tokenize(situation.beschreibung).filter(w => w.length > 4 && !FUNKTIONS_WOERTER.has(w));
  let dh = 0;
  for (const kw of [...titelT, ...beschT]) for (const iw of inhalt) { if (iw.includes(kw) || kw.includes(iw)) { dh++; break; } }
  const ds = Math.min(dh / Math.max(titelT.length + beschT.length * 0.3, 1), 1);

  return { punkte: Math.min(Math.round(Math.max(best.score, ds * 0.8) * 180) / 10, 15), feldMatch: best.feld, semantischeHits: best.hits.length, direkteHits: dh };
}

// ──────────────────────────────────────────────────────
// 7. RHETORISCHE MITTEL (erweitert, 12 Figuren)
// ──────────────────────────────────────────────────────

function erkenneRhetorischeMittel(text) {
  // ────── Erweiterte Erkennung: 13 Figuren ──────
  const mittel = [];
  const lower = text.toLowerCase();
  const saetze = text.split(/[.!?]+/).map(s => s.trim()).filter(s => s.length > 3);
  const woerter = tokenize(text);

  // 1. Vergleich / Metapher — kontextuell geprüft
  const vergleichMatches = text.match(/wie\s+(ein[e]?[mnrs]?|der|die|das|zu[mr]?)\s+[\wäöüÄÖÜß]{3,}/gi) || [];
  for (const v of vergleichMatches) {
    // Prüfe ob der umgebende Satz Sinn ergibt (mind. 4 Wörter)
    const ctx = saetze.find(s => s.includes(v.trim()));
    if (ctx && ctx.split(/\s+/).length >= 4) {
      mittel.push({ name: "Vergleich/Metapher", beispiel: v.trim(), warum: "Bildhafte Sprache durch Vergleich — macht die Aussage lebendig und greifbar." });
    }
  }
  // Metapherische Genitivkonstruktion: "Meer der Möglichkeiten"
  // Strengerer Check: Erstes Wort muss ein Inhaltswort sein UND darf kein generisches Wort sein
  const generischeWoerter = new Set(["all", "teil", "art", "form", "rest", "zahl", "menge", "reihe", "vielzahl", "anzahl", "hälfte", "anfang", "ende", "mitte", "seite", "rand", "grund", "folge", "lauf", "gang", "weise"]);
  const genitivMetapher = text.match(/\b[\wäöüÄÖÜß]{3,}\s+d(er|es)\s+[\wäöüÄÖÜß]{4,}/gi) || [];
  for (const gm of genitivMetapher) {
    const parts = gm.split(/\s+/);
    const erstesWort = parts[0].toLowerCase();
    const letztesWort = parts[parts.length - 1].toLowerCase();
    // Beide Wörter müssen Inhaltswörter sein und das erste darf nicht generisch sein
    if (parts.length >= 3 && !FUNKTIONS_WOERTER.has(erstesWort) && !generischeWoerter.has(erstesWort)
        && !FUNKTIONS_WOERTER.has(letztesWort) && !generischeWoerter.has(letztesWort)
        && erstesWort.length >= 4 && letztesWort.length >= 4) {
      // Zusätzlich: Die Wörter müssen aus verschiedenen semantischen Feldern stammen
      // (sonst ist es keine Metapher, sondern wörtlich)
      const istMetaphorisch = !letztesWort.includes(erstesWort) && !erstesWort.includes(letztesWort);
      if (istMetaphorisch) {
        mittel.push({ name: "Vergleich/Metapher", beispiel: gm.trim(), warum: "Genitivmetapher — elegante bildhafte Ausdrucksweise." });
        break;
      }
    }
  }

  // 2. Personifikation — abstrakte Subjekte mit menschlichen Verben
  const personifikVerben = ["tanzt", "weint", "lacht", "flüstert", "schreit", "schweigt", "erwacht", "schläft", "träumt", "singt", "spricht", "ruft", "atmet", "lebt", "stirbt", "kämpft", "hofft"];
  const abstrakta = ["zeit", "wind", "nacht", "welt", "freiheit", "liebe", "hoffnung", "stille", "dunkelheit", "licht", "wahrheit", "natur", "schicksal", "glück", "angst", "freude", "seele", "herz", "stadt", "meer"];
  for (const s of saetze) {
    const sw = s.toLowerCase().split(/\s+/);
    const hatAbstraktum = sw.some(w => abstrakta.includes(w.replace(/[^a-zäöüß]/g, "")));
    const hatPersVerb = sw.some(w => personifikVerben.includes(w.replace(/[^a-zäöüß]/g, "")));
    if (hatAbstraktum && hatPersVerb) {
      mittel.push({ name: "Personifikation", beispiel: s.length > 80 ? s.slice(0, 77) + "..." : s, warum: "Abstrakte Begriffe werden als handelnde Wesen dargestellt — erzeugt Lebendigkeit." });
      break;
    }
  }

  // 3. Rhetorische Frage — nur wenn im Kontext sinnvoll
  const frageTeile = text.split("?").slice(0, -1);
  for (const teil of frageTeile) {
    const frageSatz = teil.split(/[.!]/).pop()?.trim();
    if (frageSatz && frageSatz.split(/\s+/).length >= 4 && hatVerb(frageSatz)) {
      const beispiel = frageSatz.length > 80 ? frageSatz.slice(0, 77) + "..." : frageSatz;
      mittel.push({ name: "Rhetorische Frage", beispiel: beispiel + "?", warum: "Fragen regen zum Nachdenken an und verstärken die Aussage." });
      break;
    }
  }

  // 4. Antithese — Gegensatzpaare
  const antithesePatterns = [
    { re: /nicht\s+nur\s+.{3,60}sondern\s+(auch\s+)?/i, name: "nicht nur...sondern" },
    { re: /einerseits\s+.{3,80}andererseits/i, name: "einerseits...andererseits" },
    { re: /weder\s+.{3,60}noch\s+/i, name: "weder...noch" },
    { re: /zwar\s+.{3,60}(aber|jedoch|doch)\s+/i, name: "zwar...aber" },
    { re: /auf\s+der\s+einen\s+seite.{5,80}auf\s+der\s+anderen/i, name: "auf der einen/anderen Seite" },
    { re: /im\s+gegensatz\s+(zu|dazu)/i, name: "im Gegensatz zu" },
  ];
  for (const { re, name } of antithesePatterns) {
    const m = lower.match(re);
    if (m) {
      mittel.push({ name: "Antithese", beispiel: text.slice(m.index, m.index + Math.min(m[0].length + 20, 90)).trim(), warum: `Gegensatzpaar (${name}) — verstärkt die Argumentation durch Kontrast.` });
      break;
    }
  }

  // 5. Trikolon — drei parallele Elemente
  const trikolonRe = /(\b[\wäöüÄÖÜß]{2,}\b)\s*,\s*(\b[\wäöüÄÖÜß]{2,}\b)\s+(und|sowie|oder|wie\s+auch)\s+(\b[\wäöüÄÖÜß]{2,}\b)/gi;
  const tMatch = text.match(trikolonRe);
  if (tMatch) {
    const parts = tMatch[0].split(/[,]\s*|\s+(und|sowie|oder)\s+/i).filter(Boolean);
    // Alle drei Teile müssen inhaltlich sein (keine Funktionswörter)
    const inhaltlich = parts.filter(p => !FUNKTIONS_WOERTER.has(p.trim().toLowerCase()));
    if (inhaltlich.length >= 3) {
      mittel.push({ name: "Trikolon", beispiel: tMatch[0], warum: "Dreiergruppen erzeugen Rhythmus, Nachdruck und bleiben im Gedächtnis." });
    }
  }

  // 6. Anapher — Wiederholung am Satzanfang
  if (saetze.length >= 2) {
    const anfaenge = saetze.map(s => s.split(/\s+/).slice(0, 2).join(" ").toLowerCase());
    for (let i = 0; i < anfaenge.length - 1; i++) {
      const erstesWort = saetze[i].split(/\s+/)[0]?.toLowerCase();
      if (erstesWort && erstesWort.length > 2 && !FUNKTIONS_WOERTER.has(erstesWort) && anfaenge[i] === anfaenge[i + 1]) {
        mittel.push({ name: "Anapher", beispiel: `"${saetze[i].split(/\s+/)[0]}..." — Wiederholung am Satzanfang`, warum: "Wiederholung am Satzanfang erzeugt Emphase und rhetorischen Rhythmus." });
        break;
      }
    }
  }

  // 7. Alliteration — mind. 3 aufeinanderfolgende Wörter mit gleichem Anlaut
  for (let i = 0; i < woerter.length - 2; i++) {
    const a = woerter[i][0]?.toLowerCase();
    const b = woerter[i + 1][0]?.toLowerCase();
    const c = woerter[i + 2][0]?.toLowerCase();
    if (a && a === b && b === c && /[a-zäöüß]/.test(a) && woerter[i].length > 2) {
      mittel.push({ name: "Alliteration", beispiel: `${woerter[i]} ${woerter[i + 1]} ${woerter[i + 2]}`, warum: "Gleicher Anlaut bei drei+ Wörtern erzeugt Klangwirkung." });
      break;
    }
  }
  // Auch bei 2 Wörtern wenn mindestens 4 Buchstaben
  if (!mittel.some(m => m.name === "Alliteration")) {
    for (let i = 0; i < woerter.length - 1; i++) {
      const a = woerter[i][0]?.toLowerCase();
      const b = woerter[i + 1][0]?.toLowerCase();
      if (a && a === b && /[a-zäöüß]/.test(a) && woerter[i].length > 3 && woerter[i + 1].length > 3 && !FUNKTIONS_WOERTER.has(woerter[i].toLowerCase())) {
        mittel.push({ name: "Alliteration", beispiel: `${woerter[i]} ${woerter[i + 1]}`, warum: "Gleiche Anfangslaute erzeugen Klang und Rhythmus." });
        break;
      }
    }
  }

  // 8. Klimax — Steigerung
  const klimaxPatterns = [
    /nicht\s+nur.{3,}mehr\s+noch/i,
    /erst\s+.{3,}dann\s+.{3,}schließlich/i,
    /ja,?\s+sogar/i,
    /mehr\s+als\s+das\b/i,
    /nicht\s+bloß.{3,}sondern\s+vor\s+allem/i,
    /zunächst.{5,}darüber\s+hinaus.{5,}vor\s+allem/i,
  ];
  for (const re of klimaxPatterns) {
    if (re.test(text)) {
      mittel.push({ name: "Klimax", beispiel: "Steigernde Aufzählung erkannt", warum: "Steigernd aufgebaute Aussagen erzeugen Spannung und Nachdruck." });
      break;
    }
  }

  // 9. Hyperbel — nur wenn im sinnvollen Satzkontext
  const hyperbelWoerter = ["unendlich", "ewig", "grenzenlos", "maßlos", "unermesslich", "tausend", "millionen", "niemals", "allzeit", "gigantisch", "kolossal", "himmlisch", "göttlich", "unvorstellbar", "überwältigend"];
  for (const h of hyperbelWoerter) {
    if (lower.includes(h)) {
      const hSatz = saetze.find(s => s.toLowerCase().includes(h));
      if (hSatz && hSatz.split(/\s+/).length >= 4 && hatVerb(hSatz)) {
        mittel.push({ name: "Hyperbel", beispiel: hSatz.length > 80 ? hSatz.slice(0, 77) + "..." : hSatz, warum: "Bewusste Übertreibung verstärkt die emotionale Wirkung." });
        break;
      }
    }
  }

  // 10. Parenthese — Einschub mit Gedankenstrichen oder Klammern
  const parentheseMatch = text.match(/[–—]\s*.{5,60}\s*[–—]/) || text.match(/\(.{8,60}\)/);
  if (parentheseMatch) {
    mittel.push({ name: "Parenthese", beispiel: parentheseMatch[0].slice(0, 60), warum: "Einschübe fügen ergänzende Gedanken ein und zeigen Reflexionsvermögen." });
  }

  // 11. Chiasmus — Kreuzstellung (A-B → B-A)
  if (/\bnicht\s+[\wäöüß]+\s+[\wäöüß]+,?\s+sondern\s+[\wäöüß]+\s+[\wäöüß]+/i.test(text)) {
    mittel.push({ name: "Chiasmus", beispiel: "Kreuzstellung erkannt", warum: "Die Überkreuzung von Satzteilen erzeugt einen eleganten rhetorischen Kontrast." });
  }

  // 12. Ellipse — unvollständiger Satz mit Wirkung
  for (const s of saetze) {
    const sw = s.split(/\s+/);
    if (sw.length >= 2 && sw.length <= 5 && !hatVerb(s) && !FUNKTIONS_WOERTER.has(sw[0].toLowerCase())) {
      mittel.push({ name: "Ellipse", beispiel: s, warum: "Bewusste Auslassung erzeugt Prägnanz und Nachdruck." });
      break;
    }
  }

  // 13. Oxymoron — Widerspruch in sich
  const oxymora = [
    ["bitter", "süß"], ["alt", "neu"], ["dunkel", "hell"], ["laut", "leise"],
    ["kalt", "warm"], ["groß", "klein"], ["schwarz", "weiß"], ["traurig", "froh"],
    ["scheiter", "gelingen"], ["tod", "leben"], ["lieb", "hass"],
  ];
  for (const [a, b] of oxymora) {
    if (lower.includes(a) && lower.includes(b)) {
      const dist = Math.abs(lower.indexOf(a) - lower.indexOf(b));
      if (dist < 40) {
        mittel.push({ name: "Oxymoron", beispiel: `${a}...${b}`, warum: "Widersprüchliche Begriffe nah beieinander erzeugen spannungsvolle Spannung." });
        break;
      }
    }
  }

  return mittel;
}

// ──────────────────────────────────────────────────────
// 8. GEHOBENE WÖRTER FINDEN (mit Stammvergleich)
// ──────────────────────────────────────────────────────

function findeGehobeneWoerter(text) {
  const lower = text.toLowerCase();
  const tokens = tokenize(text);
  const gesehen = new Set();
  const gefunden = [];

  // Direkter Match in GEHOBENE_WOERTER Map
  for (const [wort] of GEHOBENE_WOERTER) {
    const wLow = wort.toLowerCase();
    if (gesehen.has(wLow)) continue;
    // Exakter Match oder Stammvergleich
    if (lower.includes(wLow)) {
      gesehen.add(wLow);
      gefunden.push(wort);
    } else {
      // Stammvergleich: prüfe ob ein Token den Wort-Stamm enthält
      const stamm = wLow.slice(0, Math.max(wLow.length - 2, 4));
      if (tokens.some(t => t.toLowerCase().startsWith(stamm) && t.length >= stamm.length)) {
        gesehen.add(wLow);
        gefunden.push(wort);
      }
    }
  }

  // Auch Wörter aus dem WOERTERBUCH prüfen
  for (const entry of WOERTERBUCH) {
    const wLow = entry.wort.toLowerCase();
    if (gesehen.has(wLow)) continue;
    if (lower.includes(wLow)) {
      gesehen.add(wLow);
      gefunden.push(entry.wort);
    }
  }

  return gefunden;
}

// ──────────────────────────────────────────────────────
// 9. WORTSCHATZ-TIEFENANALYSE
// ──────────────────────────────────────────────────────

function analysiereWortschatz(text, gehobene) {
  const tokens = tokenize(text);
  if (tokens.length < 3) return { score: 0, details: {} };

  // Type-Token-Ratio (TTR)
  const unique = new Set(tokens.map(t => t.toLowerCase()));
  const ttr = unique.size / tokens.length;

  // Wortlängenverteilung (lange Wörter = elaborierter)
  const langWoerter = tokens.filter(t => t.length >= 8).length;
  const langAnteil = langWoerter / tokens.length;

  // Komposita-Erkennung (deutsche Zusammensetzungen, >12 Zeichen)
  // Use original text words (not lowercased tokens) to detect capitalized compound nouns
  const originalWords = text.split(/\s+/).map(w => w.replace(/^[^a-zA-ZäöüÄÖÜß]+|[^a-zA-ZäöüÄÖÜß]+$/g, '')).filter(w => w.length > 0);
  const komposita = originalWords.filter(t => t.length > 12 && /^[A-ZÄÖÜ]/.test(t));

  // Fremdwort-Erkennung (lateinisch/griechisch/französisch geprägt)
  const fremdStaemme = ["tion", "ment", "ität", "ismus", "istisch", "phie", "logie", "thek", "tisch", "zial", "ziell", "iere", "ance", "enz", "ique", "eur"];
  const fremdwoerter = tokens.filter(t => fremdStaemme.some(s => t.toLowerCase().endsWith(s)));

  // Durchschnittliche Wortlänge
  const avgLen = tokens.reduce((s, t) => s + t.length, 0) / tokens.length;

  // Rare-Word-Index: Seltenheit der Inhaltswörter messen
  // Häufige Wörter (Top-500 Deutsch) vs ungewöhnliche Wörter
  const HAEUFIGE_WOERTER = new Set([
    "sein", "haben", "werden", "können", "müssen", "sollen", "wollen", "dürfen", "mögen",
    "machen", "gehen", "kommen", "geben", "nehmen", "sagen", "sehen", "finden", "stehen",
    "lassen", "bringen", "halten", "zeigen", "führen", "sprechen", "denken", "liegen",
    "bleiben", "tragen", "lesen", "spielen", "schreiben", "leben", "kennen", "beginnen",
    "ding", "sache", "leute", "kind", "mann", "frau", "mensch", "tag", "jahr", "zeit",
    "welt", "hand", "land", "haus", "stadt", "weg", "kopf", "geld", "arbeit", "schule",
    "gross", "groß", "klein", "gut", "schlecht", "neu", "alt", "lang", "kurz", "hoch",
    "schön", "schnell", "langsam", "einfach", "richtig", "falsch", "wichtig", "möglich",
    "toll", "super", "mega", "cool", "nett", "lustig", "interessant", "normal", "stark",
    "viel", "immer", "auch", "noch", "schon", "dann", "hier", "dort", "jetzt", "heute",
    "ganz", "sehr", "wirklich", "eben", "halt", "mal", "doch", "nur", "erst",
    "beeindruckend", "besonders", "natürlich", "eigentlich", "wahrscheinlich",
    "gefühl", "problem", "frage", "antwort", "beispiel", "grund", "teil",
  ]);
  const inhaltTokens = tokens.filter(t => !FUNKTIONS_WOERTER.has(t.toLowerCase()) && t.length > 3);
  const selteneWoerter = inhaltTokens.filter(t => {
    const tl = t.toLowerCase();
    return !HAEUFIGE_WOERTER.has(tl) && tl.length >= 5;
  });
  const rareWordRatio = inhaltTokens.length > 0 ? selteneWoerter.length / inhaltTokens.length : 0;

  // Entropie (Informationsgehalt): Wie viel Information pro Wort?
  const wordFreq = new Map();
  for (const t of tokens) {
    const tl = t.toLowerCase();
    wordFreq.set(tl, (wordFreq.get(tl) || 0) + 1);
  }
  let entropie = 0;
  for (const count of wordFreq.values()) {
    const p = count / tokens.length;
    if (p > 0) entropie -= p * Math.log2(p);
  }
  // Normalisierte Entropie (relativ zur max möglichen)
  const maxEntropie = Math.log2(tokens.length);
  const normEntropie = maxEntropie > 0 ? entropie / maxEntropie : 0;

  // Scoring
  let score = 0;
  score += Math.min(ttr * 8, 5);               // TTR bis 5
  score += Math.min(langAnteil * 15, 3);        // Lange Wörter bis 3
  score += Math.min(komposita.length * 0.5, 1); // Komposita bis 1
  score += Math.min(fremdwoerter.length * 0.5, 1.5); // Fremdwörter bis 1.5
  score += Math.min((avgLen - 4) * 0.8, 2);     // Wortlänge bis 2
  score += Math.min(gehobene.length * 1.5, 5);  // Gehobene Wörter bis 5
  // Rare-Word-Index Bonus (bis 3)
  if (rareWordRatio >= 0.7) score += 3;
  else if (rareWordRatio >= 0.5) score += 2;
  else if (rareWordRatio >= 0.3) score += 1;
  // Entropie-Bonus (bis 1.5): Hohe Informationsdichte
  if (normEntropie >= 0.9) score += 1.5;
  else if (normEntropie >= 0.8) score += 1;
  else if (normEntropie >= 0.7) score += 0.5;

  // Diversitäts-Bonus: verschiedene Kategorien gehobener Wörter
  const katSet = new Set();
  gehobene.forEach(gw => {
    const entry = WOERTERBUCH.find(w => w.wort.toLowerCase() === gw.toLowerCase());
    if (entry) katSet.add(entry.kategorie);
  });
  score += Math.min(katSet.size * 0.5, 1.5);

  return {
    score: Math.min(Math.round(score * 10) / 10, 15),
    details: { ttr: Math.round(ttr * 100), langWoerter, komposita: komposita.length, fremdwoerter: fremdwoerter.length, avgLen: Math.round(avgLen * 10) / 10, rareWordRatio: Math.round(rareWordRatio * 100), entropie: Math.round(normEntropie * 100) },
  };
}

// ──────────────────────────────────────────────────────
// 10. DISKURSSTRUKTUR-ANALYSE
// ──────────────────────────────────────────────────────

function analysiereDiskursstruktur(text) {
  const saetze = text.split(/[.!?]+/).filter(s => s.trim().length > 5);
  const lower = text.toLowerCase();

  // Konnektoren-Analyse (kausal, temporal, adversativ, additiv)
  const konnektorGruppen = {
    kausal: ["daher", "deshalb", "folglich", "denn", "weil", "somit", "also", "insofern", "demzufolge", "infolgedessen", "mithin", "aufgrund"],
    temporal: ["zunächst", "sodann", "schließlich", "erstens", "zweitens", "drittens", "anfangs", "danach", "abschließend", "zuletzt"],
    adversativ: ["jedoch", "dennoch", "allerdings", "nichtsdestotrotz", "gleichwohl", "hingegen", "im gegensatz", "andererseits", "trotzdem", "freilich"],
    additiv: ["zudem", "ferner", "überdies", "darüber hinaus", "des weiteren", "außerdem", "nicht zuletzt", "vor allem", "insbesondere", "namentlich"],
    konklusiv: ["zusammenfassend", "letztlich", "im kern", "im grunde", "kurzum", "dementsprechend", "im ergebnis", "abschließend betrachtet"],
  };

  let konnektorAnzahl = 0;
  let konnektorVielfalt = 0;
  for (const [gruppe, konnektoren] of Object.entries(konnektorGruppen)) {
    const hits = konnektoren.filter(k => lower.includes(k));
    if (hits.length > 0) konnektorVielfalt++;
    konnektorAnzahl += hits.length;
  }

  // Einleitung-Hauptteil-Schluss Erkennung
  const hatEinleitung = /^(es\s+ist|man\s+kennt|stellen\s+wir|in\s+einer|wenn\s+man|betrachten\s+wir|in\s+zeiten|heutzutage|tagtäglich|angesichts)/i.test(text.trim());
  const hatSchluss = /(zusammenfassend|letztendlich|abschließend|im\s+kern|kurzum|in\s+summe|schließlich\s+lässt\s+sich|daraus\s+folgt|es\s+zeigt\s+sich)/i.test(lower);

  // Satzlängen-Varianz (gute Texte haben Variation)
  let varianz = 0;
  if (saetze.length >= 2) {
    const laengen = saetze.map(s => s.trim().split(/\s+/).length);
    const avg = laengen.reduce((a, b) => a + b, 0) / laengen.length;
    varianz = laengen.reduce((s, l) => s + Math.abs(l - avg), 0) / laengen.length;
  }

  // Satzarten-Vielfalt
  const hatFrage = text.includes("?");
  const hatAusruf = text.includes("!");
  const hatAussage = text.includes(".");
  const satzartenVielfalt = [hatFrage, hatAusruf, hatAussage].filter(Boolean).length;

  // Kohäsionsmittel zwischen Sätzen
  const kohaesionsmarker = ["dabei", "zugleich", "indes", "hierbei", "demnach", "sodass", "woraufhin", "was bedeutet", "das heißt", "mit anderen worten"];
  const kohHits = kohaesionsmarker.filter(k => lower.includes(k)).length;

  // Wendungen (zeigen Originalität und Sprachkompetenz)
  const wendungen = ["stellen wir uns vor", "man denke", "was wäre wenn", "ich wage zu behaupten", "lassen sie mich", "erlauben sie mir", "betrachten wir", "hand aufs herz", "seien wir ehrlich", "man möge", "es sei gesagt", "wohlgemerkt"];
  const wendHits = wendungen.filter(w => lower.includes(w)).length;

  // Scoring
  let score = 0;
  // Konnektoren (bis 4)
  score += Math.min(konnektorAnzahl * 0.6, 2.5);
  score += konnektorVielfalt * 0.4; // Vielfalt bis 2
  // Struktur (bis 2)
  if (hatEinleitung) score += 1;
  if (hatSchluss) score += 1;
  // Satzvariation (bis 2)
  score += Math.min(varianz / 2.5, 2);
  // Satzarten (bis 1)
  score += Math.min(satzartenVielfalt * 0.4, 1.2);
  // Kohäsion (bis 1.5)
  score += Math.min(kohHits * 0.5, 1.5);
  // Wendungen (bis 1.5)
  score += Math.min(wendHits * 0.8, 1.5);
  // Textlänge als Strukturindikator (bis 1.5)
  if (saetze.length >= 3) score += 0.5;
  if (saetze.length >= 5) score += 0.5;
  if (saetze.length >= 7) score += 0.5;

  return {
    score: Math.min(Math.round(score * 10) / 10, 15),
    konnektorAnzahl, konnektorVielfalt, hatEinleitung, hatSchluss,
    satzartenVielfalt, wendHits,
  };
}

// ──────────────────────────────────────────────────────
// 11. MASTER-SCORING mit Sinn-Multiplikator
// ──────────────────────────────────────────────────────

function berechneAlleKategorien(text, situation) {
  const tokens = tokenize(text);
  const wortAnzahl = tokens.length;

  // ── Grundanalysen ──
  const mittel = erkenneRhetorischeMittel(text);
  const gehobene = findeGehobeneWoerter(text);
  const situMatch = semantischerSituationsmatch(situation, text);
  const wortschatz = analysiereWortschatz(text, gehobene);
  const diskurs = analysiereDiskursstruktur(text);

  // ── Satz-Sinn als globaler Qualitätsmultiplikator ──
  const saetze = text.split(/[.!?]+/).filter(s => s.trim().length > 5);
  const sinnScores = saetze.map(s => satzSinnScore(s));
  const avgSinn = sinnScores.length > 0 ? sinnScores.reduce((a, b) => a + b, 0) / sinnScores.length : 0.1;

  // ── Kohärenz ──
  const kohaerenz = textKohaerenz(saetze);

  // ══ Rhetorik-Score (gewichtet nach Qualität der Figur) ══
  // Hochwertige Figuren zählen mehr als einfache
  const RHETORIK_GEWICHTE = {
    "Vergleich/Metapher": 8,   // Bildhafte Sprache = höchster Wert
    "Personifikation": 7,      // Kreative Belebung
    "Chiasmus": 7,             // Komplexe Struktur
    "Oxymoron": 6,             // Spannungsvoller Widerspruch
    "Klimax": 6,               // Steigerung zeigt Aufbau
    "Antithese": 5,            // Kontrastierung
    "Trikolon": 5,             // Rhythmische Dreierfigur
    "Rhetorische Frage": 4,    // Gedankenanregung
    "Anapher": 4,              // Emphatische Wiederholung
    "Parenthese": 3,           // Einschub
    "Hyperbel": 3,             // Übertreibung
    "Ellipse": 2,              // Auslassung
    "Alliteration": 2,         // Klangfigur (niedrigster Wert)
  };
  const mittelArten = new Set(mittel.map(m => m.name));
  let rhetorikRaw = 0;
  for (const art of mittelArten) {
    rhetorikRaw += RHETORIK_GEWICHTE[art] || 3;
  }
  // Bonus für Vielfalt: ab 3+ verschiedene Figuren
  if (mittelArten.size >= 4) rhetorikRaw += 3;
  else if (mittelArten.size >= 3) rhetorikRaw += 1;
  // Länge-Bonus: Lange Texte mit vielen Mitteln
  if (wortAnzahl > 80 && mittelArten.size >= 2) rhetorikRaw += 2;
  if (wortAnzahl > 150 && mittelArten.size >= 3) rhetorikRaw += 2;
  // Spam-Malus: Dieselbe Figur zu oft
  if (mittel.length > mittelArten.size * 3) rhetorikRaw *= 0.6;
  rhetorikRaw = Math.min(rhetorikRaw, 25);

  // ── Kreativitäts-Score (Entropie + Originalität) ──
  let kreativRaw = 0;
  // Satzlängen-Varianz
  if (saetze.length >= 2) {
    const laengen = saetze.map(s => s.trim().split(/\s+/).length);
    const avg = laengen.reduce((a, b) => a + b, 0) / laengen.length;
    const varianz = laengen.reduce((s, l) => s + Math.abs(l - avg), 0) / laengen.length;
    kreativRaw += Math.min(varianz / 2, 3);
  }
  // Satzarten
  kreativRaw += [text.includes("?"), text.includes("!"), text.includes(".")].filter(Boolean).length * 0.8;
  // Bildhafte Sprache Bonus (höhere Gewichtung für kreative Figuren)
  if (mittel.some(m => m.name === "Vergleich/Metapher")) kreativRaw += 3;
  if (mittel.some(m => m.name === "Personifikation")) kreativRaw += 2;
  if (mittel.some(m => m.name === "Oxymoron")) kreativRaw += 1.5;
  // Rare-Word-Bonus für Kreativität (seltene Wörter = kreativer)
  if (wortschatz.details.rareWordRatio >= 70) kreativRaw += 2;
  else if (wortschatz.details.rareWordRatio >= 50) kreativRaw += 1;
  // Entropie-Bonus (hohe Informationsdichte = kreativer)
  if (wortschatz.details.entropie >= 90) kreativRaw += 1;
  kreativRaw = Math.min(kreativRaw, 10);

  // ═══ QUALITÄTS-MULTIPLIKATOR v4.0 — Punktebasiertes System ═══
  // Bewertet Textqualität differenziert: Sinn + Umfang + Wortschatz + Diskurs + Natürlichkeit
  // Zielwerte: SEHR GUT ~95%, GUT ~80%, MITTEL ~60%, KURZ GUT ~70%, SPAM ~0%, SINNLOS ~20%
  
  const alleWoerter = tokenize(text);
  const totalW = alleWoerter.length;
  
  // 1) SINN-BASIS (0-47 Punkte): quadratisch für stärkere Differenzierung
  const sinnBasis = Math.pow(avgSinn, 2) * 47;
  
  // 2) TEXTUMFANG & SATZVIELFALT (0-12 Punkte)
  let umfangBonus = 0;
  if (totalW >= 55) umfangBonus += 5;
  else if (totalW >= 35) umfangBonus += 3;
  else if (totalW >= 20) umfangBonus += 1;
  if (saetze.length >= 5) umfangBonus += 7;
  else if (saetze.length >= 3) umfangBonus += 4;
  else if (saetze.length >= 2) umfangBonus += 2;
  
  // 3) WORTSCHATZ-QUALITÄT (0-12 Punkte)
  const inhaltW = alleWoerter.filter(w => !FUNKTIONS_WOERTER.has(w) && w.length > 2);
  const uniqueIW = new Set(inhaltW);
  const vocabDichte = inhaltW.length > 0 ? uniqueIW.size / inhaltW.length : 0;
  const avgWortLaenge = alleWoerter.reduce((s, w) => s + w.length, 0) / Math.max(totalW, 1);
  const langeWoerter = inhaltW.filter(w => w.length > 8).length;
  
  let vocabBonus = 0;
  if (vocabDichte >= 0.85) vocabBonus += 4;
  else if (vocabDichte >= 0.65) vocabBonus += 2;
  else if (vocabDichte >= 0.45) vocabBonus += 1;
  if (avgWortLaenge >= 5.5) vocabBonus += 3;
  else if (avgWortLaenge >= 4.5) vocabBonus += 2;
  if (langeWoerter >= 5) vocabBonus += 5;
  else if (langeWoerter >= 3) vocabBonus += 4;
  else if (langeWoerter >= 1) vocabBonus += 2;
  
  // 4) DISKURS & ARGUMENTATION (0-18 Punkte)
  const textLc = text.toLowerCase();
  const diskursMarker = ["daher", "deshalb", "doch", "jedoch", "dennoch", "allerdings",
    "nicht nur", "sondern", "denn", "weil", "zudem", "ferner", "schließlich",
    "einerseits", "andererseits", "vielmehr", "insofern", "nämlich", "folglich",
    "dabei", "dann", "obwohl", "während", "hingegen"];
  let markerCount = 0;
  for (const m of diskursMarker) { if (textLc.includes(m)) markerCount++; }
  
  let diskursBonus = 0;
  if (markerCount >= 4) diskursBonus += 6;
  else if (markerCount >= 2) diskursBonus += 4;
  else if (markerCount >= 1) diskursBonus += 2;
  // Rhetorische Fragen / Satzvielfalt
  if (/\?/.test(text)) diskursBonus += 3;
  // Em-Dash für stilistische Einschübe
  if (/—|–/.test(text)) diskursBonus += 2;
  // Satzlängen-Varianz (zeigt argumentative Tiefe)
  if (saetze.length >= 2) {
    const satzLaengen = saetze.map(s => tokenize(s).length);
    const avgSL = satzLaengen.reduce((a, b) => a + b, 0) / satzLaengen.length;
    const varianz = satzLaengen.reduce((a, b) => a + Math.pow(b - avgSL, 2), 0) / satzLaengen.length;
    const stdDev = Math.sqrt(varianz);
    if (stdDev >= 3) diskursBonus += 4;
    else if (stdDev >= 1.5) diskursBonus += 2;
  }
  // Komplexe Satzstrukturen (Relativsätze, Infinitivkonstruktionen)
  const kommaCount = (text.match(/,/g) || []).length;
  if (kommaCount >= 6) diskursBonus += 3;
  else if (kommaCount >= 3) diskursBonus += 2;
  else if (kommaCount >= 1) diskursBonus += 1;
  
  // 5) NATÜRLICHKEIT (0-13 Punkte)
  const fwR = alleWoerter.filter(w => FUNKTIONS_WOERTER.has(w)).length / Math.max(totalW, 1);
  let naturBonus = 0;
  if (fwR >= 0.25 && fwR <= 0.6) naturBonus += 4;
  else if (fwR >= 0.15 && fwR <= 0.7) naturBonus += 2;
  // Bigramm-Natürlichkeit
  let bHits = 0;
  for (let i = 0; i < alleWoerter.length - 1; i++) {
    if (NATUERLICHE_BIGRAMME.has(alleWoerter[i] + " " + alleWoerter[i + 1])) bHits++;
  }
  const bRatio = bHits / Math.max(1, totalW - 1);
  if (bRatio >= 0.08) naturBonus += 5;
  else if (bRatio >= 0.03) naturBonus += 3;
  else if (bRatio > 0) naturBonus += 1;
  // Kohärenz-Beitrag
  if (kohaerenz >= 0.75) naturBonus += 4;
  else if (kohaerenz >= 0.5) naturBonus += 2;
  else if (kohaerenz >= 0.3) naturBonus += 1;
  
  // 6) TIEFE-BONUSPUNKTE (für hochwertige, umfangreiche Texte)
  let tiefeBonus = 0;
  // Sustained Quality: Hohe Sinn-Scores über viele Sätze hinweg
  if (avgSinn >= 0.85 && saetze.length >= 4) tiefeBonus += 5;
  // Satz-Diversität: Viele Sätze mit abwechslungsreicher Länge
  if (saetze.length >= 4) {
    const sl = saetze.map(s => tokenize(s).length);
    const slAvg = sl.reduce((a, b) => a + b, 0) / sl.length;
    const slVar = sl.reduce((a, b) => a + Math.pow(b - slAvg, 2), 0) / sl.length;
    if (Math.sqrt(slVar) >= 2 && saetze.length >= 5) tiefeBonus += 4;
    else if (saetze.length >= 4) tiefeBonus += 2;
  }
  // Kurz-aber-gut: Kompakter Text mit hoher Qualität
  if (totalW < 35 && avgSinn >= 0.8) tiefeBonus += 3;
  
  // ═══ GESAMTQUALITÄT berechnen (0-100) ═══
  let qualityScore = sinnBasis + umfangBonus + vocabBonus + diskursBonus + naturBonus + tiefeBonus;
  
  // Hard-Penalties für schlechte Texte
  if (avgSinn < 0.2) qualityScore = 0;               // SPAM → 0
  else if (avgSinn < 0.4) qualityScore *= 0.15;       // Starker Unsinn
  else if (avgSinn < 0.6) qualityScore *= 0.72;       // Schwacher Sinn → reduziert
  
  const qualitaet = Math.max(0, Math.min(qualityScore / 100, 1));

  const punkte = {
    // ═══ Gewichtete Formel: P = S×0.3 + R×0.4 + K×0.3 ═══
    // S (Semantische Tiefe): Situationsbezug + Wortschatz = 30/100
    situationsbezug: Math.round(situMatch.punkte * qualitaet * 10) / 10,       // /15
    wortschatz: Math.round(wortschatz.score * qualitaet * 10) / 10,             // /15
    // R (Rhetorische Qualität): Rhetorik + Argumentation = 40/100
    rhetorik: Math.round(rhetorikRaw * qualitaet * 10) / 10,                    // /25
    argumentation: Math.round(diskurs.score * qualitaet * 10) / 10,             // /15
    // K (Kreativität): Wortvielfalt + Kreativität + Textstruktur = 30/100
    wortvielfalt: Math.round(Math.min(wortschatz.details.ttr / 100 * 15, 12) * qualitaet * 10) / 10, // /15
    kreativitaet: Math.round(kreativRaw * qualitaet * 10) / 10,                 // /10
    textstruktur: Math.round(Math.min((diskurs.konnektorAnzahl * 0.4 + diskurs.hatEinleitung * 1 + diskurs.hatSchluss * 1 + (text.split(/\n\s*\n/).filter(a => a.trim().length > 10).length >= 2 ? 1.5 : 0) + Math.min(saetze.length * 0.3, 1.5)), 5) * qualitaet * 10) / 10, // /5
  };

  return {
    punkte,
    mittel,
    gehobene,
    wortAnzahl,
    avgSinn: Math.round(avgSinn * 100) / 100,
    kohaerenz: Math.round(kohaerenz * 100) / 100,
    qualitaet: Math.round(qualitaet * 100) / 100,
    situMatch,
    wortschatzDetails: wortschatz.details,
    diskurs,
  };
}

// ──────────────────────────────────────────────────────
// 12. FEEDBACK-GENERIERUNG (v3.0)
// ──────────────────────────────────────────────────────

function generiereFeedback(analyse) {
  const { punkte, mittel, gehobene, wortAnzahl, avgSinn, qualitaet } = analyse;
  const gesamt = Object.values(punkte).reduce((s, v) => s + v, 0);
  const teile = [];

  // Warnung bei schlechtem Sinn-Score
  if (avgSinn < 0.4) {
    teile.push("Der Text enthält Passagen, die grammatisch oder inhaltlich nicht ganz stimmig wirken — achte auf vollständige, sinnvolle Sätze.");
    return teile.join(" ");
  }

  if (gesamt >= 70) {
    teile.push("Eine beeindruckend eloquente Antwort!");
    if (mittel.length >= 4) teile.push("Die Vielfalt der rhetorischen Mittel verleiht dem Text besondere Überzeugungskraft.");
    else if (gehobene.length >= 4) teile.push("Der gehobene Wortschatz hebt die Antwort deutlich hervor.");
    else teile.push("Struktur und Argumentation überzeugen auf ganzer Linie.");
  } else if (gesamt >= 45) {
    teile.push("Eine solide Antwort mit gutem Potenzial.");
    if (mittel.length < 2) teile.push("Mehr rhetorische Mittel wie Vergleiche oder rhetorische Fragen würden die Wirkung steigern.");
    if (gehobene.length < 2) teile.push("Ein gehobenerer Wortschatz würde dem Text mehr Eleganz verleihen.");
    if (punkte.argumentation < 7) teile.push("Logische Verknüpfungen (daher, folglich, somit) stärken die Argumentation.");
  } else if (gesamt >= 25) {
    teile.push("Ein guter Anfang — hier ist noch Raum für mehr Eloquenz.");
    teile.push("Versuche, deine Sätze mit Bildern und Vergleichen lebendiger zu machen.");
    if (wortAnzahl < 40) teile.push("Eine ausführlichere Antwort gibt dir mehr Raum, rhetorische Mittel einzusetzen.");
  } else {
    teile.push("Diese Antwort hat noch deutliches Verbesserungspotenzial.");
    teile.push("Tipp: Schreibe in ganzen, sinnvollen Sätzen und nutze Vergleiche, rhetorische Fragen und Dreierfiguren.");
  }
  return teile.slice(0, 3).join(" ");
}

function generiereTipps(analyse) {
  const { punkte, mittel, gehobene, avgSinn } = analyse;
  const tipps = [];
  const mittelNamen = new Set(mittel.map(m => m.name));

  if (avgSinn < 0.5) {
    tipps.push("Formuliere jeden Satz als vollständigen Gedanken mit Subjekt und Verb.");
  }
  if (!mittelNamen.has("Vergleich/Metapher")) tipps.push("Nutze Vergleiche: 'Die Wahrheit ist wie ein Diamant — sie funkelt aus jedem Blickwinkel anders.'");
  if (!mittelNamen.has("Rhetorische Frage")) tipps.push("Stelle rhetorische Fragen: 'Ist es nicht so, dass wahre Eloquenz im Herzen beginnt?'");
  if (!mittelNamen.has("Trikolon")) tipps.push("Verwende Dreiergruppen: 'Mit Mut, mit Herz und mit Verstand.'");
  if (!mittelNamen.has("Antithese")) tipps.push("Baue Gegensätze ein: 'Nicht der Lauteste überzeugt, sondern der Bedachteste.'");
  if (gehobene.length < 2) tipps.push("Integriere gehobene Wörter wie 'nichtsdestotrotz', 'eloquent' oder 'sublim' in deinen Text.");
  if (punkte.argumentation < 7) tipps.push("Verknüpfe Gedanken: 'Zunächst... Darüber hinaus... Schließlich...'");
  if (punkte.kreativitaet < 4) tipps.push("Variiere deine Satzlänge — kurze Sätze für Nachdruck, lange für Ausführlichkeit.");
  if (punkte.textstruktur < 3) tipps.push("Strukturiere deinen Text: Beginne mit einem starken Einstieg und ende mit einer Pointe.");

  return tipps.slice(0, 3);
}

function generiereEmpfehlungen(gehobene) {
  const bereitsGenutzt = new Set(gehobene.map(w => w.toLowerCase()));
  const pool = WOERTERBUCH.filter(w => !bereitsGenutzt.has(w.wort.toLowerCase()));
  const shuffled = pool.sort(() => Math.random() - 0.5);
  return shuffled.slice(0, 3).map(w => ({ wort: w.wort, bedeutung: w.definition, satz: w.beispiel }));
}

// ═══════════════════════════════════════════════════════════
// Hauptfunktion: KI-Bewertung v3.0 — Professionell & Anti-Cheat
// ═══════════════════════════════════════════════════════════

async function kiBewertung(situation, antwort) {
  await new Promise(r => setTimeout(r, 600 + Math.random() * 600));

  try {
    const text = antwort.trim();
    const wortAnzahl = text.split(/\s+/).filter(Boolean).length;

    // ── Tiefe Anti-Gaming-Prüfung ──
    const gaming = tiefesAntiGaming(text);
    if (gaming.isGaming) {
      const gamingGrund = gaming.flags.length > 0
        ? `Gaming erkannt: ${gaming.flags.map(f => f.replace(/_/g, ' ')).join(', ')}.`
        : "Der Text konnte nicht sinnvoll bewertet werden.";
      return {
        kategorien: {
          situationsbezug: { p: 0, f: gamingGrund },
          wortvielfalt: { p: 0, f: "Zu wenig Substanz für eine Bewertung." },
          rhetorik: { p: 0, f: "Keine authentischen rhetorischen Mittel erkennbar." },
          wortschatz: { p: 0, f: "Kein kohärenter Wortschatz verwendet." },
          argumentation: { p: 0, f: "Keine nachvollziehbare Argumentation." },
          kreativitaet: { p: 0, f: "Keine kreative Substanz vorhanden." },
          textstruktur: { p: 0, f: "Keine kohärente Textstruktur." },
        },
        mittel: [], gehobene: [],
        tipps: [
          "Schreibe vollständige, sinnvolle Sätze mit Bezug zur Situation.",
          "Jeder Satz braucht ein Subjekt und ein Verb — achte auf Grammatik.",
          "Mindestens 3 zusammenhängende Sätze für eine faire Bewertung.",
        ],
        empfehlungen: generiereEmpfehlungen([]),
        feedback: gamingGrund,
        gaming: true,
      };
    }

    // ── Vollständige Analyse ──
    const analyse = berechneAlleKategorien(text, situation);
    const { punkte, mittel, gehobene, avgSinn, qualitaet } = analyse;

    // ── Kategorie-Feedback generieren ──
    const feedbackMap = {
      situationsbezug: punkte.situationsbezug >= 12 ? "Starker inhaltlicher Bezug — die Antwort trifft den Kern der Situation." :
        punkte.situationsbezug >= 6 ? "Erkennbarer Bezug, könnte aber gezielter auf das Thema eingehen." :
        "Mehr inhaltlicher Bezug zur konkreten Situation würde die Antwort stärken.",
      wortvielfalt: punkte.wortvielfalt >= 10 ? "Abwechslungsreiche, vielfältige und präzise Wortwahl." :
        punkte.wortvielfalt >= 5 ? "Gute Wortvielfalt — mehr Synonyme und weniger Wiederholungen möglich." :
        "Versuche, mehr Synonyme zu verwenden und Wortwiederholungen zu vermeiden.",
      rhetorik: punkte.rhetorik >= 15 ? `${mittel.length} rhetorische Mittel gekonnt eingesetzt — exzellente Überzeugungskraft!` :
        punkte.rhetorik >= 7 ? `${mittel.length} rhetorische(s) Mittel erkannt. Mehr Vielfalt steigert die Wirkung.` :
        "Rhetorische Mittel wie Vergleiche, Fragen und Dreiergruppen fehlen noch.",
      wortschatz: punkte.wortschatz >= 10 ? `${gehobene.length} gehobene Ausdrücke — exzellenter Wortschatz!` :
        punkte.wortschatz >= 4 ? `${gehobene.length} gehobene(s) Wort/Wörter gefunden. Weitere würden den Text aufwerten.` :
        "Kein gehobener Wortschatz erkannt — versuche Wörter aus der Wörterbücherei.",
      argumentation: punkte.argumentation >= 10 ? "Logisch aufgebaut und überzeugend argumentiert — klare Gedankenführung." :
        punkte.argumentation >= 5 ? "Erkennbare Argumentation — Konnektoren wie 'daher', 'somit' stärken den Aufbau." :
        "Mehr logische Verknüpfungen (daher, somit, folglich) würden die Argumentation stärken.",
      kreativitaet: punkte.kreativitaet >= 7 ? "Originelle und kreative Herangehensweise mit sprachlicher Eleganz!" :
        punkte.kreativitaet >= 3.5 ? "Kreative Ansätze vorhanden — mehr Variation bei Satzarten und Bildern hilft." :
        "Mehr Satzvielfalt und bildhafte Sprache würden Kreativität zeigen.",
      textstruktur: punkte.textstruktur >= 4 ? "Kohärenter, gut strukturierter Text mit klarer Gliederung." :
        punkte.textstruktur >= 2 ? "Grundlegende Struktur vorhanden — Einleitung und Schluss würden helfen." :
        "Mehr Kohäsionsmittel und eine klarere Gliederung würden die Struktur verbessern.",
    };

    return {
      kategorien: {
        situationsbezug: { p: punkte.situationsbezug, f: feedbackMap.situationsbezug },
        wortvielfalt: { p: punkte.wortvielfalt, f: feedbackMap.wortvielfalt },
        rhetorik: { p: punkte.rhetorik, f: feedbackMap.rhetorik },
        wortschatz: { p: punkte.wortschatz, f: feedbackMap.wortschatz },
        argumentation: { p: punkte.argumentation, f: feedbackMap.argumentation },
        kreativitaet: { p: punkte.kreativitaet, f: feedbackMap.kreativitaet },
        textstruktur: { p: punkte.textstruktur, f: feedbackMap.textstruktur },
      },
      mittel,
      gehobene,
      tipps: generiereTipps(analyse),
      empfehlungen: generiereEmpfehlungen(gehobene),
      feedback: generiereFeedback(analyse),
      gaming: false,
    };
  } catch (e) {
    console.error("Bewertung fehlgeschlagen:", e);
    return null;
  }
}

// ═══════════════════════════════════════════════════════════
// Styling
// ═══════════════════════════════════════════════════════════

const style = document.createElement("style");
style.textContent = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400&family=DM+Sans:wght@300;400;500;700&family=JetBrains+Mono:wght@400;500&display=swap');

  :root {
    --bg-deep: #0a0b0f;
    --bg-card: #12141c;
    --bg-card-hover: #181b26;
    --bg-elevated: #1a1d2a;
    --gold: #d4a853;
    --gold-bright: #f0c866;
    --gold-dim: #8a6d2b;
    --accent: #5b8cf7;
    --accent-glow: #3d6ee0;
    --green: #4ade80;
    --green-dim: #166534;
    --red: #f87171;
    --red-dim: #7f1d1d;
    --text: #e8e6e3;
    --text-dim: #8b8a88;
    --text-muted: #55544f;
    --border: #2a2d3a;
    --border-light: #363a4a;
  }

  * { box-sizing: border-box; margin: 0; padding: 0; }

  body {
    background: var(--bg-deep);
    color: var(--text);
    font-family: 'DM Sans', sans-serif;
    overflow-x: hidden;
  }

  .serif { font-family: 'Playfair Display', Georgia, serif; }
  .mono { font-family: 'JetBrains Mono', monospace; }

  @keyframes fadeIn { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
  @keyframes slideUp { from { opacity: 0; transform: translateY(40px); } to { opacity: 1; transform: translateY(0); } }
  @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.6; } }
  @keyframes shimmer { 0% { background-position: -200% 0; } 100% { background-position: 200% 0; } }
  @keyframes glow { 0%, 100% { box-shadow: 0 0 20px rgba(212,168,83,0.15); } 50% { box-shadow: 0 0 40px rgba(212,168,83,0.3); } }
  @keyframes countUp { from { opacity: 0; transform: scale(0.5); } to { opacity: 1; transform: scale(1); } }
  @keyframes barFill { from { width: 0; } }
  @keyframes textReveal { from { opacity: 0; transform: translateX(-8px); } to { opacity: 1; transform: translateX(0); } }

  .animate-in { animation: fadeIn 0.5s ease-out forwards; }
  .animate-slide { animation: slideUp 0.6s ease-out forwards; }
`;
document.head.appendChild(style);

// ═══════════════════════════════════════════════════════════
// Components
// ═══════════════════════════════════════════════════════════

const GoldBar = ({ value, max, delay = 0 }) => {
  const pct = max > 0 ? Math.min(value / max, 1) * 100 : 0;
  const color = pct >= 70 ? "var(--green)" : pct >= 40 ? "var(--gold)" : "var(--red)";
  return (
    <div style={{ width: "100%", height: 8, background: "var(--bg-deep)", borderRadius: 4, overflow: "hidden" }}>
      <div style={{
        width: `${pct}%`, height: "100%", background: color, borderRadius: 4,
        animation: `barFill 1s ease-out ${delay}s both`,
        boxShadow: `0 0 8px ${color}44`,
      }} />
    </div>
  );
};

const Button = ({ children, onClick, variant = "default", disabled, style: s }) => {
  const base = {
    padding: "12px 28px", borderRadius: 8, border: "none", cursor: disabled ? "default" : "pointer",
    fontFamily: "'DM Sans', sans-serif", fontSize: 15, fontWeight: 600,
    transition: "all 0.2s", opacity: disabled ? 0.4 : 1, display: "inline-flex",
    alignItems: "center", gap: 8, ...s,
  };
  const variants = {
    default: { background: "var(--bg-elevated)", color: "var(--text)", border: "1px solid var(--border)" },
    gold: { background: "linear-gradient(135deg, var(--gold), var(--gold-bright))", color: "#0a0b0f" },
    accent: { background: "var(--accent)", color: "#fff" },
    ghost: { background: "transparent", color: "var(--text-dim)", border: "1px solid var(--border)" },
    danger: { background: "var(--red-dim)", color: "var(--red)", border: "1px solid var(--red)33" },
  };
  return (
    <button onClick={disabled ? undefined : onClick}
      style={{ ...base, ...variants[variant] }}
      onMouseEnter={e => { if (!disabled) e.target.style.transform = "translateY(-1px)"; }}
      onMouseLeave={e => { e.target.style.transform = "translateY(0)"; }}>
      {children}
    </button>
  );
};

const Card = ({ children, style: s, glow, onClick }) => (
  <div onClick={onClick} style={{
    background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 16,
    padding: 28, transition: "all 0.3s",
    ...(glow ? { animation: "glow 3s ease-in-out infinite" } : {}),
    ...(onClick ? { cursor: "pointer" } : {}), ...s,
  }}
    onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--border-light)"; e.currentTarget.style.background = "var(--bg-card-hover)"; }}
    onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.background = "var(--bg-card)"; }}>
    {children}
  </div>
);

const Badge = ({ children, color = "var(--gold)" }) => (
  <span style={{
    display: "inline-flex", padding: "3px 10px", borderRadius: 20,
    fontSize: 11, fontWeight: 600, letterSpacing: 0.5,
    background: `${color}18`, color, border: `1px solid ${color}33`,
  }}>{children}</span>
);

// ═══════════════════════════════════════════════════════════
// Pages
// ═══════════════════════════════════════════════════════════

function HeroPage({ onNavigate }) {
  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 20, position: "relative", overflow: "hidden" }}>
      {/* Atmospheric bg */}
      <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at 50% 30%, rgba(212,168,83,0.06) 0%, transparent 60%)", pointerEvents: "none" }} />
      <div style={{ position: "absolute", top: -200, right: -200, width: 500, height: 500, borderRadius: "50%", background: "radial-gradient(circle, rgba(91,140,247,0.04), transparent)", pointerEvents: "none" }} />

      <div className="animate-slide" style={{ textAlign: "center", position: "relative", zIndex: 1 }}>
        <div style={{ fontSize: 13, letterSpacing: 6, color: "var(--gold-dim)", textTransform: "uppercase", marginBottom: 24 }} className="mono">
          ⚔️ Das Wortduell ⚔️
        </div>

        <h1 className="serif" style={{
          fontSize: "clamp(56px, 10vw, 100px)", fontWeight: 900, lineHeight: 0.95, marginBottom: 16,
          background: "linear-gradient(135deg, var(--gold-bright), var(--gold), var(--gold-dim))",
          WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
          filter: "drop-shadow(0 4px 30px rgba(212,168,83,0.2))",
        }}>
          ELOQUENT
        </h1>

        <p style={{ fontSize: 18, color: "var(--text-dim)", maxWidth: 440, margin: "0 auto 48px", lineHeight: 1.6 }}>
          Die Kunst der Sprache als Wettkampf.
          <br />
          <span style={{ color: "var(--text-muted)" }}>Tritt an. Formuliere. Überzeuge.</span>
        </p>

        <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
          <Button variant="gold" onClick={() => onNavigate("duell")} style={{ fontSize: 17, padding: "16px 40px" }}>
            ⚔️ Duell starten
          </Button>
          <Button variant="default" onClick={() => onNavigate("uebung")} style={{ fontSize: 17, padding: "16px 40px" }}>
            🎯 Übungsmodus
          </Button>
        </div>

        <div style={{ display: "flex", gap: 32, justifyContent: "center", marginTop: 48, flexWrap: "wrap" }}>
          {[
            { icon: "📚", label: "Wörterbücherei", page: "woerterbuch" },
            { icon: "🏆", label: "Rangliste", page: "rangliste" },
            { icon: "📖", label: "Story-Modus", page: "story" },
            { icon: "❓", label: "Regeln", page: "regeln" },
          ].map(item => (
            <div key={item.page} onClick={() => onNavigate(item.page)}
              style={{ cursor: "pointer", textAlign: "center", transition: "all 0.2s", opacity: 0.6 }}
              onMouseEnter={e => { e.currentTarget.style.opacity = 1; e.currentTarget.style.transform = "translateY(-2px)"; }}
              onMouseLeave={e => { e.currentTarget.style.opacity = 0.6; e.currentTarget.style.transform = "translateY(0)"; }}>
              <div style={{ fontSize: 28, marginBottom: 4 }}>{item.icon}</div>
              <div style={{ fontSize: 12, color: "var(--text-dim)", letterSpacing: 0.5 }}>{item.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function NavBar({ current, onNavigate }) {
  return (
    <nav style={{
      position: "sticky", top: 0, zIndex: 100, backdropFilter: "blur(20px)",
      background: "rgba(10,11,15,0.85)", borderBottom: "1px solid var(--border)",
      padding: "0 24px", display: "flex", alignItems: "center", height: 56,
    }}>
      <span className="serif" style={{ fontWeight: 700, fontSize: 20, color: "var(--gold)", cursor: "pointer", marginRight: 32 }}
        onClick={() => onNavigate("home")}>ELOQUENT</span>
      {[
        { id: "duell", label: "⚔️ Duell" },
        { id: "uebung", label: "🎯 Übung" },
        { id: "woerterbuch", label: "📚 Wörter" },
        { id: "rangliste", label: "🏆 Rangliste" },
      ].map(n => (
        <span key={n.id} onClick={() => onNavigate(n.id)} style={{
          padding: "8px 16px", fontSize: 13, cursor: "pointer", borderRadius: 6,
          color: current === n.id ? "var(--gold)" : "var(--text-dim)",
          background: current === n.id ? "var(--gold)11" : "transparent",
          transition: "all 0.2s", fontWeight: current === n.id ? 600 : 400,
        }}>{n.label}</span>
      ))}
    </nav>
  );
}

// ─── Bewertungs-Anzeige ────────────────────────────────────

function BewertungDisplay({ ergebnis, spielerName, onWeiter }) {
  if (!ergebnis) return null;
  const kat = ergebnis.kategorien || {};
  const maxMap = { situationsbezug: 15, wortvielfalt: 15, rhetorik: 25, wortschatz: 15, argumentation: 15, kreativitaet: 10, textstruktur: 5 };
  const labelMap = { situationsbezug: "Situationsbezug", wortvielfalt: "Wortvielfalt", rhetorik: "Rhetorik", wortschatz: "Wortschatz", argumentation: "Argumentation", kreativitaet: "Kreativität", textstruktur: "Textstruktur" };
  const gesamt = Object.entries(kat).reduce((s, [k, v]) => s + Math.min(v.p || 0, maxMap[k] || 0), 0);
  const { note, emoji } = getNote(gesamt);

  return (
    <div className="animate-in" style={{ maxWidth: 640, margin: "0 auto" }}>
      <Card glow>
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          {spielerName && <div style={{ fontSize: 13, color: "var(--text-dim)", marginBottom: 8 }}>Bewertung für</div>}
          {spielerName && <div className="serif" style={{ fontSize: 22, fontWeight: 700, color: "var(--gold)" }}>{spielerName}</div>}
          <div style={{ fontSize: 56, fontWeight: 900, color: "var(--gold-bright)", marginTop: 8, animation: "countUp 0.6s ease-out" }} className="mono">
            {gesamt.toFixed(1)}
          </div>
          <div style={{ fontSize: 12, color: "var(--text-muted)" }}>von 100 Punkten</div>
          <Badge color={gesamt >= 65 ? "var(--green)" : gesamt >= 40 ? "var(--gold)" : "var(--red)"}>{emoji} {note}</Badge>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 14, marginBottom: 24 }}>
          {Object.entries(kat).map(([key, val], i) => (
            <div key={key}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                <span style={{ fontSize: 13, color: "var(--text-dim)" }}>{labelMap[key] || key}</span>
                <span className="mono" style={{ fontSize: 13, color: "var(--text)" }}>{(val.p || 0).toFixed(1)}/{maxMap[key]}</span>
              </div>
              <GoldBar value={val.p || 0} max={maxMap[key]} delay={i * 0.1} />
              {val.f && <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 2 }}>{val.f}</div>}
            </div>
          ))}
        </div>

        {/* Rhetorische Mittel */}
        {ergebnis.mittel?.length > 0 && (
          <div style={{ marginBottom: 20 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: "var(--accent)", marginBottom: 8 }}>✦ Erkannte rhetorische Mittel</div>
            {ergebnis.mittel.map((m, i) => (
              <div key={i} style={{ padding: "8px 12px", background: "var(--bg-deep)", borderRadius: 8, marginBottom: 6, borderLeft: "3px solid var(--accent)" }}>
                <span style={{ fontWeight: 600, fontSize: 13 }}>{m.name}</span>
                <div style={{ fontSize: 12, color: "var(--text-dim)", fontStyle: "italic" }}>„{m.beispiel}"</div>
              </div>
            ))}
          </div>
        )}

        {/* Gehobene Wörter */}
        {ergebnis.gehobene?.length > 0 && (
          <div style={{ marginBottom: 20 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: "var(--gold)", marginBottom: 8 }}>📖 Gehobene Wörter verwendet</div>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              {ergebnis.gehobene.map((w, i) => <Badge key={i}>{w}</Badge>)}
            </div>
          </div>
        )}

        {/* Feedback */}
        {ergebnis.feedback && (
          <div style={{ padding: 16, background: "var(--bg-deep)", borderRadius: 10, marginBottom: 16 }}>
            <div style={{ fontSize: 14, lineHeight: 1.6, color: "var(--text-dim)" }}>{ergebnis.feedback}</div>
          </div>
        )}

        {/* Tipps */}
        {ergebnis.tipps?.length > 0 && (
          <div style={{ marginBottom: 20 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: "var(--green)", marginBottom: 8 }}>💡 Verbesserungsvorschläge</div>
            {ergebnis.tipps.map((t, i) => (
              <div key={i} style={{ fontSize: 13, color: "var(--text-dim)", padding: "4px 0", paddingLeft: 16, borderLeft: "2px solid var(--green)33", marginBottom: 4 }}>{t}</div>
            ))}
          </div>
        )}

        {/* Wort-Empfehlungen */}
        {ergebnis.empfehlungen?.length > 0 && (
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: "var(--gold-dim)", marginBottom: 8 }}>📚 Probier diese Wörter nächstes Mal</div>
            {ergebnis.empfehlungen.map((e, i) => (
              <div key={i} style={{ padding: "8px 12px", background: "var(--bg-deep)", borderRadius: 8, marginBottom: 6 }}>
                <span className="serif" style={{ fontWeight: 700, color: "var(--gold)" }}>{e.wort}</span>
                <span style={{ fontSize: 12, color: "var(--text-dim)", marginLeft: 8 }}>{e.bedeutung}</span>
              </div>
            ))}
          </div>
        )}

        {onWeiter && (
          <div style={{ textAlign: "center", marginTop: 8 }}>
            <Button variant="gold" onClick={onWeiter}>Weiter →</Button>
          </div>
        )}
      </Card>
    </div>
  );
}

// ─── Antwort-Eingabe ────────────────────────────────────────

function AntwortEingabe({ situation, spielerName, onSubmit }) {
  const [text, setText] = useState("");
  const wc = text.trim().split(/\s+/).filter(Boolean).length;
  const taRef = useRef(null);

  useEffect(() => { taRef.current?.focus(); }, []);

  return (
    <div className="animate-in" style={{ maxWidth: 640, margin: "0 auto" }}>
      <Card>
        <div style={{ marginBottom: 20 }}>
          <Badge color="var(--accent)">{situation.kontext}</Badge>
          <h2 className="serif" style={{ fontSize: 26, fontWeight: 700, marginTop: 12, color: "var(--text)" }}>{situation.titel}</h2>
          <p style={{ fontSize: 15, color: "var(--text-dim)", lineHeight: 1.7, marginTop: 10 }}>{situation.beschreibung}</p>
        </div>

        <div style={{ position: "relative" }}>
          {spielerName && <div style={{ fontSize: 13, color: "var(--gold)", fontWeight: 600, marginBottom: 8 }}>✍️ {spielerName}, zeig deine Eloquenz:</div>}
          <textarea ref={taRef} value={text} onChange={e => setText(e.target.value)}
            placeholder="Schreibe hier deine eloquente Antwort..."
            style={{
              width: "100%", minHeight: 180, padding: 16, background: "var(--bg-deep)",
              border: "1px solid var(--border)", borderRadius: 10, color: "var(--text)",
              fontFamily: "'DM Sans', sans-serif", fontSize: 15, lineHeight: 1.7,
              resize: "vertical", outline: "none", transition: "border-color 0.2s",
            }}
            onFocus={e => { e.target.style.borderColor = "var(--gold-dim)"; }}
            onBlur={e => { e.target.style.borderColor = "var(--border)"; }}
          />
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8, alignItems: "center" }}>
            <span className="mono" style={{ fontSize: 12, color: wc < 10 ? "var(--red)" : "var(--text-muted)" }}>
              {wc} Wörter {wc < 10 ? "(min. 10)" : "✓"}
            </span>
            <Button variant="gold" disabled={wc < 10} onClick={() => onSubmit(text)}>
              Antwort abgeben →
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}

// ─── Duell-Modus ────────────────────────────────────────────

function DuellPage({ onNavigate }) {
  const [phase, setPhase] = useState("setup"); // setup, s1_write, s1_pass, s2_write, result, final
  const [s1, setS1] = useState("");
  const [s2, setS2] = useState("");
  const [runde, setRunde] = useState(1);
  const [situation, setSituation] = useState(null);
  const [ergebnis1, setErgebnis1] = useState(null);
  const [ergebnis2, setErgebnis2] = useState(null);
  const [loading, setLoading] = useState(false);
  const [scores, setScores] = useState({ s1: 0, s2: 0, r1: 0, r2: 0 });
  const [history, setHistory] = useState([]);
  const gespielteRef = useRef(new Set());

  const getSituation = (r) => {
    const diff = r <= 1 ? "leicht" : r <= 2 ? "mittel" : "schwer";
    const pool = SITUATIONEN[diff];
    const ungespielte = pool.filter(s => !gespielteRef.current.has(s.titel));
    const chosen = ungespielte.length > 0
      ? ungespielte[Math.floor(Math.random() * ungespielte.length)]
      : pool[Math.floor(Math.random() * pool.length)];
    gespielteRef.current.add(chosen.titel);
    return chosen;
  };

  const startDuell = () => {
    if (!s1.trim() || !s2.trim()) return;
    if (s1.trim().toLowerCase() === s2.trim().toLowerCase()) return;
    gespielteRef.current = new Set();
    const sit = getSituation(1);
    setSituation(sit);
    setRunde(1);
    setPhase("s1_write");
    setScores({ s1: 0, s2: 0, r1: 0, r2: 0 });
    setHistory([]);
  };

  const handleS1Submit = (text) => {
    setErgebnis1({ text });
    setPhase("s1_pass");
  };

  const handleS2Submit = async (text) => {
    setLoading(true);
    setPhase("result");
    const [r1, r2] = await Promise.all([
      kiBewertung(situation, ergebnis1.text),
      kiBewertung(situation, text),
    ]);
    const p1 = r1 ? Object.values(r1.kategorien || {}).reduce((s, v) => s + (v.p || 0), 0) : 0;
    const p2 = r2 ? Object.values(r2.kategorien || {}).reduce((s, v) => s + (v.p || 0), 0) : 0;
    setErgebnis1(r1);
    setErgebnis2(r2);
    setHistory(prev => [...prev, { runde, p1, p2, situation: situation.titel }]);
    setScores(prev => ({
      s1: prev.s1 + p1, s2: prev.s2 + p2,
      r1: prev.r1 + (p1 > p2 ? 1 : 0), r2: prev.r2 + (p2 > p1 ? 1 : 0),
    }));
    setLoading(false);
  };

  const nextRound = () => {
    if (runde >= 3) { setPhase("final"); return; }
    const nr = runde + 1;
    setRunde(nr);
    setSituation(getSituation(nr));
    setErgebnis1(null);
    setErgebnis2(null);
    setPhase("s1_write");
  };

  const diffLabel = runde <= 1 ? "🟢 Leicht" : runde <= 2 ? "🟡 Mittel" : "🔴 Schwer";

  return (
    <div style={{ padding: "32px 24px", maxWidth: 800, margin: "0 auto" }}>
      {phase === "setup" && (
        <div className="animate-in">
          <div style={{ textAlign: "center", marginBottom: 40 }}>
            <h1 className="serif" style={{ fontSize: 36, fontWeight: 900, color: "var(--gold)" }}>⚔️ Duell-Modus</h1>
            <p style={{ color: "var(--text-dim)", marginTop: 8 }}>Zwei Meister der Eloquenz. Drei Runden. Ein Gewinner.</p>
          </div>
          <Card>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
              <div>
                <label style={{ fontSize: 13, color: "var(--gold)", fontWeight: 600, display: "block", marginBottom: 8 }}>Spieler 1</label>
                <input value={s1} onChange={e => setS1(e.target.value)} placeholder="Name eingeben..."
                  style={{ width: "100%", padding: "12px 16px", background: "var(--bg-deep)", border: "1px solid var(--border)", borderRadius: 8, color: "var(--text)", fontSize: 15, fontFamily: "inherit", outline: "none" }}
                  onFocus={e => { e.target.style.borderColor = "var(--gold-dim)"; }} onBlur={e => { e.target.style.borderColor = "var(--border)"; }} />
              </div>
              <div>
                <label style={{ fontSize: 13, color: "var(--accent)", fontWeight: 600, display: "block", marginBottom: 8 }}>Spieler 2</label>
                <input value={s2} onChange={e => setS2(e.target.value)} placeholder="Name eingeben..."
                  style={{ width: "100%", padding: "12px 16px", background: "var(--bg-deep)", border: "1px solid var(--border)", borderRadius: 8, color: "var(--text)", fontSize: 15, fontFamily: "inherit", outline: "none" }}
                  onFocus={e => { e.target.style.borderColor = "var(--accent)"; }} onBlur={e => { e.target.style.borderColor = "var(--border)"; }} />
              </div>
            </div>
            <div style={{ textAlign: "center", marginTop: 28 }}>
              <Button variant="gold" onClick={startDuell} disabled={!s1.trim() || !s2.trim() || s1.trim().toLowerCase() === s2.trim().toLowerCase()}>
                ⚔️ Duell starten
              </Button>
            </div>
          </Card>
        </div>
      )}

      {phase === "s1_write" && situation && (
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
            <Badge>Runde {runde}/3</Badge>
            <Badge color="var(--text-dim)">{diffLabel}</Badge>
          </div>
          {scores.s1 + scores.s2 > 0 && (
            <div style={{ display: "flex", justifyContent: "center", gap: 32, marginBottom: 20, padding: 12, background: "var(--bg-card)", borderRadius: 10 }}>
              <span style={{ color: "var(--gold)", fontWeight: 700 }}>{s1}: {scores.s1.toFixed(1)}</span>
              <span style={{ color: "var(--text-muted)" }}>vs</span>
              <span style={{ color: "var(--accent)", fontWeight: 700 }}>{s2}: {scores.s2.toFixed(1)}</span>
            </div>
          )}
          <AntwortEingabe situation={situation} spielerName={s1} onSubmit={handleS1Submit} />
        </div>
      )}

      {phase === "s1_pass" && (
        <div className="animate-in" style={{ textAlign: "center", padding: "80px 20px" }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>🔄</div>
          <h2 className="serif" style={{ fontSize: 28, color: "var(--text)", marginBottom: 12 }}>Gerät weitergeben</h2>
          <p style={{ color: "var(--text-dim)", marginBottom: 32 }}>Bitte an <strong style={{ color: "var(--accent)" }}>{s2}</strong> übergeben.</p>
          <Button variant="accent" onClick={() => setPhase("s2_write")}>
            {s2} ist bereit →
          </Button>
        </div>
      )}

      {phase === "s2_write" && situation && (
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 20 }}>
            <Badge>Runde {runde}/3</Badge>
            <Badge color="var(--text-dim)">{diffLabel}</Badge>
          </div>
          <AntwortEingabe situation={situation} spielerName={s2} onSubmit={handleS2Submit} />
        </div>
      )}

      {phase === "result" && (
        loading ? (
          <div style={{ textAlign: "center", padding: "80px 20px" }}>
            <div style={{ fontSize: 48, animation: "pulse 1.5s infinite", marginBottom: 16 }}>🧠</div>
            <h2 className="serif" style={{ fontSize: 24, color: "var(--gold)" }}>KI bewertet eure Eloquenz...</h2>
            <p style={{ color: "var(--text-dim)", marginTop: 8 }}>Die Antworten werden analysiert</p>
          </div>
        ) : (
          <div>
            <h2 className="serif" style={{ fontSize: 28, color: "var(--gold)", textAlign: "center", marginBottom: 24 }}>
              Runde {runde} — Ergebnis
            </h2>
            <div style={{ display: "grid", gap: 20 }}>
              <BewertungDisplay ergebnis={ergebnis1} spielerName={s1} />
              <div style={{ textAlign: "center", fontSize: 12, color: "var(--text-muted)", letterSpacing: 3 }}>─── VS ───</div>
              <BewertungDisplay ergebnis={ergebnis2} spielerName={s2} />
            </div>
            <div style={{ textAlign: "center", marginTop: 28 }}>
              <Button variant="gold" onClick={nextRound}>
                {runde >= 3 ? "🏆 Endergebnis" : `Runde ${runde + 1} →`}
              </Button>
            </div>
          </div>
        )
      )}

      {phase === "final" && (
        <div className="animate-in" style={{ textAlign: "center" }}>
          <h1 className="serif" style={{ fontSize: 40, fontWeight: 900, color: "var(--gold)", marginBottom: 32 }}>
            🏆 Endergebnis 🏆
          </h1>
          <Card glow style={{ maxWidth: 500, margin: "0 auto 24px" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr auto 1fr", gap: 16, alignItems: "center", padding: "20px 0" }}>
              <div>
                <div className="serif" style={{ fontSize: 20, fontWeight: 700, color: scores.s1 > scores.s2 ? "var(--gold-bright)" : "var(--text-dim)" }}>{s1}</div>
                <div className="mono" style={{ fontSize: 36, fontWeight: 900, color: "var(--gold)" }}>{scores.s1.toFixed(1)}</div>
                <div style={{ fontSize: 12, color: "var(--text-muted)" }}>{scores.r1} Runden</div>
              </div>
              <div style={{ fontSize: 28, color: "var(--text-muted)" }}>⚡</div>
              <div>
                <div className="serif" style={{ fontSize: 20, fontWeight: 700, color: scores.s2 > scores.s1 ? "var(--gold-bright)" : "var(--text-dim)" }}>{s2}</div>
                <div className="mono" style={{ fontSize: 36, fontWeight: 900, color: "var(--accent)" }}>{scores.s2.toFixed(1)}</div>
                <div style={{ fontSize: 12, color: "var(--text-muted)" }}>{scores.r2} Runden</div>
              </div>
            </div>
            <div style={{ padding: 16, background: "var(--bg-deep)", borderRadius: 10, marginTop: 16 }}>
              {scores.s1 > scores.s2 ? (
                <div className="serif" style={{ fontSize: 22, fontWeight: 700, color: "var(--gold-bright)" }}>🏆 {s1} gewinnt!</div>
              ) : scores.s2 > scores.s1 ? (
                <div className="serif" style={{ fontSize: 22, fontWeight: 700, color: "var(--accent)" }}>🏆 {s2} gewinnt!</div>
              ) : (
                <div className="serif" style={{ fontSize: 22, fontWeight: 700, color: "var(--text)" }}>🤝 Unentschieden!</div>
              )}
            </div>
          </Card>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", marginTop: 16 }}>
            <Button variant="gold" onClick={() => { setPhase("setup"); }}>Neues Duell</Button>
            <Button variant="ghost" onClick={() => onNavigate("home")}>Zum Menü</Button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Übungsmodus ─────────────────────────────────────────────

function UebungPage() {
  const [phase, setPhase] = useState("choose");
  const [situation, setSituation] = useState(null);
  const [ergebnis, setErgebnis] = useState(null);
  const [loading, setLoading] = useState(false);

  const start = (diff) => {
    const pool = diff ? SITUATIONEN[diff] : [...SITUATIONEN.leicht, ...SITUATIONEN.mittel, ...SITUATIONEN.schwer];
    setSituation(pool[Math.floor(Math.random() * pool.length)]);
    setErgebnis(null);
    setPhase("write");
  };

  const submit = async (text) => {
    setLoading(true);
    setPhase("result");
    const r = await kiBewertung(situation, text);
    setErgebnis(r);
    setLoading(false);
  };

  return (
    <div style={{ padding: "32px 24px", maxWidth: 700, margin: "0 auto" }}>
      {phase === "choose" && (
        <div className="animate-in" style={{ textAlign: "center" }}>
          <h1 className="serif" style={{ fontSize: 32, fontWeight: 900, color: "var(--green)", marginBottom: 8 }}>🎯 Übungsmodus</h1>
          <p style={{ color: "var(--text-dim)", marginBottom: 32 }}>Trainiere ohne Druck. Bekomme KI-Feedback.</p>
          <div style={{ display: "grid", gap: 12, maxWidth: 360, margin: "0 auto" }}>
            {[
              { label: "🟢 Leicht", diff: "leicht", desc: "Alltagsthemen" },
              { label: "🟡 Mittel", diff: "mittel", desc: "Philosophische Fragen" },
              { label: "🔴 Schwer", diff: "schwer", desc: "Reden & Plädoyers" },
              { label: "🎲 Zufall", diff: null, desc: "Überrasch mich" },
            ].map(o => (
              <Card key={o.label} onClick={() => start(o.diff)} style={{ cursor: "pointer", textAlign: "left" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 16 }}>{o.label}</div>
                    <div style={{ fontSize: 12, color: "var(--text-muted)" }}>{o.desc}</div>
                  </div>
                  <span style={{ fontSize: 20, color: "var(--text-muted)" }}>→</span>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {phase === "write" && situation && (
        <AntwortEingabe situation={situation} onSubmit={submit} />
      )}

      {phase === "result" && (
        loading ? (
          <div style={{ textAlign: "center", padding: "80px 20px" }}>
            <div style={{ fontSize: 48, animation: "pulse 1.5s infinite", marginBottom: 16 }}>🧠</div>
            <h2 className="serif" style={{ fontSize: 24, color: "var(--gold)" }}>KI analysiert deine Antwort...</h2>
          </div>
        ) : (
          <BewertungDisplay ergebnis={ergebnis} onWeiter={() => setPhase("choose")} />
        )
      )}
    </div>
  );
}

// ─── Wörterbücherei ──────────────────────────────────────────

function WoerterbuchPage() {
  const [filter, setFilter] = useState("Alle");
  const [search, setSearch] = useState("");
  const [expanded, setExpanded] = useState(null);
  const cats = ["Alle", "Rhetorik", "Philosophie", "Emotion", "Wissenschaft", "Alltag"];

  const filtered = WOERTERBUCH.filter(w => {
    if (filter !== "Alle" && w.kategorie !== filter) return false;
    if (search && !w.wort.toLowerCase().includes(search.toLowerCase()) && !w.definition.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  // Wort des Tages
  const dayIdx = new Date().getDate() % WOERTERBUCH.length;
  const wdt = WOERTERBUCH[dayIdx];

  return (
    <div style={{ padding: "32px 24px", maxWidth: 800, margin: "0 auto" }}>
      <div className="animate-in" style={{ textAlign: "center", marginBottom: 32 }}>
        <h1 className="serif" style={{ fontSize: 32, fontWeight: 900, color: "var(--gold)" }}>📚 Wörterbücherei</h1>
        <p style={{ color: "var(--text-dim)", marginTop: 4 }}>Dein Werkzeugkasten der Eloquenz</p>
      </div>

      {/* Wort des Tages */}
      <Card glow style={{ marginBottom: 24, background: "linear-gradient(135deg, var(--bg-card), var(--bg-elevated))" }}>
        <div style={{ fontSize: 11, letterSpacing: 3, color: "var(--gold-dim)", textTransform: "uppercase", marginBottom: 8 }}>Wort des Tages</div>
        <div className="serif" style={{ fontSize: 28, fontWeight: 900, color: "var(--gold-bright)" }}>{wdt.wort}</div>
        <div style={{ fontSize: 14, color: "var(--text-dim)", marginTop: 4, lineHeight: 1.6 }}>{wdt.definition}</div>
        <div style={{ fontSize: 13, color: "var(--text-muted)", marginTop: 8, fontStyle: "italic", borderLeft: "2px solid var(--gold-dim)", paddingLeft: 12 }}>
          „{wdt.beispiel}"
        </div>
      </Card>

      {/* Search + Filters */}
      <div style={{ display: "flex", gap: 12, marginBottom: 20, flexWrap: "wrap", alignItems: "center" }}>
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Wort suchen..."
          style={{ flex: 1, minWidth: 200, padding: "10px 14px", background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 8, color: "var(--text)", fontSize: 14, fontFamily: "inherit", outline: "none" }} />
        <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
          {cats.map(c => (
            <span key={c} onClick={() => setFilter(c)} style={{
              padding: "6px 12px", borderRadius: 20, fontSize: 12, cursor: "pointer",
              background: filter === c ? "var(--gold)22" : "var(--bg-card)",
              color: filter === c ? "var(--gold)" : "var(--text-muted)",
              border: `1px solid ${filter === c ? "var(--gold)44" : "var(--border)"}`,
              transition: "all 0.2s",
            }}>{c}</span>
          ))}
        </div>
      </div>

      {/* Words */}
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {filtered.map((w, i) => (
          <Card key={w.wort} onClick={() => setExpanded(expanded === i ? null : i)}
            style={{ padding: 16, cursor: "pointer", animation: `textReveal 0.3s ease-out ${Math.min(i * 0.03, 0.5)}s both` }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                  <span className="serif" style={{ fontSize: 18, fontWeight: 700, color: "var(--gold)" }}>{w.wort}</span>
                  <Badge color="var(--text-muted)">{w.wortart}</Badge>
                  <span style={{ fontSize: 11, color: "var(--text-muted)" }}>{"⭐".repeat(w.schwierigkeit)}</span>
                </div>
                <div style={{ fontSize: 13, color: "var(--text-dim)", lineHeight: 1.5 }}>{w.definition}</div>
              </div>
              <Badge color="var(--accent)">{w.kategorie}</Badge>
            </div>
            {expanded === i && (
              <div style={{ marginTop: 12, paddingTop: 12, borderTop: "1px solid var(--border)" }}>
                <div style={{ fontSize: 13, color: "var(--text-muted)", fontStyle: "italic", marginBottom: 8, borderLeft: "2px solid var(--gold-dim)", paddingLeft: 10 }}>
                  „{w.beispiel}"
                </div>
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                  <span style={{ fontSize: 11, color: "var(--text-muted)" }}>Synonyme:</span>
                  {w.synonyme.map(s => <Badge key={s} color="var(--text-muted)">{s}</Badge>)}
                </div>
              </div>
            )}
          </Card>
        ))}
      </div>
      <div style={{ textAlign: "center", marginTop: 16, fontSize: 12, color: "var(--text-muted)" }}>
        {filtered.length} von {WOERTERBUCH.length} Wörtern
      </div>
    </div>
  );
}

// ─── Rangliste (Demo) ────────────────────────────────────────

function RanglistePage() {
  const demo = [
    { name: "Aurelius", pokale: 2340, siege: 42, gespielt: 55 },
    { name: "Cicero", pokale: 1850, siege: 35, gespielt: 48 },
    { name: "Valeria", pokale: 1200, siege: 28, gespielt: 40 },
    { name: "Ernat", pokale: 13, siege: 1, gespielt: 1 },
    { name: "Sadan", pokale: 5, siege: 0, gespielt: 1 },
  ];
  const medals = ["🥇", "🥈", "🥉"];

  return (
    <div style={{ padding: "32px 24px", maxWidth: 700, margin: "0 auto" }}>
      <div className="animate-in" style={{ textAlign: "center", marginBottom: 32 }}>
        <h1 className="serif" style={{ fontSize: 32, fontWeight: 900, color: "var(--gold)" }}>🏆 Rangliste</h1>
        <p style={{ color: "var(--text-dim)", marginTop: 4 }}>Die eloquentesten Redner</p>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {demo.map((sp, i) => {
          const rang = getRang(sp.pokale);
          const quote = sp.gespielt > 0 ? Math.round(sp.siege / sp.gespielt * 100) : 0;
          return (
            <Card key={sp.name} style={{ animation: `textReveal 0.4s ease-out ${i * 0.08}s both`, padding: 16 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                <div style={{ fontSize: 24, width: 36, textAlign: "center" }}>{medals[i] || `${i + 1}.`}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span className="serif" style={{ fontWeight: 700, fontSize: 17, color: i === 0 ? "var(--gold-bright)" : "var(--text)" }}>{sp.name}</span>
                    <span style={{ fontSize: 13 }}>{rang.symbol} {rang.name}</span>
                  </div>
                  <div style={{ display: "flex", gap: 16, marginTop: 4 }}>
                    <span style={{ fontSize: 12, color: "var(--text-muted)" }}>{sp.siege}W / {sp.gespielt - sp.siege}L</span>
                    <span style={{ fontSize: 12, color: "var(--text-muted)" }}>{quote}% Quote</span>
                  </div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div className="mono" style={{ fontWeight: 700, fontSize: 18, color: "var(--gold)" }}>{sp.pokale}</div>
                  <div style={{ fontSize: 10, color: "var(--text-muted)" }}>Pokale</div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

// ─── Regeln ──────────────────────────────────────────────────

function RegelnPage() {
  return (
    <div style={{ padding: "32px 24px", maxWidth: 680, margin: "0 auto" }}>
      <div className="animate-in" style={{ textAlign: "center", marginBottom: 32 }}>
        <h1 className="serif" style={{ fontSize: 32, fontWeight: 900, color: "var(--gold)" }}>❓ Spielregeln</h1>
      </div>
      {[
        { title: "⚔️ Duell-Modus", items: ["Zwei Spieler treten in 3 Runden an", "Jede Runde eine Situation mit steigender Schwierigkeit", "Die KI bewertet beide Antworten nach 7 Kriterien", "Der eloquentere Spieler gewinnt Pokale"] },
        { title: "📊 Bewertungskriterien", items: ["Situationsbezug (15 Pkt) — Passt die Antwort?", "Wortvielfalt (15 Pkt) — Abwechslung statt Wiederholungen", "Rhetorik (25 Pkt) — Metaphern, Fragen, Antithesen...", "Wortschatz (15 Pkt) — Gehobene Ausdrücke", "Argumentation (15 Pkt) — Logischer Aufbau", "Kreativität (10 Pkt) — Originelle Gedanken", "Textstruktur (5 Pkt) — Kohärenz & Bindewörter"] },
        { title: "💡 Tipps", items: ["Vergleiche: 'wie ein Leuchtturm in stürmischer Nacht'", "Rhetorische Fragen: 'Ist es nicht so, dass...?'", "Trikolon: 'Freiheit, Gleichheit, Brüderlichkeit'", "Antithesen: 'Nicht nur..., sondern auch...'", "Gehobene Wörter: 'nichtsdestotrotz', 'eloquent', 'sublim'", "Variiere deine Satzlänge!"] },
      ].map(section => (
        <Card key={section.title} style={{ marginBottom: 16 }}>
          <h2 className="serif" style={{ fontSize: 20, fontWeight: 700, marginBottom: 12 }}>{section.title}</h2>
          {section.items.map((item, i) => (
            <div key={i} style={{ fontSize: 14, color: "var(--text-dim)", padding: "6px 0 6px 16px", borderLeft: "2px solid var(--border)", marginBottom: 4, lineHeight: 1.5 }}>{item}</div>
          ))}
        </Card>
      ))}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// App
// ═══════════════════════════════════════════════════════════

export default function App() {
  const [page, setPage] = useState("home");

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-deep)" }}>
      {page !== "home" && <NavBar current={page} onNavigate={setPage} />}
      {page === "home" && <HeroPage onNavigate={setPage} />}
      {page === "duell" && <DuellPage onNavigate={setPage} />}
      {page === "uebung" && <UebungPage />}
      {page === "woerterbuch" && <WoerterbuchPage />}
      {page === "rangliste" && <RanglistePage />}
      {page === "regeln" && <RegelnPage />}
      {page === "story" && (
        <div style={{ padding: "80px 24px", textAlign: "center" }}>
          <h1 className="serif" style={{ fontSize: 32, color: "var(--gold)", marginBottom: 12 }}>📖 Story-Modus</h1>
          <p style={{ color: "var(--text-dim)" }}>Kommt in der nächsten Version — die epische Geschichte von Rhetorika!</p>
          <Button variant="ghost" onClick={() => setPage("home")} style={{ marginTop: 24 }}>← Zurück</Button>
        </div>
      )}
    </div>
  );
}
