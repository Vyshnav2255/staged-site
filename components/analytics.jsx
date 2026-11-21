'use client';
import { useEffect } from 'react';
import { track } from '@/lib/track';

// Page-wide event tracking for Umami. Listens instead of wiring every component:
// clicks on key links and buttons, easter eggs, the coffee add-on, and how far people scroll by section.
const where = (el) => (el.closest('header') ? 'nav' : el.closest('footer') ? 'footer' : el.closest('#try') ? 'try' : el.closest('.hero') ? 'hero' : 'page');

export default function Analytics() {
  useEffect(() => {
    const onClick = (e) => {
      const el = e.target.closest?.('a, button');
      if (!el) return;
      const href = el.getAttribute('href') || '';
      if (el.matches('.copy')) return track('copy-command');
      if (el.matches('.demo-full')) return track('video-fullscreen');
      if (el.matches('.demo-ctl')) return track('video-toggle');
      if (href === '#get') return track('get-staged', { where: where(el) });
      if (/buymeacoffee\.com/.test(href)) return track('coffee-link', { where: where(el) });
      if (/github\.com/.test(href)) return track(/releases/.test(href) ? 'changelog-link' : 'github-link', { where: where(el) });
      if (/x\.com|twitter\.com/.test(href)) return track('x-link', { where: where(el) });
    };
    const onEgg = (e) => track('easter-egg', { egg: String(e.detail) });
    const onCoffee = (e) => track('coffee-addon', { on: !!e.detail });
    document.addEventListener('click', onClick, { capture: true });
    addEventListener('staged:egg', onEgg);
    addEventListener('staged:coffee', onCoffee);

    // Scroll depth: each section counts once per visit.
    const seen = new Set();
    const io = new IntersectionObserver((entries) => entries.forEach((en) => {
      const id = en.target.id;
      if (en.isIntersecting && !seen.has(id)) { seen.add(id); track('section-view', { section: id }); io.unobserve(en.target); }
    }), { threshold: 0.35 });
    document.querySelectorAll('main section[id]').forEach((s) => io.observe(s));

    return () => {
      document.removeEventListener('click', onClick, { capture: true });
      removeEventListener('staged:egg', onEgg);
      removeEventListener('staged:coffee', onCoffee);
      io.disconnect();
    };
  }, []);
  return null;
}
