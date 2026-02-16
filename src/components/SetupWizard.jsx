import { useState, useEffect } from 'react';
import { checkOllama, getGroqKey, setGroqKey } from '../engine/ki-scorer.js';
import { Card } from './Card.jsx';
import { Button } from './Button.jsx';

const STEPS = ['willkommen', 'ki-wahl', 'ollama', 'groq', 'fertig'];

export function SetupWizard({ onComplete }) {
  const [step, setStep] = useState('willkommen');
  const [ollamaStatus, setOllamaStatus] = useState(null);
  const [groqKey, setGroqKeyState] = useState('');
  const [testingGroq, setTestingGroq] = useState(false);
  const [groqResult, setGroqResult] = useState(null);
  const [kiReady, setKiReady] = useState(false);

  useEffect(() => {
    // Auto-check Ollama on mount
    checkOllama().then(result => {
      setOllamaStatus(result);
      if (result.available) setKiReady(true);
    });
    const existing = getGroqKey();
    if (existing) {
      setGroqKeyState(existing);
      setKiReady(true);
    }
  }, []);

  const handleRefreshOllama = async () => {
    setOllamaStatus(null);
    const result = await checkOllama();
    setOllamaStatus(result);
    if (result.available) setKiReady(true);
  };

  const handleSaveGroq = () => {
    setGroqKey(groqKey);
    setKiReady(true);
    setGroqResult({ ok: true, msg: 'Gespeichert!' });
    setTimeout(() => setStep('fertig'), 800);
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
        setGroqResult({ ok: true, msg: 'Groq funktioniert!' });
        setGroqKey(groqKey);
        setKiReady(true);
      } else {
        const err = await res.json().catch(() => ({}));
        setGroqResult({ ok: false, msg: err.error?.message || `Fehler ${res.status}` });
      }
    } catch (e) {
      setGroqResult({ ok: false, msg: e.message });
    }
    setTestingGroq(false);
  };

  const handleFinish = () => {
    localStorage.setItem('eloquent_setup_done', '1');
    onComplete();
  };

  const handleSkip = () => {
    localStorage.setItem('eloquent_setup_done', '1');
    onComplete();
  };

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center', padding: 20,
      background: 'var(--bg-deep)', position: 'relative', overflow: 'hidden',
    }}>
      {/* Background glow */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        background: 'radial-gradient(ellipse at 50% 30%, rgba(212,168,83,0.06) 0%, transparent 60%)',
      }} />

      <div className="animate-slide" style={{ maxWidth: 520, width: '100%', position: 'relative', zIndex: 1 }}>

        {/* ── Step: Willkommen ── */}
        {step === 'willkommen' && (
          <Card glow>
            <div style={{ textAlign: 'center', padding: '20px 0' }}>
              <div style={{
                fontSize: 13, letterSpacing: 6, color: 'var(--gold-dim)',
                textTransform: 'uppercase', marginBottom: 24,
              }} className="mono">Willkommen bei</div>

              <h1 className="serif" style={{
                fontSize: 56, fontWeight: 900, lineHeight: 0.95, marginBottom: 16,
                background: 'linear-gradient(135deg, var(--gold-bright), var(--gold), var(--gold-dim))',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
              }}>ELOQUENT</h1>

              <p style={{ fontSize: 16, color: 'var(--text-dim)', maxWidth: 380, margin: '0 auto 12px', lineHeight: 1.6 }}>
                Die Kunst der Sprache als Wettkampf.
              </p>
              <p style={{ fontSize: 13, color: 'var(--text-muted)', maxWidth: 380, margin: '0 auto 32px', lineHeight: 1.6 }}>
                Bevor du loslegst, richten wir die KI-Bewertung ein.
                Das dauert nur 1 Minute und macht das Spiel deutlich besser.
              </p>

              <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
                <Button variant="gold" onClick={() => setStep('ki-wahl')}>
                  KI einrichten
                </Button>
                <Button variant="ghost" onClick={handleSkip}>
                  Ohne KI starten
                </Button>
              </div>
            </div>
          </Card>
        )}

        {/* ── Step: KI-Wahl ── */}
        {step === 'ki-wahl' && (
          <Card glow>
            <div style={{ padding: '12px 0' }}>
              <h2 className="serif" style={{ color: 'var(--gold)', marginBottom: 8, fontSize: 24, textAlign: 'center' }}>
                KI-Provider wählen
              </h2>
              <p style={{ fontSize: 13, color: 'var(--text-dim)', textAlign: 'center', marginBottom: 24 }}>
                Wähle eine Option für die KI-gestützte Textbewertung.
              </p>

              {/* Ollama Option */}
              <div
                onClick={() => setStep('ollama')}
                style={{
                  padding: 20, borderRadius: 12, marginBottom: 12, cursor: 'pointer',
                  background: 'var(--bg-deep)', border: '1px solid var(--border)',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--gold)'; e.currentTarget.style.background = 'var(--bg-elevated)'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.background = 'var(--bg-deep)'; }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                  <span style={{ fontSize: 16, fontWeight: 700, color: 'var(--text)' }}>Ollama (Lokal)</span>
                  <span style={{
                    fontSize: 10, padding: '2px 6px', borderRadius: 3,
                    background: 'rgba(46,204,113,0.15)', color: '#2ecc71', fontWeight: 600,
                  }}>EMPFOHLEN</span>
                </div>
                <p style={{ fontSize: 12, color: 'var(--text-dim)', lineHeight: 1.5, margin: 0 }}>
                  Kostenlos, privat, kein API-Key. Läuft auf deinem Mac.
                </p>
                {ollamaStatus?.available && (
                  <div style={{
                    marginTop: 8, fontSize: 11, padding: '4px 8px', borderRadius: 4,
                    background: 'rgba(46,204,113,0.1)', color: '#2ecc71', display: 'inline-block',
                  }}>
                    Bereits aktiv: {ollamaStatus.model}
                  </div>
                )}
              </div>

              {/* Groq Option */}
              <div
                onClick={() => setStep('groq')}
                style={{
                  padding: 20, borderRadius: 12, marginBottom: 20, cursor: 'pointer',
                  background: 'var(--bg-deep)', border: '1px solid var(--border)',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.background = 'var(--bg-elevated)'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.background = 'var(--bg-deep)'; }}
              >
                <span style={{ fontSize: 16, fontWeight: 700, color: 'var(--text)', display: 'block', marginBottom: 6 }}>
                  Groq Cloud (Kostenlos)
                </span>
                <p style={{ fontSize: 12, color: 'var(--text-dim)', lineHeight: 1.5, margin: 0 }}>
                  Llama 3.3 70B, 14.400 Bewertungen/Tag. Braucht kostenlosen API-Key.
                </p>
              </div>

              <div style={{ textAlign: 'center' }}>
                <Button variant="ghost" onClick={handleSkip}>Ohne KI fortfahren</Button>
              </div>
            </div>
          </Card>
        )}

        {/* ── Step: Ollama Setup ── */}
        {step === 'ollama' && (
          <Card glow>
            <div style={{ padding: '12px 0' }}>
              <h2 className="serif" style={{ color: 'var(--gold)', marginBottom: 16, fontSize: 24 }}>
                Ollama einrichten
              </h2>

              {/* Status */}
              <div style={{
                padding: '12px 16px', borderRadius: 8, fontSize: 13, marginBottom: 16,
                background: ollamaStatus?.available ? 'rgba(46,204,113,0.1)' : 'rgba(255,255,255,0.03)',
                border: `1px solid ${ollamaStatus?.available ? 'rgba(46,204,113,0.3)' : 'var(--border)'}`,
                color: ollamaStatus?.available ? '#2ecc71' : 'var(--text-dim)',
              }}>
                {ollamaStatus === null ? (
                  'Suche Ollama...'
                ) : ollamaStatus.available ? (
                  <>Ollama aktiv! Modell: <strong>{ollamaStatus.model}</strong></>
                ) : (
                  'Ollama nicht gefunden.'
                )}
              </div>

              {ollamaStatus?.available ? (
                <div style={{ textAlign: 'center' }}>
                  <p style={{ fontSize: 14, color: '#2ecc71', marginBottom: 20 }}>
                    Alles bereit! Ollama läuft auf deinem Rechner.
                  </p>
                  <Button variant="gold" onClick={() => setStep('fertig')}>
                    Weiter
                  </Button>
                </div>
              ) : (
                <>
                  <div style={{
                    padding: '16px', borderRadius: 10, marginBottom: 16,
                    background: 'rgba(255,255,255,0.03)', fontSize: 13, lineHeight: 1.8,
                    color: 'var(--text-dim)',
                  }}>
                    <strong style={{ color: 'var(--text)' }}>Installation:</strong>
                    <ol style={{ margin: '8px 0 0 20px', padding: 0 }}>
                      <li style={{ marginBottom: 4 }}>
                        Gehe zu <a href="https://ollama.com" target="_blank" rel="noopener"
                          style={{ color: 'var(--gold)', textDecoration: 'underline' }}>ollama.com</a> und installiere die App
                      </li>
                      <li style={{ marginBottom: 4 }}>
                        Öffne Terminal und führe aus:
                        <code style={{
                          display: 'block', marginTop: 4, padding: '8px 12px', borderRadius: 6,
                          background: 'var(--bg-deep)', color: 'var(--gold)', fontSize: 13,
                          fontFamily: 'JetBrains Mono, monospace',
                        }}>ollama pull llama3.2</code>
                      </li>
                      <li>Klicke unten auf "Erneut prüfen"</li>
                    </ol>
                  </div>

                  <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
                    <Button variant="gold" onClick={handleRefreshOllama}>
                      Erneut prüfen
                    </Button>
                    <Button variant="ghost" onClick={() => setStep('groq')}>
                      Stattdessen Groq nutzen
                    </Button>
                  </div>
                </>
              )}

              <div style={{ textAlign: 'center', marginTop: 12 }}>
                <span onClick={() => setStep('ki-wahl')} style={{ fontSize: 12, color: 'var(--text-muted)', cursor: 'pointer' }}>
                  Zurück
                </span>
              </div>
            </div>
          </Card>
        )}

        {/* ── Step: Groq Setup ── */}
        {step === 'groq' && (
          <Card glow>
            <div style={{ padding: '12px 0' }}>
              <h2 className="serif" style={{ color: 'var(--gold)', marginBottom: 16, fontSize: 24 }}>
                Groq einrichten
              </h2>

              <div style={{
                padding: '16px', borderRadius: 10, marginBottom: 16,
                background: 'rgba(255,255,255,0.03)', fontSize: 13, lineHeight: 1.8,
                color: 'var(--text-dim)',
              }}>
                <strong style={{ color: 'var(--text)' }}>So bekommst du einen kostenlosen API-Key:</strong>
                <ol style={{ margin: '8px 0 0 20px', padding: 0 }}>
                  <li style={{ marginBottom: 4 }}>
                    Gehe zu <a href="https://console.groq.com" target="_blank" rel="noopener"
                      style={{ color: 'var(--gold)', textDecoration: 'underline' }}>console.groq.com</a>
                  </li>
                  <li style={{ marginBottom: 4 }}>Erstelle einen kostenlosen Account (keine Kreditkarte)</li>
                  <li style={{ marginBottom: 4 }}>Klicke "API Keys" → "Create API Key"</li>
                  <li>Kopiere den Schlüssel und füge ihn unten ein</li>
                </ol>
              </div>

              <label style={{ fontSize: 12, color: 'var(--text-dim)', display: 'block', marginBottom: 6 }}>
                Groq API-Schlüssel
              </label>
              <input
                type="password"
                value={groqKey}
                onChange={e => setGroqKeyState(e.target.value)}
                placeholder="gsk_..."
                style={{
                  width: '100%', padding: '10px 14px', borderRadius: 8, fontSize: 14,
                  background: 'var(--bg-deep)', border: '1px solid var(--border)',
                  color: 'var(--text)', outline: 'none', boxSizing: 'border-box',
                }}
              />

              {groqResult && (
                <div style={{
                  marginTop: 8, fontSize: 12, padding: '8px 12px', borderRadius: 6,
                  background: groqResult.ok ? 'rgba(46,204,113,0.1)' : 'rgba(231,76,60,0.1)',
                  color: groqResult.ok ? '#2ecc71' : '#e74c3c',
                }}>
                  {groqResult.msg}
                </div>
              )}

              <div style={{ display: 'flex', gap: 10, justifyContent: 'center', marginTop: 16 }}>
                <Button variant="gold" onClick={handleTestGroq} disabled={!groqKey || testingGroq}>
                  {testingGroq ? 'Teste...' : 'Testen & Speichern'}
                </Button>
                {groqKey && groqResult?.ok && (
                  <Button variant="default" onClick={() => { handleSaveGroq(); }}>
                    Weiter
                  </Button>
                )}
              </div>

              <div style={{ textAlign: 'center', marginTop: 12 }}>
                <span onClick={() => setStep('ki-wahl')} style={{ fontSize: 12, color: 'var(--text-muted)', cursor: 'pointer' }}>
                  Zurück
                </span>
              </div>
            </div>
          </Card>
        )}

        {/* ── Step: Fertig ── */}
        {step === 'fertig' && (
          <Card glow>
            <div style={{ textAlign: 'center', padding: '24px 0' }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>
                {kiReady ? '🎉' : '👍'}
              </div>
              <h2 className="serif" style={{ color: 'var(--gold)', marginBottom: 12, fontSize: 28 }}>
                {kiReady ? 'KI ist bereit!' : 'Setup abgeschlossen'}
              </h2>
              <p style={{ fontSize: 14, color: 'var(--text-dim)', maxWidth: 340, margin: '0 auto 8px', lineHeight: 1.6 }}>
                {kiReady
                  ? 'Deine Texte werden jetzt mit echtem Sprachverständnis bewertet.'
                  : 'Du kannst die KI jederzeit über die Einstellungen aktivieren.'}
              </p>
              {kiReady && (
                <div style={{
                  display: 'inline-block', marginBottom: 20, fontSize: 12, padding: '4px 12px',
                  borderRadius: 4, background: 'rgba(46,204,113,0.15)', color: '#2ecc71', fontWeight: 600,
                }}>
                  {ollamaStatus?.available
                    ? `Ollama (${ollamaStatus.model})`
                    : `Groq (Llama 3.3 70B)`}
                </div>
              )}
              <div style={{ marginTop: 8 }}>
                <Button variant="gold" onClick={handleFinish} style={{ fontSize: 17, padding: '14px 48px' }}>
                  Los geht's!
                </Button>
              </div>
            </div>
          </Card>
        )}

        {/* Progress dots */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 24 }}>
          {STEPS.map(s => (
            <div key={s} style={{
              width: 8, height: 8, borderRadius: '50%',
              background: s === step ? 'var(--gold)' : 'var(--border)',
              transition: 'all 0.3s',
            }} />
          ))}
        </div>
      </div>
    </div>
  );
}
