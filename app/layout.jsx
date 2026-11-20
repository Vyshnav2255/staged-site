import localFont from 'next/font/local';
import './globals.css';
import './delight.css';
import './receipt.css';
import { asset } from '@/lib/site';

const akt = localFont({ src: './Akt-Variable.woff2', weight: '100 900', variable: '--font-akt', display: 'swap' });
const mono = localFont({ src: './GeistMono-Variable.woff2', weight: '100 900', variable: '--font-mono', display: 'swap' });

export const metadata = {
  title: 'Staged · Commit your work. Properly.',
  description: 'Staged sorts your uncommitted changes into clean commits and writes the messages. Add them to the cart, hold to push, get a receipt. Free, local, no AI, no account.',
  openGraph: {
    title: 'Staged · Commit your work. Properly.',
    description: 'Sorts your uncommitted changes into clean commits and writes the messages. Free, local, no AI, no account.',
  },
  icons: { icon: asset('/img/favicon.svg'), apple: asset('/img/apple-touch-icon.png') },
};

export const viewport = { colorScheme: 'light', themeColor: '#f3f2ee' };

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${akt.variable} ${mono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
