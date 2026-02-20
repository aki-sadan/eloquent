import { useState, useRef } from 'react';
import { SITUATIONEN, SITUATION_KATEGORIEN, SITUATIONEN_NACH_KATEGORIE } from '../data/situationen.js';
import { kiBewertung } from '../engine/scoring-engine.js';
import { Button } from '../components/Button.jsx';
import { Card } from '../components/Card.jsx';
import { Badge } from '../components/Badge.jsx';
import { BewertungDisplay } from '../components/BewertungDisplay.jsx';
import { AntwortEingabe } from '../components/AntwortEingabe.jsx';

export function DuellPage({ onNavigate }) {
  const [phase, setPhase] = useState("setup");
  const [s1, setS1] = useState("");
  const [s2, setS2] = useState("");
  const [kategorie, setKategorie] = useState(null); // null = Zufall
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
    let pool;
    if (kategorie && SITUATIONEN_NACH_KATEGORIE?.[kategorie]?.[diff]) {
      pool = SITUATIONEN_NACH_KATEGORIE[kategorie][diff];
    } else {
      pool = SITUATIONEN[diff];
    }
    const ungespielte = pool.filter(s => !gespielteRef.current.has(s.titel));
    const chosen = ungespielte.length > 0
      ? ungespielte[Math.floor(Math.random() * ungespielte.length)]
      : pool[Math.floor(Math.random() * pool.length)];
    gespielteRef.current.add(chosen.titel);
    return chosen;
  };

  const goToCategory = () => {
    if (!s1.trim() || !s2.trim()) return;
    if (s1.trim().toLowerCase() === s2.trim().toLowerCase()) return;
    setPhase("category");
  };

  const startDuell = (kat) => {
    setKategorie(kat);
    gespielteRef.current = new Set();
    setRunde(1);
    setScores({ s1: 0, s2: 0, r1: 0, r2: 0 });
    setHistory([]);
    // Need to compute situation after setting kategorie — use kat directly
    const diff = "leicht";
    let pool;
    if (kat && SITUATIONEN_NACH_KATEGORIE?.[kat]?.[diff]) {
      pool = SITUATIONEN_NACH_KATEGORIE[kat][diff];
    } else {
      pool = SITUATIONEN[diff];
    }
    const chosen = pool[Math.floor(Math.random() * pool.length)];
    gespielteRef.current.add(chosen.titel);
    setSituation(chosen);
    setPhase("s1_write");
  };

  const SKIP_ERGEBNIS = {
    kategorien: {
      situationsbezug: { p: 0, f: "Keine Antwort abgegeben." },
      wortvielfalt: { p: 0, f: "" }, rhetorik: { p: 0, f: "" },
      wortschatz: { p: 0, f: "" }, argumentation: { p: 0, f: "" },
      kreativitaet: { p: 0, f: "" }, textstruktur: { p: 0, f: "" },
    },
    mittel: [], gehobene: [], tipps: ["Nächstes Mal unbedingt eine Antwort abgeben!"],
    empfehlungen: [], feedback: "Keine Antwort eingereicht — 0 Punkte.", gaming: false, _methode: 'skip',
  };

  const handleS1Submit = (text) => {
    setErgebnis1(text === null ? { text: null, skipped: true } : { text });
    setPhase("s1_pass");
    window.scrollTo(0, 0);
  };

  const handleS2Submit = async (text) => {
    setLoading(true);
    setPhase("result");
    const s1Skipped = ergebnis1.skipped;
    const s2Skipped = text === null;
    const [r1, r2] = await Promise.all([
      s1Skipped ? SKIP_ERGEBNIS : kiBewertung(situation, ergebnis1.text),
      s2Skipped ? SKIP_ERGEBNIS : kiBewertung(situation, text),
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
              <Button variant="gold" onClick={goToCategory} disabled={!s1.trim() || !s2.trim() || s1.trim().toLowerCase() === s2.trim().toLowerCase()}>
                Weiter zur Kategorie →
              </Button>
            </div>
          </Card>
        </div>
      )}

      {phase === "category" && (
        <div className="animate-in">
          <div style={{ textAlign: "center", marginBottom: 28 }}>
            <h2 className="serif" style={{ fontSize: 28, fontWeight: 900, color: "var(--gold)" }}>Kategorie wählen</h2>
            <p style={{ color: "var(--text-dim)", marginTop: 8 }}>{s1} vs {s2} — In welchem Feld messt ihr euch?</p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 12, marginBottom: 20 }}>
            {(SITUATION_KATEGORIEN || []).map(kat => (
              <Card key={kat.id} onClick={() => startDuell(kat.id)}
                style={{ cursor: "pointer", textAlign: "center", padding: "16px 12px", transition: "border-color 0.2s" }}
              >
                <div style={{ fontSize: 28, marginBottom: 6 }}>{kat.emoji}</div>
                <div style={{ fontSize: 14, fontWeight: 600, color: "var(--text)" }}>{kat.label}</div>
              </Card>
            ))}
          </div>
          <div style={{ textAlign: "center" }}>
            <Button variant="gold" onClick={() => startDuell(null)}>
              🎲 Zufällige Kategorie
            </Button>
          </div>
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
          <AntwortEingabe situation={situation} spielerName={s1} onSubmit={handleS1Submit} schwierigkeit={runde <= 1 ? "leicht" : runde <= 2 ? "mittel" : "schwer"} />
        </div>
      )}

      {phase === "s1_pass" && (
        <div className="animate-in" style={{ textAlign: "center", padding: "80px 20px" }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>🔄</div>
          <h2 className="serif" style={{ fontSize: 28, color: "var(--text)", marginBottom: 12 }}>Gerät weitergeben</h2>
          <p style={{ color: "var(--text-dim)", marginBottom: 32 }}>Bitte an <strong style={{ color: "var(--accent)" }}>{s2}</strong> übergeben.</p>
          <Button variant="accent" onClick={() => { setPhase("s2_write"); window.scrollTo(0, 0); }}>
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
          <AntwortEingabe situation={situation} spielerName={s2} onSubmit={handleS2Submit} schwierigkeit={runde <= 1 ? "leicht" : runde <= 2 ? "mittel" : "schwer"} />
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
