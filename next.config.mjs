// Static export, so the site can live on GitHub Pages or any static host.
// On Pages under /staged-site, build with NEXT_PUBLIC_BASE_PATH=/staged-site.
const base = process.env.NEXT_PUBLIC_BASE_PATH || '';

/** @type {import('next').NextConfig} */
export default {
  output: 'export',
  basePath: base,
  images: { unoptimized: true },
  trailingSlash: true,
};
