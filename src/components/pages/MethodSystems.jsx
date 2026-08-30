import { useEffect, useRef } from 'react'

/**
 * Editorial numbered-systems layout.
 *
 * Structure mirrors the reference Jack supplied: a 12-column header with the
 * eyebrow and heading on the left and a supporting line right-aligned to the
 * baseline, then a divided list where each row is a sticky left rail (label,
 * oversized number, title) against a wider right column of prose and a
 * two-column bullet grid.
 *
 * Reveal is fade + 24px rise on a 0.8s cubic-bezier(0.22, 1, 0.36, 1), fired
 * by IntersectionObserver and staggered per row. Everything is BlackWater's
 * own type and palette.
 */
export function MethodSystems({ eyebrow, heading, emph, standfirst, systems }) {
  const rootRef = useRef(null)

  useEffect(() => {
    const root = rootRef.current
    if (!root) return
    const rows = [...root.querySelectorAll('[data-reveal]')]

    // Reduced-motion users get the finished state immediately.
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      rows.forEach((r) => r.setAttribute('data-revealed', 'true'))
      return
    }

    const show = (el) => {
      if (el.getAttribute('data-revealed') === 'true') return
      const i = rows.indexOf(el)
      el.style.transitionDelay = `${Math.max(0, i % 4) * 90}ms`
      el.setAttribute('data-revealed', 'true')
    }

    // threshold 0 rather than a percentage: a tall row scrolled past quickly
    // can otherwise never satisfy a percentage threshold and stays invisible.
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return
          show(entry.target)
          io.unobserve(entry.target)
        })
      },
      { rootMargin: '0px 0px -10% 0px', threshold: 0 }
    )
    rows.forEach((r) => io.observe(r))

    // Safety net. Anything already in view or scrolled past on mount — a
    // deep link, a restored scroll position, a fast flick — reveals straight
    // away instead of waiting for an intersection that already happened.
    const sweep = () => {
      rows.forEach((r) => {
        const rect = r.getBoundingClientRect()
        if (rect.top < window.innerHeight && rect.bottom > -1) {
          show(r)
          io.unobserve(r)
        } else if (rect.bottom <= 0) {
          show(r)
          io.unobserve(r)
        }
      })
    }
    sweep()
    window.addEventListener('scroll', sweep, { passive: true })
    return () => {
      io.disconnect()
      window.removeEventListener('scroll', sweep)
    }
  }, [])

  return (
    <section id="method" ref={rootRef} aria-label={heading} style={{ background: '#080808' }}>
      <style>{`
        .ms-wrap { max-width: 1240px; margin: 0 auto; padding: clamp(7rem,12vw,10rem) clamp(1.5rem,5vw,4rem) clamp(4rem,8vw,6rem); }

        .ms-head { display: grid; gap: 1.5rem; margin-bottom: 4rem; }
        @media (min-width: 900px) {
          .ms-head { grid-template-columns: 7fr 5fr; align-items: end; gap: 2.5rem; }
        }
        .ms-eyebrow { font-family:'Space Grotesk',sans-serif; font-size:.7rem; font-weight:600;
                      letter-spacing:.3em; text-transform:uppercase; color:rgba(255,255,255,.45); margin:0 0 1rem; }
        .ms-h1 { font-family:'Syne',sans-serif; font-size:clamp(2.2rem,5vw,3.6rem); font-weight:800;
                 line-height:1.02; letter-spacing:-.03em; color:#ffffff; text-transform:uppercase; margin:0; }
        .ms-standfirst { font-family:'Space Grotesk',sans-serif; font-size:clamp(1rem,1.4vw,1.15rem);
                         line-height:1.6; color:rgba(255,255,255,.62); margin:0; max-width:40ch; }

        .ms-list { border-top:1px solid rgba(255,255,255,.14); border-bottom:1px solid rgba(255,255,255,.14); }
        .ms-row { display:grid; gap:2rem; padding:clamp(2.5rem,5vw,4rem) 0;
                  border-bottom:1px solid rgba(255,255,255,.12); }
        .ms-list > .ms-row:last-child { border-bottom:none; }
        @media (min-width: 900px) {
          .ms-row { grid-template-columns: 4fr 8fr; gap:2.5rem; }
        }

        .ms-rail { align-self:start; }
        @media (min-width: 900px) { .ms-rail { position:sticky; top:7rem; } }
        .ms-label { font-family:'Space Grotesk',sans-serif; font-size:.68rem; font-weight:600;
                    letter-spacing:.3em; text-transform:uppercase; color:rgba(255,255,255,.45); margin:0; }
        .ms-numrow { display:flex; align-items:baseline; gap:1rem; margin-top:.75rem; }
        .ms-num { font-family:'Syne',sans-serif; font-size:clamp(2.6rem,5vw,3.4rem); font-weight:700;
                  line-height:1; color:rgba(255,255,255,.22); }
        .ms-title { font-family:'Syne',sans-serif; font-size:clamp(1.4rem,2.4vw,1.9rem); font-weight:700;
                    letter-spacing:-.02em; color:#ffffff; margin:0; }

        .ms-body p { font-family:'Space Grotesk',sans-serif; margin:0; }
        .ms-lead { font-size:clamp(1rem,1.5vw,1.15rem); line-height:1.7; color:rgba(255,255,255,.86); }
        .ms-sub  { font-size:.95rem; line-height:1.75; color:rgba(255,255,255,.62); margin-top:1.25rem !important; }
        @media (min-width: 900px) { .ms-body { padding-left:2.5rem; border-left:1px solid rgba(255,255,255,.12); } }

        .ms-points { list-style:none; padding:0; margin:1.5rem 0 0; display:grid; gap:.75rem 1.5rem; }
        @media (min-width: 640px) { .ms-points { grid-template-columns:1fr 1fr; } }
        .ms-points li { position:relative; padding-left:1.25rem; font-family:'Space Grotesk',sans-serif;
                        font-size:.9rem; line-height:1.6; color:rgba(255,255,255,.72); }
        .ms-points li::before { content:''; position:absolute; left:0; top:.6em;
                                width:6px; height:1px; background:rgba(255,255,255,.5); }

        /* Reveal: fade + rise, matching the reference timing. */
        [data-reveal] { opacity:0; transform:translateY(24px); will-change:opacity, transform;
                        transition:opacity .8s cubic-bezier(.22,1,.36,1), transform .8s cubic-bezier(.22,1,.36,1); }
        [data-reveal][data-revealed='true'] { opacity:1; transform:translateY(0); }
        @media (prefers-reduced-motion: reduce) {
          [data-reveal] { transition:none; }
        }
      `}</style>

      <div className="ms-wrap">
        <header className="ms-head" data-reveal>
          <div>
            <p className="ms-eyebrow">{eyebrow}</p>
            <h1 className="ms-h1">
              {heading} <span className="emph">{emph}</span>
            </h1>
          </div>
          <p className="ms-standfirst">{standfirst}</p>
        </header>

        <div className="ms-list">
          {systems.map((s) => (
            <article className="ms-row" key={s.num} data-reveal>
              <div className="ms-rail">
                <p className="ms-label">{s.label}</p>
                <div className="ms-numrow">
                  <span className="ms-num">{s.num}</span>
                  <h3 className="ms-title">{s.title}</h3>
                </div>
              </div>

              <div className="ms-body">
                <p className="ms-lead">{s.lead}</p>
                {s.points && (
                  <ul className="ms-points">
                    {s.points.map((pt) => <li key={pt}>{pt}</li>)}
                  </ul>
                )}
                {s.close && <p className="ms-sub">{s.close}</p>}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
