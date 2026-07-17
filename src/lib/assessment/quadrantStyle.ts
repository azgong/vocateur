export type Quadrant = "a" | "b" | "c" | "d";

export const QUADRANT_META: Record<
  Quadrant,
  { label: string; name: string; bg: string; border: string; text: string; ring: string }
> = {
  a: {
    label: "Quadrant A · Analytical",
    name: "Analyst",
    bg: "bg-quadrant-a",
    border: "border-quadrant-a",
    text: "text-quadrant-a",
    ring: "shadow-[0_0_28px_-8px_var(--quadrant-a)]",
  },
  b: {
    label: "Quadrant B · Sequential",
    name: "Physician",
    bg: "bg-quadrant-b",
    border: "border-quadrant-b",
    text: "text-quadrant-b",
    ring: "shadow-[0_0_28px_-8px_var(--quadrant-b)]",
  },
  c: {
    label: "Quadrant C · Relational",
    name: "Executive",
    bg: "bg-quadrant-c",
    border: "border-quadrant-c",
    text: "text-quadrant-c",
    ring: "shadow-[0_0_28px_-8px_var(--quadrant-c)]",
  },
  d: {
    label: "Quadrant D · Experimental",
    name: "Founder",
    bg: "bg-quadrant-d",
    border: "border-quadrant-d",
    text: "text-quadrant-d",
    ring: "shadow-[0_0_28px_-8px_var(--quadrant-d)]",
  },
};
