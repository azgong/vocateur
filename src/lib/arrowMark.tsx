// Arrowhead accent capping the V's right stroke: the vocation (V) leading
// somewhere, a path forward rather than a static initial. Built as an SVG
// <polygon> (straight lines only, no arcs, no CSS border-triangle hack):
// both an SVG path with elliptical arcs and the classic transparent-border
// CSS triangle trick render fine in local dev but collapse to their plain
// bounding-box rectangle under Satori in production. A straight-edged
// polygon doesn't touch either broken code path.
export function ArrowMark({
  size,
  top,
  right,
  rotate,
  color,
}: {
  size: number;
  top: number;
  right: number;
  rotate: number;
  color: string;
}) {
  return (
    <svg
      style={{
        position: "absolute",
        top: `${top}px`,
        right: `${right}px`,
        width: `${size}px`,
        height: `${size}px`,
        transform: `rotate(${rotate}deg)`,
      }}
      viewBox="0 0 24 24"
    >
      <polygon points="12,1 23,22 1,22" fill={color} />
    </svg>
  );
}
