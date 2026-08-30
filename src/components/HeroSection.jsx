import { useRef, useEffect } from 'react'
import { LiquidButton } from './ui/LiquidButton'
import { useApply } from './ui/ApplyModal'

/* The orb was retired Aug 2026 when the hero became a photograph. */

/* Same client logos as the standalone marquee, rendered small and knocked out
   to white so they sit on the photograph. Widths are the real aspect ratio at
   the 22px display height, so nothing shifts while they load. */
const HERO_LOGOS = [
  { src: '/client-logos/logo-1.png',      w: 29 }, { src: '/client-logos/logo-2.png',     w: 22 },
  { src: '/client-logos/logo-3.png',      w: 22 }, { src: '/client-logos/logo-4.png',     w: 41 },
  { src: '/client-logos/logo-5.png',      w: 31 }, { src: '/client-logos/logo-6.png',     w: 35 },
  { src: '/client-logos/logo-8.png',      w: 17 },
  /* Added Aug 27 2026. Project Vitoria (logo-7) removed at the same time.
     These five shipped as colour marks on 4000px transparent canvases; they
     are trimmed to their own bounding box and exported at 3x the 22px display
     height. The marquee's brightness(0) invert(1) is what makes them white,
     so nothing here needs to be a white asset. */
  { src: '/client-logos/logo-soho.png',   w: 45 }, { src: '/client-logos/logo-noise.png', w: 41 },
  { src: '/client-logos/logo-salt.png',   w: 24 }, { src: '/client-logos/logo-chiaki.png', w: 48 },
  { src: '/client-logos/logo-krypt.png',  w: 59 },
]
const HERO_LOGO_LOOP = [...HERO_LOGOS, ...HERO_LOGOS, ...HERO_LOGOS]

// The photograph is dark, so hero copy stays white even though the rest of
// the site is now white-dominant with dark text.
const HERO_INK = '#ffffff'


export function HeroSection() {
  const { openApply } = useApply()
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    /* Coalesced to one write per frame. Scroll events can fire several times
       between paints, and each of these writes invalidates style on a fixed
       element that sits above everything else. */
    let raf = 0
    const apply = () => {
      raf = 0
      const progress = Math.min(window.scrollY / (window.innerHeight * 0.8), 1)
      el.style.setProperty('--scroll-y', `${progress * -120}px`)
      el.style.setProperty('--scroll-o', `${Math.max(0, 1 - progress * 1.6)}`)
    }
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(apply) }
    apply()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      if (raf) cancelAnimationFrame(raf)
      window.removeEventListener('scroll', onScroll)
    }
  }, [])

  return (
    <section ref={ref} style={{
      position: 'relative', minHeight: '100dvh', display: 'flex',
      flexDirection: 'column', overflow: 'hidden', background: 'var(--ink)',
      contain: 'layout style',
    }}>
      <style>{`
        @keyframes hero-line { from { opacity:0; transform:translateY(30px); } to { opacity:1; transform:translateY(0); } }
        @keyframes hero-bar  { from { opacity:0; transform:scaleX(0); } to { opacity:1; transform:scaleX(1); } }
        @keyframes hero-fade { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }

        .hero-content {
          transform: translateY(var(--scroll-y, 0px));
          opacity: var(--scroll-o, 1);
          will-change: transform, opacity;
        }
        .hero-eyebrow { animation: hero-fade 0.6s ease 0.05s both; }
        .hero-bar     { animation: hero-bar  0.6s cubic-bezier(0.76,0,0.24,1) 0.15s both; transform-origin: center; }
        .hero-h1      { animation: hero-line 0.85s cubic-bezier(0.76,0,0.24,1) 0.25s both; }
        .hero-tagline { animation: hero-fade 0.7s ease 0.4s both; }
        .hero-btns    { animation: hero-fade 0.6s ease 0.65s both; }
        .hero-trust   { animation: hero-fade 0.7s ease 0.55s both; }

        /* Must sit AFTER every animation shorthand above: the shorthand resets
           animation-play-state to running, so declaring the pause earlier had
           no effect and the hero played behind the curtain. */
        /* Held until the intro curtain lifts, or these play behind it and
           the reader never sees the entrance. <html> gets .site-ready from
           the Preloader when it finishes. */
        .hero-eyebrow, .hero-bar, .hero-h1, .hero-tagline, .hero-trust, .hero-btns {
          animation-play-state: paused;
        }
        html.site-ready .hero-eyebrow, html.site-ready .hero-bar,
        html.site-ready .hero-h1, html.site-ready .hero-tagline,
        html.site-ready .hero-trust, html.site-ready .hero-btns {
          animation-play-state: running;
        }

        /* The strip is masked to the copy width rather than the viewport, so
           logos appear and vanish in line with where the text starts and ends
           instead of running to the screen edge. */
        .hero-marquee {
          overflow: hidden; width: 100%;
          -webkit-mask-image: linear-gradient(90deg, transparent 0%, #000 14%, #000 86%, transparent 100%);
                  mask-image: linear-gradient(90deg, transparent 0%, #000 14%, #000 86%, transparent 100%);
        }
        .hero-marquee-track {
          display: flex; align-items: center; gap: 3.25rem;
          width: max-content;
          animation: hero-logo-scroll 42s linear infinite;
          will-change: transform;
        }
        @keyframes hero-logo-scroll {
          from { transform: translate3d(0,0,0); }
          to   { transform: translate3d(-33.333%,0,0); }
        }
        .hero-marquee img {
          height: 22px; width: auto; object-fit: contain;
          /* knock the logos out to flat white */
          filter: brightness(0) invert(1);
          opacity: 0.72;
        }
        @media (prefers-reduced-motion: reduce) {
          .hero-marquee-track { animation: none; }
        }

      `}</style>

      {/* The hero is a single photograph.

          Filenames carry the subject ("wave"), not just a size. The first
          swap reused hero-<size>.jpg for completely different artwork, and
          Cloudflare serves assets with max-age=14400 -- so the old picture
          kept being served from cache. Give new artwork a NEW filename. The drone clip that used to sit
          over it was removed Aug 27 2026 at Jack's request; the two encodes
          (7.3MB combined) went with it. */}
      <img
        src="/hero/hero-wave-1920.jpg"
        srcSet="/hero/hero-wave-860.jpg 860w, /hero/hero-wave-1280.jpg 1280w, /hero/hero-wave-1920.jpg 1920w, /hero/hero-wave-2560.jpg 2560w"
        sizes="100vw"
        width="1920" height="1280"
        alt="" aria-hidden="true" fetchPriority="high" decoding="async"
        style={{
          position: 'absolute', inset: 0, zIndex: 0,
          width: '100%', height: '100%',
          objectFit: 'cover', objectPosition: 'center 45%',
        }}
      />

      {/* Scrim. Heavier than the previous hero needed: this frame is mostly
          bright whitewater, and the headline is white with no text-shadow
          behind it (those were removed Aug 26), so the scrim is the only thing
          separating the two. Tuned against this frame specifically: heavier
          and the whitewater crushes to flat black, lighter and the headline
          sits on foam. Re-tune if the photograph changes. The sky sits pale behind the headline, so the copy needs its
          own floor rather than relying on text-shadow alone. */}
      <div aria-hidden="true" style={{
        position: 'absolute', inset: 0, zIndex: 1, pointerEvents: 'none',
        background:
          'linear-gradient(180deg, rgba(20,20,20,0.50) 0%, rgba(20,20,20,0.38) 32%, rgba(20,20,20,0.42) 62%, rgba(20,20,20,0.66) 100%)',
      }} />

      {/* Hero content */}
      <div className="hero-content" style={{
        position: 'relative', zIndex: 10,
        padding: 'clamp(7rem, 12vw, 9rem) clamp(1.5rem, 5vw, 4rem) clamp(3rem, 6vw, 5rem)',
        flex: 1, display: 'flex', alignItems: 'center',
        justifyContent: 'center', flexDirection: 'column',
        textAlign: 'center',
        pointerEvents: 'none',
      }}>
        <div style={{ textAlign: 'center', maxWidth: '900px', width: '100%' }}>
          <p className="hero-eyebrow" style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: '0.72rem', letterSpacing: '0.2em',
            textTransform: 'uppercase', color: 'rgba(255,255,255,0.82)',
            fontWeight: 600, marginBottom: '1rem',
          }}>
            Full-Stack E-Commerce Partner
          </p>
          <div className="hero-bar" style={{
            width: '28px', height: '2px', background: 'rgba(255,255,255,0.75)',
            marginBottom: '1.25rem', marginLeft: 'auto', marginRight: 'auto',
          }} />
          <div style={{ overflow: 'hidden', marginBottom: '2.5rem' }}>
            <h1 className="hero-h1" style={{
              fontFamily: "'Syne', sans-serif",
              fontSize: 'clamp(2.6rem, 7vw, 6.5rem)',
              fontWeight: 700, lineHeight: 0.92,
              letterSpacing: '-0.03em', color: HERO_INK,
              textTransform: 'uppercase', margin: 0,
            }}>
              BLACKWATER<br />MARKETING
            </h1>
          </div>
          <p className="hero-tagline" style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: 'clamp(1rem, 1.8vw, 1.35rem)',
            fontWeight: 500, color: HERO_INK,
            lineHeight: 1.5, maxWidth: '54ch',
            margin: '0 auto 2.75rem',
          }}>
            We scale e-commerce brands the way they should be scaled. With data behind
            every decision and nothing left to guesswork.
          </p>
          <div className="hero-trust" style={{ marginBottom: '2.5rem', pointerEvents: 'none' }}>
            <p style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: '0.62rem', letterSpacing: '0.22em', textTransform: 'uppercase',
              color: 'rgba(255,255,255,0.62)', fontWeight: 600, marginBottom: '1.1rem',
            }}>
              Trusted by
            </p>
            <div className="hero-marquee">
              <div className="hero-marquee-track">
                {HERO_LOGO_LOOP.map((logo, i) => (
                  <img key={i} src={logo.src} alt="" aria-hidden="true"
                       width={logo.w} height={22} decoding="async" />
                ))}
              </div>
            </div>
          </div>

          <div className="hero-btns" style={{
            display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center',
            pointerEvents: 'auto',
          }}>
            <LiquidButton onClick={openApply} variant="solid">
              Apply Now →
            </LiquidButton>
            <LiquidButton href="#services" style={{ background: 'rgba(20,20,20,0.35)' }}>
              Our Services
            </LiquidButton>
          </div>
        </div>
      </div>
    </section>
  )
}
