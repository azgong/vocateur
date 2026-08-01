export function ConsistencyBadge({ matchCount, totalAttempts }: { matchCount: number; totalAttempts: number }) {
  const isUnanimous = matchCount === totalAttempts;

  return (
    <div className="mx-auto flex w-fit items-center gap-2 rounded-full border border-quadrant-b/30 bg-quadrant-b/[0.08] px-4 py-2 text-sm text-quadrant-b">
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" className="shrink-0">
        <path
          d="M9 12.5l2.2 2.2L16 9.5M12 3l8 4v5c0 4.5-3 8-8 9-5-1-8-4.5-8-9V7l8-4Z"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <span className="font-medium">
        {isUnanimous
          ? `Consistent top match across all ${totalAttempts} of your attempts`
          : `Your top match in ${matchCount} of ${totalAttempts} attempts`}
      </span>
    </div>
  );
}
