import { useState, useEffect } from 'react';
import { hasAiProvider, checkOllama, getAiStatus } from '../engine/ki-scorer.js';
import { EinstellungenModal } from './EinstellungenModal.jsx';

export function NavBar({ current, onNavigate }) {
  const [showSettings, setShowSettings] = useState(false);
  const [aiActive, setAiActive] = useState(false);

  useEffect(() => {
    // Check for Ollama on mount
    checkOllama().then(() => {
      setAiActive(hasAiProvider());
    });
  }, []);

  const refreshAiStatus = () => {
    setAiActive(hasAiProvider());
  };

  return (
    <>
      <nav style={{
        position: "sticky", top: 0, zIndex: 100, backdropFilter: "blur(20px)",
        background: "rgba(10,11,15,0.85)", borderBottom: "1px solid var(--border)",
        padding: "0 24px", display: "flex", alignItems: "center", height: 56,
      }}>
        <span className="serif" style={{ fontWeight: 700, fontSize: 20, color: "var(--gold)", cursor: "pointer", marginRight: 32 }}
          onClick={() => onNavigate("home")}>ELOQUENT</span>
        {[
          { id: "duell", label: "Duell" },
          { id: "uebung", label: "Übung" },
          { id: "woerterbuch", label: "Wörter" },
          { id: "rangliste", label: "Rangliste" },
        ].map(n => (
          <span key={n.id} onClick={() => onNavigate(n.id)} style={{
            padding: "8px 16px", fontSize: 13, cursor: "pointer", borderRadius: 6,
            color: current === n.id ? "var(--gold)" : "var(--text-dim)",
            background: current === n.id ? "var(--gold)11" : "transparent",
            transition: "all 0.2s", fontWeight: current === n.id ? 600 : 400,
          }}>{n.label}</span>
        ))}

        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 8 }}>
          {aiActive && (
            <span style={{
              fontSize: 11, padding: '3px 8px', borderRadius: 4,
              background: 'rgba(46,204,113,0.15)', color: '#2ecc71',
              fontWeight: 600, letterSpacing: 0.5,
            }}>KI</span>
          )}
          <span
            onClick={() => setShowSettings(true)}
            style={{
              cursor: 'pointer', fontSize: 18, padding: '4px 8px', borderRadius: 6,
              color: 'var(--text-dim)', transition: 'color 0.2s',
            }}
            title="Einstellungen"
          >
            &#9881;
          </span>
        </div>
      </nav>
      {showSettings && <EinstellungenModal onClose={() => { setShowSettings(false); refreshAiStatus(); }} />}
    </>
  );
}
