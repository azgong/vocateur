/* Decorative black-and-gold landscape motif: a rising sun over layered
   mountain ridgelines, used as a side accent echoing the brand's natural,
   golden-hour feel instead of literal UI iconography. */
export function LandscapeAccent({ className }: { className?: string }) {
  return (
    <svg aria-hidden viewBox="0 0 320 360" className={className} fill="none">
      <defs>
        <radialGradient id="landscape-sun-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="var(--accent-soft)" stopOpacity="0.85" />
          <stop offset="100%" stopColor="var(--accent-soft)" stopOpacity="0" />
        </radialGradient>
      </defs>

      <circle cx="170" cy="120" r="95" fill="url(#landscape-sun-glow)" />
      <circle cx="170" cy="120" r="34" fill="var(--accent-soft)" opacity="0.92" />
      <g stroke="var(--background)" strokeWidth="4" opacity="0.5">
        <line x1="137" y1="112" x2="203" y2="112" />
        <line x1="140" y1="126" x2="200" y2="126" />
        <line x1="146" y1="139" x2="194" y2="139" />
      </g>

      <g fill="var(--accent-soft)" opacity="0.55">
        <circle cx="34" cy="48" r="1.6" />
        <circle cx="60" cy="80" r="1.4" />
        <circle cx="264" cy="40" r="1.6" />
        <circle cx="286" cy="70" r="1.4" />
        <circle cx="24" cy="100" r="1.4" />
      </g>

      <path
        d="M0,230 L40,205 L80,220 L130,190 L170,215 L220,195 L260,225 L320,205 L320,360 L0,360 Z"
        fill="var(--accent-soft)"
        opacity="0.2"
      />
      <path
        d="M0,270 L50,235 L90,255 L140,210 L190,250 L230,225 L280,260 L320,240 L320,360 L0,360 Z"
        fill="#5c4a1a"
        opacity="0.65"
      />
      <path
        d="M0,320 L45,270 L85,300 L135,250 L165,285 L210,240 L250,290 L300,265 L320,285 L320,360 L0,360 Z"
        fill="var(--surface)"
      />
    </svg>
  );
}
