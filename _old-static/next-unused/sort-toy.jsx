'use client';
import { useEffect, useRef, useState } from 'react';
import { sfxGrouped, sfxDrain } from '@/lib/sfx';

// A pile of changed files that sorts itself into three commits.
// Everything is laid out in container units (cqw), so it scales with the tile.
const COMMITS = [
  { msg: 'Added a label printer', kind: 'feat', files: ['sound.js', 'printer.js', 'printer.css'] },
  { msg: 'Updated the guide', kind: 'docs', files: ['guide.md', 'hold.png'] },
  { msg: 'Kept the sidebar fixed while you scroll', kind: 'fix', files: ['sidebar.js', 'sidebar.css'] },
];
const FONT = 2.7, CH = 0.6 * FONT, PAD = 2.4, GAP = 1.4, CARD_H = 20.5, CARD_GAP = 3, TOP = 4;
const chipW = (name) => name.length * CH + PAD * 2 + 2.2; // + the dot

const FILES = [];
COMMITS.forEach((c, ci) => {
  let x = 7;
  c.files.forEach((f) => { FILES.push({ name: f, ci, x, y: TOP + ci * (CARD_H + CARD_GAP) + 10.6, w: chipW(f) }); x += chipW(f) + GAP; });
});

// A messy but deterministic pile for the first render, so server and browser agree.
const seeded = (seed) => () => ((seed = (seed * 16807) % 2147483647) - 1) / 2147483646;
// Loose grid slots, shuffled and jittered, so chips scatter without hiding each other.
const SLOTS = [[8, 10], [52, 8], [28, 24], [62, 27], [6, 40], [44, 44], [24, 58], [60, 60]];
function pile(rand) {
  const order = SLOTS.map((s, i) => [rand(), i]).sort((a, b) => a[0] - b[0]).map(([, i]) => SLOTS[i]);
  return FILES.map((f, i) => {
    const [sx, sy] = order[i];
    return { x: Math.min(96 - f.w, Math.max(3, sx + (rand() - 0.5) * 8)), y: sy + (rand() - 0.5) * 5, r: (rand() - 0.5) * 18 };
  });
}
const FIRST = pile(seeded(7));

export default function SortToy() {
  const ref = useRef(null);
  const [sorted, setSorted] = useState(false);
  const [mess, setMess] = useState(FIRST);
  const [busy, setBusy] = useState(false);
  const auto = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting || auto.current) return;
      auto.current = true;
      setTimeout(() => setSorted(true), reduce ? 0 : 700);
      io.disconnect();
    }, { threshold: 0.55 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const toggle = () => {
    if (busy) return;
    setBusy(true);
    setTimeout(() => setBusy(false), 900);
    if (sorted) { setMess(pile(Math.random)); setSorted(false); sfxDrain(); }
    else { setSorted(true); sfxGrouped(3); }
  };

  return (
    <div className={sorted ? 'sort is-sorted' : 'sort'} ref={ref}>
      <div className="sort-stage">
        {COMMITS.map((c, i) => (
          <div key={c.msg} className="sort-card" style={{ top: `${TOP + i * (CARD_H + CARD_GAP)}cqw`, height: `${CARD_H}cqw`, '--i': i }}>
            <span className={`sort-kind k-${c.kind}`}>{c.kind}</span>
            <span className="sort-msg">{c.msg}</span>
          </div>
        ))}
        {FILES.map((f, i) => {
          const m = mess[i];
          const pos = sorted ? { x: f.x, y: f.y, r: 0 } : m;
          return (
            <span key={f.name} className={`sort-chip c${f.ci}`}
              style={{ left: `${pos.x}cqw`, top: `${pos.y}cqw`, rotate: `${pos.r}deg`, width: `${f.w}cqw`, transitionDelay: `${(sorted ? i : FILES.length - i) * 45}ms` }}>
              <i />{f.name}
            </span>
          );
        })}
        <div className="sort-count mono" aria-live="polite">{sorted ? '3 commits ready' : '7 changed files'}</div>
      </div>
      <button type="button" className="sort-btn" onClick={toggle}>
        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" aria-hidden="true"><path d="M20 12C20 16.4183 16.4183 20 12 20C7.58172 20 4 16.4183 4 12C4 7.58172 7.58172 4 12 4C14.5 4 16.7 5.15 18.2 6.95M20 4V8H16" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" /></svg>
        {sorted ? 'Mess it up' : 'Sort'}
      </button>
    </div>
  );
}
