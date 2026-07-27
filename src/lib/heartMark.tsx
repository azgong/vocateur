// Shared heart-accent shape for the logo mark, used both by the browser
// Logo component and by the Satori-rendered icon routes (favicon, apple
// touch icon, PWA icons). Built from two rotated, top-rounded rectangles
// rather than an SVG path with arcs: Satori's SVG path/arc support doesn't
// match its own div/border-radius/transform rendering in production (an
// SVG heart path rendered as a plain diamond there), so this sticks to the
// same plain box-model primitives the old triangle accent already used
// successfully in production.
export function HeartMark({
  size,
  top,
  right,
  color,
}: {
  size: number;
  top: number;
  right: number;
  color: string;
}) {
  const lobeWidth = size * 0.5;
  const lobeHeight = size * 0.8;
  const lobeRadius = size * 0.25;

  return (
    <div
      style={{
        position: "absolute",
        top: `${top}px`,
        right: `${right}px`,
        width: `${size}px`,
        height: `${size * 0.9}px`,
        display: "flex",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: "0px",
          left: `${lobeWidth}px`,
          width: `${lobeWidth}px`,
          height: `${lobeHeight}px`,
          background: color,
          borderRadius: `${lobeRadius}px ${lobeRadius}px 0px 0px`,
          transform: "rotate(-45deg)",
          transformOrigin: "0% 100%",
        }}
      />
      <div
        style={{
          position: "absolute",
          top: "0px",
          left: "0px",
          width: `${lobeWidth}px`,
          height: `${lobeHeight}px`,
          background: color,
          borderRadius: `${lobeRadius}px ${lobeRadius}px 0px 0px`,
          transform: "rotate(45deg)",
          transformOrigin: "100% 100%",
        }}
      />
    </div>
  );
}
