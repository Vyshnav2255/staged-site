'use client';
import { useEffect, useState } from 'react';
import { Receipt } from './receipt';
import { asset } from '@/lib/site';
import { todayShort } from './delight/util';

// The 404 page: the printer jammed on a path that does not exist.
export default function NotFoundReceipt() {
  const [path, setPath] = useState('/missing');
  const [when, setWhen] = useState('');
  const [day, setDay] = useState('');
  useEffect(() => {
    const p = location.pathname.replace(/\/$/, '') || '/';
    setPath(p.length > 26 ? `${p.slice(0, 25)}…` : p);
    const d = new Date();
    setWhen(`${d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })} · ${d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}`);
    setDay(todayShort());
  }, []);
  return (
    <main className="nf">
      <Receipt
        tone="jam" label="Page not found · No. 0404" size={76}
        meta={[['Repo', 'staged.site'], ['Date', when || '…'], ['Branch', 'main → nowhere']]}
        items={[{ l: `$ git checkout ${path}`, sl: '01 · 0000404 · 0 files', sr: '+0 −0' }]}
        totals={[['Files', '0'], ['Total lines', '+0 −0', true]]}
        note={<>Nothing here. <a className="jam-go" href={asset('/')}>Back to the start.</a></>}
        stamp={['Missing', day || '404']}
      />
    </main>
  );
}
