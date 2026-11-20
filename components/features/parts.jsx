'use client';
import { useEffect, useRef } from 'react';

// Shared pieces of the feature illustrations. Everything is laid out in stage
// pixels and drawn as line art (see the rules at the top of app/features.css):
// .chip, .row and .panel are the three outlined objects, .badge the small count,
// .mono the one code size. Fills follow rule 2: grey surfaces, green on purpose.

// Geist Mono advances 0.6em: 11px text is 6.6px a character.
export const MONO = 6.6;
// 1px edge, 8px inset, 6px marker, 6px gap, the name, 8px inset, 1px edge.
export const chipWidth = (name) => Math.round(30 + name.length * MONO);

// A changed file: an outlined chip with a square marker and its name.
// tone: 0 accent green, 1 solid ink, 2 hollow.
export function FileChip({ name, tone = 2, className = '' }) {
  return (
    <span className={`chip tone-${tone} ${className}`} style={{ width: chipWidth(name) }}>
      <i className="chip-dot" />
      <span>{name}</span>
    </span>
  );
}

// Lines changed, as the app prints them.
export function Stat({ add, del }) {
  return <span className="stat mono"><b>+{add}</b> <em>−{del}</em></span>;
}

// A count: an 18px pill. `on` makes it the card's solid green fill.
export function Badge({ on, className = '', children }) {
  return <span className={`badge${on ? ' is-on' : ''} ${className}`}>{children}</span>;
}

// Runs `play` when the card around `ref` starts its story (Features sets .is-play
// and fires feat:play on hover, or on scroll into view on touch screens); whatever
// `play` returns runs when the story stops. Skipped with reduced motion.
export function useCardHover(ref, play) {
  const fn = useRef(play);
  fn.current = play;
  useEffect(() => {
    const card = ref.current?.closest('.feat');
    if (!card) return;
    let stop;
    const enter = () => {
      if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      stop?.(); stop = fn.current();
    };
    const leave = () => { stop?.(); stop = undefined; };
    card.addEventListener('feat:play', enter);
    card.addEventListener('feat:stop', leave);
    return () => {
      leave();
      card.removeEventListener('feat:play', enter);
      card.removeEventListener('feat:stop', leave);
    };
  }, [ref]);
}
