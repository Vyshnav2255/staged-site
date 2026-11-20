'use client';
import { useRef, useState } from 'react';
import { useCardHover } from './parts';
import { COMMITS } from './data';

// A diff panel above (added lines tinted green, the removed one grey), the commit
// message it turns into below (the green accent, with a solid green tag on its
// corner). On hover a line reads down the diff, then the message is typed out
// again, a character at a time.

const LINES = [
  ['', 13, "import { feed } from './paper'"],
  ['+', 14, 'export function printLabel(job) {'],
  ['+', 15, '  const paper = feed(job.size)'],
  ['+', 16, '  return paper.print(job.label)'],
  ['-', 17, '  // todo: labels'],
];
const TEXT = COMMITS[0].subject;
const READ_MS = 900, KEY_MS = 30;

export default function WriteArt() {
  const root = useRef(null);
  const [n, setN] = useState(TEXT.length);
  const [typing, setTyping] = useState(false);

  useCardHover(root, () => {
    let t = 0, i = 0;
    setN(0); setTyping(true);
    const key = () => {
      i += 1; setN(i);
      if (i < TEXT.length) t = setTimeout(key, KEY_MS + (TEXT[i - 1] === ' ' ? 50 : 0));
      else setTyping(false);
    };
    t = setTimeout(key, READ_MS);
    return () => { clearTimeout(t); setN(TEXT.length); setTyping(false); };
  });

  return (
    <div ref={root} className={`art art-write${typing ? ' is-typing' : ''}`} aria-hidden="true">
      <div className="diff panel">
        <div className="panel-head">
          <i className="fmark" />
          <span className="mono">src/printer.js</span>
          <span className="badge">+4 −1</span>
        </div>
        <div className="diff-body mono">
          {LINES.map(([sign, no, code]) => (
            <div key={no} className={`ln${sign === '+' ? ' add' : sign === '-' ? ' del' : ''}`}>
              <span className="no">{no}</span><span className="sg">{sign === '-' ? '−' : sign}</span><span className="code">{code}</span>
            </div>
          ))}
          <i className="scan" />
        </div>
      </div>
      <svg className="conn" viewBox="0 0 388 270" width="388" height="270">
        <path d="M194 164V180" /><path d="M190 176.500L194 180.500L198 176.500" />
      </svg>
      <div className="msg panel is-acc">
        <div className="msg-main">
          <span className="msg-cap mono"><i className="cdot" />commit message</span>
          <span className="msg-text"><span>{TEXT.slice(0, n)}</span><i className="caret" /></span>
        </div>
        <span className="chip is-on">your style</span>
      </div>
    </div>
  );
}
