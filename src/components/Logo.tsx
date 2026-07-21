export function Logo({ size = 56 }: { size?: number }) {
  return (
    <div
      className="flex flex-col items-center justify-center rounded-2xl shadow-[0_0_28px_-8px_var(--accent)]"
      style={{
        width: size,
        height: size,
        background: "radial-gradient(circle at 30% 20%, rgba(139,123,255,0.4), transparent 60%), #08070d",
      }}
    >
      <span
        className="font-[family-name:var(--font-display)] font-bold text-[#f3f1fa]"
        style={{ fontSize: size * 0.5, lineHeight: 1, marginTop: size * -0.03 }}
      >
        V
      </span>
      <span className="mt-1 flex" style={{ gap: size * 0.045 }}>
        <span className="rounded-full bg-quadrant-a" style={{ width: size * 0.09, height: size * 0.09 }} />
        <span className="rounded-full bg-quadrant-b" style={{ width: size * 0.09, height: size * 0.09 }} />
        <span className="rounded-full bg-quadrant-c" style={{ width: size * 0.09, height: size * 0.09 }} />
        <span className="rounded-full bg-quadrant-d" style={{ width: size * 0.09, height: size * 0.09 }} />
      </span>
    </div>
  );
}
