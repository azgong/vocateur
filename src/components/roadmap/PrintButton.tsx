"use client";

export function PrintButton() {
  return (
    <button
      onClick={() => window.print()}
      className="shrink-0 rounded-full border-2 border-border-strong px-5 py-2 text-sm font-medium"
    >
      Download PDF
    </button>
  );
}
