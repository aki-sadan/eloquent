import { useState } from 'react';
import { WOERTERBUCH } from '../data/woerterbuch.js';
import { Card } from '../components/Card.jsx';
import { Badge } from '../components/Badge.jsx';

export function WoerterbuchPage() {
  const [filter, setFilter] = useState("Alle");
  const [search, setSearch] = useState("");
  const [expanded, setExpanded] = useState(null);
  const cats = ["Alle", "Rhetorik", "Philosophie", "Emotion", "Wissenschaft", "Alltag"];

  const filtered = WOERTERBUCH.filter(w => {
    if (filter !== "Alle" && w.kategorie !== filter) return false;
    if (search && !w.wort.toLowerCase().includes(search.toLowerCase()) && !w.definition.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const dayIdx = new Date().getDate() % WOERTERBUCH.length;
  const wdt = WOERTERBUCH[dayIdx];

  return (
    <div style={{ padding: "32px 24px", maxWidth: 800, margin: "0 auto" }}>
      <div className="animate-in" style={{ textAlign: "center", marginBottom: 32 }}>
        <h1 className="serif" style={{ fontSize: 32, fontWeight: 900, color: "var(--gold)" }}>📚 Wörterbücherei</h1>
        <p style={{ color: "var(--text-dim)", marginTop: 4 }}>Dein Werkzeugkasten der Eloquenz</p>
      </div>

      <Card glow style={{ marginBottom: 24, background: "linear-gradient(135deg, var(--bg-card), var(--bg-elevated))" }}>
        <div style={{ fontSize: 11, letterSpacing: 3, color: "var(--gold-dim)", textTransform: "uppercase", marginBottom: 8 }}>Wort des Tages</div>
        <div className="serif" style={{ fontSize: 28, fontWeight: 900, color: "var(--gold-bright)" }}>{wdt.wort}</div>
        <div style={{ fontSize: 14, color: "var(--text-dim)", marginTop: 4, lineHeight: 1.6 }}>{wdt.definition}</div>
        <div style={{ fontSize: 13, color: "var(--text-muted)", marginTop: 8, fontStyle: "italic", borderLeft: "2px solid var(--gold-dim)", paddingLeft: 12 }}>
          „{wdt.beispiel}"
        </div>
      </Card>

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
