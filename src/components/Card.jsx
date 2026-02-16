export function Card({ children, style: s, glow, onClick }) {
  return (
    <div onClick={onClick} style={{
      background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 16,
      padding: 28, transition: "all 0.3s",
      ...(glow ? { animation: "glow 3s ease-in-out infinite" } : {}),
      ...(onClick ? { cursor: "pointer" } : {}), ...s,
    }}
      onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--border-light)"; e.currentTarget.style.background = "var(--bg-card-hover)"; }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.background = "var(--bg-card)"; }}>
      {children}
    </div>
  );
}
