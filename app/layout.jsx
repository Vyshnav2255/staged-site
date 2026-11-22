import localFont from 'next/font/local';
import './globals.css';
import './delight.css';
import './receipt.css';
import { asset } from '@/lib/site';
import Analytics from '@/components/analytics';

const akt = localFont({ src: './Akt-Variable.woff2', weight: '100 900', variable: '--font-akt', display: 'swap' });
const mono = localFont({ src: './GeistMono-Variable.woff2', weight: '100 900', variable: '--font-mono', display: 'swap' });

export const metadata = {
  metadataBase: new URL('https://staged.vyshnav.xyz'),
  title: 'Staged · Commit your work. Properly.',
  description: 'Staged sorts your uncommitted changes into clean commits and writes the messages. Add them to the cart, hold to push, get a receipt. Free, local, no AI, no account.',
  openGraph: {
    title: 'Staged · Commit your work. Properly.',
    description: 'Sorts your uncommitted changes into clean commits and writes the messages. Free, local, no AI, no account.',
    url: '/',
    siteName: 'Staged',
    type: 'website',
    images: [{ url: asset('/img/og.png'), width: 1200, height: 630, alt: 'staged' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Staged · Commit your work. Properly.',
    description: 'Sorts your uncommitted changes into clean commits and writes the messages. Free, local, no AI, no account.',
    images: [asset('/img/og.png')],
  },
  icons: { icon: asset('/img/favicon.svg'), apple: asset('/img/apple-touch-icon.png') },
};

export const viewport = { colorScheme: 'light', themeColor: '#f3f2ee' };

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${akt.variable} ${mono.variable}`}>
      <head>
        <script defer src="https://cloud.umami.is/script.js" data-website-id="b1106dd2-f33f-4ede-bfdd-59fb6b5d8cdc"></script>
      </head>
      <body>{children}<Analytics /></body>
    </html>
  );
}
