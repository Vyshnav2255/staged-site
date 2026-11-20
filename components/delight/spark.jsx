// A small green sparkle burst, centred on whatever it sits inside (which needs position: relative).
const BITS = [0, 1, 2, 3, 4, 5, 6, 7].map((i) => ({
  a: i * 45 + (i % 2 ? 12 : -6),
  d: 30 + (i % 3) * 8,
  s: 7 + (i % 2) * 3,
  lime: i % 3 === 0,
  delay: (i % 4) * 30,
}));

export function Spark() {
  return (
    <span className="spark" aria-hidden="true">
      <u className="spark-ring" />
      {BITS.map((b, i) => (
        <i key={i} className={b.lime ? 'is-lime' : undefined} style={{ '--a': `${b.a}deg`, '--d': `${b.d}px`, '--s': `${b.s}px`, '--w': `${b.delay}ms` }} />
      ))}
    </span>
  );
}
