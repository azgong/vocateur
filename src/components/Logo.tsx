import { VCrystalMark } from "@/lib/vCrystalMark";

export function Logo({ size = 56 }: { size?: number }) {
  return (
    <div
      className="relative flex items-center justify-center rounded-2xl shadow-[0_0_28px_-8px_var(--accent)]"
      style={{
        width: size,
        height: size,
        background: "radial-gradient(circle at 30% 20%, rgba(124,58,237,0.4), transparent 60%), #141118",
      }}
    >
      <VCrystalMark size={size * 0.68} color="#ffffff" accentColor="#a78bfa" />
    </div>
  );
}
