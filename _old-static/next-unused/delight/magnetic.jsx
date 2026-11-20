'use client';
import { useEffect } from 'react';
import { finePointer, reducedMotion } from './util';

// Buttons marked data-magnetic lean up to 4px toward the pointer when it is near,
// and spring back when it leaves. Driven by a tiny spring so there is a little overshoot.
const REACH = 56, MAX = 4;

export function Magnetic() {
  useEffect(() => {
    if (!finePointer() || reducedMotion()) return;
    const items = [...document.querySelectorAll('[data-magnetic]')].map((el) => ({ el, x: 0, y: 0, vx: 0, vy: 0, tx: 0, ty: 0 }));
    let raf = 0;

    const step = () => {
      let busy = false;
      for (const m of items) {
        m.vx = m.vx * 0.74 + (m.tx - m.x) * 0.16; m.vy = m.vy * 0.74 + (m.ty - m.y) * 0.16;
        m.x += m.vx; m.y += m.vy;
        const rest = Math.abs(m.vx) + Math.abs(m.vy) < 0.01 && Math.abs(m.tx - m.x) + Math.abs(m.ty - m.y) < 0.01;
        if (rest) { m.x = m.tx; m.y = m.ty; m.el.style.translate = m.tx || m.ty ? `${m.tx}px ${m.ty}px` : ''; }
        else { busy = true; m.el.style.translate = `${m.x.toFixed(2)}px ${m.y.toFixed(2)}px`; }
      }
      raf = busy ? requestAnimationFrame(step) : 0;
    };
    const wake = () => { if (!raf) raf = requestAnimationFrame(step); };

    const aim = (e) => {
      for (const m of items) {
        const r = m.el.getBoundingClientRect();
        const dx = Math.max(r.left - e.clientX, 0, e.clientX - r.right), dy = Math.max(r.top - e.clientY, 0, e.clientY - r.bottom);
        const d = Math.hypot(dx, dy), near = d < REACH;
        const f = near ? 1 - d / REACH : 0;
        const nx = near ? Math.max(-MAX, Math.min(MAX, ((e.clientX - (r.left + r.width / 2)) / (r.width / 2)) * MAX * f)) : 0;
        const ny = near ? Math.max(-MAX, Math.min(MAX, ((e.clientY - (r.top + r.height / 2)) / (r.height / 2)) * MAX * f)) : 0;
        if (nx !== m.tx || ny !== m.ty) { m.tx = nx; m.ty = ny; wake(); }
      }
    };
    const release = () => { for (const m of items) { m.tx = 0; m.ty = 0; } wake(); };

    addEventListener('pointermove', aim, { passive: true });
    document.documentElement.addEventListener('pointerleave', release);
    addEventListener('blur', release);
    return () => {
      removeEventListener('pointermove', aim); removeEventListener('blur', release);
      document.documentElement.removeEventListener('pointerleave', release);
      cancelAnimationFrame(raf);
      for (const m of items) m.el.style.translate = '';
    };
  }, []);
  return null;
}
