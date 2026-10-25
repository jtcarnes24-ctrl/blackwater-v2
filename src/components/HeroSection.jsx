import { useRef, useEffect } from 'react'
import { useApply } from './ui/ApplyModal'

/* The orb was retired Aug 2026 when the hero became a photograph; the
   photograph gave way to a scroll-driven rock, then to the coast
   scroll-through below (both Oct 23 2026). */


/* Scroll-through hero. A 15s, 1080p Dreamina clip Jack made (Oct 24 2026,
   replacing the Oct 23 coast clip): a glowing shoreline winding through dark
   dunes and water. Exported as 180 frames (12 per second), 1600px for
   desktop and a 540px portrait crop for phones, drawn to a canvas. Its own
   soundtrack was tried and removed at Jack's request (Oct 24 2026).
   A <video> is not used because seeking is jerky in most browsers and
   Cloudflare's asset hosting ignores Range requests, which leaves a video
   unseekable. Each draw blends the two frames either side of the scroll
   position, so 12fps scrubs as smoothly as 60.

   The page holds still while the scroll plays the clip. Nothing on screen
   but the scene and a few words:
     p 0    to 0.06   BLACKWATER, blurring away
     clip 3  to 6s    01  A method, not a template
     clip 6  to 9s    02  Audiences built on real intent
     clip 9  to 12s   03  Creators on demand
     clip 12 to 14s   04  Testing on a schedule
     p 0.86 to 0.97   the final hero, laid out after the Sonder House
                      reference, slides up into place piece by piece
   The clip runs over the first 88% of the pin and holds its last frame. */
const FRAMES = 180
const CLIP_SECONDS = 15
const CLIP_END = 0.88
const REVEAL = [0.86, 0.97]
const frameSrc = (set, i) => `/hero/shore/${set}/${String(i + 1).padStart(3, '0')}.webp`
const clamp01 = (v) => Math.min(Math.max(v, 0), 1)
const smooth = (a, b, v) => { const t = clamp01((v - a) / (b - a)); return t * t * (3 - 2 * t) }

// The Method, as on /the-method, trimmed to one line each.
const BEATS = [
  { from: 3,  to: 6,    num: '01', title: 'A method, not a template',
    line: 'Every campaign runs on the same foundation, so performance is repeatable instead of lucky.' },
  { from: 6,  to: 9,    num: '02', title: 'Audiences built on real intent',
    line: 'We target people already in the market for what you sell, then feed them into lookalikes.' },
  { from: 9,  to: 12,   num: '03', title: 'Creators on demand',
    line: 'A network of UGC creators gets you real content at the pace testing requires. No filming on your end.' },
  { from: 12, to: 14,   num: '04', title: 'Testing on a schedule',
    line: 'New creative goes live every week, winners get more budget, and anything that stops working comes off.' },
]

// Frame load order: first frame, then coarse to fine, so an early scroll
// already has frames spread across the whole clip.
function loadOrder(n) {
  const seen = new Set([0]), order = [0]
  for (let step = 32; step >= 1; step = step >> 1)
    for (let i = 0; i < n; i += step) if (!seen.has(i)) { seen.add(i); order.push(i) }
  return order
}

/* Thin eight-point sparkle, as in the reference's top-right corner. */
function Sparkle() {
  return (
    <svg className="sd-spark" viewBox="0 0 40 40" width="40" height="40" aria-hidden="true"
         fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round">
      <path d="M20 2v36M2 20h36M7.3 7.3l25.4 25.4M32.7 7.3L7.3 32.7" />
    </svg>
  )
}

export function HeroSection() {
  const { openApply } = useApply()
  const ref = useRef(null)
  const canvasRef = useRef(null)
  const titleRef = useRef(null)
  const beatRefs = useRef([])
  const revealRef = useRef(null)
  const skipRef = useRef(null)
  const cueRef = useRef(null)
  const fadeRef = useRef(null)

  useEffect(() => {
    const section = ref.current, canvas = canvasRef.current
    if (!section || !canvas) return
    const ctx = canvas.getContext('2d')
    const set = window.innerWidth < 768 ? 'm' : 'd'
    // Phones and touch devices get a lighter version of the same scene:
    // canvas capped at 1.5x (the phone frames are only 540px wide, so 2x
    // drew pixels that were never there), and no animated blur on the type,
    // which a phone has to re-rasterise on every scroll frame.
    const lite = window.matchMedia('(max-width: 767px), (hover: none)').matches
    const frames = new Array(FRAMES).fill(null)
    let p = 0, raf = 0, cw = 0, ch = 0
    // What is on the canvas now, so a scroll that changes nothing draws
    // nothing. Without this the hero repainted itself on every scroll frame
    // all the way down the page, long after it had scrolled out of view.
    let lastKey = -1, drawnExact = false, dirty = true

    const size = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, lite ? 1.5 : 2)
      cw = canvas.width = Math.round(canvas.clientWidth * dpr)
      ch = canvas.height = Math.round(canvas.clientHeight * dpr)
      dirty = true
    }
    const nearest = (i) => {
      for (let d = 0; d < FRAMES; d++) {
        if (frames[i - d]) return frames[i - d]
        if (frames[i + d]) return frames[i + d]
      }
      return null
    }
    const cover = (img, alpha) => {
      const s = Math.max(cw / img.naturalWidth, ch / img.naturalHeight)
      const dw = img.naturalWidth * s, dh = img.naturalHeight * s
      ctx.globalAlpha = alpha
      ctx.drawImage(img, (cw - dw) / 2, (ch - dh) / 2, dw, dh)
    }
    const frameAt = () => clamp01(p / CLIP_END) * (FRAMES - 1)
    const draw = () => {
      const f = frameAt()
      const i = Math.floor(f), t = f - i
      const a = nearest(i)
      drawnExact = a === frames[i]
      if (!a) { ctx.fillStyle = '#080808'; ctx.fillRect(0, 0, cw, ch); return }
      cover(a, 1)
      const b = frames[i + 1]
      if (b && t > 0.01) cover(b, t)
      ctx.globalAlpha = 1
    }

    const rise = revealRef.current ? [...revealRef.current.querySelectorAll('[data-rise]')] : []
    const LAYER_Y = { 2: 55, 3: 40, 4: 10 }
    const layers = revealRef.current
      ? [...revealRef.current.querySelectorAll('[data-layer]')].map((el) => [el, LAYER_Y[el.dataset.layer] ?? 0])
      : []

    const apply = () => {
      raf = 0
      const r = section.getBoundingClientRect()
      const run = r.height - window.innerHeight
      p = run > 0 ? clamp01(-r.top / run) : 0
      // Scroll-out, once the pin has let go: 0 while the stage fills the
      // screen, 1 when its bottom edge reaches the top of the viewport.
      const out = clamp01((window.innerHeight - r.bottom) / window.innerHeight)
      // A change in either position, or leaving view, counts as a change.
      const key = Math.round(p * 20000) + Math.round(out * 2000) * 30000 + (r.bottom > 0 ? 0 : 1e9)
      if (key === lastKey && !dirty) return
      lastKey = key
      dirty = false
      const sec = clamp01(p / CLIP_END) * CLIP_SECONDS

      const tOut = smooth(0, 0.06, p)
      if (titleRef.current) {
        titleRef.current.style.opacity = `${1 - tOut}`
        if (!lite) titleRef.current.style.filter = `blur(${tOut * 18}px)`
        titleRef.current.style.transform = `scale(${1 + tOut * 0.08})`
      }
      if (cueRef.current) cueRef.current.style.opacity = `${1 - smooth(0, 0.03, p)}`

      BEATS.forEach((b, k) => {
        const el = beatRefs.current[k]
        if (!el) return
        const o = smooth(b.from, b.from + 0.8, sec) * (1 - smooth(b.to - 0.8, b.to, sec))
        el.style.opacity = `${o}`
        el.style.transform = `translateY(${(1 - o) * 18}px)`
        if (!lite) el.style.filter = `blur(${(1 - o) * 6}px)`
      })

      const rv = smooth(REVEAL[0], REVEAL[1], p)
      if (revealRef.current) {
        revealRef.current.style.pointerEvents = rv > 0.6 ? 'auto' : 'none'
        revealRef.current.style.visibility = rv < 0.01 ? 'hidden' : 'visible'
        // Every piece of the final hero slides up into place on its own
        // beat as the clip settles, one after another, driven by the scroll.
        rise.forEach((el, k) => {
          const a = REVEAL[0] + k * 0.008
          const t = smooth(a, a + 0.05, p)
          el.style.opacity = `${t}`
          el.style.transform = `translateY(${(1 - t) * 70}px)`
        })
      }
      if (skipRef.current) {
        const so = 1 - smooth(REVEAL[0] - 0.08, REVEAL[0], p)
        skipRef.current.style.opacity = `${so}`
        skipRef.current.style.pointerEvents = so > 0.2 ? 'auto' : 'none'
      }
      // Parallax on the way out (after the Osmo layered-parallax pattern Jack
      // sent): every layer drifts down a share of its own height, so the deep
      // layers fall behind the scroll and the copy stays closest to it.
      canvas.style.transform = out > 0 ? `translate3d(0,${out * 70}%,0)` : ''
      // Phones stack the copy in one column, so full-strength layers slide over
      // each other; there the text layers move at about a third.
      const k = lite ? 0.35 : 1
      layers.forEach(([el, y]) => { el.style.transform = out > 0 ? `translate3d(0,${out * y * k}%,0)` : '' })
      if (fadeRef.current) fadeRef.current.style.opacity = `${Math.min(1, out * 1.6)}`
      draw()
    }
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(apply) }

    const onResize = () => { size(); onScroll() }

    let cancelled = false
    const order = loadOrder(FRAMES)
    const store = (i) => {
      // Redraw only if this frame belongs on screen right now.
      if (!drawnExact || Math.abs(i - frameAt()) < 2) { dirty = true; onScroll() }
    }
    const loadNext = (k) => {
      if (cancelled || k >= order.length) return
      const i = order[k], im = new Image()
      im.src = frameSrc(set, i)
      // decode() unpacks the image off the main thread before it is ever
      // drawn. Drawing an undecoded image decodes it on the spot, which was
      // a stall in the middle of a scroll on slower phones.
      im.decode()
        .then(() => { if (cancelled) return; frames[i] = im; store(i) })
        .catch(() => {})
        .finally(() => loadNext(k + 4))
    }
    // Four requests in flight at a time.
    for (let k = 0; k < 4; k++) loadNext(k)

    size(); apply()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onResize)
    return () => {
      cancelled = true
      if (raf) cancelAnimationFrame(raf)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onResize)
    }
  }, [])

  // Jumps to where the clip has settled and the normal hero is showing.
  const skip = () => {
    const s = ref.current
    if (!s) return
    const run = s.offsetHeight - window.innerHeight
    const y = s.getBoundingClientRect().top + window.scrollY + run * 0.97
    if (window.__lenis) window.__lenis.scrollTo(y, { duration: 1.2 })
    else window.scrollTo({ top: y, behavior: 'smooth' })
  }

  return (
    <section ref={ref} className="hero-run" aria-label="BlackWater Marketing">
      <style>{`
        .hero-run { position:relative; height:780svh; background:#080808; }
        .hero-stage { position:sticky; top:0; height:100svh; overflow:hidden; background:#080808; }
        .hero-canvas { position:absolute; inset:0; width:100%; height:100%; display:block; will-change:transform; }
        /* Keeps white type readable over the white rock: darker at the very
           top and bottom, clear through the middle of the scene. */
        .hero-shade { position:absolute; inset:0; pointer-events:none;
          background:linear-gradient(180deg, rgba(0,0,0,.45) 0%, rgba(0,0,0,0) 26%, rgba(0,0,0,0) 58%, rgba(0,0,0,.6) 100%); }

        .hx-title { position:absolute; inset:0; display:flex; align-items:center; justify-content:center;
          pointer-events:none; will-change:opacity, filter, transform; }
        .hx-word { font-family:'Syne',sans-serif; font-weight:700; text-transform:uppercase; color:#fff;
          font-size:min(11vw, 11rem); letter-spacing:-.03em; line-height:.9; margin:0;
          animation: hx-in 1.1s cubic-bezier(.22,1,.36,1) .2s both; }
        /* "Water" in the Playfair italic accent, matching the loader. Sized up
           a touch because the italic's capitals sit smaller than Syne's. */
        .hx-accent { font-family:'Playfair Display',serif; font-style:italic; font-weight:500;
                     text-transform:none; letter-spacing:-.01em; font-size:1.12em; margin-left:.04em; }
        html:not(.site-ready) .hx-word { animation-play-state:paused; }
        @keyframes hx-in { from { opacity:0; filter:blur(14px); } to { opacity:1; filter:blur(0); } }
        @media (max-width:767px), (hover:none) {
          @keyframes hx-in { from { opacity:0; } to { opacity:1; } }
        }

        .hx-beat { position:absolute; left:clamp(1.25rem,4vw,3.5rem); bottom:clamp(5rem,14vh,9rem);
          max-width:min(30rem, 86vw); opacity:0; pointer-events:none; will-change:opacity, transform, filter; }
        .hx-num { font-family:'Space Grotesk',sans-serif; font-size:.7rem; font-weight:600; letter-spacing:.3em;
          color:rgba(255,255,255,.6); margin:0 0 .8rem; }
        .hx-beat h2 { font-family:'Syne',sans-serif; font-weight:700; text-transform:uppercase; color:#fff;
          font-size:clamp(1.6rem,3.6vw,3.2rem); line-height:.95; letter-spacing:-.02em; margin:0 0 1rem; }
        .hx-beat p { font-family:'Space Grotesk',sans-serif; font-size:clamp(.9rem,1.1vw,1.02rem); line-height:1.6;
          color:rgba(255,255,255,.82); margin:0; }

        .hx-cue, .hx-skip { position:absolute; bottom:clamp(1.25rem,3vh,2rem); margin:0; background:none; border:0;
          font-family:'Space Grotesk',sans-serif; font-size:.62rem; font-weight:600; letter-spacing:.3em;
          text-transform:uppercase; color:rgba(255,255,255,.6); }
        .hx-cue { left:0; right:0; text-align:center; pointer-events:none; }
        .hx-skip { right:clamp(1rem,2.4vw,2rem); cursor:pointer; padding:.5rem 0; }
        .hx-skip:hover, .hx-skip:focus-visible { color:#fff; }
        .hx-skip:focus-visible { outline:1px solid #fff; outline-offset:4px; }

        /* ---- Final hero, laid out after the Sonder House reference ---- */
        .hl { position:absolute; inset:0; visibility:hidden; }
        .sd { color:#fff; font-family:'Inter',system-ui,sans-serif; --pad:clamp(1rem,2.6vw,2rem); }
        .sd [data-rise] { opacity:0; will-change:transform, opacity; }
        .sd-layer { position:absolute; inset:0; will-change:transform; }
        .sd-layer .sd-tr, .sd-layer .sd-card, .sd-layer .sd-btn { pointer-events:auto; }
        .hx-fade { position:absolute; left:0; right:0; bottom:0; height:35%; pointer-events:none; opacity:0;
          background:linear-gradient(to bottom, rgba(8,8,8,0) 0%, #080808 100%); }
        .sd p { margin:0; }
        .sd-w1, .sd-w2 { position:absolute; font-weight:500; text-transform:uppercase; line-height:.8;
          font-size:min(15.5vw, 30vh); letter-spacing:-.055em; white-space:nowrap; }
        .sd-w1 { left:calc(var(--pad) - .04em); top:calc(clamp(64px,6vw,84px) + 4vh); }
        .sd-w2 { right:calc(var(--pad) - .02em); top:calc(clamp(64px,6vw,84px) + 4vh + min(15.5vw, 30vh) * .78); }
        .sd-c { font-size:.2em; letter-spacing:0; vertical-align:top; margin-left:.25em; position:relative; top:.15em; font-weight:300; }
        .sd-tag { position:absolute; left:18vw; top:calc(clamp(64px,6vw,84px) + 4vh + min(15.5vw, 30vh) * .86);
          font-size:.62rem; letter-spacing:.02em; opacity:.85; }
        .sd-tr { position:absolute; right:var(--pad); top:calc(clamp(64px,6vw,84px) + 4.5vh); display:flex; align-items:center; gap:clamp(1rem,3vw,3rem); }
        .sd-tr p { font-size:.66rem; font-weight:500; text-transform:uppercase; line-height:1.25; text-align:right; letter-spacing:.01em; }
        .sd-spark { width:clamp(26px,2.4vw,38px); height:auto; opacity:.9; }
        .sd-mid { position:absolute; left:var(--pad); top:56%; display:flex; flex-direction:column; align-items:flex-start; }
        .sd-idx { font-size:.6rem; letter-spacing:.04em; opacity:.8; margin-bottom:.5rem !important; }
        .sd-h1 { display:inline-flex; flex-direction:column; margin:0; font-family:'Inter',system-ui,sans-serif; font-weight:500; text-transform:uppercase;
          font-size:clamp(1.3rem,2.45vw,2.6rem); line-height:.92; letter-spacing:-.035em; }
        .sd-h1 .sd-l1 { align-self:flex-end; padding-right:12%; }
        .sd-btn { margin-top:clamp(1.5rem,5vh,3rem); display:inline-flex; align-items:center; gap:.75rem;
          height:clamp(40px,3.4vw,50px); padding:0 clamp(1.4rem,2.4vw,2.2rem); border-radius:999px; border:0;
          background:#fff; color:#0b0b0b; font:inherit; font-size:.72rem; font-weight:500; text-transform:uppercase;
          letter-spacing:.01em; cursor:pointer; transition:transform .3s cubic-bezier(.22,1,.36,1); }
        .sd-btn:hover { transform:translateY(-2px); }
        .sd-btn:focus-visible { outline:2px solid #fff; outline-offset:3px; }
        .sd-dot { width:5px; height:5px; border-radius:50%; background:currentColor; }
        .sd-note { position:absolute; left:18vw; bottom:clamp(1.25rem,3vh,2rem); font-size:.62rem; font-weight:500;
          text-transform:uppercase; line-height:1.2; letter-spacing:.01em; }
        .sd-card { position:absolute; right:var(--pad); bottom:clamp(1.25rem,3vh,2rem); width:clamp(190px,15vw,250px);
          background:#fff; color:#0b0b0b; border-radius:clamp(14px,1.4vw,20px); padding:clamp(.9rem,1.3vw,1.25rem); }
        .sd-num { font-size:clamp(1.6rem,2.3vw,2.4rem); font-weight:400; letter-spacing:-.04em; line-height:1; }
        .sd-lab { font-size:.62rem; line-height:1.3; color:rgba(11,11,11,.62); margin-top:.45rem !important; }
        .sd-faces { display:flex; margin-top:clamp(.8rem,1.6vw,1.4rem); }
        .sd-faces span { width:26px; height:26px; border-radius:50%; background:#0b0b0b; border:2px solid #fff;
          display:grid; place-items:center; overflow:hidden; margin-left:-7px; }
        .sd-faces span:first-child { margin-left:0; }
        .sd-faces img { width:70%; height:70%; object-fit:contain; filter:brightness(0) invert(1); }


        .hero-marquee { overflow:hidden; width:100%;
          -webkit-mask-image:linear-gradient(90deg, transparent 0%, #000 14%, #000 86%, transparent 100%);
                  mask-image:linear-gradient(90deg, transparent 0%, #000 14%, #000 86%, transparent 100%); }
        .hero-marquee-track { display:flex; align-items:center; gap:3.25rem; width:max-content;
          animation:hero-logo-scroll 42s linear infinite; will-change:transform; }
        @keyframes hero-logo-scroll { from { transform:translate3d(0,0,0); } to { transform:translate3d(-33.333%,0,0); } }
        .hl:not(.is-live) .hero-marquee-track { animation-play-state:paused; }
        .hero-marquee img { height:22px; width:auto; object-fit:contain; filter:brightness(0) invert(1); opacity:.72; }

        @media (max-width:767px) {
          .hx-beat { bottom:clamp(4.5rem,12vh,7rem); }
          /* Centred, it collides with Skip intro on a narrow screen. */
          .hx-cue { left:clamp(1rem,2.4vw,2rem); right:auto; text-align:left; }
          .hx-cue { display:none; }
          .sd-w1, .sd-w2 { font-size:21vw; }
          .sd-w1 { top:calc(clamp(64px,6vw,84px) + 3vh); }
          .sd-w2 { top:calc(clamp(64px,6vw,84px) + 3vh + 21vw * .8); }
          .sd-tag { left:var(--pad); top:calc(clamp(64px,6vw,84px) + 3vh + 21vw * 1.72); }
          .sd-tr { top:auto; bottom:calc(clamp(1.25rem,3vh,2rem) + 9.5rem); }
          .sd-tr p { font-size:.6rem; }
          .sd-mid { top:calc(clamp(64px,6vw,84px) + 3vh + 21vw * 2.05); }
          .sd-h1 { font-size:6.6vw; }
          .sd-note { left:var(--pad); bottom:calc(clamp(1.25rem,3vh,2rem) + 9.5rem); font-size:.58rem; }
          .sd-card { left:var(--pad); right:var(--pad); width:auto; display:grid; grid-template-columns:auto 1fr auto; align-items:center; gap:.9rem; }
          .sd-lab { margin-top:0 !important; }
          .sd-faces { margin-top:0; }
          /* Phones drop the service list, (BW) index and note for a cleaner stack. */
          .sd-tag, .sd-idx, .sd-note { display:none !important; }
        }
        @media (prefers-reduced-motion: reduce) {
          .hero-marquee-track { animation:none; }
          .hx-word { animation:none; }
        }
      `}</style>

      <div className="hero-stage">
        <canvas ref={canvasRef} className="hero-canvas" aria-hidden="true" />
        <div className="hero-shade" aria-hidden="true" />

        <div ref={titleRef} className="hx-title" aria-hidden="true">
          <p className="hx-word">Black<span className="hx-accent">Water</span></p>
        </div>

        {BEATS.map((b, k) => (
          <div key={b.num} ref={(el) => { beatRefs.current[k] = el }} className="hx-beat">
            <p className="hx-num">{b.num} / The Method</p>
            <h2>{b.title}</h2>
            <p>{b.line}</p>
          </div>
        ))}

        <p ref={cueRef} className="hx-cue" aria-hidden="true">Scroll to explore</p>
        <button ref={skipRef} type="button" className="hx-skip" onClick={skip}>Skip intro ↓</button>

        {/* Final hero, laid out after the Sonder House reference Jack sent
            (Oct 24 2026). Every [data-rise] piece slides up on its own beat. */}
        <div ref={revealRef} className="hl sd">
          {/* Parallax layers for the scroll-out: each moves down a share of
              its own height as the hero leaves, the canvas most, the copy least. */}
          <div className="sd-layer" data-layer="2">
            <p className="sd-w1" data-rise>Black<span className="sd-c" aria-hidden="true">©</span></p>
            <p className="sd-tag" data-rise>Paid Ads · Creative · Funnels · Retention</p>
            <div className="sd-tr" data-rise>
              <Sparkle />
              <p>Full-stack<br />e-commerce<br />partner</p>
            </div>
          </div>
          <div className="sd-layer" data-layer="3">
            <p className="sd-w2" data-rise>Water</p>
          </div>
          <div className="sd-layer" data-layer="4">
            <div className="sd-mid">
              <p className="sd-idx" data-rise>(BW)</p>
              <h1 className="sd-h1" data-rise>
                <span className="sd-l1">Scaling</span>
                <span><span style={{ whiteSpace: 'nowrap' }}>E-commerce</span> brands</span>
                <span>with data, not guesswork</span>
              </h1>
              <button type="button" className="sd-btn" data-rise onClick={openApply}>
                Apply now <span className="sd-dot" aria-hidden="true" />
              </button>
            </div>

            <p className="sd-note" data-rise>We scale e-commerce brands<br />the way they should be scaled,<br />with data behind every decision</p>

            <div className="sd-card" data-rise>
              <p className="sd-num">35+</p>
              <p className="sd-lab">brands we&rsquo;ve worked with<br />on paid growth</p>
              <div className="sd-faces" aria-hidden="true">
                {['/client-logos/logo-beloved.png', '/client-logos/logo-rpr.png', '/client-logos/logo-dabv.svg'].map((src) => (
                  <span key={src}><img src={src} alt="" decoding="async" /></span>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div ref={fadeRef} className="hx-fade" aria-hidden="true" />
      </div>
    </section>
  )
}
