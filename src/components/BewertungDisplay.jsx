import { getNote } from '../data/raenge.js';
import { GoldBar } from './GoldBar.jsx';
import { Card } from './Card.jsx';
import { Badge } from './Badge.jsx';
import { Button } from './Button.jsx';

export function BewertungDisplay({ ergebnis, spielerName, onWeiter }) {
  if (!ergebnis) return null;
  const kat = ergebnis.kategorien || {};
  const maxMap = { situationsbezug: 15, wortvielfalt: 15, rhetorik: 25, wortschatz: 15, argumentation: 15, kreativitaet: 10, textstruktur: 5 };
  const labelMap = { situationsbezug: "Situationsbezug", wortvielfalt: "Wortvielfalt", rhetorik: "Rhetorik", wortschatz: "Wortschatz", argumentation: "Argumentation", kreativitaet: "Kreativität", textstruktur: "Textstruktur" };
  const gesamt = Object.entries(kat).reduce((s, [k, v]) => s + Math.min(v.p || 0, maxMap[k] || 0), 0);
  const { note, emoji } = getNote(gesamt);

  return (
    <div className="animate-in" style={{ maxWidth: 640, margin: "0 auto" }}>
      <Card glow>
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          {spielerName && <div style={{ fontSize: 13, color: "var(--text-dim)", marginBottom: 8 }}>Bewertung für</div>}
          {spielerName && <div className="serif" style={{ fontSize: 22, fontWeight: 700, color: "var(--gold)" }}>{spielerName}</div>}
          <div style={{ fontSize: 56, fontWeight: 900, color: "var(--gold-bright)", marginTop: 8, animation: "countUp 0.6s ease-out" }} className="mono">
            {gesamt.toFixed(1)}
          </div>
          <div style={{ fontSize: 12, color: "var(--text-muted)" }}>von 100 Punkten</div>
          <Badge color={gesamt >= 65 ? "var(--green)" : gesamt >= 40 ? "var(--gold)" : "var(--red)"}>{emoji} {note}</Badge>

          {/* Method indicator */}
          <div style={{ marginTop: 8 }}>
            {ergebnis._methode === 'ki' ? (
              <span style={{
                fontSize: 11, padding: '3px 10px', borderRadius: 4,
                background: 'rgba(46,204,113,0.15)', color: '#2ecc71',
                fontWeight: 600, letterSpacing: 0.5,
              }}>KI-Bewertung {ergebnis._provider ? `(${ergebnis._provider}` : ''}{ergebnis._model ? ` / ${ergebnis._model})` : ergebnis._provider ? ')' : ''}{ergebnis._duration ? ` · ${ergebnis._duration}s` : ''}</span>
            ) : (
              <span style={{
                fontSize: 11, padding: '3px 10px', borderRadius: 4,
                background: 'rgba(255,193,7,0.15)', color: '#f1c40f',
                fontWeight: 600, letterSpacing: 0.5,
              }}>Heuristik-Bewertung{ergebnis._duration ? ` · ${ergebnis._duration}s` : ''}</span>
            )}
          </div>

          {/* KI error warning */}
          {ergebnis._kiError && (
            <div style={{
              marginTop: 8, fontSize: 11, padding: '6px 12px', borderRadius: 6,
              background: 'rgba(231,76,60,0.1)', color: '#e74c3c',
              border: '1px solid rgba(231,76,60,0.2)',
            }}>
              KI-Fehler: {ergebnis._kiError.slice(0, 120)}
              {ergebnis._kiError.length > 120 ? '...' : ''}
            </div>
          )}
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 14, marginBottom: 24 }}>
          {Object.entries(kat).map(([key, val], i) => (
            <div key={key}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                <span style={{ fontSize: 13, color: "var(--text-dim)" }}>{labelMap[key] || key}</span>
                <span className="mono" style={{ fontSize: 13, color: "var(--text)" }}>{(val.p || 0).toFixed(1)}/{maxMap[key]}</span>
              </div>
              <GoldBar value={val.p || 0} max={maxMap[key]} delay={i * 0.1} />
              {val.f && <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 2 }}>{val.f}</div>}
            </div>
          ))}
        </div>

        {ergebnis.mittel?.length > 0 && (
          <div style={{ marginBottom: 20 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: "var(--accent)", marginBottom: 8 }}>✦ Erkannte rhetorische Mittel</div>
            {ergebnis.mittel.map((m, i) => (
              <div key={i} style={{ padding: "8px 12px", background: "var(--bg-deep)", borderRadius: 8, marginBottom: 6, borderLeft: "3px solid var(--accent)" }}>
                <span style={{ fontWeight: 600, fontSize: 13 }}>{m.name}</span>
                <div style={{ fontSize: 12, color: "var(--text-dim)", fontStyle: "italic" }}>„{m.beispiel}"</div>
              </div>
            ))}
          </div>
        )}

        {ergebnis.gehobene?.length > 0 && (
          <div style={{ marginBottom: 20 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: "var(--gold)", marginBottom: 8 }}>📖 Gehobene Wörter verwendet</div>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              {ergebnis.gehobene.map((w, i) => <Badge key={i}>{w}</Badge>)}
            </div>
          </div>
        )}

        {ergebnis.feedback && (
          <div style={{ padding: 16, background: "var(--bg-deep)", borderRadius: 10, marginBottom: 16 }}>
            <div style={{ fontSize: 14, lineHeight: 1.6, color: "var(--text-dim)" }}>{ergebnis.feedback}</div>
          </div>
        )}

        {ergebnis.tipps?.length > 0 && (
          <div style={{ marginBottom: 20 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: "var(--green)", marginBottom: 8 }}>💡 Verbesserungsvorschläge</div>
            {ergebnis.tipps.map((t, i) => (
              <div key={i} style={{ fontSize: 13, color: "var(--text-dim)", padding: "4px 0", paddingLeft: 16, borderLeft: "2px solid var(--green)33", marginBottom: 4 }}>{t}</div>
            ))}
          </div>
        )}

        {ergebnis.empfehlungen?.length > 0 && (
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: "var(--gold-dim)", marginBottom: 8 }}>📚 Probier diese Wörter nächstes Mal</div>
            {ergebnis.empfehlungen.map((e, i) => (
              <div key={i} style={{ padding: "8px 12px", background: "var(--bg-deep)", borderRadius: 8, marginBottom: 6 }}>
                <span className="serif" style={{ fontWeight: 700, color: "var(--gold)" }}>{e.wort}</span>
                <span style={{ fontSize: 12, color: "var(--text-dim)", marginLeft: 8 }}>{e.bedeutung}</span>
              </div>
            ))}
          </div>
        )}

        {onWeiter && (
          <div style={{ textAlign: "center", marginTop: 8 }}>
            <Button variant="gold" onClick={onWeiter}>Weiter →</Button>
          </div>
        )}
      </Card>
    </div>
  );
}
