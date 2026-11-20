'use client';
import { useEffect, useMemo, useRef, useState } from 'react';
import { sfxLand } from '@/lib/sfx';
import { Badge, FileChip, Stat, chipWidth } from './parts';
import { COMMITS as PUSH } from './data';

// Seven changed files in a loose pile, wired to the three commits they belong to.
// Each commit and its files share a tone: the first is the green accent (tinted,
// with a solid green count), the second grey and wired in solid ink, the third
// white and wired dashed. On hover the pile tidies into rows beside their
// commits, the wires comb out and a bead runs down them into each commit. A file can be dragged onto another
// commit: it springs into that commit's rows, its wire re-routes and it takes the
// commit's colour.

const COMMITS = PUSH.map((c, i) => ({ ...c, y: 52 + i * 68 }));
const CX = 476, CW = 294, CH = 58, SW = 794, SH = 270;

// c: commit, p: pile centre and tilt
const FILES = [
  { name: 'printer.js', c: 0, p: [78, 74, -5] },
  { name: 'sidebar.css', c: 2, p: [182, 94, 4] },
  { name: 'guide.md', c: 1, p: [70, 122, 3] },
  { name: 'printer.css', c: 0, p: [172, 142, -6] },
  { name: 'README.md', c: 1, p: [82, 172, -2] },
  { name: 'label.js', c: 0, p: [186, 190, 6] },
  { name: 'sidebar.js', c: 2, p: [96, 224, 4] },
];
const W = FILES.map((file) => chipWidth(file.name));

const f = (n) => +n.toFixed(2);
const wire = ([sx, sy], [ex, ey]) => {
  const k = (ex - sx) / 2;
  return `M${f(sx)} ${f(sy)}C${f(sx + k)} ${f(sy)} ${f(ex - k)} ${f(ey)} ${f(ex)} ${f(ey)}`;
};

// In the pile, each wire leaves its chip's right edge, along the tilt.
const PILE = FILES.map(({ p: [cx, cy, r] }, i) => {
  const a = (r * Math.PI) / 180;
  return [cx + (W[i] / 2) * Math.cos(a), cy + (W[i] / 2) * Math.sin(a)];
});

// Tidy rows: each commit gets two rows of files beside it, 28px apart. A file goes
// into the first row it fits, otherwise into the shorter one. Wires leave from the
// row's right end, fanned 7px apart, left chip on top.
const ROW_X = 24, ROW_MAX = 232, GAP = 8;
function layout(assign, order) {
  const rows = COMMITS.map(() => [[], []]);
  const width = (row) => row.reduce((s, i, j) => s + W[i] + (j ? GAP : 0), 0);
  for (const i of order) {
    const r = rows[assign[i]];
    const fit = r.findIndex((row) => width(row) + (row.length ? GAP : 0) + W[i] <= ROW_MAX);
    r[fit >= 0 ? fit : width(r[0]) <= width(r[1]) ? 0 : 1].push(i);
  }
  const centre = [], start = [];
  rows.forEach((pair, c) => pair.forEach((row, ri) => {
    const y = COMMITS[c].y + 3 + ri * 28;
    const end = ROW_X + width(row);
    let x = ROW_X;
    row.forEach((i, j) => {
      centre[i] = [x + W[i] / 2, y + 12];
      start[i] = [end, y + 12 + (j - (row.length - 1) / 2) * 7];
      x += W[i] + GAP;
    });
  }));
  return { centre, start };
}

// Wires end on the commit's left edge, fanned 7px apart around its middle, in the
// same top-to-bottom order as their starts so no two wires of a commit cross.
const fan = (starts, assign) => starts.map((st, i) => {
  const mates = FILES.map((o, j) => j).filter((j) => assign[j] === assign[i]).sort((x, y) => starts[x][1] - starts[y][1] || starts[x][0] - starts[y][0]);
  return [CX, COMMITS[assign[i]].y + CH / 2 + (mates.indexOf(i) - (mates.length - 1) / 2) * 7];
});

// A drop counts over a commit card, 16px either side and 5px above and below.
const hit = ([x, y]) => COMMITS.findIndex((c) => x >= CX - 16 && x <= CX + CW + 16 && y >= c.y - 5 && y <= c.y + CH + 5);

const DROP_MS = 520, LEAVE_MS = 700;

export default function SortArt() {
  const root = useRef(null);
  const [assign, setAssign] = useState(() => FILES.map((file) => file.c));
  const [order, setOrder] = useState(() => FILES.map((file, i) => i));
  const [held, setHeld] = useState(false);
  const [drag, setDrag] = useState(null); // { i, x, y, ox, oy, target, drop: [x, y] | null }
  const [fresh, setFresh] = useState(-1);
  const leaveT = useRef(0), dropT = useRef(0);

  useEffect(() => () => { clearTimeout(leaveT.current); clearTimeout(dropT.current); }, []);

  const tidy = useMemo(() => layout(assign, order), [assign, order]);
  const end0 = useMemo(() => fan(PILE, assign), [assign]);
  const end1 = useMemo(() => fan(tidy.start, assign), [tidy, assign]);
  const members = COMMITS.map((c, ci) => order.filter((i) => assign[i] === ci));
  const stagger = members.flat();
  let n = 0;
  const slots = members.map((m) => m.map((i) => ({ i, n: n++ })));

  // client point → stage pixels (the stage may be scaled down as a whole)
  const toStage = (x, y) => {
    const r = root.current.getBoundingClientRect();
    return [((x - r.left) / r.width) * SW, ((y - r.top) / r.height) * SH];
  };
  const release = () => { clearTimeout(leaveT.current); leaveT.current = setTimeout(() => setHeld(false), LEAVE_MS); };

  const onDown = (e, i) => {
    if (e.button !== 0 || drag) return;
    e.preventDefault();
    root.current.setPointerCapture(e.pointerId);
    const r = e.currentTarget.getBoundingClientRect();
    const [x, y] = toStage(r.left + r.width / 2, r.top + r.height / 2);
    const [px, py] = toStage(e.clientX, e.clientY);
    clearTimeout(leaveT.current);
    setHeld(true);
    setFresh(-1);
    setDrag({ i, x, y, ox: px - x, oy: py - y, target: -1, drop: null });
  };

  const onMove = (e) => {
    if (!drag || drag.drop) return;
    const pt = toStage(e.clientX, e.clientY);
    const t = hit(pt);
    setDrag((d) => ({ ...d, x: pt[0] - d.ox, y: pt[1] - d.oy, target: t >= 0 && t !== assign[d.i] ? t : -1 }));
  };

  const onUp = (e) => {
    if (!drag || drag.drop) return;
    const { i, target } = drag;
    let to = tidy.centre[i];
    if (e.type === 'pointerup' && target >= 0) {
      const nextAssign = assign.map((c, j) => (j === i ? target : c));
      const nextOrder = [...order.filter((j) => j !== i), i];
      to = layout(nextAssign, nextOrder).centre[i];
      setAssign(nextAssign);
      setOrder(nextOrder);
      setFresh(i);
      sfxLand();
    }
    setDrag((d) => ({ ...d, target: -1, drop: to }));
    clearTimeout(dropT.current);
    dropT.current = setTimeout(() => setDrag(null), DROP_MS);
    const r = root.current.getBoundingClientRect();
    if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) release();
  };

  const dragging = drag && !drag.drop;
  const gx = drag ? (drag.drop ? drag.drop[0] : drag.x) : 0;
  const gy = drag ? (drag.drop ? drag.drop[1] : drag.y) : 0;

  return (
    <div ref={root} className={`art art-sort${held ? ' is-held' : ''}${dragging ? ' is-dragging' : ''}`} aria-hidden="true"
      onPointerMove={onMove} onPointerUp={onUp} onPointerCancel={onUp}
      onPointerEnter={() => clearTimeout(leaveT.current)}
      onPointerLeave={() => { if (held && !dragging) release(); }}>
      <span className="sort-label mono">{FILES.length} changed files</span>
      <span className="sort-hint mono">drag a file onto another commit</span>

      <svg className="wires" viewBox={`0 0 ${SW} ${SH}`} width={SW} height={SH}>
        {FILES.map((file, i) => {
          const w0 = wire(PILE[i], end0[i]), w1 = wire(tidy.start[i], end1[i]);
          const live = dragging && drag.i === i;
          const style = { '--w0': `path('${w0}')`, '--w1': `path('${w1}')`, '--k': stagger.indexOf(i), ...(live && { d: `path('${wire([gx + W[i] / 2, gy], end1[i])}')`, transition: 'none' }) };
          return (
            <g key={file.name} className={`wt-${assign[i]}`}>
              <path className="wire wire-line" d={w0} style={style} />
              <path className="wire wire-pulse" pathLength="1" d={w0} style={style} />
            </g>
          );
        })}
      </svg>

      {COMMITS.map((c, ci) => (
        <div key={c.subject} className={`commit c${ci}${dragging && drag.target === ci ? ' is-target' : ''}`} style={{ left: CX, top: c.y, width: CW, height: CH }}>
          <i className="cdot" />
          <b>{c.subject}</b>
          <Badge on={ci === 0} className="count">{members[ci].length}</Badge>
          <span className="slots">
            {slots[ci].map((s) => <i key={FILES[s.i].name} className={`slot${fresh === s.i ? ' slot-in' : ''}`} style={{ '--n': s.n }} />)}
          </span>
          <Stat add={c.add} del={c.del} />
        </div>
      ))}

      {FILES.map((file, i) => {
        const [x1, y1] = tidy.centre[i];
        const ghosted = drag && drag.i === i;
        return (
          <div key={file.name} className={`pile${ghosted ? ' is-ghosted' : ''}`} onPointerDown={(e) => onDown(e, i)}
            style={{ '--x0': `${file.p[0]}px`, '--y0': `${file.p[1]}px`, '--r0': `${file.p[2]}deg`, '--x1': `${x1}px`, '--y1': `${y1}px`, '--k': stagger.indexOf(i), zIndex: 2 + i, ...(ghosted && { transition: 'none' }) }}>
            <FileChip name={file.name} tone={assign[i]} />
          </div>
        );
      })}

      {drag && (
        <div className={`ghost${drag.drop ? ' is-dropping' : ''}`} style={{ transform: `translate(${f(gx)}px, ${f(gy)}px)` }}>
          <div className="ghost-lift">
            <FileChip name={FILES[drag.i].name} tone={drag.target >= 0 ? drag.target : assign[drag.i]} />
          </div>
        </div>
      )}
    </div>
  );
}
