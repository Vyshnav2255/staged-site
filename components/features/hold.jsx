import { HOLD_S } from './data';

// Hold to push: three commits wait on main, the button fills while it is held
// (the solid green fill and the elapsed stretch of the ruler under it are the
// accent), and only a full hold sends them over to origin/main.
// Rest shows the hold 30% of the way; hover plays press, the full 1.4s fill, push.
const PART = `${(HOLD_S * 0.3).toFixed(1)}s`, FULL = `${HOLD_S}s`;

function Cursor() {
  return (
    <svg className="cursor" viewBox="0 0 24 26" width="24" height="26">
      <path d="M5 3.2v15.1c0 .5.6.8 1 .4l3.7-3.5 2.6 5.900c.2.4.6.5 1 .4l1.600-.7c.4-.2.5-.6.4-1l-2.600-5.800h5c.6 0 .8-.6.4-1L6 2.800c-.4-.4-1-.1-1 .4Z" />
    </svg>
  );
}

export default function HoldArt() {
  return (
    <div className="art art-hold" aria-hidden="true">
      <div className="route">
        <span className="chip"><i className="rdot" />main</span>
        <span className="track">
          <i className="rail" />
          {[0, 1, 2].map((n) => <i key={n} className="c" style={{ '--n': n }} />)}
        </span>
        <span className="chip origin">
          origin/main
          <svg className="ok" viewBox="0 0 12 12" width="12" height="12"><path d="M2.500 6.400l2.300 2.300 4.700-5.200" pathLength="1" /></svg>
        </span>
      </div>
      <svg className="conn" viewBox="0 0 388 270" width="388" height="270">
        <path className="up" d="M194 110V44" /><path d="M190 47.500L194 43.500L198 47.500" />
      </svg>
      <i className="ring" />
      <div className="hbtn panel">
        <i className="fill" />
        <span className="lbl"><span>Hold to push</span><span>Pushed</span></span>
        <span className="secs mono"><span>{PART}</span><span>{FULL}</span></span>
      </div>
      <Cursor />
      <div className="ruler">
        <i className="done" />
        {[0, 1, 2, 3, 4, 5, 6].map((n) => <i key={n} className="tick" style={{ left: `${(n / 6) * 100}%` }} />)}
      </div>
      <span className="cap mono"><span>0s</span><span>let go early, nothing happens</span><span>{FULL}</span></span>
    </div>
  );
}
