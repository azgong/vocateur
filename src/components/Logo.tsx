import { VCrystalMark } from "@/lib/vCrystalMark";

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
      <VCrystalMark size={size * 0.68} color="#f3f1fa" accentColor="var(--accent-soft)" />
    </div>
  );
}
