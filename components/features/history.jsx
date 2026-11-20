// History you can read. Left: twelve weeks of shipped commits as stacks of grey
// blocks, this week in solid green, with its count. Right: the branch tree as
// lanes: a feature branch (green, with a solid green label) that merges, a fix
// still open, a tag on the newest commit.
// On hover the stacks build up, the lanes draw and the nodes land in order.
// `compact` is the phone drawing on the 388 board: the lanes on top, the weeks
// under them (shorter blocks, no open fix).

const WEEKS = [2, 4, 2, 5, 3, 6, 4, 3, 6, 5, 7, 9];
const X0 = 36, STEP = 28;

const WIDE = {
  bh: 10, bg: 3,
  main: 'M486 162H735',
  feat: 'M549 162C575 162 573 84 599 84H648C674 84 672 162 698 162',
  fix: 'M622 162C637 162 635 241 650 241H673',
  featStem: 'M625.500 48V79', tagStem: 'M741 132V156',
  nodes: [
    { x: 510, y: 162, k: 'm' }, { x: 549, y: 162, k: 'm' },
    { x: 603, y: 84, k: 'f' }, { x: 625.500, y: 84, k: 'f' }, { x: 648, y: 84, k: 'f' },
    { x: 622, y: 162, k: 'm' }, { x: 652, y: 241, k: 'x' }, { x: 678, y: 241, k: 'x open' },
    { x: 698, y: 162, k: 'm merge' }, { x: 741, y: 162, k: 'head' },
  ],
};
const COMPACT = {
  bh: 6, bg: 2,
  main: 'M80 106H334',
  feat: 'M122 106C144 106 142 66 164 66H232C254 66 252 106 274 106',
  featStem: 'M198 48V61', tagStem: 'M340 48V100',
  nodes: [
    { x: 100, y: 106, k: 'm' }, { x: 122, y: 106, k: 'm' },
    { x: 170, y: 66, k: 'f' }, { x: 198, y: 66, k: 'f' }, { x: 226, y: 66, k: 'f' },
    { x: 198, y: 106, k: 'm' }, { x: 274, y: 106, k: 'm merge' }, { x: 340, y: 106, k: 'head' },
  ],
};

export default function HistoryArt({ compact = false }) {
  const g = compact ? COMPACT : WIDE;
  const now = WEEKS[WEEKS.length - 1];
  return (
    <div className={`art art-history${compact ? ' is-compact' : ''}`} aria-hidden="true">
      <div className="weeks">
        <i className="rule r1" /><i className="rule r2" /><i className="base" />
        {WEEKS.map((count, w) => (
          <span key={w} className={`wk${w === WEEKS.length - 1 ? ' wk-now' : ''}`} style={{ left: X0 + w * STEP, '--w': w }}>
            {Array.from({ length: count }, (_, b) => <i key={b} style={{ bottom: b * (g.bh + g.bg), '--b': b }} />)}
          </span>
        ))}
        <span className="ax mono" style={{ left: X0 }}>Sep</span>
        <span className="ax mono" style={{ left: X0 + 4 * STEP }}>Oct</span>
        <span className="ax mono" style={{ left: X0 + 8 * STEP }}>Nov</span>
        <div className="wtip">
          <span className="mono">this week</span>
          <b>{now} commits</b>
        </div>
        <i className="tip-stem" />
      </div>

      <i className="divide" />

      <svg className="tree" viewBox={compact ? '0 0 388 270' : '0 0 794 270'} width={compact ? 388 : 794} height="270">
        <path className="lane lane-main" d={g.main} pathLength="1" />
        {g.fix && <path className="lane lane-fix" d={g.fix} />}
        <path className="lane lane-feat" d={g.feat} pathLength="1" />
        <path className="stem feat-stem" d={g.featStem} />
        <path className="stem tag-stem" d={g.tagStem} />
        {g.nodes.map((nd, i) => (
          <g key={i} className={`node ${nd.k}`} style={{ '--n': i, transformOrigin: `${nd.x}px ${nd.y}px` }}>
            <circle cx={nd.x} cy={nd.y} r={nd.k === 'head' ? 5.5 : 4.5} />
            {nd.k.includes('merge') && <circle className="pip" cx={nd.x} cy={nd.y} r="1.75" />}
          </g>
        ))}
      </svg>
      <span className="chip br br-main"><i className="rdot" />main</span>
      <span className="chip br br-feat is-on"><i className="rdot" />label-printer</span>
      {g.fix && <span className="br-open mono">fix/sidebar</span>}
      <span className="chip tag">v0.2.0</span>
    </div>
  );
}
