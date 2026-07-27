// The full logo mark as a single custom vector shape, not a font "V" glyph
// plus a separate decorative triangle: the right leg of the V continues
// directly upward as a widening shaft into the arrowhead, one continuous
// silhouette, split into two polygons only for the white/purple color
// change (they share an exact edge, so there's no seam). Straight lines
// only, no arcs, no CSS border-triangle tricks: both of those looked fine
// in local dev but rendered wrong in Satori's actual production output
// (see the heart and diamond incidents), a plain SVG <polygon> with only
// straight edges is the one primitive that has held up.
export function VArrowMark({
  size,
  color,
  accentColor,
}: {
  size: number;
  color: string;
  accentColor: string;
}) {
  return (
    <svg
      style={{ width: `${size}px`, height: `${size}px` }}
      viewBox="0 0 100 100"
    >
      <polygon points="14,34 50,88 74.8,18.1 53.2,13.9 50,70 28,30" fill={color} />
      <polygon points="74.8,18.1 66.7,2.3 53.2,13.9" fill={accentColor} />
    </svg>
  );
}
