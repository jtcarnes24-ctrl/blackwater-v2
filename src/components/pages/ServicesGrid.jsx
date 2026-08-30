import { useEffect, useRef } from 'react'
import { LiquidButton } from '../ui/LiquidButton'
import { useApply } from '../ui/ApplyModal'

/**
 * Services grid.
 *
 * Layout follows the reference Jack supplied: a header with an oversized
 * caps heading and a serif-italic second line, supporting copy left and a
 * pill CTA right, then a bordered 3x2 grid. Each cell carries a swatch and
 * category label, a two-line uppercase heading, and a short
 * paragraph.
 */
const SERVICES = [
  {
    label: 'Paid Ads', href: '/services/paid-ads/',
    h1: 'Turn Attention Into', h2: 'Paying Customers.',
    p: 'Meta, TikTok and Google campaigns built, managed and scaled. Structure first, creative second, and scaling only once cost per result earns it.',
  },
  {
    label: 'Funnel Creation & Optimization', href: '/services/funnels/',
    h1: 'A Path From Click', h2: 'To Customer.',
    p: 'The steps between the ad and the purchase, designed deliberately rather than assembled by accident. Most brands lose more money here than in the ad account.',
  },
  {
    label: 'Ad Creative Generation', href: '/services/creative-strategy/',
    h1: 'Creative Is The', h2: 'Targeting Now.',
    p: 'Angles, hooks, scripts and concepts. Broad targeting plus a strong signal beats interest stacks, which makes the ad itself the thing deciding who sees it.',
  },
  {
    label: 'Email & SMS Marketing', href: '/services/email-sms/',
    h1: 'Own The Audience', h2: 'You Already Paid For.',
    p: 'Flows and campaigns that earn revenue from people who already know you. The cheapest customer you will ever get is the one you have bought once already.',
  },
  {
    label: 'B2B Marketing', href: '/services/b2b-marketing/',
    h1: 'Reach The Accounts', h2: 'That Actually Buy.',
    p: 'Longer cycles, smaller lists, bigger contracts. B2B rewards precision and patience, not the volume tactics that work for consumer brands.',
  },
  {
    label: 'CRM & Conversion Optimization', href: '/services/crm-cro/',
    h1: 'Fix The Leaks', h2: 'Before You Scale.',
    p: 'Pipeline hygiene, lead routing and conversion rate. Pouring more traffic into a funnel that leaks just makes the leak more expensive.',
  },
  {
    label: 'Web Design & Landing Pages', href: '/services/landing-pages/',
    h1: 'Stop Leaking The', h2: 'Traffic You Buy.',
    p: 'Conversion-focused pages built for paid traffic. Halving cost per acquisition is often a page problem rather than a campaign problem.',
  },
]

export function ServicesGrid({ headingLevel = 'h1' }) {
  const Heading = headingLevel
  const { openApply } = useApply()
  const rootRef = useRef(null)

  useEffect(() => {
    const root = rootRef.current
    if (!root) return
    const cells = [...root.querySelectorAll('[data-reveal]')]

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      cells.forEach((c) => c.setAttribute('data-revealed', 'true'))
      return
    }

    const show = (el, i) => {
      if (el.getAttribute('data-revealed') === 'true') return
      el.style.transitionDelay = `${(i % 3) * 80}ms`
      el.setAttribute('data-revealed', 'true')
    }
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return
        show(e.target, cells.indexOf(e.target))
        io.unobserve(e.target)
      })
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0 })
    cells.forEach((c) => io.observe(c))

    // Anything already in view or scrolled past reveals immediately.
    const sweep = () => cells.forEach((c, i) => {
      const r = c.getBoundingClientRect()
      if (r.top < window.innerHeight && r.bottom > -1) { show(c, i); io.unobserve(c) }
    })
    sweep()
    window.addEventListener('scroll', sweep, { passive: true })

    return () => { io.disconnect(); window.removeEventListener('scroll', sweep) }
  }, [])

  return (
    <section ref={rootRef} id="services" aria-label="What we do" style={{ background: '#080808' }}>
      <style>{`
        .sg-wrap { max-width:1240px; margin:0 auto; padding: clamp(7rem,12vw,10rem) clamp(1.5rem,5vw,4rem) clamp(6rem,10vw,9rem); }

        .sg-head { display:grid; gap:2rem; margin-bottom:3.5rem; }
        @media (min-width:900px){ .sg-head { grid-template-columns: 1fr auto; align-items:end; } }
        .sg-eyebrow { font-family:'Space Grotesk',sans-serif; font-size:.7rem; font-weight:600;
                      letter-spacing:.3em; text-transform:uppercase; color:rgba(255,255,255,.45); margin:0 0 1.25rem; }
        .sg-h1 { font-family:'Syne',sans-serif; font-weight:800; text-transform:uppercase;
                 font-size:clamp(2.2rem,5.5vw,4rem); line-height:1; letter-spacing:-.03em; color:#fff; margin:0; }
        .sg-h1 .emph { display:block; text-transform:none; }
        .sg-lede { font-family:'Space Grotesk',sans-serif; font-size:clamp(.98rem,1.3vw,1.08rem);
                   line-height:1.65; color:rgba(255,255,255,.62); margin:1.5rem 0 0; max-width:54ch; }

        .sg-grid { display:grid; border:1px solid rgba(255,255,255,.14); }
        @media (min-width:700px){ .sg-grid { grid-template-columns:1fr 1fr; } }
        @media (min-width:1000px){ .sg-grid { grid-template-columns:repeat(3,1fr); } }

        .sg-cell { padding: clamp(1.8rem,3vw,2.6rem);
                   display:flex; flex-direction:column;
                   border-bottom:1px solid rgba(255,255,255,.14);
                   border-right:1px solid rgba(255,255,255,.14);
                   text-decoration:none; display:block; position:relative;
                   transition: background .35s ease;
                   will-change:opacity, transform; }
        .sg-cell:hover { background:rgba(255,255,255,.035); }
        /* A final cell that starts its own row would otherwise sit orphaned
           beside two empty columns. */
        @media (min-width:1000px){
          .sg-cell:last-child:nth-child(3n+1) { grid-column:1 / -1; }
        }
        @media (min-width:700px) and (max-width:999px){
          .sg-cell:last-child:nth-child(2n+1) { grid-column:1 / -1; }
        }

        .sg-label { display:flex; align-items:center; gap:.6rem; margin-bottom:3.25rem; }
        .sg-swatch { width:9px; height:9px; background:#14477f; flex:none; }
        .sg-label span { font-family:'Space Grotesk',sans-serif; font-size:.62rem; font-weight:600;
                         letter-spacing:.22em; text-transform:uppercase; color:rgba(255,255,255,.62); }

        .sg-title { font-family:'Syne',sans-serif; font-weight:700; text-transform:uppercase;
                    font-size:clamp(1rem,1.5vw,1.15rem); line-height:1.25; letter-spacing:-.01em;
                    color:#fff; margin:0 0 .9rem; }
        .sg-title span { display:block; }
        .sg-body { font-family:'Space Grotesk',sans-serif; font-size:.86rem; line-height:1.7;
                   color:rgba(255,255,255,.58); margin:0 0 1.75rem; }
        .sg-more { margin-top:auto; display:inline-flex; align-items:center; gap:.5rem;
                   font-family:'Space Grotesk',sans-serif; font-size:.7rem; font-weight:700;
                   letter-spacing:.18em; text-transform:uppercase; color:#ffffff; }
        .sg-arrow { display:inline-block; transition:transform .3s cubic-bezier(.22,1,.36,1); }
        .sg-cell:hover .sg-arrow, .sg-cell:focus-visible .sg-arrow { transform:translateX(5px); }
        .sg-cell:focus-visible { outline:2px solid #fff; outline-offset:-3px; }

        [data-reveal] { opacity:0; transform:translateY(20px);
                        transition:opacity .7s cubic-bezier(.22,1,.36,1), transform .7s cubic-bezier(.22,1,.36,1); }
        [data-reveal][data-revealed='true'] { opacity:1; transform:translateY(0); }
        @media (prefers-reduced-motion: reduce){ [data-reveal]{ transition:none; } }
      `}</style>

      <div className="sg-wrap">
        <header className="sg-head">
          <div>
            <p className="sg-eyebrow">[ Our Services ]</p>
            <Heading className="sg-h1">
              What We Do
              <span className="emph">relentlessly</span>
            </Heading>
            <p className="sg-lede">
              Platforms change, creative fatigues, costs move. We build the system underneath
              so performance survives all three, and every account runs on the same tested
              framework rather than whatever worked last month.
            </p>
          </div>
          <div>
            <LiquidButton onClick={openApply} variant="solid">Apply Now →</LiquidButton>
          </div>
        </header>

        <div className="sg-grid">
          {SERVICES.map((s) => (
            <a className="sg-cell" href={s.href} key={s.label} data-reveal>
              <div className="sg-label">
                <span className="sg-swatch" aria-hidden="true" />
                <span>{s.label}</span>
              </div>
              <h3 className="sg-title">
                <span>{s.h1}</span>
                <span>{s.h2}</span>
              </h3>
              <p className="sg-body">{s.p}</p>
              <span className="sg-more" aria-hidden="true">
                Read more <span className="sg-arrow">→</span>
              </span>
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}
