'use client';
import { useEffect, useRef } from 'react';
import { isTyping } from './util';

// Listens for someone typing "git push --force" anywhere on the page (not in a field).
const PHRASE = 'git push --force';

export function useForcePush(onJam) {
  const cb = useRef(onJam);
  cb.current = onJam;
  useEffect(() => {
    let at = 0;
    const onKey = (e) => {
      if (isTyping(e.target) || e.ctrlKey || e.metaKey || e.altKey || e.key.length !== 1) return;
      const k = e.key.toLowerCase();
      if (k === PHRASE[at]) at += 1; else at = k === PHRASE[0] ? 1 : 0;
      // Mid-phrase spaces would scroll the page away from the printer.
      if (k === ' ' && at >= 4 && (e.target === document.body || e.target === document.documentElement)) e.preventDefault();
      if (at === PHRASE.length) { at = 0; cb.current(); dispatchEvent(new CustomEvent('staged:egg', { detail: 'force' })); }
    };
    addEventListener('keydown', onKey);
    return () => removeEventListener('keydown', onKey);
  }, []);
}
