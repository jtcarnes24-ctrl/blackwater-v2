import { useEffect, useState } from 'react'

/* Intro curtain, modelled on the one Jack liked at orza.io.

   Theirs is a serif-italic wordmark that slides up out of a clipped box with
   a coloured dot popping in beside it, then the curtain lifts and the page's
   own entrance animations run. Same idea here, using the site's existing
   Playfair italic and a cream wordmark on the brand black.

   The hero's entrance animations are held until this finishes, otherwise they
   play behind the curtain and the reader never sees them. That gate is the
   `site-ready` class on <html>, which the hero CSS keys off. */

const WORD = 'blackwater'
const HOLD = 1450   // ms the curtain stays up before lifting

export function Preloader() {
  const [lifting, setLifting] = useState(false)
  const [gone, setGone] = useState(false)

  useEffect(() => {
    // The static splash has done its job once this component is painting.
    const splash = document.getElementById('boot-splash')
    if (splash) splash.remove()

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    // Someone who asked for less motion should not be made to wait behind a
    // curtain, so it is skipped entirely rather than merely shortened.
    if (reduce) {
      document.documentElement.classList.add('site-ready')
      setGone(true)
      return
    }
    // Lenis owns scrolling, so body overflow does nothing here. This is the
    // same stop/start the apply modal uses.
    window.__lenis && window.__lenis.stop()
    const lift = setTimeout(() => setLifting(true), HOLD)
    const done = setTimeout(() => {
      setGone(true)
      window.__lenis && window.__lenis.start()
      document.documentElement.classList.add('site-ready')
    }, HOLD + 750)
    return () => {
      clearTimeout(lift)
      clearTimeout(done)
      window.__lenis && window.__lenis.start()
    }
  }, [])

  if (gone) return null

  return (
    <div className={`preloader${lifting ? ' is-lifting' : ''}`} aria-hidden="true">
      <style>{`
        .preloader {
          position: fixed; inset: 0; z-index: 200;
          background: #000000;
          display: flex; align-items: center; justify-content: center;
          transition: transform 0.75s cubic-bezier(0.76, 0, 0.24, 1),
                      opacity 0.55s ease 0.2s;
        }
        .preloader.is-lifting { transform: translateY(-100%); opacity: 0; }

        /* Clips the wordmark so it rises out of nothing rather than sliding
           across the screen. */
        .preloader-inner {
          display: flex; align-items: baseline; gap: 8px;
          overflow: hidden; padding-bottom: 0.12em;
        }
        .preloader-word {
          font-family: 'Playfair Display', serif;
          font-style: italic; font-weight: 500;
          font-size: clamp(40px, 7vw, 78px);
          color: #f2f0ec; letter-spacing: -0.01em;
          display: inline-block;
          transform: translateY(110%);
          animation: pre-rise 0.85s cubic-bezier(0.22, 1, 0.36, 1) 0.12s forwards;
        }
        .preloader-dot {
          width: clamp(9px, 1.3vw, 14px); height: clamp(9px, 1.3vw, 14px);
          border-radius: 50%; background: #f2f0ec;
          transform: scale(0);
          animation: pre-pop 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) 0.72s forwards;
        }
        @keyframes pre-rise { to { transform: translateY(0); } }
        @keyframes pre-pop  { to { transform: scale(1); } }
      `}</style>
      <div className="preloader-inner">
        <span className="preloader-word">{WORD}</span>
        <span className="preloader-dot" />
      </div>
    </div>
  )
}

export default Preloader
