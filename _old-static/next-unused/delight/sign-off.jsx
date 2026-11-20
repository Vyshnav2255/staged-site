'use client';
import { useEffect, useRef, useState } from 'react';
import { reducedMotion, todayShort } from './util';

// When the footer comes into view, a receipt line prints in with how far you read.
export function SignOff() {
  const ref = useRef(null);
  const [line, setLine] = useState('');
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    const el = ref.current;
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      io.disconnect();
      const px = Math.round(document.documentElement.scrollHeight).toLocaleString('en-US');
      setLine(`Read ${px}px · ${todayShort()} · thanks for scrolling`);
      setSeen(true);
    }, { threshold: 0.9 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <div ref={ref} className={`signoff${seen ? ' is-in' : ''}`}>
      {seen && (
        <div className="signoff-slip mono" role="status">
          <span className="signoff-paper">{line}</span>
        </div>
      )}
    </div>
  );
}
