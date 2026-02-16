import { WOERTERBUCH, GEHOBENE_WOERTER } from '../data/woerterbuch.js';
import { FUNKTIONS_WOERTER, NATUERLICHE_BIGRAMME } from '../data/deutsche-nlp-data.js';
import { tokenize, satzSinnScore, textKohaerenz, semantischerSituationsmatch, findeGehobeneWoerter, analysiereWortschatz, analysiereDiskursstruktur } from './heuristic-scorer.js';
import { tiefesAntiGaming } from './anti-gaming.js';
import { erkenneRhetorischeMittel } from './rhetorik-detector.js';
import { aiBewerung, hasAiProvider } from './ki-scorer.js';

// ══════════════════════════════════════════════════════
// ELOQUENT Scoring Engine v6 — Additive Scoring
// NO quality multiplier. Each category scored on its own.
// Only gaming detection can reduce scores.
// ══════════════════════════════════════════════════════

export function berechneAlleKategorien(text, situation) {
  const tokens = tokenize(text);
  const wortAnzahl = tokens.length;
  const saetze = text.split(/[.!?]+/).filter(s => s.trim().length > 5);
  const textLc = text.toLowerCase();

  const mittel = erkenneRhetorischeMittel(text);
  const gehobene = findeGehobeneWoerter(text);
  const situMatch = semantischerSituationsmatch(situation, text);
  const wortschatz = analysiereWortschatz(text, gehobene);
  const diskurs = analysiereDiskursstruktur(text);

  const sinnScores = saetze.map(s => satzSinnScore(s));
  const avgSinn = sinnScores.length > 0 ? sinnScores.reduce((a, b) => a + b, 0) / sinnScores.length : 0.1;
  const kohaerenz = textKohaerenz(saetze);

  // ── Structural features ──
  const kommaCount = (text.match(/,/g) || []).length;
  const hatRelativsatz = (text.match(/,\s+(?:(?:in|auf|von|mit|an|aus|bei|für|über|durch|nach|vor|unter|zwischen)\s+)?(?:der|die|das|dem|den|des|welche[rsmn]?)\s+/g) || []).length > 0;
  const nebensatzKonj = ["weil", "da ", "obwohl", "dass", "damit", "sodass", "ob ", "wenn", "als ", "nachdem", "bevor", "während"];
  const hatSubordination = nebensatzKonj.some(k => textLc.includes(k));

  // ═══ RHETORIK (0-25) ═══
  const RHETORIK_GEWICHTE = {
    "Vergleich/Metapher": 8, "Personifikation": 7, "Chiasmus": 7,
    "Oxymoron": 6, "Klimax": 6, "Antithese": 5, "Trikolon": 5,
    "Rhetorische Frage": 4, "Anapher": 4, "Parenthese": 3,
    "Hyperbel": 3, "Ellipse": 2, "Alliteration": 2,
  };

  const mittelCounts = {};
  for (const m of mittel) mittelCounts[m.name] = (mittelCounts[m.name] || 0) + 1;
  const mittelArten = new Set(mittel.map(m => m.name));

  let rhetorikRaw = 0;
  for (const art of mittelArten) {
    const baseWeight = RHETORIK_GEWICHTE[art] || 3;
    const count = mittelCounts[art] || 1;
    let artScore = baseWeight;
    if (count >= 2) artScore += baseWeight * 0.5;
    if (count >= 3) artScore += baseWeight * 0.25 * (count - 2);
    rhetorikRaw += artScore;
  }
  if (mittelArten.size >= 4) rhetorikRaw += 3;
  else if (mittelArten.size >= 3) rhetorikRaw += 1;

  // BASE rhetoric credit for complex structure (even without named devices)
  // Complex sentence structure IS a rhetorical skill
  if (hatSubordination && hatRelativsatz) rhetorikRaw = Math.max(rhetorikRaw, 6);
  else if (hatRelativsatz) rhetorikRaw = Math.max(rhetorikRaw, 4);
  else if (hatSubordination) rhetorikRaw = Math.max(rhetorikRaw, 3);
  if (kommaCount >= 4 && wortAnzahl >= 20) rhetorikRaw = Math.max(rhetorikRaw, 3);

  // Bonus for rich complex text
  if (wortAnzahl >= 30 && kommaCount >= 5 && saetze.length >= 2) rhetorikRaw += 2;
  rhetorikRaw = Math.min(rhetorikRaw, 25);

  // ═══ KREATIVITÄT (0-10) ═══
  let kreativRaw = 0;
  if (saetze.length >= 2) {
    const laengen = saetze.map(s => s.trim().split(/\s+/).length);
    const avg = laengen.reduce((a, b) => a + b, 0) / laengen.length;
    const varianz = laengen.reduce((s, l) => s + Math.abs(l - avg), 0) / laengen.length;
    kreativRaw += Math.min(varianz / 2, 3);
  }
  const punctTypes = [text.includes("?"), text.includes("!"), text.includes(".")].filter(Boolean).length;
  if (punctTypes >= 2) kreativRaw += 1;
  if (mittel.some(m => m.name === "Vergleich/Metapher")) kreativRaw += 3;
  if (mittel.some(m => m.name === "Personifikation")) kreativRaw += 2;
  if (mittel.some(m => m.name === "Oxymoron")) kreativRaw += 1.5;
  if (wortschatz.details.rareWordRatio >= 70) kreativRaw += 2;
  else if (wortschatz.details.rareWordRatio >= 50) kreativRaw += 1;
  // Base for any substantive text
  if (wortAnzahl >= 15 && avgSinn >= 0.5) kreativRaw = Math.max(kreativRaw, 2);
  kreativRaw = Math.min(kreativRaw, 10);

  // ═══ ARGUMENTATION (0-15) ═══
  let argRaw = diskurs.score;
  // Base credit for complex structure
  if (hatSubordination && wortAnzahl >= 12) argRaw = Math.max(argRaw, 5);
  if (hatRelativsatz) argRaw = Math.max(argRaw, 5);
  if (saetze.length >= 3 && avgSinn >= 0.5) argRaw = Math.max(argRaw, 6);
  if (saetze.length >= 5 && avgSinn >= 0.5) argRaw = Math.max(argRaw, 8);
  if (kommaCount >= 3 && wortAnzahl >= 20) argRaw = Math.max(argRaw, 4);
  argRaw = Math.min(argRaw, 15);

  // ═══ TEXTSTRUKTUR (0-5) ═══
  let strukturRaw = 0;
  if (saetze.length >= 4) strukturRaw += 2;
  else if (saetze.length >= 3) strukturRaw += 1.5;
  else if (saetze.length >= 2) strukturRaw += 1;
  if (diskurs.konnektorAnzahl >= 3) strukturRaw += 1;
  else if (diskurs.konnektorAnzahl >= 1) strukturRaw += 0.5;
  if (hatRelativsatz) strukturRaw += 1;
  if (hatSubordination) strukturRaw += 0.5;
  if (diskurs.hatEinleitung) strukturRaw += 0.5;
  if (diskurs.hatSchluss) strukturRaw += 0.5;
  // Complex single sentence base
  if (saetze.length <= 2 && kommaCount >= 2 && wortAnzahl >= 15) strukturRaw = Math.max(strukturRaw, 2);
  strukturRaw = Math.min(strukturRaw, 5);

  // ═══ SITUATIONSBEZUG (0-15) ═══
  let situScore = situMatch.punkte;
  // Minimum credit for coherent text
  if (wortAnzahl >= 10 && avgSinn >= 0.4) situScore = Math.max(situScore, 4);
  if (wortAnzahl >= 20 && avgSinn >= 0.5) situScore = Math.max(situScore, 6);
  situScore = Math.min(situScore, 15);

  // ═══ WORTVIELFALT (0-15) ═══
  let vielfaltRaw = wortschatz.details.ttr / 100 * 12;
  if (tokens.filter(w => w.length > 8).length >= 3) vielfaltRaw += 2;
  else if (tokens.filter(w => w.length > 8).length >= 1) vielfaltRaw += 1;
  if (tokens.filter(w => w.length > 10).length >= 1) vielfaltRaw += 1;
  // Base for substantive text
  if (wortAnzahl >= 15 && avgSinn >= 0.4) vielfaltRaw = Math.max(vielfaltRaw, 5);
  vielfaltRaw = Math.min(vielfaltRaw, 15);

  // ═══ WORTSCHATZ (0-15) ═══
  let wortschatzRaw = wortschatz.score;
  // Fix contradictory feedback: if score is high, gehobene detection should matter less
  if (wortschatzRaw >= 8 && gehobene.length === 0) {
    // Score comes from vocab richness, not gehobene detection
    // This is fine — differenzierter Wortschatz
  }
  // Boost if gehobene detected
  if (gehobene.length >= 3) wortschatzRaw = Math.max(wortschatzRaw, 11);
  else if (gehobene.length >= 1) wortschatzRaw = Math.max(wortschatzRaw, 7);
  wortschatzRaw = Math.min(wortschatzRaw, 15);

  // ═══ GAMING PENALTY ═══
  // Only applied for clearly broken/nonsensical text
  let gamingMult = 1;
  if (avgSinn < 0.2) gamingMult = 0.1;
  else if (avgSinn < 0.3) gamingMult = 0.3;
  else if (avgSinn < 0.4) gamingMult = 0.6;
  // avgSinn >= 0.4 → no penalty at all

  const punkte = {
    situationsbezug: round1(situScore * gamingMult),
    wortvielfalt: round1(vielfaltRaw * gamingMult),
    rhetorik: round1(rhetorikRaw * gamingMult),
    wortschatz: round1(wortschatzRaw * gamingMult),
    argumentation: round1(argRaw * gamingMult),
    kreativitaet: round1(kreativRaw * gamingMult),
    textstruktur: round1(strukturRaw * gamingMult),
  };

  return {
    punkte, mittel, gehobene, wortAnzahl,
    avgSinn: round2(avgSinn),
    kohaerenz: round2(kohaerenz),
    situMatch, wortschatzDetails: wortschatz.details, diskurs,
  };
}

function round1(v) { return Math.round(v * 10) / 10; }
function round2(v) { return Math.round(v * 100) / 100; }

// ──────────────────────────────────────────────────────
// Feedback Generation
// ──────────────────────────────────────────────────────

function generiereFeedback(analyse) {
  const { punkte, mittel, gehobene, wortAnzahl, avgSinn } = analyse;
  const gesamt = Object.values(punkte).reduce((s, v) => s + v, 0);
  const teile = [];

  if (avgSinn < 0.4) {
    teile.push("Der Text enthält Passagen, die grammatisch oder inhaltlich nicht ganz stimmig wirken — achte auf vollständige, sinnvolle Sätze.");
    return teile.join(" ");
  }

  if (gesamt >= 70) {
    teile.push("Eine beeindruckend eloquente Antwort!");
    if (mittel.length >= 4) teile.push("Die Vielfalt der rhetorischen Mittel verleiht dem Text besondere Überzeugungskraft.");
    else if (gehobene.length >= 4) teile.push("Der gehobene Wortschatz hebt die Antwort deutlich hervor.");
    else teile.push("Struktur und Argumentation überzeugen auf ganzer Linie.");
  } else if (gesamt >= 50) {
    teile.push("Eine gute Antwort mit solidem sprachlichen Niveau.");
    if (mittel.length < 2) teile.push("Mehr rhetorische Mittel wie Vergleiche oder rhetorische Fragen würden die Wirkung steigern.");
    if (gehobene.length < 2) teile.push("Ein noch gehobenerer Wortschatz würde dem Text mehr Eleganz verleihen.");
    if (punkte.argumentation < 8) teile.push("Logische Verknüpfungen (daher, folglich, somit) stärken die Argumentation.");
  } else if (gesamt >= 35) {
    teile.push("Ein solider Ansatz — hier ist noch Raum für mehr Eloquenz.");
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

// ──────────────────────────────────────────────────────
// Heuristic Feedback Map (for category-specific feedback)
// ──────────────────────────────────────────────────────

function feedbackMap(punkte, mittel, gehobene) {
  return {
    situationsbezug: punkte.situationsbezug >= 12 ? "Starker inhaltlicher Bezug — die Antwort trifft den Kern der Situation." :
      punkte.situationsbezug >= 6 ? "Erkennbarer Bezug zur Situation — gute thematische Anbindung." :
      "Mehr inhaltlicher Bezug zur konkreten Situation würde die Antwort stärken.",
    wortvielfalt: punkte.wortvielfalt >= 10 ? "Abwechslungsreiche, vielfältige und präzise Wortwahl." :
      punkte.wortvielfalt >= 5 ? "Gute Wortvielfalt — mehr Synonyme und weniger Wiederholungen möglich." :
      "Versuche, mehr Synonyme zu verwenden und Wortwiederholungen zu vermeiden.",
    rhetorik: punkte.rhetorik >= 15 ? `${mittel.length} rhetorische Mittel gekonnt eingesetzt — exzellente Überzeugungskraft!` :
      punkte.rhetorik >= 7 ? `${mittel.length} rhetorische(s) Mittel erkannt. Sprachliche Gestaltung auf gutem Niveau.` :
      punkte.rhetorik >= 3 ? "Sprachlich komplex formuliert — mit gezielten Stilmitteln (Vergleiche, Fragen) erreichst du noch mehr." :
      "Rhetorische Mittel wie Vergleiche, Fragen und Dreiergruppen fehlen noch.",
    wortschatz: gehobene.length >= 3 ? `${gehobene.length} gehobene Ausdrücke — exzellenter Wortschatz!` :
      gehobene.length >= 1 ? `${gehobene.length} gehobene(s) Wort gefunden. Weitere würden den Text aufwerten.` :
      punkte.wortschatz >= 8 ? "Differenzierter Wortschatz mit guter sprachlicher Tiefe." :
      "Ein gehobenerer Wortschatz würde dem Text mehr Eleganz verleihen.",
    argumentation: punkte.argumentation >= 10 ? "Logisch aufgebaut und überzeugend argumentiert — klare Gedankenführung." :
      punkte.argumentation >= 5 ? "Erkennbare Argumentation — Konnektoren wie 'daher', 'somit' stärken den Aufbau." :
      "Mehr logische Verknüpfungen (daher, somit, folglich) würden die Argumentation stärken.",
    kreativitaet: punkte.kreativitaet >= 7 ? "Originelle und kreative Herangehensweise mit sprachlicher Eleganz!" :
      punkte.kreativitaet >= 3.5 ? "Kreative Ansätze vorhanden — mehr Variation bei Satzarten und Bildern hilft." :
      "Mehr Satzvielfalt und bildhafte Sprache würden Kreativität zeigen.",
    textstruktur: punkte.textstruktur >= 4 ? "Kohärenter, gut strukturierter Text mit klarer Gliederung." :
      punkte.textstruktur >= 2 ? "Gute Grundstruktur — mit Einleitung und Schluss noch überzeugender." :
      "Mehr Kohäsionsmittel und eine klarere Gliederung würden die Struktur verbessern.",
  };
}

// ──────────────────────────────────────────────────────
// Main Scoring Function
// ──────────────────────────────────────────────────────

export async function kiBewertung(situation, antwort) {
  const text = antwort.trim();
  let kiError = null;

  // Try AI scoring first (Ollama → Groq)
  if (hasAiProvider()) {
    try {
      console.log('[ELOQUENT] Starte KI-Bewertung...');
      const result = await aiBewerung(situation, text);
      result._methode = 'ki';
      console.log(`[ELOQUENT] KI-Bewertung erfolgreich! (${result._provider}/${result._model})`);
      return result;
    } catch (e) {
      kiError = e.message;
      console.error('[ELOQUENT] KI-Bewertung fehlgeschlagen:', e.message);
    }
  } else {
    console.log('[ELOQUENT] Kein KI-Provider, nutze Heuristik');
  }

  // Heuristic scoring (always available)
  await new Promise(r => setTimeout(r, 300 + Math.random() * 300));

  try {
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
        _methode: 'regeln',
        _kiError: kiError,
      };
    }

    const analyse = berechneAlleKategorien(text, situation);
    const { punkte, mittel, gehobene } = analyse;
    const fb = feedbackMap(punkte, mittel, gehobene);

    return {
      kategorien: {
        situationsbezug: { p: punkte.situationsbezug, f: fb.situationsbezug },
        wortvielfalt: { p: punkte.wortvielfalt, f: fb.wortvielfalt },
        rhetorik: { p: punkte.rhetorik, f: fb.rhetorik },
        wortschatz: { p: punkte.wortschatz, f: fb.wortschatz },
        argumentation: { p: punkte.argumentation, f: fb.argumentation },
        kreativitaet: { p: punkte.kreativitaet, f: fb.kreativitaet },
        textstruktur: { p: punkte.textstruktur, f: fb.textstruktur },
      },
      mittel, gehobene,
      tipps: generiereTipps(analyse),
      empfehlungen: generiereEmpfehlungen(gehobene),
      feedback: generiereFeedback(analyse),
      gaming: false,
      _methode: 'regeln',
      _kiError: kiError,
    };
  } catch (e) {
    console.error("Bewertung fehlgeschlagen:", e);
    return null;
  }
}
