import { useEffect, useRef, useState } from 'react'
import { RESULTS } from '../../lib/results'

/* /results/ hero (Oct 24 2026): "the waterline".

   A dark water surface rises across the screen like a growth curve, and the
   verified results ride on it as markers. Moving across it pushes ripples
   through the surface (a row of springs, the classic 1D water model); a click
   or tap drops a splash. One result at a time opens its detail card, cycling
   on its own until the visitor hovers or taps one.

   No video and no images: one canvas for the water, seven small buttons for
   the markers, all written straight to the DOM each frame so nothing in
   React re-renders while it moves. It sleeps when scrolled out of view. */

// Left to right, so the strongest numbers sit where the curve is highest.
const ORDER = ['$5,440/day', '$7,659/day', '$8,236/day', '$51K month', '7.38x ROAS', '12.56x ROAS', '12.97x ROAS']
const POINTS = ORDER.map((m) => RESULTS.find((r) => r.metric === m)).filter(Boolean)
const SLOTS = [0.1, 0.23, 0.36, 0.49, 0.62, 0.75, 0.88]

const COLS = 140          // springs across the width
const TENSION = 0.022
const DAMPING = 0.028
const SPREAD = 0.24

export function ResultsHero({ title, emph, sub }) {
  const rootRef = useRef(null)
  const canvasRef = useRef(null)
  const markRefs = useRef([])
  const [active, setActive] = useState(POINTS.length - 1)
  const held = useRef(false)

  // Cycle the open card until someone takes over.
  useEffect(() => {
    const id = setInterval(() => {
      if (!held.current) setActive((a) => (a + 1) % POINTS.length)
    }, 3200)
    return () => clearInterval(id)
  }, [])

  useEffect(() => {
    const root = rootRef.current, canvas = canvasRef.current
    if (!root || !canvas) return
    const ctx = canvas.getContext('2d')
    const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const phone = window.matchMedia('(max-width: 767px)').matches
    const dpr = Math.min(window.devicePixelRatio || 1, phone ? 1.5 : 2)

    let W = 0, H = 0
    const h = new Float32Array(COLS + 1)   // displacement from rest
    const v = new Float32Array(COLS + 1)   // velocity
    const drops = []                        // splash spray
    let t = 0, raf = 0, visible = true, lastPtr = null

    const size = () => {
      const r = root.getBoundingClientRect()
      W = r.width; H = r.height
      canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr)
      canvas.style.width = W + 'px'; canvas.style.height = H + 'px'
    }

    // Rest line: a growth curve, low on the left and lifting to the right,
    // kept under the headline on every screen.
    const rest = (x) => {
      const k = x / W
      const lo = phone ? 0.86 : 0.84, hi = phone ? 0.6 : 0.42
      return H * (lo - (lo - hi) * (k * k * (3 - 2 * k)) * (0.35 + 0.65 * k))
    }
    const swell = (x) => still ? 0 : 5 * Math.sin(x * 0.011 + t * 0.9) + 2.5 * Math.sin(x * 0.027 - t * 1.3)
    const surface = (x) => {
      const f = Math.max(0, Math.min(COLS, (x / W) * COLS))
      const i = Math.floor(f), d = f - i
      const disp = h[i] * (1 - d) + h[Math.min(COLS, i + 1)] * d
      return rest(x) + swell(x) + disp
    }

    const push = (x, amount) => {
      const i = Math.round((x / W) * COLS)
      for (let k = -2; k <= 2; k++) {
        const j = i + k
        if (j >= 0 && j <= COLS) v[j] += amount * (1 - Math.abs(k) * 0.3)
      }
    }

    const step = () => {
      for (let i = 0; i <= COLS; i++) {
        v[i] += -TENSION * h[i] - DAMPING * v[i]
        h[i] += v[i]
      }
      // Two passes of neighbour pull carry the ripple outward.
      for (let pass = 0; pass < 2; pass++) {
        for (let i = 0; i <= COLS; i++) {
          if (i > 0) { const d = SPREAD * (h[i] - h[i - 1]); v[i - 1] += d }
          if (i < COLS) { const d = SPREAD * (h[i] - h[i + 1]); v[i + 1] += d }
        }
      }
      for (let n = drops.length - 1; n >= 0; n--) {
        const p = drops[n]
        p.vy += 0.32; p.x += p.vx; p.y += p.vy; p.life -= 1
        if (p.life <= 0 || p.y > surface(p.x) + 2) drops.splice(n, 1)
      }
    }

    const draw = () => {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      ctx.clearRect(0, 0, W, H)

      // Faint chart grid behind everything.
      ctx.strokeStyle = 'rgba(255,255,255,.045)'
      ctx.lineWidth = 1
      ctx.beginPath()
      for (let g = 1; g < 10; g++) { const x = Math.round((W * g) / 10) + 0.5; ctx.moveTo(x, H * 0.18); ctx.lineTo(x, H) }
      ctx.stroke()

      const seg = Math.max(4, W / 220)
      const path = () => {
        ctx.beginPath()
        ctx.moveTo(0, surface(0))
        for (let x = seg; x < W + seg; x += seg) ctx.lineTo(Math.min(x, W), surface(Math.min(x, W)))
      }

      // Body of the water: deep navy just under the surface, black below.
      path()
      ctx.lineTo(W, H); ctx.lineTo(0, H); ctx.closePath()
      const g = ctx.createLinearGradient(0, H * 0.4, 0, H)
      g.addColorStop(0, 'rgba(10,31,68,.55)')
      g.addColorStop(1, 'rgba(8,8,8,1)')
      ctx.fillStyle = g
      ctx.fill()

      // Depth lines that echo the surface.
      for (let d = 1; d <= 3; d++) {
        ctx.beginPath()
        for (let x = 0; x <= W; x += seg) {
          const y = surface(x) + d * 26 + Math.sin(x * 0.02 + t * 0.7 + d) * 2
          if (x === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y)
        }
        ctx.strokeStyle = `rgba(255,255,255,${0.09 / d})`
        ctx.stroke()
      }

      // The waterline itself.
      path()
      ctx.strokeStyle = 'rgba(255,255,255,.92)'
      ctx.lineWidth = 1.6
      ctx.stroke()

      ctx.fillStyle = 'rgba(255,255,255,.85)'
      for (const p of drops) { ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2); ctx.fill() }

      // Markers ride the surface.
      markRefs.current.forEach((el, n) => {
        if (!el) return
        const x = SLOTS[n] * W
        el.style.transform = `translate3d(${x}px,${surface(x)}px,0)`
      })
    }

    const frame = () => {
      raf = 0
      if (!visible) return
      t += 1 / 60
      step(); draw()
      raf = requestAnimationFrame(frame)
    }

    const onMove = (e) => {
      const r = root.getBoundingClientRect()
      const x = e.clientX - r.left, y = e.clientY - r.top
      if (lastPtr) {
        const dx = x - lastPtr.x, dy = y - lastPtr.y
        // Only motion near the waterline disturbs it.
        if (Math.abs(y - surface(x)) < 140) push(x, Math.max(-6, Math.min(6, (dy + Math.abs(dx) * 0.35) * 0.18)))
      }
      lastPtr = { x, y }
    }
    const onLeave = () => { lastPtr = null }
    const onDown = (e) => {
      if (e.target.closest('.rh-pt, a, button')) return
      const r = root.getBoundingClientRect()
      const x = e.clientX - r.left
      push(x, 14)
      if (still) return
      const y = surface(x)
      for (let n = 0; n < 14; n++) {
        drops.push({ x, y, vx: (Math.random() - 0.5) * 5, vy: -3 - Math.random() * 6, r: 0.8 + Math.random() * 1.6, life: 70 })
      }
    }

    size()
    // A small opening swell so the surface reads as water straight away.
    if (!still) { push(W * 0.62, 10); push(W * 0.2, -6) }
    draw()

    const io = new IntersectionObserver(([en]) => {
      visible = en.isIntersecting
      if (visible && !raf && !still) raf = requestAnimationFrame(frame)
    })
    io.observe(root)
    const ro = new ResizeObserver(() => { size(); draw() })
    ro.observe(root)
    root.addEventListener('pointermove', onMove, { passive: true })
    root.addEventListener('pointerleave', onLeave)
    root.addEventListener('pointerdown', onDown)
    if (!still) raf = requestAnimationFrame(frame)

    return () => {
      if (raf) cancelAnimationFrame(raf)
      io.disconnect(); ro.disconnect()
      root.removeEventListener('pointermove', onMove)
      root.removeEventListener('pointerleave', onLeave)
      root.removeEventListener('pointerdown', onDown)
    }
  }, [])

  return (
    <section ref={rootRef} className="rh" aria-label={`${title} ${emph}`}>
      <style>{`
        .rh { position:relative; height:100svh; min-height:640px; overflow:hidden; background:#080808;
              touch-action:pan-y; user-select:none; -webkit-user-select:none; }
        .rh canvas { position:absolute; inset:0; display:block; }
        .rh-copy { position:relative; z-index:2; max-width:1240px; margin:0 auto; pointer-events:none;
                   padding: clamp(7rem,12vw,9rem) clamp(1.5rem,5vw,4rem) 0; }
        .rh-kicker { font-family:'Space Grotesk',sans-serif; font-size:.7rem; font-weight:600;
                     letter-spacing:.3em; text-transform:uppercase; color:rgba(255,255,255,.6); margin:0 0 1.5rem; }
        .rh-title { font-family:'Syne',sans-serif; font-weight:800; text-transform:uppercase;
                    font-size:clamp(2.6rem,8vw,7rem); line-height:.95; letter-spacing:-.035em;
                    color:#ffffff; margin:0; max-width:14ch; }
        .rh-sub { font-family:'Space Grotesk',sans-serif; font-size:clamp(1rem,1.5vw,1.15rem);
                  line-height:1.65; color:rgba(255,255,255,.75); margin:2rem 0 0; max-width:42ch; }

        .rh-pts { position:absolute; inset:0; z-index:3; pointer-events:none; }
        .rh-pt { position:absolute; left:0; top:0; width:0; height:0; padding:0; border:0; background:none;
                 pointer-events:auto; cursor:pointer; color:#fff; will-change:transform; }
        .rh-pt.on { z-index:2; }
        .rh-dot { position:absolute; left:-6px; top:-6px; width:12px; height:12px; border-radius:50%;
                  background:#080808; border:1.5px solid #fff; transition:background .25s ease, transform .25s ease; }
        .rh-pt.on .rh-dot, .rh-pt:hover .rh-dot { background:#fff; transform:scale(1.25); }
        .rh-pt::after { content:''; position:absolute; left:-22px; top:-22px; width:44px; height:44px; }
        .rh-tag { position:absolute; left:0; bottom:16px; transform:translateX(-50%); white-space:nowrap;
                  font-family:'Space Grotesk',sans-serif; font-size:.66rem; font-weight:600; letter-spacing:.14em;
                  text-transform:uppercase; color:rgba(255,255,255,.62); transition:opacity .25s ease; }
        .rh-pt.on .rh-tag { opacity:0; }
        .rh-card { position:absolute; left:0; bottom:22px; transform:translate(-50%, 8px); opacity:0;
                   pointer-events:none; text-align:left; white-space:nowrap;
                   background:#fff; color:#0b0b0b; border-radius:14px; padding:.85rem 1.05rem .9rem;
                   box-shadow:0 18px 40px rgba(0,0,0,.45);
                   transition:opacity .35s ease, transform .45s cubic-bezier(.22,1,.36,1); }
        .rh-pt.on .rh-card { opacity:1; transform:translate(-50%, 0); }
        .rh-pt.edge-l .rh-card { transform:translate(-18%, 8px); }
        .rh-pt.edge-l.on .rh-card { transform:translate(-18%, 0); }
        .rh-pt.edge-r .rh-card { transform:translate(-82%, 8px); }
        .rh-pt.edge-r.on .rh-card { transform:translate(-82%, 0); }
        .rh-card b { display:block; font-family:'Syne',sans-serif; font-weight:800; font-size:1.35rem;
                     letter-spacing:-.02em; text-transform:uppercase; line-height:1; }
        .rh-card span { display:block; margin-top:.4rem; font-family:'Space Grotesk',sans-serif;
                        font-size:.8rem; color:rgba(11,11,11,.66); }
        .rh-hint { position:absolute; z-index:3; left:0; right:0; bottom:clamp(1.25rem,4vh,2.25rem); margin:0;
                   text-align:center; pointer-events:none; font-family:'Space Grotesk',sans-serif; font-size:.6rem;
                   letter-spacing:.28em; text-transform:uppercase; color:rgba(255,255,255,.6); }
        .rh-hint-m { display:none; }
        @media (max-width:767px) {
          .rh-hint-d { display:none; }
          .rh-hint-m { display:inline; }
          .rh-tag { display:none; }
          .rh-card b { font-size:1.1rem; }
          .rh-card span { font-size:.74rem; }
        }
      `}</style>

      <canvas ref={canvasRef} aria-hidden="true" />

      <div className="rh-copy">
        <p className="rh-kicker">Client results</p>
        <h1 className="rh-title">{title} <span className="emph">{emph}</span></h1>
        {sub && <p className="rh-sub">{sub}</p>}
      </div>

      <div className="rh-pts">
        {POINTS.map((p, n) => (
          <button
            key={p.metric}
            type="button"
            ref={(el) => { markRefs.current[n] = el }}
            className={`rh-pt${n === active ? ' on' : ''}${n === 0 ? ' edge-l' : ''}${n === POINTS.length - 1 ? ' edge-r' : ''}`}
            aria-label={`${p.metric}, ${p.detail}`}
            aria-pressed={n === active}
            onPointerEnter={() => { held.current = true; setActive(n) }}
            onPointerLeave={() => { held.current = false }}
            onFocus={() => { held.current = true; setActive(n) }}
            onBlur={() => { held.current = false }}
            onClick={() => { held.current = true; setActive(n) }}
          >
            <i className="rh-dot" />
            <span className="rh-tag">{p.metric}</span>
            <span className="rh-card" aria-hidden="true"><b>{p.metric}</b><span>{p.detail}</span></span>
          </button>
        ))}
      </div>

      <p className="rh-hint" aria-hidden="true"><span className="rh-hint-d">Move across the water · tap a point</span><span className="rh-hint-m">Tap the water · tap a point</span></p>
    </section>
  )
}
