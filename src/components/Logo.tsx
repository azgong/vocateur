import { HeartMark } from "@/lib/heartMark";

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
      <HeartMark size={size * 0.32} top={size * 0.15} right={size * 0.14} color="var(--accent-soft)" />
    </div>
  );
}
