// Send a custom event to Umami (loaded in app/layout.jsx). Safe to call before the script loads or when it's blocked.
export function track(name, data) {
  try { if (typeof window !== 'undefined' && window.umami?.track) window.umami.track(name, data); } catch {}
}
