import { useEffect, useRef, useState } from 'react'
import { useApply } from './ui/ApplyModal'
import { BrandMark } from './ui/BrandMark'

/**
 * Header and menu, modelled on cyphercapital.com (Jack's pick, Oct 23 2026).
 *
 * The bar is just type on the page: the mark and "BlackWater" top left, "Menu"
 * dead centre, and a quiet "Apply now" on the right. Cypher's bar has nothing
 * on the right; the apply link was kept so the one action that matters is
 * never more than a click away.
 *
 * "Menu" drops a light panel down from the top, centred: big page links on
 * hairline rules, the service pages beneath in small type, and two contact
 * rows with arrows. Its own "Close" sits exactly where "Menu" was.
 *
 * The bar has no background, so its ink follows whatever is painted behind
 * it: white over the dark hero, near-black over the white sections.
 */

const PRIMARY = [
  { label: 'The Method', href: '/the-method/' },
  { label: 'Services', href: '/services/' },
  { label: 'Results', href: '/results/' },
  { label: 'About', href: '/about/' },
  { label: 'Contact', href: '/contact/' },
]
const SECONDARY = [
  { label: 'Paid Ads', href: '/services/paid-ads/' },
  { label: 'Meta Ads', href: '/services/meta-ads/' },
  { label: 'Creative Strategy', href: '/services/creative-strategy/' },
  { label: 'Funnels', href: '/services/funnels/' },
  { label: 'Email & SMS', href: '/services/email-sms/' },
  { label: 'Landing Pages', href: '/services/landing-pages/' },
]

/* Drawn arrow. The ↗ character it replaces is rendered as an emoji on
   iPhones, which read as decoration rather than "this goes somewhere". */
function Arrow({ diagonal = false }) {
  return (
    <svg className="mnu-arrow" viewBox="0 0 16 16" width="16" height="16" aria-hidden="true"
         fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      {diagonal
        ? <><path d="M5 11 11 5" /><path d="M6 5h5v5" /></>
        : <><path d="M3 8h10" /><path d="M9 4l4 4-4 4" /></>}
    </svg>
  )
}

export function Nav() {
  const [open, setOpen] = useState(false)
  const [tone, setTone] = useState('on-dark')
  const { openApply } = useApply()
  const menuBtn = useRef(null)

  // Sample what is actually painted behind the bar, just below it, at both
  // edges, and pick the ink that reads on it.
  useEffect(() => {
    const luminance = (c) => {
      const m = c.match(/[\d.]+/g)
      if (!m) return null
      const [r, g, b, a = 1] = m.map(Number)
      if (a < 0.5) return null                    // transparent: keep looking
      const f = (v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4) }
      return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b)
    }
    const surfaceAt = (x, y) => {
      let n = document.elementFromPoint(x, y)
      while (n && n !== document.documentElement) {
        const l = luminance(getComputedStyle(n).backgroundColor)
        if (l !== null) return l
        n = n.parentElement
      }
      return luminance(getComputedStyle(document.body).backgroundColor) ?? 0
    }
    let raf = 0, confirm = 0, pending = null, current = 'on-dark'
    const sample = () => {
      raf = 0
      // Skip while the preloader's white curtain is up, or the bar would
      // settle on dark ink for a page that opens on the dark hero.
      if (document.documentElement.classList.contains('bw-preloading')) return
      // A section that knows what is behind the bar (the homepage hero while
      // it fills the screen) says so, and the page is not measured at all.
      const locked = document.documentElement.dataset.hdrLock
      if (locked) { pending = null; if (current !== locked) { current = locked; setTone(locked) } return }
      const w = document.documentElement.clientWidth || window.innerWidth
      const l = (surfaceAt(12, 92) + surfaceAt(w / 2, 92) + surfaceAt(w - 12, 92)) / 3
      const next = l > 0.4 ? 'on-light' : 'on-dark'
      if (next === current) { pending = null; return }
      // A pinned section repositions between frames mid-scroll, and for that
      // instant the page behind it can show through. Flip only when a second
      // look a moment later agrees, so the bar never blinks to the wrong ink.
      if (pending === next) { pending = null; current = next; setTone(next); return }
      pending = next
      clearTimeout(confirm)
      confirm = setTimeout(() => { if (!raf) raf = requestAnimationFrame(sample) }, 120)
    }
    // Sampling forces the browser to work out layout (elementFromPoint plus
    // computed styles up the tree), so it runs at most every 140ms rather
    // than on every scroll frame. The trailing call still catches where the
    // scroll comes to rest.
    let last = 0, timer = 0
    const queue = () => {
      const wait = 140 - (performance.now() - last)
      if (wait <= 0) { last = performance.now(); if (!raf) raf = requestAnimationFrame(sample) }
      else if (!timer) timer = setTimeout(() => { timer = 0; last = performance.now(); if (!raf) raf = requestAnimationFrame(sample) }, wait)
    }
    sample()
    window.addEventListener('scroll', queue, { passive: true })
    window.addEventListener('resize', queue)
    // Re-sample when the preloader finishes and the page underneath shows.
    const mo = new MutationObserver(queue)
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ['class', 'data-hdr-lock'] })
    return () => {
      if (raf) cancelAnimationFrame(raf)
      clearTimeout(timer)
      clearTimeout(confirm)
      mo.disconnect()
      window.removeEventListener('scroll', queue)
      window.removeEventListener('resize', queue)
    }
  }, [])

  // Freeze the page behind the open menu, close it on Escape.
  useEffect(() => {
    if (!open) return
    window.__lenis && window.__lenis.stop()
    const onKey = (e) => { if (e.key === 'Escape') setOpen(false) }
    window.addEventListener('keydown', onKey)
    return () => {
      window.__lenis && window.__lenis.start()
      window.removeEventListener('keydown', onKey)
      menuBtn.current && menuBtn.current.focus({ preventScroll: true })
    }
  }, [open])

  const apply = () => { setOpen(false); openApply() }

  return (
    <>
      <style>{`
        /* Header after the Sonder House reference (Oct 24 2026): mark on the
           left, the page links in small type beside it, and a white pill
           with a round icon button on the right. Phones fold the links into
           the MENU panel below. */
        .hdr { position:fixed; top:0; left:0; right:0; z-index:100; pointer-events:none;
               height:clamp(64px,6vw,84px); padding:0 clamp(1rem,2.6vw,2rem);
               display:flex; align-items:center; gap:1rem;
               font-family:'Inter',system-ui,sans-serif; font-size:.8rem; font-weight:400; letter-spacing:-.01em;
               color:#fff; transition:color .35s ease; }
        .hdr[data-tone='on-light'] { color:#141414; }
        .hdr a, .hdr button { pointer-events:auto; color:inherit; text-decoration:none; background:none;
               border:0; padding:.35rem 0; font:inherit; letter-spacing:inherit; cursor:pointer; }
        .hdr-brand { display:inline-flex; align-items:center; }
        .hdr-mark { width:26px; }
        .hdr-links { display:flex; gap:clamp(1rem,1.9vw,1.75rem); margin-left:clamp(3rem,12vw,12rem); list-style:none; padding:0; }
        .hdr-links a { opacity:.86; transition:opacity .2s ease; }
        .hdr-links a:hover { opacity:1; }
        .hdr-spacer { flex:1; }
        .hdr .hdr-pill { display:inline-flex; align-items:center; gap:.75rem; padding:4px 4px 4px 1rem;
               border-radius:999px; background:#fff; color:#0b0b0b; font-size:.75rem; font-weight:500;
               transition:background .3s ease, color .3s ease; }
        .hdr-pill i { display:grid; place-items:center; width:30px; height:30px; border-radius:50%;
               background:#0b0b0b; color:#fff; transition:transform .3s cubic-bezier(.22,1,.36,1); }
        .hdr .hdr-pill:hover i { transform:rotate(45deg); }
        .hdr[data-tone='on-light'] .hdr-pill { background:#0b0b0b; color:#fff; }
        .hdr[data-tone='on-light'] .hdr-pill i { background:#fff; color:#0b0b0b; }
        .hdr-menu { display:none; text-transform:uppercase; letter-spacing:.06em; font-size:.85rem; font-weight:500; }
        .hdr a:focus-visible, .hdr button:focus-visible { outline:1px solid currentColor; outline-offset:4px; }
        /* The flying preloader mark lands here, so the real one waits for it. */
        html.bw-preloading .hdr-mark, html.bw-preloading .hdr-links,
        html.bw-preloading .hdr-menu, html.bw-preloading .hdr-pill { opacity:0; }
        .hdr-links, .hdr-menu, .hdr-pill { transition:opacity .5s ease .15s; }

        .mnu-scrim { position:fixed; inset:0; z-index:110; background:rgba(0,0,0,.18);
                     opacity:0; pointer-events:none; transition:opacity .5s cubic-bezier(.3,0,0,1); }
        .mnu-scrim.is-open { opacity:1; pointer-events:auto; }
        .mnu { position:fixed; top:0; left:50%; z-index:120; width:min(42.5vw, 640px); min-width:420px;
               max-height:100svh; overflow-y:auto; background:#fafafa; color:#181818;
               transform:translate(-50%, -101%); transition:transform .5s cubic-bezier(.3,0,0,1);
               padding:0 1rem 1.5rem; font-family:'Space Grotesk',sans-serif; font-weight:500; letter-spacing:-.02em; }
        .mnu.is-open { transform:translate(-50%, 0); }
        .mnu-close { display:block; margin:0 auto; height:clamp(64px,6.2vw,88px); background:none; border:0;
                     font:inherit; font-size:1rem; color:inherit; cursor:pointer; }
        .mnu ul { list-style:none; margin:0; padding:0; }
        .mnu-primary { border-top:1px solid rgba(24,24,24,.12); }
        .mnu-primary li { border-bottom:1px solid rgba(24,24,24,.12); }
        .mnu-primary a { display:block; padding:.7rem 0; font-size:clamp(1.6rem,2.3vw,2rem); line-height:1.1;
                         color:inherit; text-decoration:none; transition:opacity .25s ease; }
        .mnu .mnu-secondary { margin:clamp(2.5rem,7vh,4.5rem) 0 clamp(2.5rem,7vh,4.5rem); }
        .mnu-secondary a { display:inline-block; padding:.28rem 0; font-size:1rem; color:inherit; text-decoration:none; }
        .mnu-primary a:hover, .mnu-secondary a:hover { opacity:.55; }
        /* Apply is the one action that matters in this panel, so it is a
           solid button rather than another text row. */
        .mnu-apply { display:flex; align-items:center; justify-content:center; gap:.6rem; width:100%;
                     padding:1.05rem 1.25rem; border:0; border-radius:999px; background:#141414; color:#fff;
                     font:inherit; font-size:.82rem; font-weight:600; letter-spacing:.08em; text-transform:uppercase;
                     cursor:pointer; transition:background .25s ease; }
        .mnu-apply:hover { background:#000; }
        .mnu-apply .mnu-arrow { transition:transform .3s cubic-bezier(.22,1,.36,1); }
        .mnu-apply:hover .mnu-arrow { transform:translateX(3px); }
        .mnu-apply:focus-visible { outline:2px solid #141414; outline-offset:3px; }
        .mnu-cta .mnu-row { margin-top:1rem; border-top:1px solid rgba(24,24,24,.12); }
        .mnu-row { display:flex; justify-content:space-between; align-items:center; width:100%;
                   padding:.75rem 0; border:0; border-bottom:1px solid rgba(24,24,24,.12); background:none;
                   font:inherit; color:inherit; text-align:left; text-decoration:none; cursor:pointer; }
        .mnu-row small { display:block; font-size:.75rem; color:rgba(24,24,24,.5); margin-top:.15rem; }
        .mnu-row:hover span:first-child { opacity:.6; }
        .mnu a:focus-visible, .mnu button:focus-visible { outline:1px solid #181818; outline-offset:3px; }
        /* Items rise in one after another as the panel lands. */
        .mnu-item { opacity:0; transform:translateY(10px); transition:opacity .4s ease, transform .5s cubic-bezier(.3,0,0,1); }
        .mnu.is-open .mnu-item { opacity:1; transform:none; }

        /* Tablets and phones: links and pill fold into the MENU panel. */
        @media (max-width:899px) {
          .hdr-links, .hdr .hdr-pill { display:none; }
          .hdr-menu { display:inline-block; }
        }
        @media (max-width:767px) {
          .mnu { width:100vw; min-width:0; }
        }
        @media (prefers-reduced-motion: reduce) {
          .mnu, .mnu-item, .mnu-scrim { transition:none; }
        }
      `}</style>

      <header className="hdr" data-tone={tone}>
        <a href="/" className="hdr-brand" aria-label="BlackWater Marketing, home">
          <BrandMark className="hdr-mark" />
        </a>
        <ul className="hdr-links">
          {PRIMARY.map((l) => <li key={l.href}><a href={l.href}>{l.label}</a></li>)}
        </ul>
        <span className="hdr-spacer" />
        <button type="button" className="hdr-pill" onClick={openApply}>
          Apply now <i><Arrow diagonal /></i>
        </button>
        <button ref={menuBtn} type="button" className="hdr-menu" aria-expanded={open} aria-controls="site-menu"
                onClick={() => setOpen(true)}>
          Menu
        </button>
      </header>

      <div className={`mnu-scrim${open ? ' is-open' : ''}`} onClick={() => setOpen(false)} aria-hidden="true" />
      <nav id="site-menu" className={`mnu${open ? ' is-open' : ''}`} aria-label="Site" inert={!open}>
        <button type="button" className="mnu-close" onClick={() => setOpen(false)}>Close</button>
        <ul className="mnu-primary">
          {PRIMARY.map((l, i) => (
            <li key={l.href} className="mnu-item" style={{ transitionDelay: open ? `${120 + i * 45}ms` : '0ms' }}>
              <a href={l.href}>{l.label}</a>
            </li>
          ))}
        </ul>
        <ul className="mnu-secondary">
          {SECONDARY.map((l, i) => (
            <li key={l.href} className="mnu-item" style={{ transitionDelay: open ? `${340 + i * 30}ms` : '0ms' }}>
              <a href={l.href}>{l.label}</a>
            </li>
          ))}
        </ul>
        <div className="mnu-cta mnu-item" style={{ transitionDelay: open ? '520ms' : '0ms' }}>
          <button type="button" className="mnu-apply" onClick={apply}>
            Apply to work with us <Arrow />
          </button>
          <a className="mnu-row" href="https://www.instagram.com/blackwatermrkting/" target="_blank" rel="noopener noreferrer">
            <span>@blackwatermrkting<small>Follow along on Instagram</small></span>
            <Arrow diagonal />
          </a>
        </div>
      </nav>
    </>
  )
}
