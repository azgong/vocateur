// The V rendered as two separate elongated crystal-shard shapes (pointed
// at both ends) instead of a plain flat stroke. Each leg is split into two
// facets, a lit face and a shadowed face, using flat solid fills to fake a
// faceted 3D gem look. Straight-line SVG <polygon> only, no gradients, no
// arcs, no CSS tricks: Satori's production renderer only reliably supports
// plain polygons (see the earlier heart/diamond/arrow rendering incidents).
export function VCrystalMark({
  size,
  color,
  accentColor,
}: {
  size: number;
  color: string;
  accentColor: string;
}) {
  return (
    <svg style={{ width: `${size}px`, height: `${size}px` }} viewBox="0 0 100 100">
      <polygon points="50,82 50,68.2 26.8,20.6 16,12" fill={color} />
      <polygon points="50,82 39.2,73.4 16,25.8 16,12" fill={accentColor} />
      <polygon points="50,82 50,68.2 73.2,20.6 84,12" fill={color} />
      <polygon points="50,82 60.8,73.4 84,25.8 84,12" fill={accentColor} />
    </svg>
  );
}
