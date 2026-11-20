'use client';
import { useEffect, useRef, useState } from 'react';
import { sfxTick, sfxApproved, sfxStamp, sfxTear } from '@/lib/sfx';
import { replay, reducedMotion, todayShort } from './util';
import { Receipt } from '../receipt';

// Click the logo (nav brand or hero icon) and the three bars stack like commits.
// Seven clicks in a row print a little receipt from the top-right.
const LOGO = '#nav .brand, .hero-icon';

function Toast({ onDone }) {
  const [out, setOut] = useState(false);
  const [when] = useState(() => { const d = new Date(); return `${d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })} · ${d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}`; });
  const timers = useRef([]);
  useEffect(() => {
    sfxApproved();
    timers.current = [setTimeout(sfxStamp, reducedMotion() ? 200 : 1500), setTimeout(() => dismiss(), 6500)];
    return () => timers.current.forEach(clearTimeout);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  const dismiss = () => {
    timers.current.forEach(clearTimeout);
    setOut(true); sfxTear();
    timers.current = [setTimeout(onDone, 600)];
  };
  return (
    <button type="button" className={`toast${out ? ' is-out' : ''}`} onClick={dismiss} aria-label="7 commits of clicking, shipped. Dismiss">
      <Receipt
        className="toast-paper" label="Push receipt · No. 0007"
        meta={[['Repo', 'staged.site'], ['Date', when], ['Branch', 'logo → clicks']]}
        items={[{ l: '🖱️ Clicked the logo ×7', sl: '01 · 7c1ac75 · 1 file', sr: '+7 −0' }]}
        totals={[['Commits', '7'], ['Total lines', '+7 −0', true]]}
        note="Thanks for clicking."
        stamp={['Shipped', todayShort()]}
      />
    </button>
  );
}

export function LogoClicks() {
  const [toast, setToast] = useState(0);
  useEffect(() => {
    let count = 0, last = 0;
    const onClick = (e) => {
      if (!e.target.closest?.(LOGO)) return;
      const now = performance.now();
      if (now - last > 2500) count = 0;
      last = now; count += 1;
      document.querySelectorAll('#nav .mark, .hero-icon svg').forEach((el) => replay(el, 'is-stack'));
      if (count < 7) { sfxTick(count - 1); return; }
      count = 0;
      setToast((k) => k + 1);
      dispatchEvent(new CustomEvent('staged:egg', { detail: 'logo' }));
    };
    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, []);
  return toast ? <Toast key={toast} onDone={() => setToast(0)} /> : null;
}
