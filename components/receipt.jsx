// One receipt, laid out like the one in the app: labelled meta, ITEM / LINES, each subject on
// its own line with "01 · sha · N files" under it, a double rule above the total, a code and a stamp.
// Used by the printer demo, the "Nice try" jam and the logo-click toast.
// A real QR code (version 3, level M) for https://github.com/Vyshnav2255/staged, one path of dark
// modules, generated once with qrcode-generator and checked by decoding it with jsQR.
const QR_N = 29;
const QR_D = 'M0 0h7v1h-7zM9 0h3v1h-3zM14 0h2v1h-2zM17 0h3v1h-3zM22 0h7v1h-7zM0 1h1v1h-1zM6 1h1v1h-1zM9 1h4v1h-4zM14 1h2v1h-2zM17 1h1v1h-1zM20 1h1v1h-1zM22 1h1v1h-1zM28 1h1v1h-1zM0 2h1v1h-1zM2 2h3v1h-3zM6 2h1v1h-1zM11 2h2v1h-2zM17 2h3v1h-3zM22 2h1v1h-1zM24 2h3v1h-3zM28 2h1v1h-1zM0 3h1v1h-1zM2 3h3v1h-3zM6 3h1v1h-1zM9 3h1v1h-1zM11 3h1v1h-1zM13 3h1v1h-1zM15 3h1v1h-1zM18 3h3v1h-3zM22 3h1v1h-1zM24 3h3v1h-3zM28 3h1v1h-1zM0 4h1v1h-1zM2 4h3v1h-3zM6 4h1v1h-1zM9 4h1v1h-1zM14 4h5v1h-5zM22 4h1v1h-1zM24 4h3v1h-3zM28 4h1v1h-1zM0 5h1v1h-1zM6 5h1v1h-1zM8 5h1v1h-1zM10 5h1v1h-1zM12 5h1v1h-1zM15 5h5v1h-5zM22 5h1v1h-1zM28 5h1v1h-1zM0 6h7v1h-7zM8 6h1v1h-1zM10 6h1v1h-1zM12 6h1v1h-1zM14 6h1v1h-1zM16 6h1v1h-1zM18 6h1v1h-1zM20 6h1v1h-1zM22 6h7v1h-7zM11 7h3v1h-3zM17 7h1v1h-1zM0 8h1v1h-1zM3 8h1v1h-1zM5 8h2v1h-2zM8 8h4v1h-4zM14 8h1v1h-1zM16 8h1v1h-1zM19 8h3v1h-3zM23 8h1v1h-1zM0 9h1v1h-1zM3 9h1v1h-1zM5 9h1v1h-1zM7 9h4v1h-4zM12 9h2v1h-2zM16 9h2v1h-2zM20 9h1v1h-1zM22 9h1v1h-1zM25 9h1v1h-1zM28 9h1v1h-1zM1 10h1v1h-1zM3 10h1v1h-1zM5 10h2v1h-2zM9 10h1v1h-1zM11 10h4v1h-4zM16 10h1v1h-1zM18 10h4v1h-4zM24 10h4v1h-4zM2 11h1v1h-1zM4 11h2v1h-2zM9 11h2v1h-2zM12 11h2v1h-2zM15 11h1v1h-1zM18 11h1v1h-1zM24 11h1v1h-1zM26 11h2v1h-2zM0 12h1v1h-1zM2 12h1v1h-1zM5 12h3v1h-3zM10 12h1v1h-1zM12 12h1v1h-1zM14 12h1v1h-1zM16 12h2v1h-2zM21 12h2v1h-2zM25 12h1v1h-1zM27 12h2v1h-2zM0 13h2v1h-2zM4 13h2v1h-2zM7 13h1v1h-1zM9 13h1v1h-1zM11 13h4v1h-4zM17 13h2v1h-2zM20 13h2v1h-2zM2 14h1v1h-1zM4 14h4v1h-4zM10 14h1v1h-1zM12 14h3v1h-3zM16 14h1v1h-1zM20 14h1v1h-1zM22 14h7v1h-7zM0 15h1v1h-1zM3 15h3v1h-3zM7 15h1v1h-1zM10 15h2v1h-2zM15 15h3v1h-3zM20 15h3v1h-3zM25 15h1v1h-1zM27 15h1v1h-1zM0 16h2v1h-2zM4 16h1v1h-1zM6 16h3v1h-3zM10 16h2v1h-2zM13 16h1v1h-1zM16 16h3v1h-3zM20 16h1v1h-1zM23 16h1v1h-1zM27 16h1v1h-1zM1 17h5v1h-5zM7 17h8v1h-8zM16 17h1v1h-1zM18 17h1v1h-1zM20 17h4v1h-4zM25 17h1v1h-1zM28 17h1v1h-1zM0 18h1v1h-1zM3 18h4v1h-4zM8 18h1v1h-1zM12 18h1v1h-1zM14 18h1v1h-1zM17 18h2v1h-2zM21 18h1v1h-1zM23 18h2v1h-2zM27 18h2v1h-2zM2 19h1v1h-1zM4 19h1v1h-1zM12 19h1v1h-1zM14 19h1v1h-1zM16 19h2v1h-2zM20 19h2v1h-2zM23 19h2v1h-2zM27 19h2v1h-2zM0 20h1v1h-1zM4 20h5v1h-5zM11 20h1v1h-1zM18 20h7v1h-7zM26 20h1v1h-1zM8 21h1v1h-1zM14 21h1v1h-1zM16 21h5v1h-5zM24 21h1v1h-1zM26 21h3v1h-3zM0 22h7v1h-7zM9 22h2v1h-2zM12 22h1v1h-1zM16 22h3v1h-3zM20 22h1v1h-1zM22 22h1v1h-1zM24 22h1v1h-1zM27 22h1v1h-1zM0 23h1v1h-1zM6 23h1v1h-1zM8 23h1v1h-1zM11 23h2v1h-2zM14 23h1v1h-1zM16 23h1v1h-1zM20 23h1v1h-1zM24 23h3v1h-3zM0 24h1v1h-1zM2 24h3v1h-3zM6 24h1v1h-1zM9 24h1v1h-1zM11 24h1v1h-1zM15 24h4v1h-4zM20 24h5v1h-5zM27 24h2v1h-2zM0 25h1v1h-1zM2 25h3v1h-3zM6 25h1v1h-1zM8 25h1v1h-1zM12 25h1v1h-1zM16 25h5v1h-5zM22 25h6v1h-6zM0 26h1v1h-1zM2 26h3v1h-3zM6 26h1v1h-1zM9 26h4v1h-4zM17 26h1v1h-1zM19 26h2v1h-2zM24 26h3v1h-3zM28 26h1v1h-1zM0 27h1v1h-1zM6 27h1v1h-1zM10 27h2v1h-2zM13 27h1v1h-1zM15 27h7v1h-7zM24 27h1v1h-1zM27 27h1v1h-1zM0 28h7v1h-7zM8 28h1v1h-1zM10 28h3v1h-3zM16 28h3v1h-3zM20 28h6v1h-6zM27 28h1v1h-1z';

import { Stain } from './cup-art';

const MARK = (
  <svg className="rcpt-mark" viewBox="0 0 24 24" width="22" height="22" fill="none" aria-hidden="true">
    <path d="M18 18H6C5.05719 18 4.58579 18 4.29289 17.7071C4 17.4142 4 16.9428 4 16C4 15.0572 4 14.5858 4.29289 14.2929C4.58579 14 5.05719 14 6 14H18C18.9428 14 19.4142 14 19.7071 14.2929C20 14.5858 20 15.0572 20 16C20 16.9428 20 17.4142 19.7071 17.7071C19.4142 18 18.9428 18 18 18Z" fill="#1f9a6a" fillOpacity=".18" stroke="#1f9a6a" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M4 10H20" stroke="#4cbb6c" strokeWidth="1.75" strokeLinecap="round" />
    <path d="M4 6H20" stroke="#c4e35a" strokeWidth="1.75" strokeLinecap="round" />
  </svg>
);

function Qr({ size }) {
  return (
    <svg className="rcpt-qr" viewBox={`-2 -2 ${QR_N + 4} ${QR_N + 4}`} width={size} height={size} shapeRendering="crispEdges" aria-hidden="true"><path d={QR_D} fill="currentColor" /></svg>
  );
}

const BAR = [2, 1, 3, 1, 1, 2, 3, 2, 1, 1, 3, 1, 2, 1];

export function Receipt({ label, meta, items, totals, note, stamp, qr, qrLabel, bar, size = 96, tone, noHead, stain, low, className = '', ...rest }) {
  return (
    <div className={`receipt rcpt${tone ? ` is-${tone}` : ''}${low ? ' is-low' : ''}${className ? ` ${className}` : ''}`} style={{ '--qr': `${size}px` }} {...rest}>
      {stain && <Stain className="rcpt-stain" />}
      {low && <span className="rcpt-low mono" aria-hidden="true">paper low</span>}
      <div className="rcpt-top rcpt-p"><span className="rcpt-brand">{MARK}<span>staged</span></span><span className="mono">{label}</span></div>
      <div className="rcpt-meta">
        {meta.map(([l, r]) => <div className="rcpt-row mono rcpt-p" key={l}><span>{l}</span><span>{r}</span></div>)}
      </div>
      <hr className="rcpt-p" />
      {!noHead && <div className="rcpt-row rcpt-head mono rcpt-p"><span>Item</span><span>Lines</span></div>}
      {items.map((it) => (
        <div className={`rcpt-item rcpt-p${it.cls ? ` ${it.cls}` : ''}`} key={it.l}>
          <div className="rcpt-row rcpt-line"><span>{it.pre}{it.hl ? <mark className="rcpt-hl">{it.l}</mark> : it.l}</span></div>
          <div className="rcpt-row rcpt-sub mono"><span>{it.sl}</span><i className="rcpt-dots" aria-hidden="true" /><span>{it.sr}</span></div>
        </div>
      ))}
      <hr className="rcpt-p" />
      {totals.map(([l, r, b]) => <div className={`rcpt-row rcpt-p${b ? ' rcpt-total' : ''}`} key={l}><span>{l}</span><span className="mono">{r}</span></div>)}
      <hr className="rcpt-p" />
      <div className="rcpt-thanks rcpt-p">{note}</div>
      <div className="rcpt-stamp" aria-hidden="true"><span>{stamp[0]}</span><small>{stamp[1]}</small></div>
      {qr ? (
        <div className="rcpt-code rcpt-p"><Qr size={size} />{qrLabel && <span className="mono">{qrLabel}</span>}</div>
      ) : (
        <div className="rcpt-bar rcpt-p" aria-hidden="true">{BAR.map((w, i) => <i key={i} style={{ width: w }} />)}</div>
      )}
    </div>
  );
}
