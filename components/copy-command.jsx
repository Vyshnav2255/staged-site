'use client';
import { useEffect, useRef, useState } from 'react';
import { useRelease } from './release';
import { GH, installCommand } from '@/lib/site';
import { sfxTick } from '@/lib/sfx';

// The command bar, the line under it (it swaps to a hint after copying) and, on phones, a share button.
export default function CopyCommand({ children }) {
  const { tag } = useRelease();
  const [done, setDone] = useState(false);
  const [hint, setHint] = useState(false);
  const [shared, setShared] = useState('');
  const timer = useRef(0);
  const hintTimer = useRef(0);
  const shareTimer = useRef(0);
  const bar = useRef(null);
  useEffect(() => () => { clearTimeout(timer.current); clearTimeout(hintTimer.current); clearTimeout(shareTimer.current); }, []);

  // "Get Staged" while the command is already in view: scrolling does nothing, so the bar answers instead.
  useEffect(() => {
    const onClick = (e) => {
      if (!e.target.closest?.('#nav a[href="#get"]')) return;
      const wait = scrollY < 120 ? 0 : 650;
      setTimeout(() => {
        const el = bar.current;
        if (!el) return;
        el.classList.remove('is-ping');
        void el.getBoundingClientRect();
        el.classList.add('is-ping');
      }, wait);
    };
    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, []);

  const copy = async () => {
    try { await navigator.clipboard.writeText(installCommand(tag)); } catch { return; }
    sfxTick(2);
    setDone(true);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setDone(false), 1600);
    setHint(true);
    clearTimeout(hintTimer.current);
    hintTimer.current = setTimeout(() => setHint(false), 3000);
  };

  const share = async () => {
    const url = location.href.split('#')[0];
    try {
      if (navigator.share) { await navigator.share({ title: 'Staged', text: 'Staged sorts your uncommitted changes into clean commits.', url }); return; }
    } catch (e) { if (e?.name === 'AbortError') return; }
    try { await navigator.clipboard.writeText(url); setShared('Link copied'); } catch { setShared('Copy the link from the address bar'); }
    clearTimeout(shareTimer.current);
    shareTimer.current = setTimeout(() => setShared(''), 2200);
  };

  const pieces = (
    <>
      <b>git</b> clone <i>--branch</i> <span className="cmd-tag" key={tag}>{tag}</span> <u>{GH}.git</u> <i>&amp;&amp;</i> <b>cd</b> staged <i>&amp;&amp;</i> <b>npm</b> start
    </>
  );

  return (
    <>
    <div ref={bar} className={`cmd mono${done ? ' is-done' : ''}`} onAnimationEnd={(e) => { if (e.animationName === 'cmd-ring') e.currentTarget.classList.remove('is-ping'); }}>
      <span className="cmd-prompt" aria-hidden="true">$</span>
      <code>
        <span className="sr-only">{installCommand(tag)}</span>
        <span aria-hidden="true">{pieces}</span>
      </code>
      <span className="cmd-div" aria-hidden="true" />
      <button type="button" className="copy" onClick={copy} aria-label={done ? 'Copied' : 'Copy the install command'}>
        <span className="copy-icons" aria-hidden="true">
          <svg className="i-copy" viewBox="0 0 24 24" width="15" height="15" fill="none"><path d="M9 15C9 12.1716 9 10.7574 9.87868 9.87868C10.7574 9 12.1716 9 15 9H16C18.8284 9 20.2426 9 21.1213 9.87868C22 10.7574 22 12.1716 22 15V16C22 18.8284 22 20.2426 21.1213 21.1213C20.2426 22 18.8284 22 16 22H15C12.1716 22 10.7574 22 9.87868 21.1213C9 20.2426 9 18.8284 9 16V15Z" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /><path d="M16.9999 9C16.9975 6.04291 16.9528 4.51121 16.092 3.46243C15.9258 3.25989 15.7401 3.07418 15.5376 2.90796C14.4312 2 12.7875 2 9.5 2C6.21252 2 4.56878 2 3.46243 2.90796C3.25989 3.07417 3.07418 3.25989 2.90796 3.46243C2 4.56878 2 6.21252 2 9.5C2 12.7875 2 14.4312 2.90796 15.5376C3.07417 15.7401 3.25989 15.9258 3.46243 16.092C4.51121 16.9528 6.04291 16.9975 9 16.9999" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
          <svg className="i-check" viewBox="0 0 24 24" width="15" height="15" fill="none"><path d="M5 14L8.5 17.5L19 6.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" pathLength="1" /></svg>
        </span>
      </button>
      <span className="copy-tip" role="status">{done ? `Copied, clones ${tag}` : ''}</span>
    </div>
    <div className={`meta hero-meta${hint ? ' is-hint' : ''}`}>
      <div className="meta-row" aria-hidden={hint || undefined}>{children}</div>
      <p className="meta-hint" aria-hidden="true">Copied. Paste it in a terminal. Staged opens in your browser.</p>
    </div>
    <button type="button" className="share-btn" onClick={share}>
      <svg viewBox="0 0 24 24" width="16" height="16" fill="none" aria-hidden="true"><path d="M12 15V3M12 3L8 7M12 3L16 7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /><path d="M7 10H6C4.9 10 4 10.9 4 12V19C4 20.1 4.9 21 6 21H18C19.1 21 20 20.1 20 19V12C20 10.9 19.1 10 18 10H17" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg>
      <span>{shared || 'Send this to my computer'}</span>
    </button>
    </>
  );
}
