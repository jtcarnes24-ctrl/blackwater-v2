import { useEffect, useState } from 'react'
import ScrollExpand from './ui/ScrollExpand/ScrollExpand'

/* The founder section is a scroll-driven reveal ON DESKTOP ONLY.

   It opens as a small rounded window on Jack's portrait. As you scroll, the
   window expands to full bleed, the portrait crossfades into a pre-blurred
   copy of the same frame, and his copy fades in over the top.

   Phones get a plain image and plain text instead, and that is deliberate.
   The effect clips a window out of a viewport-sized image using object-fit:
   cover. On a 375x812 phone, covering a 16:9 photograph means scaling it to
   fill the HEIGHT and throwing away most of the width -- the "small" state
   became a band of Jack's cheek with the composition gone. Every fix for that
   fights the effect itself, so on phones the effect is simply not used.
   It also removes a clip-path animation and a crossfade of two full-bleed
   images from the one device least able to afford them.

   The blur plate is a second exported image rather than a CSS filter: blurring
   a full-bleed photograph in CSS is recomputed every frame mid-scroll. */

const SHARP_SET =
  '/founder-sharp-1100.jpg 1100w, /founder-sharp-1800.jpg 1800w, /founder-sharp-2880.jpg 2880w'

const PARAS = [
  `I started running ads for my own brand and learned the hard way that the
   product is rarely the problem. Getting it in front of the right people is.
   Every account I take on runs through the same method, and I am the one on
   it, watching the numbers and moving when something needs to move.`,
  `I don't take on clients I can't actually help. That sounds obvious, but
   it's rarer than you'd think in this industry. When we work together,
   you're not getting handed off to an account manager two weeks in. You get
   me, on the account, watching the numbers, adjusting when something needs
   to move. The brands I work with tend to stay because the results keep
   coming.`,
]

const CSS = `
  .fdr-copy {
    max-width: 62ch;
    margin: 0 auto;
    color: #141414;
    text-align: center;
  }
  .fdr-eyebrow {
    font-size: 0.66rem; letter-spacing: 0.22em; text-transform: uppercase;
    font-weight: 700; color: rgba(20,20,20,0.45);
    margin: 0 0 1.1rem;
  }
  .fdr-h {
    font-family: 'Syne', sans-serif; font-weight: 700;
    font-size: clamp(1.9rem, 4.4vw, 3.6rem);
    line-height: 0.98; letter-spacing: -0.03em;
    text-transform: uppercase; margin: 0 0 1.5rem;
  }
  .fdr-h em {
    display: block;
    font-family: 'Playfair Display', serif;
    font-style: italic; font-weight: 500;
    text-transform: none; letter-spacing: -0.01em;
  }
  .fdr-p {
    font-size: clamp(0.85rem, 1.05vw, 1rem);
    line-height: 1.7; color: rgba(20,20,20,0.72);
    margin: 0 0 1rem;
  }
  .fdr-p:last-child { margin-bottom: 0; }
  .fdr-sig {
    margin-top: 1.75rem;
    font-size: 0.66rem; letter-spacing: 0.2em; text-transform: uppercase;
    font-weight: 700; color: rgba(20,20,20,0.5);
  }

  /* ── phone layout: the whole artwork, then the words ── */
  .fdr-still {
    display: block; width: 100%; height: auto;
  }
  .fdr-stack .fdr-copy {
    max-width: 100%;
    text-align: left;
    padding: clamp(1.75rem, 7vw, 2.5rem) clamp(1.25rem, 5vw, 2rem) clamp(2.5rem, 9vw, 4rem);
  }
  .fdr-stack .fdr-h {
    font-size: clamp(1.9rem, 8.5vw, 2.6rem);
  }
  .fdr-stack .fdr-p { font-size: 0.95rem; }
`

export function FounderSection() {
  /* Read synchronously on first render, not in an effect, so a phone never
     paints the desktop version for a frame before swapping. */
  const [narrow, setNarrow] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(max-width: 860px)').matches
  )
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 860px)')
    const update = () => setNarrow(mq.matches)
    update()
    mq.addEventListener('change', update)
    return () => mq.removeEventListener('change', update)
  }, [])

  const copy = (
    <div className="fdr-copy">
      <p className="fdr-eyebrow">The Founder</p>
      <h2 className="fdr-h">Built on real <em>accounts.</em></h2>
      {PARAS.map((p, i) => (
        <p key={i} className="fdr-p">{p.replace(/\s+/g, ' ').trim()}</p>
      ))}
      <p className="fdr-sig">Jack Carnes — Founder, BlackWater Marketing</p>
    </div>
  )

  if (narrow) {
    return (
      <section id="founder" className="fdr-stack" style={{ background: '#ffffff' }}>
        <style>{CSS}</style>
        {/* Natural aspect ratio, full width: the entire composition is visible,
            which is the whole point of the artwork. */}
        <img
          className="fdr-still"
          src="/founder-sharp-1100.jpg"
          srcSet={SHARP_SET}
          sizes="100vw"
          width="1800" height="1013"
          alt="Jack Carnes, founder of BlackWater Marketing"
          loading="lazy" decoding="async"
        />
        {copy}
      </section>
    )
  }

  return (
    <section id="founder" style={{ background: '#ffffff' }}>
      <style>{CSS}</style>
      <ScrollExpand
        useWindowScroll
        alt="Jack Carnes, founder of BlackWater Marketing"
        src="/founder-sharp-1800.jpg"
        srcSet={SHARP_SET}
        srcBlur="/founder-blur-1400.jpg"
        srcBlurSet="/founder-blur-900.jpg 900w, /founder-blur-1400.jpg 1400w, /founder-blur-2200.jpg 2200w"
        sizes="100vw"
        scrollHint="Scroll"
        /* Light, not dark: the blurred plate is near-white, so it needs
           lifting toward white to carry ink text, not darkening. */
        scrimTone="light"
        overlayScrim={0.55}
        /* The opening window is roughly 16:9 because the artwork is. The media
           is object-fit: cover, so a differently shaped window crops it. */
        startWidth={54}
        startHeight={52}
        startRadius={22}
        /* Below 1, deliberately. The clip-path only cuts a window out of a
           full-viewport-sized image, so at upstream's default zoom the closed
           state is a peephole onto the centre of the frame -- all face, no
           composition. Scaling the media to roughly the window's own width
           means the closed state shows the WHOLE artwork small, and it grows
           to full size as the window opens. Keep this near startWidth/100. */
        mediaZoom={0.56}
        scrollDistance={1.1}
        holdDistance={0.4}
        /* The swap finishes before the copy starts fading in at 0.68, so the
           text never lands on a sharp face. */
        blurStart={0.28}
        blurEnd={0.66}
      >
        {copy}
      </ScrollExpand>
    </section>
  )
}
