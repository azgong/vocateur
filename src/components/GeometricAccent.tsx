/* Decorative isometric block-and-node illustration, echoing the flat geometric
   collage style used in enterprise brand decks: overlapping color blocks plus
   a small connected-dot cluster, built from our own accent palette. */
export function GeometricAccent({ className }: { className?: string }) {
  return (
    <svg aria-hidden viewBox="0 0 320 360" className={className} fill="none">
      <rect x="30" y="0" width="110" height="110" fill="var(--accent-soft)" />
      <rect x="140" y="0" width="110" height="110" fill="#2c2b30" />
      <polygon points="140,0 250,0 140,110" fill="#4f4f51" />

      <rect x="30" y="110" width="110" height="110" fill="#2c2b30" />
      <circle cx="85" cy="165" r="30" stroke="var(--accent-soft)" strokeWidth="2" opacity="0.55" />
      <circle cx="85" cy="165" r="16" stroke="var(--accent-soft)" strokeWidth="2" opacity="0.8" />
      <circle cx="85" cy="165" r="5" fill="var(--accent-soft)" />

      <rect x="140" y="110" width="110" height="110" fill="#f2c4ce" opacity="0.9" />
      <polygon points="140,220 250,110 250,220" fill="#2c2b30" />

      <rect x="30" y="220" width="110" height="110" fill="#38373c" />
      <polygon points="52,318 85,228 118,318" fill="var(--accent)" opacity="0.9" />

      <g stroke="#8a8890" strokeWidth="1.5" opacity="0.65">
        <line x1="165" y1="250" x2="210" y2="232" />
        <line x1="210" y1="232" x2="245" y2="270" />
        <line x1="165" y1="250" x2="192" y2="295" />
        <line x1="192" y1="295" x2="245" y2="270" />
        <line x1="210" y1="232" x2="192" y2="295" />
      </g>
      <circle cx="165" cy="250" r="4.5" fill="var(--accent-soft)" />
      <circle cx="210" cy="232" r="4.5" fill="#f2c4ce" />
      <circle cx="245" cy="270" r="4.5" fill="var(--accent-soft)" />
      <circle cx="192" cy="295" r="4.5" fill="#f2c4ce" />
    </svg>
  );
}
