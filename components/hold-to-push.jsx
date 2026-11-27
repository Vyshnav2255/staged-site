'use client';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { LazyMotion, domMax, m, AnimatePresence, MotionConfig } from 'motion/react';
import { sfxTick, sfxApproved, sfxLaser, sfxBeeps, sfxStamp, sfxDrain, sfxDiscard, sfxClink, sfxUnclink, buzz } from '@/lib/sfx';
import { useForcePush } from './delight/use-force-push';
import { useTear } from './delight/use-tear';
import { track } from '@/lib/track';
import { PaperTip } from './delight/paper-tip';
import { Smoke } from './delight/smoke';
import { Odometer } from './delight/odometer';
import { reducedMotion, replay, finePointer } from './delight/util';
import { Receipt } from './receipt';
import Tip from './tip';
import { BMC_URL } from '@/lib/site';
import CupIcon from './cup-icon';
import SoundToggle from './sound-toggle';
import CupArt from './cup-art';

// The real push button, minus the push: hold it, ticks count the commits,
// let go early and nothing happens, hold to the end and a receipt prints.
const HOLD = 1400;
const CART = [
  { msg: 'feat(printer): add a label printer', hash: '7155894', files: ['printer.js', 'printer.css', 'label.js'], add: 186, del: 4 },
  { msg: 'docs(guide): explain hold to push', hash: '85b0184', files: ['guide.md', 'README.md'], add: 41, del: 12 },
  { msg: 'fix(sidebar): keep it fixed while you scroll', hash: '216b5e3', files: ['sidebar.css', 'sidebar.js'], add: 19, del: 5 },
];
const TOTAL = CART.reduce((t, c) => ({ files: t.files + c.files.length, add: t.add + c.add, del: t.del + c.del }), { files: 0, add: 0, del: 0 });
const WOBBLE_AT = 0.9;
const COFFEE_ITEM = { pre: '☕ ', l: 'One coffee for the maker', hl: true, cls: 'is-coffee', sl: '04 · tip · optional', sr: '1 cup' };
const COFFEE_KEY = 'staged-site-coffee';
const SPRING = { type: 'spring', stiffness: 420, damping: 34 };
const COUNT_KEY = 'staged-site-receipts'; // how many receipts this visitor has printed
const pad4 = (n) => String(n).padStart(4, '0');
const NARROW = '(max-width: 1000px)'; // one column: the printer sits below the button
// Letting go early: each try gets a more helpful line (reset after a push).
const EARLY = ['That’s the point: a stray click never pushes.', 'Still nothing. That is the point.', 'It needs the full 1.4 seconds. Keep holding.'];
// The thank-you line follows the visitor's clock.
function thanks(d = new Date()) {
  const h = d.getHours();
  if (d.getDay() === 5 && h >= 16) return 'Pushed on a Friday. Brave.';
  if (h < 4) return 'Thanks for shipping. Go to bed.';
  if (h < 7) return 'First push of the day.';
  return 'Thanks for shipping.';
}

// Feed timing (matches .is-printed .receipt in globals.css): 0.4s wait, 2.2s on this curve.
const FEED_DELAY = 0.4, FEED = 2.2, STAMP_AT = 3.6;
function feedTime(progress) {
  // Invert cubic-bezier(.45, .05, .35, 1): time fraction at which the paper has moved `progress`.
  if (progress <= 0) return 0;
  const bx = (s) => 3 * (1 - s) ** 2 * s * 0.45 + 3 * (1 - s) * s * s * 0.35 + s ** 3;
  const by = (s) => 3 * (1 - s) ** 2 * s * 0.05 + 3 * (1 - s) * s * s * 1 + s ** 3;
  let lo = 0, hi = 1;
  for (let i = 0; i < 24; i++) { const mid = (lo + hi) / 2; if (by(mid) < progress) lo = mid; else hi = mid; }
  return bx(hi);
}

const Check = ({ size = 12, className = '' }) => (
  <svg className={className} viewBox="0 0 16 16" width={size} height={size} fill="none" aria-hidden="true"><path d="M3.5 8.5L6.5 11.5L12.5 5" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" pathLength="1" /></svg>
);
const BranchIcon = () => (
  <svg viewBox="0 0 24 24" width="12" height="12" fill="none" aria-hidden="true"><path d="M6 3V15M6 15C4.34 15 3 16.34 3 18C3 19.66 4.34 21 6 21C7.66 21 9 19.66 9 18C9 16.34 7.66 15 6 15ZM18 9C19.66 9 21 7.66 21 6C21 4.34 19.66 3 18 3C16.34 3 15 4.34 15 6C15 7.66 16.34 9 18 9ZM18 9C18 13 15 15 9 17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
);

export default function HoldToPush() {
  const [phase, setPhase] = useState('idle'); // idle | holding | early | pushing | printed | jam
  const [p, setP] = useState(0);
  const [today, setToday] = useState('20 Nov');
  const [when, setWhen] = useState('20 Nov 2026 · 10:00');
  const [torn, setTorn] = useState(false);   // the paper has been ripped off, flutter in progress
  const [ready, setReady] = useState(false); // the paper is fully out, so it can be torn
  const [smoke, setSmoke] = useState(0);
  const [coffee, setCoffee] = useState(false);
  const [landed, setLanded] = useState(false); // the flying cup has reached the cart badge
  const [pour, setPour] = useState(0);          // replays the pour on the cup
  const [opened, setOpened] = useState(false);  // "Pay for the coffee" was clicked
  const [touched, setTouched] = useState(false); // the idle sheen stops after the first press
  const [away, setAway] = useState(true);        // out of view: idle loops pause
  const [no, setNo] = useState({ from: 0, to: 1 }); // receipt number: rolls from the last one printed
  const [note, setNote] = useState('Thanks for shipping.');
  const [early, setEarly] = useState(0);         // early releases since the last push
  const [coarse, setCoarse] = useState(false);   // touch: tear from the bottom strip only
  const raf = useRef(0), start = useRef(0), ticks = useRef(0), timers = useRef([]), cTimers = useRef([]), flights = useRef([]), payTimer = useRef(0);
  const root = useRef(null), paper = useRef(null), printer = useRef(null), printed = useRef(0), phaseRef = useRef('idle');
  const cupTile = useRef(null), badge = useRef(null), flyTpl = useRef(null), chipRef = useRef(null);
  const chipW = 96; // the chip is a fixed 88px wide (see .htp-chip), plus an 8px gap
  phaseRef.current = phase;

  useEffect(() => {
    const d = new Date();
    setToday(d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }));
    setWhen(`${d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })} · ${d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}`);
    try { const last = parseInt(localStorage.getItem(COUNT_KEY), 10) || 0; printed.current = last; setNo({ from: last, to: last + 1 }); } catch {}
    setCoarse(matchMedia('(pointer: coarse)').matches);
    const io = new IntersectionObserver(([e]) => setAway(!e.isIntersecting), { rootMargin: '80px 0px' });
    io.observe(root.current);
    return () => { io.disconnect(); cancelAnimationFrame(raf.current); timers.current.forEach(clearTimeout); cTimers.current.forEach(clearTimeout); clearTimeout(payTimer.current); cancelFlight(); };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  const later = (fn, ms) => timers.current.push(setTimeout(fn, ms));

  // Back to a clean, idle printer.
  const clearPaper = () => {
    timers.current.forEach(clearTimeout); timers.current = [];
    paper.current?.getAnimations().forEach((a) => a.cancel());
    const el = paper.current;
    if (el) {
      el.classList.remove('is-torn', 'is-dragging');
      ['--dx', '--dy', '--rot'].forEach((v) => el.style.removeProperty(v));
      const sheet = el.querySelector('.receipt');
      if (sheet) { sheet.style.clipPath = ''; sheet.style.removeProperty('--tilt'); }
    }
    setTorn(false); setReady(false); setSmoke(0); setOpened(false);
  };
  const reset = () => { clearPaper(); setPhase('idle'); setP(0); root.current?.style.removeProperty('--print-h'); };

  const { bind, tear } = useTear({ paperRef: paper, enabled: ready && !torn, onTorn: () => { setTorn(true); track('receipt-tear'); }, onGone: reset });
  // Before the tear: the paper lifts a little toward a mouse (up to 1.2deg about the slot).
  // On touch it only tears from the strip along its bottom edge, so the page still scrolls.
  const tilt = (deg) => paper.current?.querySelector('.receipt')?.style.setProperty('--tilt', `${deg.toFixed(2)}deg`);
  const feedBind = !bind.onPointerDown ? {} : {
    ...bind,
    onPointerDown: (e) => {
      if (e.pointerType === 'touch' && !e.target.closest('.tear-strip')) return;
      tilt(0);
      bind.onPointerDown(e);
    },
    onPointerMove: (e) => {
      bind.onPointerMove(e);
      if (e.pointerType !== 'mouse' && e.pointerType !== 'pen') return;
      if (phase !== 'printed' || e.currentTarget.classList.contains('is-dragging') || reducedMotion() || !finePointer()) return;
      const r = e.currentTarget.getBoundingClientRect();
      const fx = Math.max(-1, Math.min(1, ((e.clientX - r.left) / r.width) * 2 - 1));
      tilt(-fx * 1.2);
    },
    onPointerLeave: () => tilt(0),
  };

  const frame = (t) => {
    const k = Math.min(1, (t - start.current) / HOLD);
    setP(k);
    const n = Math.floor(k * (CART.length + 1));
    while (ticks.current < n && ticks.current < CART.length) { sfxTick(ticks.current++); buzz(8); }
    if (k >= 1) return done();
    raf.current = requestAnimationFrame(frame);
  };
  const down = (e) => {
    if (phase !== 'idle' && phase !== 'early' && phase !== 'jam') return;
    if (e.type === 'keydown' && e.key !== 'Enter') return;
    if (e.repeat) return;
    e.preventDefault();
    setTouched(true);
    if (phase === 'jam') clearPaper();
    ticks.current = 0; start.current = performance.now();
    setPhase('holding');
    raf.current = requestAnimationFrame(frame);
  };
  // One column: the receipt prints below the button, so bring the printer up to meet it.
  const followPrinter = () => {
    if (matchMedia(NARROW).matches) printer.current?.scrollIntoView({ block: 'start', behavior: reducedMotion() ? 'auto' : 'smooth' });
  };
  const up = () => {
    if (phaseRef.current === 'pushing') return followPrinter(); // lifting the finger can stop a smooth scroll, so ask again
    if (phase !== 'holding') return;
    cancelAnimationFrame(raf.current);
    setPhase('early'); setP(0); sfxDrain();
    track('push-early-release');
    setEarly((k) => k + 1);
  };
  const done = () => {
    setPhase('pushing'); sfxApproved(); buzz([12, 40, 24]);
    track('push-complete', { coffee });
    setEarly(0);
    setNote(thanks());
    // Count the receipt: it rolls from the last number this visitor printed.
    let last = printed.current;
    try { last = Math.max(last, parseInt(localStorage.getItem(COUNT_KEY), 10) || 0); localStorage.setItem(COUNT_KEY, String(last + 1)); } catch {}
    printed.current = last + 1;
    setNo({ from: last, to: last + 1, k: last + 1 });
    followPrinter();
    later(() => { sfxLaser(380, 1900); setPhase('printed'); }, 650);
    later(() => sfxBeeps(), 650 + 2300);
    later(() => sfxStamp(), 650 + STAMP_AT * 1000 + 230);
    later(() => setReady(true), 650 + STAMP_AT * 1000 + 480);
  };

  // Lines of the receipt fade in as they leave the slot: the paper's lower edge leads, so a line
  // shows once the feed has moved far enough to bring its bottom edge past the slot.
  useLayoutEffect(() => {
    if (phase !== 'printed' && phase !== 'jam') return;
    const sheet = paper.current?.querySelector('.receipt');
    if (!sheet) return;
    // One column: the idle bay is short, so it opens up to fit the paper and the buttons under it.
    root.current.style.setProperty('--print-h', `${64 + sheet.offsetHeight + 132}px`);
    if (phase !== 'printed') return;
    const H = sheet.offsetHeight - 28;
    sheet.querySelectorAll('.rcpt-p').forEach((el) => {
      let y = el.offsetTop + el.offsetHeight, o = el.offsetParent;
      while (o && o !== sheet) { y += o.offsetTop; o = o.offsetParent; }
      const t = FEED_DELAY + feedTime(1 - y / H) * FEED;
      el.style.setProperty('--pd', `${t.toFixed(3)}s`);
    });
  }, [phase]);

  // Easter egg: typing "git push --force" jams the printer.
  const jam = () => {
    const now = phaseRef.current;
    if (now === 'holding' || now === 'pushing') return;
    clearPaper(); cancelAnimationFrame(raf.current);
    setP(0);
    const box = root.current.getBoundingClientRect();
    const off = box.top < 0 || box.bottom > innerHeight;
    if (off) root.current.scrollIntoView({ block: 'center', behavior: reducedMotion() ? 'auto' : 'smooth' });
    later(() => {
      setPhase('jam'); setSmoke((k) => k + 1);
      sfxDiscard(); sfxStamp();
      later(() => sfxLaser(80, 1100), 700);
      later(() => setReady(true), 2300);
    }, off && !reducedMotion() ? 600 : 0);
  };
  useForcePush(jam);

  // The coffee add-on: pour, a small cup flies into the cart badge, the badge counts it.
  const cancelFlight = () => {
    cTimers.current.forEach(clearTimeout); cTimers.current = [];
    flights.current.forEach((f) => { f.anims.forEach((a) => a.cancel()); f.el.remove(); });
    flights.current = [];
  };
  const fly = () => {
    const a = cupTile.current?.getBoundingClientRect(), b = badge.current?.getBoundingClientRect();
    if (!a || !b) return;
    const sx = a.left + a.width / 2, sy = a.top + a.height / 2;
    const dx = b.left + b.width / 2 - sx, dy = b.top + b.height / 2 - sy;
    const peak = Math.min(0, dy) - 72;
    const launch = (cls, html, delay, scale) => {
      const el = document.createElement('div');
      el.className = `cup-fly ${cls}`;
      el.setAttribute('aria-hidden', 'true');
      el.style.left = `${sx}px`; el.style.top = `${sy}px`;
      const inner = document.createElement('div');
      inner.className = 'cup-fly-in';
      inner.innerHTML = html;
      el.appendChild(inner);
      document.body.appendChild(el);
      const o = { duration: 560, delay, fill: 'both' };
      const ax = el.animate([{ transform: 'translateX(0)' }, { transform: `translateX(${dx}px)` }], { ...o, easing: 'cubic-bezier(.65, 0, .35, 1)' });
      const ay = inner.animate([
        { transform: 'translateY(0) scale(1)', opacity: 1, easing: 'cubic-bezier(.2, .7, .4, 1)' },
        { transform: `translateY(${peak}px) scale(${0.5 + scale * 0.35})`, opacity: 1, offset: 0.42, easing: 'cubic-bezier(.6, 0, .9, .5)' },
        { transform: `translateY(${dy * 0.94}px) scale(${scale * 0.62})`, opacity: 1, offset: 0.85 },
        { transform: `translateY(${dy}px) scale(${scale * 0.6})`, opacity: 0 },
      ], o);
      const f = { el, anims: [ax, ay] };
      ay.onfinish = () => { el.remove(); flights.current = flights.current.filter((x) => x !== f); };
      flights.current.push(f);
    };
    launch('is-cup', flyTpl.current.innerHTML, 0, 1);
    launch('is-trail', '<i></i>', 60, 1);
  };
  const locked = phase === 'holding' || phase === 'pushing' || phase === 'printed';
  const toggleCoffee = () => {
    if (locked) return;
    const next = !coffee;
    cancelFlight();
    setCoffee(next);
    try { sessionStorage.setItem(COFFEE_KEY, next ? '1' : '0'); } catch {}
    dispatchEvent(new CustomEvent('staged:coffee', { detail: next }));
    if (!next) { setLanded(false); sfxUnclink(); return; }
    sfxClink();
    if (reducedMotion()) { setLanded(true); sfxTick(3); return; }
    setLanded(false);
    setPour((k) => k + 1);
    cTimers.current.push(setTimeout(fly, 220));
    cTimers.current.push(setTimeout(() => { setLanded(true); replay(badge.current, 'is-bump'); sfxTick(3); }, 780));
  };

  const label = { idle: 'Hold to push', holding: 'Keep holding…', early: 'Hold to push', pushing: 'Pushing…', printed: 'Pushed', jam: 'Hold to push' }[phase];
  const showPaper = phase === 'printed' || phase === 'jam';
  const ghost = phase === 'idle' || phase === 'holding' || phase === 'early';
  const wobble = phase === 'holding' && p >= WOBBLE_AT;
  const ghostHint = phase === 'early' ? EARLY[Math.min(early, EARLY.length) - 1] : (coffee ? 'hold the button · the coffee prints too' : 'hold the button to print a receipt');
  const tearHint = ready && !torn ? (coarse ? 'pull the bottom edge to tear it off' : 'pull the paper down to tear it off') : '';
  const low = no.to % 5 === 0; // every fifth roll is near its end: the pink "paper low" stripe
  const inCart = coffee && landed;
  const count = CART.length + (inCart ? 1 : 0);
  const litNow = phase !== 'idle' && phase !== 'early' && phase !== 'jam';
  const lit = (i) => litNow && p * (CART.length + 1) > i + 1;

  const pay = () => {
    setOpened(true);
    clearTimeout(payTimer.current);
    payTimer.current = setTimeout(() => setOpened(false), 4000);
  };

  return (
    <LazyMotion features={domMax} strict>
      <MotionConfig reducedMotion="user">
        <div className="htp-reveal reveal-self">
        <div ref={root} className={`htp is-${phase}${torn ? ' is-torn' : ''}${away ? ' is-away' : ''}${!touched && phase === 'idle' ? ' is-untouched' : ''}`}>
          <div className="htp-cart">
            <div className="htp-head">
              <span className="htp-title">Cart <i ref={badge} className="htp-count mono"><Odometer value={String(count)} /></i></span>
            </div>
            <ul>
              {CART.map((c, i) => (
                <li key={c.hash} className={lit(i) ? 'is-lit' : ''}>
                  <span className="htp-tile" aria-hidden="true"><i className="dot" /><Check size={12} className="htp-tick" /></span>
                  <span className="htp-msg">{c.msg}</span>
                  <span className="mono htp-stat"><b className="add">+{c.add}</b><b className="del">−{c.del}</b></span>
                  <span className="mono htp-sub">{c.hash} · {c.files.length} files</span>
                </li>
              ))}
            </ul>

            <div role="group" aria-label="Optional add-on" className={`htp-addon${coffee ? ' is-on' : ''}${locked ? ' is-locked' : ''}${litNow && coffee && p >= 0.95 ? ' is-lit' : ''}`}
              onClick={(e) => { if (!e.target.closest('.addon-switch')) toggleCoffee(); }}>
              <span className="addon-tag mono" aria-hidden="true">add-on</span>
              <span ref={cupTile} className={`addon-cup${pour && coffee ? ' is-pour' : ''}`} key={pour}><CupArt full={coffee} className={pour && coffee ? 'is-pour' : ''} /></span>
              <span className="addon-copy">
                <b>Coffee for the maker</b>
                <span className="addon-sub" key={coffee ? 'on' : 'off'}>
                  <span className="addon-long">{coffee ? 'Added. It prints on your receipt.' : 'Optional. Staged is free either way.'}</span>
                  <span className="addon-short">{coffee ? 'Added. Prints on the receipt.' : 'Optional.'}</span>
                </span>
              </span>
              <span className="addon-qty mono">1 cup</span>
              <button type="button" role="switch" aria-checked={coffee} className="addon-switch" disabled={locked}
                aria-label="Add a coffee for the maker to the cart"
                onClick={(e) => { e.stopPropagation(); toggleCoffee(); }}
                onKeyDown={(e) => { if (e.key === ' ' || e.key === 'Enter') e.stopPropagation(); }}
                onKeyUp={(e) => e.stopPropagation()}>
                <span className="addon-knob"><Check size={10} className="knob-check" /><i className="knob-dot" /></span>
              </button>
            </div>

            <div className="htp-foot">
              <span>Total</span>
              {/* Transform-only: the stats slide left by the chip's width, the chip fades in at the end. No layout shift. */}
              <span className="mono htp-total">
                <m.span className="htp-total-stats" animate={{ x: inCart ? -chipW : 0 }} initial={false} transition={SPRING}>{TOTAL.files} files · <b className="add">+{TOTAL.add}</b> <b className="del">−{TOTAL.del}</b></m.span>
                <span className="htp-chip-slot" ref={chipRef}>
                  <AnimatePresence initial={false}>
                    {inCart && (
                      <m.span key="chip" className="htp-chip" initial={{ opacity: 0, x: 10, scale: 0.9 }} animate={{ opacity: 1, x: 0, scale: 1 }} exit={{ opacity: 0, x: 6, scale: 0.94, transition: { duration: 0.2, ease: [0.4, 0, 1, 1] } }} transition={SPRING}>
                        <CupIcon size={12} />1 coffee
                      </m.span>
                    )}
                  </AnimatePresence>
                </span>
              </span>
            </div>
            <button type="button" className={`htp-btn${wobble ? ' is-wobble' : ''}`} style={{ '--p': p, '--h': phase === 'holding' ? p : 0 }}
              onPointerDown={down} onPointerUp={up} onPointerLeave={up} onPointerCancel={up}
              onKeyDown={down} onKeyUp={up} onContextMenu={(e) => e.preventDefault()}
              disabled={phase === 'pushing' || phase === 'printed'} aria-label="Hold to push (a demo, nothing is pushed)">
              <span className="htp-fill" aria-hidden="true" /><i className="htp-edge" aria-hidden="true" />
              <span className="htp-sheen" aria-hidden="true" />
              <span className="htp-label" key={label}>
                {phase === 'printed' ? <Check size={16} className="htp-done" />
                  : phase !== 'pushing' && (
                    <svg className="htp-ring" viewBox="0 0 18 18" width="18" height="18" aria-hidden="true">
                      <circle cx="9" cy="9" r="7.25" />
                      <circle className="htp-ring-p" cx="9" cy="9" r="7.25" pathLength="1" />
                    </svg>
                  )}
                {label}
              </span>
            </button>
            <p className="htp-keys mono" key={phase === 'printed' ? 'done' : 'idle'}>
              {phase === 'printed' ? 'pushed. tear the receipt to go again' : <><span className="nw">a demo, nothing is pushed ·</span> <span className="nw">hold for 1.4s</span></>}
            </p>
          </div>

          <div ref={printer} className="htp-printer">
            <div className="htp-head-bar">
              <span className="htp-title-wrap"><span className="mono">receipt printer</span></span>
              <SoundToggle compact />
              <div className="htp-slot" />
            </div>
            <Smoke run={smoke} />
            <div className="htp-bay">
              <div className={`htp-ghost${ghost ? '' : ' is-gone'}`} aria-hidden={!ghost}>
                <p className={`htp-hint${phase === 'early' ? ' is-early' : ''}`} key={ghostHint}>{ghostHint}</p>
              </div>
              <div className="htp-slot-shade" aria-hidden="true" />
              <div className="htp-paper-clip" aria-hidden={!showPaper}>
                <PaperTip />
                <div ref={paper} className={`feed${ready && !torn ? ' can-tear' : ''}${torn ? ' is-torn' : ''}`} {...feedBind}>
                  {phase === 'jam' ? (
                    <Receipt
                      className="jammed" tone="jam" label="Paper jam · No. 0000" size={76}
                      meta={[['Repo', 'trailhead'], ['Date', when], ['Branch', 'main → origin/main']]}
                      items={[{ l: '$ git push --force', sl: '01 · 0000000 · 0 files', sr: '+0 −0' }]}
                      totals={[['Files', '0'], ['Total lines', '+0 −0', true]]}
                      note={<>Nice try. <span className="jam-go">Hold to push.</span></>}
                      stamp={['Jammed', today]}
                    />
                  ) : (
                    <Receipt
                      label={<>Push receipt · No. <Odometer key={no.k || 0} value={pad4(no.to)} from={no.k ? pad4(no.from) : undefined} /></>}
                      className={coffee ? 'has-coffee' : ''} low={low} stain={coffee} size={76}
                      meta={[['Repo', 'trailhead'], ['Date', when], ['Branch', 'main → origin/main']]}
                      items={[...CART.map((c, i) => ({ l: c.msg, sl: `${String(i + 1).padStart(2, '0')} · ${c.hash} · ${c.files.length} files`, sr: `+${c.add} −${c.del}` })), ...(coffee ? [COFFEE_ITEM] : [])]}
                      totals={[['Commits', String(CART.length)], ['Files', String(TOTAL.files)], ...(coffee ? [['Coffee', '1 cup']] : []), ['Total lines', `+${TOTAL.add} −${TOTAL.del}`, true]]}
                      note={coffee ? <>{note} <span className="rcpt-u">One coffee<svg viewBox="0 0 100 8" preserveAspectRatio="none" aria-hidden="true"><path d="M2 5.5C26 2.5 62 1.8 98 4" pathLength="1" /></svg></span> still open.</> : note}
                      stamp={['Shipped', today]}
                      qr qrLabel="Scan to get Staged"
                    />
                  )}
                  {coarse && ready && !torn && <span className="tear-strip" aria-hidden="true"><i /></span>}
                </div>
              </div>
              {showPaper && ready && !torn && (
                <div className="htp-actions">
                  {phase === 'printed' && coffee && (
                    <a className={`htp-pay${opened ? ' is-opened' : ''}`} href={BMC_URL} target="_blank" rel="noopener noreferrer" onClick={pay}>
                      {opened ? <>Opened in a new tab</> : <><CupIcon size={14} />Pay for the coffee <span className="htp-arrow" aria-hidden="true">↗</span></>}
                      <span className="sr-only"> on Buy Me a Coffee, opens in a new tab</span>
                    </a>
                  )}
                  <button type="button" className="htp-again" onClick={() => tear()}>{phase === 'jam' ? 'Clear the jam' : 'Tear it off and push again'}</button>
                </div>
              )}
              {tearHint && <p className="htp-hint is-tear" key={tearHint}>{tearHint}</p>}
            </div>
            <p className="sr-only" role="status">{phase === 'jam' ? 'The printer jammed. Nice try. Hold to push.' : phase === 'printed' ? 'Pushed. A receipt printed.' : ''}</p>
            <span ref={flyTpl} hidden><CupIcon size={20} /></span>
          </div>
        </div>
        </div>
      </MotionConfig>
    </LazyMotion>
  );
}
