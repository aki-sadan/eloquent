import { useState, useEffect } from 'react';
import { checkOllama, getGroqKey, setGroqKey, getAiStatus, migrateFromGemini } from '../engine/ki-scorer.js';

export function EinstellungenModal({ onClose }) {
  const [groqKey, setGroqKeyState] = useState('');
  const [saved, setSaved] = useState(false);
  const [ollamaStatus, setOllamaStatus] = useState(null); // null=checking, object=result
  const [testingGroq, setTestingGroq] = useState(false);
  const [groqResult, setGroqResult] = useState(null);

  useEffect(() => {
    // Migrate from old Gemini key
    migrateFromGemini();
    // Load existing Groq key
    const existing = getGroqKey();
    if (existing) setGroqKeyState(existing);
    // Check Ollama
    checkOllama().then(result => setOllamaStatus(result));
  }, []);

  const handleSaveGroq = () => {
    setGroqKey(groqKey);
    setSaved(true);
    setGroqResult(null);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleRemoveGroq = () => {
    setGroqKey('');
    setGroqKeyState('');
    setGroqResult(null);
  };

  const handleTestGroq = async () => {
    if (!groqKey) return;
    setTestingGroq(true);
    setGroqResult(null);
    try {
      const res = await fetch('/api/groq/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${groqKey.trim()}`,
        },
        body: JSON.stringify({
          model: 'llama-3.3-70b-versatile',
          messages: [{ role: 'user', content: 'Antworte nur mit: OK' }],
          max_tokens: 5,
        }),
      });
      if (res.ok) {
        setGroqResult({ ok: true, msg: 'Groq API funktioniert! (Llama 3.3 70B)' });
      } else {
        const err = await res.json().catch(() => ({}));
        setGroqResult({ ok: false, msg: err.error?.message || `Fehler ${res.status}` });
      }
    } catch (e) {
      setGroqResult({ ok: false, msg: e.message });
    }
    setTestingGroq(false);
  };

  const handleRefreshOllama = async () => {
    setOllamaStatus(null);
    const result = await checkOllama();
    setOllamaStatus(result);
  };

  const aiStatus = getAiStatus();
  const hasAny = ollamaStatus?.available || !!groqKey;

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 1000, display: 'flex',
      alignItems: 'center', justifyContent: 'center',
      background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)',
    }} onClick={onClose}>
      <div onClick={e => e.stopPropagation()} style={{
        background: 'var(--bg-card)', border: '1px solid var(--border)',
        borderRadius: 16, padding: 32, maxWidth: 560, width: '90%',
        boxShadow: '0 24px 48px rgba(0,0,0,0.4)', maxHeight: '90vh', overflowY: 'auto',
      }}>
        <h2 className="serif" style={{ color: 'var(--gold)', marginBottom: 8, fontSize: 24 }}>
          Einstellungen
        </h2>

        {/* Status Banner */}
        <div style={{
          background: hasAny ? 'rgba(46,204,113,0.1)' : 'rgba(255,193,7,0.1)',
          border: `1px solid ${hasAny ? 'rgba(46,204,113,0.3)' : 'rgba(255,193,7,0.3)'}`,
          borderRadius: 8, padding: '10px 14px', marginBottom: 20, fontSize: 13,
          color: hasAny ? '#2ecc71' : '#f1c40f',
        }}>
          {hasAny
            ? 'KI-Bewertung aktiv — Texte werden mit echtem Sprachverständnis bewertet.'
            : 'Heuristik-Modus — Bewertung basiert auf Regeln. Für bessere Ergebnisse: KI aktivieren (siehe unten).'}
        </div>

        {/* ── Ollama Section ── */}
        <div style={{ marginBottom: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text)', margin: 0 }}>
              Option 1: Ollama (Lokal)
            </h3>
            <span style={{
              fontSize: 10, padding: '2px 6px', borderRadius: 3,
              background: 'rgba(46,204,113,0.15)', color: '#2ecc71', fontWeight: 600,
            }}>EMPFOHLEN</span>
          </div>
          <p style={{ fontSize: 12, color: 'var(--text-dim)', marginBottom: 10, lineHeight: 1.5 }}>
            Ollama läuft lokal auf deinem Mac — kostenlos, privat, kein API-Key nötig.
          </p>

          <div style={{
            padding: '10px 14px', borderRadius: 8, fontSize: 13,
            background: ollamaStatus === null ? 'rgba(255,255,255,0.03)' :
              ollamaStatus.available ? 'rgba(46,204,113,0.1)' : 'rgba(255,255,255,0.03)',
            border: `1px solid ${ollamaStatus?.available ? 'rgba(46,204,113,0.3)' : 'var(--border)'}`,
            color: ollamaStatus?.available ? '#2ecc71' : 'var(--text-dim)',
          }}>
            {ollamaStatus === null ? (
              'Suche Ollama...'
            ) : ollamaStatus.available ? (
              <>Ollama aktiv! Modell: <strong>{ollamaStatus.model}</strong></>
            ) : (
              <>
                Ollama nicht gefunden.
                <button onClick={handleRefreshOllama} style={{
                  marginLeft: 8, padding: '2px 8px', borderRadius: 4, fontSize: 11,
                  cursor: 'pointer', background: 'transparent', color: 'var(--gold)',
                  border: '1px solid var(--gold)33',
                }}>Erneut prüfen</button>
              </>
            )}
          </div>

          {!ollamaStatus?.available && (
            <div style={{
              marginTop: 10, padding: '12px 14px', borderRadius: 8,
              background: 'rgba(255,255,255,0.03)', fontSize: 12, lineHeight: 1.6,
              color: 'var(--text-dim)',
            }}>
              <strong style={{ color: 'var(--text)' }}>So installierst du Ollama:</strong>
              <ol style={{ margin: '6px 0 0 20px', padding: 0 }}>
                <li>Gehe zu <a href="https://ollama.com" target="_blank" rel="noopener"
                  style={{ color: 'var(--gold)', textDecoration: 'underline' }}>ollama.com</a> und installiere die App</li>
                <li>Öffne Terminal und führe aus: <code style={{ background: 'var(--bg-deep)', padding: '1px 6px', borderRadius: 3 }}>ollama pull llama3.2</code></li>
                <li>Klicke oben auf "Erneut prüfen"</li>
              </ol>
            </div>
          )}
        </div>

        {/* ── Groq Section ── */}
        <div style={{ marginBottom: 24 }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text)', marginBottom: 8 }}>
            Option 2: Groq Cloud (Kostenlos)
          </h3>
          <p style={{ fontSize: 12, color: 'var(--text-dim)', marginBottom: 10, lineHeight: 1.5 }}>
            Groq nutzt Llama 3.3 70B — exzellent für Deutsch. Kostenlos, 14.400 Bewertungen/Tag.
          </p>

          <label style={{ fontSize: 12, color: 'var(--text-dim)', display: 'block', marginBottom: 4 }}>
            Groq API-Schlüssel
          </label>
          <input
            type="password"
            value={groqKey}
            onChange={e => setGroqKeyState(e.target.value)}
            placeholder="gsk_..."
            style={{
              width: '100%', padding: '9px 12px', borderRadius: 8, fontSize: 13,
              background: 'var(--bg-deep)', border: '1px solid var(--border)',
              color: 'var(--text)', outline: 'none', boxSizing: 'border-box',
            }}
          />

          <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
            <button onClick={handleSaveGroq} style={{
              padding: '7px 16px', borderRadius: 8, fontSize: 12, cursor: 'pointer',
              background: 'var(--gold)', color: '#000', border: 'none', fontWeight: 600,
            }}>
              {saved ? 'Gespeichert!' : 'Speichern'}
            </button>
            <button onClick={handleTestGroq} disabled={!groqKey || testingGroq} style={{
              padding: '7px 16px', borderRadius: 8, fontSize: 12, cursor: 'pointer',
              background: 'transparent', color: 'var(--text-dim)',
              border: '1px solid var(--border)', opacity: !groqKey || testingGroq ? 0.5 : 1,
            }}>
              {testingGroq ? 'Teste...' : 'Testen'}
            </button>
            {groqKey && (
              <button onClick={handleRemoveGroq} style={{
                padding: '7px 16px', borderRadius: 8, fontSize: 12, cursor: 'pointer',
                background: 'transparent', color: '#e74c3c',
                border: '1px solid rgba(231,76,60,0.3)',
              }}>
                Entfernen
              </button>
            )}
          </div>

          {groqResult && (
            <div style={{
              marginTop: 8, fontSize: 12, padding: '6px 10px', borderRadius: 6,
              background: groqResult.ok ? 'rgba(46,204,113,0.1)' : 'rgba(231,76,60,0.1)',
              color: groqResult.ok ? '#2ecc71' : '#e74c3c',
            }}>
              {groqResult.msg}
            </div>
          )}

          <div style={{
            marginTop: 10, padding: '12px 14px', borderRadius: 8,
            background: 'rgba(255,255,255,0.03)', fontSize: 12, lineHeight: 1.6,
            color: 'var(--text-dim)',
          }}>
            <strong style={{ color: 'var(--text)' }}>So bekommst du einen kostenlosen Groq-Key:</strong>
            <ol style={{ margin: '6px 0 0 20px', padding: 0 }}>
              <li>Gehe zu <a href="https://console.groq.com" target="_blank" rel="noopener"
                style={{ color: 'var(--gold)', textDecoration: 'underline' }}>console.groq.com</a></li>
              <li>Erstelle einen kostenlosen Account (keine Kreditkarte nötig)</li>
              <li>Klicke "API Keys" → "Create API Key"</li>
              <li>Kopiere den Schlüssel und füge ihn hier ein</li>
            </ol>
          </div>
        </div>

        <button onClick={onClose} style={{
          marginTop: 8, width: '100%', padding: '10px', borderRadius: 8,
          fontSize: 14, cursor: 'pointer', background: 'transparent',
          color: 'var(--text-dim)', border: '1px solid var(--border)',
        }}>
          Schließen
        </button>
      </div>
    </div>
  );
}
