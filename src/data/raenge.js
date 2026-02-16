export const RAENGE = [
  { name: "Anfänger", symbol: "🌱", min: 0 },
  { name: "Lehrling", symbol: "📝", min: 50 },
  { name: "Redner", symbol: "🎤", min: 150 },
  { name: "Dichter", symbol: "✒️", min: 300 },
  { name: "Rhetoriker", symbol: "📜", min: 500 },
  { name: "Wortkünstler", symbol: "🎨", min: 800 },
  { name: "Meister", symbol: "👑", min: 1200 },
  { name: "Großmeister", symbol: "🏆", min: 2000 },
  { name: "Legende", symbol: "🌟", min: 3500 },
  { name: "Eloquenz-Gott", symbol: "⚡", min: 5000 },
];

export const getRang = (pokale) => {
  let r = RAENGE[0];
  for (const rang of RAENGE) {
    if (pokale >= rang.min) r = rang;
    else break;
  }
  return r;
};

export const getNote = (p) => {
  if (p >= 95) return { note: "Meisterhaft", emoji: "⚡" };
  if (p >= 85) return { note: "Herausragend", emoji: "🌟" };
  if (p >= 75) return { note: "Ausgezeichnet", emoji: "🏅" };
  if (p >= 65) return { note: "Sehr gut", emoji: "✨" };
  if (p >= 55) return { note: "Gut", emoji: "👍" };
  if (p >= 45) return { note: "Ordentlich", emoji: "📝" };
  if (p >= 35) return { note: "Ausbaufähig", emoji: "🔧" };
  return { note: "Schwach", emoji: "📉" };
};
