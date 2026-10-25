import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

/* The About page's statement rows: a big Syne heading on the left, plain
   paragraphs on the right, each row rising and fading in on its own scroll
   scrub. Shared by /about/ and /the-method/ so the two pages read as one
   site (Jack, Oct 24 2026).

   beats: [{ kicker?, h, p }] where p is a string or an array of paragraphs. */
export function StatementBeats({ beats }) {
  const rootRef = useRef(null)

  useEffect(() => {
    const root = rootRef.current
    if (!root) return
    const rows = root.querySelectorAll('.sb-beat')
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      gsap.set(rows, { opacity: 1, y: 0 })
      return
    }
    const ctx = gsap.context(() => {
      rows.forEach((el) => {
        gsap.fromTo(
          el,
          { opacity: 0, y: 60 },
          {
            opacity: 1, y: 0, ease: 'none',
            scrollTrigger: { trigger: el, start: 'top 88%', end: 'top 45%', scrub: 0.6 },
          }
        )
      })
    }, root)
    // A late-loading webfont changes text metrics and leaves every trigger
    // measuring the wrong offsets.
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(() => ScrollTrigger.refresh())
    }
    return () => ctx.revert()
  }, [])

  return (
    <div className="sb" ref={rootRef}>
      <style>{`
        .sb { max-width:1240px; margin:0 auto;
              padding: clamp(2.5rem,5vw,4rem) clamp(1.5rem,5vw,4rem) clamp(5rem,10vw,8rem); }
        .sb-beat { margin:0 0 clamp(4rem,9vw,8rem); will-change:opacity, transform;
                   display:grid; gap:1.5rem; align-items:start; }
        @media (min-width: 900px) {
          .sb-beat { grid-template-columns: 5fr 7fr; gap:clamp(2rem,5vw,4.5rem); }
        }
        .sb-beat:last-child { margin-bottom:0; }
        .sb-kicker { font-family:'Space Grotesk',sans-serif; font-size:.7rem; font-weight:600;
                     letter-spacing:.3em; text-transform:uppercase; color:rgba(255,255,255,.6); margin:0 0 1rem; }
        .sb-beat h2 { font-family:'Syne',sans-serif; font-weight:800; text-transform:uppercase;
                      font-size:clamp(1.7rem,3.6vw,3rem); line-height:1.06; letter-spacing:-.025em;
                      color:#ffffff; margin:0; max-width:14ch; }
        .sb-beat p.sb-p { font-family:'Space Grotesk',sans-serif; font-size:clamp(1.02rem,1.4vw,1.18rem);
                          line-height:1.72; color:rgba(255,255,255,.66); margin:0; max-width:56ch; }
        .sb-beat p.sb-p + p.sb-p { margin-top:1.25rem; }
      `}</style>
      {beats.map((b) => (
        <div className="sb-beat" key={b.h}>
          <div>
            {b.kicker && <p className="sb-kicker">{b.kicker}</p>}
            <h2>{b.h}</h2>
          </div>
          <div>
            {(Array.isArray(b.p) ? b.p : [b.p]).map((t) => <p className="sb-p" key={t}>{t}</p>)}
          </div>
        </div>
      ))}
    </div>
  )
}
