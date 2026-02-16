export function Badge({ children, color = "var(--gold)" }) {
  return (
    <span style={{
      display: "inline-flex", padding: "3px 10px", borderRadius: 20,
      fontSize: 11, fontWeight: 600, letterSpacing: 0.5,
      background: `${color}18`, color, border: `1px solid ${color}33`,
    }}>{children}</span>
  );
}
