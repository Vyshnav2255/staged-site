// Small shared helpers for the delight pieces.
export const reducedMotion = () => typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches;
export const finePointer = () => typeof matchMedia === 'function' && matchMedia('(hover: hover) and (pointer: fine)').matches;

// Restart a CSS animation that is driven by a class.
export function replay(el, cls) {
  if (!el) return;
  el.classList.remove(cls);
  void el.getBoundingClientRect();
  el.classList.add(cls);
}

// The deliberate target of an event: false when someone is typing in a field.
export const isTyping = (t) => !!t && (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName));

export const todayShort = () => new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
