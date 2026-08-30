import { Fragment, useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

/**
 * Scroll choreography for the About page, modelled on the reference Jack
 * supplied.
 *
 * Three effects, all scrubbed against scroll position rather than played on
 * a timer, which is what makes the page feel driven by the wheel:
 *
 *  1. A pinned statement whose characters light up one by one as you scroll.
 *     The section holds still for a fixed distance while the text resolves.
 *  2. An overlay that fades in with a backdrop blur as the pin releases, so
 *     the section dissolves rather than cutting.
 *  3. Follow-up statements that rise and fade on their own scrub.
 *
 * Pinning is desktop-only. On touch devices pinned sections fight the
 * browser's own scroll handling and the address-bar resize, which produces
 * exactly the jitter that makes a site feel broken.
 */
/**
 * Split to characters for the reveal, but keep each word an unbreakable unit
 * with a REAL space between words. The first pass used a non-breaking space,
 * which removed every wrap opportunity and pushed the headline off the page.
 */
function splitChars(text) {
  return text.split(' ').map((word, w, arr) => (
    <Fragment key={w}>
      <span className="am-word">
        {word.split('').map((ch, i) => (
          <span className="am-char" key={i}>{ch}</span>
        ))}
      </span>
      {/* The space sits OUTSIDE the inline-block. A trailing text node inside
          one gets trimmed, which runs every word together. */}
      {w < arr.length - 1 ? ' ' : null}
    </Fragment>
  ))
}

export function AboutManifesto({ kicker, statement, beats }) {
  const rootRef = useRef(null)
  const pinRef = useRef(null)

  useEffect(() => {
    const root = rootRef.current
    if (!root) return

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const canPin = window.matchMedia('(min-width: 900px)').matches

    if (reduce) {
      gsap.set(root.querySelectorAll('.am-char'), { opacity: 1 })
      gsap.set(root.querySelectorAll('.am-beat'), { opacity: 1, y: 0 })
      return
    }

    const ctx = gsap.context(() => {
      const chars = root.querySelectorAll('.am-char')

      // 1. Character reveal, scrubbed. Pinned on desktop so the statement
      //    resolves in place; on touch it simply scrubs as the section passes.
      gsap.fromTo(
        chars,
        { opacity: 0.26 },
        {
          opacity: 1,
          ease: 'none',
          stagger: { each: 0.5, from: 'start' },
          scrollTrigger: {
            trigger: pinRef.current,
            start: 'top top',
            end: canPin ? '+=1200' : 'bottom top',
            scrub: 0.5,
            pin: canPin,
            anticipatePin: canPin ? 1 : 0,
            // Lower than the hero's, so the hero re-measures first and this
            // section's start offset accounts for the hero's pin spacer.
            refreshPriority: 1,
          },
        }
      )

      // Follow-up statements, each on its own scrub.
      root.querySelectorAll('.am-beat').forEach((el) => {
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
    <section ref={rootRef} aria-label="About BlackWater Marketing" style={{ background: '#080808' }}>
      <style>{`
        .am-pin { position:relative; min-height:100dvh; display:flex; align-items:center;
                  padding: clamp(5rem,8vw,7rem) clamp(1.5rem,5vw,4rem); overflow:hidden; }
        .am-inner { max-width:1240px; margin:0 auto; width:100%; position:relative; z-index:2; }
        .am-kicker { font-family:'Space Grotesk',sans-serif; font-size:.7rem; font-weight:600;
                     letter-spacing:.3em; text-transform:uppercase; color:rgba(255,255,255,.45); margin:0 0 2rem; }
        .am-statement { font-family:'Syne',sans-serif; font-weight:800; text-transform:uppercase;
                        font-size:clamp(1.8rem,4.6vw,4rem); line-height:1.08; letter-spacing:-.025em;
                        color:#ffffff; margin:0; max-width:20ch; }
        .am-char { will-change:opacity; }
        .am-word { display:inline-block; white-space:nowrap; }
        /* The accessible copy of the statement must not paint on top of the
           per-character spans. Clipped rather than display:none so it is still
           exposed to assistive tech and to crawlers. */
        .sr-only-text { position:absolute; width:1px; height:1px; padding:0; margin:-1px;
                        overflow:hidden; clip:rect(0 0 0 0); white-space:nowrap; border:0; }

        .am-beats { max-width:1240px; margin:0 auto;
                    padding: clamp(2.5rem,5vw,4rem) clamp(1.5rem,5vw,4rem) clamp(5rem,10vw,8rem); }
        .am-beat { margin:0 0 clamp(4rem,9vw,8rem); will-change:opacity, transform;
                   display:grid; gap:1.5rem; align-items:start; }
        @media (min-width: 900px) {
          .am-beat { grid-template-columns: 5fr 7fr; gap:clamp(2rem,5vw,4.5rem); }
        }
        .am-beat:last-child { margin-bottom:0; }
        .am-beat h2 { font-family:'Syne',sans-serif; font-weight:800; text-transform:uppercase;
                      font-size:clamp(1.7rem,3.6vw,3rem); line-height:1.06; letter-spacing:-.025em;
                      color:#ffffff; margin:0; max-width:14ch; }
        .am-beat p { font-family:'Space Grotesk',sans-serif; font-size:clamp(1.02rem,1.4vw,1.18rem);
                     line-height:1.72; color:rgba(255,255,255,.66); margin:0; max-width:56ch; }
      `}</style>

      <div className="am-pin" ref={pinRef}>
        <div className="am-inner">
          <p className="am-kicker">{kicker}</p>
          {/* The plain string stays available to screen readers and crawlers;
              the per-character spans are hidden from the accessibility tree. */}
          <h2 className="am-statement">
            <span className="sr-only-text">{statement}</span>
            <span aria-hidden="true">{splitChars(statement)}</span>
          </h2>
        </div>
      </div>

      <div className="am-beats">
        {beats.map((b) => (
          <div className="am-beat" key={b.h}>
            <h2>{b.h}</h2>
            <p>{b.p}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
