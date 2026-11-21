// Sorts your changes: loose files on the left, the same files as three tidy
// commits on the right. The green pair is one feature that stays together.
// Each file carries a few faint lines of "code" and a small dot that says
// which commit it belongs to; each commit gets its hash, type and file count.
const DOT = { tint: 'dot on', fill: 'dot', paper: 'dot o' };
const Tile = ({ x, y, r = 0, c = 'fill', n, lines = true }) => (
  <g transform={r ? `rotate(${r} ${x + 19} ${y + 23})` : undefined} style={n == null ? undefined : { '--n': n }}>
    <rect className={c} x={x} y={y} width="38" height="46" rx="8" />
    {lines && <path className={c === 'tint' ? 'ln on' : 'ln'} d={`M${x + 9} ${y + 14}h14M${x + 9} ${y + 22}h20M${x + 9} ${y + 30}h10`} />}
    {lines && <circle className={DOT[c]} cx={x + 29} cy={y + 37} r="2.5" />}
  </g>
);

export default function SortArt() {
  return (
    <svg className="art art-sort" viewBox="0 0 400 200" aria-hidden="true">
      <text className="dim" x="111" y="11" textAnchor="middle">printer.js</text>
      <Tile x={34} y={34} r={-12} />
      <Tile x={92} y={20} r={10} c="tint" />
      <Tile x={58} y={84} r={6} />
      <Tile x={116} y={76} r={-9} c="tint" />
      <Tile x={80} y={130} r={-4} c="paper" />
      <text className="dim" x="99" y="194" textAnchor="middle">README.md</text>
      <path d="M180 94h32m-7 -7l7 7l-7 7" />
      <g className="xs">
        <text className="dim" x="256" y="47" textAnchor="middle">a1f3c9e</text>
        <text className="dim" x="315" y="47" textAnchor="middle">7d02b4a</text>
        <text className="dim" x="374" y="47" textAnchor="middle">e58c1f0</text>
      </g>
      <g className="stack">
        <Tile x={240} y={59} c="tint" n={0} lines={false} /><Tile x={234} y={71} c="tint" n={1} />
        <Tile x={299} y={59} n={2} lines={false} /><Tile x={293} y={71} n={3} />
        <Tile x={355} y={65} c="paper" n={4} />
      </g>
      <text x="256" y="142" textAnchor="middle">feat</text>
      <text x="315" y="142" textAnchor="middle">fix</text>
      <text x="374" y="142" textAnchor="middle">docs</text>
      <text className="dim" x="256" y="158" textAnchor="middle">2 files</text>
      <text className="dim" x="315" y="158" textAnchor="middle">2 files</text>
      <text className="dim" x="374" y="158" textAnchor="middle">1 file</text>
    </svg>
  );
}
