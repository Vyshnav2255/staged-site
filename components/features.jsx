'use client';
import '@/app/features.css';
import { useEffect, useId, useRef, useState } from 'react';
import { sfxApproved } from '@/lib/sfx';
import SortArt from '@/components/features/sort';
import WriteArt from '@/components/features/write';
import UndoArt from '@/components/features/undo';
import HistoryArt from '@/components/features/history';
// Run is hidden for now (user asked 2026-11-21). To bring it back, import RunDeck
// from '@/components/features/run-deck' and restore the feat-run card below.

// The features grid: four cards, two by two (one column under 900px), then a
// wide Run card with a working cassette deck like the app's (run-deck.jsx). Each card
// is one white surface: a title, a line of copy, then one small conceptual
// drawing (an inline SVG of a handful of shapes; rules at the top of
// app/features.css). A drawing makes one small move while its card plays: on
// hover with a mouse, or when the card scrolls into view on a touch screen (a
// tap replays it). Cart, hold and receipt are not here: the try-it section
// right under the grid lets you use the real ones.
// One extra lives here too: the Konami code turns every drawing into a
// blueprint for ten seconds. A quiet keycap under the grid's corner hints at it.

const CARDS = [
  { id: 'sort', art: SortArt, title: 'Sorts your changes', text: 'Forty changed files become a few clean commits. A feature travels with its styles and the lines that hook it in.' },
  { id: 'write', art: WriteArt, title: 'Writes the message', text: 'Reads the diff and says what changed, in the style your repo already uses.' },
  { id: 'undo', art: UndoArt, title: 'Undo by default', text: 'Discarded changes go to a trash you can restore from. The last commit has an Undo too.' },
  { id: 'history', art: HistoryArt, title: 'History you can read', text: 'What you shipped, week by week. Every branch, merge and tag drawn as lanes.' },
];

const KONAMI = ['arrowup', 'arrowup', 'arrowdown', 'arrowdown', 'arrowleft', 'arrowright', 'arrowleft', 'arrowright', 'b', 'a'].join(' ');
const BLUEPRINT_MS = 10000;

// ↑↑↓↓←→←→BA anywhere on the page: blueprint mode for 10s (again extends it).
function useBlueprint(root) {
  useEffect(() => {
    let keys = [], timer = 0;
    const onKey = (e) => {
      if (e.repeat || e.target.closest?.('input, textarea, select, [contenteditable]')) return;
      keys = [...keys, e.key.toLowerCase()].slice(-10);
      if (keys.join(' ') !== KONAMI) return;
      keys = [];
      root.current?.classList.add('is-blueprint');
      dispatchEvent(new CustomEvent('staged:egg', { detail: 'konami' }));
      sfxApproved();
      clearTimeout(timer);
      timer = setTimeout(() => root.current?.classList.remove('is-blueprint'), BLUEPRINT_MS);
    };
    addEventListener('keydown', onKey);
    return () => { removeEventListener('keydown', onKey); clearTimeout(timer); };
  }, [root]);
}

// Stories. A card plays while it has .is-play (every story selector in
// features.css hangs off it) (feat:play / feat:stop fire too).
// Mouse and pen: plays while the pointer is over the card. Touch screens: plays
// once when 60% of the card is in view, rests again when it has left, and a tap
// replays it from the start.
function useStories(root) {
  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const cards = [...el.querySelectorAll('.feat')];
    const play = (c) => { if (!c.classList.contains('is-play')) { c.classList.add('is-play'); c.dispatchEvent(new CustomEvent('feat:play')); } };
    const stop = (c) => { if (c.classList.contains('is-play')) { c.classList.remove('is-play'); c.dispatchEvent(new CustomEvent('feat:stop')); } };
    // back to rest with transitions off, then play again
    const replay = (c) => { c.classList.add('is-rewind'); stop(c); void c.offsetWidth; c.classList.remove('is-rewind'); play(c); };
    const fine = (e) => e.pointerType !== 'touch';
    const onEnter = (e) => { if (fine(e)) play(e.currentTarget); };
    const onLeave = (e) => { if (fine(e)) stop(e.currentTarget); };
    let lastTouch = false;
    const onDown = (e) => { lastTouch = !fine(e); };
    const onClick = (e) => { if (lastTouch && !e.target.closest('a, button')) replay(e.currentTarget); };
    cards.forEach((c) => {
      c.addEventListener('pointerenter', onEnter);
      c.addEventListener('pointerleave', onLeave);
      c.addEventListener('pointerdown', onDown);
      c.addEventListener('click', onClick);
    });
    let io;
    const touch = matchMedia('(hover: none)');
    const watch = () => {
      io?.disconnect(); io = undefined;
      if (!touch.matches) return;
      io = new IntersectionObserver((entries) => entries.forEach((en) => {
        if (en.intersectionRatio >= 0.6) play(en.target);
        else if (!en.isIntersecting) stop(en.target);
      }), { threshold: [0, 0.6] });
      cards.forEach((c) => io.observe(c));
    };
    watch();
    touch.addEventListener('change', watch);
    return () => {
      io?.disconnect();
      touch.removeEventListener('change', watch);
      cards.forEach((c) => {
        stop(c);
        c.removeEventListener('pointerenter', onEnter);
        c.removeEventListener('pointerleave', onLeave);
        c.removeEventListener('pointerdown', onDown);
        c.removeEventListener('click', onClick);
      });
    };
  }, [root]);
}

// A tiny keycap under the grid's bottom-right corner. Hover or focus shows the
// code in a tooltip; a tap toggles it; Escape closes it.
function KonamiHint() {
  const [open, setOpen] = useState(false);
  const id = useId();
  return (
    <span className={`konami${open ? ' is-open' : ''}`} onMouseLeave={() => setOpen(false)}>
      <button type="button" className="konami-hint" aria-label="A hint" aria-describedby={id}
        onClick={() => setOpen((o) => !o)} onBlur={() => setOpen(false)}
        onKeyDown={(e) => { if (e.key === 'Escape') { setOpen(false); e.currentTarget.blur(); } }}>
        <span aria-hidden="true">?</span>
      </button>
      <span role="tooltip" id={id} className="konami-tip">psst… <b>↑↑↓↓←→←→BA</b></span>
    </span>
  );
}

export default function Features() {
  const root = useRef(null);
  useBlueprint(root);
  useStories(root);
  return (
    <div className="bento" ref={root}>
      {CARDS.map(({ id, art: Art, title, text }, i) => (
        <article key={id} className={`feat reveal feat-${id}`} style={{ '--i': i }}>
          <div className="feat-head">
            <h3>{title}</h3>
            <p>{text}</p>
          </div>
          <div className="feat-art">
            <Art />
            <span className="bp-tag" aria-hidden="true">blueprint mode</span>
          </div>
        </article>
      ))}
      <KonamiHint />
    </div>
  );
}
