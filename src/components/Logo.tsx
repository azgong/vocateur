// The heart stands in for the "-ateur" in Vocateur: someone who loves their
// vocation, not just works it. Kept small and monochrome so it reads as a
// mark, not a cute sticker.
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
      <svg
        className="absolute"
        style={{ top: size * 0.16, right: size * 0.16, width: size * 0.3, height: size * 0.3 }}
        viewBox="0 0 24 24"
        fill="var(--accent-soft)"
      >
        <path d="M12 20.5s-8.5-5.13-8.5-11A5 5 0 0 1 12 6.36 5 5 0 0 1 20.5 9.5c0 5.87-8.5 11-8.5 11Z" />
      </svg>
    </div>
  );
}
