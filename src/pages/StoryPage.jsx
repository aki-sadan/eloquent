import { useState } from 'react';
import { Card } from '../components/Card.jsx';
import { Badge } from '../components/Badge.jsx';
import { Button } from '../components/Button.jsx';
import { WOERTERBUCH } from '../data/woerterbuch.js';

// ─── Story Data ───
const STORY = {
  titel: "Die Akademie der verlorenen Worte",
  intro: "In einer Welt, in der Worte Macht besitzen, liegt die legendäre Akademie der Eloquenz verborgen in den Nebeln des Vergessens. Einst war sie der Ort, an dem die größten Redner der Geschichte ihre Kunst perfektionierten. Doch ein dunkler Fluch hat die Worte aus der Akademie gestohlen — und mit ihnen die Macht der Sprache selbst.",

  kapitel: [
    {
      id: 1,
      titel: "Kapitel 1: Das Tor der Worte",
      szene: "Ihr steht vor einem gewaltigen Tor aus schwarzem Obsidian. In die Oberfläche sind leere Vertiefungen eingelassen — dort, wo einst goldene Buchstaben prangten. Eine Stimme flüstert aus dem Stein:",
      dialog: `\u201ENur wer die Sprache ehrt, darf eintreten. Beweise dein Wissen, Wanderer...\u201C`,
      challenges: [
        {
          typ: "wort_wahl",
          frage: "Die Stimme fragt: Welches Wort bedeutet 'redegewandt und sprachlich meisterhaft'?",
          optionen: ["eloquent", "turbulent", "prominent", "kompetent"],
          richtig: 0,
          erklaerung: "Eloquent — von lat. 'eloquentia' — beschreibt die Kunst, sich sprachlich geschickt und überzeugend auszudrücken.",
          belohnung: "Das erste goldene Wort erscheint am Tor: E·L·O·Q·U·E·N·T",
        },
        {
          typ: "luecke",
          frage: "Das Tor erzittert und eine Inschrift erscheint: 'Die ___ der Sprache liegt nicht im Schreien, sondern im Flüstern.'",
          optionen: ["Quintessenz", "Katastrophe", "Melodie", "Frequenz"],
          richtig: 0,
          erklaerung: "Quintessenz — das Wesentlichste, der Kern einer Sache. Die wahre Essenz der Sprache offenbart sich in leisen, gewählten Worten.",
          belohnung: "Ein zweites Wort leuchtet auf. Das Tor beginnt sich zu öffnen...",
        },
        {
          typ: "synonym",
          frage: "Die letzte Prüfung: Welches Wort ist ein Synonym für 'dennoch' oder 'trotz alledem'?",
          optionen: ["nichtsdestotrotz", "gewissermaßen", "bedauerlicherweise", "zwangsläufig"],
          richtig: 0,
          erklaerung: "Nichtsdestotrotz — eines der schönsten und längsten deutschen Wörter. Es verbindet Eleganz mit Entschlossenheit.",
          belohnung: "Das Tor schwingt auf! Dahinter erstreckt sich ein nebelverhangener Innenhof.",
        },
      ],
      outro: "Ihr tretet durch das Tor. Der Nebel lichtet sich und enthüllt einen weitläufigen Innenhof mit verfallenen Säulen. An den Wänden hängen verblichene Porträts vergessener Rhetoriker. In der Mitte steht ein Brunnen — doch statt Wasser fließen leuchtende Buchstaben durch seine Becken. Eine Gestalt in einer dunklen Robe tritt aus dem Schatten...",
    },
    {
      id: 2,
      titel: "Kapitel 2: Der Hüter des Brunnens",
      szene: "Die Gestalt zieht ihre Kapuze zurück. Ein alter Mann mit silbernem Bart und funkelnden Augen mustert euch. In seiner Hand hält er ein Buch, dessen Seiten leer sind.",
      dialog: `\u201EIch bin Veritas, der letzte H\u00FCter dieser Akademie. Der Fluch hat unsere Worte gestohlen \u2014 aber nicht unser Wissen. Zeig mir, dass du w\u00FCrdig bist, die verlorenen Worte zur\u00FCckzubringen.\u201C`,
      challenges: [
        {
          typ: "bedeutung",
          frage: "Veritas hebt die Hand und ein Wort erscheint in der Luft: 'EPHEMER'. Was bedeutet es?",
          optionen: ["Flüchtig und vergänglich", "Gewaltig und mächtig", "Rätselhaft und mysteriös", "Fröhlich und heiter"],
          richtig: 0,
          erklaerung: "Ephemer — wie der Morgentau, der mit den ersten Sonnenstrahlen verschwindet. Von kurzer Dauer, aber oft von großer Schönheit.",
          belohnung: "Das Wort sinkt in den Brunnen und das Wasser beginnt heller zu leuchten.",
        },
        {
          typ: "gegenteil",
          frage: "Veritas nickt anerkennend: 'Und was ist das Gegenteil von APATHIE — jener Gleichgültigkeit, die Seelen verdorren lässt?'",
          optionen: ["Euphorie", "Sympathie", "Nostalgie", "Anarchie"],
          richtig: 0,
          erklaerung: "Euphorie — ein Zustand überwältigender Begeisterung und Lebensfreude. Das Gegengift zur Teilnahmslosigkeit.",
          belohnung: "Ein weiteres Wort fließt in den Brunnen. Die Säulen des Innenhofs beginnen zu leuchten.",
        },
        {
          typ: "stilmittel",
          frage: "Veritas liest aus seinem Buch: 'Die Freiheit tanzt auf den Trümmern der Tyrannei.' Welches Stilmittel ist das?",
          optionen: ["Personifikation", "Alliteration", "Hyperbel", "Ellipse"],
          richtig: 0,
          erklaerung: "Personifikation — der Freiheit wird eine menschliche Handlung (tanzen) zugeschrieben. Ein mächtiges Werkzeug der Bildsprache!",
          belohnung: "Veritas lächelt. 'Du hast Potenzial, Wanderer. Aber der wahre Test steht noch bevor...'",
        },
      ],
      outro: "Der Brunnen pulsiert mit neuem Licht. Die leeren Porträts an den Wänden beginnen, Farbe zu zeigen — als würden die Worte selbst die Erinnerungen zurückbringen. Veritas deutet auf eine massive Tür am Ende des Innenhofs, über der ein einziges Wort in Flammen steht: RHETORIKA. 'Dahinter liegt die große Bibliothek', flüstert er. 'Und dort... wartet SIE.'",
    },
    {
      id: 3,
      titel: "Kapitel 3: Die Bibliothek der Rhetorika",
      szene: "Die Tür öffnet sich und ihr betretet eine Bibliothek von unfassbarer Größe. Regale ragen bis in die Unendlichkeit. Doch die meisten Bücher sind leer — ihre Worte gestohlen. In der Mitte schwebt eine leuchtende Gestalt: Rhetorika, die Hüterin der Sprache.",
      dialog: `\u201EEin neuer Aspirant? Wie... erfrischend. Die meisten scheitern bereits am Tor. Doch um die Worte zu befreien, musst du die Sprache nicht nur kennen \u2014 du musst sie F\u00DCHLEN.\u201C`,
      challenges: [
        {
          typ: "satz_bauen",
          frage: "Rhetorika stellt die Aufgabe: Welcher Satz enthält eine Antithese (einen Gegensatz)?",
          optionen: [
            "Nicht die Stärke macht den Helden, sondern die Güte.",
            "Der Mond scheint hell über dem dunklen Wald.",
            "Gestern war ein wunderschöner Tag gewesen.",
            "Viele Menschen gehen gerne im Park spazieren.",
          ],
          richtig: 0,
          erklaerung: "Die Antithese stellt Gegensätze gegenüber: Stärke vs. Güte. Dieses Stilmittel erzeugt Spannung und schärft den Gedanken.",
          belohnung: "Ein ganzes Regal füllt sich mit Worten! Rhetorika nickt anerkennend.",
        },
        {
          typ: "klimax",
          frage: "Rhetorika schnippt mit den Fingern: 'Welche Reihenfolge bildet eine Klimax — eine rhetorische Steigerung?'",
          optionen: [
            "Er kam, er sah, er siegte.",
            "Er siegte, er sah, er kam.",
            "Er sah, er siegte, er kam.",
            "Er kam, er siegte, er sah.",
          ],
          richtig: 0,
          erklaerung: "Klimax — die berühmten Worte Cäsars: 'Veni, vidi, vici.' Jedes Element steigert die Intensität. Von der Ankunft über das Erkennen bis zum Triumph.",
          belohnung: "Bücher fliegen aus den Regalen und öffnen sich — voller wiedergekehrter Worte!",
        },
        {
          typ: "meister",
          frage: "Die finale Prüfung: Rhetorika fragt: 'Was beschreibt SUBLIM am besten?'",
          optionen: [
            "Erhaben und von höchster Schönheit",
            "Subtil und kaum wahrnehmbar",
            "Schnell und dynamisch",
            "Traurig und melancholisch",
          ],
          richtig: 0,
          erklaerung: "Sublim — ein Wort für Momente, die über das Gewöhnliche hinausgehen. Die Schönheit eines Sonnenuntergangs, die Tiefe eines Musikstücks, die Eleganz eines perfekten Satzes.",
          belohnung: "Rhetorika lächelt zum ersten Mal. 'Du bist würdig. Die Akademie erwacht.'",
        },
      ],
      outro: "Die gesamte Bibliothek erstrahlt in goldenem Licht. Bücher füllen sich, Worte tanzen durch die Luft, und die Akademie der Eloquenz erwacht aus ihrem langen Schlaf. Rhetorika legt ihre Hand auf eure Schulter: 'Du hast die ersten Worte befreit, Wanderer. Aber der Fluch ist noch nicht gebrochen. Es gibt noch viele Kapitel in dieser Geschichte — und noch viele Worte, die darauf warten, gefunden zu werden.' Sie überreicht euch ein leeres Buch mit goldenen Initialen: E.Q. 'Dieses Buch wird sich füllen, während du lernst. Komm zurück, wenn du bereit bist für das nächste Kapitel...'",
    },
  ],
};

// ─── Story Mode Component ───
export function StoryPage({ onNavigate }) {
  const [phase, setPhase] = useState("intro"); // intro, kapitel, challenge, ergebnis, outro, ende
  const [kapitelIdx, setKapitelIdx] = useState(0);
  const [challengeIdx, setChallengeIdx] = useState(0);
  const [gewaehlt, setGewaehlt] = useState(null);
  const [punkte, setPunkte] = useState(0);
  const [gelernt, setGelernt] = useState([]);
  const [streak, setStreak] = useState(0);

  const kapitel = STORY.kapitel[kapitelIdx];
  const challenge = kapitel?.challenges[challengeIdx];
  const totalChallenges = STORY.kapitel.reduce((s, k) => s + k.challenges.length, 0);

  const handleAntwort = (idx) => {
    setGewaehlt(idx);
    const richtig = idx === challenge.richtig;
    if (richtig) {
      setPunkte(p => p + 10 + streak * 2);
      setStreak(s => s + 1);
      setGelernt(prev => [...prev, challenge.erklaerung.split(' — ')[0]]);
    } else {
      setStreak(0);
    }
  };

  const weiter = () => {
    setGewaehlt(null);
    if (challengeIdx < kapitel.challenges.length - 1) {
      setChallengeIdx(challengeIdx + 1);
      setPhase("challenge");
    } else {
      setPhase("outro");
    }
  };

  const naechstesKapitel = () => {
    if (kapitelIdx < STORY.kapitel.length - 1) {
      setKapitelIdx(kapitelIdx + 1);
      setChallengeIdx(0);
      setPhase("kapitel");
    } else {
      setPhase("ende");
    }
  };

  return (
    <div style={{ padding: "32px 24px", maxWidth: 700, margin: "0 auto" }}>
      {/* Score Bar */}
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '8px 16px', background: 'var(--bg-card)', borderRadius: 10, marginBottom: 24,
      }}>
        <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
          <span className="mono" style={{ fontSize: 13, color: 'var(--gold)' }}>
            {punkte} Punkte
          </span>
          {streak > 1 && (
            <Badge color="var(--green)">{streak}x Streak</Badge>
          )}
        </div>
        <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>
          {gelernt.length} Wörter gelernt
        </span>
      </div>

      {/* INTRO */}
      {phase === "intro" && (
        <div className="animate-in" style={{ textAlign: "center" }}>
          <div style={{ fontSize: 64, marginBottom: 16 }}>📖</div>
          <h1 className="serif" style={{ fontSize: 32, fontWeight: 900, color: "var(--gold)", marginBottom: 12 }}>
            {STORY.titel}
          </h1>
          <Card>
            <p style={{ fontSize: 16, lineHeight: 1.8, color: "var(--text-dim)", fontStyle: "italic", padding: "8px 0" }}>
              {STORY.intro}
            </p>
          </Card>
          <div style={{ marginTop: 28 }}>
            <Button variant="gold" onClick={() => setPhase("kapitel")}>
              Abenteuer beginnen →
            </Button>
          </div>
        </div>
      )}

      {/* KAPITEL-INTRO */}
      {phase === "kapitel" && kapitel && (
        <div className="animate-in">
          <Badge color="var(--accent)">Kapitel {kapitel.id} von {STORY.kapitel.length}</Badge>
          <h2 className="serif" style={{ fontSize: 26, fontWeight: 700, color: "var(--gold)", marginTop: 12, marginBottom: 20 }}>
            {kapitel.titel}
          </h2>
          <Card>
            <p style={{ fontSize: 15, lineHeight: 1.8, color: "var(--text-dim)", marginBottom: 16 }}>
              {kapitel.szene}
            </p>
            <div style={{
              padding: 16, background: "var(--bg-deep)", borderRadius: 10,
              borderLeft: "3px solid var(--gold)",
              fontStyle: "italic", fontSize: 15, lineHeight: 1.7, color: "var(--text)",
            }}>
              {kapitel.dialog}
            </div>
          </Card>
          <div style={{ textAlign: "center", marginTop: 24 }}>
            <Button variant="gold" onClick={() => setPhase("challenge")}>
              Prüfung annehmen →
            </Button>
          </div>
        </div>
      )}

      {/* CHALLENGE */}
      {phase === "challenge" && challenge && (
        <div className="animate-in">
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
            <Badge>Prüfung {challengeIdx + 1}/{kapitel.challenges.length}</Badge>
            <Badge color="var(--text-muted)">Kapitel {kapitel.id}</Badge>
          </div>
          <Card>
            <p style={{ fontSize: 16, lineHeight: 1.7, color: "var(--text)", marginBottom: 24, fontWeight: 500 }}>
              {challenge.frage}
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {challenge.optionen.map((opt, i) => {
                const isGewaehlt = gewaehlt === i;
                const istRichtig = i === challenge.richtig;
                const zeigeErgebnis = gewaehlt !== null;

                let bg = 'var(--bg-deep)';
                let border = '1px solid var(--border)';
                let textColor = 'var(--text)';

                if (zeigeErgebnis) {
                  if (istRichtig) {
                    bg = 'rgba(74,222,128,0.1)';
                    border = '1px solid var(--green)';
                    textColor = 'var(--green)';
                  } else if (isGewaehlt && !istRichtig) {
                    bg = 'rgba(248,113,113,0.1)';
                    border = '1px solid var(--red)';
                    textColor = 'var(--red)';
                  } else {
                    textColor = 'var(--text-muted)';
                  }
                }

                return (
                  <div
                    key={i}
                    onClick={() => gewaehlt === null && handleAntwort(i)}
                    style={{
                      padding: "14px 18px", background: bg, border, borderRadius: 10,
                      cursor: gewaehlt === null ? "pointer" : "default",
                      color: textColor, fontSize: 15, transition: "all 0.2s",
                      fontWeight: isGewaehlt ? 600 : 400,
                    }}
                    onMouseOver={e => { if (gewaehlt === null) e.target.style.background = 'var(--bg-card-hover)'; }}
                    onMouseOut={e => { if (gewaehlt === null) e.target.style.background = bg; }}
                  >
                    <span style={{ marginRight: 10, fontWeight: 600, color: 'var(--text-muted)' }}>
                      {String.fromCharCode(65 + i)}.
                    </span>
                    {opt}
                  </div>
                );
              })}
            </div>

            {/* Ergebnis */}
            {gewaehlt !== null && (
              <div className="animate-in" style={{ marginTop: 20 }}>
                <div style={{
                  padding: 16, borderRadius: 10,
                  background: gewaehlt === challenge.richtig ? 'rgba(74,222,128,0.08)' : 'rgba(248,113,113,0.08)',
                  border: `1px solid ${gewaehlt === challenge.richtig ? 'var(--green)' : 'var(--red)'}`,
                }}>
                  <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 6, color: gewaehlt === challenge.richtig ? 'var(--green)' : 'var(--red)' }}>
                    {gewaehlt === challenge.richtig ? '✓ Richtig!' : '✗ Leider falsch'}
                    {streak > 1 && gewaehlt === challenge.richtig && (
                      <span style={{ marginLeft: 8, color: 'var(--gold)' }}>🔥 {streak}x Streak! (+{streak * 2} Bonus)</span>
                    )}
                  </div>
                  <p style={{ fontSize: 14, lineHeight: 1.6, color: 'var(--text-dim)' }}>
                    {challenge.erklaerung}
                  </p>
                  <div style={{
                    marginTop: 10, padding: '8px 12px', background: 'var(--bg-deep)', borderRadius: 8,
                    fontSize: 13, color: 'var(--gold)', fontStyle: 'italic',
                  }}>
                    {challenge.belohnung}
                  </div>
                </div>
                <div style={{ textAlign: "center", marginTop: 16 }}>
                  <Button variant="gold" onClick={weiter}>
                    {challengeIdx < kapitel.challenges.length - 1 ? 'Nächste Prüfung →' : 'Weiter in der Geschichte →'}
                  </Button>
                </div>
              </div>
            )}
          </Card>
        </div>
      )}

      {/* OUTRO */}
      {phase === "outro" && kapitel && (
        <div className="animate-in">
          <h2 className="serif" style={{ fontSize: 24, fontWeight: 700, color: "var(--gold)", marginBottom: 20, textAlign: "center" }}>
            {kapitel.titel} — Abschluss
          </h2>
          <Card>
            <p style={{ fontSize: 15, lineHeight: 1.8, color: "var(--text-dim)", fontStyle: "italic" }}>
              {kapitel.outro}
            </p>
          </Card>
          <div style={{ textAlign: "center", marginTop: 24 }}>
            <Button variant="gold" onClick={naechstesKapitel}>
              {kapitelIdx < STORY.kapitel.length - 1 ? `Kapitel ${kapitel.id + 1} →` : 'Zum Abschluss →'}
            </Button>
          </div>
        </div>
      )}

      {/* ENDE */}
      {phase === "ende" && (
        <div className="animate-in" style={{ textAlign: "center" }}>
          <div style={{ fontSize: 64, marginBottom: 16 }}>🏆</div>
          <h1 className="serif" style={{ fontSize: 32, fontWeight: 900, color: "var(--gold)", marginBottom: 8 }}>
            Die Akademie erwacht!
          </h1>
          <p style={{ color: "var(--text-dim)", marginBottom: 32, fontSize: 15, lineHeight: 1.7 }}>
            Du hast die ersten drei Kapitel gemeistert und die Worte der Akademie befreit.
            Deine Reise hat gerade erst begonnen...
          </p>

          <Card glow style={{ maxWidth: 400, margin: "0 auto 24px" }}>
            <div style={{ textAlign: "center", padding: "16px 0" }}>
              <div className="mono" style={{ fontSize: 42, fontWeight: 900, color: "var(--gold-bright)" }}>{punkte}</div>
              <div style={{ fontSize: 13, color: "var(--text-muted)", marginBottom: 16 }}>Gesamtpunkte</div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div style={{ padding: 12, background: "var(--bg-deep)", borderRadius: 8 }}>
                  <div className="mono" style={{ fontSize: 24, fontWeight: 700, color: "var(--green)" }}>{gelernt.length}</div>
                  <div style={{ fontSize: 11, color: "var(--text-muted)" }}>Wörter gelernt</div>
                </div>
                <div style={{ padding: 12, background: "var(--bg-deep)", borderRadius: 8 }}>
                  <div className="mono" style={{ fontSize: 24, fontWeight: 700, color: "var(--accent)" }}>{streak > 0 ? streak : '—'}</div>
                  <div style={{ fontSize: 11, color: "var(--text-muted)" }}>Beste Streak</div>
                </div>
              </div>
            </div>
          </Card>

          {gelernt.length > 0 && (
            <Card style={{ maxWidth: 400, margin: "0 auto 24px", textAlign: "left" }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: "var(--gold)", marginBottom: 10 }}>📖 Gelernte Wörter</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {gelernt.map((w, i) => <Badge key={i}>{w}</Badge>)}
              </div>
            </Card>
          )}

          <div style={{
            padding: 16, background: "var(--bg-card)", borderRadius: 10,
            maxWidth: 400, margin: "0 auto 24px",
            border: "1px solid var(--border)",
          }}>
            <div style={{ fontSize: 14, color: "var(--text-dim)", fontStyle: "italic", lineHeight: 1.6 }}>
              „Weitere Kapitel folgen in kommenden Updates.
              Bis dahin: Übe deine Eloquenz im Duell- oder Übungsmodus!"
            </div>
          </div>

          <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
            <Button variant="gold" onClick={() => {
              setPhase("intro");
              setKapitelIdx(0);
              setChallengeIdx(0);
              setPunkte(0);
              setGelernt([]);
              setStreak(0);
            }}>
              Nochmal spielen
            </Button>
            <Button variant="ghost" onClick={() => onNavigate("home")}>Zum Menü</Button>
          </div>
        </div>
      )}
    </div>
  );
}
