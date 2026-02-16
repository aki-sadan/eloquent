import { Button } from '../components/Button.jsx';

export function HeroPage({ onNavigate }) {
  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 20, position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at 50% 30%, rgba(212,168,83,0.06) 0%, transparent 60%)", pointerEvents: "none" }} />
      <div style={{ position: "absolute", top: -200, right: -200, width: 500, height: 500, borderRadius: "50%", background: "radial-gradient(circle, rgba(91,140,247,0.04), transparent)", pointerEvents: "none" }} />

      <div className="animate-slide" style={{ textAlign: "center", position: "relative", zIndex: 1 }}>
        <div style={{ fontSize: 13, letterSpacing: 6, color: "var(--gold-dim)", textTransform: "uppercase", marginBottom: 24 }} className="mono">
          ⚔️ Das Wortduell ⚔️
        </div>

        <h1 className="serif" style={{
          fontSize: "clamp(56px, 10vw, 100px)", fontWeight: 900, lineHeight: 0.95, marginBottom: 16,
          background: "linear-gradient(135deg, var(--gold-bright), var(--gold), var(--gold-dim))",
          WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
          filter: "drop-shadow(0 4px 30px rgba(212,168,83,0.2))",
        }}>
          ELOQUENT
        </h1>

        <p style={{ fontSize: 18, color: "var(--text-dim)", maxWidth: 440, margin: "0 auto 48px", lineHeight: 1.6 }}>
          Die Kunst der Sprache als Wettkampf.
          <br />
          <span style={{ color: "var(--text-muted)" }}>Tritt an. Formuliere. Überzeuge.</span>
        </p>

        <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
          <Button variant="gold" onClick={() => onNavigate("duell")} style={{ fontSize: 17, padding: "16px 40px" }}>
            ⚔️ Duell starten
          </Button>
          <Button variant="default" onClick={() => onNavigate("uebung")} style={{ fontSize: 17, padding: "16px 40px" }}>
            🎯 Übungsmodus
          </Button>
        </div>

        <div style={{ display: "flex", gap: 32, justifyContent: "center", marginTop: 48, flexWrap: "wrap" }}>
          {[
            { icon: "📚", label: "Wörterbücherei", page: "woerterbuch" },
            { icon: "🏆", label: "Rangliste", page: "rangliste" },
            { icon: "📖", label: "Story-Modus", page: "story" },
            { icon: "❓", label: "Regeln", page: "regeln" },
          ].map(item => (
            <div key={item.page} onClick={() => onNavigate(item.page)}
              style={{ cursor: "pointer", textAlign: "center", transition: "all 0.2s", opacity: 0.6 }}
              onMouseEnter={e => { e.currentTarget.style.opacity = 1; e.currentTarget.style.transform = "translateY(-2px)"; }}
              onMouseLeave={e => { e.currentTarget.style.opacity = 0.6; e.currentTarget.style.transform = "translateY(0)"; }}>
              <div style={{ fontSize: 28, marginBottom: 4 }}>{item.icon}</div>
              <div style={{ fontSize: 12, color: "var(--text-dim)", letterSpacing: 0.5 }}>{item.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
