export function LockedMatchCard({ rank, title, fitScore }: { rank: number; title: string; fitScore: number }) {
  return (
    <div className="relative flex flex-col gap-3 overflow-hidden rounded-2xl border border-border-subtle bg-surface p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <span className="text-xs font-medium uppercase tracking-wide text-foreground/30">Match #{rank}</span>
          <h3 className="font-[family-name:var(--font-display)] text-2xl font-medium tracking-tight text-foreground/60">
            {title}
          </h3>
        </div>
        <div className="flex shrink-0 flex-col items-center justify-center rounded-full bg-surface-2 px-3 py-2 text-foreground/40">
          <span className="text-lg font-bold leading-none">{fitScore}%</span>
          <span className="text-[10px] leading-none opacity-70">fit</span>
        </div>
      </div>
      <div className="relative">
        <p className="select-none text-sm leading-relaxed text-foreground/30 blur-sm">
          This behavior pattern lines up closely with the reasoning style this role rewards most.
        </p>
        <div className="absolute inset-0 flex items-center gap-2 text-sm font-medium text-foreground/50">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="shrink-0">
            <rect x="4" y="10" width="16" height="10" rx="2" stroke="currentColor" strokeWidth="2" />
            <path d="M8 10V7a4 4 0 0 1 8 0v3" stroke="currentColor" strokeWidth="2" />
          </svg>
          Unlock to see why
        </div>
      </div>
    </div>
  );
}
