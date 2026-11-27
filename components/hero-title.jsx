'use client';
import { useEffect, useState } from 'react';

// Hero: "Git, without [$ the terminal]" with the terminal struck out by a lime marker,
// then a ticker that swaps a real git command for the Staged button that replaces it.
const SWAPS = [
  { cmd: 'git add -p && git commit -m "…"', btn: 'Sorted and named', dot: false },
  { cmd: 'git push --force-with-lease', btn: 'Hold to push', dot: false },
  { cmd: 'npm run dev', btn: 'Run', dot: true },
  { cmd: 'git pull --rebase', btn: 'Pull', dot: false },
  { cmd: 'git restore .', btn: 'Trash', dot: false },
];

export function HeroTitle() {
  return (
    <h1 className="h1x">
      <span className="h1-line"><span style={{ '--l': 0 }}>Git, without</span></span>
      <span className="h1-line h1-last"><span style={{ '--l': 1 }}>
        <span className="h1-term">
          <span className="ht-prompt" aria-hidden="true">$</span>
          <span className="ht-text">the terminal
            <svg className="ht-strike" viewBox="0 0 400 40" preserveAspectRatio="none" aria-hidden="true">
              <path d="M4 24 C 70 14, 130 30, 200 20 S 330 14, 396 21" pathLength="1" />
            </svg>
          </span>
          <span className="ht-caret" aria-hidden="true" />
        </span>
      </span></span>
    </h1>
  );
}

export function HeroSwap() {
  const [i, setI] = useState(0);
  useEffect(() => {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const t = setInterval(() => setI((x) => (x + 1) % SWAPS.length), 2600);
    return () => clearInterval(t);
  }, []);
  const s = SWAPS[i];
  return (
    <div className="hswap in" style={{ '--i': 3 }} aria-label="Every git command is a button in Staged">
      <span className="hs-row" key={i}>
        <span className="hs-cmd mono"><span className="hs-p">$</span><s>{s.cmd}</s></span>
        <svg className="hs-arrow" viewBox="0 0 24 24" width="16" height="16" fill="none" aria-hidden="true"><path d="M4 12h15m0 0-5-5m5 5-5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
        <span className="hs-btn">{s.dot && <i className="hs-live" />}{s.btn}</span>
      </span>
    </div>
  );
}
