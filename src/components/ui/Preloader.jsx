import { useEffect, useRef, useState } from 'react'
import { BrandMark } from './BrandMark'

/* Intro curtain, modelled on cyphercapital.com (Jack's pick, Oct 23 2026).

   On white: the mark arrives alone in black, spinning into place. "Black"
   and "Water" slide out from behind it, set in the site's Playfair italic
   accent rather than Cypher's sans. The curtain goes clear so the page shows
   through, and the mark flies into the header's logo slot while the two
   words ghost out. (Cypher's mark starts silver; Jack wanted plain black.)

   The hero's entrance animations are held until the curtain clears, otherwise
   they play behind it. That gate is the `site-ready` class on <html>, which
   the hero CSS keys off. While this runs, <html> also carries `bw-preloading`,
   which hides the header logo so the flying mark can land in its place. */

const T = { in: 150, open: 1400, reveal: 2250, fly: 2350, done: 3350 }

/* Nov 2 2026, Jack's pick: the mark arrives as a liquid-glass reveal (a drop
   lands, spreads into a glass tile that bends the mark at its rim, then lets
   go), with Black and Water either side. WebGL 2 only; the spin above stays
   as the fallback when it is missing, slow to get ready, or motion is
   reduced. The glass code loads only here, on the homepage. */
const GLASS_WAIT = 900     // ms to get the glass ready before falling back
const G = { open: 450, swap: 80, fly: 120, done: 1100 }

export function Preloader() {
  const [phase, setPhase] = useState('')
  const [gone, setGone] = useState(false)
  const [glass, setGlass] = useState(false)
  const markRef = useRef(null)
  const canvasRef = useRef(null)
  const rowRef = useRef(null)

  useEffect(() => {
    const html = document.documentElement
    const splash = document.getElementById('boot-splash')
    if (splash) splash.remove()

    // Someone who asked for less motion is not made to wait behind a curtain.
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      html.classList.add('site-ready')
      setGone(true)
      return
    }

    html.classList.add('bw-preloading')
    // Lenis owns scrolling, so body overflow does nothing here.
    window.__lenis && window.__lenis.stop()

    const fly = () => {
      const mark = markRef.current
      const target = document.querySelector('.hdr-mark')
      if (!mark || !target) return
      // Measure from the mark's resting place, without any hand-off offset,
      // since the flight transform replaces it.
      const held = mark.style.transform
      mark.style.transition = 'none'
      mark.style.transform = 'none'
      const a = mark.getBoundingClientRect(), b = target.getBoundingClientRect()
      mark.style.transform = held
      void mark.offsetWidth
      mark.style.transition = ''
      const s = b.width / a.width
      const dx = b.left + b.width / 2 - (a.left + a.width / 2)
      const dy = b.top + b.height / 2 - (a.top + a.height / 2)
      mark.style.transform = `translate(${dx}px, ${dy}px) scale(${s})`
      // Land in whatever colour the header is showing over the hero.
      const tone = document.querySelector('.hdr')?.getAttribute('data-tone')
      mark.setAttribute('data-land', tone === 'on-dark' ? 'white' : 'ink')
    }

    const timers = []
    const at = (ms, fn) => timers.push(setTimeout(fn, ms))
    const finish = (from) => {
      at(from, () => {
        setPhase((p) => p + ' reveal')
        html.classList.add('site-ready')
        window.__lenis && window.__lenis.start()
      })
      at(from + 100, fly)
      at(from + 1100, () => { html.classList.remove('bw-preloading'); setGone(true) })
    }
    const classic = () => {
      at(T.in, () => setPhase('in'))
      at(T.open, () => setPhase('in open'))
      finish(T.reveal)
    }

    let player = null, settled = false
    const fallback = () => { if (settled) return; settled = true; classic() }
    const lean = window.matchMedia('(prefers-reduced-transparency: reduce)').matches
    const gl2 = !lean && !!document.createElement('canvas').getContext('webgl2')
    if (!gl2) classic()
    else {
      at(GLASS_WAIT, fallback)
      Promise.all([import('./glass/glassReveal'), new Promise((r) => requestAnimationFrame(r))])
        .then(([mod]) => mod.prepareGlassLogo().then((logo) => [mod, logo]))
        .then(([mod, logo]) => {
          if (settled) return
          settled = true
          setGlass(true)
          // Let React render the canvas, then play.
          requestAnimationFrame(() => {
            const canvas = canvasRef.current, row = rowRef.current
            if (!canvas || !row) { classic(); return }
            // Phones get more margin round the tile so the drop's shadow is not clipped.
            const tile = canvas.clientWidth / (window.innerWidth < 600 ? 1.75 : 1.35)
            try {
              player = mod.playGlass(canvas, logo, {
                tileCss: tile,
                maxDpr: window.matchMedia('(hover: none)').matches ? 1.5 : 2,
                onDone: (box) => {
                  // The real mark takes the bare logo's exact place, then flies.
                  const mark = markRef.current
                  if (mark && box) {
                    const c = canvas.getBoundingClientRect(), m = mark.getBoundingClientRect()
                    const s = box.height / m.height
                    const dx = c.left + box.left + box.width / 2 - (m.left + m.width / 2)
                    const dy = c.top + box.top + box.height / 2 - (m.top + m.height / 2)
                    mark.style.transition = 'none'
                    mark.style.transform = `translate(${dx}px, ${dy}px) scale(${s})`
                    void mark.offsetWidth
                    mark.style.transition = ''
                  }
                  setPhase((p) => p + ' handoff')
                  finish(G.swap)
                },
              })
              at(G.open, () => setPhase('in open'))
            } catch { classic() }
          })
        })
        .catch(fallback)
    }
    return () => {
      timers.forEach(clearTimeout)
      if (player) player.stop()
      html.classList.remove('bw-preloading')
      window.__lenis && window.__lenis.start()
    }
  }, [])

  if (gone) return null

  return (
    <div className={`pl ${phase}`} aria-hidden="true">
      <style>{`
        .pl { position:fixed; inset:0; z-index:200; display:flex; align-items:center; justify-content:center;
              pointer-events:auto; }
        .pl.reveal { pointer-events:none; }
        .pl-bg { position:absolute; inset:0; background:#fff; transition:opacity .6s ease; }
        .pl.reveal .pl-bg { opacity:0; }

        .pl-row { position:relative; display:flex; align-items:center; gap:.32em;
                  font-family:'Playfair Display',serif; font-style:italic; font-weight:500;
                  font-size:clamp(2.1rem,4.6vw,3.6rem); line-height:1; color:#141414; }
        .pl-clip { overflow:hidden; padding:.12em .06em; display:flex; }
        .pl-clip.l { justify-content:flex-end; }
        .pl-word { display:block; transition:transform .75s cubic-bezier(.3,0,0,1), opacity .5s ease, filter .5s ease; }
        .pl-clip.l .pl-word { transform:translateX(105%); }
        .pl-clip.r .pl-word { transform:translateX(-105%); }
        .pl.open .pl-word { transform:translateX(0); }
        .pl.reveal .pl-word { opacity:0; filter:blur(8px); }

        /* Outer box takes the flight, inner box the spin, so the two never
           fight over one transform. */
        .pl-mark { position:relative; height:1.02em; aspect-ratio:673/626; flex:none; color:#000;
                   transition:transform .95s cubic-bezier(.65,0,.35,1), color .6s ease; }
        /* Lands white when the header it flies into is sitting on the dark hero. */
        .pl-mark[data-land='white'] { color:#fff; }
        .pl-spin { position:absolute; inset:0; perspective:600px; opacity:0; }
        .pl-spin > span { width:100%; height:100%; }
        .pl.in .pl-spin { animation:pl-spin 1.25s cubic-bezier(.2,.75,.25,1) forwards; }
        /* Glass mode: the tile sits between the words; the mark waits hidden
           at the centre and takes over from the glass's last frame. */
        .pl-glass { position:absolute; left:50%; top:50%; width:var(--pl-g); height:var(--pl-g);
                    transform:translate(-50%,-50%); pointer-events:none;
                    /* Feather the edges so the drop's soft shadow never shows a square. */
                    -webkit-mask:linear-gradient(90deg,transparent,#000 9%,#000 91%,transparent),linear-gradient(transparent,#000 9%,#000 91%,transparent);
                    -webkit-mask-composite:source-in;
                    mask:linear-gradient(90deg,transparent,#000 9%,#000 91%,transparent),linear-gradient(transparent,#000 9%,#000 91%,transparent);
                    mask-composite:intersect; }
        .pl-row.glass { --pl-g:min(40vw, 40vh, 360px); }
        @media (max-width:599px) { .pl-row.glass { --pl-g:min(50vw, 40vh); } }
        .pl-gap { width:var(--pl-g); flex:none; }   /* the canvas is opaque white, so the words sit clear of it */
        /* The mark leaves the row and waits at its centre, invisible, until the
           glass lets go of the logo. */
        .pl-row.glass .pl-mark { position:absolute; left:50%; top:50%; margin:calc(-.51em) 0 0 calc(-.51em * 673 / 626);
                                 opacity:0; }
        .pl-row.glass .pl-spin { opacity:1; animation:none; }
        .pl.handoff .pl-row.glass .pl-mark { opacity:1; }
        .pl.handoff .pl-glass { visibility:hidden; }
        @keyframes pl-spin {
          0%   { opacity:0; transform:rotateY(-540deg) scale(.7); }
          25%  { opacity:1; }
          100% { opacity:1; transform:rotateY(0) scale(1); }
        }
      `}</style>
      <div className="pl-bg" />
      <div ref={rowRef} className={`pl-row${glass ? ' glass' : ''}`}>
        <span className="pl-clip l"><span className="pl-word">Black</span></span>
        {glass && <canvas ref={canvasRef} className="pl-glass" />}
        {glass && <span className="pl-gap" />}
        <span ref={markRef} className="pl-mark">
          <span className="pl-spin">
            <BrandMark />
          </span>
        </span>
        <span className="pl-clip r"><span className="pl-word">Water</span></span>
      </div>
    </div>
  )
}
