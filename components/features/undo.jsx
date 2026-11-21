// Undo by default: a file back in its slot in the row, the dashed outline it
// left in the trash (two more still in there), and the Restore arc between.
const lines = (x, y) => `M${x + 11} ${y + 17}h16M${x + 11} ${y + 27}h24M${x + 11} ${y + 37}h12`;

export default function UndoArt() {
  return (
    <svg className="art art-undo" viewBox="0 0 400 200" aria-hidden="true">
      <rect className="fill" x="66" y="96" width="46" height="56" rx="9" />
      <path className="ln" d={lines(66, 96)} />
      <rect className="paper" x="182" y="96" width="46" height="56" rx="9" />
      <path className="ln" d={lines(182, 96)} />
      <rect className="slot" x="118" y="90" width="58" height="68" rx="14" />
      <g transform="rotate(8 316 68)">
        <rect className="dash" x="293" y="40" width="46" height="56" rx="9" />
        <path className="dash" d={lines(293, 40)} />
      </g>
      <path className="paper" d="M292 90h48l-4 55a8 8 0 0 1-8 7h-24a8 8 0 0 1-8-7z" />
      <path d="M285 90h62" />
      <path d="M308 90v-4a3 3 0 0 1 3-3h10a3 3 0 0 1 3 3v4" />
      <path className="ln" d="M306 104v34M316 104v34M326 104v34" />
      <circle className="paper" cx="340" cy="146" r="9" />
      <text x="340" y="150" textAnchor="middle">3</text>
      <g className="back">
        <rect className="tint" x="124" y="96" width="46" height="56" rx="9" />
        <path className="ln on" d={lines(124, 96)} />
      </g>
      <path className="acc arc" d="M304 32C278 2 180 16 153 80" pathLength="1" />
      <path className="acc" d="M160.6 75.2L153 80L151.1 71.2" />
      <rect className="paper" x="196" y="9" width="66" height="22" rx="11" />
      <text x="229" y="24" textAnchor="middle">Restore</text>
      <text x="147" y="174" textAnchor="middle">label.css</text>
      <text className="akt" x="316" y="174" textAnchor="middle">Trash</text>
    </svg>
  );
}
