// Shared drawing kit for the four feature icons (rules: app/features.css).

// A rounded square with smoothed, squircle-style corners: each corner is one
// curve that starts 1.6 radii back along the edge, so the straight side eases
// into the bend instead of snapping into a circular arc.
export function squircle(x, y, w, h, r) {
  const l = Math.min(r * 1.6, w / 2, h / 2), k = l * 0.155;
  const X = x + w, Y = y + h;
  return `M${x + l} ${y}H${X - l}C${X - k} ${y} ${X} ${y + k} ${X} ${y + l}V${Y - l}C${X} ${Y - k} ${X - k} ${Y} ${X - l} ${Y}H${x + l}C${x + k} ${Y} ${x} ${Y - k} ${x} ${Y - l}V${y + l}C${x} ${y + k} ${x + k} ${y} ${x + l} ${y}Z`;
}

export const Sq = ({ x, y, w, h = w, r, rot, ...rest }) => (
  <path d={squircle(x, y, w, h, r)} transform={rot ? `rotate(${rot} ${x + w / 2} ${y + h / 2})` : undefined} {...rest} />
);

// Keylines: the icon's construction lines (centre cross, live area and
// circle). Hidden at rest; they show under a mouse pointer and in blueprint mode.
export const Keys = () => (
  <g className="keys">
    <path d="M200 24V176M76 100H324" />
    <path d={squircle(76, 24, 248, 152, 34)} />
    <circle cx="200" cy="100" r="64" />
  </g>
);
