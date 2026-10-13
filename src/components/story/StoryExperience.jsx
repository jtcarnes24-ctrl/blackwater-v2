import { useEffect, useRef } from 'react'
import { WaterCanvas } from './WaterCanvas'

/**
 * Scroll-driven intro, modelled on the structure and pacing of the Noomo
 * storytelling piece: one fixed full-screen render underneath, a fixed
 * lockup top-left, and a sequence of pinned beats whose lines resolve word
 * by word as you pass through them.
 *
 * Copy is BlackWater's own. The reference's layout, pacing and scroll
 * mechanics are what is being matched, not its writing.
 *
 * Typography follows the site rather than the reference: Syne and Space
 * Grotesk for the sans, Playfair Display italic where the reference uses
 * its cursive serif.
 */

/* Each beat is one pinned stage. `lines` are rendered word by word so each
   word can resolve on its own slice of the beat's progress. `em` marks the
   words set in the italic serif. */
const BEATS = [
  {
    id: 'surface',
    lines: [['Most brands only ever see'], ['the ', { em: 'surface' }, '.']],
  },
  {
    id: 'spend',
    lines: [['Spend is what you ', { em: 'see' }, '.'], ['Structure is what you ', { em: 'don’t' }, '.']],
  },
  {
    id: 'leak',
    lines: [['The money is rarely lost'], ['where you ', { em: 'think' }, ' it is.']],
  },
]

/* Builds a line into whole words, each of which reveals as one unit.
   Splitting naively on the source parts put the full stop in "surface." on
   its own, so it drifted in a beat after the word it belongs to. Segments
   are flattened to characters with their emphasis, then regrouped on
   spaces, which keeps punctuation welded to its word and still allows a
   single word to be part italic. */
function buildWords(parts) {
  const chars = []
  parts.forEach((part) => {
    const em = typeof part === 'object'
    const text = em ? part.em : part
    for (const ch of String(text)) chars.push({ ch, em })
  })

  const words = []
  let current = []
  chars.forEach(({ ch, em }) => {
    if (ch === ' ') {
      if (current.length) { words.push(current); current = [] }
      return
    }
    const last = current[current.length - 1]
    if (last && last.em === em) last.text += ch
    else current.push({ text: ch, em })
  })
  if (current.length) words.push(current)
  return words
}

function renderLine(parts, key) {
  return buildWords(parts).map((word, wi) => (
    <span className="sx-word" key={`${key}-${wi}`} style={{ display: 'inline-block', whiteSpace: 'pre' }}>
      {word.map((seg, si) =>
        seg.em
          ? <em className="sx-em" key={si}>{seg.text}</em>
          : <span key={si}>{seg.text}</span>
      )}
      {' '}
    </span>
  ))
}

export function StoryExperience() {
  const rootRef = useRef(null)
  const progressRef = useRef(0)

  useEffect(() => {
    const root = rootRef.current
    if (!root) return

    const stages = [...root.querySelectorAll('[data-beat]')]
    const words = stages.map((s) => [...s.querySelectorAll('.sx-word')])
    const cue = root.querySelector('[data-cue]')

    let raf = 0

    const apply = () => {
      raf = 0
      const vh = window.innerHeight
      const doc = document.documentElement
      const max = doc.scrollHeight - vh

      progressRef.current = max > 0 ? Math.min(Math.max(window.scrollY / max, 0), 1) : 0

      stages.forEach((stage, si) => {
        const r = stage.getBoundingClientRect()
        /* 0 as the stage arrives, 1 as it leaves. The pinned child sits in
           the middle of this range, which is where the words resolve. */
        const p = Math.min(Math.max((vh - r.top) / (r.height + vh), 0), 1)
        const list = words[si]
        const n = list.length

        list.forEach((el, wi) => {
          // Words resolve across the first 55% of the beat, staggered, then
          // the whole line holds before the beat scrolls away.
          const from = 0.12 + (wi / Math.max(n, 1)) * 0.42
          const t = Math.min(Math.max((p - from) / 0.16, 0), 1)
          const out = Math.min(Math.max((p - 0.80) / 0.18, 0), 1)
          const a = t * (1 - out)
          el.style.opacity = a.toFixed(3)
          el.style.transform = `translate3d(0, ${((1 - t) * 0.5 + out * -0.35).toFixed(3)}em, 0)`
          el.style.filter = a > 0.995 ? 'none' : `blur(${((1 - t) * 7).toFixed(2)}px)`
        })
      })

      if (cue) {
        const fade = Math.min(Math.max(window.scrollY / (vh * 0.5), 0), 1)
        cue.style.opacity = (1 - fade).toFixed(3)
      }
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
    <div ref={rootRef} style={{ position: 'relative', background: '#080808' }}>
      <WaterCanvas progressRef={progressRef} />

      <style>{`
        .sx-lockup { position:fixed; top:clamp(1.1rem,2.2vw,1.9rem); left:clamp(1.1rem,2.6vw,2.4rem);
                     z-index:4; display:flex; align-items:center; gap:.6rem;
                     font-family:'Syne',sans-serif; font-weight:800; letter-spacing:-.02em;
                     font-size:.92rem; text-transform:uppercase; color:#ffffff; text-decoration:none; }
        .sx-lockup img { width:22px; height:22px; display:block; }
        .sx-lockup i { font-family:'Playfair Display',serif; font-style:italic; font-weight:500;
                       text-transform:none; letter-spacing:0; color:#DCE8F4; font-size:1.02rem; }

        .sx-skip { position:fixed; top:clamp(1.1rem,2.2vw,1.9rem); right:clamp(1.1rem,2.6vw,2.4rem);
                   z-index:4; font-family:'Space Grotesk',sans-serif; font-size:.66rem; font-weight:600;
                   letter-spacing:.2em; text-transform:uppercase; color:rgba(255,255,255,.55);
                   text-decoration:none; border:1px solid rgba(255,255,255,.2); border-radius:999px;
                   padding:.62rem 1.1rem; transition:color .3s ease, border-color .3s ease; }
        .sx-skip:hover { color:#ffffff; border-color:rgba(255,255,255,.6); }

        .sx-hero { position:relative; z-index:2; height:100svh; display:flex; flex-direction:column;
                   align-items:center; justify-content:center; text-align:center;
                   padding:0 clamp(1.25rem,5vw,3rem); }
        /* The water throws bright specular highlights straight through the
           copy. A soft radial scrim keeps the sub-line legible without
           flattening the render behind the headline. */
        .sx-hero::before { content:''; position:absolute; inset:0; pointer-events:none;
                           background:radial-gradient(ellipse 70% 55% at 50% 52%,
                             rgba(8,8,8,.72) 0%, rgba(8,8,8,.45) 45%, transparent 75%); }
        .sx-hero > * { position:relative; }
        .sx-hero h1 { font-family:'Syne',sans-serif; font-weight:800; text-transform:uppercase;
                      font-size:clamp(2.6rem,9vw,7.5rem); line-height:.92; letter-spacing:-.04em;
                      color:#ffffff; margin:0; text-wrap:balance; }
        .sx-hero h1 em { font-family:'Playfair Display',serif; font-style:italic; font-weight:500;
                         text-transform:none; letter-spacing:-.01em; color:#DCE8F4;
                         display:block; font-size:1.06em; }
        .sx-hero p { font-family:'Space Grotesk',sans-serif; font-size:clamp(.95rem,1.4vw,1.1rem);
                     line-height:1.6; color:rgba(255,255,255,.86); max-width:46ch;
                     margin:1.9rem auto 0; text-shadow:0 1px 18px rgba(8,8,8,.95); }

        .sx-cue { position:absolute; bottom:clamp(1.6rem,4vw,2.8rem); left:50%; transform:translateX(-50%);
                  font-family:'Space Grotesk',sans-serif; font-size:.62rem; font-weight:600;
                  letter-spacing:.28em; text-transform:uppercase; color:rgba(255,255,255,.5);
                  display:flex; flex-direction:column; align-items:center; gap:.7rem; }
        .sx-cue span { display:block; width:1px; height:46px;
                       background:linear-gradient(180deg, rgba(255,255,255,.5), transparent); }

        .sx-beat { position:relative; z-index:2; height:200svh; }
        .sx-stage { position:sticky; top:0; height:100svh; display:flex; align-items:center;
                    justify-content:center; padding:0 clamp(1.25rem,6vw,4rem); }
        .sx-stage::before { content:''; position:absolute; inset:0; pointer-events:none;
                            background:radial-gradient(ellipse 65% 50% at 42% 50%,
                              rgba(8,8,8,.68) 0%, rgba(8,8,8,.38) 50%, transparent 78%); }
        .sx-stage > * { position:relative; }
        .sx-copy { font-family:'Syne',sans-serif; font-weight:700; text-transform:uppercase;
                   font-size:clamp(1.65rem,5.4vw,4.4rem); line-height:1.1; letter-spacing:-.03em;
                   color:#ffffff; margin:0; max-width:17ch; text-align:left; }
        .sx-copy .sx-em { font-family:'Playfair Display',serif; font-style:italic; font-weight:500;
                          text-transform:none; letter-spacing:-.01em; color:#DCE8F4; font-size:1.06em; }
        .sx-word { will-change:opacity, transform, filter; }

        .sx-out { position:relative; z-index:2; min-height:100svh; display:flex; flex-direction:column;
                  align-items:center; justify-content:center; text-align:center;
                  padding:clamp(4rem,10vw,7rem) clamp(1.25rem,5vw,3rem); }
        .sx-out::before { content:''; position:absolute; inset:0; pointer-events:none;
                          background:radial-gradient(ellipse 72% 52% at 50% 50%,
                            rgba(8,8,8,.80) 0%, rgba(8,8,8,.5) 48%, transparent 78%); }
        .sx-out > * { position:relative; }
        .sx-out h2 { font-family:'Syne',sans-serif; font-weight:800; text-transform:uppercase;
                     font-size:clamp(2.1rem,7vw,5.4rem); line-height:.96; letter-spacing:-.04em;
                     color:#ffffff; margin:0 0 1.4rem; }
        .sx-out h2 em { font-family:'Playfair Display',serif; font-style:italic; font-weight:500;
                        text-transform:none; color:#DCE8F4; }
        .sx-out p { font-family:'Space Grotesk',sans-serif; font-size:clamp(.95rem,1.4vw,1.08rem);
                    line-height:1.65; color:rgba(255,255,255,.86); max-width:48ch; margin:0 0 2.6rem;
                    text-shadow:0 1px 18px rgba(8,8,8,.95); }
        .sx-enter { display:inline-flex; align-items:center; gap:.75rem;
                    font-family:'Space Grotesk',sans-serif; font-size:.74rem; font-weight:700;
                    letter-spacing:.2em; text-transform:uppercase; color:#080808; background:#ffffff;
                    text-decoration:none; border-radius:999px; padding:1.15rem 2.4rem;
                    transition:background .3s ease, transform .3s cubic-bezier(.22,1,.36,1); }
        .sx-enter:hover { background:#DCE8F4; transform:translateY(-2px); }
        .sx-enter:focus-visible { outline:2px solid #DCE8F4; outline-offset:4px; }

        /* At phone width the full wordmark and the skip pill collided.
           The mark plus the italic word is enough to hold the corner. */
        @media (max-width: 620px) {
          .sx-lockup { font-size:.74rem; gap:.45rem; }
          .sx-lockup .sx-wordmark { display:none; }
          .sx-lockup i { font-size:.95rem; }
          .sx-skip { font-size:.58rem; padding:.5rem .85rem; letter-spacing:.14em; }
        }

        @media (prefers-reduced-motion: reduce) {
          .sx-word { opacity:1 !important; transform:none !important; filter:none !important; }
          .sx-beat { height:auto; }
          .sx-stage { position:relative; height:auto; padding-block:22vh; }
          .sx-enter { transition:none; }
        }
      `}</style>

      <a className="sx-lockup" href="/">
        <img src="/logo-mark.png" alt="" width="22" height="22" />
        <span className="sx-wordmark">BlackWater</span> <i>Story</i>
      </a>
      <a className="sx-skip" href="/">Skip intro</a>

      <section className="sx-hero">
        <h1>
          Learn to read
          <em>the water.</em>
        </h1>
        <p>
          Everything that decides whether an account works is happening under the
          surface. This is how we read it.
        </p>
        <div className="sx-cue" data-cue>
          <span />
          Scroll
        </div>
      </section>

      {BEATS.map((beat) => (
        <section className="sx-beat" key={beat.id} data-beat={beat.id}>
          <div className="sx-stage">
            <h2 className="sx-copy">
              {beat.lines.map((parts, li) => (
                <span key={li} style={{ display: 'block' }}>{renderLine(parts, li)}</span>
              ))}
            </h2>
          </div>
        </section>
      ))}

      <section className="sx-out">
        <h2>
          Now look at the <em>work.</em>
        </h2>
        <p>
          The accounts, the method and the results behind it. Everything above is
          only worth anything if the numbers hold up.
        </p>
        <a className="sx-enter" href="/">
          Enter the agency <span aria-hidden="true">→</span>
        </a>
      </section>
    </div>
  )
}
