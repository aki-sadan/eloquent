import { FUNKTIONS_WOERTER } from '../data/deutsche-nlp-data.js';
import { tokenize, hatVerb } from './heuristic-scorer.js';

// ──────────────────────────────────────────────────────
// Rhetorical Devices Detection (13 figures)
// ──────────────────────────────────────────────────────

export function erkenneRhetorischeMittel(text) {
  const mittel = [];
  const lower = text.toLowerCase();
  const saetze = text.split(/[.!?]+/).map(s => s.trim()).filter(s => s.length > 3);
  const woerter = tokenize(text);

  // 1. Vergleich / Metapher
  const vergleichMatches = text.match(/wie\s+(ein[e]?[mnrs]?|der|die|das|zu[mr]?)\s+[\wäöüÄÖÜß]{3,}/gi) || [];
  for (const v of vergleichMatches) {
    const ctx = saetze.find(s => s.includes(v.trim()));
    if (ctx && ctx.split(/\s+/).length >= 4) {
      mittel.push({ name: "Vergleich/Metapher", beispiel: v.trim(), warum: "Bildhafte Sprache durch Vergleich — macht die Aussage lebendig und greifbar." });
    }
  }

  const generischeWoerter = new Set(["all", "teil", "art", "form", "rest", "zahl", "menge", "reihe", "vielzahl", "anzahl", "hälfte", "anfang", "ende", "mitte", "seite", "rand", "grund", "folge", "lauf", "gang", "weise"]);
  // Verb-like endings — exclude as first word of genitive metaphor
  const verbEndungen = ["te", "de", "ten", "den", "tte", "nde", "ren", "len", "gen", "ben", "fen", "zen", "ken", "nen"];
  const genitivMetapher = text.match(/\b[\wäöüÄÖÜß]{4,}\s+d(er|es)\s+[\wäöüÄÖÜß]{4,}/gi) || [];
  for (const gm of genitivMetapher) {
    const parts = gm.split(/\s+/);
    const erstesWort = parts[0].toLowerCase();
    const letztesWort = parts[parts.length - 1].toLowerCase();
    // Skip verb-like first words (würde, finde, wurde, etc.)
    const istVerbArtig = verbEndungen.some(e => erstesWort.endsWith(e)) && erstesWort.length <= 7;
    if (istVerbArtig) continue;
    if (parts.length >= 3 && !FUNKTIONS_WOERTER.has(erstesWort) && !generischeWoerter.has(erstesWort)
        && !FUNKTIONS_WOERTER.has(letztesWort) && !generischeWoerter.has(letztesWort)
        && erstesWort.length >= 4 && letztesWort.length >= 4) {
      const istMetaphorisch = !letztesWort.includes(erstesWort) && !erstesWort.includes(letztesWort);
      if (istMetaphorisch) {
        mittel.push({ name: "Vergleich/Metapher", beispiel: gm.trim(), warum: "Genitivmetapher — elegante bildhafte Ausdrucksweise." });
        break;
      }
    }
  }

  // "X ist ein/eine [adj] Y" implicit metaphor (e.g., "ein zeitloser Kompass")
  const konkreteNomen = new Set([
    "kompass", "brücke", "anker", "leuchtturm", "spiegel", "schlüssel", "fundament",
    "säule", "quelle", "wurzel", "flamme", "funke", "licht", "schatten", "stern",
    "sonne", "mond", "meer", "ozean", "berg", "fels", "strom", "fluss", "weg", "pfad",
    "tor", "tür", "fenster", "mauer", "netz", "faden", "kette", "ring", "schild",
    "schwert", "waffe", "gift", "medizin", "heilmittel", "samen", "blüte", "frucht",
    "baum", "garten", "wüste", "oase", "insel", "hafen", "ufer", "motor", "triebfeder",
    "werkzeug", "instrument", "stimme",
    // Scientific/biological metaphors
    "symbiose", "katalysator", "elixier", "echo", "resonanz", "barometer",
    "architektur", "choreografie", "sinfonie", "symphonie", "mosaik", "palette",
    "leinwand", "bühne", "kulisse", "rezept", "cocktail", "gewebe", "kristall",
    "prisma", "filter", "rahmen", "skelett", "rückgrat", "herzstück",
    "antrieb", "treibstoff", "komposition", "partitur",
  ]);
  const abstrakteNomen = new Set([
    "seele", "geist", "herz", "liebe", "hoffnung", "freiheit", "gerechtigkeit",
    "wahrheit", "schönheit", "weisheit", "tugend", "moral", "ehre", "würde", "mut",
    "kraft", "stärke", "macht", "leben", "tod", "zeit", "ewigkeit", "glück", "leid",
    "freude", "trauer", "angst", "furcht", "vertrauen", "glaube", "wissen",
    "erkenntnis", "bildung", "kultur", "gesellschaft", "demokratie", "frieden",
    "krieg", "menschheit", "zivilisation", "fortschritt", "wandel", "verbundenheit",
    "einsamkeit", "stille",
    // Social/experiential abstracts
    "genuss", "atmosphäre", "harmonie", "stimmung", "eleganz", "abend", "erlebnis",
    "begegnung", "augenblick", "moment", "erinnerung", "zukunft", "vergangenheit",
    "identität", "charakter", "persönlichkeit", "eloquenz", "rhetorik",
    "inspiration", "kreativität", "leidenschaft", "hingabe", "engagement",
  ]);

  // Pattern: concrete noun + "für die/den/das/der" + abstract noun
  const fuerPattern = text.match(/\b([\wäöüÄÖÜß]{4,})\s+für\s+d(ie|en|as|er)\s+([\wäöüÄÖÜß]{4,})/gi) || [];
  if (!mittel.some(m => m.name === "Vergleich/Metapher" && m.warum.includes("für"))) {
    for (const fp of fuerPattern) {
      const parts = fp.split(/\s+/);
      const noun1 = parts[0].toLowerCase();
      const noun2 = parts[parts.length - 1].toLowerCase();
      if ((konkreteNomen.has(noun1) && abstrakteNomen.has(noun2)) ||
          (abstrakteNomen.has(noun1) && konkreteNomen.has(noun2))) {
        mittel.push({ name: "Vergleich/Metapher", beispiel: fp.trim(), warum: "Bildhafte Metapher — konkretes Bild für abstrakten Begriff." });
        break;
      }
    }
  }

  // Pattern: "ein/eine [adj] Konkret-Nomen" in abstract context
  const einAdjNomen = text.match(/\bein[e]?\s+[\wäöüÄÖÜß]{4,}\s+([\wäöüÄÖÜß]{4,})/gi) || [];
  if (!mittel.some(m => m.name === "Vergleich/Metapher")) {
    for (const match of einAdjNomen) {
      const parts = match.split(/\s+/);
      const lastWord = parts[parts.length - 1].toLowerCase();
      if (konkreteNomen.has(lastWord)) {
        const ctx = saetze.find(s => s.toLowerCase().includes(match.toLowerCase()));
        if (ctx) {
          const ctxWords = ctx.toLowerCase().split(/\s+/).map(w => w.replace(/[^a-zäöüß]/g, ""));
          const hasAbstract = ctxWords.some(w => abstrakteNomen.has(w));
          if (hasAbstract) {
            mittel.push({ name: "Vergleich/Metapher", beispiel: match.trim(), warum: "Implizite Metapher — konkretes Bild in abstraktem Kontext." });
            break;
          }
        }
      }
    }
  }

  // Pattern: "Konkret-Nomen aus/zwischen X und Y" (e.g., "Symbiose aus Genuss und Atmosphäre")
  if (!mittel.some(m => m.name === "Vergleich/Metapher")) {
    const ausPattern = text.match(/\b([\wäöüÄÖÜß]{4,})\s+(aus|zwischen|von)\s+[\wäöüÄÖÜß]{4,}/gi) || [];
    for (const match of ausPattern) {
      const firstWord = match.split(/\s+/)[0].toLowerCase();
      if (konkreteNomen.has(firstWord)) {
        mittel.push({ name: "Vergleich/Metapher", beispiel: match.trim(), warum: "Metaphorischer Bildausdruck — wissenschaftliches/konkretes Konzept übertragen." });
        break;
      }
    }
  }

  // 2. Personifikation
  const personifikVerben = [
    "tanzt", "weint", "lacht", "flüstert", "schreit", "schweigt", "erwacht",
    "schläft", "träumt", "singt", "spricht", "ruft", "atmet", "lebt", "stirbt",
    "kämpft", "hofft", "scheint", "ruht", "vergeht", "eilt", "fließt", "strömt",
    "wartet", "herrscht", "regiert", "lockt", "verführt", "erstrahlt", "verblasst",
    "erblüht", "welkt", "verstummt", "erwacht", "gebiert", "verschlingt",
    "umarmt", "berührt", "küsst", "strahlt", "tobt", "wütet", "kriecht",
    "rennt", "schleicht", "stillsteht", "gewinnt", "verliert", "lehrt",
    "erzählt", "verrät", "offenbart", "verbirgt", "bewahrt", "fordert",
  ];
  const abstrakta = [
    "zeit", "wind", "nacht", "welt", "freiheit", "liebe", "hoffnung", "stille",
    "dunkelheit", "licht", "wahrheit", "natur", "schicksal", "glück", "angst",
    "freude", "seele", "herz", "stadt", "meer", "atmosphäre", "stimmung",
    "abend", "morgen", "moment", "einsamkeit", "harmonie", "chaos", "melancholie",
    "nostalgie", "sehnsucht", "erinnerung", "vergänglichkeit", "ewigkeit",
    "demokratie", "gerechtigkeit", "frieden", "krieg", "musik", "klang",
    "schweigen", "trauer", "verzweiflung", "buch", "text", "werk",
    "sprache", "wort", "gedanke", "idee", "traum", "wunsch",
  ];
  for (const s of saetze) {
    const sw = s.toLowerCase().split(/\s+/);
    const cleanWords = sw.map(w => w.replace(/[^a-zäöüß]/g, ""));
    const hatAbstraktum = cleanWords.some(w => abstrakta.includes(w));
    const hatPersVerb = cleanWords.some(w => personifikVerben.includes(w));
    // Also check for "zu + infinitive" compounds (e.g., "stillzustehen")
    const hatZuInf = cleanWords.some(w => /zu(stehen|gehen|laufen|fließen|schlafen|sterben|leben|atmen|sprechen|schweigen|tanzen|weinen|lachen|warten|ruhen)$/.test(w));
    if (hatAbstraktum && (hatPersVerb || hatZuInf)) {
      mittel.push({ name: "Personifikation", beispiel: s.length > 80 ? s.slice(0, 77) + "..." : s, warum: "Abstrakte Begriffe werden als handelnde Wesen dargestellt — erzeugt Lebendigkeit." });
      break;
    }
  }

  // 3. Rhetorische Frage
  const frageTeile = text.split("?").slice(0, -1);
  for (const teil of frageTeile) {
    const frageSatz = teil.split(/[.!]/).pop()?.trim();
    if (frageSatz && frageSatz.split(/\s+/).length >= 4 && hatVerb(frageSatz)) {
      const beispiel = frageSatz.length > 80 ? frageSatz.slice(0, 77) + "..." : frageSatz;
      mittel.push({ name: "Rhetorische Frage", beispiel: beispiel + "?", warum: "Fragen regen zum Nachdenken an und verstärken die Aussage." });
      break;
    }
  }

  // 4. Antithese
  const antithesePatterns = [
    { re: /nicht\s+nur\s+[\wäöüÄÖÜß\s,]{3,60}sondern\s+(auch\s+)?/i, name: "nicht nur...sondern" },
    { re: /einerseits\s+[\wäöüÄÖÜß\s,]{3,80}andererseits/i, name: "einerseits...andererseits" },
    { re: /weder\s+[\wäöüÄÖÜß\s,]{3,60}noch\s+/i, name: "weder...noch" },
    { re: /zwar\s+[\wäöüÄÖÜß\s,]{3,60}(aber|jedoch|doch)\s+/i, name: "zwar...aber" },
    { re: /auf\s+der\s+einen\s+seite[\wäöüÄÖÜß\s,]{5,80}auf\s+der\s+anderen/i, name: "auf der einen/anderen Seite" },
    { re: /im\s+gegensatz\s+(zu|dazu)/i, name: "im Gegensatz zu" },
  ];
  for (const { re, name } of antithesePatterns) {
    const m = lower.match(re);
    if (m) {
      mittel.push({ name: "Antithese", beispiel: text.slice(m.index, m.index + Math.min(m[0].length + 20, 90)).trim(), warum: `Gegensatzpaar (${name}) — verstärkt die Argumentation durch Kontrast.` });
      break;
    }
  }

  // 5. Trikolon
  const trikolonRe = /(\b[\wäöüÄÖÜß]{2,}\b)\s*,\s*(\b[\wäöüÄÖÜß]{2,}\b)\s+(und|sowie|oder|wie\s+auch)\s+(\b[\wäöüÄÖÜß]{2,}\b)/gi;
  const tMatch = text.match(trikolonRe);
  if (tMatch) {
    const parts = tMatch[0].split(/[,]\s*|\s+(und|sowie|oder)\s+/i).filter(Boolean);
    const inhaltlich = parts.filter(p => !FUNKTIONS_WOERTER.has(p.trim().toLowerCase()));
    if (inhaltlich.length >= 3) {
      mittel.push({ name: "Trikolon", beispiel: tMatch[0], warum: "Dreiergruppen erzeugen Rhythmus, Nachdruck und bleiben im Gedächtnis." });
    }
  }

  // 6. Anapher
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

  // 7. Alliteration
  for (let i = 0; i < woerter.length - 2; i++) {
    const a = woerter[i][0]?.toLowerCase();
    const b = woerter[i + 1][0]?.toLowerCase();
    const c = woerter[i + 2][0]?.toLowerCase();
    if (a && a === b && b === c && /[a-zäöüß]/.test(a) && woerter[i].length > 2) {
      mittel.push({ name: "Alliteration", beispiel: `${woerter[i]} ${woerter[i + 1]} ${woerter[i + 2]}`, warum: "Gleicher Anlaut bei drei+ Wörtern erzeugt Klangwirkung." });
      break;
    }
  }
  if (!mittel.some(m => m.name === "Alliteration")) {
    for (let i = 0; i < woerter.length - 1; i++) {
      const a = woerter[i][0]?.toLowerCase();
      const b = woerter[i + 1][0]?.toLowerCase();
      if (a && a === b && /[a-zäöüß]/.test(a)
          && woerter[i].length > 4 && woerter[i + 1].length > 4
          && !FUNKTIONS_WOERTER.has(woerter[i].toLowerCase())
          && !FUNKTIONS_WOERTER.has(woerter[i + 1].toLowerCase())) {
        mittel.push({ name: "Alliteration", beispiel: `${woerter[i]} ${woerter[i + 1]}`, warum: "Gleiche Anfangslaute erzeugen Klang und Rhythmus." });
        break;
      }
    }
  }

  // 8. Klimax
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

  // 9. Hyperbel
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

  // 10. Parenthese
  const parentheseMatch = text.match(/[–—]\s*.{5,60}\s*[–—]/) || text.match(/\(.{8,60}\)/);
  if (parentheseMatch) {
    mittel.push({ name: "Parenthese", beispiel: parentheseMatch[0].slice(0, 60), warum: "Einschübe fügen ergänzende Gedanken ein und zeigen Reflexionsvermögen." });
  }

  // 11. Chiasmus — verify A-B / B-A word structure
  const chiasmusMatch = text.match(/\bnicht\s+([\wäöüß]+)\s+([\wäöüß]+),?\s+sondern\s+([\wäöüß]+)\s+([\wäöüß]+)/i);
  if (chiasmusMatch) {
    const [, a, b, c, d] = chiasmusMatch;
    const aL = a.toLowerCase(), bL = b.toLowerCase(), cL = c.toLowerCase(), dL = d.toLowerCase();
    // True chiasmus: A-B / B-A (word reversal) or at least B matches C or A matches D
    const isChiasmus = (aL === dL && bL === cL) || // perfect A-B-B-A
      (bL.slice(0, 4) === cL.slice(0, 4) && bL.length >= 4) || // B≈C (semantic reversal)
      (aL.slice(0, 4) === dL.slice(0, 4) && aL.length >= 4);   // A≈D (semantic reversal)
    if (isChiasmus) {
      mittel.push({ name: "Chiasmus", beispiel: chiasmusMatch[0].slice(0, 80), warum: "Die Überkreuzung von Satzteilen erzeugt einen eleganten rhetorischen Kontrast." });
    }
  }
  // Broader chiasmus: comma-separated clauses with reversed structure
  if (!mittel.some(m => m.name === "Chiasmus")) {
    for (let i = 0; i < saetze.length; i++) {
      const parts = saetze[i].split(/[,;–—]+/).map(p => p.trim()).filter(p => p.length > 3);
      for (let j = 0; j < parts.length - 1; j++) {
        const w1 = tokenize(parts[j]).filter(w => !FUNKTIONS_WOERTER.has(w) && w.length > 3);
        const w2 = tokenize(parts[j + 1]).filter(w => !FUNKTIONS_WOERTER.has(w) && w.length > 3);
        if (w1.length >= 2 && w2.length >= 2) {
          const first1 = w1[0], last1 = w1[w1.length - 1];
          const first2 = w2[0], last2 = w2[w2.length - 1];
          // A...B / B...A pattern
          if (first1 === last2 && last1 === first2) {
            mittel.push({ name: "Chiasmus", beispiel: parts[j].slice(0, 40) + " / " + parts[j + 1].slice(0, 40), warum: "Überkreuzung der Wortstellung (A-B / B-A) erzeugt rhetorische Eleganz." });
            break;
          }
        }
      }
      if (mittel.some(m => m.name === "Chiasmus")) break;
    }
  }

  // 12. Ellipse
  for (const s of saetze) {
    const sw = s.split(/\s+/);
    if (sw.length >= 2 && sw.length <= 5 && !hatVerb(s) && !FUNKTIONS_WOERTER.has(sw[0].toLowerCase())) {
      mittel.push({ name: "Ellipse", beispiel: s, warum: "Bewusste Auslassung erzeugt Prägnanz und Nachdruck." });
      break;
    }
  }

  // 13. Oxymoron — word-boundary matching to avoid false positives
  const oxymora = [
    ["bitter", "süß"], ["dunkel", "hell"], ["laut", "leise"],
    ["kalt", "warm"], ["groß", "klein"], ["schwarz", "weiß"], ["traurig", "froh"],
    ["scheiter", "gelingen"], ["tod", "leben"], ["lieb", "hass"],
    ["alt", "jung"], ["arm", "reich"], ["stark", "schwach"],
  ];
  for (const [a, b] of oxymora) {
    // Use word boundaries to avoid "Alter" matching "alt"
    const regA = new RegExp(`\\b${a}(e[rsnm]?|es)?\\b`, 'i');
    const regB = new RegExp(`\\b${b}(e[rsnm]?|es)?\\b`, 'i');
    const mA = lower.match(regA);
    const mB = lower.match(regB);
    if (mA && mB) {
      const dist = Math.abs(mA.index - mB.index);
      // Must be close (same clause) and not separated by sentence boundary
      if (dist > 0 && dist < 30) {
        const between = lower.slice(Math.min(mA.index, mB.index), Math.max(mA.index, mB.index));
        if (!/[.!?]/.test(between)) {
          mittel.push({ name: "Oxymoron", beispiel: `${a}...${b}`, warum: "Widersprüchliche Begriffe nah beieinander erzeugen spannungsvolle Spannung." });
          break;
        }
      }
    }
  }

  return mittel;
}
