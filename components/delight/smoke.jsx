// Line-art puffs that rise from the printer slot when it jams.
const PUFFS = [
  { x: -22, s: 0.8, d: 0 }, { x: 14, s: 1, d: 0.25 }, { x: -6, s: 0.7, d: 0.5 },
  { x: 24, s: 0.9, d: 0.78 }, { x: -16, s: 1.05, d: 1.05 }, { x: 4, s: 0.75, d: 1.3 },
];
const CLOUD = 'M8 20C4.7 20 2 17.6 2 14.5C2 11.7 4.1 9.4 6.9 9.1C7.6 5.7 10.5 3 14 3C17.2 3 19.9 5.1 20.9 8C21.3 7.9 21.7 7.9 22 7.9C26 7.9 29.5 10.9 29.5 14.5C29.5 17.6 27 20 24 20H8Z';

export function Smoke({ run }) {
  if (!run) return null;
  return (
    <div className="smoke" aria-hidden="true" key={run}>
      {PUFFS.map((p, i) => (
        <svg key={i} viewBox="0 0 32 24" width="44" height="33" style={{ '--x': `${p.x}px`, '--s': p.s, '--d': `${p.d}s` }}>
          <path d={CLOUD} />
        </svg>
      ))}
    </div>
  );
}
