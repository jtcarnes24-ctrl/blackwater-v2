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

export function Preloader() {
  const [phase, setPhase] = useState('')
  const [gone, setGone] = useState(false)
  const markRef = useRef(null)

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
      const a = mark.getBoundingClientRect(), b = target.getBoundingClientRect()
      const s = b.width / a.width
      const dx = b.left + b.width / 2 - (a.left + a.width / 2)
      const dy = b.top + b.height / 2 - (a.top + a.height / 2)
      mark.style.transform = `translate(${dx}px, ${dy}px) scale(${s})`
      // Land in whatever colour the header is showing over the hero.
      const tone = document.querySelector('.hdr')?.getAttribute('data-tone')
      mark.setAttribute('data-land', tone === 'on-dark' ? 'white' : 'ink')
    }

    const timers = [
      setTimeout(() => setPhase('in'), T.in),
      setTimeout(() => setPhase('in open'), T.open),
      setTimeout(() => {
        setPhase('in open reveal')
        html.classList.add('site-ready')
        window.__lenis && window.__lenis.start()
      }, T.reveal),
      setTimeout(fly, T.fly),
      setTimeout(() => {
        html.classList.remove('bw-preloading')
        setGone(true)
      }, T.done),
    ]
    return () => {
      timers.forEach(clearTimeout)
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
        @keyframes pl-spin {
          0%   { opacity:0; transform:rotateY(-540deg) scale(.7); }
          25%  { opacity:1; }
          100% { opacity:1; transform:rotateY(0) scale(1); }
        }
      `}</style>
      <div className="pl-bg" />
      <div className="pl-row">
        <span className="pl-clip l"><span className="pl-word">Black</span></span>
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
