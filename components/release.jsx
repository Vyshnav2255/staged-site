'use client';
import { createContext, useContext, useEffect, useState } from 'react';
import { REPO, shapeRelease } from '@/lib/site';
import { reducedMotion } from './delight/util';

const Ctx = createContext(null);
const Live = createContext(false);
const CACHE = 'staged-site-release';
const SEEN = 'staged-site-seen-tag';

// Starts from the release baked in at build time, then asks GitHub for the
// latest one, so the copy command and the footer follow new releases.
export function ReleaseProvider({ initial, children }) {
  const [release, setRelease] = useState(initial);
  const [live, setLive] = useState(false); // true once we know which release is really the latest
  useEffect(() => {
    let off = false;
    try {
      const hit = JSON.parse(sessionStorage.getItem(CACHE) || 'null');
      if (hit?.tag) { setRelease(hit); setLive(true); return; }
    } catch {}
    fetch(`https://api.github.com/repos/${REPO}/releases/latest`, { headers: { Accept: 'application/vnd.github+json' } })
      .then((r) => (r.ok ? r.json() : null))
      .then((j) => {
        const next = shapeRelease(j);
        if (!next || off) return;
        setRelease(next);
        try { sessionStorage.setItem(CACHE, JSON.stringify(next)); } catch {}
      })
      .catch(() => {})
      .finally(() => { if (!off) setLive(true); });
    return () => { off = true; };
  }, []);
  return <Ctx.Provider value={release}><Live.Provider value={live}>{children}</Live.Provider></Ctx.Provider>;
}

export const useRelease = () => useContext(Ctx);
const useLive = () => useContext(Live);

export function ago(iso) {
  if (!iso) return '';
  const d = Math.round((Date.now() - new Date(iso).getTime()) / 864e5);
  if (d <= 0) return 'today';
  if (d === 1) return 'yesterday';
  if (d < 14) return `${d} days ago`;
  if (d < 60) return `${Math.round(d / 7)} weeks ago`;
  return new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}

// The version, wherever it's mentioned. Briefly flashes when it changes.
export function Version({ prefix = '' }) {
  const r = useRelease();
  const [flash, setFlash] = useState(false);
  const [seen, setSeen] = useState(r.tag);
  useEffect(() => {
    if (r.tag === seen) return;
    setSeen(r.tag); setFlash(true);
    const t = setTimeout(() => setFlash(false), 900);
    return () => clearTimeout(t);
  }, [r.tag, seen]);
  return <span className={flash ? 'ver is-new' : 'ver'}>{prefix}{r.tag}</span>;
}

// A release you haven't seen before gets one small sparkle (on the copy button), then we remember it.
export function useFreshRelease() {
  const r = useRelease();
  const live = useLive();
  const [burst, setBurst] = useState(false);
  useEffect(() => {
    if (!live) return;
    let seen = null;
    try { seen = localStorage.getItem(SEEN); } catch {}
    if (seen === r.tag) return;
    try { localStorage.setItem(SEEN, r.tag); } catch {}
    if (reducedMotion()) return;
    setBurst(true);
    const t = setTimeout(() => setBurst(false), 1500);
    return () => clearTimeout(t);
  }, [live, r.tag]);
  return burst;
}
