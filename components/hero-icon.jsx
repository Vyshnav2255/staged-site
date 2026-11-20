'use client';
import { useRef } from 'react';
import { replay } from './delight/util';

// Poke the icon and it hops. Inline, so its three bars can stack when the logo gets clicked
// (see delight/logo-clicks.jsx). The sound for a click comes from there too.
export default function HeroIcon({ size = 64 }) {
  const svg = useRef(null);
  return (
    <button type="button" className="hero-icon" style={{ '--s': `${size}px` }} aria-label="Staged"
      onClick={() => replay(svg.current, 'hop')}>
      <svg ref={svg} viewBox="0 0 64 64" width={size} height={size} fill="none" aria-hidden="true">
        <rect width="64" height="64" rx="14" fill="#0b0b0b" />
        <g transform="translate(8 8) scale(2)">
          <path className="bar b3" d="M18 18H6C5.05719 18 4.58579 18 4.29289 17.7071C4 17.4142 4 16.9428 4 16C4 15.0572 4 14.5858 4.29289 14.2929C4.58579 14 5.05719 14 6 14H18C18.9428 14 19.4142 14 19.7071 14.2929C20 14.5858 20 15.0572 20 16C20 16.9428 20 17.4142 19.7071 17.7071C19.4142 18 18.9428 18 18 18Z" fill="#1f9a6a" fillOpacity=".2" stroke="#1f9a6a" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          <path className="bar b2" d="M4 10H20" stroke="#4cbb6c" strokeWidth="1.6" strokeLinecap="round" />
          <path className="bar b1" d="M4 6H20" stroke="#c4e35a" strokeWidth="1.6" strokeLinecap="round" />
        </g>
      </svg>
    </button>
  );
}
