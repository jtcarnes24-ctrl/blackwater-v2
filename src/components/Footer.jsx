/**
 * Crawlable internal linking.
 *
 * The nav's links live inside an AnimatePresence overlay that is only mounted
 * while the menu is open, so a crawler parsing the page finds none of them.
 * Without this footer every page except the homepage would be orphaned and
 * discoverable only through the sitemap. Plain <a> tags, always in the DOM.
 */
const GROUPS = [
  {
    heading: 'Services',
    links: [
      { label: 'All Services', href: '/services/' },
      { label: 'Paid Ads', href: '/services/paid-ads/' },
      { label: 'Funnel Creation', href: '/services/funnels/' },
      { label: 'Ad Creative', href: '/services/creative-strategy/' },
      { label: 'Email & SMS', href: '/services/email-sms/' },
      { label: 'B2B Marketing', href: '/services/b2b-marketing/' },
      { label: 'CRM & Conversion', href: '/services/crm-cro/' },
      { label: 'Web Design & Landing Pages', href: '/services/landing-pages/' },
    ],
  },
  {
    heading: 'Agency',
    links: [
      { label: 'Home', href: '/' },
      { label: 'The Method', href: '/the-method/' },
      { label: 'About Us', href: '/about/' },
      { label: 'Results', href: '/results/' },
      { label: 'Contact', href: '/contact/' },
    ],
  },
]

export function Footer() {
  return (
    <footer style={{ background: '#080808', color: '#fff', padding: 'clamp(3rem,6vw,5rem) clamp(1.5rem,5vw,4rem) 2.5rem' }}>
      <style>{`
        .ft-grid { max-width:1240px; margin:0 auto; display:flex; flex-wrap:wrap; gap:clamp(2rem,6vw,5rem); }
        .ft-col h3 { font-family:'Space Grotesk',sans-serif; font-size:.7rem; letter-spacing:.2em; text-transform:uppercase; color:rgba(255,255,255,.5); font-weight:600; margin:0 0 1rem; }
        .ft-col a { display:block; font-family:'Space Grotesk',sans-serif; font-size:.95rem; color:rgba(255,255,255,.82); text-decoration:none; margin-bottom:.6rem; transition:color .2s; }
        .ft-col a:hover { color:#fff; }
        .ft-base { max-width:1240px; margin:clamp(2.5rem,5vw,3.5rem) auto 0; padding-top:1.5rem; border-top:1px solid rgba(255,255,255,.12);
                   display:flex; flex-wrap:wrap; gap:1rem; justify-content:space-between; align-items:center;
                   font-family:'Space Grotesk',sans-serif; font-size:.8rem; color:rgba(255,255,255,.55); }
        .ft-base a { color:rgba(255,255,255,.55); text-decoration:none; }
        .ft-base a:hover { color:#fff; }
      `}</style>

      <div className="ft-grid">
        {GROUPS.map((g) => (
          <nav className="ft-col" key={g.heading} aria-label={g.heading}>
            <h3>{g.heading}</h3>
            {g.links.map((l) => (
              <a key={l.href} href={l.href}>{l.label}</a>
            ))}
          </nav>
        ))}
      </div>

      <div className="ft-base">
        <span>© 2026 BlackWater Marketing</span>
        <span style={{ display: 'flex', gap: '1.25rem' }}>
          <a href="/privacy.html">Privacy</a>
          <a href="https://www.instagram.com/blackwatermrkting/" target="_blank" rel="noopener noreferrer">Instagram</a>
        </span>
      </div>
    </footer>
  )
}
