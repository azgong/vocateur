"use client";

export function PrintButton() {
  return (
    <button
      onClick={() => window.print()}
      className="shrink-0 rounded-full border-2 border-zinc-300 px-5 py-2 text-sm font-medium dark:border-zinc-700"
    >
      Download PDF
    </button>
  );
}
