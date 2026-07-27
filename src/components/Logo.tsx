import { ArrowMark } from "@/lib/arrowMark";

// The V's right stroke leads into an arrowhead: the vocation pointing
// somewhere, a path forward rather than a static initial.
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
      <ArrowMark size={size * 0.18} top={size * 0.18} right={size * 0.28} rotate={22} color="var(--accent-soft)" />
    </div>
  );
}
