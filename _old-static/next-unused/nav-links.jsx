'use client';
import { useEffect, useRef, useState } from 'react';

// The nav's centre links with one shared indicator pill. The pill sits under the section you
// are reading and follows the pointer while you hover; it springs between links in CSS.
const LINKS = [['questions', 'FAQ']];

export default function NavLinks() {
  const [active, setActive] = useState(null);
  const [hover, setHover] = useState(null);
  const box = useRef(null), pill = useRef(null), moved = useRef(false);

  useEffect(() => {
    const seen = new Map();
    const io = new IntersectionObserver((es) => {
      es.forEach((e) => seen.set(e.target.id, e.isIntersecting));
      const hit = LINKS.find(([id]) => seen.get(id));
      setActive(hit ? hit[0] : null);
    }, { rootMargin: '-40% 0px -55% 0px' });
    LINKS.forEach(([id]) => { const el = document.getElementById(id); if (el) io.observe(el); });
    return () => io.disconnect();
  }, []);

  const target = hover || active;
  useEffect(() => {
    const el = pill.current, host = box.current;
    if (!el || !host) return;
    const a = target && host.querySelector(`[data-id="${target}"]`);
    if (!a) { el.style.opacity = '0'; return; }
    const first = !moved.current || el.style.opacity === '0';
    if (first) el.style.transition = 'opacity 150ms ease';
    el.style.width = `${a.offsetWidth}px`;
    el.style.transform = `translateX(${a.offsetLeft}px)`;
    el.style.opacity = '1';
    if (first) { void el.offsetWidth; el.style.transition = ''; }
    moved.current = true;
  }, [target]);

  return (
    <nav className="nav-mid" ref={box} aria-label="Sections" onPointerLeave={() => setHover(null)}>
      <span className="nav-ind" ref={pill} aria-hidden="true" style={{ opacity: 0 }} />
      {LINKS.map(([id, label]) => (
        <a key={id} data-id={id} href={`#${id}`} className={`nav-a${active === id ? ' is-active' : ''}`} aria-current={active === id ? 'location' : undefined}
          onPointerEnter={() => setHover(id)} onFocus={() => setHover(id)} onBlur={() => setHover(null)}>{label}</a>
      ))}
    </nav>
  );
}
