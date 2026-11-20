'use client';
import { useEffect } from 'react';
import { GH } from '@/lib/site';

// A receipt in the console, once per page load.
const RECEIPT = `
   .----------------------------.
   |   S T A G E D              |
   |   PUSH RECEIPT             |
   |  - - - - - - - - - - - - - |
   |   curious people       +1  |
   |   open dev tools       +1  |
   |   read the source      +1  |
   |  - - - - - - - - - - - - - |
   |   Total                +3  |
   |                  [SHIPPED] |
   |  |||| | ||| || |||| | ||   |
   '\\/\\/\\/\\/\\/\\/\\/\\/\\/\\/\\/\\/\\/\\/'
`;

export function ConsoleArt() {
  useEffect(() => {
    if (window.__stagedConsole) return;
    window.__stagedConsole = true;
    console.log(`%c${RECEIPT}`, 'font: 12px/15px ui-monospace, Menlo, monospace; color: #1f9a6a;');
    console.log(`%cStaged is free and open. Poke around: %c${GH}`, 'font: 500 12px ui-sans-serif, system-ui; color: #3d3c38;', 'font: 500 12px ui-sans-serif, system-ui; color: #1f9a6a; text-decoration: underline;');
  }, []);
  return null;
}
