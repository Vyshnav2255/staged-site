'use client';
import '@/app/features.css';
import { useEffect, useId, useRef, useState } from 'react';
import { sfxApproved } from '@/lib/sfx';
import SortArt from '@/components/features/sort';
import SortPhoneArt from '@/components/features/sort-phone';
import WriteArt from '@/components/features/write';
import CartArt from '@/components/features/cart';
import HoldArt from '@/components/features/hold';
import ReceiptArt from '@/components/features/receipt';
import UndoArt from '@/components/features/undo';
import HistoryArt from '@/components/features/history';

// The features grid: seven cards on a 12-column grid (8+4 / 4+4+4 / 4+8).
// Each card is one white surface: a title, a line of copy, then a line drawing
// with flat grey and green fills (outlined DOM objects and type, SVG for the
// curves) that follows the rules at the top of app/features.css. Each one is laid
// out on a fixed stage (388 or 794 wide, 270 high) that scales down as a whole on
// narrow cards, and plays one short story: on hover with a mouse, or when the
// card scrolls into view on a touch screen (a tap replays it). The two wide
// cards swap to a 388 drawing on phones.
// Two small extras live here too: the Konami code turns every drawing into a
// blueprint for ten seconds, and after 20s without input the drawings breathe,
// one card at a time. A quiet keycap under the grid's corner hints at the code.

const HistoryPhoneArt = () => <HistoryArt compact />;

const CARDS = [
  { id: 'sort', span: 8, art: SortArt, phoneArt: SortPhoneArt, title: 'Sorts your changes', text: 'Forty changed files become a few clean commits. A feature travels with its styles and the lines that hook it in.' },
  { id: 'write', span: 4, art: WriteArt, title: 'Writes the message', text: 'Reads the diff and says what changed, in the style your repo already uses.' },
  { id: 'cart', span: 4, art: CartArt, title: 'Fills a cart', text: 'Commits wait in the cart. Look them over, undo the last one.' },
  { id: 'hold', span: 4, art: HoldArt, title: 'Hold to push', text: 'Pushing is a deliberate hold, never a stray click.' },
  { id: 'receipt', span: 4, art: ReceiptArt, title: 'Prints a receipt', text: 'Every push ends with a receipt of what went out.' },
  { id: 'undo', span: 4, art: UndoArt, title: 'Undo by default', text: 'Discarded changes go to a trash you can restore from. The last commit has an Undo too.' },
  { id: 'history', span: 8, art: HistoryArt, phoneArt: HistoryPhoneArt, title: 'History you can read', text: 'What you shipped, week by week. Every branch, merge and tag drawn as lanes.' },
];

const KONAMI = ['arrowup', 'arrowup', 'arrowdown', 'arrowdown', 'arrowleft', 'arrowright', 'arrowleft', 'arrowright', 'b', 'a'].join(' ');
const BLUEPRINT_MS = 10000;
const IDLE_AFTER = 20000, BEAT = 6000, PLAY = 3600;
const IDLE_CARDS = ['cart', 'sort', 'history', 'receipt'];
const ACTIVITY = ['pointermove', 'pointerdown', 'wheel', 'scroll', 'keydown', 'touchstart'];

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
      sfxApproved();
      clearTimeout(timer);
      timer = setTimeout(() => root.current?.classList.remove('is-blueprint'), BLUEPRINT_MS);
    };
    addEventListener('keydown', onKey);
    return () => { removeEventListener('keydown', onKey); clearTimeout(timer); };
  }, [root]);
}

// After 20s with no pointer, scroll or key input, one card at a time plays a tiny
// breath every 6s, in rotation. Any input stops it at once. None with reduced motion.
function useIdleLife(root) {
  useEffect(() => {
    const still = matchMedia('(prefers-reduced-motion: reduce)');
    let wait = 0, beat = 0, clear = 0, next = 0;
    const stop = () => { clearTimeout(beat); clearTimeout(clear); if (root.current) delete root.current.dataset.idle; };
    const play = () => {
      const el = root.current;
      if (!el || still.matches || document.hidden) return;
      // skip a card the pointer rests on, one playing its story, or one held in its sorted state
      for (let tries = 0; tries < IDLE_CARDS.length; tries++) {
        const id = IDLE_CARDS[next++ % IDLE_CARDS.length];
        const card = el.querySelector(`.feat-${id}`);
        if (card && !card.matches(':hover, .is-play') && !card.querySelector('.is-held')) {
          el.dataset.idle = id;
          clear = setTimeout(() => delete el.dataset.idle, PLAY);
          break;
        }
      }
      beat = setTimeout(play, BEAT);
    };
    const arm = () => { stop(); clearTimeout(wait); wait = setTimeout(play, IDLE_AFTER); };
    ACTIVITY.forEach((t) => addEventListener(t, arm, { passive: true, capture: true }));
    arm();
    return () => { ACTIVITY.forEach((t) => removeEventListener(t, arm, { capture: true })); stop(); clearTimeout(wait); };
  }, [root]);
}

// Stories. A card plays while it has .is-play (every story selector in
// features.css hangs off it) and tells its drawing with feat:play / feat:stop.
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
  useIdleLife(root);
  useStories(root);
  return (
    <div className="bento" ref={root}>
      {CARDS.map(({ id, span, art: Art, phoneArt: PhoneArt, title, text }, i) => (
        <article key={id} className={`feat reveal feat-${id}${span === 8 ? ' wide' : ''}`} style={{ '--i': i }}>
          <div className="feat-head">
            <h3>{title}</h3>
            <p>{text}</p>
          </div>
          <div className="feat-art">
            <div className={`stage${span === 8 ? ' is-wide' : ''}`}><Art /></div>
            {PhoneArt && <div className="stage is-phone"><PhoneArt /></div>}
            <span className="bp-tag" aria-hidden="true">blueprint mode</span>
          </div>
        </article>
      ))}
      <KonamiHint />
    </div>
  );
}
