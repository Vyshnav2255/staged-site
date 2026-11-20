# staged-site

The landing page for [Staged](https://github.com/Vyshnav2255/staged), built with Next.js (static export).

```sh
npm install
npm run dev     # http://localhost:3000
npm run build   # static site in out/
```

## Latest release

The version badge, the meta line and the copy command all follow the latest GitHub Release of `Vyshnav2255/staged`:

- At build time, `lib/release.js` asks the GitHub API for the latest release.
- In the browser, `components/release.jsx` asks again on load, so a release published after the last deploy shows up without a rebuild.
- If GitHub can't be reached, it falls back to `FALLBACK_RELEASE` in `lib/site.js`.

The copy command is `git clone --branch <latest tag> …`, with full history so the app's own updater can move forward to later releases.

## Deploy

- **Vercel**: import the repo, no settings needed.
- **GitHub Pages**: move `deploy/pages.yml` to `.github/workflows/pages.yml`, then set Settings → Pages → Source to GitHub Actions. It builds with `NEXT_PUBLIC_BASE_PATH=/staged-site`.

## Sounds

`lib/sfx.js` is copied from the app (`public/sfx.js`), so the hold-to-push demo sounds like the real thing. Sounds only play after a click and can be turned off from the nav.
