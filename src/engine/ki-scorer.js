// ──────────────────────────────────────────────────────
// ELOQUENT — KI-Bewertung (Ollama lokal + Groq Cloud)
// Ollama: kostenlos, lokal, kein API-Key
// Groq: kostenlos, schnell, Llama 3.3 70B
// ──────────────────────────────────────────────────────

const OLLAMA_URL = 'http://localhost:11434';
const GROQ_PROXY = '/api/groq'; // Vite proxy → api.groq.com

const SCORING_PROMPT = `Du bist ein erfahrener Germanistik-Professor und Rhetorik-Experte. Du bewertest Spielerantworten in einem Eloquenz-Spiel. Deine Bewertungen sind KONSISTENT, FAIR und NACHVOLLZIEHBAR.

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
   Welche rhetorischen Mittel werden TATSÄCHLICH eingesetzt? Zähle NUR Mittel, die du im Text konkret nachweisen kannst.
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

═══ KALIBRIERUNGSBEISPIELE ═══

BEISPIEL 20-30 Punkte: "Ich finde Bücher gut weil man viel lernen kann und sie sind auch spannend."
→ Kein Stilmittel, kein gehobener Wortschatz, flache Argumentation.

BEISPIEL 40-55 Punkte: "Bücher sind Fenster in fremde Welten. Wer liest, der reist, ohne den Ort zu verlassen — und kehrt doch verändert zurück."
→ Metapher (Fenster), Antithese (reist/ohne Ort), guter Wortschatz, klare Struktur.

BEISPIEL 60-75 Punkte: "Ist es nicht die Literatur, die uns lehrt, was es bedeutet, Mensch zu sein? Sie hält uns einen Spiegel vor — nicht um zu urteilen, sondern um zu verstehen. Wer den Dialog mit dem geschriebenen Wort scheut, der beraubt sich der tiefsten Form der Selbsterkenntnis."
→ Rhetorische Frage, Metapher (Spiegel), Antithese (urteilen/verstehen), Klimax, gehobener Wortschatz (Selbsterkenntnis), starke Argumentation.

BEISPIEL 80-95 Punkte: Erfordert meisterhafte Kombination aus 5+ verschiedenen rhetorischen Mitteln, exquisitem Wortschatz, brillanter Argumentation und origineller Kreativität. Sehr selten!

═══ ANTI-GAMING ═══
- Keyword-Stuffing (wahllose gehobene Wörter ohne Zusammenhang) = max 10 Punkte
- Kopierte Floskeln ohne Eigenleistung = max 20 Punkte
- Grammatisch falsche Sätze reduzieren die Gesamtpunktzahl
- Spam/Gibberish = 0 Punkte

═══ WICHTIG ═══
- Qualität > Quantität: Ein perfekter Satz schlägt drei mittelmäßige
- Sei STRENG bei Rhetorik: Zähle nur Mittel, die du mit Zitat belegen kannst
- Sei FAIR bei Argumentation: Auch implizite Logik zählt
- Das Feedback pro Kategorie soll dem Spieler KONKRET helfen, sich zu verbessern
- Gib KONKRETE Verbesserungsvorschläge in den Tipps

Antworte NUR mit gültigem JSON in genau diesem Format:
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
  "mittel": [{ "name": "Stilmittel-Name", "beispiel": "Exaktes Zitat aus dem Text" }],
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
    return { available: !!bestModel, model: bestModel, allModels: models };
  } catch {
    ollamaAvailable = false;
    return { available: false };
  }
}

async function ollamaScore(situation, antwort) {
  if (ollamaAvailable === null) await checkOllama();
  if (!ollamaAvailable) throw new Error('Ollama nicht verfügbar');

  console.log(`[ELOQUENT KI] Ollama → ${ollamaModel}`);
  const prompt = buildPrompt(situation, antwort);

  const res = await fetch(`${OLLAMA_URL}/api/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: ollamaModel,
      messages: [
        { role: 'system', content: 'Du bist ein strenger Germanistik-Professor. Du bewertest Texte fair und konsistent nach klaren Kriterien. Durchschnittliche Texte erhalten 30-50 Punkte, gute Texte 50-70, exzellente 70-90. Antworte ausschließlich mit validem JSON.' },
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

  const res = await fetch(`${GROQ_PROXY}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'llama-3.3-70b-versatile',
      messages: [
        { role: 'system', content: 'Du bist ein strenger Germanistik-Professor. Du bewertest Texte fair und konsistent nach klaren Kriterien. Durchschnittliche Texte erhalten 30-50 Punkte, gute Texte 50-70, exzellente 70-90. Antworte ausschließlich mit validem JSON.' },
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

export async function aiBewerung(situation, antwort) {
  const situObj = typeof situation === 'string'
    ? { titel: '', kontext: '', beschreibung: situation }
    : situation;

  let rawResult = null;
  let errors = [];

  // 1. Try Ollama (local, no API key needed)
  try {
    rawResult = await ollamaScore(situObj, antwort);
  } catch (e) {
    errors.push(`Ollama: ${e.message}`);
  }

  // 2. Try Groq (cloud, needs API key)
  if (!rawResult) {
    const groqKey = getGroqKey();
    if (groqKey) {
      try {
        rawResult = await groqScore(groqKey, situObj, antwort);
      } catch (e) {
        errors.push(`Groq: ${e.message}`);
      }
    }
  }

  if (!rawResult) {
    throw new Error(errors.join(' | ') || 'Kein KI-Provider verfügbar');
  }

  const result = parseAiResult(rawResult.text);
  result._provider = rawResult.provider;
  result._model = rawResult.model;
  return result;
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
