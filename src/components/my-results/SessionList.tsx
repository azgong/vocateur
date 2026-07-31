"use client";

import { useState } from "react";
import Link from "next/link";

export type SessionListEntry = {
  id: string;
  lifeStage: string;
  createdAt: string;
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function TrashIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
      <path
        d="M4 7h16M9 7V4h6v3m-8 0 1 13a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1l1-13"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function SessionList({ initial }: { initial: SessionListEntry[] }) {
  const [entries, setEntries] = useState(initial);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  async function handleDelete(id: string) {
    if (!confirm("Delete this assessment result? Any roadmap already generated from it stays, only the match list goes. This can't be undone.")) return;
    setDeletingId(id);
    try {
      const res = await fetch("/api/assessment/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId: id }),
      });
      if (res.ok) {
        setEntries((prev) => prev.filter((e) => e.id !== id));
      } else {
        setDeletingId(null);
      }
    } catch {
      setDeletingId(null);
    }
  }

  if (entries.length === 0) {
    return (
      <p className="rounded-2xl border border-border-subtle bg-surface p-5 text-sm text-foreground/50">
        You haven&rsquo;t taken the assessment on this account yet.
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {entries.map((s) => (
        <div
          key={s.id}
          className="flex items-center justify-between gap-4 rounded-2xl border border-border-subtle bg-surface p-5 transition-colors hover:border-accent"
        >
          <Link href={`/results/${s.id}`} className="min-w-0 flex-1">
            <p className="font-medium">Assessment taken {formatDate(s.createdAt)}</p>
            <p className="text-sm text-foreground/50 capitalize">{s.lifeStage.replace(/_/g, " ")}</p>
          </Link>
          <div className="flex shrink-0 items-center gap-4">
            <Link href={`/results/${s.id}`} className="text-sm font-medium text-accent">
              View matches &rarr;
            </Link>
            <button
              type="button"
              onClick={() => handleDelete(s.id)}
              disabled={deletingId === s.id}
              aria-label="Delete assessment result"
              className="rounded-full p-2 text-foreground/40 transition-colors hover:bg-quadrant-c/10 hover:text-quadrant-c disabled:opacity-40"
            >
              <TrashIcon />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
