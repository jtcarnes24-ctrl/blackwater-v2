import { useEffect, useRef } from 'react'

/* /about/ hero (Oct 25 2026, replacing "Read the water."): the wave plays
   only inside a huge BLACKWATER, and scrolling dives through the L until
   the wave fills the screen, then hands over to the timeline below.

   How the cut-out works: a black layer holding white letters sits over the
   video with mix-blend-mode: multiply. Black times anything is black; white
   times the footage is the footage. So the video shows only through the
   letters, and scaling that one layer is the whole dive. Nothing is redrawn
   per frame except one transform and two opacities.

   The footage is Jack's breaking-surf clip (Oct 25 2026, Pexels 14986780,
   free licence), cut to a seamless 4.6s loop in its natural colour (Jack
   asked for colour over black and white) with the shoreline strip trimmed off, loaded as a Blob because Cloudflare's
   asset hosting ignores Range requests, which Safari needs to play a video. */

const clamp01 = (v) => Math.min(Math.max(v, 0), 1)
const smooth = (a, b, v) => { const t = clamp01((v - a) / (b - a)); return t * t * (3 - 2 * t) }

export function WordWaveHero() {
  const rootRef = useRef(null)
  const videoRef = useRef(null)
  const maskRef = useRef(null)
  const lRef = useRef(null)
  const chromeRef = useRef(null)
  const fadeRef = useRef(null)

  useEffect(() => {
    const root = rootRef.current, video = videoRef.current, mask = maskRef.current
    if (!root || !video || !mask) return
    const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const small = window.matchMedia('(max-width: 767px)').matches

    // Load the loop as a Blob so it plays on every host and browser.
    let url = '', cancelled = false
    fetch(small ? '/wave-loop-540.mp4' : '/wave-loop-720.mp4')
      .then((r) => (r.ok ? r.blob() : null))
      .then((b) => {
        if (!b || cancelled) return
        url = URL.createObjectURL(b)
        video.src = url
        if (!still) video.play().catch(() => {})
      })
      .catch(() => {})

    // The dive centres on the stem of the L, so the screen fills with
    // footage rather than with the black around the letters.
    let ox = 0, oy = 0, maxScale = 30
    const measure = () => {
      const l = lRef.current
      if (!l) return
      const m = mask.getBoundingClientRect(), r = l.getBoundingClientRect()
      ox = r.left - m.left + r.width * 0.2
      oy = r.top - m.top + r.height * 0.55
      mask.style.transformOrigin = `${ox}px ${oy}px`
      // Enough zoom for one stem to cover the screen, capped so the browser
      // is never asked to paint absurd sizes.
      const stem = Math.max(4, r.width * 0.28)
      maxScale = Math.min(60, Math.max(18, (window.innerWidth / stem) * 1.6))
    }

    let raf = 0, lastKey = -1, playing = !still
    const apply = () => {
      raf = 0
      const b = root.getBoundingClientRect()
      const run = b.height - window.innerHeight
      const p = run > 0 ? clamp01(-b.top / run) : 0
      const key = Math.round(p * 4000)
      if (key === lastKey) return
      lastKey = key
      // Ease-in zoom: slow at first so the word reads, then the dive.
      const t = smooth(0.06, 0.72, p)
      const s = still ? 1 : Math.exp(Math.log(maxScale) * t * t)
      mask.style.transform = `scale(${s})`
      mask.style.opacity = `${1 - smooth(0.62, 0.78, p)}`
      if (chromeRef.current) chromeRef.current.style.opacity = `${1 - smooth(0.02, 0.14, p)}`
      if (fadeRef.current) fadeRef.current.style.opacity = `${smooth(0.84, 1, p)}`
      // Pause the loop once the stage has scrolled away.
      const visible = b.bottom > 0 && b.top < window.innerHeight
      if (!still && visible !== playing) {
        playing = visible
        if (visible) video.play().catch(() => {}); else video.pause()
      }
    }
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(apply) }
    const onResize = () => { measure(); lastKey = -1; onScroll() }

    measure()
    apply()
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => { measure(); lastKey = -1; apply() })
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onResize)
    return () => {
      cancelled = true
      if (raf) cancelAnimationFrame(raf)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onResize)
      if (url) URL.revokeObjectURL(url)
    }
  }, [])

  return (
    <section ref={rootRef} className="wwh" aria-labelledby="wwh-title">
      <style>{`
        .wwh { position:relative; height:260svh; background:#080808; }
        .wwh-stage { position:sticky; top:0; height:100svh; overflow:hidden; background:#080808; isolation:isolate; }
        .wwh-video { position:absolute; inset:0; width:100%; height:100%; object-fit:cover; }
        .wwh-mask { position:absolute; inset:0; background:#080808; mix-blend-mode:multiply;
                    display:flex; align-items:center; justify-content:center; }
        .wwh-word { font-family:'Syne',sans-serif; font-weight:800; text-transform:uppercase; color:#fff;
                    font-size:min(15.4vw, 34svh); line-height:.86; letter-spacing:-.045em; margin:0;
                    white-space:nowrap; user-select:none; }
        .wwh-word span { display:inline-block; }
        .wwh-word .wwh-line { display:block; }
        .wwh-chrome { position:absolute; inset:0; pointer-events:none; }
        .wwh-kicker { position:absolute; left:clamp(1.5rem,5vw,4rem); bottom:clamp(1.5rem,5vh,3rem); margin:0;
                      font-family:'Space Grotesk',sans-serif; font-size:.7rem; font-weight:600; letter-spacing:.3em;
                      text-transform:uppercase; color:rgba(255,255,255,.7); }
        .wwh-cue { position:absolute; right:clamp(1.5rem,5vw,4rem); bottom:clamp(1.5rem,5vh,3rem); margin:0;
                   font-family:'Space Grotesk',sans-serif; font-size:.62rem; font-weight:600; letter-spacing:.28em;
                   text-transform:uppercase; color:rgba(255,255,255,.55); }
        .wwh-fade { position:absolute; inset:0; background:#080808; opacity:0; pointer-events:none; }
        .wwh-sr { position:absolute; width:1px; height:1px; overflow:hidden; clip:rect(0 0 0 0); white-space:nowrap; }
        @media (max-width:767px) {
          .wwh { height:230svh; }
          .wwh-word { font-size:15.5vw; line-height:.86; text-align:center; }
        }
      `}</style>

      <h1 id="wwh-title" className="wwh-sr">About BlackWater Marketing</h1>
      <div className="wwh-stage">
        <video ref={videoRef} className="wwh-video" poster="/wave-loop-poster.webp"
               muted loop playsInline preload="none" aria-hidden="true" tabIndex={-1} />
        <div ref={maskRef} className="wwh-mask" aria-hidden="true">
          <p className="wwh-word">
            <span className="wwh-line">
              <span>B</span><span ref={lRef}>L</span><span>ACK</span>
            </span>
            <span className="wwh-line wwh-l2">WATER</span>
          </p>
        </div>
        <div ref={chromeRef} className="wwh-chrome" aria-hidden="true">
          <p className="wwh-kicker">About BlackWater</p>
          <p className="wwh-cue">Scroll to dive in</p>
        </div>
        <div ref={fadeRef} className="wwh-fade" aria-hidden="true" />
      </div>
    </section>
  )
}
