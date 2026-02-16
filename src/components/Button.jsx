export function Button({ children, onClick, variant = "default", disabled, style: s }) {
  const base = {
    padding: "12px 28px", borderRadius: 8, border: "none", cursor: disabled ? "default" : "pointer",
    fontFamily: "'DM Sans', sans-serif", fontSize: 15, fontWeight: 600,
    transition: "all 0.2s", opacity: disabled ? 0.4 : 1, display: "inline-flex",
    alignItems: "center", gap: 8, ...s,
  };
  const variants = {
    default: { background: "var(--bg-elevated)", color: "var(--text)", border: "1px solid var(--border)" },
    gold: { background: "linear-gradient(135deg, var(--gold), var(--gold-bright))", color: "#0a0b0f" },
    accent: { background: "var(--accent)", color: "#fff" },
    ghost: { background: "transparent", color: "var(--text-dim)", border: "1px solid var(--border)" },
    danger: { background: "var(--red-dim)", color: "var(--red)", border: "1px solid var(--red)33" },
  };
  return (
    <button onClick={disabled ? undefined : onClick}
      style={{ ...base, ...variants[variant] }}
      onMouseEnter={e => { if (!disabled) e.target.style.transform = "translateY(-1px)"; }}
      onMouseLeave={e => { e.target.style.transform = "translateY(0)"; }}>
      {children}
    </button>
  );
}
