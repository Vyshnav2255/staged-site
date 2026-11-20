'use client';
import Tip from './tip';
import { BrandMark } from './brand';

// The nav logo. Rest on it for a moment and a tooltip says what it is hiding.
export default function NavBrand() {
  return (
    <Tip as="a" href="#top" className="brand" aria-label="Staged" tip="click me 7 times" delay={1500} hostClass="tip-brand-host">
      <BrandMark />staged
    </Tip>
  );
}
