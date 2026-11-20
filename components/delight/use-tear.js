'use client';
import { useRef } from 'react';
import { sfxTear } from '@/lib/sfx';
import { reducedMotion } from './util';

// Drag a printed receipt down and it tears off along a zigzag, flutters away, and the printer resets.
const THRESHOLD = 84;

// A jagged top edge, like paper that has just been ripped.
function ragged(width) {
  const pts = [];
  for (let x = 0, i = 0; x <= width; x += 10, i += 1) {
    pts.push(`${x}px 0px`, `${Math.min(x + 5, width)}px ${4 + ((i * 7) % 5)}px`);
  }
  return `polygon(${pts.join(',')},${width}px 100%,0px 100%)`;
}

export function useTear({ paperRef, enabled, onTorn, onGone }) {
  const drag = useRef(null);

  const set = (dx, dy) => {
    const el = paperRef.current;
    if (!el) return;
    el.style.setProperty('--dx', `${dx}px`);
    el.style.setProperty('--dy', `${dy}px`);
    el.style.setProperty('--rot', `${Math.max(-5, Math.min(5, dx * 0.04))}deg`);
  };

  const tear = (dx = 0, dy = 0) => {
    const el = paperRef.current;
    drag.current = null;
    sfxTear();
    onTorn();
    if (!el) return onGone();
    const sheet = el.querySelector('.receipt');
    if (sheet) sheet.style.clipPath = ragged(sheet.offsetWidth);
    el.classList.remove('is-dragging');
    el.classList.add('is-torn');
    if (reducedMotion()) { setTimeout(onGone, 350); return; }
    const rot = parseFloat(el.style.getPropertyValue('--rot')) || 0;
    const at = (x, y, r, o = 1) => ({ transform: `translate(${dx + x}px, ${dy + y}px) rotate(${rot + r}deg)`, opacity: o });
    const fall = el.animate([at(0, 0, 0), { ...at(-20, 70, -8), offset: 0.3 }, { ...at(24, 170, 12), offset: 0.62 }, at(10, 330, 22, 0)],
      { duration: 1150, easing: 'cubic-bezier(.4,.1,.5,1)', fill: 'forwards' });
    fall.onfinish = onGone;
  };

  const bind = enabled ? {
    onPointerDown: (e) => {
      if (drag.current) return;
      e.currentTarget.setPointerCapture?.(e.pointerId);
      drag.current = { x: e.clientX, y: e.clientY, dx: 0, dy: 0 };
      e.currentTarget.classList.add('is-dragging');
    },
    onPointerMove: (e) => {
      const d = drag.current;
      if (!d) return;
      d.dx = Math.max(-40, Math.min(40, e.clientX - d.x));
      d.dy = Math.max(0, e.clientY - d.y) * 0.9;
      set(d.dx * 0.5, d.dy);
      if (d.dy > THRESHOLD) tear(d.dx * 0.5, d.dy);
    },
    onPointerUp: (e) => {
      const el = e.currentTarget;
      if (!drag.current) return;
      drag.current = null;
      el.classList.remove('is-dragging');
      set(0, 0); // springs back
    },
    onPointerCancel: (e) => { drag.current = null; e.currentTarget.classList.remove('is-dragging'); set(0, 0); },
  } : {};

  return { bind, tear };
}
