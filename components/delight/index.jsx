'use client';
import { ConsoleArt } from './console-art';
import { FocusSounds } from './focus-sounds';
import { LogoClicks } from './logo-clicks';

// Page-wide delight that has no home of its own. Renders nothing but the logo toast.
export default function Delight() {
  return (
    <>
      <ConsoleArt />
      <FocusSounds />
      <LogoClicks />
    </>
  );
}
