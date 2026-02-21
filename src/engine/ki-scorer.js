// ──────────────────────────────────────────────────────
// ELOQUENT — KI-Bewertung (Ollama lokal + Groq Cloud)
// Ollama: kostenlos, lokal, kein API-Key
// Groq: kostenlos, schnell, Llama 3.3 70B
// ──────────────────────────────────────────────────────

const OLLAMA_URL = 'http://localhost:11434';
const GROQ_PROXY = '/api/groq'; // Vite proxy → api.groq.com

const SCORING_PROMPT = `Du bist ein erfahrener Germanistik-Professor mit 30 Jahren Erfahrung in Rhetorik-Bewertung. Du bewertest Spielerantworten im Eloquenz-Spiel ELOQUENT. Deine Bewertungen sind KONSISTENT, FAIR, STRENG und NACHVOLLZIEHBAR.

═══ SITUATION ═══
Titel: {titel}
Kontext: {kontext}
Beschreibung: {beschreibung}

═══ ANTWORT DES SPIELERS ═══
"{antwort}"

═══ BEWERTUNGSKATEGORIEN (100 Punkte gesamt) ═══

1. SITUATIONSBEZUG (0-15)
   Wie direkt und inhaltlich treffend bezieht sich die Antwort auf die gestellte Situation?
   • 0-3: Kein oder kaum erkennbarer Bezug zur Situation
   • 4-7: Oberflächlicher Bezug, Thema wird angeschnitten aber nicht vertieft
   • 8-11: Guter Bezug, die Antwort geht auf die Kernfrage ein
   • 12-15: Exzellenter Bezug, die Antwort durchdringt die Situation tiefgründig

2. WORTVIELFALT (0-15)
   Wie abwechslungsreich und präzise ist die Wortwahl?
   • 0-3: Viele Wiederholungen, einfache Alltagssprache
   • 4-7: Einige Variation, aber noch zu viele Wiederholungen
   • 8-11: Abwechslungsreich, gute Synonymverwendung
   • 12-15: Herausragend vielfältig, jedes Wort sitzt präzise

3. RHETORIK (0-25) — Die wichtigste Kategorie
   Welche rhetorischen Mittel werden TATSÄCHLICH eingesetzt? Zähle NUR Mittel, die du im Text mit einem EXAKTEN ZITAT nachweisen kannst.
   Erkennbare Mittel: Metapher, Vergleich ("wie"), Personifikation, Antithese, Trikolon (Dreierfigur), Chiasmus (Kreuzstellung), Klimax (Steigerung), Anapher (Wiederholung am Satzanfang), rhetorische Frage, Alliteration, Hyperbel (Übertreibung), Oxymoron, Parenthese, Ellipse.
   • 0-5: Keine oder ein einfaches Mittel
   • 6-12: 2-3 verschiedene Mittel, bewusst eingesetzt
   • 13-18: 4+ Mittel, geschickt verwoben
   • 19-25: Meisterhafte rhetorische Gestaltung mit vielen Mitteln

4. WORTSCHATZ (0-15)
   Wie gehoben und differenziert ist das sprachliche Niveau?
   • 0-3: Nur Grundwortschatz, umgangssprachlich
   • 4-7: Solider Wortschatz, vereinzelt gehobene Ausdrücke
   • 8-11: Differenziert, mehrere gehobene/seltene Wörter
   • 12-15: Exquisiter Wortschatz mit Fachbegriffen, Fremdwörtern, gehobenen Ausdrücken

5. ARGUMENTATION (0-15)
   Wie logisch und überzeugend ist die Gedankenführung?
   • 0-3: Keine erkennbare Argumentation, lose Behauptungen
   • 4-7: Grundlegende Struktur erkennbar (weil, da, daher)
   • 8-11: Klare Argumentation mit Begründungen und Schlussfolgerungen
   • 12-15: Brillante Argumentationskette, jeder Gedanke baut auf dem vorherigen auf

6. KREATIVITÄT (0-10)
   Wie originell und bildreich ist die Sprache?
   • 0-2: Vorhersagbar, keine originellen Formulierungen
   • 3-5: Einzelne kreative Wendungen
   • 6-8: Durchgehend originelle, bildhafte Sprache
   • 9-10: Außergewöhnlich kreativ, überraschende Perspektiven

7. TEXTSTRUKTUR (0-5)
   Wie kohärent und gut gegliedert ist der Text?
   • 0-1: Zusammenhanglos, keine Struktur
   • 2-3: Grundstruktur vorhanden, könnte kohärenter sein
   • 4-5: Klarer Aufbau mit Einleitung, Argumentation und Schluss

═══ KONSISTENZ-ANKER (diese Regeln sind UNVERLETZLICH) ═══
- Nur Hauptsätze + Alltagswortschatz → MAXIMAL 40 Punkte gesamt
- 1 Stilmittel + solider Wortschatz → 35-50 Punkte
- 2-3 Stilmittel + guter Wortschatz → 45-65 Punkte
- 3+ verschiedene Stilmittel + gehobener Wortschatz → 60-80 Punkte möglich
- 80+ Punkte erfordern Meisterschaft in mindestens 5 der 7 Kategorien
- 90+ Punkte sind extrem selten und erfordern nahezu Perfektion
- Prüfe IMMER: Passt die Gesamtpunktzahl zum Gesamteindruck des Textes?

═══ SITUATIONS-SPEZIFISCHE GEWICHTUNG ═══
- Formelle Situationen (Gericht, Parlament, Diplomatie, Bewerbung): Argumentation und Wortschatz besonders kritisch bewerten
- Kreative Situationen (Literarischer Salon, Poesie, Kunst): Kreativität und Rhetorik besonders wichtig
- Alltägliche Situationen (Gesellschaft, Alltag): Natürlichkeit und Situationsbezug besonders relevant
- Die Maximalpunktzahlen bleiben gleich, aber die QUALITÄTSANFORDERUNG passt sich dem Kontext an

═══ KALIBRIERUNGSBEISPIELE (mit exakten Kategorie-Scores) ═══

BEISPIEL ~15 Punkte:
"Bücher sind gut. Man kann viel lernen. Lesen ist toll."
→ situationsbezug: 3, wortvielfalt: 2, rhetorik: 0, wortschatz: 1, argumentation: 3, kreativitaet: 1, textstruktur: 1
→ Kein Stilmittel, Grundwortschatz, flache Aussagen ohne Tiefe.

BEISPIEL ~28 Punkte:
"Ich finde, Bücher sind wichtig, weil man durch sie viel lernen kann. Sie zeigen uns neue Welten und helfen uns, andere Menschen besser zu verstehen."
→ situationsbezug: 5, wortvielfalt: 4, rhetorik: 3, wortschatz: 3, argumentation: 6, kreativitaet: 2, textstruktur: 3
→ Grundlegende Argumentation (weil), keine echten Stilmittel, Alltagswortschatz.

BEISPIEL ~46 Punkte:
"Bücher sind Fenster in fremde Welten. Wer liest, der reist, ohne den Ort zu verlassen — und kehrt doch verändert zurück. Deshalb sollte jeder Mensch lesen."
→ situationsbezug: 7, wortvielfalt: 6, rhetorik: 10, wortschatz: 5, argumentation: 7, kreativitaet: 5, textstruktur: 4
→ Metapher ("Fenster in fremde Welten"), Antithese ("reist, ohne den Ort zu verlassen"), guter Aufbau.

BEISPIEL ~62 Punkte:
"Ist es nicht die Literatur, die uns lehrt, was es bedeutet, Mensch zu sein? Sie hält uns einen Spiegel vor — nicht um zu urteilen, sondern um zu verstehen. Wer den Dialog mit dem geschriebenen Wort scheut, der beraubt sich der tiefsten Form der Selbsterkenntnis."
→ situationsbezug: 10, wortvielfalt: 9, rhetorik: 15, wortschatz: 8, argumentation: 9, kreativitaet: 6, textstruktur: 4
→ Rhetorische Frage, Metapher ("Spiegel"), Antithese ("urteilen/verstehen"), gehobener Wortschatz ("Selbsterkenntnis"), Klimax.

BEISPIEL ~76 Punkte:
"Stellen wir uns vor, die Literatur sei ein zeitloser Kompass — nicht um uns den Weg zu weisen, sondern um uns die Frage zu stellen, ob wir überhaupt einen Weg gewählt haben. Denn in der Stille zwischen den Zeilen offenbart sich jene sublim Wahrheit, die kein Algorithmus zu berechnen vermag: dass der Mensch erst im Spiegel des Geschriebenen erkennt, wer er sein könnte. Nichtsdestotrotz bleibt die Lektüre ein Wagnis, da jedes Buch die Macht besitzt, unsere Überzeugungen zu erschüttern und gleichwohl unsere Resilienz zu stärken."
→ situationsbezug: 12, wortvielfalt: 11, rhetorik: 18, wortschatz: 12, argumentation: 10, kreativitaet: 7, textstruktur: 4
→ Metapher ("zeitloser Kompass", "Spiegel des Geschriebenen"), Antithese ("nicht um...sondern um"), rhetorische Frage implizit, Personifikation ("Buch besitzt die Macht"), gehobene Wörter ("sublim", "Resilienz", "nichtsdestotrotz", "gleichwohl").

BEISPIEL ~88 Punkte:
Erfordert meisterhafte Kombination aus 5+ verschiedenen rhetorischen Mitteln, exquisitem Wortschatz mit 4+ gehobenen Wörtern, brillanter Argumentationskette, origineller Kreativität und perfekter Textstruktur. Extrem selten!

═══ ANTI-GAMING ═══
- Keyword-Stuffing (wahllose gehobene Wörter ohne sinnvollen Zusammenhang) = max 10 Punkte
- Kopierte Floskeln ohne Eigenleistung = max 20 Punkte
- Grammatisch falsche Sätze reduzieren die Gesamtpunktzahl deutlich
- Spam/Gibberish/Buchstabensalat = 0 Punkte
- Text hat NICHTS mit der Situation zu tun = max 5 Punkte gesamt

═══ ANTI-HALLUZINATION (KRITISCH) ═══
- "mittel.beispiel" MUSS ein EXAKTES Copy-Paste-Zitat aus dem Text sein — Wort für Wort!
- Wenn du ein Stilmittel nicht mit einem EXAKTEN Zitat belegen kannst, zähle es NICHT
- "gehobene" darf NUR Wörter enthalten, die BUCHSTÄBLICH im Text stehen
- Erfinde KEINE Stilmittel oder gehobenen Wörter, die nicht im Text vorkommen
- Im Zweifel lieber zu wenig anerkennen als zu viel — Fairness vor Großzügigkeit

═══ WICHTIG ═══
- Qualität > Quantität: Ein perfekter Satz schlägt drei mittelmäßige
- Sei STRENG bei Rhetorik: Zähle nur Mittel, die du mit exaktem Zitat belegen kannst
- Sei FAIR bei Argumentation: Auch implizite Logik zählt
- Das Feedback pro Kategorie soll dem Spieler KONKRET helfen, sich zu verbessern
- Gib KONKRETE Verbesserungsvorschläge in den Tipps
- ALLE 7 Kategorien MÜSSEN in deiner Antwort vorhanden sein
- Punkte als ganze Zahlen oder mit maximal einer Dezimalstelle

Antworte NUR mit gültigem JSON — kein Text davor, kein Text danach:
{
  "kategorien": {
    "situationsbezug": { "p": 0, "f": "Konkretes Feedback" },
    "wortvielfalt": { "p": 0, "f": "Konkretes Feedback" },
    "rhetorik": { "p": 0, "f": "Konkretes Feedback mit Nennung gefundener Mittel" },
    "wortschatz": { "p": 0, "f": "Konkretes Feedback mit Beispielen aus dem Text" },
    "argumentation": { "p": 0, "f": "Konkretes Feedback zur Gedankenführung" },
    "kreativitaet": { "p": 0, "f": "Konkretes Feedback zu originellen Stellen" },
    "textstruktur": { "p": 0, "f": "Konkretes Feedback zum Aufbau" }
  },
  "mittel": [{ "name": "Stilmittel-Name", "beispiel": "EXAKTES Zitat aus dem Text" }],
  "gehobene": ["gehobenes_wort_1", "gehobenes_wort_2"],
  "feedback": "2-3 Sätze Gesamteinschätzung: Was war stark? Was fehlt?",
  "tipps": ["Konkreter Verbesserungstipp 1", "Konkreter Verbesserungstipp 2", "Konkreter Verbesserungstipp 3"],
  "empfehlungen": [
    { "wort": "Gehobenes Wort", "bedeutung": "Definition und Anwendungsbeispiel" },
    { "wort": "Gehobenes Wort", "bedeutung": "Definition und Anwendungsbeispiel" },
    { "wort": "Gehobenes Wort", "bedeutung": "Definition und Anwendungsbeispiel" }
  ]
}`;

function buildPrompt(situation, antwort) {
  return SCORING_PROMPT
    .replace('{titel}', situation.titel || '')
    .replace('{kontext}', situation.kontext || '')
    .replace('{beschreibung}', situation.beschreibung || '')
    .replace('{antwort}', antwort);
}

// ──────────────────────────────────────────────────────
// Ollama (local)
// ──────────────────────────────────────────────────────

let ollamaAvailable = null; // cached check
let ollamaModel = null;
let lastOllamaCheck = 0;
const OLLAMA_RECHECK_INTERVAL = 60000; // 60 seconds

export async function checkOllama() {
  try {
    const res = await fetch(`${OLLAMA_URL}/api/tags`, { signal: AbortSignal.timeout(2000) });
    if (!res.ok) return { available: false };
    const data = await res.json();
    const models = (data.models || []).map(m => m.name);

    // Prefer good German-capable models
    const preferred = [
      'llama3.3', 'llama3.1', 'llama3.2', 'llama3',
      'mistral', 'mixtral', 'gemma2', 'qwen2.5',
      'phi3', 'phi4',
    ];
    let bestModel = models[0] || null;
    for (const p of preferred) {
      const match = models.find(m => m.startsWith(p));
      if (match) { bestModel = match; break; }
    }

    ollamaAvailable = !!bestModel;
    ollamaModel = bestModel;
    lastOllamaCheck = Date.now();
    return { available: !!bestModel, model: bestModel, allModels: models };
  } catch {
    ollamaAvailable = false;
    lastOllamaCheck = Date.now();
    return { available: false };
  }
}

async function ollamaScore(situation, antwort) {
  if (ollamaAvailable === null ||
      (ollamaAvailable === false && Date.now() - lastOllamaCheck > OLLAMA_RECHECK_INTERVAL)) {
    await checkOllama();
  }
  if (!ollamaAvailable) throw new Error('Ollama nicht verfügbar');

  console.log(`[ELOQUENT KI] Ollama → ${ollamaModel}`);
  const prompt = buildPrompt(situation, antwort);

  // Kein AbortSignal.timeout — der KI so viel Zeit geben wie sie braucht
  const res = await fetch(`${OLLAMA_URL}/api/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: ollamaModel,
      messages: [
        { role: 'system', content: 'Du bist ein erfahrener Germanistik-Professor mit 30 Jahren Erfahrung in Rhetorik-Bewertung. SCORING-KALIBRIERUNG: Schwach: 10-25 | Durchschnittlich: 25-40 | Gut: 40-60 | Sehr gut: 60-75 | Exzellent: 75-90 | Meisterhaft: 90+ (extrem selten). Antworte AUSSCHLIESSLICH mit validem JSON.' },
        { role: 'user', content: prompt },
      ],
      format: 'json',
      stream: false,
      options: { temperature: 0.1, num_predict: 2048 },
    }),
  });

  if (!res.ok) throw new Error(`Ollama Fehler: ${res.status}`);
  const data = await res.json();
  const text = data.message?.content;
  if (!text) throw new Error('Ollama: Keine Antwort');

  console.log('[ELOQUENT KI] Ollama Antwort erhalten');
  return { text, provider: 'ollama', model: ollamaModel };
}

// ──────────────────────────────────────────────────────
// Groq (cloud, free tier)
// ──────────────────────────────────────────────────────

async function groqScore(apiKey, situation, antwort) {
  console.log('[ELOQUENT KI] Groq → llama-3.3-70b-versatile');
  const prompt = buildPrompt(situation, antwort);

  // Kein AbortSignal.timeout — der KI so viel Zeit geben wie sie braucht
  const res = await fetch(`${GROQ_PROXY}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'llama-3.3-70b-versatile',
      messages: [
        { role: 'system', content: 'Du bist ein erfahrener Germanistik-Professor mit 30 Jahren Erfahrung in Rhetorik-Bewertung. SCORING-KALIBRIERUNG: Schwach: 10-25 | Durchschnittlich: 25-40 | Gut: 40-60 | Sehr gut: 60-75 | Exzellent: 75-90 | Meisterhaft: 90+ (extrem selten). Antworte AUSSCHLIESSLICH mit validem JSON.' },
        { role: 'user', content: prompt },
      ],
      temperature: 0.15,
      response_format: { type: 'json_object' },
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Groq Fehler (${res.status}): ${err.slice(0, 150)}`);
  }

  const data = await res.json();
  const text = data.choices?.[0]?.message?.content;
  if (!text) throw new Error('Groq: Keine Antwort');

  console.log('[ELOQUENT KI] Groq Antwort erhalten');
  return { text, provider: 'groq', model: 'llama-3.3-70b-versatile' };
}

// ──────────────────────────────────────────────────────
// Unified AI Scoring
// ──────────────────────────────────────────────────────

function parseAiResult(rawText) {
  let result;
  try {
    result = JSON.parse(rawText);
  } catch {
    const jsonMatch = rawText.match(/```json\s*([\s\S]*?)```/) || rawText.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      result = JSON.parse(jsonMatch[1] || jsonMatch[0]);
    } else {
      throw new Error('JSON-Parsing fehlgeschlagen');
    }
  }

  if (!result.kategorien) throw new Error('Antwort hat keine "kategorien"');

  const maxMap = {
    situationsbezug: 15, wortvielfalt: 15, rhetorik: 25,
    wortschatz: 15, argumentation: 15, kreativitaet: 10, textstruktur: 5,
  };

  for (const [key, max] of Object.entries(maxMap)) {
    if (result.kategorien[key]) {
      result.kategorien[key].p = Math.max(0, Math.min(result.kategorien[key].p || 0, max));
      result.kategorien[key].f = result.kategorien[key].f || '';
    } else {
      result.kategorien[key] = { p: 0, f: '' };
    }
  }

  result.mittel = result.mittel || [];
  result.gehobene = result.gehobene || [];
  result.feedback = result.feedback || '';
  result.tipps = (result.tipps || []).slice(0, 3);
  result.empfehlungen = (result.empfehlungen || []).slice(0, 3);
  result.gaming = false;

  return result;
}

const MAX_RETRIES = 2; // Pro Provider: 1 Erstversuch + 2 Retries = 3 Versuche

async function mitRetry(fn, providerName) {
  let lastError;
  for (let versuch = 1; versuch <= MAX_RETRIES + 1; versuch++) {
    try {
      const rawResult = await fn();
      const result = parseAiResult(rawResult.text);
      result._provider = rawResult.provider;
      result._model = rawResult.model;
      result._versuch = versuch;
      return result;
    } catch (e) {
      lastError = e;
      if (versuch <= MAX_RETRIES) {
        const wartezeit = versuch * 2000; // 2s, 4s
        console.warn(`[ELOQUENT KI] ${providerName} Versuch ${versuch} fehlgeschlagen: ${e.message} — Retry in ${wartezeit / 1000}s...`);
        await new Promise(r => setTimeout(r, wartezeit));
      }
    }
  }
  throw lastError;
}

export async function aiBewerung(situation, antwort) {
  const situObj = typeof situation === 'string'
    ? { titel: '', kontext: '', beschreibung: situation }
    : situation;

  // Kaskade mit Retries: Ollama (3x) → Groq (3x) → Error
  // Heuristik wird NICHT hier aktiviert, sondern nur als allerletzter Fallback in scoring-engine.js

  if (ollamaAvailable === null ||
      (ollamaAvailable === false && Date.now() - lastOllamaCheck > OLLAMA_RECHECK_INTERVAL)) {
    await checkOllama();
  }

  // 1. Ollama mit Retries (wenn verfügbar)
  if (ollamaAvailable) {
    try {
      return await mitRetry(() => ollamaScore(situObj, antwort), 'Ollama');
    } catch (ollamaError) {
      console.warn(`[ELOQUENT KI] Ollama nach ${MAX_RETRIES + 1} Versuchen fehlgeschlagen, wechsle zu Groq:`, ollamaError.message);
    }
  }

  // 2. Groq mit Retries (wenn Key vorhanden)
  const groqKey = getGroqKey();
  if (groqKey) {
    try {
      return await mitRetry(() => groqScore(groqKey, situObj, antwort), 'Groq');
    } catch (groqError) {
      console.error(`[ELOQUENT KI] Groq nach ${MAX_RETRIES + 1} Versuchen fehlgeschlagen:`, groqError.message);
      throw new Error(`Alle KI-Provider fehlgeschlagen nach Retries (Ollama + Groq): ${groqError.message}`);
    }
  }

  // Kein Provider verfügbar
  throw new Error('Kein KI-Provider verfügbar (Ollama offline, kein Groq-Key)');
}

// ──────────────────────────────────────────────────────
// Provider Management
// ──────────────────────────────────────────────────────

export function getGroqKey() {
  return localStorage.getItem('eloquent_groq_key') || '';
}

export function setGroqKey(key) {
  if (key) {
    localStorage.setItem('eloquent_groq_key', key.trim());
  } else {
    localStorage.removeItem('eloquent_groq_key');
  }
}

export function hasAiProvider() {
  return ollamaAvailable || !!getGroqKey();
}

export function getAiStatus() {
  return {
    ollama: ollamaAvailable,
    ollamaModel,
    groq: !!getGroqKey(),
  };
}

// Remove old Gemini key if exists
export function migrateFromGemini() {
  const oldKey = localStorage.getItem('eloquent_gemini_key');
  if (oldKey) {
    localStorage.removeItem('eloquent_gemini_key');
  }
}
