// Writes the message: a small diff (file name, counts, three numbered lines
// of code) becomes one message line with a cursor, in the repo's own style.
const ROWS = [
  ['12', '+', 'const label = makeLabel(order)', 'on'],
  ['13', '+', 'printer.print(label)', 'on'],
  ['14', '−', 'console.log(order)', ''],
];

export default function WriteArt() {
  return (
    <svg className="art art-write" viewBox="0 0 400 200" aria-hidden="true">
      <rect className="paper" x="60" y="6" width="280" height="94" rx="12" />
      <text x="76" y="28">label.js</text>
      <text x="324" y="28" textAnchor="end"><tspan className="plus">+12</tspan> −3</text>
      <path className="ln" d="M60 40H340" />
      {ROWS.map(([no, sign, code, on], n) => (
        <g key={no}>
          {on && <rect className="bar on" x="68" y={47 + n * 16} width="264" height="16" rx="4" style={{ '--n': n }} />}
          <text className="dim xs" x="76" y={59 + n * 16}>{no}</text>
          <text className={on ? 'plus' : 'dim'} x="98" y={59 + n * 16}>{sign}</text>
          <text className={on ? undefined : 'dim'} x="112" y={59 + n * 16}>{code}</text>
        </g>
      ))}
      <path d="M200 106v11m-4.5 -4.5l4.5 4.5l4.5 -4.5" />
      <rect className="paper acc" x="60" y="124" width="280" height="46" rx="14" />
      <rect className="paper" x="246" y="114" width="80" height="20" rx="10" />
      <text x="286" y="128" textAnchor="middle">your style</text>
      <rect className="hl" x="74" y="138" width="43" height="18" rx="5" />
      <text x="80" y="151" textLength="165">feat: add a label printer</text>
      <rect className="caret" x="251" y="138" width="2" height="18" rx="1" />
    </svg>
  );
}
