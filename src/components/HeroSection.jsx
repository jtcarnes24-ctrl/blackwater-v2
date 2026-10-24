import { useRef, useEffect } from 'react'
import { LiquidButton } from './ui/LiquidButton'
import { useApply } from './ui/ApplyModal'

/* The orb was retired Aug 2026 when the hero became a photograph; the
   photograph gave way to a scroll-driven rock, then to the coast
   scroll-through below (both Oct 23 2026). */

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
  /* Added Oct 5 2026. Beloved and RPR are trimmed to their alpha bounding box
     and exported at 3x the 22px display height, same as the Aug batch. DABV
     ships as SVG: its source had width="100%", preserveAspectRatio="none" and
     fill="currentColor", none of which survive being dropped into an <img>,
     so this copy pins a real size and an explicit fill. */
  { src: '/client-logos/logo-beloved.png', w: 54 }, { src: '/client-logos/logo-rpr.png', w: 101 },
  { src: '/client-logos/logo-dabv.svg',    w: 89 },
]
const HERO_LOGO_LOOP = [...HERO_LOGOS, ...HERO_LOGOS, ...HERO_LOGOS]

/* Scroll-through hero. A 20s, 1080p Dreamina drone shot Jack made (Oct 23
   2026): it descends over white marble sea arches on black water, flies
   through the central arch and glides out into the mist. Exported as 240
   frames (12 per second), 1600px for desktop and a 540px portrait crop for
   phones, drawn to a canvas. A <video> is not used because seeking is jerky
   in most browsers and Cloudflare's asset hosting ignores Range requests,
   which leaves a video unseekable. Each draw blends the two frames either
   side of the scroll position, so 12fps scrubs as smoothly as 60.

   The page holds still while the scroll plays the clip. Nothing on screen
   but the scene and a few words:
     p 0    to 0.06   BLACKWATER, blurring away
     clip 4  to 8s    01  A method, not a template
     clip 8  to 12s   02  Audiences built on real intent
     clip 12 to 16s   03  Creators on demand
     clip 16 to 18.5s 04  Testing on a schedule
     p 0.86 to 1      the clip has settled; the final hero fades in, laid out
                      after cyphercapital.com (headline top left under the
                      header logo, an underlined link, logos and Apply below)
   The clip runs over the first 88% of the pin and holds its last frame. */
const FRAMES = 240
const CLIP_SECONDS = 20
const CLIP_END = 0.88
const REVEAL = [0.86, 0.95]
const frameSrc = (set, i) => `/hero/coast/${set}/${String(i + 1).padStart(3, '0')}.webp`
const clamp01 = (v) => Math.min(Math.max(v, 0), 1)
const smooth = (a, b, v) => { const t = clamp01((v - a) / (b - a)); return t * t * (3 - 2 * t) }

// The Method, as on /the-method, trimmed to one line each.
const BEATS = [
  { from: 4,  to: 8,    num: '01', title: 'A method, not a template',
    line: 'Every campaign runs on the same foundation, so performance is repeatable instead of lucky.' },
  { from: 8,  to: 12,   num: '02', title: 'Audiences built on real intent',
    line: 'We target people already in the market for what you sell, then feed them into lookalikes.' },
  { from: 12, to: 16,   num: '03', title: 'Creators on demand',
    line: 'A network of UGC creators gets you real content at the pace testing requires. No filming on your end.' },
  { from: 16, to: 18.5, num: '04', title: 'Testing on a schedule',
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

export function HeroSection() {
  const { openApply } = useApply()
  const ref = useRef(null)
  const canvasRef = useRef(null)
  const titleRef = useRef(null)
  const beatRefs = useRef([])
  const revealRef = useRef(null)
  const skipRef = useRef(null)
  const cueRef = useRef(null)

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

    const apply = () => {
      raf = 0
      const r = section.getBoundingClientRect()
      const run = r.height - window.innerHeight
      p = run > 0 ? clamp01(-r.top / run) : 0
      // Leaving or re-entering view also counts as a change (marquee on/off).
      const key = Math.round(p * 20000) + (r.bottom > 0 ? 0 : 1e6)
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
        revealRef.current.style.opacity = `${rv}`
        revealRef.current.style.transform = `translateY(${(1 - rv) * 24}px)`
        revealRef.current.style.pointerEvents = rv > 0.6 ? 'auto' : 'none'
        revealRef.current.style.visibility = rv < 0.01 ? 'hidden' : 'visible'
        // The logo marquee only runs once it can be seen.
        revealRef.current.classList.toggle('is-live', rv >= 0.01 && r.bottom > 0)
      }
      if (skipRef.current) {
        const so = 1 - smooth(REVEAL[0] - 0.08, REVEAL[0], p)
        skipRef.current.style.opacity = `${so}`
        skipRef.current.style.pointerEvents = so > 0.2 ? 'auto' : 'none'
      }
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
        .hero-canvas { position:absolute; inset:0; width:100%; height:100%; display:block; }
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

        /* ---- Final hero, laid out after cyphercapital.com ---- */
        .hl { position:absolute; inset:0; opacity:0; visibility:hidden; will-change:opacity, transform; }
        .hl-top { position:absolute; left:clamp(1rem,2.6vw,2rem); right:clamp(1rem,2.6vw,2rem);
                  top:calc(clamp(64px,6.2vw,88px) + clamp(1.5rem,4vh,2.5rem)); }
        .hl-h1 { font-family:'Syne',sans-serif; font-weight:700; text-transform:uppercase; color:#fff;
                 font-size:clamp(2.2rem,4.6vw,4.6rem); line-height:.98; letter-spacing:-.03em; margin:0; max-width:21ch; }
        .hl-h1 .emph { font-size:1.08em; }
        .hl-link { display:inline-block; margin-top:clamp(2rem,5vh,3.25rem); padding-bottom:.9rem;
                   border-bottom:1px solid currentColor; color:#fff; text-decoration:none;
                   font-family:'Space Grotesk',sans-serif; font-size:1rem; font-weight:500; letter-spacing:-.02em; }
        .hl-link:hover { opacity:.7; }
        .hl-link:focus-visible { outline:1px solid #fff; outline-offset:4px; }
        .hl-foot { position:absolute; left:clamp(1rem,2.6vw,2rem); right:clamp(1rem,2.6vw,2rem);
                   bottom:clamp(1.25rem,3vh,2rem); display:flex; justify-content:space-between; align-items:flex-end; gap:1.5rem; }
        .hl-trust { pointer-events:none; width:min(320px, 60vw); min-width:0; overflow:hidden; }
        .hl-trust p { font-family:'Space Grotesk',sans-serif; font-size:.6rem; letter-spacing:.22em;
                      text-transform:uppercase; color:rgba(255,255,255,.65); font-weight:600; margin:0 0 .8rem; }

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
          .hl-h1 { font-size:10.5vw; }
          .hl-foot { flex-direction:column; align-items:stretch; }
          .hl-trust { width:100%; }
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

        <div ref={revealRef} className="hl">
          <div className="hl-top">
            <h1 className="hl-h1">
              Scaling <span style={{ whiteSpace: 'nowrap' }}>e-commerce</span> brands with data, not <span className="emph">guesswork</span>
            </h1>
            <a className="hl-link" href="#services">Explore our services</a>
          </div>
          <div className="hl-foot">
            <div className="hl-trust">
              <p>Trusted by</p>
              <div className="hero-marquee">
                <div className="hero-marquee-track">
                  {HERO_LOGO_LOOP.map((logo, i) => (
                    <img key={i} src={logo.src} alt="" aria-hidden="true"
                         width={logo.w} height={22} decoding="async" />
                  ))}
                </div>
              </div>
            </div>
            <LiquidButton onClick={openApply} variant="solid">Apply Now →</LiquidButton>
          </div>
        </div>
      </div>
    </section>
  )
}
