'use client';
import { useEffect, useRef, useState } from 'react';
import { reducedMotion } from './util';

// As you scroll from the hero toward the features, a few files drift from the
// margins into the demo window and settle in a neat column, like Staged sorting
// a pile. Scrubbed by scroll position; transform and opacity only.
// Absolutely positioned inside .hero, so it never touches the layout.
const FILES = [
  { name: 'printer.js', on: true, x: 0.0, y: 300, r: -6 },
  { name: 'printer.css', on: true, x: 0.9, y: 250, r: 5 },
  { name: 'cart.js', on: true, x: -0.01, y: 440, r: 4 },
  { name: 'sidebar.css', on: false, x: 0.89, y: 410, r: -4 },
  { name: 'guide.md', on: false, x: 0.0, y: 560, r: -3 },
  { name: 'README.md', on: false, x: 0.9, y: 540, r: 6 },
];
const STAGGER = 0.07;
const ease = (t) => t * t * (3 - 2 * t);
const clamp = (v) => Math.max(0, Math.min(1, v));

export function ScrollStory() {
  const root = useRef(null);
  const [on, setOn] = useState(false);
  useEffect(() => { setOn(!reducedMotion()); }, []);

  useEffect(() => {
    if (!on) return;
    const hero = root.current.parentElement;
    const pills = [...root.current.children];
    let geo = null, raf = 0;

    const measure = () => {
      const win = hero.querySelector('.window');
      if (!win) return;
      const h = hero.getBoundingClientRect(), w = win.getBoundingClientRect();
      const top = h.top + scrollY, winTop = w.top + scrollY;
      const colTop = winTop - top + 40 + (w.height - 40) * 0.37;
      geo = {
        W: h.width,
        end: FILES.map((_, i) => ({ x: w.left - h.left + 24, y: colTop + i * 34 })),
        from: 40, to: Math.max(300, winTop - innerHeight * 0.3),
      };
    };
    const paint = () => {
      raf = 0;
      if (!geo) return;
      const s = clamp((scrollY - geo.from) / (geo.to - geo.from));
      FILES.forEach((f, i) => {
        const t = clamp((s - i * STAGGER) / (1 - (FILES.length - 1) * STAGGER));
        const e = ease(t);
        const x = f.x * geo.W + (geo.end[i].x - f.x * geo.W) * e;
        const y = f.y + (geo.end[i].y - f.y) * e - Math.sin(e * Math.PI) * 18;
        const el = pills[i];
        el.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0) rotate(${(f.r * (1 - e)).toFixed(2)}deg)`;
        el.style.opacity = clamp(t * 5).toFixed(2);
      });
    };
    const queue = () => { if (!raf) raf = requestAnimationFrame(paint); };
    const remeasure = () => { measure(); queue(); };

    remeasure();
    document.fonts?.ready.then(remeasure);
    const ro = new ResizeObserver(remeasure);
    ro.observe(hero);
    addEventListener('scroll', queue, { passive: true });
    addEventListener('resize', remeasure);
    return () => { ro.disconnect(); removeEventListener('scroll', queue); removeEventListener('resize', remeasure); cancelAnimationFrame(raf); };
  }, [on]);

  if (!on) return null;
  return (
    <div ref={root} className="story" aria-hidden="true">
      {FILES.map((f) => <span key={f.name} className={`story-pill mono${f.on ? ' is-on' : ''}`}><i />{f.name}</span>)}
    </div>
  );
}
