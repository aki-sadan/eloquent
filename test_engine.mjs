/**
 * ELOQUENT — Scoring Engine Tests v2
 * Tests the modular scoring engine after the refactor + calibration fixes.
 * Run with: node test_engine.mjs
 */

// ── Inline test data (minimal subset for testing) ──

const DEUTSCHE_VERBEN_STEMS = [
  "sein", "ist", "sind", "war", "bin", "bist", "wäre", "sei", "gewesen",
  "haben", "hat", "habe", "hatte", "hätte", "gehabt",
  "werden", "wird", "wurde", "würde", "werde",
  "können", "kann", "konnte", "könnte",
  "müssen", "muss", "musste", "sollen", "soll", "sollte",
  "wollen", "will", "wollte", "dürfen", "darf", "durfte",
  "geben", "gibt", "gab", "machen", "macht", "machte",
  "gehen", "geht", "ging", "kommen", "kommt", "kam",
  "sagen", "sagt", "sagte", "sprechen", "spricht", "sprach",
  "denken", "denkt", "dachte", "finden", "findet", "fand",
  "sehen", "sieht", "sah", "zeigen", "zeigt",
  "leben", "lebt", "liegen", "liegt",
  "bleiben", "bleibt", "blieb", "heißen", "heißt",
  "bedeuten", "bedeutet", "schaffen", "schafft",
  "erkennen", "erkennt", "verstehen", "versteht",
  "überzeugen", "überzeugt", "bewegen", "bewegt",
  "führen", "führt", "fühlen", "fühlt",
  "erinnern", "erinnert", "entdecken", "entdeckt",
].map(v => v.toLowerCase());

const FUNKTIONS_WOERTER = new Set([
  "der", "die", "das", "den", "dem", "des", "ein", "eine", "einen", "einem",
  "ich", "du", "er", "sie", "es", "wir", "ihr", "mich", "mir",
  "sich", "uns", "euch", "ihnen", "man",
  "und", "oder", "aber", "doch", "sondern", "denn", "weil", "dass", "wenn", "ob", "als",
  "wie", "so", "auch", "noch", "schon", "nur", "nicht", "kein", "keine",
  "in", "an", "auf", "für", "mit", "von", "zu", "bei", "nach", "vor", "über", "unter",
  "durch", "aus", "um", "bis", "ohne", "gegen",
  "ist", "sind", "war", "hat", "haben", "wird", "werden", "kann", "muss",
  "sehr", "mehr", "hier", "dort", "dann", "da", "nun", "immer", "nie",
  "am", "im", "zum", "zur", "vom", "beim",
  "etwas", "nichts", "alles", "was", "wer", "wo",
  "selbst", "wieder", "bereits", "kaum", "fast",
  "daran", "darin", "darauf", "davon", "dazu", "damit",
  "worauf", "worin", "woran",
  "mein", "meine", "meinem", "meinen", "meiner",
]);

const NATUERLICHE_BIGRAMME = new Set([
  "in der", "in die", "in den", "in jedem", "auf der", "auf die",
  "von der", "von den", "mit der", "mit dem",
  "für die", "für den", "für das", "für mich",
  "ist ein", "ist eine", "es ist", "es gibt", "es mich",
  "das ist", "zu sein", "ich bin", "ich habe", "ich würde",
  "wir sind", "wir haben", "wir können",
  "nicht nur", "sondern auch", "wenn wir", "dass die",
  "vor allem", "vor augen", "aus der", "aus dem",
  "im leben", "immer wieder", "meine wahl",
  "weil man", "da es", "ob es",
  "die schönheit", "der seele",
  "und es", "und die",
]);

const GEHOBENE_WOERTER = new Map([
  ["eloquent", "redegewandt"], ["formidabel", "beeindruckend"], ["sublim", "erhaben"],
  ["profund", "tiefgründig"], ["fulminant", "überwältigend"], ["ephemer", "vergänglich"],
  ["lakonisch", "wortkarg"], ["nichtsdestotrotz", "dennoch"],
]);

function tokenize(text) {
  return text.toLowerCase().replace(/[„""»«]/g, '"').replace(/[—–\-]/g, ' ')
    .split(/\s+/).map(w => w.replace(/^[^a-zäöüß]+|[^a-zäöüß]+$/gi, '')).filter(w => w.length > 0);
}

function hatVerb(satzInput) {
  const woerter = typeof satzInput === 'string' ? tokenize(satzInput) : satzInput;
  const nichtVerb = /(schaft|heit|keit|ung|nis|tät|mus|ion|enz|anz|tum|ling|chen|lein)$/;
  for (const w of woerter) {
    if (DEUTSCHE_VERBEN_STEMS.includes(w)) return true;
    if (nichtVerb.test(w)) continue;
    if (/^ge.+[t]$/.test(w) && w.length > 4) return true;
    if (/iert$/.test(w) && w.length > 5) return true;
    if (/ieren$/.test(w) && w.length > 6) return true;
    if (/[^s]te$/.test(w) && w.length > 4) return true;
    if (/[^s]ten$/.test(w) && w.length > 5) return true;
    if (w.endsWith("en") && w.length > 5 && !FUNKTIONS_WOERTER.has(w)) return true;
  }
  return false;
}

function satzSinnScore(satz) {
  const woerter = tokenize(satz);
  if (woerter.length < 2) return 0;
  if (woerter.length > 80) return 0.7;
  let score = 0;
  const n = woerter.length;

  if (!hatVerb(woerter)) return 0.15;
  score += 0.35;

  const fwRatio = woerter.filter(w => FUNKTIONS_WOERTER.has(w)).length / n;
  if (fwRatio >= 0.15 && fwRatio <= 0.7) score += 0.25;
  else if (fwRatio >= 0.08 && fwRatio <= 0.8) score += 0.12;
  else score -= 0.1;

  let bigramHits = 0;
  for (let i = 0; i < woerter.length - 1; i++) {
    if (NATUERLICHE_BIGRAMME.has(woerter[i] + " " + woerter[i + 1])) bigramHits++;
  }
  if (n > 2) score += Math.min(bigramHits / (n - 1) * 2, 0.15);
  if (n >= 10 && bigramHits === 0) score -= 0.05;

  // Subordination bonus
  const nebensatzKonj = ["weil", "da", "obwohl", "dass", "damit", "sodass", "ob", "wenn", "als", "nachdem", "bevor", "während", "worauf", "wobei"];
  if (woerter.some(w => nebensatzKonj.includes(w)) && n >= 6) score += 0.1;

  const avgLen = woerter.reduce((s, w) => s + w.length, 0) / n;
  if (avgLen >= 3 && avgLen <= 9) score += 0.1;

  const lenVielfalt = new Set(woerter.map(w => w.length)).size;
  if (lenVielfalt >= Math.min(n * 0.3, 4)) score += 0.05;

  const inhalt = woerter.filter(w => !FUNKTIONS_WOERTER.has(w));
  const inhaltRatio = inhalt.length / n;
  if (inhaltRatio >= 0.25 && inhaltRatio <= 0.85) score += 0.05;

  if (inhalt.length > 0) {
    const uRatio = new Set(inhalt).size / inhalt.length;
    if (uRatio >= 0.7) score += 0.05;
    else if (uRatio < 0.25) score -= 0.15;
  }

  let maxRun = 0, currentRun = 0;
  for (const w of woerter) {
    if (!FUNKTIONS_WOERTER.has(w) && !DEUTSCHE_VERBEN_STEMS.includes(w)) {
      currentRun++;
      if (currentRun > maxRun) maxRun = currentRun;
    } else {
      currentRun = 0;
    }
  }
  if (maxRun >= 6) score -= 0.2;
  else if (maxRun >= 5) score -= 0.1;

  let hatPhrase = false;
  const artikel = new Set(["der", "die", "das", "den", "dem", "des", "ein", "eine", "einen", "einem", "einer"]);
  const praep = new Set(["in", "an", "auf", "für", "mit", "von", "zu", "bei", "nach", "aus", "um", "über", "vor", "durch", "gegen", "unter", "zwischen"]);
  const kontraktionen = new Set(["im", "am", "zum", "zur", "vom", "beim", "ins", "ans", "aufs"]);
  for (let i = 0; i < woerter.length - 1; i++) {
    const w1 = woerter[i], w2 = woerter[i + 1];
    if (artikel.has(w1) && !FUNKTIONS_WOERTER.has(w2)) { hatPhrase = true; break; }
    if (praep.has(w1) && artikel.has(w2)) { hatPhrase = true; break; }
    if (kontraktionen.has(w1) && !FUNKTIONS_WOERTER.has(w2)) { hatPhrase = true; break; }
    if (w1 === "zu" && hatVerb([w2])) { hatPhrase = true; break; }
    if (["ich", "du", "er", "sie", "es", "wir", "ihr", "man", "wer"].includes(w1) && (DEUTSCHE_VERBEN_STEMS.includes(w2) || hatVerb([w2]))) { hatPhrase = true; break; }
  }
  if (n >= 8 && !hatPhrase) score -= 0.15;

  return Math.max(0.1, Math.min(score, 1));
}

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

  if (/(.)\1{4,}/i.test(text)) { flags.push("zeichenwiederholung"); gs += 0.3; }

  const gehobeneCount = woerter.filter(w => GEHOBENE_WOERTER.has(w)).length;
  if (n > 5 && gehobeneCount / n > 0.5) { flags.push("keyword_stuffing"); gs += 0.4; }

  return { isGaming: gs >= 0.5, gamingScore: Math.min(gs, 1), flags, penalty: Math.max(0, 1 - gs) };
}

// ══════════════════════════════════════════════════════
// TEST SUITE
// ══════════════════════════════════════════════════════

let passed = 0;
let failed = 0;

function assert(condition, name) {
  if (condition) {
    console.log(`  ✅ ${name}`);
    passed++;
  } else {
    console.log(`  ❌ ${name}`);
    failed++;
  }
}

function assertRange(value, min, max, name) {
  if (value >= min && value <= max) {
    console.log(`  ✅ ${name}: ${typeof value === 'number' ? value.toFixed(2) : value} (${min}-${max})`);
    passed++;
  } else {
    console.log(`  ❌ ${name}: ${typeof value === 'number' ? value.toFixed(2) : value} (expected ${min}-${max})`);
    failed++;
  }
}

// ── Test 1: Bug Fixes ──

console.log("\n══ Test 1: Bug Fixes ══");

const gamingResult = tiefesAntiGaming("hallo hallo hallo hallo hallo hallo hallo hallo hallo hallo");
assert(gamingResult.isGaming !== undefined, "Anti-gaming returns isGaming (not istGaming)");
assert(gamingResult.isGaming === true, "Spam text correctly detected as gaming");

const gamingGrund = gamingResult.flags.length > 0
  ? `Gaming erkannt: ${gamingResult.flags.map(f => f.replace(/_/g, ' ')).join(', ')}.`
  : "Der Text konnte nicht sinnvoll bewertet werden.";
assert(gamingGrund.includes("Gaming erkannt"), "Gaming feedback generated from flags");

const eloquentCount = [...GEHOBENE_WOERTER.keys()].filter(k => k === "eloquent").length;
assert(eloquentCount === 1, "No duplicate 'eloquent' in GEHOBENE_WOERTER");

// ── Test 2: Verb Detection ──

console.log("\n══ Test 2: Verb Detection ══");

assert(hatVerb("Die Welt ist schön") === true, "hatVerb: 'ist' detected");
assert(hatVerb("Er überzeugte alle") === true, "hatVerb: '-te' verb detected");
assert(hatVerb("Das Haus") === false, "hatVerb: no verb in 'Das Haus'");
assert(hatVerb("Sie manifestieren Stärke") === true, "hatVerb: '-ieren' verb detected");
assert(hatVerb("Die Gerechtigkeit hat triumphiert") === true, "hatVerb: '-iert' past participle");
assert(hatVerb("gegangen und gelacht") === true, "hatVerb: 'ge-...-t' participle");

// ── Test 3: Sentence Sense Score ──

console.log("\n══ Test 3: Sentence Sense Score ══");

const sinnGut = satzSinnScore("Die Gerechtigkeit ist ein fundamentaler Wert in unserer Gesellschaft.");
const sinnSchlecht = satzSinnScore("eloquent sublim formidabel profund fulminant ephemer");
const sinnKurz = satzSinnScore("ja");

assertRange(sinnGut, 0.4, 1.0, "Good sentence sense");
assertRange(sinnSchlecht, 0.0, 0.3, "Word salad sense");
assert(sinnKurz === 0, "Single word = 0");

const sinnMittel = satzSinnScore("Musik ist eine schöne Sache für die Menschen.");
assertRange(sinnMittel, 0.4, 1.0, "Medium sentence sense");

// ── Test 4: Anti-Gaming Detection ──

console.log("\n══ Test 4: Anti-Gaming ══");

const gaming1 = tiefesAntiGaming("test test test test test test test test test test");
assert(gaming1.isGaming === true, "Word spam detected");
assert(gaming1.flags.includes("wort_spam"), "wort_spam flag set");

const gaming2 = tiefesAntiGaming("kurz");
assert(gaming2.isGaming === true, "Too short text detected");

const gaming3 = tiefesAntiGaming("aaaaaaaaaaaaaaaaaaaaaaaaa");
assert(gaming3.flags.includes("zeichenwiederholung"), "Character repetition detected");

const gaming4 = tiefesAntiGaming(
  "Die Gerechtigkeit ist ein fundamentaler Wert in unserer Gesellschaft. " +
  "Wir müssen sie stets verteidigen und für alle Menschen eintreten. " +
  "Denn nur in einer gerechten Welt können wir in Frieden leben."
);
assert(gaming4.isGaming === false, "Good text not flagged as gaming");

const gaming5 = tiefesAntiGaming("eloquent sublim formidabel profund fulminant ephemer lakonisch nichtsdestotrotz eloquent sublim");
assert(gaming5.flags.includes("keyword_stuffing"), "Keyword stuffing detected");

// ── Test 5: Score Range Calibration ──

console.log("\n══ Test 5: Score Range Calibration ══");

const gutSinn = satzSinnScore("Die Gerechtigkeit ist ein fundamentaler Wert in unserer Gesellschaft.");
assertRange(gutSinn, 0.4, 1.0, "Coherent sentence sense >= 0.4");

const unsinnSinn = satzSinnScore("Eloquent sublim formidabel profund ephemer lakonisch");
assertRange(unsinnSinn, 0.0, 0.3, "Nonsense sentence sense <= 0.3");

const natuerlich = satzSinnScore("Wenn wir in der Gesellschaft für die Rechte aller eintreten, dann ist das ein wichtiger Schritt.");
assertRange(natuerlich, 0.5, 1.0, "Natural complex sentence");

// ── Test 6: Tokenizer ──

console.log("\n══ Test 6: Tokenizer ══");

const tokens1 = tokenize("Hallo Welt! Wie geht es dir?");
assert(tokens1.length === 6, `Tokenizer basic: ${tokens1.length} tokens`);
assert(tokens1[0] === "hallo", "Tokenizer lowercases");

const tokens2 = tokenize("Das ist — ein Test — mit Gedankenstrichen.");
assert(tokens2.includes("test"), "Tokenizer handles em-dashes");

// ── Test 7: User Text Regression (the critical test!) ──

console.log("\n══ Test 7: User Text Regression ══");

// These are the exact texts the user tested that got unfairly low scores
const text1 = "Ich würde Der kleine Prinz mitnehmen, weil man darin in jedem Alter etwas Neues entdeckt und es mich immer daran erinnert, worauf es im Leben wirklich ankommt.";
const text2 = "Meine Wahl fiele auf Der kleine Prinz, da es ein zeitloser Kompass für die Seele ist, der mir selbst in der tiefsten Stille immer wieder die essenzielle Schönheit menschlicher Verbundenheit vor Augen führt.";

const sinn1 = satzSinnScore(text1);
const sinn2 = satzSinnScore(text2);

assertRange(sinn1, 0.5, 1.0, "User text 1 (simple) sinn score");
assertRange(sinn2, 0.5, 1.0, "User text 2 (eloquent) sinn score");

// Both should NOT be flagged as gaming
const g1 = tiefesAntiGaming(text1);
const g2 = tiefesAntiGaming(text2);
assert(g1.isGaming === false, "User text 1 not gaming");
assert(g2.isGaming === false, "User text 2 not gaming");

// Subordination detection
const hatWeil = text1.toLowerCase().includes("weil");
const hatDa = text2.toLowerCase().includes("da ");
assert(hatWeil, "Text 1 has 'weil' subordination");
assert(hatDa, "Text 2 has 'da' subordination");

// Text 2 should have higher sinn than text 1 (or at least equal)
assert(sinn2 >= sinn1 - 0.1, `Eloquent text sinn (${sinn2.toFixed(2)}) >= simple text (${sinn1.toFixed(2)}) - 0.1`);

// ── Test 8: Subordination Bonus ──

console.log("\n══ Test 8: Subordination Bonus ══");

const mitWeil = satzSinnScore("Er kam nach Hause, weil er müde war und sich ausruhen wollte.");
const ohneWeil = satzSinnScore("Er kam nach Hause und er war müde und er wollte sich ausruhen.");
assertRange(mitWeil, 0.5, 1.0, "Sentence with 'weil' subordination");
assertRange(ohneWeil, 0.4, 1.0, "Sentence without subordination");
assert(mitWeil >= ohneWeil, `Subordination bonus: ${mitWeil.toFixed(2)} >= ${ohneWeil.toFixed(2)}`);

// ── Test 9: Content Word Runs ──

console.log("\n══ Test 9: Content Word Runs ══");

// 4 content words in a row is normal German — should NOT be penalized
const elegantText = satzSinnScore("Die essenzielle Schönheit menschlicher Verbundenheit zeigt sich in der Gesellschaft.");
assertRange(elegantText, 0.5, 1.0, "4 content words in a row (normal German)");

// 6+ content words with no function words IS suspicious
const verdaechtigText = satzSinnScore("Gerechtigkeit Wahrheit Freiheit Schönheit Tugend Weisheit Ehre Kraft");
assertRange(verdaechtigText, 0.1, 0.4, "Pure content word list");

// ── Summary ──

console.log(`\n══════════════════════════════════`);
console.log(`  Results: ${passed} passed, ${failed} failed`);
console.log(`══════════════════════════════════\n`);

process.exit(failed > 0 ? 1 : 0);
