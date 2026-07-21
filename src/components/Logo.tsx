export function Logo({ size = 56 }: { size?: number }) {
  return (
    <div
      className="relative flex items-center justify-center rounded-2xl shadow-[0_0_28px_-8px_var(--accent)]"
      style={{
        width: size,
        height: size,
        background: "radial-gradient(circle at 30% 20%, rgba(139,123,255,0.4), transparent 60%), #08070d",
      }}
    >
      <span
        className="font-[family-name:var(--font-brand)] font-bold text-[#f3f1fa]"
        style={{ fontSize: size * 0.52, lineHeight: 1 }}
      >
        V
      </span>
      <span
        className="absolute"
        style={{
          top: size * 0.22,
          right: size * 0.24,
          width: 0,
          height: 0,
          borderLeft: `${size * 0.075}px solid transparent`,
          borderRight: `${size * 0.075}px solid transparent`,
          borderBottom: `${size * 0.13}px solid var(--accent-soft)`,
          transform: "rotate(45deg)",
        }}
      />
    </div>
  );
}
