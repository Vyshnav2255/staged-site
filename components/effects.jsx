'use client';
import { useEffect, useRef, useState } from 'react';
import { asset } from '@/lib/site';

// Small page-wide behaviours: the nav state once you scroll, one reveal recipe on scroll,
// and a soft spotlight that follows the pointer across cards.
export function PageEffects() {
  useEffect(() => {
    const nav = document.getElementById('nav');
    // The nav starts clear over the hero and fills in to the frosted pill as you scroll past it:
    // --np runs 0 to 1 from the top of the page to where the demo meets the nav.
    const demo = document.querySelector('.hero .demo');
    let end = 600;
    const measure = () => { end = Math.max(200, (demo ? demo.getBoundingClientRect().top + scrollY : 700) - 120); };
    const onScroll = () => {
      nav?.classList.toggle('is-stuck', scrollY > end);
      nav?.style.setProperty('--np', String(Math.min(1, Math.max(0, scrollY / end)).toFixed(3)));
    };
    measure();
    const onResize = () => { measure(); onScroll(); };
    addEventListener('resize', onResize, { passive: true });
    addEventListener('scroll', onScroll, { passive: true }); onScroll();

    // .reveal-group staggers its children (index into --i, capped), .reveal / .reveal-self move as one.
    document.querySelectorAll('.reveal-group').forEach((g) => {
      const cap = Number(g.dataset.cap || 6);
      [...g.children].forEach((c, i) => c.style.setProperty('--i', String(Math.min(i, cap))));
    });
    const io = new IntersectionObserver((es) => {
      for (const e of es) if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); }
    }, { rootMargin: '0px 0px -12% 0px', threshold: 0.15 });
    document.querySelectorAll('.reveal, .reveal-self, .reveal-group').forEach((el) => io.observe(el));
    // The footer wordmark sits at the very end of the page, where the -12% margin can never reach it (phones).
    const atEnd = () => {
      if (innerHeight + scrollY >= document.documentElement.scrollHeight - 4) document.querySelectorAll('.reveal-self:not(.is-in), .reveal-group:not(.is-in)').forEach((el) => { if (el.getBoundingClientRect().top < innerHeight) el.classList.add('is-in'); });
    };
    addEventListener('scroll', atEnd, { passive: true });

    const glow = (e) => {
      const card = e.target.closest?.('.feat, .diff-card');
      if (!card) return;
      const r = card.getBoundingClientRect();
      card.style.setProperty('--mx', `${e.clientX - r.left}px`);
      card.style.setProperty('--my', `${e.clientY - r.top}px`);
    };
    addEventListener('pointermove', glow, { passive: true });
    return () => { removeEventListener('scroll', onScroll); removeEventListener('resize', onResize); removeEventListener('scroll', atEnd); removeEventListener('pointermove', glow); io.disconnect(); };
  }, []);
  return null;
}

// The demo: plays while at least a quarter of it is on screen, with a small ghost control
// for anyone who wants it to stop. Reduced motion: no autoplay, native controls instead.
// On a phone it is cropped to the cart and the push button, with a button to see it whole, full screen.
export function DemoVideo() {
  const ref = useRef(null);
  const [paused, setPaused] = useState(false);
  const [still, setStill] = useState(false);
  const userPaused = useRef(false);
  useEffect(() => {
    const v = ref.current;
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) { v.removeAttribute('autoplay'); v.pause(); v.controls = true; setStill(true); return; }
    const io = new IntersectionObserver(([e]) => {
      if (e.intersectionRatio < 0.25) v.pause();
      else if (!userPaused.current) v.play().catch(() => {});
    }, { threshold: [0, 0.25, 0.5] });
    io.observe(v);
    const sync = () => setPaused(v.paused);
    v.addEventListener('play', sync); v.addEventListener('pause', sync);
    // Full screen shows the native controls; back on the page, the quiet ghost control returns.
    const fs = () => { const on = document.fullscreenElement === v || document.webkitFullscreenElement === v; v.controls = on; if (on) v.play().catch(() => {}); };
    document.addEventListener('fullscreenchange', fs); document.addEventListener('webkitfullscreenchange', fs);
    return () => { io.disconnect(); v.removeEventListener('play', sync); v.removeEventListener('pause', sync); document.removeEventListener('fullscreenchange', fs); document.removeEventListener('webkitfullscreenchange', fs); };
  }, []);
  const toggle = () => {
    const v = ref.current;
    if (v.paused) { userPaused.current = false; v.play().catch(() => {}); } else { userPaused.current = true; v.pause(); }
  };
  const full = () => {
    const v = ref.current;
    if (v.requestFullscreen) v.requestFullscreen().then(() => screen.orientation?.lock?.('landscape').catch(() => {})).catch(() => {});
    else if (v.webkitRequestFullscreen) v.webkitRequestFullscreen();
    else if (v.webkitEnterFullscreen) v.webkitEnterFullscreen(); // iOS Safari: the native player
  };
  return (
    <>
      <video ref={ref} autoPlay muted loop playsInline preload="metadata" poster={asset('/img/demo-light-poster.webp?v=2')} src={asset('/img/demo-light.mp4?v=2')}
        aria-label="Staged in use: a suggested commit is added to the cart, the button is held to push, a receipt prints, then Run starts the dev server." />
      {!still && (
        <button type="button" className="demo-ctl" onClick={toggle} aria-label={paused ? 'Play the demo' : 'Pause the demo'}>
          {paused
            ? <svg viewBox="0 0 24 24" width="14" height="14" fill="none" aria-hidden="true"><path d="M18.9 12.9C18.5 14.4 16.8 15.4 13.4 17.4C10.1 19.3 8.5 20.3 7.1 19.9C6.6 19.7 6.1 19.4 5.7 19C4.7 18 4.7 16 4.7 12C4.7 8 4.7 6 5.7 5C6.1 4.6 6.6 4.3 7.1 4.1C8.5 3.7 10.1 4.7 13.4 6.6C16.8 8.6 18.5 9.6 18.9 11.1C19.1 11.7 19.1 12.3 18.9 12.9Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" /></svg>
            : <svg viewBox="0 0 24 24" width="14" height="14" fill="none" aria-hidden="true"><path d="M4 7C4 5.6 4 4.9 4.4 4.4C4.9 4 5.6 4 7 4C8.4 4 9.1 4 9.6 4.4C10 4.9 10 5.6 10 7V17C10 18.4 10 19.1 9.6 19.6C9.1 20 8.4 20 7 20C5.6 20 4.9 20 4.4 19.6C4 19.1 4 18.4 4 17V7Z" stroke="currentColor" strokeWidth="1.5" /><path d="M14 7C14 5.6 14 4.9 14.4 4.4C14.9 4 15.6 4 17 4C18.4 4 19.1 4 19.6 4.4C20 4.9 20 5.6 20 7V17C20 18.4 20 19.1 19.6 19.6C19.1 20 18.4 20 17 20C15.6 20 14.9 20 14.4 19.6C14 19.1 14 18.4 14 17V7Z" stroke="currentColor" strokeWidth="1.5" /></svg>}
        </button>
      )}
      {!still && (
        <button type="button" className="demo-ctl demo-full" onClick={full} aria-label="Watch the demo full screen">
          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" aria-hidden="true"><path d="M4 9V7C4 5.34 5.34 4 7 4H9M15 4H17C18.66 4 20 5.34 20 7V9M20 15V17C20 18.66 18.66 20 17 20H15M9 20H7C5.34 20 4 18.66 4 17V15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
        </button>
      )}
    </>
  );
}
