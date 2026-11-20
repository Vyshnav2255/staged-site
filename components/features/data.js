// The one demo push every drawing shows: the same three commits, in the same
// order and with the same numbers as the try-it cart (components/hold-to-push.jsx).
export const COMMITS = [
  { scope: 'feat(printer)', subject: 'feat(printer): add a label printer', files: ['printer.js', 'printer.css', 'label.js'], add: 186, del: 4 },
  { scope: 'docs(guide)', subject: 'docs(guide): explain hold to push', files: ['guide.md', 'README.md'], add: 41, del: 12 },
  { scope: 'fix(sidebar)', subject: 'fix(sidebar): keep it fixed while you scroll', files: ['sidebar.css', 'sidebar.js'], add: 19, del: 5 },
];
export const TOTAL = COMMITS.reduce((t, c) => ({ add: t.add + c.add, del: t.del + c.del }), { add: 0, del: 0 });
// The hold, in seconds, as the real button has it.
export const HOLD_S = 1.4;
