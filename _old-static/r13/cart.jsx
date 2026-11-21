import { Badge, Stat } from './parts';
import { COMMITS } from './data';

// The cart: a panel of commits waiting to go (grey rows), an empty dashed slot at
// the top, and one more commit (the green accent: a tinted row) hovering above it.
// On hover the commit drops into the slot and the solid green count ticks 2 to 3.

const [NEW, ...ROWS] = COMMITS;

function CartIcon() {
  return (
    <svg className="cart-icon" viewBox="0 0 16 16" width="16" height="16" fill="none">
      <path d="M1.75 2.25h1.6c.4 0 .74.28.82.67l1.5 6.9c.08.39.42.68.82.68h5.4c.38 0 .72-.26.81-.63l1.05-4.37H4.6" />
      <circle cx="6.6" cy="13" r=".9" /><circle cx="11.6" cy="13" r=".9" />
    </svg>
  );
}

export default function CartArt() {
  return (
    <div className="art art-cart" aria-hidden="true">
      <div className="cart panel">
        <div className="panel-head">
          <CartIcon />
          <b>Cart</b>
          <Badge on className="cbadge"><span className="roll"><i>2</i><i>3</i></span></Badge>
          <span className="branch mono"><i className="rdot" />main</span>
        </div>
        <div className="rows">
          <i className="landing" />
          {ROWS.map((r) => (
            <div key={r.subject} className="row">
              <i className="cdot" /><b>{r.subject}</b><Stat add={r.add} del={r.del} />
            </div>
          ))}
        </div>
      </div>
      <div className="incoming">
        <div className="row is-acc">
          <i className="cdot" /><b>{NEW.subject}</b><Stat add={NEW.add} del={NEW.del} />
        </div>
      </div>
    </div>
  );
}
