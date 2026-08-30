import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

/**
 * Scroll-scrubbed video hero.
 *
 * The section pins and scroll position drives the clip's currentTime, so the
 * wave breaks at exactly the rate the visitor scrolls. The reference this is
 * modelled on scrubs a canvas image sequence; a small, densely-decodable video
 * gets the same read at a fraction of the weight.
 *
 * Source clip must seek in under ~16ms or the scrub stutters. The 4K original
 * averaged 248ms; transcoded to 720p it averages 10ms.
 *
 * Palette is locked to the brand: the footage is desaturated so only black,
 * white and grey reach the screen, with type in Syne and Playfair over it.
 */
export function ScrollVideoHero({ kicker, title, emph, sub }) {
  const rootRef = useRef(null)
  const videoRef = useRef(null)
  const [src, setSrc] = useState(null)

  // Pick the source before first paint so the browser only ever fetches one.
  useEffect(() => {
    const small = window.matchMedia('(max-width: 900px)').matches
    setSrc(small ? '/wave-540.mp4' : '/wave-720.mp4')
  }, [])

  useEffect(() => {
    const root = rootRef.current
    const video = videoRef.current
    if (!root || !video || !src) return

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const canPin = window.matchMedia('(min-width: 900px)').matches

    // The pin is created on mount, never inside a media event. Creating a pin
    // late changes document height and leaves every trigger below it measuring
    // stale offsets, which renders the pinned section off-screen entirely.
    // ONE pinned timeline drives everything. Separate triggers using
    // percentage starts ('28% top') resolve against the TRIGGER ELEMENT's
    // height, not the pin distance, so they desynchronised from the pin.
    // Positions below are fractions of the pinned scroll range.
    //
    // refreshPriority orders re-measurement top-of-document first. Without it
    // the section below measured its start offset before this pin added its
    // spacer, and pinned itself while still off-screen — two pinned sections
    // rendering over each other.
    const ctx = gsap.context(() => {
      const state = { p: 0 }

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: root,
          start: 'top top',
          end: canPin ? '+=1700' : 'bottom top',
          scrub: 0.35,
          pin: canPin,
          anticipatePin: canPin ? 1 : 0,
          refreshPriority: 2,
        },
      })

      // Playback and zoom run the whole range, locked together.
      tl.to(state, {
        p: 1, duration: 1, ease: 'none',
        onUpdate: () => {
          const d = video.duration
          if (!d || Number.isNaN(d)) return
          if (video.readyState >= 2 && !video.seeking) {
            video.currentTime = Math.min(state.p * d, d - 0.05)
          }
        },
      }, 0)

      tl.fromTo(video,
        { scale: 1 },
        { scale: 1.28, duration: 1, ease: 'none', transformOrigin: '50% 55%' },
        0)

      // Copy clears the screen well before the veil closes.
      tl.to(root.querySelector('.svh-copy'),
        { opacity: 0, y: -50, duration: 0.3, ease: 'none' }, 0.18)

      // Solid black by 0.9 of the range, i.e. before the pin releases.
      // Ends at exactly 1.0 so the pin releases the instant it turns solid —
      // no tail of dead black to scroll through.
      tl.to(root.querySelector('.svh-fade'),
        { opacity: 1, duration: 0.35, ease: 'none' }, 0.65)
    }, root)

    const refresh = () => ScrollTrigger.refresh()
    video.addEventListener('loadedmetadata', refresh, { once: true })
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(refresh)

    return () => {
      video.removeEventListener('loadedmetadata', refresh)
      ctx.revert()
    }
  }, [src])

  return (
    <section ref={rootRef} className="svh" aria-label={`${title} ${emph}`}>
      <style>{`
        .svh { position:relative; min-height:100dvh; overflow:hidden; background:#080808; }
        .svh-video { position:absolute; inset:0; width:100%; height:100%; object-fit:cover; z-index:0;
                     /* Locks the footage to the black-and-white brand palette. */
                     filter:grayscale(1) contrast(1.12) brightness(.92);
                     will-change:transform; }
        /* Neutral scrim only — no colour is introduced anywhere. */
        .svh-scrim { position:absolute; inset:0; z-index:1; pointer-events:none;
                     background:linear-gradient(180deg, rgba(8,8,8,.72) 0%, rgba(8,8,8,.30) 38%, rgba(8,8,8,.55) 78%, rgba(8,8,8,.88) 100%); }
        .svh-fade  { position:absolute; inset:0; z-index:3; pointer-events:none; opacity:0; background:#080808; }
        .svh-copy { position:relative; z-index:2; min-height:100dvh; display:flex; flex-direction:column;
                    justify-content:center; padding: clamp(7rem,12vw,9rem) clamp(1.5rem,5vw,4rem);
                    max-width:1240px; margin:0 auto; will-change:opacity, transform; }
        .svh-kicker { font-family:'Space Grotesk',sans-serif; font-size:.7rem; font-weight:600;
                      letter-spacing:.3em; text-transform:uppercase; color:rgba(255,255,255,.6); margin:0 0 1.5rem; }
        .svh-title { font-family:'Syne',sans-serif; font-weight:800; text-transform:uppercase;
                     font-size:clamp(2.6rem,8vw,7rem); line-height:.95; letter-spacing:-.035em;
                     color:#ffffff; margin:0; max-width:14ch;
                     text-shadow:0 2px 40px rgba(8,8,8,.6); }
        .svh-sub { font-family:'Space Grotesk',sans-serif; font-size:clamp(1rem,1.5vw,1.15rem);
                   line-height:1.65; color:rgba(255,255,255,.75); margin:2rem 0 0; max-width:42ch; }
      `}</style>

      {src && (
        <video
          ref={videoRef}
          className="svh-video"
          src={src}
          muted
          playsInline
          preload="auto"
          aria-hidden="true"
          tabIndex={-1}
        />
      )}
      <div className="svh-scrim" aria-hidden="true" />

      <div className="svh-copy">
        {kicker && <p className="svh-kicker">{kicker}</p>}
        <h1 className="svh-title">
          {title} <span className="emph">{emph}</span>
        </h1>
        {sub && <p className="svh-sub">{sub}</p>}
      </div>

      <div className="svh-fade" aria-hidden="true" />
    </section>
  )
}
