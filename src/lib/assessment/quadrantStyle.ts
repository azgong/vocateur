import { ChapterId } from "./scenes";

export type Quadrant = "a" | "b" | "c" | "d" | "e";

export const QUADRANT_META: Record<
  Quadrant,
  { name: string; bg: string; bgSoft: string; border: string; borderSoft: string; text: string; buttonText: string; ring: string }
> = {
  a: {
    name: "Analyst",
    bg: "bg-quadrant-a",
    bgSoft: "bg-quadrant-a/10",
    border: "border-quadrant-a",
    borderSoft: "border-quadrant-a/30",
    text: "text-quadrant-a",
    buttonText: "text-quadrant-a-ink",
    ring: "shadow-[0_0_28px_-8px_var(--quadrant-a)]",
  },
  b: {
    name: "Physician",
    bg: "bg-quadrant-b",
    bgSoft: "bg-quadrant-b/10",
    border: "border-quadrant-b",
    borderSoft: "border-quadrant-b/30",
    text: "text-quadrant-b",
    buttonText: "text-quadrant-b-ink",
    ring: "shadow-[0_0_28px_-8px_var(--quadrant-b)]",
  },
  c: {
    name: "Executive",
    bg: "bg-quadrant-c",
    bgSoft: "bg-quadrant-c/10",
    border: "border-quadrant-c",
    borderSoft: "border-quadrant-c/30",
    text: "text-quadrant-c",
    buttonText: "text-quadrant-c-ink",
    ring: "shadow-[0_0_28px_-8px_var(--quadrant-c)]",
  },
  d: {
    name: "Founder",
    bg: "bg-quadrant-d",
    bgSoft: "bg-quadrant-d/10",
    border: "border-quadrant-d",
    borderSoft: "border-quadrant-d/30",
    text: "text-quadrant-d",
    buttonText: "text-quadrant-d-ink",
    ring: "shadow-[0_0_28px_-8px_var(--quadrant-d)]",
  },
  e: {
    name: "Builder",
    bg: "bg-quadrant-e",
    bgSoft: "bg-quadrant-e/10",
    border: "border-quadrant-e",
    borderSoft: "border-quadrant-e/30",
    text: "text-quadrant-e",
    buttonText: "text-quadrant-e-ink",
    ring: "shadow-[0_0_28px_-8px_var(--quadrant-e)]",
  },
};

export const CHAPTER_QUADRANT: Record<ChapterId, Quadrant> = {
  analyst: "a",
  physician: "b",
  executive: "c",
  founder: "d",
  builder: "e",
};
