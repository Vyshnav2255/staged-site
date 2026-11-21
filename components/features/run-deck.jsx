'use client';
import { useEffect, useRef, useState } from 'react';
import { track } from '@/lib/track';
import { ICONS } from './run-icons';

// Run, as the app draws it: the project's main command is a cassette deck. Press
// play and the reels spin fast while the server warms up (amber), then the
// label flips to the address and the light turns green (live). Stop pops it
// back up. A demo: nothing runs, and Open just shows where it would go.
const CMD = 'npm run dev';
const HOST = 'localhost:3000';
const LOG_BOOT = ['> my-app@1.0.0 dev', '> next dev', ''];
const LOG_LIVE = ['  ▲ Next.js 16', `  - Local:   http://${HOST}`, '  ✓ Ready in 1.6s'];
const STATE = { idle: 'Ready', boot: 'Starting', live: 'Live', stopping: 'Stopping' };

const Icon = ({ name, size = 16 }) => (
  <svg className="ic" viewBox="0 0 24 24" width={size} height={size} fill="none" aria-hidden="true" dangerouslySetInnerHTML={{ __html: ICONS[name] }} />
);
const p2 = (n) => String(n).padStart(2, '0');
const clock = (s) => `${p2(Math.floor(s / 60) % 60)}:${p2(s % 60)}`;

export default function RunDeck() {
  const [ph, setPh] = useState('idle');
  const [at, setAt] = useState(0);
  const [secs, setSecs] = useState(0);
  const [log, setLog] = useState(false);
  const [fresh, setFresh] = useState(false);
  const timers = useRef([]);
  const later = (fn, ms) => timers.current.push(setTimeout(fn, ms));
  useEffect(() => () => timers.current.forEach(clearTimeout), []);
  useEffect(() => {
    if (ph !== 'boot' && ph !== 'live') return;
    const tick = () => setSecs(Math.floor((Date.now() - at) / 1000));
    tick();
    const t = setInterval(tick, 500);
    return () => clearInterval(t);
  }, [ph, at]);

  const on = ph === 'boot' || ph === 'live';
  const run = () => {
    if (on) return;
    timers.current.forEach(clearTimeout); timers.current = [];
    setAt(Date.now()); setSecs(0); setFresh(false); setPh('boot');
    later(() => { setPh('live'); setFresh(true); }, 1600);
    track('run-deck', { action: 'run' });
  };
  const stop = () => {
    if (!on) return;
    timers.current.forEach(clearTimeout); timers.current = [];
    setPh('stopping'); setFresh(false);
    later(() => setPh('idle'), 900);
    track('run-deck', { action: 'stop' });
  };

  const label = ph === 'live' ? <span className="rd-main mono">{HOST}</span>
    : ph === 'boot' ? <span className="rd-main is-quiet">Warming up…</span>
    : <span className="rd-main">Dev server</span>;
  const lines = ph === 'live' ? [...LOG_BOOT, ...LOG_LIVE] : on || ph === 'stopping' ? LOG_BOOT : [];

  return (
    <div className="rd-wrap">
      <section className={`rd-deck is-${ph}${fresh ? ' is-fresh' : ''}`} aria-label="Run, a demo">
        <header className="rd-top">
          <span className="rd-brand" aria-hidden="true"><Icon name="Queue02" size={13} /><b>staged</b><i className="mono">stereo</i></span>
          <span className="rd-state mono" aria-live="polite">{STATE[ph]}</span>
          <i className="rd-led" />
        </header>
        <div className="rd-tape">
          <div className="rd-label">{label}<code className="rd-cmd mono">{CMD}</code></div>
          <div className="rd-window">
            <span className="rd-reel is-l"><i /></span><span className="rd-band" /><span className="rd-reel is-r"><i /></span>
            <span className="rd-count mono">{clock(on ? secs : 0)}</span>
          </div>
          <span className="rd-screw is-a" /><span className="rd-screw is-b" />
        </div>
        <div className="rd-keys">
          <button type="button" className={`rd-k${on ? ' is-down' : ''}`} onClick={run} disabled={on} aria-pressed={on} aria-label="Run the dev server" data-tip={on ? 'Running' : 'Run'}><Icon name="Play" size={15} /></button>
          <button type="button" className="rd-k is-stop" onClick={stop} disabled={!on} aria-label="Stop" data-tip="Stop"><Icon name="Stop" size={14} /></button>
          <button type="button" className="rd-k is-ink" disabled={ph !== 'live'} aria-label="Open the page" data-tip={ph === 'live' ? `Opens ${HOST}` : 'Opens once it serves a page'}><Icon name="LinkSquare02" size={15} /></button>
          <button type="button" className={`rd-k${log ? ' is-on' : ''}`} onClick={() => setLog((v) => !v)} aria-pressed={log} aria-label="Output" data-tip={log ? 'Hide output' : 'Show output'}><Icon name="Terminal" size={16} /></button>
        </div>
      </section>
      {log && (
        <pre className="rd-log mono">{lines.length ? lines.map((l, i) => <span key={i} className={/https?:\/\//.test(l) ? 'is-url' : ''}>{l + '\n'}</span>) : <span className="is-none">Press play to start it</span>}{on && <i className="rd-caret" />}</pre>
      )}
    </div>
  );
}
