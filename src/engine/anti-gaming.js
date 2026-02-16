import { GEHOBENE_WOERTER } from '../data/woerterbuch.js';
import { FUNKTIONS_WOERTER } from '../data/deutsche-nlp-data.js';
import { tokenize, satzSinnScore } from './heuristic-scorer.js';

// ──────────────────────────────────────────────────────
// Deep Anti-Gaming Detection
// ──────────────────────────────────────────────────────

export function tiefesAntiGaming(text) {
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
