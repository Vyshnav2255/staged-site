'use client';
import { useEffect, useRef, useState } from 'react';
import { reducedMotion } from './util';

// "01" as rolling digits: each column holds 0-9 twice and spins to its number
// the first time it scrolls into view, like an odometer. With `from` (same length), each column
// starts on its old digit and rolls forward to the new one, so 0004 → 0005 only turns the last wheel.
const ROWS = [...Array(20).keys()].map((n) => n % 10);

export function Odometer({ value, from }) {
  const ref = useRef(null);
  const [state, setState] = useState('done'); // done (server, reduced motion) | armed | rolling
  useEffect(() => {
    if (reducedMotion()) return;
    const el = ref.current;
    setState('armed');
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      io.disconnect(); setState('rolling');
    }, { rootMargin: '0px 0px -12% 0px' });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <span ref={ref} className={`odo is-${state}`} role="text" aria-label={value}>
      {[...value].map((ch, i) => (
        <span className="odo-col" key={i} aria-hidden="true" style={{ '--to': 10 + Number(ch), '--k': i, ...(from ? { '--from': Number(ch) >= Number(from[i]) ? 10 + Number(from[i]) : Number(from[i]) } : null) }}>
          <span className="odo-strip">{ROWS.map((n, j) => <i key={j}>{n}</i>)}</span>
        </span>
      ))}
    </span>
  );
}
