'use client';
import { useEffect, useRef } from 'react';

// A burst of tiny square pixels that rises from the bar's bottom edge and sweeps left to right,
// like a little equaliser glow. Plays once each time `run` changes (and is > 0).
const COLORS = ['#c4e35a', '#9ccb3f', '#4cbb6c', '#1f9a6a', '#5fd4a4', '#a7f3d0', '#e6f7a1', '#34d399'];
const CELL = 4, GAP = 1;   // 3px squares on a 4px grid
const DUR = 1500;

export default function PixelBloom({ run }) {
  const ref = useRef(null);
  useEffect(() => {
    if (!run) return;
    const cv = ref.current; if (!cv) return;
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const dpr = Math.min(devicePixelRatio || 1, 4);
    const W = cv.clientWidth, H = cv.clientHeight;
    cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr);
    const ctx = cv.getContext('2d'); ctx.scale(dpr, dpr);
    const cols = Math.ceil(W / CELL), rows = Math.ceil(H / CELL);
    // stable per-cell noise and colour, so pixels feel placed, not random every frame
    const seed = Array.from({ length: cols * rows }, () => Math.random());
    const tint = Array.from({ length: cols * rows }, () => COLORS[(Math.random() * COLORS.length) | 0]);
    const t0 = performance.now();
    let raf = 0;
    const frame = () => {
      const now = performance.now();
      const t = Math.min(1, (now - t0) / DUR);
      ctx.clearRect(0, 0, W, H);
      const cx = -0.15 + t * 1.35;                     // the bright centre sweeps across
      const fade = t < .7 ? 1 : 1 - (t - .7) / .3;     // then everything dims away
      const step = Math.floor(now / 70);               // a little flicker, in steps
      // a soft glow under the brightest part, like light leaking up from the edge
      const gx = cx * W, g = ctx.createRadialGradient(gx, H, 0, gx, H, W * .22);
      g.addColorStop(0, `rgba(196, 227, 90, ${.35 * fade})`); g.addColorStop(.5, `rgba(76, 187, 108, ${.14 * fade})`); g.addColorStop(1, 'rgba(76, 187, 108, 0)');
      ctx.globalAlpha = 1; ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
      for (let c = 0; c < cols; c++) {
        const x = c / cols;
        const near = Math.exp(-((x - cx) ** 2) / (2 * 0.16 ** 2));        // bell around the centre
        const trail = x < cx ? Math.max(0, 1 - (cx - x) / 0.9) * 0.55 : 0; // a softer trail behind it
        const amp = Math.max(near, trail);
        if (amp < .02) continue;
        for (let r = 0; r < rows; r++) {
          const i = r * cols + c;
          const h = r / rows;                                              // 0 at the bottom edge
          if (h > .62) break;                                              // keep the text clear
          const p = Math.min(1, 1.5 * amp * Math.exp(-h / (0.1 + 0.22 * near))); // dense at the edge, taller where brightest
          const n = (seed[i] + ((step + i) % 7) * 0.013) % 1;
          if (n > p) continue;
          ctx.globalAlpha = Math.min(1, (p - n) * 2.4 + .25) * fade * (near > .6 && h < .15 ? 1 : .85);
          ctx.fillStyle = near > .85 && h < .12 && seed[i] > .7 ? '#ffffff' : tint[i];
          ctx.fillRect(c * CELL, H - (r + 1) * CELL, CELL - GAP, CELL - GAP);
        }
      }
      if (t < 1) raf = requestAnimationFrame(frame); else ctx.clearRect(0, 0, W, H);
    };
    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, [run]);
  return <canvas ref={ref} className="px-bloom" aria-hidden="true" />;
}
