import { useState, useEffect, useRef } from 'react';
import { SITUATIONEN, SITUATION_KATEGORIEN, SITUATIONEN_NACH_KATEGORIE } from '../data/situationen.js';
import { kiBewertung } from '../engine/scoring-engine.js';
import { Card } from '../components/Card.jsx';
import { Button } from '../components/Button.jsx';
import { BewertungDisplay } from '../components/BewertungDisplay.jsx';
import { AntwortEingabe } from '../components/AntwortEingabe.jsx';

export function UebungPage() {
  const [phase, setPhase] = useState("choose");
  const [kategorie, setKategorie] = useState(null);
  const [situation, setSituation] = useState(null);
  const [schwierigkeit, setSchwierigkeit] = useState("mittel");
  const [ergebnis, setErgebnis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const loadingStartRef = useRef(null);

  useEffect(() => {
    if (!loading) {
      loadingStartRef.current = null;
      setElapsed(0);
      document.title = 'ELOQUENT';
      return;
    }
    loadingStartRef.current = Date.now();
    const iv = setInterval(() => {
      const sec = Math.floor((Date.now() - loadingStartRef.current) / 1000);
      setElapsed(sec);
      document.title = `⏳ ${sec}s — Bewertung...`;
    }, 1000);
    return () => clearInterval(iv);
  }, [loading]);

  const chooseDiff = (kat) => {
    setKategorie(kat);
    setPhase("difficulty");
  };

  const start = (diff) => {
    const actualDiff = diff || ["leicht", "mittel", "schwer"][Math.floor(Math.random() * 3)];
    let pool;
    if (kategorie && SITUATIONEN_NACH_KATEGORIE?.[kategorie]) {
      pool = diff ? (SITUATIONEN_NACH_KATEGORIE[kategorie][diff] || []) : [
        ...(SITUATIONEN_NACH_KATEGORIE[kategorie].leicht || []),
        ...(SITUATIONEN_NACH_KATEGORIE[kategorie].mittel || []),
        ...(SITUATIONEN_NACH_KATEGORIE[kategorie].schwer || []),
      ];
    } else {
      pool = diff ? SITUATIONEN[diff] : [...SITUATIONEN.leicht, ...SITUATIONEN.mittel, ...SITUATIONEN.schwer];
    }
    if (pool.length === 0) pool = SITUATIONEN[actualDiff] || SITUATIONEN.mittel;
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
          <p style={{ color: "var(--text-dim)", marginBottom: 28 }}>Wähle eine Kategorie. Trainiere ohne Druck.</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: 10, maxWidth: 560, margin: "0 auto 20px" }}>
            {(SITUATION_KATEGORIEN || []).map(kat => (
              <Card key={kat.id} onClick={() => chooseDiff(kat.id)}
                style={{ cursor: "pointer", textAlign: "center", padding: "14px 10px" }}
              >
                <div style={{ fontSize: 24, marginBottom: 4 }}>{kat.emoji}</div>
                <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text)" }}>{kat.label}</div>
              </Card>
            ))}
          </div>
          <Button variant="ghost" onClick={() => chooseDiff(null)}>
            🎲 Zufällige Kategorie
          </Button>
        </div>
      )}

      {phase === "difficulty" && (
        <div className="animate-in" style={{ textAlign: "center" }}>
          <h2 className="serif" style={{ fontSize: 28, fontWeight: 900, color: "var(--green)", marginBottom: 8 }}>Schwierigkeit wählen</h2>
          {kategorie && SITUATION_KATEGORIEN && (
            <p style={{ color: "var(--text-dim)", marginBottom: 28 }}>
              {SITUATION_KATEGORIEN.find(k => k.id === kategorie)?.emoji} {SITUATION_KATEGORIEN.find(k => k.id === kategorie)?.label}
            </p>
          )}
          <div style={{ display: "grid", gap: 12, maxWidth: 360, margin: "0 auto" }}>
            {[
              { label: "🟢 Leicht", diff: "leicht", desc: "Lockere Alltagsthemen" },
              { label: "🟡 Mittel", diff: "mittel", desc: "Anspruchsvollere Aufgaben" },
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
          <div style={{ marginTop: 16 }}>
            <Button variant="ghost" onClick={() => setPhase("choose")}>← Zurück</Button>
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
            <h2 className="serif" style={{ fontSize: 24, color: "var(--gold)" }}>
              {elapsed >= 8 ? "Fällt auf Heuristik zurück..." : "KI analysiert deine Antwort..."}
            </h2>
            <p style={{ color: "var(--text-dim)", marginTop: 8 }}>
              {elapsed > 0 && <span className="mono" style={{ color: "var(--gold-dim)" }}>{elapsed}s </span>}
              {elapsed >= 8 ? "Gleich fertig" : "Bitte warten"}
              <span style={{ display: "inline-block", width: 24, textAlign: "left" }}>
                {".".repeat((elapsed % 3) + 1)}
              </span>
            </p>
          </div>
        ) : (
          <BewertungDisplay ergebnis={ergebnis} onWeiter={() => { setKategorie(null); setPhase("choose"); }} />
        )
      )}
    </div>
  );
}
