'use client';
import { useState } from 'react';
import { asset } from '@/lib/site';

// What's new: four real screens from the app, picked from a list on the left.
// Screens are 2x captures of the app running on demo repos (public/img/new/*.webp).
const SCREENS = [
  { id: 'home', label: 'Home', title: 'Everything waiting, at a glance',
    text: 'A status line says what needs you. Below it, every repo with commits ready, things to push and things to pull, and six months of work in Staged greens.' },
  { id: 'commit', label: 'Grouping', title: 'Big mixed piles, split cleanly',
    text: 'The new grouping engine keeps a feature with its styles, gives palettes and dependency bumps commits of their own, and flags anything it is unsure of.' },
  { id: 'run', label: 'Run', title: 'Dev servers, minus the terminal',
    text: 'Each project’s commands sit on a cassette deck. Press play and it goes live, the port shows in the sidebar, and the output is one click away.' },
  { id: 'media', label: 'Media', title: 'Shrink heavy images and videos',
    text: 'Staged spots images and videos that are heavier than they need to be, converts them and updates the links. One click undoes it.' },
];

export default function WhatsNew() {
  const [on, setOn] = useState(0);
  return (
    <div className="wn reveal-self">
      <div className="wn-list" role="tablist" aria-label="New in Staged" style={{ '--on': on }}>
        {SCREENS.map((s, i) => (
          <button key={s.id} role="tab" id={`wn-tab-${s.id}`} aria-selected={on === i} aria-controls="wn-screen"
            className={`wn-item${on === i ? ' is-on' : ''}`} onClick={() => setOn(i)}>
            <span className="wn-label mono">{s.label}</span>
            <span className="wn-title">{s.title}</span>
            <span className="wn-text">{s.text}</span>
          </button>
        ))}
      </div>
      <div className="wn-screen" id="wn-screen" role="tabpanel" aria-labelledby={`wn-tab-${SCREENS[on].id}`}>
        {SCREENS.map((s, i) => (
          <img key={s.id} src={asset(`/img/new/${s.id}.webp`)} width="2880" height="1800" alt={`Staged ${s.label}: ${s.title}`}
            className={on === i ? 'is-on' : ''} loading={i ? 'lazy' : 'eager'} decoding="async" />
        ))}
      </div>
      <p className="wn-caption" aria-live="polite"><b>{SCREENS[on].title}</b>{SCREENS[on].text}</p>
    </div>
  );
}

const ALSO = [
  { k: 'safe to push', h: 'A pill you can trust', p: 'Suggestions Staged is sure of say Safe to push. The rest say Check grouping.' },
  { k: 'sidebar', h: 'Running dots', p: 'A repo serving a dev server shows its port right in the list.' },
  { k: 'overview', h: 'Codebase and weight', p: 'Every repo gets its languages, size and releases on one page.' },
  { k: 'motion', h: 'Springs, by hand', p: 'Panels slide in on tuned springs. Every edge is a crisp half pixel.' },
];

export function AlsoNew() {
  return (
    <div className="also reveal-group">
      {ALSO.map((a) => (
        <div className="also-item" key={a.k}>
          <span className="also-k mono">{a.k}</span>
          <h3>{a.h}</h3>
          <p>{a.p}</p>
        </div>
      ))}
    </div>
  );
}
