export const REPO = 'Vyshnav2255/staged';
export const GH = `https://github.com/${REPO}`;
export const BASE = process.env.NEXT_PUBLIC_BASE_PATH || '';
export const asset = (p) => `${BASE}${p}`;

// Used when GitHub can't be reached at build time or in the browser.
export const FALLBACK_RELEASE = { tag: 'v0.2.0', name: 'v0.2.0', date: null, url: `${GH}/releases` };

export function shapeRelease(r) {
  if (!r || !r.tag_name) return null;
  return { tag: r.tag_name, name: r.name || r.tag_name, date: r.published_at || null, url: r.html_url || `${GH}/releases/tag/${r.tag_name}` };
}

// The install line always clones the latest release tag. Full history is kept
// so the app's own updater can fast-forward to later releases.
export const installCommand = (tag) => `git clone --branch ${tag} ${GH}.git && cd staged && npm start`;

export const BMC_URL = 'https://buymeacoffee.com/vyshnav';
