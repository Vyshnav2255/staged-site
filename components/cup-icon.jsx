// A clean line cup (1.5 stroke, 24 grid) with three steam wisps. Wisps are .steam paths so each
// context can animate them (nav hover, cart add).
export default function CupIcon({ size = 18, className = '' }) {
  return (
    <svg className={`cup${className ? ` ${className}` : ''}`} viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M3.5 9.5H16.5V14C16.5 16.7614 14.2614 19 11.5 19H8.5C5.73858 19 3.5 16.7614 3.5 14V9.5Z" />
      <path d="M16.5 11H17.5C18.8807 11 20 12.1193 20 13.5C20 14.8807 18.8807 16 17.5 16H16" />
      <path d="M6 21.5H14" />
      <path className="steam s1" d="M7 6.5C6 5.5 8 4.5 7 3" />
      <path className="steam s2" d="M10 6.5C9 5.5 11 4.5 10 3" />
      <path className="steam s3" d="M13 6.5C12 5.5 14 4.5 13 3" />
    </svg>
  );
}
