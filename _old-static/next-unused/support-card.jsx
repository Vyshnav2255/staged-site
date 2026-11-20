'use client';
import { useEffect, useState } from 'react';
import { BMC_URL, GH } from '@/lib/site';
import CupArt, { Stain } from './cup-art';

const COFFEE_KEY = 'staged-site-coffee';

// The footer's support card. If the coffee went into the cart up in "Try it" this session,
// the card remembers it and asks for that coffee instead.
export default function SupportCard() {
  const [owed, setOwed] = useState(false);
  useEffect(() => {
    try { setOwed(sessionStorage.getItem(COFFEE_KEY) === '1'); } catch {}
    const on = (e) => setOwed(!!e.detail);
    addEventListener('staged:coffee', on);
    return () => removeEventListener('staged:coffee', on);
  }, []);
  return (
    <aside className="support reveal-self" aria-label="Support Staged">
      <Stain size={96} className="support-stain" />
      <span className="support-cup"><CupArt size={48} full /></span>
      <div className="support-copy">
        <b key={owed ? 'o' : 'f'}>{owed ? 'Your coffee is still on the receipt.' : 'Staged is free, and always will be.'}</b>
        <span>If it saved you a messy commit, a coffee keeps it going.</span>
      </div>
      <div className="support-act">
        <a className="support-btn" href={BMC_URL} target="_blank" rel="noopener noreferrer">
          {owed ? 'Pay for the coffee' : 'Buy me a coffee'} <span className="arr" aria-hidden="true">↗</span><span className="sr-only"> (opens in a new tab)</span>
        </a>
        <a className="support-star" href={GH} rel="noopener">or star it on GitHub</a>
      </div>
    </aside>
  );
}
