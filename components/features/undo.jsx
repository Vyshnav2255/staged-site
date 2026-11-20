import { Badge, FileChip } from './parts';

// Undo: a discarded file comes back out of the grey trash, over an arc (the green
// accent), into the top row of the changes list, which is tinted green for it.
// Rest shows it restored; hover plays the trip again.

// The file's path: out of the bin's mouth, over the top, down into the first row.
const P = [[292, 137], [284, -4], [112, -4], [74.5, 165]];
const ARC = `M${P[0]}C${P[1]} ${P[2]} ${P[3]}`;
// The drawn arc stops short of the list (de Casteljau at t), with an arrowhead there.
const lerp = (a, b, t) => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];
const T = 0.87;
const q = [lerp(P[0], P[1], T), lerp(P[1], P[2], T), lerp(P[2], P[3], T)];
const r = [lerp(q[0], q[1], T), lerp(q[1], q[2], T)];
const tip = lerp(r[0], r[1], T);
const fx = (pt) => pt.map((v) => +v.toFixed(1));
const DRAWN = `M${P[0]}C${fx(q[0])} ${fx(r[0])} ${fx(tip)}`;
const ang = Math.atan2(tip[1] - r[0][1], tip[0] - r[0][0]);
const wing = (d) => fx([tip[0] - 6 * Math.cos(ang + d), tip[1] - 6 * Math.sin(ang + d)]);
const HEAD = `M${wing(0.6)}L${fx(tip)}L${wing(-0.6)}`;

export default function UndoArt() {
  return (
    <div className="art art-undo" aria-hidden="true">
      <div className="changes panel">
        <div className="panel-head"><b>Changes</b><Badge>3</Badge></div>
        <div className="ch-row is-home"><span className="ch-back mono">restored</span></div>
        <div className="ch-row"><FileChip name="cart.js" /></div>
        <div className="ch-row"><FileChip name="guide.md" /></div>
      </div>

      <svg className="lines" viewBox="0 0 388 270" width="388" height="270">
        <path className="arc" d={DRAWN} pathLength="1" />
        <path className="arc-head" d={HEAD} />
        {/* the bin: back rim, body, ribs, lid */}
        <g transform="translate(20 5.500)">
          <ellipse className="bin-rim" cx="286" cy="132" rx="46" ry="7" />
          <path className="bin-body" d="M240 132c0 3.900 20.600 7 46 7s46-3.100 46-7l-7.200 96.500c-.5 6.400-5.800 11.500-12.300 11.500h-53c-6.500 0-11.800-5.100-12.300-11.500Z" />
          <path className="bin-ribs" d="M268 154l2.500 70M286 155v70M304 154l-2.500 70" />
          <g className="lid">
            <path className="lid-top" d="M236 121.500c0-2.500 2-4.500 4.500-4.500h91c2.500 0 4.500 2 4.500 4.500v3c0 1.400-1.100 2.500-2.500 2.500h-95c-1.400 0-2.500-1.100-2.500-2.500Z" />
            <path className="lid-knob" d="M276 117v-3.500c0-1.700 1.300-3 3-3h14c1.700 0 3 1.300 3 3V117" />
          </g>
        </g>
      </svg>

      <span className="chip key"><span>⌘</span>Z</span>

      <div className="back" style={{ offsetPath: `path('${ARC}')` }}>
        <FileChip name="notes.md" tone={0} className="is-acc" />
      </div>
    </div>
  );
}
