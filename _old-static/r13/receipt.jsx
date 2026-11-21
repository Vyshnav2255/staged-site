import { BrandMark } from '@/components/brand';
import { COMMITS, TOTAL } from './data';

// The push receipt rising out of the printer: a torn top edge, the brand, the
// push number, a line per commit, the total (a green-tinted band) and a barcode.
// The printer is a grey body; its slot is the green accent. At rest the last
// stretch is still inside; on hover the paper feeds out in steps and the lamp blinks.

const ITEMS = COMMITS.map((c) => [c.scope, `+${c.add} −${c.del}`]);
const BARS = [2, 1, 1, 3, 1, 2, 1, 1, 2, 3, 1, 1, 2, 1, 3, 1, 2, 1, 1, 3, 2, 1, 1, 2, 1, 3, 1, 1, 2, 1, 2, 3, 1, 1];
// the torn edge: forty 5px teeth across the 200px paper
const TEAR = `M.5 5${Array.from({ length: 40 }, (_, i) => `L${i * 5 + 2.5} ${i % 2 ? 4.5 : 0.5}`).join('')}L199.500 5`;

export default function ReceiptArt() {
  return (
    <div className="art art-receipt" aria-hidden="true">
      <div className="printer panel">
        <i className="slot" />
        <span className="plate mono">staged</span>
        <i className="p-led" />
      </div>
      <div className="out">
        <div className="paper mono">
          <svg className="tear" viewBox="0 0 200 5" width="200" height="5"><path d={TEAR} /></svg>
          <div className="p-brand"><BrandMark size={14} /><b>staged</b></div>
          <div className="p-no">push receipt no. 0042</div>
          <hr />
          {ITEMS.map(([name, lines]) => <div className="p-row" key={name}><span>{name}</span><span>{lines}</span></div>)}
          <hr />
          <div className="p-row p-total"><span>total</span><span>+{TOTAL.add} −{TOTAL.del}</span></div>
          <div className="p-bars">{BARS.map((w, i) => <i key={i} style={{ width: w }} />)}</div>
          <div className="p-thanks">main → origin · 19 Nov</div>
        </div>
      </div>
    </div>
  );
}
