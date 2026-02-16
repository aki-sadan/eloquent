import { useState } from 'react';
import { SITUATIONEN } from '../data/situationen.js';
import { kiBewertung } from '../engine/scoring-engine.js';
import { Card } from '../components/Card.jsx';
import { BewertungDisplay } from '../components/BewertungDisplay.jsx';
import { AntwortEingabe } from '../components/AntwortEingabe.jsx';

export function UebungPage() {
  const [phase, setPhase] = useState("choose");
  const [situation, setSituation] = useState(null);
  const [schwierigkeit, setSchwierigkeit] = useState("mittel");
  const [ergebnis, setErgebnis] = useState(null);
  const [loading, setLoading] = useState(false);

  const start = (diff) => {
    const actualDiff = diff || ["leicht", "mittel", "schwer"][Math.floor(Math.random() * 3)];
    const pool = diff ? SITUATIONEN[diff] : [...SITUATIONEN.leicht, ...SITUATIONEN.mittel, ...SITUATIONEN.schwer];
    setSituation(pool[Math.floor(Math.random() * pool.length)]);
    setSchwierigkeit(actualDiff);
    setErgebnis(null);
    setPhase("write");
  };

  const submit = async (text) => {
    if (text === null) {
      setErgebnis({
        kategorien: {
          situationsbezug: { p: 0, f: "Keine Antwort abgegeben." },
          wortvielfalt: { p: 0, f: "" }, rhetorik: { p: 0, f: "" },
          wortschatz: { p: 0, f: "" }, argumentation: { p: 0, f: "" },
          kreativitaet: { p: 0, f: "" }, textstruktur: { p: 0, f: "" },
        },
        mittel: [], gehobene: [], tipps: ["Nächstes Mal unbedingt eine Antwort abgeben!"],
        empfehlungen: [], feedback: "Keine Antwort eingereicht — 0 Punkte.", gaming: false, _methode: 'skip',
      });
      setPhase("result");
      return;
    }
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
        <AntwortEingabe situation={situation} onSubmit={submit} schwierigkeit={schwierigkeit} />
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
