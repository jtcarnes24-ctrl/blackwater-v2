import { useEffect, useRef, useState } from 'react'
import { LiquidButton } from './ui/LiquidButton'
import { useApply } from './ui/ApplyModal'

/**
 * Results, built on the ESR marques pattern.
 *
 * A tall section with a pinned stage inside it. The metrics stack as one
 * column of oversized type: the active line sits at full strength, the rest
 * drop to a tenth of it, and the dashboard for that metric cross-fades in on
 * the right. Scroll position through the section picks the index, so the
 * whole thing is driven by one number.
 *
 * Replaced a 15-card horizontal marquee that showed every result at once and
 * gave none of them a moment.
 */

const RESULTS = [
  { metric: '12.97x ROAS',  detail: '$88,913 from $6,857 spend',   img: '/results/result-8.webp' },
  { metric: '12.56x ROAS',  detail: '$20,663 from $1,644 spend',   img: '/results/result-9.webp' },
  { metric: '7.38x ROAS',   detail: '$5.63 CPA · 15.94% hook rate', img: '/results/result-7.webp' },
  { metric: '$8,236/day',   detail: '193 orders · 578% jump',      img: '/results/result-1.webp' },
  { metric: '$7,659/day',   detail: '159 orders · 3.04% CVR',      img: '/results/result-2.webp' },
  { metric: '$51K month',   detail: '$51,290 · sessions up 77%',   img: '/results/result-3.webp' },
  { metric: '$5,440/day',   detail: '58% above prior period',      img: '/results/result-5.webp' },
]

export function ProofSection() {
  const { openApply } = useApply()
  const sectionRef = useRef(null)
  const [active, setActive] = useState(0)

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    /* One listener, coalesced to a frame. The index is derived from how far
       through the section's scrollable run we are, so nothing animates on a
       timer and scrubbing backwards works for free. */
    let raf = 0
    const apply = () => {
      raf = 0
      const r = section.getBoundingClientRect()
      const run = r.height - window.innerHeight
      if (run <= 0) return
      const p = Math.min(Math.max(-r.top / run, 0), 1)
      /* Nudged off the exact boundary so the last metric holds the stage for
         its full share rather than flicking past at the very end. */
      const i = Math.min(RESULTS.length - 1, Math.floor(p * RESULTS.length * 0.999))
      setActive((prev) => (prev === i ? prev : i))
    }
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(apply) }

    apply()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])

  return (
    <section ref={sectionRef} className="pf" aria-label="Client results">
      <style>{`
        /* Measured off the reference at 1440: the list is 92px on a 0.95
           line-height at weight 500, tracking -0.01em, and the image is a
           216px square at column nine, top-aligned with the first line
           rather than centred against the block. That is 6.4vw and 15vw,
           so both scale with the viewport the way theirs do. */
        .pf { background:#080808; color:#fff; position:relative;
              height:${(RESULTS.length + 1) * 70}svh; }
        .pf-stage { position:sticky; top:0; height:100svh; display:flex; flex-direction:column;
                    justify-content:center; padding:0 clamp(1.25rem,2.2vw,2rem); overflow:hidden; }

        .pf-head { display:grid; grid-template-columns:repeat(12,1fr); gap:clamp(1rem,1.6vw,1.5rem);
                   margin-bottom:clamp(2rem,5vw,4.5rem); align-items:baseline; }
        .pf-eyebrow { grid-column:1 / span 6; font-family:'Space Grotesk',sans-serif; font-size:.68rem;
                      font-weight:600; letter-spacing:.22em; text-transform:uppercase;
                      color:rgba(255,255,255,.5); margin:0; }
        .pf-count { grid-column:9 / span 4; justify-self:end; font-family:'Space Grotesk',sans-serif;
                    font-size:.68rem; font-weight:600; letter-spacing:.18em;
                    color:rgba(255,255,255,.5); margin:0; font-variant-numeric:tabular-nums; }

        .pf-body { display:grid; grid-template-columns:repeat(12,1fr); gap:clamp(1rem,1.6vw,1.5rem);
                   align-items:start; }

        .pf-list { grid-column:1 / span 6; display:flex; flex-direction:column; align-items:flex-start;
                   margin:0; padding:0; list-style:none; min-width:0; }
        .pf-item { font-family:'Inter',system-ui,sans-serif; font-weight:500; letter-spacing:-.01em;
                   font-size:clamp(1.35rem,6.4vw,5.75rem); line-height:.95; text-transform:uppercase;
                   color:#ffffff; white-space:nowrap; cursor:pointer; background:none; border:none;
                   padding:0; text-align:left; opacity:.22;
                   transition:opacity .1s cubic-bezier(.19,1,.22,1); }
        /* The reference drops inactive lines to 0.1, but that is against
           white. On black the same value is all but invisible. */
        .pf-item[data-on='true'] { opacity:1; }
        .pf-item:focus-visible { outline:2px solid #fff; outline-offset:3px; opacity:1; }

        .pf-aside { grid-column:9 / span 4; }
        /* Same column, same top edge and the reference's exact 216px height.
           The width follows the screenshots' own 670x350 instead of its
           square: cropping these to a square cut away 48% of each frame,
           and the part it cut was the right-hand columns of the Ads Manager
           table, which is where the ROAS and conversion values live. */
        .pf-frame { position:relative; height:min(15vw,216px); aspect-ratio:670/350;
                    max-width:100%; border-radius:4px; overflow:hidden; background:#101010; }
        .pf-frame img { position:absolute; inset:0; width:100%; height:100%; object-fit:contain;
                        object-position:left center; opacity:0;
                        transition:opacity .1s cubic-bezier(.19,1,.22,1); }
        .pf-frame img[data-on='true'] { opacity:1; }

        .pf-detail { font-family:'Space Grotesk',sans-serif; font-size:.68rem; letter-spacing:.12em;
                     text-transform:uppercase; color:rgba(255,255,255,.5);
                     margin:1rem 0 0; max-width:24ch; }
        .pf-cta { margin-top:clamp(2rem,4vw,3rem); }

        @media (max-width:899px) {
          .pf-eyebrow { grid-column:1 / span 7; }
          .pf-count { grid-column:8 / span 5; }
          .pf-list { grid-column:1 / span 12; }
          .pf-aside { grid-column:1 / span 12; margin-top:clamp(1.5rem,5vw,2.5rem); }
          .pf-frame { height:auto; width:min(86vw,420px); }
        }

        @media (prefers-reduced-motion: reduce) {
          .pf { height:auto; }
          .pf-stage { position:relative; height:auto; padding-block:clamp(4rem,10vw,7rem); }
          .pf-item, .pf-frame img { transition:none; }
          .pf-item { opacity:1; }
        }
      `}</style>

      <div className="pf-stage">
        <div className="pf-head">
          <p className="pf-eyebrow">Client results</p>
          <p className="pf-count">
            {String(active + 1).padStart(2, '0')} / {String(RESULTS.length).padStart(2, '0')}
          </p>
        </div>

        <div className="pf-body">
          <ul className="pf-list">
            {RESULTS.map((r, i) => (
              <li key={r.metric + i}>
                <button
                  type="button"
                  className="pf-item"
                  data-on={i === active}
                  aria-current={i === active}
                  onClick={() => setActive(i)}
                  onFocus={() => setActive(i)}
                >
                  {r.metric}
                </button>
              </li>
            ))}
          </ul>

          <div className="pf-aside">
            <div className="pf-frame">
              {RESULTS.map((r, i) => (
                <img
                  key={r.img + i}
                  src={r.img}
                  alt={`${r.metric}. ${r.detail}`}
                  data-on={i === active}
                  loading={i === 0 ? 'eager' : 'lazy'}
                  width="800" height="500"
                />
              ))}
            </div>
            <p className="pf-detail">{RESULTS[active].detail}</p>
            <div className="pf-cta">
              <LiquidButton onClick={openApply}>Apply Now →</LiquidButton>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
