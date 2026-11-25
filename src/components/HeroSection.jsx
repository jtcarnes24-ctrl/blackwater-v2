import { useRef, useEffect } from 'react'
import { useApply } from './ui/ApplyModal'
import { RESULTS } from '../lib/results'

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
// The two result screenshots on the final hero (Jack's pick, Nov 24 2026).
const HERO_PROOF = ['12.97x ROAS', '$8,236/day'].map((m) => RESULTS.find((r) => r.metric === m)).filter(Boolean)

const FRAMES = 180
const CLIP_SECONDS = 15
const CLIP_END = 0.88
const REVEAL = [0.86, 0.97]
const frameSrc = (set, i) => `/hero/shore/${set}/${String(i + 1).padStart(3, '0')}.webp`
const clamp01 = (v) => Math.min(Math.max(v, 0), 1)
const smooth = (a, b, v) => { const t = clamp01((v - a) / (b - a)); return t * t * (3 - 2 * t) }

// The Method, as on /the-method, trimmed to one line each.
const BEATS = [
  { from: 3,  to: 6,    num: '01', title: 'One tested playbook',
    line: 'Every account runs on the same proven steps, so good results can be repeated, not lucky.' },
  { from: 6,  to: 9,    num: '02', title: 'Ads for people ready to buy',
    line: 'We find people already shopping for what you sell, then reach more people like them.' },
  { from: 9,  to: 12,   num: '03', title: 'Creators film your ads',
    line: 'Real creators make new video ads for you as fast as we need them. You never have to film.' },
  { from: 12, to: 14,   num: '04', title: 'New ads every week',
    line: 'We test new ads every week. Winners get more money. Ads that stop working get turned off.' },
]

// Frame load order: first frame, then coarse to fine, so an early scroll
// already has frames spread across the whole clip.
function loadOrder(n) {
  // The last frame early too: it is the resting hero, and the logo jumps there.
  const seen = new Set([0, n - 1]), order = [0, n - 1]
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
  const fadeRef = useRef(null)
  const fgRef = useRef(null)

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
    /* Frames are kept as their small compressed files (about 4MB for the
       whole phone set) and only the ones near the scroll position are
       unpacked into bitmaps, off the main thread. Holding all 180 unpacked
       was over 300MB on a phone; the browser threw some away under memory
       pressure and then re-unpacked them mid-scroll, which was the stutter.
       Every 8th frame stays unpacked as a coarse fallback for fast flicks. */
    const blobs = new Array(FRAMES).fill(null)
    const frames = new Array(FRAMES).fill(null)   // unpacked ImageBitmaps
    const pending = new Set()
    const WIN = 10, KEEP = 8
    const pinned = (i) => i % KEEP === 0 || i === FRAMES - 1
    let p = 0, raf = 0, cw = 0, ch = 0, decoding = 0
    // What is on the canvas now, so a scroll that changes nothing draws
    // nothing. Without this the hero repainted itself on every scroll frame
    // all the way down the page, long after it had scrolled out of view.
    let lastKey = -1, drawnExact = false, dirty = true

    /* "BLACKWATER" sits between the sky and the hills, like the Sonar
       reference Jack sent (Nov 24 2026): the land of the clip's last frame is
       cut out as its own image (fg-d / fg-m, alpha above the ridge) and laid
       over the word. Its foot is placed from where the ridge falls on screen
       under object-fit: cover, so the hills cover the same share of the
       letters at any window size. */
    const FG = set === 'm' ? { w: 540, h: 816, foot: 0.372 } : { w: 1600, h: 906, foot: 0.405 }
    if (fgRef.current) fgRef.current.src = `/hero/shore/fg-${set}.webp`
    const placeWord = () => {
      const vw = canvas.clientWidth, vh = canvas.clientHeight
      const sc = Math.max(vw / FG.w, vh / FG.h)
      const top = (vh - FG.h * sc) / 2
      if (revealRef.current) revealRef.current.style.setProperty('--sn-foot', `${Math.round(top + FG.foot * FG.h * sc)}px`)
    }
    const size = () => {
      // Never wider than the frames themselves (540px on phones): extra canvas
      // pixels only add fill work with nothing in them.
      const cap = set === 'm' ? Math.max(1, 540 / Math.max(1, canvas.clientWidth)) : 2
      const dpr = Math.min(window.devicePixelRatio || 1, lite ? 1.5 : 2, cap)
      const w = Math.round(canvas.clientWidth * dpr), h = Math.round(canvas.clientHeight * dpr)
      // Phones fire resize as the address bar slides during a scroll. Setting
      // a canvas's size, even to the same numbers, wipes and reallocates it,
      // so only touch it when the size really changed.
      placeWord()
      if (w === cw && h === ch) return
      cw = canvas.width = w
      ch = canvas.height = h
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
      const s = Math.max(cw / img.width, ch / img.height)
      const dw = img.width * s, dh = img.height * s
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

    // Write a style only when it changes. Re-writing the same value to a
    // dozen elements every scroll frame still makes the browser re-check them.
    const last = new Map()
    const put = (el, prop, v) => {
      let m = last.get(el)
      if (!m) { m = {}; last.set(el, m) }
      if (m[prop] === v) return
      m[prop] = v
      el.style[prop] = v
    }

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
        put(titleRef.current, 'opacity', `${1 - tOut}`)
        if (!lite) put(titleRef.current, 'filter', `blur(${tOut * 18}px)`)
        put(titleRef.current, 'transform', `scale(${1 + tOut * 0.08})`)
      }
      if (cueRef.current) put(cueRef.current, 'opacity', `${1 - smooth(0, 0.03, p)}`)

      BEATS.forEach((b, k) => {
        const el = beatRefs.current[k]
        if (!el) return
        const o = smooth(b.from, b.from + 0.8, sec) * (1 - smooth(b.to - 0.8, b.to, sec))
        put(el, 'opacity', `${o}`)
        put(el, 'transform', `translateY(${(1 - o) * 18}px)`)
        if (!lite) put(el, 'filter', `blur(${(1 - o) * 6}px)`)
      })

      const rv = smooth(REVEAL[0], REVEAL[1], p)
      if (revealRef.current) {
        put(revealRef.current, 'pointerEvents', rv > 0.6 ? 'auto' : 'none')
        put(revealRef.current, 'visibility', rv < 0.01 ? 'hidden' : 'visible')
        // Every piece of the final hero slides up into place on its own
        // beat as the clip settles, one after another, driven by the scroll.
        rise.forEach((el, k) => {
          const a = REVEAL[0] + k * 0.008
          const t = smooth(a, a + 0.05, p)
          put(el, 'opacity', `${t}`)
          put(el, 'transform', `translateY(${(1 - t) * 70}px)`)
        })
      }
      if (skipRef.current) {
        const so = 1 - smooth(REVEAL[0] - 0.08, REVEAL[0], p)
        put(skipRef.current, 'opacity', `${so}`)
        put(skipRef.current, 'pointerEvents', so > 0.2 ? 'auto' : 'none')
      }
      // Parallax on the way out (after the Osmo layered-parallax pattern Jack
      // sent): every layer drifts down a share of its own height, so the deep
      // layers fall behind the scroll and the copy stays closest to it.
      put(canvas, 'transform', out > 0 ? `translate3d(0,${out * 70}%,0)` : '')
      if (fgRef.current) {
        // The cut-out land only matches the clip once it rests on its last frame.
        put(fgRef.current, 'opacity', `${smooth(0.875, 0.885, p)}`)
        put(fgRef.current, 'transform', out > 0 ? `translate3d(0,${out * 70}%,0)` : '')
      }
      // Phones stack the copy in one column, so full-strength layers slide over
      // each other; there the text layers move at about a third.
      const k = lite ? 0.35 : 1
      layers.forEach(([el, y]) => put(el, 'transform', out > 0 ? `translate3d(0,${out * y * k}%,0)` : ''))
      if (fadeRef.current) put(fadeRef.current, 'opacity', `${Math.min(1, out * 1.6)}`)
      // While the stage fills the screen the header is always over dark
      // footage, so it is told so and skips measuring the page (Nav.jsx).
      const lock = r.top <= 0 && r.bottom >= window.innerHeight ? 'on-dark' : ''
      if (document.documentElement.dataset.hdrLock !== lock) {
        if (lock) document.documentElement.dataset.hdrLock = lock
        else delete document.documentElement.dataset.hdrLock
      }
      // While the stage is off screen there is nothing to paint.
      if (r.bottom > 0) { draw(); unpackAround(Math.round(frameAt())) }
    }
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(apply) }

    const onResize = () => { size(); onScroll() }

    let cancelled = false
    const order = loadOrder(FRAMES)
    const store = (i) => {
      // Redraw only if this frame belongs on screen right now.
      if (!drawnExact || Math.abs(i - frameAt()) < 2) { dirty = true; onScroll() }
    }
    const unpack = (i) => {
      if (frames[i] || pending.has(i) || !blobs[i] || decoding >= 3) return
      pending.add(i); decoding++
      createImageBitmap(blobs[i])
        .then((bm) => { if (cancelled) { bm.close(); return } frames[i] = bm; store(i) })
        .catch(() => {})
        .finally(() => { pending.delete(i); decoding--; if (!cancelled) unpackAround(Math.round(frameAt())) })
    }
    // Keep a window of unpacked frames around the scroll position, nearest
    // first, and let go of the rest.
    const unpackAround = (c) => {
      for (let d = 0; d <= WIN; d++) { unpack(c + d); unpack(c - d) }
      for (let i = 0; i < FRAMES; i++) {
        if (frames[i] && !pinned(i) && Math.abs(i - c) > WIN + 6) { frames[i].close(); frames[i] = null }
      }
    }
    const loadNext = (k) => {
      if (cancelled || k >= order.length) return
      const i = order[k]
      fetch(frameSrc(set, i))
        .then((res) => (res.ok ? res.blob() : null))
        .then((b) => {
          if (cancelled || !b) return
          blobs[i] = b
          if (pinned(i) || Math.abs(i - frameAt()) <= WIN) unpack(i)
        })
        .catch(() => {})
        .finally(() => loadNext(k + 4))
    }
    // Four requests in flight at a time.
    for (let k = 0; k < 4; k++) loadNext(k)
    // The coarse fallback frames are unpacked as their files land; top up
    // any that were skipped while the decoder was busy.
    const topUp = setInterval(() => {
      if (cancelled) return
      for (let i = 0; i < FRAMES; i += KEEP) unpack(i)
      unpack(FRAMES - 1)
      if (blobs.every(Boolean) && frames.filter((f, i) => f && pinned(i)).length >= Math.ceil(FRAMES / KEEP)) clearInterval(topUp)
    }, 400)

    size(); apply()

    /* The header logo (Nav.jsx) brings people straight to the finished hero
       instead of the intro: /#hero from another page, or the 'bw:hero' event
       when they are already here. The jump is instant, not a scroll back
       through the clip. Lenis is created after this effect, so wait a frame. */
    const toFinal = () => {
      const run = section.offsetHeight - window.innerHeight
      const y = section.getBoundingClientRect().top + window.scrollY + run * 0.97
      if (window.__lenis) window.__lenis.scrollTo(y, { immediate: true, force: true })
      else window.scrollTo(0, y)
    }
    if (window.location.hash === '#hero') {
      window.history.replaceState(null, '', window.location.pathname + window.location.search)
      requestAnimationFrame(() => requestAnimationFrame(toFinal))
    }
    window.addEventListener('bw:hero', toFinal)
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onResize)
    return () => {
      cancelled = true
      clearInterval(topUp)
      frames.forEach((f) => f && f.close())
      delete document.documentElement.dataset.hdrLock
      if (raf) cancelAnimationFrame(raf)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onResize)
      window.removeEventListener('bw:hero', toFinal)
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

        /* ---- Final hero, laid out after the Sonar reference (Nov 24 2026) ---- */
        .hl { position:absolute; inset:0; visibility:hidden; }
        .sd { color:#fff; font-family:'Inter',system-ui,sans-serif; --pad:clamp(1.25rem,3.6vw,3.5rem); }
        .sd [data-rise] { opacity:0; will-change:transform, opacity; }
        .sd-layer { position:absolute; inset:0; will-change:transform; pointer-events:none; }
        .sd-layer a, .sd-layer button { pointer-events:auto; }
        .hx-fade { position:absolute; left:0; right:0; bottom:0; height:35%; pointer-events:none; opacity:0;
          background:linear-gradient(to bottom, rgba(8,8,8,0) 0%, #080808 100%); }
        .sd p { margin:0; }
        .hx-fg { position:absolute; inset:0; width:100%; height:100%; object-fit:cover; pointer-events:none; opacity:0;
          will-change:transform, opacity; }

        /* The word behind the hills: its foot sits at --sn-foot (set from the ridge). */
        .sn-word { position:absolute; left:0; right:0; top:calc(var(--sn-foot, 44vh) - .74em); text-align:center;
          font-weight:400; text-transform:uppercase; white-space:nowrap; line-height:1;
          font-size:min(13.4vw, 30vh); letter-spacing:-.02em;
          background:linear-gradient(180deg, rgba(255,255,255,.9) 0%, rgba(255,255,255,.42) 75%);
          -webkit-background-clip:text; background-clip:text; color:transparent; }
        .sn-word span { display:inline; }

        .sn-scrim { position:absolute; inset:0; pointer-events:none;
          background:radial-gradient(ellipse 55% 50% at 18% 82%, rgba(4,5,8,.62), rgba(4,5,8,0) 70%),
                     radial-gradient(ellipse 30% 40% at 88% 82%, rgba(4,5,8,.5), rgba(4,5,8,0) 70%); }
        .sn-left { position:absolute; left:var(--pad); bottom:clamp(1.75rem,6vh,3.5rem); max-width:62vw; }
        .sn-proof { display:inline-flex; align-items:center; gap:.7rem; padding:6px 14px 6px 6px; border-radius:999px;
          background:rgba(20,22,26,.55); border:1px solid rgba(255,255,255,.14);
          -webkit-backdrop-filter:blur(12px); backdrop-filter:blur(12px); margin-bottom:clamp(1rem,2.4vh,1.6rem); }
        .sn-faces { display:flex; }
        .sn-faces span { width:30px; height:30px; border-radius:50%; background:#0b0b0b; border:2px solid rgba(255,255,255,.9);
          display:grid; place-items:center; overflow:hidden; margin-left:-9px; }
        .sn-faces span:first-child { margin-left:0; }
        .sn-faces img { width:70%; height:70%; object-fit:contain; filter:brightness(0) invert(1); }
        .sn-proof b { display:block; font-size:.8rem; font-weight:600; line-height:1.1; }
        .sn-proof small { display:block; font-size:.66rem; opacity:.72; line-height:1.2; }
        .sn-h1 { font-family:'Inter',system-ui,sans-serif; font-weight:500; font-size:clamp(2rem,3.9vw,4.2rem); white-space:nowrap;
          line-height:1; letter-spacing:-.035em; margin:0; }
        .sn-h1 em { font-family:'Playfair Display',serif; font-style:italic; font-weight:500; letter-spacing:-.01em; }
        .sn-sub { font-size:clamp(.92rem,1.05vw,1.05rem); line-height:1.55; color:rgba(255,255,255,.78);
          max-width:44ch; margin-top:clamp(.9rem,2vh,1.3rem) !important; }
        .sn-btn { margin-top:clamp(1.2rem,3vh,1.8rem); display:inline-flex; align-items:center; gap:.7rem;
          height:clamp(44px,3.6vw,52px); padding:0 6px 0 clamp(1.2rem,1.8vw,1.6rem); border-radius:14px; border:0;
          background:#fff; color:#0b0b0b; font:inherit; font-size:.9rem; font-weight:500; cursor:pointer;
          transition:transform .3s cubic-bezier(.22,1,.36,1); }
        .sn-btn i { display:grid; place-items:center; width:clamp(32px,2.6vw,40px); height:clamp(32px,2.6vw,40px);
          border-radius:10px; background:#0b0b0b; color:#fff; }
        .sn-btn:hover { transform:translateY(-2px); }
        .sn-btn:focus-visible { outline:2px solid #fff; outline-offset:3px; }

        .sn-right { position:absolute; right:var(--pad); bottom:clamp(1.75rem,6vh,3.5rem); display:flex; flex-direction:column;
          align-items:flex-end; gap:clamp(1rem,3vh,1.75rem); }
        .sn-cards { display:flex; gap:12px; }
        .sn-card { margin:0; width:clamp(190px,15vw,250px); border-radius:18px; padding:8px; overflow:hidden;
          background:rgba(16,18,22,.38); border:1px solid rgba(255,255,255,.18);
          -webkit-backdrop-filter:blur(14px); backdrop-filter:blur(14px); }
        .sn-card img { display:block; width:100%; height:auto; aspect-ratio:3/2; object-fit:cover; border-radius:11px; background:#fff; }
        .sn-card figcaption { padding:.7rem .4rem .35rem; }
        .sn-card b { display:block; font-size:clamp(1.15rem,1.5vw,1.45rem); font-weight:500; letter-spacing:-.03em; line-height:1.1; }
        .sn-card span { display:block; font-size:.72rem; line-height:1.35; color:rgba(255,255,255,.75); margin-top:.25rem; }
        .sn-all { font-size:.78rem; color:rgba(255,255,255,.85); text-decoration:none; padding:.3rem .2rem;
          text-shadow:0 1px 12px rgba(0,0,0,.8); transition:color .2s ease; }
        .sn-all:hover, .sn-all:focus-visible { color:#fff; }
        .sn-all span { display:inline-block; transition:transform .25s ease; }
        .sn-all:hover span { transform:translateX(3px); }

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
          /* Phones: BLACK over WATER, the second line's foot behind the hills. */
          .sn-word { font-size:23vw; line-height:.86; top:calc(var(--sn-foot, 40vh) - 1.6em); }
          .sn-word span { display:block; }
          .sn-left { right:var(--pad); max-width:none; bottom:calc(clamp(1.25rem,3vh,2rem) + 232px); }
          .sn-h1 { font-size:7.4vw; white-space:normal; }
          .sn-sub { font-size:.88rem; }
          .sn-right { left:var(--pad); right:var(--pad); bottom:clamp(1.25rem,3vh,2rem); align-items:stretch; }
          .sn-cards { gap:10px; }
          .sn-card { flex:1; width:auto; border-radius:14px; padding:6px;
            -webkit-backdrop-filter:none; backdrop-filter:none; background:rgba(20,22,26,.72); }
          .sn-card figcaption { padding:.5rem .3rem .2rem; }
          .sn-card b { font-size:1.05rem; }
          .sn-card span { font-size:.66rem; }
          .sn-all { align-self:flex-end; }
          .sn-proof { -webkit-backdrop-filter:none; backdrop-filter:none; background:rgba(20,22,26,.7); }
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
            <p className="hx-num">{b.num}</p>
            <h2>{b.title}</h2>
            <p>{b.line}</p>
          </div>
        ))}

        <p ref={cueRef} className="hx-cue" aria-hidden="true">Scroll to explore</p>
        <button ref={skipRef} type="button" className="hx-skip" onClick={skip}>Skip intro ↓</button>

        {/* Final hero, laid out after the Sonar reference Jack sent (Nov 24
            2026). Every [data-rise] piece slides up on its own beat; the land
            image (.hx-fg) sits over the big word so the hills hide its foot. */}
        <div ref={revealRef} className="hl sd">
          <div className="sd-layer" data-layer="2">
            <p className="sn-word" data-rise aria-hidden="true"><span>Black</span><span>Water</span></p>
          </div>
          <img ref={fgRef} className="hx-fg" alt="" aria-hidden="true" decoding="async" />
          <div className="sd-layer" data-layer="4">
            {/* Soft dark pools behind the copy, so it reads over the lit shoreline. */}
            <div className="sn-scrim" aria-hidden="true" />
            <div className="sn-left">
              <div className="sn-proof" data-rise>
                <div className="sn-faces" aria-hidden="true">
                  {['/client-logos/logo-beloved.png', '/client-logos/logo-rpr.png', '/client-logos/logo-dabv.svg'].map((src) => (
                    <span key={src}><img src={src} alt="" decoding="async" /></span>
                  ))}
                </div>
                <div><b>Brands we grow</b><small>ads, websites and more</small></div>
              </div>
              <h1 className="sn-h1" data-rise>
                Scaling E-commerce Brands<br />With Data, Not <em>Guesswork</em>
              </h1>
              <p className="sn-sub" data-rise>
                We run your ads, make the videos, fix the pages, and emails behind them. One team, start to finish.
              </p>
              <button type="button" className="sn-btn" data-rise onClick={openApply}>
                Apply now
                <i aria-hidden="true">
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M4 10L10 4M5 4h5v5" /></svg>
                </i>
              </button>
            </div>

            <div className="sn-right">
              <div className="sn-cards">
                {HERO_PROOF.map((r) => (
                  <figure key={r.metric} className="sn-card" data-rise>
                    <img src={r.img} alt={`${r.metric}, ${r.detail}`} width="600" height="400" decoding="async" />
                    <figcaption><b>{r.metric}</b><span>{r.detail}</span></figcaption>
                  </figure>
                ))}
              </div>
              <a className="sn-all" href="/results/" data-rise>See all results <span aria-hidden="true">→</span></a>
            </div>
          </div>
        </div>
        <div ref={fadeRef} className="hx-fade" aria-hidden="true" />
      </div>
    </section>
  )
}
