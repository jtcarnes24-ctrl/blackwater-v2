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
    let raf = 0
    const sample = () => {
      raf = 0
      // Skip while the preloader's white curtain is up, or the bar would
      // settle on dark ink for a page that opens on the dark hero.
      if (document.documentElement.classList.contains('bw-preloading')) return
      const w = document.documentElement.clientWidth || window.innerWidth
      const l = (surfaceAt(12, 92) + surfaceAt(w - 12, 92)) / 2
      setTone(l > 0.4 ? 'on-light' : 'on-dark')
    }
    const queue = () => { if (!raf) raf = requestAnimationFrame(sample) }
    sample()
    window.addEventListener('scroll', queue, { passive: true })
    window.addEventListener('resize', queue)
    // Re-sample when the preloader finishes and the page underneath shows.
    const mo = new MutationObserver(queue)
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })
    return () => {
      if (raf) cancelAnimationFrame(raf)
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
        .hdr { position:fixed; top:0; left:0; right:0; z-index:100; pointer-events:none;
               height:clamp(64px,6.2vw,88px); padding:0 clamp(1rem,2.6vw,2rem);
               display:grid; grid-template-columns:1fr auto 1fr; align-items:center;
               font-family:'Space Grotesk',sans-serif; font-size:1rem; font-weight:500; letter-spacing:-.02em;
               color:#fff; transition:color .35s ease; }
        .hdr[data-tone='on-light'] { color:#141414; }
        .hdr a, .hdr button { pointer-events:auto; color:inherit; text-decoration:none; background:none;
               border:0; padding:.35rem 0; font:inherit; letter-spacing:inherit; cursor:pointer; }
        .hdr-brand { justify-self:start; display:inline-flex; align-items:center; gap:.7rem; }
        /* Bar labels in capitals, tracked out slightly so caps don't feel cramped. */
        .hdr-word, .hdr-menu, .hdr-apply { text-transform:uppercase; letter-spacing:.06em; font-size:.9rem; }
        .hdr-mark { width:26px; }
        .hdr-menu { justify-self:center; }
        .hdr-apply { justify-self:end; }
        .hdr a:focus-visible, .hdr button:focus-visible { outline:1px solid currentColor; outline-offset:4px; }
        /* The flying preloader mark lands here, so the real one waits for it. */
        html.bw-preloading .hdr-mark, html.bw-preloading .hdr-word,
        html.bw-preloading .hdr-menu, html.bw-preloading .hdr-apply { opacity:0; }
        .hdr-word, .hdr-menu, .hdr-apply { transition:opacity .5s ease .15s; }

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
        .mnu-rows { border-top:1px solid rgba(24,24,24,.12); }
        .mnu-row { display:flex; justify-content:space-between; align-items:flex-start; width:100%;
                   padding:.75rem 0; border:0; border-bottom:1px solid rgba(24,24,24,.12); background:none;
                   font:inherit; color:inherit; text-align:left; text-decoration:none; cursor:pointer; }
        .mnu-row small { display:block; font-size:.75rem; color:rgba(24,24,24,.5); margin-top:.15rem; }
        .mnu-row:hover span:first-child { opacity:.6; }
        .mnu a:focus-visible, .mnu button:focus-visible { outline:1px solid #181818; outline-offset:3px; }
        /* Items rise in one after another as the panel lands. */
        .mnu-item { opacity:0; transform:translateY(10px); transition:opacity .4s ease, transform .5s cubic-bezier(.3,0,0,1); }
        .mnu.is-open .mnu-item { opacity:1; transform:none; }

        @media (max-width:767px) {
          .hdr { grid-template-columns:1fr auto; }
          .hdr-menu { justify-self:end; }
          .hdr-apply { display:none; }
          .mnu { width:100vw; min-width:0; }
        }
        @media (prefers-reduced-motion: reduce) {
          .mnu, .mnu-item, .mnu-scrim { transition:none; }
        }
      `}</style>

      <header className="hdr" data-tone={tone}>
        <a href="/" className="hdr-brand" aria-label="BlackWater Marketing, home">
          <BrandMark className="hdr-mark" />
          <span className="hdr-word">BlackWater</span>
        </a>
        <button ref={menuBtn} type="button" className="hdr-menu" aria-expanded={open} aria-controls="site-menu"
                onClick={() => setOpen(true)}>
          Menu
        </button>
        <button type="button" className="hdr-apply" onClick={openApply}>Apply now</button>
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
        <div className="mnu-rows mnu-item" style={{ transitionDelay: open ? '520ms' : '0ms' }}>
          <button type="button" className="mnu-row" onClick={apply}>
            <span>Apply to work with us<small>Tell us about your brand</small></span>
            <span aria-hidden="true">↗</span>
          </button>
          <a className="mnu-row" href="https://www.instagram.com/blackwatermrkting/" target="_blank" rel="noopener noreferrer">
            <span>@blackwatermrkting<small>Follow along on Instagram</small></span>
            <span aria-hidden="true">↗</span>
          </a>
        </div>
      </nav>
    </>
  )
}
