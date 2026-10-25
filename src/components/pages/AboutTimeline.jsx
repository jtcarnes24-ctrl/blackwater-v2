import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

/* /about/ (Oct 25 2026): "Your first 90 days", a horizontal timeline after
   the Hyperiux "Product Storyline" reference Jack sent. The section holds
   still (CSS sticky) while scrolling down slides the track sideways; the
   rail draws itself, and each step's stem, dot and copy rise in as the step
   crosses the screen (ScrollTrigger containerAnimation).

   Steps alternate above and below the rail. Copy is how an engagement runs,
   so it carries no dates, client names or results. */

const STEPS = [
  { when: 'Week 1',  title: 'Audit and tracking',
    line: 'We check your pixel, events and account structure, so every number after this can be trusted.' },
  { when: 'Week 2',  title: 'Strategy',
    line: 'We lock in your offer, the angles to test, who we are talking to, and the one action we want people to take.' },
  { when: 'Week 3',  title: 'First creative batch',
    line: 'The first round of ads gets made. Hooks written, UGC creators briefed.' },
  { when: 'Week 4',  title: 'Launch',
    line: 'Your testing campaign goes live, with budgets set from day one.' },
  { when: 'Month 2', title: 'Test every week',
    line: 'New ads go live weekly. Winners get more budget, and what stops working comes off.' },
  { when: 'Month 3', title: 'Scale',
    line: 'Proven ads get pushed harder, and the funnel and retention get tightened around them.' },
]

export function AboutTimeline() {
  const rootRef = useRef(null)
  const trackRef = useRef(null)

  useEffect(() => {
    const root = rootRef.current, track = trackRef.current
    if (!root || !track) return
    const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const ctx = gsap.context(() => {
      // How far the track has to travel: its full width less one screen.
      const travel = () => Math.max(0, track.scrollWidth - window.innerWidth)
      const slide = gsap.to(track, {
        x: () => -travel(),
        ease: 'none',
        scrollTrigger: {
          trigger: root,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 0.6,
          invalidateOnRefresh: true,
        },
      })

      if (still) {
        gsap.set(root.querySelectorAll('.tl-rail-line, .tl-stem'), { scale: 1 })
        gsap.set(root.querySelectorAll('.tl-dot'), { scale: 1 })
        gsap.set(root.querySelectorAll('.tl-rise'), { yPercent: 0 })
        return
      }

      // The rail draws itself just ahead of the steps.
      gsap.fromTo(root.querySelector('.tl-rail-line'), { scaleX: 0 }, {
        scaleX: 1, ease: 'none',
        scrollTrigger: {
          trigger: root.querySelector('.tl-rail'),
          containerAnimation: slide,
          start: 'left 85%',
          end: 'right 85%',
          scrub: true,
        },
      })

      root.querySelectorAll('.tl-step').forEach((step) => {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: step,
            containerAnimation: slide,
            start: 'left 80%',
            end: 'left 45%',
            scrub: true,
          },
        })
        tl.fromTo(step.querySelector('.tl-stem'), { scaleY: 0 }, { scaleY: 1, ease: 'none', duration: 0.4 })
          .fromTo(step.querySelector('.tl-dot'), { scale: 0 }, { scale: 1, ease: 'back.out(2)', duration: 0.25 }, 0.3)
          .fromTo(step.querySelectorAll('.tl-rise'), { yPercent: 110 },
            { yPercent: 0, ease: 'power2.out', duration: 0.6, stagger: 0.08 }, 0.15)
      })
    }, root)

    // A late webfont changes widths, which changes how far the track travels.
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => ScrollTrigger.refresh())
    return () => ctx.revert()
  }, [])

  return (
    // Overlaps the hero above by 2px and sits over it: the hero's scaled
    // video leaks one row of footage past its fractional bottom edge, which
    // shows as a hairline otherwise.
    <section ref={rootRef} className="tl" aria-labelledby="tl-title">
      <style>{`
        .tl { position:relative; z-index:1; margin-top:-2px; background:#080808; color:#fff; height:340svh; }
        .tl-stage { position:sticky; top:0; height:100svh; overflow:hidden; display:flex; align-items:center; }
        .tl-track { display:flex; align-items:center; height:min(72svh, 640px); will-change:transform;
                    padding:0 clamp(1.5rem,5vw,4rem); }

        .tl-intro { flex:0 0 auto; width:min(38vw, 520px); margin-right:clamp(3rem,7vw,7rem);
                    display:flex; flex-direction:column; justify-content:center; height:100%; }
        .tl-kicker { font-family:'Space Grotesk',sans-serif; font-size:.7rem; font-weight:600; letter-spacing:.3em;
                     text-transform:uppercase; color:rgba(255,255,255,.6); margin:0 0 1.5rem; }
        .tl-title { font-family:'Syne',sans-serif; font-weight:800; text-transform:uppercase; margin:0;
                    font-size:clamp(2.4rem,5.4vw,5.2rem); line-height:.95; letter-spacing:-.035em; }
        .tl-title .emph { display:block; text-transform:none; }
        .tl-sub { font-family:'Space Grotesk',sans-serif; font-size:clamp(1rem,1.3vw,1.12rem); line-height:1.65;
                  color:rgba(255,255,255,.7); margin:1.75rem 0 0; max-width:34ch; }

        .tl-rail { position:relative; flex:0 0 auto; height:100%; display:flex; padding-right:12vw; }
        .tl-axis { position:absolute; left:0; right:0; top:50%; height:1px; background:rgba(255,255,255,.12); }
        .tl-rail-line { position:absolute; left:0; right:0; top:50%; height:1px; background:#a9c3ec;
                        transform-origin:left center; }
        .tl-end { position:absolute; top:50%; width:9px; height:9px; margin-top:-4px; border-radius:50%; background:#a9c3ec; }
        .tl-end.l { left:-4px; } .tl-end.r { right:-4px; }

        .tl-step { position:relative; flex:0 0 auto; width:clamp(260px,24vw,380px); height:100%;
                   margin-right:clamp(2rem,4vw,4rem); }
        .tl-step:nth-child(even) { margin-left:calc(-1 * clamp(5rem,9vw,9rem)); }
        .tl-stem { position:absolute; left:0; width:1px; background:rgba(169,195,236,.7); }
        .tl-step.up .tl-stem { top:6%; bottom:50%; transform-origin:bottom; }
        .tl-step.down .tl-stem { top:50%; bottom:6%; transform-origin:top; }
        .tl-dot { position:absolute; left:-6px; width:13px; height:13px; border-radius:50%;
                  background:#fff; box-shadow:0 0 0 4px rgba(169,195,236,.18); }
        .tl-step.up .tl-dot { top:calc(6% - 6px); }
        .tl-step.down .tl-dot { bottom:calc(6% - 6px); }
        .tl-copy { position:absolute; left:clamp(1rem,1.6vw,1.6rem); right:0; }
        .tl-step.up .tl-copy { top:6%; }
        .tl-step.down .tl-copy { bottom:6%; }
        .tl-mask { overflow:hidden; }
        .tl-rise { display:block; will-change:transform; }
        .tl-when { font-family:'Space Grotesk',sans-serif; font-size:.7rem; font-weight:600; letter-spacing:.28em;
                   text-transform:uppercase; color:#a9c3ec; }
        .tl-name { font-family:'Syne',sans-serif; font-weight:800; text-transform:uppercase; letter-spacing:-.02em;
                   font-size:clamp(1.35rem,2.1vw,2rem); line-height:1.02; margin-top:.6rem; }
        .tl-line { font-family:'Space Grotesk',sans-serif; font-size:clamp(.92rem,1.05vw,1.02rem); line-height:1.6;
                   color:rgba(255,255,255,.68); margin-top:.8rem; max-width:32ch; }
        .tl-period { position:absolute; left:clamp(1.5rem,5vw,4rem); bottom:clamp(1.25rem,4vh,2.25rem); margin:0;
                     font-family:'Space Grotesk',sans-serif; font-size:.62rem; font-weight:600; letter-spacing:.28em;
                     text-transform:uppercase; color:rgba(255,255,255,.5); }

        @media (max-width:767px) {
          .tl { height:520svh; }
          .tl-track { height:78svh; }
          .tl-intro { width:82vw; margin-right:12vw; }
          .tl-step { width:72vw; margin-right:6vw; }
          .tl-step:nth-child(even) { margin-left:-30vw; }
          .tl-line { max-width:none; }
        }
      `}</style>

      <div className="tl-stage">
        <div className="tl-track" ref={trackRef}>
          <div className="tl-intro">
            <p className="tl-kicker">Working together</p>
            <h2 id="tl-title" className="tl-title">Your first <span className="emph">90 days.</span></h2>
            <p className="tl-sub">What happens after you sign, week by week. No handoffs, no guessing what comes next.</p>
          </div>

          <div className="tl-rail">
            <span className="tl-axis" aria-hidden="true" />
            <span className="tl-rail-line" aria-hidden="true" />
            <span className="tl-end l" aria-hidden="true" />
            <span className="tl-end r" aria-hidden="true" />
            <ol style={{ display: 'contents', listStyle: 'none', margin: 0, padding: 0 }}>
              {STEPS.map((s, i) => (
                <li key={s.when} className={`tl-step ${i % 2 ? 'down' : 'up'}`}>
                  <span className="tl-stem" aria-hidden="true" />
                  <span className="tl-dot" aria-hidden="true" />
                  <div className="tl-copy">
                    <div className="tl-mask"><span className="tl-rise tl-when">{s.when}</span></div>
                    <div className="tl-mask"><h3 className="tl-rise tl-name">{s.title}</h3></div>
                    <div className="tl-mask"><p className="tl-rise tl-line">{s.line}</p></div>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
        <p className="tl-period" aria-hidden="true">Week 1 to month 3</p>
      </div>
    </section>
  )
}
