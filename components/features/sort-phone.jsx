import { Badge, FileChip, Stat, chipWidth } from './parts';
import { COMMITS as PUSH } from './data';

// Sort, redrawn for the 388 board (phones). The same seven files and three
// commits as the wide drawing, stood up as a column: files on the left, commits
// on the right, a wire from each file to its commit. Rest is the shuffled pile;
// the story sorts the files into their groups, redraws the wires straight and
// fills each commit's slots. Nothing drags here, so the page scrolls freely.

const CX = 196, CW = 168, CH = 58;
const COMMITS = PUSH.map((c, i) => ({ ...c, y: 24 + i * 82 }));
// tidy: left-aligned at x=24, 24 high, 26 apart inside a group; groups end on the floor
const GROUP_Y = [24, 116, 196];
// pile: [centre x, centre y, tilt], top to bottom in a shuffled order
const PILE = {
  'sidebar.js': [84, 40, -4], 'printer.css': [92, 71, 3], 'guide.md': [70, 102, -3], 'label.js': [98, 133, 4],
  'README.md': [74, 164, -2], 'printer.js': [96, 197, 3], 'sidebar.css': [80, 230, -3],
};
const FILES = COMMITS.flatMap((c, ci) => c.files.map((name, j) => {
  const w = chipWidth(name);
  return { name, c: ci, j, w, tidy: [24 + w / 2, GROUP_Y[ci] + 12 + j * 26], pile: PILE[name] };
}));

const f = (n) => +n.toFixed(1);
const wire = ([sx, sy], [ex, ey]) => {
  const k = (ex - sx) / 2;
  return `M${f(sx)} ${f(sy)}C${f(sx + k)} ${f(sy)} ${f(ex - k)} ${f(ey)} ${f(ex)} ${f(ey)}`;
};
// wires end on the commit's left edge, fanned 7px apart, in the files' top-to-bottom order
const ends = (key) => FILES.map((file) => {
  const mates = FILES.filter((o) => o.c === file.c).sort((a, b) => a[key][1] - b[key][1]);
  return [CX, COMMITS[file.c].y + CH / 2 + (mates.indexOf(file) - (mates.length - 1) / 2) * 7];
});
const END0 = ends('pile'), END1 = ends('tidy');

export default function SortPhoneArt() {
  return (
    <div className="art art-sort is-compact" aria-hidden="true">
      <svg className="wires" viewBox="0 0 388 270" width="388" height="270">
        {FILES.map((file, i) => {
          const a = (file.pile[2] * Math.PI) / 180;
          const from = [file.pile[0] + (file.w / 2) * Math.cos(a), file.pile[1] + (file.w / 2) * Math.sin(a)];
          return (
            <g key={file.name} className={`wt-${file.c}`} style={{ '--k': i }}>
              <path className="wire-line w-pile" d={wire(from, END0[i])} />
              <path className="wire-line w-tidy" d={wire([24 + file.w, file.tidy[1]], END1[i])} />
            </g>
          );
        })}
      </svg>

      {COMMITS.map((c, ci) => (
        <div key={c.scope} className={`commit c${ci}`} style={{ left: CX, top: c.y, width: CW, height: CH }}>
          <i className="cdot" />
          <b>{c.scope}</b>
          <Badge on={ci === 0} className="count">{c.files.length}</Badge>
          <span className="slots">
            {c.files.map((name) => <i key={name} className="slot" style={{ '--n': FILES.findIndex((o) => o.name === name) }} />)}
          </span>
          <Stat add={c.add} del={c.del} />
        </div>
      ))}

      {FILES.map((file, i) => (
        <div key={file.name} className="pile"
          style={{ '--x0': `${file.pile[0]}px`, '--y0': `${file.pile[1]}px`, '--r0': `${file.pile[2]}deg`, '--x1': `${file.tidy[0]}px`, '--y1': `${file.tidy[1]}px`, '--k': i }}>
          <FileChip name={file.name} tone={file.c} />
        </div>
      ))}
    </div>
  );
}
