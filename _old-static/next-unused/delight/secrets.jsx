'use client';
import { useEffect, useState } from 'react';
import { sfxStamp } from '@/lib/sfx';

// Hints for the easter eggs, at the foot of the page. Each one ticks off when found
// and is remembered in this browser.
const KEY = 'staged-site-secrets';
const KONAMI = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
const EGGS = [
  { id: 'force', hint: <>Type <kbd>git push --force</kbd></> },
  { id: 'konami', hint: <><kbd>↑↑↓↓←→←→BA</kbd> near the drawings</> },
  { id: 'logo', hint: <>Click the logo seven times</> },
  { id: 'faq', hint: <>Read every question</> },
];

const load = () => { try { return new Set(JSON.parse(localStorage.getItem(KEY) || '[]')); } catch { return new Set(); } };

export default function Secrets() {
  const [found, setFound] = useState(() => new Set());
  const [fresh, setFresh] = useState('');

  useEffect(() => {
    setFound(load());
    const mark = (id) => setFound((prev) => {
      if (prev.has(id)) return prev;
      const next = new Set(prev).add(id);
      try { localStorage.setItem(KEY, JSON.stringify([...next])); } catch {}
      setFresh(id); setTimeout(() => sfxStamp(), 300);
      return next;
    });
    const onEgg = (e) => mark(e.detail);
    let at = 0;
    const onKey = (e) => {
      const k = e.key.length === 1 ? e.key.toLowerCase() : e.key;
      at = k === KONAMI[at] ? at + 1 : (k === KONAMI[0] ? 1 : 0);
      if (at === KONAMI.length) { at = 0; mark('konami'); }
    };
    addEventListener('staged:egg', onEgg);
    addEventListener('keydown', onKey);
    return () => { removeEventListener('staged:egg', onEgg); removeEventListener('keydown', onKey); };
  }, []);

  const n = EGGS.filter((e) => found.has(e.id)).length;
  return (
    <div className="secrets">
      <div className="secrets-head mono">
        <span>{n === EGGS.length ? 'all secrets found, nice' : 'psst, there are secrets on this page'}</span>
        <span className="secrets-count">{n}/{EGGS.length}</span>
      </div>
      <ul>
        {EGGS.map((e) => (
          <li key={e.id} className={`${found.has(e.id) ? 'is-found' : ''}${fresh === e.id ? ' is-fresh' : ''}`}>
            <span className="secret-box" aria-hidden="true">
              <svg viewBox="0 0 16 16" width="12" height="12" fill="none"><path d="M3.5 8.5L6.5 11.5L12.5 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" pathLength="1" /></svg>
            </span>
            <span>{e.hint}</span>
            <span className="sr-only">{found.has(e.id) ? ' (found)' : ''}</span>
          </li>
        ))}
        <li className="is-extra"><span className="secret-box" aria-hidden="true">{'>_'}</span><span>And one for the curious, in the console</span></li>
      </ul>
    </div>
  );
}
