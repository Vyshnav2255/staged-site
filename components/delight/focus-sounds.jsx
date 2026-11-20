'use client';
import { useEffect } from 'react';
import { sfxFocus } from '@/lib/sfx';

// Tabbing between buttons and links makes a very quiet tick. Keyboard focus only.
export function FocusSounds() {
  useEffect(() => {
    let lastKey = 0, lastTick = 0;
    const key = (e) => { if (e.key === 'Tab' || e.key.startsWith('Arrow')) lastKey = performance.now(); };
    const focus = (e) => {
      const now = performance.now();
      if (now - lastKey > 400 || now - lastTick < 60) return;
      const t = e.target;
      if (!t.matches?.('a[href], button, summary, [role="button"]') || !t.matches(':focus-visible')) return;
      lastTick = now; sfxFocus();
    };
    addEventListener('keydown', key, true);
    addEventListener('focusin', focus);
    return () => { removeEventListener('keydown', key, true); removeEventListener('focusin', focus); };
  }, []);
  return null;
}
