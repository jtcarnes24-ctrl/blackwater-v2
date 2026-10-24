import { useEffect, useRef, useState } from 'react'
import Lanyard from './ui/Lanyard/Lanyard'

/* Homepage founder section (Oct 23 2026): Jack's ID card hangs from a
   lanyard you can grab, swing and flip (React Bits "Lanyard").

   The card faces and the strap are drawn here at load, on canvases, in the
   site's own fonts, then handed to the lanyard as images. Building them in
   the browser keeps the type identical to the rest of the page and means
   there is no artwork file to keep in sync with the copy.

   The /about page keeps the older scroll-reveal FounderSection. */

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

// Face size matches the lanyard's portrait card (1.6 x 2.25) at its 1024px texture width.
const W = 1024
const H = 1440
const INK = '#0b0b0b'

const load = (src) => new Promise((resolve) => {
  const im = new Image()
  im.onload = () => resolve(im)
  im.onerror = () => resolve(null)
  im.src = src
})

// The mark ships as a black alpha cut-out; this tints it any colour.
function tintedMark(mark, color, w) {
  const h = Math.round(w * mark.height / mark.width)
  const c = document.createElement('canvas')
  c.width = w; c.height = h
  const x = c.getContext('2d')
  x.drawImage(mark, 0, 0, w, h)
  x.globalCompositeOperation = 'source-in'
  x.fillStyle = color
  x.fillRect(0, 0, w, h)
  return c
}

function spaced(ctx, text, x, y, spacing) {
  // Canvas letterSpacing is not in every browser yet, so lay it out by hand.
  let cx = x
  for (const ch of text) { ctx.fillText(ch, cx, y); cx += ctx.measureText(ch).width + spacing }
  return cx
}

async function buildArt() {
  await Promise.all([
    document.fonts.load("700 96px 'Syne'"),
    document.fonts.load("italic 500 60px 'Playfair Display'"),
    document.fonts.load("600 26px 'Space Grotesk'"),
  ]).catch(() => {})
  const [photo, mark] = await Promise.all([load('/founder/jack-card.webp'), load('/brand/mark.png')])

  // ---- Front: portrait on its own white backdrop, name panel below.
  const f = document.createElement('canvas'); f.width = W; f.height = H
  const fx = f.getContext('2d')
  fx.fillStyle = '#ffffff'; fx.fillRect(0, 0, W, H)
  if (photo) {
    // Photo is square; fill the width and sit the face in the upper card,
    // clear of the lanyard slot near the top edge.
    const s = W / photo.width
    fx.drawImage(photo, 0, 40, W, photo.height * s)
  }
  const panel = 1010
  fx.fillStyle = INK; fx.fillRect(0, panel, W, H - panel)
  if (mark) fx.drawImage(tintedMark(mark, '#ffffff', 46), 72, panel + 62)
  fx.fillStyle = 'rgba(255,255,255,.6)'
  fx.font = "600 24px 'Space Grotesk'"
  spaced(fx, 'BLACKWATER MARKETING', 136, panel + 96, 4.5)
  fx.fillStyle = '#ffffff'
  fx.font = "700 104px 'Syne'"
  fx.fillText('JACK CARNES', 66, panel + 238)
  fx.font = "italic 500 64px 'Playfair Display'"
  fx.fillText('Founder', 72, panel + 318)
  fx.fillStyle = 'rgba(255,255,255,.45)'
  fx.font = "600 22px 'Space Grotesk'"
  spaced(fx, 'BLACKWATERMRKTING.COM', 72, H - 56, 4)

  // ---- Back: the mark and wordmark on black.
  const b = document.createElement('canvas'); b.width = W; b.height = H
  const bx = b.getContext('2d')
  bx.fillStyle = INK; bx.fillRect(0, 0, W, H)
  if (mark) {
    const m = tintedMark(mark, '#ffffff', 300)
    bx.drawImage(m, (W - m.width) / 2, 520)
  }
  bx.fillStyle = '#ffffff'
  bx.font = "italic 500 88px 'Playfair Display'"
  bx.textAlign = 'center'
  bx.fillText('BlackWater', W / 2, 960)
  bx.textAlign = 'left'
  bx.fillStyle = 'rgba(255,255,255,.45)'
  bx.font = "600 22px 'Space Grotesk'"
  const label = 'BLACKWATERMRKTING.COM'
  const lw = spaced(bx, label, 0, -100, 4)  // measure off-canvas
  spaced(bx, label, (W - lw) / 2, H - 56, 4)

  // ---- Strap: runs lengthwise, so the art is a long horizontal strip.
  const st = document.createElement('canvas'); st.width = 2400; st.height = 192
  const sx = st.getContext('2d')
  sx.fillStyle = INK; sx.fillRect(0, 0, st.width, st.height)
  sx.fillStyle = '#ffffff'
  sx.font = "700 64px 'Syne'"
  sx.textBaseline = 'middle'
  const unit = 600
  for (let i = 0; i < st.width / unit; i++) {
    const x0 = i * unit + 40
    if (mark) sx.drawImage(tintedMark(mark, '#ffffff', 64), x0, 66)
    spaced(sx, 'BLACKWATER', x0 + 92, 100, 3)
  }

  // toBlob encodes off the main thread; toDataURL did it inline and froze
  // the page for a moment on phones. Still handed over as data: URLs because
  // the site's security policy allows data: images but not blob: ones.
  const encode = (c) => new Promise((resolve) => c.toBlob((blob) => {
    const r = new FileReader()
    r.onload = () => resolve(r.result)
    r.readAsDataURL(blob)
  }, 'image/jpeg', 0.92))
  const [front, back, strap] = await Promise.all([encode(f), encode(b), encode(st)])
  return { front, back, strap }
}

export function FounderLanyard() {
  const [art, setArt] = useState(null)
  const ref = useRef(null)
  // Phones: lower render density, and no breeze, so the card settles and the
  // lanyard stops rendering instead of animating for as long as it is on screen.
  const [lite] = useState(() => typeof window !== 'undefined'
    && window.matchMedia('(max-width: 899px), (hover: none)').matches)

  // Building the card art and starting the 3D scene is one heavy burst of
  // work. At page load it landed on top of the hero; started only on
  // approach, it landed mid-scroll (a measured ~150ms hitch at phone speed).
  // So it runs in the background a few seconds after the page settles, in
  // two idle slices, or straight away if someone gets close before that.
  useEffect(() => {
    const el = ref.current
    if (!el) return
    let on = true, started = false, timer = 0
    const idle = (fn) => (window.requestIdleCallback
      ? window.requestIdleCallback(fn, { timeout: 2000 })
      : setTimeout(fn, 1))
    const start = () => {
      if (started) return
      started = true
      io.disconnect(); clearTimeout(timer)
      buildArt().then((a) => idle(() => { if (on) setArt(a) }))
    }
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) start() }, { rootMargin: '150% 0px' })
    io.observe(el)
    const afterLoad = () => { timer = setTimeout(() => idle(start), 3500) }
    if (document.documentElement.classList.contains('site-ready')) afterLoad()
    else {
      const mo = new MutationObserver(() => {
        if (document.documentElement.classList.contains('site-ready')) { mo.disconnect(); afterLoad() }
      })
      mo.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })
    }
    return () => { on = false; io.disconnect(); clearTimeout(timer) }
  }, [])

  return (
    <section ref={ref} id="founder" className="fl" aria-labelledby="fl-title">
      <style>{`
        .fl { background:#080808; color:#fff; position:relative; overflow:hidden;
              display:grid; grid-template-columns:minmax(0,1fr) minmax(0,1fr); align-items:center;
              min-height:100svh; padding:0 clamp(1.5rem,6vw,6rem); gap:clamp(1rem,4vw,4rem); }
        .fl-copy { max-width:56ch; padding:clamp(5rem,10vw,8rem) 0; }
        .fl-eyebrow { font-family:'Space Grotesk',sans-serif; font-size:.66rem; letter-spacing:.22em;
                      text-transform:uppercase; font-weight:700; color:rgba(255,255,255,.5); margin:0 0 1.1rem; }
        .fl-h { font-family:'Syne',sans-serif; font-weight:700; text-transform:uppercase;
                font-size:clamp(1.9rem,4.2vw,3.6rem); line-height:.98; letter-spacing:-.03em; margin:0 0 1.75rem; }
        .fl-h em { display:block; font-family:'Playfair Display',serif; font-style:italic; font-weight:500;
                   text-transform:none; letter-spacing:-.01em; }
        .fl-p { font-family:'Space Grotesk',sans-serif; font-size:clamp(.98rem,1.2vw,1.08rem); line-height:1.75;
                color:rgba(255,255,255,.72); margin:0 0 1.25rem; }
        .fl-sig { font-family:'Space Grotesk',sans-serif; font-size:.72rem; letter-spacing:.14em; text-transform:uppercase;
                  font-weight:600; color:rgba(255,255,255,.5); margin:2rem 0 0; }
        .fl-stage { position:relative; height:100svh; min-height:640px; }
        .fl-hint { position:absolute; bottom:clamp(1.25rem,4vh,2.5rem); left:0; right:0; text-align:center; margin:0;
                   font-family:'Space Grotesk',sans-serif; font-size:.6rem; letter-spacing:.28em; text-transform:uppercase;
                   color:rgba(255,255,255,.4); pointer-events:none; }
        @media (max-width:899px) {
          .fl { grid-template-columns:1fr; min-height:0; }
          .fl-stage { order:-1; height:min(80svh, 640px); min-height:0; margin:0 calc(-1 * clamp(1.5rem,6vw,6rem)); }
          .fl-copy { padding:0 0 clamp(4rem,10vw,6rem); }
        }
      `}</style>

      <div className="fl-copy">
        <p className="fl-eyebrow">The Founder</p>
        <h2 id="fl-title" className="fl-h">Built on real <em>accounts.</em></h2>
        {PARAS.map((p, i) => <p key={i} className="fl-p">{p.replace(/\s+/g, ' ').trim()}</p>)}
        <p className="fl-sig">Jack Carnes, Founder, BlackWater Marketing</p>
      </div>

      <div className="fl-stage">
        {art && (
          <Lanyard
            frontImage={art.front}
            backImage={art.back}
            strapImage={art.strap}
            strapColor={INK}
            cardColor="#ffffff"
            finish="glossy"
            size={0.62}
            strapLength={0.42}
            metal="silver"
            breeze={lite ? 0 : 0.5}
            maxPixelRatio={lite ? 1.5 : 2}
          />
        )}
        <p className="fl-hint" aria-hidden="true">Grab the card · tap to flip</p>
      </div>
    </section>
  )
}
