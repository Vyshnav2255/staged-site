import { useId } from 'react';

// The illustrated cup for the coffee add-on and the footer card: saucer, cup, handle,
// a liquid that rises inside the cup's clip, a crema top and two steam wisps.
// State lives in classes on the svg (is-full, is-pour, is-tilt), animated in globals.css.
const BODY = 'M12 18H36L34.2 32.6C33.9 35.1 31.8 37 29.2 37H18.8C16.2 37 14.1 35.1 13.8 32.6L12 18Z';

export default function CupArt({ size = 48, full = false, className = '' }) {
  const id = useId().replace(/:/g, '');
  return (
    <svg className={`cup-art${full ? ' is-full' : ''}${className ? ` ${className}` : ''}`} viewBox="0 0 48 48" width={size} height={size} fill="none" aria-hidden="true">
      <defs><clipPath id={`cup-${id}`}><path d={BODY} /></clipPath></defs>
      <ellipse className="ca-saucer" cx="24" cy="40.5" rx="17" ry="3" fill="var(--well)" stroke="var(--ink)" strokeWidth="1.5" />
      <path d={BODY} fill="#fff" />
      <g clipPath={`url(#cup-${id})`}>
        <g className="ca-liquid">
          <rect x="10" y="20" width="28" height="20" fill="var(--cf-1)" />
          <ellipse className="ca-crema" cx="24" cy="20.4" rx="12.6" ry="2.4" fill="var(--cf-2)" />
        </g>
      </g>
      <path className="ca-handle" d="M35.4 22H37.2C39.4 22 41 23.8 41 26C41 28.2 39.4 30 37.2 30H34.4" stroke="var(--ink)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d={BODY} stroke="var(--ink)" strokeWidth="1.5" strokeLinejoin="round" />
      <ellipse cx="24" cy="18" rx="12" ry="1.6" stroke="var(--ink)" strokeWidth="1.5" fill="none" className="ca-rim" />
      <path className="ca-steam s1" d="M20 13.5C18.6 11.8 21.4 10.2 20 8.2C19.2 7 19.8 5.8 20.4 5" stroke="var(--muted)" strokeWidth="1.5" strokeLinecap="round" pathLength="12" />
      <path className="ca-steam s2" d="M27.5 13.5C26.1 11.8 28.9 10.2 27.5 8.2C26.7 7 27.3 5.8 27.9 5" stroke="var(--muted)" strokeWidth="1.5" strokeLinecap="round" pathLength="12" />
    </svg>
  );
}

// The coffee stain: a broken ring, a soft inner ring and a drip, wobbled by #stain (see StainDefs).
export function Stain({ size = 64, className = '' }) {
  return (
    <svg className={`stain${className ? ` ${className}` : ''}`} viewBox="0 0 64 64" width={size} height={size} fill="none" aria-hidden="true">
      <g filter="url(#stain)">
        <circle cx="32" cy="32" r="27" stroke="#8a5a34" strokeWidth="2.2" strokeOpacity=".34" strokeDasharray="118 9 30 13" strokeLinecap="round" />
        <circle cx="32" cy="32" r="25.5" stroke="#8a5a34" strokeWidth="5" strokeOpacity=".07" />
        <circle cx="57.5" cy="45.5" r="1.5" fill="#8a5a34" fillOpacity=".3" />
      </g>
    </svg>
  );
}

// Shared SVG filters, rendered once on the page: the rough rubber-stamp ink and the stain wobble.
export function StainDefs() {
  return (
    <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden="true" focusable="false">
      <defs>
        <filter id="stamp-rough" x="-10%" y="-20%" width="120%" height="140%">
          <feTurbulence type="fractalNoise" baseFrequency=".9" numOctaves="2" seed="3" result="n" />
          <feDisplacementMap in="SourceGraphic" in2="n" scale="1.4" xChannelSelector="R" yChannelSelector="G" result="d" />
          <feColorMatrix in="n" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 -1.6 1.25" result="holes" />
          <feComposite in="d" in2="holes" operator="in" />
        </filter>
        <filter id="stain" x="-20%" y="-20%" width="140%" height="140%">
          <feTurbulence type="fractalNoise" baseFrequency=".035" numOctaves="2" seed="7" result="w" />
          <feDisplacementMap in="SourceGraphic" in2="w" scale="3" xChannelSelector="R" yChannelSelector="G" result="d" />
          <feGaussianBlur in="d" stdDeviation=".35" />
        </filter>
      </defs>
    </svg>
  );
}
