'use client';
import { useEffect, useRef } from 'react';

// The footer's ghost wordmark lights up in tiny green pixels wherever the pointer is,
// clipped to the letters and the logo mark, and fades away behind it.
const COLORS = ['#c4e35a', '#9ccb3f', '#4cbb6c', '#1f9a6a', '#5fd4a4', '#a7f3d0', '#e6f7a1', '#34d399'];
const MARK = 'M18 18H6C5.05719 18 4.58579 18 4.29289 17.7071C4 17.4142 4 16.9428 4 16C4 15.0572 4 14.5858 4.29289 14.2929C4.58579 14 5.05719 14 6 14H18C18.9428 14 19.4142 14 19.7071 14.2929C20 14.5858 20 15.0572 20 16C20 16.9428 20 17.4142 19.7071 17.7071C19.4142 18 18.9428 18 18 18Z';

export default function GhostPixels() {
  const ref = useRef(null);
  useEffect(() => {
    const cv = ref.current, ghost = cv?.parentElement;
    if (!cv || !ghost || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const ctx = cv.getContext('2d');
    let W = 0, H = 0, dpr = 1, cell = 7, cols = 0, rows = 0, energy, seed, tint, mask = null, raf = 0, last = 0;
    let px = -1e4, py = -1e4, inside = false;

    const build = () => {
      const g = ghost.getBoundingClientRect();
      W = g.width; H = g.height; dpr = Math.min(devicePixelRatio || 1, 3);
      cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr);
      cell = W < 700 ? 5 : 7;
      cols = Math.ceil(W / cell); rows = Math.ceil(H / cell);
      energy = new Float32Array(cols * rows);
      seed = Float32Array.from({ length: cols * rows }, () => Math.random());
      tint = Array.from({ length: cols * rows }, () => COLORS[(Math.random() * COLORS.length) | 0]);
      // the letters and the mark, as a mask
      const m = document.createElement('canvas'); m.width = cv.width; m.height = cv.height;
      const c = m.getContext('2d'); c.scale(dpr, dpr);
      const cs = getComputedStyle(ghost), word = ghost.querySelector('.ghost-word'), svg = ghost.querySelector('.ghost-mark');
      const probe = document.createElement('i'); probe.style.cssText = 'display:inline-block;width:0;height:0'; word.append(probe);
      const base = probe.getBoundingClientRect().bottom - g.top; probe.remove();
      c.font = `${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`; c.letterSpacing = cs.letterSpacing; c.textBaseline = 'alphabetic'; c.fillStyle = '#000';
      c.fillText('staged', word.getBoundingClientRect().left - g.left, base);
      const s = svg.getBoundingClientRect(), k = s.width / 24;
      c.translate(s.left - g.left, s.top - g.top); c.scale(k, k);
      c.lineWidth = 1.75; c.lineCap = 'round'; c.lineJoin = 'round'; c.strokeStyle = '#000';
      const b3 = new Path2D(MARK); c.fill(b3); c.stroke(b3); c.stroke(new Path2D('M4 10H20')); c.stroke(new Path2D('M4 6H20'));
      mask = m;
    };

    const frame = (now) => {
      const dt = Math.min(64, now - (last || now)); last = now;
      const R = Math.max(48, W * .07);                   // brush radius
      const decay = Math.pow(0.5, dt / 260);             // half-life ~260ms
      let alive = false;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0); ctx.globalCompositeOperation = 'source-over'; ctx.clearRect(0, 0, W, H);
      const c0 = Math.max(0, Math.floor((px - R) / cell)), c1 = Math.min(cols - 1, Math.ceil((px + R) / cell));
      const r0 = Math.max(0, Math.floor((py - R) / cell)), r1 = Math.min(rows - 1, Math.ceil((py + R) / cell));
      const flick = Math.floor(now / 90);
      for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
        const i = r * cols + c;
        let e = energy[i] * decay;
        if (inside && c >= c0 && c <= c1 && r >= r0 && r <= r1) {
          const dx = (c + .5) * cell - px, dy = (r + .5) * cell - py, d = Math.sqrt(dx * dx + dy * dy) / R;
          if (d < 1) e = Math.max(e, (1 - d * d) * (.55 + .45 * seed[i]));
        }
        energy[i] = e;
        if (e < .03) continue;
        alive = true;
        const n = (seed[i] + ((flick + i) % 5) * .02) % 1;
        if (n > e * 1.3) continue;                        // sparse at the edges, dense at the centre
        ctx.globalAlpha = Math.min(1, e * 1.4);
        ctx.fillStyle = e > .85 && seed[i] > .8 ? '#ffffff' : tint[i];
        ctx.fillRect(c * cell, r * cell, cell - 1, cell - 1);
      }
      if (mask) { ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = 1; ctx.globalCompositeOperation = 'destination-in'; ctx.drawImage(mask, 0, 0); }
      raf = alive || inside ? requestAnimationFrame(frame) : 0;
      if (!raf) last = 0;
    };
    const kick = () => { if (!raf) raf = requestAnimationFrame(frame); };

    const onMove = (e) => {
      const g = ghost.getBoundingClientRect();
      px = e.clientX - g.left; py = e.clientY - g.top;
      inside = px > -40 && py > -40 && px < g.width + 40 && py < g.height + 40;
      if (inside) { if (!mask) build(); kick(); }
    };
    const onLeave = () => { inside = false; };
    const onResize = () => { mask = null; if (raf) build(); };
    const footer = ghost.closest('footer') || document;
    footer.addEventListener('pointermove', onMove, { passive: true });
    footer.addEventListener('pointerleave', onLeave);
    addEventListener('resize', onResize);
    document.fonts?.ready.then(() => { mask = null; });
    return () => { cancelAnimationFrame(raf); footer.removeEventListener('pointermove', onMove); footer.removeEventListener('pointerleave', onLeave); removeEventListener('resize', onResize); };
  }, []);
  return <canvas ref={ref} className="ghost-px" aria-hidden="true" />;
}
