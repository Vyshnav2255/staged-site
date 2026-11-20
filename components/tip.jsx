'use client';
import { useEffect, useId, useRef, useState } from 'react';

// A quiet tooltip for a focusable trigger. Opens on hover (after `delay` ms) or on keyboard focus,
// closes on leave, blur or Escape, and is tied to the trigger with aria-describedby.
export default function Tip({ as: As = 'span', tip, delay = 0, side = 'bottom', align = 'start', className = '', hostClass = '', children, ...rest }) {
  const id = useId();
  const [open, setOpen] = useState(false);
  const timer = useRef(0);
  useEffect(() => () => clearTimeout(timer.current), []);
  const show = (ms) => { clearTimeout(timer.current); timer.current = setTimeout(() => setOpen(true), ms); };
  const hide = () => { clearTimeout(timer.current); setOpen(false); };
  return (
    <span className={`tip-host${hostClass ? ` ${hostClass}` : ''}`}>
      <As
        {...rest}
        className={className}
        aria-describedby={id}
        onPointerEnter={(e) => { if (e.pointerType !== 'touch') show(delay); }}
        onPointerLeave={hide}
        onFocus={() => show(0)}
        onBlur={hide}
        onKeyDown={(e) => { if (e.key === 'Escape') hide(); }}
        onClick={(e) => { rest.onClick?.(e); if (delay) hide(); }}
      >{children}</As>
      <span id={id} role="tooltip" className={`tip is-${side} is-${align}${open ? ' is-open' : ''}`}>{tip}</span>
    </span>
  );
}
