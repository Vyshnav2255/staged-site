'use client';
import { Fragment, useEffect, useState } from 'react';
import { LazyMotion, domMax, m, MotionConfig } from 'motion/react';
import { sfxFold, sfxTick, sfxGrouped } from '@/lib/sfx';
import { track } from '@/lib/track';

// Plus that morphs to a minus: the vertical bar folds away while the icon turns.
const Plus = () => (
  <span className="faq-ico" aria-hidden="true">
    <svg viewBox="0 0 24 24" width="14" height="14" fill="none"><path className="faq-h" d="M5 12H19" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /><path className="faq-v" d="M12 5V19" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg>
  </span>
);

const HIDDEN_Q = 'Did you really read all of these?';

// Browsers with ::details-content animate the answer in CSS. The rest get a motion height
// animation on open (one path, picked by feature test).
function Answer({ open, fallback, children }) {
  if (!fallback) return <div className="faq-a">{children}</div>;
  return (
    <m.div className="faq-a" key={open ? 'o' : 'c'} initial={open ? { height: 0, opacity: 0 } : false} animate={{ height: 'auto', opacity: 1 }} transition={{ duration: 0.42, ease: [0.23, 1, 0.32, 1] }} style={{ overflow: 'clip' }}>
      {children}
    </m.div>
  );
}

// The FAQ. Open every question and a twelfth one quietly shows up.
export default function FaqList({ items, kicker, groups = {} }) {
  const [seen, setSeen] = useState(() => new Set([0]));
  const [openIdx, setOpenIdx] = useState(0);
  const [bonus, setBonus] = useState(false);
  const [fallback, setFallback] = useState(false);
  const total = items.length;

  useEffect(() => {
    try { setFallback(!CSS.supports('selector(::details-content)')); } catch { setFallback(true); }
  }, []);
  useEffect(() => {
    if (seen.size >= total && !bonus) { setBonus(true); sfxGrouped(3); dispatchEvent(new CustomEvent('staged:egg', { detail: 'faq' })); }
  }, [seen, total, bonus]);

  const toggle = (i) => (e) => {
    if (!e.currentTarget.open) { setOpenIdx((o) => (o === i ? -1 : o)); return; }
    setOpenIdx(i);
    setSeen((s) => (s.has(i) ? s : new Set(s).add(i)));
  };
  // Sound goes with the click, so swapping one open answer for another only ticks once.
  const click = (i, special) => (e) => {
    if (e.currentTarget.parentElement.open) return sfxFold();
    track('faq-open', { q: e.currentTarget.textContent.replace(/new$/, '').trim().slice(0, 80) });
    if (special) sfxGrouped(2);
    else sfxTick(i);
  };
  return (
    <LazyMotion features={domMax} strict>
      <MotionConfig reducedMotion="user">
        <div className="faq-grid">
          <div className="faq-side">
            <div className="sec-head reveal-group">
              {kicker}
              <h2>FAQ</h2>
            </div>
          </div>
          <div className="faq reveal-group" data-cap="8" style={{ '--step': '40ms' }}>
            {items.map(({ q, a, group }, i) => (
              <Fragment key={q}>
                {groups[group] && group !== items[i - 1]?.group && <div className="faq-label mono" aria-hidden="true">{groups[group]}</div>}
                <details open={i === 0} name="faq" onToggle={toggle(i)}>
                  <summary onClick={click(i)}><span>{q}</span><Plus /></summary>
                  <Answer open={openIdx === i} fallback={fallback}><p>{a}</p></Answer>
                </details>
              </Fragment>
            ))}
            {bonus && (
              <details className="faq-bonus" name="faq" onToggle={toggle(total)}>
                <summary onClick={click(total, true)}><span>{HIDDEN_Q}<i className="faq-new mono" aria-hidden="true">new</i></span><Plus /></summary>
                <Answer open={openIdx === total} fallback={fallback}>
                  <p>
                    Honestly, hardly anyone does. Thank you for reading all of it. There are no more questions and nothing else hidden down here. Go and hold the button.
                    <span className="stamp-mini mono" aria-hidden="true"><i />SHIPPED</span>
                  </p>
                </Answer>
              </details>
            )}
          </div>
        </div>
      </MotionConfig>
    </LazyMotion>
  );
}
