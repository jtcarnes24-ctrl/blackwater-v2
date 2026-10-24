import { useEffect, useMemo, useRef, useState } from 'react'
import { animate, motion, motionValue as motionValueOf, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { LiquidButton } from './ui/LiquidButton'
import { useApply } from './ui/ApplyModal'

/**
 * Results, as a scroll-morph ring.
 *
 * Ported from a "scroll morph hero" Jack supplied (Oct 23 2026). When the
 * section comes into view the cards fly in scattered, settle into a line,
 * then close into a ring. Scrolling on morphs the ring into a wide arch
 * along the bottom, and scrolling further shuffles the arch sideways.
 * Hovering a card flips it to show that result's figures.
 *
 * Changed from the source: it captured the mouse wheel inside its own box,
 * which on a full page would trap anyone scrolling over it. Here the
 * section is tall with a pinned stage, and page scroll through it drives
 * the same virtual 0 to 3000 range, so scrolling past works as normal.
 *
 * Smoothness: the source pushed every spring tick through React state,
 * re-rendering all cards each frame and restarting each card's own spring
 * from wherever it was, which is what made it judder. Here nothing
 * re-renders while it moves. Every card's pose is a pure function of four
 * motion values (intro, morph, shuffle, mouse), written straight to that
 * card's transform, so the cards follow one set of springs exactly.
 *
 * Cards are cropped copies in /results-cards/, all 3:2, each framed on
 * the figure that matters (ROAS and spend, or total sales and the chart).
 */

const RESULTS = [
  { metric: '12.97x ROAS', detail: '$88,913 from $6,857 spend',   img: '/results-cards/result-8.webp' },
  { metric: '12.56x ROAS', detail: '$20,663 from $1,644 spend',   img: '/results-cards/result-9.webp' },
  { metric: '7.38x ROAS',  detail: '$5.63 cost per purchase',     img: '/results-cards/result-7.webp' },
  { metric: '$8,236/day',  detail: '193 orders, sales up 578%',   img: '/results-cards/result-1.webp' },
  { metric: '$7,659/day',  detail: '159 orders, 3.04% CVR',       img: '/results-cards/result-2.webp' },
  { metric: '$51K month',  detail: '$51,290, sessions up 77%',    img: '/results-cards/result-3.webp' },
  { metric: '$5,440/day',  detail: 'Sales up 58%',                img: '/results-cards/result-5.webp' },
]

// Each result twice, so the ring and the arch are full.
const CARDS = [...RESULTS, ...RESULTS]
const TOTAL = CARDS.length
const MAX_SCROLL = 3000
const MORPH_END = 600

const lerp = (a, b, t) => a * (1 - t) + b * t

const clamp01 = (v) => Math.min(Math.max(v, 0), 1)
const ease = (t) => 1 - Math.pow(1 - t, 3)

/* Where card i sits. intro runs 0 (scattered) to 1 (line) to 2 (settled),
   morph 0 (ring) to 1 (arch), shuffle 0 to 1 slides the arch along. */
function pose(i, intro, morph, shuffle, mouse, size, scatter) {
  const { width, height } = size
  const isMobile = width < 768
  const minDim = Math.min(width, height)
  const W = isMobile ? 96 : 150

  const line = { x: i * W * 0.55 - (TOTAL * W * 0.55) / 2, y: 0, r: 0, s: 0.7 }

  // Ring
  const circleRadius = Math.min(minDim * 0.36, 360)
  const cDeg = (i / TOTAL) * 360
  const cRad = (cDeg * Math.PI) / 180
  const circle = { x: Math.cos(cRad) * circleRadius, y: Math.sin(cRad) * circleRadius, r: cDeg + 90, s: isMobile ? 0.75 : 1 }

  // Arch along the bottom, apex at the centre
  const arcRadius = Math.min(width, height * 1.5) * (isMobile ? 1.4 : 1.1)
  const apexY = height * (isMobile ? 0.22 : 0.25)
  const spread = isMobile ? 100 : 130
  const step = spread / (TOTAL - 1)
  // Centred shuffle: the arch starts nudged right so the first results
  // lead, and ends nudged left so the last ones are in view. The source
  // swept 0.8 of the spread one way, which with 14 cards carries every
  // card off the left edge.
  const aDeg = -90 - spread / 2 + i * step + (0.5 - shuffle) * spread * 0.5
  const aRad = (aDeg * Math.PI) / 180
  const arc = {
    x: Math.cos(aRad) * arcRadius + mouse,
    y: Math.sin(aRad) * arcRadius + apexY + arcRadius,
    r: aDeg + 90,
    s: isMobile ? 1.4 : 1.8,
  }

  const settled = {
    x: lerp(circle.x, arc.x, morph), y: lerp(circle.y, arc.y, morph),
    r: lerp(circle.r, arc.r, morph), s: lerp(circle.s, arc.s, morph),
  }

  if (intro <= 1) {
    const sc = scatter[i]
    return { x: lerp(sc.x, line.x, intro), y: lerp(sc.y, line.y, intro),
             r: lerp(sc.r, line.r, intro), s: lerp(0.6, line.s, intro), o: intro }
  }
  const t = intro - 1
  return { x: lerp(line.x, settled.x, t), y: lerp(line.y, settled.y, t),
           r: lerp(line.r, settled.r, t), s: lerp(line.s, settled.s, t), o: 1 }
}

function FlipCard({ card, mv, w, h }) {
  return (
    <motion.div
      className="pm-card"
      style={{ width: w, height: h, x: mv.x, y: mv.y, rotate: mv.r, scale: mv.s, opacity: mv.o }}
    >
      <motion.div
        className="pm-flip"
        transition={{ duration: 0.6, type: 'spring', stiffness: 260, damping: 20 }}
        whileHover={{ rotateY: 180 }}
      >
        <div className="pm-face pm-front">
          <img src={card.img} alt="" draggable={false} />
        </div>
        <div className="pm-face pm-back">
          <p className="pm-back-metric">{card.metric}</p>
          <p className="pm-back-detail">{card.detail}</p>
        </div>
      </motion.div>
    </motion.div>
  )
}

export function ProofSection() {
  const { openApply } = useApply()
  const sectionRef = useRef(null)
  const stageRef = useRef(null)
  const intro = useMotionValue(0)
  const [size, setSize] = useState({ width: 0, height: 0 })

  // --- Stage size ---
  useEffect(() => {
    const el = stageRef.current
    if (!el) return
    const ro = new ResizeObserver(([e]) => setSize({ width: e.contentRect.width, height: e.contentRect.height }))
    ro.observe(el)
    setSize({ width: el.offsetWidth, height: el.offsetHeight })
    return () => ro.disconnect()
  }, [])

  // --- Intro plays once, when the section first comes into view ---
  useEffect(() => {
    const el = sectionRef.current
    if (!el) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { intro.set(2); return }
    let run
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return
      io.disconnect()
      // Scatter to line, then line to ring: one continuous value, eased.
      run = animate(intro, [0, 1, 2], { duration: 2.6, delay: 0.2, times: [0, 0.45, 1], ease: [ease, ease] })
    }, { threshold: 0.15 })
    io.observe(el)
    return () => { io.disconnect(); run?.stop() }
  }, [intro])

  // --- Page scroll through the pinned run drives the virtual scroll ---
  const virtualScroll = useMotionValue(0)
  useEffect(() => {
    const section = sectionRef.current
    if (!section) return
    let raf = 0
    const apply = () => {
      raf = 0
      const r = section.getBoundingClientRect()
      const run = r.height - window.innerHeight
      if (run <= 0) return
      const p = Math.min(Math.max(-r.top / run, 0), 1)
      virtualScroll.set(p * MAX_SCROLL)
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
  }, [virtualScroll])

  // Ring to arch over the first stretch, then the arch shuffles.
  const smoothMorph = useSpring(useTransform(virtualScroll, [0, MORPH_END], [0, 1]), { stiffness: 60, damping: 22, restDelta: 0.0005 })
  const smoothShuffle = useSpring(useTransform(virtualScroll, [MORPH_END, MAX_SCROLL], [0, 1]), { stiffness: 60, damping: 22, restDelta: 0.0005 })

  // --- Mouse parallax ---
  const mouseX = useMotionValue(0)
  const smoothMouseX = useSpring(mouseX, { stiffness: 30, damping: 20 })
  useEffect(() => {
    const el = stageRef.current
    if (!el) return
    const onMove = (e) => {
      const r = el.getBoundingClientRect()
      mouseX.set((((e.clientX - r.left) / r.width) * 2 - 1) * 100)
    }
    el.addEventListener('mousemove', onMove)
    return () => el.removeEventListener('mousemove', onMove)
  }, [mouseX])

  const scatter = useMemo(() => CARDS.map(() => ({
    x: (Math.random() - 0.5) * 1500,
    y: (Math.random() - 0.5) * 1000,
    r: (Math.random() - 0.5) * 180,
  })), [])

  // One set of motion values per card, written directly: no re-renders
  // while anything moves.
  const cardMVs = useMemo(() => CARDS.map(() => ({
    x: motionValueOf(0), y: motionValueOf(0), r: motionValueOf(0), s: motionValueOf(0.6), o: motionValueOf(0),
  })), [])
  const introText = useMotionValue(0)
  const sizeRef = useRef(size)
  sizeRef.current = size

  useEffect(() => {
    const update = () => {
      const t = intro.get(), m = smoothMorph.get(), sh = smoothShuffle.get(), px = smoothMouseX.get()
      const sz = sizeRef.current
      for (let i = 0; i < TOTAL; i++) {
        const p = pose(i, t, m, sh, px, sz, scatter)
        const mv = cardMVs[i]
        mv.x.set(p.x); mv.y.set(p.y); mv.r.set(p.r); mv.s.set(p.s); mv.o.set(p.o)
      }
      // Intro copy shows once the ring has closed and fades as it opens.
      introText.set(clamp01((t - 1.6) / 0.4) * clamp01(1 - m * 2))
    }
    update()
    const subs = [intro, smoothMorph, smoothShuffle, smoothMouseX].map((v) => v.on('change', update))
    return () => subs.forEach((u) => u())
  }, [intro, smoothMorph, smoothShuffle, smoothMouseX, cardMVs, scatter, introText, size])

  const introTextY = useTransform(introText, [0, 1], [20, 0])

  const contentOpacity = useTransform(smoothMorph, [0.8, 1], [0, 1])
  const contentY = useTransform(smoothMorph, [0.8, 1], [20, 0])

  const isMobile = size.width < 768
  // Landscape, to match the 3:2 crops. The source's 60x85 portrait cards
  // were too small to read a dashboard on.
  const W = isMobile ? 96 : 150
  const H = isMobile ? 64 : 100

  return (
    <section ref={sectionRef} className="pm" aria-labelledby="pm-title">
      <style>{`
        .pm { background:#080808; color:#fff; position:relative; height:320svh; }
        .pm-stage { position:sticky; top:0; height:100svh; overflow:hidden; }
        .pm-ring { position:absolute; inset:0; display:flex; align-items:center; justify-content:center; }
        .pm-card { position:absolute; transform-style:preserve-3d; perspective:1000px; cursor:pointer; will-change:transform; }
        /* A flipped card lifts above its neighbours so the figures aren't covered. */
        .pm-card:hover { z-index:20; }
        .pm-flip { position:relative; width:100%; height:100%; transform-style:preserve-3d; }
        .pm-face { position:absolute; inset:0; border-radius:10px; overflow:hidden;
                   backface-visibility:hidden; -webkit-backface-visibility:hidden;
                   box-shadow:0 10px 30px rgba(0,0,0,.5); }
        .pm-front { background:#fff; }
        /* Fourteen moving shadows is a lot of painting for a phone. */
        @media (max-width:767px), (hover:none) { .pm-face { box-shadow:none; } }
        .pm-front img { width:100%; height:100%; object-fit:cover; display:block; }
        .pm-back { transform:rotateY(180deg); background:#0d0d0d; border:1px solid rgba(255,255,255,.18);
                   display:flex; flex-direction:column; align-items:center; justify-content:center;
                   text-align:center; padding:6%; container-type:inline-size; }
        .pm-back-metric { font-family:'Syne',sans-serif; font-weight:800; font-size:9cqw; white-space:nowrap;
                          letter-spacing:-.01em; margin:0 0 4cqw; text-transform:uppercase; }
        .pm-back-detail { font-family:'Space Grotesk',sans-serif; font-size:5.6cqw; line-height:1.4;
                          letter-spacing:.06em; text-transform:uppercase; color:rgba(255,255,255,.6); margin:0; }

        .pm-intro { position:absolute; inset:0; z-index:0; display:flex; flex-direction:column;
                    align-items:center; justify-content:center; text-align:center; pointer-events:none;
                    padding:0 1.5rem; }
        .pm-intro h2 { font-family:'Syne',sans-serif; font-weight:800; text-transform:uppercase;
                       font-size:clamp(1.1rem,2.4vw,2rem); letter-spacing:-.03em; line-height:1.05; margin:0; }
        @media (max-width:699px) { .pm-intro h2 { font-size:.85rem; } .pm-hint { font-size:.55rem; } }
        .pm-hint { font-family:'Space Grotesk',sans-serif; font-size:.68rem; font-weight:600;
                   letter-spacing:.22em; text-transform:uppercase; color:rgba(255,255,255,.5); margin:1.1rem 0 0; }

        .pm-content { position:absolute; top:10%; left:0; right:0; z-index:10; display:flex;
                      flex-direction:column; align-items:center; text-align:center;
                      padding:0 1.5rem; pointer-events:none; }
        .pm-eyebrow { font-family:'Space Grotesk',sans-serif; font-size:.68rem; font-weight:600;
                      letter-spacing:.22em; text-transform:uppercase; color:rgba(255,255,255,.5); margin:0 0 1rem; }
        .pm-title { font-family:'Syne',sans-serif; font-weight:800; text-transform:uppercase;
                    font-size:clamp(2rem,5vw,3.8rem); line-height:1; letter-spacing:-.03em; margin:0; }
        .pm-sub { font-family:'Space Grotesk',sans-serif; font-size:clamp(.9rem,1.2vw,1rem); line-height:1.6;
                  color:rgba(255,255,255,.6); max-width:46ch; margin:1rem 0 1.6rem; }
        .pm-cta { pointer-events:auto; }
        .pm-tap { display:none; }
        @media (hover:none) { .pm-hover { display:none; } .pm-tap { display:inline; } }
        .pm-sr { position:absolute; width:1px; height:1px; overflow:hidden; clip:rect(0 0 0 0); white-space:nowrap; }
      `}</style>

      <div ref={stageRef} className="pm-stage">
        {/* Intro text, fades out as the ring opens */}
        <div className="pm-intro">
          <motion.h2 style={{ opacity: introText, y: introTextY }}>
            Real accounts.<br />Real numbers.
          </motion.h2>
          <motion.p className="pm-hint" style={{ opacity: introText }}>
            Scroll to explore
          </motion.p>
        </div>

        {/* Arch content, fades in once the arch has formed */}
        <motion.div className="pm-content" style={{ opacity: contentOpacity, y: contentY }}>
          <p className="pm-eyebrow">Client results</p>
          <h2 id="pm-title" className="pm-title">Real accounts.<br />Real numbers.</h2>
          <p className="pm-sub">Straight from client dashboards. <span className="pm-hover">Hover</span><span className="pm-tap">Tap</span> a result to see the figures.</p>
          <div className="pm-cta">
            <LiquidButton onClick={openApply}>Apply Now →</LiquidButton>
          </div>
        </motion.div>

        <div className="pm-ring">
          {CARDS.map((card, i) => (
            <FlipCard key={i} card={card} mv={cardMVs[i]} w={W} h={H} />
          ))}
        </div>
      </div>

      <ul className="pm-sr">
        {RESULTS.map((r) => <li key={r.img}>{r.metric}: {r.detail}</li>)}
      </ul>
    </section>
  )
}
