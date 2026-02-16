export function GoldBar({ value, max, delay = 0 }) {
  const pct = max > 0 ? Math.min(value / max, 1) * 100 : 0;
  const color = pct >= 70 ? "var(--green)" : pct >= 40 ? "var(--gold)" : "var(--red)";
  return (
    <div style={{ width: "100%", height: 8, background: "var(--bg-deep)", borderRadius: 4, overflow: "hidden" }}>
      <div style={{
        width: `${pct}%`, height: "100%", background: color, borderRadius: 4,
        animation: `barFill 1s ease-out ${delay}s both`,
        boxShadow: `0 0 8px ${color}44`,
      }} />
    </div>
  );
}
