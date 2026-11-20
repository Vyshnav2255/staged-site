import { getLatestRelease } from '@/lib/release';
import { GH, BMC_URL } from '@/lib/site';
import { ReleaseProvider, ReleaseBadge, Version } from '@/components/release';
import CopyCommand from '@/components/copy-command';
import SoundToggle from '@/components/sound-toggle';
import HoldToPush from '@/components/hold-to-push';
import { PageEffects, DemoVideo } from '@/components/effects';
import Features from '@/components/features';
import { BrandMark, GitHubMark } from '@/components/brand';
import Delight from '@/components/delight';
import FaqList from '@/components/delight/faq-list';
import { Odometer } from '@/components/delight/odometer';
import NavBrand from '@/components/nav-brand';
import { StainDefs } from '@/components/cup-art';

const Kicker = ({ n, children }) => (
  <div className="kicker"><span><Odometer value={n} /></span><i>/</i>{children}</div>
);

// Section head: kicker across, h2 on the left, the right column (lead, controls) beside it.
const Head = ({ n, label, title, children, h2Class }) => (
  <div className="sec-head reveal-group">
    <Kicker n={n}>{label}</Kicker>
    <h2 className={h2Class}>{title}</h2>
    <div className="sec-side">{children}</div>
  </div>
);

// "How it's different": each card opens with a small specimen that answers its claim.
const DIFFERENT = [
  { label: 'local', h: 'Local, no AI', p: 'No account, no server of ours and no model. Staged reads your repos in place and works out the commits on its own, instantly. It only checks GitHub for new releases, and never sends your code.',
    spec: (
      <div className="spec spec-local mono">
        <div className="sl-row"><i />code sent<b>none</b></div>
        <div className="sl-row"><i />model<b>none</b></div>
        <div className="sl-row"><i />account<b>none</b></div>
        <span className="sl-chip"><i />on your computer</span>
      </div>
    ) },
  { label: 'you decide', h: 'It only suggests', p: 'Nothing is committed until you add it to the cart, and nothing is pushed until you hold the button. You can change any group or message first.',
    spec: (
      <div className="spec spec-suggest">
        <div className="ss-row">
          <span className="ss-msg mono">feat(printer): add a label printer</span>
          <span className="ss-ctl">
            <span className="ss-btn">Edit</span>
            <span className="ss-btn ss-add">Add to cart</span>
          </span>
          <svg className="ss-ptr" viewBox="0 0 24 24" width="16" height="16" aria-hidden="true"><path d="M5 3L19 12L12.5 13.5L9.5 20L5 3Z" fill="#fff" stroke="var(--ink)" strokeWidth="1.5" strokeLinejoin="round" /></svg>
        </div>
      </div>
    ) },
  { label: 'it learns', h: 'Learns from you', p: 'Move a file to another commit and Staged groups it that way next time. Its settings live outside your repos.',
    spec: (
      <div className="spec spec-learn mono">
        <div className="sn-row"><span className="sn-chip">sidebar.css</span><span className="sn-arr">→</span>commit 2</div>
        <div className="sn-rule" />
        <div className="sn-row sn-next"><span className="sn-k">next time</span>grouped with sidebar.js</div>
      </div>
    ) },
];

const FAQ_GROUPS = { basics: 'the basics', privacy: 'privacy', setup: 'setup' };

// Ordered basics, then privacy, then setup. FaqList prints a small label above each group.
const FAQ = [
  { group: 'basics', q: 'Is it free?', a: <>Yes. There is no paid tier, no trial and no account.</> },
  { group: 'basics', q: 'Will it commit or push without asking?', a: <>No. It only suggests. A commit is made when you add it to the cart, and nothing reaches your remote until you hold the push button. The last commit has an Undo.</> },
  { group: 'basics', q: 'What if it groups something wrong?', a: <>Drag a file onto another commit, or onto <em>Drop here for a new commit</em>. Staged remembers the move and groups those files together next time. A file that holds two features is split by chunk, and you can pick chunks yourself.</> },
  { group: 'basics', q: 'Can I choose the message style?', a: <>Yes, per project. Auto follows the style your repo already uses. You can also pick Gitmoji, Conventional Commits, or both, from the gear next to the repo name.</> },
  { group: 'basics', q: 'Will it rewrite my history?', a: <>No. It makes normal commits and a normal push, and it never force-pushes.</> },
  { group: 'basics', q: 'What’s the receipt?', a: <>After every push Staged prints a small receipt of what went out: the commits, files and lines, with a QR code to the changes on your remote. Save it as an image if you like sharing your work.</> },
  { group: 'privacy', q: 'Does my code leave my computer?', a: <>No. Staged is a small app that runs on your computer and reads your repos where they are. Grouping and messages come from its own rules, so there is no AI service and no server of ours. It checks GitHub for a new release when it starts, and your code is never part of that. Everything else goes out only when you push, to your own remote.</> },
  { group: 'privacy', q: 'Does it use AI?', a: <>No. Staged reads the diff itself: real imports, names a change adds and uses, which files you usually commit together, the comments you wrote. That is enough to sort a pile of changes and write subjects like <em>feat(printer): add a label printer</em>, instantly and offline.</> },
  { group: 'setup', q: 'What do I need to run it?', a: <>Node 18 or newer and git. <a href="#get">The command above</a> clones the latest release (<Version />) and runs <code>npm start</code>. It opens in your browser at <code>localhost</code> and updates itself when a new release is out.</> },
  { group: 'setup', q: 'Which systems does it run on?', a: <>It is tested on macOS. Staged is a Node and git app, so other systems may work, but they are untested.</> },
  { group: 'setup', q: 'How do I start it again?', a: <>Open a terminal, run <code>cd staged</code>, then <code>npm start</code>. It opens in your browser again.</> },
  { group: 'setup', q: 'Which repos does it show?', a: <>It finds the folder your repos live in, such as <code>~/GitHub</code> or <code>~/Developer</code>, and lists every git repo inside. You can add folders, add single repos, or hide one.</> },
  { group: 'setup', q: 'Does it work with GitLab and others?', a: <>Yes. It works on the git repo on your disk, so the host does not matter. Push goes wherever your remote points.</> },
  { group: 'setup', q: 'How do I remove it?', a: <>Delete the folder you cloned. Its own settings live in <code>~/.config/staged</code>, never in your repos, so delete that too if you want a clean slate.</> },
];

export default async function Page() {
  const release = await getLatestRelease();
  return (
    <ReleaseProvider initial={release}>
      <StainDefs />
      <PageEffects />
      <Delight />
      <header className="nav" id="nav">
        <div className="nav-pill">
          <NavBrand />
          <div className="nav-links">
            <a className="link icon" href={GH} rel="noopener" aria-label="Staged on GitHub" title="GitHub"><GitHubMark /></a>
            <a className="btn" href="#get">Get Staged</a>
          </div>
        </div>
      </header>

      <main id="top">
        <div className="hero wrap">
          <div className="badge-in"><ReleaseBadge /></div>
          <h1>
            <span className="h1-line"><span style={{ '--l': 0 }}>Commit your work.</span></span>
            <span className="h1-line h1-last"><span style={{ '--l': 1 }}><em>Properly.<svg className="scribble" viewBox="0 0 300 20" preserveAspectRatio="none" aria-hidden="true">
              <defs><linearGradient id="scribble-g" x1="0" x2="1" y1="0" y2="0"><stop offset="0" stopColor="#9ccb3f" /><stop offset=".38" stopColor="#3fae5f" /><stop offset=".78" stopColor="#1f9a6a" /><stop offset="1" stopColor="#14724d" /></linearGradient></defs>
              <path className="s1" d="M4 13C70 5 150 3 296 8" pathLength="1" />
              <path className="s2" d="M40 17C120 12 200 11 262 14" pathLength="1" />
            </svg></em></span></span>
          </h1>
          <p className="sub in" style={{ '--i': 4 }}>Staged sorts your uncommitted changes into clean commits and writes the messages. You check them, add them to the cart, and hold to push.</p>
          <div className="cta in" id="get" style={{ '--i': 5 }}>
            <CopyCommand>
              <span>Free, no account</span>
              <span>Opens in your browser</span>
              <span>macOS</span>
              <span>Node 18+</span>
              <a className="hero-gh" href={GH} rel="noopener">GitHub<span aria-hidden="true">→</span></a>
            </CopyCommand>
          </div>
          <div className="demo in" style={{ '--i': 6 }}>
            <div className="window">
              <DemoVideo />
            </div>
          </div>
        </div>

        <section className="wrap" id="what">
          <Head n="01" label="what it does" title="The commits you meant to make." h2Class="w16">
            <p className="lead">You worked on three things at once and now forty files have changed. Staged untangles them, so every commit is one thing with a message that says what it is.</p>
          </Head>
          <Features />
        </section>

        <section className="wrap" id="try">
          <Head n="02" label="try it" title="Go on, hold it.">
            <p className="lead">This is the real button. Let go early and nothing happens. Hold to the end and a receipt prints.</p>
            <SoundToggle />
          </Head>
          <HoldToPush />
        </section>

        <section className="wrap" id="different">
          <Head n="03" label="how it’s different" title={<><span className="h2-s">Most git tools make you sort.</span> <span className="h2-s">Staged sorts, then asks.</span></>}>
          </Head>
          <div className="different reveal-group">
            {DIFFERENT.map((c) => (
              <article className="diff-card" key={c.label}>
                {c.spec}
                <div className="diff-label mono">{c.label}</div>
                <h3>{c.h}</h3>
                <p>{c.p}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="wrap" id="questions">
          <FaqList items={FAQ} groups={FAQ_GROUPS}
            kicker={<Kicker n="04">questions</Kicker>} />
        </section>
      </main>

      <footer>
        <div className="wrap foot-row">
          <div className="foot-left">
            <a className="brand sm" href="#top" aria-label="Staged"><BrandMark />staged</a>
            <span className="foot-facts mono"><Version prefix="" /></span>
          </div>
          <nav aria-label="Footer">
            <a href="#what">Features</a>
            <a href="#try">Try it</a>
            <a href="#questions">FAQ</a>
            <a href={GH} rel="noopener">GitHub</a>
            <a href={`${GH}/releases`} rel="noopener">Changelog</a>
            <a href={BMC_URL} target="_blank" rel="noopener noreferrer">Buy me a coffee</a>
          </nav>
          <span className="foot-by">Made with <svg className="heart" viewBox="0 0 24 24" width="14" height="14" fill="none" aria-label="love" role="img"><path d="M19.46 3.99C16.78 2.35 14.44 3.01 13.03 4.07L12 4.85L10.97 4.07C9.56 3.01 7.22 2.35 4.54 3.99C1.02 6.15.22 13.27 8.34 19.27C9.89 20.42 10.66 20.99 12 20.99C13.34 20.99 14.11 20.42 15.66 19.27C23.78 13.27 22.98 6.15 19.46 3.99Z" fill="currentColor" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg> by <a href="https://x.com/vyshnav_xyz" rel="noopener">Vyshnav</a></span>
        </div>
        <div className="wrap ghost-wrap reveal-self" aria-hidden="true">
          <svg className="ghost-mark" viewBox="0 0 24 24" fill="none">
            <path className="gb b3" d="M18 18H6C5.05719 18 4.58579 18 4.29289 17.7071C4 17.4142 4 16.9428 4 16C4 15.0572 4 14.5858 4.29289 14.2929C4.58579 14 5.05719 14 6 14H18C18.9428 14 19.4142 14 19.7071 14.2929C20 14.5858 20 15.0572 20 16C20 16.9428 20 17.4142 19.7071 17.7071C19.4142 18 18.9428 18 18 18Z" />
            <path className="gb b2" d="M4 10H20" />
            <path className="gb b1" d="M4 6H20" />
          </svg>
          <span className="ghost-word">staged</span>
        </div>
      </footer>
    </ReleaseProvider>
  );
}
