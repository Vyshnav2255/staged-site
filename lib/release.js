import { REPO, FALLBACK_RELEASE, shapeRelease } from './site';

// Runs at build time (static export). The browser checks again on load,
// so a release published after the last deploy still shows up.
export async function getLatestRelease() {
  try {
    const headers = { Accept: 'application/vnd.github+json' };
    if (process.env.GITHUB_TOKEN) headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
    const res = await fetch(`https://api.github.com/repos/${REPO}/releases/latest`, { headers, signal: AbortSignal.timeout(5000) });
    if (!res.ok) return FALLBACK_RELEASE;
    return shapeRelease(await res.json()) || FALLBACK_RELEASE;
  } catch {
    return FALLBACK_RELEASE;
  }
}
