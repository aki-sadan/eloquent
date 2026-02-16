import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { WOERTERBUCH } from '../data/woerterbuch.js';
import { Card } from './Card.jsx';
import { Badge } from './Badge.jsx';
import { Button } from './Button.jsx';

const TIMER_DURATIONS = { leicht: 180, mittel: 150, schwer: 120 };
const DEFAULT_TIMER = 150;

function formatTime(seconds) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

function timerColor(ratio) {
  if (ratio > 0.5) return 'var(--green)';
  if (ratio > 0.25) return 'var(--gold)';
  return 'var(--red)';
}

function WortHinweise() {
  const woerter = useMemo(() => {
    const shuffled = [...WOERTERBUCH].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, 5);
  }, []);

  const [offen, setOffen] = useState(false);

  return (
    <div style={{
      marginBottom: 16, background: 'var(--bg-deep)', borderRadius: 10,
      border: '1px solid var(--border)', overflow: 'hidden',
    }}>
      <div
        onClick={() => setOffen(!offen)}
        style={{
          padding: '10px 14px', cursor: 'pointer',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        }}
      >
        <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--gold)' }}>
          💡 Wort-Inspiration ({woerter.length} Wörter)
        </span>
        <span style={{ fontSize: 12, color: 'var(--text-muted)', transition: 'transform 0.2s', transform: offen ? 'rotate(180deg)' : 'none' }}>▼</span>
      </div>
      {offen && (
        <div style={{ padding: '0 14px 12px', display: 'flex', flexDirection: 'column', gap: 8 }}>
          {woerter.map((w, i) => (
            <div key={i} style={{
              padding: '8px 10px', background: 'var(--bg-card)', borderRadius: 8,
              borderLeft: '3px solid var(--gold-dim)',
            }}>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 2 }}>
                <span className="serif" style={{ fontWeight: 700, fontSize: 14, color: 'var(--gold-bright)' }}>{w.wort}</span>
                <span style={{ fontSize: 10, color: 'var(--text-muted)', fontStyle: 'italic' }}>{w.wortart}</span>
              </div>
              <div style={{ fontSize: 12, color: 'var(--text-dim)', lineHeight: 1.5 }}>{w.definition}</div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', fontStyle: 'italic', marginTop: 2 }}>„{w.beispiel}"</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export function AntwortEingabe({ situation, spielerName, onSubmit, schwierigkeit }) {
  const [text, setText] = useState("");
  const wc = text.trim().split(/\s+/).filter(Boolean).length;
  const taRef = useRef(null);
  const textRef = useRef(text);
  const submittedRef = useRef(false);

  const totalTime = TIMER_DURATIONS[schwierigkeit] || DEFAULT_TIMER;
  const [timeLeft, setTimeLeft] = useState(totalTime);

  useEffect(() => { textRef.current = text; }, [text]);
  useEffect(() => { taRef.current?.focus(); }, []);

  useEffect(() => {
    submittedRef.current = false;
    setTimeLeft(totalTime);
  }, [totalTime]);

  const doSubmit = useCallback(() => {
    if (submittedRef.current) return;
    submittedRef.current = true;
    const currentText = textRef.current.trim();
    const currentWc = currentText.split(/\s+/).filter(Boolean).length;
    // 0 words → signal skip with null
    if (!currentText || currentWc === 0) {
      onSubmit(null);
    } else {
      onSubmit(currentText);
    }
  }, [onSubmit]);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          doSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [doSubmit]);

  const ratio = timeLeft / totalTime;
  const color = timerColor(ratio);
  const isUrgent = timeLeft <= 15;

  return (
    <div className="animate-in" style={{ maxWidth: 640, margin: "0 auto" }}>
      <Card>
        {/* Timer */}
        <div style={{ marginBottom: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
            <span style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 500 }}>Verbleibende Zeit</span>
            <span className="mono" style={{
              fontSize: isUrgent ? 18 : 14, fontWeight: 700, color,
              transition: 'all 0.3s',
              animation: isUrgent ? 'pulse 0.8s infinite' : 'none',
            }}>
              {formatTime(timeLeft)}
            </span>
          </div>
          <div style={{ width: '100%', height: 4, background: 'var(--border)', borderRadius: 2, overflow: 'hidden' }}>
            <div style={{
              width: `${ratio * 100}%`, height: '100%', background: color,
              borderRadius: 2, transition: 'width 1s linear, background 0.5s',
            }} />
          </div>
        </div>

        <div style={{ marginBottom: 20 }}>
          <Badge color="var(--accent)">{situation.kontext}</Badge>
          <h2 className="serif" style={{ fontSize: 26, fontWeight: 700, marginTop: 12, color: "var(--text)" }}>{situation.titel}</h2>
          <p style={{ fontSize: 15, color: "var(--text-dim)", lineHeight: 1.7, marginTop: 10 }}>{situation.beschreibung}</p>
        </div>

        {/* Wort-Inspirationen */}
        <WortHinweise />

        <div style={{ position: "relative" }}>
          {spielerName && <div style={{ fontSize: 13, color: "var(--gold)", fontWeight: 600, marginBottom: 8 }}>✍️ {spielerName}, zeig deine Eloquenz:</div>}
          <textarea ref={taRef} value={text} onChange={e => setText(e.target.value)}
            placeholder="Schreibe hier deine eloquente Antwort..."
            disabled={timeLeft <= 0}
            style={{
              width: "100%", minHeight: 180, padding: 16, background: "var(--bg-deep)",
              border: `1px solid ${isUrgent ? color : 'var(--border)'}`, borderRadius: 10, color: "var(--text)",
              fontFamily: "'DM Sans', sans-serif", fontSize: 15, lineHeight: 1.7,
              resize: "vertical", outline: "none", transition: "border-color 0.3s",
              opacity: timeLeft <= 0 ? 0.5 : 1,
            }}
            onFocus={e => { if (!isUrgent) e.target.style.borderColor = "var(--gold-dim)"; }}
            onBlur={e => { if (!isUrgent) e.target.style.borderColor = "var(--border)"; }}
          />
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8, alignItems: "center" }}>
            <span className="mono" style={{ fontSize: 12, color: wc < 10 ? "var(--red)" : "var(--text-muted)" }}>
              {wc} Wörter {wc < 10 ? "(min. 10)" : "✓"}
            </span>
            <Button variant="gold" disabled={wc < 10 || timeLeft <= 0} onClick={() => { submittedRef.current = true; onSubmit(text); }}>
              Antwort abgeben →
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
