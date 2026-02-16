import { getRang } from '../data/raenge.js';
import { Card } from '../components/Card.jsx';

export function RanglistePage() {
  const demo = [
    { name: "Aurelius", pokale: 2340, siege: 42, gespielt: 55 },
    { name: "Cicero", pokale: 1850, siege: 35, gespielt: 48 },
    { name: "Valeria", pokale: 1200, siege: 28, gespielt: 40 },
    { name: "Ernat", pokale: 13, siege: 1, gespielt: 1 },
    { name: "Sadan", pokale: 5, siege: 0, gespielt: 1 },
  ];
  const medals = ["🥇", "🥈", "🥉"];

  return (
    <div style={{ padding: "32px 24px", maxWidth: 700, margin: "0 auto" }}>
      <div className="animate-in" style={{ textAlign: "center", marginBottom: 32 }}>
        <h1 className="serif" style={{ fontSize: 32, fontWeight: 900, color: "var(--gold)" }}>🏆 Rangliste</h1>
        <p style={{ color: "var(--text-dim)", marginTop: 4 }}>Die eloquentesten Redner</p>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {demo.map((sp, i) => {
          const rang = getRang(sp.pokale);
          const quote = sp.gespielt > 0 ? Math.round(sp.siege / sp.gespielt * 100) : 0;
          return (
            <Card key={sp.name} style={{ animation: `textReveal 0.4s ease-out ${i * 0.08}s both`, padding: 16 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                <div style={{ fontSize: 24, width: 36, textAlign: "center" }}>{medals[i] || `${i + 1}.`}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span className="serif" style={{ fontWeight: 700, fontSize: 17, color: i === 0 ? "var(--gold-bright)" : "var(--text)" }}>{sp.name}</span>
                    <span style={{ fontSize: 13 }}>{rang.symbol} {rang.name}</span>
                  </div>
                  <div style={{ display: "flex", gap: 16, marginTop: 4 }}>
                    <span style={{ fontSize: 12, color: "var(--text-muted)" }}>{sp.siege}W / {sp.gespielt - sp.siege}L</span>
                    <span style={{ fontSize: 12, color: "var(--text-muted)" }}>{quote}% Quote</span>
                  </div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div className="mono" style={{ fontWeight: 700, fontSize: 18, color: "var(--gold)" }}>{sp.pokale}</div>
                  <div style={{ fontSize: 10, color: "var(--text-muted)" }}>Pokale</div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
