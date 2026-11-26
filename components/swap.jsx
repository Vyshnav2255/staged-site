// "No terminal": the commands you would type, and what you do in Staged instead.
// Drawn like the app's receipts: .5px edge, dashed rules, a total at the bottom.
const ROWS = [
  { cmd: 'git status', what: 'Home', how: 'One line says what needs you, in every repo at once.' },
  { cmd: 'git add -p && git commit -m "…"', what: 'Sorted and named', how: 'Your changes arrive as clean commits with their messages written.' },
  { cmd: 'git push', what: 'Hold to push', how: 'Let go early and nothing happens. A receipt prints when it lands.' },
  { cmd: 'git pull --rebase', what: 'Pull', how: 'It stops first if what is coming in would clash with your work.' },
  { cmd: 'npm run dev', what: 'Run', how: 'Press play on a cassette. The port shows up in the sidebar.' },
  { cmd: 'git restore .', what: 'Trash', how: 'Discarded changes wait in a trash you can restore from.' },
  { cmd: 'git log --graph', what: 'History', how: 'What you shipped, week by week, with branches drawn as lanes.' },
];

export default function Swap() {
  return (
    <div className="swap reveal-self">
      <div className="swap-top mono"><span>terminal</span><span>staged</span></div>
      <ol className="swap-list">
        {ROWS.map((r) => (
          <li className="swap-row" key={r.cmd}>
            <code className="swap-cmd mono"><i>$</i><s>{r.cmd}</s></code>
            <span className="swap-arrow" aria-hidden="true">→</span>
            <span className="swap-what"><b>{r.what}</b><span>{r.how}</span></span>
          </li>
        ))}
      </ol>
      <div className="swap-total"><span>Commands to remember</span><b>0</b></div>
    </div>
  );
}
