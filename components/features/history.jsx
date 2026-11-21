// History you can read: one lane of commits over three weeks, a feature branch
// that leaves and merges back, a short fix lane, a tag on the latest commit
// (HEAD), and a strip of commits per day under the dates.
const DAYS = [3, 6, 9, 4, 7, 2, 0, 5, 10, 13, 8, 11, 3, 2, 6, 9, 12, 7, 0, 0, 0];

import { useRelease } from '@/components/release';

export default function HistoryArt() {
  const tag = useRelease()?.tag || 'v1.0.0';
  const w = Math.max(54, Math.round(tag.length * 7.6 + 10));
  return (
    <svg className="art art-history" viewBox="0 0 400 200" aria-hidden="true">
      <text x="200" y="20" textAnchor="middle">label-printer</text>
      <path d="M26 90H374" />
      <path d="M60 90C78 90 74 112 92 112S106 90 124 90" />
      <path className="acc branch" d="M124 90C160 90 146 38 182 38H218C254 38 240 90 276 90" pathLength="1" />
      {[168, 200, 232, 308].map((x) => <circle key={x} className="dot" cx={x} cy="90" r="2.5" />)}
      {[60, 124, 276].map((x) => <circle key={x} className="paper" cx={x} cy="90" r="6" />)}
      <circle className="paper" cx="92" cy="112" r="4.5" />
      <text className="dim xs" x="92" y="132" textAnchor="middle">fix/crash</text>
      {[182, 218].map((x, n) => <circle key={x} className="tint bnode" cx={x} cy="38" r="6" style={{ '--n': n }} />)}
      <path d="M340 84V72" />
      <rect className="paper" x={340 - w / 2} y="50" width={w} height="22" rx="11" />
      <text x="340" y="65" textAnchor="middle">{tag}</text>
      <circle className="tint" cx="340" cy="90" r="6" />
      <text className="plus" x="340" y="114" textAnchor="middle">HEAD</text>
      <text className="akt" x="60" y="156" textAnchor="middle">Nov 2</text>
      <text className="akt" x="200" y="156" textAnchor="middle">Nov 9</text>
      <text className="akt" x="340" y="156" textAnchor="middle">Nov 16</text>
      {DAYS.map((h, i) => {
        const x = [60, 200, 340][Math.floor(i / 7)] - 23 + (i % 7) * 7;
        return <rect key={i} className={i === 17 ? 'wk on' : 'wk'} x={x} y={190 - Math.max(h * 1.4, 2)} width="4" height={Math.max(h * 1.4, 2)} rx="1.5" />;
      })}
    </svg>
  );
}
