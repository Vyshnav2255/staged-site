'use client';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { reducedMotion } from './util';

// Types a string out once, the first time `ref` scrolls into view.
// Returns how many characters to show (null means "all of it": before hydration and for reduced motion).
export function useTypewriter(ref, { total, msPerChar = 15 }) {
  const [n, setN] = useState(null);
  const armed = useRef(false);
  const len = useRef(total);
  len.current = total;

  useLayoutEffect(() => {
    if (reducedMotion()) return;
    armed.current = true;
    setN(0);
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el || !armed.current) return;
    let raf = 0, t0 = 0;
    const tick = (t) => {
      t0 ||= t;
      const k = Math.floor((t - t0) / msPerChar);
      setN(k);
      if (k < len.current) raf = requestAnimationFrame(tick); else setN(null);
    };
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      io.disconnect();
      setTimeout(() => { raf = requestAnimationFrame(tick); }, 250);
    }, { threshold: 0.6 });
    io.observe(el);
    return () => { io.disconnect(); cancelAnimationFrame(raf); };
  }, [ref, msPerChar]);

  return n;
}
