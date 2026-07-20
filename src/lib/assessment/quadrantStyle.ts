import { ChapterId } from "./scenes";

export type Quadrant = "a" | "b" | "c" | "d";

export const QUADRANT_META: Record<
  Quadrant,
  { name: string; bg: string; bgSoft: string; border: string; text: string; buttonText: string; ring: string }
> = {
  a: {
    name: "Analyst",
    bg: "bg-quadrant-a",
    bgSoft: "bg-quadrant-a/10",
    border: "border-quadrant-a",
    text: "text-quadrant-a",
    buttonText: "text-quadrant-a-ink",
    ring: "shadow-[0_0_28px_-8px_var(--quadrant-a)]",
  },
  b: {
    name: "Physician",
    bg: "bg-quadrant-b",
    bgSoft: "bg-quadrant-b/10",
    border: "border-quadrant-b",
    text: "text-quadrant-b",
    buttonText: "text-quadrant-b-ink",
    ring: "shadow-[0_0_28px_-8px_var(--quadrant-b)]",
  },
  c: {
    name: "Executive",
    bg: "bg-quadrant-c",
    bgSoft: "bg-quadrant-c/10",
    border: "border-quadrant-c",
    text: "text-quadrant-c",
    buttonText: "text-quadrant-c-ink",
    ring: "shadow-[0_0_28px_-8px_var(--quadrant-c)]",
  },
  d: {
    name: "Founder",
    bg: "bg-quadrant-d",
    bgSoft: "bg-quadrant-d/10",
    border: "border-quadrant-d",
    text: "text-quadrant-d",
    buttonText: "text-quadrant-d-ink",
    ring: "shadow-[0_0_28px_-8px_var(--quadrant-d)]",
  },
};

export const CHAPTER_QUADRANT: Record<ChapterId, Quadrant> = {
  analyst: "a",
  physician: "b",
  executive: "c",
  founder: "d",
};
