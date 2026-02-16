import { Card } from '../components/Card.jsx';

export function RegelnPage() {
  return (
    <div style={{ padding: "32px 24px", maxWidth: 680, margin: "0 auto" }}>
      <div className="animate-in" style={{ textAlign: "center", marginBottom: 32 }}>
        <h1 className="serif" style={{ fontSize: 32, fontWeight: 900, color: "var(--gold)" }}>❓ Spielregeln</h1>
      </div>
      {[
        { title: "⚔️ Duell-Modus", items: ["Zwei Spieler treten in 3 Runden an", "Jede Runde eine Situation mit steigender Schwierigkeit", "Die KI bewertet beide Antworten nach 7 Kriterien", "Der eloquentere Spieler gewinnt Pokale"] },
        { title: "📊 Bewertungskriterien", items: ["Situationsbezug (15 Pkt) — Passt die Antwort?", "Wortvielfalt (15 Pkt) — Abwechslung statt Wiederholungen", "Rhetorik (25 Pkt) — Metaphern, Fragen, Antithesen...", "Wortschatz (15 Pkt) — Gehobene Ausdrücke", "Argumentation (15 Pkt) — Logischer Aufbau", "Kreativität (10 Pkt) — Originelle Gedanken", "Textstruktur (5 Pkt) — Kohärenz & Bindewörter"] },
        { title: "💡 Tipps", items: ["Vergleiche: 'wie ein Leuchtturm in stürmischer Nacht'", "Rhetorische Fragen: 'Ist es nicht so, dass...?'", "Trikolon: 'Freiheit, Gleichheit, Brüderlichkeit'", "Antithesen: 'Nicht nur..., sondern auch...'", "Gehobene Wörter: 'nichtsdestotrotz', 'eloquent', 'sublim'", "Variiere deine Satzlänge!"] },
      ].map(section => (
        <Card key={section.title} style={{ marginBottom: 16 }}>
          <h2 className="serif" style={{ fontSize: 20, fontWeight: 700, marginBottom: 12 }}>{section.title}</h2>
          {section.items.map((item, i) => (
            <div key={i} style={{ fontSize: 14, color: "var(--text-dim)", padding: "6px 0 6px 16px", borderLeft: "2px solid var(--border)", marginBottom: 4, lineHeight: 1.5 }}>{item}</div>
          ))}
        </Card>
      ))}
    </div>
  );
}
